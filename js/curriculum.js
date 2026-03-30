// ═══════════════════════════════════════════
// BUILD CURRICULUM
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// SHED SONG CARD HELPERS
// ═══════════════════════════════════════════
function shedStatusClass(status) { return status || 'ns'; }

function shedStatusPill(status) {
  const sc = shedStatusClass(status);
  const labels = { ns:'○ Not Started', ip:'◑ In Progress', lrn:'🎯 Learned', itf:'💎 In The Fingers' };
  return `<span class="shed-status-pill shed-s-${sc}">${labels[sc] || '○ Not Started'}</span>`;
}

function shedStatusSelect(title, status, stopProp = false) {
  const sc = shedStatusClass(status);
  const opts = Object.entries(SONG_STATUS_LABELS).map(([val, label]) =>
    `<option value="${val}" ${sc === val ? 'selected' : ''}>${SONG_STATUS_ICONS[val]} ${label}</option>`
  ).join('');
  const safe = title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const clickAttr = stopProp ? ' onclick="event.stopPropagation()"' : '';
  return `<select class="shed-status-select shed-s-${sc}"${clickAttr} onchange="shedHandleStatusChange(event,'${safe}')">${opts}</select>`;
}

function shedHandleStatusChange(e, title) {
  const newStatus = e.target.value;
  setSongStatus(title, newStatus);
  e.target.className = `shed-status-select shed-s-${newStatus}`;
  // Update card border/bg tint
  const card = e.target.closest('.shed-song-card');
  if (card) {
    // Update border and bg tint
    ['ns','ip','lrn','itf'].forEach(s => card.classList.remove('shed-card-' + s));
    card.classList.add('shed-card-' + newStatus);
    const header = card.querySelector('.shed-card-header');
    if (header) {
      ['ns','ip','lrn','itf'].forEach(s => header.classList.remove('shed-hbg-' + s));
      if (newStatus !== 'ns') header.classList.add('shed-hbg-' + newStatus);
    }
  }
  // Also sync Song Library, dashboard, and milestones
  rebuildPhaseHeader(parseInt(localStorage.getItem('ngc-current-phase') || '1'));
  buildDashSongs();
  buildMilestones();
}

function shedToggleCard(el) {
  el.classList.toggle('expanded');
  const body = el.querySelector('.shed-card-body');
  const chev = el.querySelector('.shed-chevron');
  if (body) body.style.display = el.classList.contains('expanded') ? 'block' : 'none';
  if (chev) chev.textContent = el.classList.contains('expanded') ? '▲' : '▼';
}

function shedToggleTone(cardId, btn) {
  const pop = document.getElementById('shed-tone-pop-' + cardId);
  if (!pop) return;
  const isOpen = pop.classList.contains('open');
  document.querySelectorAll('.shed-tone-popover').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.shed-btn-tone').forEach(b => b.classList.remove('active'));
  if (!isOpen) { pop.classList.add('open'); btn.classList.add('active'); }
}

function shedCloseTone(cardId) {
  const pop = document.getElementById('shed-tone-pop-' + cardId);
  if (pop) pop.classList.remove('open');
  const btn = document.getElementById('shed-tone-btn-' + cardId);
  if (btn) btn.classList.remove('active');
}

function shedGoToTone(song) {
  // Close any open popover
  document.querySelectorAll('.shed-tone-popover').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.shed-btn-tone').forEach(b => b.classList.remove('active'));
  showPanel('rig', null);
  showInner('rig', 'tones');
  document.querySelectorAll('#rig-tones .inner-tab, #panel-rig .inner-tab').forEach((t,i) => {
    if (t.textContent.trim() === 'Tone Profiles') t.classList.add('active');
    else t.classList.remove('active');
  });
  setTimeout(() => {
    const cards = document.querySelectorAll('.tone-profile-card');
    for (const card of cards) {
      const nameEl = card.querySelector('.tone-profile-name');
      if (nameEl && nameEl.textContent.trim() === song) {
        card.scrollIntoView({ behavior:'smooth', block:'center' });
        card.classList.add('expanded');
        card.querySelector('.tone-profile-body') && (card.querySelector('.tone-profile-body').style.display = 'block');
        break;
      }
    }
  }, 150);
}

