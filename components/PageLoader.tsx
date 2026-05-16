"use client";

import { useEffect, useState } from "react";

const DRAW_MS = 700;
const EXIT_MS = 500;
const STORAGE_KEY = "rt_loader_shown";

function Line({ x1, y1, x2, y2, delay = 0, dur = 600, stroke = "#C4A882", sw = 1.2, op = 1 }: {
  x1: number; y1: number; x2: number; y2: number;
  delay?: number; dur?: number; stroke?: string; sw?: number; op?: number;
}) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={stroke} strokeWidth={sw} opacity={op}
      pathLength="1" strokeDasharray="1" strokeDashoffset="1"
      style={{ animation: `arch-draw ${dur}ms ease forwards ${delay}ms` }}
    />
  );
}

function Arc({ d, delay = 0, dur = 400, stroke = "#C4A882", sw = 1.2 }: {
  d: string; delay?: number; dur?: number; stroke?: string; sw?: number;
}) {
  return (
    <path
      d={d} fill="none"
      stroke={stroke} strokeWidth={sw}
      pathLength="1" strokeDasharray="1" strokeDashoffset="1"
      style={{ animation: `arch-draw ${dur}ms ease forwards ${delay}ms` }}
    />
  );
}

function Label({ x, y, text, delay = 0, size = 9, color = "#C4A882", tracking = "0.25em", anchor = "middle", op = 1 }: {
  x: number; y: number; text: string; delay?: number;
  size?: number; color?: string; tracking?: string; anchor?: string; op?: number;
}) {
  return (
    <text
      x={x} y={y} fill={color} fontSize={size}
      fontFamily="var(--font-geist-sans), sans-serif"
      letterSpacing={tracking} textAnchor={anchor as "middle" | "start" | "end"}
      opacity={op}
      style={{ animation: `arch-fade ${400}ms ease forwards ${delay}ms` }}
    >
      {text}
    </text>
  );
}

