"use client";
import React, { memo, MouseEvent, useState, useRef } from 'react';

type IconType = 'box' | 'cylinder' | 'plane' | 'pyramid';

export interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: IconType;
  index: number;
  onHover?: (index: number | null) => void;
}

const BoxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] transition-all duration-[1.5s] ease-out" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" className="[stroke-dasharray:40] [stroke-dashoffset:40] group-hover:[stroke-dashoffset:0] transition-all duration-1000 delay-300 ease-out" />
    <line x1="12" y1="22.08" x2="12" y2="12" className="[stroke-dasharray:40] [stroke-dashoffset:40] group-hover:[stroke-dashoffset:0] transition-all duration-1000 delay-500 ease-out" />
  </svg>
);

const CylinderIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3" className="[stroke-dasharray:60] [stroke-dashoffset:60] group-hover:[stroke-dashoffset:0] transition-all duration-1000 ease-out" />
    <path d="M21 5v14c0 1.66-4 3-9 3s-9-1.34-9-3V5" className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] transition-all duration-[1.5s] delay-300 ease-out" />
  </svg>
);

const PlaneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 22 8.5 12 15 2 8.5 12 2" className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] transition-all duration-[1.2s] ease-out" />
    <polygon points="12 6 18 10 12 14 6 10 12 6" className="[stroke-dasharray:60] [stroke-dashoffset:60] group-hover:[stroke-dashoffset:0] transition-all duration-1000 delay-300 ease-out" />
    <polygon points="12 10 14 11.5 12 13 10 11.5 12 10" className="[stroke-dasharray:40] [stroke-dashoffset:40] group-hover:[stroke-dashoffset:0] transition-all duration-700 delay-500 ease-out" />
  </svg>
);

const PyramidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 16l10 6 10-6L12 2z" className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] transition-all duration-[1.5s] ease-out" />
    <path d="M12 2v20" className="[stroke-dasharray:40] [stroke-dashoffset:40] group-hover:[stroke-dashoffset:0] transition-all duration-1000 delay-300 ease-out" />
  </svg>
);

const ServiceCardBase: React.FC<ServiceCardProps> = ({ title, description, href, icon, index, onHover }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const IconComponent = 
    icon === 'box' ? BoxIcon : 
    icon === 'cylinder' ? CylinderIcon : 
    icon === 'plane' ? PlaneIcon : 
    PyramidIcon;

  return (
    <a 
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover && onHover(index)}
      onMouseLeave={() => onHover && onHover(null)}
      className="group relative h-full transition-all duration-700 hover:-translate-y-2 block overflow-hidden rounded-[1.5rem] bg-[#3D2A1A]/30 border border-white/5 hover:border-[#C4A882]/30"
    >
      {/* Noise/Grain texture layer */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] group-hover:opacity-[0.35] transition-opacity duration-700 mix-blend-overlay z-0">
        <filter id={`noiseFilter-${index}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noiseFilter-${index})`} />
      </svg>
      
      {/* Background warm grain gradient overlay following mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(196, 168, 130, 0.2), transparent 60%)`
        }}
      />

      {/* Border Mask (key effect) */}
      <div 
        className="absolute inset-0 rounded-[1.5rem] border-b-[2px] border-r-[2px] border-[#C4A882]/40 group-hover:border-[#C4A882]/80 transition-colors duration-500 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(135deg, transparent 40%, black 85%)',
          WebkitMaskImage: 'linear-gradient(135deg, transparent 40%, black 85%)',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col p-6 lg:p-8 min-h-[260px] z-10">

        {/* Spacer pushes content block to bottom */}
        <div className="flex-1" />

        {/* Title & Description — fixed bottom position so heading row aligns across cards */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="text-[1.5rem] lg:text-[1.7rem] leading-[1.1] font-light font-heading text-[#F7F0E3] tracking-tight mb-2 line-clamp-1 group-hover:text-[#C4A882] group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(196,168,130,0.3)] transition-all duration-500">
            {title}
          </h3>
          <p className="text-[13px] text-[#F7F0E3]/60 leading-relaxed font-body opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Animated 3D Line Drawing instead of arrow */}
        <div className="absolute top-6 right-6 text-[#C4A882]/10 group-hover:text-[#C4A882] transform scale-100 group-hover:scale-[1.15] group-hover:-rotate-[4deg] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
           <IconComponent className="w-16 h-16 drop-shadow-[0_0_15px_rgba(196,168,130,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(196,168,130,0.4)] transition-all duration-700" />
        </div>
      </div>
    </a>
  );
};

export const ServiceCard = memo(ServiceCardBase);
