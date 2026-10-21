import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Scene } from "../components/Scene";
import { C } from "../lib/theme";
import { blackout, END, T, World } from "./World";
import { Answer, Close, Dark, Dua, Fall, Hook } from "./scenes";

export const DURATION8 = END;

export const Episode8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      <World f={f} />
      <AbsoluteFill style={{ background: "#000", opacity: blackout(f) }} />
      <Scene from={T.hook[0]} to={T.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T.fall[0]} to={T.fall[1]}><Fall /></Scene>
      <Scene from={T.dark[0]} to={T.dark[1]}><Dark /></Scene>
      <Scene from={T.dua[0]} to={T.dua[1]}><Dua /></Scene>
      <Scene from={T.answer[0]} to={T.answer[1]}><Answer /></Scene>
      <Scene from={T.close[0]} to={T.close[1]} exit={0} drift={false}><Close dur={T.close[1] - T.close[0]} /></Scene>
    </AbsoluteFill>
  );
};
