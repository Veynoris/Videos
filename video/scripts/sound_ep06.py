"""Quran Decoding EP06 (One Seed, al-Baqarah 2:261) — halal sound design.

Same policy as earlier episodes (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Air, earth, sand and rustle only: the seed falls, roots spread, stalks rise, ears unfold,
grains patter in, and wind moves across the field. It opens on a soft hit and fades out so the reel loops.
Usage: python3 scripts/sound_ep06.py out/ep06_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
T = {k: v for k, v in json.load(open(os.path.join(HERE, "..", "src", "ep06", "timeline.json"))).items() if not k.startswith("_")}
END = T["close"][1]
N = int(END / FPS * SR)
dur = END / FPS
mix = Mix(N)
t = tvec(N)

room = norm(lp(brown(N), 110, 4))
mix.add(0, np.stack([room, np.roll(room, 2400)]) * np.interp(t, [0, 1, dur - 2.5, dur - 0.6], [0.7, 0.8, 0.6, 0]), -30)
field_wind = np.interp(t, [0, secs(T["pullback"][0]), secs(T["field"][0] + 60), secs(T["fadeOut"][0]), secs(T["camBack"][1]), dur], [0.35, 0.45, 1, 0.9, 0.3, 0])
mix.add(0, wind(dur, seed=61, lo=220, hi=900) * field_wind, -30)

# Hook — soft hit on frame 0; the seed hangs in the light.
mix.add(0, thud(0.8, 2.2, 0.3), -18)
mix.add(secs(18), swell(1.4, 240, 1500, 0.3), -29)

# Verse — "Those who spend…", then "…like a seed".
V = T["verse"][0]
mix.add(secs(V - 6), whoosh(1.0, -0.4, 0.4, 260, 2000), -27)
mix.add(secs(V + 120), swell(1.2, 300, 1800, 0.35), -27)

# The seed falls into the earth; roots spread.
a, b = T["seedFall"]
mix.add(secs(a), whoosh(secs(b - a) + 0.2, 0.0, 0.0, 300, 1400, 0.85), -25)
mix.add(secs(b), thud(1.0, 2.6, 0.3), -15)
mix.add(secs(b), sand(1.4, -0.3, 0.3, density=380, seed=600), -28)
r0, r1 = T["roots"]
mix.add(secs(r0), sand(secs(r1 - r0), -0.5, 0.5, density=160, seed=601, bright=0.6), -31)

# Stalks rise and fan out.
s0 = T["sprout"][0]
mix.add(secs(s0), noise_riser(secs(T["stalk"][1] - s0), 0.5), -30)
mix.add(secs(T["stalk"][0]), swell(2.4, 160, 1200, 0.6), -27)

# Seven ears unfold, one by one.
e0, step = T["ears"]
for k in range(7):
    mix.add(secs(e0 + k * step), paper(0.7, -0.6 + k * 0.2), -27)
    mix.add(secs(e0 + k * step + 4), pebble(-0.6 + k * 0.2, seed=610 + k), -33)

# Grains: a patter that accelerates as the count runs to 700.
g0, gd = T["grains"]
mix.add(secs(g0), ratchet(secs(gd), 6, 60, -0.5, 0.5, seed=620), -31)
mix.add(secs(g0), sand(secs(gd), -0.6, 0.6, density=520, seed=621, bright=1.2), -29)
mix.add(secs(g0 + gd) - 0.6, reverse_swell(0.6), -23)
mix.add(secs(g0 + gd), thud(0.8, 2.4, 0.34), -18)

# "And Allah multiplies" — the camera pulls back over a field.
M = T["multiply"][0]
mix.add(secs(M + 14), swell(1.6, 200, 1300, 0.4), -26)
mix.add(secs(T["pullback"][0]), whoosh(2.6, -0.3, 0.3, 160, 1500, 0.4), -23)
f0, fd = T["field"]
mix.add(secs(f0), sand(secs(fd), -0.8, 0.8, density=300, seed=630), -30)
mix.add(secs(f0 + 40), air_ring(2.0, -0.6, 0.6), -29)
mix.add(secs(M + 168), thud(0.6, 2.0, 0.3), -22)                          # the hadith

# Wealth — "Charity never decreased wealth."
W = T["wealth"][0]
mix.add(secs(W - 6), whoosh(1.0, 0.4, -0.4, 260, 2000), -27)
mix.add(secs(W + 46) - 0.7, reverse_swell(0.7), -22)
mix.add(secs(W + 50), thud(1.0, 2.8, 0.36), -16)

# Close — the question; the field settles; back to the seed.
C0 = T["close"][0]
mix.add(secs(C0 + 10), swell(1.4, 220, 1400, 0.35), -28)
mix.add(secs(T["camBack"][0]), swell(1.6, 160, 900, 0.6), -29)

master(mix, N, sys.argv[1])
