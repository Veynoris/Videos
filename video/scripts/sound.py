"""Quran Decoding EP01 — cinematic sound design, synthesised and mastered offline.

No music track, no recitation, no external samples: every layer is built here and
processed with Spotify's Pedalboard (studio reverb / dynamics) and SciPy.
All cue times come from the Remotion timeline (src/Episode.tsx T, scene-local
frames in src/scenes/*.tsx), so sound and picture stay frame-locked.

Usage: python3 -I scripts/sound.py out/sfx.wav
"""
import sys
import wave

import numpy as np
import pyloudnorm
from pedalboard import Chorus, Compressor, HighpassFilter, HighShelfFilter, Limiter, LowpassFilter, Pedalboard, Reverb
from scipy import signal

SR = 48000
FPS = 30
TOTAL_FRAMES = 1960
DUR = TOTAL_FRAMES / FPS
N = int(DUR * SR)
rng = np.random.default_rng(1373)  # Ibn Kathir's death year (CE), for reproducibility

# Timeline (absolute frames) — mirrors src/Episode.tsx
T = dict(hook=0, verse=134, sky=384, years=520, cent=804, scholar=1340, next=1596, outro=1772)
SKY_END = 540
MOON_DONE = T["years"] + 196
SUN_DONE = T["years"] + 260
FILL0, FILL1 = T["cent"] + 48, T["cent"] + 48 + 246
MERGE = T["outro"] + 74

# Tonal centre: D. Open fifths and pentatonic colours keep it reverent, not "musical score".
D2 = 73.42
PENTA = [587.33, 659.26, 739.99, 880.0, 987.77, 1174.66, 1318.51, 1479.98, 1760.0]


# ---------------------------------------------------------------- utilities
def secs(frames):
    return frames / FPS


def tvec(n):
    return np.arange(n) / SR


def stereo(x, pan=0.0):
    """Equal-power pan; `pan` may be a scalar or a per-sample array in [-1, 1]."""
    a = (np.asarray(pan) + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)])


def white(n):
    return rng.standard_normal(n)


def pink(n):
    b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
    return signal.lfilter(b, a, white(n)) * 8


def brown(n):
    x = np.cumsum(white(n))
    x = signal.sosfilt(signal.butter(1, 15, "hp", fs=SR, output="sos"), x)
    return x / (np.max(np.abs(x)) + 1e-9)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "bandpass", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "lowpass", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "highpass", fs=SR, output="sos"), x)


def sweep_bp(x, f_curve, q=1.4, block=256):
    """Time-varying resonant band-pass (block-wise biquad with carried state)."""
    y = np.zeros_like(x)
    zi = np.zeros((1, 2))
    for i in range(0, len(x), block):
        fc = float(np.clip(f_curve[min(i, len(f_curve) - 1)], 40, SR / 2.3))
        bw = fc / q
        sos = signal.butter(1, [max(20, fc - bw / 2), min(SR / 2.1, fc + bw / 2)], "bandpass", fs=SR, output="sos")
        y[i : i + block], zi = signal.sosfilt(sos, x[i : i + block], zi=zi)
    return y


def env_ar(n, attack_frac=0.6, curve=2.0):
    a = int(n * attack_frac)
    up = np.linspace(0, 1, a) ** curve
    down = np.linspace(1, 0, n - a) ** (curve * 0.8)
    return np.concatenate([up, down])


def norm(x, peak=1.0):
    m = np.max(np.abs(x)) + 1e-12
    return x / m * peak


def db(g):
    return 10 ** (g / 20)


def hall_ir(seconds=4.5, dark=4500, seed=0):
    """Synthetic stereo cathedral impulse response (decorrelated, darkening tail)."""
    n = int(seconds * SR)
    t = tvec(n)
    r = np.random.default_rng(seed)
    ir = []
    for ch in range(2):
        noise = r.standard_normal(n) * np.exp(-t * 6.9 / seconds)
        noise = lp(noise, dark)
        early = np.zeros(n)
        for k in range(14):
            idx = int(r.uniform(0.004, 0.09) * SR)
            early[idx] += r.uniform(0.25, 0.7) * (-1) ** k
        ir.append(norm(noise * 0.9 + early * 0.6))
    ir = np.stack(ir)
    return ir / np.sqrt(np.sum(ir**2, axis=1, keepdims=True))


HALL = hall_ir(4.8, 4200, 1)
CAVE = hall_ir(2.6, 3000, 2)


