"""Shared halal sound-design library for Quran Decoding episodes.

Policy: no music, no musical instruments, no bells or chimes, no melodies or tonal
pads, and no Qur'an recitation used as an effect (cf. Sahih Muslim 2114: "The bell
is the flute of Shaytan"). Sources here are non-musical and natural: air, wind,
breath-like swells, stone and earth thuds, sand, pebbles, water, paper, a clock tick.
"""
import wave

import numpy as np
import pyloudnorm
from pedalboard import Compressor, HighpassFilter, HighShelfFilter, Limiter, LowpassFilter, Pedalboard, Reverb
from scipy import signal

SR = 48000
FPS = 30
rng = np.random.default_rng(1373)


# ---------------------------------------------------------------- DSP helpers
def secs(frames):
    return frames / FPS


def tvec(n):
    return np.arange(n) / SR


def db(g):
    return 10 ** (g / 20)


def norm(x, peak=1.0):
    return x / (np.max(np.abs(x)) + 1e-12) * peak


def stereo(x, pan=0.0):
    a = (np.asarray(pan) + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)])


def white(n):
    return rng.standard_normal(n)


def pink(n):
    b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
    return signal.lfilter(b, a, white(n)) * 8


def brown(n):
    x = np.cumsum(white(n))
    x = signal.sosfilt(signal.butter(1, 12, "hp", fs=SR, output="sos"), x)
    return norm(x)


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


def bp(x, lo, hi, order=2):
    return signal.sosfilt(sos("bandpass", [lo, hi], order), x)


def lp(x, f, order=2):
    return signal.sosfilt(sos("lowpass", f, order), x)


def hp(x, f, order=2):
    return signal.sosfilt(sos("highpass", f, order), x)


def sweep_bp(x, f_curve, q=1.3, block=256):
    """Time-varying band-pass (block-wise biquad, state carried across blocks)."""
    y = np.zeros_like(x)
    zi = np.zeros((1, 2))
    for i in range(0, len(x), block):
        fc = float(np.clip(f_curve[min(i, len(f_curve) - 1)], 40, SR / 2.4))
        bw = fc / q
        s = signal.butter(1, [max(20, fc - bw / 2), min(SR / 2.1, fc + bw / 2)], "bandpass", fs=SR, output="sos")
        y[i : i + block], zi = signal.sosfilt(s, x[i : i + block], zi=zi)
    return y


def env_ar(n, attack_frac=0.6, curve=2.0):
    a = max(1, int(n * attack_frac))
    return np.concatenate([np.linspace(0, 1, a) ** curve, np.linspace(1, 0, n - a) ** (curve * 0.8)])


def space_ir(seconds, dark, seed):
    n = int(seconds * SR)
    t = tvec(n)
    r = np.random.default_rng(seed)
    chans = []
    for _ in range(2):
        tail = lp(r.standard_normal(n) * np.exp(-t * 6.9 / seconds), dark)
        early = np.zeros(n)
        for k in range(12):
            early[int(r.uniform(0.005, 0.08) * SR)] += r.uniform(0.2, 0.6) * (-1) ** k
        chans.append(norm(tail * 0.9 + early * 0.5))
    ir = np.stack(chans)
    return ir / np.sqrt(np.sum(ir**2, axis=1, keepdims=True))


HALL = space_ir(4.0, 3800, 1)
CAVE = space_ir(2.4, 2600, 2)


def convolve(st, ir, wet=0.3):
    mono = st.mean(axis=0)
    w = np.stack([signal.fftconvolve(mono, ir[0]), signal.fftconvolve(mono, ir[1])])
    d = np.zeros_like(w)
    d[:, : st.shape[1]] = st
    return d * (1 - wet) + w * wet * 2.0


def pb(st, board, tail=2.5):
    """Run a Pedalboard chain with room for reverb tails to ring out, then fade the very end."""
    padded = np.concatenate([st, np.zeros((2, int(tail * SR)))], axis=1)
    out = board(padded.astype(np.float32), SR).astype(np.float64)
    f = int(0.25 * SR)
    out[:, -f:] *= np.linspace(1, 0, f) ** 2
    return out


class Mix:
    def __init__(self, n):
        self.bus = np.zeros((2, n + SR * 6))

    def add(self, t_sec, st, gain_db):
        s = int(t_sec * SR)
        if s < 0:
            st, s = st[:, -s:], 0
        e = min(self.bus.shape[1], s + st.shape[1])
        self.bus[:, s:e] += st[:, : e - s] * db(gain_db)


# ---------------------------------------------------------------- sound sources (all non-musical)
def thud(weight=1.0, seconds=2.2, wet=0.25):
    """Earth/stone impact: low-passed noise body, short mid knock, faint grit. No pitched tones."""
    n = int(seconds * SR)
    t = tvec(n)
    low = lp(brown(n), 110, 4) * np.exp(-t * 3.2) * np.clip(t / 0.004, 0, 1)
    knock = bp(white(n), 120, 650) * np.exp(-t * 26) * 0.55
    grit = lp(hp(white(n), 2000), 8000) * np.exp(-t * 120) * 0.12
    x = norm(low) * weight + norm(knock) * 0.6 + grit
    return convolve(stereo(norm(x)), HALL, wet)


