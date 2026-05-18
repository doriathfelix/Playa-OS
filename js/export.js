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

  // ── Stats
  const allTr  = reservations.transats.filter(r => !r.ns);
  const placed = allTr.filter(r => r.placed);
  const unplcd = allTr.filter(r => !r.placed);
  const nbSlots = placed.reduce((s,r) => s + (r.slot >= 1001 ? 2 : (r.tr||1)), 0);
  const nbRT    = allTr.filter(r => r.repas_transat).length;
  const nbS1    = placed.filter(r=>r.svc==='s1').reduce((s,r)=>s+(r.slot>=1001?2:(r.tr||1)),0);
  const nbS2    = placed.filter(r=>r.svc==='s2').reduce((s,r)=>s+(r.slot>=1001?2:(r.tr||1)),0);
  const nbSoir  = placed.filter(r=>r.svc==='soir').reduce((s,r)=>s+(r.slot>=1001?2:(r.tr||1)),0);

  const SVC = {
    s1:   {bg:'#DCFCE7', bd:'#16A34A', tx:'#14532D', lbl:'S1'},
    s2:   {bg:'#DBEAFE', bd:'#2563EB', tx:'#1E3A8A', lbl:'S2'},
    soir: {bg:'#EDE9FE', bd:'#7C3AED', tx:'#4C1D95', lbl:'Soir'},
  };
  const BED_C = {bg:'#FEF3C7', bd:'#D97706', tx:'#92400E', lbl:'BED'};
  const RT_BD = '#0D9488';

  function cFor(r){ return BED_SLOTS.includes(r.slot) ? BED_C : (SVC[r.svc] || SVC.s1); }

  // slot → resa
  const slotMap = {};
  placed.filter(r => r.slot < 1001).forEach(resa => {
    const slots = (resa.extraSlots && resa.extraSlots.length)
      ? resa.extraSlots
      : Array.from({length: resa.tr||1}, (_,i) => (resa.slot||0)+i);
    slots.forEach(s => { if(!slotMap[s]) slotMap[s] = resa; });
  });
  const salonMap = {};
  placed.filter(r => r.slot >= 1001 && r.slot <= 1004).forEach(r => { salonMap[r.slot] = r; });

  function emptyCell(slotNum, label, isBed){
    const bg = isBed ? '#FFFBEB' : '#FAFAFA';
    const bc = isBed ? '#FCD34D' : '#E5E7EB';
    const tx = isBed ? '#D97706' : '#D1D5DB';
    return `<td style="background:${bg};border:1px solid ${bc};text-align:center;vertical-align:middle;padding:2px;overflow:hidden">
      ${isBed ? `<div style="font-size:6pt;font-weight:800;color:${tx}">BED</div>` : ''}
      <div style="font-size:6pt;color:${tx}">${label}</div>
    </td>`;
  }

  function resaCell(resa, colspan){
    const c   = cFor(resa);
    const nom = resa.name.split(' ')[0];
    const tr  = resa.tr || 1;
    const rt  = resa.repas_transat
      ? `<span style="background:${RT_BD};color:#fff;font-size:6pt;font-weight:800;padding:1px 4px;border-radius:6px;margin-left:2px">RT</span>` : '';
    return `<td colspan="${colspan}" style="background:${c.bg};border:2px solid ${c.bd};text-align:center;vertical-align:middle;padding:3px 2px;overflow:hidden">
      <div style="font-size:11pt;font-weight:900;color:${c.tx};line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${nom}</div>
      <div style="font-size:9pt;font-weight:900;color:${c.tx};margin:1px 0">×${tr}</div>
      <div><span style="background:${c.bd};color:#fff;font-size:6pt;font-weight:800;padding:1px 5px;border-radius:6px">${c.lbl}</span>${rt}</div>
    </td>`;
  }

  const allee = `<td style="width:6px;min-width:6px;max-width:6px;background:#fff;border:none;padding:0"></td>`;

  function renderBlock(slots, labels){
    let html = ''; let i = 0;
    while(i < slots.length){
      const s = slots[i];
      const resa = slotMap[s];
      const isBed = BED_SLOTS.includes(s);
      if(!resa){ html += emptyCell(s, labels[i], isBed); i++; }
      else {
        let j = i + 1;
        while(j < slots.length && slotMap[slots[j]] === resa) j++;
        html += resaCell(resa, j - i);
        i = j;
      }
    }
    return html;
  }

  function colHead(labels, color){
    return labels.map(l=>`<th style="font-size:6.5pt;font-weight:700;color:${color};text-align:center;padding:1px 0;background:#fff;border:none">${l}</th>`).join('');
  }

  const G_LBL = ['1','2','3','4','5','6','7'];
  const M_LBL = ['8','9','10','11','12','12bis'];
  const D_LBL = ['13','14','15','16','17','18','19','20'];

  // Rangée 100 : BEDs + salons
  function renderRow100(){
    const bedHtml = [101,102,103].map(s => {
      const r = slotMap[s];
      return r ? resaCell(r,1) : emptyCell(s,'BED',true);
    }).join('');
    const salonHtml = SALON_SLOTS.map(sl => {
      const r = salonMap[sl.id];
      if(r){ const c=cFor(r); const nom=r.name.split(' ')[0]; const tr=r.tr||2;
        return `<td colspan="2" style="background:${c.bg};border:2px solid ${c.bd};text-align:center;vertical-align:middle;padding:3px">
          <div style="font-size:10pt;font-weight:900;color:${c.tx}">${nom}</div>
          <div style="font-size:8.5pt;font-weight:900;color:${c.tx}">×${tr}</div>
          <div><span style="background:${c.bd};color:#fff;font-size:6pt;font-weight:800;padding:1px 5px;border-radius:6px">${c.lbl}</span></div>
        </td>`;
      }
      return `<td colspan="2" style="background:#F9FAFB;border:1px solid #E5E7EB;text-align:center;vertical-align:middle"><div style="font-size:6.5pt;color:#9CA3AF;font-weight:600">${sl.lbl}</div></td>`;
    }).join('');
    return `<tr>
      <td rowspan="2" style="background:#F3F4F6;text-align:center;vertical-align:middle;padding:4px 5px;border:1px solid #D1D5DB">
        <div style="font-size:8.5pt;font-weight:900;color:#374151">100</div>
        <div style="font-size:6pt;color:#9CA3AF">Resto</div>
      </td>
      <th colspan="3" style="font-size:6.5pt;color:#D97706;font-weight:700;text-align:center;padding:1px;background:#fff;border:none">BEDs</th>
      ${allee}
      <th colspan="8" style="font-size:6.5pt;color:#6B7280;font-weight:700;text-align:center;padding:1px;background:#fff;border:none">Salons</th>
      ${allee}
      <th colspan="8" style="border:none;background:#fff"></th>
    </tr><tr>
      ${bedHtml}${allee}${salonHtml}${allee}
      <td colspan="8" style="background:#F9FAFB;border:1px solid #F3F4F6"></td>
    </tr>`;
  }

  function renderDataRow(rb, sea){
    const g = [1,2,3,4,5,6,7].map(p=>rb+p);
    const m = [8,9,10,11,12,13].map(p=>rb+p);
    const dLen = rb===200 ? 8 : 7;
    const d = Array.from({length:dLen},(_,i)=>rb+14+i);
    const dLabels = D_LBL.slice(0,dLen);
    const rowColor = sea ? '#0D9488' : '#374151';
    const rowBg    = sea ? '#CCFBF1' : '#F3F4F6';
    return `<tr>
      <td style="background:${rowBg};text-align:center;vertical-align:middle;padding:4px 5px;border:1px solid #D1D5DB;white-space:nowrap">
        <div style="font-size:9.5pt;font-weight:900;color:${rowColor}">${rb}</div>
        ${sea?'<div style="font-size:5.5pt;color:#0D9488">Mer</div>':''}
      </td>
      ${renderBlock(g,G_LBL)}${allee}${renderBlock(m,M_LBL)}${allee}${renderBlock(d,dLabels)}
    </tr>`;
  }

  const colHeaders = `<tr>
    <th style="border:none;background:#fff;width:34px"></th>
    ${colHead(G_LBL,'#9CA3AF')}${allee}${colHead(M_LBL,'#9CA3AF')}${allee}${colHead(D_LBL,'#9CA3AF')}
  </tr>`;

  let unplacedHtml = '';
  if(unplcd.length){
    unplacedHtml = `<div style="background:#FFFBEB;border:2px solid #FCD34D;border-radius:7px;padding:7px 12px;margin-top:6px;flex-shrink:0">
      <span style="font-size:10pt;font-weight:800;color:#92400E">⚠ Non placés : </span>
      ${unplcd.map(r => { const sc=SVC[r.svc]||{}; return `<span style="font-size:10pt;font-weight:700;color:#78350F;margin-right:12px">${r.name}
        <span style="background:${sc.bd||'#6B7280'};color:#fff;font-size:7pt;font-weight:800;padding:1px 5px;border-radius:7px">${sc.lbl||'?'}</span>
        <b style="margin-left:3px">×${r.tr||1}</b></span>`;}).join('')}
    </div>`;
  }

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan transats — ${dateStr}</title>
<style>
@page { size: A4 landscape; margin: 8mm 10mm; }
* { box-sizing:border-box; margin:0; padding:0; }
html,body { height:100%; }
body { font-family:'Helvetica Neue',Arial,sans-serif; background:#fff; color:#1C1C1E;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
  display:flex; flex-direction:column; }