def convolve(st, ir, wet=0.35):
    """Stereo (2, n) through stereo IR; returns (2, n + len(ir) - 1)."""
    mono = st.mean(axis=0)
    w = np.stack([signal.fftconvolve(mono, ir[0]), signal.fftconvolve(mono, ir[1])])
    d = np.zeros_like(w)
    d[:, : st.shape[1]] = st
    return d * (1 - wet) + w * wet * 2.2


def pb(st, board):
    return board(st.astype(np.float32), SR).astype(np.float64)


class Mix:
    def __init__(self):
        self.stems = {k: np.zeros((2, N + SR * 6)) for k in ("bed", "fx", "impact", "tonal", "detail")}

    def add(self, stem, t_sec, st, gain_db=0.0):
        s = int(t_sec * SR)
        if s < 0:
            st = st[:, -s:]
            s = 0
        e = min(self.stems[stem].shape[1], s + st.shape[1])
        self.stems[stem][:, s:e] += st[:, : e - s] * db(gain_db)


# ---------------------------------------------------------------- instruments
def impact(weight=1.0, bright=1.0):
    """Trailer hit: sub drop + body thump + transient crack + inharmonic metal bloom."""
    n = int(5.5 * SR)
    t = tvec(n)
    f = 30 + 48 * np.exp(-t * 3.2)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6) * np.clip(t / 0.004, 0, 1)
    sub = np.tanh(sub * 1.8) * 0.9
    body = lp(brown(n), 380) * np.exp(-t * 9) * 2.2
    crack = hp(white(n), 2500) * np.exp(-t * 160) * 0.55 * bright
    partials = [92.5, 138.6, 207.7, 277.2, 369.9, 555.1]
    metal = sum(np.sin(2 * np.pi * p * t + rng.uniform(0, 6)) * np.exp(-t * (0.9 + i * 0.35)) / (i + 1.4) for i, p in enumerate(partials))
    metal *= np.clip(t / 0.01, 0, 1) * 0.35 * bright
    st = stereo(sub * weight + body * weight, 0) + stereo(crack, 0.15) + np.stack([metal, np.roll(metal, 90)])
    return convolve(st, HALL, wet=0.32)


def reverse_swell(seconds=1.6, bright=1.0):
    """Reversed reverb tail that sucks into a hit."""
    n = int(0.5 * SR)
    burst = (hp(white(n), 300) * np.exp(-tvec(n) * 30) * bright + lp(brown(n), 500) * np.exp(-tvec(n) * 12))
    tail = convolve(stereo(burst), HALL, wet=1.0)[:, : int(seconds * SR)]
    tail = tail[:, ::-1] * np.linspace(0, 1, tail.shape[1]) ** 1.5
    return norm(tail, 0.9)


def whoosh(seconds=1.2, pan_from=-0.8, pan_to=0.8, lo=250, hi=3200, peak=0.62, tone=True):
    """Doppler pass-by: swept resonant noise + gliding tonal core + air, short room."""
    n = int(seconds * SR)
    x = pink(n)
    pos = np.linspace(0, 1, n)
    f_curve = lo * (hi / lo) ** np.interp(pos, [0, peak, 1], [0, 1, 0.35])
    body = sweep_bp(x, f_curve, q=1.1)
    air = lp(hp(white(n), 4000), 11000) * 0.045
    e = env_ar(n, peak, 2.2)
    mono = (body + air) * e
    if tone:
        g = 160 * (2.6 ** np.interp(pos, [0, peak, 1], [0, 1, 0.6]))
        mono += np.sin(2 * np.pi * np.cumsum(g) / SR) * e**2 * 0.08
    st = stereo(norm(mono), np.linspace(pan_from, pan_to, n))
    return pb(st, Pedalboard([HighpassFilter(90), LowpassFilter(12000), Reverb(room_size=0.55, damping=0.6, wet_level=0.22, dry_level=0.85, width=1.0)]))


