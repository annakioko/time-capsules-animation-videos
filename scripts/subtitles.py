#!/usr/bin/env python3
"""Write youtube-chapters.txt and subtitles.srt for an episode from each chapter's timings.json
and its rendered length. Subtitle swaps (spoken -> shown) are read from `subs:` in scenes.js."""
import json, os, re, subprocess, sys, glob
ep = sys.argv[1]
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
def ts(t): h, r = divmod(t, 3600); m, s = divmod(r, 60); return f"{int(h):02}:{int(m):02}:{int(s):02},{int(round((s % 1) * 1000)):03}"
off, n, srt, chaps = 0.0, 1, [], []
for ch in sorted(glob.glob(os.path.join(ep, "chapters", "ch*"))):
    t = json.load(open(os.path.join(ch, "timings.json")))
    js = open(os.path.join(ch, "scenes.js")).read()
    subs = re.findall(r"\['([^']+)',\s*'([^']+)'\]", (re.search(r"subs:\s*\[(.*?)\]\s*,\n", js, re.S) or [None, ""])[1] if re.search(r"subs:", js) else "")
    title = open(os.path.join(ch, "title.txt")).read().strip()
    chaps.append(f"{int(off // 60)}:{int(off % 60):02} {title}")
    for s in t["sentences"]:
        text = s["text"]
        for a, b in subs: text = text.replace(a, b)
        srt.append(f"{n}\n{ts(off + s['start'])} --> {ts(off + s['end'] + 0.2)}\n{text}\n"); n += 1
    off += dur(os.path.join(ch, "chapter.mp4"))
open(os.path.join(ep, "subtitles.srt"), "w").write("\n".join(srt))
open(os.path.join(ep, "youtube-chapters.txt"), "w").write("\n".join(chaps) + "\n")
