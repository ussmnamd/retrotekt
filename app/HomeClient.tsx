"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/use-in-view";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessCard } from "@/components/ProcessCard";
import { portfolioAssets } from "@/app/portfolio/assets";
import CTASection from "@/components/CTASection";
import { setupHeroAnimation } from "@/hooks/useHeroAnimation";
import { setupServicesAnimation } from "@/hooks/useServicesAnimation";
import { setupShowcaseAnimation } from "@/hooks/useShowcaseAnimation";
import { setupProcessAnimation } from "@/hooks/useProcessAnimation";
import { setupPortfolioAnimation } from "@/hooks/usePortfolioAnimation";
import { setupGenericAnimations, setupGenericAnimationsReduced } from "@/hooks/useGenericAnimationTriggers";
import PageLoader from "@/components/PageLoader";

const ModelShowcase = dynamic(() => import("@/components/ModelShowcase"), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-background" />
});

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  // Opaque fallback prevents the browser's stale compositor snapshot from
  // bleeding through the transparent canvas while the JS chunk is fetching.
  loading: () => <div style={{ position: "absolute", inset: 0, background: "var(--color-background, #F7F0E3)" }} />,
});


export default function HomeClient() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  // -1 = no phase active; increments as user scrolls through process steps
  const [processActivePhase, setProcessActivePhase] = useState(-1);
  const processRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const { ref: featuredVideoWrapRef, inView: featuredVideoInView } = useInView('200px');

  const [hero3dReady, setHero3dReady] = useState(false);

  /* ── 3D hero: auto-load on desktop, interaction-gated on mobile ── */
  useEffect(() => {
    if (hero3dReady) return;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };

    const reducedMotion = w.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = w.matchMedia("(pointer: coarse)").matches;
    const smallViewport = w.matchMedia("(max-width: 900px)").matches;
    const saveData = Boolean(nav.connection?.saveData);

    if (reducedMotion || saveData) return;

    const enableHero3d = () => setHero3dReady(true);

    if (coarsePointer || smallViewport) {
      const hero = document.getElementById("hero-section");
      hero?.addEventListener("pointerdown", enableHero3d, { once: true, passive: true });
      return () => hero?.removeEventListener("pointerdown", enableHero3d);
    }

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(enableHero3d, { timeout: 3000 });
    } else {
      timeoutId = setTimeout(enableHero3d, 1800);
    }

    return () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [hero3dReady]);

  /* ── GSAP: scroll animations deferred to idle so hero text can paint first ── */
  useEffect(() => {
    let cancelled = false;

    // All scroll-linked animations deferred to idle time (removes INP block)
    const initScrollAnims = async () => {
      if (cancelled) return;
      const gsapMod = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
      gsapMod.registerPlugin(ScrollTrigger, ScrollToPlugin);
      if (cancelled) return;

      ctxRef.current = gsapMod.context(() => {
        const mm = gsapMod.matchMedia();

        // ── Full-motion variant ────────────────────────────────────────────
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          // [data-hero-front] reveal is handled by CSS animation in globals.css

          // Hero scroll-indicator entrance + scrub-out
          setupHeroAnimation(gsapMod, ScrollTrigger);

          // Services section reveal
          setupServicesAnimation(gsapMod);

          // Model showcase pinned scroll + mouse tilt + navigation
          const showcaseCleanup = setupShowcaseAnimation(gsapMod, ScrollTrigger);

          // Process section drives processActivePhase state
          setupProcessAnimation(gsapMod, ScrollTrigger, processRef.current, setProcessActivePhase);

          // Portfolio grid reveal
          setupPortfolioAnimation(gsapMod);

          // Generic [data-anim] reveals
          setupGenericAnimations(gsapMod);

          // Return cleanup for event listeners registered inside showcase hook
          return () => showcaseCleanup?.();
        }); // end prefers-reduced-motion: no-preference

        // ── Reduced-motion variant ─────────────────────────────────────────
        mm.add("(prefers-reduced-motion: reduce)", () => {
          const imgs = gsapMod.utils.toArray<HTMLElement>(".showcase-img");
          const caps = gsapMod.utils.toArray<HTMLElement>(".showcase-cap");

          // Settle showcase into a static visible state — no pin, no scrub
          gsapMod.set(".showcase-img, .showcase-cap", { opacity: 0 });
          if (imgs[0]) gsapMod.set(imgs[0], { opacity: 1 });
          if (caps[0]) gsapMod.set(caps[0], { opacity: 1 });
          gsapMod.set(".showcase-slide", { position: "relative", opacity: 1 });

          // Slides 2 & 3: simple fade in on scroll
          gsapMod.utils.toArray<HTMLElement>(".showcase-slide").forEach((el, i) => {
            if (i > 0) {
              gsapMod.from(el, {
                opacity: 0, duration: 0.6,
                scrollTrigger: { trigger: el, start: "top 80%" },
              });
            }
          });

          // Instantly reveal process section (no stagger under reduced motion)
          ScrollTrigger.create({
            trigger: processRef.current ?? undefined,
            start: "top 70%",
            once: true,
            onEnter: () => setProcessActivePhase(3),
          });

          // Simple opacity fades for [data-anim] — no transforms
          setupGenericAnimationsReduced(gsapMod);
        });

      }, pageRef); // end gsap.context — scoped to pageRef

      // Refresh once after dynamic content settles
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => { initScrollAnims(); }, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(() => { initScrollAnims(); }, 200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      ctxRef.current?.revert();
    };
  }, []);

  return (
    <>
      <PageLoader />
<main className="relative w-full bg-background" ref={pageRef}>

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <div className="bg-primary">
        <section data-section="hero" className="relative w-full h-[78svh] min-h-[560px] md:h-screen md:min-h-[700px] overflow-hidden bg-background rounded-b-[2.5rem]">

          {/* 1. BACK LAYER (Z-0) — opaque base prevents compositor snapshot bleed-through */}
          <div className="absolute inset-0 z-0 w-full pointer-events-none bg-background" />

          {/* 2. 3D MODEL (Z-10) */}
          <div id="hero-section" className="absolute inset-0 z-10 pointer-events-auto">
            {hero3dReady && <Hero3D />}
          </div>

          {/* 3. FRONT LAYER (Interactive Button & Solid Logo, Z-30) */}
          <div className="absolute inset-0 z-30 w-full pointer-events-none" aria-hidden="true">

            {/* BOTTOM BAR: LOGO (Left) & TAGLINE (Right) */}
            <div className="absolute bottom-10 md:bottom-20 left-0 w-full px-6 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-0 pointer-events-none">
              
              {/* LOGO - Bottom Left */}
              <div data-hero-front className="flex flex-col items-start pointer-events-auto text-left">
                <p className="font-heading font-light text-[clamp(2rem,6vw,4.5rem)] text-primary tracking-[-0.03em] leading-[0.85] mb-3">
                  retrotekt<span className="text-secondary">.</span>
                </p>
                <div className="flex flex-col items-start gap-1.5 opacity-40">
                  <h1 className="font-body font-medium text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-primary">
                    3D Architectural Visualization Studio
                  </h1>
                  <div className="h-px bg-primary/30 w-12" />
                  <span className="font-body font-medium text-[9px] tracking-[0.2em] uppercase text-secondary">The New Standard</span>
                </div>
              </div>

              {/* TAGLINE + BUTTON - Bottom Right */}
              <div data-hero-front className="pointer-events-auto flex-shrink-0 flex flex-col items-start md:items-end text-left md:text-right gap-6 w-full md:w-auto">
                <div className="flex flex-col items-start md:items-end gap-3">
                  <h2 className="font-heading font-light text-[clamp(1.8rem,4.5vw,3.5rem)] leading-[0.9] text-primary tracking-[-0.03em]">
                    Visuals so <span className="font-bold">hyper-real,</span><br />
                    <span className="text-secondary/50">they sell the</span> <span className="italic font-serif">unbuilt.</span>
                  </h2>
                  <p className="font-body font-medium text-[12px] md:text-[14px] tracking-[0.2em] uppercase text-primary/70">
                    Step into your vision.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mt-2">
                  <Link href="/portfolio" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-primary/10 bg-transparent hover:bg-primary/[0.04] transition-colors duration-300">
                    <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary/70 group-hover:text-primary transition-colors duration-300">View Portfolio</span>
                  </Link>
                  <Link href="/consulting" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-primary/10 bg-primary/[0.04] hover:bg-primary/[0.09] hover:border-primary/20 transition-colors duration-300">
                    <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary group-hover:text-primary transition-colors duration-300">Start Project</span>
                    <div className="w-5 h-[1.5px] bg-primary/60 group-hover:w-12 group-hover:bg-primary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                  </Link>
                </div>
              </div>

            </div>

          </div>

          {/* Scroll indicator */}
          <div id="scroll-indicator" className="absolute bottom-12 right-6 md:right-12 flex flex-col items-center gap-4 opacity-40 pointer-events-none z-40">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary [writing-mode:vertical-rl]">Scroll</span>
            <div className="w-px h-16 bg-primary/20 relative overflow-hidden rounded-full">
              <div className="absolute w-full h-1/2 bg-primary/80 animate-scroll-drop" />
            </div>
          </div>
        </section>
        </div>

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        <section id="services-section" className="bg-primary pt-10 pb-12 overflow-hidden relative">

          <div className="heading-wrapper max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 mb-8 relative flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-secondary/40" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-secondary/90">What we do</span>
              <div className="h-px w-10 bg-secondary/40" />
            </div>
            <h2 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.1] text-background tracking-tight max-w-3xl">
              Every visual you <span className="text-secondary italic font-serif">need to sell.</span>
            </h2>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 relative" style={{ zIndex: 2 }}>
            <div id="service-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-8">
              {[
                { icon: "box", title: "Still Renders", desc: "Interior & exterior photorealistic images. HD, print-ready, permit-compatible.", href: "/services#renders" },
                { icon: "cylinder", title: "Walkthroughs", desc: "Cinematic video tours — single room, full interior, or exterior flyover.", href: "/services#walkthroughs" },
                { icon: "plane", title: "Floor Plans", desc: "Clean architectural floor plan renders for proposals and permits.", href: "/services#floor-plans" },
                { icon: "pyramid", title: "Aerial Views", desc: "Bird's-eye site overviews and drone-perspective renders.", href: "/services#aerial" },
              ].map((s, i) => (
                <div key={s.title} className="scard h-full">
                  <ServiceCard title={s.title} description={s.desc} href={s.href} icon={s.icon as "box" | "cylinder" | "plane" | "pyramid"} index={i} onHover={setHoveredService} />
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 mt-6 relative flex justify-center">
            <div className="w-full max-w-sm h-px bg-secondary/20 relative overflow-hidden">
               <div
                 className="absolute top-0 left-0 h-full bg-secondary transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                 style={{
                   width: '25%',
                   transform: `translateX(${hoveredService !== null ? hoveredService * 100 : 0}%)`,
                   opacity: hoveredService !== null ? 1 : 0.2
                 }}
               />
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 mt-6 flex justify-center">
             <Link href="/services" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35 transition-colors duration-300">
                <div className="w-5 h-[1.5px] bg-secondary/60 group-hover:w-12 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-secondary">Explore All Services</span>
             </Link>
          </div>
        </section>

        <div className="bg-primary">
          <div className="overflow-hidden rounded-[2.5rem]">
            <ModelShowcase />
          </div>
        </div>

        {/* ── PROCESS ─────────────────────────────────────────────────────── */}
        <section ref={processRef as React.RefObject<HTMLElement>} className="py-6 md:py-8 overflow-hidden relative" style={{ background: '#2C1F14' }}>

          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">

            {/* Section heading */}
            <div className="relative text-center mb-8 py-4">
              {/* Selective grid background behind heading */}
              <div className="absolute inset-0 pointer-events-none flex justify-center" aria-hidden="true">
                <div className="w-full max-w-4xl relative">
                  <svg width="100%" height="100%" className="opacity-[0.06]">
                    <defs>
                      <pattern id="proc-grid-heading" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F7F0E3" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#proc-grid-heading)" />
                  </svg>
                  <svg className="absolute top-0 left-0 opacity-20" width="24" height="24" fill="none">
                    <path d="M24 0 L0 0 L0 24" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute top-0 right-0 opacity-20" width="24" height="24" fill="none">
                    <path d="M0 0 L24 0 L24 24" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute bottom-0 left-0 opacity-20" width="24" height="24" fill="none">
                    <path d="M0 0 L0 24 L24 24" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute bottom-0 right-0 opacity-20" width="24" height="24" fill="none">
                    <path d="M24 0 L24 24 L0 24" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="h-px w-10 bg-[#C4A882]/30" />
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-[#C4A882]/70">Our Process</span>
                  <div className="h-px w-10 bg-[#C4A882]/30" />
                </div>
                <h2 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.1] text-[#F7F0E3] tracking-tight max-w-3xl mx-auto">
                  From plans to visuals
                  <span className="text-[#C4A882] italic font-serif"> in days, not weeks.</span>
                </h2>
                <p className="mt-5 font-body text-[14px] text-[#F7F0E3]/40 max-w-md mx-auto">
                  A precision-driven workflow built for speed, quality, and zero guesswork.
                </p>
              </div>
            </div>

            {/* ── Architectural blueprint rail — desktop only ── */}
            <div className="hidden lg:block relative mb-3" aria-hidden="true">
              {/* Horizontal dimension line */}
              <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-px"
                style={{
                  background: 'rgba(247,240,227,0.15)',
                  transformOrigin: 'left center',
                  transform: processActivePhase >= 0 ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 2.1s cubic-bezier(0.16,1,0.3,1) 0.1s',
                }}
              />
              {/* Station dots + vertical drops at each card */}
              <div className="grid grid-cols-4 gap-5 xl:gap-8 h-10">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex flex-col items-center justify-end gap-0">
                    {/* Vertical drop */}
                    <div style={{
                      width: '1px',
                      background: 'rgba(247,240,227,0.2)',
                      height: '14px',
                      transformOrigin: 'bottom center',
                      transform: processActivePhase >= i ? 'scaleY(1)' : 'scaleY(0)',
                      transition: `transform 0.35s ease ${i * 0.7 + 0.45}s`,
                    }} />
                    {/* Station circle */}
                    <div style={{
                      width: '7px', height: '7px',
                      borderRadius: '50%',
                      border: '1.5px solid rgba(196,168,130,0.5)',
                      background: processActivePhase >= i ? 'rgba(196,168,130,0.3)' : 'transparent',
                      opacity: processActivePhase >= i ? 1 : 0,
                      transform: processActivePhase >= i ? 'scale(1)' : 'scale(0.3)',
                      transition: `opacity 0.3s ease ${i * 0.7}s, transform 0.3s ease ${i * 0.7}s, background 0.3s ease ${i * 0.7}s`,
                    }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div id="process-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-8">
              {[
                { n: "01", title: "Send Your Plans", desc: "Share drawings, sketches, or reference photos. Any format accepted." },
                { n: "02", title: "We Model & Render", desc: "Our team builds the 3D scene and produces photorealistic outputs to your specs." },
                { n: "03", title: "Review & Revise", desc: "You review, request changes. We iterate until every detail is exactly right." },
                { n: "04", title: "Final Delivery", desc: "HD files delivered in all formats — ready for proposals, permits, and pitches." },
              ].map((step, i) => (
                <div key={step.n} className="pstep">
                  <ProcessCard phase={step.n} title={step.title} desc={step.desc} index={i} active={i <= processActivePhase} />
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-5 relative py-3 flex justify-center">
              {/* Selective grid background behind CTA */}
              <div className="absolute inset-0 pointer-events-none flex justify-center" aria-hidden="true">
                <div className="w-full max-w-[320px] relative">
                  <svg width="100%" height="100%" className="opacity-[0.06]">
                    <defs>
                      <pattern id="proc-grid-cta" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F7F0E3" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#proc-grid-cta)" />
                  </svg>
                  <svg className="absolute top-0 left-0 opacity-20" width="16" height="16" fill="none">
                    <path d="M16 0 L0 0 L0 16" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute top-0 right-0 opacity-20" width="16" height="16" fill="none">
                    <path d="M0 0 L16 0 L16 16" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute bottom-0 left-0 opacity-20" width="16" height="16" fill="none">
                    <path d="M0 0 L0 16 L16 16" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute bottom-0 right-0 opacity-20" width="16" height="16" fill="none">
                    <path d="M16 0 L16 16 L0 16" stroke="#F7F0E3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <Link href="/consulting" className="group inline-flex items-center gap-4 relative z-10 px-5 py-[10px] rounded-[3px] border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35 transition-colors duration-300">
                <div className="w-5 h-[1.5px] bg-[#C4A882]/40 group-hover:w-12 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/50 group-hover:text-[#F7F0E3] transition-colors duration-300">Start Your Project</span>
              </Link>
            </div>

          </div>
        </section>

        {/* ── FEATURED PROJECT ────────────────────────────────────────────── */}
        {(() => {
          const heroLoop = portfolioAssets.modesto.heroLoop;
          const fallbackRender = portfolioAssets.modesto.renders[0];
          const aspectPct = heroLoop
            ? `${(heroLoop.height / heroLoop.width) * 100}%`
            : `${(fallbackRender.height / fallbackRender.width) * 100}%`;
          return (
            <div className="bg-[#2C1F14] py-2 md:py-3">
            <section className="py-10 md:py-14 px-6 md:px-12 lg:px-16 overflow-hidden rounded-[2.5rem]" style={{ background: '#F7F0E3' }}>
              <div className="max-w-screen-2xl mx-auto">

                {/* High-End Art Studio Typography Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-6 md:mb-10 items-end">
                  <div className="lg:col-span-8 flex flex-col items-start">
                     <div className="flex items-center gap-4 mb-6 md:mb-8">
                       <span data-anim="label" className="font-body text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#3b2516]/60">Featured Project // Modesto, CA</span>
                     </div>
                     <h2 data-anim="heading" className="font-heading text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em] text-[#3b2516]">
                       Chocolate Fish<br/>Coffee Roasters.
                     </h2>
                  </div>
                  <div className="lg:col-span-4 flex flex-col lg:items-end lg:text-right pb-2">
                     <p data-anim="fade" className="font-body text-[13px] md:text-[14px] leading-[1.6] text-[#3b2516]/70 max-w-sm mb-8 lg:mb-10">
                       From pre-construction render to opening-day photograph. We visualized every location in California to absolute perfection.
                     </p>
                     <Link href="/portfolio" data-anim="fade" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-[#3b2516]/10 bg-[#3b2516]/[0.04] hover:bg-[#3b2516]/[0.09] hover:border-[#3b2516]/20 transition-colors duration-300">
                        <span className="font-body font-medium text-[10px] tracking-[0.3em] uppercase text-[#3b2516] transition-colors duration-300">View Full Portfolio</span>
                        <div className="w-6 h-[1px] bg-[#3b2516]/30 group-hover:w-12 group-hover:bg-[#3b2516] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                     </Link>
                  </div>
                </div>

                {/* The Video Highlight (Wow Factor) */}
                <div ref={featuredVideoWrapRef} className="relative group w-full">
                  <Link
                    href="/portfolio/chocolate-fish-modesto"
                    data-anim="fade"
                    className="relative block w-full overflow-hidden bg-[#ECE3CF] cursor-none"
                    style={{ paddingBottom: aspectPct }}
                    aria-label="Watch the Chocolate Fish Modesto case study"
                  >
                    {/* Subtle noise/grain overlay for texture */}
                    <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                    <div className="absolute inset-0 w-full h-full transform transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]">
                      {featuredVideoInView && heroLoop ? (
                        <video
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:opacity-90"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="none"
                          poster={heroLoop.poster}
                          width={heroLoop.width}
                          height={heroLoop.height}
                        >
                          <source src={heroLoop.webm} type="video/webm" />
                          <source src={heroLoop.mp4} type="video/mp4" />
                        </video>
                      ) : heroLoop ? (
                        /* Poster fallback */
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={heroLoop.poster}
                          alt="Chocolate Fish Modesto walkthrough preview"
                          width={heroLoop.width}
                          height={heroLoop.height}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:opacity-90"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <picture className="absolute inset-0 w-full h-full">
                          <source type="image/avif" srcSet={fallbackRender.srcsetAvif} sizes="(max-width: 768px) 100vw, 90vw" />
                          <source type="image/webp" srcSet={fallbackRender.srcsetWebp} sizes="(max-width: 768px) 100vw, 90vw" />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fallbackRender.jpg}
                            srcSet={fallbackRender.srcsetJpg}
                            sizes="(max-width: 768px) 100vw, 90vw"
                            alt={fallbackRender.alt}
                            width={fallbackRender.width}
                            height={fallbackRender.height}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:opacity-90"
                          />
                        </picture>
                      )}
                    </div>
                    
                    {/* Interactive Custom Cursor / Play Button Indicator */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                       <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-background/30 bg-primary/5 backdrop-blur-md flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                         <span className="font-body text-[10px] tracking-[0.25em] uppercase text-background">Play Film</span>
                       </div>
                    </div>
                  </Link>
                </div>
                
                {/* Meta footer below video */}
                <div data-anim="fade" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 md:mt-8 border-t border-primary/10 pt-4">
                  <div className="flex gap-8">
                    <p className="font-body text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-primary/50">
                      Flagship Case Study
                    </p>
                    <p className="font-body text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-primary/50 hidden sm:block">
                      Render to Reality™
                    </p>
                  </div>
                  <Link
                    href="/portfolio/chocolate-fish-modesto"
                    className="font-body text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-primary hover:text-secondary transition-colors duration-300"
                  >
                    Explore Details <span className="ml-1 text-secondary">✦</span>
                  </Link>
                </div>

              </div>
            </section>
            </div>
          );
        })()}


        {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
        <CTASection />

      </main>
    </>
  );
}