def riser(seconds, top=1.0):
    """Shepard-style tonal riser + swelling noise, ending at full tension."""
    n = int(seconds * SR)
    t = tvec(n)
    pos = t / seconds
    out = np.zeros(n)
    for k in range(6):
        base = D2 * 2 ** k
        f = base * 2 ** (pos * 1.0)
        lf = np.log2(f / D2) / 6
        amp = np.exp(-((lf - 0.5) ** 2) / 0.05)
        out += np.sin(2 * np.pi * np.cumsum(f) / SR) * amp
    trem = 1 + 0.25 * np.sin(2 * np.pi * np.cumsum(2 + pos**2 * 14) / SR)
    tonal = out * trem * pos**1.6
    noise = lp(sweep_bp(pink(n), 180 * 25 ** pos, q=0.9), 9000) * pos**2.2 * 0.9
    st = stereo(norm(tonal) * 0.5 + norm(noise) * 0.6 * top)
    st[1] = np.roll(st[1], 240)
    return pb(st, Pedalboard([Chorus(rate_hz=0.4, depth=0.3, mix=0.4), Reverb(room_size=0.8, wet_level=0.3, dry_level=0.8, width=1)]))


def bell(freq, seconds=4.0, ratio=3.5, index=2.2):
    """FM bell with inharmonic overtones."""
    n = int(seconds * SR)
    t = tvec(n)
    idx = index * np.exp(-t * 3)
    mod = np.sin(2 * np.pi * freq * ratio * t) * idx
    car = np.sin(2 * np.pi * freq * t + mod) * np.exp(-t * 1.1)
    car += 0.3 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 2.4)
    car *= np.clip(t / 0.002, 0, 1)
    return car


def sparkle(seconds, pan_from, pan_to, density=55, lo=1800, hi=6200, seed=0):
    """Granular glints following a light sweep across the frame."""
    n = int(seconds * SR)
    out = np.zeros((2, n + SR))
    r = np.random.default_rng(seed)
    count = int(density * seconds)
    for k in range(count):
        pos = (k + r.uniform(0, 1)) / count
        start = int(pos * n)
        f = float(np.clip(r.choice(PENTA) * r.choice([2, 2, 3, 4]), lo, hi))
        g = bell(f, 0.35, ratio=r.uniform(1.4, 2.8), index=1.2) * r.uniform(0.25, 1) * np.sin(np.pi * pos) ** 0.6
        pan = pan_from + (pan_to - pan_from) * pos + r.uniform(-0.15, 0.15)
        out[:, start : start + len(g)] += stereo(g, np.clip(pan, -1, 1))
    return convolve(pb(out, Pedalboard([HighpassFilter(1200), LowpassFilter(11000)])), HALL, wet=0.55)


def tick(tone=1.0):
    """Mechanical clock tick: resonant click with a small wooden body."""
    n = int(0.12 * SR)
    t = tvec(n)
    imp = white(n) * np.exp(-t * 900)
    click = bp(imp, 1800 * tone, 4200 * tone) * 3
    body = np.sin(2 * np.pi * 620 * tone * t) * np.exp(-t * 90) * 0.4
    return norm(lp(click, 9000) + body)


def plink(freq):
    """Soft mallet: sine + bright partial + felt click."""
    n = int(1.6 * SR)
    t = tvec(n)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t * 3.2) + 0.25 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 12)
    x += hp(white(n), 3000) * np.exp(-t * 400) * 0.15
    return x * np.clip(t / 0.002, 0, 1)


def pad(freqs, seconds, cutoff=900, voices=5, detune=0.009, attack=2.5, release=3.0, formant=False):
    """Supersaw pad (detuned voices), filtered; optional vocal formants ('aah')."""
    n = int(seconds * SR)
    t = tvec(n)
    L = np.zeros(n)
    R = np.zeros(n)
    for f in freqs:
        for v in range(voices):
            d = 1 + detune * (v - (voices - 1) / 2) / ((voices - 1) / 2 or 1)
            ph = rng.uniform(0, 1)
            saw = 2 * ((f * d * t + ph) % 1) - 1
            (L if v % 2 == 0 else R)[:] += saw
            (R if v % 2 == 0 else L)[:] += saw * 0.6
    x = np.stack([L, R])
    if formant:
        x = np.stack([bp(c, 650, 800) * 1.0 + bp(c, 1050, 1250) * 0.6 + bp(c, 2500, 2800) * 0.25 for c in x])
    else:
        x = np.stack([lp(c, cutoff, 4) for c in x])
    e = np.minimum(np.clip(t / attack, 0, 1), np.clip((seconds - t) / release, 0, 1)) ** 1.6
    x = norm(x * e)
    return pb(x, Pedalboard([LowpassFilter(cutoff * 3 if not formant else 5200), Chorus(rate_hz=0.25, depth=0.4, centre_delay_ms=9, mix=0.5), Reverb(room_size=0.9, damping=0.7, wet_level=0.4, dry_level=0.7, width=1)]))


