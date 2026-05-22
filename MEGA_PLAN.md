# MEGA PLAN — Retrotekt production cut into `retrotektwebnew/`

**Goal**: produce a leaner, production-ready copy of `retrotekt-web-2/` at `H:\New folder\retrotektwebnew\` that is **pixel-identical and behaviorally-identical** in the browser, with dead code, dev-only scaffolding, ephemeral artifacts, and stale config removed.

**Non-negotiables**
1. No visual change. Every page renders identically.
2. No behavioral change. Every route, header, redirect, animation, form submission, image, model load works the same.
3. No hallucinations. Every removal and every retained import is verified against grep evidence.
4. No `node_modules/.next/.git/` copying.
5. Reversible: source tree at `retrotekt-web-2/` is untouched until parity is proven.

---

## Phase 0 — Source must be green first

Before any copy, the source repo at `H:\New folder\retrotekt-web-2\` MUST:

```
1. git status — note uncommitted edits (currently 6 modified files)
2. npx tsc --noEmit  → 0 errors
3. npm run lint       → 0 errors
4. npm run build      → exit 0
5. (optional) npm test → pass
```

**If anything fails, FIX THE SOURCE FIRST.** Migrating a broken tree just moves the breakage.

### Snapshot the baseline
- Save the route manifest (`.next/build-manifest.json`, `.next/app-build-manifest.json`).
- Save the list of files in `public/` (`find public -type f | sort > /tmp/public-baseline.txt`).
- Save the rendered HTML of the homepage in dev mode (`curl http://localhost:3000 > /tmp/home-baseline.html`).
- Take screenshots of `/`, `/services`, `/portfolio`, `/portfolio/[any slug]`, `/consulting` at 1440×900 desktop + 390×844 mobile.

---

## Phase 1 — Audit (read-only, source repo)

### 1a. Dead code (skill: `dead-code-detector`)
Produce `KILL_LIST.md` at the source root. Each entry:

```
DELETE FILE: <path>
  reason: <why>
  evidence: <grep output / 0 hits>
DELETE EXPORT: <file> :: <symbol>
REMOVE DEP: <pkg>
REMOVE ENV: <NAME>
KEEP (suspicious but live): <path> — <reason>
```

Specific things to check on this repo (audit findings as of 2026-05-20):

