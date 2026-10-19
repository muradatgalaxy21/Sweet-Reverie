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

## 2026-10-18 — Phase 6: SEO basics (sitemap, robots, canonical, Product JSON-LD)
- `src/app/sitemap.ts` — homepage + every collection + every product from the Storefront API (`Sitemap` query, products paginated 250/page via cursor), `lastModified` from Shopify `updatedAt`. Live: 154 URLs (1 home, 21 collections, 132 products)
- `src/app/robots.ts` — allow all, `Sitemap:` line points at `<SITE_URL>/sitemap.xml`
- `src/lib/utils.ts` — `SITE_URL` from `NEXT_PUBLIC_SITE_URL`, falls back to `http://localhost:3000` (already in `.env.local.example`; set the real domain in Phase 7)
- `src/app/layout.tsx` — `metadataBase` from `SITE_URL`; title is now `{ default, template: "%s | Sweet Reverie" }`; `twitter.card = summary_large_image`; dropped the hardcoded OG title/description so og:/twitter: title + description follow each page's own (collection pages were inheriting the homepage OG title)
- Collection + product `generateMetadata` — `alternates.canonical` (`/collections/<handle>`, `/products/<handle>`)
- `src/app/products/[handle]/page.tsx` — Product JSON-LD (name, images, plain-text description, sku if set, url, Offer with price/currency/availability) for the first variant; serialized with `<` escaped to `<`
- `src/lib/products.ts` — `ProductPage` query adds variant `sku` and `price.currencyCode` (query only, no logic change); `codegen.ts` documents include `src/app/sitemap.ts`; regenerated types
- Verified: `tsc --noEmit`, ESLint (0 errors, 1 pre-existing warning in `scripts/build-favicons.mjs`), `next build` (robots/sitemap static, sitemap 1m ISR). Prod server: `/robots.txt`, `/sitemap.xml` 200; product page has JSON-LD (`priceCurrency: PKR`, `InStock`), canonical, `Title | Sweet Reverie`; collection page canonical + own og:title
- Known: products have no SKUs/descriptions yet, so those JSON-LD fields are omitted. Product pages set their own `openGraph` (image), which replaces the root one, so og:site_name/locale/type aren't on PDPs. Sitemap includes Shopify's default `frontpage` collection and empty collections. No default OG image yet. Sitemap pagination loop not exercised live (132 < 250)
- Deviations: none from plan.md
- Next up: rest of Phase 6 — performance + accessibility pass

