// ══════════════════════════════════════════
// FUSION
// ══════════════════════════════════════════
function toggleFuse(){
  fuseMode=!fuseMode; fuseTargets=[]; fuseTrTargets=[];
  const btn=document.getElementById('fuse-btn');
  btn.className='tbtn '+(fuseMode?'tbtn-fuse-on':'tbtn-fuse');
  btn.textContent=fuseMode?`⊕ Valider (${fuseTargets.length})` :'⊕ Fusionner';
  btn.onclick=fuseMode?confirmFuse:toggleFuse;
  if(!fuseMode) render(); else render();
}
function tapFuse(id){
  if(currentTab===2){
    // Transats : fuseTrTargets = slot numbers
    const idx=fuseTrTargets.indexOf(id);
    if(idx>=0) fuseTrTargets.splice(idx,1);
    else fuseTrTargets.push(id);
    const btn=document.getElementById('fuse-btn');
    btn.textContent=`⊕ Valider (${fuseTrTargets.length} transats)`;
    if(fuseTrTargets.length>=2) btn.onclick=confirmFuseTr;
    else btn.onclick=toggleFuse;
  } else {
    const idx=fuseTargets.indexOf(id);
    if(idx>=0) fuseTargets.splice(idx,1);
    else fuseTargets.push(id);
    const btn=document.getElementById('fuse-btn');
    btn.textContent=`⊕ Valider (${fuseTargets.length} tables)`;
    if(fuseTargets.length>=2) btn.onclick=confirmFuse;
    else btn.onclick=null;
  }
  render();
}

function confirmFuseTr(){
  if(fuseTrTargets.length < 2) return;
  // Ouvrir un modal pour choisir quelle resa assigner à ces slots
  showAssignTransatModal([...fuseTrTargets]);
}

