"use client";

import { useEffect, useRef, useState } from "react";
import { validators, sanitize, hasErrors, type FieldError } from "@/lib/validate";

// ── SVG Icons ────────────────────────────────────────────────────────────────


function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const segments = [
  {
    emoji: "🏗️",
    label: "High-Value Builders & Designers",
    items: [
      { role: "General Contractors & Remodelers", value: "Close the trust gap and get contracts signed faster." },
      { role: "Custom Home Builders", value: "Show clients exactly what they're paying for before breaking ground." },
      { role: "Interior Designers & Architects", value: "Bring mood boards to life with stunning, pitch-ready accuracy." },
    ],
  },
  {
    emoji: "🏡",
    label: "Real Estate & Property Investors",
    items: [
      { role: "Real Estate Developers", value: "Secure funding faster with immersive pre-construction investor decks." },
      { role: "Property Flippers & Airbnb Owners", value: "Elevate your listings to command premium rates." },
      { role: "Luxury Real Estate Agents", value: "Market properties before renovations are even complete." },
    ],
  },
  {
    emoji: "☕",
    label: "Commercial & B2B Brands",
    items: [
      { role: "Café, Restaurant & Retail", value: "Visualize brand identity and secure lease approvals." },
      { role: "Office Fit-out & Hospitality", value: "Present polished, corporate-grade concepts to stakeholders." },
    ],
  },
];

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

function FieldErrorMsg({ error }: { error: FieldError }) {
  if (!error) return null;
  return (
    <p role="alert" className="font-body text-[11px] text-red-600 mt-1">
      {error}
    </p>
  );
}

const INDUSTRIES_LIST = [
  "Real Estate Developer",
  "Contractor / Remodeler",
  "Interior Design",
  "Architecture",
  "Property Marketing",
  "Hospitality",
  "Other",
];

