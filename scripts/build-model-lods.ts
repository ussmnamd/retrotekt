/**
 * Generates three LOD variants of the hero GLB for mobile/tablet/desktop.
 * Input:  model-sources/heromodel.glb, or HERO_MODEL_SOURCE if set.
 * Output: public/models/hero-{mobile,tablet,desktop}.glb
 *
 * Geometry compression: EXT_meshopt_compression (via meshopt).
 * Texture compression:  EXT_texture_webp (via sharp).
 *
 * Skips regeneration if all outputs exist and are newer than the source. If the
 * source is unavailable in CI, existing generated outputs are reused.
 */
import * as path from 'path';
import * as fs from 'fs/promises';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTTextureWebP } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, quantize, simplify, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const draco3d = require('draco3d');

const SRC = path.resolve(process.env.HERO_MODEL_SOURCE || 'model-sources/heromodel.glb');
const SCRIPT = path.resolve('scripts/build-model-lods.ts');

type MeshoptLevel = 'medium' | 'high';
const LODS = [
  // Target sizes: mobile 1.5-2 MB, tablet 3-4 MB, desktop 4-5 MB.
  // meshLevel 'high' = aggressive quantization filter (smaller, slightly lossy).
  // Conservative simplification — aggressive ratios produce visible holes.
  // `error` is the geometric tolerance (lower = stricter = fewer holes).
  { name: 'hero-mobile',  ratio: 0.15, error: 0.012, resize: [96, 96]   as [number, number], quality: 56, meshLevel: 'high' as MeshoptLevel, posBits: 11, uvBits: 9,  normBits: 8  },
  { name: 'hero-tablet',  ratio: 0.50, error: 0.005, resize: [256, 256] as [number, number], quality: 68, meshLevel: 'high' as MeshoptLevel, posBits: 13, uvBits: 11, normBits: 9  },
  { name: 'hero-desktop', ratio: 0.75, error: 0.002, resize: [512, 512] as [number, number], quality: 76, meshLevel: 'high' as MeshoptLevel, posBits: 14, uvBits: 12, normBits: 10 },
] as const;

// ── Degenerate-texture pruning ────────────────────────────────────────────────

async function dropDegenerateTextures(doc: Document) {
  // Don't dispose 1-pixel-tall textures — they're often gradient strips
  // referenced by materials. Disposing them leaves materials with a null
  // baseColorTexture, which falls back to the baseColorFactor (often black)
  // and renders surfaces as black holes. Instead, upscale them to at least
  // 4x4 so sharp can encode them consistently.
  for (const texture of doc.getRoot().listTextures()) {
    const image = texture.getImage();
    if (!image) continue;

    try {
      const metadata = await sharp(image).metadata();
      const w = metadata.width ?? 0;
      const h = metadata.height ?? 0;
      if (w < 4 || h < 4) {
        const targetW = Math.max(w, 4);
        const targetH = Math.max(h, 4);
        console.warn(
          `  [info] upscaling tiny texture "${texture.getName() || '(unnamed)'}" ` +
          `from ${w}x${h} to ${targetW}x${targetH}`,
        );
        const padded = await sharp(image)
          .resize(targetW, targetH, { fit: 'fill', kernel: 'nearest' })
          .png()
          .toBuffer();
        texture.setImage(new Uint8Array(padded));
        texture.setMimeType('image/png');
      }
    } catch (e) {
      console.warn(`  [warn] could not normalise texture "${texture.getName() || '(unnamed)'}": ${(e as Error).message} — leaving as-is`);
    }
  }
}

// ── WebP bulk encode for a document ──────────────────────────────────────────

/**
 * For every texture in the document:
 *  1. Resize + normalise with sharp.
 *  2. Encode to WebP.
 *  3. Swap the raw image data and MIME type on the gltf-transform Texture.
 */
