// ═══════════════════════════════════════════
// app.js — All application logic
// ═══════════════════════════════════════════


// ═══════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════

// ── Default palette definitions ─────────────
// Each theme has 4 named presets. Each preset defines the CSS variable overrides.
// Variables: bg, bg2, bg3, bg4, bg5, brder, border2, text, text2, text3,
//            accent, accent2, accent-dim, accent-dim2, red, green, blue,
//            p1c,p1b,p1br, p2c,p2b,p2br, p3c,p3b,p3br, p4c,p4b,p4br, p5c,p5b,p5br

const THEME_DEFAULTS = {
  dark: {
    label: 'Dark',
    swatchColor: '#23272f',
    presets: {
      'Scorched Earth': { bg:'#161819',bg2:'#23272f',bg3:'#2d3139',bg4:'#363b45',bg5:'#404550',border:'#3d4250',border2:'#4e5566',text:'#e8e6e1',text2:'#9fa099',text3:'#636870',accent:'#c49060',accent2:'#d8aa7a','accent-dim':'rgba(196,144,96,0.12)','accent-dim2':'rgba(196,144,96,0.06)',red:'#b86860',green:'#72a878',blue:'#6090b8',p1c:'#c8b840',p1b:'rgba(200,184,64,0.12)',p1br:'rgba(200,184,64,0.30)',p2c:'#5a9fd4',p2b:'rgba(90,159,212,0.12)',p2br:'rgba(90,159,212,0.30)',p3c:'#d4816a',p3b:'rgba(212,129,106,0.12)',p3br:'rgba(212,129,106,0.30)',p4c:'#d4903a',p4b:'rgba(212,144,58,0.12)',p4br:'rgba(212,144,58,0.30)',p5c:'#9278b0',p5b:'rgba(146,120,176,0.12)',p5br:'rgba(146,120,176,0.28)' },
      'Void':           { bg:'#0e0f10',bg2:'#191b1e',bg3:'#222528',bg4:'#2c3036',bg5:'#363b42',border:'#2e3238',border2:'#3d4450',text:'#dddbd6',text2:'#8a8880',text3:'#525860',accent:'#a87848',accent2:'#c09060','accent-dim':'rgba(168,120,72,0.12)','accent-dim2':'rgba(168,120,72,0.06)',red:'#a85850',green:'#628870',blue:'#5080a0',p1c:'#b8a830',p1b:'rgba(184,168,48,0.12)',p1br:'rgba(184,168,48,0.30)',p2c:'#4a8fc4',p2b:'rgba(74,143,196,0.12)',p2br:'rgba(74,143,196,0.30)',p3c:'#c4715a',p3b:'rgba(196,113,90,0.12)',p3br:'rgba(196,113,90,0.30)',p4c:'#c4802a',p4b:'rgba(196,128,42,0.12)',p4br:'rgba(196,128,42,0.30)',p5c:'#8268a0',p5b:'rgba(130,104,160,0.12)',p5br:'rgba(130,104,160,0.28)' },
      'Gunmetal':       { bg:'#1a1c1e',bg2:'#252830',bg3:'#2e3240',bg4:'#383d4e',bg5:'#424858',border:'#40455a',border2:'#505870',text:'#e0ddd8',text2:'#9098a8',text3:'#606878',accent:'#b09070',accent2:'#c8a888','accent-dim':'rgba(176,144,112,0.12)','accent-dim2':'rgba(176,144,112,0.06)',red:'#b06858',green:'#689078',blue:'#6888b0',p1c:'#c0b038',p1b:'rgba(192,176,56,0.12)',p1br:'rgba(192,176,56,0.30)',p2c:'#5898cc',p2b:'rgba(88,152,204,0.12)',p2br:'rgba(88,152,204,0.30)',p3c:'#cc7868',p3b:'rgba(204,120,104,0.12)',p3br:'rgba(204,120,104,0.30)',p4c:'#cc8830',p4b:'rgba(204,136,48,0.12)',p4br:'rgba(204,136,48,0.30)',p5c:'#9070b0',p5b:'rgba(144,112,176,0.12)',p5br:'rgba(144,112,176,0.28)' },
      'Obsidian':       { bg:'#12100e',bg2:'#1e1b18',bg3:'#282420',bg4:'#322e28',bg5:'#3c3830',border:'#3a3530',border2:'#4a4540',text:'#e8e4de',text2:'#a09888',text3:'#686058',accent:'#d4a060',accent2:'#e8b878','accent-dim':'rgba(212,160,96,0.12)','accent-dim2':'rgba(212,160,96,0.06)',red:'#c07060',green:'#78a880',blue:'#6898c0',p1c:'#d0c040',p1b:'rgba(208,192,64,0.12)',p1br:'rgba(208,192,64,0.30)',p2c:'#60a8d8',p2b:'rgba(96,168,216,0.12)',p2br:'rgba(96,168,216,0.30)',p3c:'#d88870',p3b:'rgba(216,136,112,0.12)',p3br:'rgba(216,136,112,0.30)',p4c:'#d89840',p4b:'rgba(216,152,64,0.12)',p4br:'rgba(216,152,64,0.30)',p5c:'#9880b8',p5b:'rgba(152,128,184,0.12)',p5br:'rgba(152,128,184,0.28)' }
    }
  },
  light: {
    label: 'Light',
    swatchColor: '#e8e8e8',
    presets: {
      'Cream':     { bg:'#f4f2ee',bg2:'#eae8e2',bg3:'#dedad3',bg4:'#d2cec6',bg5:'#cac6be',border:'#c8c4bc',border2:'#b8b4aa',text:'#282420',text2:'#5a5650',text3:'#8a8680',accent:'#b86c18',accent2:'#cc8030','accent-dim':'rgba(184,108,24,0.12)','accent-dim2':'rgba(184,108,24,0.06)',red:'#a83020',green:'#3a6e3a',blue:'#2a5890',p1c:'#8c7a10',p1b:'rgba(140,122,16,0.12)',p1br:'rgba(140,122,16,0.30)',p2c:'#2a5890',p2b:'rgba(42,88,144,0.12)',p2br:'rgba(42,88,144,0.30)',p3c:'#a83020',p3b:'rgba(168,48,32,0.12)',p3br:'rgba(168,48,32,0.30)',p4c:'#a06010',p4b:'rgba(160,96,16,0.12)',p4br:'rgba(160,96,16,0.30)',p5c:'#6a3490',p5b:'rgba(106,52,144,0.12)',p5br:'rgba(106,52,144,0.28)' },
      'Parchment': { bg:'#f2ede6',bg2:'#e8e2d8',bg3:'#ddd6cc',bg4:'#d2cbc0',bg5:'#ccc5ba',border:'#c4bcb0',border2:'#b6ada0',text:'#2c2820',text2:'#5e5850',text3:'#8e8880',accent:'#c07020',accent2:'#d48438','accent-dim':'rgba(192,112,32,0.12)','accent-dim2':'rgba(192,112,32,0.06)',red:'#b03020',green:'#3e7040',blue:'#2c5c94',p1c:'#907810',p1b:'rgba(144,120,16,0.12)',p1br:'rgba(144,120,16,0.30)',p2c:'#2c5c94',p2b:'rgba(44,92,148,0.12)',p2br:'rgba(44,92,148,0.30)',p3c:'#b03020',p3b:'rgba(176,48,32,0.12)',p3br:'rgba(176,48,32,0.30)',p4c:'#a86210',p4b:'rgba(168,98,16,0.12)',p4br:'rgba(168,98,16,0.30)',p5c:'#703294',p5b:'rgba(112,50,148,0.12)',p5br:'rgba(112,50,148,0.28)' },
      'Linen':     { bg:'#f0ede8',bg2:'#e6e2dc',bg3:'#dbd7d0',bg4:'#d0ccc4',bg5:'#cac6be',border:'#c2beb6',border2:'#b4b0a8',text:'#262422',text2:'#585450',text3:'#888480',accent:'#b46818',accent2:'#c87c2e','accent-dim':'rgba(180,104,24,0.12)','accent-dim2':'rgba(180,104,24,0.06)',red:'#a42e1e',green:'#386838',blue:'#285488',p1c:'#887610',p1b:'rgba(136,118,16,0.12)',p1br:'rgba(136,118,16,0.30)',p2c:'#285488',p2b:'rgba(40,84,136,0.12)',p2br:'rgba(40,84,136,0.30)',p3c:'#a42e1e',p3b:'rgba(164,46,30,0.12)',p3br:'rgba(164,46,30,0.30)',p4c:'#9e5e10',p4b:'rgba(158,94,16,0.12)',p4br:'rgba(158,94,16,0.30)',p5c:'#682e8c',p5b:'rgba(104,46,140,0.12)',p5br:'rgba(104,46,140,0.28)' },
      'Slate':     { bg:'#f0f0f0',bg2:'#e4e4e4',bg3:'#d8d8d8',bg4:'#cccccc',bg5:'#c8c8c8',border:'#c0c0c0',border2:'#b0b0b0',text:'#202020',text2:'#505050',text3:'#808080',accent:'#a05a10',accent2:'#b87028','accent-dim':'rgba(160,90,16,0.12)','accent-dim2':'rgba(160,90,16,0.06)',red:'#9e2c1a',green:'#346430',blue:'#265080',p1c:'#806c0c',p1b:'rgba(128,108,12,0.12)',p1br:'rgba(128,108,12,0.30)',p2c:'#265080',p2b:'rgba(38,80,128,0.12)',p2br:'rgba(38,80,128,0.30)',p3c:'#9e2c1a',p3b:'rgba(158,44,26,0.12)',p3br:'rgba(158,44,26,0.30)',p4c:'#98580c',p4b:'rgba(152,88,12,0.12)',p4br:'rgba(152,88,12,0.30)',p5c:'#622a88',p5b:'rgba(98,42,136,0.12)',p5br:'rgba(98,42,136,0.28)' }
    }
  },
  warm: {
    label: 'Warm',
    swatchColor: '#2e1f0e',
    presets: {
      'Candlelight':   { bg:'#1a0e06',bg2:'#2e1f0e',bg3:'#3e2c18',bg4:'#4e3820',bg5:'#483220',border:'#5a3e28',border2:'#6e4e34',text:'#e8d8c0',text2:'#a08060',text3:'#785040',accent:'#d4782a',accent2:'#e8984a','accent-dim':'rgba(212,120,42,0.15)','accent-dim2':'rgba(212,120,42,0.07)',red:'#c86040',green:'#78a858',blue:'#6090a8',p1c:'#c8a828',p1b:'rgba(200,168,40,0.14)',p1br:'rgba(200,168,40,0.32)',p2c:'#6090a8',p2b:'rgba(96,144,168,0.12)',p2br:'rgba(96,144,168,0.30)',p3c:'#d07858',p3b:'rgba(208,120,88,0.12)',p3br:'rgba(208,120,88,0.30)',p4c:'#d48828',p4b:'rgba(212,136,40,0.12)',p4br:'rgba(212,136,40,0.30)',p5c:'#9870a8',p5b:'rgba(152,112,168,0.12)',p5br:'rgba(152,112,168,0.28)' },
      'Amber Hour':    { bg:'#1e1008',bg2:'#342016',bg3:'#442c1e',bg4:'#543828',bg5:'#4e3222',border:'#604030',border2:'#745040',text:'#f0e0c8',text2:'#b09070',text3:'#885848',accent:'#e08030',accent2:'#f09a50','accent-dim':'rgba(224,128,48,0.15)','accent-dim2':'rgba(224,128,48,0.07)',red:'#d06848',green:'#80b060',blue:'#6898b0',p1c:'#d0b030',p1b:'rgba(208,176,48,0.14)',p1br:'rgba(208,176,48,0.32)',p2c:'#6898b0',p2b:'rgba(104,152,176,0.12)',p2br:'rgba(104,152,176,0.30)',p3c:'#d88060',p3b:'rgba(216,128,96,0.12)',p3br:'rgba(216,128,96,0.30)',p4c:'#e09030',p4b:'rgba(224,144,48,0.12)',p4br:'rgba(224,144,48,0.30)',p5c:'#a078b0',p5b:'rgba(160,120,176,0.12)',p5br:'rgba(160,120,176,0.28)' },
      'Burnished':     { bg:'#160e08',bg2:'#281a10',bg3:'#382618',bg4:'#483220',bg5:'#422c1c',border:'#503828',border2:'#624838',text:'#e0d0b8',text2:'#987858',text3:'#705040',accent:'#c87020',accent2:'#dc8a38','accent-dim':'rgba(200,112,32,0.15)','accent-dim2':'rgba(200,112,32,0.07)',red:'#c05838',green:'#708848',blue:'#587898',p1c:'#c0a020',p1b:'rgba(192,160,32,0.14)',p1br:'rgba(192,160,32,0.32)',p2c:'#587898',p2b:'rgba(88,120,152,0.12)',p2br:'rgba(88,120,152,0.30)',p3c:'#c87050',p3b:'rgba(200,112,80,0.12)',p3br:'rgba(200,112,80,0.30)',p4c:'#c88020',p4b:'rgba(200,128,32,0.12)',p4br:'rgba(200,128,32,0.30)',p5c:'#906898',p5b:'rgba(144,104,152,0.12)',p5br:'rgba(144,104,152,0.28)' },
      'Deep Tobacco':  { bg:'#120a04',bg2:'#221408',bg3:'#301e10',bg4:'#402818',bg5:'#3a2212',border:'#4a3020',border2:'#5c3c28',text:'#d8c8b0',text2:'#886848',text3:'#604030',accent:'#c06818',accent2:'#d88030','accent-dim':'rgba(192,104,24,0.15)','accent-dim2':'rgba(192,104,24,0.07)',red:'#b85030',green:'#688040',blue:'#508090',p1c:'#b89818',p1b:'rgba(184,152,24,0.14)',p1br:'rgba(184,152,24,0.32)',p2c:'#508090',p2b:'rgba(80,128,144,0.12)',p2br:'rgba(80,128,144,0.30)',p3c:'#c06848',p3b:'rgba(192,104,72,0.12)',p3br:'rgba(192,104,72,0.30)',p4c:'#c07818',p4b:'rgba(192,120,24,0.12)',p4br:'rgba(192,120,24,0.30)',p5c:'#886090',p5b:'rgba(136,96,144,0.12)',p5br:'rgba(136,96,144,0.28)' }
    }
  },
  cool: {
    label: 'Cool',
    swatchColor: '#0d1e2e',
    presets: {
      'North Atlantic': { bg:'#0a1520',bg2:'#0d1e2e',bg3:'#112438',bg4:'#162c42',bg5:'#1a3248',border:'#1e3040',border2:'#2a4058',text:'#c8dce8',text2:'#6090a8',text3:'#405870',accent:'#40a8c8',accent2:'#60c0d8','accent-dim':'rgba(64,168,200,0.12)','accent-dim2':'rgba(64,168,200,0.06)',red:'#c06858',green:'#50a870',blue:'#4890c8',p1c:'#b8b030',p1b:'rgba(184,176,48,0.12)',p1br:'rgba(184,176,48,0.30)',p2c:'#40a8c8',p2b:'rgba(64,168,200,0.12)',p2br:'rgba(64,168,200,0.30)',p3c:'#c87860',p3b:'rgba(200,120,96,0.12)',p3br:'rgba(200,120,96,0.30)',p4c:'#c89030',p4b:'rgba(200,144,48,0.12)',p4br:'rgba(200,144,48,0.30)',p5c:'#8870b8',p5b:'rgba(136,112,184,0.12)',p5br:'rgba(136,112,184,0.28)' },
      'Slate':          { bg:'#0e1620',bg2:'#141e2c',bg3:'#1a2638',bg4:'#202e44',bg5:'#243450',border:'#283a50',border2:'#344a62',text:'#c0d0dc',text2:'#5880a0',text3:'#385470',accent:'#3898b8',accent2:'#50b0cc','accent-dim':'rgba(56,152,184,0.12)','accent-dim2':'rgba(56,152,184,0.06)',red:'#b86050',green:'#489860',blue:'#4080b8',p1c:'#a8a028',p1b:'rgba(168,160,40,0.12)',p1br:'rgba(168,160,40,0.30)',p2c:'#3898b8',p2b:'rgba(56,152,184,0.12)',p2br:'rgba(56,152,184,0.30)',p3c:'#b87060',p3b:'rgba(184,112,96,0.12)',p3br:'rgba(184,112,96,0.30)',p4c:'#b88028',p4b:'rgba(184,128,40,0.12)',p4br:'rgba(184,128,40,0.30)',p5c:'#8060a8',p5b:'rgba(128,96,168,0.12)',p5br:'rgba(128,96,168,0.28)' },
      'Glacial':        { bg:'#081218',bg2:'#0c1a24',bg3:'#102030',bg4:'#14283c',bg5:'#182e44',border:'#1c3040',border2:'#283e54',text:'#d0e4f0',text2:'#6898b8',text3:'#486880',accent:'#48b8d8',accent2:'#68d0e8','accent-dim':'rgba(72,184,216,0.12)','accent-dim2':'rgba(72,184,216,0.06)',red:'#c87060',green:'#58b078',blue:'#5098d0',p1c:'#c0c038',p1b:'rgba(192,192,56,0.12)',p1br:'rgba(192,192,56,0.30)',p2c:'#48b8d8',p2b:'rgba(72,184,216,0.12)',p2br:'rgba(72,184,216,0.30)',p3c:'#d08070',p3b:'rgba(208,128,112,0.12)',p3br:'rgba(208,128,112,0.30)',p4c:'#d09838',p4b:'rgba(208,152,56,0.12)',p4br:'rgba(208,152,56,0.30)',p5c:'#9080c8',p5b:'rgba(144,128,200,0.12)',p5br:'rgba(144,128,200,0.28)' },
      'Midnight Steel': { bg:'#0c1018',bg2:'#121820',bg3:'#182030',bg4:'#1e2838',bg5:'#222e40',border:'#283040',border2:'#344050',text:'#b8ccd8',text2:'#506880',text3:'#385060',accent:'#3090b0',accent2:'#48a8c8','accent-dim':'rgba(48,144,176,0.12)','accent-dim2':'rgba(48,144,176,0.06)',red:'#a85848',green:'#408858',blue:'#3878a8',p1c:'#a09820',p1b:'rgba(160,152,32,0.12)',p1br:'rgba(160,152,32,0.30)',p2c:'#3090b0',p2b:'rgba(48,144,176,0.12)',p2br:'rgba(48,144,176,0.30)',p3c:'#a86858',p3b:'rgba(168,104,88,0.12)',p3br:'rgba(168,104,88,0.30)',p4c:'#a87820',p4b:'rgba(168,120,32,0.12)',p4br:'rgba(168,120,32,0.30)',p5c:'#786098',p5b:'rgba(120,96,152,0.12)',p5br:'rgba(120,96,152,0.28)' }
    }
  },
  psych: {
    label: 'Psych',
    swatchColor: '#1a0d2e',
    presets: {
      'Black Light':  { bg:'#0d0818',bg2:'#1a0d2e',bg3:'#221040',bg4:'#2c1450',bg5:'#261050',border:'#301858',border2:'#3e2268',text:'#e8d0f8',text2:'#9060c8',text3:'#604880',accent:'#d040a0',accent2:'#e860b8','accent-dim':'rgba(208,64,160,0.15)','accent-dim2':'rgba(208,64,160,0.07)',red:'#e04060',green:'#40d080',blue:'#4080e0',p1c:'#d0c020',p1b:'rgba(208,192,32,0.14)',p1br:'rgba(208,192,32,0.32)',p2c:'#4080e0',p2b:'rgba(64,128,224,0.12)',p2br:'rgba(64,128,224,0.30)',p3c:'#e04060',p3b:'rgba(224,64,96,0.12)',p3br:'rgba(224,64,96,0.30)',p4c:'#e08020',p4b:'rgba(224,128,32,0.12)',p4br:'rgba(224,128,32,0.30)',p5c:'#a040e0',p5b:'rgba(160,64,224,0.12)',p5br:'rgba(160,64,224,0.28)' },
      'Void Purple':  { bg:'#080610',bg2:'#120a20',bg3:'#1a1030',bg4:'#221440',bg5:'#200e3c',border:'#281850',border2:'#342060',text:'#e0c8f8',text2:'#8050b8',text3:'#584078',accent:'#c030a0',accent2:'#d850b8','accent-dim':'rgba(192,48,160,0.15)','accent-dim2':'rgba(192,48,160,0.07)',red:'#d83858',green:'#38c078',blue:'#3870d8',p1c:'#c0b018',p1b:'rgba(192,176,24,0.14)',p1br:'rgba(192,176,24,0.32)',p2c:'#3870d8',p2b:'rgba(56,112,216,0.12)',p2br:'rgba(56,112,216,0.30)',p3c:'#d83858',p3b:'rgba(216,56,88,0.12)',p3br:'rgba(216,56,88,0.30)',p4c:'#d07018',p4b:'rgba(208,112,24,0.12)',p4br:'rgba(208,112,24,0.30)',p5c:'#9838d8',p5b:'rgba(152,56,216,0.12)',p5br:'rgba(152,56,216,0.28)' },
      'Acid':         { bg:'#0a0e08',bg2:'#141e10',bg3:'#1c2a18',bg4:'#243620',bg5:'#1e3018',border:'#2a4020',border2:'#385030',text:'#d8f0d0',text2:'#60a840',text3:'#407828',accent:'#80e020',accent2:'#a0f040','accent-dim':'rgba(128,224,32,0.15)','accent-dim2':'rgba(128,224,32,0.07)',red:'#e04040',green:'#40d060',blue:'#4060e0',p1c:'#e0d020',p1b:'rgba(224,208,32,0.14)',p1br:'rgba(224,208,32,0.32)',p2c:'#4060e0',p2b:'rgba(64,96,224,0.12)',p2br:'rgba(64,96,224,0.30)',p3c:'#e04040',p3b:'rgba(224,64,64,0.12)',p3br:'rgba(224,64,64,0.30)',p4c:'#e09020',p4b:'rgba(224,144,32,0.12)',p4br:'rgba(224,144,32,0.30)',p5c:'#c040e0',p5b:'rgba(192,64,224,0.12)',p5br:'rgba(192,64,224,0.28)' },
      'Fever Dream':  { bg:'#100808',bg2:'#201010',bg3:'#301818',bg4:'#402020',bg5:'#3a1a1a',border:'#502828',border2:'#603838',text:'#f8e0e0',text2:'#c06060',text3:'#884040',accent:'#f02080',accent2:'#f84498','accent-dim':'rgba(240,32,128,0.15)','accent-dim2':'rgba(240,32,128,0.07)',red:'#f04040',green:'#40d080',blue:'#4080f0',p1c:'#f0c820',p1b:'rgba(240,200,32,0.14)',p1br:'rgba(240,200,32,0.32)',p2c:'#4080f0',p2b:'rgba(64,128,240,0.12)',p2br:'rgba(64,128,240,0.30)',p3c:'#f04040',p3b:'rgba(240,64,64,0.12)',p3br:'rgba(240,64,64,0.30)',p4c:'#f08020',p4b:'rgba(240,128,32,0.12)',p4br:'rgba(240,128,32,0.30)',p5c:'#c040f0',p5b:'rgba(192,64,240,0.12)',p5br:'rgba(192,64,240,0.28)' }
    }
  }
};

