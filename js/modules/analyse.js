// ══════════════════════════════════════════
// ANALYSE & CAISSE
// ══════════════════════════════════════════
function renderAnalyse(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2';
  c.appendChild(page);

  const hdr = document.createElement('div');
  hdr.style.cssText = 'margin-bottom:20px;display:flex;align-items:flex-end;justify-content:space-between';
  hdr.innerHTML = `
    <div>
      <div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:2px">Analyse & Caisse</div>
      <div style="font-size:12px;color:var(--t3)">Avril 2026 · Connecté à L'Addition Suite</div>
    </div>
    <div style="display:flex;gap:6px;background:var(--card);border:1px solid var(--sep);border-radius:10px;padding:3px">
      ${['Jour','Semaine','Mois','Année'].map((p,i) => `<button onclick="toast('Période '+this.textContent)" style="padding:7px 14px;border:none;background:${i===2?'var(--t1)':'none'};color:${i===2?'#fff':'var(--t2)'};font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;border-radius:7px">${p}</button>`).join('')}
    </div>
  `;
  page.appendChild(hdr);

  // KPI ligne
  const kpi = document.createElement('div');
  kpi.style.cssText = 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:18px';
  [
    {l:'CA du mois', v:'48 200€', s:'↑ +14% vs avril 2025', col:'#1A7A3E'},
    {l:'Ticket moyen', v:'46€', s:'↑ +3€ vs mars', col:'#2563EB'},
    {l:'Taux remplissage', v:'82%', s:'↑ +7 pts vs mars', col:'#7C3AED'},
    {l:'Revenus transats', v:'5 800€', s:'115% de l\'objectif', col:'#D97706'}
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

  // Layout 2 colonnes
  const g2 = document.createElement('div');
  g2.style.cssText = 'display:grid;grid-template-columns:1.4fr 1fr;gap:14px;margin-bottom:14px';
  page.appendChild(g2);

  // Chart CA par jour (SVG)
  const caCard = document.createElement('div');
  caCard.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;padding:16px 18px';

  const caData = [['Lun',1980],['Mar',2650],['Mer',3420],['Jeu',3100],['Ven',5840],['Sam',6420],['Dim',3850]];
  const max = Math.max(...caData.map(d=>d[1]));
  const avgLine = 3900;

  caCard.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--t1)">CA par jour · semaine 15</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Total semaine : <b style="color:var(--t1)">27 260€</b></div>
      </div>
      <div style="font-size:10px;font-weight:600;color:var(--t3);display:flex;align-items:center;gap:4px">
        <span style="width:14px;height:2px;background:var(--s1);border-radius:1px"></span>Moyenne 3 900€
      </div>
    </div>
    <div style="position:relative;height:180px;display:flex;align-items:flex-end;gap:12px;padding-bottom:28px;padding-top:8px">
      ${caData.map(([d,v]) => {
        const h = (v/max)*100;
        const isBest = v === max;
        const col = isBest ? 'var(--s1)' : v >= avgLine ? 'var(--teal)' : 'var(--t5)';
        return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">
            <div style="font-size:10px;font-weight:700;color:${col};font-family:'DM Mono',monospace">${v}€</div>
            <div style="width:100%;height:${h}%;background:${col};border-radius:6px 6px 0 0;min-height:4px;transition:all .3s"></div>
            <div style="position:absolute;bottom:0;font-size:10px;font-weight:600;color:var(--t3)">${d}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:0.5px solid var(--sep);margin-top:8px">
      <span style="font-size:11px;color:var(--t3)">Meilleur jour : <b style="color:var(--t1)">Samedi · 82 couverts</b></span>
      <span style="font-size:11px;color:var(--gt);font-weight:600">↑ +22% vs semaine N-1</span>
    </div>
  `;
  g2.appendChild(caCard);

  // Top plats
  const topCard = document.createElement('div');
  topCard.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  topCard.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep)">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Top ventes du mois</div>
    </div>
    <div style="padding:6px 0">
      ${[
        {n:'Mojito maison', v:204, t:'+31%', p:'12€', up:true},
        {n:'Loup entier grillé', v:142, t:'+22%', p:'34€', up:true},
        {n:'Tellines à la persillade', v:118, t:'+15%', p:'18€', up:true},
        {n:'Gardiane de taureau', v:98, t:'+18%', p:'22€', up:true},
        {n:'Risotto riz rouge encornets', v:87, t:'+12%', p:'24€', up:true},
        {n:'Salade de la plage', v:74, t:'+8%', p:'16€', up:true},
        {n:'Rosé des Sables btl', v:156, t:'+24%', p:'32€', up:true},
        {n:"Côte d'agneau des Alpilles", v:45, t:'-5%', p:'36€', up:false}
      ].map((x,i) => `
        <div style="display:grid;grid-template-columns:24px 1fr 60px 50px 60px;gap:10px;align-items:center;padding:9px 16px;border-bottom:0.5px solid var(--bg)">
          <div style="font-size:10px;font-weight:700;color:var(--t4);font-family:'DM Mono',monospace">${String(i+1).padStart(2,'0')}</div>
          <div style="font-size:12px;font-weight:600;color:var(--t1)">${x.n}</div>
          <div style="font-size:11px;color:var(--t2);font-family:'DM Mono',monospace;text-align:right">${x.v} ventes</div>
          <div style="font-size:11px;color:var(--t3);font-family:'DM Mono',monospace;text-align:right">${x.p}</div>
          <div style="font-size:11px;font-weight:700;color:${x.up?'var(--gt)':'var(--rt)'};text-align:right;font-family:'DM Mono',monospace">${x.up?'↑':'↓'} ${x.t}</div>
        </div>
      `).join('')}
    </div>
  `;
  g2.appendChild(topCard);

  // Service du jour — L'Addition
  const serviceCard = document.createElement('div');
  serviceCard.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;padding:16px 18px';
  serviceCard.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--t1)">Service en cours · L'Addition</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Ouvert le 17 avr. à 10:19 · n°AIC1R-8895</div>
      </div>
      <button onclick="toast('Clôture initiée')" style="padding:8px 14px;border-radius:20px;border:none;background:var(--red);color:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">◉ Initier clôture</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
      ${[
        {l:'Couverts', v:'23', s:''},
        {l:'Panier moyen', v:'35,80€', s:''},
        {l:'Total HT', v:'736,75€', s:''},
        {l:'Total TTC', v:'823,30€', s:''},
        {l:'TVA totale', v:'86,55€', s:''}
      ].map(k => `
        <div style="background:var(--bg);border-radius:10px;padding:12px">
          <div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">${k.l}</div>
          <div style="font-size:17px;font-weight:700;color:var(--t1);margin-top:4px;font-family:'DM Mono',monospace;letter-spacing:-.3px">${k.v}</div>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:6px;margin-top:14px">
      <button onclick="toast('Rapport X')" style="flex:1;padding:10px;border:1px solid var(--sep);background:var(--card);border-radius:10px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">📄 Rapport X</button>
      <button onclick="toast('Rapport filtré')" style="flex:1;padding:10px;border:1px solid var(--sep);background:var(--card);border-radius:10px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">🔎 Rapport filtré</button>
      <button onclick="toast('Tiroir caisse ouvert')" style="flex:1;padding:10px;border:1px solid var(--sep);background:var(--card);border-radius:10px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">💶 Tiroir caisse</button>
    </div>
  `;
  page.appendChild(serviceCard);
}

