// Hero entrance animation: navbar slide-in and scroll-indicator fade.
// Called from HomeClient's main GSAP useEffect, inside the full-motion mm.add block.

import { ANIMATION_TIMINGS, ANIMATION_EASING } from "@/lib/animation-config";

type Gsap = typeof import("gsap").default;
type ScrollTrigger = typeof import("gsap/ScrollTrigger").ScrollTrigger;

export function setupHeroAnimation(gsap: Gsap, ScrollTrigger: ScrollTrigger) {
  // Scroll indicator fades in after hero content loads
  gsap.fromTo(
    "#scroll-indicator",
    { opacity: 0 },
    {
      opacity: 0.35,
      duration: ANIMATION_TIMINGS.scrollIndicatorIn,
      ease: ANIMATION_EASING.default,
      delay: ANIMATION_TIMINGS.scrollIndicatorDelay,
    }
  );

  // Scroll indicator scrubs to 0 as the hero section scrolls away
  const heroSection = document.querySelector<HTMLElement>("[data-section='hero']");
  if (heroSection) {
    gsap.to("#scroll-indicator", {
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
}
