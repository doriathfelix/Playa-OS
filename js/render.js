// ── Filtre sidebar : 'all' | 'placed' | 'unplaced'
let placementFilter = 'all';
function setPlacementFilter(f){
  placementFilter = f;
  document.querySelectorAll('.pf-btn').forEach(b => {
    b.classList.toggle('pf-active', b.dataset.filter === f);
  });
  renderSidebar();
}

// RENDER MAIN
// ══════════════════════════════════════════
function render(){
  renderSidebar();
  renderStats();
  document.getElementById('persist-section').style.display = currentTab===2 ? 'block' : 'none';
  if(rushMode) renderRushOverlay();
  else currentTab===2 ? renderTransats() : renderTables();
}

// ── Détecte les alertes importantes dans les commentaires/tags d'une résa
function detectAlerts(r){
  const alerts = [];
  const raw = (r.comment||'').toLowerCase();
  const t = raw.replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[îï]/g,'i').replace(/[ôö]/g,'o');
  const tags = (r.tags||[]).join(' ').toLowerCase();
  const all = t + ' ' + tags;
  if(/\b(allergi[e]?|allerg[y]?|intoleran|sans\s*gluten|gluten.?free|lactose|noix|arachide|peanut|celiac|celiaque|nuts?)\b/.test(all))
    alerts.push({icon:'⚠️', label:'Allergie', bg:'#FEF3C7', bd:'#FDE68A', col:'#92400E'});
  if(/\b(anniversaire|birthday|fete\b|mariage|fiancailles|lune\s*de\s*miel|evjf|evg|pedida|proposal|noces|celebration)\b/.test(all))
    alerts.push({icon:'🎂', label:'Occasion', bg:'#FFF1F2', bd:'#FECDD3', col:'#BE123C'});
  if(/\b(pmr|fauteuil\s*roulant|wheelchair|handicap|mobilite\s*reduite|personne\s*a\s*mobilite)\b/.test(all))
    alerts.push({icon:'♿', label:'PMR', bg:'#EFF6FF', bd:'#BFDBFE', col:'#1D4ED8'});
  if(/\b(vegetari[e]?n|vegan|vegetal|halal|casher|kosher|sans\s*viande|no\s*meat|pescetarien)\b/.test(all))
    alerts.push({icon:'🍃', label:'Régime', bg:'#F0FDF4', bd:'#BBF7D0', col:'#15803D'});
  if(/\b(chaise\s*haute|bebe|nourisson|poussette|highchair|baby|nourrisson)\b/.test(all))
    alerts.push({icon:'👶', label:'Bébé', bg:'#FDF4FF', bd:'#F0ABFC', col:'#7E22CE'});
  // Tags Zenchef bruts : tous ceux non déjà couverts par une alerte ci-dessus
  const coveredRe = /allergi|intoleran|gluten|lactose|noix|arachide|peanut|celiac|nuts|anniversaire|birthday|fiancailles|mariage|evjf|evg|pedida|noces|proposal|celebration|pmr|wheelchair|handicap|mobilite|fauteuil|vegetar|vegan|vegetal|halal|casher|kosher|viande|pescet|highchair|nourrisson|poussette/i;
  (r.tags||[]).forEach(tag => {
    if(tag && !coveredRe.test(tag))
      alerts.push({icon:'🏷', label:tag, bg:'#EEF2FF', bd:'#C7D2FE', col:'#3730A3'});
  });
  return alerts;
}

