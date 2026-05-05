const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const inputFile = 'C:\\Users\\uahme\\.gemini\\antigravity\\brain\\7994c687-b7e1-409a-83d0-1b48e232cf91\\media__1777914001591.png';
  
  if (!fs.existsSync(inputFile)) {
    console.log("Input file not found: " + inputFile);
    return;
  }

  const outBase = 'H:\\New folder\\retrotekt-web-2\\public\\showcase\\model-02';

  // 1. Save optimized PNG
  await sharp(inputFile)
    .png({ quality: 80, compressionLevel: 8 })
    .toFile(`${outBase}.png`);
  console.log("Saved PNG");

  // 2. Save optimized WebP
  await sharp(inputFile)
    .webp({ quality: 80 })
    .toFile(`${outBase}.webp`);
  console.log("Saved WebP");

  // 3. Save optimized AVIF
  await sharp(inputFile)
    .avif({ quality: 60 })
    .toFile(`${outBase}.avif`);
  console.log("Saved AVIF");

  // 4. Save ghost image (grayscale)
  await sharp(inputFile)
    .grayscale()
    .webp({ quality: 60 })
    .toFile(`${outBase}-ghost.webp`);
  console.log("Saved Ghost WebP");
}

processImage().catch(console.error);
