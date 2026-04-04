// ═══════════════════════════════════════════
// modal.js — Practice Modal
// Opens when a session block is clicked.
// Owns its own timer state (PM_TIMER) so it
// doesn't conflict with the dashboard timer.
// ═══════════════════════════════════════════

// ─── State ───────────────────────────────────────────────────────────────────
const PM = {
  planId:   null,   // 'high' | 'low' | 'weekend'
  blockIdx: null,   // integer
  blockEl:  null,   // DOM element reference
  blockType: null,  // css class name e.g. 'warmup'
};

const PM_TIMER = {
  totalSecs: 0,
  remainSecs: 0,
  running: false,
  interval: null,
};
const PM_CIRCUMFERENCE = 2 * Math.PI * 54;

// ─── Open / Close ────────────────────────────────────────────────────────────

function openPracticeModal(blockEl, planId, blockIdx) {
  PM.planId   = planId;
  PM.blockIdx = blockIdx;
  PM.blockEl  = blockEl;

  // Read block data from DOM
  const timeEl   = blockEl.querySelector('.sblock-time');
  const headEl   = blockEl.querySelector('.sblock-head');
  const detailEl = blockEl.querySelector('.sblock-detail');
  const mins     = parseInt(timeEl ? timeEl.textContent : '0') || 0;
  const title    = headEl   ? headEl.textContent.trim()   : '';
  const detail   = detailEl ? detailEl.textContent.trim() : '';

  // Determine block type from classList for label colour
  const typeClasses = ['warmup','theory','songs','ear','explore','licks'];
  PM.blockType = typeClasses.find(c => blockEl.classList.contains(c)) || 'warmup';

  // Populate header
  document.getElementById('pm-block-type').textContent = PM.blockType;
  document.getElementById('pm-duration').textContent   = mins + ' min';
  document.getElementById('pm-title').textContent      = title;
  document.getElementById('pm-detail').textContent     = detail;

  // Build content buttons
  buildPmContentBtns(planId, blockIdx);

  // Initialise timer (not started)
  pmTimerInit(mins);

  // Sync metronome BPM display
  document.getElementById('pm-bpm-input').value = HM.bpm;
  syncPmMetroBtn();

  // Reset to normal action row, hide wrapup
  document.getElementById('pm-actions-normal').style.display = 'flex';
  document.getElementById('pm-wrapup').style.display         = 'none';
  document.getElementById('pm-keep-practicing').style.display = 'none';

  // Open
  document.getElementById('practice-modal-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePracticeModal() {
  pmTimerStop();
  if (HM.running) hmStop();
  document.getElementById('practice-modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
  PM.planId = PM.blockIdx = PM.blockEl = null;
}

function practiceModalBackdropClick(e) {
  // Only close if clicking the backdrop itself, not the modal card
  if (e.target === document.getElementById('practice-modal-backdrop')) {
    closePracticeModal();
  }
}

// Escape key support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('practice-modal-backdrop').classList.contains('open')) {
    closePracticeModal();
  }
});

// ─── Content Buttons ─────────────────────────────────────────────────────────
// Block data is stored as dataset attributes on .sblock elements by session.js

// Render a ref row: book button only.
function renderRefRow(ref, container) {
  const row = document.createElement('div');
  row.className = 'pm-ref-row';

  const btn = document.createElement('button');
  btn.className = 'pm-book-btn';
  btn.innerHTML = '<span class="pm-btn-icon">📖</span>' + ref.label;
  btn.onclick = () => openBookPdf(ref.book, btn);

  row.appendChild(btn);
  container.appendChild(row);
}

