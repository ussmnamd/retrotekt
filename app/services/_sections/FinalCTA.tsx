"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function FinalCTA() {
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
    <section ref={ref} className="bg-background py-10 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="md:w-3/5">
            <p className="font-body text-[12px] tracking-[0.22em] uppercase text-muted mb-6">
              Ready to Win?
            </p>
            <h2
              className="reveal font-heading font-light text-primary leading-[0.93] tracking-[-0.03em] mb-0"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
            >
              Stop Losing Bids<br />to &ldquo;Lack of<br />
              <span className="text-secondary">Imagination.&rdquo;</span>
            </h2>
          </div>
          <div className="md:w-2/5 flex flex-col gap-6">
            <p className="reveal reveal-delay-1 font-body text-[16px] text-deep/60 leading-[1.8] max-w-sm">
              Stop losing bids to a &ldquo;lack of imagination.&rdquo; Stop explaining your
              vision—start showing it. Submit your plans (CAD, PDF, or Photo) and
              let&apos;s get to work.
            </p>
            <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-primary/10 bg-primary/[0.04] hover:bg-primary/[0.09] hover:border-primary/20 transition-colors duration-300">
                <div className="w-8 h-[1.5px] bg-primary/60 group-hover:w-24 group-hover:bg-primary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
                <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary transition-colors duration-300">Get Your Custom Quote in 24 Hours</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
