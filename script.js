// Cursor Shadow
const cursorShadow = document.querySelector(".cursor-shadow");
if (cursorShadow) {
  document.addEventListener("mousemove", (e) => {
    cursorShadow.style.left = `${e.clientX}px`;
    cursorShadow.style.top = `${e.clientY}px`;
  });
}

// -----------------------testimonial slides

let slider = document.querySelector(".testimonial-slider");
let cards = document.querySelectorAll(".testimonial-card");
let nextBtn = document.querySelector(".next");
let prevBtn = document.querySelector(".prev");
let dots = document.querySelectorAll(".dot");
let viewport = document.querySelector(".testimonial-viewport");

let currentIndex = 1;
let slideDistance = 0;

// wait for images within the testimonial viewport to be ready (prevents layout shifts)
function waitForViewportImages() {
  if (!viewport) return Promise.resolve();
  const imgs = Array.from(viewport.querySelectorAll('img'));
  if (!imgs.length) return Promise.resolve();
  const decodes = imgs.map((img) => {
    if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
    return new Promise((res) => {
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  });
  return Promise.all(decodes);
}

function updateSlideDistance() {
  if (!viewport) return;
  const viewportWidth = viewport.getBoundingClientRect().width;
  const gap = 22;
  slideDistance = viewportWidth + gap;
}

function updateSlider() {
  if (!slider || !cards.length || !dots.length) return;

  updateSlideDistance();

  const targetCard = cards[currentIndex];
  let targetX = 0;
  if (targetCard) {
    targetX = targetCard.offsetLeft;
  } else {
    targetX = currentIndex * slideDistance;
  }

  const isFirstLayout = !slider.dataset.inited;
  if (isFirstLayout) slider.style.transition = "none";

  slider.style.transform = `translateX(-${targetX}px)`;

  slider.getBoundingClientRect();

  if (isFirstLayout) {
    requestAnimationFrame(() => {
      slider.style.transition = "";
      slider.dataset.inited = "true";
    });
  }

  dots.forEach((dot) => dot.classList.remove("active"));
  cards.forEach((card) => card.classList.remove("active"));

  dots[currentIndex].classList.add("active");
  cards[currentIndex].classList.add("active");
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= cards.length) currentIndex = 0;
    updateSlider();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = cards.length - 1;
    updateSlider();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateSlider();
  });
});

window.addEventListener("resize", () => updateSlider());

async function initSlider() {
  await waitForViewportImages();
  updateSlider();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initSlider();
} else {
  window.addEventListener('DOMContentLoaded', initSlider);
}

//  -------------------------- Contact Form

const email = document.getElementById("useremail");
const username = document.getElementById("username");
const textarea = document.getElementById("usertextarea");
const submitBtn = document.querySelector(".button button");

const form = document.getElementById("contactForm");

const originalPlaceholders = {
  username: username ? username.placeholder : "",
  email: email ? email.placeholder : "",
  textarea: textarea ? textarea.placeholder : "",
};

function updateMarqueeLabels() {
  document
    .querySelectorAll(
      ".marquee-btn, .marquee-contact, .marquee-talk, .marquee-submit",
    )
    .forEach((button) => {
      const textSpan = button.querySelector(".marquee-track span");
      if (textSpan) {
        button.dataset.label = textSpan.textContent.trim();
      }
    });
}

if (typeof window.applyLanguage === "function") {
  const originalApplyLanguage = window.applyLanguage;
  window.applyLanguage = function (lang) {
    originalApplyLanguage(lang);
    updateMarqueeLabels();
  };
  window.applyLanguage(window.currentLang);
}

// helper Function to delte the error classes.

function removeErrorClass(element) {
  element.classList.remove("error-placeholder");
}

// helper function: to reset placeholder and delete the error classes.
function resetField(fieldId, originalText) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.placeholder = originalText;
    removeErrorClass(field);
  }
}

// input-EventListener (one time restration!)

if (username) {
  username.addEventListener("input", () => {
    username.placeholder = originalPlaceholders.username;
    removeErrorClass(username);
    document.getElementById("error-username").textContent = "";
  });
}

if (email) {
  email.addEventListener("input", () => {
    email.placeholder = originalPlaceholders.email;
    removeErrorClass(email);
    document.getElementById("error-email").textContent = "";
  });
}

