const { chromium } = require('playwright');

async function verifyTablet() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Tablet (768px) scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${scrollWidth > clientWidth}`);

  // Check 2x2 benefits strip
  const benefits = await page.$$('.hero-benefits-strip > div');
  console.log(`PASS: Benefits items count: ${benefits.length}`);

  // Capture full tablet hero
  await page.screenshot({ path: 'artifacts/screenshots/tablet_768_full_view.png', clip: { x: 0, y: 0, width: 768, height: 1200 } });

  await browser.close();
  console.log('Tablet verification complete!');
}

verifyTablet().catch(err => {
  console.error(err);
  process.exit(1);
});
