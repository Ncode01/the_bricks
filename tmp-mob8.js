const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  await page.evaluate(() => {
    function fire(type, x, y) {
      const target = document.elementFromPoint(x, y) || document.body;
      const touch = new Touch({ identifier: 1, target, clientX: x, clientY: y, pageX: x, pageY: y });
      const touches = type === 'touchend' ? [] : [touch];
      target.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches, changedTouches: [touch] }));
    }
    fire('touchstart', 195, 700);
    for (let y = 700; y >= 100; y -= 50) fire('touchmove', 195, y);
    fire('touchend', 195, 100);
  });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
    const r = a.getBoundingClientRect();
    return { top: r.top, inView: r.top >= 0 && r.bottom <= innerHeight, scroll: document.getElementById('page-container').style.transform };
  });
  console.log('scroll info', info);
  if (info.top < 700) {
    await page.evaluate(() => {
      const a = document.querySelector('a.project-item[data-id="hameedia_husn_eid_campaign"]');
      const r = a.getBoundingClientRect();
      const x = r.left + r.width/2, y = r.top + r.height/2;
      function fire(type, px, py) {
        const target = document.elementFromPoint(px, py) || a;
        const touch = new Touch({ identifier: 2, target, clientX: px, clientY: py });
        const touches = type === 'touchend' ? [] : [touch];
        document.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches, changedTouches: [touch] }));
      }
      fire('touchstart', x, y);
      fire('touchend', x, y);
    });
    await page.waitForTimeout(8000);
    console.log('nav', await page.evaluate(() => ({ path: location.pathname, stuck: document.getElementById('preloader')?.style.display !== 'none' && !document.documentElement.classList.contains('bricks-project-loaded'), title: document.querySelector('#project-details-title')?.textContent?.slice(0,30) })));
  }
  await browser.close();
})();
