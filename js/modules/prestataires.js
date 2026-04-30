// ══════════════════════════════════════════
// PRESTATAIRES — Fournisseurs & Contacts
// ══════════════════════════════════════════
function renderPrestataires(c){
  let currentTab = 'all';
  const body = makePageShell(c, 'Prestataires & Fournisseurs', 
    '32 contacts · Livraisons, artisans, maintenance, services', 
    [{label:'📞 Appel urgent', onclick:"toast('Contact rapide')"},{label:'+ Nouveau contact', onclick:"toast('Formulaire contact')", primary:true}]);

  const prestas = [
    // FOURNISSEURS ALIMENTAIRES
    {id:1, cat:'food', name:'Metro Cash & Carry Nîmes', contact:'Responsable : M. Dupuis', phone:'04 66 XX XX XX', email:'commande.nimes@metro.fr', address:'Zone Grézan, 30000 Nîmes', delivery:'Mar, Jeu · 7h-10h', minOrder:'150€', conditions:'Paiement à 30j · Remise 5% sur alcools', rating:4.5, lastOrder:'Il y a 3j · 842€', tags:['Épicerie','Alcools','Frais']},
    {id:2, cat:'food', name:'Aubanel Boucherie Arles', contact:'M. Aubanel (patron)', phone:'04 90 93 XX XX', email:'aubanel.boucherie@gmail.com', address:'12 rue des Arènes, 13200 Arles', delivery:'Lun, Mer, Ven · 6h-7h', minOrder:'80€', conditions:'Paiement à réception · Taureau AOP garanti', rating:5, lastOrder:'Il y a 2j · 385€', tags:['Viandes','AOP Camargue']},
    {id:3, cat:'food', name:'Poissonnerie Sanary (direct pêche)', contact:'Sébastien', phone:'06 12 XX XX XX', email:'seb.sanary@gmail.com', address:'Port de Sanary', delivery:'Mar, Ven · 5h du matin', minOrder:'Aucun', conditions:'Facture à la semaine · Poisson de ligne', rating:5, lastOrder:'Hier · 268€', tags:['Poissons','Fruits de mer']},
    {id:4, cat:'food', name:'Tellines du Grau (pêcheur local)', contact:'Antoine Roux', phone:'06 87 XX XX XX', email:'', address:'Grau-du-Roi', delivery:'Selon pêche · SMS', minOrder:'2kg', conditions:'Espèces · selon arrivage', rating:4.8, lastOrder:'Il y a 4j · 95€', tags:['Tellines','Direct producteur']},
    {id:5, cat:'food', name:'Marché d\'Arles (producteurs)', contact:'Plusieurs vendeurs', phone:'—', email:'', address:'Place du Marché, Arles', delivery:'Tous les mercredis matin', minOrder:'Aucun', conditions:'Espèces uniquement', rating:4.5, lastOrder:'Mercredi · 212€', tags:['Légumes','Fruits','Herbes']},
    {id:6, cat:'food', name:'Biscuits des Beaux', contact:'Martine', phone:'04 90 54 XX XX', email:'contact@biscuits-baux.fr', address:'Les Baux-de-Provence', delivery:'Livraison semaine sur commande', minOrder:'100€', conditions:'Paiement à 15j', rating:4.7, lastOrder:'Il y a 8j · 145€', tags:['Pâtisserie','Artisan']},
    // VINS
    {id:7, cat:'wine', name:'Caviste Les Halles Saintes-Maries', contact:'Caviste Julien', phone:'04 90 97 XX XX', email:'leshalles.saintes@gmail.com', address:'Place des Gitans, Saintes-Maries', delivery:'Jeu sur commande', minOrder:'200€', conditions:'Paiement à 30j · Consignes retournées', rating:4.8, lastOrder:'Il y a 5j · 612€', tags:['Vins','Spiritueux']},
    {id:8, cat:'wine', name:'Domaine Royal de Jarras', contact:'Catherine Dubois', phone:'04 66 51 XX XX', email:'contact@listel.fr', address:'Aigues-Mortes', delivery:'Livraison mensuelle', minOrder:'300€', conditions:'Remise 8% au-delà 500€ · Vin IGP Camargue', rating:5, lastOrder:'Il y a 12j · 820€', tags:['Vin rosé','IGP Sables de Camargue']},
    // MAINTENANCE
    {id:9, cat:'maintenance', name:'Frigoriste Sud-Est Froid', contact:'M. Pélissier', phone:'06 45 XX XX XX', email:'sud.est.froid@orange.fr', address:'Montpellier', delivery:'Intervention 24h en urgence', minOrder:'—', conditions:'150€/h · Contrat maintenance 1800€/an', rating:4.5, lastOrder:'Il y a 45j · 320€', tags:['Frigo','Chambre froide']},
    {id:10, cat:'maintenance', name:'Plombier Sanitech Camargue', contact:'Julien Manzi', phone:'06 22 XX XX XX', email:'sanitech.camargue@gmail.com', address:'Aigues-Mortes', delivery:'Urgence 2-4h', minOrder:'—', conditions:'85€/h · Déplacement inclus', rating:4.3, lastOrder:'Il y a 90j · 210€', tags:['Plomberie','Urgence']},
    {id:11, cat:'maintenance', name:'Hotte & Extraction Provence', contact:'M. Girard', phone:'04 90 XX XX XX', email:'', address:'Nîmes', delivery:'Entretien annuel obligatoire', minOrder:'—', conditions:'Contrat 650€/an · Intervention incluse', rating:4.6, lastOrder:'Il y a 6 mois · 650€', tags:['Hotte','Sécurité incendie']},
    {id:12, cat:'maintenance', name:'Électricien Camargue Élec', contact:'Fabien Marc', phone:'06 33 XX XX XX', email:'camargue.elec@free.fr', address:'Saintes-Maries', delivery:'Urgence 4h', minOrder:'—', conditions:'75€/h · Tarif week-end +50%', rating:4.7, lastOrder:'Il y a 30j · 180€', tags:['Électricité','Urgence']},
    // SERVICES
    {id:13, cat:'service', name:'Elis (linge pro)', contact:'Contact commercial', phone:'04 91 XX XX XX', email:'marseille@elis.com', address:'Marseille', delivery:'Tous les jeudis', minOrder:'Forfait mensuel', conditions:'820€/mois · nappes, torchons, tabliers', rating:4.4, lastOrder:'Hier', tags:['Linge','Blanchisserie']},
    {id:14, cat:'service', name:'DEC (déchets huiles)', contact:'Accueil', phone:'04 66 XX XX XX', email:'contact@dec-recyclage.fr', address:'Nîmes', delivery:'Mensuel · 1er jeudi', minOrder:'50L min.', conditions:'Gratuit si >50L · Certificat obligatoire', rating:4.8, lastOrder:'Il y a 15j', tags:['Déchets','Recyclage','Obligatoire']},
    {id:15, cat:'service', name:'Dératisation ABC Hygiène', contact:'Pascal', phone:'06 76 XX XX XX', email:'abc.hygiene@sfr.fr', address:'Arles', delivery:'Passage mensuel', minOrder:'—', conditions:'95€/mois · certificat HACCP', rating:4.6, lastOrder:'Il y a 22j', tags:['Hygiène','HACCP','Obligatoire']}
  ];

  body.innerHTML = '';

  // KPIs
  body.appendChild(makeKPIRow([
    {l:'Contacts actifs', v:prestas.length, s:'Fournisseurs, services, artisans', col:'#2563EB'},
    {l:'Livraisons cette semaine', v:'12', s:'Mar, Jeu, Ven principalement', col:'#16A34A'},
    {l:'À commander', v:'3 urgent', s:'Citrons, huile, taureau AOP', col:'#DC2626'},
    {l:'Dépense mois', v:'8 420€', s:'↓ -4% vs mars', col:'#7C3AED', mono:true}
  ]));

  // Sub-nav
  const tabs = [
    {k:'all', label:'Tous', count:prestas.length},
    {k:'food', label:'🍅 Alimentaire', count:prestas.filter(p=>p.cat==='food').length},
    {k:'wine', label:'🍷 Vins & Alcools', count:prestas.filter(p=>p.cat==='wine').length},
    {k:'maintenance', label:'🔧 Maintenance', count:prestas.filter(p=>p.cat==='maintenance').length},
    {k:'service', label:'📋 Services', count:prestas.filter(p=>p.cat==='service').length}
  ];

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Contacts actifs', v:prestas.length, s:'Fournisseurs, services, artisans', col:'#2563EB'},
      {l:'Livraisons cette semaine', v:'12', s:'Mar, Jeu, Ven principalement', col:'#16A34A'},
      {l:'À commander', v:'3 urgent', s:'Citrons, huile, taureau AOP', col:'#DC2626'},
      {l:'Dépense mois', v:'8 420€', s:'↓ -4% vs mars', col:'#7C3AED', mono:true}
    ]));
    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));
    const contentEl = document.createElement('div');
    contentEl.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px';
    const list = currentTab === 'all' ? prestas : prestas.filter(p => p.cat === currentTab);
    list.forEach(p => contentEl.appendChild(makePrestaCard(p)));
    body.appendChild(contentEl);
  }

  function makePrestaCard(p){
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;transition:all .18s';
    card.onmouseenter = () => { card.style.borderColor = 'var(--t3)'; card.style.boxShadow = '0 4px 16px rgba(24,20,10,.06)'; };
    card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.boxShadow = ''; };

    const catIcons = {food:'🍅', wine:'🍷', maintenance:'🔧', service:'📋'};
    const catCols = {food:'#16A34A', wine:'#7C2D12', maintenance:'#0284C7', service:'#7C3AED'};
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '✬' : '') + '☆'.repeat(5 - Math.ceil(p.rating));

    card.innerHTML = `
      <div style="padding:14px 16px;border-bottom:0.5px solid var(--bg);display:flex;align-items:flex-start;gap:12px">
        <div style="width:42px;height:42px;border-radius:11px;background:${catCols[p.cat]}15;color:${catCols[p.cat]};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${catIcons[p.cat]}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;color:var(--t1);line-height:1.25;margin-bottom:2px">${p.name}</div>
          <div style="font-size:11px;color:var(--t3)">${p.contact}</div>
          <div style="font-size:10.5px;color:#D97706;margin-top:3px;letter-spacing:1px">${stars} ${p.rating}</div>
        </div>
      </div>
      <div style="padding:10px 16px;font-size:11.5px;color:var(--t2);line-height:1.6">
        <div style="display:flex;gap:8px;align-items:center;padding:3px 0">
          <span style="width:14px;color:var(--t4)">📱</span>
          <a href="tel:${p.phone}" style="color:var(--t1);font-weight:600;text-decoration:none;font-family:'DM Mono',monospace">${p.phone}</a>
        </div>
        ${p.email?`<div style="display:flex;gap:8px;align-items:center;padding:3px 0">
          <span style="width:14px;color:var(--t4)">✉</span>
          <span style="color:var(--t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.email}</span>
        </div>`:''}
        <div style="display:flex;gap:8px;align-items:center;padding:3px 0">
          <span style="width:14px;color:var(--t4)">📍</span>
          <span style="color:var(--t2)">${p.address}</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;padding:3px 0">
          <span style="width:14px;color:var(--t4)">🚚</span>
          <span style="color:var(--t2)"><b>${p.delivery}</b></span>
        </div>
      </div>
      <div style="padding:10px 16px;background:var(--bg);font-size:11px;color:var(--t3);border-top:0.5px solid var(--bg)">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px"><span>Min. commande :</span><span style="color:var(--t2);font-weight:600">${p.minOrder}</span></div>
        <div style="line-height:1.4"><span>Conditions :</span> <span style="color:var(--t2)">${p.conditions}</span></div>
      </div>
      <div style="padding:10px 16px;display:flex;gap:6px;border-top:0.5px solid var(--bg)">
        <button onclick="window.open('tel:${p.phone.replace(/\s/g,'')}')" style="flex:1;padding:8px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;cursor:pointer;color:var(--t1)">📞 Appeler</button>
        ${p.email?`<button onclick="window.open('mailto:${p.email}')" style="flex:1;padding:8px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;cursor:pointer;color:var(--t1)">✉ Email</button>`:''}
        <button onclick="toast('Nouvelle commande ${p.name}')" style="flex:1;padding:8px;border:none;border-radius:8px;background:var(--t1);color:#fff;font-size:11px;font-weight:600;cursor:pointer">+ Commander</button>
      </div>
      <div style="padding:8px 16px;font-size:10px;color:var(--t4);border-top:0.5px solid var(--bg);display:flex;justify-content:space-between">
        <span>Dernière commande : <b style="color:var(--t3)">${p.lastOrder}</b></span>
        <span>${p.tags.map(t=>'<span style="padding:1px 7px;border-radius:10px;background:var(--bg2);margin-left:3px;font-size:9.5px">'+t+'</span>').join('')}</span>
      </div>
    `;
    return card;
  }

  rebuild();
}


