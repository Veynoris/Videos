import React from "react";
import { focusIn } from "../lib/anim";
import { C } from "../lib/theme";

// Glass verse/quote card (reference A): faint fill, hairline border, deep soft shadow.
export const Card: React.FC<{ p: number; width?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  p,
  width = 920,
  children,
  style,
}) => (
  <div
    style={{
      width,
      padding: "54px 56px 50px",
      borderRadius: 34,
      background: C.card,
      border: `1px solid ${C.hair}`,
      boxShadow: "0 50px 140px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      ...focusIn(p, 30, 22),
      ...style,
    }}
  >
    {children}
  </div>
);
