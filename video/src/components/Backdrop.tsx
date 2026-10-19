import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

type Props = { sun: number; moon: number };

// Navy field with slow-drifting radial glows, vignette and fine grain (reference A).
// `sun` / `moon` (0..1) tint the glows towards the episode's two accents.
export const Backdrop: React.FC<Props> = ({ sun, moon }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const dx1 = Math.sin(t * 0.21) * 60;
  const dy1 = Math.cos(t * 0.17) * 50;
  const dx2 = Math.cos(t * 0.19) * 70;
  const dy2 = Math.sin(t * 0.23) * 60;

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {/* cool glow, upper left */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${260 + dx1}px ${520 + dy1}px, rgba(70,110,170,${0.22 + moon * 0.16}), transparent 70%)`,
        }}
      />
      {/* warm glow, lower right */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1000px 1000px at ${860 + dx2}px ${1450 + dy2}px, rgba(190,120,80,${0.13 + sun * 0.2}), transparent 70%)`,
        }}
      />
      {/* deep centre falloff */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(700px 1100px at 540px 960px, rgba(18,30,52,0.55), transparent 75%)`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 95% at 50% 48%, transparent 55%, ${C.bgDeep} 100%)`,
        }}
      />
      <Dust frame={f} />
      <Grain frame={f} />
    </AbsoluteFill>
  );
};

const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{ opacity: 0.075, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Faint dust motes drifting upward through the cave air. Deterministic per index.
const MOTES = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return { x: r(1) * 1080, y: r(2) * 1920, s: 1.2 + r(3) * 2.4, v: 6 + r(4) * 16, a: 0.12 + r(5) * 0.28, ph: r(6) * 6.28 };
});

const Dust: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / 30;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {MOTES.map((m, i) => {
        const y = (((m.y - t * m.v) % 1920) + 1920) % 1920;
        const x = m.x + Math.sin(t * 0.4 + m.ph) * 18;
        const tw = 0.6 + 0.4 * Math.sin(t * 0.9 + m.ph);
        return <circle key={i} cx={x} cy={y} r={m.s} fill="#E9E2D2" opacity={m.a * tw} />;
      })}
    </svg>
  );
};
