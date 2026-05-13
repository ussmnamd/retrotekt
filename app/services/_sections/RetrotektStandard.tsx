"use client";

import { useEffect, useRef } from "react";

const edgePoints = [
  {
    num: "01",
    title: "100% In-House Accountability",
    sub: "No \"Rendering Mills.\" No Outsourcing.",
    body: "Unlike volume-based studios that farm your project out to a rotating door of freelancers, every pixel is produced in-house by our core team. You get one dedicated line of communication, consistent quality, and a team that actually remembers your aesthetic preferences.",
  },
  {
    num: "02",
    title: "The Pace of Construction",
    sub: "Speed Is Our Strength.",
    body: "In development, time is literal money. We've optimized our pipeline to match the aggressive timelines of modern construction. We deliver when your project demands it — not when it's \"convenient\" for our schedule.",
  },
  {
    num: "03",
    title: "U.S. Market Fluency",
    sub: "We Speak Your Language.",
    body: "We possess a deep understanding of American construction standards, contractor workflows, and the specific architectural aesthetics that resonate with U.S. investors. We don't need you to explain what a \"permit-ready\" set looks like — we already know.",
  },
  {
    num: "04",
    title: "ROI-Engineered Visuals",
    sub: "Pretty Images Don't Close Deals. Strategy Does.",
    body: "Most services focus on \"art.\" We focus on conversion. We engineer your visual tools to trigger a specific response: a signed contract, a funded proposal, or a sold-out listing. We don't just make it look good; we make it sell.",
  },
];

export default function RetrotektStandard() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = ref.current?.querySelectorAll(".reveal, .reveal-clip");
    if (!elements?.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-background py-10 md:py-14 px-6 md:px-16 lg:px-24 border-b border-[#D4C5A9]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16 mb-8 pb-8 border-b border-[#D4C5A9]/50">
          <div className="md:w-[42%]">
            <p className="font-body text-[12px] tracking-[0.22em] uppercase text-muted mb-3">
              Our Guarantee
            </p>
            <h2
              className="reveal font-heading font-light text-primary leading-[0.95] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
            >
              The Retrotekt<br />Standard.
            </h2>
          </div>
          <div className="md:w-[58%] flex flex-col gap-3">
            <p
              className="reveal font-heading font-light text-primary/70 leading-tight"
              style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
            >
              A Guarantee of Execution, Not Just Art.
            </p>
            <p className="reveal reveal-delay-1 font-body text-[14px] text-deep/90 leading-[1.85]">
              We don&apos;t just deliver images; we provide a competitive edge.
              Our guarantee is built on the four pillars that separate high-stakes
              visualization from &ldquo;just another pretty picture.&rdquo;
            </p>
          </div>
        </div>

        {/* Four pillars — horizontal rows */}
        <div>
          {edgePoints.map((pt, i) => (
            <div
              key={pt.num}
              className={`reveal reveal-delay-${Math.min(i, 2)} flex flex-col md:flex-row gap-3 md:gap-12 py-6 border-b border-[#D4C5A9]/30 last:border-b-0`}
            >
              {/* Left: number + title + italic sub */}
              <div className="md:w-[42%] flex items-start gap-4">
                <span
                  className="font-heading font-light text-primary/20 flex-shrink-0 leading-none mt-0.5"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.12em" }}
                >
                  {pt.num}
                </span>
                <div>
                  <h3 className="font-body text-[12px] tracking-[0.18em] uppercase text-primary mb-1.5">
                    {pt.title}
                  </h3>
                  <p
                    className="font-heading font-light text-primary/70 italic leading-snug"
                    style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)" }}
                  >
                    {pt.sub}
                  </p>
                </div>
              </div>
              {/* Right: body */}
              <div className="md:w-[58%]">
                <p className="font-body text-[14px] text-deep/90 leading-[1.85]">
                  {pt.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
