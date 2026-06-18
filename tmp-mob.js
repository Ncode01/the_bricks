const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  const hasFix = await page.evaluate(() => !!document.querySelector('script[src*="bricks-navigation-fix"]'));
  const link = page.locator('a.project-item[data-id="hameedia_husn_eid_campaign"]');
  await link.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await link.tap({ force: true });
  await page.waitForTimeout(10000);
  const after = await page.evaluate(() => ({
    path: location.pathname,
    stuck: document.getElementById('preloader')?.style.display !== 'none',
    preloaderOpacity: getComputedStyle(document.getElementById('preloader')).opacity,
    overlayVisible: document.getElementById('transition-overlay')?.style.opacity,
    title: document.querySelector('#project-details-title')?.textContent?.slice(0,40),
    useMobile: window.properties?.useMobileLayout
  }));
  console.log(JSON.stringify({ hasFix, after, errors: errors.slice(0,5) }, null, 2));
  await browser.close();
})();
