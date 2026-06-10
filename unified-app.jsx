import { useState, useEffect, useRef } from "react";
import "./src/app.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const AREAS = [
  { id: "physical",      category: "Foundations",     name: "Physical wellbeing",   hint: "sleep, food, movement, rest" },
  { id: "stability",     category: "Foundations",     name: "Safety & stability",   hint: "finances, housing, routines, boundaries" },
  { id: "autonomy",      category: "Foundations",     name: "Autonomy",             hint: "time, expression, living by your values" },
  { id: "relationships", category: "Connection",      name: "Relationships",        hint: "friends, romance, family, community" },
  { id: "intimacy",      category: "Connection",      name: "Emotional intimacy",   hint: "being understood, trust, honest conversations" },
  { id: "recognition",   category: "Connection",      name: "Recognition",          hint: "feeling seen, appreciated, respected" },
  { id: "learning",      category: "Growth",          name: "Learning & curiosity", hint: "reading, ideas, art, new experiences" },
  { id: "mastery",       category: "Growth",          name: "Mastery",              hint: "building skills, practice, problem-solving" },
  { id: "purpose",       category: "Meaning",         name: "Purpose",              hint: "contributing, building, helping others" },
  { id: "play",          category: "Joy & Vitality",  name: "Play & joy",           hint: "games, humor, dancing, goofing around" },
  { id: "creativity",    category: "Joy & Vitality",  name: "Creativity",           hint: "music, writing, making things" },
  { id: "hope",          category: "Rhythm & Memory", name: "Hope & anticipation",  hint: "plans, goals, things to look forward to" },
];

const CATEGORY_ORDER = ["Foundations","Connection","Growth","Meaning","Joy & Vitality","Rhythm & Memory"];

const ACTIONS = {
  1: [
    { text: "stand up",                           domains: ["physical"] },
    { text: "sit somewhere else",                 domains: ["physical","stability"] },
    { text: "open a window",                      domains: ["physical","play"] },
    { text: "change the lighting",                domains: ["physical","creativity"] },
    { text: "step outside",                       domains: ["physical","hope"] },
    { text: "move to another room",               domains: ["physical","stability"] },
    { text: "sit by a window",                    domains: ["physical","learning"] },
    { text: "lie down flat for a moment",         domains: ["physical"] },
    { text: "put your phone in another room",     domains: ["autonomy","stability"] },
    { text: "look at something far away",         domains: ["physical","learning"] },
    { text: "notice how your body feels right now", domains: ["physical","autonomy"] },
    { text: "make your bed",                         domains: ["stability"] },
    { text: "light a candle",                        domains: ["creativity","stability"] },
    { text: "clear the surface in front of you",     domains: ["stability","autonomy"] },
    { text: "change what you're wearing",            domains: ["autonomy","physical"] },
    { text: "put something away that's been sitting out", domains: ["stability"] },
  ],
  2: [
    { text: "drink some water",                          domains: ["physical"] },
    { text: "stretch your arms overhead",                domains: ["physical","mastery"] },
    { text: "wash your face",                            domains: ["physical","stability"] },
    { text: "put your shoes on",                         domains: ["physical","hope"] },
    { text: "breathe slowly for ten seconds",            domains: ["physical","autonomy"] },
    { text: "roll your shoulders back",                  domains: ["physical","mastery"] },
    { text: "put something warm in your hands",          domains: ["physical","intimacy"] },
    { text: "text someone you haven't talked to in a while", domains: ["relationships","intimacy"] },
    { text: "eat something small",                       domains: ["physical"] },
    { text: "name one thing you did right today",        domains: ["recognition","autonomy"] },
    { text: "say something kind to yourself, out loud",  domains: ["recognition","intimacy"] },
    { text: "close your eyes for thirty seconds",        domains: ["physical","autonomy"] },
    { text: "make a warm drink",                         domains: ["physical","play"] },
    { text: "shake out your hands and arms",             domains: ["physical"] },
    { text: "take your medication if you haven't yet",   domains: ["physical","stability"] },
    { text: "put lotion on your hands",                  domains: ["physical","intimacy"] },
    { text: "stand and look out a window for one minute", domains: ["physical","hope"] },
    { text: "finish the sentence 'what I actually want is...'",             domains: ["autonomy","hope"] },
    { text: "write one sentence about what matters most to you right now",  domains: ["autonomy","purpose"] },
    { text: "finish the sentence 'the kind of person I want to be would...'", domains: ["autonomy","purpose"] },
    { text: "write one thing you keep thinking about but haven't acted on", domains: ["autonomy","purpose"] },
    { text: "write one thing you believe that most people around you don't", domains: ["autonomy","learning"] },
    { text: "ask yourself what you would regret not doing",                 domains: ["autonomy","hope","purpose"] },
    { text: "name one thing in your life that still feels unresolved",      domains: ["autonomy","stability"] },
    { text: "write one thing you owe yourself",                             domains: ["autonomy","recognition"] },
  ],
  3: [
    { text: "send one message to someone",                  domains: ["relationships","intimacy"] },
    { text: "open something you've been meaning to read",   domains: ["learning"] },
    { text: "put your phone face down",                     domains: ["autonomy","stability"] },
    { text: "write one sentence",                           domains: ["creativity","mastery"] },
    { text: "look out a window for a moment",               domains: ["learning","hope"] },
    { text: "pick up something you've left unfinished",     domains: ["mastery","purpose"] },
    { text: "play one song you love",                       domains: ["play","creativity","hope"] },
    { text: "do one small thing for future you",            domains: ["hope","purpose","stability"] },
    { text: "send a voice note instead of typing",          domains: ["relationships","intimacy"] },
    { text: "notice one thing you made or did this week",   domains: ["recognition","mastery"] },
    { text: "find a video of something you love",           domains: ["play","learning"] },
    { text: "write down one thing you want to remember",    domains: ["hope","learning"] },
    { text: "open a project you care about, just to look",  domains: ["purpose","creativity"] },
    { text: "tell someone one thing you appreciate about them", domains: ["relationships","recognition"] },
    { text: "put on music that matches how you feel",       domains: ["creativity","intimacy"] },
    { text: "pull up something creative you made",          domains: ["recognition","creativity"] },
    { text: "let yourself want something without guilt",    domains: ["autonomy","hope"] },
    { text: "cancel something you don't actually want to do", domains: ["autonomy","stability"] },
    { text: "make a small plan for tomorrow",               domains: ["hope","stability"] },
    { text: "reply to one message you've been putting off", domains: ["relationships","stability"] },
    { text: "doodle something for two minutes, no goal",    domains: ["creativity","play"] },
    { text: "name three things that went okay today",       domains: ["recognition","hope"] },
    { text: "add one thing to a list you've been avoiding", domains: ["stability","mastery"] },
    { text: "hum or sing something to yourself",            domains: ["creativity","play"] },
    { text: "set a timer for ten minutes and start one thing", domains: ["mastery","purpose"] },
    { text: "text someone you've been thinking about",      domains: ["relationships","intimacy"] },
    { text: "read one page of something",                   domains: ["learning"] },
    { text: "write about one value you hold and whether your recent actions reflect it", domains: ["autonomy","purpose"] },
    { text: "write about what 'doing the right thing' looks like in something you're facing", domains: ["autonomy","purpose"] },
    { text: "write about what you actually want — not what you think you should want", domains: ["autonomy","hope"] },
    { text: "write about what kind of contribution you want to make, to anything", domains: ["purpose","hope"] },
    { text: "reflect on one thing you did recently and ask if it was true to who you are", domains: ["autonomy","purpose"] },
    { text: "write about something you believe is worth doing even if no one notices", domains: ["purpose","autonomy"] },
    { text: "write about one thing you've been avoiding deciding",          domains: ["autonomy","stability"] },
    { text: "ask honestly whether what you're spending time on matches what you care about", domains: ["autonomy","purpose"] },
    { text: "write about what your beliefs ask of you in something you're facing right now", domains: ["autonomy","purpose","learning"] },
    { text: "write about what you're building toward, even if you're not sure how", domains: ["purpose","hope"] },
    { text: "write about an obligation you feel and whether you actually believe in it", domains: ["autonomy","purpose"] },
    { text: "write for five minutes about what you want your life to look like in a year", domains: ["hope","autonomy","purpose"] },
  ],
  4: [
    { text: "sit still for a moment",             domains: ["physical","autonomy"] },
    { text: "notice three things in the room",    domains: ["learning","physical"] },
    { text: "feel your feet on the ground",       domains: ["physical","stability"],  guided: ["find your feet.", "feel the floor beneath them."] },
    { text: "take one breath",                    domains: ["physical","autonomy"],   guided: ["breathe in...", "...breathe out."], guidedMs: 4000 },
    { text: "let your shoulders drop",            domains: ["physical","stability"],  guided: ["feel your shoulders.", "let them fall."] },
    { text: "just be here",                       domains: ["autonomy","purpose"] },
    { text: "let your jaw unclench",              domains: ["physical","autonomy"],   guided: ["notice your jaw.", "let it soften."] },
    { text: "close one open tab or app",          domains: ["stability","autonomy"] },
    { text: "give yourself credit for being here", domains: ["recognition","autonomy"] },
    { text: "rest your hands in your lap",          domains: ["physical","autonomy"],  guided: ["find your hands.", "let them rest."] },
    { text: "notice the temperature of the air around you", domains: ["physical","learning"] },
    { text: "let your face go soft",                domains: ["physical","autonomy"],  guided: ["notice your face.", "let it soften."] },
    { text: "count slowly from one to ten",         domains: ["physical","autonomy"],  guided: ["one... two... three...", "four... five... six...", "seven... eight... nine... ten."], guidedMs: 3000 },
    { text: "let what isn't yours stay where it is", domains: ["autonomy","stability"] },
    { text: "notice what's actually in your hands right now", domains: ["autonomy","physical"] },
  ],
};

