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

