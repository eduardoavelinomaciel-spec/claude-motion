"""Sound for Story 1, scene 12 (Companheiro, the end). Times from anime/timeline12.json.

    python3 -m sfx sfx/cues/cena12.py
"""

import random

from sfx.synth import blip, chime, click, envelope, pad, pop, whoosh

TIMELINE = "anime/timeline12.json"
OUT = "anime/out/cena12.wav"
TARGET_LUFS = -14.0

HOME = [174.61, 261.63, 349.23, 440.0, 523.25]    # F major
LIFT = [233.08, 349.23, 466.16, 587.33]           # Bb
END = [130.81, 196.0, 261.63, 329.63, 392.0]      # C major, resolved
MELODY = [523.25, 587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33, 523.25]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(12)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0), (1.0, 1), (dur - 2.5, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, HOME), (s[3]["start"], LIFT), (s[4]["start"], HOME), (s[5]["start"], END)], volume=vol), gain=0.045)

    put(b["nome"], blip(440.0, dur=0.6), 0.1)
    put(b["click"], click(1500, 0.05), 0.4)
    put(b["click"] + 0.04, click(2600, 0.03), 0.25)
    put(b["tag"], chime([1046.5, 1318.51, 1567.98], dur=2.0, tau=0.7), 0.09)
    # wagging tail: quick swishes
    t = s[3]["start"]
    while t < s[3]["end"]:
        put(t, whoosh(0.1, 900, 1700, peak=0.5), 0.06, 0.5)
        t += 0.143
    put(b["soube"], chime([523.25, 659.25, 783.99, 1046.5], dur=3.0, tau=1.2), 0.08)
    # walking off: the melody, steps
    t, i = s[4]["start"] + 0.3, 0
    while t < s[4]["end"] - 0.3:
        put(t, blip(MELODY[i % len(MELODY)], dur=0.5, tau=0.18), 0.07, -0.2 + (i % 3) * 0.2)
        t += 0.75
        i += 1
    put(s[4]["start"] + 0.5, whoosh(8.0, 200, 700, peak=0.6, q=1.4), 0.06)
    put(b["cap"], blip(349.23, dur=1.0), 0.08)
    # end card
    put(b["q"], pop(500, 900), 0.18)
    put(b["title"], chime([261.63, 329.63, 392.0, 523.25, 659.25], dur=4.0, tau=1.6), 0.11)
