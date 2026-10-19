import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Rosette, StarMark } from "../components/Light";
import { CLAMP, easeIn, easeInOut, focusIn, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { Chest, River } from "./River";

export const TEAL = "#8DD5C2";
export const TEAL_GLOW = "rgba(141,213,194,0.5)";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

const TitleCard: React.FC<{ label: string; p: number }> = ({ label, p }) => (
  <div style={{ ...center, top: 236, alignItems: "center", gap: 22, opacity: p }}>
    <div style={{ width: 150 * p, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
    <StarMark size={22} />
    <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>{label}</Mono>
    <StarMark size={22} />
    <div style={{ width: 150 * p, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
  </div>
);

// 1 — Hook: "A mother was told to cast her baby into a river. — and she obeyed." -> "22 words." -> "8 messages."
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const out1 = progress(f, 96, 14);
  const words = Math.max(0, Math.min(22, Math.floor((f - 108) / 2)));
  const dive = interpolate(f, [dur - 24, dur], [1, 1.5], { ...CLAMP, easing: easeIn });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 820, top: 330, width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle, #F4F6FA 0%, ${C.moon} 45%, transparent 72%)`, boxShadow: `0 0 120px 40px ${C.moonGlow}`, opacity: 0.55 }} />
      <River top={1250} />
      <Chest x={interpolate(f, [0, dur], [190, 470])} y={1300} scale={0.9} />
      <AbsoluteFill style={{ transform: `scale(${dive})`, transformOrigin: "540px 760px" }}>
        <TitleCard label="Al-Qaṣaṣ · 28:7" p={progress(f, -16, 30)} />
        <AbsoluteFill style={{ opacity: 1 - out1, filter: out1 > 0 ? `blur(${out1 * 14}px)` : undefined }}>
          <div style={{ ...center, top: 520 }}>
            <BlurWords start={-16} stagger={2} dur={14} tokens={[{ t: "A mother was told" }, { br: true, t: "" }, { t: "to cast her baby into a river." }]} style={{ fontSize: 70 }} />
          </div>
          <div style={{ ...center, top: 730 }}>
            <BlurWords start={56} stagger={4} tokens={[{ t: "— and she obeyed.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 76 }} />
          </div>
        </AbsoluteFill>
        <div style={{ ...center, top: 470 }}>
          <div style={{ fontFamily: F.serif, fontSize: 210, lineHeight: 1, color: C.ink, ...focusIn(progress(f, 104, 22), 0, 24) }}>
            22 <span style={{ fontStyle: "italic", fontSize: 120 }}>words.</span>
          </div>
        </div>
        <div style={{ ...center, top: 720, gap: 16 }}>
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: i < words ? C.ink : "transparent", border: `1.5px solid ${C.faint}`, boxShadow: i < words ? `0 0 10px ${C.sunGlow}` : undefined, opacity: progress(f, 104, 14) }} />
          ))}
        </div>
        <div style={{ ...center, top: 800 }}>
          <div style={{ fontFamily: F.serif, fontSize: 150, lineHeight: 1.05, ...focusIn(progress(f, 150, 22), 0, 24), ...shine(C.sun, interpolate(f, [158, 210], [0, 1], CLAMP), C.sunGlow) }}>8 messages.</div>
        </div>
        <div style={{ ...center, top: 990 }}>
          <Mono p={progress(f, 170, 20)} style={{ fontSize: 24 }}>In a single verse</Mono>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 — The verse in full.
export const Verse: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 260 }}>
        <BlurWords start={6} tokens={[{ t: "Read it once.", italic: true }]} style={{ fontSize: 72 }} />
      </div>
      <Rosette cx={540} cy={880} r={520} opacity={progress(f, 10, 60) * 0.07} />
      <div style={{ ...center, top: 470 }}>
        <Card p={progress(f, 20, 40)} width={980}>
          <Mono p={progress(f, 34, 20)} style={{ color: C.sun }}>Surah al-Qaṣaṣ · 28:7</Mono>
          <ArabicWords
            start={40}
            stagger={5}
            size={68}
            style={{ marginTop: 20 }}
            tokens={[
              { t: "وَأَوۡحَيۡنَآ إِلَىٰٓ أُمِّ مُوسَىٰٓ أَنۡ أَرۡضِعِيهِۖ" },
              { t: "", br: true },
              { t: "فَإِذَا خِفۡتِ عَلَيۡهِ فَأَلۡقِيهِ فِي ٱلۡيَمِّ" },
              { t: "", br: true },
              { t: "وَلَا تَخَافِي وَلَا تَحۡزَنِيٓۖ" },
              { t: "", br: true },
              { t: "إِنَّا رَآدُّوهُ إِلَيۡكِ وَجَاعِلُوهُ مِنَ ٱلۡمُرۡسَلِينَ" },
            ]}
          />
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 36, lineHeight: 1.38, color: C.ink, textAlign: "center", marginTop: 18, ...focusIn(progress(f, 150, 26), 8, 10) }}>
            &ldquo;And We inspired to the mother of Moses, &lsquo;Suckle him; but when you fear for him, cast him into the river and do not fear and do not grieve. Indeed, We will return him to you and will make him [one] of the messengers.&rsquo;&rdquo;
          </div>
          <Mono p={progress(f, 170, 20)} style={{ marginTop: 22, fontSize: 21 }}>Sahih International</Mono>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// 3 — Al-Aṣmaʿī and the Bedouin girl (reported by al-Qurṭubī).
