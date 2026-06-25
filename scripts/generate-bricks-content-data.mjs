#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(__dirname, "bricks-content-source.json");
const OUTPUT_PATH = path.join(__dirname, "bricks-content-data.mjs");

const source = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf8"));

function js(value) {
  return JSON.stringify(value, null, 2);
}

const output = `/** Generated from bricks-content-source.json. Do not hand-edit this file. */

export const SITE_DESCRIPTION = ${js(source.SITE_DESCRIPTION)};

export const BRICKS_COLORS = ${js(source.BRICKS_COLORS)};

export const LEGACY_ASSET_IDS = ${js(source.LEGACY_ASSET_IDS)};

export const TEAM = ${js(source.TEAM)};

export const PROJECTS = ${js(source.PROJECTS)};

export function servicesTag(services) {
  return services.map((s) => s.toLowerCase()).join(" â€¢ ");
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
`;

fs.writeFileSync(OUTPUT_PATH, output, "utf8");
console.log("Generated scripts/bricks-content-data.mjs");
