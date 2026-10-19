import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { StarMark } from "../components/Light";
import { CLAMP, focusIn, focusOut, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { HEAR, HEAR_GLOW, SEE } from "./Machine";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

// The title block. Static on frame 0 (the reel opens and loops onto it).
export const Title: React.FC<{ sub?: number }> = ({ sub = 1 }) => (
  <>
    <div style={{ ...center, top: 168, alignItems: "center", gap: 22 }}>
      <div style={{ width: 130, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={20} />
      <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>Two names of Allah</Mono>
      <StarMark size={20} />
      <div style={{ width: 130, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ ...center, top: 214 }}>
      <div style={{ fontFamily: F.serif, fontSize: 124, lineHeight: 1.05, ...shine(C.ink, 0.5) }}>Ten times.</div>
    </div>
    <div style={{ ...center, top: 360, ...focusIn(sub, 10, 10) }}>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 58, color: C.dim }}>
        The order <span style={{ color: C.ink }}>never</span> changes.
      </div>
    </div>
  </>
);

// 1 — Hook: the engine is already turning; the claim is on screen from frame 0.
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Title sub={progress(f, 14, 20)} />
    </AbsoluteFill>
  );
};

// 2 — The scan: each lock lights HEARING, then SEEING.
export const Decode: React.FC = () => {
  const f = useCurrentFrame();
  const swap = progress(f, 200, 16);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 196, opacity: 1 - swap }}>
        <BlurWords start={30} stagger={5} tokens={[{ t: "Hearing", color: HEAR, glow: HEAR_GLOW }, { t: "first.", color: HEAR, glow: HEAR_GLOW }]} style={{ fontSize: 110 }} />
      </div>
      <div style={{ ...center, top: 336, opacity: 1 - swap }}>
        <BlurWords start={58} stagger={5} tokens={[{ t: "Then", italic: true, color: C.dim }, { t: "seeing.", italic: true, color: SEE, glow: C.sunGlow }]} style={{ fontSize: 70 }} />
      </div>
      <div style={{ ...center, top: 250 }}>
        <BlurWords start={212} stagger={5} tokens={[{ t: "Every" }, { t: "single", italic: true }, { t: "time." }]} style={{ fontSize: 100 }} />
      </div>
    </AbsoluteFill>
  );
};

// 3 — The tenth lock is heavier; the iris opens.
export const Tenth: React.FC = () => {
  const f = useCurrentFrame();
  const out = progress(f, 92, 18);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 214, ...focusOut(out) }}>
        <BlurWords start={8} stagger={6} tokens={[{ t: "And" }, { t: "the" }, { t: "tenth…", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 108 }} />
      </div>
      <div style={{ ...center, top: 214 }}>
        <BlurWords start={104} stagger={6} tokens={[{ t: "…is" }, { t: "a" }, { t: "story.", italic: true, color: C.sun, glow: C.sunGlow }]} style={{ fontSize: 108 }} />
      </div>
    </AbsoluteFill>
  );
};

// 4 — Inside the machine: the woman of 58:1.
const Line: React.FC<{ f: number; from: number; to: number; children: React.ReactNode; top?: number }> = ({ f, from, to, children, top = 880 }) => {
  const out = progress(f, to, 16);
  return f < from - 2 || out >= 1 ? null : <div style={{ ...center, top, ...focusOut(out) }}>{children}</div>;
};

