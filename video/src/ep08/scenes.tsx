import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { StarMark } from "../components/Light";
import { Written } from "../components/Written";
import { CLAMP, focusIn, focusOut, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { GOLD, GOLD_GLOW, Q, Ring, SEA, SEA_GLOW } from "./World";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };

const Line: React.FC<{ f: number; from: number; to: number; top: number; children: React.ReactNode }> = ({ f, from, to, top, children }) => {
  const out = progress(f, to, 16);
  return f < from - 2 || out >= 1 ? null : <div style={{ ...center, top, ...focusOut(out) }}>{children}</div>;
};

const DUA = "لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبۡحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّـٰلِمِينَ";

// ---------------------------------------------------------------- 1 · Hook (frame 0 already carries the claim)
export const Title: React.FC<{ sub?: number }> = ({ sub = 0 }) => (
  <>
    <div style={{ ...center, top: 176, flexDirection: "row", justifyContent: "center", gap: 22 }}>
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={20} />
      <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>Al-Anbiyāʾ 21:87</Mono>
      <StarMark size={20} />
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ ...center, top: 226 }}>
      <div style={{ fontFamily: F.serif, fontSize: 124, lineHeight: 1.05, ...shine(C.ink, 0.5) }}>Three darknesses.</div>
    </div>
    <div style={{ ...center, top: 690, ...focusIn(sub, 12, 14) }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 76, color: C.ink, textAlign: "center", lineHeight: 1.15 }}>
        One sentence
        <br />
        <span style={{ color: GOLD, textShadow: `0 0 34px ${GOLD_GLOW}` }}>got him out.</span>
      </div>
    </div>
  </>
);

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Title sub={progress(f, Q.hookOut, 20)} />
      <Written f={f} start={Q.hookDua} dur={44} top={420}>
        <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 60, lineHeight: 1.9, color: GOLD, textShadow: `0 0 26px ${GOLD_GLOW}`, textAlign: "center", padding: "0 60px" }}>
          {DUA}
        </div>
      </Written>
      <Ring t={f - Q.hookOut} max={1100} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · The fall (21:87, 37:140–142)
