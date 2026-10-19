// Quran Decoding visual system. Background follows reference A (navy);
// the palette is episode-specific: gold = sun / solar, silver = moon / lunar.
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  bg: "#0A1220",
  bgDeep: "#060B15",
  ink: "#ECE6DA",
  dim: "#8C96A8",
  faint: "rgba(236,230,218,0.14)",
  hair: "rgba(236,230,218,0.12)",
  sun: "#E9B96E",
  sunGlow: "rgba(233,185,110,0.55)",
  moon: "#BFD0EA",
  moonGlow: "rgba(191,208,234,0.55)",
  card: "rgba(19,29,48,0.62)",
};

export const F = {
  serif: "Newsreader",
  mono: "JetBrains Mono",
  quran: "KFGQPC Hafs",
};

// Mobile-safe region (platform UI overlays at top and bottom).
export const SAFE = { top: 150, bottom: 340, side: 90 };
