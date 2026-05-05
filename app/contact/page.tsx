"use client";

import { useState } from "react";
import { validators, sanitize, hasErrors, type FieldError } from "@/lib/validate";

type FormData = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
};

type FormErrors = {
  name: FieldError;
  email: FieldError;
  message: FieldError;
};

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

function FieldErrorMsg({ error }: { error: FieldError }) {
  if (!error) return null;
  return (
    <p role="alert" className="font-body text-[11px] text-red-600 mt-1">
      {error}
    </p>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    email: null,
    message: null,
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      message: validators.message(form.message),
    };

    setErrors(newErrors);
    if (hasErrors(newErrors)) return;

    setSending(true);

    const safeName = sanitize(form.name);
    const safeProjectType = sanitize(form.projectType);
    const subject = `Quote Request from ${safeName} — ${safeProjectType || "General Inquiry"}`;
    const body = [
      `Name: ${safeName}`,
      `Email: ${sanitize(form.email)}`,
      `Project Type: ${safeProjectType || "Not specified"}`,
      `Budget: ${sanitize(form.budget) || "Not specified"}`,
      ``,
      `Message:`,
      sanitize(form.message),
    ].join("\n");

    window.location.href = `mailto:shahan@retrotekt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <main className="bg-background pt-16 md:pt-20 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 border border-secondary/40 flex items-center justify-center mx-auto mb-8">
            <span className="text-secondary text-xl">✓</span>
          </div>
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05] text-primary mb-4">
            Your email client opened.
          </h2>
          <p className="font-body text-[14px] text-primary/50 leading-relaxed mb-8">
            Complete and send the pre-filled email, and we&apos;ll get back to you within 24 hours with a custom quote.
          </p>
          <button
            onClick={() => setSent(false)}
            className="font-body text-[12px] tracking-[0.12em] uppercase text-primary/40 border-b border-primary/15 pb-0.5 hover:text-primary hover:border-primary/40 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background pt-16 md:pt-20">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-16 lg:px-24 border-b border-primary/8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Contact</p>
            <h1 className="font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.88] tracking-[-0.03em] text-primary">
              Let&apos;s talk<br />about your<br />project.
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/30 mb-2">Email</p>
              <a
                href="mailto:shahan@retrotekt.com"
                className="font-heading text-[1rem] text-secondary hover:text-secondary/75 transition-colors border-b border-secondary/30 pb-0.5"
              >
                shahan@retrotekt.com
              </a>
            </div>
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/30 mb-2">Response Time</p>
              <p className="font-heading text-[1rem] text-primary/70">Within 24 hours</p>
            </div>
            <div className="mt-2 p-5 bg-secondary/8 border-l-2 border-secondary/40">
              <p className="font-body text-[13px] text-primary/60 leading-relaxed">
                <span className="text-secondary font-semibold">Custom quote within 24 hours.</span>{" "}
                Share your project scope and we&apos;ll recommend the right package with a firm price — no surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/40">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      onBlur={() => setErrors((prev) => ({ ...prev, name: validators.name(form.name) }))}
                      placeholder="John Smith"
                      maxLength={100}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full bg-transparent border px-4 py-3.5 font-body text-[14px] text-primary placeholder:text-primary/25 focus:outline-none transition-colors duration-200 ${
                        errors.name ? "border-red-400 focus:border-red-500" : "border-primary/15 focus:border-secondary/60"
                      }`}
                    />
                    <span id="name-error"><FieldErrorMsg error={errors.name} /></span>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/40">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      onBlur={() => setErrors((prev) => ({ ...prev, email: validators.email(form.email) }))}
                      placeholder="john@company.com"
                      maxLength={255}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full bg-transparent border px-4 py-3.5 font-body text-[14px] text-primary placeholder:text-primary/25 focus:outline-none transition-colors duration-200 ${
                        errors.email ? "border-red-400 focus:border-red-500" : "border-primary/15 focus:border-secondary/60"
                      }`}
                    />
                    <span id="email-error"><FieldErrorMsg error={errors.email} /></span>
                  </div>
                </div>

                {/* Project Type */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="project-type" className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/40">
                    Project Type
                  </label>
                  <select
                    id="project-type"
                    value={form.projectType}
                    onChange={(e) => update("projectType", e.target.value)}
                    className="w-full bg-background border border-primary/15 px-4 py-3.5 font-body text-[14px] text-primary focus:border-secondary/60 focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-primary/40">Select a package…</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-2">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/40">
                    Budget Range
                  </p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Budget range">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update("budget", b)}
                        aria-pressed={form.budget === b}
                        className={`px-4 py-2 font-body text-[12px] transition-all duration-200 border ${
                          form.budget === b
                            ? "bg-primary text-background border-primary"
                            : "border-primary/15 text-primary/50 hover:border-primary/30 hover:text-primary"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/40">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    onBlur={() => setErrors((prev) => ({ ...prev, message: validators.message(form.message) }))}
                    placeholder="Describe your project — space type, style, any reference images, your timeline…"
                    maxLength={5000}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full bg-transparent border px-4 py-3.5 font-body text-[14px] text-primary placeholder:text-primary/25 focus:outline-none transition-colors duration-200 resize-none ${
                      errors.message ? "border-red-400 focus:border-red-500" : "border-primary/15 focus:border-secondary/60"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <span id="message-error"><FieldErrorMsg error={errors.message} /></span>
                    <p className="font-body text-[10px] text-primary/25 shrink-0 mt-1">{form.message.length}/5000</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-dark self-start px-10 py-4 bg-primary text-background font-body text-[12px] tracking-[0.14em] uppercase disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Opening Email…" : "Send Message →"}
                </button>
              </form>
            </div>

            {/* Side info */}
            <div className="lg:col-span-4 flex flex-col gap-8 lg:pt-2">
              <div className="border-t border-primary/12 pt-6">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/30 mb-4">Typical Turnaround</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Quote", time: "Within 24 hours" },
                    { label: "Still Renders", time: "3–5 business days" },
                    { label: "Rush Delivery", time: "24–48 hours (+50%)" },
                    { label: "Walkthroughs", time: "5–7 business days" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between gap-4">
                      <p className="font-body text-[13px] text-primary/50">{item.label}</p>
                      <p className="font-heading text-[12px] tracking-[0.04em] text-primary/70 text-right">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary/12 pt-6">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/30 mb-4">What to Send</p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Floor plans (PDF, CAD, or sketch)",
                    "Reference images or mood board",
                    "Preferred angles or views",
                    "Style preferences",
                    "Project address (optional)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-body text-[13px] text-primary/50">
                      <span className="w-3 h-px bg-secondary/50 flex-shrink-0 mt-2.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary p-6">
                <p className="font-heading text-[12px] tracking-[0.08em] text-background mb-3">Not ready to commit?</p>
                <p className="font-body text-[13px] text-background/45 leading-relaxed mb-4">
                  No problem. Send a quick note with your project type and budget and we&apos;ll give you a ballpark estimate — no strings attached.
                </p>
                <a
                  href="mailto:shahan@retrotekt.com?subject=Quick Question About Pricing"
                  className="font-body text-[11px] tracking-[0.14em] uppercase text-secondary/70 border-b border-secondary/30 pb-0.5 hover:text-secondary hover:border-secondary transition-colors"
                >
                  Quick Email →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