const AREA_ACTIONS = {
  physical: [
    "Go for a walk outside for twenty minutes — no destination required.",
    "Cook or prepare a real meal from scratch, even a simple one.",
    "Do a body-scan stretch: lie on the floor and spend fifteen minutes moving slowly through every part that feels tight.",
    "Go to bed right now, an hour earlier than usual, and read until you fall asleep.",
    "Step outside and move your body for thirty minutes — walk, jog, bike, whatever costs no thought.",
  ],
  stability: [
    "Spend twenty minutes writing down every open loop in your head — bills, tasks, things you said you'd do — just to see them.",
    "Tidy one room completely: put things back, clear surfaces, take out the trash.",
    "Look at your bank balance and recent transactions and spend fifteen minutes understanding where you actually are financially.",
    "Write down three routines you want to have this week and put them somewhere visible.",
    "Cancel, defer, or delegate one thing that's been sitting on your plate making you feel behind.",
  ],
  autonomy: [
    "Spend thirty minutes doing something you've been wanting to do purely for yourself that you keep deprioritizing.",
    "Write for twenty minutes about what you actually want your days to look like right now — no editing, no judgment.",
    "Say no to something this week: draft the message or the conversation, even if you haven't sent it yet.",
    "Block off two hours in your calendar in the next few days that belong entirely to you.",
    "Make one decision today entirely on your own terms, without asking anyone else what they think.",
  ],
  relationships: [
    "Call someone you've been meaning to call — not a text, a real call — and plan to talk for at least twenty minutes.",
    "Make specific plans with someone: pick a date, a place, something to do, and send the message right now.",
    "Write a message to someone telling them something specific you appreciate about them.",
    "Spend twenty minutes thinking about one relationship that's felt distant and write what you'd like it to look like.",
    "Show up somewhere you used to go regularly — a class, a group, a friend's place — without overthinking it.",
  ],
  intimacy: [
    "Have a real conversation with someone you trust about something you've been carrying — not a vent, an honest exchange.",
    "Write for twenty minutes about something you feel but haven't said out loud to anyone yet.",
    "Ask someone close to you a question you actually want to know the answer to, and then just listen.",
    "Tell someone in your life something true about how you're doing, more honestly than you usually do.",
    "Spend thirty minutes with someone you care about with no phones, no screens — just being present with them.",
  ],
  recognition: [
    "Write down ten things you've done in the last month that mattered — work, personal, anything — and read them back.",
    "Share something you made, did, or figured out with someone who would genuinely appreciate it.",
    "Ask someone you respect for honest feedback on something you've been working on.",
    "Write yourself a short letter acknowledging something hard you've been doing or going through.",
    "Tell someone what you specifically contributed to something you worked on together — not boasting, just owning it.",
  ],
  learning: [
    "Read for thirty minutes in an actual book — not articles, not a phone — something you've been meaning to get to.",
    "Watch or listen to a lecture, documentary, or long-form piece on something you know nothing about.",
    "Pick one thing you've been curious about and spend thirty minutes going deep on it.",
    "Visit somewhere new in your city with no goal except to observe.",
    "Write down five questions you genuinely don't know the answer to and pick one to start chasing.",
  ],
  mastery: [
    "Spend thirty minutes working on a skill you're actively building — deliberate practice, not just doing the thing.",
    "Return to a project you've been avoiding and spend twenty minutes making it better.",
    "Identify one thing you keep doing inefficiently and spend thirty minutes figuring out a better way.",
    "Teach something you know to someone else — even briefly — and notice what gaps it reveals.",
    "Set a small, specific, completable goal for today in an area you want to get better at, and finish it before you stop.",
  ],
  purpose: [
    "Spend thirty minutes working on something you believe matters, even if no one is asking you to.",
    "Write for twenty minutes about what you'd like to have contributed or built five years from now.",
    "Find one concrete way to help someone today — something that actually requires something of you.",
    "Identify a project or cause you care about and take one real step toward it today.",
    "Volunteer your time for something in the next two weeks — find it, sign up, put it in your calendar.",
  ],
  play: [
    "Do something purely for fun with no productive justification — a game, something silly, goofing around — for at least thirty minutes.",
    "Find something that made you laugh recently and spend twenty minutes following that thread.",
    "Play a game with someone: a board game, a video game, a card game — something with rules and no stakes.",
    "Do something physically playful: throw something, kick something, dance badly in your kitchen.",
    "Revisit something you loved as a kid — a game, a show, a book, an activity — without irony.",
  ],
  creativity: [
    "Make something with your hands for thirty minutes — draw, write, cook, build, play an instrument, anything that produces an artifact.",
    "Start something you have no plan for and see where it goes for twenty minutes — no goal, just making.",
    "Pick up a creative project you've been ignoring and spend thirty minutes moving it forward.",
    "Write a short piece — a paragraph, a poem, a scene — about something you're thinking about.",
    "Listen to an album start to finish while doing nothing else, and notice what it makes you feel or imagine.",
  ],
  hope: [
    "Write down something specific you're looking forward to, then spend twenty minutes making it more real — book it, plan it, tell someone.",
    "Make a list of ten things you want to do or experience in the next year, however small or large.",
    "Spend thirty minutes planning a trip, project, or event you'd genuinely love — even if it's not certain yet.",
    "Write a letter to yourself to open in six months, describing what you hope will be different.",
    "Identify one goal that still genuinely excites you and take the first concrete step toward it today.",
  ],
};

