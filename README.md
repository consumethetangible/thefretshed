# The Fret Shed 🎸

A personal guitar practice dashboard. Tracks curriculum progress, session blocks, song library, gear, and tone work. Built for daily use on desktop and iPad.

**Current live URL:** https://consumethetangible.github.io/the-woodshed/ *(migrating — see Infrastructure below)*

**New domain:** https://thefretshed.com *(registered, deployment in progress)*

---

## File Structure

```
the-woodshed/
├── index.html          # All HTML structure and markup
├── css/
│   └── styles.css      # All styles (CSS variables, layout, components)
├── js/
│   ├── app.js          # All application logic (theme system, UI, timers, drag-and-drop)
│   ├── data.js         # All curriculum, song, and gear data — edit this to update content
│   ├── spotify.js      # Spotify Web API integration (PKCE OAuth — in progress)
│   └── claude.js       # Claude AI integration (planned)
└── README.md
```

**Current deployment:** GitHub Pages (temporary — migrating to AWS)

**Workflow:** Download current files as a zip → replace existing files via the GitHub web editor.

---

## Infrastructure & Hosting

### Target Stack
Migrating from GitHub Pages to AWS to support future backend features (session note persistence, PDF access, Claude AI integration, multi-user support).

```
thefretshed.com
  → Route 53 (DNS)
  → CloudFront (HTTPS delivery + CDN)
  → S3 (static file hosting)
  → ACM (free SSL certificate)
```

Future backend additions:
```
  → API Gateway + Lambda (serverless API)
  → DynamoDB (session notes, user data)
  → S3 private bucket (PDF course books)
  → Cognito (authentication — when multi-user needed)
```

### Deployment Status
| Service | Status | Notes |
|---------|--------|-------|
| AWS Account | ✅ Created | "The Shed - Practice App" |
| Route 53 | ✅ Domain registered | `thefretshed.com` — propagating |
| AWS Default Region | ✅ Confirmed | us-east-1 (N. Virginia) — no region switching needed |
| S3 Bucket | ⏳ Next session | Create `thefretshed.com`, enable static hosting, upload files |
| ACM Certificate | ⏳ Next session | Request in us-east-1 ✅ (already default) — DNS validation via Route 53 (one-click) |
| CloudFront | ⏳ Next session | Origin = S3 website endpoint (not bucket ARN), attach ACM cert, HTTP→HTTPS redirect |
| DNS A Record | ⏳ Next session | Route 53 alias A record → CloudFront distribution (apex + www) |
| Spotify OAuth | ⏳ After deployment | Update redirect URI to `https://thefretshed.com/callback`, then build spotify.js |

### Estimated Cost
~$20–25/year total at single-user volume:
- Route 53 hosted zone: ~$0.50/month
- Domain registration: ~$13/year
- S3 + CloudFront: effectively $0

---

## Spotify Integration

### Approach
Full Spotify Web API integration using **Authorization Code with PKCE flow** — no client secret required, safe for a client-side web app. Auto-searches for each song when a card is opened.

### Player UI
Collapsed by default on each song card. Green Spotify icon = linked, grey = unlinked. Tap to expand inline player.

### Setup
- **Spotify Developer App:** Created ("The Fret Shed")
- **Client ID:** Stored locally — never commit to codebase
- **Redirect URI:** `https://thefretshed.com/callback` *(update in Spotify dashboard after deployment)*
- **Flow:** PKCE (no client secret needed)

### Planned `js/spotify.js` functions
```
initSpotify()                — check localStorage for token, trigger OAuth if missing
handleCallback()             — parse token from redirect, store in localStorage
searchTrack(title, artist)   — auto-search Spotify catalog when card opens
renderPlayer(trackId)        — inject collapsed iframe embed into card
linkSong(songTitle, trackId) — persist Spotify track ID to localStorage
```

