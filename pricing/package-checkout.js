/* Static (GitHub Pages) mode: online checkout disabled. Pricing CTAs route to contact. */
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
      el.dataset.staticDone = '1';
      var dest = /pay-invoice/.test(el.getAttribute('href') || '') ? CONTACT : label(el);
      var a = document.createElement('a');
      a.className = el.className;
      a.href = dest;
      var t = (el.textContent || '').trim();
      a.textContent = /pay invoice/i.test(t) ? 'Contact Us' : (/buy|order|checkout|start|get|purchase|pay/i.test(t) || !t ? 'Contact to Get Started' : t);
      el.replaceWith(a);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', convert); else convert();
  new MutationObserver(convert).observe(document.documentElement, { childList: true, subtree: true });
})();
