import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Rosette, StarMark } from "../components/Light";
import { CLAMP, easeIn, easeInOut, focusIn, progress } from "../lib/anim";
import { lerpColor } from "../lib/astro";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

const rnd = (i: number, n: number) => {
  const x = Math.sin(i * 73.13 + n * 19.7) * 43758.5453;
  return x - Math.floor(x);
};

// Star field circling the celestial pole: drawn as arcs whose length grows with the time-lapse speed.
export const POLE = { x: 540, y: 520 };
export const TRAILS = Array.from({ length: 150 }, (_, i) => ({
  r: 60 + Math.pow(rnd(i, 1), 0.8) * 1150,
  a: rnd(i, 2) * Math.PI * 2,
  w: 0.8 + rnd(i, 3) * 2,
  o: 0.25 + rnd(i, 4) * 0.6,
  warm: rnd(i, 5) > 0.82,
}));

// Mountain ridge with a cave mouth, seen from outside at night.
export const RIDGE = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 1180 - 50;
    const y = 1560 - Math.sin((i / 40) * Math.PI) * 230 - (rnd(i, 9) - 0.5) * 40 - Math.sin(i * 0.9) * 18;
    pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
  }
  return `M-50,1920 L${pts.join(" L")} L1130,1920 Z`;
})();

export const COUNT_END = 60; // the counter lands on 300
export const NINE_START = 96; // then ticks 301…309, one by one
export const NINE_STEP = 4;

