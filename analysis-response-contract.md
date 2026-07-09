---
name: Analysis response contract (analyze/news/review)
description: Why AI analysis response field names must be kept in lockstep by hand across prompt, UI, and OpenAPI.
---

The `/analysis/analyze`, `/analysis/news`, and `/analysis/review` endpoints return the model's JSON **raw** (`res.json(result)`) and the client consumes it as `any`. Nothing validates the response against the OpenAPI/zod schema, so there is **no compile-time or runtime check** that the prompt's JSON keys match the fields the tab renders.

**Why:** A pre-existing bug had the Review prompt emitting one set of keys (e.g. `trend_analysis`, `rr_analysis`, `long_setup`) while `ReviewTab.tsx` read a different set (`trend_alignment`, `risk_reward_assessment`, `long_setup_quality`, ...). Result: the Review metric grid rendered all dashes and Full Review was empty, and nothing flagged it.

**How to apply:** When you change any analysis prompt's output JSON, update all three in lockstep:
1. the prompt's JSON template in `artifacts/api-server/src/routes/analysis.ts`
2. the fields the matching tab reads (`AnalyzeTab.tsx` / `NewsTab.tsx` / `ReviewTab.tsx`)
3. the schema in `lib/api-spec/openapi.yaml` (then run `pnpm --filter @workspace/api-spec run codegen`)
Step 3 keeps the contract honest even though it isn't enforced at runtime; skipping it leaves the generated types silently wrong.