function renderShedTonePopover(cardId, song) {
  const profile = TONE_PROFILES.find(t => t.song === song);
  if (!profile) return '';
  const chain = profile.chain.map(c => `<span class="shed-chain-item">${c}</span>`).join('<span class="shed-chain-arrow">→</span>');
  const safeId = cardId;
  const safeSong = song.replace(/'/g, "\\'");
  return `<div class="shed-tone-popover" id="shed-tone-pop-${safeId}">
    <div class="shed-tone-pop-header">
      <span class="shed-tone-pop-title">Tone — ${song}</span>
      <button class="shed-tone-pop-close" onclick="shedCloseTone('${safeId}')">✕</button>
    </div>
    <div class="shed-tone-row">
      <span class="shed-tone-key">Guitar</span><span class="shed-tone-val">${profile.guitar}</span>
      <span class="shed-tone-key">Amp</span><span class="shed-tone-val">${profile.amp}</span>
      <span class="shed-tone-key">Chain</span><div class="shed-chain-wrap">${chain}</div>
    </div>
    <div class="shed-tone-note">${profile.notes}</div>
    <button class="shed-btn-goto" onclick="shedGoToTone('${safeSong}')">View full profile in Rig &amp; Tone ↗</button>
  </div>`;
}

function renderShedSongCard(s, phaseId, cardId) {
  const status = getSongStatus(s.title);
  const sc = shedStatusClass(status);
  const hasTone = TONE_PROFILES.some(t => t.song === s.title);
  const refs = s.refs || [];
  const safeTitle = s.title.replace(/'/g, "\\'");
  const safeTitleAttr = s.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const tuningRow = s.tuning && s.tuning !== 'Standard'
    ? `<div class="shed-tuning-row"><span class="shed-detail-label">Tuning</span><span class="shed-tuning-val">${s.tuning}</span></div>` : '';

  const refsHtml = refs.length > 0
    ? refs.map(r => `<a class="shed-resource-link" href="#" onclick="event.preventDefault();shedOpenPdf('${r.book}',this)">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style="flex-shrink:0"><rect x="0.5" y="0.5" width="8" height="10" rx="1" stroke="currentColor" stroke-width="1"/><line x1="2" y1="3.5" x2="7" y2="3.5" stroke="currentColor" stroke-width="0.9"/><line x1="2" y1="5.5" x2="7" y2="5.5" stroke="currentColor" stroke-width="0.9"/><line x1="2" y1="7.5" x2="5" y2="7.5" stroke="currentColor" stroke-width="0.9"/></svg>
        <span>${r.label}</span>
      </a>`).join('')
    : `<span class="small muted">${s.resources}</span>`;

  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(s.title + ' ' + s.artist)}`;
  const ugUrl = (typeof UG_TABS !== 'undefined' && UG_TABS[s.title]) || `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(s.title + ' ' + s.artist)}`;

  const toneBtn = hasTone
    ? `<button class="shed-action-btn shed-btn-tone" id="shed-tone-btn-${cardId}" onclick="shedToggleTone('${cardId}',this);event.stopPropagation()">
        <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.2"/><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" stroke-width="1"/><line x1="6.5" y1="1" x2="6.5" y2="4.5" stroke="currentColor" stroke-width="1"/></svg>
        Tone
      </button>` : '';

  return `<div class="shed-song-card shed-card-${sc}" id="shed-card-${cardId}" data-title="${safeTitleAttr}">
    <div class="shed-card-header ${sc !== 'ns' ? 'shed-hbg-' + sc : ''}" onclick="shedToggleCard(this.closest('.shed-song-card'))">
      <span class="shed-card-num">${s.num}</span>
      <div class="shed-card-main">
        <div class="shed-card-title">${s.title}</div>
        <div class="shed-card-artist">${s.artist}</div>
      </div>
      <div class="shed-card-meta">
        ${shedStatusSelect(s.title, status, true)}
        <span class="shed-chevron">▼</span>
      </div>
    </div>
    <div class="shed-card-body" style="display:none">
      <div class="shed-detail-grid">
        <div>
          <div class="shed-detail-label">What it teaches</div>
          <div class="shed-detail-value">${s.teaches}</div>
        </div>
        <div>
          <div class="shed-detail-label">Resources</div>
          ${refsHtml}
          ${tuningRow}
        </div>
      </div>
      <div class="shed-skills">${s.skills.map(sk => `<span class="tag">${sk}</span>`).join('')}</div>
      <div class="shed-divider"></div>
      <div class="shed-action-row">
        ${renderShedTonePopover(cardId, s.title)}
        <button class="shed-action-btn shed-btn-spotify" id="shed-spot-btn-${cardId}" onclick="shedToggleSpotify('${cardId}','${safeTitle}','${s.artist.replace(/'/g,"\\'")}');event.stopPropagation()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          <span id="shed-spot-label-${cardId}">Spotify</span>
        </button>
        <a class="shed-action-btn shed-btn-ug" href="${ugUrl}" target="_blank" rel="noopener">
          <img src="data:image/png;base64,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" width="16" height="16" style="border-radius:3px;flex-shrink:0" alt="UG">
          Tab
        </a>
        ${toneBtn}
      </div>
      <div class="shed-spotify-player" id="shed-spot-player-${cardId}" style="display:none"></div>
    </div>
  </div>`;
}

async function shedOpenPdf(bookKey, btnEl) {
  const origHtml = btnEl ? btnEl.innerHTML : '';
  try {
    if (btnEl) { btnEl.style.opacity = '0.6'; btnEl.style.pointerEvents = 'none'; }
    const url = await getContentUrl('books/' + BOOKS[bookKey]);
    window.open(url, '_blank');
  } catch(e) {
    alert('Could not load PDF. Please try again.');
  } finally {
    if (btnEl) { btnEl.style.opacity = ''; btnEl.style.pointerEvents = ''; }
  }
}

// ─── Shed Spotify inline player ───────────────────────────────────────────────
async function shedToggleSpotify(cardId, title, artist) {
  // If not connected, fall back to opening Spotify search in new tab
  if (typeof isSpotifyConnected !== 'function' || !isSpotifyConnected()) {
    const url = `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`;
    window.open(url, '_blank');
    return;
  }

  const playerEl = document.getElementById('shed-spot-player-' + cardId);
  const btnEl    = document.getElementById('shed-spot-btn-' + cardId);
  const labelEl  = document.getElementById('shed-spot-label-' + cardId);
  if (!playerEl) return;

  // Toggle: if already loaded and visible, collapse it
  if (playerEl.style.display !== 'none') {
    playerEl.style.display = 'none';
    if (labelEl) labelEl.textContent = 'Spotify';
    return;
  }

  // If iframe already loaded, just show it
  if (playerEl.querySelector('iframe')) {
    playerEl.style.display = '';
    if (labelEl) labelEl.textContent = '▼ Spotify';
    return;
  }

  // First time: search and embed
  if (labelEl) labelEl.textContent = 'Loading…';
  if (btnEl)   btnEl.style.opacity = '0.6';

  const track = await searchSpotifyTrack(title, artist);

  if (btnEl) btnEl.style.opacity = '';

  if (!track) {
    if (labelEl) labelEl.textContent = 'Not found';
    setTimeout(() => { if (labelEl) labelEl.textContent = 'Spotify'; }, 2000);
    return;
  }

  playerEl.innerHTML = `<iframe
    src="https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0"
    width="100%" height="80" frameborder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"></iframe>`;
  playerEl.style.display = '';
  if (labelEl) labelEl.textContent = '▼ Spotify';
}

