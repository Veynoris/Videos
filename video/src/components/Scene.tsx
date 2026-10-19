import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { easeIn, focusOut, progress } from "../lib/anim";

// A beat on the single continuous canvas: children animate their own entrance;
// the wrapper handles the shared out-of-focus exit so beats overlap and dissolve.
export const Scene: React.FC<{ from: number; to: number; exit?: number; drift?: boolean; children: React.ReactNode }> = ({
  from,
  to,
  exit = 22,
  drift = true,
  children,
}) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <Exit dur={to - from} exit={exit} drift={drift}>
      {children}
    </Exit>
  </Sequence>
);

const Exit: React.FC<{ dur: number; exit: number; drift: boolean; children: React.ReactNode }> = ({ dur, exit, drift, children }) => {
  const f = useCurrentFrame();
  const p = exit > 0 ? progress(f, dur - exit, exit, easeIn) : 0;
  // Slow, continuous push-in so no beat is ever a static slide (reference A).
  // drift=false keeps a beat perfectly still (used where a reel must loop back onto its first frame).
  const push = drift ? 1 + 0.035 * (f / dur) : 1;
  const dx = drift ? Math.sin(f / 70) * 6 : 0;
  const dy = drift ? Math.cos(f / 85) * 5 : 0;
  const rot = drift ? Math.sin(f / 110) * 0.22 : 0;
  const out = focusOut(p);
  return (
    <AbsoluteFill style={{ ...out, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${push * (1 - p * 0.06)})` }}>
      {children}
    </AbsoluteFill>
  );
};
