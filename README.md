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
