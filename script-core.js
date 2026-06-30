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
 * Clears all error messages.
 */
function clearErrors() {
  document.querySelectorAll('.error-message').forEach((e) => (e.textContent = ''));
}

/**
 * Counts characters that are not whitespace.
 * @param {string} value - The input string.
 * @returns {number} The amount of meaningful characters.
 */
function countRealCharacters(value) {
  return String(value || '').replace(/\s/g, '').length;
}

/**
 * Validates an email address using a regular expression.
 * @param {string} value - The email string.
 * @returns {boolean} True if valid.
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Validates the username field and sets an error message if invalid.
 * @param {HTMLElement} username - The username input element.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if valid.
 */
function validateName(username, translations) {
  const value = username.value;
  const isValid = countRealCharacters(value) >= 3;
  const errorEl = document.getElementById('error-username');
  if (errorEl) {
    errorEl.textContent = isValid ? '' : (translations['error.nameRequired'] || 'Name erforderlich');
  }
  return isValid;
}

/**
 * Validates the email field, checks format and emptiness.
 * @param {HTMLElement} email - The email input element.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if valid.
 */
function validateEmailField(email, translations) {
  const value = email.value.trim();
  const errorEl = document.getElementById('error-email');
  if (value === '') {
    if (errorEl) {
      errorEl.textContent = translations['error.emailRequired'] || 'E‑Mail erforderlich';
    }
    return false;
  } else if (!isValidEmail(value)) {
    if (errorEl) {
      errorEl.textContent = translations['error.emailInvalid'] || 'Ungültige E‑Mail';
    }
    return false;
  }
  if (errorEl) {
    errorEl.textContent = '';
  }
  return true;
}

/**
 * Validates the message textarea, ensures it is not empty.
 * @param {HTMLElement} textarea - The textarea element.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if valid.
 */
function validateMessage(textarea, translations) {
  const value = textarea.value;
  const isValid = countRealCharacters(value) >= 5;
  const errorEl = document.getElementById('error-textarea');
  if (errorEl) {
    errorEl.textContent = isValid ? '' : (translations['error.messageRequired'] || 'Nachricht erforderlich');
  }
  return isValid;
}

/**
 * Validates that the privacy policy checkbox is accepted.
 * @param {boolean} privacyAccepted - Whether the policy is accepted.
 * @param {Object} translations - Translation object.
 * @returns {boolean} True if accepted.
 */
function validatePolicy(privacyAccepted, translations) {
  if (!privacyAccepted) {
    const errorEl = document.getElementById('error-policy');
    if (errorEl) {
      errorEl.textContent =
        translations['error.policyRequired'] || 'Bitte akzeptieren Sie die Datenschutzbestimmungen.';
    }
    return false;
  }
  return true;
}

/**
 * Performs full form validation and displays error messages.
 * @param {Object} elements - Form elements.
 * @param {boolean} privacyAccepted - Privacy checkbox state.
 * @returns {boolean} True if the form is valid.
 */
function validateForm(elements, privacyAccepted) {
  const t = window.translations?.[window.currentLang] || {};
  let valid = true;
  if (!validateName(elements.username, t)) valid = false;
  if (!validateEmailField(elements.email, t)) valid = false;
  if (!validateMessage(elements.textarea, t)) valid = false;
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

  const responseText = await response.text();
  let result = {};

  try {
    result = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    result = { success: false, error: 'Invalid server response' };
  }

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Server error');
  }

  return result;
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
  if (!validateForm(elements, getPrivacyAccepted())) return;
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
    }
  } catch (error) {
    console.error('Contact form submission failed:', error);
    alert(error.message || 'Server error');
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
  let privacyAccepted = false;

  const getTranslations = () => window.translations?.[window.currentLang] || {};

  // Setup validation events for each field
  const setupFieldValidation = (field, validateFn, errorElId) => {
    if (!field) return;
    const errorEl = document.getElementById(errorElId);

    // On blur: validate and show error if invalid
    field.addEventListener('blur', () => {
      validateFn(field, getTranslations());
    });

    // On input: if valid, clear error
    field.addEventListener('input', () => {
      const value = field.value;
      let isValid = false;

      if (field.id === 'username') {
        isValid = countRealCharacters(value) >= 3;
      } else if (field.id === 'useremail') {
        isValid = isValidEmail(value);
      } else if (field.id === 'usertextarea') {
        isValid = countRealCharacters(value) >= 5;
      }

      if (isValid && errorEl) {
        errorEl.textContent = '';
      }
    });
  };

  setupFieldValidation(elements.username, validateName, 'error-username');
  setupFieldValidation(elements.email, validateEmailField, 'error-email');
  setupFieldValidation(elements.textarea, validateMessage, 'error-textarea');

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
    clearErrors();
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

// Initialize contact form after DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initContactForm();
} else {
  window.addEventListener('DOMContentLoaded', initContactForm);
}