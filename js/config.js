// ══════════════════════════════════════════
// CONFIG TABLES
// ══════════════════════════════════════════
// Données capacités par table (pour autoplace + tooltip)
const TABLE_DATA = {
  16:{lo:2,hi:3,p:true}, 17:{lo:2,hi:2,p:true}, 18:{lo:2,hi:2,p:true},
  19:{lo:4,hi:5,p:true}, 20:{lo:2,hi:2,p:true}, 21:{lo:4,hi:5,p:true},
  22:{lo:2,hi:2,p:true}, 23:{lo:4,hi:5,p:true}, 24:{lo:2,hi:2,p:true},
  1:{lo:2,hi:3,p:false}, 2:{lo:2,hi:2,p:false}, 3:{lo:2,hi:3,p:false},
  4:{lo:4,hi:5,p:false}, 5:{lo:5,hi:6,p:false}, 6:{lo:2,hi:2,p:false},
  7:{lo:4,hi:6,p:false}, 8:{lo:5,hi:6,p:false},
  9:{lo:2,hi:3,p:false}, 10:{lo:4,hi:5,p:false,note:'banc'},
  11:{lo:4,hi:5,p:false,note:'banc'}, 12:{lo:2,hi:3,p:false},
  13:{lo:2,hi:3,p:false}, 14:{lo:2,hi:3,p:false},
  25:{lo:2,hi:2,p:false}, 26:{lo:2,hi:2,p:false},
  27:{lo:2,hi:3,p:false}, 28:{lo:2,hi:2,p:false},
  29:{lo:2,hi:2,p:false}, 30:{lo:2,hi:3,p:false},
};
// Compat autoplace
const TABLES = Object.entries(TABLE_DATA).map(([id,d])=>({id:+id,...d,z:'',sz:d.hi>=4?'md':'sm',lo:d.lo,hi:d.hi}));
const TZONES = [];
const TAB_KEYS = ['s1','s2','transats','soir'];
const TAB_LABELS = ['Service 1 · 12h–14h','Service 2 · 14h15–15h30','Transats','Soir · 19h30'];
const TAB_SHORT  = ['S1','S2','Transats','Soir'];

const TR_ROWS = [
  {id:100,lbl:'Rangée 100 — proche restaurant',sea:false},
  {id:200,lbl:'Rangée 200',sea:false},
  {id:300,lbl:'Rangée 300',sea:false},
  {id:400,lbl:'Rangée 400',sea:false},
  {id:500,lbl:'Rangée 500 — 1ère ligne mer',sea:true},
];
const trSlots = b => ({
  g:[1,2,3,4,5,6,7].map(n=>b+n),
  m:[8,9,10,11,12].map(n=>b+n),
  d:[13,14,15,16,17,18,19,20].map(n=>b+n)
});

// ── Salons spéciaux — rangée 100 uniquement (remplacent les slots 108-116)
// Chaque salon occupe la largeur de 2 transats (double bouton)
// gridCol : colonnes CSS dans la grille renderTransats (label=1, g=2-8, alley=9, m=10-14, alley=15, d=16-23, extra=24)
const SALON_SLOTS = [
  {id:1001, lbl:'Salon 1', gridCol:'10 / 12', gridRow:1},  // remplace 108-109
  {id:1002, lbl:'Salon 2', gridCol:'12 / 14', gridRow:1},  // remplace 110-111
  {id:1003, lbl:'Salon 3', gridCol:'16 / 18', gridRow:1},  // remplace 113-114
  {id:1004, lbl:'Salon 4', gridCol:'18 / 20', gridRow:1},  // remplace 115-116
];

// ── BEDs spéciaux — rangée 200, positions 19-21 (slots 219-221)
// Transats lit/cabane, style ambré/ocre distinct
const BED_SLOTS = [219, 220, 221];