export default function PageLoader({ onComplete }: { onComplete?: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = Boolean(nav.connection?.saveData);
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY) === "1";

    if (reduced || saveData || alreadyShown) {
      setSkip(true);
      onComplete?.();
      return;
    }

    setSkip(false);
    sessionStorage.setItem(STORAGE_KEY, "1");

    const raf = requestAnimationFrame(() => {
      const t1 = window.setTimeout(() => setExiting(true), DRAW_MS);
      const t2 = window.setTimeout(() => { setGone(true); onComplete?.(); }, DRAW_MS + EXIT_MS);
      (raf as unknown as { _t1?: number; _t2?: number })._t1 = t1;
      (raf as unknown as { _t1?: number; _t2?: number })._t2 = t2;
    });
    return () => {
      cancelAnimationFrame(raf);
      const r = raf as unknown as { _t1?: number; _t2?: number };
      if (r._t1) clearTimeout(r._t1);
      if (r._t2) clearTimeout(r._t2);
    };
  }, [onComplete]);

  if (skip === null) return null;
  if (skip) return null;
  if (gone) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#2C1F14",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
        transition: exiting ? `transform ${EXIT_MS}ms cubic-bezier(0.76,0,0.24,1)` : "none",
        overflow: "hidden",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* Brand — top left */}
      <div style={{
        position: "absolute", top: 28, left: 40,
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
        color: "#F7F0E3", letterSpacing: "0.04em",
        opacity: 0,
        animation: "arch-fade 600ms ease forwards 100ms",
      }}>
        retrotekt
      </div>

      {/* Subtitle — top right */}
      <div style={{
        position: "absolute", top: 32, right: 40,
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "9px", letterSpacing: "0.25em",
        color: "#C4A882", textTransform: "uppercase",
        opacity: 0,
        animation: "arch-fade 600ms ease forwards 200ms",
      }}>
        LOADING · ARCHITECTURAL STUDIO
      </div>

      {/* Main SVG floor plan */}
      <svg
        viewBox="0 0 820 500"
        style={{ width: "min(82vw, 680px)", height: "auto" }}
        overflow="visible"
      >
        {/* ── Grid lines (faint) ── */}
        {[120,180,240,300,360,420,480,540,600,660,720].map((x, i) => (
          <Line key={`gx${x}`} x1={x} y1={60} x2={x} y2={440}
            stroke="#C4A882" sw={0.3} op={0.12} delay={i * 18} dur={300} />
        ))}
        {[100,160,220,280,340,400].map((y, i) => (
          <Line key={`gy${y}`} x1={80} y1={y} x2={740} y2={y}
            stroke="#C4A882" sw={0.3} op={0.12} delay={i * 18} dur={300} />
        ))}

        {/* ── Outer walls (thick) ── */}
        {/* Top */}
        <Line x1={120} y1={80} x2={740} y2={80} sw={2.2} stroke="#F7F0E3" delay={250} dur={700} />
        {/* Right */}
        <Line x1={740} y1={80} x2={740} y2={340} sw={2.2} stroke="#F7F0E3" delay={550} dur={500} />
        {/* Step right */}
        <Line x1={740} y1={340} x2={560} y2={340} sw={2.2} stroke="#F7F0E3" delay={750} dur={350} />
        {/* Step down */}
        <Line x1={560} y1={340} x2={560} y2={440} sw={2.2} stroke="#F7F0E3" delay={880} dur={200} />
        {/* Bottom */}
        <Line x1={560} y1={440} x2={120} y2={440} sw={2.2} stroke="#F7F0E3" delay={960} dur={500} />
        {/* Left */}
        <Line x1={120} y1={440} x2={120} y2={80} sw={2.2} stroke="#F7F0E3" delay={1160} dur={650} />

        {/* ── Inner walls ── */}
        {/* Horizontal divider left side (with door gap 320-370) */}
        <Line x1={120} y1={270} x2={310} y2={270} sw={1.4} stroke="#C4A882" delay={1200} dur={380} />
        <Line x1={375} y1={270} x2={560} y2={270} sw={1.4} stroke="#C4A882" delay={1280} dur={380} />
        {/* Horizontal divider right side */}
        <Line x1={560} y1={270} x2={740} y2={270} sw={1.4} stroke="#C4A882" delay={1360} dur={330} />
        {/* Vertical divider - living/office split */}
        <Line x1={420} y1={80} x2={420} y2={270} sw={1.4} stroke="#C4A882" delay={1440} dur={350} />
        {/* Vertical divider - utility/kitchen */}
        <Line x1={290} y1={270} x2={290} y2={440} sw={1.4} stroke="#C4A882" delay={1520} dur={320} />

        {/* ── Door arc at gap ── */}
        <Arc d="M 310,270 A 65,65 0 0 0 310,205" delay={1620} dur={380} sw={1} />
        <Line x1={310} y1={205} x2={375} y2={270} sw={0.7} stroke="#C4A882" op={0.4} delay={1800} dur={200} />

        {/* ── Windows (breaks in walls) ── */}
        {/* Top wall windows */}
        <Line x1={200} y1={80} x2={240} y2={80} stroke="#2C1F14" sw={4} delay={0} dur={10} op={1} />
        <Line x1={199} y1={72} x2={241} y2={72} stroke="#C4A882" sw={0.8} op={0.7} delay={1700} dur={200} />
        <Line x1={199} y1={88} x2={241} y2={88} stroke="#C4A882" sw={0.8} op={0.7} delay={1700} dur={200} />
        <Line x1={199} y1={72} x2={199} y2={88} stroke="#C4A882" sw={0.8} op={0.7} delay={1700} dur={200} />
        <Line x1={241} y1={72} x2={241} y2={88} stroke="#C4A882" sw={0.8} op={0.7} delay={1700} dur={200} />

        <Line x1={580} y1={80} x2={640} y2={80} stroke="#2C1F14" sw={4} delay={0} dur={10} op={1} />
        <Line x1={579} y1={72} x2={641} y2={72} stroke="#C4A882" sw={0.8} op={0.7} delay={1750} dur={200} />
        <Line x1={579} y1={88} x2={641} y2={88} stroke="#C4A882" sw={0.8} op={0.7} delay={1750} dur={200} />
        <Line x1={579} y1={72} x2={579} y2={88} stroke="#C4A882" sw={0.8} op={0.7} delay={1750} dur={200} />
        <Line x1={641} y1={72} x2={641} y2={88} stroke="#C4A882" sw={0.8} op={0.7} delay={1750} dur={200} />

        {/* ── Dimension lines ── */}
        {/* Top horizontal */}
        <Line x1={120} y1={50} x2={740} y2={50} stroke="#C4A882" sw={0.7} op={0.5} delay={1820} dur={400} />
        <Line x1={120} y1={44} x2={120} y2={56} stroke="#C4A882" sw={0.7} op={0.5} delay={1820} dur={150} />
        <Line x1={740} y1={44} x2={740} y2={56} stroke="#C4A882" sw={0.7} op={0.5} delay={2000} dur={150} />
        {/* Left vertical */}
        <Line x1={90} y1={80} x2={90} y2={440} stroke="#C4A882" sw={0.7} op={0.5} delay={1860} dur={400} />
        <Line x1={84} y1={80} x2={96} y2={80} stroke="#C4A882" sw={0.7} op={0.5} delay={1860} dur={150} />
        <Line x1={84} y1={440} x2={96} y2={440} stroke="#C4A882" sw={0.7} op={0.5} delay={2050} dur={150} />

        {/* ── North arrow ── */}
        <Arc d="M 775,110 L 775,90 M 769,98 L 775,90 L 781,98" delay={1900} dur={300} sw={1} stroke="#C4A882" />
        <Label x={775} y={130} text="N" delay={2000} size={8} color="#C4A882" />

        {/* ── Room labels ── */}
        <Label x={265} y={185} text="LIVING AREA" delay={2100} size={8.5} color="#F7F0E3" op={0.6} />
        <Label x={590} y={185} text="STUDIO SUITE" delay={2150} size={8.5} color="#F7F0E3" />
        <Label x={200} y={360} text="ENTRY" delay={2200} size={8} color="#C4A882" />
        <Label x={420} y={365} text="OPEN KITCHEN" delay={2220} size={8.5} color="#F7F0E3" />
        <Label x={655} y={310} text="TERRACE" delay={2250} size={8} color="#C4A882" op={0.6} />

        {/* ── Dimension labels ── */}
        <Label x={430} y={43} text="26.0 M" delay={2050} size={7.5} color="#C4A882" op={0.6} />
        <Label x={75} y={265} text="14.0 M" delay={2080} size={7.5} color="#C4A882" op={0.6} anchor="end" />

        {/* ── Title block bottom right ── */}
        <Line x1={560} y1={385} x2={740} y2={385} stroke="#C4A882" sw={0.5} op={0.3} delay={2300} dur={200} />
        <Label x={650} y={400} text="GROUND FLOOR PLAN" delay={2350} size={7} color="#C4A882" op={0.45} />
        <Label x={650} y={415} text="SCALE 1:100" delay={2380} size={7} color="#C4A882" op={0.35} />
      </svg>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "2px", background: "rgba(196,168,130,0.1)",
      }}>
        <div style={{
          height: "100%", background: "#C4A882",
          animation: `arch-progress ${DRAW_MS}ms linear forwards`,
          transformOrigin: "left center",
        }} />
      </div>

      {/* Bottom status */}
      <div style={{
        position: "absolute", bottom: 18, left: 40,
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "8px", letterSpacing: "0.3em",
        color: "#C4A882", textTransform: "uppercase", opacity: 0.5,
        animation: "arch-fade 500ms ease forwards 300ms",
      }}>
        INITIALIZING SCENE
      </div>
    </div>
  );
}
