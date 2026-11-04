# IphoneHilfe

Hilfe-App für Mama (75) auf ihrem iPhone. Statische PWA (HTML/CSS/JS, kein Build, keine Abhängigkeiten), nginx-Container auf dem Pi `kingscourtha01` – Aufbau wie `andrus0/PragApp`.

## Nutzerin – das ist der Maßstab
- Wenig Technikerfahrung, Sehkraft nachlassend, zittrige Finger.
- Schrift ≥ 22px, Buttons ≥ 64px hoch, hoher Kontrast, max. 6 Kacheln pro Bildschirm.
- Eine Aktion pro Bildschirm, immer sichtbarer „⬅ Zurück“ und „🏠 Start“.
- Kurze Sätze, Du-Form, keine Fachwörter (statt „Einstellungen > Bedienungshilfen“: „Tippe auf das graue Zahnrad“).
- Jede Anleitung: nummerierte Schritte, ein Bild/Emoji pro Schritt, Taste „🔊 Vorlesen“ (speechSynthesis, de-DE).
- Großer Notfall-Button „📞 Andreas anrufen“ (tel:-Link) auf jeder Seite.
- Funktioniert offline (Service Worker).

## Struktur (Ziel)
```
index.html  css/styles.css  js/app.js  js/data/anleitungen.js  sw.js
deploy/ (deploy.sh, nginx.conf)  docker-compose.yml  docs/
```

## Agents (token-sparsam einsetzen)
- `entwickler` – Code & Inhalte der App
- `devops` – Docker, nginx, Deploy, Tailscale
- `doku-droide` – README, docs/, Anleitungen für Mama zum Ausdrucken

## Regeln für alle
- Erst `Grep`/`Glob`, dann nur die nötigen Zeilen lesen. Keine ganzen Dateien ohne Grund.
- Nichts doppelt erklären, keinen Code im Bericht wiederholen.
- Bericht am Ende: max. 5 Zeilen (was geändert, welche Datei, offene Punkte).
- Branch: `claude/zen-babbage-akdazh`. Commit-Messages auf Deutsch.
