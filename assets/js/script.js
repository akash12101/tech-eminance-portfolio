/* =============================================================
   Tech Eminence — SCRIPT.JS
   FAQ accordion, process tabs, newsletter form handling
============================================================= */

(function () {
  'use strict';

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others (accordion behavior within same list)
      const parentList = item.closest('.faq__list');
      if (parentList) {
        parentList.querySelectorAll('.faq__item').forEach((other) => {
          if (other !== item) {
            const otherQ = other.querySelector('.faq__question');
            const otherA = other.querySelector('.faq__answer');
            if (otherQ && otherA) {
              otherQ.setAttribute('aria-expanded', 'false');
              otherA.style.maxHeight = null;
            }
          }
        });
      }

      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Process tabs (visual toggle only) ---------- */
  const processTabs = document.querySelectorAll('.process__tab');
  processTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      processTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.querySelector('.footer__newsletter');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      const button = this.querySelector('button');
      if (!input || !input.value) return;

      const originalText = button.textContent;
      button.innerHTML = '<span class="spinner"></span>';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = 'Subscribed ✓';
        input.value = '';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }, 900);
    });
  }

  /* ---------- Lazy-load images (if any use data-src) ---------- */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && lazyImages.length) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => imgObserver.observe(img));
  }

  /* ---------- External links open in new tab ---------- */
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

})();
