/**
 * Generates AVIF, WebP, and JPEG versions of showcase color images.
 * AVIF/WebP at 2400px — covers 70vw on a 4K retina display.
 * JPEG at 1600px — used as the <img src> fallback (replaces the raw PNG).
 * AVIF q65, WebP q82, JPEG q85 — visually indistinguishable at viewing distances.
 *
 * Run:
 *   npx tsx scripts/build-showcase.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { showcase } from "../lib/showcase-data";

const MAX_WIDTH = 2400;
const JPEG_WIDTH = 1600;

async function buildShowcase() {
  const publicDir = path.join(process.cwd(), "public");

  for (const item of showcase) {
    // src now points to .jpg; resolve the source PNG by looking for it
    const pngSrc = item.src.replace(/\.jpg$/, ".png");
    const srcPath = path.join(publicDir, pngSrc);
    if (!fs.existsSync(srcPath)) {
      console.warn(`  skip — source not found: ${pngSrc}`);
      continue;
    }

    const base = pngSrc.replace(/\.png$/, "");

    // AVIF — quality 65, 2400px
    const avifOut = path.join(publicDir, `${base}.avif`);
    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .avif({ quality: 65 })
      .toFile(avifOut);
    const avifSize = fs.statSync(avifOut).size;
    console.log(`  avif  ${base}.avif  ${(avifSize / 1024).toFixed(0)} KB`);

    // WebP — quality 82, 2400px
    const webpOut = path.join(publicDir, `${base}.webp`);
    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpOut);
    const webpSize = fs.statSync(webpOut).size;
    console.log(`  webp  ${base}.webp  ${(webpSize / 1024).toFixed(0)} KB`);

    // JPEG — quality 85, 1600px — fallback src replacing raw PNG
    const jpegOut = path.join(publicDir, `${base}.jpg`);
    await sharp(srcPath)
      .resize({ width: JPEG_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpegOut);
    const jpegSize = fs.statSync(jpegOut).size;
    console.log(`  jpeg  ${base}.jpg  ${(jpegSize / 1024).toFixed(0)} KB`);
  }

  console.log("\nDone.");
}

buildShowcase().catch((err) => {
  console.error(err);
  process.exit(1);
});
