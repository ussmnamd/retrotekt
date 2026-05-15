// Generic [data-anim] scroll reveals for headings, labels, fades, and lines.
// Called from HomeClient's main GSAP useEffect, inside both full-motion and
// reduced-motion mm.add blocks.

import { ANIMATION_TIMINGS, ANIMATION_EASING } from "@/lib/animation-config";

type Gsap = typeof import("gsap").default;

/**
 * Full-motion variant: each data-anim type gets its own entrance animation.
 * Elements inside .showcase-pin are skipped (handled by the showcase hook).
 */
export function setupGenericAnimations(gsap: Gsap) {
  // Skip elements nested inside the showcase pin — they have their own scroll logic
  const showcasePinEl = document.querySelector(".showcase-pin");

  document.querySelectorAll("[data-anim]").forEach(el => {
    const a = (el as HTMLElement).dataset.anim;
    if (!a || a === "cta") return;
    if (showcasePinEl && showcasePinEl.contains(el)) return;

    if (a === "heading") {
      gsap.from(el, {
        clipPath: "inset(100% 0 0 0)", y: 20, opacity: 0,
        duration: ANIMATION_TIMINGS.dataAnimHeading,
        ease: ANIMATION_EASING.expo,
        scrollTrigger: {
          trigger: el, start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    } else if (a === "label") {
      gsap.from(el, {
        opacity: 0, x: -14,
        duration: ANIMATION_TIMINGS.dataAnimLabel,
        ease: ANIMATION_EASING.cubic,
        scrollTrigger: {
          trigger: el, start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    } else if (a === "fade") {
      gsap.from(el, {
        opacity: 0, y: 18,
        duration: ANIMATION_TIMINGS.dataAnimFade,
        ease: ANIMATION_EASING.default,
        scrollTrigger: {
          trigger: el, start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    } else if (a === "line") {
      gsap.from(el, {
        scaleX: 0, transformOrigin: "left center",
        duration: ANIMATION_TIMINGS.dataAnimLine,
        ease: ANIMATION_EASING.expo,
        scrollTrigger: {
          trigger: el, start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    }
  });
}

/**
 * Reduced-motion variant: simple opacity fades, no transforms.
 */
export function setupGenericAnimationsReduced(gsap: Gsap) {
  document.querySelectorAll("[data-anim]").forEach(el => {
    const a = (el as HTMLElement).dataset.anim;
    if (!a) return;
    gsap.from(el, {
      opacity: 0,
      duration: ANIMATION_TIMINGS.reducedMotionFade,
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });
}
