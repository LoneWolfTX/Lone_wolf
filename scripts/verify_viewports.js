const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PORT = 3005;
const OUT_DIR = path.join(__dirname, '..', 'out');
const targetScreenshotsDir = path.join('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227', 'screenshots');

if (!fs.existsSync(targetScreenshotsDir)) {
  fs.mkdirSync(targetScreenshotsDir, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') {
      reqPath = '/index.html';
    } else if (!path.extname(reqPath)) {
      if (fs.existsSync(path.join(OUT_DIR, reqPath + '.html'))) {
        reqPath = reqPath + '.html';
      } else if (fs.existsSync(path.join(OUT_DIR, reqPath, 'index.html'))) {
        reqPath = path.join(reqPath, 'index.html');
      }
    }

    const filePath = path.join(OUT_DIR, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500);
          res.end();
        }
      });
      stream.pipe(res);
    });
  });
}

const viewports = [
  { name: 'desktop-xl', width: 1440, height: 900 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

async function run() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Self-contained static verification server listening on http://127.0.0.1:${PORT}`);

  console.log('Launching browser for viewport verification against static build...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0', timeout: 15000 });
    
    // Smooth scroll down to guarantee images load
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 80);
      });
    });

    await new Promise((r) => setTimeout(r, 600));

    const metrics = await page.evaluate(() => {
      const bodyWidth = document.body.offsetWidth;
      const mainWidth = document.querySelector('main')?.offsetWidth || 0;
      const container = document.querySelector('.container');
      const containerWidth = container?.offsetWidth || 0;
      const containerComputedMax = window.getComputedStyle(container).maxWidth;

      const heroGrid = document.querySelector('.hero-grid');
      const heroCols = heroGrid ? window.getComputedStyle(heroGrid).gridTemplateColumns.split(' ').length : 0;

      const dumpsterGrid = document.querySelector('.dumpster-grid');
      const dumpsterCols = dumpsterGrid ? window.getComputedStyle(dumpsterGrid).gridTemplateColumns.split(' ').length : 0;
      const dumpsterCards = document.querySelectorAll('.dumpster-card');

      const reviewsGrid = document.querySelector('.reviews-grid');
      const reviewCols = reviewsGrid ? window.getComputedStyle(reviewsGrid).gridTemplateColumns.split(' ').length : 0;

      const winW = window.innerWidth;
      const hasHorizontalOverflow = document.documentElement.scrollWidth > winW || document.body.scrollWidth > winW;

      return {
        bodyWidth,
        mainWidth,
        containerWidth,
        containerComputedMax,
        heroCols,
        dumpsterCols,
        cardCount: dumpsterCards.length,
        reviewCols,
        hasHorizontalOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        windowWidth: winW,
      };
    });

    const screenshotPath = path.join(targetScreenshotsDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`\n=== Verified Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    console.log(`- Body Width: ${metrics.bodyWidth}px (100% full width)`);
    console.log(`- Container Width: ${metrics.containerWidth}px (Max: ${metrics.containerComputedMax})`);
    console.log(`- Hero Grid Columns: ${metrics.heroCols}`);
    console.log(`- Dumpster Grid Columns: ${metrics.dumpsterCols} (${metrics.cardCount} cards)`);
    console.log(`- Reviews Grid Columns: ${metrics.reviewCols}`);
    console.log(`- ScrollWidth vs WindowWidth: ${metrics.scrollWidth}px / ${metrics.windowWidth}px`);
    console.log(`- Horizontal Overflow: ${metrics.hasHorizontalOverflow ? 'FAIL - Has Overflow' : 'PASS - No Overflow'}`);
    console.log(`- Screenshot: ${screenshotPath}`);
    await page.close();
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  console.log('\nAll viewport verifications completed successfully!');
}

run().catch((err) => {
  console.error('Error during viewport verification:', err);
  process.exit(1);
});
