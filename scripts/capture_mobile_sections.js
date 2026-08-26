const puppeteer = require('puppeteer');
const path = require('path');

async function captureMobileSections() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const previewFile = 'file:///' + path.join(__dirname, '..', 'lonewolf_preview.html').replace(/\\/g, '/');
  await page.goto(previewFile, { waitUntil: 'load' });

  // 1. Mobile Hero & Reviews
  await page.screenshot({
    path: 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\mobile_01_hero_reviews.png',
    clip: { x: 0, y: 0, width: 390, height: 900 }
  });

  // 2. Mobile How it Works & Dumpster Cards
  await page.screenshot({
    path: 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\mobile_02_pricing_cards.png',
    clip: { x: 0, y: 900, width: 390, height: 1150 }
  });

  // 3. Mobile Why Us, Areas & Quote Form
  await page.screenshot({
    path: 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\mobile_03_quote_footer.png',
    clip: { x: 0, y: 2050, width: 390, height: 1100 }
  });

  console.log('Mobile section screenshots captured successfully!');
  await browser.close();
}

captureMobileSections().catch(console.error);
