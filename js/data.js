// ═══════════════════════════════════════════
// data.js — All curriculum, song, and rig data
// Edit this file to update content without touching app logic.
// ═══════════════════════════════════════════


// ═══════════════════════════════════════════
// DATA — unchanged from v3
// ═══════════════════════════════════════════

const PHASES = [
  {
    id:1, label:'Phase 1', name:'Consolidate & Connect',
    color:'var(--p1c)', badge:'badge-p1', duration:'~12 weeks',
    desc:'Take what you partially know and own it front to back. Build the 12-bar foundation. Make bends intentional.',
    northStar:'Can play six songs front to back including solos. Understands 12-bar blues in your bones. Bending and vibrato are intentional.',
    songs:[
      { num:1, title:'Purple Haze', artist:'Jimi Hendrix', tuning:'Eb (½ step down)', teaches:'Tritone interval, Hendrix chord-stab rhythm, string bending as expression, pentatonic phrasing in the solo.', resources:'Hendrix Are You Experienced songbook. 300 Blues, Rock & Jazz Licks — Hendrix blues section.', weeksFocus:'Weeks 1–2 (rhythm), Weeks 7–8 (solo)', skills:['tritone','bending','pentatonic','Hendrix voicings'], status:'active' },
      { num:2, title:'Paranoid', artist:'Black Sabbath', tuning:'Standard', teaches:'Fast alternate picking on a simple riff, pentatonic minor soloing at tempo, blues structure in metal clothing.', resources:'Heavy Metal Bible (Ch. 1 — Roots of Metal). 300 Blues, Rock & Jazz Licks — Iommi rock section.', weeksFocus:'Weeks 1–2 (riff), Weeks 7–8 (solo)', skills:['alternate picking','pentatonic minor','riff structure'], status:'active' },
      { num:3, title:'Sunshine of Your Love', artist:'Cream', tuning:'Standard', teaches:'Blues-rock riff as compositional unit, Clapton pentatonic vocabulary, relationship between riff and solo.', resources:'300 Blues, Rock & Jazz Licks — Clapton blues & rock sections.', weeksFocus:'Weeks 3–4 (rhythm), Weeks 9–10 (solo)', skills:['blues-rock riff','Clapton phrasing','pentatonic'], status:'upcoming' },
      { num:4, title:'Back in Black', artist:'AC/DC', tuning:'Standard', teaches:'Economy of phrasing, how to make three notes mean something, rhythmic placement in a hard rock groove.', resources:'300 Blues, Rock & Jazz Licks — Angus Young rock section.', weeksFocus:'Weeks 5–6 (full song), Weeks 7–8 (solo)', skills:['economy','rhythmic placement','hard rock groove'], status:'upcoming' },
      { num:5, title:'Hey Joe', artist:'Jimi Hendrix', tuning:'Eb (½ step down)', teaches:'Non-standard chord movement (descending I–VII–VI–III–IV), Hendrix chord voicings, melodic soloing over slow changes.', resources:'Hendrix Are You Experienced songbook.', weeksFocus:'Weeks 5–6 (rhythm), Weeks 9–10 (solo)', skills:['chord movement','Hendrix voicings','melodic soloing'], status:'upcoming' },
      { num:6, title:'Wish You Were Here', artist:'Pink Floyd', tuning:'Standard', teaches:"Fingerpicking, dynamics, clean tone, Gilmour's sustained melodic phrasing. Palate cleanser and technique builder.", resources:'300 Blues, Rock & Jazz Licks — Gilmour rock section.', weeksFocus:'Weeks 9–10 (full song)', skills:['fingerpicking','dynamics','clean tone','sustained phrasing'], status:'upcoming' },
    ],
    weeks:[
      { range:'Weeks 1–2', title:'12-Bar Foundation', detail:"Complete Blues Guitar (Book 1, Ch. 1–2). Learn the basic 12-bar structure and open string riffs. This is the framework underlying nearly everything on your song list. Parallel: Purple Haze rhythm parts and Paranoid riff to full song." },
      { range:'Weeks 3–4', title:'Dominant 7 Chords & Extensions', detail:"Complete Blues Guitar (Book 1, Ch. 3–4). First chord vocabulary upgrade — from power chords to dominant 7 colors. Parallel: Sunshine of Your Love rhythm and intro, continue Purple Haze." },
      { range:'Weeks 5–6', title:'Turnarounds & Triplet Feel', detail:"Complete Blues Guitar (Book 1, Ch. 6–7). Turnarounds are the glue of blues structure. The triplet feel chapter will immediately change how your rhythm sits in the groove. Parallel: Back in Black full song, Hey Joe rhythm parts." },
      { range:'Weeks 7–8', title:'Soloing Basics, Bending & Vibrato', detail:"Complete Blues Guitar (Book 2, Ch. 1 + Appendices A & B). The bending appendix alone is worth the price of the book — intentional, in-tune bending separates blues phrasing from noodling. Parallel: Purple Haze solo, Paranoid solo, Back in Black solo." },
      { range:'Weeks 9–10', title:'Melodic Fills & Rhythmic Divisions', detail:"Complete Blues Guitar (Book 1, Ch. 9) + Complete Blues Guitar (Book 2, Ch. 2). Fills chapter is your first proper phrasing vocabulary builder. Parallel: Hey Joe solo, Sunshine of Your Love solo, Wish You Were Here full song." },
      { range:'Weeks 11–12', title:'Consolidation & Milestone Assessment', detail:"No new book material. Full run-throughs of all six songs. Record yourself playing each one. Hearing yourself back is the most efficient diagnostic tool there is." },
    ]
  },
  {
    id:2, label:'Phase 2', name:'Blues Vocabulary',
    color:'var(--p2c)', badge:'badge-p2', duration:'~14 weeks',
    desc:'Break out of box 1 pentatonic. Learn to target chord tones as the changes move. Build real lick vocabulary.',
    northStar:'Seven songs front to back. Connected pentatonic positions. Guide tone awareness. Lick vocabulary with depth and variety.',
    songs:[
      { num:1, title:"The Thrill Is Gone", artist:'BB King', tuning:'Standard', teaches:"Minor blues form, BB box (pentatonic shape 2), call and response in its purest form, restraint and space as expression.", resources:"300 Blues, Rock & Jazz Licks — BB King blues section. Complete Blues Guitar (Book 1, Ch. 13).", weeksFocus:'Weeks 1–2', skills:['minor blues','BB box','call & response','restraint'], status:'future' },
      { num:2, title:"Babe I'm Gonna Leave You", artist:'Led Zeppelin', tuning:'Standard', teaches:"Acoustic fingerpicking to explosive electric arc, arrangement dynamics, Page's compositional instincts.", resources:"300 Blues, Rock & Jazz Licks — Jimmy Page rock section.", weeksFocus:'Weeks 1–2', skills:['fingerpicking','dynamics','arrangement'], status:'future' },
      { num:3, title:'Crossroads (Live)', artist:'Cream', tuning:'Standard', teaches:"Pentatonic runs connecting positions under pressure at rock tempo, Clapton's attack and articulation.", resources:"300 Blues, Rock & Jazz Licks — Clapton blues & rock sections.", weeksFocus:'Weeks 5–6', skills:['connected pentatonic','Clapton attack','rock tempo blues'], status:'future' },
      { num:4, title:'Whole Lotta Love', artist:'Led Zeppelin', tuning:'Standard', teaches:'Riff economy, pentatonic solo placed with absolute intent, wah and sustain as tonal vocabulary.', resources:"300 Blues, Rock & Jazz Licks — Jimmy Page rock section.", weeksFocus:'Weeks 7–8', skills:['riff economy','solo placement','wah','sustain'], status:'future' },
      { num:5, title:'La Grange', artist:'ZZ Top', tuning:'Standard', teaches:"Boogie-blues riff architecture, silence and ghost notes, Gibbons' impossibly minimal phrasing.", resources:"300 Blues, Rock & Jazz Licks — Billy Gibbons rock section.", weeksFocus:'Weeks 9–10', skills:['boogie riff','groove','minimalism','ghost notes'], status:'future' },
      { num:6, title:'Heartbreaker', artist:'Led Zeppelin', tuning:'Standard', teaches:'Unaccompanied solo playing, pentatonic in multiple positions, legato and hammer-on runs.', resources:"300 Blues, Rock & Jazz Licks — Jimmy Page rock section.", weeksFocus:'Weeks 9–10', skills:['unaccompanied','multiple positions','legato'], status:'future' },
      { num:7, title:'Layla', artist:'Derek & the Dominos', tuning:'Standard', teaches:"Guide tones, playing the changes, slow blues feel, Duane Allman's slide intro.", resources:"Complete Blues Guitar (Book 3, Part 1, Ch. 1–2). 300 Blues, Rock & Jazz Licks — Duane Allman rock section.", weeksFocus:'Weeks 11–14 (capstone)', skills:['guide tones','playing the changes','slow blues','slide intro'], status:'future' },
      { num:8, title:"Don't Fear the Reaper", artist:'Blue Öyster Cult', tuning:'Standard', teaches:"Arpeggiated chord movement, Buck Dharma's clean melodic soloing, minor key phrasing without blues clichés.", resources:"300 Blues, Rock & Jazz Licks — rock & blues sections.", weeksFocus:'Alongside or after The Thrill Is Gone', skills:['arpeggiated riff','melodic minor','clean tone','minor key phrasing'], status:'future' },
      { num:9, title:'Time', artist:'Pink Floyd', tuning:'Standard', teaches:"Gilmour's pentatonic vocabulary at its most urgent — fast bends, rhythmic placement, blues-derived phrasing.", resources:"300 Blues, Rock & Jazz Licks — Gilmour rock section.", weeksFocus:'Alongside Wish You Were Here or after', skills:['urgent pentatonic','fast bends','Gilmour phrasing','rhythmic placement'], status:'future' },
    ],
    weeks:[
      { range:'Weeks 1–2', title:'Minor Blues & the BB Box', detail:"Complete Blues Guitar (Book 1, Ch. 13) + Complete Blues Guitar (Book 2, Ch. 5). Parallel: The Thrill Is Gone full song, begin Babe I'm Gonna Leave You." },
      { range:'Weeks 3–4', title:'Rhythmic Displacement & Call & Response', detail:"Complete Blues Guitar (Book 2, Ch. 3–4). Parallel: finish The Thrill Is Gone, Babe I'm Gonna Leave You full arrangement." },
      { range:'Weeks 5–6', title:'Connecting Pentatonic Positions', detail:"Complete Blues Guitar (Book 2, Ch. 5) continued. Parallel: Crossroads rhythm and lead, Whole Lotta Love riff." },
      { range:'Weeks 7–8', title:'Blues at Rock Tempo', detail:"Crossroads and Whole Lotta Love up to tempo. Parallel: both songs full, including solos." },
      { range:'Weeks 9–10', title:'Riff Architecture & Groove', detail:"Complete Blues Guitar (Book 1, Ch. 10–11). Parallel: La Grange full song, begin Heartbreaker." },
      { range:'Weeks 11–12', title:'Playing the Changes — Guide Tones', detail:"Complete Blues Guitar (Book 3, Part 1, Ch. 1–2). Parallel: Heartbreaker full song, begin Layla." },
      { range:'Weeks 13–14', title:'Capstone — Layla', detail:"Complete Blues Guitar (Book 3, Part 1, Ch. 3–4). Full run-throughs of all seven songs." },
    ]
  },
  {
    id:3, label:'Phase 3', name:'Modal Depth & the North Star',
    color:'var(--p3c)', badge:'badge-p3', duration:'~15 weeks',
    desc:'Natural minor, Mixolydian, dark modal vocabulary. The Sabbath world. And then: Little Wing.',
    northStar:'Little Wing front to back with feel. Natural minor and Mixolydian as colors. Soloing beyond pentatonic patterns.',
    songs:[
      { num:1, title:"Since I've Been Loving You", artist:'Led Zeppelin', tuning:'Standard', teaches:"Slow blues, guide tones applied under real emotional pressure, expressive bending as the primary vocabulary.", resources:"Complete Blues Guitar (Book 3, Part 2, Ch. 6). 300 Blues, Rock & Jazz Licks — Jimmy Page rock section.", weeksFocus:'Weeks 1–2', skills:['slow blues','guide tones','expressive bending'], status:'future' },
      { num:2, title:'Black Sabbath', artist:'Black Sabbath', tuning:'Eb (½ step down)', teaches:'Tritone interval as darkness, Locrian/Dorian color, modal atmosphere. The origin point of metal.', resources:"Heavy Metal Bible (Ch. 4 — Natural Minor/Aeolian). 300 Blues, Rock & Jazz Licks — Iommi rock section.", weeksFocus:'Weeks 3–4', skills:['tritone','Locrian','Dorian','modal atmosphere'], status:'future' },
      { num:3, title:'War Pigs', artist:'Black Sabbath', tuning:'Eb (½ step down)', teaches:'Iommi riff architecture, natural minor at slow heavy tempo, pedal point riffs.', resources:"Heavy Metal Bible (Ch. 4 & 6). 300 Blues, Rock & Jazz Licks — Iommi rock section.", weeksFocus:'Weeks 3–6', skills:['natural minor','pedal point','riff architecture','slow groove'], status:'future' },
      { num:4, title:'Iron Man', artist:'Black Sabbath', tuning:'Eb (½ step down)', teaches:'Mid-tempo blues-metal riff, pentatonic rock solo, connecting blues vocabulary to heavy riff framework.', resources:"Heavy Metal Bible (Ch. 1 & 4).", weeksFocus:'Weeks 5–6', skills:['blues-metal riff','pentatonic solo','mid-tempo'], status:'future' },
      { num:5, title:'The Trooper', artist:'Iron Maiden', tuning:'Standard', teaches:'NWOBHM alternate picking mechanics, gallop rhythm as a right-hand workout, melodic lead over driving rhythm.', resources:"Heavy Metal Bible (Ch. 3 — Picking Hand).", weeksFocus:'Weeks 7–8', skills:['alternate picking','gallop rhythm','NWOBHM','melodic lead'], status:'future' },
      { num:6, title:'Comfortably Numb', artist:'Pink Floyd', tuning:'Standard', teaches:"Two contrasting solos: first is restrained and melodic, second is one of the great sustained statements in rock guitar.", resources:"Complete Blues Guitar (Book 3, Part 2, Ch. 8). 300 Blues, Rock & Jazz Licks — Gilmour rock section.", weeksFocus:'Weeks 9–10', skills:['sustained phrasing','scale choices','two-solo arc','dynamics'], status:'future' },
      { num:7, title:'Little Wing', artist:'Jimi Hendrix', tuning:'Eb (½ step down)', teaches:'Chord-melody — rhythm and lead blurring into one. Thumb-over voicings. Short solo packed with personality. The north star.', resources:"Hendrix Are You Experienced songbook. Paul Davids Little Wing YouTube breakdown.", weeksFocus:'Weeks 11–15 (capstone)', skills:['chord-melody','thumb voicings','Hendrix phrasing','fretboard freedom'], status:'future' },
      { num:8, title:'Carry On Wayward Son', artist:'Kansas', tuning:'Standard', teaches:"Precision picked chord intro, aggressive strumming, Kerry Livgren's pentatonic-with-chromatic-passing-tones solo.", resources:"300 Blues, Rock & Jazz Licks — rock sections.", weeksFocus:'Alongside Sabbath/Maiden work', skills:['precision picking','chromatic phrasing','prog-rock','aggressive strumming'], status:'future' },
      { num:9, title:'Shine On You Crazy Diamond', artist:'Pink Floyd', tuning:'Standard', teaches:"Economy and space — the four-note opening theme is one of rock's great lessons in restraint.", resources:"300 Blues, Rock & Jazz Licks — Gilmour rock section.", weeksFocus:'Optional alongside Comfortably Numb', skills:['economy','space','sustained phrasing','Gilmour tone'], status:'future' },
      { num:10, title:'Money', artist:'Pink Floyd', tuning:'Standard', teaches:"Gilmour navigating 7/4 time so naturally you barely notice it. Odd-time feel, rhythmic awareness.", resources:"300 Blues, Rock & Jazz Licks — Gilmour rock section.", weeksFocus:'Phase 3 later / Phase 4 entry', skills:['odd time','7/4','rhythmic awareness','Gilmour phrasing'], status:'future' },
      { num:11, title:'⚡ Technique Target: Transylvanian Hunger', artist:'Darkthrone', tuning:'Standard', teaches:'Tremolo picking endurance and consistency at extreme tempo over hypnotic repeating figures.', resources:"Ben Eller picking mechanics YouTube. Heavy Metal Bible (Ch. 3).", weeksFocus:'Parallel practice — not a curriculum song', skills:['tremolo picking','right-hand stamina','extreme tempo','black metal mechanics'], status:'future' },
    ],
    weeks:[
      { range:'Weeks 1–2', title:'Slow Blues Depth', detail:"Complete Blues Guitar (Book 3, Part 2, Ch. 6). Mixolydian enters here. Parallel: Since I've Been Loving You, slow and deliberate." },
      { range:'Weeks 3–4', title:'Dark Modal Vocabulary', detail:"Heavy Metal Bible (Ch. 4) — Natural Minor/Aeolian. Parallel: Black Sabbath full arrangement, begin War Pigs riff work." },
      { range:'Weeks 5–6', title:'Riff Architecture — Iommi', detail:"Heavy Metal Bible (Ch. 6 — Riff Writing). Parallel: War Pigs full song, Iron Man full song." },
      { range:'Weeks 7–8', title:'NWOBHM Picking — The Trooper', detail:"Heavy Metal Bible (Ch. 3 — Developing the Picking Hand). Parallel: The Trooper full song." },
      { range:'Weeks 9–10', title:'Sustained Melodic Phrasing', detail:"Complete Blues Guitar (Book 3, Part 2, Ch. 8 & 9). Week 9: solo one. Week 10: solo two." },
      { range:'Weeks 11–12', title:'Hendrix Chord Voicings — Little Wing Groundwork', detail:"Dedicated preparation block. Thumb-over-the-neck voicings and chord-melody concept." },
      { range:'Weeks 13–15', title:'Little Wing — Capstone', detail:"Week 13: intro and verse chord-melody at slow tempo. Week 14: the solo. Week 15: full run-throughs. Record yourself." },
    ]
  },
  {
    id:4, label:'Phase 4', name:'Toward the Horizon',
    color:'var(--p4c)', badge:'badge-p4', duration:'~16–20 weeks',
    desc:'Chord-melody thinking, modal playing with real vocabulary, improvisation that tells a story.',
    northStar:'Rough outline — adjust based on where you are after Phase 3.',
    songs:[
      { num:1, title:'Whipping Post', artist:'Allman Brothers', tuning:'Standard', teaches:'Dorian mode, long-form improvisation, dual harmony thinking.', resources:"300 Blues, Rock & Jazz Licks — Duane Allman rock section.", weeksFocus:'TBD', skills:['Dorian','long-form improv','dual harmony'], status:'future' },
      { num:2, title:'In Memory of Elizabeth Reed', artist:'Allman Brothers', tuning:'Standard', teaches:'Minor chord-melody, extended improvisation, conversation between guitar parts.', resources:"300 Blues, Rock & Jazz Licks — Duane Allman section.", weeksFocus:'TBD', skills:['chord-melody','minor','extended improv'], status:'future' },
      { num:3, title:'Manic Depression', artist:'Jimi Hendrix', tuning:'Eb (½ step down)', teaches:'Odd time (3/4 feel), Hendrix vocabulary in a different rhythmic context.', resources:'Hendrix songbook.', weeksFocus:'TBD', skills:['odd time','Hendrix','chromatic phrasing'], status:'future' },
      { num:4, title:'All Along the Watchtower', artist:'Jimi Hendrix', tuning:'Eb (½ step down)', teaches:"Dylan's chord movement refracted through Hendrix phrasing.", resources:'Hendrix songbook.', weeksFocus:'TBD', skills:['chord movement','Hendrix phrasing'], status:'future' },
      { num:5, title:'Stairway to Heaven (?)', artist:'Led Zeppelin', tuning:'Standard', teaches:'Acoustic fingerpicking, modal arc, full dynamic range. Natural phase capstone candidate.', resources:"300 Blues, Rock & Jazz Licks — Jimmy Page section.", weeksFocus:'TBD — possible capstone', skills:['acoustic','modal arc','full dynamic range'], status:'future' },
      { num:6, title:'High Hopes', artist:'Pink Floyd', tuning:'Standard', teaches:'Slide guitar vocabulary, sustained melodic lines over slow harmonic movement.', resources:"300 Blues, Rock & Jazz Licks — Gilmour rock section.", weeksFocus:'TBD', skills:['slide guitar','sustained tone','late Floyd','harmonic movement'], status:'future' },
      { num:7, title:'Dogs', artist:'Pink Floyd', tuning:'Standard', teaches:"Extended soloing over a Dorian vamp — long-form improvisation with Gilmour's voice.", resources:"300 Blues, Rock & Jazz Licks — Gilmour rock section.", weeksFocus:'TBD', skills:['Dorian vamp','long-form improv','Gilmour','extended soloing'], status:'future' },
    ],
    weeks:[]
  },
  {
    id:5, label:'Phase 5', name:'Open Horizon',
    color:'var(--p5c)', badge:'badge-p5', duration:'Open-ended',
    desc:'Whatever your playing needs by then. Defined by where you actually are after Phase 4.',
    northStar:"This phase doesn't exist yet. It gets built from where you land.",
    songs:[
      { num:1, title:'Master of Puppets', artist:'Metallica', tuning:'Eb (½ step down)', teaches:'Alternate picking at speed, harmonic minor, complex song structure.', resources:"Heavy Metal Bible (Ch. 4 — Harmonic Minor).", weeksFocus:'TBD', skills:['harmonic minor','fast picking','complex structure'], status:'future' },
      { num:2, title:'Hallowed Be Thy Name', artist:'Iron Maiden', tuning:'Standard', teaches:'Full NWOBHM vocabulary, harmonic minor lead, epic song structure.', resources:'Heavy Metal Bible (lead sections).', weeksFocus:'TBD', skills:['NWOBHM','harmonic minor','epic structure'], status:'future' },
      { num:3, title:'Fade to Black', artist:'Metallica', tuning:'Eb (½ step down)', teaches:'Acoustic intro, emotional arc from delicate to full, extended solo.', resources:'Heavy Metal Bible.', weeksFocus:'TBD', skills:['acoustic intro','emotional arc','extended solo'], status:'future' },
      { num:4, title:'Inside-Outside Soloing', artist:'Oz Noy book', tuning:'Standard', teaches:'Mixolydian, whole tone, diminished, altered scale — the ceiling stretcher.', resources:'Inside-Outside Guitar Soloing (Oz Noy).', weeksFocus:'When vocabulary is solid', skills:['Mixolydian','whole tone','diminished','altered scale'], status:'future' },
    ],
    weeks:[]
  }
];

