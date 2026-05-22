"use client";

import { useEffect, useRef, useState } from "react";
import { validators, hasErrors, type FieldError } from "@/lib/validate";

const SHOW_WOW = true;

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconWhatsApp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function SelectChevron() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FieldErrorMsg({ error }: { error: FieldError }) {
  if (!error) return null;
  return (
    <p role="alert" className="font-body text-[11px] text-red-500 mt-1.5">
      {error}
    </p>
  );
}

// ── Hero Flourish — Animated isometric architectural blueprint ─────────────

function HeroFlourish() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      const svg = svgRef.current;
      if (!svg) return;

      const paths = svg.querySelectorAll<SVGPathElement | SVGLineElement | SVGRectElement | SVGPolygonElement>("path, line, rect, polygon");
      paths.forEach((p) => {
        const len = (p as SVGGeometryElement).getTotalLength?.() ?? 200;
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      });

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

          tl.to(paths, {
            strokeDashoffset: 0,
            duration: 2.4,
            stagger: 0.08,
          });

          tl.to(svg, {
            y: 4,
            duration: 6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }, ">");
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          paths.forEach((p) => { p.style.strokeDashoffset = "0"; });
        });
      }, svg);
    });

    return () => { ctx?.revert(); };
  }, []);

  return (
    <div className="pointer-events-none absolute right-0 top-0 h-full w-[55%] overflow-hidden select-none z-0" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 600 700"
        fill="none"
        preserveAspectRatio="xMaxYMid meet"
        className="absolute right-[-60px] top-0 h-full w-full"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Isometric building — footprint base */}
        <polygon
          points="300,420 480,320 480,200 300,300"
          stroke="#A8843C" strokeWidth="0.9" strokeOpacity="0.30" fill="none"
        />
        <polygon
          points="300,420 120,320 120,200 300,300"
          stroke="#A8843C" strokeWidth="0.9" strokeOpacity="0.22" fill="none"
        />
        <polygon
          points="120,200 300,100 480,200 300,300"
          stroke="#A8843C" strokeWidth="1.1" strokeOpacity="0.35" fill="none"
        />

        {/* Roof ridge */}
        <line x1="300" y1="100" x2="300" y2="300" stroke="#A8843C" strokeWidth="0.7" strokeOpacity="0.25" />

        {/* Interior floor partition — left face */}
        <line x1="120" y1="275" x2="300" y2="375" stroke="#A8843C" strokeWidth="0.6" strokeOpacity="0.18" />
        <line x1="120" y1="250" x2="300" y2="350" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.12" />

        {/* Interior floor partition — right face */}
        <line x1="300" y1="375" x2="480" y2="275" stroke="#A8843C" strokeWidth="0.6" strokeOpacity="0.18" />
        <line x1="300" y1="350" x2="480" y2="250" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.12" />

        {/* Vertical corner columns */}
        <line x1="120" y1="200" x2="120" y2="320" stroke="#A8843C" strokeWidth="1.0" strokeOpacity="0.28" />
        <line x1="480" y1="200" x2="480" y2="320" stroke="#A8843C" strokeWidth="1.0" strokeOpacity="0.28" />
        <line x1="300" y1="300" x2="300" y2="420" stroke="#A8843C" strokeWidth="1.0" strokeOpacity="0.28" />

        {/* Window openings — right face */}
        <rect x="370" y="230" width="50" height="38" stroke="#A8843C" strokeWidth="0.7" strokeOpacity="0.22" fill="none" />
        <line x1="395" y1="230" x2="395" y2="268" stroke="#A8843C" strokeWidth="0.4" strokeOpacity="0.15" />

        {/* Window openings — left face */}
        <rect x="168" y="240" width="45" height="35" stroke="#A8843C" strokeWidth="0.7" strokeOpacity="0.18" fill="none" />
        <line x1="190" y1="240" x2="190" y2="275" stroke="#A8843C" strokeWidth="0.4" strokeOpacity="0.13" />

        {/* Door — left face */}
        <rect x="230" y="350" width="30" height="42" stroke="#A8843C" strokeWidth="0.7" strokeOpacity="0.20" fill="none" />

        {/* Ground plane perspective lines */}
        <line x1="120" y1="320" x2="60" y2="380" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.12" />
        <line x1="480" y1="320" x2="540" y2="380" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.12" />
        <line x1="300" y1="420" x2="300" y2="480" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.12" />
        <line x1="60" y1="380" x2="300" y2="480" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.10" />
        <line x1="540" y1="380" x2="300" y2="480" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.10" />

        {/* Dimension annotation lines */}
        <line x1="100" y1="200" x2="100" y2="320" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.18" />
        <line x1="96" y1="200" x2="104" y2="200" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.18" />
        <line x1="96" y1="320" x2="104" y2="320" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.18" />
        <text x="84" y="265" fill="#A8843C" fillOpacity="0.22" fontSize="9" fontFamily="monospace" letterSpacing="1">24&apos;-0&quot;</text>

        {/* Crosshair registration mark */}
        <circle cx="300" cy="300" r="4" stroke="#A8843C" strokeWidth="0.7" strokeOpacity="0.20" fill="none" />
        <line x1="300" y1="288" x2="300" y2="312" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.18" />
        <line x1="288" y1="300" x2="312" y2="300" stroke="#A8843C" strokeWidth="0.5" strokeOpacity="0.18" />

        {/* Fine guide grid — background plane */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`gh${i}`} x1={60} y1={140 + i * 40} x2={540} y2={140 + i * 40} stroke="#A8843C" strokeWidth="0.3" strokeOpacity="0.05" />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`gv${i}`} x1={60 + i * 40} y1={140} x2={60 + i * 40} y2={500} stroke="#A8843C" strokeWidth="0.3" strokeOpacity="0.05" />
        ))}

        {/* Title block */}
        <rect x="400" y="560" width="160" height="70" stroke="#A8843C" strokeWidth="0.6" strokeOpacity="0.18" fill="none" />
        <line x1="400" y1="580" x2="560" y2="580" stroke="#A8843C" strokeWidth="0.4" strokeOpacity="0.14" />
        <text x="480" y="575" fill="#A8843C" fillOpacity="0.20" fontSize="7" fontFamily="monospace" letterSpacing="2" textAnchor="middle">RETROTEKT STUDIO</text>
        <text x="480" y="598" fill="#A8843C" fillOpacity="0.16" fontSize="6" fontFamily="monospace" letterSpacing="1" textAnchor="middle">ARCHITECTURAL VIZ</text>
        <text x="480" y="614" fill="#A8843C" fillOpacity="0.13" fontSize="6" fontFamily="monospace" letterSpacing="1" textAnchor="middle">SCALE 1:100</text>
      </svg>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  "Still Renders — Starter (1–2 images)",
  "Still Renders — Deal Closer (3–5 images)",
  "Still Renders — Full Project (6–10 images)",
  "Walkthrough Animation",
  "Floor Plan Render",
  "Aerial View",
  "Full Package (Renders + Animation)",
  "Not sure yet",
];

