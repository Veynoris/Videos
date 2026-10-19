import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Orb, Shockwave } from "../components/Orb";
import { Bloom, Flare, Rosette, StarMark } from "../components/Light";
import { CLAMP, easeInOut, focusIn, progress } from "../lib/anim";
import { C, F } from "../lib/theme";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

// 7 — Ibn Kathir's explanation, attributed and marked as a translation.
export const Scholar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 285 }}>
        <BlurWords start={6} tokens={[{ t: "Explained" }, { t: "over 650 years ago.", italic: true, color: C.sun }]} />
      </div>
      <Rosette cx={540} cy={820} r={500} opacity={progress(f, 10, 60) * 0.06} speed={-0.05} />
      <div style={{ ...center, top: 520 }}>
        <Card p={progress(f, 22, 34)}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <StarMark size={28} p={progress(f, 30, 20)} />
          </div>
          <Mono p={progress(f, 34, 20)} style={{ color: C.sun }}>
            Ibn Kathīr · d. 774 AH / 1373 CE
          </Mono>
          <div
            style={{
              fontFamily: F.serif,
              fontStyle: "italic",
              fontSize: 47,
              lineHeight: 1.36,
              color: C.ink,
              textAlign: "center",
              marginTop: 30,
            }}
          >
            <BlurWords
              start={44}
              stagger={2}
              dur={16}
              style={{ fontSize: 47, lineHeight: 1.36, fontStyle: "italic" }}
              tokens={[
                { t: "“Between every hundred years by the" },
                { t: "moon", color: C.moon },
                { t: "and by the" },
                { t: "sun", color: C.sun },
                { t: "lies a difference of three years — so after the three hundred, He said:" },
                { t: "‘and added nine.’”", color: C.moon },
              ]}
            />
          </div>
          <Mono p={progress(f, 120, 20)} style={{ marginTop: 32, fontSize: 21 }}>
            Tafsīr Ibn Kathīr · on 18:25 · translated
          </Mono>
        </Card>
      </div>
      <div style={{ ...center, top: 1190, padding: "0 120px" }}>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 34,
            lineHeight: 1.4,
            color: C.dim,
            textAlign: "center",
            maxWidth: 820,
            ...focusIn(progress(f, 150, 24), 8, 8),
          }}
        >
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
