---
name: Stripe entitlement derives from live product metadata
description: Why catalog/product changes can retroactively re-entitle existing subscribers, and the contract-enum clamp that guards /me.
---

`resolveAccess()` (api-server `lib/access.ts`) reads a subscriber's plan tier,
`unlimited` flag, and credit allowance from the **current** Stripe *product*
metadata of their active subscription — not from a snapshot taken at purchase.

**Why this matters:** changing or reusing a product's metadata (e.g. the seed
script reusing the "Pro" product and bumping `credits`) retroactively changes
what existing subscribers on that product receive on their next period, even
though their price/cadence keeps billing the old amount. Archived products can
still back active subscriptions, so their (possibly retired) tier string can
still flow into `resolveAccess`.

**How to apply:**
- For any change that alters entitlement semantics, create a NEW product/price
  rather than mutating an existing product's metadata, unless you intend every
  current subscriber on it to be re-entitled.
- A live subscription may only map to the in-contract subscription tiers
  (currently `basic`/`pro`). Gold is a one-time purchase (handled via
  `unlimitedUntil`) and `lifetime` is a stored user flag — neither is a
  subscription tier. `resolveAccess` clamps any other tier to `none` via
  `SUBSCRIPTION_TIERS` so `/me` never returns a `plan` outside the OpenAPI enum.
  If you add a new subscription tier, update both the OpenAPI `plan` enum and
  `SUBSCRIPTION_TIERS` in lockstep.
