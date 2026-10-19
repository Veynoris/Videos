import React from "react";

// A luminous body: hot core, soft halo, wide bloom. Rendered inside an <svg>.
export const Orb: React.FC<{ id: string; cx: number; cy: number; r: number; color: string; intensity?: number }> = ({
  id,
  cx,
  cy,
  r,
  color,
  intensity = 1,
}) => (
  <g>
    <defs>
      <radialGradient id={`bloom-${id}`}>
        <stop offset="0%" stopColor={color} stopOpacity={0.55 * intensity} />
        <stop offset="35%" stopColor={color} stopOpacity={0.18 * intensity} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`core-${id}`}>
        <stop offset="0%" stopColor="#FFFBF2" />
        <stop offset="55%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity={0.9} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r * 6} fill={`url(#bloom-${id})`} />
    <circle cx={cx} cy={cy} r={r} fill={`url(#core-${id})`} />
  </g>
);

// Shockwave ring expanding from a point (p: 0 -> 1).
export const Shockwave: React.FC<{ cx: number; cy: number; p: number; color: string; max?: number }> = ({
  cx,
  cy,
  p,
  color,
  max = 420,
}) =>
  p <= 0 || p >= 1 ? null : (
    <g>
      <circle cx={cx} cy={cy} r={20 + p * max} fill="none" stroke={color} strokeWidth={3 * (1 - p) + 0.5} opacity={(1 - p) * 0.8} />
      <circle cx={cx} cy={cy} r={10 + p * max * 0.62} fill="none" stroke={color} strokeWidth={1.5} opacity={(1 - p) * 0.45} />
    </g>
  );
