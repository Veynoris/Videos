"""Quran Decoding EP01 — halal sound design (v3), synthesised and mastered offline.

Policy: no music, no musical instruments, no bells or chimes, no melodies or tonal
pads, and no Qur'an recitation used as an effect. Many scholars hold that musical
instruments are impermissible, and Sahih Muslim 2114 says: "The bell is the flute
of Shaytan." So every layer here is built from non-musical, natural sources:
air, wind, breath-like swells, stone and earth thuds, sand, pebbles, water drops,
paper and a mechanical clock tick.

Processing: NumPy/SciPy synthesis + Spotify Pedalboard (filters, reverb, dynamics)
and synthetic convolution spaces (hall, cave). Cue times come from
src/timeline.json plus scene-local frames in src/scenes/*.tsx.

Usage: python3 -I scripts/sound.py out/sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403  (shared halal sound library)

HERE = os.path.dirname(os.path.abspath(__file__))
T = {k: v for k, v in json.load(open(os.path.join(HERE, "..", "src", "timeline.json"))).items() if not k.startswith("_")}
TOTAL_FRAMES = T["outro"][1]
DUR = TOTAL_FRAMES / FPS
N = int(DUR * SR)

# Scene-local anchors (frames) mirrored from the scene components.
H = T["hook"][0]
V = T["verse"][0]
S0, S1 = T["sky"]
Y = T["years"][0]
MOON_DONE, SUN_DONE = Y + 196, Y + 260
C0 = T["cent"][0]
FILL0, FILL1 = C0 + 48, C0 + 48 + 270
SCH = T["scholar"][0]
NX = T["next"][0]
O = T["outro"][0]
MERGE = O + 74


# ---------------------------------------------------------------- arrangement
mix = Mix(N)
t = tvec(N)

# Room tone: earth rumble + faint night air, following the story (cave louder in the sky beat).
room = norm(lp(brown(N), 120, 4)) * 0.8 + norm(bp(pink(N), 1800, 5200)) * 0.05
mood = np.interp(t, [0, 3, secs(V), secs(S0), secs(S0 + 60), secs(S1), secs(C0), secs(FILL1), secs(SCH), secs(O), DUR],
                 [0.8, 0.6, 0.5, 0.8, 1.0, 0.5, 0.6, 0.85, 0.5, 0.6, 0.0])
mix.add(0, np.stack([room, np.roll(room, 2400)]) * mood, -27)

# HOOK — night outside the cave: stars wheel in time-lapse while the years race to 300, then 301…309.
HK_COUNT_END, HK_NINE, HK_STEP = 60, 96, 4      # mirrors Opening.tsx COUNT_END / NINE_START / NINE_STEP
night = wind(secs(T["hook"][1]) + 1, seed=21, lo=160, hi=480)
night *= np.interp(tvec(night.shape[1]), [0, 0.5, 6.0, 7.0], [0.6, 1, 0.8, 0])
mix.add(secs(H), night, -27)                                           # night air outside the cave
mix.add(secs(H + 2), noise_riser(secs(HK_COUNT_END - 2), top=1.0), -19) # time racing
hk_ease = bez(0.65, 0, 0.35, 1)
prev = 0
for fr in range(H + 4, H + HK_COUNT_END + 1):                           # a clock spinning through the years
    yrs = int(300 * hk_ease((fr - H - 4) / (HK_COUNT_END - 4)))
    if yrs // 25 > prev // 25:
        mix.add(secs(fr), stereo(tick(yrs // 25 % 2 == 0), (yrs / 300) * 0.6 - 0.3), -31)
    prev = yrs
mix.add(secs(H + HK_COUNT_END) - 0.5, reverse_swell(0.5), -21)
mix.add(secs(H + HK_COUNT_END), thud(1.0, 2.6, 0.3), -14)              # lands on 300
mix.add(secs(H + 62), whoosh(0.8, -0.4, 0.3, 300, 2000), -28)          # "...and woke up 300 years later."
for k in range(9):                                                     # 301 ... 309, one year at a time
    mix.add(secs(H + HK_NINE + k * HK_STEP), pebble(0.1 + k * 0.07, seed=200 + k), -24)
mix.add(secs(H + 98), swell(1.2, 500, 2400, 0.2, 0.5), -28)            # "...or was it 309?"
mix.add(secs(H + 126), thud(0.6, 1.8, 0.35), -21)                      # "The Qur'an gives both numbers"
mix.add(secs(H + 128), swell(1.8, 140, 900, 0.35), -26)
mix.add(secs(H + 150), sand(1.6, -0.5, 0.5, seed=3), -29)
HE = T["hook"][1]
mix.add(secs(HE - 24), noise_riser(24 / FPS, top=0.6), -23)           # push forward into the light
mix.add(secs(HE - 6), swell(2.2, 120, 1400, 0.12), -23)

# VERSE — the card tilts up; the two phrases are swept with light.
mix.add(secs(V - 12), whoosh(1.3, -0.6, 0.6, 220, 2200), -21)
mix.add(secs(V + 18), swell(1.4, 180, 900, 0.5), -27)
mix.add(secs(V + 24), paper(0.8, -0.1), -29)
mix.add(secs(V + 110), sand(1.0, -0.4, 0.4, seed=4), -27)
mix.add(secs(V + 130), sand(1.0, -0.4, 0.4, seed=5), -28)

# SKY — inside the cave: wind and drips; the camera rushes out into the open night.
cave_len = secs(S1 - S0) + 1.6
w = wind(cave_len)
w *= np.interp(tvec(w.shape[1]), [0, 0.8, cave_len - 2.4, cave_len - 0.6, cave_len], [0, 1, 1.3, 2.0, 0])
mix.add(secs(S0) - 0.4, convolve(w, CAVE, 0.3), -23)
for fr, f0, pan in ((S0 + 16, 980, -0.4), (S0 + 58, 760, 0.3), (S0 + 92, 1120, -0.1)):
    mix.add(secs(fr), convolve(stereo(drip(f0), pan), CAVE, 0.55), -22)
mix.add(secs(S0 + 40), pebble(-0.5, seed=7), -28)
mix.add(secs(S0 - 12), whoosh(1.4, 0.5, -0.5, 180, 1500), -21)
mix.add(secs(S0 + 40), noise_riser(secs(S1 - S0 - 40), top=0.8), -22)
mix.add(secs(S1 - 34), whoosh(2.2, -0.2, 0.2, 110, 4200, 0.55), -16)   # the push-through
mix.add(secs(S1 - 4), swell(3.5, 120, 700, 0.15), -24)                # open night air settles
mix.add(secs(S1 - 2), sand(2.4, -0.9, 0.9, density=260, seed=6, bright=0.8), -29)

# TWO YEARS — orbits turn as soft rotating air; completions are released breaths, not chimes.
mix.add(secs(Y - 12), whoosh(1.3, -0.4, 0.5, 240, 2400), -21)
span = secs(SUN_DONE + 30 - (Y + 36))
mix.add(secs(Y + 36), whirr(span, 0.55, -0.55, 260, 760) * np.interp(tvec(int(span * SR)), [0, 1.2, span - 1.2, span], [0, 1, 1, 0]), -32)
mix.add(secs(Y + 36), whirr(span, 0.6, 0.55, 380, 1100) * np.interp(tvec(int(span * SR)), [0, 1.2, span - 1.2, span], [0, 1, 1, 0]), -32)
mix.add(secs(MOON_DONE), swell(1.0, 500, 2200, 0.12, 0.55), -25)
mix.add(secs(MOON_DONE + 2), sand(0.8, 0.4, 0.8, density=300, seed=8), -29)
mix.add(secs(MOON_DONE + 6), thud(0.4, 1.2, 0.3), -29)                # "11 DAYS LEFT"
mix.add(secs(SUN_DONE), swell(1.2, 260, 1500, 0.12, -0.55), -24)
mix.add(secs(SUN_DONE), thud(0.5, 1.6, 0.3), -26)

# CENTURIES — rising wind, a clock counting decades, nine pebbles for nine extra years, the reveal.
mix.add(secs(C0 - 12), whoosh(1.2, 0.5, -0.5, 240, 2400), -21)
mix.add(secs(FILL0), noise_riser(secs(FILL1 - FILL0)), -21)


ease = bez(0.42, 0, 0.58, 1)  # mirrors fillEase in Calendars.tsx
SOLAR, LUNAR = 365.2422, 12 * 29.530589
ps = pm = 0
extra = 0
tk, tk2 = tick(False), tick(True)
for fr in range(FILL0, FILL1 + 1):
    d = 300 * SOLAR * ease((fr - FILL0) / (FILL1 - FILL0))
    s = min(300, int(d / SOLAR + 1e-9))
    m = min(309, int(d / LUNAR + 1e-9))
    if s // 10 > ps // 10:
        mix.add(secs(fr), stereo(tk if (s // 10) % 2 else tk2, -0.35), -30)
    if m > 300 and m > pm:
        mix.add(secs(fr), pebble(0.35 + extra * 0.05, seed=100 + extra), -23)
        extra += 1
    ps, pm = s, m
for k in (1, 2):                                                       # +3, +6 callouts at each century
    fr = next(i for i in range(FILL0, FILL1 + 1) if 300 * SOLAR * ease((i - FILL0) / (FILL1 - FILL0)) >= k * 100 * SOLAR)
    mix.add(secs(fr), thud(0.45, 1.4, 0.3), -24)
    mix.add(secs(fr), swell(0.8, 600, 2600, 0.15, 0.5), -28)
mix.add(secs(FILL1) - 0.6, reverse_swell(0.6), -20)
mix.add(secs(FILL1 + 2), thud(1.1, 2.8, 0.32), -13)
mix.add(secs(FILL1 + 2), air_ring(1.6, 0.0, 0.7), -26)
mix.add(secs(FILL1 + 20), swell(2.4, 140, 800, 0.3), -26)

# SCHOLAR / NEXT VERSE — quiet and reverent.
mix.add(secs(SCH - 12), whoosh(1.5, -0.5, 0.4, 200, 1700), -23)
mix.add(secs(SCH + 8), reverse_swell(3.0), -22)                        # rewinding 653 years
mix.add(secs(SCH + 8), noise_riser(92 / FPS, top=0.5)[:, ::-1].copy(), -26)
prev = 2026
for fr in range(SCH + 8, SCH + 101):                                    # half-centuries rolling back
    yr = int(2026 - 653 * hk_ease((fr - SCH - 8) / 92))
    if yr // 50 < prev // 50:
        mix.add(secs(fr), stereo(tick(True), -0.2), -31)
    prev = yr
mix.add(secs(SCH + 100), thud(0.7, 2.2, 0.35), -19)                      # arrival: Damascus, 1373
mix.add(secs(SCH + 104), swell(2.4, 140, 600, 0.3), -28)                # a breath in Damascus
mix.add(secs(SCH + 174), paper(1.4, 0.0), -24)                           # the manuscript opens
mix.add(secs(SCH + 196), swell(3.6, 140, 700, 0.4), -29)
mix.add(secs(SCH + 272), swell(0.9, 500, 2200, 0.3), -31)              # gold rule before the translation
mix.add(secs(NX - 12), whoosh(1.5, 0.4, -0.4, 200, 1700), -23)
mix.add(secs(NX + 12), swell(2.6, 160, 900, 0.4), -27)
mix.add(secs(NX + 14), sand(1.8, 0.7, -0.7, density=240, seed=10), -29)    # follows the Arabic, right to left

# OUTRO — sun and moon converge on rising wind; a soft deep thud; the air opens and settles to silence.
mix.add(secs(O - 12), whoosh(1.4, -0.3, 0.3, 200, 2000), -22)
mix.add(secs(O + 4), noise_riser(secs(MERGE - O - 4), top=0.5), -24)
mix.add(secs(MERGE) - 0.9, reverse_swell(0.9), -20)
mix.add(secs(MERGE), thud(1.0, 3.2, 0.38), -15)
mix.add(secs(MERGE), air_ring(1.8, -0.6, 0.6), -27)
tail = secs(TOTAL_FRAMES - MERGE) + 1
ow = wind(tail, seed=11, lo=180, hi=520) * np.interp(tvec(int(tail * SR)), [0, 0.6, tail - 2.2, tail], [0, 1, 0.8, 0])
mix.add(secs(MERGE), ow, -27)
mix.add(secs(MERGE + 6), sand(3.2, -0.9, 0.9, density=180, seed=12, bright=0.8), -30)

master(mix, N, sys.argv[1])
