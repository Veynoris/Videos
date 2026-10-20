import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { CLAMP } from "../lib/anim";
import { Desert, END, T } from "./World";
import { Close, Decode, Excuse, Hook, Speech, Valley } from "./scenes";

export const DURATION7 = END;

export const Episode7: React.FC = () => {
  const f = useCurrentFrame();
  const moon = interpolate(f, [0, T.valley[0], T.speech[1], T.decode[0] + 60, T.close[0], END], [0.7, 0.9, 0.9, 0.5, 0.6, 0.7], CLAMP);
  const rays = interpolate(f, [0, T.decode[0], T.decode[0] + 200, T.excuse[1], END], [0.4, 0.4, 0.8, 0.6, 0.4], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={0.5} moon={moon} rays={rays} />
      <Desert f={f} />
      <Scene from={T.hook[0]} to={T.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T.valley[0]} to={T.valley[1]}><Valley /></Scene>
      <Scene from={T.speech[0]} to={T.speech[1]}><Speech /></Scene>
      <Scene from={T.decode[0]} to={T.decode[1]}><Decode /></Scene>
      <Scene from={T.excuse[0]} to={T.excuse[1]}><Excuse /></Scene>
      <Scene from={T.close[0]} to={T.close[1]} exit={0} drift={false}><Close dur={T.close[1] - T.close[0]} /></Scene>
    </AbsoluteFill>
  );
};
