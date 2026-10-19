import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Orb, Shockwave } from "../components/Orb";
import { Bloom, Flare, Rosette, StarMark } from "../components/Light";
import { CLAMP, easeInOut, focusIn, progress } from "../lib/anim";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

const REWIND_END = 100; // a slower, readable rewind

// 7 — Back to Damascus, 1373: a year counter rewinds from today; then Ibn Kathir's words open
// on a manuscript card (commentary Arabic in Amiri, distinct from the Qur'anic text face).
export const Scholar: React.FC = () => {
  const f = useCurrentFrame();
  const year = Math.round(interpolate(f, [8, REWIND_END], [2026, 1373], { ...CLAMP, easing: easeInOut }));
  const rewindOut = progress(f, 170, 18); // hold "653 years ago. Damascus." for ~2 s
  const speed = Math.sin(Math.PI * Math.min(1, Math.max(0, (f - 8) / (REWIND_END - 8))));
  return (
    <AbsoluteFill>
      {/* time rewind */}
      <AbsoluteFill style={{ opacity: 1 - rewindOut, filter: rewindOut > 0 ? `blur(${rewindOut * 16}px)` : undefined }}>
        <div style={{ ...center, top: 560 }}>
          <Mono p={progress(f, 0, 14)} style={{ fontSize: 24 }}>Travelling back</Mono>
        </div>
        <div style={{ ...center, top: 620 }}>
          <div style={{ fontFamily: F.serif, fontSize: 220, lineHeight: 1, fontVariantNumeric: "tabular-nums", ...shine(C.sun, interpolate(f, [REWIND_END, REWIND_END + 30], [0, 1], CLAMP), C.sunGlow), ...focusIn(progress(f, 0, 16), 0, 14) }}>
            {year}
          </div>
        </div>
        <svg width={1080} height={120} style={{ position: "absolute", top: 880, left: 0, opacity: progress(f, 4, 16) }}>
          {Array.from({ length: 81 }, (_, i) => {
            const y0 = Math.floor(year / 10) * 10 - 400 + i * 10;
            const x = 540 + (y0 - year) * 2.6;
            if (x < -20 || x > 1100) return null;
            const major = y0 % 100 === 0;
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={major ? 20 : 34} y2={56} stroke={major ? C.sun : C.faint} strokeWidth={major ? 2 : 1.2} />
                {major && (
                  <text x={x} y={92} textAnchor="middle" fill={C.dim} style={{ fontFamily: F.mono, fontSize: 20 }}>
                    {y0}
                  </text>
                )}
              </g>
            );
          })}
          <line x1={540} x2={540} y1={6} y2={64} stroke="#FFF6E6" strokeWidth={3} style={{ filter: "drop-shadow(0 0 8px rgba(255,240,210,0.9))" }} />
          <rect x={0} y={0} width={1080} height={120} fill={`rgba(10,18,32,${0.15 * speed})`} />
        </svg>
        <div style={{ ...center, top: 1030 }}>
          <BlurWords start={REWIND_END + 2} tokens={[{ t: "653 years ago." }, { t: "Damascus.", italic: true, color: C.sun }]} style={{ fontSize: 56 }} />
        </div>
      </AbsoluteFill>

      {/* the manuscript */}
      <div style={{ ...center, top: 250 }}>
        <BlurWords start={170} tokens={[{ t: "Ibn Kathīr" }, { t: "wrote:", italic: true, color: C.sun }]} style={{ fontSize: 66 }} />
      </div>
      <Rosette cx={540} cy={830} r={520} opacity={progress(f, 172, 60) * 0.06} speed={-0.05} />
      <div style={{ ...center, top: 400 }}>
        <Card p={progress(f, 174, 36)} width={960} style={{ background: "linear-gradient(170deg, rgba(38,32,24,0.78), rgba(18,24,38,0.78))", border: "1px solid rgba(233,185,110,0.28)", padding: "46px 52px 44px" }}>
          <div style={{ position: "absolute", inset: 12, borderRadius: 26, border: "1px solid rgba(233,185,110,0.14)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <StarMark size={28} p={progress(f, 182, 20)} />
          </div>
          <Mono p={progress(f, 186, 20)} style={{ color: C.sun, fontSize: 22 }}>
            Tafsīr Ibn Kathīr · on al-Kahf 18:25
          </Mono>
          <ArabicWords
            start={196}
            stagger={5}
            size={56}
            font={F.naskh}
            style={{ marginTop: 22, lineHeight: 1.85 }}
            tokens={[
              { t: "فإن تفاوت ما بين كل مائة سنة بالقمرية إلى الشمسية" },
              { t: "ثلاث سنين،", color: C.sun, glow: C.sunGlow },
              { t: "فلهذا قال بعد الثلاثمائة:" },
              { t: "وازدادوا تسعا", color: C.moon, glow: C.moonGlow },
            ]}
          />
          <div style={{ height: 1, margin: "22px auto 22px", width: 420 * progress(f, 272, 24), background: `linear-gradient(90deg, transparent, ${C.sun}, transparent)` }} />
          <BlurWords
            start={282}
            stagger={2}
            dur={16}
            style={{ fontSize: 40, lineHeight: 1.38, fontStyle: "italic" }}
            tokens={[
              { t: "“Between every hundred years by the moon and by the sun lies a difference of" },
              { t: "three years", color: C.sun },
              { t: "— so after the three hundred, He said:" },
              { t: "‘and added nine.’”", color: C.moon },
            ]}
          />
          <Mono p={progress(f, 336, 20)} style={{ marginTop: 28, fontSize: 21 }}>
            Ibn Kathīr · d. 774 AH / 1373 CE · translated
          </Mono>
        </Card>
      </div>
      <div style={{ ...center, top: 1330, padding: "0 120px" }}>
        <div style={{ fontFamily: F.serif, fontSize: 34, lineHeight: 1.4, color: C.dim, textAlign: "center", maxWidth: 840, ...focusIn(progress(f, 348, 24), 8, 8) }}>
          Another early view, from Qatāda, held that these words report what people claimed. Scholars differ.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8 — The very next verse, 18:26 (opening clause).
export const NextVerse: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 520 }}>
        <Mono p={progress(f, 4, 20)}>The very next verse · 18:26</Mono>
      </div>
      <Rosette cx={540} cy={760} r={470} opacity={progress(f, 0, 50) * 0.08} speed={0.07} />
      <div style={{ ...center, top: 620 }}>
        <ArabicWords
          start={14}
          stagger={7}
          size={124}
          tokens={[{ t: "قُلِ ٱللَّهُ أَعۡلَمُ بِمَا لَبِثُواْۖ", color: "#ECE6DA", sweep: interpolate(f, [60, 130], [0, 1], CLAMP), glow: "rgba(236,214,170,0.35)" }]}
        />
      </div>
      <div style={{ ...center, top: 930 }}>
        <BlurWords
          start={56}
          tokens={[{ t: "“Say: Allah is most knowing" }, { br: true, t: "" }, { t: "of how long they remained.”" }]}
          style={{ fontStyle: "italic", fontSize: 56, opacity: 0.92 }}
        />
      </div>
      <div style={{ ...center, top: 1110 }}>
        <Mono p={progress(f, 84, 20)} style={{ fontSize: 21 }}>
          Sahih International · opening of 18:26
        </Mono>
      </div>
    </AbsoluteFill>
  );
};