// ── SIDEBAR
function renderSidebar(){
  const q = (document.getElementById('search-input').value||'').toLowerCase().trim();
  const list = document.getElementById('resa-list');
  list.innerHTML='';
  const rows = sortByBookedAt(gr()).filter(r => {
    if(q && !r.name.toLowerCase().includes(q)
         && !(r.phone||'').replace(/\s/g,'').includes(q.replace(/\s/g,''))
         && !(r.comment||'').toLowerCase().includes(q)) return false;
    if(placementFilter === 'placed')   return r.placed && !r.ns;
    if(placementFilter === 'unplaced') return !r.placed && !r.ns;
    return true;
  });
  if(!rows.length){ list.innerHTML='<div style="padding:16px;text-align:center;color:var(--t4);font-size:12px;font-weight:600">Aucune réservation</div>'; return; }
  rows.forEach(r => {
    const d = document.createElement('div');
    let cls = 'rc';
    if(r.ns) cls+=' rc-ns';
    else if(r.id===selectedId) cls+=' rc-sel';
    else if(fuseMode&&fuseTargets.includes(r.id)) cls+=' rc-fuse';
    else if(r.urgent) cls+=' rc-urgent';
    else if(r.placed) cls+=' rc-placed';
    if(!r.ns && !fuseMode){
      if(r.repas_transat || r.svc==='transats') cls+=' svc-rt';
      else if(r.svc==='s1') cls+=' svc-s1';
      else if(r.svc==='s2') cls+=' svc-s2';
      else if(r.svc==='soir'||r.svc==='soir2') cls+=' svc-soir';
    }
    d.className=cls; d.draggable=!r.ns; d.dataset.id=r.id;
    const ptag = r.placed
      ? (currentTab===2
          ? (r.slot >= 1000
              ? `<div class="rc-tr-tag"><span class="transat-ico-sm"></span> Transat extra</div>`
              : `<div class="rc-tr-tag"><span class="transat-ico-sm"></span> Transats ${r.slot}–${r.slot+(r.tr||1)-1}</div>`)
          : `<div class="rc-placed-tag" style="color:${r.svc==='s1'?'var(--s1t)':r.svc==='s2'?'var(--s2t)':'var(--sot)'}">→ T${r.tableId}</div>`)
      : '';
    const isRT = r.svc==='transats' || r.repas_transat;
    const svcLabel = r.svc==='s1'?'S1':r.svc==='s2'?'S2':r.svc==='soir'?'Soir':r.svc==='soir2'?'Soir2':isRT?'RT':'—';
    const svcCssKey = isRT?'rt':r.svc==='s1'?'s1':r.svc==='s2'?'s2':(r.svc==='soir'||r.svc==='soir2')?'soir':'s1';
    const svcTag = `<span class="rc-svc-badge rc-svc-${svcCssKey}">${svcLabel}</span>`;
    // Tag transats : affiché sur toutes les resas qui ont des transats
    const trBadge = (r.tr && r.tr > 0)
      ? (r.repas_transat
          ? `<span class="rc-repas-tag">⛱ Repas transat · ${r.tr} transat${r.tr>1?'s':''}</span>`
          : `<span class="rc-repas-tag" style="background:var(--s1bg);border-color:var(--s1bd);color:var(--s1t)">🍽 + ⛱ ${r.tr} transat${r.tr>1?'s':''}</span>`)
      : '';
    const repasTag = trBadge;
    const waitBadge = '';  // retiré - "waiting" Zenchef = normal avant arrivée
    const srcBadge = r.source==='zenchef'
      ? `<span style="font-size:8px;font-weight:800;padding:1px 5px;border-radius:20px;background:#F0F4FF;border:0.5px solid #C0CFFF;color:#3355CC;margin-left:4px;flex-shrink:0">ZC</span>`
      : r.source==='phone'
        ? `<span style="font-size:8px;font-weight:800;padding:1px 5px;border-radius:20px;background:var(--bg);border:0.5px solid var(--sep2);color:var(--t3);margin-left:4px;flex-shrink:0">TEL</span>`
        : '';
    // Badge transats : chiffre + logo parasol
    const trBadgeInline = (r.tr && r.tr > 0)
      ? `<span style="display:inline-flex;align-items:center;gap:2px;font-size:11px;font-weight:800;padding:2px 7px;border-radius:20px;background:var(--rtbg);border:0.5px solid var(--rtbd);color:var(--rtt);flex-shrink:0">${r.tr}⛱</span>`
      : '';

    // Alertes demandes spéciales (allergie, occasion, PMR…)
    const alerts = detectAlerts(r);
    const alertLine = alerts.length
      ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:4px">${alerts.map(a=>`<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:20px;background:${a.bg};border:0.5px solid ${a.bd};color:${a.col}">${a.icon} ${a.label}</span>`).join('')}</div>`
      : '';

    // Commentaire : fond teinté, texte foncé, 3 lignes max — tout ce qui vient de Zenchef
    const commentLine = r.comment
      ? `<div class="rc-sub" style="margin-top:5px;font-size:11px;font-weight:500;color:var(--t1);background:rgba(37,99,235,0.06);border-left:2px solid rgba(37,99,235,0.25);border-radius:0 5px 5px 0;padding:4px 7px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;line-height:1.5">💬 ${r.comment}</div>`
      : '';

    // Badge en attente
    const attBadge = r.waiting
      ? `<span class="rc-att-badge">⏳ En attente</span>`
      : '';

    // Placement
    const placedLine = r.placed
      ? (currentTab===2
          ? (r.slot >= 1000
              ? `<div style="font-size:10px;font-weight:700;color:var(--rtt);margin-top:2px">⛱ Transat extra</div>`
              : `<div style="font-size:10px;font-weight:700;color:var(--rtt);margin-top:2px">⛱ ${r.slot}–${r.slot+(r.tr||1)-1}</div>`)
          : `<div style="font-size:10px;font-weight:700;color:var(--s1t);margin-top:2px">→ T${r.tableId}</div>`)
      : '';

    // Badge transats + badges préférences placement
    const is1ereLigne = r.row_transats === 500;
    const rowLabels = {500:'L1',400:'L2',300:'L3',200:'L4',100:'L5'};
    const trBottomRight = (r.tr && r.tr > 0)
      ? `<span style="font-size:11px;font-weight:800;padding:2px 7px;border-radius:20px;background:${is1ereLigne?'#FFEAEA':'var(--rtbg)'};border:0.5px solid ${is1ereLigne?'#FF5555':'var(--rtbd)'};color:${is1ereLigne?'#CC0000':'var(--rtt)'}">${r.tr}⛱</span>`
      : '';
    const extBadge = r.pref_extremite
      ? `<span style="font-size:9px;font-weight:800;padding:1px 5px;border-radius:20px;background:var(--gdbg);border:0.5px solid var(--gdb);color:var(--gdt)">⟺ côté</span>`
      : '';

    d.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:6px">
        <div style="flex:1;min-width:0;padding-right:75px">
          <div class="rc-name">${r.urgent?'<span class="urgent-dot"></span>':''}${r.name}</div>
          ${!r.repas_transat?`<div style="font-size:11px;font-weight:600;color:var(--t2);margin-top:3px">${r.time}</div>`:''}
          ${attBadge}
          ${alertLine}
          ${commentLine}
          ${placedLine}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0">
          <div style="display:flex;align-items:center;gap:4px">
            ${svcTag}
            <div class="rc-pax">${r.pax} PAX</div>
          </div>
          ${trBottomRight}
          ${extBadge}
        </div>
      </div>
    `;
    d.addEventListener('dragstart',e=>{dragId=r.id;e.dataTransfer.effectAllowed='move'});
    d.addEventListener('dragend',()=>dragId=null);
    d.addEventListener('click',()=>showDetail(r.id));

    // Long-press tablette → fiche rapide (actions)
    let _lpTimer=null;
    const _lpStart=()=>{ _lpTimer=setTimeout(()=>{ _lpTimer=null; showResaActionSheet(r); },900); };
    const _lpCancel=()=>{ if(_lpTimer){clearTimeout(_lpTimer);_lpTimer=null;} };
    d.addEventListener('touchstart',_lpStart,{passive:true});
    d.addEventListener('touchend',_lpCancel,{passive:true});
    d.addEventListener('touchmove',_lpCancel,{passive:true});

    list.appendChild(d);
  });
}

// ── STATS
function renderStats(){
  // ── Comptage correct : on ne compte PAS les sous-resas _tr dans les totaux service
  // Les sous-resas ont zenchef_id se terminant par '_tr' — elles existent uniquement pour le
  // placement transats, pas pour compter des personnes supplémentaires.
  const isSubResa = r => r.zenchef_id && (String(r.zenchef_id).endsWith('_tr') || String(r.zenchef_id).endsWith('_bed'));

  // PAX par service : uniquement depuis les tableaux s1/s2/soir (pas transats)
  // + exclusion no-show
  const paxS1    = reservations.s1.filter(x=>!x.ns&&!isSubResa(x)).reduce((s,x)=>s+x.pax,0);
  const paxS2    = reservations.s2.filter(x=>!x.ns&&!isSubResa(x)).reduce((s,x)=>s+x.pax,0);
  const paxSoir  = reservations.soir.filter(x=>!x.ns&&!isSubResa(x)).reduce((s,x)=>s+x.pax,0);
  const paxSoir2 = (reservations.soir2||[]).filter(x=>!x.ns&&!isSubResa(x)).reduce((s,x)=>s+x.pax,0);

  // RT = repas transats purs (resa dans transats[] avec repas_transat=true)
  const paxRT = reservations.transats.filter(x=>x.repas_transat&&!x.ns).reduce((s,x)=>s+x.pax,0);

  // Total transats : somme des tr sur les resas table (pas sous-resas pour éviter doublon)
  // + tr des repas transats purs
  const trFromTables = [...reservations.s1,...reservations.s2,...reservations.soir,...(reservations.soir2||[])]
    .filter(x=>!x.ns && x.tr>0 && !isSubResa(x)).reduce((s,x)=>s+(x.tr||0),0);
  const trFromRT = reservations.transats
    .filter(x=>x.repas_transat&&!x.ns).reduce((s,x)=>s+(x.tr||x.pax||0),0);
  const trTotal = trFromTables + trFromRT;
  // Beds (lits doubles) — chaque lit = 2 transats dans le total
  const trBeds = reservations.transats
    .filter(x=>x.bed&&!x.ns&&isSubResa(x)).reduce((s,x)=>s+(x.tr||1),0);
  // Grand total transats journée : transats normaux + beds×2
  const trGrandTotal = trTotal + trBeds * 2;

  // 1ère ligne mer : row_transats===500 + beds row 500 × 2
  const trMer =
    [...reservations.s1,...reservations.s2,...reservations.soir,...(reservations.soir2||[])]
      .filter(x=>!x.ns && x.tr>0 && !isSubResa(x) && x.row_transats===500)
      .reduce((s,x)=>s+(x.tr||0),0)
    +
    reservations.transats
      .filter(x=>x.repas_transat && !x.ns && x.row_transats===500)
      .reduce((s,x)=>s+(x.tr||x.pax||0),0)
    +
    reservations.transats
      .filter(x=>x.bed&&!x.ns&&isSubResa(x)&&x.row_transats===500)
      .reduce((s,x)=>s+(x.tr||1)*2,0);

  // Nb de resas par service (pour info dans le badge)
  const nS1   = reservations.s1.filter(x=>!x.ns&&!isSubResa(x)).length;
  const nS2   = reservations.s2.filter(x=>!x.ns&&!isSubResa(x)).length;
  const nSoir = reservations.soir.filter(x=>!x.ns&&!isSubResa(x)).length;
  const nRT   = reservations.transats.filter(x=>x.repas_transat&&!x.ns).length;

  const nav = (tab) => `goModule('service');switchTab(${tab})`;

  document.getElementById('stats-bar').innerHTML=`
    <div class="pax-circle pax-s1" onclick="${nav(0)}" style="cursor:pointer" title="Voir S1 · ${nS1} table${nS1>1?'s':''}">
      <div class="pax-c-label">S1</div><div class="pax-c-val">${paxS1}</div>
    </div>
    <div class="pax-circle pax-s2" onclick="${nav(1)}" style="cursor:pointer" title="Voir S2 · ${nS2} table${nS2>1?'s':''}">
      <div class="pax-c-label">S2</div><div class="pax-c-val">${paxS2}</div>
    </div>
    <div class="pax-circle pax-rt" onclick="${nav(2)}" style="cursor:pointer" title="Voir Repas Transats · ${nRT} resa${nRT>1?'s':''}">
      <div class="pax-c-label">RT</div><div class="pax-c-val">${paxRT||0}</div>
    </div>
    <div class="pax-circle pax-soir" onclick="${nav(3)}" style="cursor:pointer" title="Voir Soir · ${nSoir} table${nSoir>1?'s':''}">
      <div class="pax-c-label">Soir</div><div class="pax-c-val">${paxSoir}</div>
    </div>
    ${paxSoir2>0?`<div class="pax-circle pax-soir" onclick="${nav(4)}" style="cursor:pointer" title="Voir Soir 2"><div class="pax-c-label">Soir2</div><div class="pax-c-val">${paxSoir2}</div></div>`:''}
    <span class="stat-pill pill-blue" onclick="${nav(2)}" style="margin-left:4px;cursor:pointer" title="Total transats journée (beds = 2 transats chacun)">
      <span class="transat-ico"></span> ${trGrandTotal}
    </span>
    ${trMer>0?`<span class="stat-pill pill-red" onclick="${nav(2)}" style="margin-left:4px;cursor:pointer" title="Transats 1ère ligne mer">🌊 ${trMer}</span>`:''}
    ${trBeds>0?`<span class="stat-pill" onclick="${nav(2)}" style="margin-left:4px;cursor:pointer;background:var(--gdbg);border-color:var(--gdb);color:var(--gdt)" title="${trBeds} lit${trBeds>1?'s':''} double${trBeds>1?'s':''}">🛏 ${trBeds}</span>`:''}
  `;
}

// ══════════════════════════════════════════
// MODE DÉPLACEMENT TABLES
// ══════════════════════════════════════════
let moveMode = false;
let moveDragId = null; // id de TABLE (pas de resa)

// Positions custom : {tableId: {zone, row, col}} — on stocke l'ordre dans chaque zone
// Approche simple : on swape les IDs dans le layout
let tableOrder = loadTableOrder();

function loadTableOrder(){
  try{ const d=localStorage.getItem('playa_table_order'); return d?JSON.parse(d):null; }
  catch(e){ return null; }
}
function saveTableOrder(){
  try{ localStorage.setItem('playa_table_order', JSON.stringify(tableOrder)); }
  catch(e){}
}
function resetTableOrder(){
  tableOrder=null;
  localStorage.removeItem('playa_table_order');
  localStorage.removeItem('playa_table_pos');
  toast('Plan de salle réinitialisé');
  render();
}

// Positions libres des tables en mode déplacement
let tablePositions = loadTablePositions();
function loadTablePositions(){
  try{ const d=localStorage.getItem('playa_table_pos'); return d?JSON.parse(d):{}; }
  catch(e){ return {}; }
}
function saveTablePositions(){
  try{ localStorage.setItem('playa_table_pos',JSON.stringify(tablePositions)); }
  catch(e){}
}

function toggleMoveMode(){
  if(!moveMode){
    openPlanEditor();
  }
}

function openPlanEditor(){
  let ov = document.getElementById('plan-editor-overlay');
  if(ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'plan-editor-overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:500;background:#ECEEF2;display:flex;flex-direction:column;overflow:hidden';

  // ── Header
  const hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--card);border-bottom:0.5px solid var(--sep);flex-shrink:0;box-shadow:0 1px 6px rgba(0,0,0,.07);flex-wrap:wrap';
  hdr.innerHTML = `
    <div style="font-size:15px;font-weight:800;color:var(--t1);margin-right:4px">✥ Plan de salle</div>
    <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t3);flex:1;min-width:160px">
      <span style="display:inline-flex;align-items:center;gap:3px"><span style="display:inline-block;width:14px;height:2px;background:#007AFF;border-radius:1px"></span>vertical</span>
      <span style="display:inline-flex;align-items:center;gap:3px"><span style="display:inline-block;width:14px;height:2px;background:#FF3B30;border-radius:1px"></span>horizontal</span>
    </div>
    <button id="plan-snap-btn" style="padding:6px 11px;border-radius:8px;border:1px solid #007AFF;background:#EAF3FF;font-size:11px;font-weight:700;cursor:pointer;color:#007AFF;font-family:inherit">⊞ Magnétisme</button>
    <button id="plan-grid-btn" style="padding:6px 11px;border-radius:8px;border:1px solid var(--sep2);background:var(--bg);font-size:11px;font-weight:700;cursor:pointer;color:var(--t2);font-family:inherit">▦ Grille</button>
    <button id="plan-reset-btn" style="padding:6px 11px;border-radius:8px;border:0.5px solid var(--sep2);background:var(--bg);font-size:11px;font-weight:700;cursor:pointer;color:var(--rt);font-family:inherit">↺ Reset</button>
    <button id="plan-save-btn" style="padding:7px 16px;border-radius:8px;border:none;background:var(--blue);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">✓ Sauvegarder</button>
    <button id="plan-close-btn" style="padding:6px 13px;border-radius:8px;border:0.5px solid var(--sep2);background:var(--bg);font-size:13px;font-weight:700;cursor:pointer;color:var(--t3);font-family:inherit;margin-left:auto" title="Fermer sans sauvegarder">✕</button>
  `;
  ov.appendChild(hdr);

  // ── Zone scrollable contenant le canvas
  const scrollArea = document.createElement('div');
  scrollArea.style.cssText = 'flex:1;overflow:auto;position:relative;padding:16px';

  const canvas = document.createElement('div');
  canvas.id = 'plan-editor-canvas';
  canvas.style.cssText = 'position:relative;overflow:visible;background:#ECEEF2;border-radius:16px';
  // Grille de points par défaut
  canvas.style.backgroundImage = 'radial-gradient(circle,rgba(60,60,67,.2) 1.2px,transparent 1.2px)';
  canvas.style.backgroundSize = '20px 20px';

  scrollArea.appendChild(canvas);
  ov.appendChild(scrollArea);
  document.body.appendChild(ov);

  // Init positions
  const defaults = getEditorDefaultPositions();
  Object.keys(TABLE_DATA).map(Number).forEach(id=>{
    if(!tablePositions[id]) tablePositions[id] = defaults[id] || {x:20,y:20};
  });

  // ── État des options
  let snapEnabled = true;
  let gridMode = 'dots'; // 'dots' | 'lines' | 'none'

  function applyGrid(){
    if(gridMode === 'lines'){
      canvas.style.backgroundImage = [
        'linear-gradient(rgba(60,60,67,.1) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(60,60,67,.1) 1px, transparent 1px)',
        'linear-gradient(rgba(60,60,67,.18) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(60,60,67,.18) 1px, transparent 1px)'
      ].join(',');
      canvas.style.backgroundSize = '20px 20px, 20px 20px, 80px 80px, 80px 80px';
      document.getElementById('plan-grid-btn').style.borderColor = '#007AFF';
      document.getElementById('plan-grid-btn').style.color = '#007AFF';
      document.getElementById('plan-grid-btn').style.background = '#EAF3FF';
      document.getElementById('plan-grid-btn').textContent = '▦ Lignes';
    } else if(gridMode === 'dots'){
      canvas.style.backgroundImage = 'radial-gradient(circle,rgba(60,60,67,.2) 1.2px,transparent 1.2px)';
      canvas.style.backgroundSize = '20px 20px';
      document.getElementById('plan-grid-btn').style.borderColor = 'var(--sep2)';
      document.getElementById('plan-grid-btn').style.color = 'var(--t2)';
      document.getElementById('plan-grid-btn').style.background = 'var(--bg)';
      document.getElementById('plan-grid-btn').textContent = '▦ Grille';
    } else {
      canvas.style.backgroundImage = 'none';
      document.getElementById('plan-grid-btn').style.borderColor = 'var(--sep2)';
      document.getElementById('plan-grid-btn').style.color = 'var(--t4)';
      document.getElementById('plan-grid-btn').style.background = 'var(--bg)';
      document.getElementById('plan-grid-btn').textContent = '▦ Grille';
    }
  }

  document.getElementById('plan-snap-btn').addEventListener('click', function(){
    snapEnabled = !snapEnabled;
    this.style.background = snapEnabled ? '#EAF3FF' : 'var(--bg)';
    this.style.borderColor = snapEnabled ? '#007AFF' : 'var(--sep2)';
    this.style.color = snapEnabled ? '#007AFF' : 'var(--t3)';
    this.textContent = snapEnabled ? '⊞ Magnétisme' : '⊟ Magnétisme';
  });

  document.getElementById('plan-grid-btn').addEventListener('click', ()=>{
    gridMode = gridMode==='dots' ? 'lines' : gridMode==='lines' ? 'none' : 'dots';
    applyGrid();
  });

  renderEditorTables(canvas, ()=>snapEnabled);

  const closePlanEditor = () => {
    ov.remove();
    moveMode=false;
    const moveBtn=document.getElementById('move-btn');
    if(moveBtn){ moveBtn.className='tbtn'; moveBtn.textContent='✥ Déplacer'; }
    const moveBanner=document.getElementById('move-banner');
    if(moveBanner) moveBanner.classList.remove('on');
  };

  document.getElementById('plan-save-btn').onclick = ()=>{
    saveTablePositions();
    closePlanEditor();
    render();
    toast('Plan de salle sauvegardé ✓');
  };

  document.getElementById('plan-close-btn').onclick = ()=>{ closePlanEditor(); };

  const planEscHandler = (e)=>{ if(e.key==='Escape'){ closePlanEditor(); document.removeEventListener('keydown',planEscHandler); } };
  document.addEventListener('keydown', planEscHandler);

  document.getElementById('plan-reset-btn').onclick = ()=>{
    if(!confirm('Réinitialiser le plan de salle par défaut ?')) return;
    tablePositions = {};
    const defs = getEditorDefaultPositions();
    Object.keys(TABLE_DATA).map(Number).forEach(id=>{ tablePositions[id] = defs[id] || {x:20,y:20}; });
    saveTablePositions();
    renderEditorTables(canvas, ()=>snapEnabled);
    toast('Plan réinitialisé');
  };
}

function renderEditorTables(canvas, getSnapEnabled){
  canvas.innerHTML = '';
  const SNAP_GRID    = 20;   // grille de base = espacement des points/lignes
  const ALIGN_SNAP   = 16;   // seuil magnétisme alignement — augmenté pour faciliter l'usage

  const tMap = {};
  Object.values(reservations).flat().forEach(r=>{ if(r.placed&&r.tableId) tMap[r.tableId]=r; });

  const defaults = getEditorDefaultPositions();
  Object.keys(TABLE_DATA).map(Number).forEach(id=>{
    if(!tablePositions[id]) tablePositions[id] = defaults[id] || {x:20,y:20};
  });

  // ── Labels de zones (non-draggables)
  [
    {text:'TERRASSE',     x:28, y:12},
    {text:'BAR AVEC VUE',x:28, y:520},
    {text:'SALLE',       x:320,y:118},
    {text:'TERRASSE 2',  x:320,y:518},
    {text:'TABLE HAUTE', x:320,y:628},
  ].forEach(({text,x,y})=>{
    const lbl=document.createElement('div');
    lbl.style.cssText=`position:absolute;left:${x}px;top:${y}px;font-size:8.5px;font-weight:800;color:rgba(60,60,67,.25);text-transform:uppercase;letter-spacing:.13em;pointer-events:none;user-select:none`;
    lbl.textContent=text;
    canvas.appendChild(lbl);
  });

  // ── SVG overlay : lignes de guidage (au-dessus de tout)
  const guideSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  guideSvg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:200;overflow:visible';
  canvas.appendChild(guideSvg);

  // ── Helper : rect d'une table dans le canvas
  function tRect(id){
    const p=tablePositions[id]; if(!p) return null;
    const W=TABLE_DATA[id].hi>=4?100:68;
    return {x:p.x,y:p.y,w:W,h:68,cx:p.x+W/2,cy:p.y+34,r:p.x+W,b:p.y+68};
  }

  // ── Calcul des snaps d'alignement pour la table en cours de drag
  function computeAlignSnap(activeId, nx, ny, W, H){
    const dragL=nx, dragCX=nx+W/2, dragR=nx+W;
    const dragT=ny, dragCY=ny+H/2, dragB=ny+H;
    const snapXs=[], snapYs=[];

    Object.keys(TABLE_DATA).map(Number).forEach(oid=>{
      if(oid===activeId) return;
      const tr=tRect(oid); if(!tr) return;
      const oxs=[tr.x,tr.cx,tr.r];
      const dxs=[{v:dragL,a:0},{v:dragCX,a:W/2},{v:dragR,a:W}];
      dxs.forEach(({v,a})=>oxs.forEach(ox=>{
        const d=Math.abs(v-ox);
        if(d<=ALIGN_SNAP) snapXs.push({guideX:ox,targetNx:ox-a,dist:d});
      }));
      const oys=[tr.y,tr.cy,tr.b];
      const dys=[{v:dragT,a:0},{v:dragCY,a:H/2},{v:dragB,a:H}];
      dys.forEach(({v,a})=>oys.forEach(oy=>{
        const d=Math.abs(v-oy);
        if(d<=ALIGN_SNAP) snapYs.push({guideY:oy,targetNy:oy-a,dist:d});
      }));
    });

    let finalNx=null, guideXs=[], finalNy=null, guideYs=[];
    if(snapXs.length){
      snapXs.sort((a,b)=>a.dist-b.dist);
      finalNx=snapXs[0].targetNx;
      guideXs=[...new Set(snapXs.filter(c=>Math.abs(c.targetNx-finalNx)<1).map(c=>c.guideX))];
    }
    if(snapYs.length){
      snapYs.sort((a,b)=>a.dist-b.dist);
      finalNy=snapYs[0].targetNy;
      guideYs=[...new Set(snapYs.filter(c=>Math.abs(c.targetNy-finalNy)<1).map(c=>c.guideY))];
    }
    return {finalNx,finalNy,guideXs,guideYs};
  }

  // ── Dessine les lignes de guidage dans l'overlay SVG
  function drawGuides(guideXs, guideYs){
    guideSvg.innerHTML='';
    guideXs.forEach(x=>{
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',x);line.setAttribute('x2',x);
      line.setAttribute('y1',0);line.setAttribute('y2',9999);
      line.setAttribute('stroke','#007AFF');line.setAttribute('stroke-width','1.5');
      line.setAttribute('stroke-dasharray','6,4');line.setAttribute('opacity','0.9');
      guideSvg.appendChild(line);
      // Petit losange sur la ligne pour indiquer le point d'accroche
      const d=document.createElementNS('http://www.w3.org/2000/svg','circle');
      d.setAttribute('cx',x);d.setAttribute('cy',50);d.setAttribute('r','4');
      d.setAttribute('fill','#007AFF');d.setAttribute('opacity','0.9');
      guideSvg.appendChild(d);
    });
    guideYs.forEach(y=>{
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',0);line.setAttribute('x2',9999);
      line.setAttribute('y1',y);line.setAttribute('y2',y);
      line.setAttribute('stroke','#FF3B30');line.setAttribute('stroke-width','1.5');
      line.setAttribute('stroke-dasharray','6,4');line.setAttribute('opacity','0.9');
      guideSvg.appendChild(line);
      const d=document.createElementNS('http://www.w3.org/2000/svg','circle');
      d.setAttribute('cx',50);d.setAttribute('cy',y);d.setAttribute('r','4');
      d.setAttribute('fill','#FF3B30');d.setAttribute('opacity','0.9');
      guideSvg.appendChild(d);
    });
  }

  // ── Rendu de chaque table
  Object.keys(TABLE_DATA).map(Number).forEach(id=>{
    const d=TABLE_DATA[id];
    const pos=tablePositions[id];
    const r=tMap[id];
    const W=d.hi>=4?100:68, H=68;

    const wrap=document.createElement('div');
    const sz=d.hi>=4?'md':'sm';
    let cls=`TBL ${sz}`;
    if(r) cls+=r.urgent?' urg':' occ';
    if(d.p) cls+=' prio';
    wrap.className=cls;
    wrap.style.cssText=`position:absolute;left:${pos.x}px;top:${pos.y}px;width:${W}px;height:${H}px;cursor:grab;z-index:2;touch-action:none;user-select:none;box-sizing:border-box;transition:box-shadow .12s`;
    wrap.dataset.tid=id;
    wrap.innerHTML=r
      ?`<div class="tbl-num">${id}</div><div class="tbl-name" style="font-size:10px">${r.name}</div><div class="pax-bubble">${r.pax}</div>`
      :`<div class="tbl-num">${id}</div><div class="tbl-cap">${capStr(d)}</div>`;

    // ── Drag souris
    let dragging=false, rawSX=0,rawSY=0, startPX=0,startPY=0;

    let snappedX=false, snappedY=false;
    const applyMove=(rawNx,rawNy)=>{
      let nx=rawNx, ny=rawNy;
      nx=Math.max(0,nx); ny=Math.max(0,ny);
      const snapOn=getSnapEnabled&&getSnapEnabled();
      if(snapOn){
        const {finalNx,finalNy,guideXs,guideYs}=computeAlignSnap(id,nx,ny,W,H);
        const prevSnappedX=snappedX, prevSnappedY=snappedY;
        snappedX=finalNx!==null; snappedY=finalNy!==null;
        nx=finalNx!==null?finalNx:Math.round(nx/SNAP_GRID)*SNAP_GRID;
        ny=finalNy!==null?finalNy:Math.round(ny/SNAP_GRID)*SNAP_GRID;
        drawGuides(guideXs,guideYs);
        // Feedback visuel quand on s'accroche à une ligne
        if((snappedX&&!prevSnappedX)||(snappedY&&!prevSnappedY)){
          wrap.style.outline='2px solid #007AFF';
          wrap.style.outlineOffset='2px';
        } else if(!snappedX&&!snappedY){
          wrap.style.outline='';
        }
      } else {
        nx=Math.round(nx/SNAP_GRID)*SNAP_GRID;
        ny=Math.round(ny/SNAP_GRID)*SNAP_GRID;
        guideSvg.innerHTML='';
        wrap.style.outline='';
      }
      nx=Math.max(0,nx); ny=Math.max(0,ny);
      tablePositions[id]={x:nx,y:ny};
      wrap.style.left=nx+'px'; wrap.style.top=ny+'px';
    };
    const onMove=e=>{
      if(!dragging) return;
      applyMove(startPX+(e.clientX-rawSX), startPY+(e.clientY-rawSY));
    };
    const onUp=()=>{
      if(!dragging) return;
      dragging=false;
      wrap.style.cursor='grab'; wrap.style.zIndex='2';
      wrap.style.boxShadow=''; wrap.style.outline='';
      guideSvg.innerHTML=''; snappedX=false; snappedY=false;
      document.removeEventListener('mousemove',onMove);
      document.removeEventListener('mouseup',onUp);
      const maxY=Math.max(...Object.values(tablePositions).map(p=>p.y))+150;
      canvas.style.minHeight=Math.max(800,maxY)+'px';
    };
    wrap.addEventListener('mousedown',e=>{
      if(e.button!==0) return;
      dragging=true;
      rawSX=e.clientX; rawSY=e.clientY;
      startPX=tablePositions[id].x; startPY=tablePositions[id].y;
      wrap.style.cursor='grabbing'; wrap.style.zIndex='50';
      wrap.style.boxShadow='0 8px 32px rgba(0,0,0,.25)';
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
      e.preventDefault();
    });

    // ── Drag tactile
    wrap.addEventListener('touchstart',e=>{
      const t=e.touches[0];
      dragging=true;
      rawSX=t.clientX; rawSY=t.clientY;
      startPX=tablePositions[id].x; startPY=tablePositions[id].y;
      wrap.style.zIndex='50';
      e.preventDefault();
    },{passive:false});
    wrap.addEventListener('touchmove',e=>{
      if(!dragging) return;
      const t=e.touches[0];
      applyMove(startPX+(t.clientX-rawSX), startPY+(t.clientY-rawSY));
      e.preventDefault();
    },{passive:false});
    wrap.addEventListener('touchend',()=>{
      dragging=false; wrap.style.zIndex='2';
      wrap.style.outline=''; guideSvg.innerHTML='';
      snappedX=false; snappedY=false;
    });

    canvas.appendChild(wrap);
  });

  // Taille canvas
  const maxY=Math.max(...Object.values(tablePositions).map(p=>p.y))+150;
  const maxX=Math.max(...Object.values(tablePositions).map(p=>p.x))+180;
  canvas.style.minHeight=Math.max(800,maxY)+'px';
  canvas.style.minWidth=Math.max(700,maxX)+'px';
}

function getEditorDefaultPositions(){
  const p={};
  // Terrasse gauche (col 0)
  p[16]={x:20,y:30}; p[17]={x:20,y:108}; p[18]={x:20,y:186};
  p[19]={x:20,y:264}; p[20]={x:98,y:264};
  p[21]={x:20,y:342}; p[22]={x:98,y:342};
  p[23]={x:20,y:420}; p[24]={x:98,y:420};
  p[25]={x:20,y:510}; p[26]={x:20,y:588};
  // Salle droite (col 1) — décalée à droite pour laisser place aux salons à gauche
  p[1]={x:350,y:130}; p[2]={x:428,y:130}; p[3]={x:506,y:130}; p[4]={x:584,y:130};
  p[5]={x:350,y:208}; p[6]={x:428,y:208};
  p[8]={x:350,y:286}; p[7]={x:428,y:286};
  p[9]={x:350,y:364}; p[10]={x:428,y:364};
  p[11]={x:350,y:442}; p[12]={x:428,y:442};
  p[13]={x:350,y:520}; p[14]={x:428,y:520};
  p[27]={x:350,y:620}; p[28]={x:428,y:620}; p[29]={x:506,y:620}; p[30]={x:584,y:620};
  return p;
}

// Mode déplacement : on re-render le plan avec des drop zones entre chaque table
// Chaque zone du plan (terrasse, salle...) accepte le drop
// La table draggée est insérée à la position du drop dans tableOrder
let moveDragTableId = null;

function renderMoveModeCanvas(){
  // On utilise le même renderTables mais avec moveMode=true
  // makeCell gère déjà moveMode pour le drag
  // On ajoute des drop zones entre chaque table dans chaque row
  renderTablesWithDropZones();
}

// renderTablesWithDropZones replaced by openPlanEditor

// Positions par défaut basées sur le plan actuel
function getDefaultPositions(){
  const pos={};
  let x,y;
  // Terrasse gauche
  x=20; y=10;
  [16,17,18].forEach((id,i)=>{pos[id]={x,y:y+i*78};});
  pos[19]={x,y:y+3*78}; pos[20]={x:x+78,y:y+3*78};
  pos[21]={x,y:y+4*78}; pos[22]={x:x+78,y:y+4*78};
  pos[23]={x,y:y+5*78}; pos[24]={x:x+78,y:y+5*78};
  pos[25]={x,y:y+6*78}; pos[26]={x,y:y+7*78};
  // Salle droite
  x=240; y=10;
  pos[1]={x,y}; pos[2]={x:x+78,y}; pos[3]={x:x+156,y}; pos[4]={x:x+234,y};
  pos[5]={x,y:y+78}; pos[6]={x:x+78,y:y+78};
  pos[8]={x,y:y+156}; pos[7]={x:x+78,y:y+156}; // T7 repositionné à côté de T8
  pos[9]={x,y:y+234}; pos[10]={x:x+78,y:y+234};
  pos[11]={x,y:y+312}; pos[12]={x:x+78,y:y+312}; // T11+T12 rangée 1 du 2×2
  pos[13]={x,y:y+390}; pos[14]={x:x+78,y:y+390}; // T13+T14 rangée 2 du 2×2
  pos[27]={x,y:y+468}; pos[28]={x:x+78,y:y+468}; pos[29]={x:x+156,y:y+468}; pos[30]={x:x+234,y:y+468};
  return pos;
}

// ══════════════════════════════════════════
// RENDER TABLES — plan spatial fidèle au croquis
// ══════════════════════════════════════════

// Cellule salon interactive — visuel old-style (fond blanc, bordure tiretée, label centré)
// avec drag & drop + drop target comme une table ordinaire
function makeSalonCell(id, h, tMap){
  const d = TABLE_DATA[id]; if(!d) return null;
  const r = tMap[id];
  const svcCls = r?(r.svc==='s1'?' tbl-s1':r.svc==='s2'?' tbl-s2':(r.svc==='soir'||r.svc==='soir2')?' tbl-soir':''):'';
  const cell = document.createElement('div');
  cell.className = 'TBL sm' + (r?' occ'+svcCls:'');
  cell.style.cssText = `width:84px;height:${h}px;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:2px`;
  cell.dataset.tid = id;
  if(r){
    cell.innerHTML = `<div class="tbl-num" style="font-size:10px;line-height:1.2">${d.lbl}</div><div class="tbl-name">${r.name}</div><div class="pax-bubble">${r.pax}</div>`;
  } else {
    cell.innerHTML = `<div class="tbl-num" style="font-size:10px;line-height:1.2;color:var(--t3)">${d.lbl}</div>`;
  }
  cell.draggable = !!r && !moveMode;
  cell.addEventListener('dragstart', e => {
    if(moveMode||!r) return;
    dragId = r.id; e.dataTransfer.effectAllowed = 'move';
    setTimeout(()=>{ cell.className='TBL sm'; cell.draggable=false; cell.innerHTML=`<div class="tbl-num" style="font-size:10px;line-height:1.2;color:var(--t3)">${d.lbl}</div>`; },0);
  });
  cell.addEventListener('dragover', e=>{ e.preventDefault(); cell.classList.add('dropping'); });
  cell.addEventListener('dragleave', ()=>cell.classList.remove('dropping'));
  cell.addEventListener('drop', e=>{
    e.preventDefault(); cell.classList.remove('dropping');
    if(!dragId) return; saveUndo();
    const dr = gr().find(x=>x.id===dragId); if(!dr) return;
    gr().forEach(x=>{ if(x.id!==dr.id&&x.tableId===id){ x.placed=false; x.tableId=null; } });
    dr.placed=true; dr.tableId=id; dragId=null; selectedId=dr.id; render();
  });
  cell.addEventListener('click', ()=>{ if(r) showDetail(r.id); });
  return cell;
}

function makeCell(id, tMap){
  const d = TABLE_DATA[id]; if(!d) return null;
  const r = tMap[id];
  const fg = getFused(id);
  if(fg && fg.tids[0]!==id) return null; // déjà rendu par le premier tid

  if(fg){
    const rr = fg.tids.map(x=>tMap[x]).find(x=>x);
    const w = fg.tids.length*68+(fg.tids.length-1)*6;
    const cell = document.createElement('div');
    cell.className='TBL md fused-entity'+(rr?' occ':'')+(fuseMode&&fuseTargets.some(x=>fg.tids.includes(x))?' fuse-sel':'');
    cell.style.cssText=`width:${Math.min(w,220)}px;height:68px`;
    cell.dataset.fgid=fg.id;
    cell.innerHTML = rr
      ? `<div class="tbl-num" style="font-size:13px;color:var(--gt)">${fg.tids.join('-')}</div><div class="tbl-name">${rr.name}</div><div class="pax-bubble fused">${rr.pax}</div>`
      : `<div class="tbl-num" style="font-size:13px">${fg.tids.join('-')}</div><div class="tbl-fuse-tag">fusionné</div>`;
    cell.addEventListener('dragover',e=>{e.preventDefault();cell.classList.add('dropping')});
    cell.addEventListener('dragleave',()=>cell.classList.remove('dropping'));
    cell.addEventListener('drop',e=>{e.preventDefault();cell.classList.remove('dropping');if(!dragId)return;saveUndo();const dr=gr().find(x=>x.id===dragId);if(!dr)return;fg.tids.forEach(tid=>{gr().forEach(x=>{if(x.id!==dr.id&&x.tableId===tid){x.placed=false;x.tableId=null;}})});dr.placed=true;dr.tableId=fg.tids[0];dragId=null;selectedId=dr.id;render();});
    cell.addEventListener('click',()=>{if(fuseMode){fg.tids.forEach(x=>tapFuse(x));return;}if(rr)showDetail(rr.id);else showFusedDetail(fg);});
    return cell;
  }

  const sz = d.hi>=4?'md':'sm';
  const cell = document.createElement('div');
  let cls=`TBL ${sz}`;
  if(fuseMode&&fuseTargets.includes(id)) cls+=' fuse-sel';
  else if(r){
    cls+=(r.urgent?' urg':' occ');
    // Bordure basse colorée = service de la resa
    if(!r.urgent) cls+=(r.svc==='s1'?' tbl-s1':r.svc==='s2'?' tbl-s2':(r.svc==='soir'||r.svc==='soir2')?' tbl-soir':'');
    if(r.repas_transat) cls+=' tbl-rt';
  }
  if(d.p) cls+=' prio';
  cell.className=cls; cell.dataset.tid=id;
  const disp = d.lbl || id;
  cell.title=`${disp} · ${capStr(d)}${d.note?' · '+d.note:''}`;
  if(r){
    cell.innerHTML=`<div class="tbl-num">${disp}</div><div class="tbl-name">${r.name}</div><div class="pax-bubble${r.urgent?' urg':''}">${r.pax}</div>`;
  } else {
    cell.innerHTML=`<div class="tbl-num">${disp}</div><div class="tbl-cap">${capStr(d)}</div>`;
  }
  cell.draggable = !!r && !moveMode;
  cell.addEventListener('dragstart',e=>{
    if(moveMode){ e.preventDefault(); return; }
    if(!r)return; dragId=r.id; e.dataTransfer.effectAllowed='move';
    setTimeout(()=>{cell.className=`TBL ${sz}${d.p?' prio':''}`;cell.draggable=false;cell.innerHTML=`<div class="tbl-num">${disp}</div><div class="tbl-cap">${capStr(d)}</div>`;},0);
  });
  cell.addEventListener('dragend',()=>cell.classList.remove('move-dragging'));
  cell.addEventListener('dragover',e=>{
    e.preventDefault();
    cell.classList.add('dropping');
  });
  cell.addEventListener('dragleave',()=>{
    cell.classList.remove('dropping');
  });
  cell.addEventListener('drop',e=>{
    e.preventDefault(); cell.classList.remove('dropping');
    if(moveMode){ return; }
    if(!dragId)return; saveUndo();
    const dr=gr().find(x=>x.id===dragId); if(!dr)return;
    gr().forEach(x=>{if(x.id!==dr.id&&x.tableId===id){x.placed=false;x.tableId=null;}});
    dr.placed=true; dr.tableId=id; dragId=null; selectedId=dr.id; render();
  });
  cell.addEventListener('click',()=>{if(fuseMode){tapFuse(id);return;}if(r)showDetail(r.id);});

  return cell;
}

function row(...ids){ const d=document.createElement('div');d.className='trow';ids.forEach(id=>{const c=makeCell(id,arguments[0]);if(c)d.appendChild(c);});return d;}

// Retourne les IDs réels d'une zone en tenant compte du tableOrder
function zoneIds(zone, defaults){
  if(!tableOrder) return defaults;
  return tableOrder[zone]||defaults;
}

function renderTables(){
  // Si des positions custom existent, rendre en mode canvas absolu
  if(tablePositions && Object.keys(tablePositions).length > 0){
    renderTablesCustomLayout();
    return;
  }
  renderTablesDefaultLayout();
}

function renderTablesDefaultLayout(){
  const fc=document.getElementById('floor-container'); fc.innerHTML='';

  // tMap : UNIQUEMENT le service courant (cohérent avec renderTablesCustomLayout)
  // Chaque onglet voit son propre plan — autoplace S1 n'affecte pas S2
  const tMap={};
  gr().forEach(r=>{if(r.placed&&r.tableId&&!r.ns)tMap[r.tableId]=r;});

  const card=document.createElement('div'); card.className='floor-card';

  function trow(...ids){
    const d=document.createElement('div');d.className='tables-row';
    ids.forEach(id=>{const c=makeCell(id,tMap);if(c)d.appendChild(c);});
    return d;
  }

  // Layout 3 colonnes : Salons | Terrasse+Bar | Salle+Terrasse2+TableHaute
  const layout=document.createElement('div');
  layout.style.cssText='display:flex;gap:14px;align-items:flex-start';

  // ── COLONNE 1 : Salons (à gauche)
  const colSalons=document.createElement('div');
  colSalons.style.cssText='display:flex;flex-direction:column;gap:6px;flex-shrink:0;width:88px';
  const slnHdr=document.createElement('div');slnHdr.className='zone-label';slnHdr.textContent='Salons';
  colSalons.appendChild(slnHdr);
  // Spacer pour aligner Salon 1 avec T19 (saute T16+T17+T18 : 3×68 + 2 gaps×6 = 216px)
  const slnSpacer=document.createElement('div');slnSpacer.style.cssText='height:216px;flex-shrink:0';
  colSalons.appendChild(slnSpacer);
  // Salon 1 : T19 → milieu T21 (108px), Salon 2 : milieu T21 → T23 (108px)
  [1001,1002].forEach(id=>{const c=makeSalonCell(id,68,tMap);if(c)colSalons.appendChild(c);});
  // Séparateur aligné avec le sep terrasse/barVue
  const slnSep=document.createElement('div');slnSep.style.cssText='height:0.5px;background:var(--sep);margin:4px 0';
  colSalons.appendChild(slnSep);
  // Zone-label invisible pour aligner Salon 3 avec T25
  const slnBvGhost=document.createElement('div');slnBvGhost.className='zone-label';
  slnBvGhost.style.visibility='hidden';slnBvGhost.textContent=' ';
  colSalons.appendChild(slnBvGhost);
  // Salon 3 : T25 level (68px), Salon 4 : T26 level (68px)
  [1003,1004].forEach(id=>{const c=makeSalonCell(id,68,tMap);if(c)colSalons.appendChild(c);});
  layout.appendChild(colSalons);

  const vsep=document.createElement('div');
  vsep.style.cssText='width:0.5px;background:var(--sep);align-self:stretch;flex-shrink:0;margin:0 2px';
  layout.appendChild(vsep);

  // ── COLONNE 2 : Terrasse + Bar avec vue
  const colLeft=document.createElement('div');
  colLeft.style.cssText='display:flex;flex-direction:column;gap:6px;flex-shrink:0';
  const terrLabel=document.createElement('div');terrLabel.className='zone-label';terrLabel.textContent='Terrasse';
  colLeft.appendChild(terrLabel);
  const terrIds=zoneIds('terrasse',[16,17,18,19,20,21,22,23,24]);
  [[terrIds[0]],[terrIds[1]],[terrIds[2]],
   [terrIds[3],terrIds[4]],[terrIds[5],terrIds[6]],[terrIds[7],terrIds[8]]]
  .forEach(pair=>colLeft.appendChild(trow(...pair.filter(x=>x!==undefined))));
  const sep25=document.createElement('div');sep25.style.cssText='height:0.5px;background:var(--sep);margin:4px 0';
  colLeft.appendChild(sep25);
  const bvLabel=document.createElement('div');bvLabel.className='zone-label';bvLabel.textContent='Bar avec vue';
  colLeft.appendChild(bvLabel);
  const bvIds=zoneIds('barVue',[25,26]);
  bvIds.forEach(id=>colLeft.appendChild(trow(id)));
  layout.appendChild(colLeft);

  const vsep2=document.createElement('div');
  vsep2.style.cssText='width:0.5px;background:var(--sep);align-self:stretch;flex-shrink:0;margin:0 2px';
  layout.appendChild(vsep2);

  // ── COLONNE 3 : Salle + Terrasse 2 + Table haute
  const colRight=document.createElement('div');
  colRight.style.cssText='display:flex;flex-direction:column;gap:6px;flex:1;min-width:0';
  const barWrap=document.createElement('div');
  barWrap.style.cssText='background:var(--bg);border-radius:8px;padding:5px 12px;text-align:center;border:0.5px solid var(--sep);font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px';
  barWrap.textContent='Bar';
  colRight.appendChild(barWrap);
  const entLabel=document.createElement('div');
  entLabel.style.cssText='font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.09em;text-align:right;margin-bottom:2px';
  entLabel.textContent='Entrée ↓';
  colRight.appendChild(entLabel);
  const intLabel=document.createElement('div');intLabel.className='zone-label';intLabel.textContent='Salle';
  colRight.appendChild(intLabel);
  colRight.appendChild(trow(1,2,3,4));
  colRight.appendChild(trow(5,6));
  colRight.appendChild(trow(8,7));
  colRight.appendChild(trow(9,10));
  const terr2Label=document.createElement('div');terr2Label.className='zone-label';terr2Label.style.marginTop='4px';terr2Label.textContent='Terrasse 2';
  colRight.appendChild(terr2Label);
  colRight.appendChild(trow(11,12));
  const row1314=document.createElement('div');row1314.className='tables-row';
  const s13=makeSalonCell(13,68,tMap);if(s13)row1314.appendChild(s13);
  const c14=makeCell(14,tMap);if(c14)row1314.appendChild(c14);
  colRight.appendChild(row1314);
  const thLabel=document.createElement('div');thLabel.className='zone-label';thLabel.style.marginTop='6px';thLabel.textContent='Table haute';
  colRight.appendChild(thLabel);
  colRight.appendChild(trow(27,28,29,30));
  layout.appendChild(colRight);

  card.appendChild(layout);
  fc.appendChild(card);
}

// ══════════════════════════════════════════
// RENDER TABLES CUSTOM LAYOUT (positions libres)
// ══════════════════════════════════════════
function renderTablesCustomLayout(){
  const fc=document.getElementById('floor-container'); fc.innerHTML='';
  const resas=gr(); const tMap={};
  resas.forEach(r=>{if(r.placed&&r.tableId)tMap[r.tableId]=r;});

  const wrap = document.createElement('div');
  wrap.style.cssText='position:relative;background:var(--card);border-radius:14px;border:0.5px solid var(--sep);overflow:visible';

  // Calculer les dimensions du canvas
  const maxX = Math.max(...Object.values(tablePositions).map(p=>p.x)) + 130;
  const maxY = Math.max(...Object.values(tablePositions).map(p=>p.y)) + 90;
  wrap.style.width = Math.max(600, maxX) + 'px';
  wrap.style.height = Math.max(400, maxY) + 'px';

  Object.keys(TABLE_DATA).map(Number).forEach(id=>{
    const pos = tablePositions[id];
    if(!pos) return;
    const cell = makeCell(id, tMap);
    if(!cell) return;
    cell.style.position='absolute';
    cell.style.left = pos.x + 'px';
    cell.style.top = pos.y + 'px';
    wrap.appendChild(cell);
  });

  const card = document.createElement('div');
  card.className='floor-card';
  card.style.padding='0';
  card.style.overflow='auto';
  card.appendChild(wrap);
  fc.appendChild(card);
}

// ══════════════════════════════════════════
// RENDER TRANSATS — CSS Grid 2D + blocs polygonaux
// ══════════════════════════════════════════
function setTrZoom(z){
  trZoom = Math.max(0.5, Math.min(2.5, Math.round(z * 10) / 10));
  renderTransats();
}

function renderTransats(){
  const fc = document.getElementById('floor-container'); fc.innerHTML='';

  // ── Barre de zoom
  const zb = document.createElement('div');
  zb.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:10px;flex-shrink:0';
  const pct = Math.round(trZoom * 100);
  zb.innerHTML = `
    <button onclick="setTrZoom(trZoom-0.1)" style="width:28px;height:28px;border:1px solid var(--sep2);border-radius:8px;background:var(--card);font-size:16px;cursor:pointer;color:var(--t2);line-height:1;display:flex;align-items:center;justify-content:center" title="Dézoomer">−</button>
    <span style="font-size:11px;font-weight:700;color:var(--t3);min-width:36px;text-align:center">${pct}%</span>
    <button onclick="setTrZoom(trZoom+0.1)" style="width:28px;height:28px;border:1px solid var(--sep2);border-radius:8px;background:var(--card);font-size:16px;cursor:pointer;color:var(--t2);line-height:1;display:flex;align-items:center;justify-content:center" title="Zoomer">+</button>
    ${pct!==100?`<button onclick="setTrZoom(1)" style="font-size:10px;font-weight:700;padding:3px 8px;border:1px solid var(--sep2);border-radius:8px;background:var(--card);cursor:pointer;color:var(--t3)">100%</button>`:''}
  `;
  fc.appendChild(zb);

  // ── Pinch-to-zoom tactile
  let _p0=null, _z0=1;
  fc.addEventListener('touchstart', e=>{
    if(e.touches.length===2){
      _p0=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      _z0=trZoom;
    }
  },{passive:true,once:false});
  fc.addEventListener('touchmove', e=>{
    if(e.touches.length===2 && _p0){
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      const nz=Math.max(0.5,Math.min(2.5,_z0*(d/_p0)));
      const c=fc.querySelector('.beach-card');
      if(c) c.style.zoom=nz;
    }
  },{passive:true});
  fc.addEventListener('touchend', e=>{
    if(_p0 && e.touches.length<2){
      const c=fc.querySelector('.beach-card');
      if(c){ trZoom=Math.max(0.5,Math.min(2.5,parseFloat(c.style.zoom)||trZoom)); renderTransats(); }
      _p0=null;
    }
  },{passive:true});

  const sm = buildSlotMap();
  const card = document.createElement('div'); card.className='beach-card';
  card.style.cssText = 'min-width:max-content;zoom:'+trZoom;
  card.innerHTML='<div class="beach-shore-label">▲ RESTAURANT</div>';

  const TR_W = 48, TR_H = 42, GAP = 5, ALLEY_W = 22, LABEL_W = 62, EXTRA_W = 84, ROW_GAP = 16;

  function slotToCol(slot){
    const pos = slot - Math.floor(slot/100)*100;
    if(pos >= 1 && pos <= 7) return 1 + pos;
    if(pos >= 8 && pos <= 13) return 2 + pos;  // 12bis = pos 13 → col 15
    return 3 + pos;                              // d: pos 14 → col 17
  }
  function slotToRow(slot){
    const rb = Math.floor(slot/100)*100;
    return TR_ROWS.findIndex(r=>r.id===rb) + 1;
  }
  function slotBlk(slot){
    const pos = slot - Math.floor(slot/100)*100;
    return pos <= 7 ? 'g' : pos <= 13 ? 'm' : 'd';
  }
  function slotLabel(slot){
    // BEDs : labels visuels décalés (220→"219", 221→"220", 222→"221"), row-100 BEDs restent tels quels
    const BED_LABEL = {220:'219', 221:'220', 222:'221'};
    if(BED_SLOTS.includes(slot)) return BED_LABEL[slot] || String(slot);
    const base = Math.floor(slot/100)*100;
    const pos = slot - base;
    if(pos === 13) return String(base + 12) + 'bis';  // ex: 213 → "212bis"
    if(pos >= 14) return String(base + pos - 1);      // ex: 214 → "213", 219 → "218"
    return String(slot);
  }

  // ── Container grid
  const grid = document.createElement('div');
  grid.style.cssText = `
    display:grid;
    grid-template-columns:
      ${LABEL_W}px
      repeat(7, ${TR_W}px)
      ${ALLEY_W}px
      repeat(6, ${TR_W}px)
      ${ALLEY_W}px
      repeat(8, ${TR_W}px)
      ${EXTRA_W}px;
    grid-template-rows: repeat(${TR_ROWS.length}, ${TR_H}px);
    column-gap: ${GAP}px;
    row-gap: ${ROW_GAP}px;
    padding: 12px 0 16px;
    justify-content: start;
    position: relative;
  `;

  // Labels rangées + Extra
  TR_ROWS.forEach((row, i) => {
    const label = document.createElement('div');
    label.style.cssText = `grid-column:1; grid-row:${i+1}; display:flex; align-items:center; justify-content:flex-end; padding-right:10px`;
    label.innerHTML = `<span style="font-size:10px; font-weight:700; color:${row.sea?'var(--teal)':'var(--t4)'}; letter-spacing:.08em; font-family:'DM Mono',monospace">${row.id}</span>`;
    grid.appendChild(label);

    // Rangée 200 : col 24 est occupée par BED 221 — pas de bouton Extra ici
    if(row.id !== 200){
      const extra = document.createElement('div');
      extra.style.cssText = `grid-column:25; grid-row:${i+1}; display:flex; align-items:center; padding-left:8px`;
      const btn = document.createElement('button');
      btn.textContent = '+ Extra';
      btn.style.cssText = `background:none; border:none; color:var(--teal); font-size:11px; font-weight:600; cursor:pointer; padding:5px 8px; border-radius:6px; font-family:inherit; transition:background .12s`;
      btn.onmouseenter = () => btn.style.background = 'var(--rtbg)';
      btn.onmouseleave = () => btn.style.background = 'none';
      btn.onclick = () => promptAddExtra(row.id);
      extra.appendChild(btn);
      grid.appendChild(extra);
    }
  });

  // ── Résas placées groupées par bloc (g/m/d)
  // Les resas sur salon (slot 1001-1004) sont traitées séparément — exclure du flow normal
  const isSalonSlot = s => s >= 1001 && s <= 1004;
  const placedResas = reservations.transats.filter(r => r.placed && !r.ns && !isSalonSlot(r.slot));
  const resaBlocks = []; // Chaque bloc = un groupe de cellules contiguës dans un bloc g/m/d

  placedResas.forEach(resa => {
    // BED : 1 slot = 2 personnes → 1 seule cellule quelle que soit resa.tr
    const isBedResa = resa.slot && BED_SLOTS.includes(resa.slot);
    const slots = (resa.extraSlots && resa.extraSlots.length)
      ? resa.extraSlots
      : isBedResa
        ? [resa.slot]
        : Array.from({length: resa.tr || 1}, (_, i) => (resa.slot || 0) + i);

    const byBlk = {};
    slots.forEach(s => {
      const bk = slotBlk(s);
      if(!byBlk[bk]) byBlk[bk] = [];
      byBlk[bk].push(s);
    });

    Object.entries(byBlk).forEach(([bk, slotsInBlk]) => {
      // Organiser par rangée : {rowBase: [slots triés]}
      const byRow = {};
      slotsInBlk.forEach(s => {
        const rb = Math.floor(s/100)*100;
        if(!byRow[rb]) byRow[rb] = [];
        byRow[rb].push(s);
      });
      Object.values(byRow).forEach(arr => arr.sort((a,b)=>a-b));

      const rowBases = Object.keys(byRow).map(Number).sort((a,b)=>a-b);
      const isMultiRow = rowBases.length > 1;
      const repartition = rowBases.map(rb => ({ rowBase: rb, count: byRow[rb].length }));

      resaBlocks.push({
        resa, blkKey: bk, slotsInBlk, byRow, rowBases, isMultiRow, repartition
      });
    });
  });

  // ── Marquer les slots couverts (pour ne pas rendre de cellule libre dessous)
  const coveredSlots = new Set();
  placedResas.forEach(resa => {
    const isBedResa = resa.slot && BED_SLOTS.includes(resa.slot);
    const slots = (resa.extraSlots && resa.extraSlots.length)
      ? resa.extraSlots
      : isBedResa
        ? [resa.slot]
        : Array.from({length: resa.tr || 1}, (_, i) => (resa.slot || 0) + i);
    slots.forEach(s => coveredSlots.add(s));
  });

  // ── Rendre cellules libres
  TR_ROWS.forEach((row, ri) => {
    const rowBase = row.id;
    // Rangée 200 : 21 positions (201-218 normaux + 219/220/221 BEDs)
    const maxPos = rowBase === 100 ? 3 : rowBase === 200 ? 22 : 21;  // 200: BEDs à 220/221/222 → pos 22
    for(let pos = 1; pos <= maxPos; pos++){
      // Rangée 100 : seuls les slots 101, 102, 103 existent (104-120 → salons ou supprimés)
      if(rowBase === 100 && pos > 3) continue;
      // Rangée 200 : positions 19-21 sont les BEDs (slots 219/220/221)
      const slot = rowBase + pos;
      if(coveredSlots.has(slot)) continue;

      const col = slotToCol(slot);
      const isBed = BED_SLOTS.includes(slot);
      const cell = document.createElement('div');
      const isFuseSel = fuseMode && fuseTrTargets.includes(slot);
      cell.className = 'TR' + (isBed ? ' TR-bed' : '') + (isFuseSel ? ' TR-fuse-sel' : '');
      cell.style.cssText = `grid-column:${col}; grid-row:${ri+1};`;
      cell.dataset.slot = slot;
      cell.innerHTML = isBed
        ? `<div class="tr-num" style="font-size:8px;font-weight:800;line-height:1.25;text-align:center">BED<br>${slotLabel(slot)}</div>`
        : `<div class="tr-num">${slotLabel(slot)}</div>`;

      cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('TR-drop'); });
      cell.addEventListener('dragleave', () => cell.classList.remove('TR-drop'));
      cell.addEventListener('drop', e => {
        e.preventDefault();
        cell.classList.remove('TR-drop');
        if(!dragId) return;
        const dr = gr().find(x => x.id === dragId); if(!dr) return;
        let ok = true;
        if(isBed){
          // BED : capacité 2 par cellule → logique table (1 cellule = 1 resa, pas de débordement)
          ok = !sm[slot] || sm[slot].id === dr.id;
        } else {
          const needed = dr.tr || dr.pax || 1;
          const blk = slotBlk(slot);
          const rowBlk = trSlots(rowBase)[blk];
          const si = rowBlk.indexOf(slot);
          for(let k = 0; k < needed; k++){
            const s = rowBlk[si + k];
            if(s === undefined || (sm[s] && sm[s].id !== dr.id)){ ok = false; break; }
          }
        }
        if(!ok){
          cell.style.background = 'var(--rbg)';
          setTimeout(() => cell.style.background = '', 500);
          return;
        }
        saveUndo();
        dr.placed = true; dr.slot = slot; dr.extraSlots = null;
        dragId = null; selectedId = dr.id; render();
      });
      cell.addEventListener('click', () => { if(fuseMode) tapFuse(slot); });
      grid.appendChild(cell);
    }
  });

  // ── Rendre les blocs de resas
  resaBlocks.forEach(block => {
    const { resa, slotsInBlk, byRow, rowBases, isMultiRow, repartition } = block;

    const isRT = resa.repas_transat || resa.svc === 'transats';
    const bgCol = resa.svc === 's2' ? 'var(--s2bg)'
                : (resa.svc === 'soir' || resa.svc === 'soir2') ? 'var(--sobg)'
                : isRT ? 'var(--rtbg)' : 'var(--s1bg)';
    const bdCol = resa.svc === 's2' ? 'var(--s2)'
                : (resa.svc === 'soir' || resa.svc === 'soir2') ? 'var(--so)'
                : isRT ? 'var(--teal)' : 'var(--s1)';
    const txCol = resa.svc === 's2' ? 'var(--s2t)'
                : (resa.svc === 'soir' || resa.svc === 'soir2') ? 'var(--sot)'
                : isRT ? 'var(--rtt)' : 'var(--s1t)';

    const totalTr = resa.tr || slotsInBlk.length;

    // ═══════════════════════════════════════
    // CAS SIMPLE : mono-rangée → bloc rectangulaire classique
    // ═══════════════════════════════════════
    if(!isMultiRow){
      const slots = byRow[rowBases[0]];
      const cols = slots.map(slotToCol);
      const cMin = Math.min(...cols), cMax = Math.max(...cols);
      const row = slotToRow(slots[0]);

      const bloc = document.createElement('div');
      bloc.style.cssText = `
        grid-column:${cMin} / ${cMax + 1};
        grid-row:${row};
        position:relative;
        cursor:grab;
        ${fuseMode && fuseTrTargets.some(s => slotsInBlk.includes(s)) ? 'outline:2.5px solid var(--gold); outline-offset:-1px; border-radius:10px;' : ''}
      `;

      // SVG avec subdivisions verticales entre chaque transat
      const nSlots = slots.length;
      const svgW = nSlots * TR_W + (nSlots - 1) * GAP;
      const svgH = TR_H;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.style.cssText = 'position:absolute;inset:0;display:block';

      // Fond : rectangle arrondi plein
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('x','0'); bg.setAttribute('y','0');
      bg.setAttribute('width', svgW); bg.setAttribute('height', svgH);
      bg.setAttribute('rx', '10');
      bg.setAttribute('fill', bgCol);
      svg.appendChild(bg);

      // Outline de chaque transat individuel (très léger)
      for(let i = 0; i < nSlots; i++){
        const cr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cr.setAttribute('x',      i * (TR_W + GAP) + 1);
        cr.setAttribute('y',      '1');
        cr.setAttribute('width',  TR_W - 2);
        cr.setAttribute('height', TR_H - 2);
        cr.setAttribute('rx',     '8');
        cr.setAttribute('fill',   'none');
        cr.setAttribute('stroke', bdCol);
        cr.setAttribute('stroke-width', '1');
        cr.setAttribute('opacity', '0.3');
        svg.appendChild(cr);
      }

      // Contour
      const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      border.setAttribute('x','0.75'); border.setAttribute('y','0.75');
      border.setAttribute('width', svgW - 1.5); border.setAttribute('height', svgH - 1.5);
      border.setAttribute('rx', '9.5');
      border.setAttribute('fill', 'none');
      border.setAttribute('stroke', bdCol);
      border.setAttribute('stroke-width', '1.5');
      svg.appendChild(border);

      bloc.appendChild(svg);

      // Label centré
      const label = document.createElement('div');
      label.style.cssText = `
        position:absolute;inset:0;
        display:flex;align-items:center;justify-content:center;
        pointer-events:none;padding:0 6px;
      `;
      label.innerHTML = `
        <div style="text-align:center;min-width:0">
          <div style="font-size:11px;font-weight:600;color:${txCol};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.15">${resa.name}</div>
          <div style="font-size:10px;font-weight:700;color:${txCol};margin-top:1px;font-family:'DM Mono',monospace">x${totalTr}</div>
        </div>
      `;
      bloc.appendChild(label);

      attachBlocHandlers(bloc, resa, slotsInBlk);
      grid.appendChild(bloc);
      return;
    }

    // ═══════════════════════════════════════
    // CAS MULTI-RANGÉES : SVG polygone avec subdivisions
    // ═══════════════════════════════════════
    // Bbox englobante
    const allCols = slotsInBlk.map(slotToCol);
    const cMinG = Math.min(...allCols), cMaxG = Math.max(...allCols);
    const rMinG = slotToRow(byRow[rowBases[0]][0]);
    const rMaxG = slotToRow(byRow[rowBases[rowBases.length-1]][0]);

    // Container grid étendu sur toute la bbox
    const container = document.createElement('div');
    container.style.cssText = `
      grid-column:${cMinG} / ${cMaxG + 1};
      grid-row:${rMinG} / ${rMaxG + 1};
      position:relative;
      pointer-events:none;
    `;

    // Dimensions SVG (en px pixel-perfect pour matching visuel)
    const widthCols = cMaxG - cMinG + 1;
    const nRows = rMaxG - rMinG + 1;
    const svgW = widthCols * TR_W + (widthCols - 1) * GAP;
    const svgH = nRows * TR_H + (nRows - 1) * ROW_GAP;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'position:absolute;inset:0;overflow:visible;pointer-events:none;cursor:grab';

    // Cellule unit dans SVG (chaque transat)
    // Position (r, c) → x = (c - cMinG) * (TR_W + GAP), y = (r - rMinG) * (TR_H + ROW_GAP)
    function slotToSvgBox(slot){
      const c = slotToCol(slot);
      const r = slotToRow(slot);
      return {
        x: (c - cMinG) * (TR_W + GAP),
        y: (r - rMinG) * (TR_H + ROW_GAP),
        w: TR_W, h: TR_H
      };
    }

    // ─── Construire l'ensemble de cellules occupées (r, c)
    const occupied = new Set();
    slotsInBlk.forEach(s => {
      const r = slotToRow(s), c = slotToCol(s);
      occupied.add((r - rMinG) + ',' + (c - cMinG));
    });

    // ─── Remplissage : UN SEUL rectangle par slot (fond), aucun connecteur
    // (on ne fusionne pas les fonds — le path tracé ensuite donne l'illusion d'un bloc unique)
    slotsInBlk.forEach(slot => {
      const box = slotToSvgBox(slot);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', box.x);
      rect.setAttribute('y', box.y);
      rect.setAttribute('width', box.w);
      rect.setAttribute('height', box.h);
      rect.setAttribute('fill', bgCol);
      rect.style.pointerEvents = 'all';
      svg.appendChild(rect);
    });

    // Connecteurs verticaux (rempli le row-gap)
    slotsInBlk.forEach(slot => {
      if(slotsInBlk.includes(slot + 100)){
        const box = slotToSvgBox(slot);
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        c.setAttribute('x', box.x);
        c.setAttribute('y', box.y + box.h);
        c.setAttribute('width', box.w);
        c.setAttribute('height', ROW_GAP + 0.5);
        c.setAttribute('fill', bgCol);
        c.style.pointerEvents = 'all';
        svg.appendChild(c);
      }
    });
    // Connecteurs horizontaux (rempli le col-gap)
    slotsInBlk.forEach(slot => {
      if(slotsInBlk.includes(slot + 1) && slotBlk(slot) === slotBlk(slot + 1)){
        const box = slotToSvgBox(slot);
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        c.setAttribute('x', box.x + box.w);
        c.setAttribute('y', box.y);
        c.setAttribute('width', GAP + 0.5);
        c.setAttribute('height', box.h);
        c.setAttribute('fill', bgCol);
        c.style.pointerEvents = 'all';
        svg.appendChild(c);
      }
    });

    // Connecteurs diagonaux : remplir le coin central entre cellules
    // Déclenchement quand la DIAGONALE (r+1, c+1) ET au moins une des 3 autres cellules
    // adjacentes au coin (r+1, c) OU (r, c+1) existent → il faut combler le carré central
    slotsInBlk.forEach(slot => {
      const right = slot + 1;
      const below = slot + 100;
      const diag = slot + 101;
      const rightOk = slotsInBlk.includes(right) && slotBlk(slot) === slotBlk(right);
      const diagOk = slotsInBlk.includes(diag) && slotBlk(below) === slotBlk(diag);
      const belowOk = slotsInBlk.includes(below);

      // Cas 1 : diagonale SE existe. On remplit le carré central.
      // (couvre 2×2 complet, et les cas décrochement type Audrey où cell(r+1,c+1) existe)
      if(diagOk && (rightOk || belowOk)){
        const box = slotToSvgBox(slot);
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        c.setAttribute('x', box.x + box.w);
        c.setAttribute('y', box.y + box.h);
        c.setAttribute('width', GAP + 0.5);
        c.setAttribute('height', ROW_GAP + 0.5);
        c.setAttribute('fill', bgCol);
        c.style.pointerEvents = 'all';
        svg.appendChild(c);
      }
    });

    // ─── Outline individuel de chaque transat (très léger)
    slotsInBlk.forEach(slot => {
      const box = slotToSvgBox(slot);
      const cr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      cr.setAttribute('x',      box.x + 1);
      cr.setAttribute('y',      box.y + 1);
      cr.setAttribute('width',  box.w - 2);
      cr.setAttribute('height', box.h - 2);
      cr.setAttribute('rx',     '8');
      cr.setAttribute('fill',   'none');
      cr.setAttribute('stroke', bdCol);
      cr.setAttribute('stroke-width', '1');
      cr.setAttribute('opacity', '0.3');
      svg.appendChild(cr);
    });

    // ─── Contour polygonal : UN SEUL PATH fermé suivant le polygone
    // Algorithme de edge tracing :
    // 1) Collecter les points (vertices) du polygone : on parcourt chaque cellule et on identifie
    //    les 4 coins. Un coin est un VRAI vertex du polygone si le nombre de cellules
    //    occupées parmi les 4 cellules qui le touchent est impair (1 ou 3).
    // 2) Construire les arêtes entre vertices adjacents.
    // 3) Chaîner les arêtes dans l'ordre horaire pour former un ou plusieurs loops.
    // 4) Générer le path avec arcs arrondis aux coins convexes uniquement.
    const RADIUS = 9;

    function hasC(r, c){ return occupied.has(r + ',' + c); }

    // Pour chaque vertex (intersection de 4 cellules théoriques), retourner son "type" :
    // - 0 cellule occupée autour → pas de vertex
    // - 1 cellule occupée → coin convexe extérieur (arrondi)
    // - 2 cellules occupées (diagonales) → point singulier, forme 2 vertices séparés
    // - 2 cellules occupées (adjacentes) → pas de vertex (bord droit continu)
    // - 3 cellules occupées → coin concave (pas d'arrondi)
    // - 4 cellules occupées → intérieur plein, pas de vertex

    // Coordonnées des vertex en pixels :
    // vertex (vr, vc) est au coin supérieur-gauche de la cell (vr, vc)
    // = point (vc * (TR_W + GAP), vr * (TR_H + ROW_GAP)) si vr>0 et vc>0
    // Cas spéciaux pour les bords : vertex (0, vc) est en y=0, vertex (vr, 0) en x=0
    function vertexPos(vr, vc){
      const x = vc === 0 ? 0 : vc * (TR_W + GAP) - GAP;
      const y = vr === 0 ? 0 : vr * (TR_H + ROW_GAP) - ROW_GAP;
      return {x, y};
    }
    // Pour les vertex "à droite" ou "en bas" d'une cellule :
    // vertex au coin bas-droite de cell (r, c) = position (r+1, c+1)
    // Sa position pixel : si c'est aussi le bord droit du polygone (pas de cell à droite),
    // x = c * (TR_W + GAP) + TR_W. Si il y a une cell à droite dans le groupe, x inclut le GAP.
    // On va donc calculer les positions en fonction du contexte.

    // Approche plus robuste : tracer en parcourant les arêtes externes de chaque cellule,
    // puis fusionner les colinéaires pour obtenir les vrais segments du polygone.

    // Étape 1 : collecter tous les "micro-segments" (un par côté extérieur de cellule)
    // Chaque cellule occupée contribue ses côtés externes (où le voisin est absent)
    // Avec positions pixel absolues.
    // Approche cellule par cellule : chaque cellule contribue les bords qui sont externes
    // Les bords se raccordent visuellement (pixel-perfect) quand les cellules sont bien collées
    function cellBnds(r, c){
      const left = c * (TR_W + GAP);
      const top = r * (TR_H + ROW_GAP);
      const right = hasC(r, c+1) ? left + TR_W + GAP : left + TR_W;
      const bottom = hasC(r+1, c) ? top + TR_H + ROW_GAP : top + TR_H;
      return {left, top, right, bottom};
    }

    let pathD = '';
    occupied.forEach(keyStr => {
      const [r, c] = keyStr.split(',').map(Number);
      const b = cellBnds(r, c);

      const upFree = !hasC(r-1, c);
      const downFree = !hasC(r+1, c);
      const leftFree = !hasC(r, c-1);
      const rightFree = !hasC(r, c+1);

      // Coin convexe = 2 bords adjacents tous les deux externes
      const tlConvex = upFree && leftFree;
      const trConvex = upFree && rightFree;
      const brConvex = downFree && rightFree;
      const blConvex = downFree && leftFree;

      // TOP segment
      if(upFree){
        const x1 = tlConvex ? b.left + RADIUS : b.left;
        const x2 = trConvex ? b.right - RADIUS : b.right;
        pathD += `M ${x1.toFixed(2)} ${b.top.toFixed(2)} L ${x2.toFixed(2)} ${b.top.toFixed(2)} `;
        if(trConvex){
          pathD += `A ${RADIUS} ${RADIUS} 0 0 1 ${b.right.toFixed(2)} ${(b.top + RADIUS).toFixed(2)} `;
        }
        // COIN CONCAVE HAUT-DROITE : cell(r-1, c+1) existe
        if(hasC(r-1, c+1) && !trConvex){
          const midY = b.top - ROW_GAP / 2;
          const botOfCellAbove = (r-1) * (TR_H + ROW_GAP) + TR_H;
          pathD += `L ${b.right.toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.right + GAP).toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.right + GAP).toFixed(2)} ${botOfCellAbove.toFixed(2)} `;
        }
      }
      // RIGHT segment
      if(rightFree){
        const hasStepRight = hasC(r+1, c+1) && !brConvex;
        const y1 = trConvex ? b.top + RADIUS : b.top;
        // Si décrochement SE : on s'arrête au MILIEU du row-gap pour enchaîner le raccord horizontal
        const innerBot = r * (TR_H + ROW_GAP) + TR_H;
        const midY = innerBot + ROW_GAP / 2;
        const y2 = brConvex ? b.bottom - RADIUS : (hasStepRight ? midY : b.bottom);
        if(!upFree || !trConvex){
          pathD += `M ${b.right.toFixed(2)} ${y1.toFixed(2)} `;
        }
        pathD += `L ${b.right.toFixed(2)} ${y2.toFixed(2)} `;
        if(brConvex){
          pathD += `A ${RADIUS} ${RADIUS} 0 0 1 ${(b.right - RADIUS).toFixed(2)} ${b.bottom.toFixed(2)} `;
        }
        // Raccord au décrochement : horizontal à mi-gap, puis descente au bord top de la cell diagonale
        if(hasStepRight){
          const topOfCellBelow = (r+1) * (TR_H + ROW_GAP);
          pathD += `L ${(b.right + GAP).toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.right + GAP).toFixed(2)} ${topOfCellBelow.toFixed(2)} `;
        }
      }
      // BOTTOM segment
      if(downFree){
        const x1 = brConvex ? b.right - RADIUS : b.right;
        const x2 = blConvex ? b.left + RADIUS : b.left;
        if(!rightFree || !brConvex){
          pathD += `M ${x1.toFixed(2)} ${b.bottom.toFixed(2)} `;
        }
        pathD += `L ${x2.toFixed(2)} ${b.bottom.toFixed(2)} `;
        if(blConvex){
          pathD += `A ${RADIUS} ${RADIUS} 0 0 1 ${b.left.toFixed(2)} ${(b.bottom - RADIUS).toFixed(2)} `;
        }
        // COIN CONCAVE BAS-GAUCHE : cell(r+1, c-1) existe
        if(hasC(r+1, c-1) && !blConvex){
          const innerBot = r * (TR_H + ROW_GAP) + TR_H;
          const midY = innerBot + ROW_GAP / 2;
          const topOfCellBelow = (r+1) * (TR_H + ROW_GAP);
          pathD += `L ${b.left.toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.left - GAP).toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.left - GAP).toFixed(2)} ${topOfCellBelow.toFixed(2)} `;
        }
      }
      // LEFT segment
      if(leftFree){
        const y1 = blConvex ? b.bottom - RADIUS : b.bottom;
        const y2 = tlConvex ? b.top + RADIUS : b.top;
        if(!downFree || !blConvex){
          pathD += `M ${b.left.toFixed(2)} ${y1.toFixed(2)} `;
        }
        pathD += `L ${b.left.toFixed(2)} ${y2.toFixed(2)} `;
        if(tlConvex){
          pathD += `A ${RADIUS} ${RADIUS} 0 0 1 ${(b.left + RADIUS).toFixed(2)} ${b.top.toFixed(2)} `;
        }
        // COIN CONCAVE HAUT-GAUCHE : cell(r-1, c-1) existe
        if(hasC(r-1, c-1) && !tlConvex){
          const midY = b.top - ROW_GAP / 2;
          const botOfCellAbove = (r-1) * (TR_H + ROW_GAP) + TR_H;
          pathD += `L ${b.left.toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.left - GAP).toFixed(2)} ${midY.toFixed(2)} `;
          pathD += `L ${(b.left - GAP).toFixed(2)} ${botOfCellAbove.toFixed(2)} `;
        }
      }
    });
    // Règle : un segment right de cell(r,c) s'étend dans le gap vertical en-dessous
    // SEULEMENT si cell(r+1,c) ET cell(r+1,c+1) sont dans le MÊME état (tous deux présents
    // ou tous deux absents). Sinon, le segment s'arrête à la limite interne de la cellule.
    const segs = [];
    occupied.forEach(key => {
      const [r, c] = key.split(',').map(Number);
      const leftBase = c * (TR_W + GAP);
      const topBase = r * (TR_H + ROW_GAP);
      const innerBottom = topBase + TR_H;   // y de fin interne de la cell
      const innerRight = leftBase + TR_W;   // x de fin interne de la cell

      // Top : si pas de voisin au-dessus
      if(!hasC(r-1, c)){
        // x1 : si cell(r, c-1) ∉ groupe → leftBase ; sinon → leftBase (on commence au bord interne gauche)
        // On étend vers la gauche dans le col-gap si cell(r-1, c-1) ∉ groupe ET cell(r, c-1) ∈ groupe
        let x1 = leftBase;
        if(hasC(r, c-1) && !hasC(r-1, c-1)){
          // Gap à gauche partagé par 2 bords-top → démarre avant
          x1 = leftBase - GAP;
        }
        let x2 = innerRight;
        if(hasC(r, c+1) && !hasC(r-1, c+1)){
          x2 = leftBase + TR_W + GAP;
        }
        segs.push({x1, y1:topBase, x2, y2:topBase, dir:'h'});
      }

      // Right : si pas de voisin à droite
      if(!hasC(r, c+1)){
        let y1 = topBase;
        if(hasC(r-1, c) && !hasC(r-1, c+1)){
          y1 = topBase - ROW_GAP;
        }
        let y2 = innerBottom;
        if(hasC(r+1, c) && !hasC(r+1, c+1)){
          y2 = topBase + TR_H + ROW_GAP;
        }
        segs.push({x1:innerRight, y1, x2:innerRight, y2, dir:'v'});
      }

      // Bottom : si pas de voisin en dessous
      if(!hasC(r+1, c)){
        let x1 = innerRight;
        if(hasC(r, c+1) && !hasC(r+1, c+1)){
          x1 = leftBase + TR_W + GAP;
        }
        let x2 = leftBase;
        if(hasC(r, c-1) && !hasC(r+1, c-1)){
          x2 = leftBase - GAP;
        }
        segs.push({x1, y1:innerBottom, x2, y2:innerBottom, dir:'h'});
      }

      // Left : si pas de voisin à gauche
      if(!hasC(r, c-1)){
        let y1 = innerBottom;
        if(hasC(r+1, c) && !hasC(r+1, c-1)){
          y1 = topBase + TR_H + ROW_GAP;
        }
        let y2 = topBase;
        if(hasC(r-1, c) && !hasC(r-1, c-1)){
          y2 = topBase - ROW_GAP;
        }
        segs.push({x1:leftBase, y1, x2:leftBase, y2, dir:'v'});
      }
    });

if(pathD){
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', bdCol);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linejoin', 'miter');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
    }

    // Outline sélection fusion
    if(fuseMode && fuseTrTargets.some(s => slotsInBlk.includes(s))){
      svg.style.filter = 'drop-shadow(0 0 0 var(--gold))';
    }

    container.appendChild(svg);

    // Label central
    // Positionner sur la rangée la plus large
    let widestRb = rowBases[0];
    let widestCount = byRow[widestRb].length;
    rowBases.forEach(rb => {
      if(byRow[rb].length > widestCount){ widestCount = byRow[rb].length; widestRb = rb; }
    });
    const widestSlots = byRow[widestRb];
    const wCols = widestSlots.map(slotToCol);
    const wcMin = Math.min(...wCols), wcMax = Math.max(...wCols);
    // Calcul position du label en % du container
    const labelLeft = ((wcMin - cMinG) / widthCols) * 100;
    const labelWidth = ((wcMax - wcMin + 1) / widthCols) * 100;
    const widestRi = slotToRow(widestSlots[0]);
    const labelTop = ((widestRi - rMinG) / nRows) * 100;
    const labelHeight = (1 / nRows) * 100;

    const label = document.createElement('div');
    label.className = 'tr-group-label';
    label.style.cssText = `
      position:absolute;
      left:${labelLeft}%; top:${labelTop}%;
      width:${labelWidth}%; height:${labelHeight}%;
      display:flex; align-items:center; justify-content:center;
      pointer-events:none; padding:0 6px;
      z-index:5;
      transition: transform .18s cubic-bezier(.34,1.3,.64,1);
    `;
    label.innerHTML = `
      <div class="tr-group-label-inner" style="text-align:center;min-width:0;background:${bgCol};padding:3px 8px;border-radius:8px">
        <div style="font-size:11px;font-weight:600;color:${txCol};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.15;max-width:100%">${resa.name}</div>
        <div style="font-size:10px;font-weight:700;color:${txCol};margin-top:1px;font-family:'DM Mono',monospace">x${totalTr}</div>
      </div>
    `;
    container.appendChild(label);

    // Tooltip natif (fallback si nom trop long / caché)
    container.title = resa.name + ' · x' + totalTr + (resa.time ? ' · ' + resa.time : '');

    // Hover : scale le label et boost z-index du container pour que rien ne passe devant
    container.style.zIndex = '2';
    svg.addEventListener('mouseenter', () => {
      container.style.zIndex = '10';
      label.style.transform = 'scale(1.05)';
    });
    svg.addEventListener('mouseleave', () => {
      container.style.zIndex = '2';
      label.style.transform = '';
    });

    attachBlocHandlers(svg, resa, slotsInBlk);
    grid.appendChild(container);
  });

    function attachBlocHandlers(bloc, resa, slotsInBlk){
    bloc.draggable = true;
    bloc.addEventListener('dragstart', e => { dragId = resa.id; e.dataTransfer.effectAllowed = 'move'; });
    bloc.addEventListener('dragend', () => { dragId = null; });
    bloc.addEventListener('click', () => {
      if(fuseMode) slotsInBlk.forEach(s => tapFuse(s));
      else showDetail(resa.id);
    });
    bloc.addEventListener('mouseenter', () => {
      bloc.style.boxShadow = 'var(--shadow-md)';
      bloc.style.zIndex = '3';
    });
    bloc.addEventListener('mouseleave', () => {
      bloc.style.boxShadow = '';
      bloc.style.zIndex = '';
    });
  }

  // ── Salons spéciaux — rangée 100 (Salon 1-4, largeur 2 transats chacun)
  // Salons = réservations du plan de salle (tableId 1001-1004), lecture seule dans cette vue
  const salonResaMap = {};
  ['s1','s2','soir'].forEach(svc => {
    (reservations[svc]||[]).forEach(r => {
      if(r.placed && !r.ns && r.tableId >= 1001 && r.tableId <= 1004){
        if(!salonResaMap[r.tableId]) salonResaMap[r.tableId] = r;
      }
    });
  });

  SALON_SLOTS.forEach(salon => {
    const sr = salonResaMap[salon.id];
    const cell = document.createElement('div');
    cell.dataset.salonId = salon.id;
    cell.style.cssText = `
      grid-column:${salon.gridCol};
      grid-row:${salon.gridRow};
      display:flex; align-items:center; justify-content:center;
      border-radius:10px;
      cursor:pointer;
      transition: border-color .12s, background .12s;
      position:relative;
      min-height:${TR_H}px;
    `;

    if(sr){
      // Salon occupé
      const isRT = sr.repas_transat || sr.svc === 'transats';
      const bgCol = sr.svc === 's2' ? 'var(--s2bg)' : (sr.svc === 'soir' || sr.svc === 'soir2') ? 'var(--sobg)' : isRT ? 'var(--rtbg)' : 'var(--s1bg)';
      const bdCol = sr.svc === 's2' ? 'var(--s2)' : (sr.svc === 'soir' || sr.svc === 'soir2') ? 'var(--so)' : isRT ? 'var(--teal)' : 'var(--s1)';
      const txCol = sr.svc === 's2' ? 'var(--s2t)' : (sr.svc === 'soir' || sr.svc === 'soir2') ? 'var(--sot)' : isRT ? 'var(--rtt)' : 'var(--s1t)';
      cell.style.background = bgCol;
      cell.style.border = `1.5px solid ${bdCol}`;
      cell.innerHTML = `
        <div style="text-align:center;padding:0 6px">
          <div style="font-size:9px;font-weight:700;color:${txCol};opacity:.7;letter-spacing:.06em;text-transform:uppercase;margin-bottom:1px">${salon.lbl}</div>
          <div style="font-size:11px;font-weight:600;color:${txCol};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px">${sr.name}</div>
          <div style="font-size:10px;font-weight:700;color:${txCol};font-family:'DM Mono',monospace">x${sr.tr || 2}</div>
        </div>
      `;
      cell.draggable = true;
      cell.addEventListener('dragstart', e => { dragId = sr.id; e.dataTransfer.effectAllowed = 'move'; });
      cell.addEventListener('dragend', () => { dragId = null; });
      cell.addEventListener('click', () => { if(fuseMode) return; showDetail(sr.id); });
      cell.addEventListener('mouseenter', () => { cell.style.boxShadow = 'var(--shadow-md)'; cell.style.zIndex = '3'; });
      cell.addEventListener('mouseleave', () => { cell.style.boxShadow = ''; cell.style.zIndex = ''; });
    } else {
      // Salon libre
      cell.style.background = 'var(--bg)';
      cell.style.border = '1.5px dashed var(--sep)';
      cell.innerHTML = `
        <div style="text-align:center;padding:0 4px">
          <div style="font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.05em">${salon.lbl}</div>
          <div style="font-size:9px;color:var(--t4);margin-top:1px">2 pers.</div>
        </div>
      `;
      // Lecture seule — les salons côté transats reflètent le plan de salle
    }

    grid.appendChild(cell);
  });

  card.appendChild(grid);

  const seaDiv = document.createElement('div');
  seaDiv.className = 'beach-sea-label';
  seaDiv.textContent = '〰 MER MÉDITERRANÉE 〰';
  seaDiv.style.marginTop = '18px';
  card.appendChild(seaDiv);

  fc.appendChild(card);
}

function promptAddExtra(rowId){
  const blks=['g','m','d']; const lbls=['Bloc gauche (1–7)','Bloc milieu (8–12)','Bloc droite (13–20)'];
  const choice=parseInt(prompt(`Ajouter un transat dans la rangée ${rowId} :\n1. ${lbls[0]}\n2. ${lbls[1]}\n3. ${lbls[2]}\n\nEntrez 1, 2 ou 3 :`,'1'))-1;
  if(choice<0||choice>2) return;
  saveUndo(); const ek=`${rowId}_${blks[choice]}`; extraTransats[ek]=(extraTransats[ek]||0)+1; render();
}

function renderAlerts(){}

// ══════════════════════════════════════════
// DETAIL PANEL
// ══════════════════════════════════════════
function showDetail(id){
  selectedId=id;
  const r=gr().find(x=>x.id===id); if(!r) return;

  // Couleurs service
  const svcLabel=r.svc==='s1'?'S1':r.svc==='s2'?'S2':r.svc==='soir'?'Soir':r.svc==='soir2'?'Soir 2':'—';
  const svcCol=r.svc==='s1'?'var(--s1t)':r.svc==='s2'?'var(--s2t)':(r.svc==='soir'||r.svc==='soir2')?'var(--sot)':'var(--rtt)';
  const svcBg=r.svc==='s1'?'var(--s1bg)':r.svc==='s2'?'var(--s2bg)':(r.svc==='soir'||r.svc==='soir2')?'var(--sobg)':'var(--rtbg)';
  const svcBd=r.svc==='s1'?'var(--s1bd)':r.svc==='s2'?'var(--s2bd)':(r.svc==='soir'||r.svc==='soir2')?'var(--sobd)':'var(--rtbd)';
  const trCount=r.tr||0;

  // Statut
  let statusHTML;
  if(r.ns){
    statusHTML=`<div class="rp-status" style="background:var(--rbg);border-color:var(--rbd);color:var(--rt)"><div class="rp-status-dot" style="background:var(--red)"></div>No-show</div>`;
  } else if(r.urgent){
    statusHTML=`<div class="rp-status" style="background:var(--rbg);border-color:var(--rbd);color:var(--rt)"><div class="rp-status-dot" style="background:var(--red)"></div>Arrivée imminente</div>`;
  } else if(r.placed){
    const loc=currentTab===2?(r.slot>=1000?'Transat extra':`Transats ${r.slot}`):`T${r.tableId}`;
    statusHTML=`<div class="rp-status" style="background:var(--s1bg);border-color:var(--s1bd);color:var(--s1t)"><div class="rp-status-dot" style="background:var(--green)"></div>Placé · ${loc}</div>`;
  } else {
    statusHTML=`<div class="rp-status" style="background:var(--obg);border-color:var(--obd);color:var(--ot)"><div class="rp-status-dot" style="background:var(--orange)"></div>Non placé</div>`;
  }

  document.getElementById('rp-content').innerHTML=`
    ${statusHTML}
    <div class="det-name">${r.name}</div>
    <div class="det-row"><div class="det-label">PAX</div><div class="det-val">${r.pax}</div></div>
    ${!r.repas_transat?`<div class="det-row"><div class="det-label">Heure repas</div><div class="det-val">${r.time}</div></div>`:''}
    <div class="det-row"><div class="det-label">Service</div><div class="det-val" style="color:${svcCol};font-weight:800">${svcLabel}</div></div>
    ${trCount>0?`<div class="det-row"><div class="det-label">⛱ Transats</div><div class="det-val" style="font-weight:800;color:var(--rtt)">${trCount} transat${trCount>1?'s':''}</div></div>`:''}
    ${r.time_transats?`<div class="det-row"><div class="det-label">Heure transats</div><div class="det-val" style="color:var(--t3)">${r.time_transats}</div></div>`:''}
    ${r.comment?`<div class="det-row"><div class="det-label">Note</div><div class="det-val" style="color:var(--t3);font-size:11px">${r.comment}</div></div>`:''}
    ${(()=>{
      const tags=[];
      if(r.requested_table_id) tags.push(`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:var(--s1bg);border:0.5px solid var(--s1bd);color:var(--s1t)">🪑 Table ${r.requested_table_id} demandée</span>`);
      if(r.row_transats===500) tags.push(`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:#FFEAEA;border:0.5px solid #FF5555;color:#CC0000">🌊 1ère ligne mer</span>`);
      else if(r.row_transats===400) tags.push(`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:var(--rtbg);border:0.5px solid var(--rtbd);color:var(--rtt)">🌊 2ème ligne</span>`);
      else if(r.row_transats===300) tags.push(`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:var(--rtbg);border:0.5px solid var(--rtbd);color:var(--rtt)">🌊 Milieu</span>`);
      if(r.pref_extremite) tags.push(`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:var(--gdbg);border:0.5px solid var(--gdb);color:var(--gdt)">⟺ Extrémité</span>`);
      if(r.bed) tags.push(`<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:#FFF8E1;border:0.5px solid #FFD54F;color:#8A6200">🛏 Lit double</span>`);
      return tags.length?`<div class="det-row"><div class="det-label">Détecté</div><div class="det-val" style="display:flex;flex-wrap:wrap;gap:4px">${tags.join('')}</div></div>`:'';
    })()}
    ${r.repas_transat?`<div class="det-row"><div class="det-label">Type</div><div class="det-val"><span style="background:var(--rtbg);color:var(--rtt);border:0.5px solid var(--rtbd);border-radius:20px;padding:2px 8px;font-size:10px;font-weight:700">⛱ Repas transat</span></div></div>`:''}
    ${(!r.repas_transat&&trCount>0)?`<div class="det-row"><div class="det-label">Type</div><div class="det-val"><span style="background:var(--s1bg);color:var(--s1t);border:0.5px solid var(--s1bd);border-radius:20px;padding:2px 8px;font-size:10px;font-weight:700">🍽 + ⛱ Table & transats</span></div></div>`:''}`;

  const rpA=document.getElementById('rp-actions');
  rpA.style.display='flex'; rpA.innerHTML='';

  // Actions contextuelles selon l'état
  if(r.ns){
    // No-show → seule action utile = rétablir
    addRpBtn(rpA,'↩ Rétablir','rp-btn-retablir',()=>{saveUndo();r.ns=false;render();});
  } else {
    // Arrivé — marque urgent=false si urgent, sinon action visuelle positive
    if(r.urgent){
      addRpBtn(rpA,'✓ Marquer arrivé','rp-btn-arrive',()=>{saveUndo();r.urgent=false;render();});
    }
    // Libérer — seulement si placé
    if(r.placed){
      const isTr=currentTab===2;
      addRpBtn(rpA,isTr?'⛱ Libérer le transat':'↩ Libérer la table','rp-btn-liberer',()=>{
        saveUndo();r.placed=false;r.tableId=null;r.slot=null;selectedId=null;render();
      });
    }
    // No-show
    addRpBtn(rpA,'✗ No-show','rp-btn-noshow',()=>{
      saveUndo();r.ns=true;r.placed=false;r.tableId=null;r.slot=null;render();
    });
  }

  // Récap jour + Fiche client
  addRpBtn(rpA,'📋 Récap','rp-btn-recap',()=>showRecapModal(r));
  addRpBtn(rpA,'👤 Fiche client','rp-btn-client',()=>showClientModal(r));

  // Modifier
  addRpBtn(rpA,'✎ Modifier','rp-btn-edit',()=>openEditModal(id));

  // Supprimer — discret en bas
  addRpBtn(rpA,'Supprimer','rp-btn-delete',()=>{
    saveUndo();
    reservations[tk()]=reservations[tk()].filter(x=>x.id!==id);
    selectedId=null;
    document.getElementById('rp-content').innerHTML='<div class="rp-empty">Sélectionnez une réservation</div>';
    rpA.style.display='none';
    render();
  });

  renderSidebar();
  if(window.innerWidth <= 1099) openRightPanel();
}

function addRpBtn(container, label, cls, onclick){
  const b=document.createElement('button');
  b.className='rp-btn '+cls;
  b.textContent=label;
  b.onclick=onclick;
  container.appendChild(b);
}

// ── Modal overlay générique
function openOverlay(buildContent){
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){overlay.remove();document.removeEventListener('keydown',esc);}});
  const box=document.createElement('div');
  box.style.cssText='background:var(--card);border-radius:16px;border:0.5px solid var(--sep);padding:24px 28px;min-width:320px;max-width:500px;width:90vw;max-height:85vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.28)';
  buildContent(box, ()=>overlay.remove());
  overlay.appendChild(box); document.body.appendChild(overlay);
}

function showRecapModal(r){
  openOverlay((box, close)=>{
    const svcLabel=r.svc==='s1'?'Service 1':r.svc==='s2'?'Service 2':r.svc==='soir'?'Soir':r.svc==='soir2'?'Soir 2':'Transats';
    const placedLine = r.placed
      ? (currentTab===2 ? (r.slot>=1000?'Extra':String(r.slot)) : 'Table '+r.tableId)
      : '—';
    // Cherche la sous-resa transat liée (zenchef_id + '_tr')
    const linkedTr = r.zenchef_id
      ? [...reservations.s1,...reservations.s2,...reservations.soir,...(reservations.soir2||[]),...reservations.transats]
          .find(x=>x.zenchef_id===r.zenchef_id+'_tr')
      : null;
    const trTotal = r.tr || (linkedTr ? linkedTr.tr : 0) || 0;
    const row=(label,val)=>val?`<div class="det-row"><div class="det-label">${label}</div><div class="det-val">${val}</div></div>`:'';
    box.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div style="font-size:15px;font-weight:800;color:var(--t1)">📋 Récap — ${r.name}</div>
        <button onclick="this.closest('[style*=fixed]').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--t3);line-height:1">✕</button>
      </div>
      ${row('Date', currentDate)}
      ${row('Heure', r.time)}
      ${row('PAX', r.pax)}
      ${row('Service', svcLabel)}
      ${trTotal>0?row('⛱ Transats', trTotal+' transat'+(trTotal>1?'s':'')):''}
      ${row('Placement', placedLine)}
      ${r.phone?row('Tél',r.phone):''}
      ${r.email?row('Email',`<span style="font-size:11px">${r.email}</span>`):''}
      ${r.comment?`<div class="det-row" style="align-items:flex-start"><div class="det-label" style="padding-top:2px">Note</div><div class="det-val" style="font-size:12px;color:var(--t3);white-space:pre-wrap;word-break:break-word">${r.comment}</div></div>`:''}
    `;
  });
}

