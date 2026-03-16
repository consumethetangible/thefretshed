// ═══════════════════════════════════════════
// app.js — All application logic
// ═══════════════════════════════════════════


// ═══════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════

// ── Default palette definitions ─────────────
// Each theme has 4 named presets. Each preset defines the CSS variable overrides.
// Variables: bg, bg2, bg3, bg4, bg5, border, border2, text, text2, text3,
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
    swatchColor: '#ccc5bd',
    presets: {
      'Parchment': { bg:'#ddd9d4',bg2:'#ccc5bd',bg3:'#c3bbb1',bg4:'#bbb1a5',bg5:'#beb5aa',border:'#b3a898',border2:'#a89a87',text:'#5a534c',text2:'#918b85',text3:'#b7b4b1',accent:'#c27524',accent2:'#d28a3d','accent-dim':'rgba(194,117,36,0.13)','accent-dim2':'rgba(194,117,36,0.07)',red:'#b04030',green:'#4a7a50',blue:'#2c6196',p1c:'#a08722',p1b:'rgba(160,135,34,0.13)',p1br:'rgba(160,135,34,0.32)',p2c:'#2c6196',p2b:'rgba(44,97,150,0.12)',p2br:'rgba(44,97,150,0.30)',p3c:'#b1492f',p3b:'rgba(177,73,47,0.12)',p3br:'rgba(177,73,47,0.30)',p4c:'#ab6621',p4b:'rgba(171,102,33,0.12)',p4br:'rgba(171,102,33,0.30)',p5c:'#724294',p5b:'rgba(114,66,148,0.12)',p5br:'rgba(114,66,148,0.28)' },
      'Linen':     { bg:'#e2ddd6',bg2:'#d4cec5',bg3:'#c9c2b8',bg4:'#beb7ac',bg5:'#c2bbb0',border:'#b5ada2',border2:'#a8a095',text:'#524a42',text2:'#8e8780',text3:'#b5b1ac',accent:'#b86c1c',accent2:'#cc8035','accent-dim':'rgba(184,108,28,0.13)','accent-dim2':'rgba(184,108,28,0.07)',red:'#a83828',green:'#487248',blue:'#285890',p1c:'#98801e',p1b:'rgba(152,128,30,0.13)',p1br:'rgba(152,128,30,0.32)',p2c:'#285890',p2b:'rgba(40,88,144,0.12)',p2br:'rgba(40,88,144,0.30)',p3c:'#a84028',p3b:'rgba(168,64,40,0.12)',p3br:'rgba(168,64,40,0.30)',p4c:'#a05e18',p4b:'rgba(160,94,24,0.12)',p4br:'rgba(160,94,24,0.30)',p5c:'#6a3888',p5b:'rgba(106,56,136,0.12)',p5br:'rgba(106,56,136,0.28)' },
      'Cream':     { bg:'#e8e4dc',bg2:'#ddd8ce',bg3:'#d4cec4',bg4:'#cac4b8',bg5:'#cec8bc',border:'#bfb8ac',border2:'#b4ac9e',text:'#484038',text2:'#908880',text3:'#b8b4ae',accent:'#c87828',accent2:'#d8903e','accent-dim':'rgba(200,120,40,0.13)','accent-dim2':'rgba(200,120,40,0.07)',red:'#b84030',green:'#4e7a50',blue:'#306898',p1c:'#a88e20',p1b:'rgba(168,142,32,0.13)',p1br:'rgba(168,142,32,0.32)',p2c:'#306898',p2b:'rgba(48,104,152,0.12)',p2br:'rgba(48,104,152,0.30)',p3c:'#b84830',p3b:'rgba(184,72,48,0.12)',p3br:'rgba(184,72,48,0.30)',p4c:'#b06820',p4b:'rgba(176,104,32,0.12)',p4br:'rgba(176,104,32,0.30)',p5c:'#784098',p5b:'rgba(120,64,152,0.12)',p5br:'rgba(120,64,152,0.28)' },
      'Dusk':      { bg:'#cfc8be',bg2:'#c0b8ac',bg3:'#b5ada0',bg4:'#aaa295',bg5:'#afa8a0',border:'#a09890',border2:'#969088',text:'#3e3830',text2:'#807870',text3:'#a8a49e',accent:'#b86818',accent2:'#cc7c2e','accent-dim':'rgba(184,104,24,0.13)','accent-dim2':'rgba(184,104,24,0.07)',red:'#a03020',green:'#407040',blue:'#245088',p1c:'#907818',p1b:'rgba(144,120,24,0.13)',p1br:'rgba(144,120,24,0.32)',p2c:'#245088',p2b:'rgba(36,80,136,0.12)',p2br:'rgba(36,80,136,0.30)',p3c:'#a03820',p3b:'rgba(160,56,32,0.12)',p3br:'rgba(160,56,32,0.30)',p4c:'#985810',p4b:'rgba(152,88,16,0.12)',p4br:'rgba(152,88,16,0.30)',p5c:'#623080',p5b:'rgba(98,48,128,0.12)',p5br:'rgba(98,48,128,0.28)' }
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
    </div>

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
          <span id="settings-mode-label">Dark</span> ▾
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

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let currentWeek = parseInt(localStorage.getItem('ngc-week') || '1');
let checkedItems = JSON.parse(localStorage.getItem('ngc-checks') || '{}');
let milestonesDone = JSON.parse(localStorage.getItem('ngc-milestones') || '{}');

// ═══════════════════════════════════════════
// SESSION BLOCK COMPLETION
// ═══════════════════════════════════════════

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getBlockCheckKey(planId, blockIdx) {
  return `ngc-block-${getTodayKey()}-${planId}-${blockIdx}`;
}

// ── 3-state block system: idle / active / complete ──

// Clicking a block body activates it: highlights it and loads its duration into the timer
function activateBlock(blockEl, planId, blockIdx) {
  const plan = document.getElementById('plan-' + planId);
  if (!plan) return;

  // Clear active from all blocks in this plan
  plan.querySelectorAll('.sblock').forEach(b => b.classList.remove('active-block'));
  blockEl.classList.add('active-block');

  // Load this block's duration into the timer
  const timeEl = blockEl.querySelector('.sblock-time');
  const headEl = blockEl.querySelector('.sblock-head');
  if (timeEl && headEl) {
    const mins = parseInt(timeEl.textContent);
    if (!isNaN(mins)) {
      timerStop();
      TIMER.segments = [{ label: headEl.textContent.trim(), minutes: mins }];
      TIMER.segIdx = 0; TIMER.doneSegs.clear();
      timerInitSeg(); timerRenderSegs();
      const lbl = document.getElementById('timer-mode-label');
      if (lbl) lbl.textContent = headEl.textContent.trim().substring(0, 22);
    }
  }
}

// Check button (stopPropagation'd from block click): toggle complete state
function markBlockComplete(planId, blockIdx) {
  const key = getBlockCheckKey(planId, blockIdx);
  const isDone = localStorage.getItem(key) === '1';
  localStorage.setItem(key, isDone ? '0' : '1');
  syncBlockState(planId, blockIdx);
  checkSessionComplete();
}

function syncBlockState(planId, blockIdx) {
  const plan = document.getElementById('plan-' + planId);
  if (!plan) return;
  const block = plan.querySelectorAll('.sblock')[blockIdx];
  if (!block) return;
  const isDone = localStorage.getItem(getBlockCheckKey(planId, blockIdx)) === '1';
  block.classList.toggle('completed', isDone);
}

function restoreBlockStates() {
  ['high','low','weekend'].forEach(planId => {
    const plan = document.getElementById('plan-' + planId);
    if (!plan) return;
    plan.querySelectorAll('.sblock').forEach((block, idx) => {
      const isDone = localStorage.getItem(getBlockCheckKey(planId, idx)) === '1';
      block.classList.toggle('completed', isDone);
    });
  });
}

// Auto-advance on timer complete: mark current active block done, activate next incomplete
function blockAutoComplete() {
  const activePlan = document.querySelector('.session-plan.active');
  if (!activePlan) return;
  const planId = activePlan.id.replace('plan-', '');
  const activeBlock = activePlan.querySelector('.sblock.active-block');

  if (activeBlock) {
    const idx = parseInt(activeBlock.dataset.idx);
    if (!isNaN(idx)) {
      localStorage.setItem(getBlockCheckKey(planId, idx), '1');
      syncBlockState(planId, idx);
      activeBlock.classList.remove('active-block');
    }
  }

  // Find next incomplete block
  const allBlocks = [...activePlan.querySelectorAll('.sblock')];
  const nextBlock = allBlocks.find(b => {
    const i = parseInt(b.dataset.idx);
    return !isNaN(i) && !b.classList.contains('completed');
  });

  if (nextBlock) {
    const nextIdx = parseInt(nextBlock.dataset.idx);
    activateBlock(nextBlock, planId, nextIdx);
    // Hold — load timer but don't start. User presses Start.
    timerStop();
    timerInitSeg();
    timerRenderSegs();
  }

  checkSessionComplete();
}

// Legacy shim
function toggleBlockComplete(planId, blockIdx) { markBlockComplete(planId, blockIdx); }

function checkSessionComplete() {
  const activePlan = document.querySelector('.session-plan.active');
  if (!activePlan) return;
  const planId = activePlan.id.replace('plan-', '');
  const blocks = activePlan.querySelectorAll('.sblock');
  let allDone = blocks.length > 0;
  blocks.forEach((_, idx) => {
    if (localStorage.getItem(getBlockCheckKey(planId, idx)) !== '1') allDone = false;
  });

  let banner = document.getElementById('session-complete-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'session-complete-banner';
    banner.className = 'session-complete-banner';
    banner.innerHTML = `<span style="font-size:18px">✓</span><div class="session-complete-banner-text">Session complete — nicely done</div>`;
    const card = activePlan.closest('.session-card');
    if (card) card.appendChild(banner);
  }
  banner.classList.toggle('visible', allDone);
  if (allDone) logPracticeDay(true);
}

// ═══════════════════════════════════════════
// STREAK & HEATMAP
// ═══════════════════════════════════════════

function getPracticeDays() {
  return JSON.parse(localStorage.getItem('ngc-practice-days') || '[]');
}
function savePracticeDays(days) {
  localStorage.setItem('ngc-practice-days', JSON.stringify(days));
}

function logPracticeDay(silent) {
  const today = getTodayKey();
  const days = getPracticeDays();
  if (!days.includes(today)) {
    days.push(today);
    savePracticeDays(days);
  }
  buildStreakCard();
  if (!silent) {
    const btn = document.getElementById('log-today-btn');
    if (btn) { btn.classList.add('logged'); btn.textContent = '✓ Logged Today'; }
  }
}

function calcStreaks(days) {
  const daySet = new Set(days);
  // Current streak — walk back from today
  let streak = 0;
  const d = new Date();
  d.setHours(0,0,0,0);
  for (;;) {
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!daySet.has(k)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  // Longest streak
  const sorted = [...days].sort();
  let longest = 0, cur = 0, prev = null;
  for (const day of sorted) {
    if (prev) {
      const p = new Date(prev + 'T00:00:00');
      const c = new Date(day + 'T00:00:00');
      const diff = Math.round((c - p) / 86400000);
      cur = diff === 1 ? cur + 1 : 1;
    } else { cur = 1; }
    if (cur > longest) longest = cur;
    prev = day;
  }
  return { streak, longest };
}

function buildStreakCard() {
  const days = getPracticeDays();
  const daySet = new Set(days);
  const today = getTodayKey();
  const { streak, longest } = calcStreaks(days);

  const el = (id) => document.getElementById(id);
  if (el('streak-count')) el('streak-count').textContent = streak;
  if (el('streak-longest')) el('streak-longest').textContent = longest;
  if (el('streak-total')) el('streak-total').textContent = days.length;

  const btn = el('log-today-btn');
  if (btn) {
    if (daySet.has(today)) { btn.classList.add('logged'); btn.textContent = '✓ Logged Today'; }
    else { btn.classList.remove('logged'); btn.textContent = "✓ Log Today's Practice"; }
  }
  buildHeatmap(daySet);
}

function buildHeatmap(daySet) {
  const WEEKS = 14;
  const today = new Date(); today.setHours(0,0,0,0);
  // Start from Sunday WEEKS weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - startDate.getDay() - (WEEKS - 1) * 7);

  const gridEl = document.getElementById('heatmap-grid');
  const monthsEl = document.getElementById('heatmap-months-row');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  if (monthsEl) monthsEl.innerHTML = '';

  // DOW label column
  const dowCol = document.createElement('div');
  dowCol.className = 'heatmap-dow-labels';
  ['','M','','W','','F',''].forEach(l => {
    const d = document.createElement('div');
    d.className = 'heatmap-dow-label';
    d.textContent = l;
    dowCol.appendChild(d);
  });
  gridEl.appendChild(dowCol);

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seenMonths = new Set();

  for (let w = 0; w < WEEKS; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';
    for (let dow = 0; dow < 7; dow++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + w * 7 + dow);
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      if (cellDate > today) { cell.classList.add('future'); col.appendChild(cell); continue; }

      const dateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth()+1).padStart(2,'0')}-${String(cellDate.getDate()).padStart(2,'0')}`;
      cell.dataset.tip = dateKey;
      if (daySet.has(dateKey)) cell.classList.add('practiced');
      if (dateKey === getTodayKey()) cell.classList.add('today');

      // Month label
      const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;
      if (!seenMonths.has(monthKey) && monthsEl) {
        seenMonths.add(monthKey);
        const lbl = document.createElement('span');
        lbl.className = 'heatmap-month-label';
        lbl.textContent = MONTH_NAMES[cellDate.getMonth()];
        lbl.style.left = (22 + w * 12) + 'px';
        monthsEl.appendChild(lbl);
      }
      col.appendChild(cell);
    }
    gridEl.appendChild(col);
  }
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// GEAR IMAGE URL MANAGEMENT
// ═══════════════════════════════════════════
function getGearUrls() { return JSON.parse(localStorage.getItem('ngc-gear-urls') || '{}'); }
function saveGearUrls(u) { localStorage.setItem('ngc-gear-urls', JSON.stringify(u)); }

function toggleUrlEditor(headerEl) {
  const body = headerEl.nextElementSibling;
  const toggle = headerEl.querySelector('.gear-url-editor-toggle');
  const isCollapsed = body.classList.contains('collapsed');
  body.classList.toggle('collapsed', !isCollapsed);
  toggle.textContent = isCollapsed ? 'hide ▴' : 'show ▾';
}

function setGearUrl(id) {
  const imgEl = document.getElementById('ui-' + id);
  const imgUrl = imgEl ? imgEl.value.trim() : '';
  if (!imgUrl) return;
  const urls = getGearUrls();
  urls[id] = imgUrl;
  saveGearUrls(urls);
  applyGearUrl(id, imgUrl);
  // Visual feedback
  const btn = imgEl.nextElementSibling;
  if (btn) { btn.textContent = '✓'; setTimeout(() => { btn.textContent = 'Set'; }, 1500); }
}

function applyGearUrl(id, imgUrl) {
  const imgTag = document.getElementById('img-' + id);
  const phTag  = document.getElementById('ph-' + id);
  if (!imgTag || !imgUrl) return;
  imgTag.onload = () => { if (phTag) phTag.style.display = 'none'; };
  imgTag.onerror = () => {
    imgTag.style.display = 'none';
    if (phTag) phTag.style.display = 'flex';
  };
  imgTag.src = imgUrl;
  imgTag.style.display = 'block';
}

function applyAllGearUrls() {
  const urls = getGearUrls();
  const ids = ['strat','lp','lpstudio','chapman','pacifica','martin','bluesjr','katana','marshall'];
  ids.forEach(id => {
    const imgUrl = urls[id];
    if (!imgUrl) return;
    const imgInput = document.getElementById('ui-' + id);
    if (imgInput) imgInput.value = imgUrl;
    applyGearUrl(id, imgUrl);
  });
}

function showPanel(id, e) {
  const ev = e || event;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (ev && ev.target) ev.target.classList.add('active');
  document.getElementById('mobile-nav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

function showInner(prefix, id) {
  const parent = event.target.closest('.panel') || document.querySelector('.panel.active');
  parent.querySelectorAll('.inner-panel').forEach(p => p.classList.remove('active'));
  parent.querySelectorAll('.inner-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(prefix + '-' + id).classList.add('active');
  event.target.classList.add('active');
}

function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

// ═══════════════════════════════════════════
// WEEK
// ═══════════════════════════════════════════
function setWeek(w) {
  currentWeek = w;
  localStorage.setItem('ngc-week', w);
  localStorage.setItem('ngc-current-phase', 1);
  const curEl = document.getElementById('current-week');
  if (curEl) curEl.textContent = w;
  // Apply 3-state styling to all week buttons
  document.querySelectorAll('[id^="wbtn-"]').forEach(b => {
    const num = parseInt(b.id.replace('wbtn-', ''));
    b.classList.remove('btn-week-active', 'btn-week-done');
    if (num === w) b.classList.add('btn-week-active');
    else if (num < w) b.classList.add('btn-week-done');
  });
  const wf = WEEK_DATA[Math.min(Math.floor((w-1)/2), WEEK_DATA.length-1)];
  const focusEl = document.getElementById('week-focus-text');
  if (focusEl) focusEl.textContent = wf.detail;
  // progress bar may not exist in new layout — guard
  const prog = document.getElementById('phase-progress');
  if (prog) prog.style.width = Math.round((w / 12) * 100) + '%';
}

// ═══════════════════════════════════════════
// CHECKS & MILESTONES
// ═══════════════════════════════════════════
function toggleCheck(el) {
  el.classList.toggle('done');
  const key = el.querySelector('.check-label').textContent;
  checkedItems[key] = el.classList.contains('done');
  localStorage.setItem('ngc-checks', JSON.stringify(checkedItems));
}

function toggleMilestone(el) {
  el.classList.toggle('done');
  const key = el.querySelector('.milestone-text').textContent;
  milestonesDone[key] = el.classList.contains('done');
  localStorage.setItem('ngc-milestones', JSON.stringify(milestonesDone));
  updateMilestoneProgress();
}

function updateMilestoneProgress() {
  MILESTONES.forEach(group => {
    const total = group.items.length;
    const done = group.items.filter(item => milestonesDone[item]).length;
    const bar = document.getElementById('mprog-' + group.phase);
    if (bar) bar.style.width = Math.round((done/total)*100) + '%';
    const lbl = document.getElementById('mcount-' + group.phase);
    if (lbl) lbl.textContent = done + ' / ' + total;
  });
}

// ═══════════════════════════════════════════
// ENERGY TOGGLE
// ═══════════════════════════════════════════
function setEnergy(level) {
  document.querySelectorAll('.session-plan').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
  document.getElementById('plan-' + level).classList.add('active');
  event.target.classList.add('active');
  // Clear active-block highlight from all plans on switch
  document.querySelectorAll('.sblock').forEach(b => b.classList.remove('active-block'));
  // Stop timer and reload for new plan
  timerStop();
  setTimeout(timerLoadSession, 50);
  checkSessionComplete();
}

function setEnergyAndTimer(level) {
  setEnergy(level);
}

// ═══════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════
function saveNotes() {
  const val = document.getElementById('session-notes').value;
  localStorage.setItem('ngc-notes', val);
  document.getElementById('notes-saved').textContent = 'saved';
  setTimeout(() => { document.getElementById('notes-saved').textContent = ''; }, 1500);
}
function clearNotes() {
  document.getElementById('session-notes').value = '';
  localStorage.removeItem('ngc-notes');
}

function toggleSongCard(el) {
  el.classList.toggle('expanded');
  if (el.classList.contains('expanded')) {
    const nameEl   = el.querySelector('.song-card-name');
    const artistEl = el.querySelector('.song-card-artist');
    if (nameEl && artistEl && typeof initSpotifyPlayer === 'function') {
      initSpotifyPlayer(el, nameEl.textContent.trim(), artistEl.textContent.trim());
    }
  }
}
function toggleToneCard(el) { el.classList.toggle('expanded'); }

// ═══════════════════════════════════════════
// BUILD DASHBOARD SONGS
// ═══════════════════════════════════════════
function buildDashSongs() {
  const container = document.getElementById('dash-songs');
  if (!container) return;
  const phaseNum = parseInt(localStorage.getItem('ngc-current-phase') || '1');
  const phase = PHASES.find(p => p.id === phaseNum) || PHASES[0];
  const state = getCurriculumState(phaseNum);
  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const titles = state.curriculum;

  const titleEl = container.closest('.card')?.querySelector('.card-title');
  if (titleEl) { titleEl.textContent = `Phase ${phaseNum} Songs`; titleEl.style.color = ''; }

  container.innerHTML = titles.map(title => {
    const song = phase.songs.find(s => s.title === title);
    const artist = song ? song.artist : '';
    const status = getSongStatus(title);
    const sc = statusClass(status);
    return `<div class="song-row" style="cursor:pointer;border-left:3px solid var(--status-${sc});background:linear-gradient(to right, var(--status-${sc}-bg) 0%, transparent 15%)" onclick="goToSongInLibrary('${title.replace(/'/g, "\\'")}', ${phaseNum})">
      <div style="flex:1"><div class="song-title">${title}</div><div class="song-artist">${artist}</div></div>
      <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${statusIconHtml(status)}</div>
    </div>`;
  }).join('') || '<div class="small muted">No songs in curriculum yet.</div>';
}

function goToSongInLibrary(title, phaseNum) {
  showPanel('curriculum', null);
  setTimeout(() => {
    const cards = document.querySelectorAll('.song-card');
    for (const card of cards) {
      const nameEl = card.querySelector('.song-card-name');
      if (nameEl && nameEl.textContent.trim() === title) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('drop-target');
        setTimeout(() => card.classList.remove('drop-target'), 1800);
        break;
      }
    }
  }, 120);
}

// ═══════════════════════════════════════════
// BUILD CURRICULUM
// ═══════════════════════════════════════════
function buildCurriculum() {
  const colors = ['var(--p1c)','var(--p2c)','var(--p3c)','var(--p4c)','var(--p5c)'];
  const songsContainer = document.getElementById('curriculum-songs');
  const weeksContainer = document.getElementById('curriculum-weeks');

  songsContainer.innerHTML = PHASES.map((phase, pi) => {
    const songCards = phase.songs.map(s => `
      <div class="song-card" onclick="toggleSongCard(this)">
        <div class="song-card-header">
          <div class="song-card-num">${s.num}</div>
          <div class="song-card-info"><div class="song-card-name">${s.title}</div><div class="song-card-artist">${s.artist}</div></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="tag">${s.weeksFocus.split('(')[0].trim()}</span>
            ${s.tuning ? `<span class="tag" style="${s.tuning === 'Standard' ? '' : 'background:rgba(196,144,96,0.15);color:var(--accent);border-color:rgba(196,144,96,0.35);'}">${s.tuning}</span>` : ''}
            <div class="song-card-chevron">▼</div>
          </div>
        </div>
        <div class="song-card-body">
          <div class="song-detail-grid">
            <div><div class="song-detail-label">What It Teaches</div><div class="song-detail-value">${s.teaches}</div></div>
            <div><div class="song-detail-label">Resources</div><div class="song-detail-value">${s.resources}</div></div>
          </div>
          <div class="song-tags">${s.skills.map(sk => `<span class="tag">${sk}</span>`).join('')}</div>
        </div>
      </div>`).join('');
    return `<div class="phase-section">
      <div class="phase-header">
        <span class="badge badge-p${phase.id}">${phase.label}</span>
        <div class="phase-header-title" style="color:${colors[pi]}">${phase.name}</div>
        <div class="phase-meta"><span class="mono small dimmed">${phase.duration}</span></div>
      </div>
      <div class="small muted" style="margin-bottom:14px">${phase.desc}</div>
      <div class="stack" style="gap:8px">${songCards}</div>
    </div>`;
  }).join('');

  weeksContainer.innerHTML = PHASES.filter(p => p.weeks.length > 0).map((phase, pi) => `
    <div class="phase-section">
      <div class="phase-header">
        <span class="badge badge-p${phase.id}">${phase.label}</span>
        <div class="phase-header-title" style="color:${colors[pi]}">${phase.name}</div>
        <span class="mono small dimmed">${phase.duration}</span>
      </div>
      ${phase.weeks.map(w => `<div class="week-card"><div class="week-card-header"><span class="week-num">${w.range}</span><span class="week-focus-title">${w.title}</span></div><div class="week-detail">${w.detail}</div></div>`).join('')}
    </div>`).join('');
}

// ═══════════════════════════════════════════
// BUILD MILESTONES
// ═══════════════════════════════════════════
function buildMilestones() {
  const container = document.getElementById('milestones-content');
  const colors = ['var(--p1c)','var(--p2c)','var(--p3c)'];
  const badges = ['badge-p1','badge-p2','badge-p3'];
  container.innerHTML = MILESTONES.map((group, gi) => {
    const total = group.items.length;
    const done = group.items.filter(item => milestonesDone[item]).length;
    return `<div class="milestone-group">
      <div class="milestone-group-header">
        <span class="badge ${badges[gi]}">${group.label}</span>
        <div class="milestone-group-title" style="color:${colors[gi]}">${group.label} Milestones</div>
        <span class="mono small dimmed" id="mcount-${group.phase}">${done} / ${total}</span>
      </div>
      <div class="prog-bar" style="margin-bottom:14px"><div class="prog-fill green" id="mprog-${group.phase}" style="width:${Math.round((done/total)*100)}%"></div></div>
      <div>${group.items.map(item => `
        <div class="milestone-item ${milestonesDone[item] ? 'done' : ''}" onclick="toggleMilestone(this)">
          <div class="milestone-icon"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg></div>
          <div><div class="milestone-text">${item}</div></div>
        </div>`).join('')}</div>
      ${gi < MILESTONES.length - 1 ? '<div class="divider"></div>' : ''}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════
// BUILD TONE PROFILES
// ═══════════════════════════════════════════
function buildToneProfiles() {
  const container = document.getElementById('tone-profiles-list');
  const phaseBadges = ['badge-p1','badge-p2','badge-p3'];
  container.innerHTML = [1,2,3].map((ph, pi) => {
    const profiles = TONE_PROFILES.filter(t => t.phase === ph);
    return `<div style="margin-bottom:20px">
      <div class="section-label" style="margin-bottom:8px">Phase ${ph}</div>
      ${profiles.map(t => `
        <div class="tone-profile-card" onclick="toggleToneCard(this)">
          <div class="tone-profile-header">
            <span class="badge ${phaseBadges[pi]}">P${ph}</span>
            <div class="tone-profile-name">${t.song}</div>
            <div class="song-card-chevron">▼</div>
          </div>
          <div class="tone-profile-body">
            <div class="song-detail-label" style="margin-top:12px">Guitar</div><div class="song-detail-value">${t.guitar}</div>
            <div class="song-detail-label" style="margin-top:8px">Amp</div><div class="song-detail-value">${t.amp}</div>
            <div class="song-detail-label" style="margin-top:8px">Signal Chain Notes</div>
            <div class="chain">${t.chain.map(c => `<span class="chain-item">${c}</span>`).join('<span class="chain-arrow">→</span>')}</div>
            <div class="song-detail-label">Notes</div>
            <div class="tone-placeholder">${t.notes}</div>
          </div>
        </div>`).join('')}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════
// SONG LIBRARY STATE
// ═══════════════════════════════════════════
const PHASE_META = {
  1: { color:'#c8b840', bg:'rgba(200,184,64,0.12)',  border:'rgba(200,184,64,0.30)',  badge:'badge-p1', label:'Phase 1', cssVar:'var(--p1c)' },
  2: { color:'#5a9fd4', bg:'rgba(90,159,212,0.12)', border:'rgba(90,159,212,0.30)', badge:'badge-p2', label:'Phase 2', cssVar:'var(--p2c)' },
  3: { color:'#d4816a', bg:'rgba(212,129,106,0.12)',border:'rgba(212,129,106,0.30)',badge:'badge-p3', label:'Phase 3', cssVar:'var(--p3c)' },
  4: { color:'#d4903a', bg:'rgba(212,144,58,0.12)', border:'rgba(212,144,58,0.30)', badge:'badge-p4', label:'Phase 4', cssVar:'var(--p4c)' },
  5: { color:'#9278b0', bg:'rgba(146,120,176,0.12)', border:'rgba(146,120,176,0.28)', badge:'badge-p5', label:'Phase 5', cssVar:'var(--p5c)' },
};

function parsePhaseNums(fitsStr) {
  const matches = fitsStr.match(/\d/g);
  return matches ? [...new Set(matches.map(Number))].filter(n => n >= 1 && n <= 5) : [1];
}

function getPhaseTopBorder(fitsStr) {
  const phases = parsePhaseNums(fitsStr);
  if (phases.length === 1) return `border-top: 3px solid ${PHASE_META[phases[0]].cssVar};`;
  const c1 = PHASE_META[phases[0]].color, c2 = PHASE_META[phases[1]].color;
  return `border-top: 3px solid transparent; background-image: linear-gradient(var(--bg3), var(--bg3)), linear-gradient(to right, ${c1} 50%, ${c2} 50%); background-origin: border-box; background-clip: padding-box, border-box;`;
}

function getPhaseBadgesHtml(fitsStr) {
  const phases = parsePhaseNums(fitsStr);
  return phases.map(p => `<span class="badge ${PHASE_META[p].badge}">${PHASE_META[p].label}</span>`).join(' ');
}

function getCurriculumState(phaseNum) {
  const key = `ngc-curriculum-p${phaseNum}`;
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const phase = PHASES.find(p => p.id === phaseNum);
  if (!phase) return { curriculum: [], stretch: null };
  return { curriculum: phase.songs.filter(s => !s.inOptions).map(s => s.title), stretch: null };
}

function saveCurriculumState(phaseNum, state) {
  localStorage.setItem(`ngc-curriculum-p${phaseNum}`, JSON.stringify(state));
}

const SONG_STATUS_LABELS = { ns:'Not Started', ip:'In Progress', lrn:'Learned', itf:'In The Fingers' };
const SONG_STATUS_ICONS  = { ns:'○', ip:'◑', lrn:'🎯', itf:'💎' };

function getAllSongStatuses() { return JSON.parse(localStorage.getItem('ngc-song-status') || '{}'); }
function getSongStatus(title) { return getAllSongStatuses()[title] || 'ns'; }
function setSongStatus(title, status) { const all = getAllSongStatuses(); all[title] = status; localStorage.setItem('ngc-song-status', JSON.stringify(all)); }
function statusClass(status) { return status || 'ns'; }
function statusBadgeHtml(status) { const s = statusClass(status); return `<span class="status-badge ${s}">${SONG_STATUS_ICONS[s]} ${SONG_STATUS_LABELS[s]}</span>`; }
function statusIconHtml(status) { const s = statusClass(status); if (s === 'ns') return ''; return `<span class="status-badge ${s}" title="${SONG_STATUS_LABELS[s]}">${SONG_STATUS_ICONS[s]}</span>`; }
function getMasteredSongs() { const all = getAllSongStatuses(); const m = new Set(); Object.keys(all).forEach(t => { if (all[t]==='lrn'||all[t]==='itf') m.add(t); }); return m; }

function handleMIStatusChange(event, songTitle) {
  event.stopPropagation();
  const select = event.target;
  const newStatus = select.value;
  setSongStatus(songTitle, newStatus);
  select.className = 'status-select ' + newStatus;
  buildSwapTable('sw-metalitch', SWAPS.metalitch, true, null);
}

function handleExtraStatusChange(event, songTitle) {
  event.stopPropagation();
  const select = event.target;
  const newStatus = select.value;
  setSongStatus(songTitle, newStatus);
  select.className = 'status-select ' + newStatus;
}

// ═══════════════════════════════════════════
// BUILD SWAP TABLES
// ═══════════════════════════════════════════
function buildSwapTable(containerId, data, isMetalItch, phaseNum) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (isMetalItch) {
    // Group songs by their primary phase
    const phaseGroups = {};
    const PHASE_ORDER = [1, 2, 3, 4, 5];
    PHASE_ORDER.forEach(p => phaseGroups[p] = []);
    data.forEach(s => {
      const phases = parsePhaseNums(s.fits);
      const primary = phases[0] || 1;
      phaseGroups[primary].push(s);
    });

    const allStatuses = getAllSongStatuses();

    const sectionsHtml = PHASE_ORDER.filter(p => phaseGroups[p].length > 0).map(p => {
      const pm = PHASE_META[p];
      const songs = phaseGroups[p];
      const doneCount = songs.filter(s => {
        const st = allStatuses[s.song] || 'ns';
        return st === 'lrn' || st === 'itf';
      }).length;
      const inProgCount = songs.filter(s => (allStatuses[s.song] || 'ns') === 'ip').length;
      const pct = Math.round((doneCount / songs.length) * 100);

      const statusOpts = Object.entries(SONG_STATUS_LABELS)
        .map(([val, label]) => `<option value="${val}">${label}</option>`).join('');

      const cardsHtml = songs.map(s => {
        const topBorder = getPhaseTopBorder(s.fits);
        const badgesHtml = getPhaseBadgesHtml(s.fits);
        const status = allStatuses[s.song] || 'ns';
        const safeName = s.song.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
        const statusOptsWithSel = Object.entries(SONG_STATUS_LABELS)
          .map(([val, label]) => `<option value="${val}" ${status===val?'selected':''}>${label}</option>`).join('');
        return `<div class="metal-song" style="${topBorder}" data-mi-song="${safeName}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap;margin-bottom:5px">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">${badgesHtml}</div>
            <select class="status-select ${status}" onchange="handleMIStatusChange(event,'${safeName}')">${statusOptsWithSel}</select>
          </div>
          <div class="metal-song-name">${s.song}</div>
          <div class="metal-song-why">${s.why}</div>
        </div>`;
      }).join('');

      const phaseObj = PHASES.find(ph => ph.id === p);
      const phaseName = phaseObj ? phaseObj.name : '';
      const phaseDesc = phaseObj ? phaseObj.desc : '';
      return `<div class="mi-phase-section" style="margin-bottom:28px">
        <div class="mi-phase-header" style="border-left:3px solid ${pm.color};padding-left:12px;margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span class="badge ${pm.badge}">${pm.label}</span>
              <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:${pm.color}">${phaseName}</span>
              <span class="badge badge-pending">${songs.length} song${songs.length!==1?'s':''}</span>
              ${inProgCount > 0 ? `<span class="badge badge-active">${inProgCount} in progress</span>` : ''}
              ${doneCount > 0 ? `<span class="badge badge-done">${doneCount} learned</span>` : ''}
            </div>
            <span style="font-family:'DM Mono',monospace;font-size:10px;color:${pm.color};letter-spacing:1px;flex-shrink:0">${pct}%</span>
          </div>
          ${phaseDesc ? `<div class="small muted" style="margin-bottom:8px">${phaseDesc}</div>` : ''}
          <div class="prog-bar" style="height:3px">
            <div class="prog-fill" style="width:${pct}%;background:${pm.color}"></div>
          </div>
        </div>
        <div class="metal-itch-grid">${cardsHtml}</div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="small muted" style="margin-bottom:20px">Pre-vetted songs grouped by phase fit. Use the status selector on each song to track progress.</div>
      ${sectionsHtml}`;
    return;
  }

  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const phase = PHASES.find(p => p.id === phaseNum);
  if (!phase) return;

  const state = getCurriculumState(phaseNum);
  const mastered = getMasteredSongs();
  const curriculumTitles = state.curriculum;
  const optionsTitles = phase.songs.map(s => s.title).filter(t => !curriculumTitles.includes(t));

  const allStatSL = getAllSongStatuses();
  const slDone   = curriculumTitles.filter(t => { const s = allStatSL[t]||'ns'; return s==='lrn'||s==='itf'; }).length;
  const slInProg = curriculumTitles.filter(t => (allStatSL[t]||'ns')==='ip').length;
  const coreSongs = Math.min(curriculumTitles.length, 6);
  const slPct    = coreSongs > 0 ? Math.round((slDone / coreSongs) * 100) : 0;

  container.innerHTML = `
    <div style="border-left:3px solid ${pm.color};padding-left:12px;margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="badge ${pm.badge}">${pm.label}</span>
          <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:${pm.color}">${phase.name}</span>
          <span class="badge badge-pending" id="sl-count-${phaseNum}">${coreSongs} song${coreSongs!==1?'s':''} in curriculum${curriculumTitles.length > 6 ? ' + reach' : ''}</span>
          ${slInProg > 0 ? `<span class="badge badge-active">${slInProg} in progress</span>` : ''}
          ${slDone   > 0 ? `<span class="badge badge-done">${slDone} learned</span>` : ''}
        </div>
        <span style="font-family:'DM Mono',monospace;font-size:10px;color:${pm.color};letter-spacing:1px;flex-shrink:0">${slPct}%</span>
      </div>
      <div class="small muted" style="margin-bottom:8px">${phase.desc}</div>
      <div class="prog-bar" style="height:3px"><div class="prog-fill" style="width:${slPct}%;background:${pm.color}"></div></div>
    </div>
    <div class="small muted" style="margin-bottom:16px">Drag songs between columns to build your curriculum. Max 6 core songs + 1 reach slot (🎯). Drag within curriculum to reorder.</div>
    <div class="sl-layout" id="sl-layout-${phaseNum}">
      <div>
        <div class="sl-col-header">Curriculum</div>
        <div class="sl-drop-zone" id="sl-curriculum-${phaseNum}" data-phase="${phaseNum}" data-col="curriculum">
          ${curriculumTitles.length === 0 ? '<div class="sl-empty">Drop songs here</div>' :
            curriculumTitles.map((title, i) => {
              const divider = i === 6 ? `<div class="sl-reach-divider"><div class="sl-reach-divider-line"></div><div class="sl-reach-divider-label">🎯 Reach Slot</div><div class="sl-reach-divider-line"></div></div>` : '';
              return divider + renderSlCard(title, phaseNum, 'curriculum', state, mastered, phase, data);
            }).join('')}
        </div>
      </div>
      <div>
        <div class="sl-col-header">Options</div>
        <div class="sl-drop-zone" id="sl-options-${phaseNum}" data-phase="${phaseNum}" data-col="options">
          ${optionsTitles.length === 0 ? '<div class="sl-empty">All songs in curriculum</div>' :
            optionsTitles.map(title => renderSlCard(title, phaseNum, 'options', state, mastered, phase, data)).join('')}
        </div>
      </div>
    </div>`;

  initDragDrop(phaseNum);
}

function renderSlCard(title, phaseNum, col, state, mastered, phase, swapData) {
  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const status = getSongStatus(title);
  const sc = statusClass(status);
  const songObj = phase.songs.find(s => s.title === title);
  const swapObj = swapData ? swapData.find(s => s.song === title) : null;
  const func = swapObj ? swapObj.func : (songObj ? songObj.teaches.split(',')[0] : '');
  const cardClass = `sl-card status-${sc}`;
  const statusOpts = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${sc === val ? 'selected' : ''}>${label}</option>`).join('');
  const safetitle = title.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return `<div class="${cardClass}" data-title="${title.replace(/"/g, '&quot;')}" data-phase="${phaseNum}" data-col="${col}">
    <div class="sl-card-top">
      <div style="flex:1"><div class="sl-card-title">${title}</div><div class="sl-card-artist">${songObj ? songObj.artist : ''}</div></div>
      <div style="display:flex;align-items:center;gap:6px">
        ${statusIconHtml(status)}
        <select class="status-select ${sc}" onclick="event.stopPropagation()" onchange="handleStatusChange(event, '${safetitle}', ${phaseNum})">${statusOpts}</select>
      </div>
    </div>
    ${func ? `<div class="sl-card-func">${func}</div>` : ''}
  </div>`;
}

// ─── Pointer Drag ────────────────────────────
let dragState = null, dragGhost = null, dragInsertLine = null;
const DRAG_THRESHOLD = 6;

function initDragDrop(phaseNum) {
  document.querySelectorAll(`#sl-curriculum-${phaseNum} .sl-card, #sl-options-${phaseNum} .sl-card`).forEach(card => attachPointerDrag(card, phaseNum));
}

function attachPointerDrag(card, phaseNum) {
  let startX, startY, moved = false;
  card.addEventListener('pointerdown', e => {
    if (e.target.closest('select, button')) return;
    e.preventDefault();
    card.setPointerCapture(e.pointerId);
    startX = e.clientX; startY = e.clientY; moved = false;
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onUp);

    function onMove(ev) {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!moved) {
        moved = true;
        dragState = { title: card.dataset.title, col: card.dataset.col, phase: phaseNum, card };
        card.classList.add('dragging');
        dragGhost = document.createElement('div');
        dragGhost.className = 'drag-ghost';
        dragGhost.textContent = card.dataset.title;
        document.body.appendChild(dragGhost);
      }
      if (dragGhost) { dragGhost.style.left = (ev.clientX - 20) + 'px'; dragGhost.style.top = (ev.clientY - 20) + 'px'; }
      updateDropIndicators(ev.clientX, ev.clientY, phaseNum);
    }

    function onUp(ev) {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerup', onUp);
      card.removeEventListener('pointercancel', onUp);
      if (moved && dragState) commitDrop(ev.clientX, ev.clientY, phaseNum);
      card.classList.remove('dragging');
      if (dragGhost) { dragGhost.remove(); dragGhost = null; }
      if (dragInsertLine) { dragInsertLine.remove(); dragInsertLine = null; }
      document.querySelectorAll('.sl-drop-zone').forEach(z => z.classList.remove('drag-over','drop-blocked'));
      dragState = null; moved = false;
    }
  });
}

