/**
 * =============================================================
 * Tech Eminence — CONTACT FORM (EmailJS integration)
 * =============================================================
 * Handles the existing `.contact-form` on contact.html:
 *  - client-side validation with inline error messages
 *  - sending the form via EmailJS (no page reload)
 *  - button loading state + duplicate-submission guard
 *  - success / error toast, announced to screen readers
 *
 * Nothing in this file touches layout, spacing, or styling
 * beyond toggling a handful of class names that are defined in
 * css/contact-form.css.
 * =============================================================
 */
(function () {
  'use strict';

  const FORM_SELECTOR = '.contact-form';
  const WEBSITE_NAME = 'Tech Eminence';

  // Guard against this script accidentally running twice
  // (e.g. if the page includes it more than once).
  if (window.__contactFormInitialized) return;
  window.__contactFormInitialized = true;

  document.addEventListener('DOMContentLoaded', setup);

  function setup() {
    const form = document.querySelector(FORM_SELECTOR);
    if (!form) return; // Contact form isn't on this page — nothing to do.

    const submitBtn = form.querySelector('button[type="submit"]');
    const fields = getFields(form);

    // Track in-flight submission to prevent double sends
    // (double click, double Enter, slow network + impatient user).
    let isSubmitting = false;

    // Build the inline-error <small> elements once, right after
    // each field, without altering any existing markup/classes.
    Object.values(fields).forEach((field) => {
      if (field && field.element) ensureErrorElement(field.element);
    });

    // Validate a field as the user leaves it, so errors don't only
    // appear on submit.
    Object.values(fields).forEach((field) => {
      if (!field || !field.element) return;
      field.element.addEventListener('blur', () => validateField(field));
      field.element.addEventListener('input', () => {
        // Clear the error as soon as the field becomes valid again.
        if (getFieldWrapper(field.element).classList.contains('form-field--error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSubmitting) return; // Ignore extra clicks while sending.

      const isValid = validateAll(fields);
      if (!isValid) {
        // Move focus to the first invalid field for keyboard/screen-reader users.
        const firstInvalid = form.querySelector('.form-field--error input, .form-field--error textarea, .form-field--error select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      setButtonLoading(submitBtn, true);

      try {
        const templateParams = buildTemplateParams(fields);
        await sendEmail(templateParams);

        announce('Thank you! Your message has been sent successfully.');
        showToast('success', 'Thank you! Your message has been sent successfully.');
        form.reset();
        // Reset also clears the visual "filled" state of any custom-styled
        // selects, and removes any leftover error states.
        Object.values(fields).forEach((field) => field && field.element && clearFieldError(field.element));
      } catch (error) {
        console.error('EmailJS send failed:', error);
        announce('Something went wrong. Please try again.');
        showToast('error', 'Something went wrong. Please try again.');
      } finally {
        isSubmitting = false;
        setButtonLoading(submitBtn, false);
      }
    });
  }

  /* ---------------------------------------------------------
     FIELD LOOKUP
     Uses `name` attributes already present on the form, so no
     HTML changes are required. Optional fields simply resolve
     to `null` and are skipped everywhere else in this file.
  --------------------------------------------------------- */
  function getFields(form) {
    return {
      name: describe(form, 'name', { required: true, minLength: 2, pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, patternMessage: 'Please use letters only.' }),
      email: describe(form, 'email', { required: true, email: true }),
      phone: describe(form, 'phone', { required: false, phone: true }), // only validated if the field exists
      company: describe(form, 'company', { required: false }),
      country: describe(form, 'country', { required: false }),
      subject: describe(form, 'subject', { required: false }),
      services: describe(form, 'services', { required: false }),
      message: describe(form, 'message', { required: true, minLength: 10 }),
    };
  }

  function describe(form, name, rules) {
    const element = form.querySelector(`[name="${name}"]`);
    if (!element) return null;
    return { element, name, rules };
  }

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */
  function validateAll(fields) {
    let allValid = true;
    Object.values(fields).forEach((field) => {
      if (!field) return;
      const valid = validateField(field);
      if (!valid) allValid = false;
    });
    return allValid;
  }

  function validateField(field) {
    const { element, rules } = field;
    const value = element.value.trim();
    let error = '';

    if (rules.required && value.length === 0) {
      error = 'This field is required.';
    } else if (value.length > 0 && rules.minLength && value.length < rules.minLength) {
      error = `Please enter at least ${rules.minLength} characters.`;
    } else if (value.length > 0 && rules.pattern && !rules.pattern.test(value)) {
      error = rules.patternMessage || 'This field contains invalid characters.';
    } else if (value.length > 0 && rules.email && !isValidEmail(value)) {
      error = 'Please enter a valid email address.';
    } else if (value.length > 0 && rules.phone && !isValidPhone(value)) {
      error = 'Please enter a valid phone number.';
    }

    if (error) {
      setFieldError(element, error);
      return false;
    }
    clearFieldError(element);
    return true;
  }

  function isValidEmail(value) {
    // Standard, widely-used pragmatic email regex (RFC 5322-lite).
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    // Accepts digits, spaces, dashes, parentheses and an optional
    // leading +, with 7–15 digits overall (E.164-friendly).
    const digitsOnly = value.replace(/\D/g, '');
    return /^[+]?[\d\s\-()]{7,20}$/.test(value) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  /* ---------------------------------------------------------
     INLINE ERROR UI
  --------------------------------------------------------- */
  function getFieldWrapper(element) {
    return element.closest('.form-field') || element.parentElement;
  }

  function ensureErrorElement(element) {
    const wrapper = getFieldWrapper(element);
    if (!wrapper) return;
    if (wrapper.querySelector('.form-field__error-msg')) return;

    const msg = document.createElement('small');
    msg.className = 'form-field__error-msg';
    msg.setAttribute('role', 'alert');
    wrapper.appendChild(msg);

    // Link the error message to the field for screen readers.
    const id = element.id || `field-${element.name}-error`;
    msg.id = `${id}-error`;
    element.setAttribute('aria-describedby', msg.id);
  }

  function setFieldError(element, message) {
    const wrapper = getFieldWrapper(element);
    if (!wrapper) return;
    wrapper.classList.add('form-field--error');
    element.setAttribute('aria-invalid', 'true');
    const msg = wrapper.querySelector('.form-field__error-msg');
    if (msg) msg.textContent = message;
  }

  function clearFieldError(element) {
    const wrapper = getFieldWrapper(element);
    if (!wrapper) return;
    wrapper.classList.remove('form-field--error');
    element.removeAttribute('aria-invalid');
    const msg = wrapper.querySelector('.form-field__error-msg');
    if (msg) msg.textContent = '';
  }

  /* ---------------------------------------------------------
     EMAIL SENDING
  --------------------------------------------------------- */
  function buildTemplateParams(fields) {
    const val = (field) => (field && field.element ? field.element.value.trim() : '');

    return {
      from_name: val(fields.name),
      from_email: val(fields.email),
      phone: val(fields.phone) || 'Not provided',
      subject: val(fields.subject) || val(fields.company) || 'New website inquiry',
      message: val(fields.message),
      company: val(fields.company) || 'Not provided',
      country: val(fields.country) || 'Not provided',
      services: val(fields.services) || 'Not provided',
      sent_date: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      website_name: WEBSITE_NAME,
      reply_to: val(fields.email),
    };
  }

  async function sendEmail(templateParams) {
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS SDK is not loaded.');
    }
    const { SERVICE_ID, TEMPLATE_ID } = window.EMAILJS_CONFIG || {};
    if (!SERVICE_ID || !TEMPLATE_ID || SERVICE_ID.startsWith('YOUR_') || TEMPLATE_ID.startsWith('YOUR_')) {
      throw new Error('EmailJS is not configured yet. Update js/emailjs-config.js with your credentials.');
    }

    // emailjs.send() returns a Promise, so this integrates cleanly with async/await.
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  }

  /* ---------------------------------------------------------
     BUTTON LOADING STATE
  --------------------------------------------------------- */
  function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      // Remember the original label so it can be restored exactly.
      if (!button.dataset.defaultLabel) {
        button.dataset.defaultLabel = button.textContent.trim();
      }
      button.disabled = true;
      button.classList.add('is-loading');
      button.setAttribute('aria-busy', 'true');
      button.innerHTML = '';
      const spinner = document.createElement('span');
      spinner.className = 'btn__spinner';
      spinner.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = 'Sending...';
      button.appendChild(spinner);
      button.appendChild(label);
    } else {
      button.disabled = false;
      button.classList.remove('is-loading');
      button.removeAttribute('aria-busy');
      button.textContent = button.dataset.defaultLabel || 'Send Inquiry';
    }
  }

  /* ---------------------------------------------------------
     NOTIFICATIONS (toast + screen-reader live region)
  --------------------------------------------------------- */
  let liveRegion = null;

  function announce(message) {
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clipPath = 'inset(50%)';
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  }

  let toastTimeout = null;

  function showToast(type, message) {
    let toast = document.querySelector('.form-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'form-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'assertive');
      document.body.appendChild(toast);
    }

    toast.className = `form-toast form-toast--${type}`;
    toast.innerHTML = '';

    const icon = document.createElement('span');
    icon.className = 'form-toast__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = type === 'success' ? '✓' : '!';

    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);

    // Trigger the transition on the next frame.
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 6000);
  }
})();
