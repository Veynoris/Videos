import React from "react";
import { Easing, interpolate } from "remotion";
import { CLAMP, easeInOut, easeOut } from "../lib/anim";
import { C, F } from "../lib/theme";
import timeline from "./timeline.json";

// The decoding engine: one continuous brass-and-steel mechanism that scans the 114 surahs
// and locks on each place where «سميع» and «بصير» stand side by side.
// Every visual state is a pure function of the frame, so the reel can loop onto frame 0.

export const HEAR = "#8DD5C2";
export const HEAR_GLOW = "rgba(141,213,194,0.55)";
export const SEE = C.sun;
export const T = timeline as unknown as Record<string, number[]>;
export const END = T.close[1];

// The ten adjacent pairs that describe Allah (KFGQPC Hafs; research/name_pairs.py).
// [ref, surah, verse, verses in surah, first word, second word]
export const PAIRS: [string, number, number, number, string, string][] = [
  ["4:58", 4, 58, 176, "سَمِيعَۢا", "بَصِيرٗا"],
  ["4:134", 4, 134, 176, "سَمِيعَۢا", "بَصِيرٗا"],
  ["17:1", 17, 1, 111, "ٱلسَّمِيعُ", "ٱلۡبَصِيرُ"],
  ["22:61", 22, 61, 78, "سَمِيعُۢ", "بَصِيرٞ"],
  ["22:75", 22, 75, 78, "سَمِيعُۢ", "بَصِيرٞ"],
  ["31:28", 31, 28, 34, "سَمِيعُۢ", "بَصِيرٌ"],
  ["40:20", 40, 20, 85, "ٱلسَّمِيعُ", "ٱلۡبَصِيرُ"],
  ["40:56", 40, 56, 85, "ٱلسَّمِيعُ", "ٱلۡبَصِيرُ"],
  ["42:11", 42, 11, 53, "ٱلسَّمِيعُ", "ٱلۡبَصِيرُ"],
  ["58:1", 58, 1, 22, "سَمِيعُۢ", "بَصِيرٌ"],
];
const DEG = 360 / 114;
const pos = (k: number) => -(PAIRS[k][1] - 1 + PAIRS[k][2] / PAIRS[k][3]) * DEG;

// ---------------------------------------------------------------- machine state
export const ringAngle = (f: number) => {
  let a = 0;
  for (let k = 0; k < PAIRS.length; k++) {
    const t0 = T.travel[k];
    const t1 = T.hits[k];
    if (f < t0) break;
    const from = k === 0 ? 0 : pos(k - 1);
    const ease = k === PAIRS.length - 1 ? Easing.bezier(0.5, 0, 0.2, 1) : easeInOut;
    a = interpolate(f, [t0, t1], [from, pos(k)], { ...CLAMP, easing: ease });
    // latch recoil after each lock
    if (f > t1) a += Math.sin((f - t1) * 0.9) * Math.exp(-(f - t1) / 5) * (k === PAIRS.length - 1 ? 1.6 : 0.8);
  }
  // after the story the ring winds on, all the way round to surah 1
  const [h0, h1] = T.home;
  if (f > h0) a = interpolate(f, [h0, h1], [pos(PAIRS.length - 1), -360], { ...CLAMP, easing: easeInOut });
  return a;
};

const lastHit = (f: number) => {
  let k = -1;
  for (let i = 0; i < T.hits.length; i++) if (f >= T.hits[i]) k = i;
  return k;
};

export const counter = (f: number) => {
  let v = 0;
  T.hits.forEach((h) => (v += interpolate(f, [h, h + 9], [0, 1], { ...CLAMP, easing: Easing.bezier(0.3, 1.5, 0.5, 1) })));
  const [r0, r1] = T.reset;
  if (f > r0) v = interpolate(f, [r0, r1], [10, 0], { ...CLAMP, easing: easeInOut });
  return v;
};

export const irisOpen = (f: number) => {
  const [o0, o1, c0, c1] = T.iris;
  return f < c0 ? interpolate(f, [o0, o1], [0, 1], { ...CLAMP, easing: easeInOut }) : interpolate(f, [c0, c1], [1, 0], { ...CLAMP, easing: easeInOut });
};

export const camera = (f: number) => {
  const [z0, z1, z2, z3] = T.zoom;
  const s = interpolate(f, [T.tenth[0], z0, z1, z2, z3], [1, 1.12, 2.7, 2.7, 1], { ...CLAMP, easing: Easing.bezier(0.6, 0, 0.25, 1) });
  return { s, cy: CY };
};

