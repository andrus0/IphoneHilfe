#!/usr/bin/env bash
# Einmalig: Tailscale Funnel fuer IphoneHilfe einrichten
# (HTTPS-Port 8443 -> http://127.0.0.1:8085, Container iphonehilfe).
# Laeuft per ssh auf dem Pi; der Tailscale-Container heisst "tailscale".
#
#   ./deploy/funnel.sh
#   PI_HOST=pi@raspberrypi ./deploy/funnel.sh
set -euo pipefail

PI_HOST="${PI_HOST:-pi}"

echo "→ Funnel einrichten: :8443 → http://127.0.0.1:8085"
ssh "$PI_HOST" "docker exec tailscale tailscale funnel --bg --https=8443 http://127.0.0.1:8085"

echo "→ Funnel-Status:"
ssh "$PI_HOST" "docker exec tailscale tailscale funnel status"
