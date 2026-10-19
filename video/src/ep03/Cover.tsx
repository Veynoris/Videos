import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { StarMark } from "../components/Light";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { CaveMap } from "./CaveMap";

// EP03 reel cover (1080×1920). Key content inside the central 3:4 window (y≈240–1680).
export const Cover3: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.9} moon={0.6} rays={0.7} />
    <AbsoluteFill style={{ transform: "translateY(330px) scale(0.78)", transformOrigin: "540px 900px" }}>
      <CaveMap opening={360} sunAz={128} sunOn={1} appear={1} />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={24} />
      <div style={{ fontFamily: F.mono, fontSize: 28, letterSpacing: "0.42em", color: C.ink }}>AL-KAHF · 18:17</div>
      <StarMark size={24} />
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 104, lineHeight: 1.08, color: C.ink }}>
      Nobody knows
      <br />
      where this cave is.
    </div>
    <div style={{ position: "absolute", top: 650, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 66, lineHeight: 1.2, ...shine(C.sun, 0.5, C.sunGlow) }}>
      One verse tells you
      <br />
      which way it faces.
    </div>
  </AbsoluteFill>
);
