# IphoneHilfe

Hilfe-App für Senioren (75+) auf dem iPhone. Für jede Mutter nutzbar, nichts Persönliches im Code.

Statische PWA (HTML, CSS, JavaScript). Kein Build, keine Abhängigkeiten.

## Funktionen

| Bereich | Was die App kann |
|---|---|
| Start | Notruf-Button, Kontaktkacheln mit Foto, 6 Bereiche |
| Anleitungen | Nummerierte Schritte, ein Bild oder Emoji pro Schritt, 🔊 Vorlesen |
| Geräteerkennung | Face ID oder Home-Button, über Safe-Area und Seitenverhältnis, mit Rückfrage |
| Einrichtung | Assistent: Notrufkontakt und bis 6 Kontakte mit Foto |
| Offline | Service Worker (`sw.js`) |
| Einstellungen | Unten ⚙ 2 s gedrückt halten (für Angehörige) |

Kontakte werden nur im `localStorage` des iPhones gespeichert, nie auf dem Server.

## Erster Start

| Schritt | Was passiert |
|---|---|
| 1 | Nicht als Home-Bildschirm-App geöffnet: Anleitung „Zum Home-Bildschirm“ |
| 2 | Gerät bestätigen (Face ID oder Home-Button) |
| 3 | Einrichtungs-Assistent |
| 4 | Startseite |

Der Assistent startet erst nach „Zum Home-Bildschirm“. iOS trennt Speicher von Safari und Home-Bildschirm-App.

## Lokal starten

```bash
python3 -m http.server 8765
```

Dann im Browser `http://localhost:8765` öffnen.

## Deploy

| Schritt | Befehl |
|---|---|
| Übertragen auf den Pi | `./deploy/deploy.sh` (Standard: `PI_HOST=pi`, Ordner `~/iphonehilfe`) |
| Öffentlich machen (einmalig) | `./deploy/funnel.sh` |

Öffentliche Adresse: https://kingscourtha01.tail4afa51.ts.net:8443

Der Container läuft mit nginx auf dem nächsten freien Port ab 8085: `deploy.sh` wählt ihn auf dem Pi automatisch und merkt ihn in `~/iphonehilfe/.env` (TWIK 8083, PragApp 8084 werden übersprungen). `funnel.sh` übernimmt ihn von dort. Hosting: Raspberry Pi `kingscourtha01`, Tailscale Funnel.

## Projektstruktur

| Pfad | Inhalt |
|---|---|
| `index.html` | Einstiegsseite |
| `css/styles.css` | Layout, Schrift ≥ 22 px, Buttons ≥ 64 px |
| `js/app.js` | Routing und Vorlesen |
| `js/dom.js` | Hilfsfunktionen, `localStorage` |
| `js/geraet.js` | Geräteerkennung und Rückfrage |
| `js/einrichtung.js` | Einrichtungs-Assistent |
| `js/data/anleitungen.js` | Inhalte der Anleitungen und Bereiche |
| `sw.js` | Offline-Cache (`CACHE`-Version bei Änderungen erhöhen) |
| `manifest.webmanifest`, `icons/` | Home-Bildschirm-App |
| `deploy/` | `deploy.sh`, `funnel.sh`, `nginx.conf` |
| `docs/` | Doku für Angehörige und zum Ausdrucken |

Routen: `#/start`, `#/bereich/<id>`, `#/anleitung/<id>`, `#/falle/<id>`.

## Anleitungen pflegen

Format in `js/data/anleitungen.js`:

```js
{ id, titel, emoji, bereich, schritte: [{ text, bild, nur?: 'faceid' | 'homebutton' }] }
```

| Feld | Bedeutung |
|---|---|
| `nur` | Schritt nur für Face ID oder nur für Home-Button |
| `bereich` | Zuordnung zu einem der 6 Bereiche |

## Regeln

| Thema | Regel |
|---|---|
| Zielgruppe | Senioren 75+: kurze Sätze, Du-Form, keine Fachwörter |
| Datenschutz | Keine Namen, Nummern oder Fotos im Repo |
| Commits | Auf Deutsch |
| Details | Siehe `CLAUDE.md` |
