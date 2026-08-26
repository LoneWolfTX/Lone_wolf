const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const INDEX_HTML = path.join(OUT_DIR, 'index.html');
const PREVIEW_DEST = path.join(ROOT, 'lonewolf_preview.html');
const BRAIN_DEST = path.join('C:', 'Users', 'rougu', '.gemini', 'antigravity', 'brain', 'f4c38032-e053-4b48-9855-ef18e021c227', 'lonewolf_preview.html');

if (!fs.existsSync(INDEX_HTML)) {
  console.error('Error: out/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

let html = fs.readFileSync(INDEX_HTML, 'utf8');

// Function to convert any local image path to base64
function fileToBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mime = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

// 1. Inline all CSS stylesheets
html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi, (match, href) => {
  const cleanHref = href.startsWith('/') ? href.slice(1) : href;
  const fullPath = path.join(OUT_DIR, cleanHref);
  if (fs.existsSync(fullPath)) {
    const css = fs.readFileSync(fullPath, 'utf8');
    return `<style>\n${css}\n</style>`;
  }
  return match;
});

// 2. Inline images referenced in src or srcset
const imageMap = {};
function collectImages(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      collectImages(full);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(ext)) {
        const rel = path.relative(path.join(ROOT, 'public'), full).replace(/\\/g, '/');
        imageMap['/' + rel] = full;
        imageMap[rel] = full;
      }
    }
  }
}

collectImages(path.join(ROOT, 'public'));

// Replace image URLs with base64 data URIs
for (const [urlPath, fullPath] of Object.entries(imageMap)) {
  try {
    const base64 = fileToBase64(fullPath);
    // Replace URL in src attributes
    html = html.split(urlPath).join(base64);
    // Replace URL in encoded Next.js image URLs
    const encoded = encodeURIComponent(urlPath);
    html = html.split(encoded).join(base64);
  } catch (err) {
    console.warn(`Could not inline image ${urlPath}:`, err.message);
  }
}

// Write the true 1:1 compiled standalone HTML
fs.writeFileSync(PREVIEW_DEST, html, 'utf8');
console.log('Successfully regenerated exact standalone HTML preview at:', PREVIEW_DEST);

if (fs.existsSync(path.dirname(BRAIN_DEST))) {
  fs.writeFileSync(BRAIN_DEST, html, 'utf8');
  console.log('Successfully copied to brain directory:', BRAIN_DEST);
}