// Returns the active preset name for a theme (from localStorage or first preset)
function getActivePreset(themeKey) {
  const saved = localStorage.getItem('ngc-preset-' + themeKey);
  const presets = THEME_DEFAULTS[themeKey].presets;
  return (saved && presets[saved]) ? saved : Object.keys(presets)[0];
}

// Returns the active vars for a theme — custom saved or preset
function getThemeVars(themeKey) {
  const custom = localStorage.getItem('ngc-custom-' + themeKey);
  if (custom) { try { return JSON.parse(custom); } catch(e) {} }
  const presetName = getActivePreset(themeKey);
  return THEME_DEFAULTS[themeKey].presets[presetName];
}

// Apply CSS vars to :root
function applyThemeVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty('--' + k, v));
}

function setTheme(key) {
  document.documentElement.setAttribute('data-theme', key);
  localStorage.setItem('ngc-theme', key);
  applyThemeVars(getThemeVars(key));
  // Update header button label
  const lbl = document.getElementById('theme-mode-label');
  if (lbl) lbl.textContent = THEME_DEFAULTS[key].label;
  // Update settings mode label
  const sml = document.getElementById('settings-mode-label');
  if (sml) sml.textContent = THEME_DEFAULTS[key].label;
  // Update drawer active states
  document.querySelectorAll('.settings-theme-row').forEach(row => {
    row.classList.toggle('is-active', row.dataset.themeKey === key);
  });
}

