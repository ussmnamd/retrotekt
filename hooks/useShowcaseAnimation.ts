// Model showcase scroll animation: pinned section with scrubbed slide transitions,
// mouse-tilt 3D effect, and arrow/tick navigation.
// Called from HomeClient's main GSAP useEffect, inside the full-motion mm.add block.
// Returns a cleanup function to remove event listeners registered here.

import { ANIMATION_TIMINGS, ANIMATION_EASING } from "@/lib/animation-config";

type Gsap = typeof import("gsap").default;
type ScrollTrigger = typeof import("gsap/ScrollTrigger").ScrollTrigger;

export function setupShowcaseAnimation(
  gsap: Gsap,
  ScrollTrigger: ScrollTrigger
): (() => void) | undefined {
  const pin = document.querySelector<HTMLElement>(".showcase-pin");
  if (!pin) return;

  const imgs   = gsap.utils.toArray<HTMLElement>(".showcase-img");
  const ghosts = gsap.utils.toArray<HTMLElement>(".showcase-img-ghost");
  const mist   = document.getElementById("showcase-mist");
  const caps   = gsap.utils.toArray<HTMLElement>(".showcase-cap");
  const ticks  = [0, 1, 2].map(i => document.getElementById(`showcase-tick-${i}`));

  // ── Initial state at progress 0 ─────────────────────────────────────────────
  // Slide 0 fully visible; slides 1 & 2 in their pre-entry "off-screen" state
  gsap.set(".showcase-slide", { perspective: 1200 });

  gsap.set(imgs[0], { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1 });
  gsap.set(caps[0], { x: 0, opacity: 1 });

  if (imgs[1]) gsap.set(imgs[1], { xPercent: -120, yPercent: -40, rotation: 14, scale: 0.62, opacity: 0 });
  if (caps[1]) gsap.set(caps[1], { x: -30, opacity: 0, pointerEvents: "none" });
  if (imgs[2]) gsap.set(imgs[2], { xPercent: -120, yPercent: -40, rotation: 14, scale: 0.62, opacity: 0 });
  if (caps[2]) gsap.set(caps[2], { x: -30, opacity: 0, pointerEvents: "none" });

  // Ghosts hidden by default — only used as trailing motion blur during transitions
  gsap.set(ghosts, { opacity: 0, visibility: "hidden" });

  if (mist) gsap.set(mist, { opacity: 0 });

  // Ticks — use scaleX (GPU composited) instead of width (layout)
  ticks.forEach((tk, i) => tk && gsap.set(tk, {
    scaleX: i === 0 ? 1 : 0.278,
    transformOrigin: "left center",
    opacity: i === 0 ? 0.65 : 0.18,
  }));

  // ── Master scrub timeline ────────────────────────────────────────────────────
  // Total timeline length = 2 (one unit per transition).
  // Scroll progress 0–0.5 plays positions 0–1 (transition 0→1).
  // Scroll progress 0.5–1.0 plays positions 1–2 (transition 1→2).
  const masterTl = gsap.timeline({
    defaults: { ease: ANIMATION_EASING.showcaseSnap },
    scrollTrigger: {
      trigger: ".showcase-pin",
      start: "top top",
      end: "+=220%",
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 6,
      scrub: ANIMATION_TIMINGS.showcaseScrub,
      snap: {
        snapTo: [0, 0.5, 1],
        duration: { min: 0.2, max: 0.5 },
        ease: ANIMATION_EASING.showcaseSnap,
        delay: 0,
      },
      onUpdate: (self) => {
        const p = self.progress;
        const activeIdx = p < 0.25 ? 0 : p < 0.75 ? 1 : 2;
        caps.forEach((cap, i) => {
          (cap as HTMLElement).style.pointerEvents = i === activeIdx ? "auto" : "none";
        });
      },
    },
  });

  // ── Helper: build one transition (out current → in next) on master tl ────────
  const addTransition = (outIdx: number, inIdx: number, startAt: number) => {
    // Spin out current
    masterTl.to(imgs[outIdx], {
      xPercent: 120, yPercent: 40, rotation: -14, scale: 0.62, opacity: 0,
      ease: "power2.in", duration: ANIMATION_TIMINGS.showcaseSpinOut,
    }, startAt);
    masterTl.to(caps[outIdx], {
      x: 30, opacity: 0, ease: "power2.in", duration: ANIMATION_TIMINGS.showcaseCapsOut,
    }, startAt);

    // Ghost trail — appears mid-out, fades during in
    if (ghosts[outIdx]) {
      masterTl.to(ghosts[outIdx], {
        visibility: "visible", opacity: 0.55, duration: 0.05,
      }, startAt + 0.05);
      masterTl.to(ghosts[outIdx], {
        xPercent: 120, yPercent: 40, rotation: -14, scale: 0.62,
        ease: "power2.in", duration: ANIMATION_TIMINGS.showcaseSpinOut,
      }, startAt + 0.05);
      masterTl.to(ghosts[outIdx], {
        opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => gsap.set(ghosts[outIdx], {
          visibility: "hidden", xPercent: 0, yPercent: 0, rotation: 0, scale: 1,
        }),
      }, startAt + 0.45);
    }

    // Mist peaks mid-transition
    if (mist) {
      masterTl.to(mist, { opacity: 0.6, duration: ANIMATION_TIMINGS.showcaseMistIn, ease: "power2.out" }, startAt);
      masterTl.to(mist, { opacity: 0, duration: ANIMATION_TIMINGS.showcaseMistOut, ease: "power2.in" }, startAt + 0.5);
    }

    // Spin in next (slightly overlapping the out)
    masterTl.to(imgs[inIdx], {
      xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1,
      ease: "power3.out", duration: ANIMATION_TIMINGS.showcaseSpinIn,
    }, startAt + 0.4);
    masterTl.to(caps[inIdx], {
      x: 0, opacity: 1, ease: "power2.out", duration: ANIMATION_TIMINGS.showcaseCapsIn,
    }, startAt + 0.5);

    // Ticks: deactivate outIdx, activate inIdx, midway
    if (ticks[outIdx]) masterTl.to(ticks[outIdx], {
      scaleX: 0.278, opacity: 0.18, duration: ANIMATION_TIMINGS.showcaseTick, ease: ANIMATION_EASING.showcaseSnap,
    }, startAt + 0.3);
    if (ticks[inIdx]) masterTl.to(ticks[inIdx], {
      scaleX: 1, opacity: 0.65, duration: ANIMATION_TIMINGS.showcaseTick, ease: ANIMATION_EASING.showcaseSnap,
    }, startAt + 0.3);
  };

  // Transition 1: slide 0 → slide 1, at timeline positions 0 → 1
  if (imgs[1]) addTransition(0, 1, 0);
  // Transition 2: slide 1 → slide 2, at timeline positions 1 → 2
  if (imgs[2]) addTransition(1, 2, 1);

  // ── 3D mouse-tilt — operates on rotationX/rotationY only ───────────────────
  // Does NOT conflict with the timeline's rotation/xPercent/yPercent/scale
  let pinRect = pin.getBoundingClientRect();
  const updatePinRect = () => { pinRect = pin.getBoundingClientRect(); };
  ScrollTrigger.addEventListener("refresh", updatePinRect);

  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX - pinRect.left) / pinRect.width - 0.5;
    const y = (e.clientY - pinRect.top) / pinRect.height - 0.5;
    gsap.to([imgs, ghosts], {
      rotationY: x * 14,
      rotationX: -y * 14,
      duration: ANIMATION_TIMINGS.showcaseMouseTilt,
      ease: ANIMATION_EASING.default,
      overwrite: "auto",
    });
  };
  const handleMouseLeave = () => {
    gsap.to([imgs, ghosts], {
      rotationY: 0, rotationX: 0,
      duration: ANIMATION_TIMINGS.showcaseMouseReset,
      ease: ANIMATION_EASING.cubic,
      overwrite: "auto",
    });
  };
  pin.addEventListener("mousemove", handleMouseMove as EventListener);
  pin.addEventListener("mouseleave", handleMouseLeave);

  // ── Arrow / tick navigation ────────────────────────────────────────────────
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
    // Map 0, 1, 2 to the exact scroll positions:
    // 0 → st.start, 1 → midpoint, 2 → st.end
    const progress = n * 0.5;
    const targetY = st.start + (st.end - st.start) * progress;
    gsap.to(window, {
      scrollTo: targetY,
      duration: 0.8,
      ease: ANIMATION_EASING.scrollTo,
      overwrite: "auto",
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

  const tickCleanups: Array<() => void> = [];
  tickBtns.forEach((btn, i) => {
    const handler = (e: Event) => { e.preventDefault(); goToSlide(i); };
    btn.addEventListener("click", handler);
    tickCleanups.push(() => btn.removeEventListener("click", handler));
  });

  // Return cleanup for all event listeners registered here
  return () => {
    pin.removeEventListener("mousemove", handleMouseMove as EventListener);
    pin.removeEventListener("mouseleave", handleMouseLeave);
    prevBtn?.removeEventListener("click", handlePrev);
    nextBtn?.removeEventListener("click", handleNext);
    window.removeEventListener("keydown", handleKeyDown);
    ScrollTrigger.removeEventListener("refresh", updatePinRect);
    tickCleanups.forEach(fn => fn());
  };
}
