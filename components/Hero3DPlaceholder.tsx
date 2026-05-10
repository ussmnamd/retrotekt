"use client";

// Minimal placeholder — matches hero background, thin progress pulse at bottom.
// The actual fade-out is handled by Hero3D via CSS transition so there's no hard pop.
export function Hero3DPlaceholder() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "transparent" }}>
    </div>
  );
}
