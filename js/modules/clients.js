// ══════════════════════════════════════════
// CLIENTS & FIDÉLITÉ — CRM La Playa
// ══════════════════════════════════════════

const CLIENT_NOTES_KEY = 'playa-client-notes-v1';

// ── Loyalty ────────────────────────────────────────────────────────────────
function clientLoyalty(n) {
  if (n >= 10) return {label:'VIP ⭐', level:'vip',     col:'#D97706', bg:'#FFFBEB'};
  if (n >= 7)  return {label:'Habitué ★', level:'habitue',col:'#7C3AED', bg:'#F5F3FF'};
  if (n >= 4)  return {label:'Fidèle',   level:'fidele', col:'#16A34A', bg:'#EDF7F1'};
  if (n >= 2)  return {label:'Régulier', level:'regulier',col:'#2563EB', bg:'#EFF6FF'};
  return              {label:'Nouveau',  level:'nouveau', col:'#6B7280', bg:'#F9FAFB'};
}

// ── Preference detection ───────────────────────────────────────────────────
function clientDetectPrefs(text) {
  const t = (text || '').toLowerCase();
  const prefs = [];
  const add = (cat, label, col) => { if (!prefs.find(p => p.label === label)) prefs.push({cat, label, col}); };

  // Placement table/zone
  if (/terrasse|playa|ext[eé]rieur|dehors|outside/.test(t))   add('place','Terrasse','#16A34A');
  if (/int[eé]rieur|inside/.test(t))                           add('place','Intérieur','#2563EB');
  if (/\bombre\b/.test(t))                                     add('place','Ombre','#7C3AED');
  if (/\bsoleil\b/.test(t))                                    add('place','Soleil','#D97706');
  if (/vue\s*mer|vue\s*plage|bord\s*de\s*mer/.test(t))        add('place','Vue mer','#0284C7');
  if (/coin|calme|tranquille|discr[eè]t/.test(t))              add('place','Coin calme','#6B7280');
  const tm = t.match(/\btable[s]?\s*n?[°º]?\s*(\d+)/);
  if (tm) add('place', 'Table '+tm[1], '#EA580C');

  // Transats
  if (/transat|sunbed|bain\s*de\s*soleil/.test(t))             add('transat','Transats','#0891B2');
  if (/premi[eè]re?\s*ligne|1[eè]re?\s*ligne|front\s*row/.test(t)) add('transat','1ère ligne','#0284C7');
  if (/bed\s*double|lit\s*double|double\s*bed|cabane/.test(t)) add('transat','Bed double','#0891B2');
  if (/extr[eé]mit[eé]|bout|coin\s*de\s*rang|end/.test(t))    add('transat','Bout de rang','#0284C7');

  // Dietary
  if (/v[eé]g[eé]tari/.test(t))                                add('diet','Végétarien','#16A34A');
  if (/\bvegan\b|v[eé]gane/.test(t))                           add('diet','Vegan','#16A34A');
  if (/sans\s*gluten|gluten.free|c[oé]liaque/.test(t))         add('diet','Sans gluten','#D97706');
  if (/allergi/.test(t))                                        add('diet','Allergie ⚠','#DC2626');
  if (/halal/.test(t))                                          add('diet','Halal','#16A34A');
  if (/lactose/.test(t))                                        add('diet','Sans lactose','#D97706');
  if (/chaise\s*haute|high.chair|b[eé]b[eé]|bb\b/.test(t))    add('habit','Chaise haute','#16A34A');

  // Occasions
  if (/anniversaire|birthday/.test(t))                          add('event','Anniversaire 🎂','#DB2777');
  if (/\bmariage\b|wedding/.test(t))                            add('event','Mariage 💍','#EC4899');
  if (/lune\s*de\s*miel|honeymoon/.test(t))                    add('event','Lune de miel','#EC4899');
  if (/fian[cç]/.test(t))                                       add('event','Fiançailles','#EC4899');
  if (/business|professionnel|r[eé]union\s*d/.test(t))          add('event','Repas pro','#64748B');
  if (/valentine|st.?valentin/.test(t))                         add('event','St-Valentin','#EC4899');

  // Special habits
  if (/\bpmr\b|fauteuil\s*roulant|handicap|wheelchair/.test(t)) add('habit','PMR ♿','#7C3AED');
  if (/\bchien\b|animaux\s*accept/.test(t))                     add('habit','Avec chien 🐕','#78350F');
  if (/repas\s*transat|manger\s*(sur|aux)\s*transat/.test(t))   add('habit','Repas-transat','#0891B2');

  return prefs;
}

