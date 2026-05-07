#!/usr/bin/env bash
# Re-encode walkthrough + hero-loop videos to 80–85% quality, smaller files.
# Safety: writes to *.tmp.{ext}, ffprobes them, only swaps if smaller AND valid.

set -u
cd "$(dirname "$0")/.."

FFMPEG="C:/Users/uahme/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe"
FFPROBE="C:/Users/uahme/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffprobe.exe"

VID_DIR="public/portfolio/modesto/videos"

# (file_basename, source_resolution_filter, x264_crf, vp9_crf)
# Walkthroughs: 1920 wide, CRF 25 / vp9 36
# hero-loop: keep 1280 wide, gentler CRF
WALKS=("walkthrough-01" "walkthrough-02" "walkthrough-03")
HERO="hero-loop"

log() { echo "[reenc] $*"; }

probe_ok() {
  local f="$1"; local expect_w="$2"
  local w
  w=$("$FFPROBE" -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f" 2>/dev/null | tr -d '\r\n ')
  [[ -z "$w" ]] && { log "WARN $f probe returned empty"; return 1; }
  [[ "$w" == "$expect_w" ]] || { log "WARN $f width=$w expected=$expect_w"; return 1; }
  return 0
}

swap_if_better() {
  local orig="$1"; local tmp="$2"; local expect_w="$3"
  if [[ ! -f "$tmp" ]]; then log "MISSING $tmp — skip"; return 1; fi
  if ! probe_ok "$tmp" "$expect_w"; then
    log "INVALID $tmp — keeping original, removing tmp"
    rm -f "$tmp"; return 1
  fi
  local os=$(stat -c %s "$orig")
  local ns=$(stat -c %s "$tmp")
  if (( ns < os )); then
    mv "$orig" "$orig.bak"
    mv "$tmp" "$orig"
    rm -f "$orig.bak"
    log "SWAP  $(basename $orig)  $((os/1024))KB -> $((ns/1024))KB  (-$(((os-ns)/1024))KB)"
    return 0
  else
    log "SKIP  $(basename $orig)  new=${ns} >= old=${os}, keeping original"
    rm -f "$tmp"
    return 1
  fi
}

# ─── Stage 1: MP4 (h264) — fast, parallel ────────────────────────────────────
log "=== STAGE 1: MP4 (parallel) ==="
for name in "${WALKS[@]}"; do
  src="$VID_DIR/$name.mp4"
  tmp="$VID_DIR/$name.tmp.mp4"
  log "  encode $name.mp4 -> tmp"
  "$FFMPEG" -y -hide_banner -loglevel error -i "$src" \
    -c:v libx264 -preset slow -crf 25 \
    -vf "scale=1920:-2:flags=lanczos,fps=30" \
    -movflags +faststart -an "$tmp" &
done
# hero-loop: keep 1280 wide, CRF 26 (already small but vp9 was over)
"$FFMPEG" -y -hide_banner -loglevel error -i "$VID_DIR/$HERO.mp4" \
  -c:v libx264 -preset slow -crf 26 \
  -vf "scale=1280:-2:flags=lanczos,fps=30" \
  -movflags +faststart -an "$VID_DIR/$HERO.tmp.mp4" &

wait
log "  all mp4 encodes finished"

# Verify+swap mp4s
for name in "${WALKS[@]}"; do
  swap_if_better "$VID_DIR/$name.mp4" "$VID_DIR/$name.tmp.mp4" 1920
done
swap_if_better "$VID_DIR/$HERO.mp4" "$VID_DIR/$HERO.tmp.mp4" 1280

# ─── Stage 2: WebM (VP9) — CPU heavy, serial ─────────────────────────────────
log "=== STAGE 2: WebM (serial) ==="
for name in "${WALKS[@]}"; do
  src="$VID_DIR/$name.mp4"  # encode from the (now-smaller) mp4 as source
  tmp="$VID_DIR/$name.tmp.webm"
  log "  encode $name.webm"
  "$FFMPEG" -y -hide_banner -loglevel error -i "$src" \
    -c:v libvpx-vp9 -b:v 0 -crf 36 \
    -vf "scale=1920:-2:flags=lanczos,fps=30" \
    -an -row-mt 1 -threads 4 "$tmp"
  swap_if_better "$VID_DIR/$name.webm" "$tmp" 1920
done

# hero-loop webm: 1280 wide, CRF 38
log "  encode $HERO.webm"
"$FFMPEG" -y -hide_banner -loglevel error -i "$VID_DIR/$HERO.mp4" \
  -c:v libvpx-vp9 -b:v 0 -crf 38 \
  -vf "scale=1280:-2:flags=lanczos,fps=30" \
  -an -row-mt 1 -threads 4 "$VID_DIR/$HERO.tmp.webm"
swap_if_better "$VID_DIR/$HERO.webm" "$VID_DIR/$HERO.tmp.webm" 1280

# ─── Final summary ───────────────────────────────────────────────────────────
log "=== DONE ==="
ls -la "$VID_DIR"
