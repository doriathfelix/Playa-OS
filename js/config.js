// ══════════════════════════════════════════
// CONFIG TABLES
// ══════════════════════════════════════════
// prio : ordre de priorité auto-placement (1=meilleur).
//   1-9  : terrasse extérieure (16-24) — meilleur
//   10-13: 1, 5, 8, 9
//   14-22: reste salle (2,3,4,6,7,10,11,12,14)
//   23+  : salon 13, hautes, bar 25-26, salons 1-4 — dernier recours
// sun  : 'ombre' | 'soleil' | 'mi' — pour demandes particulières
// p    : true = terrasse (affichage visuel distinctif)
const TABLE_DATA = {
  // ── Terrasse gauche (extérieur = priorité 1, séquentiel 16→24) ──
  16:{lo:2,hi:3,p:true, prio:1,  sun:'ombre'},
  17:{lo:2,hi:2,p:true, prio:2,  sun:'soleil'},
  18:{lo:2,hi:2,p:true, prio:3,  sun:'soleil'},
  19:{lo:4,hi:5,p:true, prio:4,  sun:'mi'},
  20:{lo:2,hi:2,p:true, prio:5,  sun:'mi'},
  21:{lo:4,hi:5,p:true, prio:6,  sun:'mi'},
  22:{lo:2,hi:2,p:true, prio:7,  sun:'ombre'},
  23:{lo:4,hi:5,p:true, prio:8,  sun:'mi'},
  24:{lo:2,hi:2,p:true, prio:9,  sun:'mi'},
  // ── Salle — priorité 2 : 1, 5, 8, 9 en tête ──
  1: {lo:2,hi:2,p:false,prio:10, sun:'ombre'},
  5: {lo:5,hi:5,p:false,prio:11, sun:'ombre'},
  8: {lo:5,hi:5,p:false,prio:12, sun:'ombre'},
  9: {lo:4,hi:4,p:false,prio:13, sun:'ombre'},
  // ── Salle — priorité 3 : reste (2,3,4,6,7,10,11,12,14) ──
  2: {lo:2,hi:2,p:false,prio:14, sun:'ombre'},
  3: {lo:2,hi:2,p:false,prio:15, sun:'ombre'},
  4: {lo:4,hi:4,p:false,prio:16, sun:'ombre'},
  6: {lo:2,hi:2,p:false,prio:17, sun:'ombre'},
  7: {lo:4,hi:4,p:false,prio:18, sun:'ombre'},
  10:{lo:5,hi:5,p:false,prio:19, sun:'ombre', note:'banc'},
  11:{lo:2,hi:2,p:false,prio:20, sun:'soleil'},
  12:{lo:2,hi:2,p:false,prio:21, sun:'soleil'},
  14:{lo:2,hi:2,p:false,prio:22, sun:'soleil'},
  // ── Dernier recours : salon 13, hautes, bar, salons côté salle ──
  13:{lo:4,hi:4,p:false,prio:23, sun:'soleil', lbl:'Salon 13'},
  27:{lo:2,hi:2,p:false,prio:24, sun:'ombre'},
  28:{lo:2,hi:2,p:false,prio:25, sun:'ombre'},
  29:{lo:2,hi:2,p:false,prio:26, sun:'ombre'},
  30:{lo:2,hi:2,p:false,prio:27, sun:'ombre'},
  25:{lo:2,hi:2,p:false,prio:28, sun:'soleil'},
  26:{lo:2,hi:2,p:false,prio:29, sun:'soleil'},
  1001:{lo:3,hi:3,p:false,prio:30, sun:'ombre', lbl:'Salon 1'},
  1002:{lo:3,hi:3,p:false,prio:31, sun:'ombre', lbl:'Salon 2'},
  1003:{lo:2,hi:2,p:false,prio:32, sun:'ombre', lbl:'Salon 3'},
  1004:{lo:3,hi:3,p:false,prio:33, sun:'ombre', lbl:'Salon 4'},
};
// Compat autoplace
const TABLES = Object.entries(TABLE_DATA).map(([id,d])=>({id:+id,...d,z:'',sz:d.hi>=4?'md':'sm',lo:d.lo,hi:d.hi}));
const TZONES = [];
const TAB_KEYS = ['s1','s2','transats','soir','soir2'];
const TAB_LABELS = ['Service 1 · 12h–14h','Service 2 · 14h15–15h30','Transats','Soir · 19h30','Soir 2 · 21h'];
const TAB_SHORT  = ['S1','S2','Transats','Soir','Soir 2'];

const TR_ROWS = [
  {id:100,lbl:'Rangée 100 — proche restaurant',sea:false},
  {id:200,lbl:'Rangée 200',sea:false},
  {id:300,lbl:'Rangée 300',sea:false},
  {id:400,lbl:'Rangée 400',sea:false},
  {id:500,lbl:'Rangée 500 — 1ère ligne mer',sea:true},
];
const trSlots = b => {
  if(b === 100) return { g:[], m:[], d:[] };
  return {
    g:[1,2,3,4,5,6,7].map(n=>b+n),
    m:[8,9,10,11,12,13].map(n=>b+n),   // pos 13 = 12bis
    d:[14,15,16,17,18,19,20,21].map(n=>b+n)
  };
};

// ── Salons spéciaux — rangée 100 uniquement (remplacent les slots 108-116)
// Chaque salon occupe la largeur de 2 transats (double bouton)
// gridCol : colonnes CSS dans la grille renderTransats (label=1, g=2-8, alley=9, m=10-14, alley=15, d=16-23, extra=24)
const SALON_SLOTS = [
  {id:1001, lbl:'Salon 1', gridCol:'10 / 12', gridRow:1},  // remplace 108-109
  {id:1002, lbl:'Salon 2', gridCol:'12 / 14', gridRow:1},  // remplace 110-111
  {id:1003, lbl:'Salon 3', gridCol:'17 / 19', gridRow:1},  // remplace 113-114 (décalé par 12bis)
  {id:1004, lbl:'Salon 4', gridCol:'19 / 21', gridRow:1},  // remplace 115-116 (décalé par 12bis)
];

// ── BEDs spéciaux — rangée 100 (101-103) + rangée 200 positions 19-21 (219-221)
// Transats lit/cabane, style ambré/ocre distinct — capacité 2 PAX par slot
const BED_SLOTS = [101, 102, 103, 220, 221, 222];
// Slot 219 est maintenant un transat ordinaire (label "218") entre le 217 et les BEDs