const pulse = (x: number, decay = 16) => (x < 0 ? 0 : Math.min(1, x / 2) * Math.exp(-x / decay));
export const lamps = (f: number) => {
  let hear = 0;
  let see = 0;
  T.hits.forEach((h, k) => {
    const hold = k === T.hits.length - 1 ? 60 : 16;
    hear = Math.max(hear, pulse(f - h, hold));
    see = Math.max(see, pulse(f - h - 7, hold));
  });
  return { hear, see };
};

// ---------------------------------------------------------------- geometry
const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;

// Spur gear outline with lightening holes (fill-rule evenodd).
const gearPath = (n: number, m: number, holes = 5) => {
  const r = (m * n) / 2;
  const ro = r + m;
  const ri = r - 1.25 * m;
  const step = (2 * Math.PI) / n;
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = i * step;
    const p = [
      [ri, a - step * 0.5],
      [ri, a - step * 0.27],
      [ro, a - step * 0.14],
      [ro, a + step * 0.14],
      [ri, a + step * 0.27],
    ];
    p.forEach(([rr, aa], j) => (d += `${i === 0 && j === 0 ? "M" : "L"}${pt(rr, aa)}`));
  }
  d += "Z";
  const hub = n > 60 ? R_OUT - 4 : r * 0.22;
  d += `M${hub},0A${hub},${hub} 0 1,0 ${-hub},0A${hub},${hub} 0 1,0 ${hub},0Z`;
  if (holes > 0 && r > 40) {
    const hr = (ri - hub) * 0.32;
    const hc = (ri + hub) / 2;
    for (let i = 0; i < holes; i++) {
      const a = (i / holes) * 2 * Math.PI;
      const cx = hc * Math.cos(a);
      const cy = hc * Math.sin(a);
      d += `M${cx + hr},${cy}A${hr},${hr} 0 1,0 ${cx - hr},${cy}A${hr},${hr} 0 1,0 ${cx + hr},${cy}Z`;
    }
  }
  return d;
};

// Gears that mesh: θ2 = −(n1/n2)(θ1 − φ) + φ + 180 − 180/n2
type GearSpec = { n: number; x: number; y: number; angle: number; fill: string; holes?: number };
const chain = (m: number, x0: number, y0: number, n0: number, theta0: number, links: [number, number][], fill: string): GearSpec[] => {
  const out: GearSpec[] = [{ n: n0, x: x0, y: y0, angle: theta0, fill }];
  links.forEach(([n2, phiDeg]) => {
    const prev = out[out.length - 1];
    const dist = (m * (prev.n + n2)) / 2;
    const phi = (phiDeg * Math.PI) / 180;
    const a = -(prev.n / n2) * (prev.angle - phiDeg) + phiDeg + 180 - 180 / n2;
    out.push({ n: n2, x: prev.x + dist * Math.cos(phi), y: prev.y + dist * Math.sin(phi), angle: a, fill });
  });
  return out;
};

const Gear: React.FC<{ g: GearSpec; m: number; stroke?: string }> = ({ g, m, stroke = "rgba(255,236,190,0.55)" }) => (
  <g transform={`translate(${g.x},${g.y}) rotate(${g.angle})`}>
    <path d={gearPath(g.n, m, g.holes ?? 5)} fill={g.fill} fillRule="evenodd" stroke={stroke} strokeWidth={1.2} />
    <circle r={(m * g.n) / 2 * 0.12} fill="#1a1408" stroke={stroke} strokeWidth={1} />
  </g>
);

// ---------------------------------------------------------------- defs
export const MachineDefs: React.FC = () => (
  <defs>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F6DCA0" />
      <stop offset="0.28" stopColor="#B88A45" />
      <stop offset="0.5" stopColor="#6E4F22" />
      <stop offset="0.72" stopColor="#D9AE68" />
      <stop offset="1" stopColor="#5A3F18" />
    </linearGradient>
    <linearGradient id="brassDark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#9C7638" />
      <stop offset="0.5" stopColor="#3E2C12" />
      <stop offset="1" stopColor="#7A5A2A" />
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#3A4C6C" />
      <stop offset="0.45" stopColor="#141E33" />
      <stop offset="0.7" stopColor="#2A3956" />
      <stop offset="1" stopColor="#0E1526" />
    </linearGradient>
    <linearGradient id="blade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#2B3B59" />
      <stop offset="0.25" stopColor="#18233A" />
      <stop offset="1" stopColor="#0B1222" />
    </linearGradient>
    <radialGradient id="engineGlow">
      <stop offset="0" stopColor="rgba(233,185,110,0.30)" />
      <stop offset="0.6" stopColor="rgba(233,185,110,0.07)" />
      <stop offset="1" stopColor="rgba(233,185,110,0)" />
    </radialGradient>
    <radialGradient id="aperture">
      <stop offset="0" stopColor="rgba(10,18,32,0)" />
      <stop offset="0.82" stopColor="rgba(6,11,21,0.25)" />
      <stop offset="1" stopColor="rgba(6,11,21,0.9)" />
    </radialGradient>
    <clipPath id="irisClip">
      <circle r={292} />
    </clipPath>
    <path id="arcTop" d="M-318,0 A318,318 0 0,1 318,0" />
    <path id="arcBottom" d="M-330,0 A330,330 0 0,0 330,0" />
  </defs>
);

