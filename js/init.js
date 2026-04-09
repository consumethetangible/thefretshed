// INIT
// ═══════════════════════════════════════════
function init() {
  initTheme();
  initViewportPreview();
  const wbr = document.getElementById('week-btn-row');
  if (wbr) {
    for (let i = 1; i <= 12; i++) {
      const b = document.createElement('button');
      b.className = 'btn btn-week';
      b.id = 'wbtn-' + i;
      b.textContent = 'Week ' + i;
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

  setWeek(currentWeek);
  document.querySelectorAll('.check-row').forEach(row => {
    const key = row.querySelector('.check-label').textContent;
    if (checkedItems[key]) row.classList.add('done');
  });

  // Restore block states and build streak
  restoreBlockStates();
  stampBlockRefs();
  buildStreakCard();
  checkSessionComplete();
  setTimeout(timerLoadSession, 100);

  // Hydrate today's notes from DynamoDB
  loadTodayNotes().then(existing => {
    const area = document.getElementById('session-notes');
    if (area && existing) area.value = existing;
  }).catch(() => {
    // Fallback to localStorage if DynamoDB unavailable
    const saved = localStorage.getItem('ngc-notes');
    const area = document.getElementById('session-notes');
    if (area && saved) area.value = saved;
  });

  // Load milestone state from DynamoDB, then re-render
  loadAllMilestones().then(map => {
    milestonesDone = map;
    buildMilestones();
    updateMilestoneProgress();
  }).catch(() => {});

  // Load song statuses from DynamoDB into cache, then re-render all status-dependent UI
  loadAllSongStatuses().then(map => {
    _songStatusCache = map;
    buildDashSongs();
    buildCurriculum();
    buildMilestones();
  }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', init);
