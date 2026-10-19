import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { Bloom } from "../components/Light";
import { CLAMP } from "../lib/anim";
import timeline from "./timeline.json";
import { Asmai, Decode, Fulfilment, Heart, Hook, Outro, Verse } from "./scenes";

type Beat = readonly [number, number];
export const T2 = timeline as unknown as Record<"hook" | "verse" | "asmai" | "decode" | "heart" | "promise" | "outro", Beat>;
export const DURATION2 = T2.outro[1];

export const Episode2: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, T2.verse[0], T2.decode[0], T2.heart[0], T2.promise[0], T2.outro[0]], [0.3, 0.5, 0.6, 0.2, 0.7, 0.9], CLAMP);
  const moon = interpolate(f, [0, T2.verse[0], T2.heart[0], T2.promise[0]], [0.9, 0.6, 1, 0.6], CLAMP);
  const rays = interpolate(f, [0, T2.verse[0], T2.decode[0], T2.heart[0], T2.promise[0], T2.outro[0]], [0.4, 0.5, 0.35, 0.2, 0.7, 0.9], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={moon} rays={rays} />
      <Scene from={T2.hook[0]} to={T2.hook[1]}><Hook dur={T2.hook[1] - T2.hook[0]} /></Scene>
      <Scene from={T2.verse[0]} to={T2.verse[1]}><Verse /></Scene>
      <Scene from={T2.asmai[0]} to={T2.asmai[1]}><Asmai /></Scene>
      <Scene from={T2.decode[0]} to={T2.decode[1]}><Decode /></Scene>
      <Scene from={T2.heart[0]} to={T2.heart[1]}><Heart dur={T2.heart[1] - T2.heart[0]} /></Scene>
      <Scene from={T2.promise[0]} to={T2.promise[1]}><Fulfilment /></Scene>
      <Bloom p={interpolate(f, [T2.hook[1] - 22, T2.hook[1] - 4, T2.hook[1] + 22], [0, 0.5, 0], CLAMP)} cx={540} cy={760} />
      <Scene from={T2.outro[0]} to={T2.outro[1]} exit={0}><Outro total={T2.outro[1] - T2.outro[0]} /></Scene>
    </AbsoluteFill>
  );
};
