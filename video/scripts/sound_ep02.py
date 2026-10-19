"""Quran Decoding EP02 (Musa's mother, al-Qasas 28:7) — halal sound design.

Same policy as EP01 (see sfxlib.py): no music, instruments, bells, melodies or recitation.
The river carries the episode: flowing water, lapping, drops, reeds and night wind.
Cues come from src/ep02/timeline.json plus scene-local frames in src/ep02/scenes.tsx.

Usage: python3 scripts/sound_ep02.py out/ep02_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
T = {k: v for k, v in json.load(open(os.path.join(HERE, "..", "src", "ep02", "timeline.json"))).items() if not k.startswith("_")}
TOTAL_FRAMES = T["outro"][1]
N = int(TOTAL_FRAMES / FPS * SR)


def water(seconds, seed=0, lap=1.0):
    """River at night: a soft flow bed, slow lapping against the bank, scattered droplets."""
    n = int(seconds * SR)
    r = np.random.default_rng(seed)
    t = tvec(n)
    slow = lambda f: norm(signal.sosfilt(signal.butter(1, f, "lp", fs=SR, output="sos"), r.standard_normal(n)))
    flow = bp(pink(n), 180, 1100) * (0.6 + 0.4 * slow(0.6) ** 2)
    laps = lp(brown(n), 260, 4) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 3.1 + r.uniform(0, 6)) ** 6) * lap
    drops = np.zeros(n)
    for _ in range(int(seconds * 4)):
        s = r.integers(0, max(1, n - SR // 4))
        d = lp(drip(r.uniform(500, 1300)), 5000) * r.uniform(0.05, 0.25)
        drops[s : s + len(d)] += d
    mono = norm(flow) * 0.55 + norm(laps) * 0.45 + drops
    return norm(np.stack([mono, np.roll(mono, 900)]))


mix = Mix(N)
H, V, A, D, HT, P, O = (T[k][0] for k in ("hook", "verse", "asmai", "decode", "heart", "promise", "outro"))

# Hook — the river at night; the chest drifts; "22 words" are tapped out; "8 messages" lands.
w = water(secs(T["hook"][1]) + 1.5, seed=1)
w *= np.interp(tvec(w.shape[1]), [0, 0.6, secs(T["hook"][1]) - 0.8, secs(T["hook"][1]) + 1.2], [0.7, 1, 1, 0])
mix.add(secs(H), w, -24)
mix.add(secs(H), wind(secs(T["hook"][1]), seed=5, lo=160, hi=420), -32)
mix.add(secs(H + 56), thud(0.5, 1.8, 0.35), -22)                         # "— and she obeyed."
mix.add(secs(H + 92), swell(0.6, 400, 1600, 0.2, 0.2), -30)
mix.add(secs(H + 104), thud(0.7, 2.0, 0.3), -19)                         # "22 words."
for i in range(22):                                                    # one soft tap per word
    mix.add(secs(H + 108 + 2 * i), stereo(tick(i % 2 == 0), -0.5 + i / 21), -34)
mix.add(secs(H + 150) - 0.5, reverse_swell(0.5), -23)
mix.add(secs(H + 150), thud(0.9, 2.4, 0.32), -16)                        # "8 messages."
mix.add(secs(H + 158), sand(1.6, -0.5, 0.6, seed=2), -28)
HE = T["hook"][1]
mix.add(secs(HE - 24), noise_riser(24 / FPS, top=0.6), -24)
mix.add(secs(HE - 6), swell(2.2, 120, 1400, 0.12), -24)

# Verse — the card rises; the Arabic arrives; the translation follows.
mix.add(secs(V - 12), whoosh(1.3, -0.6, 0.6, 220, 2200), -22)
mix.add(secs(V + 20), paper(0.9, 0.0), -28)
mix.add(secs(V + 40), swell(3.4, 140, 700, 0.4), -29)
mix.add(secs(V + 150), swell(0.9, 500, 2000, 0.3), -31)

# Al-Asma'i — a manuscript opens; the four categories glint.
mix.add(secs(A - 12), whoosh(1.4, 0.5, -0.5, 200, 1800), -22)
mix.add(secs(A + 40), paper(1.3, 0.0), -24)
mix.add(secs(A + 110), sand(1.4, 0.6, -0.6, density=300, seed=3), -28)    # follows the Arabic, right to left
mix.add(secs(A + 168), swell(1.6, 300, 1500, 0.3), -30)

# Decode — six phrases arrive; each category chip lands like a small stone; the total.
mix.add(secs(D - 12), whoosh(1.2, -0.5, 0.5, 240, 2400), -22)
for i, at in enumerate((40, 116, 192, 268, 344, 420)):
    mix.add(secs(D + at), swell(0.7, 300, 1400, 0.3, 0.4), -31)
    mix.add(secs(D + at + 30), pebble(-0.4 + i * 0.05, seed=10 + i), -24)
    if i >= 4:                                                          # the promises: news AND glad tidings
        mix.add(secs(D + at + 64), sand(0.8, -0.2, 0.4, density=300, seed=20 + i), -28)
mix.add(secs(D + 510) - 0.5, reverse_swell(0.5), -22)
mix.add(secs(D + 510), thud(0.9, 2.4, 0.32), -16)                        # "= 8 messages"
mix.add(secs(D + 512), air_ring(1.4, -0.3, 0.5), -30)

# Heart — the river again; the chest drifts away; a long breath.
hlen = secs(T["heart"][1] - HT) + 1.5
w2 = water(hlen, seed=4, lap=0.6) * np.interp(tvec(int(hlen * SR)), [0, 1.0, hlen - 1.5, hlen], [0, 1, 0.9, 0])
mix.add(secs(HT), w2, -24)
mix.add(secs(HT), wind(hlen, seed=6, lo=140, hi=380), -30)
mix.add(secs(HT + 14), swell(4.0, 120, 600, 0.45), -27)
mix.add(secs(HT + 110), swell(1.6, 300, 1600, 0.3, 0.3), -29)          # "But the promise was already made."

# Promise — a beam of light from verse 7 down to verse 13; the final line.
mix.add(secs(P - 12), whoosh(1.4, -0.4, 0.4, 200, 1900), -22)
mix.add(secs(P + 80), swell(1.4, 200, 2400, 0.85), -26)                # the beam travels
mix.add(secs(P + 118), thud(0.6, 2.0, 0.32), -20)
mix.add(secs(P + 236) - 0.6, reverse_swell(0.6), -22)
mix.add(secs(P + 236), thud(1.0, 2.8, 0.35), -15)                        # "…that the promise of Allah is true"
mix.add(secs(P + 290), sand(2.2, -0.6, 0.6, density=320, seed=7), -27)

# Outro — the chest comes back; the water settles into silence.
olen = secs(T["outro"][1] - O) + 1
w3 = water(olen, seed=8, lap=1.2) * np.interp(tvec(int(olen * SR)), [0, 0.8, olen - 2.0, olen], [0, 1, 0.8, 0])
mix.add(secs(O), w3, -23)
mix.add(secs(O - 12), whoosh(1.4, 0.3, -0.3, 200, 2000), -23)
mix.add(secs(O + 10), thud(0.7, 2.6, 0.38), -19)                         # "Eight messages. One promise — kept."

master(mix, N, sys.argv[1])
