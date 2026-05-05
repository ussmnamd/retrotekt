"use client";
import React, { MouseEvent, useState, useRef } from 'react';

/* ── Architectural SVG icons — each draws stroke-by-stroke ────────────────── */

const Phase1Icon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    <path d="M10 70 L10 10 L70 10" stroke="#8C6E4B" strokeWidth="1.2" strokeLinecap="round"
      strokeDasharray="160" strokeDashoffset={active ? 0 : 160}
      style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.1s' }} />
    <path d="M10 42 L45 42 L45 70" stroke="#8C6E4B" strokeWidth="0.8" strokeLinecap="round"
      strokeDasharray="80" strokeDashoffset={active ? 0 : 80}
      style={{ transition: 'stroke-dashoffset 1.0s cubic-bezier(0.16,1,0.3,1) 0.6s' }} />
    <path d="M45 57 A12 12 0 0 1 57 57" stroke="#8C6E4B" strokeWidth="0.8" strokeLinecap="round"
      strokeDasharray="25" strokeDashoffset={active ? 0 : 25}
      style={{ transition: 'stroke-dashoffset 0.5s ease 1.2s' }} />
    <line x1="10" y1="75" x2="70" y2="75" stroke="#8C6E4B" strokeWidth="0.5" strokeOpacity="0.35"
      strokeDasharray="60" strokeDashoffset={active ? 0 : 60}
      style={{ transition: 'stroke-dashoffset 0.7s ease 1.4s' }} />
    <line x1="10" y1="73" x2="10" y2="77" stroke="#8C6E4B" strokeWidth="0.8" strokeOpacity="0.4"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.3s ease 1.9s' }} />
    <line x1="70" y1="73" x2="70" y2="77" stroke="#8C6E4B" strokeWidth="0.8" strokeOpacity="0.4"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.3s ease 1.9s' }} />
  </svg>
);

const Phase2Icon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    <path d="M40 12 L65 25 L40 38 L15 25 Z" stroke="#8C6E4B" strokeWidth="1.0"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="130" strokeDashoffset={active ? 0 : 130}
      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s' }} />
    <path d="M15 25 L15 58 L40 71 L40 38 Z" stroke="#8C6E4B" strokeWidth="1.0"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="130" strokeDashoffset={active ? 0 : 130}
      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s' }} />
    <path d="M65 25 L65 58 L40 71 L40 38 Z" stroke="#8C6E4B" strokeWidth="1.0"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="130" strokeDashoffset={active ? 0 : 130}
      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.75s' }} />
    <line x1="40" y1="38" x2="40" y2="71" stroke="#8C6E4B" strokeWidth="0.5" strokeOpacity="0.3"
      strokeDasharray="34" strokeDashoffset={active ? 0 : 34}
      style={{ transition: 'stroke-dashoffset 0.5s ease 1.4s' }} />
  </svg>
);

const Phase3Icon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    <rect x="10" y="15" width="44" height="34" stroke="#8C6E4B" strokeWidth="1.0"
      strokeDasharray="160" strokeDashoffset={active ? 0 : 160}
      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s' }} />
    <rect x="26" y="31" width="44" height="34" stroke="#8C6E4B" strokeWidth="1.0" strokeOpacity="0.45"
      strokeDasharray="160" strokeDashoffset={active ? 0 : 160}
      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s' }} />
    <path d="M62 10 A8 8 0 1 1 54 10" stroke="#8C6E4B" strokeWidth="1.0" strokeLinecap="round"
      strokeDasharray="50" strokeDashoffset={active ? 0 : 50}
      style={{ transition: 'stroke-dashoffset 0.7s ease 1.2s' }} />
    <path d="M54 6 L54 14 L60 10 Z" fill="#8C6E4B"
      style={{ fillOpacity: active ? 0.7 : 0, transition: 'fill-opacity 0.3s ease 1.7s' }} />
  </svg>
);

