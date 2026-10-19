import React from "react";
import { useCurrentFrame } from "remotion";
import { focusIn } from "../lib/anim";
import { C } from "../lib/theme";

// Glass verse/quote card (reference A) with a 3D tilt-up entrance and a light glint circling the border.
export const Card: React.FC<{ p: number; width?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  p,
  width = 920,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "relative",
        width,
        padding: "54px 56px 50px",
        borderRadius: 34,
        background: C.card,
        border: `1px solid ${C.hair}`,
        boxShadow: "0 50px 140px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        ...focusIn(p, 30, 22),
        transform: `perspective(1500px) rotateX(${(1 - p) * 24}deg) translateY(${(1 - p) * 60}px) scale(${0.94 + p * 0.06})`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 34,
          padding: 1.5,
          background: `conic-gradient(from ${f * 1.6}deg, transparent 0deg, rgba(255,226,170,0.85) 18deg, transparent 46deg, transparent 180deg, rgba(191,208,234,0.6) 198deg, transparent 226deg)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: p * 0.9,
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};
