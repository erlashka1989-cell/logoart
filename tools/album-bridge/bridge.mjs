import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";\nimport { fileURLToPath } from "node:url";

const PORT = 17321;
const PHOTO_FOLDER = "C:\\Ерлан\\Работы Ерлана\\Свадебный альбом\\photo рест";
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);\nconst BRIDGE_ROOT = path.dirname(fileURLToPath(import.meta.url));\nconst LAYOUTS_FILE = path.join(BRIDGE_ROOT, "layouts.json");\nconst CREATE_SCRIPT = path.join(BRIDGE_ROOT, "create-album.ps1");

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

function readBody(req) {\n  return new Promise((resolve, reject) => {\n    let body = "";\n    req.setEncoding("utf8");\n    req.on("data", (chunk) => { body += chunk; if (body.length > 5_000_000) reject(new Error("Request too large")); });\n    req.on("end", () => resolve(body));\n    req.on("error", reject);\n  });\n}\n\nfunction corelRunning() {
  return new Promise((resolve) => {
    execFile("tasklist", ["/FI", "IMAGENAME eq CorelDRW.exe"], { windowsHide: true }, (error, stdout) => {
      resolve(!error && /CorelDRW\.exe/i.test(stdout));
    });
  });
}

function requireTempDir() {\n  return process.env.TEMP || process.env.TMP || ".";\n}\n\nconst server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});

  try {
    if (req.url === "/health") {
      return json(res, 200, {
        connected: true,
        folder: PHOTO_FOLDER,
        corel: await corelRunning()
      });
    }

    if (req.url === "/layouts") {\n      const layouts = JSON.parse(fs.readFileSync(LAYOUTS_FILE, "utf8"));\n      return json(res, 200, layouts);\n    }\n\n    if (req.url === "/photos") {
      if (!fs.existsSync(PHOTO_FOLDER)) return json(res, 404, { error: "Photo folder not found" });

      const photos = fs.readdirSync(PHOTO_FOLDER, { withFileTypes: true })
        .filter((x) => x.isFile() && ALLOWED.has(path.extname(x.name).toLowerCase()))
        .map((x) => ({
          name: x.name,
          path: safeFile(x.name),
          url: "http://127.0.0.1:" + PORT + "/photo/" + encodeURIComponent(x.name),
          size: fs.statSync(path.join(PHOTO_FOLDER, x.name)).size
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "ru"));

      return json(res, 200, { photos });
    }

    if (req.method === "POST" && req.url === "/create-album") {\n      const body = await readBody(req);\n      const plan = JSON.parse(body);\n      if (!Array.isArray(plan.spreads) || plan.spreads.length !== 10) {\n        return json(res, 400, { error: "Plan must contain exactly 10 spreads" });\n      }\n\n      const root = path.resolve(PHOTO_FOLDER);\n      for (const spread of plan.spreads) {\n        if (!Array.isArray(spread.slots)) return json(res, 400, { error: "Invalid spread slots" });\n        for (const slot of spread.slots) {\n          const file = path.resolve(String(slot.photoPath || ""));\n          if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {\n            return json(res, 400, { error: "Photo is outside the allowed folder or missing: " + file });\n          }\n        }\n      }\n\n      const planFile = path.join(requireTempDir(), "logoart-album-" + Date.now() + ".json");\n      fs.writeFileSync(planFile, JSON.stringify(plan, null, 2), "utf8");\n\n      execFile("powershell.exe", [\n        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", CREATE_SCRIPT, "-PlanFile", planFile\n      ], { windowsHide: false, maxBuffer: 1024 * 1024 * 4 }, (error, stdout, stderr) => {\n        try { fs.unlinkSync(planFile); } catch {}\n        if (error) console.error("Album creation error:", stderr || error.message);\n        else console.log(stdout.trim());\n      });\n\n      return json(res, 202, { started: true, message: "CorelDRAW album creation started" });\n    }\n\n    if (req.url?.startsWith("/photo/")) {
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
