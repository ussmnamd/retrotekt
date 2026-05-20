'use client';

import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { Project } from '../data';
import { portfolioAssets } from '../assets';
import type { ResponsiveImage } from '../assets';
import PortfolioPicture from '../_components/PortfolioPicture';
import MediaModal, { type ModalItem } from '../_components/MediaModal';
import StartLink from '../_components/StartLink';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Before/After Slider ────────────────────────────────────────────────────────

interface BeforeAfterSliderProps {
  leftImage: ResponsiveImage;  // render (spec)
  rightImage: ResponsiveImage; // construction (reality)
}

function BeforeAfterSlider({ leftImage, rightImage }: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderPos(Math.round(ratio * 100));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    updatePos(e.clientX);
  }, [updatePos]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    updatePos(e.clientX);
  }, [updatePos]);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(100, p + 5));
  }, []);

  return (
    <div
      ref={wrapRef}
      data-anim="slider"
      className="relative overflow-hidden select-none cursor-col-resize"
      style={{ aspectRatio: '16/9' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Base layer: construction (reality) */}
      <PortfolioPicture
        image={rightImage}
        sizes="(max-width: 768px) 100vw, 80vw"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Top layer: render (spec) clipped to left side */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <PortfolioPicture
          image={leftImage}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* "SPEC" label */}
        <div className="absolute top-4 left-4 font-body text-[10px] tracking-[0.14em] uppercase text-background/80 bg-primary/40 px-2 py-1">
          SPEC
        </div>
      </div>

      {/* "REALITY" label on right */}
      <div className="absolute top-4 right-4 font-body text-[10px] tracking-[0.14em] uppercase text-background/80 bg-primary/40 px-2 py-1">
        REALITY
      </div>

      {/* Drag handle */}
      <div
        className="absolute inset-y-0 z-10 flex items-center justify-center"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        role="slider"
        tabIndex={0}
        aria-label="Comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={sliderPos}
        onKeyDown={handleKeyDown}
      >
        {/* Line */}
        <div className="absolute inset-y-0 w-px bg-background/70" />
        {/* Handle circle */}
        <div className="relative z-10 w-9 h-9 rounded-full bg-background border-2 border-secondary flex items-center justify-center shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2.5" className="-ml-1">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProjectClientModesto({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);

  const assets = portfolioAssets[project.assetKey];
  const { before, construction, renders, videos, heroLoop } = assets;

  // Other projects for cross-linking
  const { projects: allProjects } = (() => {
    // Inline import to avoid circular dep issues at module level
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { projects: p } = require('../data') as { projects: Project[] };
    return { projects: p };
  })();
  const otherProjects = allProjects.filter((p) => p.slug !== project.slug);

  // ── Unified modal state ─────────────────────────────────────────────────────
  const [modal, setModal] = useState<{ items: ModalItem[]; index: number } | null>(null);

  // Build ModalItem arrays once per render (assets are static)
  const rendersItems: ModalItem[]      = renders.map(img => ({ kind: 'image' as const, data: img }));
  const videoItems: ModalItem[]        = videos.map((v, i) => ({ kind: 'video' as const, data: v, label: `Walkthrough 0${i + 1}` }));
  const beforeItems: ModalItem[]       = before.map(img => ({ kind: 'image' as const, data: img }));
  const constructionItems: ModalItem[] = construction.map(img => ({ kind: 'image' as const, data: img }));

  // Hero loop: prefer dedicated heroLoop, fall back to first video in list
  const heroVideo = heroLoop ?? videos[0];

  // ── Master GSAP timeline ────────────────────────────────────────────────────
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { isDesktop } = ctx.conditions as { isDesktop: boolean };
          if (!isDesktop) return;

          const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

          // 1. Brief reveal
          tl.from('[data-anim="brief-text"]', {
            y: 30,
            opacity: 0,
            scrollTrigger: { trigger: '[data-anim="brief-text"]', start: 'top 80%' },
          });
          tl.from(
            '[data-anim="brief-meta"]',
            {
              y: 20,
              opacity: 0,
              scrollTrigger: { trigger: '[data-anim="brief-meta"]', start: 'top 80%' },
            },
            '<0.1'
          );

          // 2. Before rail parallax
          tl.from('[data-anim="before-card"]', {
            y: 60,
            opacity: 0,
            stagger: 0.12,
            scrollTrigger: { trigger: '#before', start: 'top 70%' },
          });

          // 3. Construction stagger
          tl.from('[data-anim="construction-cell"]', {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            scrollTrigger: { trigger: '#construction', start: 'top 70%' },
          });

          // 4. Renders reveal
          tl.from('[data-anim="render-hero"]', {
            scale: 1.05,
            opacity: 0,
            duration: 1.1,
            scrollTrigger: { trigger: '#renders', start: 'top 75%' },
          });
          tl.from(
            '[data-anim="render-tile"]',
            {
              y: 30,
              opacity: 0,
              stagger: 0.08,
              scrollTrigger: { trigger: '[data-anim="renders-grid"]', start: 'top 80%' },
            },
            '<0.2'
          );

          // 5. Slider section
          tl.from('[data-anim="slider"]', {
            opacity: 0,
            y: 30,
            scrollTrigger: { trigger: '#reveal', start: 'top 75%' },
          });

          // 6. Films poster grid
          tl.from('[data-anim="film-thumb"]', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            scrollTrigger: { trigger: '[data-anim="films-grid"]', start: 'top 80%' },
          });

          // 7. Pull quote
          tl.from('[data-anim="pullquote"]', {
            opacity: 0,
            y: 40,
            scrollTrigger: { trigger: '[data-anim="pullquote"]', start: 'top 75%' },
          });

          // 8. Other locations + CTA
          tl.from('[data-anim="other-card"]', {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            scrollTrigger: { trigger: '[data-anim="others"]', start: 'top 80%' },
          });
          tl.from('[data-anim="cta"]', {
            y: 30,
            opacity: 0,
            scrollTrigger: { trigger: '[data-anim="cta"]', start: 'top 85%' },
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <div ref={root} className="bg-background min-h-screen text-primary">

      {/* ── 1. HERO FILM SECTION ──────────────────────────────────────────── */}
      <section id="film" className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
        {/* Full-bleed looping video */}
        {heroVideo && (
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroVideo.poster}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={heroVideo.webm} type="video/webm" />
              <source src={heroVideo.mp4}  type="video/mp4"  />
            </video>
          </div>
        )}

        {/* Gradient overlay — keep dark for text contrast over video */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-primary/30 pointer-events-none" />

        {/* Editorial overlay — top left */}
        <div className="absolute top-8 left-6 md:left-12 lg:left-20 z-10 max-w-xs">
          <div className="bg-primary/50 backdrop-blur-sm border border-background/10 p-5">
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-secondary mb-3">
              FLAGSHIP CASE STUDY
            </p>
            <h1
              className="font-heading text-background leading-[0.92] tracking-[-0.02em] mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
            >
              {project.name}
            </h1>
            <p className="font-body text-[10px] tracking-[0.12em] uppercase text-background/50 mb-3">
              {project.city} · {project.year}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.scope.map((s) => (
                <span
                  key={s}
                  className="font-body text-[9px] tracking-[0.06em] uppercase border border-secondary/30 text-secondary/80 px-2 py-0.5"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom spacer so section has height */}
        <div style={{ minHeight: '90vh' }} />
      </section>

      {/* ── 2. THE BRIEF ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-16 border-t border-primary/15">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Left 2 cols: description + pull quote */}
            <div className="lg:col-span-2" data-anim="brief-text">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-6">
                THE BRIEF
              </p>
              <p className="font-body text-[18px] md:text-[20px] leading-[1.75] text-primary/80 mb-8">
                {project.description}
              </p>
              {project.pullQuote && (
                <blockquote
                  className="font-heading text-primary leading-[1.05] tracking-[-0.015em] border-l-2 border-secondary pl-6"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
                >
                  {project.pullQuote}
                </blockquote>
              )}
            </div>

            {/* Right col: meta DL */}
            <div className="lg:col-span-1" data-anim="brief-meta">
              <dl className="space-y-6">
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">
                    Client
                  </dt>
                  <dd className="font-body text-[14px] text-primary/70">
                    {project.client}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">
                    City
                  </dt>
                  <dd className="font-body text-[14px] text-primary/70">
                    {project.city}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">
                    Year
                  </dt>
                  <dd className="font-body text-[14px] text-primary/70">
                    {project.year}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">
                    Type
                  </dt>
                  <dd className="font-body text-[14px] text-primary/70">
                    {project.type}
                  </dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-2">
                    Scope
                  </dt>
                  <dd>
                    <ul className="space-y-1">
                      {project.scope.map((s) => (
                        <li key={s} className="font-body text-[13px] text-primary/70 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-secondary shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="pt-2">
                  <StartLink href="/consulting" label="Get in Touch" tone="primary" />
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BEFORE ────────────────────────────────────────────────────── */}
      {before.length > 0 && (
        <section id="before" className="py-16 md:py-24 border-t border-primary/15">
          <div className="px-6 md:px-12 lg:px-16 mb-8 max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              THE SITE, BEFORE
            </p>
            <h2
              className="font-heading text-primary leading-[0.92]"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              Before a single fixture was specified.
            </h2>
          </div>

          {/* Horizontal scroll rail on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory gap-4 px-6 md:px-12 lg:px-16 pb-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#C4A882 #EDE3CE' }}
          >
            {before.map((img, i) => (
              <button
                key={img.jpg}
                data-anim="before-card"
                className="shrink-0 md:snap-start relative overflow-hidden cursor-pointer group text-left"
                style={{
                  width: 'clamp(220px, 38vw, 380px)',
                  aspectRatio: '3/4',
                  minWidth: '220px',
                }}
                onClick={() => setModal({ items: beforeItems, index: i })}
                aria-label={`View before photo ${i + 1}`}
              >
                <PortfolioPicture
                  image={img}
                  sizes="(max-width: 768px) 90vw, 38vw"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                    View Full
                  </span>
                </div>
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/70 to-transparent px-4 py-4">
                  <span className="font-body text-[10px] tracking-[0.12em] uppercase text-background/60">
                    0{i + 1} / Before construction
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. CONSTRUCTION IN MOTION ────────────────────────────────────── */}
      {construction.length > 0 && (
        <section id="construction" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              CONSTRUCTION IN MOTION
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              The build, documented.
            </h2>

            {/* Asymmetric grid: 1 large (col-span-2 row-span-2) + 3 right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Hero cell */}
              {construction[0] && (
                <button
                  data-anim="construction-cell"
                  className="md:col-span-2 md:row-span-2 relative overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: '4/3', minHeight: '320px' }}
                  onClick={() => setModal({ items: constructionItems, index: 0 })}
                  aria-label="View construction photo 1"
                >
                  {/* Grayscale layer — fades out on hover via opacity */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                    style={{ filter: 'grayscale(0.15) contrast(1.05)' }}
                  >
                    <PortfolioPicture
                      image={construction[0]}
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {/* Full-color layer — revealed on hover */}
                  <PortfolioPicture
                    image={construction[0]}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* View hint */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                      View Full
                    </span>
                  </div>
                </button>
              )}

              {/* 3 side cells */}
              {construction.slice(1, 4).map((img, i) => (
                <button
                  key={img.jpg}
                  data-anim="construction-cell"
                  className="relative overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: '4/3' }}
                  onClick={() => setModal({ items: constructionItems, index: i + 1 })}
                  aria-label={`View construction photo ${i + 2}`}
                >
                  {/* Grayscale layer */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                    style={{ filter: 'grayscale(0.15) contrast(1.05)' }}
                  >
                    <PortfolioPicture
                      image={img}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {/* Full-color layer revealed on hover */}
                  <PortfolioPicture
                    image={img}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-2 left-3 font-body text-[9px] tracking-[0.1em] uppercase text-background/40 z-10">
                    0{i + 2}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. THE RENDERS ───────────────────────────────────────────────── */}
      {renders.length > 0 && (
        <section id="renders" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              THE VISION, RENDERED
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              Photoreal before ground broke.
            </h2>

            {/* Lead render — full width */}
            {renders[0] && (
              <div
                data-anim="render-hero"
                className="relative overflow-hidden cursor-pointer group mb-3"
                style={{ aspectRatio: '16/9' }}
                onClick={() => setModal({ items: rendersItems, index: 0 })}
              >
                <PortfolioPicture
                  image={renders[0]}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                    View Full
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 font-body text-[10px] tracking-[0.1em] uppercase text-background/50">
                  Render 01
                </div>
              </div>
            )}

            {/* 2-up grid for remaining renders */}
            {renders.length > 1 && (
              <div data-anim="renders-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renders.slice(1).map((img, i) => (
                  <div
                    key={img.jpg}
                    data-anim="render-tile"
                    className="relative overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '16/9' }}
                    onClick={() => setModal({ items: rendersItems, index: i + 1 })}
                  >
                    <PortfolioPicture
                      image={img}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/25 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                        View Full
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 font-body text-[10px] tracking-[0.1em] uppercase text-background/50">
                      Render 0{i + 2}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 6. SIDE-BY-SIDE REVEAL ───────────────────────────────────────── */}
      {renders[0] && construction[0] && (
        <section id="reveal" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              SPEC vs. REALITY
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              The renders set the spec.
            </h2>
            <p className="font-body text-[13px] tracking-[0.06em] text-primary/50 mb-8">
              Drag to compare the render to the build.
            </p>

            <BeforeAfterSlider
              leftImage={renders[0]}
              rightImage={construction[0]}
            />
          </div>
        </section>
      )}

      {/* ── 7. ALL FILMS ─────────────────────────────────────────────────── */}
      {videos.length > 0 && (
        <section id="films" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              WALKTHROUGH FILMS
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              Every room, before the doors opened.
            </h2>

            {/* Poster grid — click any card to open modal and auto-play */}
            <div data-anim="films-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((v, i) => (
                <button
                  key={v.mp4}
                  data-anim="film-thumb"
                  className="relative overflow-hidden group cursor-pointer text-left"
                  style={{ aspectRatio: '16/9' }}
                  onClick={() => setModal({ items: videoItems, index: i })}
                  aria-label={`Play walkthrough ${i + 1}`}
                >
                  {/* Poster image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.poster}
                    alt={`Walkthrough 0${i + 1} poster`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* Dark overlay + play button */}
                  <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-background/20 border border-background/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-secondary/40 transition-colors duration-300">
                      <svg
                        width="20" height="20" viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-background ml-1"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="absolute bottom-3 left-4 font-body text-[10px] tracking-[0.12em] uppercase text-background/70">
                    Walkthrough 0{i + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. THE RESULT (pull quote) ───────────────────────────────────── */}
      {project.pullQuote && (
        <section
          className="py-24 md:py-32 px-6 text-center border-t border-primary/15"
          style={{ backgroundColor: '#EDE3CE' }}
        >
          <div className="max-w-[900px] mx-auto">
            <blockquote
              data-anim="pullquote"
              className="font-heading text-primary leading-[1.0] tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              &ldquo;{project.pullQuote}&rdquo;
            </blockquote>
            <p className="font-body text-[11px] tracking-[0.15em] uppercase text-secondary">
              {project.client} — {project.city}
            </p>
          </div>
        </section>
      )}

      {/* ── 9. OTHER LOCATIONS ───────────────────────────────────────────── */}
      {otherProjects.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              MORE FROM CHOCOLATE FISH
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-10"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              Same client, different city.
            </h2>

            <div data-anim="others" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherProjects.map((p) => {
                const pAssets = portfolioAssets[p.assetKey];
                const leadRender = pAssets.renders[0];
                return (
                  <Link
                    key={p.slug}
                    href={`/portfolio/${p.slug}`}
                    data-anim="other-card"
                    className="relative overflow-hidden block group"
                    style={{ minHeight: '40vh' }}
                  >
                    {leadRender && (
                      <PortfolioPicture
                        image={leadRender}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
                      <h3
                        className="font-heading text-background leading-[0.92] mb-2"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                      >
                        {p.name}
                      </h3>
                      <p className="font-body text-[11px] tracking-[0.1em] uppercase text-background/50 mb-3">
                        {p.city}
                      </p>
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-secondary border-b border-secondary/40 pb-0.5 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        View project →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 10. CTA STRIP ────────────────────────────────────────────────── */}
      <section
        data-anim="cta"
        className="bg-primary border-t border-primary/20 py-20 md:py-28 px-6 text-center"
      >
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-6">
          START A PROJECT
        </p>
        <h2
          className="font-heading text-background leading-[0.92] mb-10 mx-auto"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', maxWidth: '36rem' }}
        >
          Bring your project to life.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <StartLink href="/consulting" label="Book a Call" tone="inverse" />
          <StartLink href="/consulting" label="Get a Quote" tone="inverse" />
        </div>
      </section>

      {/* ── Unified media modal ───────────────────────────────────────────── */}
      {modal !== null && (
        <MediaModal
          items={modal.items}
          startIndex={modal.index}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
