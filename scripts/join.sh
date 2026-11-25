#!/usr/bin/env bash
# Join rendered chapters into final.mp4, add a quiet firelight room-tone bed under the voice,
# and write youtube-chapters.txt + subtitles.srt (for YouTube CC / Facebook captions).
# Usage: scripts/join.sh episodes/<slug> [--no-bed]
set -e
EP="${1:?Usage: scripts/join.sh episodes/<slug>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIST="$EP/concat.txt"; : > "$LIST"
for d in "$EP"/chapters/ch*/; do
  [ -f "$d/chapter.mp4" ] || { echo "Missing $d/chapter.mp4: render it first"; exit 1; }
  echo "file '$(cd "$d" && pwd)/chapter.mp4'" >> "$LIST"
done
ffmpeg -v error -y -f concat -safe 0 -i "$LIST" -c copy "$EP/joined.mp4"
if [ "$2" = "--no-bed" ]; then
  mv "$EP/joined.mp4" "$EP/final.mp4"
else
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/joined.mp4")
  # brown-noise rumble + sparse crackle, low and warm, faded at both ends
  ffmpeg -v error -y -i "$EP/joined.mp4" \
    -f lavfi -i "anoisesrc=color=brown:amplitude=0.5:seed=7:duration=$DUR" \
    -f lavfi -i "anoisesrc=color=white:amplitude=1:seed=11:duration=$DUR" \
    -filter_complex "[1]lowpass=f=320,volume=0.05[rum];[2]highpass=f=1800,agate=threshold=0.985:ratio=9:attack=0.01:release=40,volume=0.35[crk];[rum][crk]amix=inputs=2:normalize=0,afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-4)"):d=4[bed];[0:a][bed]amix=inputs=2:normalize=0:duration=first[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k "$EP/final.mp4"
  rm "$EP/joined.mp4"
fi
python3 "$ROOT/scripts/subtitles.py" "$EP"
echo "Final video: $EP/final.mp4"; cat "$EP/youtube-chapters.txt"
