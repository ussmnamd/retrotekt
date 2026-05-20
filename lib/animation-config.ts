// Central registry for animation timing values used in HomeClient.
// Edit here to tune all animations in one place.

export const ANIMATION_TIMINGS = {
  // Navbar entrance
  navbarEntrance: 0.8,

  // Hero scroll indicator
  scrollIndicatorIn: 1.0,
  scrollIndicatorDelay: 0.8,

  // Services section
  servicesHeading: 1.0,
  servicesCards: 0.85,
  servicesCardsStagger: 0.1,
  servicesLink: 0.8,
  servicesLinkDelay: 0.5,

  // Model showcase transitions
  showcaseSpinOut: 0.55,
  showcaseSpinIn: 0.6,
  showcaseCapsOut: 0.4,
  showcaseCapsIn: 0.45,
  showcaseScrub: 0.6,
  showcaseTick: 0.35,
  showcaseMistIn: 0.3,
  showcaseMistOut: 0.4,
  showcaseMouseTilt: 0.8,
  showcaseMouseReset: 1.0,

  // Process section: each card activates this many seconds after the previous
  processStagger: 0.12,

  // Portfolio grid reveal
  portfolioGrid: 0.7,
  portfolioGridStagger: 0.07,

  // Generic [data-anim] reveals
  dataAnimHeading: 0.85,
  dataAnimLabel: 0.65,
  dataAnimFade: 0.75,
  dataAnimLine: 0.8,

  // Reduced motion fallback
  reducedMotionFade: 0.5,
  reducedMotionShowcase: 0.6,
};

export const ANIMATION_EASING = {
  // Primary entrance easing used for most reveals
  default: "power2.out",
  // Strong deceleration for headings / hero text
  expo: "expo.out",
  // Cubic ease used for interactive/spring-like motion
  cubic: "power3.out",
  // Smooth scroll-to-slide navigation
  scrollTo: "power2.inOut",
  // Showcase scrub snap
  showcaseSnap: "power2.inOut",
};