// ---------------------------------------------------------------- parts
export const CY = 960;
const R_OUT = 432;
const R_IN = 362;
const RING_M = 8; // 114 teeth -> pitch radius 456

const OuterRing: React.FC<{ angle: number; found: number; f: number }> = ({ angle, found, f }) => {
  const ticks: React.ReactNode[] = [];
  for (let s = 0; s < 114; s++) {
    const a = (s * DEG - 90) * (Math.PI / 180);
    const major = s % 10 === 0;
    ticks.push(<line key={s} x1={pt(R_IN + 8, a).split(",")[0]} y1={pt(R_IN + 8, a).split(",")[1]} x2={pt(R_IN + (major ? 34 : 20), a).split(",")[0]} y2={pt(R_IN + (major ? 34 : 20), a).split(",")[1]} stroke="#2A1D0A" strokeWidth={major ? 3 : 1.6} />);
  }
  return (
    <g transform={`rotate(${angle})`}>
      <path d={gearPath(114, RING_M, 0)} fill="url(#brassDark)" stroke="rgba(255,236,190,0.5)" strokeWidth={1.2} transform={`rotate(${-90 + DEG / 2})`} />
      <circle r={(R_OUT + R_IN) / 2} fill="none" stroke="url(#brass)" strokeWidth={R_OUT - R_IN} />
      <circle r={R_OUT} fill="none" stroke="rgba(255,240,200,0.7)" strokeWidth={2} />
      <circle r={R_IN} fill="none" stroke="rgba(255,240,200,0.45)" strokeWidth={1.5} />
      {ticks}
      {PAIRS.map((p, k) => {
        const s = p[1] - 1 + p[2] / p[3];
        const a = (s * DEG - 90) * (Math.PI / 180);
        const lit = k <= found ? 1 : 0;
        const [x, y] = pt(R_IN + 50, a).split(",").map(Number);
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={7} fill={lit ? HEAR : "#2A1D0A"} style={lit ? { filter: `drop-shadow(0 0 8px ${HEAR})` } : undefined} />
          </g>
        );
      })}
      {[1, 20, 40, 60, 80, 100].map((s) => {
        const a = ((s - 1) * DEG - 90 + DEG / 2) * (Math.PI / 180);
        const [x, y] = pt(R_IN + 54, a + 0.05).split(",").map(Number);
        return (
          <text key={s} x={x} y={y} fill="#2A1D0A" fontFamily={F.mono} fontSize={17} fontWeight={700} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(a * 180) / Math.PI + 90},${x},${y})`}>
            {s}
          </text>
        );
      })}
    </g>
  );
};

// Fixed stator ring, engraved upright on both arcs.
const NameRing: React.FC = () => {
  const words = "ٱلسَّمِيعُ ٱلۡبَصِيرُ  ·  ٱلسَّمِيعُ ٱلۡبَصِيرُ  ·  ٱلسَّمِيعُ ٱلۡبَصِيرُ";
  return (
    <g>
      <circle r={322} fill="none" stroke="url(#steel)" strokeWidth={58} />
      <circle r={351} fill="none" stroke="rgba(233,185,110,0.55)" strokeWidth={1.5} />
      <circle r={293} fill="none" stroke="rgba(233,185,110,0.55)" strokeWidth={1.5} />
      {["#arcTop", "#arcBottom"].map((h) => (
        <text key={h} fontFamily={F.quran} fontSize={30} fill="rgba(233,185,110,0.78)" dominantBaseline="middle" textAnchor="middle">
          <textPath href={h} startOffset="50%">
            {words}
          </textPath>
        </text>
      ))}
    </g>
  );
};

// Iris diaphragm: N blades, each a half-plane beyond a line at distance d from the centre.
const Iris: React.FC<{ open: number; R?: number }> = ({ open, R = 292 }) => {
  const N = 9;
  const d = open * R * 1.08;
  const L = R * 2.4;
  const a0 = d * Math.tan(Math.PI / N) + 12;
  const twist = open * 1.1;
  const blades = Array.from({ length: N }, (_, i) => {
    const phi = (i / N) * 2 * Math.PI + twist;
    const n = [Math.cos(phi), Math.sin(phi)];
    const t = [-Math.sin(phi), Math.cos(phi)];
    const P = [n[0] * d, n[1] * d];
    const q = (u: number, v: number) => `${(P[0] + t[0] * u + n[0] * v).toFixed(1)},${(P[1] + t[1] * u + n[1] * v).toFixed(1)}`;
    return (
      <g key={i}>
        <polygon points={`${q(-a0, 0)} ${q(L, 0)} ${q(L, L)} ${q(-a0, L)}`} fill="url(#blade)" stroke="rgba(233,185,110,0.5)" strokeWidth={1.4} />
        <line x1={q(-a0, 0).split(",")[0]} y1={q(-a0, 0).split(",")[1]} x2={q(R * 1.2, 0).split(",")[0]} y2={q(R * 1.2, 0).split(",")[1]} stroke="rgba(246,220,160,0.75)" strokeWidth={2} />
      </g>
    );
  });
  return (
    <g clipPath="url(#irisClip)">
      {open < 0.999 ? blades : null}
      <circle r={R} fill="url(#aperture)" opacity={open} />
    </g>
  );
};

const Pointer: React.FC<{ glow: number }> = ({ glow }) => (
  <g transform={`translate(0,${-R_OUT - 6})`}>
    <path d="M-22,-46 L22,-46 L0,14 Z" fill="url(#brass)" stroke="rgba(255,240,200,0.85)" strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 ${6 + glow * 22}px rgba(141,213,194,${0.2 + glow * 0.7}))` }} />
    <circle cy={-34} r={7} fill={glow > 0.05 ? HEAR : "#2A1D0A"} opacity={0.4 + glow * 0.6} />
  </g>
);

