import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { StarMark } from "../components/Light";
import { Burst, Rising } from "../components/Particles";
import { CLAMP, focusIn, focusOut, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { hue, hueGlow, Prism, Prism3D, PRISM, Q, ROW_STEP, ROW_Y0, T, TEN } from "./World";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };
const GOLD = "#F3D38A";
const GOLD_GLOW = "rgba(243,211,138,0.6)";

const Line: React.FC<{ f: number; from: number; to: number; top: number; children: React.ReactNode }> = ({ f, from, to, top, children }) => {
  const out = progress(f, to, 16);
  return f < from - 2 || out >= 1 ? null : <div style={{ ...center, top, ...focusOut(out) }}>{children}</div>;
};

// The ant's sentence as one line; segment i can be lit in its own colour.
export const Sentence: React.FC<{ size?: number; lit?: (i: number) => number; dim?: number }> = ({ size = 50, lit = () => 0, dim = 0 }) => (
  <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: size, lineHeight: 1.9, textAlign: "center", color: C.ink, padding: "0 50px", opacity: 1 - dim * 0.6 }}>
    {TEN.map((t, i) => {
      const l = lit(i);
      const joined = i === 0; // يَـٰٓ joins أَيُّهَا with no space
      return (
        <React.Fragment key={i}>
          <span style={{ color: l > 0 ? hue(i) : undefined, textShadow: l > 0 ? `0 0 ${18 * l}px ${hueGlow(i)}` : undefined }}>{t.ar}</span>
          {joined ? null : " "}
        </React.Fragment>
      );
    })}
  </div>
);

// ---------------------------------------------------------------- 1 · Hook
// Frame 0: "An ant made a prophet smile." over her voice rippling on the sand (period divides the reel,
// so the loop is seamless). Then her sentence appears and its ten parts flash in their prism colours.
const RIPPLE = 65; // END (1690) = 26 × 65
const Ripple: React.FC<{ g: number }> = ({ g }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {[0, 1, 2].map((k) => {
      const p = (((g + (k * RIPPLE) / 3) % RIPPLE) + RIPPLE) % RIPPLE / RIPPLE;
      const r = 24 + p * 560;
      return <ellipse key={k} cx={540} cy={1650} rx={r} ry={r * 0.28} fill="none" stroke="#F3D38A" strokeWidth={2.2} opacity={(1 - p) * 0.75} style={{ filter: "drop-shadow(0 0 6px rgba(243,211,138,0.8))" }} />;
    })}
    <circle cx={540} cy={1650} r={5} fill="#FFF1CC" style={{ filter: "drop-shadow(0 0 10px rgba(255,236,190,1))" }} />
  </svg>
);

