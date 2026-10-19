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

// Beat timeline in frames (30 fps). Beats overlap and dissolve through depth blur.
// scripts/sound.py mirrors these numbers.
export const T = {
  hook: [0, 150],
  verse: [134, 400],
  sky: [384, 540],
  years: [520, 820],
  cent: [804, 1356],
  scholar: [1340, 1612],
  next: [1596, 1788],
  outro: [1772, 1960],
} as const;

export const DURATION = T.outro[1];

export const Episode: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, 60, 134, 384, 520, 600, 1340, 1420, 1772, 1860], [0.6, 0.6, 0.2, 0.5, 0.8, 1, 1, 0.5, 0.5, 0.9], CLAMP);
  const moon = interpolate(f, [0, 60, 134, 384, 520, 600, 1340, 1420], [0.4, 0.8, 0.5, 0.6, 0.8, 1, 1, 0.6], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={moon} />
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
