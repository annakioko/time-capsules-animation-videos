---
name: make-episode
description: Make a Time Capsules "A day in the life of…" history episode from Anna's script - split into chapters, free Kokoro voice, paper-cut shadow-theatre animation, render chapter by chapter, join into one video with one continuous voice, then (after she confirms it is finished) a YouTube + Facebook upload pack with titles, thumbnails, descriptions and hashtags. Use for "make an episode", "here is my script", "/make-episode", "render chapter N", or "package it".
---

# Make a Time Capsules episode

Input: Anna's script (she writes it; use it as written). Output, in order:
1. `episodes/<slug>/final.mp4`: one video, all chapters joined, one continuous voice, levelled to -14 LUFS, no hiss.
2. After she confirms the video is finished: one upload pack for the whole episode (YouTube + Facebook).

Read `STYLE.md` first. The look is the paper-cut shadow theatre in `lib/stage.js` + `styles/<culture>/`.
Reference episode: `episodes/song-wet-nurse/` (copy its chapter structure).

## 0. Setup
`bash scripts/setup.sh` (the SessionStart hook also runs it).

## 1. Script (no approval stop: Anna's script is approved when she sends it)
- Make `episodes/<slug>/script.md`: title, timeline, chapter table, voicing changes, history notes, then her script exactly as written.
- Voicing changes only go in `narration.txt` (numbers and years as words: "960 AD" → "nine sixty A.D."). List each change in script.md and add a `subs` swap so subtitles show the written form.
- History: check claims against sources. Flag shaky history in script.md and tell her; never silently rewrite her words.
- `[VISUAL]` lines are directions, not narration.

## 2. Split into chapters (for faster rendering)
- Chapters of 1-2 minutes at the script's natural breaks: `chapters/chNN/narration.txt` (blank line between paragraphs) and `title.txt` (short chapter name; it becomes a YouTube chapter).
- Voice: `python3 scripts/voice.py episodes/<slug> --voice bm_george --speed 0.92` (same voice every episode). It writes `voice.wav` (never committed) and `timings.json`.

## 3. Animate each chapter
- `chapters/chNN/scenes.js`: copy a reference chapter. First lines `// @style <culture>` and `// @pad <seconds after the voice>` (pad 1-2 s, last chapter ~5 s for the fade to black).
- Scene `at` times come from sentence starts in `timings.json`. New scene every 5-12 s; a camera move in every scene; title card after the hook.
- No `Math.random`, `requestAnimationFrame`, `performance.now` or `Date`. Nothing loads from the internet.
- Check: `node scripts/snap.js episodes/<slug>/chapters/chNN /tmp/x.png <8-12 times>` and look at the sheet. `npx -y hyperframes@0.9.85 lint` inside the chapter must show 0 errors.

## 4. Render, one chapter per command, in the background
`bash scripts/render.sh episodes/<slug>/chapters/chNN` (add `draft` for a quick 15 fps preview). About 2.5x real time on 4 cores, about 5x on 2 cores. Check on each render; a stopped session loses at most one chapter.

## 5. Join into one video
`bash scripts/join.sh episodes/<slug>`. It:
- joins the chapters into one `final.mp4` (the voice runs continuously across the chapter joins),
- levels the voice to -14 LUFS (YouTube/Facebook loudness),
- writes `youtube-chapters.txt` and `subtitles.srt`,
- runs `scripts/audiocheck.py`. **If it prints FAIL, do not deliver**: there is hiss under the voice.
- No background noise by default. `--bed` adds a very quiet low room tone only; never add white noise or "crackle" (that was the static bug).

