"use client";

import { useEffect, useRef, useState } from "react";
import { validators, hasErrors, type FieldError } from "@/lib/validate";

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
    <p role="alert" className="font-body text-[11px] text-red-400 mt-1.5">
      {error}
    </p>
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function ConsultingClient() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Observes multiple .reveal elements and adds .revealed when they enter viewport.
  // CSS in globals.css drives the actual fade-up transition (opacity + translateY).
  // useInView is not used here because it only tracks a single element.
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

  const [form, setForm] = useState<MessageForm>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    email: null,
    message: null,
  });

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

  if (sent) {
    return (
      <main className="bg-primary pt-24 md:pt-32 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 border border-[#C4A882]/40 rounded-full flex items-center justify-center mx-auto mb-10">
            <span className="text-[#C4A882] text-3xl">✓</span>
          </div>
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-[#F7F0E3] mb-6">
            Message Sent.
          </h2>
          <p className="font-body text-[16px] text-[#F7F0E3]/60 leading-relaxed mb-10">
            We&apos;ve received your inquiry and will respond within 24 hours with a custom quote.
          </p>
          <button
            onClick={() => setSent(false)}
            className="group inline-flex items-center gap-4 px-6 py-[14px] rounded-[3px] border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35 transition-colors duration-300"
          >
            <div className="w-8 h-[1.5px] bg-[#C4A882]/60 group-hover:w-16 group-hover:bg-[#C4A882] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="font-body font-medium text-[12px] tracking-[0.3em] uppercase text-[#F7F0E3]/70 group-hover:text-[#F7F0E3] transition-colors duration-300">Submit Another</span>
          </button>
        </div>
      </main>
    );
  }

  const inputCls =
    "w-full bg-transparent border-b border-[#F7F0E3]/15 px-2 py-4 font-body text-[16px] text-[#F7F0E3] placeholder:text-[#F7F0E3]/25 focus:border-[#C4A882] focus:outline-none transition-colors duration-300";

  const labelCls =
    "block font-body text-[11px] tracking-[0.3em] uppercase text-[#F7F0E3]/50 mb-1";

  return (
    <main ref={pageRef} className="bg-primary text-[#F7F0E3] min-h-screen">
      {/* ── Hero & Intro ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-[#F7F0E3]/10">
        <div className="absolute inset-0 pointer-events-none opacity-5">
            <svg width="100%" height="100%" className="mix-blend-overlay">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
        
        <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <div className="h-px w-12 bg-[#C4A882]/50" />
                    <span className="font-body text-[11px] tracking-[0.4em] uppercase text-[#C4A882]">Start a Project</span>
                </div>
                <h1 className="reveal font-heading text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-[-0.03em] text-[#F7F0E3]">
                    Pre-Sell<br/>
                    <span className="text-[#C4A882] italic font-serif opacity-90 pr-2">the</span>Unbuilt.
                </h1>
                <p className="reveal reveal-delay-1 font-body text-[clamp(1.1rem,2vw,1.4rem)] text-[#F7F0E3]/60 max-w-2xl mt-10 leading-[1.6]">
                    Next-Level Architectural Visualization Consulting for Developers & Contractors. 
                    We operate globally to give you an unfair advantage. 
                </p>
            </div>
            
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-end lg:pl-10 lg:border-l border-[#F7F0E3]/10">
                 <div className="reveal reveal-delay-2 p-8 md:p-10 bg-[#F7F0E3]/[0.03] border border-[#F7F0E3]/10 rounded-sm">
                    <p className="font-heading text-2xl text-[#C4A882] mb-6">The Retrotekt Advantage</p>
                    <ul className="flex flex-col gap-5">
                        <li className="flex items-start gap-4">
                            <span className="text-[#C4A882] mt-1">✦</span>
                            <p className="font-body text-[14px] text-[#F7F0E3]/70 leading-relaxed">
                                Up to <strong className="text-[#F7F0E3] font-medium">60% leaner</strong> than comparable US rates
                            </p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-[#C4A882] mt-1">✦</span>
                            <p className="font-body text-[14px] text-[#F7F0E3]/70 leading-relaxed">
                                Lightning-fast <strong className="text-[#F7F0E3] font-medium">3–5 day</strong> standard delivery
                            </p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-[#C4A882] mt-1">✦</span>
                            <p className="font-body text-[14px] text-[#F7F0E3]/70 leading-relaxed">
                                Generous revision rounds included out of the box
                            </p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-[#C4A882] mt-1">✦</span>
                            <p className="font-body text-[14px] text-[#F7F0E3]/70 leading-relaxed">
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
      <section className="border-b border-[#F7F0E3]/10 py-10 overflow-hidden bg-[#F7F0E3]/[0.02]">
        <div className="flex gap-16 md:gap-32 w-max px-6 animate-[ticker-scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-16 md:gap-32 flex-nowrap shrink-0">
                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-4xl md:text-5xl text-[#C4A882]">3×</span>
                        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-[#F7F0E3]/50">Faster Approvals</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-4xl md:text-5xl text-[#C4A882]">40%</span>
                        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-[#F7F0E3]/50">More Bids Won</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-4xl md:text-5xl text-[#C4A882]">5–7×</span>
                        <span className="font-body text-[12px] uppercase tracking-[0.2em] text-[#F7F0E3]/50">ROI Per Render</span>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* ── Form Section ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* LEFT: Context */}
            <div className="lg:col-span-5 flex flex-col gap-12 reveal">
                <div>
                    <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] tracking-[-0.02em] text-[#F7F0E3] mb-6">
                        Stop Leaving<br/>Money on<br/>The Table.
                    </h2>
                    <p className="font-body text-[15px] text-[#F7F0E3]/60 leading-relaxed max-w-md">
                        We turn blueprints into your most powerful sales asset. Tell us what you&apos;re building, and we&apos;ll engineer the visuals that close the deal.
                    </p>
                </div>

                <div className="h-px bg-[#F7F0E3]/10 w-full" />

                <div>
                    <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#C4A882] mb-6">Direct Connect</p>
                    <div className="flex flex-col gap-6">
                        <a href="mailto:shahan@retrotekt.com" className="group flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-[#F7F0E3]/15 flex items-center justify-center group-hover:border-[#C4A882] group-hover:bg-[#C4A882]/10 transition-all duration-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#F7F0E3]/50 group-hover:text-[#C4A882] transition-colors">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M2 7l10 7 10-7" />
                                </svg>
                            </div>
                            <span className="font-body text-[15px] text-[#F7F0E3]/70 group-hover:text-[#F7F0E3] transition-colors">shahan@retrotekt.com</span>
                        </a>
                        <a href="https://wa.me/14406408735" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-[#F7F0E3]/15 flex items-center justify-center group-hover:border-[#C4A882] group-hover:bg-[#C4A882]/10 transition-all duration-300">
                                <span className="text-[#F7F0E3]/50 group-hover:text-[#C4A882] transition-colors">
                                    <IconWhatsApp />
                                </span>
                            </div>
                            <span className="font-body text-[15px] text-[#F7F0E3]/70 group-hover:text-[#F7F0E3] transition-colors">WhatsApp Direct Line</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* RIGHT: Form */}
            <div className="lg:col-span-7 reveal reveal-delay-1">
                <div className="bg-[#F7F0E3]/[0.02] border border-[#F7F0E3]/10 p-8 md:p-14 lg:p-16 rounded-md shadow-2xl">
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
                                    className={`${inputCls} ${errors.name ? "border-red-400 focus:border-red-500" : ""}`}
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
                                    className={`${inputCls} ${errors.email ? "border-red-400 focus:border-red-500" : ""}`}
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
                                        <option value="" disabled className="text-primary bg-primary">Select a package…</option>
                                        {PROJECT_TYPES.map((t) => (
                                            <option key={t} value={t} className="text-primary bg-primary">{t}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#C4A882]">
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
                                        <div className={`h-[2px] transition-all duration-300 ${form.budget === b ? "w-6 bg-[#C4A882]" : "w-3 bg-[#F7F0E3]/20 group-hover:w-6 group-hover:bg-[#C4A882]/60"}`} />
                                        <span className={`font-body text-[12px] tracking-[0.1em] uppercase transition-colors duration-300 ${form.budget === b ? "text-[#C4A882]" : "text-[#F7F0E3]/40 group-hover:text-[#F7F0E3]/80"}`}>{b}</span>
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
                                className={`${inputCls} resize-none pt-4 pb-2 ${errors.message ? "border-red-400 focus:border-red-500" : ""}`}
                                placeholder="Describe your project — space type, style, references, timeline…"
                            />
                            <div className="flex items-start justify-between gap-4 mt-2">
                                <FieldErrorMsg error={errors.message} />
                                <p className="font-body text-[11px] text-[#F7F0E3]/30 shrink-0 ml-auto">{form.message.length}/5000</p>
                            </div>
                        </div>

                        {submitError && (
                          <p role="alert" className="font-body text-[12px] text-red-400 -mt-4">
                            {submitError}
                          </p>
                        )}

                        <div className="pt-6 border-t border-[#F7F0E3]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <button
                                type="submit"
                                disabled={sending}
                                className="group w-full sm:w-auto inline-flex justify-center items-center gap-4 px-8 py-4 bg-[#C4A882] hover:bg-[#b39771] text-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="font-body font-bold text-[12px] tracking-[0.3em] uppercase">
                                    {sending ? "Sending…" : "Submit Inquiry"}
                                </span>
                            </button>
                            <p className="font-body text-[12px] text-[#F7F0E3]/40 text-center sm:text-right max-w-[200px]">
                                We hit the ground running and respond within hours.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
