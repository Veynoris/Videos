import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { CLAMP } from "../lib/anim";
import timeline from "./timeline.json";
import { Close, Ex1, Ex2, Ex3, Hook } from "./scenes";

type Beat = readonly [number, number];
export const T5 = timeline as unknown as Record<"hook" | "ex1" | "ex2" | "ex3" | "close", Beat>;
export const DURATION5 = T5.close[1];

export const Episode5: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, T5.ex1[0], T5.ex3[0], T5.ex3[0] + 400, T5.close[0], DURATION5], [0.6, 0.4, 0.5, 1, 0.7, 0.6], CLAMP);
  const rays = interpolate(f, [0, T5.ex1[0], T5.ex3[0], T5.ex3[0] + 400, T5.close[0], DURATION5], [0.5, 0.3, 0.4, 1, 0.7, 0.5], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={0.6} rays={rays} />
      <Scene from={T5.hook[0]} to={T5.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T5.ex1[0]} to={T5.ex1[1]}><Ex1 /></Scene>
      <Scene from={T5.ex2[0]} to={T5.ex2[1]}><Ex2 /></Scene>
      <Scene from={T5.ex3[0]} to={T5.ex3[1]}><Ex3 /></Scene>
      <Scene from={T5.close[0]} to={T5.close[1]} exit={0} drift={false}><Close dur={T5.close[1] - T5.close[0]} /></Scene>
    </AbsoluteFill>
  );
};
