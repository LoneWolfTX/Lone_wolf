const puppeteer = require('puppeteer');

async function testSEOArea() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  // 1. Desktop View
  const p1 = await browser.newPage();
  await p1.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
  await p1.goto('https://lonewolf-dumpsters.vercel.app/service-areas', { waitUntil: 'networkidle0' });
  await p1.evaluate(() => window.scrollTo(0, 950));
  await new Promise(r => setTimeout(r, 600));
  await p1.screenshot({ path: 'C:/Users/rougu/.gemini/antigravity/brain/f4c38032-e053-4b48-9855-ef18e021c227/screenshots/SEO_Service_Area_Desktop.png', fullPage: false });

  // 2. Mobile View
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p2.goto('https://lonewolf-dumpsters.vercel.app/service-areas', { waitUntil: 'networkidle0' });
  await p2.evaluate(() => window.scrollTo(0, 750));
  await new Promise(r => setTimeout(r, 600));
  await p2.screenshot({ path: 'C:/Users/rougu/.gemini/antigravity/brain/f4c38032-e053-4b48-9855-ef18e021c227/screenshots/SEO_Service_Area_Mobile.png', fullPage: false });

  console.log('SEO Service Area screenshots captured!');
  await browser.close();
}

testSEOArea();
