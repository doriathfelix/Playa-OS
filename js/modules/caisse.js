// ══════════════════════════════════════════
// CAISSE · L'Addition Suite
// ══════════════════════════════════════════
function renderCaisse(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2';
  c.appendChild(page);

  const hdr = document.createElement('div');
  hdr.style.cssText = 'margin-bottom:20px;display:flex;align-items:flex-end;justify-content:space-between';
  hdr.innerHTML = `
    <div>
      <div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:2px">Caisse du jour</div>
      <div style="font-size:12px;color:var(--t3);display:flex;align-items:center;gap:8px">
        <span style="width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 0 3px rgba(22,163,74,.2)"></span>
        L'Addition Suite · Service ouvert 10:19 · Ticket <span style="font-family:'DM Mono',monospace;font-weight:600;color:var(--t2)">#AIC1R-8895</span>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="toast('Ouverture tiroir-caisse')" style="padding:9px 14px;border-radius:10px;border:1px solid var(--sep);background:var(--card);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--t2)">💶 Tiroir</button>
      <button onclick="toast('Nouveau ticket')" style="padding:9px 16px;border-radius:10px;border:none;background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">+ Ticket</button>
    </div>
  `;
  page.appendChild(hdr);

  // KPI Service en cours
  const kpi = document.createElement('div');
  kpi.style.cssText = 'display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:18px';
  [
    {l:'Couverts servis', v:'23', s:'/ ~85 attendus', col:'#16A34A'},
    {l:'Total HT', v:'736,75€', s:'', col:'#2563EB'},
    {l:'TVA collectée', v:'86,55€', s:'10% + 20%', col:'#7C3AED'},
    {l:'Total TTC', v:'823,30€', s:'', col:'#1A7A3E'},
    {l:'Panier moyen', v:'35,80€', s:'↑ +2,30€ vs semaine', col:'#D97706'}
  ].forEach(k => {
    const d = document.createElement('div');
    d.style.cssText = `background:var(--card);border:0.5px solid var(--sep);border-left:3px solid ${k.col};border-radius:0 12px 12px 0;padding:14px 16px`;
    d.innerHTML = `
      <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.09em">${k.l}</div>
      <div style="font-size:20px;font-weight:700;color:var(--t1);margin:4px 0;font-family:'DM Mono',monospace;letter-spacing:-.3px">${k.v}</div>
      <div style="font-size:10.5px;color:var(--t3);line-height:1.3">${k.s}</div>
    `;
    kpi.appendChild(d);
  });
  page.appendChild(kpi);

  // Layout 2 colonnes : tickets en cours + moyens de paiement
  const g2 = document.createElement('div');
  g2.style.cssText = 'display:grid;grid-template-columns:1.4fr 1fr;gap:14px;margin-bottom:14px';
  page.appendChild(g2);

  // Tickets en cours
  const tickets = document.createElement('div');
  tickets.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  tickets.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--t1)">Tickets en cours</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">7 tables en service actuellement</div>
      </div>
      <span style="font-size:10px;font-weight:700;color:var(--gt);background:var(--gbg);border-radius:20px;padding:3px 10px">7 ouverts</span>
    </div>
    <div>
      ${[
        {t:'T5', n:'Dubois', pax:5, items:12, mt:'142,50€', s:'Dessert', c:'#1A7A3E'},
        {t:'T19', n:'Santoni', pax:4, items:8, mt:'98,20€', s:'Plat', c:'#D97706'},
        {t:'T8', n:'Mercier', pax:6, items:15, mt:'186,30€', s:'Apéro', c:'#2563EB'},
        {t:'T23', n:'Roux', pax:2, items:5, mt:'48,60€', s:'Plat', c:'#D97706'},
        {t:'T11', n:'Petit', pax:4, items:9, mt:'115,80€', s:'Digestif', c:'#7C3AED'},
        {t:'T2', n:'Garcia', pax:3, items:6, mt:'72,00€', s:'Apéro', c:'#2563EB'},
        {t:'T17', n:'Bellin', pax:2, items:3, mt:'36,50€', s:'Apéro', c:'#2563EB'}
      ].map(x => `
        <div style="display:grid;grid-template-columns:50px 1fr 60px 70px 90px 80px;gap:12px;align-items:center;padding:10px 16px;border-bottom:0.5px solid var(--bg);cursor:pointer;transition:background .12s" onmouseenter="this.style.background='var(--bg)'" onmouseleave="this.style.background=''">
          <div style="display:inline-block;padding:4px 8px;border-radius:6px;background:var(--bg2);color:var(--t1);font-size:11px;font-weight:700;text-align:center;font-family:'DM Mono',monospace">${x.t}</div>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--t1)">${x.n}</div>
            <div style="font-size:10px;color:var(--t3)">${x.pax} couverts · ${x.items} articles</div>
          </div>
          <div></div>
          <div style="font-size:10px;font-weight:700;color:${x.c};text-align:center;padding:3px 8px;border-radius:20px;background:${x.c}15">${x.s}</div>
          <div style="text-align:right;font-size:13px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${x.mt}</div>
          <button style="padding:6px 10px;border-radius:8px;border:1px solid var(--sep);background:var(--card);font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">Encaisser →</button>
        </div>
      `).join('')}
    </div>
  `;
  g2.appendChild(tickets);

  // Moyens de paiement
  const payments = document.createElement('div');
  payments.style.cssText = 'display:flex;flex-direction:column;gap:10px';

  const payCard = document.createElement('div');
  payCard.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;padding:16px';
  payCard.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:14px">Répartition encaissements</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${[
        {n:'💳 CB sans contact', v:'482,40€', pct:58, col:'#2563EB'},
        {n:'💳 CB classique', v:'186,20€', pct:23, col:'#0284C7'},
        {n:'💵 Espèces', v:'92,70€', pct:11, col:'#16A34A'},
        {n:'📱 Tickets restau', v:'42,00€', pct:5, col:'#D97706'},
        {n:'🎁 Bons cadeaux', v:'20,00€', pct:3, col:'#7C3AED'}
      ].map(x => `
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11.5px">
            <span style="color:var(--t2);font-weight:500">${x.n}</span>
            <span style="font-weight:700;font-family:'DM Mono',monospace;color:var(--t1)">${x.v}</span>
          </div>
          <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${x.pct}%;background:${x.col};border-radius:3px;transition:width .4s"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  payments.appendChild(payCard);

  // Clôture
  const closeCard = document.createElement('div');
  closeCard.style.cssText = 'background:linear-gradient(135deg,#FEF2F2,#FEE2E2);border:0.5px solid #FCA5A5;border-radius:14px;padding:16px';
  closeCard.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
      <div style="width:32px;height:32px;border-radius:10px;background:var(--red);color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">◉</div>
      <div>
        <div style="font-size:12.5px;font-weight:700;color:var(--rt)">Clôture de service</div>
        <div style="font-size:11px;color:var(--rt);opacity:.75;margin-top:2px;line-height:1.4">Le service peut être clôturé après encaissement des 7 tickets en cours.</div>
      </div>
    </div>
    <button onclick="toast('Clôture en préparation…')" style="width:100%;padding:11px;border:none;background:var(--red);color:#fff;font-size:12px;font-weight:600;border-radius:10px;cursor:pointer;font-family:inherit">Initier clôture Z</button>
  `;
  payments.appendChild(closeCard);

  g2.appendChild(payments);

  // Historique jours précédents
  const hist = document.createElement('div');
  hist.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  hist.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Historique · 7 derniers jours</div>
      <button onclick="toast('Export CSV en cours…')" style="padding:6px 12px;border-radius:8px;border:1px solid var(--sep);background:var(--card);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">↓ Export</button>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="border-bottom:0.5px solid var(--sep);background:var(--bg)">
          <th style="text-align:left;padding:10px 16px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Date</th>
          <th style="text-align:right;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Couverts</th>
          <th style="text-align:right;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">CA TTC</th>
          <th style="text-align:right;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Ticket ⌀</th>
          <th style="text-align:right;padding:10px 16px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Z</th>
        </tr>
      </thead>
      <tbody>
        ${[
          {d:'Dim 13 avr', c:63, ca:'3 850€', tm:'61,10€', z:'Z-1412'},
          {d:'Sam 12 avr', c:104, ca:'6 420€', tm:'61,70€', z:'Z-1411'},
          {d:'Ven 11 avr', c:98, ca:'5 840€', tm:'59,60€', z:'Z-1410'},
          {d:'Jeu 10 avr', c:52, ca:'3 100€', tm:'59,60€', z:'Z-1409'},
          {d:'Mer 9 avr', c:58, ca:'3 420€', tm:'58,90€', z:'Z-1408'},
          {d:'Mar 8 avr', c:44, ca:'2 650€', tm:'60,20€', z:'Z-1407'},
          {d:'Lun 7 avr', c:34, ca:'1 980€', tm:'58,20€', z:'Z-1406'}
        ].map(x => `
          <tr style="border-bottom:0.5px solid var(--bg);cursor:pointer;transition:background .12s" onmouseenter="this.style.background='var(--bg)'" onmouseleave="this.style.background=''">
            <td style="padding:10px 16px;font-weight:600;color:var(--t1)">${x.d}</td>
            <td style="text-align:right;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace">${x.c}</td>
            <td style="text-align:right;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${x.ca}</td>
            <td style="text-align:right;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace">${x.tm}</td>
            <td style="text-align:right;padding:10px 16px;color:var(--t3);font-family:'DM Mono',monospace;font-size:10px">${x.z}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  page.appendChild(hist);
}

