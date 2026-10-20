import React from "react";
import { interpolate } from "remotion";
import { CLAMP, easeInOut } from "../lib/anim";
import timeline from "./timeline.json";

// EP07 (27:18): a moonlit valley, an army as advancing rows of light, ants as tiny trails of light,
// and a glass prism that splits one sentence into ten beams. No creatures are drawn.

export const T = timeline as unknown as Record<"hook" | "valley" | "speech" | "decode" | "excuse" | "close", [number, number]> & { cue: Record<string, number | number[]> };
export const END = T.close[1];
export const Q = T.cue as Record<string, number> & { army: number[]; hurry: number[] };

// The ten things (Ṣafwat al-Tafāsīr on 27:18): Qur'anic segment, scholars' verb, English.
export const TEN: { ar: string; verb: string; en: string }[] = [
  { ar: "يَـٰٓ", verb: "نادَتْ", en: "She called out." },
  { ar: "أَيُّهَا", verb: "نَبَّهَتْ", en: "She alerted." },
  { ar: "ٱلنَّمۡلُ", verb: "سَمَّتْ", en: "She named them." },
  { ar: "ٱدۡخُلُواْ", verb: "أَمَرَتْ", en: "She commanded." },
  { ar: "مَسَٰكِنَكُمۡ", verb: "نَصَّتْ", en: "She specified where." },
  { ar: "لَا يَحۡطِمَنَّكُمۡ", verb: "حَذَّرَتْ", en: "She warned." },
  { ar: "سُلَيۡمَٰنُ", verb: "خَصَّتْ", en: "She singled out the king." },
  { ar: "وَجُنُودُهُۥ", verb: "عَمَّتْ", en: "She included his army." },
  { ar: "وَهُمۡ", verb: "أَشَارَتْ", en: "She pointed to them." },
  { ar: "لَا يَشۡعُرُونَ", verb: "عَذَرَتْ", en: "She excused them." },
];
export const hue = (i: number) => `hsl(${40 + i * 31}, 72%, 72%)`;
export const hueGlow = (i: number) => `hsla(${40 + i * 31}, 80%, 65%, 0.55)`;

// Global layer weights, matched at frame 0 and the last frame so the reel loops.
export const desertA = (f: number) =>
  interpolate(f, [0, T.valley[0], T.valley[0] + 40, T.speech[1] - 20, T.decode[0] + 30, T.close[0], T.close[0] + 60, END], [0.55, 0.55, 1, 1, 0.22, 0.22, 0.55, 0.55], CLAMP);

const Dunes: React.FC<{ f: number }> = ({ f }) => {
  const layer = (y: number, amp: number, k: number, ph: number, c1: string, c2: string, id: string) => {
    let d = `M-20,${y}`;
    for (let x = -20; x <= 1100; x += 20) d += ` L${x},${(y + Math.sin(x / k + ph) * amp + Math.sin(x / (k * 0.37) + ph * 2) * amp * 0.3).toFixed(1)}`;
    d += " L1100,1940 L-20,1940Z";
    return (
      <g key={id}>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <path d={d} fill={`url(#${id})`} />
        <path d={d.split(" L1100,1940")[0]} fill="none" stroke="rgba(233,200,150,0.22)" strokeWidth={1.5} />
      </g>
    );
  };
  return (
    <g>
      {layer(1260, 26, 160, 0.4 + f * 0.0004, "#2A2A33", "#12131A", "d1")}
      {layer(1420, 34, 210, 1.7, "#3A3328", "#15130F", "d2")}
      {layer(1580, 40, 260, 3.1, "#4A3E2C", "#14110C", "d3")}
    </g>
  );
};

// Sulayman's army: rows of light advancing over the horizon (27:17 «فَهُمۡ يُوزَعُونَ», marching in ordered rows).
const Army: React.FC<{ f: number }> = ({ f }) => {
  const [a0, a1] = Q.army;
  const t = T.valley[0];
  const prog = interpolate(f, [t + a0, t + a1, T.speech[1]], [0, 0.8, 1], CLAMP);
  const vis = interpolate(f, [t + a0, t + a0 + 30, T.speech[1] - 30, T.speech[1]], [0, 1, 1, 0], CLAMP);
  if (vis <= 0) return null;
  const pts: React.ReactNode[] = [];
  const HOR = 1200;
  for (let r = 0; r < 26; r++) {
    const z = (26 - r) * 0.6 - prog * 7; // depth: larger is farther
    if (z <= 0.7) continue;
    const y = HOR + 300 / z;
    const sp = 70 / z;
    const n = Math.floor(560 / sp);
    for (let j = -n; j <= n; j++) {
      const x = 540 + j * sp + (r % 2 ? sp / 2 : 0);
      pts.push(<circle key={`${r}:${j}`} cx={x} cy={y} r={Math.max(0.9, 4 / z)} fill="#FFE2A8" opacity={vis * Math.min(1, 2.4 / z) * (0.6 + 0.4 * Math.sin(r * 3.1 + j * 1.7 + f / 9) ** 2)} />);
    }
  }
  return (
    <g>
      <ellipse cx={540} cy={HOR + 30} rx={700} ry={70 + prog * 90} fill="rgba(255,214,150,0.10)" opacity={vis} style={{ filter: "blur(30px)" }} />
      <g style={{ filter: "drop-shadow(0 0 5px rgba(255,220,150,0.8))" }}>{pts}</g>
    </g>
  );
};

