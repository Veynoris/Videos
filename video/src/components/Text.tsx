import React from "react";
import { useCurrentFrame } from "remotion";
import { focusIn, progress } from "../lib/anim";
import { C, F } from "../lib/theme";
import { shine } from "../lib/shine";

export type Tok = { t: string; color?: string; italic?: boolean; glow?: string; br?: boolean; sweep?: number };

type WordsProps = {
  tokens: Tok[];
  start: number; // local frame of first word
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  track?: boolean;
};

// Word-by-word blur reveal (the signature text entrance of all three references).
export const BlurWords: React.FC<WordsProps> = ({ tokens, start, stagger = 3, dur = 18, style, track = true }) => {
  const f = useCurrentFrame();
  const words = tokens.reduce((n, t) => n + (t.br ? 0 : t.t.split(" ").filter(Boolean).length), 0);
  const tp = progress(f, start, words * stagger + dur + 30);
  let i = 0;
  const out: React.ReactNode[] = [];
  tokens.forEach((tok, ti) => {
    if (tok.br) {
      out.push(<br key={`br${ti}`} />);
      return;
    }
    tok.t.split(" ").filter(Boolean).forEach((w, wi) => {
      const p = progress(f, start + i * stagger, dur);
      i++;
      out.push(
        <span
          key={`${ti}-${wi}`}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            color: tok.color,
            fontStyle: tok.italic ? "italic" : undefined,
            textShadow: tok.glow && tok.sweep === undefined ? `0 0 28px ${tok.glow}` : undefined,
            ...focusIn(p, 14, 12),
            ...(tok.sweep !== undefined && tok.color ? withFocus(shine(tok.color, tok.sweep, tok.glow), p) : {}),
          }}
        >
          {w}
        </span>,
        " ",
      );
    });
  });
  return (
    <div
      style={{
        fontFamily: F.serif,
        color: C.ink,
        fontSize: 66,
        lineHeight: 1.18,
        textAlign: "center",
        letterSpacing: track ? `${-0.01 + (1 - tp) * 0.09}em` : "-0.01em",
        ...style,
      }}
    >
      {out}
    </div>
  );
};

export type ArTok = { t: string; color?: string; glow?: string; br?: boolean; sweep?: number };

// Qur'anic Arabic, revealed whole word by whole word so shaping is never split.
export const ArabicWords: React.FC<{
  tokens: ArTok[];
  start: number;
  stagger?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ tokens, start, stagger = 4, size = 84, style }) => {
  const f = useCurrentFrame();
  let i = 0;
  const out: React.ReactNode[] = [];
  tokens.forEach((tok, ti) => {
    if (tok.br) {
      out.push(<br key={`br${ti}`} />);
      return;
    }
    tok.t.split(" ").filter(Boolean).forEach((w, wi) => {
      const p = progress(f, start + i * stagger, 22);
      i++;
      out.push(
        <span
          key={`${ti}-${wi}`}
          style={{
            display: "inline-block",
            color: tok.color,
            textShadow: tok.glow && tok.sweep === undefined ? `0 0 32px ${tok.glow}` : undefined,
            ...focusIn(p, 10, 10),
            ...(tok.sweep !== undefined && tok.color ? withFocus(shine(tok.color, tok.sweep, tok.glow), p) : {}),
          }}
        >
          {w}
        </span>,
        " ",
      );
    });
  });
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: F.quran,
        fontSize: size,
        lineHeight: 1.9,
        color: C.ink,
        textAlign: "center",
        ...style,
      }}
    >
      {out}
    </div>
  );
};

export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; p?: number }> = ({
  children,
  style,
  p = 1,
}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontSize: 22,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
      color: C.dim,
      textAlign: "center",
      ...focusIn(p, 8, 8),
      ...style,
    }}
  >
    {children}
  </div>
);

// Keep the entrance blur when a shine style (which sets its own filter) is applied.
const withFocus = (st: React.CSSProperties, p: number): React.CSSProperties => ({
  ...st,
  filter: [p < 1 ? `blur(${(1 - p) * 12}px)` : "", st.filter ?? ""].join(" ").trim() || undefined,
});
