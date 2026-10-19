import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Rosette, StarMark } from "../components/Light";
import { CLAMP, easeIn, easeInOut, focusIn, progress } from "../lib/anim";
import { C, F } from "../lib/theme";
import { CaveMap, sunlightInside } from "./CaveMap";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };
const EMBER = "#F08A5D";

const TitleCard: React.FC<{ label: string; p: number }> = ({ label, p }) => (
  <div style={{ ...center, top: 236, alignItems: "center", gap: 22, opacity: p }}>
    <div style={{ width: 150 * p, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
    <StarMark size={22} />
    <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>{label}</Mono>
    <StarMark size={22} />
    <div style={{ width: 150 * p, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
  </div>
);

// 1 — Hook: the cave turns, searching. "Nobody knows where this cave is." -> "But one verse tells you which way it faces."
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const spin = 40 + f * 2.4 + Math.sin(f / 9) * 20;
  const out1 = progress(f, 66, 14);
  const dive = interpolate(f, [dur - 24, dur], [1, 1.5], { ...CLAMP, easing: easeIn });
  return (
    <AbsoluteFill style={{ transform: `scale(${dive})`, transformOrigin: "540px 900px" }}>
      <AbsoluteFill style={{ transform: "translateY(260px) scale(0.78)", transformOrigin: "540px 900px" }}>
        <CaveMap opening={spin} sunAz={90} sunOn={0} appear={progress(f, -20, 30)} showPath={0} />
      </AbsoluteFill>
      <TitleCard label="Al-Kahf · 18:17" p={progress(f, -16, 30)} />
      <div style={{ ...center, top: 400, opacity: 1 - out1, filter: out1 > 0 ? `blur(${out1 * 14}px)` : undefined }}>
        <BlurWords start={-14} stagger={2} dur={14} tokens={[{ t: "Nobody knows" }, { br: true, t: "" }, { t: "where this cave is." }]} style={{ fontSize: 84 }} />
      </div>
      <div style={{ ...center, top: 400 }}>
        <BlurWords
          start={74}
          stagger={4}
          dur={20}
          tokens={[{ t: "But one verse tells you" }, { br: true, t: "" }, { t: "which way it faces.", italic: true, color: C.sun, glow: C.sunGlow, sweep: interpolate(f, [110, 170], [0, 1], CLAMP) }]}
          style={{ fontSize: 74 }}
        />
      </div>
    </AbsoluteFill>
  );
};

// 2 — The verse (opening of 18:17).
export const Verse: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 260 }}>
        <BlurWords start={6} tokens={[{ t: "Read it slowly.", italic: true }]} style={{ fontSize: 72 }} />
      </div>
      <Rosette cx={540} cy={880} r={520} opacity={progress(f, 10, 60) * 0.07} />
      <div style={{ ...center, top: 470 }}>
        <Card p={progress(f, 20, 40)} width={980}>
          <Mono p={progress(f, 34, 20)} style={{ color: C.sun }}>Surah al-Kahf · 18:17 · opening</Mono>
          <ArabicWords
            start={40}
            stagger={5}
            size={62}
            style={{ marginTop: 20 }}
            tokens={[
              { t: "وَتَرَى ٱلشَّمۡسَ إِذَا طَلَعَت تَّزَٰوَرُ عَن كَهۡفِهِمۡ" },
              { t: "ذَاتَ ٱلۡيَمِينِ", color: C.sun, glow: C.sunGlow },
              { t: "وَإِذَا غَرَبَت تَّقۡرِضُهُمۡ" },
              { t: "ذَاتَ ٱلشِّمَالِ", color: C.moon, glow: C.moonGlow },
              { t: "وَهُمۡ فِي فَجۡوَةٖ مِّنۡهُۚ" },
            ]}
          />
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 36, lineHeight: 1.38, color: C.ink, textAlign: "center", marginTop: 18, ...focusIn(progress(f, 140, 26), 8, 10) }}>
            &ldquo;And you would see the sun when it rose, inclining away from their cave <span style={{ color: C.sun }}>on the right</span>, and when it set, passing away from them <span style={{ color: C.moon }}>on the left</span>, while they were [laying] within an open space thereof.&rdquo;
          </div>
          <Mono p={progress(f, 160, 20)} style={{ marginTop: 22, fontSize: 21 }}>Sahih International</Mono>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// 3 — The two clues.
