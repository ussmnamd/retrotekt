# Retrotekt

Marketing and portfolio site for Retrotekt, an architectural 3D visualization studio based in the US. Built to convert contractor and developer leads through photorealistic renders and walkthroughs presented in a premium visual format.

## What it is

A multi-page Next.js site with a fullscreen interactive 3D hero, service and pricing pages, a filterable portfolio, and a contact/quote form. The 3D viewer lets visitors rotate and explore a rendered architectural model directly in the browser without any plugins.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Three.js — 3D rendering, DRACO-compressed GLB models, custom lighting rig
- GSAP + ScrollTrigger — entrance animation, scroll-driven rotation
- Deployed on Vercel

## Pages

| Route | Description |
|---|---|
| `/` | Fullscreen 3D hero, value props, pricing teaser, process, portfolio preview |
| `/services` | Service types with individual pricing |
| `/pricing` | Full tier comparison, savings table, add-ons, walkthrough options |
| `/portfolio` | Filterable render grid |
| `/about` | Studio positioning and values |
| `/contact` | Quote request form |

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 3D model

The hero model lives at `public/models/final1.draco.glb`. It was compressed from the original GLB using [gltf-transform](https://gltf-transform.donmccurdy.com/) — textures converted to WebP, mesh simplified and welded, Draco geometry compression applied. The DRACO decoder files are in `public/draco/` and are served with long-cache headers.

To swap the model, replace the GLB and update `CONFIG.modelPath` in `components/Hero3D.tsx`.

## Bundle analysis

```bash
ANALYZE=true npm run build
```

## Notes

The 3D viewer is lazy-loaded and excluded from the SSR bundle. On mobile it degrades gracefully — lower pixel ratio, reduced shadow resolution, and slower animation speeds to preserve battery. The render loop pauses automatically when the tab is not visible.
