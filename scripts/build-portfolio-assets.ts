/**
 * scripts/build-portfolio-assets.ts
 * AUTO-RUNS: npm run build:portfolio
 *
 * Transcodes source media from portfolio/ into public/portfolio/.
 * Writes typed manifest to app/portfolio/assets.ts.
 * Idempotent — wipes public/portfolio/ on each run.
 *
 * Image paths in manifest start with /portfolio/... (absolute from public/).
 * ResponsiveImage.avif/.webp/.jpg point to the LARGEST variant (2400w renders,
 * 1600w before/construction). Full srcset data is in the widths array; pages
 * can build <source srcset> from it if needed.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const FFMPEG =
  process.env.FFMPEG ??
  "C:\\Users\\uahme\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin\\ffmpeg.exe";

const FFPROBE =
  process.env.FFPROBE ??
  "C:\\Users\\uahme\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin\\ffprobe.exe";

const ROOT = path.resolve(process.cwd());
const SRC_ROOT = path.join(ROOT, "portfolio");
const OUT_ROOT = path.join(ROOT, "public", "portfolio");
const MANIFEST_PATH = path.join(ROOT, "app", "portfolio", "assets.ts");

const IMG_QUALITY = { avif: 60, webp: 78, jpg: 82 };
const RENDER_WIDTHS = [2400, 1600, 800] as const;
const PHOTO_WIDTHS = [1600, 800] as const;

// ─── TYPES ───────────────────────────────────────────────────────────────────

type ResponsiveImage = {
  avif: string;
  webp: string;
  jpg: string;
  width: number;
  height: number;
  alt: string;
  srcsetAvif: string;
  srcsetWebp: string;
  srcsetJpg: string;
};

type ProjectVideo = {
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
};

type ProjectAssets = {
  before: ResponsiveImage[];
  construction: ResponsiveImage[];
  renders: ResponsiveImage[];
  videos: ProjectVideo[];
  heroLoop?: ProjectVideo;
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function ffmpeg(args: string[]): void {
  const result = spawnSync(FFMPEG, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffmpeg exited ${result.status}`);
}

function ffprobeSize(filePath: string): { width: number; height: number } {
  const result = spawnSync(
    FFPROBE,
    [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=p=0",
      filePath,
    ],
    { encoding: "utf8" }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffprobe exited ${result.status}`);
  const [w, h] = result.stdout.trim().split(",").map(Number);
  if (!w || !h) throw new Error(`ffprobe: could not parse dimensions from '${result.stdout}'`);
  return { width: w, height: h };
}

function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}

function fileSize(p: string): number {
  return fs.statSync(p).size;
}

function sortedFiles(dir: string, exts: string[]): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => exts.includes(path.extname(f).toLowerCase()))
    .sort();
}

/** For renders: when both .jpg and .png exist for same base name, keep .jpg only */
function dedupeRendersPreferJpg(dir: string): string[] {
  const all = fs.readdirSync(dir);
  const jpgBases = new Set(
    all
      .filter((f) => path.extname(f).toLowerCase() === ".jpg")
      .map((f) => path.basename(f, path.extname(f)))
  );
  return all
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      if (ext === ".png") {
        const base = path.basename(f, ".png");
        if (jpgBases.has(base)) return false; // skip png duplicate
      }
      return [".jpg", ".jpeg", ".png"].includes(ext);
    })
    .sort();
}

// ─── IMAGE PROCESSING ────────────────────────────────────────────────────────

type ImageWidths = readonly number[];