function getZoneAtPoint(x, y, phaseNum) {
  for (const zone of [document.getElementById(`sl-curriculum-${phaseNum}`), document.getElementById(`sl-options-${phaseNum}`)]) {
    if (!zone) continue;
    const r = zone.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
  }
  return null;
}

function updateDropIndicators(x, y, phaseNum) {
  const currZone = document.getElementById(`sl-curriculum-${phaseNum}`);
  const optsZone = document.getElementById(`sl-options-${phaseNum}`);
  if (!currZone || !optsZone || !dragState) return;
  const zone = getZoneAtPoint(x, y, phaseNum);
  [currZone, optsZone].forEach(z => z.classList.remove('drag-over','drop-blocked'));
  if (dragInsertLine) { dragInsertLine.remove(); dragInsertLine = null; }
  if (!zone) return;
  const isCurriculum = zone.dataset.col === 'curriculum';
  const state = getCurriculumState(phaseNum);
  const wouldExceed = isCurriculum && !state.curriculum.includes(dragState.title) && state.curriculum.length >= 7;
  if (wouldExceed) { zone.classList.add('drop-blocked'); return; }
  zone.classList.add('drag-over');
  if (isCurriculum && dragState.col === 'curriculum') {
    const insertIdx = getInsertIndex(x, y, zone, state.curriculum);
    dragInsertLine = document.createElement('div');
    dragInsertLine.className = 'drag-insert-line';
    const cards = [...zone.querySelectorAll('.sl-card:not(.dragging)')];
    if (insertIdx < cards.length) zone.insertBefore(dragInsertLine, cards[insertIdx]);
    else zone.appendChild(dragInsertLine);
  }
}

