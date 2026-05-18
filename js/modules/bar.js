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

  function renderAccordsTab(){

    // ── Accords mets & vins (vrais plats × vrais vins de la carte)
    const pairings = [
      { cat:'Tapas & fruits de mer', ico:'🦪',
        rows:[
          { plat:'Huîtres de Bouzigues',          col:'⚪', wine:'Dauvissat Cuvée St Pierre — Chablis',        why:'Minéralité crayeuse et fraîcheur iodée : le duo parfait avec l\'huître',              price:'42€' },
          { plat:'Palourdes à la crème d\'ail',    col:'⚪', wine:'Paternel Blanc de Blanc — Cassis',           why:'Vivacité provençale et amande fraîche contrebalancent la crème sans l\'écraser',   price:'51€' },
          { plat:'Couteaux persillade gratinés',   col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',             why:'Agrumes vifs et légèreté minérale épousent l\'ail et le persil',                   price:'26€ · 7€ verre' },
          { plat:'Bao tentacule, mangue piment',   col:'⚪', wine:'Pithon Mon P\'tit Pithon Blanc',             why:'Fruité exubérant et rondeur aromatique tiennent tête à la mangue et au piment',   price:'36€' },
          { plat:'Pinsa truffe, roquette, burrata',col:'🔴', wine:'Fanny Sabre — Bourgogne',                   why:'Pinot Noir délicat et sous-bois subliment la truffe sans l\'éclipser',             price:'58€' },
        ]
      },
      { cat:'Entrées', ico:'🥗',
        rows:[
          { plat:'Ceviche lèche de tigre',         col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',             why:'L\'acidité vive et les notes d\'agrumes font parfaitement écho à la marinade',     price:'26€ · 7€ verre' },
          { plat:'Tataki de taureau, glace wasabi', col:'🔴', wine:'Mas Valériole Beauduc — Camargue',          why:'Rouge camarguais léger, fruits rouges croquants : accord terroir évident',         price:'32€ · 7€ verre' },
          { plat:'Salade pastèque burrata feta',   col:'🌸', wine:'Puech Haut Cuvée Prestige — Rosé',          why:'Fraîcheur fruitée et texture veloutée du rosé épousent le mariage sucré-salé',    price:'39€ · 8€ verre' },
        ]
      },
      { cat:'Plats', ico:'🍽️',
        rows:[
          { plat:'Filet de poisson, hollandaise',  col:'⚪', wine:'Paternel Blanc de Blanc — Cassis',          why:'La vivacité minérale et le gras beurré du Cassis sont faits l\'un pour l\'autre',  price:'51€' },
          { plat:'Poissons sauvages, beurre blanc', col:'⚪', wine:'Dauvissat Cuvée St Pierre — Chablis',       why:'Accord classique Normandie-mer : minéralité pour minéralité',                     price:'42€' },
          { plat:'Volaille, pistache, petit pois', col:'⚪', wine:'Pithon Mon P\'tit Pithon Blanc',             why:'Fruité solaire et légèreté toscane accompagnent en douceur la volaille',           price:'36€' },
          { plat:'Risotto 3 riz de Camargue',      col:'🌸', wine:'Puech Haut Cuvée Prestige — Rosé',          why:'La rondeur veloutée du rosé épouse le crémeux, terroir partagé Camargue',         price:'39€ · 8€ verre' },
          { plat:'Smash burger bœuf de Galice',    col:'🔴', wine:'Pithon Mon P\'tit Pithon Rouge',             why:'Grenache-Carignan gourmand et solaire pour tenir le bœuf fumé et le cheddar',    price:'36€' },
          { plat:'Faux filet Wagyu 180g',          col:'🔴', wine:'Fanny Sabre — Bourgogne  ou  Valériole Empreinte', why:'Pinot raffiné ou micro-cuvée camarguaise : les deux élèvent la viande d\'exception', price:'58–66€' },
        ]
      },
      { cat:'Fromages & desserts', ico:'🍮',
        rows:[
          { plat:'Pélardon des Cévennes',          col:'⚪', wine:'Valdition Cuvée Alpilles Blanc',             why:'Le chèvre frais aime les blancs vifs et minéraux',                                price:'26€ · 7€ verre' },
          { plat:'K\'ouète tartelette, ganache cacahuète', col:'🌸', wine:'Château Guiot Plaisir Coupable — Moelleux', why:'Douceur miel et abricot confit font écho à la ganache sans la dominer',   price:'32€ · 7€ verre' },
          { plat:'Clafoutis ananas façon Piña Colada', col:'🥂', wine:'Veuve Clicquot Brut Carte Jaune',        why:'Les bulles fines et le biscuité du Champagne subliment l\'ananas flambé',         price:'90€' },
        ]
      }
    ];

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:16px';

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
          { name:'Domaine de Valdition — Cuvée Alpilles', appel:'IGP Alpilles 2025 · AB', price:'7€ verre · 26€ / 33€', desc:'Pâle et lumineux, nez de pêche blanche et fleur d\'amandier. Fraîcheur minérale en finale. Notre rosé d\'entrée de gamme qui n\'en a pas l\'air.' },
          { name:'Puech Haut — Cuvée Prestige', appel:'IGP Pays d\'Oc 2025', price:'8€ verre · 39€ / 79€', desc:'Robe saumonée intense, nez de fraises gariguettes et agrumes frais. Corps généreux, texture veloutée. Le rosé qu\'on commande en deuxième bouteille.' },
          { name:'Domaine de Valdition — Cuvée des Bâtonniers', appel:'IGP Alpilles 2025 · AB', price:'40€ / 87€', desc:'La cuvée premium du domaine. Complexité rare pour un rosé : abricot, pêche de vigne, pointe épicée. Long, racé, mémorable.' },
          { name:'Domaine de la Courtade — Les Terrasses', appel:'AOP Côte de Provence · Porquerolles 2025 · AB', price:'42€', desc:'Porquerolles dans un verre. Rosé marin aux accents de citron confit et de romarin sauvage, finale saline et iodée absolument unique en Méditerranée.' },
        ]
      },
      {
        cat:'Les blancs', col:'#FEF9C3', tx:'#713F12', ico:'⚪',
        wines:[
          { name:'Domaine de Valdition — Cuvée Alpilles', appel:'IGP Alpilles 2025 · AB', price:'7€ verre · 26€ / 35€', desc:'Blanc vif et gourmand, notes d\'agrumes frais et de poire croquante. Buvabilité immédiate, parfait en apéritif ou sur les fruits de mer du moment.' },
          { name:'Olivier Pithon — Mon P\'tit Pithon', appel:'Côtes Catalanes 2024 · AB', price:'36€', desc:'Catalan solaire et exubérant : pêche blanche, citrus, herbes du maquis. Nature et vivant, il surprend à chaque gorgée. Un rapport qualité-plaisir imbattable.' },
          { name:'Jean & Sébastien Dauvissat — Cuvée St Pierre', appel:'AOP Chablis 2024', price:'42€', desc:'Grand artisan du Chablis. Minéralité ciselée, fraîcheur crayeuse, tension remarquable. La référence absolue pour accompagner les huîtres et les poissons nobles.' },
          { name:'Domaine Paternel — Blanc de Blanc', appel:'AOP Cassis 2023 · AB', price:'51€', desc:'La Provence dans toute sa pureté. Vivacité méditerranéenne, fleurs blanches, amande fraîche et salinité finale. Irremplaçable sur les poissons grillés au beurre blanc.' },
        ]
      },
      {
        cat:'Les rouges', col:'#FEE2E2', tx:'#7F1D1D', ico:'🔴',
        wines:[
          { name:'Mas de Valériole — Beauduc', appel:'IGP Terre de Camargue 2024 · AB', price:'7€ verre · 32€', desc:'Camarguais dans l\'âme, léger et fruité comme une balade en Camargue. Fruits rouges croquants, tanins souples. Le rouge du quotidien qu\'on ne quitte plus.' },
          { name:'Olivier Pithon — Mon P\'tit Pithon', appel:'Côtes Catalanes 2024 · AB', price:'36€', desc:'Grenache-Carignan gourmand et solaire, cerise noire, garrigue. Idéal légèrement frais. Une bouteille qui fait l\'unanimité autour de la table.' },
          { name:'Domaine Yves Leccia — YL', appel:'IGP Île de Beauté 2022 · AB', price:'49€', desc:'La Corse dans toute son élégance : tanins soyeux, myrte, olive noire, fruits rouges sauvages. Caractère insulaire affirmé et grande finesse en finale.' },
          { name:'Fanny Sabre', appel:'AOC Bourgognes 2022 · AB', price:'58€', desc:'Pinot Noir bourguignon délicat et raffiné. Cerise, pivoine, sous-bois. Le vin qui élève n\'importe quel plat et transforme un repas en souvenir.' },
          { name:'Mas de Valériole — Empreinte, Micro Cuvée', appel:'IGP Terre de Camargue 2022 · AB', price:'66€', desc:'La rareté du domaine. Parcelle unique, vendange sélective, élevage soigné. Complexe, profond, long. À proposer sur la viande d\'exception : Wagyu, taureau.' },
        ]
      },
      {
        cat:'Les champagnes', col:'#FEF3C7', tx:'#78350F', ico:'🥂',
        wines:[
          { name:'Veuve Clicquot Brut — Carte Jaune', appel:'Champagne AOC', price:'90€', desc:'L\'icône mondiale. Assemblage Chardonnay-Pinot Noir-Meunier, notes de toast et brioche chaude, bulles fines et persistantes. Le champagne qui ne déçoit jamais.' },
          { name:'Ruinart Blanc de Blancs', appel:'Champagne AOC', price:'160€', desc:'Le plus ancien champagne du monde. 100% Chardonnay, robe or pâle, bulles cristallines, fraîcheur citronnée et minéralité incomparable. L\'élégance à l\'état pur.' },
          { name:'Dom Pérignon Vintage', appel:'Champagne AOC', price:'340€', desc:'Le mythe absolu. Chaque bouteille est un millésime unique, jamais assemblé. Complexité, profondeur et longueur hors du commun. Pour les moments qui méritent l\'inoubliable.' },
        ]
      },
      {
        cat:'Le moelleux', col:'#FDE68A', tx:'#92400E', ico:'🍯',
        wines:[
          { name:'Château Guiot — Plaisir Coupable', appel:'IGP Pays d\'Oc · en conversion bio', price:'7€ verre · 32€', desc:'Douceur assumée et gourmande. Miel, abricot confit, fleur d\'oranger. Une parenthèse sucrée sans complexe, idéale en accord avec les desserts ou les fromages affinés.' },
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


