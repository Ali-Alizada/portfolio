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
        if (isFirstLayout) slider.style.transition = 'none';

        slider.style.transform = `translateX(-${targetX}px)`;
        slider.getBoundingClientRect();

        if (isFirstLayout) {
            requestAnimationFrame(() => {
                slider.style.transition = '';
                slider.dataset.inited = 'true';
            });
        }

        dots.forEach((dot) => dot.classList.remove('active'));
        cards.forEach((card) => card.classList.remove('active'));

        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        if (cards[currentIndex]) cards[currentIndex].classList.add('active');
    }

    function bindEvents() {
        if (!testimonialContainer || resizeListenerAttached) return;

        testimonialContainer.addEventListener('click', (event) => {
            const dot = event.target.closest('.dot');
            const next = event.target.closest('.next');
            const prev = event.target.closest('.prev');

            if (next) {
                event.preventDefault();
                currentIndex++;
                if (currentIndex >= cards.length) currentIndex = 0;
                updateSlider();
                return;
            }

            if (prev) {
                event.preventDefault();
                currentIndex--;
                if (currentIndex < 0) currentIndex = cards.length - 1;
                updateSlider();
                return;
            }

            if (dot) {
                const index = Array.from(dots).indexOf(dot);
                if (index >= 0) {
                    currentIndex = index;
                    updateSlider();
                }
            }
        });

        window.addEventListener('resize', () => {
            if (isInitialized) updateSlider();
        });
        resizeListenerAttached = true;
    }

    async function init() {
        const prevSlider = slider;
        slider = document.querySelector('.testimonial-slider');
        cards = document.querySelectorAll('.testimonial-card');
        nextBtn = document.querySelector('.next');
        prevBtn = document.querySelector('.prev');
        dots = document.querySelectorAll('.dot');
        viewport = document.querySelector('.testimonial-viewport');
        testimonialContainer = document.getElementById('testimonial-container') || document.querySelector('.comments') || slider;

        if (!slider || !cards.length || !dots.length || !testimonialContainer) {
            console.warn('Testimonial: nicht alle Elemente gefunden.');
            return;
        }

        if (prevSlider && prevSlider !== slider) {
            isInitialized = false;
        }
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