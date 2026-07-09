---
name: Chart bias vs. trade qualification
description: Why the chart-analysis prompts must keep directional bias separate from whether the trade qualifies, and must read price structure + drawn annotations.
---

# Directional bias must be prompted separately from trade qualification

In the chart Analyze and Trader Review prompts (api-server `analysis.ts`), the model
must set `bias` / `market_bias` from the **actual price direction**, kept strictly
separate from whether the setup **qualifies** against the trader's entry criteria.

**Why:** A user reported clearly bullish charts being graded "Bearish." Root cause was
that the prompt let the model conflate "this long setup does not meet the trader's
criteria" with "bearish bias," so a non-qualifying long in an uptrend flipped the bias.
Direction and qualification are independent: an uptrend with unverified momentum/volume
is still Bullish bias but a low grade.

**How to apply:** When editing these prompts, preserve three instructions:
1. Derive trend direction from price structure (sequence of swing highs/lows + slope),
   NOT from candle color — platforms invert red/green.
2. Read trader-drawn annotations and labeled indicators (horizontal lines, trendlines,
   moving averages, VWAP, pivots, "CP", and stop-loss / entry / target markers) and use
   them; a stop below price with targets above implies a long (bullish) plan.
3. If a required indicator can't be verified, lower the grade / note it in
   indicators_missing — do NOT change the directional bias because of it.