// ─── Phase completion ─────────────────────
function getCompletedPhases() { return JSON.parse(localStorage.getItem('ngc-completed-phases') || '[]'); }
function saveCompletedPhases(arr) { localStorage.setItem('ngc-completed-phases', JSON.stringify(arr)); }

function shedTogglePhaseComplete(phaseId, e) {
  e.stopPropagation();
  const completed = getCompletedPhases();
  const idx = completed.indexOf(phaseId);
  if (idx === -1) {
    completed.push(phaseId);
    // Advance active phase to next if completing the current one
    const currentPhase = parseInt(localStorage.getItem('ngc-current-phase') || '1');
    if (phaseId === currentPhase && phaseId < 5) {
      localStorage.setItem('ngc-current-phase', phaseId + 1);
    }
  } else {
    completed.splice(idx, 1);
    // If un-completing, make this phase active again
    localStorage.setItem('ngc-current-phase', phaseId);
  }
  saveCompletedPhases(completed);
  buildCurriculum();
  buildDashSongs();
  rebuildPhaseHeader(parseInt(localStorage.getItem('ngc-current-phase') || '1'));
}

// ─── Phase inner tab switching ────────────
function shedShowTab(phaseId, tab) {
  ['songs','weeks','milestones'].forEach(t => {
    const panel = document.getElementById(`shed-tab-${phaseId}-${t}`);
    const btn = document.getElementById(`shed-tabbtn-${phaseId}-${t}`);
    if (panel) panel.style.display = t === tab ? 'block' : 'none';
    if (btn) btn.classList.toggle('shed-tab-active', t === tab);
  });
}

// ─── Milestone rendering per phase ────────
function renderShedMilestones(phaseId) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase || !phase.milestones) return `<div class="small muted" style="padding:14px 0">Milestones will be defined when you reach this phase.</div>`;
  const completed = getCompletedPhases();
  const isCompleted = completed.includes(phaseId);

  const allStatuses = getAllSongStatuses();
  const aggItem = phase.milestones.find(m => m.type === 'aggregate');
  const manualItems = phase.milestones.filter(m => m.type === 'manual');
  const manualDone = manualItems.filter(m => milestonesDone[m.id]).length;
  const manualTotal = manualItems.length;
  const pct = Math.round((manualDone / manualTotal) * 100);
  const allDone = manualDone === manualTotal;

  let aggHtml = '';
  if (aggItem) {
    const allSongs = phase.songs.filter(s => !s.inOptions);
    const coreSongs = allSongs.filter(s => !s.reach);
    const qualified = coreSongs.filter(s => { const st = allStatuses[s.title] || 'ns'; return st === 'lrn' || st === 'itf'; });
    const threshold = aggItem.threshold;
    const aggPct = Math.min(100, Math.round((qualified.length / threshold) * 100));
    const pillHtml = allSongs.map(s => {
      const st = allStatuses[s.title] || 'ns';
      const statusCls = st === 'itf' ? 'itf' : st === 'lrn' ? 'lrn' : st === 'ip' ? 'ip' : '';
      const reachCls = s.reach ? 'reach' : '';
      return `<span class="milestone-song-pill ${statusCls} ${reachCls}" title="${s.reach ? 'Reach goal — bonus' : ''}">${s.title}${s.reach ? ' ★' : ''}</span>`;
    }).join('');
    aggHtml = `<div class="milestone-agg" style="margin-bottom:12px">
      <div class="milestone-agg-label">${aggItem.label}</div>
      <div class="prog-bar" style="margin:6px 0 4px"><div class="prog-fill green" style="width:${aggPct}%"></div></div>
      <div class="milestone-agg-count">${qualified.length} out of ${threshold} learned</div>
      <div class="milestone-song-pills">${pillHtml}</div>
    </div>`;
  }

  const items = manualItems.map(item => {
    const checked = !!milestonesDone[item.id];
    return `<div class="shed-milestone-item ${checked ? 'done' : ''}" onclick="shedToggleMilestone(this,'${item.id}',${phaseId})">
      <div class="shed-milestone-icon">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="shed-milestone-text">${item.label}</div>
    </div>`;
  }).join('');

  const completeBtn = isCompleted
    ? `<button class="shed-complete-btn shed-complete-done" onclick="shedTogglePhaseComplete(${phaseId}, event)">✓ Phase ${phaseId} Complete — Undo</button>`
    : allDone
      ? `<button class="shed-complete-btn shed-complete-ready" onclick="shedTogglePhaseComplete(${phaseId}, event)">Mark Phase ${phaseId} Complete →</button>`
      : `<button class="shed-complete-btn shed-complete-locked" disabled>${manualDone}/${manualTotal} milestones complete</button>`;

  return `<div style="padding: 4px 0">
    ${aggHtml}
    <div class="milestone-manual-label" style="margin-bottom:8px">Manual check-off</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span class="mono small dimmed">${manualDone} / ${manualTotal} complete</span>
      <span class="mono small" style="color:var(--accent)">${pct}%</span>
    </div>
    <div class="prog-bar" style="margin-bottom:16px"><div class="prog-fill green" style="width:${pct}%"></div></div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">${items}</div>
    ${completeBtn}
  </div>`;
}

