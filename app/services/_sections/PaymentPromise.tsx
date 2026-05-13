"use client";

import { useEffect, useRef } from "react";

export default function PaymentPromise() {
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
    <section ref={ref} className="py-8 px-6 md:px-16 lg:px-24 border-b border-[#3D2A1A]" style={{ background: "#221709" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="font-body text-[12px] tracking-[0.22em] uppercase text-secondary/50 mb-5">
              Our Payment Promise
            </p>
            <h2
              className="reveal font-heading font-light text-background leading-[0.95] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Zero-Risk<br />Partnership.
            </h2>
          </div>
          <p className="reveal reveal-delay-1 font-body text-[15px] text-background/35 max-w-[380px] leading-relaxed">
            Trust is earned through performance. We don&apos;t believe you should
            fund a project before seeing meaningful progress.
          </p>
        </div>

        {/* Payment milestone infographic */}
        <div className="reveal relative">
          {/* Track bar */}
          <div className="relative mb-0">
            {/* Background bar */}
            <div className="h-0.5 bg-[#3D2A1A] w-full" />
            {/* Filled indicator (50%) */}
            <div className="absolute top-0 left-0 h-0.5 w-1/2 bg-gradient-to-r from-secondary/60 to-secondary/30" />
          </div>

          {/* Milestone markers */}
          <div className="grid grid-cols-3 -mt-2">
            {[
              {
                label: "Project Start",
                amount: "$0",
                sub: "No upfront payment required",
                note: "We begin immediately",
                align: "left",
              },
              {
                label: "50% Complete",
                amount: "50% Due",
                sub: "Only on initial concept review",
                note: "You see it before you pay",
                align: "center",
              },
              {
                label: "Final Delivery",
                amount: "50% Due",
                sub: "On file handoff",
                note: "Paying for a product, not a promise",
                align: "right",
              },
            ].map((m) => (
              <div
                key={m.label}
                className={`flex flex-col ${m.align === "center" ? "items-center text-center" : m.align === "right" ? "items-end text-right" : "items-start text-left"} pt-6`}
              >
                {/* Dot */}
                <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/15 mb-5" />
                <div className="font-body text-[11px] tracking-[0.16em] uppercase text-secondary/60 mb-1.5">
                  {m.label}
                </div>
                <div
                  className="font-heading font-light text-background mb-1 tabular-nums"
                  style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                >
                  {m.amount}
                </div>
                <div className="font-body text-[14px] text-background/40 mb-1">{m.sub}</div>
                <div className="font-body text-[13px] text-secondary/45 italic">{m.note}</div>
              </div>
            ))}
          </div>

          {/* Bottom callout */}
          <div className="mt-16 flex items-stretch gap-5 max-w-2xl">
            <div className="w-0.5 bg-secondary/25 flex-shrink-0 rounded-full" />
            <p className="font-body text-[15px] text-background/40 leading-relaxed italic">
              This structure ensures total alignment and protects you from paying for a promise
              rather than a product — from the very first line drawn to the final file delivered.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