// ---------------------------------------------------------------- the engine
export const Engine: React.FC<{ f: number }> = ({ f }) => {
  const ring = ringAngle(f);
  const open = irisOpen(f);
  const { s, cy } = camera(f);
  const k = lastHit(f);
  const lockGlow = k >= 0 ? pulse(f - T.hits[k], k === 9 ? 40 : 14) : 0;
  const m = RING_M;
  const ringGear: GearSpec = { n: 114, x: 0, y: 0, angle: ring - 90 + DEG / 2, fill: "" };
  const mesh = (from: GearSpec, n2: number, phiDeg: number) => chain(m, from.x, from.y, from.n, from.angle, [[n2, phiDeg]], "url(#brass)")[1];
  const p1 = mesh(ringGear, 18, 138);
  const p2 = mesh(p1, 30, 175);
  const p3 = mesh(p1, 12, 100);
  const q1 = mesh(ringGear, 16, -38);
  const q2 = mesh(q1, 26, -70);
  const q3 = mesh(q2, 14, -10);
  const left = [p1, p2, p3];
  const right = [q1, q2, q3];
  const bm = 16;
  const back = [
    { n: 44, x: -560, y: -620, angle: f * 0.18 + ring * 0.4 },
    { n: 36, x: 560, y: 540, angle: -f * 0.22 - ring * 0.5 },
    { n: 28, x: 600, y: -900, angle: f * 0.28 },
    { n: 34, x: -620, y: 860, angle: -f * 0.2 },
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <MachineDefs />
      {/* far layer: big steel gears, parallax at half the camera scale */}
      <g transform={`translate(540,${cy}) scale(${1 + (s - 1) * 0.45})`} style={{ filter: "blur(3px)" }} opacity={0.55}>
        {back.map((g, i) => (
          <Gear key={i} g={{ ...g, fill: "url(#steel)", holes: 6 }} m={bm} stroke="rgba(140,170,220,0.25)" />
        ))}
      </g>
      <g transform={`translate(540,${cy}) scale(${s})`}>
        <circle r={720} fill="url(#engineGlow)" />
        {[...left, ...right].map((g, i) => (
          <Gear key={i} g={g} m={m} />
        ))}
        {/* base plate */}
        <circle r={R_IN} fill="#0B1222" />
        <OuterRing angle={ring} found={k} f={f} />
        <NameRing />
        <Iris open={open} />
        <Pointer glow={lockGlow} />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- readouts (HTML, screen space)
const Drum: React.FC<{ v: number; size: number }> = ({ v, size }) => {
  const h = size * 1.15;
  return (
    <div style={{ height: h, width: size * 0.7, overflow: "hidden", position: "relative", background: "linear-gradient(180deg,#05080F,#121B2E 50%,#05080F)", borderRadius: 8, border: "1.5px solid rgba(233,185,110,0.5)", boxShadow: "inset 0 10px 18px rgba(0,0,0,0.8), inset 0 -10px 18px rgba(0,0,0,0.8)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -((v % 10) + 10) % 10 * h, fontFamily: F.mono, fontSize: size, lineHeight: `${h}px`, textAlign: "center", color: C.ink }}>
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} style={{ height: h }}>{i % 10}</div>
        ))}
      </div>
    </div>
  );
};

