// ═══════════════════════════════════════════════════════════════════════
// test-song-status-sync.mjs
// Diagnostic script for Fret Shed song status sync (DynamoDB ↔ UI)
//
// Tests all save/load scenarios against the live API.
// Run from any machine with a valid userId.
//
// Usage:
//   node scripts/test-song-status-sync.mjs <userId>
// ═══════════════════════════════════════════════════════════════════════

const PROGRESS_API = 'https://aa9wj04mof.execute-api.us-east-1.amazonaws.com';
const TEST_SONG = '__test-song-sync-diagnostic__';
const userId = process.argv[2];

if (!userId) {
  console.error('Usage: node scripts/test-song-status-sync.mjs <userId>');
  process.exit(1);
}

const g = s => `\x1b[32m✓ ${s}\x1b[0m`;
const r = s => `\x1b[31m✗ ${s}\x1b[0m`;
const y = s => `\x1b[33m⚠ ${s}\x1b[0m`;
const b = s => `\x1b[34m» ${s}\x1b[0m`;
const h = s => `\x1b[1m\n${'═'.repeat(60)}\n  ${s}\n${'═'.repeat(60)}\x1b[0m`;

let passed = 0, failed = 0, warnings = 0;
function pass(msg)  { console.log(g(msg)); passed++; }
function fail(msg)  { console.log(r(msg)); failed++; }
function warn(msg)  { console.log(y(msg)); warnings++; }
function info(msg)  { console.log(b(msg)); }

async function progressGet(sk) {
  const res = await fetch(`${PROGRESS_API}/progress?userId=${encodeURIComponent(userId)}&sk=${encodeURIComponent(sk)}`);
  if (!res.ok) throw new Error(`GET ${sk} → HTTP ${res.status}`);
  const { item } = await res.json();
  return item;
}

async function progressPut(sk, data) {
  const res = await fetch(`${PROGRESS_API}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, sk, ...data }),
  });
  if (!res.ok) throw new Error(`PUT ${sk} → HTTP ${res.status}`);
  return res.json();
}

async function progressList(skPrefix) {
  const res = await fetch(`${PROGRESS_API}/progress/list?userId=${encodeURIComponent(userId)}&skPrefix=${encodeURIComponent(skPrefix)}`);
  if (!res.ok) throw new Error(`LIST ${skPrefix} → HTTP ${res.status}`);
  const { items } = await res.json();
  return items;
}

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

async function test_api_reachable() {
  console.log(h('1. API Reachability'));
  info(`userId: ${userId}`);
  try {
    const item = await progressGet('POSITION');
    pass('API reachable');
    if (item) info(`  POSITION: week=${item.week}, phase=${item.phase}`);
    else warn('No POSITION record — is this the right userId?');
    return true;
  } catch (e) {
    fail(`API unreachable: ${e.message}`);
    return false;
  }
}

async function test_save_and_read_back() {
  console.log(h('2. Save → Immediate Read-back'));
  for (const status of ['ip', 'lrn', 'itf', 'ns']) {
    try {
      await saveSongStatus(TEST_SONG, status);
      const readBack = await loadSongStatus(TEST_SONG);
      readBack === status ? pass(`Write '${status}' → read back '${readBack}'`) : fail(`Write '${status}' → got '${readBack}'`);
    } catch (e) { fail(`status='${status}' → ${e.message}`); }
  }
}

async function test_list_includes_saved() {
  console.log(h('3. loadAllSongStatuses() includes saved song'));
  try {
    await saveSongStatus(TEST_SONG, 'lrn');
    const all = await loadAllSongStatuses();
    if (all[TEST_SONG] === 'lrn') pass('TEST_SONG in map with correct status');
    else if (TEST_SONG in all) fail(`Wrong status: expected 'lrn', got '${all[TEST_SONG]}'`);
    else fail('TEST_SONG not found in loadAllSongStatuses()');
    info(`  Total songs in DynamoDB: ${Object.keys(all).length}`);
  } catch (e) { fail(`loadAllSongStatuses error: ${e.message}`); }
}

async function test_real_songs() {
  console.log(h('4. Real Song Records in DynamoDB'));
  try {
    const all = await loadAllSongStatuses();
    const songs = Object.entries(all).filter(([k]) => k !== TEST_SONG);
    if (songs.length === 0) {
      warn('No real song records found — UI may not be writing to DynamoDB yet');
    } else {
      pass(`Found ${songs.length} song record(s)`);
      songs.forEach(([title, status]) => info(`  "${title}" → ${status}`));
    }
  } catch (e) { fail(`Error: ${e.message}`); }
}

async function test_special_chars() {
  console.log(h('5. Song Titles with Special Characters'));
  const titles = ["Wish You Were Here", "Jimi's Blues", "Rock & Roll", "Back In Black"];
  for (const title of titles) {
    try {
      await saveSongStatus(title, 'ip');
      const readBack = await loadSongStatus(title);
      readBack === 'ip' ? pass(`"${title}" round-trip OK`) : fail(`"${title}" → expected 'ip', got '${readBack}'`);
    } catch (e) { fail(`"${title}" → ${e.message}`); }
  }
  for (const title of titles) { try { await saveSongStatus(title, 'ns'); } catch {} }
}

async function cleanup() {
  console.log(h('Cleanup'));
  try { await saveSongStatus(TEST_SONG, 'ns'); pass('Test record reset'); }
  catch (e) { warn(`Cleanup failed: ${e.message}`); }
}

async function run() {
  console.log('\x1b[1m\nFret Shed — Song Status Sync Diagnostic\x1b[0m');
  console.log('─'.repeat(60));
  const apiOk = await test_api_reachable();
  if (!apiOk) process.exit(1);
  await test_save_and_read_back();
  await test_list_includes_saved();
  await test_real_songs();
  await test_special_chars();
  await cleanup();
  console.log(h('Summary'));
  console.log(`  ${g(`Passed:   ${passed}`)}`);
  if (failed)   console.log(`  ${r(`Failed:   ${failed}`)}`);
  if (warnings) console.log(`  ${y(`Warnings: ${warnings}`)}`);
  console.log(`\n  Total: ${passed + failed + warnings} checks\n`);
  if (failed > 0) process.exit(1);
}

run().catch(e => { console.error('\x1b[31mUnhandled error:\x1b[0m', e); process.exit(1); });