function shedToggleMilestone(el, id, phaseId) {
  el.classList.toggle('done');
  const isDone = el.classList.contains('done');
  milestonesDone[id] = isDone;
  saveMilestone(id, isDone);
  // Refresh milestone tab to update progress and button state
  const panel = document.getElementById(`shed-tab-${phaseId}-milestones`);
  if (panel && panel.style.display !== 'none') {
    panel.innerHTML = renderShedMilestones(phaseId);
  }
  updateMilestoneProgress();
}

// ─── Week map per phase ───────────────────
// ── Week card status persistence ──────────────────────────────────────────────
function getAllWeekStatuses() { return JSON.parse(localStorage.getItem('ngc-week-status') || '{}'); }
function getWeekStatus(phaseId, range) { return getAllWeekStatuses()[`${phaseId}:${range}`] || 'ns'; }
function setWeekStatus(phaseId, range, status) {
  const all = getAllWeekStatuses();
  all[`${phaseId}:${range}`] = status;
  localStorage.setItem('ngc-week-status', JSON.stringify(all));
}

function weekStatusClass(status) {
  if (status === 'ip') return 'ip';
  if (status === 'done') return 'lrn';
  return 'ns';
}

function onWeekStatusChange(sel, phaseId, range) {
  const status = sel.value;
  setWeekStatus(phaseId, range, status);
  const card = sel.closest('.shed-week-card');
  if (!card) return;
  const sc = weekStatusClass(status);
  card.className = `shed-week-card shed-card-${sc}`;
  const hdr = card.querySelector('.shed-week-header');
  if (hdr) {
    hdr.className = `shed-week-header${sc !== 'ns' ? ' shed-hbg-' + sc : ''}`;
  }
  sel.className = `shed-status-select shed-s-${sc === 'lrn' ? 'lrn' : sc}`;
}

function shedToggleWeekCard(card) {
  const body = card.querySelector('.shed-week-body');
  const chev = card.querySelector('.shed-chevron');
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (chev) chev.textContent = isOpen ? '▼' : '▲';
}

// ── Audio folder browser (tabbed) ────────────────────────────────────────────
// Wrapper called from onclick — reads data attributes to avoid JSON-in-HTML issues
function weekOpenAudioBtn(btnEl) {
  const audioPrefixes = JSON.parse(decodeURIComponent(btnEl.dataset.prefixes));
  const cardId = btnEl.dataset.cardid;
  weekOpenAudio(audioPrefixes, btnEl, cardId);
}

