# The Fret Shed

Personal guitar practice dashboard. Vanilla HTML/CSS/JS, deployed via GitHub Pages.

**Live:** https://thefretshed.com

---

## File Structure

```
shed_package/
├── index.html
├── css/styles.css
└── js/
    ├── app.js        ← all logic
    ├── data.js       ← edit content here
    ├── spotify.js
    └── claude.js
```

---

## Dashboard Layout — 4 rows, 2 columns

| Row | Content |
|---|---|
| 1 | Phase Hero — full width, slim |
| 2 | Tonight's Session (col 1) · Phase Songs (col 2) |
| 3 | Practice Streak (col 1) · Session Notes (col 2) |
| 4 | Active Resources — full width |

**Column proportions:** `1.4fr 1fr` — session/streak wider, songs/notes narrower.

**Phase Hero (Row 1):**
- Top line: phase badge + phase name (left) · Wk N/12 (right)
- Week focus text below
- 12 week buttons as status indicators: **done** (struck-through, muted) · **active** (accent highlight) · **not started** (default). Clicking a week marks all prior weeks done.

**Session card:** blocks (1.6fr) | timer+metro (1fr), left-bordered separator.

**Viewport preview (Settings → Admin):** Desktop (full dynamic) / Tablet (1024px) / Phone (390px). On mobile/tablet preview, week buttons reflow to 2 rows of 6.

---

## Block States

| State | Trigger |
|---|---|
| Idle | Default |
| Active | Click block body → loads timer |
| Complete | Click check button, or auto-advance from timer |

Auto-advance: timer completion marks block done, activates next incomplete block, holds for Start.

---

## localStorage Keys

`ngc-theme` · `ngc-preset-{theme}` · `ngc-custom-{theme}` · `ngc-week` · `ngc-block-{date}-{plan}-{idx}` · `ngc-practice-days` · `ngc-notes` · `ngc-checks` · `ngc-milestones` · `ngc-gear-url-{id}` · `ngc-song-status-{title}` · `ngc-viewport-preview`

---

## Planned

- The Shed tab: song workspaces (tempo, key, Spotify, PDF, MP3 audio)
- Claude-aware Interface card
- PDF viewer, CSV export, custom blocks, Add Gear form

---

## AWS Content Infrastructure

Private S3 bucket: `thefretshed-content`
- `books/` — curriculum PDFs (flat, all books at root of folder)
- `audio/` — lesson MP3s (flat, all files at root of folder)

IAM user: `thefretshed-content-user`
Policy: `TheFretShedContentAccess` (s3:GetObject on thefretshed-content/*)
Lambda: `getFretShedContentUrl` — generates pre-signed URLs (1hr expiry)
API Gateway: `thefretshed-content-api` — HTTP API, GET /get-url?key=books/filename.pdf

**Next session — wire API into app:**
1. Add Invoke URL as a config constant at top of `app.js` (e.g. `CONTENT_API_URL`)
2. Write `getContentUrl(key)` fetch helper in `app.js`
3. Add PDF and MP3 filenames per song in `data.js`
4. Build PDF button and audio player on song cards in The Shed tab
5. On click: call API → get pre-signed URL → open PDF in new tab or play MP3 inline

---

*Last updated: nav renamed/reordered — Dashboard / The Shed / Song Library / Rig & Tone; Phase Songs card clicks navigate to The Shed and scroll to song card; separate metronome & timer volume sliders in Settings; phone view timer centered. AWS content infrastructure live — S3 bucket, Lambda, API Gateway all working and validated.*