export const Fall: React.FC = () => {
  const f = useCurrentFrame();
  const [l1, l2, l3, l4] = Q.lines;
  return (
    <AbsoluteFill>
      <Line f={f} from={l1} to={l2 - 6} top={260}>
        <BlurWords start={l1} stagger={4} tokens={[{ t: "Yūnus left his people —" }, { br: true, t: "" }, { t: "in anger.", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 74 }} />
        <Mono p={progress(f, l1 + 14, 18)} style={{ marginTop: 18, fontSize: 20 }}>21:87</Mono>
      </Line>
      <Line f={f} from={l2} to={l3 - 6} top={280}>
        <BlurWords start={l2} stagger={4} tokens={[{ t: "He boarded" }, { t: "a laden ship.", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 74 }} />
        <Mono p={progress(f, l2 + 14, 18)} style={{ marginTop: 18, fontSize: 20 }}>37:140</Mono>
      </Line>
      <Line f={f} from={l3} to={l4 - 6} top={280}>
        <BlurWords start={l3} stagger={4} tokens={[{ t: "Lots were cast." }, { t: "He lost.", italic: true, color: C.dim }]} style={{ fontSize: 74 }} />
        <Mono p={progress(f, l3 + 14, 18)} style={{ marginTop: 18, fontSize: 20 }}>37:141</Mono>
      </Line>
      <Line f={f} from={l4} to={360} top={240}>
        <ArabicWords start={l4} stagger={6} size={80} tokens={[{ t: "فَٱلۡتَقَمَهُ" }, { t: "ٱلۡحُوتُ", color: SEA, glow: SEA_GLOW }]} />
        <BlurWords start={l4 + 10} stagger={4} tokens={[{ t: "The great fish" }, { t: "swallowed him.", italic: true, color: SEA, glow: SEA_GLOW }]} style={{ fontSize: 66 }} />
        <Mono p={progress(f, l4 + 24, 18)} style={{ marginTop: 18, fontSize: 20 }}>37:142</Mono>
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 · The three darknesses
export const Dark: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { n: "1", en: "The night." },
    { n: "2", en: "The sea." },
    { n: "3", en: "Inside the great fish." },
  ];
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 190 }}>
        <BlurWords start={4} stagger={4} tokens={[{ t: "In" }, { t: "the darknesses.", italic: true }]} style={{ fontSize: 80 }} />
        <ArabicWords start={10} stagger={6} size={52} tokens={[{ t: "فِي ٱلظُّلُمَٰتِ" }]} style={{ color: C.dim }} />
      </div>
      {items.map((it, i) => {
        const p = progress(f, Q.count[i], 22);
        return (
          <div key={i} style={{ position: "absolute", top: 470 + i * 100, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, ...focusIn(p, 12, 12) }}>
            <span style={{ fontFamily: F.mono, fontSize: 30, color: GOLD }}>{it.n}</span>
            <span style={{ fontFamily: F.serif, fontSize: 64, color: C.ink }}>{it.en}</span>
          </div>
        );
      })}
      <div style={{ ...center, top: 790 }}>
        <Mono p={progress(f, Q.count[0] + 20, 20)} style={{ fontSize: 20 }}>Ibn Kathīr on 21:87</Mono>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · His call — three phrases, three darknesses lifted
const PHRASES = [
  { ar: "لَّآ إِلَٰهَ إِلَّآ أَنتَ", en: "“There is no deity except You.”", role: "He declared Allah's oneness" },
  { ar: "سُبۡحَٰنَكَ", en: "“Exalted are You.”", role: "He glorified Him" },
  { ar: "إِنِّي كُنتُ مِنَ ٱلظَّـٰلِمِينَ", en: "“I have been of the wrongdoers.”", role: "He admitted his own fault" },
];

export const Dua: React.FC = () => {
  const f = useCurrentFrame();
  const head = 1 - progress(f, Q.phrases[0] - 14, 14);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 230, opacity: head }}>
        <BlurWords start={Q.call} stagger={4} tokens={[{ t: "And from there," }, { br: true, t: "" }, { t: "he called out:", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 76 }} />
        <ArabicWords start={Q.call + 16} stagger={6} size={56} tokens={[{ t: "فَنَادَىٰ فِي ٱلظُّلُمَٰتِ" }]} style={{ color: C.dim }} />
      </div>
      {PHRASES.map((ph, i) => {
        const t0 = Q.phrases[i];
        if (f < t0 - 4) return null;
        return (
          <React.Fragment key={i}>
            <Written f={f} start={t0} dur={24} top={190 + i * 230}>
              <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 70, lineHeight: 1.6, color: GOLD, textShadow: `0 0 26px ${GOLD_GLOW}` }}>{ph.ar}</div>
            </Written>
            <div style={{ ...center, top: 312 + i * 230, ...focusIn(progress(f, t0 + 16, 20), 8, 10) }}>
              <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 44, color: C.ink }}>{ph.en}</div>
              <Mono style={{ fontSize: 19, marginTop: 6, color: C.dim }}>{ph.role}</Mono>
            </div>
          </React.Fragment>
        );
      })}
      {PHRASES.map((_, i) => (
        <Ring key={i} t={f - Q.phrases[i] - 10} max={700 + i * 300} />
      ))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · The answer (21:88)
export const Answer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={Q.rise[0]} to={Q.save - 8} top={230}>
        <ArabicWords start={Q.rise[0]} stagger={6} size={64} tokens={[{ t: "فَٱسۡتَجَبۡنَا لَهُۥ", color: GOLD, glow: GOLD_GLOW }, { t: "وَنَجَّيۡنَٰهُ مِنَ ٱلۡغَمِّۚ" }]} />
        <BlurWords start={Q.rise[0] + 16} stagger={3} tokens={[{ t: "“So We responded to him" }, { br: true, t: "" }, { t: "and saved him from the distress.”", italic: true }]} style={{ fontSize: 58 }} />
      </Line>
      <Line f={f} from={Q.save} to={300} top={230}>
        <ArabicWords start={Q.save} stagger={6} size={72} tokens={[{ t: "وَكَذَٰلِكَ" }, { t: "نُـۨجِي ٱلۡمُؤۡمِنِينَ", color: GOLD, glow: GOLD_GLOW }]} />
        <BlurWords start={Q.save + 14} stagger={4} tokens={[{ t: "“And thus do We save" }, { br: true, t: "" }, { t: "the believers.”", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 70 }} />
        <BlurWords start={Q.save + 50} stagger={4} tokens={[{ t: "Not only him.", italic: true, color: C.dim }]} style={{ fontSize: 54, marginTop: 20 }} />
        <Mono p={progress(f, Q.save + 30, 18)} style={{ marginTop: 18, fontSize: 20 }}>21:88</Mono>
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6 · Close: the hadith, then back down into the dark (frame 0)
export const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = interpolate(f, [Q.down, dur - 8], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ ...focusOut(back) }}>
        <div style={{ ...center, top: 220 }}>
          <Mono p={progress(f, Q.hadith, 18)} style={{ color: C.sun }}>The Prophet ﷺ said of this call</Mono>
          <BlurWords start={Q.hadith + 6} stagger={3} tokens={[{ t: "“No Muslim calls with it" }, { br: true, t: "" }, { t: "for anything —" }, { br: true, t: "" }, { t: "except that Allah", italic: true }, { t: "responds to him.”", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 66, marginTop: 18 }} />
          <Mono p={progress(f, Q.hadith + 40, 18)} style={{ marginTop: 22, fontSize: 20 }}>Jāmiʿ al-Tirmidhī 3505</Mono>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: back }}>
        <Title sub={0} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