async function processImage(
  srcFile: string,
  outDir: string,
  slug: string, // e.g. "01"
  widths: ImageWidths,
  avifQuality: number = IMG_QUALITY.avif
): Promise<{ width: number; height: number; srcsetAvif: string; srcsetWebp: string; srcsetJpg: string }> {
  ensureDir(outDir);

  // sharp().rotate() honors EXIF orientation before any resize
  const base = sharp(srcFile).rotate();
  const meta = await base.metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  const largest = widths[0];

  const avifParts: string[] = [];
  const webpParts: string[] = [];
  const jpgParts: string[] = [];

  for (const w of widths) {
    const effective = Math.min(w, srcW) || w;
    const scale = effective / (srcW || effective);
    const h = Math.round((srcH || 0) * scale);

    const avifPath = path.join(outDir, `${slug}-${w}.avif`);
    const webpPath = path.join(outDir, `${slug}-${w}.webp`);
    const jpgPath = path.join(outDir, `${slug}-${w}.jpg`);

    // Reload each time — sharp pipelines are single-use
    await sharp(srcFile)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: avifQuality })
      .toFile(avifPath);

    await sharp(srcFile)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: IMG_QUALITY.webp })
      .toFile(webpPath);

    await sharp(srcFile)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: IMG_QUALITY.jpg, mozjpeg: true })
      .toFile(jpgPath);

    // Validate 2400w AVIF ≤ 400KB, retry at q55 once
    if (w === 2400) {
      const sz = fileSize(avifPath);
      if (sz > 400 * 1024) {
        console.log(`    [warn] ${slug}-2400.avif ${(sz / 1024).toFixed(0)}KB > 400KB — retrying at q55`);
        await sharp(srcFile)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .avif({ quality: 55 })
          .toFile(avifPath);
      }
    }

    const publicAvif = avifPath.replace(path.join(ROOT, "public"), "").replace(/\\/g, "/");
    const publicWebp = webpPath.replace(path.join(ROOT, "public"), "").replace(/\\/g, "/");
    const publicJpg = jpgPath.replace(path.join(ROOT, "public"), "").replace(/\\/g, "/");

    avifParts.push(`${publicAvif} ${w}w`);
    webpParts.push(`${publicWebp} ${w}w`);
    jpgParts.push(`${publicJpg} ${w}w`);

    const sizeKB = (fileSize(avifPath) / 1024).toFixed(0);
    console.log(`    ${slug}-${w}: avif ${sizeKB}KB`);
  }

  return {
    width: Math.min(largest, srcW || largest),
    height: Math.round((srcH || 0) * (Math.min(largest, srcW || largest) / (srcW || 1))),
    srcsetAvif: avifParts.join(", "),
    srcsetWebp: webpParts.join(", "),
    srcsetJpg: jpgParts.join(", "),
  };
}

function publicUrl(absPath: string): string {
  return absPath.replace(path.join(ROOT, "public"), "").replace(/\\/g, "/");
}

async function processPhotoSection(
  srcDir: string,
  outDir: string,
  files: string[],
  widths: ImageWidths,
  altPrefix: string
): Promise<ResponsiveImage[]> {
  ensureDir(outDir);
  const results: ResponsiveImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const slug = String(i + 1).padStart(2, "0");
    const srcFile = path.join(srcDir, files[i]);
    console.log(`  [${slug}] ${files[i]}`);

    const { width, height, srcsetAvif, srcsetWebp, srcsetJpg } = await processImage(
      srcFile,
      outDir,
      slug,
      widths
    );

    const largestW = widths[0];
    results.push({
      avif: publicUrl(path.join(outDir, `${slug}-${largestW}.avif`)),
      webp: publicUrl(path.join(outDir, `${slug}-${largestW}.webp`)),
      jpg: publicUrl(path.join(outDir, `${slug}-${largestW}.jpg`)),
      width,
      height,
      alt: `${altPrefix} ${i + 1}`,
      srcsetAvif,
      srcsetWebp,
      srcsetJpg,
    });
  }

  return results;
}

// ─── VIDEO PROCESSING ────────────────────────────────────────────────────────

function encodeWalkthrough(
  srcFile: string,
  outBase: string, // no extension
  crf: number = 23
): ProjectVideo {
  const mp4 = `${outBase}.mp4`;
  const webm = `${outBase}.webm`;
  const poster = `${outBase}.poster.jpg`;

  console.log(`  encoding mp4...`);
  ffmpeg([
    "-y", "-i", srcFile,
    "-c:v", "libx264", "-preset", "slow", `-crf`, String(crf),
    "-vf", "scale=1920:-2:flags=lanczos",
    "-movflags", "+faststart",
    "-an",
    mp4,
  ]);

  // Validate ≤15MB, retry once at crf+2
  const mp4Size = fileSize(mp4);
  if (mp4Size > 15 * 1024 * 1024) {
    console.log(`  [warn] mp4 ${(mp4Size / 1024 / 1024).toFixed(1)}MB > 15MB — retrying at crf ${crf + 2}`);
    ffmpeg([
      "-y", "-i", srcFile,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(crf + 2),
      "-vf", "scale=1920:-2:flags=lanczos",
      "-movflags", "+faststart",
      "-an",
      mp4,
    ]);
  }

  console.log(`  encoding webm (VP9 — slow)...`);
  ffmpeg([
    "-y", "-i", srcFile,
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "33",
    "-vf", "scale=1920:-2:flags=lanczos",
    "-an", "-row-mt", "1", "-threads", "4",
    webm,
  ]);

  console.log(`  extracting poster...`);
  ffmpeg([
    "-y", "-ss", "2", "-i", srcFile,
    "-frames:v", "1", "-q:v", "3",
    poster,
  ]);

  const dims = ffprobeSize(mp4);
  return {
    mp4: publicUrl(mp4),
    webm: publicUrl(webm),
    poster: publicUrl(poster),
    width: dims.width,
    height: dims.height,
  };
}

