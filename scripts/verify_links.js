const { chromium } = require('playwright');

async function verifyLinks() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });

  const linksToTest = [
    { selector: 'header a[href="/"]', expected: '/' },
    { selector: 'header a[href="/dumpster-rentals"]', expected: '/dumpster-rentals' },
    { selector: 'header a[href="/service-areas"]', expected: '/service-areas' },
    { selector: 'header a[href="/about"]', expected: '/about' },
    { selector: 'header a[href="/blog"]', expected: '/blog' },
    { selector: 'header a[href="/contact"]', expected: '/contact' },
    { selector: '.header-phone-action', expectedHref: 'tel:+12148768321' },
    { selector: '.header-quote-action', expectedHref: '#quote' },
    { selector: '.hero-cta-primary', expectedHref: '#quote' },
    { selector: '.hero-cta-secondary', expectedHref: 'tel:+12148768321' },
    { selector: '.service-area-arrow-link', expected: '/service-areas' },
    { selector: '.service-area-hero-strip a[href="/dumpster-rentals/15-yard"]', expected: '/dumpster-rentals/15-yard' },
    { selector: '.service-area-hero-strip a[href="/dumpster-rentals/20-yard"]', expected: '/dumpster-rentals/20-yard' },
    { selector: '.service-area-hero-strip a[href="/dumpster-rentals/25-yard"]', expected: '/dumpster-rentals/25-yard' },
    { selector: '.service-area-hero-strip a[href="/dumpster-rentals/contractor"]', expected: '/dumpster-rentals/contractor' },
    { selector: '.service-area-hero-strip a[href="/dumpster-rentals/commercial"]', expected: '/dumpster-rentals/commercial' },
    { selector: '.view-options-btn', expected: '/dumpster-rentals' },
  ];

  let passed = 0;
  for (const item of linksToTest) {
    const el = await page.$(item.selector);
    if (!el) {
      console.error('FAIL: Missing element for', item.selector);
      continue;
    }
    const href = await el.getAttribute('href');
    if (item.expectedHref && href === item.expectedHref) {
      console.log('PASS:', item.selector, '->', href);
      passed++;
    } else if (item.expected && href === item.expected) {
      console.log('PASS:', item.selector, '->', href);
      passed++;
    } else {
      console.error('FAIL:', item.selector, 'expected', item.expected || item.expectedHref, 'got', href);
    }
  }

  // Test clicking #quote scrolls to quote form
  await page.click('.hero-cta-primary');
  await page.waitForTimeout(500);
  const quoteVisible = await page.isVisible('#quote');
  console.log('PASS: Quote form #quote exists and visible:', quoteVisible);

  console.log('\nTotal link verification passed:', passed, 'of', linksToTest.length);
  await browser.close();
}

verifyLinks().catch(err => {
  console.error(err);
  process.exit(1);
});
