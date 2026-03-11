// ═══════════════════════════════════════════
// app.js — All application logic
// ═══════════════════════════════════════════


// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let currentWeek = parseInt(localStorage.getItem('ngc-week') || '1');
let checkedItems = JSON.parse(localStorage.getItem('ngc-checks') || '{}');
let milestonesDone = JSON.parse(localStorage.getItem('ngc-milestones') || '{}');

// ═══════════════════════════════════════════
// SESSION BLOCK COMPLETION
// ═══════════════════════════════════════════

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getBlockCheckKey(planId, blockIdx) {
  return `ngc-block-${getTodayKey()}-${planId}-${blockIdx}`;
}

function toggleBlockComplete(planId, blockIdx) {
  const key = getBlockCheckKey(planId, blockIdx);
  const isDone = localStorage.getItem(key) === '1';
  localStorage.setItem(key, isDone ? '0' : '1');
  syncBlockState(planId, blockIdx);
  checkSessionComplete();
}

function syncBlockState(planId, blockIdx) {
  const plan = document.getElementById('plan-' + planId);
  if (!plan) return;
  const block = plan.querySelectorAll('.sblock')[blockIdx];
  if (!block) return;
  const isDone = localStorage.getItem(getBlockCheckKey(planId, blockIdx)) === '1';
  block.classList.toggle('completed', isDone);
}

function restoreBlockStates() {
  ['high','low','weekend'].forEach(planId => {
    const plan = document.getElementById('plan-' + planId);
    if (!plan) return;
    plan.querySelectorAll('.sblock').forEach((block, idx) => {
      const isDone = localStorage.getItem(getBlockCheckKey(planId, idx)) === '1';
      block.classList.toggle('completed', isDone);
    });
  });
}

function checkSessionComplete() {
  const activePlan = document.querySelector('.session-plan.active');
  if (!activePlan) return;
  const planId = activePlan.id.replace('plan-', '');
  const blocks = activePlan.querySelectorAll('.sblock');
  let allDone = blocks.length > 0;
  blocks.forEach((_, idx) => {
    if (localStorage.getItem(getBlockCheckKey(planId, idx)) !== '1') allDone = false;
  });

  let banner = document.getElementById('session-complete-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'session-complete-banner';
    banner.className = 'session-complete-banner';
    banner.innerHTML = `<span style="font-size:18px">✓</span><div class="session-complete-banner-text">Session complete — nicely done</div>`;
    const card = activePlan.closest('.session-card');
    if (card) card.appendChild(banner);
  }
  banner.classList.toggle('visible', allDone);
  if (allDone) logPracticeDay(true);
}

// ═══════════════════════════════════════════
// STREAK & HEATMAP
// ═══════════════════════════════════════════

function getPracticeDays() {
  return JSON.parse(localStorage.getItem('ngc-practice-days') || '[]');
}
function savePracticeDays(days) {
  localStorage.setItem('ngc-practice-days', JSON.stringify(days));
}

function logPracticeDay(silent) {
  const today = getTodayKey();
  const days = getPracticeDays();
  if (!days.includes(today)) {
    days.push(today);
    savePracticeDays(days);
  }
  buildStreakCard();
  if (!silent) {
    const btn = document.getElementById('log-today-btn');
    if (btn) { btn.classList.add('logged'); btn.textContent = '✓ Logged Today'; }
  }
}

