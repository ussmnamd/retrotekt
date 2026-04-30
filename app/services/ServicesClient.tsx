"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */

function IconCamera() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8C6E4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="28" height="20" rx="2" />
      <circle cx="16" cy="18" r="5" />
      <path d="M21 8l-2-3H13L11 8" />
      <circle cx="25" cy="13" r="1" fill="#8C6E4B" stroke="none" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8C6E4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="28" height="24" rx="2" />
      <polygon points="12,10 24,16 12,22" fill="#8C6E4B" stroke="#8C6E4B" strokeWidth="1" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8C6E4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="11" height="11" />
      <rect x="18" y="3" width="11" height="11" />
      <rect x="3" y="18" width="11" height="11" />
      <rect x="18" y="18" width="11" height="11" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8C6E4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="13" r="5" />
      <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8C6E4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <ellipse cx="16" cy="16" rx="6" ry="13" />
      <line x1="3" y1="16" x2="29" y2="16" />
      <line x1="5" y1="10" x2="27" y2="10" />
      <line x1="5" y1="22" x2="27" y2="22" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8C6E4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <line x1="16" y1="9" x2="16" y2="23" />
      <line x1="9" y1="16" x2="23" y2="16" />
    </svg>
  );
}

/* ── Service card data ──────────────────────────────────────────────────────── */

const services = [
  {
    Icon: IconCamera,
    id: "renders",
    title: "Still Renders",
    price: "Starting from $200 / render",
    description:
      "Photorealistic interior and exterior images for proposals, permits, and marketing. Delivered HD, print-ready, and permit-compatible.",
    bullets: [
      "Interior & exterior options",
      "HD + print-ready resolution",
      "Permit-compatible output",
      "Multiple revision rounds included",
    ],
  },
  {
    Icon: IconPlay,
    id: "walkthroughs",
    title: "Walkthrough Animations",
    price: "Starting from $800",
    description:
      "Cinematic video tours that put clients inside the space before a wall goes up. Built for presentations, sales pitches, and investor decks.",
    bullets: [
      "Room walkthroughs (15–30 sec)",
      "Full interior tours (45–60 sec)",
      "Exterior flyovers with ground-level angles",
      "Background music + branding overlay options",
    ],
  },
  {
    Icon: IconGrid,
    id: "floor-plans",
    title: "Floor Plan Renders",
    price: "Starting from $150 / floor",
    description:
      "Clean, accurate floor plan renders for permit applications, proposals, and client presentations. Architecturally precise and visually sharp.",
    bullets: [
      "Per-floor pricing",
      "Permit-ready format",
      "2D annotated output",
      "Fast turnaround",
    ],
  },
  {
    Icon: IconMap,
    id: "aerial",
    title: "Aerial & Bird's-Eye Views",
    price: "Starting from $200 / view",
    description:
      "Drone-perspective site overviews showing lot layout, massing, and surrounding context. Essential for developer decks and site proposals.",
    bullets: [
      "Bird's-eye and drone-angle options",
      "Full site context",
      "Exterior massing shown clearly",
      "Ideal for pre-construction marketing",
    ],
  },
  {
    Icon: IconGlobe,
    id: "panoramas",
    title: "360° Panorama Views",
    price: "Starting from $300 / room",
    description:
      "Fully immersive 360° room renders clients can explore on any device. Share a link — no app, no download required.",
    bullets: [
      "Interactive 360° output",
      "Shareable link delivery",
      "Per-room pricing",
      "Works on mobile and desktop",
    ],
  },
  {
    Icon: IconPlus,
    id: "add-ons",
    title: "Add-On Services",
    price: "Starting from project scope",
    description:
      "Enhance any order with targeted additions. Mix and match to match your exact project scope — nothing you don't need.",
    bullets: [
      "Rush delivery (24–48 hrs available)",
      "Extra revision rounds",
      "Furniture & staging swaps",
      "Custom scope available on request",
    ],
  },
];

/* ── How It Works steps ─────────────────────────────────────────────────────── */

const steps = [
  {
    num: "01",
    title: "Send Your Plans",
    body: "Any format — drawings, sketches, photos. We take it from there.",
  },
  {
    num: "02",
    title: "We Model & Render",
    body: "Our team builds the 3D scene and renders to your exact specs.",
  },
  {
    num: "03",
    title: "Review & Revise",
    body: "Request changes. We iterate until every detail is exactly right.",
  },
  {
    num: "04",
    title: "Final Delivery",
    body: "HD files in all formats — ready for proposals, permits, pitches.",
  },
];

/* ── Main client component ──────────────────────────────────────────────────── */

