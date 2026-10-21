import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { F } from "../lib/theme";
import { Title } from "./scenes";
import { GOLD, GOLD_GLOW, World } from "./World";

// EP08 reel cover (1080×1920): the enclosed dark, his single light, the claim and the call.
export const Cover8: React.FC = () => (
  <AbsoluteFill style={{ background: "#02040A" }}>
    <World f={0} />
    <Title sub={1} />
    <div style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
      <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 60, lineHeight: 1.9, color: GOLD, textShadow: `0 0 26px ${GOLD_GLOW}` }}>
        لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبۡحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّـٰلِمِينَ
      </div>
    </div>
  </AbsoluteFill>
);
