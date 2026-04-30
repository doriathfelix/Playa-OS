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
// PRINT PLAN DE TRANSATS — pleine page, nom + badges service dans chaque cellule
// ══════════════════════════════════════════
function printTransats(){
  const dateStr = fmtDateLong(currentDate);

  // ── Stats
  const allTr  = reservations.transats.filter(r => !r.ns);
  const placed = allTr.filter(r => r.placed);
  const unplcd = allTr.filter(r => !r.placed);
  const nbSlots = placed.reduce((s,r) => s + (r.slot >= 1001 ? 2 : (r.tr||1)), 0);
  const nbRT    = allTr.filter(r => r.repas_transat).length;

  // ── Helpers
  function slotToGridCol(slot){
    const p = slot - Math.floor(slot/100)*100;
    if(p >= 1  && p <= 7)  return 1 + p;
    if(p >= 8  && p <= 12) return 2 + p;
    return 3 + p;
  }
  function slotToGridRow(slot){
    const rb = Math.floor(slot/100)*100;
    return TR_ROWS.findIndex(r => r.id === rb) + 1;
  }

  // ── Couleurs par service (border/bg/text)
  const SVC_CLR = {
    s1:   { bd:'#16A34A', bg:'#DCFCE7', tx:'#14532D', pill:'#16A34A', lbl:'S1'   },
    s2:   { bd:'#0284C7', bg:'#E0F2FE', tx:'#0C4A6E', pill:'#0284C7', lbl:'S2'   },
    soir: { bd:'#7C3AED', bg:'#EDE9FE', tx:'#3B0764', pill:'#7C3AED', lbl:'Soir' },
  };
  const RT_CLR  = { pill:'#0D9488', lbl:'RT' };
  const BED_CLR = { bd:'#D97706', bg:'#FEF3C7', tx:'#92400E' };

  function resaColors(r){
    if(BED_SLOTS.includes(r.slot)) return BED_CLR;
    return SVC_CLR[r.svc] || SVC_CLR.s1;
  }

  // Badges service pour une resa (retourne HTML des pills)
  function svcBadges(r){
    const isBed = BED_SLOTS.includes(r.slot);
    if(isBed){
      return `<span style="background:#D97706;color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:20px">BED</span>`;
    }
    const pills = [];
    const sc = SVC_CLR[r.svc];
    if(sc) pills.push(`<span style="background:${sc.pill};color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:20px">${sc.lbl}</span>`);
    if(r.repas_transat) pills.push(`<span style="background:${RT_CLR.pill};color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:20px">${RT_CLR.lbl}</span>`);
    return pills.join('');
  }

  // ── Slots couverts
  const coveredSlots = new Set();
  const regularPlaced = placed.filter(r => !(r.slot >= 1001 && r.slot <= 1004));
  regularPlaced.forEach(resa => {
    const slots = (resa.extraSlots && resa.extraSlots.length)
      ? resa.extraSlots
      : Array.from({length: resa.tr||1}, (_,i) => (resa.slot||0)+i);
    slots.forEach(s => coveredSlots.add(s));
  });

  const salonMap = {};
  placed.filter(r => r.slot >= 1001 && r.slot <= 1004).forEach(r => { salonMap[r.slot] = r; });

  let cells = '';

  // ── 1. Cellules vides
  TR_ROWS.forEach((row, ri) => {
    const rb = row.id;
    const rowIdx = ri + 1;
    const lblColor = row.sea ? '#0D9488' : '#6B7280';

    // Label rangée
    cells += `<div style="grid-column:1;grid-row:${rowIdx};display:flex;align-items:center;justify-content:flex-end;padding-right:6px">
      <span style="font-size:11px;font-weight:800;color:${lblColor};font-family:monospace">${rb}</span>
    </div>`;

    if(rb === 100){
      for(let p = 1; p <= 3; p++){
        const slot = rb + p;
        if(coveredSlots.has(slot)) continue;
        cells += `<div style="grid-column:${1+p};grid-row:${rowIdx};border-radius:6px;background:#F8F9FA;border:1.5px dashed #DEE2E6;display:flex;align-items:center;justify-content:center">
          <span style="font-size:9px;color:#CED4DA">${slot}</span></div>`;
      }
      SALON_SLOTS.forEach(salon => {
        if(salonMap[salon.id]) return;
        cells += `<div style="grid-column:${salon.gridCol};grid-row:${rowIdx};border-radius:6px;background:#F8F9FA;border:1.5px dashed #CED4DA;display:flex;align-items:center;justify-content:center">
          <span style="font-size:10px;font-weight:600;color:#ADB5BD">${salon.lbl}</span></div>`;
      });
    } else if(rb === 200){
      for(let p = 1; p <= 18; p++){
        const slot = rb + p;
        if(coveredSlots.has(slot)) continue;
        const col = slotToGridCol(slot);
        cells += `<div style="grid-column:${col};grid-row:${rowIdx};border-radius:6px;background:#F8F9FA;border:1.5px dashed #DEE2E6;display:flex;align-items:center;justify-content:center">
          <span style="font-size:9px;color:#CED4DA">${slot}</span></div>`;
      }
      for(let p = 19; p <= 21; p++){
        const slot = rb + p;
        if(coveredSlots.has(slot)) continue;
        const col = slotToGridCol(slot);
        cells += `<div style="grid-column:${col};grid-row:${rowIdx};border-radius:6px;background:#FFFBEB;border:1.5px dashed #D97706;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">
          <span style="font-size:9px;font-weight:800;color:#92400E;text-align:center;line-height:1.2">BED<br><span style="font-size:8px;font-weight:600">${slot}</span></span></div>`;
      }
    } else {
      for(let p = 1; p <= 20; p++){
        const slot = rb + p;
        if(coveredSlots.has(slot)) continue;
        const col = slotToGridCol(slot);
        cells += `<div style="grid-column:${col};grid-row:${rowIdx};border-radius:6px;background:#F8F9FA;border:1.5px dashed #DEE2E6;display:flex;align-items:center;justify-content:center">
          <span style="font-size:9px;color:#CED4DA">${slot}</span></div>`;
      }
    }
  });

  // ── 2. Cellules resas placées
  const renderedResas = new Set();
  regularPlaced.forEach(resa => {
    if(renderedResas.has(resa.id)) return;
    renderedResas.add(resa.id);

    const slots = (resa.extraSlots && resa.extraSlots.length)
      ? resa.extraSlots
      : Array.from({length: resa.tr||1}, (_,i) => (resa.slot||0)+i);
    if(!slots.length) return;

    let minRow=Infinity, maxRow=-Infinity, minCol=Infinity, maxCol=-Infinity;
    slots.forEach(s => {
      const gr = slotToGridRow(s); const gc = slotToGridCol(s);
      if(gr < 1) return;
      minRow=Math.min(minRow,gr); maxRow=Math.max(maxRow,gr);
      minCol=Math.min(minCol,gc); maxCol=Math.max(maxCol,gc);
    });
    if(minRow===Infinity) return;

    const c   = resaColors(resa);
    const nom = resa.name.split(' ')[0];
    const badges = svcBadges(resa);

    cells += `<div style="grid-column:${minCol}/${maxCol+1};grid-row:${minRow}/${maxRow+1};
      border-radius:8px;background:${c.bg};border:2.5px solid ${c.bd};
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:4px 3px;overflow:hidden;gap:4px;z-index:3;position:relative">
      <div style="font-size:12px;font-weight:800;color:${c.tx};text-align:center;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.1">${nom}</div>
      <div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;align-items:center">${badges}</div>
    </div>`;
  });

  // ── 3. Salons placés
  SALON_SLOTS.forEach(salon => {
    const sr = salonMap[salon.id];
    if(!sr) return;
    const c = SVC_CLR[sr.svc] || SVC_CLR.s1;
    const nom = sr.name.split(' ')[0];
    const badges = svcBadges(sr);
    cells += `<div style="grid-column:${salon.gridCol};grid-row:${salon.gridRow};
      border-radius:8px;background:${c.bg};border:2.5px solid ${c.bd};
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:4px 3px;overflow:hidden;gap:4px;z-index:3;position:relative">
      <div style="font-size:11px;font-weight:800;color:${c.tx};text-align:center;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.1">${nom}</div>
      <div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center">${badges}</div>
    </div>`;
  });

  // ── Unplaced (compact, en bas)
  let unplacedHtml = '';
  if(unplcd.length){
    unplacedHtml = `<div style="background:#FFFBEB;border:1.5px solid #FCD34D;border-radius:8px;padding:8px 12px;margin-top:6px;flex-shrink:0">
      <span style="font-size:10px;font-weight:700;color:#78350F">⚠ Non placés : </span>
      ${unplcd.map(r => {
        const sc = SVC_CLR[r.svc];
        return `<span style="font-size:11px;font-weight:700;color:#92400E;margin-right:10px">${r.name}
          <span style="font-size:9px;background:${sc?sc.pill:'#6B7280'};color:#fff;padding:1px 5px;border-radius:20px;margin-left:3px">${sc?sc.lbl:'?'}</span>
          ${r.repas_transat?`<span style="font-size:9px;background:#0D9488;color:#fff;padding:1px 5px;border-radius:20px;margin-left:2px">RT</span>`:''}
        </span>`;
      }).join('')}
    </div>`;
  }

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan de transats</title>
<style>
@page { size: A4 landscape; margin: 7mm 9mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1C1C1E; background: #fff;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
  display: flex; flex-direction: column; height: 100%; }
.no-print { padding: 10px 0 8px; flex-shrink: 0; }
@media print { .no-print { display: none !important; } }
.btn { padding: 7px 18px; background: #1C1C1E; color: #fff; border: none; border-radius: 7px;
  font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; margin-right: 7px; }
.hd { display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 6px; border-bottom: 2px solid #1C1C1E; margin-bottom: 7px; flex-shrink: 0; }
.date { font-size: 14px; font-weight: 700; color: #1C1C1E; }
.stats-row { display: flex; gap: 14px; align-items: center; }
.stat-pill { font-size: 12px; font-weight: 700; padding: 3px 12px; border-radius: 20px; }
.resto-bar { background: linear-gradient(90deg,#6B7280,#4B5563); color:#fff; border-radius: 6px;
  text-align: center; font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  padding: 4px; margin-bottom: 5px; flex-shrink: 0; }
.sea-bar { background: linear-gradient(90deg,#0EA5E9,#0D9488); color:#fff; border-radius: 6px;
  text-align: center; font-size: 9px; font-weight: 700; letter-spacing: .08em;
  padding: 4px; margin-top: 5px; flex-shrink: 0; }
.grid-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.grid {
  flex: 1;
  display: grid;
  grid-template-columns: 36px repeat(7,1fr) 7px repeat(5,1fr) 7px repeat(8,1fr) 1fr;
  grid-template-rows: repeat(5, 1fr);
  gap: 4px 3px;
  background: #F0F9FF;
  border-radius: 10px;
  border: 1px solid #BAE6FD;
  padding: 6px 5px;
  min-height: 0;
}
</style></head><body>
<div class="no-print">
  <button class="btn" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn" style="background:#3C3C43" onclick="window.close()">✕ Fermer</button>
</div>
<div class="hd">
  <div class="date">${dateStr}</div>
  <div class="stats-row">
    <span class="stat-pill" style="background:#DCFCE7;color:#14532D">⛱ ${nbSlots} transats</span>
    <span class="stat-pill" style="background:#CCFBF1;color:#134E4A">RT ${nbRT}</span>
    ${unplcd.length ? `<span class="stat-pill" style="background:#FFFBEB;color:#92400E">⚠ ${unplcd.length} non placés</span>` : ''}
  </div>
</div>
<div class="resto-bar">▲ Restaurant</div>
<div class="grid-wrap">
  <div class="grid">${cells}</div>
</div>
<div class="sea-bar">〰 Mer Méditerranée 〰</div>
${unplacedHtml}
</body></html>`;

  openPrintWindow(html);
}

// Compat
function downloadPlan(){ printFloorPlan(); }