function buildPmContentBtns(planId, blockIdx) {
  const container = document.getElementById('pm-content-btns');
  container.innerHTML = '';

  const plan  = document.getElementById('plan-' + planId);
  if (!plan) return;
  const block = plan.querySelectorAll('.sblock')[blockIdx];
  if (!block) return;

  // ── Book / PDF refs (with completion checkboxes) ──
  const refsJson = block.dataset.refs;
  if (refsJson) {
    try {
      JSON.parse(refsJson).forEach(ref => renderRefRow(ref, container));
    } catch(e) {}
  }

  // ── Licks notes prompt (#59) ──
  if (block.dataset.isLicks) {
    const prompt = document.createElement('p');
    prompt.className = 'pm-licks-prompt';
    prompt.textContent = 'Note what you worked on in session notes.';
    container.appendChild(prompt);
  }

  // ── Song buttons: Spotify + Tab (#57) ──
  const songsJson = block.dataset.songs;
  if (songsJson) {
    try {
      const songs = JSON.parse(songsJson);
      songs.forEach(song => {
        // Spotify button — triggers inline player via spotify.js
        const spotifyBtn = document.createElement('button');
        spotifyBtn.className = 'pm-book-btn pm-spotify-btn';
        spotifyBtn.innerHTML = '<span class="pm-btn-icon">🎵</span>Spotify — ' + song.title;
        spotifyBtn.onclick = () => {
          spotifyBtn.disabled = true;
          spotifyBtn.innerHTML = '<span class="pm-btn-icon">⏳</span>Loading…';
          const container = document.getElementById('pm-content-btns');
          loadSpotifyCard(container, song.title, song.artist).finally(() => {
            spotifyBtn.remove();
          });
        };
        container.appendChild(spotifyBtn);

        // Tab button — opens Ultimate Guitar in new tab
        const tabUrl = typeof SONG_TABS !== 'undefined' && SONG_TABS[song.title];
        if (tabUrl) {
          const tabBtn = document.createElement('a');
          tabBtn.className = 'pm-book-btn pm-tab-btn';
          tabBtn.href = tabUrl;
          tabBtn.target = '_blank';
          tabBtn.rel = 'noopener';
          tabBtn.innerHTML = '<span class="pm-btn-icon">🎸</span>Tab — ' + song.title;
          container.appendChild(tabBtn);
        }
      });
    } catch(e) {}
  }

  // ── Audio examples (#56) ──
  const audioJson = block.dataset.audioPrefixes;
  if (audioJson) {
    try {
      JSON.parse(audioJson).forEach(ap => {
        const btn = document.createElement('button');
        btn.className = 'pm-book-btn pm-audio-btn';
        btn.innerHTML = '<span class="pm-btn-icon">🎵</span>' + ap.label;
        btn.onclick = () => openAudioFolder(ap.prefix, btn);
        container.appendChild(btn);
      });
    } catch(e) {}
  }
}

// ── Audio folder listing + pre-signed URL open (#56) ──
async function openAudioFolder(prefix, btnEl) {
  const originalHtml = btnEl ? btnEl.innerHTML : '';
  try {
    if (btnEl) { btnEl.innerHTML = '<span class="pm-btn-icon">⏳</span>Loading…'; btnEl.disabled = true; }
    const res = await fetch(`${CONTENT_API_URL}/list-folder?prefix=${encodeURIComponent(prefix)}`);
    if (!res.ok) throw new Error('list-folder error: ' + res.status);
    const data = await res.json();
    const files = (data.files || data.objects || data.keys || []).filter(f => f.key || f);
    if (!files.length) { alert('No audio files found for this section.'); return; }

    // Build a small picker if multiple files, otherwise open directly
    if (files.length === 1) {
      const key = files[0].key || files[0];
      const urlRes = await fetch(`${CONTENT_API_URL}/get-url?key=${encodeURIComponent(key)}`);
      const urlData = await urlRes.json();
      window.open(urlData.url, '_blank');
    } else {
      showAudioPicker(files, btnEl);
    }
  } catch(e) {
    alert('Could not load audio. Please try again.');
  } finally {
    if (btnEl) { btnEl.innerHTML = originalHtml; btnEl.disabled = false; }
  }
}

