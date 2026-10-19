import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./lib/fonts";
import { Backdrop } from "./components/Backdrop";
import { Scene } from "./components/Scene";
import { Hook, Verse } from "./scenes/Opening";
import { Sky } from "./scenes/Sky";
import { Centuries, TwoYears } from "./scenes/Calendars";
import { NextVerse, Outro, Scholar } from "./scenes/Closing";
import { CLAMP } from "./lib/anim";

import timeline from "./timeline.json";

// Beat timeline in frames (30 fps), shared with scripts/sound.py via timeline.json.
type Beat = readonly [number, number];
export const T = timeline as unknown as Record<"hook" | "verse" | "sky" | "years" | "cent" | "scholar" | "next" | "outro", Beat>;

export const DURATION = T.outro[1];

export const Episode: React.FC = () => {
  const f = useCurrentFrame();
  const k = (b: Beat, o = 0) => b[0] + o;
  const sun = interpolate(f, [0, 60, k(T.verse), k(T.sky), k(T.years), k(T.years, 80), k(T.scholar), k(T.scholar, 80), k(T.outro), k(T.outro, 90)], [0.9, 0.8, 0.3, 0.5, 0.8, 1, 1, 0.5, 0.5, 0.9], CLAMP);
  const moon = interpolate(f, [0, 30, k(T.verse), k(T.sky), k(T.years), k(T.years, 80), k(T.scholar), k(T.scholar, 80)], [0.4, 0.9, 0.5, 0.6, 0.8, 1, 1, 0.6], CLAMP);
  const rays = interpolate(f, [0, 90, k(T.verse), k(T.sky), k(T.years), k(T.cent), k(T.scholar), k(T.next), k(T.outro), k(T.outro, 100)], [0.9, 0.7, 0.45, 0.2, 0.5, 0.35, 0.55, 0.6, 0.6, 1], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={moon} rays={rays} />
      <Scene from={T.hook[0]} to={T.hook[1]}><Hook /></Scene>
      <Scene from={T.verse[0]} to={T.verse[1]}><Verse /></Scene>
      <Scene from={T.sky[0]} to={T.sky[1]} exit={26}><Sky dur={T.sky[1] - T.sky[0]} /></Scene>
      <Scene from={T.years[0]} to={T.years[1]}><TwoYears /></Scene>
      <Scene from={T.cent[0]} to={T.cent[1]}><Centuries /></Scene>
      <Scene from={T.scholar[0]} to={T.scholar[1]}><Scholar /></Scene>
      <Scene from={T.next[0]} to={T.next[1]}><NextVerse /></Scene>
      <Scene from={T.outro[0]} to={T.outro[1]} exit={0}><Outro total={T.outro[1] - T.outro[0]} /></Scene>
    </AbsoluteFill>
  );
};