export const Clues: React.FC = () => {
  const f = useCurrentFrame();
  const row = (at: number, ar: string, en: string, color: string, glow: string, top: number) => (
    <div style={{ position: "absolute", top, left: 80, right: 80, ...focusIn(progress(f, at, 24), 14, 12) }}>
      <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 64, color, textShadow: `0 0 26px ${glow}`, textAlign: "center" }}>{ar}</div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 44, color: C.ink, textAlign: "center", marginTop: 6 }}>{en}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 260 }}>
        <BlurWords start={4} tokens={[{ t: "Two clues." }]} style={{ fontSize: 80 }} />
      </div>
      {row(30, "إِذَا طَلَعَت تَّزَٰوَرُ عَن كَهۡفِهِمۡ ذَاتَ ٱلۡيَمِينِ", "At sunrise — it turns away, to the right.", C.sun, C.sunGlow, 470)}
      {row(80, "وَإِذَا غَرَبَت تَّقۡرِضُهُمۡ ذَاتَ ٱلشِّمَالِ", "At sunset — it passes them, on the left.", C.moon, C.moonGlow, 760)}
      <div style={{ ...center, top: 1080 }}>
        <BlurWords start={134} tokens={[{ t: "So which way did the entrance face?" }]} style={{ fontSize: 50, color: C.dim }} />
      </div>
    </AbsoluteFill>
  );
};

const TRIALS = [
  { name: "East", bearing: 90, verdict: "The morning sun pours in.", ok: false },
  { name: "South", bearing: 180, verdict: "Sunlight floods in all day.", ok: false },
  { name: "West", bearing: 270, verdict: "The evening sun pours in.", ok: false },
  { name: "North", bearing: 360, verdict: "The sun turns right at sunrise, passes left at sunset — and never enters.", ok: true },
];
const T0 = 40;
const STEP = 180;
const ROT = 30;
const DAY = 116;

const sunAt = (local: number) => interpolate(local, [ROT, ROT + DAY], [90, 270], { ...CLAMP, easing: easeInOut });

