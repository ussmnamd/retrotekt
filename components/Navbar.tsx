"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (!isScrolled) setIsMenuOpen(false);
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
      const sections = Array.from(document.querySelectorAll('section'));
      // Y-coordinate to check (roughly the center of the navbar)
      const navY = 50;
      
      // Find the last section whose top is above our nav line
      const activeSec = sections.reverse().find(sec => sec.getBoundingClientRect().top <= navY + 20);
      
      let isDark = false;
      if (activeSec) {
        let el: HTMLElement | null = activeSec;
        while (el && el !== document.body) {
          const classes = Array.from(el.classList);
          if (classes.includes('bg-primary') || classes.includes('bg-[#2C1F14]') || classes.includes('bg-[#0A0A0A]') || classes.includes('bg-[#0F0A06]')) {
            isDark = true;
            break;
          }
          if (classes.includes('bg-background') || classes.includes('bg-surface') || classes.includes('bg-[#F7F0E3]') || classes.includes('bg-[#EDE3CF]') || classes.includes('bg-[#ECE3CF]')) {
            isDark = false;
            break;
          }
          const bgStyle = el.style.background || el.style.backgroundColor || '';
          if (bgStyle.includes('#1C1309') || bgStyle.includes('rgb(28, 19, 9)') || bgStyle.includes('#0A0A0A') || bgStyle.includes('rgb(10, 10, 10)') || bgStyle.includes('#0F0A06')) {
            isDark = true;
            break;
          }
          if (bgStyle.includes('#ECE3CF') || bgStyle.includes('rgb(236, 227, 207)') || bgStyle.includes('#EDE3CE') || bgStyle.includes('rgb(237, 227, 206)')) {
            isDark = false;
            break;
          }
          el = el.parentElement;
        }
      } else {
        // Fallback for pages without sections, or before scrolling
        const container = document.querySelector('main') || document.querySelector('div[class*="min-h-screen"]');
        if (container) {
          const classes = Array.from(container.classList);
          isDark = classes.includes('bg-primary') || classes.includes('bg-[#2C1F14]') || classes.includes('bg-[#0A0A0A]') || classes.includes('bg-[#0F0A06]');
        } else {
          isDark = true; // default to body bg
        }
      }
      setIsDarkBg(isDark);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    // Also re-check when pathname changes
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <nav className="fixed top-0 z-50 pt-11 px-10 transition-colors duration-500" style={{ left: 'var(--frame-strip)', right: 'var(--frame-strip)' }}>
      <div className="flex items-center justify-between">
        <Link href="/" className="flex-shrink-0 group -ml-3">
          <Image
            src="/logo-mark.png"
            alt="Retrotekt"
            width={52}
            height={52}
            className={`h-14 w-auto object-contain mt-3 transition-opacity duration-500 ${
              isDarkBg ? "invert opacity-90 group-hover:opacity-100" : "opacity-90 group-hover:opacity-100"
            }`}
            priority
          />
        </Link>

        <div 
          className="relative flex items-center justify-end h-14 mt-3 min-w-[200px]"
          onMouseEnter={() => isScrolled && setIsMenuOpen(true)}
          onMouseLeave={() => isScrolled && setIsMenuOpen(false)}
        >
          {/* Full Links - Visible when NOT scrolled */}
          <ul className={`absolute right-0 flex items-center gap-6 md:gap-10 font-body font-medium text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            !isScrolled ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}>
            {NAV_LINKS.map(([label, href]) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              
              return (
                <li key={label} className="whitespace-nowrap">
                  <Link
                    href={href}
                    className={`group relative flex items-center gap-3 py-1 transition-colors duration-500 ${
                      isActive
                        ? "text-secondary"
                        : isDarkBg 
                          ? "text-background/60 hover:text-background" 
                          : "text-primary/50 hover:text-primary"
                    }`}
                  >
                    <div className={`h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      isActive 
                        ? "w-8 bg-secondary" 
                        : isDarkBg
                          ? "w-3 bg-background/30 group-hover:w-8 group-hover:bg-background"
                          : "w-3 bg-primary/30 group-hover:w-8 group-hover:bg-primary"
                    }`}></div>
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Menu Button - Visible WHEN scrolled */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`absolute right-0 whitespace-nowrap group relative flex items-center gap-3 py-1 font-body font-medium text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isScrolled ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
            } ${
              isDarkBg ? "text-background/60 hover:text-background" : "text-primary/50 hover:text-primary"
            }`}
          >
            <div className={`h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isDarkBg
                ? "w-3 bg-background/30 group-hover:w-8 group-hover:bg-background"
                : "w-3 bg-primary/30 group-hover:w-8 group-hover:bg-primary"
            }`}></div>
            <span>Menu</span>
          </button>

          {/* Premium Dropdown Menu Wrapper (Bridges hover gap) */}
          <div 
            className={`absolute top-full right-0 pt-4 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="w-[220px] bg-[#3D2A1A] border border-[#C4A882]/40 px-5 py-5 shadow-[0_32px_64px_rgba(0,0,0,0.55)] relative overflow-hidden rounded-xl">
              {/* Grain texture — same as ServiceCard hovered state */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] mix-blend-overlay z-0" aria-hidden="true">
                <filter id="nav-noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#nav-noise)" />
              </svg>
              {/* Warm sand radial glow — matches ServiceCard mouse-follow gradient */}
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 180% 140% at 100% 0%, rgba(196,168,130,0.22) 0%, transparent 65%)' }} />
              {/* Bottom-right corner accent — mirrors ServiceCard border mask */}
              <div className="absolute bottom-0 right-0 w-2/3 h-px bg-gradient-to-l from-[#C4A882]/60 to-transparent z-0" />
              <div className="absolute bottom-0 right-0 w-px h-2/3 bg-gradient-to-t from-[#C4A882]/60 to-transparent z-0" />
              {/* Accent top border */}
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#C4A882]/70 via-[#C4A882]/30 to-transparent z-10" />

              <ul className="flex flex-col gap-4 font-body font-medium text-[10px] tracking-[0.25em] uppercase relative z-10">
                {NAV_LINKS.map(([label, href]) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={label}>
                      {/* Reserve 48px right so the line can extend without reflowing */}
                      <Link
                        href={href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex items-center gap-3 pr-12 transition-colors duration-400 ${
                          isActive ? "text-secondary" : "text-background/55 hover:text-background"
                        }`}
                      >
                        <div className={`flex-shrink-0 h-px transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                          isActive 
                            ? "w-6 bg-secondary" 
                            : "w-2 bg-background/25 group-hover:w-6 group-hover:bg-background"
                        }`} />
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
    </nav>
  );
}
