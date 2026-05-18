import { chromium } from 'playwright';

const URL = process.env.SITE_URL || 'http://localhost:5500/';
const WAIT_MS = Number(process.env.WAIT_MS || 45000);

const logs = [];
const page = await chromium.launch({ headless: true }).then((b) => b.newPage());

page.on('console', (msg) => {
  const text = msg.text();
  if (text.includes('[BricksLoader]') || text.includes('STUCK') || text.includes('PENDING')) {
    const line = `[${msg.type()}] ${text}`;
    logs.push(line);
    console.log(line);
  }
});

page.on('pageerror', (err) => {
  const line = `[pageerror] ${err.message}`;
  logs.push(line);
  console.error(line);
});

console.log(`Loading ${URL} (waiting up to ${WAIT_MS}ms for loader)...`);
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

const start = Date.now();
let lastPct = '';
while (Date.now() - start < WAIT_MS) {
  const state = await page.evaluate(() => {
    const pre = document.getElementById('preloader');
    const digits = Array.from(
      document.querySelectorAll('.preloader-percent-digit-num')
    )
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join('');
    return {
      preloaderVisible: pre ? pre.style.display !== 'none' && pre.offsetParent !== null : false,
      digits,
      hasInitialized: window.properties?.hasInitialized ?? null,
      hasStarted: window.properties?.hasStarted ?? null,
      pending: window.__bricksLoaderDebug?.pending?.size ?? null,
    };
  }).catch(() => null);

  if (state) {
    const pct = state.digits || '?';
    if (pct !== lastPct) {
      console.log(
        `[monitor] UI digits=${pct} preloader=${state.preloaderVisible} pending=${state.pending} init=${state.hasInitialized} started=${state.hasStarted}`
      );
      lastPct = pct;
    }
    if (!state.preloaderVisible && state.hasStarted) {
      console.log('[monitor] Preloader hidden — load complete');
      break;
    }
  }
  await page.waitForTimeout(500);
}

if (Date.now() - start >= WAIT_MS) {
  console.warn('[monitor] Timed out — dumping debug from page');
  const dump = await page.evaluate(() => {
    const dbg = window.__bricksLoaderDebug;
    if (!dbg) return { error: 'no __bricksLoaderDebug' };
    const pending = [];
    dbg.pending?.forEach((v, url) => pending.push({ url, type: v.type, ms: Math.round(performance.now() - v.startedAt) }));
    return {
      pendingCount: pending.length,
      pending,
      completedCount: dbg.completed?.length ?? 0,
      lastCompleted: dbg.completed?.slice(-5) ?? [],
    };
  });
  console.log(JSON.stringify(dump, null, 2));
}

const stuck = logs.filter((l) => l.includes('STUCK') || l.includes('PENDING'));
if (stuck.length) {
  console.log('\n=== STUCK / PENDING SUMMARY ===');
  stuck.forEach((l) => console.log(l));
} else if (logs.length === 0) {
  console.warn('No [BricksLoader] console lines captured — is debug enabled on this host?');
}

await page.close();
process.exit(0);