const MILESTONES = [
  { phase:1, label:'Phase 1', items:['Purple Haze front to back including the solo, recognizably, at tempo','Paranoid front to back including the solo','Can explain and play a 12-bar blues in at least two keys','Bends land in tune at least 80% of the time','Vibrato sounds intentional rather than accidental','Sunshine of Your Love — riff and solo complete','5+ licks from the 300 Licks book, 1–2 usable in improvisation','Ear training: can reliably identify P4, P5, octave, minor/major 3rds by ear'] },
  { phase:2, label:'Phase 2', items:['The Thrill Is Gone — clean tone, BB box phrases, space and restraint','Can solo in minor blues using at least shape 1 and shape 2 (BB box)','Crossroads at tempo, full song — Clapton phrasing recognizable','Whole Lotta Love full song including solo','La Grange intro riff in the pocket, full song','Heartbreaker including the unaccompanied solo section','Can explain what a guide tone is and demonstrate targeting one across a I→IV change','Layla — complete and musical, even if rough at the edges','Ear training: can identify dominant 7 chords and I–IV–V progressions by ear'] },
  { phase:3, label:'Phase 3', items:["Since I've Been Loving You — complete and emotionally present","Can explain and demonstrate the difference between natural minor and Mixolydian by ear and on the fretboard","Black Sabbath (the song) and War Pigs front to back — riffs in the pocket","Iron Man front to back","The Trooper — gallop rhythm clean at tempo, melodic lead complete","Comfortably Numb — both solos, musical and sustained","Little Wing — front to back, recorded, chord voicings are recognizably Hendrix"] },
];

