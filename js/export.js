// ══════════════════════════════════════════
// PRINT — Plan de salle & Plan de transats
// ══════════════════════════════════════════

function openPrintWindow(html){
  const win = window.open('', '_blank', 'width=1100,height=820');
  if(!win){ toast('Popup bloqué — autorise les popups pour cette page'); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

function fmtDateLong(dateStr){
  const d = new Date(dateStr + 'T12:00:00');
  const D = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const M = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return D[d.getDay()] + ' ' + d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear();
}

// ══════════════════════════════════════════
// PRINT PLAN DE SALLE — liste ordonnée T1→T30→Salons
// ══════════════════════════════════════════
function printFloorPlan(){
  const dateStr = fmtDateLong(currentDate);
  const now = new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  const allResas = [...reservations.s1,...reservations.s2,...reservations.soir];
  const placed   = allResas.filter(r => r.placed && !r.ns);
  const unplaced = allResas.filter(r => !r.placed && !r.ns);
  const totalPax = placed.reduce((s,r) => s + r.pax, 0);

  // tableId → resa
  const tMap = {};
  placed.forEach(r => { if(r.tableId) tMap[r.tableId] = r; });

  // Toutes les fusions (S1 + S2 + Soir)
  const allFused = [...(fused.s1||[]),...(fused.s2||[]),...(fused.soir||[])];

  // ── Construire la liste ordonnée : T1 à T30 (en résolvant les fusions), puis Salons
  const sortedIds = Object.keys(TABLE_DATA).map(Number).sort((a,b)=>a-b);
  const rendered  = new Set();
  const rows = [];

  sortedIds.forEach(id => {
    if(rendered.has(id)) return;
    const fg = allFused.find(f => f.tids.includes(id));
    if(fg){
      if(!rendered.has(fg.tids[0])){
        const r = fg.tids.map(t => tMap[t]).find(x => x);
        rows.push({ label: fg.tids.map(t=>'T'+t).join(' · '), resa: r || null, salon: false });
        fg.tids.forEach(t => rendered.add(t));
      }
    } else {
      rows.push({ label: 'T' + id, resa: tMap[id] || null, salon: false });
      rendered.add(id);
    }
  });

  // Salons (transats slot 1001-1004)
  const salonResaMap = {};
  reservations.transats
    .filter(r => r.placed && r.slot >= 1001 && r.slot <= 1004 && !r.ns)
    .forEach(r => { salonResaMap[r.slot] = r; });
  SALON_SLOTS.forEach(salon => {
    rows.push({ label: salon.lbl, resa: salonResaMap[salon.id] || null, salon: true });
  });

  // ── Couleurs par service
  const SVC = {
    s1:   { bg:'#F0FBF3', left:'#22C55E', tx:'#155724', dot:'#22C55E', lbl:'S1'   },
    s2:   { bg:'#EEF8FF', left:'#0EA5E9', tx:'#075985', dot:'#0EA5E9', lbl:'S2'   },
    soir: { bg:'#F3EEFF', left:'#8B5CF6', tx:'#4C1D95', dot:'#8B5CF6', lbl:'Soir' },
    urg:  { bg:'#FFF4F4', left:'#FF3B30', tx:'#B02020', dot:'#FF3B30', lbl:'⚡'   },
    free: { bg:'transparent', left:'#E5E5EA', tx:'#C7C7CC', dot:'', lbl:'' },
  };
  function svc(r){
    if(!r) return SVC.free;
    if(r.urgent) return SVC.urg;
    return SVC[r.svc] || SVC.s1;
  }

  // ── Séparateur Salons
  const salonStart = rows.findIndex(r => r.salon);

  let rowsHtml = '';
  rows.forEach((row, i) => {
    const r = row.resa;
    const s = svc(r);

    // Séparateur avant les Salons
    if(i === salonStart){
      rowsHtml += `<tr><td colspan="5" style="padding:8px 0 4px;border:none">
        <div style="border-top:1.5px dashed #E5E5EA;position:relative">
          <span style="position:absolute;left:0;top:-9px;background:#fff;padding:0 8px;font-size:9px;font-weight:700;color:#8E8E93;text-transform:uppercase;letter-spacing:.1em">Salons</span>
        </div>
      </td></tr>`;
    }

    if(!r){
      // Table libre — ligne très sobre
      rowsHtml += `<tr style="border-bottom:1px solid #F5F5F7">
        <td style="padding:9px 14px;font-size:13px;font-weight:400;color:#D1D1D6;font-family:'Courier New',monospace">—</td>
        <td style="padding:9px 14px;font-size:13px;font-weight:700;color:#D1D1D6;font-family:'Courier New',monospace">${row.label}</td>
        <td style="padding:9px 14px;font-size:12px;color:#D1D1D6;font-style:italic">Libre</td>
        <td style="padding:9px 14px;text-align:right;color:#D1D1D6">—</td>
        <td style="padding:9px 14px"></td>
      </tr>`;
    } else {
      const rtBadge = r.repas_transat
        ? `<span style="display:inline-block;background:#0D9488;color:#fff;font-size:9px;font-weight:800;padding:1px 6px;border-radius:20px;margin-left:6px;vertical-align:middle">RT</span>` : '';
      const dot = `<span style="display:inline-block;width:9px;height:9px;background:${s.dot};border-radius:50%;margin-right:6px;flex-shrink:0"></span>`;
      const note = r.comment ? `<div style="font-size:10px;color:${s.tx};opacity:.6;margin-top:2px;font-style:italic">${r.comment}</div>` : '';

      rowsHtml += `<tr style="background:${s.bg};border-bottom:1px solid rgba(0,0,0,.04);border-left:4px solid ${s.left}">
        <td style="padding:10px 14px;font-size:11px;font-weight:500;color:${s.tx};opacity:.7;font-family:'Courier New',monospace;white-space:nowrap">${r.time}</td>
        <td style="padding:10px 14px;font-size:22px;font-weight:900;color:${s.tx};font-family:'Courier New',monospace;white-space:nowrap;letter-spacing:-.02em">${row.label}</td>
        <td style="padding:10px 14px">
          <div style="display:flex;align-items:center;font-size:15px;font-weight:600;color:${s.tx}">${r.name}${rtBadge}</div>
          ${note}
        </td>
        <td style="padding:10px 18px;text-align:right;font-size:17px;font-weight:800;color:${s.tx};white-space:nowrap">${r.pax}<span style="font-size:11px;font-weight:500;margin-left:1px">p</span></td>
        <td style="padding:10px 14px;text-align:center">
          <div style="display:inline-flex;align-items:center;background:${s.dot};color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:20px;letter-spacing:.04em">${dot.replace('margin-right:6px','margin-right:4px')}${s.lbl}</div>
        </td>
      </tr>`;
    }
  });

  // Unplaced
  let unplacedHtml = '';
  if(unplaced.length){
    unplacedHtml = `<div style="background:#FFFBEB;border:1.5px solid #FCD34D;border-radius:10px;padding:12px 16px;margin-top:14px">
      <div style="font-size:11px;font-weight:700;color:#78350F;margin-bottom:8px">⚠ Non encore placées — ${unplaced.length} réservation${unplaced.length>1?'s':''}</div>
      ${unplaced.map(r => {
        const s = svc(r);
        return `<div style="display:flex;align-items:center;gap:12px;padding:6px 0;border-bottom:1px solid #FDE68A">
          <span style="font-size:14px;font-weight:800;color:#92400E;font-family:'Courier New',monospace;min-width:52px">${r.time}</span>
          <span style="font-size:15px;font-weight:700;color:#78350F;flex:1">${r.name}</span>
          <span style="font-size:16px;font-weight:900;color:#92400E">${r.pax}p</span>
          <span style="background:${s.dot};color:#fff;font-size:9px;font-weight:800;padding:2px 8px;border-radius:20px">${s.lbl}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan de salle — La Playa</title>
<style>
@page { size: A4 portrait; margin: 12mm 14mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1C1C1E; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.no-print { margin-bottom: 14px; }
@media print { .no-print { display: none !important; } }
.btn { padding: 9px 22px; background: #1C1C1E; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; margin-right: 8px; }
.hd { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 10px; border-bottom: 3px solid #1C1C1E; margin-bottom: 14px; }
.title { font-size: 21px; font-weight: 800; letter-spacing: -.03em; }
.sub { font-size: 10px; color: #8E8E93; margin-top: 3px; }
.stats { display: flex; gap: 8px; }
.stat { background: #F2F2F7; border-radius: 8px; padding: 6px 14px; text-align: center; min-width: 68px; }
.stat-v { font-size: 21px; font-weight: 800; line-height: 1; }
.stat-l { font-size: 8px; text-transform: uppercase; letter-spacing: .07em; color: #8E8E93; margin-top: 2px; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: #1C1C1E; }
th { padding: 9px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: .1em; }
th:nth-child(4) { text-align: right; } th:nth-child(5) { text-align: center; }
.footer { margin-top: 12px; font-size: 8px; color: #C7C7CC; text-align: center; }
</style></head><body>
<div class="no-print">
  <button class="btn" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn" style="background:#3C3C43" onclick="window.close()">✕ Fermer</button>
</div>
<div class="hd">
  <div>
    <div class="title">La Playa · Plan de salle</div>
    <div class="sub">${dateStr} · Édité ${now}</div>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-v">${allResas.filter(r=>!r.ns).length}</div><div class="stat-l">Resas</div></div>
    <div class="stat"><div class="stat-v" style="color:#155724">${placed.length}</div><div class="stat-l">Placées</div></div>
    <div class="stat"><div class="stat-v" style="color:#075985">${totalPax}</div><div class="stat-l">PAX</div></div>
    ${unplaced.length ? `<div class="stat"><div class="stat-v" style="color:#92400E">${unplaced.length}</div><div class="stat-l">⚠ À placer</div></div>` : ''}
  </div>
</div>
<table>
  <thead>
    <tr>
      <th style="width:88px">Heure</th>
      <th style="width:110px">Table</th>
      <th>Nom</th>
      <th style="width:64px">PAX</th>
      <th style="width:72px">Service</th>
    </tr>
  </thead>
  <tbody>${rowsHtml}</tbody>
</table>
${unplacedHtml}
<div class="footer">La Playa en Camargue · Document interne · ${dateStr}</div>
</body></html>`;

  openPrintWindow(html);
}


// ══════════════════════════════════════════
// PRINT PLAN DE TRANSATS — fond blanc, lisible, blocs g/m/d séparés
// ══════════════════════════════════════════
function printTransats(){
  const dateStr = fmtDateLong(currentDate);

  const W=10.8, GAP=1.2, ALLEY=5, LBL=14;

  // Fond blanc uniforme, distinction par pastille texte uniquement
  const C = {
    s1:   {bg:'#FFFFFF', tx:'#111', lbl:'S1',   bw:'0.6pt'},
    s2:   {bg:'#FFFFFF', tx:'#111', lbl:'S2',   bw:'0.6pt'},
    soir: {bg:'#FFFFFF', tx:'#111', lbl:'Soir', bw:'0.6pt'},
    rt:   {bg:'#FFFFFF', tx:'#111', lbl:'RT',   bw:'1.4pt'},
  };
  function cFor(r){ return r.repas_transat ? C.rt : C[r.svc] || C.s1; }

  function sCol(slot){
    const pos = slot - Math.floor(slot/100)*100;
    if(pos>=1&&pos<=7)  return 1+pos;
    if(pos>=8&&pos<=13) return 2+pos;
    return 3+pos;
  }
  function slotLbl(slot){
    const BL={220:'219',221:'220',222:'221'};
    if(BED_SLOTS.includes(slot)) return BL[slot]||String(slot);
    const base=Math.floor(slot/100)*100, pos=slot-base;
    if(pos===13) return (base+12)+'bis';
    if(pos>=14)  return String(base+pos-1);
    return String(slot);
  }

  const placed = reservations.transats.filter(r=>r.placed&&!r.ns&&(r.slot||0)<1001);
  const unplcd = reservations.transats.filter(r=>!r.placed&&!r.ns);
  const slotMap={};
  placed.forEach(resa=>{
    const isBed=BED_SLOTS.includes(resa.slot);
    const slots=(resa.extraSlots&&resa.extraSlots.length)?resa.extraSlots
      :isBed?[resa.slot]
      :Array.from({length:resa.tr||1},(_,i)=>(resa.slot||0)+i);
    slots.forEach(s=>{if(!slotMap[s])slotMap[s]=resa;});
  });
  const salonResaMap={};
  ['s1','s2','soir'].forEach(svc=>{
    (reservations[svc]||[]).forEach(r=>{
      if(r.placed&&!r.ns&&r.tableId>=1001&&r.tableId<=1004)
        if(!salonResaMap[r.tableId]) salonResaMap[r.tableId]=r;
    });
  });
  reservations.transats.filter(r=>r.placed&&!r.ns&&(r.slot||0)>=1001&&(r.slot||0)<=1004)
    .forEach(r=>{if(!salonResaMap[r.slot])salonResaMap[r.slot]=r;});

  const allTr  = reservations.transats.filter(r=>!r.ns);
  const nbSlots= placed.reduce((s,r)=>s+(r.tr||1),0);
  const nbRT   = allTr.filter(r=>r.repas_transat).length;
  const nbS1   = placed.filter(r=>r.svc==='s1'  &&!r.repas_transat).reduce((s,r)=>s+(r.tr||1),0);
  const nbS2   = placed.filter(r=>r.svc==='s2'  &&!r.repas_transat).reduce((s,r)=>s+(r.tr||1),0);
  const nbSoir = placed.filter(r=>r.svc==='soir'&&!r.repas_transat).reduce((s,r)=>s+(r.tr||1),0);

  // ── Slot vide : CSS pur, bordure fine constante
  function emptySlot(slot, gridRow){
    const isBed=BED_SLOTS.includes(slot);
    return `<div style="grid-column:${sCol(slot)};grid-row:${gridRow};background:#F5F5F5;border:0.5pt solid #D8D8D8;border-radius:1.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden">
      ${isBed?`<div style="font-size:4.5pt;font-weight:800;color:#BBBBBB;line-height:1">BED</div>`:''}
      <div style="font-size:4.5pt;color:#BBBBBB;font-weight:500;line-height:1">${slotLbl(slot)}</div>
    </div>`;
  }

  // ── Bloc resa : CSS pur — bordures fines et constantes quelle que soit la hauteur
  function resaBlock(resa, cMin, cMax, gridRow){
    const N   = cMax-cMin+1;
    const c   = cFor(resa);
    const tot = resa.tr||N;
    const totalW = N*W+(N-1)*GAP;

    // Outlines individuels : div absolus positionnés en % → épaisseur CSS constante
    const slotOutlines = Array.from({length:N}, (_,i) => {
      const lPct = (i*(W+GAP)/totalW*100).toFixed(2);
      const wPct = (W/totalW*100).toFixed(2);
      return `<div style="position:absolute;left:${lPct}%;top:5%;width:${wPct}%;height:90%;border:0.35pt solid #C0C0C0;border-radius:1mm;pointer-events:none"></div>`;
    }).join('');

    const fsName = N>=5?'8.5pt':N>=3?'7pt':N>=2?'6pt':'4.5pt';
    const fsCnt  = N>=3?'7.5pt':N>=2?'6.5pt':'5.5pt';
    const fsLbl  = N>=4?'8pt':N>=2?'7pt':'6pt';

    return `<div style="grid-column:${cMin}/${cMax+1};grid-row:${gridRow};position:relative;overflow:hidden;border-radius:1.5mm;background:${c.bg};border:${c.bw} solid #222">
      ${slotOutlines}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.8mm;padding:2mm 1.5mm;z-index:1">
        <div style="font-size:${fsName};font-weight:700;color:${c.tx};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;max-width:100%;text-align:center">${resa.name}</div>
        <div style="font-size:${fsCnt};font-weight:800;color:${c.tx};font-family:monospace;line-height:1">x${tot}</div>
        <div style="font-size:${fsLbl};font-weight:900;color:#000;line-height:1;background:#111;color:#fff;border-radius:0.8mm;padding:0.3mm 1.5mm">${c.lbl}</div>
      </div>
    </div>`;
  }

  // ── Salon : même approche CSS
  function salonCell(salon, gridRow){
    const r=salonResaMap[salon.id], gc=salon.gridCol;
    const N=parseInt(gc.split('/')[1])-parseInt(gc.split('/')[0]);
    if(r){
      const c=cFor(r);
      const totalW=N*W+(N-1)*GAP;
      const slotOutlines=Array.from({length:N},(_,i)=>{
        const lPct=(i*(W+GAP)/totalW*100).toFixed(2);
        const wPct=(W/totalW*100).toFixed(2);
        return `<div style="position:absolute;left:${lPct}%;top:5%;width:${wPct}%;height:90%;border:0.35pt solid #C0C0C0;border-radius:1mm;pointer-events:none"></div>`;
      }).join('');
      return `<div style="grid-column:${gc};grid-row:${gridRow};position:relative;overflow:hidden;border-radius:1.5mm;background:${c.bg};border:${c.bw} solid #222">
        ${slotOutlines}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5mm;padding:2mm 1.5mm;z-index:1">
          <div style="font-size:3.5pt;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.05em;line-height:1">${salon.lbl}</div>
          <div style="font-size:7pt;font-weight:700;color:${c.tx};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;max-width:100%;text-align:center">${r.name}</div>
          <div style="font-size:6.5pt;font-weight:800;color:${c.tx};font-family:monospace;line-height:1">x${r.tr||r.pax||2}</div>
          <div style="font-size:7pt;font-weight:900;color:#fff;line-height:1;background:#111;border-radius:0.8mm;padding:0.3mm 1.5mm">${c.lbl}</div>
        </div>
      </div>`;
    }
    return `<div style="grid-column:${gc};grid-row:${gridRow};background:#F5F5F5;border:0.5pt dashed #CCCCCC;border-radius:1.5mm;display:flex;align-items:center;justify-content:center">
      <div style="font-size:5pt;color:#BBBBBB;font-weight:600;text-align:center;line-height:1.4">${salon.lbl}<br><span style="font-size:3.5pt">libre</span></div>
    </div>`;
  }

  let cells='';
  TR_ROWS.forEach((row,ri)=>{
    const rb=row.id, gridRow=ri+1;
    cells+=`<div style="grid-column:1;grid-row:${gridRow};display:flex;align-items:center;justify-content:flex-end;padding-right:2.5mm">
      <span style="font-size:7pt;font-weight:800;color:#555;font-family:monospace">${rb}</span>
    </div>`;
    if(rb===100){
      for(let s=101;s<=103;s++){
        const resa=slotMap[s];
        cells+=resa?resaBlock(resa,sCol(s),sCol(s),gridRow):emptySlot(s,gridRow);
      }
      SALON_SLOTS.forEach(sl=>{cells+=salonCell(sl,gridRow);});
      return;
    }
    for(const blk of ['g','m','d']){
      const bSlots=trSlots(rb)[blk]; let i=0;
      while(i<bSlots.length){
        const s=bSlots[i], resa=slotMap[s];
        if(!resa){cells+=emptySlot(s,gridRow);i++;}
        else{
          let j=i+1;
          while(j<bSlots.length&&slotMap[bSlots[j]]===resa)j++;
          const run=bSlots.slice(i,j), cols=run.map(sCol);
          cells+=resaBlock(resa,Math.min(...cols),Math.max(...cols),gridRow);
          i=j;
        }
      }
    }
  });

  let unplacedHtml='';
  if(unplcd.length){
    unplacedHtml=`<div style="margin-top:2mm;border:0.6pt solid #555;border-radius:1.5mm;padding:1.5mm 3mm;display:flex;flex-wrap:wrap;gap:1.5mm;align-items:center">
      <span style="font-size:6pt;font-weight:800;flex-shrink:0">⚠ Non placés :</span>
      ${unplcd.map(r=>{const c=cFor(r);return`<span style="font-size:5.5pt;font-weight:700;padding:0.5mm 2mm;border-radius:1mm;background:${c.bg};border:0.5pt solid #555">${r.name} x${r.tr||1} ${c.lbl}</span>`;}).join('')}
    </div>`;
  }

  const html=`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan transats — ${dateStr}</title>
<style>
@page{size:A4 landscape;margin:7mm 9mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;height:196mm;display:flex;flex-direction:column}
.no-print{padding:4px 0;flex-shrink:0}
@media print{.no-print{display:none!important}}
.btn{padding:4px 12px;background:#111;color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;margin-right:4px}
.hd{display:flex;justify-content:space-between;align-items:center;padding-bottom:2mm;border-bottom:1pt solid #222;margin-bottom:2mm;flex-shrink:0}
.grid{flex:1;min-height:0;display:grid;grid-template-columns:${LBL}mm repeat(7,${W}mm) ${ALLEY}mm repeat(6,${W}mm) ${ALLEY}mm repeat(8,${W}mm);grid-template-rows:repeat(5,1fr);column-gap:${GAP}mm;row-gap:3mm}
.sea{flex-shrink:0;text-align:center;font-size:6pt;font-weight:700;letter-spacing:.1em;color:#555;border-top:0.5pt solid #CCCCCC;padding-top:1.5mm;margin-top:2mm}
.leg{display:inline-flex;align-items:center;gap:1.5mm;font-size:5pt;margin-right:3mm}
.leg-box{width:11px;height:9px;border-radius:1.5px;display:inline-block;flex-shrink:0}
</style></head><body>
<div class="no-print">
  <button class="btn" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn" style="background:#555" onclick="window.close()">✕ Fermer</button>
</div>
<div class="hd">
  <div style="display:flex;align-items:center;gap:4mm">
    <div style="font-size:13pt;font-weight:800">⛱ ${dateStr}</div>
    <div>
      <span class="leg"><span style="font-size:6pt;font-weight:900;color:#fff;background:#111;border-radius:1mm;padding:0.2mm 1.5mm">S1</span> Service 1</span>
      <span class="leg"><span style="font-size:6pt;font-weight:900;color:#fff;background:#111;border-radius:1mm;padding:0.2mm 1.5mm">S2</span> Service 2</span>
      <span class="leg"><span style="font-size:6pt;font-weight:900;color:#fff;background:#111;border-radius:1mm;padding:0.2mm 1.5mm">Soir</span> Soir</span>
      <span class="leg"><span style="font-size:6pt;font-weight:900;color:#fff;background:#111;border-radius:1mm;padding:0.2mm 1.5mm">RT</span> Repas-transat</span>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:2.5mm;flex-wrap:wrap">
    <div style="border:0.8pt solid #333;border-radius:3px;padding:1mm 2.5mm;text-align:center">
      <div style="font-size:11pt;font-weight:700;line-height:1">${nbSlots}</div>
      <div style="font-size:3.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.07em;opacity:.7;margin-top:0.5mm">transats</div>
    </div>
    ${nbRT?`<div style="border:0.8pt solid #333;border-radius:3px;padding:1mm 2.5mm;text-align:center"><div style="font-size:11pt;font-weight:700;line-height:1">${nbRT}</div><div style="font-size:3.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.07em;opacity:.7;margin-top:0.5mm">RT</div></div>`:''}
    <div style="display:flex;gap:1.5mm;align-items:center;flex-wrap:wrap">
      ${nbS1  ?`<span style="font-size:5pt;font-weight:800;padding:1mm 2.5mm;border-radius:6mm;border:0.6pt solid #333;background:#FFF">S1 · ${nbS1}</span>`:''}
      ${nbS2  ?`<span style="font-size:5pt;font-weight:800;padding:1mm 2.5mm;border-radius:6mm;border:0.6pt solid #333;background:#FFF">S2 · ${nbS2}</span>`:''}
      ${nbSoir?`<span style="font-size:5pt;font-weight:800;padding:1mm 2.5mm;border-radius:6mm;border:0.6pt solid #333;background:#FFF">Soir · ${nbSoir}</span>`:''}
    </div>
    ${unplcd.length?`<div style="border:0.8pt solid #333;border-radius:3px;padding:1mm 2.5mm;text-align:center"><div style="font-size:11pt;font-weight:700;line-height:1">⚠${unplcd.length}</div><div style="font-size:3.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.07em;opacity:.7;margin-top:0.5mm">non placés</div></div>`:''}
  </div>
</div>
<div class="grid">${cells}</div>
<div class="sea">〰 MER MÉDITERRANÉE 〰</div>
${unplacedHtml}
</body></html>`;

  openPrintWindow(html);
}
function printServiceSheet() {
  const dateStr = fmtDateLong(currentDate);

  const TABLE_ORDER = [
    {id:1,lbl:'1'},{id:2,lbl:'2'},{id:3,lbl:'3'},{id:4,lbl:'4'},
    {id:5,lbl:'5'},{id:6,lbl:'6'},{id:7,lbl:'7'},{id:8,lbl:'8'},
    {id:9,lbl:'9'},{id:10,lbl:'10'},{id:11,lbl:'11'},{id:12,lbl:'12'},
    {id:13,lbl:'SALON 13',long:true},
    {id:14,lbl:'14'},{id:15,lbl:'15'},{id:16,lbl:'16'},{id:17,lbl:'17'},
    {id:18,lbl:'18'},{id:19,lbl:'19'},{id:20,lbl:'20'},{id:21,lbl:'21'},
    {id:22,lbl:'22'},{id:23,lbl:'23'},{id:24,lbl:'24'},
    {id:25,lbl:'BAR PLAGE 25',long:true},{id:26,lbl:'BAR PLAGE 26',long:true},
    {id:27,lbl:'TABLE HAUTE 27',long:true},{id:28,lbl:'TABLE HAUTE 28',long:true},
    {id:29,lbl:'TABLE HAUTE 29',long:true},{id:30,lbl:'TABLE HAUTE 30',long:true},
    {id:1001,lbl:'SALON 1',long:true,tranat:true},{id:1002,lbl:'SALON 2',long:true,tranat:true},
    {id:1003,lbl:'SALON 3',long:true,tranat:true},{id:1004,lbl:'SALON 4',long:true,tranat:true},
  ];

  function buildResaMap(svcKey) {
    const m = {};
    reservations[svcKey].filter(r => r.placed && !r.ns).forEach(r => { if (r.tableId) m[r.tableId] = r; });
    (reservations.transats||[]).filter(r => r.placed && !r.ns && r.svc===svcKey && r.slot>=1001 && r.slot<=1004)
      .forEach(r => { m[r.slot] = r; });
    return m;
  }

  function trCount(r) {
    if (!r || !r.repas_transat) return '';
    return (r.tr && r.tr > 0) ? String(r.tr) : '✓';
  }

  function buildTableHtml(map, fusedGroups, timeLabel) {
    const done = new Set();
    let rows = '';
    TABLE_ORDER.forEach(entry => {
      const id = entry.id;
      if (done.has(id)) return;
      const fg = !entry.tranat && (fusedGroups||[]).find(f => f.tids.includes(id));
      if (fg && !done.has(fg.tids[0])) {
        const r = fg.tids.map(t => map[t]).find(x => x) || null;
        rows += dataRow(fg.tids.join('+'), r);
        fg.tids.forEach(t => done.add(t));
        return;
      }
      done.add(id);
      rows += dataRow(entry.lbl, map[id]||null);
    });
    return `<table class="plan">
      <thead>
        <tr><th class="h-date">DATE : ${dateStr}</th><th class="h-time">${timeLabel}</th><th class="h-resas">RÉSERVATIONS</th></tr>
        <tr><th class="h-tbl">TABLE</th><th class="h-cov">COV.</th><th class="h-nom">NOM</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  function dataRow(lbl, r, isLong) {
    if (!r) return `<tr><td class="d-tbl">${lbl}</td><td class="d-cov"></td><td class="d-nom"></td></tr>`;
    const tbadge = (r.tr > 0) ? `<span class="t-badge">T</span>` : '';
    return `<tr class="occ"><td class="d-tbl">${lbl}</td><td class="d-cov">${r.pax}</td><td class="d-nom">${r.name}${tbadge}</td></tr>`;
  }

  const mapS1 = buildResaMap('s1');
  const mapS2 = buildResaMap('s2');

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan de salle — La Playa</title>
<style>
@page { size: A4 portrait; margin: 5mm 6mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.no-print { padding: 8px 0 10px; display: flex; gap: 8px; }
@media print { .no-print { display: none !important; } }
.btn { padding: 7px 16px; border-radius: 6px; font-size: 12px; font-weight: 700;
  cursor: pointer; border: 1.5px solid #111; }
.btn-pri { background: #111; color: #fff; }
.btn-sec { background: #fff; color: #111; }

/* Deux colonnes remplissant toute la page */
.wrap { display: flex; gap: 5mm; height: 287mm; } /* 297 - 5*2 */
.col  { flex: 1; min-width: 0; display: flex; flex-direction: column; }

/* Table grille papier — remplit toute la hauteur de la colonne */
.plan { width: 100%; border-collapse: collapse; table-layout: fixed; flex: 1; height: 100%; }
.plan th, .plan td { border: 0.75px solid #000; }

/* En-tête ligne 1 */
.h-date { font-size: 6pt; font-weight: 600; padding: 2px 3px; width: 26%; text-align: left; }
.h-time { font-size: 7pt; font-weight: 700; padding: 2px 3px; text-align: center; width: 11%; }
.h-resas { font-size: 9pt; font-weight: 900; padding: 3px 4px; text-align: center; letter-spacing: .04em; }

/* En-tête ligne 2 */
.h-tbl { font-size: 6pt; font-weight: 700; text-transform: uppercase; padding: 2px 3px; text-align: center; width: 26%; letter-spacing: .04em; }
.h-cov { font-size: 6pt; font-weight: 700; text-transform: uppercase; padding: 2px 3px; text-align: center; width: 11%; letter-spacing: .04em; }
.h-nom { font-size: 6pt; font-weight: 700; text-transform: uppercase; padding: 2px 3px; text-align: center; letter-spacing: .04em; }

/* Lignes de données — hauteur automatique pour remplir la page (34 lignes) */
.plan tbody { height: 100%; }
.plan tbody tr { height: 7.7mm; }
.plan td { vertical-align: middle; padding: 0 3px; }
.d-tbl  { text-align: center; font-size: 11pt; font-weight: 700; line-height: 1.2; }
.d-cov  { text-align: center; font-size: 11pt; font-weight: 700; }
.d-nom  { font-size: 9pt; font-weight: 600; padding-left: 5px !important; }
.occ td { background: #FAFAFA; }
.t-badge { display:inline-block; border:1px solid #000; border-radius:50%;
  width:11px; height:11px; text-align:center; line-height:10px;
  font-size:6.5pt; font-weight:800; margin-left:5px; vertical-align:middle; }
</style></head><body>
<div class="no-print">
  <button class="btn btn-pri" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn btn-sec" onclick="window.close()">Fermer</button>
</div>
<div class="wrap">
  <div class="col">${buildTableHtml(mapS1, fused.s1, '12h – 14h')}</div>
  <div class="col">${buildTableHtml(mapS2, fused.s2, '14h15 – 15h30')}</div>
</div>
</body></html>`;

  openPrintWindow(html);
}

// ══════════════════════════════════════════
// PLAN DE SALLE SOIR — 1 colonne, même format grille que le plan Jour
// ══════════════════════════════════════════
function printSoirSheet() {
  const dateStr = fmtDateLong(currentDate);

  const TABLE_ORDER_SOIR = [
    {id:1,lbl:'1'},{id:2,lbl:'2'},{id:3,lbl:'3'},{id:4,lbl:'4'},
    {id:5,lbl:'5'},{id:6,lbl:'6'},{id:7,lbl:'7'},{id:8,lbl:'8'},
    {id:9,lbl:'9'},{id:10,lbl:'10'},{id:11,lbl:'11'},{id:12,lbl:'12'},
    {id:13,lbl:'SALON 13',long:true},
    {id:14,lbl:'14'},{id:15,lbl:'15'},{id:16,lbl:'16'},{id:17,lbl:'17'},
    {id:18,lbl:'18'},{id:19,lbl:'19'},{id:20,lbl:'20'},{id:21,lbl:'21'},
    {id:22,lbl:'22'},{id:23,lbl:'23'},{id:24,lbl:'24'},
    {id:25,lbl:'BAR PLAGE 25',long:true},{id:26,lbl:'BAR PLAGE 26',long:true},
    {id:27,lbl:'TABLE HAUTE 27',long:true},{id:28,lbl:'TABLE HAUTE 28',long:true},
    {id:29,lbl:'TABLE HAUTE 29',long:true},{id:30,lbl:'TABLE HAUTE 30',long:true},
    {id:1001,lbl:'SALON 1',long:true,tranat:true},{id:1002,lbl:'SALON 2',long:true,tranat:true},
    {id:1003,lbl:'SALON 3',long:true,tranat:true},{id:1004,lbl:'SALON 4',long:true,tranat:true},
  ];

  const mapSoir = {};
  reservations.soir.filter(r => r.placed && !r.ns).forEach(r => { if (r.tableId) mapSoir[r.tableId] = r; });
  (reservations.transats||[]).filter(r => r.placed && !r.ns && r.svc==='soir' && r.slot>=1001 && r.slot<=1004)
    .forEach(r => { mapSoir[r.slot] = r; });

  function dataRow(lbl, r) {
    if (!r) return `<tr><td class="d-tbl">${lbl}</td><td class="d-cov"></td><td class="d-nom"></td></tr>`;
    const tbadge = (r.tr > 0) ? `<span class="t-badge">T</span>` : '';
    return `<tr class="occ"><td class="d-tbl">${lbl}</td><td class="d-cov">${r.pax}</td><td class="d-nom">${r.name}${tbadge}</td></tr>`;
  }

  let rows = '';
  const done = new Set();
  TABLE_ORDER_SOIR.forEach(entry => {
    const id = entry.id;
    if (done.has(id)) return;
    const fg = !entry.tranat && (fused.soir||[]).find(f => f.tids.includes(id));
    if (fg && !done.has(fg.tids[0])) {
      const r = fg.tids.map(t => mapSoir[t]).find(x => x) || null;
      rows += dataRow(fg.tids.join('+'), r);
      fg.tids.forEach(t => done.add(t));
      return;
    }
    done.add(id);
    rows += dataRow(entry.lbl, mapSoir[id]||null);
  });

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan de salle Soir — La Playa</title>
<style>
@page { size: A4 portrait; margin: 5mm 14mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.no-print { padding: 8px 0 10px; display: flex; gap: 8px; }
@media print { .no-print { display: none !important; } }
.btn { padding: 7px 16px; border-radius: 6px; font-size: 12px; font-weight: 700;
  cursor: pointer; border: 1.5px solid #111; }
.btn-pri { background: #111; color: #fff; }
.btn-sec { background: #fff; color: #111; }
.plan { width: 100%; border-collapse: collapse; table-layout: fixed; height: 100%; }
.plan th, .plan td { border: 0.75px solid #000; }
.h-date { font-size: 6pt; font-weight: 600; padding: 2px 3px; width: 26%; text-align: left; }
.h-time { font-size: 7pt; font-weight: 700; padding: 2px 3px; text-align: center; width: 11%; }
.h-resas { font-size: 9pt; font-weight: 900; padding: 3px 4px; text-align: center; letter-spacing: .04em; }
.h-tbl { font-size: 6pt; font-weight: 700; text-transform: uppercase; padding: 2px 3px; text-align: center; width: 26%; letter-spacing: .04em; }
.h-cov { font-size: 6pt; font-weight: 700; text-transform: uppercase; padding: 2px 3px; text-align: center; width: 11%; letter-spacing: .04em; }
.h-nom { font-size: 6pt; font-weight: 700; text-transform: uppercase; padding: 2px 3px; text-align: center; letter-spacing: .04em; }
.plan tbody tr { height: 7.7mm; }
.plan td { vertical-align: middle; padding: 0 3px; }
.d-tbl  { text-align: center; font-size: 11pt; font-weight: 700; line-height: 1.2; }
.d-cov  { text-align: center; font-size: 11pt; font-weight: 700; }
.d-nom  { font-size: 9pt; font-weight: 600; padding-left: 5px !important; }
.occ td { background: #FAFAFA; }
.t-badge { display:inline-block; border:1px solid #000; border-radius:50%;
  width:11px; height:11px; text-align:center; line-height:10px;
  font-size:6.5pt; font-weight:800; margin-left:5px; vertical-align:middle; }
</style></head><body>
<div class="no-print">
  <button class="btn btn-pri" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn btn-sec" onclick="window.close()">Fermer</button>
</div>
<table class="plan">
  <thead>
    <tr><th class="h-date">DATE : ${dateStr}</th><th class="h-time">19h30</th><th class="h-resas">RÉSERVATIONS</th></tr>
    <tr><th class="h-tbl">TABLE</th><th class="h-cov">COV.</th><th class="h-nom">NOM</th></tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</body></html>`;

  openPrintWindow(html);
}

// Le bouton ⎙ dans la topbar
function downloadPlan(){ printServiceSheet(); }