// Show a simple inline list of audio files under the button
function showAudioPicker(files, anchorBtn) {
  // Remove any existing picker
  const existing = document.getElementById('pm-audio-picker');
  if (existing) existing.remove();

  const picker = document.createElement('div');
  picker.id = 'pm-audio-picker';
  picker.className = 'pm-audio-picker';
  files.forEach(f => {
    const key = f.key || f;
    const name = key.split('/').pop().replace(/\.mp3$/i, '');
    const item = document.createElement('button');
    item.className = 'pm-audio-item';
    item.innerHTML = '<span class="pm-btn-icon">▶</span>' + name;
    item.onclick = async () => {
      item.textContent = '⏳ Loading…';
      item.disabled = true;
      try {
        const res = await fetch(`${CONTENT_API_URL}/get-url?key=${encodeURIComponent(key)}`);
        const data = await res.json();
        window.open(data.url, '_blank');
      } catch(e) { alert('Could not load file.'); }
      item.disabled = false;
      item.innerHTML = '<span class="pm-btn-icon">▶</span>' + name;
    };
    picker.appendChild(item);
  });
  anchorBtn.parentNode.insertBefore(picker, anchorBtn.nextSibling);
}

// ─── Modal Timer ─────────────────────────────────────────────────────────────

function pmTimerInit(mins) {
  pmTimerStop();
  PM_TIMER.totalSecs  = mins * 60;
  PM_TIMER.remainSecs = mins * 60;
  pmTimerRender();
  document.getElementById('pm-timer-start-btn').textContent = 'Start';
  document.getElementById('pm-timer-ring').style.strokeDashoffset = 0;
  document.getElementById('pm-timer-ring').classList.remove('running','done');
}

function pmTimerStart() {
  if (!PM_TIMER.totalSecs) return;
  PM_TIMER.running = true;
  document.getElementById('pm-timer-start-btn').textContent = 'Pause';
  document.getElementById('pm-timer-ring').classList.add('running');
  PM_TIMER.interval = setInterval(() => {
    if (PM_TIMER.remainSecs <= 0) {
      pmTimerComplete();
    } else {
      PM_TIMER.remainSecs--;
      pmTimerRender();
    }
  }, 1000);
}

function pmTimerStop() {
  PM_TIMER.running = false;
  clearInterval(PM_TIMER.interval);
  PM_TIMER.interval = null;
  const btn = document.getElementById('pm-timer-start-btn');
  if (btn) { btn.textContent = 'Start'; }
  const ring = document.getElementById('pm-timer-ring');
  if (ring) ring.classList.remove('running');
}

function pmTimerToggle() {
  PM_TIMER.running ? pmTimerStop() : pmTimerStart();
}

function pmTimerReset() {
  pmTimerStop();
  PM_TIMER.remainSecs = PM_TIMER.totalSecs;
  pmTimerRender();
  document.getElementById('pm-timer-ring').classList.remove('done');
  document.getElementById('pm-keep-practicing').style.display = 'none';
}

function pmTimerSkip() {
  pmTimerStop();
  PM_TIMER.remainSecs = 0;
  pmTimerRender();
  pmTimerComplete();
}

function pmTimerComplete() {
  pmTimerStop();
  PM_TIMER.remainSecs = 0;
  pmTimerRender();
  document.getElementById('pm-timer-ring').classList.add('done');
  document.getElementById('pm-keep-practicing').style.display = 'block';
  timerPing(false); // use existing audio ping from audio.js
}

function pmTimerRender() {
  const m = Math.floor(PM_TIMER.remainSecs / 60);
  const s = PM_TIMER.remainSecs % 60;
  const digits = document.getElementById('pm-timer-digits');
  if (digits) digits.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  const frac = PM_TIMER.totalSecs > 0 ? PM_TIMER.remainSecs / PM_TIMER.totalSecs : 0;
  const ring = document.getElementById('pm-timer-ring');
  if (ring) ring.style.strokeDashoffset = PM_CIRCUMFERENCE * (1 - frac);
}

