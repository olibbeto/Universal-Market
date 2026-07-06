/* Universal Market — shared nav + footer injector
   Included by every page. Reads data-page from #um-page-root to highlight active nav link.
*/
(function(){
  // Determine active page for nav highlighting
  function getActivePage(){
    const root = document.getElementById('um-page-root');
    return root ? (root.dataset.page || '') : '';
  }

  function navLink(href, label, page, activePage){
    const active = page === activePage ? ' um-navlink--active' : '';
    return `<a class="um-navlink${active}" href="${href}">${label}</a>`;
  }

  function buildNav(activePage){
    return `<header class="um-nav">
  <div class="um-container um-nav-inner">
    <div class="um-brand">
      <a class="um-logo-img" href="index.html" aria-label="Universal Market Home">
        <img src="logo-icon.png" alt="Universal Market Icon" class="um-logo-png um-logo-png--icon" />
      </a>
      <div class="um-nav-wordmark">
        <span class="um-nav-title">UNIVERSAL MARKET</span>
        <span class="um-nav-tagline">SECURE NODE <i>&#183;</i> LIVE FEED</span>
      </div>
    </div>

    <nav class="um-nav-links" aria-label="Primary">
      ${navLink('index.html','Home','home',activePage)}
      ${navLink('shop.html','Shop','shop',activePage)}
      ${navLink('about.html','About','about',activePage)}
      ${navLink('contact.html','Contact','contact',activePage)}
    </nav>

    <div class="um-nav-right">
      <div class="um-search" role="search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="um-nav-search" placeholder="Search products…" />
      </div>

      <button id="um-theme-toggle" class="um-btn um-btn-ghost um-btn-icon" type="button" aria-label="Toggle theme" title="Toggle theme">🌙</button>

      <a class="um-cart" href="cart.html" aria-label="Cart">
        <svg class="um-cart-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.8"/><path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span class="um-cart-label">Cart</span>
        <span id="um-cart-badge" class="um-badge">0</span>
      </a>
    </div>
  </div>
</header>`;
  }

  const footer = `<footer class="um-footer">
  <div class="um-container">
    <div class="um-footer-top">
      <div class="um-footer-brand">
        <div class="um-footer-logo">
          <a href="index.html" class="um-logo-img" aria-label="Universal Market Home">
            <img src="logo.png" alt="Universal Market" class="um-logo-png um-logo-png--footer" />
          </a>
        </div>
        <p>A curated edit of everyday goods, rendered in chrome and neon. Cart and checkout run entirely client-side — no backend, no tracking.</p>
        <div class="um-footer-social">
          <a href="#" class="um-social-btn" aria-label="Twitter">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
          </a>
          <a href="#" class="um-social-btn" aria-label="Instagram">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/oliyad-beto-108540385" target="_blank" rel="noopener" class="um-social-btn" aria-label="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://github.com/olibbeto" target="_blank" rel="noopener" class="um-social-btn" aria-label="GitHub">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>

      <div class="um-footer-cols">
        <div class="um-footer-col">
          <b>Navigate</b>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop All</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="um-footer-col">
          <b>Categories</b>
          <ul>
            <li><a href="shop.html?cat=electronics">Electronics</a></li>
            <li><a href="shop.html?cat=fashion">Fashion</a></li>
            <li><a href="shop.html?cat=beauty">Beauty</a></li>
            <li><a href="shop.html?cat=home">Home</a></li>
            <li><a href="shop.html?cat=sports">Sports</a></li>
          </ul>
        </div>
        <div class="um-footer-col">
          <b>Support</b>
          <ul>
            <li><span>Returns: 30 days</span></li>
            <li><span>Shipping: Free over $60</span></li>
            <li><span>Payment: Demo checkout</span></li>
            <li><a href="contact.html">Get in touch</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="um-footer-bottom">
      <span>© 2026 Universal Market. Demo store — no real transactions.</span>
      <div class="um-footer-badges">
        <span class="um-footer-badge">CLIENT-SIDE ONLY</span>
        <span class="um-footer-badge">NO BACKEND</span>
        <span class="um-footer-badge">OPEN SOURCE</span>
      </div>
    </div>
  </div>
</footer>`;

  // Inject
  const navEl = document.getElementById('um-page-nav');
  const footerEl = document.getElementById('um-page-footer');
  const activePage = getActivePage();

  if(navEl) navEl.outerHTML = buildNav(activePage);
  if(footerEl) footerEl.outerHTML = footer;
})();
