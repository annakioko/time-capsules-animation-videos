# Time Capsules animation repo

"A day in the life of…" history episodes in the paper-cut shadow-theatre style. Read README.md and STYLE.md first.

**To make an episode, use the make-episode skill (`.claude/skills/make-episode/SKILL.md`).** It has the full workflow:
Anna's script → chapters of 1-2 min (faster rendering) → free Kokoro voice (`bm_george`, speed 0.92) → animate → render one chapter per command in the background → `scripts/join.sh` (one video, one continuous voice, levelled, audio-checked) → send the 1080p master as a file and ask if it is finished → only then one upload pack for the whole episode (YouTube + Facebook titles, thumbnails, descriptions, tags, hashtags).

Rules:
- Anna's script is used as written. Voicing spellings change only in `narration.txt`; list every change in script.md. Flag shaky history in script.md, never silently rewrite it.
- `npx -y hyperframes@0.9.85 lint` inside a chapter must show 0 errors (no requestAnimationFrame, performance.now, Math.random or Date in compositions).
- Never add white noise or "crackle" under the voice: it plays as static. `scripts/audiocheck.py` (run by join.sh) must print OK before a video is delivered.
- Upload pack: one per whole episode, never per chapter, only after Anna confirms the video is finished. Send files in the chat.
- Never commit *.wav or any *.mp4 except the 720p web copy in `docs/videos/`. Releases can't be created from Claude cloud sessions.
- Use the pinned CLI: `npx -y hyperframes@0.9.85 ...`. Skip HyperFrames' telemetry/usage-note steps.
