
(function bootstrapScrollRestore() {
  initializeScrollRestore();
})();

/**
 * Initializes the scroll restoration flow using saved state.
 */
function initializeScrollRestore() {
  const state = createRestoreState();
  restoreSavedScrollPosition(state);
}

/**
 * Creates the initial scroll restoration state object.
 * @returns {Object} An object containing savedPosition and hasFragment fields.
 */
function createRestoreState() {
  return {
    savedPosition: getSavedPosition(),
    hasFragment: Boolean(window.location.hash && window.location.hash !== ""),
  };
}

/**
 * Retrieves the saved scroll position from sessionStorage.
 * @returns {Object|null} The parsed position object with x and y coordinates, or null if empty or invalid.
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
 * Checks if the given position object has valid numeric coordinates.
 * @param {Object} pos - The position object to check.
 * @returns {boolean} True if x and y are numbers, false otherwise.
 */
function isValidPosition(pos) {
  if (!pos) return false;
  if (typeof pos.x !== "number") return false;
  if (typeof pos.y !== "number") return false;
  return true;
}

/**
 * Sets global flags to indicate that scroll restoration is pending.
 * @param {Object} pos - The position object containing target x and y coordinates.
 */
function setPendingFlags(pos) {
  window.__scrollRestorePending = true;
  window.__savedScrollPos = pos;
}

/**
 * Adds the 'scroll-restore-pending' class to the HTML document element.
 */
function addPendingClassToDocument() {
  document.documentElement.classList.add("scroll-restore-pending");
}

/**
 * Adds the 'scroll-restore-pending' class to the body element.
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
 * Performs the actual page scroll to specified coordinates.
 * @param {Object} pos - The target position coordinates.
 */
function performScroll(pos) {
  window.scrollTo(pos.x, pos.y);
}

/**
 * Restores the window scroll position if state and requirements are met.
 * @param {Object} state - The scroll restore state.
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

/**
 * Prepares the page for scroll restoration by setting flags and CSS classes.
 * @param {Object|null} pos - The target scroll position or null.
 */
function preparePendingScrollState(pos) {
  setPendingFlags(pos);
  addPendingClassToDocument();
  addPendingClassToBody();
}