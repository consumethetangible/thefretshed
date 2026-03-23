// ═══════════════════════════════════════════
// progress.js — DynamoDB progress read/write
// All persistent progress data goes through here.
// localStorage is used only for UI prefs (theme, Spotify).
// ═══════════════════════════════════════════

const PROGRESS_API = 'https://aa9wj04mof.execute-api.us-east-1.amazonaws.com';

// ─── Auth ────────────────────────────────────────────────────────────────────

function getUserId() {
  return sessionStorage.getItem('ngc-user-id');
}

function requireUserId() {
  const userId = getUserId();
  if (!userId) {
    window.location.href = '/login.html';
    throw new Error('Not logged in');
  }
  return userId;
}

// ─── Core API ────────────────────────────────────────────────────────────────

async function progressGet(sk) {
  const userId = requireUserId();
  const res = await fetch(`${PROGRESS_API}/progress?userId=${encodeURIComponent(userId)}&sk=${encodeURIComponent(sk)}`);
  if (!res.ok) throw new Error('Progress GET failed: ' + res.status);
  const { item } = await res.json();
  return item; // null if not found
}

async function progressPut(sk, data) {
  const userId = requireUserId();
  const res = await fetch(`${PROGRESS_API}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, sk, ...data }),
  });
  if (!res.ok) throw new Error('Progress PUT failed: ' + res.status);
  return res.json();
}

async function progressList(skPrefix) {
  const userId = requireUserId();
  const res = await fetch(`${PROGRESS_API}/progress/list?userId=${encodeURIComponent(userId)}&skPrefix=${encodeURIComponent(skPrefix)}`);
  if (!res.ok) throw new Error('Progress LIST failed: ' + res.status);
  const { items } = await res.json();
  return items; // []
}

// ─── Session ─────────────────────────────────────────────────────────────────

// Save today's session record
// blocksCompleted: array of block identifiers e.g. ['warmup', 'technique', 'song-paranoid']
async function saveSession(blocksCompleted, notes = '') {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return progressPut(`SESSION#${date}`, { blocksCompleted, notes, date });
}

// Load a specific day's session
async function loadSession(date) {
  return progressGet(`SESSION#${date}`);
}

// Load all sessions (for streak + heatmap)
async function loadAllSessions() {
  return progressList('SESSION#');
}

// ─── Position ────────────────────────────────────────────────────────────────

async function savePosition(week, phase) {
  return progressPut('POSITION', { week, phase });
}

async function loadPosition() {
  const pos = await progressGet('POSITION');
  return pos || { week: 1, phase: 1 };
}

// ─── Song Status ─────────────────────────────────────────────────────────────

async function saveSongStatus(title, status) {
  return progressPut(`SONG#${title}`, { status, title });
}

async function loadSongStatus(title) {
  const record = await progressGet(`SONG#${title}`);
  return record ? record.status : 'ns';
}

async function loadAllSongStatuses() {
  const items = await progressList('SONG#');
  const map = {};
  items.forEach(item => { map[item.title] = item.status; });
  return map;
}

// ─── Book Progress ───────────────────────────────────────────────────────────

// Pure helper — builds the DynamoDB SK for a book completion record.
// Exported for testing (#61). bookKey: e.g. 'cbg', label: ref label string.
function buildBookSk(bookKey, label) {
  return `BOOK#${bookKey}#${label}`;
}

// Save or clear a single chapter completion.
// Uses the ref label as the chapter key for human-readable records.
async function saveBookChapter(bookKey, chapter, completed = true) {
  return progressPut(buildBookSk(bookKey, chapter), { bookKey, chapter, completed });
}

async function loadBookProgress(bookKey) {
  const items = await progressList(`BOOK#${bookKey}#`);
  const completed = {};
  items.forEach(item => { completed[item.chapter] = item.completed; });
  return completed;
}

// Load all book completions across all book keys.
// Returns a Set of "bookKey|label" strings for O(1) lookup in the modal.
async function loadAllBookCompletions() {
  const items = await progressList('BOOK#');
  const done = new Set();
  items.forEach(item => {
    if (item.completed) done.add(`${item.bookKey}|${item.chapter}`);
  });
  return done;
}

// ─── Milestones ──────────────────────────────────────────────────────────────

async function saveMilestone(id, completed = true) {
  return progressPut(`MILESTONE#${id}`, { id, completed });
}

async function loadAllMilestones() {
  const items = await progressList('MILESTONE#');
  const map = {};
  items.forEach(item => { map[item.id] = item.completed; });
  return map;
}

// ─── Streak (derived from session records) ───────────────────────────────────

async function calcStreakFromBackend() {
  const sessions = await loadAllSessions();
  if (!sessions.length) return { current: 0, longest: 0, practiceDays: [] };

  const days = sessions.map(s => s.date).sort();
  const practiceDays = [...new Set(days)];

  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let cursor = today;

  for (let i = practiceDays.length - 1; i >= 0; i--) {
    if (practiceDays[i] === cursor) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    } else {
      break;
    }
  }
  current = streak;

  // longest streak
  streak = 1;
  for (let i = 1; i < practiceDays.length; i++) {
    const prev = new Date(practiceDays[i - 1]);
    const curr = new Date(practiceDays[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }
  longest = Math.max(longest, current);

  return { current, longest, practiceDays };
}

// ─── Notes ───────────────────────────────────────────────────────────────────

async function saveNotes(notes) {
  const date = new Date().toISOString().slice(0, 10);
  return progressPut(`SESSION#${date}`, { notes, date });
}

async function loadTodayNotes() {
  const date = new Date().toISOString().slice(0, 10);
  const session = await loadSession(date);
  return session ? (session.notes || '') : '';
}