function getInsertIndex(x, y, zone, curriculum) {
  const cards = [...zone.querySelectorAll('.sl-card:not(.dragging)')];
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (y < rect.top + rect.height / 2) { const title = cards[i].dataset.title; const idx = curriculum.indexOf(title); return idx !== -1 ? idx : i; }
  }
  return curriculum.length;
}

function commitDrop(x, y, phaseNum) {
  if (!dragState) return;
  const zone = getZoneAtPoint(x, y, phaseNum);
  if (!zone) return;
  const targetCol = zone.dataset.col;
  const state = getCurriculumState(phaseNum);
  if (dragState.col !== targetCol) {
    if (targetCol === 'curriculum' && state.curriculum.length >= 7) return;
    if (targetCol === 'curriculum') state.curriculum.push(dragState.title);
    else { state.curriculum = state.curriculum.filter(t => t !== dragState.title); if (state.stretch === dragState.title) state.stretch = null; }
  } else if (targetCol === 'curriculum') {
    const dragIdx = state.curriculum.indexOf(dragState.title);
    if (dragIdx === -1) return;
    const dropIdx = getInsertIndex(x, y, zone, state.curriculum);
    const newOrder = [...state.curriculum];
    newOrder.splice(dragIdx, 1);
    const insertAt = dropIdx > dragIdx ? dropIdx - 1 : dropIdx;
    newOrder.splice(Math.max(0, insertAt), 0, dragState.title);
    state.curriculum = newOrder;
  } else return;
  saveCurriculumState(phaseNum, state);
  rebuildSwapPhase(phaseNum);
  refreshSiteFromCurriculum();
}

