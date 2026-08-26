const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

async function packageZip() {
  const outDir = path.join(__dirname, '..', 'out');
  const zipPath = path.join(__dirname, '..', 'lonewolf_production_build.zip');

  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  const output = fs.createWriteStream(zipPath);
  const archive = new ZipArchive({
    zlib: { level: 9 },
    forceLocalTime: true,
  });

  output.on('close', () => {
    console.log(`Successfully created POSIX-compliant production zip: ${zipPath}`);
    console.log(`Total archive size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Recursively add all files from out directory with explicit POSIX forward slashes
  function addDirectory(dir, zipPrefix) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const entryName = zipPrefix ? `${zipPrefix}/${file}` : file;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDirectory(fullPath, entryName);
      } else {
        archive.file(fullPath, { name: entryName });
      }
    }
  }

  addDirectory(outDir, '');

  await archive.finalize();
}

packageZip().catch(console.error);
