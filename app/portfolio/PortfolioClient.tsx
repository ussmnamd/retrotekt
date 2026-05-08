'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { portfolioAssets } from './assets';
import type { ResponsiveImage, ProjectVideo } from './assets';
import { projects } from './data';
import type { Project } from './data';
import PortfolioPicture from './_components/PortfolioPicture';
import StartLink from './_components/StartLink';
import MediaModal, { type ModalItem } from './_components/MediaModal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Types ──────────────────────────────────────────────────────────────────────
type FilterLabel = 'All' | 'Renders' | 'Walkthroughs' | 'Construction Story';
const FILTERS: FilterLabel[] = ['All', 'Renders', 'Walkthroughs', 'Construction Story'];

type RenderItem     = { kind: 'render';       key: string; img: ResponsiveImage; project: Project };
type VideoItem      = { kind: 'video';        key: string; video: ProjectVideo;  project: Project };
type ConstructionItem = { kind: 'construction'; key: string; img: ResponsiveImage; project: Project };
type GalleryItem = RenderItem | VideoItem | ConstructionItem;

// ── Gallery data model ─────────────────────────────────────────────────────────
const allRenderItems: RenderItem[] = projects.flatMap((p) =>
  portfolioAssets[p.assetKey].renders.map((img, i) => ({
    kind: 'render' as const,
    key: `r-${p.slug}-${i}`,
    img,
    project: p,
  }))
);

const allVideoItems: VideoItem[] = projects.flatMap((p) =>
  portfolioAssets[p.assetKey].videos.map((video, i) => ({
    kind: 'video' as const,
    key: `v-${p.slug}-${i}`,
    video,
    project: p,
  }))
);

const allConstructionItems: ConstructionItem[] = projects.flatMap((p) =>
  portfolioAssets[p.assetKey].construction.map((img, i) => ({
    kind: 'construction' as const,
    key: `c-${p.slug}-${i}`,
    img,
    project: p,
  }))
);

function itemsForFilter(filter: FilterLabel): GalleryItem[] {
  switch (filter) {
    case 'Renders':
      return allRenderItems;
    case 'Walkthroughs':
      return allVideoItems;
    case 'Construction Story':
      return allConstructionItems;
    case 'All':
    default: {
      const result: GalleryItem[] = [];
      if (allVideoItems[0]) result.push(allVideoItems[0]);
      const maxLen = Math.max(allRenderItems.length, allConstructionItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (allRenderItems[i]) result.push(allRenderItems[i]);
        if (allConstructionItems[i]) result.push(allConstructionItems[i]);
      }
      return result.slice(0, 15);
    }
  }
}

// ── Gallery heading per filter ────────────────────────────────────────────────
const GALLERY_HEADINGS: Record<FilterLabel, { eyebrow: string; headline: string }> = {
  'All':                { eyebrow: 'THE GALLERY',                  headline: 'Renders, films & construction.' },
  'Renders':            { eyebrow: 'RENDERS · ALL LOCATIONS',       headline: '11 renders. 3 cafés. One visual language.' },
  'Walkthroughs':       { eyebrow: 'WALKTHROUGH FILMS',             headline: '3 walkthrough films. One flagship build.' },
  'Construction Story': { eyebrow: 'CONSTRUCTION DOCUMENTATION',    headline: 'Render → reality. Photographs of the build.' },
};

// ── Derived data ───────────────────────────────────────────────────────────────
const modesto = projects[0];
const supporting = projects.slice(1); // Livermore, Sacramento

