import React from "react";
import { interpolate } from "remotion";
import { CLAMP, easeOut } from "../lib/anim";
import { C, F } from "../lib/theme";

// EP05 props: woven-linen shirts, a brass forensic loupe, a verdict seal and brass plaques.
// Everything is SVG drawn in screen coordinates (1080×1920) so the loupe can re-render it magnified.

export const LINEN = "#D9C8A4";
export const BLOOD = "rgba(112,22,28,0.78)";
export const TRUE = "#8DD5C2";
export const TRUE_GLOW = "rgba(141,213,194,0.55)";

export const FabricDefs: React.FC = () => (
  <defs>
    <linearGradient id="linen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#EADDBF" />
      <stop offset="0.5" stopColor="#CDB98F" />
      <stop offset="1" stopColor="#A89169" />
    </linearGradient>
    <linearGradient id="drape" x1="0" y1="0" x2="1" y2="0">
      {Array.from({ length: 9 }, (_, i) => (
        <stop key={i} offset={i / 8} stopColor={i % 2 ? "rgba(255,250,235,0.16)" : "rgba(40,28,10,0.16)"} />
      ))}
    </linearGradient>
    <pattern id="weave" width="5" height="5" patternUnits="userSpaceOnUse">
      <rect width="5" height="5" fill="none" />
      <path d="M0,1.2H5M0,3.7H5" stroke="rgba(90,70,40,0.22)" strokeWidth="0.9" />
      <path d="M1.2,0V5M3.7,0V5" stroke="rgba(255,250,230,0.18)" strokeWidth="0.9" />
    </pattern>
    <linearGradient id="brass5" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F6DCA0" />
      <stop offset="0.3" stopColor="#B88A45" />
      <stop offset="0.55" stopColor="#6E4F22" />
      <stop offset="0.78" stopColor="#D9AE68" />
      <stop offset="1" stopColor="#5A3F18" />
    </linearGradient>
    <radialGradient id="lensGlare" cx="0.32" cy="0.28" r="0.8">
      <stop offset="0" stopColor="rgba(255,255,255,0.32)" />
      <stop offset="0.35" stopColor="rgba(255,255,255,0.05)" />
      <stop offset="1" stopColor="rgba(150,190,255,0.08)" />
    </radialGradient>
  </defs>
);

// Long qamīṣ outline in a unit box (x 0..1, y 0..1.5), drawn with its top-left at (x, y) and width w.
const SHAPE: [number, number][] = [
  [0.36, 0.03], [0.5, 0.11], [0.64, 0.03], [0.9, 0.12], [1.0, 0.62], [0.86, 0.65], [0.79, 0.3], [0.83, 1.5], [0.17, 1.5], [0.21, 0.3], [0.14, 0.65], [0.0, 0.62], [0.1, 0.12],
];
export const TUNIC_H = 1.5;
const tunicPath = (x: number, y: number, w: number, wave: number) =>
  SHAPE.map(([u, v], i) => {
    const sway = Math.sin(v * 3 + wave) * w * 0.008 * v;
    const px = x + u * w + sway;
    const py = y + v * w;
    return `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join("") + "Z";

const blob = (cx: number, cy: number, R: number) => {
  let d = "";
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r = R * (1 + 0.2 * Math.sin(3 * a + 0.7) + 0.12 * Math.sin(5 * a + 2) + 0.07 * Math.sin(9 * a));
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a) * 1.2).toFixed(1)}`;
  }
  return d + "Z";
};

// A jagged tear from the collar downwards.
const tearPath = (x: number, y: number, w: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 16; i++) {
    const v = 0.12 + (i / 16) * 1.0;
    const u = 0.5 + (i % 2 ? 0.022 : -0.018) + Math.sin(i * 1.7) * 0.012;
    pts.push(`${i ? "L" : "M"}${(x + u * w).toFixed(1)},${(y + v * w).toFixed(1)}`);
  }
  return pts.join("");
};

export type TunicProps = {
  id: string;
  x: number;
  y: number;
  w: number;
  p?: number; // appearance
  stain?: number; // 0..1 spread of the false blood
  tear?: number; // 0..1 length of the tear revealed
  glow?: number;
  glowColor?: string;
  dim?: number;
  f: number;
};

