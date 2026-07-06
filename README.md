# Universal Market

A static, cyberpunk-themed e-commerce storefront demo — neon grid backgrounds, glowing HUD panels, 3D tilt product cards, and a fully client-side shopping flow. No backend, no build step, no dependencies to install. Just open it in a browser.

![Status](https://img.shields.io/badge/status-demo-blueviolet) ![No backend](https://img.shields.io/badge/backend-none-informational) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Full storefront flow** — Home, Shop, Product detail, Cart, Checkout, About, and Contact pages
- **Client-side cart & checkout** — persisted with `localStorage`, no account or server required
- **Cyber "Grid Runner" visual theme** — neon cyan/magenta palette, animated Three.js particle grid background, scanline/HUD-style UI accents
- **Interactive product cards** — smooth 3D tilt-on-hover with a cursor-tracking light sheen and dynamic shadow
- **Cursor glow effect** — a soft ambient light that follows the mouse across the page
- **Category browsing, search, and sorting** on the Shop page
- **Light/dark theme toggle**
- **Responsive design** — scales down cleanly to mobile
- **Reduced-motion aware** — heavier animations are skipped when the user's OS requests reduced motion

## 🖼 Preview

| Home | Shop |
|---|---|
| Neon hero, live store-status panel, featured picks | Filterable grid across 7 categories |

## 🗂 Project structure

```
universal-market/
├── index.html          # Home page
├── shop.html           # Product listing, search & filters
├── product.html        # Product detail (loaded via ?id= query param)
├── cart.html           # Cart view
├── checkout.html       # Mock checkout flow
├── about.html          # About page
├── contact.html        # Contact form (mock submission)
├── theme.js            # Light/dark theme toggle logic
├── logo.png / logo-icon.png
├── assets/
│   ├── styles.css      # All site styling
│   ├── data.js         # Mock product catalog (32 products, 7 categories)
│   ├── app.js          # Cart logic, rendering, search/sort, card tilt, cursor glow
│   ├── cyber-bg.js      # Three.js animated background (grid + particles)
│   └── partials.js     # Injects shared nav/footer into each page
├── _partials/
│   ├── nav.html
│   ├── footer.html
│   ├── theme-toggle.html
│   └── nav_common.js
└── .no-backend.txt      # Reminder: this project is 100% static
```

## 🚀 Getting started

This is a static site — no npm install, no build step.

**Option 1: Just open it**
Double-click `index.html` to open it directly in your browser.

**Option 2: Serve it locally (recommended)**
Some browsers restrict features like `fetch`/`localStorage` on the `file://` protocol, so a local server is safer:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# VS Code
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8080`.

## 🛒 How the store works

- **Catalog**: all product data (name, price, category, rating, images, description) lives in `assets/data.js` — no API calls.
- **Cart**: adding/removing items and quantities are saved to `localStorage`, so your cart persists across page reloads without an account.
- **Checkout**: the checkout form is fully mocked — it validates input and shows an order confirmation, but no real payment or order is processed.
- **Images**: product photos are pulled from Unsplash's CDN by default (see `assets/data.js`).

## 🎨 Customizing

| Want to change... | Edit this file |
|---|---|
| Product catalog, prices, categories | `assets/data.js` |
| Colors, fonts, spacing, layout | `assets/styles.css` |
| Cart/checkout/search behavior | `assets/app.js` |
| Background animation (grid & particles) | `assets/cyber-bg.js` |
| Nav bar / footer markup | `_partials/nav.html`, `_partials/footer.html`, `assets/partials.js` |
| Page copy | the individual `.html` files |

## ⚠️ Disclaimer

This is a **demo/portfolio project**. There is no real backend, no real payments, no real inventory, and no data is sent anywhere — everything runs in your browser. Do not enter real payment information.

## 📄 License

MIT — free to use, modify, and learn from.