function calcStreaks(days) {
  const daySet = new Set(days);
  // Current streak — walk back from today
  let streak = 0;
  const d = new Date();
  d.setHours(0,0,0,0);
  for (;;) {
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!daySet.has(k)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  // Longest streak
  const sorted = [...days].sort();
  let longest = 0, cur = 0, prev = null;
  for (const day of sorted) {
    if (prev) {
      const p = new Date(prev + 'T00:00:00');
      const c = new Date(day + 'T00:00:00');
      const diff = Math.round((c - p) / 86400000);
      cur = diff === 1 ? cur + 1 : 1;
    } else { cur = 1; }
    if (cur > longest) longest = cur;
    prev = day;
  }
  return { streak, longest };
}

function buildStreakCard() {
  const days = getPracticeDays();
  const daySet = new Set(days);
  const today = getTodayKey();
  const { streak, longest } = calcStreaks(days);

  const el = (id) => document.getElementById(id);
  if (el('streak-count')) el('streak-count').textContent = streak;
  if (el('streak-longest')) el('streak-longest').textContent = longest;
  if (el('streak-total')) el('streak-total').textContent = days.length;

  const btn = el('log-today-btn');
  if (btn) {
    if (daySet.has(today)) { btn.classList.add('logged'); btn.textContent = '✓ Logged Today'; }
    else { btn.classList.remove('logged'); btn.textContent = "✓ Log Today's Practice"; }
  }
  buildHeatmap(daySet);
}

function buildHeatmap(daySet) {
  const WEEKS = 14;
  const today = new Date(); today.setHours(0,0,0,0);
  // Start from Sunday WEEKS weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - startDate.getDay() - (WEEKS - 1) * 7);

  const gridEl = document.getElementById('heatmap-grid');
  const monthsEl = document.getElementById('heatmap-months-row');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  if (monthsEl) monthsEl.innerHTML = '';

  // DOW label column
  const dowCol = document.createElement('div');
  dowCol.className = 'heatmap-dow-labels';
  ['','M','','W','','F',''].forEach(l => {
    const d = document.createElement('div');
    d.className = 'heatmap-dow-label';
    d.textContent = l;
    dowCol.appendChild(d);
  });
  gridEl.appendChild(dowCol);

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seenMonths = new Set();

  for (let w = 0; w < WEEKS; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';
    for (let dow = 0; dow < 7; dow++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + w * 7 + dow);
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      if (cellDate > today) { cell.classList.add('future'); col.appendChild(cell); continue; }

      const dateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth()+1).padStart(2,'0')}-${String(cellDate.getDate()).padStart(2,'0')}`;
      cell.dataset.tip = dateKey;
      if (daySet.has(dateKey)) cell.classList.add('practiced');
      if (dateKey === getTodayKey()) cell.classList.add('today');

      // Month label
      const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;
      if (!seenMonths.has(monthKey) && monthsEl) {
        seenMonths.add(monthKey);
        const lbl = document.createElement('span');
        lbl.className = 'heatmap-month-label';
        lbl.textContent = MONTH_NAMES[cellDate.getMonth()];
        lbl.style.left = (22 + w * 12) + 'px';
        monthsEl.appendChild(lbl);
      }
      col.appendChild(cell);
    }
    gridEl.appendChild(col);
  }
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// GEAR IMAGE URL MANAGEMENT
// ═══════════════════════════════════════════
function getGearUrls() { return JSON.parse(localStorage.getItem('ngc-gear-urls') || '{}'); }
function saveGearUrls(u) { localStorage.setItem('ngc-gear-urls', JSON.stringify(u)); }

function toggleUrlEditor(headerEl) {
  const body = headerEl.nextElementSibling;
  const toggle = headerEl.querySelector('.gear-url-editor-toggle');
  const isCollapsed = body.classList.contains('collapsed');
  body.classList.toggle('collapsed', !isCollapsed);
  toggle.textContent = isCollapsed ? 'hide ▴' : 'show ▾';
}

function setGearUrl(id) {
  const imgEl = document.getElementById('ui-' + id);
  const imgUrl = imgEl ? imgEl.value.trim() : '';
  if (!imgUrl) return;
  const urls = getGearUrls();
  urls[id] = imgUrl;
  saveGearUrls(urls);
  applyGearUrl(id, imgUrl);
  // Visual feedback
  const btn = imgEl.nextElementSibling;
  if (btn) { btn.textContent = '✓'; setTimeout(() => { btn.textContent = 'Set'; }, 1500); }
}

function applyGearUrl(id, imgUrl) {
  const imgTag = document.getElementById('img-' + id);
  const phTag  = document.getElementById('ph-' + id);
  if (!imgTag || !imgUrl) return;
  imgTag.onload = () => { if (phTag) phTag.style.display = 'none'; };
  imgTag.onerror = () => {
    imgTag.style.display = 'none';
    if (phTag) phTag.style.display = 'flex';
  };
  imgTag.src = imgUrl;
  imgTag.style.display = 'block';
}

function applyAllGearUrls() {
  const urls = getGearUrls();
  const ids = ['strat','lp','lpstudio','chapman','pacifica','martin','bluesjr','katana','marshall'];
  ids.forEach(id => {
    const imgUrl = urls[id];
    if (!imgUrl) return;
    const imgInput = document.getElementById('ui-' + id);
    if (imgInput) imgInput.value = imgUrl;
    applyGearUrl(id, imgUrl);
  });
}

function showPanel(id, e) {
  const ev = e || event;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (ev && ev.target) ev.target.classList.add('active');
  document.getElementById('mobile-nav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

function showInner(prefix, id) {
  const parent = event.target.closest('.panel') || document.querySelector('.panel.active');
  parent.querySelectorAll('.inner-panel').forEach(p => p.classList.remove('active'));
  parent.querySelectorAll('.inner-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(prefix + '-' + id).classList.add('active');
  event.target.classList.add('active');
}

function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

// ═══════════════════════════════════════════
// WEEK
// ═══════════════════════════════════════════
function setWeek(w) {
  currentWeek = w;
  localStorage.setItem('ngc-week', w);
  localStorage.setItem('ngc-current-phase', 1);
  document.getElementById('current-week').textContent = w;
  document.querySelectorAll('[id^="wbtn-"]').forEach(b => b.classList.add('btn-ghost'));
  const btn = document.getElementById('wbtn-' + w);
  if (btn) btn.classList.remove('btn-ghost');
  const wf = WEEK_DATA[Math.min(Math.floor((w-1)/2), WEEK_DATA.length-1)];
  document.getElementById('week-focus-text').textContent = wf.detail;
  document.getElementById('week-detail-text').innerHTML = `<strong style="color:var(--text)">${wf.weeks === '11-12' ? 'Weeks 11–12' : 'Weeks ' + wf.weeks.replace('-','–')}:</strong> ${wf.focus} — ${wf.detail}`;
  const pct = Math.round((w / 12) * 100);
  document.getElementById('phase-progress').style.width = pct + '%';
}

// ═══════════════════════════════════════════
// CHECKS & MILESTONES
// ═══════════════════════════════════════════
function toggleCheck(el) {
  el.classList.toggle('done');
  const key = el.querySelector('.check-label').textContent;
  checkedItems[key] = el.classList.contains('done');
  localStorage.setItem('ngc-checks', JSON.stringify(checkedItems));
}

function toggleMilestone(el) {
  el.classList.toggle('done');
  const key = el.querySelector('.milestone-text').textContent;
  milestonesDone[key] = el.classList.contains('done');
  localStorage.setItem('ngc-milestones', JSON.stringify(milestonesDone));
  updateMilestoneProgress();
}

function updateMilestoneProgress() {
  MILESTONES.forEach(group => {
    const total = group.items.length;
    const done = group.items.filter(item => milestonesDone[item]).length;
    const bar = document.getElementById('mprog-' + group.phase);
    if (bar) bar.style.width = Math.round((done/total)*100) + '%';
    const lbl = document.getElementById('mcount-' + group.phase);
    if (lbl) lbl.textContent = done + ' / ' + total;
  });
}

// ═══════════════════════════════════════════
// ENERGY TOGGLE
// ═══════════════════════════════════════════
function setEnergy(level) {
  document.querySelectorAll('.session-plan').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
  document.getElementById('plan-' + level).classList.add('active');
  event.target.classList.add('active');
  // Re-check completion state for newly visible plan
  checkSessionComplete();
}

function setEnergyAndTimer(level) {
  setEnergy(level);
  if (!TIMER.running && TIMER.segments.length > 0) {
    const modeLabel = document.getElementById('timer-mode-label').textContent;
    if (modeLabel === 'Session') setTimeout(timerLoadSession, 50);
  }
}

// ═══════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════
function saveNotes() {
  const val = document.getElementById('session-notes').value;
  localStorage.setItem('ngc-notes', val);
  document.getElementById('notes-saved').textContent = 'saved';
  setTimeout(() => { document.getElementById('notes-saved').textContent = ''; }, 1500);
}
function clearNotes() {
  document.getElementById('session-notes').value = '';
  localStorage.removeItem('ngc-notes');
}

function toggleSongCard(el) { el.classList.toggle('expanded'); }
function toggleToneCard(el) { el.classList.toggle('expanded'); }

// ═══════════════════════════════════════════
// BUILD DASHBOARD SONGS
// ═══════════════════════════════════════════
function buildDashSongs() {
  const container = document.getElementById('dash-songs');
  if (!container) return;
  const phaseNum = parseInt(localStorage.getItem('ngc-current-phase') || '1');
  const phase = PHASES.find(p => p.id === phaseNum) || PHASES[0];
  const state = getCurriculumState(phaseNum);
  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const titles = state.curriculum;

  const titleEl = container.closest('.card')?.querySelector('.card-title');
  if (titleEl) { titleEl.textContent = `Phase ${phaseNum} Songs`; titleEl.style.color = ''; }

  container.innerHTML = titles.map(title => {
    const song = phase.songs.find(s => s.title === title);
    const artist = song ? song.artist : '';
    const isReach = state.stretch === title;
    const status = getSongStatus(title);
    const sc = statusClass(status);
    const reachBadge = isReach ? `<span class="badge-reach" style="color:${pm.color};border-color:${pm.border};background:${pm.bg}">🎯 Reach</span>` : '';
    return `<div class="song-row" style="cursor:pointer;border-left:3px solid var(--status-${sc})" onclick="goToSongInLibrary('${title.replace(/'/g, "\\'")}', ${phaseNum})">
      <div style="flex:1"><div class="song-title">${title}</div><div class="song-artist">${artist}</div></div>
      <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${reachBadge}${statusIconHtml(status)}</div>
    </div>`;
  }).join('') || '<div class="small muted">No songs in curriculum yet.</div>';
}

function goToSongInLibrary(title, phaseNum) {
  showPanel('swaps', null);
  setTimeout(() => {
    const phaseTabBtn = document.querySelector(`[onclick*="showSwapPhase(${phaseNum})"]`);
    if (phaseTabBtn) phaseTabBtn.click();
    setTimeout(() => {
      const cards = document.querySelectorAll('.sl-card');
      for (const card of cards) {
        if (card.dataset.title === title) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('drop-target');
          setTimeout(() => card.classList.remove('drop-target'), 1800);
          break;
        }
      }
    }, 120);
  }, 60);
}

// ═══════════════════════════════════════════
// BUILD CURRICULUM
// ═══════════════════════════════════════════
function buildCurriculum() {
  const colors = ['var(--p1c)','var(--p2c)','var(--p3c)','var(--p4c)','var(--p5c)'];
  const songsContainer = document.getElementById('curriculum-songs');
  const weeksContainer = document.getElementById('curriculum-weeks');

  songsContainer.innerHTML = PHASES.map((phase, pi) => {
    const songCards = phase.songs.map(s => `
      <div class="song-card" onclick="toggleSongCard(this)">
        <div class="song-card-header">
          <div class="song-card-num">${s.num}</div>
          <div class="song-card-info"><div class="song-card-name">${s.title}</div><div class="song-card-artist">${s.artist}</div></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="tag">${s.weeksFocus.split('(')[0].trim()}</span>
            ${s.tuning ? `<span class="tag" style="${s.tuning === 'Standard' ? '' : 'background:rgba(196,144,96,0.15);color:var(--accent);border-color:rgba(196,144,96,0.35);'}">${s.tuning}</span>` : ''}
            <div class="song-card-chevron">▼</div>
          </div>
        </div>
        <div class="song-card-body">
          <div class="song-detail-grid">
            <div><div class="song-detail-label">What It Teaches</div><div class="song-detail-value">${s.teaches}</div></div>
            <div><div class="song-detail-label">Resources</div><div class="song-detail-value">${s.resources}</div></div>
          </div>
          <div class="song-tags">${s.skills.map(sk => `<span class="tag">${sk}</span>`).join('')}</div>
        </div>
      </div>`).join('');
    return `<div class="phase-section">
      <div class="phase-header">
        <span class="badge badge-p${phase.id}">${phase.label}</span>
        <div class="phase-header-title" style="color:${colors[pi]}">${phase.name}</div>
        <div class="phase-meta"><span class="mono small dimmed">${phase.duration}</span></div>
      </div>
      <div class="small muted" style="margin-bottom:14px">${phase.desc}</div>
      <div class="stack" style="gap:8px">${songCards}</div>
    </div>`;
  }).join('');

  weeksContainer.innerHTML = PHASES.filter(p => p.weeks.length > 0).map((phase, pi) => `
    <div class="phase-section">
      <div class="phase-header">
        <span class="badge badge-p${phase.id}">${phase.label}</span>
        <div class="phase-header-title" style="color:${colors[pi]}">${phase.name}</div>
        <span class="mono small dimmed">${phase.duration}</span>
      </div>
      ${phase.weeks.map(w => `<div class="week-card"><div class="week-card-header"><span class="week-num">${w.range}</span><span class="week-focus-title">${w.title}</span></div><div class="week-detail">${w.detail}</div></div>`).join('')}
    </div>`).join('');
}

// ═══════════════════════════════════════════
// BUILD MILESTONES
// ═══════════════════════════════════════════
function buildMilestones() {
  const container = document.getElementById('milestones-content');
  const colors = ['var(--p1c)','var(--p2c)','var(--p3c)'];
  const badges = ['badge-p1','badge-p2','badge-p3'];
  container.innerHTML = MILESTONES.map((group, gi) => {
    const total = group.items.length;
    const done = group.items.filter(item => milestonesDone[item]).length;
    return `<div class="milestone-group">
      <div class="milestone-group-header">
        <span class="badge ${badges[gi]}">${group.label}</span>
        <div class="milestone-group-title" style="color:${colors[gi]}">${group.label} Milestones</div>
        <span class="mono small dimmed" id="mcount-${group.phase}">${done} / ${total}</span>
      </div>
      <div class="prog-bar" style="margin-bottom:14px"><div class="prog-fill green" id="mprog-${group.phase}" style="width:${Math.round((done/total)*100)}%"></div></div>
      <div>${group.items.map(item => `
        <div class="milestone-item ${milestonesDone[item] ? 'done' : ''}" onclick="toggleMilestone(this)">
          <div class="milestone-icon"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg></div>
          <div><div class="milestone-text">${item}</div></div>
        </div>`).join('')}</div>
      ${gi < MILESTONES.length - 1 ? '<div class="divider"></div>' : ''}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════
