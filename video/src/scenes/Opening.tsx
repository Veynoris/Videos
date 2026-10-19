import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Shockwave } from "../components/Orb";
import { Crescent, SunDisc } from "../components/Celestial";
import { Flare, Rosette, StarMark } from "../components/Light";
import { CLAMP, easeIn, easeInOut, easeOut, focusIn, progress } from "../lib/anim";
import { lerpColor } from "../lib/astro";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

const rnd = (i: number, n: number) => {
  const x = Math.sin(i * 73.13 + n * 19.7) * 43758.5453;
  return x - Math.floor(x);
};
const DUST = Array.from({ length: 40 }, (_, i) => ({
  a: rnd(i, 1) * Math.PI * 2,
  d: 420 + rnd(i, 2) * 620,
  s: 1.5 + rnd(i, 3) * 3,
  delay: rnd(i, 4) * 30,
}));

const SUN = { x: 430, y: 800 };
const NINE = { x: 815, y: 792 };

// 1 — Hook, staged as a celestial event.
// Frame 0: a blazing sun holds "300" (thumbnail-safe). A crescent sweeps in on an arc and "+9" bursts
// out of its light with an anamorphic flare. Then: "The Qur'an didn't say 309" (struck through with light)
// -> "It said 300… and 9." -> "One number. Two calendars." The camera finally pushes into the sun.
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const three = progress(f, -26, 32);
  const sunUp = interpolate(f, [-20, 90], [70, 0], { ...CLAMP, easing: easeOut });
  const plus = progress(f, 22, 24);
  const wave = interpolate(f, [24, 72], [0, 1], { ...CLAMP, easing: easeInOut });
  const flare = interpolate(f, [20, 27, 40, 76], [0, 1, 0.55, 0], CLAMP);
  const sweep300 = interpolate(f, [4, 46], [0, 1], CLAMP);
  const sweep9 = interpolate(f, [30, 72], [0, 1], CLAMP);
  const sweepCal = interpolate(f, [140, 190], [0, 1], CLAMP);
  const shiftL = interpolate(plus, [0, 1], [0, -110]);
  const strike = progress(f, 56, 14);
  const l1out = progress(f, 76, 14);
  const rule = progress(f, 142, 30);
  const title = progress(f, -16, 30);
  // camera: slow dolly-in, then a push into the sun that hands over to the verse
  const dolly = interpolate(f, [0, dur - 26], [1, 1.05], CLAMP);
  const dive = interpolate(f, [dur - 26, dur], [1, 1.9], { ...CLAMP, easing: easeIn });
  const roll = interpolate(f, [0, dur], [-0.6, 0], CLAMP);
  // crescent travels in on an arc
  const m = interpolate(f, [2, 30], [0, 1], { ...CLAMP, easing: easeOut });
  const arc = (k: number) => ({
    x: (1 - k) ** 2 * 1240 + 2 * (1 - k) * k * 1150 + k * k * 900,
    y: (1 - k) ** 2 * 120 + 2 * (1 - k) * k * 420 + k * k * 690,
  });
  const moon = arc(m);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `rotate(${roll}deg) scale(${dolly * dive})`, transformOrigin: `${SUN.x}px ${SUN.y}px` }}>
        {/* gold dust drawn into the sun */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {DUST.map((d, i) => {
            const k = interpolate(f, [-40 + d.delay, 60 + d.delay], [0, 1], { ...CLAMP, easing: easeInOut });
            const r = d.d * (1 - k) + 40;
            return <circle key={i} cx={SUN.x + Math.cos(d.a) * r} cy={SUN.y + Math.sin(d.a) * r * 0.9} r={d.s} fill="#F6D9A0" opacity={(1 - k) * 0.85 * Math.min(1, k * 6 + 0.2)} />;
          })}
          {/* crescent trail */}
          {Array.from({ length: 12 }, (_, i) => {
            const k = Math.max(0, m - (i + 1) * 0.035);
            if (m >= 1 || k <= 0) return null;
            const q = arc(k);
            return <circle key={i} cx={q.x} cy={q.y} r={10 - i * 0.6} fill={C.moon} opacity={(1 - i / 12) * 0.35} />;
          })}
          <Shockwave cx={NINE.x} cy={NINE.y} p={wave} color={C.moon} max={460} />
        </svg>
        <SunDisc cx={SUN.x} cy={SUN.y + sunUp} r={200} p={progress(f, -30, 40)} />
        <Crescent cx={moon.x} cy={moon.y} r={104} p={interpolate(f, [2, 14], [0, 0.78], CLAMP)} />
        <div style={{ ...center, top: 640, alignItems: "baseline" }}>
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
              left: 700,
              top: 60,
              fontFamily: F.serif,
              fontStyle: "italic",
              fontSize: 220,
              lineHeight: 1,
              ...focusIn(plus, 0, 34),
              transform: `scale(${interpolate(plus, [0, 1], [1.6, 1])})`,
              ...shine(C.moon, sweep9, C.moonGlow),
            }}
          >
            +9
          </div>
        </div>
        <Flare cx={NINE.x} cy={NINE.y} p={flare} color={C.moon} />
      </AbsoluteFill>

      {/* title card: ornament, rules drawn outward from the centre */}
      <div style={{ ...center, top: 236, alignItems: "center", gap: 22, opacity: title }}>
        <div style={{ width: 150 * title, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
        <StarMark size={22} p={title} />
        <Mono p={title} style={{ color: C.ink, letterSpacing: "0.4em" }}>Al-Kahf · 18:25</Mono>
        <StarMark size={22} p={title} />
        <div style={{ width: 150 * title, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
      </div>

      <div style={{ ...center, top: 1076, opacity: 1 - l1out, filter: l1out > 0 ? `blur(${l1out * 14}px)` : undefined }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <BlurWords start={34} stagger={3} tokens={[{ t: "The Qur'an didn't say" }]} style={{ fontSize: 66 }} />
          <div style={{ position: "relative", ...focusIn(progress(f, 46, 18), 10, 12) }}>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 66, color: C.moon }}>309</span>
            <div
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                top: "54%",
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, #FFFFFF, ${C.sun})`,
                boxShadow: `0 0 14px ${C.sunGlow}`,
                transform: `scaleX(${strike})`,
                transformOrigin: "0 50%",
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ ...center, top: 1076 }}>
        <BlurWords
          start={86}
          stagger={4}
          tokens={[{ t: "It said" }, { t: "300…", color: C.sun }, { t: "and 9.", italic: true, color: C.moon }]}
          style={{ fontSize: 66 }}
        />
      </div>
      <div style={{ ...center, top: 1196 }}>
        <BlurWords
          start={118}
          stagger={5}
          dur={22}
          tokens={[{ t: "One number." }, { br: true, t: "" }, { t: "Two calendars.", italic: true, color: C.sun, glow: C.sunGlow, sweep: sweepCal }]}
          style={{ fontSize: 100, lineHeight: 1.1 }}
        />
      </div>
      <div style={{ ...center, top: 1438 }}>
        <div style={{ width: 420 * rule, height: 2, background: `linear-gradient(90deg, transparent, ${C.sun}, transparent)`, boxShadow: `0 0 12px ${C.sunGlow}` }} />
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
      <Rosette cx={540} cy={900} r={520} opacity={progress(f, 10, 60) * 0.07} />
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
          <Mono p={progress(f, 96, 20)} style={{ marginTop: 26, fontSize: 22 }}>
            Sahih International
          </Mono>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
