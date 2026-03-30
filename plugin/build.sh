#!/usr/bin/env bash
set -euo pipefail

# Build-Script: Verpackt das Bewerbungs-Plugin als ZIP für den Marketplace
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION=$(grep -o '"version": "[^"]*"' "$SCRIPT_DIR/.claude-plugin/plugin.json" | cut -d'"' -f4)
NAME="bewerbungs-engine"
OUTPUT_DIR="$SCRIPT_DIR/dist"
ZIP_NAME="${NAME}-v${VERSION}.zip"

echo "Building ${NAME} v${VERSION}..."

# Clean
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Create temp staging dir
STAGING=$(mktemp -d)
trap 'rm -rf "$STAGING"' EXIT

PLUGIN_STAGE="$STAGING/$NAME"
mkdir -p "$PLUGIN_STAGE"

# Copy plugin files (excluding tests, dist, build artifacts)
cp -r "$SCRIPT_DIR/.claude-plugin" "$PLUGIN_STAGE/"
cp -r "$SCRIPT_DIR/commands" "$PLUGIN_STAGE/"
cp -r "$SCRIPT_DIR/skills" "$PLUGIN_STAGE/"
cp -r "$SCRIPT_DIR/templates" "$PLUGIN_STAGE/"
cp -r "$SCRIPT_DIR/profil" "$PLUGIN_STAGE/"
cp "$SCRIPT_DIR/README.md" "$PLUGIN_STAGE/"

# Create ZIP
(cd "$STAGING" && zip -r "$OUTPUT_DIR/$ZIP_NAME" "$NAME" -x "*.DS_Store" "*__MACOSX*")

echo ""
echo "Done! Plugin packaged:"
echo "  $OUTPUT_DIR/$ZIP_NAME"
echo "  Size: $(du -h "$OUTPUT_DIR/$ZIP_NAME" | cut -f1)"
