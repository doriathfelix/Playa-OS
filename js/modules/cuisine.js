// ══════════════════════════════════════════
// CUISINE — Fiches, recettes, process
// ══════════════════════════════════════════
function renderCuisine(c){
  let currentTab = 'fiches';
  const body = makePageShell(c, 'Cuisine',
    'Fiches techniques, recettes, process, food cost',
    [{label:'🖨 Fiche du jour', onclick:"toast('Impression en cours…')"},{label:'+ Fiche', onclick:"toast('Nouvelle fiche')", primary:true}]);

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Plats à la carte',    v:'24', s:'11 tapas · 3 entrées · 6 plats · 4 desserts', col:'#EA580C'},
      {l:'Food cost moyen',     v:'26%', s:'sur prix de vente HT', col:'#16A34A'},
      {l:'Produit signature',   v:'Bao Carlo', s:'Tentacule · mangue piment · 17€', col:'#7C3AED'},
      {l:'Meilleure marge',     v:'Smash ×7.1', s:'Coef multiplicateur', col:'#0284C7'}
    ]));
    const tabs = [
      {k:'fiches',    label:'📋 Fiches techniques'},
      {k:'foodcost',  label:'💰 Food Cost'},
      {k:'recettes',  label:'👨‍🍳 Recette vedette'},
      {k:'process',   label:'⏱ Process service'},
      {k:'formation', label:'🎓 Formation'}
    ];
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));
    if(currentTab === 'fiches')    renderFichesTab();
    else if(currentTab === 'foodcost')  renderFoodcostTab();
    else if(currentTab === 'recettes')  renderRecettesTab();
    else if(currentTab === 'process')   renderProcessTab();
    else if(currentTab === 'formation') renderFormationTab();
  }

  function renderFichesTab(){
    const SECTIONS = [
      { label:'Nos Tapas', col:'#EA580C', items:[
        {plat:'Bao de "Carlo" le tentacule, sauce mangue piment', prep:'10 min', cuisson:'5 min',  portion:'1 bao',       cout:2.55,  pv:17,   ing:6,  difficulty:'Facile'},
        {plat:'Pain perdu à l\'ail, joue de lotte persillade',    prep:'15 min', cuisson:'12 min', portion:'1 pièce',     cout:4.20,  pv:18,   ing:7,  difficulty:'Moyenne'},
        {plat:'Pain pita burrata, pesto maison',                  prep:'8 min',  cuisson:'3 min',  portion:'1 pita',      cout:3.50,  pv:16,   ing:5,  difficulty:'Facile'},
        {plat:'Mini tacos cochon basse température',              prep:'10 min', cuisson:'—',       portion:'2 tacos',     cout:2.80,  pv:12,   ing:6,  difficulty:'Facile'},
        {plat:'Palourdines à la crème d\'ail',                    prep:'5 min',  cuisson:'8 min',  portion:'200g',        cout:5.50,  pv:18,   ing:5,  difficulty:'Facile'},
        {plat:'Couteaux ×10 en persillade gratinés',              prep:'10 min', cuisson:'6 min',  portion:'×10',         cout:4.80,  pv:18,   ing:5,  difficulty:'Facile'},
        {plat:'Croque comté truffe, jambon italien truffé',       prep:'8 min',  cuisson:'5 min',  portion:'1 pièce',     cout:3.80,  pv:14,   ing:5,  difficulty:'Facile'},
        {plat:'Sardines de Médit\' plancha, sauce blanche épicée',prep:'5 min',  cuisson:'4 min',  portion:'4 sardines',  cout:2.80,  pv:12,   ing:5,  difficulty:'Facile'},
        {plat:'Fleurs de courgette tempura, yaourt aux herbes',   prep:'15 min', cuisson:'3 min',  portion:'3 fleurs',    cout:3.40,  pv:14.5, ing:7,  difficulty:'Moyenne'},
        {plat:'Pinsa truffe : roquette, burrata, tomates cerises',prep:'10 min', cuisson:'8 min',  portion:'1 pinsa',     cout:5.80,  pv:22,   ing:6,  difficulty:'Facile'},
        {plat:'Huîtres de Bouzigues ×6',                         prep:'5 min',  cuisson:'—',       portion:'×6',          cout:5.40,  pv:16,   ing:2,  difficulty:'Facile'},
      ]},
      { label:'Nos Entrées', col:'#0284C7', items:[
        {plat:'Tataki de taureau, pop Camargue, glace wasabi',          prep:'20 min', cuisson:'2 min', portion:'120g',  cout:7.20, pv:22, ing:8, difficulty:'Difficile'},
        {plat:'Ceviche poisson blanc au "leche de tigre"',              prep:'20 min', cuisson:'—',      portion:'150g',  cout:5.60, pv:22, ing:9, difficulty:'Moyenne'},
        {plat:'Salade pastèque, burrata, feta, pesto maison',           prep:'12 min', cuisson:'—',      portion:'250g',  cout:4.80, pv:22, ing:7, difficulty:'Facile'},
      ]},
      { label:'Les Plats', col:'#7C3AED', items:[
        {plat:'Smash burger bœuf de Galice, mayo fumée, frites',        prep:'10 min', cuisson:'6 min',  portion:'1 burger', cout:3.66,  pv:26, ing:6, difficulty:'Facile'},
        {plat:'Volaille et poulette, condiment pistache, lissé petit pois', prep:'30 min', cuisson:'45 min', portion:'180g', cout:4.10, pv:29, ing:8, difficulty:'Moyenne'},
        {plat:'Faux filet Wagyu 180g, jus réduit umami, carotte BBQ',   prep:'10 min', cuisson:'8 min',  portion:'180g',     cout:13.49, pv:56, ing:5, difficulty:'Difficile'},
        {plat:'Risotto au 3 riz de Camargue, car\'hot, ananas',         prep:'20 min', cuisson:'25 min', portion:'200g',     cout:5.80,  pv:26, ing:7, difficulty:'Moyenne'},
        {plat:'Notre filet de poisson, hollandaise aérienne',           prep:'15 min', cuisson:'12 min', portion:'200g',     cout:7.20,  pv:30, ing:9, difficulty:'Difficile'},
        {plat:'Poissons sauvages selon arrivages, riz Camargue',        prep:'15 min', cuisson:'15 min', portion:'€/kg',     cout:0,     pv:0,  ing:6, difficulty:'Moyenne'},
      ]},
      { label:'Nos Desserts', col:'#EC4899', items:[
        {plat:'Pélardon des Cévennes',                                           prep:'3 min',  cuisson:'—',       portion:'1 pièce',    cout:2.80, pv:10, ing:2, difficulty:'Facile'},
        {plat:'Gaspacho framboise, bavarois 2 citron, citron caviar',            prep:'25 min', cuisson:'—',       portion:'1 assiette', cout:3.20, pv:12, ing:7, difficulty:'Moyenne'},
        {plat:'K\'ouète tartelette, praliné pécan coco, ganache, glace chouchou',prep:'30 min', cuisson:'15 min',  portion:'1 tartelette',cout:4.20, pv:16, ing:9, difficulty:'Difficile'},
        {plat:'Clafoutis ananas flambé, sorbet coco — Piña Colada',              prep:'20 min', cuisson:'18 min',  portion:'1 assiette', cout:3.91, pv:14, ing:8, difficulty:'Moyenne'},
      ]},
    ];

    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;gap:18px';

    SECTIONS.forEach(sec => {
      const secHead = document.createElement('div');
      secHead.style.cssText = 'display:flex;align-items:center;gap:8px';
      secHead.innerHTML = `<div style="height:2px;flex:0 0 14px;background:${sec.col};border-radius:2px;"></div>`
        +`<span style="font-size:11px;font-weight:800;color:${sec.col};text-transform:uppercase;letter-spacing:.1em">${sec.label}</span>`
        +`<div style="flex:1;height:1px;background:${sec.col}30;"></div>`
        +`<span style="font-size:10px;color:var(--t3)">${sec.items.length} plats</span>`;
      container.appendChild(secHead);

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px';

      sec.items.forEach(f => {
        const marge = f.pv > 0 ? Math.round(((f.pv - f.cout) / f.pv) * 100) : null;
        const pvStr = f.pv > 0 ? (f.pv % 1 ? f.pv.toFixed(2) : f.pv)+'€' : '€/kg';
        const margeStr = marge !== null ? marge+'%' : '—';
        const coutStr = f.cout > 0 ? f.cout.toFixed(2)+'€' : '—';
        const margeCol = marge === null ? 'var(--t3)' : marge >= 72 ? '#16A34A' : marge >= 60 ? '#D97706' : '#DC2626';

        const card = document.createElement('div');
        card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:12px;overflow:hidden;cursor:pointer;transition:all .18s';
        card.onmouseenter = () => { card.style.borderColor = sec.col+'80'; card.style.transform = 'translateY(-1px)'; card.style.boxShadow = '0 4px 14px rgba(0,0,0,.06)'; };
        card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.transform = ''; card.style.boxShadow = ''; };
        card.onclick = () => toast('Fiche : '+f.plat);
        card.innerHTML = `
          <div style="padding:11px 14px;border-bottom:.5px solid var(--bg)">
            <div style="font-size:12.5px;font-weight:700;color:var(--t1);margin-bottom:4px;line-height:1.3">${f.plat}</div>
            <div style="display:flex;gap:4px">
              <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;background:${f.difficulty==='Facile'?'var(--gbg)':f.difficulty==='Difficile'?'var(--rbg)':'var(--obg)'};color:${f.difficulty==='Facile'?'var(--gt)':f.difficulty==='Difficile'?'var(--rt)':'var(--ot)'}">${f.difficulty}</span>
              <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;background:var(--bg2);color:var(--t2)">${f.ing} ingréd.</span>
            </div>
          </div>
          <div style="padding:8px 14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:11px;border-bottom:.5px solid var(--bg)">
            <div><div style="color:var(--t4);font-size:9px;font-weight:700;text-transform:uppercase">Prép.</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${f.prep}</div></div>
            <div><div style="color:var(--t4);font-size:9px;font-weight:700;text-transform:uppercase">Cuisson</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${f.cuisson}</div></div>
            <div><div style="color:var(--t4);font-size:9px;font-weight:700;text-transform:uppercase">Portion</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace;font-size:10px">${f.portion}</div></div>
          </div>
          <div style="padding:8px 14px;display:flex;justify-content:space-between;align-items:center;background:var(--bg)">
            <div><div style="font-size:9px;color:var(--t4);font-weight:700;text-transform:uppercase">Food cost</div><div style="font-size:13px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${coutStr}</div></div>
            <div style="text-align:center"><div style="font-size:9px;color:var(--t4);font-weight:700;text-transform:uppercase">PV</div><div style="font-size:13px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${pvStr}</div></div>
            <div style="text-align:right"><div style="font-size:9px;color:var(--t4);font-weight:700;text-transform:uppercase">Marge</div><div style="font-size:13px;font-weight:700;color:${margeCol};font-family:'DM Mono',monospace">${margeStr}</div></div>
          </div>`;
        grid.appendChild(card);
      });
      container.appendChild(grid);
    });
    body.appendChild(container);
  }

  function renderFoodcostTab(){
    const fiches = [
      {
        nom:'Volaille et poulette, condiment pistache', pv:29, prProduit:3.73, prVendu:4.10, perte:10,
        margebr:24.90, taux:607, coef:7.07,
        ing:[
          {art:'Dinde',         four:'Pomona',            unite:'pièce', cu:8.90,  qte:0.200, pr:1.78},
          {art:'Pistache',      four:'Pomona',            unite:'kg',    cu:35.00, qte:0.020, pr:0.70},
          {art:'Échalotte',     four:'Compère',           unite:'kg',    cu:3.00,  qte:0.020, pr:0.06},
          {art:'Sarriette',     four:'Compère',           unite:'pièce', cu:15.00, qte:0.009, pr:0.14},
          {art:'Petit pois',    four:'Pomona',            unite:'kg',    cu:3.00,  qte:0.090, pr:0.27},
          {art:'Carotte des sables',four:'Compère',       unite:'kg',    cu:4.00,  qte:0.070, pr:0.28},
          {art:'Crème fraîche', four:'Pomona',            unite:'kg',    cu:5.00,  qte:0.050, pr:0.25},
          {art:'Sauce poulette',four:'Maison',            unite:'—',     cu:5.00,  qte:0.050, pr:0.25}
        ]
      },
      {
        nom:'Bao de "Carlo" — tentacule de poulpe, mangue piment', pv:17, prProduit:2.55, prVendu:2.81, perte:10,
        margebr:14.19, taux:505, coef:6.05,
        ing:[
          {art:'Bao',              four:'Maison',            unite:'pièce', cu:0.08,  qte:2.000, pr:0.16},
          {art:'Tentacule poulpe', four:'Pomona',            unite:'kg',    cu:29.90, qte:0.050, pr:1.50},
          {art:'Mangue piment',    four:'Les Compères',      unite:'pièce', cu:0.30,  qte:1.000, pr:0.30},
          {art:'Huile olive',      four:'Pomona Es',         unite:'L',     cu:5.90,  qte:0.010, pr:0.06},
          {art:'Ail',              four:'Les Compères',      unite:'kg',    cu:4.00,  qte:0.010, pr:0.04},
          {art:'Sel Camargue',     four:'Pomona · Episaveurs',unite:'boîte',cu:5.00, qte:0.100, pr:0.50}
        ]
      },
      {
        nom:'Smash burger bœuf de Galice, mayo fumée', pv:26, prProduit:3.33, prVendu:3.66, perte:10,
        margebr:22.34, taux:611, coef:7.10,
        ing:[
          {art:'Pain brioche',  four:'Compère', unite:'pièce', cu:0.40, qte:1.000, pr:0.40},
          {art:'Bœuf Galice',   four:'Pomona',  unite:'kg',    cu:1.89, qte:1.000, pr:1.89},
          {art:'Mayo fumée',    four:'Pomona',  unite:'kg',    cu:0.05, qte:1.000, pr:0.05},
          {art:'Cheddar',       four:'Compère', unite:'pièce', cu:0.19, qte:1.000, pr:0.19},
          {art:'Condiments',    four:'Pomona',  unite:'—',     cu:0.30, qte:1.000, pr:0.30},
          {art:'Frites maison', four:'Maison',  unite:'kg',    cu:0.50, qte:1.000, pr:0.50}
        ]
      },
      {
        nom:'Clafoutis ananas flambé, sorbet coco — Piña Colada', pv:14, prProduit:3.55, prVendu:3.91, perte:10,
        margebr:10.09, taux:258, coef:3.58,
        ing:[
          {art:'Purée ananas',    four:'Pomona · Terre Azur',        unite:'kg', cu:1.53, qte:1.500, pr:2.30},
          {art:'Beurre',          four:'SAF',                         unite:'kg', cu:1.50, qte:0.500, pr:0.75},
          {art:'Ananas frais',    four:'Compères',                    unite:'L',  cu:6.32, qte:0.015, pr:0.09},
          {art:'Rhum',            four:'SAF',                         unite:'—',  cu:0,    qte:0,     pr:0},
          {art:'Œuf',             four:'SAF · Sysco · Episaveurs',    unite:'kg', cu:2.83, qte:0.040, pr:0.11},
          {art:'Lait coco',       four:'—',                           unite:'—',  cu:0,    qte:0,     pr:0},
          {art:'Crème Debic',     four:'SAF · Sysco · Passion Froid', unite:'kg', cu:7.00, qte:0.010, pr:0.07},
          {art:'Noix coco rapée', four:'Passion Froid',               unite:'L',  cu:4.62, qte:0.050, pr:0.23}
        ]
      },
      {
        nom:'Faux filet Wagyu 180g, jus réduit umami, carotte BBQ', pv:56, prProduit:12.26, prVendu:13.49, perte:10,
        margebr:42.51, taux:315, coef:4.15,
        ing:[
          {art:'Faux filet wagyu', four:'S2F',        unite:'kg', cu:62.00, qte:0.180, pr:11.16},
          {art:'Jus umami réduit', four:'Sysco',      unite:'L',  cu:0.80,  qte:1.000, pr:0.80},
          {art:'Carotte BBQ',      four:'Episaveurs', unite:'kg', cu:0.30,  qte:1.000, pr:0.30}
        ]
      }
    ];

    function coefCol(c){ return c >= 6 ? '#16A34A' : c >= 4 ? '#D97706' : '#DC2626'; }
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px';

    fiches.forEach(f => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
      const col = coefCol(f.coef);

      const hdr = document.createElement('div');
      hdr.style.cssText = `padding:12px 16px;border-bottom:.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between;background:${col}08;cursor:pointer`;
      hdr.innerHTML = `
        <div>
          <div style="font-size:13.5px;font-weight:800;color:var(--t1)">${f.nom}</div>
          <div style="font-size:11px;color:var(--t3);margin-top:1px">1 portion · perte ${f.perte}%</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;color:var(--t4);text-transform:uppercase;font-weight:700">Coef</div>
          <div style="font-size:22px;font-weight:900;color:${col};font-family:'DM Mono',monospace;line-height:1">${f.coef.toFixed(2)}</div>
        </div>`;

      const kpis = document.createElement('div');
      kpis.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);border-bottom:.5px solid var(--sep)';
      [{l:'PR produit',v:f.prProduit.toFixed(2)+'€',c:'var(--t1)'},{l:'PR vendu',v:f.prVendu.toFixed(2)+'€',c:'var(--t1)'},{l:'PV',v:f.pv+'€',c:'var(--t1)'},{l:'Taux marge',v:f.taux+'%',c:col}]
        .forEach((k,i) => { kpis.innerHTML += `<div style="padding:10px 12px;${i<3?'border-right:.5px solid var(--sep)':''}"><div style="font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">${k.l}</div><div style="font-size:13px;font-weight:800;color:${k.c};font-family:'DM Mono',monospace">${k.v}</div></div>`; });

      const tblWrap = document.createElement('div');
      tblWrap.style.display = 'none';
      tblWrap.style.padding = '0 0 8px';
      let tblHtml = `<table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:var(--bg)"><th style="padding:7px 12px;text-align:left;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">Article</th><th style="padding:7px 8px;text-align:left;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">Fournisseur</th><th style="padding:7px 8px;text-align:center;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">Unité</th><th style="padding:7px 8px;text-align:right;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">Coût/u</th><th style="padding:7px 8px;text-align:right;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">Qté</th><th style="padding:7px 12px;text-align:right;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase">PR HT</th></tr></thead><tbody>`;
      f.ing.forEach((ing,i) => {
        const bg = i%2===0?'':'background:var(--bg)';
        tblHtml += `<tr style="${bg}"><td style="padding:6px 12px;font-weight:600;color:var(--t1)">${ing.art}</td><td style="padding:6px 8px;color:var(--t3)">${ing.four}</td><td style="padding:6px 8px;color:var(--t3);text-align:center">${ing.unite}</td><td style="padding:6px 8px;text-align:right;font-family:'DM Mono',monospace;color:var(--t2)">${ing.cu>0?ing.cu.toFixed(2)+'€':'—'}</td><td style="padding:6px 8px;text-align:right;font-family:'DM Mono',monospace;color:var(--t2)">${ing.qte>0?ing.qte.toFixed(3):'—'}</td><td style="padding:6px 12px;text-align:right;font-family:'DM Mono',monospace;font-weight:700;color:var(--t1)">${ing.pr>0?ing.pr.toFixed(2)+'€':'—'}</td></tr>`;
      });
      tblHtml += `</tbody><tfoot><tr style="background:${col}10;border-top:1.5px solid ${col}40"><td colspan="5" style="padding:8px 12px;font-weight:800;color:var(--t1);font-size:11.5px">Total PR HT</td><td style="padding:8px 12px;text-align:right;font-weight:900;color:${col};font-family:'DM Mono',monospace;font-size:13px">${f.prProduit.toFixed(2)}€</td></tr></tfoot></table>`;
      tblWrap.innerHTML = tblHtml;

      let open = false;
      const toggleBtn = document.createElement('button');
      toggleBtn.style.cssText = `width:100%;padding:8px 16px;border:none;border-top:.5px solid var(--sep);background:var(--bg);font-size:11px;font-weight:600;color:var(--t3);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px`;
      toggleBtn.innerHTML = '▾ Voir les ingrédients';
      toggleBtn.onclick = () => { open=!open; tblWrap.style.display=open?'block':'none'; toggleBtn.innerHTML=open?'▴ Masquer':'▾ Voir les ingrédients'; };

      card.appendChild(hdr); card.appendChild(kpis); card.appendChild(tblWrap); card.appendChild(toggleBtn);
      wrap.appendChild(card);
    });
    body.appendChild(wrap);
  }

  function renderRecettesTab(){
    const recipe = {
      nom: 'Tataki de taureau de Camargue',
      portion: '1 pers · 120g',
      cout: 7.20, pv: 22,
      ing:[
        {q:'120g',       name:'Filet de taureau AOP Camargue'},
        {q:'30g',        name:'Pop Camargue (maïs soufflé assaisonné)'},
        {q:'1 c.s.',     name:'Wam à la croque (condiment maison)'},
        {q:'30g',        name:'Glace wasabi maison'},
        {q:'2 c.s.',     name:'Sauce ponzu citron'},
        {q:'QS',         name:'Fleur de sel de Camargue'},
        {q:'QS',         name:'Huile d\'olive fruité vert'}
      ],
      etapes:[
        {t:0,  d:'Sortir le filet du frigo 15 min avant. Assaisonner sel/poivre côté chair uniquement.'},
        {t:5,  d:'Plancha très chaude (230°C). Saisir le filet 30 sec par face — rester saignant à cœur.'},
        {t:6,  d:'Laisser reposer 3 min emballé en alu. Trancher en carpaccio épais à la dernière seconde.'},
        {t:9,  d:'Dresser les tranches en éventail. Déposer le pop Camargue et le wam à la croque.'},
        {t:10, d:'Quenelle de glace wasabi au dernier moment. Filet de ponzu + huile d\'olive.'},
        {t:12, d:'Finir avec la fleur de sel de Camargue. Envoyer immédiatement (la glace fond vite).'}
      ],
      notes: 'Cuisson 30 sec par face max — saignant impératif. Si refus saignant : réorienter vers le filet de poisson. La glace wasabi se dresse au dernier moment. Ne jamais pré-dresser.',
      allerg:['Viande bovine', 'Gluten (condiment)', 'Lait (glace)', 'Moutarde (ponzu)']
    };
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 380px;gap:14px';
    body.appendChild(wrap);
    const left = document.createElement('div');
    left.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    left.innerHTML = `
      <div style="padding:16px 18px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#FFF7ED,#FED7AA)">
        <div>
          <div style="font-size:10px;font-weight:700;color:#9A3412;text-transform:uppercase;letter-spacing:.1em">Recette vedette · Entrée signature</div>
          <div style="font-size:18px;font-weight:800;color:#7C2D12;margin-top:3px">${recipe.nom}</div>
          <div style="font-size:12px;color:#9A3412;margin-top:2px">${recipe.portion} · Food Cost <b>${recipe.cout.toFixed(2)}€</b> · PV <b>${recipe.pv}€</b> · Marge <b>${Math.round(((recipe.pv-recipe.cout)/recipe.pv)*100)}%</b></div>
        </div>
        <div style="font-size:48px">🐂</div>
      </div>
      <div style="padding:18px">
        <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">Ingrédients</div>
        <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:18px">
          ${recipe.ing.map(i=>`<div style="display:flex;gap:10px;padding:8px 12px;background:var(--bg);border-radius:8px;font-size:12.5px"><span style="font-weight:700;color:var(--t1);min-width:60px;font-family:'DM Mono',monospace">${i.q}</span><span style="color:var(--t2)">${i.name}</span></div>`).join('')}
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">Déroulé · 12 min total</div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${recipe.etapes.map((e,i)=>`
            <div style="display:flex;gap:12px;padding:10px 12px;background:${i===0||i===recipe.etapes.length-1?'var(--bg)':'transparent'};border-radius:8px">
              <div style="width:34px;height:34px;border-radius:8px;background:var(--t1);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-size:9px;font-weight:700;opacity:.7">T+</span>
                <span style="font-size:12px;font-weight:800;font-family:'DM Mono',monospace;line-height:1">${e.t}</span>
              </div>
              <div style="flex:1;font-size:12.5px;color:var(--t1);line-height:1.5;padding:3px 0">${e.d}</div>
            </div>`).join('')}
        </div>
      </div>`;
    wrap.appendChild(left);
    const right = document.createElement('div');
    right.style.cssText = 'display:flex;flex-direction:column;gap:10px';
    right.innerHTML = `
      <div style="background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1px solid #F59E0B;border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:#78350F;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">⚠ Allergènes</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${recipe.allerg.map(a=>`<span style="padding:3px 10px;border-radius:14px;background:#fff;color:#78350F;font-size:11px;font-weight:600">${a}</span>`).join('')}</div>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">💡 Notes du chef</div>
        <div style="font-size:12px;color:var(--t2);line-height:1.55">${recipe.notes}</div>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">🎯 Brief de service</div>
        <div style="font-size:12px;color:var(--t2);line-height:1.55">Annoncer "Taureau AOP Camargue, saisi à la plancha, servi avec glace wasabi maison". Proposer un rouge Camargue. Si allergie viande rouge : orienter vers Ceviche ou Salade pastèque.</div>
      </div>
      <button onclick="toast('Brief envoyé à l\'équipe')" style="padding:12px;border:none;border-radius:10px;background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">📱 Envoyer brief à l'équipe</button>`;
    wrap.appendChild(right);
  }

  function renderProcessTab(){
    const processes = [
      {time:'09:30', title:'Ouverture cuisine', tasks:['Contrôle T° frigos (noter sur relevé HACCP)', 'Vérifier stocks frigo / congélateur', 'Mise en température fours & plaques', 'Préparer mise en place du jour (mirepoix, herbes, fumets)', 'Goûter sauce mère du jour'], color:'#16A34A'},
      {time:'11:30', title:'Avant service midi S1', tasks:['Dresser mise en place avec chef', 'Vérifier ardoise du jour (poissons sauvages)', 'Brief plats du jour avec la salle', 'Test plancha & four vapeur', 'Vérifier palourdines / tellines (vivantes)'], color:'#2563EB'},
      {time:'14:30', title:'Entre deux services', tasks:['Débarrasser mise en place', 'Ré-approvisionner partiellement', 'Nettoyer plancha à chaud', 'Pause équipe 30 min', 'Contrôle T° intermédiaire'], color:'#D97706'},
      {time:'17:00', title:'Avant service soir', tasks:['Mise en place soir (plus copieuse)', 'Pré-dressage entrées froides (ceviche, tataki)', 'Préparer glace wasabi (fraîche du jour)', 'Brief équipe complète — annonces du soir', 'Décongélation viandes du soir si nécessaire'], color:'#7C3AED'},
      {time:'23:30', title:'Fermeture cuisine', tasks:['Plonge complète + dégraissage', 'Nettoyage plancha à froid + sel gros', 'Relevé T° final frigos (HACCP)', 'Filmer & étiqueter restes (DLC+2j)', 'Sortir poubelles + compacter cartons', 'Sol + caniveaux avec produit HACCP', 'Check-list signée & photo prise'], color:'#18181A'}
    ];
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px';
    processes.forEach(p => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
      card.innerHTML = `
        <div style="padding:14px 18px;display:flex;align-items:center;gap:14px;border-bottom:0.5px solid var(--sep)">
          <div style="width:60px;height:60px;border-radius:12px;background:${p.color};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
            <div style="font-size:9px;font-weight:700;opacity:.7;text-transform:uppercase">Heure</div>
            <div style="font-size:16px;font-weight:800;font-family:'DM Mono',monospace">${p.time}</div>
          </div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--t1)">${p.title}</div>
            <div style="font-size:11px;color:var(--t3);margin-top:2px">${p.tasks.length} étapes</div>
          </div>
        </div>
        <div style="padding:10px 18px">
          ${p.tasks.map((t,i)=>`<label style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;cursor:pointer;border-bottom:${i<p.tasks.length-1?'0.5px solid var(--bg)':'none'}"><input type="checkbox" style="margin:2px 0 0;cursor:pointer;flex-shrink:0"><span style="font-size:12.5px;color:var(--t2);line-height:1.45">${t}</span></label>`).join('')}
        </div>`;
      wrap.appendChild(card);
    });
    body.appendChild(wrap);
  }

  function renderFormationTab(){
    const modules = [
      {title:'Bienvenue chez La Playa', duration:'20 min', icon:'👋', desc:'Présentation, valeurs, équipe, tenue, règles de vie en Camargue'},
      {title:'Les plats signature', duration:'1h',    icon:'⭐', desc:'Bao Carlo, Tataki taureau, Wagyu, Ceviche — histoire, origine, process'},
      {title:'Matériel & ustensiles', duration:'30 min', icon:'🔪', desc:'Plancha, fours, batteur, hachoir, nettoyage quotidien'},
      {title:'Dressage & assiette',   duration:'45 min', icon:'🍽', desc:'Codes visuels, garnitures, sauces, annonces en salle'},
      {title:'Normes HACCP',          duration:'1h',    icon:'🛡', desc:'Chaîne du froid, T°, DLC, traçabilité, marche en avant'},
      {title:'Sécurité & urgence',    duration:'30 min', icon:'🚨', desc:'Extincteur, fuite gaz, coupure eau, accident, numéros urgence'}
    ];
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px';
    modules.forEach((m,i) => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:16px;cursor:pointer;transition:all .18s';
      card.onmouseenter = () => { card.style.borderColor = 'var(--t3)'; card.style.boxShadow = '0 4px 14px rgba(0,0,0,.05)'; };
      card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.boxShadow = ''; };
      card.onclick = () => toast('Module : '+m.title);
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:40px;height:40px;border-radius:11px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:20px">${m.icon}</div>
          <div style="flex:1">
            <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">Module ${i+1}</div>
            <div style="font-size:13px;font-weight:700;color:var(--t1)">${m.title}</div>
          </div>
        </div>
        <div style="font-size:11.5px;color:var(--t3);line-height:1.45;margin-bottom:10px">${m.desc}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:0.5px solid var(--bg)">
          <span style="font-size:10.5px;color:var(--t3)">⏱ ${m.duration}</span>
          <button onclick="event.stopPropagation();toast('Module ouvert')" style="padding:6px 12px;border-radius:8px;border:1px solid var(--sep);background:var(--card);font-size:10.5px;font-weight:600;cursor:pointer;color:var(--t2)">Commencer →</button>
        </div>`;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  rebuild();
}
