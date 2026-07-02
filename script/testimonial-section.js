(function () {
    'use strict';

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
     * Waits for all images inside the viewport to finish loading.
     * @returns {Promise<void>} A promise that resolves when all images are loaded or fail.
     */
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

    /**
     * Calculates the slide distance based on the viewport width and a fixed gap.
     */
    function updateSlideDistance() {
        if (!viewport) return;
        const viewportWidth = viewport.getBoundingClientRect().width;
        const gap = 22;
        slideDistance = viewportWidth + gap;
    }

    /**
     * Computes the target X translation offset for a given card index.
     * @param {number} index - The index of the target card.
     * @returns {number} The translateX value in pixels.
     */
    function computeTargetX(index) {
        const card = cards[index];
        return card ? card.offsetLeft : index * slideDistance;
    }

    /**
     * Applies the CSS transform to the slider, optionally disabling the transition.
     * @param {number} x - The translateX value.
     * @param {boolean} noTransition - Whether to remove the CSS transition temporarily.
     */
    function applySliderTransform(x, noTransition) {
        if (noTransition) slider.style.transition = 'none';
        slider.style.transform = `translateX(-${x}px)`;
        slider.getBoundingClientRect();
        if (noTransition) {
            requestAnimationFrame(() => {
                slider.style.transition = '';
                slider.dataset.inited = 'true';
            });
        }
    }

    /**
     * Updates the active classes on dots and cards based on the current index.
     * @param {number} index - The index to set as active.
     */
    function updateActiveStates(index) {
        dots.forEach(d => d.classList.remove('active'));
        cards.forEach(c => c.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        if (cards[index]) cards[index].classList.add('active');
    }

    /**
     * Orchestrates the full slider update: recalculates distance, applies transform,
     * and updates active states.
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
     * Moves the slider to the next or previous card.
     * @param {number} direction - The direction to move: 1 for next, -1 for previous.
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
     * Handles the click on a dot indicator.
     * @param {Event} e - The click event.
     */
    function handleDotClick(e) {
        const dot = e.target.closest('.dot');
        if (!dot) return;
        const index = Array.from(dots).indexOf(dot);
        if (index < 0) return;
        currentIndex = index;
        updateSlider();
    }

    /**
     * Applies the current drag offset while the user is swiping.
     * @param {number} deltaX - The horizontal drag distance.
     */
    function applySwipeOffset(deltaX) {
        if (!slider) return;
        slider.style.transition = 'none';
        const baseX = computeTargetX(currentIndex);
        slider.style.transform = `translateX(-${baseX + deltaX}px)`;
    }

    /**
     * Starts a touch swipe interaction.
     * @param {TouchEvent} e - The touch start event.
     */
    function handleTouchStart(e) {
        if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches && !('ontouchstart' in window)) return;
        if (!slider || e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        touchActive = true;
    }

    /**
     * Tracks the current horizontal distance while swiping.
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
     * Completes the swipe and navigates to the next or previous card when the threshold is reached.
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
     * Binds all event listeners (click delegation on the container, swipe gestures, and window resize).
     */
    function bindEvents() {
        if (!testimonialContainer || resizeListenerAttached) return;
        testimonialContainer.addEventListener('click', function(e) {
            if (e.target.closest('.next')) handleNextClick(e);
            else if (e.target.closest('.prev')) handlePrevClick(e);
            else handleDotClick(e);
        });
        if (viewport && (window.matchMedia('(hover: none) and (pointer: coarse)').matches || 'ontouchstart' in window)) {
            viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
            viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
            viewport.addEventListener('touchend', handleTouchEnd);
            viewport.addEventListener('touchcancel', handleTouchEnd);
        }
        window.addEventListener('resize', () => {
            if (isInitialized) updateSlider();
        });
        resizeListenerAttached = true;
    }

    /**
     * Queries and caches all required DOM elements.
     * @returns {boolean} True if all essential elements were found, otherwise false.
     */
    function getElements() {
        slider = document.querySelector('.testimonial-slider');
        cards = document.querySelectorAll('.testimonial-card');
        nextBtn = document.querySelector('.next');
        prevBtn = document.querySelector('.prev');
        dots = document.querySelectorAll('.dot');
        viewport = document.querySelector('.testimonial-viewport');
        testimonialContainer = document.getElementById('testimonial-container') || document.querySelector('.comments') || slider;
        return slider && cards.length && dots.length && testimonialContainer;
    }

    /**
     * Initializes the testimonial slider. Waits for images, sets the initial slide,
     * binds events, and triggers the first repositioning.
     * @returns {Promise<void>} A promise that resolves after initialization.
     */
    async function init() {
        const prevSlider = slider;
        if (!getElements()) {
            console.warn('Testimonial: nicht alle Elemente gefunden.');
            return;
        }
        if (prevSlider && prevSlider !== slider) isInitialized = false;
        await waitForViewportImages();
        if (currentIndex >= cards.length) currentIndex = cards.length - 1;
        if (currentIndex < 0) currentIndex = 0;
        updateSlider();
        if (!isInitialized) {
            bindEvents();
            isInitialized = true;
        }
        setTimeout(updateSlider, 300);
    }

    window.initTestimonialSlider = init;
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (document.querySelector('.testimonial-slider')) {
            if (!isInitialized) {
                init();
            }
        }
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            if (document.querySelector('.testimonial-slider') && !isInitialized) {
                init();
            }
        });
    }

})();