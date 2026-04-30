"use client";

const ITEMS = [
  <>Rendering luxury <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>kitchen</strong> remodel</>,
  <>Modeling 4-bed <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>residential exterior</strong></>,
  <>Visualizing open-concept <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>living space</strong></>,
  <>Rendering <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>master bath</strong> renovation</>,
  <>Modeling mixed-use commercial <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>facade</strong></>,
  <>Visualizing rooftop <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>terrace</strong> addition</>,
  <>Rendering suburban <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>home</strong> extension</>,
  <>Modeling boutique retail <strong style={{ fontWeight: 600, color: "#F7F0E3" }}>storefront</strong></>,
];

const track = [...ITEMS, ...ITEMS];

const BG = "#2C1F14";

export function LiveProjectsTicker() {
  return (
    <div
      className="ticker-root"
      style={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "11px 0",
        position: "relative",
        backgroundColor: BG,
      }}
      aria-label="Live projects ticker"
    >
      {/* Fixed left label */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 18,
          paddingRight: 18,
          zIndex: 2,
          position: "relative",
        }}
      >
        {/* Soft radial glow behind label */}
        <span
          className="ticker-label-glow"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-12px -8px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, #C4A882 0%, transparent 70%)",
            animation: "ticker-label-glow 3.2s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        {/* Pulsing dot */}
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#C4A882",
            flexShrink: 0,
            animation: "ticker-dot-pulse 2.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            position: "relative",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#F7F0E3",
            opacity: 0.7,
            whiteSpace: "nowrap",
          }}
        >
          Live Projects
        </span>
        {/* Thin vertical divider */}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            width: 1,
            height: 11,
            background: "#F7F0E3",
            opacity: 0.2,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Left fade — fades items into the dark brown */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 64,
            background: `linear-gradient(to right, ${BG}, transparent)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        {/* Right fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 64,
            background: `linear-gradient(to left, ${BG}, transparent)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div
          className="ticker-track"
          style={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
          }}
        >
          {track.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(247, 240, 227, 0.55)",
                whiteSpace: "nowrap",
                paddingRight: 80,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