// Modal : choisir une resa non placée pour l'assigner aux slots sélectionnés
function showAssignTransatModal(slots){
  let existing = document.getElementById('assign-tr-modal');
  if(existing) existing.remove();

  // Resas transats non placées disponibles
  const candidates = reservations.transats.filter(r => !r.ns);

  const overlay = document.createElement('div');
  overlay.id = 'assign-tr-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:250;display:flex;align-items:center;justify-content:center;padding:20px';

  const box = document.createElement('div');
  box.style.cssText = 'background:var(--card);border-radius:var(--r-xl);padding:24px;width:100%;max-width:380px;box-shadow:var(--shadow-md);max-height:80vh;overflow-y:auto';

  const slotsLabel = slots.length + ' transats sélectionnés';

  let html = `
    <div style="font-size:16px;font-weight:800;margin-bottom:4px">Assigner une réservation</div>
    <div style="font-size:11px;color:var(--t3);margin-bottom:16px">${slotsLabel}</div>
    <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Choisir la réservation</div>
  `;

  if(!candidates.length){
    html += `<div style="font-size:12px;color:var(--t3);padding:12px 0">Aucune réservation transats disponible</div>`;
  }

  box.innerHTML = html;

  candidates.forEach(r => {
    const btn = document.createElement('div');
    const svcCol = r.svc==='s1'?'var(--s1t)':r.svc==='s2'?'var(--s2t)':'var(--rtt)';
    const svcBg = r.svc==='s1'?'var(--s1bg)':r.svc==='s2'?'var(--s2bg)':'var(--rtbg)';
    const svcBd = r.svc==='s1'?'var(--s1bd)':r.svc==='s2'?'var(--s2bd)':'var(--rtbd)';
    btn.style.cssText = `display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid var(--sep2);border-radius:var(--r);margin-bottom:6px;cursor:pointer;transition:all .13s`;
    btn.innerHTML = `
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--t1)">${r.name}</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">${r.pax} PAX · ${r.tr||r.pax} transats</div>
      </div>
      <span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:${svcBg};color:${svcCol};border:0.5px solid ${svcBd}">${r.svc==='s1'?'S1':r.svc==='s2'?'S2':'RT'}</span>
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = 'var(--bg)');
    btn.addEventListener('mouseleave', () => btn.style.background = '');
    btn.addEventListener('click', () => {
      saveUndo();
      // Placer la resa sur les slots sélectionnés
      r.placed = true;
      r.slot = slots[0];
      r.extraSlots = slots.length > 1 ? [...slots] : null;
      r.tr = slots.length;
      overlay.remove();
      fuseTrTargets = []; fuseMode = false;
      const fusebtn = document.getElementById('fuse-btn');
      if(fusebtn){ fusebtn.className='tbtn tbtn-fuse'; fusebtn.textContent='⊕ Fusionner'; fusebtn.onclick=toggleFuse; }
      selectedId = r.id;
      render();
      toast(`${r.name} → ${slots.length} transats ✓`);
    });
    box.appendChild(btn);
  });

  // Bouton annuler
  const cancel = document.createElement('button');
  cancel.style.cssText = 'width:100%;margin-top:8px;padding:10px;border-radius:var(--r);border:0.5px solid var(--sep2);background:var(--bg);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;color:var(--t1)';
  cancel.textContent = 'Annuler';
  cancel.addEventListener('click', () => { overlay.remove(); });
  box.appendChild(cancel);

  overlay.appendChild(box);
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);

  // Reset fuse state
  fuseTrTargets = []; fuseMode = false;
  const fusebtn = document.getElementById('fuse-btn');
  if(fusebtn){ fusebtn.className='tbtn tbtn-fuse'; fusebtn.textContent='⊕ Fusionner'; fusebtn.onclick=toggleFuse; }
  render(); // re-render pour effacer la sélection dorée
}
function confirmFuse(){
  if(fuseTargets.length<2) return;
  saveUndo();
  fused[tk()]=fused[tk()].filter(g=>!g.tids.some(t=>fuseTargets.includes(t)));
  fused[tk()].push({id:'fg'+(fuseCounter++),tids:[...fuseTargets]});
  fuseTargets=[]; fuseMode=false;
  const btn=document.getElementById('fuse-btn');
  btn.className='tbtn tbtn-fuse'; btn.textContent='⊕ Fusionner'; btn.onclick=toggleFuse;
  toast(`Tables ${fused[tk()][fused[tk()].length-1].tids.join('-')} fusionnées ✓`);
  render();
}

// ══════════════════════════════════════════
// AUTO-PLACEMENT INTELLIGENT
// ══════════════════════════════════════════

// Lance l'auto-placement pour un service précis, sans changer l'onglet affiché
function autoPlaceFor(svcKey){
  saveUndo();
  reAnalyzeAllResas();
  const prevTab = currentTab;
  currentTab = TAB_KEYS.indexOf(svcKey);
  const all = reservations[svcKey];
  const resas = svcKey === 'transats'
    ? all.filter(r => !r.placed && !r.ns && !r.waiting)
    : all.filter(r => !r.placed && !r.ns && !r.waiting && r.svc === svcKey);
  const skipped = all.filter(r => !r.ns && r.waiting).length;
  svcKey === 'transats' ? autoTransats(resas, skipped) : autoTables(resas, skipped);
  currentTab = prevTab;
  render();
}

function autoPlace(){
  saveUndo();
  reAnalyzeAllResas();
  const svcKey = tk(); // 's1' | 's2' | 'transats' | 'soir' | 'soir2'
  const all = gr();

  // Filtre strict : on ne place QUE les resas appartenant au service actif.
  // Évite que des resas mal classées (svc !== svcKey) soient placées par erreur.
  // Exception : onglet Transats → toutes les resas de reservations.transats sont valides.
  const resas = currentTab === 2
    ? all.filter(r => !r.placed && !r.ns && !r.waiting)
    : all.filter(r => !r.placed && !r.ns && !r.waiting && r.svc === svcKey);

  const skipped = all.filter(r => !r.ns && r.waiting).length;
  currentTab === 2 ? autoTransats(resas, skipped) : autoTables(resas, skipped);
  render();
}

// Zones du plan — définit quelles tables sont proches (fusion prioritaire dans la même zone)
const TABLE_ZONES = {
  terrasse:    [16,17,18,19,20,21,22,23,24],
  barVue:      [25,26],
  salle:       [1,2,3,4,5,6,7,8,9,10],
  terrasse2:   [11,12,13,14],
  tableHaute:  [27,28,29,30],
  salonSalle:  [1001,1002,1003,1004],
};

// Combinaisons de fusion autorisées.
// La capacité est calculée dynamiquement : somme des hi de chaque table + (n-1) chaises bonus.
// Règle : chaque fusion de 2 tables gagne +1 chaise → n tables fusionnées = +(n-1) au total.
// ⚠ Jamais : 7+8 (pas fusionnables physiquement)
const FUSION_COMBOS = [
  // ── Terrasse (paires côte-à-côte) ──
  {tids:[19,20]}, {tids:[21,22]}, {tids:[23,24]},
  // ── Salle intérieure ──
  {tids:[1,2]},  {tids:[2,3]},  {tids:[11,12]},
  {tids:[3,4]},  {tids:[5,6]},  {tids:[10,11]}, {tids:[9,10]},
  // ── Tables hautes ──
  {tids:[27,28]}, {tids:[28,29]}, {tids:[29,30]},
  // ── 3 tables ──
  {tids:[1,2,3]}, {tids:[9,10,11]},
  {tids:[27,28,29]}, {tids:[28,29,30]},
  // ── 4 tables ──
  {tids:[27,28,29,30]}, {tids:[1,2,3,4]},
];

// Capacité d'une fusion = somme des hi individuels + (n_tables - 1) chaises bonus
function fusionHi(tids){
  return tids.reduce((s,tid)=>s+(TABLE_DATA[tid]?.hi||0),0) + tids.length - 1;
}

// Trouve la meilleure fusion : la plus petite combo libre qui couvre le PAX
function findBestFusion(pax, used){
  const available = FUSION_COMBOS
    .filter(c => !c.tids.some(tid => used.has(tid)))
    .map(c => ({...c, hi: fusionHi(c.tids)}))
    .filter(c => c.hi >= pax);
  if(!available.length) return null;
  available.sort((a,b) => a.tids.length - b.tids.length || a.hi - b.hi);
  return available[0];
}

function parseTableRequest(text){
  if(!text) return null;
  const t = text.toLowerCase();
  const m = t.match(/table\s*(?:n[°oa]?\s*)?(\d+)/i) || t.match(/\bt(\d+)\b/);
  if(m){ const n = parseInt(m[1]); if(n >= 1 && n <= 30 && TABLE_DATA[n]) return n; }
  return null;
}

function findExtremity(sm, needed, forceRow){
  const rowOrder = forceRow
    ? TR_ROWS.filter(r => r.id === forceRow)
    : TR_ROWS;
  for(const row of rowOrder){
    const {g, d} = trSlots(row.id);
    if(g.length >= needed){
      const gSlots = g.slice(0, needed);
      if(gSlots.every(s => !sm[s])) return {slots: gSlots, start: gSlots[0]};
    }
    if(d.length >= needed){
      const dSlots = d.slice(d.length - needed);
      if(dSlots.every(s => !sm[s])) return {slots: dSlots, start: dSlots[0]};
    }
  }
  return null;
}

function autoTables(resas, skipped=0){
  const used = new Set(gr().filter(r=>r.placed&&r.tableId).map(r=>r.tableId));

  // ── Fusions existantes (créées manuellement = plan sur mesure)
  // On calcule leur capacité totale et si elles sont déjà occupées
  const existingFusions = (fused[tk()]||[]).map(g => {
    const occupied = gr().some(r => r.placed && g.tids.includes(r.tableId));
    const totalHi  = g.tids.reduce((s, tid) => s + (TABLE_DATA[tid]?.hi || 0), 0) + g.tids.length - 1;
    g.tids.forEach(tid => used.add(tid)); // marquer toutes leurs tables comme prises
    return { ...g, occupied, totalHi };
  });
  // Fusions vides disponibles pour l'auto-placement
  const emptyFusions = existingFusions.filter(g => !g.occupied);

  const all     = Object.entries(TABLE_DATA).map(([id,d])=>({id:+id,...d}));
  const ordered = [...all].sort((a,b) => (a.prio||99) - (b.prio||99));

  // Tri : grands groupes (besoin de fusion) EN PREMIER → réservent les combos avant les petits
  // puis PAX décroissant, enfin ancienneté de réservation
  const maxSingleHi = Math.max(...Object.values(TABLE_DATA).map(t => t.hi));
  resas.sort((a,b)=>{
    const aNeedsFusion = a.pax > maxSingleHi;
    const bNeedsFusion = b.pax > maxSingleHi;
    if(aNeedsFusion && !bNeedsFusion) return -1;
    if(!aNeedsFusion && bNeedsFusion) return 1;
    if(a.pax !== b.pax) return b.pax - a.pax;
    if(a.booked_at && b.booked_at){ const d=new Date(a.booked_at)-new Date(b.booked_at); if(d!==0) return d; }
    if(a.booked_at) return -1;
    if(b.booked_at) return 1;
    return 0;
  });

  let fusionsUsed = 0, fusionsCreated = 0;

  resas.forEach(r=>{
    // ── PRIORITÉ -1 : table demandée explicitement (stockée à l'import ou dans le commentaire)
    const requestedTable = r.requested_table_id || parseTableRequest(r.comment);
    if(requestedTable && !used.has(requestedTable) && TABLE_DATA[requestedTable] && TABLE_DATA[requestedTable].hi >= r.pax){
      r.placed = true; r.tableId = requestedTable; used.add(requestedTable);
      return;
    }

    // ── PRIORITÉ 0 : fusion sur mesure existante vide qui correspond au PAX
    const customFusion = emptyFusions.find(g => !g.occupied && g.totalHi >= r.pax);
    if(customFusion){
      r.placed=true; r.tableId=customFusion.tids[0];
      customFusion.occupied=true; // ne pas la réutiliser
      fusionsUsed++;
      return;
    }

    // ── PRIORITÉ 1 : table seule suffisante
    const single = ordered.find(t => !used.has(t.id) && t.hi >= r.pax);
    if(single){
      r.placed=true; r.tableId=single.id; used.add(single.id);
      return;
    }

    // ── PRIORITÉ 2 : fusion automatique (combos prédéfinies)
    const combo = findBestFusion(r.pax, used);
    if(combo){
      fused[tk()].push({id:'fg'+(fuseCounter++), tids:combo.tids});
      combo.tids.forEach(tid => used.add(tid));
      r.placed=true; r.tableId=combo.tids[0];
      fusionsCreated++;
      return;
    }

    // ── FALLBACK : table libre avec au moins autant de capacité que le PAX
    // On n'accepte JAMAIS de placer des gens sur une table trop petite
    const any = ordered.find(t => !used.has(t.id) && t.hi >= r.pax);
    if(any){ r.placed=true; r.tableId=any.id; used.add(any.id); return; }

    // Aucune solution → laisser non placée (mieux que de mettre sur une trop petite)
    console.warn('Autoplacement: impossible de placer', r.name, r.pax, 'PAX — aucune table/fusion disponible');
  });

  const nonPlaced = resas.filter(r=>!r.placed).length;
  const placed    = resas.length - nonPlaced;
  const parts = [`${placed} placée(s)`];
  if(fusionsUsed > 0)    parts.push(`${fusionsUsed} compo sur mesure`);
  if(fusionsCreated > 0) parts.push(`${fusionsCreated} fusion auto`);
  if(nonPlaced > 0)      parts.push(`⚠ ${nonPlaced} sans place`);
  toast('Auto-placement : ' + parts.join(' · '));
}

// Cherche un bloc horizontal libre de `needed` transats consécutifs dans une rangée
// findHorizontal : cherche needed slots contigus dans UN MÊME bloc g/m/d
// - preferCenter : priorité aux rangées centrales (200, 300)
// - avoidSingletons : optimiser pour ne pas laisser de trou d'1 slot
function findHorizontal(sm, needed, preferCenter, avoidSingletons, forceRow){
  if(needed < 1) return null;

  const rowOrder = forceRow
    ? TR_ROWS.filter(r => r.id === forceRow)
    : preferCenter
      ? [TR_ROWS[1], TR_ROWS[2], TR_ROWS[0], TR_ROWS[3], TR_ROWS[4]].filter(Boolean)
      : TR_ROWS;

  const candidates = [];

  for(const row of rowOrder){
    for(const blk of ['g','m','d']){
      const bSlots = trSlots(row.id)[blk];
      if(needed > bSlots.length) continue;
      for(let i = 0; i <= bSlots.length - needed; i++){
        let free = true;
        for(let j = 0; j < needed; j++){
          if(sm[bSlots[i+j]]){ free = false; break; }
        }
        if(!free) continue;

        let score = 0;
        if(avoidSingletons){
          // Analyser l'environnement : qu'est-ce qui reste à gauche et à droite ?
          // À gauche de i : bSlots[0..i-1], à droite : bSlots[i+needed..end-1]
          const leftFree = []; // indices libres à gauche
          const rightFree = []; // indices libres à droite
          for(let k = i-1; k >= 0; k--){
            if(sm[bSlots[k]]) break;
            leftFree.push(k);
          }
          for(let k = i+needed; k < bSlots.length; k++){
            if(sm[bSlots[k]]) break;
            rightFree.push(k);
          }
          const leftGap = leftFree.length; // nb slots libres contigus à gauche
          const rightGap = rightFree.length;

          // Bonus : collé à un slot occupé
          if(leftGap === 0) score += 3; // adjacent à une resa (ou au bord bloqué)
          if(rightGap === 0) score += 3;
          // Collé au bord du bloc (pas de voisin à placer)
          if(i === 0) score += 2;
          if(i + needed === bSlots.length) score += 2;

          // Malus critiques : créer un trou de taille 1 (impossible à combler avec un couple)
          if(leftGap === 1) score -= 10;
          if(rightGap === 1) score -= 10;
          // Trou de 3 = un quad ne rentre pas mais un 3 oui
          // Trou de 5, 7 = acceptable (groupe impair)
          // Préférer laisser des trous PAIRS (2, 4, 6, 8)
          if(leftGap % 2 === 1 && leftGap >= 3) score -= 2;
          if(rightGap % 2 === 1 && rightGap >= 3) score -= 2;
        }
        candidates.push({slots: bSlots.slice(i, i+needed), start: bSlots[i], blk, rowBase: row.id, score});
      }
    }
  }

  if(!candidates.length) return null;
  if(avoidSingletons) candidates.sort((a,b) => b.score - a.score);
  return candidates[0];
}

// ═══════════════════════════════════════════════════════
// findVertical : cherche un RECTANGLE libre dans un bloc g/m/d
// sur plusieurs rangées consécutives.
// Retourne un rectangle propre (mêmes colonnes dans chaque rangée)
// qui contient exactement `needed` slots occupés.
// ═══════════════════════════════════════════════════════
function findVertical(sm, needed){
  if(needed < 2) return null;
  const rowIds = TR_ROWS.map(r=>r.id);
  const blkKeys = ['g','m','d'];

  // Parcourir par PRIORITÉ : petit rectangle (2 rangées) puis plus grand
  for(let nRows=2; nRows<=rowIds.length; nRows++){
    const minWidth = Math.ceil(needed / nRows);

    for(const blk of blkKeys){
      const bSize = trSlots(200)[blk].length;
      if(minWidth > bSize) continue;

      // Essayer chaque rangée de départ
      for(let startRi=0; startRi<=rowIds.length-nRows; startRi++){
        const usedRows = rowIds.slice(startRi, startRi+nRows);

        // Essayer chaque largeur entre minWidth et min(bSize, needed)
        for(let width=minWidth; width<=Math.min(bSize, needed); width++){
          // Essayer chaque position de départ horizontale dans le bloc
          for(let startCol=0; startCol+width<=bSize; startCol++){
            // Vérifier disponibilité : toutes les (width × nRows) cellules libres ?
            const rectSlots = [];
            let allFree = true;
            for(let r=0; r<nRows && allFree; r++){
              const rowBase = usedRows[r];
              const rowBlk = trSlots(rowBase)[blk];
              for(let c=0; c<width; c++){
                const s = rowBlk[startCol+c];
                if(!s || sm[s]){ allFree=false; break; }
                rectSlots.push(s);
              }
            }

            if(allFree){
              // Rectangle entier disponible. On occupe `needed` slots, en ligne par ligne.
              const useSlots = rectSlots.slice(0, needed);

              // Répartition par rangée
              const byRow = {};
              useSlots.forEach(s=>{
                const rb = Math.floor(s/100)*100;
                if(!byRow[rb]) byRow[rb]=[];
                byRow[rb].push(s);
              });

              return {
                allSlots: useSlots,
                byRow: Object.entries(byRow).map(([rb,ss])=>({rowBase:+rb, slots:ss})),
                label: 'Rangées ' + Object.keys(byRow).join('+'),
                blk,
                rectWidth: width,
                rectNRows: nRows,
                startCol,
                startRi
              };
            }
          }
        }
      }
    }
  }
  return null;
}

// Place UNE resa selon sa taille
// Cette fonction est appelée par autoTransats qui gère l'ordre global
function placeTransat(r, sm, opts){
  opts = opts || {};
  const needed = r.tr || r.pax || 1;
  const forceRow = r.row_transats || null;

  // ─── Rangée forcée + extrémité (ex: "1ère ligne sur le côté") — priorité max ───
  if(forceRow && r.pref_extremite){
    const ext = findExtremity(sm, needed, forceRow);
    if(ext){
      r.placed = true; r.slot = ext.start; r.extraSlots = null;
      ext.slots.forEach(s => sm[s] = r);
      return true;
    }
    // Extrémité de la rangée forcée indispo → fall-through vers rangée forcée normale
  }

  // ─── Rangée forcée seule ───
  if(forceRow){
    const horiz = findHorizontal(sm, needed, false, false, forceRow);
    if(horiz){
      r.placed = true; r.slot = horiz.start; r.extraSlots = null;
      horiz.slots.forEach(s => sm[s] = r);
      return true;
    }
    // Rangée forcée pleine → placer autant que possible dans la rangée, sinon fallback normal
    for(let partial = needed - 1; partial >= 1; partial--){
      const h = findHorizontal(sm, partial, false, false, forceRow);
      if(h){
        r.placed = true; r.slot = h.start; r.extraSlots = null; r.tr = partial;
        h.slots.forEach(s => sm[s] = r);
        return true;
      }
    }
    // Rangée forcée vraiment pleine → fallback sans contrainte
  }

  // ─── Extrémité demandée (côté/bord/coin) ───
  if(r.pref_extremite){
    const result = findExtremity(sm, needed, forceRow || null);
    if(result){
      r.placed = true; r.slot = result.start; r.extraSlots = null;
      result.slots.forEach(s => sm[s] = r);
      return true;
    }
  }

  // ─── Grands groupes (≥ 7 PAX) : VERTICAL COMPACT OBLIGATOIRE ───
  if(needed >= 7){
    const vert = findCompactVertical(sm, needed, opts.avoidSingletons);
    if(vert){
      r.placed = true; r.slot = vert.allSlots[0];
      r.extraSlots = vert.allSlots; r.tr = vert.allSlots.length;
      vert.allSlots.forEach(s => sm[s] = r);
      return true;
    }
    const horiz = findHorizontal(sm, needed);
    if(horiz){
      r.placed = true; r.slot = horiz.start; r.extraSlots = null;
      horiz.slots.forEach(s => sm[s] = r);
      return true;
    }
    const vert2 = findVertical(sm, needed);
    if(vert2){
      r.placed = true; r.slot = vert2.allSlots[0];
      r.extraSlots = vert2.allSlots; r.tr = vert2.allSlots.length;
      vert2.allSlots.forEach(s => sm[s] = r);
      return true;
    }
    return false;
  }

  // ─── Moyens (4-6 PAX) : horizontal prioritaire ───
  if(needed >= 4){
    const horiz = findHorizontal(sm, needed, opts.preferCenter);
    if(horiz){
      r.placed = true; r.slot = horiz.start; r.extraSlots = null;
      horiz.slots.forEach(s => sm[s] = r);
      return true;
    }
    const vert = findVertical(sm, needed);
    if(vert){
      r.placed = true; r.slot = vert.allSlots[0];
      r.extraSlots = vert.allSlots; r.tr = vert.allSlots.length;
      vert.allSlots.forEach(s => sm[s] = r);
      return true;
    }
    return false;
  }

  // ─── Petits (≤ 3 PAX) : horizontal, éviter les singletons isolés ───
  const horiz = findHorizontal(sm, needed, false, opts.avoidSingletons);
  if(horiz){
    r.placed = true; r.slot = horiz.start; r.extraSlots = null;
    horiz.slots.forEach(s => sm[s] = r);
    return true;
  }
  return false;
}

// Cherche un rectangle COMPACT (le plus carré possible) pour un grand groupe
// Optimise : rectangle sans laisser de slots isolés sur les côtés
function findCompactVertical(sm, needed, avoidSingletons){
  if(needed < 2) return null;
  const rowIds = TR_ROWS.map(r=>r.id);
  const blkKeys = ['g','m','d'];

  // Pour chaque nRows, calculer la meilleure combinaison
  // Préférer 2 rangées (plus lisible horizontalement)
  const candidates = [];

  for(let nRows of [2, 3, 4, 5]){
    const width = Math.ceil(needed / nRows);
    if(nRows * width < needed) continue;
    if(width > 8) continue;

    for(const blk of blkKeys){
      const bSize = trSlots(200)[blk].length;
      if(width > bSize) continue;

      // Priorité rangées centrales
      const centerOrder = [1, 2, 0, 3, 4];

      for(const startRi of centerOrder){
        if(startRi + nRows > rowIds.length) continue;
        const usedRows = rowIds.slice(startRi, startRi + nRows);

        for(let startCol = 0; startCol + width <= bSize; startCol++){
          const rectSlots = [];
          let allFree = true;
          for(let r = 0; r < nRows && allFree; r++){
            const rowBlk = trSlots(usedRows[r])[blk];
            for(let c = 0; c < width; c++){
              const s = rowBlk[startCol + c];
              if(!s || sm[s]){ allFree = false; break; }
              rectSlots.push(s);
            }
          }

          if(allFree){
            // Score : préférence pour placement collé à un bord (gauche/droite)
            // ou collé à une resa existante (évite les trous isolés)
            let score = 0;
            // Bonus si on est contre un bord du bloc
            if(startCol === 0) score += 1;
            if(startCol + width === bSize) score += 1;
            // Bonus si voisin de gauche est occupé dans la rangée
            for(let r = 0; r < nRows; r++){
              const rowBlk = trSlots(usedRows[r])[blk];
              if(startCol > 0 && sm[rowBlk[startCol-1]]) score += 0.5;
              if(startCol+width < bSize && sm[rowBlk[startCol+width]]) score += 0.5;
            }
            // Malus : si on laisse 1 slot isolé à côté (gauche ou droite)
            if(startCol === 1 && !sm[trSlots(usedRows[0])[blk][0]]) score -= 2;
            if(startCol + width === bSize - 1 && !sm[trSlots(usedRows[0])[blk][bSize-1]]) score -= 2;

            // Priorité : moins de rangées = mieux
            score -= nRows * 0.1;

            candidates.push({
              allSlots: rectSlots.slice(0, needed),
              blk, width, nRows, startCol, startRi, score
            });
          }
        }
      }
    }
  }

  if(!candidates.length) return null;
  candidates.sort((a,b) => b.score - a.score);
  return candidates[0];
}

function autoTransats(resas, skipped=0){
  const sm = buildSlotMap();

  // ─── Pré-traitement : lire les commentaires pour déduire bed / extrémité ───
  // (backup pour resas manuelles — les resas Zenchef sont déjà traitées par zcToResa)
  resas.forEach(r => {
    const raw = (r.comment || '').toLowerCase();
    const t = raw.replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[îï]/g,'i').replace(/[ôö]/g,'o');
    if(!r.bed && /\b(bed\s*double|double\s*bed|lit\s*double|cabane)\b/.test(raw)) r.bed = true;
    if(!r.pref_extremite){
      const hasCote = /\bcote\b/.test(t) && !/cote\s*(?:du\s*)?(?:resto|restaurant)\b/.test(t);
      if(hasCote || /\b(extremit[e]?|extreme|lateral[e]?)\b/.test(t) || /\b(au\s*bout|en\s*bout)\b/.test(t) || /\bon\s*the\s*side\b/.test(raw)){
        r.pref_extremite = true;
      }
    }
  });

  // ─── Phase 0 : BEDS — placer exclusivement sur BED_SLOTS (lit double = 2 PAX max) ───
  // Les BED_SLOTS ne peuvent accueillir qu'UNE resa bed chacun.
  // Les transats ordinaires ne doivent JAMAIS atterrir sur ces slots.
  const bedResas     = resas.filter(r => r.bed);
  const transatResas = resas.filter(r => !r.bed);

  let bedPlaced = 0, bedFailed = 0;
  bedResas.sort((a,b) => {
    if(a.booked_at && b.booked_at) return new Date(a.booked_at) - new Date(b.booked_at);
    return 0;
  });
  bedResas.forEach(r => {
    const freeSlot = BED_SLOTS.find(s => !sm[s]);
    if(freeSlot !== undefined){
      r.placed = true; r.slot = freeSlot;
      sm[freeSlot] = r;
      bedPlaced++;
    } else {
      bedFailed++;
    }
  });

  // Bloquer les BED_SLOTS encore libres — les transats normaux ne peuvent pas les utiliser
  const blockedBeds = BED_SLOTS.filter(s => !sm[s]);
  blockedBeds.forEach(s => { sm[s] = true; }); // sentinel occupé

  // ─── Phases 1-3 : transats ordinaires ───
  // STRATÉGIE D'OPTIMISATION GLOBALE EN 3 PHASES :
  // Phase 1 : GROS GROUPES (≥ 7 PAX) → rectangle compact au centre
  // Phase 2 : MOYENS (4-6 PAX) → horizontal prioritaire, préférer les rangées centrales
  // Phase 3 : PETITS (≤ 3 PAX) → comblent les trous, évitent de laisser des singletons isolés
  // PRINCIPE CLÉ : un transat seul isolé = mauvaise optimisation.

  const grands = transatResas.filter(r => (r.tr||r.pax||1) >= 7);
  const moyens = transatResas.filter(r => { const n=r.tr||r.pax||1; return n>=4 && n<=6; });
  const petits = transatResas.filter(r => (r.tr||r.pax||1) <= 3);

  function sortByPriority(arr){
    arr.sort((a,b) => {
      const sizeA = a.tr||a.pax||1, sizeB = b.tr||b.pax||1;
      if(sizeA !== sizeB) return sizeB - sizeA;
      if(a.booked_at && b.booked_at) return new Date(a.booked_at) - new Date(b.booked_at);
      if(a.booked_at) return -1;
      if(b.booked_at) return 1;
      return 0;
    });
  }
  sortByPriority(grands); sortByPriority(moyens); sortByPriority(petits);

  let placed = 0, failed = 0;
  const failedList = [];

  // Phase 1 : GROS (rectangle compact central)
  grands.forEach(r => {
    if(placeTransat(r, sm, {avoidSingletons:true})) placed++;
    else { failed++; failedList.push(r); }
  });

  // Phase 2 : MOYENS (horizontal prioritaire, préférer le centre)
  moyens.forEach(r => {
    if(placeTransat(r, sm, {preferCenter:true, avoidSingletons:true})) placed++;
    else { failed++; failedList.push(r); }
  });

  // Phase 3 : PETITS (remplissage intelligent)
  // Trier par taille décroissante : d'abord 3, puis 2, puis 1
  petits.sort((a,b) => {
    const sizeA = a.tr||a.pax||1, sizeB = b.tr||b.pax||1;
    if(sizeA !== sizeB) return sizeB - sizeA;
    if(a.booked_at && b.booked_at) return new Date(a.booked_at) - new Date(b.booked_at);
    return 0;
  });

  petits.forEach(r => {
    if(placeTransat(r, sm, {avoidSingletons:true})) placed++;
    else { failed++; failedList.push(r); }
  });

  // Libérer les sentinelles BED_SLOTS
  blockedBeds.forEach(s => { delete sm[s]; });

  // Phase 4 (optimisation finale) : détecter les singletons isolés et proposer une réorganisation
  // Pour l'instant on se contente du tri intelligent ci-dessus
  
  // Message toast
  const skipPart = skipped > 0 ? ` · ${skipped} en attente ignorée(s)` : '';
  if(failed > 0){
    const names = failedList.map(r => r.name).slice(0, 3).join(', ');
    toast(placed + ' placés · ' + failed + ' sans place (' + names + (failedList.length>3?'…':'') + ')' + skipPart);
  } else if(placed > 0){
    const singletons = countIsolatedSingletons(sm);
    if(singletons > 0){
      toast(placed + ' transats placés ✓ · ' + singletons + ' slot(s) isolé(s)' + skipPart);
    } else {
      toast(placed + ' transats placés ✓ · plan optimisé' + skipPart);
    }
  }
}

// Compte les slots vides "isolés" (libres mais entourés à gauche et à droite par des occupés)
function countIsolatedSingletons(sm){
  let count = 0;
  TR_ROWS.forEach(row => {
    ['g','m','d'].forEach(blk => {
      const slots = trSlots(row.id)[blk];
      for(let i = 1; i < slots.length - 1; i++){
        if(!sm[slots[i]] && sm[slots[i-1]] && sm[slots[i+1]]){
          count++;
        }
      }
    });
  });
  return count;
}

// Modal de choix horizontal/vertical pour grands groupes
function showTransatChoiceModal(choices, sm, petits){
  // Créer le modal
  let existing = document.getElementById('tr-choice-modal');
  if(existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'tr-choice-modal';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:250;display:flex;align-items:center;justify-content:center;padding:20px';

  const box = document.createElement('div');
  box.style.cssText='background:var(--card);border-radius:var(--r-xl);padding:24px;width:100%;max-width:420px;box-shadow:var(--shadow-md)';

  let idx = 0;

  function showChoice(){
    if(idx >= choices.length){
      // Tous les choix faits → placer les petits
      overlay.remove();
      petits.forEach(r=>{
        const needed=r.tr||r.pax||1; let placed=false;
        for(const row of TR_ROWS){
          if(placed) break;
          const all=[...trSlots(row.id).g,...trSlots(row.id).m,...trSlots(row.id).d];
          for(let i=0;i<=all.length-needed;i++){
            let free=true;
            for(let j=0;j<needed;j++){if(sm[all[i+j]]){free=false;break;}}
            if(free){r.placed=true;r.slot=all[i];for(let j=0;j<needed;j++)sm[all[i+j]]=r;placed=true;break;}
          }
        }
      });
      render();
      toast('Auto-placement transats terminé ✓');
      return;
    }

    const {r, horiz, vert, needed} = choices[idx];
    box.innerHTML = `
      <div style="font-size:16px;font-weight:800;margin-bottom:4px">Placement · ${r.name}</div>
      <div style="font-size:12px;color:var(--t3);margin-bottom:16px">${needed} transats · ${r.pax} PAX</div>
      <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Choisir la disposition</div>
      <div style="display:flex;gap:10px;margin-bottom:16px">
        <div id="choice-h" style="flex:1;border:1.5px solid var(--sep2);border-radius:var(--r);padding:12px;cursor:pointer;text-align:center;transition:all .13s">
          <div style="font-size:20px;margin-bottom:6px">↔</div>
          <div style="font-size:12px;font-weight:700">Horizontal</div>
          <div style="font-size:10px;color:var(--t3);margin-top:2px">Rangée ${Math.floor(horiz.start/100)*100}<br>${horiz.slots.join(', ')}</div>
        </div>
        <div id="choice-v" style="flex:1;border:1.5px solid var(--sep2);border-radius:var(--r);padding:12px;cursor:pointer;text-align:center;transition:all .13s">
          <div style="font-size:20px;margin-bottom:6px">↕</div>
          <div style="font-size:12px;font-weight:700">Vertical</div>
          <div style="font-size:10px;color:var(--t3);margin-top:2px">${vert.label}<br>${vert.byRow.map(r=>r.rowBase+': '+r.slots.join(',')).join(' | ')}</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--t4);text-align:center">${idx+1} / ${choices.length}</div>
    `;

    document.getElementById('choice-h').addEventListener('click',()=>{
      document.getElementById('choice-h').style.cssText+='border-color:var(--bbd);background:var(--bbg)';
      r.placed=true; r.slot=horiz.start;
      horiz.slots.forEach(s=>sm[s]=r);
      idx++; setTimeout(showChoice, 200);
    });
    document.getElementById('choice-v').addEventListener('click',()=>{
      document.getElementById('choice-v').style.cssText+='border-color:var(--bbd);background:var(--bbg)';
      r.placed=true; r.slot=vert.slotsA[0];
      [...vert.slotsA,...vert.slotsB].forEach(s=>sm[s]=r);
      idx++; setTimeout(showChoice, 200);
    });
  }

  overlay.appendChild(box);
  document.body.appendChild(overlay);
  showChoice();
}

function clearAll(){
  saveUndo();
  gr().forEach(r=>{r.placed=false;r.tableId=null;r.slot=null;});
  fused[tk()]=[];selectedId=null;render();
  toast('Toutes les tables libérées');
}

