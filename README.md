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

- Phase Songs card: Tonight subsection + The Shed navigation
- Nav rename: Dashboard / The Shed / Song Library / Rig & Tone
- The Shed tab: song workspaces (tempo, key, Spotify, PDF)
- Claude-aware Interface card
- PDF viewer, CSV export, custom blocks, Add Gear form

---

*Last updated: session/songs ratio ~65/35; week buttons centered, done state color-only (no checkmark); row 3 swapped — notes left, streak right.*
