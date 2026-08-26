const puppeteer = require('puppeteer');

async function testSEOMobile3() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await browser.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto('https://lonewolf-dumpsters.vercel.app/service-areas', { waitUntil: 'networkidle0' });
  await p.evaluate(() => window.scrollTo(0, 3100));
  await new Promise(r => setTimeout(r, 600));
  await p.screenshot({ path: 'C:/Users/rougu/.gemini/antigravity/brain/f4c38032-e053-4b48-9855-ef18e021c227/screenshots/SEO_Service_Area_Mobile_List_Final.png', fullPage: false });
  await browser.close();
}

testSEOMobile3();
