# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose & philosophy

This app was designed by a person with ADHD who gets overwhelmed easily. It is a tool for **behavioral activation** — helping the user transition from a stuck state into motion with the least possible cognitive effort.

It is not a planner, habit tracker, or productivity system. The goal is to locate the smallest available action that feels possible right now, and to gently notice which parts of life are being tended to and which are quietly going hungry.

## Non-negotiable constraints

These define the app's identity. Any feature that violates them is wrong for this project:

- No streaks, streak counters, or "days since last check-in" of any kind
- No overdue states, missed sessions, or guilt mechanics
- No backlogs or persistent task lists
- Soft Reset always shows exactly one suggestion — never more
- The check-in always shows one life area at a time — never all 12 simultaneously
- Refusal must always produce a smaller, lower-friction suggestion — never escalate pressure
- The invisible weighting between Soft Reset and the life framework must never be surfaced to the user
- Returning after weeks of absence must feel exactly as welcoming as day one

## Architecture

Everything lives in `unified-app.jsx`, organized top-to-bottom in four sections:

**DATA** — Static constants at the top of the file:
- `AREAS` — 12 wellbeing domains, each with an `id`, `category`, `name`, and `hint`
- `ACTIONS` — Micro-actions keyed by tier (1–4), each with a `domains` array mapping to area IDs for weighted selection
- `CATEGORY_ORDER` — Canonical display order for the 6 categories

**STORAGE** — `loadHistory` / `saveCheckin` use `window.storage.get` / `window.storage.set`, an injected API provided by the Claude artifact sandbox (not `localStorage`). History is capped at 60 entries.

**SCREENS** — Five self-contained screen components:
- `HomeScreen` — greeting, two "door" buttons (Soft Reset / Life Areas), stats link, trend patterns
- `SoftResetScreen` — one micro-action at a time across 4 escalating friction tiers
- `CheckinScreen` — steps through all 12 `AREAS` one at a time, collecting `thriving / okay / neglected / skip`
- `SummaryScreen` — check-in results grouped by category with a generated insight sentence
- `StatsScreen` — area map (dominant state across all history) + expandable check-in history list

**APP** — `App` (default export) owns routing via a single `screen` state string (`"home" | "reset" | "checkin" | "summary" | "stats"`), owns `history` state, and passes `neglectedIds` (derived from last 3 check-ins) and `trends` (derived from last 5) down as props.

## The friction ladder (Soft Reset tiers)

Tier 1 through 4 represent escalating ease — when a user rejects a suggestion, the system moves to a higher tier number (lower friction), not a lower one:

- **Tier 1** — Environmental shift: stand up, open a window, step outside
- **Tier 2** — Body activation: drink water, wash your face, stretch
- **Tier 3** — Micro initiation: send one message, write one sentence, play a song
- **Tier 4** — Minimal presence: take one breath, feel your feet on the ground, just be here

## Key data flows

- `neglectedIds` is recomputed from history on every render and passed to `SoftResetScreen`. `getWeightedAction` gives 3× weight to actions whose `domains` overlap with `neglectedIds`; unmatched actions get 1×. This weighting is invisible to the user by design.
- After `CheckinScreen` calls `onComplete(ratings)`, `App` saves the entry and transitions to `SummaryScreen` with `pendingRatings`.
- All CSS lives in a single `<style>` block inside `App`'s render.

## Running outside the Claude artifact environment

The only required change to run in a standard React project is replacing the storage functions:

```js
async function loadHistory() {
  try {
    const raw = localStorage.getItem("checkin-history");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveCheckin(entry) {
  try {
    const hist = await loadHistory();
    hist.unshift(entry);
    const trimmed = hist.slice(0, 60);
    localStorage.setItem("checkin-history", JSON.stringify(trimmed));
    return trimmed;
  } catch { return []; }
}
```

To scaffold a Vite project:

```bash
npm create vite@latest soft-reset -- --template react
cd soft-reset
npm install
# Replace src/App.jsx with unified-app.jsx contents, apply storage swap above
npm run dev
```

## Aesthetic direction

Preserve these visual decisions in all UI work:

- Background: near-black `#0C0C0B` (slightly warm, not pure black)
- Text: warm off-white `#E8E3DB` (slightly aged, not stark white)
- Thriving: dark muted green — not celebration green
- Neglected: dark muted rust — not alarm red
- Fonts: Instrument Serif for display/headings (warmth), Geist Mono for UI/body (calm precision)
- No icons, illustrations, or decorative elements
- Whitespace is intentional — emptiness is a feature

## Conventions

- Screen transitions use opacity + translateY fade-ins via CSS (`.vis` class toggled after a short `setTimeout`).
- `window.storage` must be present at runtime — the app silently returns empty history if it throws.
- UI copy avoids "should", "need to", "don't forget" — tone is a calm friend, not a productivity coach.

## Planned features (not yet built)

**Near term:** localStorage migration, Vite project scaffold, mobile layout polish, more Soft Reset actions (Tier 3 is thin).

**Medium term:** Expanded life framework (restore Transcendence, Identity, Aesthetic Experience, Rituals, Memories or make areas user-configurable), time-of-day weighting, optional mood input, momentum mode (slightly larger suggestions after 2–3 accepted actions), trend chart.

**Long term:** User-defined custom actions tagged to domains, opt-in gentle reminders, data export, multiple profiles.
