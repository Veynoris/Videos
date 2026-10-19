import React from "react";
import { AbsoluteFill } from "remotion";
import "./lib/fonts";
import { Backdrop } from "./components/Backdrop";
import { StarMark } from "./components/Light";
import { POLE, RIDGE, TRAILS } from "./scenes/Opening";
import { shine } from "./lib/shine";
import { C, F } from "./lib/theme";

// Reel cover v2 (1080×1920): star trails over the cave — "300 or 309?".
// Key content sits inside the central 3:4 window (y≈240–1680) for the profile-grid crop.
export const Cover: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.6} moon={0.9} rays={0.5} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="cov-horizon" cx="50%" cy="85%" r="60%">
          <stop offset="0%" stopColor="rgba(233,185,110,0.28)" />
          <stop offset="100%" stopColor="rgba(233,185,110,0)" />
        </radialGradient>
      </defs>
      {TRAILS.map((s, i) => {
        const a1 = s.a + 1.1;
        const a0 = a1 - 0.85 * (0.4 + s.r / 2400);
        const x0 = POLE.x + Math.cos(a0) * s.r, y0 = POLE.y + Math.sin(a0) * s.r;
        const x1 = POLE.x + Math.cos(a1) * s.r, y1 = POLE.y + Math.sin(a1) * s.r;
        const col = s.warm ? "#F3D7A2" : "#E8EEF8";
        return <path key={i} d={`M${x0.toFixed(1)},${y0.toFixed(1)} A${s.r},${s.r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`} stroke={col} strokeWidth={s.w} strokeLinecap="round" fill="none" opacity={s.o * 0.55} />;
      })}
      <rect x={0} y={1150} width={1080} height={770} fill="url(#cov-horizon)" />
      <g transform="translate(0,120)">
        <path d={RIDGE} fill="#03060C" />
        <path d="M462,1524 C466,1488 470,1452 492,1430 C506,1414 524,1404 546,1407 C572,1410 590,1426 600,1448 C612,1474 614,1500 618,1524 Z" fill="#000" stroke="rgba(233,185,110,0.45)" strokeWidth={2} style={{ filter: "drop-shadow(0 0 22px rgba(233,185,110,0.45))" }} />
      </g>
    </svg>
    {/* dark pool behind the type for legibility over the trails */}
    <AbsoluteFill style={{ background: "radial-gradient(620px 760px at 540px 760px, rgba(8,13,24,0.72), transparent 75%)" }} />
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, transparent, ${C.sun})` }} />
      <StarMark size={24} />
      <div style={{ fontFamily: F.mono, fontSize: 28, letterSpacing: "0.42em", color: C.ink }}>AL-KAHF · 18:25</div>
      <StarMark size={24} />
      <div style={{ width: 140, height: 1, background: `linear-gradient(90deg, ${C.sun}, transparent)` }} />
    </div>
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: F.mono, fontSize: 26, letterSpacing: "0.4em", color: C.dim }}>
      HOW LONG DID THEY SLEEP?
    </div>
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 290, lineHeight: 1, ...shine(C.sun, 0.45, C.sunGlow) }}>
      300
    </div>
    <div style={{ position: "absolute", top: 770, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C.dim})` }} />
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 64, color: C.ink }}>or</div>
      <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, ${C.dim}, transparent)` }} />
    </div>
    <div style={{ position: "absolute", top: 860, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 290, lineHeight: 1, ...shine(C.moon, 0.5, C.moonGlow) }}>
      309?
    </div>
    <div style={{ position: "absolute", top: 1200, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 60, lineHeight: 1.2, color: C.ink }}>
      The Qur&rsquo;an gives both numbers
      <br />
      <span style={{ fontStyle: "italic", ...shine(C.sun, 0.5, C.sunGlow) }}>— in one sentence.</span>
    </div>
  </AbsoluteFill>
);
