"use client";

// Minimal placeholder — matches hero background, thin progress pulse at bottom.
// The actual fade-out is handled by Hero3D via CSS transition so there's no hard pop.
export function Hero3DPlaceholder() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#2C1F14" }}>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
        background: "rgba(196,168,130,0.08)",
      }}>
        <div style={{
          height: "100%", background: "#C4A882",
          animation: "arch-progress 8s cubic-bezier(0.25,0,0.1,1) forwards",
          transformOrigin: "left center",
        }} />
      </div>
    </div>
  );
}
