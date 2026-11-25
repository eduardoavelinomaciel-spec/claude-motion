"""Sound for Story 1, scene 11 (vet and the promise). Times from anime/timeline11.json.

    python3 -m sfx sfx/cues/cena11.py
"""

import random

from sfx.synth import blip, chime, click, envelope, impact, pad, pop, scratch, whoosh

TIMELINE = "anime/timeline11.json"
OUT = "anime/out/cena11.wav"
TARGET_LUFS = -14.0

BRIGHT = [196.0, 293.66, 392.0, 493.88, 587.33]   # G major
TUNE = [392.0, 493.88, 587.33, 493.88, 440.0, 392.0, 440.0, 493.88]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(11)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0), (0.6, 1), (dur - 1.2, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, BRIGHT)], volume=vol), gain=0.035)
    t, i = 0.2, 0
    while t < dur - 1:
        put(t, blip(TUNE[i % len(TUNE)], dur=0.3, tau=0.09), 0.05, -0.2 + (i % 2) * 0.4)
        t += 0.5
        i += 1
    # scale beeps then settles
    t = 0.2
    while t < b["kg"]:
        put(t, click(2600, 0.02), 0.06, 0.4)
        t += 0.08
    put(b["kg"], blip(1174.66, dur=0.25, tau=0.05), 0.12, 0.4)
    put(b["kg"] + 0.18, blip(1174.66, dur=0.25, tau=0.05), 0.12, 0.4)
    put(b["vet"], blip(587.33, dur=0.6), 0.1)
    # bath
    t = b["scrub"]
    while t < s[2]["end"] - 0.3:
        put(t, whoosh(0.16, 1200, 2600, peak=0.5, q=0.6), 0.08, rnd.uniform(-0.3, 0.3))
        t += 0.26
    for k in range(14):
        put(s[2]["start"] + 0.8 + rnd.random() * 6, pop(900 + rnd.random() * 700, 1800, dur=0.06), 0.12, rnd.uniform(-0.8, 0.8))
    for i in range(3):
        put(b["pop"] + i * 0.35, pop(1000 + i * 200, 1900, dur=0.07), 0.2, -0.3 + i * 0.3)
    # signature and stamp
    put(b["sign"], scratch(2.0), 0.18)
    put(b["tum"] - 0.4, whoosh(0.4, 1800, 300, peak=0.9), 0.12)
    put(b["tum"], impact(0.8), 0.4)
    put(b["tum"] + 0.1, chime([392.0, 493.88, 587.33, 783.99], dur=2.2, tau=0.8), 0.1)
    # sparkles
    for k in range(10):
        put(b["sparkle"] + k * 0.55 + rnd.random() * 0.2, blip(rnd.choice([1567.98, 1760.0, 1975.53, 2349.32]), dur=0.25, tau=0.06), 0.05, rnd.uniform(-0.7, 0.7))
    put(b["star"], chime([783.99, 987.77, 1174.66, 1567.98], dur=2.5, tau=1.0), 0.09)
