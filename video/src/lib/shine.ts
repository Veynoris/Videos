import React from "react";

// A band of light sweeping across text (p: 0 -> 1). Works for Latin and Arabic glyph ink.
export const shine = (color: string, p: number, glow?: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(105deg, ${color} 0%, ${color} 40%, #FFF6E2 50%, ${color} 60%, ${color} 100%)`,
  backgroundSize: "260% 100%",
  backgroundPosition: `${100 - p * 100}% 0`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter: glow ? `drop-shadow(0 0 18px ${glow})` : undefined,
});
