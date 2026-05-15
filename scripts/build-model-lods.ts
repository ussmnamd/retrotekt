/**
 * Generates three LOD variants of the hero GLB for mobile/tablet/desktop.
 * Input:  model-sources/heromodel.glb, or HERO_MODEL_SOURCE if set.
 * Output: public/models/hero-{mobile,tablet,desktop}.glb
 *
 * Skips regeneration if all outputs exist and are newer than the source. If the
 * source is unavailable in CI, existing generated outputs are reused.
 */
import * as path from 'path';
import * as fs from 'fs/promises';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco, prune, simplify, textureCompress, weld } from '@gltf-transform/functions';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const draco3d = require('draco3d');
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const SRC = path.resolve(process.env.HERO_MODEL_SOURCE || 'model-sources/heromodel.glb');
const SCRIPT = path.resolve('scripts/build-model-lods.ts');

const LODS = [
  // 122 textures in source; resize to max dimension to hit transfer targets
  { name: 'hero-mobile',  ratio: 0.18, error: 0.018, resize: [128, 128] as [number, number], quality: 52 },
  { name: 'hero-tablet',  ratio: 0.35, error: 0.010, resize: [384, 384] as [number, number], quality: 62 },
  { name: 'hero-desktop', ratio: 0.55, error: 0.004, resize: [768, 768] as [number, number], quality: 72 },
] as const;

async function dropDegenerateTextures(doc: Document) {
  for (const texture of doc.getRoot().listTextures()) {
    const image = texture.getImage();
    if (!image) continue;

    try {
      const metadata = await sharp(image).metadata();
      if ((metadata.width ?? 0) < 2 || (metadata.height ?? 0) < 2) {
        console.warn(
          `  [warn] dropping degenerate texture "${texture.getName() || '(unnamed)'}" ` +
          `(${metadata.width ?? 0}x${metadata.height ?? 0})`,
        );
        texture.dispose();
      }
    } catch (e) {
      console.warn(`  [warn] dropping unreadable texture "${texture.getName() || '(unnamed)'}": ${(e as Error).message}`);
      texture.dispose();
    }
  }
}

async function outPath(name: string) {
  return path.resolve('public/models', `${name}.glb`);
}

async function needsRebuild(): Promise<boolean> {
  const srcStat = await fs.stat(SRC).catch(() => null);
  if (!srcStat) {
    const allOutputsExist = await Promise.all(
      LODS.map(async (lod) => !!(await fs.stat(await outPath(lod.name)).catch(() => null))),
    );
    if (allOutputsExist.every(Boolean)) {
      console.warn(`[build-model-lods] Source not found at ${SRC}; using existing generated LODs.`);
      return false;
    }
    throw new Error(`[build-model-lods] Source model missing: ${SRC}`);
  }

  try {
    const scriptStat = await fs.stat(SCRIPT);
    const newestInputMtime = Math.max(srcStat.mtimeMs, scriptStat.mtimeMs);
    for (const lod of LODS) {
      const dest = await outPath(lod.name);
      const destStat = await fs.stat(dest).catch(() => null);
      if (!destStat || destStat.mtimeMs < newestInputMtime) return true;
    }
    return false;
  } catch {
    return true;
  }
}

async function main() {
  if (!(await needsRebuild())) {
    console.log('[build-model-lods] All LODs up to date, skipping.');
    return;
  }

  await MeshoptSimplifier.ready;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoderModule: any = await draco3d.createDecoderModule();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const encoderModule: any = await draco3d.createEncoderModule();

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': decoderModule,
      'draco3d.encoder': encoderModule,
    });

  for (const lod of LODS) {
    const dest = await outPath(lod.name);
    console.log(`\n[build-model-lods] Generating ${lod.name}…`);

    const doc = await io.read(SRC);
    await dropDegenerateTextures(doc);

    // Compress textures FIRST on the original (valid) texture data.
    try {
      await doc.transform(
        dedup(),
        textureCompress({
          encoder: sharp,
          // Keep existing WebP format; only resize down textures above the limit.
          resize: lod.resize,
          quality: lod.quality,
        }),
      );
    } catch (e) {
      console.warn(`  [warn] textureCompress step failed: ${(e as Error).message} — keeping original textures`);
    }

    // Then simplify geometry (may invalidate some mesh data, handled gracefully).
    try {
      await doc.transform(
        prune(),
        weld(),
        simplify({ simplifier: MeshoptSimplifier, ratio: lod.ratio, error: lod.error, lockBorder: true }),
        draco({
          method: 'edgebreaker',
          encodeSpeed: 5,
          decodeSpeed: 7,
          quantizePosition: 14,
          quantizeNormal: 10,
          quantizeTexcoord: 12,
          quantizeColor: 8,
        }),
        prune(),
      );
    } catch (e) {
      console.warn(`  [warn] simplify step failed: ${(e as Error).message} — writing without simplification`);
    }

    await io.write(dest, doc);

    const stat = await fs.stat(dest);
    const mb = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ ${dest} (${mb} MB)`);
  }

  console.log('\n[build-model-lods] Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