### localStorage keys (planned)
| Key | Purpose |
|-----|---------|
| `ngc-spotify-token` | OAuth access token |
| `ngc-spotify-expiry` | Token expiry timestamp |
| `ngc-spotify-track-{title}` | Spotify track ID per song |

---

## Claude AI Integration (Planned)

### Vision
A "guitar teacher" layer — Claude reads actual practice data (session notes, streak, phase progress, song statuses) and provides contextual, personalized advice.

### Planned touch points
- **Song card analysis** — key, techniques, difficulty, what to focus on
- **Practice session suggestions** — based on logged session notes and current phase
- **Curriculum advice** — progress-aware recommendations
- **Tone/gear recommendations** — matched to songs being learned
- **Session note analysis** — Claude reads written notes to factor into suggestions

### Planned `js/claude.js` functions
```
initClaude()                     — prompt for API key on first use, store in localStorage
analyzeSong(title, artist)       — key, techniques, difficulty, focus areas
analyzePracticeNotes(notes)      — curriculum suggestions from session notes
suggestSession()                 — personalized session plan from full app state
suggestCurriculumAdjustment()    — progress-aware curriculum recommendations
```

---

## Next Session Checklist

### AWS Deployment — us-east-1 (already default, no switching needed)

1. **S3** — Create bucket named exactly `thefretshed.com`. Enable static website hosting. Set `index.html` as default document. Upload all 6 files preserving `js/` and `css/` folder structure. Set bucket policy to allow public read.

2. **ACM** — Request public SSL certificate for `thefretshed.com` AND `www.thefretshed.com`. Validation method: DNS. AWS will offer to auto-create the validation CNAME in Route 53 — click yes. Wait for status = Issued (usually 2–5 min).

3. **CloudFront** — Create distribution. Origin = S3 **website endpoint URL** (e.g. `thefretshed.com.s3-website-us-east-1.amazonaws.com`) — NOT the bucket ARN. Attach ACM cert. Add `thefretshed.com` and `www.thefretshed.com` as alternate domain names. Default root object = `index.html`. Enable HTTP → HTTPS redirect.

4. **Route 53** — In hosted zone for `thefretshed.com`, create A record (alias) pointing apex domain → CloudFront distribution. Repeat for `www` CNAME or second A alias record.

5. **Test** — Hit `https://thefretshed.com` in browser. DNS is fast since Route 53 is already managing it. If not live within 5 min, check CloudFront distribution status (must say "Deployed").

6. **Spotify** — Once domain is live: go to Spotify Developer Dashboard → The Fret Shed app → Edit Settings → add `https://thefretshed.com/callback` to Redirect URIs. Then build out `spotify.js`.

---

## Tabs

### Dashboard
Session overview for the current week. Includes:
- **Phase hero card** — phase name, description, weekly focus text, progress bar, and a 2×6 week selector grid
- **Session blocks** with per-block checkboxes (reset daily), progress timer, and "Session complete" banner
- **Practice timer** with circular countdown ring, session-aware segment labels, audio pings, and custom duration support
- **Streak & heatmap** showing current streak, longest streak, total days practiced, and a 14-week GitHub-style contribution grid

### Curriculum
Five-phase structured learning plan with weekly focus areas, song assignments, and teaching notes. Each phase has its own color:

| Phase | Name | Color |
|-------|------|-------|
| 1 | Consolidate & Connect | Yellow `#c8b840` |
| 2 | Blues Vocabulary | Sky blue `#5a9fd4` |
| 3 | Phrasing & Feel | Salmon `#d4816a` |
| 4 | Advanced Technique | Sunset orange `#d4903a` |
| 5 | Integration | Purple `#9278b0` |

### Song Library
Drag-and-drop song cards across two columns: **Curriculum** (phase-tagged) and **Personal Repertoire**. Four-state status system with color-coded card borders:

| Status | Color |
|--------|-------|
| Not Started | Muted grey |
| In Progress | Amber |
| Learned 🎯 | Green |
| In The Fingers 💎 | Blue (glow) |

