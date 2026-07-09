import type Stripe from "stripe";
import { getUncachableStripeClient } from "./stripeClient";

// Catalog for the Ace Trades Trading Copilot. This script is DECLARATIVE and
// idempotent: after it runs, the only ACTIVE products/prices in Stripe are the
// ones defined in SPECS below. Re-running matches products by name (created if
// missing, metadata + description refreshed otherwise), archives any active
// price on a kept product that no longer matches its spec, creates the spec
// price when missing, and archives any app-managed product that is no longer in
// the catalog. Product metadata is the source of truth read by the server:
//   tier        — basic | pro | gold (and legacy: elite | prime | annual | lifetime)
//   kind        — subscription | credit_pack | gold | lifetime
//   credits     — period allowance (subscription) or pack size (credit_pack)
//   unlimited   — "true" for plans that bypass credits
//   trial_days  — free-trial length in days for a subscription (optional)
//   duration_months — access length for the one-time "gold" plan
//   sort        — display order on the pricing page
interface ProductSpec {
  name: string;
  description: string;
  amount: number; // in cents
  recurring?: { interval: "month" | "year"; interval_count?: number };
  metadata: Record<string, string>;
}

const SPECS: ProductSpec[] = [
  {
    name: "Basic",
    description:
      "500 AI analysis credits every month (~33 analyses). Each analysis costs 15 credits. Starts with a 3-day free trial.",
    amount: 3900,
    recurring: { interval: "month" },
    metadata: {
      tier: "basic",
      kind: "subscription",
      credits: "500",
      unlimited: "false",
      trial_days: "3",
      sort: "1",
    },
  },
  {
    name: "Pro",
    description:
      "1,800 AI analysis credits every 3 months (~120 analyses). Each analysis costs 15 credits.",
    amount: 9900,
    recurring: { interval: "month", interval_count: 3 },
    metadata: {
      tier: "pro",
      kind: "subscription",
      credits: "1800",
      unlimited: "false",
      sort: "2",
    },
  },
  {
    name: "Gold",
    description: "Unlimited AI analyses for 12 months. One-time payment, no subscription.",
    amount: 39900,
    metadata: {
      tier: "gold",
      kind: "gold",
      unlimited: "true",
      duration_months: "12",
      sort: "3",
    },
  },
  {
    name: "Credit Pack — 100",
    description: "100 AI analysis credits. One-time purchase, never expires.",
    amount: 999,
    metadata: { kind: "credit_pack", credits: "100", sort: "4" },
  },
  {
    name: "Credit Pack — 200",
    description: "200 AI analysis credits. One-time purchase, never expires.",
    amount: 1999,
    metadata: { kind: "credit_pack", credits: "200", sort: "5" },
  },
  {
    name: "Credit Pack — 300",
    description: "300 AI analysis credits. One-time purchase, never expires.",
    amount: 2999,
    metadata: { kind: "credit_pack", credits: "300", sort: "6" },
  },
  {
    name: "Credit Pack — 1,000",
    description: "1,000 AI analysis credits. One-time purchase, never expires.",
    amount: 4999,
    metadata: { kind: "credit_pack", credits: "1000", sort: "7" },
  },
];

function sameRecurrence(price: Stripe.Price, spec: ProductSpec): boolean {
  if (!spec.recurring) return !price.recurring;
  if (!price.recurring) return false;
  return (
    price.recurring.interval === spec.recurring.interval &&
    (price.recurring.interval_count ?? 1) === (spec.recurring.interval_count ?? 1)
  );
}

// A product is "ours" (app-managed) if it carries our catalog metadata. Used so
// the cleanup pass only ever archives products this catalog is responsible for.
function isAppManaged(product: Stripe.Product): boolean {
  const md = product.metadata ?? {};
  return Boolean(md.tier || md.kind);
}

async function seed(): Promise<void> {
  const stripe = await getUncachableStripeClient();
  console.log("Seeding Ace Trades Trading Copilot products into Stripe...\n");

  const results: Array<{ name: string; priceId: string }> = [];
  const keptProductIds = new Set<string>();

  for (const spec of SPECS) {
    const existing = await stripe.products.search({
      query: `name:'${spec.name.replace(/'/g, "\\'")}' AND active:'true'`,
    });

    let product: Stripe.Product;
    if (existing.data.length > 0) {
      product = existing.data[0];
      await stripe.products.update(product.id, {
        active: true,
        description: spec.description,
        metadata: spec.metadata,
      });
      console.log(`↻ Updated  ${spec.name}`);
    } else {
      product = await stripe.products.create({
        name: spec.name,
        description: spec.description,
        metadata: spec.metadata,
      });
      console.log(`✓ Created  ${spec.name}`);
    }
    keptProductIds.add(product.id);

    // Archive any active price that no longer matches this spec (e.g. a price
    // whose amount or recurrence changed). Existing subscriptions on an archived
    // price keep working; it just can't be selected for new checkouts.
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
    for (const p of prices.data) {
      const matches = p.unit_amount === spec.amount && sameRecurrence(p, spec);
      if (!matches) {
        await stripe.prices.update(p.id, { active: false });
        console.log(`  - archived stale price ${p.id}`);
      }
    }

    let price = prices.data.find((p) => p.unit_amount === spec.amount && sameRecurrence(p, spec));
    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: spec.amount,
        currency: "usd",
        ...(spec.recurring
          ? {
              recurring: {
                interval: spec.recurring.interval,
                interval_count: spec.recurring.interval_count ?? 1,
              },
            }
          : {}),
      });
      console.log(`  + price ${price.id}`);
    }

    results.push({ name: spec.name, priceId: price.id });
  }

  // Cleanup pass: archive app-managed products that are no longer in the catalog
  // (e.g. retired tiers and old credit packs) so the pricing page shows only the
  // current plans. Only touches products carrying our metadata.
  const allActive = await stripe.products.list({ active: true, limit: 100 });
  for (const product of allActive.data) {
    if (keptProductIds.has(product.id)) continue;
    if (!isAppManaged(product)) continue;
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
    for (const p of prices.data) {
      await stripe.prices.update(p.id, { active: false });
    }
    await stripe.products.update(product.id, { active: false });
    console.log(`✗ Archived retired product ${product.name}`);
  }

  console.log("\n── Price IDs ───────────────────────────────────────────");
  for (const r of results) console.log(`${r.name.padEnd(28)} ${r.priceId}`);
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
