"use client";

import { useRef } from "react";

// Architectural drawing placeholder shown while the 3D model is loading
export function Hero3DPlaceholder() {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        background: "#2C1F14",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Drawing SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 600 380"
        style={{ width: "min(70vw,520px)", height: "auto", opacity: 0.85 }}
        overflow="visible"
      >
        {/* Grid */}
        {[80,160,240,320,400,480,560].map((x,i) => (
          <line key={`gx${x}`} x1={x} y1={20} x2={x} y2={360}
            stroke="#C4A882" strokeWidth={0.3} opacity={0.1}
            pathLength="1" strokeDasharray="1" strokeDashoffset="1"
            style={{ animation: `arch-draw 400ms ease forwards ${i*20}ms` }}
          />
        ))}
        {[60,120,180,240,300,360].map((y,i) => (
          <line key={`gy${y}`} x1={40} y1={y} x2={560} y2={y}
            stroke="#C4A882" strokeWidth={0.3} opacity={0.1}
            pathLength="1" strokeDasharray="1" strokeDashoffset="1"
            style={{ animation: `arch-draw 400ms ease forwards ${i*20}ms` }}
          />
        ))}

        {/* Outer walls */}
        <line x1={80} y1={50} x2={520} y2={50} stroke="#F7F0E3" strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 600ms ease forwards 80ms" }} />
        <line x1={520} y1={50} x2={520} y2={280} stroke="#F7F0E3" strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 500ms ease forwards 380ms" }} />
        <line x1={520} y1={280} x2={380} y2={280} stroke="#F7F0E3" strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 300ms ease forwards 600ms" }} />
        <line x1={380} y1={280} x2={380} y2={340} stroke="#F7F0E3" strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 150ms ease forwards 740ms" }} />
        <line x1={380} y1={340} x2={80} y2={340} stroke="#F7F0E3" strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 400ms ease forwards 820ms" }} />
        <line x1={80} y1={340} x2={80} y2={50} stroke="#F7F0E3" strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 550ms ease forwards 1050ms" }} />

        {/* Inner wall */}
        <line x1={80} y1={200} x2={260} y2={200} stroke="#C4A882" strokeWidth={1.2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 350ms ease forwards 1150ms" }} />
        <line x1={310} y1={200} x2={520} y2={200} stroke="#C4A882" strokeWidth={1.2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 350ms ease forwards 1220ms" }} />
        <line x1={300} y1={50} x2={300} y2={200} stroke="#C4A882" strokeWidth={1.2} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 300ms ease forwards 1300ms" }} />

        {/* Door arc */}
        <path d="M 260,200 A 50,50 0 0 0 260,150" fill="none" stroke="#C4A882" strokeWidth={0.9} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 350ms ease forwards 1380ms" }} />

        {/* Room labels */}
        <text x="185" y="135" fill="#F7F0E3" fontSize="8" fontFamily="Inter, sans-serif" letterSpacing="0.2em" textAnchor="middle" opacity="0" style={{ animation: "arch-fade 400ms ease forwards 1500ms" }}>LIVING ROOM</text>
        <text x="415" y="135" fill="#F7F0E3" fontSize="8" fontFamily="Inter, sans-serif" letterSpacing="0.2em" textAnchor="middle" opacity="0" style={{ animation: "arch-fade 400ms ease forwards 1560ms" }}>STUDIO</text>
        <text x="200" y="280" fill="#C4A882" fontSize="7.5" fontFamily="Inter, sans-serif" letterSpacing="0.2em" textAnchor="middle" opacity="0" style={{ animation: "arch-fade 400ms ease forwards 1600ms" }}>KITCHEN / DINING</text>

        {/* Dimension ticks */}
        <line x1={80} y1={30} x2={520} y2={30} stroke="#C4A882" strokeWidth={0.6} opacity={0.4} pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: "arch-draw 400ms ease forwards 1420ms" }} />
        <text x="300" y="25" fill="#C4A882" fontSize="7" fontFamily="Inter, sans-serif" letterSpacing="0.2em" textAnchor="middle" opacity="0" style={{ animation: "arch-fade 300ms ease forwards 1680ms" }}>26.0 M</text>
      </svg>

      {/* Loading text */}
      <div style={{
        marginTop: 28,
        fontFamily: "Inter, sans-serif",
        fontSize: "9px", letterSpacing: "0.35em",
        color: "#C4A882", textTransform: "uppercase",
        opacity: 0,
        animation: "arch-fade 500ms ease forwards 1600ms",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>BUILDING 3D SCENE</span>
        <span style={{ animation: "placeholder-dots 1.4s steps(3,end) infinite 1800ms" }}>...</span>
      </div>
    </div>
  );
}
