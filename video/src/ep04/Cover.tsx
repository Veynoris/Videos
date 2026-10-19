import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { C, F } from "../lib/theme";
import { EXCEPTION, Tile, Wall } from "./scenes";

// EP04 reel cover (1080×1920): the wall of «سميع بصير» tiles, one exception lit, "…except once."
export const Cover4: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.6} moon={0.8} rays={0.6} />
    <Wall f={0} dimAll={0.35} />
    <Tile i={EXCEPTION} p={1} hl={1} />
    <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 120, color: C.ink }}>
      …except <span style={{ color: "#F08A5D", textShadow: "0 0 30px rgba(240,138,93,0.5)" }}>once.</span>
    </div>
  </AbsoluteFill>
);
