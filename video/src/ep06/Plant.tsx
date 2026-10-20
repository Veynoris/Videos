import React from "react";
import { interpolate } from "remotion";
import { CLAMP, easeInOut, easeOut } from "../lib/anim";
import timeline from "./timeline.json";

// EP06 (2:261): one seed → seven ears → a hundred grains in each → a field.
// Every state is a pure function of the global frame so the reel can loop onto frame 0.

export const T = timeline as unknown as Record<string, number[]>;
export const END = T.close[1];
export const GOLD = "#F3D38A";
export const GOLD_GLOW = "rgba(243,211,138,0.6)";
const STALK = "#CDB875";
const SOIL_Y = 1300;
const BASE: [number, number] = [540, SOIL_Y];

const ANG = [-36, -24, -12, 0, 12, 24, 36];
const LEN = [530, 575, 605, 620, 605, 575, 530];
const EAR = 190;

const rad = (d: number) => (d * Math.PI) / 180;
const p = (f: number, a: number, b: number, e = easeInOut) => interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: e });

export const growth = (f: number) => interpolate(f, [T.sprout[0], T.stalk[0], T.stalk[1]], [0, 0.26, 1], { ...CLAMP, easing: easeInOut });
export const fan = (f: number) => p(f, T.stalk[0] - 20, T.stalk[1] + 20);
export const earP = (f: number, k: number) => p(f, T.ears[0] + k * T.ears[1], T.ears[0] + k * T.ears[1] + 30, easeOut);
export const grainP = (f: number) => interpolate(f, [T.grains[0], T.grains[0] + T.grains[1]], [0, 1], { ...CLAMP, easing: (x) => x * x * (3 - 2 * x) });
export const camera = (f: number) => p(f, T.pullback[0], T.pullback[1]) - p(f, T.camBack[0], T.camBack[1]);
export const plantFade = (f: number) => 1 - p(f, T.fadeOut[0], T.fadeOut[1]);

// The count shown in the soil: 1 seed, then ears 1..7, then grains up to 700.
export const count = (f: number): { n: number; unit: string } => {
  if (f < T.ears[0]) return { n: 1, unit: "seed" };
  if (f < T.grains[0]) {
    let n = 0;
    for (let k = 0; k < 7; k++) if (earP(f, k) > 0.05) n++;
    return { n: Math.max(1, n), unit: n === 1 ? "ear" : "ears" };
  }
  return { n: Math.max(7, Math.round(grainP(f) * 700)), unit: "grains" };
};

// Stalk k: quadratic curve from the base, opening outward as the fan unfolds.
const stalkGeom = (k: number, fanP: number, g: number) => {
  const a = rad(ANG[k] * fanP);
  const L = LEN[k] * g;
  const tip: [number, number] = [BASE[0] + Math.sin(a) * L, BASE[1] - Math.cos(a) * L];
  const ctrl: [number, number] = [BASE[0] + Math.sin(a) * L * 0.18, BASE[1] - L * 0.62];
  const dir = Math.atan2(tip[0] - ctrl[0], -(tip[1] - ctrl[1])); // angle from vertical at the tip
  return { tip, ctrl, dir };
};

const Roots: React.FC<{ r: number }> = ({ r }) => {
  const paths = [
    "M540,1346 C536,1420 500,1470 470,1560",
    "M540,1346 C548,1430 590,1490 612,1590",
    "M540,1346 C540,1450 542,1540 538,1660",
    "M540,1346 C520,1390 450,1400 400,1440",
    "M540,1346 C562,1390 630,1404 690,1446",
    "M500,1470 C480,1500 440,1520 420,1530",
    "M590,1480 C610,1510 650,1520 670,1540",
    "M541,1520 C520,1560 500,1590 490,1620",
    "M470,1560 C460,1590 450,1610 452,1640",
  ];
  return (
    <g opacity={0.85}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(233,200,140,0.55)" strokeWidth={i < 5 ? 3 : 1.8} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, Math.min(1, r * 1.4 - i * 0.07))} 1`} style={{ filter: "drop-shadow(0 0 4px rgba(233,200,140,0.6))" }} />
      ))}
    </g>
  );
};

