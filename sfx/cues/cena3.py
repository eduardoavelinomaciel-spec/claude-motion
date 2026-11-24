"""Sound for Story 1, scene 3 (routine, bus stop). Times from anime/timeline3.json.

    python3 -m sfx sfx/cues/cena3.py
"""

import random

from sfx.synth import blip, chime, click, envelope, pad, pop, whoosh

TIMELINE = "anime/timeline3.json"
OUT = "anime/out/cena3.wav"
TARGET_LUFS = -14.0

GREY = [146.83, 220.0, 293.66, 349.23]        # Dm, a little flat and routine
WARM = [174.61, 261.63, 349.23, 440.0, 523.25]  # F major when the dog decides
TICK = [587.33, 523.25, 440.0, 523.25]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(3)
    s = {x["id"]: x for x in tl["shots"]}

    vol = envelope([(0, 0), (1.0, 1), (dur - 1.2, 1), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, GREY), (s[5]["start"], WARM)], volume=vol), gain=0.035)

    # his steps, steady as a metronome; the routine music-box loops the same 4 notes
    t = 0.2
    while t < s[5]["start"]:
        if not (s[2]["start"] <= t < s[2]["end"]):
            put(t, click(420 + rnd.random() * 60, 0.05), 0.12, 0.0)
        t += 1 / 1.34
    t, i = 0.4, 0
    while t < s[3]["start"]:
        put(t, blip(TICK[i % 4], dur=0.35, tau=0.1), 0.06, -0.2)
        t += 0.75
        i += 1
    # routine panels: clock ticking fast + a swish per day
    t = s[2]["start"]
    while t < s[2]["end"]:
        put(t, click(2400, 0.02), 0.08, 0.6)
        t += 0.1
    for k in range(3):
        put(s[2]["start"] + 0.3 + k * 0.5, whoosh(0.4, 600, 2200, peak=0.4), 0.12, -0.3 + k * 0.3)
    # traffic at the bus stop
    put(s[3]["start"], whoosh(2.2, 300, 900, peak=0.5, q=1.2), 0.08, 0.7)
    put(b["bang"], pop(800, 1600), 0.3, 0.3)
    put(b["cap4"], blip(293.66, dur=0.8), 0.12)
    # curious tilt: two rising pops
    put(b["tilt"], pop(500, 900, dur=0.18), 0.22)
    put(b["tilt2"], pop(700, 1300, dur=0.18), 0.24)
    # gets up, paws: TEC TEC TEC, then a light trot
    put(b["getUp"], whoosh(0.3, 400, 1400, peak=0.3), 0.12)
    for k, dt in enumerate([0.4, 0.7, 1.0]):
        put(b["getUp"] + dt, click(1300 + k * 200, 0.04), 0.3, -0.1 + k * 0.1)
        put(b["getUp"] + dt, blip(659.25 + k * 130, dur=0.25, tau=0.06), 0.1)
    t = b["getUp"] + 1.2
    while t < dur - 0.4:
        put(t, click(1500 + rnd.random() * 300, 0.03), 0.12, 0.1)
        t += 0.2
    put(b["getUp"] + 0.4, chime([523.25, 659.25, 783.99], dur=2.2, tau=0.8), 0.08)