// ── Welcome memo auto-generation ─────────────────────────────────────────
function clientMemoAuto(client) {
  const lines = [];
  const L = client.loyalty;
  if (L.level === 'vip' || L.level === 'habitue') lines.push(`${L.label} — ${client.visitCount} visites`);

  const placement = client.prefs.filter(p => p.cat === 'place').map(p => p.label);
  if (placement.length) lines.push('Préfère : ' + placement.join(', '));

  const diet = client.prefs.filter(p => p.cat === 'diet');
  if (diet.length) lines.push('⚠ ' + diet.map(p => p.label).join(' · '));

  const events = client.prefs.filter(p => p.cat === 'event');
  if (events.length) lines.push(events.map(p => p.label).join(', '));

  const habits = client.prefs.filter(p => p.cat === 'habit');
  if (habits.length) lines.push(habits.map(p => p.label).join(' · '));

  if (client.avgPax >= 2) lines.push(`Groupe moyen : ${Math.round(client.avgPax)} pers.`);

  return lines.join('\n');
}

// ── Data collection ────────────────────────────────────────────────────────
function clientsCollect() {
  const map = {};

  const capWord = w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';
  const extractName = b => {
    const f = (b.firstname||b.first_name||'').trim();
    const l = (b.lastname||b.last_name||'').trim();
    return [capWord(l), capWord(f)].filter(Boolean).join(' ') || null;
  };
  const extractComment = b => [
    b.comment, b.note, b.internal_note, b.customer_comment,
    b.customer?.wishes, b.customer?.remarks, b.customer?.preferences,
    b.customer?.allergy, b.customer?.dietary,
    ...(b.custom_field||[]).map(cf => cf?.answer)
  ].filter(Boolean).map(s => String(s).trim()).filter(Boolean).join(' · ');

  function upsert(name, phone, email, date, pax, comment, svc) {
    const key = name.toLowerCase().trim();
    if (!map[key]) map[key] = {name, normKey:key, phone:'', email:'', visits:[]};
    if (phone && !map[key].phone) map[key].phone = phone;
    if (email && !map[key].email) map[key].email = email;
    // deduplicate by date+svc
    if (!map[key].visits.find(v => v.date === date && v.svc === svc && v.pax === pax)) {
      map[key].visits.push({date, pax: pax||2, comment: comment||'', svc});
    }
  }

  // 1 — localStorage (raw Zenchef cache)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('playa_zc_')) continue;
    const date = key.replace('playa_zc_', '');
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      (stored?.data || []).forEach(b => {
        const name = extractName(b);
        if (!name) return;
        const phone = (b.phone || b.customer?.phone || '').trim();
        const email = (b.email || b.customer?.email || '').trim();
        const pax   = b.num_pers || b.nb_people || b.pax || 2;
        upsert(name, phone, email, date, pax, extractComment(b), null);
      });
    } catch(e) {}
  }

  // 2 — In-memory processed reservations
  const today = (typeof currentDate !== 'undefined' ? currentDate : null) ||
                new Date().toISOString().split('T')[0];
  ['s1','s2','soir','transats'].forEach(svc => {
    ((typeof reservations !== 'undefined' ? reservations[svc] : null) || []).forEach(r => {
      if (!r.name || r.name === 'Sans nom') return;
      upsert(r.name, r.phone||'', r.email||'', today, r.pax||2, r.comment||'', svc);
    });
  });

  // 3 — Compute aggregates
  const notes = (() => { try { return JSON.parse(localStorage.getItem(CLIENT_NOTES_KEY)||'{}'); } catch(e){ return {}; } })();
  const result = [];
  Object.values(map).forEach(c => {
    if (c.visits.length === 0) return;
    c.visits.sort((a,b) => a.date > b.date ? -1 : 1); // newest first
    c.visitCount = c.visits.length;
    c.lastVisit  = c.visits[0].date;
    c.avgPax     = c.visits.reduce((s,v) => s + (v.pax||2), 0) / c.visits.length;
    const allText = c.visits.map(v => v.comment).join(' ');
    c.prefs    = clientDetectPrefs(allText);
    c.loyalty  = clientLoyalty(c.visitCount);
    c.memoAuto = clientMemoAuto(c);
    c.memoUser = notes[c.normKey] || '';
    result.push(c);
  });
  result.sort((a,b) => b.visitCount - a.visitCount || b.lastVisit.localeCompare(a.lastVisit));
  return result;
}

// ── Client preferences cache (used by placement.js) ───────────────────────
let _clientPrefsCache = null;

