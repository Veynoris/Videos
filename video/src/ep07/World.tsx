import React from "react";
import { interpolate } from "remotion";
import { CLAMP, easeInOut } from "../lib/anim";
import { Stream } from "../components/Particles";
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
  interpolate(f, [0, T.valley[0], T.valley[0] + 40, T.speech[1] - 20, T.decode[0] + 30, T.close[0], T.close[0] + 60, END - 70, END], [0.95, 0.95, 1, 1, 0.22, 0.22, 0.6, 0.6, 0.95], CLAMP);

const Dunes: React.FC<{ f: number }> = ({ f }) => {
  const pan = (f / END) * Math.PI * 2; // one full parallax cycle per reel (layers at 1×, 2×, 3×)
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
      {layer(1260, 26, 160, 0.4 + pan * 1, "#2A2A33", "#12131A", "d1")}
      {layer(1420, 34, 210, 1.7 + pan * 2, "#3A3328", "#15130F", "d2")}
      {layer(1580, 40, 260, 3.1 + pan * 3, "#4A3E2C", "#14110C", "d3")}
    </g>
  );
};

// A great moon: peeking at frame 0, rising through the valley, setting at dawn (back to frame 0).
export const moonY = (f: number) =>
  interpolate(f, [0, T.valley[0], T.speech[1], T.close[0] + 20, END - 30], [1160, 1160, 960, 960, 1160], { ...CLAMP, easing: easeInOut });
const Moon: React.FC<{ f: number }> = ({ f }) => {
  const y = moonY(f);
  const x = 770;
  const a = interpolate(f, [T.decode[0], T.decode[0] + 30, T.close[0], T.close[0] + 40], [1, 0, 0, 1], CLAMP);
  if (a <= 0) return null;
  return (
    <g opacity={a}>
      <radialGradient id="moonGlow">
        <stop offset="0" stopColor="rgba(250,240,215,0.5)" />
        <stop offset="0.35" stopColor="rgba(220,210,190,0.12)" />
        <stop offset="1" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
      <radialGradient id="moonFace" cx="0.42" cy="0.38" r="0.7">
        <stop offset="0" stopColor="#FBF5E6" />
        <stop offset="0.7" stopColor="#E3D8BE" />
        <stop offset="1" stopColor="#B9AE95" />
      </radialGradient>
      <circle cx={x} cy={y} r={520} fill="url(#moonGlow)" />
      {[1.25, 1.55, 1.95].map((k, i) => (
        <circle key={i} cx={x} cy={y} r={150 * k + Math.sin(f / 30 + i) * 4} fill="none" stroke="rgba(250,240,215,0.12)" strokeWidth={1.5} />
      ))}
      <circle cx={x} cy={y} r={150} fill="url(#moonFace)" />
      {[[-40, -30, 26], [35, 20, 18], [-10, 55, 14], [50, -50, 10], [-60, 30, 9]].map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx} cy={y + dy} r={r} fill="rgba(150,135,110,0.18)" />
      ))}
    </g>
  );
};

// Sulayman's army: rows of light advancing over the horizon (27:17 «فَهُمۡ يُوزَعُونَ», marching in ordered rows).
const Army: React.FC<{ f: number }> = ({ f }) => {
  const [a0] = Q.army;
  const t = T.valley[0];
  // the march stops dead when she speaks: progress freezes and the lights dim
  const edge = f < T.valley[0] || f > T.close[0]; // hook / loop point: a vast field of lights waiting on the horizon
  const prog = edge ? 0.25 : interpolate(f, [t + a0, T.speech[0] + Q.voice], [0, 0.8], CLAMP);
  const vis = Math.max(
    interpolate(f, [t + a0, t + a0 + 30, T.speech[0] + Q.voice, T.speech[0] + Q.voice + 20, T.speech[1] - 30, T.speech[1]], [0, 1, 1, 0.35, 0.35, 0], CLAMP),
    interpolate(f, [0, 22, 64, T.hook[1] - 30, T.hook[1]], [0, 0, 1, 1, 0], CLAMP), // revealed by the pull-back
  );
  const tp = edge ? (f / END) * Math.PI * 2 * 26 : Math.min(f, T.speech[0] + Q.voice) / 9;
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
      pts.push(<circle key={`${r}:${j}`} cx={x} cy={y} r={Math.max(0.9, 4 / z)} fill="#FFE2A8" opacity={vis * Math.min(1, 2.4 / z) * (0.6 + 0.4 * Math.sin(r * 3.1 + j * 1.7 + tp) ** 2)} />);
    }
  }
  return (
    <g>
      <ellipse cx={540} cy={HOR + 30} rx={700} ry={70 + prog * 90} fill="rgba(255,214,150,0.16)" opacity={vis} style={{ filter: "blur(36px)" }} />
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

// Her voice rippling on the sand: the hook and the loop point. Period divides the reel (1690 = 26 × 65).
const RIPPLE = 65;
const Ripple: React.FC<{ f: number }> = ({ f }) => {
  const a = Math.max(interpolate(f, [0, T.hook[1] - 20, T.hook[1]], [1, 1, 0], CLAMP), interpolate(f, [END - 80, END], [0, 1], CLAMP));
  if (a <= 0) return null;
  return (
    <g opacity={a}>
      {[0, 1, 2].map((k) => {
        const p = ((((f + (k * RIPPLE) / 3) % RIPPLE) + RIPPLE) % RIPPLE) / RIPPLE;
        const r = 14 + p * 300;
        return <ellipse key={k} cx={540} cy={1650} rx={r} ry={r * 0.28} fill="none" stroke="#F3D38A" strokeWidth={1.4} opacity={(1 - p) * 0.8} />;
      })}
      <circle cx={540} cy={1650} r={3.2} fill="#FFF1CC" style={{ filter: "drop-shadow(0 0 6px rgba(255,236,190,1))" }} />
    </g>
  );
};

// The camera: frame 0 starts close on her point of light and pulls back to reveal the army;
// when she speaks it dives back toward her; the reel ends close on her again (the loop point).
const ZOOM = 2.4;
export const dive = (f: number) =>
  interpolate(f, [T.speech[0] + 4, T.speech[0] + 44, T.speech[1] - 26, T.speech[1] + 10], [1, 1.45, 1.45, 1], { ...CLAMP, easing: easeInOut }) *
  interpolate(f, [0, 6, 64], [ZOOM, ZOOM, 1], { ...CLAMP, easing: easeInOut }) *
  interpolate(f, [END - 74, END - 1], [1, ZOOM], { ...CLAMP, easing: easeInOut });

export const Desert: React.FC<{ f: number }> = ({ f }) => {
  const s0 = T.speech[0];
  const hurry = interpolate(f, [s0 + Q.hurry[0], s0 + Q.hurry[1]], [0, 1], { ...CLAMP, easing: easeInOut }) * interpolate(f, [T.excuse[1], T.close[0] + 120], [1, 0], CLAMP);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: desertA(f) }}>
      <Moon f={f} />
      <g transform={`translate(540,1650) scale(${dive(f)}) translate(-540,-1650)`}>
        <Dunes f={f} />
        <Army f={f} />
        <Trails f={f} hurry={hurry} a={1} />
        <Ripple f={f} />
        <Voice f={f} />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- the prism
