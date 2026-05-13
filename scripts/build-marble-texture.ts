/**
 * Generates public/textures/marble.png at build time.
 * Ports the exact noise/turbulence algorithm from Hero3D.tsx createMarbleTexture()
 * so we ship a PNG instead of running 65,536 iterations on the main thread per page load.
 */
import * as path from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';

const SIZE = 256;
const OUT_DIR = path.resolve('public/textures');
const OUT_PATH = path.join(OUT_DIR, 'marble.png');

const hash = (n: number) => { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); };
const noise2d = (x: number, y: number) => {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57), b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57), d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
};
const turbulence = (x: number, y: number) => {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < 4; i++) { v += Math.abs(noise2d(x * f, y * f) - 0.5) * a; a *= 0.5; f *= 2.1; }
  return v;
};

async function buildMarbleTexture() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const pixels = new Uint8Array(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const nx = (x / SIZE) * 5, ny = (y / SIZE) * 5;
      const t = turbulence(nx, ny);
      const vein = Math.sin((nx + ny) * 1.8 + t * 9) * 0.5 + 0.5;
      const bright = 0.78 + vein * 0.18;
      const i = (y * SIZE + x) * 4;
      pixels[i]     = Math.min(255, Math.floor(bright * 242));
      pixels[i + 1] = Math.min(255, Math.floor(bright * 236));
      pixels[i + 2] = Math.min(255, Math.floor(bright * 225));
      pixels[i + 3] = 255;
    }
  }

  await sharp(Buffer.from(pixels), { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(OUT_PATH);

  const stat = await fs.stat(OUT_PATH);
  console.log(`[build-marble-texture] Written ${OUT_PATH} (${Math.round(stat.size / 1024)} KiB)`);
}

buildMarbleTexture().catch(err => { console.error(err); process.exit(1); });
