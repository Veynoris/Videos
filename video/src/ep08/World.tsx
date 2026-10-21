import React from "react";
import { interpolate } from "remotion";
import { CLAMP, easeInOut } from "../lib/anim";
import timeline from "./timeline.json";

// EP08 (21:87–88): one continuous camera through the sea. The surface at night, the plunge,
// the three darknesses closing in, his call lifting them, the rise to a dawn surface — and back
// down into the dark for the loop. No people or creatures are drawn: he is a single point of light,
// and the great fish is only the darkness that encloses it.

type Beat = [number, number];
export const T = timeline as unknown as Record<"hook" | "fall" | "dark" | "dua" | "answer" | "close", Beat> & { cue: Record<string, number & number[]> };
export const Q = T.cue as unknown as {
  hookDua: number; hookOut: number; lines: number[]; swallow: number; count: number[]; call: number; phrases: number[]; rise: number[]; save: number; hadith: number; down: number;
};
export const END = T.close[1];
export const GOLD = "#F3D38A";
export const GOLD_GLOW = "rgba(243,211,138,0.6)";
export const SEA = "#7FC8D8";
export const SEA_GLOW = "rgba(127,200,216,0.55)";

const E = { ...CLAMP, easing: easeInOut };
const at = {
  swallow: T.fall[0] + Q.swallow,
  night: T.dark[0] + Q.count[0],
  sea: T.dark[0] + Q.count[1],
  fish: T.dark[0] + Q.count[2],
  p1: T.dua[0] + Q.phrases[0],
  p2: T.dua[0] + Q.phrases[1],
  p3: T.dua[0] + Q.phrases[2],
  rise0: T.answer[0] + Q.rise[0],
  rise1: T.answer[0] + Q.rise[1],
  down: T.close[0] + Q.down,
};
export const AT = at;

// Camera depth 0 (at the surface) … 1 (the deepest dark). Frame 0 and END are both deep.
export const depth = (f: number) =>
  interpolate(f, [0, 150, 176, at.swallow, at.swallow + 70, at.fish, at.rise0, at.rise1, at.down, END - 4], [1, 1, 0, 0, 0.55, 1, 1, 0, 0, 1], E);
// The enclosure (the darkness within the fish): 1 = closed in around his light.
export const enclosure = (f: number) =>
  interpolate(f, [0, 150, 176, at.fish, at.fish + 40, at.p1, at.p1 + 40, at.down + 10, END - 4], [1, 1, 0, 0, 1, 1, 0, 0, 1], E);
// How black the water is (the darkness of the sea).
export const seaDark = (f: number) =>
  interpolate(f, [0, 150, 176, at.sea, at.sea + 40, at.p2, at.p2 + 40, at.rise1, at.down, END - 4], [1, 1, 0.15, 0.15, 1, 1, 0.45, 0, 0, 1], E);
// Light from above (moonlight at night, dawn after the answer); the darkness of the night takes it.
export const skyLight = (f: number) =>
  interpolate(f, [0, 150, 176, at.night, at.night + 40, at.p3, at.p3 + 40, at.rise1, at.down, END - 4], [0, 0, 0.6, 0.6, 0, 0, 0.7, 1, 1, 0], E);
export const dawn = (f: number) => interpolate(f, [at.rise0 + 40, at.rise1 + 20, at.down - 20, at.down + 20], [0, 1, 1, 0], E);
// His light: present from the swallowing on, and in the hook / loop point.
export const hisLight = (f: number) =>
  Math.max(interpolate(f, [0, 150, 168], [1, 1, 0], CLAMP), interpolate(f, [at.swallow + 30, at.swallow + 60, at.rise0, at.rise0 + 30], [0, 1, 1, 0], CLAMP), interpolate(f, [at.down + 20, END - 10], [0, 1], CLAMP));
export const blackout = (f: number) => interpolate(f, [140, 158, 168, 186], [0, 1, 1, 0], CLAMP);

export const LIGHT: [number, number] = [540, 1180];

