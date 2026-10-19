import React from "react";
import { AbsoluteFill } from "remotion";
import "./lib/fonts";
import { Backdrop } from "./components/Backdrop";
import { Crescent, SunDisc } from "./components/Celestial";
import { StarMark } from "./components/Light";
import { shine } from "./lib/shine";
import { C, F } from "./lib/theme";

// Reel cover (1080×1920). Key content sits inside the central 3:4 window (y≈240–1680)
// so it survives the profile-grid crop.
export const Cover: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.9} moon={0.7} rays={0.9} />
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={24} />
      <div style={{ fontFamily: F.mono, fontSize: 28, letterSpacing: "0.42em", color: C.ink }}>AL-KAHF · 18:25</div>
      <StarMark size={24} />
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <SunDisc cx={430} cy={720} r={205} p={1} />
    <Crescent cx={930} cy={600} r={108} p={0.8} />
    <div style={{ position: "absolute", top: 560, left: 430 - 270, width: 540, textAlign: "center", fontFamily: F.serif, fontSize: 330, lineHeight: 1, ...shine(C.sun, 0.42, C.sunGlow) }}>
      300
    </div>
    <div style={{ position: "absolute", top: 620, left: 734, fontFamily: F.serif, fontStyle: "italic", fontSize: 220, lineHeight: 1, ...shine(C.moon, 0.45, C.moonGlow) }}>
      +9
    </div>
    <div style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 118, lineHeight: 1.06, color: C.ink, letterSpacing: "-0.01em" }}>
      One number.
      <br />
      <span style={{ fontStyle: "italic", ...shine(C.sun, 0.5, C.sunGlow) }}>Two calendars.</span>
    </div>
    <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 460, height: 2, background: `linear-gradient(90deg, transparent, ${C.sun}, transparent)`, boxShadow: `0 0 12px ${C.sunGlow}` }} />
    </div>
    <div style={{ position: "absolute", top: 1340, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 50, color: C.dim }}>
      Why didn&rsquo;t the Qur&rsquo;an say 309?
    </div>
    <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      <StarMark size={20} />
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: "0.4em", color: C.ink }}>QURAN DECODING</div>
      <StarMark size={20} />
    </div>
  </AbsoluteFill>
);
