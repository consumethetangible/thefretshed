// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// GEAR IMAGE URL MANAGEMENT — removed (images now hardcoded)
// ═══════════════════════════════════════════

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
  const curEl = document.getElementById('current-week');
  if (curEl) curEl.textContent = w;
  // Apply 3-state styling to all week buttons
  document.querySelectorAll('[id^="wbtn-"]').forEach(b => {
    const num = parseInt(b.id.replace('wbtn-', ''));
    b.classList.remove('btn-week-active', 'btn-week-done');
    if (num === w) b.classList.add('btn-week-active');
    else if (num < w) b.classList.add('btn-week-done');
  });
  const wf = WEEK_DATA[Math.min(Math.floor((w-1)/2), WEEK_DATA.length-1)];
  const focusEl = document.getElementById('week-focus-text');
  if (focusEl) focusEl.textContent = wf.detail;
  // progress bar may not exist in new layout — guard
  const prog = document.getElementById('phase-progress');
  if (prog) prog.style.width = Math.round((w / 12) * 100) + '%';
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
  // Clear active-block highlight from all plans on switch
  document.querySelectorAll('.sblock').forEach(b => b.classList.remove('active-block'));
  // Stop timer and reload for new plan
  timerStop();
  setTimeout(timerLoadSession, 50);
  checkSessionComplete();
}

function setEnergyAndTimer(level) {
  setEnergy(level);
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

function toggleSongCard(el) {
  el.classList.toggle('expanded');
  if (el.classList.contains('expanded')) {
    const nameEl   = el.querySelector('.song-card-name');
    const artistEl = el.querySelector('.song-card-artist');
    if (nameEl && artistEl && typeof initSpotifyPlayer === 'function') {
      initSpotifyPlayer(el, nameEl.textContent.trim(), artistEl.textContent.trim());
    }
  }
}
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
    const status = getSongStatus(title);
    const sc = statusClass(status);
    return `<div class="song-row" style="cursor:pointer;border-left:3px solid var(--status-${sc});background:linear-gradient(to right, var(--status-${sc}-bg) 0%, transparent 15%)" onclick="goToSongInLibrary('${title.replace(/'/g, "\\'")}', ${phaseNum})">
      <div style="flex:1"><div class="song-title">${title}</div><div class="song-artist">${artist}</div></div>
      <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${statusIconHtml(status)}</div>
    </div>`;
  }).join('') || '<div class="small muted">No songs in curriculum yet.</div>';
}

function goToSongInLibrary(title, phaseNum) {
  showPanel('swaps', null);
  showInner('sw', 'phase' + phaseNum);
  // Also activate the correct inner-tab button
  document.querySelectorAll('#panel-swaps .inner-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === (phaseNum - 1));
  });
  setTimeout(() => {
    const cards = document.querySelectorAll('.sl-card');
    for (const card of cards) {
      const nameEl = card.querySelector('.sl-card-title');
      if (nameEl && nameEl.textContent.trim() === title) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('drop-target');
        setTimeout(() => card.classList.remove('drop-target'), 1800);
        break;
      }
    }
  }, 120);
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
  return { curriculum: phase.songs.filter(s => !s.inOptions).map(s => s.title), stretch: null };
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
function statusIconHtml(status) { const s = statusClass(status); if (s === 'ns') return ''; return `<span class="status-badge ${s}" title="${SONG_STATUS_LABELS[s]}">${SONG_STATUS_ICONS[s]}</span>`; }
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