export const Title: React.FC<{ g: number; sentence?: number; lit?: (i: number) => number; sub?: number }> = ({ g, sentence = 0, lit, sub = 0 }) => (
  <>
    <Ripple g={g} />
    <div style={{ ...center, top: 176, flexDirection: "row", justifyContent: "center", gap: 22 }}>
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={20} />
      <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>An-Naml 27:18–19</Mono>
      <StarMark size={20} />
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ ...center, top: 226 }}>
      <div style={{ fontFamily: F.serif, fontSize: 128, lineHeight: 1.04, ...shine(C.ink, 0.5) }}>An ant</div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 92, lineHeight: 1.1, color: C.ink }}>
        made a prophet <span style={{ color: GOLD, textShadow: `0 0 34px ${GOLD_GLOW}` }}>smile.</span>
      </div>
    </div>
    <div style={{ ...center, top: 600, ...focusIn(sentence, 12, 14) }}>
      <Sentence size={54} lit={lit} />
    </div>
    <div style={{ ...center, top: 830, ...focusIn(sub, 10, 10) }}>
      <div style={{ fontFamily: F.serif, fontSize: 62, color: C.ink, textAlign: "center", lineHeight: 1.2 }}>
        Scholars found <span style={{ ...shine(GOLD, 0.5, GOLD_GLOW) }}>ten things</span>
        <br />
        <span style={{ fontStyle: "italic", color: C.dim }}>in what she said.</span>
      </div>
    </div>
  </>
);

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const flash = (i: number) => {
    const t = f - (62 + i * 3);
    return t < 0 ? 0 : Math.max(0.35, Math.exp(-t / 30));
  };
  return (
    <AbsoluteFill>
      <Title g={f} sentence={progress(f, 34, 22)} lit={flash} sub={progress(f, Q.hookTen + 26, 20)} />
      <Burst t={f - 62} x={540} y={650} n={60} spread={460} dur={60} id="hb1" />
      <Burst t={f - Q.hookTen - 26} x={540} y={890} n={40} spread={320} dur={50} id="hb2" size={3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · The valley
export const Valley: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={20} to={112} top={250}>
        <BlurWords start={20} stagger={4} tokens={[{ t: "Sulaymān's army" }, { br: true, t: "" }, { t: "was marching —", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 82 }} />
        <Mono p={progress(f, 34, 18)} style={{ marginTop: 22, fontSize: 20 }}>Jinn, men and birds, in rows · 27:17</Mono>
      </Line>
      <Line f={f} from={Q.valleyLine} to={300} top={250}>
        <BlurWords start={Q.valleyLine} stagger={4} tokens={[{ t: "until they reached" }, { br: true, t: "" }, { t: "the valley of the ants.", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 76 }} />
        <ArabicWords start={Q.valleyLine + 24} stagger={5} size={56} tokens={[{ t: "حَتَّىٰٓ إِذَآ أَتَوۡاْ عَلَىٰ" }, { t: "وَادِ ٱلنَّمۡلِ", color: GOLD, glow: GOLD_GLOW }]} style={{ marginTop: 6 }} />
      </Line>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 · She speaks
// Her words written in light: a glowing pen sweeps in reading direction (right to left), revealing the text.
const Written: React.FC<{ f: number; start: number; dur: number; top: number; children: React.ReactNode }> = ({ f, start, dur, top, children }) => {
  const p = interpolate(f, [start, start + dur], [0, 1], CLAMP);
  const edge = p * 112 - 6; // % from the right
  const mask = `linear-gradient(to left, black ${edge}%, rgba(0,0,0,0.35) ${edge + 3}%, transparent ${edge + 7}%)`;
  const penX = 1020 - (p * 1.12 - 0.06) * 960;
  const on = p > 0 && p < 1;
  return (
    <>
      <div style={{ ...center, top, WebkitMaskImage: mask, maskImage: mask }}>{children}</div>
      {on ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <radialGradient id="pen">
            <stop offset="0" stopColor="#FFFDF4" />
            <stop offset="0.3" stopColor="rgba(243,211,138,0.9)" />
            <stop offset="1" stopColor="rgba(243,211,138,0)" />
          </radialGradient>
          <rect x={penX} y={top + 10} width={4} height={200} fill="rgba(255,246,220,0.8)" style={{ filter: "blur(3px)" }} />
          <circle cx={penX} cy={top + 110} r={60} fill="url(#pen)" opacity={0.9} />
          {Array.from({ length: 18 }, (_, i) => {
            const a = ((f * 7 + i * 47) % 100) / 100;
            return <circle key={i} cx={penX + a * 120 + Math.sin(i * 3 + f / 3) * 8} cy={top + 20 + ((i * 37) % 190) + a * 30} r={3 * (1 - a) + 1} fill="url(#pen)" opacity={1 - a} />;
          })}
        </svg>
      ) : null}
    </>
  );
};
export const Speech: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Burst t={f - Q.voice} x={540} y={1650} n={70} spread={300} gravity={1} up={160} dur={70} color="#E9C99A" id="sb1" size={3} />
      <div style={{ ...center, top: 220 }}>
        <BlurWords start={8} stagger={4} tokens={[{ t: "Then" }, { t: "one ant", italic: true, color: GOLD, glow: GOLD_GLOW }, { t: "spoke." }]} style={{ fontSize: 86 }} />
      </div>
      <Written f={f} start={30} dur={70} top={380}>
        <Sentence size={60} />
      </Written>
      <div style={{ ...center, top: 630, padding: "0 80px" }}>
        <BlurWords start={60} stagger={2} tokens={[{ t: "“O ants, enter your dwellings," }, { br: true, t: "" }, { t: "that you not be crushed by Sulaymān" }, { br: true, t: "" }, { t: "and his soldiers" }, { t: "while they perceive not.”", italic: true, color: GOLD }]} style={{ fontSize: 46, lineHeight: 1.3, fontStyle: "italic" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · Decoded: ten things
export const rowAt = (i: number) => Q.rows0 + i * Q.rowStep;

export const Decode: React.FC = () => {
  const f = useCurrentFrame();
  const lit = (i: number) => progress(f, rowAt(i), 18);
  const n = TEN.filter((_, i) => f >= rowAt(i)).length;
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 168 }}>
        <BlurWords start={4} stagger={3} tokens={[{ t: "Scholars of rhetoric" }, { t: "counted ten.", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 56 }} />
      </div>
      <div style={{ ...center, top: 250 }}>
        <Sentence size={39} lit={lit} />
      </div>
      <Prism f={f} appear={progress(f, Q.prism, 40)} lit={(i) => progress(f, rowAt(i) - 8, 16)} out={0} />
      <Prism3D f={f} appear={progress(f, Q.prism, 40)} flash={Math.max(0, 1 - Math.abs(f - Q.prism - 34) / 20)} />
      <Burst t={f - Q.prism - 16} x={PRISM[0]} y={PRISM[1]} n={70} spread={380} dur={60} color="#DCE6FF" id="pb" />
      {TEN.map((t, i) => {
        const p = lit(i);
        return (
          <div key={i} style={{ position: "absolute", left: 80, right: 80, top: ROW_Y0 + i * ROW_STEP, height: ROW_STEP - 12, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", borderRadius: 16, background: "rgba(12,19,34,0.82)", border: `1.5px solid ${p > 0 ? hue(i) : "rgba(236,230,218,0.08)"}`, boxShadow: p > 0 ? `0 0 ${24 * p}px ${hueGlow(i)}` : undefined, opacity: 0.35 + 0.65 * p }}>
            <div style={{ fontFamily: F.mono, fontSize: 22, color: p > 0 ? hue(i) : C.dim, width: 40 }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 14, ...focusIn(p, 6, 8) }}>
              <div style={{ fontFamily: F.serif, fontSize: 38, color: C.ink, lineHeight: 1.1 }}>{t.en}</div>
              <div dir="rtl" lang="ar" style={{ fontFamily: F.naskh, fontSize: 28, color: C.dim }}>{t.verb}</div>
            </div>
            <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 44, color: p > 0 ? hue(i) : C.dim, textShadow: p > 0 ? `0 0 16px ${hueGlow(i)}` : undefined, whiteSpace: "nowrap" }}>{t.ar}</div>
          </div>
        );
      })}
      {TEN.map((_, i) => (
        <Burst key={i} t={f - rowAt(i)} x={150} y={ROW_Y0 + i * ROW_STEP + 36} n={26} spread={170} dur={36} color={hue(i)} id={`rb${i}`} size={3.2} />
      ))}
      <div style={{ position: "absolute", top: 1574, left: 0, right: 0, textAlign: "center", fontFamily: F.mono, fontSize: 20, letterSpacing: "0.3em", color: C.dim, opacity: progress(f, Q.rows0, 20) }}>
        {String(n).padStart(2, "0")} / 10 · Ṣafwat al-Tafāsīr on 27:18
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · Warned — and excused
export const Excuse: React.FC = () => {
  const f = useCurrentFrame();
  const pair = [
    { i: 5, en: "She warned them about the army —" },
    { i: 9, en: "and excused the army in the same breath." },
  ];
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 200 }}>
        <BlurWords start={6} stagger={4} tokens={[{ t: "Look at" }, { t: "the last one.", italic: true, color: hue(9), glow: hueGlow(9) }]} style={{ fontSize: 82 }} />
      </div>
      {pair.map((c, k) => (
        <div key={k} style={{ ...center, top: 420 + k * 230, ...focusIn(progress(f, 30 + k * 40, 22), 12, 12) }}>
          <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 84, color: hue(c.i), textShadow: `0 0 26px ${hueGlow(c.i)}`, lineHeight: 1.5 }}>{TEN[c.i].ar}</div>
          <div style={{ fontFamily: F.serif, fontSize: 50, color: C.ink, fontStyle: k ? "italic" : undefined }}>{c.en}</div>
        </div>
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[0, 1].map((k) => {
          const a = progress(f, 30 + k * 40, 30);
          const cy = 470 + k * 230;
          return <ellipse key={k} cx={540} cy={cy} rx={260 + Math.sin(f / 25 + k) * 8} ry={58} fill="none" stroke={hue(k ? 9 : 5)} strokeWidth={1.6} opacity={a * 0.6} strokeDasharray="6 10" strokeDashoffset={-f * (k ? -1.2 : 1.2)} transform={`rotate(${k ? 4 : -4},540,${cy})`} />;
        })}
        <path d="M800,470 C990,520 990,650 800,700" fill="none" stroke="url(#arcG)" strokeWidth={3} pathLength={1} strokeDasharray={`${progress(f, 80, 34)} 1`} style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.7))" }} />
        <linearGradient id="arcG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hue(5)} />
          <stop offset="1" stopColor={hue(9)} />
        </linearGradient>
      </svg>
      <Burst t={f - 30} x={540} y={490} n={40} spread={300} dur={50} color={hue(5)} id="eb1" />
      <Burst t={f - 70} x={540} y={720} n={50} spread={340} dur={56} color={hue(9)} id="eb2" />
      <div style={{ ...center, top: 960 }}>
        <BlurWords start={Q.excuseAr} stagger={4} tokens={[{ t: "“…while they" }, { t: "perceive not.”", italic: true, color: hue(9), glow: hueGlow(9) }]} style={{ fontSize: 64 }} />
        <Mono p={progress(f, Q.excuseAr + 20, 18)} style={{ marginTop: 18, fontSize: 20 }}>27:18</Mono>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6 · Sulaymān smiled; loops onto frame 0
export const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = interpolate(f, [Q.loop, dur - 8], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <Rising t={f - Q.smile} dur={170} n={110} id="cr" />
      <Burst t={f - Q.smile - 14} x={700} y={310} n={50} spread={360} dur={60} id="cb" />
      <AbsoluteFill style={{ ...focusOut(back) }}>
        <Line f={f} from={Q.smile} to={Q.dua - 6} top={240}>
          <BlurWords start={Q.smile} stagger={5} tokens={[{ t: "Sulaymān" }, { t: "smiled.", italic: true, color: GOLD, glow: GOLD_GLOW }]} style={{ fontSize: 108 }} />
          <ArabicWords start={Q.smile + 20} stagger={5} size={64} tokens={[{ t: "فَتَبَسَّمَ", color: GOLD, glow: GOLD_GLOW }, { t: "ضَاحِكٗا مِّن قَوۡلِهَا" }]} style={{ marginTop: 10 }} />
          <Mono p={progress(f, Q.smile + 30, 18)} style={{ fontSize: 20 }}>27:19</Mono>
        </Line>
        <Line f={f} from={Q.dua} to={dur} top={240}>
          <Mono p={progress(f, Q.dua, 18)} style={{ color: C.sun }}>And he said</Mono>
          <ArabicWords start={Q.dua + 6} stagger={5} size={66} tokens={[{ t: "رَبِّ أَوۡزِعۡنِيٓ أَنۡ" }, { t: "أَشۡكُرَ نِعۡمَتَكَ", color: GOLD, glow: GOLD_GLOW }]} style={{ marginTop: 8 }} />
          <BlurWords start={Q.dua + 26} stagger={3} tokens={[{ t: "“My Lord, enable me to be grateful" }, { br: true, t: "" }, { t: "for Your favor.”", italic: true, color: GOLD }]} style={{ fontSize: 52, fontStyle: "italic" }} />
        </Line>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: back }}>
        <Title g={f + T.close[0]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { T };
