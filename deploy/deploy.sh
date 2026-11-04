#!/usr/bin/env bash
# Überträgt IphoneHilfe auf den Raspberry Pi und startet den Container (neu).
# Der Port wird auf dem Pi automatisch gewählt: der gemerkte aus ~/iphonehilfe/.env,
# sonst der nächste freie ab 8085 (TWIK 8083, PragApp 8084 usw. werden übersprungen).
#
#   ./deploy/deploy.sh                          (Standard: PI_HOST=pi, PI_DIR=iphonehilfe)
#   PI_HOST=pi@raspberrypi ./deploy/deploy.sh
#   START_PORT=8090 ./deploy/deploy.sh          (Suche ab anderem Port)
set -euo pipefail

PI_HOST="${PI_HOST:-pi}"
PI_DIR="${PI_DIR:-iphonehilfe}"
START_PORT="${START_PORT:-8085}"
CONTAINER="iphonehilfe"

cd "$(dirname "$0")/.."

echo "→ Dateien nach $PI_HOST:$PI_DIR kopieren"
rsync -az --delete --exclude /.git --exclude /.claude --exclude /.env --exclude .DS_Store ./ "$PI_HOST:$PI_DIR/"

echo "→ Freien Port wählen"
PORT=$(ssh "$PI_HOST" "cd $PI_DIR && START_PORT=$START_PORT CONTAINER=$CONTAINER bash -s" <<'REMOTE'
set -euo pipefail
eigen=$(docker port "$CONTAINER" 80/tcp 2>/dev/null | head -1 | sed 's/.*://' || true)
belegt() {
  [ "$1" = "$eigen" ] && return 1                       # eigener Container zählt nicht
  (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null && return 0   # jemand hört dort
  docker ps --format '{{.Ports}}' 2>/dev/null | grep -q ":$1->" && return 0
  return 1
}
port=$(sed -n 's/^IPHONEHILFE_PORT=//p' .env 2>/dev/null || true)
if [ -z "$port" ] || belegt "$port"; then
  port=$START_PORT
  while belegt "$port"; do port=$((port + 1)); done
fi
echo "IPHONEHILFE_PORT=$port" > .env
echo "$port"
REMOTE
)
echo "  Port: $PORT"

echo "→ Container starten"
ssh "$PI_HOST" "cd $PI_DIR && chmod -R a+rX . && docker compose up -d && docker compose restart $CONTAINER >/dev/null"

echo "✓ Fertig. Status:"
ssh "$PI_HOST" "docker ps --filter name=$CONTAINER --format '{{.Names}}  {{.Status}}  {{.Ports}}'"
echo "  Heimnetz: http://<Pi-IP>:$PORT   ·   Öffentlich: ./deploy/funnel.sh (einmalig, bzw. nach Portwechsel)"
