async function loadDialogs() {
  const container = document.getElementById("dialogs");
  const response = await fetch("html/project-dialogs.html");
  const html = await response.text();
  container.innerHTML = html;
  if (window.applyLanguage) {
    window.applyLanguage(window.currentLang);
  }
  initDialog();
}

loadDialogs();

// -----------------------------Dilaog
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  dialog.showModal();
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  dialog.close();
}

function initDialog() {
  const dialogs = Array.from(document.querySelectorAll(".project-dialog"));

  dialogs.forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();

      const clickedInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!clickedInside) {
        dialog.close();
      }
    });
  });

  dialogs.forEach((dialog, index) => {
    const nextBtn = dialog.querySelector(".next-project");

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const currentDialog = dialogs[index];
        const nextDialog = dialogs[(index + 1) % dialogs.length];

        currentDialog.classList.add("closing");

        setTimeout(() => {
          currentDialog.close();
          currentDialog.classList.remove("closing");

          requestAnimationFrame(() => {
            nextDialog.showModal();
          });
        }, 250);
      });
    }
  });
}