function initTheme() {
  const saved = localStorage.getItem('ngc-theme') || 'dark';
  setTheme(saved);
}

// ── Theme picker drawer (Mode button) ────────
function openThemePicker() {
  const drawer = document.getElementById('theme-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (!drawer) return;
  closeSettings();
  buildThemeDrawer();
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('active');
}

function closeThemePicker() {
  const drawer = document.getElementById('theme-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay && !document.getElementById('settings-drawer')?.classList.contains('open')) {
    overlay.classList.remove('active');
  }
}

function buildThemeDrawer() {
  const body = document.getElementById('theme-drawer-body');
  if (!body) return;
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  body.innerHTML = '';
  Object.entries(THEME_DEFAULTS).forEach(([key, def]) => {
    const isActive = key === currentTheme;
    const activePreset = getActivePreset(key);
    const hasCustom = !!localStorage.getItem('ngc-custom-' + key);
    const row = document.createElement('div');
    row.className = 'settings-theme-row' + (isActive ? ' is-active' : '');
    row.dataset.themeKey = key;
    row.innerHTML = `
      <div class="str-head" onclick="settingsSelectTheme('${key}')">
        <div class="str-swatch" style="background:${def.swatchColor}"></div>
        <div class="str-info">
          <div class="str-name">${def.label}</div>
          <div class="str-preset">${activePreset}${hasCustom ? ' <span class="str-custom-dot">●</span>' : ''}</div>
        </div>
        ${isActive ? '<div class="str-active-badge">Active</div>' : ''}
        <button class="str-edit-btn" onclick="event.stopPropagation(); settingsToggleExpand('${key}')">Edit ▾</button>
      </div>
      <div class="str-expand" id="str-expand-${key}">
        ${buildExpandHTML(key, def, activePreset)}
      </div>`;
    body.appendChild(row);
  });
}

// ── Settings drawer (Gear icon) ──────────────
function openSettings() {
  const drawer = document.getElementById('settings-drawer');
  const gear = document.getElementById('settings-gear-btn');
  const overlay = document.getElementById('drawer-overlay');
  if (!drawer) return;
  closeThemePicker();
  buildSettingsDrawer();
  drawer.classList.add('open');
  if (gear) gear.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function closeSettings() {
  const drawer = document.getElementById('settings-drawer');
  const gear = document.getElementById('settings-gear-btn');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (gear) gear.classList.remove('active');
  if (overlay && !document.getElementById('theme-drawer')?.classList.contains('open')) {
    overlay.classList.remove('active');
  }
}

function buildSettingsDrawer() {
  const body = document.getElementById('settings-drawer-body');
  if (!body) return;

  // ── Display prefs ──
  const compactDash = localStorage.getItem('ngc-pref-compact') === '1';

  // ── Viewport preview state ──
  const vp = localStorage.getItem('ngc-viewport-preview') || 'desktop';

  // ── App info ──
  body.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-label">Data Management</div>

      <button class="settings-action-btn" onclick="settingsExportData()">
        <span class="settings-action-icon">⬇</span>
        <div class="settings-action-info">
          <div class="settings-action-label">Export Practice Data</div>
          <div class="settings-action-sub">Download all progress, statuses, and streak as JSON</div>
        </div>
      </button>

      <button class="settings-action-btn danger" onclick="settingsConfirm('clear-streak', this)">
        <span class="settings-action-icon">🔥</span>
        <div class="settings-action-info">
          <div class="settings-action-label">Clear Streak & Heatmap</div>
          <div class="settings-action-sub">Removes all logged practice days</div>
        </div>
      </button>
      <div class="settings-confirm-row" id="confirm-clear-streak">
        <span class="settings-confirm-text">This will erase all practice day history. Sure?</span>
        <button class="settings-confirm-yes" onclick="settingsDoAction('clear-streak')">Yes, clear</button>
        <button class="settings-confirm-no" onclick="settingsDismissConfirm('clear-streak')">Cancel</button>
      </div>

      <button class="settings-action-btn danger" onclick="settingsConfirm('reset-curriculum', this)">
        <span class="settings-action-icon">📋</span>
        <div class="settings-action-info">
          <div class="settings-action-label">Reset Curriculum State</div>
          <div class="settings-action-sub">Restores default song order in all phases</div>
        </div>
      </button>
      <div class="settings-confirm-row" id="confirm-reset-curriculum">
        <span class="settings-confirm-text">Resets all phase song arrangements. Sure?</span>
        <button class="settings-confirm-yes" onclick="settingsDoAction('reset-curriculum')">Yes, reset</button>
        <button class="settings-confirm-no" onclick="settingsDismissConfirm('reset-curriculum')">Cancel</button>
      </div>

      <button class="settings-action-btn danger" onclick="settingsConfirm('reset-statuses', this)">
        <span class="settings-action-icon">🎯</span>
        <div class="settings-action-info">
          <div class="settings-action-label">Reset All Song Statuses</div>
          <div class="settings-action-sub">Sets every song back to Not Started</div>
        </div>
      </button>
      <div class="settings-confirm-row" id="confirm-reset-statuses">
        <span class="settings-confirm-text">Clears all song progress. Sure?</span>
        <button class="settings-confirm-yes" onclick="settingsDoAction('reset-statuses')">Yes, reset</button>
        <button class="settings-confirm-no" onclick="settingsDismissConfirm('reset-statuses')">Cancel</button>
      </div>
    </div

    <div class="settings-section-divider"></div>

    <div class="settings-section">
      <div class="settings-section-label">Spotify</div>
      <div class="settings-pref-sub" style="margin-bottom:10px">Connect to auto-load players on curriculum song cards.</div>
      <button class="settings-action-btn spotify-btn" id="spotify-connect-btn" onclick="spotifyLogin()">
        <span class="settings-action-icon spotify-btn-icon">
          <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </span>
        <div class="settings-action-info">
          <div class="settings-action-label spotify-btn-label">Connect Spotify</div>
          <div class="settings-action-sub spotify-btn-sub">Adds inline players to curriculum song cards</div>
        </div>
      </button>
    </div>

    <div class="settings-section-divider"></div>

    <div class="settings-section">
      <div class="settings-section-label">Audio</div>
      <div class="settings-pref-row" style="margin-bottom:10px">
        <div style="flex:1">
          <div class="settings-pref-label">Metronome volume</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="range" min="0" max="100" value="${Math.round((parseFloat(localStorage.getItem('ngc-metro-volume') ?? '0.7')) * 100)}" style="width:90px" oninput="setAudioVolume('metro', this.value)" />
          <span style="font-size:12px;color:var(--text3);min-width:28px;text-align:right" id="metro-vol-label">${Math.round((parseFloat(localStorage.getItem('ngc-metro-volume') ?? '0.7')) * 100)}%</span>
        </div>
      </div>
      <div class="settings-pref-row">
        <div style="flex:1">
          <div class="settings-pref-label">Timer beep volume</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="range" min="0" max="100" value="${Math.round((parseFloat(localStorage.getItem('ngc-timer-volume') ?? '0.7')) * 100)}" style="width:90px" oninput="setAudioVolume('timer', this.value)" />
          <span style="font-size:12px;color:var(--text3);min-width:28px;text-align:right" id="timer-vol-label">${Math.round((parseFloat(localStorage.getItem('ngc-timer-volume') ?? '0.7')) * 100)}%</span>
        </div>
      </div>
    </div>

    <div class="settings-section-divider"></div>

    <div class="settings-section">
      <div class="settings-section-label">Preferences</div>
      <div class="settings-pref-row" style="margin-bottom:10px">
        <div>
          <div class="settings-pref-label">Color Mode</div>
          <div class="settings-pref-sub">Theme and color palette</div>
        </div>
        <button class="settings-mode-btn" onclick="closeSettings(); openThemePicker();">
                    <span id="settings-mode-label">${THEME_DEFAULTS[localStorage.getItem('ngc-theme') || 'dark'].label}</span> ▾
        </button>
      </div>
      <div class="settings-pref-row">
        <div>
          <div class="settings-pref-label">Compact dashboard</div>
          <div class="settings-pref-sub">Tighter card spacing on mobile</div>
        </div>
        <button class="settings-toggle${compactDash ? ' on' : ''}" id="pref-compact" onclick="settingsTogglePref('compact')"></button>
      </div>
    </div>

    <div class="settings-section-divider"></div>

    <div class="settings-section">
      <div class="settings-section-label">App Info</div>
      <div class="settings-info-row">
        <span class="settings-info-key">App</span>
        <span class="settings-info-val">The Fret Shed</span>
      </div>
      <div class="settings-info-row">
        <span class="settings-info-key">Version</span>
        <span class="settings-info-val">2.0</span>
      </div>

      <div class="settings-info-row">
        <span class="settings-info-key">Live</span>
        <a class="settings-info-link" href="https://thefretshed.com" target="_blank" rel="noopener">Open ↗</a>
      </div>
    </div>

    <div class="settings-section-divider"></div>

    <div class="settings-section">
      <div class="settings-section-label settings-admin-label">Admin</div>
      <div class="settings-pref-sub" style="margin-bottom:12px">Preview how the site renders on different device sizes. Desktop is the default full-width view.</div>
      <div class="settings-viewport-btns">
        <button class="settings-viewport-btn ${vp === 'desktop' ? 'active' : ''}" onclick="setViewportPreview('desktop')">Desktop</button>
        <button class="settings-viewport-btn ${vp === 'tablet' ? 'active' : ''}" onclick="setViewportPreview('tablet')">Tablet</button>
        <button class="settings-viewport-btn ${vp === 'phone' ? 'active' : ''}" onclick="setViewportPreview('phone')">Phone</button>
      </div>
    </div>`;

  // Reflect current Spotify connection state
  if (typeof updateSpotifyButtonState === 'function') updateSpotifyButtonState();
}

function settingsConfirm(id, btn) {
  // Dismiss any other open confirms first
  document.querySelectorAll('.settings-confirm-row.visible').forEach(r => r.classList.remove('visible'));
  const row = document.getElementById('confirm-' + id);
  if (row) row.classList.add('visible');
}

function settingsDismissConfirm(id) {
  const row = document.getElementById('confirm-' + id);
  if (row) row.classList.remove('visible');
}

function settingsDoAction(id) {
  if (id === 'clear-streak') {
    localStorage.removeItem('ngc-practice-days');
    buildStreakCard();
  } else if (id === 'reset-curriculum') {
    [1,2,3,4,5].forEach(p => localStorage.removeItem(`ngc-curriculum-p${p}`));
    [1,2,3,4,5].forEach(p => rebuildSwapPhase(p));
    buildDashSongs();
  } else if (id === 'reset-statuses') {
    localStorage.removeItem('ngc-song-status');
    [1,2,3,4,5].forEach(p => rebuildSwapPhase(p));
    buildDashSongs();
  }
  settingsDismissConfirm(id);
  buildSettingsDrawer();
}

function settingsExportData() {
  const data = {
    exportDate: new Date().toISOString(),
    practiceDays: JSON.parse(localStorage.getItem('ngc-practice-days') || '[]'),
    songStatuses: JSON.parse(localStorage.getItem('ngc-song-status') || '{}'),
    curriculum: {},
    notes: localStorage.getItem('ngc-notes') || '',
    currentWeek: currentWeek,
  };
  [1,2,3,4,5].forEach(p => {
    const saved = localStorage.getItem(`ngc-curriculum-p${p}`);
    if (saved) data.curriculum[`phase${p}`] = JSON.parse(saved);
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `the-shed-export-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
}

function settingsTogglePref(key) {
  const storageKey = 'ngc-pref-' + key;
  const isOn = localStorage.getItem(storageKey) === '1';
  localStorage.setItem(storageKey, isOn ? '0' : '1');
  const btn = document.getElementById('pref-' + key);
  if (btn) btn.classList.toggle('on', !isOn);
}

function buildExpandHTML(key, def, activePreset) {
  const presetBtns = Object.keys(def.presets).map(name =>
    `<button class="str-preset-btn${name === activePreset ? ' active' : ''}" onclick="settingsApplyPreset('${key}','${name}')">${name}</button>`
  ).join('');

  return `
    <div class="str-presets-label">Presets</div>
    <div class="str-preset-row">${presetBtns}</div>
    <div class="str-sliders-label">Fine Tune</div>
    <div id="str-live-preview-${key}" class="str-live-preview"></div>
    <div class="str-actions">
      <button class="str-save-btn" onclick="settingsSaveCustom('${key}')">Save</button>
      <button class="str-reset-btn" onclick="settingsResetCustom('${key}')">Reset</button>
    </div>`;
}

function settingsSelectTheme(key) {
  setTheme(key);
  buildThemeDrawer();
}

function settingsToggleExpand(key) {
  const el = document.getElementById('str-expand-' + key);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.str-expand').forEach(e => e.classList.remove('open'));
  document.querySelectorAll('.str-edit-btn').forEach(b => b.textContent = 'Edit ▾');
  if (!isOpen) {
    setTheme(key);
    el.classList.add('open');
    const btn = el.closest('.settings-theme-row').querySelector('.str-edit-btn');
    if (btn) btn.textContent = 'Edit ▴';
  }
}

function settingsApplyPreset(themeKey, presetName) {
  localStorage.setItem('ngc-preset-' + themeKey, presetName);
  localStorage.removeItem('ngc-custom-' + themeKey);
  const vars = THEME_DEFAULTS[themeKey].presets[presetName];
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  if (currentTheme === themeKey) applyThemeVars(vars);
  buildThemeDrawer();
  // Re-open the expand for this theme
  const el = document.getElementById('str-expand-' + themeKey);
  if (el) { el.classList.add('open'); }
  const btn = document.querySelector(`[data-theme-key="${themeKey}"] .str-edit-btn`);
  if (btn) btn.textContent = 'Edit ▴';
}

function settingsSaveCustom(themeKey) {
  // Read current live CSS vars as custom
  const root = document.documentElement;
  const def = THEME_DEFAULTS[themeKey];
  const allKeys = Object.keys(Object.values(def.presets)[0]);
  const custom = {};
  allKeys.forEach(k => {
    const val = root.style.getPropertyValue('--' + k).trim();
    if (val) custom[k] = val;
  });
  // If nothing custom applied yet, save the current preset
  if (Object.keys(custom).length === 0) {
    const presetName = getActivePreset(themeKey);
    localStorage.setItem('ngc-custom-' + themeKey, JSON.stringify(def.presets[presetName]));
  } else {
    localStorage.setItem('ngc-custom-' + themeKey, JSON.stringify(custom));
  }
  // Flash save confirmation
  const btn = document.querySelector(`#str-expand-${themeKey} .str-save-btn`);
  if (btn) { btn.textContent = 'Saved ✓'; setTimeout(() => { btn.textContent = 'Save'; }, 1500); }
  buildThemeDrawer();
  const el = document.getElementById('str-expand-' + themeKey);
  if (el) el.classList.add('open');
}

function settingsResetCustom(themeKey) {
  localStorage.removeItem('ngc-custom-' + themeKey);
  localStorage.removeItem('ngc-preset-' + themeKey);
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  if (currentTheme === themeKey) {
    const vars = Object.values(THEME_DEFAULTS[themeKey].presets)[0];
    applyThemeVars(vars);
  }
  buildThemeDrawer();
  const el = document.getElementById('str-expand-' + themeKey);
  if (el) el.classList.add('open');
}

