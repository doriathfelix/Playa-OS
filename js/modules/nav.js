// ══════════════════════════════════════════
// NAVIGATION OS — MODULES
// ══════════════════════════════════════════
let currentModule = 'service';

function goModule(mod){
  currentModule = mod;
  const isService = mod==='service';

  // Sidebar TOUJOURS visible
  const nav = document.getElementById('os-nav');
  nav.style.display='flex';
  nav.style.flexDirection='column';
  nav.style.alignItems='center';

  document.querySelectorAll('.osni').forEach(el=>el.classList.remove('on'));
  const an=document.getElementById('osni-'+mod);if(an)an.classList.add('on');

  // Topbar
  document.getElementById('service-tabs').style.display=isService?'flex':'none';
  document.getElementById('module-topbar-title').style.display=isService?'none':'block';
  document.getElementById('service-top-btns').style.display=isService?'flex':'none';
  const titles={dash:'Accueil',equipe:'Équipe & RH',stocks:'Stocks & Commandes',analyse:'Analyse',caisse:'Caisse · L\'Addition',admin:'Admin & Finances',resas:'Réservations',settings:'Réglages',ai:'Playa AI',cuisine:'Cuisine',bar:'Bar',haccp:'HACCP & Hygiène',prestataires:'Prestataires & Fournisseurs',event:'Événementiel & Privatisations',urgences:'Urgences & Sécurité'};
  if(!isService) document.getElementById('module-topbar-title').textContent=titles[mod]||mod;

  document.getElementById('app').style.display=isService?'flex':'none';
  const mc=document.getElementById('module-container');
  mc.style.display=isService?'none':'flex';
  mc.style.flex='1';mc.style.flexDirection='column';mc.style.overflow='hidden';mc.style.minWidth='0';
  if(!isService){
    mc.innerHTML='';
    if(mod==='dash') renderDash(mc);
    else if(mod==='equipe') renderEquipeRH(mc);
    else if(mod==='stocks') renderStocks(mc);
    else if(mod==='analyse') renderAnalyse(mc);
    else if(mod==='admin') renderAnalyse(mc);
    else if(mod==='caisse') renderCaisse(mc);
    else if(mod==='resas') renderResasModule(mc);
    else if(mod==='settings') renderSettings(mc);
    else if(mod==='ai') renderAIModule(mc);
    else if(mod==='cuisine') renderCuisine(mc);
    else if(mod==='bar') renderBar(mc);
    else if(mod==='haccp') renderHACCP(mc);
    else if(mod==='prestataires') renderPrestataires(mc);
    else if(mod==='event') renderEvent(mc);
    else if(mod==='urgences') renderUrgences(mc);
  }
}

const _logoEl = document.querySelector('.logo');
if(_logoEl){ _logoEl.style.cursor='pointer'; _logoEl.addEventListener('click',()=>goModule('dash')); }

function makeDashCard(title){
  const card=document.createElement('div');card.className='dash-card';
  card.innerHTML=`<div class="dash-card-head"><div class="dash-card-title">${title}</div></div><div class="dash-card-body"></div>`;
  return card;
}