function buildClientPrefsCache() {
  const clients = clientsCollect();
  const cache = {};
  clients.forEach(c => {
    const p = c.prefs;
    const tMatch = p.find(x => /^Table \d+$/.test(x.label));
    cache[c.normKey] = {
      tableId:      tMatch ? parseInt(tMatch.label.split(' ')[1]) : null,
      wantTerrasse: !!p.find(x => x.label === 'Terrasse'),
      wantInterieur:!!p.find(x => x.label === 'Intérieur'),
      wantOmbre:    !!p.find(x => x.label === 'Ombre'),
      wantSoleil:   !!p.find(x => x.label === 'Soleil'),
      bedDouble:    !!p.find(x => x.label === 'Bed double'),
      firstRow:     !!p.find(x => x.label === '1ère ligne'),
      extremite:    !!p.find(x => x.label === 'Bout de rang')
    };
  });
  try { localStorage.setItem('playa-client-prefs-cache', JSON.stringify(cache)); } catch(e) {}
  _clientPrefsCache = cache;
  return cache;
}

function getClientHistPrefs(name) {
  if (!name || name === 'Sans nom') return null;
  if (!_clientPrefsCache) {
    try {
      const s = localStorage.getItem('playa-client-prefs-cache');
      _clientPrefsCache = s ? JSON.parse(s) : {};
    } catch(e) { _clientPrefsCache = {}; }
  }
  return _clientPrefsCache[name.toLowerCase().trim()] || null;
}

function invalidateClientPrefsCache() {
  _clientPrefsCache = null;
}

// ── Save manual note ────────────────────────────────────────────────────────
function clientSaveNote(normKey, text) {
  try {
    const notes = JSON.parse(localStorage.getItem(CLIENT_NOTES_KEY)||'{}');
    notes[normKey] = text;
    localStorage.setItem(CLIENT_NOTES_KEY, JSON.stringify(notes));
  } catch(e) {}
}

