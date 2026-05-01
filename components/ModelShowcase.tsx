"use client";

import Link from "next/link";
import { showcase } from "@/lib/showcase-data";

export default function ModelShowcase() {
  return (
    <section id="model-showcase" className="relative w-full bg-background">
      {/* Duotone filter — remaps every image to a unified cream palette,
          shadows → deep warm brown (#3D2A1A), highlights → light cream (#F7F0E3) */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="cream-duotone" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0     0     0     1 0"
            />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.239 0.969" />
              <feFuncG type="table" tableValues="0.165 0.941" />
              <feFuncB type="table" tableValues="0.102 0.890" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="showcase-pin h-screen relative overflow-hidden">

        {/* Architectural background grid */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" className="opacity-[0.035]">
            <defs>
              <pattern id="showcase-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2C1F14" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#showcase-grid)" />
          </svg>
        </div>

        {/* Corner L-brackets */}
        <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
            <svg className="absolute top-8 left-8 opacity-20" width="44" height="44" fill="none">
              <path d="M44 0 L0 0 L0 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute top-8 right-8 opacity-20" width="44" height="44" fill="none">
              <path d="M0 0 L44 0 L44 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-8 left-8 opacity-20" width="44" height="44" fill="none">
              <path d="M0 0 L0 44 L44 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-8 right-8 opacity-20" width="44" height="44" fill="none">
              <path d="M44 0 L44 44 L0 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </div>

        {/* Section header — Centered at top */}
        <header
          id="showcase-header"
          className="absolute top-8 md:top-10 left-0 right-0 mx-auto z-30 max-w-2xl pointer-events-none flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-4 mb-3 md:mb-4">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-primary/20">
               <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" />
            </div>
            <div className="h-px bg-[#D4C5A9] w-8 md:w-12 flex-shrink-0" />
            <span className="font-body text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-primary/50 whitespace-nowrap">
              Featured Builds
            </span>
            <div className="h-px bg-[#D4C5A9] w-8 md:w-12 flex-shrink-0" />
          </div>
          <h2 className="font-heading text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-primary">
            Spaces we&apos;ve <span className="text-[#8C6E4B] italic font-serif">brought to life.</span>
          </h2>
        </header>

        {/* Full-viewport mist plane — driven by GSAP, always on top of images */}
        <div
          id="showcase-mist"
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(247,240,227,0.96) 0%, rgba(247,240,227,0.75) 55%, transparent 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />

        {/* Model slides */}
        <div className="reel absolute inset-0">
          {showcase.map((s, i) => (
            <figure
              key={i}
              data-slide={i}
              className="showcase-slide absolute inset-0 flex items-center justify-center"
            >
              {/* Color image — AVIF/WebP with PNG fallback.
                  showcase-img class stays on the <img> so GSAP transforms apply
                  to the rendered image and HomeClient's img.complete check works. */}
              <picture>
                <source
                  srcSet={s.src.replace(".png", ".avif")}
                  type="image/avif"
                  sizes="(max-width: 768px) 70vw, 50vw"
                />
                <source
                  srcSet={s.src.replace(".png", ".webp")}
                  type="image/webp"
                  sizes="(max-width: 768px) 70vw, 50vw"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding={i === 0 ? "sync" : "async"}
                  className="showcase-img w-[70vw] h-[66vh] relative z-10 block object-contain"
                  style={{ opacity: i === 0 ? 1 : 0, filter: "url(#cream-duotone)" }}
                  alt={s.title}
                  sizes="(max-width: 768px) 70vw, 50vw"
                />
              </picture>
              {/* Ghost image — desaturated webp, floats above colour img, GSAP-driven */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.ghost}
                loading="lazy"
                decoding="async"
                aria-hidden="true"
                className="showcase-img-ghost w-[70vw] h-[66vh] object-contain absolute inset-0 m-auto pointer-events-none z-10"
                alt=""
                style={{ opacity: 0, filter: "url(#cream-duotone)" }}
              />
              
            </figure>
          ))}
        </div>

        {/* Info bar — compact, premium */}
        <div
          className="absolute bottom-6 md:bottom-8 left-0 right-0 mx-auto w-[92vw] max-w-5xl md:rounded-[3px] overflow-hidden z-30"
          style={{
            background: 'rgba(61, 42, 26, 0.97)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 0 0 1px rgba(196,168,130,0.18), 0 24px 48px rgba(0,0,0,0.35)',
          }}
        >
          {/* Glowing gold top edge */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #C4A882 30%, #E8C97A 55%, #C4A882 70%, transparent 100%)',
              opacity: 0.7,
            }}
          />

          {/* Grain overlay */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay z-0" aria-hidden="true">
            <filter id="noise-showcase-base">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise-showcase-base)" />
          </svg>

          <div className="relative w-full h-full">
            {/* Invisible structural spacer — compact sizing */}
            <div className="opacity-0 pointer-events-none px-5 py-3 md:px-7 md:py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-10 w-full">
              <div className="flex-shrink-0">
                <span className="font-body text-[8px] tracking-[0.3em] uppercase block">_</span>
                <h3 className="font-heading text-[clamp(1rem,1.6vw,1.35rem)] leading-[1.15]">Chocolate Fish — Modesto</h3>
                <span className="font-body text-[8px] tracking-[0.22em] uppercase block">_</span>
              </div>
              <div className="hidden md:block w-px h-8" />
              <div className="flex items-center gap-7 md:gap-10">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase">Renders</span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase">Walkthroughs</span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase">Construction</span>
              </div>
            </div>

            {/* Animated caption layers — driven by GSAP */}
            {showcase.map((s, i) => (
              <div
                key={`cap-${i}`}
                className="showcase-cap absolute inset-0 w-full h-full px-5 py-3 md:px-7 md:py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-10 z-10"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* Left — project identity */}
                <div className="flex-shrink-0">
                  <span className="font-body text-[8px] tracking-[0.3em] uppercase text-[#C4A882]/70 block mb-0.5">
                    {s.role}
                  </span>
                  <Link href={s.href} className="group inline-flex items-baseline gap-2.5">
                    <h3 className="font-heading text-[clamp(1rem,1.6vw,1.35rem)] text-[#F7F0E3] leading-[1.15] group-hover:text-[#C4A882] transition-colors duration-300">
                      {s.title}
                    </h3>
                    <span className="text-[#C4A882]/40 text-xs translate-x-0 group-hover:translate-x-1 transition-transform duration-300 leading-none">→</span>
                  </Link>
                  <span className="font-body text-[8px] tracking-[0.22em] uppercase text-[#C4A882]/40 block mt-0.5">
                    {s.location}
                  </span>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-8 bg-[#C4A882]/15 flex-shrink-0" />

                {/* Right — section links */}
                <nav className="flex items-center gap-7 md:gap-10" aria-label={`${s.title} sections`}>
                  {s.links.map((lnk) => (
                    <Link
                      key={lnk.label}
                      href={lnk.href}
                      className="group relative flex flex-col items-start gap-[3px]"
                    >
                      <span className="font-body text-[10px] tracking-[0.22em] uppercase text-[#F7F0E3]/60 group-hover:text-[#F7F0E3] transition-colors duration-300">
                        {lnk.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="block h-px bg-[#C4A882] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                      />
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Slider tick pill with flanking nav arrows */}
        <div className="absolute bottom-[120px] md:bottom-[94px] left-0 right-0 mx-auto w-fit flex items-center gap-3 z-40 bg-[#F7F0E3]/85 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/10 shadow-sm">

          {/* ‹ Prev */}
          <button
            id="showcase-prev"
            aria-label="Previous project"
            className="flex items-center justify-center w-5 h-5 rounded-full text-primary/60 hover:text-primary hover:bg-primary/8 transition-colors duration-200 text-[13px] font-medium leading-none select-none"
          >
            ‹
          </button>

          {/* Tick marks */}
          <div className="flex items-center gap-[14px]">
            {showcase.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to project ${i + 1}`}
                className="showcase-tick-btn flex items-center justify-center relative py-2 cursor-pointer group"
              >
                <div
                  id={`showcase-tick-${i}`}
                  style={{
                    width: i === 0 ? "36px" : "10px",
                    height: "2px",
                    background: "#2C1F14",
                    opacity: i === 0 ? 0.65 : 0.18,
                    borderRadius: "2px",
                  }}
                  className="transition-all duration-300 group-hover:opacity-50"
                />
              </button>
            ))}
          </div>

          {/* › Next */}
          <button
            id="showcase-next"
            aria-label="Next project"
            className="flex items-center justify-center w-5 h-5 rounded-full text-primary/60 hover:text-primary hover:bg-primary/8 transition-colors duration-200 text-[13px] font-medium leading-none select-none"
          >
            ›
          </button>
        </div>

      </div>
    </section>
  );
}