| Candidate | Status | Action |
|---|---|---|
| Sentry env vars in `.env.example` (lines 7-11) | dead — zero `process.env.*SENTRY*` refs | **REMOVE** |
| `tmp/hero-mobile-draco-test.glb` | scratch artifact | **REMOVE** (don't copy) |
| `_perf/baseline.md` | perf scratch | **REMOVE** (don't copy) |
| `test-results/`, `.ms-playwright/` | playwright artifacts (~417MB) | **DON'T COPY** |
| `components/DebugPanel.tsx` | dev-only, dead-code-eliminates in prod via `NODE_ENV` guard | **KEEP** by default (it's free in prod build); only remove if user wants strictly-minimal source |
| `draco3d` in devDependencies | VERIFIED USED — `scripts/build-model-lods.ts` uses it as the Draco *decoder* for source GLBs (output is still Meshopt) | **KEEP** |
| TestSprite | zero references | nothing to do |

### 1b. Hallucinations (skill: `hallucination-guard`)
For every changed file in `git status` and every file in `app/components/lib/hooks/`:
- Phantom imports: each `import { X } from "..."` must resolve and export `X`.
- Phantom packages: each bare-import package must be in `package.json`.
- Phantom assets: each `/foo/bar.ext` string in source must exist under `public/`.
- Phantom APIs: any unusual `THREE.*` / Next.js / React call must exist in installed versions.
- Phantom env vars: each `process.env.X` must be in `.env.example` OR a known platform var (`NODE_ENV`, `VERCEL_URL`).
- Phantom routes: each `<Link href="...">` must resolve to an `app/.../page.tsx` or a redirect.

Output `HALLUCINATIONS.md` (empty file if none).

### 1c. Visual baseline
Before any code change, screenshot every route at desktop+mobile so post-migration diffs are detectable.

---

## Phase 2 — Build the new tree

### 2a. Create excludes file
At source root, write `.migration-excludes`:
```
node_modules/
.next/
.turbo/
.git/
.ms-playwright/
test-results/
tmp/
_perf/
coverage/
tsconfig.tsbuildinfo
.env
.env.local
.env.development.local
.env.production.local
*.log
.DS_Store
Thumbs.db
```

### 2b. Copy

Windows-aware. Two options:

**Option A — robocopy (PowerShell):**
```powershell
robocopy "H:\New folder\retrotekt-web-2" "H:\New folder\retrotektwebnew" /MIR /XD node_modules .next .turbo .git .ms-playwright test-results tmp _perf coverage /XF tsconfig.tsbuildinfo .env .env.local *.log
```

**Option B — Node script (cross-platform):**
A small `scripts/migrate.mjs` using `fs.cp({ recursive: true, filter })`.

Either way: verify directory sizes after copy. If `retrotektwebnew/` is >100MB after copy excluding `public/`, something leaked.

### 2c. Re-init git in the new tree
```bash
cd "H:\New folder\retrotektwebnew"
git init
git add -A
git commit -m "initial: production cut from retrotekt-web-2"
```

---

## Phase 3 — Apply the kill-list inside `retrotektwebnew/`

In order, with a grep verification after each step:

1. **Strip stale env vars from `.env.example`** (Sentry block).
2. **Drop confirmed-dead files** from the kill-list. After each delete, `Grep` the basename across the tree → 0 hits.
3. **Drop unused deps from `package.json`.** Delete `package-lock.json`. Run `npm install` to regenerate. Confirm 0 errors.
4. **Strip unused exports** (per kill-list).
5. **Remove dev-only imports** orphaned by step 2 (e.g. if `DebugPanel` is removed, remove its import in `app/HomeClient.tsx`).

After every batch: **re-run `hallucination-guard`**. A delete that removes a real importer creates a new phantom — catch it immediately.

---

## Phase 4 — Verification gates (each MUST pass)

Run in `retrotektwebnew/`. **Stop at the first failure**, fix, re-run from gate 1.

```
[ ] 1. npm install                        — no errors
[ ] 2. npx tsc --noEmit                    — 0 errors
[ ] 3. npm run lint                        — 0 errors
[ ] 4. npm run build                       — exit 0
[ ] 5. Diff build manifest vs source       — same routes, same chunks (size may differ; routes must match)
[ ] 6. npm start                           — server boots on :3000
[ ] 7. Open http://localhost:3000 in browser:
       [ ] / loads, no console errors, hero 3D renders
       [ ] /services
       [ ] /portfolio
       [ ] /portfolio/[slug] (one real slug)
       [ ] /consulting
       [ ] /pricing → 301 → /consulting
       [ ] /about → 301 → /consulting
[ ] 8. Visual diff vs Phase 0 screenshots  — no regressions
[ ] 9. Network tab: no 404s, models load with cache headers, contact form POSTs successfully
[ ] 10. Lighthouse (or just devtools)      — perf within 5% of source
```

**If gate 8 fails, the migration is NOT done.** The whole point is visual parity.

---

## Phase 5 — Production hardening (optional, after parity is proven)

Only after gates 1-10 pass:
- `npm audit` — fix high/critical.
- Verify `vercel.json` (if present) matches new tree.
- Confirm CSP, security headers in `next.config.mjs` are intact.
- Set up `.env.production` template (with placeholder values, not committed).
- Tag a release: `git tag -a v1.0.0 -m "production cut"`.

---

## Phase 6 — Decision log

Write `MIGRATION_NOTES.md` in `retrotektwebnew/`:
- What was removed (files, exports, deps, env vars).
- What was kept-but-suspicious (and why).
- What was NOT done (and why — defer with reasoning).
- Verification gates passed.

---

## Rollback plan

If anything fails after deployment:
- Source repo at `retrotekt-web-2/` is **untouched** — it is the rollback.
- The new tree's first commit is the baseline copy; revert to it to undo cleanup.
- Production deploy from `retrotekt-web-2/` until `retrotektwebnew/` is fully validated.

---

## The mega prompt (for re-running this in a fresh session)

```
Produce a production-ready cut of the Next.js project at H:\New folder\retrotekt-web-2\
into H:\New folder\retrotektwebnew\.

Rules:
1. No visual or behavioral change in the browser. Every page renders identically.
2. No deletions without a kill-list entry containing grep evidence.
3. No copied node_modules/, .next/, .git/, .ms-playwright/, test-results/, tmp/, _perf/, .env*, tsconfig.tsbuildinfo.
4. Re-init git in the new tree, don't pollute the source's history.
5. Verify with: npm install → tsc --noEmit → next lint → next build → npm start → browser check at /, /services, /portfolio, /portfolio/[slug], /consulting. Stop at first failure.
6. Strip these known-dead items: Sentry env vars in .env.example, tmp/hero-mobile-draco-test.glb, _perf/, test-results/, .ms-playwright/. Verify draco3d devDep with grep before removing.
7. DebugPanel: keep by default (already dead-code-eliminated in prod build).
8. Re-run hallucination-guard after every batch of deletions.
9. Produce KILL_LIST.md and MIGRATION_NOTES.md at the new tree root.
10. Do NOT modify the source tree at retrotekt-web-2/ — it is the rollback.

Source has 6 uncommitted modified files (git status); confirm with the user before deciding to copy
the dirty state or stash first.

Success = all verification gates pass AND the homepage hero renders identically in the browser.
```
