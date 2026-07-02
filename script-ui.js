/**
 * Initializes a custom cursor shadow that follows the mouse pointer.
 * Attaches a mousemove listener to update the shadow element's position.
 */
(function initCursorShadow() {
  const cursorShadow = document.querySelector(".cursor-shadow");
  if (!cursorShadow) return;
  document.addEventListener("mousemove", (e) => {
    cursorShadow.style.left = `${e.clientX}px`;
    cursorShadow.style.top = `${e.clientY}px`;
  });
})();

/**
 * Initializes the burger menu toggle and click‑outside closing.
 */
(function initBurgerMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".header-content");
  if (!burger || !menu) return;

  /**
   * Toggles the active state of the burger and menu.
   */
  function toggleMenu() {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    burger.setAttribute(
      "aria-expanded",
      burger.classList.contains("active") ? "true" : "false",
    );
  }

  /**
   * Closes the menu and resets the burger state.
   */
  function closeMenu() {
    burger.classList.remove("active");
    menu.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
  });
})();

let hiddenObserver = null;
const hiddenObservedSet = new WeakSet();
let hiddenElementsDeferred = false;

/**
 * Sets up an IntersectionObserver to reveal hidden elements when they enter the viewport.
 */
function observeHiddenElements() {
  const hiddenEls = document.querySelectorAll(".hidden:not(.show)");
  if (!hiddenEls.length) return;
  if (!hiddenObserver) {
    hiddenObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => entry.target.classList.add("show"));
            hiddenObserver.unobserve(entry.target);
            hiddenObservedSet.delete(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
  }
  hiddenEls.forEach((el) => {
    if (hiddenObservedSet.has(el)) return;
    hiddenObservedSet.add(el);
    hiddenObserver.observe(el);
  });
}

/**
 * Forces all hidden elements to show on very small screens (<= 350px).
 */
function revealOnTinyScreens() {
  if (window.innerWidth > 350) return;
  document
    .querySelectorAll(".hidden:not(.show)")
    .forEach((el) => el.classList.add("show"));
}

if (!window.__scrollRestorePending) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    observeHiddenElements();
  } else {
    window.addEventListener("DOMContentLoaded", observeHiddenElements);
  }
} else {
  hiddenElementsDeferred = true;
}
window.addEventListener("resize", revealOnTinyScreens);
revealOnTinyScreens();

/**
 * Creates a smooth scroll animation from start to end over a duration.
 * @param {number} start - Starting Y position.
 * @param {number} end - Target Y position.
 * @param {number} duration - Animation duration in ms.
 */
function createScrollAnimation(start, end, duration) {
  const distance = end - start;
  let startTime = null;
  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + distance * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Smoothly scrolls the page to a target element.
 * @param {HTMLElement} target - The target DOM element.
 * @param {number} [duration=1600] - Scroll duration in ms.
 */
function smoothScrollTo(target, duration = 1600) {
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY;
  createScrollAnimation(start, end, duration);
}

/**
 * Scrolls instantly to the element specified by the current URL fragment.
 * Used when navigating from external pages (e.g., legal-notice.html) with a fragment.
 * @returns {boolean} True if a fragment element was found and scrolled to, false otherwise.
 */
function scrollToFragment() {
  const hash = window.location.hash;
  if (!hash || hash === "") return false;

  const fragmentId = hash.substring(1);
  const target = document.getElementById(fragmentId);

  if (!target) {
    console.warn(`Fragment-Element #${fragmentId} nicht gefunden`);
    return false;
  }

  window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
  return true;
}

// Intercept anchor clicks for smooth scrolling
document.addEventListener("click", function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute("href"));
  if (target) smoothScrollTo(target, 1600);
});

const SCROLL_STORAGE_KEY = "portfolio-scroll-pos";

/**
 * Saves the current scroll position to sessionStorage.
 */
function saveCurrentScrollPosition() {
  try {
    const pos = {
      x: window.scrollX || 0,
      y: window.scrollY || 0,
      ts: Date.now(),
    };
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(pos));
  } catch (_) {}
}

/**
 * Reads the saved scroll position from sessionStorage.
 * @returns {Object|null} The saved position or null.
 */
function readSavedScrollPosition() {
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return null;
    const pos = JSON.parse(raw);
    if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
      return { x: pos.x, y: pos.y };
    }
  } catch (_) {}
  return null;
}

/**
 * Removes the saved scroll position from sessionStorage.
 */
function clearSavedScrollPosition() {
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch (_) {}
}

/**
 * Restores the window scroll position to the given coordinates.
 * @param {Object} pos - The position with x and y properties.
 */
function restoreScrollPosition(pos) {
  if (!pos) return;
  const restore = () => window.scrollTo(pos.x, pos.y);
  requestAnimationFrame(restore);
  setTimeout(restore, 25);
  setTimeout(restore, 100);
  setTimeout(restore, 250);
}

let sectionLoadingStarted = false;

/**
 * Prepares scroll restoration by setting history.scrollRestoration to 'manual'.
 * @returns {Object} An object containing whether the feature is supported and the previous value.
 */
function prepareScrollRestore() {
  const supports = "scrollRestoration" in history;
  const prev = supports ? history.scrollRestoration : null;
  if (supports) history.scrollRestoration = "manual";
  return { supports, prev };
}

/**
 * Finalizes loading: scrolls to fragment if present, otherwise restores scroll position,
 * clears storage, and processes deferred hidden elements.
 * @param {Object} savedPos - The saved scroll position.
 * @param {Object} prevScrollRest - The previous scrollRestoration setting.
 */
function finalizeAfterLoad(savedPos, prevScrollRest) {
  const hasFragment = window.location.hash && window.location.hash !== "";
  const fragmentScrolled = hasFragment ? scrollToFragment() : false;

  if (!fragmentScrolled) {
    restoreScrollPosition(savedPos);
  }

  clearSavedScrollPosition();
  if (window.__scrollRestorePending) {
    window.__scrollRestorePending = false;
    document.documentElement.classList.remove("scroll-restore-pending");
    document.body.classList.remove("scroll-restore-pending");
    if (hiddenElementsDeferred) {
      observeHiddenElements();
      hiddenElementsDeferred = false;
    }
  }
  if (prevScrollRest.supports) {
    setTimeout(() => {
      history.scrollRestoration = prevScrollRest.prev;
    }, 300);
  }
}

/**
 * Loads all section HTML sequentially and restores the scroll position.
 * @returns {Promise<void>}
 */
async function loadAllSections() {
  const savedPos = readSavedScrollPosition() || {
    x: window.scrollX || 0,
    y: window.scrollY || 0,
  };
  const prevScrollRest = prepareScrollRestore();
  try {
    await loadAboutmeHTML();
    await loadTechnologiesHTML();
    await loadTestimonialHTML();
    finalizeAfterLoad(savedPos, prevScrollRest);
  } catch (_) {}
}

/**
 * Initializes section loading if not already started.
 */
function initSectionLoading() {
  if (sectionLoadingStarted) return;
  sectionLoadingStarted = true;
  loadAllSections();
}

window.addEventListener("beforeunload", saveCurrentScrollPosition);
window.addEventListener("pagehide", saveCurrentScrollPosition);
window.addEventListener("pageshow", initSectionLoading);

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initSectionLoading();
} else {
  window.addEventListener("DOMContentLoaded", initSectionLoading);
}
