/**
 * Initializes a custom cursor shadow that follows the mouse pointer.
 * Attaches a mousemove listener to update the shadow element's position.
 */
(function initCursorShadow() {
  const cursorShadow = document.querySelector('.cursor-shadow');
  if (!cursorShadow) return;
  document.addEventListener('mousemove', (e) => {
    cursorShadow.style.left = `${e.clientX}px`;
    cursorShadow.style.top = `${e.clientY}px`;
  });
})();

/**
 * Retrieves a DOM element by its ID and logs a warning if not found.
 * @param {string} id - The element ID.
 * @returns {HTMLElement|null} The found element or null.
 */
function getContainer(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Kein Container #${id} gefunden.`);
  return el;
}

/**
 * Fetches HTML content from a given URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} The response text.
 * @throws Will throw an error if the HTTP response is not ok.
 */
async function fetchHtml(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

/**
 * Performs common actions after a section is loaded:
 * - Defers hidden element observation if scroll restore is pending,
 * - otherwise blurs the active element and starts observing hidden elements.
 */
function handleAfterLoad() {
  if (window.__scrollRestorePending) {
    hiddenElementsDeferred = true;
  } else {
    if (document.activeElement && document.activeElement !== document.body) {
      try { document.activeElement.blur(); } catch (_) {}
    }
    observeHiddenElements();
  }
}

/**
 * Loads a section by fetching HTML and injecting it into a container.
 * Optionally executes an initialization callback after insertion.
 * @param {string} containerId - ID of the container element.
 * @param {string} url - URL of the HTML fragment.
 * @param {Function} [initCallback] - Optional callback to run after HTML is set.
 * @returns {Promise<void>}
 */
async function loadSection(containerId, url, initCallback) {
  const container = getContainer(containerId);
  if (!container) return;
  const html = await fetchHtml(url);
  container.innerHTML = html;
  if (initCallback) await initCallback();
  handleAfterLoad();
}

/**
 * Loads the testimonial section HTML and initializes the testimonial slider.
 * @returns {Promise<void>}
 */
async function loadTestimonialHTML() {
  await loadSection('testimonial-container', 'html/testimonial-section.html', async () => {
    if (typeof window.initTestimonialSlider === 'function') {
      await window.initTestimonialSlider();
    }
  });
}

/**
 * Loads the "About Me" section HTML and applies the current language.
 * @returns {Promise<void>}
 */
async function loadAboutmeHTML() {
  await loadSection('aboutme-container', 'html/aboutme-section.html', () => {
    if (typeof window.applyLanguage === 'function' && window.currentLang) {
      window.applyLanguage(window.currentLang);
    }
  });
}

/**
 * Loads the technologies section HTML and applies the current language.
 * @returns {Promise<void>}
 */
async function loadTechnologiesHTML() {
  await loadSection('technologies-container', 'html/technologies-section.html', () => {
    if (typeof window.applyLanguage === 'function' && window.currentLang) {
      window.applyLanguage(window.currentLang);
    }
  });
}

/**
 * Collects all relevant form DOM elements.
 * @returns {Object} An object containing the form elements.
 */
function getFormElements() {
  const email = document.getElementById('useremail');
  const username = document.getElementById('username');
  const textarea = document.getElementById('usertextarea');
  const form = document.getElementById('contactForm');
  const checkbox = document.getElementById('checkbox');
  const submitBtn = document.querySelector('.button button');
  return { email, username, textarea, form, checkbox, submitBtn };
}

/**
 * Returns the original placeholder texts for the form fields.
 * @param {Object} elements - The form elements object.
 * @returns {Object} Placeholder texts.
 */
function getOriginalPlaceholders(elements) {
  return {
    username: elements.username ? elements.username.placeholder : '',
    email: elements.email ? elements.email.placeholder : '',
    textarea: elements.textarea ? elements.textarea.placeholder : '',
  };
}

/**
 * Removes the error-placeholder class from an element.
 * @param {HTMLElement} el - The element to clean.
 */
function removeErrorClass(el) {
  if (el) el.classList.remove('error-placeholder');
}

/**
 * Resets a specific field's placeholder to its original text.
 * @param {string} fieldId - The ID of the field.
 * @param {string} originalText - The original placeholder text.
 */
function resetField(fieldId, originalText) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.placeholder = originalText;
    removeErrorClass(field);
  }
}

/**
 * Clears all error messages and resets placeholders.
 * @param {Object} placeholders - The original placeholder texts.
 */
function clearErrors(placeholders) {
  document.querySelectorAll('.error-message').forEach((e) => (e.textContent = ''));
  resetField('username', placeholders.username);
  resetField('email', placeholders.email);
  resetField('textarea', placeholders.textarea);
  document.getElementById('error-policy').textContent = '';
}

/**
 * Validates an email address using a regular expression.
 * @param {string} value - The email string.
 * @returns {boolean} True if valid.
 */
function isValidEmail(value) {
  return /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(value);
}

/**
 * Validates the username field, sets an error placeholder if empty.
 * @param {HTMLElement} username - The username input element.
 * @param {Object} placeholders - Original placeholder texts.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if valid.
 */
