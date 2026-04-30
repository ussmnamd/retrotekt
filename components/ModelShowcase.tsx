"use client";

import { showcase } from "@/lib/showcase-data";

export default function ModelShowcase() {
  return (
    <section id="model-showcase" className="relative w-full bg-background">
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
              {/* Color image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                loading={i === 0 ? "eager" : "lazy"}
                className="showcase-img w-[70vw] h-[66vh] object-contain relative z-10"
                alt={s.title}
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
              {/* Ghost image — desaturated, floats above colour img, GSAP-driven */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.ghost}
                loading="lazy"
                aria-hidden="true"
                className="showcase-img-ghost w-[70vw] h-[66vh] object-contain absolute inset-0 m-auto pointer-events-none z-10"
                alt=""
                style={{ opacity: 0 }}
              />
              
              {/* Wide Rectangular Glassmorphic Caption Card */}
              <figcaption
                className="showcase-cap absolute bottom-6 md:bottom-8 left-0 right-0 mx-auto w-[92vw] max-w-5xl p-4 md:px-8 md:py-5 rounded-none md:rounded-[4px] bg-[#3D2A1A]/95 backdrop-blur-md border-t border-b md:border border-[#C4A882]/20 z-30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 overflow-hidden"
                style={{ opacity: i === 0 ? 1 : 0, boxShadow: '0 20px 40px rgba(44,31,20,0.15)' }}
              >
                {/* Grainy Noise Overlay */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.25] mix-blend-overlay z-0">
                  <filter id={`noise-showcase-${i}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                  </filter>
                  <rect width="100%" height="100%" filter={`url(#noise-showcase-${i})`} />
                </svg>

                <div className="relative z-10 flex-1 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full">
                  <div className="flex-shrink-0 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-body text-[9px] tracking-[0.3em] uppercase text-[#C4A882]/80">
                        {s.role}
                      </span>
                    </div>
                    <h3 className="font-heading text-[clamp(1.3rem,2vw,1.8rem)] text-[#F7F0E3] leading-[1.1]">
                      {s.title}
                    </h3>
                  </div>
                  
                  <div className="hidden md:block w-px h-10 bg-[#C4A882]/20" />
                  
                  <p className="font-body text-[12px] md:text-[13px] text-[#F7F0E3]/70 leading-relaxed max-w-xl">
                    {s.blurb}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Minimal slider ticks moved above the rectangular card */}
        <div className="absolute bottom-[140px] md:bottom-[110px] left-0 right-0 mx-auto w-fit flex items-center gap-6 z-40 bg-[#F7F0E3]/70 backdrop-blur-md px-6 py-3 rounded-full border border-primary/5 shadow-sm">
          {showcase.map((_, i) => (
            <div key={i} className="flex items-center justify-center relative cursor-pointer group">
              <div
                id={`showcase-tick-${i}`}
                style={{
                  width: i === 0 ? "36px" : "10px",
                  height: "2px",
                  background: "#2C1F14",
                  opacity: i === 0 ? 0.65 : 0.18,
                  borderRadius: "2px",
                }}
                className="transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

