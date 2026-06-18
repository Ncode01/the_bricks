const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  const info = await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    const midX = r.left + r.width/2, midY = r.top + r.height/2;
    const nodes = document.elementsFromPoint(midX, midY).map(n => n.tagName + (n.className ? '.'+String(n.className).split(' ')[0]:''));
    return { rect: {top:r.top, bottom:r.bottom, h:r.height}, inView: r.top >= 0 && r.bottom <= window.innerHeight, nodes: nodes.slice(0,6) };
  });
  console.log('before scroll', info);
  await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    scrollManager.scrollToPixel(scrollManager.scrollPixel + r.top - 120, true);
  });
  await page.waitForTimeout(2000);
  const info2 = await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    const midX = r.left + r.width/2, midY = r.top + r.height/2;
    return { rect: {top:r.top, bottom:r.bottom}, inView: r.top >= 0 && r.bottom <= window.innerHeight, linkAtPoint: !!document.elementsFromPoint(midX, midY).find(n => n.closest && n.closest('a.project-item')) };
  });
  console.log('after scroll', info2);
  const box = await page.locator('a.project-item[data-id="hameedia_husn_eid_campaign"]').boundingBox();
  if (box) await page.touchscreen.tap(box.x + box.width/2, box.y + Math.min(box.height*0.4, box.height-10));
  await page.waitForTimeout(8000);
  console.log('after tap', await page.evaluate(() => ({ path: location.pathname, stuck: document.getElementById('preloader')?.style.display !== 'none', title: document.querySelector('#project-details-title')?.textContent?.slice(0,30) })));
  await browser.close();
})();
