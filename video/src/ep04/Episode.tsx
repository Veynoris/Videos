import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { CLAMP } from "../lib/anim";
import timeline from "./timeline.json";
import { AllahScene, Close, Except, Hook, Mirror, Story } from "./scenes";

type Beat = readonly [number, number];
export const T4 = timeline as unknown as Record<"hook" | "except" | "mirror" | "allah" | "story" | "close", Beat>;
export const DURATION4 = T4.close[1];

export const Episode4: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, T4.story[0], T4.story[0] + 260, T4.close[0], DURATION4], [0.6, 0.5, 1, 0.8, 0.6], CLAMP);
  const moon = interpolate(f, [0, T4.mirror[0], T4.story[0], DURATION4], [0.8, 0.6, 0.5, 0.8], CLAMP);
  const rays = interpolate(f, [0, T4.story[0], T4.story[0] + 260, T4.close[0], DURATION4], [0.5, 0.4, 1, 0.8, 0.5], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={moon} rays={rays} />
      <Scene from={T4.hook[0]} to={T4.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T4.except[0]} to={T4.except[1]}><Except /></Scene>
      <Scene from={T4.mirror[0]} to={T4.mirror[1]}><Mirror /></Scene>
      <Scene from={T4.allah[0]} to={T4.allah[1]}><AllahScene /></Scene>
      <Scene from={T4.story[0]} to={T4.story[1]}><Story /></Scene>
      <Scene from={T4.close[0]} to={T4.close[1]} exit={0} drift={false}><Close dur={T4.close[1] - T4.close[0]} /></Scene>
    </AbsoluteFill>
  );
};
