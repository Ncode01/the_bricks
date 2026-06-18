const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  // use custom scroll to featured section
  await page.evaluate(() => {
    const el = document.querySelector('#home-featured');
    if (el && window.scrollManager) scrollManager.scrollToPixel(scrollManager.getDomRange(el)._top, true);
  });
  await page.waitForTimeout(2000);
  const before = await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    const canvas = document.getElementById('canvas');
    const cr = canvas.getBoundingClientRect();
    const elAtPoint = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    return { linkRect: {top:r.top, h:r.height}, elAtPoint: elAtPoint?.tagName + '.' + elAtPoint?.className, useMobile: window.properties?.useMobileLayout };
  });
  await page.evaluate(() => document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]').click());
  await page.waitForTimeout(10000);
  const after = await page.evaluate(() => ({
    path: location.pathname,
    stuck: document.getElementById('preloader')?.style.display !== 'none',
    title: document.querySelector('#project-details-title')?.textContent?.slice(0,40)
  }));
  console.log(JSON.stringify({ before, after, errors: errors.slice(0,3) }, null, 2));
  await browser.close();
})();