def wind(seconds, seed=3):
    n = int(seconds * SR)
    r = np.random.default_rng(seed)
    lfo = signal.sosfilt(signal.butter(1, 0.35, "lp", fs=SR, output="sos"), r.standard_normal(n))
    lfo = 0.45 + 0.55 * norm(lfo) ** 2
    fc = 300 + 500 * norm(signal.sosfilt(signal.butter(1, 0.2, "lp", fs=SR, output="sos"), r.standard_normal(n))) ** 2
    x = sweep_bp(pink(n), fc, q=1.6) * lfo
    st = np.stack([x, np.roll(x, 1300)])
    return norm(st)


def drip(freq=900):
    n = int(0.25 * SR)
    t = tvec(n)
    f = freq * (1 + 1.4 * np.clip(t / 0.03, 0, 1))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
    return x


# ---------------------------------------------------------------- arrangement
mix = Mix()
t = tvec(N)

# 1. Atmosphere — sub rumble + open-fifth pad, breathing with the story.
rumble = lp(brown(N), 70, 4)
rumble = norm(rumble) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 11) ** 2)
mix.add("bed", 0, stereo(rumble), -17)
bed_pad = pad([D2, D2 * 1.5, D2 * 2, D2 * 3], DUR, cutoff=700, attack=1.2, release=3.5)
curve = np.interp(t, [0, 4, secs(T["sky"]), secs(SKY_END), secs(T["cent"]), secs(FILL1), secs(T["scholar"]), secs(T["outro"]), DUR],
                  [0.75, 0.55, 0.4, 0.15, 0.55, 0.85, 0.5, 0.6, 0.0])
mix.add("bed", 0, bed_pad[:, :N] * curve, -21)

# 2. HOOK — "300" hits on frame 0; "+9" arrives on a reverse swell into a bigger hit.
mix.add("impact", 0, impact(1.0, 0.9), -5)
mix.add("detail", secs(4), sparkle(1.4, -0.7, 0.4, density=40, seed=11), -15)
mix.add("fx", secs(24) - 0.75, reverse_swell(0.75, 1.2), -9)
mix.add("impact", secs(24), impact(1.15, 1.2), -4)
mix.add("tonal", secs(24), stereo(bell(D2 * 8, 5.0) * 0.6 + bell(D2 * 12, 5.0) * 0.4, 0.35), -17)
mix.add("detail", secs(34), sparkle(1.4, 0.0, 0.8, density=45, seed=12), -15)
mix.add("fx", secs(54), whoosh(0.9, 0.5, -0.4, 400, 2600, 0.5), -19)  # question appears
mix.add("bed", secs(80), pad([D2 * 2, D2 * 3, D2 * 4.5], 5.5, cutoff=1400), -24)

# 3. VERSE — card rises; the two numbers are swept with light.
mix.add("fx", secs(T["verse"] - 10), whoosh(1.3, -0.6, 0.6, 220, 2400, 0.62), -14)
mix.add("bed", secs(T["verse"] + 20), pad([D2 * 2, D2 * 3, D2 * 4, D2 * 6], 8.5, cutoff=1100, attack=2.0), -24)
mix.add("tonal", secs(T["verse"] + 104), stereo(bell(PENTA[0], 4.5) * 0.7 + bell(PENTA[3], 4.5) * 0.4, -0.2), -19)
mix.add("detail", secs(T["verse"] + 110), sparkle(2.0, -0.6, 0.6, density=50, seed=21), -14)

# 4. SKY — inside the cave (wind, drips), then the camera rushes out into open air.
cave_len = secs(SKY_END - T["sky"]) + 1.5
w = wind(cave_len)
w *= np.interp(tvec(w.shape[1]), [0, 0.8, cave_len - 2.2, cave_len - 0.6, cave_len], [0, 1, 1.4, 2.2, 0])
mix.add("bed", secs(T["sky"]) - 0.4, convolve(w, CAVE, wet=0.3), -17)
for k, (fr, f) in enumerate([(T["sky"] + 16, 980), (T["sky"] + 58, 760), (T["sky"] + 92, 1120)]):
    mix.add("detail", secs(fr), convolve(stereo(drip(f), [-0.4, 0.3, -0.1][k]), CAVE, wet=0.6), -16)
