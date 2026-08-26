const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://test.lonewolfdumpsters.com';

const PAGES_TO_TEST = [
  '/',
  '/about/',
  '/faq/',
  '/terms/',
  '/privacy/',
  '/dumpster-rentals/',
  '/dumpster-rentals/15-yard/',
  '/dumpster-rentals/20-yard/',
  '/dumpster-rentals/25-yard/',
  '/dumpster-rentals/residential/',
  '/dumpster-rentals/contractor/',
  '/dumpster-rentals/commercial/',
  '/service-areas/',
  '/service-areas/arlington/',
  '/service-areas/fort-worth/',
  '/admin/',
];

(async () => {
  console.log('🚀 Starting Full QA Audit on ' + BASE_URL + '...\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const brokenImages = [];
  const brokenLinks = [];
  const failedRequests = [];

  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      failedRequests.push({ url, status });
    }
  });

  for (const relativePath of PAGES_TO_TEST) {
    const targetUrl = BASE_URL + relativePath;
    console.log(`Checking ${targetUrl}...`);

    try {
      const res = await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      const status = res ? res.status() : 0;
      console.log(`  Page Status: ${status}`);

      // Check all <img> elements on the page for broken src or 0 naturalWidth
      const imgAudit = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
          src: img.src,
          currentSrc: img.currentSrc,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
        }));
      });

      imgAudit.forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          brokenImages.push({ page: relativePath, src: img.src, alt: img.alt });
          console.log(`  ❌ BROKEN IMAGE on ${relativePath}: ${img.src}`);
        }
      });

      // Screenshot for visual verification
      const cleanName = relativePath.replace(/[^a-zA-Z0-9]/g, '_') || 'home';
      const screenshotPath = path.join(__dirname, '..', 'artifacts', `qa_${cleanName}.png`);
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({ path: screenshotPath, fullPage: false });

    } catch (err) {
      console.error(`  ❌ Error loading ${targetUrl}:`, err.message);
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log('📊 QA AUDIT SUMMARY RESULT:');
  console.log('========================================');
  console.log(`Pages Audited: ${PAGES_TO_TEST.length}`);
  console.log(`Failed HTTP Requests (4xx/5xx): ${failedRequests.length}`);
  if (failedRequests.length > 0) {
    console.log('Failed Requests List:', JSON.stringify(failedRequests, null, 2));
  }
  console.log(`Broken Images Detected: ${brokenImages.length}`);
  if (brokenImages.length > 0) {
    console.log('Broken Images List:', JSON.stringify(brokenImages, null, 2));
  }
})();
