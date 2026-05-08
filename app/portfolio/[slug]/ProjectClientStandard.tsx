'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { Project } from '../data';
import { projects } from '../data';
import { portfolioAssets } from '../assets';
import PortfolioPicture from '../_components/PortfolioPicture';
import MediaModal, { type ModalItem } from '../_components/MediaModal';
import StartLink from '../_components/StartLink';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProjectClientStandard({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);

  const assets = portfolioAssets[project.assetKey];
  // Destructure everything — new fields (videos, before, heroLoop) auto-populate
  // sections when content is added to assets.ts without any further code changes.
  const { before, construction, renders, videos, heroLoop } = assets;

  // Other projects for cross-linking (exclude current)
  const otherProjects = projects.filter((p) => p.slug !== project.slug);

  // ── Unified modal state ─────────────────────────────────────────────────────
  const [modal, setModal] = useState<{ items: ModalItem[]; index: number } | null>(null);

  // Build ModalItem arrays for every media type in this project
  const rendersItems: ModalItem[]      = renders.map(img      => ({ kind: 'image' as const, data: img }));
  const constructionItems: ModalItem[] = construction.map(img => ({ kind: 'image' as const, data: img }));
  const beforeItems: ModalItem[]       = before.map(img       => ({ kind: 'image' as const, data: img }));
  const videoItems: ModalItem[]        = videos.map((v, i)    => ({ kind: 'video' as const, data: v, label: `Walkthrough 0${i + 1}` }));

  // Hero: prefer heroLoop, fall back to first video
  const heroVideo = heroLoop ?? videos[0];

  // ── Master GSAP timeline ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)' },
        (ctx) => {
          const { isDesktop } = ctx.conditions as { isDesktop: boolean };
          if (!isDesktop) return;

          const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

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
          tl.from('[data-anim="render-hero"]', {
            scale: 1.04,
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
          tl.from('[data-anim="before-card"]', {
            y: 60,
            opacity: 0,
            stagger: 0.12,
            scrollTrigger: { trigger: '#before', start: 'top 70%' },
          });
          tl.from('[data-anim="construction-tile"]', {
            y: 24,
            opacity: 0,
            stagger: 0.05,
            scrollTrigger: { trigger: '#construction', start: 'top 75%' },
          });
          tl.from('[data-anim="comparison"]', {
            opacity: 0,
            y: 30,
            scrollTrigger: { trigger: '#comparison', start: 'top 80%' },
          });
          tl.from('[data-anim="film-thumb"]', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            scrollTrigger: { trigger: '[data-anim="films-grid"]', start: 'top 80%' },
          });
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

  // Determine construction grid columns based on count
  const constructionCols =
    construction.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5';

  return (
    <div ref={root} className="bg-background min-h-screen text-primary">

      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '80vh' }}>
        {/* Full-bleed: video loop if available, otherwise lead render */}
        {heroVideo ? (
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
        ) : renders[0] ? (
          <PortfolioPicture
            image={renders[0]}
            sizes="100vw"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/20" />

        {/* Editorial overlay — bottom left */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 lg:px-16 pb-14 pt-32 max-w-[1400px]"
          style={{ animationName: 'hero-fadein', animationDuration: '1.2s', animationFillMode: 'both' }}
        >
          {/* Eyebrow tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="font-body text-[10px] tracking-[0.14em] uppercase text-secondary border border-secondary/50 px-3 py-1">
              {project.type}
            </span>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-[10px] tracking-[0.14em] uppercase text-background/60 border border-background/20 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="font-heading text-background leading-[0.92] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {project.name}
          </h1>

          <p className="font-body text-[12px] tracking-[0.18em] uppercase text-background/50">
            {project.city} · {project.year}
          </p>
        </div>

        <div style={{ minHeight: '80vh' }} />
      </section>

      {/* ── 2. THE BRIEF ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-16 border-t border-primary/15">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            <div className="lg:col-span-2" data-anim="brief-text">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-6">
                THE BRIEF
              </p>
              <p className="font-body text-[18px] md:text-[20px] leading-[1.75] text-primary/80">
                {project.description}
              </p>
            </div>

            <div className="lg:col-span-1" data-anim="brief-meta">
              <dl className="space-y-6">
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">Client</dt>
                  <dd className="font-body text-[14px] text-primary/70">{project.client}</dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">City</dt>
                  <dd className="font-body text-[14px] text-primary/70">{project.city}</dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">Year</dt>
                  <dd className="font-body text-[14px] text-primary/70">{project.year}</dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-1">Type</dt>
                  <dd className="font-body text-[14px] text-primary/70">{project.type}</dd>
                </div>
                <div>
                  <dt className="font-body text-[9px] tracking-[0.18em] uppercase text-secondary mb-2">Scope</dt>
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

      {/* ── 3. RENDERS GALLERY ───────────────────────────────────────────── */}
      {renders.length > 0 && (
        <section id="renders" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              PRE-CONSTRUCTION RENDERS
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModal({ items: rendersItems, index: 0 }); }}
                aria-label={`View ${renders[0].alt} fullscreen`}
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
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModal({ items: rendersItems, index: i + 1 }); }}
                    aria-label={`View ${img.alt} fullscreen`}
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

      {/* ── 4. THE SITE, BEFORE (auto-appears when before[] is populated) ── */}
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

          <div
            className="flex flex-col md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory gap-4 px-6 md:px-12 lg:px-16 pb-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#C4A882 #EDE3CE' }}
          >
            {before.map((img, i) => (
              <button
                key={img.jpg}
                data-anim="before-card"
                className="shrink-0 md:snap-start relative overflow-hidden cursor-pointer group text-left"
                style={{ width: 'clamp(220px, 38vw, 380px)', aspectRatio: '3/4', minWidth: '220px' }}
                onClick={() => setModal({ items: beforeItems, index: i })}
                aria-label={`View before photo ${i + 1}`}
              >
                <PortfolioPicture
                  image={img}
                  sizes="(max-width: 768px) 90vw, 38vw"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                    View Full
                  </span>
                </div>
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

      {/* ── 5. CONSTRUCTION REALITY ──────────────────────────────────────── */}
      {construction.length > 0 && (
        <section id="construction" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              BUILT FROM A RENDER
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-2"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              The build, in progress.
            </h2>
            <p className="font-body text-[13px] tracking-[0.12em] text-primary/40 mb-10 uppercase">
              Construction documentation
            </p>

            <div className={`grid ${constructionCols} gap-3`}>
              {construction.map((img, i) => (
                <button
                  key={img.jpg}
                  data-anim="construction-tile"
                  className="relative overflow-hidden cursor-pointer group text-left"
                  style={{ aspectRatio: '4/3' }}
                  onClick={() => setModal({ items: constructionItems, index: i })}
                  aria-label={`View ${img.alt} fullscreen`}
                >
                  {/* Grayscale layer — fades on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                    style={{ filter: 'grayscale(0.15) contrast(1.05)' }}
                  >
                    <PortfolioPicture
                      image={img}
                      sizes={
                        construction.length <= 6
                          ? '(max-width: 640px) 50vw, 33vw'
                          : '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
                      }
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {/* Full-color layer — revealed on hover */}
                  <PortfolioPicture
                    image={img}
                    sizes={
                      construction.length <= 6
                        ? '(max-width: 640px) 50vw, 33vw'
                        : '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
                    }
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-2 left-3 font-body text-[9px] tracking-[0.1em] uppercase text-background/40 z-10">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. SIDE-BY-SIDE COMPARISON ───────────────────────────────────── */}
      {renders[0] && construction[0] && (
        <section id="comparison" className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-primary/15">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary mb-3">
              SPEC vs. REALITY
            </p>
            <h2
              className="font-heading text-primary leading-[0.92] mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              The render set the spec.
            </h2>
            <p className="font-body text-[13px] text-primary/50 mb-10 max-w-xl">
              The render set the spec. The construction photo proves we hit it.
            </p>

            <div data-anim="comparison" className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left: render — click opens renders modal */}
              <div
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '16/9' }}
                onClick={() => setModal({ items: rendersItems, index: 0 })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModal({ items: rendersItems, index: 0 }); }}
                aria-label="View render fullscreen"
              >
                <PortfolioPicture
                  image={renders[0]}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                    View Full
                  </span>
                </div>
                <div className="absolute top-4 left-4 font-body text-[10px] tracking-[0.14em] uppercase text-background/80 bg-primary/50 px-3 py-1.5">
                  SPEC — Render
                </div>
              </div>

              {/* Right: construction — click opens construction modal */}
              <div
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '16/9' }}
                onClick={() => setModal({ items: constructionItems, index: 0 })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModal({ items: constructionItems, index: 0 }); }}
                aria-label="View construction photo fullscreen"
              >
                <PortfolioPicture
                  image={construction[0]}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[11px] tracking-[0.12em] uppercase text-background border border-background/40 px-4 py-2">
                    View Full
                  </span>
                </div>
                <div className="absolute top-4 left-4 font-body text-[10px] tracking-[0.14em] uppercase text-background/80 bg-primary/50 px-3 py-1.5">
                  REALITY — Built
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. WALKTHROUGH FILMS (auto-appears when videos[] is populated) ── */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.poster}
                    alt={`Walkthrough 0${i + 1} poster`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-background/20 border border-background/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-secondary/40 transition-colors duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-background ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-4 font-body text-[10px] tracking-[0.12em] uppercase text-background/70">
                    Walkthrough 0{i + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. OTHER LOCATIONS ───────────────────────────────────────────── */}
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
                      {p.isFlagship && (
                        <span className="font-body text-[9px] tracking-[0.16em] uppercase text-secondary border border-secondary/50 px-2 py-0.5 w-fit mb-3">
                          FLAGSHIP
                        </span>
                      )}
                      <h3
                        className="font-heading text-background leading-[0.92] mb-2"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                      >
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-body text-[11px] tracking-[0.1em] uppercase text-background/50">{p.city}</span>
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        <span className="font-body text-[11px] tracking-[0.1em] uppercase text-background/50">{p.year}</span>
                      </div>
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

      {/* ── 9. CTA STRIP ─────────────────────────────────────────────────── */}
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
          Have a project ready to be built?
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
