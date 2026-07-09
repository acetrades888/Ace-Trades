---
name: Post-merge DB push & drizzle-kit rename prompt
description: After a merge adds DB tables, the dev DB may lack them; orphan tables make drizzle-kit push hang on a no-TTY prompt.
---

When a merged task adds new DB tables, the dev database in this environment may not have them yet — symptom is runtime 500s with `Failed query: select ... from "<table>"` (relation does not exist). Fix by running `pnpm --filter @workspace/db run push` (dev only).

**Why push can fail non-interactively:** if the DB contains a table that is NOT in the current Drizzle schema (an orphan from an older schema), `drizzle-kit push` tries to interactively resolve whether each new table is a *rename* of the orphan. In a non-TTY shell this throws `Interactive prompts require a TTY terminal`. The `--force` flag (`push-force`) does NOT bypass this rename resolver — it only auto-confirms data-loss statements.

**How to apply:** check existing tables (`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`). If an orphan table is blocking and it's empty/unreferenced by the current `lib/db/src/schema`, drop it, then `push-force` runs clean (pure creates never prompt). Verify the orphan isn't in the source schema (stale `lib/db/dist/*.d.ts` build output does not count as a reference).
