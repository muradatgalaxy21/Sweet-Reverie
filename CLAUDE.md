# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State

Scaffolded and in active build. Next.js 16 (App Router) + React 19 + Tailwind 4 project, git repo initialized. Storefront data layer (GraphQL codegen) present but UI has been built ahead of it using static mock data (`src/lib/products-data.ts`, `src/lib/categories.ts`) — Shopify Storefront API wiring is still pending per plan.md phases.

Before writing code, read `plan.md` in full. It defines:
- Architecture: Next.js (App Router) frontend + Shopify Storefront API (GraphQL) for data, Shopify-hosted checkout for payment
- Functional requirements (§2), tech stack (§4), phased build order (§7)
- Shopify store/API key setup steps (§5–6) — needed before any live data fetching can be tested
- Decisions already made vs. open (§8–9) — check "Open Decisions" before making calls on design system, inventory model, etc.

## Key constraints from plan.md (don't violate these)

- **Token scope**: Storefront API token is public/read-only, safe client-side (`NEXT_PUBLIC_` prefix). Admin API token is secret, server-only, never committed or exposed to browser.
- **Checkout**: v1 uses Shopify-hosted checkout via `cart.checkoutUrl` redirect — no custom checkout UI (requires Shopify Plus, explicitly out of scope).
- **Cart state**: lives in Shopify via cart ID (cookie), not in app server memory — keeps frontend stateless/deployable to Vercel.
- **Customer accounts**: Shopify-hosted flow, not custom-built auth (see Decisions Log §8).
- **Revalidation**: product pages use SSG/ISR revalidated by webhook on product update, not polling.

## Commands

- `npm run dev` — start dev server (Turbopack, Next 16)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npm run codegen` — regenerate GraphQL types from `codegen.ts` (Storefront API schema)

## Architecture notes

- `src/app/` — App Router: `layout.tsx` (root shell: announcement bar, header, footer, cart drawer, WhatsApp button) + `page.tsx` (homepage sections).
- `src/components/` — presentational sections (hero carousel, category/brand shelves, best sellers, new arrivals, product card, search modal, cart drawer, site header/footer).
- `src/lib/` — `cart-context.tsx` (client cart state via React context, not yet wired to Shopify cart ID), `products-data.ts` / `categories.ts` (static mock data standing in for Storefront API), `types.ts`, `utils.ts`.
- Styling: Tailwind 4 (`globals.css` has `@import "tailwindcss"` + `@layer base` CSS variables for brand colors — burgundy/peach/gold/cream palette). No component library beyond `@base-ui/react` primitives + `shadcn` CLI-generated pieces.
- `codegen.ts` + `@graphql-codegen/*` deps are present for Storefront API type generation but no live queries are wired in yet — cart, product fetch, and checkout redirect (`cart.checkoutUrl`) are still on static/mock data pending that integration.

## Workflow rules

- **One feature per session.** Keeps sessions from overloading on tokens. Don't bundle multiple plan.md checklist items into one session unless told to.
- **progress.md**: update at the end of every session, or immediately after completing a feature — whichever comes first. Log what shipped, files touched, any deviations from plan.md, and what's next. See `progress.md` for format.
- **Git**: `git add` + commit automatically after each session/feature, no need to ask. Never push to GitHub without asking first, every time — a prior push approval does not carry to the next one.
- **plan.md is the spec.** Follow it as-is. If something needs a tweak or deviation, stop and get explicit user approval + a short plan for the change before implementing — don't silently improvise around it. Log approved deviations in `progress.md`.
- **Ask, don't guess.** For UI/design/UX work especially: if anything is ambiguous (layout, category set, content source, ordering, styling, copy), ask the user before building. Don't silently pick a default for design decisions.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