// BUILD TONE PROFILES
// ═══════════════════════════════════════════
function buildToneProfiles() {
  const container = document.getElementById('tone-profiles-list');
  const phaseBadges = ['badge-p1','badge-p2','badge-p3'];
  container.innerHTML = [1,2,3].map((ph, pi) => {
    const profiles = TONE_PROFILES.filter(t => t.phase === ph);
    return `<div style="margin-bottom:20px">
      <div class="section-label" style="margin-bottom:8px">Phase ${ph}</div>
      ${profiles.map(t => `
        <div class="tone-profile-card" onclick="toggleToneCard(this)">
          <div class="tone-profile-header">
            <span class="badge ${phaseBadges[pi]}">P${ph}</span>
            <div class="tone-profile-name">${t.song}</div>
            <div class="song-card-chevron">▼</div>
          </div>
          <div class="tone-profile-body">
            <div class="song-detail-label" style="margin-top:12px">Guitar</div><div class="song-detail-value">${t.guitar}</div>
            <div class="song-detail-label" style="margin-top:8px">Amp</div><div class="song-detail-value">${t.amp}</div>
            <div class="song-detail-label" style="margin-top:8px">Signal Chain Notes</div>
            <div class="chain">${t.chain.map(c => `<span class="chain-item">${c}</span>`).join('<span class="chain-arrow">→</span>')}</div>
            <div class="song-detail-label">Notes</div>
            <div class="tone-placeholder">${t.notes}</div>
          </div>
        </div>`).join('')}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════
// SONG LIBRARY STATE
// ═══════════════════════════════════════════
const PHASE_META = {
  1: { color:'#c8b840', bg:'rgba(200,184,64,0.12)',  border:'rgba(200,184,64,0.30)',  badge:'badge-p1', label:'Phase 1', cssVar:'var(--p1c)' },
  2: { color:'#5a9fd4', bg:'rgba(90,159,212,0.12)', border:'rgba(90,159,212,0.30)', badge:'badge-p2', label:'Phase 2', cssVar:'var(--p2c)' },
  3: { color:'#d4816a', bg:'rgba(212,129,106,0.12)',border:'rgba(212,129,106,0.30)',badge:'badge-p3', label:'Phase 3', cssVar:'var(--p3c)' },
  4: { color:'#d4903a', bg:'rgba(212,144,58,0.12)', border:'rgba(212,144,58,0.30)', badge:'badge-p4', label:'Phase 4', cssVar:'var(--p4c)' },
  5: { color:'#9278b0', bg:'rgba(146,120,176,0.12)', border:'rgba(146,120,176,0.28)', badge:'badge-p5', label:'Phase 5', cssVar:'var(--p5c)' },
};

function parsePhaseNums(fitsStr) {
  const matches = fitsStr.match(/\d/g);
  return matches ? [...new Set(matches.map(Number))].filter(n => n >= 1 && n <= 5) : [1];
}

function getPhaseTopBorder(fitsStr) {
  const phases = parsePhaseNums(fitsStr);
  if (phases.length === 1) return `border-top: 3px solid ${PHASE_META[phases[0]].cssVar};`;
  const c1 = PHASE_META[phases[0]].color, c2 = PHASE_META[phases[1]].color;
  return `border-top: 3px solid transparent; background-image: linear-gradient(var(--bg3), var(--bg3)), linear-gradient(to right, ${c1} 50%, ${c2} 50%); background-origin: border-box; background-clip: padding-box, border-box;`;
}

function getPhaseBadgesHtml(fitsStr) {
  const phases = parsePhaseNums(fitsStr);
  return phases.map(p => `<span class="badge ${PHASE_META[p].badge}">${PHASE_META[p].label}</span>`).join(' ');
}

function getCurriculumState(phaseNum) {
  const key = `ngc-curriculum-p${phaseNum}`;
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const phase = PHASES.find(p => p.id === phaseNum);
  if (!phase) return { curriculum: [], stretch: null };
  return { curriculum: phase.songs.map(s => s.title), stretch: null };
}

function saveCurriculumState(phaseNum, state) {
  localStorage.setItem(`ngc-curriculum-p${phaseNum}`, JSON.stringify(state));
}

const SONG_STATUS_LABELS = { ns:'Not Started', ip:'In Progress', lrn:'Learned', itf:'In The Fingers' };
const SONG_STATUS_ICONS  = { ns:'○', ip:'◑', lrn:'🎯', itf:'💎' };

function getAllSongStatuses() { return JSON.parse(localStorage.getItem('ngc-song-status') || '{}'); }
function getSongStatus(title) { return getAllSongStatuses()[title] || 'ns'; }
function setSongStatus(title, status) { const all = getAllSongStatuses(); all[title] = status; localStorage.setItem('ngc-song-status', JSON.stringify(all)); }
function statusClass(status) { return status || 'ns'; }
function statusBadgeHtml(status) { const s = statusClass(status); return `<span class="status-badge ${s}">${SONG_STATUS_ICONS[s]} ${SONG_STATUS_LABELS[s]}</span>`; }
function statusIconHtml(status) { const s = statusClass(status); return `<span class="status-badge ${s}" title="${SONG_STATUS_LABELS[s]}">${SONG_STATUS_ICONS[s]}</span>`; }
function getMasteredSongs() { const all = getAllSongStatuses(); const m = new Set(); Object.keys(all).forEach(t => { if (all[t]==='lrn'||all[t]==='itf') m.add(t); }); return m; }

function handleMIStatusChange(event, songTitle) {
  event.stopPropagation();
  const select = event.target;
  const newStatus = select.value;
  setSongStatus(songTitle, newStatus);
  select.className = 'status-select ' + newStatus;
  buildSwapTable('sw-metalitch', SWAPS.metalitch, true, null);
}

function handleExtraStatusChange(event, songTitle) {
  event.stopPropagation();
  const select = event.target;
  const newStatus = select.value;
  setSongStatus(songTitle, newStatus);
  select.className = 'status-select ' + newStatus;
}

// ═══════════════════════════════════════════
// BUILD SWAP TABLES
// ═══════════════════════════════════════════
function buildSwapTable(containerId, data, isMetalItch, phaseNum) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (isMetalItch) {
    // Group songs by their primary phase
    const phaseGroups = {};
    const PHASE_ORDER = [1, 2, 3, 4, 5];
    PHASE_ORDER.forEach(p => phaseGroups[p] = []);
    data.forEach(s => {
      const phases = parsePhaseNums(s.fits);
      const primary = phases[0] || 1;
      phaseGroups[primary].push(s);
    });

    const allStatuses = getAllSongStatuses();

    const sectionsHtml = PHASE_ORDER.filter(p => phaseGroups[p].length > 0).map(p => {
      const pm = PHASE_META[p];
      const songs = phaseGroups[p];
      const doneCount = songs.filter(s => {
        const st = allStatuses[s.song] || 'ns';
        return st === 'lrn' || st === 'itf';
      }).length;
      const inProgCount = songs.filter(s => (allStatuses[s.song] || 'ns') === 'ip').length;
      const pct = Math.round((doneCount / songs.length) * 100);

      const statusOpts = Object.entries(SONG_STATUS_LABELS)
        .map(([val, label]) => `<option value="${val}">${label}</option>`).join('');

      const cardsHtml = songs.map(s => {
        const topBorder = getPhaseTopBorder(s.fits);
        const badgesHtml = getPhaseBadgesHtml(s.fits);
        const status = allStatuses[s.song] || 'ns';
        const safeName = s.song.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
        const statusOptsWithSel = Object.entries(SONG_STATUS_LABELS)
          .map(([val, label]) => `<option value="${val}" ${status===val?'selected':''}>${label}</option>`).join('');
        return `<div class="metal-song" style="${topBorder}" data-mi-song="${safeName}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap;margin-bottom:5px">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">${badgesHtml}</div>
            <select class="status-select ${status}" onchange="handleMIStatusChange(event,'${safeName}')">${statusOptsWithSel}</select>
          </div>
          <div class="metal-song-name">${s.song}</div>
          <div class="metal-song-why">${s.why}</div>
        </div>`;
      }).join('');

      const phaseObj = PHASES.find(ph => ph.id === p);
      const phaseName = phaseObj ? phaseObj.name : '';
      const phaseDesc = phaseObj ? phaseObj.desc : '';
      return `<div class="mi-phase-section" style="margin-bottom:28px">
        <div class="mi-phase-header" style="border-left:3px solid ${pm.color};padding-left:12px;margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span class="badge ${pm.badge}">${pm.label}</span>
              <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:${pm.color}">${phaseName}</span>
              <span class="badge badge-pending">${songs.length} song${songs.length!==1?'s':''}</span>
              ${inProgCount > 0 ? `<span class="badge badge-active">${inProgCount} in progress</span>` : ''}
              ${doneCount > 0 ? `<span class="badge badge-done">${doneCount} learned</span>` : ''}
            </div>
            <span style="font-family:'DM Mono',monospace;font-size:10px;color:${pm.color};letter-spacing:1px;flex-shrink:0">${pct}%</span>
          </div>
          ${phaseDesc ? `<div class="small muted" style="margin-bottom:8px">${phaseDesc}</div>` : ''}
          <div class="prog-bar" style="height:3px">
            <div class="prog-fill" style="width:${pct}%;background:${pm.color}"></div>
          </div>
        </div>
        <div class="metal-itch-grid">${cardsHtml}</div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="small muted" style="margin-bottom:20px">Pre-vetted songs grouped by phase fit. Use the status selector on each song to track progress.</div>
      ${sectionsHtml}`;
    return;
  }

  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const phase = PHASES.find(p => p.id === phaseNum);
  if (!phase) return;

  const state = getCurriculumState(phaseNum);
  const mastered = getMasteredSongs();
  const curriculumTitles = state.curriculum;
  const optionsTitles = phase.songs.map(s => s.title).filter(t => !curriculumTitles.includes(t));

  const allStatSL = getAllSongStatuses();
  const slDone   = curriculumTitles.filter(t => { const s = allStatSL[t]||'ns'; return s==='lrn'||s==='itf'; }).length;
  const slInProg = curriculumTitles.filter(t => (allStatSL[t]||'ns')==='ip').length;
  const coreSongs = Math.min(curriculumTitles.length, 6);
  const slPct    = coreSongs > 0 ? Math.round((slDone / coreSongs) * 100) : 0;

  container.innerHTML = `
    <div style="border-left:3px solid ${pm.color};padding-left:12px;margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="badge ${pm.badge}">${pm.label}</span>
          <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:${pm.color}">${phase.name}</span>
          <span class="badge badge-pending" id="sl-count-${phaseNum}">${coreSongs} song${coreSongs!==1?'s':''} in curriculum${curriculumTitles.length > 6 ? ' + reach' : ''}</span>
          ${slInProg > 0 ? `<span class="badge badge-active">${slInProg} in progress</span>` : ''}
          ${slDone   > 0 ? `<span class="badge badge-done">${slDone} learned</span>` : ''}
        </div>
        <span style="font-family:'DM Mono',monospace;font-size:10px;color:${pm.color};letter-spacing:1px;flex-shrink:0">${slPct}%</span>
      </div>
      <div class="small muted" style="margin-bottom:8px">${phase.desc}</div>
      <div class="prog-bar" style="height:3px"><div class="prog-fill" style="width:${slPct}%;background:${pm.color}"></div></div>
    </div>
    <div class="small muted" style="margin-bottom:16px">Drag songs between columns to build your curriculum. Max 6 core songs + 1 reach slot (🎯). Drag within curriculum to reorder.</div>
    <div class="sl-layout" id="sl-layout-${phaseNum}">
      <div>
        <div class="sl-col-header">Curriculum</div>
        <div class="sl-drop-zone" id="sl-curriculum-${phaseNum}" data-phase="${phaseNum}" data-col="curriculum">
          ${curriculumTitles.length === 0 ? '<div class="sl-empty">Drop songs here</div>' :
            curriculumTitles.map((title, i) => {
              const divider = i === 6 ? `<div class="sl-reach-divider"><div class="sl-reach-divider-line"></div><div class="sl-reach-divider-label">🎯 Reach Slot</div><div class="sl-reach-divider-line"></div></div>` : '';
              return divider + renderSlCard(title, phaseNum, 'curriculum', state, mastered, phase, data);
            }).join('')}
        </div>
      </div>
      <div>
        <div class="sl-col-header">Options</div>
        <div class="sl-drop-zone" id="sl-options-${phaseNum}" data-phase="${phaseNum}" data-col="options">
          ${optionsTitles.length === 0 ? '<div class="sl-empty">All songs in curriculum</div>' :
            optionsTitles.map(title => renderSlCard(title, phaseNum, 'options', state, mastered, phase, data)).join('')}
        </div>
      </div>
    </div>`;

  initDragDrop(phaseNum);
}

function renderSlCard(title, phaseNum, col, state, mastered, phase, swapData) {
  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const isReach = state.stretch === title;
  const status = getSongStatus(title);
  const sc = statusClass(status);
  const songObj = phase.songs.find(s => s.title === title);
  const swapObj = swapData ? swapData.find(s => s.song === title) : null;
  const func = swapObj ? swapObj.func : (songObj ? songObj.teaches.split(',')[0] : '');
  const reachStyle = isReach ? `background-color: ${pm.bg}; border-color: ${pm.border};` : '';
  const reachBtnClass = isReach ? 'sl-reach-btn active' : 'sl-reach-btn';
  const cardClass = `sl-card status-${sc}${isReach ? ' is-reach' : ''}`;
  const canToggleReach = col === 'curriculum' && (sc === 'lrn' || isReach);
  const statusOpts = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${sc === val ? 'selected' : ''}>${label}</option>`).join('');
  const safetitle = title.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return `<div class="${cardClass}" data-title="${title.replace(/"/g, '&quot;')}" data-phase="${phaseNum}" data-col="${col}" style="${reachStyle}">
    <div class="sl-card-top">
      <div style="flex:1"><div class="sl-card-title">${title}</div><div class="sl-card-artist">${songObj ? songObj.artist : ''}</div></div>
      <div style="display:flex;align-items:center;gap:4px">
        ${isReach ? `<span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1px;color:${pm.color};opacity:0.85">🎯 REACH</span>` : ''}
        <select class="status-select ${sc}" onclick="event.stopPropagation()" onchange="handleStatusChange(event, '${safetitle}', ${phaseNum})">${statusOpts}</select>
        ${canToggleReach ? `<button class="${reachBtnClass}" onclick="toggleStretch(event, ${phaseNum}, '${safetitle}')">🎯</button>` : ''}
      </div>
    </div>
    ${func ? `<div class="sl-card-func">${func}</div>` : ''}
  </div>`;
}

// ─── Pointer Drag ────────────────────────────
let dragState = null, dragGhost = null, dragInsertLine = null;
const DRAG_THRESHOLD = 6;

function initDragDrop(phaseNum) {
  document.querySelectorAll(`#sl-curriculum-${phaseNum} .sl-card, #sl-options-${phaseNum} .sl-card`).forEach(card => attachPointerDrag(card, phaseNum));
}

function attachPointerDrag(card, phaseNum) {
  let startX, startY, moved = false;
  card.addEventListener('pointerdown', e => {
    if (e.target.closest('select, button')) return;
    e.preventDefault();
    card.setPointerCapture(e.pointerId);
    startX = e.clientX; startY = e.clientY; moved = false;
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onUp);

    function onMove(ev) {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!moved) {
        moved = true;
        dragState = { title: card.dataset.title, col: card.dataset.col, phase: phaseNum, card };
        card.classList.add('dragging');
        dragGhost = document.createElement('div');
        dragGhost.className = 'drag-ghost';
        dragGhost.textContent = card.dataset.title;
        document.body.appendChild(dragGhost);
      }
      if (dragGhost) { dragGhost.style.left = (ev.clientX - 20) + 'px'; dragGhost.style.top = (ev.clientY - 20) + 'px'; }
      updateDropIndicators(ev.clientX, ev.clientY, phaseNum);
    }

    function onUp(ev) {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerup', onUp);
      card.removeEventListener('pointercancel', onUp);
      if (moved && dragState) commitDrop(ev.clientX, ev.clientY, phaseNum);
      card.classList.remove('dragging');
      if (dragGhost) { dragGhost.remove(); dragGhost = null; }
      if (dragInsertLine) { dragInsertLine.remove(); dragInsertLine = null; }
      document.querySelectorAll('.sl-drop-zone').forEach(z => z.classList.remove('drag-over','drop-blocked'));
      dragState = null; moved = false;
    }
  });
}

