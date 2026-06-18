const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const slug of ['hameedia_husn_eid_campaign','eraffine_satin_effect','cool_planet_modano_denim']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
    await page.evaluate(() => {
      const el = document.querySelector('#home-featured');
      if (window.scrollManager) scrollManager.scrollToPixel(scrollManager.getDomRange(el)._top + 200, true);
    });
    await page.waitForTimeout(2500);
    const canvasPE = await page.evaluate(() => getComputedStyle(document.getElementById('canvas')).pointerEvents);
    const linkBox = await page.locator(`a.project-item[data-id="${slug}"]`).boundingBox();
    if (!linkBox) { console.log(slug, 'no box'); await page.close(); continue; }
    await page.touchscreen.tap(linkBox.x + linkBox.width/2, linkBox.y + linkBox.height/2);
    await page.waitForTimeout(8000);
    const after = await page.evaluate(() => ({
      path: location.pathname,
      stuck: document.getElementById('preloader')?.style.display !== 'none' && !document.documentElement.classList.contains('bricks-project-loaded'),
      hasClass: document.documentElement.classList.contains('bricks-project-loaded'),
      title: document.querySelector('#project-details-title')?.textContent?.slice(0,35)
    }));
    console.log(slug, { canvasPE, after });
    await page.close();
  }
  await browser.close();
})();
