"""Sound for Story 1, scene 1 (anime + pixel art). Every time comes from anime/timeline.json.

    python3 -m sfx sfx/cues/cena1.py
"""

import math
import random

from sfx.synth import SR, bandnoise, blip, chime, click, envelope, impact, pad, pop, riser, whoosh

TIMELINE = "anime/timeline.json"
OUT = "anime/out/cena1.wav"
TARGET_LUFS = -14.0

# A minor for the night, F major (Fmaj7) for the dawn
NIGHT = [110.0, 164.81, 220.0, 246.94, 329.63]
DAWN = [174.61, 220.0, 261.63, 329.63, 440.0]
ARP = [440.0, 523.25, 659.25, 783.99, 659.25, 523.25]


def tone(freq, dur, shape="square", vol=1.0, attack=0.01, release=0.08):
    n = int(dur * SR)
    out = []
    for k in range(n):
        t = k / SR
        ph = (t * freq) % 1.0
        v = (1.0 if ph < 0.5 else -1.0) if shape == "square" else (2 * ph - 1)
        env = min(1.0, t / attack) * min(1.0, (dur - t) / release)
        out.append(v * env * vol)
    return out


def horn(dur=0.9):
    a, b = tone(392, dur, "saw", 0.5), tone(494, dur, "saw", 0.5)
    return [x + y for x, y in zip(a, b)]


def rain_bed(dur, seed=3):
    rnd = random.Random(seed)
    base = bandnoise(int(dur * SR), lambda k: 3200 + 600 * math.sin(k / SR * 0.7), q=0.5)
    out = list(base)
    for _ in range(int(dur * 60)):  # individual drops
        at = int(rnd.random() * (len(out) - 600))
        f = 2500 + rnd.random() * 3500
        for j in range(500):
            out[at + j] += 0.25 * math.sin(2 * math.pi * f * j / SR) * math.exp(-j / 70)
    return out


def engine(dur):
    n = int(dur * SR)
    out = []
    for k in range(n):
        t = k / SR
        f = 45 + 75 * (t / dur) ** 2
        out.append(0.6 * math.sin(2 * math.pi * f * t) + 0.3 * math.sin(4 * math.pi * f * t + 0.5))
    rough = bandnoise(n, lambda k: 300 + 900 * (k / n) ** 2, q=1.2)
    return [a * (0.2 + 0.8 * (k / n) ** 1.6) + 0.5 * b * (k / n) for k, (a, b) in enumerate(zip(out, rough))]


def skid(dur=1.2):
    n = int(dur * SR)
    s = bandnoise(n, lambda k: 2400 + 500 * math.sin(k / SR * 60), q=0.12)
    m = max(abs(v) for v in s) or 1
    return [v / m * min(1, k / 800) * (1 - k / n) for k, v in enumerate(s)]


def splash_sfx():
    n = int(0.9 * SR)
    s = bandnoise(n, lambda k: 1800 - 1200 * k / n, q=0.6)
    return [v * math.exp(-k / (0.18 * SR)) for k, v in enumerate(s)]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put

    # music bed: night pad until the freeze, silence on white, warm pad at dawn
    vol_n = envelope([(0, 0), (1.5, 1), (b["freeze"] - 0.1, 1.2), (b["freeze"], 0), (dur, 0)])
    mix.put_stereo(0, *pad(b["shatter"], [(0, NIGHT)], volume=vol_n), gain=0.03)
    vol_d = envelope([(0, 0), (1.2, 1), (dur - b["dawn"] - 0.8, 1), (dur - b["dawn"], 0)])
    mix.put_stereo(b["dawn"], *pad(dur - b["dawn"], [(0, DAWN)], volume=vol_d), gain=0.04)
    # soft chiptune arpeggio over the night (stops when the car appears)
    t = 0.6
    i = 0
    while t < 7.4:
        put(t, blip(ARP[i % len(ARP)], dur=0.3, tau=0.09), 0.07, -0.3 + 0.12 * (i % 6))
        t += 0.3
        i += 1

    # rain: full through the chase, thinner in slow motion, gone at the freeze
    rain = rain_bed(b["freeze"])
    rv = envelope([(0, 0.0), (0.6, 1), (b["splash1"] - 0.6, 1), (b["splash1"], 0.45), (b["freeze"] - 0.05, 0.45), (b["freeze"], 0)])
    put(0, [v * rv(k / SR) for k, v in enumerate(rain)], 0.22)

    # phone
    for k in range(3):
        put(b["phoneBuzz"] + k * 0.12, tone(150, 0.09, "square", 0.6), 0.12, 0.3)
    for k, t0 in enumerate([4.65, b["phoneBuzz"], b["phoneBuzz"] + 1.0]):
        put(t0, pop(1400 + k * 200, 700), 0.15, 0.3)

    # car: engine swell, headlights, horn + skid, passes into the eye shot
    put(b["headlightsOn"] - 0.4, engine(b["splash1"] - b["headlightsOn"] + 0.4), 0.35, 0.2)
    put(b["headlightsOn"], click(900, 0.06), 0.25, 0.3)
    put(b["skid"], skid(1.3), 0.25, 0.4)
    put(b["skid"] + 0.3, horn(1.1), 0.18, 0.3)
    put(b["eyeFlare"] - 0.6, horn(0.7), 0.14, 0.5)

    # the dog: ear up, flare riser into the run
    put(b["earUp"], pop(600, 1500, dur=0.14), 0.18, -0.2)
    put(b["earUp"] + 0.4, riser(b["freeze"] - b["earUp"] - 0.4, f0=180, f1=3200), 0.18)
    for k in ("splash1", "splash2", "splash3"):
        put(b[k], splash_sfx(), 0.38, -0.2 if k != "splash2" else 0.2)
        put(b[k], whoosh(0.5, 300, 1800, peak=0.2), 0.08)

    # the freeze: one impact, the bite, a ringing chord
    put(b["freeze"], impact(1.6), 0.6)
    put(b["nhac"], pop(900, 220, dur=0.2), 0.4, -0.3)
    put(b["freeze"] + 0.05, chime([440.0, 659.25, 880.0, 1318.5], dur=3.6, tau=1.4), 0.12)

    # shatter: a spray of glassy clicks, then silence on white
    rnd = random.Random(7)
    for k in range(40):
        put(b["shatter"] + rnd.random() * 1.0, click(2500 + rnd.random() * 3500, 0.03), 0.08, rnd.uniform(-0.9, 0.9))
    put(b["shatter"], whoosh(1.1, 800, 6000, peak=0.3, q=0.6), 0.22)

    # dawn: shutter rattle far away, birds, a warm chime
    put(b["dawn"] + 0.2, chime([349.23, 440.0, 523.25, 659.25], dur=3.0, tau=1.1), 0.1)
    for k in range(7):
        t0 = b["dawn"] + 0.8 + k * 0.55 + rnd.random() * 0.2
        for j in range(2 + k % 2):
            put(t0 + j * 0.09, blip(2600 + rnd.random() * 900, dur=0.08, tau=0.03), 0.05, rnd.uniform(-0.7, 0.7))
    put(b["caption8"], pop(700, 1100), 0.12)
