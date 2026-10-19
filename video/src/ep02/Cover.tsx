import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { StarMark } from "../components/Light";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { Chest, River } from "./River";

// EP02 reel cover (1080×1920). Key content inside the central 3:4 window (y≈240–1680).
export const Cover2: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.5} moon={1} rays={0.6} />
    <div style={{ position: "absolute", left: 830, top: 110, width: 130, height: 130, borderRadius: 65, background: `radial-gradient(circle, #F4F6FA 0%, ${C.moon} 45%, transparent 72%)`, boxShadow: `0 0 140px 50px ${C.moonGlow}`, opacity: 0.6 }} />
    <River top={1250} />
    <Chest x={540} y={1330} scale={1.25} glow={1.3} />
    <AbsoluteFill style={{ background: "radial-gradient(640px 640px at 540px 760px, rgba(8,13,24,0.6), transparent 75%)" }} />
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={24} />
      <div style={{ fontFamily: F.mono, fontSize: 28, letterSpacing: "0.42em", color: C.ink }}>AL-QAṢAṢ · 28:7</div>
      <StarMark size={24} />
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: C.ink }}>
      22 <span style={{ fontStyle: "italic", fontSize: 100 }}>words.</span>
    </div>
    <div style={{ position: "absolute", top: 620, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 170, lineHeight: 1, ...shine(C.sun, 0.45, C.sunGlow) }}>
      8 messages.
    </div>
    <div style={{ position: "absolute", top: 850, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 460, height: 2, background: `linear-gradient(90deg, transparent, ${C.sun}, transparent)`, boxShadow: `0 0 12px ${C.sunGlow}` }} />
    </div>
    <div style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 58, lineHeight: 1.25, color: C.ink }}>
      To a mother told to cast
      <br />
      her baby into a river.
    </div>
  </AbsoluteFill>
);
