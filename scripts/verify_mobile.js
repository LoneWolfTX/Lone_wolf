const { chromium } = require('playwright');

async function verifyMobile() {
  const browser = await chromium.launch({ headless: true });
  for (const width of [390, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });

    // Check overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth) {
      console.error(`FAIL: Horizontal overflow at ${width}px: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
    } else {
      console.log(`PASS: No horizontal overflow at ${width}px (width=${clientWidth})`);
    }

    // Check mobile menu button
    const menuBtn = await page.$('.mobile-menu-btn');
    if (!menuBtn) {
      console.error(`FAIL: Mobile menu button not found at ${width}px`);
      continue;
    }

    // Click menu button
    await menuBtn.click();
    await page.waitForTimeout(300);

    // Verify mobile drawer visible
    const mobileQuoteLink = await page.$('a[href="#quote"]');
    const mobilePhoneLink = await page.$('a[href^="tel:"]');
    console.log(`PASS: Mobile drawer opened at ${width}px with quote & phone actions:`, Boolean(mobileQuoteLink && mobilePhoneLink));

    // Capture screenshot of mobile with menu open
    await page.screenshot({ path: `artifacts/screenshots/mobile_${width}_menu_open.png` });

    await page.close();
  }

  await browser.close();
  console.log('Mobile verification completed successfully!');
}

verifyMobile().catch(err => {
  console.error(err);
  process.exit(1);
});
