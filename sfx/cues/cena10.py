"""Sound for Story 1, scene 10 (the curb). Times from anime/timeline10.json.

    python3 -m sfx sfx/cues/cena10.py
"""

import random

from sfx.synth import bandnoise, blip, chime, envelope, pad, pop

TIMELINE = "anime/timeline10.json"
OUT = "anime/out/cena10.wav"
TARGET_LUFS = -14.0
SR = 48000

HUSH = [130.81, 196.0, 261.63, 329.63]           # C, open and quiet
DAWN = [174.61, 261.63, 349.23, 440.0, 523.25]   # F major as the light comes


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(10)

    vol = envelope([(0, 0), (3.0, 0.6), (b["rainStop"], 0.8), (b["beam"] + 2, 1), (dur - 2, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, HUSH), (b["beam"], DAWN)], volume=vol), gain=0.04)

    # rain fading out
    t = 0.0
    while t < b["rainEnd"]:
        g = 0.08 * max(0.0, min(1.0, (b["rainEnd"] - t) / (b["rainEnd"] - b["rainStop"])))
        put(t, bandnoise(int(1.1 * SR), lambda k: 3400 + 700 * ((k // 4000) % 3), q=0.5), g, rnd.uniform(-0.4, 0.4))
        t += 1.0
    # his breathing, slowing down
    t, gap = 0.3, 0.84
    while t < b["think"]:
        put(t, bandnoise(int(0.35 * SR), lambda k: 900 + k / 40, q=0.6), 0.18, -0.2)
        put(t + gap * 0.5, bandnoise(int(0.4 * SR), lambda k: 700 - k / 80, q=0.6), 0.12, -0.2)
        t += gap
        gap = min(1.8, gap * 1.06)
    # the head on his hand, a tiny heart
    put(b["lean"], pop(300, 420, dur=0.2), 0.12, 0.2)
    put(b["heart"], blip(659.25, dur=1.2, tau=0.5), 0.08, 0.2)
    # the light
    put(b["beam"], chime([523.25, 659.25, 783.99, 1046.5], dur=4.0, tau=1.6), 0.08)
    put(b["think"], chime([698.46, 880.0, 1046.5], dur=3.0, tau=1.2), 0.08)
    for k in range(5):
        put(b["push"] + k * 1.1, blip([523.25, 587.33, 659.25, 698.46, 783.99][k], dur=1.0, tau=0.4), 0.05, -0.3 + k * 0.15)