function getZoneAtPoint(x, y, phaseNum) {
  for (const zone of [document.getElementById(`sl-curriculum-${phaseNum}`), document.getElementById(`sl-options-${phaseNum}`)]) {
    if (!zone) continue;
    const r = zone.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
  }
  return null;
}

function updateDropIndicators(x, y, phaseNum) {
  const currZone = document.getElementById(`sl-curriculum-${phaseNum}`);
  const optsZone = document.getElementById(`sl-options-${phaseNum}`);
  if (!currZone || !optsZone || !dragState) return;
  const zone = getZoneAtPoint(x, y, phaseNum);
  [currZone, optsZone].forEach(z => z.classList.remove('drag-over','drop-blocked'));
  if (dragInsertLine) { dragInsertLine.remove(); dragInsertLine = null; }
  if (!zone) return;
  const isCurriculum = zone.dataset.col === 'curriculum';
  const state = getCurriculumState(phaseNum);
  const wouldExceed = isCurriculum && !state.curriculum.includes(dragState.title) && state.curriculum.length >= 7;
  if (wouldExceed) { zone.classList.add('drop-blocked'); return; }
  zone.classList.add('drag-over');
  if (isCurriculum && dragState.col === 'curriculum') {
    const insertIdx = getInsertIndex(x, y, zone, state.curriculum);
    dragInsertLine = document.createElement('div');
    dragInsertLine.className = 'drag-insert-line';
    const cards = [...zone.querySelectorAll('.sl-card:not(.dragging)')];
    if (insertIdx < cards.length) zone.insertBefore(dragInsertLine, cards[insertIdx]);
    else zone.appendChild(dragInsertLine);
  }
}

