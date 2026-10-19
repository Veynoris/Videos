import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { StarMark } from "../components/Light";
import { CLAMP, easeInOut, focusIn, focusOut, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { BLOOD, FabricDefs, Loupe, Plaque, Seal, shake, TRUE, TRUE_GLOW, Tunic } from "./Props";
import timeline from "./timeline.json";

const Q = timeline.cue;
const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };
const RED = "#E0767A";
const RED_GLOW = "rgba(224,118,122,0.5)";

// A text block that lives between two local frames, then blurs away.
const Line: React.FC<{ f: number; from: number; to: number; top: number; children: React.ReactNode }> = ({ f, from, to, top, children }) => {
  const out = progress(f, to, 16);
  return f < from - 2 || out >= 1 ? null : <div style={{ ...center, top, ...focusOut(out) }}>{children}</div>;
};

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <FabricDefs />
    {children}
  </svg>
);

// ---------------------------------------------------------------- 1 · Hook
// Frame 0 already carries the claim; the reel loops back onto this exact state.
export const Title: React.FC<{ sub?: number }> = ({ sub = 0 }) => (
  <>
    <div style={{ ...center, top: 176, flexDirection: "row", justifyContent: "center", gap: 22 }}>
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={20} />
      <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>One word</Mono>
      <StarMark size={20} />
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ ...center, top: 196 }}>
      <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 250, lineHeight: 1.6, ...shine(C.sun, 0.5, C.sunGlow) }}>قَمِيص</div>
    </div>
    <div style={{ ...center, top: 640 }}>
      <div style={{ fontFamily: F.serif, fontSize: 82, color: C.ink }}>
        Six times in the Qur&rsquo;an.
      </div>
    </div>
    <div style={{ ...center, top: 750, ...focusIn(sub, 10, 10) }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 66, color: C.sun, textShadow: `0 0 26px ${C.sunGlow}` }}>All in one story.</div>
    </div>
  </>
);

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t = Q.hookTunics;
  return (
    <AbsoluteFill>
      <Title sub={progress(f, 18, 20)} />
      <Svg>
        <Tunic id="h1" f={f} x={95} y={890} w={240} p={progress(f, t, 24)} stain={1} />
        <Tunic id="h2" f={f + 30} x={420} y={890} w={240} p={progress(f, t + 6, 24)} tear={1} />
        <Tunic id="h3" f={f + 60} x={745} y={890} w={240} p={progress(f, t + 12, 24)} glow={0.6} />
      </Svg>
      <div style={{ ...center, top: 1290 }}>
        <BlurWords start={t + 30} stagger={5} tokens={[{ t: "Three shirts." }, { t: "Three verdicts.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 72 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · Exhibit I — the false blood (12:18)
export const Ex1: React.FC = () => {
  const f = useCurrentFrame();
  const [l0, l1] = Q.ex1Loupe;
  const lp = interpolate(f, [l0 - 10, l0 + 6, l1, l1 + 14], [0, 1, 1, 0], CLAMP);
  const s = progress(f, l0, l1 - l0, easeInOut);
  const lx = interpolate(s, [0, 0.5, 1], [420, 650, 470]);
  const ly = interpolate(s, [0, 0.5, 1], [600, 780, 960]);
  const scene = (z: string) => <Tunic id={`e1${z}`} f={f} x={320} y={430} w={440} stain={progress(f, Q.ex1Stain, 50)} p={progress(f, 0, 24)} />;
  return (
    <AbsoluteFill style={{ transform: shake(f, Q.ex1Seal) }}>
      <Plaque p={progress(f, 0, 20)}>Exhibit I · Yūsuf 12:18</Plaque>
      <Svg>
        {scene("a")}
        <Loupe id="l1" cx={lx} cy={ly} r={128} zoom={2.3} p={lp} f={f} scene={scene("b")} />
      </Svg>
      <Line f={f} from={20} to={112} top={1160}>
        <ArabicWords start={20} stagger={5} size={56} tokens={[{ t: "وَجَآءُو عَلَىٰ قَمِيصِهِۦ" }, { t: "بِدَمٖ كَذِبٖۚ", color: RED, glow: RED_GLOW }]} />
        <BlurWords start={40} stagger={3} tokens={[{ t: "They brought his shirt —" }, { br: true, t: "" }, { t: "with false blood.", italic: true, color: RED }]} style={{ fontSize: 60 }} />
      </Line>
      <Line f={f} from={118} to={190} top={1160}>
        <Mono p={progress(f, 118, 18)} style={{ color: C.sun }}>Their story · 12:17</Mono>
        <BlurWords start={124} stagger={4} tokens={[{ t: "“A wolf ate him.”", italic: true }]} style={{ fontSize: 84, marginTop: 18 }} />
      </Line>
      <Line f={f} from={196} to={276} top={1160}>
        <BlurWords start={196} stagger={4} tokens={[{ t: "The scholars of tafsir" }, { br: true, t: "" }, { t: "noticed one detail.", italic: true, color: C.dim }]} style={{ fontSize: 64 }} />
      </Line>
      <Line f={f} from={282} to={Q.ex1Seal + 30} top={1150}>
        <BlurWords start={282} stagger={5} tokens={[{ t: "The shirt" }, { t: "was not torn.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 80 }} />
        <Mono p={progress(f, 300, 18)} style={{ fontSize: 20, marginTop: 20 }}>Ibn Kathīr on 12:18 · from Ibn ʿAbbās</Mono>
      </Line>
      <Seal t={f - Q.ex1Seal} cx={540} cy={720} r={150} ar="كَذِبٖ" en="FALSE" color={RED} glow={RED_GLOW} />
      <Line f={f} from={Q.ex1Seal + 34} to={500} top={1140}>
        <Mono p={progress(f, Q.ex1Seal + 34, 18)} style={{ color: C.sun }}>Yaʿqūb said</Mono>
        <ArabicWords start={Q.ex1Seal + 40} stagger={5} size={56} tokens={[{ t: "بَلۡ سَوَّلَتۡ لَكُمۡ أَنفُسُكُمۡ أَمۡرٗاۖ" }]} style={{ marginTop: 6 }} />
        <BlurWords start={Q.ex1Seal + 60} stagger={3} tokens={[{ t: "“Rather, your souls have enticed" }, { br: true, t: "" }, { t: "you to something.”" }]} style={{ fontSize: 50, fontStyle: "italic", color: C.dim }} />
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 · Exhibit II — torn from the back (12:25–28)
export const Ex2: React.FC = () => {
  const f = useCurrentFrame();
  const split = progress(f, Q.ex2Panels - 10, 40, easeInOut);
  const [l0, l1] = Q.ex2Loupe;
  const lp = interpolate(f, [l0 - 10, l0 + 6, l1, l1 + 14], [0, 1, 1, 0], CLAMP);
  const s = progress(f, l0, l1 - l0, easeInOut);
  const tear = progress(f, l0 + 14, 40, easeInOut);
  const verdict = progress(f, l1, 20);
  // one shirt, then the same shirt shown twice for the test: front and back
  const W1 = interpolate(split, [0, 1], [440, 300]);
  const xA = interpolate(split, [0, 1], [320, 140]);
  const xB = interpolate(split, [0, 1], [320, 640]);
  const y = interpolate(split, [0, 1], [430, 400]);
  const lx = interpolate(s, [0, 1], [760, 820]);
  const ly = interpolate(s, [0, 1], [560, 820]);
  const back = (z: string) => <Tunic id={`e2b${z}`} f={f + 20} x={xB} y={y} w={W1} p={progress(f, 0, 24)} tear={tear} glow={verdict * 0.8} glowColor={TRUE} />;
  return (
    <AbsoluteFill style={{ transform: shake(f, Q.ex2Seal) }}>
      <Plaque p={progress(f, 0, 20)}>Exhibit II · Yūsuf 12:25–28</Plaque>
      <Svg>
        <Tunic id="e2a" f={f} x={xA} y={y} w={W1} p={split} dim={verdict} />
        {back("a")}
        <Loupe id="l2" cx={lx} cy={ly} r={118} zoom={2.2} p={lp} f={f} scene={back("b")} />
      </Svg>
      <Line f={f} from={16} to={92} top={1140}>
        <BlurWords start={16} stagger={4} tokens={[{ t: "Years later, in Egypt —" }, { br: true, t: "" }, { t: "a second shirt.", italic: true, color: C.sun }]} style={{ fontSize: 70 }} />
      </Line>
      <Line f={f} from={98} to={Q.ex2Panels - 6} top={1140}>
        <BlurWords start={98} stagger={4} tokens={[{ t: "They raced to the door." }, { br: true, t: "" }, { t: "The shirt was torn.", italic: true, color: C.dim }]} style={{ fontSize: 70 }} />
        <Mono p={progress(f, 110, 18)} style={{ marginTop: 18, fontSize: 20 }}>12:25</Mono>
      </Line>
      {/* the witness's test, under each panel */}
      <div style={{ position: "absolute", top: 870, left: 0, right: 0, display: "flex", justifyContent: "space-around", padding: "0 40px", opacity: progress(f, Q.ex2Panels + 20, 24) * (f > 470 ? 0 : 1) }}>
        {[
          { ar: "مِن قُبُلٖ", en: "Torn from the front", res: "she is truthful", on: 1 - verdict * 0.75, color: C.ink },
          { ar: "مِن دُبُرٖ", en: "Torn from the back", res: "he is truthful", on: 1, color: TRUE },
        ].map((c, i) => (
          <div key={i} style={{ width: 440, textAlign: "center", opacity: c.on }}>
            <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 56, color: i ? (verdict > 0 ? TRUE : C.ink) : C.ink, lineHeight: 1.5 }}>{c.ar}</div>
            <div style={{ fontFamily: F.serif, fontSize: 38, color: C.ink }}>{c.en}</div>
            <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 38, color: C.dim }}>→ {c.res}</div>
          </div>
        ))}
      </div>
      <Line f={f} from={Q.ex2Panels} to={l1 - 4} top={1250}>
        <BlurWords start={Q.ex2Panels + 4} stagger={4} tokens={[{ t: "A witness set the test." }]} style={{ fontSize: 62 }} />
        <Mono p={progress(f, Q.ex2Panels + 20, 18)} style={{ marginTop: 16, fontSize: 20 }}>12:26–27</Mono>
      </Line>
      <Line f={f} from={l1 + 2} to={500} top={1250}>
        <BlurWords start={l1 + 2} stagger={4} tokens={[{ t: "Torn from the back." }]} style={{ fontSize: 72 }} />
      </Line>
      <Seal t={f - Q.ex2Seal} cx={790} cy={640} r={132} ar="ٱلصَّـٰدِقِينَ" en="TRUTHFUL" color={TRUE} glow={TRUE_GLOW} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · Exhibit III — the shirt that returned his sight (12:93–96)
const Scent: React.FC<{ f: number; p: number; out: number }> = ({ f, p, out }) => (
  <>
    {Array.from({ length: 110 }, (_, i) => {
      const seed = (i * 97.13) % 1;
      const speed = 0.004 + ((i * 31) % 17) / 2200;
      const t = (f * speed + seed) % 1;
      const x = 540 + Math.sin(t * 6 + i) * (60 + t * 380) * ((i % 2) * 2 - 1) * 0.6;
      const y = 760 - t * 720;
      const a = Math.sin(t * Math.PI) * p * (1 - out);
      return <circle key={i} cx={x} cy={y} r={1.5 + ((i * 7) % 5) * 0.6} fill="#FFE6B0" opacity={a * 0.8} style={{ filter: "drop-shadow(0 0 6px rgba(255,220,150,0.9))" }} />;
    })}
  </>
);

export const Ex3: React.FC = () => {
  const f = useCurrentFrame();
  const [s0, s1] = Q.ex3Scent;
  const [h0, h1] = Q.ex3Haze;
  const haze = interpolate(f, [h0, h0 + 30, h1 - 20, h1], [0, 1, 1, 0], { ...CLAMP, easing: easeInOut });
  const seen = progress(f, h1 - 10, 30);
  return (
    <AbsoluteFill style={{ transform: shake(f, Q.ex3Seal) }}>
      <AbsoluteFill style={{ filter: haze > 0.01 ? `blur(${haze * 18}px) brightness(${1 + haze * 0.35})` : undefined }}>
        <Plaque p={progress(f, 0, 20)}>Exhibit III · Yūsuf 12:93–96</Plaque>
        <Svg>
          <Tunic id="e3" f={f} x={320} y={430} w={440} p={progress(f, 96, 30)} glow={0.35 + 0.5 * Math.max(progress(f, s0, 30) * (1 - progress(f, s1, 30)), seen)} />
          <Scent f={f} p={progress(f, s0, 30)} out={progress(f, s1, 30)} />
        </Svg>
        <Line f={f} from={10} to={92} top={1140}>
          <BlurWords start={10} stagger={4} tokens={[{ t: "His father had wept" }, { br: true, t: "" }, { t: "until his eyes turned white.", italic: true, color: C.dim }]} style={{ fontSize: 64 }} />
          <Mono p={progress(f, 24, 18)} style={{ marginTop: 18, fontSize: 20 }}>12:84</Mono>
        </Line>
        <Line f={f} from={100} to={s0 - 6} top={1160}>
          <Mono p={progress(f, 100, 18)} style={{ color: C.sun }}>Yūsuf said</Mono>
          <ArabicWords start={104} stagger={5} size={64} tokens={[{ t: "ٱذۡهَبُواْ بِقَمِيصِي هَٰذَا" }]} style={{ marginTop: 4 }} />
          <BlurWords start={120} stagger={3} tokens={[{ t: "“Take this, my shirt…”", italic: true }]} style={{ fontSize: 60 }} />
          <Mono p={progress(f, 130, 18)} style={{ marginTop: 14, fontSize: 20 }}>12:93</Mono>
        </Line>
        <Line f={f} from={s0} to={h0 - 4} top={1140}>
          <BlurWords start={s0 + 2} stagger={4} tokens={[{ t: "As the caravan left Egypt —" }]} style={{ fontSize: 58, color: C.dim }} />
          <BlurWords start={s0 + 30} stagger={4} tokens={[{ t: "“I find" }, { t: "the scent of Yūsuf.”", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 70, marginTop: 10 }} />
          <Mono p={progress(f, s0 + 44, 18)} style={{ marginTop: 14, fontSize: 20 }}>12:94</Mono>
        </Line>
        <Line f={f} from={h0} to={h1 - 12} top={1160}>
          <BlurWords start={h0 + 2} stagger={4} tokens={[{ t: "It was cast over his face —" }]} style={{ fontSize: 64 }} />
        </Line>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(236,230,218,${haze * 0.28})` }} />
      <Line f={f} from={h1 - 6} to={500} top={1150}>
        <BlurWords start={h1 - 4} stagger={5} tokens={[{ t: "He could" }, { t: "see again.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 86 }} />
        <Mono p={progress(f, h1 + 10, 18)} style={{ marginTop: 18, fontSize: 20 }}>12:96</Mono>
      </Line>
      <Seal t={f - Q.ex3Seal} cx={540} cy={720} r={150} ar="بَصِيرٗا" en="SEEING" color={C.sun} glow={C.sunGlow} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · Close — the same words, twice; loops onto frame 0
export const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = Q.closeArabic;
  const rowOut = progress(f, a - 16, 18);
  const back = progress(f, Q.closeLoop, dur - Q.closeLoop - 6, easeInOut);
  const badges = [
    { ar: "كَذِبٖ", en: "FALSE", c: RED },
    { ar: "ٱلصَّـٰدِقِينَ", en: "TRUTHFUL", c: TRUE },
    { ar: "بَصِيرٗا", en: "SEEING", c: C.sun },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ ...focusOut(back) }}>
        <AbsoluteFill style={{ ...focusOut(rowOut) }}>
          <Svg>
            <Tunic id="c1" f={f} x={95} y={380} w={240} p={progress(f, 4, 22)} stain={1} />
            <Tunic id="c2" f={f + 30} x={420} y={380} w={240} p={progress(f, 8, 22)} tear={1} />
            <Tunic id="c3" f={f + 60} x={745} y={380} w={240} p={progress(f, 12, 22)} glow={0.6} />
          </Svg>
          <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "space-around", padding: "0 30px", transform: "translateY(0px)" }}>
            {badges.map((b, i) => (
              <div key={i} style={{ width: 300, textAlign: "center", ...focusIn(progress(f, Q.closeSeals + i * 6, 20), 10, 10) }}>
                <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 44, color: b.c, lineHeight: 1.6 }}>{b.ar}</div>
                <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: "0.3em", color: C.ink }}>{b.en}</div>
              </div>
            ))}
          </div>
          <div style={{ ...center, top: 1010 }}>
            <BlurWords start={30} stagger={4} tokens={[{ t: "One shirt brought" }, { t: "the grief.", italic: true, color: RED }]} style={{ fontSize: 62 }} />
            <BlurWords start={66} stagger={4} tokens={[{ t: "Another brought" }, { t: "the cure.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 62, marginTop: 10 }} />
          </div>
        </AbsoluteFill>
        <div style={{ ...center, top: 430 }}>
          <Mono p={progress(f, a, 18)} style={{ color: C.sun }}>Yaʿqūb, at both losses</Mono>
          <ArabicWords start={a + 6} stagger={8} size={150} tokens={[{ t: "فَصَبۡرٞ" }, { t: "جَمِيلٞ", color: C.sun, glow: C.sunGlow }]} style={{ lineHeight: 1.7 }} />
          <BlurWords start={a + 30} stagger={4} tokens={[{ t: "“Beautiful patience.”", italic: true }]} style={{ fontSize: 70 }} />
          <BlurWords start={a + 58} stagger={4} tokens={[{ t: "The same words —" }, { br: true, t: "" }, { t: "12:18 and 12:83.", color: C.dim }]} style={{ fontSize: 54, marginTop: 30 }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: back }}>
        <Title sub={0} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { BLOOD };
