import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { CLAMP, easeInOut } from "../lib/anim";
import { Console, END, Engine, Readout, T } from "./Machine";
import { Close, Decode, Hook, Story, Tenth, Verse } from "./scenes";

export const DURATION4 = END;
const LOOP = 40; // final frames cross-fade onto the machine's frame-0 state

// The machine at frame f, with its gauges.
const Machine: React.FC<{ f: number }> = ({ f }) => {
  const gauges = interpolate(f, [-1, 0, T.zoom[0], T.zoom[0] + 30, T.reset[0], T.reset[0] + 40], [1, 1, 1, 0, 0, 1], CLAMP);
  const readout = interpolate(f, [-1, 0, T.iris[0] - 6, T.iris[0] + 14, T.iris[3], T.iris[3] + 20], [1, 1, 1, 0, 0, 1], CLAMP);
  const dim = interpolate(f, [T.zoom[0], T.zoom[1], T.zoom[2], T.zoom[3]], [1, 0.62, 0.62, 1], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: dim }}>
      <Engine f={f} />
      <Readout f={f} opacity={readout} />
      <Console f={f} opacity={gauges} />
    </AbsoluteFill>
  );
};

export const Episode4: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, T.story[0], T.story[0] + 300, T.close[0], END], [0.6, 0.5, 1, 0.7, 0.6], CLAMP);
  const rays = interpolate(f, [0, T.story[0], T.story[0] + 300, T.close[0], END], [0.5, 0.4, 1, 0.7, 0.5], CLAMP);
  const loop = interpolate(f, [END - LOOP, END - 1], [0, 1], { ...CLAMP, easing: easeInOut });
  return (
    <AbsoluteFill>
      <Backdrop sun={sun} moon={0.7} rays={rays} />
      <AbsoluteFill style={{ opacity: 1 - loop }}>
        <Machine f={f} />
      </AbsoluteFill>
      {loop > 0 ? (
        <AbsoluteFill style={{ opacity: loop }}>
          <Machine f={f - END} />
        </AbsoluteFill>
      ) : null}
      <Scene from={T.hook[0]} to={T.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T.decode[0]} to={T.decode[1]}><Decode /></Scene>
      <Scene from={T.tenth[0]} to={T.tenth[1]}><Tenth /></Scene>
      <Scene from={T.story[0]} to={T.story[1]}><Story /></Scene>
      <Scene from={T.verse[0]} to={T.verse[1]}><Verse /></Scene>
      <Scene from={T.close[0]} to={T.close[1]} exit={0} drift={false}><Close dur={T.close[1] - T.close[0]} /></Scene>
    </AbsoluteFill>
  );
};
