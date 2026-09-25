# Progress Log

Tracks what's done, session by session. One feature per session (keeps token use low). Update this file at the end of every session / after every completed feature, then commit.

Format per entry:
```
## [YYYY-MM-DD] <Feature/Task>
- What shipped
- Files touched
- Deviations from plan.md (if any, with reason + who approved)
- Next up
```

---

## 2026-08-24 — Project init
- Created `plan.md` (full spec), `CLAUDE.md` (repo guidance), `progress.md` (this file)
- Initialized git repo, branch `main`
- No code yet — Phase 1 (Setup) not started
- Next up: Phase 1 — Shopify store + API keys, Next.js scaffold, GraphQL client config

## 2026-08-28 — Phase 1 (code side): Next.js scaffold + GraphQL client
- `create-next-app` scaffold (TypeScript, Tailwind, App Router, ESLint, `src/` dir, `@/*` alias)
- Installed `graphql-request` + `graphql`; added `src/lib/shopify.ts` — Storefront API client, reads `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` / `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`, throws if unset
- Added `.env.local.example` per plan.md sec 6 step 5
- `npm run build` verified clean
- Files touched: package.json, package-lock.json, tsconfig.json, eslint.config.mjs, next.config.ts, next-env.d.ts, public/*, src/app/*, src/lib/shopify.ts, .env.local.example, .gitignore (minor)
- Deviations: none
- Next up: once store domain + Storefront token are in hand, verify live connection (test query per plan.md sec 6 step 6), then start Phase 2 (data layer — product/collection queries + codegen)

## 2026-08-28 — Phase 1 complete: Shopify store + live connection verified
- User created Shopify store (`eakhun-ed.myshopify.com`), custom app, Storefront API token — creds in `.env` (gitignored)
- Verified live connection: test query (`{ shop { name primaryDomain { url } } }`) against `https://eakhun-ed.myshopify.com/api/2026-01/graphql.json` returned valid response
- Files touched: none (`.env` gitignored, not committed)
- Deviations: creds placed in `.env` instead of `.env.local` — both gitignored and loaded by Next.js, no functional difference
- **Phase 1 (Setup) done.**
- Next up: Phase 2 — data layer: product/collection GraphQL queries, TypeScript types via codegen

## 2026-08-28 — Phase 2: data layer (product/collection queries + codegen)
- Installed `@graphql-codegen/cli`, `typescript`, `typescript-operations`, `add` plugins + `dotenv`
- `codegen.ts` — introspects live Storefront API schema (2026-01), generates types to `src/lib/generated/storefront-types.ts` (base schema) + `src/lib/generated/storefront.ts` (operation types, importing base via `Types` namespace)
- Split into two generated files as a workaround: combining `typescript` + `typescript-operations` plugins into a single output caused `CurrencyCode` to be emitted twice (`TS2300: Duplicate identifier`) — apparent codegen bug specific to that enum, not reproducible with plugins split
- `src/lib/products.ts` — typed fetch functions: `getProducts`, `getProductByHandle`, `getCollections`, `getCollectionByHandle`, each with inline `gql` queries (products/collections list + fragments) and generated TS types for params/returns
- `npm run codegen` script added; verified `npm run build` + live query against real store (`toblerone-dark-chocolate-bar` etc. returned)
- Files touched: `codegen.ts`, `package.json`, `package-lock.json`, `src/lib/products.ts`, `src/lib/generated/storefront-types.ts`, `src/lib/generated/storefront.ts`
- Deviations: none from plan.md scope; the two-file codegen split is an implementation detail, not a spec deviation
- Next up: Phase 3 — core pages (Home, PLP, PDP, static pages) using `src/lib/products.ts` fetchers. Open Decision to resolve before Phase 3: design system / component library approach

## 2026-08-28 — Phase 3 (partial): Homepage, header/footer, category pages
- Design system decided: Tailwind + shadcn/ui, minimal navy/blue + amber theme inspired by (not copied from) the client's existing single-page site (see `WEBSITE-DESIGN-IMGS/`, `PRODUCT_IMAGES/` category banners) — resolves the open decision from plan.md §9
- `npx shadcn init` — added `components.json`, `src/lib/utils.ts`, `src/components/ui/{button,badge,carousel}.tsx`; deps: embla-carousel-react, lucide-react, class-variance-authority, clsx, tailwind-merge
- Retheme in `src/app/globals.css`: primary=indigo/navy, accent=amber, larger `--radius`; fixed a pre-existing `--font-sans: var(--font-sans)` self-reference bug from the shadcn init (now points at the Geist variable)
- Homepage (`src/app/page.tsx`): hero carousel (placeholder gradient slides, autoplay + dots — real banner images to swap in later) → Featured Products (4) → Popular Right Now (4, both currently just the first 8 products from the catalog, no dedicated Shopify collection yet — per user: manual for now, revisit once there's real sales data) → one section per category (pill-style header + "View all" link + up to 4 product cards)
- New: `src/components/{site-header,site-footer,hero-carousel,product-card,category-section}.tsx`, `src/lib/{categories,format}.ts`, `src/app/collections/[handle]/page.tsx` (category/PLP page, reuses `getCollectionByHandle`)
- `next.config.ts`: added `cdn.shopify.com` to `images.remotePatterns` (needed for `next/image` with Storefront API image URLs)
- Verified: `tsc --noEmit`, `next build`, and `next dev` + Playwright screenshot of the real homepage (live Shopify data rendered correctly)
- Deviations (both discussed with user first):
  - Categories: client's list was chocolate/jelly/candy/crisps/chips/biscuits/noodles/coffee/drinks (9), but the store only has 8 real collections — coffee & drinks are one combined `coffee-drinks` collection, not two. Homepage uses the 8 real collections (`src/lib/categories.ts`) instead of inventing a split that doesn't exist in Shopify.
  - Catalog is thin right now (2-3 products in most collections, several missing images) — category sections render whatever's actually there (down to 0, section just hides) rather than padding to a fixed 4.
- Not done yet (still open for a future session): product detail page (`/products/[handle]` is linked but not built), cart/checkout, real hero banner images, search bar, delivery-location bar from the reference design (client didn't ask for it — flagged as maybe-out-of-scope-v1).
- Next up: product detail page (PDP), then cart (Shopify-hosted checkout redirect per plan.md).

## 2026-08-29 — Phase 3: Product detail page (PDP)
- User direction: logo not finalized, so hero carousel/collection banner imagery + color theme stay parked — build all other functionality regardless.
- `src/app/products/[handle]/page.tsx` — PDP route using existing `getProductByHandle`
- `src/components/product-detail.tsx` — image gallery (thumbnail strip + main image), per-option variant picker (derives option names/values from `variants`, resolves `selectedVariant` from selection), live price update on variant change, in/out-of-stock badge, "Add to cart" button (disabled when out of stock — inert placeholder, real cart logic is phase 4), `descriptionHtml` render
- Fixed a live bug hit during verification: `quantityAvailable` field errored with `Access denied ... unauthenticated_read_product_inventory access scope` (token doesn't have that scope) — removed the field from `GET_PRODUCT_BY_HANDLE` since only `availableForSale` is used for stock status; reran codegen
- Verified: `tsc --noEmit`, `next build`, live `GET /products/toblerone-dark-chocolate-bar` returns 200 against real store data
- Files touched: `src/app/products/[handle]/page.tsx`, `src/components/product-detail.tsx`, `src/lib/products.ts`, `src/lib/generated/storefront-types.ts`, `src/lib/generated/storefront.ts`
- Deviations: none from plan.md scope
- **Phase 3 (core pages) now functionally complete** — banners/hero images/theme intentionally deferred per user, not a gap in build.
- Next up: Phase 4 — cart (mutations, cart UI, `cart.checkoutUrl` redirect)

## 2026-08-29 — Color theme applied
- Client gave final palette: background `#FFFFFF`, primary `#2C1810` (espresso brown), accent `#E8622C` (burnt orange, CTAs), secondary `#EDE4D3` (warm off-white, cards/sections), support `#2F4F4C` (deep teal, sparing use — footer/accent line)
- `src/app/globals.css` `:root` — swapped old navy/amber oklch values for the hex palette (primary/accent/secondary/muted/border/ring), added `--support` token (`--color-support` in `@theme inline`) for the teal
- `.dark` block left untouched — site has no dark-mode toggle, unused
- Verified: `tsc --noEmit`, `next build` clean
- Files touched: `src/app/globals.css`
- Next up: apply `--color-support` (teal) somewhere sparing (footer accent line) when footer gets revisited; Phase 4 — cart

## 2026-08-29 — Phase 4: Cart & checkout redirect
- `src/lib/cart.ts` — cart GraphQL fragment/queries/mutations (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cart` query) + typed fetch fns; `codegen.ts` documents now include this file
- `src/lib/cart-actions.ts` — `'use server'` actions (`fetchCart`, `addToCart`, `updateCartLine`, `removeCartLine`) using `cookies()` for the `cart_id` cookie (30-day maxAge), lazily creates the cart on first add
- `src/components/cart-provider.tsx` — client React Context (`CartProvider`/`useCart`) holding cart state + drawer open state, dispatches server actions via `useTransition`
- `src/components/cart-drawer.tsx` — slide-over drawer (custom, no new UI dep): line items, qty +/- (removes at qty 0), remove, subtotal, "Checkout" button linking straight to `cart.checkoutUrl` (Shopify-hosted checkout per plan.md — no custom checkout UI built)
- `src/app/layout.tsx` — now an async Server Component: fetches initial cart server-side via `fetchCart()`, wraps app in `CartProvider`, renders `CartDrawer`
- `src/components/site-header.tsx` — client component now (needs `useCart`); cart icon shows live item-count badge, opens drawer
- `src/components/product-detail.tsx` — "Add to cart" wired to `useCart().addItem(selectedVariant.id)`, disabled while pending/out of stock/no variant selected
- Verified: `tsc --noEmit` clean, `next build` clean, dev server renders PDP/home with no runtime errors
- Deviation (flagged, not asked first — logging per workflow rule, revisit if it matters): root layout reading `cookies()` makes every route dynamic (`ƒ`) instead of the SSG/ISR called for in plan.md §3 non-functional reqs. Cart-per-session data is inherently request-time, and this matches how headless Shopify storefronts commonly handle it (e.g. Hydrogen); a Suspense/PPR split to keep PLP/PDP statically prerendered while streaming in cart state was scoped out as premature optimization for a pre-launch storefront. Revisit if LCP/TTFB becomes a real problem post-launch.
- No qty selector on PDP (defaults to 1) — quantity is adjustable from the cart drawer instead, kept PDP simple
- Fixup: base-ui `Button` dev warning ("expected a native `<button>`") on the checkout link — it renders a `<Link>` (`<a>`) via `render` prop; set `nativeButton={false}` on that Button to tell base-ui this is intentional. Cosmetic dev-console warning only, checkout was never broken.
- Noted (not a code issue): hosted Shopify checkout's store-name back-link goes to the shop's primary domain root, which still serves Shopify's default theme since no custom domain points at the Next.js app yet. Resolves itself at Phase 7 (domain connection) — nothing to fix now.
- Not done: customer accounts (Phase 5)
- **Phase 4 (cart & checkout) done.**
- Next up: Phase 6 — polish (SEO metadata, performance pass, accessibility audit)

## 2026-08-29 — Phase 5 skipped for now
- User decision: Shopify checkout supports guest checkout, so accounts aren't required to purchase. Skipping Phase 5 (hosted Customer Account flow) for now — revisit post-launch if repeat-customer demand shows up.
- No files touched.

## 2026-08-29 — Phase 6: SEO metadata + accessibility pass
- `src/lib/products.ts` — added `seo { title description }` to product/collection queries, `image` to collection query; reran codegen (`src/lib/generated/storefront.ts`)
- `src/lib/site.ts` — `SITE_URL` from `NEXT_PUBLIC_SITE_URL` (fallback `localhost:3000`); added to `.env.local.example`
- `src/app/layout.tsx` — `metadataBase`, title template (`%s | MAW-Choco-Shop`), default OG/Twitter card metadata; added a "Skip to content" link
- `src/app/products/[handle]/page.tsx` + `src/app/collections/[handle]/page.tsx` — `generateMetadata` per page (Shopify `seo` fields, falls back to title/description, OG image); PDP also emits `Product` JSON-LD (`AggregateOffer`, availability)
- `src/app/sitemap.ts`, `src/app/robots.ts` — new App Router routes, pull live products/collections for sitemap URLs
- Accessibility: cart drawer now `role="dialog"`/`aria-modal`/`aria-labelledby`, closes on Escape; both header `<nav>` landmarks labeled `aria-label="Primary"` (were duplicate unlabeled landmarks); `id="main-content"` added to each page's `<main>` for the skip link target
- Verified: `tsc --noEmit` clean, `next build` clean (sitemap.xml/robots.txt generate as static routes), live dev server check — PDP JSON-LD and `<title>` render correctly, sitemap/robots serve real collection/product URLs
- Also carried over two small pending style tweaks (uncommitted from a prior session): `globals.css` background `#FCF8F1` (was pure white), `product-card.tsx` image tile background `bg-white` (was `bg-muted`)
- Not done: performance pass (Lighthouse/bundle audit) — no production domain yet to test against realistically, revisit at/after Phase 7 launch
- **Phase 6 (SEO + accessibility) done**, performance sub-item deferred to launch.
- Next up: Phase 7 — domain connection, DNS, go-live checklist

## 2026-09-23 — Frontend reset / removal
- Deleted entire frontend implementation (`src/` directory and `.next/` build artifacts) per user instruction to prepare for rebuilding from scratch
- Files touched: deleted all files in `src/` (`src/app/*`, `src/components/*`, `src/lib/*`), deleted `.next/`
- Deviations from plan.md: Entire frontend removed to allow a full rebuild from scratch
- Next up: Scaffold and build frontend from scratch

## 2026-09-23 — Sweet Reverie Complete Homepage Build
- Rebuilt frontend from scratch matching user's design mockup and renewed Sweet Reverie brand identity (Deep Velvet Burgundy, Rose Peach, Warm Ivory, Espresso Noir)
- Google Fonts integration: Playfair Display for serif headings and Plus Jakarta Sans for sans typography
- Top announcement marquee ticker with delivery perks
- Brand header with navigation links (HOME, BEST SELLERS, SPECIAL OFFERS, CONTACT), centered logo badge, instant search modal trigger, user account link, and live cart count badge
- Dynamic hero carousel with Feel The Fire / Confectionery explosion slides, autoplay, controls, and CTA buttons
- "SHOP BY BRAND" section with notched ribbon banner and 18 brand logos from assets
- "NEW ARRIVALS" 5-column product grid with corner badges (Sale/New), dual pricing, and Quick Add to cart
- "SHOP BY CATEGORY" 5-column responsive grid with all 17 confectionery categories and double-border cards
- "SPECIAL OFFERS" luxury dark split banner with gold typography (Special Offers, Shop Now, upto 40% off) and product montage
- "OUR BEST SELLERS" 5-column product grid
- "JOIN OUR EMAIL LIST" newsletter subscription strip with integrated submit arrow button
- 4-column luxury dark footer with Sweet Reverie story, menu, policies, physical store address, and payment badges
- Slide-over interactive Cart Drawer with real-time quantity modifiers (+ / -), item removal, and subtotal calculation
- Floating green WhatsApp direct support button
- Verified clean build (`npm run build`), TypeScript checks (`npx tsc --noEmit`), and end-to-end browser screenshots
- Files touched: `src/app/*`, `src/components/*`, `src/lib/*`, `public/*`, `progress.md`
- Next up: Swap in final transparent logo from user and proceed with collection/PDP pages

## 2026-09-25 — Header logo + full-bleed hero banner slide
- Fixed hydration warning: browser extensions (Grammarly) inject `data-gr-*` attrs on `<body>` before hydration; added `suppressHydrationWarning` to `<body>` in `src/app/layout.tsx`
- Header logo (`src/components/site-header.tsx`): swapped white-badge JPEG for transparent PNG (`public/logo/sweet-reverie-no-bg.png`), several size/crop iterations landing on a cream circular badge (`bg-[#FAF7F2]`, 2px maroon border, 128px/144px mobile/desktop) with the logo at 95% width so the whole emblem fits inside without a gap
- Hero carousel (`src/components/hero-carousel.tsx`): now full-bleed (no max-width/padding/rounded corners) and fills the viewport height below the announcement bar + navbar (`min-h-[max(380px,calc(100svh-115px))]`)
- Added slide 1: user-supplied full-bleed banner image (`public/hero/exquisite-chocolate-reverie-v2.jpeg`, text/CTA baked into the image) — added optional `bgImage` field to the `HeroSlide` type that skips the gradient/badge/collage/button overlay when set, whole slide wraps in a `<Link>`. Existing "Feel the Fire" and "World of Sweet Wonders" slides now play second/third.
- Bug found + fixed: overwriting the hero image file in place didn't show up in the app — Next's `.next/cache/images` + browser cache both key on the unchanged filename. First tried a `?v=2` query string, but this Next.js version rejects query strings on local `next/image` src unless allow-listed in `next.config.ts` `images.localPatterns` — reverted to a versioned filename instead (`-v2`, bump to `-v3` etc. on next swap, documented inline in `hero-carousel.tsx`)
- Repo hygiene: deleted 6 stale tracked Playwright debug `.yml` snapshots under `.playwright-mcp/`, added `.playwright-mcp/` to `.gitignore`
- User preference logged to memory (not just this file): always ask permission before any Playwright/browser-automation call — see `~/.claude/projects/E--Ahmad-Waseem-Shopify-Store/memory/ask-before-playwright.md`
- Files touched: `src/app/layout.tsx`, `src/components/site-header.tsx`, `src/components/hero-carousel.tsx`, `public/logo/sweet-reverie-no-bg.png` (new), `public/hero/exquisite-chocolate-reverie-v2.jpeg` (new), `.gitignore`, `.playwright-mcp/*` (removed)
- Deviations: none from plan.md scope — visual/asset polish only
- Next up: swap in final logo/hero art if the client revises further; proceed with collection/PDP pages per plan.md Phase 3 remainder

