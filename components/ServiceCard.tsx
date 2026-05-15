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

/** Still Renders — isometric camera + grid lines */
const StillRendersIllustration = () => (
  <svg viewBox="0 0 220 160" fill="none" className="w-full h-full" aria-hidden="true">
    <defs>
      <linearGradient id="sr-grid-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C4A882" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#C4A882" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Perspective grid floor */}
    {[0,1,2,3,4,5].map(i => (
      <line key={`h${i}`} x1={10 + i*34} y1={155} x2={110} y2={60} stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.22" />
    ))}
    {[0,1,2,3,4].map(i => (
      <line key={`d${i}`} x1={10} y1={75 + i*20} x2={210} y2={75 + i*20} stroke="#C4A882" strokeWidth="0.3" strokeOpacity="0.14" />
    ))}
    {/* Architectural block — main building */}
    <rect x="60" y="70" width="60" height="65" fill="#C4A882" fillOpacity="0.06" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.4" />
    {/* Roof face */}
    <polygon points="60,70 90,50 150,70 120,70" fill="#C4A882" fillOpacity="0.1" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.5" />
    {/* Right face shadow */}
    <rect x="120" y="70" width="30" height="65" fill="#C4A882" fillOpacity="0.04" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.25" />
    {/* Windows */}
    {[0,1,2].map(i => (
      <rect key={i} x={66 + i*18} y="82" width="10" height="14" fill="#C4A882" fillOpacity="0.1" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.35" />
    ))}
    {/* Door */}
    <rect x="83" y="110" width="14" height="25" fill="#C4A882" fillOpacity="0.08" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.3" />
    {/* Camera icon — top right */}
    <rect x="168" y="20" width="32" height="22" rx="3" fill="none" stroke="#C4A882" strokeWidth="0.8" strokeOpacity="0.5" />
    <circle cx="184" cy="31" r="6" fill="none" stroke="#C4A882" strokeWidth="0.7" strokeOpacity="0.5" />
    <circle cx="184" cy="31" r="3" fill="#C4A882" fillOpacity="0.12" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    <polygon points="168,25 160,21 160,28" fill="#C4A882" fillOpacity="0.3" />
    {/* Dimension lines */}
    <line x1="58" y1="138" x2="58" y2="155" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="2 2" />
    <line x1="122" y1="138" x2="122" y2="155" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="2 2" />
    <line x1="58" y1="150" x2="122" y2="150" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.35" />
    <text x="90" y="147" textAnchor="middle" fill="#C4A882" fillOpacity="0.4" fontSize="6" fontFamily="monospace">12.5m</text>
  </svg>
);

/** Walkthroughs — video camera path with cinematic frame lines */
const WalkthroughsIllustration = () => (
  <svg viewBox="0 0 220 160" fill="none" className="w-full h-full" aria-hidden="true">
    {/* Cinematic letterbox bars */}
    <rect x="14" y="22" width="192" height="116" rx="4" fill="none" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.25" />
    <rect x="14" y="22" width="192" height="18" fill="#C4A882" fillOpacity="0.06" />
    <rect x="14" y="120" width="192" height="18" fill="#C4A882" fillOpacity="0.06" />
    {/* Interior room perspective */}
    <polygon points="14,40 60,62 60,120 14,120" fill="#C4A882" fillOpacity="0.04" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.2" />
    <polygon points="206,40 160,62 160,120 206,120" fill="#C4A882" fillOpacity="0.04" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.2" />
    <polygon points="60,62 110,50 160,62 160,120 110,130 60,120" fill="#C4A882" fillOpacity="0.04" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" />
    {/* Vanishing point lines */}
    {[-30,-15,0,15,30].map((offset,i) => (
      <line key={i} x1="110" y1="80" x2={14 + offset*1.2} y2={40 + i*16} stroke="#C4A882" strokeWidth="0.3" strokeOpacity="0.12" strokeDasharray="3 4"/>
    ))}
    {/* Door frame in back wall */}
    <rect x="90" y="80" width="40" height="50" rx="1" fill="none" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" />
    <rect x="90" y="80" width="40" height="8" fill="#C4A882" fillOpacity="0.06" />
    {/* Camera path dashes */}
    <path d="M 30 105 C 70 108 100 82 140 82 C 170 82 185 95 195 105" stroke="#C4A882" strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="3 3" fill="none" />
    {/* Video camera icon */}
    <rect x="98" y="58" width="18" height="12" rx="1.5" fill="none" stroke="#C4A882" strokeWidth="0.8" strokeOpacity="0.55" />
    <polygon points="116,61 124,58 124,70 116,67" fill="#C4A882" fillOpacity="0.2" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.45" />
    <circle cx="107" cy="64" r="2.5" fill="#C4A882" fillOpacity="0.15" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    {/* Film perforations */}
    {[0,1,2,3,4,5].map(i => (
      <rect key={i} x={24 + i * 30} y="25" width="5" height="5" rx="0.5" fill="#C4A882" fillOpacity="0.1" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.3" />
    ))}
    {[0,1,2,3,4,5].map(i => (
      <rect key={i} x={24 + i * 30} y="128" width="5" height="5" rx="0.5" fill="#C4A882" fillOpacity="0.1" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.3" />
    ))}
  </svg>
);

