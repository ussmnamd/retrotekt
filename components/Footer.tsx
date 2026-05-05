"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Footer() {
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.15;
    const animate = () => {
      pos = (pos + speed) % 100;
      el.style.transform = `translateY(${pos}%)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#1A1008" }}
      aria-label="Site footer"
    >
      {/* ── Blueprint grid overlay ───────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" className="opacity-[0.045]">
          <defs>
            <pattern
              id="footer-grid"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="#C4A882"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="footer-grid-major"
              x="0"
              y="0"
              width="400"
              height="400"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 400 0 L 0 0 0 400"
                fill="none"
                stroke="#C4A882"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
          <rect width="100%" height="100%" fill="url(#footer-grid-major)" />
        </svg>
      </div>

      {/* ── Animated scan line ───────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ height: "100%" }}
      >
        <div
          ref={scanRef}
          className="absolute inset-x-0"
          style={{
            height: "120px",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(196,168,130,0.025) 50%, transparent 100%)",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── Grain texture ────────────────────────────────────────────────── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="footer-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#footer-noise)" />
      </svg>

      {/* ── Coordinate labels ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

        {/* Coordinate labels */}
        <span
          className="absolute top-6 left-14 font-mono text-[9px] text-[#C4A882] opacity-30 tracking-widest"
          style={{ fontFamily: "monospace" }}
        >
          X:0000 Y:0000
        </span>
        <span
          className="absolute top-6 right-14 font-mono text-[9px] text-[#C4A882] opacity-30 tracking-widest"
          style={{ fontFamily: "monospace" }}
        >
          SHEET 01/01
        </span>
        <span
          className="absolute bottom-6 left-14 font-mono text-[9px] text-[#C4A882] opacity-30 tracking-widest"
          style={{ fontFamily: "monospace" }}
        >
          REV.2026.A
        </span>
        <span
          className="absolute bottom-6 right-14 font-mono text-[9px] text-[#C4A882] opacity-30 tracking-widest"
          style={{ fontFamily: "monospace" }}
        >
          SCALE 1:1
        </span>
      </div>

      {/* ── Massive background wordmark ───────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
        style={{ lineHeight: 0.85 }}
      >
        <p
          className="font-heading font-bold tracking-[-0.04em] text-[#C4A882] whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 18vw, 18rem)",
            opacity: 0.04,
            transform: "translateY(18%)",
          }}
        >
          RETROTEKT.
        </p>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 md:px-14 lg:px-20 pt-20 pb-12">

        {/* Top section — Brand + Drawing Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16">

          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-8 group" aria-label="Retrotekt home">
              <Image
                src="/logo-mark.png"
                alt="Retrotekt"
                width={40}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>

            {/* Studio classification badge */}
            <div className="inline-flex items-center gap-3 mb-7 px-3 py-1.5 rounded-sm bg-[#C4A882]/5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4A882]" />
              <span
                className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C4A882]/60"
                style={{ fontFamily: "monospace" }}
              >
                Studio Classification: Active
              </span>
            </div>

            <p className="font-body text-[13px] leading-[1.9] text-[#F7F0E3]/35 max-w-[300px] mb-8">
              Photorealistic 3D architectural visualizations built for the contractors and remodelers who refuse to sell blind.
            </p>

            {/* Contact row */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:shahan@retrotekt.com"
                className="group flex items-center gap-3 w-fit"
                aria-label="Email us"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#C4A882]/40 group-hover:text-[#C4A882] transition-colors duration-300 flex-shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-body text-[12px] text-[#F7F0E3]/40 group-hover:text-[#C4A882] transition-colors duration-300">
                  shahan@retrotekt.com
                </span>
              </a>
              <a
                href="https://wa.me/NUMBER_TBD"
                className="group flex items-center gap-3 w-fit"
                aria-label="WhatsApp"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#C4A882]/40 group-hover:text-[#C4A882] transition-colors duration-300 flex-shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="font-body text-[12px] text-[#F7F0E3]/40 group-hover:text-[#C4A882] transition-colors duration-300">
                  WhatsApp Direct Line
                </span>
              </a>
            </div>
          </div>

          {/* Drawing Index — Navigation */}
          <div className="lg:col-span-3 lg:col-start-7">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-6 bg-[#C4A882]/30" />
              <p
                className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C4A882]/40"
                style={{ fontFamily: "monospace" }}
              >
                Drawing Index
              </p>
            </div>
            <ul className="flex flex-col gap-0">
              {[
                { label: "Services", href: "/services", num: "DWG-01" },
                { label: "Portfolio", href: "/portfolio", num: "DWG-02" },
                { label: "Consulting", href: "/consulting", num: "DWG-03" },
                { label: "Contact", href: "/contact", num: "DWG-04" },
              ].map(({ label, href, num }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between py-3 hover:pl-2 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-[9px] text-[#C4A882]/25 group-hover:text-[#C4A882]/50 transition-colors duration-300 w-14 flex-shrink-0"
                        style={{ fontFamily: "monospace" }}
                      >
                        {num}
                      </span>
                      <span className="font-body text-[13px] text-[#F7F0E3]/50 group-hover:text-[#F7F0E3] transition-colors duration-300">
                        {label}
                      </span>
                    </div>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-[#C4A882]/20 group-hover:text-[#C4A882]/60 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                    >
                      <path
                        d="M2 6h8M7 3l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio stamp col */}
          <div className="lg:col-span-2 lg:col-start-11 flex flex-col items-start lg:items-end">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-6 bg-[#C4A882]/30" />
              <p
                className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C4A882]/40"
                style={{ fontFamily: "monospace" }}
              >
                Studio
              </p>
            </div>

            {/* Circular stamp */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 96 96" className="w-full h-full opacity-30">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="#C4A882"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  fill="none"
                  stroke="#C4A882"
                  strokeWidth="0.5"
                />
                {/* Crosshair lines */}
                <line x1="48" y1="12" x2="48" y2="22" stroke="#C4A882" strokeWidth="0.8" />
                <line x1="48" y1="74" x2="48" y2="84" stroke="#C4A882" strokeWidth="0.8" />
                <line x1="12" y1="48" x2="22" y2="48" stroke="#C4A882" strokeWidth="0.8" />
                <line x1="74" y1="48" x2="84" y2="48" stroke="#C4A882" strokeWidth="0.8" />
                {/* Text paths */}
                <path
                  id="stamp-arc-top"
                  d="M 10,48 A 38,38 0 0,1 86,48"
                  fill="none"
                />
                <path
                  id="stamp-arc-bot"
                  d="M 86,48 A 38,38 0 0,1 10,48"
                  fill="none"
                />
                <text
                  fontSize="7"
                  fill="#C4A882"
                  letterSpacing="3"
                  fontFamily="monospace"
                >
                  <textPath href="#stamp-arc-top" startOffset="12%">
                    RETROTEKT · STUDIO
                  </textPath>
                </text>
                <text
                  fontSize="7"
                  fill="#C4A882"
                  letterSpacing="3"
                  fontFamily="monospace"
                >
                  <textPath href="#stamp-arc-bot" startOffset="15%">
                    ESTABLISHED 2024
                  </textPath>
                </text>
                {/* Center dot */}
                <circle cx="48" cy="48" r="2.5" fill="#C4A882" />
              </svg>
            </div>

            <p
              className="mt-5 font-mono text-[9px] text-[#C4A882]/30 tracking-[0.2em] uppercase leading-loose text-left lg:text-right"
              style={{ fontFamily: "monospace" }}
            >
              3D Visualization
              <br />
              Studio · USA
            </p>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <p
              className="font-mono text-[10px] text-[#F7F0E3]/18 tracking-[0.1em]"
              style={{ fontFamily: "monospace" }}
            >
              © 2026 Retrotekt LLC
            </p>
            <span className="text-[#C4A882]/15 text-[10px]">·</span>
            <p
              className="font-mono text-[10px] text-[#F7F0E3]/15 tracking-[0.1em]"
              style={{ fontFamily: "monospace" }}
            >
              All prices USD · Subject to project scope
            </p>
          </div>
          <p
            className="font-mono text-[10px] text-[#F7F0E3]/12 tracking-[0.1em]"
            style={{ fontFamily: "monospace" }}
          >
            Contractor &amp; Remodeler Market · USA
          </p>
        </div>
      </div>
    </footer>
  );
}
