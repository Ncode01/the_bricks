const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto('https://the-bricks-site-052026.web.app/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(() => document.getElementById('preloader')?.style.display === 'none', { timeout: 120000 });
  await page.evaluate(() => document.querySelector('a.project-item[data-id="eraffine_satin_effect"]').click());
  await page.waitForTimeout(12000);
  console.log(await page.evaluate(() => ({
    path: location.pathname,
    stuck: document.getElementById('preloader')?.style.display !== 'none' && !document.documentElement.classList.contains('bricks-project-loaded'),
    hasClass: document.documentElement.classList.contains('bricks-project-loaded'),
    title: document.querySelector('#project-details-title')?.textContent?.slice(0,30)
  })));
  await browser.close();
})();