def air_ring(seconds=1.4, pan_from=-0.5, pan_to=0.6):
    """Expanding pressure wave: swirling air that opens out and fades."""
    n = int(seconds * SR)
    t = tvec(n)
    am = 0.65 + 0.35 * np.sin(2 * np.pi * np.cumsum(9 - 6 * t / seconds) / SR)
    x = sweep_bp(pink(n), 1400 - 900 * (t / seconds), q=1.0) * am * np.exp(-t * 2.4) * np.clip(t / 0.03, 0, 1)
    return convolve(stereo(norm(x), np.linspace(pan_from, pan_to, n)), HALL, 0.35)


def swell(seconds, lo=200, hi=1600, peak=0.75, pan=0.0):
    """Breath-like air swell (noise only)."""
    n = int(seconds * SR)
    pos = np.linspace(0, 1, n)
    x = sweep_bp(pink(n), lo * (hi / lo) ** np.interp(pos, [0, peak, 1], [0, 1, 0.5]), q=0.9) * env_ar(n, peak, 1.8)
    return pb(stereo(norm(x), pan), Pedalboard([LowpassFilter(9000), Reverb(room_size=0.75, damping=0.7, wet_level=0.3, dry_level=0.8, width=1)]))


def reverse_swell(seconds=0.8):
    n = int(0.45 * SR)
    burst = hp(white(n), 250) * np.exp(-tvec(n) * 28) + lp(brown(n), 450) * np.exp(-tvec(n) * 10)
    tail = convolve(stereo(burst), HALL, 1.0)[:, : int(seconds * SR)]
    tail = tail[:, ::-1] * np.linspace(0, 1, tail.shape[1]) ** 1.6
    return pb(norm(tail, 0.9), Pedalboard([LowpassFilter(8000)]))


def whoosh(seconds=1.2, pan_from=-0.7, pan_to=0.7, lo=220, hi=2600, peak=0.6):
    """Air pass-by: swept noise with doppler-like pan."""
    n = int(seconds * SR)
    pos = np.linspace(0, 1, n)
    body = sweep_bp(pink(n), lo * (hi / lo) ** np.interp(pos, [0, peak, 1], [0, 1, 0.35]), q=1.1)
    air = lp(hp(white(n), 3500), 9000) * 0.035
    x = norm((body + air) * env_ar(n, peak, 2.2))
    return pb(stereo(x, np.linspace(pan_from, pan_to, n)), Pedalboard([HighpassFilter(90), LowpassFilter(10000), Reverb(room_size=0.5, damping=0.7, wet_level=0.2, dry_level=0.85, width=1)]))


def wind(seconds, seed=3, lo=250, hi=800):
    n = int(seconds * SR)
    r = np.random.default_rng(seed)
    slow = lambda f: norm(signal.sosfilt(signal.butter(1, f, "lp", fs=SR, output="sos"), r.standard_normal(n)))
    gust = 0.45 + 0.55 * slow(0.35) ** 2
    fc = lo + (hi - lo) * slow(0.2) ** 2
    x = sweep_bp(pink(n), fc, q=1.5) * gust
    return norm(np.stack([x, np.roll(x, 1300)]))


def noise_riser(seconds, top=1.0):
    """Tension built from wind and pressure only (no tones)."""
    n = int(seconds * SR)
    pos = np.linspace(0, 1, n)
    hiss = sweep_bp(pink(n), 160 * 22 ** pos, q=0.9) * pos**2.0
    press = lp(brown(n), 140, 4) * pos**1.4
    flutter = 1 + 0.18 * np.sin(2 * np.pi * np.cumsum(1.5 + pos**2 * 9) / SR)
    x = (norm(hiss) * 0.7 * top + norm(press) * 0.6) * flutter
    st = np.stack([x, np.roll(x, 320)])
    return pb(norm(st), Pedalboard([LowpassFilter(8500), Reverb(room_size=0.7, damping=0.7, wet_level=0.25, dry_level=0.85, width=1)]))


def sand(seconds, pan_from=-0.6, pan_to=0.6, density=420, seed=0, bright=1.0):
    """Granular sand trickle that travels with a light sweep."""
    n = int(seconds * SR)
    r = np.random.default_rng(seed)
    out = np.zeros((2, n + 2000))
    k = int(density * seconds)
    for i in range(k):
        pos = r.uniform(0, 1)
        start = int(pos * n)
        g = int(r.uniform(0.002, 0.006) * SR)
        grain = r.standard_normal(g) * np.hanning(g) * r.uniform(0.1, 1) * np.sin(np.pi * pos) ** 0.7
        out[:, start : start + g] += stereo(grain, np.clip(pan_from + (pan_to - pan_from) * pos + r.uniform(-0.2, 0.2), -1, 1))
    out = np.stack([bp(c, 1800, 6500 * bright) for c in out])
    return convolve(norm(out), HALL, 0.25)


