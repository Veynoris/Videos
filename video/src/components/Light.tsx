import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

// Anamorphic lens flare: long horizontal streak, hot core, two soft ghosts along the axis.
export const Flare: React.FC<{ cx: number; cy: number; p: number; color?: string; width?: number }> = ({
  cx,
  cy,
  p,
  color = C.moon,
  width = 1500,
}) => {
  if (p <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div
        style={{
          position: "absolute",
          left: cx - (width * (0.55 + p * 0.45)) / 2,
          top: cy - 3,
          width: width * (0.55 + p * 0.45),
          height: 6,
          borderRadius: 6,
          opacity: p,
          background: `linear-gradient(90deg, transparent, ${color} 35%, #FFFFFF 50%, ${color} 65%, transparent)`,
          filter: "blur(3px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - 260,
          top: cy - 18,
          width: 520,
          height: 36,
          opacity: p * 0.55,
          background: `radial-gradient(closest-side, ${color}, transparent)`,
          filter: "blur(6px)",
        }}
      />
      <div style={{ position: "absolute", left: cx - 70, top: cy - 70, width: 140, height: 140, borderRadius: 70, opacity: p * 0.8, background: `radial-gradient(circle, #FFFFFF 0%, ${color} 25%, transparent 70%)` }} />
      {[0.55, 1.25].map((k, i) => {
        const gx = cx + (540 - cx) * k * 2;
        const gy = cy + (960 - cy) * k * 2;
        const r = i === 0 ? 46 : 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx - r,
              top: gy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              opacity: p * (i === 0 ? 0.18 : 0.1),
              border: `1.5px solid ${color}`,
              background: `radial-gradient(circle, transparent 55%, ${color} 140%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Full-frame bloom used as a light transition (p: 0 -> 1 -> 0 envelope supplied by caller).
export const Bloom: React.FC<{ p: number; cx?: number; cy?: number; color?: string }> = ({ p, cx = 540, cy = 860, color = "255,226,170" }) =>
  p <= 0.001 ? null : (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: p,
        background: `radial-gradient(1400px 1400px at ${cx}px ${cy}px, rgba(${color},0.95) 0%, rgba(${color},0.45) 30%, rgba(${color},0.08) 65%, transparent 80%)`,
      }}
    />
  );

// Islamic eight-point-star rosette, drawn as fine gold line-work and turning very slowly.
export const Rosette: React.FC<{ cx: number; cy: number; r: number; opacity: number; speed?: number }> = ({
  cx,
  cy,
  r,
  opacity,
  speed = 0.06,
}) => {
  const f = useCurrentFrame();
  const rings = [0.34, 0.62, 1];
  const square = (rad: number, rot: number) => {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = ((rot + 45 + i * 90) * Math.PI) / 180;
      return `${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`;
    });
    return `M${pts.join(" L")} Z`;
  };
  return (
    <svg
      width={r * 2 + 20}
      height={r * 2 + 20}
      viewBox={`${-r - 10} ${-r - 10} ${r * 2 + 20} ${r * 2 + 20}`}
      style={{ position: "absolute", left: cx - r - 10, top: cy - r - 10, opacity, pointerEvents: "none", transform: `rotate(${f * speed}deg)` }}
    >
      {rings.map((k, i) => (
        <g key={i} stroke={C.sun} strokeWidth={1.2} fill="none" opacity={0.9 - i * 0.2}>
          <path d={square(r * k, 0)} />
          <path d={square(r * k, 45)} />
          <circle r={r * k * 0.76} />
          {i === 2 && <circle r={r * k} strokeDasharray="2 10" />}
        </g>
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * 22.5 * Math.PI) / 180;
        return <line key={i} x1={Math.cos(a) * r * 0.34} y1={Math.sin(a) * r * 0.34} x2={Math.cos(a) * r * 0.62} y2={Math.sin(a) * r * 0.62} stroke={C.sun} strokeWidth={0.8} opacity={0.5} />;
      })}
    </svg>
  );
};

// Small eight-point star used as a title ornament.
export const StarMark: React.FC<{ size?: number; p?: number; color?: string }> = ({ size = 26, p = 1, color = C.sun }) => {
  const s = size / 2;
  const sq = (rot: number) =>
    [0, 1, 2, 3]
      .map((i) => {
        const a = ((rot + 45 + i * 90) * Math.PI) / 180;
        return `${(s + Math.cos(a) * s * 0.92).toFixed(1)},${(s + Math.sin(a) * s * 0.92).toFixed(1)}`;
      })
      .join(" ");
  return (
    <svg width={size} height={size} style={{ opacity: p, overflow: "visible", filter: `drop-shadow(0 0 8px ${C.sunGlow})` }}>
      <polygon points={sq(0)} fill="none" stroke={color} strokeWidth={1.4} />
      <polygon points={sq(45)} fill="none" stroke={color} strokeWidth={1.4} />
      <circle cx={s} cy={s} r={s * 0.18} fill={color} />
    </svg>
  );
};
