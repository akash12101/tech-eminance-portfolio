/**
 * =============================================================
 * TECH EMINANCE — CARD SLIDER (Swiper.js)
 * =============================================================
 * Progressively enhances any element with the `.slider-enable`
 * class into an auto-playing Swiper carousel with prev/next
 * arrows and pagination dots — used for the services,
 * "why choose us", testimonials, and blog card sections.
 *
 * How to opt a section in (no other markup changes needed):
 *   <div class="services__grid slider-enable" data-per-view="2">
 *     ...existing cards, unchanged...
 *   </div>
 *
 * `data-per-view` controls how many cards are visible at once on
 * desktop (1 on mobile, min(2, per-view) on tablet, automatically).
 *
 * Every existing card element (service-card, why-card,
 * testimonial-card, blog-card...) is moved as-is into a
 * `swiper-slide` — its own classes and content are never touched.
 *
 * Requires the Swiper.js CDN bundle to be loaded first (see the
 * <link>/<script> tags added in <head> / before this file).
 * If Swiper isn't available for any reason, the cards are left
 * exactly where they are (visible, just not carousel-ised) —
 * this never throws or blocks the rest of the page.
 * =============================================================
 */
(function () {
  'use strict';

  if (window.__cardSliderInitialized) return;
  window.__cardSliderInitialized = true;

  function init() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper.js did not load — card sections will render as static rows instead of sliders.');
      return;
    }
    document.querySelectorAll('.slider-enable').forEach(convertToSwiper);
  }

  function convertToSwiper(grid) {
    if (grid.dataset.sliderReady) return; // avoid double-conversion
    grid.dataset.sliderReady = 'true';

    var perView = parseInt(grid.getAttribute('data-per-view'), 10) || 3;
    var tabletPerView = Math.min(2, perView);

    // The section that had `reveal-up` on the grid still gets a
    // single, whole-block fade-in — it's just applied to the new
    // outer wrapper now instead of the (now removed) grid class.
    var hadRevealUp = grid.classList.contains('reveal-up');

    // --- Build the Swiper DOM structure -----------------------
    var root = document.createElement('div');
    root.className = 'tc-swiper' + (hadRevealUp ? ' reveal-up' : '');

    var swiperEl = document.createElement('div');
    swiperEl.className = 'swiper';

    var wrapper = document.createElement('div');
    wrapper.className = 'swiper-wrapper';

    // Move every existing card into its own swiper-slide, in order,
    // without altering the card element itself in any way.
    Array.prototype.forEach.call(Array.prototype.slice.call(grid.children), function (card) {
      card.classList.remove('reveal-up'); // avoid Swiper's looped clones getting stuck invisible
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.appendChild(card);
      wrapper.appendChild(slide);
    });

    swiperEl.appendChild(wrapper);

    var pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';
    swiperEl.appendChild(pagination);

    root.appendChild(swiperEl);

    var prevBtn = document.createElement('div');
    prevBtn.className = 'swiper-button-prev';
    prevBtn.setAttribute('role', 'button');
    prevBtn.setAttribute('aria-label', 'Previous slide');
    root.appendChild(prevBtn);

    var nextBtn = document.createElement('div');
    nextBtn.className = 'swiper-button-next';
    nextBtn.setAttribute('role', 'button');
    nextBtn.setAttribute('aria-label', 'Next slide');
    root.appendChild(nextBtn);

    grid.parentNode.replaceChild(root, grid);

    // --- Initialize Swiper --------------------------------------
    // eslint-disable-next-line no-new
    new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 700,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      pagination: {
        el: pagination,
        clickable: true,
      },
      breakpoints: {
        641: { slidesPerView: tabletPerView, spaceBetween: 20 },
        1024: { slidesPerView: perView, spaceBetween: 24 },
      },
    });
  }

  // Run immediately — deliberately NOT deferred to DOMContentLoaded.
  //
  // This script tag sits near the bottom of <body>, after every
  // section it targets, so those elements already exist in the
  // DOM the moment this line runs — there's nothing to wait for.
  //
  // It's important that this runs *before* js/animations.js (the
  // next script tag) sets up its scroll-fade-in IntersectionObserver.
  // That observer only scans the DOM once, synchronously, when its
  // own script tag runs. If slider.js were deferred to
  // DOMContentLoaded, it would build the new slider wrapper *after*
  // that scan already happened — the new wrapper would carry the
  // "reveal-up" fade-in class but nothing would ever be watching it,
  // leaving it stuck at opacity: 0 forever (which is exactly what
  // was happening — the whole slider silently invisible).
  init();
})();
