import { useState, useEffect, useRef } from "react";

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
  ],
  4: [
    { text: "sit still for a moment",             domains: ["physical","autonomy"] },
    { text: "notice three things in the room",    domains: ["learning","physical"] },
    { text: "feel your feet on the ground",       domains: ["physical","stability"] },
    { text: "take one breath",                    domains: ["physical","autonomy"] },
    { text: "let your shoulders drop",            domains: ["physical","stability"] },
    { text: "just be here",                       domains: ["autonomy","purpose"] },
    { text: "let your jaw unclench",              domains: ["physical","autonomy"] },
    { text: "close one open tab or app",          domains: ["stability","autonomy"] },
    { text: "give yourself credit for being here", domains: ["recognition","autonomy"] },
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

const CONFIRMATIONS = ["good.","that counts.","that's enough.","you moved.","okay.","done.","that's real."];

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

function getWeightedAction(tier, neglectedIds, excludeText = null) {
  const pool = ACTIONS[tier] || ACTIONS[4];
  const filtered = excludeText ? pool.filter(a => a.text !== excludeText) : pool;
  if (!neglectedIds || neglectedIds.length === 0) return getRandom(filtered);
  const weighted = [];
  filtered.forEach(a => {
    const overlap = a.domains.filter(d => neglectedIds.includes(d)).length;
    const weight = overlap > 0 ? 3 : 1;
    for (let i = 0; i < weight; i++) weighted.push(a);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function getRandomAction(arr, excludeText = null) {
  const filtered = excludeText ? arr.filter(s => s !== excludeText) : arr;
  if (!filtered.length) return arr[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
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

function HomeScreen({ onSoftReset, onCheckin, onStats, history, trends }) {
  const lastCheckin = history[0];
  return (
    <div className="screen home-screen">
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

function SoftResetScreen({ onBack, neglectedIds }) {
  const [phase, setPhase] = useState("idle");
  const [tier, setTier] = useState(1);
  const [action, setAction] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(true);
  const lastText = useRef(null);

  const show = (fn) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 220);
  };

  const start = () => {
    const a = getWeightedAction(1, neglectedIds);
    lastText.current = a.text;
    show(() => { setTier(1); setAction(a); setPhase("action"); });
  };
  const done = () => {
    setConfirmation(CONFIRMATIONS[Math.floor(Math.random() * CONFIRMATIONS.length)]);
    show(() => setPhase("done"));
  };
  const notThis = () => {
    const next = Math.min(tier + 1, 4);
    const a = getWeightedAction(next, neglectedIds, lastText.current);
    lastText.current = a.text;
    show(() => { setTier(next); setAction(a); });
  };
  const reset = () => show(() => { setPhase("idle"); setTier(1); setAction(null); });

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
            <p className="action-text">{action?.text}</p>
            <div className="action-btns">
              <button className="abtn abtn-done" onClick={done}>done</button>
              <button className="abtn abtn-skip" onClick={notThis}>not this one</button>
            </div>
          </>
        )}
        {phase === "done" && (
          <>
            <p className="confirmation">{confirmation}</p>
            <button className="text-btn" onClick={reset}>again</button>
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
  const progress = (index / AREAS.length) * 100;

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

function StatsScreen({ onBack, history }) {
  const [expanded, setExpanded] = useState(null);
  const areaMap = getAreaMap(history);

  const toggle = (ts) => setExpanded(e => e === ts ? null : ts);

  // For the map: color each cell by dominant state
  const cellColor = (id) => {
    const d = dominantState(areaMap[id]);
    if (d === "thriving")  return "#0e1f0c";
    if (d === "neglected") return "#1f0e0a";
    if (d === "okay")      return "#161614";
    return "#0f0f0d";
  };
  const cellBorder = (id) => {
    const d = dominantState(areaMap[id]);
    if (d === "thriving")  return "#2a4a26";
    if (d === "neglected") return "#4a2a1e";
    if (d === "okay")      return "#2e2e2a";
    return "#1a1a18";
  };
  const cellText = (id) => {
    const d = dominantState(areaMap[id]);
    if (d === "thriving")  return "#5a8a50";
    if (d === "neglected") return "#8a5040";
    if (d === "okay")      return "#5a5a52";
    return "#3a3a36";
  };

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
              <div
                key={a.id}
                className="map-cell"
                style={{
                  background: cellColor(a.id),
                  border: `1px solid ${cellBorder(a.id)}`,
                  color: cellText(a.id),
                }}
              >
                <span className="map-cell-name">{a.name}</span>
                {areaMap[a.id].total > 0 && (
                  <span className="map-cell-state">{dominantState(areaMap[a.id])}</span>
                )}
              </div>
            ))}
          </div>
          <div className="map-legend">
            <span className="legend-item thriving">■ thriving</span>
            <span className="legend-item okay">■ okay</span>
            <span className="legend-item neglected">■ neglected</span>
            <span className="legend-item none">■ no data</span>
          </div>
        </div>

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

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState([]);
  const [pendingRatings, setPendingRatings] = useState(null);
  const [tendToAreaId, setTendToAreaId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadHistory().then(h => { setHistory(h); setLoaded(true); });
  }, []);

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
    <div style={{ minHeight:"100vh", background:"#0c0c0b", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontFamily:"monospace", fontSize:11, color:"#3a3a36", letterSpacing:"0.1em" }}>loading</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0c0b; }

        .app { min-height: 100vh; background: #0c0c0b; color: #e8e3db; font-family: 'Geist Mono', monospace; font-weight: 300; }

        .screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; animation: fadeUp 0.4s ease both; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        /* HOME */
        .home-screen { justify-content: center; padding: 2rem; gap: 0; }
        .home-top { text-align: center; margin-bottom: 3rem; }
        .greeting { font-family: 'Instrument Serif', serif; font-style: italic; font-size: clamp(28px,6vw,40px); color: #e8e3db; margin-bottom: 0.4rem; }
        .last-checkin { font-size: 10px; color: #7a7a72; letter-spacing: 0.1em; }

        .doors { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 480px; margin-bottom: 1.25rem; }
        .door { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 1.5rem; background: none; border: 1px solid #2a2a28; border-radius: 4px; cursor: pointer; text-align: left; transition: border-color 0.2s, background 0.2s; }
        .door:hover { border-color: #5a5a52; background: #111110; }
        .door-eyebrow { font-size: 9px; letter-spacing: 0.18em; color: #7a7a72; text-transform: uppercase; }
        .door-title { font-family: 'Instrument Serif', serif; font-size: 22px; color: #e8e3db; line-height: 1.2; }
        .door-sub { font-size: 10px; color: #8a8a80; line-height: 1.7; letter-spacing: 0.03em; }
        .door-reset:hover .door-title { color: #c8bfb0; }
        .door-checkin:hover .door-title { color: #a0b89a; }

        .stats-link { font-family: 'Geist Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: #7a7a72; background: none; border: none; cursor: pointer; padding: 6px 0; margin-bottom: 1.5rem; transition: color 0.2s; font-weight: 300; }
        .stats-link:hover { color: #b0b0a8; }

        .trends { width: 100%; max-width: 480px; border-top: 1px solid #222220; padding-top: 1.5rem; }
        .trends-label { font-size: 9px; letter-spacing: 0.16em; color: #686860; text-transform: uppercase; margin-bottom: 1rem; }
        .trends-list { display: flex; flex-direction: column; gap: 2px; }
        .trend-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
        .trend-name { font-size: 11px; color: #9a9a90; letter-spacing: 0.04em; }
        .trend-state { font-size: 10px; letter-spacing: 0.08em; }
        .trend-state.neglected { color: #c07868; }
        .trend-state.thriving  { color: #7aaa6a; }

        .onboarding { width: 100%; max-width: 480px; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.9rem; }
        .onboarding-line { font-size: 10px; color: #7a7a72; letter-spacing: 0.04em; line-height: 1.8; }
        .onboarding-label { color: #a0a096; margin-right: 0.5em; }

        /* SOFT RESET */
        .reset-screen { justify-content: center; padding: 2rem; position: relative; }
        .back-btn { position: absolute; top: 1.5rem; left: 1.75rem; font-family: 'Geist Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: #7a7a72; background: none; border: none; cursor: pointer; padding: 4px 0; transition: color 0.2s; font-weight: 300; }
        .back-btn:hover { color: #b0b0a8; }
        .reset-center { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 400px; opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease, transform 0.25s ease; }
        .reset-center.vis { opacity: 1; transform: translateY(0); }
        .reset-tagline { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 18px; color: #9a9a90; text-align: center; margin-bottom: 2.5rem; line-height: 1.6; }
        .big-circle { width: 96px; height: 96px; border-radius: 50%; border: 1px solid #3a3a36; background: none; font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 300; color: #a0a096; letter-spacing: 0.08em; cursor: pointer; transition: border-color 0.2s, color 0.2s, transform 0.15s; }
        .big-circle:hover { border-color: #8a8a80; color: #e8e3db; transform: scale(1.04); }
        .tier-dots { display: flex; gap: 6px; margin-bottom: 2rem; }
        .tdot { width: 5px; height: 5px; border-radius: 50%; background: #2a2a28; transition: background 0.3s; }
        .tdot.on { background: #8a8a80; }
        .action-text { font-family: 'Instrument Serif', serif; font-size: clamp(26px,5vw,38px); color: #e8e3db; text-align: center; line-height: 1.3; margin-bottom: 3rem; }
        .action-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 220px; }
        .abtn { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 300; letter-spacing: 0.1em; border-radius: 2px; padding: 13px 0; cursor: pointer; transition: all 0.18s; width: 100%; }
        .abtn-done { background: none; border: 1px solid #3a3a36; color: #b0b0a4; }
        .abtn-done:hover { border-color: #8a8a80; color: #e8e3db; background: #111110; }
        .abtn-skip { background: none; border: 1px solid transparent; color: #7a7a72; }
        .abtn-skip:hover { color: #b0b0a8; border-color: #3a3a36; }
        .confirmation { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 38px; color: #a0a096; text-align: center; margin-bottom: 2rem; }
        .text-btn { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 300; letter-spacing: 0.12em; color: #7a7a72; background: none; border: none; cursor: pointer; padding: 8px 0; transition: color 0.2s; }
        .text-btn:hover { color: #b0b0a8; }

        /* CHECK-IN */
        .checkin-screen { padding: 0; justify-content: flex-start; }
        .checkin-top { width: 100%; padding: 1.25rem 1.75rem 0; display: flex; align-items: center; gap: 12px; }
        .back-btn-inline { font-family: 'Geist Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: #7a7a72; background: none; border: none; cursor: pointer; padding: 0; transition: color 0.2s; font-weight: 300; white-space: nowrap; }
        .back-btn-inline:hover { color: #b0b0a8; }
        .progress-track { flex: 1; height: 1px; background: #2a2a28; }
        .progress-fill { height: 100%; background: #7a7a72; transition: width 0.3s ease; }
        .progress-label { font-size: 10px; color: #7a7a72; letter-spacing: 0.08em; white-space: nowrap; }
        .card-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; width: 100%; max-width: 480px; margin: 0 auto; opacity: 0; transform: translateY(8px); transition: opacity 0.22s ease, transform 0.22s ease; }
        .card-center.vis { opacity: 1; transform: translateY(0); }
        .card-category { font-size: 9px; letter-spacing: 0.2em; color: #7a7a72; text-transform: uppercase; margin-bottom: 2rem; }
        .card-name { font-family: 'Instrument Serif', serif; font-size: clamp(30px,6vw,44px); font-weight: 400; color: #e8e3db; text-align: center; line-height: 1.2; margin-bottom: 0.75rem; }
        .card-hint { font-size: 11px; color: #7a7a72; text-align: center; letter-spacing: 0.04em; line-height: 1.7; margin-bottom: 3rem; }
        .rating-row { display: flex; gap: 8px; margin-bottom: 1.25rem; flex-wrap: wrap; justify-content: center; }
        .rbtn { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 300; letter-spacing: 0.1em; padding: 11px 18px; border-radius: 2px; border: 1px solid #3a3a36; background: none; color: #9a9a90; cursor: pointer; transition: all 0.18s; }
        .rbtn-thriving:hover  { border-color: #5a8050; color: #a0c898; background: #0e1a0c; }
        .rbtn-okay:hover      { border-color: #6a6a60; color: #c8c3b8; background: #111110; }
        .rbtn-neglected:hover { border-color: #8a5a46; color: #c8987a; background: #1a0e0a; }
        .skip-btn { margin-top: 0.5rem; }

        /* SUMMARY */
        .summary-screen { justify-content: flex-start; padding: 0; }
        .summary-inner { width: 100%; max-width: 520px; padding: 4rem 2rem 4rem; margin: 0 auto; }
        .summary-head { margin-bottom: 2.5rem; }
        .summary-insight { font-family: 'Instrument Serif', serif; font-style: italic; font-size: clamp(20px,4vw,26px); color: #a0a096; line-height: 1.4; margin-bottom: 0.4rem; }
        .summary-date { font-size: 10px; color: #686860; letter-spacing: 0.1em; }
        .sum-cat { margin-bottom: 1.75rem; }
        .sum-cat-label { font-size: 9px; letter-spacing: 0.18em; color: #686860; text-transform: uppercase; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #222220; }
        .sum-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #1e1e1c; }
        .sum-row:last-child { border-bottom: none; }
        .sum-name { font-size: 11px; color: #9a9a90; letter-spacing: 0.03em; }
        .sum-state { font-size: 10px; letter-spacing: 0.08em; }
        .s-thriving  { color: #7aaa6a; }
        .s-okay      { color: #9a9a90; }
        .s-neglected { color: #c07060; }
        .s-skip      { color: #555550; }
        .sum-bridge { padding: 2rem 0 0; }
        .sum-bridge-btn { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 300; letter-spacing: 0.12em; color: #8a8a80; background: none; border: none; cursor: pointer; padding: 0; transition: color 0.2s; }
        .sum-bridge-btn:hover { color: #c8b89a; }
        .sum-actions { display: flex; gap: 12px; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #222220; }

        /* TEND TO */
        .tendto-screen { justify-content: flex-start; padding: 0; position: relative; }
        .tendto-area-label { display: flex; flex-direction: column; align-items: center; padding: 3.5rem 2rem 0; gap: 4px; }
        .tendto-category { font-size: 9px; letter-spacing: 0.2em; color: #7a7a72; text-transform: uppercase; }
        .tendto-name { font-family: 'Instrument Serif', serif; font-size: clamp(22px,4.5vw,30px); color: #c8bfb0; }
        .tendto-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 2rem 4rem; width: 100%; max-width: 480px; margin: 0 auto; opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease, transform 0.25s ease; }
        .tendto-center.vis { opacity: 1; transform: translateY(0); }
        .tendto-action { font-family: 'Instrument Serif', serif; font-size: clamp(18px,3.5vw,24px); color: #e8e3db; text-align: center; line-height: 1.6; margin-bottom: 2.5rem; }
        .tendto-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 240px; margin-bottom: 1.25rem; }
        .tendto-confirmation { font-family: 'Instrument Serif', serif; font-style: italic; font-size: clamp(20px,4vw,28px); color: #9a9a90; text-align: center; line-height: 1.5; margin-bottom: 2rem; }
        .tendto-done-btn { width: 100%; max-width: 240px; }

        /* SUMMARY — tappable neglected rows + progress indicators */
        .sum-row-tap { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #1e1e1c; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; text-align: left; transition: background 0.15s; }
        .sum-row-tap:last-child { border-bottom: none; }
        .sum-row-tap:hover { background: #13100f; }
        .sum-row-tap:hover .sum-name { color: #c8b8b0; }
        .sum-row-tap:hover .sum-row-arrow { opacity: 1; }
        .sum-row-right { display: flex; align-items: center; gap: 6px; }
        .sum-row-arrow { font-size: 10px; color: #8a6a5a; opacity: 0.4; transition: opacity 0.15s; }
        .sum-change { font-size: 10px; font-family: 'Geist Mono', monospace; font-weight: 300; }
        .sum-change-up   { color: #7aaa6a; }
        .sum-change-down { color: #c07060; }

        /* STATS */
        .stats-screen { justify-content: flex-start; padding: 0; }
        .stats-inner { width: 100%; max-width: 560px; padding: 2rem; margin: 0 auto; }
        .stats-header { margin-bottom: 2.5rem; }
        .stats-title { font-family: 'Instrument Serif', serif; font-size: 28px; font-weight: 400; color: #e8e3db; margin: 0.75rem 0 0.25rem; }
        .stats-sub { font-size: 10px; color: #7a7a72; letter-spacing: 0.1em; }

        .section-label { font-size: 9px; letter-spacing: 0.2em; color: #7a7a72; text-transform: uppercase; margin-bottom: 0.4rem; }
        .section-caption { font-size: 10px; color: #686860; letter-spacing: 0.04em; margin-bottom: 1.25rem; }

        .map-section { margin-bottom: 3rem; }
        .area-map { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; margin-bottom: 1rem; }
        .map-cell { padding: 10px 12px; border-radius: 3px; display: flex; flex-direction: column; gap: 3px; }
        .map-cell-name { font-size: 11px; letter-spacing: 0.03em; line-height: 1.3; }
        .map-cell-state { font-size: 9px; letter-spacing: 0.1em; opacity: 0.7; }

        .map-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .legend-item { font-size: 9px; letter-spacing: 0.1em; }
        .legend-item.thriving  { color: #7aaa6a; }
        .legend-item.okay      { color: #7a7a72; }
        .legend-item.neglected { color: #c07060; }
        .legend-item.none      { color: #555550; }

        .history-section { border-top: 1px solid #222220; padding-top: 1.75rem; }
        .empty-state { font-size: 11px; color: #7a7a72; letter-spacing: 0.04em; padding: 1rem 0; }

        .history-entry { border-bottom: 1px solid #1e1e1c; }
        .history-entry:last-child { border-bottom: none; }

        .history-row { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 14px 0; background: none; border: none; cursor: pointer; text-align: left; transition: opacity 0.15s; }
        .history-row:hover { opacity: 0.75; }

        .history-left { display: flex; flex-direction: column; gap: 3px; }
        .history-date { font-size: 12px; color: #b0b0a4; letter-spacing: 0.04em; }
        .history-meta { font-size: 10px; color: #7a7a72; letter-spacing: 0.06em; }
        .meta-thr { color: #7aaa6a; }
        .meta-neg { color: #c07060; }
        .history-chevron { font-size: 16px; color: #7a7a72; font-weight: 300; line-height: 1; }

        .history-detail { padding: 0 0 1rem; }
        .detail-cat { margin-bottom: 1rem; }
        .detail-cat-label { font-size: 9px; letter-spacing: 0.16em; color: #686860; text-transform: uppercase; margin-bottom: 0.4rem; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #1a1a18; }
        .detail-row:last-child { border-bottom: none; }
        .detail-name { font-size: 11px; color: #8a8a80; letter-spacing: 0.03em; }
        .detail-state { font-size: 10px; letter-spacing: 0.08em; }
      `}</style>

      <div className="app">
        {screen === "home" && (
          <HomeScreen
            onSoftReset={() => setScreen("reset")}
            onCheckin={() => setScreen("checkin")}
            onStats={() => setScreen("stats")}
            history={history}
            trends={trends}
          />
        )}
        {screen === "reset" && (
          <SoftResetScreen onBack={() => setScreen("home")} neglectedIds={neglectedIds} />
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
            onTendTo={(areaId) => { setTendToAreaId(areaId); setScreen("tendto"); }}
          />
        )}
        {screen === "tendto" && (
          <TendToScreen
            areaId={tendToAreaId}
            onBack={() => setScreen("summary")}
            onDone={() => setScreen("home")}
          />
        )}
        {screen === "stats" && (
          <StatsScreen onBack={() => setScreen("home")} history={history} />
        )}
      </div>
    </>
  );
}
