/**
 * One-time build script: pre-tints showcase PNGs into -ghost.webp copies.
 * Output matches the runtime filter: brightness(1.6) saturate(0) contrast(0.8).
 *
 * Run:
 *   npx tsx scripts/build-ghosts.ts
 *
 * Requires: sharp (devDependency)
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { showcase } from "../lib/showcase-data";

async function buildGhosts() {
  const publicDir = path.join(process.cwd(), "public");

  for (const item of showcase) {
    const srcPath = path.join(publicDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`  skip — source not found: ${item.src}`);
      continue;
    }

    const ext = path.extname(item.src); // .png
    const ghostName = item.src.replace(ext, "-ghost.webp");
    const outPath = path.join(publicDir, ghostName);

    await sharp(srcPath)
      .modulate({ brightness: 1.6, saturation: 0 })
      .linear(0.8, 0.1) // approximates CSS contrast(0.8)
      .webp({ quality: 85 })
      .toFile(outPath);

    console.log(`  built  ${ghostName}`);
  }

  console.log("\nDone.");
}

buildGhosts().catch((err) => {
  console.error(err);
  process.exit(1);
});
