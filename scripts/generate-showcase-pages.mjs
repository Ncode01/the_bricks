#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PROJECTS, BRICKS_COLORS } from "./bricks-content-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "lusion.co", "lusion.co");
const SHOWCASE_ROOT = path.join(SITE, "showcase");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colorFor(index) {
  return BRICKS_COLORS[index % BRICKS_COLORS.length];
}

function cardTitle(project) {
  return project.cardTitle || project.title;
}

function summary(project) {
  return project.description || cardTitle(project);
}

function firstVideoId(project) {
  const first = project.videoUrls?.[0] || "";
  const match = first.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([^?&/]+)/i);
  return match ? match[1] : "";
}

function pageFor(project, index) {
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const colors = colorFor(index);
  const videoId = firstVideoId(project);
  const mediaBlock = videoId
    ? `<div class="showcase-media-frame" style="background-image:url('https://img.youtube.com/vi/${escapeHtml(videoId)}/maxresdefault.jpg'), url('https://img.youtube.com/vi/${escapeHtml(videoId)}/hqdefault.jpg');"></div>`
    : `<div class="showcase-media-frame" style="background: radial-gradient(circle at top, rgba(203, 148, 247, 0.35), transparent 40%), linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02));"></div>`;

  const services = (project.services || [])
    .map((service) => `<span class="showcase-chip">${escapeHtml(service)}</span>`)
    .join("");
  const credits = (project.credits || [])
    .map((credit) => `<div>${escapeHtml(credit)}</div>`)
    .join("");
  const links = (project.videoUrls || []).length
    ? `<a class="showcase-button showcase-button-primary" href="${escapeHtml(project.videoUrls[0])}" target="_blank" rel="noopener noreferrer">Watch Video</a>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(cardTitle(project))} | The Bricks</title>
    <meta name="description" content="${escapeHtml(summary(project))}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/_astro/project-showcase.css?v=20260625showcase1" />
  </head>
  <body style="--project-bg:${escapeHtml(colors.bg)};--project-text:${escapeHtml(colors.text)};--showcase-accent:#cb94f7;">
    <div class="showcase-shell">
      <header class="showcase-header">
        <a class="showcase-brand" href="/" aria-label="Go to home page">
          <img src="/assets/images/bricks-logo-horizontal.png" alt="The Bricks" width="274" height="100" />
        </a>
        <button class="showcase-menu-toggle" type="button" aria-expanded="false" aria-label="Toggle menu">Menu</button>
        <nav class="showcase-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/about/">About Us</a>
          <a href="/projects/">Projects</a>
          <a href="mailto:hello@thebricks.lk">Contact</a>
        </nav>
      </header>
      <main>
        <section class="showcase-grid">
          <article class="showcase-panel showcase-hero">
            <a class="showcase-back" href="/projects/">Back to Projects</a>
            <div class="showcase-kicker">Standalone Project Page</div>
            <h1 class="showcase-title">${escapeHtml(cardTitle(project))}</h1>
            <p class="showcase-summary">${escapeHtml(summary(project))}</p>
            <div class="showcase-chip-row">${services}</div>
            <div class="showcase-actions">
              ${links}
              <a class="showcase-button showcase-button-secondary" href="/projects/">All Projects</a>
            </div>
          </article>
          <aside class="showcase-panel showcase-media">
            ${mediaBlock}
          </aside>
        </section>
        <section class="showcase-content">
          <article class="showcase-panel showcase-copy">
            <p>${escapeHtml(project.description || "")}</p>
          </article>
          <aside class="showcase-side">
            <div class="showcase-card">
              <h2>Services</h2>
              <div class="showcase-list">${(project.services || []).map((service) => `<div>${escapeHtml(service)}</div>`).join("")}</div>
            </div>
            <div class="showcase-card">
              <h2>Credits</h2>
              <div class="showcase-list">${credits}</div>
            </div>
            <div class="showcase-card">
              <h2>Category</h2>
              <div class="showcase-list"><div>${escapeHtml(project.category || "")}</div></div>
            </div>
          </aside>
        </section>
        <section class="showcase-next">
          <div class="showcase-next-label">Next Project</div>
          <a class="showcase-next-title" href="/showcase/${escapeHtml(next.slug)}/">${escapeHtml(cardTitle(next))}</a>
        </section>
      </main>
    </div>
    <script src="/_astro/project-showcase.js?v=20260625showcase1"></script>
  </body>
</html>
`;
}

fs.mkdirSync(SHOWCASE_ROOT, { recursive: true });
PROJECTS.forEach((project, index) => {
  const dir = path.join(SHOWCASE_ROOT, project.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageFor(project, index), "utf8");
});

console.log(`Generated ${PROJECTS.length} showcase page(s).`);