const TONE_PROFILES = [
  { phase:1, song:'Purple Haze', guitar:'Fender Stratocaster (neck pickup)', amp:'Fender Blues Jr. or Marshall DSL40CR (low gain, clean-ish)', chain:['Crybaby Wah (intro riff)','Bogner La Grange (light drive)'], notes:'PLACEHOLDER — Hendrix tone: Strat neck pickup, moderate gain. La Grange set to medium crunch.' },
  { phase:1, song:'Paranoid', guitar:'Les Paul Deluxe or Chapman (bridge pickup)', amp:'Marshall DSL40CR (channel 2, moderate gain)', chain:['TS Mini (tightens low end)','Bogner La Grange or EQD Hizumitas'], notes:'PLACEHOLDER — Iommi used a treble booster into a Laney. La Grange into Marshall approximates this.' },
  { phase:1, song:'Sunshine of Your Love', guitar:'Les Paul Deluxe (neck or middle)', amp:'Marshall DSL40CR', chain:['Bogner La Grange'], notes:"PLACEHOLDER — Clapton's Cream tone: warm, mid-heavy, not too much gain." },
  { phase:1, song:'Wish You Were Here', guitar:'Fender Stratocaster (neck pickup)', amp:'Fender Blues Jr. (clean)', chain:['Keeley Compressor (subtle)','TC Flashback 2 (light room reverb)'], notes:'PLACEHOLDER — Clean tone with slight compression and reverb.' },
  { phase:2, song:'The Thrill Is Gone', guitar:'Fender Stratocaster (neck pickup)', amp:'Fender Blues Jr. (clean)', chain:['Keeley Compressor','TC Flashback 2 (light reverb)'], notes:'PLACEHOLDER — BB King: clean, warm, slightly compressed.' },
  { phase:2, song:'Whole Lotta Love', guitar:'Les Paul Deluxe or Chapman', amp:'Marshall DSL40CR (channel 2)', chain:['Crybaby Wah (solo)','Bogner La Grange'], notes:'PLACEHOLDER — Page used a Les Paul into a Marshall. Wah for the solo section.' },
  { phase:2, song:'Layla', guitar:'Fender Stratocaster or Les Paul Deluxe', amp:'Marshall DSL40CR or Blues Jr.', chain:['Bogner La Grange','TC Flashback 2 (light slapback)'], notes:"PLACEHOLDER — Clapton's Layla tone is warm and sustaining." },
  { phase:3, song:'Black Sabbath / War Pigs', guitar:'Les Paul Deluxe or Chapman (bridge pickup)', amp:'Marshall DSL40CR (high gain channel)', chain:['TS Mini (tightens)','Bogner La Grange or EQD Hizumitas'], notes:'PLACEHOLDER — The Hizumitas is modeled on his EQD signature — most authentic option.' },
  { phase:3, song:'Comfortably Numb', guitar:'Fender Stratocaster (neck pickup)', amp:'Fender Blues Jr. or Marshall (clean-ish)', chain:['Keeley Compressor','Strymon Mobius (mild chorus)','TC Flashback 2 (long delay)','EHX Oceans 11 (reverb)'], notes:"PLACEHOLDER — Gilmour's tone: Strat neck pickup, compression, chorus, long delay, reverb." },
  { phase:3, song:'Little Wing', guitar:'Fender Stratocaster (neck pickup)', amp:'Fender Blues Jr. (clean with natural breakup)', chain:['Keeley Compressor','Bogner La Grange (very light, edge of breakup)','TC Flashback 2 (light verb/delay)'], notes:'PLACEHOLDER — Hendrix Little Wing tone: clean Strat with slight warmth and compression.' },
];

