// URGENCES — Procédures, contacts d'urgence
// ══════════════════════════════════════════
function renderUrgences(c){
  const body = makePageShell(c, 'Urgences & Sécurité', 
    'Procédures d\'urgence · contacts critiques · plan évacuation',
    [{label:'📋 Plan d\'évacuation', onclick:"toast('Plan affiché')"},{label:'🚨 Tester alarme', onclick:"toast('Test alarme')", primary:true}]);

  // Contacts critiques
  body.innerHTML += `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
      ${[
        {num:'112', label:'Urgences européennes', sub:'Police, pompiers, SAMU', col:'#DC2626'},
        {num:'18', label:'Pompiers', sub:'Incendie, accident grave', col:'#DC2626'},
        {num:'15', label:'SAMU', sub:'Urgence médicale', col:'#DC2626'},
        {num:'17', label:'Police', sub:'Ordre public, vol', col:'#2563EB'},
        {num:'196', label:'Sauvetage en mer', sub:'CROSS Méditerranée', col:'#0284C7'},
        {num:'3237', label:'Pharmacie de garde', sub:'Nuit et jours fériés', col:'#16A34A'}
      ].map(n=>`<div style="background:var(--card);border-left:4px solid ${n.col};border-radius:0 12px 12px 0;padding:14px 16px;cursor:pointer" onclick="window.open('tel:${n.num}')">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">${n.label}</div>
            <div style="font-size:10.5px;color:var(--t3);margin-top:2px">${n.sub}</div>
          </div>
          <div style="font-size:28px;font-weight:800;color:${n.col};font-family:'DM Mono',monospace;letter-spacing:-1px">${n.num}</div>
        </div>
      </div>`).join('')}
    </div>
  `;

  // Contacts locaux
  const locals = [
    {type:'🏥 Hôpital', name:'Hôpital d\'Arles', phone:'04 90 49 29 29', dist:'28 km · 25 min'},
    {type:'🏥 Médecin local', name:'Dr. Martin (cabinet)', phone:'04 90 97 56 78', dist:'Saintes-Maries centre'},
    {type:'💊 Pharmacie', name:'Pharmacie de la Plage', phone:'04 90 97 XX XX', dist:'500m · à pied'},
    {type:'🦷 Dentiste', name:'Cabinet Dubreuil', phone:'04 90 97 XX XX', dist:'Aigues-Mortes · 12km'},
    {type:'🚤 SNSM', name:'Sauvetage en mer Saintes-Maries', phone:'04 90 97 XX XX', dist:'Port · 2 km'},
    {type:'👮 Gendarmerie', name:'Brigade Saintes-Maries', phone:'04 90 97 89 50', dist:'Centre · 1.2 km'}
  ];

  body.innerHTML += `
    <div style="background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;margin-bottom:16px">
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Contacts locaux</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Saintes-Maries-de-la-Mer et alentours</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr)">
        ${locals.map((l,i)=>`<div style="padding:14px 16px;border-right:${(i+1)%3===0?'none':'0.5px solid var(--bg)'};border-bottom:${i<locals.length-3?'0.5px solid var(--bg)':'none'};cursor:pointer" onclick="window.open('tel:${l.phone.replace(/\s/g,'')}')">
          <div style="font-size:11px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">${l.type}</div>
          <div style="font-size:13px;font-weight:700;color:var(--t1);margin-top:4px">${l.name}</div>
          <div style="font-size:11px;color:var(--t1);font-family:'DM Mono',monospace;margin-top:3px;font-weight:600">${l.phone}</div>
          <div style="font-size:10px;color:var(--t3);margin-top:3px">${l.dist}</div>
        </div>`).join('')}
      </div>
    </div>
  `;

  // Procédures d'urgence
  const procedures = [
    {icon:'🔥', title:'Incendie / départ de feu', steps:['1. ALARMER les clients et l\'équipe (coupure musique)', '2. ÉVACUER calmement vers le parking (sortie principale)', '3. FERMER le gaz au compteur général', '4. APPELER les pompiers (18)', '5. COMPTER les personnes au point de rassemblement', '6. NE PAS retourner à l\'intérieur'], color:'#DC2626'},
    {icon:'💉', title:'Accident du travail / client', steps:['1. Ne pas déplacer la victime si traumatisme', '2. Rassurer et parler à la personne', '3. Si inconscient : PLS (position latérale de sécurité)', '4. Si hémorragie : compression avec tissu propre', '5. APPELER le 15 ou 112', '6. Donner : lieu, type accident, nombre blessés, état'], color:'#F97316'},
    {icon:'⚡', title:'Coupure électrique', steps:['1. Vérifier disjoncteur général dans le local technique', '2. Si coupure générale EDF : appeler 09 72 67 50 XX', '3. Ouvrir les issues de secours (déblocage auto)', '4. Évaluer impact chaîne du froid (voir procédure)', '5. Si service en cours : caisse bascule sur fonds de caisse', '6. Communiquer calmement aux clients'], color:'#EAB308'},
    {icon:'❄️', title:'Panne frigo / chambre froide', steps:['1. Relever température immédiatement', '2. Si > 8°C depuis moins de 2h : tout basculer en autre frigo', '3. Si > 8°C depuis plus de 2h : jeter produits sensibles (viande, poisson, laitages)', '4. APPELER Sud-Est Froid : 06 45 XX XX XX', '5. Noter l\'incident dans le registre HACCP', '6. Photographier pour assurance'], color:'#0284C7'},
    {icon:'💧', title:'Dégât des eaux / fuite', steps:['1. FERMER la vanne d\'eau générale (local technique)', '2. Couper l\'électricité si eau menace les prises', '3. Protéger matériel sensible (caisse, étui carte bleue)', '4. APPELER Sanitech Camargue : 06 22 XX XX XX', '5. Photographier pour assurance', '6. Consulter contrat assurance multirisque pro'], color:'#0891B2'},
    {icon:'🦠', title:'Suspicion TIAC (intoxication)', steps:['1. Noter les symptômes du/des client(s)', '2. Identifier le/les plat(s) consommé(s)', '3. Prélever échantillothèque correspondante (5j conservation)', '4. Ne pas jeter, ne pas nettoyer les préparations', '5. Déclarer à la DDPP sous 24h : 04 67 XX XX XX', '6. Bloquer les produits suspects en traçabilité'], color:'#A21CAF'}
  ];

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:12px';
  procedures.forEach(p => {
    const card = document.createElement('div');
    card.style.cssText = `background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;border-top:3px solid ${p.color}`;
    card.innerHTML = `
      <div style="padding:14px 18px;display:flex;align-items:center;gap:12px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:28px;line-height:1">${p.icon}</div>
        <div style="font-size:14px;font-weight:700;color:var(--t1)">${p.title}</div>
      </div>
      <div style="padding:12px 18px;font-size:12px;color:var(--t2);line-height:1.65">
        ${p.steps.map(s=>`<div style="padding:4px 0">${s}</div>`).join('')}
      </div>
    `;
    body.appendChild(card);
  });
  body.appendChild(grid);

  // Équipements de sécurité
  body.innerHTML += `
    <div style="background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;margin-top:14px">
      <div style="padding:14px 18px;border-bottom:0.5px solid var(--sep)">
        <div style="font-size:14px;font-weight:700;color:var(--t1)">Équipements de sécurité obligatoires</div>
        <div style="font-size:11px;color:var(--t3);margin-top:2px">Localisation et dates de dernière vérification</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--bg);border-bottom:0.5px solid var(--sep)">
            <th style="text-align:left;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Équipement</th>
            <th style="text-align:left;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Localisation</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Qté</th>
            <th style="text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Vérif.</th>
            <th style="text-align:right;padding:10px 18px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase">Prochain</th>
          </tr>
        </thead>
        <tbody>
          ${[
            {eq:'🧯 Extincteur CO2', loc:'Cuisine, près plancha', qty:2, last:'Janv. 2026', next:'Janv. 2027'},
            {eq:'🧯 Extincteur eau+additif', loc:'Salle + terrasse', qty:3, last:'Janv. 2026', next:'Janv. 2027'},
            {eq:'💊 Trousse de secours', loc:'Bureau + bar', qty:2, last:'Mars 2026', next:'Mars 2027'},
            {eq:'❤ Défibrillateur (DAE)', loc:'Entrée principale', qty:1, last:'Fév. 2026', next:'Fév. 2027'},
            {eq:'🔔 Alarme incendie', loc:'Toutes zones', qty:1, last:'Mars 2026', next:'Sept. 2026'},
            {eq:'🚪 Issues de secours', loc:'2 par zone (salle + cuisine)', qty:4, last:'Avril 2026', next:'Mensuel'},
            {eq:'📋 Registre sécurité', loc:'Bureau manager', qty:1, last:'À jour', next:'Permanent'}
          ].map(e=>`<tr style="border-bottom:0.5px solid var(--bg)">
            <td style="padding:10px 18px;font-weight:700;color:var(--t1)">${e.eq}</td>
            <td style="padding:10px 8px;color:var(--t2)">${e.loc}</td>
            <td style="text-align:center;padding:10px 8px;color:var(--t1);font-weight:700;font-family:'DM Mono',monospace">${e.qty}</td>
            <td style="text-align:center;padding:10px 8px;color:var(--t2);font-size:11px">${e.last}</td>
            <td style="text-align:right;padding:10px 18px;color:${e.next.includes('2026')?'var(--ot)':'var(--t3)'};font-size:11px;font-weight:600">${e.next}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}


// ══════════════════════════════════════════
