import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Rosette, StarMark } from "../components/Light";
import { CLAMP, easeInOut, focusIn, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";

export const HEAR = "#8DD5C2"; // hearing
export const HEAR_GLOW = "rgba(141,213,194,0.5)";
export const SEE = C.sun; // seeing
const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

// Every adjacent «سميع / بصير» pair in the Qur'an (KFGQPC Hafs), in mushaf order. [first word, second word, ref, aboutAllah]
export const TILES: [string, string, string, boolean][] = [
  ["سَمِيعَۢا", "بَصِيرٗا", "4:58", true],
  ["سَمِيعَۢا", "بَصِيرٗا", "4:134", true],
  ["وَٱلۡبَصِيرِ", "وَٱلسَّمِيعِۚ", "11:24", false],
  ["ٱلسَّمِيعُ", "ٱلۡبَصِيرُ", "17:1", true],
  ["سَمِيعُۢ", "بَصِيرٞ", "22:61", true],
  ["سَمِيعُۢ", "بَصِيرٞ", "22:75", true],
  ["سَمِيعُۢ", "بَصِيرٌ", "31:28", true],
  ["ٱلسَّمِيعُ", "ٱلۡبَصِيرُ", "40:20", true],
  ["ٱلسَّمِيعُ", "ٱلۡبَصِيرُ", "40:56", true],
  ["ٱلسَّمِيعُ", "ٱلۡبَصِيرُ", "42:11", true],
  ["سَمِيعُۢ", "بَصِيرٌ", "58:1", true],
  ["سَمِيعَۢا", "بَصِيرًا", "76:2", false],
];
export const EXCEPTION = 2;
const tilePos = (i: number) => ({ x: 540 + ((i % 3) - 1) * 318 - 148, y: 560 + Math.floor(i / 3) * 172 });

export const Tile: React.FC<{ i: number; p: number; dim?: number; lift?: number; hl?: number }> = ({ i, p, dim = 0, lift = 0, hl = 0 }) => {
  const [w1, w2, ref] = TILES[i];
  const seeFirst = i === EXCEPTION;
  const { x, y } = tilePos(i);
  const tx = interpolate(lift, [0, 1], [x, 540 - 148]);
  const ty = interpolate(lift, [0, 1], [y, 640]);
  const sc = 1 + lift * 0.9;
  return (
    <div
      style={{
        position: "absolute",
        left: tx,
        top: ty,
        width: 296,
        height: 150,
        borderRadius: 22,
        background: "rgba(19,29,48,0.7)",
        border: `1.5px solid ${hl > 0 ? `rgba(240,138,93,${0.4 + hl * 0.6})` : C.hair}`,
        boxShadow: hl > 0 ? `0 0 ${40 * hl}px rgba(240,138,93,${0.35 * hl})` : "0 20px 60px rgba(0,0,0,0.35)",
        transform: `scale(${sc})`,
        transformOrigin: "50% 50%",
        opacity: p * (1 - dim * 0.82),
        filter: dim > 0 ? `blur(${dim * 6}px)` : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        zIndex: lift > 0 ? 5 : 1,
      }}
    >
      <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 46, whiteSpace: "nowrap" }}>
        <span style={{ color: seeFirst ? SEE : HEAR, textShadow: `0 0 14px ${seeFirst ? C.sunGlow : HEAR_GLOW}` }}>{w1}</span>{" "}
        <span style={{ color: seeFirst ? HEAR : SEE, textShadow: `0 0 14px ${seeFirst ? HEAR_GLOW : C.sunGlow}` }}>{w2}</span>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: "0.25em", color: C.dim }}>{ref}</div>
    </div>
  );
};

// The opening state, also used as the final frames so the reel loops seamlessly.
export const Wall: React.FC<{ f: number; dimAll?: number }> = ({ f, dimAll = 0 }) => (
  <AbsoluteFill>
    <div style={{ ...center, top: 236, alignItems: "center", gap: 22 }}>
      <div style={{ width: 150, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={22} />
      <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>Two names of Allah</Mono>
      <StarMark size={22} />
      <div style={{ width: 150, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ ...center, top: 300 }}>
      <div style={{ fontFamily: F.serif, fontSize: 116, lineHeight: 1.05, textAlign: "center" }}>
        <span style={{ color: HEAR, textShadow: `0 0 30px ${HEAR_GLOW}` }}>Hearing.</span>{" "}
        <span style={{ fontStyle: "italic", ...shine(SEE, 0.5, C.sunGlow) }}>Seeing.</span>
      </div>
    </div>
    <div style={{ ...center, top: 440 }}>
      <Mono style={{ fontSize: 24 }}>Samīʿ · Baṣīr</Mono>
    </div>
    {TILES.map((_, i) => (
      <Tile key={i} i={i} p={1} dim={dimAll} />
    ))}
  </AbsoluteFill>
);

// 1 — Hook: the wall of tiles is on screen from frame 0.
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Wall f={f} />
      <div style={{ ...center, top: 1290 }}>
        <BlurWords start={26} stagger={4} tokens={[{ t: "Hearing first —", color: HEAR }, { t: "every time…", italic: true }]} style={{ fontSize: 76 }} />
      </div>
    </AbsoluteFill>
  );
};

