import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlurWords, Mono } from "../components/Text";
import { Orbits } from "../components/Orbits";
import { YearGrids } from "../components/YearGrids";
import { Shockwave } from "../components/Orb";
import { CLAMP, easeInOut, focusIn, progress } from "../lib/anim";
import { LUNAR_YEAR, SOLAR_YEAR, SPAN_DAYS } from "../lib/astro";
import { C, F } from "../lib/theme";

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

// Shared clock: run to one lunar year, hold so the 11-day gap can be read, then finish the solar year.
export const ORBIT_START = 66;
export const MOON_DONE = 196;
export const GAP_HOLD = 34;
export const SUN_DONE = MOON_DONE + GAP_HOLD + 30;

export const orbitDays = (f: number) =>
  f < MOON_DONE
    ? interpolate(f, [ORBIT_START, MOON_DONE], [0, LUNAR_YEAR], { ...CLAMP, easing: easeInOut })
    : interpolate(f, [MOON_DONE + GAP_HOLD, SUN_DONE], [LUNAR_YEAR, SOLAR_YEAR], { ...CLAMP, easing: easeInOut });

// 5 — Two ways to count a year: one shared clock, two orbits.
export const TwoYears: React.FC = () => {
  const f = useCurrentFrame();
  const d = orbitDays(f);
  const moonDoneAt = MOON_DONE;
  const moonDone = progress(f, moonDoneAt, 14);
  const sunDone = progress(f, SUN_DONE, 14);
  const gap = progress(f, moonDoneAt, 10) * (1 - sunDone);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 255 }}>
        <Mono p={progress(f, 4, 20)}>One classical answer</Mono>
      </div>
      <div style={{ ...center, top: 320 }}>
        <BlurWords start={12} tokens={[{ t: "There are two ways" }, { br: true, t: "" }, { t: "to count a year." }]} />
      </div>
      <div style={{ ...center, top: 640 }}>
        <Orbits d={d} appear={progress(f, 36, 30)} moonDone={moonDone} sunDone={sunDone} gap={gap} />
      </div>
      <div style={{ ...center, top: 1180, gap: 0 }}>
        <div style={{ width: 500, ...focusIn(progress(f, 46, 24), 8, 8) }}>
          <Mono style={{ color: C.sun }}>By the sun</Mono>
          <div style={{ fontFamily: F.serif, fontSize: 44, color: C.ink, textAlign: "center", marginTop: 10 }}>365.24 days</div>
        </div>
        <div style={{ width: 500, ...focusIn(progress(f, 52, 24), 8, 8) }}>
          <Mono style={{ color: C.moon }}>By the moon</Mono>
          <div style={{ fontFamily: F.serif, fontSize: 44, color: C.ink, textAlign: "center", marginTop: 10 }}>354.37 days</div>
        </div>
      </div>
      <div style={{ ...center, top: 1380 }}>
        <BlurWords
          start={moonDoneAt + 8}
          tokens={[{ t: "The moon's year ends" }, { t: "11 days", color: C.moon, glow: C.moonGlow }, { t: "sooner." }]}
          style={{ fontSize: 52 }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const FILL_START = 48;
export const FILL_DUR = 246;

export const fillDays = (f: number) =>
  interpolate(f, [FILL_START, FILL_START + FILL_DUR], [0, SPAN_DAYS], { ...CLAMP, easing: easeInOut });

// 6 — Run both calendars over the same span of days: 300 vs 309.
export const Centuries: React.FC = () => {
  const f = useCurrentFrame();
  const d = fillDays(f);
  const done = FILL_START + FILL_DUR;
  const swap = progress(f, done + 16, 20);
  const pulse = progress(f, done - 10, 30);
  const plus = progress(f, done + 4, 24);
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 285, opacity: 1 - swap, filter: swap > 0 ? `blur(${swap * 12}px)` : undefined }}>
        <BlurWords start={6} tokens={[{ t: "Now run both" }, { br: true, t: "" }, { t: "for three centuries." }]} />
      </div>
      <div style={{ ...center, top: 285 }}>
        <BlurWords
          start={done + 26}
          stagger={4}
          tokens={[{ t: "Same days." }, { br: true, t: "" }, { t: "Nine more years.", italic: true, color: C.moon, glow: C.moonGlow }]}
        />
      </div>
      <div style={{ ...center, top: 560 }}>
        <div style={{ display: "flex", width: 1000, justifyContent: "space-around" }}>
          <Mono p={progress(f, 20, 20)} style={{ color: C.sun, width: 420 }}>Solar years</Mono>
          <Mono p={progress(f, 24, 20)} style={{ color: C.moon, width: 420 }}>Lunar years</Mono>
        </div>
      </div>
      <div style={{ ...center, top: 610 }}>
        <YearGrids d={d} appear={progress(f, 18, 30)} pulse={pulse} frame={f} />
      </div>
      <div style={{ position: "absolute", left: 790 - 199 + 8 * 21 + 22, top: 610 + 20 + 15 * 21 - 40, ...focusIn(plus, 0, 10) }}>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 54, color: C.moon, textShadow: `0 0 26px ${C.moonGlow}` }}>+9</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Shockwave cx={675} cy={945} p={interpolate(f, [done, done + 50], [0, 1], { ...CLAMP, easing: easeInOut })} color={C.moon} max={600} />
      </svg>
      <div style={{ ...center, top: 1150 }}>
        <Mono p={progress(f, 30, 20)} style={{ fontSize: 24 }}>
          Day {Math.round(d).toLocaleString("en-US")}
        </Mono>
      </div>
      <div style={{ ...center, top: 1280, flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Mono p={progress(f, done + 60, 24)} style={{ fontSize: 20, color: C.ink }}>
          300 solar years = 309.2 lunar years
        </Mono>
        <Mono p={progress(f, done + 74, 24)} style={{ fontSize: 18 }}>
          Close, not exact · about 73 days apart
        </Mono>
      </div>
    </AbsoluteFill>
  );
};
