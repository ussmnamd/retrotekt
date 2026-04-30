"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Hero3DPlaceholder } from "@/components/Hero3DPlaceholder";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessCard } from "@/components/ProcessCard";
import PageLoader from "@/components/PageLoader";
import DebugPanel from "@/components/DebugPanel";
import ModelShowcase from "@/components/ModelShowcase";

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => <Hero3DPlaceholder />,
});

export default function HomeClient() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [processActivePhase, setProcessActivePhase] = useState(-1);
  const processRef = useRef<HTMLElement>(null);

  /* ── Sequential process card reveal ── */
  useEffect(() => {
    const el = processRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          [0, 1, 2, 3].forEach(i =>
            setTimeout(() => setProcessActivePhase(i), i * 700)
          );
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);


  /* ── Fire hero entrance GSAP after loader exits ── */
  const onLoaderComplete = useCallback(() => {
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const lockupBack = document.querySelectorAll("[data-hero-back]");
      const lockupFront = document.querySelectorAll("[data-hero-front]");
      const navbar = document.querySelector("nav");
      const si = document.querySelector("#scroll-indicator");

      // Navbar
      if (navbar) {
        gsap.fromTo(navbar,
          { y: -64, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" }
        );
      }

      // Hero lockup stagger
      const staggerConfig = { y: 0, opacity: 1, duration: 1.0, ease: "expo.out", stagger: 0.1, delay: 0.2 };

      if (lockupBack.length) gsap.fromTo(lockupBack, { y: 36, opacity: 0 }, staggerConfig);
      if (lockupFront.length) gsap.fromTo(lockupFront, { y: 36, opacity: 0 }, staggerConfig);

      // Scroll indicator
      if (si) {
        gsap.fromTo(si,
          { opacity: 0, y: 12 },
          { opacity: 0.35, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 }
        );
      }

      // Service cards
      const sg = document.querySelector("#service-grid");
      if (sg) {
        gsap.from(sg.querySelectorAll(".scard"), {
          opacity: 0, y: 52, duration: 0.85, ease: "expo.out", stagger: 0.1,
          scrollTrigger: { trigger: sg, start: "top 82%", toggleActions: "play none none none" },
        });
      }

      // Generic scroll reveals
      document.querySelectorAll("[data-anim]").forEach((el) => {
        const a = (el as HTMLElement).dataset.anim;
        if (!a || a === "cta") return;
        if (a === "heading") {
          gsap.from(el, {
            clipPath: "inset(100% 0% 0% 0%)", y: 20, opacity: 0,
            duration: 0.85, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          });
        } else if (a === "label") {
          gsap.from(el, {
            opacity: 0, x: -14, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          });
        } else if (a === "fade") {
          gsap.from(el, {
            opacity: 0, y: 18, duration: 0.75, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          });
        } else if (a === "line") {
          gsap.from(el, {
            scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          });
        }
      });


      // Process steps — staggered build from phase 1 → 4
      const proc = document.querySelector("#process-grid");
      if (proc) {
        gsap.from(proc.querySelectorAll(".pstep"), {
          opacity: 0, y: 48, duration: 0.9, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: proc, start: "top 82%", toggleActions: "play none none none" },
        });
      }

      // Portfolio grid
      const port = document.querySelector("#portfolio-grid");
      if (port) {
        gsap.from(port.querySelectorAll(".pitem"), {
          opacity: 0, y: 28, scale: 0.97, duration: 0.7, ease: "power2.out",
          stagger: { each: 0.07, from: "random" },
          scrollTrigger: { trigger: port, start: "top 84%", toggleActions: "play none none none" },
        });
      }

      // Final CTA
      const cta = document.querySelector("#final-cta");
      if (cta) {
        gsap.from(cta.querySelectorAll("[data-anim='cta']"), {
          opacity: 0, y: 36, duration: 0.9, ease: "expo.out", stagger: 0.1,
          scrollTrigger: { trigger: cta, start: "top 84%", toggleActions: "play none none none" },
        });
      }

      // ── New Services section entrance ────────────────────────────────────────
      const servicesSection = document.getElementById("services-section");
      if (servicesSection) {
        const sHeading = servicesSection.querySelector(".heading-wrapper");
        const sLink = servicesSection.querySelector("a[href='/services']");

        if (sHeading) {
          gsap.from(sHeading, {
            opacity: 0, y: 30, duration: 1.0, ease: "expo.out",
            scrollTrigger: { trigger: servicesSection, start: "top 80%" }
          });
        }
        if (sLink) {
          gsap.from(sLink, {
            opacity: 0, y: 20, duration: 0.8, delay: 0.4, ease: "power2.out",
            scrollTrigger: { trigger: servicesSection, start: "top 75%" }
          });
        }
      }


      // ── MODEL SHOWCASE — pinned reel with plate-spin transitions ──────────
      const pin = document.querySelector(".showcase-pin");
      if (pin) {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          const imgs   = gsap.utils.toArray<HTMLElement>(".showcase-img");
          const ghosts = gsap.utils.toArray<HTMLElement>(".showcase-img-ghost");
          const mist   = document.getElementById("showcase-mist") as HTMLElement | null;
          const caps   = gsap.utils.toArray<HTMLElement>(".showcase-cap");
          const ticks  = [0, 1, 2].map(i => document.getElementById(`showcase-tick-${i}`));

          // Initialize first slide as visible
          gsap.set(imgs, { opacity: 0 });
          gsap.set(ghosts, { opacity: 0, scale: 1, visibility: "hidden" });
          gsap.set(caps, { opacity: 0 });
          if (mist) gsap.set(mist, { opacity: 0 });
          
          gsap.set(imgs[0], { opacity: 1 });
          gsap.set(caps[0], { opacity: 1 });

          // Ticks: set first active
          ticks.forEach((tk, i) => tk && gsap.set(tk, { width: i === 0 ? "36px" : "10px", opacity: i === 0 ? 0.65 : 0.18 }));

          let current = 0;
          let busy = false;

          // ── 3D Hover Effect ───────────────────────────────────────────────────
          const handleMouseMove = (e: MouseEvent) => {
            if (busy) return; // Don't interfere during spin transitions
            const rect = pin.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            // Add perspective to the parent to make the 3D rotation visible
            gsap.set(".showcase-slide", { perspective: 1200 });

            gsap.to([imgs, ghosts], {
              rotationY: x * 20, // max 10 deg left/right
              rotationX: -y * 20, // max 10 deg up/down
              duration: 0.6,
              ease: "power2.out"
            });
          };

          const handleMouseLeave = () => {
            gsap.to([imgs, ghosts], {
              rotationY: 0,
              rotationX: 0,
              duration: 0.8,
              ease: "power3.out"
            });
          };

          pin.addEventListener("mousemove", handleMouseMove as EventListener);
          pin.addEventListener("mouseleave", handleMouseLeave);

          const spinOut = (tl: gsap.core.Timeline, idx: number, at = 0) => {
            // Ghost starts aligned with the colour model and follows its exact trajectory
            gsap.set(ghosts[idx], {
              visibility: "visible",
              opacity: 0.78,
              xPercent: 0, yPercent: 0, rotation: 0, scale: 1,
            });
            tl.to(imgs[idx], {
              xPercent: 120, yPercent: 40, rotation: -14, scale: 0.62, opacity: 0,
              duration: 0.85, ease: "power2.in",
            }, at)
            .to(caps[idx], { opacity: 0, x: 30, duration: 0.4, ease: "power2.in" }, at)
            // Ghost rides along with the model, fading out as it exits
            .to(ghosts[idx], {
              xPercent: 120, yPercent: 40, rotation: -14, scale: 0.62, opacity: 0,
              duration: 0.85, ease: "power2.in",
              onComplete: () => gsap.set(ghosts[idx], {
                visibility: "hidden",
                xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 0,
              }),
            }, at);
            if (mist) tl.to(mist, { opacity: 0.6, duration: 0.4, ease: "power2.out" }, at);
          };

          const spinIn = (tl: gsap.core.Timeline, idx: number, at = 0) => {
            gsap.set(imgs[idx], { xPercent: -120, yPercent: -40, rotation: 14, scale: 0.62, opacity: 0 });
            gsap.set(caps[idx], { opacity: 0, x: -30 });
            tl.to(imgs[idx], {
              xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1,
              duration: 1.0, ease: "power3.out",
            }, at)
            .to(caps[idx], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, at + 0.25);
            // Clear mist as the new model arrives
            if (mist) tl.to(mist, { opacity: 0, duration: 0.4, ease: "power2.in" }, at);
          };

          const swap = (next: number) => {
            if (next === current || busy) return;
            busy = true;
            const tl = gsap.timeline({
              onComplete: () => { busy = false; },
            });

            if (current >= 0) spinOut(tl, current, 0);
            if (next >= 0)    spinIn(tl, next, current >= 0 ? 0.45 : 0.1);

            ticks.forEach((tk, i) => tk && tl.to(tk, {
              width: i === next ? "36px" : "10px",
              opacity: i === next ? 0.65 : 0.18,
              duration: 0.4, ease: "power2.inOut",
            }, 0.3));

            current = next;
          };

          // 3 snap points: model-01, model-02, model-03
          const totalSnaps = imgs.length;
          const st = ScrollTrigger.create({
            trigger: ".showcase-pin",
            start: "top top", end: "+=300%",
            pin: true, anticipatePin: 1,
            snap: {
              snapTo: (v) => Math.round(v * (totalSnaps - 1)) / (totalSnaps - 1),
              duration: { min: 0.15, max: 0.35 }, ease: "power1.inOut",
            },
            onUpdate: (self) => {
              if (busy) return;
              const idx = Math.round(self.progress * (totalSnaps - 1)); // 0, 1, 2
              if (idx !== current) swap(idx);
            },
          });

          // Refresh after color images decode
          let n = 0;
          const colorImgs = Array.from(document.querySelectorAll<HTMLImageElement>(".showcase-img"));
          colorImgs.forEach(img => {
            const done = () => { if (++n >= colorImgs.length) ScrollTrigger.refresh(); };
            if (img.complete) { done(); } else { img.addEventListener("load", done); }
          });

          return () => {
            st.kill();
            pin.removeEventListener("mousemove", handleMouseMove as EventListener);
            pin.removeEventListener("mouseleave", handleMouseLeave);
          };
        });

        mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
          gsap.utils.toArray<HTMLElement>(".showcase-slide").forEach((el, i) => {
            gsap.set(el, { position: "relative", opacity: 1 });
            if (i > 0) gsap.from(el, {
              opacity: 0, y: 40, duration: 0.7,
              scrollTrigger: { trigger: el, start: "top 80%" },
            });
          });
        });
      }

})();
  }, []);

  return (
    <>
      <DebugPanel />
      {/* Page loader — unmounts itself after animation */}
      <PageLoader onComplete={onLoaderComplete} />

      <main className="relative w-full bg-background" ref={pageRef}>
        <link rel="preload" href="/models/updatedmodel.draco.glb" as="fetch" crossOrigin="anonymous" />

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative w-full h-screen min-h-[700px] overflow-hidden">

          {/* 1. BACK LAYER (Solid Text, Z-0) */}
          <div className="absolute inset-0 z-0 w-full pointer-events-none">
            
            {/* QUESTION - Right Side */}
            <div className="absolute top-[45%] md:top-[50%] right-6 md:right-12 lg:right-16 flex flex-col items-start max-w-[85vw] md:max-w-sm lg:max-w-md z-0">
              <h2 data-hero-back className="font-heading text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] text-primary tracking-[-0.01em] mb-8">
                They&apos;re already showing the finished space.
                <span className="text-secondary italic font-light mt-2 block">Why aren&apos;t you?</span>
              </h2>
            </div>
            
          </div>

          {/* 2. 3D MODEL (Z-10) */}
          <div id="hero-section" className="absolute inset-0 z-10 pointer-events-auto">
            <Hero3D />
          </div>

          {/* Organic cream wave at bottom of hero (Z-20) */}
          <svg
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none w-full"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ height: "clamp(80px, 15vw, 160px)" }}
          >
            <path d="M0,40 C360,180 1080,180 1440,40 L1440,200 L0,200 Z" fill="#F7F0E3" />
          </svg>

          {/* 3. FRONT LAYER (Outline Text & Interactive Button & Solid Logo, Z-30) */}
          <div className="absolute inset-0 z-30 w-full pointer-events-none" aria-hidden="true">
            
            {/* QUESTION & CTA - Right Side (Outlined) */}
            <div className="absolute top-[45%] md:top-[50%] right-6 md:right-12 lg:right-16 flex flex-col items-start max-w-[85vw] md:max-w-sm lg:max-w-md z-30">
              <h2 data-hero-front className="font-heading text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.01em] mb-8">
                <span className="text-transparent [-webkit-text-stroke:0.5px_rgba(44,31,20,0.25)]">They&apos;re already showing </span><span className="text-transparent [-webkit-text-stroke:1.5px_rgba(44,31,20,0.7)]">the finished space.</span>
                <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-accent)] italic font-light mt-2 block">Why aren&apos;t you?</span>
              </h2>
              
              {/* INTERACTIVE MINIMAL BUTTON */}
              <div data-hero-front className="pointer-events-auto mt-6">
                 <Link href="/contact" className="group flex items-center gap-4">
                    <div className="w-8 h-[1.5px] bg-primary/60 group-hover:w-24 group-hover:bg-primary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                    <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary group-hover:text-primary transition-colors duration-300">Start Project</span>
                 </Link>
              </div>
            </div>

            {/* LOGO - Bottom Left (Solid) */}
            <div className="absolute bottom-20 md:bottom-28 left-6 md:left-12 lg:left-16 flex flex-col items-start pointer-events-auto">
              <div data-hero-front>
                <p className="font-heading font-light text-[clamp(3.5rem,8vw,7rem)] text-primary tracking-[-0.03em] leading-[0.85] mb-4">
                  retrotekt<span className="text-secondary">.</span>
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="font-body font-medium text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary/90">
                    3D Architectural Visualization Studio
                  </h1>
                  <span className="hidden sm:block text-secondary opacity-50">|</span>
                  <span className="font-body font-medium text-[9px] tracking-[0.2em] uppercase text-secondary">The New Standard</span>
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

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        <section id="services-section" className="bg-primary pt-28 pb-32 overflow-hidden relative">
          
          <div className="heading-wrapper max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 mb-20 relative flex flex-col items-center text-center">
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
          
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 mt-12 relative flex justify-center">
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

          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 mt-12 flex justify-center">
             <Link href="/services" className="group flex items-center gap-4">
                <div className="w-8 h-[1.5px] bg-secondary/60 group-hover:w-24 group-hover:bg-secondary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-secondary">Explore All Services</span>
             </Link>
          </div>
        </section>

        <ModelShowcase />

        {/* ── PROCESS ─────────────────────────────────────────────────────── */}
        <section ref={processRef as React.RefObject<HTMLElement>} className="py-28 md:py-36 overflow-hidden relative" style={{ background: '#ECE3CF' }}>

          {/* Blueprint grid — very faint on cream */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" className="opacity-[0.035]">
              <defs>
                <pattern id="proc-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2C1F14" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#proc-grid)" />
            </svg>
            {/* Corner L-brackets in dark ink */}
            <svg className="absolute top-8 left-8 opacity-15" width="44" height="44" fill="none">
              <path d="M44 0 L0 0 L0 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute top-8 right-8 opacity-15" width="44" height="44" fill="none">
              <path d="M0 0 L44 0 L44 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-8 left-8 opacity-15" width="44" height="44" fill="none">
              <path d="M0 0 L0 44 L44 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-8 right-8 opacity-15" width="44" height="44" fill="none">
              <path d="M44 0 L44 44 L0 44" stroke="#2C1F14" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">

            {/* Section heading */}
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-10 bg-primary/30" />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-[#8C6E4B]">Our Process</span>
                <div className="h-px w-10 bg-primary/30" />
              </div>
              <h2 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.1] text-primary tracking-tight max-w-3xl mx-auto">
                From plans to visuals
                <span className="text-[#8C6E4B] italic font-serif"> in days, not weeks.</span>
              </h2>
              <p className="mt-5 font-body text-[14px] text-primary/45 max-w-md mx-auto">
                A precision-driven workflow built for speed, quality, and zero guesswork.
              </p>
            </div>

            {/* ── Architectural blueprint rail — desktop only ── */}
            <div className="hidden lg:block relative mb-3" aria-hidden="true">
              {/* Horizontal dimension line */}
              <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-px"
                style={{
                  background: 'rgba(44,31,20,0.18)',
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
                      background: 'rgba(44,31,20,0.2)',
                      height: processActivePhase >= i ? '14px' : '0px',
                      transition: `height 0.35s ease ${i * 0.7 + 0.45}s`,
                    }} />
                    {/* Station circle */}
                    <div style={{
                      width: '7px', height: '7px',
                      borderRadius: '50%',
                      border: '1.5px solid rgba(44,31,20,0.4)',
                      background: processActivePhase >= i ? 'rgba(44,31,20,0.2)' : 'transparent',
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
            <div className="mt-14 flex justify-center">
              <Link href="/contact" className="group flex items-center gap-4">
                <div className="w-8 h-[1.5px] bg-primary/40 group-hover:w-24 group-hover:bg-primary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary/60 group-hover:text-primary transition-colors duration-300">Start Your Project</span>
              </Link>
            </div>

          </div>
        </section>

        {/* ── PORTFOLIO ───────────────────────────────────────────────────── */}
        <section className="py-28 md:py-36 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span data-anim="label" className="section-label">Portfolio</span>
                  <div data-anim="line" className="h-px bg-[#D4C5A9] w-20 flex-shrink-0" />
                </div>
                <h2 data-anim="heading" className="font-heading text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] tracking-[-0.025em] text-primary">
                  Work that<br />speaks for itself.
                </h2>
              </div>
              <Link href="/portfolio" data-anim="fade" className="self-start sm:self-auto font-body text-[11px] tracking-[0.14em] uppercase text-primary/40 border-b border-primary/15 pb-0.5 hover:text-primary hover:border-primary/40 transition-colors duration-200 whitespace-nowrap">
                Full Portfolio →
              </Link>
            </div>
            <div id="portfolio-grid" className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Modern Kitchen", tag: "Interior", h: "aspect-[4/5]", bg: "bg-primary/8" },
                { label: "Exterior Facade", tag: "Exterior", h: "aspect-square", bg: "bg-secondary/15" },
                { label: "Open Living", tag: "Interior", h: "aspect-square", bg: "bg-primary/5" },
                { label: "Master Bath", tag: "Interior", h: "aspect-[4/5]", bg: "bg-secondary/10" },
                { label: "Site Aerial", tag: "Aerial", h: "aspect-square", bg: "bg-primary/10" },
                { label: "Full Home Build", tag: "Full Project", h: "aspect-square", bg: "bg-primary/6" },
              ].map((item, i) => (
                <Link key={i} href="/portfolio" className={`pitem ${item.h} ${item.bg} relative group overflow-hidden block`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <p className="font-body text-[9px] tracking-[0.25em] uppercase text-primary/20 mb-1">{item.tag}</p>
                      <p className="font-heading text-[13px] text-primary/30">{item.label}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.06] transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-primary/10 to-transparent">
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/60">{item.tag}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
        <section id="final-cta" className="py-28 md:py-36 px-6 md:px-16 lg:px-24 bg-primary overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <div data-anim="cta" className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-background/20 w-16 flex-shrink-0" />
              <span className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/70 whitespace-nowrap">Ready to Start?</span>
              <div className="h-px bg-background/20 w-16 flex-shrink-0" />
            </div>
            <h2 data-anim="cta" className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.025em] text-background mb-7">
              Turn your ideas into<br />visuals that sell.
            </h2>
            <p data-anim="cta" className="font-body text-[15px] text-background/45 max-w-sm mx-auto mb-12">
              Custom quote within 24 hours. No commitment required.
            </p>
            <div data-anim="cta" className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-gold px-10 py-4 bg-secondary text-primary font-body text-[12px] tracking-[0.14em] uppercase">Get a Quote</Link>
              <Link href="/contact" className="btn-outline-light px-10 py-4 border border-background/20 text-background/65 font-body text-[12px] tracking-[0.14em] uppercase">Book a Call</Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
