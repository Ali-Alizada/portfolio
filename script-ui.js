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
  attachMenuEvents(burger, menu, toggleMenu, closeMenu);
})();

/**
 * Toggles the visibility of the mobile menu and updates accessibility attributes.
 */
function toggleMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".header-content");
  if (!burger || !menu) return;
  burger.classList.toggle("active");
  menu.classList.toggle("active");
  burger.setAttribute(
    "aria-expanded",
    burger.classList.contains("active") ? "true" : "false",
  );
}

/**
 * Closes the mobile navigation menu and updates accessibility attributes.
 */
function closeMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".header-content");
  if (!burger || !menu) return;
  burger.classList.remove("active");
  menu.classList.remove("active");
  burger.setAttribute("aria-expanded", "false");
}

/**
 * Attaches event listeners for clicking the menu trigger, menu links, or outside of the menu.
 * @param {HTMLElement} burger - Burger icon element.
 * @param {HTMLElement} menu - Navigation menu content container.
 * @param {Function} toggleMenu - Toggle menu callback.
 * @param {Function} closeMenu - Close menu callback.
 */
function attachMenuEvents(burger, menu, toggleMenu, closeMenu) {
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
}

let hiddenObserver = null;
const hiddenObservedSet = new WeakSet();
let hiddenElementsDeferred = false;

/**
 * Selects all DOM elements that are hidden but not yet shown.
 * @returns {NodeListOf<HTMLElement>} List of hidden elements.
 */
function getHiddenElements() {
  return document.querySelectorAll(".hidden:not(.show)");
}

/**
 * Returns the existing IntersectionObserver or creates a new one to observe hidden elements.
 * @returns {IntersectionObserver} The IntersectionObserver instance.
 */
function ensureHiddenObserver() {
  if (hiddenObserver) return hiddenObserver;
  hiddenObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => entry.target.classList.add("show"));
      hiddenObserver.unobserve(entry.target);
      hiddenObservedSet.delete(entry.target);
    });
  }, { threshold: 0.2 });
  return hiddenObserver;
}

/**
 * Sets up an IntersectionObserver to reveal hidden elements when they enter the viewport.
 */
function observeHiddenElements() {
  const hiddenEls = getHiddenElements();
  if (!hiddenEls.length) return;
  const observer = ensureHiddenObserver();
  hiddenEls.forEach((el) => {
    if (hiddenObservedSet.has(el)) return;
    hiddenObservedSet.add(el);
    observer.observe(el);
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
 * Computes an easing value using a cubic easing function for smooth animations.
 * @param {number} progress - Animation progress between 0 and 1.
 * @returns {number} The eased progress value.
 */
function getEaseValue(progress) {
  if (progress < 0.5) return 4 * progress * progress * progress;
  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

/**
 * Creates a smooth scroll animation from start to end over a duration.
 * @param {number} start - Starting Y position.
 * @param {number} end - Target Y position.
 * @param {number} duration - Animation duration in ms.
 */
function createScrollAnimation(start, end, duration) {
  const distance = end - start;
  let startTime = null;
  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = getEaseValue(progress);
    window.scrollTo(0, start + distance * ease);
    if (progress < 1) requestAnimationFrame(step);
  };
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

/**
 * Intercepts anchor clicks and initiates smooth scrolling to the target element.
 * @param {Event} e - The click event.
 */
function handleScrollLinkClick(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute("href"));
  if (target) smoothScrollTo(target, 1600);
}

// Intercept anchor clicks for smooth scrolling
document.addEventListener("click", handleScrollLinkClick);

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
 * Clears the pending scroll restoration state and processes any deferred hidden elements.
 */
function clearPendingScrollRestoreState() {
  if (!window.__scrollRestorePending) return;
  window.__scrollRestorePending = false;
  document.documentElement.classList.remove("scroll-restore-pending");
  document.body.classList.remove("scroll-restore-pending");
  if (hiddenElementsDeferred) {
    observeHiddenElements();
    hiddenElementsDeferred = false;
  }
}

/**
 * Restores the browser's scrollRestoration setting to its original state.
 * @param {Object} prevScrollRest - Object containing scroll restoration support info and original state.
 */
function restoreScrollRestoration(prevScrollRest) {
  if (!prevScrollRest.supports) return;
  setTimeout(() => {
    history.scrollRestoration = prevScrollRest.prev;
  }, 300);
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
  clearPendingScrollRestoreState();
  restoreScrollRestoration(prevScrollRest);
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
