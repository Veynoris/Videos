import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { Bloom } from "../components/Light";
import { CLAMP } from "../lib/anim";
import timeline from "./timeline.json";
import { Clues, Hook, Outro, Result, Signs, Test, Verse } from "./scenes";

type Beat = readonly [number, number];
export const T3 = timeline as unknown as Record<"hook" | "verse" | "clues" | "test" | "result" | "signs" | "outro", Beat>;
export const DURATION3 = T3.outro[1];

export const Episode3: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, T3.verse[0], T3.test[0], T3.result[0], T3.signs[0], T3.outro[0]], [0.5, 0.5, 0.9, 1, 0.8, 0.9], CLAMP);
  const moon = interpolate(f, [0, T3.test[0], T3.signs[0]], [0.8, 0.5, 0.6], CLAMP);
  const rays = interpolate(f, [0, T3.verse[0], T3.test[0], T3.result[0], T3.signs[0], T3.outro[0]], [0.5, 0.5, 0.3, 0.6, 0.9, 0.8], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={moon} rays={rays} />
      <Scene from={T3.hook[0]} to={T3.hook[1]}><Hook dur={T3.hook[1] - T3.hook[0]} /></Scene>
      <Scene from={T3.verse[0]} to={T3.verse[1]}><Verse /></Scene>
      <Scene from={T3.clues[0]} to={T3.clues[1]}><Clues /></Scene>
      <Scene from={T3.test[0]} to={T3.test[1]}><Test /></Scene>
      <Scene from={T3.result[0]} to={T3.result[1]}><Result /></Scene>
      <Scene from={T3.signs[0]} to={T3.signs[1]}><Signs /></Scene>
      <Bloom p={interpolate(f, [T3.hook[1] - 22, T3.hook[1] - 4, T3.hook[1] + 22], [0, 0.5, 0], CLAMP)} cx={540} cy={900} />
      <Scene from={T3.outro[0]} to={T3.outro[1]} exit={0}><Outro total={T3.outro[1] - T3.outro[0]} /></Scene>
    </AbsoluteFill>
  );
};
