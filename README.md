# Routine Lab

A skincare routine builder in Nykaa's design language. Pick products, build your **morning (AM)** and **night (PM)** routines, and the app arranges them in the correct application order, flags clashing ingredients in real time, and can even recommend a full routine based on your skin type.

Built as a fast, fully client-side React app — no backend required.

---

## Features

- **AM / PM routine builder** — separate morning and night routines with different suitable products for each slot.
- **Live ingredient-conflict detection** — known interactions (e.g. *Vitamin C + Niacinamide*, *Retinol + AHA/BHA*, *Retinol + Vitamin C*) are flagged the moment two clashing products share a routine, with a severity badge (Conflict / Caution / Tip) and a fix suggestion.
- **Drag to reorder** — reorder steps by dragging, powered by [`@dnd-kit`](https://dndkit.com/) (keyboard-accessible too).
- **Auto-arrange** — one tap sorts your steps into the dermatologist-recommended order: cleanser → toner → serum → eye cream → moisturiser → face oil → sunscreen.
- **"Build my routine for me"** — pick your skin type (oily / dry / combination / sensitive / normal) and a main concern, and the app assembles a complete, **guaranteed conflict-free** AM & PM routine by reusing the same conflict engine.
- **Routine summary** — live step count, conflict count, and total price (₹).
- **Catalogue** — 23 products with search and category filters; product images are hotlinked from Shopify's CDN.
- **Polished UI** — Nykaa's exact colour tokens (signature pink `#FC2779`) and the Inter typeface, with smooth Framer Motion transitions.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS (Nykaa design tokens) |
| State | Zustand |
| Drag & drop | @dnd-kit |
| Animation | Framer Motion |
| Testing | Jest + ts-jest |

The ingredient-conflict and routine-recommendation logic is **pure, side-effect-free TypeScript** (`src/lib/`), making it fully unit-testable independent of the UI.

---

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# run the test suite
npm test

# production build → dist/
npm run build

# preview the production build locally
npm run preview
```

---

## Project structure

```
src/
├── components/
│   ├── Header.tsx              # brand bar + AM/PM toggle
│   ├── ProductCatalogue.tsx    # search, filters, product grid
│   ├── ProductCard.tsx         # a single catalogue product
│   ├── RoutineBuilder.tsx      # the AM/PM routine panel
│   ├── SortableStep.tsx        # a draggable routine step
│   ├── ConflictPanel.tsx       # ingredient-conflict warnings
│   └── RoutineRecommender.tsx  # skin-type quiz → routine
├── lib/
│   ├── conflicts.ts            # conflict database + detection (pure)
│   ├── recommend.ts            # skin-type → routine logic (pure)
│   └── __tests__/              # Jest tests for the above
├── data/products.ts            # product catalogue (API-shaped)
├── store/useRoutineStore.ts    # Zustand store (AM/PM state)
├── types/index.ts              # shared types
└── styles/index.css            # Tailwind + base styles
```

---

## How it works

**Conflict detection** (`src/lib/conflicts.ts`) holds a database of known ingredient interactions. For any routine it compares every pair of products' key ingredients against that database and returns the matching conflicts, sorted by severity (errors → warnings → tips).

**Recommendations** (`src/lib/recommend.ts`) map each skin type to a sensible base routine and each concern to a treatment add-on, then run the assembled routine back through the conflict engine — greedily dropping the lower-priority product if anything clashes. This guarantees a recommended routine is always conflict-free.

State is intentionally **in-memory only**, so every page load starts with a fresh, empty routine.

---

## Notes

Products, prices and ingredient data are illustrative (each card carries a *Demo* badge). In a production build the catalogue would be sourced from a live product API; the data layer is already API-shaped so the swap is a one-file change.
