import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { StarMark } from "../components/Light";
import { focusIn, focusOut, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { GOLD, GOLD_GLOW } from "./Plant";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };

const Line: React.FC<{ f: number; from: number; to: number; top: number; children: React.ReactNode }> = ({ f, from, to, top, children }) => {
  const out = progress(f, to, 16);
  return f < from - 2 || out >= 1 ? null : <div style={{ ...center, top, ...focusOut(out) }}>{children}</div>;
};

// Arabic verse fragment with its translation underneath.
const Ayah: React.FC<{ start: number; ar: { t: string; color?: string; glow?: string }[]; en: React.ComponentProps<typeof BlurWords>["tokens"]; size?: number; enSize?: number }> = ({ start, ar, en, size = 74, enSize = 56 }) => (
  <>
    <ArabicWords start={start} stagger={6} size={size} tokens={ar} style={{ lineHeight: 1.75 }} />
    <BlurWords start={start + 16} stagger={3} tokens={en} style={{ fontSize: enSize, fontStyle: "italic", marginTop: 4 }} />
  </>
);

// ---------------------------------------------------------------- 1 · Hook (frame 0 already carries the claim)
export const Title: React.FC<{ sub?: number }> = ({ sub = 0 }) => (
  <>
    <div style={{ ...center, top: 176, flexDirection: "row", justifyContent: "center", gap: 22 }}>
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={20} />
      <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>Al-Baqarah 2:261</Mono>
      <StarMark size={20} />
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ ...center, top: 214 }}>
      <div style={{ fontFamily: F.serif, fontSize: 200, lineHeight: 1.05, letterSpacing: "-0.02em", ...shine(GOLD, 0.5, GOLD_GLOW) }}>1 → 700</div>
    </div>
    <div style={{ ...center, top: 450, ...focusIn(sub, 10, 10) }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 62, color: C.ink }}>
        One verse. <span style={{ color: GOLD, textShadow: `0 0 26px ${GOLD_GLOW}` }}>Watch it grow.</span>
      </div>
    </div>
  </>
);

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Title sub={progress(f, 18, 20)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · The verse opens
export const Verse: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={12} to={112} top={186}>
        <Ayah start={12} size={60} enSize={52} ar={[{ t: "مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمۡوَٰلَهُمۡ فِي سَبِيلِ ٱللَّهِ" }]} en={[{ t: "Those who spend their wealth" }, { br: true, t: "" }, { t: "in the way of Allah —" }]} />
      </Line>
      <Line f={f} from={120} to={240} top={196}>
        <Ayah start={120} size={96} ar={[{ t: "كَمَثَلِ" }, { t: "حَبَّةٍ", color: GOLD, glow: GOLD_GLOW }]} en={[{ t: "are like" }, { t: "a seed.", color: GOLD, glow: GOLD_GLOW }]} enSize={64} />
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 · Planted
export const Planted: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={30} to={120} top={230}>
        <BlurWords start={30} stagger={5} tokens={[{ t: "One seed." }]} style={{ fontSize: 110 }} />
      </Line>
      <Line f={f} from={124} to={240} top={240}>
        <BlurWords start={124} stagger={4} tokens={[{ t: "Hidden in the earth.", italic: true, color: C.dim }]} style={{ fontSize: 80 }} />
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · Seven ears
export const Seven: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={10} to={300} top={186}>
        <Ayah start={10} size={84} ar={[{ t: "أَنۢبَتَتۡ" }, { t: "سَبۡعَ سَنَابِلَ", color: GOLD, glow: GOLD_GLOW }]} en={[{ t: "It grows" }, { t: "seven ears.", color: GOLD, glow: GOLD_GLOW }]} />
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · A hundred in each
export const Hundred: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={10} to={300} top={186}>
        <Ayah start={10} size={72} ar={[{ t: "فِي كُلِّ سُنۢبُلَةٖ" }, { t: "مِّاْئَةُ حَبَّةٖۗ", color: GOLD, glow: GOLD_GLOW }]} en={[{ t: "In each ear," }, { t: "a hundred grains.", color: GOLD, glow: GOLD_GLOW }]} />
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6 · And Allah multiplies
export const Multiply: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={14} to={160} top={186}>
        <Ayah start={14} size={78} ar={[{ t: "وَٱللَّهُ" }, { t: "يُضَٰعِفُ", color: GOLD, glow: GOLD_GLOW }, { t: "لِمَن يَشَآءُۚ" }]} en={[{ t: "And Allah" }, { t: "multiplies", color: GOLD, glow: GOLD_GLOW }, { br: true, t: "" }, { t: "for whom He wills." }]} />
      </Line>
      <Line f={f} from={168} to={300} top={210}>
        <BlurWords start={168} stagger={3} tokens={[{ t: "“Ten, up to seven hundred times —" }, { br: true, t: "" }, { t: "and many more.”", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 58 }} />
        <Mono p={progress(f, 186, 18)} style={{ marginTop: 20, fontSize: 20 }}>Ṣaḥīḥ al-Bukhārī 6491 · Muslim 131</Mono>
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 7 · Charity never decreased wealth
export const Wealth: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={12} to={300} top={176}>
        <Mono p={progress(f, 12, 18)} style={{ color: C.sun }}>The Prophet ﷺ said</Mono>
        <ArabicWords start={20} stagger={6} size={84} font={F.naskh} tokens={[{ t: "مَا نَقَصَتْ صَدَقَةٌ" }, { t: "مِنْ مَالٍ", color: GOLD, glow: GOLD_GLOW }]} style={{ lineHeight: 1.7, marginTop: 26 }} />
        <BlurWords start={46} stagger={4} tokens={[{ t: "“Charity never decreased" }, { t: "wealth.”", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 58 }} />
        <Mono p={progress(f, 70, 18)} style={{ marginTop: 18, fontSize: 20 }}>Ṣaḥīḥ Muslim 2588</Mono>
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8 · Close, dissolving onto frame 0
export const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = progress(f, dur - 76, 60);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 230, ...focusOut(back) }}>
        <BlurWords start={10} stagger={5} tokens={[{ t: "What will you" }, { br: true, t: "" }, { t: "plant today?", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 96 }} />
      </div>
      <AbsoluteFill style={{ opacity: back }}>
        <Title sub={0} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
