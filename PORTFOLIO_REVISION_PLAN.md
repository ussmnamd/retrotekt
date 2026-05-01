# Portfolio Revision — Mega Plan

Second pass on the portfolio rebuild. Read the original `PORTFOLIO_PLAN.md` first for context. **Hard rules from that doc still apply** — most importantly the single-GSAP-timeline rule.

This doc captures the revisions requested after the first round shipped.

---

## Issues to fix

1. **Slow page load.** Site takes too long to become interactive. Multiple culprits suspected (videos auto-loading, large model, eager imports).
2. **Portfolio hero text too large.** "Three locations. / One brand. / Built from a render." headline overpowers the video.
3. **Portfolio page should be cream theme**, matching the homepage. Currently dark. This applies to `/portfolio` AND both detail page templates (`ProjectClientModesto`, `ProjectClientStandard`).
4. **Gallery + filter is broken.** Filters currently flip projects on/off based on each project's `filterCategory`. User wants filters to switch the gallery's MEDIA TYPE:
   - **All** → mixed grid (renders + walkthrough thumbs + construction)
   - **Renders** → only render images (across all 3 projects)
   - **Walkthroughs** → only walkthrough videos (Modesto's 3 videos as inline auto-playing tiles)
   - **Construction Story** → only construction photos (across all 3 projects)
5. **Scroll broken on the way back up.** Likely `ScrollTrigger` not refreshing after filter changes hide/show content (DOM reflow not picked up).
6. **Files in correct categories.** Source files are now in correctly-named folders. Confirm rendering matches: before-photos in "before" sections, construction-photos in "construction" sections, renders in "renders" sections only — no cross-contamination on detail pages either.
7. **Buttons → text + line** style. Replace solid pill buttons across portfolio pages with the homepage's `Start Project` pattern: thin horizontal line + uppercase mono text, line extends on hover. Reference: `app/HomeClient.tsx` lines 497-502.

---

## Hard rules (recap)

1. **GSAP: ONE master timeline per page.** Don't add new timelines. Reuse existing ones. ScrollTrigger configs attach to the master timeline.
2. **`gsap.matchMedia()` gating** on all animations.
3. **Don't break existing pages** outside scope. Phase A touches `app/HomeClient.tsx` only. Phase B touches `app/portfolio/**` only.
4. **TypeScript strict.** No `any`.
5. **Build must pass clean** at end of each phase.

---

## The "Start Project" link pattern

Homepage reference (`app/HomeClient.tsx:497-502`):

```tsx
<Link href="/contact" className="group flex items-center gap-4">
  <div className="w-8 h-[1.5px] bg-primary/60 group-hover:w-24 group-hover:bg-primary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
  <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary group-hover:text-primary transition-colors duration-300">
    Start Project
  </span>
</Link>
```

Adapt this for portfolio pages on cream background. Variants needed:
- **Primary** (call-to-action, e.g. "See the case study"): line `bg-primary/60` → `bg-primary`, text `text-primary`
- **Secondary** (lighter weight, e.g. "View all work"): line `bg-primary/40` → `bg-primary/80`, text `text-primary/70`
- **On dark slabs** (if any remain — e.g. final CTA strip): inverse — line `bg-background/60` → `bg-background`, text `text-background`

No solid pill buttons anywhere on portfolio routes after this pass.

---

## Cream theme conversion — token mapping

Use Tailwind utility classes from globals.css. These tokens already exist:

| Dark token (current) | Cream replacement |
|---|---|
| `bg-[#0A0A0A]` | `bg-background` |
| `bg-[#0F0A06]` (CTA strip) | `bg-primary` (dark inverted strip — keep dark CTAs as inverted islands, like homepage final CTA) |
| `text-[#F7F0E3]` | `text-primary` |
| `text-[#F7F0E3]/60`, `/50`, `/40` | `text-primary/60`, `/50`, `/40` |
| `border-[#F7F0E3]/20`, `/30` | `border-primary/15`, `/20` |
| `text-[#C4A882]` | `text-secondary` (sand accent — token already cream-friendly) |
| `bg-[#C4A882]` | `bg-secondary` |
| `border-[#C4A882]/40` | `border-secondary/40` |
| Gradient overlays `from-black/80 ... to-transparent` | `from-primary/55 ... to-transparent` (dark ink gradient on cream still gives readable contrast on imagery) |
| `bg-gradient-to-t from-black/70` | `bg-gradient-to-t from-primary/55` |

Hero video section: keep dark gradient overlay (the video is the bg, gradient gives text contrast). Surrounding page chrome flips to cream.

Final CTA on each portfolio page: stay dark (`bg-primary` with cream/secondary text) — like homepage final CTA. Provides contrast and a clean punctuation mark at the bottom.

---

## Phase A — Performance audit + fixes

**Owner:** general-purpose sonnet agent
**Files:** `app/HomeClient.tsx`, `app/portfolio/PortfolioClient.tsx` (hero video preload only — Phase B owns the rest), `app/portfolio/[slug]/ProjectClientModesto.tsx` (videos preload only), `next.config.mjs` if helpful

### Diagnosis pass first
1. Read `app/HomeClient.tsx` end-to-end. Identify everything that loads on initial paint:
   - Hero3D (already `dynamic({ ssr: false })` — confirm)
   - ModelShowcase (eager? heavy images?)
   - Featured Project section's autoplay video
   - Other autoplay videos / heavy components
2. Read `next.config.mjs` for image config
3. Check what `preload` attribute each `<video>` has and whether off-screen videos auto-buffer

### Fixes to apply

**Video preload strategy (everywhere a `<video>` tag exists):**
- Above-the-fold hero video (only ONE per page): `preload="metadata"` is fine — it's intentional autoplay
- Below-the-fold videos (Featured Project on homepage, all-films section on Modesto detail): `preload="none"` + lazy-mount via Intersection Observer. Implementation:
  ```tsx
  // Pattern: a small wrapper that swaps in <video> only when intersecting
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  // render: poster <img> until inView, then <video> with autoplay
  ```
  Apply this pattern to:
  - Homepage Featured Project video
  - Modesto detail page hero video (if it's not the immediate hero — verify)
  - Modesto detail page all-films section primary video and thumbnails
  - Portfolio listing page hero video — this IS above the fold, so leave `preload="metadata"` autoplay as-is

**ModelShowcase:** if eager and below the fold, dynamic-import it with `ssr: false` and a placeholder. If already dynamic, skip.

**Hero3D model:** confirm GLB path is `/final1.opt.glb` (already optimized, name suggests). Check file size — if >5MB, flag for follow-up but don't try to re-optimize in this phase.

**Image priority:**
- Hero render on `/portfolio/[slug]` should be `loading="eager"` and `fetchpriority="high"`
- Everything below the fold: `loading="lazy"` + `decoding="async"`
- Verify `PortfolioPicture` component supports passing `loading` prop and adds `fetchpriority` when eager

**Bundle size:**
- Run `npm run build` and capture per-route First Load JS
- Flag any route over 200kB First Load JS

### What to report (under 300 words)
- Top 3 perf wins applied + before/after evidence (file size, bundle size, video preload state)
- Any deferred items needing follow-up
- Build still passes

---

## Phase B — Portfolio rebuild: cream + filter + scroll + buttons + hero text

**Owner:** general-purpose sonnet agent (heavy creative work — give it room)
**Files:**
- `app/portfolio/PortfolioClient.tsx` (rewrite mostly)
- `app/portfolio/[slug]/ProjectClientModesto.tsx` (cream conversion + button restyle)
- `app/portfolio/[slug]/ProjectClientStandard.tsx` (cream conversion + button restyle)
- `app/portfolio/_components/Lightbox.tsx` (cream-friendly overlay tweaks if needed)

**Files NOT to touch:**
- `app/portfolio/data.ts`, `assets.ts`
- `app/portfolio/_components/PortfolioPicture.tsx` (only edit if Phase A asked for it)
- `app/portfolio/page.tsx`, `[slug]/page.tsx`
- Anything outside `app/portfolio/`

### Task B1 — Convert all portfolio pages to cream theme
Apply the token mapping above to all three client components. Be thorough — search for hex-coded colors and replace with Tailwind utility classes referencing the design tokens. Final CTA strips remain dark (`bg-primary`).

### Task B2 — Reduce portfolio listing hero text size
Current: 3-line headline `clamp(3.5rem, 8vw, 7.5rem)` reading "Three locations. / One brand. / Built from a render."

New: smaller, 2-line headline. Use `clamp(2rem, 4.5vw, 4.25rem)`. Reword to:
> Three locations.<br />Built from a render.

The "One brand." line moves to the subhead area as part of the supporting copy:
> Chocolate Fish Coffee Roasters · Three California cafés, pre-visualized end-to-end.

Eyebrow stays "PORTFOLIO · 2025". Subhead font + size unchanged. Pill button "Watch the film →" → replaced with the line+text pattern (Task B5).

### Task B3 — Rebuild filter logic (the big one)

Filters now switch the **gallery section** between four media types. Sections of the page:

1. **Cinematic hero** — always visible, never filtered
2. **Featured Modesto slab** — always visible (it's the project anchor)
3. **Other locations 2-up** — always visible (project navigation)
4. **Filter strip** (sticky)
5. **Gallery section** ← THIS is what filters change
6. **CTA strip** — always visible

**Gallery content per filter:**

```ts
type FilterLabel = 'All' | 'Renders' | 'Walkthroughs' | 'Construction Story';

// All renders across the 3 projects (3+3+5 = 11)
type RenderItem = { kind: 'render'; img: ResponsiveImage; project: Project };
// All walkthrough videos (Modesto only — 3 currently)
type VideoItem = { kind: 'video'; video: ProjectVideo; project: Project };
// All construction photos across all 3 projects (4+6+10 = 20)
type ConstructionItem = { kind: 'construction'; img: ResponsiveImage; project: Project };

type GalleryItem = RenderItem | VideoItem | ConstructionItem;
```

- **All:** interleaved mix — show 1 video first (hero engagement), then alternate renders + construction in a balanced grid. Total ≈ 12-15 items.
- **Renders:** all 11 renders. 3-col masonry on desktop, 2-col mobile.
- **Walkthroughs:** the 3 Modesto videos as autoplaying muted-loop inline tiles. Each tile is a `<Link>` to `/portfolio/chocolate-fish-modesto#films`. Use the existing poster + `preload="metadata"` (videos are small enough). 1-col mobile, 2-col desktop. Aspect ratio 16/9.
- **Construction Story:** all 20 construction photos in masonry. 3-col desktop, 2-col mobile. With the slight grayscale-on-default / full-color-on-hover treatment from the detail pages.

Each gallery item links to the relevant project's detail page (e.g. construction tiles → `/portfolio/{project.slug}#construction`).

The current "11 renders. 3 cafés. One visual language." headline becomes dynamic per filter:

| Filter | Headline |
|---|---|
| All | "11 renders. 3 cafés. 3 films." |
| Renders | "11 renders. 3 cafés. One visual language." |
| Walkthroughs | "3 walkthrough films. One flagship build." |
| Construction Story | "Render → reality. 20 photographs of the build." |

Eyebrow stays generic ("THE GALLERY" or per filter, your call — keep it terse).

### Task B4 — Fix scroll-back-up bug

Likely cause: `ScrollTrigger` calculates positions on mount; when filter changes show/hide content, the page height changes but ScrollTrigger doesn't refresh. On scrolling back up, triggers fire at wrong positions and pinning glitches.

Fix:
1. After every `setActiveFilter` call, call `ScrollTrigger.refresh()` inside a `requestAnimationFrame` (lets DOM reflow first):
   ```ts
   const onFilterChange = (next: FilterLabel) => {
     setActiveFilter(next);
     requestAnimationFrame(() => ScrollTrigger.refresh());
   };
   ```
2. Avoid `display: none` for filtered-out content — that breaks ScrollTrigger position math. Either:
   - Use the new gallery model (Task B3) where content is dynamically rendered based on filter (mounted/unmounted) — preferred
   - Or fall back to `visibility: hidden` + `position: absolute` (keeps height stable but visually hides)
3. The sticky filter strip can also cause issues if its height changes between states. Keep it fixed-height (e.g. `h-14`).
4. Confirm the master timeline doesn't pin anything. If pinning is anywhere, ensure `pinSpacing: true` (default, but verify) and trigger refresh on filter change.

Test: after applying, scroll all the way down, change filter, scroll all the way back to top. No layout jumps, no half-revealed sections.

### Task B5 — Replace all pill buttons with line+text pattern

Implement a small reusable component in `app/portfolio/_components/StartLink.tsx`:

```tsx
'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type Tone = 'primary' | 'secondary' | 'inverse';
type Props = Omit<ComponentProps<typeof Link>, 'className'> & {
  label: string;
  tone?: Tone;
  className?: string;
};

const TONES: Record<Tone, { line: string; lineHover: string; text: string; textHover: string }> = {
  primary:   { line: 'bg-primary/60',    lineHover: 'group-hover:bg-primary',     text: 'text-primary',     textHover: 'group-hover:text-primary' },
  secondary: { line: 'bg-primary/40',    lineHover: 'group-hover:bg-primary/80',  text: 'text-primary/70',  textHover: 'group-hover:text-primary' },
  inverse:   { line: 'bg-background/60', lineHover: 'group-hover:bg-background',  text: 'text-background',  textHover: 'group-hover:text-background' },
};

export default function StartLink({ label, tone = 'primary', className = '', ...rest }: Props) {
  const t = TONES[tone];
  return (
    <Link {...rest} className={`group inline-flex items-center gap-4 ${className}`}>
      <span aria-hidden className={`block w-8 h-[1.5px] ${t.line} ${t.lineHover} transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-24`} />
      <span className={`font-body font-medium text-[11px] tracking-[0.3em] uppercase ${t.text} ${t.textHover} transition-colors duration-300`}>
        {label}
      </span>
    </Link>
  );
}
```

Replace ALL these button instances with `<StartLink>`:
- Listing page: "Watch the film →", filter pills (KEEP filter pills as buttons — they're a different pattern; just restyle them to match cream theme), "View Project →" hover labels (already minimal — keep but ensure cream colors)
- Listing page CTA: "Book a Call", "Get a Quote" → both use `StartLink` with `tone="inverse"` (CTA bg is dark)
- Modesto detail page: "View Project →" links, "View Full" lightbox hover label, CTA buttons (inverse), "More from Chocolate Fish" cards (already link styled — verify), Hero film play button if visible
- Standard detail page: same pattern
- "Get in Touch" sidebar button → `StartLink primary`

Gallery tile hover labels can stay as small underlined text (they're inline with image overlays, not standalone buttons). Use design judgement — the rule is no solid pill buttons. Inline underline + caps text is acceptable for hover-revealed labels.

### Task B6 — Verify file categorization

After cream conversion, manually verify:
- Modesto detail page's "Before" section uses `assets.before` — 3 photos, all from `modesto construct beofre/`
- Modesto "Construction" uses `assets.construction` — 4 photos, from `modesto construct/`
- Modesto "Renders" uses `assets.renders` — 3 photos, from `modesto renders/`
- Modesto "Films" uses `assets.videos` — 3 videos
- Livermore: 0 before, 6 construction, 3 renders. Confirm sections that don't exist (no before for Livermore/Sacramento) don't render empty headers.
- Sacramento: 0 before, 10 construction, 5 renders.

If you find a section pulling from the wrong array, fix it.

### Task B7 — Verify build passes

`npm run build` — exit code 0, no new warnings.

### What to report (under 400 words)
- Cream conversion: line count of changes, key files
- Hero text: before/after fontSize + line wrap
- New filter logic: how it's implemented (data structure + render switch)
- Scroll fix: which approach you used (refresh + dynamic mount, or visibility hidden)
- StartLink component path + how many call sites replaced (per file)
- File-categorization audit: any cross-contamination found and fixed
- Build status

---

## Definition of done

- [ ] Phase A: video preload strategy applied, ModelShowcase if eager → dynamic, build passes, First Load JS budget per route documented
- [ ] Phase B: cream theme on `/portfolio` + both detail templates, hero text smaller (2-line + subhead), filter actually filters gallery media (renders/walkthroughs/construction), scroll-back works without layout jumps, StartLink component used for all CTAs, no pill buttons remain on portfolio pages, build passes
- [ ] Final smoke check: navigate to `/portfolio` → click each filter → scroll up and down → click into Modesto → click into Livermore → click into Sacramento → return to homepage. No regressions.