function pmKeepPracticing() {
  // Add 5 minutes and restart
  PM_TIMER.totalSecs  += 5 * 60;
  PM_TIMER.remainSecs += 5 * 60;
  document.getElementById('pm-timer-ring').classList.remove('done');
  document.getElementById('pm-keep-practicing').style.display = 'none';
  pmTimerRender();
  pmTimerStart();
}

// ─── Metronome sync helpers ───────────────────────────────────────────────────

function syncPmMetroBtn() {
  const btn = document.getElementById('pm-metro-start-btn');
  if (!btn) return;
  if (HM.running) {
    btn.textContent = 'Stop';
    btn.classList.add('active');
  } else {
    btn.textContent = 'Start';
    btn.classList.remove('active');
  }
}

function syncPmBpmInput() {
  const input = document.getElementById('pm-bpm-input');
  if (input) input.value = HM.bpm;
}

// ─── Block Actions ────────────────────────────────────────────────────────────

function pmMarkComplete() {
  if (PM.planId === null || PM.blockIdx === null) return;

  // Stop timer + metro
  pmTimerStop();
  if (HM.running) hmStop();

  // Mark the block done in session.js
  markBlockComplete(PM.planId, PM.blockIdx);

  // Remove come-back flag if set
  if (PM.blockEl) PM.blockEl.classList.remove('come-back');

  // Check if all blocks are now done (session complete)
  const allDone = isSessionComplete(PM.planId);

  if (allDone) {
    pmShowWrapup();
  } else {
    closePracticeModal();
  }
}

function pmComeBack() {
  // Flag the block as started-but-incomplete
  if (PM.blockEl) PM.blockEl.classList.add('come-back');
  closePracticeModal();
}

// ─── Session Wrap-Up ─────────────────────────────────────────────────────────

function pmShowWrapup() {
  // Hide normal actions, show wrapup
  document.getElementById('pm-actions-normal').style.display = 'none';
  document.getElementById('pm-wrapup').style.display = 'block';

  // Pre-populate with any existing notes for today
  loadTodayNotes().then(existing => {
    const area = document.getElementById('pm-notes-input');
    if (area && existing) area.value = existing;
  }).catch(() => {});
}

async function pmSaveAndFinish() {
  const notes = document.getElementById('pm-notes-input').value.trim();
  // Collect completed block labels for the session record
  const blocksCompleted = getCompletedBlockLabels(PM.planId);
  try {
    await saveSession(blocksCompleted, notes);
  } catch(e) {
    console.warn('Session save failed:', e);
  }
  // Also save notes to notes card in dashboard if it exists
  const notesEl = document.getElementById('session-notes');
  if (notesEl && notes) notesEl.value = notes;
  closePracticeModal();
  // Show the session complete banner
  checkSessionComplete();
}

async function pmSkipNotes() {
  const blocksCompleted = getCompletedBlockLabels(PM.planId);
  try {
    await saveSession(blocksCompleted, '');
  } catch(e) {
    console.warn('Session save failed:', e);
  }
  closePracticeModal();
  checkSessionComplete();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSessionComplete(planId) {
  const plan = document.getElementById('plan-' + planId);
  if (!plan) return false;
  const blocks = plan.querySelectorAll('.sblock');
  if (!blocks.length) return false;
  return [...blocks].every((_, idx) =>
    localStorage.getItem(getBlockCheckKey(planId, idx)) === '1'
  );
}

function getCompletedBlockLabels(planId) {
  if (!planId) return [];
  const plan = document.getElementById('plan-' + planId);
  if (!plan) return [];
  const labels = [];
  plan.querySelectorAll('.sblock').forEach((block, idx) => {
    if (localStorage.getItem(getBlockCheckKey(planId, idx)) === '1') {
      const head = block.querySelector('.sblock-head');
      if (head) labels.push(head.textContent.trim());
    }
  });
  return labels;
}
