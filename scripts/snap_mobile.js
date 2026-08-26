const puppeteer = require('puppeteer');

async function testMobileMenu() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://lonewolf-dumpsters.vercel.app', { waitUntil: 'networkidle0' });
  
  // Click mobile hamburger menu
  const btn = await page.$('.mobile-menu-btn');
  if (btn) {
    await btn.click();
    await new Promise(r => setTimeout(r, 600));
  }
  
  await page.screenshot({ path: 'C:/Users/rougu/.gemini/antigravity/brain/f4c38032-e053-4b48-9855-ef18e021c227/screenshots/Mobile_Menu_Restored.png', fullPage: false });
  console.log('Mobile menu screenshot captured successfully!');
  await browser.close();
}

testMobileMenu();