export const Asmai: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 250 }}>
        <BlurWords start={6} stagger={3} tokens={[{ t: "Some twelve centuries ago," }, { br: true, t: "" }, { t: "a Bedouin girl told" }, { t: "al-Aṣmaʿī:", italic: true, color: C.sun }]} style={{ fontSize: 58 }} />
      </div>
      <Rosette cx={540} cy={900} r={500} opacity={progress(f, 40, 60) * 0.06} speed={-0.05} />
      <div style={{ ...center, top: 520 }}>
        <Card p={progress(f, 40, 36)} width={960} style={{ background: "linear-gradient(170deg, rgba(38,32,24,0.78), rgba(18,24,38,0.78))", border: "1px solid rgba(233,185,110,0.28)", padding: "46px 52px 44px" }}>
          <div style={{ position: "absolute", inset: 12, borderRadius: 26, border: "1px solid rgba(233,185,110,0.14)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <StarMark size={28} p={progress(f, 48, 20)} />
          </div>
          <BlurWords
            start={60}
            stagger={2}
            dur={16}
            style={{ fontSize: 42, lineHeight: 1.36, fontStyle: "italic" }}
            tokens={[{ t: "“Is this eloquence, beside His words…" }, { t: "‘And We inspired to the mother of Moses’?”", color: C.dim }]}
          />
          <ArabicWords
            start={110}
            stagger={5}
            size={50}
            font={F.naskh}
            style={{ marginTop: 22, lineHeight: 1.8 }}
            tokens={[
              { t: "فجمع في آية واحدة بين" },
              { t: "أمرين", color: C.sun, glow: C.sunGlow },
              { t: "ونهيين", color: C.moon, glow: C.moonGlow },
              { t: "وخبرين", color: TEAL, glow: TEAL_GLOW },
              { t: "وبشارتين", color: TEAL, glow: TEAL_GLOW },
            ]}
          />
          <div style={{ height: 1, margin: "18px auto", width: 420 * progress(f, 160, 24), background: `linear-gradient(90deg, transparent, ${C.sun}, transparent)` }} />
          <BlurWords
            start={168}
            stagger={2}
            dur={16}
            style={{ fontSize: 40, lineHeight: 1.38, fontStyle: "italic" }}
            tokens={[
              { t: "“In one verse He gathered" },
              { t: "two commands,", color: C.sun },
              { t: "two prohibitions,", color: C.moon },
              { t: "two pieces of news", color: TEAL },
              { t: "and" },
              { t: "two glad tidings.”", color: TEAL },
            ]}
          />
          <Mono p={progress(f, 214, 20)} style={{ marginTop: 26, fontSize: 21 }}>Reported by al-Qurṭubī · on 28:7 · translated</Mono>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

type Row = { ar: string; en: string; kind: "cmd" | "pro" | "news"; at: number };
const ROWS: Row[] = [
  { ar: "أَرۡضِعِيهِۖ", en: "“Suckle him”", kind: "cmd", at: 40 },
  { ar: "فَأَلۡقِيهِ فِي ٱلۡيَمِّ", en: "“cast him into the river”", kind: "cmd", at: 116 },
  { ar: "وَلَا تَخَافِي", en: "“do not fear”", kind: "pro", at: 192 },
  { ar: "وَلَا تَحۡزَنِيٓۖ", en: "“do not grieve”", kind: "pro", at: 268 },
  { ar: "إِنَّا رَآدُّوهُ إِلَيۡكِ", en: "“We will return him to you”", kind: "news", at: 344 },
  { ar: "وَجَاعِلُوهُ مِنَ ٱلۡمُرۡسَلِينَ", en: "“and make him one of the messengers”", kind: "news", at: 420 },
];
const KIND = {
  cmd: { label: "Command", color: C.sun, glow: C.sunGlow },
  pro: { label: "Prohibition", color: C.moon, glow: C.moonGlow },
  news: { label: "News", color: TEAL, glow: TEAL_GLOW },
};
const GLAD_DELAY = 34;
const TOTAL_AT = 510;

const Chip: React.FC<{ label: string; color: string; p: number }> = ({ label, color, p }) => (
  <div
    style={{
      fontFamily: F.mono,
      fontSize: 18,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color,
      border: `1px solid ${color}`,
      borderRadius: 999,
      padding: "6px 14px",
      background: "rgba(10,18,32,0.6)",
      boxShadow: `0 0 16px ${color}55`,
      opacity: p,
      transform: `translateY(${(1 - p) * 10}px) scale(${0.9 + p * 0.1})`,
    }}
  >
    {label}
  </div>
);

// 4 — The decode: six phrases, eight messages.
export const Decode: React.FC = () => {
  const f = useCurrentFrame();
  const count = (k: Row["kind"]) => ROWS.filter((r) => r.kind === k && f >= r.at + 30).length;
  const glad = ROWS.filter((r) => r.kind === "news" && f >= r.at + 30 + GLAD_DELAY).length;
  const tally = [
    { label: "Commands", n: count("cmd"), color: C.sun },
    { label: "Prohibitions", n: count("pro"), color: C.moon },
    { label: "News", n: count("news"), color: TEAL },
    { label: "Glad tidings", n: glad, color: TEAL },
  ];
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 240 }}>
        <BlurWords start={4} tokens={[{ t: "Now decode it." }]} style={{ fontSize: 66 }} />
      </div>
      {ROWS.map((r, i) => {
        const p = progress(f, r.at, 24);
        const chip = progress(f, r.at + 30, 14);
        const gp = r.kind === "news" ? progress(f, r.at + 30 + GLAD_DELAY, 14) : 0;
        const k = KIND[r.kind];
        const y = 400 + i * 128;
        return (
          <div key={i} style={{ position: "absolute", top: y, left: 70, right: 70, height: 116, display: "flex", alignItems: "center", justifyContent: "space-between", ...focusIn(p, 14, 12) }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
              <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 32, color: C.ink }}>{r.en}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <Chip label={k.label} color={k.color} p={chip} />
                {r.kind === "news" && <Chip label="Glad tiding" color={TEAL} p={gp} />}
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 62, color: chip > 0 ? k.color : C.ink, textShadow: chip > 0 ? `0 0 26px ${k.glow}` : undefined }}>
                {r.ar}
              </div>
              <div style={{ position: "absolute", right: 0, bottom: -4, height: 2, width: `${chip * 100}%`, background: `linear-gradient(270deg, ${k.color}, transparent)` }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1200, left: 60, right: 60, display: "flex", justifyContent: "space-between", ...focusIn(progress(f, 30, 24), 10, 10) }}>
        {tally.map((t, i) => (
          <div key={i} style={{ width: 225, textAlign: "center", padding: "16px 0", borderRadius: 18, border: `1px solid ${t.n > 0 ? t.color : C.hair}`, background: "rgba(10,18,32,0.5)" }}>
            <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: t.color }}>{t.label}</div>
            <div style={{ fontFamily: F.serif, fontSize: 70, lineHeight: 1.1, color: t.n > 0 ? C.ink : C.dim, fontVariantNumeric: "tabular-nums" }}>{t.n}</div>
          </div>
        ))}
      </div>
      <div style={{ ...center, top: 1400 }}>
        <div style={{ fontFamily: F.serif, fontSize: 96, ...focusIn(progress(f, TOTAL_AT, 22), 10, 20), ...shine(C.sun, interpolate(f, [TOTAL_AT + 6, TOTAL_AT + 60], [0, 1], CLAMP), C.sunGlow) }}>
          = 8 messages
        </div>
      </div>
      <div style={{ ...center, top: 1520, flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Mono p={progress(f, TOTAL_AT + 24, 20)} style={{ fontSize: 19 }}>The two promises are news</Mono>
        <Mono p={progress(f, TOTAL_AT + 30, 20)} style={{ fontSize: 19 }}>and glad tidings at once · al-Marāghī</Mono>
      </div>
    </AbsoluteFill>
  );
};