async function compressTexturesToWebP(doc: Document, resize: [number, number], quality: number): Promise<void> {
  doc.createExtension(EXTTextureWebP).setRequired(true);

  // Resize + WebP-encode each texture individually. We clamp per-axis to the
  // source dimension, ensuring extreme aspect ratios (e.g. 598x4 gradient strips)
  // can't collapse to height 0 and abort the whole batch.
  const [maxW, maxH] = resize;
  const textures = doc.getRoot().listTextures();
  let encoded = 0;
  let skipped = 0;

  await Promise.all(textures.map(async (texture) => {
    const image = texture.getImage();
    if (!image) return;

    try {
      const meta = await sharp(image).metadata();
      const srcW = meta.width  ?? 0;
      const srcH = meta.height ?? 0;
      if (srcW < 4 || srcH < 4) {
        skipped++;
        return; // should have been padded earlier; safety net
      }

      // Clamp each axis independently to the LOD cap, preserving aspect.
      const scale = Math.min(1, maxW / srcW, maxH / srcH);
      const targetW = Math.max(4, Math.round(srcW * scale));
      const targetH = Math.max(4, Math.round(srcH * scale));

      const webpBuffer = await sharp(image)
        .resize(targetW, targetH, { fit: 'fill' })
        .webp({ quality, effort: 4 })
        .toBuffer();

      texture.setImage(new Uint8Array(webpBuffer));
      texture.setMimeType('image/webp');
      encoded++;
    } catch (e) {
      console.warn(`  [warn] WebP encoding failed for "${texture.getName() || '(unnamed)'}": ${(e as Error).message} - keeping original`);
      skipped++;
    }
  }));

  console.log(`  [textures] ${encoded} encoded to WebP, ${skipped} kept original`);
}

// ── Paths ─────────────────────────────────────────────────────────────────────

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

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!(await needsRebuild())) {
    console.log('[build-model-lods] All LODs up to date, skipping.');
    return;
  }

  await MeshoptEncoder.ready;
  await MeshoptSimplifier.ready;

  // Source GLB has Draco-compressed primitives — register the decoder so the
  // reader can decode them. No encoder is registered: outputs use Meshopt.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoderModule: any = await draco3d.createDecoderModule();

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': decoderModule,
      'meshopt.encoder': MeshoptEncoder,
    });

  for (const lod of LODS) {
    const dest = await outPath(lod.name);
    console.log(`\n[build-model-lods] Generating ${lod.name}…`);

    const doc = await io.read(SRC);
    await dropDegenerateTextures(doc);

    // Compress textures first while the original image data is still available.
    await compressTexturesToWebP(doc, lod.resize, lod.quality);

    // Deduplicate after texture encode (same WebP buffers can now be merged).
    try {
      await doc.transform(dedup());
    } catch (e) {
      console.warn(`  [warn] dedup step failed: ${(e as Error).message}`);
    }

    // Simplify geometry, then apply Meshopt compression.
    try {
      await doc.transform(
        prune(),
        weld(),
        simplify({ simplifier: MeshoptSimplifier, ratio: lod.ratio, error: lod.error, lockBorder: true }),
        quantize({
          quantizePosition: lod.posBits,
          quantizeTexcoord: lod.uvBits,
          quantizeNormal:   lod.normBits,
        }),
        meshopt({ encoder: MeshoptEncoder, level: lod.meshLevel }),
        prune(),
      );
    } catch (e) {
      console.warn(`  [warn] simplify/meshopt step failed: ${(e as Error).message} — writing without simplification`);
    }

    // Always remove the inherited KHR_draco_mesh_compression extension — we
    // have no Draco encoder registered, so leaving it on the doc would break
    // the writer. Meshopt re-encode (when it succeeds) makes Draco redundant
    // anyway; on failure, the geometry is still raw (uncompressed) which is
    // valid without the extension.
    for (const ext of doc.getRoot().listExtensionsUsed()) {
      if (ext.extensionName === 'KHR_draco_mesh_compression') ext.dispose();
    }

    await io.write(dest, doc);

    const stat = await fs.stat(dest);
    const mb = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ ${dest} (${mb} MB)`);
  }

  console.log('\n[build-model-lods] Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
