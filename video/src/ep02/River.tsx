import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

const rnd = (i: number, n: number) => {
  const x = Math.sin(i * 51.7 + n * 13.3) * 43758.5453;
  return x - Math.floor(x);
};
const RIPPLES = Array.from({ length: 34 }, (_, i) => ({ y: rnd(i, 1), len: 120 + rnd(i, 2) * 420, x: rnd(i, 3), sp: 0.6 + rnd(i, 4) * 1.4, o: 0.15 + rnd(i, 5) * 0.4 }));
const REEDS = Array.from({ length: 26 }, (_, i) => ({ x: i < 13 ? rnd(i, 6) * 170 : 910 + rnd(i, 6) * 170, h: 120 + rnd(i, 7) * 260, lean: (rnd(i, 8) - 0.5) * 30, ph: rnd(i, 9) * 6 }));

// The Nile at night: moonlit surface, drifting ripples, a column of reflected moonlight, papyrus at the banks.
export const River: React.FC<{ top?: number; opacity?: number }> = ({ top = 1260, opacity = 1 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const h = 1920 - top;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#13213C" />
          <stop offset="100%" stopColor="#050A14" />
        </linearGradient>
      </defs>
      <rect x={0} y={top} width={1080} height={h} fill="url(#water)" />
      <line x1={0} x2={1080} y1={top} y2={top} stroke="rgba(191,208,234,0.35)" strokeWidth={1.5} />
      {/* moonlight column */}
      {Array.from({ length: 22 }, (_, i) => {
        const yy = top + 18 + i * (h / 24);
        const w = (30 + i * 9) * (0.7 + 0.3 * Math.sin(t * 2 + i));
        return <rect key={`m${i}`} x={600 - w / 2 + Math.sin(t * 1.3 + i * 0.7) * 10} y={yy} width={w} height={2.2} rx={1} fill={C.moon} opacity={0.35 * (1 - i / 26)} />;
      })}
      {RIPPLES.map((r, i) => {
        const y = top + 20 + r.y * (h - 40);
        const persp = 0.5 + (y - top) / h;
        const x = ((r.x * 1500 + t * 40 * r.sp * persp) % 1500) - 300;
        return <rect key={i} x={x} y={y} width={r.len * persp} height={1.6 * persp} rx={1} fill="#BFD0EA" opacity={r.o * 0.6} />;
      })}
      {REEDS.map((r, i) => {
        const sway = Math.sin(t * 0.8 + r.ph) * 6;
        return <path key={`r${i}`} d={`M${r.x},${top + 30} Q${r.x + r.lean * 0.5 + sway},${top - r.h * 0.5} ${r.x + r.lean + sway * 1.6},${top - r.h}`} stroke="#03060C" strokeWidth={4} fill="none" />;
      })}
    </svg>
  );
};

// A closed chest (al-tābūt, cf. Ṭā-Hā 20:39) floating on the water — no figure is ever shown.
export const Chest: React.FC<{ x: number; y: number; scale?: number; glow?: number }> = ({ x, y, scale = 1, glow = 0.6 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 14) * 5;
  const tilt = Math.sin(f / 19) * 3;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      <g transform={`translate(${x} ${y + bob}) rotate(${tilt}) scale(${scale})`}>
        <ellipse cx={0} cy={26} rx={110} ry={14} fill="rgba(233,185,110,0.18)" style={{ filter: "blur(8px)" }} />
        <circle cx={0} cy={-10} r={120} fill={`rgba(233,185,110,${0.12 * glow})`} style={{ filter: "blur(30px)" }} />
        <path d="M-78,-8 L78,-8 L66,22 L-66,22 Z" fill="#2A1C10" stroke="rgba(233,185,110,0.7)" strokeWidth={2} />
        <path d="M-82,-10 Q0,-46 82,-10 Z" fill="#3A2614" stroke="rgba(233,185,110,0.75)" strokeWidth={2} />
        <line x1={-60} x2={60} y1={6} y2={6} stroke="rgba(233,185,110,0.35)" strokeWidth={1.5} />
      </g>
    </svg>
  );
};
