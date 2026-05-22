import Link from "next/link";
import Image from "next/image";

const MARQUEE_ITEMS = Array.from({ length: 4 });

const FOOTER_LINKS = [
  { label: "Still Renders", href: "/services#renders", num: "DWG-01" },
  { label: "Walkthroughs", href: "/services#walkthroughs", num: "DWG-02" },
  { label: "Floor Plans", href: "/services#floor-plans", num: "DWG-03" },
  { label: "Portfolio", href: "/portfolio", num: "DWG-04" },
  { label: "Consulting", href: "/consulting", num: "DWG-05" },
];

export default function Footer() {

  return (
    <footer
      className="relative overflow-hidden px-[var(--frame-strip)]"
      style={{
        background: "#D9CCBA",
        borderRadius: "2.5rem 2.5rem 0 0",
      }}
      aria-label="Site footer"
    >
      {/* ── Running marquee — outside dark container so curves are visible ── */}
      <Link
        href="/consulting"
        className="group relative z-10 block overflow-hidden cursor-pointer"
        style={{
          background: "#D9CCBA",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          maskImage: "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        }}
        aria-label="Ready to move faster? Start a project"
      >
        <span className="sr-only">Ready to move faster? Start a project.</span>
        {/* Hover Accent */}
        <div className="absolute inset-0 bg-[#C49A6C] opacity-0 group-hover:opacity-25 blur-[30px] transition-opacity duration-700 pointer-events-none" />

        {/* Faint moving light sweep */}
        <div 
          className="absolute inset-y-0 left-0 w-1/2 bg-white pointer-events-none"
          style={{
            mixBlendMode: "screen",
            opacity: 0.03,
            filter: "blur(80px)",
            animation: "footer-sweep 20s linear infinite"
          }}
        />

        <div
          className="footer-marquee-track flex relative z-10 group-hover:[animation-play-state:paused]"
          aria-hidden="true"
          style={{ animation: "footer-marquee 16s linear infinite" }}
        >
          {[0, 1].map((segment) => (
            <div key={segment} className="flex shrink-0">
              {MARQUEE_ITEMS.map((_, i) => (
                <span
                  key={`${segment}-${i}`}
                  className="whitespace-nowrap flex-shrink-0 flex items-center font-heading"
                  style={{
                    fontWeight: 300,
                    fontSize: "clamp(1.8rem, 4vw, 3.4rem)",
                    letterSpacing: "-0.01em",
                    wordSpacing: "-0.05em",
                    color: "#1A1008",
                    paddingRight: "clamp(1rem, 2.5vw, 2.5rem)",
                  }}
                >
                  Ready to move faster?
                  <span style={{ color: "#8A7055", margin: "0 clamp(0.6rem,1.2vw,1.2rem)", fontSize: "0.5em", opacity: 0.6 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes footer-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .footer-marquee-track {
            width: max-content;
            will-change: transform;
            backface-visibility: hidden;
            transform: translate3d(0, 0, 0);
          }
          @keyframes footer-sweep {
            from { transform: translateX(-200%); }
            to   { transform: translateX(300%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .footer-marquee-track {
              animation-play-state: paused !important;
            }
          }
        `}</style>
      </Link>

      {/* ── Inner dark container — rounded top corners visible against cream ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "#1A1008", borderRadius: "1.25rem 1.25rem 0 0" }}
      >

        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" className="opacity-[0.045]">
            <defs>
              <pattern id="footer-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C4A882" strokeWidth="0.5" />
              </pattern>
              <pattern id="footer-grid-major" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
                <path d="M 400 0 L 0 0 0 400" fill="none" stroke="#C4A882" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-grid)" />
            <rect width="100%" height="100%" fill="url(#footer-grid-major)" />
          </svg>
        </div>

        {/* Animated scan line */}
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-x-0"
            style={{
              height: "120px",
              background: "linear-gradient(180deg, transparent 0%, rgba(196,168,130,0.025) 50%, transparent 100%)",
              animation: "footer-scan 11s linear infinite",
            }}
          />
        </div>

        {/* Grain texture */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay" aria-hidden="true">
          <filter id="footer-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#footer-noise)" />
        </svg>

        {/* Coordinate labels */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <span className="absolute bottom-4 left-10 font-mono text-[9px] text-[#C4A882] opacity-30 tracking-widest" style={{ fontFamily: "var(--font-geist-sans)" }}>
            REV.2026.A
          </span>
          <span className="absolute bottom-4 right-10 font-mono text-[9px] text-[#C4A882] opacity-30 tracking-widest" style={{ fontFamily: "var(--font-geist-sans)" }}>
            SCALE 1:1
          </span>
        </div>

        {/* Massive background wordmark */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none" aria-hidden="true" style={{ lineHeight: 0.85 }}>
          <p
            className="font-heading font-bold tracking-[-0.04em] text-[#C4A882] whitespace-nowrap"
            style={{ fontSize: "clamp(5rem, 14vw, 14rem)", opacity: 0.08 }}
          >
            RETROTEKT.
          </p>
        </div>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-8">

            {/* Brand block */}
            <div className="lg:col-span-5">
              <Link href="/" className="inline-block mb-3 group" aria-label="Retrotekt home">
                <Image
                  src="/logo-mark.png"
                  alt="Retrotekt"
                  width={44}
                  height={44}
                  className="h-11 w-auto object-contain brightness-0 invert opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.45)]" />
                <span className="font-mono text-[12px] tracking-[0.22em] uppercase text-emerald-400/80" style={{ fontFamily: "var(--font-geist-sans)" }}>
                  Active for Q2 2026
                </span>
              </div>

              <p className="font-body text-[15px] leading-[1.9] text-[#F7F0E3]/40 max-w-[300px] mb-6">
                Photorealistic 3D architectural visualizations built for the contractors and remodelers who refuse to sell blind.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="mailto:shahan@retrotekt.com"
                  className="group flex items-center gap-3.5 w-fit px-4 py-2.5 rounded-sm border border-[#C4A882]/20 hover:border-[#C4A882]/60 hover:bg-[rgba(196,168,130,0.08)] transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C4A882]/65 group-hover:text-[#C4A882] transition-colors duration-300 flex-shrink-0">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="font-body text-[13px] text-[#F7F0E3]/70 group-hover:text-[#F7F0E3] transition-colors duration-300 tracking-wide">
                    shahan@retrotekt.com
                  </span>
                </a>
                <a
                  href="https://wa.me/14406408735"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 w-fit px-4 py-2.5 rounded-sm border border-[#C4A882]/20 hover:border-[#C4A882]/60 hover:bg-[rgba(196,168,130,0.08)] transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#C4A882]/65 group-hover:text-[#C4A882] transition-colors duration-300 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="font-body text-[13px] text-[#F7F0E3]/70 group-hover:text-[#F7F0E3] transition-colors duration-300 tracking-wide">
                    WhatsApp Direct Line
                  </span>
                </a>
              </div>
            </div>

            {/* Drawing Index */}
            <div className="lg:col-span-3 lg:col-start-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-6 bg-[#C4A882]/30" />
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#C4A882]/40" style={{ fontFamily: "var(--font-geist-sans)" }}>
                  Drawing Index
                </p>
              </div>
              <ul className="flex flex-col gap-0">
                {FOOTER_LINKS.map(({ label, href, num }) => (
                  <li key={href}>
                    <Link href={href} className="group flex items-center justify-between py-2.5 hover:pl-2 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-[#C4A882]/25 group-hover:text-[#C4A882]/50 transition-colors duration-300 w-14 flex-shrink-0" style={{ fontFamily: "var(--font-geist-sans)" }}>
                          {num}
                        </span>
                        <span className="font-body text-[13px] text-[#F7F0E3]/50 group-hover:text-[#F7F0E3] transition-colors duration-300">
                          {label}
                        </span>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#C4A882]/20 group-hover:text-[#C4A882]/60 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Studio stamp */}
            <div className="lg:col-span-2 lg:col-start-11 flex flex-col items-start lg:items-end">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-6 bg-[#C4A882]/30" />
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#C4A882]/40" style={{ fontFamily: "var(--font-geist-sans)" }}>
                  Studio
                </p>
              </div>

              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 96 96" className="w-full h-full opacity-30">
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#C4A882" strokeWidth="0.8" strokeDasharray="2 4" />
                  <circle cx="48" cy="48" r="36" fill="none" stroke="#C4A882" strokeWidth="0.5" />
                  <line x1="48" y1="12" x2="48" y2="22" stroke="#C4A882" strokeWidth="0.8" />
                  <line x1="48" y1="74" x2="48" y2="84" stroke="#C4A882" strokeWidth="0.8" />
                  <line x1="12" y1="48" x2="22" y2="48" stroke="#C4A882" strokeWidth="0.8" />
                  <line x1="74" y1="48" x2="84" y2="48" stroke="#C4A882" strokeWidth="0.8" />
                  <path id="stamp-arc-top" d="M 10,48 A 38,38 0 0,1 86,48" fill="none" />
                  <path id="stamp-arc-bot" d="M 86,48 A 38,38 0 0,1 10,48" fill="none" />
                  <text fontSize="9" fill="#C4A882" letterSpacing="3" fontFamily="var(--font-geist-sans)">
                    <textPath href="#stamp-arc-top" startOffset="12%">RETROTEKT · STUDIO</textPath>
                  </text>
                  <text fontSize="9" fill="#C4A882" letterSpacing="3" fontFamily="var(--font-geist-sans)">
                    <textPath href="#stamp-arc-bot" startOffset="15%">ESTABLISHED 2024</textPath>
                  </text>
                  <circle cx="48" cy="48" r="2.5" fill="#C4A882" />
                </svg>
              </div>

              <p className="mt-4 font-mono text-[11px] text-[#C4A882]/30 tracking-[0.2em] uppercase leading-loose text-left lg:text-right" style={{ fontFamily: "var(--font-geist-sans)" }}>
                3D Visualization
                <br />
                Studio · USA
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-6">
              <p className="font-mono text-[12px] text-[#F7F0E3]/18 tracking-[0.1em]" style={{ fontFamily: "var(--font-geist-sans)" }}>
                © 2026 Retrotekt LLC
              </p>
              <span className="text-[#C4A882]/15 text-[12px]">·</span>
              <p className="font-mono text-[12px] text-[#F7F0E3]/15 tracking-[0.1em]" style={{ fontFamily: "var(--font-geist-sans)" }}>
                All prices USD · Subject to project scope
              </p>
            </div>
            <p className="font-mono text-[12px] text-[#F7F0E3]/12 tracking-[0.1em]" style={{ fontFamily: "var(--font-geist-sans)" }}>
              Contractor &amp; Remodeler Market · USA
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
