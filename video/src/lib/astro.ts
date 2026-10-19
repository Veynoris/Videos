// Mean year lengths (days). Tropical year and 12 mean synodic months.
export const SOLAR_YEAR = 365.2422;
export const LUNAR_YEAR = 12 * 29.530589; // 354.367
export const SPAN_DAYS = 300 * SOLAR_YEAR; // 109,572.7 days -> 309.2 lunar years

export const lerpColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