function handleStatusChange(e, title, phaseNum) {
  e.stopPropagation();
  const newStatus = e.target.value;
  setSongStatus(title, newStatus);
  e.target.className = `status-select ${newStatus}`;
  const card = e.target.closest('.sl-card');
  if (card) {
    card.classList.remove('status-ns','status-ip','status-lrn','status-itf');
    card.classList.add(`status-${newStatus}`);
    // Update the status icon in the card
    const iconSpan = card.querySelector('.status-badge');
    const newIcon = statusIconHtml(newStatus);
    if (iconSpan) {
      iconSpan.outerHTML = newIcon;
    } else if (newIcon) {
      const iconSlot = card.querySelector('.sl-card-top > div:last-child');
      if (iconSlot) iconSlot.insertAdjacentHTML('afterbegin', newIcon);
    }
  }
  // Rebuild phase header stats and progress bar
  rebuildPhaseHeader(phaseNum);
  refreshSiteFromCurriculum();
}

function toggleStretch(e, phaseNum, title) {
  e.stopPropagation();
  const state = getCurriculumState(phaseNum);
  state.stretch = state.stretch === title ? null : title;
  saveCurriculumState(phaseNum, state);
  rebuildSwapPhase(phaseNum);
  refreshSiteFromCurriculum();
}

