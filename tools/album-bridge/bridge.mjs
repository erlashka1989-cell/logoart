import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";

const PORT = 17321;
const PHOTO_FOLDER = "C:\\Ерлан\\Работы Ерлана\\Свадебный альбом\\photo рест";
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(body));
}

function safeFile(name) {
  const root = path.resolve(PHOTO_FOLDER);
  const full = path.resolve(root, name);
  return full.startsWith(root + path.sep) ? full : null;
}

function corelRunning() {
  return new Promise((resolve) => {
    execFile("tasklist", ["/FI", "IMAGENAME eq CorelDRW.exe"], { windowsHide: true }, (error, stdout) => {
      resolve(!error && /CorelDRW\.exe/i.test(stdout));
    });
  });
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
