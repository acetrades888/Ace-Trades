---
name: Task-completion validation misattribution
description: The automated code review run at task completion can evaluate against the wrong task title and an over-broad diff range; how to verify and respond.
---

The automated code review triggered at task completion has twice evaluated the diff against a stale/wrong task title (an old "pack the app into one file" follow-up) and an over-broad diff range sweeping in prior, already-committed tasks (pricing, billing, .replit changes). It then REJECTED with "scope breach" for work that was never in the current change.

**Why:** The validation appears to receive stale task context and diff from a base older than HEAD, not the current task's actual commit.

**How to apply:** Before completing a task, run your own architect review scoped to the real change. If the completion validation rejects citing files you never touched, verify with `git --no-optional-locks show --stat HEAD` that the commit contains only this task's files, then complete with a `skip_validation_reason` documenting the evidence (commit hash, file list, architect PASS). Do not revert or "split" work based on the misattributed review.
