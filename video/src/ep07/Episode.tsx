import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { CLAMP } from "../lib/anim";
import { Motes } from "../components/Particles";
import { Desert, END, T } from "./World";
import { Close, Decode, Excuse, Hook, Speech, Valley } from "./scenes";

export const DURATION7 = END;

// Dawn when Sulaymān smiles: the horizon warms and light floods the valley, then night returns for the loop.
const Dawn: React.FC<{ f: number }> = ({ f }) => {
  const c = T.close[0];
  const a = interpolate(f, [c + 10, c + 80, c + 170, END - 6], [0, 1, 1, 0], CLAMP);
  if (a <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(30,40,80,0) 0%, rgba(120,80,110,0.25) 45%, rgba(255,160,90,0.45) 64%, rgba(255,200,120,0.25) 75%, rgba(0,0,0,0) 90%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(900px 420px at 540px 1240px, rgba(255,214,150,0.55), rgba(255,150,90,0.18) 50%, transparent 75%)" }} />
      <AbsoluteFill style={{ opacity: 0.6, background: "repeating-conic-gradient(from 270deg at 540px 1260px, rgba(255,226,170,0.10) 0deg 3deg, transparent 3deg 9deg)", WebkitMaskImage: "linear-gradient(180deg, transparent 10%, black 55%, transparent 70%)", maskImage: "linear-gradient(180deg, transparent 10%, black 55%, transparent 70%)" }} />
    </AbsoluteFill>
  );
};

export const Episode7: React.FC = () => {
  const f = useCurrentFrame();
  const moon = interpolate(f, [0, T.valley[0], T.speech[1], T.decode[0] + 60, T.close[0], END], [0.7, 0.9, 0.9, 0.5, 0.6, 0.7], CLAMP);
  const rays = interpolate(f, [0, T.decode[0], T.decode[0] + 200, T.excuse[1], T.close[0] + 60, END], [0.7, 0.7, 1, 0.9, 1, 0.7], CLAMP);
  const motes = interpolate(f, [0, T.valley[0], T.decode[0], T.decode[0] + 120, T.close[0], T.close[0] + 60, END], [0.85, 0.85, 1, 1.25, 1.1, 1.3, 0.85], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={0.5} moon={moon} rays={rays} />
      <Dawn f={f} />
      <Desert f={f} />
      <Motes f={f} period={845} intensity={motes} count={150} />
      <Scene from={T.hook[0]} to={T.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T.valley[0]} to={T.valley[1]}><Valley /></Scene>
      <Scene from={T.speech[0]} to={T.speech[1]}><Speech /></Scene>
      <Scene from={T.decode[0]} to={T.decode[1]}><Decode /></Scene>
      <Scene from={T.excuse[0]} to={T.excuse[1]}><Excuse /></Scene>
      <Scene from={T.close[0]} to={T.close[1]} exit={0} drift={false}><Close dur={T.close[1] - T.close[0]} /></Scene>
    </AbsoluteFill>
  );
};
