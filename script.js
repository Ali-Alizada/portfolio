

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

// -----------------------testimonial slides

let slider = document.querySelector(".testimonial-slider");
let cards = document.querySelectorAll(".testimonial-card");
let nextBtn = document.querySelector(".next");
let prevBtn = document.querySelector(".prev");
let dots = document.querySelectorAll(".dot");
let viewport = document.querySelector(".testimonial-viewport");

let currentIndex = 1;
let slideDistance = 0;   

function updateSlideDistance() {
  const viewportWidth = viewport.getBoundingClientRect().width;
  const gap = 76; 
  slideDistance = viewportWidth + gap;
}

function updateSlider() {
  updateSlideDistance();
  slider.style.transform = `translateX(-${currentIndex * slideDistance}px)`;

  dots.forEach(dot => dot.classList.remove("active"));
  cards.forEach(card => card.classList.remove("active"));
  dots[currentIndex].classList.add("active");
  cards[currentIndex].classList.add("active");
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= cards.length) currentIndex = 0;
  updateSlider();
});

prevBtn.addEventListener("click", () => {
  currentIndex--;
  if (currentIndex < 0) currentIndex = cards.length - 1;
  updateSlider();
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateSlider();
  });
});

window.addEventListener("resize", () => {
  updateSlider();
});

updateSlider();

//  -------------------------- Contact Form


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