function rebuildSwapPhase(phaseNum) {
  const phase = PHASES.find(p => p.id === phaseNum);
  if (!phase) return;
  buildSwapTable(`sw-phase${phaseNum}`, SWAPS[`phase${phaseNum}`] || [], false, phaseNum);
}

function rebuildPhaseHeader(phaseNum) {
  const pm = PHASE_META[phaseNum] || PHASE_META[1];
  const state = getCurriculumState(phaseNum);
  const curriculumTitles = state.curriculum;
  const allStatSL = getAllSongStatuses();
  const slDone   = curriculumTitles.filter(t => { const s = allStatSL[t]||'ns'; return s==='lrn'||s==='itf'; }).length;
  const slInProg = curriculumTitles.filter(t => (allStatSL[t]||'ns')==='ip').length;
  const coreSongs = Math.min(curriculumTitles.length, 6);
  const slPct = coreSongs > 0 ? Math.round((slDone / coreSongs) * 100) : 0;

  // Update progress bar fill
  const layout = document.getElementById(`sl-layout-${phaseNum}`);
  if (!layout) return;
  const header = layout.closest('.inner-panel')?.previousElementSibling || layout.parentElement?.querySelector('[style*="prog-bar"]');
  // Find prog-fill within the phase header (sibling of sl-layout)
  const container = document.getElementById(`sw-phase${phaseNum}`);
  if (!container) return;
  const progFill = container.querySelector('.prog-fill');
  if (progFill) progFill.style.width = slPct + '%';
  // Update percentage text
  const pctEl = container.querySelector(`[style*="DM Mono"][style*="letter-spacing:1px"]`);
  if (pctEl) pctEl.textContent = slPct + '%';
  // Update in-progress and learned badges
  const headerDiv = container.querySelector('[style*="border-left"]');
  if (headerDiv) {
    const badgeRow = headerDiv.querySelector('[style*="align-items:center"][style*="gap:10px"]');
    if (badgeRow) {
      // Remove old dynamic badges
      badgeRow.querySelectorAll('.badge-active, .badge-done').forEach(b => b.remove());
      // Add updated ones
      if (slInProg > 0) badgeRow.insertAdjacentHTML('beforeend', `<span class="badge badge-active">${slInProg} in progress</span>`);
      if (slDone   > 0) badgeRow.insertAdjacentHTML('beforeend', `<span class="badge badge-done">${slDone} learned</span>`);
    }
  }
}

