# Ace Trades Trading Copilot — Full Source Bundle

> **This single file contains the complete source code of the app.** It is a
> packed export meant to be pasted or uploaded into another AI coding tool
> (Claude, Gemini, dyad, GitHub-based assistants, online sandboxes, etc.) so the
> AI can read and edit the real code without access to the original project.

## How to read this file (instructions for an AI)

- This document is the entire project, concatenated. It contains **182
  files**.
- The **Directory tree** section below shows the layout. The **Files** section
  contains every file's full contents.
- Each file is delimited by a heading of the form `### \`relative/path\``
  followed by a fenced code block with the file's contents and a language hint.
- The fence length varies per file (it is always longer than any run of
  backticks inside that file), so a Markdown file's own `````````` fences will be
  wrapped in a longer fence. Match the opening and closing fence lengths.
- To propose an edit, identify the file by its `relative/path` heading and
  return the changed file (or a unified diff against it). Preserve the existing
  paths and project structure unless a change explicitly requires moving files.

## What this app is

Ace Trades is a beginner-friendly trading copilot that works for any instrument
and market — futures, stocks, forex, and crypto (Nasdaq-100 / NQ futures is the
default). Users can: upload a chart screenshot for a graded setup analysis, keep
a personal trading plan with a risk calculator that sizes positions (contracts/
shares/lots) or shows plain dollar risk, paste a news headline/event to get a
predicted market impact, get a longer "trader review" of a chart, see session
timing guidance, debrief a completed trade, and review a journal of past analyses
with stats. Instruments come from built-in presets or a fully custom definition.
Every AI feature explains itself in plain English for new traders and adapts to
the selected market.

## Tech stack

- **Monorepo:** pnpm workspaces, Node.js 24, TypeScript 5.9.
- **Web app:** React 19 + Vite 7 (`artifacts/trading-copilot`), Tailwind CSS,
  wouter (routing), TanStack Query (data fetching).
- **API server:** Express 5 (`artifacts/api-server`) — holds the Anthropic
  credentials and performs all AI calls; also handles Stripe and health checks.
- **Database:** PostgreSQL + Drizzle ORM (`lib/db`).
- **Validation & contract:** Zod, with an OpenAPI-first contract
  (`lib/api-spec/openapi.yaml`). Orval generates the Zod schemas (`lib/api-zod`)
  and React Query hooks (`lib/api-client-react`) from that spec.

## Architecture (important)

- **The frontend never calls the AI directly.** All AI analysis goes through the
  API server, which holds the Anthropic API key. Doing AI calls in the browser
  would leak the key.
- **Contract-first:** the API is defined in `lib/api-spec/openapi.yaml`. The
  React Query hooks and Zod schemas are generated from it — to add or change an
  endpoint, edit the spec and re-run codegen rather than hand-writing client
  code. Files under `lib/api-zod` and `lib/api-client-react` marked
  *(generated)* are produced this way and should not be edited by hand.
- **User settings and the journal live only in the browser** (localStorage), not
  on a server.

## How to run it

From the repo root (after `pnpm install`):

- `pnpm --filter @workspace/api-server run dev` — run the API server.
- `pnpm --filter @workspace/trading-copilot run dev` — run the web app.
- `pnpm run typecheck` — full typecheck across all packages.
- `pnpm run build` — typecheck + build all packages.
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and
  Zod schemas from the OpenAPI spec.
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only).

### Required environment variables (set these — values are NOT included here)

- `DATABASE_URL` — Postgres connection string.
- `ANTHROPIC_API_KEY` — used by the API server for all AI analysis.
- `SESSION_SECRET` — server session signing secret.
- `STRIPE_LIVE_API_KEY` — Stripe secret key (billing). Optional for local dev.

> Secrets are intentionally excluded from this bundle. Provide your own values
> via environment variables / a `.env` file.

## Regenerating this bundle

This file is a generated export of the app source; the packer that produces it
(`scripts/src/pack-app.ts`) lives in the original project and is intentionally
not part of this export. To refresh the bundle there, run
`pnpm --filter @workspace/scripts run pack-app`.

## Directory tree

```text
.
├── artifacts/
│   ├── api-server/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── .gitkeep
│   │   │   │   ├── access.ts
│   │   │   │   ├── clerkAuth.ts
│   │   │   │   └── logger.ts
│   │   │   ├── middlewares/
│   │   │   │   ├── .gitkeep
│   │   │   │   └── clerkProxyMiddleware.ts
│   │   │   ├── routes/
│   │   │   │   ├── analysis.ts
│   │   │   │   ├── billing.ts
│   │   │   │   ├── health.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── journal.ts
│   │   │   │   ├── me.ts
│   │   │   │   └── settings.ts
│   │   │   ├── app.ts
│   │   │   ├── index.ts
│   │   │   ├── stripeClient.ts
│   │   │   └── webhookHandlers.ts
│   │   ├── build.mjs
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── trading-copilot/
│       ├── public/
│       │   ├── favicon.svg
│       │   ├── logo.svg
│       │   └── robots.txt
│       ├── src/
│       │   ├── components/
│       │   │   ├── tabs/
│       │   │   │   ├── AnalyzeTab.tsx
│       │   │   │   ├── DebriefTab.tsx
│       │   │   │   ├── JournalTab.tsx
│       │   │   │   ├── NewsTab.tsx
│       │   │   │   ├── PlanTab.tsx
│       │   │   │   ├── ReviewTab.tsx
│       │   │   │   └── TimingTab.tsx
│       │   │   ├── ui/
│       │   │   │   ├── accordion.tsx
│       │   │   │   ├── alert-dialog.tsx
│       │   │   │   ├── alert.tsx
│       │   │   │   ├── aspect-ratio.tsx
│       │   │   │   ├── avatar.tsx
│       │   │   │   ├── badge.tsx
│       │   │   │   ├── breadcrumb.tsx
│       │   │   │   ├── button-group.tsx
│       │   │   │   ├── button.tsx
│       │   │   │   ├── calendar.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── carousel.tsx
│       │   │   │   ├── chart.tsx
│       │   │   │   ├── checkbox.tsx
│       │   │   │   ├── collapsible.tsx
│       │   │   │   ├── command.tsx
│       │   │   │   ├── context-menu.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── drawer.tsx
│       │   │   │   ├── dropdown-menu.tsx
│       │   │   │   ├── empty.tsx
│       │   │   │   ├── field.tsx
│       │   │   │   ├── file-upload.tsx
│       │   │   │   ├── form.tsx
│       │   │   │   ├── hover-card.tsx
│       │   │   │   ├── input-group.tsx
│       │   │   │   ├── input-otp.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── item.tsx
│       │   │   │   ├── kbd.tsx
│       │   │   │   ├── label.tsx
│       │   │   │   ├── menubar.tsx
│       │   │   │   ├── navigation-menu.tsx
│       │   │   │   ├── pagination.tsx
│       │   │   │   ├── popover.tsx
│       │   │   │   ├── progress.tsx
│       │   │   │   ├── radio-group.tsx
│       │   │   │   ├── resizable.tsx
│       │   │   │   ├── scroll-area.tsx
│       │   │   │   ├── select.tsx
│       │   │   │   ├── separator.tsx
│       │   │   │   ├── sheet.tsx
│       │   │   │   ├── sidebar.tsx
│       │   │   │   ├── skeleton.tsx
│       │   │   │   ├── slider.tsx
│       │   │   │   ├── sonner.tsx
│       │   │   │   ├── spinner.tsx
│       │   │   │   ├── switch.tsx
│       │   │   │   ├── table.tsx
│       │   │   │   ├── tabs.tsx
│       │   │   │   ├── textarea.tsx
│       │   │   │   ├── toast.tsx
│       │   │   │   ├── toaster.tsx
│       │   │   │   ├── toggle-group.tsx
│       │   │   │   ├── toggle.tsx
│       │   │   │   └── tooltip.tsx
│       │   │   ├── EditableRuleList.tsx
│       │   │   ├── loading-state.tsx
│       │   │   ├── Paywall.tsx
│       │   │   ├── SettingsPanel.tsx
│       │   │   └── shared.tsx
│       │   ├── hooks/
│       │   │   ├── use-mobile.tsx
│       │   │   └── use-toast.ts
│       │   ├── lib/
│       │   │   ├── access-context.tsx
│       │   │   ├── display.ts
│       │   │   ├── image.ts
│       │   │   ├── instruments.ts
│       │   │   ├── queryClient.ts
│       │   │   ├── storage.ts
│       │   │   ├── types.ts
│       │   │   └── utils.ts
│       │   ├── pages/
│       │   │   ├── Billing.tsx
│       │   │   ├── Landing.tsx
│       │   │   ├── not-found.tsx
│       │   │   └── TradingCopilot.tsx
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── components.json
│       ├── index.html
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.json
│       └── vite.config.ts
├── lib/
│   ├── api-client-react/
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   ├── api.schemas.ts
│   │   │   │   └── api.ts
│   │   │   ├── custom-fetch.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── api-spec/
│   │   ├── openapi.yaml
│   │   ├── orval.config.ts
│   │   └── package.json
│   ├── api-zod/
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   ├── types/
│   │   │   │   │   ├── chartAnalysisInput.ts
│   │   │   │   │   ├── chartAnalysisInputAssetClass.ts
│   │   │   │   │   ├── chartAnalysisInputNews.ts
│   │   │   │   │   ├── chartAnalysisInputSession.ts
│   │   │   │   │   ├── chartAnalysisInputTimeframe.ts
│   │   │   │   │   ├── chartAnalysisResult.ts
│   │   │   │   │   ├── chartReviewInput.ts
│   │   │   │   │   ├── chartReviewInputAssetClass.ts
│   │   │   │   │   ├── chartReviewResult.ts
│   │   │   │   │   ├── checkoutRequest.ts
│   │   │   │   │   ├── checkoutUrlResponse.ts
│   │   │   │   │   ├── errorResponse.ts
│   │   │   │   │   ├── healthStatus.ts
│   │   │   │   │   ├── importRequest.ts
│   │   │   │   │   ├── importResult.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── journalEntry.ts
│   │   │   │   │   ├── journalListResponse.ts
│   │   │   │   │   ├── meResponse.ts
│   │   │   │   │   ├── meResponsePlan.ts
│   │   │   │   │   ├── newsAnalysisInput.ts
│   │   │   │   │   ├── newsAnalysisInputAssetClass.ts
│   │   │   │   │   ├── newsAnalysisResult.ts
│   │   │   │   │   ├── okResponse.ts
│   │   │   │   │   ├── placedSetupEvaluation.ts
│   │   │   │   │   ├── plan.ts
│   │   │   │   │   ├── planKind.ts
│   │   │   │   │   ├── plansResponse.ts
│   │   │   │   │   ├── settingsResponse.ts
│   │   │   │   │   ├── timingAnalysis.ts
│   │   │   │   │   ├── tradeDebriefInput.ts
│   │   │   │   │   ├── tradeDebriefInputAssetClass.ts
│   │   │   │   │   ├── tradeDebriefInputDirection.ts
│   │   │   │   │   ├── tradeDebriefInputOutcome.ts
│   │   │   │   │   ├── tradeDebriefResult.ts
│   │   │   │   │   ├── tradingSettings.ts
│   │   │   │   │   ├── tradingSettingsAssetClass.ts
│   │   │   │   │   ├── tradingSettingsDefaultTimeframe.ts
│   │   │   │   │   ├── tradingSettingsLastNews.ts
│   │   │   │   │   ├── tradingSettingsLastSession.ts
│   │   │   │   │   └── verifyRequest.ts
│   │   │   │   └── api.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── db/
│       ├── src/
│       │   ├── schema/
│       │   │   ├── creditPackPurchases.ts
│       │   │   ├── index.ts
│       │   │   ├── journalEntries.ts
│       │   │   ├── users.ts
│       │   │   └── userSettings.ts
│       │   └── index.ts
│       ├── drizzle.config.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json
├── pnpm-workspace.yaml
├── replit.md
├── tsconfig.base.json
└── tsconfig.json
```

## Files

### `artifacts/api-server/build.mjs`

```js
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm } from "node:fs/promises";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    // Some packages may not be bundleable, so we externalize them, we can add more here as needed.
    // Some of the packages below may not be imported or installed, but we're adding them in case they are in the future.
    // Examples of unbundleable packages:
    // - uses native modules and loads them dynamically (e.g. sharp)
    // - use path traversal to read files (e.g. @google-cloud/secret-manager loads sibling .proto files)
    external: [
      "*.node",
      // Reads SQL migration files relative to its own dir via path traversal;
      // bundling breaks runMigrations (it finds 0 migrations and creates no tables).
      "stripe-replit-sync",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "xxhash-addon",
      "bufferutil",
      "utf-8-validate",
      "ssh2",
      "cpu-features",
      "dtrace-provider",
      "isolated-vm",
      "lightningcss",
      "pg-native",
      "oracledb",
      "mongodb-client-encryption",
      "nodemailer",
      "handlebars",
      "knex",
      "typeorm",
      "protobufjs",
      "onnxruntime-node",
      "@tensorflow/*",
      "@prisma/client",
      "@mikro-orm/*",
      "@grpc/*",
      "@swc/*",
      "@aws-sdk/*",
      "@azure/*",
      "@opentelemetry/*",
      "@google-cloud/*",
      "@google/*",
      "googleapis",
      "firebase-admin",
      "@parcel/watcher",
      "@sentry/profiling-node",
      "@tree-sitter/*",
      "aws-sdk",
      "classic-level",
      "dd-trace",
      "ffi-napi",
      "grpc",
      "hiredis",
      "kerberos",
      "leveldown",
      "miniflare",
      "mysql2",
      "newrelic",
      "odbc",
      "piscina",
      "realm",
      "ref-napi",
      "rocksdb",
      "sass-embedded",
      "sequelize",
      "serialport",
      "snappy",
      "tinypool",
      "usb",
      "workerd",
      "wrangler",
      "zeromq",
      "zeromq-prebuilt",
      "playwright",
      "puppeteer",
      "puppeteer-core",
      "electron",
    ],
    sourcemap: "linked",
    plugins: [
      // pino relies on workers to handle logging, instead of externalizing it we use a plugin to handle it
      esbuildPluginPino({ transports: ["pino-pretty"] })
    ],
    // Make sure packages that are cjs only (e.g. express) but are bundled continue to work in our esm output file
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
    `,
    },
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

### `artifacts/api-server/package.json`

```json
{
  "name": "@workspace/api-server",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "export NODE_ENV=development && pnpm run build && pnpm run start",
    "build": "node ./build.mjs",
    "start": "node --enable-source-maps ./dist/index.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.102.0",
    "@clerk/express": "^2.1.27",
    "@clerk/shared": "^4.18.0",
    "@workspace/api-zod": "workspace:*",
    "@workspace/db": "workspace:*",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "drizzle-orm": "catalog:",
    "express": "^5.2.1",
    "http-proxy-middleware": "^4.1.1",
    "pino": "^9.14.0",
    "pino-http": "^10.5.0",
    "stripe": "^22.2.0",
    "stripe-replit-sync": "^1.0.0"
  },
  "devDependencies": {
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "catalog:",
    "esbuild": "0.27.3",
    "esbuild-plugin-pino": "^2.3.3",
    "pino-pretty": "^13.1.3",
    "thread-stream": "3.1.0"
  }
}
```

### `artifacts/api-server/src/app.ts`

```ts
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk auth proxy must stream raw bytes — mount BEFORE body parsers.
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));

// Stripe webhook must receive the raw body — register BEFORE express.json().
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    try {
      await WebhookHandlers.processWebhook(req.body, sig);
      res.json({ received: true });
    } catch (err) {
      req.log.error({ err }, "Stripe webhook processing failed");
      res.status(400).json({ error: "Webhook processing failed" });
    }
  },
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Resolve the Clerk publishable key from the request host so the same server can
// serve multiple Clerk custom domains; falls back to CLERK_PUBLISHABLE_KEY.
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

export default app;
```

### `artifacts/api-server/src/index.ts`

```ts
import { runMigrations } from "stripe-replit-sync";
import app from "./app";
import { logger } from "./lib/logger";
import { getStripeSync } from "./stripeClient";

// Initialize Stripe schema + managed webhook + data sync. Non-fatal: if Stripe
// is not connected yet, the server still starts and billing routes degrade
// gracefully until the integration is added.
async function initStripe(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.warn("DATABASE_URL not set; skipping Stripe initialization");
    return;
  }
  try {
    await runMigrations({ databaseUrl });
    logger.info("Stripe schema ready");

    const stripeSync = await getStripeSync();
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
    const webhook = await stripeSync.findOrCreateManagedWebhook(
      `${webhookBaseUrl}/api/stripe/webhook`,
    );
    logger.info({ url: webhook?.url ?? "setup complete" }, "Stripe webhook configured");

    stripeSync
      .syncBackfill()
      .then(() => logger.info("Stripe data synced"))
      .catch((err) => logger.error({ err }, "Error syncing Stripe data"));
  } catch (err) {
    logger.warn({ err }, "Stripe not initialized (integration likely not connected yet)");
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

await initStripe();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
```

### `artifacts/api-server/src/lib/.gitkeep`

```

```

### `artifacts/api-server/src/lib/access.ts`

```ts
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db, usersTable, creditPackPurchasesTable } from "@workspace/db";
import { getOrCreateUser, TEST_MODE } from "./clerkAuth";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "./logger";

// Every AI feature (Analyze, News, Review, Timing) costs the same.
export const CREDIT_COST = 15;

// Current catalog tiers plus "lifetime" (retired from sale but still honored for
// any existing holders via the users.lifetime flag).
export type PlanTier = "none" | "basic" | "pro" | "gold" | "lifetime";

export interface AccessInfo {
  userId: string;
  email: string | null;
  plan: PlanTier;
  unlimited: boolean;
  subscriptionStatus: string | null;
  monthlyCredits: number;
  packCredits: number;
  totalCredits: number;
  canUse: boolean;
  creditCost: number;
  // ISO timestamp when time-boxed unlimited (the Gold plan) expires, or null.
  unlimitedUntil: string | null;
  stripeCustomerId: string | null;
}

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

// Tiers a live subscription may map to. Gold is a one-time purchase (not a
// subscription) and "lifetime" is a stored user flag, so neither should ever
// arrive via subscription metadata. Any other value (e.g. a retired product an
// old subscriber is still on) is clamped to "none" so the /me response never
// falls outside the OpenAPI plan enum.
const SUBSCRIPTION_TIERS = new Set<PlanTier>(["basic", "pro"]);

function periodStartUnix(sub: any): number | null {
  const fromItem = sub?.items?.data?.[0]?.current_period_start;
  const fromSub = sub?.current_period_start;
  const v = typeof fromItem === "number" ? fromItem : typeof fromSub === "number" ? fromSub : null;
  return v;
}

// Grant credits / lifetime access for any paid one-time checkout sessions
// (credit packs and the lifetime plan) that have not yet been processed.
// Idempotent via the credit_pack_purchases table and the lifetime flag.
async function reconcileOneTimePurchases(customerId: string): Promise<void> {
  const stripe = await getUncachableStripeClient();
  const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 50 });

  for (const s of sessions.data) {
    if (s.mode !== "payment" || s.payment_status !== "paid") continue;
    const md = s.metadata ?? {};
    const userId = md.userId;
    if (!userId) continue;

    if (md.kind === "lifetime") {
      await db.update(usersTable).set({ lifetime: true }).where(eq(usersTable.id, userId));
    } else if (md.kind === "gold") {
      // Time-boxed unlimited. Compute a deterministic expiry from the (fixed)
      // session creation time so re-running reconcile is idempotent, and keep
      // the latest expiry across repurchases via GREATEST.
      const months = parseInt(md.duration_months ?? "12", 10) || 12;
      const expiry = new Date(s.created * 1000);
      expiry.setMonth(expiry.getMonth() + months);
      const expirySec = Math.floor(expiry.getTime() / 1000);
      await db
        .update(usersTable)
        .set({
          unlimitedUntil: sql`GREATEST(COALESCE(${usersTable.unlimitedUntil}, to_timestamp(0)), to_timestamp(${expirySec}))`,
        })
        .where(eq(usersTable.id, userId));
    } else if (md.kind === "credit_pack") {
      const credits = parseInt(md.credits ?? "0", 10) || 0;
      if (credits <= 0) continue;
      const inserted = await db
        .insert(creditPackPurchasesTable)
        .values({ sessionId: s.id, userId, credits })
        .onConflictDoNothing()
        .returning();
      if (inserted.length > 0) {
        await db
          .update(usersTable)
          .set({ packCredits: sql`${usersTable.packCredits} + ${credits}` })
          .where(eq(usersTable.id, userId));
      }
    }
  }
}

// Resolve a user's current plan + credit balances. Source of truth for plans is
// Stripe (subscriptions + one-time purchases); credit balances live in our DB.
export async function resolveAccess(userId: string): Promise<AccessInfo> {
  // In test mode (local dev) treat the request as an unlimited account so charts
  // can be analyzed without signing in or paying. No Stripe calls are made.
  if (TEST_MODE) {
    const testUser = await getOrCreateUser(userId);
    return {
      userId,
      email: testUser.email ?? null,
      plan: "lifetime",
      unlimited: true,
      subscriptionStatus: null,
      monthlyCredits: 0,
      packCredits: 0,
      totalCredits: 0,
      canUse: true,
      creditCost: CREDIT_COST,
      unlimitedUntil: null,
      stripeCustomerId: testUser.stripeCustomerId ?? null,
    };
  }

  let user = await getOrCreateUser(userId);

  let plan: PlanTier = "none";
  let unlimited = false;
  let subscriptionStatus: string | null = null;

  if (user.stripeCustomerId) {
    try {
      // Reconcile one-time purchases first (may flip lifetime / add pack credits).
      await reconcileOneTimePurchases(user.stripeCustomerId);

      const stripe = await getUncachableStripeClient();
      const subs = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "all",
        limit: 20,
        expand: ["data.items.data.price.product"],
      });

      const active = subs.data.find((s) => ACTIVE_STATUSES.has(s.status));
      if (active) {
        subscriptionStatus = active.status;
        const price = active.items.data[0]?.price;
        const product = price?.product as { metadata?: Record<string, string> } | undefined;
        const md = product?.metadata ?? {};
        const rawTier = md.tier as PlanTier;
        plan = SUBSCRIPTION_TIERS.has(rawTier) ? rawTier : "none";
        unlimited = md.unlimited === "true";

        if (!unlimited) {
          const allowance = parseInt(md.credits ?? "0", 10) || 0;
          const ps = periodStartUnix(active);
          const psMs = ps ? ps * 1000 : null;
          const lastMs = user.lastPeriodStart ? user.lastPeriodStart.getTime() : 0;
          if (psMs && psMs > lastMs) {
            await db
              .update(usersTable)
              .set({ monthlyCredits: allowance, lastPeriodStart: new Date(psMs) })
              .where(eq(usersTable.id, userId));
          }
        }
      }
    } catch (err) {
      logger.error({ err }, "Stripe access resolution failed; degrading to stored state");
    }

    // Reload to pick up any reconciliation updates.
    user = await getOrCreateUser(userId);
  }

  // Time-boxed unlimited (Gold): active while unlimitedUntil is in the future.
  const goldUntil = user.unlimitedUntil;
  const goldActive = goldUntil != null && goldUntil.getTime() > Date.now();
  if (goldActive) {
    unlimited = true;
    plan = "gold";
  }

  // Lifetime (unlimited forever) outranks every other plan label.
  if (user.lifetime) {
    unlimited = true;
    plan = "lifetime";
  }

  const monthlyCredits = user.monthlyCredits;
  const packCredits = user.packCredits;
  const totalCredits = monthlyCredits + packCredits;
  const canUse = unlimited || totalCredits >= CREDIT_COST;

  return {
    userId,
    email: user.email ?? null,
    plan,
    unlimited,
    subscriptionStatus,
    monthlyCredits,
    packCredits,
    totalCredits,
    canUse,
    creditCost: CREDIT_COST,
    unlimitedUntil: goldActive ? goldUntil!.toISOString() : null,
    stripeCustomerId: user.stripeCustomerId ?? null,
  };
}

// Atomically deduct credits, spending monthly credits before pack credits.
// Returns true if the deduction succeeded (sufficient balance), false otherwise.
export async function consumeCredits(userId: string, cost: number): Promise<boolean> {
  const res = await db.execute(sql`
    UPDATE users SET
      monthly_credits = monthly_credits - LEAST(monthly_credits, ${cost}),
      pack_credits = pack_credits - (${cost} - LEAST(monthly_credits, ${cost}))
    WHERE id = ${userId} AND (monthly_credits + pack_credits) >= ${cost}
    RETURNING monthly_credits, pack_credits
  `);
  return res.rows.length > 0;
}
```

### `artifacts/api-server/src/lib/clerkAuth.ts`

```ts
import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";

// In development the AI features can be used without signing in (and without the
// credit paywall) so the app owner can freely test charts. Production
// (NODE_ENV=production) always enforces real Clerk auth + billing.
export const TEST_MODE = process.env.NODE_ENV === "development";
export const TEST_USER_ID = "test-mode-user";

// Express middleware: rejects the request unless Clerk has an authenticated
// session. On success, attaches the Clerk user id to req.userId. In TEST_MODE an
// unauthenticated request is allowed through as a fixed local test user.
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  let userId = auth?.userId ?? null;
  if (!userId && TEST_MODE) {
    userId = TEST_USER_ID;
  }
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { userId?: string }).userId = userId;
  next();
}

export function getUserId(req: Request): string {
  return (req as Request & { userId?: string }).userId as string;
}

// Just-in-time provisioning: ensure an application user row exists for this
// Clerk user, looking up their email from Clerk on first sight.
export async function getOrCreateUser(userId: string): Promise<User> {
  const existing = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  let email: string | null = null;
  try {
    const u = await clerkClient.users.getUser(userId);
    email = u.primaryEmailAddress?.emailAddress ?? u.emailAddresses?.[0]?.emailAddress ?? null;
  } catch {
    // Email is best-effort; provisioning should not fail if Clerk lookup fails.
  }

  await db.insert(usersTable).values({ id: userId, email }).onConflictDoNothing();
  const [row] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  return row;
}
```

### `artifacts/api-server/src/lib/logger.ts`

```ts
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
```

### `artifacts/api-server/src/middlewares/.gitkeep`

```

```

### `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`

```ts
/**
 * Clerk Frontend API Proxy Middleware
 *
 * Proxies Clerk Frontend API requests through your domain, enabling Clerk
 * authentication on custom domains and .replit.app deployments without
 * requiring CNAME DNS configuration.
 *
 * AUTH CONFIGURATION: To manage users, enable/disable login providers
 * (Google, GitHub, etc.), change app branding, or configure OAuth credentials,
 * use the Auth pane in the workspace toolbar. There is no external Clerk
 * dashboard — all auth configuration is done through the Auth pane.
 *
 * IMPORTANT:
 * - Only active in production (Clerk proxying doesn't work for dev instances)
 * - Must be mounted BEFORE express.json() middleware
 *
 * Usage in app.ts:
 *   import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
 *   app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
 */

import { createProxyMiddleware } from "http-proxy-middleware";
import type { RequestHandler } from "express";
import type { IncomingHttpHeaders } from "http";

const CLERK_FAPI = "https://frontend-api.clerk.dev";
export const CLERK_PROXY_PATH = "/api/__clerk";

/**
 * Returns the first effective public hostname for the given request,
 * preferring x-forwarded-host over the Host header so callers behind a
 * proxy see the original client-facing host.
 *
 * x-forwarded-host can take three shapes:
 *   - undefined (no proxy involved)
 *   - a single string (one proxy hop)
 *   - a comma-delimited string when an upstream appended rather than
 *     replaced the header (Node folds duplicate headers this way), or a
 *     string[] in some Express typings
 * In the multi-value case, the leftmost value is the original client-
 * facing host. Take that one in all forms. Exported so that app.ts
 * (clerkMiddleware callback) and this proxy middleware agree on which
 * hostname is canonical — otherwise multi-domain/custom-domain flows
 * break.
 */
export function getClerkProxyHost(req: {
  headers: IncomingHttpHeaders;
}): string | undefined {
  const forwarded = req.headers["x-forwarded-host"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const firstHop = raw?.split(",")[0]?.trim();
  return firstHop || req.headers.host?.trim() || undefined;
}

export function clerkProxyMiddleware(): RequestHandler {
  // Only run proxy in production — Clerk proxying doesn't work for dev instances
  if (process.env.NODE_ENV !== "production") {
    return (_req, _res, next) => next();
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return (_req, _res, next) => next();
  }

  return createProxyMiddleware({
    target: CLERK_FAPI,
    changeOrigin: true,
    pathRewrite: (path: string) =>
      path.replace(new RegExp(`^${CLERK_PROXY_PATH}`), ""),
    on: {
      proxyReq: (proxyReq, req) => {
        const protocol = req.headers["x-forwarded-proto"] || "https";
        const host = getClerkProxyHost(req) || "";
        const proxyUrl = `${protocol}://${host}${CLERK_PROXY_PATH}`;

        proxyReq.setHeader("Clerk-Proxy-Url", proxyUrl);
        proxyReq.setHeader("Clerk-Secret-Key", secretKey);

        const xff = req.headers["x-forwarded-for"];
        const clientIp =
          (Array.isArray(xff) ? xff[0] : xff)?.split(",")[0]?.trim() ||
          req.socket?.remoteAddress ||
          "";
        if (clientIp) {
          proxyReq.setHeader("X-Forwarded-For", clientIp);
        }
      },
    },
  }) as RequestHandler;
}
```

### `artifacts/api-server/src/routes/analysis.ts`

````ts
import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { AnalyzeChartBody, ReviewChartBody, AnalyzeNewsBody, DebriefTradeBody } from "@workspace/api-zod";
import { requireAuth, getUserId } from "../lib/clerkAuth";
import { resolveAccess, consumeCredits, CREDIT_COST, type AccessInfo } from "../lib/access";

const router = Router();

// Every AI route requires an authenticated user.
router.use(requireAuth);

// Ensure the user has an active unlimited plan or enough credits. Responds with
// 402 and returns the access snapshot so the client can show a paywall.
async function ensureAccess(req: import("express").Request, res: import("express").Response): Promise<AccessInfo | null> {
  const access = await resolveAccess(getUserId(req));
  if (!access.canUse) {
    res.status(402).json({ error: "Insufficient credits", access });
    return null;
  }
  return access;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // Transient capacity errors (429 / 5xx / 529 "overloaded") are common; let the
  // SDK retry them with exponential backoff before we surface a failure.
  maxRetries: 5,
});

// Anthropic can still return a transient capacity error after the SDK's own
// retries (429 rate limit, 5xx, or 529 "overloaded"). Detect it so we can reply
// with a clear "busy, try again" message instead of misreporting a temporary
// outage as an unreadable chart.
function isTransientAIError(err: unknown): boolean {
  const status = (err as { status?: number } | null)?.status;
  if (status === 429 || (typeof status === "number" && status >= 500)) return true;
  const type = (err as { error?: { error?: { type?: string } } } | null)?.error?.error?.type;
  return type === "overloaded_error" || type === "rate_limit_error" || type === "api_error";
}

// Send a transient-aware error: 503 + "busy" copy for capacity blips, otherwise
// the route's generic 500 message.
function sendAIError(res: import("express").Response, err: unknown, genericMessage: string): void {
  if (isTransientAIError(err)) {
    res.status(503).json({ error: "The AI is busy right now (high demand). Please try again in a moment." });
    return;
  }
  res.status(500).json({ error: genericMessage });
}

interface TimingBlock {
  executionWindow: string;
  flipSignals: string[];
  holdGuidance: string;
  exitWatchlist: string[];
  sessionRisk: string;
}

interface PlacedSetupBlock {
  detected: boolean;
  direction: string;
  entry: string;
  stop: string;
  targets: string;
  indicators: string[];
  grade: string;
  assessment: string;
  improvements: string[];
}

// Derive a fine-grained market-session label from an ET wall-clock HH:MM time.
// Falls back to the trader's coarse session selection when no valid time is given.
// Crypto and forex trade ~24h with no fixed exchange session, so they get
// continuous-market language instead of ET session buckets.
function deriveTimingSession(
  analysisTime: string | null | undefined,
  fallbackSession: string,
  assetClass?: string,
): string {
  const continuous = assetClass === "crypto" || assetClass === "forex";
  if (continuous) {
    const name = assetClass === "crypto" ? "Crypto" : "Forex";
    return analysisTime && /^\d{2}:\d{2}$/.test(analysisTime)
      ? `Around ${analysisTime} — ${name} trades 24h with no fixed exchange session. Liquidity and volatility cluster around regional session overlaps (e.g. London/US) and scheduled news, not a daily open/close.`
      : `${name} trades 24h with no fixed session — liquidity and volatility cluster around regional session overlaps (London/US) and scheduled news.`;
  }
  if (!analysisTime || !/^\d{2}:\d{2}$/.test(analysisTime)) {
    return `${fallbackSession} session (no specific time given)`;
  }
  const [h, m] = analysisTime.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m) || h > 23 || m > 59) {
    return `${fallbackSession} session (time not understood)`;
  }
  const mins = h * 60 + m;
  if (mins >= 240 && mins < 570) return "Pre-market (04:00–09:30 ET) — thin liquidity, gaps and false moves common";
  if (mins >= 570 && mins < 630) return "RTH Open / opening drive (09:30–10:30 ET) — highest volatility and volume of the day";
  if (mins >= 630 && mins < 690) return "Mid-morning (10:30–11:30 ET) — trends continue or the first pullback forms";
  if (mins >= 690 && mins < 810) return "Lunch / midday chop (11:30–13:30 ET) — low volume, choppy, false breakouts common";
  if (mins >= 810 && mins < 900) return "Early afternoon (13:30–15:00 ET) — volume returns, trends can resume";
  if (mins >= 900 && mins < 960) return "Power hour (15:00–16:00 ET) — closing drive, sharp moves and reversals";
  if (mins >= 960 && mins < 1200) return "After-hours (16:00–20:00 ET) — thin liquidity";
  return "Overnight / Globex (20:00–04:00 ET) — very thin liquidity, headline-driven";
}

function asText(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

function asTextArray(v: unknown, fallback: string[] = []): string[] {
  const arr = Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((x) => x.trim())
    : [];
  return arr.length > 0 ? arr : fallback;
}

const DETECTABLE_ASSET_CLASSES = ["futures", "stocks", "forex", "crypto"] as const;

// Constrain a model-reported asset class to the known allowlist, or "unknown".
// The model reads this off the chart, so it can return anything; never trust it raw.
function normalizeAssetClass(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  return (DETECTABLE_ASSET_CLASSES as readonly string[]).includes(s) ? s : "unknown";
}

// The model sometimes wraps its JSON in markdown fences or adds stray prose.
// Strip fences and slice from the first "{" to the last "}" so parsing is
// resilient to that. Throws (caught by the route) if no valid JSON is present.
function parseModelJson(text: string): Record<string, unknown> {
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  const candidate = start !== -1 && end > start ? clean.slice(start, end + 1) : clean;
  return JSON.parse(candidate) as Record<string, unknown>;
}

// The model is asked to always return a full timing block, but it is not Zod-validated;
// normalize so the required contract field is always present and well-formed.
function normalizeTiming(raw: unknown, sessionFallback: string): TimingBlock {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    executionWindow: asText(o.executionWindow, "No clear execution window — wait for a confirmed setup before entering."),
    flipSignals: asTextArray(o.flipSignals, [
      "A decisive candle close back through your entry level on rising volume would signal the bias is flipping — stand aside or reassess.",
    ]),
    holdGuidance: asText(o.holdGuidance, "Manage to your plan's stop and targets; reassess if the setup invalidates."),
    exitWatchlist: asTextArray(o.exitWatchlist, [
      "Watch for a sharp reversal candle or volume drying up near your target — tighten the stop or take profit.",
    ]),
    sessionRisk: asText(o.sessionRisk, sessionFallback),
  };
}

// Normalize the model's evaluation of the trader's own drawn trade. The model is
// asked to always return this block, but it is not Zod-validated; fill safe
// defaults so the UI never breaks when fields are missing. When nothing is
// detected, surface an empty placed-setup so the UI can show its empty state.
function normalizePlacedSetup(raw: unknown): PlacedSetupBlock {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    detected: o.detected === true,
    direction: asText(o.direction, ""),
    entry: asText(o.entry, ""),
    stop: asText(o.stop, ""),
    targets: asText(o.targets, ""),
    indicators: asTextArray(o.indicators, []),
    grade: asText(o.grade, ""),
    assessment: asText(o.assessment, ""),
    improvements: asTextArray(o.improvements, []),
  };
}

router.post("/analysis/analyze", async (req, res) => {
  const parsed = AnalyzeChartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const access = await ensureAccess(req, res);
  if (!access) return;

  const {
    imageBase64, mediaType, timeframe, session, news, accountSize, context,
    analysisTime, ticker, maxRiskPct, maxDailyDrawdownPct, minRR,
    longCriteria, shortCriteria, riskRules, assetClass, autoDetect,
  } = parsed.data;

  // Default to reading the instrument + timeframe from the chart. Only when the
  // trader explicitly corrects a detection (autoDetect === false) are the
  // provided ticker/assetClass/timeframe treated as authoritative.
  const detectFromChart = autoDetect !== false;
  const market = ticker || "the market";
  const continuous = assetClass === "crypto" || assetClass === "forex";
  const riskPct = maxRiskPct ?? 1;
  const dailyPct = maxDailyDrawdownPct ?? 2;
  const rrMin = minRR ?? 2;
  const maxRisk = (accountSize * (riskPct / 100)).toFixed(0);
  const maxDaily = (accountSize * (dailyPct / 100)).toFixed(0);
  const timingSession = deriveTimingSession(analysisTime, session, assetClass);
  const timeSuffix = continuous ? "" : " ET";
  const sessionLine = continuous
    ? `Market type: 24-hour ${assetClass} market (no fixed exchange session)`
    : `Session: ${session}`;

  const longRules = (longCriteria && longCriteria.length > 0)
    ? longCriteria.map((r, i) => `  ${i + 1}. ${r}`).join("\n")
    : "  1. Price above key moving average\n  2. Momentum indicator confirms direction\n  3. Volume supporting move";

  const shortRules = (shortCriteria && shortCriteria.length > 0)
    ? shortCriteria.map((r, i) => `  ${i + 1}. ${r}`).join("\n")
    : "  1. Price below key moving average\n  2. Momentum indicator confirms direction\n  3. Volume supporting move";

  const extraRisk = (riskRules && riskRules.length > 0)
    ? riskRules.map((r) => `  - ${r}`).join("\n")
    : "";

  const intro = detectFromChart
    ? `You are an expert multi-asset trading analyst. Analyze this chart screenshot and grade the trade setup against the trader's specific rules below.`
    : `You are an expert trading analyst specializing in ${market}. Analyze this ${timeframe} chart screenshot and grade the trade setup against the trader's specific rules below.`;

  const marketContextBlock = detectFromChart
    ? `READ THE MARKET CONTEXT FROM THE CHART (do this FIRST):
Trading platforms print the instrument/symbol and the timeframe in the chart's top toolbar or title. Read them directly from THIS screenshot and base your entire analysis on what the chart actually shows:
- Identify the instrument/symbol (e.g. NQ, ES, AAPL, EUR/USD, BTC/USD) and its asset class (futures, stocks, forex, or crypto).
- Identify the chart timeframe (e.g. 1m, 5m, 15m, 1h, 4h, 1d).
Report exactly what you used in "detected_ticker", "detected_asset_class" (one of: futures, stocks, forex, crypto, unknown) and "detected_timeframe". If a value is genuinely not visible on the chart, fall back to the trader's saved values below and report the fallback you used (or "unknown" if you truly cannot tell).
If the instrument you read is crypto or forex, treat it as a 24-hour market with no fixed exchange session: ignore any exchange-session framing below and base session risk on regional session overlaps (e.g. London/US) and scheduled news instead.
The trader's saved settings below are only a FALLBACK HINT — always prefer what the chart actually shows.`
    : `MARKET CONTEXT (the trader has CONFIRMED these — treat them as correct):
Instrument: ${market}${assetClass ? ` (${assetClass})` : ""}
Timeframe: ${timeframe}
Do NOT override these from the chart toolbar even if it appears to show something else. Echo them back verbatim in "detected_ticker", "detected_asset_class" and "detected_timeframe".`;

  const prompt = `${intro}

WRITE FOR A COMPLETE BEGINNER. Every text field must use short, plain sentences and get straight to the point — a new trader should grasp it in seconds. Avoid jargon; if a trading term is unavoidable, add a 2-3 word plain-English hint in parentheses. No filler, no repetition, no hedging.

${marketContextBlock}

TRADER'S TRADING PLAN${detectFromChart ? " (saved settings — instrument & timeframe are fallback only)" : ""}:
Market: ${market}${assetClass ? ` (${assetClass})` : ""}
Timeframe: ${timeframe}
${sessionLine}
News environment: ${news}
Account size: $${accountSize}

LONG ENTRY CRITERIA (ALL must be met for a long):
${longRules}

SHORT ENTRY CRITERIA (ALL must be met for a short):
${shortRules}

RISK MANAGEMENT RULES:
  - Max risk per trade: ${riskPct}% of account = $${maxRisk}
  - Max daily drawdown: ${dailyPct}% of account = $${maxDaily}
  - Minimum risk/reward: ${rrMin}:1${extraRisk ? "\n" + extraRisk : ""}
${context ? "\nTrader notes: " + context : ""}

TIMING CONTEXT:
The trader is evaluating entry at ${analysisTime ? analysisTime + timeSuffix : "an unspecified time"}.
Session window for that time: ${timingSession}
Use this to produce concrete, time-aware guidance in the "timing" block — when to execute, how long to hold, what would flip the trend, what to watch for an exit, and the risk specific to this part of the trading day.

HOW TO READ THIS CHART (do this BEFORE grading):
1. Determine the trend DIRECTION from price action itself — the sequence of swing highs and lows and the slope of price — NOT from candle color alone (platforms use different color schemes, and red/green can be inverted). Higher highs and higher lows = uptrend (Bullish). Lower highs and lower lows = downtrend (Bearish). Overlapping/sideways = Neutral.
2. Read EVERYTHING drawn on the chart and use it: horizontal lines, trendlines, boxes, arrows, text labels, and any named indicators (moving averages, VWAP, pivots, "CP", etc.). Treat trader-drawn markers as intentional: a stop-loss placed BELOW current price with entry/targets ABOVE indicates a LONG (bullish) plan; a stop ABOVE with targets BELOW indicates a SHORT (bearish) plan. Reflect these levels in stop_loss, entries, and targets.
3. Set "bias" to the direction price is ACTUALLY moving on this chart. This is SEPARATE from whether the trade "qualifies": a setup can have Bullish bias yet not qualify because the trader's specific entry criteria are not all confirmed. NEVER report Bearish (or flip the bias) just because a long setup fails to qualify — only report Bearish when the price structure itself is genuinely bearish. If you cannot verify a required indicator, lower the grade and note it in indicators_missing; do not change the directional bias because of it.

IMPORTANT: Grade this trade ONLY against the criteria listed above. Do not impose generic or default rules. A trade qualifies only when it meets the trader's own stated criteria.

RECOMMEND ONE TRADE TO EXECUTE:
Commit to ONE decisive directional call in "recommended_direction": "Long", "Short", or "No Trade" — never both directions. Base it on the price structure and which of the trader's criteria are actually confirmed. Then produce a SINGLE execution plan for that one direction:
  - "recommended_entry": the specific entry level/condition for the recommended direction (leave empty if No Trade).
  - "stop_loss" and "target_1": the stop and first target for that recommended direction.
  - "target_2"/"target_2_warranted"/"target_2_reason": Only set "target_2_warranted" to true and fill "target_2" when the setup GENUINELY warrants a runner/second target (e.g. a strong trend with room to run and a clear higher structural level). Otherwise set "target_2_warranted" to false, leave "target_2" empty, and explain briefly in "target_2_reason" why a second target is not warranted (e.g. "Nearest structure caps the move at Target 1 — no room for a runner").
List in "setup_conditions" the concrete conditions/confluences this recommended setup needs to be valid, in plain English a beginner understands (e.g. "Price holds above the 21 EMA", "A 5-minute candle closes back above VWAP", "Volume expands on the breakout"). 2-5 items.

GRADE THE TRADE THE TRADER ALREADY DREW (placed_setup):
Inspect the chart for a trade the trader drew themselves — entry/stop/target lines or boxes, arrows, and any indicators they added. If you find one, set "placed_setup.detected" to true and:
  - Read it back: "direction" (Long/Short), "entry", "stop", "targets" (their drawn levels), and "indicators" (the indicators that are part of their setup).
  - Grade THAT placed trade in "placed_setup.grade" (A+ / A / B / C / No Trade) — grade their actual drawn trade, which may differ from your recommended trade.
  - Give a short "placed_setup.assessment" of their drawn trade and 2-4 concrete "placed_setup.improvements" that would lift it toward A+.
If NO trade is drawn on the chart (no entry/stop/target markings), set "placed_setup.detected" to false and leave the other placed_setup fields empty — do not invent a drawn trade.

ALWAYS populate "a_plus_factors" with concrete items: exactly 2-4 specific changes for any grade below A+, or exactly 2-3 key strengths when the grade is A+. Never leave it empty.

ALWAYS populate the "timing" block fully: a concrete executionWindow, a holdGuidance sentence, a sessionRisk note for the session above, plus 2-4 items each in flipSignals and exitWatchlist.

Respond ONLY with a JSON object. No preamble, no markdown fences. Exact format:
{
  "detected_ticker": "the instrument/symbol you used (read from the chart, or the fallback; empty if unknown)",
  "detected_asset_class": "futures|stocks|forex|crypto|unknown",
  "detected_timeframe": "the timeframe you used (e.g. 5m; empty if not visible on the chart)",
  "grade": "A+|A|B|C|No Trade",
  "score_total": 0-100,
  "trend_strength": 1-10,
  "momentum": 1-10,
  "volume_confirmation": 1-10,
  "risk_reward_score": 1-10,
  "indicator_alignment": 1-10,
  "bias": "Bullish|Bearish|Neutral",
  "trend_direction": "string describing trend",
  "indicators_found": ["list of detected indicators on chart"],
  "indicators_missing": ["indicators from the plan not visible on this chart"],
  "support_levels": "key support levels visible",
  "resistance_levels": "key resistance levels visible",
  "liquidity_zones": "notable liquidity or imbalance zones",
  "long_entry": "specific entry zone/condition for long based on THIS chart",
  "short_entry": "specific entry zone/condition for short based on THIS chart",
  "recommended_direction": "Long|Short|No Trade",
  "recommended_entry": "the single entry level/condition for the recommended direction (empty if No Trade)",
  "setup_conditions": ["2-5 plain-English conditions this recommended setup needs to be valid"],
  "stop_loss": "stop loss level and reasoning",
  "target_1": "first profit target",
  "target_2": "second profit target, ONLY if warranted; otherwise empty string",
  "target_2_warranted": true|false,
  "target_2_reason": "why a second target is or is not warranted",
  "placed_setup": {
    "detected": true|false,
    "direction": "Long|Short (empty if none drawn)",
    "entry": "the trader's drawn entry level (empty if none)",
    "stop": "the trader's drawn stop level (empty if none)",
    "targets": "the trader's drawn target(s) (empty if none)",
    "indicators": ["indicators that are part of the trader's drawn setup"],
    "grade": "A+|A|B|C|No Trade for the drawn trade (empty if none)",
    "assessment": "short assessment of the trader's drawn trade (empty if none)",
    "improvements": ["2-4 concrete things that would lift the drawn trade toward A+ (empty if none)"]
  },
  "rr_ratio": "calculated ratio e.g. 2.3:1",
  "rr_percent": 0-100,
  "qualifies": true|false,
  "qualification_reason": "one short sentence: which of the trader's rules are met or missing",
  "plan_compliance": "one short, plain-English sentence on how well this setup fits the trader's rules",
  "warnings": ["list of warnings or empty array"],
  "full_analysis": "2 short, plain-English sentences: what the setup is and whether to take it",
  "a_plus_factors": ["if grade is A+: list the 2-3 key reasons this setup qualifies as A+; otherwise: list 2-4 specific, actionable things visible on THIS chart that would need to change to reach an A+ grade, e.g. 'Volume needs to confirm the breakout' or 'Wait for a pullback to the 21 EMA before entry'"],
  "timing": {
    "executionWindow": "the specific time window or condition to execute now (or to wait for), referencing the session window above",
    "flipSignals": ["2-4 concrete price/indicator signals that would flip the current bias to the opposite side"],
    "holdGuidance": "expected hold duration for this setup and how to manage it given the time of day",
    "exitWatchlist": ["2-4 specific things to watch that would warn of a reversal or signal taking the exit"],
    "sessionRisk": "the main time-of-day risk for this session (e.g. chop, news window, low liquidity)"
  }
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: (mediaType || "image/png") as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    if (response.stop_reason === "max_tokens") {
      req.log.warn({ stopReason: response.stop_reason, length: text.length }, "Chart analysis output hit max_tokens");
    }
    const result = parseModelJson(text);
    result.recommended_direction = asText(result.recommended_direction, "No Trade");
    result.recommended_entry = asText(result.recommended_entry, "");
    result.setup_conditions = asTextArray(result.setup_conditions, []);
    result.target_2_warranted = result.target_2_warranted === true;
    result.target_2_reason = asText(result.target_2_reason, "");
    result.placed_setup = normalizePlacedSetup(result.placed_setup);

    // Instrument + timeframe the analysis was actually grounded in. In auto mode
    // these come from the chart (falling back to the trader's saved values when
    // unreadable); in manual mode the trader's corrected values are authoritative.
    const detTicker = asText(result.detected_ticker, "").slice(0, 40);
    const detAssetClass = normalizeAssetClass(result.detected_asset_class);
    const detTimeframe = asText(result.detected_timeframe, "").slice(0, 12);
    if (detectFromChart) {
      result.detected_ticker = detTicker || (ticker ?? "");
      result.detected_asset_class = detAssetClass !== "unknown" ? detAssetClass : (assetClass ?? "unknown");
      result.detected_timeframe = detTimeframe || timeframe;
    } else {
      result.detected_ticker = ticker ?? "";
      result.detected_asset_class = assetClass ?? "unknown";
      result.detected_timeframe = timeframe;
    }

    // Fill any missing timing fields using a session fallback derived from the
    // asset class the analysis actually used. In auto mode that's the detected
    // class, so a wrong saved asset class (e.g. saved futures, chart is crypto)
    // can't inject ET/exchange-session language into a 24h market's timing block.
    const effectiveAssetClass =
      result.detected_asset_class && result.detected_asset_class !== "unknown"
        ? String(result.detected_asset_class)
        : assetClass;
    const effectiveTimingSession = deriveTimingSession(analysisTime, session, effectiveAssetClass);
    result.timing = normalizeTiming(result.timing, effectiveTimingSession);

    if (!access.unlimited) await consumeCredits(getUserId(req), CREDIT_COST);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Analysis failed");
    sendAIError(res, err, "Analysis failed. Please try again.");
  }
});

router.post("/analysis/news", async (req, res) => {
  const parsed = AnalyzeNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const access = await ensureAccess(req, res);
  if (!access) return;

  const {
    newsText, imageBase64, mediaType, ticker, accountSize,
    maxRiskPct, minRR, longCriteria, shortCriteria, riskRules, assetClass,
  } = parsed.data;

  const hasText = !!(newsText && newsText.trim().length > 0);
  const hasImage = !!imageBase64;
  if (!hasText && !hasImage) {
    res.status(400).json({ error: "Provide news text, a screenshot, or both." });
    return;
  }

  const market = ticker || "the market";
  const riskPct = maxRiskPct ?? 1;
  const rrMin = minRR ?? 2;

  const longRules = (longCriteria && longCriteria.length > 0) ? longCriteria.join("; ") : "not specified";
  const shortRules = (shortCriteria && shortCriteria.length > 0) ? shortCriteria.join("; ") : "not specified";
  const extraRisk = (riskRules && riskRules.length > 0) ? riskRules.join("; ") : "none";

  const prompt = `You are an expert macro and markets analyst helping a BEGINNER trader understand how news affects ${market}. The trader has uploaded ${hasImage ? "a screenshot" : ""}${hasImage && hasText ? " and " : ""}${hasText ? "some text" : ""} about recent or upcoming news / economic events.

${hasText ? `NEWS PROVIDED BY THE TRADER:\n${newsText}\n` : ""}
TRADER CONTEXT (use to tailor the trade recommendation, do not invent rules):
Market: ${market}${assetClass ? ` (${assetClass})` : ""}
Account size: ${accountSize ? "$" + accountSize : "unknown"}
Max risk per trade: ${riskPct}%
Minimum risk/reward: ${rrMin}:1
Long criteria: ${longRules}
Short criteria: ${shortRules}
Extra risk rules: ${extraRisk}

Analyze the likely impact of this news on ${market}. Write everything in plain, beginner-friendly English — avoid jargon, and when you must use a term, briefly explain it. Keep every field short and skimmable, and get straight to the point. Be balanced and never guarantee outcomes.

Respond ONLY with a JSON object. No preamble, no markdown fences. Exact format:
{
  "direction": "Bullish|Bearish|Neutral",
  "volatility": "High|Medium|Low",
  "impact": "High|Medium|Low",
  "confidence": 0-100,
  "summary": "1-2 sentence plain-English summary of what this news means for the market",
  "key_events": ["the specific recent or upcoming events identified, each as a short phrase"],
  "affected_window": "when the impact is most likely to be felt, e.g. 'At the 8:30am ET release', 'Today's US session', 'Over the next few days'",
  "trade_recommendation": "plain-English recommendation tied to the trader's strategy above — e.g. whether to trade or stay on the sidelines, and why",
  "reasoning": "2-3 short sentences explaining WHY you expect this impact, in plain beginner English",
  "beginner_tip": "one simple, practical tip for a newer trader facing this kind of news",
  "warnings": ["caveats or risks to keep in mind, or an empty array"]
}`;

  try {
    const content: Anthropic.MessageParam["content"] = [];
    if (hasImage) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: (mediaType || "image/png") as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
          data: imageBase64 as string,
        },
      });
    }
    content.push({ type: "text", text: prompt });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content }],
    });

    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    if (response.stop_reason === "max_tokens") {
      req.log.warn({ stopReason: response.stop_reason, length: text.length }, "News analysis output hit max_tokens");
    }
    const result = parseModelJson(text);
    if (!access.unlimited) await consumeCredits(getUserId(req), CREDIT_COST);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "News analysis failed");
    sendAIError(res, err, "News analysis failed. Please try again.");
  }
});

router.post("/analysis/review", async (req, res) => {
  const parsed = ReviewChartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const access = await ensureAccess(req, res);
  if (!access) return;

  const {
    imageBase64, mediaType,
    ticker, timeframe, accountSize, maxRiskPct, maxDailyDrawdownPct, minRR,
    longCriteria, shortCriteria, riskRules, assetClass,
  } = parsed.data;

  const market = ticker || "the market";
  const marketLabel = assetClass ? `${market} (${assetClass})` : market;
  const tf = timeframe || "chart";
  const riskPct = maxRiskPct ?? 1;
  const dailyPct = maxDailyDrawdownPct ?? 2;
  const rrMin = minRR ?? 2;
  const acct = accountSize ?? 25000;

  const longRules = (longCriteria && longCriteria.length > 0)
    ? longCriteria.join(", ")
    : "price above key MA, momentum confirmation, volume confirmation";

  const shortRules = (shortCriteria && shortCriteria.length > 0)
    ? shortCriteria.join(", ")
    : "price below key MA, momentum confirmation, volume confirmation";

  const extraRisk = (riskRules && riskRules.length > 0) ? " | " + riskRules.join(" | ") : "";

  const prompt = `You are an expert trading analyst. Perform a full Trader Review Mode analysis on this ${marketLabel} chart (${tf} timeframe).

WRITE FOR A COMPLETE BEGINNER. Keep every text field short and in plain English — one or two sentences at most. Avoid jargon; if a term is unavoidable, add a 2-3 word plain hint in parentheses. Get straight to the point, no filler.

Trader's plan: Market=${marketLabel}, Long criteria: ${longRules}. Short criteria: ${shortRules}. Risk: ${riskPct}% max per trade, ${dailyPct}% max daily drawdown, min ${rrMin}:1 R:R, $${acct} account.${extraRisk}

Before grading, determine the trend DIRECTION from price action itself — the sequence of swing highs and lows and the slope of price — not from candle color alone (color schemes vary and can be inverted). Read every drawn annotation and labeled indicator (horizontal lines, trendlines, moving averages, VWAP, pivots, "CP", and any stop-loss / entry / target markers) and use them in the setup and levels. A stop-loss below price with targets above implies a long (bullish) plan; the reverse implies a short. Judge the trend direction as the way price is ACTUALLY moving; do NOT call it bearish merely because a long setup fails the trader's criteria — a non-qualifying setup in an uptrend is still an uptrend.

Grade this setup ONLY against the trader's own rules above.

Respond ONLY with JSON, no preamble, no markdown:
{
  "trade_grade": "A+|A|B|C|No Trade",
  "confidence_score": 0-100,
  "trend_alignment": "one short sentence: does the trend support this trade?",
  "risk_reward_assessment": "one short sentence on risk vs reward against the ${rrMin}:1 minimum",
  "long_setup_quality": "one short sentence rating the long setup, or 'N/A'",
  "short_setup_quality": "one short sentence rating the short setup, or 'N/A'",
  "support_resistance_quality": "one short sentence on the key support/resistance levels",
  "volume_analysis": "one short sentence on what the volume shows",
  "full_review": "3-4 short, plain-English sentences: the overall read and whether to take the trade",
  "potential_risks": ["2-3 short, plain-English risks for this setup"]
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: (mediaType || "image/png") as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    if (response.stop_reason === "max_tokens") {
      req.log.warn({ stopReason: response.stop_reason, length: text.length }, "Review output hit max_tokens");
    }
    const result = parseModelJson(text);
    if (!access.unlimited) await consumeCredits(getUserId(req), CREDIT_COST);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Review failed");
    sendAIError(res, err, "Review failed. Please try again.");
  }
});

const OUTCOME_LABELS: Record<string, string> = {
  stopped_out: "hit the stop-loss",
  missed_target: "never reached the target before the trader got out",
  reversed: "reversed against the trade after entry",
  breakeven: "ended around break-even",
  other: "did not work out as planned",
};

router.post("/analysis/debrief", async (req, res) => {
  const parsed = DebriefTradeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const {
    imageBase64, mediaType, direction, outcome, entry, stop, target, notes,
    ticker, timeframe, longCriteria, shortCriteria, riskRules, assetClass,
  } = parsed.data;

  const hasImage = !!imageBase64;
  const hasNotes = !!(notes && notes.trim().length > 0);
  if (!hasImage && !hasNotes) {
    res.status(400).json({ error: "Provide a chart screenshot, some notes, or both." });
    return;
  }

  const access = await ensureAccess(req, res);
  if (!access) return;

  const market = (ticker || "the market") + (assetClass ? ` (${assetClass})` : "");
  const tf = timeframe || "the chart";
  const outcomeLabel = OUTCOME_LABELS[outcome] || "did not hit its target";
  const dirLabel = direction === "short" ? "Short (betting price falls)" : "Long (betting price rises)";

  const longRules = (longCriteria && longCriteria.length > 0) ? longCriteria.join("; ") : "not specified";
  const shortRules = (shortCriteria && shortCriteria.length > 0) ? shortCriteria.join("; ") : "not specified";
  const extraRisk = (riskRules && riskRules.length > 0) ? riskRules.join("; ") : "none";

  const tradeLevels = [
    entry ? `Entry: ${entry}` : null,
    stop ? `Stop-loss: ${stop}` : null,
    target ? `Target: ${target}` : null,
  ].filter(Boolean).join(" | ") || "not provided";

  const prompt = `You are a supportive, expert trading coach helping a BEGINNER understand why their trade did not hit its target. Be honest and specific about what went wrong, but stay encouraging — never harsh or discouraging.

THE TRADE:
Market: ${market}
Timeframe: ${tf}
Direction taken: ${dirLabel}
Levels: ${tradeLevels}
What happened: The trade ${outcomeLabel}.
${hasNotes ? "Trader's own notes: " + notes + "\n" : ""}
TRADER'S PLAN (context only — do not invent rules):
Long criteria: ${longRules}
Short criteria: ${shortRules}
Extra risk rules: ${extraRisk}

${hasImage
  ? "A chart screenshot showing how the trade played out is attached. Read it carefully: where price went after the entry relative to the entry, stop, and target; the trend and structure; and any visible levels, drawn lines, or indicators."
  : "No chart was provided — base your debrief on the trade details and notes above, and mention what extra information (like a chart screenshot) would make the debrief more accurate."}

Explain, in plain beginner-friendly English, WHY this trade did not hit its target and what to learn from it. Avoid jargon; when you must use a term, briefly explain it. Do not guarantee outcomes or claim certainty about what "would" have happened — talk in terms of likelihoods and what the chart shows.

Respond ONLY with a JSON object. No preamble, no markdown fences. Exact format:
{
  "verdict": "one short headline sentence summarizing why it didn't hit",
  "summary": "2-3 sentence plain-English explanation a beginner can follow",
  "primary_reason": "the single biggest reason the trade missed",
  "contributing_factors": ["2-4 other factors that contributed"],
  "chart_read": "what the chart shows happened after entry (or, if no chart, what extra info would clarify it)",
  "lessons": ["2-4 specific, actionable lessons from this trade"],
  "next_time": ["2-4 concrete things to do differently on the next similar setup"],
  "encouragement": "one supportive sentence to keep the trader motivated and learning",
  "warnings": ["any caveats or risks to keep in mind, or an empty array"]
}`;

  try {
    const content: Anthropic.MessageParam["content"] = [];
    if (hasImage) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: (mediaType || "image/png") as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
          data: imageBase64 as string,
        },
      });
    }
    content.push({ type: "text", text: prompt });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content }],
    });

    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    if (response.stop_reason === "max_tokens") {
      req.log.warn({ stopReason: response.stop_reason, length: text.length }, "Trade debrief output hit max_tokens");
    }
    const result = parseModelJson(text);
    if (!access.unlimited) await consumeCredits(getUserId(req), CREDIT_COST);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Trade debrief failed");
    sendAIError(res, err, "Trade debrief failed. Please try again.");
  }
});

export default router;
````

### `artifacts/api-server/src/routes/billing.ts`

```ts
import { Router } from "express";
import type { Stripe } from "stripe";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { CreateCheckoutBody, VerifyCheckoutBody } from "@workspace/api-zod";
import { requireAuth, getUserId, getOrCreateUser } from "../lib/clerkAuth";
import { getUncachableStripeClient } from "../stripeClient";
import { resolveAccess } from "../lib/access";

const router = Router();

const BASE_URL = `https://${(process.env.REPLIT_DOMAINS ?? "").split(",")[0]}`;

// Public: list active prices with their product metadata so the pricing page can
// render plans and credit packs.
router.get("/billing/plans", async (req, res) => {
  try {
    const stripe = await getUncachableStripeClient();
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"],
    });

    const plans = prices.data
      .filter((p) => {
        const product = p.product as Stripe.Product;
        return product && !product.deleted && product.active;
      })
      .map((p) => {
        const product = p.product as Stripe.Product;
        const md = product.metadata ?? {};
        const kind = md.kind || (p.recurring ? "subscription" : "credit_pack");
        return {
          priceId: p.id,
          productId: product.id,
          name: product.name,
          description: product.description ?? null,
          amount: p.unit_amount ?? 0,
          currency: p.currency,
          interval: p.recurring?.interval ?? null,
          intervalCount: p.recurring?.interval_count ?? null,
          kind,
          tier: md.tier ?? null,
          credits: md.credits ? Number(md.credits) : null,
          unlimited: md.unlimited === "true",
          sort: Number(md.sort ?? 999),
        };
      })
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort: _sort, ...rest }) => rest);

    res.json({ plans });
  } catch (err) {
    req.log.error({ err }, "Failed to list plans");
    res.json({ plans: [] });
  }
});

router.post("/billing/checkout", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const parsed = CreateCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "priceId is required" });
    return;
  }
  const { priceId } = parsed.data;

  try {
    const stripe = await getUncachableStripeClient();
    const user = await getOrCreateUser(userId);

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.id, userId));
    }

    const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
    const product = price.product as Stripe.Product;
    const md = product.metadata ?? {};
    const mode: "subscription" | "payment" = price.recurring ? "subscription" : "payment";
    const kind = md.kind || (price.recurring ? "subscription" : "credit_pack");
    const trialDays = parseInt(md.trial_days ?? "0", 10) || 0;

    const session = await stripe.checkout.sessions.create({
      mode,
      customer: customerId,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/billing?checkout=cancelled`,
      metadata: { userId, kind, credits: md.credits ?? "", tier: md.tier ?? "" },
      ...(mode === "subscription"
        ? {
            subscription_data: {
              metadata: { userId },
              ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
            },
          }
        : {}),
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Checkout failed");
    res.status(500).json({ error: "Could not start checkout. Make sure Stripe is connected." });
  }
});

router.post("/billing/portal", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  try {
    const user = await getOrCreateUser(userId);
    if (!user.stripeCustomerId) {
      res.status(400).json({ error: "No billing account yet" });
      return;
    }
    const stripe = await getUncachableStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${BASE_URL}/billing`,
    });
    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Portal failed");
    res.status(500).json({ error: "Could not open the billing portal." });
  }
});

router.post("/billing/verify", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const parsed = VerifyCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "sessionId is required" });
    return;
  }
  try {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);

    const owner = session.metadata?.userId || session.client_reference_id;
    if (owner && owner !== userId) {
      res.status(403).json({ error: "This checkout does not belong to your account" });
      return;
    }

    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    if (customerId) {
      await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.id, userId));
    }

    const access = await resolveAccess(userId);
    res.json(access);
  } catch (err) {
    req.log.error({ err }, "Verify failed");
    res.status(500).json({ error: "Could not verify the checkout." });
  }
});

export default router;
```

### `artifacts/api-server/src/routes/health.ts`

```ts
import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
```

### `artifacts/api-server/src/routes/index.ts`

```ts
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analysisRouter from "./analysis";
import meRouter from "./me";
import settingsRouter from "./settings";
import journalRouter from "./journal";
import billingRouter from "./billing";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(settingsRouter);
router.use(journalRouter);
router.use(billingRouter);
router.use(analysisRouter);

export default router;
```

### `artifacts/api-server/src/routes/journal.ts`

```ts
import { Router } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, journalEntriesTable, userSettingsTable } from "@workspace/db";
import { AddJournalEntryBody, ImportDataBody } from "@workspace/api-zod";
import { requireAuth, getUserId, getOrCreateUser } from "../lib/clerkAuth";

const JOURNAL_MAX = 100;

const router = Router();

// Keep only the newest JOURNAL_MAX entries for a user, deleting the rest.
async function trimJournal(userId: string): Promise<void> {
  await db.execute(sql`
    DELETE FROM journal_entries
    WHERE user_id = ${userId}
      AND id NOT IN (
        SELECT id FROM journal_entries
        WHERE user_id = ${userId}
        ORDER BY timestamp DESC
        LIMIT ${JOURNAL_MAX}
      )
  `);
}

router.get("/journal", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const rows = await db
    .select()
    .from(journalEntriesTable)
    .where(eq(journalEntriesTable.userId, userId))
    .orderBy(desc(journalEntriesTable.timestamp))
    .limit(JOURNAL_MAX);
  res.json({ entries: rows.map((r) => r.data) });
});

router.post("/journal", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const parsed = AddJournalEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid entry" });
    return;
  }
  await getOrCreateUser(userId);
  const entry = parsed.data;
  await db
    .insert(journalEntriesTable)
    .values({ id: entry.id, userId, timestamp: entry.timestamp, data: entry })
    .onConflictDoUpdate({
      target: journalEntriesTable.id,
      set: { data: entry, timestamp: entry.timestamp },
    });
  await trimJournal(userId);
  res.json(entry);
});

router.delete("/journal", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  await db.delete(journalEntriesTable).where(eq(journalEntriesTable.userId, userId));
  res.json({ ok: true });
});

router.post("/journal/import", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const parsed = ImportDataBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid import" });
    return;
  }
  await getOrCreateUser(userId);
  const { entries, settings } = parsed.data;

  let count = 0;
  for (const entry of entries) {
    const inserted = await db
      .insert(journalEntriesTable)
      .values({ id: entry.id, userId, timestamp: entry.timestamp, data: entry })
      .onConflictDoNothing()
      .returning();
    if (inserted.length > 0) count++;
  }

  // Only import settings if the user has none yet (don't clobber existing plan).
  let settingsImported = false;
  if (settings) {
    const [existing] = await db
      .select()
      .from(userSettingsTable)
      .where(eq(userSettingsTable.userId, userId))
      .limit(1);
    if (!existing) {
      await db
        .insert(userSettingsTable)
        .values({ userId, data: settings })
        .onConflictDoNothing();
      settingsImported = true;
    }
  }

  await trimJournal(userId);
  res.json({ count, settingsImported });
});

export default router;
```

### `artifacts/api-server/src/routes/me.ts`

```ts
import { Router } from "express";
import { requireAuth, getUserId } from "../lib/clerkAuth";
import { resolveAccess } from "../lib/access";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  try {
    const access = await resolveAccess(userId);
    res.json(access);
  } catch (err) {
    req.log.error({ err }, "Failed to resolve account");
    res.status(500).json({ error: "Failed to load account" });
  }
});

export default router;
```

### `artifacts/api-server/src/routes/settings.ts`

```ts
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, userSettingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";
import { requireAuth, getUserId, getOrCreateUser } from "../lib/clerkAuth";

const router = Router();

router.get("/settings", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  await getOrCreateUser(userId);
  const [row] = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, userId))
    .limit(1);
  res.json({ data: row ? row.data : null });
});

router.put("/settings", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid settings" });
    return;
  }
  await getOrCreateUser(userId);
  await db
    .insert(userSettingsTable)
    .values({ userId, data: parsed.data })
    .onConflictDoUpdate({ target: userSettingsTable.userId, set: { data: parsed.data } });
  res.json({ data: parsed.data });
});

export default router;
```

### `artifacts/api-server/src/stripeClient.ts`

```ts
import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

/**
 * Fetches Stripe credentials from the Replit connection API.
 * Not cached -- tokens can rotate, so fetch fresh each time.
 */
async function getStripeCredentials(): Promise<{ secretKey: string; webhookSecret?: string }> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      "Missing Replit environment variables. " +
        "Ensure the Stripe integration is connected via the Integrations tab.",
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`);
  }

  const data = (await resp.json()) as {
    items?: Array<{ settings?: { secret?: string; webhook_secret?: string } }>;
  };
  const settings = data.items?.[0]?.settings;

  if (!settings?.secret) {
    throw new Error(
      "Stripe integration not connected or missing secret key. " +
        "Connect Stripe via the Integrations tab first.",
    );
  }

  return {
    secretKey: settings.secret,
    webhookSecret: settings.webhook_secret,
  };
}

/**
 * Returns a fresh authenticated Stripe client.
 * Not cached -- fetches credentials on every call so rotated keys are picked up.
 */
export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

/**
 * Returns a fresh StripeSync instance for webhook processing and data sync.
 * Not cached -- fetches credentials on every call so rotated keys are picked up.
 */
export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const { secretKey, webhookSecret } = await getStripeCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? "",
  });
}
```

### `artifacts/api-server/src/webhookHandlers.ts`

```ts
import { getStripeSync } from "./stripeClient";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. " +
          "Received type: " +
          typeof payload +
          ". This usually means express.json() parsed the body before reaching this handler. " +
          "FIX: Ensure webhook route is registered BEFORE app.use(express.json()).",
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
  }
}
```

### `artifacts/api-server/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src"],
  "references": [
    {
      "path": "../../lib/db"
    },
    {
      "path": "../../lib/api-zod"
    }
  ]
}
```

### `artifacts/trading-copilot/README.md`

````markdown
# Ace Trades Trading Copilot — Plain-English Guide

This guide explains how the app works in everyday language. It is written for
non-technical readers and for AI chat tools (ChatGPT, Claude, Manus, etc.) so you
can paste any single file into a chat and ask for changes without breaking the rest
of the app.

## What this app does

You upload a screenshot of a trading chart, and the app sends it to an AI that
"reads" the chart and grades the setup — like having a trading coach look over your
shoulder. It has five tabs:

1. **Analyze Chart** — Upload a chart, pick a timeframe/session, and get a graded
   analysis (A+ to "No Trade"), a 0–100 score, suggested entry/stop/target levels,
   and which indicators it spotted. Every analysis is saved to your Journal.
2. **Trading Plan** — Your personal rulebook: long criteria, short criteria, and
   risk rules. You can edit any rule inline. It also shows a risk calculator based on
   your account size. These rules are sent to the AI so it grades charts against
   *your* plan.
3. **News Impact** — Paste a headline or upcoming economic event (and/or upload a
   screenshot) and the AI predicts how it could move the market: likely direction,
   expected volatility, an impact rating, a beginner-friendly trade recommendation,
   and plain-English reasoning. Either text or a screenshot is enough — you don't need
   both.
4. **Trader Review** — A second, more detailed write-up of a chart (a "full review")
   with potential risks called out.
5. **Journal** — A history of every analysis you have run, with stats (average score,
   how often setups qualified) and a grade distribution chart.

Your settings and journal are stored **in your browser** (localStorage) — nothing is
saved on a server. Clearing your browser data clears them.

## The files, and what each one does

The app code lives in `src/`. Here is the map, grouped by job. Each file is small
enough to paste into an AI tool on its own.

### The "brain" / plumbing (no visuals)

- **`src/lib/types.ts`** — The shape of the data. Defines what a "journal entry" and
  a "settings" object look like, and the list of tab names. Start here if you want to
  add a new field that flows through the app.
- **`src/lib/storage.ts`** — Loading and saving to the browser. Holds the default
  settings, plus the helpers that read/write settings and the journal in
  localStorage. *Do not rename the storage keys* (`tc_settings_v1`, `tc_journal_v1`)
  or existing users will lose their saved data.
- **`src/lib/display.ts`** — Small formatting helpers: which color a grade gets, how a
  timestamp is formatted, and the rotating "loading…" messages.

### Reusable visual pieces (used by more than one tab)

- **`src/components/shared.tsx`** — Little building blocks reused across tabs: score
  bars and cards, the colored "chips", the red warning box, the section wrapper, and
  the trade-level cards.
- **`src/components/SettingsPanel.tsx`** — The pop-down settings form (ticker, account
  size, risk percentages, etc.) that appears when you click the gear icon.
- **`src/components/EditableRuleList.tsx`** — The list of rules you can click to edit,
  delete, or add to. Used by the Trading Plan tab for long/short/risk rules.

### One file per tab

- **`src/components/tabs/AnalyzeTab.tsx`** — The Analyze Chart tab.
- **`src/components/tabs/PlanTab.tsx`** — The Trading Plan tab + risk calculator.
- **`src/components/tabs/NewsTab.tsx`** — The News Impact tab (news text + optional
  screenshot → predicted market impact).
- **`src/components/tabs/ReviewTab.tsx`** — The Trader Review tab.
- **`src/components/tabs/JournalTab.tsx`** — The Journal tab + stats.

### The shell that ties it together

- **`src/pages/TradingCopilot.tsx`** — The top-level page: header, tab buttons, and it
  decides which tab to show. It holds the current settings and journal and passes them
  down to each tab. Think of it as the "frame" around the four tabs.
- **`src/App.tsx`** / **`src/main.tsx`** — Standard startup files that boot the app.
  You rarely need to touch these.

### Other helpers (pre-existing)

- **`src/components/loading-state.tsx`** — The spinner with rotating messages.
- **`src/components/ui/file-upload.tsx`** — The drag-and-drop image uploader.
- **`src/components/ui/`** — A library of generic UI parts (buttons, dialogs, etc.).

## How data flows

```
You upload a chart  →  AnalyzeTab (or ReviewTab) turns the image into text (base64)
                    →  sends image + your plan rules to the API server
                    →  the API server asks an AI (Anthropic) to grade the chart
                    →  the graded result comes back and is shown on screen
                    →  the result is also saved to your Journal (in your browser)
```

- The frontend (this app) talks to a separate **API server** (in `artifacts/api-server`)
  using auto-generated functions called `useAnalyzeChart`, `useReviewChart`, and
  `useAnalyzeNews`. You do not call the AI directly from the browser; the API server
  does that and keeps the secret key safe.
- Your **settings and journal never leave your browser**. Only the chart image and the
  plan rules are sent to the server when you ask for an analysis.

## How to run it

From the project root:

```bash
pnpm --filter @workspace/trading-copilot run dev        # start the app
pnpm --filter @workspace/trading-copilot run typecheck  # check for type errors
```

On Replit, the app also runs automatically via its workflow — you can just look at the
preview pane.

## How to ask an AI to change something (copy-paste recipes)

Paste the relevant file(s) into your AI chat tool, then ask. Pointers below tell you
which file to grab.

- **"Change the default account size / starting risk percentages."**
  → Edit the defaults in `src/lib/storage.ts` (the `DEFAULT_SETTINGS` block).

- **"Add a new field to the settings form (e.g. a broker name)."**
  → Add the field to `src/lib/types.ts` (the `TradingSettings` shape) and to
  `DEFAULT_SETTINGS` in `src/lib/storage.ts`, then add an input in
  `src/components/SettingsPanel.tsx`.

- **"Change the colors used for grades."**
  → Edit `gradeColors` / `gradeTextColor` in `src/lib/display.ts`.

- **"Reword the loading messages."**
  → Edit `ANALYZE_MESSAGES` / `REVIEW_MESSAGES` / `NEWS_MESSAGES` in `src/lib/display.ts`.

- **"Change the fonts or the accent color."**
  → Fonts and colors are defined as variables in `src/index.css`. The body font is
  Helvetica (`--app-font-sans`), headings use a Futura-style display font
  (`--app-font-display`, which loads "Jost" from Google Fonts in `index.html` as a
  Futura fallback), and the royal-purple accent is `--primary` (and `--ring`). Use the
  `font-display` Tailwind class for big headings.

- **"Change what the News Impact tab shows."**
  → Edit `src/components/tabs/NewsTab.tsx`. The fields it renders (direction,
  volatility, impact, etc.) come from the `/analysis/news` endpoint defined in the
  API contract (`lib/api-spec/openapi.yaml`) and implemented in
  `artifacts/api-server/src/routes/analysis.ts`.

- **"Change what the Analyze tab shows in its results."**
  → Edit `src/components/tabs/AnalyzeTab.tsx`.

- **"Add a new stat to the Journal."**
  → Edit `src/components/tabs/JournalTab.tsx`.

- **"Add a brand-new tab."**
  → Add the tab name to `Tab` in `src/lib/types.ts`, create a new file under
  `src/components/tabs/`, then add it to the tab list and content area in
  `src/pages/TradingCopilot.tsx`.

**Tip for AI tools:** When you ask for a change, also paste `src/lib/types.ts` so the
AI knows the data shapes, and mention "keep the localStorage keys and behavior the
same" so saved user data keeps working.
````

### `artifacts/trading-copilot/components.json`

```json
{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "",
      "css": "src/index.css",
      "baseColor": "neutral",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    }
}
```

### `artifacts/trading-copilot/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Ace Trades — AI Trading Copilot</title>
    <meta name="description" content="Ace Trades — an AI trading copilot for any market: futures, stocks, forex, and crypto. Grade chart setups, size positions, and plan trades." />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="Ace Trades — AI Trading Copilot" />
    <meta property="og:description" content="An AI trading copilot for any market: futures, stocks, forex, and crypto. Grade chart setups, size positions, and plan trades." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Ace Trades — AI Trading Copilot" />
    <meta name="twitter:description" content="An AI trading copilot for any market: futures, stocks, forex, and crypto. Grade chart setups, size positions, and plan trades." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `artifacts/trading-copilot/package.json`

```json
{
  "name": "@workspace/trading-copilot",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --config vite.config.ts --host 0.0.0.0",
    "build": "vite build --config vite.config.ts",
    "serve": "vite preview --config vite.config.ts --host 0.0.0.0",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "devDependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@replit/vite-plugin-cartographer": "catalog:",
    "@replit/vite-plugin-dev-banner": "catalog:",
    "@replit/vite-plugin-runtime-error-modal": "catalog:",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "catalog:",
    "@tanstack/react-query": "catalog:",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitejs/plugin-react": "catalog:",
    "@workspace/api-client-react": "workspace:*",
    "class-variance-authority": "catalog:",
    "clsx": "catalog:",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "catalog:",
    "input-otp": "^1.4.2",
    "lucide-react": "catalog:",
    "next-themes": "^0.4.6",
    "react": "catalog:",
    "react-day-picker": "^9.11.1",
    "react-dom": "catalog:",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "catalog:",
    "tailwindcss": "catalog:",
    "tw-animate-css": "^1.4.0",
    "vaul": "^1.1.2",
    "vite": "catalog:",
    "wouter": "^3.3.5",
    "zod": "catalog:"
  },
  "dependencies": {
    "@clerk/react": "^6.10.0",
    "@clerk/themes": "^2.4.57"
  }
}
```

### `artifacts/trading-copilot/public/favicon.svg`

```xml
<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="180" height="180" rx="36" fill="#FF3C00"/>
</svg>
```

### `artifacts/trading-copilot/public/logo.svg`

```xml
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="11" fill="#7C3AED"/>
  <rect width="48" height="48" rx="11" fill="url(#g)" fill-opacity="0.35"/>
  <path d="M14 31V25" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M21 31V20" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M28 31V23" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M14.5 22L22 15L27.5 19L34 12" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 12H34V16" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#6D28D9"/>
    </linearGradient>
  </defs>
</svg>
```

### `artifacts/trading-copilot/public/robots.txt`

```
User-agent: *
Allow: /
```

### `artifacts/trading-copilot/src/App.tsx`

```tsx
import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  Router as WouterRouter,
} from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessProvider } from "@/lib/access-context";
import TradingCopilot from "@/pages/TradingCopilot";
import Landing from "@/pages/Landing";
import Billing from "@/pages/Billing";

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev, auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// In local dev, skip the sign-in gate and paywall so charts can be tested
// directly. A production build (import.meta.env.DEV === false) keeps real auth.
const TEST_MODE = import.meta.env.DEV;

// Clerk passes full paths to routerPush/routerReplace, but wouter's
// setLocation prepends the base — strip it to avoid doubling.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(262, 78%, 60%)",
    colorForeground: "hsl(210, 40%, 98%)",
    colorMutedForeground: "hsl(215, 20%, 65%)",
    colorDanger: "hsl(0, 63%, 51%)",
    colorBackground: "hsl(220, 20%, 8%)",
    colorInput: "hsl(220, 20%, 11%)",
    colorInputForeground: "hsl(210, 40%, 98%)",
    colorNeutral: "hsl(215, 15%, 18%)",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox:
      "bg-[hsl(220,20%,8%)] border border-[hsl(215,15%,15%)] rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-display text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-emerald-400",
    alertText: "text-foreground",
    logoBox: "h-9",
    logoImage: "h-9 w-auto",
    socialButtonsBlockButton:
      "border border-[hsl(215,15%,18%)] hover:bg-white/5",
    formButtonPrimary:
      "bg-primary hover:bg-primary/90 text-primary-foreground font-bold",
    formFieldInput:
      "bg-[hsl(220,20%,11%)] border border-[hsl(215,15%,18%)] text-foreground",
    footerAction: "!bg-transparent",
    dividerLine: "bg-[hsl(215,15%,18%)]",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

// Keeps the webview cache fresh when the signed-in user changes.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function HomeRoute() {
  // Test mode lands straight in the chart tool, no account required.
  if (TEST_MODE) {
    return <TradingCopilot />;
  }
  return (
    <>
      <Show when="signed-in">
        <TradingCopilot />
      </Show>
      <Show when="signed-out">
        <Landing />
      </Show>
    </>
  );
}

function BillingRoute() {
  return (
    <>
      <Show when="signed-in">
        <Billing />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your Ace Trades copilot",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Start trading smarter with Ace Trades",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AccessProvider>
            <Switch>
              <Route path="/" component={HomeRoute} />
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
              <Route path="/billing" component={BillingRoute} />
              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          </AccessProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
```

### `artifacts/trading-copilot/src/components/EditableRuleList.tsx`

```tsx
import { useState } from "react";
import { CheckCircle, XCircle, Shield, Activity, X, Plus, Pencil } from "lucide-react";

export type RuleColor = "green" | "red" | "amber" | "blue";

export function EditableRuleList({
  rules,
  color,
  onChange,
}: {
  rules: string[];
  color: RuleColor;
  onChange: (next: string[]) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const colors: Record<RuleColor, string> = {
    green: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    red: "text-red-400 bg-red-950/40 border-red-800/40",
    amber: "text-amber-400 bg-amber-950/40 border-amber-800/40",
    blue: "text-blue-400 bg-blue-950/40 border-blue-800/40",
  };
  const inputColors: Record<RuleColor, string> = {
    green: "bg-emerald-950/60 border-emerald-700/60 text-emerald-300 focus:ring-emerald-600/40",
    red: "bg-red-950/60 border-red-700/60 text-red-300 focus:ring-red-600/40",
    amber: "bg-amber-950/60 border-amber-700/60 text-amber-300 focus:ring-amber-600/40",
    blue: "bg-blue-950/60 border-blue-700/60 text-blue-300 focus:ring-blue-600/40",
  };
  const icons: Record<RuleColor, React.ElementType> = {
    green: CheckCircle, red: XCircle, amber: Shield, blue: Activity,
  };
  const Icon = icons[color];

  const startEdit = (i: number) => { setEditingIdx(i); setDraft(rules[i]); };

  const commitEdit = () => {
    if (editingIdx === null) return;
    const trimmed = draft.trim();
    if (trimmed) {
      const next = [...rules];
      next[editingIdx] = trimmed;
      onChange(next);
    }
    setEditingIdx(null);
  };

  const deleteRule = (i: number) => {
    onChange(rules.filter((_, idx) => idx !== i));
    setEditingIdx(null);
  };

  const addRule = () => {
    const next = [...rules, "New rule"];
    onChange(next);
    setEditingIdx(next.length - 1);
    setDraft("New rule");
  };

  return (
    <ul className="space-y-1.5">
      {rules.map((text, i) => (
        <li key={i} className={`group flex items-center gap-2 px-3 py-2 rounded border text-sm ${colors[color]}`}>
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {editingIdx === i ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingIdx(null); }}
              className={`flex-1 text-sm px-2 py-0.5 rounded border bg-transparent focus:outline-none focus:ring-1 ${inputColors[color]}`}
            />
          ) : (
            <span className="flex-1 leading-snug">{text}</span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {editingIdx !== i && (
              <button onClick={() => startEdit(i)} className="p-0.5 hover:opacity-70 transition-opacity" title="Edit">
                <Pencil className="w-3 h-3" />
              </button>
            )}
            <button onClick={() => deleteRule(i)} className="p-0.5 hover:opacity-70 transition-opacity" title="Delete">
              <X className="w-3 h-3" />
            </button>
          </div>
        </li>
      ))}
      <li>
        <button
          onClick={addRule}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-dashed opacity-50 hover:opacity-80 transition-opacity w-full ${colors[color]}`}
        >
          <Plus className="w-3 h-3" /> Add rule
        </button>
      </li>
    </ul>
  );
}
```

### `artifacts/trading-copilot/src/components/Paywall.tsx`

```tsx
import { useLocation } from "wouter";
import { Lock, Sparkles } from "lucide-react";

export function Paywall({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const [, setLocation] = useLocation();
  return (
    <div className="border border-primary/30 bg-primary/10 rounded-lg p-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
        <Lock className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {title ?? "You're out of credits"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-sm mx-auto">
          {message ??
            "Each AI analysis costs 15 credits. Upgrade your plan or grab a credit pack to keep analyzing."}
        </p>
      </div>
      <button
        onClick={() => setLocation("/billing")}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
        data-testid="button-view-plans"
      >
        <Sparkles className="w-4 h-4" /> View plans &amp; credits
      </button>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/SettingsPanel.tsx`

```tsx
import { useState } from "react";
import { Settings, X } from "lucide-react";
import type { TradingSettings } from "@/lib/types";
import {
  INSTRUMENT_GROUPS,
  ASSET_CLASS_LABELS,
  findPreset,
  type AssetClass,
} from "@/lib/instruments";

const CUSTOM = "__custom__";
const ASSET_CLASSES: AssetClass[] = ["futures", "stocks", "forex", "crypto"];

export function SettingsPanel({ settings, onChange, onClose }: {
  settings: TradingSettings;
  onChange: (s: TradingSettings) => void;
  onClose: () => void;
}) {
  const [customMode, setCustomMode] = useState(() => !findPreset(settings.ticker));

  const applyChange = (key: keyof TradingSettings, raw: string) => {
    const parsed = (typeof settings[key] === "number") ? parseFloat(raw) || 0 : raw;
    onChange({ ...settings, [key]: parsed });
  };

  const patch = (partial: Partial<TradingSettings>) => onChange({ ...settings, ...partial });

  const pickInstrument = (value: string) => {
    if (value === CUSTOM) {
      setCustomMode(true);
      return;
    }
    const preset = findPreset(value);
    if (!preset) return;
    setCustomMode(false);
    patch({
      ticker: preset.name,
      assetClass: preset.assetClass,
      pointValue: preset.pointValue,
      tickSize: preset.tickSize,
      quantityLabel: preset.quantityLabel,
      currency: preset.currency,
    });
  };

  const selectValue = !customMode && findPreset(settings.ticker) ? settings.ticker : CUSTOM;

  const inputCls = "w-full text-sm px-3 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelCls = "text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5";

  return (
    <div className="border border-primary/30 rounded-lg bg-card/80 backdrop-blur p-4 mb-4 space-y-4" data-testid="settings-panel">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" /> Trading Settings
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Instrument */}
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Instrument</label>
          <select
            value={selectValue}
            onChange={(e) => pickInstrument(e.target.value)}
            className={inputCls}
            data-testid="select-instrument"
          >
            {INSTRUMENT_GROUPS.map((g) => (
              <optgroup key={g.assetClass} label={g.label}>
                {g.instruments.map((i) => (
                  <option key={i.name} value={i.name}>{i.name}</option>
                ))}
              </optgroup>
            ))}
            <option value={CUSTOM}>Custom instrument…</option>
          </select>
          <p className="text-[10px] text-muted-foreground mt-1">
            Pick a preset, or choose Custom to enter your own contract specs.
          </p>
        </div>

        {customMode && (
          <div className="grid grid-cols-2 gap-3 border border-border rounded-lg p-3 bg-background/40" data-testid="custom-instrument">
            <div className="col-span-2">
              <label className={labelCls}>Instrument name</label>
              <input
                type="text"
                value={settings.ticker}
                onChange={(e) => applyChange("ticker", e.target.value)}
                placeholder="e.g. NG Futures, MSFT, USD/JPY"
                className={inputCls}
                data-testid="input-instrument-name"
              />
            </div>
            <div>
              <label className={labelCls}>Asset class</label>
              <select
                value={settings.assetClass}
                onChange={(e) => patch({ assetClass: e.target.value as AssetClass })}
                className={inputCls}
                data-testid="select-asset-class"
              >
                {ASSET_CLASSES.map((ac) => (
                  <option key={ac} value={ac}>{ASSET_CLASS_LABELS[ac]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Size unit</label>
              <input
                type="text"
                value={settings.quantityLabel}
                onChange={(e) => applyChange("quantityLabel", e.target.value)}
                placeholder="contracts / shares / lots / units"
                className={inputCls}
                data-testid="input-quantity-label"
              />
            </div>
            <div>
              <label className={labelCls}>Point value ($ / 1.0 move)</label>
              <input
                type="number"
                min={0}
                step="any"
                value={settings.pointValue}
                onChange={(e) => applyChange("pointValue", e.target.value)}
                className={inputCls}
                data-testid="input-point-value"
              />
            </div>
            <div>
              <label className={labelCls}>Tick size</label>
              <input
                type="number"
                min={0}
                step="any"
                value={settings.tickSize}
                onChange={(e) => applyChange("tickSize", e.target.value)}
                className={inputCls}
                data-testid="input-tick-size"
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Currency</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => applyChange("currency", e.target.value)}
                placeholder="USD"
                className={inputCls}
                data-testid="input-currency"
              />
            </div>
            <p className="col-span-2 text-[10px] text-muted-foreground">
              Point value is the {settings.currency || "account-currency"} profit or loss from a
              1.0 move in price, per 1 {settings.quantityLabel || "unit"}. The risk calculator uses
              it to size positions.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Default Timeframe</label>
          <select
            value={settings.defaultTimeframe}
            onChange={(e) => applyChange("defaultTimeframe", e.target.value)}
            className={inputCls}
          >
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minute</option>
            <option value="15m">15 Minute</option>
            <option value="30m">30 Minute</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hour</option>
            <option value="1d">Daily</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Account Size ({settings.currency || "$"})</label>
          <input
            type="number"
            min={1000}
            step={1000}
            value={settings.accountSize}
            onChange={(e) => applyChange("accountSize", e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Max Risk / Trade (%)</label>
          <div className="relative">
            <input
              type="number"
              min={0.1}
              max={20}
              step={0.1}
              value={settings.maxRiskPct}
              onChange={(e) => applyChange("maxRiskPct", e.target.value)}
              className={inputCls + " pr-7"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Max Daily Drawdown (%)</label>
          <div className="relative">
            <input
              type="number"
              min={0.1}
              max={50}
              step={0.1}
              value={settings.maxDailyDrawdownPct}
              onChange={(e) => applyChange("maxDailyDrawdownPct", e.target.value)}
              className={inputCls + " pr-7"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
          </div>
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Minimum Risk / Reward</label>
          <div className="relative">
            <input
              type="number"
              min={0.5}
              max={20}
              step={0.1}
              value={settings.minRR}
              onChange={(e) => applyChange("minRR", e.target.value)}
              className={inputCls + " pr-10"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">:1</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/loading-state.tsx`

```tsx
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  messages: string[];
}

export function LoadingState({ messages }: LoadingStateProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-sm font-medium text-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </p>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/shared.tsx`

```tsx
import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

export function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-1 rounded-full bg-muted/40 mt-1.5">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ScoreCard({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  return (
    <div className="bg-card border border-border rounded p-3 text-center">
      <div className="text-2xl font-bold text-foreground tabular-nums">{value}<span className="text-sm text-muted-foreground font-normal">/{max}</span></div>
      <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide leading-tight">{label}</div>
      <ScoreBar value={value} max={max} />
    </div>
  );
}

export function Chip({ label, variant }: { label: string; variant: "found" | "missing" }) {
  return (
    <span className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
      variant === "found"
        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
        : "bg-amber-950/60 text-amber-400 border border-amber-800/50"
    }`}>
      {variant === "missing" ? "+ " : ""}{label}
    </span>
  );
}

export function WarnBox({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5 items-start bg-red-950/50 border border-red-800/50 rounded p-3 mb-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-300 leading-relaxed">{text}</p>
    </div>
  );
}

export function SectionBlock({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded p-4 mb-3">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}

// A SectionBlock that starts collapsed. Use for deep detail a beginner can skip —
// the header stays as a compact tappable bar so the default view stays short.
export function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 p-4 text-left"
      >
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function TradeCard({ label, value, sub, variant }: { label: string; value: string; sub?: string; variant: "long" | "short" | "stop" | "target" | "neutral" }) {
  const styles = {
    long: "bg-blue-950/40 border-blue-800/50",
    short: "bg-red-950/40 border-red-800/50",
    stop: "bg-amber-950/40 border-amber-800/50",
    target: "bg-emerald-950/40 border-emerald-800/50",
    neutral: "bg-muted/20 border-border",
  };
  const labelStyles = {
    long: "text-blue-400",
    short: "text-red-400",
    stop: "text-amber-400",
    target: "text-emerald-400",
    neutral: "text-muted-foreground",
  };
  return (
    <div className={`border rounded p-3 ${styles[variant]}`}>
      <div className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${labelStyles[variant]}`}>{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/AnalyzeTab.tsx`

```tsx
import { useState, useCallback, useRef } from "react";
import {
  useAnalyzeChart,
  type ChartAnalysisInputTimeframe,
  type ChartAnalysisInputSession,
  type ChartAnalysisInputNews,
} from "@workspace/api-client-react";
import { LoadingState } from "@/components/loading-state";
import { FileUpload } from "@/components/ui/file-upload";
import { ScoreCard, Chip, WarnBox, SectionBlock, TradeCard } from "@/components/shared";
import { ANALYZE_MESSAGES, gradeColors, biasColor, gradeTextColor, directionsAgree } from "@/lib/display";
import type { JournalEntry, TradingSettings } from "@/lib/types";
import { prepareImage } from "@/lib/image";
import { loadLastAnalyze, saveLastAnalyze, clearLastAnalyze } from "@/lib/storage";
import {
  usesSession,
  INSTRUMENT_GROUPS,
  ASSET_CLASS_LABELS,
  findPreset,
  type AssetClass,
  type InstrumentSpec,
} from "@/lib/instruments";
import { useAccess } from "@/lib/access-context";
import { Paywall } from "@/components/Paywall";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  BarChart2,
  CheckCircle,
  XCircle,
  Activity,
  Sparkles,
  Clock,
  CalendarClock,
  Timer,
  Repeat,
  ListChecks,
  PencilRuler,
  ScanLine,
  Pencil,
} from "lucide-react";

// Current time in Eastern Time as "HH:MM" (24h). h23 avoids the "24:xx" midnight quirk.
function currentETTime(): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return "09:30";
  }
}

const CORRECT_CUSTOM = "__custom__";
const VALID_ASSET_CLASSES: AssetClass[] = ["futures", "stocks", "forex", "crypto"];

// Coerce a model-reported asset class string to a known AssetClass, or undefined.
function coerceAssetClass(v: unknown): AssetClass | undefined {
  return typeof v === "string" && (VALID_ASSET_CLASSES as string[]).includes(v)
    ? (v as AssetClass)
    : undefined;
}

const TIMEFRAME_OPTIONS: { value: ChartAnalysisInputTimeframe; label: string }[] = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minute" },
  { value: "15m", label: "15 Minute" },
  { value: "30m", label: "30 Minute" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hour" },
  { value: "1d", label: "Daily" },
];
const TIMEFRAME_LABELS: Record<string, string> = Object.fromEntries(
  TIMEFRAME_OPTIONS.map((o) => [o.value, o.value === "1d" ? "Daily" : o.value]),
);

export function AnalyzeTab({ settings, onResult, onSettingsChange }: { settings: TradingSettings; onResult: (entry: JournalEntry) => void; onSettingsChange: (s: TradingSettings) => void }) {
  const restored = useRef(loadLastAnalyze());
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(() =>
    restored.current ? `data:${restored.current.mediaType};base64,${restored.current.imageBase64}` : undefined
  );
  const [base64, setBase64] = useState<string | null>(() => restored.current?.imageBase64 ?? null);
  const [mediaType, setMediaType] = useState<string>(() => restored.current?.mediaType ?? "image/png");
  const timeframe = settings.defaultTimeframe;
  const session = settings.lastSession;
  const news = settings.lastNews;
  const [context, setContext] = useState(() => restored.current?.context ?? "");
  const [analysisTime, setAnalysisTime] = useState<string>(() => restored.current?.analysisTime || currentETTime());
  const [result, setResult] = useState<any>(() => restored.current?.result ?? null);
  const [showMore, setShowMore] = useState(false);
  // Post-analysis "correct the detected instrument/timeframe" editor toggle.
  const [editingContext, setEditingContext] = useState(false);

  const setSession = (v: ChartAnalysisInputSession) => onSettingsChange({ ...settings, lastSession: v });
  const setNews = (v: ChartAnalysisInputNews) => onSettingsChange({ ...settings, lastNews: v });

  // Futures/stocks have fixed exchange sessions; crypto/forex trade ~24h, so the
  // session selector and "ET" wall-clock framing are hidden for them.
  const showSession = usesSession(settings.assetClass);

  const { access, refresh } = useAccess();

  // Persist + journal in the hook-level onSuccess (not on mutate). The user can
  // switch tabs while the analysis is in flight, which unmounts this component;
  // mutate-scoped callbacks would be dropped, but hook-level ones still fire, so
  // the result is reliably saved and added to the journal. Everything needed is
  // read from `variables.data`, so it does not depend on state at unmount time.
  const mutation = useAnalyzeChart({
    mutation: {
      onSuccess: (data, variables) => {
        const input = variables.data;
        setResult(data);
        setShowMore(false);
        setEditingContext(false);
        refresh();
        saveLastAnalyze({
          imageBase64: input.imageBase64,
          mediaType: input.mediaType,
          context: input.context ?? "",
          analysisTime: input.analysisTime ?? "",
          result: data,
        });
        const ps = data.placed_setup;
        onResult({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
          ticker: (data.detected_ticker as string) || input.ticker || settings.ticker,
          assetClass: coerceAssetClass(data.detected_asset_class) ?? input.assetClass ?? settings.assetClass,
          timeframe: (data.detected_timeframe as string) || input.timeframe,
          session: input.session,
          grade: data.grade,
          score_total: data.score_total,
          bias: data.bias,
          qualifies: data.qualifies,
          rr_ratio: data.rr_ratio,
          full_analysis: data.full_analysis,
          analysisTime: input.analysisTime ?? "",
          timing: data.timing,
          recommended_direction: data.recommended_direction ?? undefined,
          recommended_entry: data.recommended_entry ?? undefined,
          placed_setup: ps && ps.detected
            ? {
                grade: ps.grade ?? "",
                direction: ps.direction ?? "",
                entry: ps.entry ?? "",
                stop: ps.stop ?? "",
                targets: ps.targets ?? "",
              }
            : undefined,
        });
      },
      onError: () => refresh(),
    },
  });

  const uploadSeq = useRef(0);

  // Persist the current chart + inputs so they survive a reload. Only writes when
  // a chart is present; storage errors (e.g. quota) are swallowed in saveLastAnalyze.
  const persist = useCallback(
    (over: { imageBase64?: string; mediaType?: string; context?: string; analysisTime?: string; result?: unknown }) => {
      const img = over.imageBase64 ?? base64;
      if (!img) return;
      saveLastAnalyze({
        imageBase64: img,
        mediaType: over.mediaType ?? mediaType,
        context: over.context ?? context,
        analysisTime: over.analysisTime ?? analysisTime,
        result: "result" in over ? over.result : result,
      });
    },
    [base64, mediaType, context, analysisTime, result]
  );

  const handleUpload = useCallback((f: File) => {
    const seq = ++uploadSeq.current;
    setResult(null);
    setEditingContext(false);
    setBase64(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    prepareImage(f)
      .then((img) => {
        if (uploadSeq.current !== seq) return;
        setBase64(img.base64);
        setMediaType(img.mediaType);
        persist({ imageBase64: img.base64, mediaType: img.mediaType, result: null });
      })
      .catch(() => {});
  }, [persist]);

  const handleClear = useCallback(() => {
    uploadSeq.current++;
    setPreviewUrl(undefined);
    setBase64(null);
    setResult(null);
    setShowMore(false);
    setEditingContext(false);
    clearLastAnalyze();
  }, []);

  // Run the analysis. With `override` null (the normal path) the AI reads the
  // instrument + timeframe from the chart and the saved settings are only a
  // fallback hint (autoDetect:true). When the trader corrects the detection we
  // pass an explicit override and autoDetect:false so the model treats those
  // values as authoritative.
  const runAnalysisWith = (
    override: { ticker: string; assetClass: AssetClass; timeframe: ChartAnalysisInputTimeframe } | null,
  ) => {
    if (!base64) return;
    mutation.mutate({
      data: {
        imageBase64: base64,
        mediaType,
        timeframe: override?.timeframe ?? timeframe,
        session,
        news,
        accountSize: settings.accountSize,
        context: context || null,
        analysisTime: analysisTime || null,
        ticker: (override?.ticker ?? settings.ticker) || null,
        maxRiskPct: settings.maxRiskPct ?? null,
        maxDailyDrawdownPct: settings.maxDailyDrawdownPct ?? null,
        minRR: settings.minRR ?? null,
        longCriteria: settings.longCriteria ?? [],
        shortCriteria: settings.shortCriteria ?? [],
        riskRules: settings.riskRules ?? [],
        assetClass: override?.assetClass ?? settings.assetClass,
        autoDetect: override === null,
      },
    });
  };

  const runAnalysis = () => runAnalysisWith(null);

  // Apply a trader correction from the post-analysis editor: persist the chosen
  // instrument/timeframe as the (backup) saved settings, then re-run with those
  // values as authoritative.
  const applyContextCorrection = (o: {
    ticker: string;
    assetClass: AssetClass;
    timeframe: ChartAnalysisInputTimeframe;
    preset?: InstrumentSpec;
  }) => {
    const next: TradingSettings = o.preset
      ? {
          ...settings,
          ticker: o.preset.name,
          assetClass: o.preset.assetClass,
          pointValue: o.preset.pointValue,
          tickSize: o.preset.tickSize,
          quantityLabel: o.preset.quantityLabel,
          currency: o.preset.currency,
          defaultTimeframe: o.timeframe,
        }
      : { ...settings, ticker: o.ticker, assetClass: o.assetClass, defaultTimeframe: o.timeframe };
    onSettingsChange(next);
    setEditingContext(false);
    setResult(null);
    runAnalysisWith({ ticker: next.ticker, assetClass: next.assetClass, timeframe: next.defaultTimeframe });
  };

  const gc = result ? gradeColors(result.grade) : null;
  const rrLabel = `Min required: ${settings.minRR}:1`;

  if (access && !access.canUse) {
    return <Paywall />;
  }

  return (
    <div>
      {!previewUrl ? (
        <FileUpload onUpload={handleUpload} onClear={handleClear} data-testid="upload-zone-analyze" />
      ) : (
        <>
          <FileUpload onUpload={handleUpload} onClear={handleClear} previewUrl={previewUrl} data-testid="chart-preview-analyze" />

          {!mutation.isPending && !result && (
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2 border border-primary/25 bg-primary/5 rounded p-2.5" data-testid="autodetect-hint">
                <ScanLine className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  We read the <span className="text-foreground font-medium">instrument</span> and{" "}
                  <span className="text-foreground font-medium">timeframe</span> straight from your chart. You can correct them after analyzing.
                </p>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Analysis time{showSession ? " (ET)" : ""}
                </label>
                <input
                  type="time"
                  value={analysisTime}
                  onChange={(e) => { setAnalysisTime(e.target.value); persist({ analysisTime: e.target.value }); }}
                  className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="input-analysis-time"
                />
                <p className="text-[10px] text-muted-foreground mt-1">What time are you evaluating entry? Used for time-aware timing guidance.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {showSession && (
                  <div>
                    <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Session</label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value as ChartAnalysisInputSession)}
                      className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      data-testid="select-session"
                    >
                      <option value="premarket">Pre-Market</option>
                      <option value="rth">Regular Trading Hours</option>
                      <option value="afterhours">After Hours</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">News pending?</label>
                  <select
                    value={news}
                    onChange={(e) => setNews(e.target.value as ChartAnalysisInputNews)}
                    className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    data-testid="select-news"
                  >
                    <option value="no">No major news</option>
                    <option value="yes">News within 30min</option>
                    <option value="just">Just released</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Account size</label>
                  <div className="text-sm px-3 py-2 bg-muted/20 border border-border rounded text-foreground tabular-nums">
                    ${settings.accountSize.toLocaleString()}
                    <span className="text-[10px] text-muted-foreground ml-1">(from settings)</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Additional context (optional)</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  onBlur={(e) => persist({ context: e.target.value })}
                  placeholder="e.g. Near key level, watching for breakout..."
                  className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  data-testid="input-context"
                />
              </div>
              <button
                onClick={runAnalysis}
                disabled={!base64}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="button-analyze"
              >
                <Activity className="w-4 h-4" />
                Analyze Setup
              </button>
            </div>
          )}

          {mutation.isPending && (
            <div className="mt-4">
              <LoadingState messages={ANALYZE_MESSAGES} />
            </div>
          )}

          {mutation.isError && (
            <WarnBox text="Analysis didn't go through — the AI may be busy. Please try again in a moment." />
          )}

          {result && (
            <div className="mt-4 space-y-3" data-testid="results-wrap">
              <DetectedContextBar
                ticker={(result.detected_ticker as string) || settings.ticker}
                assetClass={(result.detected_asset_class as string) || settings.assetClass}
                timeframe={(result.detected_timeframe as string) || timeframe}
                editing={editingContext}
                onToggleEdit={() => setEditingContext((v) => !v)}
                settings={settings}
                onApply={applyContextCorrection}
              />

              {(result.warnings || []).map((w: string, i: number) => (
                <WarnBox key={i} text={w} />
              ))}

              <div className={`border rounded p-4 flex items-center justify-between ${gc!.bg} ${gc!.border}`} data-testid="grade-banner">
                <div>
                  <div className={`text-5xl font-bold leading-none ${gc!.letter}`}>{result.grade}</div>
                  <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    {result.qualifies
                      ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Qualifies per trading plan</span></>
                      : <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">Does not qualify</span></>
                    }
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground tabular-nums">{result.score_total}<span className="text-base text-muted-foreground font-normal">/100</span></div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Overall score</div>
                  <div className={`text-sm font-semibold mt-1 ${biasColor(result.bias)}`}>{result.bias} Bias</div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                <ScoreCard label="Trend" value={result.trend_strength} />
                <ScoreCard label="Momentum" value={result.momentum} />
                <ScoreCard label="Volume" value={result.volume_confirmation} />
                <ScoreCard label="Risk/Rew" value={result.risk_reward_score} />
                <ScoreCard label="Alignment" value={result.indicator_alignment} />
              </div>

              {(() => {
                const dir: string = result.recommended_direction || "No Trade";
                const isLong = /long/i.test(dir);
                const isShort = /short/i.test(dir);
                const dirColor = isLong ? "text-emerald-400" : isShort ? "text-red-400" : "text-amber-400";
                const dirBg = isLong
                  ? "bg-emerald-950/40 border-emerald-800/50"
                  : isShort
                  ? "bg-red-950/40 border-red-800/50"
                  : "bg-amber-950/40 border-amber-800/50";
                const DirIcon = isLong ? TrendingUp : isShort ? TrendingDown : MinusCircle;
                const entryValue =
                  result.recommended_entry ||
                  (isLong ? result.long_entry : isShort ? result.short_entry : "") ||
                  "N/A";
                const warranted = result.target_2_warranted === true;
                return (
                  <SectionBlock title="Recommended Trade" icon={TrendingUp}>
                    <div className={`flex items-center gap-3 border rounded p-3 mb-3 ${dirBg}`} data-testid="recommended-direction">
                      <DirIcon className={`w-6 h-6 flex-shrink-0 ${dirColor}`} />
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Execute</div>
                        <div className={`text-lg font-bold leading-none ${dirColor}`}>{dir}</div>
                      </div>
                    </div>
                    {isLong || isShort ? (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <TradeCard label="Entry" value={entryValue} variant={isShort ? "short" : "long"} />
                          <TradeCard label="Stop Loss" value={result.stop_loss || "N/A"} variant="stop" />
                          <TradeCard label="Target 1" value={result.target_1 || "N/A"} variant="target" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {warranted ? (
                            <TradeCard label="Target 2" value={result.target_2 || "N/A"} variant="target" />
                          ) : (
                            <div className="border rounded p-3 bg-muted/20 border-border" data-testid="target-2-not-warranted">
                              <div className="text-[10px] font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Target 2</div>
                              <div className="text-sm font-semibold text-muted-foreground">Not warranted</div>
                              {result.target_2_reason && (
                                <div className="text-[10px] text-muted-foreground mt-1">{result.target_2_reason}</div>
                              )}
                            </div>
                          )}
                          <TradeCard label="R:R Ratio" value={result.rr_ratio || "N/A"} sub={rrLabel} variant="neutral" />
                        </div>
                        <div className="mt-3">
                          <div className="h-2 rounded-full bg-muted/30">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                              style={{ width: `${Math.min(100, result.rr_percent || 0)}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        No trade recommended right now — conditions don't line up for a clean entry. Wait for the setup below to come together.
                      </p>
                    )}
                  </SectionBlock>
                );
              })()}

              {(result.setup_conditions || []).length > 0 && (
                <SectionBlock title="What This Setup Needs" icon={ListChecks}>
                  <ul className="space-y-2">
                    {(result.setup_conditions || []).map((c: string, i: number) => (
                      <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </SectionBlock>
              )}

              <button
                type="button"
                onClick={() => setShowMore((s) => !s)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary border border-border rounded hover:bg-muted/20 transition-colors"
                data-testid="button-toggle-detail"
              >
                {showMore ? "Hide the full breakdown" : "Show the full breakdown"}
                <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
              </button>

              {showMore && (
                <>
              {result.timing && (
                <SectionBlock title="Trade Timing" icon={Clock}>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CalendarClock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Execution window</p>
                        <p className="text-sm text-foreground leading-relaxed">{result.timing.executionWindow}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Timer className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Hold guidance</p>
                        <p className="text-sm text-foreground leading-relaxed">{result.timing.holdGuidance}</p>
                      </div>
                    </div>
                    {(result.timing.flipSignals || []).length > 0 && (
                      <div className="flex items-start gap-2.5">
                        <Repeat className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Watch for a flip</p>
                          <ul className="mt-0.5 space-y-1">
                            {(result.timing.flipSignals || []).slice(0, 3).map((s: string, i: number) => (
                              <li key={i} className="text-sm text-foreground leading-relaxed">• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {(result.timing.exitWatchlist || []).length > 0 && (
                      <div className="flex items-start gap-2.5" data-testid="timing-card-exit-watchlist">
                        <XCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Exit / reversal watchlist</p>
                          <ul className="mt-0.5 space-y-1">
                            {(result.timing.exitWatchlist || []).slice(0, 3).map((s: string, i: number) => (
                              <li key={i} className="text-sm text-foreground leading-relaxed">• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground pt-1 border-t border-border">See the Timing tab for the full breakdown.</p>
                  </div>
                </SectionBlock>
              )}

              <SectionBlock title="In Plain English" icon={BarChart2}>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.full_analysis}</p>
              </SectionBlock>

              <SectionBlock title="Your Placed Setup" icon={PencilRuler}>
                {result.placed_setup && result.placed_setup.detected ? (
                  <div className="space-y-3" data-testid="placed-setup-detected">
                    <div className="flex items-center justify-between border rounded p-3 bg-card border-border">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Your drawn trade</div>
                        <div className={`text-sm font-semibold ${biasColor(result.placed_setup.direction === "Long" ? "Bullish" : result.placed_setup.direction === "Short" ? "Bearish" : "Neutral")}`}>
                          {result.placed_setup.direction || "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold leading-none ${gradeTextColor(result.placed_setup.grade)}`}>
                          {result.placed_setup.grade || "—"}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Setup grade</div>
                      </div>
                    </div>
                    {result.placed_setup.direction && result.recommended_direction && (() => {
                      const agree = directionsAgree(result.placed_setup.direction, result.recommended_direction);
                      const MatchIcon = agree ? CheckCircle : XCircle;
                      return (
                        <div
                          className={`flex items-start gap-2 border rounded p-3 ${
                            agree
                              ? "text-emerald-400 border-emerald-800/50 bg-emerald-950/30"
                              : "text-amber-400 border-amber-800/50 bg-amber-950/30"
                          }`}
                          data-testid="placed-direction-match"
                        >
                          <MatchIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold">{agree ? "Matched the copilot" : "Differed from the copilot"}</div>
                            <p className="text-[11px] text-foreground/70 mt-0.5 leading-relaxed">
                              {agree
                                ? `Your drawn ${result.placed_setup.direction} lines up with the recommended ${result.recommended_direction}.`
                                : `You drew ${result.placed_setup.direction}, but the copilot recommended ${result.recommended_direction}.`}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="grid grid-cols-3 gap-2">
                      <TradeCard label="Entry" value={result.placed_setup.entry || "N/A"} variant="long" />
                      <TradeCard label="Stop" value={result.placed_setup.stop || "N/A"} variant="stop" />
                      <TradeCard label="Targets" value={result.placed_setup.targets || "N/A"} variant="target" />
                    </div>
                    {(result.placed_setup.indicators || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(result.placed_setup.indicators || []).map((ind: string) => (
                          <Chip key={ind} label={ind} variant="found" />
                        ))}
                      </div>
                    )}
                    {result.placed_setup.assessment && (
                      <p className="text-sm text-foreground leading-relaxed">{result.placed_setup.assessment}</p>
                    )}
                    {(result.placed_setup.improvements || []).length > 0 && (
                      <div className="bg-amber-950/30 border border-amber-800/40 rounded p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Lift it toward A+</p>
                        <ul className="space-y-2.5">
                          {(result.placed_setup.improvements || []).map((imp: string, i: number) => (
                            <li key={i} className="flex gap-2.5 items-start">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground leading-relaxed">{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid="placed-setup-empty">
                    No setup detected on this chart. Draw your entry, stop, and target levels on the chart before uploading to get a grade on your own trade.
                  </p>
                )}
              </SectionBlock>

              <SectionBlock title="Key Levels" icon={ChevronDown}>
                <div className="text-sm text-foreground leading-relaxed space-y-1">
                  <p><span className="text-emerald-400 font-medium">Support:</span> {result.support_levels || "Not identified"}</p>
                  <p><span className="text-red-400 font-medium">Resistance:</span> {result.resistance_levels || "Not identified"}</p>
                  <p><span className="text-blue-400 font-medium">Liquidity zones:</span> {result.liquidity_zones || "Not identified"}</p>
                </div>
              </SectionBlock>

              <SectionBlock title="Indicators Detected" icon={Activity}>
                <div className="flex flex-wrap gap-1.5">
                  {(result.indicators_found || []).length > 0
                    ? (result.indicators_found || []).map((ind: string) => <Chip key={ind} label={ind} variant="found" />)
                    : <span className="text-xs text-muted-foreground">None detected with confidence</span>
                  }
                </div>
                {(result.indicators_missing || []).length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Recommended additions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(result.indicators_missing || []).map((ind: string) => <Chip key={ind} label={ind} variant="missing" />)}
                    </div>
                  </div>
                )}
              </SectionBlock>

              <SectionBlock title="Plan Compliance" icon={CheckCircle}>
                <p className="text-sm text-foreground leading-relaxed">{result.plan_compliance || result.qualification_reason || ""}</p>
              </SectionBlock>

              {(result.a_plus_factors || []).length > 0 && (
                <SectionBlock title={result.grade === "A+" ? "Why This Is A+" : "A+ Upgrade Path"} icon={Sparkles}>
                  <div className="bg-amber-950/30 border border-amber-800/40 rounded p-3">
                    <ul className="space-y-2.5">
                      {(result.a_plus_factors || []).map((factor: string, i: number) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-relaxed">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionBlock>
              )}
                </>
              )}

              <button
                onClick={() => { setResult(null); setEditingContext(false); persist({ result: null }); }}
                className="w-full py-2 text-sm text-muted-foreground border border-border rounded hover:bg-muted/20 transition-colors"
                data-testid="button-new-analysis"
              >
                Analyze another chart
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Shows the instrument + timeframe the analysis was actually grounded in (read
// from the chart, or the trader's saved fallback), with an editor to correct a
// wrong detection and re-analyze.
function DetectedContextBar({
  ticker,
  assetClass,
  timeframe,
  editing,
  onToggleEdit,
  settings,
  onApply,
}: {
  ticker: string;
  assetClass: string;
  timeframe: string;
  editing: boolean;
  onToggleEdit: () => void;
  settings: TradingSettings;
  onApply: (o: { ticker: string; assetClass: AssetClass; timeframe: ChartAnalysisInputTimeframe; preset?: InstrumentSpec }) => void;
}) {
  const acLabel = ASSET_CLASS_LABELS[assetClass as AssetClass] ?? "";
  return (
    <div className="border border-primary/30 rounded-lg bg-primary/5 p-3" data-testid="detected-context">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ScanLine className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Read from your chart</div>
            <div className="text-sm font-semibold text-foreground truncate" data-testid="detected-summary">
              {ticker || "Unknown instrument"}
              <span className="text-muted-foreground font-normal"> · {TIMEFRAME_LABELS[timeframe] ?? timeframe ?? "—"}</span>
              {acLabel ? <span className="text-muted-foreground font-normal"> · {acLabel}</span> : null}
            </div>
          </div>
        </div>
        <button
          onClick={onToggleEdit}
          className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
          data-testid="button-edit-detected"
        >
          <Pencil className="w-3.5 h-3.5" /> {editing ? "Cancel" : "Not right?"}
        </button>
      </div>
      {editing && (
        <ContextEditor
          settings={settings}
          detectedTicker={ticker}
          detectedAssetClass={assetClass}
          detectedTimeframe={timeframe}
          onApply={onApply}
        />
      )}
    </div>
  );
}

// The correction form: pick the right instrument (preset or custom) + timeframe
// and re-analyze with those values treated as authoritative.
function ContextEditor({
  settings,
  detectedTicker,
  detectedAssetClass,
  detectedTimeframe,
  onApply,
}: {
  settings: TradingSettings;
  detectedTicker: string;
  detectedAssetClass: string;
  detectedTimeframe: string;
  onApply: (o: { ticker: string; assetClass: AssetClass; timeframe: ChartAnalysisInputTimeframe; preset?: InstrumentSpec }) => void;
}) {
  // Pre-fill from what the analysis actually used (the detected values) so
  // changing one field doesn't clobber the others with stale saved settings.
  // Fall back to saved settings only when a detected value is missing/invalid.
  const initTicker = detectedTicker || settings.ticker;
  const initAC = coerceAssetClass(detectedAssetClass) ?? settings.assetClass;
  const initTf: ChartAnalysisInputTimeframe = TIMEFRAME_OPTIONS.some((o) => o.value === detectedTimeframe)
    ? (detectedTimeframe as ChartAnalysisInputTimeframe)
    : settings.defaultTimeframe;
  const [selValue, setSelValue] = useState<string>(() => (findPreset(initTicker) ? initTicker : CORRECT_CUSTOM));
  const [customName, setCustomName] = useState(initTicker);
  const [customAC, setCustomAC] = useState<AssetClass>(initAC);
  const [tf, setTf] = useState<ChartAnalysisInputTimeframe>(initTf);
  const isCustom = selValue === CORRECT_CUSTOM;

  const inputCls = "w-full text-sm px-3 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelCls = "text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5";

  const apply = () => {
    if (isCustom) {
      onApply({ ticker: customName.trim() || settings.ticker, assetClass: customAC, timeframe: tf });
      return;
    }
    const preset = findPreset(selValue);
    if (!preset) return;
    onApply({ ticker: preset.name, assetClass: preset.assetClass, timeframe: tf, preset });
  };

  return (
    <div className="mt-3 pt-3 border-t border-primary/20 space-y-3" data-testid="context-editor">
      <p className="text-[11px] text-muted-foreground">
        Set the correct instrument and timeframe, then re-analyze — these also become your saved settings.
      </p>
      <div>
        <label className={labelCls}>Instrument</label>
        <select
          value={selValue}
          onChange={(e) => setSelValue(e.target.value)}
          className={inputCls}
          data-testid="select-correct-instrument"
        >
          {INSTRUMENT_GROUPS.map((g) => (
            <optgroup key={g.assetClass} label={g.label}>
              {g.instruments.map((i) => (
                <option key={i.name} value={i.name}>{i.name}</option>
              ))}
            </optgroup>
          ))}
          <option value={CORRECT_CUSTOM}>Custom instrument…</option>
        </select>
      </div>
      {isCustom && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Instrument name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. NG Futures, MSFT, USD/JPY"
              className={inputCls}
              data-testid="input-correct-name"
            />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Asset class</label>
            <select
              value={customAC}
              onChange={(e) => setCustomAC(e.target.value as AssetClass)}
              className={inputCls}
              data-testid="select-correct-asset-class"
            >
              {VALID_ASSET_CLASSES.map((ac) => (
                <option key={ac} value={ac}>{ASSET_CLASS_LABELS[ac]}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div>
        <label className={labelCls}>Timeframe</label>
        <select
          value={tf}
          onChange={(e) => setTf(e.target.value as ChartAnalysisInputTimeframe)}
          className={inputCls}
          data-testid="select-correct-timeframe"
        >
          {TIMEFRAME_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={apply}
        className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
        data-testid="button-reanalyze"
      >
        <Repeat className="w-4 h-4" /> Re-analyze with these
      </button>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/DebriefTab.tsx`

```tsx
import { useState, useCallback, useRef } from "react";
import {
  useDebriefTrade,
  type TradeDebriefInputDirection,
  type TradeDebriefInputOutcome,
} from "@workspace/api-client-react";
import { LoadingState } from "@/components/loading-state";
import { FileUpload } from "@/components/ui/file-upload";
import { SectionBlock, WarnBox } from "@/components/shared";
import { DEBRIEF_MESSAGES } from "@/lib/display";
import type { TradingSettings } from "@/lib/types";
import { prepareImage } from "@/lib/image";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  ListChecks,
  Lightbulb,
  ArrowRightCircle,
  Heart,
  BarChart2,
} from "lucide-react";

const OUTCOMES: { value: TradeDebriefInputOutcome; label: string }[] = [
  { value: "stopped_out", label: "Hit my stop-loss" },
  { value: "missed_target", label: "Never reached my target" },
  { value: "reversed", label: "Reversed against me" },
  { value: "breakeven", label: "Closed around break-even" },
  { value: "other", label: "Something else" },
];

export function DebriefTab({ settings }: { settings: TradingSettings }) {
  const [direction, setDirection] = useState<TradeDebriefInputDirection>("long");
  const [outcome, setOutcome] = useState<TradeDebriefInputOutcome>("missed_target");
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [base64, setBase64] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const mutation = useDebriefTrade();
  const uploadSeq = useRef(0);

  const handleUpload = useCallback((f: File) => {
    const seq = ++uploadSeq.current;
    setFile(f);
    setResult(null);
    setBase64(null);
    setPreparing(true);
    setPreviewUrl(URL.createObjectURL(f));
    prepareImage(f)
      .then((img) => {
        if (uploadSeq.current !== seq) return;
        setBase64(img.base64);
        setMediaType(img.mediaType);
      })
      .catch(() => {})
      .finally(() => {
        if (uploadSeq.current === seq) setPreparing(false);
      });
  }, []);

  const handleClearImage = useCallback(() => {
    uploadSeq.current++;
    setFile(null);
    setPreviewUrl(undefined);
    setBase64(null);
    setMediaType(null);
    setPreparing(false);
  }, []);

  // Block submit while a chosen chart is still encoding, otherwise a fast click
  // would send the debrief without the image the user just attached.
  const canSubmit = (notes.trim().length > 0 || !!base64) && !preparing;

  const runDebrief = () => {
    if (!canSubmit) return;
    mutation.mutate(
      {
        data: {
          imageBase64: base64,
          mediaType: base64 ? mediaType : null,
          direction,
          outcome,
          entry: entry.trim() ? entry.trim() : null,
          stop: stop.trim() ? stop.trim() : null,
          target: target.trim() ? target.trim() : null,
          notes: notes.trim() ? notes.trim() : null,
          ticker: settings.ticker || null,
          timeframe: settings.defaultTimeframe || null,
          longCriteria: settings.longCriteria ?? [],
          shortCriteria: settings.shortCriteria ?? [],
          riskRules: settings.riskRules ?? [],
          assetClass: settings.assetClass,
        },
      },
      { onSuccess: (data) => setResult(data) }
    );
  };

  const reset = () => {
    setResult(null);
    setEntry("");
    setStop("");
    setTarget("");
    setNotes("");
    handleClearImage();
  };

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Trade Debrief
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Took a trade that didn't hit its target? Upload the chart of how it played out, add what you
          did, and get a plain-English breakdown of why it missed — plus what to do differently next time.
        </p>
      </div>

      {!result && !mutation.isPending && (
        <div className="space-y-4">
          {/* Direction */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">Which way did you trade?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDirection("long")}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-bold transition-colors ${
                  direction === "long"
                    ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-400"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                data-testid="button-direction-long"
              >
                <TrendingUp className="w-4 h-4" /> Long
              </button>
              <button
                type="button"
                onClick={() => setDirection("short")}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-bold transition-colors ${
                  direction === "short"
                    ? "bg-red-950/60 border-red-700/60 text-red-400"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                data-testid="button-direction-short"
              >
                <TrendingDown className="w-4 h-4" /> Short
              </button>
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">What happened?</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as TradeDebriefInputOutcome)}
              className="w-full text-base px-3.5 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-outcome"
            >
              {OUTCOMES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Levels */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Entry</label>
              <input
                type="text"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="e.g. 20150"
                className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                data-testid="input-entry"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Stop</label>
              <input
                type="text"
                value={stop}
                onChange={(e) => setStop(e.target.value)}
                placeholder="e.g. 20120"
                className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                data-testid="input-stop"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Target</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 20210"
                className="w-full text-sm px-3 py-2 bg-card border border-border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                data-testid="input-target"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">
              What were you thinking? <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Entered on a breakout but price stalled and pulled back to my stop..."
              className="w-full text-base px-3.5 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
              data-testid="input-debrief-notes"
            />
          </div>

          {/* Optional chart */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">
              Chart of how it played out <span className="text-muted-foreground font-normal">(optional but recommended)</span>
            </label>
            <FileUpload
              onUpload={handleUpload}
              onClear={handleClearImage}
              previewUrl={previewUrl}
              data-testid="upload-zone-debrief"
            />
          </div>

          {mutation.isError && (
            <WarnBox text="Couldn't run the debrief. Please add a chart or some notes and try again." />
          )}

          <button
            onClick={runDebrief}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground text-base font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="button-debrief"
          >
            <Search className="w-5 h-5" />
            Explain why it missed
          </button>
          {!canSubmit && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Add a chart or some notes about the trade to get started.
            </p>
          )}
        </div>
      )}

      {mutation.isPending && <LoadingState messages={DEBRIEF_MESSAGES} />}

      {result && (
        <div className="space-y-4" data-testid="debrief-result">
          {/* Verdict */}
          <div className="border border-primary/30 bg-card rounded-lg p-5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
              Why it didn't hit
            </p>
            <p className="font-display text-xl font-bold text-foreground leading-snug" data-testid="text-debrief-verdict">
              {result.verdict}
            </p>
            <p className="text-base text-foreground mt-3 leading-relaxed">{result.summary}</p>
          </div>

          {/* Primary reason */}
          <div className="flex items-start gap-3 bg-red-950/30 border border-red-800/40 rounded-lg p-4">
            <Target className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Biggest reason</p>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{result.primary_reason}</p>
            </div>
          </div>

          {(result.contributing_factors || []).length > 0 && (
            <SectionBlock title="What else contributed" icon={ListChecks}>
              <ul className="space-y-2">
                {(result.contributing_factors || []).map((f: string, i: number) => (
                  <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          <SectionBlock title="What the chart shows" icon={BarChart2}>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.chart_read}</p>
          </SectionBlock>

          {(result.lessons || []).length > 0 && (
            <SectionBlock title="Lessons from this trade" icon={Lightbulb}>
              <ul className="space-y-2">
                {(result.lessons || []).map((l: string, i: number) => (
                  <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    {l}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {(result.next_time || []).length > 0 && (
            <SectionBlock title="Do this next time" icon={ArrowRightCircle}>
              <ul className="space-y-2">
                {(result.next_time || []).map((n: string, i: number) => (
                  <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                    <ArrowRightCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {n}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {result.encouragement && (
            <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-lg p-4">
              <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{result.encouragement}</p>
            </div>
          )}

          {(result.warnings || []).map((w: string, i: number) => (
            <WarnBox key={i} text={w} />
          ))}

          <button
            onClick={reset}
            className="w-full py-3 text-sm font-semibold text-muted-foreground border border-border rounded-lg hover:bg-muted/20 transition-colors"
            data-testid="button-new-debrief"
          >
            Debrief another trade
          </button>
        </div>
      )}
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/JournalTab.tsx`

```tsx
import { useRef, useState } from "react";
import { BookOpen, Trash2, Clock, Download, Upload, AlertTriangle, Loader2, TrendingUp, TrendingDown, MinusCircle, Check, X } from "lucide-react";
import { gradeTextColor, formatTime, directionKind, directionTextColor, directionsAgree, directionBucket, type DirectionBucket } from "@/lib/display";
import { buildBackup, parseBackup } from "@/lib/storage";
import type { JournalEntry, TradingSettings } from "@/lib/types";

const GRADE_ORDER = ["A+", "A", "B", "C", "No Trade"];

const DIRECTION_FILTERS: { key: DirectionBucket; label: string }[] = [
  { key: "long", label: "Long" },
  { key: "short", label: "Short" },
  { key: "none", label: "No Trade" },
  { key: "unspecified", label: "Unspecified" },
];

// Aggregate performance stats for a set of journal entries. Used to break down
// avg score, qualify rate, and drawn-vs-AI agreement per recommended call.
function computeEntryStats(list: JournalEntry[]) {
  const avgScore = list.length
    ? Math.round(list.reduce((s, e) => s + e.score_total, 0) / list.length)
    : 0;
  const qualifyRate = list.length
    ? Math.round((list.filter((e) => e.qualifies).length / list.length) * 100)
    : 0;
  // Entries where we can compare the trader's drawn direction to the AI's call.
  const comparable = list.filter((e) => e.placed_setup?.direction && e.recommended_direction);
  const agreeCount = comparable.filter((e) =>
    directionsAgree(e.placed_setup!.direction, e.recommended_direction!),
  ).length;
  const matchRate = comparable.length ? Math.round((agreeCount / comparable.length) * 100) : 0;
  return { count: list.length, avgScore, qualifyRate, comparableCount: comparable.length, agreeCount, matchRate };
}

export function JournalTab({
  entries,
  settings,
  onClear,
  onImport,
}: {
  entries: JournalEntry[];
  settings: TradingSettings;
  onClear: () => void;
  onImport: (raw: string, mode: "replace" | "merge") => Promise<{ count: number }>;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [directionFilter, setDirectionFilter] = useState<DirectionBucket | "all">("all");
  const [confirmClear, setConfirmClear] = useState(false);
  const [importMsg, setImportMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pendingImport, setPendingImport] = useState<{ raw: string; count: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const backup = buildBackup(entries, settings);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `trading-journal-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const commitImport = async (raw: string, mode: "replace" | "merge") => {
    setImporting(true);
    setImportMsg(null);
    try {
      const { count } = await onImport(raw, mode);
      setImportMsg({
        kind: "ok",
        text:
          mode === "merge"
            ? `Merged ${count} new ${count === 1 ? "entry" : "entries"} into your journal.`
            : `Replaced your journal with ${count} ${count === 1 ? "entry" : "entries"}.`,
      });
    } catch (err) {
      setImportMsg({ kind: "err", text: err instanceof Error ? err.message : "Could not import this file." });
    } finally {
      setImporting(false);
      setPendingImport(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        // Validate and count entries up front so we can warn before overwriting.
        const { journal: incoming } = parseBackup(text);
        if (entries.length === 0) {
          // Nothing to lose — import directly.
          await commitImport(text, "replace");
        } else {
          setImportMsg(null);
          setPendingImport({ raw: text, count: incoming.length });
        }
      } catch (err) {
        setImportMsg({ kind: "err", text: err instanceof Error ? err.message : "Could not import this file." });
      }
    }
    // Reset so importing the same file again still fires change.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const exportImportControls = (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={entries.length === 0}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="button-export-journal"
      >
        <Download className="w-3.5 h-3.5" /> Export backup
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        data-testid="button-import-journal"
      >
        <Upload className="w-3.5 h-3.5" /> Import backup
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
        data-testid="input-import-journal"
      />
    </div>
  );

  const importMsgBanner = importMsg && (
    <p
      className={`text-xs ${importMsg.kind === "ok" ? "text-emerald-400" : "text-red-400"}`}
      data-testid="text-import-status"
    >
      {importMsg.text}
    </p>
  );

  const importConfirmModal = pendingImport && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => !importing && setPendingImport(null)}
      />
      <div
        className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-xl p-5"
        data-testid="modal-import-confirm"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">Import backup</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              You have{" "}
              <span className="font-semibold text-foreground">{entries.length}</span>{" "}
              {entries.length === 1 ? "entry" : "entries"} in your journal. This file has{" "}
              <span className="font-semibold text-foreground">{pendingImport.count}</span>{" "}
              {pendingImport.count === 1 ? "entry" : "entries"}.
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              <span className="text-foreground font-medium">Replace</span> deletes your current entries
              first. <span className="text-foreground font-medium">Merge</span> keeps both and skips
              duplicates.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={() => setPendingImport(null)}
            disabled={importing}
            className="text-xs px-3 py-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            data-testid="button-import-cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => commitImport(pendingImport.raw, "merge")}
            disabled={importing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
            data-testid="button-import-merge"
          >
            {importing && <Loader2 className="w-3 h-3 animate-spin" />} Merge
          </button>
          <button
            onClick={() => commitImport(pendingImport.raw, "replace")}
            disabled={importing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-500/90 text-white hover:bg-red-500 transition-colors disabled:opacity-40"
            data-testid="button-import-replace"
          >
            {importing && <Loader2 className="w-3 h-3 animate-spin" />} Replace
          </button>
        </div>
      </div>
    </div>
  );

  const gradeCounts = GRADE_ORDER.reduce<Record<string, number>>((acc, g) => {
    acc[g] = entries.filter((e) => e.grade === g).length;
    return acc;
  }, {});

  const placedEntries = entries.filter((e) => e.placed_setup);
  const placedGradeCounts = GRADE_ORDER.reduce<Record<string, number>>((acc, g) => {
    acc[g] = placedEntries.filter((e) => e.placed_setup?.grade === g).length;
    return acc;
  }, {});

  // Count entries per recommended-direction bucket so the filter pills can show
  // how many of each call the copilot made. "Unspecified" only appears when at
  // least one older entry lacks a recommended_direction.
  const directionCounts = entries.reduce<Record<DirectionBucket, number>>(
    (acc, e) => {
      acc[directionBucket(e.recommended_direction)] += 1;
      return acc;
    },
    { long: 0, short: 0, none: 0, unspecified: 0 },
  );

  const visibleEntries =
    directionFilter === "all"
      ? entries
      : entries.filter((e) => directionBucket(e.recommended_direction) === directionFilter);

  // Stats are scoped to the active filter so users can review performance per
  // recommended call (Long / Short / No Trade). With no filter they reflect the
  // whole journal and update live as the filter changes.
  const stats = computeEntryStats(visibleEntries);
  const scopeLabel =
    directionFilter === "all"
      ? "All Calls"
      : `${DIRECTION_FILTERS.find((f) => f.key === directionFilter)?.label ?? ""} Calls`;

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/30 mb-4" />
        <p className="text-sm text-muted-foreground">No analyses logged yet.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Analyze a chart and it will appear here automatically.</p>
        <p className="text-xs text-muted-foreground/60 mt-1 mb-4">Or restore a previous backup file.</p>
        {exportImportControls}
        <div className="mt-3">{importMsgBanner}</div>
        {importConfirmModal}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {importConfirmModal}
      {/* Backup controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {exportImportControls}
        {importMsgBanner}
      </div>

      {/* Stats bar — scoped to the active recommended-call filter */}
      <div className="space-y-2" data-testid="stats-summary">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest" data-testid="stats-scope-label">{scopeLabel}</p>
          {directionFilter !== "all" && (
            <button
              onClick={() => setDirectionFilter("all")}
              className="text-[10px] text-primary hover:underline"
              data-testid="stats-clear-filter"
            >
              Show all
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Analyses", value: String(stats.count), testid: "stat-count" },
            { label: "Avg Score", value: `${stats.avgScore}/100`, testid: "stat-avg-score" },
            { label: "Qualify Rate", value: `${stats.qualifyRate}%`, testid: "stat-qualify-rate" },
          ].map(({ label, value, testid }) => (
            <div key={label} className="bg-card border border-border rounded p-3 text-center" data-testid={testid}>
              <div className="text-base font-bold text-foreground tabular-nums">{value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawn vs. AI direction agreement — scoped to the active filter */}
      {stats.comparableCount > 0 && (
        <div className="bg-card border border-border rounded p-3 flex items-center justify-between" data-testid="direction-match-stat">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Drawn vs. AI Direction</p>
            <p className="text-[11px] text-muted-foreground/70 mt-1 leading-relaxed">
              {directionFilter === "all"
                ? "How often your drawn direction agreed with the copilot's recommendation."
                : `How often you agreed with the copilot's ${scopeLabel.replace(/ Calls$/, "")} calls.`}
            </p>
          </div>
          <div className="text-right flex-shrink-0 pl-3">
            <div className={`text-2xl font-bold tabular-nums ${stats.matchRate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>{stats.matchRate}%</div>
            <div className="text-[10px] text-muted-foreground">{stats.agreeCount} of {stats.comparableCount} agreed</div>
          </div>
        </div>
      )}

      {/* Grade distribution */}
      <div className="bg-card border border-border rounded p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2.5">Grade Distribution</p>
        <div className="flex gap-2 items-end h-10">
          {GRADE_ORDER.map((g) => {
            const count = gradeCounts[g] || 0;
            const pct = entries.length ? (count / entries.length) * 100 : 0;
            return (
              <div key={g} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] text-muted-foreground tabular-nums">{count}</span>
                <div className="w-full rounded-sm bg-muted/30 relative" style={{ height: "24px" }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-sm transition-all duration-500 ${
                      g === "A+" || g === "A" ? "bg-emerald-500" :
                      g === "B" ? "bg-amber-500" :
                      g === "C" ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${gradeTextColor(g)}`}>{g}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your placed-setup grade distribution */}
      {placedEntries.length > 0 && (
        <div className="bg-card border border-border rounded p-3" data-testid="placed-grade-distribution">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2.5">
            Your Setup Grades <span className="text-muted-foreground/60 normal-case tracking-normal">· {placedEntries.length} drawn</span>
          </p>
          <div className="flex gap-2 items-end h-10">
            {GRADE_ORDER.map((g) => {
              const count = placedGradeCounts[g] || 0;
              const pct = placedEntries.length ? (count / placedEntries.length) * 100 : 0;
              return (
                <div key={g} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-muted-foreground tabular-nums">{count}</span>
                  <div className="w-full rounded-sm bg-muted/30 relative" style={{ height: "24px" }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-sm transition-all duration-500 ${
                        g === "A+" || g === "A" ? "bg-emerald-500" :
                        g === "B" ? "bg-amber-500" :
                        g === "C" ? "bg-orange-500" : "bg-red-500"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${gradeTextColor(g)}`}>{g}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direction filter */}
      <div className="bg-card border border-border rounded p-3" data-testid="direction-filter">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2.5">Filter by Recommended Call</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDirectionFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              directionFilter === "all"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
            data-testid="filter-direction-all"
          >
            All <span className="tabular-nums opacity-70">{entries.length}</span>
          </button>
          {DIRECTION_FILTERS.map(({ key, label }) => {
            // Hide the "Unspecified" pill unless there are legacy entries for it.
            if (key === "unspecified" && directionCounts.unspecified === 0) return null;
            const active = directionFilter === key;
            const color = key === "unspecified" ? "" : directionTextColor(label);
            return (
              <button
                key={key}
                onClick={() => setDirectionFilter(key)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
                data-testid={`filter-direction-${key}`}
              >
                <span className={active ? "" : color}>{label}</span>{" "}
                <span className="tabular-nums opacity-70">{directionCounts[key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Entry list */}
      <div className="space-y-2">
        {visibleEntries.length === 0 ? (
          <div className="bg-card border border-border rounded p-6 text-center" data-testid="journal-filter-empty">
            <p className="text-sm text-muted-foreground">No entries match this filter.</p>
            <button
              onClick={() => setDirectionFilter("all")}
              className="text-xs text-primary hover:underline mt-1"
            >
              Show all entries
            </button>
          </div>
        ) : (
          visibleEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-card border border-border rounded overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className={`text-lg font-bold w-10 text-center tabular-nums ${gradeTextColor(entry.grade)}`}>{entry.grade}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <span>{entry.ticker}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{entry.timeframe}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className={entry.bias === "Bullish" ? "text-emerald-400" : entry.bias === "Bearish" ? "text-red-400" : "text-amber-400"}>
                    {entry.bias}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground">{formatTime(entry.timestamp)}</span>
                  </div>
                  {entry.recommended_direction && (() => {
                    const kind = directionKind(entry.recommended_direction);
                    const DirIcon = kind === "long" ? TrendingUp : kind === "short" ? TrendingDown : MinusCircle;
                    return (
                      <span
                        className={`flex items-center gap-1 text-[10px] font-semibold ${directionTextColor(entry.recommended_direction)}`}
                        data-testid={`entry-recommended-direction-${entry.id}`}
                      >
                        <DirIcon className="w-3 h-3" />
                        {entry.recommended_direction}
                      </span>
                    );
                  })()}
                  {entry.placed_setup?.direction && entry.recommended_direction && (() => {
                    const agree = directionsAgree(entry.placed_setup.direction, entry.recommended_direction);
                    const MatchIcon = agree ? Check : X;
                    return (
                      <span
                        className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                          agree
                            ? "text-emerald-400 border-emerald-800/50 bg-emerald-950/30"
                            : "text-amber-400 border-amber-800/50 bg-amber-950/30"
                        }`}
                        data-testid={`entry-direction-match-${entry.id}`}
                      >
                        <MatchIcon className="w-3 h-3" />
                        {agree ? "Matched" : "Differed"}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-foreground tabular-nums">{entry.score_total}<span className="text-muted-foreground font-normal">/100</span></div>
                <div className="text-[10px] mt-0.5">
                  {entry.qualifies
                    ? <span className="text-emerald-400">Qualifies</span>
                    : <span className="text-red-400">No qualify</span>}
                </div>
              </div>
              <div className="text-center flex-shrink-0 w-12 border-l border-border pl-2" data-testid={`entry-placed-grade-${entry.id}`}>
                {entry.placed_setup ? (
                  <span className={`text-base font-bold tabular-nums ${gradeTextColor(entry.placed_setup.grade)}`}>
                    {entry.placed_setup.grade || "—"}
                  </span>
                ) : (
                  <span className="text-base font-bold text-muted-foreground/40">—</span>
                )}
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide leading-tight mt-0.5">Your setup</div>
              </div>
            </div>
            {expanded === entry.id && (
              <div className="border-t border-border px-3 py-2.5 bg-background/40 space-y-1.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">R:R · <span className="text-foreground">{entry.rr_ratio}</span></p>
                {entry.recommended_direction && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide" data-testid={`entry-recommended-detail-${entry.id}`}>
                    Recommended ·{" "}
                    <span className={`font-semibold ${directionTextColor(entry.recommended_direction)}`}>{entry.recommended_direction}</span>
                    {entry.recommended_entry && <> · Entry <span className="text-foreground">{entry.recommended_entry}</span></>}
                  </p>
                )}
                {entry.placed_setup && (
                  <div className="rounded border border-border bg-card/60 px-2.5 py-2" data-testid={`entry-placed-readback-${entry.id}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Your placed setup</p>
                      <span className={`text-xs font-bold ${gradeTextColor(entry.placed_setup.grade)}`}>{entry.placed_setup.grade || "—"}</span>
                    </div>
                    <p className="text-[11px] text-foreground/80 mt-1 leading-relaxed">
                      {entry.placed_setup.direction || "—"}
                      {entry.placed_setup.entry && <> · Entry <span className="text-foreground">{entry.placed_setup.entry}</span></>}
                      {entry.placed_setup.stop && <> · Stop <span className="text-foreground">{entry.placed_setup.stop}</span></>}
                      {entry.placed_setup.targets && <> · Targets <span className="text-foreground">{entry.placed_setup.targets}</span></>}
                    </p>
                    {entry.placed_setup.direction && entry.recommended_direction && (() => {
                      const agree = directionsAgree(entry.placed_setup.direction, entry.recommended_direction);
                      return (
                        <p
                          className={`text-[10px] mt-1.5 leading-relaxed ${agree ? "text-emerald-400" : "text-amber-400"}`}
                          data-testid={`entry-direction-match-detail-${entry.id}`}
                        >
                          {agree
                            ? `Your drawn ${entry.placed_setup.direction} matched the copilot's ${entry.recommended_direction} call.`
                            : `You drew ${entry.placed_setup.direction}, but the copilot recommended ${entry.recommended_direction}.`}
                        </p>
                      );
                    })()}
                  </div>
                )}
                <p className="text-xs text-foreground/80 leading-relaxed">{entry.full_analysis}</p>
              </div>
            )}
          </div>
          ))
        )}
      </div>

      {/* Clear */}
      <div className="pt-1">
        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear journal
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Delete all {entries.length} entries?</span>
            <button onClick={() => { onClear(); setConfirmClear(false); }} className="text-xs text-red-400 hover:text-red-300">Yes, clear</button>
            <button onClick={() => setConfirmClear(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/NewsTab.tsx`

```tsx
import { useState, useCallback, useRef } from "react";
import { useAnalyzeNews } from "@workspace/api-client-react";
import { useAccess } from "@/lib/access-context";
import { Paywall } from "@/components/Paywall";
import { LoadingState } from "@/components/loading-state";
import { FileUpload } from "@/components/ui/file-upload";
import { SectionBlock, WarnBox, CollapsibleSection } from "@/components/shared";
import { NEWS_MESSAGES, biasColor, levelColor } from "@/lib/display";
import type { TradingSettings } from "@/lib/types";
import { prepareImage } from "@/lib/image";
import {
  Newspaper,
  Activity,
  Gauge,
  Lightbulb,
  CalendarClock,
  ListChecks,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export function NewsTab({ settings }: { settings: TradingSettings }) {
  const [newsText, setNewsText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [base64, setBase64] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const mutation = useAnalyzeNews();
  const uploadSeq = useRef(0);
  const { access, refresh } = useAccess();

  const handleUpload = useCallback((f: File) => {
    const seq = ++uploadSeq.current;
    setFile(f);
    setResult(null);
    setBase64(null);
    setPreviewUrl(URL.createObjectURL(f));
    prepareImage(f)
      .then((img) => {
        if (uploadSeq.current !== seq) return;
        setBase64(img.base64);
        setMediaType(img.mediaType);
      })
      .catch(() => {});
  }, []);

  const handleClearImage = useCallback(() => {
    uploadSeq.current++;
    setFile(null);
    setPreviewUrl(undefined);
    setBase64(null);
    setMediaType(null);
  }, []);

  const canSubmit = newsText.trim().length > 0 || !!base64;

  const runPrediction = () => {
    if (!canSubmit) return;
    mutation.mutate(
      {
        data: {
          newsText: newsText.trim() ? newsText.trim() : null,
          imageBase64: base64,
          mediaType: base64 ? mediaType : null,
          ticker: settings.ticker || null,
          accountSize: settings.accountSize ?? null,
          maxRiskPct: settings.maxRiskPct ?? null,
          minRR: settings.minRR ?? null,
          longCriteria: settings.longCriteria ?? [],
          shortCriteria: settings.shortCriteria ?? [],
          riskRules: settings.riskRules ?? [],
          assetClass: settings.assetClass,
        },
      },
      {
        onSuccess: (data) => {
          setResult(data);
          refresh();
        },
        onError: () => refresh(),
      }
    );
  };

  const reset = () => {
    setResult(null);
    setNewsText("");
    handleClearImage();
  };

  if (access && !access.canUse) {
    return <Paywall />;
  }

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          News Impact Predictor
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Paste a headline or upcoming economic event (or upload a screenshot), and get a plain-English
          read on how it could move {settings.ticker || "the market"} — direction, expected swings, and
          whether it's worth trading.
        </p>
      </div>

      {!result && !mutation.isPending && (
        <div className="space-y-4">
          {/* News text */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">
              What's the news?
            </label>
            <textarea
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              rows={4}
              placeholder="e.g. CPI inflation report due tomorrow 8:30am ET, expected 3.1%. Or: Fed signaled possible rate cut..."
              className="w-full text-base px-3.5 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
              data-testid="input-news-text"
            />
          </div>

          {/* Optional screenshot */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">
              Add a screenshot <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <FileUpload
              onUpload={handleUpload}
              onClear={handleClearImage}
              previewUrl={previewUrl}
              data-testid="upload-zone-news"
            />
          </div>

          {mutation.isError && (
            <WarnBox text="Couldn't read that news. Please add some text or a clearer screenshot and try again." />
          )}

          <button
            onClick={runPrediction}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground text-base font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="button-predict-news"
          >
            <TrendingUp className="w-5 h-5" />
            Predict market impact
          </button>
          {!canSubmit && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Type some news or upload a screenshot to get started.
            </p>
          )}
        </div>
      )}

      {mutation.isPending && <LoadingState messages={NEWS_MESSAGES} />}

      {result && (
        <div className="space-y-4" data-testid="news-result">
          {/* Headline prediction */}
          <div className="border border-primary/30 bg-card rounded-lg p-5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Likely market direction
            </p>
            <div className={`font-display text-4xl font-bold leading-none ${biasColor(result.direction)}`} data-testid="text-news-direction">
              {result.direction}
            </div>
            <p className="text-base text-foreground mt-3 leading-relaxed">{result.summary}</p>
          </div>

          {/* Quick gauges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-lg p-3.5 text-center">
              <Activity className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
              <div className={`text-lg font-bold ${levelColor(result.impact)}`}>{result.impact}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Impact</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3.5 text-center">
              <Gauge className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
              <div className={`text-lg font-bold ${levelColor(result.volatility)}`}>{result.volatility}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Volatility</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3.5 text-center">
              <Sparkles className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
              <div className="text-lg font-bold text-primary tabular-nums">{Math.round(result.confidence)}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Confidence</div>
            </div>
          </div>

          {/* When */}
          {result.affected_window && (
            <div className="flex items-start gap-2.5 bg-muted/20 border border-border rounded-lg p-3.5">
              <CalendarClock className="w-4.5 h-4.5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">When to watch</p>
                <p className="text-sm text-foreground mt-0.5 leading-relaxed">{result.affected_window}</p>
              </div>
            </div>
          )}

          {(result.key_events || []).length > 0 && (
            <SectionBlock title="Key events spotted" icon={ListChecks}>
              <ul className="space-y-2">
                {(result.key_events || []).map((ev: string, i: number) => (
                  <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    {ev}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          <SectionBlock title="What this means for your trading" icon={TrendingUp}>
            <p className="text-base text-foreground leading-relaxed font-medium">{result.trade_recommendation}</p>
          </SectionBlock>

          <CollapsibleSection title="Why — in plain English" icon={Newspaper}>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
          </CollapsibleSection>

          {result.beginner_tip && (
            <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-lg p-4">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-primary">Beginner tip</p>
                <p className="text-sm text-foreground mt-1 leading-relaxed">{result.beginner_tip}</p>
              </div>
            </div>
          )}

          {(result.warnings || []).map((w: string, i: number) => (
            <WarnBox key={i} text={w} />
          ))}

          <button
            onClick={reset}
            className="w-full py-3 text-sm font-semibold text-muted-foreground border border-border rounded-lg hover:bg-muted/20 transition-colors"
            data-testid="button-new-news"
          >
            Check another headline
          </button>
        </div>
      )}
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/PlanTab.tsx`

```tsx
import { useState } from "react";
import { EditableRuleList } from "@/components/EditableRuleList";
import type { TradingSettings } from "@/lib/types";
import { computePositionSize, ASSET_CLASS_LABELS } from "@/lib/instruments";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Calculator,
  Activity,
  Settings,
  DollarSign,
  Scale,
} from "lucide-react";

export function PlanTab({ settings, onSettingsChange }: {
  settings: TradingSettings;
  onSettingsChange: (s: TradingSettings) => void;
}) {
  const {
    accountSize, maxRiskPct, maxDailyDrawdownPct, minRR, ticker, defaultTimeframe,
    assetClass, pointValue, quantityLabel, currency,
  } = settings;
  const maxRisk = accountSize * (maxRiskPct / 100);
  const maxDaily = accountSize * (maxDailyDrawdownPct / 100);
  const maxTrades = maxRisk > 0 ? Math.floor(maxDaily / maxRisk) : 0;
  const minReward = maxRisk * minRR;

  const [calcMode, setCalcMode] = useState<"dollar" | "size">("dollar");
  const [stopDistance, setStopDistance] = useState("");

  const update = (key: keyof TradingSettings) => (val: string[]) =>
    onSettingsChange({ ...settings, [key]: val });

  const timeframeLabel: Record<string, string> = {
    "1m": "1 Minute", "5m": "5 Minute", "15m": "15 Minute",
    "30m": "30 Minute", "1h": "1 Hour", "4h": "4 Hour", "1d": "Daily",
  };

  const money = (n: number) => {
    const formatted = n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return currency && currency !== "USD" ? `${formatted} ${currency}` : `$${formatted}`;
  };
  const unit = quantityLabel || "units";

  const stopNum = parseFloat(stopDistance);
  const sizing = computePositionSize({
    maxRisk,
    stopDistance: stopNum,
    pointValue,
    assetClass,
  });
  const targetDistance = isFinite(stopNum) && stopNum > 0 ? stopNum * minRR : 0;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Instrument &amp; Timeframe
          <span className="ml-auto text-[10px] normal-case tracking-normal font-normal text-muted-foreground/50 flex items-center gap-1">
            <Settings className="w-3 h-3" /> Edit in settings ↑
          </span>
        </h3>
        <EditableRuleList
          rules={[
            `Instrument: ${ticker} (${ASSET_CLASS_LABELS[assetClass]})`,
            `Primary timeframe: ${timeframeLabel[defaultTimeframe] ?? defaultTimeframe}`,
            `Point value: ${money(pointValue)} per 1.0 move, per ${unit.replace(/s$/, "")}`,
          ]}
          color="blue"
          onChange={() => {}}
        />
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" /> Long Criteria
        </h3>
        <EditableRuleList rules={settings.longCriteria} color="green" onChange={update("longCriteria")} />
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 flex items-center gap-2">
          <TrendingDown className="w-3.5 h-3.5" /> Short Criteria
        </h3>
        <EditableRuleList rules={settings.shortCriteria} color="red" onChange={update("shortCriteria")} />
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" /> Risk Rules
        </h3>
        <EditableRuleList
          rules={[
            `Max risk per trade: ${maxRiskPct}% of account`,
            `Max daily drawdown: ${maxDailyDrawdownPct}% of account`,
            `Minimum risk/reward: ${minRR}:1`,
            ...settings.riskRules,
          ]}
          color="amber"
          onChange={(next) => {
            // first 3 are derived from settings numbers — only pass the extras
            update("riskRules")(next.slice(3));
          }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5" /> Risk Calculator
          </h3>
          <span className="text-[10px] text-muted-foreground px-2 py-1 bg-muted/20 border border-border rounded">
            {money(accountSize)} account
          </span>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2 mb-3" data-testid="calc-mode-toggle">
          <button
            type="button"
            onClick={() => setCalcMode("dollar")}
            className={`flex items-center justify-center gap-2 py-2 rounded border text-xs font-semibold transition-colors ${
              calcMode === "dollar"
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid="button-calc-dollar"
          >
            <DollarSign className="w-3.5 h-3.5" /> Dollar risk
          </button>
          <button
            type="button"
            onClick={() => setCalcMode("size")}
            className={`flex items-center justify-center gap-2 py-2 rounded border text-xs font-semibold transition-colors ${
              calcMode === "size"
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid="button-calc-size"
          >
            <Scale className="w-3.5 h-3.5" /> Position size
          </button>
        </div>

        {calcMode === "dollar" ? (
          <div className="bg-card border border-border rounded overflow-hidden" data-testid="risk-calculator">
            {([
              ["Account size", money(accountSize)],
              [`Max risk per trade (${maxRiskPct}%)`, money(maxRisk)],
              [`Max daily loss (${maxDailyDrawdownPct}%)`, money(maxDaily)],
              [`Max daily trades at ${maxRiskPct}%`, `${maxTrades} trades`],
              [`Min R:R required`, `${minRR}:1`],
              [`Min reward per trade`, money(minReward)],
            ] as [string, string][]).map(([label, value], i, arr) => (
              <div
                key={label}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${i < arr.length - 1 ? "border-b border-border" : "font-semibold"}`}
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3" data-testid="position-size-calculator">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">
                Stop distance (points / price move)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={stopDistance}
                onChange={(e) => setStopDistance(e.target.value)}
                placeholder="e.g. 20 points from entry to stop"
                className="w-full text-sm px-3 py-2 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                data-testid="input-stop-distance"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                How far, in price, from your entry to your stop-loss.
              </p>
            </div>

            <div className="bg-card border border-border rounded overflow-hidden">
              {([
                [`Risk budget (${maxRiskPct}%)`, money(maxRisk)],
                [`Risk per ${unit.replace(/s$/, "")}`, sizing ? money(sizing.riskPerUnit) : "—"],
                [`Position size`, sizing && sizing.qty > 0 ? `${sizing.qty.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${unit}` : "—"],
                [`Actual risk at this size`, sizing && sizing.qty > 0 ? money(sizing.actualRisk) : "—"],
                [`Target distance (${minRR}:1)`, targetDistance > 0 ? `${targetDistance.toLocaleString(undefined, { maximumFractionDigits: 4 })} points` : "—"],
                [`Min reward per trade`, money(minReward)],
              ] as [string, string][]).map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${i < arr.length - 1 ? "border-b border-border" : "font-semibold"}`}
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground tabular-nums" data-testid={`size-row-${i}`}>{value}</span>
                </div>
              ))}
            </div>

            {sizing && sizing.qty === 0 && stopNum > 0 && (
              <p className="text-[11px] text-amber-400">
                Your risk budget is smaller than one {unit.replace(/s$/, "")} at this stop distance.
                Tighten the stop, raise your account size or risk %, or trade a smaller instrument.
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">
              Size = risk budget ÷ (stop distance × point value). Whole {unit} for futures and
              stocks; fractional for forex and crypto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/ReviewTab.tsx`

```tsx
import { useState, useCallback, useRef } from "react";
import { useReviewChart } from "@workspace/api-client-react";
import { useAccess } from "@/lib/access-context";
import { Paywall } from "@/components/Paywall";
import { LoadingState } from "@/components/loading-state";
import { FileUpload } from "@/components/ui/file-upload";
import { WarnBox, SectionBlock, CollapsibleSection } from "@/components/shared";
import { REVIEW_MESSAGES, gradeColors } from "@/lib/display";
import type { TradingSettings } from "@/lib/types";
import { prepareImage } from "@/lib/image";
import { BarChart2, AlertTriangle } from "lucide-react";

export function ReviewTab({ settings }: { settings: TradingSettings }) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [result, setResult] = useState<any>(null);
  const mutation = useReviewChart();
  const uploadSeq = useRef(0);
  const { access, refresh } = useAccess();

  const handleUpload = useCallback((f: File) => {
    const seq = ++uploadSeq.current;
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    prepareImage(f)
      .then((img) => {
        if (uploadSeq.current !== seq) return;
        mutation.mutate(
          {
            data: {
              imageBase64: img.base64,
              mediaType: img.mediaType,
              ticker: settings.ticker || null,
              timeframe: settings.defaultTimeframe || null,
              accountSize: settings.accountSize ?? null,
              maxRiskPct: settings.maxRiskPct ?? null,
              maxDailyDrawdownPct: settings.maxDailyDrawdownPct ?? null,
              minRR: settings.minRR ?? null,
              longCriteria: settings.longCriteria ?? [],
              shortCriteria: settings.shortCriteria ?? [],
              riskRules: settings.riskRules ?? [],
              assetClass: settings.assetClass,
            },
          },
          {
            onSuccess: (data) => {
              if (uploadSeq.current === seq) setResult(data);
              refresh();
            },
            onError: () => refresh(),
          }
        );
      })
      .catch(() => {});
  }, [settings]);

  const handleClear = useCallback(() => {
    uploadSeq.current++;
    setPreviewUrl(undefined);
    setResult(null);
  }, []);

  const gc = result ? gradeColors(result.trade_grade) : null;

  if (access && !access.canUse) {
    return <Paywall />;
  }

  return (
    <div>
      <FileUpload onUpload={handleUpload} onClear={handleClear} previewUrl={previewUrl} data-testid="upload-zone-review" />

      {mutation.isPending && (
        <div className="mt-4">
          <LoadingState messages={REVIEW_MESSAGES} />
        </div>
      )}

      {mutation.isError && (
        <div className="mt-4">
          <WarnBox text="Review didn't go through — the AI may be busy. Please try again in a moment." />
        </div>
      )}

      {result && gc && (
        <div className="mt-4 space-y-3" data-testid="review-results">
          <div className={`border rounded p-4 flex items-center justify-between ${gc.bg} ${gc.border}`}>
            <div>
              <div className={`text-5xl font-bold leading-none ${gc.letter}`}>{result.trade_grade}</div>
              <div className="text-xs text-muted-foreground mt-1.5">Overall trade grade</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground tabular-nums">{result.confidence_score}<span className="text-base text-muted-foreground font-normal">/100</span></div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Confidence</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Trend Alignment", value: result.trend_alignment },
              { label: "Risk/Reward", value: result.risk_reward_assessment },
              { label: "Long Setup", value: result.long_setup_quality },
              { label: "Short Setup", value: result.short_setup_quality },
              { label: "Support/Resistance", value: result.support_resistance_quality },
              { label: "Volume", value: result.volume_analysis },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border rounded p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
                <div className="text-sm text-foreground leading-snug">{value || "—"}</div>
              </div>
            ))}
          </div>

          <CollapsibleSection title="Full Review" icon={BarChart2} defaultOpen>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.full_review}</p>
          </CollapsibleSection>

          {(result.potential_risks || []).length > 0 && (
            <SectionBlock title="Potential Risks" icon={AlertTriangle}>
              <ul className="space-y-1.5">
                {result.potential_risks.map((r: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          <button
            onClick={() => { setResult(null); handleClear(); }}
            className="w-full py-2 text-sm text-muted-foreground border border-border rounded hover:bg-muted/20 transition-colors"
          >
            Review another chart
          </button>
        </div>
      )}
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/tabs/TimingTab.tsx`

```tsx
import { Clock, CalendarClock, Repeat, Timer, Eye, AlertTriangle } from "lucide-react";
import { SectionBlock } from "@/components/shared";
import { gradeTextColor, formatTime } from "@/lib/display";
import { usesSession } from "@/lib/instruments";
import type { JournalEntry } from "@/lib/types";

export function TimingTab({ entries }: { entries: JournalEntry[] }) {
  const latest = entries.find((e) => e.timing);

  if (!latest || !latest.timing) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6" data-testid="timing-empty">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">No timing read yet</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
          Analyze a chart on the Analyze tab and your time-aware game plan — when to execute, how
          long to hold, and what to watch — will appear here.
        </p>
      </div>
    );
  }

  const t = latest.timing;

  return (
    <div className="space-y-4" data-testid="timing-detail">
      {/* Context header */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Trade Timing
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Time-aware game plan from your most recent analysis
          {latest.ticker ? ` of ${latest.ticker}` : ""}
          {latest.timeframe ? ` (${latest.timeframe})` : ""}.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {latest.analysisTime && (
            <span className="text-[11px] px-2.5 py-1 bg-card border border-border rounded text-foreground font-medium flex items-center gap-1">
              <CalendarClock className="w-3 h-3 text-primary" /> Evaluated for {latest.analysisTime}
              {!latest.assetClass || usesSession(latest.assetClass) ? " ET" : ""}
            </span>
          )}
          {latest.grade && (
            <span className={`text-[11px] px-2.5 py-1 bg-card border border-border rounded font-medium ${gradeTextColor(latest.grade)}`}>
              Grade {latest.grade}
            </span>
          )}
          <span className="text-[11px] px-2.5 py-1 bg-card border border-border rounded text-muted-foreground font-medium">
            {formatTime(latest.timestamp)}
          </span>
        </div>
      </div>

      {/* Execution window */}
      <SectionBlock title="Execution Window" icon={CalendarClock}>
        <p className="text-base text-foreground leading-relaxed font-medium">{t.executionWindow}</p>
      </SectionBlock>

      {/* Hold guidance */}
      <SectionBlock title="Hold Guidance" icon={Timer}>
        <p className="text-sm text-foreground leading-relaxed">{t.holdGuidance}</p>
      </SectionBlock>

      {/* Session risk */}
      <div className="flex items-start gap-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg p-4">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">Session risk</p>
          <p className="text-sm text-foreground mt-1 leading-relaxed">{t.sessionRisk}</p>
        </div>
      </div>

      {/* Trend-flip signals */}
      {(t.flipSignals || []).length > 0 && (
        <SectionBlock title="Trend-Flip Signals" icon={Repeat}>
          <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">
            If these appear, the current bias may be reversing — reassess before adding or holding.
          </p>
          <ul className="space-y-2">
            {t.flipSignals.map((s, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                <Repeat className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </SectionBlock>
      )}

      {/* Exit watchlist */}
      {(t.exitWatchlist || []).length > 0 && (
        <SectionBlock title="Exit Watchlist" icon={Eye}>
          <ul className="space-y-2">
            {t.exitWatchlist.map((s, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm text-foreground leading-relaxed">
                <Eye className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </SectionBlock>
      )}
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/ui/accordion.tsx`

```tsx
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

### `artifacts/trading-copilot/src/components/ui/alert-dialog.tsx`

```tsx
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

### `artifacts/trading-copilot/src/components/ui/alert.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```

### `artifacts/trading-copilot/src/components/ui/aspect-ratio.tsx`

```tsx
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
```

### `artifacts/trading-copilot/src/components/ui/avatar.tsx`

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

### `artifacts/trading-copilot/src/components/ui/badge.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // @replit
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate ",
  {
    variants: {
      variant: {
        default:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          // @replit no hover because we use hover-elevate
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
          // @replit shadow-xs" - use badge outline variable
        outline: "text-foreground border [border-color:var(--badge-outline)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### `artifacts/trading-copilot/src/components/ui/breadcrumb.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
```

### `artifacts/trading-copilot/src/components/ui/button-group.tsx`

```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "bg-muted shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
```

### `artifacts/trading-copilot/src/components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
" hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
           // @replit: no hover, and add primary border
           "bg-primary text-primary-foreground border border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
        outline:
          // @replit Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color. Uses shadow-xs. no shadow on active
          // No hover state
          " border [border-color:var(--button-outline)] shadow-xs active:shadow-none ",
        secondary:
          // @replit border, no hover, no shadow, secondary border.
          "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // @replit no hover, transparent border
        ghost: "border border-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // @replit changed sizes
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### `artifacts/trading-copilot/src/components/ui/calendar.tsx`

```tsx
"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
```

### `artifacts/trading-copilot/src/components/ui/card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### `artifacts/trading-copilot/src/components/ui/carousel.tsx`

```tsx
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

### `artifacts/trading-copilot/src/components/ui/chart.tsx`

```tsx
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`
              const itemConfig = getPayloadConfigFromPayload(config, item, key)
              const indicatorColor = color || item.payload.fill || item.color

              return (
                <div
                  key={item.dataKey}
                  className={cn(
                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                    indicator === "dot" && "items-center"
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              }
                            )}
                            style={
                              {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              } as React.CSSProperties
                            }
                          />
                        )
                      )}
                      <div
                        className={cn(
                          "flex flex-1 justify-between leading-none",
                          nestLabel ? "items-end" : "items-center"
                        )}
                      >
                        <div className="grid gap-1.5">
                          {nestLabel ? tooltipLabel : null}
                          <span className="text-muted-foreground">
                            {itemConfig?.label || item.name}
                          </span>
                        </div>
                        {item.value && (
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)

            return (
              <div
                key={item.value}
                className={cn(
                  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                )}
              >
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                )}
                {itemConfig?.label}
              </div>
            )
          })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

### `artifacts/trading-copilot/src/components/ui/checkbox.tsx`

```tsx
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("grid place-content-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

### `artifacts/trading-copilot/src/components/ui/collapsible.tsx`

```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

### `artifacts/trading-copilot/src/components/ui/command.tsx`

```tsx
"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
```

### `artifacts/trading-copilot/src/components/ui/context-menu.tsx`

```tsx
import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
```

### `artifacts/trading-copilot/src/components/ui/dialog.tsx`

```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

### `artifacts/trading-copilot/src/components/ui/drawer.tsx`

```tsx
import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
```

### `artifacts/trading-copilot/src/components/ui/dropdown-menu.tsx`

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

### `artifacts/trading-copilot/src/components/ui/empty.tsx`

```tsx
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
```

### `artifacts/trading-copilot/src/components/ui/field.tsx`

```tsx
"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field data-[invalid=true]:text-destructive flex w-full gap-3",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start",
        ],
        responsive: [
          "@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm font-normal leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
```

### `artifacts/trading-copilot/src/components/ui/file-upload.tsx`

```tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { UploadCloud, X, RefreshCw, Maximize2, Trash2 } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  onClear: () => void;
  previewUrl?: string;
  className?: string;
}

export function FileUpload({ onUpload, onClear, previewUrl, className = "" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find(file => file.type.startsWith('image/'));

      if (imageFile) {
        onUpload(imageFile);
      }
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.type.startsWith('image/')) {
          onUpload(file);
        }
      }
      // Reset so picking the same filename again still fires onChange.
      e.target.value = "";
    },
    [onUpload]
  );

  // Close the detail lightbox on Escape.
  useEffect(() => {
    if (!showDetail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDetail(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDetail]);

  if (previewUrl) {
    return (
      <>
        <div className={`relative rounded-lg overflow-hidden border border-border group ${className}`}>
          <button
            type="button"
            onClick={() => setShowDetail(true)}
            className="block w-full cursor-zoom-in"
            aria-label="View chart in detail"
            data-testid="button-detail-chart"
          >
            <img
              src={previewUrl}
              alt="Chart preview"
              className="w-full h-auto object-contain max-h-[400px] bg-muted/20"
            />
          </button>

          <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => replaceInputRef.current?.click()}
              title="Replace image"
              aria-label="Replace image"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/90 border border-border text-xs font-medium text-foreground hover:bg-background hover:border-primary/50 transition-colors backdrop-blur-sm"
              data-testid="button-replace-chart"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => setShowDetail(true)}
              title="View image detail"
              aria-label="View image detail"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/90 border border-border text-xs font-medium text-foreground hover:bg-background hover:border-primary/50 transition-colors backdrop-blur-sm"
              data-testid="button-detail-chart-toolbar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Detail
            </button>
            <button
              type="button"
              onClick={onClear}
              title="Remove image"
              aria-label="Remove image"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/90 border border-border text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors backdrop-blur-sm"
              data-testid="button-remove-chart"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={replaceInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {showDetail && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chart detail view"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
            onClick={() => setShowDetail(false)}
            data-testid="chart-detail-overlay"
          >
            <button
              type="button"
              onClick={() => setShowDetail(false)}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Close detail view"
              data-testid="button-close-detail"
            >
              <X className="w-4 h-4" />
              Close
            </button>
            <img
              src={previewUrl}
              alt="Chart detail"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
      } ${className}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
        <p className="text-sm font-medium mb-1">
          Drag & drop chart image or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PNG, JPG, WEBP
        </p>
      </label>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/components/ui/form.tsx`

```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

### `artifacts/trading-copilot/src/components/ui/hover-card.tsx`

```tsx
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
```

### `artifacts/trading-copilot/src/components/ui/input-group.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group border-input dark:bg-input/30 shadow-xs relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]",
        "h-9 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
```

### `artifacts/trading-copilot/src/components/ui/input-otp.tsx`

```tsx
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
```

### `artifacts/trading-copilot/src/components/ui/input.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### `artifacts/trading-copilot/src/components/ui/item.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-muted-foreground line-clamp-2 text-balance text-sm font-normal leading-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
```

### `artifacts/trading-copilot/src/components/ui/kbd.tsx`

```tsx
import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
```

### `artifacts/trading-copilot/src/components/ui/label.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

### `artifacts/trading-copilot/src/components/ui/menubar.tsx`

```tsx
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
```

### `artifacts/trading-copilot/src/components/ui/navigation-menu.tsx`

```tsx
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
```

### `artifacts/trading-copilot/src/components/ui/pagination.tsx`

```tsx
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
```

### `artifacts/trading-copilot/src/components/ui/popover.tsx`

```tsx
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
```

### `artifacts/trading-copilot/src/components/ui/progress.tsx`

```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

### `artifacts/trading-copilot/src/components/ui/radio-group.tsx`

```tsx
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

### `artifacts/trading-copilot/src/components/ui/resizable.tsx`

```tsx
"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
```

### `artifacts/trading-copilot/src/components/ui/scroll-area.tsx`

```tsx
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

### `artifacts/trading-copilot/src/components/ui/select.tsx`

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

### `artifacts/trading-copilot/src/components/ui/separator.tsx`

```tsx
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

### `artifacts/trading-copilot/src/components/ui/sheet.tsx`

```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

### `artifacts/trading-copilot/src/components/ui/sidebar.tsx`

```tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-[var(--sidebar-width)] p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4))]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4)+2px)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  // Note: Tailwind v3.4 doesn't support "in-" selectors. So the rail won't work perfectly.
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[var(--skeleton-width)] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline outline-2 outline-transparent outline-offset-2 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
```

### `artifacts/trading-copilot/src/components/ui/skeleton.tsx`

```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

### `artifacts/trading-copilot/src/components/ui/slider.tsx`

```tsx
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

### `artifacts/trading-copilot/src/components/ui/sonner.tsx`

```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```

### `artifacts/trading-copilot/src/components/ui/spinner.tsx`

```tsx
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
```

### `artifacts/trading-copilot/src/components/ui/switch.tsx`

```tsx
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

### `artifacts/trading-copilot/src/components/ui/table.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

### `artifacts/trading-copilot/src/components/ui/tabs.tsx`

```tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

### `artifacts/trading-copilot/src/components/ui/textarea.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
```

### `artifacts/trading-copilot/src/components/ui/toast.tsx`

```tsx
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

### `artifacts/trading-copilot/src/components/ui/toaster.tsx`

```tsx
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

### `artifacts/trading-copilot/src/components/ui/toggle-group.tsx`

```tsx
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
```

### `artifacts/trading-copilot/src/components/ui/toggle.tsx`

```tsx
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
```

### `artifacts/trading-copilot/src/components/ui/tooltip.tsx`

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

### `artifacts/trading-copilot/src/hooks/use-mobile.tsx`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

### `artifacts/trading-copilot/src/hooks/use-toast.ts`

```ts
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

### `artifacts/trading-copilot/src/index.css`

```css
@layer theme, base, clerk, components, utilities;
@import "tailwindcss";
@import "@clerk/themes/shadcn.css";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";

/* Clerk inputs on dark surfaces need a visible placeholder. */
.cl-formFieldInput::placeholder {
  color: hsl(var(--muted-foreground));
  opacity: 1;
}

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-card-border: hsl(var(--card-border));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-popover-border: hsl(var(--popover-border));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-primary-border: var(--primary-border);

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-secondary-border: var(--secondary-border);

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-muted-border: var(--muted-border);

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-accent-border: var(--accent-border);

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-destructive-border: var(--destructive-border);

  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));

  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-border: hsl(var(--sidebar-border));
  --color-sidebar-primary: hsl(var(--sidebar-primary));
  --color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
  --color-sidebar-primary-border: var(--sidebar-primary-border);
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
  --color-sidebar-accent-border: var(--sidebar-accent-border);
  --color-sidebar-ring: hsl(var(--sidebar-ring));

  --font-sans: var(--app-font-sans);
  --font-serif: var(--app-font-serif);
  --font-mono: var(--app-font-mono);
  --font-display: var(--app-font-display);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --button-outline: rgba(255,255,255, .10);
  --badge-outline: rgba(255,255,255, .05);
  --opaque-button-border-intensity: 9;
  --elevate-1: rgba(255,255,255, .04);
  --elevate-2: rgba(255,255,255, .09);

  /* Dark navy/charcoal for terminal feel */
  --background: 220 20% 6%;
  --foreground: 210 40% 98%;

  --border: 215 15% 15%;
  --input: 215 15% 15%;
  --ring: 262 78% 60%;

  --card: 220 20% 8%;
  --card-foreground: 210 40% 98%;
  --card-border: 215 15% 15%;

  --sidebar: 220 20% 8%;
  --sidebar-foreground: 210 40% 98%;
  --sidebar-border: 215 15% 15%;
  --sidebar-primary: 262 78% 60%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 215 15% 15%;
  --sidebar-accent-foreground: 210 40% 98%;
  --sidebar-ring: 262 78% 60%;

  --popover: 220 20% 8%;
  --popover-foreground: 210 40% 98%;
  --popover-border: 215 15% 15%;

  /* Royal purple */
  --primary: 262 78% 60%;
  --primary-foreground: 0 0% 100%;

  --secondary: 215 15% 15%;
  --secondary-foreground: 210 40% 98%;

  --muted: 215 15% 15%;
  --muted-foreground: 215 20% 65%;

  --accent: 215 15% 15%;
  --accent-foreground: 210 40% 98%;

  /* Red/Bearish */
  --destructive: 0 62.8% 50.6%;
  --destructive-foreground: 0 0% 100%;
  
  /* Indicators */
  --chart-1: 142 71% 45%; /* Green/Bullish */
  --chart-2: 0 62.8% 50.6%; /* Red/Bearish */
  --chart-3: 38 92% 50%; /* Amber/Warning */
  --chart-4: 210 70% 50%; /* Blue */
  --chart-5: 280 65% 60%; /* Purple */

  --app-font-sans: "Helvetica Neue", Helvetica, Arial, "Segoe UI", Roboto, sans-serif;
  --app-font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
  --app-font-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --app-font-display: "Futura", "Futura PT", "Jost", "Helvetica Neue", Helvetica, Arial, sans-serif;
  
  --radius: 0.25rem;

  --shadow-2xs: 0px 2px 0px 0px hsl(var(--border) / 0.2);
  --shadow-xs: 0px 2px 0px 0px hsl(var(--border) / 0.2);
  --shadow-sm: 0px 2px 0px 0px hsl(var(--border) / 0.2), 0px 1px 2px -1px hsl(var(--border) / 0.2);
  --shadow: 0px 2px 0px 0px hsl(var(--border) / 0.2), 0px 1px 2px -1px hsl(var(--border) / 0.2);
  --shadow-md: 0px 2px 0px 0px hsl(var(--border) / 0.2), 0px 2px 4px -1px hsl(var(--border) / 0.2);
  --shadow-lg: 0px 2px 0px 0px hsl(var(--border) / 0.2), 0px 4px 6px -1px hsl(var(--border) / 0.2);
  --shadow-xl: 0px 2px 0px 0px hsl(var(--border) / 0.2), 0px 8px 10px -1px hsl(var(--border) / 0.2);
  --shadow-2xl: 0px 2px 0px 0px hsl(var(--border) / 0.2);

  --primary-border: hsl(var(--primary));
  --secondary-border: hsl(var(--secondary));
  --muted-border: hsl(var(--muted));
  --accent-border: hsl(var(--accent));
  --destructive-border: hsl(var(--destructive));
  --sidebar-primary-border: hsl(var(--sidebar-primary));
  --sidebar-accent-border: hsl(var(--sidebar-accent));
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply font-sans antialiased bg-background text-foreground;
  }
}
```

### `artifacts/trading-copilot/src/lib/access-context.tsx`

```tsx
import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMe,
  getGetMeQueryKey,
  type MeResponse,
} from "@workspace/api-client-react";

interface AccessContextValue {
  access: MeResponse | undefined;
  isLoading: boolean;
  refresh: () => void;
}

const AccessContext = createContext<AccessContextValue | null>(null);

// In local dev the server runs in test mode and grants unlimited access, so
// fetch /me even when signed out to reflect that in the UI.
const TEST_MODE = import.meta.env.DEV;

export function AccessProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetMe({
    query: { enabled: !!isSignedIn || TEST_MODE, queryKey: getGetMeQueryKey() },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  return (
    <AccessContext.Provider value={{ access: data, isLoading, refresh }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess(): AccessContextValue {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error("useAccess must be used within an AccessProvider");
  }
  return ctx;
}
```

### `artifacts/trading-copilot/src/lib/display.ts`

```ts
export const ANALYZE_MESSAGES = [
  "Reading chart indicators...",
  "Identifying market structure...",
  "Checking 200 EMA position...",
  "Analyzing RSI and volume...",
  "Calculating risk/reward...",
  "Grading setup quality...",
  "Mapping the timing window...",
];

export const REVIEW_MESSAGES = ["Generating full trader review..."];

export const NEWS_MESSAGES = [
  "Reading the news...",
  "Identifying key events...",
  "Gauging market reaction...",
  "Estimating volatility...",
  "Writing a plain-English summary...",
];

export const DEBRIEF_MESSAGES = [
  "Replaying the trade...",
  "Reading what the chart did...",
  "Comparing entry, stop, and target...",
  "Finding what went wrong...",
  "Writing your lessons...",
];

export function levelColor(level: string) {
  const l = (level || "").toLowerCase();
  if (l === "high") return "text-red-400";
  if (l === "medium") return "text-amber-400";
  return "text-emerald-400";
}

export function gradeColors(grade: string) {
  if (grade === "A+" || grade === "A") return { bg: "bg-emerald-950/60", border: "border-emerald-700/60", letter: "text-emerald-400" };
  if (grade === "B") return { bg: "bg-amber-950/60", border: "border-amber-700/60", letter: "text-amber-400" };
  if (grade === "C") return { bg: "bg-orange-950/60", border: "border-orange-700/60", letter: "text-orange-400" };
  return { bg: "bg-red-950/60", border: "border-red-700/60", letter: "text-red-400" };
}

export function biasColor(bias: string) {
  if (bias === "Bullish") return "text-emerald-400";
  if (bias === "Bearish") return "text-red-400";
  return "text-amber-400";
}

// Classify a recommended trade direction string ("Long" / "Short" / "No Trade"
// or anything else) so the journal can color and icon it consistently.
export function directionKind(direction: string): "long" | "short" | "none" {
  const d = (direction || "").toLowerCase();
  if (/long/.test(d)) return "long";
  if (/short/.test(d)) return "short";
  return "none";
}

// Bucket a journal entry's recommended direction for filtering. Entries with no
// recommended_direction (older entries / imported backups) fall into
// "unspecified" so they stay visible under their own group.
export type DirectionBucket = "long" | "short" | "none" | "unspecified";

export function directionBucket(direction: string | undefined): DirectionBucket {
  if (!direction) return "unspecified";
  return directionKind(direction);
}

export function directionTextColor(direction: string) {
  const kind = directionKind(direction);
  if (kind === "long") return "text-emerald-400";
  if (kind === "short") return "text-red-400";
  return "text-amber-400";
}

// Whether the trader's drawn ("placed") direction agrees with the AI's
// recommended direction. Compares by kind (long/short/none) so "Long" matches
// "Long Setup" and "No Trade" matches a neutral/none recommendation.
export function directionsAgree(placed: string, recommended: string): boolean {
  return directionKind(placed) === directionKind(recommended);
}

export function gradeTextColor(grade: string) {
  if (grade === "A+" || grade === "A") return "text-emerald-400";
  if (grade === "B") return "text-amber-400";
  if (grade === "C") return "text-orange-400";
  return "text-red-400";
}

export function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
```

### `artifacts/trading-copilot/src/lib/image.ts`

```ts
export interface PreparedImage {
  base64: string;
  mediaType: string;
}

const MAX_EDGE = 1568;
// PNG is preferred for charts (lossless), but guard against the model's per-image
// size limit on unusually heavy screenshots by falling back to high-quality JPEG.
const MAX_PNG_BASE64 = 4_500_000;
const JPEG_FALLBACK_QUALITY = 0.92;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function stripDataUrl(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to decode image"));
    img.src = src;
  });
}

/**
 * Downscale an image to targetW x targetH using progressive halving. Stepping
 * down in halves (instead of one big jump) with high-quality smoothing keeps
 * thin candles, gridlines and small price/indicator text legible — exactly the
 * detail the model needs to read a chart accurately. The final pass flattens
 * onto a white matte so transparent PNGs don't turn black. Returns null if a 2D
 * context isn't available (caller falls back to the raw bytes).
 */
function renderToCanvas(img: HTMLImageElement, targetW: number, targetH: number): HTMLCanvasElement | null {
  let src: CanvasImageSource = img;
  let curW = img.naturalWidth;
  let curH = img.naturalHeight;

  while (curW >= targetW * 2 && curH >= targetH * 2) {
    const stepW = Math.max(targetW, Math.floor(curW / 2));
    const stepH = Math.max(targetH, Math.floor(curH / 2));
    const step = document.createElement("canvas");
    step.width = stepW;
    step.height = stepH;
    const sctx = step.getContext("2d");
    if (!sctx) return null;
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(src, 0, 0, stepW, stepH);
    src = step;
    curW = stepW;
    curH = stepH;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(src, 0, 0, targetW, targetH);
  return canvas;
}

/**
 * Read an uploaded chart/news screenshot and prepare it for the AI backend.
 * Oversized images are downscaled (longest edge capped at MAX_EDGE) with a
 * high-quality stepped resample and re-encoded as lossless PNG so chart detail
 * stays crisp. Already-small PNG/JPEG uploads are sent untouched. If anything in
 * the canvas pipeline fails (e.g. an exotic format the browser can't decode), it
 * falls back to the raw file bytes so uploads never silently break.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const dataUrl = await readAsDataUrl(file);
  const fallback: PreparedImage = {
    base64: stripDataUrl(dataUrl),
    mediaType: file.type || "image/png",
  };

  try {
    const img = await loadImage(dataUrl);
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    const needsResize = longest > MAX_EDGE;

    // Already within limits and a format the model reads natively: send the
    // original bytes untouched (lossless — no re-encoding artifacts).
    if (!needsResize && (file.type === "image/png" || file.type === "image/jpeg")) {
      return fallback;
    }

    const scale = needsResize ? MAX_EDGE / longest : 1;
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = renderToCanvas(img, width, height);
    if (!canvas) return fallback;

    // Lossless PNG keeps candles, gridlines, price labels and indicator text
    // sharp. JPEG compression blurs thin lines and small text, which is the
    // chart detail the model relies on.
    const png = canvas.toDataURL("image/png");
    if (png.startsWith("data:image/png")) {
      const b64 = stripDataUrl(png);
      if (b64.length <= MAX_PNG_BASE64) {
        return { base64: b64, mediaType: "image/png" };
      }
    }

    // Heavy screenshot: fall back to high-quality JPEG to stay under size limits.
    const jpeg = canvas.toDataURL("image/jpeg", JPEG_FALLBACK_QUALITY);
    if (jpeg.startsWith("data:image/jpeg")) {
      return { base64: stripDataUrl(jpeg), mediaType: "image/jpeg" };
    }

    return fallback;
  } catch {
    return fallback;
  }
}
```

### `artifacts/trading-copilot/src/lib/instruments.ts`

```ts
// Instrument model that makes the copilot usable for any market.
//
// `pointValue` is the single number that powers position sizing: it is the
// account-currency P&L from a 1.0 move in price, per 1 unit of the instrument
// (1 contract / 1 share / 1 standard lot / 1 coin). With it:
//
//   quantity = maxRisk$ / (stopDistanceInPoints * pointValue)
//
// Forex specs are approximate and assume a standard lot (100,000 units) quoted
// in USD, where a 1.0 move = $100,000 and one pip (0.0001) = $10/lot.

export type AssetClass = "futures" | "stocks" | "forex" | "crypto";

export interface InstrumentSpec {
  name: string;
  assetClass: AssetClass;
  // Account-currency P&L per 1.0 price move per 1 unit.
  pointValue: number;
  // Minimum price increment.
  tickSize: number;
  // What one unit of size is called (contracts / shares / lots / units).
  quantityLabel: string;
  // Account / quote currency code.
  currency: string;
}

export interface InstrumentGroup {
  assetClass: AssetClass;
  label: string;
  instruments: InstrumentSpec[];
}

const futures = (name: string, pointValue: number, tickSize: number): InstrumentSpec => ({
  name,
  assetClass: "futures",
  pointValue,
  tickSize,
  quantityLabel: "contracts",
  currency: "USD",
});

const stock = (name: string): InstrumentSpec => ({
  name,
  assetClass: "stocks",
  pointValue: 1,
  tickSize: 0.01,
  quantityLabel: "shares",
  currency: "USD",
});

const fx = (name: string): InstrumentSpec => ({
  name,
  assetClass: "forex",
  pointValue: 100000, // 1 standard lot (100k units), USD-quoted
  tickSize: 0.0001, // 1 pip
  quantityLabel: "lots",
  currency: "USD",
});

const crypto = (name: string): InstrumentSpec => ({
  name,
  assetClass: "crypto",
  pointValue: 1,
  tickSize: 0.01,
  quantityLabel: "units",
  currency: "USD",
});

export const INSTRUMENT_GROUPS: InstrumentGroup[] = [
  {
    assetClass: "futures",
    label: "Futures",
    instruments: [
      futures("NQ Futures (E-mini Nasdaq-100)", 20, 0.25),
      futures("MNQ (Micro Nasdaq-100)", 2, 0.25),
      futures("ES (E-mini S&P 500)", 50, 0.25),
      futures("MES (Micro S&P 500)", 5, 0.25),
      futures("YM (E-mini Dow)", 5, 1),
      futures("RTY (E-mini Russell 2000)", 50, 0.1),
      futures("CL (Crude Oil)", 1000, 0.01),
      futures("GC (Gold)", 100, 0.1),
    ],
  },
  {
    assetClass: "stocks",
    label: "Stocks & ETFs",
    instruments: [
      stock("Stocks / ETFs"),
      stock("AAPL (Apple)"),
      stock("TSLA (Tesla)"),
      stock("NVDA (Nvidia)"),
      stock("SPY (S&P 500 ETF)"),
    ],
  },
  {
    assetClass: "forex",
    label: "Forex (approx. standard lot)",
    instruments: [
      fx("EUR/USD"),
      fx("GBP/USD"),
      fx("AUD/USD"),
      fx("USD/CAD"),
    ],
  },
  {
    assetClass: "crypto",
    label: "Crypto",
    instruments: [
      crypto("BTC/USD (Bitcoin)"),
      crypto("ETH/USD (Ethereum)"),
      crypto("SOL/USD (Solana)"),
    ],
  },
];

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  futures: "Futures",
  stocks: "Stocks & ETFs",
  forex: "Forex",
  crypto: "Crypto",
};

const ALL_INSTRUMENTS: InstrumentSpec[] = INSTRUMENT_GROUPS.flatMap((g) => g.instruments);

// Legacy/short tickers that should resolve to a built-in preset, so settings
// saved before instrument presets existed (e.g. the default "NQ Futures") still
// pre-select the matching preset instead of opening in Custom mode.
const PRESET_ALIASES: Record<string, string> = {
  "NQ Futures": "NQ Futures (E-mini Nasdaq-100)",
};

// Find a built-in preset by its instrument name (used to pre-select the dropdown).
export function findPreset(name: string): InstrumentSpec | undefined {
  const resolved = PRESET_ALIASES[name] ?? name;
  return ALL_INSTRUMENTS.find((i) => i.name === resolved);
}

// Whether an asset class has meaningful regular/pre/after-hours sessions.
// Crypto and forex trade ~24h, so the session selector is hidden for them.
export function usesSession(assetClass: AssetClass): boolean {
  return assetClass === "futures" || assetClass === "stocks";
}

// Round a raw quantity to a tradable size for the asset class:
// whole contracts/shares, hundredths of a lot (micro lots), fractional coins.
export function roundQuantity(rawQty: number, assetClass: AssetClass): number {
  if (!isFinite(rawQty) || rawQty <= 0) return 0;
  if (assetClass === "futures" || assetClass === "stocks") return Math.floor(rawQty);
  if (assetClass === "forex") return Math.floor(rawQty * 100) / 100;
  return Math.floor(rawQty * 10000) / 10000; // crypto
}

export interface PositionSizing {
  // P&L impact of the stop distance for a single unit.
  riskPerUnit: number;
  // Unrounded position size that exactly spends the risk budget.
  rawQty: number;
  // Tradable, rounded position size.
  qty: number;
  // Actual dollar risk after rounding the quantity.
  actualRisk: number;
}

// Core sizing math shared by the risk calculator.
export function computePositionSize(opts: {
  maxRisk: number;
  stopDistance: number;
  pointValue: number;
  assetClass: AssetClass;
}): PositionSizing | null {
  const { maxRisk, stopDistance, pointValue, assetClass } = opts;
  if (!(maxRisk > 0) || !(stopDistance > 0) || !(pointValue > 0)) return null;
  const riskPerUnit = stopDistance * pointValue;
  const rawQty = maxRisk / riskPerUnit;
  const qty = roundQuantity(rawQty, assetClass);
  const actualRisk = qty * riskPerUnit;
  return { riskPerUnit, rawQty, qty, actualRisk };
}
```

### `artifacts/trading-copilot/src/lib/queryClient.ts`

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
```

### `artifacts/trading-copilot/src/lib/storage.ts`

```ts
import type { JournalEntry, TradingSettings } from "./types";

export const DEFAULT_SETTINGS: TradingSettings = {
  ticker: "NQ Futures",
  assetClass: "futures",
  pointValue: 20,
  tickSize: 0.25,
  quantityLabel: "contracts",
  currency: "USD",
  defaultTimeframe: "15m",
  lastSession: "rth",
  lastNews: "no",
  maxRiskPct: 1,
  maxDailyDrawdownPct: 2,
  minRR: 2,
  accountSize: 25000,
  longCriteria: [
    "Price must be above the 200 EMA",
    "RSI must be above 50",
    "Volume must be increasing",
  ],
  shortCriteria: [
    "Price must be below the 200 EMA",
    "RSI must be below 50",
    "Volume must be increasing",
  ],
  riskRules: [
    "No trades during major news events",
  ],
};

const SETTINGS_KEY = "tc_settings_v1";

export function loadSettings(): TradingSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<TradingSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      longCriteria: Array.isArray(parsed.longCriteria) ? parsed.longCriteria : DEFAULT_SETTINGS.longCriteria,
      shortCriteria: Array.isArray(parsed.shortCriteria) ? parsed.shortCriteria : DEFAULT_SETTINGS.shortCriteria,
      riskRules: Array.isArray(parsed.riskRules) ? parsed.riskRules : DEFAULT_SETTINGS.riskRules,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Fill in any missing fields (e.g. instrument specs added after a user first
// saved their settings) from the defaults. Used for settings loaded from the
// server, whose stored JSON may predate the instrument fields.
export function normalizeSettings(raw: Partial<TradingSettings> | null | undefined): TradingSettings {
  if (!raw) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    longCriteria: Array.isArray(raw.longCriteria) ? raw.longCriteria : DEFAULT_SETTINGS.longCriteria,
    shortCriteria: Array.isArray(raw.shortCriteria) ? raw.shortCriteria : DEFAULT_SETTINGS.shortCriteria,
    riskRules: Array.isArray(raw.riskRules) ? raw.riskRules : DEFAULT_SETTINGS.riskRules,
  };
}

export function saveSettings(s: TradingSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // storage unavailable — silently ignore
  }
}

const LAST_ANALYZE_KEY = "tc_last_analyze_v1";

export interface LastAnalyze {
  imageBase64: string;
  mediaType: string;
  context: string;
  analysisTime: string;
  result: unknown | null;
}

export function loadLastAnalyze(): LastAnalyze | null {
  try {
    const raw = localStorage.getItem(LAST_ANALYZE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<LastAnalyze>;
    if (typeof p.imageBase64 !== "string" || typeof p.mediaType !== "string") return null;
    return {
      imageBase64: p.imageBase64,
      mediaType: p.mediaType,
      context: typeof p.context === "string" ? p.context : "",
      analysisTime: typeof p.analysisTime === "string" ? p.analysisTime : "",
      result: p.result ?? null,
    };
  } catch {
    return null;
  }
}

export function saveLastAnalyze(v: LastAnalyze) {
  try {
    localStorage.setItem(LAST_ANALYZE_KEY, JSON.stringify(v));
  } catch {
    // storage full/unavailable — the chart just won't be remembered next time
  }
}

export function clearLastAnalyze() {
  try { localStorage.removeItem(LAST_ANALYZE_KEY); } catch { /* ignore */ }
}

const JOURNAL_KEY = "tc_journal_v1";
const JOURNAL_MAX = 100;

export function loadJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendJournalEntry(entry: JournalEntry): JournalEntry[] {
  try {
    const existing = loadJournal();
    const updated = [entry, ...existing].slice(0, JOURNAL_MAX);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [entry];
  }
}

export function clearJournal() {
  try { localStorage.removeItem(JOURNAL_KEY); } catch { /* ignore */ }
}

export function replaceJournal(entries: JournalEntry[]): JournalEntry[] {
  const updated = entries.slice(0, JOURNAL_MAX);
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  } catch {
    // storage unavailable — silently ignore
  }
  return updated;
}

const BACKUP_TYPE = "trading-copilot-backup";
const BACKUP_VERSION = 1;

export interface JournalBackup {
  type: typeof BACKUP_TYPE;
  version: number;
  exportedAt: string;
  settings: TradingSettings;
  journal: JournalEntry[];
}

export function buildBackup(journal: JournalEntry[], settings: TradingSettings): JournalBackup {
  return {
    type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    journal,
  };
}

export interface ParsedBackup {
  journal: JournalEntry[];
  settings: TradingSettings | null;
}

function isJournalEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.timestamp === "number" &&
    typeof e.ticker === "string" &&
    typeof e.timeframe === "string" &&
    typeof e.session === "string" &&
    typeof e.grade === "string" &&
    typeof e.score_total === "number" &&
    typeof e.bias === "string" &&
    typeof e.qualifies === "boolean" &&
    typeof e.rr_ratio === "string" &&
    typeof e.full_analysis === "string"
  );
}

export function parseBackup(raw: string): ParsedBackup {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("File is not valid JSON.");
  }

  let rawEntries: unknown;
  let rawSettings: unknown = null;

  if (Array.isArray(data)) {
    // Bare array of journal entries.
    rawEntries = data;
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    rawEntries = obj.journal;
    rawSettings = obj.settings ?? null;
  } else {
    throw new Error("File does not contain a valid backup.");
  }

  if (!Array.isArray(rawEntries)) {
    throw new Error("No journal entries found in this file.");
  }

  const journal = rawEntries.filter(isJournalEntry);
  if (journal.length === 0) {
    throw new Error("No valid journal entries found in this file.");
  }

  let settings: TradingSettings | null = null;
  if (rawSettings && typeof rawSettings === "object") {
    const parsed = rawSettings as Partial<TradingSettings>;
    settings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      longCriteria: Array.isArray(parsed.longCriteria) ? parsed.longCriteria : DEFAULT_SETTINGS.longCriteria,
      shortCriteria: Array.isArray(parsed.shortCriteria) ? parsed.shortCriteria : DEFAULT_SETTINGS.shortCriteria,
      riskRules: Array.isArray(parsed.riskRules) ? parsed.riskRules : DEFAULT_SETTINGS.riskRules,
    };
  }

  return { journal, settings };
}
```

### `artifacts/trading-copilot/src/lib/types.ts`

```ts
import type {
  ChartAnalysisInputTimeframe,
  ChartAnalysisInputSession,
  ChartAnalysisInputNews,
  TimingAnalysis,
} from "@workspace/api-client-react";
import type { AssetClass } from "./instruments";

export type { TimingAnalysis };

export type Tab = "analyze" | "plan" | "news" | "review" | "timing" | "debrief" | "journal";

export interface JournalPlacedSetup {
  grade: string;
  direction: string;
  entry: string;
  stop: string;
  targets: string;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  ticker: string;
  timeframe: string;
  session: string;
  grade: string;
  score_total: number;
  bias: string;
  qualifies: boolean;
  rr_ratio: string;
  full_analysis: string;
  analysisTime?: string;
  // Asset class of the instrument analyzed, so downstream views (e.g. Timing)
  // can drop session/"ET" framing for 24h markets. Optional so older entries
  // and imported backups without it still parse (treated as a session market).
  assetClass?: AssetClass;
  timing?: TimingAnalysis;
  // The grade + read-back of the trade the user actually drew on the chart,
  // present only when a placed setup was detected. Optional so older entries
  // and imported backups without it still parse.
  placed_setup?: JournalPlacedSetup;
  // The copilot's decisive call for this analysis (e.g. "Long" / "Short" /
  // "No Trade") plus its recommended entry. Optional so older entries and
  // imported backups without them still parse.
  recommended_direction?: string;
  recommended_entry?: string;
}

export interface TradingSettings {
  ticker: string;
  // Instrument specs. Optional on the wire (older saved settings predate them),
  // but always filled in via DEFAULT_SETTINGS when settings are loaded.
  assetClass: AssetClass;
  pointValue: number;
  tickSize: number;
  quantityLabel: string;
  currency: string;
  defaultTimeframe: ChartAnalysisInputTimeframe;
  lastSession: ChartAnalysisInputSession;
  lastNews: ChartAnalysisInputNews;
  maxRiskPct: number;
  maxDailyDrawdownPct: number;
  minRR: number;
  accountSize: number;
  longCriteria: string[];
  shortCriteria: string[];
  riskRules: string[];
}
```

### `artifacts/trading-copilot/src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `artifacts/trading-copilot/src/main.tsx`

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### `artifacts/trading-copilot/src/pages/Billing.tsx`

```tsx
import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  useGetPlans,
  useCreateCheckout,
  useCreatePortal,
  useVerifyCheckout,
  type Plan,
} from "@workspace/api-client-react";
import { useAccess } from "@/lib/access-context";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Infinity as InfinityIcon,
  Zap,
  CreditCard,
  Loader2,
} from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function formatPrice(amount: number, currency: string): string {
  const value = amount / 100;
  const symbol = currency.toLowerCase() === "usd" ? "$" : "";
  const str = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${symbol}${str}`;
}

function intervalLabel(plan: Plan): string {
  if (plan.kind === "lifetime") return "one-time";
  if (plan.kind === "gold") return "one-time";
  if (plan.kind === "credit_pack") return "one-time";
  if (!plan.interval) return "";
  const count = plan.intervalCount ?? 1;
  const unit = plan.interval;
  if (count === 1) return `/${unit}`;
  return `/${count} ${unit}s`;
}

export default function Billing() {
  const [, setLocation] = useLocation();
  const { access, refresh } = useAccess();
  const plansQuery = useGetPlans();
  const checkout = useCreateCheckout();
  const portal = useCreatePortal();
  const verify = useVerifyCheckout();
  const [banner, setBanner] = useState<
    { kind: "ok" | "err"; text: string } | null
  >(null);
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const verifiedRef = useRef(false);

  // Handle the return from Stripe Checkout.
  useEffect(() => {
    if (verifiedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("checkout");
    const sessionId = params.get("session_id");
    if (!status) return;
    verifiedRef.current = true;

    if (status === "cancelled") {
      setBanner({ kind: "err", text: "Checkout cancelled — no charge was made." });
      window.history.replaceState({}, "", `${basePath}/billing`);
      return;
    }

    if (status === "success" && sessionId) {
      verify.mutate(
        { data: { sessionId } },
        {
          onSuccess: () => {
            refresh();
            setBanner({
              kind: "ok",
              text: "Payment confirmed — your account has been updated.",
            });
          },
          onError: () => {
            setBanner({
              kind: "err",
              text: "We couldn't verify the payment yet. It may take a moment to reflect.",
            });
          },
          onSettled: () => {
            window.history.replaceState({}, "", `${basePath}/billing`);
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCheckout = (priceId: string) => {
    setPendingPriceId(priceId);
    checkout.mutate(
      { data: { priceId } },
      {
        onSuccess: ({ url }) => {
          if (url) window.location.href = url;
          else setPendingPriceId(null);
        },
        onError: () => {
          setPendingPriceId(null);
          setBanner({
            kind: "err",
            text: "Could not start checkout. Please try again in a moment.",
          });
        },
      },
    );
  };

  const openPortal = () => {
    portal.mutate(undefined, {
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
      },
      onError: () => {
        setBanner({
          kind: "err",
          text: "Could not open the billing portal.",
        });
      },
    });
  };

  const plans = plansQuery.data?.plans ?? [];
  const subscriptions = plans.filter(
    (p) =>
      p.kind === "subscription" || p.kind === "lifetime" || p.kind === "gold",
  );
  const packs = plans.filter((p) => p.kind === "credit_pack");

  const currentTier = access?.plan ?? "none";
  const hasSubscription = access && access.plan !== "none";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="py-5 flex items-center justify-between border-b border-border mb-6">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" /> Back to copilot
          </button>
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="Ace Trades" className="w-7 h-7" />
            <span className="font-display font-bold">Ace Trades</span>
          </div>
        </div>

        {/* Banner */}
        {banner && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              banner.kind === "ok"
                ? "border-emerald-800/50 bg-emerald-950/40 text-emerald-300"
                : "border-red-800/50 bg-red-950/40 text-red-300"
            }`}
            data-testid="text-billing-banner"
          >
            {banner.text}
          </div>
        )}

        {/* Current status */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Current plan
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-display text-xl font-bold capitalize">
                {currentTier === "none" ? "No active plan" : currentTier}
              </span>
              {access?.subscriptionStatus && access.plan !== "none" && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-primary/15 border border-primary/25 text-primary capitalize">
                  {access.subscriptionStatus}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Credits
            </p>
            <div className="flex items-center gap-1.5 mt-1 justify-end">
              {access?.unlimited ? (
                <span className="font-display text-xl font-bold text-primary flex items-center gap-1.5">
                  <InfinityIcon className="w-5 h-5" /> Unlimited
                </span>
              ) : (
                <span className="font-display text-xl font-bold tabular-nums">
                  {access?.totalCredits ?? 0}
                </span>
              )}
            </div>
            {!access?.unlimited && access && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {access.monthlyCredits} monthly + {access.packCredits} packs
              </p>
            )}
            {access?.unlimited && access?.unlimitedUntil && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                until{" "}
                {new Date(access.unlimitedUntil).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          {hasSubscription && (
            <button
              onClick={openPortal}
              disabled={portal.isPending}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors disabled:opacity-50"
              data-testid="button-manage-subscription"
            >
              {portal.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Manage subscription
            </button>
          )}
        </div>

        {plansQuery.isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading plans…
          </div>
        )}

        {!plansQuery.isLoading && plans.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>Plans aren't available right now.</p>
            <p className="text-xs mt-1">Please check back shortly.</p>
          </div>
        )}

        {/* Subscription plans */}
        {subscriptions.length > 0 && (
          <section className="mb-10">
            <h2 className="font-sans text-lg font-bold uppercase tracking-wide mb-1">
              Plans
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Each AI analysis costs {access?.creditCost ?? 15} credits. Unlimited
              plans never count credits.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptions.map((plan) => {
                const isCurrent =
                  plan.tier === currentTier && currentTier !== "none";
                const busy = pendingPriceId === plan.priceId;
                return (
                  <div
                    key={plan.priceId}
                    className={`rounded-xl p-5 border flex flex-col ${
                      plan.unlimited
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                    data-testid={`plan-${plan.tier ?? plan.priceId}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-bold uppercase tracking-wide text-foreground">
                        {plan.name}
                      </h3>
                      {plan.unlimited && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary font-medium">
                          UNLIMITED
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {formatPrice(plan.amount, plan.currency)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {intervalLabel(plan)}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm flex-1">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {plan.unlimited
                          ? "Unlimited AI analyses"
                          : `${plan.credits ?? 0} credits per cycle`}
                      </div>
                      {plan.description && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {plan.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => startCheckout(plan.priceId)}
                      disabled={busy || isCurrent}
                      className={`mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-60 ${
                        plan.unlimited
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-foreground/10 text-foreground hover:bg-foreground/15 border border-border"
                      }`}
                      data-testid={`button-checkout-${plan.tier ?? plan.priceId}`}
                    >
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {isCurrent ? "Current plan" : "Choose plan"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Credit packs */}
        {packs.length > 0 && (
          <section>
            <h2 className="font-sans text-lg font-bold uppercase tracking-wide mb-1">Credit packs</h2>
            <p className="text-sm text-muted-foreground mb-4">
              One-time top-ups. Pack credits never expire and are used after your
              monthly credits.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packs.map((pack) => {
                const busy = pendingPriceId === pack.priceId;
                return (
                  <div
                    key={pack.priceId}
                    className="rounded-xl p-5 border border-border bg-card flex items-center justify-between"
                    data-testid={`pack-${pack.priceId}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-sans font-bold uppercase tracking-wide">
                          {pack.credits ?? 0} credits
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatPrice(pack.amount, pack.currency)}
                      </div>
                    </div>
                    <button
                      onClick={() => startCheckout(pack.priceId)}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                      data-testid={`button-buy-${pack.priceId}`}
                    >
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Buy"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/pages/Landing.tsx`

```tsx
import { useLocation } from "wouter";
import {
  BarChart2,
  Sparkles,
  Newspaper,
  ClipboardCheck,
  Clock,
  BookOpen,
  ArrowRight,
  Check,
} from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const FEATURES = [
  {
    icon: Sparkles,
    title: "Graded chart analysis",
    desc: "Upload a screenshot and get a graded setup breakdown with bias, score, and an A+ to No-Trade verdict.",
  },
  {
    icon: Newspaper,
    title: "News impact",
    desc: "Paste a headline or upcoming event and see predicted direction, volatility, and a trade recommendation.",
  },
  {
    icon: ClipboardCheck,
    title: "Trader review",
    desc: "Get a longer, plain-English review of your chart from an experienced trading lens.",
  },
  {
    icon: Clock,
    title: "Timing insights",
    desc: "Understand the best windows to trade based on session and your own logged history.",
  },
];

const PLAN_PREVIEW = [
  {
    name: "Basic",
    price: "$39",
    cadence: "/mo",
    perk: "500 credits/mo · 3-day free trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$99",
    cadence: "/3 mo",
    perk: "1,800 credits every 3 months",
    highlight: true,
  },
  {
    name: "Gold",
    price: "$399",
    cadence: "once",
    perk: "Unlimited for 12 months",
    highlight: false,
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <header className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="Ace Trades" className="w-9 h-9" />
          <div>
            <h1 className="font-display text-lg font-bold leading-tight tracking-tight">
              Ace Trades
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Trading Copilot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation("/sign-in")}
            className="text-sm font-medium px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-sign-in"
          >
            Sign in
          </button>
          <button
            onClick={() => setLocation("/sign-up")}
            className="text-sm font-bold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            data-testid="button-sign-up"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" /> AI trading copilot for ANY market
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] max-w-3xl mx-auto">
          Trade with your very own AI Trading Copilot for{" "}
          <span className="text-primary">A+ Grade Trades and Analyses</span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mt-5 max-w-xl mx-auto leading-relaxed">
          Upload a chart, paste a headline, or check your timing — and get clear,
          beginner-friendly analysis grounded in your own trading plan.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setLocation("/sign-up")}
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            data-testid="button-hero-start"
          >
            Start trading smarter <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLocation("/sign-in")}
            className="text-sm font-medium px-6 py-3 rounded-lg border border-border text-foreground hover:border-primary/30 transition-colors"
          >
            I have an account
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-xl p-5 flex gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-sans font-bold uppercase tracking-wide text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <h3 className="font-sans text-2xl font-bold uppercase tracking-wide">
            Plans for every trader
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Each AI analysis costs 15 credits. Unlimited plans never count.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLAN_PREVIEW.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-5 border ${
                p.highlight
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="font-sans font-bold uppercase tracking-wide text-foreground">
                {p.name}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{p.price}</span>
                <span className="text-xs text-muted-foreground">
                  {p.cadence}
                </span>
              </div>
              <div className="mt-3 flex items-start gap-1.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {p.perk}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => setLocation("/sign-up")}
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create your account <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            Credit packs also available — top up any time, never expires.
          </p>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-2 text-xs text-muted-foreground">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Ace Trades — educational analysis only, not financial advice.</span>
          <BookOpen className="w-3.5 h-3.5 ml-auto" />
        </div>
      </footer>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/pages/TradingCopilot.tsx`

```tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Infinity as InfinityIcon,
  Zap,
  LogOut,
  CreditCard,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AnalyzeTab } from "@/components/tabs/AnalyzeTab";
import { PlanTab } from "@/components/tabs/PlanTab";
import { NewsTab } from "@/components/tabs/NewsTab";
import { ReviewTab } from "@/components/tabs/ReviewTab";
import { TimingTab } from "@/components/tabs/TimingTab";
import { DebriefTab } from "@/components/tabs/DebriefTab";
import { JournalTab } from "@/components/tabs/JournalTab";
import {
  useGetSettings,
  useUpdateSettings,
  useGetJournal,
  getGetJournalQueryKey,
  getGetSettingsQueryKey,
  useAddJournalEntry,
  useClearJournal,
  useImportData,
} from "@workspace/api-client-react";
import { useAccess } from "@/lib/access-context";
import { DEFAULT_SETTINGS, loadSettings, loadJournal, parseBackup, normalizeSettings } from "@/lib/storage";
import type { Tab, JournalEntry, TradingSettings } from "@/lib/types";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const IMPORTED_FLAG = "tc_imported_v1";

export default function TradingCopilot() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { access, refresh: refreshAccess } = useAccess();

  const [tab, setTab] = useState<Tab>("analyze");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [settings, setSettings] = useState<TradingSettings | null>(null);
  const importRan = useRef(false);

  const settingsQuery = useGetSettings();
  const journalQuery = useGetJournal();
  const updateSettings = useUpdateSettings();
  const addEntry = useAddJournalEntry();
  const clearJournalMutation = useClearJournal();
  const importData = useImportData();

  const journal: JournalEntry[] = journalQuery.data?.entries ?? [];

  const invalidateJournal = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetJournalQueryKey() });
  }, [queryClient]);
  const invalidateSettings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
  }, [queryClient]);

  // Initialize local settings once the server responds.
  useEffect(() => {
    if (settings === null && settingsQuery.data !== undefined) {
      setSettings(
        settingsQuery.data.data ? normalizeSettings(settingsQuery.data.data) : DEFAULT_SETTINGS,
      );
    }
  }, [settings, settingsQuery.data]);

  // Auto-import any existing localStorage data on first login.
  useEffect(() => {
    if (importRan.current) return;
    if (settingsQuery.isLoading || journalQuery.isLoading) return;
    if (localStorage.getItem(IMPORTED_FLAG)) {
      importRan.current = true;
      return;
    }
    importRan.current = true;

    const serverHasJournal = (journalQuery.data?.entries.length ?? 0) > 0;
    const serverHasSettings = !!settingsQuery.data?.data;
    if (serverHasJournal || serverHasSettings) {
      localStorage.setItem(IMPORTED_FLAG, "1");
      return;
    }

    const rawJournal = localStorage.getItem("tc_journal_v1");
    const rawSettings = localStorage.getItem("tc_settings_v1");
    const localEntries = rawJournal ? loadJournal() : [];
    const localSettings = rawSettings ? loadSettings() : null;

    if (localEntries.length === 0 && !localSettings) {
      localStorage.setItem(IMPORTED_FLAG, "1");
      return;
    }

    importData.mutate(
      { data: { entries: localEntries, settings: localSettings } },
      {
        onSuccess: () => {
          localStorage.setItem(IMPORTED_FLAG, "1");
          if (localSettings) setSettings(localSettings);
          invalidateJournal();
          invalidateSettings();
        },
        onError: () => {
          // Allow a retry on next mount if the import failed.
          importRan.current = false;
        },
      },
    );
  }, [
    settingsQuery.isLoading,
    journalQuery.isLoading,
    settingsQuery.data,
    journalQuery.data,
    importData,
    invalidateJournal,
    invalidateSettings,
  ]);

  const handleSettingsChange = useCallback(
    (s: TradingSettings) => {
      setSettings(s);
      updateSettings.mutate({ data: s });
    },
    [updateSettings],
  );

  const handleAnalysisResult = useCallback(
    (entry: JournalEntry) => {
      addEntry.mutate(
        { data: entry },
        { onSuccess: () => invalidateJournal() },
      );
    },
    [addEntry, invalidateJournal],
  );

  const handleClearJournal = useCallback(() => {
    clearJournalMutation.mutate(undefined, {
      onSuccess: () => invalidateJournal(),
    });
  }, [clearJournalMutation, invalidateJournal]);

  const handleImportJournal = useCallback(
    async (raw: string, mode: "replace" | "merge") => {
      const { journal: imported, settings: importedSettings } = parseBackup(raw);
      if (mode === "replace") {
        await clearJournalMutation.mutateAsync(undefined);
      }
      const result = await importData.mutateAsync({
        data: { entries: imported, settings: importedSettings ?? null },
      });
      invalidateJournal();
      if (importedSettings) {
        setSettings(importedSettings);
        invalidateSettings();
      }
      return { count: result.count };
    },
    [clearJournalMutation, importData, invalidateJournal, invalidateSettings],
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "analyze", label: "Analyze Chart" },
    { id: "plan", label: "Trading Plan" },
    { id: "news", label: "News Impact" },
    { id: "review", label: "Trader Review" },
    { id: "timing", label: "Timing" },
    { id: "debrief", label: "Debrief" },
    { id: "journal", label: `Journal${journal.length ? ` (${journal.length})` : ""}` },
  ];

  if (settings === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* Header */}
        <div className="py-5 flex items-center justify-between border-b border-border mb-5">
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="Ace Trades" className="w-9 h-9" />
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-tight tracking-tight">
                Ace Trades
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Trading Copilot
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Credit balance */}
            <button
              onClick={() => setLocation("/billing")}
              className="text-[11px] px-2.5 py-1.5 bg-primary/10 border border-primary/20 rounded text-primary font-medium flex items-center gap-1.5 hover:bg-primary/20 transition-colors"
              title="Credits & plans"
              data-testid="button-credits"
            >
              {access?.unlimited ? (
                <>
                  <InfinityIcon className="w-3.5 h-3.5" /> Unlimited
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{access?.totalCredits ?? 0}</span>{" "}
                  credits
                </>
              )}
            </button>

            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className={`p-2 rounded border transition-colors ${
                settingsOpen
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
              title="Trading Settings"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Account menu */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 p-1.5 pl-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                data-testid="button-account"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                  {(user?.primaryEmailAddress?.emailAddress ?? "?").charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {accountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 z-20 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Signed in as
                      </p>
                      <p className="text-xs text-foreground truncate">
                        {user?.primaryEmailAddress?.emailAddress ?? "Trader"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        setLocation("/billing");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted/30 transition-colors"
                      data-testid="button-menu-billing"
                    >
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      Plans &amp; billing
                    </button>
                    <button
                      onClick={() => signOut({ redirectUrl: basePath || "/" })}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted/30 transition-colors"
                      data-testid="button-logout"
                    >
                      <LogOut className="w-4 h-4 text-muted-foreground" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {settingsOpen && (
          <SettingsPanel
            settings={settings}
            onChange={handleSettingsChange}
            onClose={() => setSettingsOpen(false)}
          />
        )}

        {/* Tabs */}
        <div className="flex border border-border rounded-lg overflow-hidden mb-5">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 text-sm font-bold py-3 transition-colors ${
                i > 0 ? "border-l border-border" : ""
              } ${
                tab === t.id
                  ? "bg-primary/15 text-primary border-b-2 border-b-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
              }`}
              data-testid={`tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "analyze" && (
          <AnalyzeTab
            settings={settings}
            onResult={handleAnalysisResult}
            onSettingsChange={handleSettingsChange}
          />
        )}
        {tab === "plan" && (
          <PlanTab settings={settings} onSettingsChange={handleSettingsChange} />
        )}
        {tab === "news" && <NewsTab settings={settings} />}
        {tab === "review" && <ReviewTab settings={settings} />}
        {tab === "timing" && <TimingTab entries={journal} />}
        {tab === "debrief" && <DebriefTab settings={settings} />}
        {tab === "journal" && <JournalTab entries={journal} settings={settings} onClear={handleClearJournal} onImport={handleImportJournal} />}
      </div>
    </div>
  );
}
```

### `artifacts/trading-copilot/src/pages/not-found.tsx`

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### `artifacts/trading-copilot/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "noEmit": true,
    "jsx": "preserve",
    "lib": ["esnext", "dom", "dom.iterable"],
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "references": [
    {
      "path": "../../lib/api-client-react"
    }
  ]
}
```

### `artifacts/trading-copilot/vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss({ optimize: false }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
```

### `lib/api-client-react/package.json`

```json
{
  "name": "@workspace/api-client-react",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@tanstack/react-query": "catalog:"
  },
  "peerDependencies": {
    "react": ">=18"
  }
}
```

### `lib/api-client-react/src/custom-fetch.ts`

```ts
export type CustomFetchOptions = RequestInit & {
  responseType?: "json" | "text" | "blob" | "auto";
};

export type ErrorType<T = unknown> = ApiError<T>;

export type BodyType<T> = T;

export type AuthTokenGetter = () => Promise<string | null> | string | null;

const NO_BODY_STATUS = new Set([204, 205, 304]);
const DEFAULT_JSON_ACCEPT = "application/json, application/problem+json";

// ---------------------------------------------------------------------------
// Module-level configuration
// ---------------------------------------------------------------------------

let _baseUrl: string | null = null;
let _authTokenGetter: AuthTokenGetter | null = null;

/**
 * Set a base URL that is prepended to every relative request URL
 * (i.e. paths that start with `/`).
 *
 * Useful for Expo bundles that need to call a remote API server.
 * Pass `null` to clear the base URL.
 */
export function setBaseUrl(url: string | null): void {
  _baseUrl = url ? url.replace(/\/+$/, "") : null;
}

/**
 * Register a getter that supplies a bearer auth token.  Before every fetch
 * the getter is invoked; when it returns a non-null string, an
 * `Authorization: Bearer <token>` header is attached to the request.
 *
 * Useful for Expo bundles making token-gated API calls.
 * Pass `null` to clear the getter.
 *
 * NOTE: This function should never be used in web applications where session
 * token cookies are automatically associated with API calls by the browser.
 */
export function setAuthTokenGetter(getter: AuthTokenGetter | null): void {
  _authTokenGetter = getter;
}

function isRequest(input: RequestInfo | URL): input is Request {
  return typeof Request !== "undefined" && input instanceof Request;
}

function resolveMethod(input: RequestInfo | URL, explicitMethod?: string): string {
  if (explicitMethod) return explicitMethod.toUpperCase();
  if (isRequest(input)) return input.method.toUpperCase();
  return "GET";
}

// Use loose check for URL — some runtimes (e.g. React Native) polyfill URL
// differently, so `instanceof URL` can fail.
function isUrl(input: RequestInfo | URL): input is URL {
  return typeof URL !== "undefined" && input instanceof URL;
}

function applyBaseUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (!_baseUrl) return input;
  const url = resolveUrl(input);
  // Only prepend to relative paths (starting with /)
  if (!url.startsWith("/")) return input;

  const absolute = `${_baseUrl}${url}`;
  if (typeof input === "string") return absolute;
  if (isUrl(input)) return new URL(absolute);
  return new Request(absolute, input as Request);
}

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (isUrl(input)) return input.toString();
  return input.url;
}

function mergeHeaders(...sources: Array<HeadersInit | undefined>): Headers {
  const headers = new Headers();

  for (const source of sources) {
    if (!source) continue;
    new Headers(source).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function getMediaType(headers: Headers): string | null {
  const value = headers.get("content-type");
  return value ? value.split(";", 1)[0].trim().toLowerCase() : null;
}

function isJsonMediaType(mediaType: string | null): boolean {
  return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}

function isTextMediaType(mediaType: string | null): boolean {
  return Boolean(
    mediaType &&
      (mediaType.startsWith("text/") ||
        mediaType === "application/xml" ||
        mediaType === "text/xml" ||
        mediaType.endsWith("+xml") ||
        mediaType === "application/x-www-form-urlencoded"),
  );
}

// Use strict equality: in browsers, `response.body` is `null` when the
// response genuinely has no content.  In React Native, `response.body` is
// always `undefined` because the ReadableStream API is not implemented —
// even when the response carries a full payload readable via `.text()` or
// `.json()`.  Loose equality (`== null`) matches both `null` and `undefined`,
// which causes every React Native response to be treated as empty.
function hasNoBody(response: Response, method: string): boolean {
  if (method === "HEAD") return true;
  if (NO_BODY_STATUS.has(response.status)) return true;
  if (response.headers.get("content-length") === "0") return true;
  if (response.body === null) return true;
  return false;
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function looksLikeJson(text: string): boolean {
  const trimmed = text.trimStart();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

function getStringField(value: unknown, key: string): string | undefined {
  if (!value || typeof value !== "object") return undefined;

  const candidate = (value as Record<string, unknown>)[key];
  if (typeof candidate !== "string") return undefined;

  const trimmed = candidate.trim();
  return trimmed === "" ? undefined : trimmed;
}

function truncate(text: string, maxLength = 300): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function buildErrorMessage(response: Response, data: unknown): string {
  const prefix = `HTTP ${response.status} ${response.statusText}`;

  if (typeof data === "string") {
    const text = data.trim();
    return text ? `${prefix}: ${truncate(text)}` : prefix;
  }

  const title = getStringField(data, "title");
  const detail = getStringField(data, "detail");
  const message =
    getStringField(data, "message") ??
    getStringField(data, "error_description") ??
    getStringField(data, "error");

  if (title && detail) return `${prefix}: ${title} — ${detail}`;
  if (detail) return `${prefix}: ${detail}`;
  if (message) return `${prefix}: ${message}`;
  if (title) return `${prefix}: ${title}`;

  return prefix;
}

export class ApiError<T = unknown> extends Error {
  readonly name = "ApiError";
  readonly status: number;
  readonly statusText: string;
  readonly data: T | null;
  readonly headers: Headers;
  readonly response: Response;
  readonly method: string;
  readonly url: string;

  constructor(
    response: Response,
    data: T | null,
    requestInfo: { method: string; url: string },
  ) {
    super(buildErrorMessage(response, data));
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = response.status;
    this.statusText = response.statusText;
    this.data = data;
    this.headers = response.headers;
    this.response = response;
    this.method = requestInfo.method;
    this.url = response.url || requestInfo.url;
  }
}

export class ResponseParseError extends Error {
  readonly name = "ResponseParseError";
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly response: Response;
  readonly method: string;
  readonly url: string;
  readonly rawBody: string;
  readonly cause: unknown;

  constructor(
    response: Response,
    rawBody: string,
    cause: unknown,
    requestInfo: { method: string; url: string },
  ) {
    super(
      `Failed to parse response from ${requestInfo.method} ${response.url || requestInfo.url} ` +
        `(${response.status} ${response.statusText}) as JSON`,
    );
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = response.status;
    this.statusText = response.statusText;
    this.headers = response.headers;
    this.response = response;
    this.method = requestInfo.method;
    this.url = response.url || requestInfo.url;
    this.rawBody = rawBody;
    this.cause = cause;
  }
}

async function parseJsonBody(
  response: Response,
  requestInfo: { method: string; url: string },
): Promise<unknown> {
  const raw = await response.text();
  const normalized = stripBom(raw);

  if (normalized.trim() === "") {
    return null;
  }

  try {
    return JSON.parse(normalized);
  } catch (cause) {
    throw new ResponseParseError(response, raw, cause, requestInfo);
  }
}

async function parseErrorBody(response: Response, method: string): Promise<unknown> {
  if (hasNoBody(response, method)) {
    return null;
  }

  const mediaType = getMediaType(response.headers);

  // Fall back to text when blob() is unavailable (e.g. some React Native builds).
  if (mediaType && !isJsonMediaType(mediaType) && !isTextMediaType(mediaType)) {
    return typeof response.blob === "function" ? response.blob() : response.text();
  }

  const raw = await response.text();
  const normalized = stripBom(raw);
  const trimmed = normalized.trim();

  if (trimmed === "") {
    return null;
  }

  if (isJsonMediaType(mediaType) || looksLikeJson(normalized)) {
    try {
      return JSON.parse(normalized);
    } catch {
      return raw;
    }
  }

  return raw;
}

function inferResponseType(response: Response): "json" | "text" | "blob" {
  const mediaType = getMediaType(response.headers);

  if (isJsonMediaType(mediaType)) return "json";
  if (isTextMediaType(mediaType) || mediaType == null) return "text";
  return "blob";
}

async function parseSuccessBody(
  response: Response,
  responseType: "json" | "text" | "blob" | "auto",
  requestInfo: { method: string; url: string },
): Promise<unknown> {
  if (hasNoBody(response, requestInfo.method)) {
    return null;
  }

  const effectiveType =
    responseType === "auto" ? inferResponseType(response) : responseType;

  switch (effectiveType) {
    case "json":
      return parseJsonBody(response, requestInfo);

    case "text": {
      const text = await response.text();
      return text === "" ? null : text;
    }

    case "blob":
      if (typeof response.blob !== "function") {
        throw new TypeError(
          "Blob responses are not supported in this runtime. " +
            "Use responseType \"json\" or \"text\" instead.",
        );
      }
      return response.blob();
  }
}

export async function customFetch<T = unknown>(
  input: RequestInfo | URL,
  options: CustomFetchOptions = {},
): Promise<T> {
  input = applyBaseUrl(input);
  const { responseType = "auto", headers: headersInit, ...init } = options;

  const method = resolveMethod(input, init.method);

  if (init.body != null && (method === "GET" || method === "HEAD")) {
    throw new TypeError(`customFetch: ${method} requests cannot have a body.`);
  }

  const headers = mergeHeaders(isRequest(input) ? input.headers : undefined, headersInit);

  if (
    typeof init.body === "string" &&
    !headers.has("content-type") &&
    looksLikeJson(init.body)
  ) {
    headers.set("content-type", "application/json");
  }

  if (responseType === "json" && !headers.has("accept")) {
    headers.set("accept", DEFAULT_JSON_ACCEPT);
  }

  // Attach bearer token when an auth getter is configured and no
  // Authorization header has been explicitly provided.
  if (_authTokenGetter && !headers.has("authorization")) {
    const token = await _authTokenGetter();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  const requestInfo = { method, url: resolveUrl(input) };

  const response = await fetch(input, { ...init, method, headers });

  if (!response.ok) {
    const errorData = await parseErrorBody(response, method);
    throw new ApiError(response, errorData, requestInfo);
  }

  return (await parseSuccessBody(response, responseType, requestInfo)) as T;
}
```

### `lib/api-client-react/src/generated/api.schemas.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
export interface HealthStatus {
  status: string;
}

export interface ErrorResponse {
  error: string;
}

export type ChartAnalysisInputTimeframe = typeof ChartAnalysisInputTimeframe[keyof typeof ChartAnalysisInputTimeframe];


export const ChartAnalysisInputTimeframe = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
} as const;

export type ChartAnalysisInputSession = typeof ChartAnalysisInputSession[keyof typeof ChartAnalysisInputSession];


export const ChartAnalysisInputSession = {
  premarket: 'premarket',
  rth: 'rth',
  afterhours: 'afterhours',
} as const;

export type ChartAnalysisInputNews = typeof ChartAnalysisInputNews[keyof typeof ChartAnalysisInputNews];


export const ChartAnalysisInputNews = {
  no: 'no',
  yes: 'yes',
  just: 'just',
} as const;

/**
 * Instrument asset class — drives session and timezone handling
 */
export type ChartAnalysisInputAssetClass = typeof ChartAnalysisInputAssetClass[keyof typeof ChartAnalysisInputAssetClass];


export const ChartAnalysisInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;

export interface ChartAnalysisInput {
  /** Base64-encoded chart image */
  imageBase64: string;
  /** MIME type of the image (e.g. image/png) */
  mediaType: string;
  timeframe: ChartAnalysisInputTimeframe;
  session: ChartAnalysisInputSession;
  news: ChartAnalysisInputNews;
  /** Account size in USD */
  accountSize: number;
  /**
     * Optional trader notes
     * @nullable
     */
  context?: string | null;
  /**
     * Time of day (HH:MM, 24h) in ET the trader is evaluating entry
     * @nullable
     */
  analysisTime?: string | null;
  /**
     * Market pair or ticker symbol
     * @nullable
     */
  ticker?: string | null;
  /** Instrument asset class — drives session and timezone handling */
  assetClass?: ChartAnalysisInputAssetClass;
  /**
     * When true (default), the AI reads the instrument (symbol + asset class) and timeframe directly from the chart and uses the provided ticker/assetClass/timeframe only as a fallback hint. When false, the provided ticker/assetClass/timeframe are authoritative and must not be overridden from the chart (used after the trader corrects a detection).
     * @nullable
     */
  autoDetect?: boolean | null;
  /**
     * Max risk per trade as percent of account
     * @nullable
     */
  maxRiskPct?: number | null;
  /**
     * Max daily drawdown as percent of account
     * @nullable
     */
  maxDailyDrawdownPct?: number | null;
  /**
     * Minimum risk/reward ratio
     * @nullable
     */
  minRR?: number | null;
  /** User-defined long entry criteria */
  longCriteria?: string[];
  /** User-defined short entry criteria */
  shortCriteria?: string[];
  /** Extra risk rules beyond the numeric ones */
  riskRules?: string[];
}

export interface TimingAnalysis {
  /** Recommended time window to execute the trade */
  executionWindow: string;
  /** Signals that would confirm a trend flip */
  flipSignals: string[];
  /** Estimated hold duration and how to manage the trade */
  holdGuidance: string;
  /** What to watch for a possible reversal or exit */
  exitWatchlist: string[];
  /** Time-of-day / session risk notes (e.g. chop zones, news windows) */
  sessionRisk: string;
}

export interface PlacedSetupEvaluation {
  /** Whether the trader drew their own trade (entry/stop/target markers) on the chart */
  detected: boolean;
  /** The direction of the trader's drawn trade (Long, Short, or empty) */
  direction?: string;
  /** The drawn entry level read back from the chart */
  entry?: string;
  /** The drawn stop-loss level read back from the chart */
  stop?: string;
  /** The drawn target level(s) read back from the chart */
  targets?: string;
  /** Indicators detected as part of the trader's drawn setup */
  indicators?: string[];
  /** Grade for the drawn trade (A+ / A / B / C / No Trade) */
  grade?: string;
  /** Short assessment of the trader's drawn trade */
  assessment?: string;
  /** 2-4 concrete things that would lift the drawn trade toward A+ */
  improvements?: string[];
}

export interface ChartAnalysisResult {
  grade: string;
  score_total: number;
  trend_strength: number;
  momentum: number;
  volume_confirmation: number;
  risk_reward_score: number;
  indicator_alignment: number;
  bias: string;
  trend_direction: string;
  indicators_found: string[];
  indicators_missing: string[];
  support_levels: string;
  resistance_levels: string;
  liquidity_zones: string;
  long_entry: string;
  short_entry: string;
  stop_loss: string;
  target_1: string;
  target_2: string;
  rr_ratio: string;
  rr_percent: number;
  qualifies: boolean;
  qualification_reason: string;
  plan_compliance: string;
  warnings: string[];
  full_analysis: string;
  a_plus_factors: string[];
  timing: TimingAnalysis;
  /** The single directional call to execute (Long, Short, or No Trade) */
  recommended_direction?: string;
  /** The single execution entry level/condition for the recommended direction */
  recommended_entry?: string;
  /** The conditions/confluences this setup needs to be valid, in plain English */
  setup_conditions?: string[];
  /** Whether a second target / runner is genuinely warranted for this setup */
  target_2_warranted?: boolean;
  /** Why a second target is or is not warranted */
  target_2_reason?: string;
  placed_setup?: PlacedSetupEvaluation;
  /** Instrument/symbol read from the chart (or the fallback used; empty if unknown) */
  detected_ticker?: string;
  /** Asset class read from the chart (futures, stocks, forex, crypto, or unknown) */
  detected_asset_class?: string;
  /** Timeframe read from the chart (e.g. 5m; empty/unknown if not visible) */
  detected_timeframe?: string;
}

/**
 * Instrument asset class
 */
export type ChartReviewInputAssetClass = typeof ChartReviewInputAssetClass[keyof typeof ChartReviewInputAssetClass];


export const ChartReviewInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;

export interface ChartReviewInput {
  /** Base64-encoded chart image */
  imageBase64: string;
  /** MIME type of the image */
  mediaType: string;
  /**
     * Market pair or ticker symbol
     * @nullable
     */
  ticker?: string | null;
  /** Instrument asset class */
  assetClass?: ChartReviewInputAssetClass;
  /**
     * Chart timeframe
     * @nullable
     */
  timeframe?: string | null;
  /** @nullable */
  maxRiskPct?: number | null;
  /** @nullable */
  maxDailyDrawdownPct?: number | null;
  /** @nullable */
  minRR?: number | null;
  /** @nullable */
  accountSize?: number | null;
  longCriteria?: string[];
  shortCriteria?: string[];
  riskRules?: string[];
}

export interface ChartReviewResult {
  trade_grade: string;
  confidence_score: number;
  trend_alignment: string;
  risk_reward_assessment: string;
  long_setup_quality: string;
  short_setup_quality: string;
  support_resistance_quality: string;
  volume_analysis: string;
  full_review: string;
  potential_risks: string[];
}

/**
 * Instrument asset class
 */
export type NewsAnalysisInputAssetClass = typeof NewsAnalysisInputAssetClass[keyof typeof NewsAnalysisInputAssetClass];


export const NewsAnalysisInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;

export interface NewsAnalysisInput {
  /**
     * Pasted news headlines, economic event details, or notes
     * @nullable
     */
  newsText?: string | null;
  /**
     * Base64-encoded screenshot of news (optional)
     * @nullable
     */
  imageBase64?: string | null;
  /**
     * MIME type of the screenshot (e.g. image/png)
     * @nullable
     */
  mediaType?: string | null;
  /**
     * Market the user trades
     * @nullable
     */
  ticker?: string | null;
  /** Instrument asset class */
  assetClass?: NewsAnalysisInputAssetClass;
  /** @nullable */
  accountSize?: number | null;
  /** @nullable */
  maxRiskPct?: number | null;
  /** @nullable */
  minRR?: number | null;
  /** User-defined long entry criteria */
  longCriteria?: string[];
  /** User-defined short entry criteria */
  shortCriteria?: string[];
  /** Extra risk rules */
  riskRules?: string[];
}

export interface NewsAnalysisResult {
  /** Predicted market direction (Bullish, Bearish, or Neutral) */
  direction: string;
  /** Expected volatility (High, Medium, or Low) */
  volatility: string;
  /** Impact rating on the market (High, Medium, or Low) */
  impact: string;
  /** Confidence in the prediction (0-100) */
  confidence: number;
  /** One or two sentence plain-English summary */
  summary: string;
  /** Recent or upcoming events identified from the input */
  key_events: string[];
  /** When the impact is most likely to be felt */
  affected_window: string;
  /** Plain-English recommendation tied to the trader's strategy */
  trade_recommendation: string;
  /** Beginner-friendly explanation of the prediction */
  reasoning: string;
  /** A simple tip for a newer trader */
  beginner_tip: string;
  /** Caveats or risks to keep in mind */
  warnings: string[];
}

/**
 * The direction of the trade that was taken
 */
export type TradeDebriefInputDirection = typeof TradeDebriefInputDirection[keyof typeof TradeDebriefInputDirection];


export const TradeDebriefInputDirection = {
  long: 'long',
  short: 'short',
} as const;

/**
 * What happened to the trade
 */
export type TradeDebriefInputOutcome = typeof TradeDebriefInputOutcome[keyof typeof TradeDebriefInputOutcome];


export const TradeDebriefInputOutcome = {
  stopped_out: 'stopped_out',
  missed_target: 'missed_target',
  reversed: 'reversed',
  breakeven: 'breakeven',
  other: 'other',
} as const;

export type TradeDebriefInputAssetClass = typeof TradeDebriefInputAssetClass[keyof typeof TradeDebriefInputAssetClass];


export const TradeDebriefInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;

export interface TradeDebriefInput {
  /**
     * Base64-encoded chart screenshot showing how the trade played out (optional)
     * @nullable
     */
  imageBase64?: string | null;
  /**
     * MIME type of the screenshot (e.g. image/png)
     * @nullable
     */
  mediaType?: string | null;
  /** The direction of the trade that was taken */
  direction: TradeDebriefInputDirection;
  /** What happened to the trade */
  outcome: TradeDebriefInputOutcome;
  /**
     * Entry price or level the trader used
     * @nullable
     */
  entry?: string | null;
  /**
     * Stop-loss price or level
     * @nullable
     */
  stop?: string | null;
  /**
     * Target / take-profit price or level the trade was aiming for
     * @nullable
     */
  target?: string | null;
  /**
     * Trader's own notes about what happened
     * @nullable
     */
  notes?: string | null;
  /** @nullable */
  ticker?: string | null;
  assetClass?: TradeDebriefInputAssetClass;
  /** @nullable */
  timeframe?: string | null;
  /** User-defined long entry criteria */
  longCriteria?: string[];
  /** User-defined short entry criteria */
  shortCriteria?: string[];
  /** Extra risk rules */
  riskRules?: string[];
}

export interface TradeDebriefResult {
  /** One-line headline of why the trade did not hit its target */
  verdict: string;
  /** Two to three sentence plain-English explanation */
  summary: string;
  /** The single biggest reason the trade missed */
  primary_reason: string;
  /** Other factors that contributed to the trade missing */
  contributing_factors: string[];
  /** Plain-English read of what the chart shows happened after entry */
  chart_read: string;
  /** Specific, actionable lessons from this trade */
  lessons: string[];
  /** Concrete things to do differently next time */
  next_time: string[];
  /** One supportive, beginner-friendly sentence */
  encouragement: string;
  /** Caveats or risks to keep in mind */
  warnings: string[];
}

/**
 * Instrument asset class
 */
export type TradingSettingsAssetClass = typeof TradingSettingsAssetClass[keyof typeof TradingSettingsAssetClass];


export const TradingSettingsAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;

export type TradingSettingsDefaultTimeframe = typeof TradingSettingsDefaultTimeframe[keyof typeof TradingSettingsDefaultTimeframe];


export const TradingSettingsDefaultTimeframe = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
} as const;

export type TradingSettingsLastSession = typeof TradingSettingsLastSession[keyof typeof TradingSettingsLastSession];


export const TradingSettingsLastSession = {
  premarket: 'premarket',
  rth: 'rth',
  afterhours: 'afterhours',
} as const;

export type TradingSettingsLastNews = typeof TradingSettingsLastNews[keyof typeof TradingSettingsLastNews];


export const TradingSettingsLastNews = {
  no: 'no',
  yes: 'yes',
  just: 'just',
} as const;

export interface TradingSettings {
  ticker: string;
  /** Instrument asset class */
  assetClass?: TradingSettingsAssetClass;
  /** Account-currency P&L per 1.0 price move per 1 unit */
  pointValue?: number;
  /** Minimum price increment for the instrument */
  tickSize?: number;
  /** Unit label for position size (e.g. contracts, shares, lots, units) */
  quantityLabel?: string;
  /** Account/quote currency code (e.g. USD) */
  currency?: string;
  defaultTimeframe: TradingSettingsDefaultTimeframe;
  lastSession: TradingSettingsLastSession;
  lastNews: TradingSettingsLastNews;
  maxRiskPct: number;
  maxDailyDrawdownPct: number;
  minRR: number;
  accountSize: number;
  longCriteria: string[];
  shortCriteria: string[];
  riskRules: string[];
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  ticker: string;
  timeframe: string;
  session: string;
  grade: string;
  score_total: number;
  bias: string;
  qualifies: boolean;
  rr_ratio: string;
  full_analysis: string;
  analysisTime?: string;
  timing?: TimingAnalysis;
}

export interface SettingsResponse {
  data: TradingSettings | null;
}

export interface JournalListResponse {
  entries: JournalEntry[];
}

export interface OkResponse {
  ok: boolean;
}

export interface ImportRequest {
  entries: JournalEntry[];
  settings?: TradingSettings | null;
}

export interface ImportResult {
  count: number;
  settingsImported: boolean;
}

export type MeResponsePlan = typeof MeResponsePlan[keyof typeof MeResponsePlan];


export const MeResponsePlan = {
  none: 'none',
  basic: 'basic',
  pro: 'pro',
  gold: 'gold',
  lifetime: 'lifetime',
} as const;

export interface MeResponse {
  userId: string;
  email: string | null;
  plan: MeResponsePlan;
  unlimited: boolean;
  subscriptionStatus: string | null;
  monthlyCredits: number;
  packCredits: number;
  totalCredits: number;
  canUse: boolean;
  creditCost: number;
  /** ISO timestamp when time-boxed unlimited (Gold) access expires, or null. */
  unlimitedUntil: string | null;
}

export type PlanKind = typeof PlanKind[keyof typeof PlanKind];


export const PlanKind = {
  subscription: 'subscription',
  credit_pack: 'credit_pack',
  lifetime: 'lifetime',
  gold: 'gold',
} as const;

export interface Plan {
  priceId: string;
  productId: string;
  name: string;
  description?: string | null;
  amount: number;
  currency: string;
  interval?: string | null;
  intervalCount?: number | null;
  kind: PlanKind;
  tier?: string | null;
  credits?: number | null;
  unlimited: boolean;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface CheckoutRequest {
  priceId: string;
}

export interface CheckoutUrlResponse {
  url: string;
}

export interface VerifyRequest {
  sessionId: string;
}

```

### `lib/api-client-react/src/generated/api.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  ChartAnalysisInput,
  ChartAnalysisResult,
  ChartReviewInput,
  ChartReviewResult,
  CheckoutRequest,
  CheckoutUrlResponse,
  ErrorResponse,
  HealthStatus,
  ImportRequest,
  ImportResult,
  JournalEntry,
  JournalListResponse,
  MeResponse,
  NewsAnalysisInput,
  NewsAnalysisResult,
  OkResponse,
  PlansResponse,
  SettingsResponse,
  TradeDebriefInput,
  TradeDebriefResult,
  TradingSettings,
  VerifyRequest
} from './api.schemas';

import { customFetch } from '../custom-fetch';
import type { ErrorType , BodyType } from '../custom-fetch';

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getHealthCheckUrl = () => {




  return `/api/healthz`
}

/**
 * Returns server health status
 * @summary Health check
 */
export const healthCheck = async ( options?: RequestInit): Promise<HealthStatus> => {

  return customFetch<HealthStatus>(getHealthCheckUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getHealthCheckQueryKey = () => {
    return [
    `/api/healthz`
    ] as const;
    }


export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthCheckQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>
export type HealthCheckQueryError = ErrorType<unknown>


/**
 * @summary Health check
 */

export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getHealthCheckQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAnalyzeChartUrl = () => {




  return `/api/analysis/analyze`
}

/**
 * Sends chart image to Claude Vision for trade setup grading
 * @summary Analyze a chart image
 */
export const analyzeChart = async (chartAnalysisInput: ChartAnalysisInput, options?: RequestInit): Promise<ChartAnalysisResult> => {

  return customFetch<ChartAnalysisResult>(getAnalyzeChartUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      chartAnalysisInput,)
  }
);}




export const getAnalyzeChartMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeChart>>, TError,{data: BodyType<ChartAnalysisInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof analyzeChart>>, TError,{data: BodyType<ChartAnalysisInput>}, TContext> => {

const mutationKey = ['analyzeChart'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof analyzeChart>>, {data: BodyType<ChartAnalysisInput>}> = (props) => {
          const {data} = props ?? {};

          return  analyzeChart(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AnalyzeChartMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeChart>>>
    export type AnalyzeChartMutationBody = BodyType<ChartAnalysisInput>
    export type AnalyzeChartMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Analyze a chart image
 */
export const useAnalyzeChart = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeChart>>, TError,{data: BodyType<ChartAnalysisInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof analyzeChart>>,
        TError,
        {data: BodyType<ChartAnalysisInput>},
        TContext
      > => {
      return useMutation(getAnalyzeChartMutationOptions(options));
    }

export const getAnalyzeNewsUrl = () => {




  return `/api/analysis/news`
}

/**
 * Sends news text and/or a screenshot to Claude to predict market impact
 * @summary Predict market impact from news
 */
export const analyzeNews = async (newsAnalysisInput: NewsAnalysisInput, options?: RequestInit): Promise<NewsAnalysisResult> => {

  return customFetch<NewsAnalysisResult>(getAnalyzeNewsUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      newsAnalysisInput,)
  }
);}




export const getAnalyzeNewsMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeNews>>, TError,{data: BodyType<NewsAnalysisInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof analyzeNews>>, TError,{data: BodyType<NewsAnalysisInput>}, TContext> => {

const mutationKey = ['analyzeNews'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof analyzeNews>>, {data: BodyType<NewsAnalysisInput>}> = (props) => {
          const {data} = props ?? {};

          return  analyzeNews(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AnalyzeNewsMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeNews>>>
    export type AnalyzeNewsMutationBody = BodyType<NewsAnalysisInput>
    export type AnalyzeNewsMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Predict market impact from news
 */
export const useAnalyzeNews = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeNews>>, TError,{data: BodyType<NewsAnalysisInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof analyzeNews>>,
        TError,
        {data: BodyType<NewsAnalysisInput>},
        TContext
      > => {
      return useMutation(getAnalyzeNewsMutationOptions(options));
    }

export const getReviewChartUrl = () => {




  return `/api/analysis/review`
}

/**
 * Generates a comprehensive trader review mode analysis
 * @summary Full trader review of a chart
 */
export const reviewChart = async (chartReviewInput: ChartReviewInput, options?: RequestInit): Promise<ChartReviewResult> => {

  return customFetch<ChartReviewResult>(getReviewChartUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      chartReviewInput,)
  }
);}




export const getReviewChartMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof reviewChart>>, TError,{data: BodyType<ChartReviewInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof reviewChart>>, TError,{data: BodyType<ChartReviewInput>}, TContext> => {

const mutationKey = ['reviewChart'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof reviewChart>>, {data: BodyType<ChartReviewInput>}> = (props) => {
          const {data} = props ?? {};

          return  reviewChart(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ReviewChartMutationResult = NonNullable<Awaited<ReturnType<typeof reviewChart>>>
    export type ReviewChartMutationBody = BodyType<ChartReviewInput>
    export type ReviewChartMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Full trader review of a chart
 */
export const useReviewChart = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof reviewChart>>, TError,{data: BodyType<ChartReviewInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof reviewChart>>,
        TError,
        {data: BodyType<ChartReviewInput>},
        TContext
      > => {
      return useMutation(getReviewChartMutationOptions(options));
    }

export const getDebriefTradeUrl = () => {




  return `/api/analysis/debrief`
}

/**
 * Sends a post-trade chart and the trade details to Claude for a plain-English debrief
 * @summary Explain why a trade did not hit its target
 */
export const debriefTrade = async (tradeDebriefInput: TradeDebriefInput, options?: RequestInit): Promise<TradeDebriefResult> => {

  return customFetch<TradeDebriefResult>(getDebriefTradeUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      tradeDebriefInput,)
  }
);}




export const getDebriefTradeMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof debriefTrade>>, TError,{data: BodyType<TradeDebriefInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof debriefTrade>>, TError,{data: BodyType<TradeDebriefInput>}, TContext> => {

const mutationKey = ['debriefTrade'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof debriefTrade>>, {data: BodyType<TradeDebriefInput>}> = (props) => {
          const {data} = props ?? {};

          return  debriefTrade(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DebriefTradeMutationResult = NonNullable<Awaited<ReturnType<typeof debriefTrade>>>
    export type DebriefTradeMutationBody = BodyType<TradeDebriefInput>
    export type DebriefTradeMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Explain why a trade did not hit its target
 */
export const useDebriefTrade = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof debriefTrade>>, TError,{data: BodyType<TradeDebriefInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof debriefTrade>>,
        TError,
        {data: BodyType<TradeDebriefInput>},
        TContext
      > => {
      return useMutation(getDebriefTradeMutationOptions(options));
    }

export const getGetMeUrl = () => {




  return `/api/me`
}

/**
 * @summary Current user account, plan and credit balance
 */
export const getMe = async ( options?: RequestInit): Promise<MeResponse> => {

  return customFetch<MeResponse>(getGetMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetMeQueryKey = () => {
    return [
    `/api/me`
    ] as const;
    }


export const getGetMeQueryOptions = <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMe>>> = ({ signal }) => getMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & { queryKey: QueryKey }
}

export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>
export type GetMeQueryError = ErrorType<ErrorResponse>


/**
 * @summary Current user account, plan and credit balance
 */

export function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetMeQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getGetSettingsUrl = () => {




  return `/api/settings`
}

/**
 * @summary Get the user's trading plan settings
 */
export const getSettings = async ( options?: RequestInit): Promise<SettingsResponse> => {

  return customFetch<SettingsResponse>(getGetSettingsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetSettingsQueryKey = () => {
    return [
    `/api/settings`
    ] as const;
    }


export const getGetSettingsQueryOptions = <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSettingsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSettings>>> = ({ signal }) => getSettings({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & { queryKey: QueryKey }
}

export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>
export type GetSettingsQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get the user's trading plan settings
 */

export function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetSettingsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUpdateSettingsUrl = () => {




  return `/api/settings`
}

/**
 * @summary Replace the user's trading plan settings
 */
export const updateSettings = async (tradingSettings: TradingSettings, options?: RequestInit): Promise<SettingsResponse> => {

  return customFetch<SettingsResponse>(getUpdateSettingsUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      tradingSettings,)
  }
);}




export const getUpdateSettingsMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: BodyType<TradingSettings>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: BodyType<TradingSettings>}, TContext> => {

const mutationKey = ['updateSettings'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateSettings>>, {data: BodyType<TradingSettings>}> = (props) => {
          const {data} = props ?? {};

          return  updateSettings(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>
    export type UpdateSettingsMutationBody = BodyType<TradingSettings>
    export type UpdateSettingsMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Replace the user's trading plan settings
 */
export const useUpdateSettings = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError,{data: BodyType<TradingSettings>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof updateSettings>>,
        TError,
        {data: BodyType<TradingSettings>},
        TContext
      > => {
      return useMutation(getUpdateSettingsMutationOptions(options));
    }

export const getGetJournalUrl = () => {




  return `/api/journal`
}

/**
 * @summary List the user's journal entries (newest first)
 */
export const getJournal = async ( options?: RequestInit): Promise<JournalListResponse> => {

  return customFetch<JournalListResponse>(getGetJournalUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetJournalQueryKey = () => {
    return [
    `/api/journal`
    ] as const;
    }


export const getGetJournalQueryOptions = <TData = Awaited<ReturnType<typeof getJournal>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getJournal>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetJournalQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getJournal>>> = ({ signal }) => getJournal({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getJournal>>, TError, TData> & { queryKey: QueryKey }
}

export type GetJournalQueryResult = NonNullable<Awaited<ReturnType<typeof getJournal>>>
export type GetJournalQueryError = ErrorType<ErrorResponse>


/**
 * @summary List the user's journal entries (newest first)
 */

export function useGetJournal<TData = Awaited<ReturnType<typeof getJournal>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getJournal>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetJournalQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAddJournalEntryUrl = () => {




  return `/api/journal`
}

/**
 * @summary Add a journal entry
 */
export const addJournalEntry = async (journalEntry: JournalEntry, options?: RequestInit): Promise<JournalEntry> => {

  return customFetch<JournalEntry>(getAddJournalEntryUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      journalEntry,)
  }
);}




export const getAddJournalEntryMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addJournalEntry>>, TError,{data: BodyType<JournalEntry>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addJournalEntry>>, TError,{data: BodyType<JournalEntry>}, TContext> => {

const mutationKey = ['addJournalEntry'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addJournalEntry>>, {data: BodyType<JournalEntry>}> = (props) => {
          const {data} = props ?? {};

          return  addJournalEntry(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddJournalEntryMutationResult = NonNullable<Awaited<ReturnType<typeof addJournalEntry>>>
    export type AddJournalEntryMutationBody = BodyType<JournalEntry>
    export type AddJournalEntryMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Add a journal entry
 */
export const useAddJournalEntry = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addJournalEntry>>, TError,{data: BodyType<JournalEntry>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof addJournalEntry>>,
        TError,
        {data: BodyType<JournalEntry>},
        TContext
      > => {
      return useMutation(getAddJournalEntryMutationOptions(options));
    }

export const getClearJournalUrl = () => {




  return `/api/journal`
}

/**
 * @summary Delete all of the user's journal entries
 */
export const clearJournal = async ( options?: RequestInit): Promise<OkResponse> => {

  return customFetch<OkResponse>(getClearJournalUrl(),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getClearJournalMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clearJournal>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof clearJournal>>, TError,void, TContext> => {

const mutationKey = ['clearJournal'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof clearJournal>>, void> = () => {


          return  clearJournal(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ClearJournalMutationResult = NonNullable<Awaited<ReturnType<typeof clearJournal>>>

    export type ClearJournalMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Delete all of the user's journal entries
 */
export const useClearJournal = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clearJournal>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof clearJournal>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getClearJournalMutationOptions(options));
    }

export const getImportDataUrl = () => {




  return `/api/journal/import`
}

/**
 * @summary Bulk import journal entries and optionally settings (first-login migration)
 */
export const importData = async (importRequest: ImportRequest, options?: RequestInit): Promise<ImportResult> => {

  return customFetch<ImportResult>(getImportDataUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      importRequest,)
  }
);}




export const getImportDataMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof importData>>, TError,{data: BodyType<ImportRequest>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof importData>>, TError,{data: BodyType<ImportRequest>}, TContext> => {

const mutationKey = ['importData'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof importData>>, {data: BodyType<ImportRequest>}> = (props) => {
          const {data} = props ?? {};

          return  importData(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ImportDataMutationResult = NonNullable<Awaited<ReturnType<typeof importData>>>
    export type ImportDataMutationBody = BodyType<ImportRequest>
    export type ImportDataMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Bulk import journal entries and optionally settings (first-login migration)
 */
export const useImportData = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof importData>>, TError,{data: BodyType<ImportRequest>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof importData>>,
        TError,
        {data: BodyType<ImportRequest>},
        TContext
      > => {
      return useMutation(getImportDataMutationOptions(options));
    }

export const getGetPlansUrl = () => {




  return `/api/billing/plans`
}

/**
 * @summary List purchasable plans and credit packs
 */
export const getPlans = async ( options?: RequestInit): Promise<PlansResponse> => {

  return customFetch<PlansResponse>(getGetPlansUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetPlansQueryKey = () => {
    return [
    `/api/billing/plans`
    ] as const;
    }


export const getGetPlansQueryOptions = <TData = Awaited<ReturnType<typeof getPlans>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getPlans>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetPlansQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getPlans>>> = ({ signal }) => getPlans({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getPlans>>, TError, TData> & { queryKey: QueryKey }
}

export type GetPlansQueryResult = NonNullable<Awaited<ReturnType<typeof getPlans>>>
export type GetPlansQueryError = ErrorType<unknown>


/**
 * @summary List purchasable plans and credit packs
 */

export function useGetPlans<TData = Awaited<ReturnType<typeof getPlans>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getPlans>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetPlansQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCreateCheckoutUrl = () => {




  return `/api/billing/checkout`
}

/**
 * @summary Create a Stripe Checkout session for a plan or credit pack
 */
export const createCheckout = async (checkoutRequest: CheckoutRequest, options?: RequestInit): Promise<CheckoutUrlResponse> => {

  return customFetch<CheckoutUrlResponse>(getCreateCheckoutUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      checkoutRequest,)
  }
);}




export const getCreateCheckoutMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCheckout>>, TError,{data: BodyType<CheckoutRequest>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createCheckout>>, TError,{data: BodyType<CheckoutRequest>}, TContext> => {

const mutationKey = ['createCheckout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createCheckout>>, {data: BodyType<CheckoutRequest>}> = (props) => {
          const {data} = props ?? {};

          return  createCheckout(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateCheckoutMutationResult = NonNullable<Awaited<ReturnType<typeof createCheckout>>>
    export type CreateCheckoutMutationBody = BodyType<CheckoutRequest>
    export type CreateCheckoutMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Create a Stripe Checkout session for a plan or credit pack
 */
export const useCreateCheckout = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCheckout>>, TError,{data: BodyType<CheckoutRequest>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createCheckout>>,
        TError,
        {data: BodyType<CheckoutRequest>},
        TContext
      > => {
      return useMutation(getCreateCheckoutMutationOptions(options));
    }

export const getCreatePortalUrl = () => {




  return `/api/billing/portal`
}

/**
 * @summary Create a Stripe billing portal session
 */
export const createPortal = async ( options?: RequestInit): Promise<CheckoutUrlResponse> => {

  return customFetch<CheckoutUrlResponse>(getCreatePortalUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getCreatePortalMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPortal>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createPortal>>, TError,void, TContext> => {

const mutationKey = ['createPortal'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createPortal>>, void> = () => {


          return  createPortal(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreatePortalMutationResult = NonNullable<Awaited<ReturnType<typeof createPortal>>>

    export type CreatePortalMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Create a Stripe billing portal session
 */
export const useCreatePortal = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPortal>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createPortal>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getCreatePortalMutationOptions(options));
    }

export const getVerifyCheckoutUrl = () => {




  return `/api/billing/verify`
}

/**
 * @summary Finalize a completed checkout and return refreshed account info
 */
export const verifyCheckout = async (verifyRequest: VerifyRequest, options?: RequestInit): Promise<MeResponse> => {

  return customFetch<MeResponse>(getVerifyCheckoutUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      verifyRequest,)
  }
);}




export const getVerifyCheckoutMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof verifyCheckout>>, TError,{data: BodyType<VerifyRequest>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof verifyCheckout>>, TError,{data: BodyType<VerifyRequest>}, TContext> => {

const mutationKey = ['verifyCheckout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof verifyCheckout>>, {data: BodyType<VerifyRequest>}> = (props) => {
          const {data} = props ?? {};

          return  verifyCheckout(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type VerifyCheckoutMutationResult = NonNullable<Awaited<ReturnType<typeof verifyCheckout>>>
    export type VerifyCheckoutMutationBody = BodyType<VerifyRequest>
    export type VerifyCheckoutMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Finalize a completed checkout and return refreshed account info
 */
export const useVerifyCheckout = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof verifyCheckout>>, TError,{data: BodyType<VerifyRequest>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof verifyCheckout>>,
        TError,
        {data: BodyType<VerifyRequest>},
        TContext
      > => {
      return useMutation(getVerifyCheckoutMutationOptions(options));
    }

```

### `lib/api-client-react/src/index.ts`

```ts
export * from "./generated/api";
export * from "./generated/api.schemas";
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";
```

### `lib/api-client-react/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["dom", "es2022"]
  },
  "include": ["src"]
}
```

### `lib/api-spec/openapi.yaml`

```yaml
openapi: 3.1.0
info:
  title: Api
  version: 0.1.0
  description: AI Trading Copilot API — multi-asset chart, news, and trade analysis
servers:
  - url: /api
    description: Base API path
tags:
  - name: health
    description: Health operations
  - name: analysis
    description: Chart analysis operations
  - name: account
    description: User account, settings and journal
  - name: billing
    description: Subscription and credit billing
paths:
  /healthz:
    get:
      operationId: healthCheck
      tags: [health]
      summary: Health check
      description: Returns server health status
      responses:
        "200":
          description: Healthy
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/HealthStatus"
  /analysis/analyze:
    post:
      operationId: analyzeChart
      tags: [analysis]
      summary: Analyze a chart image
      description: Sends chart image to Claude Vision for trade setup grading
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChartAnalysisInput"
      responses:
        "200":
          description: Analysis result
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ChartAnalysisResult"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Server error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /analysis/news:
    post:
      operationId: analyzeNews
      tags: [analysis]
      summary: Predict market impact from news
      description: Sends news text and/or a screenshot to Claude to predict market impact
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/NewsAnalysisInput"
      responses:
        "200":
          description: News impact prediction
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/NewsAnalysisResult"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Server error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /analysis/review:
    post:
      operationId: reviewChart
      tags: [analysis]
      summary: Full trader review of a chart
      description: Generates a comprehensive trader review mode analysis
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChartReviewInput"
      responses:
        "200":
          description: Review result
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ChartReviewResult"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Server error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /analysis/debrief:
    post:
      operationId: debriefTrade
      tags: [analysis]
      summary: Explain why a trade did not hit its target
      description: Sends a post-trade chart and the trade details to Claude for a plain-English debrief
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TradeDebriefInput"
      responses:
        "200":
          description: Trade debrief
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TradeDebriefResult"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Server error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /me:
    get:
      operationId: getMe
      tags: [account]
      summary: Current user account, plan and credit balance
      responses:
        "200":
          description: Account info
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MeResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /settings:
    get:
      operationId: getSettings
      tags: [account]
      summary: Get the user's trading plan settings
      responses:
        "200":
          description: Settings
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SettingsResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
    put:
      operationId: updateSettings
      tags: [account]
      summary: Replace the user's trading plan settings
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TradingSettings"
      responses:
        "200":
          description: Settings
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SettingsResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /journal:
    get:
      operationId: getJournal
      tags: [account]
      summary: List the user's journal entries (newest first)
      responses:
        "200":
          description: Journal entries
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/JournalListResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
    post:
      operationId: addJournalEntry
      tags: [account]
      summary: Add a journal entry
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/JournalEntry"
      responses:
        "200":
          description: Saved entry
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/JournalEntry"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
    delete:
      operationId: clearJournal
      tags: [account]
      summary: Delete all of the user's journal entries
      responses:
        "200":
          description: Cleared
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OkResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /journal/import:
    post:
      operationId: importData
      tags: [account]
      summary: Bulk import journal entries and optionally settings (first-login migration)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ImportRequest"
      responses:
        "200":
          description: Import result
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ImportResult"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /billing/plans:
    get:
      operationId: getPlans
      tags: [billing]
      summary: List purchasable plans and credit packs
      responses:
        "200":
          description: Plans
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PlansResponse"
  /billing/checkout:
    post:
      operationId: createCheckout
      tags: [billing]
      summary: Create a Stripe Checkout session for a plan or credit pack
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CheckoutRequest"
      responses:
        "200":
          description: Checkout URL
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CheckoutUrlResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /billing/portal:
    post:
      operationId: createPortal
      tags: [billing]
      summary: Create a Stripe billing portal session
      responses:
        "200":
          description: Portal URL
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CheckoutUrlResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /billing/verify:
    post:
      operationId: verifyCheckout
      tags: [billing]
      summary: Finalize a completed checkout and return refreshed account info
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/VerifyRequest"
      responses:
        "200":
          description: Refreshed account info
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MeResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
components:
  schemas:
    HealthStatus:
      type: object
      properties:
        status:
          type: string
      required:
        - status
    ErrorResponse:
      type: object
      properties:
        error:
          type: string
      required:
        - error
    ChartAnalysisInput:
      type: object
      required: [imageBase64, mediaType, timeframe, session, news, accountSize]
      properties:
        imageBase64:
          type: string
          description: Base64-encoded chart image
        mediaType:
          type: string
          description: MIME type of the image (e.g. image/png)
        timeframe:
          type: string
          enum: [1m, 5m, 15m, 30m, 1h, 4h, 1d]
        session:
          type: string
          enum: [premarket, rth, afterhours]
        news:
          type: string
          enum: [no, yes, just]
        accountSize:
          type: number
          description: Account size in USD
        context:
          type: ["string", "null"]
          description: Optional trader notes
        analysisTime:
          type: ["string", "null"]
          description: Time of day (HH:MM, 24h) in ET the trader is evaluating entry
        ticker:
          type: ["string", "null"]
          description: Market pair or ticker symbol
        assetClass:
          type: string
          enum: [futures, stocks, forex, crypto]
          description: Instrument asset class — drives session and timezone handling
        autoDetect:
          type: ["boolean", "null"]
          description: >-
            When true (default), the AI reads the instrument (symbol + asset class)
            and timeframe directly from the chart and uses the provided
            ticker/assetClass/timeframe only as a fallback hint. When false, the
            provided ticker/assetClass/timeframe are authoritative and must not be
            overridden from the chart (used after the trader corrects a detection).
        maxRiskPct:
          type: ["number", "null"]
          description: Max risk per trade as percent of account
        maxDailyDrawdownPct:
          type: ["number", "null"]
          description: Max daily drawdown as percent of account
        minRR:
          type: ["number", "null"]
          description: Minimum risk/reward ratio
        longCriteria:
          type: array
          items:
            type: string
          description: User-defined long entry criteria
        shortCriteria:
          type: array
          items:
            type: string
          description: User-defined short entry criteria
        riskRules:
          type: array
          items:
            type: string
          description: Extra risk rules beyond the numeric ones
    ChartAnalysisResult:
      type: object
      required:
        - grade
        - score_total
        - trend_strength
        - momentum
        - volume_confirmation
        - risk_reward_score
        - indicator_alignment
        - bias
        - trend_direction
        - indicators_found
        - indicators_missing
        - support_levels
        - resistance_levels
        - liquidity_zones
        - long_entry
        - short_entry
        - stop_loss
        - target_1
        - target_2
        - rr_ratio
        - rr_percent
        - qualifies
        - qualification_reason
        - plan_compliance
        - warnings
        - full_analysis
        - a_plus_factors
        - timing
      properties:
        grade:
          type: string
        score_total:
          type: number
        trend_strength:
          type: number
        momentum:
          type: number
        volume_confirmation:
          type: number
        risk_reward_score:
          type: number
        indicator_alignment:
          type: number
        bias:
          type: string
        trend_direction:
          type: string
        indicators_found:
          type: array
          items:
            type: string
        indicators_missing:
          type: array
          items:
            type: string
        support_levels:
          type: string
        resistance_levels:
          type: string
        liquidity_zones:
          type: string
        long_entry:
          type: string
        short_entry:
          type: string
        stop_loss:
          type: string
        target_1:
          type: string
        target_2:
          type: string
        rr_ratio:
          type: string
        rr_percent:
          type: number
        qualifies:
          type: boolean
        qualification_reason:
          type: string
        plan_compliance:
          type: string
        warnings:
          type: array
          items:
            type: string
        full_analysis:
          type: string
        a_plus_factors:
          type: array
          items:
            type: string
        timing:
          $ref: "#/components/schemas/TimingAnalysis"
        recommended_direction:
          type: string
          description: The single directional call to execute (Long, Short, or No Trade)
        recommended_entry:
          type: string
          description: The single execution entry level/condition for the recommended direction
        setup_conditions:
          type: array
          items:
            type: string
          description: The conditions/confluences this setup needs to be valid, in plain English
        target_2_warranted:
          type: boolean
          description: Whether a second target / runner is genuinely warranted for this setup
        target_2_reason:
          type: string
          description: Why a second target is or is not warranted
        placed_setup:
          $ref: "#/components/schemas/PlacedSetupEvaluation"
        detected_ticker:
          type: string
          description: Instrument/symbol read from the chart (or the fallback used; empty if unknown)
        detected_asset_class:
          type: string
          description: Asset class read from the chart (futures, stocks, forex, crypto, or unknown)
        detected_timeframe:
          type: string
          description: Timeframe read from the chart (e.g. 5m; empty/unknown if not visible)
    PlacedSetupEvaluation:
      type: object
      required: [detected]
      properties:
        detected:
          type: boolean
          description: Whether the trader drew their own trade (entry/stop/target markers) on the chart
        direction:
          type: string
          description: The direction of the trader's drawn trade (Long, Short, or empty)
        entry:
          type: string
          description: The drawn entry level read back from the chart
        stop:
          type: string
          description: The drawn stop-loss level read back from the chart
        targets:
          type: string
          description: The drawn target level(s) read back from the chart
        indicators:
          type: array
          items:
            type: string
          description: Indicators detected as part of the trader's drawn setup
        grade:
          type: string
          description: Grade for the drawn trade (A+ / A / B / C / No Trade)
        assessment:
          type: string
          description: Short assessment of the trader's drawn trade
        improvements:
          type: array
          items:
            type: string
          description: 2-4 concrete things that would lift the drawn trade toward A+
    TimingAnalysis:
      type: object
      required:
        - executionWindow
        - flipSignals
        - holdGuidance
        - exitWatchlist
        - sessionRisk
      properties:
        executionWindow:
          type: string
          description: Recommended time window to execute the trade
        flipSignals:
          type: array
          items:
            type: string
          description: Signals that would confirm a trend flip
        holdGuidance:
          type: string
          description: Estimated hold duration and how to manage the trade
        exitWatchlist:
          type: array
          items:
            type: string
          description: What to watch for a possible reversal or exit
        sessionRisk:
          type: string
          description: Time-of-day / session risk notes (e.g. chop zones, news windows)
    ChartReviewInput:
      type: object
      required: [imageBase64, mediaType]
      properties:
        imageBase64:
          type: string
          description: Base64-encoded chart image
        mediaType:
          type: string
          description: MIME type of the image
        ticker:
          type: ["string", "null"]
          description: Market pair or ticker symbol
        assetClass:
          type: string
          enum: [futures, stocks, forex, crypto]
          description: Instrument asset class
        timeframe:
          type: ["string", "null"]
          description: Chart timeframe
        maxRiskPct:
          type: ["number", "null"]
        maxDailyDrawdownPct:
          type: ["number", "null"]
        minRR:
          type: ["number", "null"]
        accountSize:
          type: ["number", "null"]
        longCriteria:
          type: array
          items:
            type: string
        shortCriteria:
          type: array
          items:
            type: string
        riskRules:
          type: array
          items:
            type: string
    ChartReviewResult:
      type: object
      required:
        - trade_grade
        - confidence_score
        - trend_alignment
        - risk_reward_assessment
        - long_setup_quality
        - short_setup_quality
        - support_resistance_quality
        - volume_analysis
        - full_review
        - potential_risks
      properties:
        trade_grade:
          type: string
        confidence_score:
          type: number
        trend_alignment:
          type: string
        risk_reward_assessment:
          type: string
        long_setup_quality:
          type: string
        short_setup_quality:
          type: string
        support_resistance_quality:
          type: string
        volume_analysis:
          type: string
        full_review:
          type: string
        potential_risks:
          type: array
          items:
            type: string
    NewsAnalysisInput:
      type: object
      properties:
        newsText:
          type: ["string", "null"]
          description: Pasted news headlines, economic event details, or notes
        imageBase64:
          type: ["string", "null"]
          description: Base64-encoded screenshot of news (optional)
        mediaType:
          type: ["string", "null"]
          description: MIME type of the screenshot (e.g. image/png)
        ticker:
          type: ["string", "null"]
          description: Market the user trades
        assetClass:
          type: string
          enum: [futures, stocks, forex, crypto]
          description: Instrument asset class
        accountSize:
          type: ["number", "null"]
        maxRiskPct:
          type: ["number", "null"]
        minRR:
          type: ["number", "null"]
        longCriteria:
          type: array
          items:
            type: string
          description: User-defined long entry criteria
        shortCriteria:
          type: array
          items:
            type: string
          description: User-defined short entry criteria
        riskRules:
          type: array
          items:
            type: string
          description: Extra risk rules
    NewsAnalysisResult:
      type: object
      required:
        - direction
        - volatility
        - impact
        - confidence
        - summary
        - key_events
        - affected_window
        - trade_recommendation
        - reasoning
        - beginner_tip
        - warnings
      properties:
        direction:
          type: string
          description: Predicted market direction (Bullish, Bearish, or Neutral)
        volatility:
          type: string
          description: Expected volatility (High, Medium, or Low)
        impact:
          type: string
          description: Impact rating on the market (High, Medium, or Low)
        confidence:
          type: number
          description: Confidence in the prediction (0-100)
        summary:
          type: string
          description: One or two sentence plain-English summary
        key_events:
          type: array
          items:
            type: string
          description: Recent or upcoming events identified from the input
        affected_window:
          type: string
          description: When the impact is most likely to be felt
        trade_recommendation:
          type: string
          description: Plain-English recommendation tied to the trader's strategy
        reasoning:
          type: string
          description: Beginner-friendly explanation of the prediction
        beginner_tip:
          type: string
          description: A simple tip for a newer trader
        warnings:
          type: array
          items:
            type: string
          description: Caveats or risks to keep in mind
    TradeDebriefInput:
      type: object
      required: [direction, outcome]
      properties:
        imageBase64:
          type: ["string", "null"]
          description: Base64-encoded chart screenshot showing how the trade played out (optional)
        mediaType:
          type: ["string", "null"]
          description: MIME type of the screenshot (e.g. image/png)
        direction:
          type: string
          enum: [long, short]
          description: The direction of the trade that was taken
        outcome:
          type: string
          enum: [stopped_out, missed_target, reversed, breakeven, other]
          description: What happened to the trade
        entry:
          type: ["string", "null"]
          description: Entry price or level the trader used
        stop:
          type: ["string", "null"]
          description: Stop-loss price or level
        target:
          type: ["string", "null"]
          description: Target / take-profit price or level the trade was aiming for
        notes:
          type: ["string", "null"]
          description: Trader's own notes about what happened
        ticker:
          type: ["string", "null"]
        assetClass:
          type: string
          enum: [futures, stocks, forex, crypto]
        timeframe:
          type: ["string", "null"]
        longCriteria:
          type: array
          items:
            type: string
          description: User-defined long entry criteria
        shortCriteria:
          type: array
          items:
            type: string
          description: User-defined short entry criteria
        riskRules:
          type: array
          items:
            type: string
          description: Extra risk rules
    TradeDebriefResult:
      type: object
      required:
        - verdict
        - summary
        - primary_reason
        - contributing_factors
        - chart_read
        - lessons
        - next_time
        - encouragement
        - warnings
      properties:
        verdict:
          type: string
          description: One-line headline of why the trade did not hit its target
        summary:
          type: string
          description: Two to three sentence plain-English explanation
        primary_reason:
          type: string
          description: The single biggest reason the trade missed
        contributing_factors:
          type: array
          items:
            type: string
          description: Other factors that contributed to the trade missing
        chart_read:
          type: string
          description: Plain-English read of what the chart shows happened after entry
        lessons:
          type: array
          items:
            type: string
          description: Specific, actionable lessons from this trade
        next_time:
          type: array
          items:
            type: string
          description: Concrete things to do differently next time
        encouragement:
          type: string
          description: One supportive, beginner-friendly sentence
        warnings:
          type: array
          items:
            type: string
          description: Caveats or risks to keep in mind
    TradingSettings:
      type: object
      required:
        - ticker
        - defaultTimeframe
        - lastSession
        - lastNews
        - maxRiskPct
        - maxDailyDrawdownPct
        - minRR
        - accountSize
        - longCriteria
        - shortCriteria
        - riskRules
      properties:
        ticker:
          type: string
        assetClass:
          type: string
          enum: [futures, stocks, forex, crypto]
          description: Instrument asset class
        pointValue:
          type: number
          description: Account-currency P&L per 1.0 price move per 1 unit
        tickSize:
          type: number
          description: Minimum price increment for the instrument
        quantityLabel:
          type: string
          description: Unit label for position size (e.g. contracts, shares, lots, units)
        currency:
          type: string
          description: Account/quote currency code (e.g. USD)
        defaultTimeframe:
          type: string
          enum: [1m, 5m, 15m, 30m, 1h, 4h, 1d]
        lastSession:
          type: string
          enum: [premarket, rth, afterhours]
        lastNews:
          type: string
          enum: [no, yes, just]
        maxRiskPct:
          type: number
        maxDailyDrawdownPct:
          type: number
        minRR:
          type: number
        accountSize:
          type: number
        longCriteria:
          type: array
          items:
            type: string
        shortCriteria:
          type: array
          items:
            type: string
        riskRules:
          type: array
          items:
            type: string
    JournalEntry:
      type: object
      required:
        - id
        - timestamp
        - ticker
        - timeframe
        - session
        - grade
        - score_total
        - bias
        - qualifies
        - rr_ratio
        - full_analysis
      properties:
        id:
          type: string
        timestamp:
          type: number
        ticker:
          type: string
        timeframe:
          type: string
        session:
          type: string
        grade:
          type: string
        score_total:
          type: number
        bias:
          type: string
        qualifies:
          type: boolean
        rr_ratio:
          type: string
        full_analysis:
          type: string
        analysisTime:
          type: string
        timing:
          $ref: "#/components/schemas/TimingAnalysis"
    SettingsResponse:
      type: object
      required:
        - data
      properties:
        data:
          anyOf:
            - $ref: "#/components/schemas/TradingSettings"
            - type: "null"
    JournalListResponse:
      type: object
      required:
        - entries
      properties:
        entries:
          type: array
          items:
            $ref: "#/components/schemas/JournalEntry"
    OkResponse:
      type: object
      required:
        - ok
      properties:
        ok:
          type: boolean
    ImportRequest:
      type: object
      required:
        - entries
      properties:
        entries:
          type: array
          items:
            $ref: "#/components/schemas/JournalEntry"
        settings:
          anyOf:
            - $ref: "#/components/schemas/TradingSettings"
            - type: "null"
    ImportResult:
      type: object
      required:
        - count
        - settingsImported
      properties:
        count:
          type: number
        settingsImported:
          type: boolean
    MeResponse:
      type: object
      required:
        - userId
        - email
        - plan
        - unlimited
        - subscriptionStatus
        - monthlyCredits
        - packCredits
        - totalCredits
        - canUse
        - creditCost
        - unlimitedUntil
      properties:
        userId:
          type: string
        email:
          type: string
          nullable: true
        plan:
          type: string
          enum: [none, basic, pro, gold, lifetime]
        unlimited:
          type: boolean
        subscriptionStatus:
          type: string
          nullable: true
        monthlyCredits:
          type: number
        packCredits:
          type: number
        totalCredits:
          type: number
        canUse:
          type: boolean
        creditCost:
          type: number
        unlimitedUntil:
          type: string
          nullable: true
          description: ISO timestamp when time-boxed unlimited (Gold) access expires, or null.
    Plan:
      type: object
      required:
        - priceId
        - productId
        - name
        - amount
        - currency
        - kind
        - unlimited
      properties:
        priceId:
          type: string
        productId:
          type: string
        name:
          type: string
        description:
          type: string
          nullable: true
        amount:
          type: number
        currency:
          type: string
        interval:
          type: string
          nullable: true
        intervalCount:
          type: number
          nullable: true
        kind:
          type: string
          enum: [subscription, credit_pack, lifetime, gold]
        tier:
          type: string
          nullable: true
        credits:
          type: number
          nullable: true
        unlimited:
          type: boolean
    PlansResponse:
      type: object
      required:
        - plans
      properties:
        plans:
          type: array
          items:
            $ref: "#/components/schemas/Plan"
    CheckoutRequest:
      type: object
      required:
        - priceId
      properties:
        priceId:
          type: string
    CheckoutUrlResponse:
      type: object
      required:
        - url
      properties:
        url:
          type: string
    VerifyRequest:
      type: object
      required:
        - sessionId
      properties:
        sessionId:
          type: string
```

### `lib/api-spec/orval.config.ts`

```ts
import { defineConfig, InputTransformerFn } from "orval";
import path from "path";

const root = path.resolve(__dirname, "..", "..");
const apiClientReactSrc = path.resolve(root, "lib", "api-client-react", "src");
const apiZodSrc = path.resolve(root, "lib", "api-zod", "src");

// Our exports make assumptions about the title of the API being "Api" (i.e. generated output is `api.ts`).
const titleTransformer: InputTransformerFn = (config) => {
  config.info ??= {};
  config.info.title = "Api";

  return config;
};

export default defineConfig({
  "api-client-react": {
    input: {
      target: "./openapi.yaml",
      override: {
        transformer: titleTransformer,
      },
    },
    output: {
      workspace: apiClientReactSrc,
      target: "generated",
      client: "react-query",
      mode: "split",
      baseUrl: "/api",
      clean: true,
      prettier: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: path.resolve(apiClientReactSrc, "custom-fetch.ts"),
          name: "customFetch",
        },
      },
    },
  },
  zod: {
    input: {
      target: "./openapi.yaml",
      override: {
        transformer: titleTransformer,
      },
    },
    output: {
      workspace: apiZodSrc,
      client: "zod",
      target: "generated",
      schemas: { path: "generated/types", type: "typescript" },
      mode: "split",
      clean: true,
      prettier: true,
      override: {
        zod: {
          coerce: {
            query: ['boolean', 'number', 'string'],
            param: ['boolean', 'number', 'string'],
            body: ['bigint', 'date'],
            response: ['bigint', 'date'],
          },
        },
        useDates: true,
        useBigInt: true,
      },
    },
  },
});
```

### `lib/api-spec/package.json`

```json
{
  "name": "@workspace/api-spec",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "codegen": "orval --config ./orval.config.ts && pnpm -w run typecheck:libs"
  },
  "devDependencies": {
    "orval": "^8.9.1"
  }
}
```

### `lib/api-zod/package.json`

```json
{
  "name": "@workspace/api-zod",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "zod": "catalog:"
  }
}
```

### `lib/api-zod/src/generated/api.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import * as zod from 'zod';


/**
 * Returns server health status
 * @summary Health check
 */
export const HealthCheckResponse = zod.object({
  "status": zod.string()
})


/**
 * Sends chart image to Claude Vision for trade setup grading
 * @summary Analyze a chart image
 */
export const AnalyzeChartBody = zod.object({
  "imageBase64": zod.string().describe('Base64-encoded chart image'),
  "mediaType": zod.string().describe('MIME type of the image (e.g. image\/png)'),
  "timeframe": zod.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d']),
  "session": zod.enum(['premarket', 'rth', 'afterhours']),
  "news": zod.enum(['no', 'yes', 'just']),
  "accountSize": zod.number().describe('Account size in USD'),
  "context": zod.string().nullish().describe('Optional trader notes'),
  "analysisTime": zod.string().nullish().describe('Time of day (HH:MM, 24h) in ET the trader is evaluating entry'),
  "ticker": zod.string().nullish().describe('Market pair or ticker symbol'),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class — drives session and timezone handling'),
  "autoDetect": zod.boolean().nullish().describe('When true (default), the AI reads the instrument (symbol + asset class) and timeframe directly from the chart and uses the provided ticker\/assetClass\/timeframe only as a fallback hint. When false, the provided ticker\/assetClass\/timeframe are authoritative and must not be overridden from the chart (used after the trader corrects a detection).'),
  "maxRiskPct": zod.number().nullish().describe('Max risk per trade as percent of account'),
  "maxDailyDrawdownPct": zod.number().nullish().describe('Max daily drawdown as percent of account'),
  "minRR": zod.number().nullish().describe('Minimum risk\/reward ratio'),
  "longCriteria": zod.array(zod.string()).optional().describe('User-defined long entry criteria'),
  "shortCriteria": zod.array(zod.string()).optional().describe('User-defined short entry criteria'),
  "riskRules": zod.array(zod.string()).optional().describe('Extra risk rules beyond the numeric ones')
})

export const AnalyzeChartResponse = zod.object({
  "grade": zod.string(),
  "score_total": zod.number(),
  "trend_strength": zod.number(),
  "momentum": zod.number(),
  "volume_confirmation": zod.number(),
  "risk_reward_score": zod.number(),
  "indicator_alignment": zod.number(),
  "bias": zod.string(),
  "trend_direction": zod.string(),
  "indicators_found": zod.array(zod.string()),
  "indicators_missing": zod.array(zod.string()),
  "support_levels": zod.string(),
  "resistance_levels": zod.string(),
  "liquidity_zones": zod.string(),
  "long_entry": zod.string(),
  "short_entry": zod.string(),
  "stop_loss": zod.string(),
  "target_1": zod.string(),
  "target_2": zod.string(),
  "rr_ratio": zod.string(),
  "rr_percent": zod.number(),
  "qualifies": zod.boolean(),
  "qualification_reason": zod.string(),
  "plan_compliance": zod.string(),
  "warnings": zod.array(zod.string()),
  "full_analysis": zod.string(),
  "a_plus_factors": zod.array(zod.string()),
  "timing": zod.object({
  "executionWindow": zod.string().describe('Recommended time window to execute the trade'),
  "flipSignals": zod.array(zod.string()).describe('Signals that would confirm a trend flip'),
  "holdGuidance": zod.string().describe('Estimated hold duration and how to manage the trade'),
  "exitWatchlist": zod.array(zod.string()).describe('What to watch for a possible reversal or exit'),
  "sessionRisk": zod.string().describe('Time-of-day \/ session risk notes (e.g. chop zones, news windows)')
}),
  "recommended_direction": zod.string().optional().describe('The single directional call to execute (Long, Short, or No Trade)'),
  "recommended_entry": zod.string().optional().describe('The single execution entry level\/condition for the recommended direction'),
  "setup_conditions": zod.array(zod.string()).optional().describe('The conditions\/confluences this setup needs to be valid, in plain English'),
  "target_2_warranted": zod.boolean().optional().describe('Whether a second target \/ runner is genuinely warranted for this setup'),
  "target_2_reason": zod.string().optional().describe('Why a second target is or is not warranted'),
  "placed_setup": zod.object({
  "detected": zod.boolean().describe('Whether the trader drew their own trade (entry\/stop\/target markers) on the chart'),
  "direction": zod.string().optional().describe('The direction of the trader\'s drawn trade (Long, Short, or empty)'),
  "entry": zod.string().optional().describe('The drawn entry level read back from the chart'),
  "stop": zod.string().optional().describe('The drawn stop-loss level read back from the chart'),
  "targets": zod.string().optional().describe('The drawn target level(s) read back from the chart'),
  "indicators": zod.array(zod.string()).optional().describe('Indicators detected as part of the trader\'s drawn setup'),
  "grade": zod.string().optional().describe('Grade for the drawn trade (A+ \/ A \/ B \/ C \/ No Trade)'),
  "assessment": zod.string().optional().describe('Short assessment of the trader\'s drawn trade'),
  "improvements": zod.array(zod.string()).optional().describe('2-4 concrete things that would lift the drawn trade toward A+')
}).optional(),
  "detected_ticker": zod.string().optional().describe('Instrument\/symbol read from the chart (or the fallback used; empty if unknown)'),
  "detected_asset_class": zod.string().optional().describe('Asset class read from the chart (futures, stocks, forex, crypto, or unknown)'),
  "detected_timeframe": zod.string().optional().describe('Timeframe read from the chart (e.g. 5m; empty\/unknown if not visible)')
})


/**
 * Sends news text and/or a screenshot to Claude to predict market impact
 * @summary Predict market impact from news
 */
export const AnalyzeNewsBody = zod.object({
  "newsText": zod.string().nullish().describe('Pasted news headlines, economic event details, or notes'),
  "imageBase64": zod.string().nullish().describe('Base64-encoded screenshot of news (optional)'),
  "mediaType": zod.string().nullish().describe('MIME type of the screenshot (e.g. image\/png)'),
  "ticker": zod.string().nullish().describe('Market the user trades'),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class'),
  "accountSize": zod.number().nullish(),
  "maxRiskPct": zod.number().nullish(),
  "minRR": zod.number().nullish(),
  "longCriteria": zod.array(zod.string()).optional().describe('User-defined long entry criteria'),
  "shortCriteria": zod.array(zod.string()).optional().describe('User-defined short entry criteria'),
  "riskRules": zod.array(zod.string()).optional().describe('Extra risk rules')
})

export const AnalyzeNewsResponse = zod.object({
  "direction": zod.string().describe('Predicted market direction (Bullish, Bearish, or Neutral)'),
  "volatility": zod.string().describe('Expected volatility (High, Medium, or Low)'),
  "impact": zod.string().describe('Impact rating on the market (High, Medium, or Low)'),
  "confidence": zod.number().describe('Confidence in the prediction (0-100)'),
  "summary": zod.string().describe('One or two sentence plain-English summary'),
  "key_events": zod.array(zod.string()).describe('Recent or upcoming events identified from the input'),
  "affected_window": zod.string().describe('When the impact is most likely to be felt'),
  "trade_recommendation": zod.string().describe('Plain-English recommendation tied to the trader\'s strategy'),
  "reasoning": zod.string().describe('Beginner-friendly explanation of the prediction'),
  "beginner_tip": zod.string().describe('A simple tip for a newer trader'),
  "warnings": zod.array(zod.string()).describe('Caveats or risks to keep in mind')
})


/**
 * Generates a comprehensive trader review mode analysis
 * @summary Full trader review of a chart
 */
export const ReviewChartBody = zod.object({
  "imageBase64": zod.string().describe('Base64-encoded chart image'),
  "mediaType": zod.string().describe('MIME type of the image'),
  "ticker": zod.string().nullish().describe('Market pair or ticker symbol'),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class'),
  "timeframe": zod.string().nullish().describe('Chart timeframe'),
  "maxRiskPct": zod.number().nullish(),
  "maxDailyDrawdownPct": zod.number().nullish(),
  "minRR": zod.number().nullish(),
  "accountSize": zod.number().nullish(),
  "longCriteria": zod.array(zod.string()).optional(),
  "shortCriteria": zod.array(zod.string()).optional(),
  "riskRules": zod.array(zod.string()).optional()
})

export const ReviewChartResponse = zod.object({
  "trade_grade": zod.string(),
  "confidence_score": zod.number(),
  "trend_alignment": zod.string(),
  "risk_reward_assessment": zod.string(),
  "long_setup_quality": zod.string(),
  "short_setup_quality": zod.string(),
  "support_resistance_quality": zod.string(),
  "volume_analysis": zod.string(),
  "full_review": zod.string(),
  "potential_risks": zod.array(zod.string())
})


/**
 * Sends a post-trade chart and the trade details to Claude for a plain-English debrief
 * @summary Explain why a trade did not hit its target
 */
export const DebriefTradeBody = zod.object({
  "imageBase64": zod.string().nullish().describe('Base64-encoded chart screenshot showing how the trade played out (optional)'),
  "mediaType": zod.string().nullish().describe('MIME type of the screenshot (e.g. image\/png)'),
  "direction": zod.enum(['long', 'short']).describe('The direction of the trade that was taken'),
  "outcome": zod.enum(['stopped_out', 'missed_target', 'reversed', 'breakeven', 'other']).describe('What happened to the trade'),
  "entry": zod.string().nullish().describe('Entry price or level the trader used'),
  "stop": zod.string().nullish().describe('Stop-loss price or level'),
  "target": zod.string().nullish().describe('Target \/ take-profit price or level the trade was aiming for'),
  "notes": zod.string().nullish().describe('Trader\'s own notes about what happened'),
  "ticker": zod.string().nullish(),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional(),
  "timeframe": zod.string().nullish(),
  "longCriteria": zod.array(zod.string()).optional().describe('User-defined long entry criteria'),
  "shortCriteria": zod.array(zod.string()).optional().describe('User-defined short entry criteria'),
  "riskRules": zod.array(zod.string()).optional().describe('Extra risk rules')
})

export const DebriefTradeResponse = zod.object({
  "verdict": zod.string().describe('One-line headline of why the trade did not hit its target'),
  "summary": zod.string().describe('Two to three sentence plain-English explanation'),
  "primary_reason": zod.string().describe('The single biggest reason the trade missed'),
  "contributing_factors": zod.array(zod.string()).describe('Other factors that contributed to the trade missing'),
  "chart_read": zod.string().describe('Plain-English read of what the chart shows happened after entry'),
  "lessons": zod.array(zod.string()).describe('Specific, actionable lessons from this trade'),
  "next_time": zod.array(zod.string()).describe('Concrete things to do differently next time'),
  "encouragement": zod.string().describe('One supportive, beginner-friendly sentence'),
  "warnings": zod.array(zod.string()).describe('Caveats or risks to keep in mind')
})


/**
 * @summary Current user account, plan and credit balance
 */
export const GetMeResponse = zod.object({
  "userId": zod.string(),
  "email": zod.string().nullable(),
  "plan": zod.enum(['none', 'basic', 'pro', 'gold', 'lifetime']),
  "unlimited": zod.boolean(),
  "subscriptionStatus": zod.string().nullable(),
  "monthlyCredits": zod.number(),
  "packCredits": zod.number(),
  "totalCredits": zod.number(),
  "canUse": zod.boolean(),
  "creditCost": zod.number(),
  "unlimitedUntil": zod.string().nullable().describe('ISO timestamp when time-boxed unlimited (Gold) access expires, or null.')
})


/**
 * @summary Get the user's trading plan settings
 */
export const GetSettingsResponse = zod.object({
  "data": zod.union([zod.object({
  "ticker": zod.string(),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class'),
  "pointValue": zod.number().optional().describe('Account-currency P&L per 1.0 price move per 1 unit'),
  "tickSize": zod.number().optional().describe('Minimum price increment for the instrument'),
  "quantityLabel": zod.string().optional().describe('Unit label for position size (e.g. contracts, shares, lots, units)'),
  "currency": zod.string().optional().describe('Account\/quote currency code (e.g. USD)'),
  "defaultTimeframe": zod.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d']),
  "lastSession": zod.enum(['premarket', 'rth', 'afterhours']),
  "lastNews": zod.enum(['no', 'yes', 'just']),
  "maxRiskPct": zod.number(),
  "maxDailyDrawdownPct": zod.number(),
  "minRR": zod.number(),
  "accountSize": zod.number(),
  "longCriteria": zod.array(zod.string()),
  "shortCriteria": zod.array(zod.string()),
  "riskRules": zod.array(zod.string())
}),zod.null()])
})


/**
 * @summary Replace the user's trading plan settings
 */
export const UpdateSettingsBody = zod.object({
  "ticker": zod.string(),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class'),
  "pointValue": zod.number().optional().describe('Account-currency P&L per 1.0 price move per 1 unit'),
  "tickSize": zod.number().optional().describe('Minimum price increment for the instrument'),
  "quantityLabel": zod.string().optional().describe('Unit label for position size (e.g. contracts, shares, lots, units)'),
  "currency": zod.string().optional().describe('Account\/quote currency code (e.g. USD)'),
  "defaultTimeframe": zod.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d']),
  "lastSession": zod.enum(['premarket', 'rth', 'afterhours']),
  "lastNews": zod.enum(['no', 'yes', 'just']),
  "maxRiskPct": zod.number(),
  "maxDailyDrawdownPct": zod.number(),
  "minRR": zod.number(),
  "accountSize": zod.number(),
  "longCriteria": zod.array(zod.string()),
  "shortCriteria": zod.array(zod.string()),
  "riskRules": zod.array(zod.string())
})

export const UpdateSettingsResponse = zod.object({
  "data": zod.union([zod.object({
  "ticker": zod.string(),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class'),
  "pointValue": zod.number().optional().describe('Account-currency P&L per 1.0 price move per 1 unit'),
  "tickSize": zod.number().optional().describe('Minimum price increment for the instrument'),
  "quantityLabel": zod.string().optional().describe('Unit label for position size (e.g. contracts, shares, lots, units)'),
  "currency": zod.string().optional().describe('Account\/quote currency code (e.g. USD)'),
  "defaultTimeframe": zod.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d']),
  "lastSession": zod.enum(['premarket', 'rth', 'afterhours']),
  "lastNews": zod.enum(['no', 'yes', 'just']),
  "maxRiskPct": zod.number(),
  "maxDailyDrawdownPct": zod.number(),
  "minRR": zod.number(),
  "accountSize": zod.number(),
  "longCriteria": zod.array(zod.string()),
  "shortCriteria": zod.array(zod.string()),
  "riskRules": zod.array(zod.string())
}),zod.null()])
})


/**
 * @summary List the user's journal entries (newest first)
 */
export const GetJournalResponse = zod.object({
  "entries": zod.array(zod.object({
  "id": zod.string(),
  "timestamp": zod.number(),
  "ticker": zod.string(),
  "timeframe": zod.string(),
  "session": zod.string(),
  "grade": zod.string(),
  "score_total": zod.number(),
  "bias": zod.string(),
  "qualifies": zod.boolean(),
  "rr_ratio": zod.string(),
  "full_analysis": zod.string(),
  "analysisTime": zod.string().optional(),
  "timing": zod.object({
  "executionWindow": zod.string().describe('Recommended time window to execute the trade'),
  "flipSignals": zod.array(zod.string()).describe('Signals that would confirm a trend flip'),
  "holdGuidance": zod.string().describe('Estimated hold duration and how to manage the trade'),
  "exitWatchlist": zod.array(zod.string()).describe('What to watch for a possible reversal or exit'),
  "sessionRisk": zod.string().describe('Time-of-day \/ session risk notes (e.g. chop zones, news windows)')
}).optional()
}))
})


/**
 * @summary Add a journal entry
 */
export const AddJournalEntryBody = zod.object({
  "id": zod.string(),
  "timestamp": zod.number(),
  "ticker": zod.string(),
  "timeframe": zod.string(),
  "session": zod.string(),
  "grade": zod.string(),
  "score_total": zod.number(),
  "bias": zod.string(),
  "qualifies": zod.boolean(),
  "rr_ratio": zod.string(),
  "full_analysis": zod.string(),
  "analysisTime": zod.string().optional(),
  "timing": zod.object({
  "executionWindow": zod.string().describe('Recommended time window to execute the trade'),
  "flipSignals": zod.array(zod.string()).describe('Signals that would confirm a trend flip'),
  "holdGuidance": zod.string().describe('Estimated hold duration and how to manage the trade'),
  "exitWatchlist": zod.array(zod.string()).describe('What to watch for a possible reversal or exit'),
  "sessionRisk": zod.string().describe('Time-of-day \/ session risk notes (e.g. chop zones, news windows)')
}).optional()
})

export const AddJournalEntryResponse = zod.object({
  "id": zod.string(),
  "timestamp": zod.number(),
  "ticker": zod.string(),
  "timeframe": zod.string(),
  "session": zod.string(),
  "grade": zod.string(),
  "score_total": zod.number(),
  "bias": zod.string(),
  "qualifies": zod.boolean(),
  "rr_ratio": zod.string(),
  "full_analysis": zod.string(),
  "analysisTime": zod.string().optional(),
  "timing": zod.object({
  "executionWindow": zod.string().describe('Recommended time window to execute the trade'),
  "flipSignals": zod.array(zod.string()).describe('Signals that would confirm a trend flip'),
  "holdGuidance": zod.string().describe('Estimated hold duration and how to manage the trade'),
  "exitWatchlist": zod.array(zod.string()).describe('What to watch for a possible reversal or exit'),
  "sessionRisk": zod.string().describe('Time-of-day \/ session risk notes (e.g. chop zones, news windows)')
}).optional()
})


/**
 * @summary Delete all of the user's journal entries
 */
export const ClearJournalResponse = zod.object({
  "ok": zod.boolean()
})


/**
 * @summary Bulk import journal entries and optionally settings (first-login migration)
 */
export const ImportDataBody = zod.object({
  "entries": zod.array(zod.object({
  "id": zod.string(),
  "timestamp": zod.number(),
  "ticker": zod.string(),
  "timeframe": zod.string(),
  "session": zod.string(),
  "grade": zod.string(),
  "score_total": zod.number(),
  "bias": zod.string(),
  "qualifies": zod.boolean(),
  "rr_ratio": zod.string(),
  "full_analysis": zod.string(),
  "analysisTime": zod.string().optional(),
  "timing": zod.object({
  "executionWindow": zod.string().describe('Recommended time window to execute the trade'),
  "flipSignals": zod.array(zod.string()).describe('Signals that would confirm a trend flip'),
  "holdGuidance": zod.string().describe('Estimated hold duration and how to manage the trade'),
  "exitWatchlist": zod.array(zod.string()).describe('What to watch for a possible reversal or exit'),
  "sessionRisk": zod.string().describe('Time-of-day \/ session risk notes (e.g. chop zones, news windows)')
}).optional()
})),
  "settings": zod.union([zod.object({
  "ticker": zod.string(),
  "assetClass": zod.enum(['futures', 'stocks', 'forex', 'crypto']).optional().describe('Instrument asset class'),
  "pointValue": zod.number().optional().describe('Account-currency P&L per 1.0 price move per 1 unit'),
  "tickSize": zod.number().optional().describe('Minimum price increment for the instrument'),
  "quantityLabel": zod.string().optional().describe('Unit label for position size (e.g. contracts, shares, lots, units)'),
  "currency": zod.string().optional().describe('Account\/quote currency code (e.g. USD)'),
  "defaultTimeframe": zod.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d']),
  "lastSession": zod.enum(['premarket', 'rth', 'afterhours']),
  "lastNews": zod.enum(['no', 'yes', 'just']),
  "maxRiskPct": zod.number(),
  "maxDailyDrawdownPct": zod.number(),
  "minRR": zod.number(),
  "accountSize": zod.number(),
  "longCriteria": zod.array(zod.string()),
  "shortCriteria": zod.array(zod.string()),
  "riskRules": zod.array(zod.string())
}),zod.null()]).optional()
})

export const ImportDataResponse = zod.object({
  "count": zod.number(),
  "settingsImported": zod.boolean()
})


/**
 * @summary List purchasable plans and credit packs
 */
export const GetPlansResponse = zod.object({
  "plans": zod.array(zod.object({
  "priceId": zod.string(),
  "productId": zod.string(),
  "name": zod.string(),
  "description": zod.string().nullish(),
  "amount": zod.number(),
  "currency": zod.string(),
  "interval": zod.string().nullish(),
  "intervalCount": zod.number().nullish(),
  "kind": zod.enum(['subscription', 'credit_pack', 'lifetime', 'gold']),
  "tier": zod.string().nullish(),
  "credits": zod.number().nullish(),
  "unlimited": zod.boolean()
}))
})


/**
 * @summary Create a Stripe Checkout session for a plan or credit pack
 */
export const CreateCheckoutBody = zod.object({
  "priceId": zod.string()
})

export const CreateCheckoutResponse = zod.object({
  "url": zod.string()
})


/**
 * @summary Create a Stripe billing portal session
 */
export const CreatePortalResponse = zod.object({
  "url": zod.string()
})


/**
 * @summary Finalize a completed checkout and return refreshed account info
 */
export const VerifyCheckoutBody = zod.object({
  "sessionId": zod.string()
})

export const VerifyCheckoutResponse = zod.object({
  "userId": zod.string(),
  "email": zod.string().nullable(),
  "plan": zod.enum(['none', 'basic', 'pro', 'gold', 'lifetime']),
  "unlimited": zod.boolean(),
  "subscriptionStatus": zod.string().nullable(),
  "monthlyCredits": zod.number(),
  "packCredits": zod.number(),
  "totalCredits": zod.number(),
  "canUse": zod.boolean(),
  "creditCost": zod.number(),
  "unlimitedUntil": zod.string().nullable().describe('ISO timestamp when time-boxed unlimited (Gold) access expires, or null.')
})


```

### `lib/api-zod/src/generated/types/chartAnalysisInput.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { ChartAnalysisInputAssetClass } from './chartAnalysisInputAssetClass';
import type { ChartAnalysisInputNews } from './chartAnalysisInputNews';
import type { ChartAnalysisInputSession } from './chartAnalysisInputSession';
import type { ChartAnalysisInputTimeframe } from './chartAnalysisInputTimeframe';

export interface ChartAnalysisInput {
  /** Base64-encoded chart image */
  imageBase64: string;
  /** MIME type of the image (e.g. image/png) */
  mediaType: string;
  timeframe: ChartAnalysisInputTimeframe;
  session: ChartAnalysisInputSession;
  news: ChartAnalysisInputNews;
  /** Account size in USD */
  accountSize: number;
  /**
     * Optional trader notes
     * @nullable
     */
  context?: string | null;
  /**
     * Time of day (HH:MM, 24h) in ET the trader is evaluating entry
     * @nullable
     */
  analysisTime?: string | null;
  /**
     * Market pair or ticker symbol
     * @nullable
     */
  ticker?: string | null;
  /** Instrument asset class — drives session and timezone handling */
  assetClass?: ChartAnalysisInputAssetClass;
  /**
     * When true (default), the AI reads the instrument (symbol + asset class) and timeframe directly from the chart and uses the provided ticker/assetClass/timeframe only as a fallback hint. When false, the provided ticker/assetClass/timeframe are authoritative and must not be overridden from the chart (used after the trader corrects a detection).
     * @nullable
     */
  autoDetect?: boolean | null;
  /**
     * Max risk per trade as percent of account
     * @nullable
     */
  maxRiskPct?: number | null;
  /**
     * Max daily drawdown as percent of account
     * @nullable
     */
  maxDailyDrawdownPct?: number | null;
  /**
     * Minimum risk/reward ratio
     * @nullable
     */
  minRR?: number | null;
  /** User-defined long entry criteria */
  longCriteria?: string[];
  /** User-defined short entry criteria */
  shortCriteria?: string[];
  /** Extra risk rules beyond the numeric ones */
  riskRules?: string[];
}
```

### `lib/api-zod/src/generated/types/chartAnalysisInputAssetClass.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

/**
 * Instrument asset class — drives session and timezone handling
 */
export type ChartAnalysisInputAssetClass = typeof ChartAnalysisInputAssetClass[keyof typeof ChartAnalysisInputAssetClass];


export const ChartAnalysisInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;
```

### `lib/api-zod/src/generated/types/chartAnalysisInputNews.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type ChartAnalysisInputNews = typeof ChartAnalysisInputNews[keyof typeof ChartAnalysisInputNews];


export const ChartAnalysisInputNews = {
  no: 'no',
  yes: 'yes',
  just: 'just',
} as const;
```

### `lib/api-zod/src/generated/types/chartAnalysisInputSession.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type ChartAnalysisInputSession = typeof ChartAnalysisInputSession[keyof typeof ChartAnalysisInputSession];


export const ChartAnalysisInputSession = {
  premarket: 'premarket',
  rth: 'rth',
  afterhours: 'afterhours',
} as const;
```

### `lib/api-zod/src/generated/types/chartAnalysisInputTimeframe.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type ChartAnalysisInputTimeframe = typeof ChartAnalysisInputTimeframe[keyof typeof ChartAnalysisInputTimeframe];


export const ChartAnalysisInputTimeframe = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
} as const;
```

### `lib/api-zod/src/generated/types/chartAnalysisResult.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { PlacedSetupEvaluation } from './placedSetupEvaluation';
import type { TimingAnalysis } from './timingAnalysis';

export interface ChartAnalysisResult {
  grade: string;
  score_total: number;
  trend_strength: number;
  momentum: number;
  volume_confirmation: number;
  risk_reward_score: number;
  indicator_alignment: number;
  bias: string;
  trend_direction: string;
  indicators_found: string[];
  indicators_missing: string[];
  support_levels: string;
  resistance_levels: string;
  liquidity_zones: string;
  long_entry: string;
  short_entry: string;
  stop_loss: string;
  target_1: string;
  target_2: string;
  rr_ratio: string;
  rr_percent: number;
  qualifies: boolean;
  qualification_reason: string;
  plan_compliance: string;
  warnings: string[];
  full_analysis: string;
  a_plus_factors: string[];
  timing: TimingAnalysis;
  /** The single directional call to execute (Long, Short, or No Trade) */
  recommended_direction?: string;
  /** The single execution entry level/condition for the recommended direction */
  recommended_entry?: string;
  /** The conditions/confluences this setup needs to be valid, in plain English */
  setup_conditions?: string[];
  /** Whether a second target / runner is genuinely warranted for this setup */
  target_2_warranted?: boolean;
  /** Why a second target is or is not warranted */
  target_2_reason?: string;
  placed_setup?: PlacedSetupEvaluation;
  /** Instrument/symbol read from the chart (or the fallback used; empty if unknown) */
  detected_ticker?: string;
  /** Asset class read from the chart (futures, stocks, forex, crypto, or unknown) */
  detected_asset_class?: string;
  /** Timeframe read from the chart (e.g. 5m; empty/unknown if not visible) */
  detected_timeframe?: string;
}
```

### `lib/api-zod/src/generated/types/chartReviewInput.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { ChartReviewInputAssetClass } from './chartReviewInputAssetClass';

export interface ChartReviewInput {
  /** Base64-encoded chart image */
  imageBase64: string;
  /** MIME type of the image */
  mediaType: string;
  /**
     * Market pair or ticker symbol
     * @nullable
     */
  ticker?: string | null;
  /** Instrument asset class */
  assetClass?: ChartReviewInputAssetClass;
  /**
     * Chart timeframe
     * @nullable
     */
  timeframe?: string | null;
  /** @nullable */
  maxRiskPct?: number | null;
  /** @nullable */
  maxDailyDrawdownPct?: number | null;
  /** @nullable */
  minRR?: number | null;
  /** @nullable */
  accountSize?: number | null;
  longCriteria?: string[];
  shortCriteria?: string[];
  riskRules?: string[];
}
```

### `lib/api-zod/src/generated/types/chartReviewInputAssetClass.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

/**
 * Instrument asset class
 */
export type ChartReviewInputAssetClass = typeof ChartReviewInputAssetClass[keyof typeof ChartReviewInputAssetClass];


export const ChartReviewInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;
```

### `lib/api-zod/src/generated/types/chartReviewResult.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface ChartReviewResult {
  trade_grade: string;
  confidence_score: number;
  trend_alignment: string;
  risk_reward_assessment: string;
  long_setup_quality: string;
  short_setup_quality: string;
  support_resistance_quality: string;
  volume_analysis: string;
  full_review: string;
  potential_risks: string[];
}
```

### `lib/api-zod/src/generated/types/checkoutRequest.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface CheckoutRequest {
  priceId: string;
}
```

### `lib/api-zod/src/generated/types/checkoutUrlResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface CheckoutUrlResponse {
  url: string;
}
```

### `lib/api-zod/src/generated/types/errorResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface ErrorResponse {
  error: string;
}
```

### `lib/api-zod/src/generated/types/healthStatus.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface HealthStatus {
  status: string;
}
```

### `lib/api-zod/src/generated/types/importRequest.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { JournalEntry } from './journalEntry';
import type { TradingSettings } from './tradingSettings';

export interface ImportRequest {
  entries: JournalEntry[];
  settings?: TradingSettings | null;
}
```

### `lib/api-zod/src/generated/types/importResult.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface ImportResult {
  count: number;
  settingsImported: boolean;
}
```

### `lib/api-zod/src/generated/types/index.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export * from './chartAnalysisInput';
export * from './chartAnalysisInputAssetClass';
export * from './chartAnalysisInputNews';
export * from './chartAnalysisInputSession';
export * from './chartAnalysisInputTimeframe';
export * from './chartAnalysisResult';
export * from './chartReviewInput';
export * from './chartReviewInputAssetClass';
export * from './chartReviewResult';
export * from './checkoutRequest';
export * from './checkoutUrlResponse';
export * from './errorResponse';
export * from './healthStatus';
export * from './importRequest';
export * from './importResult';
export * from './journalEntry';
export * from './journalListResponse';
export * from './meResponse';
export * from './meResponsePlan';
export * from './newsAnalysisInput';
export * from './newsAnalysisInputAssetClass';
export * from './newsAnalysisResult';
export * from './okResponse';
export * from './placedSetupEvaluation';
export * from './plan';
export * from './planKind';
export * from './plansResponse';
export * from './settingsResponse';
export * from './timingAnalysis';
export * from './tradeDebriefInput';
export * from './tradeDebriefInputAssetClass';
export * from './tradeDebriefInputDirection';
export * from './tradeDebriefInputOutcome';
export * from './tradeDebriefResult';
export * from './tradingSettings';
export * from './tradingSettingsAssetClass';
export * from './tradingSettingsDefaultTimeframe';
export * from './tradingSettingsLastNews';
export * from './tradingSettingsLastSession';
export * from './verifyRequest';
```

### `lib/api-zod/src/generated/types/journalEntry.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { TimingAnalysis } from './timingAnalysis';

export interface JournalEntry {
  id: string;
  timestamp: number;
  ticker: string;
  timeframe: string;
  session: string;
  grade: string;
  score_total: number;
  bias: string;
  qualifies: boolean;
  rr_ratio: string;
  full_analysis: string;
  analysisTime?: string;
  timing?: TimingAnalysis;
}
```

### `lib/api-zod/src/generated/types/journalListResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { JournalEntry } from './journalEntry';

export interface JournalListResponse {
  entries: JournalEntry[];
}
```

### `lib/api-zod/src/generated/types/meResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { MeResponsePlan } from './meResponsePlan';

export interface MeResponse {
  userId: string;
  email: string | null;
  plan: MeResponsePlan;
  unlimited: boolean;
  subscriptionStatus: string | null;
  monthlyCredits: number;
  packCredits: number;
  totalCredits: number;
  canUse: boolean;
  creditCost: number;
  /** ISO timestamp when time-boxed unlimited (Gold) access expires, or null. */
  unlimitedUntil: string | null;
}
```

### `lib/api-zod/src/generated/types/meResponsePlan.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type MeResponsePlan = typeof MeResponsePlan[keyof typeof MeResponsePlan];


export const MeResponsePlan = {
  none: 'none',
  basic: 'basic',
  pro: 'pro',
  gold: 'gold',
  lifetime: 'lifetime',
} as const;
```

### `lib/api-zod/src/generated/types/newsAnalysisInput.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { NewsAnalysisInputAssetClass } from './newsAnalysisInputAssetClass';

export interface NewsAnalysisInput {
  /**
     * Pasted news headlines, economic event details, or notes
     * @nullable
     */
  newsText?: string | null;
  /**
     * Base64-encoded screenshot of news (optional)
     * @nullable
     */
  imageBase64?: string | null;
  /**
     * MIME type of the screenshot (e.g. image/png)
     * @nullable
     */
  mediaType?: string | null;
  /**
     * Market the user trades
     * @nullable
     */
  ticker?: string | null;
  /** Instrument asset class */
  assetClass?: NewsAnalysisInputAssetClass;
  /** @nullable */
  accountSize?: number | null;
  /** @nullable */
  maxRiskPct?: number | null;
  /** @nullable */
  minRR?: number | null;
  /** User-defined long entry criteria */
  longCriteria?: string[];
  /** User-defined short entry criteria */
  shortCriteria?: string[];
  /** Extra risk rules */
  riskRules?: string[];
}
```

### `lib/api-zod/src/generated/types/newsAnalysisInputAssetClass.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

/**
 * Instrument asset class
 */
export type NewsAnalysisInputAssetClass = typeof NewsAnalysisInputAssetClass[keyof typeof NewsAnalysisInputAssetClass];


export const NewsAnalysisInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;
```

### `lib/api-zod/src/generated/types/newsAnalysisResult.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface NewsAnalysisResult {
  /** Predicted market direction (Bullish, Bearish, or Neutral) */
  direction: string;
  /** Expected volatility (High, Medium, or Low) */
  volatility: string;
  /** Impact rating on the market (High, Medium, or Low) */
  impact: string;
  /** Confidence in the prediction (0-100) */
  confidence: number;
  /** One or two sentence plain-English summary */
  summary: string;
  /** Recent or upcoming events identified from the input */
  key_events: string[];
  /** When the impact is most likely to be felt */
  affected_window: string;
  /** Plain-English recommendation tied to the trader's strategy */
  trade_recommendation: string;
  /** Beginner-friendly explanation of the prediction */
  reasoning: string;
  /** A simple tip for a newer trader */
  beginner_tip: string;
  /** Caveats or risks to keep in mind */
  warnings: string[];
}
```

### `lib/api-zod/src/generated/types/okResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface OkResponse {
  ok: boolean;
}
```

### `lib/api-zod/src/generated/types/placedSetupEvaluation.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface PlacedSetupEvaluation {
  /** Whether the trader drew their own trade (entry/stop/target markers) on the chart */
  detected: boolean;
  /** The direction of the trader's drawn trade (Long, Short, or empty) */
  direction?: string;
  /** The drawn entry level read back from the chart */
  entry?: string;
  /** The drawn stop-loss level read back from the chart */
  stop?: string;
  /** The drawn target level(s) read back from the chart */
  targets?: string;
  /** Indicators detected as part of the trader's drawn setup */
  indicators?: string[];
  /** Grade for the drawn trade (A+ / A / B / C / No Trade) */
  grade?: string;
  /** Short assessment of the trader's drawn trade */
  assessment?: string;
  /** 2-4 concrete things that would lift the drawn trade toward A+ */
  improvements?: string[];
}
```

### `lib/api-zod/src/generated/types/plan.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { PlanKind } from './planKind';

export interface Plan {
  priceId: string;
  productId: string;
  name: string;
  description?: string | null;
  amount: number;
  currency: string;
  interval?: string | null;
  intervalCount?: number | null;
  kind: PlanKind;
  tier?: string | null;
  credits?: number | null;
  unlimited: boolean;
}
```

### `lib/api-zod/src/generated/types/planKind.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type PlanKind = typeof PlanKind[keyof typeof PlanKind];


export const PlanKind = {
  subscription: 'subscription',
  credit_pack: 'credit_pack',
  lifetime: 'lifetime',
  gold: 'gold',
} as const;
```

### `lib/api-zod/src/generated/types/plansResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { Plan } from './plan';

export interface PlansResponse {
  plans: Plan[];
}
```

### `lib/api-zod/src/generated/types/settingsResponse.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { TradingSettings } from './tradingSettings';

export interface SettingsResponse {
  data: TradingSettings | null;
}
```

### `lib/api-zod/src/generated/types/timingAnalysis.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface TimingAnalysis {
  /** Recommended time window to execute the trade */
  executionWindow: string;
  /** Signals that would confirm a trend flip */
  flipSignals: string[];
  /** Estimated hold duration and how to manage the trade */
  holdGuidance: string;
  /** What to watch for a possible reversal or exit */
  exitWatchlist: string[];
  /** Time-of-day / session risk notes (e.g. chop zones, news windows) */
  sessionRisk: string;
}
```

### `lib/api-zod/src/generated/types/tradeDebriefInput.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { TradeDebriefInputAssetClass } from './tradeDebriefInputAssetClass';
import type { TradeDebriefInputDirection } from './tradeDebriefInputDirection';
import type { TradeDebriefInputOutcome } from './tradeDebriefInputOutcome';

export interface TradeDebriefInput {
  /**
     * Base64-encoded chart screenshot showing how the trade played out (optional)
     * @nullable
     */
  imageBase64?: string | null;
  /**
     * MIME type of the screenshot (e.g. image/png)
     * @nullable
     */
  mediaType?: string | null;
  /** The direction of the trade that was taken */
  direction: TradeDebriefInputDirection;
  /** What happened to the trade */
  outcome: TradeDebriefInputOutcome;
  /**
     * Entry price or level the trader used
     * @nullable
     */
  entry?: string | null;
  /**
     * Stop-loss price or level
     * @nullable
     */
  stop?: string | null;
  /**
     * Target / take-profit price or level the trade was aiming for
     * @nullable
     */
  target?: string | null;
  /**
     * Trader's own notes about what happened
     * @nullable
     */
  notes?: string | null;
  /** @nullable */
  ticker?: string | null;
  assetClass?: TradeDebriefInputAssetClass;
  /** @nullable */
  timeframe?: string | null;
  /** User-defined long entry criteria */
  longCriteria?: string[];
  /** User-defined short entry criteria */
  shortCriteria?: string[];
  /** Extra risk rules */
  riskRules?: string[];
}
```

### `lib/api-zod/src/generated/types/tradeDebriefInputAssetClass.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type TradeDebriefInputAssetClass = typeof TradeDebriefInputAssetClass[keyof typeof TradeDebriefInputAssetClass];


export const TradeDebriefInputAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;
```

### `lib/api-zod/src/generated/types/tradeDebriefInputDirection.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

/**
 * The direction of the trade that was taken
 */
export type TradeDebriefInputDirection = typeof TradeDebriefInputDirection[keyof typeof TradeDebriefInputDirection];


export const TradeDebriefInputDirection = {
  long: 'long',
  short: 'short',
} as const;
```

### `lib/api-zod/src/generated/types/tradeDebriefInputOutcome.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

/**
 * What happened to the trade
 */
export type TradeDebriefInputOutcome = typeof TradeDebriefInputOutcome[keyof typeof TradeDebriefInputOutcome];


export const TradeDebriefInputOutcome = {
  stopped_out: 'stopped_out',
  missed_target: 'missed_target',
  reversed: 'reversed',
  breakeven: 'breakeven',
  other: 'other',
} as const;
```

### `lib/api-zod/src/generated/types/tradeDebriefResult.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface TradeDebriefResult {
  /** One-line headline of why the trade did not hit its target */
  verdict: string;
  /** Two to three sentence plain-English explanation */
  summary: string;
  /** The single biggest reason the trade missed */
  primary_reason: string;
  /** Other factors that contributed to the trade missing */
  contributing_factors: string[];
  /** Plain-English read of what the chart shows happened after entry */
  chart_read: string;
  /** Specific, actionable lessons from this trade */
  lessons: string[];
  /** Concrete things to do differently next time */
  next_time: string[];
  /** One supportive, beginner-friendly sentence */
  encouragement: string;
  /** Caveats or risks to keep in mind */
  warnings: string[];
}
```

### `lib/api-zod/src/generated/types/tradingSettings.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */
import type { TradingSettingsAssetClass } from './tradingSettingsAssetClass';
import type { TradingSettingsDefaultTimeframe } from './tradingSettingsDefaultTimeframe';
import type { TradingSettingsLastNews } from './tradingSettingsLastNews';
import type { TradingSettingsLastSession } from './tradingSettingsLastSession';

export interface TradingSettings {
  ticker: string;
  /** Instrument asset class */
  assetClass?: TradingSettingsAssetClass;
  /** Account-currency P&L per 1.0 price move per 1 unit */
  pointValue?: number;
  /** Minimum price increment for the instrument */
  tickSize?: number;
  /** Unit label for position size (e.g. contracts, shares, lots, units) */
  quantityLabel?: string;
  /** Account/quote currency code (e.g. USD) */
  currency?: string;
  defaultTimeframe: TradingSettingsDefaultTimeframe;
  lastSession: TradingSettingsLastSession;
  lastNews: TradingSettingsLastNews;
  maxRiskPct: number;
  maxDailyDrawdownPct: number;
  minRR: number;
  accountSize: number;
  longCriteria: string[];
  shortCriteria: string[];
  riskRules: string[];
}
```

### `lib/api-zod/src/generated/types/tradingSettingsAssetClass.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

/**
 * Instrument asset class
 */
export type TradingSettingsAssetClass = typeof TradingSettingsAssetClass[keyof typeof TradingSettingsAssetClass];


export const TradingSettingsAssetClass = {
  futures: 'futures',
  stocks: 'stocks',
  forex: 'forex',
  crypto: 'crypto',
} as const;
```

### `lib/api-zod/src/generated/types/tradingSettingsDefaultTimeframe.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type TradingSettingsDefaultTimeframe = typeof TradingSettingsDefaultTimeframe[keyof typeof TradingSettingsDefaultTimeframe];


export const TradingSettingsDefaultTimeframe = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
} as const;
```

### `lib/api-zod/src/generated/types/tradingSettingsLastNews.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type TradingSettingsLastNews = typeof TradingSettingsLastNews[keyof typeof TradingSettingsLastNews];


export const TradingSettingsLastNews = {
  no: 'no',
  yes: 'yes',
  just: 'just',
} as const;
```

### `lib/api-zod/src/generated/types/tradingSettingsLastSession.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export type TradingSettingsLastSession = typeof TradingSettingsLastSession[keyof typeof TradingSettingsLastSession];


export const TradingSettingsLastSession = {
  premarket: 'premarket',
  rth: 'rth',
  afterhours: 'afterhours',
} as const;
```

### `lib/api-zod/src/generated/types/verifyRequest.ts` *(generated — produced by codegen from `lib/api-spec/openapi.yaml`; do not edit by hand)*

```ts
/**
 * Generated by orval v8.9.1 🍺
 * Do not edit manually.
 * Api
 * AI Trading Copilot API — multi-asset chart, news, and trade analysis
 * OpenAPI spec version: 0.1.0
 */

export interface VerifyRequest {
  sessionId: string;
}
```

### `lib/api-zod/src/index.ts`

```ts
export * from "./generated/api";
export * from "./generated/types";
```

### `lib/api-zod/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### `lib/db/drizzle.config.ts`

```ts
import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

### `lib/db/package.json`

```json
{
  "name": "@workspace/db",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "push": "drizzle-kit push --config ./drizzle.config.ts",
    "push-force": "drizzle-kit push --force --config ./drizzle.config.ts"
  },
  "dependencies": {
    "drizzle-orm": "catalog:",
    "drizzle-zod": "^0.8.3",
    "pg": "^8.20.0",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "@types/pg": "^8.20.0",
    "drizzle-kit": "^0.31.10"
  }
}
```

### `lib/db/src/index.ts`

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema";
```

### `lib/db/src/schema/creditPackPurchases.ts`

```ts
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

// Records processed one-time credit-pack checkout sessions so the same purchase
// is never granted twice (idempotency keyed by the Stripe checkout session id).
export const creditPackPurchasesTable = pgTable("credit_pack_purchases", {
  sessionId: text("session_id").primaryKey(),
  userId: text("user_id").notNull(),
  credits: integer("credits").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CreditPackPurchaseRow = typeof creditPackPurchasesTable.$inferSelect;
```

### `lib/db/src/schema/index.ts`

```ts
// Export your models here. Add one export per file.
export * from "./users";
export * from "./userSettings";
export * from "./journalEntries";
export * from "./creditPackPurchases";
```

### `lib/db/src/schema/journalEntries.ts`

```ts
import { pgTable, text, jsonb, bigint, timestamp, index } from "drizzle-orm/pg-core";

// Per-user journal entries. The full JournalEntry object is stored as a JSON
// blob; `timestamp` is duplicated as a sortable column for ordering.
export const journalEntriesTable = pgTable(
  "journal_entries",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("journal_entries_user_idx").on(t.userId, t.timestamp)],
);

export type JournalEntryRow = typeof journalEntriesTable.$inferSelect;
```

### `lib/db/src/schema/userSettings.ts`

```ts
import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// Per-user trading plan / settings. Stored as a JSON blob mirroring the
// frontend TradingSettings shape so the plan syncs across devices.
export const userSettingsTable = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type UserSettingsRow = typeof userSettingsTable.$inferSelect;
```

### `lib/db/src/schema/users.ts`

```ts
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Application user, keyed by the Clerk user id. Plan + subscription status are
// resolved at request time from the synced `stripe.subscriptions` table; only
// the credit balances and the lifetime flag (a one-time purchase that has no
// Stripe subscription) are stored here, since Stripe does not track them.
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  // Unlimited-forever, purchased once (no recurring subscription exists for it).
  lifetime: boolean("lifetime").notNull().default(false),
  // Monthly subscription credit allowance — reset to the plan's allowance at the
  // start of each billing period.
  monthlyCredits: integer("monthly_credits").notNull().default(0),
  // One-time credit-pack balance — never reset, spent only after monthlyCredits.
  packCredits: integer("pack_credits").notNull().default(0),
  // Start of the billing period the monthly credits were last granted for.
  lastPeriodStart: timestamp("last_period_start", { withTimezone: true }),
  // Time-boxed unlimited access (the one-time "Gold" plan). When set and in the
  // future, the user has unlimited analyses until this instant, then it expires.
  // Distinct from `lifetime` (unlimited forever). NULL means no time-boxed grant.
  unlimitedUntil: timestamp("unlimited_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
```

### `lib/db/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src"]
}
```

### `package.json`

```json
{
  "name": "workspace",
  "version": "0.0.0",
  "license": "MIT",
  "scripts": {
    "preinstall": "sh -c 'rm -f package-lock.json yarn.lock; case \"$npm_config_user_agent\" in pnpm/*) ;; *) echo \"Use pnpm instead\" >&2; exit 1 ;; esac'",
    "build": "pnpm run typecheck && pnpm -r --if-present run build",
    "typecheck:libs": "tsc --build",
    "typecheck": "pnpm run typecheck:libs && pnpm -r --filter \"./artifacts/**\" --filter \"./scripts\" --if-present run typecheck"
  },
  "private": true,
  "devDependencies": {
    "prettier": "^3.8.3",
    "typescript": "~5.9.3"
  },
  "dependencies": {
    "stripe": "^22.2.0",
    "stripe-replit-sync": "^1.0.0"
  }
}
```

### `pnpm-workspace.yaml`

```yaml
# ============================================================================
# SECURITY: Minimum release age for npm packages (supply-chain attack defense)
# ============================================================================
#
# This setting requires that any npm package version must have been published
# for at least 1 day (1440 minutes) before pnpm will allow installing it.
# This is a critical defense against supply-chain attacks. In most cases,
# malicious npm releases are discovered and pulled within hours, so a 1-day
# delay provides a strong safety buffer.
#
# DO NOT DISABLE THIS SETTING. Removing or setting it to 0 is considered
# extremely dangerous and leaves the entire workspace vulnerable to supply-
# chain attacks, which have been the #1 vector for npm ecosystem compromises.
#
# If you absolutely need to install a package before the 1-day window has
# passed (e.g. an urgent security bugfix), you can add it to the
# `minimumReleaseAgeExclude` allowlist below. Only consider doing this for
# packages released by trusted organizations with an impeccable security
# posture (e.g. Replit packsges, react from Meta, typescript from Microsoft). Even then,
# remove the exclusion once the 1-day window has passed.
#
# Example:
#   minimumReleaseAgeExclude:
#     - react
#     - typescript
#
# ============================================================================
minimumReleaseAge: 1440

minimumReleaseAgeExclude:
  # Exclude @replit scoped packages from the minimum release age check.
  # These are published by Replit and trusted — the supply-chain attack vector
  # this setting guards against does not apply to our own packages.
  - '@replit/*'
  - stripe-replit-sync

packages:
  - artifacts/*
  - lib/*
  - lib/integrations/*
  - scripts

catalog:
  '@replit/vite-plugin-cartographer': ^0.5.1
  '@replit/vite-plugin-dev-banner': ^0.1.1
  '@replit/vite-plugin-runtime-error-modal': ^0.0.6
  '@tailwindcss/vite': ^4.1.14
  '@tanstack/react-query': ^5.90.21
  '@types/node': ^25.3.3
  '@types/react': ^19.2.0
  '@types/react-dom': ^19.2.0
  '@vitejs/plugin-react': ^5.0.4
  class-variance-authority: ^0.7.1
  clsx: ^2.1.1
  drizzle-orm: ^0.45.2
  framer-motion: ^12.23.24
  lucide-react: ^0.545.0
  # Must be this exact version because expo requires it
  react: 19.1.0
  # Must be this exact version because expo requires it
  react-dom: 19.1.0
  tailwind-merge: ^3.3.1
  tailwindcss: ^4.1.14
  tsx: ^4.21.0
  vite: ^7.3.2
  wouter: ^3.3.5
  zod: ^3.25.76

autoInstallPeers: false

onlyBuiltDependencies:
  - '@swc/core'
  - esbuild
  - msw
  - unrs-resolver

overrides:
  # replit uses linux-x64 only, we can exclude all other platforms
  "esbuild>@esbuild/darwin-arm64": "-"
  "esbuild>@esbuild/darwin-x64": "-"
  "esbuild>@esbuild/freebsd-arm64": "-"
  "esbuild>@esbuild/freebsd-x64": "-"
  "esbuild>@esbuild/linux-arm": "-"
  "esbuild>@esbuild/linux-arm64": "-"
  "esbuild>@esbuild/linux-ia32": "-"
  "esbuild>@esbuild/linux-loong64": "-"
  "esbuild>@esbuild/linux-mips64el": "-"
  "esbuild>@esbuild/linux-ppc64": "-"
  "esbuild>@esbuild/linux-riscv64": "-"
  "esbuild>@esbuild/linux-s390x": "-"
  "esbuild>@esbuild/netbsd-arm64": "-"
  "esbuild>@esbuild/netbsd-x64": "-"
  "esbuild>@esbuild/openbsd-arm64": "-"
  "esbuild>@esbuild/openbsd-x64": "-"
  "esbuild>@esbuild/sunos-x64": "-"
  "esbuild>@esbuild/win32-arm64": "-"
  "esbuild>@esbuild/win32-ia32": "-"
  "esbuild>@esbuild/win32-x64": "-"
  "esbuild>@esbuild/aix-ppc64": '-'
  "esbuild>@esbuild/android-arm": '-'
  "esbuild>@esbuild/android-arm64": '-'
  "esbuild>@esbuild/android-x64": '-'
  "esbuild>@esbuild/openharmony-arm64": '-'
  "lightningcss>lightningcss-android-arm64": "-"
  "lightningcss>lightningcss-darwin-arm64": "-"
  "lightningcss>lightningcss-darwin-x64": "-"
  "lightningcss>lightningcss-freebsd-x64": "-"
  "lightningcss>lightningcss-linux-arm-gnueabihf": "-"
  "lightningcss>lightningcss-linux-arm64-gnu": "-"
  "lightningcss>lightningcss-linux-arm64-musl": "-"
  "lightningcss>lightningcss-linux-x64-musl": "-"
  "lightningcss>lightningcss-win32-arm64-msvc": "-"
  "lightningcss>lightningcss-win32-x64-msvc": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-android-arm64": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-darwin-arm64": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-darwin-x64": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-freebsd-x64": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-linux-arm-gnueabihf": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-linux-arm64-gnu": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-linux-arm64-musl": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-win32-arm64-msvc": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-win32-x64-msvc": "-"
  "@tailwindcss/oxide>@tailwindcss/oxide-linux-x64-musl": "-"
  "rollup>@rollup/rollup-android-arm-eabi": "-"
  "rollup>@rollup/rollup-android-arm64": "-"
  "rollup>@rollup/rollup-darwin-arm64": "-"
  "rollup>@rollup/rollup-darwin-x64": "-"
  "rollup>@rollup/rollup-freebsd-arm64": "-"
  "rollup>@rollup/rollup-freebsd-x64": "-"
  "rollup>@rollup/rollup-linux-arm-gnueabihf": "-"
  "rollup>@rollup/rollup-linux-arm-musleabihf": "-"
  "rollup>@rollup/rollup-linux-arm64-gnu": "-"
  "rollup>@rollup/rollup-linux-arm64-musl": "-"
  "rollup>@rollup/rollup-linux-loong64-gnu": "-"
  "rollup>@rollup/rollup-linux-loong64-musl": "-"
  "rollup>@rollup/rollup-linux-ppc64-gnu": "-"
  "rollup>@rollup/rollup-linux-ppc64-musl": "-"
  "rollup>@rollup/rollup-linux-riscv64-gnu": "-"
  "rollup>@rollup/rollup-linux-riscv64-musl": "-"
  "rollup>@rollup/rollup-linux-s390x-gnu": "-"
  "rollup>@rollup/rollup-linux-x64-musl": "-"
  "rollup>@rollup/rollup-openbsd-x64": "-"
  "rollup>@rollup/rollup-openharmony-arm64": "-"
  "rollup>@rollup/rollup-win32-arm64-msvc": "-"
  "rollup>@rollup/rollup-win32-ia32-msvc": "-"
  "rollup>@rollup/rollup-win32-x64-gnu": "-"
  "rollup>@rollup/rollup-win32-x64-msvc": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-darwin-arm64": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-darwin-x64": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-freebsd-ia32": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-freebsd-x64": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-linux-arm64": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-linux-arm": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-linux-ia32": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-sunos-x64": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-win32-ia32": "-"
  "@expo/ngrok-bin>@expo/ngrok-bin-win32-x64": "-"
  # drizzle-kit uses esbuild internally on an older version that's vulnerable, this overrides it
  "@esbuild-kit/esm-loader": "npm:tsx@^4.21.0"
  esbuild: "0.27.3"
  # qs >=6.15.2 fixes GHSA-q8mj-m7cp-5q26 (DoS via stringify with comma-format arrays)
  qs: ">=6.15.2"
```

### `replit.md`

```markdown
# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/trading-copilot/` — the Ace Trades trading copilot web app (React + Vite). See `artifacts/trading-copilot/README.md` for a plain-English guide to every file, how data flows, and "how to ask an AI to change X" recipes.
- `artifacts/api-server/` — Express API server (chart analysis via Anthropic, Stripe, health).
- `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` — OpenAPI contract and generated Zod schemas + React Query hooks.

## Architecture decisions

- The frontend never calls the AI directly. All AI analysis goes through the API server (`artifacts/api-server/src/routes/analysis.ts`), which holds the Anthropic credentials. Endpoints: chart analyze, chart review, and news impact (`/analysis/news`).
- The API contract is defined first in `lib/api-spec/openapi.yaml`; React Query hooks (`useAnalyzeChart`, `useReviewChart`, `useAnalyzeNews`) and Zod schemas are generated from it. Add new endpoints to the spec and run codegen rather than hand-writing client code.
- User settings and journal live only in the browser (localStorage keys `tc_settings_v1` / `tc_journal_v1`) — never on a server.
- Design tokens live in `artifacts/trading-copilot/src/index.css`: body font Helvetica (`--app-font-sans`), a Futura-style display font (`--app-font-display`, with "Jost" loaded in `index.html` as the Futura fallback), and a royal-purple accent (`--primary` / `--ring`). The `font-display` class is used for prominent headings.

## Product

Ace Trades is a beginner-friendly trading copilot that works for any instrument and market — futures, stocks, forex, and crypto (Nasdaq-100 / NQ futures is the default). Users can: (1) upload a chart screenshot for a graded setup analysis, (2) keep a personal trading plan (long/short/risk rules + a risk calculator that sizes positions in contracts/shares/lots or plain dollar risk), (3) paste a news headline or upcoming event (and/or a screenshot) to get a predicted market impact (direction, volatility, impact rating, trade recommendation, plain-English reasoning), (4) get a longer "trader review" of a chart, and (5) review a journal of past analyses with stats. Instruments come from built-in presets (grouped by asset class) or a fully custom definition (point value, tick size, quantity label, currency). All AI features explain themselves in plain English for new traders and adapt to the selected market (e.g. 24h markets like crypto/forex drop exchange-session framing).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Test mode (dev only):** In development the app bypasses Clerk sign-in and the credit paywall so charts can be tested without an account. Gated by `NODE_ENV === "development"` on the server (`TEST_MODE` in `artifacts/api-server/src/lib/clerkAuth.ts`) and `import.meta.env.DEV` on the client (`App.tsx`, `access-context.tsx`). In test mode the server treats requests as a fixed `test-mode-user` with unlimited access. A production build/deploy (`NODE_ENV=production`, `vite build`) enforces real auth + billing.
- The api-server dev workflow runs `build && start` (no file watcher). After editing API server code (e.g. routes), restart the `artifacts/api-server: API Server` workflow or the change won't be served (you'll get `Cannot POST ...`).
- After adding/changing endpoints in `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` before using the new hooks/schemas. Don't change the OpenAPI `info.title` — it controls generated filenames.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
```

### `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "incremental": true,
    "isolatedModules": true,
    "lib": ["es2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "types": [],
    "customConditions": ["workspace"]
  }
}
```

### `tsconfig.json`

```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./lib/db"
    },
    {
      "path": "./lib/api-client-react"
    },
    {
      "path": "./lib/api-zod"
    }
  ]
}
```
