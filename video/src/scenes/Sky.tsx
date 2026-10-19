import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlurWords } from "../components/Text";
import { Orb } from "../components/Orb";
import { CLAMP, easeIn, easeInOut, progress } from "../lib/anim";
import { C } from "../lib/theme";

const rnd = (i: number, n: number) => {
  const x = Math.sin(i * 91.7 + n * 47.3) * 24634.6345;
  return x - Math.floor(x);
};

// Irregular cave mouth: an arch with gentle radial jitter, smoothed with quadratic curves.
const ARCH = (() => {
  const cx = 540, base = 1520, w = 330, h = 1060;
  const N = 28;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = Math.PI * (i / N);
    const j = 1 + (rnd(i, 1) - 0.5) * 0.07;
    pts.push([cx - Math.cos(t) * w * j, base - Math.pow(Math.sin(t), 0.8) * h * j]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  d += ` L${pts[N][0].toFixed(1)},${pts[N][1].toFixed(1)} Z`;
  return `M0,0 H1080 V1920 H0 Z ${d}`;
})();

const STARS = Array.from({ length: 140 }, (_, i) => ({
  x: 160 + rnd(i, 2) * 760,
  y: 380 + rnd(i, 3) * 1080,
  r: 0.8 + rnd(i, 4) * 2.2,
  ph: rnd(i, 5) * 6.28,
}));

// 3 — Inside the cave, looking out. The camera pushes through the mouth into the sky.
export const Sky: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const appear = progress(f, 0, 30);
  const push = interpolate(f, [24, dur], [1, 3.4], { ...CLAMP, easing: easeIn });
  const rise = interpolate(f, [10, dur - 20], [0, 1], { ...CLAMP, easing: easeInOut });
  const rockFade = interpolate(f, [dur - 40, dur - 6], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "540px 980px" }}>
        <svg width={1080} height={1920}>
          <defs>
            <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1630" />
              <stop offset="70%" stopColor="#13213F" />
              <stop offset="100%" stopColor="#3A2E36" />
            </linearGradient>
            <filter id="rim" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <rect x={150} y={380} width={780} height={1160} fill="url(#skyg)" />
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F2EEE4" opacity={(0.35 + 0.65 * Math.abs(Math.sin(f / 22 + s.ph))) * 0.8} />
          ))}
          {/* sun and moon rising on either side of the mouth */}
          <Orb id="skysun" cx={390} cy={1540 - rise * 420} r={34} color={C.sun} />
          <Orb id="skymoon" cx={700} cy={1560 - rise * 600} r={26} color={C.moon} />
          {/* rock */}
          <path d={ARCH} fill="#04070D" fillRule="evenodd" opacity={rockFade} />
          <path d={ARCH} fill="none" stroke="rgba(233,185,110,0.35)" strokeWidth={6} filter="url(#rim)" opacity={rockFade} />
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <BlurWords
          start={22}
          stagger={5}
          dur={22}
          tokens={[{ t: "The answer" }, { br: true, t: "" }, { t: "is written in the sky.", italic: true, color: C.sun, glow: C.sunGlow }]}
          style={{ fontSize: 76 }}
        />
      </div>
    </AbsoluteFill>
  );
};
