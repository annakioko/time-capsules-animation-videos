#!/usr/bin/env python3
"""Build a chapter's index.html from templates/chapter.html, its timings.json and scenes.js,
and copy the shared lib/ and styles/ in (HyperFrames renders the chapter folder on its own).

Usage: python3 scripts/build.py episodes/<slug>/chapters/chNN
Chapter settings come from the top of scenes.js:  // @style song  // @pad 4
"""
import json, os, re, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ch = sys.argv[1]
scenes = open(os.path.join(ch, "scenes.js")).read()
style = (re.search(r"@style\s+(\w+)", scenes) or [None, "song"])[1]
pad = float((re.search(r"@pad\s+([\d.]+)", scenes) or [None, "0"])[1])
t = json.load(open(os.path.join(ch, "timings.json")))
voice = t["duration"]
dur = round(voice + pad, 2)
title = open(os.path.join(ch, "title.txt")).read().strip() if os.path.exists(os.path.join(ch, "title.txt")) else ch
html = open(os.path.join(ROOT, "templates", "chapter.html")).read()
html = (html.replace("{{TITLE}}", title).replace("{{STYLE}}", style).replace("{{DURATION}}", str(dur))
            .replace("{{VOICE}}", str(voice)).replace("{{TIMINGS}}", json.dumps(t)))
open(os.path.join(ch, "index.html"), "w").write(html)
for d in ("lib", os.path.join("styles", style)):
    dst = os.path.join(ch, d)
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(os.path.join(ROOT, d), dst)
shutil.copy(os.path.join(ROOT, "lib", "hyperframes.json"), os.path.join(ch, "hyperframes.json"))
print(f"{ch}: {dur}s ({style}, pad {pad}s)")
