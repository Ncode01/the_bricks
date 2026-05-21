import { chromium } from "playwright";

const base = process.env.SITE_URL || "http://localhost:5500";

const browser = await chromium.launch();
const page = await browser.newPage();

let loadedTeamUrl = null;
page.on("response", (res) => {
  if (res.url().includes("/assets/team/team.json")) loadedTeamUrl = res.url();
});

await page.goto(`${base}/about/`, { waitUntil: "networkidle", timeout: 120000 });

const fetched = await page.evaluate(async () => {
  const res = await fetch("/assets/team/team.json?v=20260518team");
  return res.json();
});

const pass =
  loadedTeamUrl &&
  loadedTeamUrl.includes("localhost:5500") &&
  !loadedTeamUrl.startsWith("https://lusion.dev") &&
  fetched.length === 6 &&
  !fetched.some((m) => m.id === "sunny") &&
  fetched.every((m, i) => m.name === `Member ${i + 1}`);

console.log(
  JSON.stringify(
    {
      loadedTeamUrl,
      members: fetched.map((m) => ({ id: m.id, name: m.name })),
      pass,
    },
    null,
    2
  )
);

await browser.close();
process.exit(pass ? 0 : 1);