const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
];

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageForm = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
};

type FormErrors = {
  name: FieldError;
  email: FieldError;
  message: FieldError;
};

const EMPTY_FORM: MessageForm = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  message: "",
};

const EMPTY_ERRORS: FormErrors = { name: null, email: null, message: null };

// ── Component ─────────────────────────────────────────────────────────────────

export default function ConsultingClient() {
  const pageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Scroll reveal — observes .reveal elements and adds .revealed on viewport entry
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
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Cursor-tracked radial glow — writes to CSS vars via rAF to avoid re-renders
  useEffect(() => {
    let pending = false;
    let nx = 0, ny = 0;
    const flush = () => {
      pending = false;
      const el = glowRef.current;
      if (el) {
        el.style.setProperty("--mx", `${nx}px`);
        el.style.setProperty("--my", `${ny}px`);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      nx = e.pageX; ny = e.pageY;
      if (!pending) { pending = true; requestAnimationFrame(flush); }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [form, setForm] = useState<MessageForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: keyof MessageForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      message: validators.message(form.message),
    };
    setErrors(newErrors);
    if (hasErrors(newErrors)) return;

    setSending(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name.trim(),
          email:       form.email.trim(),
          company:     form.company.trim() || undefined,
          projectType: form.projectType || undefined,
          budget:      form.budget || undefined,
          message:     form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Submission failed. Please try again.');
      }

      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-b border-primary/15 px-2 py-4 font-body text-[16px] text-primary placeholder:text-primary/25 focus:border-[#A8843C] focus:outline-none transition-colors duration-300";

  const labelCls =
    "block font-body text-[11px] tracking-[0.3em] uppercase text-primary/50 mb-1";

  return (
    <main ref={pageRef} className="bg-[#F7F0E3] text-primary min-h-screen overflow-hidden relative rounded-b-[2.5rem]">

      {/* Cursor-tracked gold glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(168,132,60,0.28), transparent 55%)"
        }}
        aria-hidden="true"
      />

      {/* Noise grain overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-multiply z-0" aria-hidden="true">
        <filter id="consulting-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#consulting-noise)" />
      </svg>

      {/* ── Hero & Intro ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-primary/10">
        {SHOW_WOW && <HeroFlourish />}

        <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <div className="h-px w-12 bg-[#A8843C]/50" />
                    <span className="font-body text-[11px] tracking-[0.4em] uppercase text-[#A8843C]">Start a Project</span>
                </div>
                <h1 className="reveal font-heading text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.9] tracking-[-0.03em] text-primary">
                    Pre-Sell<br/>
                    <span className="text-[#A8843C] italic font-serif opacity-90 pr-2">the</span>Unbuilt.
                </h1>
                <p className="reveal reveal-delay-1 font-body text-[clamp(1.1rem,2vw,1.4rem)] text-primary/60 max-w-2xl mt-10 leading-[1.6]">
                    Next-Level Architectural Visualization Consulting for Developers & Contractors.
                    We operate globally to give you an unfair advantage.
                </p>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-end lg:pl-10 lg:border-l border-primary/10">
                 <div className="reveal reveal-delay-2 p-8 md:p-10 bg-primary/[0.03] border border-primary/10 rounded-sm">
                    <p className="font-heading text-2xl text-[#A8843C] mb-6">The Retrotekt Advantage</p>
                    <ul className="flex flex-col gap-5">
                        <li className="flex items-start gap-4">
                            <span className="text-[#A8843C] mt-1">✦</span>
                            <p className="font-body text-[14px] text-primary/70 leading-relaxed">
                                Up to <strong className="text-primary font-medium">60% leaner</strong> than comparable US rates
                            </p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-[#A8843C] mt-1">✦</span>
                            <p className="font-body text-[14px] text-primary/70 leading-relaxed">
                                Lightning-fast <strong className="text-primary font-medium">3–5 day</strong> standard delivery
                            </p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-[#A8843C] mt-1">✦</span>
                            <p className="font-body text-[14px] text-primary/70 leading-relaxed">
                                Generous revision rounds included out of the box
                            </p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-[#A8843C] mt-1">✦</span>
                            <p className="font-body text-[14px] text-primary/70 leading-relaxed">
                                100% custom-scoped for your exact blueprint
                            </p>
                        </li>
                    </ul>
                 </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Marquee ──────────────────────────────────────────────────────── */}
      <section className="border-b border-primary/10 py-10 overflow-hidden bg-primary/[0.03]" aria-label="Results: 3x faster approvals, 40 percent more bids won, and 5 to 7 times ROI per render.">
        <span className="sr-only">Results: 3x faster approvals, 40 percent more bids won, and 5 to 7 times ROI per render.</span>
        <div className="flex w-max px-6 animate-[ticker-scroll_40s_linear_infinite] hover:[animation-play-state:paused]" aria-hidden="true">
            {[0, 1].map((segment) => (
                <div key={segment} className="flex gap-16 md:gap-32 flex-nowrap shrink-0">
                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-4xl md:text-5xl text-[#A8843C]">3×</span>
                        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-primary/50">Faster Approvals</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-4xl md:text-5xl text-[#A8843C]">40%</span>
                        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-primary/50">More Bids Won</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-4xl md:text-5xl text-[#A8843C]">5–7×</span>
                        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-primary/50">ROI Per Render</span>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* ── Form Section ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

            {/* LEFT: Context */}
            <div className="lg:col-span-5 flex flex-col gap-12 reveal">
                <div>
                    <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] tracking-[-0.02em] text-primary mb-6">
                        Stop Leaving<br/>Money on<br/>The Table.
                    </h2>
                    <p className="font-body text-[15px] text-primary/60 leading-relaxed max-w-md">
                        We turn blueprints into your most powerful sales asset. Tell us what you&apos;re building, and we&apos;ll engineer the visuals that close the deal.
                    </p>
                </div>

                <div className="h-px bg-primary/10 w-full" />

                <div>
                    <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#A8843C] mb-6">Direct Connect</p>
                    <div className="flex flex-col gap-6">
                        <a href="mailto:shahan@retrotekt.com" className="group flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-primary/15 flex items-center justify-center group-hover:border-[#A8843C] group-hover:bg-[#A8843C]/10 transition-all duration-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50 group-hover:text-[#A8843C] transition-colors">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M2 7l10 7 10-7" />
                                </svg>
                            </div>
                            <span className="font-body text-[15px] text-primary/70 group-hover:text-primary transition-colors">shahan@retrotekt.com</span>
                        </a>
                        <a href="https://wa.me/14406408735" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-primary/15 flex items-center justify-center group-hover:border-[#A8843C] group-hover:bg-[#A8843C]/10 transition-all duration-300">
                                <span className="text-primary/50 group-hover:text-[#A8843C] transition-colors">
                                    <IconWhatsApp />
                                </span>
                            </div>
                            <span className="font-body text-[15px] text-primary/70 group-hover:text-primary transition-colors">WhatsApp Direct Line</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* RIGHT: Form card or success */}
            <div className="lg:col-span-7 reveal reveal-delay-1">
                <div className="bg-white/50 border border-primary/10 p-8 md:p-14 lg:p-16 rounded-md shadow-2xl shadow-primary/5">
                    {sent ? (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 border border-[#A8843C]/40 rounded-full flex items-center justify-center mx-auto mb-10">
                          <span className="text-[#A8843C] text-3xl">✓</span>
                        </div>
                        <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-primary mb-6">
                          Message Sent.
                        </h2>
                        <p className="font-body text-[16px] text-primary/60 leading-relaxed mb-10">
                          We&apos;ve received your inquiry and will respond within 24 hours with a custom quote.
                        </p>
                        <button
                          onClick={() => {
                            setSent(false);
                            setForm(EMPTY_FORM);
                            setErrors(EMPTY_ERRORS);
                            setSubmitError(null);
                          }}
                          className="group inline-flex items-center gap-4 px-6 py-[14px] rounded-[3px] border border-[#A8843C]/20 bg-primary/[0.04] hover:bg-primary/[0.08] hover:border-[#A8843C]/35 transition-colors duration-300"
                        >
                          <div className="w-8 h-[1.5px] bg-[#A8843C]/60 group-hover:w-16 group-hover:bg-[#A8843C] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                          <span className="font-body font-medium text-[12px] tracking-[0.3em] uppercase text-primary/70 group-hover:text-primary transition-colors duration-300">Submit Another</span>
                        </button>
                      </div>
                    ) : (
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

                        {/* Intro Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                                <label htmlFor="name" className={labelCls}>Your Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    onBlur={() => setErrors((prev) => ({ ...prev, name: validators.name(form.name) }))}
                                    className={`${inputCls} ${errors.name ? "border-red-500 focus:border-red-600" : ""}`}
                                    placeholder="John Smith"
                                />
                                <FieldErrorMsg error={errors.name} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className={labelCls}>Email Address *</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    onBlur={() => setErrors((prev) => ({ ...prev, email: validators.email(form.email) }))}
                                    className={`${inputCls} ${errors.email ? "border-red-500 focus:border-red-600" : ""}`}
                                    placeholder="john@company.com"
                                />
                                <FieldErrorMsg error={errors.email} />
                            </div>
                        </div>

                        {/* Detail Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                                <label htmlFor="company" className={labelCls}>Company</label>
                                <input
                                    id="company"
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => update("company", e.target.value)}
                                    className={inputCls}
                                    placeholder="Your firm or company"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="projectType" className={labelCls}>Project Type</label>
                                <div className="relative">
                                    <select
                                        id="projectType"
                                        value={form.projectType}
                                        onChange={(e) => update("projectType", e.target.value)}
                                        className={`${inputCls} appearance-none cursor-pointer pr-10`}
                                        style={{ backgroundColor: "transparent" }}
                                    >
                                        <option value="" disabled style={{ color: '#2C1F14', backgroundColor: '#F7F0E3' }}>Select a package…</option>
                                        {PROJECT_TYPES.map((t) => (
                                            <option key={t} value={t} style={{ color: '#2C1F14', backgroundColor: '#F7F0E3' }}>{t}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#A8843C]">
                                        <SelectChevron />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="flex flex-col gap-4">
                            <p className={labelCls}>Budget Range</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-4">
                                {BUDGETS.map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => update("budget", b)}
                                        className="group flex items-center gap-3"
                                    >
                                        <div className={`h-[2px] transition-all duration-300 ${form.budget === b ? "w-6 bg-[#A8843C]" : "w-3 bg-primary/20 group-hover:w-6 group-hover:bg-[#A8843C]/60"}`} />
                                        <span className={`font-body text-[12px] tracking-[0.1em] uppercase transition-colors duration-300 ${form.budget === b ? "text-[#A8843C]" : "text-primary/40 group-hover:text-primary/80"}`}>{b}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex flex-col">
                            <label htmlFor="message" className={labelCls}>Project Details *</label>
                            <textarea
                                id="message"
                                rows={4}
                                value={form.message}
                                onChange={(e) => update("message", e.target.value)}
                                onBlur={() => setErrors((prev) => ({ ...prev, message: validators.message(form.message) }))}
                                className={`${inputCls} resize-none pt-4 pb-2 ${errors.message ? "border-red-500 focus:border-red-600" : ""}`}
                                placeholder="Describe your project — space type, style, references, timeline…"
                            />
                            <div className="flex items-start justify-between gap-4 mt-2">
                                <FieldErrorMsg error={errors.message} />
                                <p className="font-body text-[11px] text-primary/30 shrink-0 ml-auto">{form.message.length}/5000</p>
                            </div>
                        </div>

                        {submitError && (
                          <p role="alert" className="font-body text-[12px] text-red-500 -mt-4">
                            {submitError}
                          </p>
                        )}

                        <div className="pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <button
                                type="submit"
                                disabled={sending}
                                className="group w-full sm:w-auto inline-flex justify-center items-center gap-4 px-8 py-4 bg-[#A8843C] hover:bg-[#8a6a2e] text-[#F7F0E3] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="font-body font-bold text-[12px] tracking-[0.3em] uppercase">
                                    {sending ? "Sending…" : "Submit Inquiry"}
                                </span>
                            </button>
                            <p className="font-body text-[12px] text-primary/40 text-center sm:text-right max-w-[200px]">
                                We hit the ground running and respond within hours.
                            </p>
                        </div>
                    </form>
                    )}
                </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