export const Odometer: React.FC<{ v: number; size?: number }> = ({ v, size = 92 }) => {
  const ones = v % 10;
  const tens = Math.floor(v / 10) + Math.max(0, ones - 9);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Drum v={tens} size={size} />
      <Drum v={ones} size={size} />
    </div>
  );
};

const Lamp: React.FC<{ on: number; color: string; glow: string; label: string; n: string }> = ({ on, color, glow, label, n }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 230 }}>
    <div style={{ width: 34, height: 34, borderRadius: 34, border: "2px solid rgba(233,185,110,0.6)", background: `radial-gradient(circle at 40% 35%, #fff 0%, ${color} 35%, rgba(10,18,32,1) 100%)`, opacity: 0.25 + on * 0.75, boxShadow: `0 0 ${10 + on * 40}px ${glow}` }} />
    <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: "0.3em", color: on > 0.3 ? color : C.dim }}>
      {n} · {label}
    </div>
  </div>
);

export const Console: React.FC<{ f: number; opacity: number }> = ({ f, opacity }) => {
  const { hear, see } = lamps(f);
  return (
    <div style={{ position: "absolute", top: 1468, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity }}>
      <Lamp on={hear} color={HEAR} glow={HEAR_GLOW} label="HEARING" n="1" />
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Odometer v={counter(f)} />
        <div style={{ fontFamily: F.mono, fontSize: 26, color: C.dim, letterSpacing: "0.1em" }}>/10</div>
      </div>
      <Lamp on={see} color={SEE} glow={C.sunGlow} label="SEEING" n="2" />
    </div>
  );
};

// Centre readout over the closed iris: the reference and the two words as they lock.
export const Readout: React.FC<{ f: number; opacity: number }> = ({ f, opacity }) => {
  const k = lastHit(f);
  const ref = k >= 0 ? PAIRS[k][0] : "";
  const flip = k >= 0 ? interpolate(f - T.hits[k], [0, 8], [0, 1], { ...CLAMP, easing: easeOut }) : 1;
  const { hear, see } = lamps(f);
  const w1 = k >= 0 ? PAIRS[k][4] : "ٱلسَّمِيعُ";
  const w2 = k >= 0 ? PAIRS[k][5] : "ٱلۡبَصِيرُ";
  const base = k >= 0 ? 0.55 : 0.85;
  return (
    <div style={{ position: "absolute", top: CY - 175, left: 540 - 175, width: 350, height: 350, borderRadius: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity, background: "radial-gradient(circle, rgba(10,18,32,0.92) 0%, rgba(10,18,32,0.85) 62%, rgba(10,18,32,0) 72%)" }}>
      <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.3em", color: C.dim, height: 30 }}>{k >= 0 ? "LOCKED" : "TWO NAMES"}</div>
      <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 58, lineHeight: 1.5, whiteSpace: "nowrap", filter: flip < 1 ? `blur(${(1 - flip) * 8}px)` : undefined, opacity: 0.4 + flip * 0.6 }}>
        <span style={{ color: HEAR, textShadow: `0 0 ${10 + 30 * Math.max(hear, base * 0.3)}px ${HEAR_GLOW}`, opacity: base + (1 - base) * Math.max(hear, k === 9 ? 1 : 0) }}>{w1}</span>{" "}
        <span style={{ color: SEE, textShadow: `0 0 ${10 + 30 * see}px ${C.sunGlow}`, opacity: base + (1 - base) * Math.max(see, k === 9 ? 1 : 0) }}>{w2}</span>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 40, letterSpacing: "0.12em", color: C.sun, height: 50, filter: flip < 1 ? `blur(${(1 - flip) * 8}px)` : undefined, transform: `translateY(${(1 - flip) * -14}px)` }}>{ref}</div>
    </div>
  );
};
