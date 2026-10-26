# Frontend Fixes & Design Upgrades

Combined from two audits (Claude + Gemini, 2026-10-26). Frontend UI/UX only — anything that depends on Shopify data/backend is out of scope for now.

## Out of scope (backend / Shopify data — leave as is)
- Newsletter form not submitting
- Product card badges (depend on Shopify tags)
- New Arrivals product mix (ramen-heavy)
- Brand logo links 404 (`/collections/cadbury` etc. — collections don't exist in Shopify)
- Duplicate product grid (Best Sellers falls back to New Arrivals)
- Empty Special Offers product boxes
- Missing product descriptions

## Open decisions
- [x] Header colour: cream bg + burgundy logo/nav, orange for accents (decided 2026-10-27)

---

## Phase 1 — Fixes
- [x] 1. Header nav links: `#best-sellers` / `#special-offers` / `#footer` → `/#...` so they work off the homepage (`site-header.tsx`, desktop + mobile menu)
- [x] 2. Branded 404 page (`src/app/not-found.tsx`): logo, playful copy ("Oops! This treat doesn't exist…"), "Continue shopping" CTA
- [x] 3. Hero carousel: auto-rotate ~6s, pause on hover, cross-fade transition (`hero-carousel.tsx`)
- [x] 4. Mobile PDP: floating WhatsApp button overlaps qty stepper — raise it or hide on PDP
- [x] 5. Mobile grids: "ADD TO CART" wraps to 2 lines — icon + "Add" on small screens
- [x] 6. Footer "Categories" → `/collections` doesn't exist — build all-categories page or link to `/#categories`

## Phase 2 — Trust & polish
- [x] 7. Trust strip on homepage: Original Imports · Nationwide Delivery · COD · Secure Checkout
- [x] 8. PDP: fill empty space under buy box — trust badges, card panel around buy box, WhatsApp icon, share row, image zoom on hover
- [x] 9. Brand marquee: soft fade on left/right edges
- [x] 10. Footer: SVG payment logos instead of text badges; add social icons (Instagram, Facebook, TikTok)
- [x] 11. Collection page: breadcrumb, product count, banner/pattern header instead of flat burgundy
- [x] 12. Scroll fade-in for sections; card hover lift + shadow
- [x] 13. Product images on a uniform cream backdrop (`object-contain` + padding) so mixed photo backgrounds look consistent

## Phase 3 — Premium feel
- [x] 14. Apply header colour decision (see Open decisions)
- [x] 15. Alternate section backgrounds (cream / light peach `#FDF1EA`), faint candy SVG pattern, decorative section dividers
- [x] 16. Special Offers: sparkle effect behind "40%", bigger "Shop Now", gold border
- [x] 17. Best Sellers as horizontal carousel with #1/#2 rank badges; "View all" links on product sections
- [x] 18. Testimonials strip (static copy for now)
- [x] 19. Skeleton loading states for product grids
- [x] 20. Mobile categories as horizontal swipe row instead of 9-row grid

## Phase 4 — Custom images (user creates)
Save as WebP < 300 KB in `public/`.

| Image | Size | How |
|---|---|---|
| Hero slides 2 & 3 (full designed banners) | 2400×1000 desktop, 1080×1350 mobile | Product shoot on cream/burgundy fabric with gold props, soft light — or Canva / Gemini prompt: *"luxury chocolate assortment on cream silk, burgundy and gold accents, soft window light, empty space on left for text, 16:9"*. Keep left 40% empty for headline. |
| Category lifestyle photos (17) | 800×800 | Same backdrop per category. Prompt: *"premium flat-lay of [category] on dark marble, warm golden lighting, shallow depth of field, luxury food photography"* |
| Collection banners | 1600×400 | Canva template: burgundy bg, product cutout, serif title |
| 404 illustration | 600×600 | Cute melted chocolate bar, flat illustration, brand palette |
| Occasion tiles (Eid / birthday / corporate) | 800×1000 | Gift-box lifestyle shots |
| Background pattern | — | Claude codes as SVG, no design needed |

## Skipped (revisit later)
- Instagram feed — needs external embed service
- Page transition animations — complexity for little gain
- Countdown timer — needs real offer end dates
