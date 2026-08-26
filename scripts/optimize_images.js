const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const REAL_DIR = path.join(__dirname, '..', 'public', 'images', 'lone-wolf', 'real');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

(async () => {
  console.log('⚡ Optimizing high-res images to lightweight web formats...');

  // Copy logo.png to favicon.ico if missing
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'lone-wolf', 'logo.png');
  const faviconPath = path.join(PUBLIC_DIR, 'favicon.ico');
  if (fs.existsSync(logoPath)) {
    try {
      await sharp(logoPath).resize(64, 64).toFile(faviconPath);
      console.log('✓ Created optimized favicon.ico');
    } catch (e) {
      console.log('Favicon write note:', e.message);
    }
  }

  const files = fs.readdirSync(REAL_DIR);
  for (const file of files) {
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const fullPath = path.join(REAL_DIR, file);
      const stat = fs.statSync(fullPath);
      if (stat.size > 300000) { // If larger than 300KB
        const tempPath = fullPath + '.tmp';
        try {
          await sharp(fullPath)
            .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true })
            .toFile(tempPath);

          const newStat = fs.statSync(tempPath);
          fs.renameSync(tempPath, fullPath);
          console.log(`✓ Compressed ${file}: ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024).toFixed(0)}KB`);
        } catch (err) {
          console.error(`Error compressing ${file}:`, err.message);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
  console.log('🎉 Image optimization complete!');
})();
