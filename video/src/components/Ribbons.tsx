import React from "react";
import { C, F } from "../lib/theme";
import { LUNAR_YEAR, SOLAR_YEAR, SPAN_DAYS } from "../lib/astro";

const X0 = 70;
const W = 940;
const SUN_Y = 0;
const MOON_Y = 150;
const H = 84;

export const ribbonX = (days: number) => X0 + (W * days) / SPAN_DAYS;

// Two calendars over the same span of days: 300 solar-year ticks above, 309 lunar-year ticks below.
// A beam of time sweeps across both; century markers on the sun line connect to the moon line at the same day.
export const Ribbons: React.FC<{ d: number; appear: number; centuries: number[] }> = ({ d, appear, centuries }) => {
  const sunN = Math.min(300, Math.floor(d / SOLAR_YEAR + 1e-9));
  const moonN = Math.min(309, Math.floor(d / LUNAR_YEAR + 1e-9));
  const cx = ribbonX(d);
  const ticks: React.ReactNode[] = [];
  for (let i = 1; i <= 300; i++) {
    const x = ribbonX(i * SOLAR_YEAR);
    const on = i <= sunN;
    const major = i % 100 === 0;
    ticks.push(<line key={`s${i}`} x1={x} x2={x} y1={SUN_Y + (major ? 0 : 18)} y2={SUN_Y + H} stroke={on ? C.sun : C.faint} strokeWidth={major ? 2.6 : 1.4} opacity={on ? 0.95 : 0.6} />);
  }
  for (let i = 1; i <= 309; i++) {
    const x = ribbonX(i * LUNAR_YEAR);
    const on = i <= moonN;
    ticks.push(<line key={`m${i}`} x1={x} x2={x} y1={MOON_Y} y2={MOON_Y + H - 18} stroke={on ? C.moon : C.faint} strokeWidth={1.4} opacity={on ? 0.95 : 0.6} />);
  }
  return (
    <svg width={1080} height={340} viewBox="0 -60 1080 340" style={{ overflow: "visible", opacity: appear }}>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="20%" stopColor="#FFF6E6" stopOpacity={0.9} />
          <stop offset="80%" stopColor="#FFF6E6" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* ribbon beds */}
      <rect x={X0 - 14} y={SUN_Y - 10} width={W + 28} height={H + 20} rx={14} fill="rgba(233,185,110,0.05)" stroke="rgba(233,185,110,0.18)" />
      <rect x={X0 - 14} y={MOON_Y - 10} width={W + 28} height={H + 20} rx={14} fill="rgba(191,208,234,0.05)" stroke="rgba(191,208,234,0.18)" />
      {/* passed-time fill */}
      <rect x={X0} y={SUN_Y} width={Math.max(0, cx - X0)} height={H} fill="rgba(233,185,110,0.08)" />
      <rect x={X0} y={MOON_Y} width={Math.max(0, cx - X0)} height={H - 18} fill="rgba(191,208,234,0.08)" />
      {ticks}
      {/* century connectors: same day, different count */}
      {[1, 2, 3].map((k) => {
        const x = ribbonX(k * 100 * SOLAR_YEAR);
        const lit = centuries[k - 1] ?? 0;
        return (
          <g key={k} opacity={0.25 + lit * 0.75}>
            <line x1={x} x2={x} y1={SUN_Y + H + 10} y2={MOON_Y - 10} stroke="#FFF6E6" strokeWidth={1.5} strokeDasharray="4 6" />
            <text x={x} y={SUN_Y - 22} textAnchor="middle" fill={C.sun} style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.12em" }}>
              {k * 100}
            </text>
            <text x={x} y={MOON_Y + H + 26} textAnchor="middle" fill={C.moon} style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.12em" }}>
              {k === 3 ? 309 : k * 100 + k * 3}
            </text>
          </g>
        );
      })}
      {/* the beam of time */}
      {appear > 0 && d > 0 && d < SPAN_DAYS && (
        <g>
          <rect x={cx - 1.5} y={SUN_Y - 40} width={3} height={MOON_Y + H + 70} fill="url(#beam)" style={{ filter: "drop-shadow(0 0 10px rgba(255,240,210,0.8))" }} />
          <circle cx={cx} cy={SUN_Y - 40} r={5} fill="#FFF6E6" />
        </g>
      )}
    </svg>
  );
};
