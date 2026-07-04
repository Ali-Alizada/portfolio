
(function bootstrapScrollRestore() {
  initializeScrollRestore();
})();

function initializeScrollRestore() {
  const state = createRestoreState();
  restoreSavedScrollPosition(state);
}

function createRestoreState() {
  return {
    savedPosition: getSavedPosition(),
    hasFragment: Boolean(window.location.hash && window.location.hash !== ""),
  };
}

/**
 * Ruft die gespeicherte Scroll-Position aus dem sessionStorage ab und parst sie als JSON.
 * @returns {object|null} Das geparste Position-Objekt mit den Eigenschaften `x` und `y`,
 *                         oder `null`, wenn kein Eintrag vorhanden ist oder das Parsen fehlschlägt.
 */
function getSavedPosition() {
  const key = "portfolio-scroll-pos";
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
  if (typeof pos.x !== "number") return false;
  if (typeof pos.y !== "number") return false;
  return true;
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
 * Fügt die Klasse 'scroll-restore-pending' zum `<html>`-Element hinzu.
 * @returns {void}
 */
function addPendingClassToDocument() {
  document.documentElement.classList.add("scroll-restore-pending");
}

/**
 * Fügt die Klasse 'scroll-restore-pending' zum `<body>`-Element hinzu.
 * @returns {void}
 */
function addPendingClassToBody() {
  if (document.body) {
    document.body.classList.add("scroll-restore-pending");
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("scroll-restore-pending");
    });
  }
}

/**
 * Führt den tatsächlichen Scroll-Vorgang zu den übergebenen Koordinaten durch.
 * @param {object} pos - Objekt mit den Ziel-Scrollkoordinaten.
 * @returns {void}
 */
function performScroll(pos) {
  window.scrollTo(pos.x, pos.y);
}

/**
 * Steuert den gesamten Wiederherstellungsprozess.
 * Wird NICHT bei Fragment-Navigation aufgerufen (script-ui.js handhabt das).
 * @returns {void}
 */
function restoreSavedScrollPosition(state) {
  try {
    if (state.hasFragment) {
      preparePendingScrollState(null);
      return;
    }

    const pos = state.savedPosition;
    if (!pos || !isValidPosition(pos)) return;
    preparePendingScrollState(pos);
    performScroll(pos);
  } catch (_) {}
}

function preparePendingScrollState(pos) {
  setPendingFlags(pos);
  addPendingClassToDocument();
  addPendingClassToBody();
}