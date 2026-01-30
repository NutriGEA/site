#!/usr/bin/env bash

set -euo pipefail

function usage() {
  echo "Usage: $0 <image-file>" >&2
  exit 1
}

if [[ $# -lt 1 ]]; then
  usage
elif [[ ! -f "$1" ]]; then
  usage
fi

SIZES=(2160 1080 700 350)

SUFFIXES=(full2x full1x thumb2x thumb1x)

COMMON_OPTS=(
  -strip
  -colorspace sRGB
  -filter Lanczos
)

AVIF_OPTS=(
  -quality 35
  -define heic:compression=av1
  -define heic:speed=0
  -define heic:chroma=444
)

WEBP_OPTS=(
  -quality 82
  -define webp:method=6
)

src="$1"

script_dir="`cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd`"
base="`basename "$src"`"
name="${base%.*}"
target_prefix="`realpath -s "${script_dir}/../src/img/credentials/$name"`"

if [[ `head -c 4 "$src"` = "%PDF" ]]; then
  args=(-density 300 "$src[0]" -background white -alpha remove -alpha off)
else
  args=("$src")
fi

args=(${args[@]} ${COMMON_OPTS[@]})

for i in "${!SIZES[@]}"; do
  size=${SIZES[i]}
  suffix=${SUFFIXES[i]}
  args+=(\( -clone 0 -resize "x$size>" ${AVIF_OPTS[@]} -write "$target_prefix-$suffix.avif" +delete \))
  args+=(\( -clone 0 -resize "x$size>" ${WEBP_OPTS[@]} -write "$target_prefix-$suffix.webp" +delete \))
done

magick "${args[@]}" null:
