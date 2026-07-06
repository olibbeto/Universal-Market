/* Universal Market - single-file app logic for mock e-commerce.
   Pages communicate via query params & shared cart stored in localStorage.
*/

const STORAGE_KEYS = {
  cart: 'universalMarket_cart_v1',
};

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function money(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function getProducts() {
  return window.UNIVERSAL_MARKET_PRODUCTS || [];
}

function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  dispatchCartChanged();
}

function dispatchCartChanged() {
  window.dispatchEvent(new CustomEvent('um:cartChanged'));
}

function cartCount(cart) {
  return cart.reduce((sum, it) => sum + (it.qty || 0), 0);
}

function cartSubtotal(cart, products) {
  const byId = new Map((products || []).map(p => [p.id, p]));
  return cart.reduce((sum, it) => {
    const p = byId.get(it.id);
    if (!p) return sum;
    return sum + (p.price * (it.qty || 0));
  }, 0);
}

function upsertCartItem(id, qtyDelta) {
  const products = getProducts();
  const exists = products.some(p => p.id === id);
  if (!exists) return;

  const cart = getCart();
  const idx = cart.findIndex(x => x.id === id);
  if (idx >= 0) {
    cart[idx].qty = Math.max(0, (cart[idx].qty || 0) + qtyDelta);
    if (cart[idx].qty === 0) cart.splice(idx, 1);
  } else {
    cart.push({ id, qty: Math.max(1, qtyDelta || 1) });
  }
  setCart(cart);
}

function setCartQty(id, qty) {
  const products = getProducts();
  const exists = products.some(p => p.id === id);
  if (!exists) return;

  const cart = getCart();
  const idx = cart.findIndex(x => x.id === id);
  const q = Math.max(0, Number(qty || 0));
  if (idx >= 0) {
    if (q === 0) cart.splice(idx, 1);
    else cart[idx] = { id, qty: q };
  } else {
    if (q > 0) cart.push({ id, qty: q });
  }
  setCart(cart);
}

function clearCart() {
  setCart([]);
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function navigateTo(page, params = {}) {
  const url = new URL(page, window.location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.set(k, v);
  });
  window.location.href = url.toString().replace(window.location.origin, '');
}

function createProductCard(p) {
  const inStock = p.inStock !== false;
  return `
    <article class="um-card" data-product-id="${p.id}">
      <button class="um-card-media" data-go="product" data-id="${p.id}" aria-label="View ${p.name}">
        <div class="um-card-img">
          <div class="um-card-img-bg" style="background-image:url('${p.images?.[0] || ''}')"></div>
          <img
            src="${p.images?.[0] || ''}"
            alt="${p.name} — ${p.category}"
            loading="lazy"
            decoding="async"
            onerror="this.onerror=null;this.src='';this.parentElement.setAttribute('data-empty','1');"
          />
        </div>
      </button>
      <div class="um-card-body">
        <div class="um-card-meta">
          <span class="um-pill">${p.category}</span>
          <span class="um-stock ${inStock ? 'ok' : 'no'}">${inStock ? 'In stock' : 'Sold out'}</span>
        </div>
        <h3 class="um-card-title">${p.name}</h3>
        <div class="um-card-rating" aria-label="Rating">
          <span class="um-stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(Math.max(0, 5 - Math.round(p.rating)))}</span>
          <span class="um-rating-text">${p.rating.toFixed(1)} (${p.reviews})</span>
        </div>
        <div class="um-card-bottom">
          <div class="um-price">${money(p.price)}</div>
          <div class="um-actions">
            <button class="um-btn um-btn-ghost" data-go="product" data-id="${p.id}">Details</button>
            <button class="um-btn um-btn-primary" data-action="add" data-id="${p.id}" ${inStock ? '' : 'disabled'}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  const products = getProducts();
  const featured = products.slice(0, 4);
  const hero = $('#um-hero-grid');
  if (hero) {
    hero.innerHTML = featured.map(createProductCard).join('');
    bindCardButtons(hero);
  }

  const catRow = $('#um-cat-row');
  if (catRow) {
    const categories = Array.from(new Set(products.map(p => p.category)));
    catRow.innerHTML = categories
      .map(c => `
        <a class="um-catitem" href="shop.html?cat=${encodeURIComponent(c)}">
          <img src="${(typeof categoryIcons !== 'undefined' && categoryIcons[c]) || ''}" alt="${c}" />
          <span>${c}</span>
        </a>
      `)
      .join('');
  }
}

function renderShop() {
  const products = getProducts();
  const grid = $('#um-shop-grid');
  if (!grid) return;

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const presetCat = getQueryParam('cat');
  const catWrap = $('#um-filter-categories');
  if (catWrap) {
    catWrap.innerHTML = categories
      .map(c => {
        const isActive = presetCat ? c === presetCat : c === 'all';
        const icon = c !== 'all' && typeof categoryIcons !== 'undefined' && categoryIcons[c]
          ? `<img src="${categoryIcons[c]}" alt="" />`
          : '';
        return `<button class="um-chip ${isActive ? 'active' : ''}" data-filter-cat="${c}">${icon}${c}</button>`;
      })
      .join('');

    $all('[data-filter-cat]', catWrap).forEach(btn => {
      btn.addEventListener('click', () => {
        $all('.um-chip', catWrap).forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        applyShopFilters();
      });
    });
  }

  const sortSelect = $('#um-sort');
  if (sortSelect && !sortSelect.dataset.bound) {
    sortSelect.dataset.bound = '1';
    sortSelect.addEventListener('change', () => applyShopFilters());
  }

  const searchInput = $('#um-search');
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = '1';
    searchInput.addEventListener('input', () => applyShopFilters());
  }

  function applyShopFilters() {
    const activeCat = $('.um-chip.active')?.dataset?.filterCat || 'all';
    const q = ($('#um-search')?.value || '').trim().toLowerCase();
    const sort = $('#um-sort')?.value || 'featured';

    let filtered = products.filter(p => {
      const catOk = activeCat === 'all' ? true : p.category === activeCat;
      const qOk = !q ? true : (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    grid.innerHTML = filtered.map(createProductCard).join('');
    bindCardButtons(grid);
  }

  applyShopFilters();
}

function apply3DTilt(root) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $all('.um-card', root).forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';

    const strength = 12;
    let curX = 0, curY = 0, targetX = 0, targetY = 0;
    let curGX = 50, curGY = 50, targetGX = 50, targetGY = 50;
    let rafId = null;
    let hovering = false;

    let sheen = card.querySelector('.um-card-sheen');
    if (!sheen) {
      sheen = document.createElement('div');
      sheen.className = 'um-card-sheen';
      sheen.style.cssText = `
        position:absolute; inset:0; pointer-events:none; opacity:0;
        transition:opacity .25s ease; border-radius:inherit; mix-blend-mode:screen;
        background:radial-gradient(circle at 50% 50%, rgba(124,251,255,0.35), rgba(255,46,154,0.12) 40%, transparent 70%);
      `;
      const cs = getComputedStyle(card);
      if (cs.position === 'static') card.style.position = 'relative';
      card.appendChild(sheen);
    }

    function loop() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      curGX += (targetGX - curGX) * 0.18;
      curGY += (targetGY - curGY) * 0.18;

      card.style.transform = `perspective(800px) rotateX(${(-curY * strength).toFixed(2)}deg) rotateY(${(curX * strength).toFixed(2)}deg) translateY(-6px) scale(1.015)`;
      card.style.boxShadow = `${(-curX * 14).toFixed(1)}px ${(curY * 14 + 10).toFixed(1)}px 30px rgba(0,0,0,0.45), 0 0 24px rgba(0,240,255,${(0.15 + Math.abs(curX) * 0.15).toFixed(2)})`;
      sheen.style.background = `radial-gradient(circle at ${curGX.toFixed(1)}% ${curGY.toFixed(1)}%, rgba(124,251,255,0.35), rgba(255,46,154,0.12) 40%, transparent 70%)`;

      if (hovering || Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    function ensureLoop() {
      if (!rafId) rafId = requestAnimationFrame(loop);
    }

    card.addEventListener('mousemove', (e) => {
      hovering = true;
      const r = card.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width - 0.5;
      targetY = (e.clientY - r.top) / r.height - 0.5;
      targetGX = ((e.clientX - r.left) / r.width) * 100;
      targetGY = ((e.clientY - r.top) / r.height) * 100;
      sheen.style.opacity = '1';
      ensureLoop();
    });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
      sheen.style.opacity = '0';
      ensureLoop();
      window.setTimeout(() => {
        if (!hovering && Math.abs(curX) < 0.01 && Math.abs(curY) < 0.01) {
          card.style.transform = '';
          card.style.boxShadow = '';
        }
      }, 350);
    });
  });
}

function bindCardButtons(root) {
  apply3DTilt(root);
  $all('[data-go="product"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      navigateTo('product.html', { id });
    });
  });

  $all('[data-action="add"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      upsertCartItem(id, 1);
      flashToast('Added to cart');
    });
  });
}

function renderProductDetails() {
  const id = getQueryParam('id');
  const products = getProducts();
  const p = products.find(x => x.id === id);

  const mount = $('#um-product');
  if (!mount) return;

  if (!p) {
    mount.innerHTML = `<div class="um-empty">Product not found. <a href="shop.html">Back to shop</a></div>`;
    return;
  }

  mount.innerHTML = `
    <div class="um-product">
      <div class="um-product-media">
        <div class="um-product-img">
          <div class="um-card-img-bg" style="background-image:url('${p.images?.[0] || ''}')"></div>
          <img src="${p.images?.[0] || ''}" alt="${p.name}" decoding="async" />
        </div>
        <div class="um-product-thumbs">
          ${(p.images || []).slice(0, 3).map(img => `
            <button class="um-thumb" type="button" data-thumb="${img}">
              <div class="um-card-img-bg" style="background-image:url('${img}')"></div>
              <img src="${img}" alt="Thumbnail" />
            </button>
          `).join('')}
        </div>
      </div>

      <div class="um-product-info">
        <div class="um-breadcrumbs">
          <a href="index.html">Home</a> <span>›</span> <a href="shop.html">Shop</a> <span>›</span> <span>${p.category}</span>
        </div>
        <h1 class="um-product-title">${p.name}</h1>
        <div class="um-product-rating">
          <span class="um-stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(Math.max(0, 5 - Math.round(p.rating)))}</span>
          <span class="um-rating-text">${p.rating.toFixed(1)} (${p.reviews} reviews)</span>
        </div>

        <div class="um-product-priceRow">
          <div>
            <div class="um-priceBig">${money(p.price)}</div>
            <div class="um-subtle">Taxes calculated at checkout.</div>
          </div>
          <div class="um-qtyBox">
            <div class="um-subtle">Quantity</div>
            <div class="um-qty">
              <button class="um-qtyBtn" data-qty="dec" type="button">−</button>
              <input class="um-qtyInput" type="number" min="1" value="1" aria-label="Quantity" />
              <button class="um-qtyBtn" data-qty="inc" type="button">+</button>
            </div>
          </div>
        </div>

        <p class="um-product-desc">${p.description}</p>

        <div class="um-product-details">
          <h3 class="um-h3">Highlights</h3>
          <ul>
            ${(p.details || []).map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="um-product-cta">
          <button class="um-btn um-btn-primary" data-action="add" data-id="${p.id}">Add to cart</button>
          <button class="um-btn um-btn-ghost" data-action="buy" data-id="${p.id}">Buy now</button>
        </div>

        <div class="um-product-note">
          <span class="um-badge">Universal Market</span>
          <span class="um-subtle">Free returns within 30 days.</span>
        </div>
      </div>
    </div>
  `;

  const qtyInput = $('.um-qtyInput', mount);
  const decBtn = $('[data-qty="dec"]', mount);
  const incBtn = $('[data-qty="inc"]', mount);

  if (decBtn && incBtn && qtyInput) {
    decBtn.addEventListener('click', () => qtyInput.value = Math.max(1, Number(qtyInput.value || 1) - 1));
    incBtn.addEventListener('click', () => qtyInput.value = Math.min(99, Number(qtyInput.value || 1) + 1));
  }

  const addBtn = $('[data-action="add"]', mount);
  const buyBtn = $('[data-action="buy"]', mount);

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      upsertCartItem(p.id, Number(qtyInput?.value || 1));
      flashToast('Added to cart');
    });
  }

  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      clearCart();
      setCartQty(p.id, Number(qtyInput?.value || 1));
      navigateTo('checkout.html');
    });
  }

  // Thumbs — swap both the main image and its blurred background
  const bigImg = $('.um-product-img img', mount);
  const bigBg  = $('.um-product-img .um-card-img-bg', mount);
  $all('.um-thumb', mount).forEach(t => {
    t.addEventListener('click', () => {
      const src = t.dataset.thumb;
      if (src && bigImg) bigImg.src = src;
      if (src && bigBg)  bigBg.style.backgroundImage = `url('${src}')`;
    });
  });

  // 3D tilt on the main product image
  const imgFrame = $('.um-product-img', mount);
  if (imgFrame && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    imgFrame.addEventListener('mousemove', (e) => {
      const r = imgFrame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      imgFrame.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
    });
    imgFrame.addEventListener('mouseleave', () => { imgFrame.style.transform = ''; });
  }
}

function renderCart() {
  const grid = $('#um-cart-items');
  const subtotalEl = $('#um-cart-subtotal');
  const countEl = $('#um-cart-count');
  const empty = $('#um-cart-empty');
  const checkoutBtn = $('#um-checkout');

  if (!grid) return;

  const products = getProducts();
  const byId = new Map(products.map(p => [p.id, p]));
  const cart = getCart();

  if (cart.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    if (empty) empty.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;

    const rows = cart.map(it => {
      const p = byId.get(it.id);
      if (!p) return '';
      return `
        <div class="um-cartRow" data-id="${it.id}">
          <div class="um-cartThumb">
            <img src="${p.images?.[0] || ''}" alt="${p.name}" />
          </div>
          <div class="um-cartInfo">
            <div class="um-cartName">${p.name}</div>
            <div class="um-cartMeta">${p.category}</div>
            <button class="um-linkBtn" data-action="remove" type="button" data-id="${p.id}">Remove</button>
          </div>
          <div class="um-cartControls">
            <div class="um-qty">
              <button class="um-qtyBtn" type="button" data-action="dec" data-id="${p.id}">−</button>
              <input class="um-qtyInput" type="number" min="1" value="${it.qty}" aria-label="Qty" data-id="${p.id}" />
              <button class="um-qtyBtn" type="button" data-action="inc" data-id="${p.id}">+</button>
            </div>
          </div>
          <div class="um-cartPrice">${money(p.price * it.qty)}</div>
        </div>
      `;
    }).join('');

    grid.innerHTML = rows;

    $all('[data-action="remove"]', grid).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        setCartQty(id, 0);
        flashToast('Removed from cart');
      });
    });

    $all('[data-action="dec"]', grid).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        upsertCartItem(id, -1);
      });
    });

    $all('[data-action="inc"]', grid).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        upsertCartItem(id, 1);
      });
    });

    $all('.um-qtyInput', grid).forEach(inp => {
      inp.addEventListener('change', () => {
        const id = inp.dataset.id;
        setCartQty(id, inp.value);
      });
    });
  }

  const subtotal = cartSubtotal(cart, products);
  if (subtotalEl) subtotalEl.textContent = money(subtotal);
  if (countEl) countEl.textContent = cartCount(cart);
}

function renderCheckout() {
  const itemsWrap = $('#um-checkout-items');
  const subtotalEl = $('#um-checkout-subtotal');
  const totalEl = $('#um-checkout-total');
  const empty = $('#um-checkout-empty');
  const form = $('#um-checkout-form');

  if (!itemsWrap || !subtotalEl || !totalEl || !form) return;

  const products = getProducts();
  const byId = new Map(products.map(p => [p.id, p]));
  const cart = getCart();

  if (cart.length === 0) {
    if (empty) empty.style.display = 'block';
    itemsWrap.innerHTML = '';
    subtotalEl.textContent = money(0);
    totalEl.textContent = money(0);
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  if (empty) empty.style.display = 'none';
  form.querySelector('button[type="submit"]').disabled = false;

  const subtotal = cartSubtotal(cart, products);
  const shipping = subtotal > 60 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  itemsWrap.innerHTML = cart.map(it => {
    const p = byId.get(it.id);
    if (!p) return '';
    return `
      <div class="um-checkRow">
        <div class="um-checkLeft">
          <div class="um-checkName">${p.name}</div>
          <div class="um-checkMeta">Qty: ${it.qty}</div>
        </div>
        <div class="um-checkRight">${money(p.price * it.qty)}</div>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(total);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Mock order creation
    const orderId = 'UM-' + Math.random().toString(16).slice(2, 8).toUpperCase();
    clearCart();

    const result = $('#um-order-result');
    if (result) {
      result.innerHTML = `
        <div class="um-success">
          <div class="um-successIcon">✓</div>
          <h2>Order confirmed</h2>
          <div class="um-subtle">Order ID: <strong>${orderId}</strong></div>
          <div class="um-subtle">A confirmation email would be sent to <strong>${data.email || 'your inbox'}</strong> (mock).</div>
          <div style="margin-top:14px;">
            <a class="um-btn um-btn-primary" href="index.html">Back to shop</a>
          </div>
        </div>
      `;
    }

    const top = $('#um-checkout-top');
    if (top) top.style.display = 'none';
  }, { once: true });
}

