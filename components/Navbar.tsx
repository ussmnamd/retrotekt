"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const NAV_LINKS = [
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Consulting", "/consulting"],
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen]);

  // Detect background colour under navbar
  const detectBg = useCallback(() => {
    setIsScrolled(window.scrollY > 80);

    const sections = Array.from(document.querySelectorAll("section"));
    const navY = 50;
    const activeSec = sections.reverse().find(
      (sec) => sec.getBoundingClientRect().top <= navY + 20
    );

    let isDark = false;
    const darkClasses = ["bg-primary", "bg-[#2C1F14]", "bg-[#0A0A0A]", "bg-[#0F0A06]"];
    const lightClasses = [
      "bg-background", "bg-surface", "bg-[#F7F0E3]", "bg-[#EDE3CF]", "bg-[#ECE3CF]",
    ];

    const walkUp = (start: HTMLElement | null) => {
      let el = start;
      while (el && el !== document.body) {
        const cls = Array.from(el.classList);
        if (darkClasses.some((c) => cls.includes(c))) return true;
        if (lightClasses.some((c) => cls.includes(c))) return false;
        const bg = el.style.background || el.style.backgroundColor || "";
        if (bg.includes("#1C1309") || bg.includes("rgb(28, 19, 9)") || bg.includes("#0A0A0A") || bg.includes("#0F0A06")) return true;
        if (bg.includes("#ECE3CF") || bg.includes("rgb(236, 227, 207)") || bg.includes("#EDE3CE") || bg.includes("rgb(237, 227, 206)")) return false;
        el = el.parentElement;
      }
      return null;
    };

    if (activeSec) {
      const result = walkUp(activeSec);
      isDark = result ?? false;
    } else {
      const container =
        document.querySelector("main") ||
        document.querySelector('div[class*="min-h-screen"]');
      if (container) {
        const result = walkUp(container as HTMLElement);
        isDark = result ?? true;
      } else {
        isDark = true;
      }
    }

    setIsDarkBg(isDark);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", detectBg, { passive: true });
    detectBg();
    return () => window.removeEventListener("scroll", detectBg);
  }, [detectBg, pathname]);

  // Desktop hover handlers with a small grace period so the gap doesn't close the menu
  const handleMenuEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMenuOpen(true);
  };
  const handleMenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsMenuOpen(false), 120);
  };

  // ─── Colour tokens (computed once per render) ────────────────────────────────
  const textMain = isDarkBg ? "text-[#F7F0E3]/85 hover:text-[#F7F0E3]" : "text-[#2C1F14]/80 hover:text-[#2C1F14]";
  const textActive = "text-[#C4A882]";
  const lineBase = isDarkBg ? "bg-[#F7F0E3]/30" : "bg-[#2C1F14]/25";
  const lineHover = isDarkBg ? "group-hover:bg-[#F7F0E3]" : "group-hover:bg-[#2C1F14]";
  const lineActive = "bg-[#C4A882]";

  return (
    <nav
      className="fixed top-0 z-50 pt-11 px-10 transition-colors duration-500"
      style={{ left: "var(--frame-strip)", right: "var(--frame-strip)" }}
    >
      <div className="flex items-center justify-between">
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link href="/" className="flex-shrink-0 group -ml-3" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/logo-mark.png"
            alt="Retrotekt"
            width={52}
            height={52}
            className={`h-14 w-auto object-contain mt-3 transition-opacity duration-500 ${
              isDarkBg
                ? "invert opacity-90 group-hover:opacity-100"
                : "opacity-90 group-hover:opacity-100"
            }`}
            priority
          />
        </Link>

        {/* ── Desktop nav (md+) ────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center relative mt-3" ref={menuRef}>
          {/* Full links — visible when NOT scrolled */}
          <ul
            className={`absolute right-0 flex items-center gap-10 font-body font-bold text-[10px] tracking-[0.25em] uppercase transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              !isScrolled
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            {NAV_LINKS.map(([label, href]) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={label} className="whitespace-nowrap">
                  <Link
                    href={href}
                    className={`group relative flex items-center gap-3 py-1 transition-colors duration-500 ${
                      isActive ? textActive : textMain
                    }`}
                  >
                    <div
                      className={`h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        isActive
                          ? `w-8 ${lineActive}`
                          : `w-3 ${lineBase} group-hover:w-8 ${lineHover}`
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Menu button — visible WHEN scrolled */}
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isScrolled
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              className={`group relative flex items-center gap-3 py-1 h-14 font-body font-medium text-[10px] tracking-[0.25em] uppercase transition-colors duration-500 ${textMain}`}
            >
              <div
                className={`h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] w-3 ${lineBase} group-hover:w-8 ${lineHover}`}
              />
              <span>Menu</span>
            </button>

            {/* Dropdown tray */}
            <div
              className={`absolute top-full right-0 pt-3 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-3 pointer-events-none"
              }`}
            >
              <div
                className={`w-[200px] px-5 py-5 relative overflow-hidden rounded-xl border transition-colors duration-500 ${
                  isDarkBg
                    ? "bg-[#F7F0E3] border-[#2C1F14]/15"
                    : "bg-[#2C1F14] border-[#F7F0E3]/15"
                }`}
              >
                {/* Accent top border */}
                <div
                  className={`absolute top-0 left-0 w-full h-[1.5px] transition-colors duration-500 ${
                    isDarkBg
                      ? "bg-gradient-to-r from-[#2C1F14]/60 via-[#2C1F14]/20 to-transparent"
                      : "bg-gradient-to-r from-[#C4A882]/70 via-[#C4A882]/25 to-transparent"
                  }`}
                />
                <ul className="flex flex-col gap-4 font-body font-bold text-[10px] tracking-[0.25em] uppercase relative z-10">
                  {NAV_LINKS.map(([label, href]) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <li key={label}>
                        <Link
                          href={href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`group flex items-center gap-3 pr-10 transition-colors duration-300 ${
                            isActive
                              ? textActive
                              : isDarkBg
                              ? "text-[#2C1F14]/70 hover:text-[#2C1F14]"
                              : "text-[#F7F0E3]/70 hover:text-[#F7F0E3]"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                              isActive
                                ? `w-6 ${lineActive}`
                                : isDarkBg
                                ? "w-2 bg-[#2C1F14]/25 group-hover:w-6 group-hover:bg-[#2C1F14]"
                                : "w-2 bg-[#F7F0E3]/25 group-hover:w-6 group-hover:bg-[#F7F0E3]"
                            }`}
                          />
                          <span>{label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile hamburger (< md) ───────────────────────────────────────── */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          className={`md:hidden mt-3 flex flex-col justify-center items-end gap-[5px] w-10 h-14 flex-shrink-0 transition-colors duration-300 ${
            isDarkBg ? "text-[#F7F0E3]" : "text-[#2C1F14]"
          }`}
        >
          {/* Three-line → X morphing icon */}
          <span
            className={`block h-px w-6 origin-right transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isDarkBg ? "bg-[#F7F0E3]" : "bg-[#2C1F14]"
            } ${isMenuOpen ? "-rotate-45 -translate-y-[3px] w-[22px]" : ""}`}
          />
          <span
            className={`block h-px origin-right transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isDarkBg ? "bg-[#F7F0E3]" : "bg-[#2C1F14]"
            } ${isMenuOpen ? "opacity-0 w-0" : "w-4"}`}
          />
          <span
            className={`block h-px w-6 origin-right transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isDarkBg ? "bg-[#F7F0E3]" : "bg-[#2C1F14]"
            } ${isMenuOpen ? "rotate-45 translate-y-[3px] w-[22px]" : ""}`}
          />
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`mt-4 mb-2 rounded-xl border px-6 py-5 relative overflow-hidden transition-colors duration-500 ${
            isDarkBg
              ? "bg-[#F7F0E3] border-[#2C1F14]/15"
              : "bg-[#2C1F14] border-[#F7F0E3]/15"
          }`}
        >
          {/* Accent top border */}
          <div
            className={`absolute top-0 left-0 w-full h-[1.5px] transition-colors duration-500 ${
              isDarkBg
                ? "bg-gradient-to-r from-[#2C1F14]/60 via-[#2C1F14]/20 to-transparent"
                : "bg-gradient-to-r from-[#C4A882]/70 via-[#C4A882]/25 to-transparent"
            }`}
          />
          <ul className="flex flex-col gap-5 font-body font-bold text-[10px] tracking-[0.25em] uppercase relative z-10">
            {NAV_LINKS.map(([label, href]) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group flex items-center gap-4 transition-colors duration-300 ${
                      isActive
                        ? textActive
                        : isDarkBg
                        ? "text-[#2C1F14]/70 hover:text-[#2C1F14] active:text-[#2C1F14]"
                        : "text-[#F7F0E3]/70 hover:text-[#F7F0E3] active:text-[#F7F0E3]"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        isActive
                          ? `w-8 ${lineActive}`
                          : isDarkBg
                          ? "w-3 bg-[#2C1F14]/25 group-hover:w-8 group-hover:bg-[#2C1F14]"
                          : "w-3 bg-[#F7F0E3]/25 group-hover:w-8 group-hover:bg-[#F7F0E3]"
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
