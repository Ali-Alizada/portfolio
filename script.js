

(function initCursorShadow() {
  const cursorShadow = document.querySelector('.cursor-shadow');
  if (!cursorShadow) return;
  document.addEventListener('mousemove', (e) => {
    cursorShadow.style.left = `${e.clientX}px`;
    cursorShadow.style.top = `${e.clientY}px`;
  });
})();

async function loadTestimonialHTML() {
  const container = document.getElementById('testimonial-container');
  if (!container) {
    console.warn('Kein Container #testimonial-container gefunden.');
    return;
  }

  try {
    const response = await fetch('html/testimonial-section.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;

    if (typeof window.initTestimonialSlider === 'function') {
      await window.initTestimonialSlider();
    } else {
      console.warn('initTestimonialSlider nicht gefunden – testimonial.js geladen?');
    }

    if (window.__scrollRestorePending) {
      hiddenElementsDeferred = true;
    } else {
      if (document.activeElement && document.activeElement !== document.body) {
        try { document.activeElement.blur(); } catch (e) { }
      }
      observeHiddenElements();
    }

  } catch (err) {
    console.error('Fehler beim Laden des Testimonial‑HTML:', err);
  }
}

async function loadAboutmeHTML() {
  const container = document.getElementById('aboutme-container');
  if (!container) {
    console.warn('Kein Container #aboutme-container gefunden.');
    return;
  }

  try {
    const response = await fetch('html/aboutme-section.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;

    if (typeof window.applyLanguage === 'function' && window.currentLang) {
      window.applyLanguage(window.currentLang);
    }

    if (window.__scrollRestorePending) {
      hiddenElementsDeferred = true;
    } else {
      if (document.activeElement && document.activeElement !== document.body) {
        try { document.activeElement.blur(); } catch (e) { }
      }
      observeHiddenElements();
    }

  } catch (err) {
    console.error('Fehler beim Laden der Aboutme‑Section:', err);
  }
}

async function loadTechnologiesHTML() {
  const container = document.getElementById('technologies-container');
  if (!container) {
    console.warn('Kein Container #technologies-container gefunden.');
    return;
  }

  try {
    const response = await fetch('html/technologies-section.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;

    if (typeof window.applyLanguage === 'function' && window.currentLang) {
      window.applyLanguage(window.currentLang);
    }

    if (window.__scrollRestorePending) {
      hiddenElementsDeferred = true;
    } else {
      if (document.activeElement && document.activeElement !== document.body) {
        try { document.activeElement.blur(); } catch (e) { }
      }
      observeHiddenElements();
    }

  } catch (err) {
    console.error('Fehler beim Laden der Technologies‑Section:', err);
  }
}

(function initContactForm() {
  const email = document.getElementById('useremail');
  const username = document.getElementById('username');
  const textarea = document.getElementById('usertextarea');
  const submitBtn = document.querySelector('.button button');
  const form = document.getElementById('contactForm');
  const checkbox = document.getElementById('checkbox');

  if (!form) return;

  const originalPlaceholders = {
    username: username ? username.placeholder : '',
    email: email ? email.placeholder : '',
    textarea: textarea ? textarea.placeholder : '',
  };

  let privacyAccepted = false;

  function removeErrorClass(el) {
    el.classList.remove('error-placeholder');
  }

  function resetField(fieldId, originalText) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.placeholder = originalText;
      removeErrorClass(field);
    }
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach((e) => {
      e.textContent = '';
    });
    resetField('username', originalPlaceholders.username);
    resetField('email', originalPlaceholders.email);
    resetField('textarea', originalPlaceholders.textarea);
    document.getElementById('error-policy').textContent = '';
  }

  function isValidEmail(value) {
    return /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(value);
  }

  function validateForm() {
    clearErrors();
    let valid = true;
    const t = window.translations?.[window.currentLang] || {};

    if (username.value.trim() === '') {
      username.placeholder = t['error.nameRequired'] || 'Name erforderlich';
      username.classList.add('error-placeholder');
      valid = false;
    }

    if (email.value.trim() === '') {
      email.placeholder = t['error.emailRequired'] || 'E‑Mail erforderlich';
      email.classList.add('error-placeholder');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      document.getElementById('error-email').textContent =
        t['error.emailInvalid'] || 'Ungültige E‑Mail';
      valid = false;
    }

    if (textarea.value.trim() === '') {
      textarea.placeholder = t['error.messageRequired'] || 'Nachricht erforderlich';
      textarea.classList.add('error-placeholder');
      valid = false;
    }

    if (!privacyAccepted) {
      document.getElementById('error-policy').textContent =
        t['error.policyRequired'] || 'Bitte akzeptieren Sie die Datenschutzbestimmungen.';
      valid = false;
    }

    return valid;
  }

  if (username) {
    username.addEventListener('input', () => {
      username.placeholder = originalPlaceholders.username;
      removeErrorClass(username);
      document.getElementById('error-username').textContent = '';
    });
  }
  if (email) {
    email.addEventListener('input', () => {
      email.placeholder = originalPlaceholders.email;
      removeErrorClass(email);
      document.getElementById('error-email').textContent = '';
    });
  }
  if (textarea) {
    textarea.addEventListener('input', () => {
      textarea.placeholder = originalPlaceholders.textarea;
      removeErrorClass(textarea);
      document.getElementById('error-textarea').textContent = '';
    });
  }

  if (checkbox) {
    checkbox.addEventListener('click', () => {
      privacyAccepted = !privacyAccepted;
      checkbox.src = privacyAccepted
        ? 'assets/imgs/icons/checkbox-checked.svg'
        : 'assets/imgs/icons/checkbox-unchecked.svg';
      document.getElementById('error-policy').textContent = '';
    });
  }

  function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => { overlay.style.display = 'none'; }, 1500);
    }
  }

      async function addMessage() {

        if (!validateForm()) return;

        const data = {
        name: username.value,
        email: email.value,
        message: textarea.value
        };

        try {
        const response = await fetch("send.php", {
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },

        body: JSON.stringify(data)

        });

        const result = await response.json();

        if(result.success){
        showSuccessOverlay();
        form.reset();
        privacyAccepted=false;


        checkbox.src =
        "assets/imgs/icons/checkbox-unchecked.svg";
        }else{
        alert("Sending failed");

        }

        }
        catch(error){
        console.error(error);
        alert("Server error");
        }

  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addMessage();
  });


  function updateMarqueeLabels() {
    document.querySelectorAll('.marquee-btn, .marquee-contact, .marquee-talk, .marquee-submit')
      .forEach((btn) => {
        const span = btn.querySelector('.marquee-track span');
        if (span) btn.dataset.label = span.textContent.trim();
      });
  }

  if (typeof window.applyLanguage === 'function') {
    const orig = window.applyLanguage;
    window.applyLanguage = function (lang) {
      orig(lang);
      updateMarqueeLabels();
    };
    window.applyLanguage(window.currentLang);
  }

})();

