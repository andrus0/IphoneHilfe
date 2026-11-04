#!/usr/bin/env bash
# Tailscale Funnel für IphoneHilfe einrichten (einmalig bzw. nach Portwechsel).
# Liest den von deploy.sh gewählten Port aus ~/iphonehilfe/.env auf dem Pi.
# Funnel erlaubt nur die HTTPS-Ports 443, 8443 und 10000 (10000 = PragApp).
#
#   ./deploy/funnel.sh
#   FUNNEL_PORT=443 ./deploy/funnel.sh      (falls 8443 schon vergeben ist)
set -euo pipefail

PI_HOST="${PI_HOST:-pi}"
PI_DIR="${PI_DIR:-iphonehilfe}"
FUNNEL_PORT="${FUNNEL_PORT:-8443}"

PORT=$(ssh "$PI_HOST" "sed -n 's/^IPHONEHILFE_PORT=//p' $PI_DIR/.env")
[ -n "$PORT" ] || { echo "✗ Kein Port gefunden – zuerst ./deploy/deploy.sh ausführen."; exit 1; }

echo "→ Aktuelle Belegung (serve/funnel):"
ssh "$PI_HOST" "docker exec tailscale tailscale serve status" || true

echo "→ Funnel einrichten: :$FUNNEL_PORT → http://127.0.0.1:$PORT"
ssh "$PI_HOST" "docker exec tailscale tailscale funnel --bg --https=$FUNNEL_PORT http://127.0.0.1:$PORT"

echo "→ Funnel-Status:"
ssh "$PI_HOST" "docker exec tailscale tailscale funnel status"
