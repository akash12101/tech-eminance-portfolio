/* =============================================================
   WHATSAPP CHAT WIDGET — vanilla JS, no dependencies.
   Self-contained IIFE so it can't leak globals or collide with
   the site's other scripts (navigation.js, animations.js, etc).
============================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. CONFIG — edit these two values for your business
  --------------------------------------------------------- */
  var CONFIG = {
    // Digits only, country code first, no + and no spaces.
    // Replace with the real WhatsApp number before going live.
    phone: '9301588580',
    message:
      'Hi Tech Eminance Team,\n\n' +
      "I'm interested in your services and would like to discuss my project.\n\n" +
      'Please get back to me.\n\n' +
      'Thanks!',
    // How long (ms) the bubble waits before auto-opening on a
    // visitor's very first visit.
    autoOpenDelay: 5000,
    // localStorage key used to remember a dismissed/opened bubble
    storageKey: 'te_whatsapp_widget_dismissed'
  };

  /* ---------------------------------------------------------
     2. Build the correct wa.me / web.whatsapp.com URL
  --------------------------------------------------------- */
  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  function buildWhatsAppUrl() {
    var encodedMessage = encodeURIComponent(CONFIG.message);
    return isMobileDevice()
      ? 'https://wa.me/' + CONFIG.phone + '?text=' + encodedMessage
      : 'https://web.whatsapp.com/send?phone=' + CONFIG.phone + '&text=' + encodedMessage;
  }

  function openWhatsApp() {
    var win = window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  }

  /* ---------------------------------------------------------
     3. Markup — injected once, on every page, no HTML edits
        needed beyond loading this script.
  --------------------------------------------------------- */
  function buildWidget() {
    var wrapper = document.createElement('div');
    wrapper.className = 'whatsapp-widget';
    wrapper.setAttribute('id', 'whatsappWidget');

    wrapper.innerHTML =
      '<div class="whatsapp-widget__bubble" id="waBubble" role="dialog" ' +
        'aria-label="Chat with Tech Eminence on WhatsApp" aria-hidden="true">' +
        '<button type="button" class="whatsapp-widget__bubble-close" id="waBubbleClose" ' +
          'aria-label="Close chat invitation">&times;</button>' +
        '<div class="whatsapp-widget__bubble-header">' +
          '<span class="whatsapp-widget__bubble-avatar" aria-hidden="true">' + waIconSvg() + '</span>' +
          '<p class="whatsapp-widget__bubble-title">Need help?</p>' +
        '</div>' +
        '<p class="whatsapp-widget__bubble-text">Chat with us on WhatsApp</p>' +
        '<p class="whatsapp-widget__bubble-meta">' +
          '<span class="whatsapp-widget__bubble-dot" aria-hidden="true"></span>' +
          'Typically replies within minutes.' +
        '</p>' +
      '</div>' +
      '<button type="button" class="whatsapp-widget__button" id="waButton" ' +
        'aria-label="Chat with Tech Eminence on WhatsApp">' +
        '<span class="whatsapp-widget__icon">' + waIconSvg() + '</span>' +
      '</button>';

    document.body.appendChild(wrapper);
    return wrapper;
  }

  // Official WhatsApp glyph as inline SVG (no icon font / library needed).
  function waIconSvg() {
    return (
      '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" focusable="false">' +
      '<path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.699 4.607 1.905 6.475L4 29l7.727-1.867A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3Zm0 21.75c-1.977 0-3.822-.55-5.397-1.503l-.387-.23-4.59 1.108 1.128-4.474-.253-.402A9.71 9.71 0 0 1 5.25 15c0-5.936 4.815-10.75 10.751-10.75S26.75 9.064 26.75 15 21.937 24.75 16.001 24.75Zm5.86-8.05c-.32-.16-1.897-.936-2.191-1.043-.294-.107-.508-.16-.722.16-.213.32-.828 1.043-1.016 1.257-.187.213-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.588-.951-.848-1.593-1.895-1.78-2.215-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.722-1.744-.99-2.388-.26-.626-.526-.54-.722-.55l-.615-.011c-.213 0-.56.08-.854.4-.294.32-1.121 1.096-1.121 2.673 0 1.577 1.148 3.1 1.308 3.313.16.213 2.259 3.448 5.474 4.836.765.33 1.362.527 1.828.674.768.245 1.467.21 2.02.128.617-.092 1.897-.776 2.164-1.525.267-.75.267-1.392.187-1.526-.08-.133-.293-.213-.613-.373Z"/>' +
      '</svg>'
    );
  }

  /* ---------------------------------------------------------
     4. Optional: keep clear of a cookie banner / other floating
        UI, if one exists on the page. Safe no-op if it doesn't.
  --------------------------------------------------------- */
  function avoidOverlap(wrapper) {
    var banner = document.querySelector(
      '.cookie-banner, .cookie-consent, #cookie-consent, [data-cookie-banner]'
    );
    if (!banner) return;

    function sync() {
      var rect = banner.getBoundingClientRect();
      var isVisible = rect.height > 0 && getComputedStyle(banner).display !== 'none';
      if (isVisible) {
        wrapper.style.setProperty('--wa-lift', rect.height + 12 + 'px');
        wrapper.classList.add('is-lifted');
      } else {
        wrapper.classList.remove('is-lifted');
      }
    }
    sync();
    window.addEventListener('resize', sync);
  }

  /* ---------------------------------------------------------
     5. Wire everything up
  --------------------------------------------------------- */
  function init() {
    var wrapper = buildWidget();
    var button = wrapper.querySelector('#waButton');
    var bubble = wrapper.querySelector('#waBubble');
    var closeBtn = wrapper.querySelector('#waBubbleClose');

    var alreadyDismissed = localStorage.getItem(CONFIG.storageKey) === '1';

    function openBubble() {
      bubble.classList.add('is-open');
      bubble.setAttribute('aria-hidden', 'false');
    }

    function closeBubble(remember) {
      bubble.classList.remove('is-open');
      bubble.setAttribute('aria-hidden', 'true');
      if (remember) {
        localStorage.setItem(CONFIG.storageKey, '1');
      }
    }

    // Main button: always opens WhatsApp directly.
    button.addEventListener('click', function () {
      openWhatsApp();
    });

    // Clicking anywhere on the bubble opens WhatsApp too.
    bubble.addEventListener('click', function () {
      openWhatsApp();
    });

    // The × only dismisses the bubble; it must not also fire the
    // bubble's own click-to-chat handler.
    closeBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      closeBubble(true);
    });

    // Keyboard support: Escape closes an open bubble.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && bubble.classList.contains('is-open')) {
        closeBubble(false);
      }
    });

    // Fade the whole widget in once it's in the DOM.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrapper.classList.add('is-visible');
      });
    });

    // Auto-open the bubble once, 5s after a visitor's first
    // arrival, unless they've already dismissed it before.
    if (!alreadyDismissed) {
      window.setTimeout(function () {
        openBubble();
      }, CONFIG.autoOpenDelay);
    }

    avoidOverlap(wrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
