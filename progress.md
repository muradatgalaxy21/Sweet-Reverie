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
