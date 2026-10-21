import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../lib/anim";

// Text written in light: a glowing pen sweeps in reading direction (right to left), revealing the text.
export const Written: React.FC<{ f: number; start: number; dur: number; top: number; children: React.ReactNode }> = ({ f, start, dur, top, children }) => {
  const p = interpolate(f, [start, start + dur], [0, 1], CLAMP);
  const edge = p * 112 - 6; // % from the right
  const mask = `linear-gradient(to left, black ${edge}%, rgba(0,0,0,0.35) ${edge + 3}%, transparent ${edge + 7}%)`;
  const penX = 1020 - (p * 1.12 - 0.06) * 960;
  const on = p > 0 && p < 1;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", top, WebkitMaskImage: mask, maskImage: mask }}>{children}</div>
      {on ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <radialGradient id="pen">
            <stop offset="0" stopColor="#FFFDF4" />
            <stop offset="0.3" stopColor="rgba(243,211,138,0.9)" />
            <stop offset="1" stopColor="rgba(243,211,138,0)" />
          </radialGradient>
          <rect x={penX} y={top + 10} width={4} height={200} fill="rgba(255,246,220,0.8)" style={{ filter: "blur(3px)" }} />
          <circle cx={penX} cy={top + 110} r={60} fill="url(#pen)" opacity={0.9} />
          {Array.from({ length: 18 }, (_, i) => {
            const a = ((f * 7 + i * 47) % 100) / 100;
            return <circle key={i} cx={penX + a * 120 + Math.sin(i * 3 + f / 3) * 8} cy={top + 20 + ((i * 37) % 190) + a * 30} r={3 * (1 - a) + 1} fill="url(#pen)" opacity={1 - a} />;
          })}
        </svg>
      ) : null}
    </>
  );
};
