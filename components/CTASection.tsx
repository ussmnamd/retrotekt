"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CTAMarquee from "./CTAMarquee";

/* ─────────────────────────────────────────────────────────────────────────────
   CTASection — Award-winning closing CTA with:
   - Diagonal split background (dark/cream)
   - Kinetic marquee text marquee strip
   - Giant display headline with character animation
   - Orbital crosshair decorations
   - Glassmorphic CTA buttons
───────────────────────────────────────────────────────────────────────────── */
export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="relative overflow-hidden"
      style={{ background: "#2C1F14" }}
      aria-label="Call to action"
    >
      {/* ── Diagonal cream slice at top-right ──────────────────────────────── */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        aria-hidden="true"
        style={{
          width: "55%",
          height: "100%",
          background: "linear-gradient(135deg, transparent 38%, rgba(196,168,130,0.055) 38%)",
        }}
      />

      {/* ── Grain (Masked on left to blend with frame) ─────────────── */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 40%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)",
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.10] mix-blend-overlay"
        >
          <filter id="cta-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cta-noise)" />
        </svg>
      </div>

      {/* ── Intense Left Edge Fade (Morphs background into frame) ──────── */}
      <div
        className="absolute inset-y-0 left-0 w-[30%] pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to right, #2C1F14 0%, #2C1F14 15%, rgba(44,31,20,0.8) 45%, transparent 100%)",
        }}
      />



      {/* ═══════════════════════════════════════════════════════════════════════
          SMALL MARQUEE STRIP (At the top)
      ════════════════════════════════════════════════════════════════════════ */}
      <CTAMarquee type="bottom" />

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CTA CONTENT
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-14 lg:px-20"
        style={{ paddingTop: "clamp(1.5rem, 3vw, 2rem)", paddingBottom: "clamp(1.5rem, 3vw, 2rem)" }}
      >
        {/* Label */}
        <div
          className="flex items-center gap-4 mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            transitionDelay: "0.1s",
          }}
        >
          <div className="w-8 h-px bg-[#C4A882]/40" />
          <span
            className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#C4A882]/60"
            style={{ fontFamily: "monospace" }}
          >
            Ready to Begin
          </span>
        </div>

        {/* Giant headline — split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <h2
              ref={headingRef}
              data-anim="cta"
              className="font-heading font-bold text-[#F7F0E3] leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: "0.25s",
              }}
            >
              Turn ideas{" "}
              <span
                className="italic font-light"
                style={{ color: "#C4A882" }}
              >
                into
              </span>
              <br />
              visuals that{" "}
              <span
                className="relative inline-block"
                style={{
                  WebkitTextStroke: "1.5px rgba(196,168,130,0.5)",
                  color: "transparent",
                }}
              >
                sell.
                {/* underline sweep */}
                <span
                  className="absolute bottom-1 left-0 h-px bg-[#C4A882]"
                  style={{
                    width: visible ? "100%" : "0%",
                    transition: "width 1.2s cubic-bezier(0.76,0,0.24,1)",
                    transitionDelay: "0.9s",
                  }}
                />
              </span>
            </h2>
          </div>

          {/* Right col — sub-copy + buttons */}
          <div
            className="lg:col-span-4 flex flex-col gap-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
              transitionDelay: "0.5s",
            }}
          >
            <p className="font-body text-[14px] text-[#F7F0E3]/35 leading-[1.8] max-w-xs">
              Custom quote within 24 hours. No upfront payment. Studio quality at contractor pricing.
            </p>

            {/* CTA buttons (line text style) */}
            <div className="flex flex-col gap-6 mt-4">
              <Link href="/contact" className="group flex items-center gap-4 w-fit">
                <div className="w-8 h-[1.5px] bg-[#C4A882]/40 group-hover:w-24 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/70 group-hover:text-[#F7F0E3] transition-colors duration-300">
                  Start Your Project
                </span>
              </Link>
              <Link href="/portfolio" className="group flex items-center gap-4 w-fit">
                <div className="w-8 h-[1.5px] bg-[#F7F0E3]/20 group-hover:w-24 group-hover:bg-[#F7F0E3]/50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/50 group-hover:text-[#F7F0E3]/80 transition-colors duration-300">
                  View Our Work
                </span>
              </Link>
            </div>

            {/* Trust signal */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-[#2C1F14] flex items-center justify-center"
                    style={{ background: `hsl(${28 + i * 8}, 38%, ${28 + i * 5}%)` }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#C4A882]/60">
                      <circle cx="5" cy="4" r="2.2" fill="currentColor" />
                      <path d="M1 9.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="0.8" fill="none" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="font-body text-[11px] text-[#F7F0E3]/25">
                Trusted by contractors across California
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat bar ──────────────────────────────────────────────────────── */}
        <div
          className="mt-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
            transitionDelay: "0.7s",
          }}
        >
          {[
            { value: "48h", label: "Avg. Delivery" },
            { value: "100+", label: "Projects Completed" },
            { value: "$0", label: "Upfront Required" },
            { value: "2 Rev", label: "Included Standard" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                className="font-heading font-light text-[#F7F0E3] tabular-nums"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1 }}
              >
                {value}
              </span>
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C4A882]/45"
                style={{ fontFamily: "monospace" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Big marquee strip (at bottom, above footer) ────────────────────────────────── */}
      <CTAMarquee type="top" />
    </section>
  );
}
