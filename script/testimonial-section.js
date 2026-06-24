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
     * Handles the click on the "next" button.
     * @param {Event} e - The click event.
     */
    function handleNextClick(e) {
        e.preventDefault();
        currentIndex++;
        if (currentIndex >= cards.length) currentIndex = 0;
        updateSlider();
    }

    /**
     * Handles the click on the "previous" button.
     * @param {Event} e - The click event.
     */
    function handlePrevClick(e) {
        e.preventDefault();
        currentIndex--;
        if (currentIndex < 0) currentIndex = cards.length - 1;
        updateSlider();
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
     * Binds all event listeners (click delegation on the container and window resize).
     */
    function bindEvents() {
        if (!testimonialContainer || resizeListenerAttached) return;
        testimonialContainer.addEventListener('click', function(e) {
            if (e.target.closest('.next')) handleNextClick(e);
            else if (e.target.closest('.prev')) handlePrevClick(e);
            else handleDotClick(e);
        });
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