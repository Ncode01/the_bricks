#!/usr/bin/env node
/**
 * Idempotent content update for The Bricks static site.
 * Run: node scripts/apply-bricks-content-update.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  SITE_DESCRIPTION,
  BRICKS_COLORS,
  LEGACY_ASSET_IDS,
  TEAM,
  PROJECTS,
  servicesTag,
  escapeHtml,
} from "./bricks-content-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "lusion.co", "lusion.co");
const JS_PATH = path.join(SITE, "_astro", "hoisted.CJiXW_YI.js");

const changed = [];

function writeIfChanged(filePath, content) {
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
  if (prev === content) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  changed.push(path.relative(ROOT, filePath));
  return true;
}

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, "utf8");
  let updated = text;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }
  if (updated !== text) {
    fs.writeFileSync(filePath, updated, "utf8");
    changed.push(path.relative(ROOT, filePath));
  }
}

function replaceBetween(html, startMarker, endMarker, newInner) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Markers not found: ${startMarker}`);
  }
  return html.slice(0, start + startMarker.length) + newInner + html.slice(end);
}

function projectCard(project, index) {
  const c = BRICKS_COLORS[index % BRICKS_COLORS.length];
  const title = project.cardTitle || project.title;
  const tag = servicesTag(project.services);
  return `<a
                  class="project-item project-type-website"
                  href="/projects/${project.slug}"
                  data-id="${project.slug}"
                   data-color-bg="${c.bg}" data-color-text="${c.text}"
                  data-color-shadow="${c.shadow}"
                >
                  <div class="project-item-main">
                    <div class="project-item-image"></div>
                  </div>
                  <div class="project-item-footer">
                    <div class="project-item-line-1">
                      ${escapeHtml(tag)}
                    </div>
                    <div class="project-item-line-2">
                      <div class="project-item-line-2-icon"></div>
                      <div class="project-item-line-2-inner">${escapeHtml(title)}</div>
                    </div>
                  </div> </a>`;
}

function detailColors(index) {
  const c = BRICKS_COLORS[index % BRICKS_COLORS.length];
  return {
    bg: c.bg,
    text: c.text,
    shadow: c.shadow,
    highlight: c.text === "#0a0810" ? "#A76EEE" : "#CB94F7",
    btnBg: c.text,
    btnText: c.bg,
    btnBgHover: "#A76EEE",
    btnTextHover: "#E2E1FC",
    iconBg: "#A76EEE",
    iconColor: "#E2E1FC",
  };
}

function linkItems(urls) {
  if (!urls.length) return "";
  return urls
    .map((url, i) => {
      const label = urls.length > 1 ? `Watch video ${i + 1}` : "Watch video";
      return `<a class="project-details-side-list-item" href="${url}" target="_blank" data-link-type="regular">${label}</a> <br>`;
    })
    .join("  ");
}

function creditsParagraph(credits) {
  return `<p><strong>Credits</strong><br>${credits.map((c) => escapeHtml(c)).join("<br>")}</p>`;
}

function generateProjectDetailPage(project, index) {
  const colors = detailColors(index);
  const assetId = LEGACY_ASSET_IDS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const nextColors = detailColors((index + 1) % PROJECTS.length);
  const ctaBlock = `<a id="project-details-launch-cta" href="" data-link-type="regular">
                      <span id="project-details-launch-cta-dot"></span>
                      <p id="project-details-launch-cta-text"></p>
                      <span id="project-details-launch-cta-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9 9h6m0 0v6m0-6-6 6"></path>
                        </svg>
                      </span>
                    </a>`;
  const mobileCta = `<a id="project-details-launch-cta-mobile" href="" data-link-type="regular">
                      <span id="project-details-launch-cta-mobile-dot"></span>
                      <p id="project-details-launch-cta-mobile-text"></p>
                      <span id="project-details-launch-cta-mobile-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9 9h6m0 0v6m0-6-6 6"></path>
                        </svg>
                      </span>
                    </a>`;

  const serviceItems = project.services
    .map((s) => `<div class="project-details-side-list-item">${escapeHtml(s)}</div>`)
    .join("");
  const linksBlock = project.videoUrls.length
    ? `<div id="project-details-side-list-links">
                      <h4 class="project-details-side-list-title">Links</h4>
                      ${linkItems(project.videoUrls)}
                    </div>`
    : `<div id="project-details-side-list-links">
                      <h4 class="project-details-side-list-title">Links</h4>
                    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${escapeHtml(project.title)} — The Bricks</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="/" />
    <meta name="description" content="${escapeHtml(SITE_DESCRIPTION)}" />
    <link rel="stylesheet" href="/_astro/about.CNa9RfUh.css?v=20260518cdn" />
    <link rel="stylesheet" href="/_astro/the-bricks-theme.css?v=20260610logo1" />
  </head>
  <body>
    <div id="page-container">
      <div id="page-container-inner">
        <div id="project" class="page">
          <div id="project-details" class="section" style="background-color:${colors.bg}" data-shadow="${colors.shadow}" data-color-bg="${colors.bg}" data-color-highlight="${colors.highlight}" data-color-btn-bg="${colors.btnBg}" data-color-btn-text="${colors.btnText}" data-color-icon-bg="${colors.iconBg}" data-color-icon-color="${colors.iconColor}" data-color-text="${colors.text}" data-color-btn-bg-hover="${colors.btnBgHover}" data-color-btn-text-hover="${colors.btnTextHover}">
            <div id="project-details-header-info">
              <span>scroll to explore</span>
              <svg id="project-details-header-info-svg" viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4855 8.36453L8.65707 5.53612C8.26655 5.14559 8.26655 4.51243 8.65707 4.1219C9.04759 3.73138 9.68076 3.73138 10.0713 4.1219L13.596 7.64661C13.5996 7.65016 13.6033 7.65373 13.6069 7.65734C13.9585 8.00898 13.9935 8.55734 13.7119 8.94816C13.6808 8.99141 13.6457 9.03274 13.6068 9.07165C13.6054 9.07311 13.6039 9.07456 13.6024 9.076L10.0714 12.6071C9.68083 12.9976 9.04766 12.9976 8.65714 12.6071C8.26661 12.2166 8.26661 11.5834 8.65714 11.1929L11.4855 8.36453Z"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.48548 8.36477L2.65707 5.53636C2.26655 5.14584 2.26655 4.51267 2.65707 4.12215C3.04759 3.73162 3.68076 3.73162 4.07128 4.12215L7.596 7.64686C7.59965 7.6504 7.60328 7.65398 7.60688 7.65759C7.95852 8.00922 7.99354 8.55759 7.71193 8.9484C7.68077 8.99166 7.64573 9.03298 7.60682 9.07189C7.60536 9.07335 7.6039 9.0748 7.60244 9.07625L4.07135 12.6073C3.68083 12.9979 3.04766 12.9979 2.65714 12.6073C2.26661 12.2168 2.26661 11.5836 2.65714 11.1931L5.48548 8.36477Z"></path>
              </svg>
            </div>
            <div id="project-details-items-wrapper">
              <div id="project-details-items-move-container">
                <div class="project-details-item is-image" data-width="1296" data-height="1620" data-filename="/assets/projects/${assetId}/home" data-type="image" data-fullscreen></div>
                <div class="project-details-item is-text is-credits">
                  <div class="project-details-item-text">${escapeHtml(project.category)}</div>
                </div>
              </div>
            </div>
            <div id="project-details-meta">
              <h2 id="project-details-title">${escapeHtml(project.title)}</h2>
              <div id="project-details-left">
                <div id="project-details-desc"><p>${escapeHtml(project.description)}</p>${creditsParagraph(project.credits)}</div>
                ${ctaBlock}
              </div>
              <div id="project-details-right">
                <div id="project-details-side-list">
                  <div id="project-details-side-list-services">
                    <h4 class="project-details-side-list-title">Services</h4>
                    ${serviceItems}
                  </div>
                  ${linksBlock}
                </div>
                ${mobileCta}
              </div>
            </div>
            <div id="project-details-preview" data-next-id="${next.slug}" data-next-color-bg="${nextColors.bg}" data-next-color-text="${nextColors.text}" data-next-shadow="${nextColors.shadow}">
              <div id="project-details-preview-inner">
                <h2 id="project-details-preview-title">${escapeHtml(next.cardTitle || next.title)}</h2>
                <div id="project-details-preview-footer">
                  <div id="project-details-preview-footer-text">NEXT PROJECT</div>
                  <div id="project-details-preview-footer-bar">
                    <div id="project-details-preview-footer-bar-background"></div>
                    <div id="project-details-preview-footer-bar-inner"></div>
                  </div>
                  <svg id="project-details-preview-footer-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="none"><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 8h12m0 0-5.865 6M14 8 8.135 2"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
}

function applyFooterPatches(filePath) {
  patchFile(filePath, [
    ["mailto:hello@thebricks.com", "mailto:hello@thebricks.lk"],
    ["mailto:business@thebricks.com", "mailto:hello@thebricks.lk"],
    ["hello@thebricks.com", "hello@thebricks.lk"],
    ["business@thebricks.com", "hello@thebricks.lk"],
    ['<span class="footer-socials-text">Twitter / X</span>', '<span class="footer-socials-text">YouTube</span>'],
    ['<span class="footer-socials-text">Linkedin</span>', '<span class="footer-socials-text">Facebook</span>'],
    ["©2026 THE BRICKS Creative Production House", "©2026 The Bricks Creative (Pvt) Ltd"],
    ["©2026 THE BRICKS Creative Studio", "©2026 The Bricks Creative (Pvt) Ltd"],
    ["Built by The Bricks with ❤️", "Built by Nadula with ♥️"],
    ["Built by The Bricks with craft", "Built by Nadula with ♥️"],
    ["General enquires", "General enquiries"],
  ]);

  // Social URLs — replace placeholder # hrefs on social lines only via ordered patches
  let html = fs.readFileSync(filePath, "utf8");
  const socialReplacements = [
    [/(\sclass="footer-socials-line"\s*\n\s*href="#"\s*\n\s*target="_blank"\s*\n[^]*?<span class="footer-socials-text">YouTube<\/span>)/, ' class="footer-socials-line" href="https://www.youtube.com/@TheBrickslk" target="_blank"\n                  >\n                    <svg\n                      class="footer-socials-line-svg"\n                      xmlns="http://www.w3.org/2000/svg"\n                      width="24"\n                      height="24"\n                      fill="none"\n                      viewBox="0 0 24 24"\n                    >\n                      <path\n                        fill="#000"\n                        fill-rule="evenodd"\n                        d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z"\n                        clip-rule="evenodd"\n                      ></path>\n                    </svg>\n                    <span class="footer-socials-text">YouTube</span>'],
  ];
  // Simpler approach: direct href replacements when still #
  html = html.replace(
    /(<a\s+class="footer-socials-line"\s+href="#"\s+target="_blank"[^>]*>[\s\S]*?<span class="footer-socials-text">YouTube<\/span>)/,
    '<a class="footer-socials-line" href="https://www.youtube.com/@TheBrickslk" target="_blank">\n                    <svg\n                      class="footer-socials-line-svg"\n                      xmlns="http://www.w3.org/2000/svg"\n                      width="24"\n                      height="24"\n                      fill="none"\n                      viewBox="0 0 24 24"\n                    >\n                      <path\n                        fill="#000"\n                        fill-rule="evenodd"\n                        d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z"\n                        clip-rule="evenodd"\n                      ></path>\n                    </svg>\n                    <span class="footer-socials-text">YouTube</span>'
  );
  html = html.replace(
    /(<a\s+class="footer-socials-line"\s+href="#"\s+target="_blank"[^>]*>[\s\S]*?<span class="footer-socials-text">Instagram<\/span>)/,
    '<a class="footer-socials-line" href="https://www.instagram.com/thebrickslk/" target="_blank">\n                    <svg\n                      class="footer-socials-line-svg"\n                      xmlns="http://www.w3.org/2000/svg"\n                      width="24"\n                      height="24"\n                      fill="none"\n                      viewBox="0 0 24 24"\n                    >\n                      <path\n                        fill="#000"\n                        fill-rule="evenodd"\n                        d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z"\n                        clip-rule="evenodd"\n                      ></path>\n                    </svg>\n                    <span class="footer-socials-text">Instagram</span>'
  );
  html = html.replace(
    /(<a\s+class="footer-socials-line"\s+href="#"\s+target="_blank"[^>]*>[\s\S]*?<span class="footer-socials-text">Facebook<\/span>)/,
    '<a class="footer-socials-line" href="https://www.facebook.com/thebrickslk" target="_blank">\n                    <svg\n                      class="footer-socials-line-svg"\n                      xmlns="http://www.w3.org/2000/svg"\n                      width="24"\n                      height="24"\n                      fill="none"\n                      viewBox="0 0 24 24"\n                    >\n                      <path\n                        fill="#000"\n                        fill-rule="evenodd"\n                        d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z"\n                        clip-rule="evenodd"\n                      ></path>\n                    </svg>\n                    <span class="footer-socials-text">Facebook</span>'
  );
  html = html.replace(
    '<a id="footer-contact-address" href="#" target="_blank">',
    '<a id="footer-contact-address" href="mailto:hello@thebricks.lk">'
  );
  html = html.replace(
    '<a id="footer-bottom-labs" href="#" target="_blank">',
    '<a id="footer-bottom-labs" href="https://www.instagram.com/thebrickslk/" target="_blank">'
  );
  html = html.replace(
    /<div class="footer-address-line">hello@thebricks\.lk<\/div>\s*<div class="footer-address-line">hello@thebricks\.lk<\/div>/,
    '<div class="footer-address-line">hello@thebricks.lk</div>'
  );
  const before = fs.readFileSync(filePath, "utf8");
  if (html !== before) {
    fs.writeFileSync(filePath, html, "utf8");
    if (!changed.includes(path.relative(ROOT, filePath))) {
      changed.push(path.relative(ROOT, filePath));
    }
  }
}

function updateProjectLists() {
  const allCards = PROJECTS.map((p, i) => projectCard(p, i)).join("");
  const featuredCards = PROJECTS.slice(0, 10).map((p, i) => projectCard(p, i)).join("");

  for (const rel of ["index.html", "projects/index.html"]) {
    const filePath = path.join(SITE, rel);
    let html = fs.readFileSync(filePath, "utf8");
    html = html.replace(
      /<span id="projects-main-title-project-number">\d+<\/span>/,
      `<span id="projects-main-title-project-number">${PROJECTS.length}</span>`
    );
    if (rel === "index.html") {
      html = replaceBetween(
        html,
        '<div class="project-list">',
        '<a id="home-featured-cta"',
        `${featuredCards}\n              </div>\n              `
      );
    } else {
      html = replaceBetween(
        html,
        '<div class="project-list">',
        '</div>\n            </div>\n          </div>\n        </div>\n        <div id="page-extra-sections">',
        allCards
      );
    }
    writeIfChanged(filePath, html);
    applyFooterPatches(filePath);
  }
}

function updateHomeCopy() {
  const filePath = path.join(SITE, "index.html");
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(
    /<title>[^<]*<\/title>/,
    "<title>The Bricks — Creative Production House</title>"
  );
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta\n      name="description"\n      content="${SITE_DESCRIPTION}"\n    />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta\n      property="og:description"\n      content="${SITE_DESCRIPTION}"\n    />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta\n      property="og:title"\n      content="The Bricks — Creative Production House"\n    />`
  );
  html = html.replace(
    /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/>/,
    `<meta\n      property="og:site_name"\n      content="The Bricks — Creative Production House"\n    />`
  );
  html = html.replace(
    /<h1 id="home-hero-title">[^<]*<\/h1>/,
    "<h1 id=\"home-hero-title\">Create. Deliver. Elevate.</h1>"
  );
  html = html.replace(
    /<div id="home-reel-title-line-1">[^<]*<\/div>/,
    "<div id=\"home-reel-title-line-1\">Where ideas become</div>"
  );
  html = html.replace(
    /<div id="home-reel-title-line-2">[^<]*<\/div>/,
    "<div id=\"home-reel-title-line-2\">impact.</div>"
  );
  html = html.replace(
    /<h2 id="home-reel-desc">[\s\S]*?<\/h2>(?:\s*<p id="home-reel-desc-support">[\s\S]*?<\/p>)?/,
    `<h2 id="home-reel-desc">
                  The Bricks is a full-service creative production company crafting story-driven films and brand content that connect, inspire, and last.
                </h2>
                <p id="home-reel-desc-support">
                  We offer support at every stage of production, handling the entire creative process in-house — from initial concept to final delivery — so your project tells a clear, impactful story that meets your objectives.
                </p>`
  );
  html = html.replace(
    /<div id="home-featured-disclaimer">[\s\S]*?<\/div>/,
    `<div id="home-featured-disclaimer">
                  A selection of story-led productions built around ambitious brands and forward-thinking teams. Every project starts with a story worth telling. Here's what happens when we see it through.
                </div>`
  );
  writeIfChanged(filePath, html);
}

function capabilityCard(title, letter, items) {
  const lis = items.map((i) => `<li class="about-capability-list-item">${escapeHtml(i)}</li>`).join("\n                        ");
  return `<div class="about-capability-card">
                    <div class="about-capability-card-front">
                      <div class="about-capability-card-header">
                        <p class="about-capability-card-header-text">
                          ${escapeHtml(title)}
                        </p>
                        <div class="about-capability-card-header-letter">${letter}</div>
                      </div>
                      <ul class="about-capability-list">
                        ${lis}
                      </ul>
                      <div class="about-capability-card-header">
                        <p class="about-capability-card-header-text">
                          ${escapeHtml(title)}
                        </p>
                        <div class="about-capability-card-header-letter">${letter}</div>
                      </div>
                    </div>
                    <div class="about-capability-card-back"></div>
                  </div>`;
}

function processAwardItem(step) {
  const bulletLines = step.bullets
    .map((b) => `<p class="about-award-item-wrapper-text">${escapeHtml(b)}</p>`)
    .join("\n                    ");
  return `<div class="about-award-item">
                  <div class="about-award-item-wrapper">
                    <p class="about-award-item-wrapper-text">${escapeHtml(step.label)}</p>
                    <p class="about-award-item-wrapper-text">${escapeHtml(step.short)}</p>
                    <p class="about-award-item-wrapper-text">${escapeHtml(step.body)}</p>
                    ${bulletLines}
                  </div>
                  <div class="about-award-line"></div>
                </div>`;
}

const PROCESS_STEPS = [
  {
    label: "01 — Discover",
    short: "We get to know you.",
    body: "We dig into your brand, your audience, and what you actually want to achieve. No assumptions. Just the right questions, asked early.",
    bullets: [
      "We sit down and define the brief together",
      "We identify your audience and key message",
      "We align on objectives, timelines, and deliverables",
      "We find the creative opportunity hiding in the brief",
    ],
  },
  {
    label: "02 — Develop",
    short: "We build the idea.",
    body: "This is where the concept comes to life — scripts, treatments, shot lists, locations, talent. Everything planned so nothing is left to chance on shoot day.",
    bullets: [
      "We develop the creative concept and direction",
      "We write the script, treatment, and storyboard",
      "We plan locations, talent, and logistics",
      "We present the creative and refine until it's right",
    ],
  },
  {
    label: "03 — Produce",
    short: "We show up and shoot.",
    body: "Full in-house crew. Full creative control. We handle everything on set so you don't have to worry about a thing — just watch it come to life.",
    bullets: [
      "We execute the shoot with our full in-house team",
      "We direct, frame, and capture with intention",
      "We maintain creative consistency across every shot",
      "We manage the set so every minute counts",
    ],
  },
  {
    label: "04 — Refine",
    short: "We make it great.",
    body: "Edit. Colour. Sound. Motion. We go through every frame until it feels exactly right. Good enough isn't in our vocabulary.",
    bullets: [
      "We edit and shape the narrative",
      "We apply colour grading and motion graphics",
      "We mix and design the sound",
      "We review, refine, and incorporate your feedback",
    ],
  },
  {
    label: "05 — Deliver",
    short: "We send it into the world.",
    body: "Final assets, optimised for every platform you need. Clean. On time. Ready to make an impact.",
    bullets: [
      "We export and optimise for every platform",
      "We deliver with full quality assurance",
      "We analyse content performance and share insights",
      "We stay available for whatever comes next",
    ],
  },
];

function updateAboutPage() {
  const filePath = path.join(SITE, "about/index.html");
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(/<title>[^<]*<\/title>/, "<title>About — The Bricks</title>");
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta\n      name="description"\n      content="${SITE_DESCRIPTION}"\n    />`
  );

  html = html.replace(
    /<div id="about-who-title-left-3">[^<]*<\/div>/,
    "<div id=\"about-who-title-left-3\">AN IMPACT-DRIVEN</div>"
  );
  html = html.replace(
    /<div id="about-who-title-left-4">[\s\S]*?<\/div>/,
    `<div id="about-who-title-left-4">
                      <span>VIDEO&nbsp;</span><span>PRODUCTION COMPANY</span>
                    </div>`
  );
  html = html.replace(
    /<div class="about-who-title-right-text">\s*CRAFTING UNIQUE\s*<\/div>/,
    "<div class=\"about-who-title-right-text\">\n                      CRAFTING PRODUCTIONS\n                    </div>"
  );
  html = html.replace(
    /<div class="about-who-title-right-text">\s*DIGITAL EXPERIENCES\s*<\/div>/,
    "<div class=\"about-who-title-right-text\">\n                      THAT CREATE LASTING IMPACT\n                    </div>"
  );
  html = html.replace(
    /<div id="about-who-desc-top">[\s\S]*?<\/div>/,
    `<div id="about-who-desc-top">
                    <span class="is-italic">We plan it, shoot it, perfect it.</span>
                  </div>`
  );
  html = html.replace(
    /<div id="about-who-desc-bottom">[\s\S]*?<\/div>/,
    `<div id="about-who-desc-bottom">
                    <span>
                      We're storytellers, strategists, and filmmakers. A creative production house built to turn bold ideas into lasting impact.
                    </span>
                  </div>`
  );

  html = html.replace(
    /<div id="about-who-team-name-text">[^<]*<\/div>/,
    `<div id="about-who-team-name-text">${escapeHtml(TEAM[0].name)}</div>`
  );
  html = html.replace(
    /<div id="about-who-team-job-text">[\s\S]*?<\/div>/,
    `<div id="about-who-team-job-text">\n                              ${escapeHtml(TEAM[0].role)}\n                            </div>`
  );
  html = html.replace(
    /<p id="about-who-team-desc-text">[\s\S]*?<\/p>/,
    `<p id="about-who-team-desc-text">\n                          ${escapeHtml(TEAM[0].bio)}\n                        </p>`
  );

  const teamRosterSeo = TEAM.slice(1)
    .map(
      (member) => `<article>
                  <h3>${escapeHtml(member.name)}</h3>
                  <p>${escapeHtml(member.role)}</p>
                  <p>${escapeHtml(member.bio)}</p>
                </article>`
    )
    .join("\n                ");
  if (!html.includes('id="about-team-roster"')) {
    html = html.replace(
      "</div>\n            </div>\n            <div id=\"about-clients\"",
      `</div>\n            </div>\n            <div id="about-team-roster" hidden>\n                ${teamRosterSeo}\n            </div>\n            <div id="about-clients"`
    );
  } else {
    html = html.replace(
      /<div id="about-team-roster" hidden>[\s\S]*?<\/div>\s*<div id="about-clients"/,
      `<div id="about-team-roster" hidden>\n                ${teamRosterSeo}\n            </div>\n            <div id="about-clients"`
    );
  }

  html = html.replace(
    /<div id="about-clients" class="section">[\s\S]*?<\/div>\s*(?=<div id="about-award")/,
    `<div id="about-clients" class="section bricks-section-hidden" aria-hidden="true">
              <div id="about-clients-header">
                <div id="about-clients-title"> </div>
                <div id="about-clients-desc"> </div>
              </div>
              <div id="about-clients-carousel">
                <div class="about-clients-carousel-line"></div>
                <div class="about-clients-carousel-line"></div>
                <div class="about-clients-carousel-line"></div>
              </div>
            </div>
            `
  );

  if (!html.includes('id="about-clients"')) {
    html = html.replace(
      /<div id="about-team-roster" hidden>[\s\S]*?<\/div>\s*<div id="about-award"/,
      (match) => match.replace('<div id="about-award"', `<div id="about-clients" class="section bricks-section-hidden" aria-hidden="true">
              <div id="about-clients-header">
                <div id="about-clients-title"> </div>
                <div id="about-clients-desc"> </div>
              </div>
              <div id="about-clients-carousel">
                <div class="about-clients-carousel-line"></div>
                <div class="about-clients-carousel-line"></div>
                <div class="about-clients-carousel-line"></div>
              </div>
            </div>
            <div id="about-award"`)
    );
  }

  const processHtml = PROCESS_STEPS.map(processAwardItem).join("\n                ");
  const processSectionInner = `
                <div class="about-award-header">
                  <h5 class="about-award-header-title">How We Work</h5>
                  <div class="about-award-header-number">
                    <svg
                      class="about-award-header-svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="37"
                      fill="none"
                      viewBox="0 0 36 37"
                    >
                      <path
                        fill="#fff"
                        d="M15.189 1.678a3.976 3.976 0 0 1 6.624 3.939L18 18.514 14.187 5.617a3.976 3.976 0 0 1 1.002-3.939Z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M27.916 4.621a3.976 3.976 0 0 1 1.9 7.47L18 18.513l6.423-11.816a3.976 3.976 0 0 1 3.494-2.077ZM34.836 15.702a3.976 3.976 0 0 1-3.94 6.624L18 18.514 30.897 14.7a3.976 3.976 0 0 1 3.939 1.001Z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M31.892 28.43a3.976 3.976 0 0 1-7.469 1.9L18 18.513l11.816 6.423a3.976 3.976 0 0 1 2.076 3.493ZM20.811 35.35a3.976 3.976 0 0 1-6.624-3.94L18 18.514l3.813 12.896a3.976 3.976 0 0 1-1.002 3.94ZM8.083 32.406a3.976 3.976 0 0 1-1.899-7.469L18 18.514l-6.423 11.815a3.976 3.976 0 0 1-3.494 2.077ZM1.165 21.325a3.976 3.976 0 0 1 3.938-6.624L18 18.514 5.103 22.327a3.976 3.976 0 0 1-3.938-1.002ZM4.108 8.597a3.976 3.976 0 0 1 7.469-1.899L18 18.514 6.184 12.09a3.976 3.976 0 0 1-2.076-3.493Z"
                      ></path>
                    </svg>
                    <p class="about-award-header-text">05</p>
                  </div>
                </div>
                ${processHtml}
              </div>
              `;
  html = replaceBetween(
    html,
    '<div class="about-award-category award-category-awards">',
    '<div class="about-award-category award-category-articles">',
    processSectionInner
  );

  html = html.replace(
    /<div class="about-award-category award-category-articles">[\s\S]*?<\/div>\s*<div class="about-award-category award-category-talks">[\s\S]*?<\/div>\s*(?=<svg[\s\S]*?id="about-award-title")/,
    ""
  );

  const expertiseCards = [
    capabilityCard("Strategy", "s", [
      "Brand research",
      "Market analysis",
      "Creative direction",
      "Campaign strategy",
      "Objective alignment",
    ]),
    capabilityCard("Develop", "d", [
      "Script writing",
      "Visual moodboarding",
      "Shot planning",
      "Talent scouting",
      "Production scheduling",
    ]),
    capabilityCard("Capture", "c", [
      "Corporate videos",
      "Brand documentaries",
      "Product films",
      "Lifestyle content",
      "Photography",
    ]),
    capabilityCard("Craft", "c", [
      "Colour grading",
      "Motion graphics",
      "Sound design",
      "Audio mixing",
      "Platform delivery",
    ]),
  ].join("\n                  ");

  html = replaceBetween(
    html,
    '<div id="about-capability-subheader">',
    '<div id="about-capability-cards-wrapper">',
    `
                <div id="about-capability-subheader-text">
                  Strategy, develop, capture, and craft — from first insight to final delivery.
                </div>
                <div id="about-capability-subheader-cards">
                  <div class="about-capability-subheader-card">s</div>
                  <div class="about-capability-subheader-card">d</div>
                  <div class="about-capability-subheader-card">c</div>
                  <div class="about-capability-subheader-card">c</div>
                </div>
              </div>
              `
  );
  html = replaceBetween(
    html,
    '<div id="about-capability-cards">',
    '</div>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div id="page-extra-sections">',
    `\n                  ${expertiseCards}\n                `
  );

  writeIfChanged(filePath, html);
  applyFooterPatches(filePath);
}

function updateProjectsMeta() {
  const filePath = path.join(SITE, "projects/index.html");
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(/<title>[^<]*<\/title>/, "<title>Projects — The Bricks</title>");
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta\n      name="description"\n      content="${SITE_DESCRIPTION}"\n    />`
  );
  writeIfChanged(filePath, html);
}

function updateTeamJson() {
  const payload = JSON.stringify(TEAM, null, 2) + "\n";
  for (const rel of [
    "lusion.co/lusion.co/assets/team/team.json",
    "lusion.co/lusion.dev/assets/team/team.json",
  ]) {
    writeIfChanged(path.join(ROOT, rel), payload);
  }
}

function updateProjectDetailPages() {
  PROJECTS.forEach((project, index) => {
    const out = path.join(SITE, "projects", project.slug, "index.html");
    writeIfChanged(out, generateProjectDetailPage(project, index));
  });
}

function updateHoistedJs() {
  let js = fs.readFileSync(JS_PATH, "utf8");

  const aliasLines = PROJECTS.map(
    (p, i) => `  ${p.slug}: "${LEGACY_ASSET_IDS[i]}",`
  ).join("\n");
  js = js.replace(
    /const PROJECT_ASSET_ALIASES = \{[\s\S]*?\};/,
    `const PROJECT_ASSET_ALIASES = {\n${aliasLines}\n};`
  );

  js = js.replace(
    /for \(let r = 0; r < t\.length; r\+\+\)\s*\(t\[r\]\.name = "Member " \+ \(r \+ 1\)\),\s*\(t\[r\]\.index = r\),\s*\(this\.teamDataMap\[t\[r\]\.id\] = t\[r\]\);/,
    `for (let r = 0; r < t.length; r++)
              (t[r].index = r),
                (this.teamDataMap[t[r].id] = t[r]);`
  );

  if (!js.includes("this.domDescText.textContent")) {
    js = js.replace(
      /textAnimationHelper\.setMatrixText\(\s*this\.domLeftJobText,\s*n,\s*0,\s*1,\s*3,\s*1 \/ 30\s*\);/,
      `textAnimationHelper.setMatrixText(
        this.domLeftJobText,
        n,
        0,
        1,
        3,
        1 / 30
      ),
      (this.domDescText.textContent = this.teamDataMap[t].bio || "");`
    );
  }

  js = js.replace(/team\.json\?v=\d+team/g, "team.json?v=20260618team");

  writeIfChanged(JS_PATH, js);
}

function main() {
  updateTeamJson();
  updateProjectDetailPages();
  updateProjectLists();
  updateHomeCopy();
  updateAboutPage();
  updateProjectsMeta();
  updateHoistedJs();

  for (const rel of ["index.html", "about/index.html", "projects/index.html"]) {
    applyFooterPatches(path.join(SITE, rel));
  }

  console.log(`Updated ${changed.length} file(s):`);
  [...new Set(changed)].sort().forEach((f) => console.log(`  - ${f}`));
}

main();