Then:
- Encode the upload file and send it in the chat as a file (this is the file she uploads to Facebook and YouTube; the screening room is only for watching): `ffmpeg -i final.mp4 -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -preset slow -crf 30 -maxrate 6M -bufsize 12M -r 30 -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart <Title-With-Dashes>.mp4` (1080p MP4, about 50 MB for 5 minutes). Run `python3 scripts/audiocheck.py <that file> episodes/<slug>` on it too.
- Web copy for the screening room: `ffmpeg -i final.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 29 -movflags +faststart -c:a aac -b:a 128k docs/videos/<slug>-720p.mp4` (under 50 MB), add/update the episode in `docs/episodes.json`, poster in `docs/posters/<slug>.jpg`.
- **Screening room** (stream in full 1080p without downloading): the Claude artifact "Time Capsules Screening Room", slug `43514761-8bac-4aa5-b73f-e2b5b6fb3f8f`. Cut the 1080p master into HLS pieces: `ffmpeg -i <slug>-1080p.mp4 -c copy -f hls -hls_time 8 -hls_playlist_type vod -hls_segment_type fmp4 -hls_fmp4_init_filename init.mp4 -hls_segment_filename '<id>/s%03d.mp4' <id>/index.m3u8`, rename `index.m3u8` to `index.txt`, add `poster.jpg`. Read the artifact's `index.html`, add the episode at the top of the `EPISODES` array (id, title, timeline, status, length, note, chapters in seconds), and publish with the artifact files tool in batches under 60 MB (patch mode keeps the other episodes). Replacing an episode: remove its old pieces in the same publish.
- Ask: **"Is the video finished, or do you want changes?"** Wait for her answer.

## 6. Upload pack (only after she confirms it is finished; one pack per whole episode, never per chapter)
Save everything in `episodes/<slug>/packaging/` and send the images and `PACKAGING.md` as files in the chat.

### Research first (do not skip)
1. Search YouTube and the web for the 5-10 best-performing history videos on the same subject or format ("a day in the life of a …", "worst jobs in history", the culture and era). Note title patterns, thumbnail ideas and the search phrases people use. Never copy a title.
2. Quick search for current platform rules (YouTube title/description/hashtag limits; Facebook video, thumbnail and feed rules), because they change.
3. Never invent a number, view count or source.

### YouTube
- **Title**: 3 options, winner first. Max 60 characters, first ~40 make sense alone. Use the search phrase people type (e.g. "A Day in the Life of a …"). Max 2 all-caps words.
- **Thumbnail** (1280x720): `node scripts/thumbnail.js episodes/<slug>/chapters/chNN <time> episodes/<slug>/packaging/youtube-thumb.png "<MAX 3 WORDS>" --small "<culture · year>" --side left --accent "<one word>"`. Pick the most dramatic frame (check with snap.js first). The words must NOT repeat the title. Look at the `.preview-320.png`: the words and figure must still read.
- **Description**: first 2 lines = hook + main search phrase. Then a 2-3 sentence summary, chapters from `youtube-chapters.txt`, a short sources line for the key history, a comment question, then 3 hashtags.
- **Tags**: 10-15 from the research.
- **Captions file**: upload `subtitles.srt`.

### Facebook (long-form landscape)
- **Title**: more emotional than YouTube, written for scrollers. Max ~60 characters.
- **Thumbnail** (1280x720): its own image, different frame or words from YouTube, tuned to the Facebook title, `--side center` so words and figure sit in the central 4:5 area (a feed crop keeps them).
- **Caption**: first line is a bold hook with contrast or tension (only it shows before "See more"). Then 2-4 short lines, 2-3 key moments with timestamps, and a question for comments.
- **Hashtags**: 3-5, broad plus niche (#history #ancienthistory + the culture).
- Upload `subtitles.srt` as captions (most Facebook viewers watch muted; subtitles are also burned in).

### PACKAGING.md
One copy-paste block per platform: YouTube (titles with winner first, description, tags, hashtags) then Facebook (title, caption, hashtags), and one line per image saying where it goes.

## Report
Tell Anna: the video (sent as a file), the chapter list, the audio check result, any history flags. After the pack: the files sent.
Never commit `*.wav` or any `*.mp4` except the 720p web copy in `docs/videos/`.