def pebble(pan=0.4, seed=0):
    """Small stone dropping: two or three decaying taps."""
    r = np.random.default_rng(seed)
    n = int(0.5 * SR)
    x = np.zeros(n)
    t0, amp = 0.0, 1.0
    for _ in range(r.integers(2, 4)):
        s = int(t0 * SR)
        g = int(0.012 * SR)
        tap = bp(r.standard_normal(g), r.uniform(900, 1500), r.uniform(2400, 3600)) * np.exp(-tvec(g) * 380)
        x[s : s + g] += tap * amp
        t0 += r.uniform(0.07, 0.12) * amp
        amp *= 0.45
    knock = lp(r.standard_normal(n), 380) * np.exp(-tvec(n) * 60) * 0.25
    return convolve(stereo(norm(x + knock), pan), CAVE, 0.3)


def tick(alt=False):
    """Mechanical clock tick built from a filtered noise click (no pitched body)."""
    n = int(0.08 * SR)
    t = tvec(n)
    click = bp(white(n), 1500 if alt else 1900, 4200 if alt else 5200) * np.exp(-t * 700)
    body = bp(white(n), 300, 900) * np.exp(-t * 160) * 0.35
    return norm(click + body)


def paper(seconds=0.9, pan=0.0):
    """Page / parchment rustle."""
    n = int(seconds * SR)
    t = tvec(n)
    flutter = np.abs(signal.sosfilt(signal.butter(1, 18, "lp", fs=SR, output="sos"), white(n)))
    rustle = bp(white(n), 1200, 5200) * norm(flutter) * env_ar(n, 0.35, 1.4)
    crackle = np.zeros(n)
    idx = rng.integers(0, n, int(seconds * 60))
    crackle[idx] = rng.uniform(-1, 1, len(idx))
    crackle = lp(hp(crackle, 2000), 9000) * env_ar(n, 0.35, 1.0)
    return convolve(stereo(norm(rustle + crackle * 0.5), pan), CAVE, 0.15)


def drip(f0=900):
    """Water drop in the cave (natural sound)."""
    n = int(0.22 * SR)
    t = tvec(n)
    f = f0 * (1 + 1.3 * np.clip(t / 0.028, 0, 1))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)


def whirr(seconds, rate_hz, pan, lo=280, hi=900):
    """Soft rotating air: band-passed noise with slow amplitude rotation."""
    n = int(seconds * SR)
    t = tvec(n)
    x = bp(pink(n), lo, hi) * (0.6 + 0.4 * np.sin(2 * np.pi * rate_hz * t))
    return stereo(norm(x), pan)


def bez(x1, y1, x2, y2):
    def f(tt):
        u = tt
        for _ in range(14):
            x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u**2 * x2 + u**3 - tt
            dx = 3 * (1 - u) ** 2 * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u**2 * (1 - x2)
            if abs(dx) < 1e-9:
                break
            u = min(1, max(0, u - x / dx))
        return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u**2 * y2 + u**3
    return f


# ---------------------------------------------------------------- master
def master(mix, n, out_path, target=-16.0, ceil=-2.0):
    """Fade, gentle bus processing, then a measured gain/limiter loop to the loudness target."""
    dur = n / SR
    t = tvec(n)
    bus = mix.bus[:, :n] * np.clip((dur - t) / 1.6, 0, 1) ** 1.5
    bus = pb(bus, tail=0.3, board=Pedalboard([
        HighpassFilter(30),
        LowpassFilter(16000),
        HighShelfFilter(cutoff_frequency_hz=7000, gain_db=-2.5),
        Compressor(threshold_db=-22, ratio=1.8, attack_ms=25, release_ms=280),
    ]))[:, :n]
    meter = pyloudnorm.Meter(SR)
    pre = bus.copy()
    gain = target - meter.integrated_loudness(pre.T)
    for _ in range(6):
        # JUCE-style limiter adds make-up gain to a 0 dBFS ceiling: pull back to the ceiling, correct, repeat.
        bus = pb(pre * db(gain), Pedalboard([Limiter(threshold_db=-2.0, release_ms=160)]), tail=0.0)[:, : pre.shape[1]] * db(ceil)
        err = target - meter.integrated_loudness(bus.T)
        if abs(err) < 0.1:
            break
        gain += err
    final = meter.integrated_loudness(bus.T)
    peak = 20 * np.log10(np.max(np.abs(bus)) + 1e-12)
    pcm = (np.clip(bus.T, -1, 1) * 32767).astype(np.int16)
    with wave.open(out_path, "wb") as wv:
        wv.setnchannels(2)
        wv.setsampwidth(2)
        wv.setframerate(SR)
        wv.writeframes(pcm.tobytes())
    print(f"wrote {out_path}  {dur:.2f}s  integrated {final:.1f} LUFS  sample peak {peak:.1f} dBFS")
