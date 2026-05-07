"use client";

import { useEffect, useRef, useState } from "react";
import { validators, sanitize, hasErrors, type FieldError } from "@/lib/validate";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function SelectChevron() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1l4 4 4-4" stroke="#8C6E4B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FieldErrorMsg({ error }: { error: FieldError }) {
  if (!error) return null;
  return (
    <p role="alert" className="font-body text-[11px] text-red-600 mt-1.5">
      {error}
    </p>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const WHO_WE_WORK_WITH = [
  "General Contractors & Remodelers",
  "Custom Home Builders",
  "Real Estate Developers",
  "Interior Designers",
  "Architects",
  "Property Marketers",
  "Luxury Real Estate Agents",
  "Hospitality & Commercial Brands",
];

const TURNAROUND = [
  { label: "Custom Quote", time: "Within 24 hours" },
  { label: "Still Renders", time: "3–5 business days" },
  { label: "Rush Delivery", time: "24–48 hrs  (+50%)" },
  { label: "Walkthroughs", time: "5–7 business days" },
];

const INDUSTRIES = [
  "Real Estate Developer",
  "Contractor / Remodeler",
  "Interior Design",
  "Architecture",
  "Property Marketing",
  "Hospitality",
  "Other",
];

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageForm = {
  name: string;
  email: string;
  company: string;
  industry: string;
  message: string;
};

type FormErrors = {
  name: FieldError;
  email: FieldError;
  company: FieldError;
  message: FieldError;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ConsultingClient() {
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
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const [form, setForm] = useState<MessageForm>({
    name: "",
    email: "",
    company: "",
    industry: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    email: null,
    company: null,
    message: null,
  });

  const update = (field: keyof MessageForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      company: validators.company(form.company),
      message: validators.message(form.message),
    };
    setErrors(newErrors);
    if (hasErrors(newErrors)) return;
    const safeName = sanitize(form.name);
    const safeCompany = sanitize(form.company);
    const subject = `Consulting Inquiry from ${safeName}${safeCompany ? ` — ${safeCompany}` : ""}`;
    const body = [
      `Name: ${safeName}`,
      `Email: ${sanitize(form.email)}`,
      safeCompany ? `Company: ${safeCompany}` : "",
      form.industry ? `Industry: ${sanitize(form.industry)}` : "",
      ``,
      `Message:`,
      sanitize(form.message),
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:shahan@retrotekt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const inputCls =
    "w-full bg-transparent border border-[#D4C5A9] px-4 py-3.5 font-body text-[14px] text-primary placeholder:text-primary/25 focus:border-[#8C6E4B]/60 focus:outline-none transition-colors duration-200";

  const labelCls =
    "block font-body text-[10px] tracking-[0.3em] uppercase text-primary/40 mb-2";

  return (
    <main ref={pageRef} className="bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-24 border-b border-[#D4C5A9]">
        <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">

          {/* Section index */}
          <div className="flex items-center gap-3 mb-10">
            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/25">04</span>
            <div className="w-8 h-px bg-[#D4C5A9]" />
            <span className="section-label">Consulting &amp; Contact</span>
          </div>

          {/* Display heading */}
          <h1 className="reveal font-heading text-[clamp(3.6rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.03em] text-primary mb-10 max-w-4xl">
            Let&apos;s work<br />together.
          </h1>

          {/* Tagline + stats row */}
          <div className="reveal reveal-delay-1 flex flex-col sm:flex-row sm:items-end gap-10 sm:gap-20">
            <p className="font-body text-[15px] text-deep/60 max-w-xs leading-relaxed">
              We partner with contractors, developers, and designers who rely on speed, precision, and visualization to close more deals.
            </p>

            <div className="flex gap-8 sm:gap-12 flex-wrap">
              {[
                { num: "3×",   label: "Faster approvals" },
                { num: "40%",  label: "More bids won"    },
                { num: "5–7×", label: "ROI per render"   },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-[2.4rem] leading-none tracking-[-0.025em] text-primary">
                    {s.num}
                  </p>
                  <p className="section-label mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Body: sidebar + form ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">

            {/* ── LEFT: context sidebar ────────────────────────────────────── */}
            <aside className="lg:col-span-4 flex flex-col gap-10 reveal">

              {/* Who we work with */}
              <div>
                <p className="section-label mb-6">Who We Work With</p>
                <ul className="flex flex-col gap-2.5">
                  {WHO_WE_WORK_WITH.map((w) => (
                    <li key={w} className="flex items-start gap-3">
                      <span className="w-4 h-px bg-[#C4A882] flex-shrink-0 mt-[9px]" aria-hidden="true" />
                      <span className="font-body text-[13px] text-deep/65 leading-snug">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-[#D4C5A9]" aria-hidden="true" />

              {/* Turnaround */}
              <div>
                <p className="section-label mb-6">Turnaround</p>
                <div className="flex flex-col gap-3.5">
                  {TURNAROUND.map((t) => (
                    <div key={t.label} className="flex justify-between items-baseline gap-4">
                      <span className="font-body text-[13px] text-primary/45">{t.label}</span>
                      <span className="font-body text-[12px] text-primary/70 tabular-nums shrink-0">
                        {t.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#D4C5A9]" aria-hidden="true" />

              {/* Direct contact */}
              <div>
                <p className="section-label mb-5">Direct Contact</p>
                <a
                  href="mailto:shahan@retrotekt.com"
                  className="font-body text-[13px] text-primary hover:text-secondary transition-colors duration-200 border-b border-[#D4C5A9] hover:border-secondary/40 pb-0.5 inline-block mb-6"
                >
                  shahan@retrotekt.com
                </a>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/NUMBER_TBD"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact via WhatsApp"
                    className="w-10 h-10 border border-[#D4C5A9] hover:border-secondary/50 flex items-center justify-center text-primary/35 hover:text-secondary transition-all duration-200"
                  >
                    <IconWhatsApp />
                  </a>
                  <a
                    href="mailto:shahan@retrotekt.com"
                    aria-label="Send an email directly"
                    className="w-10 h-10 border border-[#D4C5A9] hover:border-secondary/50 flex items-center justify-center text-primary/35 hover:text-secondary transition-all duration-200"
                  >
                    <IconEmail />
                  </a>
                </div>
              </div>

              {/* Book a call — dark card */}
              <div className="bg-primary p-7">
                <p className="section-label text-[#C4A882]/70 mb-3">Book a Call</p>
                <p className="font-heading text-[1.1rem] text-background leading-snug mb-4">
                  Free 30-min consultation
                </p>
                <p className="font-body text-[13px] text-background/45 leading-relaxed mb-6">
                  Prefer to talk first? Schedule a call and we&apos;ll walk through your project scope, timeline, and pricing together.
                </p>
                <a href="#" className="group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35 transition-colors duration-300">
                  <div className="w-8 h-[1.5px] bg-background/50 group-hover:w-24 group-hover:bg-background transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                  <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-background/70 group-hover:text-background transition-colors duration-300">Schedule a Call</span>
                </a>
              </div>

            </aside>

            {/* ── RIGHT: form ──────────────────────────────────────────────── */}
            <div className="lg:col-span-8 lg:border-l lg:border-[#D4C5A9] lg:pl-16 xl:pl-20 reveal reveal-delay-1">

              <div className="mb-10">
                <p className="section-label mb-4">Send a Message</p>
                <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] leading-[0.93] tracking-[-0.025em] text-primary">
                  Tell us about<br />your project.
                </h2>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-name" className={labelCls}>Name *</label>
                    <input
                      id="c-name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Smith"
                      value={form.name}
                      maxLength={100}
                      onChange={(e) => update("name", e.target.value)}
                      onBlur={() => setErrors((p) => ({ ...p, name: validators.name(form.name) }))}
                      aria-invalid={!!errors.name}
                      className={`${inputCls} ${errors.name ? "border-red-400 focus:border-red-500" : ""}`}
                    />
                    <FieldErrorMsg error={errors.name} />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={labelCls}>Email *</label>
                    <input
                      id="c-email"
                      type="email"
                      autoComplete="email"
                      placeholder="john@company.com"
                      value={form.email}
                      maxLength={255}
                      onChange={(e) => update("email", e.target.value)}
                      onBlur={() => setErrors((p) => ({ ...p, email: validators.email(form.email) }))}
                      aria-invalid={!!errors.email}
                      className={`${inputCls} ${errors.email ? "border-red-400 focus:border-red-500" : ""}`}
                    />
                    <FieldErrorMsg error={errors.email} />
                  </div>
                </div>

                {/* Company + Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-company" className={labelCls}>Company</label>
                    <input
                      id="c-company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Your firm or company"
                      value={form.company}
                      maxLength={200}
                      onChange={(e) => update("company", e.target.value)}
                      className={`${inputCls} ${errors.company ? "border-red-400" : ""}`}
                    />
                    <FieldErrorMsg error={errors.company} />
                  </div>
                  <div>
                    <label htmlFor="c-industry" className={labelCls}>Industry</label>
                    <div className="relative">
                      <select
                        id="c-industry"
                        value={form.industry}
                        onChange={(e) => update("industry", e.target.value)}
                        className={`${inputCls} appearance-none cursor-pointer bg-background pr-10`}
                      >
                        <option value="" disabled className="text-primary/30">
                          Select your industry
                        </option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind} className="bg-background text-primary">
                            {ind}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <SelectChevron />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="c-message" className={labelCls}>Project Details *</label>
                  <textarea
                    id="c-message"
                    rows={6}
                    placeholder="Describe your project — space type, style, reference images, timeline…"
                    value={form.message}
                    maxLength={5000}
                    onChange={(e) => update("message", e.target.value)}
                    onBlur={() => setErrors((p) => ({ ...p, message: validators.message(form.message) }))}
                    aria-invalid={!!errors.message}
                    className={`${inputCls} resize-none ${errors.message ? "border-red-400 focus:border-red-500" : ""}`}
                  />
                  <div className="flex items-start justify-between gap-4 mt-1.5">
                    <FieldErrorMsg error={errors.message} />
                    <p className="font-body text-[10px] text-primary/25 shrink-0 ml-auto">
                      {form.message.length}/5000
                    </p>
                  </div>
                </div>

                {/* Submit row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-4 self-start px-5 py-[10px] rounded-[3px] border border-primary/10 bg-primary/[0.04] hover:bg-primary/[0.09] hover:border-primary/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-[1.5px] bg-primary/60 group-hover:w-24 group-hover:bg-primary transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                    <span className="font-body font-medium text-[11px] tracking-[0.3em] uppercase text-primary group-hover:text-primary transition-colors duration-300">Send Message</span>
                  </button>
                  <p className="font-body text-[11px] text-primary/30">
                    We reply within a few hours.
                  </p>
                </div>

              </form>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
