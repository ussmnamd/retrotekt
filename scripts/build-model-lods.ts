/**
 * Generates three LOD variants of the hero GLB for mobile/tablet/desktop.
 * Input:  model-sources/heromodel.glb, or HERO_MODEL_SOURCE if set.
 * Output: public/models/hero-{mobile,tablet,desktop}.glb
 *
 * Geometry compression: EXT_meshopt_compression (via meshopt).
 * Texture compression:  KTX2/BasisU ETC1S (via toktx CLI).
 *
 * Requires toktx on PATH — install from:
 *   https://github.com/KhronosGroup/KTX-Software/releases
 *
 * Skips regeneration if all outputs exist and are newer than the source. If the
 * source is unavailable in CI, existing generated outputs are reused.
 */
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRTextureBasisu } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, quantize, simplify, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const draco3d = require('draco3d');

const execFileAsync = promisify(execFile);

const SRC = path.resolve(process.env.HERO_MODEL_SOURCE || 'model-sources/heromodel.glb');
const SCRIPT = path.resolve('scripts/build-model-lods.ts');

type MeshoptLevel = 'medium' | 'high';
const LODS = [
  // Target sizes: mobile 1.5-2 MB, tablet 3-4 MB, desktop 4-5 MB.
  // qlevel = ETC1S quality (1-255, lower = smaller); mipmaps add ~33% size.
  // meshLevel 'high' = aggressive quantization filter (smaller, slightly lossy).
  // Conservative simplification — aggressive ratios produce visible holes.
  // `error` is the geometric tolerance (lower = stricter = fewer holes).
  { name: 'hero-mobile',  ratio: 0.15, error: 0.012, resize: [96, 96]   as [number, number], qlevel: 70,  mipmaps: false, meshLevel: 'high'   as MeshoptLevel, posBits: 11, uvBits: 9,  normBits: 8  },
  { name: 'hero-tablet',  ratio: 0.50, error: 0.005, resize: [256, 256] as [number, number], qlevel: 130, mipmaps: true,  meshLevel: 'high'   as MeshoptLevel, posBits: 13, uvBits: 11, normBits: 9  },
  { name: 'hero-desktop', ratio: 0.75, error: 0.002, resize: [512, 512] as [number, number], qlevel: 144, mipmaps: true,  meshLevel: 'high'   as MeshoptLevel, posBits: 14, uvBits: 12, normBits: 10 },
] as const;

// ── toktx detection ───────────────────────────────────────────────────────────

async function assertToktxAvailable(): Promise<void> {
  try {
    await execFileAsync('toktx', ['--version']);
  } catch {
    throw new Error(
      '[build-model-lods] toktx not found on PATH.\n' +
      'Install KTX-Software from https://github.com/KhronosGroup/KTX-Software/releases ' +
      'and ensure `toktx` is on PATH, then re-run.',
    );
  }
}

// ── KTX2 encoding for a single texture ───────────────────────────────────────

/**
 * Encodes a PNG buffer to KTX2 (ETC1S) by shelling out to the toktx CLI.
 * Returns the KTX2 binary buffer.
 */
async function encodePngToKtx2(pngBuffer: Uint8Array, qlevel: number, mipmaps: boolean): Promise<Uint8Array> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ktx2-'));
  const inFile  = path.join(tmpDir, 'in.png');
  const outFile = path.join(tmpDir, 'out.ktx2');
  try {
    await fs.writeFile(inFile, pngBuffer);
    const args = [
      '--encode',  'etc1s',
      '--qlevel', String(qlevel),
      '--clevel',  '1',
      '--assign_oetf', 'srgb',
    ];
    if (mipmaps) args.unshift('--genmipmap');
    args.push(outFile, inFile);
    await execFileAsync('toktx', args);
    return new Uint8Array(await fs.readFile(outFile));
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

// ── Degenerate-texture pruning ────────────────────────────────────────────────

async function dropDegenerateTextures(doc: Document) {
  // Don't dispose 1-pixel-tall textures — they're often gradient strips
  // referenced by materials. Disposing them leaves materials with a null
  // baseColorTexture, which falls back to the baseColorFactor (often black)
  // and renders surfaces as black holes. Instead, upscale them to at least
  // 4×4 so KTX2/sharp can encode them. KTX2/BasisU requires dimensions ≥ 4.
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

// ── KTX2 bulk encode for a document ──────────────────────────────────────────

/**
 * For every texture in the document:
 *  1. Resize + normalise to PNG (sharp).
 *  2. Encode to KTX2/ETC1S (toktx CLI).
 *  3. Swap the raw image data and MIME type on the gltf-transform Texture.
 */
async function compressTexturesToKtx2(doc: Document, resize: [number, number], qlevel: number, mipmaps: boolean): Promise<void> {
  // Declare KHR_texture_basisu on the doc so writer marks textures as KTX2.
  // Without this, the glTF lacks "extensionsUsed":["KHR_texture_basisu"] and
  // GLTFLoader tries to decode the KTX2 bytes as PNG → white materials.
  doc.createExtension(KHRTextureBasisu).setRequired(true);

  // Resize + KTX2-encode each texture individually. We do the resize manually
  // (rather than via textureCompress) so we can clamp per-axis to the source
  // dimension, ensuring extreme aspect ratios (e.g. 598×4 gradient strips)
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

      const pngBuffer = await sharp(image)
        .resize(targetW, targetH, { fit: 'fill' })
        .png()
        .toBuffer();

      const ktx2Buffer = await encodePngToKtx2(new Uint8Array(pngBuffer), qlevel, mipmaps);
      texture.setImage(ktx2Buffer);
      texture.setMimeType('image/ktx2');
      encoded++;
    } catch (e) {
      console.warn(`  [warn] toktx encoding failed for "${texture.getName() || '(unnamed)'}": ${(e as Error).message} — keeping original`);
      skipped++;
    }
  }));

  console.log(`  [textures] ${encoded} encoded to KTX2, ${skipped} kept as PNG`);
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

  // Fail early if toktx is not available — do not proceed without KTX2.
  await assertToktxAvailable();

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

    // Compress + KTX2-encode textures FIRST on the original (valid) texture data.
    await compressTexturesToKtx2(doc, lod.resize, lod.qlevel, lod.mipmaps);

    // Deduplicate after texture encode (same KTX2 buffers can now be merged).
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