// 4 — Ibn Kathir's test: rotate the cave through every direction and run a day of sun.
export const Test: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(3, Math.floor((f - T0) / STEP)));
  const local = f - T0 - k * STEP;
  const prevBearing = k === 0 ? 90 : TRIALS[k - 1].bearing;
  const opening = k === 0 ? 90 : interpolate(local, [0, ROT], [prevBearing, TRIALS[k].bearing], { ...CLAMP, easing: easeInOut });
  const sunAz = sunAt(local);
  const sunOn = interpolate(local, [ROT - 4, ROT + 8, ROT + DAY - 8, ROT + DAY + 4], [0, 1, 1, 0], CLAMP);
  // hours of direct sun inside the chamber, accumulated over the 12-hour day so far
  let lit = 0;
  for (let i = ROT; i <= Math.min(local, ROT + DAY); i++) lit += sunlightInside(sunAt(i), TRIALS[k].bearing);
  const hours = (lit / DAY) * 12;
  const verdict = progress(local, ROT + DAY - 6, 20);
  const trial = TRIALS[k];
  const vColor = trial.ok ? "#8DD5C2" : EMBER;
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 230 }}>
        <Mono p={progress(f, 0, 20)}>Ibn Kathīr tested every direction</Mono>
      </div>
      <div key={k} style={{ ...center, top: 280 }}>
        <BlurWords start={T0 + k * STEP - 4} tokens={[{ t: "If it faced" }, { t: trial.name + "…", italic: true, color: trial.ok ? C.sun : C.ink }]} style={{ fontSize: 76 }} />
      </div>
      <CaveMap opening={opening} sunAz={sunAz} sunOn={sunOn} appear={progress(f, 6, 30)} sideNotes={trial.ok ? interpolate(local, [ROT + 6, ROT + 26], [0, 1], CLAMP) : 0} />
      <div style={{ position: "absolute", top: 1430, left: 190, right: 190, ...focusIn(progress(f, 20, 20), 8, 8) }}>
        <Mono style={{ textAlign: "left", fontSize: 20 }}>Direct sun inside</Mono>
        <div style={{ marginTop: 12, height: 14, borderRadius: 7, background: "rgba(236,230,218,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${(hours / 12) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.sun}, #FFE6B0)`, boxShadow: `0 0 16px ${C.sunGlow}` }} />
        </div>
        <div style={{ fontFamily: F.serif, fontSize: 44, color: C.ink, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>{hours.toFixed(1)} h</div>
      </div>
      <div style={{ ...center, top: 1590, padding: "0 90px", opacity: verdict, transform: `translateY(${(1 - verdict) * 10}px)` }}>
        <div style={{ textAlign: "center" }}>
          <Mono style={{ color: vColor, fontSize: 22 }}>{trial.ok ? "The sun stays out" : "Light enters"}</Mono>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 40, color: C.ink, marginTop: 8 }}>{trial.verdict}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5 — The result and Ibn Kathir's own words (translated).
export const Result: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 250 }}>
        <BlurWords start={4} tokens={[{ t: "The entrance faced" }, { t: "north.", italic: true, color: C.sun, glow: C.sunGlow, sweep: interpolate(f, [30, 90], [0, 1], CLAMP) }]} style={{ fontSize: 76 }} />
      </div>
      <AbsoluteFill style={{ transform: "translateY(-330px) scale(0.42)", transformOrigin: "540px 900px" }}>
        <CaveMap opening={360} sunAz={interpolate(f, [0, 200], [90, 270], CLAMP)} sunOn={1} appear={1} sideNotes={1} />
      </AbsoluteFill>
      <div style={{ ...center, top: 800 }}>
        <Card p={progress(f, 70, 34)} width={960} style={{ background: "linear-gradient(170deg, rgba(38,32,24,0.82), rgba(18,24,38,0.82))", border: "1px solid rgba(233,185,110,0.28)", padding: "44px 52px 42px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <StarMark size={28} p={progress(f, 80, 20)} />
          </div>
          <Mono p={progress(f, 84, 20)} style={{ color: C.sun, fontSize: 22 }}>Ibn Kathīr · d. 774 AH / 1373 CE</Mono>
          <BlurWords
            start={96}
            stagger={2}
            dur={16}
            style={{ fontSize: 42, lineHeight: 1.38, fontStyle: "italic", marginTop: 18 }}
            tokens={[
              { t: "“This is evidence that the entrance of the cave faced" },
              { t: "north", color: C.sun },
              { t: "… and this is understood by whoever knows the paths of the sun, the moon and the stars.”" },
            ]}
          />
          <Mono p={progress(f, 170, 20)} style={{ marginTop: 24, fontSize: 21 }}>Tafsīr Ibn Kathīr · on 18:17 · translated, abridged</Mono>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// 6 — Another view, and the verse's own words.
export const Signs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300, padding: "0 110px" }}>
        <BlurWords start={4} tokens={[{ t: "Another view" }, { t: "(al-Qurṭubī):", color: C.dim }, { br: true, t: "" }, { t: "the sun was turned from them", italic: true }, { br: true, t: "" }, { t: "by a miracle.", italic: true }]} style={{ fontSize: 56 }} />
      </div>
      <div style={{ ...center, top: 690 }}>
        <Mono p={progress(f, 60, 20)}>The verse itself says</Mono>
      </div>
      <div style={{ ...center, top: 740 }}>
        <ArabicWords start={70} stagger={8} size={110} tokens={[{ t: "ذَٰلِكَ مِنۡ ءَايَٰتِ ٱللَّهِۗ", color: C.sun, glow: C.sunGlow, sweep: interpolate(f, [110, 170], [0, 1], CLAMP) }]} />
      </div>
      <div style={{ ...center, top: 990 }}>
        <BlurWords start={110} tokens={[{ t: "“That was from the signs of Allah.”" }]} style={{ fontSize: 54, fontStyle: "italic" }} />
      </div>
      <div style={{ ...center, top: 1090 }}>
        <Mono p={progress(f, 130, 20)} style={{ fontSize: 20 }}>Al-Kahf 18:17 · Sahih International</Mono>
      </div>
    </AbsoluteFill>
  );
};

// 7 — Outro.
export const Outro: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const fadeAll = interpolate(f, [total - 26, total], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: fadeAll }}>
      <AbsoluteFill style={{ transform: "translateY(330px) scale(0.7)", transformOrigin: "540px 900px", opacity: 0.85 }}>
        <CaveMap opening={360} sunAz={interpolate(f, [0, total], [100, 260], CLAMP)} sunOn={progress(f, 0, 30)} appear={progress(f, 0, 30)} labels={0.6} />
      </AbsoluteFill>
      <div style={{ ...center, top: 360 }}>
        <BlurWords start={10} stagger={5} dur={22} tokens={[{ t: "309 years." }, { br: true, t: "" }, { t: "And the sun kept", italic: true }, { br: true, t: "" }, { t: "turning away.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 84 }} />
      </div>
      <div style={{ ...center, top: 760 }}>
        <BlurWords start={70} tokens={[{ t: "Read al-Kahf 18:9–26 slowly." }]} style={{ fontSize: 42, color: C.dim }} />
      </div>
      <div style={{ ...center, top: 850, alignItems: "center", gap: 18 }}>
        <StarMark size={20} p={progress(f, 96, 24)} />
        <Mono p={progress(f, 96, 24)} style={{ color: C.ink }}>Quran Decoding</Mono>
        <StarMark size={20} p={progress(f, 96, 24)} />
      </div>
    </AbsoluteFill>
  );
};
