import React from "react";
import { C, F } from "../lib/theme";
import { LUNAR_YEAR, SOLAR_YEAR } from "../lib/astro";
import { Orb } from "./Orb";

const R = 168;
const CIRC = 2 * Math.PI * R;

type OrbitProps = {
  cx: number;
  cy: number;
  frac: number; // 0..1 of one year completed
  color: string;
  glow: string;
  days: number;
  appear: number; // 0..1 entrance
  complete: number; // 0..1 completion flash
  remaining?: number; // 0..1 highlight of the arc still to travel
};

const Orbit: React.FC<OrbitProps> = ({ cx, cy, frac, color, glow, days, appear, complete, remaining = 0 }) => {
  const a = frac * Math.PI * 2 - Math.PI / 2;
  const bx = cx + Math.cos(a) * R;
  const by = cy + Math.sin(a) * R;
  return (
    <g opacity={appear}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.faint} strokeWidth={2} />
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${frac * CIRC} ${CIRC}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 ${8 + complete * 18}px ${glow})` }}
      />
      {remaining > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={`${(1 - frac) * CIRC} ${CIRC}`}
          strokeDashoffset={-frac * CIRC}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={remaining * 0.9}
          style={{ filter: `drop-shadow(0 0 14px ${glow})` }}
        />
      )}
      {Array.from({ length: 28 }, (_, k) => {
        // comet tail: short arc segments trailing the body, fading out
        const a0 = a - (k + 1) * 0.045;
        const a1 = a - k * 0.045;
        if (frac <= 0 || (k + 1) * 0.045 > frac * Math.PI * 2) return null;
        return (
          <path
            key={k}
            d={`M ${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} A ${R} ${R} 0 0 1 ${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R}`}
            stroke={color}
            strokeWidth={10 - k * 0.3}
            strokeLinecap="round"
            fill="none"
            opacity={(1 - k / 28) * 0.55}
          />
        );
      })}
      <Orb id={color.slice(1)} cx={bx} cy={by} r={15} color={color} intensity={1 + complete * 0.8} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={C.ink} style={{ fontFamily: F.serif, fontSize: 72, fontVariantNumeric: "tabular-nums" }}>
        {Math.floor(days)}
      </text>
      <text x={cx} y={cy + 40} textAnchor="middle" fill={C.dim} style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: "0.3em" }}>
        DAYS
      </text>
    </g>
  );
};

// Two calendars, one clock: `d` is the shared number of days elapsed.
export const Orbits: React.FC<{ d: number; appear: number; moonDone: number; sunDone: number; gap: number }> = ({
  d,
  appear,
  moonDone,
  sunDone,
  gap,
}) => {
  const sunFrac = Math.min(1, d / SOLAR_YEAR);
  const moonFrac = Math.min(1, d / LUNAR_YEAR);
  return (
    <svg width={1080} height={520} viewBox="0 0 1080 520" style={{ overflow: "visible" }}>
      <Orbit cx={290} cy={250} frac={sunFrac} color={C.sun} glow={C.sunGlow} days={Math.min(d, SOLAR_YEAR)} appear={appear} complete={sunDone} remaining={gap * (1 - sunDone)} />
      <text x={290} y={52} textAnchor="middle" fill={C.sun} opacity={gap} style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.3em", filter: `drop-shadow(0 0 10px ${C.sunGlow})` }}>
        11 DAYS LEFT
      </text>
      <Orbit cx={790} cy={250} frac={moonFrac} color={C.moon} glow={C.moonGlow} days={Math.min(d, LUNAR_YEAR)} appear={appear} complete={moonDone} />
    </svg>
  );
};