function validateName(username, placeholders, translations) {
  if (username.value.trim() === '') {
    username.placeholder = translations['error.nameRequired'] || 'Name erforderlich';
    username.classList.add('error-placeholder');
    return false;
  }
  return true;
}

/**
 * Validates the email field, checks format and emptiness.
 * @param {HTMLElement} email - The email input element.
 * @param {Object} placeholders - Original placeholder texts.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if valid.
 */
function validateEmailField(email, placeholders, translations) {
  if (email.value.trim() === '') {
    email.placeholder = translations['error.emailRequired'] || 'E‑Mail erforderlich';
    email.classList.add('error-placeholder');
    return false;
  } else if (!isValidEmail(email.value.trim())) {
    document.getElementById('error-email').textContent =
      translations['error.emailInvalid'] || 'Ungültige E‑Mail';
    return false;
  }
  return true;
}

/**
 * Validates the message textarea, ensures it is not empty.
 * @param {HTMLElement} textarea - The textarea element.
 * @param {Object} placeholders - Original placeholder texts.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if valid.
 */
function validateMessage(textarea, placeholders, translations) {
  if (textarea.value.trim() === '') {
    textarea.placeholder = translations['error.messageRequired'] || 'Nachricht erforderlich';
    textarea.classList.add('error-placeholder');
    return false;
  }
  return true;
}

/**
 * Validates that the privacy policy checkbox is accepted.
 * @param {boolean} privacyAccepted - Whether the policy is accepted.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if accepted.
 */
function validatePolicy(privacyAccepted, translations) {
  if (!privacyAccepted) {
    document.getElementById('error-policy').textContent =
      translations['error.policyRequired'] || 'Bitte akzeptieren Sie die Datenschutzbestimmungen.';
    return false;
  }
  return true;
}

/**
 * Performs full form validation and displays error messages.
 * @param {Object} elements - Form elements.
 * @param {boolean} privacyAccepted - Privacy checkbox state.
 * @param {Object} placeholders - Original placeholders.
 * @returns {boolean} True if the form is valid.
 */
function validateForm(elements, privacyAccepted, placeholders) {
  clearErrors(placeholders);
  const t = window.translations?.[window.currentLang] || {};
  let valid = true;
  if (!validateName(elements.username, placeholders, t)) valid = false;
  if (!validateEmailField(elements.email, placeholders, t)) valid = false;
  if (!validateMessage(elements.textarea, placeholders, t)) valid = false;
  if (!validatePolicy(privacyAccepted, t)) valid = false;
  return valid;
}

/**
 * Shows a success overlay for a short time.
 */
function showSuccessOverlay() {
  const overlay = document.getElementById('successOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.style.display = 'none'; }, 1500);
  }
}

/**
 * Sends the message data to the server via POST.
 * @param {Object} data - The form data.
 * @returns {Promise<Object>} The server response.
 */
async function sendMessage(data) {
  const response = await fetch('send.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Handles the form submission: validates, sends data, and shows feedback.
 * @param {Event} e - The submit event.
 * @param {Object} elements - Form elements.
 * @param {Function} getPrivacyAccepted - Function that returns the current privacy state.
 * @param {Function} resetForm - Function to reset the form.
 */
async function handleSubmit(e, elements, getPrivacyAccepted, resetForm) {
  e.preventDefault();
  if (!validateForm(elements, getPrivacyAccepted(), getOriginalPlaceholders(elements))) return;
  const data = {
    name: elements.username.value,
    email: elements.email.value,
    message: elements.textarea.value,
  };
  try {
    const result = await sendMessage(data);
    if (result.success) {
      showSuccessOverlay();
      resetForm();
    } else {
      alert('Sending failed');
    }
  } catch (_) {
    alert('Server error');
  }
}

/**
 * Updates the marquee button labels with the current text content.
 */
function updateMarqueeLabels() {
  document.querySelectorAll('.marquee-btn, .marquee-contact, .marquee-talk, .marquee-submit')
    .forEach((btn) => {
      const span = btn.querySelector('.marquee-track span');
      if (span) btn.dataset.label = span.textContent.trim();
    });
}

/**
 * Initializes the contact form: sets up listeners, checkbox, and language hook.
 */
function initContactForm() {
  const elements = getFormElements();
  if (!elements.form) return;
  const placeholders = getOriginalPlaceholders(elements);
  let privacyAccepted = false;

  // Input listeners to clear errors on typing
  const inputListener = (fieldId, placeholderKey) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => {
        field.placeholder = placeholders[placeholderKey];
        removeErrorClass(field);
        document.getElementById(`error-${fieldId}`).textContent = '';
      });
    }
  };
  inputListener('username', 'username');
  inputListener('email', 'email');
  inputListener('textarea', 'textarea');

  // Checkbox toggle
  if (elements.checkbox) {
    elements.checkbox.addEventListener('click', () => {
      privacyAccepted = !privacyAccepted;
      elements.checkbox.src = privacyAccepted
        ? 'assets/imgs/icons/checkbox-checked.svg'
        : 'assets/imgs/icons/checkbox-unchecked.svg';
      document.getElementById('error-policy').textContent = '';
    });
  }

  // Form submission
  const resetForm = () => {
    elements.form.reset();
    privacyAccepted = false;
    if (elements.checkbox) {
      elements.checkbox.src = 'assets/imgs/icons/checkbox-unchecked.svg';
    }
  };
  elements.form.addEventListener('submit', (e) => {
    handleSubmit(e, elements, () => privacyAccepted, resetForm);
  });

  // Update marquee labels when language changes
  if (typeof window.applyLanguage === 'function') {
    const orig = window.applyLanguage;
    window.applyLanguage = function (lang) {
      orig(lang);
      updateMarqueeLabels();
    };
    window.applyLanguage(window.currentLang);
  }
}