function showClientModal(r){
  openOverlay((box, close)=>{
    box.innerHTML=`<div style="font-size:15px;font-weight:800;color:var(--t1);margin-bottom:16px">👤 ${r.name}</div>
      ${r.phone?`<div style="font-size:12px;color:var(--t3);margin-bottom:4px">📞 ${r.phone}</div>`:''}
      ${r.email?`<div style="font-size:12px;color:var(--t3);margin-bottom:12px">✉ ${r.email}</div>`:''}
      <div style="font-size:12px;color:var(--t3);text-align:center;padding:12px 0">Recherche dans l'historique…</div>`;

    // Scan async (setTimeout pour laisser le modal s'afficher)
    setTimeout(()=>{
      const history=[];
      const keys=Object.keys(localStorage).filter(k=>k.startsWith('playa_zc_'));
      for(const key of keys){
        try{
          const parsed=JSON.parse(localStorage.getItem(key));
          const data=parsed.data||[];
          data.forEach(b=>{
            const match=(r.phone&&b.phone_number===r.phone)||(r.email&&b.email===r.email&&r.email)||
              (!r.phone&&!r.email&&b.lastname&&r.name.toLowerCase().includes(b.lastname.toLowerCase())&&b.lastname.length>2);
            if(match) history.push({date:b.shift_date||b.day||key.replace('playa_zc_',''),time:(b.time||'').substring(0,5),pax:b.nb_guests||1,status:b.status||''});
          });
        }catch(e){}
      }
      history.sort((a,b)=>b.date.localeCompare(a.date));
      const totalVisits=history.length;
      const totalPax=history.reduce((s,x)=>s+x.pax,0);
      const noShows=history.filter(x=>['noshow','no_show_cancelled'].includes(x.status)).length;
      const histHTML=history.slice(0,30).map(h=>`
        <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:0.5px solid var(--sep2)">
          <div style="font-size:11px;font-weight:700;color:var(--t3);min-width:84px">${h.date}</div>
          <div style="font-size:12px;color:var(--t2);min-width:38px">${h.time}</div>
          <div style="font-size:13px;font-weight:800;color:var(--t1)">${h.pax} PAX</div>
          <div style="margin-left:auto;font-size:10px;font-weight:700;color:${['noshow','no_show_cancelled'].includes(h.status)?'var(--red)':'var(--green)'}">${['noshow','no_show_cancelled'].includes(h.status)?'No-show':'✓'}</div>
        </div>`).join('');
      box.innerHTML=`
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div style="font-size:15px;font-weight:800;color:var(--t1)">👤 ${r.name}</div>
          <button onclick="this.closest('[style*=fixed]').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--t3);line-height:1">✕</button>
        </div>
        ${r.phone?`<div style="font-size:12px;color:var(--t3);margin-bottom:4px">📞 ${r.phone}</div>`:''}
        ${r.email?`<div style="font-size:12px;color:var(--t3);margin-bottom:14px">✉ ${r.email}</div>`:''}
        <div style="display:flex;gap:12px;margin-bottom:16px">
          <div style="flex:1;background:var(--bg);border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:900;color:var(--blue)">${totalVisits}</div>
            <div style="font-size:9px;color:var(--t3);font-weight:700;margin-top:3px;text-transform:uppercase;letter-spacing:.06em">Visites</div>
          </div>
          <div style="flex:1;background:var(--bg);border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:900;color:var(--blue)">${totalVisits?Math.round(totalPax/totalVisits):0}</div>
            <div style="font-size:9px;color:var(--t3);font-weight:700;margin-top:3px;text-transform:uppercase;letter-spacing:.06em">PAX moy.</div>
          </div>
          ${noShows?`<div style="flex:1;background:var(--rbg);border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:900;color:var(--red)">${noShows}</div>
            <div style="font-size:9px;color:var(--red);font-weight:700;margin-top:3px;text-transform:uppercase;letter-spacing:.06em">No-shows</div>
          </div>`:''}
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Historique${history.length>30?' (30 dernières)':''}</div>
        ${history.length?histHTML:'<div style="color:var(--t4);font-size:12px;padding:12px 0;text-align:center">Aucun historique trouvé dans le cache</div>'}
      `;
    },50);
  });
}