const SWAPS = {
  phase1:[
    { song:'Purple Haze', func:'Tritone interval, Hendrix rhythm, pentatonic solo entry', swaps:'Manic Depression (Hendrix — odd time, same vocabulary) / Fire (Hendrix — simpler, faster win)' },
    { song:'Paranoid', func:'Fast alternate picking, pentatonic minor at tempo', swaps:'Iron Man (slower, same minor pentatonic territory) / Smoke on the Water (simpler, still teaches riff-as-riff)' },
    { song:'Sunshine of Your Love', func:'Blues-rock riff as compositional unit, Clapton phrasing', swaps:'White Room (Cream — wah riff, different texture, similar vocabulary)' },
    { song:'Back in Black', func:'Economy of phrasing, rhythmic placement, hard rock groove', swaps:'Highway to Hell (AC/DC — simpler, same lesson) / TNT (even simpler quick win)' },
    { song:'Hey Joe', func:'Non-standard chord movement, melodic soloing over slow changes', swaps:'All Along the Watchtower (Hendrix — similar tempo, simpler chord movement)' },
    { song:'Wish You Were Here', func:'Fingerpicking, dynamics, clean tone, sustained phrasing', swaps:'Simple Man (Skynyrd — same lesson, slightly easier)' },
  ],
  phase2:[
    { song:'The Thrill Is Gone', func:'BB box, minor blues, call & response, restraint', swaps:'Sweet Home Chicago (simpler minor blues) / Red House (Hendrix — minor blues, familiar territory)' },
    { song:"Babe I'm Gonna Leave You", func:'Acoustic/electric dynamics, arrangement arc', swaps:'Tangerine (Zeppelin — purely acoustic, same lesson simpler)' },
    { song:'Crossroads (live)', func:'Connected pentatonic positions at rock tempo', swaps:'Further On Up the Road (Clapton — similar tempo and phrasing vocabulary)' },
    { song:'Whole Lotta Love', func:'Riff economy, placed pentatonic solo, wah/sustain', swaps:'Communication Breakdown (Zeppelin — faster, rawer, same riff economy lesson)' },
    { song:'La Grange', func:'Boogie-blues riff architecture, groove, minimalism', swaps:"Tush (ZZ Top — simpler boogie, same Gibbons vocabulary)" },
    { song:'Heartbreaker', func:'Unaccompanied solo, multiple positions, legato', swaps:"Bring It On Home (Zeppelin — simpler solo, still Page vocabulary)" },
    { song:'Layla', func:'Guide tones, playing the changes, slow blues feel', swaps:'Have You Ever Loved a Woman (Clapton/Freddie King — pure slow blues, same lesson)' },
    { song:"Don't Fear the Reaper", func:'Arpeggiated riff, melodic minor key soloing, clean tone', swaps:'All Along the Watchtower (Hendrix — same minor key clean melodic world)' },
    { song:'Time', func:'Gilmour pentatonic urgency, fast bends, rhythmic placement', swaps:"Another Brick in the Wall Pt. 2 (Gilmour — similar vocabulary, simpler)" },
    { song:"Sweet Child O'Mine", func:"Arpeggiated intro, Slash pentatonic phrasing, blues-rock vocabulary in an 80s context", swaps:"Mr. Crowley (Rhoads — similar melodic minor ambition) / Don't Fear the Reaper" },
    { song:'Seek & Destroy', func:'Mid-tempo riff economy, pentatonic groove, thrash restraint', swaps:'La Grange (ZZ Top — same groove-and-space lesson, bluesier)' },
    { song:'Round and Round', func:'DeMartini rhythm sophistication, connected pentatonic lead, melodic phrasing', swaps:'Mr. Crowley (Rhoads — similar melodic ambition, more classical flavor)' },
    { song:'Creeping Death', func:'Gallop rhythm at tempo, pentatonic soloing under pressure, picking stamina', swaps:'The Trooper moved earlier (Maiden — same gallop mechanics)' },
  ],
  phase3:[
    { song:"Since I've Been Loving You", func:'Slow blues, guide tones, expressive bending', swaps:'Red House (Hendrix — same function, slightly more familiar territory)' },
    { song:'Black Sabbath (song)', func:'Tritone, modal darkness, Locrian/Dorian color', swaps:'Sweet Leaf (Sabbath — same Iommi world, riff-focused)' },
    { song:'War Pigs', func:'Natural minor riff architecture, slow heavy groove', swaps:'Children of the Grave (Sabbath — similar tempo and minor vocabulary)' },
    { song:'Iron Man', func:'Mid-tempo blues-metal riff, pentatonic rock solo', swaps:'Symptom of the Universe (Sabbath — heavier, same riff DNA)' },
    { song:'The Trooper', func:'NWOBHM alternate picking, gallop rhythm', swaps:'Aces High (Maiden — harder gallop, Phase 4 candidate when picking is solid)' },
    { song:'Comfortably Numb', func:'Sustained melodic phrasing, two contrasting solos', swaps:'Shine On You Crazy Diamond intro (Gilmour — pure tone and sustain)' },
    { song:'Little Wing', func:'Chord-melody, Hendrix voicings, phrasing and feel', swaps:'The Wind Cries Mary (Hendrix — same chord-melody world, slower)' },
    { song:'Carry On Wayward Son', func:'Precision picking, chromatic phrasing, prog-rock flavor', swaps:'Highway Star (Deep Purple — similar high-energy precision picking)' },
    { song:'Shine On You Crazy Diamond', func:'Economy, space, sustained Gilmour phrasing', swaps:'Comfortably Numb (if not already in phase)' },
  ],
  metalitch:[
    { song:'Smoke on the Water', fits:'Phase 1 (Quick Win)', why:'Riff as pure compositional statement — four notes, universally known. Fast confidence builder.' },
    { song:'Breaking the Law', fits:'Phase 1 (Quick Win)', why:'Three chords, short enough to learn front to back in one sitting. Immediate win, no fuss.' },
    { song:"You've Got Another Thing Comin'", fits:'Phase 1 (Quick Win)', why:"Mid-tempo groove, Tipton's approachable melodic pentatonic solo." },
    { song:'Rock You Like a Hurricane', fits:'Phase 1 (Quick Win)', why:"Schenker's right-hand picking attack on a driving riff. Alternate picking workout in disguise." },
    { song:'No One Like You', fits:'Phase 1 (Quick Win)', why:'Clean arpeggiated intro contrasting with a hard chorus riff. Dynamic range lesson.' },
    { song:'Hallowed Be Thy Name', fits:'Phase 3', why:'Natural minor, NWOBHM, melodic lead — swaps cleanly for The Trooper or Iron Man' },
    { song:'Number of the Beast', fits:'Phase 3/4', why:'Harmonic minor intro, gallop rhythm, extended lead work' },
    { song:'Crazy Train', fits:'Phase 3', why:'Natural minor riff, pentatonic solo — sits between Iron Man and Trooper' },
    { song:'For Whom the Bell Tolls', fits:'Phase 2/3', why:'Bass-driven riff, heavy groove — swaps for War Pigs or La Grange' },
    { song:"Sweet Child O'Mine", fits:'Phase 2', why:"Eb tuning. Arpeggiated intro is a clean-tone gem; Slash's pentatonic solo has real phrasing depth." },
    { song:'Seek & Destroy', fits:'Phase 2', why:'Mid-tempo riff economy and pentatonic groove in a thrash frame.' },
    { song:'Round and Round', fits:'Phase 2', why:"Warren DeMartini's rhythm sophistication is underrated." },
    { song:'Creeping Death', fits:'Phase 2/3', why:'Gallop rhythm at tempo with pentatonic soloing under pressure.' },
    { song:'Fade to Black', fits:'Phase 3/4', why:'Acoustic intro, emotional arc, extended solo — natural minor territory' },
    { song:'Master of Puppets', fits:'Phase 4/5', why:'Alternate picking at speed, harmonic minor, complex structure' },
    { song:'Sweet Leaf', fits:'Phase 3', why:"Pure Iommi riff vocabulary, simpler than War Pigs" },
    { song:'Children of the Grave', fits:'Phase 3', why:'Fast natural minor, bridges Sabbath and thrash' },
    { song:'Aces High', fits:'Phase 4', why:'Full-speed NWOBHM — when picking mechanics from The Trooper are solid' },
    { song:'Transylvanian Hunger', fits:'Phase 3 (technique)', why:'Tremolo picking stamina drill — parallel practice target.' },
  ]
};

