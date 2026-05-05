"use client";

import React from "react";

export interface CTAMarqueeProps {
  type: "top" | "bottom";
}

export default function CTAMarquee({ type }: CTAMarqueeProps) {
  if (type === "top") {
    return (
      <div
        className="relative overflow-hidden"
        style={{ paddingTop: "clamp(1.5rem, 2vw, 2rem)", paddingBottom: "clamp(1.5rem, 2vw, 2rem)" }}
        aria-hidden="true"
      >
        <div className="flex" style={{ animation: "cta-marquee 22s linear infinite" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-heading font-light tracking-[-0.02em] whitespace-nowrap flex-shrink-0 flex items-center gap-8"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                color: i % 2 === 0 ? "rgba(196,168,130,0.18)" : "rgba(247,240,227,0.06)",
                paddingRight: "clamp(2rem, 5vw, 4rem)",
              }}
            >
              Build Something Unforgettable
              <span style={{ color: "#C4A882", opacity: 0.4, fontSize: "0.5em" }}>✦</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes cta-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    );
  }

  // bottom
  return (
    <div
      className="relative overflow-hidden"
      style={{ paddingBottom: "clamp(0rem, 0vw, 0rem)" }}
      aria-hidden="true"
    >
      <div
        className="flex"
        style={{ animation: "cta-marquee 30s linear infinite reverse" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="font-mono font-light tracking-[0.3em] whitespace-nowrap flex-shrink-0 flex items-center gap-8 py-4"
            style={{
              fontSize: "clamp(0.6rem, 1vw, 0.8rem)",
              color: "rgba(196,168,130,0.12)",
              paddingRight: "clamp(2rem, 4vw, 3.5rem)",
              fontFamily: "monospace",
            }}
          >
            PHOTOREALISTIC · 3D VISUALIZATION · RETROTEKT · USA · 2026 · STUDIO QUALITY · CONTRACTOR PRICING ·
          </span>
        ))}
      </div>
      <style>{`
        @keyframes cta-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
