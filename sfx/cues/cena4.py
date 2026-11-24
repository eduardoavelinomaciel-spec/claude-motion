"""Sound for Story 1, scene 4 (waiting at the bakery). Times from anime/timeline4.json.

    python3 -m sfx sfx/cues/cena4.py
"""

import random

from sfx.synth import blip, chime, click, envelope, pad, pop, whoosh

TIMELINE = "anime/timeline4.json"
OUT = "anime/out/cena4.wav"
TARGET_LUFS = -14.0

WAIT = [174.61, 261.63, 329.63, 392.0]          # Fmaj7, patient
WARM = [174.61, 261.63, 349.23, 440.0, 523.25]  # F major, the bread
TENSE = [146.83, 220.0, 293.66, 349.23]         # Dm when he walks out
LOVE = [233.08, 349.23, 440.0, 523.25, 587.33]  # Bb add9, "amigo"


def score(mix, tl):
    b, c, dur = tl["beats"], tl["cuts"], tl["duration"]
    put = mix.put
    rnd = random.Random(4)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0), (1.2, 1), (b["opa"] - 0.2, 1), (b["opa"], 0.4), (b["opa"] + 1.5, 1), (dur - 1.5, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, WAIT), (s[3]["start"], WARM), (s[5]["start"], TENSE), (s[6]["start"], LOVE)], volume=vol), gain=0.035)

    # the bakery clock: slow tick through the window shot, a fast run on the close-up
    t = 0.5
    while t < s[1]["end"]:
        put(t, click(2200, 0.03), 0.06, 0.6)
        t += 1.0
    t = c["clockIn"] + 0.2
    while t < c["clockIn"] + 1.1:
        put(t, click(2600, 0.02), 0.1, 0.2)
        t += 0.03
    put(c["clockIn"] + 1.1, blip(523.25, dur=0.6), 0.12)
    put(b["cap1"], blip(392.0, dur=0.7), 0.1)
    put(b["cap2"], blip(349.23, dur=0.8), 0.1)

    # the baker's hands: soft swish down, bread lands, paws tap happily
    put(b["handDown"], whoosh(1.0, 1800, 500, peak=0.7), 0.12, 0.4)
    put(b["release"] - 0.05, pop(300, 200, dur=0.12), 0.25, 0.1)
    for k in range(4):
        put(b["paws"] + k * 0.3, click(900 + k * 120, 0.04), 0.22, -0.4 + (k % 2) * 0.3)
    # chewing, the glint on the saved half, the icon
    t = b["chew"]
    while t < b["chew"] + 0.9:
        put(t, click(700 + rnd.random() * 200, 0.03), 0.12, -0.2)
        t += 0.12
    put(b["glint"], chime([1046.5, 1318.5, 1568.0], dur=1.2, tau=0.4), 0.06, 0.5)
    put(b["icon"], pop(600, 1200), 0.25)

    # Otávio walks out fast, nearly trips
    t = s[5]["start"] + 0.2
    while t < b["opa"]:
        put(t, click(420 + rnd.random() * 60, 0.05), 0.14, 0.5)
        t += 0.34
    put(b["opa"], whoosh(0.35, 500, 1600, peak=0.2), 0.2)
    put(b["opa"], pop(900, 400, dur=0.2), 0.3)
    put(b["sai"], blip(293.66, dur=0.6), 0.1)

    # rack focus, sparkle, hearts, tail
    put(b["focus"], whoosh(1.0, 400, 1200, peak=0.6), 0.08)
    put(b["focus"] + 0.9, chime([1174.66, 1396.91, 1760.0], dur=1.6, tau=0.6), 0.07)
    for i in range(3):
        put(b["hearts"] + i * 0.25, pop(700 + i * 180, 1200 + i * 200), 0.22, -0.3 + i * 0.3)
    t = b["abana"]
    while t < dur - 0.8:
        put(t, whoosh(0.12, 600, 1400, peak=0.5), 0.06, 0.6 if int((t - b["abana"]) / 0.15) % 2 else 0.4)
        t += 0.15
    put(b["hearts"] + 0.2, chime([466.16, 587.33, 698.46, 932.33], dur=2.6, tau=1.0), 0.08)
