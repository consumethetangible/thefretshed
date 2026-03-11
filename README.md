# 🎸 The Shed — Chris's Practice Room

A personal guitar practice app hosted on GitHub Pages. Built as a single HTML file with no dependencies — vanilla JS, CSS, and localStorage for persistence.

**Live site:** [https://consumethetangible.github.io/the-woodshed/](https://consumethetangible.github.io/the-woodshed/)

---

## What It Does

The Shed is a self-contained practice environment organized around five panels:

- **Dashboard** — weekly practice log, session timer, streak tracking
- **Curriculum** — structured phase-based learning plan (technique, theory, song vocabulary)
- **Milestones** — phase completion goals and progress checkpoints
- **Rig & Tone** — gear inventory, signal chain, pedal collection, tone profiles
- **Song Library** — gear swap guides and song reference by phase

---

## Rig & Tone Panel

### Guitars
| Guitar | Pickups | Link |
|--------|---------|------|
| Fender American Professional II Stratocaster | Single Coil | [Fender](https://www.fender.com/products/american-professional-ii-stratocaster?variant=45940642447582) |
| Gibson Les Paul Deluxe 70s — Goldtop | Mini Humbuckers | [Sweetwater](https://www.sweetwater.com/store/detail/LPDx70GT--gibson-les-paul-deluxe-70s-electric-guitar-goldtop?serial=221850227) |
| Gibson Les Paul Studio Faded T (2016) | Humbuckers | [Reverb](https://reverb.com/p/gibson-les-paul-studio-faded-t-2016) |
| Chapman ML3 Pro Bea | Full Humbuckers | [Reverb](https://reverb.com/item/83100645-chapman-ml3-pro-bea) |
| Yamaha Pacifica PAC611HFM — Translucent Black | HH / Flamed Maple | [Sweetwater](https://www.sweetwater.com/store/detail/PAC611HFMTBK--yamaha-pac611hfm-pacifica-translucent-black) |
| Martin SC-10E Standard Series | Acoustic / Electric | [Sweetwater](https://www.sweetwater.com/store/detail/SC10E02--martin-sc10e-02-acoustic-electric-guitar) |

### Amps
- Fender Blues Jr. 4 — Tweed Edition
- Boss Katana Mk1 100W Combo
- Marshall DSL40CR

### Active Pedalboard Signal Chain
```
Crybaby Wah → Keeley Compressor → TS Mini → Bogner La Grange → CTC Orama
→ Tone City Wild Fro (9V batt) → EQD Hizumitas → Strymon Mobius
→ TC Flashback 2 → TC Ditto Looper → EHX Oceans 11
```
Power: MXR DC Brick + Donner overflow

### Full Pedal Collection

**Overdrive & Drive**
Boss Blues Driver Waza Craft, Ibanez Tube Screamer Mini, JHS Notaklön, Fulltone OCD, Bogner La Grange, Tone City Lil Heat

**Distortion**
Boss Metal Zone MT-2, JHS Ratpack, DOD Bone Shaker, EQD Life Pedal

**Fuzz**
EHX Ram's Head Big Muff (J Mascis), EHX Green Russian Big Muff (JHS mod), Fuzzrocious Demon King, Fuzzrocious 420 Fuzz, Mask Audio Electronics YES! Fuzz, OBNE Alpha Haunt, EQD Hizumitas, Dwarfcraft Necromancer, Crazy Tube Circuits Orama, Tone City Wild Fro, Idiotbox Fuzz Freq

**Modulation**
Strymon Mobius, Stone Deaf Tremotron

**Reverb & Ambient**
TC Electronic Hall of Fame 2, EHX Oceans 11, OBNE Minim, OBNE Dark Star

**Delay**
TC Electronic Flashback 2

**Pitch & Octave**
EHX Pitch Fork, EQD Data Corrupter

**Compression & Utility**
Keeley Compressor, TC Electronic Ditto Looper, Dunlop Crybaby Wah

### Recording Setup
- **DAW:** Logic Pro
- **Interface:** Focusrite Scarlett 2i4
- **Tracking:** Direct into interface via amp modeling + cabinet IRs
- **Plugins:** Amplitube 4 & 5, BIAS FX 2 (Hendrix pack), STL Tones, Neural DSP Rabea, Neural DSP Cali Fortin
- **Drums:** Superior Drummer 3
- **Mixing:** EZMix 3
- **Mic:** Shure SM57 (available, not yet used for recording)

---

## Guitar Images

Guitar and amp card images are stored locally in the `/images/` folder and referenced as relative paths (e.g. `images/strat.jpg`). To update or add an image:

1. Save the photo to your computer
2. Upload it to the `/images/` folder in this repo
3. Open the app, expand the **📷 Add Guitar Images** or **📷 Add Amp Images** section in the Rig & Tone panel
4. Type the path (e.g. `images/strat.jpg`) into the field and click **Set**

Images are saved in your browser's localStorage and persist across sessions.

---

## File Structure

```
the-woodshed/
├── index.html        # Entire app — single file
├── images/           # Gear photos (guitars, amps)
│   ├── strat.jpg
│   ├── lp-deluxe.jpg
│   └── ...
└── README.md
```

---

## Tech Stack

- **HTML / CSS / JS** — no frameworks, no build step
- **Google Fonts** — Bebas Neue, DM Mono, DM Sans
- **localStorage** — all data persists in the browser; no backend
- **GitHub Pages** — deployed directly from `main` branch

---

## Deployment

Any push to `main` automatically deploys to GitHub Pages. To update the app:

1. Download the latest `index.html` output
2. Go to the repo on GitHub
3. Click `index.html` → Edit (pencil icon) → paste, or use **Add file → Upload files** to replace it
4. Commit to `main` — live in ~30 seconds

---

## On the Horizon

- **Add Gear form** — add new pedal/guitar cards directly in the app without editing code
- **Tone Profiles** — per-rig tone snapshots with settings notes
- **Amp profiler research** — Tonex vs. Kemper comparison
- **Delay upgrade** — researching Flashback 2 replacement (Thermae, Polymoon, Strymon DIG, others)
- **Song vocabulary curriculum** — structured canonical song learning by phase

---

*Built with Claude as an ongoing guitar practice and tone development tool.*
