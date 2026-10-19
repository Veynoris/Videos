import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { C, F } from "../lib/theme";
import { Console, Engine, HEAR, HEAR_GLOW, Readout, T } from "./Machine";

// EP04 reel cover (1080×1920): the engine locked on the tenth pair.
export const Cover4: React.FC = () => {
  const f = T.hits[9] + 20;
  return (
    <AbsoluteFill>
      <Backdrop sun={0.7} moon={0.7} rays={0.7} />
      <Engine f={f} />
      <Readout f={f} opacity={1} />
      <Console f={f} opacity={1} />
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontSize: 118, lineHeight: 1.1, color: C.ink }}>
        Ten times.
        <br />
        <span style={{ fontStyle: "italic", color: HEAR, textShadow: `0 0 30px ${HEAR_GLOW}` }}>Never reversed.</span>
      </div>
    </AbsoluteFill>
  );
};
