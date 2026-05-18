// ══════════════════════════════════════════
// BAR — Cocktails, spiritueux, vins, process
// ══════════════════════════════════════════
function renderBar(c){
  let currentTab = 'cocktails';
  const body = makePageShell(c, 'Bar', 
    'Fiches cocktails, stocks spiritueux, accords vins, process', 
    [{label:'🖨 Carte du jour', onclick:"toast('Carte imprimée')"},{label:'+ Nouveau cocktail', onclick:"toast('Nouveau cocktail')", primary:true}]);

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Cocktails à la carte', v:'18', s:'8 signature · 10 classiques', col:'#9333EA'},
      {l:'Marge moyenne bar', v:'82%', s:'↑ +2pts vs saison 2025', col:'#16A34A'},
      {l:'Référence vin', v:'42', s:'24 rosés · 12 blancs · 6 rouges', col:'#7C2D12'},
      {l:'Stocks critiques', v:'2', s:'Pastis, Picpoul', col:'#DC2626'}
    ]));

    const tabs = [
      {k:'cocktails', label:'🍹 Fiches cocktails'},
      {k:'accords', label:'🍷 Accords vins'},
      {k:'process', label:'⏱ Process bar'},
      {k:'happy', label:'🌞 Happy Hour'}
    ];
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));

    if(currentTab === 'cocktails') renderCocktailsTab();
    else if(currentTab === 'accords') renderAccordsTab();
    else if(currentTab === 'process') renderBarProcessTab();
    else if(currentTab === 'happy') renderHappyTab();
  }

  function renderCocktailsTab(){
    const spirits = [
      {
        name: 'Rhum', emoji: '🥃', color: '#92400E', bg: '#FEF3C7', bd: '#D97706',
        cocktails: [
          {
            name: 'Mojito', badge: '+ fruits rouges', method: 'En direct',
            dose: [['Menthes fraîches','≈ 10 feuilles'],['Citron vert','≈ 6 quarts'],['Cassonade','—'],['Glace pilée','—'],['Rhum blanc + ambré','topping'],['Purée de fruits rouges','—']],
            tech: 'Écraser la menthe et les quarts de citron avec la cassonade. Remplir de glace pilée. Topping rhum blanc + ambré. Ajouter la purée de fruits rouges.'
          },
          {
            name: 'Piña Colada', badge: '', method: 'Au blender',
            dose: [['Ananas frais','4 morceaux'],['Crème de coco','2 c.c'],['Rhum','6 cl'],['Jus d\'ananas','7 cl'],['Sirop de vanille','2 cl (opt.)']],
            tech: 'Mixer tous les ingrédients avec de la glace au blender jusqu\'à consistance onctueuse. Servir immédiatement.'
          },
          {
            name: 'Passion Playa', badge: 'NEW', method: 'Au shaker',
            dose: [['Rhum brun','4 cl'],['Jus de citron','2 cl'],['Sirop de vanille','1 cl'],['Cannelle','1 c.c'],['Jus de passion','5 cl'],['Jus d\'ananas','5 cl']],
            tech: 'Mettre tous les ingrédients dans le shaker avec glace. Shaker vigoureusement. Filtrer et servir.'
          },
          {
            name: 'Maï Thaï moderne', badge: '', method: 'Au shaker',
            dose: [['Rhum brun','4 cl'],['Jus de citron','2 cl'],['Sirop d\'orgeat','1,5 cl'],['Jus d\'ananas','5 cl']],
            tech: 'Shaker tous les ingrédients avec glace. Filtrer et servir sur glace.'
          }
        ]
      },
      {
        name: 'Vodka', emoji: '🍸', color: '#1E3A5F', bg: '#EFF6FF', bd: '#2563EB',
        cocktails: [
          {
            name: 'Expresso Martini', badge: '', method: 'Au shaker',
            dose: [['Vodka','4 cl'],['Kahlua','2 cl'],['Expresso','1x (refroidi)'],['Sirop de sucre','1 cl (opt.)']],
            tech: 'Préparer l\'expresso à l\'avance et laisser refroidir. Shaker vodka + kahlua + expresso + sirop avec glace. Filtrer en double dans une coupe martini froide.'
          },
          {
            name: 'Moscow Mule', badge: '', method: 'En direct',
            dose: [['Vodka','4 cl'],['Jus de citron','2 cl'],['Ginger beer','top']],
            tech: 'Verser vodka + jus de citron sur glace dans un mug. Compléter avec le ginger beer. Ne pas mélanger.'
          },
          {
            name: 'Porn Star', badge: '', method: 'Au shaker',
            dose: [['Vodka','4 cl'],['Purée de passion','2 cl'],['Jus de citron','2 cl'],['Sirop de vanille','1 cl'],['Jus de passion','5 cl']],
            tech: 'Shaker tous les ingrédients avec glace. Filtrer et servir.'
          }
        ]
      },
      {
        name: 'Gin', emoji: '🌿', color: '#14532D', bg: '#F0FDF4', bd: '#16A34A',
        cocktails: [
          {
            name: 'Bramble', badge: '', method: 'Au shaker',
            dose: [['Gin','4 cl'],['Sirop de sucre','1,5 cl'],['Jus de citron','2 cl'],['Liqueur de Chambord','1,5 cl']],
            tech: 'Shaker gin + sirop + citron avec glace. Filtrer sur glace pilée. Verser la liqueur de Chambord en dernier par-dessus (effet dégradé).'
          },
          {
            name: 'Gin Tonic', badge: '', method: 'En direct',
            dose: [['Gin','5 cl'],['Citron jaune','1 tranche'],['Tonic','top'],['Concombre / poivre','option']],
            tech: 'Verser le gin sur glaçons dans un verre ballon. Compléter avec le tonic. Décorer avec la tranche de citron. Version alternative : concombre + poivre.'
          },
          {
            name: 'Gin Basil Smash', badge: '', method: 'Au shaker',
            dose: [['Gin','5 cl'],['Sirop basilic maison','3,5 cl'],['Jus de citron','2 cl']],
            tech: 'Shaker gin + sirop basilic maison + jus de citron avec glace. Filtrer finement et servir dans un verre sur glace.'
          }
        ]
      }
    ];

    const METHOD_CLR = {
      'Au shaker': { bg:'#F5F3FF', tx:'#581C87' },
      'Au blender': { bg:'#FFF7ED', tx:'#9A3412' },
      'En direct': { bg:'#F0FDF4', tx:'#14532D' }
    };

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:20px';

    spirits.forEach(spirit => {
      const section = document.createElement('div');

      const header = document.createElement('div');
      header.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:12px;background:${spirit.bg};border:1.5px solid ${spirit.bd};margin-bottom:12px`;
      header.innerHTML = `
        <span style="font-size:28px;line-height:1">${spirit.emoji}</span>
        <span style="font-size:16px;font-weight:900;color:${spirit.color};letter-spacing:-.02em">${spirit.name}</span>
        <span style="font-size:11px;font-weight:600;color:${spirit.color};opacity:.6;margin-left:4px">${spirit.cocktails.length} cocktails</span>
      `;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px';

      spirit.cocktails.forEach(ck => {
        const mc = METHOD_CLR[ck.method] || METHOD_CLR['Au shaker'];
        const card = document.createElement('div');
        card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
        card.innerHTML = `
          <div style="padding:13px 15px;display:flex;align-items:center;gap:10px;border-bottom:0.5px solid var(--sep);background:${spirit.bg}">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
                <span style="font-size:15px;font-weight:900;color:${spirit.color}">${ck.name}</span>
                ${ck.badge ? `<span style="font-size:9px;font-weight:800;padding:2px 7px;border-radius:20px;background:${spirit.bd};color:#fff;text-transform:uppercase;letter-spacing:.06em">${ck.badge}</span>` : ''}
              </div>
              <div style="margin-top:5px">
                <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${mc.bg};color:${mc.tx}">${ck.method}</span>
              </div>
            </div>
          </div>
          <div style="padding:11px 15px">
            <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px">Recette</div>
            <table style="width:100%;border-collapse:collapse;font-size:12px">
              ${ck.dose.map(d=>`<tr style="border-bottom:0.5px solid var(--bg)"><td style="padding:5px 0;color:var(--t2)">${d[0]}</td><td style="padding:5px 0;text-align:right;font-weight:800;color:var(--t1);font-family:'DM Mono',monospace;white-space:nowrap">${d[1]}</td></tr>`).join('')}
            </table>
          </div>
          <div style="padding:11px 15px;background:#FFFBEB;border-top:0.5px solid var(--bg)">
            <div style="font-size:10px;font-weight:700;color:#78350F;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">👨‍🍳 Technique</div>
            <div style="font-size:11.5px;color:#78350F;line-height:1.55">${ck.tech}</div>
          </div>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      wrap.appendChild(section);
    });

    body.appendChild(wrap);
  }

  function printAccordsVins(){
    const pairings = [
      { cat:'Tapas & fruits de mer', ico:'🦪',
        rows:[
          { plat:'Huîtres de Bouzigues',                                        col:'⚪', wine:'Dauvissat — Chablis St Pierre',          why:'Très minéral, très frais. Même salinité que l\'huître.',                              price:'42€' },
          { plat:'Palourdes à la crème d\'ail',                                  col:'⚪', wine:'Paternel Blanc de Blanc — Cassis',        why:'Vif et légèrement salin. Coupe la crème sans l\'écraser.',                            price:'51€' },
          { plat:'Couteaux persillade gratinés',                                 col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',          why:'Citron et minéral répondent à l\'ail et au persil.',                                  price:'26€ · 7€/verre' },
          { plat:'Bao tentacule, mangue-piment-coriandre',                       col:'⚪', wine:'Pithon Mon P\'tit Pithon Blanc',          why:'Fruité et aromatique, tient tête au curry rouge sans dominer.',                       price:'36€' },
          { plat:'Pinsa truffe, roquette, burrata',                              col:'🔴', wine:'Fanny Sabre — Bourgogne',                why:'Pinot Noir floral et sous-bois sublime la truffe.',                                   price:'58€' },
          { plat:'Croque comté truffe jambon italien',                           col:'🔴', wine:'Pithon Mon P\'tit Pithon Rouge',          why:'Fruité gourmand répond au comté 6 mois et à la crème tartufata.',                    price:'36€' },
        ]
      },
      { cat:'Entrées', ico:'🥗',
        rows:[
          { plat:'Ceviche de muge, leche de tigre, mangue',                      col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',          why:'Même vivacité citronnée que la marinade.',                                            price:'26€ · 7€/verre' },
          { plat:'Tataki taureau AOP, wok croquant, glace wasabi',               col:'🔴', wine:'Mas Valériole Beauduc — Camargue',        why:'Même terroir que la viande. Léger, ne domine pas la marinade soja.',                  price:'32€ · 7€/verre' },
          { plat:'Salade pastèque, burrata 125g, feta AOP',                      col:'🌸', wine:'Puech Haut Cuvée Prestige — Rosé',        why:'Fruité et velouté, épouse le sucré-salé pastèque-burrata.',                          price:'39€ · 8€/verre' },
        ]
      },
      { cat:'Plats', ico:'🍽️',
        rows:[
          { plat:'Filet de poisson, grenaille Noirmoutier, hollandaise aérienne',col:'⚪', wine:'Paternel Blanc de Blanc — Cassis',        why:'Son gras naturel répond à la hollandaise siphonnée.',                                 price:'51€' },
          { plat:'Poissons sauvages, beurre blanc tomate-xérès',                 col:'⚪', wine:'Dauvissat — Chablis St Pierre',          why:'Minéralité et fraîcheur dialoguent avec le beurre blanc.',                            price:'42€' },
          { plat:'Ballotine volaille, pistache, lissé petit pois',               col:'⚪', wine:'Pithon Mon P\'tit Pithon Blanc',          why:'Fruité léger accompagne la mousseline sans l\'écraser.',                              price:'36€' },
          { plat:'Risotto 3 riz Camargue, ananas, Grana Padano',                 col:'🌸', wine:'Puech Haut Cuvée Prestige — Rosé',        why:'Rondeur et fraîcheur fruitée épousent le twist sucré-salé.',                         price:'39€ · 8€/verre' },
          { plat:'Smash burger bœuf de Galice, cheddar mild red',                col:'🔴', wine:'Pithon Mon P\'tit Pithon Rouge',          why:'Gourmand et solaire pour tenir le bœuf maturé et la mayo fumée.',                    price:'36€' },
          { plat:'Faux filet Wagyu 180g, jus réduit UMAMI',                      col:'🔴', wine:'Fanny Sabre  ou  Valériole Empreinte',   why:'Pinot racé ou micro-cuvée camarguaise : à la hauteur du Wagyu.',                     price:'58–66€' },
        ]
      },
      { cat:'Fromages & desserts', ico:'🍮',
        rows:[
          { plat:'Pélardon des Cévennes',                                        col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',          why:'Le blanc vif nettoie le palais entre chaque bouchée de chèvre.',                     price:'26€ · 7€/verre' },
          { plat:'K\'ouète — ganache chocolat cacahuète, caramel beurre salé',   col:'🍯', wine:'Château Guiot Plaisir Coupable',          why:'Miel et abricot confit font écho à la ganache sans l\'écraser.',                     price:'32€ · 7€/verre' },
          { plat:'Clafoutis ananas flambé rhum brun, sauce suzette',             col:'🥂', wine:'Veuve Clicquot Brut Carte Jaune',         why:'Bulles et biscuité subliment l\'ananas flambé au rhum.',                             price:'90€' },
          { plat:'Gaspacho framboise, bavarois citron, citron caviar',           col:'🥂', wine:'Ruinart Blanc de Blancs',                 why:'Fraîcheur citronnée et bulles fines dialoguent avec le bavarois citron.',            price:'160€' },
        ]
      }
    ];

    const cave = [
      { cat:'Les rosés 🌸', wines:[
        { name:'Domaine de Valdition — Cuvée Alpilles', appel:'IGP Alpilles 2025 · AB', price:'7€/verre · 26€ · 33€', desc:'Léger et frais, presque transparent. Pêche blanche, amande, une touche florale. Il passe tout seul, c\'est notre rosé du quotidien.' },
        { name:'Puech Haut — Cuvée Prestige', appel:'IGP Pays d\'Oc 2025', price:'8€/verre · 39€ · 79€', desc:'Plus charnu, plus présent. Belle robe saumonée, fraise gariguette, agrumes. Celui qu\'on commande une deuxième bouteille sans hésiter.' },
        { name:'Domaine de Valdition — Cuvée des Bâtonniers', appel:'IGP Alpilles 2025 · AB', price:'40€ · 87€', desc:'Le haut de gamme du domaine. Abricot, pêche de vigne, légère épice. Un rosé qui a vraiment du caractère et de la longueur.' },
        { name:'Domaine de la Courtade — Les Terrasses', appel:'AOP Côte de Provence · Porquerolles 2025 · AB', price:'42€', desc:'Ça vient de Porquerolles — et ça se sent. Iodé, marin, herbes sauvages du maquis. Une bouteille comme une balade sur l\'île.' },
      ]},
      { cat:'Les blancs ⚪', wines:[
        { name:'Domaine de Valdition — Cuvée Alpilles', appel:'IGP Alpilles 2025 · AB', price:'7€/verre · 26€ · 35€', desc:'Frais et direct. Citron, poire, minéral. Le blanc polyvalent : apéro, huîtres, poisson du jour. Il ne déçoit jamais.' },
        { name:'Olivier Pithon — Mon P\'tit Pithon', appel:'Côtes Catalanes 2024 · AB', price:'36€', desc:'Blanc naturel du Roussillon, très aromatique. Pêche blanche, fleurs, soleil catalan. Vivant, surprenant, on ne s\'en lasse pas.' },
        { name:'Jean & Sébastien Dauvissat — Cuvée St Pierre', appel:'AOP Chablis 2024', price:'42€', desc:'Chablis de vigneron artisan. Très frais, très minéral, tension citronnée. Le blanc parfait pour les huîtres et les poissons nobles.' },
        { name:'Domaine Paternel — Blanc de Blanc', appel:'AOP Cassis 2023 · AB', price:'51€', desc:'L\'AOP Cassis — rare et souvent méconnu. Fleurs blanches, amande, salinité finale. Il est fait pour les poissons et les fruits de mer.' },
      ]},
      { cat:'Les rouges 🔴', wines:[
        { name:'Mas de Valériole — Beauduc', appel:'IGP Terre de Camargue 2024 · AB', price:'7€/verre · 32€', desc:'Rouge de Camargue, léger et fruité. Fruits rouges, tanins souples. À boire légèrement frais. Le rouge de l\'été par excellence.' },
        { name:'Olivier Pithon — Mon P\'tit Pithon', appel:'Côtes Catalanes 2024 · AB', price:'36€', desc:'Grenache-Carignan du Roussillon. Gourmand, cerise noire, garrigue. Servir légèrement frais. Fait l\'unanimité autour de la table.' },
        { name:'Domaine Yves Leccia — YL', appel:'IGP Île de Beauté 2022 · AB', price:'49€', desc:'Un rouge corse élégant. Tanins soyeux, myrte, fruits rouges sauvages. Du caractère et de la finesse — une belle surprise pour ceux qui ne connaissent pas.' },
        { name:'Fanny Sabre', appel:'AOC Bourgognes 2022 · AB', price:'58€', desc:'Pinot Noir de Bourgogne. Délicat, floral, sous-bois. Le vin qui élève n\'importe quel plat. Quand on veut marquer le repas.' },
        { name:'Mas de Valériole — Empreinte, Micro Cuvée', appel:'IGP Terre de Camargue 2022 · AB', price:'66€', desc:'La pépite du domaine. Parcelle unique, production limitée, élevage soigné. Complexe et profond. Pour les viandes d\'exception : Wagyu, taureau.' },
      ]},
      { cat:'Les champagnes 🥂', wines:[
        { name:'Veuve Clicquot Brut — Carte Jaune', appel:'Champagne AOC', price:'90€', desc:'L\'icône. Brioche, toast, bulles fines et persistantes. On sait ce qu\'on a. Le champagne qui ne déçoit jamais et que tout le monde reconnaît.' },
        { name:'Ruinart Blanc de Blancs', appel:'Champagne AOC', price:'160€', desc:'100% Chardonnay, le plus vieux champagne du monde. Bulles très fines, citron frais, minéral pur. L\'élégance dans toute sa simplicité.' },
        { name:'Dom Pérignon Vintage', appel:'Champagne AOC', price:'340€', desc:'Le mythe. Chaque millésime est unique, jamais assemblé à d\'autres années. Long, complexe, inoubliable. Pour les moments qu\'on n\'oublie pas.' },
      ]},
      { cat:'Le moelleux 🍯', wines:[
        { name:'Château Guiot — Plaisir Coupable', appel:'IGP Pays d\'Oc · en conversion bio', price:'7€/verre · 32€', desc:'Doux et gourmand, sans complexe. Miel, abricot, fleur d\'oranger. Parfait avec les desserts sucrés ou le pélardon des Cévennes.' },
      ]},
    ];

    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Accords mets & vins — La Playa</title>
<style>
@page { size: A4 portrait; margin: 12mm 14mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1C1C1E; background: #fff;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.no-print { margin-bottom: 14px; }
@media print { .no-print { display: none !important; } }
.btn { padding: 9px 22px; background: #1C1C1E; color: #fff; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; margin-right: 8px; }
.hd { display: flex; justify-content: space-between; align-items: flex-end;
  padding-bottom: 10px; border-bottom: 3px solid #1C1C1E; margin-bottom: 16px; }
.logo { font-size: 22px; font-weight: 900; letter-spacing: -.03em; }
.sub  { font-size: 11px; color: #8E8E93; margin-top: 3px; }
.section-title { font-size: 13px; font-weight: 800; color: #1C1C1E; padding: 8px 12px;
  background: #F2F2F7; border-radius: 8px; margin: 14px 0 6px; display:flex; align-items:center; gap:6px; }
table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 4px; }
thead tr { background: #1C1C1E; }
th { padding: 7px 12px; text-align: left; font-size: 9.5px; font-weight: 700; color: #fff;
  text-transform: uppercase; letter-spacing: .08em; }
th:last-child { text-align: right; }
td { padding: 9px 12px; border-bottom: 0.5px solid #F2F2F7; vertical-align: top; }
td:last-child { text-align: right; font-weight: 700; white-space: nowrap; font-family: monospace; }
tr:last-child td { border-bottom: none; }
.wine { font-weight: 700; color: #1C1C1E; }
.why  { color: #6B7280; font-size: 10.5px; line-height: 1.45; }
.page-break { page-break-before: always; }
.cave-section { margin-bottom: 18px; }
.cave-cat { font-size: 14px; font-weight: 900; color: #1C1C1E; border-bottom: 2px solid #1C1C1E;
  padding-bottom: 5px; margin-bottom: 10px; margin-top: 16px; }
.wine-row { display: flex; gap: 12px; padding: 10px 0; border-bottom: 0.5px solid #F2F2F7; }
.wine-row:last-child { border-bottom: none; }
.wine-info { flex: 1; min-width: 0; }
.wine-name { font-size: 12px; font-weight: 800; color: #1C1C1E; line-height: 1.3; }
.wine-appel { font-size: 10px; color: #8E8E93; margin-top: 2px; }
.wine-desc { font-size: 11px; color: #4B5563; line-height: 1.55; margin-top: 5px; font-style: italic; }
.wine-price { font-size: 12px; font-weight: 800; color: #1C1C1E; font-family: monospace;
  white-space: nowrap; text-align: right; flex-shrink: 0; padding-top: 2px; }
.footer { margin-top: 16px; font-size: 8px; color: #C7C7CC; text-align: center; }
.tip { background: #F0FDF4; border-left: 3px solid #16A34A; padding: 8px 12px;
  font-size: 11px; color: #14532D; border-radius: 0 6px 6px 0; margin-bottom: 12px; }
</style></head><body>
<div class="no-print">
  <button class="btn" onclick="window.print()">⎙ Imprimer</button>
  <button class="btn" style="background:#3C3C43" onclick="window.close()">✕ Fermer</button>
</div>

<div class="hd">
  <div>
    <div class="logo">La Playa · Accords mets &amp; vins</div>
    <div class="sub">Carte 2026 — Document équipe</div>
  </div>
</div>

<div class="tip">💡 Proposer le vin au verre dès la commande des tapas, en accord avec le plat principal annoncé. Le ticket moyen augmente de +8 à 12€ par table.</div>

${pairings.map(cat => `
  <div class="section-title">${cat.ico} ${cat.cat}</div>
  <table>
    <thead><tr>
      <th style="width:32%">Plat</th>
      <th style="width:28%">Vin conseillé</th>
      <th>Pourquoi ça marche</th>
      <th>Prix</th>
    </tr></thead>
    <tbody>
      ${cat.rows.map(r=>`<tr>
        <td style="font-weight:700">${r.plat}</td>
        <td><span style="margin-right:4px">${r.col}</span><span class="wine">${r.wine}</span></td>
        <td class="why">${r.why}</td>
        <td>${r.price}</td>
      </tr>`).join('')}
    </tbody>
  </table>
`).join('')}

<div class="page-break"></div>

<div class="hd" style="margin-top:0">
  <div>
    <div class="logo">La Playa · Notre cave</div>
    <div class="sub">Carte 2026 — Descriptions & prix</div>
  </div>
</div>

${cave.map(cat=>`
  <div class="cave-section">
    <div class="cave-cat">${cat.cat}</div>
    ${cat.wines.map(w=>`
      <div class="wine-row">
        <div class="wine-info">
          <div class="wine-name">${w.name}</div>
          <div class="wine-appel">${w.appel}</div>
          <div class="wine-desc">${w.desc}</div>
        </div>
        <div class="wine-price">${w.price}</div>
      </div>
    `).join('')}
  </div>
`).join('')}

<div class="footer">La Playa en Camargue · Document interne · Carte 2026</div>
</body></html>`;

    openPrintWindow(html);
  }

  function renderAccordsTab(){

    // ── Accords mets & vins (vrais plats × vrais vins de la carte)
    const pairings = [
      { cat:'Tapas & fruits de mer', ico:'🦪',
        rows:[
          { plat:'Huîtres de Bouzigues',           col:'⚪', wine:'Dauvissat Cuvée St Pierre — Chablis',         why:'La minéralité crayeuse et la tension iodée du Chablis épousent la salinité naturelle des huîtres de Bouzigues : accord de terroir marin absolu.',           price:'42€' },
          { plat:'Palourdes à la crème d\'ail',     col:'⚪', wine:'Paternel Blanc de Blanc — Cassis',            why:'La vivacité du Cassis (AOP) et ses notes d\'amande fraîche contrebalancent la crème d\'ail sans l\'écraser : la Provence répond à la mer.',            price:'51€' },
          { plat:'Couteaux persillade gratinés',    col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',              why:'Les agrumes frais et la légèreté minérale du blanc des Alpilles font directement écho à l\'ail frais et au persil du gratin.',                         price:'26€ · 7€ verre' },
          { plat:'Bao tentacule, sauce mangue-piment-coriandre', col:'⚪', wine:'Pithon Mon P\'tit Pithon Blanc', why:'L\'exubérance fruitée des Côtes Catalanes et sa légère rondeur tiennent tête au condiment mangue-curry rouge sans dominer la vapeur du bao.',       price:'36€' },
          { plat:'Pinsa truffe, roquette, burrata', col:'🔴', wine:'Fanny Sabre — Bourgogne',                    why:'Le Pinot Noir bourguignon, ses notes de sous-bois et de pivoine, sublime la truffe d\'été et l\'amertume de la roquette sans éclipser la burrata.',   price:'58€' },
          { plat:'Croque comté truffe jambon italien', col:'🔴', wine:'Pithon Mon P\'tit Pithon Rouge',           why:'Le Grenache-Carignan fruité et gourmand répond au comté 6 mois, à la crème tartufata et au jambon truffé sans alourdir le tout.',                     price:'36€' },
        ]
      },
      { cat:'Entrées', ico:'🥗',
        rows:[
          { plat:'Ceviche de muge, leche de tigre et mangue', col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',   why:'L\'acidité vive du blanc et ses notes d\'agrumes font directement écho à la marinade leche de tigre et à la fraîcheur de la mangue.',                   price:'26€ · 7€ verre' },
          { plat:'Tataki taureau AOP, wok croquant, glace wasabi', col:'🔴', wine:'Mas Valériole Beauduc — Camargue', why:'Même terroir que la viande. Le rouge camarguais léger et ses fruits rouges croquants ne dominent pas la marinade soja-gingembre-citron 24h.', price:'32€ · 7€ verre' },
          { plat:'Salade pastèque, burrata 125g, feta AOP',   col:'🌸', wine:'Puech Haut Cuvée Prestige — Rosé', why:'La texture veloutée et les notes de fraise du rosé épousent parfaitement le sucré-salé de la pastèque, du condiment menthe-balsamique blanc et de la burrata.', price:'39€ · 8€ verre' },
        ]
      },
      { cat:'Plats', ico:'🍽️',
        rows:[
          { plat:'Filet de poisson, grenaille Noirmoutier, hollandaise aérienne', col:'⚪', wine:'Paternel Blanc de Blanc — Cassis', why:'L\'acidité vive et le gras naturel du Cassis répondent à la hollandaise siphonnée et aux grenailles caramélisées : accord beurré-minéral parfait.', price:'51€' },
          { plat:'Poissons sauvages, beurre blanc tomate-xérès, citron cédrat', col:'⚪', wine:'Dauvissat Cuvée St Pierre — Chablis', why:'La minéralité du Chablis dialogue avec le beurre blanc monté à la tomate et vinaigre de Xérès — accord haute gastronomie, minéralité pour minéralité.', price:'42€' },
          { plat:'Ballotine de volaille, pistache, lissé petit pois, carotte des sables', col:'⚪', wine:'Pithon Mon P\'tit Pithon Blanc', why:'Le fruité solaire des Côtes Catalanes accompagne la mousseline de dinde sarriette-pistache et le lissé de petit pois sans écraser leur délicatesse.', price:'36€' },
          { plat:'Risotto 3 riz Camargue, car\'hot, ananas, Grana Padano', col:'🌸', wine:'Puech Haut Cuvée Prestige — Rosé', why:'La rondeur veloutée du rosé épouse le twist sucré-salé ananas-carotte-curry rouge du risotto lié au Grana Padano : accord généreux et gourmand.', price:'39€ · 8€ verre' },
          { plat:'Smash burger bœuf de Galice maturé, cheddar mild red, mayo fumée', col:'🔴', wine:'Pithon Mon P\'tit Pithon Rouge', why:'Le Grenache-Carignan solaire et gourmand tient le bœuf de Galice maturé 100g, le cheddar mild red et la mayonnaise fumée maison sans les dominer.', price:'36€' },
          { plat:'Faux filet Wagyu 180g, jus réduit UMAMI, carotte BBQ', col:'🔴', wine:'Fanny Sabre Bourgogne  ou  Valériole Empreinte', why:'Le jus UMAMI corsé du Wagyu uruguayen brûlé au chalumeau appelle un Pinot Noir racé (Fanny Sabre) ou la micro-cuvée camarguaise pour une profondeur digne de la viande.', price:'58–66€' },
        ]
      },
      { cat:'Fromages & desserts', ico:'🍮',
        rows:[
          { plat:'Pélardon des Cévennes',           col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',              why:'Le chèvre frais et lacté aime les blancs vifs et minéraux qui nettoient le palais entre chaque bouchée.',                                                price:'26€ · 7€ verre' },
          { plat:'K\'ouète — ganache chocolat cacahuète, caramel beurre salé', col:'🌸', wine:'Château Guiot Plaisir Coupable — Moelleux', why:'Les notes de miel et d\'abricot confit du moelleux font écho à la ganache chocolat-cacahuète et au caramel beurre salé chocolaté sans les écraser.', price:'32€ · 7€ verre' },
          { plat:'Clafoutis ananas flambé au rhum brun, sorbet coco, sauce suzette', col:'🥂', wine:'Veuve Clicquot Brut Carte Jaune', why:'Le biscuité et les bulles fines du Clicquot subliment l\'ananas flambé au rhum et la sauce suzette jus d\'ananas-beurre frais — mariage festif évident.', price:'90€' },
          { plat:'Gaspacho framboise, bavarois citron, citron caviar', col:'🥂', wine:'Ruinart Blanc de Blancs',   why:'La fraîcheur citronnée et la minéralité du 100% Chardonnay Ruinart dialoguent avec le bavarois citron jaune-zeste citron vert et les grains de citron caviar.', price:'160€' },
        ]
      }
    ];

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:16px';

    // Bouton imprimer
    const printBtn = document.createElement('div');
    printBtn.style.cssText = 'display:flex;justify-content:flex-end';
    printBtn.innerHTML = `<button onclick="printAccordsVins()" style="padding:9px 20px;background:#1C1C1E;color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">🖨 Imprimer accords + cave</button>`;
    wrap.appendChild(printBtn);

    // Astuce vente
    const tip = document.createElement('div');
    tip.style.cssText = 'padding:13px 16px;background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:1px solid #C4B5FD;border-radius:12px';
    tip.innerHTML = `<span style="font-size:12px;font-weight:700;color:#581C87">💡 Astuce vente — </span><span style="font-size:12px;color:#6B21A8;line-height:1.5">Proposer le vin au verre dès la commande des tapas, en accord avec le plat principal annoncé. Le ticket moyen augmente de <b>+8 à 12€</b> par table.</span>`;
    wrap.appendChild(tip);

    pairings.forEach(cat => {
      const section = document.createElement('div');
      section.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
      section.innerHTML = `
        <div style="padding:11px 16px;background:var(--bg);border-bottom:0.5px solid var(--sep);display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${cat.ico}</span>
          <span style="font-size:13px;font-weight:800;color:var(--t1)">${cat.cat}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          ${cat.rows.map((r,i)=>`
            <tr style="border-bottom:${i<cat.rows.length-1?'0.5px solid var(--bg)':'none'}">
              <td style="padding:11px 16px;font-weight:700;color:var(--t1);min-width:160px">${r.plat}</td>
              <td style="padding:11px 12px;white-space:nowrap">
                <span style="font-size:13px;margin-right:5px">${r.col}</span>
                <span style="font-size:11.5px;font-weight:700;color:var(--t1)">${r.wine}</span>
              </td>
              <td style="padding:11px 12px;color:var(--t2);font-size:11px;line-height:1.5">${r.why}</td>
              <td style="padding:11px 16px;text-align:right;font-weight:800;color:var(--t1);font-family:'DM Mono',monospace;white-space:nowrap">${r.price}</td>
            </tr>
          `).join('')}
        </table>
      `;
      wrap.appendChild(section);
    });

    body.appendChild(wrap);

    // ── Notre cave — descriptions vendeuses
    const caveTitle = document.createElement('div');
    caveTitle.style.cssText = 'margin-top:24px;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--sep)';
    caveTitle.innerHTML = `<span style="font-size:16px;font-weight:900;color:var(--t1)">🍾 Notre cave</span>`;
    body.appendChild(caveTitle);

    const cave = [
      {
        cat:'Les rosés', col:'#F9A8D4', tx:'#831843', ico:'🌸',
        wines:[
          { name:'Domaine de Valdition — Cuvée Alpilles', appel:'IGP Alpilles 2025 · AB', price:'7€/verre · 26€ · 33€', desc:'Léger et frais, presque transparent. Pêche blanche, amande, touche florale. Il passe tout seul — notre rosé du quotidien qui n\'en a pas l\'air.' },
          { name:'Puech Haut — Cuvée Prestige', appel:'IGP Pays d\'Oc 2025', price:'8€/verre · 39€ · 79€', desc:'Plus charnu, plus présent. Belle robe saumonée, fraise gariguette, agrumes. Celui qu\'on commande une deuxième bouteille sans hésiter.' },
          { name:'Domaine de Valdition — Cuvée des Bâtonniers', appel:'IGP Alpilles 2025 · AB', price:'40€ · 87€', desc:'Le haut de gamme du domaine. Abricot, pêche de vigne, légère épice. Un rosé qui a vraiment du caractère — rare à ce niveau de prix.' },
          { name:'Domaine de la Courtade — Les Terrasses', appel:'AOP Côte de Provence · Porquerolles 2025 · AB', price:'42€', desc:'Ça vient de Porquerolles, et ça se sent. Iodé, marin, herbes sauvages du maquis. Une bouteille comme une balade sur l\'île.' },
        ]
      },
      {
        cat:'Les blancs', col:'#FEF9C3', tx:'#713F12', ico:'⚪',
        wines:[
          { name:'Domaine de Valdition — Cuvée Alpilles', appel:'IGP Alpilles 2025 · AB', price:'7€/verre · 26€ · 35€', desc:'Frais et direct. Citron, poire, minéral. Le blanc pour tout : apéro, huîtres, poisson du jour. Simple, efficace, il ne déçoit jamais.' },
          { name:'Olivier Pithon — Mon P\'tit Pithon', appel:'Côtes Catalanes 2024 · AB', price:'36€', desc:'Blanc naturel du Roussillon, très aromatique. Pêche blanche, fleurs, soleil catalan. Vivant et surprenant — un rapport qualité-plaisir imbattable.' },
          { name:'Jean & Sébastien Dauvissat — Cuvée St Pierre', appel:'AOP Chablis 2024', price:'42€', desc:'Chablis de vigneron artisan. Très frais, très minéral, tension citronnée. Le blanc parfait pour les huîtres et les poissons nobles. Reconnaissable au premier verre.' },
          { name:'Domaine Paternel — Blanc de Blanc', appel:'AOP Cassis 2023 · AB', price:'51€', desc:'L\'AOP Cassis — rare et souvent méconnu. Fleurs blanches, amande, salinité finale. Il est littéralement fait pour les poissons et les fruits de mer.' },
        ]
      },
      {
        cat:'Les rouges', col:'#FEE2E2', tx:'#7F1D1D', ico:'🔴',
        wines:[
          { name:'Mas de Valériole — Beauduc', appel:'IGP Terre de Camargue 2024 · AB', price:'7€/verre · 32€', desc:'Rouge de Camargue, léger et fruité. Fruits rouges, tanins souples. À boire légèrement frais en été. Le rouge qu\'on ne quitte plus.' },
          { name:'Olivier Pithon — Mon P\'tit Pithon', appel:'Côtes Catalanes 2024 · AB', price:'36€', desc:'Grenache-Carignan du Roussillon. Gourmand, cerise noire, garrigue. Servir légèrement frais. Il fait l\'unanimité autour de la table à chaque fois.' },
          { name:'Domaine Yves Leccia — YL', appel:'IGP Île de Beauté 2022 · AB', price:'49€', desc:'Un rouge corse élégant. Tanins soyeux, myrte, fruits rouges sauvages. Du caractère et de la finesse — souvent une belle surprise pour ceux qui ne connaissent pas.' },
          { name:'Fanny Sabre', appel:'AOC Bourgognes 2022 · AB', price:'58€', desc:'Pinot Noir de Bourgogne. Délicat, floral, sous-bois. Le vin qui élève n\'importe quel plat. Quand on veut marquer le repas.' },
          { name:'Mas de Valériole — Empreinte, Micro Cuvée', appel:'IGP Terre de Camargue 2022 · AB', price:'66€', desc:'La pépite du domaine. Parcelle unique, production limitée. Complexe et profond. Pour le Wagyu ou le taureau — à la hauteur des viandes d\'exception.' },
        ]
      },
      {
        cat:'Les champagnes', col:'#FEF3C7', tx:'#78350F', ico:'🥂',
        wines:[
          { name:'Veuve Clicquot Brut — Carte Jaune', appel:'Champagne AOC', price:'90€', desc:'L\'icône. Brioche, toast, bulles fines et persistantes. On sait ce qu\'on a. Le champagne qui ne déçoit jamais et que tout le monde reconnaît.' },
          { name:'Ruinart Blanc de Blancs', appel:'Champagne AOC', price:'160€', desc:'100% Chardonnay, le plus vieux champagne du monde. Bulles très fines, citron frais, minéral pur. L\'élégance dans toute sa simplicité.' },
          { name:'Dom Pérignon Vintage', appel:'Champagne AOC', price:'340€', desc:'Le mythe. Chaque millésime est unique, jamais assemblé à d\'autres années. Long, complexe, inoubliable. Pour les moments qu\'on n\'oublie pas.' },
        ]
      },
      {
        cat:'Le moelleux', col:'#FDE68A', tx:'#92400E', ico:'🍯',
        wines:[
          { name:'Château Guiot — Plaisir Coupable', appel:'IGP Pays d\'Oc · en conversion bio', price:'7€/verre · 32€', desc:'Doux et gourmand, sans complexe. Miel, abricot, fleur d\'oranger. Parfait avec les desserts sucrés ou le pélardon des Cévennes.' },
        ]
      }
    ];

    const caveWrap = document.createElement('div');
    caveWrap.style.cssText = 'display:flex;flex-direction:column;gap:18px';

    cave.forEach(cat => {
      const section = document.createElement('div');

      const header = document.createElement('div');
      header.style.cssText = `display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:10px;background:${cat.col};margin-bottom:10px`;
      header.innerHTML = `<span style="font-size:20px">${cat.ico}</span><span style="font-size:14px;font-weight:900;color:${cat.tx}">${cat.cat}</span><span style="font-size:10px;color:${cat.tx};opacity:.6;margin-left:4px">${cat.wines.length} références</span>`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px';

      cat.wines.forEach(w => {
        const card = document.createElement('div');
        card.style.cssText = `background:var(--card);border:1px solid var(--sep);border-radius:12px;overflow:hidden`;
        card.innerHTML = `
          <div style="padding:12px 14px;border-bottom:0.5px solid var(--sep);background:${cat.col}20">
            <div style="font-size:13px;font-weight:800;color:var(--t1);line-height:1.3">${w.name}</div>
            <div style="font-size:10px;color:var(--t3);margin-top:3px">${w.appel}</div>
            <div style="font-size:13px;font-weight:800;color:${cat.tx};margin-top:6px;font-family:'DM Mono',monospace">${w.price}</div>
          </div>
          <div style="padding:11px 14px">
            <div style="font-size:12px;color:var(--t2);line-height:1.6;font-style:italic">"${w.desc}"</div>
          </div>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      caveWrap.appendChild(section);
    });

    body.appendChild(caveWrap);
  }

  function renderBarProcessTab(){
    const processes = [
      {time:'10:00', title:'Ouverture bar', tasks:['Vérifier chambre froide bouteilles (T° 8°C)', 'Contrôle tireuse bière + nettoyage becs', 'Préparer fruits du jour (menthe, citron, orange)', 'Remplir réserves glaçons (prévoir 2 sacs/service)', 'Test machine café + détartrage si nécessaire', 'Vérifier stock bouteilles au comptoir'], color:'#9333EA'},
      {time:'11:45', title:'Avant service midi', tasks:['Carafer le vin blanc en frigo carafe', 'Pré-découper citrons / limes (20 de chaque)', 'Pilon + moulin à sucre accessibles', 'Brief happy hour du jour', 'Vérifier ardoise vins du jour'], color:'#2563EB'},
      {time:'17:00', title:'Happy Hour transats', tasks:['Activation offre -30% (17h-19h)', 'Service rapide au transat (2 runners)', 'Préparer pré-mix Spritz batch 5L', 'Vérifier glace pilée (pré-faire stock)', 'Annonce haut-parleur optionnelle'], color:'#D97706'},
      {time:'00:00', title:'Fermeture bar', tasks:['Compter caisse bar + fond de caisse', 'Laver tous les verres à la main (cristal)', 'Rincer tireuse bière à l\'eau claire', 'Nettoyer plan de travail désincrustant', 'Sortir les bacs à glace vides', 'Fermer robinets eau + gaz', 'Ranger bouteilles ouvertes en frigo', 'Signer check-list + photo'], color:'#18181A'}
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
          ${p.tasks.map((t,i)=>`
            <label style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;cursor:pointer;border-bottom:${i<p.tasks.length-1?'0.5px solid var(--bg)':'none'}">
              <input type="checkbox" style="margin:2px 0 0;flex-shrink:0">
              <span style="font-size:12.5px;color:var(--t2);line-height:1.45">${t}</span>
            </label>
          `).join('')}
        </div>
      `;
      wrap.appendChild(card);
    });
    body.appendChild(wrap);
  }

  function renderHappyTab(){
    body.innerHTML += `
      <div style="background:linear-gradient(135deg,#FED7AA,#FDBA74);border-radius:16px;padding:20px;margin-bottom:14px;color:#7C2D12">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.8">Happy Hour · transats uniquement</div>
        <div style="font-size:24px;font-weight:800;margin:6px 0;letter-spacing:-.5px">Tous les jours · 17h-19h</div>
        <div style="font-size:13px;line-height:1.5;max-width:600px">Formule <b>Cocktail signature + planche apéro</b> pour <b>18€</b> (-30% vs carte normale). Service direct au transat par les plagistes. Proposé en fin d'après-midi pour garder les clients et booster les ventes sur une plage horaire habituellement calme.</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
        <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">Ventes HH moyenne</div>
          <div style="font-size:20px;font-weight:700;color:var(--t1);margin:4px 0;font-family:'DM Mono',monospace">32 formules/jour</div>
          <div style="font-size:11px;color:var(--t3)">Pic : samedi 48 · creux : lundi 18</div>
        </div>
        <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">CA généré</div>
          <div style="font-size:20px;font-weight:700;color:var(--t1);margin:4px 0;font-family:'DM Mono',monospace">576€/jour</div>
          <div style="font-size:11px;color:var(--t3)">↑ +18% vs hors offre</div>
        </div>
        <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">Marge après remise</div>
          <div style="font-size:20px;font-weight:700;color:var(--gt);margin:4px 0;font-family:'DM Mono',monospace">62%</div>
          <div style="font-size:11px;color:var(--t3)">vs 78% sur carte</div>
        </div>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:18px">
        <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:10px">Cocktails au choix</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${['Spritz Provençal','Mojito maison','Tomate-Pastis','Aperol Spritz','Gin tonic','Bière pression'].map(c=>`<span style="padding:6px 12px;border-radius:20px;background:var(--bg);font-size:12px;color:var(--t1);font-weight:500">${c}</span>`).join('')}
        </div>
        <div style="font-size:13px;font-weight:700;color:var(--t1);margin:16px 0 10px">Planche apéro La Playa</div>
        <div style="font-size:12px;color:var(--t2);line-height:1.6">Tapenade maison · toasts grillés · olives de Nyons · tomates cerises · fromage frais de Camargue · anchois · radis beurre demi-sel · chips maison</div>
      </div>
    `;
  }

  rebuild();
}