// 9 — Outro: the moon glides across the sun into a total eclipse; the corona blazes,
// a diamond-ring flash fires at the rim, then the closing lines.
export const Outro: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const SX = 540, SY = 600, R = 64;
  const glide = interpolate(f, [0, 74], [0, 1], { ...CLAMP, easing: easeInOut });
  const mx = SX + 260 * (1 - glide);
  const my = SY - 70 * (1 - glide);
  const totality = progress(f, 66, 20);
  const corona = interpolate(f, [70, 110], [0, 1], { ...CLAMP, easing: easeInOut });
  const diamond = interpolate(f, [72, 78, 120], [0, 1, 0], CLAMP);
  const burst = interpolate(f, [74, 134], [0, 1], { ...CLAMP, easing: easeInOut });
  const fadeAll = interpolate(f, [total - 26, total], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: fadeAll }}>
      <AbsoluteFill
        style={{
          opacity: corona * 0.55,
          background: `repeating-conic-gradient(from ${f * 0.2}deg at ${SX}px ${SY}px, rgba(233,200,140,0.12) 0deg 2.5deg, transparent 2.5deg 11deg)`,
          WebkitMaskImage: `radial-gradient(560px 560px at ${SX}px ${SY}px, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(560px 560px at ${SX}px ${SY}px, black 0%, transparent 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: progress(f, 0, 20) }}>
        <defs>
          <radialGradient id="corona">
            <stop offset="45%" stopColor="#FFF4DC" stopOpacity={0} />
            <stop offset="52%" stopColor="#FFF4DC" stopOpacity={0.95} />
            <stop offset="62%" stopColor={C.sun} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.sun} stopOpacity={0} />
          </radialGradient>
        </defs>
        <Shockwave cx={SX} cy={SY} p={burst} color={C.sun} max={560} />
        <circle cx={SX} cy={SY} r={R * 2.6} fill="url(#corona)" opacity={corona} />
        <Orb id="eclsun" cx={SX} cy={SY} r={R} color={C.sun} intensity={1 - totality * 0.5} />
        <circle cx={mx} cy={my} r={R * 1.02} fill="#070C18" stroke={C.moon} strokeWidth={1.5} strokeOpacity={0.5 + totality * 0.3} />
      </svg>
      <Flare cx={SX + R * 0.72} cy={SY - R * 0.7} p={diamond} color="#FFF4DC" />
      <Bloom p={diamond * 0.35} cx={SX} cy={SY} />
      <div style={{ ...center, top: 820 }}>
        <BlurWords
          start={84}
          stagger={6}
          dur={24}
          tokens={[{ t: "Three hundred —" }, { br: true, t: "" }, { t: "and nine.", italic: true, color: C.moon, glow: C.moonGlow, sweep: interpolate(f, [120, 170], [0, 1], CLAMP) }]}
          style={{ fontSize: 96 }}
        />
      </div>
      <div style={{ ...center, top: 1110 }}>
        <BlurWords start={116} tokens={[{ t: "Read al-Kahf 18:25–26 slowly." }]} style={{ fontSize: 42, color: C.dim }} />
      </div>
      <div style={{ ...center, top: 1440, alignItems: "center", gap: 18 }}>
        <StarMark size={20} p={progress(f, 132, 24)} />
        <Mono p={progress(f, 132, 24)} style={{ color: C.ink }}>Quran Decoding</Mono>
        <StarMark size={20} p={progress(f, 132, 24)} />
      </div>
    </AbsoluteFill>
  );
};
