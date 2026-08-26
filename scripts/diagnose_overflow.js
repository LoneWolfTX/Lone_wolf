const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3006;
const OUT_DIR = path.join(__dirname, '..', 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    else if (!path.extname(reqPath)) {
      if (fs.existsSync(path.join(OUT_DIR, reqPath + '.html'))) reqPath += '.html';
      else if (fs.existsSync(path.join(OUT_DIR, reqPath, 'index.html'))) reqPath = path.join(reqPath, 'index.html');
    }
    const filePath = path.join(OUT_DIR, reqPath);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('404');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function diagnose() {
  const server = createStaticServer();
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  for (const width of [1024]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 768 });
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0' });

    const overflowingElements = await page.evaluate((winW) => {
      const results = [];
      const all = document.querySelectorAll('*');
      all.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW + 1 || rect.left < -1) {
          results.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            right: rect.right,
            left: rect.left,
            width: rect.width,
            outerHTML: el.outerHTML.substring(0, 150),
          });
        }
      });
      return results;
    }, width);

    console.log(`\n=== Overflow Diagnosis for Viewport ${width}px ===`);
    console.log(`Found ${overflowingElements.length} overflowing elements:`);
    overflowingElements.slice(0, 10).forEach((item, idx) => {
      console.log(`${idx + 1}. <${item.tagName.toLowerCase()}> class="${item.className}" id="${item.id}" (Right: ${item.right.toFixed(1)}px, Width: ${item.width.toFixed(1)}px)`);
      console.log(`   HTML: ${item.outerHTML}`);
    });
    await page.close();
  }

  await browser.close();
  await new Promise((r) => server.close(r));
}

diagnose().catch(console.error);