function encodeHeroLoop(srcFile: string, outDir: string): ProjectVideo {
  const mp4 = path.join(outDir, "hero-loop.mp4");
  const webm = path.join(outDir, "hero-loop.webm");
  const poster = path.join(outDir, "hero-loop.poster.jpg");

  console.log(`  encoding hero-loop mp4...`);
  ffmpeg([
    "-y", "-ss", "0", "-t", "6", "-i", srcFile,
    "-c:v", "libx264", "-preset", "slow", "-crf", "26",
    "-vf", "scale=1280:-2:flags=lanczos",
    "-an", "-movflags", "+faststart",
    mp4,
  ]);

  console.log(`  encoding hero-loop webm (VP9 — slow)...`);
  ffmpeg([
    "-y", "-ss", "0", "-t", "6", "-i", srcFile,
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36",
    "-vf", "scale=1280:-2:flags=lanczos",
    "-an", "-row-mt", "1", "-threads", "4",
    webm,
  ]);

  console.log(`  extracting hero-loop poster...`);
  ffmpeg([
    "-y", "-ss", "1", "-i", srcFile,
    "-frames:v", "1", "-q:v", "3",
    poster,
  ]);

  const dims = ffprobeSize(mp4);
  return {
    mp4: publicUrl(mp4),
    webm: publicUrl(webm),
    poster: publicUrl(poster),
    width: dims.width,
    height: dims.height,
  };
}

// ─── MANIFEST WRITER ─────────────────────────────────────────────────────────

function serializeImage(img: ResponsiveImage): string {
  return `    {
      avif: ${JSON.stringify(img.avif)},
      webp: ${JSON.stringify(img.webp)},
      jpg: ${JSON.stringify(img.jpg)},
      width: ${img.width},
      height: ${img.height},
      alt: ${JSON.stringify(img.alt)},
      srcsetAvif: ${JSON.stringify(img.srcsetAvif)},
      srcsetWebp: ${JSON.stringify(img.srcsetWebp)},
      srcsetJpg: ${JSON.stringify(img.srcsetJpg)},
    }`;
}

function serializeVideo(v: ProjectVideo): string {
  return `    {
      mp4: ${JSON.stringify(v.mp4)},
      webm: ${JSON.stringify(v.webm)},
      poster: ${JSON.stringify(v.poster)},
      width: ${v.width},
      height: ${v.height},
    }`;
}

function writeManifest(assets: Record<string, ProjectAssets>): void {
  const keys = Object.keys(assets);

  const sections = keys.map((key) => {
    const p = assets[key];
    const heroLoop = p.heroLoop
      ? `    heroLoop: ${serializeVideo(p.heroLoop).trim()},`
      : "";

    return `  ${key}: {
    before: [
${p.before.map(serializeImage).join(",\n")}
    ],
    construction: [
${p.construction.map(serializeImage).join(",\n")}
    ],
    renders: [
${p.renders.map(serializeImage).join(",\n")}
    ],
    videos: [
${p.videos.map(serializeVideo).join(",\n")}
    ],${heroLoop ? "\n" + heroLoop : ""}
  }`;
  });

  const content = `// AUTO-GENERATED by scripts/build-portfolio-assets.ts — do not hand-edit.
// ResponsiveImage.avif/.webp/.jpg → largest variant (2400w renders, 1600w before/construction).
// srcsetAvif/srcsetWebp/srcsetJpg → full srcset strings for <source srcset> usage.

export type ResponsiveImage = {
  avif: string;
  webp: string;
  jpg: string;
  width: number;
  height: number;
  alt: string;
  srcsetAvif: string;
  srcsetWebp: string;
  srcsetJpg: string;
};

export type ProjectVideo = {
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
};

export type ProjectAssets = {
  before: ResponsiveImage[];
  construction: ResponsiveImage[];
  renders: ResponsiveImage[];
  videos: ProjectVideo[];
  heroLoop?: ProjectVideo;
};

export type AssetKey = 'modesto' | 'livermore' | 'sacramento';

export const portfolioAssets: Record<AssetKey, ProjectAssets> = {
${sections.join(",\n")}
};
`;

  ensureDir(path.dirname(MANIFEST_PATH));
  fs.writeFileSync(MANIFEST_PATH, content, "utf8");
  console.log(`\nManifest written → ${MANIFEST_PATH}`);
}

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

