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

// Clicking a block body activates it: highlights it and loads its duration into the timer
function activateBlock(blockEl, planId, blockIdx) {
  const plan = document.getElementById('plan-' + planId);
  if (!plan) return;

  // Clear active from all blocks in this plan
  plan.querySelectorAll('.sblock').forEach(b => b.classList.remove('active-block'));
  blockEl.classList.add('active-block');

  // Load this block's duration into the timer
  const timeEl = blockEl.querySelector('.sblock-time');
  const headEl = blockEl.querySelector('.sblock-head');
  if (timeEl && headEl) {
    const mins = parseInt(timeEl.textContent);
    if (!isNaN(mins)) {
      timerStop();
      TIMER.segments = [{ label: headEl.textContent.trim(), minutes: mins }];
      TIMER.segIdx = 0; TIMER.doneSegs.clear();
      timerInitSeg(); timerRenderSegs();
      const lbl = document.getElementById('timer-mode-label');
      if (lbl) lbl.textContent = headEl.textContent.trim().substring(0, 22);
    }
  }
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

