"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/use-in-view";

/* ── Lazy-loaded sections ─────────────────────────────────────────────────── */

function SectionSkeleton() {
  return <div className="w-full min-h-[200px] bg-[#1C1309]" aria-hidden="true" />;
}

const ServiceCatalog = dynamic(() => import("./_sections/ServiceCatalog"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const OurSolutions = dynamic(() => import("./_sections/OurSolutions"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const RetrotektStandard = dynamic(() => import("./_sections/RetrotektStandard"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const PaymentPromise = dynamic(() => import("./_sections/PaymentPromise"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const FinalCTA = dynamic(() => import("./_sections/FinalCTA"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});

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
      <text x={790} y={72} fill="#C4A882" fillOpacity={0.18} fontSize={8} fontFamily="var(--font-geist-sans)" letterSpacing={1}>12&apos;-0&quot;</text>
      <text x={955} y={195} fill="#C4A882" fillOpacity={0.18} fontSize={8} fontFamily="var(--font-geist-sans)" letterSpacing={1}>LIVING</text>
      <text x={730} y={175} fill="#C4A882" fillOpacity={0.14} fontSize={7} fontFamily="var(--font-geist-sans)" letterSpacing={1}>BED 1</text>
      {/* Crosshair center mark */}
      <circle cx={810} cy={310} r={3} stroke="#C4A882" strokeWidth={0.8} fill="none" strokeOpacity={0.12} />
      <line x1={810} y1={298} x2={810} y2={322} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.1} />
      <line x1={798} y1={310} x2={822} y2={310} stroke="#C4A882" strokeWidth={0.5} strokeOpacity={0.1} />
    </svg>
  );
}

/* ── Hero stats ──────────────────────────────────────────────────────────── */
const statItems = [
  { prefix: "", num: 24, suffix: "h", label: "Quote Turnaround" },
  { prefix: "$", num: 0, suffix: "", label: "Upfront Payment" },
  { prefix: "", num: 100, suffix: "%", label: "In-House Production" },
  { prefix: "", num: 4, suffix: "K+", label: "Delivery Resolution" },
];

function StatCounter({ prefix, num, suffix, active, delay }: {
  prefix: string; num: number; suffix: string; active: boolean; delay: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (num === 0) { setCount(0); return; }
    let raf: number;
    let start: number | null = null;
    const duration = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round(ease(p) * num));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [active, num, delay]);
  return <>{prefix}{count}{suffix}</>;
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function ServicesClient() {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  const sec2 = useInView("400px");
  const sec3 = useInView("400px");
  const sec4 = useInView("400px");
  const sec6 = useInView("400px");
  const sec7 = useInView("400px");

  // Stats count-up trigger
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Cursor tracking — write to CSS vars on a ref'd element via rAF.
  // Avoids re-rendering the whole page tree on every mousemove.
  useEffect(() => {
    let pending = false;
    let nx = 0, ny = 0;
    const flush = () => {
      pending = false;
      const el = glowRef.current;
      if (el) {
        el.style.setProperty("--mx", `${nx}px`);
        el.style.setProperty("--my", `${ny}px`);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      nx = e.pageX; ny = e.pageY;
      if (!pending) { pending = true; requestAnimationFrame(flush); }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll reveal for hero elements
  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll(".reveal, .reveal-clip");
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
    <main ref={pageRef} className="bg-primary overflow-hidden relative rounded-b-[2.5rem] mb-6">
      {/* ── GLOBAL AESTHETICS: GRAIN & CURSOR GLOW ── */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0 mix-blend-screen opacity-60 transition-opacity duration-300"
        style={{
          background: "radial-gradient(900px circle at var(--mx,50%) var(--my,50%), rgba(196,168,130,0.08), transparent 40%)"
        }}
        aria-hidden="true"
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22] mix-blend-overlay z-0" aria-hidden="true">
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-16 pt-24 pb-10">
        {/* Architectural blueprint grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <HeroGrid />
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 h-px bg-[#3D2A1A]" />

        <div className="relative max-w-7xl mx-auto w-full">
          {/* Section label — pulled down */}
          <div className="flex items-center gap-4 mb-12 mt-6">
            <span className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/60">Services</span>
            <div className="h-px bg-secondary/20 w-10 flex-shrink-0" />
            <span className="font-body text-[12px] tracking-[0.14em] uppercase text-background/20">Retrotekt Studio</span>
          </div>

          {/* Two-column: text left, animated stats right */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">
            {/* Left */}
            <div className="flex-1">
              <h1
                className="font-heading font-medium text-background leading-[0.93] tracking-[-0.03em] mb-10 relative z-10"
                style={{ fontSize: "clamp(1rem, 7vw, 4rem)" }}
              >
                <span className="block overflow-hidden"><span className="block reveal">We Don&apos;t Just</span></span>
                <span className="block overflow-hidden"><span className="block reveal reveal-delay-1 text-secondary">Render Spaces.</span></span>
                <span className="block overflow-hidden"><span className="block reveal reveal-delay-2">We Help You</span></span>
                <span className="block overflow-hidden"><span className="block reveal reveal-delay-3">Win Projects.</span></span>
              </h1>

              <p className="reveal reveal-delay-3 font-body text-[16px] text-background/55 leading-[1.75] max-w-[520px] mb-14 relative z-10" style={{ transitionDelay: '0.5s' }}>
                Boutique 3D Visualization &amp; Design Solutions for Elite Builders,
                Developers, and Designers. Award-winning, agency-grade visuals
                engineered for the high-velocity world of modern construction.
              </p>

              <div className="reveal reveal-delay-3 flex flex-wrap items-center gap-5 relative z-10" style={{ transitionDelay: '0.6s' }}>
                <Link href="/contact" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35 transition-colors duration-300">
                  <div className="w-8 h-[1.5px] bg-secondary/60 group-hover:w-24 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-secondary group-hover:text-secondary transition-colors duration-300">Request Your Custom Project Blueprint</span>
                </Link>
                <div className="flex flex-col gap-1">
                  <span className="font-body text-[12px] tracking-[0.1em] uppercase text-background/25">Custom quotes in 24 hours</span>
                  <span className="font-body text-[12px] tracking-[0.1em] uppercase text-background/25">Zero upfront payment required</span>
                </div>
              </div>
            </div>

            {/* Right: animated stat stack */}
            <div ref={statsRef} className="lg:w-[260px] xl:w-[280px] flex-shrink-0 self-start">
              {statItems.map((s, i) => (
                <div
                  key={s.label}
                  className="relative py-5"
                  style={{
                    opacity: statsActive ? 1 : 0,
                    transform: statsActive ? "translateY(0)" : "translateY(18px)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
                    transitionDelay: `${i * 110}ms`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-px bg-secondary/25 origin-left"
                    style={{
                      width: "100%",
                      transform: statsActive ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 0.75s cubic-bezier(0.76,0,0.24,1)",
                      transitionDelay: `${i * 110}ms`,
                    }}
                  />
                  <div className="font-heading font-light text-secondary tabular-nums leading-none" style={{ fontSize: "clamp(2rem, 3.2vw, 2.6rem)" }}>
                    <StatCounter prefix={s.prefix} num={s.num} suffix={s.suffix} active={statsActive} delay={i * 130} />
                  </div>
                  <div className="font-body text-[10px] tracking-[0.2em] uppercase text-background/35 mt-1.5">{s.label}</div>
                </div>
              ))}
              <div
                className="h-px bg-secondary/25 origin-left"
                style={{
                  transform: statsActive ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 0.75s cubic-bezier(0.76,0,0.24,1)",
                  transitionDelay: `${statItems.length * 110}ms`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Below-fold sections — lazy-mounted via IntersectionObserver ── */}

      <div ref={sec2.ref}>
        {sec2.inView && <ServiceCatalog />}
      </div>

      <div ref={sec3.ref}>
        {sec3.inView && <OurSolutions />}
      </div>

      <div ref={sec4.ref}>
        {sec4.inView && <RetrotektStandard />}
      </div>

      <div ref={sec6.ref}>
        {sec6.inView && <PaymentPromise />}
      </div>

      <div ref={sec7.ref}>
        {sec7.inView && <FinalCTA />}
      </div>

    </main>
  );
}