const GIFT_SONGS = [
  { title:'Truly Forgotten', artist:'Radio Company (Jensen Ackles)', why:'Personal resonance outside the curriculum framework.', notes:'No phase assignment. No milestone attached. Just yours.', skills:['personal repertoire','feel','Americana'] },
  { title:'Cover Me Up', artist:'Jason Isbell', why:'Emotionally devastating acoustic performance rooted in Americana and country-soul. The power is entirely in feel, fingerpicking, and restraint.', notes:'Fingerpicking patterns directly reinforce Wish You Were Here and Babe I\'m Gonna Leave You technique.', skills:['fingerpicking','Americana','feel','restraint'] },
];

const ACOUSTIC_SONGS = {
  intro: 'The Martin is a different instrument that rewards a different mindset — no amp, no pedals, just you and the room. This section is a detour, not a destination. Pick it up when you want strummy, social, or quiet. No phases, no milestones. Capo noted where standard.',
  tiers: [
    { tier:1, label:'Tier 1 — Grab & Play', desc:'Open chords, minimal or no capo, three to four chord songs. Learn one and you can play it tonight.',
      songs:[
        { title:'Wonderwall', artist:'Oasis', capo:'Capo 2', chords:'Em7, G, Dsus4, A7sus4', teaches:'THE campfire song. The strumming pattern is iconic and slightly syncopated.', vibe:'Strummy / Crowd-pleaser' },
        { title:"Don't Look Back in Anger", artist:'Oasis', capo:'Capo 2', chords:'C, G, Am, E, F', teaches:'More chord movement than Wonderwall. The descending bass line in the verse is a great detail.', vibe:'Strummy / Singalong' },
        { title:"Knockin' on Heaven's Door", artist:'Bob Dylan', capo:'No capo', chords:'G, D, Am, C', teaches:"Three chords, universally known, the definition of timeless simplicity.", vibe:'Strummy / Timeless' },
        { title:"Blowin' in the Wind", artist:'Bob Dylan', capo:'No capo', chords:'G, C, D', teaches:'Three chords. Good early practice matching strumming to vocal rhythm.', vibe:'Strummy / Folk essential' },
        { title:'Horse With No Name', artist:'America', capo:'No capo', chords:'Em, D6/9', teaches:'Two chords for the entire song. An exercise in groove and feel over a hypnotically minimal harmonic canvas.', vibe:'Strummy / Minimal' },
      ]
    },
    { tier:2, label:'Tier 2 — Worth the Work', desc:'More chord movement, fingerpicking patterns, or rhythmic nuance.',
      songs:[
        { title:'Heart of Gold', artist:'Neil Young', capo:'Capo 2', chords:'Em, C, G, D', teaches:"One of Young's most iconic acoustic performances. Great strumming feel.", vibe:'Strummy / Iconic' },
        { title:'Old Man', artist:'Neil Young', capo:'Capo 2', chords:'Dm, G, D, Am, C, E', teaches:'Fingerpicked intro with a more complex open-chord vocabulary. The feel is everything here.', vibe:'Fingerpicked / Intimate' },
        { title:"The Times They Are A-Changin'", artist:'Bob Dylan', capo:'Capo 2', chords:'G, C, D, Em, Am', teaches:'Deliberate fingerpicking pattern, slightly modal-feeling chord movement.', vibe:'Fingerpicked / Anthemic' },
        { title:'More Than Words', artist:'Extreme', capo:'No capo', chords:'G, G/B, Cadd9, Am, C, D, Em', teaches:'Fingerpicking with hybrid strumming — the most technically satisfying song in Tier 2.', vibe:'Fingerpicked / Impressive' },
        { title:'Blackbird', artist:'The Beatles', capo:'No capo', chords:'G-based moving chords', teaches:'Travis-style alternating bass fingerpicking. The pattern is the whole lesson.', vibe:'Fingerpicked / Classic' },
        { title:'Fast Car', artist:'Tracy Chapman', capo:'Capo 2', chords:'C, G, Am, F', teaches:'Four-chord loop with an iconic fingerpicked groove. One of the most emotionally direct songs on the list.', vibe:'Fingerpicked / Groove' },
        { title:'Romeo and Juliet', artist:'Dire Straits', capo:'No capo', chords:'F, Bb, C, Dm, Am', teaches:"Knopfler fingerstyle — no pick, thumb and fingers. The intro arpeggio is one of rock's great acoustic moments.", vibe:'Fingerstyle / Knopfler technique' },
      ]
    },
    { tier:3, label:'Tier 3 — The Deep Cuts', desc:'More complex harmony, advanced fingerpicking, or songs that demand real time to absorb.',
      songs:[
        { title:'⭐ Tangled Up in Blue', artist:'Bob Dylan', capo:'Capo 2 (or 5 for Nashville tuning feel)', chords:'A, G, F#m, E, D, Bm', teaches:"The essential. The harmonic vocabulary will feed directly back into your electric playing.", vibe:'Strummy / Deep study', essential:true },
        { title:'Mr. Tambourine Man', artist:'Bob Dylan', capo:'Capo 4', chords:'D, G, A, Em', teaches:"Beautiful, flowing chord movement with a capo 4 position. One of his most melodically graceful songs.", vibe:'Strummy / Melodic' },
        { title:'Dust in the Wind', artist:'Kansas', capo:'No capo', chords:'C, Am, G, Dm', teaches:'The fingerpicking pattern IS the song. A right-hand technique workout in disguise.', vibe:'Fingerpicked / Pattern study' },
        { title:'The Needle and the Damage Done', artist:'Neil Young', capo:'No capo', chords:'D, Dsus2, G, C, A, Am', teaches:"Delicate open-position fingerpicking, very sparse, very unforgiving of sloppy technique.", vibe:'Fingerpicked / Exposed technique' },
        { title:'Pink Moon', artist:'Nick Drake', capo:'Capo 2', chords:'D-based open chord shapes', teaches:"Hauntingly simple on the surface, technically subtle underneath. A masterclass in the space between notes.", vibe:'Fingerpicked / Dynamics & space' },
      ]
    }
  ]
};

