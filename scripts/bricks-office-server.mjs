#!/usr/bin/env node
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "lusion.co", "lusion.co");
const SOURCE_PATH = path.join(__dirname, "bricks-content-source.json");
const PORT = Number(process.env.BRICKS_PORT || 5500);

const OFFICE_PASSWORD = "bricks-office-mvp-2026";
const tokens = new Set();

function runNodeScript(scriptName) {
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptName)], {
    cwd: __dirname,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `${scriptName} failed`);
  }
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !tokens.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

const app = express();
app.use(express.json({ limit: "8mb" }));

app.get("/api/office/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/office/login", (req, res) => {
  if ((req.body?.password || "") !== OFFICE_PASSWORD) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }

  const token = crypto.randomBytes(24).toString("hex");
  tokens.add(token);
  res.json({ token });
});

app.get("/api/office/content", requireAuth, (_req, res) => {
  res.type("application/json").send(fs.readFileSync(SOURCE_PATH, "utf8"));
});

app.post("/api/office/content", requireAuth, (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object") {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  fs.writeFileSync(SOURCE_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");

  try {
    runNodeScript("generate-bricks-content-data.mjs");
    runNodeScript("apply-bricks-content-update.mjs");
    runNodeScript("generate-showcase-pages.mjs");
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
    return;
  }

  res.json({ ok: true, message: "Content saved and site regenerated." });
});

app.get("/office", (_req, res) => {
  res.sendFile(path.join(SITE, "office", "index.html"));
});
app.get("/office/", (_req, res) => {
  res.sendFile(path.join(SITE, "office", "index.html"));
});
app.get("/office/office.css", (_req, res) => {
  res.sendFile(path.join(SITE, "office", "office.css"));
});
app.get("/office/office.js", (_req, res) => {
  res.sendFile(path.join(SITE, "office", "office.js"));
});

app.use(
  "/office/vendor",
  express.static(path.join(__dirname, "node_modules", "@tabler", "core", "dist"))
);
app.use(express.static(SITE, { extensions: ["html"], redirect: false }));

app.listen(PORT, () => {
  console.log(`Serving site from: ${SITE}`);
  console.log(`URL: http://localhost:${PORT}/`);
  console.log(`Office: http://localhost:${PORT}/office/`);
});
