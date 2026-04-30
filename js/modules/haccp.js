// ══════════════════════════════════════════
// HACCP — Relevés, traçabilité, procédures
// ══════════════════════════════════════════
function renderHACCP(c){
  let currentTab = 'releves';
  const body = makePageShell(c, 'HACCP & Hygiène', 
    'Relevés T° · Traçabilité · Nettoyage · Procédures obligatoires',
    [{label:'📄 Exporter registre', onclick:"toast('Export PDF HACCP')"},{label:'+ Relevé T°', onclick:"toast('Nouveau relevé')", primary:true}]);

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Relevés du jour', v:'6/8', s:'2 à faire avant 18h', col:'#16A34A'},
      {l:'T° conformes', v:'100%', s:'Tous équipements <8°C', col:'#16A34A'},
      {l:'Dernier contrôle', v:'DDPP', s:'Il y a 8 mois · RAS', col:'#2563EB'},
      {l:'Prochaine échéance', v:'Dératisation', s:'Dans 12 jours', col:'#D97706'}
    ]));

    const tabs = [
      {k:'releves', label:'🌡 Relevés T°'},
      {k:'tracabilite', label:'📦 Traçabilité'},
      {k:'nettoyage', label:'🧽 Plan de nettoyage'},
      {k:'procedures', label:'📋 Procédures'}
    ];
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));

    if(currentTab === 'releves') renderRelevesTab();
    else if(currentTab === 'tracabilite') renderTracaTab();
    else if(currentTab === 'nettoyage') renderNettoyageTab();
    else if(currentTab === 'procedures') renderProceduresTab();
  }

  function renderRelevesTab(){
    const equipments = [
      {name:'Chambre froide positive cuisine', target:'≤ 4°C', current:'3.2°C', status:'ok', lastCheck:'10:14'},
      {name:'Chambre froide négative', target:'≤ -18°C', current:'-19.5°C', status:'ok', lastCheck:'10:15'},
      {name:'Frigo bar principal', target:'≤ 8°C', current:'6.8°C', status:'ok', lastCheck:'10:12'},
      {name:'Frigo sous-comptoir bar', target:'≤ 8°C', current:'7.5°C', status:'ok', lastCheck:'10:13'},
      {name:'Armoire chaude plats', target:'≥ 63°C', current:'67°C', status:'ok', lastCheck:'13:02'},
      {name:'Vitrine desserts froide', target:'≤ 8°C', current:'7.2°C', status:'ok', lastCheck:'10:16'},
      {name:'Congélateur bac à glace', target:'≤ -18°C', current:'—', status:'todo', lastCheck:'—'},
      {name:'Préparation chaude plancha', target:'≥ 75°C', current:'—', status:'todo', lastCheck:'—'}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--t1)">Relevés de température · Jeudi 17 avril 2026</div>
          <div style="font-size:11px;color:var(--t3);margin-top:2px">Obligatoire matin (10h) et après-midi (16h) · Signé par le chef</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Équipement</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Cible</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Actuel</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Statut</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Dernière vérif.</th>
          </tr>
        </thead>
        <tbody>
          ${equipments.map(e=>`
            <tr style="border-bottom:0.5px solid var(--bg)">
              <td style="padding:10px 18px;font-weight:600;color:var(--t1)">${e.name}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace;font-size:11px">${e.target}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${e.current}</td>
              <td style="text-align:center;padding:10px 8px">
                ${e.status==='ok'?'<span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:12px;background:var(--gbg);color:var(--gt)">✓ Conforme</span>':'<button onclick="toast(\'Relevé à saisir\')" style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:12px;background:var(--obg);color:var(--ot);border:none;cursor:pointer">+ Relever</button>'}
              </td>
              <td style="text-align:right;padding:10px 18px;color:var(--t3);font-family:'DM Mono',monospace;font-size:11px">${e.lastCheck}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="padding:14px 18px;background:var(--bg);display:flex;justify-content:space-between;align-items:center;border-top:0.5px solid var(--sep)">
        <span style="font-size:11.5px;color:var(--t2)">Signé par : <b>Marco Giraldi · Chef</b></span>
        <span style="font-size:11.5px;color:var(--t3)">Prochain relevé obligatoire : 16h00</span>
      </div>
    `;
    body.appendChild(card);
  }

  function renderTracaTab(){
    const lots = [
      {product:'Taureau AOP Camargue', supplier:'Aubanel Boucherie', arrival:'15 avril 2026', dlc:'22 avril', lot:'A-2604-15', weight:'6.2 kg', status:'Utilisé 3.5kg'},
      {product:'Tellines fraîches', supplier:'Antoine Roux (pêcheur)', arrival:'17 avril 2026', dlc:'18 avril', lot:'TLN-1704', weight:'4 kg', status:'En cours · 1.2 kg restant'},
      {product:'Huîtres Gillardeau n°2', supplier:'Poissonnerie Sanary', arrival:'16 avril 2026', dlc:'21 avril', lot:'G2-1604-B', weight:'48 pièces', status:'En stock · 32 pièces'},
      {product:'Riz rouge IGP Camargue', supplier:'Metro Nîmes', arrival:'10 avril 2026', dlc:'10 oct. 2026', lot:'RZC-0410', weight:'10 kg', status:'3.2 kg restant'},
      {product:'Loup de ligne (frais)', supplier:'Poissonnerie Sanary', arrival:'17 avril 2026', dlc:'19 avril', lot:'LP-1704-A', weight:'4.8 kg', status:'Frais · complet'}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Traçabilité des lots · Produits sensibles</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Conservation obligatoire 6 mois · Étiquetage lot + DLC sur tous les contenants</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Produit</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Fournisseur</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Réception</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">DLC</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">N° Lot</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Statut</th>
          </tr>
        </thead>
        <tbody>
          ${lots.map(l=>`
            <tr style="border-bottom:0.5px solid var(--bg)">
              <td style="padding:10px 18px;font-weight:700;color:var(--t1)">${l.product}</td>
              <td style="padding:10px 8px;color:var(--t2);font-size:11.5px">${l.supplier}</td>
              <td style="padding:10px 8px;color:var(--t2);font-size:11.5px">${l.arrival}</td>
              <td style="padding:10px 8px;color:${l.dlc.includes('avril')?'var(--ot)':'var(--t2)'};font-weight:${l.dlc.includes('avril')?'700':'400'};font-size:11.5px">${l.dlc}</td>
              <td style="padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace;font-size:10.5px">${l.lot}</td>
              <td style="padding:10px 18px;text-align:right;color:var(--t2);font-size:11px">${l.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    body.appendChild(card);
  }

  function renderNettoyageTab(){
    const plan = [
      {zone:'Plan de travail cuisine', freq:'Après chaque service', product:'Dégraissant alimentaire + désinfectant sans rinçage', resp:'Chef ou commis'},
      {zone:'Plancha', freq:'Après chaque service', product:'Sel gros + grattoir + huile alimentaire', resp:'Chef'},
      {zone:'Four à sole', freq:'Quotidien fin de service', product:'Dégraissant four + chiffon microfibre', resp:'Chef'},
      {zone:'Hotte aspirante', freq:'Hebdo + entretien annuel par pro', product:'Démontage filtres + lave-vaisselle', resp:'Chef + pro 1/an'},
      {zone:'Sols cuisine', freq:'Fin de service soir', product:'Dégraissant HACCP + désinfectant sols', resp:'Plongeur / roulement'},
      {zone:'Plonge', freq:'Après chaque utilisation', product:'Dégraissant + rinçage eau chaude', resp:'Plongeur'},
      {zone:'Chambres froides (intérieur)', freq:'Hebdomadaire complet', product:'Désinfectant alimentaire dilué + rinçage', resp:'Chef · samedi soir'},
      {zone:'Poubelles (bacs)', freq:'Quotidien', product:'Eau chaude + désinfectant + sac propre', resp:'Plongeur'},
      {zone:'Bacs à vaisselle', freq:'Quotidien', product:'Lavage auto 85°C min.', resp:'Lave-vaisselle pro'},
      {zone:'Matériel plancha / poêles', freq:'Après utilisation', product:'Dégraissant + séchage immédiat', resp:'Chef ou commis'}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Plan de nettoyage & désinfection (PND)</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Document obligatoire · à afficher en cuisine · mis à jour 1/an</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Zone / matériel</th>
            <th style="text-align:left;padding:10px 12px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Fréquence</th>
            <th style="text-align:left;padding:10px 12px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Produit</th>
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Responsable</th>
          </tr>
        </thead>
        <tbody>
          ${plan.map(p=>`
            <tr style="border-bottom:0.5px solid var(--bg)">
              <td style="padding:10px 18px;font-weight:700;color:var(--t1);font-size:11.5px">${p.zone}</td>
              <td style="padding:10px 12px;color:var(--t2);font-size:11.5px">${p.freq}</td>
              <td style="padding:10px 12px;color:var(--t3);font-size:11px;line-height:1.4">${p.product}</td>
              <td style="padding:10px 18px;color:var(--t2);font-size:11.5px;font-weight:600">${p.resp}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    body.appendChild(card);
  }

  function renderProceduresTab(){
    const procedures = [
      {title:'Marche en avant', icon:'➡️', desc:'Les aliments doivent progresser de la zone sale vers la zone propre sans retour en arrière. Respecter les 5 zones : réception → stockage → préparation → cuisson → distribution.', required:true},
      {title:'Chaîne du froid', icon:'❄️', desc:'T° ≤ 4°C pour tous les produits sensibles (viande, poisson, laitages). Jamais plus de 2h à T° ambiante. Refroidissement : de +63°C à +10°C en moins de 2h.', required:true},
      {title:'Chaîne du chaud', icon:'🔥', desc:'T° ≥ 63°C pour les plats chauds en attente. Cuisson minimum 70°C à cœur pour viandes rouges, 75°C pour volailles, 100°C pour porc haché.', required:true},
      {title:'DLC & DDM', icon:'📅', desc:'DLC (à consommer jusqu\'au) : limite impérative. DDM (à consommer de préférence avant) : indicative. Si rupture chaîne froid : DLC = jour J.', required:true},
      {title:'Décongélation', icon:'🧊', desc:'Uniquement en chambre froide (24-48h). JAMAIS à T° ambiante. Pas de recongélation après décongélation.', required:true},
      {title:'Échantillothèque', icon:'🧪', desc:'Conserver 110g de chaque plat servi pendant 5 jours, en sac stérile étiqueté (date, plat). Obligation en cas d\'intoxication alimentaire pour analyse.', required:false},
      {title:'Traçabilité fournisseurs', icon:'📋', desc:'Conserver factures et bons de livraison 6 mois minimum. Noter n° lot, fournisseur, date sur tous les produits sensibles.', required:true},
      {title:'Plan de maîtrise sanitaire', icon:'🛡', desc:'Document écrit à conserver sur site. Description de l\'établissement, analyse des dangers, CCP identifiés, plan de formation personnel.', required:true}
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px';
    procedures.forEach(p => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:16px;cursor:pointer;transition:all .18s';
      card.onmouseenter = () => { card.style.borderColor = 'var(--t3)'; card.style.boxShadow = '0 4px 14px rgba(0,0,0,.05)'; };
      card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.boxShadow = ''; };
      card.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
          <div style="font-size:28px;line-height:1">${p.icon}</div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:3px">${p.title}</div>
            ${p.required?'<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;background:var(--rbg);color:var(--rt)">OBLIGATOIRE</span>':'<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;background:var(--bg2);color:var(--t3)">RECOMMANDÉ</span>'}
          </div>
        </div>
        <div style="font-size:11.5px;color:var(--t2);line-height:1.55">${p.desc}</div>
      `;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  rebuild();
}

// (modules suivants seront ajoutés dans la prochaine passe)

// ══════════════════════════════════════════
// ÉQUIPE & RH — Planning, pointeuse, contrats
// ══════════════════════════════════════════
function renderEquipeRH(c){
  let currentTab = 'planning';
  const body = makePageShell(c, 'Équipe & RH', 
    '9 membres · Planning, pointeuse, contrats, congés',
    [{label:'⏱ Ouvrir pointeuse', onclick:"toast('Pointeuse pour salariés')"},{label:'+ Shift', onclick:"toast('Nouveau shift')", primary:true}]);

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:"Présents aujourd'hui", v:'7/9', s:'Paul absent · Tom retard', col:'#16A34A'},
      {l:'Heures semaine', v:'168h', s:'/ 180h planifiées · +3h sup', col:'#2563EB', mono:true},
      {l:'Coût MO semaine', v:'2 450€', s:'13% du CA estimé', col:'#7C3AED', mono:true},
      {l:'Congés à venir', v:'2', s:'Léa du 20 au 24 avr.', col:'#D97706'}
    ]));

    const tabs = [
      {k:'planning', label:'📅 Planning'},
      {k:'pointeuse', label:'⏱ Pointeuse'},
      {k:'membres', label:'👥 Membres'},
      {k:'contrats', label:'📄 Contrats & docs'},
      {k:'conges', label:'✈ Congés & absences'}
    ];
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));

    if(currentTab === 'planning') renderPlanningTab();
    else if(currentTab === 'pointeuse') renderPointeuseTab();
    else if(currentTab === 'membres') renderMembresTab();
    else if(currentTab === 'contrats') renderContratsTab();
    else if(currentTab === 'conges') renderCongesTab();
  }

  const team = [
    {n:'Antoine Martin', role:'Manager', contract:'CDI', hours:39, hourly:18.50, s:['M','M','S','S','M','M','OFF'], c:'#E89A3C', phone:'06 12 34 56 78', email:'antoine@laplaya.fr', start:'2020-04-01'},
    {n:'Marco Giraldi', role:'Chef de cuisine', contract:'CDI', hours:42, hourly:22.00, s:['M','M','M','OFF','M','M','M'], c:'#DC2626', phone:'06 23 45 67 89', email:'marco@laplaya.fr', start:'2022-03-15'},
    {n:'Sophie Arnaud', role:'Responsable bar', contract:'CDI', hours:39, hourly:15.80, s:['S','S','M','S','S','S','M'], c:'#7C3AED', phone:'06 34 56 78 90', email:'sophie@laplaya.fr', start:'2021-05-10'},
    {n:'Paul Béranger', role:'Serveur', contract:'CDD saison', hours:35, hourly:13.20, s:['M','ABS','M','M','S','OFF','OFF'], c:'#2563EB', phone:'06 45 67 89 01', email:'paul.b@gmail.com', start:'2026-04-01'},
    {n:'Léa Castaing', role:'Serveuse', contract:'CDD saison', hours:35, hourly:13.20, s:['S','M','S','OFF','S','M','S'], c:'#16A34A', phone:'06 56 78 90 12', email:'lea.c@gmail.com', start:'2026-04-01'},
    {n:'Romain Faure', role:'Plagiste', contract:'CDD saison', hours:35, hourly:12.80, s:['M','S','M','S','M','S','OFF'], c:'#0284C7', phone:'06 67 89 01 23', email:'romain.f@gmail.com', start:'2026-04-01'},
    {n:'Clara Hubert', role:'Serveuse', contract:'Extra', hours:24, hourly:13.50, s:['OFF','M','S','M','S','M','S'], c:'#D97706', phone:'06 78 90 12 34', email:'clara.h@gmail.com', start:'2025-06-15'},
    {n:'Nadia Bouzid', role:'Plongeuse', contract:'CDD saison', hours:35, hourly:11.90, s:['M','M','M','S','S','S','M'], c:'#0891B2', phone:'06 89 01 23 45', email:'nadia.b@gmail.com', start:'2026-04-15'},
    {n:'Tom Vidal', role:'Runner / Commis', contract:'Stage', hours:28, hourly:6.50, s:['S','OFF','S','M','M','S','S'], c:'#9333EA', phone:'06 90 12 34 56', email:'tom.v@etudiant.fr', start:'2026-04-10'}
  ];

  function renderPlanningTab(){
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep);display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--t1)">Semaine du 14 au 20 avril 2026</div>
          <div style="font-size:11px;color:var(--t3);margin-top:2px">M = Midi (5h) · S = Service complet (9h) · N = Soir (5h) · ABS = Absent</div>
        </div>
        <div style="display:flex;gap:4px">
          <button style="width:32px;height:32px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer">‹</button>
          <button style="width:32px;height:32px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer">›</button>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 14px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Membre</th>
            ${['Lun 14','Mar 15','Mer 16','Jeu 17','Ven 18','Sam 19','Dim 20'].map(d=>`<th style="text-align:center;padding:10px 4px;font-size:10px;font-weight:700;color:var(--t3)">${d}</th>`).join('')}
            <th style="text-align:right;padding:10px 14px;font-size:10px;font-weight:700;color:var(--t3)">Total</th>
            <th style="text-align:right;padding:10px 14px;font-size:10px;font-weight:700;color:var(--t3)">Coût</th>
          </tr>
        </thead>
        <tbody>
          ${team.map(m=>{
            const totalH = m.s.filter(x=>x!=='OFF'&&x!=='ABS').reduce((h,x)=>h+(x==='S'?9:x==='M'?5:x==='N'?5:0),0);
            const cost = totalH * m.hourly;
            return `<tr style="border-bottom:0.5px solid var(--sep)">
              <td style="padding:10px 14px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:30px;height:30px;border-radius:50%;background:${m.c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${m.n.split(' ').map(x=>x[0]).join('').substring(0,2)}</div>
                  <div>
                    <div style="font-size:12px;font-weight:600;color:var(--t1)">${m.n}</div>
                    <div style="font-size:10px;color:var(--t3)">${m.role}</div>
                  </div>
                </div>
              </td>
              ${m.s.map(x=>{
                const co = {M:{bg:'#EDF7F1',c:'#1A7A3E'}, S:{bg:'#EFF6FF',c:'#2563EB'}, N:{bg:'#F5F3FF',c:'#7C3AED'}, ABS:{bg:'#FEF2F2',c:'#DC2626'}, OFF:{bg:'transparent',c:'var(--t5)'}}[x];
                return `<td style="text-align:center;padding:8px 4px"><div style="display:inline-block;padding:4px 8px;border-radius:6px;background:${co.bg};color:${co.c};font-size:10px;font-weight:700;font-family:'DM Mono',monospace;min-width:32px">${x==='OFF'?'—':x}</div></td>`;
              }).join('')}
              <td style="text-align:right;padding:10px 14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${totalH}h</td>
              <td style="text-align:right;padding:10px 14px;color:var(--t2);font-family:'DM Mono',monospace;font-size:11px">${cost.toFixed(0)}€</td>
            </tr>`;
          }).join('')}
          <tr style="background:var(--bg);font-weight:700">
            <td colspan="8" style="padding:10px 14px;text-align:right;color:var(--t2);font-size:11px;text-transform:uppercase;letter-spacing:.08em">Total semaine</td>
            <td style="text-align:right;padding:10px 14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">267h</td>
            <td style="text-align:right;padding:10px 14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">4 385€</td>
          </tr>
        </tbody>
      </table>
    `;
    body.appendChild(card);
  }

  function renderPointeuseTab(){
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 380px;gap:14px';
    body.appendChild(wrap);

    const main = document.createElement('div');
    main.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    main.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Pointeuse — quinzaine en cours</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Du 7 au 20 avril 2026 · Les salariés pointent sur la tablette d\'accueil</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Salarié</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Prévues</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Réalisées</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Écart</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Heures sup</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">À payer</th>
          </tr>
        </thead>
        <tbody>
          ${team.slice(1).map(m=>{
            const planned = Math.round(m.hours*14/7);
            const worked = planned + (Math.random()>0.5 ? Math.round(Math.random()*6) : -Math.round(Math.random()*3));
            const ecart = worked - planned;
            const sup = Math.max(0, worked - m.hours*14/7);
            const total = (worked * m.hourly) + (sup * m.hourly * 0.25);
            return `<tr style="border-bottom:0.5px solid var(--bg)">
              <td style="padding:10px 18px">
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:28px;height:28px;border-radius:50%;background:${m.c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${m.n.split(' ').map(x=>x[0]).join('').substring(0,2)}</div>
                  <div>
                    <div style="font-size:12px;font-weight:600;color:var(--t1)">${m.n}</div>
                    <div style="font-size:10px;color:var(--t3)">${m.contract} · ${m.hourly}€/h</div>
                  </div>
                </div>
              </td>
              <td style="text-align:center;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace">${planned}h</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${worked}h</td>
              <td style="text-align:center;padding:10px 8px"><span style="color:${ecart>0?'var(--gt)':ecart<0?'var(--rt)':'var(--t3)'};font-weight:700;font-family:'DM Mono',monospace">${ecart>0?'+':''}${ecart}h</span></td>
              <td style="text-align:center;padding:10px 8px;color:var(--ot);font-weight:700;font-family:'DM Mono',monospace">${sup>0?'+'+sup+'h':'—'}</td>
              <td style="text-align:right;padding:10px 18px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${total.toFixed(0)}€</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div style="padding:14px 18px;background:var(--bg);border-top:0.5px solid var(--sep);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:var(--t2)">Masse salariale quinzaine (hors charges) :</span>
        <span style="font-size:16px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">8 640€</span>
      </div>
    `;
    wrap.appendChild(main);

    const right = document.createElement('div');
    right.style.cssText = 'display:flex;flex-direction:column;gap:12px';
    right.innerHTML = `
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:16px">
        <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:10px">Pointage en temps réel</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--gbg);border-radius:8px"><div><div style="font-size:12px;font-weight:600;color:#14532D">Sophie Arnaud</div><div style="font-size:10px;color:#166534">Entrée 10:42</div></div><span style="width:8px;height:8px;border-radius:50%;background:#16A34A;box-shadow:0 0 0 3px rgba(22,163,74,.15)"></span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--gbg);border-radius:8px"><div><div style="font-size:12px;font-weight:600;color:#14532D">Marco Giraldi</div><div style="font-size:10px;color:#166534">Entrée 09:15</div></div><span style="width:8px;height:8px;border-radius:50%;background:#16A34A"></span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--rbg);border-radius:8px"><div><div style="font-size:12px;font-weight:600;color:#7F1D1D">Paul Béranger</div><div style="font-size:10px;color:#991B1B">Absent déclaré</div></div><span style="width:8px;height:8px;border-radius:50%;background:#DC2626"></span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--obg);border-radius:8px"><div><div style="font-size:12px;font-weight:600;color:#7C2D12">Tom Vidal</div><div style="font-size:10px;color:#9A3412">En retard · arrivée prévue</div></div><span style="width:8px;height:8px;border-radius:50%;background:#D97706"></span></div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#F0FDF4,#DCFCE7);border:1px solid #86EFAC;border-radius:12px;padding:14px">
        <div style="font-size:11px;font-weight:700;color:#14532D;margin-bottom:6px">📱 Pointage mobile</div>
        <div style="font-size:11.5px;color:#14532D;line-height:1.5">Les salariés peuvent pointer depuis leur téléphone via QR code affiché en cuisine. Calcul automatique des heures sup.</div>
        <button onclick="toast('QR code pointeuse affiché')" style="margin-top:8px;padding:8px 14px;border:1px solid #16A34A;background:transparent;border-radius:8px;color:#14532D;font-size:11px;font-weight:600;cursor:pointer">Afficher QR code →</button>
      </div>
      <div style="background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:14px">
        <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">📊 Export</div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <button onclick="toast('Export CSV paie')" style="padding:8px 12px;border:1px solid var(--sep);background:var(--card);border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:left;color:var(--t2)">📄 Export paie (CSV)</button>
          <button onclick="toast('Export heures DPAE')" style="padding:8px 12px;border:1px solid var(--sep);background:var(--card);border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:left;color:var(--t2)">📋 Récap quinzaine (PDF)</button>
          <button onclick="toast('URSSAF déclaration')" style="padding:8px 12px;border:1px solid var(--sep);background:var(--card);border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:left;color:var(--t2)">🏛 Préparation DSN</button>
        </div>
      </div>
    `;
    wrap.appendChild(right);
  }

  function renderMembresTab(){
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px';
    team.forEach(m => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .18s';
      card.onmouseenter = () => { card.style.borderColor = 'var(--t3)'; card.style.boxShadow = '0 4px 14px rgba(0,0,0,.05)'; };
      card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.boxShadow = ''; };
      card.onclick = () => toast('Fiche '+m.n);
      const contractColor = m.contract === 'CDI' ? 'var(--gt)' : m.contract === 'Stage' ? 'var(--bt)' : 'var(--ot)';
      const contractBg = m.contract === 'CDI' ? 'var(--gbg)' : m.contract === 'Stage' ? 'var(--bbg)' : 'var(--obg)';
      card.innerHTML = `
        <div style="padding:16px;display:flex;gap:12px;border-bottom:0.5px solid var(--bg)">
          <div style="width:56px;height:56px;border-radius:50%;background:${m.c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0">${m.n.split(' ').map(x=>x[0]).join('').substring(0,2)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:14px;font-weight:700;color:var(--t1)">${m.n}</div>
            <div style="font-size:12px;color:var(--t3);margin-top:2px">${m.role}</div>
            <span style="display:inline-block;margin-top:5px;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${contractBg};color:${contractColor}">${m.contract}</span>
          </div>
        </div>
        <div style="padding:12px 16px;font-size:11.5px;color:var(--t2);line-height:1.6">
          <div style="display:flex;gap:8px;align-items:center;padding:3px 0">
            <span style="color:var(--t4);width:14px">📱</span><span style="font-family:'DM Mono',monospace">${m.phone}</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;padding:3px 0">
            <span style="color:var(--t4);width:14px">✉</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.email}</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;padding:3px 0">
            <span style="color:var(--t4);width:14px">📅</span><span>Entrée : ${new Date(m.start).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        <div style="padding:10px 16px;background:var(--bg);display:flex;justify-content:space-between;font-size:11px">
          <div><span style="color:var(--t3)">Hebdo :</span> <b style="color:var(--t1);font-family:'DM Mono',monospace">${m.hours}h</b></div>
          <div><span style="color:var(--t3)">Taux horaire :</span> <b style="color:var(--t1);font-family:'DM Mono',monospace">${m.hourly}€</b></div>
        </div>
      `;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function renderContratsTab(){
    const docs = [
      {type:'Contrat CDI', person:'Antoine Martin', status:'Signé', date:'01/04/2020', expires:'—'},
      {type:'Contrat CDI', person:'Marco Giraldi', status:'Signé', date:'15/03/2022', expires:'—'},
      {type:'Contrat CDI', person:'Sophie Arnaud', status:'Signé', date:'10/05/2021', expires:'—'},
      {type:'CDD saisonnier', person:'Paul Béranger', status:'Signé', date:'01/04/2026', expires:'31/10/2026'},
      {type:'CDD saisonnier', person:'Léa Castaing', status:'Signé', date:'01/04/2026', expires:'31/10/2026'},
      {type:'CDD saisonnier', person:'Romain Faure', status:'Signé', date:'01/04/2026', expires:'31/10/2026'},
      {type:'Convention stage', person:'Tom Vidal', status:'Signé', date:'10/04/2026', expires:'30/06/2026'},
      {type:'Mutuelle collective', person:'Tous les CDI', status:'Actif', date:'01/01/2025', expires:'31/12/2026'},
      {type:'Médecine du travail', person:'Tous', status:'À jour', date:'Visite annuelle', expires:'Mars 2027'},
      {type:'DUERP (obligatoire)', person:'Document unique', status:'À jour', date:'Mis à jour 02/2026', expires:'Revoir 02/2027'},
      {type:'Registre unique personnel', person:'Document légal', status:'À jour', date:'—', expires:'—'},
      {type:'Affichages obligatoires', person:'Conv. collective + repos', status:'Affiché', date:'—', expires:'—'}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep);display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--t1)">Contrats & documents RH</div>
          <div style="font-size:11px;color:var(--t3);margin-top:2px">12 documents actifs · Conservation obligatoire 5 ans minimum</div>
        </div>
        <button onclick="toast('Nouveau document')" style="padding:7px 14px;border-radius:8px;border:1px solid var(--sep);background:var(--card);font-size:11.5px;font-weight:600;cursor:pointer">+ Document</button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Type</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Concerne</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Statut</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Date</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Échéance</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${docs.map(d=>`
            <tr style="border-bottom:0.5px solid var(--bg);cursor:pointer" onmouseenter="this.style.background='var(--bg)'" onmouseleave="this.style.background=''">
              <td style="padding:10px 18px;font-weight:600;color:var(--t1);font-size:12px">${d.type}</td>
              <td style="padding:10px 8px;color:var(--t2)">${d.person}</td>
              <td style="text-align:center;padding:10px 8px"><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:var(--gbg);color:var(--gt)">${d.status}</span></td>
              <td style="text-align:center;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace;font-size:11px">${d.date}</td>
              <td style="text-align:center;padding:10px 8px;color:${d.expires.includes('2026')||d.expires.includes('Mars 2027')?'var(--ot)':'var(--t3)'};font-family:'DM Mono',monospace;font-size:11px">${d.expires}</td>
              <td style="text-align:right;padding:10px 18px"><button onclick="event.stopPropagation();toast('Document ouvert')" style="border:none;background:none;color:var(--t2);font-size:11px;font-weight:600;cursor:pointer">Voir →</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    body.appendChild(card);
  }

  function renderCongesTab(){
    const conges = [
      {person:'Léa Castaing', type:'Congés payés', start:'20/04', end:'24/04', days:5, status:'Approuvé'},
      {person:'Romain Faure', type:'Absence', start:'25/05', end:'26/05', days:2, status:'En attente'},
      {person:'Clara Hubert', type:'Congés payés', start:'10/06', end:'15/06', days:6, status:'Approuvé'},
      {person:'Paul Béranger', type:'Arrêt maladie', start:'17/04', end:'18/04', days:2, status:'En cours'},
      {person:'Nadia Bouzid', type:'Congés payés', start:'14/07', end:'21/07', days:8, status:'À valider'}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep);display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--t1)">Congés & absences</div>
          <div style="font-size:11px;color:var(--t3);margin-top:2px">Calendrier prévisionnel saison 2026</div>
        </div>
        <button onclick="toast('Nouvelle demande')" style="padding:7px 14px;border-radius:8px;border:none;background:var(--t1);color:#fff;font-size:11.5px;font-weight:600;cursor:pointer">+ Demande</button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Salarié</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Type</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Du</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Au</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Jours</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Statut</th>
          </tr>
        </thead>
        <tbody>
          ${conges.map(c=>{
            const statusColor = c.status === 'Approuvé' ? {bg:'var(--gbg)',c:'var(--gt)'} : c.status === 'En attente' || c.status === 'À valider' ? {bg:'var(--obg)',c:'var(--ot)'} : {bg:'var(--bbg)',c:'var(--bt)'};
            return `<tr style="border-bottom:0.5px solid var(--bg)">
              <td style="padding:10px 18px;font-weight:700;color:var(--t1)">${c.person}</td>
              <td style="padding:10px 8px;color:var(--t2)">${c.type}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace">${c.start}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace">${c.end}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${c.days}</td>
              <td style="text-align:right;padding:10px 18px"><span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;background:${statusColor.bg};color:${statusColor.c}">${c.status}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
    body.appendChild(card);
  }

  rebuild();
}


// ══════════════════════════════════════════
// ÉVÉNEMENTIEL — Devis, formules, privatisations
// ══════════════════════════════════════════
function renderEvent(c){
  let currentTab = 'devis';
  const body = makePageShell(c, 'Événementiel & Privatisations', 
    'Devis · formules groupes · privatisation · base prospects',
    [{label:'📊 Tableau de bord', onclick:"toast('Dashboard événementiel')"},{label:'+ Nouveau devis', onclick:"toast('Assistant devis')", primary:true}]);

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Événements prévus', v:'8', s:'Avril + mai 2026', col:'#A21CAF'},
      {l:'CA prévisionnel', v:'12 850€', s:'↑ +22% vs 2025', col:'#16A34A', mono:true},
      {l:'Devis en attente', v:'3', s:'à relancer aujourd\'hui', col:'#D97706'},
      {l:'Taux conversion', v:'68%', s:'↑ +4pts · très bon', col:'#2563EB'}
    ]));

    const tabs = [
      {k:'devis', label:'📋 Devis & prospects'},
      {k:'formules', label:'📦 Formules événementielles'},
      {k:'strategy', label:'💰 Stratégie prix'},
      {k:'calendar', label:'📅 Calendrier'}
    ];
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));

    if(currentTab === 'devis') renderDevisTab();
    else if(currentTab === 'formules') renderFormulesTab();
    else if(currentTab === 'strategy') renderStrategyTab();
    else if(currentTab === 'calendar') renderCalendarTab();
  }

  function renderDevisTab(){
    const devis = [
      {client:'Famille Dubois', type:'Anniversaire 40 ans', date:'04/05/2026', guests:35, total:2450, status:'Accepté', deposit:'50% versé', menu:'Formule Prestige'},
      {client:'SARL Costa', type:'Séminaire entreprise', date:'22/05/2026', guests:22, total:1650, status:'Accepté', deposit:'En attente', menu:'Formule Pro'},
      {client:'M. et Mme Robert', type:'Mariage plage', date:'12/06/2026', guests:65, total:6850, status:'En négociation', deposit:'—', menu:'Sur mesure'},
      {client:'Amicale Nîmes', type:'Sortie club retraités', date:'08/05/2026', guests:28, total:1470, status:'Accepté', deposit:'100% versé', menu:'Formule Détente'},
      {client:'Fondation Camargue', type:'Cocktail associatif', date:'15/05/2026', guests:80, total:3200, status:'Proposé', deposit:'—', menu:'Cocktail dînatoire'},
      {client:'Entreprise Peyrouse', type:'Team building', date:'30/05/2026', guests:18, total:1380, status:'Relance', deposit:'—', menu:'Déjeuner + beach'},
      {client:'Mme Garcia (privé)', type:'Baptême', date:'25/05/2026', guests:40, total:2800, status:'Proposé', deposit:'—', menu:'Menu enfants inclus'},
      {client:'MutuelleMed', type:'Journée bien-être', date:'06/06/2026', guests:45, total:3150, status:'En négociation', deposit:'—', menu:'Apéro + buffet'}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Devis & prospects en cours</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">${devis.length} demandes actives · Total potentiel : ${devis.reduce((s,d)=>s+d.total,0).toLocaleString('fr-FR')}€</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Client</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Type</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Date</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Couverts</th>
            <th style="text-align:right;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Montant</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Statut</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Acompte</th>
          </tr>
        </thead>
        <tbody>
          ${devis.map(d=>{
            const statCol = d.status==='Accepté'?{bg:'var(--gbg)',c:'var(--gt)'}:d.status==='Proposé'?{bg:'var(--bbg)',c:'var(--bt)'}:d.status==='En négociation'?{bg:'var(--obg)',c:'var(--ot)'}:{bg:'var(--rbg)',c:'var(--rt)'};
            return `<tr style="border-bottom:0.5px solid var(--bg);cursor:pointer" onclick="toast('Détail devis ${d.client}')">
              <td style="padding:10px 18px"><div style="font-weight:700;color:var(--t1)">${d.client}</div><div style="font-size:10px;color:var(--t4);margin-top:1px">${d.menu}</div></td>
              <td style="padding:10px 8px;color:var(--t2)">${d.type}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t2);font-family:'DM Mono',monospace">${d.date}</td>
              <td style="text-align:center;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${d.guests}</td>
              <td style="text-align:right;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${d.total.toLocaleString('fr-FR')}€</td>
              <td style="text-align:center;padding:10px 8px"><span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;background:${statCol.bg};color:${statCol.c}">${d.status}</span></td>
              <td style="text-align:right;padding:10px 18px;color:var(--t3);font-size:11px">${d.deposit}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
    body.appendChild(card);
  }

  function renderFormulesTab(){
    const formulas = [
      {name:'Formule Détente', target:'Groupes loisirs, associations', min:15, max:40, pricePP:52, includes:['Apéritif de bienvenue (1 verre)','Menu 3 services','Vin & eau incluses','Café gourmand'], margin:62, color:'#16A34A'},
      {name:'Formule Prestige', target:'Anniversaires, célébrations', min:20, max:50, pricePP:75, includes:['Apéritif dinatoire amuse-bouches','Entrée + plat + dessert','Vin au verre accord','Champagne final','Privatisation partielle'], margin:58, color:'#A21CAF'},
      {name:'Formule Pro (séminaire)', target:'Entreprises, B2B', min:10, max:35, pricePP:68, includes:['Café accueil','Menu 3 services','Eau plate + gazeuse','Café gourmand','Salle silencieuse possible'], margin:65, color:'#2563EB'},
      {name:'Cocktail dînatoire', target:'Inaugurations, cocktails', min:30, max:120, pricePP:42, includes:['Buffet debout 12 pièces/pers','Boissons 2h (vin + soft)','Service serveurs dédiés'], margin:68, color:'#D97706'},
      {name:'Mariage plage', target:'Mariages & grandes célébrations', min:50, max:120, pricePP:110, includes:['Vin d\'honneur 1h30','Menu 4 services','Vins accords inclus','Champagne gâteau','Privatisation intégrale','Possibilité DJ'], margin:52, color:'#DC2626'},
      {name:'Menu enfant (add-on)', target:'Événements familiaux', min:null, max:null, pricePP:18, includes:['Plat adapté','Dessert + boisson','Coloriages + activités'], margin:72, color:'#7C3AED'}
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px';
    formulas.forEach(f => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
      card.innerHTML = `
        <div style="padding:16px 18px;background:linear-gradient(135deg,${f.color}10,${f.color}30);border-bottom:0.5px solid var(--sep)">
          <div style="font-size:14px;font-weight:800;color:${f.color}">${f.name}</div>
          <div style="font-size:11px;color:var(--t3);margin-top:3px">${f.target}</div>
          <div style="display:flex;align-items:baseline;gap:4px;margin-top:8px">
            <span style="font-size:26px;font-weight:800;color:var(--t1);font-family:'DM Mono',monospace;letter-spacing:-.5px">${f.pricePP}€</span>
            <span style="font-size:12px;color:var(--t3)">/ pers.</span>
          </div>
          ${f.min?`<div style="font-size:10.5px;color:var(--t3);margin-top:3px">${f.min}-${f.max} personnes</div>`:''}
        </div>
        <div style="padding:14px 18px">
          <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Inclus</div>
          <ul style="margin:0;padding-left:18px;font-size:12px;color:var(--t2);line-height:1.7">
            ${f.includes.map(i=>`<li>${i}</li>`).join('')}
          </ul>
        </div>
        <div style="padding:10px 18px;background:var(--bg);display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:11px;color:var(--t3)">Marge estimée</span>
          <span style="font-size:13px;font-weight:700;color:var(--gt);font-family:'DM Mono',monospace">${f.margin}%</span>
        </div>
      `;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function renderStrategyTab(){
    const strategies = [
      {title:'Règle des saisons', rule:'+20% juillet-août · +10% juin-sept · prix base mai', why:'Demande x3 en haute saison, place rare sur la plage'},
      {title:'Minimum de panier', rule:'Privatisation : 3 500€ min. semaine · 5 500€ min. weekend', why:'Opportunité coût : perdre 50 couverts service classique'},
      {title:'Acompte & arrhes', rule:'30% à la signature · 50% J-15 · solde jour J', why:'Sécuriser les no-show, risque majeur événementiel'},
      {title:'Bar ouvert vs fermé', rule:'Forfait bar 25€/pers 2h · open bar 35€/pers 3h', why:'Monter en gamme, contrôler les coûts liquides'},
      {title:'Suppléments marge haute', rule:'Vin supplémentaire +40% · champagne +55%', why:'Élasticité prix en événementiel : faible, clients non-sensibles'},
      {title:'Groupe de 6 à 15', rule:'Pas de formule dédiée, menu carte + verre offert', why:'Garder la flexibilité · ne pas saturer le service'},
      {title:'Annulation', rule:'Moins de 30j : acompte retenu · moins de 7j : 50% du total', why:'Politique claire à mentionner dans le devis signé'},
      {title:'Up-sell systématique', rule:'Proposer 1 option premium (champagne, plateau fruits de mer)', why:'Augmente panier moyen de +15% en moyenne'}
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:12px';
    strategies.forEach(s => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:16px 18px';
      card.innerHTML = `
        <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:8px">${s.title}</div>
        <div style="padding:10px 12px;background:var(--bg);border-left:3px solid var(--t1);border-radius:0 8px 8px 0;margin-bottom:10px">
          <div style="font-size:12.5px;font-weight:700;color:var(--t1);line-height:1.45">${s.rule}</div>
        </div>
        <div style="font-size:11.5px;color:var(--t3);line-height:1.5">💡 <b>Pourquoi :</b> ${s.why}</div>
      `;
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function renderCalendarTab(){
    const events = [
      {date:'04/05', day:'Dim', name:'Anniversaire Dubois (35 pax)', status:'Confirmé', revenue:2450},
      {date:'08/05', day:'Jeu', name:'Amicale Nîmes (28 pax)', status:'Confirmé', revenue:1470},
      {date:'15/05', day:'Jeu', name:'Fondation Camargue (80 pax)', status:'Proposé', revenue:3200},
      {date:'22/05', day:'Jeu', name:'Séminaire SARL Costa (22 pax)', status:'Confirmé', revenue:1650},
      {date:'25/05', day:'Dim', name:'Baptême Garcia (40 pax)', status:'Proposé', revenue:2800},
      {date:'30/05', day:'Ven', name:'Team building Peyrouse (18 pax)', status:'Relance', revenue:1380},
      {date:'06/06', day:'Ven', name:'MutuelleMed (45 pax)', status:'Négociation', revenue:3150},
      {date:'12/06', day:'Jeu', name:'Mariage Robert (65 pax)', status:'Négociation', revenue:6850}
    ];

    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden';
    card.innerHTML = `
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Calendrier événements · Printemps 2026</div>
      </div>
      <div style="display:flex;flex-direction:column">
        ${events.map(e=>{
          const statCol = e.status==='Confirmé'?'var(--gt)':e.status==='Proposé'?'var(--bt)':e.status==='Négociation'?'var(--ot)':'var(--rt)';
          const statBg = e.status==='Confirmé'?'var(--gbg)':e.status==='Proposé'?'var(--bbg)':e.status==='Négociation'?'var(--obg)':'var(--rbg)';
          return `<div style="display:grid;grid-template-columns:70px 60px 1fr auto 120px;gap:16px;align-items:center;padding:14px 18px;border-bottom:0.5px solid var(--bg);cursor:pointer" onmouseenter="this.style.background='var(--bg)'" onmouseleave="this.style.background=''">
            <div style="text-align:center">
              <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase">${e.day}</div>
              <div style="font-size:20px;font-weight:800;color:var(--t1);font-family:'DM Mono',monospace;letter-spacing:-.5px">${e.date.split('/')[0]}</div>
              <div style="font-size:9px;color:var(--t4)">${e.date.split('/')[1]}/2026</div>
            </div>
            <div style="width:3px;height:40px;background:${statCol};border-radius:2px"></div>
            <div style="font-size:13px;font-weight:600;color:var(--t1)">${e.name}</div>
            <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;background:${statBg};color:${statCol}">${e.status}</span>
            <div style="text-align:right;font-size:15px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${e.revenue.toLocaleString('fr-FR')}€</div>
          </div>`;
        }).join('')}
      </div>
    `;
    body.appendChild(card);
  }

  rebuild();
}


// ══════════════════════════════════════════