function refreshSiteFromCurriculum() {
  buildDashSongs();
  buildToneProfiles();
}

// ═══════════════════════════════════════════
// PERSONAL SECTION
// ═══════════════════════════════════════════
function buildPersonalSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const statusOpts = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}">${label}</option>`).join('');
  container.innerHTML = `
    <div style="margin-bottom:20px">
      <div class="section-label">Personal Repertoire</div>
      <div class="small muted" style="margin-bottom:18px;max-width:600px;line-height:1.7">Songs outside the curriculum — learned for personal reasons. No milestones. No phase assignment. No pressure.</div>
      <div class="stack" style="gap:12px">
        ${GIFT_SONGS.map(s => {
          const status = getSongStatus(s.title);
          const safeName = s.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
          const statusOptsWithSel = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${status===val?'selected':''}>${label}</option>`).join('');
          return `<div class="card" style="border-left:3px solid var(--accent)">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px">
              <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
                <div style="font-size:15px;font-weight:500">${s.title}</div>
                <div class="small dimmed">${s.artist}</div>
                ${s.capo && s.capo !== 'No capo' ? `<span class="tag" style="background:rgba(96,144,184,0.15);color:var(--blue);border-color:rgba(96,144,184,0.3)">${s.capo}</span>` : ''}
              </div>
              <select class="status-select ${status}" onchange="handleExtraStatusChange(event,'${safeName}')">${statusOptsWithSel}</select>
            </div>
            ${s.chords ? `<div class="small" style="color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:0.5px;margin-bottom:8px">${s.chords}</div>` : ''}
            <div class="small muted" style="margin-bottom:8px;line-height:1.6">${s.why}</div>
            <div class="small" style="color:var(--text3);font-style:italic;margin-bottom:10px">${s.notes}</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">${s.skills.map(sk => `<span class="tag">${sk}</span>`).join('')}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="divider"></div>
    <div class="section-label" style="margin-top:16px">Add to Personal Repertoire</div>
    <div class="small muted" style="margin-bottom:12px">Songs you want to remember — not curriculum, just yours.</div>
    <div style="display:flex;gap:8px;margin-bottom:10px">
      <input id="lib-gift-input" type="text" placeholder="Song — Artist" style="flex:1;background:var(--bg3);border:1px solid var(--border2);border-radius:5px;color:var(--text);font-family:'DM Mono',monospace;font-size:12px;padding:8px 12px;outline:none;" />
      <button class="btn btn-sm" onclick="addLibGiftSong()">Add</button>
    </div>
    <div id="lib-gift-user-list" style="display:flex;flex-direction:column;gap:6px"></div>`;
  renderLibGiftSongs();
}

function addLibGiftSong() {
  const input = document.getElementById('lib-gift-input');
  const val = input.value.trim();
  if (!val) return;
  const list = JSON.parse(localStorage.getItem('ngc-gift-songs') || '[]');
  list.push(val);
  localStorage.setItem('ngc-gift-songs', JSON.stringify(list));
  input.value = '';
  renderLibGiftSongs();
}
function removeLibGiftSong(idx) {
  const list = JSON.parse(localStorage.getItem('ngc-gift-songs') || '[]');
  list.splice(idx, 1);
  localStorage.setItem('ngc-gift-songs', JSON.stringify(list));
  renderLibGiftSongs();
}
function renderLibGiftSongs() {
  const container = document.getElementById('lib-gift-user-list');
  if (!container) return;
  const list = JSON.parse(localStorage.getItem('ngc-gift-songs') || '[]');
  if (!list.length) { container.innerHTML = ''; return; }
  container.innerHTML = list.map((s, i) => `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:5px"><span style="flex:1;font-size:13px">${s}</span><button onclick="removeLibGiftSong(${i})" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:16px;line-height:1;padding:0 2px;">×</button></div>`).join('');
}