const CONFIRMATIONS = ["good.","that counts.","that's enough.","you moved.","okay.","done.","that's real.","you met it.","that was yours to give.","you couldn't have been anywhere but here."];

const MOMENTUM_ACTIONS = [
  { text: "spend five minutes tidying one spot in your space",            domains: ["stability", "physical"] },
  { text: "write a few sentences about something on your mind",           domains: ["creativity", "autonomy", "intimacy"] },
  { text: "make a short honest list of what's actually on your plate",    domains: ["stability", "autonomy"] },
  { text: "text or message someone you've been meaning to reach",         domains: ["relationships", "intimacy"] },
  { text: "make yourself something to eat",                               domains: ["physical"] },
  { text: "do five minutes of movement — stretch, walk, shake it out",    domains: ["physical", "play"] },
  { text: "read a few pages of something",                                domains: ["learning"] },
  { text: "spend five minutes on something creative, no goal",            domains: ["creativity", "play"] },
  { text: "open one thing you've been avoiding, just to look at it",      domains: ["mastery", "stability"] },
  { text: "write down a few things you want to do this week",             domains: ["hope", "autonomy"] },
  { text: "do one small thing for your future self",                      domains: ["hope", "purpose"] },
  { text: "spend a few minutes on a skill you're building",               domains: ["mastery", "learning"] },
  { text: "send one message you've been putting off",                     domains: ["relationships", "stability"] },
  { text: "listen to a full song and just let yourself be in it",         domains: ["creativity", "play", "hope"] },
  { text: "write down one thing you're proud of this week",               domains: ["recognition", "autonomy"] },
  { text: "tidy up your immediate workspace",                             domains: ["stability"] },
  { text: "check in with how your body is feeling right now",             domains: ["physical", "autonomy"] },
  { text: "find one small thing to look forward to",                      domains: ["hope", "play"] },
];

const SUMMARY_MSGS = (neglected, thriving) => {
  if (neglected.length === 0 && thriving.length >= 3) return "things feel pretty nourished right now.";
  if (neglected.length >= 6) return "a lot feels stretched thin. that's okay to notice.";
  if (neglected.length === 1) return `${neglected[0].name.toLowerCase()} is asking for some attention.`;
  if (neglected.length === 2) return `${neglected[0].name.toLowerCase()} and ${neglected[1].name.toLowerCase()} are asking for some attention.`;
  if (neglected.length >= 3) return `${neglected.length} areas are feeling thin. no urgency — just worth knowing.`;
  return "you showed up. that's the whole thing.";
};

