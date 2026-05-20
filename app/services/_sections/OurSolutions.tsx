"use client";

import { useEffect, useRef } from "react";

const solutions = [
  {
    num: "01",
    tag: "Pre-Sale",
    title: "The Deal Closer",
    desc: "Lightning-fast, budget-friendly visuals to get the signature.",
    stats: [
      { val: "24–48h", label: "Turnaround" },
      { val: "Budget", label: "Friendly" },
    ],
    bullets: [
      "Lightning-fast concept delivery",
      "Basic 3D massing & before/after visuals",
      "Stops hesitation — accelerates signing",
    ],
    outcome: "Stop explaining your vision. Show it.",
  },
  {
    num: "02",
    tag: "Full Project",
    title: "The Master Plan",
    desc: "Ultra-realistic, 4K+ resolution for final alignment.",
    stats: [
      { val: "4K+", label: "Resolution" },
      { val: "Day/Night", label: "Lighting" },
    ],
    bullets: [
      "Ultra-realistic interior & exterior renders",
      "Advanced atmospheric lighting & mood studies",
      "Multiple angles — complete coverage",
    ],
    outcome: "Total client alignment. Zero ambiguity.",
  },
  {
    num: "03",
    tag: "Cinematic",
    title: "The Investor Magnet",
    desc: "Immersive storytelling to secure capital and hype.",
    stats: [
      { val: "4K", label: "Video" },
      { val: "360°", label: "VR Ready" },
    ],
    bullets: [
      "15–60 second cinematic flythroughs",
      "Short-form clips optimized for Instagram",
      "360° panoramas — no app required on any device",
    ],
    outcome: "Immersive storytelling that sells before construction begins.",
  },
  {
    num: "04",
    tag: "Strategic",
    title: "The Creative Partner",
    desc: "Full layout optimization and pitch deck design.",
    stats: [
      { val: "Full", label: "Pitch Decks" },
      { val: "2D+3D", label: "Floor Plans" },
    ],
    bullets: [
      "Layout optimization & space planning",
      "Pitch decks, website visuals, before/after ads",
      "SketchUp modeling & construction documentation",
    ],
    outcome: "A creative partner, not just a rendering vendor.",
  },
];

export default function OurSolutions() {
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
    <section ref={ref} className="pt-8 pb-16 md:pb-24 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-2">
          <div>
            <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
              Our Solutions
            </p>
            <h2
              className="reveal font-heading font-light text-background leading-[0.95] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Engineered to<br />Close Deals.
            </h2>
          </div>
          <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[360px] leading-relaxed">
            We don&apos;t sell &ldquo;renders.&rdquo; We package strategic solutions
            based on where you are in the project lifecycle:
          </p>
        </div>

        {/* Solution tiers — alternating rows */}
        {solutions.map((sol, i) => (
          <div
            key={sol.num}
            className={`reveal group border-t border-[#3D2A1A] py-8 md:py-10 flex flex-col md:flex-row gap-8 md:gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
          >
            {/* Left col: Ghost number + label + title + stats */}
            <div className="md:w-[42%] flex flex-col justify-between gap-8">
              <div>
                {/* Ghost number */}
                <div
                  className="font-heading font-light text-background/[0.04] leading-none select-none"
                  style={{ fontSize: "clamp(4rem, 10vw, 7rem)", letterSpacing: "-0.04em" }}
                >
                  {sol.num}
                </div>
                <div className="font-body text-[12px] tracking-[0.2em] uppercase text-secondary/55 mb-3 mt-2">
                  {sol.tag}
                </div>
                <h3
                  className="font-heading font-light text-background tracking-[-0.02em] leading-[0.97]"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)" }}
                >
                  {sol.title}
                </h3>
              </div>

              {/* Stat pills */}
              <div className="flex gap-6">
                {sol.stats.map((stat) => (
                  <div key={stat.label} className="border-l-2 border-secondary/25 pl-4">
                    <div className="font-heading text-secondary font-light mb-0.5" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}>
                      {stat.val}
                    </div>
                    <div className="font-body text-[11px] tracking-[0.14em] uppercase text-background/30">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col: Description + bullets + outcome quote */}
            <div className="md:w-[58%] flex flex-col justify-center">
              <p className="font-body text-[15px] text-background/55 leading-[1.8] max-w-[520px] mb-5">
                {sol.desc}
              </p>

              <ul className="flex flex-col gap-3 mb-6">
                {sol.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 font-body text-[15px] text-background/45">
                    <span className="text-secondary flex-shrink-0 mt-0.5">→</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Outcome callout */}
              <div className="flex items-stretch gap-4">
                <div className="w-0.5 bg-secondary/30 flex-shrink-0 rounded-full" />
                <p className="font-body text-[14px] text-secondary/65 italic leading-relaxed">
                  {sol.outcome}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
