"""Sound for Story 1, scene 8 (rain and the corner, tension). Times from anime/timeline8.json.

    python3 -m sfx sfx/cues/cena8.py
"""

import math
import random

from sfx.synth import bandnoise, blip, click, envelope, pad, pop, riser, whoosh

TIMELINE = "anime/timeline8.json"
OUT = "anime/out/cena8.wav"
TARGET_LUFS = -14.0
SR = 48000

COLD = [110.0, 164.81, 220.0, 261.63]     # Am, rain
DREAD = [103.83, 155.56, 207.65, 246.94]  # G#dim-ish, the ears
PULSE = [110.0, 116.54]


def score(mix, tl):
    b, dur = tl["beats"], tl["duration"]
    put = mix.put
    rnd = random.Random(8)
    s = {x["id"]: x for x in tl["shots"]}
    end = b["black"]

    vol = envelope([(0, 0), (1.5, 1), (end - 0.05, 1), (end, 0), (dur, 0)])
    mix.put_stereo(0, *pad(dur, [(0, COLD), (b["ears"], DREAD)], volume=vol), gain=0.035)

    # rain: a bed of filtered noise in 1 s chunks, getting heavier; drops on top
    t = 0.0
    while t < end:
        g = 0.05 + 0.07 * min(1.0, t / 7)
        put(t, bandnoise(int(1.1 * SR), lambda k: 3500 + 800 * ((k // 4000) % 3), q=0.5), g, rnd.uniform(-0.4, 0.4))
        t += 1.0
    t = 0.2
    while t < end:
        put(t, click(2600 + rnd.random() * 1500, 0.015), 0.03 + 0.03 * min(1.0, t / 7), rnd.uniform(-0.9, 0.9))
        t += 0.05 + rnd.random() * (0.25 - 0.18 * min(1.0, t / 7))

    # opening shot: his shoes step through the puddle (same maths as anim8.js STRIKES)
    for n in range(12):
        ts = 3.4 + (math.pi / 2 + n * math.pi) / 4.2
        if ts >= s[1]["end"]:
            break
        x = -520 + (ts - 3.4) * 506 + 326
        pan = max(-0.9, min(0.9, (x - 960) / 960))
        put(ts, pop(160, 90, dur=0.1), 0.2, pan)
        if abs(x - 980) / 760 < 0.85:
            put(ts, bandnoise(int(0.45 * SR), lambda k: 1800 - k / 20, q=0.7), 0.22, pan)
            put(ts + 0.05, whoosh(0.3, 2200, 900, peak=0.2), 0.08, pan)
    # phone: a few soft notification blips while he scrolls
    for k, tt in enumerate([s[2]["start"] + 0.8, s[2]["start"] + 3.1, s[2]["start"] + 5.6]):
        put(tt, blip(1318.51, dur=0.15, tau=0.04), 0.05, -0.2)
    put(b["think"], blip(220.0, dur=0.9), 0.1)
    # heartbeat-like pulse building under the scene
    t = s[2]["start"]
    while t < end:
        rate = 1.1 if t < b["ears"] else 0.6 if t < b["vrrm"] else 0.4
        put(t, pop(70, 50, dur=0.14), 0.18, 0)
        put(t + 0.16, pop(65, 48, dur=0.12), 0.12, 0)
        t += rate

    # crash zoom + ears
    put(b["crash"], whoosh(0.5, 300, 3000, peak=0.85), 0.2)
    put(b["ears"], pop(500, 1400, dur=0.12), 0.25)
    put(b["bang"], blip(880.0, dur=0.25, tau=0.06), 0.15)
    put(b["bang"] + 0.12, blip(880.0, dur=0.25, tau=0.06), 0.15)

    # the engine: rising noise + low growl, riser into the flare, hard cut
    put(b["beams"], whoosh(end - b["beams"], 120, 900, peak=0.95, q=1.6), 0.25, -0.5)
    put(b["vrrm"], bandnoise(int((end - b["vrrm"]) * SR), lambda k: 90 + k / SR * 60, q=2.5), 0.35, -0.3)
    put(end - 4.0, riser(4.0, 200, 4800), 0.2)
    for i in range(9):
        put(b["vrrm"] + i * 0.22, click(300 + i * 40, 0.05), 0.08 + i * 0.01, -0.6 + i * 0.12)
