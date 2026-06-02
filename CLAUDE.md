# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-file React wellbeing tracker (`unified-app.jsx`). No build system or package.json exists in this repo — the file is intended to be consumed by an external host or bundler environment.

## Architecture

Everything lives in `unified-app.jsx`, organized top-to-bottom in four sections:

**DATA** — Static constants at the top of the file:
- `AREAS` — 12 wellbeing domains, each with an `id`, `category`, `name`, and `hint`
- `ACTIONS` — Micro-actions keyed by tier (1–4, where tier 1 is easiest), each with a `domains` array that maps back to area IDs for weighted selection
- `CATEGORY_ORDER` — Canonical display order for the 6 categories

**STORAGE** — `loadHistory` / `saveCheckin` use `window.storage.get` / `window.storage.set`, which is an injected API provided by the host environment (not `localStorage`). History is capped at 60 entries.

**SCREENS** — Five screen components, each self-contained:
- `HomeScreen` — entry point; shows greeting, two "door" buttons, trend summary
- `SoftResetScreen` — presents one micro-action at a time across 4 escalating tiers; `getWeightedAction` biases toward actions that touch neglected domains
- `CheckinScreen` — steps through all 12 `AREAS` one at a time, collecting a `thriving / okay / neglected / skip` rating for each
- `SummaryScreen` — shows results of the completed check-in grouped by category
- `StatsScreen` — area map (dominant state across all history) + expandable check-in history list

**APP** — `App` (default export) owns all routing via a single `screen` state string (`"home" | "reset" | "checkin" | "summary" | "stats"`). It also owns `history` state and passes `neglectedIds` (derived from last 3 check-ins) and `trends` (derived from last 5) down as props.

## Key data flows

- `neglectedIds` is recomputed from history on every render and passed to `SoftResetScreen` to weight action selection toward neglected areas.
- After `CheckinScreen` calls `onComplete(ratings)`, `App` saves the entry and transitions to `SummaryScreen` with `pendingRatings`.
- All CSS is colocated in a `<style>` block inside `App`'s render. Typography uses Instrument Serif (serif headings) and Geist Mono (monospace body) loaded from Google Fonts.

## Conventions

- The `window.storage` API must be present at runtime — the app will silently return empty history if it throws.
- Screen transitions use opacity + translateY fade-ins via CSS (`.vis` class toggled after a short `setTimeout`).
- `getWeightedAction` gives 3× weight to actions whose `domains` overlap with `neglectedIds`; unmatched actions get 1× weight.
