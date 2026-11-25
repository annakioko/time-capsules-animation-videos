#!/usr/bin/env python3
"""Check a final video's audio for hiss/static: the pauses between sentences must be near silent.

Usage: python3 scripts/audiocheck.py episodes/<slug>/final.mp4 episodes/<slug>
Prints speech level, pause level and loudness. Exits 1 if the pauses are less than 35 dB below the speech.
"""
import glob, json, os, subprocess, sys
import numpy as np

mp4, ep = sys.argv[1], sys.argv[2]
SR = 24000
raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", mp4, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"])
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
db = lambda v: 20 * np.log10(np.sqrt(np.mean(v ** 2)) + 1e-9) if len(v) else -180.0
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

off, speech, gaps = 0.0, [], []
for ch in sorted(glob.glob(os.path.join(ep, "chapters", "ch*"))):
    s = json.load(open(os.path.join(ch, "timings.json")))["sentences"]
    for a, b in zip(s, s[1:]):
        speech.append(x[int((off + a["start"]) * SR):int((off + a["end"]) * SR)])
        if b["start"] - a["end"] > 0.25:
            gaps.append(x[int((off + a["end"] + 0.08) * SR):int((off + b["start"] - 0.08) * SR)])
    off += dur(os.path.join(ch, "chapter.mp4"))

sp, gp = db(np.concatenate(speech)), db(np.concatenate(gaps))
print(f"Audio check: speech {sp:.1f} dB, pauses {gp:.1f} dB, difference {sp - gp:.0f} dB")
if sp - gp < 35:
    sys.exit("FAIL: the pauses are too loud. There is hiss or static under the voice. Do not deliver this video.")
print("OK: no static between sentences.")
