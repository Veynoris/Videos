import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

// Blazing sun disc with a slowly turning corona (behind "300").
export const SunDisc: React.FC<{ cx: number; cy: number; r: number; p: number }> = ({ cx, cy, r, p }) => {
  const f = useCurrentFrame();
  const R = r * 3;
  return (
    <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, opacity: p, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-conic-gradient(from ${f * 0.12}deg, rgba(233,185,110,0.16) 0deg 1.6deg, transparent 1.6deg 6deg)`,
          WebkitMaskImage: `radial-gradient(circle, transparent ${r * 0.9}px, black ${r * 1.05}px, transparent ${R}px)`,
          maskImage: `radial-gradient(circle, transparent ${r * 0.9}px, black ${r * 1.05}px, transparent ${R}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle, rgba(255,226,170,0.42) 0px, rgba(233,185,110,0.30) ${r * 0.85}px, rgba(233,185,110,0.10) ${r * 1.1}px, rgba(233,185,110,0.05) ${r * 1.8}px, transparent ${R}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: R - r,
          top: R - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,220,160,0.35)",
          boxShadow: `0 0 80px ${C.sunGlow}, inset 0 0 60px rgba(255,220,160,0.25)`,
        }}
      />
    </div>
  );
};

// Thin crescent moon with soft glow (behind "+9").
export const Crescent: React.FC<{ cx: number; cy: number; r: number; p: number }> = ({ cx, cy, r, p }) => {
  const size = r * 4;
  const o = size / 2;
  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", left: cx - o, top: cy - o, opacity: p, overflow: "visible", pointerEvents: "none" }}
    >
      <defs>
        <mask id="crescent-cut">
          <rect width={size} height={size} fill="white" />
          <circle cx={o + r * 0.42} cy={o - r * 0.16} r={r * 0.86} fill="black" />
        </mask>
        <radialGradient id="moon-halo">
          <stop offset="0%" stopColor={C.moon} stopOpacity={0.28} />
          <stop offset="100%" stopColor={C.moon} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={o} cy={o} r={r * 2} fill="url(#moon-halo)" />
      <circle
        cx={o}
        cy={o}
        r={r}
        fill={C.moon}
        mask="url(#crescent-cut)"
        opacity={0.42}
        style={{ filter: `drop-shadow(0 0 24px ${C.moonGlow})` }}
      />
    </svg>
  );
};
