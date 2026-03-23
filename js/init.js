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

  const savedNotes = localStorage.getItem('ngc-notes');
  if (savedNotes) document.getElementById('session-notes').value = savedNotes;
  setWeek(currentWeek);
  document.querySelectorAll('.check-row').forEach(row => {
    const key = row.querySelector('.check-label').textContent;
    if (checkedItems[key]) row.classList.add('done');
  });

  // New: restore block states and build streak
  restoreBlockStates();
  stampBlockRefs();
  buildStreakCard();
  // Restore completion banner if today was already done
  checkSessionComplete();
  // Load session timer by default
  setTimeout(timerLoadSession, 100);
}

document.addEventListener('DOMContentLoaded', init);
