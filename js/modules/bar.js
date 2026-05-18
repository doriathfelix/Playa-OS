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
    const pairings = [
      {plat:'Tellines persillade', wine:'Picpoul de Pinet', color:'⚪', why:'Acidité franche qui contrebalance l\'ail et le persil', price:'28€ btl · 7€ verre'},
      {plat:'Loup grillé fenouil', wine:'Picpoul de Pinet ou Rosé des Sables', color:'⚪🌸', why:'Minéralité iodée accompagne le poisson sans le masquer', price:'28€ · 32€'},
      {plat:'Risotto riz rouge', wine:'Rosé des Sables IGP', color:'🌸', why:'Rondeur qui épouse le crémeux du risotto, terroir commun', price:'32€'},
      {plat:'Gardiane de taureau AOP', wine:'Costières de Nîmes rouge', color:'🔴', why:'Puissance Syrah-Grenache pour tenir la viande mijotée', price:'34€'},
      {plat:'Côte d\'agneau Alpilles', wine:'Costières de Nîmes ou Château rouge', color:'🔴', why:'Tanins et épices soulignent le gras de l\'agneau', price:'34€ ou sur demande'},
      {plat:'Huîtres Gillardeau', wine:'Muscadet sur lie', color:'⚪', why:'Salinité et minéralité idéales pour crustacés', price:'25€ · 6€ verre'},
      {plat:'Fromages provençaux', wine:'Costières rouge léger ou Banyuls', color:'🔴', why:'Selon dominante : chèvre→blanc, pâte dure→rouge', price:'34€ ou 8€ verre'},
      {plat:'Fraises de Carpentras', wine:'Crémant rosé ou Muscat de Beaumes', color:'🥂', why:'Bulles rosées pour fruit frais, Muscat pour dessert', price:'35€ · 8€ verre'}
    ];

    const tbl = document.createElement('div');
    tbl.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    tbl.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:12px 16px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Plat</th>
            <th style="text-align:left;padding:12px 16px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Vin conseillé</th>
            <th style="text-align:left;padding:12px 16px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Pourquoi</th>
            <th style="text-align:right;padding:12px 16px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${pairings.map(p=>`
            <tr style="border-bottom:0.5px solid var(--bg)">
              <td style="padding:12px 16px;font-weight:700;color:var(--t1)">${p.plat}</td>
              <td style="padding:12px 16px"><span style="font-size:14px;margin-right:6px">${p.color}</span><span style="color:var(--t1);font-weight:600">${p.wine}</span></td>
              <td style="padding:12px 16px;color:var(--t2);font-size:11.5px;line-height:1.45">${p.why}</td>
              <td style="padding:12px 16px;text-align:right;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${p.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    body.appendChild(tbl);

    // Note
    const note = document.createElement('div');
    note.style.cssText = 'margin-top:14px;padding:14px 16px;background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:1px solid var(--pbd);border-radius:12px';
    note.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="width:24px;height:24px;border-radius:7px;background:var(--purple);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;margin-top:1px">✦</div>
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--pt);margin-bottom:3px">Astuce vente</div>
          <div style="font-size:11.5px;color:var(--pt);line-height:1.5">Proposer systématiquement le vin au verre à l\'entrée, en accord avec le plat commandé. Le ticket moyen augmente de <b>+8€</b> en moyenne.</div>
        </div>
      </div>
    `;
    body.appendChild(note);
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


