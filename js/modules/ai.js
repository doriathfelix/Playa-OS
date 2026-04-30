// ══════════════════════════════════════════
// PLAYA AI
// ══════════════════════════════════════════
function renderAIModule(c){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;display:flex;overflow:hidden';
  c.appendChild(page);

  // Chat principal
  const chat = document.createElement('div');
  chat.style.cssText = 'flex:1;display:flex;flex-direction:column;background:#F5F5F2';

  // Header
  const chdr = document.createElement('div');
  chdr.style.cssText = 'padding:16px 22px;background:var(--card);border-bottom:0.5px solid var(--sep);display:flex;align-items:center;gap:12px;flex-shrink:0';
  chdr.innerHTML = `
    <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#5B21B6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:700">✦</div>
    <div style="flex:1">
      <div style="font-size:14px;font-weight:700;color:var(--t1)">Playa AI</div>
      <div style="font-size:11px;color:var(--t3);display:flex;align-items:center;gap:6px"><span style="width:6px;height:6px;border-radius:50%;background:var(--green)"></span> Connecté · Sync Zenchef + L'Addition</div>
    </div>
    <button style="padding:8px 14px;border-radius:20px;border:1px solid var(--sep);background:var(--card);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2)">⟲ Nouvelle session</button>
  `;
  chat.appendChild(chdr);

  // Messages
  const msgs = document.createElement('div');
  msgs.style.cssText = 'flex:1;overflow-y:auto;padding:22px 22px 16px;display:flex;flex-direction:column;gap:14px';

  function bub(who, html){
    const b = document.createElement('div');
    if(who === 'ai'){
      b.style.cssText = 'max-width:640px;align-self:flex-start';
      b.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:10px">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#7C3AED,#5B21B6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">✦</div>
          <div style="background:var(--card);border:0.5px solid var(--sep);border-radius:4px 14px 14px 14px;padding:12px 16px;font-size:13px;color:var(--t1);line-height:1.55">${html}</div>
        </div>
      `;
    } else {
      b.style.cssText = 'max-width:520px;align-self:flex-end';
      b.innerHTML = `<div style="background:var(--t1);color:#fff;border-radius:14px 4px 14px 14px;padding:10px 16px;font-size:13px;line-height:1.4">${html}</div>`;
    }
    msgs.appendChild(b);
  }

  function chips(items){
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-left:38px;max-width:640px';
    items.forEach(([label, onclick]) => {
      const c = document.createElement('button');
      c.style.cssText = 'padding:8px 14px;border-radius:20px;border:1px solid var(--sep);background:var(--card);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--t2);transition:all .15s';
      c.onmouseenter = () => { c.style.background = 'var(--bg)'; c.style.borderColor = 'var(--t3)'; };
      c.onmouseleave = () => { c.style.background = 'var(--card)'; c.style.borderColor = 'var(--sep)'; };
      c.textContent = label;
      c.onclick = onclick;
      row.appendChild(c);
    });
    msgs.appendChild(row);
  }

  const nonPlaces = Object.values(reservations).flat().filter(r=>!r.placed&&!r.ns).length;
  const total = Object.values(reservations).flat().filter(r=>!r.ns).length;

  bub('ai', `<div style="font-size:12px;color:var(--t3);margin-bottom:6px">10:42 · Résumé du jour</div>
    <div style="font-weight:700;font-size:14px;margin-bottom:8px">Bonjour Antoine 👋</div>
    <div style="margin-bottom:10px">Voici ce qui t'attend aujourd'hui :</div>
    <div style="display:flex;flex-direction:column;gap:5px;font-size:12.5px">
      <div>📋 <b>${total} réservations</b> — dont ${nonPlaces} non placées</div>
      <div>☀️ <b>28°C ensoleillé</b> — fort impact sur les transats (prévoir +30% de couverts bar)</div>
      <div>⚠️ <b>2 alertes stocks critiques</b> : citrons et huile d'olive</div>
      <div>👥 <b>7/9 présents</b> — Paul absent, je recommande de demander à Clara de prendre son service</div>
    </div>`);

  chips([
    ['▶ Auto-placer les resas', () => {
      bub('user', 'Auto-placer les resas');
      setTimeout(() => bub('ai', `J'ai analysé les ${nonPlaces} réservations non placées et optimisé le plan :<br><br>• <b>Gros groupes au centre</b> (rangées 200-300)<br>• <b>Couples en périphérie</b> (rangées 100 & 500)<br>• <b>Zéro slot isolé</b><br><br>Rendez-vous dans le module <b>Service → Transats</b> pour visualiser.`), 600);
    }],
    ['📦 Commander les stocks critiques', () => {
      bub('user', 'Commander les stocks critiques');
      setTimeout(() => bub('ai', `Bon de commande généré :<br><br>• <b>Citrons 4 kg</b> — Marché d'Arles (18€)<br>• <b>Huile d'olive 3L</b> — Metro (42€)<br>• <b>Taureau AOP 6kg</b> — Aubanel (165€)<br><br>Total : <b>225€</b>. Livraison demain 8h. Je confirme l'envoi ?`), 800);
    }],
    ['📊 Prévoir samedi', () => {
      bub('user', 'Prévoir samedi');
      setTimeout(() => bub('ai', `Samedi 19 avril — prévisions :<br><br>🌡 <b>27°C ensoleillé</b><br>👥 Base historique : <b>~195 couverts</b> attendus<br>⛱ <b>~85 transats</b> occupés (77%)<br><br>Recommandations :<br>• <b>+1 serveur</b> en renfort pour midi (demander à Tom ?)<br>• <b>Commander</b> +3kg tellines (vente +40% en journée chaude)<br>• <b>Bloquer</b> rangée 500 pour les walk-ins`), 900);
    }],
    ['🍽 Suggestion menu', () => {
      bub('user', 'Suggestion menu du jour');
      setTimeout(() => bub('ai', `Suggestion <b>plat du jour</b> basée sur stock & météo :<br><br>🐟 <b>Tellines à la persillade</b> — stock OK, ventes +40% chaleur<br>🍷 <b>Accord</b> : Rosé des Sables 14° (14 btl en stock)<br>💰 <b>Prix conseillé</b> : 18€ · marge 68%<br><br>Je peux préparer la fiche pour l'afficher ?`), 900);
    }]
  ]);

  chat.appendChild(msgs);

  // Input
  const inpWrap = document.createElement('div');
  inpWrap.style.cssText = 'padding:16px 22px;background:var(--card);border-top:0.5px solid var(--sep);flex-shrink:0';
  inpWrap.innerHTML = `
    <div style="display:flex;gap:10px;align-items:center;background:var(--bg);border:1px solid var(--sep);border-radius:14px;padding:4px 4px 4px 16px">
      <input id="ai-input-field" placeholder="Pose une question ou donne un ordre — ex: 'Fais un bilan de samedi'" style="flex:1;border:none;background:none;outline:none;font-size:13px;font-family:inherit;color:var(--t1);padding:10px 0">
      <button onclick="(function(){const i=document.getElementById('ai-input-field');if(!i.value.trim())return;toast('Message envoyé à Playa AI');i.value='';})()" style="padding:10px 18px;border:none;background:var(--t1);color:#fff;font-size:12px;font-weight:600;border-radius:10px;cursor:pointer;font-family:inherit">Envoyer ↑</button>
    </div>
    <div style="font-size:10px;color:var(--t4);margin-top:6px;text-align:center">Playa AI peut faire des erreurs — vérifiez les infos importantes avant d'agir.</div>
  `;
  chat.appendChild(inpWrap);

  page.appendChild(chat);

  // Sidebar : suggestions contextuelles
  const side = document.createElement('div');
  side.style.cssText = 'width:280px;background:var(--card);border-left:0.5px solid var(--sep);padding:18px 16px;overflow-y:auto;flex-shrink:0';

  side.innerHTML = `
    <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">Actions suggérées</div>
    ${[
      {cat:'SERVICE', col:'#1A7A3E', t:'Auto-placer les resas', s:nonPlaces+' non placées'},
      {cat:'STOCKS', col:'#DC2626', t:'Commander citrons + huile', s:'2 critiques · 60€'},
      {cat:'ÉQUIPE', col:'#D97706', t:'Renfort samedi midi', s:'200 couverts attendus'},
      {cat:'ANALYSE', col:'#7C3AED', t:'Rapport semaine 15', s:'Auto-généré · prêt'},
      {cat:'MENU', col:'#0284C7', t:'Plat du jour · tellines', s:'Accord Rosé des Sables'}
    ].map(x => `
      <div style="background:var(--bg);border:0.5px solid var(--sep);border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer;transition:all .15s" onmouseenter="this.style.background='var(--card)';this.style.borderColor='var(--t3)'" onmouseleave="this.style.background='var(--bg)';this.style.borderColor='var(--sep)'">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
          <div style="width:4px;height:4px;border-radius:50%;background:${x.col}"></div>
          <div style="font-size:9px;font-weight:700;color:${x.col};text-transform:uppercase;letter-spacing:.09em">${x.cat}</div>
        </div>
        <div style="font-size:12.5px;font-weight:600;color:var(--t1);line-height:1.35">${x.t}</div>
        <div style="font-size:10.5px;color:var(--t3);margin-top:3px">${x.s}</div>
      </div>
    `).join('')}

    <div style="margin-top:18px;padding:14px;background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:0.5px solid var(--pbd);border-radius:12px">
      <div style="font-size:10px;font-weight:700;color:var(--pt);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">⚡ Prévision</div>
      <div style="font-size:12px;font-weight:700;color:var(--pt);line-height:1.4">Weekend chargé</div>
      <div style="font-size:10.5px;color:var(--pt);opacity:.85;margin-top:4px;line-height:1.5">Samedi : 195 couverts · 85 transats<br>Dimanche : 140 couverts · 62 transats</div>
    </div>
  `;

  page.appendChild(side);
}