// One ear: a soft husk, then 100 grains (25 levels × 4) filling from the base upward, with awns.
const Ear: React.FC<{ tip: [number, number]; dir: number; e: number; gp: number; f: number; k: number }> = ({ tip, dir, e, gp, f, k }) => {
  if (e <= 0) return null;
  const deg = (dir * 180) / Math.PI;
  const len = EAR * e;
  const grains: React.ReactNode[] = [];
  const awns: React.ReactNode[] = [];
  const shown = gp * 100;
  for (let j = 0; j < 25; j++) {
    const t = (j + 0.5) / 25;
    const w = 17 * Math.pow(Math.sin(Math.PI * (0.12 + 0.82 * t)), 0.7);
    for (let i = 0; i < 4; i++) {
      const n = j * 4 + i;
      const side = i % 2 ? 1 : -1;
      const off = side * (i < 2 ? 0.42 : 1) * w;
      const y = -t * len;
      const a = Math.max(0, Math.min(1, shown - n));
      const pop = a > 0 && a < 1 ? 1 + (1 - a) * 0.8 : 1;
      grains.push(
        <ellipse key={n} cx={off} cy={y} rx={7.5 * pop} ry={4.6 * pop} transform={`rotate(${side * 28 - 90},${off},${y})`} fill={a > 0 ? GOLD : "rgba(205,184,117,0.18)"} stroke={a > 0 ? "rgba(255,246,220,0.9)" : "rgba(205,184,117,0.35)"} strokeWidth={0.8} opacity={a > 0 ? 0.55 + a * 0.45 : 1} />,
      );
      if (i >= 2 && j % 2 === 0) {
        const wob = Math.sin(f / 18 + j + k) * 2;
        awns.push(<line key={n} x1={off} y1={y} x2={off + side * (14 + t * 10) + wob} y2={y - 46} stroke="rgba(243,211,138,0.5)" strokeWidth={1} opacity={e} />);
      }
    }
  }
  const sway = Math.sin(f / 30 + k * 0.9) * 1.4;
  return (
    <g transform={`translate(${tip[0]},${tip[1]}) rotate(${deg + sway})`}>
      <path d={`M0,0 C-22,${-len * 0.3} -18,${-len * 0.8} 0,${-len - 10} C18,${-len * 0.8} 22,${-len * 0.3} 0,0Z`} fill="rgba(205,184,117,0.12)" stroke="rgba(205,184,117,0.4)" strokeWidth={1} />
      {awns}
      <g style={gp > 0 ? { filter: `drop-shadow(0 0 ${6 + 10 * gp}px ${GOLD_GLOW})` } : undefined}>{grains}</g>
    </g>
  );
};

export const Soil: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1C1912" />
        <stop offset="0.35" stopColor="#100E0B" />
        <stop offset="1" stopColor="#07080C" />
      </linearGradient>
    </defs>
    <path d={`M-1600,${SOIL_Y} ${Array.from({ length: 90 }, (_, i) => `L${-1600 + i * 48},${SOIL_Y + Math.sin(i * 1.7) * 5}`).join(" ")} L2700,${SOIL_Y} L2700,3200 L-1600,3200Z`} fill="url(#soil)" />
    <path d={`M-1600,${SOIL_Y} ${Array.from({ length: 90 }, (_, i) => `L${-1600 + i * 48},${SOIL_Y + Math.sin(i * 1.7) * 5}`).join(" ")}`} fill="none" stroke="rgba(233,200,140,0.35)" strokeWidth={2} />
    {Array.from({ length: 70 }, (_, i) => (
      <circle key={i} cx={(i * 157) % 1180 - 50} cy={SOIL_Y + 30 + ((i * 89) % 520)} r={1 + (i % 3)} fill="rgba(233,200,140,0.12)" />
    ))}
  </g>
);

// The seed: hovering in light (hook / loop), falling, then resting under the soil.
export const seedPos = (f: number): [number, number] => {
  const [a, b] = T.seedFall;
  const hover = 1000 + Math.sin(f / 20) * 8;
  if (f < a || f > T.camBack[1]) return [540, hover];
  return [540, interpolate(f, [a, b], [hover, 1346], { ...CLAMP, easing: (x) => x * x })];
};

