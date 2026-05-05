"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay = "0s") => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)`,
    transitionDelay: delay,
  });

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="relative overflow-hidden"
      style={{ background: "#2C1F14" }}
      aria-label="Call to action"
    >
      {/* ── Award-winning background: architectural plan arcs ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 700"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="arc-fade" cx="50%" cy="100%" r="75%">
            <stop offset="0%" stopColor="#C4A882" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#2C1F14" stopOpacity="0" />
          </radialGradient>
          <mask id="arc-mask">
            <radialGradient id="mask-g" cx="50%" cy="90%" r="75%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0.08" />
            </radialGradient>
            <rect width="100%" height="100%" fill="url(#mask-g)" />
          </mask>
        </defs>
        <g mask="url(#arc-mask)">
          {[100, 220, 350, 490, 640, 800, 970, 1150, 1340].map((r, i) => (
            <circle key={i} cx="700" cy="780" r={r} fill="none" stroke="#C4A882"
              strokeWidth="0.65" opacity={Math.max(0.004, 0.05 - i * 0.005)} />
          ))}
          <line x1="700" y1="0" x2="700" y2="700" stroke="#C4A882" strokeWidth="0.5" opacity="0.04" />
          <line x1="0" y1="780" x2="1400" y2="780" stroke="#C4A882" strokeWidth="0.5" opacity="0.04" />
          {[-80, -65, -50, -35, -20, -5, 5, 20, 35, 50, 65, 80].map((deg, i) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <line key={i} x1="700" y1="780"
                x2={700 + Math.cos(rad) * 1500} y2={780 + Math.sin(rad) * 1500}
                stroke="#C4A882" strokeWidth="0.45" opacity="0.022" />
            );
          })}
          <line x1="688" y1="780" x2="712" y2="780" stroke="#C4A882" strokeWidth="1" opacity="0.20" />
          <line x1="700" y1="768" x2="700" y2="792" stroke="#C4A882" strokeWidth="1" opacity="0.20" />
          <circle cx="700" cy="780" r="4.5" fill="none" stroke="#C4A882" strokeWidth="0.8" opacity="0.25" />
        </g>
        <rect width="100%" height="100%" fill="url(#arc-fade)" />
        <filter id="cta-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cta-grain)" opacity="0.055" style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col items-center text-center max-w-screen-xl mx-auto px-6 md:px-12"
        style={{ paddingTop: "clamp(2.5rem, 4vw, 3.5rem)", paddingBottom: "clamp(2rem, 3.5vw, 3rem)" }}
      >
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-7"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.7s ease, transform 0.7s ease", transitionDelay: "0.05s" }}
        >
          <div className="w-5 h-px bg-[#C4A882]/35" />
          <span className="uppercase text-[#C4A882]/45 tracking-[0.32em]" style={{ fontFamily: "monospace", fontSize: "9px" }}>
            The Studio That Delivers
          </span>
          <div className="w-5 h-px bg-[#C4A882]/35" />
        </div>

        {/* Headline */}
        <h2
          className="font-heading font-bold text-[#F7F0E3] leading-[0.92] tracking-[-0.04em] mb-12"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)", maxWidth: "16ch", ...fadeUp("0.12s") }}
        >
          Every great deal{" "}
          <span className="italic font-light" style={{ color: "#C4A882" }}>
            starts with
          </span>{" "}
          a better visual.
        </h2>

        {/* ── PAYMENT PROMISE — prominent, elaborated ── */}
        <div className="w-full max-w-2xl mb-12" style={fadeUp("0.28s")}>
          <span
            className="uppercase text-[#C4A882]/70 tracking-[0.32em] mb-6 block"
            style={{ fontFamily: "monospace", fontSize: "8px" }}
          >
            Our Payment Promise
          </span>

          {/* 3-step grid */}
          <div className="grid grid-cols-3 gap-0 relative">
            {/* Connecting line behind */}
            <div className="absolute top-[22px] left-[16.66%] right-[16.66%] h-px bg-[#C4A882]/15 pointer-events-none" />

            {[
              {
                dot: true,
                value: "$0",
                label: "Project Start",
                sub: "No upfront payment required",
                note: "We begin the moment you brief us. Nothing owed until you see real progress.",
              },
              {
                dot: false,
                value: "50%",
                label: "First Concept",
                sub: "Due on initial review",
                note: "You review the first complete concept. Pay only once you've seen what we built.",
              },
              {
                dot: false,
                value: "50%",
                label: "Final Delivery",
                sub: "Due on file handoff",
                note: "The remaining balance is due when we deliver your finished, production-ready files.",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2 px-3 relative">
                <div
                  className="w-2 h-2 rounded-full z-10 relative"
                  style={{
                    background: i === 0 ? "rgba(196,168,130,0.95)" : "rgba(196,168,130,0.50)",
                    boxShadow: i === 0 ? "0 0 0 4px rgba(196,168,130,0.10)" : "none",
                  }}
                />
                <span
                  className="font-heading font-light text-[#F7F0E3] tabular-nums leading-none"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
                >
                  {step.value}
                </span>
                <span
                  className="font-body font-medium text-[#C4A882] tracking-[0.08em] uppercase"
                  style={{ fontSize: "10px" }}
                >
                  {step.label}
                </span>
                <span
                  className="text-[#C4A882]/80 tracking-[0.12em] uppercase"
                  style={{ fontFamily: "monospace", fontSize: "7.5px" }}
                >
                  {step.sub}
                </span>
                <p className="font-body text-[12px] text-[#F7F0E3]/70 leading-relaxed mt-1 max-w-[160px]">
                  {step.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full max-w-xs h-px mb-8"
          style={{ background: "rgba(196,168,130,0.10)", ...fadeUp("0.40s") }}
        />

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center gap-7 mb-12"
          style={fadeUp("0.45s")}
        >
          <Link href="/contact" className="group flex items-center gap-4">
            <div className="w-8 h-[1.5px] bg-[#C4A882]/40 group-hover:w-20 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/85 group-hover:text-[#F7F0E3] transition-colors duration-300">
              Start Your Project
            </span>
          </Link>
          <div className="hidden sm:block w-px h-3.5 bg-[#C4A882]/15" />
          <Link href="/portfolio" className="group flex items-center gap-4">
            <div className="w-8 h-[1.5px] bg-[#F7F0E3]/12 group-hover:w-20 group-hover:bg-[#F7F0E3]/35 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/55 group-hover:text-[#F7F0E3]/80 transition-colors duration-300">
              View Our Work
            </span>
          </Link>
        </div>

        {/* ── STATS — compact row ── */}
        <div
          className="flex flex-wrap justify-center gap-x-10 gap-y-3 pt-4"
          style={{ borderTop: "1px solid rgba(196,168,130,0.12)", ...fadeUp("0.58s") }}
        >
          {[
            { value: "48h", label: "Avg. Delivery" },
            { value: "100+", label: "Projects" },
            { value: "$0", label: "Upfront" },
            { value: "2 Rev", label: "Included" },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span
                className="font-heading font-light text-[#F7F0E3]/85 tabular-nums"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
              >
                {value}
              </span>
              <span
                className="uppercase text-[#C4A882]/60 tracking-[0.18em]"
                style={{ fontFamily: "monospace", fontSize: "8px" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM MARQUEE ── */}
      <div
        className="relative overflow-hidden"
        style={{ borderTop: "1px solid rgba(196,168,130,0.12)", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}
        aria-hidden="true"
      >
        <div className="flex" style={{ animation: "cta-strip 30s linear infinite" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap flex-shrink-0 flex items-center gap-6"
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(0.75rem, 1.4vw, 1rem)",
                color: "rgba(196,168,130,0.45)",
                letterSpacing: "0.25em",
                paddingRight: "clamp(3rem, 5vw, 5rem)",
              }}
            >
              PHOTOREALISTIC · 3D VISUALIZATION · RETROTEKT · USA · 2026 · STUDIO QUALITY · CONTRACTOR PRICING ·
            </span>
          ))}
        </div>
        <style>{`
          @keyframes cta-strip {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}
