---
name: API codegen + vite transient errors
description: Why vite shows "Failed to load url …/generated/api.ts" right after running api-spec codegen, and how to clear it.
---

Running `pnpm --filter @workspace/api-spec run codegen` (orval) cleans the output folders before regenerating, so for a brief window the generated files (`lib/api-client-react/src/generated/api.ts`, `api.schemas.ts`, etc.) do not exist.

If a web workflow (vite) is running and tries to HMR during that window, it logs transient errors like:
`Pre-transform error: Failed to load url /@fs/.../generated/api.ts ... Does the file exist?`

**Why:** orval deletes-then-writes the output folder; the deletion races with vite's file watcher.

**How to apply:** These errors are harmless once codegen finishes and the files reappear. If they persist in the running app, restart the web workflow to clear vite's stale module state. Do not assume codegen broke the build — verify the generated files exist and run `pnpm run typecheck`.
