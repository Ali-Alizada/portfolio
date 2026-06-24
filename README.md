# Aliaqa Alizada | Frontend Developer Portfolio

Eine moderne, performante und bilinguale Portfolio-Website zur ansprechenden Präsentation von Projekten, technischen Fähigkeiten und beruflichem Werdegang. 

Die Website besticht durch ihr minimalistisches, dunkles Design (Dark Theme), flüssige Mikro-Animationen, einen dynamischen Cursor-Schatten und eine modulare, asynchrone Ladearchitektur.

[Live Demo ansehen](https://alizada-portfolio.de/) | [Kontakt aufnehmen](mailto:alimhd276@gmail.com) | [LinkedIn](https://www.linkedin.com/feed/)

---

## 🚀 Key Features

*   **Modulare & Dynamische Architektur:** Einzelne Sektionen (About Me, Technologies, Testimonials, Dialogs) sind als eigenständige HTML-Templates ausgelagert und werden asynchron per JavaScript Fetch-API geladen. Das hält die `index.html` schlank und verbessert die Wartbarkeit.
*   **Zweisprachigkeit (i18n):** Vollständige Lokalisierung (Deutsch und Englisch) ohne Page-Reload. Die Sprachpräferenz wird im `localStorage` gespeichert, um die Auswahl bei zukünftigen Besuchen zu erhalten.
*   **Interaktiver Projekt-Showcase:** Detaillierte Projektvorstellungen (z. B. *Join*, *El Pollo Loco*, *DABubble*) werden in interaktiven Modal-Dialogen geöffnet, inklusive einer direkten Karussell-Navigation zum nächsten Projekt.
*   **Dynamischer Testimonial-Slider:** Ein intuitiver Karussell-Slider für Feedback und Empfehlungen von Kollegen und Projektpartnern.
*   **Barrierefreiheit & SEO:** Verwendung semantischer HTML5-Elemente, strukturierter Überschriften-Hierarchien sowie Metadaten für Suchmaschinen und OpenGraph (Social Media Previews).
*   **Kontaktformular mit Echtzeit-Validierung:** Clientseitige Formularprüfung mit benutzerfreundlichen Fehlermeldungen und Anbindung an ein PHP-Mailer-Skript (`send.php`) für die sichere E-Mail-Zustellung.

---

## 🛠️ Tech Stack

Die Kernanwendung basiert auf purem (Vanilla) HTML, CSS und JavaScript, um maximale Performance und Ladezeiten ohne Overhead zu garantieren. Folgende Technologien und Tools kommen zum Einsatz:

| Technologie / Tool | Badge / Logo | Beschreibung |
| :--- | :--- | :--- |
| **HTML5** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Strukturierung der Seite und Bereitstellung der dynamisch ladbaren Sektionen. |
| **CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Modulares Styling, Custom Scrollbars, CSS-Variablen für das Dark-Theme und responsive Layouts. |
| **JavaScript (ES6+)** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Steuerung der Fetch-API, Internationalisierung (i18n), Slider-Steuerung und Dialog-Modals. |
| **PHP** | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white) | Serverseitiges Skript (`send.php`) zur sicheren E-Mail-Übertragung des Kontaktformulars. |
| **Firebase** | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Backend-Infrastruktur (Auth, Echtzeit-Datenbank) für die gezeigten Projekte (*Join* & *DABubble*). |
| **Angular** | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white) | Framework für anspruchsvolle SPA-Entwicklung in den ausgestellten Projekten (*Join* & *DABubble*). |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Typsichere Anwendungslogik in den komplexeren Portfolio-Projekten. |
| **Git** | ![Git](https://img.shields.io/badge/Git-F05033?style=flat-square&logo=git&logoColor=white) | Versionsverwaltung und kollaboratives Arbeiten. |

---

## 📂 Project Structure

Die Dateistruktur ist modular organisiert. Styles und Skripte sind getrennt und nach Sektionen strukturiert, was eine einfache Skalierbarkeit des Portfolios ermöglicht:

```text
portfolio/
├── assets/             # Statische Ressourcen
│   ├── fonts/          # Eingebundene Web-Fonts
│   └── imgs/           # Bilder, Screenshots und Vektor-Icons (SVG)
├── html/               # Dynamische HTML-Sektionen (vom JavaScript nachgeladen)
│   ├── aboutme-section.html
│   ├── legal-notice.html
│   ├── privacy-policy.html
│   ├── projects-dialog.html
│   ├── technologies-section.html
│   └── testimonial-section.html
├── script/             # Modularisierte JavaScript-Dateien
│   ├── i18n.js         # Lokalisierungs-Logik & Übersetzungswörterbuch
│   ├── projects-dialog.js # Steuerung der Projekt-Detail-Modals
│   ├── scroll-restore.js  # Scrollverhalten-Optimierungen
│   └── testimonial-section.js # Slider-Logik für Empfehlungen
├── styles/             # Modularisierte Stylesheets (CSS)
│   ├── aboutme-technologies.css
│   ├── cards-burger-footer.css
│   ├── contact.css
│   ├── header-hero.css
│   ├── legal-notice.css
│   ├── privacy-policy.css
│   ├── projects-dialog.css
│   ├── responsive.css  # Mobile-First Media Queries
│   └── testimonial-slider.css
├── index.html          # Haupteinstiegspunkt (App-Shell)
├── script.js           # Zentraler Orchestrator (lädt Sektionen & initialisiert Logik)
├── style.css           # Globale CSS-Variablen, Resets und Keyframe-Animationen
├── send.php            # PHP-Skript für den E-Mail-Versand des Kontaktformulars
├── .prettierrc         # Konfiguration für einheitliche Code-Formatierung
└── .gitignore          # Versionierungsausschlüsse
```

---

## ⚙️ Installation & Lokale Ausführung

Da die Website asynchrone Anfragen (`fetch`) verwendet, um HTML-Komponenten aus dem Ordner `html/` zu laden, blockieren moderne Webbrowser diese Aufrufe aus Sicherheitsgründen (CORS-Richtlinie), wenn die Datei `index.html` direkt über das Dateisystem (`file://`) geöffnet wird. 

Für die lokale Ausführung wird daher ein lokaler Webserver benötigt.

### Option 1: VS Code "Live Server" (Empfohlen)
1. Installiere die Erweiterung **Live Server** in Visual Studio Code.
2. Öffne den Projektordner in VS Code.
3. Klicke unten rechts in der Statusleiste auf den Button **Go Live** (oder mache einen Rechtsklick auf `index.html` und wähle *Open with Live Server*).

### Option 2: Python HTTP Server
Falls du Python installiert hast, kannst du im Hauptverzeichnis des Projekts folgenden Befehl ausführen:
```bash
python -m http.server 8000
```
Öffne anschließend [http://localhost:8000](http://localhost:8000) in deinem Browser.

### Option 3: Node.js (npx)
Falls du Node.js installiert hast, kannst du einen schnellen Server über `npx` starten:
```bash
npx http-server
```
Öffne die in der Konsole angegebene Adresse (meistens [http://localhost:8080](http://localhost:8080)).

---

## 📬 Kontakt

*   **Name:** Aliaqa Alizada
*   **E-Mail:** [alimhd276@gmail.com](mailto:alimhd276@gmail.com)
*   **LinkedIn:** [Aliaqa Alizada](https://www.linkedin.com/feed/)
*   **GitHub:** [Ali-Alizada](https://github.com/Ali-Alizada)
