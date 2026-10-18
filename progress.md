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
## 2026-09-25 — Circular Favicon replacement with user's icon
- Replaced generated favicon with user's custom circular candy emblem from [assets/My-Logo/icon-sweet-reverie.ico](file:///e:/Ahmad-Waseem-Shopify-Store/assets/My-Logo/icon-sweet-reverie.ico)
- Updated [src/app/favicon.ico](file:///e:/Ahmad-Waseem-Shopify-Store/src/app/favicon.ico) and [public/favicon.ico](file:///e:/Ahmad-Waseem-Shopify-Store/public/favicon.ico) directly with the user's `.ico` file
- Synchronized all accompanying web and mobile icons (`src/app/icon.png`, `src/app/apple-icon.png`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`) using [assets/My-Logo/icon-sweet-reverie.png](file:///e:/Ahmad-Waseem-Shopify-Store/assets/My-Logo/icon-sweet-reverie.png)
- Verified active endpoints serving HTTP 200 OK
- Next up: Proceed with collection / PDP pages per plan.md Phase 3

## 2026-09-25 — Shop by Brand Header Banner
- Replaced the first section heading (`SectionBadge`) on the home page with the banner artwork from `assets/banners/shop-by-brand-banner.png`
- Placed the banner inside a luxury cream squared-rounded card (`bg-[#FAF7F2]`, 2px burgundy border `border-[#662A37]/25`, `rounded-2xl md:rounded-3xl`, soft drop-shadow)
- Optimized and saved image asset to `public/banners/shop-by-brand-banner.png`
- Files touched: `src/components/shop-by-brand.tsx`, `public/banners/*`, `progress.md`

## 2026-09-25 — Hero carousel: mobile crop, real CTA button, no autoplay
- Added a portrait `bgImageMobile` crop shown below `md`, full desktop image stays above `md`
- Replaced the whole-slide `<Link>` overlay with a positioned CTA button so the call-to-action is real accessible markup instead of baked into the banner image
- Removed the 6s auto-advance `setInterval` — carousel now advances only via the arrow controls
- Tagged the section `id="hero"` so the header's scroll-based logo-shrink measurement (`getElementById("hero")`) has a target
- Bumped hero banner to `-v3` filename (Next image cache-bust, same reason as the `-v2` bump) and added the new mobile crop
- Files touched: `src/components/hero-carousel.tsx`, `public/hero/exquisite-chocolate-reverie-v3.jpeg` (new), `public/hero/exquisite-chocolate-reverie-mobile-view.jpeg` (new)
- Deviations: none from plan.md scope — visual/UX polish only

## 2026-09-25 — Section banners rollout + burgundy palette
- Replaced the `SectionBadge` ribbon component with designed PNG banners for Shop by Category, Best Sellers, and New Arrivals (Shop by Brand got its banner in the prior session); deleted the now-unused `section-badge.tsx`
- Reworked `ShopByBrand` from a static grid into two infinite marquee rows (`animate-marquee` / new `animate-marquee-reverse` keyframe in `globals.css`)
- Recolored category pills, the product-card "Add to cart" button, footer background, and the special-offers banner to the burgundy palette (`#4A1A25` / `#662A37`), replacing the old pink/dark-brown mix
- Removed the unused duplicate logo asset (`public/logo/Sweet-Reverie-Confectionary-Store.jpeg`), superseded by the banner set
- Files touched: `src/app/globals.css`, `src/components/{shop-by-category,shop-by-brand,best-sellers-section,new-arrivals-section,product-card,site-footer,special-offers-banner}.tsx`, `src/components/section-badge.tsx` (deleted), `assets/banners/*`, `public/banners/*`
- Deviations: none from plan.md scope — visual polish only

## 2026-09-25 — Custom navbar icons
- Swapped `lucide-react`'s Search/User/ShoppingBag icons in `site-header.tsx` for inline SVG components matching the shapes supplied in `assets/icons/{search,profile,cart}.svg`, using `stroke="currentColor"` so existing hover/scale styling keeps working
- Menu/X stay on `lucide-react` — no matching custom icon was supplied for those
- Files touched: `src/components/site-header.tsx`, `assets/icons/{search,profile,cart}.svg` (new)
- Next up: swap in final logo/hero art if the client revises further; proceed with collection/PDP pages per plan.md Phase 3 remainder

## 2026-10-15 — Shopify collections restructure (store-side, no app code)
- Created 20 collections in Shopify matching the handles in `src/lib/categories.ts` + `new-arrivals`/`best-sellers`/`special-offers`; all smart collections with a product-tag rule equal to the handle. 13 imported via Matrixify (`shopify-import/collections-new.csv`), descriptions added to `candies-jellies`/`chewing-gums`
- Published all new collections to the `My Store Headless` channel (imports only landed on Online Store, so the Storefront API couldn't see them)
- Deleted 9 old collections (`chocolate`, `jelly`, `candy`, `biscuits`, `biscuits-1`, `chips`, `crisps`, `spread`, `coffee-drinks`); prior product membership saved in `shopify-import/old-collections-backup.json`
- Dev Dashboard app now has Admin scopes (`write_products`, `write_publications`); `SHOPIFY_CLIENT_ID`/`SHOPIFY_CLIENT_SECRET` in `.env` (gitignored), Admin token fetched via client-credentials grant (24h expiry)
- Storefront API verified: 21 collections visible (20 new + `frontpage`)
- Deviations: none from plan.md — store data only
- Next up: tag products so the new collections fill (all empty except `noodles`), then Shopify data wiring (plan.md Phase 2 rebuild)
- Follow-up: bulk-tagged all 32 products via Admin API (`tagsAdd`, one category tag each, mapped from old collection + product name). Matrixify had imported 13 collections as manual (rule columns ignored) — converted them (and `noodles`) to `TAG EQUALS <handle>` smart collections via `collectionUpdate`; `new-arrivals` sort Created desc, `best-sellers` sort Best selling
- Storefront counts: candies-jellies 9, chips-snacks 8, chocolate-bars 5, cookies-biscuits 4, noodles 2, chocolate-boxes/pouches/coffee-tea/beverages 1 each. Still empty (no matching products yet): chewing-gums, gifting, bundles, kids-section, baby-care, grocery, health-beauty, pet-care-food, new-arrivals, best-sellers, special-offers

## 2026-10-15 — Shopify data layer rebuilt + homepage on live data
- `src/lib/shopify.ts` — Storefront API `fetch` helper (60s `revalidate`, `shopify` cache tag for a future webhook `revalidateTag`); replaced `graphql-request` (uninstalled — plain `fetch` is needed for Next's cache options)
- `src/lib/products.ts` — `ProductCard` fragment, `CollectionProducts` + `Products` queries, `toProduct()` mapping to the existing UI `Product` type (first-variant price, "Sale" badge when compare-at > price, logo placeholder when no image); `getNewArrivals` / `getBestSellers` use the `new-arrivals` / `best-sellers` collections, falling back to newest / best-selling sort while empty (user choice)
- `codegen.ts` — documents now just `src/lib/products.ts`; custom scalars mapped to `string`; regenerated `src/lib/generated/*`
- Homepage New Arrivals / Best Sellers sections are async server components on live data (hide if empty); homepage prerenders static with 1m ISR
- Search modal now queries Shopify via `src/lib/search-actions.ts` server action (250ms debounce) instead of mock arrays
- `src/lib/products-data.ts` → `src/lib/brands.ts` (mock product arrays deleted, brand logos kept — no brand data in Shopify yet)
- Verified: `tsc --noEmit`, `next build` clean; prerendered homepage contains live Shopify products/CDN images
- Known: both sections show the same 10 products until the client tags products into `new-arrivals`/`best-sellers` or real sales accrue. Pre-existing ESLint error in `cart-context.tsx` (`set-state-in-effect`, localStorage hydrate) left alone — that file gets replaced in Phase 4
- Deviations: none from plan.md
- Next up: collection page `/collections/[handle]` (category tiles currently 404), then PDP, then Shopify cart (Phase 4)

## 2026-10-15 — Collection page (`/collections/[handle]`), grid only
- `src/app/collections/[handle]/page.tsx` — burgundy title strip (`#4A1A25`, gold serif title, Shopify description if set) + 5-col product grid (same breakpoints as homepage sections); `notFound()` for unknown handles; `generateMetadata` from collection title/description; `generateStaticParams` returns `[]` so each collection renders on first visit then serves via ISR
- `src/components/collection-grid.tsx` — client grid, 20 per page, "Load more" button appends next page via `src/lib/collection-actions.ts` server action (cursor-based); empty-state message for collections with no products
- `src/lib/products.ts` — `CollectionProducts` query now takes `$after` and returns `title`, `description`, `pageInfo`; new `getCollectionPage()`; regenerated codegen types
- Verified: `next build` clean, ESLint clean on new files; prod server: `candies-jellies` 200 with 9 products, `chewing-gums` 200 with empty state, unknown handle 404; cursor paging verified against live Storefront API (4+4+1 = 9, no dupes). "Load more" button itself not clicked in a browser — no collection exceeds 20 products yet
- Deviations: none. User choices: burgundy banner strip header, Load more paging, filters/sorting deferred
- Next up: product detail page `/products/[handle]` (cards link there, currently 404); filters/sort on collection page later

## 2026-10-15 — Product page (`/products/[handle]`)
- `src/app/products/[handle]/page.tsx` — breadcrumb (Home / first collection / product), two-column layout (stacks on mobile), "You may also like" row (up to 5 products from the same collection + View all); `notFound()` for unknown handles; `generateMetadata` from Shopify SEO fields/description + OG image; `generateStaticParams` returns `[]` (on-demand ISR, same as collection page)
- `src/components/product-detail.tsx` — client buy box: image gallery (thumbnails only when >1 image), per-option variant picker (only options with >1 value; switching jumps to the variant's image), price + compare-at with Sale badge, In/Out of stock pill, quantity stepper, Add to cart (disabled when out of stock), "Order on WhatsApp" link prefilled with quantity + title, `descriptionHtml` render (store-admin content)
- `src/lib/products.ts` — `ProductPage` query + `getProductByHandle()`, `ProductDetail` type; `PLACEHOLDER_IMAGE` exported; regenerated codegen
- `src/components/floating-whatsapp.tsx` — number pulled into exported `WHATSAPP_NUMBER`, reused by PDP
- Add to cart still uses the local cart (keyed by variant id) — replaced by Shopify cart lines in Phase 4
- Verified: `next build` + ESLint clean; prod server: product 200, unknown handle 404; Playwright: qty 2 → Add to cart opens drawer with "Your Cart (2)", WhatsApp link prefilled; desktop + 390px mobile screenshots look right
- Known: all 32 products currently have 1 image, 1 variant, no description, so gallery thumbs / variant picker / description are hidden until that data exists in Shopify (code paths built but not exercised with real data). Header's `/account` link prefetch 404s (pre-existing; Phase 5)
- Deviations: none. User choices: two-column cream layout; extras = quantity selector, breadcrumb, related row, WhatsApp order button
- Security (RESOLVED 2026-10-18, see below; was open, flagged by automated review): `product-detail.tsx` renders Shopify `descriptionHtml` unsanitized via `dangerouslySetInnerHTML` (stored XSS risk). Only Shopify admin staff or apps with `write_products` can author it — same trust level as Shopify's own themes — so exploitation needs a compromised staff account/app. Fix: sanitize server-side in `getProductByHandle` with an allowlist (`sanitize-html`: p, ul/ol/li, strong/em, br, h2–h4, a with http/https only). Planned for Phase 6 unless done sooner
- Next up: Phase 4 — Shopify cart (cart ID cookie, cart mutations, drawer on Shopify data, `checkoutUrl` redirect)

## 2026-10-15 — 100 products imported to Shopify (store-side, no app code)
- Matched `assets/My-Products-Images` (455 files) to `data-import/candyshop_products.csv` for title/price/weight. The CSV's image links are unreliable (e.g. `A5.jpeg` labeled "Wrigleys Extra White" is Trident Watermelon), so a pick needs filename≈title similarity ≥0.75 or was checked by eye. All 100 picks checked on contact sheets
- Selection (`shopify-import/select-products.py` → `shopify-import/products-batch-1.csv`): skip titles already in store, keyword → category tag (one per product), round-robin ~10 per category, brands interleaved. User asked for ~100, not all
- Upload (`shopify-import/upload-products.py`): Admin token via client-credentials, staged image upload, `productSet` keyed by handle (idempotent re-run), ACTIVE, price from CSV (PKR), weight in grams when known, tracked inventory 100 at "Nishtar Block", deny oversell; published to Online Store + My Store Headless (not POS)
- App scopes expanded (user released new version + approved on store): inventory/locations, discounts, shipping, content, legal policies, navigation, metaobject definitions, orders. Note: `write_metaobjects` (entries, not definitions) and Storefront `unauthenticated_read_metaobjects`/`read_content` did not show up in the granted list — re-add if brand metaobjects are built
- Storefront token still can't read `quantityAvailable` (denied) — the public token is from a separate credential; fine, UI only uses `availableForSale`
- Result: 132 products on Storefront. Collections: candies-jellies 20, chips-snacks 18, chocolate-bars 15, cookies-biscuits 14, beverages 12, chocolate-pouches 11, chewing-gums 10, grocery 10, noodles 12 (was still indexing), health-beauty 6, chocolate-boxes 3, coffee-tea 1. Still empty: gifting, bundles, kids-section, baby-care, pet-care-food, new-arrivals, best-sellers, special-offers
- Product images/prices come from another shop's site (assets.indolj.io scrape) — client should confirm they're OK to use before launch
- Deviations: none from plan.md — store data only
- Next up: Phase 4 — Shopify cart

## 2026-10-15 — Phase 4: Shopify cart + checkout handoff
- `src/lib/cart-actions.ts` — server actions `getCart` / `addToCart` / `updateCartLine` / `removeCartLine` (Storefront `cartCreate`, `cartLinesAdd/Update/Remove`, `userErrors` thrown). Cart ID in an httpOnly, SameSite=Lax `cartId` cookie (10-day max-age, secure in prod), set only when a cart is created; a missing/expired/checked-out cart is recreated on next add
- `src/lib/shopify.ts` — `shopifyFetch(query, vars, { cache: false })` uses `no-store` so per-user cart data is never cached or shared
- `src/lib/cart-context.tsx` rewritten: holds the Shopify cart returned by each action (no localStorage), `useTransition` pending flag, error message; loads the cart on mount (keeps homepage/collection/product pages static)
- `cart-drawer.tsx` on Shopify data: buttons disabled while pending, "Updating your cart..." on first add, error line, checkout button → `window.location.assign(cart.checkoutUrl)` (replaces the `alert` stub)
- `Product` gets `variantId` (first variant) so card quick-add sends a merchandise ID; card button disabled + "Sold out" when `!availableForSale`. PDP adds `variant.id` × quantity. `CartLineItem.id` is now the Shopify line ID
- `codegen.ts` documents include `cart-actions.ts`; regenerated types
- Verified: `tsc`, ESLint (clean — pre-existing `set-state-in-effect` error gone with the old context), `next build` (home still static/ISR). Prod server + Playwright: card add → drawer "Your Cart (1)"; + → 2; navigate to PDP, add → 3 (persists via cookie); remove, −, − to empty state; checkout redirects to `eakhun-ed.myshopify.com/checkouts/...` "Checkout - My Store". No order placed
- Known: Next segment prefetch 404s for not-yet-generated ISR pages and `/account` in console (pre-existing, unrelated). Old `sweet_reverie_cart_items` localStorage key is just ignored
- Deviations: none from plan.md. Small UI addition: "Sold out" state on product card add button
- Next up: Phase 5 — link to Shopify hosted Customer Account flow (`/account` currently 404s)

## 2026-10-15 — Phase 5: Accounts (Shopify-hosted)
- `src/components/site-header.tsx` — account icon now links to `https://<store>.myshopify.com/account` (`ACCOUNT_URL`), which Shopify redirects to the store's new Customer Accounts login (`shopify.com/80205611157/account`). Was `/account` (404). Icon now visible on phones too; mobile menu gets a "MY ACCOUNT" item (user choice: both)
- `shop.customerAccountUrl` from Storefront API is `null` (only set with a customer-account vanity domain), so the store-domain redirect is used instead
- No logged-in/out indicator: the hosted flow's session lives on shopify.com, the headless site can't see it without the Customer Account API OAuth (out of scope per plan.md §8)
- Exit point: Shopify's account pages link back to the store's primary domain — set when domain is connected in Phase 7 so it returns to this site, not the Online Store theme
- Verified: `tsc`, ESLint, `next build`; prod server + Playwright at 390px: account icon click lands on Shopify customer login (`shopify.com/authentication/80205611157/oauth/authorize`)
- Deviations: none
- **Phase 5 done.** Next up: Phase 6 — polish (SEO, performance, accessibility, sanitize `descriptionHtml`), or the leftover Phase 3 items (collection filters/sort, static pages)

## 2026-10-18 — Phase 6: sanitize product `descriptionHtml` (stored-XSS fix)
- `src/lib/sanitize.ts` — `sanitizeDescription()` via `sanitize-html` allowlist: p, ul/ol/li, strong/em/b/i, br, h2–h4, a (`href` only, http/https schemes, no protocol-relative; `target` and all other attributes stripped). Everything else removed, `<script>`/`<style>` contents dropped
- `src/lib/products.ts` — `getProductByHandle()` returns the product with `descriptionHtml` sanitized server-side, so `product-detail.tsx`'s `dangerouslySetInnerHTML` only ever sees clean HTML (component unchanged)
- Deps: `sanitize-html`, `@types/sanitize-html` (dev)
- `scripts/check-sanitize.mjs` — assertion check (`node --experimental-strip-types scripts/check-sanitize.mjs`): `<script>`, `onerror=`/`onclick=`, `<img>`, `javascript:` href and `target` stripped; allowed tags + https link survive
- Verified: check passes, `tsc --noEmit`, ESLint (0 errors; pre-existing unused-var warning in `build-favicons.mjs`), `next build` clean
- **Security item from 2026-10-15 Product page entry resolved**
- Deviations: none from plan.md
- Next up: rest of Phase 6 polish (SEO, performance, accessibility) or leftover Phase 3 items (collection filters/sort, static pages)
