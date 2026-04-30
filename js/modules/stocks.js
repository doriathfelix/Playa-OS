// ══════════════════════════════════════════
// STOCKS — La Playa en Camargue
// ══════════════════════════════════════════
function renderStocks(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2';
  c.appendChild(page);

  const hdr = document.createElement('div');
  hdr.style.cssText = 'margin-bottom:20px;display:flex;align-items:flex-end;justify-content:space-between';
  hdr.innerHTML = `
    <div>
      <div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:2px">Stocks & Commandes</div>
      <div style="font-size:12px;color:var(--t3)">46 articles suivis · Dernière MAJ 10:24</div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="toast('Inventaire lancé')" style="padding:9px 14px;border-radius:10px;border:1px solid var(--sep);background:var(--card);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--t2)">📋 Inventaire</button>
      <button onclick="toast('Commande envoyée')" style="padding:9px 16px;border-radius:10px;border:none;background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">+ Commander</button>
    </div>
  `;
  page.appendChild(hdr);

  // KPIs
  const kpi = document.createElement('div');
  kpi.style.cssText = 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:18px';
  [
    {l:'Articles suivis', v:'46', s:'Cuisine · Bar · Vins · Plage', col:'#2563EB'},
    {l:'Alertes rupture', v:'2', s:"Citrons · Huile d'olive", col:'#DC2626'},
    {l:'Valeur du stock', v:'3 840€', s:'Estimation au jour', col:'#1A7A3E'},
    {l:'Livraison prévue', v:'Demain 8h', s:'Metro + Marché d\'Arles', col:'#D97706'}
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

  // Liste complète par catégorie
  const g2 = document.createElement('div');
  g2.style.cssText = 'display:grid;grid-template-columns:2fr 1fr;gap:14px';
  page.appendChild(g2);

  // Niveau de stock
  const levels = document.createElement('div');
  levels.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  levels.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Niveaux de stock</div>
      <div style="display:flex;gap:6px;font-size:10px">
        <span style="padding:3px 9px;border-radius:20px;background:var(--rbg);color:var(--rt);font-weight:700">2 critiques</span>
        <span style="padding:3px 9px;border-radius:20px;background:var(--obg);color:var(--ot);font-weight:700">3 bas</span>
      </div>
    </div>
  `;

  const stockList = document.createElement('div');
  stockList.style.cssText = 'padding:6px 0';

  const stocks = [
    {cat:'Cuisine', items:[
      {n:'Citrons de Menton', v:0.08, col:'#DC2626', qty:'0.5 kg', lvl:'Critique'},
      {n:"Huile d'olive extra", v:0.18, col:'#DC2626', qty:'1.2 L', lvl:'Critique'},
      {n:'Taureau AOP Camargue', v:0.42, col:'#D97706', qty:'3.5 kg', lvl:'Bas'},
      {n:'Riz rouge IGP Camargue', v:0.55, col:'#16A34A', qty:'7 kg'},
      {n:'Loups de ligne', v:0.65, col:'#16A34A', qty:'6 pièces · 3.2 kg'},
      {n:'Tellines fraîches', v:0.75, col:'#16A34A', qty:'4 kg'},
      {n:'Tomates cœur de bœuf', v:0.80, col:'#16A34A', qty:'12 kg'},
      {n:'Tapenade maison', v:0.92, col:'#16A34A', qty:'2.5 L'}
    ]},
    {cat:'Vins & Alcools', items:[
      {n:'Picpoul de Pinet', v:0.30, col:'#D97706', qty:'4 btl', lvl:'Bas'},
      {n:'Rosé des Sables IGP', v:0.70, col:'#16A34A', qty:'14 btl'},
      {n:'Costières de Nîmes', v:0.85, col:'#16A34A', qty:'22 btl'},
      {n:'Pastis 51', v:0.25, col:'#D97706', qty:'0.8 L', lvl:'Bas'},
      {n:'Rhum blanc Barbancourt', v:0.60, col:'#16A34A', qty:'2.8 L'}
    ]},
    {cat:'Plage', items:[
      {n:'Draps transats', v:0.92, col:'#16A34A', qty:'101 u'},
      {n:'Produit solaire SPF 50', v:0.55, col:'#16A34A', qty:'14 tubes'},
      {n:'Parasols', v:0.82, col:'#16A34A', qty:'22 u'}
    ]}
  ];

  stocks.forEach(cat => {
    const sec = document.createElement('div');
    sec.innerHTML = `<div style="padding:10px 16px 6px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;background:var(--bg)">${cat.cat}</div>`;
    cat.items.forEach(it => {
      const pct = Math.round(it.v * 100);
      sec.innerHTML += `
        <div style="display:grid;grid-template-columns:1fr 120px 60px 70px;gap:14px;align-items:center;padding:10px 16px;border-bottom:0.5px solid var(--bg)">
          <div style="font-size:12px;font-weight:600;color:var(--t1)">${it.n}</div>
          <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden">
            <div style="height:100%;background:${it.col};width:${pct}%;border-radius:3px"></div>
          </div>
          <div style="font-size:11px;color:var(--t2);font-family:'DM Mono',monospace;text-align:right">${it.qty}</div>
          <div style="text-align:right">${it.lvl ? `<span style="font-size:9px;font-weight:700;padding:3px 9px;border-radius:20px;background:${it.lvl==='Critique'?'var(--rbg)':'var(--obg)'};color:${it.lvl==='Critique'?'var(--rt)':'var(--ot)'}">${it.lvl}</span>` : ''}</div>
        </div>
      `;
    });
    stockList.appendChild(sec);
  });
  levels.appendChild(stockList);
  g2.appendChild(levels);

  // Commandes suggérées
  const cmd = document.createElement('div');
  cmd.style.cssText = 'display:flex;flex-direction:column;gap:10px';

  const cmdCard = document.createElement('div');
  cmdCard.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  cmdCard.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep)">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Commandes suggérées</div>
      <div style="font-size:11px;color:var(--t3);margin-top:2px">Basé sur prévision 200 couverts samedi</div>
    </div>
    <div style="padding:10px 0">
      ${[
        {n:'Citrons 4 kg', s:"Marché d'Arles", p:'18€', lvl:'Critique'},
        {n:"Huile d'olive 3L", s:'Metro', p:'42€', lvl:'Critique'},
        {n:'Taureau AOP 6kg', s:'Boucherie Aubanel', p:'165€', lvl:'Urgent'},
        {n:'Pastis 51 × 2', s:'Metro', p:'38€', lvl:'Préventif'},
        {n:'Picpoul 12 btl', s:'Caviste', p:'96€', lvl:'Préventif'}
      ].map(x => {
        const colors = {
          Critique:{bg:'var(--rbg)', c:'var(--rt)'},
          Urgent:{bg:'var(--obg)', c:'var(--ot)'},
          Préventif:{bg:'var(--bbg)', c:'var(--bt)'}
        };
        const co = colors[x.lvl];
        return `
          <div style="padding:8px 16px;border-bottom:0.5px solid var(--bg)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
              <span style="font-size:12px;font-weight:600;color:var(--t1)">${x.n}</span>
              <span style="font-size:12px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${x.p}</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:10px;color:var(--t3)">${x.s}</span>
              <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:20px;background:${co.bg};color:${co.c}">${x.lvl}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="padding:10px 16px;border-top:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between;background:var(--bg)">
      <span style="font-size:11px;color:var(--t3)">Total estimé</span>
      <span style="font-size:14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">359€</span>
    </div>
    <button onclick="toast('Bon de commande généré ✓')" style="width:100%;padding:12px;border:none;border-top:0.5px solid var(--sep);background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">Générer le bon de commande</button>
  `;
  cmd.appendChild(cmdCard);

  // IA insight
  const ai = document.createElement('div');
  ai.style.cssText = 'background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:0.5px solid var(--pbd);border-radius:14px;padding:14px';
  ai.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <div style="width:22px;height:22px;border-radius:6px;background:var(--purple);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700">✦</div>
      <span style="font-size:12px;font-weight:700;color:var(--pt)">Insight Playa AI</span>
    </div>
    <div style="font-size:11.5px;color:var(--pt);line-height:1.5">Les tellines se vendent <b>+40% quand T°C > 25°C</b>. La météo samedi annonce 28°C. Je recommande une commande pré-samedi de <b>+3 kg</b>.</div>
  `;
  cmd.appendChild(ai);

  g2.appendChild(cmd);
}