// ── DASHBOARD — cartes avec traits colorés
function renderDash(c){
  const allResas = [...reservations.s1,...reservations.s2,...reservations.soir,...reservations.transats];
  const paxS1 = allResas.filter(x=>x.svc==='s1'&&!x.ns&&!x.repas_transat).reduce((s,x)=>s+x.pax,0);
  const paxS2 = allResas.filter(x=>x.svc==='s2'&&!x.ns&&!x.repas_transat).reduce((s,x)=>s+x.pax,0);
  const paxSoir = allResas.filter(x=>x.svc==='soir'&&!x.ns&&!x.repas_transat).reduce((s,x)=>s+x.pax,0);
  const trTotal = allResas.filter(x=>!x.ns).reduce((s,x)=>s+(x.tr||0),0);
  const nonPlaces = allResas.filter(x=>!x.placed&&!x.ns&&!x.waiting).length;

  const page = document.createElement('div');
  page.style.cssText='flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2;display:flex;flex-direction:column;gap:0';
  c.appendChild(page);

  // Greeting
  const days=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const months=['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
  const d=new Date(currentDate+'T12:00:00');
  const greet=document.createElement('div');
  greet.style.cssText='margin-bottom:20px';
  greet.innerHTML=`
    <div style="font-size:18px;font-weight:800;color:#1C1C1E;margin-bottom:2px">Bonjour Antoine 👋</div>
    <div style="font-size:12px;color:#8E8E93">${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · La Playa en Camargue</div>
  `;
  page.appendChild(greet);

  // Helper : section
  function section(label, color){
    const s=document.createElement('div');
    s.style.cssText='margin-bottom:18px';
    const lbl=document.createElement('div');
    lbl.style.cssText=`font-size:9px;font-weight:700;color:#AEAEB2;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;padding-left:4px`;
    lbl.textContent=label;
    s.appendChild(lbl);
    return s;
  }

  // Helper : carte cliquable
  function card(title, sub, badge, badgeBg, badgeColor, borderColor, onClick){
    const c2=document.createElement('div');
    c2.style.cssText=`background:#fff;border:0.5px solid #E5E5E3;border-left:3px solid ${borderColor};border-radius:0 10px 10px 0;padding:12px 14px;cursor:pointer;transition:box-shadow .15s`;
    c2.onmouseenter=()=>c2.style.boxShadow='0 4px 14px rgba(0,0,0,.08)';
    c2.onmouseleave=()=>c2.style.boxShadow='none';
    c2.ontouchstart=()=>c2.style.boxShadow='0 4px 14px rgba(0,0,0,.08)';
    c2.innerHTML=`
      <div style="font-size:13px;font-weight:700;color:#1C1C1E">${title}</div>
      <div style="font-size:10px;color:#8E8E93;margin-top:2px">${sub}</div>
      <div style="font-size:11px;font-weight:700;color:${badgeColor};margin-top:8px;background:${badgeBg};border-radius:6px;padding:3px 8px;display:inline-block">${badge}</div>
    `;
    if(onClick) c2.addEventListener('click', onClick);
    return c2;
  }

  // ── SERVICE
  const sService=section('Service');
  const gService=document.createElement('div');
  gService.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px';
  gService.appendChild(card('Plan de salle','S1 · S2 · Soir',paxS1+' PAX S1','#F0FBF3','#155724','#2D8A4A',()=>goModule('service')));
  gService.appendChild(card('Transats',trTotal+' réservés',''+trTotal+' / 110','#EEF8FF','#075985','#0EA5E9',()=>{goModule('service');setTimeout(()=>switchTab(2),300);}));
  gService.appendChild(card('Soir',paxSoir+' PAX réservés',paxSoir+' PAX','#F3EEFF','#4C1D95','#8B5CF6',()=>{goModule('service');setTimeout(()=>switchTab(3),300);}));
  sService.appendChild(gService);
  page.appendChild(sService);

  // ── RÉSERVATIONS
  const sResas=section('Réservations');
  const gResas=document.createElement('div');
  gResas.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px';
  gResas.appendChild(card("Aujourd'hui",currentDate,(allResas.filter(x=>!x.ns).length)+' resas','#EEF5FF','#003E9C','#007AFF',()=>goModule('service')));
  gResas.appendChild(card("Liste d'attente",'Non confirmées',allResas.filter(x=>x.waiting).length+' en attente','#EEF5FF','#003E9C','#007AFF',()=>goModule('service')));
  gResas.appendChild(card('+ Nouvelle resa','Saisie manuelle','Ajouter →','#EEF5FF','#003E9C','#007AFF',()=>{goModule('service');setTimeout(openModal,300);}));
  sResas.appendChild(gResas);
  page.appendChild(sResas);

  // ── ÉQUIPE + CAISSE (2 colonnes)
  const g2=document.createElement('div');
  g2.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px';

  const sEquipe=document.createElement('div');
  const lEquipe=document.createElement('div');
  lEquipe.style.cssText='font-size:9px;font-weight:700;color:#AEAEB2;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;padding-left:4px';
  lEquipe.textContent='Équipe';
  sEquipe.appendChild(lEquipe);
  const gEquipe=document.createElement('div');
  gEquipe.style.cssText='display:flex;flex-direction:column;gap:8px';
  gEquipe.appendChild(card('Planning','Semaine en cours','6 / 8 présents','#FFF8EC','#78350F','#D97706',()=>goModule('equipe')));
  gEquipe.appendChild(card('Coûts MO','Heures · Charges','142h semaine','#FFF8EC','#78350F','#D97706',()=>goModule('equipe')));
  sEquipe.appendChild(gEquipe);
  g2.appendChild(sEquipe);

  const sCaisse=document.createElement('div');
  const lCaisse=document.createElement('div');
  lCaisse.style.cssText='font-size:9px;font-weight:700;color:#AEAEB2;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;padding-left:4px';
  lCaisse.textContent='Caisse';
  sCaisse.appendChild(lCaisse);
  const gCaisse=document.createElement('div');
  gCaisse.style.cssText='display:flex;flex-direction:column;gap:8px';
  gCaisse.appendChild(card('Service du jour',"L'Addition · En cours",'823 € · 23 cvts','#FFF8EC','#7A4800','#FF9500',()=>goModule('analyse')));
  gCaisse.appendChild(card('Mouvements','Entrées · Sorties','Historique →','#FFF8EC','#7A4800','#FF9500',()=>goModule('analyse')));
  sCaisse.appendChild(gCaisse);
  g2.appendChild(sCaisse);
  page.appendChild(g2);

  // ── STOCKS + ANALYSE (2 colonnes)
  const g3=document.createElement('div');
  g3.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:16px';

  const sStocks=document.createElement('div');
  const lStocks=document.createElement('div');
  lStocks.style.cssText='font-size:9px;font-weight:700;color:#AEAEB2;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;padding-left:4px';
  lStocks.textContent='Stocks';
  sStocks.appendChild(lStocks);
  const gStocks=document.createElement('div');
  gStocks.style.cssText='display:flex;flex-direction:column;gap:8px';
  gStocks.appendChild(card('Inventaire','24 articles suivis','⚠ 2 ruptures','#FFF4F4','#B02020','#FF3B30',()=>goModule('stocks')));
  gStocks.appendChild(card('Commandes','Fournisseurs','3 à commander','#FFF4F4','#B02020','#FF3B30',()=>goModule('stocks')));
  sStocks.appendChild(gStocks);
  g3.appendChild(sStocks);

  const sAnalyse=document.createElement('div');
  const lAnalyse=document.createElement('div');
  lAnalyse.style.cssText='font-size:9px;font-weight:700;color:#AEAEB2;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;padding-left:4px';
  lAnalyse.textContent='Analyse';
  sAnalyse.appendChild(lAnalyse);
  const gAnalyse=document.createElement('div');
  gAnalyse.style.cssText='display:flex;flex-direction:column;gap:8px';
  gAnalyse.appendChild(card('CA & Stats','Chiffres du mois','38 400 € ↑ +12%','#F3EEFF','#4C1D95','#8B5CF6',()=>goModule('analyse')));
  gAnalyse.appendChild(card('Historique','Services précédents','Voir →','#F3EEFF','#4C1D95','#8B5CF6',()=>goModule('analyse')));
  sAnalyse.appendChild(gAnalyse);
  g3.appendChild(sAnalyse);
  page.appendChild(g3);

  // fin renderDash
}

function renderEquipe(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2';
  c.appendChild(page);

  // Header section
  const hdr = document.createElement('div');
  hdr.style.cssText = 'margin-bottom:20px;display:flex;align-items:flex-end;justify-content:space-between';
  hdr.innerHTML = `
    <div>
      <div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:2px;letter-spacing:-.2px">Équipe</div>
      <div style="font-size:12px;color:var(--t3)">9 membres · Semaine du 17 avril 2026</div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="toast('Pointage ouvert — prochainement')" style="padding:9px 14px;border-radius:10px;border:1px solid var(--sep);background:var(--card);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--t2)">⏱ Pointage</button>
      <button onclick="toast('Planning modifié')" style="padding:9px 16px;border-radius:10px;border:none;background:var(--t1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">+ Shift</button>
    </div>
  `;
  page.appendChild(hdr);

  // KPIs ligne
  const kpi = document.createElement('div');
  kpi.style.cssText = 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:18px';
  [
    {l:"Présents aujourd'hui", v:'7/9', s:'Paul absent · Tom en retard', col:'#1A7A3E', bg:'#EDF7F1'},
    {l:'Heures semaine', v:'168h', s:'sur 180h planifiées · +3h sup', col:'#2563EB', bg:'#EFF6FF'},
    {l:'Coût main d\'œuvre', v:'2 450€', s:'13% du CA estimé', col:'#7C3AED', bg:'#F5F3FF'},
    {l:'Prochain service', v:'Soir · 19h30', s:'Chef Marco + 4 serveurs', col:'#D97706', bg:'#FFFBEB'}
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

  // Layout 2 colonnes : planning + alertes
  const g2 = document.createElement('div');
  g2.style.cssText = 'display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:14px';
  page.appendChild(g2);

  // ── Planning semaine
  const planning = document.createElement('div');
  planning.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  const plHead = document.createElement('div');
  plHead.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:0.5px solid var(--sep)';
  plHead.innerHTML = `
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Planning de la semaine</div>
      <div style="font-size:10px;color:var(--t3);margin-top:2px">M = Midi · S = Service complet · N = Soir · ABS = Absent</div>
    </div>
    <div style="display:flex;gap:6px">
      <button onclick="toast('Semaine précédente')" style="width:28px;height:28px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer;color:var(--t3)">‹</button>
      <button onclick="toast('Semaine suivante')" style="width:28px;height:28px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer;color:var(--t3)">›</button>
    </div>
  `;
  planning.appendChild(plHead);

  const plBody = document.createElement('div');
  plBody.style.cssText = 'padding:0';
  const tbl = document.createElement('table');
  tbl.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr style="border-bottom:0.5px solid var(--sep);background:var(--bg)">
    <th style="text-align:left;padding:10px 14px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Membre</th>
    ${['Lun 14','Mar 15','Mer 16','Jeu 17','Ven 18','Sam 19','Dim 20'].map(d=>`<th style="text-align:center;padding:10px 6px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.05em">${d}</th>`).join('')}
    <th style="text-align:right;padding:10px 14px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Total</th>
  </tr>`;
  tbl.appendChild(thead);

  const team = [
    {n:'Antoine Martin', role:'Manager', s:['M','M','S','S','M','M','OFF'], c:'#E89A3C'},
    {n:'Marco Giraldi', role:'Chef', s:['M','M','M','OFF','M','M','M'], c:'#DC2626'},
    {n:'Sophie Arnaud', role:'Bar · responsable', s:['S','S','M','S','S','S','M'], c:'#7C3AED'},
    {n:'Paul Béranger', role:'Serveur', s:['M','ABS','M','M','S','OFF','OFF'], c:'#2563EB'},
    {n:'Léa Castaing', role:'Serveuse', s:['S','M','S','OFF','S','M','S'], c:'#16A34A'},
    {n:'Romain Faure', role:'Plagiste', s:['M','S','M','S','M','S','OFF'], c:'#0284C7'},
    {n:'Clara Hubert', role:'Serveuse', s:['OFF','M','S','M','S','M','S'], c:'#D97706'},
    {n:'Nadia Bouzid', role:'Plongeuse', s:['M','M','M','S','S','S','M'], c:'#0891B2'},
    {n:'Tom Vidal', role:'Runner', s:['S','OFF','S','M','M','S','S'], c:'#9333EA'}
  ];

  team.forEach(m => {
    const totalH = m.s.filter(x=>x!=='OFF' && x!=='ABS').reduce((h,x)=> h + (x==='S'?9:x==='M'?5:x==='N'?5:0), 0);
    const tr = document.createElement('tr');
    tr.style.cssText = 'border-bottom:0.5px solid var(--sep)';
    tr.innerHTML = `
      <td style="padding:10px 14px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:50%;background:${m.c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${m.n.split(' ').map(x=>x[0]).join('').substring(0,2)}</div>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--t1)">${m.n}</div>
            <div style="font-size:10px;color:var(--t3)">${m.role}</div>
          </div>
        </div>
      </td>
      ${m.s.map(x => {
        const colors = {
          M:{bg:'#EDF7F1',c:'#1A7A3E'},
          S:{bg:'#EFF6FF',c:'#2563EB'},
          N:{bg:'#F5F3FF',c:'#7C3AED'},
          ABS:{bg:'#FEF2F2',c:'#DC2626'},
          OFF:{bg:'transparent',c:'var(--t5)'}
        };
        const co = colors[x];
        return `<td style="text-align:center;padding:8px 4px"><div style="display:inline-block;padding:4px 8px;border-radius:6px;background:${co.bg};color:${co.c};font-size:10px;font-weight:700;font-family:'DM Mono',monospace;min-width:34px">${x==='OFF'?'—':x}</div></td>`;
      }).join('')}
      <td style="text-align:right;padding:10px 14px;font-size:12px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">${totalH}h</td>
    `;
    tbl.appendChild(tr);
  });
  plBody.appendChild(tbl);
  planning.appendChild(plBody);
  g2.appendChild(planning);

  // ── Alertes / activité
  const side = document.createElement('div');
  side.style.cssText = 'display:flex;flex-direction:column;gap:10px';

  // Alertes card
  const alerts = document.createElement('div');
  alerts.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  alerts.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Alertes planning</div>
      <span style="font-size:10px;font-weight:700;color:var(--rt);background:var(--rbg);border-radius:20px;padding:3px 9px">3</span>
    </div>
    <div style="padding:6px 0">
      ${[
        {d:'#DC2626', t:'Paul absent · couverture soir requise', a:'Gérer'},
        {d:'#D97706', t:'Sophie 40h · heures sup à valider', a:'Valider'},
        {d:'#2563EB', t:'Samedi : +1 serveur conseillé (200 cvts)', a:'Planifier'}
      ].map(x => `
        <div style="padding:10px 16px;display:flex;align-items:center;gap:10px;border-bottom:0.5px solid var(--bg)">
          <div style="width:8px;height:8px;border-radius:50%;background:${x.d};flex-shrink:0"></div>
          <div style="flex:1;font-size:11.5px;color:var(--t2);line-height:1.35">${x.t}</div>
          <button style="border:none;background:none;color:var(--t1);font-size:11px;font-weight:600;cursor:pointer;padding:2px 4px">${x.a} →</button>
        </div>
      `).join('')}
    </div>
  `;
  side.appendChild(alerts);

  // Activité
  const activity = document.createElement('div');
  activity.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;padding:14px 16px';
  activity.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:10px">Activité récente</div>
    ${[
      {t:'10:42', txt:'<b>Sophie</b> a pris son shift', c:'#16A34A'},
      {t:'10:28', txt:'<b>Antoine</b> a modifié le planning samedi', c:'#2563EB'},
      {t:'09:15', txt:'<b>Paul</b> s\'est déclaré absent', c:'#DC2626'},
      {t:'08:30', txt:'<b>Chef Marco</b> a validé la commande Metro', c:'#D97706'}
    ].map(x => `
      <div style="display:flex;gap:10px;padding:6px 0;font-size:11.5px;color:var(--t2);line-height:1.4">
        <div style="font-size:10px;color:var(--t4);flex-shrink:0;font-family:'DM Mono',monospace;width:38px">${x.t}</div>
        <div style="flex:1">${x.txt}</div>
      </div>
    `).join('')}
  `;
  side.appendChild(activity);

  g2.appendChild(side);
}

