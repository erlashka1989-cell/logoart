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

function requireTempDir() {
  return process.env.TEMP || process.env.TMP || ".";
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});

  try {
    if (req.url === "/health") {
      return json(res, 200, {
        connected: true,
        folder: PHOTO_FOLDER,
        corel: await corelRunning()
      });
    }

    if (req.url === "/layouts") {
      const layouts = JSON.parse(fs.readFileSync(LAYOUTS_FILE, "utf8"));
      return json(res, 200, layouts);
    }

    if (req.url === "/photos") {
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