// ── Component ──────────────────────────────────────────────────────────────────
export default function PortfolioClient() {
  const root = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const paramFilter = searchParams.get('filter') as FilterLabel;
  const [activeFilter, setActiveFilter] = useState<FilterLabel>(
    FILTERS.includes(paramFilter) ? paramFilter : 'All'
  );
  // null = closed; number = index into galleryModalItems
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  // ── Filter change handler with ScrollTrigger refresh ────────────────────────
  const onFilterChange = (next: FilterLabel) => {
    setActiveFilter(next);
    // Double rAF: wait for React commit + DOM layout before refreshing ScrollTrigger
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  };

  // ── Master GSAP timeline ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          isMobile: '(max-width: 767px)',
          isReduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { isDesktop } = ctx.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            isReduced: boolean;
          };
          if (!isDesktop) return; // static for mobile + reduced-motion

          const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

          // Featured slab reveal
          tl.from('[data-anim="featured-eyebrow"]', {
            y: 20,
            opacity: 0,
            scrollTrigger: {
              trigger: '[data-anim="featured-eyebrow"]',
              start: 'top 80%',
            },
          });
          tl.from(
            '[data-anim="featured-meta"]',
            {
              y: 30,
              opacity: 0,
              scrollTrigger: {
                trigger: '[data-anim="featured-meta"]',
                start: 'top 80%',
              },
            },
            '<0.1'
          );
          tl.from(
            '[data-anim="featured-image"]',
            {
              scale: 1.05,
              opacity: 0,
              duration: 1.2,
              scrollTrigger: {
                trigger: '[data-anim="featured-image"]',
                start: 'top 75%',
              },
            },
            '<'
          );

          // Other locations stagger
          tl.from('[data-anim="location-card"]', {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            scrollTrigger: {
              trigger: '[data-anim="locations-grid"]',
              start: 'top 75%',
            },
          });

          // Gallery tiles stagger
          tl.from('[data-anim="render-tile"]', {
            y: 24,
            opacity: 0,
            stagger: 0.04,
            duration: 0.6,
            scrollTrigger: {
              trigger: '#renders',
              start: 'top 80%',
            },
          });

          // CTA reveal
          tl.from('[data-anim="cta"]', {
            y: 30,
            opacity: 0,
            scrollTrigger: {
              trigger: '[data-anim="cta"]',
              start: 'top 85%',
            },
          });
        }
      );
    },
    { scope: root }
  );

  const modestoAssets = portfolioAssets.modesto;
  const hero = modestoAssets.heroLoop;
  const galleryItems = itemsForFilter(activeFilter);
  const galleryHeading = GALLERY_HEADINGS[activeFilter];

  // Build modal item list that mirrors galleryItems index-for-index
  const galleryModalItems: ModalItem[] = galleryItems.map(item =>
    item.kind === 'video'
      ? { kind: 'video', data: item.video, label: `${item.project.city} · Walkthrough` }
      : { kind: 'image', data: item.img,   label: `${item.project.city} · ${item.kind === 'render' ? 'Render' : 'Construction'}` }
  );

  return (
    <div ref={root} className="bg-background min-h-screen text-primary">

      {/* ── 1. CINEMATIC HERO (~90vh) ──────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: '90vh', minHeight: '480px' }}
      >
        {/* Video background */}
        {hero && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster={hero.poster}
            style={{ opacity: 1 }}
          >
            <source src={hero.webm} type="video/webm" />
            <source src={hero.mp4} type="video/mp4" />
          </video>
        )}

        {/* Dark vignette — keep dark over video for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/25 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />

        {/* Editorial text — left third */}
        <div
          className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-16"
          style={{ maxWidth: '56rem', animationName: 'hero-fadein', animationDuration: '1.2s', animationFillMode: 'both' }}
        >
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary mb-6">
            PORTFOLIO · 2025
          </p>
          <h1
            className="font-heading text-background leading-[0.9] tracking-[-0.03em] mb-8"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4.25rem)' }}
          >
            Three locations.
            <br />
            Built from a render.
          </h1>
          <p className="font-body text-background/60 text-[13px] tracking-[0.06em] mb-10 uppercase">
            Three California cafés, pre-visualized end-to-end.
          </p>
          <StartLink
            href="/portfolio/chocolate-fish-modesto#films"
            label="Watch the film"
            tone="inverse"
          />
        </div>

        {/* Client + Contractor logos — right side */}
        <div className="hidden md:flex absolute right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-10 flex-col items-end gap-6">

          {/* Client */}
          <div className="flex flex-col items-end gap-2">
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-background/40">Client</p>
            <a
              href="https://chocolatefishcoffee.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-75 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src="/clients/chocolate-fish-logo.png"
                alt="Chocolate Fish Coffee Roasters"
                className="h-14 md:h-16 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-background/20" />

          {/* Contractor */}
          <div className="flex flex-col items-end gap-2">
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-background/40">Contractor</p>
            <a
              href="https://www.moorishconstruction.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src="/clients/moorish-construction-logo.png"
                alt="Moorish Construction"
                className="h-14 md:h-16 w-auto"
              />
            </a>
          </div>

        </div>

        {/* Scroll affordance */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-background">Scroll</span>
          <div className="w-px h-8 bg-background/60 animate-pulse" />
        </div>
      </section>

      {/* ── 2. FEATURED SLAB — MODESTO (~70vh) ────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '60vh' }}
      >
        <Link href="/portfolio/chocolate-fish-modesto" className="block h-full group">
          {/* Split frame: render left, construction right on hover */}
          <div
            data-anim="featured-image"
            className="relative overflow-hidden"
            style={{ minHeight: '60vh' }}
          >
            {/* Render — fills frame by default */}
            {modestoAssets.renders[0] && (
              <PortfolioPicture
                image={modestoAssets.renders[0]}
                sizes="100vw"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Construction photo — slides in from right on hover */}
            {modestoAssets.construction[0] && (
              <div className="absolute inset-y-0 right-0 w-0 group-hover:w-1/2 transition-[width] duration-700 ease-in-out overflow-hidden">
                <PortfolioPicture
                  image={modestoAssets.construction[0]}
                  sizes="50vw"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />

            {/* Text over image */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10">
              <p
                data-anim="featured-eyebrow"
                className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3"
              >
                FLAGSHIP CASE STUDY
              </p>
              <div data-anim="featured-meta">
                <h2
                  className="font-heading text-background leading-[0.92] tracking-[-0.02em] mb-3"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                >
                  {modesto.name}
                </h2>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-[8px] tracking-[0.2em] uppercase text-background/35">Client</span>
                    <img
                      src="/clients/chocolate-fish-logo.png"
                      alt="Chocolate Fish Coffee Roasters"
                      className="h-5 w-auto opacity-50"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <div className="w-px h-8 bg-background/20" />
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-[8px] tracking-[0.2em] uppercase text-background/35">Contractor</span>
                    <img
                      src="/clients/moorish-construction-logo.png"
                      alt="Moorish Construction"
                      className="h-5 w-auto"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <span className="font-body text-[11px] tracking-[0.12em] uppercase text-background/50">
                    {modesto.city}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-secondary" />
                  <span className="font-body text-[11px] tracking-[0.12em] uppercase text-background/50">
                    {modesto.year}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-secondary" />
                  <span className="font-body text-[11px] tracking-[0.12em] uppercase text-background/50">
                    {modesto.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {modesto.scope.map((s) => (
                    <span
                      key={s}
                      className="font-body text-[10px] tracking-[0.08em] uppercase border border-secondary/40 text-secondary px-2 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hover hint */}
            <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-body text-[10px] tracking-[0.12em] uppercase text-background/60 border-b border-background/30 pb-0.5">
                Render → Reality
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── 3. OTHER LOCATIONS (2-up grid) — always visible ──────────────── */}
      <section
        data-anim="locations-grid"
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-4 md:py-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supporting.map((project) => {
            const assets = portfolioAssets[project.assetKey];
            const leadRender = assets.renders[0];
            const constructionPhoto = assets.construction[0];

            return (
              <div
                key={project.slug}
                data-anim="location-card"
                style={{ minHeight: '40vh' }}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="relative overflow-hidden block h-full group"
                  style={{ minHeight: '40vh' }}
                >
                  {/* Default: render */}
                  {leadRender && (
                    <PortfolioPicture
                      image={leadRender}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                  )}

                  {/* Hover: construction photo cross-fade */}
                  {constructionPhoto && (
                    <PortfolioPicture
                      image={constructionPhoto}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  )}

                  {/* Gradient + label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-2">
                      {project.type}
                    </p>
                    <h3
                      className="font-heading text-background leading-[0.92] mb-2"
                      style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
                    >
                      {project.name}
                    </h3>
                    <img
                      src="/clients/chocolate-fish-logo.png"
                      alt="Chocolate Fish Coffee Roasters"
                      className="h-3.5 w-auto opacity-40 mb-3"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    <div className="flex items-center gap-3">
                      <span className="font-body text-[11px] tracking-[0.1em] uppercase text-background/50">
                        {project.city}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-secondary" />
                      <span className="font-body text-[11px] tracking-[0.1em] uppercase text-background/50">
                        {project.year}
                      </span>
                    </div>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-secondary border-b border-secondary/40 pb-0.5">
                        View Project →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. FILTER STRIP (sticky) ───────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-primary/15 h-14 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 w-full flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className="group flex items-center gap-2.5 py-2 pr-4"
            >
              <div className={`h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                activeFilter === f
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-primary/25 group-hover:w-6 group-hover:bg-primary/60'
              }`} />
              <span className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                activeFilter === f ? 'text-primary' : 'text-primary/40 group-hover:text-primary/70'
              }`}>{f}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. GALLERY SECTION ────────────────────────────────────────────── */}
      <section
        id="renders"
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-16"
      >
        <div className="mb-8">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
            {galleryHeading.eyebrow}
          </p>
          <h2
            className="font-heading text-primary leading-[0.92]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            {galleryHeading.headline}
          </h2>
        </div>

        {/* Responsive grid — 2 cols mobile, 3 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryItems.map((item, i) => {
            if (item.kind === 'video') {
              return (
                <button
                  key={item.key}
                  onClick={() => setModalIndex(i)}
                  className="relative overflow-hidden block w-full group bg-primary cursor-pointer"
                  style={{ paddingBottom: '56.25%' }}
                  data-anim="render-tile"
                  aria-label={`Play walkthrough — ${item.project.city}`}
                >
                  {/* Silent looping preview */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline preload="metadata"
                    poster={item.video.poster}
                  >
                    <source src={item.video.webm} type="video/webm" />
                    <source src={item.video.mp4}  type="video/mp4"  />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
                  {/* Play icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="w-12 h-12 rounded-full border border-background/70 bg-primary/40 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <span className="font-body text-[9px] tracking-[0.12em] uppercase text-background/90">
                      {item.project.city} · Walkthrough
                    </span>
                  </div>
                </button>
              );
            }

            // render or construction → image tile
            return (
              <button
                key={item.key}
                onClick={() => setModalIndex(i)}
                className={`relative overflow-hidden block w-full group cursor-pointer ${item.kind === 'construction' ? 'construction-tile' : ''}`}
                style={{ paddingBottom: i % 7 === 0 ? '66.67%' : '56.25%' }}
                data-anim="render-tile"
                aria-label={`View ${item.kind === 'render' ? 'render' : 'construction photo'} — ${item.project.city}`}
              >
                <PortfolioPicture
                  image={item.img}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${item.kind === 'construction' ? 'grayscale-[15%] contrast-[1.05] group-hover:grayscale-0 group-hover:contrast-100 transition-[filter] duration-500' : ''}`}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-300" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <span className="font-body text-[9px] tracking-[0.12em] uppercase text-background/90">
                    {item.project.city} · {item.kind === 'render' ? 'Render' : 'Construction'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Media modal ────────────────────────────────────────────────────── */}
      {modalIndex !== null && (
        <MediaModal
          items={galleryModalItems}
          startIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}

      {/* ── 6. CTA STRIP ──────────────────────────────────────────────────── */}
      <section
        data-anim="cta"
        className="bg-primary border-t border-primary/20 py-12 md:py-16 px-6 md:px-12 lg:px-16 text-center"
      >
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-4">
          NEXT PROJECT
        </p>
        <h2
          className="font-heading text-background leading-[0.92] mb-8 mx-auto"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', maxWidth: '36rem' }}
        >
          Have a project to bring to life?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <StartLink href="/consulting" label="Book a Call" tone="inverse" />
          <StartLink href="/consulting" label="Get a Quote" tone="inverse" />
        </div>
      </section>

      {/* Hero fade-in CSS */}
      <style>{`
        @keyframes hero-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
