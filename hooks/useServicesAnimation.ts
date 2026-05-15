// Services section reveal animation: heading clip-path, card stagger, link fade.
// Called from HomeClient's main GSAP useEffect, inside the full-motion mm.add block.

import { ANIMATION_TIMINGS, ANIMATION_EASING } from "@/lib/animation-config";

type Gsap = typeof import("gsap").default;

export function setupServicesAnimation(gsap: Gsap) {
  const servicesSection = document.getElementById("services-section");
  if (!servicesSection) return;

  const sHeading = servicesSection.querySelector(".heading-wrapper");
  const sCards = servicesSection.querySelectorAll("#service-grid .scard");
  const sLink = servicesSection.querySelector("a[href='/services']");

  if (sHeading) {
    gsap.from(sHeading, {
      clipPath: "inset(100% 0 0 0)",
      y: 24,
      opacity: 0,
      duration: ANIMATION_TIMINGS.servicesHeading,
      ease: ANIMATION_EASING.expo,
      scrollTrigger: {
        trigger: servicesSection,
        start: "top 80%",
        toggleActions: "play none none none",
        refreshPriority: 8,
      },
    });
  }

  if (sCards.length) {
    gsap.from(sCards, {
      y: 52,
      opacity: 0,
      duration: ANIMATION_TIMINGS.servicesCards,
      ease: ANIMATION_EASING.expo,
      stagger: ANIMATION_TIMINGS.servicesCardsStagger,
      scrollTrigger: {
        trigger: servicesSection,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }

  if (sLink) {
    gsap.from(sLink, {
      y: 16,
      opacity: 0,
      duration: ANIMATION_TIMINGS.servicesLink,
      ease: ANIMATION_EASING.default,
      delay: ANIMATION_TIMINGS.servicesLinkDelay,
      scrollTrigger: {
        trigger: servicesSection,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }
}
