"""Quran Decoding EP03 (the cave that faced north, al-Kahf 18:17) — halal sound design.

Same policy as EP01/EP02 (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Cues come from src/ep03/timeline.json plus scene-local frames in src/ep03/scenes.tsx.

Usage: python3 scripts/sound_ep03.py out/ep03_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
T = {k: v for k, v in json.load(open(os.path.join(HERE, "..", "src", "ep03", "timeline.json"))).items() if not k.startswith("_")}
N = int(T["outro"][1] / FPS * SR)


def grind(seconds, seed=0):
    """Stone turning against stone: low band noise with irregular grain."""
    n = int(seconds * SR)
    r = np.random.default_rng(seed)
    grain = np.abs(signal.sosfilt(signal.butter(1, 40, "lp", fs=SR, output="sos"), r.standard_normal(n)))
    x = bp(brown(n), 60, 420) * norm(grain) + bp(white(n), 900, 2600) * norm(grain) ** 3 * 0.25
    return stereo(norm(x * env_ar(n, 0.3, 1.2)))


def sun_pass(seconds):
    """A warm air swell travelling from the right (east) to the left (west) across one day."""
    n = int(seconds * SR)
    pos = np.linspace(0, 1, n)
    x = sweep_bp(pink(n), 220 + 900 * np.sin(np.pi * pos), q=0.9) * np.sin(np.pi * pos) ** 1.4
    return pb(stereo(norm(x), np.linspace(0.75, -0.75, n)), Pedalboard([LowpassFilter(7000), Reverb(room_size=0.7, wet_level=0.25, dry_level=0.85, width=1)]))


mix = Mix(N)
H, V, CL, TE, R, S, O = (T[k][0] for k in ("hook", "verse", "clues", "test", "result", "signs", "outro"))

# Room: night air outside a cave, rumble beneath.
t = tvec(N)
room = norm(lp(brown(N), 110, 4))
mix.add(0, np.stack([room, np.roll(room, 2400)]) * np.interp(t, [0, 3, N / SR - 2, N / SR], [0.6, 0.8, 0.6, 0]), -29)
mix.add(0, wind(N / SR, seed=31, lo=180, hi=520), -31)

# Hook — the cave turns, searching.
mix.add(secs(H), grind(secs(T["hook"][1]) - 0.4, seed=1), -27)
mix.add(secs(H), swell(2.2, 160, 900, 0.3), -26)
mix.add(secs(H + 70), whoosh(0.9, -0.4, 0.4, 300, 2000), -28)            # "But one verse tells you..."
mix.add(secs(H + 110), sand(1.8, -0.5, 0.6, seed=2), -29)
HE = T["hook"][1]
mix.add(secs(HE - 24), noise_riser(24 / FPS, top=0.6), -24)
mix.add(secs(HE - 6), swell(2.2, 120, 1400, 0.12), -24)

# Verse.
mix.add(secs(V - 12), whoosh(1.3, -0.6, 0.6, 220, 2200), -22)
mix.add(secs(V + 20), paper(0.9, 0.0), -28)
mix.add(secs(V + 40), swell(3.4, 140, 700, 0.4), -29)

# Clues.
mix.add(secs(CL - 12), whoosh(1.2, 0.5, -0.5, 240, 2200), -22)
mix.add(secs(CL + 30), swell(1.2, 400, 2400, 0.3, 0.6), -27)             # sunrise clue (right)
mix.add(secs(CL + 80), swell(1.2, 400, 2400, 0.3, -0.6), -27)            # sunset clue (left)
mix.add(secs(CL + 134), thud(0.5, 1.6, 0.35), -24)

# Test — four directions. Mirrors Test in scenes.tsx: T0=40, STEP=180, ROT=30, DAY=116.
T0, STEP, ROT, DAY = 40, 180, 30, 116
mix.add(secs(TE - 12), whoosh(1.2, -0.5, 0.5, 240, 2400), -22)
for k, ok in enumerate((False, False, False, True)):
    s = TE + T0 + k * STEP
    if k > 0:
        mix.add(secs(s), grind(ROT / FPS + 0.3, seed=10 + k), -22)        # the cave rotates
    mix.add(secs(s + ROT), sun_pass(DAY / FPS), -24)                     # one day of sun, east to west
    if not ok:
        hiss_at = {0: (ROT, 50), 1: (ROT + 20, 80), 2: (ROT + 66, 50)}[k]
        mix.add(secs(s + hiss_at[0]), sand(hiss_at[1] / FPS, 0.4, -0.4, density=360, seed=20 + k, bright=0.9), -27)  # light pouring in
        mix.add(secs(s + ROT + DAY - 6), thud(0.55, 1.6, 0.3), -22)     # "Light enters"
    else:
        mix.add(secs(s + ROT + DAY - 6), swell(2.4, 200, 1600, 0.2), -22)  # "The sun stays out"
        mix.add(secs(s + ROT + DAY), sand(1.6, -0.6, 0.6, density=260, seed=30), -29)

# Result.
mix.add(secs(R - 12), whoosh(1.3, -0.4, 0.4, 220, 2000), -22)
mix.add(secs(R + 4) - 0.5, reverse_swell(0.5), -22)
mix.add(secs(R + 4), thud(0.9, 2.6, 0.34), -16)                           # "The entrance faced north."
mix.add(secs(R + 70), paper(1.3, 0.0), -24)
mix.add(secs(R + 96), swell(3.6, 140, 700, 0.4), -29)

# Signs.
mix.add(secs(S - 12), whoosh(1.4, 0.4, -0.4, 200, 1800), -22)
mix.add(secs(S + 70) - 0.6, reverse_swell(0.6), -22)
mix.add(secs(S + 70), thud(1.0, 2.8, 0.36), -15)                          # «ذَٰلِكَ مِنۡ ءَايَٰتِ ٱللَّهِ»
mix.add(secs(S + 110), sand(2.0, -0.6, 0.6, density=300, seed=40), -28)

# Outro.
mix.add(secs(O - 12), whoosh(1.4, -0.3, 0.3, 200, 2000), -23)
mix.add(secs(O + 10), thud(0.7, 2.6, 0.38), -19)
mix.add(secs(O + 4), sun_pass((T["outro"][1] - O) / FPS), -27)

master(mix, N, sys.argv[1])
