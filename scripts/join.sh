#!/usr/bin/env bash
# Join rendered chapters into ONE final.mp4 with one continuous voice track,
# level the voice for YouTube/Facebook (-14 LUFS), and write youtube-chapters.txt + subtitles.srt.
#
# Usage: scripts/join.sh episodes/<slug> [--bed]
#   --bed  adds a very quiet low firelight rumble under the voice (off by default).
#
# Why no crackle: the old version mixed gated white noise under the voice. The gate never closed,
# so every episode had loud hiss ("static") between and under the sentences. Never add white noise.
set -e
EP="${1:?Usage: scripts/join.sh episodes/<slug> [--bed]}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIST="$EP/concat.txt"; : > "$LIST"
for d in "$EP"/chapters/ch*/; do
  [ -f "$d/chapter.mp4" ] || { echo "Missing $d/chapter.mp4: render it first"; exit 1; }
  echo "file '$(cd "$d" && pwd)/chapter.mp4'" >> "$LIST"
done
# Video: copy the chapters end to end. Audio: cut/pad each chapter's audio to its exact video length
# and join as PCM, because copying AAC chapter by chapter drifts ~0.04 s per chapter (out of sync by ch07).
ffmpeg -v error -y -f concat -safe 0 -i "$LIST" -an -c:v copy "$EP/joined-v.mp4"
ALIST="$EP/concat-a.txt"; : > "$ALIST"
for d in "$EP"/chapters/ch*/; do
  VD=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$d/chapter.mp4")
  ffmpeg -v error -y -i "$d/chapter.mp4" -vn -af "apad=whole_dur=$VD,atrim=0:$VD" -ar 48000 -ac 2 -c:a pcm_s16le "$d/chapter-audio.wav"
  echo "file '$(cd "$d" && pwd)/chapter-audio.wav'" >> "$ALIST"
done
ffmpeg -v error -y -i "$EP/joined-v.mp4" -f concat -safe 0 -i "$ALIST" -map 0:v -map 1:a -c:v copy -c:a pcm_s16le "$EP/joined.mov"
rm -f "$EP/joined-v.mp4" "$EP"/chapters/ch*/chapter-audio.wav "$ALIST"
JOINED="$EP/joined.mov"

LEVEL="loudnorm=I=-14:TP=-1.5:LRA=11"
if [ "$2" = "--bed" ]; then
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$JOINED")
  FADE=$(python3 -c "print(max(0, $DUR-4))")
  # low brown-noise room tone only: under 200 Hz, about 40 dB below the voice
  ffmpeg -v error -y -i "$JOINED" \
    -f lavfi -i "anoisesrc=color=brown:amplitude=0.5:seed=7:duration=$DUR" \
    -filter_complex "[1]lowpass=f=200,volume=0.012,afade=t=in:d=2,afade=t=out:st=$FADE:d=4[bed];[0:a][bed]amix=inputs=2:normalize=0:duration=first,$LEVEL[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$EP/final.mp4"
else
  ffmpeg -v error -y -i "$JOINED" -af "$LEVEL" \
    -map 0:v -map 0:a -c:v copy -c:a aac -b:a 192k -ar 48000 "$EP/final.mp4"
fi
rm -f "$JOINED"
python3 "$ROOT/scripts/subtitles.py" "$EP"
python3 "$ROOT/scripts/audiocheck.py" "$EP/final.mp4" "$EP"
echo "Final video: $EP/final.mp4"; cat "$EP/youtube-chapters.txt"