const Phase4Icon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    <path d="M18 8 L18 72 L62 72 L62 22 L48 8 Z" stroke="#8C6E4B" strokeWidth="1.0"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="220" strokeDashoffset={active ? 0 : 220}
      style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.1s' }} />
    <path d="M48 8 L48 22 L62 22" stroke="#8C6E4B" strokeWidth="1.0" strokeLinecap="round"
      strokeDasharray="40" strokeDashoffset={active ? 0 : 40}
      style={{ transition: 'stroke-dashoffset 0.5s ease 0.9s' }} />
    <line x1="26" y1="36" x2="54" y2="36" stroke="#8C6E4B" strokeWidth="0.7" strokeOpacity="0.4"
      strokeDasharray="30" strokeDashoffset={active ? 0 : 30}
      style={{ transition: 'stroke-dashoffset 0.5s ease 1.2s' }} />
    <line x1="26" y1="44" x2="50" y2="44" stroke="#8C6E4B" strokeWidth="0.7" strokeOpacity="0.4"
      strokeDasharray="26" strokeDashoffset={active ? 0 : 26}
      style={{ transition: 'stroke-dashoffset 0.5s ease 1.35s' }} />
    <path d="M26 58 L33 65 L52 50" stroke="#8C6E4B" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="52" strokeDashoffset={active ? 0 : 52}
      style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1) 1.6s' }} />
  </svg>
);

const icons = [Phase1Icon, Phase2Icon, Phase3Icon, Phase4Icon];

export interface ProcessCardProps {
  phase: string;
  title: string;
  desc: string;
  index: number;
  active: boolean;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ phase, title, desc, index, active }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const IconComponent = icons[index % icons.length];
  const isActive = hovered || active;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-[1.5rem] cursor-default"
      style={{
        background: '#3D2A1A',
        border: `1px solid ${hovered ? 'rgba(196,168,130,0.45)' : 'rgba(247,240,227,0.09)'}`,
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.4)'
          : '0 2px 12px rgba(0,0,0,0.2)',
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0px)' : 'translateY(36px)',
        transition: [
          'opacity 0.75s cubic-bezier(0.16,1,0.3,1)',
          'transform 0.75s cubic-bezier(0.16,1,0.3,1)',
          'border-color 0.4s ease',
          'box-shadow 0.4s ease',
        ].join(', '),
      }}
    >
      {/* Grain texture — very subtle on light bg */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full z-0 mix-blend-multiply"
        style={{ opacity: hovered ? 0.22 : 0.1, transition: 'opacity 0.7s ease' }}>
        <filter id={`procNoise-${index}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#procNoise-${index})`} />
      </svg>

      {/* Mouse-following radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(196,168,130,0.15), transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Diagonal border accent — bottom-right */}
      <div
        className="absolute inset-0 rounded-[1.5rem] border-b-[2px] border-r-[2px] pointer-events-none z-0"
        style={{
          borderColor: hovered ? 'rgba(140,110,75,0.55)' : 'rgba(196,168,130,0.3)',
          maskImage: 'linear-gradient(135deg, transparent 40%, black 85%)',
          WebkitMaskImage: 'linear-gradient(135deg, transparent 40%, black 85%)',
          transition: 'border-color 0.4s ease',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col p-6 lg:p-8 min-h-[280px] z-10">

        {/* Phase number + horizontal rule */}
        <div className="flex items-center gap-3 mb-5">
          <span className="font-heading text-[3.2rem] font-bold leading-none select-none"
            style={{ color: hovered ? 'rgba(247,240,227,0.15)' : 'rgba(247,240,227,0.07)', transition: 'color 0.4s ease' }}>
            {phase}
          </span>
          <div className="h-px flex-1"
            style={{
              background: 'rgba(247,240,227,0.15)',
              transformOrigin: 'left',
              transform: hovered ? 'scaleX(1)' : 'scaleX(0.45)',
              transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>

        {/* Architectural icon — top-right */}
        <div className="absolute top-6 right-6"
          style={{
            width: '68px', height: '68px',
            opacity: isActive ? 1 : 0.1,
            transform: hovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
            transition: 'opacity 0.5s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)',
            filter: hovered ? 'drop-shadow(0 4px 12px rgba(44,31,20,0.15))' : 'none',
          }}
        >
          <IconComponent active={isActive} />
        </div>

        {/* Title + description — bottom-aligned */}
        <div className="mt-auto"
          style={{
            transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
            transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <h3 className="text-[1.3rem] lg:text-[1.5rem] leading-[1.15] font-light font-heading tracking-tight mb-2"
            style={{
              color: hovered ? '#F7F0E3' : '#C4A882',
              transition: 'color 0.4s ease',
            }}
          >
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed font-body"
            style={{ color: 'rgba(247,240,227,0.6)', opacity: hovered ? 1 : 0.85, transition: 'opacity 0.4s ease' }}
          >
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};