function getInsertIndex(x, y, zone, curriculum) {
  const cards = [...zone.querySelectorAll('.sl-card:not(.dragging)')];
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (y < rect.top + rect.height / 2) { const title = cards[i].dataset.title; const idx = curriculum.indexOf(title); return idx !== -1 ? idx : i; }
  }
  return curriculum.length;
}

function commitDrop(x, y, phaseNum) {
  if (!dragState) return;
  const zone = getZoneAtPoint(x, y, phaseNum);
  if (!zone) return;
  const targetCol = zone.dataset.col;
  const state = getCurriculumState(phaseNum);
  if (dragState.col !== targetCol) {
    if (targetCol === 'curriculum' && state.curriculum.length >= 7) return;
    if (targetCol === 'curriculum') state.curriculum.push(dragState.title);
    else { state.curriculum = state.curriculum.filter(t => t !== dragState.title); if (state.stretch === dragState.title) state.stretch = null; }
  } else if (targetCol === 'curriculum') {
    const dragIdx = state.curriculum.indexOf(dragState.title);
    if (dragIdx === -1) return;
    const dropIdx = getInsertIndex(x, y, zone, state.curriculum);
    const newOrder = [...state.curriculum];
    newOrder.splice(dragIdx, 1);
    const insertAt = dropIdx > dragIdx ? dropIdx - 1 : dropIdx;
    newOrder.splice(Math.max(0, insertAt), 0, dragState.title);
    state.curriculum = newOrder;
  } else return;
  saveCurriculumState(phaseNum, state);
  rebuildSwapPhase(phaseNum);
  refreshSiteFromCurriculum();
}

