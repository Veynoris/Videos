import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { FabricDefs, Tunic } from "./Props";

// EP05 reel cover (1080×1920): three shirts, three verdicts.
export const Cover5: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.8} moon={0.6} rays={0.8} />
    <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center" }}>
      <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 220, lineHeight: 1.5, ...shine(C.sun, 0.5, C.sunGlow) }}>قَمِيص</div>
    </div>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <FabricDefs />
      <Tunic id="v1" f={0} x={95} y={700} w={240} stain={1} />
      <Tunic id="v2" f={30} x={420} y={700} w={240} tear={1} />
      <Tunic id="v3" f={60} x={745} y={700} w={240} glow={0.7} />
    </svg>
    <div style={{ position: "absolute", top: 1110, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 104, lineHeight: 1.12, color: C.ink }}>
      Three shirts.
      <br />
      <span style={{ fontStyle: "italic", color: C.sun, textShadow: `0 0 30px ${C.sunGlow}` }}>Three verdicts.</span>
    </div>
  </AbsoluteFill>
);
