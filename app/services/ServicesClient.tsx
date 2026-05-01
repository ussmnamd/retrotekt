"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ── Decorative: Architectural Blueprint Grid (hero bg) ──────────────────── */
function HeroGrid() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-full"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden
    >
      {/* Fine grid */}
      {Array.from({ length: 25 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 36} x2={1200} y2={i * 36} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.07} />
      ))}
      {Array.from({ length: 34 }, (_, i) => (
        <line key={`v${i}`} x1={i * 36} y1={0} x2={i * 36} y2={900} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.07} />
      ))}
      {/* Diagonal perspective lines — architectural feel */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`d${i}`} x1={600 + i * 80} y1={0} x2={1200} y2={900 - i * 65} stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.05} />
      ))}
      {/* Floor plan outlines */}
      <rect x={700} y={80} width={220} height={150} stroke="#C4A882" strokeWidth={0.8} fill="none" strokeOpacity={0.1} />
      <rect x={700} y={80} width={100} height={70} stroke="#C4A882" strokeWidth={0.5} fill="none" strokeOpacity={0.08} />
      <rect x={940} y={200} width={180} height={260} stroke="#C4A882" strokeWidth={0.8} fill="none" strokeOpacity={0.1} />
      <rect x={700} y={260} width={220} height={180} stroke="#C4A882" strokeWidth={0.5} fill="none" strokeOpacity={0.06} />
      <line x1={700} y1={155} x2={920} y2={155} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.08} />
      <line x1={800} y1={80} x2={800} y2={230} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.08} />
      <line x1={920} y1={80} x2={920} y2={460} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.08} />
      {/* Dimension annotations */}
      <text x={790} y={72} fill="#C4A882" fillOpacity={0.18} fontSize={8} fontFamily="monospace" letterSpacing={1}>12&apos;-0&quot;</text>
      <text x={955} y={195} fill="#C4A882" fillOpacity={0.18} fontSize={8} fontFamily="monospace" letterSpacing={1}>LIVING</text>
      <text x={730} y={175} fill="#C4A882" fillOpacity={0.14} fontSize={7} fontFamily="monospace" letterSpacing={1}>BED 1</text>
      {/* Crosshair center mark */}
      <circle cx={810} cy={310} r={3} stroke="#C4A882" strokeWidth={0.8} fill="none" strokeOpacity={0.12} />
      <line x1={810} y1={298} x2={810} y2={322} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.1} />
      <line x1={798} y1={310} x2={822} y2={310} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.1} />
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const segments = [
  {
    emoji: "🏗️",
    label: "High-Value Builders & Designers",
    items: [
      { role: "General Contractors & Remodelers", value: "Close the trust gap and get contracts signed faster." },
      { role: "Custom Home Builders", value: "Show clients exactly what they're paying for before breaking ground." },
      { role: "Interior Designers & Architects", value: "Bring mood boards to life with stunning, pitch-ready accuracy." },
    ],
  },
  {
    emoji: "🏡",
    label: "Real Estate & Property Investors",
    items: [
      { role: "Real Estate Developers", value: "Secure funding faster with immersive pre-construction investor decks." },
      { role: "Property Flippers & Airbnb Owners", value: "Elevate your listings to command premium rates." },
      { role: "Luxury Real Estate Agents", value: "Market properties before renovations are even complete." },
    ],
  },
  {
    emoji: "☕",
    label: "Commercial & B2B Brands",
    items: [
      { role: "Café, Restaurant & Retail", value: "Visualize brand identity and secure lease approvals." },
      { role: "Office Fit-out & Hospitality", value: "Present polished, corporate-grade concepts to stakeholders." },
    ],
  },
];

const solutions = [
  {
    num: "01",
    tag: "Pre-Sale Visualization",
    title: "The Deal Closer",
    desc: "Your secret weapon to secure the contract before you swing a hammer. Help your client see it, approve it, and sign on the dotted line.",
    stats: [
      { val: "24–48h", label: "Turnaround" },
      { val: "Budget", label: "Friendly" },
    ],
    bullets: [
      "Lightning-fast concept delivery",
      "Basic 3D massing & before/after visuals",
      "Stops hesitation — accelerates signing",
    ],
    outcome: "Stop explaining your vision. Show it.",
  },
  {
    num: "02",
    tag: "Full Project Visualization",
    title: "High-End Precision",
    desc: "Ultra-realistic renders for after you land the client. Finalize the vision with stunning material accuracy and full space coverage.",
    stats: [
      { val: "4K+", label: "Resolution" },
      { val: "Day/Night", label: "Lighting" },
    ],
    bullets: [
      "Ultra-realistic interior & exterior renders",
      "Advanced atmospheric lighting & mood studies",
      "Multiple angles — complete coverage",
    ],
    outcome: "Total client alignment. Zero ambiguity.",
  },
  {
    num: "03",
    tag: "Cinematic Walkthroughs",
    title: "Immersive Experience",
    desc: "Put investors and clients inside the space before a single wall goes up. Cinematic video built for sales pitches and social media.",
    stats: [
      { val: "4K", label: "Video" },
      { val: "360°", label: "VR Ready" },
    ],
    bullets: [
      "15–60 second cinematic flythroughs",
      "Short-form clips optimized for Instagram",
      "360° panoramas — no app required on any device",
    ],
    outcome: "Immersive storytelling that sells before construction begins.",
  },
  {
    num: "04",
    tag: "Strategic Design & Marketing",
    title: "Creative Partnership",
    desc: "We move beyond visualization to become your full creative partner — layout optimization, investor pitch decks, and lead-generating assets.",
    stats: [
      { val: "Full", label: "Pitch Decks" },
      { val: "2D+3D", label: "Floor Plans" },
    ],
    bullets: [
      "Layout optimization & space planning",
      "Pitch decks, website visuals, before/after ads",
      "SketchUp modeling & construction documentation",
    ],
    outcome: "A creative partner, not just a rendering vendor.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Send Your Plans",
    body: "CAD, PDF, rough sketches, or even cell phone photos. We take it from there.",
    formats: ["CAD", "PDF", "Sketch", "Photo"],
  },
  {
    num: "02",
    title: "We Build the 3D",
    body: "Our team models the geometry, establishes camera angles, and sets the lighting for your review.",
    formats: [],
  },
  {
    num: "03",
    title: "Review & Refine",
    body: "Request changes. We iterate and refine every detail until it aligns perfectly with your vision.",
    formats: [],
  },
  {
    num: "04",
    title: "Fast Final Delivery",
    body: "HD, print-ready, and permit-compatible files — ready for proposals, permits, and pitches.",
    formats: ["HD", "Print", "Permit"],
  },
];