const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// The surface: night sky above, moon, waves and the laden ship.
const Surface: React.FC<{ f: number; y: number; dawnA: number; shipA: number; moonA: number }> = ({ f, y, dawnA, shipA, moonA }) => {
  if (y < -40) return null;
  let wave = `M-20,${y}`;
  for (let x = -20; x <= 1100; x += 20) wave += ` L${x},${(y + Math.sin(x / 60 + f / 14) * 6 + Math.sin(x / 23 - f / 9) * 2.5).toFixed(1)}`;
  const shipX = 700 + Math.sin(f / 50) * 6;
  const bob = Math.sin(f / 18) * 4;
  return (
    <g>
      {/* sky */}
      <rect x={0} y={-40} width={1080} height={y + 40} fill="url(#sky)" />
      <rect x={0} y={-40} width={1080} height={y + 40} fill="url(#dawnSky)" opacity={dawnA} />
      {/* moon (night) / sun-glow (dawn) */}
      <circle cx={840} cy={y - 230} r={62} fill="#F4EBD8" opacity={moonA * (1 - dawnA)} style={{ filter: "drop-shadow(0 0 40px rgba(244,235,216,0.6))" }} />
      <circle cx={540} cy={y + 10} r={140} fill="rgba(255,200,130,0.9)" opacity={dawnA} style={{ filter: "blur(18px)" }} />
      {/* moon path on the water */}
      <ellipse cx={840} cy={y + 60} rx={46} ry={70} fill="url(#moonPath)" opacity={moonA * (1 - dawnA) * 0.45} style={{ filter: "blur(10px)" }} />
      {/* the laden ship (37:140) */}
      <g opacity={shipA} transform={`translate(${shipX},${y - 6 + bob})`}>
        <path d="M-120,0 L120,0 L90,34 L-90,34 Z" fill="#0A0F1A" stroke="rgba(233,200,150,0.35)" />
        <rect x={-4} y={-170} width={7} height={170} fill="#0A0F1A" />
        <path d="M6,-160 L96,-30 L6,-30 Z" fill="#101827" stroke="rgba(233,200,150,0.3)" />
        <path d="M-6,-140 L-80,-30 L-6,-30 Z" fill="#101827" stroke="rgba(233,200,150,0.3)" />
      </g>
      <path d={wave + ` L1100,${y + 40} L-20,${y + 40}Z`} fill="rgba(20,40,70,0.9)" />
      <path d={wave} fill="none" stroke="rgba(244,235,216,0.55)" strokeWidth={2} />
    </g>
  );
};

// Light rays falling from the surface into the water.
const Rays: React.FC<{ f: number; a: number; top: number }> = ({ f, a, top }) => {
  if (a <= 0.01) return null;
  return (
    <g opacity={a} style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: 9 }, (_, i) => {
        const x = 120 + i * 110 + Math.sin(f / 60 + i) * 30;
        const w = 40 + rnd(i, 1) * 60;
        return <path key={i} d={`M${x - w / 2},${top} L${x + w / 2},${top} L${x + w * 2.5 + 120},1960 L${x - w * 1.5 + 120},1960 Z`} fill="url(#ray)" opacity={0.08 + 0.08 * Math.sin(f / 40 + i * 1.7) ** 2} style={{ filter: "blur(14px)" }} />;
      })}
    </g>
  );
};

// Sparse drifting motes / bubbles (kept light on purpose).
const Motes: React.FC<{ f: number; a: number }> = ({ f, a }) => (
  <g opacity={a}>
    {Array.from({ length: 34 }, (_, i) => {
      const cycles = 1 + (i % 3);
      const ph = (rnd(i, 2) + (f / END) * cycles) % 1;
      const y = 1960 - ph * 2000;
      const x = rnd(i, 3) * 1080 + Math.sin(f / 40 + i) * 14;
      const r = 1.2 + rnd(i, 4) * 2.4;
      return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="rgba(200,230,240,0.55)" strokeWidth={0.8} opacity={Math.sin(ph * Math.PI)} />;
    })}
  </g>
);

