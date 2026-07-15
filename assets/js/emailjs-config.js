/**
 * =============================================================
 * EMAILJS CONFIGURATION
 * =============================================================
 * Replace the three placeholder values below with the values
 * from your EmailJS dashboard (https://dashboard.emailjs.com).
 *
 * Where to find each one — see the full step-by-step guide
 * that was provided alongside this file, but in short:
 *
 *   EMAILJS_PUBLIC_KEY   → Account → General → "Public Key"
 *   EMAILJS_SERVICE_ID   → Email Services → your service → "Service ID"
 *   EMAILJS_TEMPLATE_ID  → Email Templates → your template → "Template ID"
 *
 * Do NOT put your EmailJS "Private Key" here — it is never
 * needed on the frontend and should never ship in client code.
 * =============================================================
 */
window.EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',     // <-- replace me
  SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',     // <-- replace me
  TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',   // <-- replace me
};

/**
 * Initializes the EmailJS SDK exactly once, no matter how many
 * times this script is parsed (guards against duplicate <script>
 * tags or repeated inclusion on other pages).
 */
(function initEmailJS() {
  if (window.__emailjsInitialized) return;

  if (typeof emailjs === 'undefined') {
    console.error(
      'EmailJS SDK not found. Make sure the EmailJS <script> tag ' +
      'is included BEFORE this config file in contact.html.'
    );
    return;
  }

  emailjs.init({ publicKey: window.EMAILJS_CONFIG.PUBLIC_KEY });
  window.__emailjsInitialized = true;
})();
