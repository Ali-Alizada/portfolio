/**
 * Loads the dialog HTML, inserts it, refreshes language, and initializes dialogs.
 * @returns {Promise<void>}
 */
async function loadDialogs() {
  const html = await fetchDialogHtml();

  insertDialogHtml(html);
  refreshLanguage();
  initDialog();
}

/**
 * Fetches the dialog HTML content from the server.
 * @returns {Promise<string>} The HTML content as a string.
 */
async function fetchDialogHtml() {
  const response = await fetch("html/projects-dialog.html");
  return response.text();
}

/**
 * Inserts the fetched HTML into the #dialogs container.
 * @param {string} html - The HTML string to insert.
 */
function insertDialogHtml(html) {
  document.getElementById("dialogs").innerHTML = html;
}

/**
 * Refreshes the language by calling the global applyLanguage function if available.
 */
function refreshLanguage() {
  if (window.applyLanguage) {
    window.applyLanguage(window.currentLang);
  }
}

// Load dialogs when script runs
loadDialogs();

/**
 * Opens a dialog by its ID using showModal().
 * @param {string} dialogId - The ID of the dialog element.
 */
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  dialog.showModal();
}

/**
 * Closes a dialog by its ID using close().
 * @param {string} dialogId - The ID of the dialog element.
 */
function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  dialog.close();
}

/**
 * Initializes dialog behavior: adds outside-click closing and next-project buttons.
 */
function initDialog() {
  const dialogs = getDialogs();

  dialogs.forEach(addOutsideClose);
  dialogs.forEach((dialog, index) => {
    addNextButton(dialog, index, dialogs);
  });
}

/**
 * Retrieves all elements with the class .project-dialog.
 * @returns {HTMLElement[]} An array of dialog elements.
 */
function getDialogs() {
  return Array.from(document.querySelectorAll(".project-dialog"));
}

/**
 * Adds a click listener to close a dialog when clicking outside its content.
 * @param {HTMLDialogElement} dialog - The dialog element.
 */
function addOutsideClose(dialog) {
  dialog.addEventListener("click", (event) => {
    if (clickedOutside(dialog, event)) {
      dialog.close();
    }
  });
}

/**
 * Checks if a click event occurred outside the dialog's bounding rectangle.
 * @param {HTMLDialogElement} dialog - The dialog element.
 * @param {MouseEvent} event - The click event.
 * @returns {boolean} True if the click was outside, false otherwise.
 */
function clickedOutside(dialog, event) {
  const rect = dialog.getBoundingClientRect();

  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}

/**
 * Adds a click listener to the .next-project button inside a dialog.
 * When clicked, it closes the current dialog and opens the next one (or the first).
 * @param {HTMLDialogElement} dialog - The current dialog element.
 * @param {number} index - The index of the current dialog in the dialogs array.
 * @param {HTMLDialogElement[]} dialogs - The array of all dialog elements.
 */
function addNextButton(dialog, index, dialogs) {
  const btn = dialog.querySelector(".next-project");

  if (!btn) return;

  btn.addEventListener("click", (event) => {
    event.stopPropagation();

    const nextDialog = dialogs[index + 1] || dialogs[0];

    openNextDialog(dialog, nextDialog);
  });
}

/**
 * Handles the transition from the current dialog to the next one.
 * It adds a closing class, waits 250ms, closes the current, and opens the next.
 * @param {HTMLDialogElement} current - The current dialog element.
 * @param {HTMLDialogElement} next - The next dialog element to open.
 */
function openNextDialog(current, next) {
  current.classList.add("closing");

  setTimeout(() => {
    current.close();
    current.classList.remove("closing");

    requestAnimationFrame(() => {
      next.showModal();
    });
  }, 250);
}