const puppeteer = require('puppeteer');

async function testAll() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  // 1. Admin Studio with all 9 tabs
  const p1 = await browser.newPage();
  await p1.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await p1.goto('https://lonewolf-dumpsters.vercel.app/admin', { waitUntil: 'networkidle0' });
  await p1.screenshot({ path: 'C:/Users/rougu/.gemini/antigravity/brain/f4c38032-e053-4b48-9855-ef18e021c227/screenshots/Admin_All_Tabs.png', fullPage: false });

  // 2. Footer without Context & Muse credit
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await p2.goto('https://lonewolf-dumpsters.vercel.app', { waitUntil: 'networkidle0' });
  await p2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  await p2.screenshot({ path: 'C:/Users/rougu/.gemini/antigravity/brain/f4c38032-e053-4b48-9855-ef18e021c227/screenshots/Clean_Footer_Final.png', fullPage: false });

  console.log('Final verification screenshots captured!');
  await browser.close();
}

testAll();