// ── Main client component ─────────────────────────────────────────────────────

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
    "w-full bg-transparent border border-[#D4C5A9] px-4 py-3 font-body text-[13px] text-primary placeholder:text-primary/30 focus:border-secondary/60 focus:outline-none transition-colors duration-200";

  return (
    <main ref={pageRef} className="bg-background">

      {/* ── Section 1: HERO ─────────────────────────────────────────────────── */}
      <section className="pt-16 md:pt-20 pb-16 md:pb-20 border-b border-[#D4C5A9]">
        <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full">
          <div className="max-w-3xl pt-8 md:pt-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="section-label">Consulting</span>
              <div className="h-px bg-[#D4C5A9] w-16 flex-shrink-0" />
            </div>
            <h1 className="reveal font-heading text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.0] tracking-[-0.025em] text-primary mb-4">
              Architectural Visualization Consulting<br />
              for Developers &amp; Contractors
            </h1>
            <p className="reveal reveal-delay-1 font-body text-[16px] text-deep leading-relaxed max-w-xl mb-8">
              We operate globally to deliver US-market quality at costs that make local studios hard to justify. Our clients save significantly — and close more deals because of it.
            </p>
            <div className="reveal reveal-delay-2">
              <a
                href="#"
                className="btn-dark inline-block bg-primary text-background px-8 py-4 font-body text-[12px] tracking-[0.14em] uppercase"
              >
                Book a Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: WHO WE PARTNER WITH ─────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20 border-b border-[#D4C5A9]">
        <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 pb-12 border-b border-[#D4C5A9]">
            <div>
              <p className="section-label mb-5">
                Who We Partner With
              </p>
              <h2
                className="reveal font-heading font-bold text-primary leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                We Don&apos;t Work<br />With Everyone.
              </h2>
            </div>
            <p className="reveal reveal-delay-1 font-body text-[15px] text-deep/60 max-w-[340px] leading-relaxed">
              We engineer visual assets for professionals who rely on speed,
              precision, and presentation to scale their businesses. If you
              build, design, or sell spaces — you are in the right place.
            </p>
          </div>

          {/* Segment columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#D4C5A9]">
            {segments.map((seg, i) => (
              <div
                key={seg.label}
                className={`reveal reveal-delay-${Math.min(i + 1, 2)} flex flex-col py-10 md:py-0 ${i > 0 ? "md:pl-12" : ""} ${i < segments.length - 1 ? "md:pr-12" : ""}`}
              >
                <div className="text-4xl mb-6">{seg.emoji}</div>
                <h3 className="font-body text-[12px] tracking-[0.18em] uppercase text-secondary mb-8 leading-snug">
                  {seg.label}
                </h3>
                <ul className="flex flex-col gap-7">
                  {seg.items.map((item) => (
                    <li key={item.role} className="relative pl-4">
                      <div className="absolute left-0 top-[6px] w-1 h-1 rounded-full bg-secondary/50" />
                      <div className="font-body text-[15px] text-primary mb-1.5 leading-snug">
                        {item.role}
                      </div>
                      <div className="font-body text-[14px] text-deep/60 leading-relaxed">
                        {item.value}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: WHY RETROTEKT ────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">

          <div className="reveal mb-10 max-w-2xl">
            <p className="section-label mb-3">Why Retrotekt</p>
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-[-0.025em] text-primary mb-4">
              Why Retrotekt Is the Smarter Choice
            </h2>
            <p className="font-body text-[15px] text-deep leading-relaxed">
              Global operations mean we pass real savings directly to you — without cutting corners on quality, speed, or communication.
            </p>
          </div>

          {/* Comparison columns */}
          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* LEFT — Traditional */}
            <div className="bg-surface border border-[#D4C5A9] p-8">
              <p className="font-body text-[13px] text-primary/40 uppercase tracking-[0.15em] mb-6">
                Traditional local studio
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  "High overhead passed to the client",
                  "Week-long or longer turnarounds",
                  "Limited revision rounds",
                  "Rigid, one-size-fits-all packages",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-[14px] text-primary/45">
                    <span className="mt-0.5 flex-shrink-0 text-primary/25 font-bold">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT — Retrotekt */}
            <div className="bg-background border border-secondary/40 p-8">
              <p className="font-body text-[13px] text-secondary font-bold uppercase tracking-[0.15em] mb-6">
                Retrotekt
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  "Up to 60% less than comparable US studio rates",
                  "3–5 day standard delivery",
                  "Multiple revision rounds included",
                  "Custom scoped for every project",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-[14px] text-primary/75">
                    <span className="mt-0.5 flex-shrink-0 text-secondary font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stat cards */}
          <h2 className="font-heading text-[clamp(1.4rem,3vw,2rem)] leading-[1.02] tracking-[-0.025em] text-primary mb-6 mt-10">
            The Numbers Behind Our Work
          </h2>
          <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { number: "3×", label: "Faster approvals" },
              { number: "40%", label: "More bids won" },
              { number: "5–7×", label: "ROI per render" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`reveal reveal-delay-${(i + 1) as 1 | 2 | 3} bg-surface border border-[#D4C5A9] p-6 text-center`}
              >
                <p className="font-heading text-5xl font-light text-primary mb-2 tracking-[-0.02em]">
                  {stat.number}
                </p>
                <p className="font-body text-[12px] text-muted uppercase tracking-[0.12em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: THREE-CHANNEL CONTACT ───────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20 border-t border-[#D4C5A9]">
        <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">

          <div className="reveal mb-10 max-w-2xl">
            <p className="section-label mb-3">Get in Touch</p>
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-[-0.025em] text-primary mb-4">
              Book a Consultation
            </h2>
            <p className="font-body text-[15px] text-deep leading-relaxed">
              Choose how you&apos;d like to connect. We respond within a few hours.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">

            {/* Option 1 — BOOK A CALL */}
            <div className="reveal flex-1 bg-background border border-[#D4C5A9] p-6 flex flex-col min-h-[340px]">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary mb-3">
                Book a Call
              </p>
              <p className="font-heading text-[22px] text-primary leading-snug mb-3">
                Free 30-min consultation
              </p>
              <p className="font-body text-[13px] text-deep leading-relaxed mb-auto">
                Schedule a free 30-min call with our team. We&apos;ll discuss your project scope, timeline, and how we can help you close more deals.
              </p>
              <a
                href="#"
                className="btn-dark mt-8 inline-block bg-primary text-background hover:bg-primary/90 px-6 py-3 font-body text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 text-center"
              >
                Schedule a Call
              </a>
            </div>

            {/* Option 2 — SEND A MESSAGE */}
            <div className="reveal reveal-delay-1 flex-1 bg-background border border-[#D4C5A9] p-6 flex flex-col">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary mb-3">
                Send a Message
              </p>
              <p className="font-heading text-[22px] text-primary leading-snug mb-3">
                We reply within a few hours
              </p>
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Name *"
                      value={form.name}
                      maxLength={100}
                      onChange={(e) => update("name", e.target.value)}
                      onBlur={() => setErrors((p) => ({ ...p, name: validators.name(form.name) }))}
                      aria-invalid={!!errors.name}
                      className={`${inputCls} ${errors.name ? "border-red-400" : ""}`}
                    />
                    <FieldErrorMsg error={errors.name} />
                  </div>
                  <div>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="Email *"
                      value={form.email}
                      maxLength={255}
                      onChange={(e) => update("email", e.target.value)}
                      onBlur={() => setErrors((p) => ({ ...p, email: validators.email(form.email) }))}
                      aria-invalid={!!errors.email}
                      className={`${inputCls} ${errors.email ? "border-red-400" : ""}`}
                    />
                    <FieldErrorMsg error={errors.email} />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder="Company (optional)"
                    value={form.company}
                    maxLength={200}
                    onChange={(e) => update("company", e.target.value)}
                    aria-invalid={!!errors.company}
                    className={`${inputCls} ${errors.company ? "border-red-400" : ""}`}
                  />
                  <FieldErrorMsg error={errors.company} />
                </div>
                <select
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer bg-background`}
                >
                  <option value="" disabled className="text-primary/30 bg-background">
                    Industry
                  </option>
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind} value={ind} className="bg-background text-primary">
                      {ind}
                    </option>
                  ))}
                </select>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project… *"
                    value={form.message}
                    maxLength={5000}
                    onChange={(e) => update("message", e.target.value)}
                    onBlur={() => setErrors((p) => ({ ...p, message: validators.message(form.message) }))}
                    aria-invalid={!!errors.message}
                    className={`${inputCls} resize-none ${errors.message ? "border-red-400" : ""}`}
                  />
                  <FieldErrorMsg error={errors.message} />
                </div>
                <button
                  type="submit"
                  className="btn-dark self-start bg-primary text-background px-6 py-3 font-body text-[11px] tracking-[0.14em] uppercase transition-all duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Option 3 — QUICK CONNECT */}
            <div className="reveal reveal-delay-2 flex-1 bg-background border border-[#D4C5A9] p-6 flex flex-col min-h-[340px]">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary mb-3">
                Quick Connect
              </p>
              <p className="font-heading text-[22px] text-primary leading-snug mb-3">
                Reach us directly
              </p>
              <p className="font-body text-[13px] text-deep leading-relaxed mb-auto">
                Prefer a direct line? Drop us a message on WhatsApp or send an email — whichever works for you.
              </p>
              <div className="flex gap-4 mt-8">
                <a
                  href="https://wa.me/NUMBER_TBD"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact via WhatsApp"
                  className="w-12 h-12 border border-[#D4C5A9] hover:border-secondary/50 flex items-center justify-center text-primary/40 hover:text-secondary transition-all duration-200"
                >
                  <IconWhatsApp />
                </a>
                <a
                  href="mailto:shahan@retrotekt.com"
                  aria-label="Send an email"
                  className="w-12 h-12 border border-[#D4C5A9] hover:border-secondary/50 flex items-center justify-center text-primary/40 hover:text-secondary transition-all duration-200"
                >
                  <IconEmail />
                </a>
              </div>
              <p className="font-body text-[11px] text-primary/30 mt-4 leading-relaxed">
                shahan@retrotekt.com
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
