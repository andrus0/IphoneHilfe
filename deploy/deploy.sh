#!/usr/bin/env bash
# Überträgt IphoneHilfe auf den Raspberry Pi und startet den Container (neu).
#
#   ./deploy/deploy.sh                          (Standard: PI_HOST=pi, PI_DIR=iphonehilfe)
#   PI_HOST=pi@raspberrypi ./deploy/deploy.sh
set -euo pipefail

PI_HOST="${PI_HOST:-pi}"
PI_DIR="${PI_DIR:-iphonehilfe}"
CONTAINER="iphonehilfe"

cd "$(dirname "$0")/.."

echo "→ Dateien nach $PI_HOST:$PI_DIR kopieren"
rsync -az --delete --exclude /.git --exclude /.claude --exclude .DS_Store ./ "$PI_HOST:$PI_DIR/"

echo "→ Container starten"
ssh "$PI_HOST" "cd $PI_DIR && chmod -R a+rX . && docker compose up -d && docker compose restart $CONTAINER >/dev/null"

echo "✓ Fertig. Status:"
ssh "$PI_HOST" "docker ps --filter name=$CONTAINER --format '{{.Names}}  {{.Status}}  {{.Ports}}'"