/** Floor Plans — top-down architectural blueprint */
const FloorPlansIllustration = () => (
  <svg viewBox="0 0 220 160" fill="none" className="w-full h-full" aria-hidden="true">
    <defs>
      <pattern id="fp-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C4A882" strokeWidth="0.3" strokeOpacity="0.14" />
      </pattern>
    </defs>
    {/* Grid background */}
    <rect x="10" y="10" width="200" height="140" fill="url(#fp-grid)" />
    {/* Floor plan outline — main footprint */}
    <rect x="30" y="25" width="160" height="110" fill="none" stroke="#C4A882" strokeWidth="1.0" strokeOpacity="0.55" />
    {/* Room dividers */}
    <line x1="30" y1="85" x2="110" y2="85" stroke="#C4A882" strokeWidth="0.8" strokeOpacity="0.45" />
    <line x1="110" y1="25" x2="110" y2="135" stroke="#C4A882" strokeWidth="0.8" strokeOpacity="0.45" />
    <line x1="110" y1="70" x2="190" y2="70" stroke="#C4A882" strokeWidth="0.8" strokeOpacity="0.45" />
    {/* Door swings */}
    <path d="M 30 55 L 45 55" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.4" />
    <path d="M 45 55 Q 45 70 30 70" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
    <path d="M 110 95 L 126 95" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.4" />
    <path d="M 126 95 Q 126 111 110 111" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
    {/* Window markers */}
    {[[60,25,90,25],[140,25,170,25]].map(([x1,y1,x2,y2],i) => (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C4A882" strokeWidth="2.5" strokeOpacity="0.3" />
        <line x1={x1} y1={y1-2} x2={x2} y2={y2-2} stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.5" />
      </g>
    ))}
    {/* Compass rose */}
    <circle cx="197" cy="140" r="8" fill="none" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" />
    <line x1="197" y1="132" x2="197" y2="148" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    <line x1="189" y1="140" x2="205" y2="140" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    <polygon points="197,132 194.5,138 199.5,138" fill="#C4A882" fillOpacity="0.4" />
    <text x="197" y="130" textAnchor="middle" fill="#C4A882" fillOpacity="0.5" fontSize="5" fontFamily="monospace">N</text>
    {/* Scale bar */}
    <line x1="30" y1="148" x2="90" y2="148" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    <line x1="30" y1="145" x2="30" y2="151" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    <line x1="90" y1="145" x2="90" y2="151" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
    <text x="60" y="146" textAnchor="middle" fill="#C4A882" fillOpacity="0.4" fontSize="5" fontFamily="monospace">1:100</text>
  </svg>
);