// ═══════════════════════════════════════════
// ACOUSTIC SECTION
// ═══════════════════════════════════════════
function buildAcousticSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const tierColors = ['var(--green)', 'var(--accent)', 'var(--p5c)'];
  const tierBorderColors = ['rgba(114,168,120,0.35)', 'rgba(196,144,96,0.35)', 'rgba(146,120,176,0.35)'];
  const tierBg = ['rgba(114,168,120,0.06)', 'rgba(196,144,96,0.06)', 'rgba(146,120,176,0.06)'];
  const tiersHTML = ACOUSTIC_SONGS.tiers.map((tier, ti) => {
    const songsHTML = tier.songs.map(s => {
      const isEssential = s.essential;
      const status = getSongStatus(s.title);
      const safeName = s.title.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      const statusOptsWithSel = Object.entries(SONG_STATUS_LABELS).map(([val, label]) => `<option value="${val}" ${status===val?'selected':''}>${label}</option>`).join('');
      return `<div class="card" style="border-left:${isEssential ? '3px' : '2px'} solid ${isEssential ? 'var(--accent2)' : tierColors[ti]};margin-bottom:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:4px;">
          <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
            <div style="font-size:15px;font-weight:500;color:var(--text)">${s.title}</div>
            <div class="small dimmed">${s.artist}</div>
            ${s.capo !== 'No capo' ? `<span class="tag" style="background:rgba(96,144,184,0.15);color:var(--blue);border-color:rgba(96,144,184,0.3)">${s.capo}</span>` : ''}
            ${isEssential ? `<span class="tag" style="background:rgba(196,144,96,0.2);color:var(--accent2);border-color:rgba(196,144,96,0.4);font-weight:600">ESSENTIAL</span>` : ''}
          </div>
          <select class="status-select ${status}" onchange="handleExtraStatusChange(event,'${safeName}')">${statusOptsWithSel}</select>
        </div>
        <div class="small" style="color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:0.5px;margin-bottom:8px">${s.chords}</div>
        <div class="small muted" style="line-height:1.65;margin-bottom:8px">${s.teaches}</div>
        <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:10px;color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:1px;text-transform:uppercase">Vibe</span><span class="tag">${s.vibe}</span></div>
      </div>`;
    }).join('');
    return `<div style="margin-bottom:28px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;padding:10px 14px;background:${tierBg[ti]};border:1px solid ${tierBorderColors[ti]};border-radius:6px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;color:${tierColors[ti]}">${tier.label}</div>
      </div>
      <div class="small muted" style="margin-bottom:14px;padding:0 2px;line-height:1.65">${tier.desc}</div>
      ${songsHTML}
    </div>`;
  }).join('');
  container.innerHTML = `
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:var(--text)">Acoustic Off-Ramp</div><div class="mono small dimmed">Martin GPC-10E Special</div></div>
      <div class="small muted" style="max-width:660px;line-height:1.7;margin-bottom:6px;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;">${ACOUSTIC_SONGS.intro}</div>
    </div>
    ${tiersHTML}`;
}

// ═══════════════════════════════════════════
// HEADER METRONOME
// ═══════════════════════════════════════════
const HM = {
  bpm: 100, beat: 0, beatsPerBar: 4, running: false,
  ctx: null, nextBeatTime: 0, scheduleAheadTime: 0.1,
  intervalMs: 25, timerID: null, tapTimes: []
};

function setAudioVolume(type, val) {
  const key = type === 'metro' ? 'ngc-metro-volume' : 'ngc-timer-volume';
  const labelId = type === 'metro' ? 'metro-vol-label' : 'timer-vol-label';
  const normalized = parseInt(val) / 100;
  localStorage.setItem(key, normalized.toString());
  const label = document.getElementById(labelId);
  if (label) label.textContent = `${val}%`;
}

function getAudioVolume(type) {
  const key = type === 'metro' ? 'ngc-metro-volume' : 'ngc-timer-volume';
  return parseFloat(localStorage.getItem(key) ?? '0.7');
}


  if (!HM.ctx) HM.ctx = new (window.AudioContext || window.webkitAudioContext)();
  return HM.ctx;
}

function hmScheduleBeat(time, isDownbeat) {
  const ctx = hmGetCtx();
  const vol = getAudioVolume('metro');
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.frequency.value = isDownbeat ? 1100 : 660;
  osc.type = 'square';
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(isDownbeat ? 0.22 * vol : 0.12 * vol, time + 0.002);
  gain.gain.linearRampToValueAtTime(0, time + (isDownbeat ? 0.06 : 0.045));
  osc.start(time); osc.stop(time + 0.08);
}

function hmScheduler() {
  const ctx = hmGetCtx();
  while (HM.nextBeatTime < ctx.currentTime + HM.scheduleAheadTime) {
    hmScheduleBeat(HM.nextBeatTime, (HM.beat % HM.beatsPerBar) === 0);
    HM.nextBeatTime += 60.0 / HM.bpm;
    HM.beat++;
  }
}

function hmStart() {
  if (HM.running) return;
  HM.running = true; HM.beat = 0;
  const ctx = hmGetCtx();
  if (ctx.state === 'suspended') ctx.resume();
  HM.nextBeatTime = ctx.currentTime + 0.05;
  HM.timerID = setInterval(hmScheduler, HM.intervalMs);
  const btn = document.getElementById('sm-start-btn');
  const input = document.getElementById('sm-bpm-input');
  if (btn) { btn.textContent = 'Stop'; btn.classList.add('active'); }
  if (input) input.classList.add('running');
}

function hmStop() {
  HM.running = false;
  clearInterval(HM.timerID); HM.timerID = null;
  const btn = document.getElementById('sm-start-btn');
  const input = document.getElementById('sm-bpm-input');
  if (btn) { btn.textContent = 'Start'; btn.classList.remove('active'); }
  if (input) input.classList.remove('running');
}

function hmToggle() { HM.running ? hmStop() : hmStart(); }

function hmSetBpm(val) {
  val = Math.max(40, Math.min(240, parseInt(val) || 100));
  HM.bpm = val;
  const input = document.getElementById('sm-bpm-input');
  if (input && document.activeElement !== input) input.value = val;
}

function hmTap() {
  const now = performance.now();
  HM.tapTimes.push(now);
  if (HM.tapTimes.length > 6) HM.tapTimes.shift();
  if (HM.tapTimes.length >= 2) {
    const gaps = [];
    for (let i = 1; i < HM.tapTimes.length; i++) gaps.push(HM.tapTimes[i] - HM.tapTimes[i-1]);
    const avg = gaps.reduce((a,b) => a+b, 0) / gaps.length;
    hmSetBpm(Math.round(60000 / avg));
    const input = document.getElementById('sm-bpm-input');
    if (input) input.value = HM.bpm;
  }
  const btn = document.getElementById('sm-tap-btn');
  if (btn) { btn.classList.add('tapped'); setTimeout(() => btn.classList.remove('tapped'), 100); }
}

// Shims for any legacy references
const METRO = { get bpm() { return HM.bpm; }, get running() { return HM.running; }, tapTimes: [] };
function metroToggle() { hmToggle(); }
function metroSetBpm(val) { hmSetBpm(val); }
function metroAdjust(delta) { hmSetBpm(HM.bpm + delta); }
function metroTap() { hmTap(); }
function metroStart() { hmStart(); }
function metroStop() { hmStop(); }

// ═══════════════════════════════════════════
// PRACTICE TIMER
// ═══════════════════════════════════════════
const TIMER = { segments:[], segIdx:0, totalSecs:0, remainSecs:0, running:false, waiting:false, interval:null, doneSegs:new Set() };
const CIRCUMFERENCE = 2 * Math.PI * 54;

function timerGetSessionSegs() {
  const activePlan = document.querySelector('.session-plan.active');
  if (!activePlan) return [];
  const segs = [];
  activePlan.querySelectorAll('.sblock').forEach(block => {
    const timeEl = block.querySelector('.sblock-time');
    const headEl = block.querySelector('.sblock-head');
    if (!timeEl || !headEl) return;
    const mins = parseInt(timeEl.textContent);
    if (isNaN(mins)) return;
    segs.push({ label: headEl.textContent.trim(), minutes: mins });
  });
  return segs;
}

function timerLoadSession() {
  const segs = timerGetSessionSegs();
  if (!segs.length) return;
  timerStop(); TIMER.segments = segs; TIMER.segIdx = 0; TIMER.doneSegs.clear();
  timerInitSeg(); timerRenderSegs();
  document.getElementById('timer-mode-label').textContent = 'Session';
}

