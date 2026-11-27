#!/usr/bin/env bash
# Turn the hero video into scroll-scrub frames for src/components/home/hero-section.tsx
# Usage: scripts/extract-hero-frames.sh path/to/bmw-520d.mp4 [fps=24] [width=1600]
set -euo pipefail
IN="${1:?usage: $0 <video> [fps] [width]}"
FPS="${2:-24}"
WIDTH="${3:-1600}"
OUT="public/cars/bmw-520d"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found (brew install ffmpeg)"; exit 1; }
mkdir -p "$OUT"
find "$OUT" -name 'frame_*.webp' -delete

ffmpeg -loglevel error -i "$IN" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -c:v libwebp -quality 78 -compression_level 6 \
  -start_number 0 "$OUT/frame_%03d.webp"

COUNT=$(find "$OUT" -name 'frame_*.webp' | wc -l | tr -d ' ')
printf '{ "count": %s }\n' "$COUNT" > "$OUT/manifest.json"
echo "Wrote $COUNT frames + manifest.json to $OUT"