function handleStatusChange(e, title, phaseNum) {
  e.stopPropagation();
  setSongStatus(title, e.target.value);
  e.target.className = `status-select ${e.target.value}`;
  const card = e.target.closest('.sl-card');
  if (card) { card.classList.remove('status-ns','status-ip','status-lrn','status-itf'); card.classList.add(`status-${e.target.value}`); }
  refreshSiteFromCurriculum();
}

function toggleStretch(e, phaseNum, title) {
  e.stopPropagation();
  const state = getCurriculumState(phaseNum);
  state.stretch = state.stretch === title ? null : title;
  saveCurriculumState(phaseNum, state);
  rebuildSwapPhase(phaseNum);
  refreshSiteFromCurriculum();
}

function rebuildSwapPhase(phaseNum) {
  const phase = PHASES.find(p => p.id === phaseNum);
  if (!phase) return;
  buildSwapTable(`sw-phase${phaseNum}`, SWAPS[`phase${phaseNum}`] || [], false, phaseNum);
}

function refreshSiteFromCurriculum() {
  buildDashSongs();
  buildToneProfiles();
}

// ═══════════════════════════════════════════
// PERSONAL SECTION
// ═══════════════════════════════════════════
function buildPersonalSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const statusOpts = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}">${label}</option>`).join('');
  container.innerHTML = `
    <div style="margin-bottom:20px">
      <div class="section-label">Personal Repertoire</div>
      <div class="small muted" style="margin-bottom:18px;max-width:600px;line-height:1.7">Songs outside the curriculum — learned for personal reasons. No milestones. No phase assignment. No pressure.</div>
      <div class="stack" style="gap:12px">
        ${GIFT_SONGS.map(s => {
          const status = getSongStatus(s.title);
          const safeName = s.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
          const statusOptsWithSel = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${status===val?'selected':''}>${label}</option>`).join('');
          return `<div class="card" style="border-left:3px solid var(--accent)">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px">
              <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
                <div style="font-size:15px;font-weight:500">${s.title}</div>
                <div class="small dimmed">${s.artist}</div>
                ${s.capo && s.capo !== 'No capo' ? `<span class="tag" style="background:rgba(96,144,184,0.15);color:var(--blue);border-color:rgba(96,144,184,0.3)">${s.capo}</span>` : ''}
              </div>
              <select class="status-select ${status}" onchange="handleExtraStatusChange(event,'${safeName}')">${statusOptsWithSel}</select>
            </div>
            ${s.chords ? `<div class="small" style="color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:0.5px;margin-bottom:8px">${s.chords}</div>` : ''}
            <div class="small muted" style="margin-bottom:8px;line-height:1.6">${s.why}</div>
            <div class="small" style="color:var(--text3);font-style:italic;margin-bottom:10px">${s.notes}</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">${s.skills.map(sk => `<span class="tag">${sk}</span>`).join('')}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="divider"></div>
    <div class="section-label" style="margin-top:16px">Add to Personal Repertoire</div>
    <div class="small muted" style="margin-bottom:12px">Songs you want to remember — not curriculum, just yours.</div>
    <div style="display:flex;gap:8px;margin-bottom:10px">
      <input id="lib-gift-input" type="text" placeholder="Song — Artist" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:5px;color:var(--text);font-family:'DM Mono',monospace;font-size:12px;padding:8px 12px;outline:none;" />
      <button class="btn btn-sm" onclick="addLibGiftSong()">Add</button>
    </div>
    <div id="lib-gift-user-list" style="display:flex;flex-direction:column;gap:6px"></div>`;
  renderLibGiftSongs();
}

