import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { easeIn, focusOut, progress } from "../lib/anim";

// A beat on the single continuous canvas: children animate their own entrance;
// the wrapper handles the shared out-of-focus exit so beats overlap and dissolve.
export const Scene: React.FC<{ from: number; to: number; exit?: number; children: React.ReactNode }> = ({
  from,
  to,
  exit = 22,
  children,
}) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <Exit dur={to - from} exit={exit}>
      {children}
    </Exit>
  </Sequence>
);

const Exit: React.FC<{ dur: number; exit: number; children: React.ReactNode }> = ({ dur, exit, children }) => {
  const f = useCurrentFrame();
  const p = exit > 0 ? progress(f, dur - exit, exit, easeIn) : 0;
  // Slow, continuous push-in so no beat is ever a static slide (reference A).
  const push = 1 + 0.035 * (f / dur);
  const out = focusOut(p);
  return (
    <AbsoluteFill style={{ ...out, transform: `scale(${push * (1 - p * 0.06)})` }}>
      {children}
    </AbsoluteFill>
  );
};
