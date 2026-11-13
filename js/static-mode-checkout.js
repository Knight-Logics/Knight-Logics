/* Contact fallback only when /api/health is missing or checkout is not ready. */
(function () {
  var CONTACT = '/contact.html';
  function label(el) {
    var k = el.getAttribute('data-package-key') || el.getAttribute('data-sku') || '';
    return CONTACT + (k ? '?package=' + encodeURIComponent(k) : '');
  }
  function convert() {
    var sel = '[data-sku], .pricing-card-cta, [href*="openPackage="], [href*="pay-invoice"], #checkout-button, [data-checkout]';
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.dataset.staticDone) return;
      if (el.classList && el.classList.contains('sp-buy')) return;
      el.dataset.staticDone = '1';
      var dest = /pay-invoice/.test(el.getAttribute('href') || '') ? CONTACT : label(el);
      var a = document.createElement('a');
      a.dataset.staticDone = '1';
      a.className = el.className;
      a.href = dest;
      var t = (el.textContent || '').trim();
      a.textContent = /pay invoice/i.test(t) ? 'Contact Us' : (/buy|order|checkout|start|get|purchase|pay/i.test(t) || !t ? 'Contact to Get Started' : t);
      el.replaceWith(a);
    });
    document.querySelectorAll('.pricing-card-flags span').forEach(function (el) {
      if (/^(direct checkout|deposit only)$/i.test(el.textContent.trim())) el.textContent = 'Request a quote';
    });
    document.querySelectorAll('.pricing-purchase-note').forEach(function (el) {
      if (el.dataset.staticCopy) return;
      el.dataset.staticCopy = '1';
      el.textContent = 'Next step: Contact us to confirm scope and payment terms.';
    });
  }
  function boot() {
    fetch('/api/health', { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (body) {
        if (body && body.ok === true && body.checkout === true) return;
        convert();
      })
      .catch(convert);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