// ── Modification d'une résa existante
let editingId = null;

function openEditModal(id){
  const r=gr().find(x=>x.id===id); if(!r) return;
  editingId=id;

  // Changer le titre de la modal
  document.querySelector('.modal-title').textContent='Modifier la réservation';
  document.querySelector('.modal-submit').textContent='Enregistrer';

  // Pré-remplir tous les champs
  document.getElementById('f-name').value = r.name;
  document.getElementById('f-pax').value = r.pax;
  document.getElementById('f-phone').value = r.phone||'';
  document.getElementById('f-comment').value = r.comment||'';

  if(r.repas_transat || currentTab===2){
    // Repas transat
    selectType('rt');
    document.getElementById('f-time-rt').value = r.time||'';
    document.getElementById('f-tr-rt').value = r.tr||r.pax||'';
  } else {
    // Repas en salle
    selectType('salle');
    selectSvc(r.svc||'s1');
    document.getElementById('f-time').value = r.time||'';
    document.getElementById('f-tr').value = r.tr||'';
  }

  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(()=>document.getElementById('f-name').focus(),100);
}

// ══════════════════════════════════════════
// ACTION SHEET — UX Tablette
// ══════════════════════════════════════════
function showActionSheet(title, actions){
  const ex=document.getElementById('action-sheet-overlay'); if(ex) ex.remove();
  if(navigator.vibrate) navigator.vibrate(14);

  const ov=document.createElement('div');
  ov.id='action-sheet-overlay';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.38);display:flex;align-items:flex-end;justify-content:center';

  const sheet=document.createElement('div');
  sheet.style.cssText='background:var(--card);border-radius:20px 20px 0 0;width:100%;max-width:520px;padding-bottom:env(safe-area-inset-bottom,12px);box-shadow:0 -8px 48px rgba(0,0,0,.22);transform:translateY(100%);transition:transform .24s cubic-bezier(.2,.85,.4,1)';

  // Handle
  const bar=document.createElement('div');
  bar.style.cssText='width:40px;height:4px;background:var(--sep2);border-radius:2px;margin:12px auto 0';
  sheet.appendChild(bar);

  // Titre
  if(title){
    const ttl=document.createElement('div');
    ttl.style.cssText='font-size:13px;font-weight:800;color:var(--t2);padding:14px 20px 10px;border-bottom:0.5px solid var(--sep)';
    ttl.textContent=title;
    sheet.appendChild(ttl);
  }

  // Boutons d'action
  actions.forEach(({label,icon,color,action})=>{
    const btn=document.createElement('button');
    btn.style.cssText=`width:100%;padding:17px 22px;border:none;background:transparent;text-align:left;font-size:16px;font-weight:500;color:${color||'var(--t1)'};cursor:pointer;display:flex;align-items:center;gap:14px;font-family:inherit;border-bottom:0.5px solid var(--sep)`;
    btn.innerHTML=`<span style="width:26px;font-size:19px;text-align:center">${icon||''}</span><span>${label}</span>`;
    btn.addEventListener('click',()=>{ ov.remove(); action(); });
    sheet.appendChild(btn);
  });

  // Annuler
  const cancel=document.createElement('button');
  cancel.style.cssText='width:calc(100% - 24px);margin:10px 12px;padding:16px;border-radius:14px;border:none;background:var(--bg);font-size:16px;font-weight:700;color:var(--t2);cursor:pointer;font-family:inherit;display:block';
  cancel.textContent='Annuler';
  cancel.addEventListener('click',()=>ov.remove());
  sheet.appendChild(cancel);

  ov.appendChild(sheet);
  ov.addEventListener('click',(e)=>{ if(e.target===ov) ov.remove(); });
  document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ov.remove();document.removeEventListener('keydown',esc);} });
  document.body.appendChild(ov);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ sheet.style.transform='translateY(0)'; }));
}

