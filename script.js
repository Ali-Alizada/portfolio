

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

    if (!clickedInside) {
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




const email = document.getElementById("useremail");
const username = document.getElementById("username");
const textarea = document.getElementById("usertextarea");
const submitBtn = document.querySelector(".button button");

const originalPlaceholders = {
  username: username.placeholder,
  email: email.placeholder,
  textarea: textarea.placeholder
};

// help Function to delte the error classes.

function removeErrorClass(element) {
  element.classList.remove("error-placeholder");
};

// help function: to reset placeholder and delete the error classes.
function resetField(fieldId, originalText) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.placeholder = originalText;
    removeErrorClass(field);
  }
}

// input-EventListener (one time restration!)

username.addEventListener("input", () => {
  username.placeholder = originalPlaceholders.username;
  removeErrorClass(username);
  document.getElementById("error-username").textContent = "";
});

email.addEventListener("input", () => {
  email.placeholder = originalPlaceholders.email;
  removeErrorClass(email);
  document.getElementById("error-email").textContent = "";
});

textarea.addEventListener("input", () => {
  textarea.placeholder = originalPlaceholders.textarea;
  removeErrorClass(textarea);
  document.getElementById("error-textarea").textContent = "";
});


function validateForm() {
  clearErrors();

  let valid = true;

  if (username.value.trim() === "") {
    username.placeholder = "Oops! It seems your name is missing";
    username.classList.add("error-placeholder");
    document.getElementById("error-username").textContent = "";
    valid = false;

  }

  if (email.value.trim() === "") {
    email.placeholder = "Hoppla! your email is required";
    email.classList.add("error-placeholder");
    document.getElementById("error-email").textContent = "";
    valid = false;
  }

  if (textarea.value.trim() === "") {
    textarea.placeholder = "What do you need to develop?";
    textarea.classList.add("error-placeholder");
    document.getElementById("error-textarea").textContent = "";
    valid = false;
  }

  if (!privacyAccepted) {
    document.getElementById("error-policy").textContent =
      "Please accept the privacy policy.";
    valid = false;
  }

  return valid;
}

//  CheckBox Function!
let privacyAccepted = false;

const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("click", () => {
  console.log("checkBox checked!");
  privacyAccepted = !privacyAccepted;

  checkbox.src = privacyAccepted
    ? "assets/imgs/icons/checkbox-checked.svg"
    : "assets/imgs/icons/checkbox-unchecked.svg";

  document.getElementById("error-policy").textContent = "";
});


function clearErrors() {
  document.querySelectorAll(".error-message").forEach((e) => {
    e.textContent = "";
  });


  resetField("username", originalPlaceholders.username);
  resetField("email", originalPlaceholders.email);
  resetField("textarea", originalPlaceholders.textarea);
}


function addMessage() {
  if (!validateForm()) {
    return;
  }
  console.log("form submitted!");
  // Hier kommt später meine tatsächlicher Submit-Code hin (z. B. fetch)
}


if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addMessage();
  })
}










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