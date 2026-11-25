#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXT_DIR="$ROOT/extension"
DIST_DIR="$ROOT/dist"

VERSION="$(node -pe "JSON.parse(require('fs').readFileSync('$EXT_DIR/manifest.json','utf8')).version")"
OUT="$DIST_DIR/the-time-before-ai-v${VERSION}.zip"

mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR"/the-time-before-ai-v*.zip

(
  cd "$EXT_DIR"
  zip -r "$OUT" . -x '*.DS_Store' -q
)

echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"