# DAT Fragrances

A hypothetical online fragrance storefront built as a class project by Deghne Agana, Theodore Navarro and Alexander Tolosa. It is minimal and premium, and the product pages lead with the note pyramid (top, heart, base).

> Academic project. Products, prices (PHP) and descriptions are made up for the course and are not official brand claims. No real orders are placed.

## Tech stack

- React 19 + Vite
- React Router
- React-Bootstrap / Bootstrap 5
- GSAP for motion, Three.js for the 3D scenes
- oxlint for linting

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # run oxlint
```

## Pages

| Page | Purpose |
| --- | --- |
| Home | Call to action and featured products |
| Shop | Full product catalogue |
| Product | Description, note pyramid, add to cart |
| About | The team and the origin story |
| Contact | Contact info, location and contact form |
| Cart / Checkout / Order confirmation | Mock purchase flow |

## Project structure

```
src/
  components/   Shared UI (nav, footer, product cards, bottles, scenes)
  context/      Cart state (CartContext)
  data/         Product and order data
  hooks/        Custom hooks
  pages/        Route-level pages
  *.css         Global styles (index, atmosphere, heroes, cart, polish)
PRODUCT.md      Product brief and design principles
```

## Team

Deghne Agana, Theodore Navarro, Alexander Tolosa
