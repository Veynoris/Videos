import React from "react";
import { C, F } from "../lib/theme";

// Top-down diagram: compass ring, a cave (thick rock ring with one opening), and the sun on its daily path.
// Bearings are compass degrees (0 = North, 90 = East, clockwise). North is up.
export const CX = 540;
export const CY = 900;
const R_SUN = 390;
const ROCK_OUT = 175;
const ROCK_IN = 98;
const GAP = 26; // half-width of the opening, degrees

const pt = (bearing: number, r: number) => {
  const a = (bearing * Math.PI) / 180;
  return [CX + Math.sin(a) * r, CY - Math.cos(a) * r] as const;
};
const angDiff = (a: number, b: number) => {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
};

// How much direct sunlight reaches the chamber floor for a given sun bearing and opening bearing.
export const sunlightInside = (sunAz: number, opening: number) => {
  const d = angDiff(sunAz, opening);
  return d < 80 ? Math.pow(1 - d / 80, 0.7) : 0;
};

const rockPath = (opening: number) => {
  const pts: string[] = [];
  const steps = 60;
  const a0 = opening + GAP;
  const a1 = opening + 360 - GAP;
  for (let i = 0; i <= steps; i++) {
    const b = a0 + ((a1 - a0) * i) / steps;
    const j = 1 + Math.sin((b * Math.PI) / 90) * 0.035 + Math.sin((b * Math.PI) / 50 + 1.3) * 0.025;
    const [x, y] = pt(b, ROCK_OUT * j);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  for (let i = steps; i >= 0; i--) {
    const b = a0 + ((a1 - a0) * i) / steps;
    const [x, y] = pt(b, ROCK_IN);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
};

type Props = {
  opening: number;
  sunAz: number;
  sunOn: number; // 0..1 visibility of the sun
  appear: number;
  showPath?: number;
  labels?: number; // 0..1 compass letters
  sideNotes?: number; // 0..1 "right"/"left" notes for the north-facing case
};

export const CaveMap: React.FC<Props> = ({ opening, sunAz, sunOn, appear, showPath = 1, labels = 1, sideNotes = 0 }) => {
  const [sx, sy] = pt(sunAz, R_SUN);
  const lit = sunlightInside(sunAz, opening) * sunOn;
  const [e1x, e1y] = pt(opening - GAP, ROCK_OUT);
  const [e2x, e2y] = pt(opening + GAP, ROCK_OUT);
  const [i1x, i1y] = pt(opening + 180 - 40, ROCK_IN);
  const [i2x, i2y] = pt(opening + 180 + 40, ROCK_IN);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: appear, overflow: "visible" }}>
      <defs>
        <radialGradient id="floorlight">
          <stop offset="0%" stopColor="#FFE6B0" stopOpacity={0.95} />
          <stop offset="70%" stopColor={C.sun} stopOpacity={0.35} />
          <stop offset="100%" stopColor={C.sun} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* compass */}
      <circle cx={CX} cy={CY} r={R_SUN} fill="none" stroke={C.faint} strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={R_SUN + 34} fill="none" stroke={C.faint} strokeWidth={1} strokeDasharray="2 12" />
      {Array.from({ length: 72 }, (_, i) => {
        const [x0, y0] = pt(i * 5, R_SUN - (i % 18 === 0 ? 22 : 10));
        const [x1, y1] = pt(i * 5, R_SUN);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.faint} strokeWidth={i % 18 === 0 ? 2 : 1} />;
      })}
      {(["N", "E", "S", "W"] as const).map((L, i) => {
        const [x, y] = pt(i * 90, R_SUN + 70);
        return (
          <text key={L} x={x} y={y + 12} textAnchor="middle" fill={L === "N" ? C.ink : C.dim} opacity={labels} style={{ fontFamily: F.mono, fontSize: 34, letterSpacing: "0.1em" }}>
            {L}
          </text>
        );
      })}
      {/* the sun's daily path: east -> south -> west */}
      <path d={`M${pt(90, R_SUN)[0]},${pt(90, R_SUN)[1]} A${R_SUN},${R_SUN} 0 0 1 ${pt(270, R_SUN)[0]},${pt(270, R_SUN)[1]}`} fill="none" stroke={C.sun} strokeWidth={2} strokeDasharray="6 10" opacity={0.35 * showPath} />
      {/* light entering the cave */}
      {lit > 0 && (
        <g opacity={lit}>
          <polygon points={`${sx},${sy} ${e1x},${e1y} ${i1x},${i1y} ${i2x},${i2y} ${e2x},${e2y}`} fill="rgba(255,226,170,0.16)" />
          <circle cx={CX} cy={CY} r={ROCK_IN} fill="url(#floorlight)" />
        </g>
      )}
      {/* chamber floor and the open space where they lay (no figures are drawn) */}
      <circle cx={CX} cy={CY} r={ROCK_IN} fill="rgba(12,20,36,0.9)" />
      <ellipse cx={CX} cy={CY} rx={46} ry={30} fill="none" stroke={lit > 0.05 ? "#FFE6B0" : C.moon} strokeDasharray="3 6" strokeWidth={1.6} opacity={0.7} />
      {lit > 0 && <circle cx={CX} cy={CY} r={ROCK_IN} fill="url(#floorlight)" opacity={lit * 0.8} />}
      {/* rock */}
      <path d={rockPath(opening)} fill="#060A12" stroke="rgba(233,185,110,0.35)" strokeWidth={2} />
      {/* opening marker */}
      <line x1={pt(opening, ROCK_OUT + 20)[0]} y1={pt(opening, ROCK_OUT + 20)[1]} x2={pt(opening, ROCK_OUT + 70)[0]} y2={pt(opening, ROCK_OUT + 70)[1]} stroke={C.ink} strokeWidth={2} opacity={0.6} />
      {/* sun */}
      <g opacity={sunOn}>
        <circle cx={sx} cy={sy} r={90} fill={C.sun} opacity={0.12} style={{ filter: "blur(16px)" }} />
        <circle cx={sx} cy={sy} r={28} fill="#FFE9BE" style={{ filter: `drop-shadow(0 0 22px ${C.sunGlow})` }} />
      </g>
      {/* right / left notes for the north-facing cave */}
      <g opacity={sideNotes}>
        <text x={pt(90, R_SUN + 70)[0] - 6} y={pt(90, R_SUN + 70)[1] + 62} textAnchor="end" fill={C.sun} style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 34 }}>
          rises · turns right
        </text>
        <text x={pt(270, R_SUN + 70)[0] + 6} y={pt(270, R_SUN + 70)[1] + 62} textAnchor="start" fill={C.moon} style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 34 }}>
          sets · passes left
        </text>
      </g>
    </svg>
  );
};
