"""Synthesise the episode's sound design (no music, no recitation).

Every cue is derived from the same frame timings as the Remotion timeline
(src/Episode.tsx T, src/scenes/Calendars.tsx), so sound and motion stay locked.
Usage: python3 scripts/sound.py out.wav
"""
import sys, wave
import numpy as np

SR = 48000
FPS = 30
TOTAL_FRAMES = 1960
N = int(TOTAL_FRAMES / FPS * SR)
rng = np.random.default_rng(7)

SOLAR, LUNAR = 365.2422, 12 * 29.530589
SPAN = 300 * SOLAR


def bezier(x1, y1, x2, y2):
    def f(t):
        # solve x(u) = t by Newton, return y(u)
        u = t
        for _ in range(12):
            x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3 - t
            dx = 3 * (1 - u) ** 2 * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u ** 2 * (1 - x2)
            if abs(dx) < 1e-9:
                break
            u = min(1, max(0, u - x / dx))
        return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3
    return f

ease_in_out = bezier(0.65, 0, 0.35, 1)


def at(frame):
    return int(frame / FPS * SR)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def add(buf, start, sig, gain):
    s = at(start)
    e = min(len(buf), s + len(sig))
    buf[s:e] += sig[: e - s] * gain


L = np.zeros(N)
R = np.zeros(N)

# Bed: low, slowly breathing drone with a hint of air.
t = np.arange(N) / SR
drone = (np.sin(2 * np.pi * 55 * t) * 0.5 + np.sin(2 * np.pi * 82.41 * t) * 0.3 + np.sin(2 * np.pi * 110 * t) * 0.12)
drone *= 0.65 + 0.35 * np.sin(2 * np.pi * t / 9.0) ** 2
air = lowpass(rng.standard_normal(N) * 0.5, 500)
bed = (drone * 0.05 + air * 0.035)
fade = np.clip(t / 2.5, 0, 1) * np.clip((TOTAL_FRAMES / FPS - t) / 2.5, 0, 1)
L += bed * fade
R += bed * fade


def whoosh(dur=1.1):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    env = np.sin(np.linspace(0, np.pi, n)) ** 2.2
    sweep = lowpass(noise, 1800) - lowpass(noise, 250)
    return sweep * env


def chime(freq, dur=2.6):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    env = np.exp(-tt * 2.4) * np.clip(tt / 0.006, 0, 1)
    return (np.sin(2 * np.pi * freq * tt) + 0.35 * np.sin(2 * np.pi * freq * 2.01 * tt) + 0.12 * np.sin(2 * np.pi * freq * 3.02 * tt)) * env


def tick(freq, dur=0.09):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 70)


def boom(dur=2.4):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = 62 - 22 * np.clip(tt / dur, 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 1.8) * np.clip(tt / 0.01, 0, 1)


# Transitions between beats (Episode.tsx T.*[0]).
for fr in (134, 384, 520, 804, 1340, 1596, 1772):
    w = whoosh()
    add(L, fr - 10, w, 0.10)
    add(R, fr - 8, w, 0.10)

# "309" lands; "+9" lands.
for fr, g in ((0, 0.22), (22, 0.34), (804 + 48 + 246 + 4, 0.28), (1772 + 74, 0.2)):
    b = boom()
    add(L, fr, b, g)
    add(R, fr, b, g)

# Camera pushes out of the cave mouth (Sky scene 384-540): a long rising swell.
sw = whoosh(3.2)
add(L, 440, sw, 0.16); add(R, 444, sw, 0.16)

# Orbits: moon completes (scene 560 + MOON_DONE 196), sun completes (+ SUN_DONE 260).
add(L, 520 + 196, chime(1046.5), 0.06); add(R, 520 + 196, chime(1046.5), 0.08)
add(L, 520 + 260, chime(784.0), 0.08); add(R, 520 + 260, chime(784.0), 0.06)

# Year grids fill (Calendars.tsx FILL_START 48, FILL_DUR 246, scene at 848).
f0, f1 = 804 + 48, 804 + 48 + 246
prev_s = prev_m = 0
for fr in range(f0, f1 + 1):
    d = SPAN * ease_in_out((fr - f0) / (f1 - f0))
    s = min(300, int(d / SOLAR + 1e-9))
    m = min(309, int(d / LUNAR + 1e-9))
    if s // 10 > prev_s // 10:
        add(L, fr, tick(1400), 0.05); add(R, fr, tick(1400), 0.035)
    if m > 300 and m > prev_m:
        add(L, fr, tick(2100, 0.14), 0.05); add(R, fr, tick(2100, 0.14), 0.08)
    prev_s, prev_m = s, m

# Outro: the two dots meet.
add(L, 1772 + 74, chime(523.25, 4.0), 0.07); add(R, 1772 + 74, chime(659.25, 4.0), 0.06)

mix = np.stack([L, R], axis=1)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.7  # leave headroom; final loudness set in ffmpeg
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], f"{N / SR:.2f}s")
