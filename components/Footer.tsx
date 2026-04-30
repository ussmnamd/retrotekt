import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-background/10">
          {/* Brand col */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo-mark.png"
                alt="Retrotekt"
                width={36}
                height={36}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="font-body text-[13px] leading-relaxed text-background/45 max-w-xs mb-6">
              Photorealistic architectural visualizations for contractors, remodelers, and developers. Studio quality. Contractor pricing.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:shahan@retrotekt.com"
                className="font-body text-[13px] text-secondary hover:text-secondary/75 transition-colors duration-200 border-b border-secondary/30 pb-0.5"
              >
                shahan@retrotekt.com
              </a>
              {/* WhatsApp icon */}
              <a
                href="https://wa.me/NUMBER_TBD"
                aria-label="WhatsApp"
                className="text-background/35 hover:text-secondary transition-colors duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Email icon */}
              <a
                href="mailto:shahan@retrotekt.com"
                aria-label="Email"
                className="text-background/35 hover:text-secondary transition-colors duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav col */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="font-heading text-[10px] tracking-[0.25em] uppercase text-background/30 mb-5">
              Navigation
            </p>
            <ul className="flex flex-col gap-3">
              {[
                ["Services", "/services"],
                ["Portfolio", "/portfolio"],
                ["Consulting", "/consulting"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-[13px] text-background/50 hover:text-secondary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA col */}
          <div className="md:col-span-3">
            <p className="font-heading text-[10px] tracking-[0.25em] uppercase text-background/30 mb-5">
              Start a Project
            </p>
            <p className="font-body text-[13px] text-background/45 leading-relaxed mb-6">
              Custom quote within 24 hours. No commitment required.
            </p>
            <Link
              href="/contact"
              className="btn-outline-light inline-block px-6 py-3 border border-secondary/50 text-secondary font-body text-[11px] tracking-[0.14em] uppercase"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[11px] text-background/25">
            © 2026 Retrotekt · All prices in USD · Subject to project scope review
          </p>
          <p className="font-body text-[11px] text-background/20">
            Contractor & Remodeler Market · USA
          </p>
        </div>
      </div>
    </footer>
  );
}
