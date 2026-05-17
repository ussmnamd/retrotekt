// Portfolio grid reveal animation: staggered fade-up for grid items.
// Called from HomeClient's main GSAP useEffect, inside the full-motion mm.add block.

import { ANIMATION_TIMINGS, ANIMATION_EASING } from "@/lib/animation-config";

type Gsap = typeof import("gsap").default;

export function setupPortfolioAnimation(gsap: Gsap) {
  if (!document.querySelector("#portfolio-grid .pitem")) return;

  gsap.from("#portfolio-grid .pitem", {
    y: 28,
    opacity: 0,
    scale: 0.97,
    duration: ANIMATION_TIMINGS.portfolioGrid,
    ease: ANIMATION_EASING.default,
    stagger: { each: ANIMATION_TIMINGS.portfolioGridStagger, from: "random" as gsap.utils.DistributeConfig["from"] },
    scrollTrigger: {
      trigger: "#portfolio-grid",
      start: "top 84%",
      toggleActions: "play none none none",
      refreshPriority: 2,
    },
  });
}
