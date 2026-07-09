---
name: Mutation side effects must survive tab unmount
description: In trading-copilot, persistence/journaling tied to an in-flight request must live in hook-level useMutation callbacks, not mutate-scoped ones.
---

# Mutation side effects must survive tab unmount

The trading-copilot page (`TradingCopilot.tsx`) conditionally renders one tab at a
time, so switching tabs **unmounts** the active tab component. An analyze/debrief
request can take 20-30s.

Rule: any side effect that must complete even if the user navigates away mid-request
(saving the result to localStorage, appending a journal entry) must be defined in the
**hook-level** `useMutation({ onSuccess })` options, NOT in the `mutate(vars, { onSuccess })`
call-scoped callbacks.

**Why:** TanStack Query drops `mutate`-scoped callbacks if the component unmounts
before the mutation settles, but hook-level callbacks still fire. AnalyzeTab lost its
result + journal entry when the user switched tabs during analysis until this was moved.

**How to apply:** Build the side effect purely from `(data, variables)` (the request
body is in `variables.data`) so it does not depend on component state that is gone after
unmount. Tabs that only set local `result` state (NewsTab, DebriefTab, etc.) don't need
this — that state is meant to be discarded on unmount anyway.
