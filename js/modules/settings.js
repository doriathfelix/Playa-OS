// RÉGLAGES
// ══════════════════════════════════════════
function renderSettings(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2';
  c.appendChild(page);

  const hdr = document.createElement('div');
  hdr.style.cssText = 'margin-bottom:20px';
  hdr.innerHTML = `
    <div style="font-size:18px;font-weight:800;color:var(--t1);margin-bottom:2px">Réglages</div>
    <div style="font-size:12px;color:var(--t3)">Configuration · Comptes · Intégrations</div>
  `;
  page.appendChild(hdr);

  const g2 = document.createElement('div');
  g2.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:14px';
  page.appendChild(g2);

  // Intégrations
  const integ = document.createElement('div');
  integ.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';
  integ.innerHTML = `
    <div style="padding:14px 16px;border-bottom:0.5px solid var(--sep)">
      <div style="font-size:13px;font-weight:700;color:var(--t1)">Intégrations</div>
      <div style="font-size:11px;color:var(--t3);margin-top:2px">Services connectés à PlayaOS</div>
    </div>
    <div>
      ${[
        {n:'Zenchef', d:'Réservations en temps réel', s:'Connecté', stat:'ok', icon:'🗓'},
        {n:"L'Addition Suite", d:'Caisse & encaissements', s:'Connecté', stat:'ok', icon:'💳'},
        {n:'Metro France', d:'Commandes fournisseur', s:'Connecté', stat:'ok', icon:'📦'},
        {n:"Marché d'Arles", d:'Produits frais', s:'Manuel', stat:'warn', icon:'🥬'},
        {n:'Mailchimp', d:'Newsletter clients', s:'Non connecté', stat:'off', icon:'✉️'},
        {n:'Google Business', d:'Avis & fiche établissement', s:'Non connecté', stat:'off', icon:'⭐'}
      ].map(x => {
        const col = x.stat==='ok'?'var(--gt)':x.stat==='warn'?'var(--ot)':'var(--t4)';
        const bg = x.stat==='ok'?'var(--gbg)':x.stat==='warn'?'var(--obg)':'var(--bg)';
        return `
          <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;border-bottom:0.5px solid var(--bg)">
            <div style="width:36px;height:36px;border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${x.icon}</div>
            <div style="flex:1">
              <div style="font-size:12.5px;font-weight:600;color:var(--t1)">${x.n}</div>
              <div style="font-size:10.5px;color:var(--t3);margin-top:1px">${x.d}</div>
            </div>
            <span style="font-size:10px;font-weight:700;color:${col};background:${bg};padding:4px 10px;border-radius:20px">${x.s}</span>
            <button style="border:1px solid var(--sep);background:var(--card);padding:6px 10px;border-radius:8px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">${x.stat==='off'?'Connecter':'Gérer'}</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
  g2.appendChild(integ);

  // Établissement
  const estab = document.createElement('div');
  estab.style.cssText = 'display:flex;flex-direction:column;gap:14px';

  const info = document.createElement('div');
  info.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;padding:16px';
  info.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:14px">Établissement</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${[
        ['Nom', 'La Playa en Camargue'],
        ['Adresse', '4 avenue de la Mer, 13460 Saintes-Maries-de-la-Mer'],
        ['Type', 'Restaurant de plage · Bistrot méditerranéen'],
        ['Couverts max', '98 (intérieur + terrasse + bar)'],
        ['Transats', '110 (5 rangées × blocs G/M/D)'],
        ['Saison d\'ouverture', '1er avril → 31 octobre'],
        ['Services', 'S1 · 12h · S2 · 14h15 · Transats journée · Soir 19h30']
      ].map(([k,v]) => `
        <div style="display:grid;grid-template-columns:140px 1fr;gap:12px;align-items:center;font-size:12px;padding-bottom:8px;border-bottom:0.5px solid var(--bg)">
          <span style="color:var(--t3);font-weight:500">${k}</span>
          <span style="color:var(--t1);font-weight:600">${v}</span>
        </div>
      `).join('')}
    </div>
  `;
  estab.appendChild(info);

  // Préférences UX
  const prefs = document.createElement('div');
  prefs.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;padding:16px';
  prefs.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:14px">Préférences d'affichage</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${[
        ['Thème', 'Clair sable (par défaut)'],
        ['Taille police', 'Medium'],
        ['Langue', 'Français'],
        ['Fuseau horaire', 'Europe/Paris'],
        ['Format date', '17 avr. 2026']
      ].map(([k,v]) => `
        <div style="display:grid;grid-template-columns:140px 1fr 80px;gap:12px;align-items:center;font-size:12px;padding:6px 0">
          <span style="color:var(--t3);font-weight:500">${k}</span>
          <span style="color:var(--t1);font-weight:600">${v}</span>
          <button style="border:1px solid var(--sep);background:var(--card);padding:5px 10px;border-radius:7px;font-size:10.5px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">Modifier</button>
        </div>
      `).join('')}
    </div>
  `;
  estab.appendChild(prefs);

  g2.appendChild(estab);
}
