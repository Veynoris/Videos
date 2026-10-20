import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { World } from "./Episode";
import { GOLD, GOLD_GLOW, T } from "./Plant";

// EP06 reel cover (1080×1920): the full plant, every grain lit.
export const Cover6: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.9} moon={0.5} rays={0.9} />
    <World f={T.grains[0] + T.grains[1] + 20} />
    <div style={{ position: "absolute", top: 1400, left: 0, right: 0, textAlign: "center", background: "radial-gradient(60% 70% at 50% 45%, rgba(7,8,12,0.75), transparent 75%)", paddingBottom: 30 }}>
      <div style={{ fontFamily: F.serif, fontSize: 170, lineHeight: 1, ...shine(GOLD, 0.5, GOLD_GLOW) }}>1 → 700</div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 54, color: C.ink, marginTop: 14, textShadow: "0 0 12px #07080C, 0 0 24px #07080C" }}>One verse. Watch it grow.</div>
    </div>
  </AbsoluteFill>
);
