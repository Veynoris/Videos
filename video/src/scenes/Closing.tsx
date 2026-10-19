import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ArabicWords, BlurWords, Mono } from "../components/Text";
import { Card } from "../components/Card";
import { Orb, Shockwave } from "../components/Orb";
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
      <div style={{ ...center, top: 520 }}>
        <Card p={progress(f, 22, 34)}>
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
          <Mono p={progress(f, 120, 20)} style={{ marginTop: 32, fontSize: 18 }}>
            Tafsīr Ibn Kathīr · on 18:25 · translated
          </Mono>
        </Card>
      </div>
      <div style={{ ...center, top: 1190, padding: "0 120px" }}>
        <div
          style={{
            fontFamily: F.serif,
            fontSize: 31,
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
      <div style={{ ...center, top: 620 }}>
        <ArabicWords start={14} stagger={7} size={124} tokens={[{ t: "قُلِ ٱللَّهُ أَعۡلَمُ بِمَا لَبِثُواْۖ" }]} />
      </div>
      <div style={{ ...center, top: 930 }}>
        <BlurWords
          start={56}
          tokens={[{ t: "“Say: Allah is most knowing" }, { br: true, t: "" }, { t: "of how long they remained.”" }]}
          style={{ fontStyle: "italic", fontSize: 56, opacity: 0.92 }}
        />
      </div>
      <div style={{ ...center, top: 1110 }}>
        <Mono p={progress(f, 84, 20)} style={{ fontSize: 18 }}>
          Sahih International · opening of 18:26
        </Mono>
      </div>
    </AbsoluteFill>
  );
};

// 9 — Outro: sun and moon converge into one light; rays open; sign-off.
export const Outro: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const meet = interpolate(f, [4, 74], [0, 1], { ...CLAMP, easing: easeInOut });
  const sep = 120 * (1 - meet);
  const burst = interpolate(f, [70, 130], [0, 1], { ...CLAMP, easing: easeInOut });
  const rays = interpolate(f, [70, 120], [0, 1], CLAMP);
  const fadeAll = interpolate(f, [total - 26, total], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: fadeAll }}>
      <AbsoluteFill
        style={{
          opacity: rays * 0.5,
          background: `repeating-conic-gradient(from ${f * 0.25}deg at 540px 620px, rgba(233,200,140,0.10) 0deg 3deg, transparent 3deg 14deg)`,
          WebkitMaskImage: "radial-gradient(520px 520px at 540px 620px, black 0%, transparent 100%)",
          maskImage: "radial-gradient(520px 520px at 540px 620px, black 0%, transparent 100%)",
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: progress(f, 0, 24) }}>
        <Shockwave cx={540} cy={620} p={burst} color={C.sun} max={560} />
        <Orb id="endsun" cx={540 - sep} cy={620} r={26} color={C.sun} intensity={1 + rays * 0.6} />
        <g style={{ mixBlendMode: "screen" }}>
          <Orb id="endmoon" cx={540 + sep} cy={620} r={22} color={C.moon} intensity={1 + rays * 0.6} />
        </g>
      </svg>
      <div style={{ ...center, top: 800 }}>
        <BlurWords
          start={60}
          stagger={6}
          dur={24}
          tokens={[{ t: "Three hundred —" }, { br: true, t: "" }, { t: "and nine.", italic: true, color: C.moon, glow: C.moonGlow }]}
          style={{ fontSize: 92 }}
        />
      </div>
      <div style={{ ...center, top: 1090 }}>
        <BlurWords start={100} tokens={[{ t: "Read al-Kahf 18:25–26 slowly." }]} style={{ fontSize: 40, color: C.dim }} />
      </div>
      <div style={{ ...center, top: 1460 }}>
        <Mono p={progress(f, 122, 24)}>Why nine?</Mono>
      </div>
    </AbsoluteFill>
  );
};
