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
Policy: `TheFretShedContentAccess` (s3:GetObject on thefretshed-content/*)
Lambda: `getFretShedContentUrl` — generates pre-signed URLs (1hr expiry)
API Gateway: `thefretshed-content-api` — HTTP API, GET /get-url?key=books/filename.pdf

---

## Next Session Plan

### 1. GitHub → AWS CI/CD (do first)
Set up GitHub Actions to auto-deploy to S3 + CloudFront invalidation on every push to `main`. Goal: GitHub is source of truth, S3 always stays in sync automatically.

Steps:
- Add AWS credentials to GitHub repo secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFRONT_DISTRIBUTION_ID`)
- Create `.github/workflows/deploy.yml` — on push to main: sync `shed_package/` to S3, then invalidate CloudFront
- Test: push a change, confirm it goes live without manual upload

### 2. Gear & Tone — image fixes
Images in the Gear and Tone section are broken/missing. Audit what's stored (localStorage `ngc-gear-url-{id}`), fix the upload/display flow.

### 3. Week Map cards + API wiring
The Shed song cards need the week map panel and the full PDF/audio content wiring:
- Wire `CONTENT_API_URL` constant into `app.js`
- Write `getContentUrl(key)` fetch helper
- Add PDF and MP3 filenames per song in `data.js`
- PDF button: call API → pre-signed URL → open in new tab
- Audio player: call API → pre-signed URL → play inline

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

*Last updated: GitHub Actions CI/CD live (push to main → auto-deploy S3 + CloudFront invalidation); gear images hardcoded from images/ folder; Marshall DSL40CR replaced with Bugera 1990 Infinium; URL editor panels removed; Week Map/API wiring queued next.*
