# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State

Pre-implementation. Repo has no code yet — only `plan.md`, the full spec for this project. No `package.json`, no framework scaffold, not a git repo.

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

## Once scaffolded

Update this file with actual build/lint/test/dev commands and real architecture notes once the Next.js project exists — this section is a placeholder until then.

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
