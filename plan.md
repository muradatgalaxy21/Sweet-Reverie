# Candy Shop — Headless Storefront (Next.js + Shopify)

## 1. Project Overview

**Goal**: Rebuild the storefront frontend fully custom in Next.js, using Shopify as the backend (inventory, orders, customers, payments) via the Storefront API.

**Architecture**:
```
Next.js frontend (custom design, own pages/components)
        ↓ GraphQL (Storefront API)
Shopify backend (products, inventory, orders, customer accounts)
        ↓ at checkout
Shopify hosted checkout (payment processing)
```

**Non-goals for v1**: custom checkout page UI (requires Shopify Plus), multi-location inventory logic, subscriptions, B2B.

---

## 2. Functional Requirements

### 2.1 Storefront
- [x] Home page — hero, featured collections, featured products
- [ ] Product Listing Page (PLP) — per collection, built; filtering (price, tags/type) and sorting (price, newest, best-selling) not yet added
- [x] Product Detail Page (PDP) — images, variants (size/flavor/etc.), price, description, add-to-cart, stock status
- [ ] Search — product search across catalog
- [ ] Cart — drawer or page, add/update/remove line items, persists across sessions (cookie/localStorage cart ID)
- [ ] Checkout handoff — redirect to Shopify-hosted checkout via `cart.checkoutUrl`
- [ ] Customer accounts — login/signup, order history, saved addresses (via Shopify Customer Account API or hosted flow)
- [ ] Static pages — About, Contact, Shipping/Returns policy, FAQ
- [x] Collections/category navigation

### 2.2 Backend (Shopify-managed, no custom build needed)
- [ ] Product catalog + variants
- [ ] Inventory tracking
- [ ] Order management
- [ ] Payment processing (Shopify Payments / configured gateways)
- [ ] Tax + shipping calculation (handled at checkout)
- [ ] Customer data

### 2.3 Admin/Ops
- [ ] Product/inventory edits happen in Shopify admin (or future spreadsheet-sync workflow — separate phase)
- [ ] Order fulfillment via Shopify admin

---

## 3. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | LCP < 2.5s on PDP/PLP; use Next.js SSG/ISR for product pages, revalidate on webhook (product update) rather than polling |
| **SEO** | Server-rendered product/collection pages, proper meta tags, structured data (Product schema), sitemap.xml |
| **Security** | Storefront API token (public, read-only scopes) used client-side only; Admin API token (if used for revalidation webhooks) stays server-side only, never exposed to browser |
| **Scalability** | Stateless frontend, deployable to Vercel; cart state lives in Shopify (via cart ID), not in app server memory |
| **Availability** | Frontend and Shopify backend fail independently — if Storefront API is slow, degrade gracefully (loading states, cached fallback) |
| **Maintainability** | Typed GraphQL queries (codegen), component-based design system, environment-based config (dev/staging/prod) |
| **Accessibility** | Keyboard navigable, alt text on product images, proper contrast ratios |
| **Browser support** | Latest 2 versions of major browsers, mobile-first |

---

## 4. Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: your choice (Tailwind recommended for speed)
- **Data layer**: Shopify Storefront API (GraphQL) via `@shopify/storefront-api-client` or `graphql-request`
- **Hosting**: Vercel (or any Node-capable host)
- **State**: Cart ID in cookie; server components for product data where possible
- **Type safety**: GraphQL Code Generator against Shopify's Storefront schema

---

## 5. Shopify Store Setup

### Step 1 — Create the store
1. Go to shopify.com → Start free trial
2. Choose a plan (Basic is sufficient for this scope — no Plus features needed)
3. Set store name, currency, region
4. Add products manually or via CSV import (Admin → Products → Import)

### Step 2 — Configure payments
1. Admin → Settings → Payments
2. Activate Shopify Payments (or connect PayPal/Stripe as alternative gateway)
3. Test with Shopify's test mode before going live

### Step 3 — Set up shipping & tax
1. Admin → Settings → Shipping and delivery — define zones/rates
2. Admin → Settings → Taxes — enable auto tax calc or set manual rates by region

---

## 6. Shopify API Key Setup (Storefront API)

### Step 1 — Create a custom app
1. Admin → Settings → Apps and sales channels
2. Click **Develop apps** → **Create an app**
3. Name it (e.g. "Headless Storefront")

### Step 2 — Configure Storefront API scopes
1. In the app → **Configuration** → **Storefront API integration**
2. Enable scopes needed:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts` / cart scopes
   - `unauthenticated_read_customers` (if building account features)
3. Save

### Step 3 — Install app and get the token
1. App → **API credentials** tab
2. Click **Install app**
3. Copy the **Storefront API access token** — this is safe to use client-side (public/read-scoped)

### Step 4 — (If needed later) Admin API token
- Only required for server-side actions (e.g. inventory sync workflows, webhook revalidation)
- Same app → enable Admin API scopes (e.g. `write_inventory`, `read_products`)
- This token is **secret** — server-side only, never in frontend code or `.env` files committed to git

### Step 5 — Environment variables (Next.js)
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxxxxx
SHOPIFY_ADMIN_TOKEN=xxxxxxxx   # server-only, no NEXT_PUBLIC_ prefix
```

### Step 6 — Test the connection
Query the Storefront API endpoint directly to confirm access before building UI:
```
POST https://your-store.myshopify.com/api/2026-01/graphql.json
Header: X-Shopify-Storefront-Access-Token: xxxxxxxx
Body: { "query": "{ shop { name } }" }
```
A successful response confirms the token and domain are correctly wired.

---

## 7. Project Phases

| Phase | Scope | Output |
|---|---|---|
| **1. Setup** | Shopify store + API keys, Next.js project scaffold, GraphQL client config | Working API connection, empty shell app |
| **2. Data layer** | Product/collection queries, TypeScript types via codegen | Typed data fetching functions |
| **3. Core pages** | Home, PLP, PDP, static pages | Browsable catalog, no cart yet |
| **4. Cart & checkout** | Cart mutations, cart UI, checkout redirect | Full purchase flow works end-to-end |
| **5. Accounts** | Link to Shopify hosted Customer Account flow, style entry/exit points | Account access functional (no custom auth build) |
| **6. Polish** | SEO metadata, performance pass, accessibility audit | Production-ready |
| **7. Launch** | Domain connection, DNS, go-live checklist | Live store |

---

## 8. Decisions Log

- **Customer accounts**: Shopify hosted flow (not custom UI). Faster to ship, no OAuth to build/secure. Revisit only if post-launch data shows account-page bounce hurting conversion.

## 9. Open Decisions (resolve before Phase 3)

- [x] Design system / component library approach — Tailwind + shadcn/ui, navy/blue + amber theme (see progress.md 2026-08-28)
- [ ] Multi-location inventory — single warehouse only, or multiple?
- [ ] Whether the future spreadsheet-inventory-sync workflow feeds in during or after launch
