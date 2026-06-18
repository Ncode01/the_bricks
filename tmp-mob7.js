const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  // drag scroll using touch via CDP
  const cx = 195, y1 = 700, y2 = 150;
  await page.touchscreen.tap(cx, y1);
  await page.mouse.move(cx, y1);
  await page.mouse.down();
  for (let y = y1; y >= y2; y -= 40) {
    await page.mouse.move(cx, y);
    await page.waitForTimeout(30);
  }
  await page.mouse.up();
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    return { top: r.top, inView: r.top >= 0 && r.bottom <= innerHeight };
  });
  console.log('after drag', info);
  const box = await page.locator('a.project-item[data-id="hameedia_husn_eid_campaign"]').boundingBox();
  if (box && box.y < 844) {
    await page.touchscreen.tap(box.x + box.width/2, box.y + box.height/2);
    await page.waitForTimeout(8000);
    console.log('tap result', await page.evaluate(() => ({ path: location.pathname, title: document.querySelector('#project-details-title')?.textContent?.slice(0,30) })));
  }
  await browser.close();
})();