if (textarea) {
  textarea.addEventListener("input", () => {
    textarea.placeholder = originalPlaceholders.textarea;
    removeErrorClass(textarea);
    document.getElementById("error-textarea").textContent = "";
  });
}

function validateForm() {
  clearErrors();

  let valid = true;
  const t = window.translations[window.currentLang];

  if (username.value.trim() === "") {
    username.placeholder = t["error.nameRequired"];
    username.classList.add("error-placeholder");
    document.getElementById("error-username").textContent = "";
    valid = false;
  }

  if (email.value.trim() === "") {
    email.placeholder = t["error.emailRequired"];
    email.classList.add("error-placeholder");
    document.getElementById("error-email").textContent = "";
    valid = false;
  } else if (!isValidEmail(email.value.trim())) {
    removeErrorClass(email);

    document.getElementById("error-email").textContent =
      t["error.emailInvalid"];
    valid = false;
  }

  if (textarea.value.trim() === "") {
    textarea.placeholder = t["error.messageRequired"];
    textarea.classList.add("error-placeholder");
    document.getElementById("error-textarea").textContent = "";
    valid = false;
  }

  if (!privacyAccepted) {
    document.getElementById("error-policy").textContent =
      t["error.policyRequired"];
    valid = false;
  }

  return valid;
}

// CheckBox Function
let privacyAccepted = false;

const checkbox = document.getElementById("checkbox");

if (checkbox) {
  checkbox.addEventListener("click", () => {
    privacyAccepted = !privacyAccepted;

    checkbox.src = privacyAccepted
      ? "assets/imgs/icons/checkbox-checked.svg"
      : "assets/imgs/icons/checkbox-unchecked.svg";

    document.getElementById("error-policy").textContent = "";
  });
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((e) => {
    e.textContent = "";
  });

  resetField("username", originalPlaceholders.username);
  resetField("email", originalPlaceholders.email);
  resetField("textarea", originalPlaceholders.textarea);
}

function isValidEmail(email) {
  const result =
    /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(
      email,
    );
  console.log(email, result);
  return result;
}

if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addMessage();
  });
}

function addMessage() {
  if (!validateForm()) {
    return;
  }
  console.log("form submitted!");
  // Hier kommt später meine tatsächlicher Submit-Code hin (z. B. fetch)

  showSuccesMessage();
  form.reset();

  console.log(form, "Formualr erfolgreich zurückgesetzt!");

  privacyAccepted = false;
  checkbox.src = "assets/imgs/icons/checkbox-unchecked.svg";
  clearErrors();
}

// ----------Message sent Overlay.

function showSuccesMessage() {
  showOverlay();
  setTimeout(hideOverlay, 1500);
}

function showOverlay() {
  document.getElementById("successOverlay").style.display = "flex";
}

function hideOverlay() {
  document.getElementById("successOverlay").style.display = "none";
}

// ----------------------Burger menu

const burger = document.querySelector(".burger");
const menu = document.querySelector(".header-content");

if (burger && menu) {
  function toggleMenu() {
    burger.classList.toggle("active");
    menu.classList.toggle("active");

    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
  }

  function closeMenu() {
    burger.classList.remove("active");
    menu.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
}

// scroll Animation
const hiddenElements = document.querySelectorAll(".hidden");

hiddenElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 10}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

hiddenElements.forEach((el) => observer.observe(el));

function revealVisibleHiddenElements() {
  const vw = window.innerWidth || document.documentElement.clientWidth;
  hiddenElements.forEach((el) => {
    if (el.classList.contains('show')) return;
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
    if (isVisible || vw <= 350) {
      el.classList.add('show');
      try { observer.unobserve(el); } catch (e) {}
    }
  });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  revealVisibleHiddenElements();
} else {
  window.addEventListener('DOMContentLoaded', revealVisibleHiddenElements);
}

function smoothScrollTo(target, duration = 1600) {
  const start = window.scrollY;

  const end = target.getBoundingClientRect().top + window.scrollY;

  const distance = end - start;

  let startTime = null;

  function animation(currentTime) {
    if (!startTime) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + distance * ease);
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const selector = link.getAttribute("href");

    const target = document.querySelector(selector);

    if (target) {
      smoothScrollTo(target, 1600);
    }
  });
});
