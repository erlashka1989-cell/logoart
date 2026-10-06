import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const PORT = 17321;
const PHOTO_FOLDER = "C:\\Ерлан\\Работы Ерлана\\Свадебный альбом\\photo рест";
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const BRIDGE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const LAYOUTS_FILE = path.join(BRIDGE_ROOT, "layouts.json");
const CREATE_SCRIPT = path.join(BRIDGE_ROOT, "create-album.ps1");

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(body));
}

function safeFile(name) {
  const root = path.resolve(PHOTO_FOLDER);
  const full = path.resolve(root, name);
  return full.startsWith(root + path.sep) ? full : null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => { body += chunk; if (body.length > 5_000_000) reject(new Error("Request too large")); });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function corelRunning() {
  return new Promise((resolve) => {
    execFile("tasklist", ["/FI", "IMAGENAME eq CorelDRW.exe"], { windowsHide: true }, (error, stdout) => {
      resolve(!error && /CorelDRW\.exe/i.test(stdout));
    });
  });
}

async function ollamaGenerate(prompt, images = []) {
  const model = process.env.OLLAMA_VISION_MODEL || "qwen2.5vl:7b";
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      images,
      stream: false,
      format: "json",
      options: { temperature: 0.1 }
    })
  });
  if (!response.ok) throw new Error("Ollama error: " + await response.text());
  const data = await response.json();
  return JSON.parse(data.response);
}

function imageBase64(file) {
  return fs.readFileSync(file).toString("base64");
}

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

async function analyzePhotoBatch(batch) {
  const prompt = [
    "Ты профессиональный редактор свадебного фотоальбома.",
    "Проанализируй изображения. Верни только JSON без markdown.",
    "Для каждого изображения укажи точное имя файла из списка.",
    "Оцени: quality 0-100, composition 0-100, weddingValue 0-100.",
    "Определи scene: preparation, ceremony, portrait, couple, walking, guests, details, party, architecture, other.",
    "Определи orientation: landscape, portrait, square.",
    "duplicateGroup — одинаковый/почти одинаковый кадр получает одинаковый короткий идентификатор.",
    "hero=true только для действительно сильных кадров.",
    "Не придумывай людей, события или имена.",
    \'Формат: {"photos":[{"name":"file.jpg","quality":90,"composition":88,"weddingValue":95,"scene":"couple","orientation":"landscape","duplicateGroup":"g1","hero":true}]}\',
    "",
    "ФАЙЛЫ:"
  ].concat(batch.map((p, i) => (i + 1) + ". " + p.name)).join("\n");

  return ollamaGenerate(prompt, batch.map((p) => p.image));
}

async function buildAiAlbumPlan(allPhotos) {
  if (allPhotos.length < 26) {
    throw new Error("Нужно минимум 26 фотографий для 10 разворотов без повторов. Сейчас: " + allPhotos.length);
  }

  const analyses = [];
  for (const batch of chunk(allPhotos, 12)) {
    const result = await analyzePhotoBatch(batch);
    if (Array.isArray(result.photos)) analyses.push(...result.photos);
  }

  const byName = new Map(allPhotos.map((p) => [p.name, p]));
  const clean = analyses
    .filter((p) => byName.has(p.name))
    .map((p) => ({
      ...p,
      quality: Number(p.quality) || 0,
      composition: Number(p.composition) || 0,
      weddingValue: Number(p.weddingValue) || 0
    }))
    .sort((a, b) =>
      (b.weddingValue + b.quality + b.composition) -
      (a.weddingValue + a.quality + a.composition)
    );

  const unique = [];
  const groups = new Set();
  for (const p of clean) {
    const key = p.duplicateGroup || p.name;
    if (groups.has(key)) continue;
    groups.add(key);
    unique.push(p);
  }

  const fallback = allPhotos.map((p) => ({
    name: p.name,
    quality: 50,
    composition: 50,
    weddingValue: 50,
    scene: "other",
    orientation: "landscape",
    duplicateGroup: p.name,
    hero: false
  }));

  const candidates = unique.length >= 26 ? unique : fallback;
  const layouts = [
    { layoutId: 1, count: 1 },
    { layoutId: 2, count: 2 },
    { layoutId: 3, count: 3 },
    { layoutId: 4, count: 3 },
    { layoutId: 5, count: 3 },
    { layoutId: 6, count: 5 },
    { layoutId: 7, count: 3 },
    { layoutId: 8, count: 4 },
    { layoutId: 9, count: 1 },
    { layoutId: 10, count: 1 }
  ];

  const selected = [];
  const used = new Set();
  const take = (preferredScenes, count) => {
    const result = [];
    for (const p of candidates) {
      if (used.has(p.name)) continue;
      if (preferredScenes.includes(p.scene)) {
        used.add(p.name);
        result.push(p);
        if (result.length === count) return result;
      }
    }
    for (const p of candidates) {
      if (used.has(p.name)) continue;
      used.add(p.name);
      result.push(p);
      if (result.length === count) break;
    }
    return result;
  };

  const spreads = layouts.map((layout, index) => {
    const preferred = [
      [ "architecture", "couple", "walking" ],
      [ "couple", "portrait", "walking" ],
      [ "ceremony", "couple", "guests" ],
      [ "walking", "architecture", "couple" ],
      [ "portrait", "couple", "details" ],
      [ "guests", "details", "party" ],
      [ "portrait", "couple" ],
      [ "ceremony", "guests", "couple" ],
      [ "details", "portrait" ],
      [ "couple", "architecture" ]
    ][index];
    const picked = take(preferred, layout.count);
    selected.push(...picked);
    return {
      layoutId: layout.layoutId,
      photos: picked.map((p) => p.name),
      scenes: picked.map((p) => p.scene)
    };
  });

  return {
    spreads,
    selectedCount: selected.length,
    analyzedCount: analyses.length,
    model: process.env.OLLAMA_VISION_MODEL || "qwen2.5vl:7b"
  };
}

