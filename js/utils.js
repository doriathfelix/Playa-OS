// ══════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════
const tk = () => TAB_KEYS[currentTab];
const gr = () => reservations[tk()];
const saveUndo = () => {
  undoStack.push(JSON.parse(JSON.stringify({reservations,fused,extraTransats})));
  if(undoStack.length > 30) undoStack.shift();
};
function doUndo(){
  if(!undoStack.length) return;
  const u = undoStack.pop();
  reservations = u.reservations; fused = u.fused; extraTransats = u.extraTransats;
  selectedId = null; render();
}
const sortByTime = arr => [...arr].sort((a,b) => parseFloat(a.time.replace('h','.'))-parseFloat(b.time.replace('h','.')));
// Tri par date de réservation (ancienneté = priorité) — null à la fin
const sortByBookedAt = arr => [...arr].sort((a,b)=>{
  if(!a.booked_at && !b.booked_at) return 0;
  if(!a.booked_at) return 1;
  if(!b.booked_at) return -1;
  return new Date(a.booked_at) - new Date(b.booked_at);
});
function buildSlotMap(){
  const m = {};
  gr().forEach(r => {
    if(!r.placed) return;
    if(r.extraSlots && r.extraSlots.length){
      // Marquer UNIQUEMENT les slots réels (pas de rectangle englobant)
      // Les "trous" dans le rectangle restent disponibles pour d'autres resas
      r.extraSlots.forEach(s => m[s] = r);
    } else if(r.slot){
      for(let i=0;i<(r.tr||1);i++) m[r.slot+i]=r;
    }
  });
  return m;
}
function svcClass(s){ return s==='s1'?'s1c':s==='s2'?'s2c':'soc'; }
function getFused(tid){ return (fused[tk()]||[]).find(g=>g.tids.includes(tid)); }
function capStr(t){ return t.lo===t.hi ? `${t.hi}p` : `${t.lo}-${t.hi}p`; }

function buildCurrentOrder(){
  return {
    terrasse:[16,17,18,19,20,21,22,23,24],
    barVue:[25,26],
    salle:[1,2,3,4,5,6,7,8,9,10,11],
    terrasse2:[12,13,14],
    tableHaute:[27,28,29,30]
  };
}
function swapTablePositions(idA,idB){
  if(!tableOrder) tableOrder=JSON.parse(JSON.stringify(buildCurrentOrder()));
  // Vérifier que les deux tables sont dans tableOrder
  const allTables = Object.values(tableOrder).flat();
  if(!allTables.includes(idA) || !allTables.includes(idB)){
    toast('Table introuvable dans le plan');
    return;
  }
  let posA=null,posB=null;
  for(const zone of Object.keys(tableOrder)){
    const arr=tableOrder[zone];
    const iA=arr.indexOf(idA);const iB=arr.indexOf(idB);
    if(iA>=0) posA={zone,idx:iA};
    if(iB>=0) posB={zone,idx:iB};
  }
  if(!posA||!posB){toast('Position introuvable');return;}
  // Swap propre : juste les positions, pas les IDs de resas
  tableOrder[posA.zone][posA.idx]=idB;
  tableOrder[posB.zone][posB.idx]=idA;
}

// ── localStorage (extra transats)
// Note: loadExtra() est définie dans state.js (chargé en premier)
function saveExtra(){ try{ localStorage.setItem('playa_extra',JSON.stringify(extraTransats)); }catch(e){} }
function saveTransatConfig(){ saveExtra(); toast('Config sauvegardée pour demain ✓'); }
function resetTransatConfig(){ if(!confirm('Réinitialiser le plan de transats ?')) return; extraTransats={}; saveExtra(); render(); toast('Plan réinitialisé'); }

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.opacity='1';
  clearTimeout(t._tid);
  t._tid = setTimeout(()=>t.style.opacity='0', 2500);
}

// ══════════════════════════════════════════
// RUSH TIMELINE
// ══════════════════════════════════════════
function renderRush(){ /* supprime - jauge retire */ }

// ══════════════════════════════════════════
