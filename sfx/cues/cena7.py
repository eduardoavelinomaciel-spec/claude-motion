"""Sound for Story 1, scene 7 (who gets there first). Times from anime/timeline7.json.

    python3 -m sfx sfx/cues/cena7.py
"""

import random

from sfx.synth import blip, chime, click, envelope, pad, pop, whoosh

TIMELINE = "anime/timeline7.json"
OUT = "anime/out/cena7.wav"
TARGET_LUFS = -14.0

HOME = [174.61, 261.63, 349.23, 440.0, 523.25]   # F major
LIFT = [233.08, 349.23, 440.0, 587.33]           # Bb
WARM = [146.83, 220.0, 349.23, 440.0, 587.33]    # Dm7 -> soft, for the eyes
RPG = [523.25, 659.25, 783.99, 1046.5]


def card(put, t):
    put(t, whoosh(0.3, 800, 2400, peak=0.3), 0.08)
    for i, f in enumerate(RPG):
        put(t + 0.5 + i * 0.07, blip(f, dur=0.18, tau=0.05), 0.08)
    for i in range(10):
        put(t + 0.8 + i * 0.05, click(2600, 0.015), 0.04)


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(7)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0), (0.8, 1), (dur - 1.2, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, HOME), (s[2]["start"], LIFT), (s[4]["start"], WARM), (s[5]["start"], HOME)], volume=vol), gain=0.035)

    # each panel: a page-turn swish, a rising note, the dog's happy wag
    for i, p in enumerate(tl["panels"]):
        put(p, whoosh(0.35, 500, 1800, peak=0.3), 0.1, -0.4 + i * 0.27)
        put(p + 0.2, blip([349.23, 392.0, 440.0, 523.25][i], dur=0.5), 0.12)
        t = p
        while t < p + 2.0:
            put(t, click(420 + rnd.random() * 60, 0.05), 0.07, -0.3)
            t += 0.33
    put(b["zoom"], whoosh(0.7, 300, 1200, peak=0.6), 0.12)

    # pointing
    put(b["raise"], whoosh(0.5, 400, 1100, peak=0.7), 0.1)
    put(b["ali"], blip(523.25, dur=0.5), 0.12)
    for k, dt in enumerate([0.3, 0.7]):
        put(b["go"] + dt, click(1300 + k * 200, 0.04), 0.3)
    t = b["go"]
    while t < b["land"] - 0.2:
        put(t, click(1500 + rnd.random() * 300, 0.03), 0.12, 0.2)
        t += 0.14
    put(b["land"] - 0.3, whoosh(0.3, 600, 1800, peak=0.8), 0.12, 0.3)
    put(b["land"], pop(300, 160, dur=0.2), 0.32, 0.3)
    put(b["land"] + 0.1, chime([523.25, 659.25, 783.99], dur=1.2, tau=0.4), 0.07, 0.3)

    card(put, b["card1"])

    # eyes: threads shimmer
    t = b["threads"]
    while t < s[4]["end"] - 0.3:
        put(t, blip(rnd.choice([880.0, 1046.5, 1174.66, 1396.91]), dur=0.4, tau=0.15), 0.035, rnd.uniform(-0.6, 0.6))
        t += 0.17
    put(b["threads"], chime([587.33, 698.46, 880.0, 1174.66], dur=3.5, tau=1.4), 0.08)
    # bowl: water drops
    for k in range(3):
        put(b["ripple"] + k * 0.55, pop(900 - k * 80, 1400, dur=0.1), 0.12, -0.3)

    card(put, b["card2"])
    put(b["card2"] + 1.2, chime([349.23, 440.0, 523.25, 698.46], dur=3.0, tau=1.2), 0.08)