function renderContact() {
  const form = $('#um-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    const result = $('#um-contact-result');
    if (result) {
      result.innerHTML = `
        <div class="um-success">
          <div class="um-successIcon">✓</div>
          <h2>Message sent</h2>
          <div class="um-subtle">Thanks, <strong>${data.name || 'friend'}</strong>! We'll reach you at <strong>${data.email || 'your email'}</strong> (mock).</div>
        </div>
      `;
    }
    form.reset();
  }, { once: true });
}

function renderCartBadge() {
  const badge = $('#um-cart-badge');
  if (!badge) return;
  const cart = getCart();
  badge.textContent = String(cartCount(cart));
}

function initNavbar() {
  // Bind cart badge + nav
  renderCartBadge();
  window.addEventListener('um:cartChanged', renderCartBadge);

  // Theme toggle
  const toggle = $('#um-theme-toggle');
  if (toggle && !toggle.dataset.bound) {
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const next = (document.documentElement.dataset.theme || 'dark') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Initial theme
  const saved = localStorage.getItem('um_theme');
  const initial = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(initial);


  // Nav search (optional)
  const navSearch = $('#um-nav-search');
  if (navSearch && !navSearch.dataset.bound) {
    navSearch.dataset.bound = '1';
    navSearch.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const q = navSearch.value.trim();
      navigateTo('shop.html', q ? { q } : {});
    });
  }
}