export default function ServicesClient() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll(".reveal");
    if (!elements) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="bg-background pt-20 md:pt-24">

      {/* ── Section 1: Hero ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32 border-b border-[#D4C5A9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-label">Services</span>
            <div className="h-px bg-[#D4C5A9] w-16 flex-shrink-0" />
          </div>
          <h1 className="reveal font-heading text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] tracking-[-0.025em] text-primary max-w-3xl mb-6">
            3D Rendering Services for Contractors &amp; Developers
          </h1>
          <p className="reveal reveal-delay-1 font-body text-[16px] text-deep leading-relaxed max-w-xl mb-10">
            Photorealistic renders, walkthroughs, floor plans, and aerials —
            delivered in days, priced for serious contractors.
          </p>
          <Link
            href="/contact"
            className="reveal reveal-delay-2 btn-dark inline-block bg-primary text-background px-8 py-4 font-body text-[12px] tracking-[0.14em] uppercase"
          >
            Get a Custom Quote
          </Link>
        </div>
      </section>

      {/* ── Section 2: Service Cards ──────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <p className="reveal font-body text-[10px] tracking-[0.4em] uppercase text-muted mb-4">
            What We Offer
          </p>
          <p className="reveal reveal-delay-1 font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-[-0.025em] text-primary mb-14">
            Studio-quality visuals.<br className="hidden md:block" /> Built for contractors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                id={svc.id}
                className={`group reveal reveal-delay-${Math.min(i % 3 + 1, 4)} relative flex flex-col bg-surface border border-[#D4C5A9] hover:border-secondary/50 hover:bg-[#E8DCC8] transition-all duration-300 hover:-translate-y-1 p-8`}
              >
                {/* Icon */}
                <div className="mb-5">
                  <svc.Icon />
                </div>

                {/* Title */}
                <h2 className="font-heading text-[20px] leading-[1.2] tracking-[-0.01em] text-primary mb-3">
                  {svc.title}
                </h2>

                {/* Description */}
                <p className="font-body text-[13px] leading-relaxed text-deep mb-5">
                  {svc.description}
                </p>

                {/* Bullets */}
                <ul className="flex flex-col gap-1.5 mb-6">
                  {svc.bullets.map((b) => (
                    <li
                      key={b}
                      className="font-body text-[12px] text-primary/50 flex items-start gap-2"
                    >
                      <span className="text-secondary mt-px leading-none">·</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Price badge + quote link */}
                <div className="mt-auto border-t border-[#D4C5A9] pt-4 flex items-center justify-between">
                  <span className="font-body text-secondary text-[11px] tracking-[0.1em] uppercase">
                    {svc.price}
                  </span>
                  <Link
                    href="/contact"
                    className="font-body text-[11px] tracking-[0.08em] text-primary/40 group-hover:text-secondary opacity-0 group-hover:opacity-100 transition-all duration-200 uppercase"
                  >
                    Get a quote →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: How It Works ───────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28 px-6 md:px-16 lg:px-24 border-t border-[#D4C5A9]">
        <div className="max-w-7xl mx-auto">
          <p className="reveal font-body text-[10px] tracking-[0.4em] uppercase text-muted mb-4">
            Process
          </p>
          <h2 className="reveal reveal-delay-1 font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-[-0.025em] text-primary mb-16">
            How It Works
          </h2>

          <div className="flex flex-col md:flex-row md:gap-0 gap-10">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`reveal reveal-delay-${i + 1} flex-1 relative md:pr-8`}
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 w-px h-full bg-[#D4C5A9]" />
                )}

                <div
                  className="font-heading font-bold leading-none mb-4 select-none text-primary/[0.07]"
                  style={{ fontSize: "clamp(3rem,6vw,4.5rem)" }}
                >
                  {step.num}
                </div>

                <h3 className="font-heading text-[13px] tracking-[0.08em] uppercase text-primary mb-3">
                  {step.title}
                </h3>

                <p className="font-body text-[13px] text-primary/50 leading-relaxed max-w-[220px]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: CTA Banner ─────────────────────────────────────────────── */}
      <section className="bg-primary py-20 md:py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-2xl">
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-[-0.025em] text-background mb-5">
              Start Your Project
            </h2>
            <p className="font-body text-[15px] text-background/50 leading-relaxed mb-10 max-w-lg">
              Tell us about your project. We&apos;ll recommend the right approach and
              send a custom quote within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-gold inline-flex items-center justify-center bg-secondary text-primary px-8 py-4 font-body text-[12px] tracking-[0.14em] uppercase"
              >
                Book a Call
              </Link>
              <Link
                href="/contact"
                className="btn-outline-light inline-flex items-center justify-center border border-background/25 text-background/65 hover:border-background/50 hover:text-background px-8 py-4 font-body text-[12px] tracking-[0.14em] uppercase transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
