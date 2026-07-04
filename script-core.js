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
    return;
  }
  blurActiveElement();
  observeHiddenElements();
}

/**
 * Blurs the currently focused element when possible.
 */
function blurActiveElement() {
  if (!document.activeElement || document.activeElement === document.body) return;
  try {
    document.activeElement.blur();
  } catch (_) {}
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
  await loadSection(
    "testimonial-container",
    "html/testimonial-section.html",
    async () => {
      if (typeof window.initTestimonialSlider === "function") {
        await window.initTestimonialSlider();
      }
    },
  );
}

/**
 * Loads the "About Me" section HTML and applies the current language.
 * @returns {Promise<void>}
 */
async function loadAboutmeHTML() {
  await loadSection("aboutme-container", "html/aboutme-section.html", () => {
    if (typeof window.applyLanguage === "function" && window.currentLang) {
      window.applyLanguage(window.currentLang);
    }
  });
}

/**
 * Loads the technologies section HTML and applies the current language.
 * @returns {Promise<void>}
 */
async function loadTechnologiesHTML() {
  await loadSection(
    "technologies-container",
    "html/technologies-section.html",
    () => {
      if (typeof window.applyLanguage === "function" && window.currentLang) {
        window.applyLanguage(window.currentLang);
      }
    },
  );
}

/**
 * Collects all relevant form DOM elements.
 * @returns {Object} An object containing the form elements.
 */
function getFormElements() {
  const email = document.getElementById("useremail");
  const username = document.getElementById("username");
  const textarea = document.getElementById("usertextarea");
  const form = document.getElementById("contactForm");
  const checkbox = document.getElementById("checkbox");
  const submitBtn = document.querySelector(".button button");
  return { email, username, textarea, form, checkbox, submitBtn };
}

/**
 * Clears all error messages.
 */
function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((e) => (e.textContent = ""));
}

/**
 * Counts characters that are not whitespace.
 * @param {string} value - The input string.
 * @returns {number} The amount of meaningful characters.
 */
function countRealCharacters(value) {
  return String(value || "").replace(/\s/g, "").length;
}

/**
 * Validates an email address using a regular expression.
 * @param {string} value - The email string.
 * @returns {boolean} True if valid.
 */
