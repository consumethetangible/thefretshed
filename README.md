# The Fret Shed

Personal guitar practice dashboard. Vanilla HTML/CSS/JS, deployed to AWS S3 + CloudFront.

**Live:** https://thefretshed.com

---

## File Structure

```
thefretshed/
├── index.html
├── login.html          ← password gate, sets userId in sessionStorage
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
│   ├── progress.js     ← DynamoDB progress API (sessions, songs, books, milestones)
│   ├── spotify.js      ← Spotify OAuth + search + inline player
│   └── claude.js       ← Claude AI integration (stub)
├── images/             ← gear images (hardcoded in index.html)
├── scripts/
│   └── setup-dynamodb.mjs  ← one-time DynamoDB table provisioning script
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
- Opens PR via GitHub REST API using PAT stored at `~/.thefretshed-mcp-env`
- Merges PR → CI runs → auto-deploys to S3 + CloudFront

**GitHub writes (issues, PRs):**
- GitHub MCP connector is read-only — write ops return 403
- Workaround: PAT + GitHub REST API via bash_tool
- PAT stored at `~/.thefretshed-mcp-env` (chmod 600) — never commit this file
- Usage: `source ~/.thefretshed-mcp-env && curl -X POST ... -H "Authorization: Bearer $GITHUB_TOKEN"`

**Key principles:**
- Collect → plan → build. Confirm approach before writing code.
- One PR per logical fix. Keep commits clean and descriptive.
- All backlog items tracked as GitHub Issues. No verbal backlogs.
- README updated at end of every session as the handoff artifact.

---

## Auth & Progress Architecture

**Login:** `login.html` — hardcoded credentials per user. On success, sets `userId` in
`sessionStorage`. `index.html` redirects to login if no session found.
Designed to swap to Cognito (#31) without redesigning the UI.

**Users:** defined in `USERS` object in `login.html`. Add entries manually to grant access.

**Progress storage:** All progress data lives in DynamoDB (`thefretshed-progress` table).
`localStorage` is used only for UI preferences (theme, Spotify token/cache).

**progress.js API:**
- `saveSession(blocksCompleted, notes)` — save today's session
- `loadAllSessions()` — all sessions for streak/heatmap
- `savePosition(week, phase)` / `loadPosition()` — curriculum position
- `saveSongStatus(title, status)` / `loadAllSongStatuses()` — song progress
- `saveBookChapter(bookKey, chapter)` / `loadBookProgress(bookKey)` — book completions
- `saveMilestone(id)` / `loadAllMilestones()` — milestone tracking
- `calcStreakFromBackend()` — streak derived from session records
- `saveNotes(notes)` / `loadTodayNotes()` — session notes

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

**Viewport preview (Settings → Admin):** Desktop (full dynamic) / Tablet (1024px) / Phone (390px).

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

---

## localStorage Keys (UI prefs only — progress is in DynamoDB)

`ngc-theme` · `ngc-preset-{theme}` · `ngc-custom-{theme}` · `ngc-viewport-preview`
`ngc-spotify-token` · `ngc-spotify-expiry` · `ngc-spotify-track-{slug}`

---

## AWS Infrastructure

### Hosting (thefretshed.com)
- S3 bucket: `thefretshed.com` — static site hosting
- CloudFront distribution → S3 website endpoint
- ACM SSL cert (us-east-1) — auto-validated via Route 53
- Route 53 A alias records → CloudFront
- IAM user: `thefretshed-deploy` — S3 sync + CloudFront invalidation + DynamoDB + Lambda
- GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFRONT_DISTRIBUTION_ID`

**Deploy workflow:** push to `main` → GitHub Actions syncs to S3 + invalidates CloudFront (`/*`). No manual steps.

### Progress Database
- DynamoDB table: `thefretshed-progress` (us-east-1, PAY_PER_REQUEST)
- Partition key: `userId` (string) · Sort key: `sk` (string)
- SK patterns: `SESSION#YYYY-MM-DD` · `SONG#title` · `BOOK#key#chapter` · `MILESTONE#id` · `POSITION`

### Content (PDFs + Audio)
Private S3 bucket: `thefretshed-content`
- `books/` — curriculum PDFs · `audio/` — lesson MP3s

IAM user: `thefretshed-content-user`
Lambda: `getFretShedContentUrl` — routes:
- `GET /get-url?key=` — pre-signed URL (1hr expiry)
- `GET /list-folder?prefix=` — list objects under prefix
- `GET /progress?userId=&sk=` — fetch single progress record
- `PUT /progress` — write progress record (body: `{ userId, sk, ...data }`)
- `GET /progress/list?userId=&skPrefix=` — list records by prefix

API Gateway: `thefretshed-content-api` — HTTP API, auto-deploy on `$default` stage

---

## GitHub Project Board

Columns: Backlog → Ready → In Progress → **Bugs** → Done

Labels: `bug` · `ux` · `feature` · `engineering` · `data` · `investigate` · `priority-1` · `priority-2` · `priority-3` · `priority-4`

---

## Priority 1 Queue

| # | Issue | Status |
|---|---|---|
| #46 | Epic: Unified Session + Progress Tracking | 🔵 In Progress |
| #47 | DynamoDB backend + data schema | ✅ Done (PR #53) |
| #48 | Login page — simple password gate | ✅ Done (PR #53) |
| #49 | Unified Session View — practice modal | ✅ Done (PR #55) |
| #50 | Book/exercise progress tracking | 🔲 Next |
| #51 | Milestone auto-calculation | 🔲 Queued |
| #52 | Progress history + streak from backend | 🔲 Queued |
| #6  | Site logo + browser favicon | 🔲 After epic |

---

*Last updated: Mar 23, 2026 — Modal content buttons shipped (PR pending). `session.js` stamps all block types with content data: theory/ear get book refs + audio prefixes, warmup gets Technique Collection link, licks get week-specific 300 Licks ref, songs get active song refs. `modal.js` renders PDF buttons for all block types, audio folder picker (#56), licks notes prompt (#59), and song book refs (#57). Licks block added to high (idx 3) and weekend (idx 3) plans with terracotta `--p3c` color. `data.js` Phase 1 weeks 1–12 all have `licksRef`. Next: #50 Book/exercise progress tracking.*

## Gear

**Guitars:** Fender American Professional II Stratocaster, Gibson Les Paul Deluxe 70s Goldtop,
Gibson Les Paul Studio Faded T 2016, Chapman ML3 Pro Bea, Yamaha Pacifica PAC611HFM, Martin SC-10E

**Amps:** Fender Blues Jr. 4 Tweed, Bugera 1990 Infinium 120W Head, Boss Katana Mk1 100W combo

---

*Last updated: Mar 23, 2026 — Practice modal shipped (PR #55). Block click opens full-screen overlay with independent timer, metronome, and PDF book buttons. All exit paths implemented (Mark Complete, Keep Practicing, Come Back to This, backdrop/Escape dismiss). Session wrap-up prompts for notes before saving to DynamoDB. Issues #56 (audio buttons) and #57 (warmup/song block refs) logged as follow-ons. Next: #50 Book/exercise progress tracking.*