export const World: React.FC<{ f: number }> = ({ f }) => {
  const d = depth(f);
  const s = seaDark(f);
  const e = enclosure(f);
  const sky = skyLight(f);
  const dw = dawn(f);
  const surfaceY = 900 - d * 1700;
  const shipA = interpolate(f, [176, 200, at.swallow + 20, at.swallow + 60, at.rise1, at.rise1 + 40], [0, 1, 1, 0, 0, 0], CLAMP);
  const light = hisLight(f);
  const [lx, ly] = LIGHT;
  const R = interpolate(e, [0, 1], [1500, 230]);
  const pulse = 1 + 0.12 * Math.sin((f / END) * Math.PI * 2 * 30);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060B15" />
          <stop offset="1" stopColor="#14223D" />
        </linearGradient>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2340" />
          <stop offset="0.55" stopColor="#6E4A63" />
          <stop offset="0.85" stopColor="#E59A6A" />
          <stop offset="1" stopColor="#FFD9A0" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13304F" />
          <stop offset="0.5" stopColor="#0A1C33" />
          <stop offset="1" stopColor="#050B16" />
        </linearGradient>
        <linearGradient id="moonPath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(244,235,216,0.8)" />
          <stop offset="1" stopColor="rgba(244,235,216,0)" />
        </linearGradient>
        <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(220,240,255,0.55)" />
          <stop offset="1" stopColor="rgba(220,240,255,0)" />
        </linearGradient>
        <radialGradient id="hisLight">
          <stop offset="0" stopColor="#FFFDF4" />
          <stop offset="0.2" stopColor="rgba(243,211,138,0.95)" />
          <stop offset="1" stopColor="rgba(243,211,138,0)" />
        </radialGradient>
        <radialGradient id="enclose" cx={lx} cy={ly} r={R} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(2,4,9,0)" />
          <stop offset="0.55" stopColor="rgba(2,4,9,0.25)" />
          <stop offset="1" stopColor="rgba(2,4,9,1)" />
        </radialGradient>
      </defs>
      {/* water fills everything below the surface */}
      <rect x={0} y={Math.max(-40, surfaceY)} width={1080} height={2000} fill="url(#water)" />
      <Rays f={f} a={sky * (1 - d * 0.6) * (1 - s * 0.8)} top={Math.max(-40, surfaceY)} />
      <rect x={0} y={0} width={1080} height={1920} fill="#02040A" opacity={s * 0.85} />
      <Motes f={f} a={(1 - s * 0.7) * (d > 0.05 ? 1 : 0.4)} />
      <Surface f={f} y={surfaceY} dawnA={dw} shipA={shipA} moonA={interpolate(f, [at.rise0, at.rise0 + 10], [1, 0], CLAMP) * Math.max(0, 1 - d * 5)} />
      {/* the enclosure: darkness closing in around his light, with faint curved walls */}
      {e > 0.01 ? (
        <g opacity={e}>
          <rect x={0} y={0} width={1080} height={1920} fill="url(#enclose)" />
          {[1.0, 1.4, 1.85].map((k, i) => (
            <ellipse key={i} cx={lx} cy={ly} rx={R * k * 0.9} ry={R * k * 1.1} fill="none" stroke="rgba(150,175,210,0.22)" strokeWidth={2} strokeDasharray={`${40 + i * 30} ${18 + i * 10}`} transform={`rotate(${((i % 2 ? -1 : 1) * (f / END) * 360 * (i + 1)).toFixed(2)},${lx},${ly})`} />
          ))}
        </g>
      ) : null}
      {light > 0 ? (
        <g opacity={light}>
          <circle cx={lx} cy={ly} r={70 * pulse} fill="url(#hisLight)" opacity={0.55} />
          <circle cx={lx} cy={ly} r={5} fill="#FFFDF4" style={{ filter: "drop-shadow(0 0 8px rgba(255,240,200,1))" }} />
        </g>
      ) : null}
    </svg>
  );
};

// A ring of light expanding from his light (each phrase of his call).
export const Ring: React.FC<{ t: number; color?: string; max?: number }> = ({ t, color = GOLD, max = 900 }) => {
  if (t < 0 || t > 50) return null;
  const p = t / 50;
  const r = 20 + (1 - Math.pow(1 - p, 3)) * max;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={LIGHT[0]} cy={LIGHT[1]} r={r} fill="none" stroke={color} strokeWidth={3 * (1 - p) + 1} opacity={(1 - p) * 0.9} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
      <circle cx={LIGHT[0]} cy={LIGHT[1]} r={r * 0.6} fill="none" stroke={color} strokeWidth={1.5} opacity={(1 - p) * 0.5} />
    </svg>
  );
};
