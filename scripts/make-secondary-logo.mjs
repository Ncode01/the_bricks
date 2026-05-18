import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "../lusion.co/lusion.co");
const svgPath = path.join(siteRoot, "assets/images/logo/the-bricks-logo.svg");
const outPath = path.join(siteRoot, "assets/images/secondary logo.png");
const svg = fs.readFileSync(svgPath, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 560, height: 160 },
  deviceScaleFactor: 2,
});
await page.setContent(
  `<!DOCTYPE html><html><body style="margin:0;background:#0a0a0a;display:flex;align-items:center;justify-content:center">${svg}</body></html>`
);
await page.locator("svg").screenshot({ path: outPath, omitBackground: true });
await browser.close();
console.log("Wrote", outPath);
