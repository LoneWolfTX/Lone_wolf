const puppeteer = require('puppeteer');
const path = require('path');

async function captureIntake() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const previewFile = 'file:///' + path.join(__dirname, '..', 'lonewolf_preview.html').replace(/\\/g, '/');
  await page.goto(previewFile, { waitUntil: 'load' });

  const quoteSection = await page.$('#quote');
  const quotePath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\intake_form_section.png';
  if (quoteSection) {
    await quoteSection.screenshot({ path: quotePath });
    console.log('Saved intake form section screenshot to:', quotePath);
  }

  await browser.close();
}

captureIntake().catch(console.error);
