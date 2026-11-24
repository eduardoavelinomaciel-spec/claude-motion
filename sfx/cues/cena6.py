"""Sound for Story 1, scene 6 (the laugh). Times from anime/timeline6.json.

    python3 -m sfx sfx/cues/cena6.py
"""

import random

from sfx.synth import blip, chime, click, envelope, pad, pop, whoosh

TIMELINE = "anime/timeline6.json"
OUT = "anime/out/cena6.wav"
TARGET_LUFS = -14.0

BRIGHT = [196.0, 293.66, 392.0, 493.88, 587.33]   # G major, the laugh
TENDER = [174.61, 261.63, 349.23, 440.0, 523.25]  # F major, the scarf
DEEP = [130.81, 196.0, 329.63, 392.0, 493.88]      # Cmaj7, the sunset
HA = [392.0, 440.0, 493.88, 587.33, 493.88, 587.33, 659.25, 783.99, 987.77]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(6)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0.3), (b["burst"], 1), (dur - 3.0, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, BRIGHT), (s[2]["start"], TENDER), (s[4]["start"], DEEP)], volume=vol), gain=0.04)

    # held-in giggle, then the burst: one bright note per letter
    t = b["hold"]
    while t < b["burst"]:
        put(t, pop(500 + rnd.random() * 200, 600, dur=0.06), 0.06)
        t += 0.13
    put(b["burst"], whoosh(0.4, 400, 2400, peak=0.3), 0.18)
    for i, f in enumerate(HA):
        put(b["ha"] + i * 0.11, blip(f, dur=0.3, tau=0.08), 0.12, -0.6 + i * 0.15)
        put(b["ha"] + i * 0.11, pop(f * 1.5, f * 2, dur=0.08), 0.08, -0.6 + i * 0.15)
    put(b["ha"] + 1.1, chime([783.99, 987.77, 1174.66], dur=1.6, tau=0.5), 0.08)

    # scarf rubbing: soft cloth swishes
    put(b["hands"], whoosh(0.5, 900, 500, peak=0.5), 0.1)
    t = b["rub"]
    while t < b["rubEnd"]:
        put(t, whoosh(0.22, 700 + rnd.random() * 300, 1600, peak=0.5, q=0.6), 0.07, 0.2)
        t += 0.29
    put(b["olha"], blip(349.23, dur=0.6), 0.1)
    # eyes close, tongue, thought
    put(b["eyes"], chime([523.25, 659.25, 783.99], dur=2.0, tau=0.8), 0.07)
    put(b["tongue"], pop(300, 500, dur=0.12), 0.12)
    put(b["think"], chime([440.0, 523.25, 698.46, 880.0], dur=3.0, tau=1.2), 0.08)
    # sunset: crane rises, long warm chord under the caption
    put(s[4]["start"], whoosh(3.0, 200, 900, peak=0.7, q=1.4), 0.08)
    put(b["nem"], chime([261.63, 329.63, 392.0, 493.88], dur=4.0, tau=1.6), 0.09)
    for k in range(4):
        put(s[4]["start"] + 0.5 + k * 1.6, blip(DEEP[k + 1] * 2, dur=0.9, tau=0.4), 0.04, -0.3 + k * 0.2)
