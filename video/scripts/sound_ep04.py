"""Quran Decoding EP04 v2 (the decoding engine) — halal sound design.

Same policy as earlier episodes (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Mechanical sounds are built from filtered noise only (latches, ratchets, sliding plates, gear rumble),
with no resonant or ringing metal. It opens on a soft hit and settles to near-silence so the reel loops.
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
t = tvec(N)
dur = END / FPS

# Bed: low room and a soft gear rumble that follows the machine.
room = norm(lp(brown(N), 110, 4))
mix.add(0, np.stack([room, np.roll(room, 2400)]) * np.interp(t, [0, 1, dur - 2.5, dur - 0.6], [0.7, 0.8, 0.6, 0]), -30)
rumble = whirr(dur, 0.6, 0.0, 70, 240)
mix.add(0, rumble * np.interp(t, [0, 2, secs(T["zoom"][1]), secs(T["zoom"][2]), dur - 2, dur - 0.5], [0.8, 1, 0.45, 0.45, 0.8, 0]), -31)

# Hook — soft hit on frame 0; the claim settles in.
mix.add(0, thud(0.8, 2.2, 0.3), -18)
mix.add(secs(14), swell(1.4, 200, 1300, 0.3), -29)

# Decode — each ring travel ratchets, each lock clacks; the two lamps tick in order.
for k, (t0, t1) in enumerate(zip(T["travel"], T["hits"])):
    tenth = k == len(T["hits"]) - 1
    span = secs(t1 - t0)
    mix.add(secs(t0), ratchet(span, 10, 34 if not tenth else 22, -0.4, 0.4, seed=400 + k), -27 if not tenth else -24)
    mix.add(secs(t0), whirr(span, 9, 0.0, 300, 900) * np.sin(np.pi * np.linspace(0, 1, int(span * SR))) ** 0.6, -33)
    if tenth:
        mix.add(secs(t1) - 0.9, reverse_swell(0.9), -22)
        mix.add(secs(t1), clack(1.4, 0.0, seed=430), -14)
        mix.add(secs(t1), thud(1.0, 2.8, 0.34), -16)
    else:
        mix.add(secs(t1), clack(0.8, 0.0, seed=410 + k), -20)
    mix.add(secs(t1 + 1), stereo(tick(), -0.3), -30)        # 1 · HEARING
    mix.add(secs(t1 + 8), stereo(tick(alt=True), 0.3), -31)  # 2 · SEEING
mix.add(secs(T["decode"][0] + 30), whoosh(0.8, -0.4, 0.4, 300, 2000), -29)   # "Hearing first."
mix.add(secs(T["decode"][0] + 212), whoosh(0.8, 0.4, -0.4, 300, 2000), -29)  # "Every single time."
mix.add(secs(T["tenth"][0] + 8), swell(1.6, 160, 900, 0.6), -28)              # "And the tenth…"

# Iris opens; the camera dives through it.
o0, o1, c0, c1 = T["iris"]
mix.add(secs(o0), slide(secs(o1 - o0), 0.0, seed=440), -21)
mix.add(secs(o0), ratchet(secs(o1 - o0), 26, 12, 0.5, -0.5, seed=441), -32)
mix.add(secs(T["zoom"][0]), noise_riser(secs(T["zoom"][1] - T["zoom"][0]), 0.7), -27)
mix.add(secs(T["zoom"][1]) - 0.2, whoosh(1.6, -0.5, 0.5, 160, 1600, 0.3), -24)

# Story — three quiet lines; then "Allah did."
S = T["story"][0]
for fr in (24, 116, 206):
    mix.add(secs(S + fr), swell(1.0, 300, 1300, 0.3), -31)
mix.add(secs(S + 290) - 0.9, reverse_swell(0.9), -20)
mix.add(secs(S + 290), thud(1.1, 3.0, 0.38), -13)
mix.add(secs(S + 292), air_ring(1.6, -0.5, 0.5), -30)

# Verse — the words of 58:1 surface like engraving.
V = T["verse"][0]
mix.add(secs(V + 6), paper(1.0, 0.0), -28)
mix.add(secs(V + 20), sand(3.2, 0.6, -0.6, density=300, seed=60), -30)
for i, fr in enumerate((100, 106, 112)):
    mix.add(secs(V + fr), pebble(-0.4 + i * 0.4, seed=460 + i), -29)
mix.add(secs(V + 210), thud(0.6, 2.0, 0.3), -22)                             # "Then All-Seeing."

# Close — "He hears."; back out; the iris closes, the ring winds home, the counter rolls back.
C = T["close"][0]
mix.add(secs(C + 62), thud(0.8, 2.4, 0.36), -18)
mix.add(secs(T["zoom"][2]), whoosh(1.8, 0.5, -0.5, 160, 1500, 0.4), -25)
h0, h1 = T["home"]
mix.add(secs(h0), ratchet(secs(h1 - h0), 8, 30, -0.5, 0.5, seed=470), -31)
mix.add(secs(c0), slide(secs(c1 - c0), 0.0, seed=471), -24)
mix.add(secs(c1), clack(0.9, 0.0, seed=472), -21)
r0, r1 = T["reset"]
mix.add(secs(r0), ratchet(secs(r1 - r0), 14, 24, 0.0, 0.0, seed=473), -33)
mix.add(secs(END - 50), swell(1.5, 160, 900, 0.7), -28)

master(mix, N, sys.argv[1])
