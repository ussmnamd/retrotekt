// Process section scroll animation: drives the processActivePhase React state
// in a staggered sequence as the section enters the viewport.
// Called from HomeClient's main GSAP useEffect, inside the full-motion mm.add block.

import { ANIMATION_TIMINGS } from "@/lib/animation-config";

type Gsap = typeof import("gsap").default;
type ScrollTrigger = typeof import("gsap/ScrollTrigger").ScrollTrigger;

export function setupProcessAnimation(
  gsap: Gsap,
  ScrollTrigger: ScrollTrigger,
  processEl: HTMLElement | null,
  setProcessActivePhase: (phase: number) => void
) {
  if (!processEl) return;

  ScrollTrigger.create({
    trigger: processEl,
    start: "top 70%",
    end: "+=400",
    once: true,
    refreshPriority: 4,
    onEnter: () => {
      // Staggered state bumps replace the old IntersectionObserver chain.
      // Each card activates ANIMATION_TIMINGS.processStagger seconds after the previous.
      [0, 1, 2, 3].forEach(i =>
        gsap.delayedCall(i * ANIMATION_TIMINGS.processStagger, () => setProcessActivePhase(i))
      );
    },
  });
}
