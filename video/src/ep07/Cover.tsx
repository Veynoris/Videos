import React from "react";
import { AbsoluteFill } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Sentence, Title } from "./scenes";
import { Desert } from "./World";

// EP07 reel cover (1080×1920): the hook's reveal — moon over the dunes, the army's lights on the horizon,
// her point of light on the sand, and her sentence lit in the ten prism colours.
export const Cover7: React.FC = () => (
  <AbsoluteFill>
    <Backdrop sun={0.5} moon={0.8} rays={0.8} />
    <Desert f={110} />
    <Title sub={1} />
    <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Sentence size={54} lit={() => 1} />
    </div>
  </AbsoluteFill>
);