Cards are draggable on both desktop (pointer events) and iOS Safari.

### Rig & Tone
Guitar cards with images, signal chain visualization, and full pedal collection with categorized color-matched tags.

---

## Header Metronome

```
METRONOME | [BPM input] BPM | Tap | Start
```

- BPM input is always directly typeable
- Tap tempo averages the last 6 taps
- Input turns amber when running
- Web Audio API scheduling for tight timing

---

## Theme System

Five themes, each with four named presets. **Mode button** opens the theme picker. **Gear icon** opens settings.

| Theme | Presets |
|-------|---------|
| Dark | Scorched Earth, Void, Gunmetal, Obsidian |
| Light | Parchment, Linen, Cream, Dusk |
| Warm | Candlelight, Amber Hour, Burnished, Deep Tobacco |
| Cool | North Atlantic, Slate, Glacial, Midnight Steel |
| Psych | Black Light, Void Purple, Acid, Fever Dream |

---

## localStorage Reference

| Key | Purpose |
|-----|---------|
| `ngc-theme` | Active theme key |
| `ngc-preset-{key}` | Active preset per theme |
| `ngc-custom-{key}` | Custom CSS var overrides per theme |
| `ngc-week` | Current week (1–12) |
| `ngc-current-phase` | Active phase number |
| `ngc-practice-days` | Array of YYYY-MM-DD strings |
| `ngc-song-status` | Object: title → status string |
| `ngc-curriculum-p{n}` | Phase curriculum state JSON |
| `ngc-notes` | Session notes text |
| `ngc-gear-urls` | Object: gear id → image URL |
| `ngc-checks` | Resource checklist state |
| `ngc-milestones` | Milestone completion state |
| `ngc-block-{date}-{plan}-{idx}` | Per-day session block completion |
| `ngc-pref-compact` | Compact dashboard preference |
| `ngc-gift-songs` | User-added personal repertoire songs |
| `ngc-spotify-token` | Spotify OAuth access token *(planned)* |
| `ngc-spotify-expiry` | Spotify token expiry timestamp *(planned)* |
| `ngc-spotify-track-{title}` | Spotify track ID per song *(planned)* |

---

## Updating Content

All curriculum, song, and gear data lives in `js/data.js`.

### Adding or editing a song

```javascript
{
  num: 1,
  title: 'Purple Haze',
  artist: 'Jimi Hendrix',
  tuning: 'Eb (½ step down)',
  teaches: 'What this song teaches — technique, theory, phrasing.',
  resources: 'Book references and lick sources.',
  weeksFocus: 'Weeks 1–2 (rhythm), Weeks 7–8 (solo)',
  skills: ['bending', 'pentatonic', 'Hendrix voicings'],
  status: 'active'   // 'active' | 'upcoming' | 'future'
}
```

---

## Guitars

| Guitar | Pickups | Notes |
|--------|---------|-------|
| Fender American Professional II Stratocaster | 3× V-Mod II single-coil | Primary clean/blues guitar |
| Gibson Les Paul Deluxe 70s Goldtop | 2× mini humbucker | PAF-adjacent, airy top end |
| Gibson Les Paul Studio Faded T 2016 | 2× humbucker | Workhorse, darker tone |
| Chapman ML3 Pro Bea | 2× full humbucker | T-style, high-output |
| Yamaha Pacifica PAC611HFM Translucent Black | HB bridge / split / P90 neck | Versatile |
| Martin SC-10E Standard Series | Acoustic-electric | Fingerpicking, clean work |

---

## Amps

| Amp | Character |
|-----|-----------|
| Fender Blues Jr. 4 Tweed | Low-watt, warm breakup, recording-friendly |
| Marshall DSL40CR | Versatile British gain, clean and lead channels |
| Boss Katana Mk1 100W | Modeler/practice, silent recording via USB |

---

## Signal Chain

