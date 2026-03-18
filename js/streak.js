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

