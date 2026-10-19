# Fornella — Pizza Café website

A complete, frontend-only React website for a pizza café: pizzas, burgers, sides, cold drinks and desserts. It works like an app on mobile and as a full website on desktop.

> **Demo only.** There is no backend. Orders, sign-in, payments and tracking are simulated with mock data and saved in the browser's `localStorage`.

## Tech

- React 19 + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- Motion (Framer Motion) for animation; Lenis for smooth wheel scrolling
- React Router 7
- Phosphor Icons

## Getting started

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Features

- **Pages:** home, menu, order online (filters: category, veg / non-veg, tags, price, sort), product details, build-your-own pizza, cart, checkout, order confirmation, order tracking, order history, account and settings, favourites, notifications, deals, about, contact, reservations, help centre, policies (privacy, terms, refunds, delivery), and a 404 page.
- **Mobile:** app-style layout with a bottom tab bar, sticky action bars and bottom sheets.
- **Add to cart:** the dish image flies into the cart icon, and the cart count updates when it lands.
- **Demo account:** `demo@fornella.cafe` / `pizza123`.
- **Promo codes:** `HELLO20`, `FORNO10`, `TWOSDAY`, `COMBO`.

## Customising

- **Hero image:** change `hero.image` in `src/data/site.js`. Use a transparent PNG or WebP. The image is never cropped.
- **Menu and prices:** `src/data/products.js`
- **Brand details, offers, reviews:** `src/data/site.js`
- **Policy text:** `src/data/legal.js`. Replace every `[PLACEHOLDER]` with real business details and have it reviewed by a legal professional before launch.

## Image credits

- Food cut-outs come from [pngimg.com](https://pngimg.com), licensed **CC BY-NC 4.0 (non-commercial only)**. Replace them with licensed or your own photography before commercial use.
- Lifestyle photos come from [Unsplash](https://unsplash.com).
