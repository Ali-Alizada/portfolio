

// -----------------------------Dilaog
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  dialog.showModal();
  document.body.style.overflow = "hidden";
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  dialog.close();
  document.body.style.overflow = "auto";
}

const dialogs = Array.from(document.querySelectorAll('.project-dialog'));

dialogs.forEach(dialog => {
    dialog.addEventListener('click', (e) => {

            const rect = dialog.getBoundingClientRect();

            const clickedInside = 
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

            if(!clickedInside) {
                dialog.close();
            }
            document.body.style.overflow = 'auto'; 
    });
});

dialogs.forEach((dialog, index) => {
    const nextBtn = dialog.querySelector(".next-project");
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
                document.body.style.overflow = "hidden";
            });
        }, 250);
    });
});

// -----------------------testimonial slide





// const hiddenElements = document.querySelectorAll(".hidden");

// const observer = new IntersectionObserver((entries) => {

//     entries.forEach((entry) => {

//         if (entry.isIntersecting) {
//             entry.target.classList.add("show");
//         }

//     });

// }, {
//     threshold: 0.2
// });

// hiddenElements.forEach((el) => observer.observe(el));