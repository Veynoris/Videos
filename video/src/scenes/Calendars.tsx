import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BlurWords, Mono } from "../components/Text";
import { Orbits } from "../components/Orbits";
import { Ribbons } from "../components/Ribbons";
import { Flare } from "../components/Light";
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
      <Flare cx={790} cy={640 + 82} p={interpolate(f, [moonDoneAt - 2, moonDoneAt + 4, moonDoneAt + 40], [0, 0.8, 0], CLAMP)} color={C.moon} width={900} />
      <Flare cx={290} cy={640 + 82} p={interpolate(f, [SUN_DONE - 2, SUN_DONE + 4, SUN_DONE + 40], [0, 0.8, 0], CLAMP)} color={C.sun} width={900} />
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
export const FILL_DUR = 270;
const fillEase = Easing.bezier(0.42, 0, 0.58, 1); // gentler than easeInOut so the three centuries are evenly paced

export const fillDays = (f: number) =>
  interpolate(f, [FILL_START, FILL_START + FILL_DUR], [0, SPAN_DAYS], { ...CLAMP, easing: fillEase });

// 6 — Run both calendars over the same span of days. The century callouts show the lunar count
// pulling ahead by ~3 years every 100 solar years: 100→103, 200→206, 300→309.
export const Centuries: React.FC = () => {
  const f = useCurrentFrame();
  const d = fillDays(f);
  const done = FILL_START + FILL_DUR;
  const sunN = Math.min(300, Math.floor(d / SOLAR_YEAR + 1e-9));
  const moonN = Math.min(309, Math.floor(d / LUNAR_YEAR + 1e-9));
  // frame at which each century is crossed (numeric inversion of the eased clock)
  const crossAt = (k: number) => {
    for (let i = FILL_START; i <= done; i++) if (fillDays(i) >= k * 100 * SOLAR_YEAR - 1e-6) return i;
    return done;
  };
  const cents = [1, 2, 3].map((k) => progress(f, crossAt(k), 14));
  const swap = progress(f, done + 16, 20);
  const lead = [0, 1, 2, 3].reduce((n, k) => (k > 0 && f >= crossAt(k) ? k : n), 0);
  const pop = lead > 0 ? progress(f, crossAt(lead), 12) : 0;
  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 285, opacity: 1 - swap, filter: swap > 0 ? `blur(${swap * 12}px)` : undefined }}>
        <BlurWords start={6} tokens={[{ t: "Run both calendars" }, { br: true, t: "" }, { t: "for 300 years." }]} />
      </div>
      <div style={{ ...center, top: 285 }}>
        <BlurWords
          start={done + 26}
          stagger={4}
          tokens={[{ t: "Same days." }, { br: true, t: "" }, { t: "Nine more years.", italic: true, color: C.moon, glow: C.moonGlow }]}
        />
      </div>

      {/* counters */}
      <div style={{ position: "absolute", top: 610, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 120, ...focusIn(progress(f, 14, 26), 12, 10) }}>
        <div style={{ width: 360, textAlign: "center" }}>
          <Mono style={{ color: C.sun }}>By the sun</Mono>
          <div style={{ fontFamily: F.serif, fontSize: 150, lineHeight: 1.1, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{sunN}</div>
        </div>
        <div style={{ width: 360, textAlign: "center", position: "relative" }}>
          <Mono style={{ color: C.moon }}>By the moon</Mono>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 150,
              lineHeight: 1.1,
              color: moonN > sunN ? C.moon : C.ink,
              fontVariantNumeric: "tabular-nums",
              textShadow: moonN > 300 ? `0 0 26px ${C.moonGlow}` : undefined,
            }}
          >
            {moonN}
          </div>
          {lead > 0 && (
            <div
              style={{
                position: "absolute",
                right: -40,
                top: 34,
                fontFamily: F.serif,
                fontStyle: "italic",
                fontSize: 54,
                color: C.moon,
                textShadow: `0 0 18px ${C.moonGlow}`,
                transform: `translateY(${(1 - pop) * 16}px) scale(${0.8 + pop * 0.2})`,
                opacity: pop,
              }}
            >
              +{lead * 3}
            </div>
          )}
        </div>
      </div>

      <div style={{ ...center, top: 920 }}>
        <Ribbons d={d} appear={progress(f, 22, 30)} centuries={cents} />
      </div>
      <div style={{ ...center, top: 1270 }}>
        <Mono p={progress(f, 30, 20)} style={{ fontSize: 24 }}>
          Day {Math.round(d).toLocaleString("en-US")}
        </Mono>
      </div>
      <div style={{ ...center, top: 1360, flexDirection: "column", alignItems: "center", gap: 18 }}>
        <BlurWords start={done + 50} tokens={[{ t: "≈ 3 more lunar years" }, { t: "every century.", italic: true, color: C.moon }]} style={{ fontSize: 44 }} />
        <Mono p={progress(f, done + 74, 24)} style={{ fontSize: 21 }}>
          300 solar = 309.2 lunar · ≈ 73 days apart
        </Mono>
      </div>
    </AbsoluteFill>
  );
};
