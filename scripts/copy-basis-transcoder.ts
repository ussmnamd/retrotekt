/**
 * Copies basis_transcoder.js and basis_transcoder.wasm from the three.js
 * package into public/basis/ so KTX2Loader can fetch them at runtime.
 *
 * Idempotent: skips files that are already up to date (same size + mtime).
 */
import * as path from 'path';
import * as fs from 'fs/promises';

const SRC_DIR = path.resolve('node_modules/three/examples/jsm/libs/basis');
const DST_DIR = path.resolve('public/basis');
const FILES = ['basis_transcoder.js', 'basis_transcoder.wasm'];

async function copyIfNeeded(src: string, dst: string): Promise<void> {
  const [srcStat, dstStat] = await Promise.all([
    fs.stat(src),
    fs.stat(dst).catch(() => null),
  ]);

  if (dstStat && dstStat.size === srcStat.size && dstStat.mtimeMs >= srcStat.mtimeMs) {
    console.log(`[copy-basis] Up to date: ${path.basename(dst)}`);
    return;
  }

  await fs.copyFile(src, dst);
  console.log(`[copy-basis] Copied: ${path.basename(src)} → public/basis/`);
}

async function main() {
  await fs.mkdir(DST_DIR, { recursive: true });

  await Promise.all(
    FILES.map((file) =>
      copyIfNeeded(path.join(SRC_DIR, file), path.join(DST_DIR, file)),
    ),
  );

  console.log('[copy-basis] Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
