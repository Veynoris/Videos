"""Quran Decoding EP04 (Hearing, Seeing — al-Samīʿ al-Baṣīr) — halal sound design.

Same policy as earlier episodes (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Built for a looping short: it opens on a soft hit at frame 0 and settles to near-silence at the end.
Usage: python3 scripts/sound_ep04.py out/ep04_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
T = {k: v for k, v in json.load(open(os.path.join(HERE, "..", "src", "ep04", "timeline.json"))).items() if not k.startswith("_")}
END = T["close"][1]
N = int(END / FPS * SR)
mix = Mix(N)
H, E, M, A, S, CL = (T[k][0] for k in ("hook", "except", "mirror", "allah", "story", "close"))

t = tvec(N)
room = norm(lp(brown(N), 110, 4))
mix.add(0, np.stack([room, np.roll(room, 2400)]) * np.interp(t, [0, 1, END / FPS - 2.5, END / FPS - 0.6], [0.7, 0.8, 0.6, 0]), -30)
mix.add(0, wind(END / FPS, seed=41, lo=180, hi=480) * np.interp(tvec(int(END / FPS * SR)), [0, 1, END / FPS - 2.5, END / FPS - 0.6], [0.6, 1, 0.7, 0]), -33)

# Hook — the wall is already there; a soft hit, then the tiles settle one by one.
mix.add(secs(H), thud(0.8, 2.2, 0.3), -17)
mix.add(secs(H), swell(1.8, 200, 1300, 0.25), -26)
for i in range(12):
    mix.add(secs(H + 2 + i * 3), pebble(-0.6 + (i % 3) * 0.6, seed=300 + i), -31)
mix.add(secs(H + 24), whoosh(0.8, -0.4, 0.4, 300, 2000), -28)              # "Hearing first — every time…"

# Except — the wall dims; one tile lifts; "…once."
mix.add(secs(E + 10), swell(1.6, 160, 900, 0.6), -26)
mix.add(secs(E + 30) - 0.6, reverse_swell(0.6), -21)
mix.add(secs(E + 32), thud(1.0, 2.6, 0.32), -15)
mix.add(secs(E + 34), air_ring(1.2, 0.3, -0.3), -31)

# Mirror — four words land; two arcs draw right-to-left.
mix.add(secs(M - 12), whoosh(1.2, 0.5, -0.5, 240, 2200), -23)
for i in range(4):
    mix.add(secs(M + 30 + i * 8), pebble(0.6 - i * 0.4, seed=320 + i), -28)
mix.add(secs(M + 104), whoosh(0.8, 0.3, -0.3, 300, 1900), -29)               # "It mirrors…"
mix.add(secs(M + 150), swell(1.2, 600, 2600, 0.5, 0.0) * np.linspace(1, 1, 1), -27)
mix.add(secs(M + 150), sand(1.2, 0.7, -0.2, density=320, seed=50), -29)        # blind -> seeing arc
mix.add(secs(M + 176), sand(1.2, 0.3, -0.8, density=320, seed=51), -29)        # deaf -> hearing arc
mix.add(secs(M + 196), thud(0.5, 1.6, 0.3), -23)

# Allah — the ten tiles return.
mix.add(secs(A - 12), whoosh(1.2, -0.5, 0.5, 240, 2200), -23)
for i in range(12):
    mix.add(secs(A + 8 + i * 3), pebble(-0.6 + (i % 3) * 0.6, seed=340 + i), -32)
mix.add(secs(A + 60), thud(0.7, 2.0, 0.3), -19)                               # "10 times. Hearing first."

# Story — the card; three quiet lines; then "Allah did."
mix.add(secs(S - 12), whoosh(1.4, 0.4, -0.4, 200, 1800), -23)
mix.add(secs(S + 6), paper(1.0, 0.0), -27)
mix.add(secs(S + 20), swell(3.0, 140, 700, 0.4), -30)
for fr in (132, 176):
    mix.add(secs(S + fr), swell(0.9, 300, 1400, 0.3), -31)
mix.add(secs(S + 266) - 0.9, reverse_swell(0.9), -20)
mix.add(secs(S + 266), thud(1.1, 3.0, 0.38), -13)                             # "Allah did."
mix.add(secs(S + 268), air_ring(1.6, -0.5, 0.5), -30)
mix.add(secs(S + 276), sand(2.0, -0.6, 0.6, density=300, seed=60), -28)

# Close — 20:46, then a long breath back into the opening wall; the tail fades to silence for the loop.
mix.add(secs(CL - 10), whoosh(1.4, -0.3, 0.3, 200, 1900), -24)
mix.add(secs(CL + 14), thud(0.7, 2.4, 0.36), -19)
mix.add(secs(CL + 60), sand(1.6, 0.5, -0.5, density=260, seed=61), -29)
dur = T["close"][1] - CL
mix.add(secs(CL + dur - 50), swell(1.5, 160, 900, 0.7), -27)

master(mix, N, sys.argv[1])
