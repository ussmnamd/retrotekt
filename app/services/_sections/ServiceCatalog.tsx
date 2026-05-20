"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function ServiceCatalog() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = ref.current?.querySelectorAll(".reveal, .reveal-clip");
    if (!elements?.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="pt-8 pb-8 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]" style={{ background: "#1C1309" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6 pb-6 border-b border-[#3D2A1A]">
          <div>
            <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-3">
              What We Deliver
            </p>
            <h2
              className="reveal font-heading font-light text-background leading-[0.95] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Every Visual Asset<br />You Need to Close
            </h2>
          </div>
          <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[360px] leading-relaxed">
            Six core service categories — each engineered for a specific moment
            in your project lifecycle. Mix and match to match your exact scope.
          </p>
        </div>

        {/* ── SERVICE 01: Hyper-Realistic Still Renders ── */}
        <div id="renders" className="reveal group border-b border-[#3D2A1A] pb-10 mb-10" style={{ scrollMarginTop: "80px" }}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
                className="font-heading font-light text-background leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Still Renders<br /><span className="text-secondary/70">The &ldquo;Indistinguishable&rdquo;<br />Standard</span>
              </h3>

              <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                Our photorealistic renders are a psychological trigger for client trust.
                We don&apos;t just &ldquo;show&rdquo; a room; we recreate the physics of reality—how light
                scatters across brushed steel, the grain of timber, and the soft bounce of a dusk sky.
              </p>

              {/* Feature list */}
              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Best for: Client proposals, permit applications, and high-end marketing.",
                  "Includes: Physical material accuracy, day/dusk/night studies, and permit-compatible output.",
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
                <Link href="/portfolio#renders" className="group flex items-center gap-4 ml-auto">
                  <div className="w-6 h-[1.5px] bg-secondary/60 group-hover:w-16 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[10px] tracking-[0.25em] uppercase text-secondary transition-colors duration-300">Get a quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICE 02: Cinematic Walkthroughs ── */}
        <div id="walkthroughs" className="reveal group border-b border-[#3D2A1A] pb-10 mb-10" style={{ scrollMarginTop: "80px" }}>
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
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
                  <text x="182" y="337" fill="#C4A882" fillOpacity={0.5} fontSize={7} fontFamily="var(--font-geist-sans)">0:45 / 4K</text>
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
                className="font-heading font-light text-background leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Cinematic Walkthroughs<br /><span className="text-secondary/70">Motion That Sells</span>
              </h3>

              <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                Put your investors inside the space before the foundation is poured.
                Using film-quality camera choreography and atmospheric soundscapes,
                our animations turn a &ldquo;maybe&rdquo; into a &ldquo;yes.&rdquo;
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Best for: Landing funding, viral social media marketing, and investor decks.",
                  "Includes: 15–60s 4K Ultra HD video, branding overlays, and social-ready aspect ratios.",
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
                <Link href="/portfolio/chocolate-fish-modesto#films" className="group flex items-center gap-4 ml-auto">
                  <div className="w-6 h-[1.5px] bg-secondary/60 group-hover:w-16 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[10px] tracking-[0.25em] uppercase text-secondary transition-colors duration-300">Get a quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICE 03: Aerial & Bird's-Eye Views ── */}
        <div id="aerial" className="reveal group border-b border-[#3D2A1A] pb-10 mb-10" style={{ scrollMarginTop: "80px" }}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
                  <text x="55" y="336" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="var(--font-geist-sans)">50ft</text>
                  {/* Compass */}
                  <circle cx="450" cy="310" r="18" fill="none" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.15} />
                  <polygon points="450,294 453,308 450,305 447,308" fill="#C4A882" fillOpacity={0.3} />
                  <text x="447" y="332" fill="#C4A882" fillOpacity={0.25} fontSize={7} fontFamily="var(--font-geist-sans)">N</text>
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
                className="font-heading font-light text-background leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Aerial &amp; Bird&apos;s-Eye Views<br /><span className="text-secondary/70">The Big Picture</span>
              </h3>

              <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                Essential for large-scale developers and zoning boards. Show the
                relationship between the project and its environment—lot coverage,
                landscaping, and massing—all from a drone&apos;s perspective.
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Best for: Zoning/permit approvals and pre-construction site marketing.",
                  "Includes: True vertical site plans, drone-angle perspectives, and boundary overlays.",
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
                <Link href="/contact" className="group flex items-center gap-4 ml-auto">
                  <div className="w-6 h-[1.5px] bg-secondary/60 group-hover:w-16 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[10px] tracking-[0.25em] uppercase text-secondary transition-colors duration-300">Get a quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICE 04: 360° Panoramas ── */}
        <div className="reveal group border-b border-[#3D2A1A] pb-10 mb-10">
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
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
                  <text x="224" y="184" fill="#C4A882" fillOpacity={0.35} fontSize={11} fontFamily="var(--font-geist-sans)" fontWeight="bold">360°</text>
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
                className="font-heading font-light text-background leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                360° Panoramas &amp; VR<br /><span className="text-secondary/70">Total Immersion</span>
              </h3>

              <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                A shareable link that lets your client step inside the design from
                their phone or laptop. No apps, no headsets—just pure, interactive
                immersion that allows for remote approvals from anywhere in the world.
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Best for: Luxury listings and remote client sign-offs.",
                  "Includes: Multi-room navigation hotspots and browser-based 3D exploration.",
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
                <Link href="/contact" className="group flex items-center gap-4 ml-auto">
                  <div className="w-6 h-[1.5px] bg-secondary/60 group-hover:w-16 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[10px] tracking-[0.25em] uppercase text-secondary transition-colors duration-300">Get a quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICE 05: Floor Plan Renders ── */}
        <div id="floor-plans" className="reveal group border-b border-[#3D2A1A] pb-10 mb-10" style={{ scrollMarginTop: "80px" }}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
                      <text x={r.x} y={r.y} fill="#C4A882" fillOpacity={0.3} fontSize={8} fontFamily="var(--font-geist-sans)" textAnchor="middle" letterSpacing={1}>{r.label}</text>
                      <text x={r.x} y={r.y + 12} fill="#C4A882" fillOpacity={0.18} fontSize={6} fontFamily="var(--font-geist-sans)" textAnchor="middle">{r.sub}</text>
                    </g>
                  ))}
                  {/* Dimension lines */}
                  <line x1="40" y1="20" x2="440" y2="20" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                  <line x1="40" y1="16" x2="40" y2="24" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                  <line x1="440" y1="16" x2="440" y2="24" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                  <text x="240" y="16" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="var(--font-geist-sans)" textAnchor="middle">42&apos;-0&quot;</text>
                  <line x1="460" y1="40" x2="460" y2="320" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                  <line x1="456" y1="40" x2="464" y2="40" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                  <line x1="456" y1="320" x2="464" y2="320" stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.2} />
                  <text x="472" y="184" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="var(--font-geist-sans)" textAnchor="middle" transform="rotate(90, 472, 184)">30&apos;-0&quot;</text>
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
                className="font-heading font-light text-background leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Architectural Floor Plans<br /><span className="text-secondary/70">Precision Meets Clarity</span>
              </h3>

              <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                Clean, precise, and permit-compatible. We turn your CAD files or rough
                sketches into visually sharp, 2D or 3D color-coded plans that clients
                can actually understand at a glance.
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Best for: Sales brochures and permit-ready documentation.",
                  "Includes: U.S. standard annotations, room labels, and square footage details.",
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
                <Link href="/contact" className="group flex items-center gap-4 ml-auto">
                  <div className="w-6 h-[1.5px] bg-secondary/60 group-hover:w-16 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[10px] tracking-[0.25em] uppercase text-secondary transition-colors duration-300">Get a quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICE 06: Pre-Sale Concepts ── */}
        <div className="reveal group">
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
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
                  <rect x="40" y="80" width="80" height="60" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.12} strokeDasharray="3 2" />
                  <rect x="140" y="100" width="60" height="80" fill="none" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.12} strokeDasharray="3 2" />
                  <text x="120" y="40" fill="#C4A882" fillOpacity={0.2} fontSize={8} fontFamily="var(--font-geist-sans)" textAnchor="middle" letterSpacing={2}>BEFORE</text>
                  {/* After side: rendered */}
                  <polygon points="240,80 380,80 380,280 240,280" fill="#2C1F14" />
                  <polygon points="380,80 480,120 480,320 380,280" fill="#241A0F" />
                  <polygon points="240,40 480,40 480,120 380,80 240,80" fill="#221609" />
                  <rect x="270" y="110" width="60" height="80" fill="#C4A882" fillOpacity={0.06} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.12} />
                  <rect x="350" y="130" width="20" height="60" fill="#C4A882" fillOpacity={0.05} stroke="#C4A882" strokeWidth={0.4} strokeOpacity={0.1} />
                  <rect x="270" y="260" width="100" height="20" fill="#3D2A1A" />
                  <text x="360" y="40" fill="#C4A882" fillOpacity={0.2} fontSize={8} fontFamily="var(--font-geist-sans)" textAnchor="middle" letterSpacing={2}>AFTER</text>
                  {/* Clock icon — fast turnaround */}
                  <circle cx="60" cy="310" r="20" fill="none" stroke="#C4A882" strokeWidth={0.6} strokeOpacity={0.2} />
                  <line x1="60" y1="310" x2="60" y2="297" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                  <line x1="60" y1="310" x2="70" y2="316" stroke="#C4A882" strokeWidth={0.8} strokeOpacity={0.25} />
                  <text x="90" y="308" fill="#C4A882" fillOpacity={0.3} fontSize={7} fontFamily="var(--font-geist-sans)">24–48h</text>
                  <text x="90" y="318" fill="#C4A882" fillOpacity={0.2} fontSize={6} fontFamily="var(--font-geist-sans)">DELIVERY</text>
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
                className="font-heading font-light text-background leading-[0.95] tracking-[-0.02em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Pre-Sale Concepts<br /><span className="text-secondary/70">The 48-Hour Closer</span>
              </h3>

              <p className="font-body text-[16px] text-background/50 leading-[1.85] mb-8 max-w-[480px]">
                Your secret weapon for the &ldquo;undecided&rdquo; client. Before you commit to
                full-scale production, these rapid visuals give the client just enough
                to see the vision and sign the contract today.
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Best for: Rapid bidding and stopping client hesitation.",
                  "Includes: Before/after comparisons and basic 3D massing from any input (even napkin sketches).",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className="text-secondary/60 flex-shrink-0 text-[12px] mt-0.5">✦</span>
                    <span className="font-body text-[14px] text-background/45 leading-snug">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-[#3D2A1A]">
                <div>
                  <div className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/40 mb-0.5">Turnaround</div>
                  <div className="font-heading text-secondary font-light text-[1.6rem]">24–48h</div>
                </div>
                <Link href="/contact" className="group flex items-center gap-4 ml-auto">
                  <div className="w-6 h-[1.5px] bg-secondary/60 group-hover:w-16 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[10px] tracking-[0.25em] uppercase text-secondary transition-colors duration-300">Get a quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
