#!/usr/bin/env bash
# One-time setup per session: ffmpeg, the free Kokoro voice, the pinned HyperFrames CLI. Safe to re-run.
set -e
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null || { (sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg) || apt-get install -y -qq ffmpeg; }
python3 -c "import kokoro_onnx, soundfile" 2>/dev/null || pip install -q kokoro-onnx soundfile 2>/dev/null || pip install -q --break-system-packages kokoro-onnx soundfile
npx -y hyperframes@0.9.85 --version >/dev/null 2>&1 || true
if [ ! -f "$HOME/.cache/hyperframes/tts/models/kokoro-v1.0.onnx" ]; then
  echo "Voice test." > /tmp/voice-test.txt
  npx -y hyperframes@0.9.85 tts /tmp/voice-test.txt -o /tmp/voice-test.wav >/dev/null 2>&1 || echo "WARNING: voice model download failed."
fi
echo "== Setup complete =="
