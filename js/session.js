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

// ── 3-state block system: idle / active / complete ──

// Stamp data-refs on each block so the modal can build content buttons.
// Called once from init.js after DOM is ready.
function stampBlockRefs() {
  // Week refs come from PHASES[0].weeks[currentWeek-1].refs
  // We map them onto the theory/book blocks by position.
  // For now we attach current-week refs to any .theory block in the active plan.
  try {
    const phase = PHASES[0];
    const weekIdx = Math.min(Math.floor((currentWeek - 1) / 2), phase.weeks.length - 1);
    const week = phase.weeks[weekIdx];
    if (!week || !week.refs || !week.refs.length) return;
    const refsJson = JSON.stringify(week.refs);
    document.querySelectorAll('.sblock.theory, .sblock.ear').forEach(block => {
      block.dataset.refs = refsJson;
    });
  } catch(e) {}
}

// Clicking a block body opens the practice modal
function activateBlock(blockEl, planId, blockIdx) {
  // Don't open if already completed
  if (blockEl.classList.contains('completed')) return;
  openPracticeModal(blockEl, planId, blockIdx);
}

// Check button (stopPropagation'd from block click): toggle complete state
function markBlockComplete(planId, blockIdx) {
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

// Auto-advance on timer complete: mark current active block done, activate next incomplete
function blockAutoComplete() {
  const activePlan = document.querySelector('.session-plan.active');
  if (!activePlan) return;
  const planId = activePlan.id.replace('plan-', '');
  const activeBlock = activePlan.querySelector('.sblock.active-block');

  if (activeBlock) {
    const idx = parseInt(activeBlock.dataset.idx);
    if (!isNaN(idx)) {
      localStorage.setItem(getBlockCheckKey(planId, idx), '1');
      syncBlockState(planId, idx);
      activeBlock.classList.remove('active-block');
    }
  }

  // Find next incomplete block
  const allBlocks = [...activePlan.querySelectorAll('.sblock')];
  const nextBlock = allBlocks.find(b => {
    const i = parseInt(b.dataset.idx);
    return !isNaN(i) && !b.classList.contains('completed');
  });

  if (nextBlock) {
    const nextIdx = parseInt(nextBlock.dataset.idx);
    activateBlock(nextBlock, planId, nextIdx);
    // Hold — load timer but don't start. User presses Start.
    timerStop();
    timerInitSeg();
    timerRenderSegs();
  }

  checkSessionComplete();
}

// Legacy shim
function toggleBlockComplete(planId, blockIdx) { markBlockComplete(planId, blockIdx); }

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

