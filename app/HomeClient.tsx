"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/use-in-view";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessCard } from "@/components/ProcessCard";
import DebugPanel from "@/components/DebugPanel";
import { portfolioAssets } from "@/app/portfolio/assets";
import CTASection from "@/components/CTASection";

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
  const [processActivePhase, setProcessActivePhase] = useState(-1);
  const processRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const { ref: featuredVideoWrapRef, inView: featuredVideoInView } = useInView('200px');

  const hero3dReady = useDeferredMount(1200);

  /* ── GSAP: navbar fires immediately; scroll animations deferred to idle ── */
  useEffect(() => {
    let cancelled = false;

    // Navbar entrance: load gsap core only, fires before user can scroll
    (async () => {
      const gsapMod = (await import("gsap")).default;
      if (cancelled) return;
      gsapMod.from("nav", { y: -64, opacity: 0, duration: 0.8, ease: "expo.out" });
    })();

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

      // ── Full-motion variant ──────────────────────────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Array<() => void> = [];

        // [data-hero-front] reveal is handled by CSS animation in globals.css

        gsapMod.fromTo(
            "#scroll-indicator",
            { opacity: 0 },
            { opacity: 0.35, duration: 1.0, ease: "power2.out", delay: 0.8 }
          );

          // ── 3. Hero scroll indicator fade only — text stays put and ───────
          //    scrolls naturally with the section (no scrubbed opacity). ──────
          const heroSection = document.querySelector<HTMLElement>(
            "section.relative.w-full.h-screen"
          );
          if (heroSection) {
            gsapMod.to("#scroll-indicator", {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            });
          }

          // ── 4. Services section ────────────────────────────────────────────
          const servicesSection = document.getElementById("services-section");
          if (servicesSection) {
            const sHeading = servicesSection.querySelector(".heading-wrapper");
            const sCards = servicesSection.querySelectorAll("#service-grid .scard");
            const sLink = servicesSection.querySelector("a[href='/services']");

            if (sHeading) {
              gsapMod.from(sHeading, {
                clipPath: "inset(100% 0 0 0)", y: 24, opacity: 0,
                duration: 1.0, ease: "expo.out",
                scrollTrigger: {
                  trigger: servicesSection,
                  start: "top 80%",
                  toggleActions: "play none none none",
                  refreshPriority: 8,
                },
              });
            }
            if (sCards.length) {
              gsapMod.from(sCards, {
                y: 52, opacity: 0, duration: 0.85, ease: "expo.out", stagger: 0.1,
                scrollTrigger: {
                  trigger: servicesSection,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              });
            }
            if (sLink) {
              gsapMod.from(sLink, {
                y: 16, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.5,
                scrollTrigger: {
                  trigger: servicesSection,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              });
            }
          }

          // ── 5. Model Showcase pin ──────────────────────────────────────────
          const pin = document.querySelector<HTMLElement>(".showcase-pin");
          if (pin) {
            const imgs   = gsapMod.utils.toArray<HTMLElement>(".showcase-img");
            const ghosts = gsapMod.utils.toArray<HTMLElement>(".showcase-img-ghost");
            const mist   = document.getElementById("showcase-mist");
            const caps   = gsapMod.utils.toArray<HTMLElement>(".showcase-cap");
            const ticks  = [0, 1, 2].map(i => document.getElementById(`showcase-tick-${i}`));

            // ── Initial state at progress 0 ───────────────────────────────────
            // Slide 0 fully visible; slides 1 & 2 in their pre-entry "off-screen" state
            gsapMod.set(".showcase-slide", { perspective: 1200 });

            gsapMod.set(imgs[0], { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1 });
            gsapMod.set(caps[0], { x: 0, opacity: 1 });

            if (imgs[1]) gsapMod.set(imgs[1], { xPercent: -120, yPercent: -40, rotation: 14, scale: 0.62, opacity: 0 });
            if (caps[1]) gsapMod.set(caps[1], { x: -30, opacity: 0, pointerEvents: 'none' });
            if (imgs[2]) gsapMod.set(imgs[2], { xPercent: -120, yPercent: -40, rotation: 14, scale: 0.62, opacity: 0 });
            if (caps[2]) gsapMod.set(caps[2], { x: -30, opacity: 0, pointerEvents: 'none' });

            // Ghosts hidden by default — only used as trailing motion blur during transitions
            gsapMod.set(ghosts, { opacity: 0, visibility: "hidden" });

            if (mist) gsapMod.set(mist, { opacity: 0 });

            // Ticks
            ticks.forEach((tk, i) => tk && gsapMod.set(tk, {
              width: i === 0 ? "36px" : "10px",
              opacity: i === 0 ? 0.65 : 0.18,
            }));

            // ── Master scrub timeline ─────────────────────────────────────────
            // Total timeline length = 2 (one unit per transition).
            // Scroll progress 0–0.5 plays positions 0–1 (transition 0→1).
            // Scroll progress 0.5–1.0 plays positions 1–2 (transition 1→2).
            const masterTl = gsapMod.timeline({
              defaults: { ease: "power2.inOut" },
              scrollTrigger: {
                trigger: ".showcase-pin",
                start: "top top",
                end: "+=220%",
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                refreshPriority: 6,
                scrub: 0.6,
                snap: {
                  snapTo: [0, 0.5, 1],
                  duration: { min: 0.2, max: 0.5 },
                  ease: "power2.inOut",
                  delay: 0,
                },
                onUpdate: (self) => {
                  const p = self.progress;
                  const activeIdx = p < 0.25 ? 0 : p < 0.75 ? 1 : 2;
                  caps.forEach((cap, i) => {
                    (cap as HTMLElement).style.pointerEvents = i === activeIdx ? 'auto' : 'none';
                  });
                },
              },
            });

            // ── Helper: build one transition (out current → in next) on master tl ──
            const addTransition = (outIdx: number, inIdx: number, startAt: number) => {
              // Spin out current
              masterTl.to(imgs[outIdx], {
                xPercent: 120, yPercent: 40, rotation: -14, scale: 0.62, opacity: 0,
                ease: "power2.in", duration: 0.55,
              }, startAt);
              masterTl.to(caps[outIdx], {
                x: 30, opacity: 0, ease: "power2.in", duration: 0.4,
              }, startAt);

              // Ghost trail — appears mid-out, fades during in
              if (ghosts[outIdx]) {
                masterTl.to(ghosts[outIdx], {
                  visibility: "visible", opacity: 0.55, duration: 0.05,
                }, startAt + 0.05);
                masterTl.to(ghosts[outIdx], {
                  xPercent: 120, yPercent: 40, rotation: -14, scale: 0.62,
                  ease: "power2.in", duration: 0.55,
                }, startAt + 0.05);
                masterTl.to(ghosts[outIdx], {
                  opacity: 0, duration: 0.3, ease: "power2.in",
                  onComplete: () => gsapMod.set(ghosts[outIdx], {
                    visibility: "hidden", xPercent: 0, yPercent: 0, rotation: 0, scale: 1,
                  }),
                }, startAt + 0.45);
              }

              // Mist peaks mid-transition
              if (mist) {
                masterTl.to(mist, { opacity: 0.6, duration: 0.3, ease: "power2.out" }, startAt);
                masterTl.to(mist, { opacity: 0, duration: 0.4, ease: "power2.in" }, startAt + 0.5);
              }

              // Spin in next (slightly overlapping the out)
              masterTl.to(imgs[inIdx], {
                xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1,
                ease: "power3.out", duration: 0.6,
              }, startAt + 0.4);
              masterTl.to(caps[inIdx], {
                x: 0, opacity: 1, ease: "power2.out", duration: 0.45,
              }, startAt + 0.5);

              // Ticks: deactivate outIdx, activate inIdx, midway
              if (ticks[outIdx]) masterTl.to(ticks[outIdx], {
                width: "10px", opacity: 0.18, duration: 0.35, ease: "power2.inOut",
              }, startAt + 0.3);
              if (ticks[inIdx]) masterTl.to(ticks[inIdx], {
                width: "36px", opacity: 0.65, duration: 0.35, ease: "power2.inOut",
              }, startAt + 0.3);
            };

            // Transition 1: slide 0 → slide 1, at timeline positions 0 → 1
            if (imgs[1]) addTransition(0, 1, 0);
            // Transition 2: slide 1 → slide 2, at timeline positions 1 → 2
            if (imgs[2]) addTransition(1, 2, 1);

            // ── 3D mouse-tilt — operates on rotationX/rotationY only ──────────
            // Does NOT conflict with the timeline's rotation/xPercent/yPercent/scale
            const handleMouseMove = (e: MouseEvent) => {
              const rect = pin.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              gsapMod.to([imgs, ghosts], {
                rotationY: x * 14,
                rotationX: -y * 14,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto",
              });
            };
            const handleMouseLeave = () => {
              gsapMod.to([imgs, ghosts], {
                rotationY: 0, rotationX: 0,
                duration: 1.0, ease: "power3.out",
                overwrite: "auto",
              });
            };
            pin.addEventListener("mousemove", handleMouseMove as EventListener);
            pin.addEventListener("mouseleave", handleMouseLeave);

            // ── Arrow / tick navigation ───────────────────────────────────────
            const getActiveSlide = (): number => {
              const st = masterTl.scrollTrigger;
              if (!st) return 0;
              const p = st.progress;
              if (p < 0.25) return 0;
              if (p < 0.75) return 1;
              return 2;
            };

            const goToSlide = (n: number) => {
              const st = masterTl.scrollTrigger;
              if (!st) return;
              
              // Map 0, 1, 2 to the exact scroll positions
              // 0 -> st.start
              // 1 -> st.start + (st.end - st.start) * 0.5
              // 2 -> st.end
              const progress = n * 0.5;
              const targetY = st.start + (st.end - st.start) * progress;
              
              gsapMod.to(window, {
                scrollTo: targetY,
                duration: 0.8,
                ease: "power2.inOut",
                overwrite: "auto"
              });
            };

            const prevBtn  = document.getElementById("showcase-prev");
            const nextBtn  = document.getElementById("showcase-next");
            const tickBtns = Array.from(document.querySelectorAll<HTMLButtonElement>(".showcase-tick-btn"));

            const handlePrev  = (e?: Event) => { e?.preventDefault(); const c = getActiveSlide(); if (c > 0) goToSlide(c - 1); };
            const handleNext  = (e?: Event) => { e?.preventDefault(); const c = getActiveSlide(); if (c < 2) goToSlide(c + 1); };
            const handleKeyDown = (e: KeyboardEvent) => {
              const st = masterTl.scrollTrigger;
              if (st && st.isActive) {
                if (e.key === "ArrowLeft") handlePrev();
                if (e.key === "ArrowRight") handleNext();
              }
            };

            prevBtn?.addEventListener("click", handlePrev);
            nextBtn?.addEventListener("click", handleNext);
            window.addEventListener("keydown", handleKeyDown);
            tickBtns.forEach((btn, i) => {
              const handler = (e: Event) => { e.preventDefault(); goToSlide(i); };
              btn.addEventListener("click", handler);
              cleanups.push(() => btn.removeEventListener("click", handler));
            });

            cleanups.push(() => {
              pin.removeEventListener("mousemove", handleMouseMove as EventListener);
              pin.removeEventListener("mouseleave", handleMouseLeave);
              prevBtn?.removeEventListener("click", handlePrev);
              nextBtn?.removeEventListener("click", handleNext);
              window.removeEventListener("keydown", handleKeyDown);
            });
          } // end showcase-pin

          // ── 6. Process section — drives processActivePhase state ───────────
          const procEl = processRef.current;
          if (procEl) {
            ScrollTrigger.create({
              trigger: procEl,
              start: "top 70%",
              end: "+=400",
              once: true,
              refreshPriority: 4,
              onEnter: () => {
                // Staggered state bumps replace the old IntersectionObserver chain
                [0, 1, 2, 3].forEach(i =>
                  gsapMod.delayedCall(i * 0.7, () => setProcessActivePhase(i))
                );
              },
            });
          }

          // ── 7. Portfolio grid ──────────────────────────────────────────────
          gsapMod.from("#portfolio-grid .pitem", {
            y: 28, opacity: 0, scale: 0.97, duration: 0.7, ease: "power2.out",
            stagger: { each: 0.07, from: "random" as gsap.utils.DistributeConfig["from"] },
            scrollTrigger: {
              trigger: "#portfolio-grid",
              start: "top 84%",
              toggleActions: "play none none none",
              refreshPriority: 2,
            },
          });

          // ── 8. Final CTA — handled by CTASection's own IntersectionObserver ──

          // ── 9. Generic [data-anim] reveals (portfolio heading area etc.) ───
          // Exclude cta (handled above) and anything inside the showcase pin.
          const showcasePinEl = document.querySelector(".showcase-pin");
          document.querySelectorAll("[data-anim]").forEach(el => {
            const a = (el as HTMLElement).dataset.anim;
            if (!a || a === "cta") return;
            // Skip elements nested inside the showcase pin
            if (showcasePinEl && showcasePinEl.contains(el)) return;

            if (a === "heading") {
              gsapMod.from(el, {
                clipPath: "inset(100% 0 0 0)", y: 20, opacity: 0,
                duration: 0.85, ease: "expo.out",
                scrollTrigger: {
                  trigger: el, start: "top 88%",
                  toggleActions: "play none none none",
                },
              });
            } else if (a === "label") {
              gsapMod.from(el, {
                opacity: 0, x: -14, duration: 0.65, ease: "power3.out",
                scrollTrigger: {
                  trigger: el, start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            } else if (a === "fade") {
              gsapMod.from(el, {
                opacity: 0, y: 18, duration: 0.75, ease: "power2.out",
                scrollTrigger: {
                  trigger: el, start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            } else if (a === "line") {
              gsapMod.from(el, {
                scaleX: 0, transformOrigin: "left center",
                duration: 0.8, ease: "expo.out",
                scrollTrigger: {
                  trigger: el, start: "top 92%",
                  toggleActions: "play none none none",
                },
              });
            }
          });

        }); // end prefers-reduced-motion: no-preference

        // ── Reduced-motion variant ───────────────────────────────────────────
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
          document.querySelectorAll("[data-anim]").forEach(el => {
            const a = (el as HTMLElement).dataset.anim;
            if (!a) return;
            gsapMod.from(el, {
              opacity: 0, duration: 0.5,
              scrollTrigger: { trigger: el, start: "top 90%" },
            });
          });
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
      <DebugPanel />
<main className="relative w-full bg-background" ref={pageRef}>

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <div className="bg-primary">
        <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-background rounded-b-[2.5rem]">

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