export const Story: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Line f={f} from={24} to={104}>
        <BlurWords start={24} stagger={4} tokens={[{ t: "A woman came" }, { br: true, t: "" }, { t: "to complain.", italic: true }]} style={{ fontSize: 84 }} />
      </Line>
      <Line f={f} from={116} to={196}>
        <BlurWords start={116} stagger={4} tokens={[{ t: "ʿĀʾisha sat" }, { br: true, t: "" }, { t: "in the same room.", italic: true }]} style={{ fontSize: 84 }} />
      </Line>
      <Line f={f} from={206} to={276}>
        <BlurWords start={206} stagger={4} tokens={[{ t: "She couldn't" }, { br: true, t: "" }, { t: "make out her words.", italic: true, color: C.dim }]} style={{ fontSize: 84 }} />
      </Line>
      <div style={{ ...center, top: 820 }}>
        <div style={{ fontFamily: F.serif, fontSize: 176, ...focusIn(progress(f, 290, 26), 10, 26), ...shine(SEE, interpolate(f, [298, 360], [0, 1], CLAMP), C.sunGlow) }}>Allah did.</div>
      </div>
      <div style={{ ...center, top: 1060 }}>
        <Mono p={progress(f, 316, 20)} style={{ fontSize: 20 }}>al-Nasāʾī 3460 · Ibn Mājah 188 · ṣaḥīḥ</Mono>
      </div>
    </AbsoluteFill>
  );
};

// 5 — The verse that came down: «heard … hears … All-Hearing, All-Seeing».
export const Verse: React.FC = () => {
  const f = useCurrentFrame();
  const swap = progress(f, 196, 16);
  const hl = (t: string, c: string, g: string) => ({ t, color: c, glow: g });
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 560 }}>
        <Mono p={progress(f, 10, 20)} style={{ color: C.sun }}>Al-Mujādilah 58:1</Mono>
      </div>
      <div style={{ ...center, top: 610, padding: "0 70px" }}>
        <ArabicWords
          start={20}
          stagger={4}
          size={64}
          style={{ lineHeight: 2.05 }}
          tokens={[
            { t: "قَدۡ" },
            hl("سَمِعَ", HEAR, HEAR_GLOW),
            { t: "ٱللَّهُ قَوۡلَ ٱلَّتِي تُجَٰدِلُكَ فِي زَوۡجِهَا وَتَشۡتَكِيٓ إِلَى ٱللَّهِ وَٱللَّهُ" },
            hl("يَسۡمَعُ", HEAR, HEAR_GLOW),
            { t: "تَحَاوُرَكُمَآۚ إِنَّ ٱللَّهَ" },
            hl("سَمِيعُۢ", HEAR, HEAR_GLOW),
            hl("بَصِيرٌ", SEE, C.sunGlow),
          ]}
        />
      </div>
      <div style={{ ...center, top: 1110, opacity: 1 - swap }}>
        <BlurWords start={100} stagger={6} tokens={[{ t: "Heard.", color: HEAR }, { t: "Hears.", color: HEAR }, { t: "All-Hearing.", color: HEAR, glow: HEAR_GLOW }]} style={{ fontSize: 66 }} />
      </div>
      <div style={{ ...center, top: 1110 }}>
        <BlurWords start={210} stagger={5} tokens={[{ t: "Then" }, { t: "All-Seeing.", italic: true, color: SEE, glow: C.sunGlow }]} style={{ fontSize: 66 }} />
      </div>
      <div style={{ ...center, top: 1200 }}>
        <Mono p={progress(f, 232, 20)} style={{ fontSize: 22 }}>The tenth pair</Mono>
      </div>
    </AbsoluteFill>
  );
};

// 6 — Close: back out of the machine; it winds home and resets onto frame 0.
export const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = progress(f, dur - 70, 40);
  return (
    <AbsoluteFill>
      <div style={{ ...focusOut(back), position: "absolute", inset: 0 }}>
        <div style={{ ...center, top: 196 }}>
          <BlurWords start={14} stagger={4} tokens={[{ t: "Whatever you" }, { t: "whisper tonight —", italic: true }]} style={{ fontSize: 66 }} />
        </div>
        <div style={{ ...center, top: 300 }}>
          <div style={{ fontFamily: F.serif, fontSize: 132, ...focusIn(progress(f, 62, 24), 10, 20), color: HEAR, textShadow: `0 0 40px ${HEAR_GLOW}` }}>He hears.</div>
        </div>
      </div>
      <AbsoluteFill style={{ opacity: back }}>
        <Title sub={0} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
