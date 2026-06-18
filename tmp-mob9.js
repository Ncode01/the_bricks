const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const slug of ['hameedia_husn_eid_campaign','eraffine_satin_effect']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await page.goto('https://the-bricks-site-052026.web.app/projects/' + slug, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(10000);
    const after = await page.evaluate(() => ({
      stuck: document.getElementById('preloader')?.style.display !== 'none' && !document.documentElement.classList.contains('bricks-project-loaded'),
      hasClass: document.documentElement.classList.contains('bricks-project-loaded'),
      preDisplay: document.getElementById('preloader')?.style.display,
      overlayDisplay: document.getElementById('transition-overlay')?.style.display,
      title: document.querySelector('#project-details-title')?.textContent?.slice(0,30)
    }));
    console.log(slug, after);
    await page.close();
  }
  await browser.close();
})();