// ── Render ──────────────────────────────────────────────────────────────────
function renderClients(c) {
  let filterLevel = 'all';
  let searchQ = '';
  let expanded = {};

  const body = makePageShell(c, 'Clients & Fidélité',
    'Analyse automatique des préférences · Accueil personnalisé',
    [{label:'↺ Actualiser', onclick:'eqRefresh&&eqRefresh();renderClients(document.getElementById("module-container"))'}]);

  function rebuild() {
    body.innerHTML = '';
    const clients = clientsCollect();
    // Rebuild placement cache silently every time module is opened
    buildClientPrefsCache();

    // ── KPIs
    const vip      = clients.filter(x => x.loyalty.level === 'vip').length;
    const habitue  = clients.filter(x => x.loyalty.level === 'habitue').length;
    const fidele   = clients.filter(x => x.loyalty.level === 'fidele').length;
    const regulier = clients.filter(x => x.loyalty.level === 'regulier').length;
    const withPrefs = clients.filter(c => c.prefs.length > 0).length;
    body.appendChild(makeKPIRow([
      {l:'Clients détectés', v:clients.length,  s:'Sur tout l\'historique Zenchef', col:'#2563EB'},
      {l:'VIP & Habitués',   v:vip+habitue,     s:'7+ visites détectées',           col:'#D97706'},
      {l:'Avec préférences', v:withPrefs,        s:'✓ Utilisées en auto-placement',  col:'#16A34A'},
      {l:'Réguliers',        v:regulier,         s:'2 à 3 visites',                 col:'#7C3AED'}
    ]));

    // ── Search
    const searchWrap = document.createElement('div');
    searchWrap.style.cssText = 'display:flex;gap:8px;align-items:center';
    const inp = document.createElement('input');
    inp.placeholder = '🔍  Rechercher un client…';
    inp.value = searchQ;
    inp.style.cssText = 'flex:1;padding:10px 14px;border:1px solid var(--sep);border-radius:10px;font-family:inherit;font-size:13px;background:var(--card);color:var(--t1);outline:none';
    inp.oninput = () => { searchQ = inp.value; renderList(); };
    searchWrap.appendChild(inp);
    body.appendChild(searchWrap);

    // ── Filter tabs
    const tabs = [
      {k:'all',     label:'Tous',        count:clients.length},
      {k:'vip',     label:'VIP ⭐',       count:vip},
      {k:'habitue', label:'Habitués ★',   count:habitue},
      {k:'fidele',  label:'Fidèles',      count:fidele},
      {k:'regulier',label:'Réguliers',    count:regulier},
      {k:'nouveau', label:'Nouveaux',     count:clients.filter(x=>x.loyalty.level==='nouveau').length}
    ];
    body.appendChild(makeSubNav(tabs, filterLevel, k => { filterLevel = k; renderList(); }));

    // ── Client list container
    const listEl = document.createElement('div');
    body.appendChild(listEl);

    function renderList() {
      listEl.innerHTML = '';
      let list = clients;
      if (filterLevel !== 'all') list = list.filter(c => c.loyalty.level === filterLevel);
      if (searchQ.trim()) {
        const q = searchQ.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
      }

      if (list.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--t4)">
          <div style="font-size:40px;margin-bottom:12px">👤</div>
          <div style="font-size:14px;font-weight:600;color:var(--t2);margin-bottom:6px">Aucun client trouvé</div>
          <div style="font-size:12px">Importez les réservations Zenchef pour alimenter les profils</div>
        </div>`;
        return;
      }

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:10px';
      list.forEach(cl => grid.appendChild(makeClientCard(cl)));
      listEl.appendChild(grid);
    }

    renderList();
  }

  function makeClientCard(cl) {
    const L   = cl.loyalty;
    const isOpen = !!expanded[cl.normKey];
    const card = document.createElement('div');
    card.style.cssText = `background:var(--card);border:1px solid var(--sep);border-left:3px solid ${L.col};border-radius:0 14px 14px 0;overflow:hidden;transition:box-shadow .18s`;
    card.onmouseenter = () => card.style.boxShadow = '0 4px 16px rgba(24,20,10,.07)';
    card.onmouseleave = () => card.style.boxShadow = '';

    // ── Header
    const initials = cl.name.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    const fmtDate = d => { if(!d) return '—'; const p=d.split('-'); return `${p[2]}/${p[1]}/${p[0].slice(2)}`; };
    const prefChips = cl.prefs.map(p =>
      `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:10px;background:${p.col}14;color:${p.col};font-size:10px;font-weight:600;margin:2px 2px 0 0">${p.label}</span>`
    ).join('');

    const avgPaxStr = cl.avgPax >= 2 ? `· ~${Math.round(cl.avgPax)} pers.` : '';
    const phoneBtn = cl.phone
      ? `<a href="tel:${cl.phone.replace(/\D/g,'')}" style="padding:7px 12px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;color:var(--t1);text-decoration:none;white-space:nowrap">📞 Appeler</a>`
      : '';

    card.innerHTML = `
      <div style="padding:12px 14px;border-bottom:.5px solid var(--bg)">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:38px;height:38px;border-radius:50%;background:${L.col};color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0">${initials}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span style="font-size:14px;font-weight:800;color:var(--t1)">${cl.name}</span>
              <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${L.bg};color:${L.col}">${L.label}</span>
            </div>
            <div style="font-size:11px;color:var(--t3);margin-top:1px">${cl.visitCount} visite${cl.visitCount>1?'s':''} ${avgPaxStr} · Dernière : ${fmtDate(cl.lastVisit)}</div>
          </div>
        </div>
        ${cl.prefs.length > 0 ? `<div style="margin-top:8px">${prefChips}</div>` : ''}
      </div>

      <div class="cl-memo-${cl.normKey.replace(/\W/g,'_')}" style="padding:10px 14px;border-bottom:.5px solid var(--bg)">
        <div style="font-size:9.5px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">Mémo d'accueil</div>
        <textarea
          placeholder="${cl.memoAuto ? cl.memoAuto.replace(/\n/g,' · ') : 'Ajouter une note personnalisée…'}"
          style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--sep);border-radius:8px;font-family:inherit;font-size:11.5px;color:var(--t1);background:var(--bg);resize:none;outline:none;line-height:1.5;min-height:54px"
          rows="2"
          onchange="clientSaveNote('${cl.normKey}', this.value)"
        >${cl.memoUser}</textarea>
        ${cl.memoAuto && !cl.memoUser ? `<div style="font-size:10px;color:var(--t4);margin-top:3px">💡 Auto : ${cl.memoAuto.replace(/\n/g,' · ')}</div>` : ''}
      </div>

      <div style="padding:8px 14px;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        ${phoneBtn}
        <button onclick="this.closest('div').parentElement.querySelector('.cl-hist').style.display=this.closest('div').parentElement.querySelector('.cl-hist').style.display==='none'?'block':'none';this.textContent=this.textContent.includes('▾')?'▴ Masquer':'▾ Historique (${cl.visitCount})'" style="padding:7px 12px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit;white-space:nowrap">▾ Historique (${cl.visitCount})</button>
      </div>

      <div class="cl-hist" style="display:none;border-top:.5px solid var(--bg)">
        <div style="padding:8px 14px;max-height:220px;overflow-y:auto">
          ${cl.visits.map(v => `
            <div style="display:flex;gap:8px;align-items:baseline;padding:5px 0;border-bottom:.5px solid var(--bg);font-size:11.5px">
              <span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--t4);flex-shrink:0;width:58px">${fmtDate(v.date)}</span>
              <span style="color:var(--t3);min-width:22px">${v.pax}p</span>
              <span style="color:var(--t2);line-height:1.4;font-style:${v.comment?'normal':'italic'}">${v.comment || '—'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return card;
  }

  rebuild();
}
