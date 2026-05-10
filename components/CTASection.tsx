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

  const phases = [
    {
      num: "01",
      name: "Tactical Start",
      milestone: "We brief the project and begin modeling immediately.",
      commitment: "$0 Upfront Cost",
      commitmentSub: "Nothing owed. We move first.",
    },
    {
      num: "02",
      name: "The Reveal",
      milestone: "You review the first high-fidelity concept.",
      commitment: "50% Due",
      commitmentSub: "Only after you see it.",
    },
    {
      num: "03",
      name: "Mission Success",
      milestone: "Final renders delivered in 4K, print-ready format.",
      commitment: "50% Balance",
      commitmentSub: "On file handoff.",
    },
  ];

  const stats = [
    { icon: "⚡", value: "48h", label: "Average Delivery" },
    { icon: "🎯", value: "100+", label: "High-Stakes Projects" },
    { icon: "🛡️", value: "Zero", label: "Risk Entry" },
    { icon: "🔄", value: "2 Rev", label: "Rounds Included" },
  ];

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="relative overflow-hidden"
      style={{ background: "#2C1F14" }}
      aria-label="Call to action"
    >
      {/* ── Architectural plan arc background ── */}
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

      <div
        className="relative z-10 flex flex-col items-center text-center max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16"
        style={{ paddingTop: "clamp(2.5rem, 4vw, 3.5rem)", paddingBottom: "clamp(2rem, 3.5vw, 3rem)" }}
      >
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-7"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.7s ease, transform 0.7s ease", transitionDelay: "0.05s" }}
        >
          <div className="w-5 h-px bg-[#C4A882]/35" />
          <span className="uppercase text-[#C4A882]/45 tracking-[0.32em]" style={{ fontFamily: "monospace", fontSize: "11px" }}>
            The Studio That Delivers
          </span>
          <div className="w-5 h-px bg-[#C4A882]/35" />
        </div>

        {/* Headline */}
        <h2
          className="font-heading font-bold text-[#F7F0E3] leading-[0.92] tracking-[-0.04em] mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", maxWidth: "20ch", ...fadeUp("0.12s") }}
        >
          Stop Funding Promises.{" "}
          <span className="italic font-light" style={{ color: "#C4A882" }}>
            Start Seeing Results.
          </span>
        </h2>

        {/* Body */}
        <p
          className="font-body text-[#F7F0E3]/60 leading-relaxed mb-12 max-w-2xl"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", ...fadeUp("0.20s") }}
        >
          Most studios demand a deposit before they even open your files. At Retrotekt, we put our skin in the game first. We move at the speed of construction so you can close deals while your competitors are still waiting on a quote.
        </p>

        {/* ── Phase table ── */}
        <div className="w-full max-w-2xl mb-10" style={fadeUp("0.28s")}>
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-6 pb-3 mb-1" style={{ borderBottom: "1px solid rgba(196,168,130,0.15)" }}>
            <span className="uppercase text-[#C4A882]/45 tracking-[0.28em] text-left" style={{ fontFamily: "monospace", fontSize: "10px" }}>Phase</span>
            <span className="uppercase text-[#C4A882]/45 tracking-[0.28em] text-left" style={{ fontFamily: "monospace", fontSize: "10px" }}>Milestone</span>
            <span className="uppercase text-[#C4A882]/45 tracking-[0.28em] text-right" style={{ fontFamily: "monospace", fontSize: "10px" }}>Your Commitment</span>
          </div>

          {/* Table rows */}
          {phases.map((phase, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto] gap-x-6 py-4 text-left items-center"
              style={{ borderBottom: "1px solid rgba(196,168,130,0.08)" }}
            >
              {/* Phase */}
              <div className="flex flex-col gap-0.5 min-w-[90px]">
                <span className="text-[#C4A882]/40 tabular-nums" style={{ fontFamily: "monospace", fontSize: "10px" }}>{phase.num}.</span>
                <span className="font-body font-semibold text-[#F7F0E3]/90 tracking-[0.04em]" style={{ fontSize: "13px" }}>{phase.name}</span>
              </div>

              {/* Milestone */}
              <p className="font-body text-[#F7F0E3]/55 leading-snug" style={{ fontSize: "13px" }}>
                {phase.milestone}
              </p>

              {/* Commitment */}
              <div className="flex flex-col items-end gap-0.5 min-w-[120px]">
                <span
                  className="font-heading font-light tabular-nums"
                  style={{ color: i === 0 ? "#C4A882" : "rgba(247,240,227,0.85)", fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
                >
                  {phase.commitment}
                </span>
                <span className="text-[#C4A882]/50 tracking-[0.1em]" style={{ fontFamily: "monospace", fontSize: "10px" }}>
                  {phase.commitmentSub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-3 mb-10" style={fadeUp("0.38s")}>
          <Link
            href="/consulting"
            className="group inline-flex items-center gap-5 px-8 py-4 rounded-[3px] border border-[#C4A882]/40 bg-[#C4A882]/10 hover:bg-[#C4A882]/18 hover:border-[#C4A882]/60 transition-colors duration-300"
          >
            <div className="w-6 h-[1.5px] bg-[#C4A882]/60 group-hover:w-16 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="font-body font-medium tracking-[0.22em] uppercase text-[#F7F0E3]/90 group-hover:text-[#F7F0E3] transition-colors duration-300" style={{ fontSize: "12px" }}>
              Claim Your $0 Start &amp; Custom Quote
            </span>
            <div className="w-6 h-[1.5px] bg-[#C4A882]/60 group-hover:w-16 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          </Link>
          <span className="text-[#F7F0E3]/35 tracking-[0.18em] uppercase" style={{ fontFamily: "monospace", fontSize: "10px" }}>
            Submit your plans in 60 seconds. We start today.
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-full max-w-xs h-px mb-8"
          style={{ background: "rgba(196,168,130,0.10)", ...fadeUp("0.46s") }}
        />

        {/* Why section label */}
        <span
          className="uppercase text-[#C4A882]/45 tracking-[0.32em] mb-6 block"
          style={{ fontFamily: "monospace", fontSize: "10px", ...fadeUp("0.50s") }}
        >
          Why Elite Builders Choose Us
        </span>

        {/* Stats row */}
        <div
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10"
          style={fadeUp("0.54s")}
        >
          {stats.map(({ icon, value, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span style={{ fontSize: "14px" }}>{icon}</span>
              <span
                className="font-heading font-light text-[#F7F0E3]/85 tabular-nums"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
              >
                {value}
              </span>
              <span
                className="uppercase text-[#C4A882]/55 tracking-[0.16em]"
                style={{ fontFamily: "monospace", fontSize: "9px" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Secondary CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-7"
          style={fadeUp("0.60s")}
        >
          <Link href="/consulting" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35 transition-colors duration-300">
            <div className="w-8 h-[1.5px] bg-[#C4A882]/40 group-hover:w-20 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/85 group-hover:text-[#F7F0E3] transition-colors duration-300">
              Get My Free Project Blueprint
            </span>
          </Link>
          <div className="hidden sm:block w-px h-3.5 bg-[#C4A882]/15" />
          <Link href="/portfolio" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-[#F7F0E3]/[0.08] bg-[#F7F0E3]/[0.03] hover:bg-[#F7F0E3]/[0.07] hover:border-[#F7F0E3]/15 transition-colors duration-300">
            <div className="w-8 h-[1.5px] bg-[#F7F0E3]/12 group-hover:w-20 group-hover:bg-[#F7F0E3]/35 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/55 group-hover:text-[#F7F0E3]/80 transition-colors duration-300">
              View The Portfolio
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
