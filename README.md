# life app

A small tool for behavioral activation. When you're stuck, overwhelmed, or quietly drifting, it helps you find the smallest available action that feels possible right now — and gently shows you which parts of life are being tended to and which are going hungry.

This is not a productivity app. There are no streaks, no overdue states, no backlogs. Coming back after weeks away feels exactly the same as day one.

**[Open the app →](https://saitekii.github.io/life-app/)**

---

## What it does

**Soft Reset** gives you one micro-action at a time across four tiers of decreasing friction — from small environmental shifts (stand up, open a window) down to just breathing and being here. Rejecting a suggestion always moves toward something simpler, never harder. After completing a couple of actions, it may offer something slightly larger if you're in motion.

**Life Areas** walks through twelve domains of wellbeing one at a time — Physical, Relationships, Creativity, Purpose, and others. For each you choose: thriving, okay, neglected, or skip. The goal is to notice, not to fix. What you mark as neglected quietly shapes which Soft Reset suggestions you're more likely to see.

**What Needs You** is for when you have some time and want to know where to put it. It picks one area that's been going hungry based on your check-in history and suggests something meaningful to do with the next thirty minutes or so. Not a micro-action — a real thing worth an hour. "Something else" cycles through different suggestions until one fits.

---

## Running locally

```bash
npm install
npm run dev
```

Requires Node 18+. The app runs entirely in the browser with no backend — history is stored in `localStorage`.

---

## Architecture

Everything lives in `unified-app.jsx`, organized in four sections:

- **DATA** — Static constants: 12 life areas, micro-actions keyed by tier (1–4), area actions for the Tend To screen
- **STORAGE** — `loadHistory` / `saveCheckin` via `localStorage`
- **SCREENS** — Self-contained components: `HomeScreen`, `SoftResetScreen`, `CheckinScreen`, `SummaryScreen`, `StatsScreen`, `TendToScreen`, `FreeTimeScreen`, `MyActionsScreen`, and `InfoScreen`
- **APP** — `App` owns routing via a single `screen` state string and passes `neglectedIds` and `trends` as derived props

The weighting logic in `getWeightedAction` gives higher weight to actions whose domains overlap with recently neglected life areas and the current time of day. This is invisible to the user by design.

---

## Custom actions

You can add your own Soft Reset suggestions through the app UI, or bulk-import them as JSON:

```json
[
  { "text": "open your DAW", "tier": 2, "domains": ["creativity", "mastery"] },
  { "text": "improvise for one minute", "tier": 3, "domains": ["creativity", "play"] }
]
```

Valid tiers are 1–4. Valid domains: `physical`, `stability`, `autonomy`, `relationships`, `intimacy`, `recognition`, `learning`, `mastery`, `purpose`, `play`, `creativity`, `hope`.

---

## Design principles

- Background `#0C0C0B` — slightly warm, not pure black
- Text `#E8E3DB` — slightly aged, not stark white
- Fonts: Instrument Serif for display, Geist Mono for UI
- No icons, no illustrations, no decorative elements
- Whitespace is intentional — emptiness is a feature
- Copy avoids "should", "need to", "don't forget" — the tone is a calm friend, not a coach