```
Guitar
  → Crybaby Wah
  → Keeley Compressor
  → Ibanez Tube Screamer Mini
  → Bogner La Grange
  → Crazy Tube Circuits Orama  ← (two sections with FX loop between them)
  → Tone City Wild Fro (9V battery)
  → EQD Hizumitas
  → Strymon Mobius
  → TC Electronic Flashback 2
  → TC Electronic Ditto Looper  ← (far-left board edge for easy stomping)
  → EHX Oceans 11
  → Amp
```

**Power:** MXR DC Brick (primary) + Donner unit (overflow). Wild Fro runs on 9V battery only.
**Board:** 20"×12" angled Donner, signal routed right-to-left physically.

---

## Pedal Collection

### Drive, Distortion & Fuzz
- Boss Blues Driver Waza Craft
- Boss Metal Zone MT-2
- Ibanez Tube Screamer Mini *(board)*
- JHS Notaklön (overdrive)
- JHS Ratpack (Rat-style distortion)
- Fulltone OCD *(off-board alternate)*
- Bogner La Grange *(board)*
- DOD Bone Shaker
- Fuzzrocious Demon King
- Fuzzrocious 420 Fuzz
- Mask Audio Electronics YES! Fuzz
- EHX Ram's Head Big Muff (J Mascis signature) *(off-board)*
- EHX Green Russian Big Muff (JHS modded)
- OBNE Alpha Haunt
- Earthquaker Devices Hizumitas *(board)*
- Earthquaker Devices Life Pedal *(off-board alternate)*
- Dwarfcraft Devices Necromancer
- Crazy Tube Circuits Orama *(board)*
- Tone City Wild Fro *(board)*
- Tone City Lil Heat *(off-board)*
- Idiotbox Fuzz Freq *(off-board)*

### Modulation
- Strymon Mobius *(board)*
- Stone Deaf Tremotron

### Reverb
- TC Electronic Hall of Fame 2
- EHX Oceans 11 *(board)*
- OBNE Minim (reverb/reverse/decay)
- OBNE Dark Star (reverb/sustainer)

### Delay
- TC Electronic Flashback 2 *(board)*

### Pitch & Octave
- EHX Pitch Fork
- Earthquaker Devices Data Corrupter

### Compression
- Keeley Compressor *(board)*

### Utility
- TC Electronic Ditto Looper *(board)*

---

## Recording Setup

- **DAW:** Logic Pro
- **Interface:** Focusrite Scarlett 2i4
- **Primary method:** Direct into Scarlett with amp modeling plugins and cabinet IRs
- **Amp modeling:** Amplitube 4 & 5, BIAS FX 2 (with Jimi Hendrix pack), STL Tones, Neural DSP (Rabea and Cali Fortin models)
- **Drums:** Superior Drummer 3
- **Mixing:** EZMix 3
- **Mic:** Shure SM57 + stand (available, not yet used for recording)

---

## Curriculum Books

- *Complete Blues Guitar Compilation* (Books 1–3)
- *300 Blues, Rock & Jazz Licks*
- *Guitar Chords in Context*
- *Heavy Metal Bible*
- *Inside Outside Guitar Soloing*
- *The Ultimate Guitar Technique Practice Collection*
- *Beato Ear Training Booklet*

---

## Roadmap

### Immediate (next session)
- Deploy to AWS (S3 + CloudFront + Route 53) at `thefretshed.com`
- Spotify PKCE OAuth integration with auto song search and collapsed player on cards

### Near term
- Claude AI integration — song analysis, session note parsing, practice suggestions
- Session notes persistence to DynamoDB (move off localStorage)
- PDF course books accessible in-app via private S3 bucket
- Add Gear form (add gear directly from app without GitHub edits)
- Book page number references on curriculum song entries

### Future
- Multi-user support via AWS Cognito — separate credentials and data per user
- Users can upload their own songs, course books, and preferences
- Shared curriculum templates
- Amp profiler/modeler evaluation (Tonex vs. Kemper)
