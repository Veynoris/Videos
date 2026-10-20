import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "../lib/fonts";
import { Backdrop } from "../components/Backdrop";
import { Scene } from "../components/Scene";
import { CLAMP, progress } from "../lib/anim";
import { C, F } from "../lib/theme";
import { camera, count, END, Field, GOLD, GOLD_GLOW, Plant, plantFade, Seed, seedPos, Soil, T } from "./Plant";
import { Close, Hook, Hundred, Multiply, Planted, Seven, Verse, Wealth } from "./scenes";

export const DURATION6 = END;

// The whole growing world, as a pure function of the frame (also used by the cover).
export const World: React.FC<{ f: number }> = ({ f }) => {
  const c = camera(f);
  const s = 1 - c * 0.58;
  const fade = plantFade(f);
  const seedA = f > T.camBack[1] ? progress(f, T.camBack[1], 20) : 1;
  const hovering = f < T.seedFall[0] || f > T.camBack[1];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(233,200,140,0)" />
          <stop offset="0.06" stopColor="rgba(233,200,140,0.16)" />
          <stop offset="0.3" stopColor="rgba(28,25,18,0.9)" />
          <stop offset="0.5" stopColor="#1C1912" />
          <stop offset="1" stopColor="#100E0B" />
        </linearGradient>
      </defs>
      <rect x={-50} y={990} width={1180} height={1000} fill="url(#ground)" opacity={c * fade} />
      <g opacity={fade}>
        <Field f={f} />
      </g>
      <g transform={`translate(540,${1300 + c * 190}) scale(${s}) translate(-540,-1300)`}>
        <Soil />
        <g opacity={fade}>
          <Plant f={f} />
        </g>
        {hovering ? (
          <g opacity={seedA}>
            <Seed f={f} />
          </g>
        ) : (
          <g opacity={fade}>
            <Seed f={f} glow={0.5} />
          </g>
        )}
      </g>
    </svg>
  );
};

// The count engraved in the soil: 1 seed → 7 ears → 700 grains.
const Count: React.FC<{ f: number }> = ({ f }) => {
  const a = interpolate(f, [T.seedFall[1], T.seedFall[1] + 20, T.pullback[0], T.pullback[0] + 24], [0, 1, 1, 0], CLAMP);
  if (a <= 0) return null;
  const { n, unit } = count(f);
  return (
    <div style={{ position: "absolute", top: 1400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: a }}>
      <div style={{ fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: GOLD, textShadow: `0 0 34px ${GOLD_GLOW}`, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: "0.45em", color: C.dim, textTransform: "uppercase", marginTop: 6 }}>{unit}</div>
    </div>
  );
};

export const Episode6: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, T.hundred[0], T.multiply[0], T.multiply[0] + 120, T.close[0], END], [0.5, 0.6, 0.8, 1, 0.8, 0.5], CLAMP);
  return (
    <AbsoluteFill>
      <Backdrop sun={glow} moon={0.5} rays={glow} />
      <World f={f} />
      <Count f={f} />
      <Scene from={T.hook[0]} to={T.hook[1]} drift={false}><Hook /></Scene>
      <Scene from={T.verse[0]} to={T.verse[1]}><Verse /></Scene>
      <Scene from={T.plant[0]} to={T.plant[1]}><Planted /></Scene>
      <Scene from={T.seven[0]} to={T.seven[1]}><Seven /></Scene>
      <Scene from={T.hundred[0]} to={T.hundred[1]}><Hundred /></Scene>
      <Scene from={T.multiply[0]} to={T.multiply[1]}><Multiply /></Scene>
      <Scene from={T.wealth[0]} to={T.wealth[1]}><Wealth /></Scene>
      <Scene from={T.close[0]} to={T.close[1]} exit={0} drift={false}><Close dur={T.close[1] - T.close[0]} /></Scene>
    </AbsoluteFill>
  );
};

export { seedPos };
