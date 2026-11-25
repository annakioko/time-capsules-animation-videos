#!/usr/bin/env python3
"""Voice a video's chapters with the free Kokoro voice, one sentence at a time.

Voicing sentence by sentence gives exact timings for free (no transcription needed).
For each chapter folder it writes:
  voice.wav      the narration
  timings.json   start/end time of every sentence (use these to time scenes and captions)

Usage:
  python3 scripts/voice.py videos/<slug>                 # all chapters without a voice.wav
  python3 scripts/voice.py videos/<slug> ch03            # one chapter (re-voices it)
  options: --voice bm_george  --speed 1.0
Voices: bm_george (British male, default), am_michael, am_adam, af_heart, af_nova, bf_emma, bf_isabella
"""
import argparse, glob, json, os, re, sys
import numpy as np
import soundfile as sf

CACHE = os.path.expanduser("~/.cache/hyperframes/tts")
MODEL = os.path.join(CACHE, "models", "kokoro-v1.0.onnx")
VOICES = os.path.join(CACHE, "voices", "voices-v1.0.bin")
SENT_GAP = 0.30   # seconds of silence between sentences
PARA_GAP = 0.70   # seconds of silence between paragraphs

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("chapter", nargs="?")
ap.add_argument("--voice", default="bm_george")
ap.add_argument("--speed", type=float, default=1.0)
a = ap.parse_args()

if not (os.path.exists(MODEL) and os.path.exists(VOICES)):
    sys.exit("Voice model not found. Run scripts/setup.sh first.")

import kokoro_onnx
model = kokoro_onnx.Kokoro(MODEL, VOICES)


def synth(text):
    try:
        s, sr = model.create(text, voice=a.voice, speed=a.speed, lang="en-gb" if a.voice.startswith("b") else "en-us")
        return np.asarray(s, dtype=np.float32), sr
    except IndexError:  # very long sentence: split in half and retry
        mid = text.rfind(" ", 0, len(text) // 2) or len(text) // 2
        l, sr = synth(text[:mid]); r, _ = synth(text[mid:])
        return np.concatenate([l, r]), sr


if a.chapter:
    chapters = [os.path.join(a.video, "chapters", a.chapter)]
else:
    chapters = [c for c in sorted(glob.glob(os.path.join(a.video, "chapters", "ch*")))
                if not os.path.exists(os.path.join(c, "voice.wav"))]

for ch in chapters:
    text = open(os.path.join(ch, "narration.txt")).read().strip()
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    audio, rows, t, sr = [], [], 0.0, 24000
    for pi, para in enumerate(paragraphs):
        sents = [s for s in re.split(r"(?<=[.?!])\s+", para) if s.strip()]
        for si, s in enumerate(sents):
            samples, sr = synth(s)
            d = len(samples) / sr
            rows.append({"i": len(rows) + 1, "para": pi + 1, "start": round(t, 2), "end": round(t + d, 2), "text": s})
            audio.append(samples); t += d
            gap = PARA_GAP if si == len(sents) - 1 else SENT_GAP
            audio.append(np.zeros(int(gap * sr), dtype=np.float32)); t += gap
    wav = np.concatenate(audio)
    sf.write(os.path.join(ch, "voice.wav"), wav, sr)
    json.dump({"duration": round(t, 2), "voice": a.voice, "sentences": rows},
              open(os.path.join(ch, "timings.json"), "w"), indent=1)
    print(f"{ch}: {t:.1f}s, {len(rows)} sentences")
