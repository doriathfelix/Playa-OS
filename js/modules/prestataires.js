// ══════════════════════════════════════════
// PRESTATAIRES — Fournisseurs & Contacts
// ══════════════════════════════════════════
function renderPrestataires(c){
  let currentTab = 'all';

  const prestas = [
    // ── FRUITS & LÉGUMES ──────────────────────────────────────────────
    {id:1, cat:'fruits', name:'Salade de Fruits', phones:[{label:'Jeremy', num:'0658789642'}],
     delivery:'Tous les jours', tags:['Fruits','Légumes','Viandes']},
    {id:2, cat:'fruits', name:'Aux Compères', phones:[{label:'Petit Jo', num:'0490433274'}],
     delivery:'Tous les jours sauf jeudi', tags:['Fruits','Légumes']},
    {id:3, cat:'fruits', name:'Terre Azur', phones:[{label:'Virginie', num:'0618036701'}],
     delivery:'Mar · Jeu · Sam', tags:['Fruits','Légumes','Poissons']},
    {id:4, cat:'fruits', name:'Metro Légumes', phones:[{label:'Pascal / Commercial', num:'0466386609'}],
     delivery:'Lun–Sam (retrait, pas de livraison)', tags:['Légumes','Metro']},

    // ── ÉPICERIE & CRÈMERIE ───────────────────────────────────────────
    {id:5, cat:'epicerie', name:'Epi Saveurs', phones:[{label:'Nadia', num:'0784460549'}],
     delivery:'Mercredi', tags:['Épicerie']},
    {id:6, cat:'epicerie', name:'Passion Froid', phones:[{label:'Mathis', num:'0613242835'}],
     delivery:'3×/sem (à confirmer)', tags:['Épicerie']},
    {id:7, cat:'epicerie', name:'Metro', phones:[{label:'Épicerie', num:'0466386620'},{label:'Crèmerie', num:'0466386611'}],
     delivery:'Sur commande', tags:['Épicerie','Crèmerie','Metro']},
    {id:8, cat:'epicerie', name:'Sysco', phones:[{label:'Jessica', num:'0617164961'},{label:'Cathy', num:'0442775574'}],
     delivery:'Mar · Jeu · Sam (juil–août)', tags:['Épicerie','Crèmerie']},
    {id:9, cat:'epicerie', name:'SAF', phones:[{label:'Marc', num:'0609527700'}],
     delivery:'Tous les jours', tags:['Épicerie','Crèmerie']},

    // ── POISSONS ──────────────────────────────────────────────────────
    {id:10, cat:'poissons', name:'Metro Marée', phones:[{label:'Accueil', num:'0466386624'}],
     delivery:'Sur commande', tags:['Poissons','Metro']},
    {id:11, cat:'poissons', name:'Terre Azur', phones:[{label:'Virginie', num:'0618036701'},{label:'Commandes', num:'0442109584'}],
     delivery:'Mar · Jeu · Sam', tags:['Poissons']},
    {id:12, cat:'poissons', name:'Sud Pêcherie', phones:[{label:'David', num:'0766033428'},{label:'Armand', num:'0609912400'}],
     delivery:'À confirmer', tags:['Poissons']},
    {id:13, cat:'poissons', name:'Beuron', phones:[{label:'Vincent / Amandine', num:'0764240560'}],
     delivery:'À confirmer', tags:['Poissons']},
    {id:14, cat:'poissons', name:'Meric', phones:[{label:'Serge', num:'0607560690'}],
     delivery:'À confirmer', tags:['Poissons']},
    {id:15, cat:'poissons', name:'Le Jean Folco 2', phones:[{label:'Andre', num:'0664529208'}],
     delivery:'Sur arrivage', tags:['Poissons','Thon Rouge'], note:'Thon rouge uniquement'},

    // ── VIANDES ───────────────────────────────────────────────────────
    {id:16, cat:'viandes', name:'Salade de Fruits', phones:[{label:'Jeremy', num:'0667123513'},{label:'Stephane', num:'0616392509'}],
     delivery:'Tous les jours', tags:['Viandes']},
    {id:17, cat:'viandes', name:'Alazard et Roux', phones:[{label:'Delphine', num:'0490915509'},{label:'Mobile', num:'0687093362'}],
     delivery:'À confirmer', tags:['Viandes']},
    {id:18, cat:'viandes', name:'Espace Jabugo', phones:[{label:'Jeremy', num:'0658789642'}],
     delivery:'À confirmer', tags:['Viandes','Charcuterie']},

    // ── DESSERTS, GLACES & PAINS ──────────────────────────────────────
    {id:19, cat:'desserts', name:'Pom Frites', phones:[{label:'Christian', num:'0785570408'}],
     delivery:'À confirmer', tags:['Frites','PDT']},
    {id:20, cat:'desserts', name:'Compagnie des Desserts', phones:[{label:'Thomas', num:'0615709377'}],
     delivery:'À confirmer', tags:['Desserts','Glaces','Pains']},
    {id:21, cat:'desserts', name:'Miko', phones:[{label:'Stephane', num:'0616732531'}],
     delivery:'À confirmer', tags:['Glaces','Bâtonnets']},

    // ── DÉPANNAGE ─────────────────────────────────────────────────────
    {id:22, cat:'depannage', name:'Sur les Saintes', phones:[{label:'Momo', num:'0616570593'}],
     delivery:'', tags:['Dépannage']},
    {id:23, cat:'depannage', name:'Speed Froid', phones:[{label:'Fabrice Manzano', num:'0650242154'}],
     delivery:'', tags:['Froid','Dépannage']},
    {id:24, cat:'depannage', name:'Rage · Unox / Piano / Friteuses', phones:[{label:'Jean-Régis Bonnafoux', num:'0467500180'},{label:'Mika', num:'0686468905'}],
     delivery:'', tags:['Matériel','Dépannage']},
    {id:25, cat:'depannage', name:'Metro CHR', phones:[{label:'CHR', num:'0466386612'}],
     delivery:'', tags:['CHR','Metro','Dépannage']},
    {id:26, cat:'depannage', name:'Lambertin-Tourelle', phones:[{label:'Christophe', num:'0689930949'},{label:'Seb', num:'0622752572'}],
     delivery:'', tags:['Matériel','Dépannage']}
  ];

  const catMeta = {
    fruits:   {label:'🍅 Fruits & Légumes', col:'#16A34A', icon:'🍅'},
    epicerie: {label:'🧂 Épicerie & Crèmerie', col:'#D97706', icon:'🧂'},
    poissons: {label:'🐟 Poissons', col:'#0284C7', icon:'🐟'},
    viandes:  {label:'🥩 Viandes', col:'#DC2626', icon:'🥩'},
    desserts: {label:'🍦 Desserts & Glaces', col:'#DB2777', icon:'🍦'},
    depannage:{label:'🔧 Dépannage', col:'#7C3AED', icon:'🔧'}
  };

  const body = makePageShell(c, 'Fournisseurs & Contacts',
    prestas.length + ' contacts · Livraisons & dépannage',
    [{label:'📞 Appel urgent', onclick:"toast('Utilise les fiches ci-dessous')"}]);

  function fmtPhone(raw){
    const d = raw.replace(/\D/g,'');
    if(d.length === 10) return d.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,'$1 $2 $3 $4 $5');
    return raw;
  }

  function makePrestaCard(p){
    const m = catMeta[p.cat];
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card);border:1px solid var(--sep);border-radius:14px;overflow:hidden;transition:border-color .18s,box-shadow .18s';
    card.onmouseenter = () => { card.style.borderColor = m.col+'88'; card.style.boxShadow = '0 4px 16px rgba(24,20,10,.07)'; };
    card.onmouseleave = () => { card.style.borderColor = 'var(--sep)'; card.style.boxShadow = ''; };

    const phonesHtml = p.phones.map(ph => `
      <div style="display:flex;align-items:center;gap:8px;padding:4px 0">
        <span style="font-size:11px;color:var(--t4);min-width:90px;flex-shrink:0">${ph.label}</span>
        <a href="tel:${ph.num}" style="font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:${m.col};text-decoration:none;letter-spacing:.3px">${fmtPhone(ph.num)}</a>
        <a href="tel:${ph.num}" style="margin-left:auto;padding:3px 10px;border:1px solid ${m.col}40;border-radius:6px;background:${m.col}10;color:${m.col};font-size:10px;font-weight:700;text-decoration:none;white-space:nowrap">📞 Appeler</a>
      </div>`).join('');

    const delivHtml = p.delivery ? `
      <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-top:.5px solid var(--bg);margin-top:2px">
        <span style="font-size:12px">🚚</span>
        <span style="font-size:11.5px;color:var(--t2)">${p.delivery}</span>
      </div>` : '';

    const noteHtml = p.note ? `
      <div style="font-size:10.5px;color:var(--t3);padding:4px 8px;background:var(--bg2);border-radius:6px;margin-top:4px">${p.note}</div>` : '';

    const tagsHtml = p.tags.map(t =>
      `<span style="padding:2px 8px;border-radius:10px;background:${m.col}12;color:${m.col};font-size:10px;font-weight:600">${t}</span>`
    ).join('');

    card.innerHTML = `
      <div style="padding:12px 14px 10px;border-bottom:.5px solid var(--bg);display:flex;align-items:center;gap:10px">
        <div style="width:38px;height:38px;border-radius:10px;background:${m.col}15;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0">${m.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:800;color:var(--t1);line-height:1.2">${p.name}</div>
          <div style="font-size:10px;color:var(--t4);margin-top:1px">${m.label.replace(/^[^ ]+ /,'')}</div>
        </div>
      </div>
      <div style="padding:10px 14px">
        ${phonesHtml}
        ${delivHtml}
        ${noteHtml}
      </div>
      <div style="padding:8px 14px;border-top:.5px solid var(--bg);display:flex;flex-wrap:wrap;gap:4px">
        ${tagsHtml}
      </div>
    `;
    return card;
  }

  function rebuild(){
    body.innerHTML = '';
    body.appendChild(makeKPIRow([
      {l:'Contacts', v:prestas.length, s:'Fournisseurs actifs', col:'#2563EB'},
      {l:'Fruits & Légumes', v:prestas.filter(p=>p.cat==='fruits').length, s:'dont Metro', col:'#16A34A'},
      {l:'Poissons', v:prestas.filter(p=>p.cat==='poissons').length, s:'dont Thon Rouge', col:'#0284C7'},
      {l:'Dépannage', v:prestas.filter(p=>p.cat==='depannage').length, s:'urgence & matériel', col:'#7C3AED'}
    ]));

    const tabs = [
      {k:'all',      label:'Tous',              count:prestas.length},
      {k:'fruits',   label:'🍅 Fruits & Légumes', count:prestas.filter(p=>p.cat==='fruits').length},
      {k:'epicerie', label:'🧂 Épicerie',          count:prestas.filter(p=>p.cat==='epicerie').length},
      {k:'poissons', label:'🐟 Poissons',           count:prestas.filter(p=>p.cat==='poissons').length},
      {k:'viandes',  label:'🥩 Viandes',            count:prestas.filter(p=>p.cat==='viandes').length},
      {k:'desserts', label:'🍦 Desserts & Glaces',  count:prestas.filter(p=>p.cat==='desserts').length},
      {k:'depannage',label:'🔧 Dépannage',          count:prestas.filter(p=>p.cat==='depannage').length}
    ];

    body.appendChild(makeSubNav(tabs, currentTab, k => { currentTab = k; rebuild(); }));

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:10px';
    const list = currentTab === 'all' ? prestas : prestas.filter(p => p.cat === currentTab);
    list.forEach(p => grid.appendChild(makePrestaCard(p)));
    body.appendChild(grid);
  }

  rebuild();
}