// 5 — Her heart became empty (28:10), the chest drifting away.
export const Heart: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, dur], [0, 1], { ...CLAMP, easing: easeInOut });
  return (
    <AbsoluteFill>
      <River top={1120} opacity={progress(f, 0, 30)} />
      <Chest x={540 + k * 300} y={1170 - k * 40} scale={1 - k * 0.6} glow={1 - k * 0.6} />
      <div style={{ ...center, top: 330 }}>
        <Mono p={progress(f, 6, 20)}>Al-Qaṣaṣ 28:10 · opening</Mono>
      </div>
      <div style={{ ...center, top: 390 }}>
        <ArabicWords start={14} stagger={7} size={96} tokens={[{ t: "وَأَصۡبَحَ فُؤَادُ أُمِّ مُوسَىٰ فَٰرِغًاۖ" }]} />
      </div>
      <div style={{ ...center, top: 640 }}>
        <BlurWords start={56} tokens={[{ t: "“And the heart of Moses' mother" }, { br: true, t: "" }, { t: "became empty [of all else].”" }]} style={{ fontSize: 52, fontStyle: "italic" }} />
      </div>
      <div style={{ ...center, top: 860 }}>
        <BlurWords start={110} tokens={[{ t: "But the promise" }, { t: "was already made.", italic: true, color: TEAL, glow: TEAL_GLOW }]} style={{ fontSize: 50 }} />
      </div>
    </AbsoluteFill>
  );
};