## 2026-10-18 — Phase 6: Shopify webhook revalidation
- `src/app/api/revalidate/route.ts` — POST handler for Shopify webhooks. Checks `X-Shopify-Hmac-Sha256` (base64 HMAC-SHA256 of raw body, `timingSafeEqual`) against server-only `SHOPIFY_WEBHOOK_SECRET`; 401 on bad/missing signature, 500 if secret unset. For products/*, collections/* (create/update/delete) and `inventory_levels/update` it calls `revalidateTag("shopify", "max")`; other topics are 200-acked and ignored
- `src/lib/shopify.ts` — fallback revalidate 60s → 3600s (safety net for missed webhooks only, per plan.md §3 "webhook, not polling"); comments in collection/product pages updated
- `.env.local.example` — `SHOPIFY_WEBHOOK_SECRET`
- Verified: `tsc --noEmit`, ESLint (0 errors, pre-existing warning), dev server + curl: valid signature → 200 `revalidated:true`; non-storefront topic → 200 ignored; bad, tampered-body and missing signature → 401. Not verified against the live store (no Shopify creds in this session) or a public URL
- **Setup needed (user):** Shopify admin → Settings → Notifications → Webhooks → create webhooks (JSON) for the topics above pointing at `<SITE_URL>/api/revalidate`; copy the signing key shown there into `SHOPIFY_WEBHOOK_SECRET` (local `.env` + Vercel). Needs a public URL, so realistically Phase 7 / first Vercel deploy
- Known: one tag for everything, so any change marks all pages stale (fine at ~130 products). With `"max"`, the first visitor after a change sees the old page once while it regenerates. Price changes in variant-only edits arrive as `products/update`, so they're covered
- Deviations: fallback interval change (60s → 1h) — implements plan.md §3 rather than deviating from it
- Next up: Phase 6 performance pass

## 2026-10-18 — Phase 6: performance pass (images)
- **Hero art direction** (`hero-carousel.tsx`): mobile + desktop hero were two `<Image priority>` toggled by CSS, so every device downloaded both. Now an `ArtDirectedImage` `<picture>` (via `getImageProps`, `md` breakpoint) — browser fetches only the matching source; slide 1 gets `loading="eager"` + `fetchPriority="high"`. Slides without a mobile crop use `<Image fill sizes="100vw" preload>`
- **`sizes` on every `fill` image** (default is 100vw, so tiles were downloading viewport-width images): product card (all 2/3/5-col grids in `max-w-7xl` → 256px cap), category tiles, brand logos 160px, special offers 224px, hero collage 96/144px, search 48px, cart 64px
- **Section banners** (best sellers, new arrivals, categories, brands): 2300px intrinsic with no `sizes` → served the 3840w variant into a ≤512px slot. Added `sizes` matching `max-w-xs/md/lg`
- Removed `priority` from the below-the-fold Shop by Brand banner (was competing with hero for bandwidth); `priority` → `preload` on header logo + PDP main image (`priority` deprecated in Next 16)
- Verified: `tsc`, ESLint (0 errors). Dev server + Playwright (DPR 2) on a throwaway page rendering hero + category grid (homepage needs Shopify creds, not in this session): mobile 412 → 288KB (-30%), desktop 1043 → 471KB (-55%); each viewport now fetches only its own hero. Before/after screenshots render identically
- **Not measured:** real LCP (needs live data + a deployed URL; plan target < 2.5s), product-card savings on homepage/PLP/PDP (needs Shopify data). Run Lighthouse/PageSpeed on the Vercel preview
- **Pre-existing, not changed (design call for user):** desktop hero image is ~2.5:1 but its box is `100svh - 115px` tall, so at 1440×900 `object-cover` crops the headline's left edge ("…QUISITE …OCOLATE")
- `site-header.tsx` is CRLF — edited preserving line endings
- Deviations: none
- Next up: accessibility audit (Phase 6), then Phase 3 leftovers (filters/sort, static pages)

## 2026-10-18 — Phase 6: accessibility audit
- **Dialogs** — new `src/lib/use-dialog.ts` (Escape closes, focus moves in on open — `data-autofocus` element or the panel — Tab/Shift+Tab trapped, focus returns to the opener). Cart drawer + search modal: `role="dialog"`, `aria-modal`, labelled; search also closes on backdrop click (cart already did), input labelled, `role="status"` "N results" announcement; cart +/−/remove labels name the item
- **Keyboard/focus** — skip-to-content link (layout; `#main-content` focusable); global `:focus-visible` ring (burgundy, gold inside `data-focus="light"` dark sections: footer, cart header, special offers) in `@layer base` so components with their own focus style keep it; removed `focus:outline-none` from the mobile menu toggle
- **Header** — mobile menu toggle `aria-expanded`/`aria-controls`, menus are labelled `<nav>`s; cart button label includes item count, badge `aria-hidden` + `motion-safe:animate-pulse`
- **Broken nav (bug fix)** — header/footer `#best-sellers` / `#special-offers` / `#new-arrivals` / `#categories` links only worked on the homepage; now `/#…`
- **Product card** — image link removed from tab order (duplicate of title link), image `alt=""` (title is adjacent); "Add to cart"/"Sold out" carry the product title as sr-only text; sr-only "Original price"/"Sale price"
- **PDP** — same price labels, stock badge `aria-live`, active thumbnail `aria-current`
- **Hero** — labelled carousel region, decorative collage `alt=""`, dots `aria-current` and 24px hit area (dots look the same; spacing 8px → 14px)
- **Motion** — marquees stop under `prefers-reduced-motion`; announcement bar's duplicated loop copy `aria-hidden` (screen readers read it once)
- **Contrast** — strikethrough prices stone-400 → 500/600, cart/search helper text stone-400/500 → 500/600, WhatsApp outline text #128C3E → #0E7A35 (all AA now)
- Newsletter: input labelled + `autoComplete="email"`, thank-you message in `role="status"`. Special Offers: two `<h2>`s → one heading (same look)
- Verified: `tsc`, ESLint (0 errors). axe-core (WCAG 2.0/2.1/2.2 A+AA) via Playwright at 390px and 1440px on a throwaway page rendering all sections + product cards + PDP with fixture data, page / search open / cart open: **only remaining violation is the held item below**. Keyboard run: skip link first, search + cart trap Tab, Escape closes, focus returns to opener; mobile menu `aria-expanded` toggles. Screenshots checked. Not run against live Shopify data / `next build` (no creds in session)
- **HELD — needs user design call:** hero slide 1 "SHOP ALL CHOCOLATES" button, white on `#F2871A` = 2.54:1 (AA needs 4.5:1). Options: black text on the same orange (~8:1, no colour change), or darken to ~`#B45309` with white text
- **Not done / found:** footer policy links (`/privacy-policy`, `/shipping-policy`, `/refund-policy`, `/terms-of-service`) 404 — Phase 3 static pages. Newsletter form is UI-only (no backend). Variant buttons/qty are fine; no screen-reader (NVDA/VoiceOver) manual pass done
- Deviations: none from plan.md. Small visible changes: focus rings on keyboard focus, slightly darker grey/green text, search box 40px narrower so it no longer overlaps the close button
- Next up: Phase 6 remaining → user's call on held hero contrast + hero crop; then Phase 3 leftovers (filters/sort, static pages) / Phase 7

## 2026-10-18 — Phase 6: SEO leftovers + availability review
- `src/lib/utils.ts` — `OPEN_GRAPH_DEFAULTS` (type/locale/siteName); used by root layout and spread into the PDP `openGraph`, so product pages now carry og:site_name/locale/type again (they were dropped because a page-level `openGraph` replaces the root one)
- `src/app/sitemap.ts` — drops Shopify's default `frontpage` collection
- Verified: `tsc`, ESLint (0 errors); dev server: root og:site_name/locale/type still rendered. PDP og not checked live (needs Shopify data)
- **Held:** dropping empty collections from the sitemap needs a query change → `npm run codegen` needs the Storefront token (not in this session). No default OG image (needs an asset from user)
- **Availability review (plan.md §3), held for user:** pages are ISR, so a Shopify outage during revalidation keeps serving the last good page — catching errors per section would be worse (it would cache a degraded page for up to 1h). Real gap: no `app/error.tsx` / `app/not-found.tsx`, so a first-ever render that fails, or any 404 (incl. footer policy links), shows Next's unbranded default page. Both are new UI + copy → needs user's design/copy call per CLAUDE.md
- Deviations: none
- Next up: user decisions on held items (hero CTA contrast, hero desktop crop, error/404 pages); then Phase 3 leftovers (filters/sort, static pages) and Phase 7 launch

## 2026-10-18 — Phase 6: held items resolved (hero contrast + crop, error/404 pages)
- User decisions: (1) hero CTA black text, (2)+(3) "choose best" delegated to Claude, (4) empty-collection sitemap filter skipped for now, (5) OG image — asked which type (answered in chat)
- `hero-carousel.tsx` — slide 1 CTA `text-white` → `text-black` on `#F2871A` (2.54:1 → ~8:1, AA pass, brand orange unchanged). Desktop hero `md:object-left`: the 3264×1312 (~2.5:1) banner was centre-cropped into a ~1.8:1 box, cutting the headline; now crop comes off the right (product edge) only. Kept full-viewport hero height (no per-slide height jump). Checked 1024×768, 1280×720, 1440×900, 1920×1080, 2560×1440; mobile unchanged (portrait image)
- `src/app/not-found.tsx` — branded 404 (serif heading, Back to home, 6 popular category links), title "Page not found". Covers unknown URLs (incl. the 4 footer policy links until static pages exist) and `notFound()` for missing products/collections
- `src/app/error.tsx` — branded error boundary (Next 16.3 `retry` prop): Try again, Back to home, WhatsApp order link; logs the error. Only shows when a page has no cached copy (ISR keeps last good page otherwise)
- Verified: `tsc`, ESLint (0 errors). Dev server + Playwright: `/privacy-policy` → 404 status + branded page; `/products/x` with Shopify unreachable → 500 + branded error page; axe (WCAG 2.2 AA) clean on both at 390/1440; screenshots checked
- Deviations: none from plan.md
- Next up: OG image (asset from user); Phase 3 leftovers (filters/sort, static pages); Phase 7 (Vercel project + env vars + Shopify webhooks + domain)

## 2026-10-18 — Phase 3: policy pages (Shopify-managed text)
- User decisions: build policy pages next; text comes from Shopify admin → Settings → Policies (not hardcoded)
- `src/lib/policies.ts` — `ShopPolicies` query (all 4 policies, one cached request), `getPolicy(handle)` → null if the policy is empty in Shopify. `src/lib/sanitize.ts` — `sanitizePolicy` (description allowlist + `u`, and `mailto:`/`tel:` links)
- `src/app/policies/[handle]/page.tsx` — burgundy title strip (same as collection page) + policy body. Handles: `privacy-policy`, `shipping-policy`, `refund-policy`, `terms-of-service`, prerendered at build, `dynamicParams = false` (anything else 404s); empty policy → 404
- Footer policy links `/privacy-policy` etc. → `/policies/privacy-policy` etc. Matches Shopify's own `/policies/<handle>` URLs, which checkout and emails link to on the primary domain — so those resolve here after Phase 7 domain connection
- `codegen.ts` documents += `src/lib/policies.ts`. **Generated types (`ShopPolicyFieldsFragment`, `ShopPoliciesQuery`) hand-written** into `src/lib/generated/storefront.ts` in codegen's format (no token in session) — run `npm run codegen` next session with creds to confirm no diff
- Verified: `tsc`, ESLint (0 errors). Dev server with mocked Storefront response: set policies 200 with correct `<title>`, null/blank policies and unknown handles 404; `<script>`, `javascript:` href, `onerror` stripped, `mailto:` kept; 390px screenshot OK, no horizontal scroll. **Not verified against live Shopify** (no creds) — policies must actually be filled in Shopify admin or the pages 404
- Known: policy edits don't fire the product/collection webhooks, so changes show within the 1h ISR safety net. Policy pages not in sitemap (low SEO value)
- Deviations: none from plan.md
- Next up: fill policies in Shopify admin if empty + run codegen; About/Contact/FAQ (needs copy from user); collection filters/sort; OG image; Phase 7

## 2026-10-18 — Storefront token made server-only (Vercel warning)
- Vercel flagged `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` ("public prefix exposes value to the browser"). Every Storefront call already runs server-side (server components, server actions, route handlers — no client module imports `shopify.ts`), so the prefix only leaked the token into the client bundle for no reason
- Renamed to `SHOPIFY_STOREFRONT_TOKEN` in `src/lib/shopify.ts`, `codegen.ts`, `.env.local.example`, README. `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` stays public (header account link uses it client-side; a domain isn't secret)
- **Approved deviation (user request, 2026-10-18):** plan.md §3/§6 + CLAUDE.md said the Storefront token is public/client-side with `NEXT_PUBLIC_`; updated both to server-only
- Verified: `tsc`, ESLint (0 errors); dev server with only `SHOPIFY_STOREFRONT_TOKEN` set: page renders, no client-side errors / "Missing env" throw, search server action runs server-side
- **User action:** rename the variable in local `.env` and in Vercel (delete the `NEXT_PUBLIC_` one), then redeploy

## 2026-10-18 — fix: mobile homepage LCP (live measurement)
- Live site (sweet-reverie.vercel.app) measured with Playwright, slow 4G (1.6 Mbps, 150 ms RTT) + 4× CPU, 390px @3x: homepage LCP 5.8s (target < 2.5s); collection 1.5s, PDP 2.1s, desktop all ≈0.6s
- Cause: bandwidth contention, not server: image optimizer TTFB 60–600 ms, but ~960 KB (25+ images: brand logos, banners, product cards) downloaded alongside the 128 KB mobile hero, which finished only when nearly everything else had
- `hero-carousel.tsx` — mobile `<source>` + img `sizes="70vw"` → phones get the 828w variant (80 KB vs 128 KB at 1200w)
- `fetchPriority="low"` on below-the-fold images: 4 section banners, brand logos, category tiles, special-offers montage
- `site-header.tsx` — logo `sizes` 130px → `(min-width: 768px) 130px, 72px` (preloaded on every page; mobile shows ≤71px)
- Verified: `tsc`, ESLint (0 errors); re-measure on live after deploy (see next entry / chat)
- Round 1 result on live (Playwright, DevTools throttling): 5.8s → 5.2s only. DevTools throttling splits bandwidth evenly across requests, ignoring priority, so it overstates contention. Lighthouse 12 (PageSpeed's engine, simulated throttling) on live: homepage LCP 2.4–2.6s (score 89–98), collection 2.1s, PDP 1.8s — homepage borderline
- Lighthouse LCP breakdown: largest part is resource *load delay* (~780 ms): hero discovered in HTML but requested after CSS/fonts
- Round 2: `hero-carousel.tsx` — `ReactDOM.preload()` for slide 1 with `media` (`(max-width: 767px)` mobile srcset @70vw, `(min-width: 768px)` desktop @100vw), `fetchPriority="high"` → hero request starts in `<head>`. Verified locally: two media-scoped preload links, 390px fetches only the mobile hero, 1440px only the desktop one
- **Result (Lighthouse 12 mobile, live, after round 2):** homepage LCP 2.1/2.4/2.4s, score 95–99 (was 2.4–2.6s, 89–98); collection 1.7s (100); PDP 2.2s (98). All pages under the plan.md §3 2.5s target
- Next up: user — fill shipping/refund/terms policies in Shopify, Shopify webhooks + `SHOPIFY_WEBHOOK_SECRET`, OG image, domain; then Phase 3 leftovers (filters/sort, About/Contact/FAQ)

## 2026-10-19 — Phase 3: collection filters + sort
- User decisions: price + product type filters; sidebar on desktop, drawer on mobile; type filter driven by Shopify filter data and hidden until a collection has 2+ types (products currently have **no product type** set — collections are tag-based — so it stays hidden everywhere until store-side setup below)
- `src/lib/collection-query.ts` — URL ↔ query: `?sort=best-selling|newest|price-asc|price-desc` (none = "Featured" = Shopify's collection order), `?type=` (repeatable, OR-ed), `?min=`/`?max=`. Parser drops invalid values (shared with the server action, which gets untrusted input); maps to Storefront `sortKey`/`reverse`/`filters`
- `src/lib/products.ts` — `CollectionProducts` query takes `sortKey`, `reverse`, `filters` and `filters @include(if: $withFilters)`; `getCollectionPage(handle, { query, after, withFilters })` returns `filterOptions` (types from `filter.p.product_type`, price span from `filter.v.price`). Homepage shelves unchanged (defaults = old behaviour)
- `src/lib/collection-actions.ts` — `loadMoreProducts` → `loadCollectionProducts(handle, search, after?)` (filtered pages + Load more)
- `src/components/collection-browser.tsx` (replaces `collection-grid.tsx`) — desktop sidebar (price min/max + Apply, type checkboxes, Clear all), mobile "Filters" button with active-count badge → left drawer (`useDialog`, scroll lock, Show results), Sort select on both; grid 5 → 4 columns at `lg` to fit the sidebar. Filter/sort changes `history.replaceState` the URL and fetch via server action (stale responses dropped); grid dims + `aria-busy` while loading, sr-only status, error alert, "No products match" + Clear filters
- **Page stays static (ISR):** URL is read client-side (`useSearchParams` in a Suspense boundary whose fallback is the default view), so the static HTML is the unfiltered first page and a shared filtered link fetches its results after load. Reading `searchParams` on the server would have made every collection page dynamic
- `generateMetadata` passes the same args as the page so both share one Storefront request (was making two after the change)
- `codegen.ts` unchanged; **generated types for `CollectionProducts` hand-edited** (no token in session) — run `npm run codegen` with creds to confirm no diff
- Verified: `tsc`, ESLint (0 errors), `next build` (collection route still ● SSG). Mocked Storefront (30 products, 3 types) + Playwright at 1440 and 390@2x, dev and `next start`: type/price/sort update URL + results, sort order correct, Clear all keeps sort and resets inputs, Load more appends with filters, reloaded filtered URL restores checkboxes/select and fetches, invalid params ignored, empty result message, error alert on Storefront failure, type section hidden with no types, drawer focus trap + Escape returns focus, no horizontal scroll, axe WCAG 2.2 AA clean (desktop + open drawer). Static HTML served for filtered URLs is a cache HIT. **Not verified against live Shopify** (no creds) — real filter ids/inputs are from Shopify docs
- **User action for the type filter to appear:** (1) set Product type on products (Shopify admin bulk editor, or an Admin API script next session), (2) Shopify admin → Apps → Search & Discovery → Filters → add "Product type", (3) publish. Price filter needs nothing (enabled by default)
- Known: filtered results aren't in the static HTML (fine — filtered URLs aren't canonical/indexed). Filter changes replace (don't push) history, so Back leaves the page
- Deviations: none from plan.md (plan.md §2.1 checkboxes updated: PLP, plus Search and Customer accounts which were already built)
- Next up: codegen with creds; product types + Search & Discovery setup; About/Contact/FAQ (needs copy); OG image; Phase 7

## 2026-10-19 — Fonts: logo-style headings (Marcellus) + one body font
- User decisions: match the logo lettering; user identified it as Friz Quadrata (paid licence) → free lookalike **Marcellus** (Google Fonts); logo font for display headings only, Plus Jakarta Sans (the price font) for everything else
- `layout.tsx` — Playfair Display → Marcellus (`--font-marcellus`, weight 400 only). `globals.css` — `--font-serif` → Marcellus; dropped the global `h1–h4 → serif` rule, so the display font is opt-in via `font-serif` (page titles: collection/PDP/policy/404/error, PDP "You may also like", Special Offers, footer wordmark). Small headings now render in Jakarta: product card titles, footer column labels, cart drawer title/items, search modal labels, newsletter heading, filter labels. `.font-serif` gets `font-synthesis-weight: none` so `font-black` on a one-weight font doesn't produce a smeared fake bold
- `collection-browser.tsx` — removed the two `font-sans` overrides that only existed to cancel the old global serif rule
- Verified: `tsc`, ESLint (0 errors). Mocked Storefront + Playwright before/after at 1440 and 390: home (incl. Special Offers, newsletter, footer), collection, PDP, 404, cart drawer — no page errors, layouts unchanged apart from the type
- Known: Marcellus has one weight, so the footer "SWEET REVERIE" wordmark is lighter than before (was Playfair Black) and lighter than the logo. No italic either — Special Offers "upto/off" use the browser's slanted version
- Deviations: none from plan.md
- Next up: same as previous entry (codegen with creds, product types + Search & Discovery, About/Contact/FAQ copy, OG image, Phase 7)
