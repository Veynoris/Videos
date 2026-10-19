import React from "react";
import { C, F } from "../lib/theme";
import { LUNAR_YEAR, SOLAR_YEAR } from "../lib/astro";

const COLS = 20;
const GAP = 21;
const DOT = 5.2;

type GridProps = {
  x: number;
  y: number;
  filled: number;
  ghosts: number;
  color: string;
  glow: string;
  appear: number;
  pulse: number; // 0..1 emphasis on years beyond 300
  frame: number;
};

const Grid: React.FC<GridProps> = ({ x, y, filled, ghosts, color, glow, appear, pulse, frame }) => {
  const dots: React.ReactNode[] = [];
  const total = Math.max(filled, ghosts);
  for (let i = 0; i < total; i++) {
    const cx = x + (i % COLS) * GAP;
    const cy = y + Math.floor(i / COLS) * GAP;
    const on = i < filled;
    const extra = i >= 300;
    const fresh = on && filled - i <= 6;
    const glowAmt = extra ? 0.7 + 0.3 * Math.sin(frame / 6 + i) * pulse : fresh ? 1 : 0;
    dots.push(
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={extra && on ? DOT + 1.6 : DOT}
        fill={on ? color : "none"}
        stroke={on ? "none" : C.faint}
        strokeWidth={1.4}
        opacity={(on ? 1 : 0.9) * appear}
        style={glowAmt > 0 ? { filter: `drop-shadow(0 0 ${6 + glowAmt * 10}px ${glow})` } : undefined}
      />,
    );
  }
  return <g>{dots}</g>;
};

export const GRID_W = (COLS - 1) * GAP;

// One dot = one year. Both grids are driven by the same number of elapsed days.
export const YearGrids: React.FC<{ d: number; appear: number; pulse: number; frame: number }> = ({ d, appear, pulse, frame }) => {
  const sun = Math.min(300, Math.floor(d / SOLAR_YEAR + 1e-9));
  const moon = Math.min(309, Math.floor(d / LUNAR_YEAR + 1e-9));
  const leftX = 290 - GRID_W / 2;
  const rightX = 790 - GRID_W / 2;
  return (
    <svg width={1080} height={500} viewBox="0 0 1080 500" style={{ overflow: "visible" }}>
      <Grid x={leftX} y={20} filled={sun} ghosts={300} color={C.sun} glow={C.sunGlow} appear={appear} pulse={pulse} frame={frame} />
      <Grid x={rightX} y={20} filled={moon} ghosts={300} color={C.moon} glow={C.moonGlow} appear={appear} pulse={pulse} frame={frame} />
      <text x={290} y={478} textAnchor="middle" fill={C.ink} opacity={appear} style={{ fontFamily: F.serif, fontSize: 120, fontVariantNumeric: "tabular-nums" }}>
        {sun}
      </text>
      <text x={790} y={478} textAnchor="middle" fill={moon > 300 ? C.moon : C.ink} opacity={appear} style={{ fontFamily: F.serif, fontSize: 120, fontVariantNumeric: "tabular-nums", filter: moon > 300 ? `drop-shadow(0 0 ${18 * pulse}px ${C.moonGlow})` : undefined }}>
        {moon}
      </text>
    </svg>
  );
};
