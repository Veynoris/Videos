import React from "react";

// Shared particle systems. Every particle is a deterministic function of the frame, and the
// glow is drawn with radial gradients (not per-particle filters) so hundreds stay cheap to render.

const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const Glow: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor="#FFFDF4" stopOpacity={1} />
    <stop offset="0.25" stopColor={color} stopOpacity={0.9} />
    <stop offset="1" stopColor={color} stopOpacity={0} />
  </radialGradient>
);

// Drifting motes in three depth layers. `period` frames = one full rise; it should divide the
// reel's length so a looping reel ends exactly where it began.
export const Motes: React.FC<{ f: number; period: number; intensity?: number; color?: string; id?: string; count?: number }> = ({
  f,
  period,
  intensity = 1,
  color = "#F3D38A",
  id = "mote",
  count = 140,
}) => {
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const layer = i % 3; // 0 far, 1 mid, 2 near (bokeh)
    const speed = [1, 2, 3][layer];
    const ph = (rnd(i, 1) + (f / period) * speed) % 1;
    const y = 1980 - ph * 2080;
    const x = rnd(i, 2) * 1080 + Math.sin(f / (40 + layer * 25) + i) * (10 + layer * 18);
    const r = [1.6, 3.2, 9][layer] * (0.6 + rnd(i, 3) * 0.8);
    const tw = 0.55 + 0.45 * Math.sin(f / (6 + rnd(i, 4) * 10) + i * 3);
    const a = [0.7, 0.55, 0.18][layer] * tw * intensity * Math.min(1, Math.sin(ph * Math.PI) * 2.5);
    if (a <= 0.01) continue;
    items.push(<circle key={i} cx={x} cy={y} r={r * (layer === 2 ? 3 : 2.4)} fill={`url(#${id})`} opacity={a} />);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <Glow id={id} color={color} />
      </defs>
      {items}
    </svg>
  );
};

// A radial burst of sparks from (x, y), `t` frames after it fires. gravity > 0 pulls sparks down (sand).
export const Burst: React.FC<{ t: number; x: number; y: number; color?: string; n?: number; spread?: number; gravity?: number; dur?: number; up?: number; id: string; size?: number }> = ({
  t,
  x,
  y,
  color = "#F3D38A",
  n = 40,
  spread = 260,
  gravity = 0,
  dur = 50,
  up = 0,
  id,
  size = 4,
}) => {
  if (t < 0 || t > dur) return null;
  const p = t / dur;
  const ease = 1 - Math.pow(1 - p, 3);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = rnd(i, 7) * Math.PI * 2;
    const d = spread * (0.3 + rnd(i, 8) * 0.7) * ease;
    const px = x + Math.cos(a) * d;
    const py = y + Math.sin(a) * d * (gravity > 0 ? 0.45 : 1) - up * ease * (0.5 + rnd(i, 9)) + gravity * t * t * 0.02;
    const r = size * (0.5 + rnd(i, 10)) * (1 - p * 0.5);
    items.push(<circle key={i} cx={px} cy={py} r={r * 2.6} fill={`url(#${id})`} opacity={(1 - p) * (0.6 + rnd(i, 11) * 0.4)} />);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <Glow id={id} color={color} />
      </defs>
      <circle cx={x} cy={y} r={30 + ease * spread * 0.6} fill={`url(#${id})`} opacity={(1 - p) * 0.35} />
      {items}
    </svg>
  );
};

// Sparks streaming along a line from (x1, y1) to (x2, y2).
export const Stream: React.FC<{ f: number; x1: number; y1: number; x2: number; y2: number; a: number; id: string; color: string; n?: number; speed?: number }> = ({ f, x1, y1, x2, y2, a, id, color, n = 8, speed = 40 }) => {
  if (a <= 0) return null;
  return (
    <g>
      <defs>
        <Glow id={id} color={color} />
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const ph = (f / speed + i / n + rnd(i, 12) * 0.1) % 1;
        return <circle key={i} cx={x1 + (x2 - x1) * ph} cy={y1 + (y2 - y1) * ph} r={5 + rnd(i, 13) * 4} fill={`url(#${id})`} opacity={a * Math.sin(ph * Math.PI)} />;
      })}
    </g>
  );
};

// Sparks rising from the bottom of the frame (an ascending wave of light).
export const Rising: React.FC<{ t: number; dur?: number; n?: number; id: string; color?: string }> = ({ t, dur = 120, n = 90, id, color = "#F3D38A" }) => {
  if (t < 0 || t > dur) return null;
  const p = t / dur;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <Glow id={id} color={color} />
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const delay = rnd(i, 14) * 0.4;
        const q = Math.max(0, Math.min(1, (p - delay) / 0.6));
        if (q <= 0 || q >= 1) return null;
        const y = 1900 - q * (1300 + rnd(i, 15) * 500);
        const x = rnd(i, 16) * 1080 + Math.sin(q * 6 + i) * 30;
        return <circle key={i} cx={x} cy={y} r={(3 + rnd(i, 17) * 6) * 2.4} fill={`url(#${id})`} opacity={Math.sin(q * Math.PI) * 0.85} />;
      })}
    </svg>
  );
};
