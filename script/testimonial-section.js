"use strict";

let slider = null;
let cards = [];
let nextBtn = null;
let prevBtn = null;
let dots = [];
let viewport = null;

let currentIndex = 1;
let slideDistance = 0;
let isInitialized = false;
let resizeListenerAttached = false;
let testimonialContainer = null;
let touchStartX = 0;
let touchDeltaX = 0;
let touchActive = false;
const touchThreshold = 70;

/**
 * Auto-initializes the testimonial slider once the DOM is ready.
 */
function initializeSlider() {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    if (document.querySelector(".testimonial-slider") && !isInitialized) {
      init();
    }
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      if (document.querySelector(".testimonial-slider") && !isInitialized) {
        init();
      }
    });
  }
}

/**
 * Waits for all images inside the viewport to finish loading.
 * @returns {Promise<void>} Resolves when all images are either loaded or failed.
 */
function waitForViewportImages() {
    if (!viewport) return Promise.resolve();
    const imgs = Array.from(viewport.querySelectorAll("img"));
    if (!imgs.length) return Promise.resolve();
    const decodes = imgs.map((img) => {
      if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
      return new Promise((res) => {
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", res, { once: true });
      });
    });
    return Promise.all(decodes);
  }

  /**
   * Recalculates the slide distance based on the viewport width and a fixed gap.
   */
  function updateSlideDistance() {
    if (!viewport) return;
    const viewportWidth = viewport.getBoundingClientRect().width;
    slideDistance = viewportWidth + 22;
  }

  /**
   * Computes the absolute translateX offset for a given card index.
   * @param {number} index - The index of the target card.
   * @returns {number} The translateX value in pixels.
   */
  function computeTargetX(index) {
    return cards[index] ? cards[index].offsetLeft : index * slideDistance;
  }

  /**
   * Applies the transform to the slider, optionally disabling the CSS transition.
   * @param {number} x - The translateX value.
   * @param {boolean} noTransition - If true, removes the transition temporarily.
   */
  function applySliderTransform(x, noTransition) {
    if (noTransition) slider.style.transition = "none";
    slider.style.transform = `translateX(-${x}px)`;
    slider.getBoundingClientRect();
    if (noTransition) {
      requestAnimationFrame(() => {
        slider.style.transition = "";
        slider.dataset.inited = "true";
      });
    }
  }

  /**
   * Updates the active CSS classes on dots and cards to reflect the current index.
   * @param {number} index - The index to set as active.
   */
  function updateActiveStates(index) {
    dots.forEach((d) => d.classList.remove("active"));
    cards.forEach((c) => c.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
    if (cards[index]) cards[index].classList.add("active");
  }

  /**
   * Orchestrates a full slider update: recalculates distance, applies the transform,
   * and updates the active states.
   */
  function updateSlider() {
    if (!slider || !cards.length || !dots.length) return;
    updateSlideDistance();
    const targetX = computeTargetX(currentIndex);
    const isFirstLayout = !slider.dataset.inited;
    applySliderTransform(targetX, isFirstLayout);
    updateActiveStates(currentIndex);
  }

  /**
   * Moves the slider to the next or previous card (with loop).
   * @param {number} direction - 1 for next, -1 for previous.
   */
  function navigateSlider(direction) {
    currentIndex += direction;
    if (currentIndex >= cards.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = cards.length - 1;
    updateSlider();
  }

  /**
   * Handles the click on the "next" button.
   * @param {Event} e - The click event.
   */
  function handleNextClick(e) {
    e.preventDefault();
    navigateSlider(1);
  }

  /**
   * Handles the click on the "previous" button.
   * @param {Event} e - The click event.
   */
  function handlePrevClick(e) {
    e.preventDefault();
    navigateSlider(-1);
  }

  /**
   * Handles the click on a dot indicator, jumping to the corresponding slide.
   * @param {Event} e - The click event.
   */
  function handleDotClick(e) {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    const index = Array.from(dots).indexOf(dot);
    if (index < 0) return;
    currentIndex = index;
    updateSlider();
  }

  /**
   * Applies the current drag offset while the user is swiping, disabling the transition.
   * @param {number} deltaX - The horizontal drag distance.
   */
  function applySwipeOffset(deltaX) {
    if (!slider) return;
    slider.style.transition = "none";
    const baseX = computeTargetX(currentIndex);
    slider.style.transform = `translateX(-${baseX + deltaX}px)`;
  }

  /**
   * Starts a touch swipe interaction by storing the initial touch position.
   * @param {TouchEvent} e - The touch start event.
   */
  function handleTouchStart(e) {
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches && !("ontouchstart" in window)) return;
    if (!slider || e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    touchActive = true;
  }

  /**
   * Tracks the horizontal movement during a swipe and updates the slider offset.
   * @param {TouchEvent} e - The touch move event.
   */
  function handleTouchMove(e) {
    if (!touchActive || !slider || e.touches.length !== 1) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
    if (Math.abs(touchDeltaX) > 8) {
      e.preventDefault();
      applySwipeOffset(touchDeltaX);
    }
  }

  /**
   * Completes the swipe and navigates to the next/previous slide if the threshold is exceeded.
   * @param {TouchEvent} e - The touch end event.
   */
  function handleTouchEnd(e) {
    if (!touchActive) return;
    if (Math.abs(touchDeltaX) > touchThreshold) {
      if (touchDeltaX < 0) navigateSlider(1);
      else navigateSlider(-1);
    } else {
      updateSlider();
    }
    touchActive = false;
    touchDeltaX = 0;
  }

  /**
   * Checks whether the device supports touch events.
   * @returns {boolean} True if touch is supported.
   */
  function isTouchSupported() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window;
  }

  /**
   * Centralised click handler for the testimonial container (delegation).
   * Handles clicks on .next, .prev and .dot elements.
   * @param {Event} e - The click event.
   */
  function handleContainerClick(e) {
    const btn = e.target.closest(".next, .prev, .dot");
    if (!btn) return;
    e.preventDefault();
    if (btn.matches(".next")) navigateSlider(1);
    else if (btn.matches(".prev")) navigateSlider(-1);
    else {
      const idx = Array.from(dots).indexOf(btn);
      if (idx >= 0) { currentIndex = idx; updateSlider(); }
    }
  }

  /**
   * Adds touch event listeners to the viewport if touch is supported.
   */
  function setupTouchEvents() {
    if (!viewport) return;
    viewport.addEventListener("touchstart", handleTouchStart, { passive: false });
    viewport.addEventListener("touchmove", handleTouchMove, { passive: false });
    viewport.addEventListener("touchend", handleTouchEnd);
    viewport.addEventListener("touchcancel", handleTouchEnd);
  }

  /**
   * Handles window resize events by updating the slider if it is initialized.
   */
  function handleResize() {
    if (isInitialized) updateSlider();
  }

  /**
   * Binds all event listeners (click delegation, touch events, and window resize).
   */
  function bindEvents() {
    if (!testimonialContainer || resizeListenerAttached) return;
    testimonialContainer.addEventListener("click", handleContainerClick);
    if (viewport && isTouchSupported()) setupTouchEvents();
    window.addEventListener("resize", handleResize);
    resizeListenerAttached = true;
  }

  /**
   * Queries and caches all required DOM elements.
   * @returns {boolean} True if all essential elements are found, otherwise false.
   */
  function getElements() {
    slider = document.querySelector(".testimonial-slider");
    cards = document.querySelectorAll(".testimonial-card");
    nextBtn = document.querySelector(".next");
    prevBtn = document.querySelector(".prev");
    dots = document.querySelectorAll(".dot");
    viewport = document.querySelector(".testimonial-viewport");
    testimonialContainer = document.getElementById("testimonial-container") || document.querySelector(".comments") || slider;
    return slider && cards.length && dots.length && testimonialContainer;
  }

  /**
   * Bounds check and set the initial slider index.
   */
  function setInitialIndex() {
    if (currentIndex >= cards.length) currentIndex = cards.length - 1;
    if (currentIndex < 0) currentIndex = 0;
  }

  /**
   * Finalizes the slider setup, positions it, and attaches event listeners.
   */
  function finalizeInitialization() {
    updateSlider();
    if (!isInitialized) {
      bindEvents();
      isInitialized = true;
    }
    setTimeout(updateSlider, 300);
  }

  /**
   * Initialises the testimonial slider: waits for images, sets initial slide,
   * binds events and triggers the first positioning.
   * @returns {Promise<void>} Resolves when initialisation is complete.
   */
  async function init() {
    const prevSlider = slider;
    if (!getElements()) {
      console.warn("Testimonial: nicht alle Elemente gefunden.");
      return;
    }
    if (prevSlider && prevSlider !== slider) isInitialized = false;
    await waitForViewportImages();
    setInitialIndex();
    finalizeInitialization();
  }

// Expose the init function globally.
window.initTestimonialSlider = init;

// Auto‑initialise if the DOM is already ready.
initializeSlider();