function requireTempDir() {
  return process.env.TEMP || process.env.TMP || ".";
}

    if (req.method === "POST" && req.url === "/ai-plan") {
      const body = await readBody(req);
      const input = JSON.parse(body);
      const requested = Array.isArray(input.photos) ? input.photos : [];
      const root = path.resolve(PHOTO_FOLDER);
      const allPhotos = requested.map((p) => {
        const file = path.resolve(String(p.path || ""));
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
          throw new Error("Invalid photo path: " + file);
        }
        return { name: path.basename(file), path: file, image: imageBase64(file) };
      });
      const result = await buildAiAlbumPlan(allPhotos);
      return json(res, 200, {
        model: result.model,
        analyzedCount: result.analyzedCount,
        selectedCount: result.selectedCount,
        plan: { spreads: result.spreads }
      });
    }

    if (req.method === "POST" && req.url === "/create-album") {
      const body = await readBody(req);
      const plan = JSON.parse(body);
      if (!Array.isArray(plan.spreads) || plan.spreads.length !== 10) {
        return json(res, 400, { error: "Plan must contain exactly 10 spreads" });
      }

      const root = path.resolve(PHOTO_FOLDER);
      for (const spread of plan.spreads) {
        if (!Array.isArray(spread.slots)) return json(res, 400, { error: "Invalid spread slots" });
        for (const slot of spread.slots) {
          const file = path.resolve(String(slot.photoPath || ""));
          if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
            return json(res, 400, { error: "Photo is outside the allowed folder or missing: " + file });
          }
        }
      }

      const planFile = path.join(requireTempDir(), "logoart-album-" + Date.now() + ".json");
      fs.writeFileSync(planFile, JSON.stringify(plan, null, 2), "utf8");

      execFile("powershell.exe", [
        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", CREATE_SCRIPT, "-PlanFile", planFile
      ], { windowsHide: false, maxBuffer: 1024 * 1024 * 4 }, (error, stdout, stderr) => {
        try { fs.unlinkSync(planFile); } catch {}
        if (error) console.error("Album creation error:", stderr || error.message);
        else console.log(stdout.trim());
      });

      return json(res, 202, { started: true, message: "CorelDRAW album creation started" });
    }

    if (req.url?.startsWith("/photo/")) {
      const name = decodeURIComponent(req.url.slice("/photo/".length));
      const file = safeFile(name);
      if (!file || !fs.existsSync(file)) return json(res, 404, { error: "Photo not found" });

      const ext = path.extname(file).toLowerCase();
      const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      res.writeHead(200, { "Content-Type": type, "Access-Control-Allow-Origin": "*" });
      fs.createReadStream(file).pipe(res);
      return;
    }

    return json(res, 404, { error: "Not found" });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("LogoART Album Bridge: http://127.0.0.1:" + PORT);
  console.log("Photo folder: " + PHOTO_FOLDER);
});
