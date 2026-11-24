"""Sound for Story 1, scene 9 (the leap, climax). Times from anime/timeline9.json.

    python3 -m sfx sfx/cues/cena9.py
"""

import random

from sfx.synth import bandnoise, blip, click, envelope, impact, pad, pop, riser, whoosh

TIMELINE = "anime/timeline9.json"
OUT = "anime/out/cena9.wav"
TARGET_LUFS = -14.0
SR = 48000

DREAD = [103.83, 155.56, 207.65, 246.94]
HIGH = [207.65, 311.13, 415.3, 493.88]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(9)
    white = b["white"]

    vol = envelope([(0, 0.6), (b["bite"], 1), (b["bite"] + 0.05, 0.2), (b["pull"], 1), (white - 0.3, 1), (white, 0), (dur, 0)])
    mix.put_stereo(0, *pad(white, [(0, DREAD), (b["leap"], HIGH)], volume=vol), gain=0.04)

    # rain bed until the white
    t = 0.0
    while t < white - 0.5:
        put(t, bandnoise(int(1.1 * SR), lambda k: 3600 + 700 * ((k // 4000) % 3), q=0.5), 0.09, rnd.uniform(-0.4, 0.4))
        t += 1.0
    # the run: paws slapping water, fast
    t = 0.2
    while t < b["leap"]:
        put(t, pop(220 + rnd.random() * 60, 120, dur=0.06), 0.18, rnd.uniform(-0.3, 0.3))
        put(t, bandnoise(int(0.18 * SR), lambda k: 2200 - k / 4, q=0.8), 0.08)
        t += 0.105
    for i in range(4):
        put(b["tap"] + i * 0.45, click(1100 + i * 80, 0.04), 0.25, -0.6 + i * 0.4)
    # heartbeat racing
    t = 0.0
    while t < b["bite"]:
        put(t, pop(72, 50, dur=0.12), 0.2)
        put(t + 0.13, pop(66, 48, dur=0.1), 0.14)
        t += 0.38
    # the leap in slow motion: long whoosh + riser into the bite
    put(b["leap"], whoosh(b["bite"] - b["leap"], 150, 1400, peak=0.9, q=1.4), 0.25)
    put(b["leap"], riser(b["bite"] - b["leap"], 180, 3000), 0.12)
    put(b["bite"], impact(1.2), 0.45)
    put(b["bite"], pop(900, 300, dur=0.15), 0.3)
    put(b["bite"] + 0.15, blip(830.61, dur=1.2, tau=0.5), 0.1)
    # the pull: cloth rip, fall
    put(b["pull"], bandnoise(int(0.5 * SR), lambda k: 3000 - k / 12, q=1.8), 0.22)
    put(b["phone"], whoosh(0.8, 1800, 700, peak=0.3), 0.1, 0.4)
    put(b["land"] - 0.3, pop(110, 60, dur=0.25), 0.35, -0.3)
    put(b["land"] + 0.2, click(2400, 0.03), 0.15, -0.6)
    # engine grows from the right, the car passes right to left, the wave
    put(b["pull"], bandnoise(int((b["car"] + 0.6 - b["pull"]) * SR), lambda k: 80 + k / SR * 50, q=2.2), 0.35, 0.7)
    put(b["car"] - 0.2, whoosh(1.2, 2500, 150, peak=0.35, q=0.7), 0.5, 0.0)
    put(b["wave"], bandnoise(int((white - b["wave"]) * SR), lambda k: 500 + k / 30, q=0.4), 0.45)
    put(b["shwoosh"], whoosh(white - b["shwoosh"], 300, 5000, peak=0.85), 0.3)
    # then nothing: silence over the white
