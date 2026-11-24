"""Sound for Story 1, scene 5 (city mess, comedy). Times from anime/timeline5.json.

    python3 -m sfx sfx/cues/cena5.py
"""

import random

from sfx.synth import blip, bandnoise, chime, click, envelope, impact, pad, pop, whoosh

TIMELINE = "anime/timeline5.json"
OUT = "anime/out/cena5.wav"
TARGET_LUFS = -14.0

BOUNCY = [196.0, 293.66, 392.0, 493.88]   # G major, playful
SOUR = [196.0, 277.18, 349.23, 466.16]    # Gdim-ish when the cat swats
GOLD = [174.61, 261.63, 349.23, 440.0, 523.25]  # F major, sunset turn
WALKTUNE = [392.0, 440.0, 493.88, 587.33, 493.88, 440.0]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(5)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0), (0.8, 1), (b["splash"], 1), (b["splash"] + 0.1, 0.3), (b["mudOut"] + 0.3, 1), (dur - 1.2, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, BOUNCY), (b["paf"], SOUR), (s[5]["start"], BOUNCY), (s[6]["start"], GOLD)], volume=vol), gain=0.035)

    # a bouncy walking tune, plucked, until the puddle
    t, i = 0.3, 0
    while t < b["splash"]:
        put(t, blip(WALKTUNE[i % len(WALKTUNE)], dur=0.3, tau=0.08), 0.05, -0.2 + (i % 2) * 0.4)
        t += 0.4
        i += 1
    # trotting paws
    t = 0.1
    while t < b["jump"]:
        if not (b["flap"] < t < b["flap"] + 0.6 or b["klang"] < t < s[4]["start"] or b["paf"] - 0.6 < t < s[5]["start"]):
            put(t, click(1500 + rnd.random() * 300, 0.03), 0.08, -0.1)
        t += 0.2

    # pigeons: many wing flaps
    for k in range(18):
        tt = b["flap"] + rnd.random() * 1.2
        put(tt, whoosh(0.15, 500, 1800, peak=0.3), 0.12, rnd.uniform(-0.8, 0.8))
    put(b["flap"], pop(400, 900), 0.2)

    # trash can
    for k in range(3):
        put(b["sniff"] + k * 0.15, whoosh(0.1, 2000, 3000, peak=0.5), 0.06)
    put(b["klang"] + 0.38, impact(0.6), 0.3, 0.1)
    put(b["klang"] + 0.38, chime([523.25, 739.99, 1046.5], dur=0.9, tau=0.25), 0.12, 0.1)
    put(b["klang"] + 0.4, bandnoise(int(1.4 * 48000), lambda k: 900 - k / 200, q=1.5), 0.12 * 0.4, 0.3)
    put(b["klong"], chime([392.0, 554.37, 783.99], dur=1.0, tau=0.3), 0.14, 0.5)
    t, gap = b["klong"] + 0.15, 0.2
    while gap > 0.02:
        put(t, click(1800, 0.02), 0.1, 0.5)
        t += gap
        gap *= 0.82
    # cat
    put(b["catEye"], blip(880.0, dur=0.3, tau=0.05), 0.08)
    put(b["paf"], whoosh(0.12, 3000, 800, peak=0.2), 0.2, 0.2)
    put(b["paf"] + 0.08, pop(1200, 300, dur=0.12), 0.3)
    put(b["angry"], pop(300, 200, dur=0.2), 0.2, 0.3)
    put(b["sweat"], pop(1400, 700, dur=0.2), 0.18, -0.3)
    # puddle
    put(b["jump"], whoosh(0.6, 400, 2200, peak=0.8), 0.18)
    put(b["splash"], impact(0.8), 0.35)
    put(b["splash"], bandnoise(int(0.9 * 48000), lambda k: 600 + k / 60, q=0.6), 0.25 * 0.6)
    put(b["mudIn"], bandnoise(int(0.6 * 48000), lambda k: 250 + 100 * ((k // 2400) % 2), q=2.0), 0.2 * 0.5)
    for k in range(6):
        put(b["mudIn"] + k * 0.09, pop(200 + k * 40, 120, dur=0.08), 0.12, rnd.uniform(-0.5, 0.5))
    put(b["mudOut"], whoosh(0.5, 1800, 500, peak=0.3), 0.15)
    put(b["star"], chime([1046.5, 1318.5, 1568.0], dur=1.4, tau=0.5), 0.1)
    # he turns
    put(b["turn"], whoosh(0.3, 600, 1400, peak=0.4), 0.1, 0.3)
    put(b["close"], blip(523.25, dur=0.6), 0.1)
    for k in range(6):
        put(b["twitch"] + k * 0.11, click(900 + k * 60, 0.02), 0.05)
