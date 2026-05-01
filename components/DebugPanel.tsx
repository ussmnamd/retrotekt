"use client";

import { useEffect, useState } from "react";

// In production, Next.js will statically replace process.env.NODE_ENV === "production"
// with `true` and dead-code-eliminate the entire panel body at build time.
const IS_PROD = process.env.NODE_ENV === "production";

function DebugPanelDev() {
  const [logs, setLogs] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setLogs((prev) => [...prev.slice(-19), `[LOG] ${args.join(" ")}`]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs((prev) => [...prev.slice(-19), `[ERR] ${args.join(" ")}`]);
      originalError(...args);
    };

    // Toggle with Shift + D
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && e.shiftKey) setVisible((v) => !v);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 10, left: 10, zIndex: 100000,
      background: "rgba(0,0,0,0.85)", color: "#00ff00",
      padding: "15px", borderRadius: "8px", fontSize: "10px",
      fontFamily: "monospace", maxWidth: "400px", pointerEvents: "none"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#fff" }}>RETROTEKT DEBUG PANEL (Shift + D to hide)</div>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: "2px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default function DebugPanel() {
  if (IS_PROD) return null;
  return <DebugPanelDev />;
}