// 1 — Hook: "They fell asleep in a cave…" Stars wheel overhead in time-lapse while a counter races to 300,
// then jolts and ticks on to 309: "…or was it 309?" -> "The Qur'an gives both numbers — in one sentence."
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const c = interpolate(f, [4, COUNT_END], [0, 1], { ...CLAMP, easing: easeInOut });
  const extra = Math.max(0, Math.min(9, Math.floor((f - NINE_START) / NINE_STEP) + 1));
  const years = f < NINE_START ? Math.round(c * 300) : 300 + extra;
  // sky rotation: fast while the years race, then a slow drift
  const rot = c * Math.PI * 1.7 + f * 0.0025;
  const speed = f < COUNT_END ? Math.sin(Math.PI * Math.min(1, Math.max(0, (f - 4) / (COUNT_END - 4)))) : 0;
  const trail = 0.05 + speed * 0.9 + Math.max(0, 1 - Math.abs(f - COUNT_END) / 30) * 0.2;
  const land = progress(f, COUNT_END, 16);
  const nineGlow = f >= NINE_START ? interpolate(f, [NINE_START, NINE_START + 36, NINE_START + 80], [0, 1, 0.6], CLAMP) : 0;
  const tick = f >= NINE_START && f < NINE_START + 9 * NINE_STEP ? 1 - ((f - NINE_START) % NINE_STEP) / NINE_STEP : 0;
  const A = 1 - progress(f, 50, 12);
  const B = progress(f, 62, 14) * (1 - progress(f, 88, 10));
  const dive = interpolate(f, [dur - 24, dur], [1, 1.6], { ...CLAMP, easing: easeIn });
  const sweepFinal = interpolate(f, [150, 200], [0, 1], CLAMP);
  const isMoon = years > 300;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1.04, 1])})` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="horizon" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="rgba(233,185,110,0.22)" />
              <stop offset="100%" stopColor="rgba(233,185,110,0)" />
            </radialGradient>
          </defs>
          {TRAILS.map((s, i) => {
            const a1 = s.a + rot;
            const a0 = a1 - trail * (0.4 + s.r / 2400);
            const x0 = POLE.x + Math.cos(a0) * s.r, y0 = POLE.y + Math.sin(a0) * s.r;
            const x1 = POLE.x + Math.cos(a1) * s.r, y1 = POLE.y + Math.sin(a1) * s.r;
            const col = s.warm ? "#F3D7A2" : "#E8EEF8";
            return (
              <g key={i}>
                <path d={`M${x0.toFixed(1)},${y0.toFixed(1)} A${s.r},${s.r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`} stroke={col} strokeWidth={s.w} strokeLinecap="round" fill="none" opacity={s.o * (0.35 + speed * 0.5)} />
                <circle cx={x1} cy={y1} r={s.w * 0.9} fill={col} opacity={s.o} />
              </g>
            );
          })}
          <rect x={0} y={1100} width={1080} height={820} fill="url(#horizon)" />
          <path d={RIDGE} fill="#03060C" />
          {/* the cave mouth, faintly lit from within */}
          <path d="M462,1524 C466,1488 470,1452 492,1430 C506,1414 524,1404 546,1407 C572,1410 590,1426 600,1448 C612,1474 614,1500 618,1524 Z" fill="#000" stroke="rgba(233,185,110,0.35)" strokeWidth={2} style={{ filter: "drop-shadow(0 0 18px rgba(233,185,110,0.35))" }} />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${dive})`, transformOrigin: "540px 700px" }}>
        <div style={{ ...center, top: 236, alignItems: "center", gap: 22, opacity: progress(f, -16, 30) }}>
          <div style={{ width: 150 * progress(f, -16, 30), height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
          <StarMark size={22} />
          <Mono style={{ color: C.ink, letterSpacing: "0.4em" }}>Al-Kahf · 18:25</Mono>
          <StarMark size={22} />
          <div style={{ width: 150 * progress(f, -16, 30), height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
        </div>
        <div style={{ ...center, top: 520 }}>
          <Mono style={{ fontSize: 24, color: isMoon ? C.moon : C.sun }} p={progress(f, -10, 16)}>
            {isMoon ? "Years asleep · by the moon?" : "Years asleep"}
          </Mono>
        </div>
        <div style={{ ...center, top: 570 }}>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 300,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              transform: `scale(${1 + (1 - land) * 0.04 * (f >= COUNT_END ? 1 : 0) + tick * 0.03})`,
              ...(isMoon ? shine(C.moon, 0.5, C.moonGlow) : shine(C.sun, interpolate(f, [COUNT_END, COUNT_END + 40], [0, 1], CLAMP), C.sunGlow)),
              filter: `drop-shadow(0 0 ${20 + nineGlow * 30}px ${isMoon ? C.moonGlow : C.sunGlow})`,
            }}
          >
            {years}
          </div>
        </div>
        <div style={{ ...center, top: 960, opacity: A, filter: A < 1 ? `blur(${(1 - A) * 12}px)` : undefined }}>
          <BlurWords start={-12} stagger={2} dur={14} tokens={[{ t: "They fell asleep in a cave…" }]} style={{ fontSize: 64 }} />
        </div>
        <div style={{ ...center, top: 960, opacity: B > 0 || f < 88 ? 1 : 0 }}>
          <div style={{ opacity: f < 62 ? 0 : 1 - progress(f, 88, 10), filter: progress(f, 88, 10) > 0 ? `blur(${progress(f, 88, 10) * 12}px)` : undefined }}>
            <BlurWords start={62} stagger={3} tokens={[{ t: "…and woke up" }, { t: "300 years", color: C.sun }, { t: "later." }]} style={{ fontSize: 64 }} />
          </div>
        </div>
        <div style={{ ...center, top: 960 }}>
          <BlurWords start={98} stagger={4} tokens={[{ t: "…or was it" }, { t: "309?", italic: true, color: C.moon, glow: C.moonGlow }]} style={{ fontSize: 72 }} />
        </div>
        <div style={{ ...center, top: 1110 }}>
          <BlurWords
            start={140}
            stagger={4}
            dur={20}
            tokens={[{ t: "The Qur'an gives both numbers" }, { br: true, t: "" }, { t: "— in one sentence.", italic: true, color: C.sun, glow: C.sunGlow, sweep: sweepFinal }]}
            style={{ fontSize: 62, lineHeight: 1.2 }}
          />
        </div>
      </AbsoluteFill>
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