/** Aerial Views — drone bird's eye with site contours */
const AerialViewsIllustration = () => (
  <svg viewBox="0 0 220 160" fill="none" className="w-full h-full" aria-hidden="true">
    {/* Topographic contour rings */}
    <ellipse cx="110" cy="80" rx="95" ry="60" fill="none" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.15" />
    <ellipse cx="110" cy="80" rx="78" ry="48" fill="none" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.2" />
    <ellipse cx="110" cy="80" rx="60" ry="36" fill="none" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.25" />
    <ellipse cx="110" cy="80" rx="42" ry="25" fill="none" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" />
    <ellipse cx="110" cy="80" rx="26" ry="15" fill="none" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.35" />
    {/* Building footprints from above */}
    <rect x="72" y="62" width="36" height="22" fill="#C4A882" fillOpacity="0.1" stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.45" />
    <rect x="114" y="66" width="22" height="14" fill="#C4A882" fillOpacity="0.07" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.3" />
    <rect x="72" y="88" width="16" height="10" fill="#C4A882" fillOpacity="0.07" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.25" />
    {/* Shadow offset */}
    <rect x="76" y="66" width="36" height="22" fill="#C4A882" fillOpacity="0.04" />
    {/* Drone icon */}
    <circle cx="110" cy="22" r="5" fill="none" stroke="#C4A882" strokeWidth="0.7" strokeOpacity="0.5" />
    <circle cx="110" cy="22" r="2" fill="#C4A882" fillOpacity="0.2" />
    {/* Drone arms */}
    {[[-12,-8],[12,-8],[-12,8],[12,8]].map(([dx,dy],i) => (
      <g key={i}>
        <line x1={110} y1={22} x2={110+dx} y2={22+dy} stroke="#C4A882" strokeWidth="0.6" strokeOpacity="0.45" />
        <circle cx={110+dx} cy={22+dy} r="3" fill="none" stroke="#C4A882" strokeWidth="0.5" strokeOpacity="0.4" />
      </g>
    ))}
    {/* Altitude measurement line */}
    <line x1="110" y1="27" x2="110" y2="60" stroke="#C4A882" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="2 3" />
    <polygon points="110,60 108,54 112,54" fill="#C4A882" fillOpacity="0.3" />
    {/* Grid overlay lines */}
    {[0,1,2,3].map(i => (
      <line key={`v${i}`} x1={50 + i*40} y1="10" x2={50 + i*40} y2="150" stroke="#C4A882" strokeWidth="0.25" strokeOpacity="0.1" strokeDasharray="4 6" />
    ))}
    {[0,1,2].map(i => (
      <line key={`h${i}`} x1="15" y1={30 + i*45} x2="205" y2={30 + i*45} stroke="#C4A882" strokeWidth="0.25" strokeOpacity="0.1" strokeDasharray="4 6" />
    ))}
    {/* Altitude label */}
    <text x="116" y="45" fill="#C4A882" fillOpacity="0.4" fontSize="5.5" fontFamily="monospace">120m AGL</text>
  </svg>
);

const illustrationMap: Record<IconType, React.FC> = {
  box: StillRendersIllustration,
  cylinder: WalkthroughsIllustration,
  plane: FloorPlansIllustration,
  pyramid: AerialViewsIllustration,
};

const serviceLabels: Record<IconType, string> = {
  box: 'Photography',
  cylinder: 'Cinematic',
  plane: 'Blueprint',
  pyramid: 'Drone',
};

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

  const Illustration = illustrationMap[icon];
  const serviceLabel = serviceLabels[icon];

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

      {/* Mouse-follow radial gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(196, 168, 130, 0.18), transparent 60%)`
        }}
      />

      {/* Border accent — bottom-right corner mask */}
      <div
        className="absolute inset-0 rounded-[1.5rem] border-b-[2px] border-r-[2px] border-[#C4A882]/40 group-hover:border-[#C4A882]/80 transition-colors duration-500 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(135deg, transparent 40%, black 85%)',
          WebkitMaskImage: 'linear-gradient(135deg, transparent 40%, black 85%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative h-full flex flex-col z-10 min-h-[280px]">

        {/* ── Top area: Label + Illustration ── */}
        <div className="relative flex-1 overflow-hidden pt-14">
          {/* service type label — reserved space keeps it clear of the artwork */}
          <div className="absolute left-5 right-5 top-5 z-20 min-w-0">
            <span className="block max-w-full whitespace-nowrap font-body text-[9px] leading-none tracking-[0.18em] uppercase text-[#C4A882]/60 group-hover:text-[#C4A882]/85 transition-colors duration-500">
              {serviceLabel}
            </span>
          </div>


          {/* Illustration — fills the top area */}
          <div className="absolute inset-x-0 bottom-0 top-9 flex items-center justify-center opacity-60 group-hover:opacity-90 transition-opacity duration-700 scale-100 group-hover:scale-105 transition-transform">
            <Illustration />
          </div>

        </div>

        {/* ── Bottom area: Text + CTA ── */}
        <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
            <h3 className="text-[1.4rem] lg:text-[1.55rem] leading-[1.1] font-light font-heading text-[#F7F0E3] tracking-tight mb-1.5 group-hover:text-[#C4A882] transition-colors duration-500">
              {title}
            </h3>
            <p className="text-[12.5px] text-[#F7F0E3]/55 leading-relaxed font-body line-clamp-2 group-hover:text-[#F7F0E3]/80 transition-colors duration-500">
              {description}
            </p>
          </div>

          {/* Learn More row */}
          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-1 group-hover:translate-y-0">
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-[#C4A882]">Learn more</span>
            <div className="h-px bg-[#C4A882] w-4 group-hover:w-8 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          </div>
        </div>
      </div>
    </a>
  );
};

export const ServiceCard = memo(ServiceCardBase);
