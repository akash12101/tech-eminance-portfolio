/**
 * =============================================================
 * Tech Eminence — PRELOADER CONTROLLER
 * =============================================================
 * Shows the full-screen loader (already in the HTML/CSS) until
 * the page has fully loaded, then fades it out smoothly.
 *
 * - Guarded against running twice (e.g. duplicate script tags).
 * - Enforces a small minimum display time so the loader doesn't
 *   flash instantly on fast connections — that reads as a bug,
 *   not as "smooth and premium".
 * - Locks page scroll while the loader is visible, then restores
 *   it, so there's no scroll jump behind the overlay.
 * =============================================================
 */
(function () {
  'use strict';

  if (window.__preloaderInitialized) return;
  window.__preloaderInitialized = true;

  var MIN_DISPLAY_MS = 450;
  var FADE_MS = 650;

  var preloader = document.getElementById('sitePreloader');
  if (!preloader) return;

  document.documentElement.classList.add('preload-lock');
  var startedAt = Date.now();

  function hidePreloader() {
    var elapsed = Date.now() - startedAt;
    var remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(function () {
      preloader.classList.add('is-hidden');
      document.documentElement.classList.remove('preload-lock');

      // Remove it from the DOM after the fade finishes so it can
      // never intercept clicks or be found by assistive tech.
      setTimeout(function () {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, FADE_MS);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    // Safety net: never let the loader block the site if the
    // 'load' event is unusually delayed by a slow third-party asset.
    setTimeout(hidePreloader, 4000);
  }
})();
