"""Quran Decoding EP05 (Three Shirts, Sūrat Yūsuf) — halal sound design.

Same policy as earlier episodes (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Cloth rustle, a brass loupe's ratchet, a seal press (latch + thud), wind and sand for the scent.
It opens on a soft hit and settles to near-silence so the reel loops.
Usage: python3 scripts/sound_ep05.py out/ep05_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
J = json.load(open(os.path.join(HERE, "..", "src", "ep05", "timeline.json")))
Q = J["cue"]
H, E1, E2, E3, CL = (J[k][0] for k in ("hook", "ex1", "ex2", "ex3", "close"))
END = J["close"][1]
N = int(END / FPS * SR)
dur = END / FPS
mix = Mix(N)
t = tvec(N)

room = norm(lp(brown(N), 110, 4))
mix.add(0, np.stack([room, np.roll(room, 2400)]) * np.interp(t, [0, 1, dur - 2.5, dur - 0.6], [0.7, 0.8, 0.6, 0]), -30)
mix.add(0, wind(dur, seed=51, lo=180, hi=520) * np.interp(t, [0, 1, dur - 2.5, dur - 0.6], [0.6, 1, 0.7, 0]), -34)


def seal(fr, pan=0.0, seed=0):
    mix.add(secs(fr) - 0.55, reverse_swell(0.55), -24)
    mix.add(secs(fr), clack(1.3, pan, seed=seed), -16)
    mix.add(secs(fr), thud(1.0, 2.6, 0.32), -15)
    mix.add(secs(fr + 2), air_ring(1.3, -0.3, 0.3), -31)


def loupe(a, b, seed):
    mix.add(secs(a - 10), whoosh(0.9, 0.5, -0.2, 300, 2200), -27)
    mix.add(secs(a), ratchet(secs(b - a), 8, 14, -0.3, 0.3, seed=seed), -32)


# Hook — soft hit on frame 0, the word settles; three shirts unfold.
mix.add(0, thud(0.8, 2.2, 0.3), -18)
mix.add(secs(18), swell(1.4, 220, 1400, 0.3), -29)
for i in range(3):
    mix.add(secs(H + Q["hookTunics"] + i * 6), paper(0.8, -0.5 + i * 0.5), -27)
mix.add(secs(H + Q["hookTunics"] + 30), whoosh(0.8, -0.3, 0.3, 300, 1900), -29)

# Exhibit I — the stain spreads; the loupe; FALSE.
mix.add(secs(E1 - 8), whoosh(1.2, -0.5, 0.5, 220, 2000), -24)
mix.add(secs(E1 + 4), paper(1.1, 0.0), -25)
mix.add(secs(E1 + Q["ex1Stain"]), swell(1.8, 120, 500, 0.3), -29)
mix.add(secs(E1 + 118), pebble(0.0, seed=501), -30)
loupe(E1 + Q["ex1Loupe"][0], E1 + Q["ex1Loupe"][1], 510)
mix.add(secs(E1 + 282), thud(0.5, 1.6, 0.3), -24)                 # "The shirt was not torn."
seal(E1 + Q["ex1Seal"], seed=520)

# Exhibit II — a second shirt; the test; the tear; TRUTHFUL.
mix.add(secs(E2 - 8), whoosh(1.2, 0.5, -0.5, 220, 2000), -24)
mix.add(secs(E2 + 4), paper(1.1, 0.0), -25)
mix.add(secs(E2 + 98), sand(1.0, -0.6, 0.6, density=300, seed=530), -30)  # raced to the door
mix.add(secs(E2 + Q["ex2Panels"] - 10), paper(0.9, -0.5), -27)
mix.add(secs(E2 + Q["ex2Panels"] - 4), paper(0.9, 0.5), -27)
loupe(E2 + Q["ex2Loupe"][0], E2 + Q["ex2Loupe"][1], 540)
rip = int(1.3 * SR)
tear = bp(white(rip), 700, 4200) * (0.4 + 0.6 * np.abs(np.sin(np.linspace(0, 40, rip)))) * np.sin(np.linspace(0, np.pi, rip)) ** 0.5
mix.add(secs(E2 + Q["ex2Loupe"][0] + 14), stereo(norm(tear), 0.3), -26)          # the tear revealed
seal(E2 + Q["ex2Seal"], pan=0.3, seed=550)

# Exhibit III — the shirt; the scent on the wind; the haze clears; SEEING.
mix.add(secs(E3 - 8), whoosh(1.2, -0.5, 0.5, 220, 2000), -24)
mix.add(secs(E3 + 96), paper(1.0, 0.0), -26)
s0, s1 = Q["ex3Scent"]
mix.add(secs(E3 + s0), wind(secs(s1 - s0) + 1, seed=561, lo=300, hi=1100) * np.sin(np.linspace(0, np.pi, int((secs(s1 - s0) + 1) * SR))) ** 0.7, -24)
mix.add(secs(E3 + s0), sand(secs(s1 - s0), -0.5, 0.5, density=260, seed=562, bright=1.2), -30)
h0, h1 = Q["ex3Haze"]
mix.add(secs(E3 + h0), noise_riser(secs(h1 - h0), 0.6), -28)
mix.add(secs(E3 + h1 - 10), swell(1.6, 400, 2600, 0.25), -25)                   # sight returns
seal(E3 + Q["ex3Seal"], seed=570)

# Close — three verdicts; «فصبر جميل»; back to the word.
mix.add(secs(CL - 8), whoosh(1.2, 0.4, -0.4, 220, 1900), -25)
for i in range(3):
    mix.add(secs(CL + Q["closeSeals"] + i * 6), pebble(-0.5 + i * 0.5, seed=580 + i), -29)
mix.add(secs(CL + Q["closeArabic"]) - 0.8, reverse_swell(0.8), -22)
mix.add(secs(CL + Q["closeArabic"] + 6), thud(0.9, 2.8, 0.36), -17)
mix.add(secs(CL + Q["closeLoop"]), swell(1.5, 160, 900, 0.7), -28)

master(mix, N, sys.argv[1])
