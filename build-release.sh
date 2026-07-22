#!/usr/bin/env sh
set -eu

RELEASE_DIR="release"
ZIP_NAME="knmmmm-release.zip"

rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
cp -R index.html css js assets "$RELEASE_DIR"
cd "$RELEASE_DIR"
zip -r ../"$ZIP_NAME" .
cd - >/dev/null

echo "Release package created: $ZIP_NAME"
