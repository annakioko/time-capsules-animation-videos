#!/usr/bin/env bash
# Build, lint and render ONE chapter to chapter.mp4 (run chapters one at a time, in the background).
# Usage: scripts/render.sh episodes/<slug>/chapters/chNN [draft]
set -e
CH="${1:?Usage: scripts/render.sh episodes/<slug>/chapters/chNN [draft]}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$ROOT/scripts/build.py" "$CH"
cd "$CH"
npx -y hyperframes@0.9.85 lint || true
if [ "$2" = "draft" ]; then
  npx -y hyperframes@0.9.85 render -o draft.mp4 --fps 15 --quality draft
else
  npx -y hyperframes@0.9.85 render -o chapter.mp4 --fps 30
fi
echo "Done: $CH"
