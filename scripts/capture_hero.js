const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  else if (!path.extname(reqPath)) {
    if (fs.existsSync(path.join(outDir, reqPath + '.html'))) reqPath += '.html';
    else if (fs.existsSync(path.join(outDir, reqPath, 'index.html'))) reqPath += '/index.html';
  }
  const fullPath = path.join(outDir, reqPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(fullPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3072, async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3072/', { waitUntil: 'networkidle0' });
  
  const heroElement = await page.$('.page-hero-container');
  if (heroElement) {
    await heroElement.screenshot({ path: 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\hero_preview_fixed.png' });
  }
  await page.screenshot({ path: 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\target_homepage_desktop.png', fullPage: true });

  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3072/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\target_homepage_mobile.png', fullPage: true });

  await browser.close();
  server.close();
  console.log('Hero and full page screenshots captured successfully!');
});
