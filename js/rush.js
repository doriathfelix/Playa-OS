// ══════════════════════════════════════════
// RUSH MODE OVERLAY
// ══════════════════════════════════════════
function toggleRushMode(){
  rushMode=!rushMode;
  document.getElementById('rush-banner').className=rushMode?'on':'';
  document.getElementById('rush-btn').className='ib '+(rushMode?'rush-on':'');
  document.getElementById('rush-overlay').className=rushMode?'on':'';
  document.getElementById('ro-tab-label').textContent=TAB_LABELS[currentTab];
  if(rushMode) renderRushOverlay();
}

function renderRushOverlay(){
  const resas=gr(); const tMap={};
  resas.forEach(r=>{if(r.placed&&r.tableId)tMap[r.tableId]=r;});
  const floor=document.getElementById('ro-floor'); floor.innerHTML='';
  const resaList=document.getElementById('ro-resas'); resaList.innerHTML='';
  // Floor — Rush mode : toutes les tables en grille simple
  const t=document.createElement('div');t.innerHTML='<div class="ro-section-title">Plan de salle</div>';
  const grid=document.createElement('div');grid.className='ro-tbl-grid';
  Object.entries(TABLE_DATA).forEach(([idStr,d])=>{
    const tbl={id:+idStr,...d};
    const r=tMap[tbl.id];
    const cell=document.createElement('div');
    cell.className='ro-tbl'+(r?r.urgent?' ro-urg':' ro-occ':'')+(tbl.p?' ro-prio':'');
      if(r){cell.innerHTML=`<div class="ro-tbl-num">${tbl.id}</div><div class="ro-tbl-nm">${r.name}</div><div class="ro-pax-b${r.urgent?' u':''}">${r.pax}</div>`;}
      else{cell.innerHTML=`<div class="ro-tbl-num">${tbl.id}</div>`;}
      cell.addEventListener('dragover',e=>{e.preventDefault();cell.style.borderColor='var(--blue)'});
      cell.addEventListener('dragleave',()=>cell.style.borderColor='');
      cell.addEventListener('drop',e=>{
        e.preventDefault();cell.style.borderColor='';
        if(!dragId)return;saveUndo();
        const dr=gr().find(x=>x.id===dragId);if(!dr)return;
        gr().forEach(x=>{if(x.id!==dr.id&&x.tableId===tbl.id){x.placed=false;x.tableId=null;}});
        dr.placed=true;dr.tableId=tbl.id;dragId=null;render();renderRushOverlay();
      });
      grid.appendChild(cell);
  });
  t.appendChild(grid); floor.appendChild(t);
  // Resas
  const title=document.createElement('div');title.className='ro-section-title';title.textContent='Réservations';
  resaList.appendChild(title);
  sortByTime(resas).forEach(r=>{
    if(r.ns)return;
    const d=document.createElement('div');
    d.className='ro-rc'+(r.urgent?' ro-rc-urgent':'')+(r.placed?' ro-rc-placed':'');
    d.draggable=true;d.dataset.id=r.id;
    d.innerHTML=`<div class="ro-rc-name">${r.urgent?'⚡ ':''} ${r.name}</div><div class="ro-rc-info">${r.pax} PAX · ${r.time}${r.comment?' · '+r.comment:''}</div>${r.placed?`<div class="ro-rc-tag">T${r.tableId}</div>`:''}`;
    d.addEventListener('dragstart',e=>{dragId=r.id;e.dataTransfer.effectAllowed='move'});
    d.addEventListener('dragend',()=>dragId=null);
    resaList.appendChild(d);
  });
}

// ══════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════
function switchTab(i){
  currentTab=i;
  document.querySelectorAll('.tab').forEach((t,j)=>{
    t.classList.remove('on');
    if(j===i) t.classList.add('on');
  });
  document.getElementById('search-input').value='';
  selectedId=null; fuseMode=false; fuseTargets=[];
  document.getElementById('rp-content').innerHTML='<div class="rp-empty">Tap sur une réservation</div>';
  document.getElementById('rp-actions').style.display='none';
  const btn=document.getElementById('fuse-btn');
  btn.className='tbtn tbtn-fuse'; btn.textContent='⊕ Fusionner'; btn.onclick=toggleFuse;
  // modal service pré-sélectionné à l'ouverture via openModal()
  if(rushMode){document.getElementById('ro-tab-label').textContent=TAB_LABELS[i];renderRushOverlay();}
  render();
}