// 2 — "…except once." The exception lifts out of the wall.
export const Except: React.FC = () => {
  const f = useCurrentFrame();
  const dim = progress(f, 10, 30);
  const lift = interpolate(f, [16, 60], [0, 1], { ...CLAMP, easing: easeInOut });
  const hl = progress(f, 40, 20);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300, opacity: 1 - dim * 0.7 }}>
        <div style={{ fontFamily: F.serif, fontSize: 116, lineHeight: 1.05, color: C.dim }}>Hearing. Seeing.</div>
      </div>
      {TILES.map((_, i) => (i === EXCEPTION ? null : <Tile key={i} i={i} p={1} dim={dim} />))}
      <Tile i={EXCEPTION} p={1} lift={lift} hl={hl} />
      <div style={{ ...center, top: 1050 }}>
        <BlurWords start={30} stagger={4} dur={20} tokens={[{ t: "…except", italic: true }, { t: "once.", italic: true, color: "#F08A5D", glow: "rgba(240,138,93,0.5)" }]} style={{ fontSize: 110 }} />
      </div>
      <div style={{ ...center, top: 1210 }}>
        <Mono p={progress(f, 60, 20)} style={{ fontSize: 24 }}>Sight first · Hūd 11:24</Mono>
      </div>
    </AbsoluteFill>
  );
};

// 3 — The mirror: blind ↔ seeing, deaf ↔ hearing.
const WORDS: { ar: string; en: string; x: number; color: string }[] = [
  { ar: "كَٱلۡأَعۡمَىٰ", en: "the blind", x: 880, color: C.ink },
  { ar: "وَٱلۡأَصَمِّ", en: "the deaf", x: 650, color: C.ink },
  { ar: "وَٱلۡبَصِيرِ", en: "the seeing", x: 420, color: SEE },
  { ar: "وَٱلسَّمِيعِۚ", en: "the hearing", x: 190, color: HEAR },
];
export const Mirror: React.FC = () => {
  const f = useCurrentFrame();
  const out1 = progress(f, 96, 14);
  const arcA = progress(f, 150, 36, easeInOut);
  const arcB = progress(f, 176, 36, easeInOut);
  const Y = 820;
  const arc = (x1: number, x2: number, up: boolean, p: number, color: string) => {
    const mid = (x1 + x2) / 2;
    const h = up ? Y - 120 : Y + 250;
    const d = `M${x1},${up ? Y - 52 : Y + 112} Q${mid},${h} ${x2},${up ? Y - 52 : Y + 112}`;
    return <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />;
  };
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <Mono p={progress(f, 0, 20)}>Hūd 11:24 · two groups of people</Mono>
      </div>
      <div style={{ ...center, top: 360, opacity: 1 - out1, filter: out1 > 0 ? `blur(${out1 * 12}px)` : undefined }}>
        <BlurWords start={10} tokens={[{ t: "It isn't about Allah." }]} style={{ fontSize: 72 }} />
      </div>
      <div style={{ ...center, top: 360 }}>
        <BlurWords start={104} stagger={3} tokens={[{ t: "It mirrors" }, { t: "“the blind and the deaf.”", italic: true }]} style={{ fontSize: 66 }} />
      </div>
      {WORDS.map((w, i) => (
        <div key={i} style={{ position: "absolute", left: w.x - 130, width: 260, top: Y - 50, textAlign: "center", ...focusIn(progress(f, 30 + i * 8, 22), 12, 10) }}>
          <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 66, color: w.color, textShadow: w.color !== C.ink ? `0 0 22px ${w.color}` : undefined }}>{w.ar}</div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 32, color: C.dim, marginTop: 4 }}>{w.en}</div>
        </div>
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {arc(880, 420, true, arcA, SEE)}
        {arc(650, 190, false, arcB, HEAR)}
      </svg>
      <div style={{ ...center, top: 1210 }}>
        <BlurWords start={196} stagger={3} tokens={[{ t: "Blind ↔ seeing.", color: SEE }, { br: true, t: "" }, { t: "Deaf ↔ hearing.", color: HEAR }]} style={{ fontSize: 60 }} />
      </div>
    </AbsoluteFill>
  );
};

