---
name: Stripe (stripe-replit-sync + Replit connection) gotchas
description: Two non-obvious bugs when wiring Stripe via the Replit connection + stripe-replit-sync in an esbuild-bundled API server.
---

# Stripe wiring gotchas (Replit connection + stripe-replit-sync)

Two separate traps, both of which make Stripe silently fail even though the integration is "connected". The `stripe` skill's code template is misleading on the first one.

## 1. Connection settings field is `secret`, not `secret_key`

The Replit Stripe connection (`/api/v2/connection?include_secrets=true&connector_names=stripe`, and `listConnections('stripe')`) returns settings keyed:
`account_id`, `secret`, `publishable`, `mcp`, `claim_url`.

There is **no** `secret_key` and **no** `webhook_secret`. The `stripe` skill's `stripeClient.ts` template reads `settings.secret_key` / `settings.webhook_secret`, which are always undefined → "missing secret key" error.

**Fix:** read `settings.secret` for the API key. Leave webhook secret undefined/`""` — the managed webhook handles signing (see below).

**How to apply:** any time you copy the stripe skill's `stripeClient.ts`, change `secret_key` → `secret` in both the api-server and scripts copies before running anything.

## 2. `stripe-replit-sync` must be externalized from esbuild

`runMigrations()` loads its SQL files via `path.resolve(__dirname, "./migrations")`. When the API server is bundled by esbuild into `dist/`, `__dirname` points at `dist/`, the migrations dir isn't there, so it runs **zero** migrations — `runMigrations` resolves without error and logs success, but creates **no tables**. The schema namespace `stripe` exists but is empty, and the first real call fails with `relation "stripe.accounts" does not exist`.

**Why:** it's a path-traversal package (like sharp / @google-cloud/secret-manager) that can't be bundled.

**Fix:** add `"stripe-replit-sync"` to the `external` array in `artifacts/api-server/build.mjs`. It stays a runtime dependency so Node resolves it from node_modules where `./migrations` exists.

**How to verify it actually worked:** `psql "$DATABASE_URL" -c "\dt stripe.*"` should list ~28 tables (accounts, products, prices, subscriptions, ...). "Stripe schema ready" in the logs is NOT proof — it logs even when 0 tables were created.

## Init order that works
After both fixes, api-server startup logs: "Stripe schema ready" → "Stripe webhook configured" (real URL) → "Stripe data synced". Then `GET /api/billing/plans` returns the seeded catalog. Seed products with `pnpm --filter @workspace/scripts run seed-stripe` (idempotent).
