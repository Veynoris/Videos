"""Quran Decoding EP07 (One Ant, an-Naml 27:18) — halal sound design.

Same policy as earlier episodes (see sfxlib.py): no music, instruments, bells, melodies or recitation.
Desert wind and sand; the army as a distant rumble (continuous, never rhythmic); a small air ring
for the ant's voice; a glass swell for the prism and one soft tap per decoded row.
It opens on a soft hit and fades out so the reel loops.
Usage: python3 scripts/sound_ep07.py out/ep07_sfx.wav
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
J = json.load(open(os.path.join(HERE, "..", "src", "ep07", "timeline.json")))
Q = J["cue"]
H, V, S, D, E, CL = (J[k][0] for k in ("hook", "valley", "speech", "decode", "excuse", "close"))
END = J["close"][1]
N = int(END / FPS * SR)
dur = END / FPS
mix = Mix(N)
t = tvec(N)

room = norm(lp(brown(N), 110, 4))
mix.add(0, np.stack([room, np.roll(room, 2400)]) * np.interp(t, [0, 1, dur - 2.5, dur - 0.6], [0.7, 0.8, 0.6, 0]), -30)
desert = np.interp(t, [0, secs(V), secs(V + 40), secs(J["speech"][1]), secs(D + 30), secs(CL), secs(CL + 60), dur - 0.6, dur], [0.5, 0.5, 1, 1, 0.3, 0.3, 0.5, 0.4, 0])
mix.add(0, wind(dur, seed=71, lo=200, hi=700) * desert, -29)

# Hook — close on her voice rippling on the sand; the camera pulls back to reveal the moon and the
# army's lights; her sentence is written in light; its ten parts flash; "ten things".
mix.add(0, thud(0.8, 2.2, 0.3), -18)
mix.add(0, air_ring(1.6, -0.2, 0.2), -27)
mix.add(secs(6), whoosh(2.0, 0.0, 0.0, 120, 900, 0.5), -24)       # the pull-back
mix.add(secs(30), swell(2.0, 200, 1200, 0.5), -27)                # the reveal
mix.add(secs(40), sand(1.3, 0.6, -0.6, density=260, seed=790, bright=1.5), -29)  # written in light
for i in range(10):
    mix.add(secs(78 + i * 2), pebble(-0.6 + i * 0.13, seed=760 + i), -32)
mix.add(secs(98) - 0.5, reverse_swell(0.5), -24)
mix.add(secs(98), thud(0.7, 2.0, 0.3), -20)

# Valley — the army: a distant rumble that swells as the rows come over the horizon.
a0, a1 = Q["army"]
n = int(secs(J["speech"][1] - V - a0) * SR)
stop = secs(S + Q["voice"] - V - a0) / (n / SR)  # the march stops dead when she speaks
rumble = lp(brown(n), 160, 4) * np.interp(np.arange(n) / n, [0, 0.6 * stop, stop, stop + 0.04, 1], [0, 1, 1, 0.05, 0])
mix.add(secs(V + a0), stereo(norm(rumble), 0.0) * 0.9, -24)
mix.add(secs(V + a0), sand(secs(a1 - a0), -0.8, 0.8, density=200, seed=700, bright=0.7), -32)
mix.add(secs(V + 20), whoosh(1.0, -0.4, 0.4, 260, 1800), -28)
mix.add(secs(V + Q["valleyLine"]), swell(1.4, 200, 1100, 0.4), -28)

# Speech — her voice: a small air ring; the trails hurry home (sand).
mix.add(secs(S + Q["voice"]) - 0.4, reverse_swell(0.4), -27)
mix.add(secs(S + Q["voice"]), air_ring(1.4, 0.0, 0.0), -24)
mix.add(secs(S + 4), whoosh(1.4, 0.0, 0.0, 120, 700, 0.7), -23)            # the dive toward her
mix.add(secs(S + 30), sand(secs(70), 0.7, -0.7, density=240, seed=790, bright=1.5), -29)  # words written in light
h0, h1 = Q["hurry"]
mix.add(secs(S + h0), sand(secs(h1 - h0), 0.6, -0.6, density=420, seed=701, bright=1.3), -28)

# Decode — the prism, then one soft tap and a short air streak per row.
mix.add(secs(D + Q["prism"]), swell(1.8, 600, 3200, 0.4), -26)
mix.add(secs(D + Q["prism"] + 34) - 0.4, reverse_swell(0.4), -25)          # the beam strikes the crystal
for i in range(10):
    fr = D + Q["rows0"] + i * Q["rowStep"]
    mix.add(secs(fr - 8), whoosh(0.5, 0.0, -0.6 + i * 0.12, 600, 3000, 0.5), -31)
    mix.add(secs(fr), pebble(-0.5 + i * 0.1, seed=710 + i), -26)
mix.add(secs(D + Q["rows0"] + 9 * Q["rowStep"] + 6), thud(0.6, 2.0, 0.3), -21)

# Excuse — warned, then excused.
mix.add(secs(E - 8), whoosh(1.0, 0.4, -0.4, 260, 2000), -27)
mix.add(secs(E + 30), pebble(-0.2, seed=730), -27)
mix.add(secs(E + 70), pebble(0.2, seed=731), -27)
mix.add(secs(E + Q["excuseAr"]) - 0.7, reverse_swell(0.7), -22)
mix.add(secs(E + Q["excuseAr"]), thud(1.0, 2.6, 0.34), -16)

# Close — Sulaymān smiled; dawn breaks; his du'ā; back to frame 0.
mix.add(secs(CL + 10), noise_riser(secs(70), 0.6), -28)
mix.add(secs(CL + 80), swell(3.0, 180, 1400, 0.3), -25)
mix.add(secs(CL - 6), whoosh(1.0, -0.4, 0.4, 260, 1900), -27)
mix.add(secs(CL + Q["smile"]), swell(1.6, 300, 1800, 0.35), -26)
mix.add(secs(CL + Q["dua"]), swell(2.2, 200, 1200, 0.5), -27)
mix.add(secs(CL + Q["loop"]), swell(1.4, 160, 900, 0.7), -29)

# Particle shimmers (fine, bright sand — never tonal) under the light bursts.
for fr, d, g in ((D + Q["prism"] + 16, 1.8, -29), (CL + Q["smile"], 4.0, -29), (E + 70, 1.4, -31)):
    mix.add(secs(fr), sand(d, -0.7, 0.7, density=520, seed=780 + fr % 97, bright=1.4), g)

master(mix, N, sys.argv[1])
