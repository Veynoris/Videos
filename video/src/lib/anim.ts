import { Easing, interpolate } from "remotion";
import { FPS } from "./theme";

export const sec = (s: number) => Math.round(s * FPS);

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Soft, decisive deceleration used for every entrance.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.75, 0.2);

export const progress = (frame: number, start: number, dur: number, easing = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing });

// Blur-focus entrance shared by text and cards (references A, B, C).
export const focusIn = (p: number, rise = 16, blur = 14) => ({
  opacity: p,
  filter: p >= 1 ? undefined : `blur(${(1 - p) * blur}px)`,
  transform: `translateY(${(1 - p) * rise}px)`,
});

// Out-of-focus exit: blur up, slight recession.
export const focusOut = (p: number, blur = 26) => ({
  opacity: 1 - p,
  filter: p <= 0 ? undefined : `blur(${p * blur}px)`,
  transform: `scale(${1 - p * 0.06})`,
});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