export const Seed: React.FC<{ f: number; glow?: number }> = ({ f, glow = 1 }) => {
  const [x, y] = seedPos(f);
  return (
    <g style={{ filter: `drop-shadow(0 0 ${14 + 10 * glow}px ${GOLD_GLOW})` }}>
      <ellipse cx={x} cy={y} rx={17} ry={11} fill={GOLD} stroke="rgba(255,250,230,0.95)" strokeWidth={1.5} transform={`rotate(-24,${x},${y})`} />
      <path d={`M${x - 10},${y + 2} Q${x},${y - 3} ${x + 10},${y - 2}`} fill="none" stroke="rgba(150,110,40,0.7)" strokeWidth={1.2} />
    </g>
  );
};

export const Plant: React.FC<{ f: number }> = ({ f }) => {
  const g = growth(f);
  const fp = fan(f);
  const gp = grainP(f);
  const leaves = p(f, T.stalk[0] - 30, T.stalk[1]);
  return (
    <g>
      <Roots r={p(f, T.roots[0], T.roots[1], easeOut)} />
      {g > 0
        ? ANG.map((_, k) => {
            const { tip, ctrl } = stalkGeom(k, fp, g);
            return <path key={k} d={`M${BASE[0]},${BASE[1] + 40} Q${ctrl[0]},${ctrl[1]} ${tip[0]},${tip[1]}`} fill="none" stroke={STALK} strokeWidth={k === 3 ? 6 : 4.5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(205,184,117,0.45))" }} />;
          })
        : null}
      {/* long leaf blades low on the plant */}
      {[-1, 1].map((s) => (
        <path key={s} d={`M540,${SOIL_Y - 20} Q${540 + s * 120},${SOIL_Y - 200} ${540 + s * 230},${SOIL_Y - 190 + Math.sin(f / 26 + s) * 6}`} fill="none" stroke="rgba(170,170,110,0.75)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${leaves} 1`} />
      ))}
      {ANG.map((_, k) => {
        const { tip, dir } = stalkGeom(k, fp, g);
        return <Ear key={k} k={k} f={f} tip={tip} dir={dir} e={earP(f, k)} gp={gp} />;
      })}
    </g>
  );
};

// A distant plant for the field: seven stalks and seven ears, no individual grains.
const MiniPlant: React.FC<{ x: number; y: number; s: number; a: number; f: number; i: number }> = ({ x, y, s, a, f, i }) => {
  const h = 0.85 + ((i * 37) % 11) / 40;
  return (
    <g transform={`translate(${x},${y}) scale(${s * h},${s * h})`} opacity={a}>
      {ANG.map((ang, k) => {
        const r = rad(ang + ((i + k) % 3) - 1);
        const L = LEN[k];
        const tx = Math.sin(r) * L;
        const ty = -Math.cos(r) * L;
        const sway = Math.sin(f / 30 + i * 0.7 + k) * 2.5;
        const deg = (r * 180) / Math.PI + sway;
        return (
          <g key={k}>
            <path d={`M0,0 Q${tx * 0.18},${-L * 0.62} ${tx},${ty}`} fill="none" stroke={STALK} strokeWidth={7} />
            <path transform={`translate(${tx},${ty}) rotate(${deg})`} d={`M0,0 C-20,-60 -16,-150 0,-${EAR + 10} C16,-150 20,-60 0,0Z`} fill={GOLD} stroke="rgba(255,246,220,0.8)" strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

// The field: rows receding to a horizon; each plant rises in a wave spreading from the centre.
export const Field: React.FC<{ f: number }> = ({ f }) => {
  const [f0, dur] = T.field;
  const items: React.ReactNode[] = [];
  const HOR = 1040;
  for (let r = 8; r >= 1; r--) {
    const depth = 1 + r * 0.7;
    const s = 0.42 / depth;
    const y = HOR + (1490 - HOR) / depth;
    const gap = 420 * s;
    const n = Math.ceil(700 / gap) + 1;
    for (let j = -n; j <= n; j++) {
      const jitter = (((r * 31 + j * 17) % 13) - 6) * gap * 0.05;
      const x = 540 + j * gap + (r % 2 ? gap / 2 : 0) + jitter;
      if (x < -80 || x > 1160) continue;
      const dist = Math.hypot((x - 540) / 540, r / 8);
      const a = p(f, f0 + dist * dur * 0.6, f0 + dist * dur * 0.6 + 24, easeOut);
      if (a <= 0) continue;
      items.push(<MiniPlant key={`${r}:${j}`} x={x} y={y + (1 - a) * 40 * s} s={s} a={a * (1 - r * 0.07)} f={f} i={r * 13 + j} />);
    }
  }
  return <g>{items}</g>;
};
