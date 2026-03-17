# The Fret Shed

Personal guitar practice dashboard. Vanilla HTML/CSS/JS, deployed to AWS S3 + CloudFront.

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

## The Shed Tab — Song Cards

Each phase has expandable song workspace cards with:
- Status dropdown in card header (interactive, color-coded: ○ ns / ◑ ip / 🎯 lrn / 💎 itf)
- What it teaches + Resources columns
- Tuning displayed below resources (amber tag, non-Standard only)
- Skill tags
- Action buttons: Spotify (inline player toggle) · Tab (UG link) · Tone (popover)

**Spotify inline player:** clicking Spotify button searches for the track and embeds a compact 80px iframe player. Toggle to collapse. Falls back to Spotify search in new tab if not connected. Track IDs cached in localStorage.

---

## localStorage Keys

`ngc-theme` · `ngc-preset-{theme}` · `ngc-custom-{theme}` · `ngc-week` · `ngc-block-{date}-{plan}-{idx}` · `ngc-practice-days` · `ngc-notes` · `ngc-checks` · `ngc-milestones` · `ngc-gear-url-{id}` · `ngc-song-status-{title}` · `ngc-viewport-preview` · `ngc-spotify-token` · `ngc-spotify-expiry` · `ngc-spotify-track-{slug}`

---

## AWS Infrastructure

### Hosting (thefretshed.com)
- S3 bucket: `thefretshed` — static site hosting
- CloudFront distribution → S3 website endpoint
- ACM SSL cert (us-east-1) — auto-validated via Route 53
- Route 53 A alias records → CloudFront

**Deploy workflow (current):** manually push files to S3, then invalidate CloudFront (`/*`).

### Content (PDFs + Audio)
Private S3 bucket: `thefretshed-content`
- `books/` — curriculum PDFs
- `audio/` — lesson MP3s

IAM user: `thefretshed-content-user`
Policy: `TheFretShedContentAccess` (s3:GetObject + s3:ListBucket on thefretshed-content/*)
Lambda: `getFretShedContentUrl` — two routes:
- `GET /get-url?key=books/filename.pdf` — generates pre-signed URL (1hr expiry)
- `GET /list-folder?prefix=audio/folder-name/` — lists all objects under a prefix
API Gateway: `thefretshed-content-api` — HTTP API, auto-deploy enabled on `$default` stage

---

## Next Session Plan

### Backlog / Future
- Claude-aware Interface card (session context, practice suggestions)
- Session notes CSV export
- Custom session blocks
- Add Gear form (in-app, no S3 upload needed for metadata)
- Multi-user support via Cognito (future)
- Phases 4 & 5 Week Map data (currently empty `weeks:[]`)

---

## Backlog

- Claude-aware Interface card (session context, practice suggestions)
- Session notes CSV export
- Custom session blocks
- Add Gear form (in-app, no S3 upload needed for metadata)
- Multi-user support via Cognito (future)

---

## Gear

**Guitars:** Fender American Professional II Stratocaster, Gibson Les Paul Deluxe 70s Goldtop, Gibson Les Paul Studio Faded T 2016, Chapman ML3 Pro Bea, Yamaha Pacifica PAC611HFM, Martin SC-10E

**Amps:** Fender Blues Jr. 4 Tweed, Bugera 1990 Infinium 120W Head, Boss Katana Mk1 100W combo

**Gear images:** Hardcoded in `index.html` via `images/` folder — no localStorage dependency. To update an image, replace the file in `images/` and push.

---

*Last updated: Week Map cards complete — status dropdowns (Not Started/In Progress/Complete), expandable bodies with clickable PDF refs, tabbed audio browser (one ♫ Audio button per week, tabs per book folder, inline player with pre-signed URL playback); Lambda updated with `/list-folder` route; API Gateway `/list-folder` route added; gear images hardcoded from `images/` folder; Marshall DSL40CR replaced with Bugera 1990 Infinium; GitHub Actions CI/CD live.*
