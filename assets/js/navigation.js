/* =============================================================
   Tech Eminence — NAVIGATION.JS
   Sticky header, mobile menu, smooth scroll, scroll spy
============================================================= */

(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const allNavLinks = document.querySelectorAll('a[href^="#"]');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  function openMenu() {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  if (burger) burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  document.addEventListener('mousedown', (event) => {
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) return;
    const panel = mobileMenu.querySelector('.mobile-menu__panel');
    if (panel && !panel.contains(event.target) && !burger.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  allNavLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (href && href.length > 1 && document.querySelector(href)) {
        event.preventDefault();
        const target = document.querySelector(href);
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          closeMenu();
        }
      }
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();
