# Time Capsules animation repo

Read README.md and STYLE.md first. Making a new episode:
1. `bash scripts/setup.sh`.
2. Put the person's script in `episodes/<slug>/script.md` exactly as written. Only voicing spellings change in `narration.txt` (numbers as words, "960 AD" → "nine sixty A.D."); list every change in script.md. Flag shaky history in script.md, never silently rewrite it.
3. Split into chapters of 1-2 minutes at the script's natural breaks (`chapters/chNN/narration.txt`, `title.txt`), then `python3 scripts/voice.py episodes/<slug> --voice bm_george --speed 0.92`.
4. Write `chapters/chNN/scenes.js` (copy an existing chapter; scene `at` times come from `timings.json` sentence starts). First line comments set `// @style song` and `// @pad <seconds after the voice>`.
5. Check frames with `node scripts/snap.js <chapter> /tmp/x.png <times…>` and look at them before rendering. `npx -y hyperframes@0.9.85 lint` inside the chapter must show 0 errors (no requestAnimationFrame, no performance.now, no Math.random in compositions).
6. Render one chapter per command in the background (`scripts/render.sh`), ~2.5x real time on a 4-core cloud machine. Then `scripts/join.sh`.
7. Publish: encode a 720p web copy (`ffmpeg -i final.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 27 -movflags +faststart -c:a aac -b:a 128k docs/videos/<slug>-720p.mp4`, under 50 MB), add the episode to `docs/episodes.json` with a poster in `docs/posters/`. Deliver the 1080p master (crf 25) as a file. Releases can't be created from Claude cloud sessions.
Never commit *.wav or any other *.mp4.