// 4 — Whenever Allah describes Himself.
export const AllahScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 300 }}>
        <BlurWords start={6} stagger={3} tokens={[{ t: "When Allah describes Himself —" }]} style={{ fontSize: 60 }} />
      </div>
      {TILES.map((t, i) => (
        <Tile key={i} i={i} p={progress(f, 8 + i * 3, 16)} dim={t[3] ? 0 : 0.85} hl={0} />
      ))}
      <div style={{ ...center, top: 1290 }}>
        <BlurWords start={60} stagger={4} tokens={[{ t: "10 times." }, { t: "Hearing first.", italic: true, color: HEAR, glow: HEAR_GLOW }]} style={{ fontSize: 72 }} />
      </div>
    </AbsoluteFill>
  );
};

// 5 — The woman of 58:1 and ʿĀʾisha's words.
export const Story: React.FC = () => {
  const f = useCurrentFrame();
  const cardOut = progress(f, 118, 16);
  return (
    <AbsoluteFill>
      <Rosette cx={540} cy={860} r={500} opacity={progress(f, 0, 40) * 0.06} />
      <div style={{ ...center, top: 420, opacity: 1 - cardOut * 0.85, filter: cardOut > 0 ? `blur(${cardOut * 8}px)` : undefined }}>
        <Card p={progress(f, 6, 30)} width={960}>
          <Mono p={progress(f, 14, 18)} style={{ color: C.sun }}>Al-Mujādilah 58:1 · opening</Mono>
          <ArabicWords start={20} stagger={5} size={66} style={{ marginTop: 18 }} tokens={[{ t: "قَدۡ" }, { t: "سَمِعَ", color: HEAR, glow: HEAR_GLOW }, { t: "ٱللَّهُ قَوۡلَ ٱلَّتِي تُجَٰدِلُكَ فِي زَوۡجِهَا وَتَشۡتَكِيٓ إِلَى ٱللَّهِ" }]} />
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 36, lineHeight: 1.36, color: C.ink, textAlign: "center", marginTop: 14, ...focusIn(progress(f, 70, 22), 8, 10) }}>
            &ldquo;Certainly has Allah <span style={{ color: HEAR }}>heard</span> the speech of the one who argues with you concerning her husband and directs her complaint to Allah.&rdquo;
          </div>
          <Mono p={progress(f, 84, 18)} style={{ marginTop: 18, fontSize: 21 }}>Sahih International</Mono>
        </Card>
      </div>
      <div style={{ ...center, top: 520, flexDirection: "column", alignItems: "center", gap: 26 }}>
        <BlurWords start={132} tokens={[{ t: "A woman came to complain." }]} style={{ fontSize: 60 }} />
        <BlurWords start={176} tokens={[{ t: "ʿĀʾisha was in the same room." }]} style={{ fontSize: 60 }} />
        <BlurWords start={218} tokens={[{ t: "She couldn't hear what she said.", italic: true, color: C.dim }]} style={{ fontSize: 60 }} />
      </div>
      <div style={{ ...center, top: 900 }}>
        <div style={{ fontFamily: F.serif, fontSize: 150, ...focusIn(progress(f, 266, 24), 10, 24), ...shine(SEE, interpolate(f, [274, 340], [0, 1], CLAMP), C.sunGlow) }}>Allah did.</div>
      </div>
      <div style={{ ...center, top: 1110 }}>
        <Mono p={progress(f, 300, 20)} style={{ fontSize: 20 }}>Ibn Mājah 188 · al-Nasāʾī 3460 · ṣaḥīḥ (al-Albānī)</Mono>
      </div>
    </AbsoluteFill>
  );
};

// 6 — Close (20:46), dissolving back into the opening wall so the reel loops.
export const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = interpolate(f, [dur - 46, dur - 8], [0, 1], { ...CLAMP, easing: easeInOut });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - back, filter: back > 0 ? `blur(${back * 14}px)` : undefined }}>
        <div style={{ ...center, top: 520 }}>
          <Mono p={progress(f, 6, 20)}>Ṭā-Hā 20:46</Mono>
        </div>
        <div style={{ ...center, top: 580 }}>
          <ArabicWords start={14} stagger={8} size={104} tokens={[{ t: "إِنَّنِي مَعَكُمَآ" }, { t: "أَسۡمَعُ", color: HEAR, glow: HEAR_GLOW }, { t: "وَأَرَىٰ", color: SEE, glow: C.sunGlow }]} />
        </div>
        <div style={{ ...center, top: 860 }}>
          <BlurWords start={60} stagger={3} tokens={[{ t: "“Indeed, I am with you both;" }, { br: true, t: "" }, { t: "I hear", color: HEAR }, { t: "and" }, { t: "I see.”", color: SEE }]} style={{ fontSize: 58, fontStyle: "italic" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: back }}>
        <Wall f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
