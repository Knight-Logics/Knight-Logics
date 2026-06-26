const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const out = path.join(__dirname, '..', '.qa');
  require('fs').mkdirSync(out, { recursive: true });

  async function shot(name, url, width, height, action) {
    await page.setViewportSize({ width, height });
    await page.goto(`http://localhost:4183${url}`, { waitUntil: 'networkidle' });
    if (action) await action(page);
    await page.screenshot({ path: path.join(out, name), fullPage: false });
    console.log('OK', name);
  }

  await shot('phase1-home-desktop.png', '/?qa=1', 1440, 900);
  await shot('phase1-home-mobile-menu.png', '/?qa=2', 390, 844, async (p) => {
    await p.locator('#hamburger').click();
    await p.waitForTimeout(400);
  });
  await shot('phase1-services-dropdown.png', '/?qa=3', 390, 844, async (p) => {
    await p.locator('#hamburger').click();
    await p.locator('.nav-dropdown-toggle', { hasText: 'Services' }).click();
    await p.waitForTimeout(400);
  });
  await shot('phase2-growth-systems.png', '/business-growth-systems', 1440, 900);
  await shot('phase2-crm-outreach.png', '/crm-outreach-lead-generation', 1440, 900);
  await shot('phase3-case-studies.png', '/case-studies', 1440, 900);

  const checks = await page.evaluate(() => ({
    nav: [...document.querySelectorAll('.mobile-nav-links > .nav-link, .mobile-nav-links > .nav-dropdown > .nav-link')].map((el) => el.textContent.trim()),
    cards: document.querySelectorAll('.kl-services-grid--pillars .kl-service-card').length
  }));
  console.log('Checks on last page:', checks);

  await browser.close();
})();
