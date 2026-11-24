"""Sound for Story 1, scene 2 (morning street). Times from anime/timeline2.json.

    python3 -m sfx sfx/cues/cena2.py
"""

import math
import random

from sfx.synth import SR, bandnoise, blip, chime, click, envelope, pad, pop, scratch, whoosh

TIMELINE = "anime/timeline2.json"
OUT = "anime/out/cena2.wav"
TARGET_LUFS = -14.0

DAWN = [174.61, 220.0, 261.63, 329.63, 440.0]       # Fmaj7
DAY = [196.0, 246.94, 293.66, 392.0, 493.88]        # G
MELODY = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 440.0]


def shutter(dur=2.2):
    rnd = random.Random(4)
    n = int(dur * SR)
    out = [0.0] * n
    t = 0.0
    while t < dur - 0.05:
        i = int(t * SR)
        f = 900 + rnd.random() * 600
        for j in range(int(0.03 * SR)):
            if i + j < n:
                out[i + j] += math.sin(2 * math.pi * f * j / SR) * math.exp(-j / 250) * 0.8 + rnd.uniform(-0.3, 0.3) * math.exp(-j / 80)
        t += 0.045 + rnd.random() * 0.02
    rumble = bandnoise(n, lambda k: 220, q=0.7)
    return [a + 0.6 * b for a, b in zip(out, rumble)]


def sniff():
    n = int(0.16 * SR)
    s = bandnoise(n, lambda k: 3200 + 1200 * k / n, q=0.5)
    return [v * math.sin(math.pi * k / n) for k, v in enumerate(s)]


def steps(start, end, rate=7.5):
    out = []
    t = start
    while t < end:
        out.append(t)
        t += 1.0 / rate
    return out


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(9)

    vol = envelope([(0, 0.8), (b["shutter"], 1), (10, 1), (dur - 1.2, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, DAWN), (10, DAY), (22, DAWN), (28, DAY)], volume=vol), gain=0.035)
    # gentle music-box melody once the dog is awake
    t, i = 10.4, 0
    while t < dur - 1:
        put(t, blip(MELODY[i % len(MELODY)], dur=0.45, tau=0.16), 0.06, -0.2 + 0.05 * (i % 8))
        t += 0.6
        i += 1

    # morning ambience: birds throughout
    for k in range(40):
        t0 = rnd.random() * (dur - 1)
        for j in range(2 + k % 3):
            put(t0 + j * 0.08, blip(2500 + rnd.random() * 1200, dur=0.07, tau=0.025), 0.035, rnd.uniform(-0.8, 0.8))

    put(b["shutter"], shutter(2.2), 0.3, 0.4)
    put(b["shutter"] + 2.2, click(700, 0.08), 0.3, 0.4)

    for s0 in (b["sniff1"], b["sniff2"]):
        for k in range(3):
            put(s0 + k * 0.18, sniff(), 0.35, 0.1)
    put(10.6, whoosh(2.6, 400, 2600, peak=0.7, q=0.6), 0.12, 0.3)
    put(10.6, chime([783.99, 1046.5, 1318.5], dur=2.4, tau=0.9), 0.08, 0.3)
    put(b["bread"], pop(900, 1500), 0.3, -0.3)

    # kids running past, left to right in the frame (they run leftwards)
    for k, t0 in enumerate(steps(b["kidsIn"], b["kidsIn"] + 3.4)):
        put(t0, click(500 + rnd.random() * 200, 0.05), 0.16, 0.8 - 1.6 * (t0 - b["kidsIn"]) / 3.4)
    put(b["bomdia"], pop(700, 1200), 0.3, 0.2)
    put(b["bomdia"] + 0.05, chime([659.25, 783.99, 987.77], dur=1.2, tau=0.4), 0.1)
    put(b["huh"], pop(500, 950, dur=0.2), 0.3, -0.2)

    put(b["look1"], whoosh(0.3, 1200, 600, peak=0.4), 0.08, -0.4)
    put(b["look2"], whoosh(0.3, 600, 1200, peak=0.4), 0.08, 0.4)
    put(b["think"], blip(392.0, dur=0.6), 0.2)
    put(b["think"] + 0.12, blip(523.25, dur=0.8), 0.16)

    # RPG card: window open + counter ticks
    put(b["card"], pop(300, 800, dur=0.25), 0.3)
    for k in range(14):
        put(b["card"] + 0.5 + k * 0.05, click(1600 + k * 60, 0.03), 0.1)
    put(b["card"] + 1.3, chime([523.25, 659.25, 783.99, 1046.5], dur=1.8, tau=0.6), 0.12)