// audioPrefixes is array of {prefix, label} objects
async function weekOpenAudio(audioPrefixes, btnEl, cardId) {
  const browserId = 'week-audio-browser-' + cardId;
  const existing = document.getElementById(browserId);

  // Toggle off if already open
  if (existing) {
    existing.remove();
    if (btnEl) { btnEl.classList.remove('active'); btnEl.disabled = false; }
    return;
  }

  if (btnEl) { btnEl.textContent = '⏳ Loading…'; btnEl.disabled = true; }

  try {
    // Fetch all folders in parallel
    const results = await Promise.all(audioPrefixes.map(async ({ prefix, label }) => {
      const res = await fetch(`${CONTENT_API_URL}/list-folder?prefix=${encodeURIComponent(prefix)}`);
      if (!res.ok) throw new Error('API error ' + res.status);
      const data = await res.json();
      const files = (data.files || []).filter(f => f.endsWith('.mp3'));
      return { prefix, label, files };
    }));

    // Build tab headers
    const tabs = results.map((r, i) =>
      `<button class="week-audio-tab${i===0?' active':''}" onclick="weekSwitchTab(this,'${browserId}',${i})">${r.label}</button>`
    ).join('');

    // Build file lists per tab
    const panels = results.map((r, i) => {
      const items = r.files.length
        ? r.files.map(key => {
            const name = key.replace(r.prefix, '').replace('.mp3', '');
            const safeKey = key.replace(/'/g, "\\'");
            return `<div class="week-audio-item" onclick="weekPlayFile('${safeKey}',this,'${cardId}')">${name}</div>`;
          }).join('')
        : '<div class="week-audio-empty">No audio files found.</div>';
      return `<div class="week-audio-panel${i===0?'':' hidden'}" data-tab="${i}">${items}</div>`;
    }).join('');

    const html = `<div class="week-audio-browser" id="${browserId}">
      <div class="week-audio-browser-header">
        <div class="week-audio-tabs">${tabs}</div>
        <button class="week-audio-close" onclick="weekCloseAudio('${browserId}')">✕</button>
      </div>
      <div class="week-audio-panels">${panels}</div>
    </div>`;

    const actionRow = btnEl ? btnEl.closest('.shed-week-action-row') : null;
    if (actionRow) actionRow.insertAdjacentHTML('afterend', html);

    if (btnEl) { btnEl.classList.add('active'); btnEl.textContent = '♫ Audio'; btnEl.disabled = false; }

  } catch(e) {
    if (btnEl) { btnEl.textContent = '♫ Audio'; btnEl.disabled = false; }
    alert('Could not load audio files. Please try again.');
  }
}

function weekCloseAudio(browserId) {
  const browser = document.getElementById(browserId);
  if (browser) browser.remove();
  // Reset audio button active state
  const btn = document.querySelector('.shed-btn-audio.active');
  if (btn) btn.classList.remove('active');
}

// ── Custom audio player ────────────────────────────────────────────────────────
function makeWeekPlayer(pid) {
  return `<div class="wap" id="wap-${pid}" style="display:none">
    <audio id="wap-audio-${pid}" preload="none"></audio>
    <div class="wap-top">
      <span class="wap-track" id="wap-track-${pid}">—</span>
      <button class="wap-close" onclick="weekClosePlayer('${pid}')">✕</button>
    </div>
    <div class="wap-controls">
      <button class="wap-btn wap-play" id="wap-play-${pid}" onclick="weekPlayerToggle('${pid}')">▶</button>
      <span class="wap-time wap-cur" id="wap-cur-${pid}">0:00</span>
      <div class="wap-scrub-wrap" onclick="weekPlayerSeek(event,this,'${pid}')">
        <div class="wap-scrub-track">
          <div class="wap-scrub-fill" id="wap-fill-${pid}"></div>
          <div class="wap-scrub-thumb" id="wap-thumb-${pid}"></div>
        </div>
      </div>
      <span class="wap-time wap-dur" id="wap-dur-${pid}">0:00</span>
      <button class="wap-btn wap-repeat" id="wap-rep-${pid}" onclick="weekToggleRepeat('${pid}',this)" title="Repeat">⟳</button>
    </div>
  </div>`;
}

function wapFmt(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

function weekPlayerToggle(pid) {
  const audio = document.getElementById('wap-audio-' + pid);
  const btn   = document.getElementById('wap-play-' + pid);
  if (!audio) return;
  if (audio.paused) { audio.play(); btn.textContent = '⏸'; }
  else              { audio.pause(); btn.textContent = '▶'; }
}

function weekPlayerSeek(e, wrap, pid) {
  const audio = document.getElementById('wap-audio-' + pid);
  if (!audio || !audio.duration) return;
  const rect = wrap.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
  wapUpdateScrub(pid);
}

function wapUpdateScrub(pid) {
  const audio = document.getElementById('wap-audio-' + pid);
  const fill  = document.getElementById('wap-fill-' + pid);
  const thumb = document.getElementById('wap-thumb-' + pid);
  const cur   = document.getElementById('wap-cur-'  + pid);
  const dur   = document.getElementById('wap-dur-'  + pid);
  if (!audio) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  if (fill)  fill.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  if (cur)   cur.textContent  = wapFmt(audio.currentTime);
  if (dur)   dur.textContent  = wapFmt(audio.duration);
}

function wapBindEvents(pid) {
  const audio = document.getElementById('wap-audio-' + pid);
  if (!audio || audio._wapBound) return;
  audio._wapBound = true;
  audio.addEventListener('timeupdate', () => wapUpdateScrub(pid));
  audio.addEventListener('loadedmetadata', () => wapUpdateScrub(pid));
  audio.addEventListener('ended', () => {
    const btn = document.getElementById('wap-play-' + pid);
    if (btn) btn.textContent = '▶';
  });
}

function weekClosePlayer(pid) {
  const audio   = document.getElementById('wap-audio-' + pid);
  const wrap    = document.getElementById('wap-' + pid);
  const repBtn  = document.getElementById('wap-rep-' + pid);
  const playBtn = document.getElementById('wap-play-' + pid);
  if (audio)   { audio.pause(); audio.src = ''; }
  if (repBtn)  repBtn.classList.remove('active');
  if (playBtn) playBtn.textContent = '▶';
  if (wrap)    wrap.style.display = 'none';
  document.querySelectorAll('.week-audio-item.active').forEach(i => i.classList.remove('active'));
}

function weekToggleRepeat(pid, btn) {
  const audio = document.getElementById('wap-audio-' + pid);
  if (!audio) return;
  audio.loop = !audio.loop;
  btn.classList.toggle('active', audio.loop);
}

function weekSwitchTab(tabEl, browserId, idx) {
  const browser = document.getElementById(browserId);
  if (!browser) return;
  browser.querySelectorAll('.week-audio-tab').forEach(t => t.classList.remove('active'));
  browser.querySelectorAll('.week-audio-panel').forEach(p => p.classList.add('hidden'));
  tabEl.classList.add('active');
  const panel = browser.querySelector(`.week-audio-panel[data-tab="${idx}"]`);
  if (panel) panel.classList.remove('hidden');
}

async function weekPlayFile(key, itemEl, cardId) {
  const browser = itemEl.closest('.week-audio-browser');
  if (browser) browser.querySelectorAll('.week-audio-item').forEach(i => i.classList.remove('active'));
  itemEl.classList.add('active');

  const wrap    = document.getElementById('wap-' + cardId);
  const audio   = document.getElementById('wap-audio-' + cardId);
  const track   = document.getElementById('wap-track-' + cardId);
  const playBtn = document.getElementById('wap-play-' + cardId);
  if (!wrap || !audio) return;

  const name = key.split('/').pop().replace('.mp3', '');
  if (track)   track.textContent = name;
  wrap.style.display = 'block';
  audio.src = '';
  if (playBtn) playBtn.textContent = '▶';
  wapUpdateScrub(cardId);
  wapBindEvents(cardId);

  try {
    const url = await getContentUrl(key);
    audio.src = url;
    audio.play();
    if (playBtn) playBtn.textContent = '⏸';
  } catch(e) {
    alert('Could not load audio. Please try again.');
  }
}

function renderShedWeeks(phase) {
  if (!phase.weeks || phase.weeks.length === 0) {
    return `<div class="small muted" style="padding:14px 0">Week map will be defined when you reach this phase.</div>`;
  }
  return phase.weeks.map(w => {
    const status = getWeekStatus(phase.id, w.range);
    const sc = weekStatusClass(status);
    const cardId = `wk-p${phase.id}-${w.range.replace(/[^a-z0-9]/gi,'').toLowerCase()}`;

    const statusSelect = `<select class="shed-status-select shed-s-${sc === 'lrn' ? 'lrn' : sc}"
      onchange="onWeekStatusChange(this,'${phase.id}','${w.range.replace(/'/g,"\\'")}');event.stopPropagation()"
      onclick="event.stopPropagation()">
      <option value="ns" ${status==='ns'?'selected':''}>○ Not Started</option>
      <option value="ip" ${status==='ip'?'selected':''}>◑ In Progress</option>
      <option value="done" ${status==='done'?'selected':''}>✓ Complete</option>
    </select>`;

    const refs = w.refs || [];
    const pdfIcon = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" style="flex-shrink:0"><rect x="0.5" y="0.5" width="8" height="10" rx="1" stroke="currentColor" stroke-width="1"/><line x1="2" y1="3.5" x2="7" y2="3.5" stroke="currentColor" stroke-width="0.9"/><line x1="2" y1="5.5" x2="7" y2="5.5" stroke="currentColor" stroke-width="0.9"/><line x1="2" y1="7.5" x2="5" y2="7.5" stroke="currentColor" stroke-width="0.9"/></svg>`;
    const makeRef = r => `<a class="shed-resource-link" href="#" onclick="event.preventDefault();shedOpenPdf('${r.book}',this)">${pdfIcon}<span>${r.label}</span></a>`;

    const universalRefs = [
      { label:'Beato Ear Training Booklet', book:'beato' },
      { label:'Ultimate Guitar Technique Practice', book:'technique' },
    ];
    const allRefs = [...refs, ...universalRefs];
    const refsHtml = allRefs.map(makeRef).join('');

    const audioPrefixes = w.audioPrefixes || [];
    const practicePrefix = [{ prefix:'audio/Guitar Practice Warmup Routines/', label:'Warmup Routines' }];
    const practiceBtnId = `week-practice-btn-${cardId}`;
    const examplesBtnId = `week-audio-btn-${cardId}`;

    const practiceBtn = `<button class="shed-action-btn shed-btn-practice" id="${practiceBtnId}"
        data-prefixes="${encodeURIComponent(JSON.stringify(practicePrefix))}"
        data-cardid="${cardId}-practice"
        onclick="weekOpenAudioBtn(this);event.stopPropagation()">
        ♫ Practice
      </button>`;

    const examplesBtn = audioPrefixes.length > 0
      ? `<button class="shed-action-btn shed-btn-audio" id="${examplesBtnId}"
          data-prefixes="${encodeURIComponent(JSON.stringify(audioPrefixes))}"
          data-cardid="${cardId}"
          onclick="weekOpenAudioBtn(this);event.stopPropagation()">
          ♫ Examples
        </button>`
      : '';

    return `<div class="shed-week-card shed-card-${sc}" id="shed-wcard-${cardId}">
      <div class="shed-week-header${sc !== 'ns' ? ' shed-hbg-' + sc : ''}" onclick="shedToggleWeekCard(this.closest('.shed-week-card'))">
        <div class="shed-week-header-main">
          <span class="shed-week-range">${w.range}</span>
          <span class="shed-week-title">${w.title}</span>
        </div>
        <div class="shed-card-meta">
          ${statusSelect}
          <span class="shed-chevron">▼</span>
        </div>
      </div>
      <div class="shed-week-body" style="display:none">
        <div class="shed-detail-grid">
          <div>
            <div class="shed-detail-label">Focus</div>
            <div class="shed-detail-value">${w.detail}</div>
          </div>
          <div>
            <div class="shed-detail-label">Resources</div>
            <div class="shed-week-refs">${refsHtml}</div>
          </div>
        </div>
        <div class="shed-week-action-row shed-divider-top">
          ${practiceBtn}
          <div class="wap wap-inline" id="wap-${cardId}-practice" style="display:none">
            <audio id="wap-audio-${cardId}-practice" preload="none"></audio>
            <div class="wap-controls">
              <button class="wap-btn wap-play" id="wap-play-${cardId}-practice" onclick="weekPlayerToggle('${cardId}-practice')">▶</button>
              <span class="wap-time wap-cur" id="wap-cur-${cardId}-practice">0:00</span>
              <div class="wap-scrub-wrap" onclick="weekPlayerSeek(event,this,'${cardId}-practice')">
                <div class="wap-scrub-track">
                  <div class="wap-scrub-fill" id="wap-fill-${cardId}-practice"></div>
                  <div class="wap-scrub-thumb" id="wap-thumb-${cardId}-practice"></div>
                </div>
              </div>
              <span class="wap-time wap-dur" id="wap-dur-${cardId}-practice">0:00</span>
              <button class="wap-btn wap-repeat" id="wap-rep-${cardId}-practice" onclick="weekToggleRepeat('${cardId}-practice',this)" title="Repeat">⟳</button>
              <button class="wap-close" onclick="weekClosePlayer('${cardId}-practice')">✕</button>
            </div>
            <div class="wap-track" id="wap-track-${cardId}-practice"></div>
          </div>
          ${examplesBtn}
          ${examplesBtn ? `<div class="wap wap-inline" id="wap-${cardId}" style="display:none">
            <audio id="wap-audio-${cardId}" preload="none"></audio>
            <div class="wap-controls">
              <button class="wap-btn wap-play" id="wap-play-${cardId}" onclick="weekPlayerToggle('${cardId}')">▶</button>
              <span class="wap-time wap-cur" id="wap-cur-${cardId}">0:00</span>
              <div class="wap-scrub-wrap" onclick="weekPlayerSeek(event,this,'${cardId}')">
                <div class="wap-scrub-track">
                  <div class="wap-scrub-fill" id="wap-fill-${cardId}"></div>
                  <div class="wap-scrub-thumb" id="wap-thumb-${cardId}"></div>
                </div>
              </div>
              <span class="wap-time wap-dur" id="wap-dur-${cardId}">0:00</span>
              <button class="wap-btn wap-repeat" id="wap-rep-${cardId}" onclick="weekToggleRepeat('${cardId}',this)" title="Repeat">⟳</button>
              <button class="wap-close" onclick="weekClosePlayer('${cardId}')">✕</button>
            </div>
            <div class="wap-track" id="wap-track-${cardId}"></div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── Main build ───────────────────────────
function buildCurriculum() {
  const colors = ['var(--p1c)','var(--p2c)','var(--p3c)','var(--p4c)','var(--p5c)'];
  const currentPhaseNum = parseInt(localStorage.getItem('ngc-current-phase') || '1');
  const completedPhases = getCompletedPhases();
  const songsContainer = document.getElementById('curriculum-songs');

  songsContainer.innerHTML = PHASES.map((phase, pi) => {
    const state = getCurriculumState(phase.id);
    const curriculumTitles = state.curriculum;
    const isActive = phase.id === currentPhaseNum;
    const isCompleted = completedPhases.includes(phase.id);
    const isOpen = isActive && !isCompleted;

    const songCards = curriculumTitles.map(title => {
      const s = phase.songs.find(so => so.title === title);
      if (!s) return '';
      const cardId = `p${phase.id}-${s.num}`;
      return renderShedSongCard(s, phase.id, cardId);
    }).join('');

    const completeBadge = isCompleted
      ? `<span class="shed-phase-complete-badge" onclick="shedTogglePhaseComplete(${phase.id}, event)" title="Click to undo">✓ Complete</span>`
      : '';

    const phaseHeader = `<div class="shed-phase-header ${isCompleted ? 'shed-phase-done' : ''}" onclick="shedTogglePhase(${phase.id})">
      <span class="badge badge-p${phase.id}">${phase.label}</span>
      <span class="shed-phase-name" style="color:${isCompleted ? 'var(--text3)' : colors[pi]}">${phase.name}</span>
      ${completeBadge}
      <span class="mono small dimmed" style="margin-left:auto">${phase.duration}</span>
      <span class="shed-phase-chevron" id="shed-phase-chev-${phase.id}">${isOpen ? '▲' : '▼'}</span>
    </div>`;

    // Per-phase tab strip
    const tabStrip = `<div class="shed-phase-tabs">
      <button class="shed-phase-tab shed-tab-active" id="shed-tabbn-${phase.id}-weeks" onclick="shedShowTab(${phase.id},'weeks')">Week Map</button>
      <button class="shed-phase-tab" id="shed-tabbn-${phase.id}-songs" onclick="shedShowTab(${phase.id},'songs')">Songs</button>
      <button class="shed-phase-tab" id="shed-tabbn-${phase.id}-milestones" onclick="shedShowTab(${phase.id},'milestones')">Milestones</button>
    </div>`;

    const phaseBody = `<div class="shed-phase-body" id="shed-phase-body-${phase.id}" style="display:${isOpen ? 'block' : 'none'}">
      ${tabStrip}
      <div id="shed-tab-${phase.id}-weeks" style="display:block">
        ${renderShedWeeks(phase)}
      </div>
      <div id="shed-tab-${phase.id}-songs" style="display:none">
        ${songCards || '<div class="small muted" style="padding:12px 0">No songs in curriculum yet — add them in Song Library.</div>'}
      </div>
      <div id="shed-tab-${phase.id}-milestones" style="display:none" class="shed-milestones-panel">
        ${renderShedMilestones(phase.id)}
      </div>
    </div>`;

    return `<div class="shed-phase-section ${isCompleted ? 'shed-phase-completed' : ''}" id="shed-phase-${phase.id}">
      ${phaseHeader}
      ${phaseBody}
    </div>`;
  }).join('');

  // Close tone popovers on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.shed-tone-popover') && !e.target.closest('.shed-btn-tone')) {
      document.querySelectorAll('.shed-tone-popover').forEach(p => p.classList.remove('open'));
      document.querySelectorAll('.shed-btn-tone').forEach(b => b.classList.remove('active'));
    }
  });
}

function shedTogglePhase(phaseId) {
  const body = document.getElementById('shed-phase-body-' + phaseId);
  const chev = document.getElementById('shed-phase-chev-' + phaseId);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (chev) chev.textContent = open ? '▼' : '▲';
}

function shedShowTab(phaseId, tab) {
  ['songs','weeks','milestones'].forEach(t => {
    const panel = document.getElementById(`shed-tab-${phaseId}-${t}`);
    const btn = document.getElementById(`shed-tabbn-${phaseId}-${t}`);
    if (panel) panel.style.display = t === tab ? 'block' : 'none';
    if (btn) btn.classList.toggle('shed-tab-active', t === tab);
  });
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
  const status = getSongStatus(title);
  const sc = statusClass(status);
  const songObj = phase.songs.find(s => s.title === title);
  const swapObj = swapData ? swapData.find(s => s.song === title) : null;
  const func = swapObj ? swapObj.func : (songObj ? songObj.teaches.split(',')[0] : '');
  const cardClass = `sl-card status-${sc}`;
  const statusOpts = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${sc === val ? 'selected' : ''}>${label}</option>`).join('');
  const safetitle = title.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return `<div class="${cardClass}" data-title="${title.replace(/"/g, '&quot;')}" data-phase="${phaseNum}" data-col="${col}">
    <div class="sl-card-top">
      <div style="flex:1"><div class="sl-card-title">${title}</div><div class="sl-card-artist">${songObj ? songObj.artist : ''}</div></div>
      <div style="display:flex;align-items:center;gap:6px">
        ${statusIconHtml(status)}
        <select class="status-select ${sc}" onclick="event.stopPropagation()" onchange="handleStatusChange(event, '${safetitle}', ${phaseNum})">${statusOpts}</select>
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
  const newStatus = e.target.value;
  setSongStatus(title, newStatus);
  e.target.className = `status-select ${newStatus}`;
  const card = e.target.closest('.sl-card');
  if (card) {
    card.classList.remove('status-ns','status-ip','status-lrn','status-itf');
    card.classList.add(`status-${newStatus}`);
    // Update the status icon in the card
    const iconSpan = card.querySelector('.status-badge');
    const newIcon = statusIconHtml(newStatus);
    if (iconSpan) {
      iconSpan.outerHTML = newIcon;
    } else if (newIcon) {
      const iconSlot = card.querySelector('.sl-card-top > div:last-child');
      if (iconSlot) iconSlot.insertAdjacentHTML('afterbegin', newIcon);
    }
  }
  // Rebuild phase header stats and progress bar
  rebuildPhaseHeader(phaseNum);
  refreshSiteFromCurriculum();
  buildMilestones();
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

function rebuildPhaseHeader(phaseNum) {
  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const state = getCurriculumState(phaseNum);
  const curriculumTitles = state.curriculum;
  const allStatSL = getAllSongStatuses();
  const slDone   = curriculumTitles.filter(t => { const s = allStatSL[t]||'ns'; return s==='lrn'||s==='itf'; }).length;
  const slInProg = curriculumTitles.filter(t => (allStatSL[t]||'ns')==='ip').length;
  const coreSongs = Math.min(curriculumTitles.length, 6);
  const slPct = coreSongs > 0 ? Math.round((slDone / coreSongs) * 100) : 0;

  // Update progress bar fill
  const layout = document.getElementById(`sl-layout-${phaseNum}`);
  if (!layout) return;
  const header = layout.closest('.inner-panel')?.previousElementSibling || layout.parentElement?.querySelector('[style*="prog-bar"]');
  // Find prog-fill within the phase header (sibling of sl-layout)
  const container = document.getElementById(`sw-phase${phaseNum}`);
  if (!container) return;
  const progFill = container.querySelector('.prog-fill');
  if (progFill) progFill.style.width = slPct + '%';
  // Update percentage text
  const pctEl = container.querySelector(`[style*="DM Mono"][style*="letter-spacing:1px"]`);
  if (pctEl) pctEl.textContent = slPct + '%';
  // Update in-progress and learned badges
  const headerDiv = container.querySelector('[style*="border-left"]');
  if (headerDiv) {
    const badgeRow = headerDiv.querySelector('[style*="align-items:center"][style*="gap:10px"]');
    if (badgeRow) {
      // Remove old dynamic badges
      badgeRow.querySelectorAll('.badge-active, .badge-done').forEach(b => b.remove());
      // Add updated ones
      if (slInProg > 0) badgeRow.insertAdjacentHTML('beforeend', `<span class="badge badge-active">${slInProg} in progress</span>`);
      if (slDone   > 0) badgeRow.insertAdjacentHTML('beforeend', `<span class="badge badge-done">${slDone} learned</span>`);
    }
  }
}

function refreshSiteFromCurriculum() {
  buildDashSongs();
  buildToneProfiles();
}

