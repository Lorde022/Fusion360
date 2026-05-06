# Deployment-Anleitung: GitHub + Netlify

Diese Anleitung führt Schritt für Schritt durch das Hochladen des Kurses auf GitHub und die anschließende Veröffentlichung über Netlify. Plane etwa 20–30 Minuten ein. Du brauchst keine Coding-Erfahrung – die Befehle sind hier komplett vorgegeben.

---

## Was du brauchst

- **Git** auf deinem Rechner installiert. Test im Terminal:

  ```bash
  git --version
  ```

  Wenn ein Fehler kommt: [git-scm.com/downloads](https://git-scm.com/downloads). Auf macOS reicht meist `xcode-select --install`.

- **GitHub-Account** unter [github.com/signup](https://github.com/signup). Falls noch nicht vorhanden.

- **Netlify-Account** unter [app.netlify.com/signup](https://app.netlify.com/signup). Du kannst dich direkt mit deinem GitHub-Login anmelden – das vereinfacht später alles.

- Den Kurs-Ordner `fusion360-kurs/` lokal auf deinem Rechner. Kopiere ihn an einen Ort, an dem du dauerhaft Projekte ablegst, z.&nbsp;B. `~/Projekte/fusion360-kurs/`.

---

## Teil 1 – Lokales Git-Repository einrichten

### Schritt 1: Terminal im Kurs-Ordner öffnen

- **macOS**: Finder → den Ordner `fusion360-kurs` rechtsklicken → *Neuer Tab im Terminal* (falls nicht aktiv: Systemeinstellungen → Tastatur → Tastaturkürzel → Dienste → Aktivieren).
- **Windows**: Datei-Explorer → in den Ordner navigieren → in der Adressleiste `cmd` tippen, Enter.
- **Linux**: Terminal öffnen, mit `cd ~/Projekte/fusion360-kurs` in den Ordner wechseln.

Im Terminal sollte jetzt der Pfad zum Kurs-Ordner angezeigt werden. Test:

```bash
ls
```

Du solltest `index.html`, `module/`, `assets/`, `README.md` etc. sehen.

### Schritt 2: Git initialisieren

```bash
git init
```

Das legt einen versteckten Ordner `.git/` an, der die Versionsgeschichte speichert.

### Schritt 3: `.gitignore` anlegen

Damit Git nicht aus Versehen Systemdateien mitcheckt:

```bash
cat > .gitignore <<'EOF'
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/

# Lokal
*.log
node_modules/
EOF
```

(Auf Windows ohne `bash` einfach eine Textdatei `.gitignore` mit dem obigen Inhalt im Editor speichern.)

### Schritt 4: Identität setzen (nur beim allerersten Mal)

```bash
git config --global user.name "Dennis"
git config --global user.email "lorde022@googlemail.com"
```

### Schritt 5: Erster Commit

```bash
git add .
git commit -m "Initial commit – Fusion 360 Kurs v1"
```

Erwartet: Eine Zeile wie `[main (root-commit) abc1234] Initial commit ...`. Falls Git nach einem Standard-Branch fragt: nutze `main`.

```bash
git branch -M main
```

---

## Teil 2 – GitHub-Repository anlegen

### Schritt 1: Neues Repo auf GitHub erstellen

1. Auf [github.com](https://github.com) einloggen.
2. Oben rechts auf das Plus-Symbol → *New repository*.
3. **Repository name**: `fusion360-kurs` (oder ein eigener Name).
4. **Description**: „Selbstlernkurs für Fusion 360 mit Fokus auf 3D-Druck und Holzwerken".
5. **Public** auswählen (so kann Netlify ohne Token darauf zugreifen). Falls privat: dann brauchst du Netlify-GitHub-OAuth, das funktioniert aber auch.
6. **Wichtig:** *„Add a README file"* und *„Add .gitignore"* **NICHT** ankreuzen – wir haben beides schon lokal.
7. Klick auf *Create repository*.

### Schritt 2: Lokales Repo mit GitHub verbinden

GitHub zeigt nach dem Anlegen einen Block „…or push an existing repository from the command line". Im Terminal eingeben (Adresse aus deinem Repo verwenden):

```bash
git remote add origin https://github.com/DEIN-USER/fusion360-kurs.git
git push -u origin main
```

GitHub fragt nach Login. Inzwischen verlangt GitHub statt Passwort einen **Personal Access Token**:

1. Github → Profilbild → *Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)*.
2. Note: „Fusion-Kurs Push", Expiration: 90 Tage, Scope: `repo` ankreuzen.
3. Generate Token, **Token kopieren** und im Terminal als Passwort einfügen.

Alternativ: GitHub CLI installieren (`gh auth login`), dann läuft die Authentifizierung automatisch.

Nach erfolgreichem Push siehst du auf der GitHub-Repo-Seite alle Dateien.

---

## Teil 3 – Netlify-Deployment

### Schritt 1: Bei Netlify einloggen

[app.netlify.com](https://app.netlify.com) → mit GitHub-Account anmelden (empfohlen) oder neuen Account erstellen. Beim ersten Login fragt Netlify nach Berechtigungen, die du an GitHub geben möchtest.

### Schritt 2: Site importieren

1. Im Netlify-Dashboard auf *Add new site → Import an existing project*.
2. *Deploy with GitHub* wählen.
3. Falls noch nicht autorisiert: Netlify nach den Repos fragen lassen, die es sehen darf. Du kannst entweder *All repositories* oder *Only select repositories* wählen – bei *Only* wählst du `fusion360-kurs`.
4. Repository `fusion360-kurs` aus der Liste auswählen.

### Schritt 3: Build settings konfigurieren

Wir haben einen rein statischen Site ohne Build-Schritt:

- **Branch to deploy**: `main`.
- **Build command**: leer lassen.
- **Publish directory**: `.` (Punkt) oder leer.

Netlify liest zusätzlich die mitgelieferte `netlify.toml` und konfiguriert Header und Caching automatisch.

### Schritt 4: Deploy

Klick auf *Deploy site*. Nach 30–60 Sekunden siehst du oben eine zufällige Subdomain wie `cheerful-gnome-12345.netlify.app`. Klick darauf – dein Kurs ist live.

### Schritt 5: Subdomain umbenennen (optional)

1. Netlify-Dashboard → Site overview → *Site settings → Site information → Change site name*.
2. Eigenen Namen wählen, z.&nbsp;B. `dennis-fusion-kurs`. Resultat: `dennis-fusion-kurs.netlify.app`.

### Schritt 6: Eigene Domain (optional)

Falls du eine Domain wie `fusion-kurs.de` registriert hast:

1. Netlify-Dashboard → *Domain management → Add custom domain*.
2. Domain eintippen, Anweisungen folgen. Du musst beim Domain-Registrar zwei DNS-Einträge setzen (CNAME und/oder A-Record). Netlify zeigt die exakten Werte.
3. Nach 5–60 Minuten ist die Domain aktiv. Netlify stellt automatisch ein kostenloses SSL-Zertifikat (Let's Encrypt) aus.

---

## Teil 4 – Updates pushen

Du willst eine Lektion aktualisieren oder einen Tippfehler korrigieren. Workflow:

```bash
# Änderungen lokal machen, im Editor

git status                        # zeigt geänderte Dateien
git add .                         # alles für Commit vormerken
git commit -m "Tippfehler in 3.2 korrigiert"
git push
```

Netlify erkennt den Push automatisch und deployt eine neue Version. Im Dashboard siehst du eine Build-History – sehr praktisch, wenn etwas schiefgeht.

### Rollback

Falls eine neue Version kaputt ist: Netlify-Dashboard → *Deploys* → einen früheren Deploy wählen → *Publish deploy*. Das war's. Sofortiger Rollback ohne Zauberei.

---

## Teil 5 – Fehlersuche

| Problem | Lösung |
|---|---|
| `Permission denied (publickey)` beim `git push` | Personal Access Token verwenden statt Passwort, oder SSH-Key hinterlegen ([docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)) |
| Netlify deployt, aber Seite ist leer | Publish directory falsch. In Settings → Build & deploy → Publish directory auf `.` setzen |
| 404 auf eine Lektion | Pfad in `index.html` prüft. Lokal mit `python3 -m http.server` testen |
| CSS lädt nicht | Browser-Hard-Reload (`Cmd/Strg + Shift + R`). Cache-Header in `netlify.toml` setzen lange Cache-Zeiten – beim Update ggf. eine Sekunde warten |
| Deploy schlägt fehl | Build-Log auf Netlify (Site → Deploys → fehlgeschlagener Deploy) öffnen, Fehlermeldung lesen |

---

## Teil 6 – Was du jetzt hast

Nach Abschluss dieser Anleitung:

- Eine **versionierte** Kopie des Kurses auf GitHub – nichts geht verloren, jeder Stand abrufbar.
- Eine **öffentlich erreichbare Website** auf `dein-name.netlify.app` (oder eigener Domain).
- **Automatische Updates**: jede Änderung mit `git push` ist innerhalb einer Minute live.
- **Rollback**, falls mal etwas schiefgeht.
- **Kostenlos** – Netlify Free Tier reicht für Hobby-Projekte locker (100 GB Bandbreite/Monat).

Du kannst den Kurs jetzt mit Freunden teilen, im Forum verlinken, oder in deinem eigenen Browser-Tab öffnen wann immer du Fusion lernen willst.

Viel Spaß beim Konstruieren!
