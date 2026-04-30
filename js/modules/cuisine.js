// ══════════════════════════════════════════
// CUISINE — Fiches, recettes, process
// ══════════════════════════════════════════
function renderCuisine(c){
  let currentTab = 'fiches';
  const body = makePageShell(c, 'Cuisine', 
    'Fiches techniques, recettes, process, stocks cuisine', 
    [{label:'🖨 Fiche du jour', onclick:"toast('Fiche impression')"},{label:'+ Fiche technique', onclick:"toast('Nouvelle fiche')", primary:true}]);

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Fiches techniques', v:'42', s:'24 plats + 18 préparations', col:'#EA580C'},
      {l:'Coût matière moyen', v:'28%', s:'sur prix de vente HT', col:'#16A34A'},
      {l:'Plat du jour', v:'Tellines', s:'Prépa 45 min · portion 300g', col:'#7C3AED'},
      {l:'Stocks critiques', v:'2', s:'Citrons, huile olive', col:'#DC2626'}
    ]));

    const tabs = [
      {k:'fiches', label:'📋 Fiches techniques'},
      {k:'recettes', label:'👨‍🍳 Recettes & briefs'},
      {k:'process', label:'⏱ Process service'},
      {k:'formation', label:'🎓 Formation'}
    ];
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));

    if(currentTab === 'fiches') renderFichesTab();
    else if(currentTab === 'recettes') renderRecettesTab();
    else if(currentTab === 'process') renderProcessTab();
    else if(currentTab === 'formation') renderFormationTab();
  }

  function renderFichesTab(){
    const ft = [
      {plat:'Gardiane de taureau AOP', prep:'2h30', cuisson:'3h', portion:'180g/pers', cout:6.80, pv:22, ing:12, difficulty:'Moyenne'},
      {plat:'Tellines à la persillade', prep:'15 min', cuisson:'8 min', portion:'300g/pers', cout:4.50, pv:18, ing:6, difficulty:'Facile'},
      {plat:'Loup grillé fenouil', prep:'10 min', cuisson:'18 min', portion:'400g/pers', cout:12.40, pv:34, ing:8, difficulty:'Moyenne'},
      {plat:'Risotto riz rouge', prep:'20 min', cuisson:'25 min', portion:'180g/pers', cout:5.80, pv:24, ing:9, difficulty:'Moyenne'},
      {plat:'Salade de la plage', prep:'12 min', cuisson:'—', portion:'250g/pers', cout:4.20, pv:16, ing:8, difficulty:'Facile'},
      {plat:'Côte d\'agneau Alpilles', prep:'15 min', cuisson:'22 min', portion:'350g/pers', cout:14.60, pv:36, ing:7, difficulty:'Moyenne'}
    ];
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px';
    ft.forEach(f => {
      const marge = Math.round(((f.pv - f.cout) / f.pv) * 100);
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .18s';
      card.onmouseenter = () => { card.style.borderColor = 'var(--t3)'; card.style.transform = 'translateY(-2px)'; card.style.boxShadow = '0 6px 18px rgba(24,20,10,.06)'; };
      card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.transform = ''; card.style.boxShadow = ''; };
      card.onclick = () => toast('Fiche ouverte : '+f.plat);
      card.innerHTML = `
        <div style="padding:14px 16px;border-bottom:0.5px solid var(--bg)">
          <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:4px">${f.plat}</div>
          <div style="display:flex;gap:4px">
            <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;background:${f.difficulty==='Facile'?'var(--gbg)':f.difficulty==='Difficile'?'var(--rbg)':'var(--obg)'};color:${f.difficulty==='Facile'?'var(--gt)':f.difficulty==='Difficile'?'var(--rt)':'var(--ot)'}">${f.difficulty}</span>
            <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;background:var(--bg2);color:var(--t2)">${f.ing} ingrédients</span>
          </div>
        </div>
        <div style="padding:10px 16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:11px;border-bottom:0.5px solid var(--bg)">
          <div><div style="color:var(--t4);font-size:9.5px;font-weight:700;text-transform:uppercase">Prép.</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${f.prep}</div></div>
          <div><div style="color:var(--t4);font-size:9.5px;font-weight:700;text-transform:uppercase">Cuisson</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${f.cuisson}</div></div>
          <div><div style="color:var(--t4);font-size:9.5px;font-weight:700;text-transform:uppercase">Portion</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace;font-size:11px">${f.portion}</div></div>
        </div>
        <div style="padding:10px 16px;display:flex;justify-content:space-between;align-items:center;background:var(--bg)">
          <div>
            <div style="font-size:9.5px;color:var(--t4);font-weight:700;text-transform:uppercase">Food Cost</div>
            <div style="font-size:14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${f.cout.toFixed(2)}€</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:9.5px;color:var(--t4);font-weight:700;text-transform:uppercase">PV</div>
            <div style="font-size:14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${f.pv}€</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:9.5px;color:var(--t4);font-weight:700;text-transform:uppercase">Marge</div>
            <div style="font-size:14px;font-weight:700;color:var(--gt);font-family:'DM Mono',monospace">${marge}%</div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function renderRecettesTab(){
    const recipe = {
      nom: 'Tellines à la persillade',
      portion: '1 pers · 300g',
      cout: 4.50,
      pv: 18,
      ing: [
        {q:'300g', name:'Tellines fraîches du Grau-du-Roi'},
        {q:'2 gousses', name:'Ail rose de Lautrec AOP'},
        {q:'1 bouquet', name:'Persil plat'},
        {q:'25g', name:'Beurre demi-sel AOP'},
        {q:'10cl', name:'Vin blanc sec (Picpoul)'},
        {q:'1 pincée', name:'Fleur de sel de Camargue'}
      ],
      etapes: [
        {t:0, d:'Faire tremper les tellines 2h dans de l\'eau salée pour dégorger.'},
        {t:5, d:'Hacher finement l\'ail et le persil. Mettre de côté.'},
        {t:7, d:'Dans une grande poêle, faire fondre le beurre à feu vif.'},
        {t:8, d:'Ajouter les tellines égouttées. Couvrir 2 min.'},
        {t:10, d:'Quand elles s\'ouvrent, ajouter ail + persil + vin blanc. Mélanger.'},
        {t:12, d:'Laisser réduire 1 min. Vérifier l\'assaisonnement. Servir immédiatement avec pain grillé.'}
      ],
      notes: 'Ne jamais recuire. Les tellines fermées = poubelle. Accompagner impérativement de pain grillé frotté à l\'ail pour récupérer le jus.',
      allerg: ['Mollusques', 'Lait (beurre)', 'Sulfites (vin)']
    };

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 380px;gap:14px';
    body.appendChild(wrap);

    const left = document.createElement('div');
    left.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    left.innerHTML = `
      <div style="padding:16px 18px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#FFF7ED,#FED7AA)">
        <div>
          <div style="font-size:10px;font-weight:700;color:#9A3412;text-transform:uppercase;letter-spacing:.1em">Recette en vedette · plat du jour</div>
          <div style="font-size:18px;font-weight:800;color:#7C2D12;margin-top:3px">${recipe.nom}</div>
          <div style="font-size:12px;color:#9A3412;margin-top:2px">${recipe.portion} · Food Cost <b>${recipe.cout.toFixed(2)}€</b> · PV <b>${recipe.pv}€</b> · Marge <b>${Math.round(((recipe.pv-recipe.cout)/recipe.pv)*100)}%</b></div>
        </div>
        <div style="font-size:48px">🫒</div>
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
            </div>
          `).join('')}
        </div>
      </div>
    `;
    wrap.appendChild(left);

    const right = document.createElement('div');
    right.style.cssText = 'display:flex;flex-direction:column;gap:10px';
    right.innerHTML = `
      <div style="background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1px solid #F59E0B;border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:#78350F;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">⚠ Allergènes</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${recipe.allerg.map(a=>`<span style="padding:3px 10px;border-radius:14px;background:#fff;color:#78350F;font-size:11px;font-weight:600">${a}</span>`).join('')}
        </div>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">💡 Notes du chef</div>
        <div style="font-size:12px;color:var(--t2);line-height:1.55">${recipe.notes}</div>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">🎯 Brief de service</div>
        <div style="font-size:12px;color:var(--t2);line-height:1.55">Annoncer "Tellines persillade maison, produit local, du Grau-du-Roi". Proposer d'office un verre de Picpoul. Si allergie mollusques : reorienter vers Burrata.</div>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:14px">
        <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">📊 Performance</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
          <div><div style="color:var(--t4);font-size:9.5px;font-weight:700;text-transform:uppercase">Ventes 30j</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace;font-size:15px">402</div></div>
          <div><div style="color:var(--t4);font-size:9.5px;font-weight:700;text-transform:uppercase">Note moyenne</div><div style="font-weight:700;color:var(--t1);font-family:'DM Mono',monospace;font-size:15px">4.8/5</div></div>
        </div>
      </div>
      <button onclick="toast('Brief équipe envoyé par WhatsApp')" style="padding:12px;border:none;border-radius:10px;background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">📱 Envoyer brief à l'équipe</button>
    `;
    wrap.appendChild(right);
  }

  function renderProcessTab(){
    const processes = [
      {time:'09:30', title:'Ouverture cuisine', tasks:['Contrôle T° frigos (noter sur relevé)', 'Vérifier stocks frigo / congélateur', 'Mise en température fours & plaques', 'Préparer mise en place du jour (mirepoix, herbes, fumets)', 'Goût de la sauce mère du jour'], color:'#16A34A'},
      {time:'11:30', title:'Avant service S1 midi', tasks:['Dresser mise en place avec chef', 'Vérifier ardoise du jour', 'Brief plats du jour avec salle', 'Test four vapeur & plancha', 'Rincer poissons reçus le matin'], color:'#2563EB'},
      {time:'14:30', title:'Entre deux services', tasks:['Débarrasser mise en place', 'Ré-approvisionner partiellement', 'Nettoyer plancha à chaud', 'Pause équipe 30 min', 'Contrôle T° intermédiaire'], color:'#D97706'},
      {time:'17:00', title:'Avant service soir', tasks:['Mise en place soir (plus copieuse)', 'Pré-dressage entrées froides', 'Faire tomber le riz rouge', 'Brief équipe complète', 'Décongélation viandes du soir'], color:'#7C3AED'},
      {time:'23:30', title:'Fermeture cuisine', tasks:['Plonge complète + dégraissage', 'Nettoyage plancha à froid + sel gros', 'Relevé T° final frigos', 'Filmer & étiqueter restes (DLC+2j)', 'Sortir poubelles + compacter cartons', 'Sol + caniveaux avec produit HACCP', 'Check-list signée & photo prise'], color:'#18181A'}
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
            <div style="font-size:11px;color:var(--t3);margin-top:2px">${p.tasks.length} étapes · durée ~30 min</div>
          </div>
        </div>
        <div style="padding:10px 18px">
          ${p.tasks.map((t,i)=>`
            <label style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;cursor:pointer;border-bottom:${i<p.tasks.length-1?'0.5px solid var(--bg)':'none'}">
              <input type="checkbox" style="margin:2px 0 0;cursor:pointer;flex-shrink:0">
              <span style="font-size:12.5px;color:var(--t2);line-height:1.45">${t}</span>
            </label>
          `).join('')}
        </div>
      `;
      wrap.appendChild(card);
    });
    body.appendChild(wrap);
  }

  function renderFormationTab(){
    const modules = [
      {title:'Bienvenue chez La Playa', duration:'20 min', icon:'👋', desc:'Présentation, valeurs, équipe, tenue, règles de vie'},
      {title:'Plats signature', duration:'1h', icon:'⭐', desc:'Histoire, origine, préparation des 6 plats phares'},
      {title:'Matériel & ustensiles', duration:'30 min', icon:'🔪', desc:'Plancha, fours, batteur, hachoir, nettoyage quotidien'},
      {title:'Dressage & assiette', duration:'45 min', icon:'🍽', desc:'Codes visuels, garnitures, sauces, annonces'},
      {title:'Normes HACCP', duration:'1h', icon:'🛡', desc:'Chaîne du froid, T°, DLC, traçabilité, marche en avant'},
      {title:'Sécurité & urgence', duration:'30 min', icon:'🚨', desc:'Extincteur, fuite gaz, coupure eau, accident'}
    ];
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px';
    modules.forEach((m,i)=>{
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:16px;cursor:pointer;transition:all .18s';
      card.onmouseenter = () => { card.style.borderColor = 'var(--t3)'; card.style.boxShadow = '0 4px 14px rgba(0,0,0,.05)'; };
      card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.boxShadow = ''; };
      card.onclick = () => toast('Module formation : '+m.title);
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
        </div>
      `;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  rebuild();
}


