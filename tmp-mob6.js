const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  await page.evaluate(() => {
    document.getElementById('page-container').style.transform = 'translate3d(0px, -2550px, 0px)';
  });
  await page.waitForTimeout(500);
  const box = await page.locator('a.project-item[data-id="hameedia_husn_eid_campaign"]').boundingBox();
  console.log('box', box);
  if (box) await page.touchscreen.tap(box.x + box.width/2, box.y + box.height/2);
  await page.waitForTimeout(8000);
  console.log(await page.evaluate(() => ({
    path: location.pathname,
    stuck: document.getElementById('preloader')?.style.display !== 'none' && !document.documentElement.classList.contains('bricks-project-loaded'),
    title: document.querySelector('#project-details-title')?.textContent?.slice(0,40)
  })));
  await browser.close();
})();