const edgePoints = [
  {
    title: "Speed Is Our Strength",
    body: "Rapid turnarounds built to match the pace of modern construction. We deliver when you need it — not when it's convenient for us.",
  },
  {
    title: "U.S. Market Expertise",
    body: "Deep fluency in American construction standards, contractor workflows, and architectural aesthetics that resonate with U.S. clients.",
  },
  {
    title: "ROI-Focused Visuals",
    body: "Most rendering services focus on pretty images. We engineer the exact visual tools you need to win the project and close the deal.",
  },
];

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function ServicesClient() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll(".reveal");
    if (!elements) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="bg-primary overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-32 pb-28">
        {/* Architectural blueprint grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <HeroGrid />
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 h-px bg-[#3D2A1A]" />

        <div className="relative max-w-7xl mx-auto w-full">
          {/* Section label row */}
          <div className="flex items-center gap-4 mb-12">
            <span className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/60">Services</span>
            <div className="h-px bg-secondary/20 w-10 flex-shrink-0" />
            <span className="font-body text-[12px] tracking-[0.14em] uppercase text-background/20">Retrotekt Studio</span>
          </div>

          {/* Main headline */}
          <h1
            className="reveal font-heading font-bold text-background leading-[0.93] tracking-[-0.03em] mb-10"
            style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
          >
            We Don&apos;t Just<br />
            <span className="text-secondary">Render Spaces.</span><br />
            We Help You<br />
            Win Projects.
          </h1>

          {/* Subheadline */}
          <p className="reveal reveal-delay-1 font-body text-[16px] text-background/45 leading-[1.75] max-w-[520px] mb-14">
            Boutique 3D Visualization &amp; Design Solutions for Elite Builders,
            Developers, and Designers — award-winning, agency-grade visuals
            built for the speed of modern construction.
          </p>

          {/* CTA row */}
          <div className="reveal reveal-delay-2 flex flex-wrap items-center gap-5 mb-20">
            <Link
              href="/contact"
              className="btn-sand font-body text-[13px] tracking-[0.14em] uppercase"
            >
              Request Your Custom Project Blueprint
            </Link>
            <div className="flex flex-col gap-1">
              <span className="font-body text-[12px] tracking-[0.1em] uppercase text-background/25">
                Custom quotes in 24 hours
              </span>
              <span className="font-body text-[12px] tracking-[0.1em] uppercase text-background/25">
                Zero upfront payment required
              </span>
            </div>
          </div>

          {/* Trust stat row */}
          <div className="reveal flex flex-wrap gap-x-12 gap-y-6 pt-10 border-t border-[#3D2A1A]">
            {[
              { val: "24h", label: "Quote Turnaround" },
              { val: "$0", label: "Upfront Payment" },
              { val: "100%", label: "In-House Production" },
              { val: "4K+", label: "Delivery Resolution" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-heading font-light text-secondary tabular-nums" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
                  {s.val}
                </div>
                <div className="font-body text-[11px] tracking-[0.14em] uppercase text-background/30 mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — SERVICE CATALOG
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]" style={{ background: "#1C1309" }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 pb-16 border-b border-[#3D2A1A]">
            <div>
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
                What We Deliver
              </p>
              <h2
                className="reveal font-heading font-bold text-background leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                Every Visual Tool<br />You Need to Win.
              </h2>
            </div>
            <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[360px] leading-relaxed">
              Six core service categories — each engineered for a specific moment
              in your project lifecycle. Mix and match to match your exact scope.
            </p>
          </div>

          {/* ── SERVICE 01: Hyper-Realistic Still Renders ── */}
          <div className="reveal group border-b border-[#3D2A1A] pb-20 mb-20">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              {/* Left: Visual placeholder + meta */}
              <div className="lg:w-[45%] flex flex-col gap-6">
                {/* Render preview block */}
                <div className="relative aspect-[4/3] bg-[#241A0F] border border-[#3D2A1A] overflow-hidden">
                  {/* Architectural illustration — interior render suggestion */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
                    {/* Room walls — perspective interior */}
                    <polygon points="0,360 120,200 360,200 480,360" fill="#2C1F14" />
                    <polygon points="120,0 120,200 360,200 360,0" fill="#231710" />
                    <polygon points="0,0 120,0 120,200 0,360" fill="#1E1409" />
                    <polygon points="360,0 480,0 480,360 360,200" fill="#1E1409" />
                    {/* Ceiling */}
                    <polygon points="0,0 480,0 360,200 120,200" fill="#281C0E" />
                    {/* Floor highlight */}
                    <polygon points="120,200 360,200 480,360 0,360" fill="#2E2010" />
                    {/* Window — right wall */}
                    <rect x="375" y="60" width="80" height="100" fill="#C4A882" fillOpacity={0.06} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.15} />
                    <line x1="415" y1="60" x2="415" y2="160" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    <line x1="375" y1="110" x2="455" y2="110" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    {/* Light beam from window */}
                    <polygon points="375,60 455,60 480,360 340,360" fill="#C4A882" fillOpacity={0.025} />
                    {/* Sofa silhouette */}
                    <rect x="160" y="280" width="160" height="50" rx="4" fill="#3D2A1A" />
                    <rect x="150" y="265" width="180" height="30" rx="4" fill="#4A3322" />
                    <rect x="150" y="265" width="20" height="65" rx="2" fill="#4A3322" />
                    <rect x="310" y="265" width="20" height="65" rx="2" fill="#4A3322" />
                    {/* Coffee table */}
                    <rect x="195" y="315" width="90" height="8" rx="1" fill="#3D2A1A" />
                    {/* Floor lamp */}
                    <line x1="385" y1="180" x2="385" y2="320" stroke="#C4A882" strokeWidth={1} strokeOpacity={0.2} />
                    <ellipse cx="385" cy="180" rx="12" ry="6" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                    {/* Ambient glow dots */}
                    <circle cx="385" cy="180" r="20" fill="#C4A882" fillOpacity={0.04} />
                    {/* Grid lines on floor */}
                    {Array.from({ length: 6 }, (_, i) => {
                      const t = (i + 1) / 7;
                      const x = 120 + t * 240;
                      const farY = 200;
                      const nearX = t < 0.5 ? t * 2 * 120 : 120 + (t - 0.5) * 2 * 240;
                      return <line key={i} x1={x} y1={farY} x2={nearX < 120 ? 0 : nearX > 360 ? 480 : nearX + 120} y2={360} stroke="#C4A882" strokeWidth={0.3} strokeOpacity={0.06} />;
                    })}
                    {/* Horizon grid */}
                    {Array.from({ length: 4 }, (_, i) => {
                      const t = (i + 1) / 5;
                      const y = 200 + t * 160;
                      const xl = 120 - t * 120;
                      const xr = 360 + t * 120;
                      return <line key={i} x1={xl} y1={y} x2={xr} y2={y} stroke="#C4A882" strokeWidth={0.3} strokeOpacity={0.06} />;
                    })}
                  </svg>
                  {/* Label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between" style={{ background: "linear-gradient(to top, #1C1309cc, transparent)" }}>
                    <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/50">Interior Render · Living Room</span>
                    <span className="font-body text-[11px] tracking-[0.1em] text-background/25">4K · Day Lighting</span>
                  </div>
                </div>

                {/* Spec table */}
                <div className="grid grid-cols-2 gap-px bg-[#3D2A1A]">
                  {[
                    { k: "Resolution", v: "Up to 4K (4096×2160)" },
                    { k: "Format", v: "JPG · PNG · TIFF" },
                    { k: "Turnaround", v: "3–5 business days" },
                    { k: "Revisions", v: "Included (multiple rounds)" },
                    { k: "Lighting", v: "Day · Dusk · Night studies" },
                    { k: "Compatibility", v: "Print · Permit · Web ready" },
                  ].map((row) => (
                    <div key={row.k} className="bg-[#1C1309] px-4 py-3">
                      <div className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/40 mb-0.5">{row.k}</div>
                      <div className="font-body text-[13px] text-background/60">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Description */}
              <div className="lg:w-[55%] flex flex-col justify-start pt-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary/40">01</span>
                  <div className="h-px bg-[#3D2A1A] flex-grow" />
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40">Still Renders</span>
                </div>

                <h3
                  className="font-heading font-bold text-background leading-[0.95] tracking-[-0.02em] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  Hyper-Realistic<br />Still Renders
                </h3>

                <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                  Our photorealistic renders are indistinguishable from photography.
                  Every material — stone, timber, brushed steel, fabric — is recreated
                  with physical accuracy. Every light source behaves as it does in the
                  real world: bouncing, scattering, casting shadow with precision.
                </p>
                <p className="font-body text-[16px] text-background/40 leading-[1.85] mb-10 max-w-[480px]">
                  Delivered HD and print-ready, our renders work for client proposals,
                  permit applications, investor presentations, and marketing campaigns.
                  We offer interior, exterior, and mixed-scene coverage.
                </p>

                {/* Feature list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "Interior & exterior scenes",
                    "Physical material accuracy",
                    "Natural & artificial lighting",
                    "Day, dusk & night variants",
                    "Furnished or unfurnished",
                    "Before/after comparisons",
                    "Permit-compatible output",
                    "Social & print resolutions",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                      <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                  <div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Starting from</div>
                    <div className="font-heading text-secondary font-light text-[1.6rem]">$200 <span className="text-[0.9rem] text-background/30">/ render</span></div>
                  </div>
                  <Link href="/portfolio#renders" className="btn-text font-body text-[12px] tracking-[0.12em] uppercase ml-auto">
                    Get a quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── SERVICE 02: Cinematic Walkthroughs ── */}
          <div className="reveal group border-b border-[#3D2A1A] pb-20 mb-20">
            <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20">
              {/* Right side: Visual */}
              <div className="lg:w-[45%] flex flex-col gap-6">
                <div className="relative aspect-[4/3] bg-[#241A0F] border border-[#3D2A1A] overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
                    {/* Exterior building perspective */}
                    <rect x="0" y="0" width="480" height="360" fill="#1A1208" />
                    {/* Sky gradient suggestion */}
                    <rect x="0" y="0" width="480" height="200" fill="#1F1509" />
                    {/* Ground */}
                    <rect x="0" y="300" width="480" height="60" fill="#241A0F" />
                    {/* Main building facade */}
                    <rect x="100" y="60" width="200" height="240" fill="#2C1F14" />
                    {/* Building wing right */}
                    <rect x="300" y="120" width="100" height="180" fill="#281C10" />
                    {/* Building wing left */}
                    <rect x="60" y="140" width="40" height="160" fill="#281C10" />
                    {/* Windows — main facade */}
                    {[0, 1, 2].map((row) =>
                      [0, 1, 2, 3].map((col) => (
                        <rect
                          key={`w${row}-${col}`}
                          x={115 + col * 46}
                          y={80 + row * 65}
                          width={32}
                          height={45}
                          fill="#C4A882"
                          fillOpacity={row === 0 ? 0.12 : 0.07}
                          stroke="#C4A882"
                          strokeWidth={0.5}
                          strokeOpacity={0.15}
                        />
                      ))
                    )}
                    {/* Entrance */}
                    <rect x="175" y="250" width="50" height="50" fill="#1C1309" />
                    <rect x="177" y="252" width="46" height="46" fill="#C4A882" fillOpacity={0.05} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.12} />
                    {/* Canopy */}
                    <rect x="155" y="245" width="90" height="6" fill="#3D2A1A" />
                    {/* Camera path arc */}
                    <path d="M 20,320 Q 240,230 460,320" fill="none" stroke="#C4A882" strokeWidth={1} strokeOpacity={0.25} strokeDasharray="4 4" />
                    <circle cx="20" cy="320" r="4" fill="#C4A882" fillOpacity={0.4} />
                    <polygon points="455,315 465,320 455,325" fill="#C4A882" fillOpacity={0.4} />
                    {/* Play button overlay */}
                    <circle cx="240" cy="180" r="28" fill="#C4A882" fillOpacity={0.08} stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.2} />
                    <polygon points="233,170 233,190 254,180" fill="#C4A882" fillOpacity={0.3} />
                    {/* Duration badge */}
                    <rect x="170" y="325" width="60" height="16" rx="2" fill="#3D2A1A" />
                    <text x="182" y="337" fill="#C4A882" fillOpacity={0.5} fontSize={7} fontFamily="monospace">0:45 / 4K</text>
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between" style={{ background: "linear-gradient(to top, #1C1309cc, transparent)" }}>
                    <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/50">Exterior Flythrough · 45s</span>
                    <span className="font-body text-[11px] tracking-[0.1em] text-background/25">4K · Cinematic</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#3D2A1A]">
                  {[
                    { k: "Video Quality", v: "4K Ultra HD" },
                    { k: "Duration", v: "15s · 30s · 45s · 60s" },
                    { k: "Turnaround", v: "5–10 business days" },
                    { k: "Format", v: "MP4 · MOV · Web-ready" },
                    { k: "Audio", v: "Music + branding overlay" },
                    { k: "Delivery", v: "Download + streaming link" },
                  ].map((row) => (
                    <div key={row.k} className="bg-[#1C1309] px-4 py-3">
                      <div className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/40 mb-0.5">{row.k}</div>
                      <div className="font-body text-[13px] text-background/60">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Left side: Description */}
              <div className="lg:w-[55%] flex flex-col justify-start pt-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary/40">02</span>
                  <div className="h-px bg-[#3D2A1A] flex-grow" />
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40">Walkthroughs</span>
                </div>

                <h3
                  className="font-heading font-bold text-background leading-[0.95] tracking-[-0.02em] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  Cinematic<br />Walkthroughs &amp;<br />Animations
                </h3>

                <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                  Put your clients and investors inside the space before a single wall
                  goes up. Our cinematic walkthroughs use film-quality camera choreography,
                  atmospheric lighting, and real-world physics to deliver an experience
                  that stills simply cannot match.
                </p>
                <p className="font-body text-[16px] text-background/40 leading-[1.85] mb-10 max-w-[480px]">
                  From 15-second social clips to 60-second full interior tours and
                  sweeping exterior flythroughs — each video is crafted to land funding,
                  close sales, and dominate your market on social media.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "Room walkthroughs (15–30s)",
                    "Full interior tours (45–60s)",
                    "Exterior flythroughs & drone-angle",
                    "4K cinematic quality",
                    "Background music included",
                    "Logo & branding overlays",
                    "Social-ready aspect ratios",
                    "Investor deck integration",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                      <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                  <div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Starting from</div>
                    <div className="font-heading text-secondary font-light text-[1.6rem]">$800</div>
                  </div>
                  <Link href="/portfolio/chocolate-fish-modesto#films" className="btn-text font-body text-[12px] tracking-[0.12em] uppercase ml-auto">
                    Get a quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── SERVICE 03: Aerial & Bird's-Eye Views ── */}
          <div className="reveal group border-b border-[#3D2A1A] pb-20 mb-20">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              {/* Left: Visual */}
              <div className="lg:w-[45%] flex flex-col gap-6">
                <div className="relative aspect-[4/3] bg-[#241A0F] border border-[#3D2A1A] overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
                    <rect x="0" y="0" width="480" height="360" fill="#1A1208" />
                    {/* Aerial top-down site view */}
                    {/* Streets */}
                    <rect x="0" y="160" width="480" height="40" fill="#221609" />
                    <rect x="200" y="0" width="40" height="360" fill="#221609" />
                    {/* Street markings */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <rect key={i} x={216} y={i * 80} width={8} height={36} fill="#C4A882" fillOpacity={0.08} />
                    ))}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <rect key={i} x={i * 90} y={176} width={40} height={8} fill="#C4A882" fillOpacity={0.08} />
                    ))}
                    {/* Main building — top down */}
                    <rect x="60" y="30" width="120" height="110" fill="#2C1F14" stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.15} />
                    <rect x="80" y="50" width="80" height="70" fill="#241A0F" />
                    {/* Courtyard/pool */}
                    <rect x="90" y="60" width="60" height="50" fill="#1A1208" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    {/* Adjacent buildings */}
                    <rect x="260" y="20" width="90" height="120" fill="#281C10" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    <rect x="30" y="210" width="140" height="100" fill="#281C10" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    <rect x="250" y="220" width="180" height={80} fill="#2C1F14" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    {/* Trees / landscaping dots */}
                    {[[170, 70], [175, 100], [165, 95], [170, 140], [350, 50], [360, 70], [345, 80]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r={8} fill="#2C1F14" stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.12} />
                    ))}
                    {/* Drone/camera icon */}
                    <circle cx="400" cy="60" r="16" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.2} />
                    <line x1="392" y1="52" x2="408" y2="68" stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.15} />
                    <line x1="408" y1="52" x2="392" y2="68" stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.15} />
                    {/* Sight line from drone to building */}
                    <line x1="400" y1="60" x2="120" y2="85" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.1} strokeDasharray="6 4" />
                    {/* Scale bar */}
                    <line x1="30" y1="340" x2="130" y2="340" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                    <line x1="30" y1="336" x2="30" y2="344" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                    <line x1="130" y1="336" x2="130" y2="344" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                    <text x="55" y="336" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="monospace">50ft</text>
                    {/* Compass */}
                    <circle cx="450" cy="310" r="18" fill="none" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.15} />
                    <polygon points="450,294 453,308 450,305 447,308" fill="#C4A882" fillOpacity={0.3} />
                    <text x="447" y="332" fill="#C4A882" fillOpacity={0.25} fontSize={7} fontFamily="monospace">N</text>
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between" style={{ background: "linear-gradient(to top, #1C1309cc, transparent)" }}>
                    <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/50">Aerial Site Plan · Bird&apos;s-Eye</span>
                    <span className="font-body text-[11px] tracking-[0.1em] text-background/25">4K · Overhead</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#3D2A1A]">
                  {[
                    { k: "View Types", v: "Bird's-eye · Drone angle" },
                    { k: "Resolution", v: "Up to 4K" },
                    { k: "Turnaround", v: "3–5 business days" },
                    { k: "Context", v: "Full site + surroundings" },
                    { k: "Use Case", v: "Developer & investor decks" },
                    { k: "Format", v: "JPG · PNG · Print-ready" },
                  ].map((row) => (
                    <div key={row.k} className="bg-[#1C1309] px-4 py-3">
                      <div className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/40 mb-0.5">{row.k}</div>
                      <div className="font-body text-[13px] text-background/60">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Description */}
              <div className="lg:w-[55%] flex flex-col justify-start pt-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary/40">03</span>
                  <div className="h-px bg-[#3D2A1A] flex-grow" />
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40">Aerial Views</span>
                </div>

                <h3
                  className="font-heading font-bold text-background leading-[0.95] tracking-[-0.02em] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  Aerial &amp;<br />Bird&apos;s-Eye Views
                </h3>

                <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                  Show the full picture. Our aerial renders give developers, investors,
                  and planning committees a drone-perspective view of the entire site —
                  lot coverage, massing, landscaping, and surrounding context all rendered
                  with the same photorealistic precision as our ground-level work.
                </p>
                <p className="font-body text-[16px] text-background/40 leading-[1.85] mb-10 max-w-[480px]">
                  Essential for pre-construction marketing, zoning approvals, and investor
                  pitch decks where stakeholders need to understand the scale, location,
                  and relationship of the project to its environment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "True vertical bird's-eye views",
                    "Drone-angle (45° perspective)",
                    "Full site context & surroundings",
                    "Exterior massing clearly shown",
                    "Landscaping & hardscape included",
                    "Lot boundary overlays available",
                    "Pre-construction marketing",
                    "Zoning & permit presentations",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                      <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                  <div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Starting from</div>
                    <div className="font-heading text-secondary font-light text-[1.6rem]">$200 <span className="text-[0.9rem] text-background/30">/ view</span></div>
                  </div>
                  <Link href="/contact" className="btn-text font-body text-[12px] tracking-[0.12em] uppercase ml-auto">
                    Get a quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── SERVICE 04: 360° Panoramas ── */}
          <div className="reveal group border-b border-[#3D2A1A] pb-20 mb-20">
            <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20">
              {/* Right: Visual */}
              <div className="lg:w-[45%] flex flex-col gap-6">
                <div className="relative aspect-[4/3] bg-[#241A0F] border border-[#3D2A1A] overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
                    <rect x="0" y="0" width="480" height="360" fill="#1A1208" />
                    {/* 360 equirectangular grid */}
                    {Array.from({ length: 9 }, (_, i) => (
                      <line key={`h${i}`} x1={0} y1={i * 40} x2={480} y2={i * 40} stroke="#C4A882" strokeWidth={0.3} strokeOpacity={0.06} />
                    ))}
                    {Array.from({ length: 13 }, (_, i) => (
                      <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={360} stroke="#C4A882" strokeWidth={0.3} strokeOpacity={0.06} />
                    ))}
                    {/* Room panoramic suggestion — distorted perspective */}
                    {/* Left wall */}
                    <polygon points="0,0 100,80 100,280 0,360" fill="#261B0D" />
                    {/* Center / front wall */}
                    <polygon points="100,80 380,80 380,280 100,280" fill="#2C1F14" />
                    {/* Right wall */}
                    <polygon points="380,80 480,0 480,360 380,280" fill="#221609" />
                    {/* Ceiling */}
                    <polygon points="0,0 480,0 380,80 100,80" fill="#1F1409" />
                    {/* Floor */}
                    <polygon points="100,280 380,280 480,360 0,360" fill="#2A1D0B" />
                    {/* Windows on front wall */}
                    <rect x="150" y="100" width="80" height="120" fill="#C4A882" fillOpacity={0.06} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.12} />
                    <rect x="250" y="100" width="80" height="120" fill="#C4A882" fillOpacity={0.06} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.12} />
                    {/* 360 icon overlay */}
                    <circle cx="240" cy="180" r="36" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.18} />
                    <path d="M 212,175 A 28,14 0 0 1 268,175" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.3} />
                    <path d="M 268,185 A 28,14 0 0 1 212,185" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.3} />
                    <text x="224" y="184" fill="#C4A882" fillOpacity={0.35} fontSize={11} fontFamily="monospace" fontWeight="bold">360°</text>
                    {/* Navigation hotspot dots */}
                    {[[180, 220], [300, 240], [140, 160], [360, 150]].map(([cx, cy], i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r={5} fill="#C4A882" fillOpacity={0.15} stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.3} />
                        <circle cx={cx} cy={cy} r={2} fill="#C4A882" fillOpacity={0.4} />
                      </g>
                    ))}
                    {/* Device icons */}
                    <rect x="380" y="310" width="40" height="28" rx="3" fill="none" stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.2} />
                    <circle cx="400" cy="324" r="6" fill="none" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.15} />
                    <rect x="340" y="316" width="26" height="18" rx="2" fill="none" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.15} />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between" style={{ background: "linear-gradient(to top, #1C1309cc, transparent)" }}>
                    <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/50">360° Panorama · Interactive</span>
                    <span className="font-body text-[11px] tracking-[0.1em] text-background/25">VR · Mobile · Desktop</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#3D2A1A]">
                  {[
                    { k: "Type", v: "Interactive 360° render" },
                    { k: "Delivery", v: "Shareable link · No app" },
                    { k: "Compatible", v: "Mobile · Desktop · VR" },
                    { k: "Turnaround", v: "4–6 business days" },
                    { k: "Pricing", v: "Per room / per space" },
                    { k: "Hotspots", v: "Navigation points included" },
                  ].map((row) => (
                    <div key={row.k} className="bg-[#1C1309] px-4 py-3">
                      <div className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/40 mb-0.5">{row.k}</div>
                      <div className="font-body text-[13px] text-background/60">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Left: Description */}
              <div className="lg:w-[55%] flex flex-col justify-start pt-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary/40">04</span>
                  <div className="h-px bg-[#3D2A1A] flex-grow" />
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40">360° Panoramas</span>
                </div>

                <h3
                  className="font-heading font-bold text-background leading-[0.95] tracking-[-0.02em] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  360° Panoramas<br />&amp; Virtual Tours
                </h3>

                <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                  Fully immersive, interactive 360° room renders your clients can
                  explore at their own pace — on any device, from anywhere in the world.
                  No app download, no headset required. Just a shareable link they can
                  open on their phone or laptop and step inside.
                </p>
                <p className="font-body text-[16px] text-background/40 leading-[1.85] mb-10 max-w-[480px]">
                  Each panorama is rendered at ultra-high resolution and includes
                  navigation hotspots between rooms. Perfect for luxury listings,
                  remote client approvals, and investor presentations where physical
                  site visits aren&apos;t practical.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "Interactive — client self-navigates",
                    "Shareable link — no app needed",
                    "Works on mobile, desktop & VR",
                    "Multi-room linked tours",
                    "Navigation hotspots between spaces",
                    "Ultra-high-res equirectangular render",
                    "Ideal for remote client reviews",
                    "Embeds in websites & pitch decks",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                      <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                  <div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Starting from</div>
                    <div className="font-heading text-secondary font-light text-[1.6rem]">$300 <span className="text-[0.9rem] text-background/30">/ room</span></div>
                  </div>
                  <Link href="/contact" className="btn-text font-body text-[12px] tracking-[0.12em] uppercase ml-auto">
                    Get a quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── SERVICE 05: Floor Plan Renders ── */}
          <div className="reveal group border-b border-[#3D2A1A] pb-20 mb-20">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              {/* Left: Visual */}
              <div className="lg:w-[45%] flex flex-col gap-6">
                <div className="relative aspect-[4/3] bg-[#241A0F] border border-[#3D2A1A] overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
                    <rect x="0" y="0" width="480" height="360" fill="#1A1208" />
                    {/* Fine grid */}
                    {Array.from({ length: 18 }, (_, i) => (
                      <line key={`h${i}`} x1={20} y1={20 + i * 18} x2={460} y2={20 + i * 18} stroke="#C4A882" strokeWidth={0.25} strokeOpacity={0.05} />
                    ))}
                    {Array.from({ length: 24 }, (_, i) => (
                      <line key={`v${i}`} x1={20 + i * 18} y1={20} x2={20 + i * 18} y2={340} stroke="#C4A882" strokeWidth={0.25} strokeOpacity={0.05} />
                    ))}
                    {/* Outer walls — thick */}
                    <rect x="40" y="40" width="400" height="280" fill="none" stroke="#C4A882" strokeWidth={3} strokeOpacity={0.35} />
                    {/* Internal walls */}
                    <line x1="200" y1="40" x2="200" y2="220" stroke="#C4A882" strokeWidth={2} strokeOpacity={0.25} />
                    <line x1="200" y1="40" x2="200" y2="40" stroke="none" />
                    <line x1="200" y1="220" x2="440" y2="220" stroke="#C4A882" strokeWidth={2} strokeOpacity={0.25} />
                    <line x1="320" y1="40" x2="320" y2="220" stroke="#C4A882" strokeWidth={2} strokeOpacity={0.25} />
                    <line x1="40" y1="180" x2="200" y2="180" stroke="#C4A882" strokeWidth={2} strokeOpacity={0.25} />
                    {/* Doors */}
                    <path d="M 200,180 Q 216,164 216,180" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.3} />
                    <path d="M 320,120 Q 336,104 336,120" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.3} />
                    {/* Room labels */}
                    {[
                      { x: 100, y: 105, label: "LIVING", sub: "18' × 16'" },
                      { x: 365, y: 120, label: "BED 1", sub: "14' × 12'" },
                      { x: 260, y: 260, label: "KITCHEN", sub: "12' × 10'" },
                      { x: 100, y: 250, label: "BED 2", sub: "12' × 11'" },
                    ].map((r) => (
                      <g key={r.label}>
                        <text x={r.x} y={r.y} fill="#C4A882" fillOpacity={0.3} fontSize={8} fontFamily="monospace" textAnchor="middle" letterSpacing={1}>{r.label}</text>
                        <text x={r.x} y={r.y + 12} fill="#C4A882" fillOpacity={0.18} fontSize={6} fontFamily="monospace" textAnchor="middle">{r.sub}</text>
                      </g>
                    ))}
                    {/* Dimension lines */}
                    <line x1="40" y1="20" x2="440" y2="20" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                    <line x1="40" y1="16" x2="40" y2="24" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                    <line x1="440" y1="16" x2="440" y2="24" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                    <text x="240" y="16" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="monospace" textAnchor="middle">42&apos;-0&quot;</text>
                    <line x1="460" y1="40" x2="460" y2="320" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                    <line x1="456" y1="40" x2="464" y2="40" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                    <line x1="456" y1="320" x2="464" y2="320" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                    <text x="472" y="184" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="monospace" textAnchor="middle" transform="rotate(90, 472, 184)">30&apos;-0&quot;</text>
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between" style={{ background: "linear-gradient(to top, #1C1309cc, transparent)" }}>
                    <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/50">2D Floor Plan · Annotated</span>
                    <span className="font-body text-[11px] tracking-[0.1em] text-background/25">Permit Ready</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#3D2A1A]">
                  {[
                    { k: "Output", v: "2D annotated floor plan" },
                    { k: "Turnaround", v: "2–3 business days" },
                    { k: "Pricing", v: "Per floor" },
                    { k: "Format", v: "PDF · DWG · PNG" },
                    { k: "Annotation", v: "Dimensions + room labels" },
                    { k: "Standards", v: "US permit-compatible" },
                  ].map((row) => (
                    <div key={row.k} className="bg-[#1C1309] px-4 py-3">
                      <div className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/40 mb-0.5">{row.k}</div>
                      <div className="font-body text-[13px] text-background/60">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Description */}
              <div className="lg:w-[55%] flex flex-col justify-start pt-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary/40">05</span>
                  <div className="h-px bg-[#3D2A1A] flex-grow" />
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40">Floor Plans</span>
                </div>

                <h3
                  className="font-heading font-bold text-background leading-[0.95] tracking-[-0.02em] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  Architectural<br />Floor Plan Renders
                </h3>

                <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                  Clean, precise, permit-compatible floor plan renders that communicate
                  your design with professional clarity. Every wall thickness, door
                  swing, window placement, and room dimension rendered to U.S. architectural
                  standards and annotated for immediate use in proposals and permits.
                </p>
                <p className="font-body text-[16px] text-background/40 leading-[1.85] mb-10 max-w-[480px]">
                  We work from your CAD files, PDF drawings, or rough sketches — and
                  deliver polished, visually sharp floor plans your clients can actually
                  read and approve without needing an architecture degree.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "Full dimension annotations",
                    "Room labels & square footage",
                    "Door & window placements",
                    "Permit-ready U.S. format",
                    "2D rendered & color-coded options",
                    "Multi-floor buildings supported",
                    "Fast 2–3 day turnaround",
                    "Works from CAD, PDF, or sketch",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                      <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                  <div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Starting from</div>
                    <div className="font-heading text-secondary font-light text-[1.6rem]">$150 <span className="text-[0.9rem] text-background/30">/ floor</span></div>
                  </div>
                  <Link href="/contact" className="btn-text font-body text-[12px] tracking-[0.12em] uppercase ml-auto">
                    Get a quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── SERVICE 06: Pre-Sale Concepts ── */}
          <div className="reveal group">
            <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20">
              {/* Right: Visual */}
              <div className="lg:w-[45%] flex flex-col gap-6">
                <div className="relative aspect-[4/3] bg-[#241A0F] border border-[#3D2A1A] overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
                    <rect x="0" y="0" width="480" height="360" fill="#1A1208" />
                    {/* Split before/after composition */}
                    {/* Before — left half, rougher/sketchy */}
                    <rect x="0" y="0" width="240" height="360" fill="#1C1309" />
                    {/* After — right half, rendered */}
                    <rect x="240" y="0" width="240" height="360" fill="#221609" />
                    {/* Divider line */}
                    <line x1="240" y1="0" x2="240" y2="360" stroke="#C4A882" strokeWidth={1} strokeOpacity={0.3} strokeDasharray="4 3" />
                    {/* Before side: sketch lines */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <line key={`s${i}`} x1={20 + Math.random() * 10} y1={50 + i * 38} x2={215 + Math.random() * 10} y2={50 + i * 38 + Math.random() * 8 - 4} stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.08 + Math.random() * 0.06} />
                    ))}
                    <rect x="40" y="80" width="80" height="60" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.12} strokeDasharray="3 2" />
                    <rect x="140" y="100" width="60" height="80" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.12} strokeDasharray="3 2" />
                    <text x="120" y="40" fill="#C4A882" fillOpacity={0.2} fontSize={8} fontFamily="monospace" textAnchor="middle" letterSpacing={2}>BEFORE</text>
                    {/* After side: rendered */}
                    <polygon points="240,80 380,80 380,280 240,280" fill="#2C1F14" />
                    <polygon points="380,80 480,120 480,320 380,280" fill="#241A0F" />
                    <polygon points="240,40 480,40 480,120 380,80 240,80" fill="#221609" />
                    <rect x="270" y="110" width="60" height="80" fill="#C4A882" fillOpacity={0.06} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.12} />
                    <rect x="350" y="130" width="20" height="60" fill="#C4A882" fillOpacity={0.05} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                    <rect x="270" y="260" width="100" height="20" fill="#3D2A1A" />
                    <text x="360" y="40" fill="#C4A882" fillOpacity={0.2} fontSize={8} fontFamily="monospace" textAnchor="middle" letterSpacing={2}>AFTER</text>
                    {/* Clock icon — fast turnaround */}
                    <circle cx="60" cy="310" r="20" fill="none" stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.2} />
                    <line x1="60" y1="310" x2="60" y2="297" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                    <line x1="60" y1="310" x2="70" y2="316" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                    <text x="90" y="308" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="monospace">24–48h</text>
                    <text x="90" y="318" fill="#C4A882" fillOpacity={0.2} fontSize={6} fontFamily="monospace">DELIVERY</text>
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between" style={{ background: "linear-gradient(to top, #1C1309cc, transparent)" }}>
                    <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/50">Pre-Sale Concept · Before / After</span>
                    <span className="font-body text-[11px] tracking-[0.1em] text-background/25">24–48h Delivery</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#3D2A1A]">
                  {[
                    { k: "Turnaround", v: "24–48 hours" },
                    { k: "Input", v: "Any format accepted" },
                    { k: "Output", v: "Concept render + before/after" },
                    { k: "Pricing", v: "Budget-friendly tier" },
                    { k: "Best For", v: "Pre-contract client approval" },
                    { k: "Goal", v: "Stop hesitation. Get signed." },
                  ].map((row) => (
                    <div key={row.k} className="bg-[#1C1309] px-4 py-3">
                      <div className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/40 mb-0.5">{row.k}</div>
                      <div className="font-body text-[13px] text-background/60">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Left: Description */}
              <div className="lg:w-[55%] flex flex-col justify-start pt-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary/40">06</span>
                  <div className="h-px bg-[#3D2A1A] flex-grow" />
                  <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40">Pre-Sale Concepts</span>
                </div>

                <h3
                  className="font-heading font-bold text-background leading-[0.95] tracking-[-0.02em] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                >
                  Pre-Sale<br />Concepts &amp;<br />Rapid Visuals
                </h3>

                <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                  Your secret weapon for closing the contract before the project even
                  begins. Before you invest in full production renders, these rapid
                  concept visuals give your client just enough — enough to see it,
                  believe it, and sign off on it.
                </p>
                <p className="font-body text-[16px] text-background/40 leading-[1.85] mb-10 max-w-[480px]">
                  Delivered in 24–48 hours from whatever you have on hand — a napkin
                  sketch, cell phone photo, or rough PDF. Budget-friendly, lightning-fast,
                  and specifically designed to remove hesitation and accelerate the
                  signing process.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {[
                    "24–48 hour concept delivery",
                    "Works from any input format",
                    "Before/after compositions",
                    "Basic 3D massing concepts",
                    "Budget-friendly pricing",
                    "Exterior & interior options",
                    "Removes client hesitation",
                    "Upgrade path to full renders",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                      <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                  <div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Pricing</div>
                    <div className="font-heading text-secondary font-light text-[1.6rem]">Custom <span className="text-[0.9rem] text-background/30">/ scope</span></div>
                  </div>
                  <Link href="/contact" className="btn-text font-body text-[12px] tracking-[0.12em] uppercase ml-auto">
                    Get a quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — WHO WE PARTNER WITH
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]" style={{ background: "#221709" }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 pb-16 border-b border-[#3D2A1A]">
            <div>
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
                Who We Partner With
              </p>
              <h2
                className="reveal font-heading font-bold text-background leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                We Don&apos;t Work<br />With Everyone.
              </h2>
            </div>
            <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[340px] leading-relaxed">
              We engineer visual assets for professionals who rely on speed,
              precision, and presentation to scale their businesses. If you
              build, design, or sell spaces — you are in the right place.
            </p>
          </div>

          {/* Segment columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#3D2A1A]">
            {segments.map((seg, i) => (
              <div
                key={seg.label}
                className={`reveal reveal-delay-${Math.min(i + 1, 2)} flex flex-col py-10 md:py-0 ${i > 0 ? "md:pl-12" : ""} ${i < segments.length - 1 ? "md:pr-12" : ""}`}
              >
                <div className="text-4xl mb-6">{seg.emoji}</div>
                <h3 className="font-body text-[12px] tracking-[0.18em] uppercase text-secondary mb-8 leading-snug">
                  {seg.label}
                </h3>
                <ul className="flex flex-col gap-7">
                  {seg.items.map((item) => (
                    <li key={item.role} className="relative pl-4">
                      <div className="absolute left-0 top-[6px] w-1 h-1 rounded-full bg-secondary/50" />
                      <div className="font-body text-[15px] text-background/80 mb-1.5 leading-snug">
                        {item.role}
                      </div>
                      <div className="font-body text-[14px] text-background/35 leading-relaxed">
                        {item.value}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — OUR SOLUTIONS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-4">
            <div>
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
                Our Solutions
              </p>
              <h2
                className="reveal font-heading font-bold text-background leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                Engineered<br />to Close Deals.
              </h2>
            </div>
            <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[360px] leading-relaxed">
              We don&apos;t sell &ldquo;renders.&rdquo; We package our services as strategic
              solutions tailored to where you are in the project lifecycle.
            </p>
          </div>

          {/* Solution tiers — alternating rows */}
          {solutions.map((sol, i) => (
            <div
              key={sol.num}
              className={`reveal group border-t border-[#3D2A1A] py-16 md:py-20 flex flex-col md:flex-row gap-12 md:gap-16 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Left col: Ghost number + label + title + stats */}
              <div className="md:w-[42%] flex flex-col justify-between gap-8">
                <div>
                  {/* Ghost number */}
                  <div
                    className="font-heading font-bold text-background/[0.04] leading-none select-none"
                    style={{ fontSize: "clamp(5rem, 14vw, 11rem)", letterSpacing: "-0.04em" }}
                  >
                    {sol.num}
                  </div>
                  <div className="font-body text-[12px] tracking-[0.2em] uppercase text-secondary/55 mb-3 mt-2">
                    {sol.tag}
                  </div>
                  <h3
                    className="font-heading font-bold text-background tracking-[-0.02em] leading-[0.97]"
                    style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)" }}
                  >
                    {sol.title}
                  </h3>
                </div>

                {/* Stat pills */}
                <div className="flex gap-6">
                  {sol.stats.map((stat) => (
                    <div key={stat.label} className="border-l-2 border-secondary/25 pl-4">
                      <div className="font-heading text-secondary font-light mb-0.5" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}>
                        {stat.val}
                      </div>
                      <div className="font-body text-[11px] tracking-[0.14em] uppercase text-background/30">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: Description + bullets + outcome quote */}
              <div className="md:w-[58%] flex flex-col justify-center">
                <p className="font-body text-[15px] text-background/55 leading-[1.8] max-w-[520px] mb-8">
                  {sol.desc}
                </p>

                <ul className="flex flex-col gap-3.5 mb-10">
                  {sol.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 font-body text-[15px] text-background/45">
                      <span className="text-secondary flex-shrink-0 mt-0.5">→</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Outcome callout */}
                <div className="flex items-stretch gap-4">
                  <div className="w-0.5 bg-secondary/30 flex-shrink-0 rounded-full" />
                  <p className="font-body text-[14px] text-secondary/65 italic leading-relaxed">
                    {sol.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — IN-HOUSE QUALITY GUARANTEE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-[#D4C5A9]">
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-24 mb-20">
            <div className="md:w-1/2">
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-muted mb-5">
                Our Guarantee
              </p>
              <h2
                className="reveal font-heading font-bold text-primary leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
              >
                The In-House<br />Quality<br />Guarantee.
              </h2>
            </div>
            <div className="md:w-1/2 flex flex-col gap-6 md:pt-4">
              {/* Live badge */}
              <div className="reveal inline-flex items-center gap-3 self-start border border-[#D4C5A9] bg-surface px-5 py-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
                <span className="font-body text-[12px] tracking-[0.14em] uppercase text-muted">
                  100% In-House Production — Always
                </span>
              </div>

              <p className="reveal reveal-delay-1 font-body text-[15px] text-deep leading-[1.8] max-w-[520px]">
                Unlike volume-based rendering mills that outsource your work to a
                rotating door of freelancers, every single project is handled
                entirely in-house by our dedicated, experienced team.
              </p>
              <p className="reveal reveal-delay-2 font-body text-[15px] text-deep leading-[1.8] max-w-[520px]">
                This ensures consistent, award-winning quality, strict quality
                control, and a deep understanding of your unique aesthetic
                standards — from the very first concept to final delivery.
              </p>
            </div>
          </div>

          {/* Edge points — 3 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[#D4C5A9]">
            {edgePoints.map((pt, i) => (
              <div
                key={pt.title}
                className={`reveal reveal-delay-${Math.min(i + 1, 2)} pt-10 pb-4 ${i > 0 ? "md:pl-10 md:border-l border-[#D4C5A9]" : ""} ${i < edgePoints.length - 1 ? "md:pr-10" : ""} border-b md:border-b-0 border-[#D4C5A9] last:border-b-0`}
              >
                <div
                  className="font-heading font-bold text-primary/[0.05] leading-none select-none mb-4"
                  style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}
                >
                  0{i + 1}
                </div>
                <h3 className="font-body text-[13px] tracking-[0.14em] uppercase text-primary mb-4">
                  {pt.title}
                </h3>
                <p className="font-body text-[15px] text-deep/65 leading-relaxed">
                  {pt.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — OUR PROCESS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]" style={{ background: "#1A1108" }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
                Our Process
              </p>
              <h2
                className="reveal font-heading font-bold text-background leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                Seamless &amp; Fast.
              </h2>
            </div>
            <p className="reveal reveal-delay-1 font-body text-[15px] text-background/30 max-w-[320px] leading-relaxed">
              We know contractor workflows. We keep it simple so you can focus
              on building — not managing your visualization vendor.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Desktop connector line */}
            <div className="hidden md:block absolute top-[3.25rem] left-0 right-0 h-px bg-[#3D2A1A]" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
              {processSteps.map((step, i) => (
                <div key={step.num} className={`reveal reveal-delay-${Math.min(i + 1, 2)} relative`}>
                  {/* Step marker */}
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="flex items-center justify-center w-6 h-6 border border-[#3D2A1A] bg-[#1A1108] flex-shrink-0 relative z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    </div>
                    <span className="md:hidden font-body text-[12px] tracking-[0.14em] uppercase text-secondary/50">
                      Step {step.num}
                    </span>
                  </div>

                  {/* Ghost number */}
                  <div
                    className="font-heading font-bold text-background/[0.04] leading-none select-none mb-4"
                    style={{ fontSize: "clamp(3.5rem, 8vw, 5.5rem)" }}
                  >
                    {step.num}
                  </div>

                  <h3 className="font-body text-[13px] tracking-[0.14em] uppercase text-secondary mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-[15px] text-background/38 leading-relaxed mb-5">
                    {step.body}
                  </p>

                  {/* Format badges */}
                  {step.formats.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {step.formats.map((f) => (
                        <span
                          key={f}
                          className="font-body text-[11px] tracking-[0.12em] uppercase text-secondary/50 border border-[#3D2A1A] px-2 py-0.5"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — PAYMENT PROMISE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]" style={{ background: "#221709" }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
                Our Payment Promise
              </p>
              <h2
                className="reveal font-heading font-bold text-background leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                Zero-Risk<br />Partnership.
              </h2>
            </div>
            <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[380px] leading-relaxed">
              Trust is earned through performance. We don&apos;t believe you should
              fund a project before seeing meaningful progress.
            </p>
          </div>

          {/* Payment milestone infographic */}
          <div className="reveal relative">
            {/* Track bar */}
            <div className="relative mb-0">
              {/* Background bar */}
              <div className="h-0.5 bg-[#3D2A1A] w-full" />
              {/* Filled indicator (50%) */}
              <div className="absolute top-0 left-0 h-0.5 w-1/2 bg-gradient-to-r from-secondary/60 to-secondary/30" />
            </div>

            {/* Milestone markers */}
            <div className="grid grid-cols-3 -mt-2">
              {[
                {
                  label: "Project Start",
                  amount: "$0",
                  sub: "No upfront payment required",
                  note: "We begin immediately",
                  align: "left",
                },
                {
                  label: "50% Complete",
                  amount: "50% Due",
                  sub: "Only on initial concept review",
                  note: "You see it before you pay",
                  align: "center",
                },
                {
                  label: "Final Delivery",
                  amount: "50% Due",
                  sub: "On file handoff",
                  note: "Paying for a product, not a promise",
                  align: "right",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`flex flex-col ${m.align === "center" ? "items-center text-center" : m.align === "right" ? "items-end text-right" : "items-start text-left"} pt-6`}
                >
                  {/* Dot */}
                  <div className={`w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/15 mb-5 ${m.align === "center" ? "" : ""}`} />
                  <div className="font-body text-[11px] tracking-[0.16em] uppercase text-secondary/60 mb-1.5">
                    {m.label}
                  </div>
                  <div
                    className="font-heading font-light text-background mb-1 tabular-nums"
                    style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                  >
                    {m.amount}
                  </div>
                  <div className="font-body text-[14px] text-background/40 mb-1">{m.sub}</div>
                  <div className="font-body text-[13px] text-secondary/45 italic">{m.note}</div>
                </div>
              ))}
            </div>

            {/* Bottom callout */}
            <div className="mt-16 flex items-stretch gap-5 max-w-2xl">
              <div className="w-0.5 bg-secondary/25 flex-shrink-0 rounded-full" />
              <p className="font-body text-[15px] text-background/40 leading-relaxed italic">
                This structure ensures total alignment and protects you from paying for a promise
                rather than a product — from the very first line drawn to the final file delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-28 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
            <div className="md:w-3/5">
              <p className="font-body text-[12px] tracking-[0.22em] uppercase text-muted mb-6">
                Ready to Win?
              </p>
              <h2
                className="reveal font-heading font-bold text-primary leading-[0.93] tracking-[-0.03em] mb-0"
                style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
              >
                Stop Losing Bids<br />to &ldquo;Lack of<br />
                <span className="text-secondary">Imagination.&rdquo;</span>
              </h2>
            </div>
            <div className="md:w-2/5 flex flex-col gap-6">
              <p className="reveal reveal-delay-1 font-body text-[16px] text-deep/60 leading-[1.8] max-w-sm">
                Stop explaining your vision. Start showing it. Submit your project
                details and get a custom quote within 24 hours — no obligation, no
                upfront payment.
              </p>
              <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="btn-primary font-body text-[13px] tracking-[0.12em] uppercase"
                >
                  <span>Get a Custom Quote in 24 Hours</span>
                </Link>
              </div>
              <Link
                href="/contact"
                className="reveal reveal-delay-2 btn-text font-body text-[13px] tracking-[0.1em] uppercase self-start"
              >
                Start Your Project Intake Form →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