mix.add("fx", secs(T["sky"] - 12), whoosh(1.4, 0.5, -0.5, 180, 1600, 0.6), -16)
mix.add("fx", secs(T["sky"] + 40), riser(secs(SKY_END - T["sky"] - 40), top=0.8), -16)
mix.add("fx", secs(SKY_END - 34), whoosh(2.2, -0.2, 0.2, 120, 5200, 0.55, tone=True), -9)  # the push-through
mix.add("tonal", secs(SKY_END - 6), pad([D2 * 4, D2 * 6, D2 * 9, D2 * 12], 7.0, formant=True, attack=0.6, release=4), -17)  # open sky "aah"
mix.add("detail", secs(SKY_END - 4), sparkle(2.6, -0.9, 0.9, density=60, seed=31), -14)

# 5. TWO YEARS — orbits hum, moon completes (bell), the 11-day gap holds, sun completes.
orb = np.zeros((2, int(secs(300) * SR)))
ot = tvec(orb.shape[1])
gold = np.sin(2 * np.pi * D2 * 2 * ot) + 0.3 * np.sin(2 * np.pi * D2 * 4.01 * ot)
silver = np.sin(2 * np.pi * D2 * 3 * ot) + 0.3 * np.sin(2 * np.pi * D2 * 6.02 * ot)
oe = np.interp(ot, [0, 1.2, 2.2, 9.2, 10.0], [0, 0, 1, 1, 0])
orb += stereo(gold * oe, -0.55) + stereo(silver * oe * (1 + 0.15 * np.sin(2 * np.pi * 0.7 * ot)), 0.55)
mix.add("tonal", secs(T["years"]), pb(orb, Pedalboard([Chorus(rate_hz=0.2, depth=0.5, mix=0.6), Reverb(room_size=0.85, wet_level=0.4)])), -27)
mix.add("fx", secs(T["years"] - 12), whoosh(1.3, -0.4, 0.5, 260, 2800, 0.6), -15)
mix.add("tonal", secs(MOON_DONE), convolve(stereo(bell(PENTA[4], 5.0) + 0.5 * bell(PENTA[7], 5.0), 0.55), HALL, 0.4), -14)
mix.add("detail", secs(MOON_DONE + 2), sparkle(1.0, 0.4, 0.8, density=30, seed=41), -18)
mix.add("tonal", secs(MOON_DONE + 6), stereo(np.sin(2 * np.pi * PENTA[0] * tvec(int(1.4 * SR))) * np.exp(-tvec(int(1.4 * SR)) * 1.5), -0.55), -24)  # "11 days left"
mix.add("tonal", secs(SUN_DONE), convolve(stereo(bell(PENTA[0], 5.0) + 0.5 * bell(PENTA[3], 5.0), -0.55), HALL, 0.4), -14)

# 6. CENTURIES — tension riser across the fill, clock ticks, nine ascending notes, the +9 hit.
mix.add("fx", secs(T["cent"] - 12), whoosh(1.2, 0.5, -0.5, 240, 2600, 0.6), -15)
mix.add("fx", secs(FILL0), riser(secs(FILL1 - FILL0)), -13)


def bez(x1, y1, x2, y2):
    def f(tt):
        u = tt
        for _ in range(14):
            x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u**2 * x2 + u**3 - tt
            dx = 3 * (1 - u) ** 2 * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u**2 * (1 - x2)
            if abs(dx) < 1e-9:
                break
            u = min(1, max(0, u - x / dx))
        return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u**2 * y2 + u**3
    return f


