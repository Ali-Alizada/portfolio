
(function restoreScrollPosition() {
  /**
   * Ruft die gespeicherte Scroll-Position aus dem sessionStorage ab und parst sie als JSON.
   * @returns {object|null} Das geparste Position-Objekt mit den Eigenschaften `x` und `y`,
   *                         oder `null`, wenn kein Eintrag vorhanden ist oder das Parsen fehlschlägt.
   */
  function getSavedPosition() {
    const key = 'portfolio-scroll-pos';
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Prüft, ob ein übergebenes Objekt gültige numerische x- und y-Eigenschaften besitzt.
   * @param {object} pos - Das zu prüfende Position-Objekt.
   * @returns {boolean} `true`, wenn `x` und `y` vorhanden und vom Typ `number` sind, sonst `false`.
   */
  function isValidPosition(pos) {
    if (!pos) return false;
    if (typeof pos.x !== 'number') return false;
    if (typeof pos.y !== 'number') return false;
    return true;
  }

  /**
   * Setzt die Scroll-Wiederherstellung des Browsers auf 'manual', um Konflikte mit der eigenen
   * Logik zur Wiederherstellung der Scroll-Position zu vermeiden.
   * @returns {void}
   */
  function setupScrollRestoration() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }

  /**
   * Setzt globale Flags (`__scrollRestorePending` und `__savedScrollPos`), um den
   * Wiederherstellungsstatus für andere Skripte oder Erweiterungen sichtbar zu machen.
   * @param {object} pos - Das zu speichernde Position-Objekt mit `x` und `y`.
   * @returns {void}
   */
  function setPendingFlags(pos) {
    window.__scrollRestorePending = true;
    window.__savedScrollPos = pos;
  }

  /**
   * Fügt die Klasse 'scroll-restore-pending' zum `<html>`-Element hinzu, um einen globalen
   * CSS-Selektor für den Wiederherstellungsstatus bereitzustellen.
   * @returns {void}
   */
  function addPendingClassToDocument() {
    document.documentElement.classList.add('scroll-restore-pending');
  }

  /**
   * Fügt die Klasse 'scroll-restore-pending' zum `<body>`-Element hinzu.
   * Falls der Body beim Aufruf noch nicht existiert, wird dies beim `DOMContentLoaded`-Ereignis
   * nachgeholt, um eine fehlende Element-Referenz zu verhindern.
   * @returns {void}
   */
  function addPendingClassToBody() {
    if (document.body) {
      document.body.classList.add('scroll-restore-pending');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('scroll-restore-pending');
      });
    }
  }

  /**
   * Führt den tatsächlichen Scroll-Vorgang zu den übergebenen Koordinaten durch.
   * @param {object} pos - Objekt mit den Ziel-Scrollkoordinaten (`x` für horizontal, `y` für vertikal).
   * @returns {void}
   */
  function performScroll(pos) {
    window.scrollTo(pos.x, pos.y);
  }

  /**
   * Steuert den gesamten Wiederherstellungsprozess.
   * 1. Holt die gespeicherte Position aus dem sessionStorage.
   * 2. Validiert das Positions-Objekt.
   * 3. Stellt die Scroll-Wiederherstellung auf 'manual' um.
   * 4. Setzt die globalen Status-Flags.
   * 5. Fügt die Wiederherstellungs-Klassen zu `<html>` und `<body>` hinzu.
   * 6. Scrollt an die gespeicherte Position.
   * Fehler während des Prozesses werden still ignoriert (wie im Original).
   * @returns {void}
   */
  function restoreScrollPosition() {
    try {
      const pos = getSavedPosition();
      if (!pos) return;
      if (!isValidPosition(pos)) return;

      setupScrollRestoration();
      setPendingFlags(pos);
      addPendingClassToDocument();
      addPendingClassToBody();
      performScroll(pos);
    } catch (err) {
      // Fehler beim Wiederherstellen werden ignoriert (wie im Original)
    }
  }

  // Selbstausführender Aufruf der Hauptsteuerungsfunktion
  restoreScrollPosition();
})();