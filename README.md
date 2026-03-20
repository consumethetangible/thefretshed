# The Fret Shed

Personal guitar practice dashboard. Vanilla HTML/CSS/JS, deployed to AWS S3 + CloudFront.

**Live:** https://thefretshed.com

---

## File Structure

```
thefretshed/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── theme.js        ← theme system, settings drawer, Color Mode picker
│   ├── session.js      ← block states, auto-advance
│   ├── streak.js       ← practice days, streak calc, heatmap
│   ├── ui.js           ← nav, week, checks, milestones, energy, notes
│   ├── curriculum.js   ← song cards, swap table, drag-drop, library state
│   ├── personal.js     ← personal + acoustic sections
│   ├── audio.js        ← metronome engine + practice timer
│   ├── viewport.js     ← admin viewport preview
│   ├── init.js         ← entry point (init())
│   ├── data.js         ← all curriculum/song/gear content — edit here
│   ├── spotify.js      ← Spotify OAuth + search + inline player
│   └── claude.js       ← Claude AI integration (stub)
├── images/             ← gear images (hardcoded in index.html)
├── tests/
│   └── streak.test.js  ← Vitest tests for calcStreaks
├── .github/
│   └── workflows/
│       ├── deploy.yml  ← deploys to S3 + CloudFront on push to main
│       └── test.yml    ← runs npm test on every PR to main
├── package.json        ← npm start (serve) + npm test (vitest)
└── README.md
```

---

## Local Development

```bash
npm install       # first time only
npm start         # serves at http://localhost:3000
npm test          # runs Vitest test suite
npm run test:watch  # runs tests in watch mode
```

**Standard test-before-merge workflow:**
```bash
git checkout fix/your-branch-name   # switch to the branch being tested
npm start                           # serves at http://localhost:3000
# test in browser, Ctrl+C to stop
# if good → open PR on GitHub and merge → auto-deploys
```

---

## Git Workflow

- `main` — production branch, protected. No direct pushes.
- All changes go through a feature branch + PR.
- PRs require 0 approvals (self-merge ok) but must pass CI tests.
- GitHub Actions runs `npm test` on every PR before merge.
- Merging to `main` auto-deploys to S3 + CloudFront.

**Branch naming:**
- `feature/description` — new functionality
- `chore/description` — tooling, config, cleanup
- `fix/description` — bug fixes

---

## Session Workflow (Claude + Chris)

Claude opens each session by fetching this README via curl from GitHub main branch,
then checks open Issues on the project board before any work begins.

**Session start sequence:**
1. `curl` README from `main` → establish current state
2. Check GitHub Issues board for open bugs and priorities
3. Confirm what we're working on, then build

**How Claude makes changes:**
- Uses Desktop Commander (`allowedDirectories: /Users/christophervoss/Documents/thefretshed`)
- Edits files directly in the local repo via `edit_block`
- Creates branch, commits, and pushes via `start_process` (git CLI)
- Opens PR via Claude in Chrome browser automation
- Merges PR → CI runs → auto-deploys to S3 + CloudFront

**Key principles:**
- Collect → plan → build. Confirm approach before writing code.
- One PR per logical fix. Keep commits clean and descriptive.
- All backlog items tracked as GitHub Issues. No verbal backlogs.
- README updated at end of every session as the handoff artifact.

**Known limitation:** The built-in GitHub connector in Claude.ai (Settings → Connectors) is
OAuth read-context only — it does not give Claude tool-callable API access. Full automation
(create issues, push files without local repo) requires the custom GitHub MCP server (Issue #36).

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
- S3 bucket: `thefretshed.com` — static site hosting
- CloudFront distribution → S3 website endpoint
- ACM SSL cert (us-east-1) — auto-validated via Route 53
- Route 53 A alias records → CloudFront
- IAM user: `thefretshed-deploy` — S3 sync + CloudFront invalidation
- GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFRONT_DISTRIBUTION_ID`

**Deploy workflow:** push to `main` → GitHub Actions syncs to S3 + invalidates CloudFront (`/*`). No manual steps.

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

## GitHub Project Board

**The Fret Shed** project board at github.com/consumethetangible/thefretshed/projects

Columns: Backlog → Ready → In Progress → **Bugs** → Done

Labels: `bug` · `ux` · `feature` · `engineering` · `data` · `investigate` · `priority-1` · `priority-2` · `priority-3` · `priority-4`

All backlog items are filed as Issues with labels and priority. Promote issues from Backlog → Ready before starting work. Active bugs and defects go in the **Bugs** column.

---

## Gear

**Guitars:** Fender American Professional II Stratocaster, Gibson Les Paul Deluxe 70s Goldtop, Gibson Les Paul Studio Faded T 2016, Chapman ML3 Pro Bea, Yamaha Pacifica PAC611HFM, Martin SC-10E

**Amps:** Fender Blues Jr. 4 Tweed, Bugera 1990 Infinium 120W Head, Boss Katana Mk1 100W combo

**Gear images:** Hardcoded in `index.html` via `images/` folder — no localStorage dependency. To update an image, replace the file in `images/` and push.

---

## Known Issues (Active Bugs)

Tracked in GitHub Issues under the **Bugs** column on the project board.

| # | Issue | Status |
|---|---|---|
| #37 | Settings Color Mode dropdown hardcoded to "Dark" | Fixed, merged |
| #39 | Color Mode Edit button doesn't switch theme; drawer full-screen height | Fixed, merged |
| — | Settings drawer missing bottom border + wrong top offset | Fixed, merged |
| #2 | Fix Light Mode — broken/hard to use | Fixed, merged |
| #3 | Settings panel reorganization | Fixed, merged |
| #4 | Easier way to exit Settings | Fixed, merged |

---

## Next Up — Priority 1 UX Fixes

All tracked as GitHub Issues with `priority-1` label. Work in this order:

1. **#5** Secure login page
2. **#6** Site logo + browser favicon

---

## Engineering Backlog

| # | Item | Status |
|---|---|---|
| — | Split curriculum.js (1100+ lines) | Open |
| — | Expand Vitest coverage beyond streak module | Open |

---

*Last updated: Mar 20, 2026 — Session 2. Fixed settings drawer border + top offset. Rebuilt Light theme palettes (proper bg layering, high contrast, cool neutral Cream default). Settings panel reorganized: Preferences first (with Audio merged in), Spotify, Data Management, Admin, App Info last. Gear icon now toggles settings open/close. Color Mode Save button closes picker and returns to Settings. Overlay dim added. VERSION constant added to theme.js (now at 2.1). Close #2, #3, #4 manually in GitHub. Next: #5 Secure login page, #6 Logo + favicon.*