function initRoute() {
  const page = $('#um-page-root')?.dataset?.page;
  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'shop':
      // If user came from nav search, fill search input
      const q = getQueryParam('q');
      if (q && $('#um-search')) $('#um-search').value = q;
      renderShop();
      break;
    case 'product':
      renderProductDetails();
      break;
    case 'cart':
      renderCart();
      window.addEventListener('um:cartChanged', renderCart);
      break;
    case 'checkout':
      renderCheckout();
      window.addEventListener('um:cartChanged', renderCheckout);
      break;
    case 'contact':
      renderContact();
      break;
    default:
      break;
  }
}

function flashToast(text) {
  const t = $('#um-toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  window.clearTimeout(flashToast._timer);
  flashToast._timer = window.setTimeout(() => t.classList.remove('show'), 1400);
}

function setTheme(theme) {
  if (!theme) theme = 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('um_theme', theme); } catch {}
  const toggle = $('#um-theme-toggle');
  if (toggle) toggle.textContent = theme === 'light' ? '☀️' : '🌙';
}

function initCursorGlow() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'um-cursor-glow';
  glow.style.cssText = `
    position:fixed; top:0; left:0; width:420px; height:420px;
    pointer-events:none; z-index:2; mix-blend-mode:screen;
    border-radius:50%; opacity:0; transition:opacity .3s ease;
    background:radial-gradient(circle, rgba(124,251,255,0.14) 0%, rgba(255,46,154,0.08) 35%, transparent 70%);
    transform:translate(-50%,-50%);
    will-change:transform;
  `;
  document.body.appendChild(glow);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let gx = mx, gy = my;
  let active = false;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      active = true;
      glow.style.opacity = '1';
      tick();
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function tick() {
    gx += (mx - gx) * 0.15;
    gy += (my - gy) * 0.15;
    glow.style.transform = `translate(${gx - 210}px, ${gy - 210}px)`;
    if (Math.abs(mx - gx) > 0.5 || Math.abs(my - gy) > 0.5) {
      requestAnimationFrame(tick);
    } else {
      active = false;
    }
  }
}