// 6 — The promise of 28:7, kept in 28:13.
export const Fulfilment: React.FC = () => {
  const f = useCurrentFrame();
  const beam = progress(f, 80, 40);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 236 }}>
        <Mono p={progress(f, 4, 20)}>Al-Qaṣaṣ 28:7 · the promise</Mono>
      </div>
      <div style={{ ...center, top: 280 }}>
        <ArabicWords
          start={10}
          stagger={6}
          size={70}
          tokens={[
            { t: "وَلَا تَحۡزَنِيٓۖ", color: C.moon, glow: C.moonGlow },
            { t: "إِنَّا رَآدُّوهُ إِلَيۡكِ", color: TEAL, glow: TEAL_GLOW },
          ]}
        />
      </div>
      <div style={{ ...center, top: 430 }}>
        <BlurWords start={40} tokens={[{ t: "“…do not grieve. Indeed, We will return him to you…”" }]} style={{ fontSize: 36, fontStyle: "italic", color: C.dim }} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={540} x2={540} y1={510} y2={510 + 150 * beam} stroke="#FFF6E6" strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 10px rgba(255,240,210,0.9))" }} />
        <circle cx={540} cy={510 + 150 * beam} r={5 * beam} fill="#FFF6E6" />
      </svg>
      <div style={{ position: "absolute", left: 570, top: 560 }}>
        <Mono p={progress(f, 100, 20)} style={{ fontSize: 18, textAlign: "left" }}>Six verses later</Mono>
      </div>
      <div style={{ ...center, top: 690 }}>
        <Mono p={progress(f, 110, 20)}>Al-Qaṣaṣ 28:13 · the promise kept</Mono>
      </div>
      <div style={{ ...center, top: 730, padding: "0 50px" }}>
        <ArabicWords
          start={118}
          stagger={6}
          size={66}
          tokens={[
            { t: "فَرَدَدۡنَٰهُ", color: TEAL, glow: TEAL_GLOW },
            { t: "إِلَىٰٓ أُمِّهِۦ كَيۡ تَقَرَّ عَيۡنُهَا" },
            { t: "وَلَا تَحۡزَنَ", color: C.moon, glow: C.moonGlow },
          ]}
        />
      </div>
      <div style={{ ...center, top: 960, padding: "0 80px" }}>
        <BlurWords start={170} stagger={2} tokens={[{ t: "“So We restored him to his mother that she might be content and" }, { t: "not grieve…”", color: C.moon }]} style={{ fontSize: 38, fontStyle: "italic" }} />
      </div>
      <div style={{ ...center, top: 1120 }}>
        <ArabicWords start={236} stagger={8} size={100} tokens={[{ t: "وَلِتَعۡلَمَ أَنَّ وَعۡدَ ٱللَّهِ حَقّٞ", color: C.sun, glow: C.sunGlow, sweep: interpolate(f, [290, 360], [0, 1], CLAMP) }]} />
      </div>
      <div style={{ ...center, top: 1330 }}>
        <BlurWords start={286} tokens={[{ t: "“…and that she would know" }, { br: true, t: "" }, { t: "that the promise of Allah is true.”", color: C.sun }]} style={{ fontSize: 48, fontStyle: "italic" }} />
      </div>
    </AbsoluteFill>
  );
};

