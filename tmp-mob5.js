const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  // swipe up several times to reach featured
  for (let i = 0; i < 8; i++) {
    await page.touchscreen.tap(195, 600);
    await page.touchscreen.swipe({ x1: 195, y1: 700, x2: 195, y2: 200, steps: 12 });
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    const midX = r.left + r.width/2, midY = r.top + r.height/2;
    return { top: r.top, bottom: r.bottom, inView: r.top >= 0 && r.bottom <= innerHeight, hasLink: !!document.elementsFromPoint(midX, midY).find(n => n.closest && n.closest('a.project-item')) };
  });
  console.log('scrolled', info);
  if (info.inView || info.top < 800) {
    const box = await page.locator('a.project-item[data-id="hameedia_husn_eid_campaign"]').boundingBox();
    if (box) {
      await page.touchscreen.tap(box.x + box.width/2, box.y + box.height * 0.35);
    }
  }
  await page.waitForTimeout(8000);
  console.log('result', await page.evaluate(() => ({ path: location.pathname, title: document.querySelector('#project-details-title')?.textContent?.slice(0,30), stuck: document.getElementById('preloader')?.style.display !== 'none' && !document.documentElement.classList.contains('bricks-project-loaded') })));
  await browser.close();
})();