function isValidEmail(value) {
  return /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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
  const errorEl = document.getElementById("error-username");
  if (errorEl) {
    errorEl.textContent = isValid
      ? ""
      : translations["error.nameRequired"] || "Name erforderlich";
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
  const errorEl = document.getElementById("error-email");
  if (value === "") {
    return setEmailError(errorEl, translations["error.emailRequired"] || "E‑Mail erforderlich");
  }
  if (!isValidEmail(value)) {
    return setEmailError(errorEl, translations["error.emailInvalid"] || "Ungültige E‑Mail");
  }
  if (errorEl) {
    errorEl.textContent = "";
  }
  return true;
}

function setEmailError(errorEl, message) {
  if (errorEl) errorEl.textContent = message;
  return false;
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
  const errorEl = document.getElementById("error-textarea");
  if (errorEl) {
    errorEl.textContent = isValid
      ? ""
      : translations["error.messageRequired"] || "Nachricht erforderlich";
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
    const errorEl = document.getElementById("error-policy");
    if (errorEl) {
      errorEl.textContent =
        translations["error.policyRequired"] ||
        "Bitte akzeptieren Sie die Datenschutzbestimmungen.";
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
  const overlay = document.getElementById("successOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1500);
  }
}

/**
 * Sends the message data to the server via POST.
 * @param {Object} data - The form data.
 * @returns {Promise<Object>} The server response.
 */
async function sendMessage(data) {
  const response = await fetch("send.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await parseServerResponse(response);
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Server error");
  }
  return result;
}

async function parseServerResponse(response) {
  const responseText = await response.text();
  try {
    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    return { success: false, error: "Invalid server response" };
  }
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
  const data = createContactPayload(elements);
  await submitContactForm(data, resetForm);
}

async function submitContactForm(data, resetForm) {
  try {
    const result = await sendMessage(data);
    if (result.success) {
      showSuccessOverlay();
      resetForm();
    }
  } catch (error) {
    console.error("Contact form submission failed:", error);
    alert(error.message || "Server error");
  }
}

function createContactPayload(elements) {
  return {
    name: elements.username.value,
    email: elements.email.value,
    message: elements.textarea.value,
  };
}

/**
 * Updates the marquee button labels with the current text content.
 */
function updateMarqueeLabels() {
  document
    .querySelectorAll(
      ".marquee-btn, .marquee-contact, .marquee-talk, .marquee-submit",
    )
    .forEach((btn) => {
      const span = btn.querySelector(".marquee-track span");
      if (span) btn.dataset.label = span.textContent.trim();
    });
}

/**
 * Initializes the contact form: sets up listeners, checkbox, and language hook.
 */
function initContactForm() {
  const elements = getFormElements();
  if (!elements.form) return;
  const handlers = createContactHandlers(elements);
  setupFormListeners(elements, handlers);
  wrapApplyLanguage(updateMarqueeLabels);
}

function createContactHandlers(elements) {
  const state = { privacyAccepted: false };
  return {
    updateFieldState: createFieldStateUpdater(elements, state),
    togglePrivacy: createPrivacyToggler(elements, state),
    resetForm: createResetFormHandler(elements, state),
    handleFormSubmit: createSubmitHandler(elements, state),
  };
}

function createFieldStateUpdater(elements, state) {
  return (field, errorElId, validateFn) => {
    if (!field) return;
    const errorEl = document.getElementById(errorElId);
    field.addEventListener("blur", () => validateFn(field, getTranslations()));
    field.addEventListener("input", () => clearFieldErrorIfValid(field, errorEl));
  };
}

function getTranslations() {
  return window.translations?.[window.currentLang] || {};
}

function createPrivacyToggler(elements, state) {
  return () => {
    state.privacyAccepted = !state.privacyAccepted;
    updatePrivacyCheckboxState(elements.checkbox, state.privacyAccepted);
    document.getElementById("error-policy").textContent = "";
  };
}

function createResetFormHandler(elements, state) {
  return () => {
    elements.form.reset();
    state.privacyAccepted = false;
    resetCheckboxState(elements.checkbox);
    clearErrors();
  };
}

function createSubmitHandler(elements, state) {
  return (e) => {
    handleSubmit(e, elements, () => state.privacyAccepted, createResetFormHandler(elements, state));
  };
}

function setupFormListeners(elements, handlers) {
  bindFormValidation(elements, handlers.updateFieldState);
  if (elements.checkbox) elements.checkbox.addEventListener("click", handlers.togglePrivacy);
  elements.form.addEventListener("submit", handlers.handleFormSubmit);
}

function bindFormValidation(elements, updateFieldState) {
  updateFieldState(elements.username, "error-username", validateName);
  updateFieldState(elements.email, "error-email", validateEmailField);
  updateFieldState(elements.textarea, "error-textarea", validateMessage);
}

function clearFieldErrorIfValid(field, errorEl) {
  const value = field.value;
  const isValid = getFieldValidity(field, value);
  if (isValid && errorEl) errorEl.textContent = "";
}

function resetCheckboxState(checkbox) {
  if (checkbox) {
    checkbox.src = "assets/imgs/icons/checkbox-unchecked.svg";
  }
}

function updatePrivacyCheckboxState(checkbox, privacyAccepted) {
  if (!checkbox) return;
  checkbox.src = privacyAccepted
    ? "assets/imgs/icons/checkbox-checked.svg"
    : "assets/imgs/icons/checkbox-unchecked.svg";
}

function getFieldValidity(field, value) {
  if (field.id === "username") return countRealCharacters(value) >= 3;
  if (field.id === "useremail") return isValidEmail(value);
  if (field.id === "usertextarea") return countRealCharacters(value) >= 5;
  return false;
}

function wrapApplyLanguage(callback) {
  if (typeof window.applyLanguage !== "function") return;
  const orig = window.applyLanguage;
  window.applyLanguage = function (lang) {
    orig(lang);
    callback();
  };
  window.applyLanguage(window.currentLang);
}

// Initialize contact form after DOM is ready
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initContactForm();
} else {
  window.addEventListener("DOMContentLoaded", initContactForm);
}