// Ant trails: dots of light walking curved paths into small dark openings (their dwellings).
const HOLES: [number, number][] = [
  [260, 1700], [540, 1650], [820, 1720],
];
export const Trails: React.FC<{ f: number; hurry: number; a: number }> = ({ f, hurry, a }) => {
  const dots: React.ReactNode[] = [];
  const period = END; // integer cycles over the reel keep the loop seamless
  for (let i = 0; i < 60; i++) {
    const h = HOLES[i % 3];
    const cycles = 2 + (i % 4);
    const base = (f / period) * cycles + i / 60;
    const ph = (base + hurry * (0.4 + (i % 5) * 0.12)) % 1;
    const ang = (i * 2.399) % (Math.PI * 2);
    const R = 260 * (1 - ph);
    const x = h[0] + Math.cos(ang) * R + Math.sin(ph * 9 + i) * 10;
    const y = h[1] + Math.sin(ang) * R * 0.35;
    const alpha = Math.sin(ph * Math.PI) * a * (1 - hurry * 0.85);
    dots.push(<circle key={i} cx={x} cy={y} r={2.4} fill="#F3D38A" opacity={alpha} />);
  }
  return (
    <g>
      {HOLES.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={16} ry={6} fill="#07080C" stroke="rgba(233,200,150,0.3)" strokeWidth={1} opacity={a} />
      ))}
      <g style={{ filter: "drop-shadow(0 0 4px rgba(243,211,138,0.9))" }}>{dots}</g>
    </g>
  );
};

// The voice: a small ring of light spreading from where she spoke.
const Voice: React.FC<{ f: number }> = ({ f }) => {
  const t0 = T.speech[0] + Q.voice;
  return (
    <g>
      {[0, 14, 28].map((d, i) => {
        const p = interpolate(f, [t0 + d, t0 + d + 60], [0, 1], CLAMP);
        if (p <= 0 || p >= 1) return null;
        return <ellipse key={i} cx={540} cy={1650} rx={20 + p * 520} ry={(20 + p * 520) * 0.3} fill="none" stroke="#F3D38A" strokeWidth={2} opacity={(1 - p) * 0.8} />;
      })}
    </g>
  );
};

export const Desert: React.FC<{ f: number }> = ({ f }) => {
  const s0 = T.speech[0];
  const hurry = interpolate(f, [s0 + Q.hurry[0], s0 + Q.hurry[1]], [0, 1], { ...CLAMP, easing: easeInOut }) * interpolate(f, [T.excuse[1], T.close[0] + 120], [1, 0], CLAMP);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: desertA(f) }}>
      <Dunes f={f} />
      <Army f={f} />
      <Trails f={f} hurry={hurry} a={1} />
      <Voice f={f} />
    </svg>
  );
};

// ---------------------------------------------------------------- the prism
export const ROW_Y0 = 720;
export const ROW_STEP = 86;
export const PRISM: [number, number] = [540, 560];

export const Prism: React.FC<{ f: number; appear: number; lit: (i: number) => number; out: number }> = ({ f, appear, lit, out }) => {
  const [cx, cy] = PRISM;
  const s = 70;
  const tri = `${cx},${cy - s} ${cx + s * 0.95},${cy + s * 0.6} ${cx - s * 0.95},${cy + s * 0.6}`;
  const beamIn = appear;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="0.5" stopColor="rgba(160,190,255,0.12)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.28)" />
        </linearGradient>
      </defs>
      {/* the sentence's single beam, from the text down into the prism */}
      <line x1={cx} y1={430} x2={cx} y2={430 + (cy - s - 430) * beamIn} stroke="#FFF1CC" strokeWidth={4} style={{ filter: "drop-shadow(0 0 10px rgba(255,236,190,0.95))" }} opacity={beamIn} />
      {/* ten beams out */}
      {TEN.map((_, i) => {
        const l = lit(i);
        if (l <= 0) return null;
        const y = ROW_Y0 + i * ROW_STEP + 30;
        const x2 = 120;
        const x1 = cx - 30 + i * 6;
        const y1 = cy + s * 0.6;
        return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * l} y2={y1 + (y - y1) * l} stroke={hue(i)} strokeWidth={2.5} opacity={0.75} style={{ filter: `drop-shadow(0 0 6px ${hue(i)})` }} />;
      })}
      <g opacity={appear} transform={`rotate(${Math.sin(f / 50) * 2},${cx},${cy})`}>
        <polygon points={tri} fill="url(#glass)" stroke="rgba(255,250,235,0.9)" strokeWidth={2} style={{ filter: "drop-shadow(0 0 18px rgba(200,220,255,0.6))" }} />
        <polygon points={`${cx},${cy - s + 18} ${cx + s * 0.6},${cy + s * 0.42} ${cx - s * 0.6},${cy + s * 0.42}`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
      </g>
    </svg>
  );
};
