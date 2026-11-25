# Time Capsules: animation studio

"A day in the life of…" history episodes in a bright flat cartoon style: flat colour with ink outlines, expressive faces, period costumes that show rank, swaying lanterns and slow camera moves, framed by the channel's gold key-fret border. Fireside second-person narration,
8-12 minutes, for YouTube and Facebook long-form.

**Watch finished episodes in full 1080p without downloading:** the Claude artifact "Time Capsules Screening Room" (https://claude.ai/artifact/9K8m2VEg3HHVRVZhbLK9Ae). The GitHub Pages copy in `docs/` (https://annakioko.github.io/time-capsules-animation-videos/) streams a 720p version.
(the screening room in `docs/`; videos stream, nothing to download).

## How an episode is made
script → free Kokoro voice (`bm_george`, same as the video-studio repo) → one HTML stage per chapter → HyperFrames render → join → screening room.

```bash
bash scripts/setup.sh                                        # once per session: voice model, ffmpeg, HyperFrames
python3 scripts/voice.py episodes/<slug> --speed 0.92         # voices every chapter, writes timings.json
node scripts/snap.js episodes/<slug>/chapters/ch01 /tmp/c1.png 2 10 20 30   # preview frames before rendering
bash scripts/render.sh episodes/<slug>/chapters/ch01          # one chapter at a time, in the background
bash scripts/join.sh episodes/<slug>                          # one final.mp4 (levelled, audio-checked) + youtube-chapters.txt + subtitles.srt
node scripts/thumbnail.js episodes/<slug>/chapters/ch01 18 episodes/<slug>/packaging/youtube-thumb.png "TASTE IT FIRST" --accent FIRST
```

The whole flow, including the YouTube + Facebook upload pack, is in the **make-episode** skill (`.claude/skills/make-episode/SKILL.md`).

## Layout
| Path | What it is |
|---|---|
| `lib/stage.js` | The engine shared by every timeline: scenes, camera push/pan, parallax layers (`data-depth`), firelight flicker (`.glow`, `.flame`, `.sway`), grain, burned-in subtitles, title cards, fades. Every frame is a pure function of time. |
| `styles/<culture>/` | One kit per timeline/culture. **`styles/flat/`** is the house style (Song dynasty China in bright flat colour; reference chapter `episodes/style-sample-flat/chapters/ch01`). `styles/song/` is the retired paper-cut look, kept for The Palace Wet Nurse. |
| `templates/chapter.html` | The chapter page; `scripts/build.py` fills it from a chapter's `scenes.js` + `timings.json`. |
| `episodes/<slug>/` | `script.md` (the script as written, voicing notes, history notes) and `chapters/chNN/` (`narration.txt`, `title.txt`, `scenes.js`, `timings.json`). |
| `docs/` | The screening room (GitHub Pages). `episodes.json` lists the episodes. |

Rules: [STYLE.md](STYLE.md). Working notes for Claude: [CLAUDE.md](CLAUDE.md).

## Where the videos live
The screening room plays a 720p web copy of each episode from `docs/videos/` (kept under ~50 MB, the only MP4s in git).
Full-quality 1080p masters for YouTube/Facebook are delivered as files, not committed. `*.wav` and every other `*.mp4` are ignored.
