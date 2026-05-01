/**
 * Generates AVIF and WebP versions of showcase color images.
 * Output resolution: 2400px wide (covers 70vw on a 3840px 4K retina display).
 * AVIF q65, WebP q82 — visually indistinguishable at viewing distances.
 *
 * Run:
 *   npx tsx scripts/build-showcase.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { showcase } from "../lib/showcase-data";

const MAX_WIDTH = 2400;

async function buildShowcase() {
  const publicDir = path.join(process.cwd(), "public");

  for (const item of showcase) {
    const srcPath = path.join(publicDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`  skip — source not found: ${item.src}`);
      continue;
    }

    const base = item.src.replace(/\.png$/, "");

    // AVIF — quality 65
    const avifOut = path.join(publicDir, `${base}.avif`);
    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .avif({ quality: 65 })
      .toFile(avifOut);
    const avifSize = fs.statSync(avifOut).size;
    console.log(`  avif  ${base}.avif  ${(avifSize / 1024).toFixed(0)} KB`);

    // WebP — quality 82
    const webpOut = path.join(publicDir, `${base}.webp`);
    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpOut);
    const webpSize = fs.statSync(webpOut).size;
    console.log(`  webp  ${base}.webp  ${(webpSize / 1024).toFixed(0)} KB`);
  }

  console.log("\nDone.");
}

buildShowcase().catch((err) => {
  console.error(err);
  process.exit(1);
});