export const Tunic: React.FC<TunicProps> = ({ id, x, y, w, p = 1, stain = 0, tear = 0, glow = 0, glowColor = C.sun, dim = 0, f }) => {
  const d = tunicPath(x, y + (1 - p) * 40, w, f / 22);
  return (
    <g opacity={p * (1 - dim * 0.75)} style={glow > 0 ? { filter: `drop-shadow(0 0 ${30 * glow}px ${glowColor})` } : undefined}>
      <clipPath id={`clip-${id}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill="url(#linen)" />
      <g clipPath={`url(#clip-${id})`}>
        <rect x={x - 20} y={y - 20} width={w + 40} height={w * 1.6} fill="url(#weave)" />
        <rect x={x - 20} y={y - 20} width={w + 40} height={w * 1.6} fill="url(#drape)" transform={`translate(${Math.sin(f / 40) * w * 0.03},0)`} />
        {/* collar and hem stitching */}
        <path d={`M${x + 0.34 * w},${y + 0.06 * w} Q${x + 0.5 * w},${y + 0.2 * w} ${x + 0.66 * w},${y + 0.06 * w}`} fill="none" stroke="rgba(90,66,30,0.6)" strokeWidth={w * 0.006} strokeDasharray={`${w * 0.012} ${w * 0.01}`} />
        <path d={`M${x + 0.18 * w},${y + 1.45 * w}H${x + 0.82 * w}`} stroke="rgba(90,66,30,0.5)" strokeWidth={w * 0.005} strokeDasharray={`${w * 0.012} ${w * 0.01}`} />
        {stain > 0 ? (
          <>
            <path d={blob(x + 0.56 * w, y + 0.5 * w, w * 0.15 * stain)} fill={BLOOD} style={{ filter: `blur(${w * 0.01}px)` }} />
            <path d={blob(x + 0.42 * w, y + 0.8 * w, w * 0.07 * stain)} fill={BLOOD} opacity={0.8} style={{ filter: `blur(${w * 0.008}px)` }} />
            <path d={blob(x + 0.62 * w, y + 1.02 * w, w * 0.04 * stain)} fill={BLOOD} opacity={0.7} />
          </>
        ) : null}
        {tear > 0 ? (
          <>
            <path d={tearPath(x, y, w)} fill="none" stroke="#0A1220" strokeWidth={w * 0.03} strokeLinejoin="bevel" pathLength={1} strokeDasharray={`${tear} 1`} />
            <path d={tearPath(x, y, w)} fill="none" stroke="rgba(255,244,214,0.85)" strokeWidth={w * 0.006} strokeDasharray="0.012 0.008" pathLength={1} opacity={tear > 0.98 ? 1 : 0} transform={`translate(${w * 0.018},0)`} />
          </>
        ) : null}
      </g>
      <path d={d} fill="none" stroke="rgba(255,240,205,0.55)" strokeWidth={1.5} />
    </g>
  );
};

// Brass forensic loupe: re-renders `scene` magnified inside its lens.
export const Loupe: React.FC<{ id: string; cx: number; cy: number; r: number; zoom: number; p: number; f: number; scene: React.ReactNode }> = ({ id, cx, cy, r, zoom, p, f, scene }) => {
  if (p <= 0) return null;
  const knurl = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2 + f * 0.01;
    return <line key={i} x1={cx + (r + 10) * Math.cos(a)} y1={cy + (r + 10) * Math.sin(a)} x2={cx + (r + 24) * Math.cos(a)} y2={cy + (r + 24) * Math.sin(a)} stroke="#3E2C12" strokeWidth={2} />;
  });
  const ha = Math.PI * 0.32;
  return (
    <g opacity={p} transform={`translate(0,${(1 - p) * 80})`}>
      <clipPath id={`lens-${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      {/* handle */}
      <g transform={`rotate(${(ha * 180) / Math.PI},${cx},${cy})`}>
        <rect x={cx + r + 20} y={cy - 22} width={260} height={44} rx={18} fill="url(#brass5)" stroke="rgba(255,240,200,0.6)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={cx + r + 80 + i * 40} y={cy - 22} width={10} height={44} fill="rgba(60,40,14,0.55)" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={r + 4} fill="#0A1220" />
      <g clipPath={`url(#lens-${id})`}>
        <g transform={`translate(${cx},${cy}) scale(${zoom}) translate(${-cx},${-cy})`}>{scene}</g>
        <circle cx={cx} cy={cy} r={r} fill="url(#lensGlare)" />
      </g>
      <circle cx={cx} cy={cy} r={r + 17} fill="none" stroke="url(#brass5)" strokeWidth={30} />
      {knurl}
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="rgba(255,240,200,0.8)" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r + 32} fill="none" stroke="rgba(255,240,200,0.45)" strokeWidth={1.5} />
    </g>
  );
};

// The verdict seal, pressed down by a brass ram. `t` = frames since impact (negative before).
export const Seal: React.FC<{ t: number; ar: string; en: string; color: string; glow: string; cx?: number; cy?: number; r?: number }> = ({ t, ar, en, color, glow, cx = 540, cy = 960, r = 170 }) => {
  if (t < -16) return null;
  const drop = interpolate(t, [-16, 0], [0, 1], { ...CLAMP, easing: (x) => x * x * x });
  const lift = interpolate(t, [4, 24], [0, 1], { ...CLAMP, easing: easeOut });
  const ring = interpolate(t, [0, 26], [0, 1], { ...CLAMP, easing: easeOut });
  const ramY = interpolate(drop, [0, 1], [-1100, 0]) - lift * 1200;
  const teeth = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    const r1 = r * (i % 2 ? 0.93 : 1);
    return `${i ? "L" : "M"}${(cx + r1 * Math.cos(a)).toFixed(1)},${(cy + r1 * Math.sin(a)).toFixed(1)}`;
  }).join("");
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {t >= 0 ? (
          <g style={{ filter: `drop-shadow(0 0 ${20 + 30 * (1 - ring)}px ${glow})` }}>
            <circle cx={cx} cy={cy} r={r + ring * 260} fill="none" stroke={color} strokeWidth={3} opacity={(1 - ring) * 0.7} />
            <path d={teeth + "Z"} fill="rgba(10,18,32,0.88)" stroke={color} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
          </g>
        ) : null}
        {/* the ram */}
        <g transform={`translate(0,${ramY})`} opacity={1 - lift}>
          <rect x={cx - 34} y={cy - 1400} width={68} height={1400 - r - 30} fill="url(#brass5)" stroke="rgba(255,240,200,0.5)" />
          <rect x={cx - r - 6} y={cy - r - 40} width={2 * r + 12} height={44} rx={8} fill="url(#brass5)" stroke="rgba(255,240,200,0.7)" />
          <circle cx={cx} cy={cy} r={r} fill="url(#brass5)" stroke="rgba(255,240,200,0.7)" strokeWidth={2} opacity={0.96} />
        </g>
      </svg>
      {t >= 0 ? (
        <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: ring }}>
          <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: ar.length > 9 ? 44 : 64, color, textShadow: `0 0 24px ${glow}`, lineHeight: 1.5, whiteSpace: "nowrap" }}>
            {ar}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.32em", color: C.ink, marginTop: 2 }}>{en}</div>
        </div>
      ) : null}
    </>
  );
};

// Brass exhibit plaque with screws.
export const Plaque: React.FC<{ p: number; children: React.ReactNode; top?: number }> = ({ p, children, top = 172 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * -30}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 30px", borderRadius: 10, background: "linear-gradient(135deg,#F6DCA0,#B88A45 35%,#7A5A2A 60%,#D9AE68)", boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,250,230,0.8)" }}>
      <div style={{ width: 10, height: 10, borderRadius: 10, background: "#3E2C12" }} />
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: "0.3em", color: "#2A1D0A", fontWeight: 700 }}>{children}</div>
      <div style={{ width: 10, height: 10, borderRadius: 10, background: "#3E2C12" }} />
    </div>
  </div>
);

// Camera shake after an impact at local frame t0.
export const shake = (f: number, t0: number, amp = 14) => {
  const t = f - t0;
  if (t < 0 || t > 24) return "translate(0px,0px)";
  const k = Math.exp(-t / 5) * amp;
  return `translate(${(Math.sin(t * 2.7) * k).toFixed(2)}px,${(Math.cos(t * 3.3) * k).toFixed(2)}px)`;
};