// 7 — Outro: the chest comes back towards us.
export const Outro: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, total - 30], [0, 1], { ...CLAMP, easing: easeInOut });
  const fadeAll = interpolate(f, [total - 26, total], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: fadeAll }}>
      <River top={1240} opacity={progress(f, 0, 30)} />
      <Chest x={860 - k * 320} y={1270 + k * 60} scale={0.4 + k * 0.7} glow={0.4 + k} />
      <div style={{ ...center, top: 520 }}>
        <BlurWords start={10} stagger={5} dur={22} tokens={[{ t: "Eight messages." }, { br: true, t: "" }, { t: "One promise —" }, { t: "kept.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 92 }} />
      </div>
      <div style={{ ...center, top: 830 }}>
        <BlurWords start={70} tokens={[{ t: "Read al-Qaṣaṣ 28:7–13 slowly." }]} style={{ fontSize: 42, color: C.dim }} />
      </div>
      <div style={{ ...center, top: 1080, alignItems: "center", gap: 18 }}>
        <StarMark size={20} p={progress(f, 96, 24)} />
        <Mono p={progress(f, 96, 24)} style={{ color: C.ink }}>Quran Decoding</Mono>
        <StarMark size={20} p={progress(f, 96, 24)} />
      </div>
    </AbsoluteFill>
  );
};