ease = bez(0.65, 0, 0.35, 1)
SOLAR, LUNAR = 365.2422, 12 * 29.530589
span = 300 * SOLAR
ps = pm = 0
tk = tick(1.0)
tk2 = tick(0.82)
extra = 0
for fr in range(FILL0, FILL1 + 1):
    d = span * ease((fr - FILL0) / (FILL1 - FILL0))
    s = min(300, int(d / SOLAR + 1e-9))
    m = min(309, int(d / LUNAR + 1e-9))
    if s // 10 > ps // 10:
        mix.add("detail", secs(fr), stereo(tk if (s // 10) % 2 else tk2, -0.35), -21)
    if m > 300 and m > pm:
        mix.add("tonal", secs(fr), convolve(stereo(plink(PENTA[min(extra, 8)]), 0.45), HALL, 0.35), -15)
        extra += 1
    ps, pm = s, m
mix.add("fx", secs(FILL1) - 0.6, reverse_swell(0.6, 1.3), -8)
mix.add("impact", secs(FILL1 + 2), impact(1.25, 1.3), -3)
mix.add("tonal", secs(FILL1 + 2), pad([D2 * 2, D2 * 3, D2 * 4, D2 * 5.04, D2 * 6], 9.0, formant=True, attack=0.25, release=5), -16)
mix.add("detail", secs(FILL1 + 4), sparkle(2.2, -0.2, 0.9, density=70, seed=51), -13)

# 7. SCHOLAR / NEXT VERSE — quieter, reverent; soft transitions, single bells on key lines.
mix.add("fx", secs(T["scholar"] - 12), whoosh(1.5, -0.5, 0.4, 200, 1800, 0.6, tone=False), -17)
mix.add("tonal", secs(T["scholar"] + 44), convolve(stereo(bell(PENTA[0] / 2, 6.0), 0), HALL, 0.45), -21)
mix.add("bed", secs(T["scholar"]), pad([D2, D2 * 1.5, D2 * 2.0, D2 * 2.52], 9.5, cutoff=800, attack=2.0), -24)
mix.add("fx", secs(T["next"] - 12), whoosh(1.5, 0.4, -0.4, 200, 1800, 0.6, tone=False), -17)
mix.add("tonal", secs(T["next"] + 14), pad([D2 * 2, D2 * 3, D2 * 4], 6.5, formant=True, attack=1.5, release=3), -21)
mix.add("detail", secs(T["next"] + 14), sparkle(1.6, 0.7, -0.7, density=30, seed=61), -19)  # Arabic reveals right-to-left

# 8. OUTRO — sun and moon converge (swell), bloom hit, rays, long decay into silence.
mix.add("fx", secs(T["outro"] - 12), whoosh(1.4, -0.3, 0.3, 200, 2200, 0.6), -16)
mix.add("fx", secs(T["outro"] + 4), riser(secs(MERGE - T["outro"] - 4), top=0.5), -16)
mix.add("fx", secs(MERGE) - 1.0, reverse_swell(1.0, 1.0), -8)
mix.add("impact", secs(MERGE), impact(1.0, 0.8), -5)
mix.add("tonal", secs(MERGE), pad([D2 * 2, D2 * 3, D2 * 4, D2 * 5.04, D2 * 6, D2 * 9], secs(TOTAL_FRAMES - MERGE) + 0.5, formant=True, attack=0.4, release=2.6), -14)
mix.add("tonal", secs(MERGE), convolve(stereo(bell(PENTA[0], 6) * 0.7 + bell(PENTA[3], 6) * 0.5 + bell(PENTA[5], 6) * 0.3, 0), HALL, 0.45), -14)
mix.add("detail", secs(MERGE + 4), sparkle(3.5, -0.9, 0.9, density=40, seed=71), -15)

# ---------------------------------------------------------------- master
stems = mix.stems
bus = stems["bed"] + stems["fx"] + stems["impact"] + stems["tonal"] + stems["detail"]
bus = bus[:, :N]
fade = np.clip((DUR - t) / 1.6, 0, 1) ** 1.5
bus *= fade
master = Pedalboard([
    HighpassFilter(28),
    LowpassFilter(17500),
    HighShelfFilter(cutoff_frequency_hz=8000, gain_db=-3.0),
    Compressor(threshold_db=-20, ratio=2.2, attack_ms=20, release_ms=250),
])
bus = pb(bus, master)
meter = pyloudnorm.Meter(SR)
TARGET, CEIL = -14.0, -1.5
pre = bus.copy()
gain = TARGET - meter.integrated_loudness(pre.T)
for _ in range(6):
    # JUCE-style limiter applies make-up gain (output ceiling 0 dBFS): pull back to the ceiling,
    # then correct the input gain from the measured result until the target is met.
    bus = pb(pre * db(gain), Pedalboard([Limiter(threshold_db=-3.0, release_ms=140)])) * db(CEIL)
    err = TARGET - meter.integrated_loudness(bus.T)
    if abs(err) < 0.1:
        break
    gain += err
final = meter.integrated_loudness(bus.T)
peak = 20 * np.log10(np.max(np.abs(bus)) + 1e-12)

pcm = (np.clip(bus.T, -1, 1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as wv:
    wv.setnchannels(2)
    wv.setsampwidth(2)
    wv.setframerate(SR)
    wv.writeframes(pcm.tobytes())
print(f"wrote {sys.argv[1]}  {DUR:.2f}s  integrated {final:.1f} LUFS  sample peak {peak:.1f} dBFS")