function addLibGiftSong() {
  const input = document.getElementById('lib-gift-input');
  const val = input.value.trim();
  if (!val) return;
  const list = JSON.parse(localStorage.getItem('ngc-gift-songs') || '[]');
  list.push(val);
  localStorage.setItem('ngc-gift-songs', JSON.stringify(list));
  input.value = '';
  renderLibGiftSongs();
}
function removeLibGiftSong(idx) {
  const list = JSON.parse(localStorage.getItem('ngc-gift-songs') || '[]');
  list.splice(idx, 1);
  localStorage.setItem('ngc-gift-songs', JSON.stringify(list));
  renderLibGiftSongs();
}
function renderLibGiftSongs() {
  const container = document.getElementById('lib-gift-user-list');
  if (!container) return;
  const list = JSON.parse(localStorage.getItem('ngc-gift-songs') || '[]');
  if (!list.length) { container.innerHTML = ''; return; }
  container.innerHTML = list.map((s, i) => `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:5px"><span style="flex:1;font-size:13px">${s}</span><button onclick="removeLibGiftSong(${i})" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:16px;line-height:1;padding:0 2px;">×</button></div>`).join('');
}

// ═══════════════════════════════════════════
// ACOUSTIC SECTION
// ═══════════════════════════════════════════
function buildAcousticSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const tierColors = ['var(--green)', 'var(--accent)', 'var(--p5c)'];
  const tierBorderColors = ['rgba(114,168,120,0.35)', 'rgba(196,144,96,0.35)', 'rgba(146,120,176,0.35)'];
  const tierBg = ['rgba(114,168,120,0.06)', 'rgba(196,144,96,0.06)', 'rgba(146,120,176,0.06)'];
  const tiersHTML = ACOUSTIC_SONGS.tiers.map((tier, ti) => {
    const songsHTML = tier.songs.map(s => {
      const isEssential = s.essential;
      const status = getSongStatus(s.title);
      const safeName = s.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      const statusOptsWithSel = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${status===val?'selected':''}>${label}</option>`).join('');
      return `<div class="card" style="border-left:${isEssential ? '3px' : '2px'} solid ${isEssential ? 'var(--accent2)' : tierColors[ti]};margin-bottom:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:4px;">
          <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
            <div style="font-size:15px;font-weight:500;color:var(--text)">${s.title}</div>
            <div class="small dimmed">${s.artist}</div>
            ${s.capo !== 'No capo' ? `<span class="tag" style="background:rgba(96,144,184,0.15);color:var(--blue);border-color:rgba(96,144,184,0.3)">${s.capo}</span>` : ''}
            ${isEssential ? `<span class="tag" style="background:rgba(196,144,96,0.2);color:var(--accent2);border-color:rgba(196,144,96,0.4);font-weight:600">ESSENTIAL</span>` : ''}
          </div>
          <select class="status-select ${status}" onchange="handleExtraStatusChange(event,'${safeName}')">${statusOptsWithSel}</select>
        </div>
        <div class="small" style="color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:0.5px;margin-bottom:8px">${s.chords}</div>
        <div class="small muted" style="line-height:1.65;margin-bottom:8px">${s.teaches}</div>
        <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:10px;color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:1px;text-transform:uppercase">Vibe</span><span class="tag">${s.vibe}</span></div>
      </div>`;
    }).join('');
    return `<div style="margin-bottom:28px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;padding:10px 14px;background:${tierBg[ti]};border:1px solid ${tierBorderColors[ti]};border-radius:6px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;color:${tierColors[ti]}">${tier.label}</div>
      </div>
      <div class="small muted" style="margin-bottom:14px;padding:0 2px;line-height:1.65">${tier.desc}</div>
      ${songsHTML}
    </div>`;
  }).join('');
  container.innerHTML = `
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:var(--text)">Acoustic Off-Ramp</div><div class="mono small dimmed">Martin GPC-10E Special</div></div>
      <div class="small muted" style="max-width:660px;line-height:1.7;margin-bottom:6px;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;">${ACOUSTIC_SONGS.intro}</div>
    </div>
    ${tiersHTML}`;
}

// ═══════════════════════════════════════════
// PRACTICE TIMER
// ═══════════════════════════════════════════
const TIMER = { segments:[], segIdx:0, totalSecs:0, remainSecs:0, running:false, interval:null, doneSegs:new Set() };
const CIRCUMFERENCE = 2 * Math.PI * 58;

function timerGetSessionSegs() {
  const activePlan = document.querySelector('.session-plan.active');
  if (!activePlan) return [];
  const segs = [];
  activePlan.querySelectorAll('.sblock').forEach(block => {
    const timeEl = block.querySelector('.sblock-time');
    const headEl = block.querySelector('.sblock-head');
    if (!timeEl || !headEl) return;
    const mins = parseInt(timeEl.textContent);
    if (isNaN(mins)) return;
    segs.push({ label: headEl.textContent.trim(), minutes: mins });
  });
  return segs;
}

function timerLoadSession() {
  const segs = timerGetSessionSegs();
  if (!segs.length) return;
  timerStop(); TIMER.segments = segs; TIMER.segIdx = 0; TIMER.doneSegs.clear();
  timerInitSeg(); timerRenderSegs();
  document.getElementById('timer-mode-label').textContent = 'Session';
}

function timerLoadCustom() {
  const val = parseInt(document.getElementById('timer-custom-min').value);
  if (!val || val < 1) return;
  timerStop(); TIMER.segments = [{label:'Practice', minutes:val}]; TIMER.segIdx = 0; TIMER.doneSegs.clear();
  timerInitSeg(); timerRenderSegs();
  document.getElementById('timer-mode-label').textContent = 'Custom';
}

function timerInitSeg() {
  const seg = TIMER.segments[TIMER.segIdx];
  if (!seg) { timerDone(); return; }
  TIMER.totalSecs = seg.minutes * 60; TIMER.remainSecs = TIMER.totalSecs; timerRender();
}

function timerToggle() { if (!TIMER.segments.length) { timerLoadSession(); return; } TIMER.running ? timerStop() : timerStart(); }

function timerStart() {
  if (!TIMER.segments.length) return;
  TIMER.running = true;
  document.getElementById('timer-start-btn').textContent = 'Pause';
  document.getElementById('timer-ring').classList.add('running');
  TIMER.interval = setInterval(() => {
    if (TIMER.remainSecs <= 0) timerSegComplete();
    else { TIMER.remainSecs--; timerRender(); }
  }, 1000);
}

function timerStop() {
  TIMER.running = false; clearInterval(TIMER.interval);
  document.getElementById('timer-start-btn').textContent = 'Start';
  document.getElementById('timer-ring').classList.remove('running');
}

function timerReset() {
  timerStop(); TIMER.segIdx = 0; TIMER.doneSegs.clear();
  if (TIMER.segments.length) timerInitSeg();
  else { document.getElementById('timer-digits').textContent = '00:00'; document.getElementById('timer-seg-label').textContent = '—'; }
  timerRenderSegs(); document.getElementById('timer-ring').classList.remove('done');
}

function timerNextSeg() { if (!TIMER.segments.length) return; timerSegComplete(); }

function timerSegComplete() {
  timerPing(); TIMER.doneSegs.add(TIMER.segIdx); TIMER.segIdx++;
  if (TIMER.segIdx >= TIMER.segments.length) timerDone();
  else { timerInitSeg(); timerRenderSegs(); }
}

function timerDone() {
  timerStop(); TIMER.remainSecs = 0;
  document.getElementById('timer-digits').textContent = 'Done';
  document.getElementById('timer-seg-label').textContent = 'Session complete';
  document.getElementById('timer-ring').classList.remove('running'); document.getElementById('timer-ring').classList.add('done');
  document.getElementById('timer-ring').style.strokeDashoffset = 0;
  timerRenderSegs(); timerPing(true);
}

function timerRender() {
  const m = Math.floor(TIMER.remainSecs/60), s = TIMER.remainSecs%60;
  document.getElementById('timer-digits').textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  const seg = TIMER.segments[TIMER.segIdx];
  document.getElementById('timer-seg-label').textContent = seg ? seg.label : '—';
  const frac = TIMER.totalSecs > 0 ? TIMER.remainSecs / TIMER.totalSecs : 0;
  document.getElementById('timer-ring').style.strokeDashoffset = CIRCUMFERENCE * (1 - frac);
}

function timerRenderSegs() {
  const el = document.getElementById('timer-segments');
  if (!el || !TIMER.segments.length) { if(el) el.innerHTML=''; return; }
  el.innerHTML = TIMER.segments.map((seg, i) => {
    let cls = 'timer-seg-row';
    if (i === TIMER.segIdx) cls += ' active-seg';
    if (TIMER.doneSegs.has(i)) cls += ' done-seg';
    return `<div class="${cls}" onclick="timerJumpSeg(${i})"><div class="timer-seg-dot"></div><div class="timer-seg-name">${seg.label}</div><div class="timer-seg-time">${seg.minutes} min</div></div>`;
  }).join('');
  const total = TIMER.segments.reduce((a,b)=>a+b.minutes,0);
  el.innerHTML += `<div style="text-align:right;margin-top:6px;font-family:'DM Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:1px">TOTAL: ${total} MIN</div>`;
}

function timerJumpSeg(idx) {
  timerStop(); TIMER.segIdx = idx; TIMER.doneSegs.clear();
  for(let i=0;i<idx;i++) TIMER.doneSegs.add(i);
  timerInitSeg(); timerRenderSegs();
}

function timerPing(final=false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const tones = final ? [523,659,784] : [660,880];
    tones.forEach((freq,i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.18, t+0.02); gain.gain.linearRampToValueAtTime(0, t+0.35);
      osc.start(t); osc.stop(t+0.4);
    });
  } catch(e) {}
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
function init() {
  const wbr = document.getElementById('week-btn-row');
  if (wbr) {
    for (let i = 1; i <= 12; i++) {
      const b = document.createElement('button');
      b.className = 'btn btn-sm' + (i === 1 ? '' : ' btn-ghost');
      b.id = 'wbtn-' + i;
      b.textContent = 'Wk ' + i;
      b.onclick = () => setWeek(i);
      wbr.appendChild(b);
    }
  }
  buildDashSongs();
  buildCurriculum();
  buildMilestones();
  buildToneProfiles();
  buildSwapTable('sw-phase1', SWAPS.phase1, false, 1);
  buildSwapTable('sw-phase2', SWAPS.phase2, false, 2);
  buildSwapTable('sw-phase3', SWAPS.phase3, false, 3);
  buildSwapTable('sw-phase4', SWAPS.phase4 || [], false, 4);
  buildSwapTable('sw-phase5', SWAPS.phase5 || [], false, 5);
  buildSwapTable('sw-metalitch', SWAPS.metalitch, true, null);
  buildPersonalSection('sw-personal');
  buildAcousticSection('sw-acoustic');

  const savedNotes = localStorage.getItem('ngc-notes');
  if (savedNotes) document.getElementById('session-notes').value = savedNotes;
  setWeek(currentWeek);
  document.querySelectorAll('.check-row').forEach(row => {
    const key = row.querySelector('.check-label').textContent;
    if (checkedItems[key]) row.classList.add('done');
  });

  // New: restore block states and build streak
  restoreBlockStates();
  buildStreakCard();
  // Restore completion banner if today was already done
  checkSessionComplete();
  // Restore gear image URLs
  applyAllGearUrls();
}

document.addEventListener('DOMContentLoaded', init);
