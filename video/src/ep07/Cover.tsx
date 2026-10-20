import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { shine } from "../lib/shine";
import { C, F } from "../lib/theme";
import { hue, hueGlow, Prism, ROW_STEP, ROW_Y0, TEN } from "./World";

// EP07 reel cover (1080×1920): the prism splitting one sentence into ten coloured beams.
export const Cover7: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.5} moon={0.8} rays={0.8} />
    <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, lineHeight: 1.05 }}>
      <div style={{ fontSize: 140, ...shine(C.ink, 0.5) }}>One ant.</div>
      <div style={{ fontSize: 96, fontStyle: "italic", color: "#F3D38A", textShadow: "0 0 30px rgba(243,211,138,0.6)" }}>Ten things.</div>
    </div>
    <Prism f={0} appear={1} lit={() => 1} out={0} />
    {TEN.map((t, i) => (
      <div key={i} style={{ position: "absolute", left: 80, right: 80, top: ROW_Y0 + i * ROW_STEP, height: ROW_STEP - 12, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", borderRadius: 16, background: "rgba(12,19,34,0.82)", border: `1.5px solid ${hue(i)}`, boxShadow: `0 0 18px ${hueGlow(i)}` }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: hue(i) }}>{String(i + 1).padStart(2, "0")}</div>
        <div dir="rtl" lang="ar" style={{ fontFamily: F.quran, fontSize: 46, color: hue(i), textShadow: `0 0 16px ${hueGlow(i)}` }}>{t.ar}</div>
      </div>
    ))}
  </AbsoluteFill>
);
