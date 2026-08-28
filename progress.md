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