export const ROW_Y0 = 720;
export const ROW_STEP = 86;
export const PRISM: [number, number] = [540, 560];

export const Prism: React.FC<{ f: number; appear: number; lit: (i: number) => number; out: number }> = ({ f, appear, lit, out }) => {
  const [cx, cy] = PRISM;
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
      <radialGradient id="halo">
        <stop offset="0" stopColor="rgba(255,250,235,0.55)" />
        <stop offset="0.3" stopColor="rgba(200,170,255,0.22)" />
        <stop offset="0.6" stopColor="rgba(120,220,200,0.10)" />
        <stop offset="1" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
      <circle cx={cx} cy={cy} r={260 + Math.sin(f / 20) * 14} fill="url(#halo)" opacity={appear} />
      {/* the sentence's single beam, from the text down into the prism */}
      <line x1={cx} y1={430} x2={cx} y2={430 + (cy - 76 - 430) * beamIn} stroke="#FFF1CC" strokeWidth={4} style={{ filter: "drop-shadow(0 0 10px rgba(255,236,190,0.95))" }} opacity={beamIn} />
      {/* ten beams out */}
      {TEN.map((_, i) => {
        const l = lit(i);
        if (l <= 0) return null;
        const y = ROW_Y0 + i * ROW_STEP + 30;
        const x2 = 120;
        const x1 = cx - 30 + i * 6;
        const y1 = cy + 72;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * l} y2={y1 + (y - y1) * l} stroke={hue(i)} strokeWidth={2.5} opacity={0.75} style={{ filter: `drop-shadow(0 0 6px ${hue(i)})` }} />
            <Stream f={f + i * 7} x1={x1} y1={y1} x2={x2} y2={y} a={l >= 1 ? 0.9 : 0} id={`st${i}`} color={hue(i)} n={3} speed={46} />
          </g>
        );
      })}
    </svg>
  );
};

// A real 3D glass prism: three refracting faces turning slowly in space.
export const Prism3D: React.FC<{ f: number; appear: number; flash: number }> = ({ f, appear, flash }) => {
  const [cx, cy] = PRISM;
  const w = 128;
  const h = 150;
  const apothem = w / (2 * Math.sqrt(3));
  const spin = f * 0.9 + (1 - appear) * 120;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, perspective: 900, opacity: appear, transform: `scale(${0.6 + 0.4 * appear})` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(-14deg) rotateY(${spin}deg)` }}>
        {[0, 1, 2].map((k) => {
          const face = ((spin + k * 120) % 360 + 360) % 360;
          const lightness = 0.5 + 0.5 * Math.cos((face * Math.PI) / 180);
          return (
            <div key={k} style={{ position: "absolute", inset: 0, transform: `rotateY(${k * 120}deg) translateZ(${apothem}px)`, background: `linear-gradient(${100 + k * 40}deg, rgba(255,255,255,${0.1 + 0.3 * lightness}), rgba(170,200,255,0.10) 45%, rgba(255,210,240,${0.08 + 0.2 * lightness}) 70%, rgba(255,255,255,${0.15 + 0.25 * lightness}))`, border: "1.5px solid rgba(255,250,235,0.85)", boxShadow: `0 0 ${20 + flash * 50}px rgba(220,230,255,${0.35 + flash * 0.5}), inset 0 0 20px rgba(255,255,255,0.25)`, backfaceVisibility: "visible" }} />
          );
        })}
      </div>
    </div>
  );
};