/* ─── Scroll-reveal + card stagger ─────────────────────────────────────────── */
function initScrollReveal() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Selectors to watch and the direction class to apply
  const TARGETS = [
    { sel: '.um-hero',           cls: 'um-reveal--up' },
    { sel: '.um-section-title',  cls: 'um-reveal--left' },
    { sel: '.um-trust-strip',    cls: 'um-reveal--up' },
    { sel: '.um-catitem',        cls: 'um-reveal--up' },
    { sel: '.um-card',           cls: 'um-reveal--up' },
    { sel: '.um-cta-band',       cls: 'um-reveal--up' },
    { sel: '.um-footer-brand',   cls: 'um-reveal--left' },
    { sel: '.um-footer-col',     cls: 'um-reveal--up' },
    { sel: '.um-hstat',          cls: 'um-reveal--up' },
    { sel: '.um-hero-featurelist li', cls: 'um-reveal--right' },
    { sel: '.um-product-media',  cls: 'um-reveal--left' },
    { sel: '.um-product-info',   cls: 'um-reveal--right' },
    { sel: '.um-cartRow',        cls: 'um-reveal--up' },
    { sel: '.um-trust-item',     cls: 'um-reveal--up' },
  ];

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('um-reveal--in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function tag() {
    TARGETS.forEach(({ sel, cls }) => {
      $all(sel).forEach((el, i) => {
        if (el.dataset.revealBound) return;
        el.dataset.revealBound = '1';
        el.classList.add('um-reveal', cls);
        // Stagger siblings of the same type (cards, catitems, etc.)
        const baseDelay = ['um-card','um-catitem','um-hstat','um-trust-item','um-hero-featurelist li','um-cartRow','um-footer-col'].some(c => el.classList.contains(c) || el.matches(c.startsWith('.') ? c : '.' + c))
          ? Math.min(i * 70, 420) : 0;
        el.style.setProperty('--reveal-delay', baseDelay + 'ms');
        io.observe(el);
      });
    });
  }

  // Tag immediately + re-tag after dynamic renders
  tag();
  // Watch for new nodes (dynamic product grids)
  const mo = new MutationObserver(() => tag());
  mo.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
  // Theme init (if theme toggle exists)
  try{
    const saved = localStorage.getItem('um_theme');
    if(saved){ document.documentElement.dataset.theme = saved; }
  }catch{}

  const toggle = $('#um-theme-toggle');
  if(toggle && !toggle.dataset.bound){
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try{ localStorage.setItem('um_theme', next); }catch{}
    });
  }


  initNavbar();
  initRoute();
  initCursorGlow();
  initScrollReveal();
  // Thumbs on product page
  $all('[data-thumb]').forEach(() => {});
});