/**
 * Initializes the burger menu toggle and click‑outside closing.
 */
(function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.header-content');
  if (!burger || !menu) return;

  /**
   * Toggles the active state of the burger and menu.
   */
  function toggleMenu() {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
    burger.setAttribute('aria-expanded', burger.classList.contains('active') ? 'true' : 'false');
  }

  /**
   * Closes the menu and resets the burger state.
   */
  function closeMenu() {
    burger.classList.remove('active');
    menu.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
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
  const hiddenEls = document.querySelectorAll('.hidden:not(.show)');
  if (!hiddenEls.length) return;
  if (!hiddenObserver) {
    hiddenObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => entry.target.classList.add('show'));
          hiddenObserver.unobserve(entry.target);
          hiddenObservedSet.delete(entry.target);
        }
      });
    }, { threshold: 0.2 });
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
  document.querySelectorAll('.hidden:not(.show)').forEach((el) => el.classList.add('show'));
}

// Initial observer setup unless scroll restore is pending
if (!window.__scrollRestorePending) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observeHiddenElements();
  } else {
    window.addEventListener('DOMContentLoaded', observeHiddenElements);
  }
} else {
  hiddenElementsDeferred = true;
}
window.addEventListener('resize', revealOnTinyScreens);
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
    const ease = progress < 0.5
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

// Intercept anchor clicks for smooth scrolling
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) smoothScrollTo(target, 1600);
});

const SCROLL_STORAGE_KEY = 'portfolio-scroll-pos';

/**
 * Saves the current scroll position to sessionStorage.
 */
function saveCurrentScrollPosition() {
  try {
    const pos = { x: window.scrollX || 0, y: window.scrollY || 0, ts: Date.now() };
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
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      return { x: pos.x, y: pos.y };
    }
  } catch (_) {}
  return null;
}

/**
 * Removes the saved scroll position from sessionStorage.
 */
function clearSavedScrollPosition() {
  try { sessionStorage.removeItem(SCROLL_STORAGE_KEY); } catch (_) {}
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
  const supports = 'scrollRestoration' in history;
  const prev = supports ? history.scrollRestoration : null;
  if (supports) history.scrollRestoration = 'manual';
  return { supports, prev };
}

/**
 * Finalizes loading: restores scroll position, clears storage, and processes deferred hidden elements.
 * @param {Object} savedPos - The saved scroll position.
 * @param {Object} prevScrollRest - The previous scrollRestoration setting.
 */
function finalizeAfterLoad(savedPos, prevScrollRest) {
  restoreScrollPosition(savedPos);
  clearSavedScrollPosition();
  if (window.__scrollRestorePending) {
    window.__scrollRestorePending = false;
    document.documentElement.classList.remove('scroll-restore-pending');
    document.body.classList.remove('scroll-restore-pending');
    if (hiddenElementsDeferred) {
      observeHiddenElements();
      hiddenElementsDeferred = false;
    }
  }
  if (prevScrollRest.supports) {
    setTimeout(() => { history.scrollRestoration = prevScrollRest.prev; }, 300);
  }
}

/**
 * Loads all section HTML sequentially and restores the scroll position.
 * @returns {Promise<void>}
 */
async function loadAllSections() {
  const savedPos = readSavedScrollPosition() || { x: window.scrollX || 0, y: window.scrollY || 0 };
  const prevScrollRest = prepareScrollRestore();
  try {
    await loadAboutmeHTML();
    await loadTechnologiesHTML();
    await loadTestimonialHTML();
    finalizeAfterLoad(savedPos, prevScrollRest);
  } catch (_) {
    // optional error handling
  }
}

/**
 * Initializes section loading if not already started.
 */
function initSectionLoading() {
  if (sectionLoadingStarted) return;
  sectionLoadingStarted = true;
  loadAllSections();
}

window.addEventListener('beforeunload', saveCurrentScrollPosition);
window.addEventListener('pagehide', saveCurrentScrollPosition);
window.addEventListener('pageshow', initSectionLoading);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initSectionLoading();
} else {
  window.addEventListener('DOMContentLoaded', initSectionLoading);
}

// Initialize contact form after DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initContactForm();
} else {
  window.addEventListener('DOMContentLoaded', initContactForm);
}