function getRandom(arr, excludeText = null) {
  const filtered = excludeText ? arr.filter(a => a.text !== excludeText) : arr;
  if (!filtered.length) return arr[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getTimeOfDayDomains() {
  const h = new Date().getHours();
  if (h >= 5  && h < 11) return ["physical", "stability", "mastery"];
  if (h >= 11 && h < 15) return ["purpose", "learning", "mastery"];
  if (h >= 15 && h < 18) return ["creativity", "relationships", "play"];
  if (h >= 18 && h < 22) return ["relationships", "intimacy", "hope"];
  return ["autonomy", "play", "physical"];
}

function getWeightedAction(tier, neglectedIds, excludeText = null, customActions = []) {
  const basePool = ACTIONS[tier] || ACTIONS[4];
  const customPool = customActions
    .filter(a => (a.tier ?? 3) === tier)
    .map(a => ({ text: a.text, domains: a.domains || [] }));
  const pool = [...basePool, ...customPool];
  const filtered = excludeText ? pool.filter(a => a.text !== excludeText) : pool;
  const timeDomains = getTimeOfDayDomains();
  const weighted = [];
  filtered.forEach(a => {
    const neglectOverlap = neglectedIds?.length
      ? a.domains.filter(d => neglectedIds.includes(d)).length
      : 0;
    const timeOverlap = a.domains.filter(d => timeDomains.includes(d)).length;
    const weight = 1 + (neglectOverlap * 2) + (timeOverlap > 0 ? 1 : 0);
    for (let i = 0; i < weight; i++) weighted.push(a);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function getRandomAction(arr, excludeText = null) {
  const filtered = excludeText ? arr.filter(s => s !== excludeText) : arr;
  if (!filtered.length) return arr[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getMomentumAction(neglectedIds, excludeText = null) {
  const filtered = excludeText ? MOMENTUM_ACTIONS.filter(a => a.text !== excludeText) : MOMENTUM_ACTIONS;
  const weighted = [];
  filtered.forEach(a => {
    const overlap = neglectedIds?.length
      ? a.domains.filter(d => neglectedIds.includes(d)).length
      : 0;
    const weight = 1 + (overlap * 2);
    for (let i = 0; i < weight; i++) weighted.push(a);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function getChangeIndicator(areaId, currentRatings, previousRatings) {
  if (!previousRatings) return null;
  const cur = currentRatings[areaId];
  const prev = previousRatings[areaId];
  if (!cur || !prev || cur === prev) return null;
  const rank = { neglected: 0, okay: 1, thriving: 2 };
  return rank[cur] > rank[prev] ? "↑" : "↓";
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateShort(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "still up?";
  if (h < 12) return "good morning.";
  if (h < 17) return "good afternoon.";
  if (h < 21) return "good evening.";
  return "hey.";
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────

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

function loadCustomActions() {
  try {
    const raw = localStorage.getItem("custom-actions");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCustomActions(actions) {
  try {
    localStorage.setItem("custom-actions", JSON.stringify(actions));
  } catch {}
}

function getNeglectedFromHistory(history) {
  if (!history.length) return [];
  const recent = history.slice(0, 3);
  const counts = {};
  recent.forEach(entry => {
    Object.entries(entry.ratings || {}).forEach(([id, state]) => {
      if (state === "neglected") counts[id] = (counts[id] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .filter(([, c]) => c >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id);
}

function getTrends(history) {
  if (history.length < 2) return null;
  const recent = history.slice(0, 5);
  const areaStats = {};
  AREAS.forEach(a => { areaStats[a.id] = { thriving: 0, okay: 0, neglected: 0, total: 0 }; });
  recent.forEach(entry => {
    Object.entries(entry.ratings || {}).forEach(([id, state]) => {
      if (areaStats[id] && state) { areaStats[id][state]++; areaStats[id].total++; }
    });
  });
  const consistent = AREAS.filter(a => {
    const s = areaStats[a.id];
    return s.total >= 2 && (s.neglected / s.total >= 0.6 || s.thriving / s.total >= 0.6);
  }).map(a => ({
    ...a,
    trend: areaStats[a.id].thriving > areaStats[a.id].neglected ? "thriving" : "neglected",
    score: areaStats[a.id],
  }));
  return consistent.length ? consistent : null;
}

// Compute per-area dominant state across all history
function getAreaMap(history) {
  const map = {};
  AREAS.forEach(a => { map[a.id] = { thriving: 0, okay: 0, neglected: 0, total: 0 }; });
  history.forEach(entry => {
    Object.entries(entry.ratings || {}).forEach(([id, state]) => {
      if (map[id] && state) { map[id][state]++; map[id].total++; }
    });
  });
  return map;
}

function dominantState(stats) {
  if (!stats || stats.total === 0) return "none";
  if (stats.thriving >= stats.neglected && stats.thriving >= stats.okay) return "thriving";
  if (stats.neglected >= stats.thriving && stats.neglected >= stats.okay) return "neglected";
  return "okay";
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function HomeScreen({ onSoftReset, onCheckin, onFreeTime, onStats, onMyActions, onInfo, history, trends, isDark, onToggleTheme }) {
  const lastCheckin = history[0];
  return (
    <div className="screen home-screen">
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="toggle theme">
        {isDark ? "☀" : "☽"}
      </button>
      <div className="home-top">
        <p className="greeting">{getGreeting()}</p>
        {lastCheckin && (
          <p className="last-checkin">last check-in {formatDateShort(lastCheckin.ts)}</p>
        )}
      </div>

      <div className="doors">
        <button className="door door-reset" onClick={onSoftReset}>
          <span className="door-eyebrow">i'm stuck</span>
          <span className="door-title">Soft Reset</span>
          <span className="door-sub">one small action,<br/>no thinking required</span>
        </button>
        <button className="door door-checkin" onClick={onCheckin}>
          <span className="door-eyebrow">check in</span>
          <span className="door-title">Life Areas</span>
          <span className="door-sub">see how everything<br/>is actually going</span>
        </button>
        <button className="door door-freetime" onClick={onFreeTime}>
          <span className="door-eyebrow">i have some time</span>
          <span className="door-title">What Needs You</span>
          <span className="door-sub">one area of your life that could use your attention right now</span>
        </button>
      </div>

      {history.length === 0 && (
        <div className="onboarding">
          <p className="onboarding-line">
            <span className="onboarding-label">soft reset</span>
            gives you one small action when you're stuck, overwhelmed, or just need to move.
          </p>
          <p className="onboarding-line">
            <span className="onboarding-label">life areas</span>
            walks you through twelve parts of life, one at a time, so you can see what's actually going on.
          </p>
        </div>
      )}

      {history.length > 0 && (
        <button className="stats-link" onClick={onStats}>
          view history & patterns →
        </button>
      )}

      <button className="stats-link" onClick={onMyActions}>
        my soft reset actions →
      </button>

      <button className="stats-link" onClick={onInfo}>
        how this works →
      </button>

      {trends && (
        <div className="trends">
          <p className="trends-label">patterns across recent check-ins</p>
          <div className="trends-list">
            {trends.filter(t => t.trend === "neglected").slice(0,3).map(t => (
              <div key={t.id} className="trend-row">
                <span className="trend-name">{t.name}</span>
                <span className="trend-state neglected">often neglected</span>
              </div>
            ))}
            {trends.filter(t => t.trend === "thriving").slice(0,2).map(t => (
              <div key={t.id} className="trend-row">
                <span className="trend-name">{t.name}</span>
                <span className="trend-state thriving">consistently thriving</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SoftResetScreen({ onBack, neglectedIds, customActions = [] }) {
  const [phase, setPhase] = useState("idle");
  const [tier, setTier] = useState(1);
  const [action, setAction] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [momentumText, setMomentumText] = useState(null);
  const [visible, setVisible] = useState(true);
  const [guidedStep, setGuidedStep] = useState(-1);
  const lastText = useRef(null);

  useEffect(() => {
    if (!action?.guided || guidedStep < 0 || guidedStep >= action.guided.length) return;
    const ms = action.guidedMs ?? 3500;
    const t = setTimeout(() => setGuidedStep(s => s + 1), ms);
    return () => clearTimeout(t);
  }, [guidedStep, action]);

  const show = (fn) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 220);
  };

  const startGuided = (a) => { if (a?.guided) setGuidedStep(0); else setGuidedStep(-1); };

  const start = () => {
    const a = getWeightedAction(1, neglectedIds, null, customActions);
    lastText.current = a.text;
    show(() => { setTier(1); setAction(a); setPhase("action"); startGuided(a); });
  };
  const done = () => {
    const newCount = completedCount + 1;
    setCompletedCount(newCount);
    if (newCount >= 2) {
      const ma = getMomentumAction(neglectedIds);
      setMomentumText(ma.text);
      show(() => setPhase("momentum"));
    } else {
      setConfirmation(CONFIRMATIONS[Math.floor(Math.random() * CONFIRMATIONS.length)]);
      show(() => setPhase("done"));
    }
  };
  const notThis = () => {
    const next = Math.min(tier + 1, 4);
    const a = getWeightedAction(next, neglectedIds, lastText.current, customActions);
    lastText.current = a.text;
    show(() => { setTier(next); setAction(a); startGuided(a); });
  };
  const reset = () => show(() => { setPhase("idle"); setTier(1); setAction(null); setGuidedStep(-1); });
  const commitMomentum = () => show(() => setPhase("momentum-confirmed"));
  const keepSmall = () => {
    setCompletedCount(0);
    show(() => { setPhase("idle"); setTier(1); setAction(null); setGuidedStep(-1); });
  };

  return (
    <div className="screen reset-screen">
      <button className="back-btn" onClick={onBack}>← back</button>
      <div className={`reset-center ${visible ? "vis" : ""}`}>
        {phase === "idle" && (
          <>
            <p className="reset-tagline">one small thing.<br/>that's all.</p>
            <button className="big-circle" onClick={start}>begin</button>
          </>
        )}
        {phase === "action" && (
          <>
            <div className="tier-dots">
              {[1,2,3,4].map(t => <div key={t} className={`tdot ${t === tier ? "on" : ""}`} />)}
            </div>
            {action?.guided && guidedStep >= 0 && guidedStep < action.guided.length ? (
              <>
                <p className="action-text">{action.guided[guidedStep]}</p>
                <button className="abtn abtn-skip guided-escape" onClick={notThis}>not this one</button>
              </>
            ) : (
              <>
                <p className="action-text">{action?.text}</p>
                <div className="action-btns">
                  <button className="abtn abtn-done" onClick={done}>done</button>
                  <button className="abtn abtn-skip" onClick={notThis}>not this one</button>
                </div>
              </>
            )}
          </>
        )}
        {phase === "done" && (
          <>
            <p className="confirmation">{confirmation}</p>
            <button className="text-btn" onClick={reset}>again</button>
          </>
        )}
        {phase === "momentum" && (
          <>
            <p className="momentum-intro">you're moving. want to keep going?</p>
            <p className="action-text">{momentumText}</p>
            <div className="action-btns">
              <button className="abtn abtn-done" onClick={commitMomentum}>i'll do this</button>
              <button className="abtn abtn-skip" onClick={keepSmall}>keep it small</button>
            </div>
          </>
        )}
        {phase === "momentum-confirmed" && (
          <>
            <p className="confirmation">go do it.</p>
            <button className="abtn abtn-done" style={{maxWidth:"220px",width:"100%"}} onClick={onBack}>done</button>
          </>
        )}
      </div>
    </div>
  );
}

function TendToScreen({ areaId, onBack, onDone }) {
  const area = AREAS.find(a => a.id === areaId);
  const actions = AREA_ACTIONS[areaId] || [];
  const initial = getRandomAction(actions);

  const [phase, setPhase] = useState("action");
  const [action, setAction] = useState(initial);
  const [visible, setVisible] = useState(true);
  const lastText = useRef(initial);

  const show = (fn) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 220);
  };

  const commit = () => show(() => setPhase("confirmed"));
  const somethingElse = () => {
    const next = getRandomAction(actions, lastText.current);
    lastText.current = next;
    show(() => setAction(next));
  };

  return (
    <div className="screen tendto-screen">
      <button className="back-btn" onClick={onBack}>← back</button>
      <div className="tendto-area-label">
        <span className="tendto-category">{area?.category}</span>
        <span className="tendto-name">{area?.name}</span>
      </div>
      <div className={`tendto-center ${visible ? "vis" : ""}`}>
        {phase === "action" && (
          <>
            <p className="tendto-action">{action}</p>
            <div className="tendto-btns">
              <button className="abtn abtn-done" onClick={commit}>i'll do this</button>
              <button className="abtn abtn-skip" onClick={somethingElse}>something else</button>
            </div>
            <button className="text-btn" onClick={onBack}>not now</button>
          </>
        )}
        {phase === "confirmed" && (
          <>
            <p className="tendto-confirmation">set. come back when you're done.</p>
            <button className="abtn abtn-done tendto-done-btn" onClick={onDone}>done</button>
          </>
        )}
      </div>
    </div>
  );
}

function CheckinScreen({ onBack, onComplete }) {
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [visible, setVisible] = useState(true);

  const current = AREAS[index];
  const progress = ((index + 1) / AREAS.length) * 100;

  const advance = (newRatings) => {
    setVisible(false);
    setTimeout(() => {
      if (index + 1 >= AREAS.length) { onComplete(newRatings); }
      else { setIndex(i => i + 1); setVisible(true); }
    }, 200);
  };

  const rate = (state) => { const r = { ...ratings, [current.id]: state }; setRatings(r); advance(r); };
  const skip = () => advance(ratings);

  return (
    <div className="screen checkin-screen">
      <div className="checkin-top">
        <button className="back-btn-inline" onClick={onBack}>← back</button>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <span className="progress-label">{index + 1} / {AREAS.length}</span>
      </div>
      <div className={`card-center ${visible ? "vis" : ""}`}>
        <p className="card-category">{current.category}</p>
        <h2 className="card-name">{current.name}</h2>
        <p className="card-hint">{current.hint}</p>
        <div className="rating-row">
          <button className="rbtn rbtn-thriving" onClick={() => rate("thriving")}>thriving</button>
          <button className="rbtn rbtn-okay" onClick={() => rate("okay")}>okay</button>
          <button className="rbtn rbtn-neglected" onClick={() => rate("neglected")}>neglected</button>
        </div>
        <button className="text-btn skip-btn" onClick={skip}>skip</button>
      </div>
    </div>
  );
}

function SummaryScreen({ ratings, previousRatings, onDone, onRetake, onSoftReset, onTendTo }) {
  const neglected = AREAS.filter(a => ratings[a.id] === "neglected");
  const thriving  = AREAS.filter(a => ratings[a.id] === "thriving");
  const msg = SUMMARY_MSGS(neglected, thriving);

  return (
    <div className="screen summary-screen">
      <div className="summary-inner">
        <div className="summary-head">
          <p className="summary-insight">{msg}</p>
          <p className="summary-date">{formatDate(Date.now())}</p>
        </div>
        {CATEGORY_ORDER.map(cat => {
          const areas = AREAS.filter(a => a.category === cat);
          return (
            <div className="sum-cat" key={cat}>
              <p className="sum-cat-label">{cat}</p>
              {areas.map(a => {
                const indicator = getChangeIndicator(a.id, ratings, previousRatings);
                const state = ratings[a.id];
                const isNeglected = state === "neglected";
                const rightSide = (
                  <span className="sum-row-right">
                    {state
                      ? <span className={`sum-state s-${state}`}>{state}</span>
                      : <span className="sum-state s-skip">—</span>}
                    {indicator && (
                      <span className={`sum-change sum-change-${indicator === "↑" ? "up" : "down"}`}>{indicator}</span>
                    )}
                    {isNeglected && <span className="sum-row-arrow">→</span>}
                  </span>
                );
                return isNeglected ? (
                  <button key={a.id} className="sum-row sum-row-tap" onClick={() => onTendTo(a.id)}>
                    <span className="sum-name">{a.name}</span>
                    {rightSide}
                  </button>
                ) : (
                  <div key={a.id} className="sum-row">
                    <span className="sum-name">{a.name}</span>
                    {rightSide}
                  </div>
                );
              })}
            </div>
          );
        })}
        {neglected.length > 0 && (
          <div className="sum-bridge">
            <button className="sum-bridge-btn" onClick={onSoftReset}>
              or take one small action →
            </button>
          </div>
        )}
        <div className="sum-actions">
          <button className="abtn abtn-done" onClick={onRetake}>check in again</button>
          <button className="abtn abtn-skip" onClick={onDone}>done</button>
        </div>
      </div>
    </div>
  );
}

function StatsScreen({ onBack, history, onTendTo }) {
  const [expanded, setExpanded] = useState(null);
  const areaMap = getAreaMap(history);

  const toggle = (ts) => setExpanded(e => e === ts ? null : ts);

  const cellClass = (id) => `map-cell map-cell-${dominantState(areaMap[id])}`;

  return (
    <div className="screen stats-screen">
      <div className="stats-inner">
        <div className="stats-header">
          <button className="back-btn-inline" onClick={onBack}>← back</button>
          <h2 className="stats-title">history & patterns</h2>
          <p className="stats-sub">{history.length} check-in{history.length !== 1 ? "s" : ""} · all time</p>
        </div>

        {/* Area map */}
        <div className="map-section">
          <p className="section-label">area map</p>
          <p className="section-caption">based on all your check-ins combined</p>
          <div className="area-map">
            {AREAS.map(a => (
              <button key={a.id} className={cellClass(a.id)} onClick={() => onTendTo(a.id)}>
                <span className="map-cell-name">{a.name}</span>
                {areaMap[a.id].total > 0 && (
                  <span className="map-cell-state">{dominantState(areaMap[a.id])}</span>
                )}
              </button>
            ))}
          </div>
          <div className="map-legend">
            <span className="legend-item thriving">■ thriving</span>
            <span className="legend-item okay">■ okay</span>
            <span className="legend-item neglected">■ neglected</span>
            <span className="legend-item none">■ no data</span>
          </div>
        </div>

        {/* Trend chart */}
        {history.length >= 2 && (() => {
          const recent = history.slice(0, Math.min(history.length, 10)).reverse();
          return (
            <div className="trend-chart-section">
              <p className="section-label">trends</p>
              <p className="section-caption">last {recent.length} check-in{recent.length !== 1 ? "s" : ""}</p>
              <div className="trend-chart-rows">
                {AREAS.map(a => (
                  <div key={a.id} className="trend-chart-row">
                    <span className="trend-chart-label">{a.name}</span>
                    <div className="trend-chart-dots">
                      {recent.map(entry => {
                        const state = entry.ratings?.[a.id] || "none";
                        return <span key={entry.ts} className={`trend-dot trend-dot-${state}`} title={state} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* History list */}
        <div className="history-section">
          <p className="section-label">check-in history</p>
          {history.length === 0 && (
            <p className="empty-state">no check-ins yet. complete one to see it here.</p>
          )}
          {history.map((entry, i) => {
            const isOpen = expanded === entry.ts;
            const ratedAreas = AREAS.filter(a => entry.ratings?.[a.id]);
            const neg = ratedAreas.filter(a => entry.ratings[a.id] === "neglected").length;
            const thr = ratedAreas.filter(a => entry.ratings[a.id] === "thriving").length;
            return (
              <div key={entry.ts} className="history-entry">
                <button
                  className="history-row"
                  onClick={() => toggle(entry.ts)}
                >
                  <div className="history-left">
                    <span className="history-date">{formatDate(entry.ts)}</span>
                    <span className="history-meta">
                      {ratedAreas.length} rated
                      {thr > 0 && <span className="meta-thr"> · {thr} thriving</span>}
                      {neg > 0 && <span className="meta-neg"> · {neg} neglected</span>}
                    </span>
                  </div>
                  <span className="history-chevron">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="history-detail">
                    {CATEGORY_ORDER.map(cat => {
                      const areas = AREAS.filter(a => a.category === cat && entry.ratings?.[a.id]);
                      if (!areas.length) return null;
                      return (
                        <div key={cat} className="detail-cat">
                          <p className="detail-cat-label">{cat}</p>
                          {areas.map(a => (
                            <div key={a.id} className="detail-row">
                              <span className="detail-name">{a.name}</span>
                              <span className={`detail-state s-${entry.ratings[a.id]}`}>{entry.ratings[a.id]}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FreeTimeScreen({ onBack, onDone, neglectedIds }) {
  const pickArea = (excludeId = null) => {
    const pool = neglectedIds?.length
      ? AREAS.filter(a => neglectedIds.includes(a.id) && a.id !== excludeId)
      : [];
    const candidates = pool.length ? pool : AREAS.filter(a => a.id !== excludeId);
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const initialArea = pickArea();
  const [area, setArea] = useState(initialArea);
  const [action, setAction] = useState(() => getRandomAction(AREA_ACTIONS[initialArea.id]));
  const [phase, setPhase] = useState("action");
  const [visible, setVisible] = useState(true);
  const lastAction = useRef(action);

  const show = (fn) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 220);
  };

  const commit = () => show(() => setPhase("confirmed"));

  const somethingElse = () => {
    const actions = AREA_ACTIONS[area.id];
    const next = getRandomAction(actions, lastAction.current);
    if (next !== lastAction.current) {
      lastAction.current = next;
      show(() => setAction(next));
    } else {
      const nextArea = pickArea(area.id);
      const nextAction = getRandomAction(AREA_ACTIONS[nextArea.id]);
      lastAction.current = nextAction;
      show(() => { setArea(nextArea); setAction(nextAction); });
    }
  };

  return (
    <div className="screen freetime-screen">
      <button className="back-btn" onClick={onBack}>← back</button>
      <div className={`freetime-center ${visible ? "vis" : ""}`}>
        {phase === "action" && (
          <>
            <div className="freetime-area-label">
              <span className="freetime-category">{area.category}</span>
              <span className="freetime-name">{area.name}</span>
            </div>
            <p className="freetime-action">{action}</p>
            <div className="action-btns">
              <button className="abtn abtn-done" onClick={commit}>i'll do this</button>
              <button className="abtn abtn-skip" onClick={somethingElse}>something else</button>
            </div>
          </>
        )}
        {phase === "confirmed" && (
          <>
            <p className="confirmation">go do it.</p>
            <button className="abtn abtn-done" style={{maxWidth:"220px",width:"100%"}} onClick={onDone}>done</button>
          </>
        )}
      </div>
    </div>
  );
}

const AREA_DESCRIPTIONS = {
  physical:      "Your body is the substrate everything else runs on. Sleep, food, movement, and rest aren't nice-to-haves — they're the conditions under which everything else becomes possible or impossible. When this area is thin, almost everything else quietly gets harder.",
  stability:     "The structures that provide ground under your feet: housing, finances, routines, the boundaries you hold with others. Stability isn't about rigidity — it's about having enough predictability that you don't have to spend all your energy on basic uncertainty.",
  autonomy:      "Whether your life actually reflects your own priorities, values, and choices — not just what you're supposed to want. Time that feels like yours. The ability to say no, to do things your way, to live in accordance with what you actually believe. When this area is neglected, a quiet sense of wrongness tends to follow.",
  relationships: "The people in your life and the actual contact you have with them. Not just their existence in the background, but showing up, being shown up for, making plans and keeping them. Relationships require maintenance that's easy to defer indefinitely.",
  intimacy:      "Feeling genuinely known, not just liked. The conversations that go somewhere real. The people you can be honest with about what's actually going on. This is distinct from having relationships — you can be surrounded by people and still have none of it.",
  recognition:   "Feeling that what you do and who you are is seen and valued. This includes how others acknowledge you, but also how you acknowledge yourself. Chronic underrecognition — of your effort, your contributions, your presence — erodes things quietly over time.",
  learning:      "Ideas, questions, art, the pleasure of understanding something you didn't before. The part of you that wants to be surprised, to discover things, to follow a thread somewhere interesting. When this area goes quiet, life can start to feel flat in a way that's hard to name.",
  mastery:       "Developing real skill over time through sustained effort. The satisfaction of getting better at something that matters to you — not just doing it, but growing in your ability to do it well. Mastery requires a kind of practice that's distinct from mere repetition.",
  purpose:       "The sense that what you do connects to something beyond yourself — that your effort contributes to something, helps someone, builds something that matters. Hard to manufacture, hard to sustain artificially, but hard to feel whole without.",
  play:          "The parts of life that have no productive justification. Games, humor, silliness, physical play, goofing around for its own sake. Not everything needs to serve a purpose. When play disappears from a life, something important has gone missing even if it's hard to name.",
  creativity:    "Making things — music, writing, drawing, cooking, building, anything where you produce something that didn't exist before. This is distinct from consuming things, even things you love deeply. The act of making has a particular quality that receiving doesn't.",
  hope:          "Having a horizon. Plans, goals, things to look forward to — not optimism exactly, but the sense of moving toward something. When this area is thin, the present can start to feel heavier than it needs to.",
};

function AreasScreen({ onBack }) {
  return (
    <div className="screen info-screen">
      <div className="info-inner">
        <div className="stats-header">
          <button className="back-btn-inline" onClick={onBack}>← back</button>
          <h2 className="stats-title">the life areas</h2>
          <p className="stats-sub">twelve domains, one at a time</p>
        </div>
        {CATEGORY_ORDER.map(cat => (
          <div key={cat} className="info-section">
            <p className="section-label">{cat}</p>
            {AREAS.filter(a => a.category === cat).map(a => (
              <div key={a.id} className="area-entry">
                <p className="area-name">{a.name}</p>
                <p className="area-hint">{a.hint}</p>
                <p className="area-desc">{AREA_DESCRIPTIONS[a.id]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoScreen({ onBack, onAreas }) {
  return (
    <div className="screen info-screen">
      <div className="info-inner">
        <div className="stats-header">
          <button className="back-btn-inline" onClick={onBack}>← back</button>
          <h2 className="stats-title">how this works</h2>
        </div>

        <div className="info-section">
          <p className="section-label">the idea</p>
          <p className="info-p">
            This app is for getting unstuck. Not for planning, tracking habits, or optimizing your life — just for those moments when you're frozen, overwhelmed, or quietly drifting and need the smallest possible nudge back into motion.
          </p>
          <p className="info-p">
            There are no streaks, no overdue states, nothing that accumulates or judges. Coming back after weeks away feels exactly the same as day one. That's intentional.
          </p>
        </div>

        <div className="info-section">
          <p className="section-label">soft reset</p>
          <p className="info-p">
            Tap begin and you get one small action. If it doesn't fit, "not this one" always moves toward something simpler — never harder. There are four tiers, from small environmental shifts (open a window, change rooms) down to just breathing and being here.
          </p>
          <p className="info-p">
            You never have to do the suggested thing. The point is motion in some direction, not that specific direction.
          </p>
          <p className="info-p">
            After completing a couple of actions in a row, it may offer something slightly larger. You can take it or keep it small — either is fine.
          </p>
        </div>

        <div className="info-section">
          <p className="section-label">life areas</p>
          <p className="info-p">
            Twelve areas of life, one at a time. For each one you choose: thriving, okay, or neglected — or skip it entirely. There's no right answer and nothing to aim for.
          </p>
          <p className="info-p">
            The goal is just to notice. Sometimes things that have been quietly going hungry become visible when you name them.
          </p>
          <p className="info-p">
            What you mark as neglected gently shapes which Soft Reset suggestions you're more likely to see. This happens in the background — you don't need to think about it.
          </p>
          <button className="info-link-btn" onClick={onAreas}>see all twelve areas →</button>
        </div>

        <div className="info-section">
          <p className="section-label">what needs you</p>
          <p className="info-p">
            For when you have some time and want to know where to put it. The app picks one area of your life that's been going a little hungry and suggests something meaningful to do with the next thirty minutes or so.
          </p>
          <p className="info-p">
            It draws from your check-in history to find what's been neglected — if you haven't checked in yet, it picks something at random. Either way, it gives you a real suggestion, not a micro-action. Something worth an hour.
          </p>
          <p className="info-p">
            "Something else" cycles through different suggestions. If nothing fits, go back — it's not trying to corner you.
          </p>
        </div>

        <div className="info-section">
          <p className="section-label">a note</p>
          <p className="info-p">
            Use this when it helps and ignore it when it doesn't. There's no correct frequency. Once a week, once a month, or just when you're stuck — all of those are fine.
          </p>
          <p className="info-p">
            The app doesn't know how you're doing. Only you do.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

function MyActionsScreen({ onBack, customActions, onAdd, onDelete, onImport }) {
  const [text, setText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText.trim());
      if (!Array.isArray(parsed)) throw new Error("expected a JSON array");
      const valid = parsed.filter(a => a && typeof a.text === "string" && a.text.trim());
      if (!valid.length) throw new Error("no valid actions found");
      onImport(valid);
      setImportText("");
      setShowImport(false);
      setFeedback({ ok: true, msg: `imported ${valid.length} action${valid.length !== 1 ? "s" : ""}` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ ok: false, msg: e.message || "invalid JSON" });
    }
  };

  return (
    <div className="screen myactions-screen">
      <div className="myactions-inner">
        <div className="stats-header">
          <button className="back-btn-inline" onClick={onBack}>← back</button>
          <h2 className="stats-title">my actions</h2>
          <p className="stats-sub">added to your soft reset suggestions</p>
        </div>
        <div className="myactions-add">
          <input
            className="myactions-input"
            type="text"
            placeholder="type an action..."
            value={text}
            maxLength={80}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <button className="myactions-add-btn" onClick={handleAdd} disabled={!text.trim()}>
            add
          </button>
        </div>

        <div className="import-section">
          <div className="import-row">
            <button
              className="import-toggle"
              onClick={() => { setShowImport(v => !v); setFeedback(null); }}
            >
              {showImport ? "cancel" : "import JSON"}
            </button>
            {feedback && (
              <span className={`import-feedback ${feedback.ok ? "import-ok" : "import-err"}`}>
                {feedback.msg}
              </span>
            )}
          </div>
          {showImport && (
            <div className="import-body">
              <p className="import-hint">array of objects with text, tier (1–4), and domains</p>
              <textarea
                className="import-textarea"
                value={importText}
                onChange={e => { setImportText(e.target.value); setFeedback(null); }}
                placeholder={'[{"text": "pick up the guitar", "tier": 2, "domains": ["creativity", "play"]}]'}
                rows={7}
                spellCheck={false}
              />
              <button
                className="myactions-add-btn"
                onClick={handleImport}
                disabled={!importText.trim()}
              >
                import
              </button>
            </div>
          )}
        </div>

        {customActions.length === 0 && !showImport && (
          <p className="empty-state">no custom actions yet. they'll mix into soft reset once added.</p>
        )}
        <div className="myactions-list">
          {customActions.map(a => (
            <div key={a.id} className="myactions-row">
              <span className="myactions-text">{a.text}</span>
              <button className="myactions-delete" onClick={() => onDelete(a.id)} aria-label="delete">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState([]);
  const [pendingRatings, setPendingRatings] = useState(null);
  const [tendToAreaId, setTendToAreaId] = useState(null);
  const [tendToOrigin, setTendToOrigin] = useState("summary");
  const [customActions, setCustomActions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(
    !document.documentElement.classList.contains("theme-light")
  );

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(`theme-${next}`);
    try { localStorage.setItem("life-app-theme", next); } catch (e) {}
    setIsDark(!isDark);
  };

  useEffect(() => {
    loadHistory().then(h => { setHistory(h); setLoaded(true); });
    setCustomActions(loadCustomActions());
  }, []);

  const handleAddCustomAction = (text) => {
    const updated = [...customActions, { id: Date.now(), text, tier: 3, domains: [] }];
    setCustomActions(updated);
    saveCustomActions(updated);
  };

  const handleImportCustomActions = (items) => {
    const newItems = items.map(a => ({
      id: Date.now() + Math.random(),
      text: String(a.text).trim(),
      tier: Number.isInteger(a.tier) && a.tier >= 1 && a.tier <= 4 ? a.tier : 3,
      domains: Array.isArray(a.domains) ? a.domains : [],
    }));
    const updated = [...customActions, ...newItems];
    setCustomActions(updated);
    saveCustomActions(updated);
  };

  const handleDeleteCustomAction = (id) => {
    const updated = customActions.filter(a => a.id !== id);
    setCustomActions(updated);
    saveCustomActions(updated);
  };

  const neglectedIds = getNeglectedFromHistory(history);
  const trends = getTrends(history);
  const previousRatings = history[1]?.ratings ?? null;

  const handleCheckinComplete = async (ratings) => {
    setPendingRatings(ratings);
    const entry = { ts: Date.now(), ratings };
    const updated = await saveCheckin(entry);
    setHistory(updated);
    setScreen("summary");
  };

  if (!loaded) return (
    <div className="loading-screen">
      <span className="loading-text">loading</span>
    </div>
  );

  return (

    <div className="app">
        {screen === "home" && (
          <HomeScreen
            onSoftReset={() => setScreen("reset")}
            onCheckin={() => setScreen("checkin")}
            onFreeTime={() => setScreen("freetime")}
            onStats={() => setScreen("stats")}
            onMyActions={() => setScreen("myactions")}
            onInfo={() => setScreen("info")}
            history={history}
            trends={trends}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        )}
        {screen === "reset" && (
          <SoftResetScreen onBack={() => setScreen("home")} neglectedIds={neglectedIds} customActions={customActions} />
        )}
        {screen === "checkin" && (
          <CheckinScreen onBack={() => setScreen("home")} onComplete={handleCheckinComplete} />
        )}
        {screen === "summary" && (
          <SummaryScreen
            ratings={pendingRatings}
            previousRatings={previousRatings}
            onDone={() => setScreen("home")}
            onRetake={() => { setPendingRatings(null); setScreen("checkin"); }}
            onSoftReset={() => setScreen("reset")}
            onTendTo={(areaId) => { setTendToAreaId(areaId); setTendToOrigin("summary"); setScreen("tendto"); }}
          />
        )}
        {screen === "tendto" && (
          <TendToScreen
            areaId={tendToAreaId}
            onBack={() => setScreen(tendToOrigin)}
            onDone={() => setScreen("home")}
          />
        )}
        {screen === "stats" && (
          <StatsScreen
            onBack={() => setScreen("home")}
            history={history}
            onTendTo={(areaId) => { setTendToAreaId(areaId); setTendToOrigin("stats"); setScreen("tendto"); }}
          />
        )}
        {screen === "myactions" && (
          <MyActionsScreen
            onBack={() => setScreen("home")}
            customActions={customActions}
            onAdd={handleAddCustomAction}
            onImport={handleImportCustomActions}
            onDelete={handleDeleteCustomAction}
          />
        )}
        {screen === "freetime" && (
          <FreeTimeScreen
            onBack={() => setScreen("home")}
            onDone={() => setScreen("home")}
            neglectedIds={neglectedIds}
          />
        )}
        {screen === "info" && (
          <InfoScreen onBack={() => setScreen("home")} onAreas={() => setScreen("areas")} />
        )}
        {screen === "areas" && (
          <AreasScreen onBack={() => setScreen("info")} />
        )}
    </div>
  );
}
