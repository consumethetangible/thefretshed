// ═══════════════════════════════════════════
// HEADER METRONOME
// ═══════════════════════════════════════════
const HM = {
  bpm: 100, beat: 0, beatsPerBar: 4, running: false,
  ctx: null, nextBeatTime: 0, scheduleAheadTime: 0.1,
  intervalMs: 25, timerID: null, tapTimes: []
};

function setAudioVolume(type, val) {
  const key = type === 'metro' ? 'ngc-metro-volume' : 'ngc-timer-volume';
  const labelId = type === 'metro' ? 'metro-vol-label' : 'timer-vol-label';
  const normalized = parseInt(val) / 100;
  localStorage.setItem(key, normalized.toString());
  const label = document.getElementById(labelId);
  if (label) label.textContent = `${val}%`;
}

function getAudioVolume(type) {
  const key = type === 'metro' ? 'ngc-metro-volume' : 'ngc-timer-volume';
  return parseFloat(localStorage.getItem(key) ?? '0.7');
}


function hmGetCtx() {
  if (!HM.ctx) HM.ctx = new (window.AudioContext || window.webkitAudioContext)();
  return HM.ctx;
}

function hmScheduleBeat(time, isDownbeat) {
  const ctx = hmGetCtx();
  const vol = getAudioVolume('metro');
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.frequency.value = isDownbeat ? 1100 : 660;
  osc.type = 'square';
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(isDownbeat ? 0.22 * vol : 0.12 * vol, time + 0.002);
  gain.gain.linearRampToValueAtTime(0, time + (isDownbeat ? 0.06 : 0.045));
  osc.start(time); osc.stop(time + 0.08);
}

function hmScheduler() {
  const ctx = hmGetCtx();
  while (HM.nextBeatTime < ctx.currentTime + HM.scheduleAheadTime) {
    hmScheduleBeat(HM.nextBeatTime, (HM.beat % HM.beatsPerBar) === 0);
    HM.nextBeatTime += 60.0 / HM.bpm;
    HM.beat++;
  }
}

function hmStart() {
  if (HM.running) return;
  HM.running = true; HM.beat = 0;
  const ctx = hmGetCtx();
  if (ctx.state === 'suspended') ctx.resume();
  HM.nextBeatTime = ctx.currentTime + 0.05;
  HM.timerID = setInterval(hmScheduler, HM.intervalMs);
  const btn = document.getElementById('sm-start-btn');
  const input = document.getElementById('sm-bpm-input');
  if (btn) { btn.textContent = 'Stop'; btn.classList.add('active'); }
  if (input) input.classList.add('running');
}

function hmStop() {
  HM.running = false;
  clearInterval(HM.timerID); HM.timerID = null;
  const btn = document.getElementById('sm-start-btn');
  const input = document.getElementById('sm-bpm-input');
  if (btn) { btn.textContent = 'Start'; btn.classList.remove('active'); }
  if (input) input.classList.remove('running');
}

function hmToggle() { HM.running ? hmStop() : hmStart(); }

function hmSetBpm(val) {
  val = Math.max(40, Math.min(240, parseInt(val) || 100));
  HM.bpm = val;
  const input = document.getElementById('sm-bpm-input');
  if (input && document.activeElement !== input) input.value = val;
}

function hmTap() {
  const now = performance.now();
  HM.tapTimes.push(now);
  if (HM.tapTimes.length > 6) HM.tapTimes.shift();
  if (HM.tapTimes.length >= 2) {
    const gaps = [];
    for (let i = 1; i < HM.tapTimes.length; i++) gaps.push(HM.tapTimes[i] - HM.tapTimes[i-1]);
    const avg = gaps.reduce((a,b) => a+b, 0) / gaps.length;
    hmSetBpm(Math.round(60000 / avg));
    const input = document.getElementById('sm-bpm-input');
    if (input) input.value = HM.bpm;
  }
  const btn = document.getElementById('sm-tap-btn');
  if (btn) { btn.classList.add('tapped'); setTimeout(() => btn.classList.remove('tapped'), 100); }
}

// Shims for any legacy references
const METRO = { get bpm() { return HM.bpm; }, get running() { return HM.running; }, tapTimes: [] };
function metroToggle() { hmToggle(); }
function metroSetBpm(val) { hmSetBpm(val); }
function metroAdjust(delta) { hmSetBpm(HM.bpm + delta); }
function metroTap() { hmTap(); }
function metroStart() { hmStart(); }
function metroStop() { hmStop(); }

// ═══════════════════════════════════════════
// PRACTICE TIMER
// ═══════════════════════════════════════════
const TIMER = { segments:[], segIdx:0, totalSecs:0, remainSecs:0, running:false, waiting:false, interval:null, doneSegs:new Set() };
const CIRCUMFERENCE = 2 * Math.PI * 54;

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

function timerToggleCustom() {
  const expand = document.getElementById('timer-custom-expand');
  const btn = document.getElementById('timer-custom-toggle');
  const isOpen = expand.classList.contains('open');
  expand.classList.toggle('open', !isOpen);
  btn.classList.toggle('active', !isOpen);
  if (!isOpen) setTimeout(() => document.getElementById('timer-custom-min').focus(), 50);
}

function timerLoadCustom() {
  const val = parseInt(document.getElementById('timer-custom-min').value);
  if (!val || val < 1) return;
  timerStop(); TIMER.segments = [{label:'Practice', minutes:val}]; TIMER.segIdx = 0; TIMER.doneSegs.clear();
  timerInitSeg(); timerRenderSegs();
  document.getElementById('timer-mode-label').textContent = 'Custom';
  // Close the expand panel
  document.getElementById('timer-custom-expand').classList.remove('open');
  document.getElementById('timer-custom-toggle').classList.remove('active');
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
  TIMER.running = false; TIMER.waiting = false; clearInterval(TIMER.interval);
  const btn = document.getElementById('timer-start-btn');
  btn.textContent = 'Start'; btn.classList.remove('timer-btn-waiting');
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
  timerPing();
  clearInterval(TIMER.interval); TIMER.interval = null; TIMER.running = false; TIMER.waiting = true;
  document.getElementById('timer-ring').classList.remove('running');

  // If this was a single-block timer (block-activated), auto-advance to next block
  const activePlan = document.querySelector('.session-plan.active');
  const hasActiveBlock = activePlan && activePlan.querySelector('.sblock.active-block');
  if (hasActiveBlock) {
    TIMER.doneSegs.add(TIMER.segIdx);
    blockAutoComplete();
    return;
  }

  // Otherwise: standard session segment advance
  TIMER.doneSegs.add(TIMER.segIdx); TIMER.segIdx++;
  if (TIMER.segIdx >= TIMER.segments.length) { timerDone(); return; }
  timerInitSeg(); timerRenderSegs();
  const nextSeg = TIMER.segments[TIMER.segIdx];
  document.getElementById('timer-digits').textContent = 'Ready';
  document.getElementById('timer-seg-label').textContent = nextSeg ? nextSeg.label : '—';
  document.getElementById('timer-ring').style.strokeDashoffset = 0;
  const btn = document.getElementById('timer-start-btn');
  btn.textContent = 'Start'; btn.classList.add('timer-btn-waiting');
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
    const vol = getAudioVolume('timer');
    const tones = final ? [523,659,784] : [660,880];
    tones.forEach((freq,i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.18 * vol, t+0.02); gain.gain.linearRampToValueAtTime(0, t+0.35);
      osc.start(t); osc.stop(t+0.4);
    });
  } catch(e) {}
}