(function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.header-content');
  if (!burger || !menu) return;

  function toggleMenu() {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
  }

  function closeMenu() {
    burger.classList.remove('active');
    menu.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
})();

let hiddenObserver = null;
const hiddenObservedSet = new WeakSet();
let hiddenElementsDeferred = false;
let sectionLoadingStarted = false;

function observeHiddenElements() {
  const hiddenEls = document.querySelectorAll('.hidden:not(.show)');
  if (!hiddenEls.length) return;

  if (!hiddenObserver) {
    hiddenObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('show');
          });
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

if (!window.__scrollRestorePending) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observeHiddenElements();
  } else {
    window.addEventListener('DOMContentLoaded', observeHiddenElements);
  }
} else {
  hiddenElementsDeferred = true;
}

function revealOnTinyScreens() {
  if (window.innerWidth > 350) return;
  document.querySelectorAll('.hidden:not(.show)').forEach((el) => {
    el.classList.add('show');
  });
}
window.addEventListener('resize', revealOnTinyScreens);
revealOnTinyScreens();

function smoothScrollTo(target, duration = 1600) {
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + distance * ease);
    if (progress < 1) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}

document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) smoothScrollTo(target, 1600);
});

const SCROLL_STORAGE_KEY = 'portfolio-scroll-pos';

function saveCurrentScrollPosition() {
  try {
    const pos = { x: window.scrollX || 0, y: window.scrollY || 0, ts: Date.now() };
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(pos));
  } catch (err) {
  }
}

function readSavedScrollPosition() {
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return null;
    const pos = JSON.parse(raw);
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      return { x: pos.x, y: pos.y };
    }
  } catch (err) {

  }
  return null;
}

function clearSavedScrollPosition() {
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch (err) {

  }
}

function restoreScrollPosition(savedPos) {
  if (!savedPos) return;
  const restore = () => {
    window.scrollTo(savedPos.x, savedPos.y);
  };
  requestAnimationFrame(restore);
  setTimeout(restore, 25);
  setTimeout(restore, 100);
  setTimeout(restore, 250);
}

async function loadAllSections() {
  const savedPos = readSavedScrollPosition() || { x: window.scrollX || 0, y: window.scrollY || 0 };
  const supportsScrollRest = 'scrollRestoration' in history;
  const prevScrollRest = supportsScrollRest ? history.scrollRestoration : null;
  try {
    if (supportsScrollRest) history.scrollRestoration = 'manual';

    await loadAboutmeHTML();
    await loadTechnologiesHTML();
    await loadTestimonialHTML();

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
  } finally {
    if (supportsScrollRest) {
      setTimeout(() => { history.scrollRestoration = prevScrollRest; }, 300);
    }
  }
}

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
