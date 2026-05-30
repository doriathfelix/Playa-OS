// RÉSERVATIONS — Vue agenda
// ══════════════════════════════════════════
function renderResasModule(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2';
  c.appendChild(page);

  const hdr = document.createElement('div');
  hdr.style.cssText = 'margin-bottom:20px;display:flex;align-items:flex-end;justify-content:space-between';
  const total = Object.values(reservations).flat().filter(r=>!r.ns).length;
  const nonPlaces = Object.values(reservations).flat().filter(r=>!r.placed&&!r.ns).length;
  hdr.innerHTML = `
    <div>
      <div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:2px">Réservations</div>
      <div style="font-size:12px;color:var(--t3)">${total} au total · ${nonPlaces} non placées · Synchronisé Zenchef</div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="toast('Synchro Zenchef')" style="padding:9px 14px;border-radius:10px;border:1px solid var(--sep);background:var(--card);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--t2)">⟳ Synchroniser</button>
      <button onclick="goModule('service')" style="padding:9px 16px;border-radius:10px;border:none;background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">Voir plan de salle →</button>
    </div>
  `;
  page.appendChild(hdr);

  // KPI
  const kpi = document.createElement('div');
  kpi.style.cssText = 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:18px';
  const paxS1 = reservations.s1.filter(r=>!r.ns&&!r.repas_transat).reduce((s,r)=>s+r.pax,0);
  const paxS2 = reservations.s2.filter(r=>!r.ns).reduce((s,r)=>s+r.pax,0);
  const paxSoir = reservations.soir.filter(r=>!r.ns).reduce((s,r)=>s+r.pax,0);
  const paxTr = reservations.transats.filter(r=>!r.ns).reduce((s,r)=>s+(r.tr||r.pax),0);
  [
    {l:'Service 1 · 12h', v:paxS1+' PAX', s:reservations.s1.filter(r=>!r.ns&&!r.repas_transat).length+' tables', col:'#1A7A3E'},
    {l:'Service 2 · 14h15', v:paxS2+' PAX', s:reservations.s2.filter(r=>!r.ns).length+' tables', col:'#D97706'},
    {l:'Transats · journée', v:paxTr+' trs', s:reservations.transats.filter(r=>!r.ns).length+' resas', col:'#0284C7'},
    {l:'Soir · 19h30', v:paxSoir+' PAX', s:reservations.soir.filter(r=>!r.ns).length+' tables', col:'#7C3AED'}
  ].forEach(k => {
    const d = document.createElement('div');
    d.style.cssText = `background:var(--card);border:0.5px solid var(--sep);border-left:3px solid ${k.col};border-radius:0 12px 12px 0;padding:14px 16px`;
    d.innerHTML = `
      <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.09em">${k.l}</div>
      <div style="font-size:22px;font-weight:700;color:var(--t1);margin:4px 0;font-family:'DM Mono',monospace;letter-spacing:-.5px">${k.v}</div>
      <div style="font-size:11px;color:var(--t3)">${k.s}</div>
    `;
    kpi.appendChild(d);
  });
  page.appendChild(kpi);

  // Timeline du jour
  const timeline = document.createElement('div');
  timeline.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden;margin-bottom:14px';
  timeline.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep)">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Timeline du jour</div>
      <div style="font-size:11px;color:var(--t3);margin-top:2px">Aperçu chronologique des arrivées prévues</div>
    </div>
    <div style="padding:18px">
  `;
  const timelineBody = document.createElement('div');
  timelineBody.style.cssText = 'position:relative;display:flex;flex-direction:column;gap:14px';

  const allResas = [...reservations.s1,...reservations.s2,...reservations.soir,...(reservations.soir2||[]),...reservations.transats]
    .filter(r=>!r.ns)
    .sort((a,b) => (a.time||'').localeCompare(b.time||''));

  const colByService = {s1:'#1A7A3E', s2:'#D97706', soir:'#7C3AED', soir2:'#7C3AED', transats:'#0284C7'};
  const bgByService = {s1:'#EDF7F1', s2:'#FEF6E8', soir:'#F0EDF9', soir2:'#F0EDF9', transats:'#E8F4FD'};

  if(allResas.length === 0){
    timelineBody.innerHTML = '<div style="text-align:center;padding:40px;color:var(--t3);font-size:12px">Aucune réservation synchronisée pour cette date</div>';
  } else {
    allResas.slice(0, 30).forEach(r => {
      const col = colByService[r.svc] || '#7C7A72';
      const bg = bgByService[r.svc] || '#FAFAF8';
      const row = document.createElement('div');
      row.style.cssText = `display:grid;grid-template-columns:80px 8px 1fr auto;gap:14px;align-items:center;padding:10px 12px;background:${bg};border-left:3px solid ${col};border-radius:0 10px 10px 0;cursor:pointer;transition:transform .1s`;
      row.onmouseenter = () => row.style.transform = 'translateX(2px)';
      row.onmouseleave = () => row.style.transform = '';
      row.onclick = () => { goModule('service'); };
      const statusIcon = r.placed ? '✓' : '⏳';
      const statusCol = r.placed ? 'var(--gt)' : 'var(--ot)';
      row.innerHTML = `
        <div style="font-family:'DM Mono',monospace;font-weight:700;font-size:13px;color:var(--t1)">${r.time||'--:--'}</div>
        <div style="width:8px;height:8px;border-radius:50%;background:${col}"></div>
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--t1)">${r.name}</div>
          <div style="font-size:10.5px;color:var(--t3);margin-top:1px">${r.pax} PAX ${r.tr?'· '+r.tr+' transats':''} ${r.comment?'· '+r.comment.substring(0,50):''}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          ${r.waiting ? '<span style="font-size:10px;font-weight:700;color:var(--ot);padding:2px 8px;border-radius:20px;background:var(--obg)">LISTE ATTENTE</span>' : ''}
          <span style="font-size:11px;font-weight:700;color:${statusCol}">${statusIcon}</span>
        </div>
      `;
      timelineBody.appendChild(row);
    });
  }

  timeline.innerHTML += '';
  timeline.lastElementChild.appendChild(timelineBody);
  page.appendChild(timeline);
}

// ══════════════════════════════════════════
