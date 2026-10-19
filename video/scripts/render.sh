#!/usr/bin/env bash
# Render Quran Decoding EP01 end to end: frames -> sound design -> broadcast-range MP4.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
npx remotion render ThreeHundredAndNine out/silent.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p
python3 -I scripts/sound.py out/sfx.wav
ffmpeg -hide_banner -loglevel error -y -i out/silent.mp4 -i out/sfx.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -vf "scale=in_range=full:out_range=tv" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -profile:v high \
  -af "loudnorm=I=-18:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart \
  out/quran-decoding-ep01-300-and-9.mp4
echo "done: out/quran-decoding-ep01-300-and-9.mp4"
