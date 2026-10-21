"""Quran Decoding EP08 (The Darknesses, al-Anbiyāʾ 21:87–88) — halal sound design.

Same policy as earlier episodes (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Sea and air only: the surface at night (wind, swell), a plunge, the muffled deep, three darknesses closing
(low thuds), his call (air rings lifting each darkness), the rise and break of the surface at dawn.
It opens in the deep and ends back in the deep so the reel loops.
Usage: python3 scripts/sound_ep08.py out/ep08_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
J = json.load(open(os.path.join(HERE, "..", "src", "ep08", "timeline.json")))
Q = J["cue"]
H, FA, DK, DU, AN, CL = (J[k][0] for k in ("hook", "fall", "dark", "dua", "answer", "close"))
END = J["close"][1]
N = int(END / FPS * SR)
dur = END / FPS
mix = Mix(N)
t = tvec(N)

swallow = FA + Q["swallow"]
rise0, rise1 = AN + Q["rise"][0], AN + Q["rise"][1]
down = CL + Q["down"]

# Two beds: the surface (wind + surf) and the deep (muffled low pressure), crossfaded with the camera.
surf_env = np.interp(t, [0, secs(150), secs(180), secs(swallow), secs(swallow + 40), secs(rise1 - 10), secs(rise1 + 10), secs(down), secs(down + 40), dur], [0, 0, 1, 1, 0, 0, 1, 1, 0, 0])
deep_env = 1 - surf_env
surf = wind(dur, seed=81, lo=300, hi=1400) * 0.7 + np.stack([lp(brown(N), 400, 2)] * 2) * 0.5
mix.add(0, surf * surf_env * np.interp(t, [0, dur - 0.6, dur], [1, 1, 0]), -27)
deep = np.stack([lp(brown(N), 120, 4), np.roll(lp(brown(N), 120, 4), 3000)])
mix.add(0, norm(deep) * deep_env * np.interp(t, [0, dur - 0.6, dur], [1, 1, 0]), -24)

# Hook — in the deep; his call written in light; "one sentence got him out" (a ring of light).
mix.add(0, thud(0.8, 2.4, 0.35), -18)
mix.add(secs(Q["hookDua"]), sand(1.5, 0.6, -0.6, density=240, seed=800, bright=1.5), -30)
mix.add(secs(Q["hookOut"]) - 0.6, reverse_swell(0.6), -22)
mix.add(secs(Q["hookOut"]), air_ring(1.6, -0.3, 0.3), -23)
mix.add(secs(150), whoosh(1.0, 0.0, 0.0, 200, 1400, 0.4), -28)   # cut to the surface

# The fall — four lines, then the plunge.
for i, fr in enumerate(Q["lines"]):
    mix.add(secs(FA + fr), swell(1.0, 280, 1500, 0.3, -0.3 + i * 0.2), -30)
mix.add(secs(swallow) - 0.5, reverse_swell(0.5), -20)
mix.add(secs(swallow), thud(1.2, 3.0, 0.3), -14)
splash = bp(white(int(1.2 * SR)), 400, 6000) * np.exp(-tvec(int(1.2 * SR)) * 4)
mix.add(secs(swallow), stereo(norm(splash), 0.0), -20)
mix.add(secs(swallow), whoosh(2.2, 0.0, 0.0, 90, 600, 0.3), -20)  # sinking

# The three darknesses: one low thud each, the dark closing in.
for i, fr in enumerate(Q["count"]):
    mix.add(secs(DK + fr), thud(0.7 + i * 0.2, 2.6, 0.4), -19 + i)
mix.add(secs(DK + Q["count"][2]), noise_riser(1.4, 0.4), -29)

# His call — each phrase: a breath in, then an air ring lifting one darkness.
mix.add(secs(DU + Q["call"]), swell(1.4, 240, 1300, 0.4), -27)
for i, fr in enumerate(Q["phrases"]):
    mix.add(secs(DU + fr), sand(0.9, 0.5, -0.5, density=220, seed=810 + i, bright=1.4), -31)
    mix.add(secs(DU + fr + 10) - 0.5, reverse_swell(0.5), -23)
    mix.add(secs(DU + fr + 10), air_ring(1.8, -0.4, 0.4), -22)
    mix.add(secs(DU + fr + 10), thud(0.5, 2.0, 0.4), -24)

# The answer — the rise, and the surface breaking into dawn.
mix.add(secs(rise0), noise_riser(secs(rise1 - rise0), 0.8), -24)
mix.add(secs(rise1) - 0.3, whoosh(1.4, -0.3, 0.3, 300, 3000, 0.25), -21)
burst = bp(white(int(1.6 * SR)), 500, 7000) * np.exp(-tvec(int(1.6 * SR)) * 3)
mix.add(secs(rise1), stereo(norm(burst), 0.0), -21)
mix.add(secs(rise1 + 10), swell(3.0, 200, 1400, 0.3), -25)
mix.add(secs(AN + Q["save"]) - 0.6, reverse_swell(0.6), -22)
mix.add(secs(AN + Q["save"]), thud(1.0, 2.8, 0.34), -16)

# Close — the hadith; then back down into the dark.
mix.add(secs(CL + Q["hadith"]), swell(1.4, 260, 1500, 0.35), -27)
mix.add(secs(CL + Q["hadith"] + 60), thud(0.7, 2.2, 0.32), -21)
mix.add(secs(down), whoosh(2.0, 0.0, 0.0, 90, 600, 0.4), -23)

master(mix, N, sys.argv[1])