function showResaActionSheet(r){
  if(touchDragActive) return; // user is dragging, not long-pressing
  const actions=[];
  if(!r.ns){
    if(r.placed){
      actions.push({label:currentTab===2?'Libérer le transat':'Libérer la table',icon:'↩',action:()=>{ saveUndo();r.placed=false;r.tableId=null;r.slot=null;render(); }});
    }
    actions.push({label:'No-show',icon:'✗',color:'var(--orange)',action:()=>{ saveUndo();r.ns=true;r.placed=false;r.tableId=null;r.slot=null;render(); }});
  } else {
    actions.push({label:'Rétablir',icon:'↩',action:()=>{ saveUndo();r.ns=false;render(); }});
  }
  actions.push({label:'Modifier',icon:'✎',action:()=>openEditModal(r.id)});
  actions.push({label:'Supprimer',icon:'🗑',color:'var(--red)',action:()=>{
    if(!confirm('Supprimer '+r.name+' ?')) return;
    saveUndo();
    reservations[tk()]=reservations[tk()].filter(x=>x.id!==r.id);
    selectedId=null; render();
  }});
  showActionSheet(r.name+' · '+r.pax+' PAX', actions);
}


// ══════════════════════════════════════════
// TOUCH DRAG — UX Tablette
// Long press (400ms) sur une carte sidebar → drag vers table/transat
// ══════════════════════════════════════════
function initTouchDrag(){
  let src = null; // { id, el, startX, startY, timer, dragReady }
  let ghost = null;
  let lastTarget = null;

  function startGhost(el, x, y){
    if(navigator.vibrate) navigator.vibrate(30);
    touchDragActive = true;
    dragId = parseInt(src.id, 10);
    const rect = el.getBoundingClientRect();
    ghost = el.cloneNode(true);
    ghost.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;opacity:.88;z-index:9999;pointer-events:none;border-radius:10px;box-shadow:0 10px 32px rgba(0,0,0,.22);transform:scale(1.05) translateY(-4px);transition:none`;
    document.body.appendChild(ghost);
    el.style.opacity = '.3';
  }

  function cleanup(){
    if(ghost){ ghost.remove(); ghost = null; }
    if(src){ src.el.style.opacity = ''; }
    if(lastTarget){ lastTarget.classList.remove('dropping','TR-drop'); lastTarget = null; }
    touchDragActive = false;
    dragId = null;
    src = null;
  }

  function elUnder(x, y){
    if(ghost) ghost.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    if(ghost) ghost.style.display = '';
    if(!el) return null;
    return el.closest('[data-tid]') || el.closest('[data-slot]') || el.closest('[data-fgid]');
  }

  document.addEventListener('touchstart', e => {
    const card = e.target.closest('.rc[data-id]');
    if(!card) return;
    const id = card.dataset.id;
    if(!id) return;
    const t = e.touches[0];
    src = {
      id, el: card,
      startX: t.clientX, startY: t.clientY, dragReady: false,
      timer: setTimeout(() => {
        if(src && src.id === id){ src.dragReady = true; }
      }, 400)
    };
  }, {passive:false});

  document.addEventListener('touchmove', e => {
    if(!src) return;
    const t = e.touches[0];
    const dx = t.clientX - src.startX, dy = t.clientY - src.startY;
    const dist = Math.hypot(dx, dy);

    if(!touchDragActive){
      if(src.dragReady && dist > 12){
        // Long press done + finger moving → start drag
        e.preventDefault();
        startGhost(src.el, t.clientX, t.clientY);
        // fall through to ghost movement below
      } else if(!src.dragReady && dist > 14){
        // Moved too early → cancel (let scroll happen)
        clearTimeout(src.timer);
        src = null;
        return;
      } else {
        return;
      }
    }

    e.preventDefault();
    ghost.style.left = (t.clientX - ghost.offsetWidth / 2) + 'px';
    ghost.style.top  = (t.clientY - 30) + 'px';

    const target = elUnder(t.clientX, t.clientY);
    if(lastTarget && lastTarget !== target) lastTarget.classList.remove('dropping','TR-drop');
    if(target){
      if(target.dataset.tid || target.dataset.fgid) target.classList.add('dropping');
      else if(target.dataset.slot) target.classList.add('TR-drop');
      lastTarget = target;
    } else { lastTarget = null; }
  }, {passive:false});

  function onTouchEnd(e){
    if(!src){ return; }
    clearTimeout(src.timer);

    if(!touchDragActive){ src = null; return; }

    const t = e.changedTouches[0];
    const target = elUnder(t.clientX, t.clientY);
    const savedId = dragId;
    cleanup();

    if(!target || !savedId) return;
    const dr = gr().find(r => r.id === savedId);
    if(!dr) return;

    if(target.dataset.fgid){
      const fg = (fused[tk()]||[]).find(g => g.id === target.dataset.fgid);
      if(!fg) return;
      saveUndo();
      fg.tids.forEach(tid => { gr().forEach(x => { if(x.id !== dr.id && x.tableId === tid){ x.placed=false; x.tableId=null; } }); });
      dr.placed = true; dr.tableId = fg.tids[0]; selectedId = dr.id;
    } else if(target.dataset.tid){
      const tid = parseInt(target.dataset.tid);
      saveUndo();
      gr().forEach(x => { if(x.id !== dr.id && x.tableId === tid){ x.placed=false; x.tableId=null; } });
      dr.placed = true; dr.tableId = tid; selectedId = dr.id;
    } else if(target.dataset.slot){
      const slot = parseInt(target.dataset.slot);
      saveUndo();
      dr.placed = true; dr.slot = slot; dr.extraSlots = null; selectedId = dr.id;
    }
    render();
  }

  document.addEventListener('touchend', onTouchEnd, {passive:true});
  document.addEventListener('touchcancel', () => { clearTimeout(src && src.timer); cleanup(); }, {passive:true});
}

function showFusedDetail(fg){
  const tDefs=fg.tids.map(id=>TABLE_DATA[id]).filter(Boolean);
  const totalCap=tDefs.reduce((s,t)=>s+t.hi,0);
  document.getElementById('rp-content').innerHTML=`
    <div class="rp-status" style="background:var(--pbg);border-color:var(--pbd);color:var(--pt)"><div class="rp-status-dot" style="background:var(--purple)"></div>Groupe fusionné</div>
    <div class="det-name">T${fg.tids.join('-')}</div>
    <div class="det-row"><div class="det-label">Capacité</div><div class="det-val">${totalCap}p</div></div>
    <div class="det-row"><div class="det-label">Tables</div><div class="det-val">${fg.tids.join(', ')}</div></div>`;
  const rpA=document.getElementById('rp-actions'); rpA.style.display='flex'; rpA.innerHTML='';
  addRpBtn(rpA,'⊘ Défusionner','rp-btn-defusion',()=>{saveUndo();fused[tk()]=fused[tk()].filter(g=>g.id!==fg.id);render();});
  if(window.innerWidth <= 1099) openRightPanel();
}

// ══ RESPONSIVE PANEL ══
function openRightPanel(){
  document.getElementById('right-panel').classList.add('open');
  document.getElementById('rp-backdrop').classList.add('open');
}
function closeRightPanel(){
  document.getElementById('right-panel').classList.remove('open');
  document.getElementById('rp-backdrop').classList.remove('open');
}

// ══ MOBILE VIEW TOGGLE ══
let _mobileView='list';
function mobileToggleView(){
  if(typeof currentModule !== 'undefined' && currentModule !== 'service'){
    goModule('service');
    const sidebar=document.getElementById('sidebar');
    const canvas=document.getElementById('canvas');
    const fab=document.getElementById('mobile-toggle-fab');
    sidebar.classList.add('mob-hidden');
    canvas.classList.add('mob-active');
    _mobileView='plan';
    if(fab) fab.textContent='≡';
    return;
  }
  _mobileView=_mobileView==='list'?'plan':'list';
  const sidebar=document.getElementById('sidebar');
  const canvas=document.getElementById('canvas');
  const fab=document.getElementById('mobile-toggle-fab');
  if(_mobileView==='plan'){
    sidebar.classList.add('mob-hidden');
    canvas.classList.add('mob-active');
    if(fab) fab.textContent='≡';
  } else {
    sidebar.classList.remove('mob-hidden');
    canvas.classList.remove('mob-active');
    if(fab) fab.textContent='⊞';
  }
}

// ══ MOBILE TAB SWITCH ══
function mobileSwitchTab(i){
  if(typeof currentModule !== 'undefined' && currentModule !== 'service') goModule('service');
  switchTab(i);
  document.querySelectorAll('.bttab').forEach((t,j)=>{
    t.classList.remove('bttab-on');
    if(j===i) t.classList.add('bttab-on');
  });
}

