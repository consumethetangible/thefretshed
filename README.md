# The Shed 🎸

A personal guitar practice dashboard. Tracks curriculum progress, session blocks, song library, gear, and tone work. Built for daily use on desktop and iPad.

**Live:** https://consumethetangible.github.io/the-woodshed/

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
│   ├── spotify.js      # Spotify embed helpers
│   └── claude.js       # AI analysis helpers
└── README.md
```

**Deployment:** GitHub Pages. Changes go live automatically on push to `main`.

**Workflow:** Download current `index.html` / `css/styles.css` / `js/app.js` → make changes → upload to replace existing files via the GitHub web editor.

---

## Tabs

### Dashboard
Session overview for the current week. Includes:
- **Session blocks** with per-block checkboxes (reset daily), progress timer, and "Session complete" banner
- **Practice timer** with circular countdown ring, session-aware segment labels, audio pings, and custom duration support. Auto-pauses between blocks and pulses the Start button — hit Start when ready for the next block.
- **Metronome** with BPM display, ±1/±5 nudge buttons, tap tempo, and Web Audio API scheduling
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
| Not Started | Muted border |
| In Progress | Amber |
| Learned | Green |
| In The Fingers | Blue |

Cards are draggable on both desktop (pointer events) and iOS Safari. An insert line shows drop position.

### Rig & Tone
Guitar cards with images, signal chain visualization, and full pedal collection with categorized color-matched tags.

---

## Theme System

The app has five themes, each with four named presets, managed through a settings drawer (gear icon in the header).

| Theme | Presets |
|-------|---------|
| Dark | Scorched Earth, Void, Gunmetal, Obsidian |
| Light | Parchment, Linen, Cream, Dusk |
| Warm | Candlelight, Amber Hour, Burnished, Deep Tobacco |
| Cool | North Atlantic, Slate, Glacial, Midnight Steel |
| Psych | Black Light, Void Purple, Acid, Fever Dream |

**How it works:** CSS variables are defined in `:root` as dark defaults. On load (and on theme switch), `applyThemeVars()` writes the active preset's values directly to `document.documentElement.style`, overriding `:root`. No `[data-theme]` CSS blocks — all palette logic lives in `THEME_DEFAULTS` in `app.js`.

**Settings drawer:** Slides in from the right. Clicking a theme row switches immediately. "Edit ▾" expands the preset picker inline. Save writes to `localStorage`; Reset clears custom values back to defaults.

**localStorage keys:**
- `ngc-theme` — active theme key (`dark` / `light` / `warm` / `cool` / `psych`)
- `ngc-preset-{key}` — active preset name for a theme
- `ngc-custom-{key}` — JSON of custom-saved CSS variable overrides for a theme

---

## Updating Content

All curriculum, song, and gear data lives in `js/data.js`. You never need to touch `app.js` or `index.html` to add songs, update phases, or change gear.

### Adding or editing a song

Find the relevant `PHASES` array entry in `data.js`. Each song object looks like:

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

### Adding a gear image

Gear images are stored as URLs in `localStorage` under `ngc-gear-urls`. To add or update an image:

1. Host the image somewhere publicly accessible (GitHub, Imgur, etc.)
2. Open the app → Rig & Tone tab
3. Use the image editor on the gear card to paste the URL

Images use `object-fit: cover` and are cropped to fill the card.

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

Physical order on the board (right-to-left, signal left-to-right):

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

**Board:** 20"×12" angled Donner with velcro mounting.

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

Referenced throughout `data.js` for week-by-week assignments:

- *Complete Blues Guitar Compilation* (Books 1–3)
- *300 Blues, Rock & Jazz Licks*
- *Guitar Chords in Context*
- *Heavy Metal Bible*
- *Inside Outside Guitar Soloing*
- *The Ultimate Guitar Technique Practice Collection*
- *Beato Ear Training Booklet*

---

## Roadmap

- **Add Gear form** — image upload/URL input that persists to localStorage without GitHub edits
- **Book page references** — page numbers on curriculum song entries (requires manual lookup from PDFs)
- **Tone deep-dives** — signal chain approximations for reference recordings (Boris/Wata, etc.)
- Continued song additions across all phases
- Amp profiler/modeler evaluation (Tonex vs. Kemper — pending)
- Delay pedal upgrade research (Thermae, Polymoon — pending)