function timerToggleCustom() {
  const expand = document.getElementById('timer-custom-expand');
  const btn = document.getElementById('timer-custom-toggle');
  const isOpen = expand.classList.contains('open');
  expand.classList.toggle('open', !isOpen);
  btn.classList.toggle('active', !isOpen);
  if (!isOpen) setTimeout(() => document.getElementById('timer-custom-min').focus(), 50);
}

function timerLoadCustom() {
  const val = parseInt(document.getElementById('timer-custom-min').value);
  if (!val || val < 1) return;
  timerStop(); TIMER.segments = [{label:'Practice', minutes:val}]; TIMER.segIdx = 0; TIMER.doneSegs.clear();
  timerInitSeg(); timerRenderSegs();
  document.getElementById('timer-mode-label').textContent = 'Custom';
  // Close the expand panel
  document.getElementById('timer-custom-expand').classList.remove('open');
  document.getElementById('timer-custom-toggle').classList.remove('active');
}

function timerInitSeg() {
  const seg = TIMER.segments[TIMER.segIdx];
  if (!seg) { timerDone(); return; }
  TIMER.totalSecs = seg.minutes * 60; TIMER.remainSecs = TIMER.totalSecs; timerRender();
}

function timerToggle() { if (!TIMER.segments.length) { timerLoadSession(); return; } TIMER.running ? timerStop() : timerStart(); }

function timerStart() {
  if (!TIMER.segments.length) return;
  TIMER.running = true;
  document.getElementById('timer-start-btn').textContent = 'Pause';
  document.getElementById('timer-ring').classList.add('running');
  TIMER.interval = setInterval(() => {
    if (TIMER.remainSecs <= 0) timerSegComplete();
    else { TIMER.remainSecs--; timerRender(); }
  }, 1000);
}

function timerStop() {
  TIMER.running = false; TIMER.waiting = false; clearInterval(TIMER.interval);
  const btn = document.getElementById('timer-start-btn');
  btn.textContent = 'Start'; btn.classList.remove('timer-btn-waiting');
  document.getElementById('timer-ring').classList.remove('running');
}

function timerReset() {
  timerStop(); TIMER.segIdx = 0; TIMER.doneSegs.clear();
  if (TIMER.segments.length) timerInitSeg();
  else { document.getElementById('timer-digits').textContent = '00:00'; document.getElementById('timer-seg-label').textContent = '—'; }
  timerRenderSegs(); document.getElementById('timer-ring').classList.remove('done');
}

function timerNextSeg() { if (!TIMER.segments.length) return; timerSegComplete(); }

function timerSegComplete() {
  timerPing();
  clearInterval(TIMER.interval); TIMER.interval = null; TIMER.running = false; TIMER.waiting = true;
  document.getElementById('timer-ring').classList.remove('running');

  // If this was a single-block timer (block-activated), auto-advance to next block
  const activePlan = document.querySelector('.session-plan.active');
  const hasActiveBlock = activePlan && activePlan.querySelector('.sblock.active-block');
  if (hasActiveBlock) {
    TIMER.doneSegs.add(TIMER.segIdx);
    blockAutoComplete();
    return;
  }

  // Otherwise: standard session segment advance
  TIMER.doneSegs.add(TIMER.segIdx); TIMER.segIdx++;
  if (TIMER.segIdx >= TIMER.segments.length) { timerDone(); return; }
  timerInitSeg(); timerRenderSegs();
  const nextSeg = TIMER.segments[TIMER.segIdx];
  document.getElementById('timer-digits').textContent = 'Ready';
  document.getElementById('timer-seg-label').textContent = nextSeg ? nextSeg.label : '—';
  document.getElementById('timer-ring').style.strokeDashoffset = 0;
  const btn = document.getElementById('timer-start-btn');
  btn.textContent = 'Start'; btn.classList.add('timer-btn-waiting');
}

function timerDone() {
  timerStop(); TIMER.remainSecs = 0;
  document.getElementById('timer-digits').textContent = 'Done';
  document.getElementById('timer-seg-label').textContent = 'Session complete';
  document.getElementById('timer-ring').classList.remove('running'); document.getElementById('timer-ring').classList.add('done');
  document.getElementById('timer-ring').style.strokeDashoffset = 0;
  timerRenderSegs(); timerPing(true);
}

function timerRender() {
  const m = Math.floor(TIMER.remainSecs/60), s = TIMER.remainSecs%60;
  document.getElementById('timer-digits').textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  const seg = TIMER.segments[TIMER.segIdx];
  document.getElementById('timer-seg-label').textContent = seg ? seg.label : '—';
  const frac = TIMER.totalSecs > 0 ? TIMER.remainSecs / TIMER.totalSecs : 0;
  document.getElementById('timer-ring').style.strokeDashoffset = CIRCUMFERENCE * (1 - frac);
}

function timerRenderSegs() {
  const el = document.getElementById('timer-segments');
  if (!el || !TIMER.segments.length) { if(el) el.innerHTML=''; return; }
  el.innerHTML = TIMER.segments.map((seg, i) => {
    let cls = 'timer-seg-row';
    if (i === TIMER.segIdx) cls += ' active-seg';
    if (TIMER.doneSegs.has(i)) cls += ' done-seg';
    return `<div class="${cls}" onclick="timerJumpSeg(${i})"><div class="timer-seg-dot"></div><div class="timer-seg-name">${seg.label}</div><div class="timer-seg-time">${seg.minutes} min</div></div>`;
  }).join('');
  const total = TIMER.segments.reduce((a,b)=>a+b.minutes,0);
  el.innerHTML += `<div style="text-align:right;margin-top:6px;font-family:'DM Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:1px">TOTAL: ${total} MIN</div>`;
}

function timerJumpSeg(idx) {
  timerStop(); TIMER.segIdx = idx; TIMER.doneSegs.clear();
  for(let i=0;i<idx;i++) TIMER.doneSegs.add(i);
  timerInitSeg(); timerRenderSegs();
}

function timerPing(final=false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const vol = getAudioVolume('timer');
    const tones = final ? [523,659,784] : [660,880];
    tones.forEach((freq,i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.18 * vol, t+0.02); gain.gain.linearRampToValueAtTime(0, t+0.35);
      osc.start(t); osc.stop(t+0.4);
    });
  } catch(e) {}
}

// ═══════════════════════════════════════════
// VIEWPORT PREVIEW (Admin)
// ═══════════════════════════════════════════
function setViewportPreview(mode) {
  localStorage.setItem('ngc-viewport-preview', mode);
  document.body.classList.remove('preview-tablet', 'preview-phone');
  if (mode === 'tablet') document.body.classList.add('preview-tablet');
  if (mode === 'phone')  document.body.classList.add('preview-phone');
  // Rebuild drawer to update active button state
  buildSettingsDrawer();
}

function initViewportPreview() {
  const mode = localStorage.getItem('ngc-viewport-preview') || 'desktop';
  document.body.classList.remove('preview-tablet', 'preview-phone');
  if (mode === 'tablet') document.body.classList.add('preview-tablet');
  if (mode === 'phone')  document.body.classList.add('preview-phone');
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
function init() {
  initTheme();
  initViewportPreview();
  const wbr = document.getElementById('week-btn-row');
  if (wbr) {
    for (let i = 1; i <= 12; i++) {
      const b = document.createElement('button');
      b.className = 'btn btn-week';
      b.id = 'wbtn-' + i;
      b.textContent = 'Week ' + i;
      b.onclick = () => setWeek(i);
      wbr.appendChild(b);
    }
  }
  buildDashSongs();
  buildCurriculum();
  buildMilestones();
  buildToneProfiles();
  buildSwapTable('sw-phase1', SWAPS.phase1, false, 1);
  buildSwapTable('sw-phase2', SWAPS.phase2, false, 2);
  buildSwapTable('sw-phase3', SWAPS.phase3, false, 3);
  buildSwapTable('sw-phase4', SWAPS.phase4 || [], false, 4);
  buildSwapTable('sw-phase5', SWAPS.phase5 || [], false, 5);
  buildSwapTable('sw-metalitch', SWAPS.metalitch, true, null);
  buildPersonalSection('sw-personal');
  buildAcousticSection('sw-acoustic');

  const savedNotes = localStorage.getItem('ngc-notes');
  if (savedNotes) document.getElementById('session-notes').value = savedNotes;
  setWeek(currentWeek);
  document.querySelectorAll('.check-row').forEach(row => {
    const key = row.querySelector('.check-label').textContent;
    if (checkedItems[key]) row.classList.add('done');
  });

  // New: restore block states and build streak
  restoreBlockStates();
  buildStreakCard();
  // Restore completion banner if today was already done
  checkSessionComplete();
  // Restore gear image URLs
  applyAllGearUrls();
  // Load session timer by default
  setTimeout(timerLoadSession, 100);
}

document.addEventListener('DOMContentLoaded', init);
