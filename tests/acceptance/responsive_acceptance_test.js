const { chromium } = require('playwright');

const BASE_URL = (process.env.TARGET_URL || 'http://localhost:3000').replace(/\/$/, '');

const VIEWPORTS = [
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
  { name: 'Mobile (390px)', width: 390, height: 844 },
];

const PAGES_TO_TEST = [
  '/',
  '/dumpster-rentals',
  '/dumpster-rentals/20-yard',
  '/service-areas/colleyville',
  '/about',
  '/contact',
  '/faq',
  '/admin',
];

async function runResponsiveAudit() {
  console.log('===============================================================');
  console.log('   LONE WOLF DUMPSTERS - RESPONSIVE & CONSOLE AUDIT SUITE    ');
  console.log('   Target: ' + BASE_URL);
  console.log('===============================================================\\n');

  const browser = await chromium.launch({ headless: true });
  let totalPassed = 0;
  let totalFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  [PASS] ' + message);
      totalPassed++;
    } else {
      console.error('  [FAIL] ' + message);
      totalFailed++;
    }
  }

  for (const vp of VIEWPORTS) {
    console.log('\\n--- Testing ' + vp.name + ' ---');
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.width < 768
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    for (const pathname of PAGES_TO_TEST) {
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.includes('Failed to load resource: the server responded with a status of 401') &&
              !text.includes('favicon.ico')) {
            consoleErrors.push(text);
          }
        }
      });

      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      const response = await page.goto(BASE_URL + pathname, { waitUntil: 'networkidle', timeout: 30000 });
      assert(response && response.status() === 200, pathname + ' loaded with HTTP 200 on ' + vp.name);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      assert(!hasHorizontalScroll, 'No horizontal overflow on ' + pathname + ' (' + vp.name + ')');

      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images
          .filter((img) => img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))
          .map((img) => img.src);
      });
      assert(brokenImages.length === 0, 'All loaded images rendered successfully on ' + pathname + ' (' + vp.name + ')' + (brokenImages.length > 0 ? ' [Broken: ' + brokenImages.join(', ') + ']' : ''));

      assert(consoleErrors.length === 0 && pageErrors.length === 0, 'Zero uncaught console errors on ' + pathname + ' (' + vp.name + ')' + (consoleErrors.length > 0 ? ' [Errors: ' + consoleErrors.join('; ') + ']' : ''));
    }

    await context.close();
  }

  await browser.close();

  console.log('\\n===============================================================');
  console.log('   RESPONSIVE AUDIT COMPLETE: ' + totalPassed + ' PASSED, ' + totalFailed + ' FAILED');
  console.log('===============================================================');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runResponsiveAudit().catch((err) => {
  console.error('Responsive audit failed:', err);
  process.exit(1);
});