const WEEK_DATA = [
  { weeks:'1-2', focus:'12-Bar Foundation', detail:'Complete Blues Guitar (Book 1, Ch. 1–2). 12-bar structure and open string riffs. Parallel: Purple Haze rhythm, Paranoid riff.' },
  { weeks:'3-4', focus:'Dominant 7 Chords & Extensions', detail:'Complete Blues Guitar (Book 1, Ch. 3–4). Chord vocabulary upgrade. Parallel: Sunshine of Your Love rhythm, continue Purple Haze.' },
  { weeks:'5-6', focus:'Turnarounds & Triplet Feel', detail:'Complete Blues Guitar (Book 1, Ch. 6–7). Turnarounds and triplet feel. Parallel: Back in Black full song, Hey Joe rhythm.' },
  { weeks:'7-8', focus:'Soloing Basics, Bending & Vibrato', detail:'Complete Blues Guitar (Book 2, Ch. 1 + Appendices A & B). Intentional bending. Parallel: Purple Haze solo, Paranoid solo, Back in Black solo.' },
  { weeks:'9-10', focus:'Melodic Fills & Rhythmic Divisions', detail:'Complete Blues Guitar (Book 1, Ch. 9) + Complete Blues Guitar (Book 2, Ch. 2). Phrasing vocabulary. Parallel: Hey Joe solo, Sunshine solo, Wish You Were Here.' },
  { weeks:'11-12', focus:'Consolidation', detail:'No new material. Full run-throughs. Record yourself.' },
];