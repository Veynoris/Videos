import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Shockwave } from "../components/Orb";
import { Crescent, SunDisc } from "../components/Celestial";
import { CLAMP, easeInOut, easeOut, focusIn, progress } from "../lib/anim";
import { lerpColor } from "../lib/astro";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

// 1 — Hook: a blazing sun behind "300" (on screen from frame 0), a crescent behind "+9",
// then: "The Qur'an didn't say 309." -> "It said 300… and 9." -> "One number. Two calendars."
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const three = progress(f, -26, 32);
  const sunUp = interpolate(f, [-20, 90], [70, 0], { ...CLAMP, easing: easeOut });
  const plus = progress(f, 20, 26);
  const wave = interpolate(f, [24, 72], [0, 1], { ...CLAMP, easing: easeInOut });
  const sweep300 = interpolate(f, [4, 46], [0, 1], CLAMP);
  const sweep9 = interpolate(f, [34, 76], [0, 1], CLAMP);
  const sweepCal = interpolate(f, [140, 190], [0, 1], CLAMP);
  const shiftL = interpolate(plus, [0, 1], [0, -95]);
  const l1out = progress(f, 70, 14);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 250 }}>
        <Mono p={progress(f, -14, 16)}>Al-Kahf · 18:25</Mono>
      </div>
      <SunDisc cx={445} cy={790 + sunUp} r={190} p={progress(f, -30, 40)} />
      <Crescent cx={930} cy={690} r={104} p={progress(f, 16, 30) * 0.75} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Shockwave cx={845} cy={790} p={wave} color={C.moon} max={480} />
      </svg>
      <div style={{ ...center, top: 630, alignItems: "baseline" }}>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 330,
            lineHeight: 1,
            transform: `translateX(${shiftL}px) scale(${interpolate(three, [0, 1], [1.08, 1])})`,
            opacity: three,
            ...shine(C.sun, sweep300, C.sunGlow),
          }}
        >
          300
        </div>
        <div
          style={{
            position: "absolute",
            left: 735,
            top: 60,
            fontFamily: F.serif,
            fontStyle: "italic",
            fontSize: 220,
            lineHeight: 1,
            ...focusIn(plus, 0, 30),
            transform: `translateX(${(1 - plus) * 90}px) scale(${interpolate(plus, [0, 1], [1.4, 1])})`,
            ...shine(C.moon, sweep9, C.moonGlow),
          }}
        >
          +9
        </div>
      </div>
      <div style={{ ...center, top: 1070, opacity: 1 - l1out, filter: l1out > 0 ? `blur(${l1out * 14}px)` : undefined }}>
        <BlurWords start={34} stagger={3} tokens={[{ t: "The Qur'an didn't say" }, { t: "309.", italic: true, color: C.moon }]} style={{ fontSize: 64 }} />
      </div>
      <div style={{ ...center, top: 1070 }}>
        <BlurWords
          start={82}
          stagger={4}
          tokens={[{ t: "It said" }, { t: "300…", color: C.sun }, { t: "and 9.", italic: true, color: C.moon }]}
          style={{ fontSize: 64 }}
        />
      </div>
      <div style={{ ...center, top: 1190 }}>
        <BlurWords
          start={120}
          stagger={5}
          dur={22}
          tokens={[{ t: "One number." }, { br: true, t: "" }, { t: "Two calendars.", italic: true, color: C.sun, glow: C.sunGlow, sweep: sweepCal }]}
          style={{ fontSize: 96, lineHeight: 1.12 }}
        />
      </div>
    </AbsoluteFill>
  );
};

// 2 — The verse, 18:25, with the two numbers isolated by colour and swept with light.
export const Verse: React.FC = () => {
  const f = useCurrentFrame();
  const hl = progress(f, 104, 30);
  const sweep = interpolate(f, [110, 170], [0, 1], CLAMP);
  const sun = lerpColor(C.ink, C.sun, hl);
  const moon = lerpColor(C.ink, C.moon, hl);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 260 }}>
        <BlurWords
          start={6}
          tokens={[{ t: "Look closely." , italic: true }]}
          stagger={4}
          style={{ fontSize: 72 }}
        />
      </div>
      <div style={{ ...center, top: 520 }}>
        <Card p={progress(f, 20, 40)}>
          <Mono p={progress(f, 34, 20)} style={{ color: C.sun }}>
            Surah al-Kahf · 18:25
          </Mono>
          <ArabicWords
            start={40}
            stagger={6}
            size={88}
            style={{ marginTop: 26 }}
            tokens={[
              { t: "وَلَبِثُواْ فِي كَهۡفِهِمۡ" },
              { t: "", br: true },
              { t: "ثَلَٰثَ مِاْئَةٖ سِنِينَ", color: sun, glow: C.sunGlow, sweep: hl > 0 ? sweep : undefined },
              { t: "", br: true },
              { t: "وَٱزۡدَادُواْ تِسۡعٗا", color: moon, glow: C.moonGlow, sweep: hl > 0 ? sweep : undefined },
            ]}
          />
          <div
            style={{
              fontFamily: F.serif,
              fontStyle: "italic",
              fontSize: 40,
              lineHeight: 1.35,
              color: C.ink,
              textAlign: "center",
              marginTop: 22,
              ...focusIn(progress(f, 84, 26), 8, 10),
            }}
          >
            &ldquo;And they remained in their cave for <span style={{ color: sun }}>three hundred years</span> and{" "}
            <span style={{ color: moon }}>exceeded by nine</span>.&rdquo;
          </div>
          <Mono p={progress(f, 96, 20)} style={{ marginTop: 26, fontSize: 18 }}>
            Sahih International
          </Mono>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
