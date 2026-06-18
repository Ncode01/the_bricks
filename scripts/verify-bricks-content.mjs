import { chromium } from "playwright";

const base = "http://localhost:5500";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e.message)));

const checks = [];

async function check(name, fn) {
  try {
    const ok = await fn();
    checks.push({ name, ok: !!ok });
  } catch (e) {
    checks.push({ name, ok: false, error: String(e) });
  }
}

await check("home loads hero copy", async () => {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 120000 });
  const html = await page.content();
  return html.includes("Where ideas become impact.");
});

await check("home has no placeholder projects", async () => {
  const html = await page.content();
  return !html.includes("Brand Anthem Film");
});

await check("projects page has 16 cards", async () => {
  await page.goto(`${base}/projects`, { waitUntil: "networkidle", timeout: 120000 });
  return (await page.locator(".project-list .project-item").count()) === 16;
});

await check("about has 3 team members in json", async () => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle", timeout: 120000 });
  const team = await page.evaluate(async () => {
    const res = await fetch("/assets/team/team.json?v=20260518team");
    return res.json();
  });
  return team.length === 3 && team[0].name === "Eshan Manusanka";
});

await check("project detail route loads", async () => {
  await page.goto(`${base}/projects/hameedia_husn_eid_campaign`, {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.waitForTimeout(3000);
  const title = await page.locator("#project-details-title").textContent().catch(() => "");
  return title.includes("Hameedia");
});

await check("footer email updated", async () => {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const html = await page.content();
  return html.includes("hello@thebricks.lk") && !html.includes("hello@thebricks.com");
});

const ignoredErrors = [
  "There was an error fetching the embed code from Vimeo.",
  "Cannot read properties of undefined (reading 'words')",
];
const relevantErrors = errors.filter((e) => !ignoredErrors.some((x) => e.includes(x)));

console.log(JSON.stringify({ checks, errors: relevantErrors, ignoredErrorCount: errors.length - relevantErrors.length }, null, 2));
await browser.close();
process.exit(checks.every((c) => c.ok) && relevantErrors.length === 0 ? 0 : 1);