function dirSizeBytes(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSizeBytes(full);
    else total += fileSize(full);
  }
  return total;
}

function printSummary(projects: string[]): void {
  console.log("\n─── Summary ──────────────────────────────────────────");
  let grandTotal = 0;
  for (const p of projects) {
    const dir = path.join(OUT_ROOT, p);
    const bytes = dirSizeBytes(dir);
    grandTotal += bytes;
    console.log(`  ${p.padEnd(12)} ${(bytes / 1024 / 1024).toFixed(1).padStart(6)} MB`);
  }
  console.log(`  ${"TOTAL".padEnd(12)} ${(grandTotal / 1024 / 1024).toFixed(1).padStart(6)} MB`);

  // Count files
  for (const p of projects) {
    const dir = path.join(OUT_ROOT, p);
    if (!fs.existsSync(dir)) continue;
    let count = 0;
    const countFiles = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory()) countFiles(path.join(d, e.name));
        else count++;
      }
    };
    countFiles(dir);
    console.log(`  ${p}: ${count} files`);
  }
  console.log("──────────────────────────────────────────────────────\n");
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const t0 = Date.now();

  // Wipe output for idempotency
  if (fs.existsSync(OUT_ROOT)) {
    fs.rmSync(OUT_ROOT, { recursive: true, force: true });
    console.log("Wiped public/portfolio/");
  }
  ensureDir(OUT_ROOT);

  // ── MODESTO ──────────────────────────────────────────────────────────────

  console.log("\n=== MODESTO ===");

  const modestoBeforeDir = path.join(SRC_ROOT, "modesto construct beofre");
  const modestoConstructDir = path.join(SRC_ROOT, "modesto construct");
  const modestoRendersDir = path.join(SRC_ROOT, "modesto renders");
  const modestoVideosDir = path.join(SRC_ROOT, "modesto videos");

  console.log("\n-- before --");
  const beforeFiles = sortedFiles(modestoBeforeDir, [".jpg", ".jpeg"]);
  const modestoBeforeOut = path.join(OUT_ROOT, "modesto", "before");
  const modestoBefore = await processPhotoSection(
    modestoBeforeDir, modestoBeforeOut, beforeFiles, PHOTO_WIDTHS,
    "Chocolate Fish Modesto — site before construction"
  );

  console.log("\n-- construction --");
  const constructFiles = sortedFiles(modestoConstructDir, [".jpg", ".jpeg"]);
  const modestoConstructOut = path.join(OUT_ROOT, "modesto", "construction");
  const modestoConstruction = await processPhotoSection(
    modestoConstructDir, modestoConstructOut, constructFiles, PHOTO_WIDTHS,
    "Chocolate Fish Modesto — construction in progress"
  );

  console.log("\n-- renders --");
  const renderFiles = dedupeRendersPreferJpg(modestoRendersDir);
  const modestoRendersOut = path.join(OUT_ROOT, "modesto", "renders");
  const modestoRenders = await processPhotoSection(
    modestoRendersDir, modestoRendersOut, renderFiles, RENDER_WIDTHS,
    "Chocolate Fish Modesto — render"
  );

  console.log("\n-- videos --");
  const videoDir = path.join(OUT_ROOT, "modesto", "videos");
  ensureDir(videoDir);

  const videoSources = [
    "modesto video (1).mp4",
    "modesto video (2).mp4",
    "modesto video (5).mp4",
  ];
  const modestoVideos: ProjectVideo[] = [];

  for (let i = 0; i < videoSources.length; i++) {
    const src = path.join(modestoVideosDir, videoSources[i]);
    const outBase = path.join(videoDir, `walkthrough-0${i + 1}`);
    console.log(`\n  [walkthrough-0${i + 1}] ${videoSources[i]}`);
    const vid = encodeWalkthrough(src, outBase);
    modestoVideos.push(vid);
    console.log(`  mp4: ${(fileSize(path.join(ROOT, "public") + vid.mp4.replace(/\//g, path.sep)) / 1024 / 1024).toFixed(1)}MB`);
  }

  // Validate all 3 videos exist
  for (let i = 1; i <= 3; i++) {
    const mp4 = path.join(videoDir, `walkthrough-0${i}.mp4`);
    if (!fs.existsSync(mp4)) throw new Error(`Missing expected video: ${mp4}`);
  }

  console.log("\n  [hero-loop] from walkthrough-01 source");
  const heroLoop = encodeHeroLoop(path.join(modestoVideosDir, "modesto video (1).mp4"), videoDir);
  const heroLoopMp4 = path.join(videoDir, "hero-loop.mp4");
  if (!fs.existsSync(heroLoopMp4)) throw new Error("hero-loop.mp4 not produced");
  console.log(`  hero-loop mp4: ${(fileSize(heroLoopMp4) / 1024 / 1024).toFixed(1)}MB`);

  const modestoAssets: ProjectAssets = {
    before: modestoBefore,
    construction: modestoConstruction,
    renders: modestoRenders,
    videos: modestoVideos,
    heroLoop,
  };

  // ── LIVERMORE ────────────────────────────────────────────────────────────

  console.log("\n=== LIVERMORE ===");

  const livermoreCDir = path.join(SRC_ROOT, "livermore construct");
  const livermoreRDir = path.join(SRC_ROOT, "Livermore renders");

  console.log("\n-- construction --");
  const livermoreConstructFiles = sortedFiles(livermoreCDir, [".jpg", ".jpeg"]);
  const livermoreConstructOut = path.join(OUT_ROOT, "livermore", "construction");
  const livermoreConstruction = await processPhotoSection(
    livermoreCDir, livermoreConstructOut, livermoreConstructFiles, PHOTO_WIDTHS,
    "Chocolate Fish Livermore — construction in progress"
  );

  console.log("\n-- renders --");
  const livermoreRenderFiles = dedupeRendersPreferJpg(livermoreRDir);
  const livermoreRendersOut = path.join(OUT_ROOT, "livermore", "renders");
  const livermoreRenders = await processPhotoSection(
    livermoreRDir, livermoreRendersOut, livermoreRenderFiles, RENDER_WIDTHS,
    "Chocolate Fish Livermore — render"
  );

  const livermoreAssets: ProjectAssets = {
    before: [],
    construction: livermoreConstruction,
    renders: livermoreRenders,
    videos: [],
  };

  // ── SACRAMENTO ───────────────────────────────────────────────────────────

  console.log("\n=== SACRAMENTO ===");

  const sacramentoCDir = path.join(SRC_ROOT, "Sacremento Construct");
  const sacramentoRDir = path.join(SRC_ROOT, "Sacremento Renders");

  console.log("\n-- construction --");
  const sacramentoConstructFiles = sortedFiles(sacramentoCDir, [".jpg", ".jpeg"]);
  const sacramentoConstructOut = path.join(OUT_ROOT, "sacramento", "construction");
  const sacramentoConstruction = await processPhotoSection(
    sacramentoCDir, sacramentoConstructOut, sacramentoConstructFiles, PHOTO_WIDTHS,
    "Chocolate Fish Sacramento — construction in progress"
  );

  console.log("\n-- renders --");
  const sacramentoRenderFiles = dedupeRendersPreferJpg(sacramentoRDir);
  const sacramentoRendersOut = path.join(OUT_ROOT, "sacramento", "renders");
  const sacramentoRenders = await processPhotoSection(
    sacramentoRDir, sacramentoRendersOut, sacramentoRenderFiles, RENDER_WIDTHS,
    "Chocolate Fish Sacramento — render"
  );

  const sacramentoAssets: ProjectAssets = {
    before: [],
    construction: sacramentoConstruction,
    renders: sacramentoRenders,
    videos: [],
  };

  // ── MANIFEST ─────────────────────────────────────────────────────────────

  writeManifest({
    modesto: modestoAssets,
    livermore: livermoreAssets,
    sacramento: sacramentoAssets,
  });

  // ── SUMMARY ──────────────────────────────────────────────────────────────

  printSummary(["modesto", "livermore", "sacramento"]);

  const elapsed = ((Date.now() - t0) / 1000 / 60).toFixed(1);
  console.log(`Done in ${elapsed} min.\n`);
}

main().catch((err) => {
  console.error("\nBUILD FAILED:", err);
  process.exit(1);
});
