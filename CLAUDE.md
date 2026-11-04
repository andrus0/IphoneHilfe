# IphoneHilfe

Hilfe-App für Senioren (75+) auf dem iPhone – **für jede Mutter nutzbar**, nichts Persönliches im Code.
Statische PWA (HTML/CSS/JS, kein Build, keine Abhängigkeiten), nginx-Container auf dem Pi `kingscourtha01`, öffentlich über **Tailscale Funnel** (Aufbau sonst wie `andrus0/PragApp`).

## Nutzerin – das ist der Maßstab
- Wenig Technikerfahrung, Sehkraft nachlassend, zittrige Finger.
- Schrift ≥ 22px, Buttons ≥ 64px hoch, hoher Kontrast, max. 6 Kacheln pro Bildschirm.
- Eine Aktion pro Bildschirm, immer sichtbar „⬅ Zurück“ und „🏠 Start“.
- Kurze Sätze, Du-Form, keine Fachwörter („Tippe auf das graue Zahnrad“).
- Anleitung = nummerierte Schritte, ein Emoji/Bild pro Schritt, Taste „🔊 Vorlesen“ (speechSynthesis, de-DE).

## Funktionen V1 (klein & schnell)
1. **Geräteerkennung beim Start**: Face ID vs. Home-Button per `env(safe-area-inset-bottom) > 0` + Rückfrage mit Bild („Hast du unten einen runden Knopf?“); iOS-Version aus UserAgent (ab iOS 26 evtl. eingefroren → nur Hinweis). Ergebnis speichern; Anleitungen zeigen nur passende Schritte.
2. **Einrichtungs-Assistent** (vom Kind beim ersten Start): Notrufkontakt + bis 6 wichtige Kontakte (Name, Nummer, Foto auf 256px verkleinert). Nur `localStorage` auf dem Gerät, nie an den Server. Jederzeit änderbar (versteckt hinter langem Drücken / PIN).
   ⚠ iOS trennt Speicher von Safari und Home-Bildschirm-App → Assistent erst **nach** „Zum Home-Bildschirm“ starten; vorher Anleitung dafür zeigen.
3. **Notruf-Button** „📞 <Name> anrufen“ auf jeder Seite (tel:-Link), **Kontaktkacheln** mit Foto.
4. **Vorlesen** jeder Anleitung.
5. **Anleitungen V1**: Welches iPhone habe ich? · Lauter/leiser & Stummschalter · Anrufen & annehmen · Kontakt speichern · WhatsApp-Nachricht & Sprachnachricht · Foto machen & per WhatsApp schicken · App aus dem App Store installieren · Home-Bildschirm aufräumen & Schrift größer · Bildschirm per FaceTime teilen (Fernhilfe) · Ist das echt? (Betrug)
6. **Bereich „Ist das echt?“**: Fake-SMS (Paket/Bank), „Hallo Mama, neue Nummer“, falsche Apple-Mails/Anrufe, Abo-Fallen, Pop-ups „Virus gefunden“. Regel: „Im Zweifel: nichts tippen, Kontakt anrufen.“

## Später (V2)
iPhone neu einrichten · Startbildschirm/Sperrbildschirm gestalten · YouTube · Signal · Telegram · WLAN · Akku · Taschenlampe · Bildschirm gesperrt / unbekanntes Fenster

## Struktur
```
index.html  css/styles.css  js/app.js  js/geraet.js  js/einrichtung.js
js/data/anleitungen.js  sw.js  manifest.webmanifest
deploy/ (deploy.sh, nginx.conf)  docker-compose.yml  docs/
```

## Agents (token-sparsam einsetzen)
- `entwickler` – Code & Inhalte der App
- `devops` – Docker, nginx, Deploy, Funnel
- `doku-droide` – README, docs/, Anleitungen zum Ausdrucken

## Regeln für alle
- Erst `Grep`/`Glob`, dann nur die nötigen Zeilen lesen. Keine ganzen Dateien ohne Grund.
- Nichts doppelt erklären, keinen Code im Bericht wiederholen.
- Bericht am Ende: max. 5 Zeilen (was geändert, welche Datei, offene Punkte).
- Keine persönlichen Daten (Namen, Nummern) im Repo – die App ist öffentlich erreichbar.
- Branch: `claude/zen-babbage-akdazh`. Commit-Messages auf Deutsch.
