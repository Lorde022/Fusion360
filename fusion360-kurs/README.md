# Fusion 360 Intensivkurs · 3D-Druck und Holzwerken

Selbstlernkurs für Autodesk Fusion 360 mit Fokus auf 3D-Druck (FDM) und Holzwerken.
26 Lektionen, ca. 20 Stunden, statisch ausgeliefert über Netlify.

## Inhalt

- **Modul 1** – Fusion Grundlagen (5 Lektionen)
- **Modul 2** – Parametrisches Konstruieren (5 Lektionen)
- **Modul 3** – Design für den 3D-Druck (6 Lektionen)
- **Modul 4** – Design für Holzwerken (7 Lektionen)
- **Modul 5** – Baugruppen (3 Lektionen)
- **Modul 6** – Abschlussprojekt: Hybrid Holz + 3D-Druck (3 Lektionen)

Jede Lektion enthält Lernziele, Vorwissen-Check, Theorie, geführte Übung,
freie Transferaufgabe, Selbstkontroll-Quiz, Cheat Sheet und weiterführende Links.

## Tech-Stack

- Reines HTML, CSS, vanilla JS – kein Build-Schritt
- Dark/Light/Auto-Theme mit `localStorage`
- Fortschrittstracking pro Lektion (`localStorage`)
- Clientseitige Suche
- Druckfreundliches CSS (Lektion als PDF speichern via Browser-Druck)
- Keine Tracker, keine Cookies, keine externen Fonts

## Lokal ausführen

```bash
# in das Projektverzeichnis wechseln
cd fusion360-kurs

# einfacher statischer Server (Python)
python3 -m http.server 8080
# oder Node
npx serve .
```

Dann im Browser `http://localhost:8080` öffnen.

## Auf GitHub hosten und über Netlify deployen

Vollständige Schritt-für-Schritt-Anleitung in [DEPLOY.md](DEPLOY.md). Kurz zusammengefasst:

1. Lokales Git-Repo anlegen (`git init`, erster Commit).
2. Repo auf GitHub erstellen und pushen.
3. Bei [Netlify](https://app.netlify.com/) einloggen, *Import an existing project* → GitHub-Repo wählen.
4. Build command leer, Publish directory `.`.
5. *Deploy site* klicken – nach ca. 30 Sekunden ist die Seite live.

`netlify.toml` enthält bereits Default-Header für Caching und Security.

## Projektstruktur

```
fusion360-kurs/
├── index.html
├── netlify.toml
├── README.md
├── module/
│   ├── 1-grundlagen/
│   ├── 2-parametrik/
│   ├── 3-3d-druck/
│   ├── 4-holzwerken/
│   ├── 5-baugruppen/
│   └── 6-abschlussprojekt/
└── assets/
    ├── css/style.css
    ├── js/curriculum.js   # Single source of truth: alle Lektionen
    ├── js/main.js
    ├── img/               # Screenshot-Platzhalter
    └── downloads/         # Beispieldateien (.f3d, .stl, .dxf, .pdf)
```

## Eine neue Lektion hinzufügen

1. Lektion in `assets/js/curriculum.js` ins richtige Modul einfügen.
2. Datei `module/<modul-id>/<index>-<lektion-id>.html` aus einer bestehenden Lektion kopieren.
3. `data-module`, `data-lesson`, `data-lesson-index` im `<article>` setzen.
4. Inhalt in den acht Pflicht-Sektionen ergänzen (Lernziele … Weiterführend).
5. Fertig – Index-Seite und Sidebar aktualisieren sich automatisch.

## Screenshots beisteuern

Platzhalter (`<div class="figure">[Screenshot-Platzhalter: …]</div>`) durch echte Bilder ersetzen.
Bilder unter `assets/img/<modul-id>/<lektion-id>/` ablegen, Größe < 300 KB pro Bild empfohlen,
WEBP bevorzugt.

## Lizenz

MIT (siehe `LICENSE`). Fusion 360 ist eine Marke von Autodesk Inc.
Dieser Kurs ist nicht offiziell mit Autodesk verbunden.
