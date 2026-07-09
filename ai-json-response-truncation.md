---
name: AI JSON response truncation & screenshot intake
description: Why chart/news AI routes can 500 on every real upload, and how image uploads are normalized client-side.
---

# AI JSON response truncation (the "charts won't read at all" trap)

The api-server AI routes (`analysis.ts`: analyze, news, review) ask the model for a
single JSON object and then `JSON.parse` it. If `max_tokens` is too low for the
response, the model output is truncated mid-string and `JSON.parse` throws
("Unterminated string in JSON") → **HTTP 500 for every real analysis**, while a
tiny/simple test image still passes (its response fits under the cap).

**Why this is misleading:** the symptom looks like "the model can't read my chart
screenshot," but the image is read fine — the failure is purely the response
overflowing the token budget. Adding fields to a response schema (e.g. a new
"timing" block) lengthens output and can silently re-trigger this on charts that
used to work.

**Rules when touching any AI JSON route:**
- Budget `max_tokens` with real headroom for the *fullest* response the schema can
  produce, not the happy-path test case. A complete analyze response is ~8k chars.
- Log when `response.stop_reason === "max_tokens"` so future truncation is visible.
- Keep JSON parsing tolerant: strip ```json fences and slice from the first `{` to
  the last `}` before parsing (shared `parseModelJson()` helper).

# Screenshot intake (frontend)

Real user screenshots (phone / 4K) can exceed the model's image limits and fail
independently of the token issue. The frontend normalizes uploads before sending
via `prepareImage()` (`trading-copilot/src/lib/image.ts`): cap longest edge at
1568px (the model's effective cap), downscale, flatten onto a white matte (so
transparent PNGs don't go black), and fall back to raw bytes if the canvas
pipeline fails. All four upload tabs (Analyze/Review/News/Debrief) share it.

**Re-encode charts losslessly (PNG), NOT JPEG.** Chart screenshots are line art +
text (thin candles, gridlines, small axis/indicator labels). JPEG compression
blurs exactly that detail and degrades how well the model reads the chart. Use PNG
output and high-quality stepped (halving) downscale; only fall back to JPEG (~0.92)
if the PNG would blow the per-image size cap.

**Why (async guard):** `prepareImage` is async, so upload handlers guard against
stale completions with a per-upload sequence ref — without it, a rapid
re-upload/clear can apply an older image's result.

# Transient AI overload vs. a genuinely bad image

A 500 on analyze usually does NOT mean the chart was unreadable. The common cause
is Anthropic returning **529 `overloaded_error`** (transient capacity). Rely on the
SDK's `maxRetries` and classify errors: transient (HTTP 429/5xx/529) → reply 503
"the AI is busy, try again"; everything else → generic failure. Do not show
"upload a clearer chart" copy for these — it misleads the user.

The one case where the image really is the problem: Anthropic returns **400
`invalid_request_error` "Could not process image"** (e.g. a degenerate/tiny or
corrupt image). That is distinct from 529 and is the only genuine "bad image" path.