.no-print { padding:8px 0 5px; flex-shrink:0 }
@media print { .no-print { display:none !important; } }
.btn { padding:6px 16px; background:#1C1C1E; color:#fff; border:none; border-radius:7px;
  font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; margin-right:6px; }
.hd { display:flex; justify-content:space-between; align-items:center;
  padding-bottom:6px; border-bottom:2.5px solid #1C1C1E; margin-bottom:6px; flex-shrink:0 }
.date { font-size:15pt; font-weight:900; letter-spacing:-.02em; }
.stats { display:flex; gap:7px; align-items:center; }
.stat { border-radius:7px; padding:3px 10px; text-align:center; }
.stat-n { font-size:16pt; font-weight:900; line-height:1; }
.stat-l { font-size:6.5pt; font-weight:700; text-transform:uppercase; letter-spacing:.07em; opacity:.75; }
.pills { display:flex; gap:4px; }
.pill { font-size:9.5pt; font-weight:800; padding:3px 9px; border-radius:12px; color:#fff; }
.bar { color:#fff; border-radius:5px; text-align:center; font-size:7.5pt; font-weight:800;
  letter-spacing:.1em; text-transform:uppercase; padding:3px 0; margin:4px 0; flex-shrink:0 }
.wrap { flex:1; min-height:0; }
table { width:100%; border-collapse:collapse; height:100%; table-layout:fixed; }
td,th { overflow:hidden; }
</style></head><body>
<div class="no-print">
  <button class="btn" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn" style="background:#3C3C43" onclick="window.close()">✕ Fermer</button>
</div>
<div class="hd">
  <div class="date">⛱ ${dateStr}</div>
  <div class="stats">
    <div class="stat" style="background:#DCFCE7"><div class="stat-n" style="color:#14532D">${nbSlots}</div><div class="stat-l" style="color:#14532D">transats</div></div>
    <div class="stat" style="background:#CCFBF1"><div class="stat-n" style="color:#134E4A">${nbRT}</div><div class="stat-l" style="color:#134E4A">RT</div></div>
    <div class="pills">
      ${nbS1   ? `<span class="pill" style="background:#16A34A">S1 · ${nbS1}</span>`   : ''}
      ${nbS2   ? `<span class="pill" style="background:#2563EB">S2 · ${nbS2}</span>`   : ''}
      ${nbSoir ? `<span class="pill" style="background:#7C3AED">Soir · ${nbSoir}</span>` : ''}
    </div>
    ${unplcd.length ? `<div class="stat" style="background:#FFFBEB"><div class="stat-n" style="color:#92400E">${unplcd.length}</div><div class="stat-l" style="color:#92400E">⚠ non placés</div></div>` : ''}
  </div>
</div>
<div class="bar" style="background:linear-gradient(90deg,#6B7280,#4B5563)">▲ Restaurant</div>
<div class="wrap">
  <table>
    ${colHeaders}
    ${renderRow100()}
    ${TR_ROWS.filter(r=>r.id!==100).map(r=>renderDataRow(r.id,r.sea)).join('')}
  </table>
</div>
<div class="bar" style="background:linear-gradient(90deg,#0EA5E9,#0D9488)">〰 Mer Méditerranée 〰</div>
${unplacedHtml}
</body></html>`;

  openPrintWindow(html);
}

// ══════════════════════════════════════════
// PLAN DE SALLE JOUR — 2 colonnes S1 / S2
// Format identique au plan papier : grille complète, double en-tête DATE/RÉSERVATIONS
// ══════════════════════════════════════════
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
