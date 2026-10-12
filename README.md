# Retrotekt

Marketing and portfolio site for Retrotekt, an architectural 3D visualization studio serving the US market. It converts contractor and developer leads through photorealistic renders, walkthrough films and construction case studies, presented with a fullscreen interactive 3D hero.

Live at [www.retrotekt.com](https://www.retrotekt.com).

## Pages

| Route | Description |
|---|---|
| `/` | Fullscreen 3D hero, services overview, model showcase, process, portfolio preview |
| `/services` | Service catalog, solutions, the Retrotekt standard, payment promise |
| `/portfolio` | Project gallery filterable by Renders, Walkthroughs and Construction Story |
| `/portfolio/[slug]` | Project case study: renders, construction photos and (for Modesto) walkthrough videos |
| `/consulting` | Why Retrotekt vs. local studios, plus the inquiry form |
| `/api/contact` | `POST` endpoint for the inquiry form (see [Contact form](#contact-form)) |

Portfolio projects live in `app/portfolio/data.ts` (currently the Chocolate Fish Modesto, Livermore, Sacramento and Davis locations). `app/sitemap.ts` and `app/robots.ts` generate `sitemap.xml` and `robots.txt`, including one sitemap entry per project.

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Geist font
- Three.js for the 3D hero: Meshopt-compressed GLB LODs with WebP textures
- GSAP + ScrollTrigger for entrance and scroll-driven animation
- Resend for inquiry emails, Zod for request validation
- Vercel Analytics and Speed Insights
- Vitest + Testing Library (unit), Playwright (end-to-end)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key used by `/api/contact` |
| `CONTACT_EMAIL_TO` | Address that receives inquiries (defaults to `shahan@retrotekt.com`) |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `build:model-lods` first via `prebuild`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next lint`) |
| `npm run analyze` | Production build with the bundle analyzer |
| `npm test` / `npm run test:watch` | Vitest unit tests (`lib/__tests__`) |
| `npm run test:e2e` / `npm run test:e2e:ui` | Playwright tests (`e2e/`) against `next start` on port 3001; run `npm run build` first |
| `npm run build:model-lods` | Generate the hero GLB LODs (see [3D model](#3d-model)) |
| `npm run build:portfolio` | Transcode raw media from `portfolio/` into `public/portfolio/` and write `app/portfolio/assets.ts` |
| `npm run build:lqip` | Generate blur placeholders into `app/portfolio/lqip.ts` from the 800w AVIFs |
| `npm run build:showcase` | Generate AVIF/WebP/JPEG versions of the home page showcase images |
| `npm run build:ghosts` | Generate the tinted `-ghost.webp` showcase images |

The asset scripts are run by hand when media changes; their output is committed. Raw sources (`portfolio/`, `model-sources/`) are gitignored. `build:portfolio` needs ffmpeg and ffprobe; set `FFMPEG` and `FFPROBE` to their paths if the defaults don't match your machine.

## 3D model

Three LOD variants (`hero-mobile`, `hero-tablet`, `hero-desktop`) are served from `public/models/`. `scripts/build-model-lods.ts` generates them from `model-sources/heromodel.glb` (or `HERO_MODEL_SOURCE`) using:

- **Geometry**: `EXT_meshopt_compression` via `meshoptimizer` and gltf-transform, decoded in the browser by Three.js's `MeshoptDecoder`.
- **Textures**: resized WebP via `sharp` and `EXT_texture_webp`, which avoids client-side Basis/KTX2 transcoding stalls.

The script skips work when the outputs are newer than the source, and reuses the committed outputs when the source isn't available (as on Vercel). To swap the model, replace the source GLB and re-run `npm run build:model-lods`.

The viewer is lazy-loaded and excluded from SSR. On mobile it lowers pixel ratio, shadow resolution and animation speed, and the render loop pauses when the tab is hidden.

## Contact form

The form on `/consulting` posts JSON to `/api/contact`. The route validates it against `lib/schemas/contact.ts` (name, email, message required; company, project type and budget optional), rate-limits to 3 submissions per IP per 10 minutes, and sends an HTML email (`lib/emails/inquiry.tsx`) through Resend from `no-reply@retrotekt.com`, with the sender's address as reply-to. The rate limit is in memory, so it is per serverless instance rather than global.

## Deployment

The site deploys on Vercel; there are no GitHub Actions workflows.

- `vercel.json` redirects the apex `retrotekt.com` to `www.retrotekt.com` and serves `/models/*` as `model/gltf-binary`.
- `next.config.mjs` sets the Content Security Policy and other security headers (including HSTS), long-lived immutable caching for models, portfolio, showcase and `_next/static` assets, and AVIF/WebP image optimization.
- Set `RESEND_API_KEY` and `CONTACT_EMAIL_TO` in the Vercel project's environment variables.
