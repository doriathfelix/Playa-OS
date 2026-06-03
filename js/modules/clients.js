// ══════════════════════════════════════════
// CLIENTS & FIDÉLITÉ — CRM La Playa
// ══════════════════════════════════════════

const CLIENT_NOTES_KEY    = 'playa-client-notes-v1';
const CRM_HISTORY_KEY     = 'playa-crm-history-v1';
const CRM_HISTORY_TS_KEY  = 'playa-crm-history-ts';

// ── Loyalty ────────────────────────────────────────────────────────────────
function clientLoyalty(n) {
  if (n >= 10) return {label:'VIP ⭐',      level:'vip',      col:'#D97706', bg:'#FFFBEB'};
  if (n >= 7)  return {label:'Habitué ★',  level:'habitue',  col:'#7C3AED', bg:'#F5F3FF'};
  if (n >= 4)  return {label:'Fidèle',     level:'fidele',   col:'#16A34A', bg:'#EDF7F1'};
  if (n >= 2)  return {label:'Régulier',   level:'regulier', col:'#2563EB', bg:'#EFF6FF'};
  return              {label:'Nouveau',    level:'nouveau',  col:'#6B7280', bg:'#F9FAFB'};
}

// ── Preference detection ───────────────────────────────────────────────────
function clientDetectPrefs(text) {
  const t = (text || '').toLowerCase();
  const prefs = [];
  const add = (cat, label, col) => { if (!prefs.find(p => p.label === label)) prefs.push({cat, label, col}); };

  if (/terrasse|playa|ext[eé]rieur|dehors|outside/.test(t))    add('place','Terrasse','#16A34A');
  if (/int[eé]rieur|inside/.test(t))                            add('place','Intérieur','#2563EB');
  if (/\bombre\b/.test(t))                                      add('place','Ombre','#7C3AED');
  if (/\bsoleil\b/.test(t))                                     add('place','Soleil','#D97706');
  if (/vue\s*mer|vue\s*plage|bord\s*de\s*mer/.test(t))         add('place','Vue mer','#0284C7');
  if (/coin|calme|tranquille|discr[eè]t/.test(t))               add('place','Coin calme','#6B7280');
  const tm = t.match(/\btable[s]?\s*n?[°º]?\s*(\d+)/);
  if (tm) add('place', 'Table '+tm[1], '#EA580C');

  if (/transat|sunbed|bain\s*de\s*soleil/.test(t))              add('transat','Transats','#0891B2');
  if (/premi[eè]re?\s*ligne|1[eè]re?\s*ligne|front\s*row/.test(t)) add('transat','1ère ligne','#0284C7');
  if (/bed\s*double|lit\s*double|double\s*bed|cabane/.test(t))  add('transat','Bed double','#0891B2');
  if (/extr[eé]mit[eé]|bout|coin\s*de\s*rang|end/.test(t))     add('transat','Bout de rang','#0284C7');

  if (/v[eé]g[eé]tari/.test(t))                                 add('diet','Végétarien','#16A34A');
  if (/\bvegan\b|v[eé]gane/.test(t))                            add('diet','Vegan','#16A34A');
  if (/sans\s*gluten|gluten.free|c[oé]liaque/.test(t))          add('diet','Sans gluten','#D97706');
  if (/allergi/.test(t))                                         add('diet','Allergie ⚠','#DC2626');
  if (/halal/.test(t))                                           add('diet','Halal','#16A34A');
  if (/lactose/.test(t))                                         add('diet','Sans lactose','#D97706');
  if (/chaise\s*haute|high.chair|b[eé]b[eé]|\bbb\b/.test(t))   add('habit','Chaise haute','#16A34A');

  if (/anniversaire|birthday/.test(t))                           add('event','Anniversaire 🎂','#DB2777');
  if (/\bmariage\b|wedding/.test(t))                             add('event','Mariage 💍','#EC4899');
  if (/lune\s*de\s*miel|honeymoon/.test(t))                     add('event','Lune de miel','#EC4899');
  if (/fian[cç]/.test(t))                                        add('event','Fiançailles','#EC4899');
  if (/business|professionnel|r[eé]union\s*d/.test(t))           add('event','Repas pro','#64748B');
  if (/valentine|st.?valentin/.test(t))                          add('event','St-Valentin','#EC4899');

  if (/\bpmr\b|fauteuil\s*roulant|handicap|wheelchair/.test(t)) add('habit','PMR ♿','#7C3AED');
  if (/\bchien\b|animaux\s*accept/.test(t))                      add('habit','Avec chien 🐕','#78350F');
  if (/repas\s*transat|manger\s*(sur|aux)\s*transat/.test(t))    add('habit','Repas-transat','#0891B2');

  return prefs;
}

// ── Welcome memo ─────────────────────────────────────────────────────────
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

// ── CRM raw helpers ────────────────────────────────────────────────────────
function _crmCapWord(w) {
  return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';
}

function _crmExtractComment(b) {
  const cf = b.custom_field || {};
  return [
    b.comment, b.note, b.internal_note, b.customer_comment, b.extra_comment,
    b.preparation, b.occasion, b.special_request, b.wishes, b.message,
    b.remarks, b.allergy, b.dietary, b.restaurant_comment, b.private_comment,
    b.customer?.comment, b.customer?.note, b.customer?.wishes,
    b.customer?.preferences, b.customer?.remarks, b.customer?.restriction,
    b.customer?.allergy, b.customer?.dietary, b.customer?.profile_comment,
    ...Object.entries(cf)
      .filter(([, v]) => typeof v === 'string' && v.trim().length > 2 && !/^\d+$/.test(v.trim()))
      .map(([, v]) => v)
  ].filter(Boolean).map(s => String(s).trim()).filter(s => s.length > 1)
   .filter((v, i, a) => a.findIndex(x => x.toLowerCase() === v.toLowerCase()) === i)
   .join(' · ');
}

function _crmLoadMap() {
  try {
    const raw = localStorage.getItem(CRM_HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function _crmSaveMap(map) {
  const trySave = (data) => {
    localStorage.setItem(CRM_HISTORY_KEY, JSON.stringify(data));
  };
  try {
    trySave(map);
  } catch (e) {
    // Quota: truncate comments to 150 chars
    try {
      const slim = {};
      Object.entries(map).forEach(([k, v]) => {
        slim[k] = { ...v, visits: v.visits.map(vi => ({ date: vi.date, pax: vi.pax, comment: (vi.comment || '').substring(0, 150) })) };
      });
      trySave(slim);
    } catch (e2) { console.warn('CRM: quota localStorage dépassé'); }
  }
}

// ── Incremental merge — called automatically when a day loads ─────────────
function crmMergeDay(date, rawBookings) {
  if (!date || !rawBookings || rawBookings.length === 0) return false;
  const map = _crmLoadMap();
  let changed = false;

  rawBookings.forEach(b => {
    if (!b) return;
    if (['cancelled', 'rejected', 'deleted', 'no_show_cancelled'].includes(b.status)) return;
    const f = (b.firstname || '').trim();
    const l = (b.lastname || '').trim();
    const name = [_crmCapWord(l), _crmCapWord(f)].filter(Boolean).join(' ');
    if (!name || name.length < 2) return;

    const key = name.toLowerCase().trim();
    const pax = b.nb_guests || b.num_pers || 2;
    const phone = (b.phone_number || b.phone || '').trim();
    const email = (b.email || '').trim();
    const comment = _crmExtractComment(b);

    if (!map[key]) { map[key] = { name, normKey: key, phone: '', email: '', visits: [] }; changed = true; }
    if (phone && !map[key].phone) { map[key].phone = phone; changed = true; }
    if (email && !map[key].email) { map[key].email = email; changed = true; }

    const existing = map[key].visits.find(v => v.date === date && v.pax === pax);
    if (!existing) {
      map[key].visits.push({ date, pax, comment });
      changed = true;
    } else if (comment && !existing.comment) {
      existing.comment = comment;
      changed = true;
    }
  });

  if (changed) {
    _crmSaveMap(map);
    _clientPrefsCache = null;
  }
  return changed;
}

// ── Full history fetch from Zenchef API ───────────────────────────────────
async function _crmFetchPage(page, dateMin, dateMax) {
  let url = `${ZC_API}/bookings?limit=250`;
  if (dateMin) url += `&date_min=${dateMin}&date_max=${dateMax || dateMin}`;
  if (page > 1) url += `&page=${page}`;
  const res = await fetch(url, {
    headers: {
      'auth-token': ZC_TOKEN,
      'restaurantId': ZC_RESTAURANT_ID,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

let _crmImporting = false;

async function crmImportHistory(onProgress, onDone) {
  if (_crmImporting) return;
  _crmImporting = true;

  try {
    const today = new Date().toISOString().split('T')[0];
    const yearMin = `${new Date().getFullYear() - 5}-01-01`;

    const p1 = await _crmFetchPage(1, yearMin, today);
    const total = p1.paginator?.total || p1.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / 250));

    const map = _crmLoadMap(); // start from existing data (merge, don't overwrite)
    let changed = false;

    function addBookings(bookings) {
      (bookings || []).forEach(b => {
        if (!b) return;
        if (['cancelled', 'rejected', 'deleted', 'no_show_cancelled'].includes(b.status)) return;
        const f = (b.firstname || '').trim();
        const l = (b.lastname || '').trim();
        const name = [_crmCapWord(l), _crmCapWord(f)].filter(Boolean).join(' ');
        if (!name || name.length < 2) return;

        const date = (b.shift_date || b.day || '').substring(0, 10);
        if (!date) return;

        const key = name.toLowerCase().trim();
        const pax = b.nb_guests || b.num_pers || 2;
        const phone = (b.phone_number || b.phone || '').trim();
        const email = (b.email || '').trim();
        const comment = _crmExtractComment(b);

        if (!map[key]) { map[key] = { name, normKey: key, phone: '', email: '', visits: [] }; changed = true; }
        if (phone && !map[key].phone) { map[key].phone = phone; changed = true; }
        if (email && !map[key].email) { map[key].email = email; changed = true; }
        if (!map[key].visits.find(v => v.date === date && v.pax === pax)) {
          map[key].visits.push({ date, pax, comment });
          changed = true;
        }
      });
    }

    addBookings(p1.data || []);
    if (onProgress) onProgress(1, totalPages);

    const BATCH = 12;
    for (let start = 2; start <= totalPages; start += BATCH) {
      const nums = Array.from({ length: Math.min(BATCH, totalPages - start + 1) }, (_, i) => start + i);
      const pages = await Promise.all(nums.map(p => _crmFetchPage(p, yearMin, today).then(r => r.data || [])));
      pages.forEach(addBookings);
      if (onProgress) onProgress(Math.min(start + BATCH - 1, totalPages), totalPages);
    }

    if (changed) _crmSaveMap(map);
    localStorage.setItem(CRM_HISTORY_TS_KEY, String(Date.now()));
    _clientPrefsCache = null;

    const clientCount = Object.keys(map).length;
    const bookingCount = Object.values(map).reduce((s, c) => s + c.visits.length, 0);
    if (onDone) onDone(clientCount, bookingCount);
    return map;
  } finally {
    _crmImporting = false;
  }
}

// ── Auto-ensure: called at startup, imports silently if needed ────────────
async function crmEnsureHistory() {
  const ts = parseInt(localStorage.getItem(CRM_HISTORY_TS_KEY) || '0');
  const age = Date.now() - ts;
  const WEEK = 7 * 24 * 3600 * 1000;
  if (!ts || age > WEEK) {
    try {
      await crmImportHistory(null, null);
      console.log('CRM: historique chargé en arrière-plan');
    } catch (e) { console.warn('CRM auto-import:', e.message); }
  }
}

// ── Data collection ────────────────────────────────────────────────────────
function clientsCollect() {
  const map = {};

  function upsert(name, phone, email, date, pax, comment) {
    const key = name.toLowerCase().trim();
    if (!map[key]) map[key] = { name, normKey: key, phone: '', email: '', visits: [] };
    if (phone && !map[key].phone) map[key].phone = phone;
    if (email && !map[key].email) map[key].email = email;
    if (date && !map[key].visits.find(v => v.date === date && v.pax === pax)) {
      map[key].visits.push({ date, pax: pax || 2, comment: comment || '' });
    }
  }

  // 1 — CRM dedicated history store (always up to date)
  try {
    const crmRaw = localStorage.getItem(CRM_HISTORY_KEY);
    if (crmRaw) {
      Object.values(JSON.parse(crmRaw)).forEach(c => {
        (c.visits || []).forEach(v => {
          if (c.name && v.date) upsert(c.name, c.phone || '', c.email || '', v.date, v.pax || 2, v.comment || '');
        });
      });
    }
  } catch (e) {}

  // 2 — Per-day Zenchef cache (supplements CRM for any uncached dates)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('playa_zc_')) continue;
    const date = key.replace('playa_zc_', '');
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      (stored?.data || []).forEach(b => {
        const capW = w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';
        const f = (b.firstname || b.first_name || '').trim();
        const l = (b.lastname || b.last_name || '').trim();
        const name = [capW(l), capW(f)].filter(Boolean).join(' ');
        if (!name) return;
        upsert(name, (b.phone || b.customer?.phone || '').trim(), (b.email || b.customer?.email || '').trim(), date, b.num_pers || b.nb_people || b.pax || 2, '');
      });
    } catch (e) {}
  }

  // 3 — Today's in-memory reservations
  const today = (typeof currentDate !== 'undefined' ? currentDate : null) || new Date().toISOString().split('T')[0];
  ['s1', 's2', 'soir', 'transats'].forEach(svc => {
    ((typeof reservations !== 'undefined' ? reservations[svc] : null) || []).forEach(r => {
      if (!r.name || r.name === 'Sans nom') return;
      upsert(r.name, r.phone || '', r.email || '', today, r.pax || 2, r.comment || '');
    });
  });

  // 4 — Compute aggregates
  const notes = (() => { try { return JSON.parse(localStorage.getItem(CLIENT_NOTES_KEY) || '{}'); } catch (e) { return {}; } })();
  const result = [];
  Object.values(map).forEach(c => {
    if (c.visits.length === 0) return;
    c.visits.sort((a, b) => a.date > b.date ? -1 : 1);
    c.visitCount = c.visits.length;
    c.lastVisit  = c.visits[0].date;
    c.avgPax     = c.visits.reduce((s, v) => s + (v.pax || 2), 0) / c.visits.length;
    c.prefs      = clientDetectPrefs(c.visits.map(v => v.comment).join(' '));
    c.loyalty    = clientLoyalty(c.visitCount);
    c.memoAuto   = clientMemoAuto(c);
    c.memoUser   = notes[c.normKey] || '';
    result.push(c);
  });
  result.sort((a, b) => b.visitCount - a.visitCount || b.lastVisit.localeCompare(a.lastVisit));
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
      tableId:       tMatch ? parseInt(tMatch.label.split(' ')[1]) : null,
      wantTerrasse:  !!p.find(x => x.label === 'Terrasse'),
      wantInterieur: !!p.find(x => x.label === 'Intérieur'),
      wantOmbre:     !!p.find(x => x.label === 'Ombre'),
      wantSoleil:    !!p.find(x => x.label === 'Soleil'),
      bedDouble:     !!p.find(x => x.label === 'Bed double'),
      firstRow:      !!p.find(x => x.label === '1ère ligne'),
      extremite:     !!p.find(x => x.label === 'Bout de rang')
    };
  });
  try { localStorage.setItem('playa-client-prefs-cache', JSON.stringify(cache)); } catch (e) {}
  _clientPrefsCache = cache;
  return cache;
}

function getClientHistPrefs(name) {
  if (!name || name === 'Sans nom') return null;
  if (!_clientPrefsCache) {
    try {
      const s = localStorage.getItem('playa-client-prefs-cache');
      _clientPrefsCache = s ? JSON.parse(s) : {};
    } catch (e) { _clientPrefsCache = {}; }
  }
  return _clientPrefsCache[name.toLowerCase().trim()] || null;
}

function invalidateClientPrefsCache() { _clientPrefsCache = null; }

// ── Save manual note ────────────────────────────────────────────────────────
function clientSaveNote(normKey, text) {
  try {
    const notes = JSON.parse(localStorage.getItem(CLIENT_NOTES_KEY) || '{}');
    notes[normKey] = text;
    localStorage.setItem(CLIENT_NOTES_KEY, JSON.stringify(notes));
  } catch (e) {}
}

// ── Render ──────────────────────────────────────────────────────────────────
function renderClients(c) {
  let filterLevel = 'all';
  let searchQ = '';

  c.innerHTML = '';

  // Header bar
  const hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 12px 0;flex-shrink:0;';
  hdr.innerHTML = `
    <span style="font-size:13px;font-weight:700;color:var(--tx);flex:1;">Clients & Fidélité</span>
    <div id="crm-status-dot" style="display:none;width:7px;height:7px;border-radius:50%;background:#F59E0B;flex-shrink:0;" title="Sync en cours…"></div>
    <button id="crm-refresh-btn" onclick="crmManualRefresh()" style="padding:5px 10px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:10px;font-weight:600;color:var(--tx2);cursor:pointer;font-family:inherit;">↺ Sync</button>`;
  c.appendChild(hdr);

  // Thin progress bar (hidden by default)
  const progBar = document.createElement('div');
  progBar.id = 'crm-thin-progress';
  progBar.style.cssText = 'height:3px;background:var(--sep);margin:6px 12px 0;border-radius:2px;display:none;overflow:hidden;flex-shrink:0;';
  progBar.innerHTML = `<div id="crm-thin-fill" style="height:3px;background:var(--accent);border-radius:2px;width:0%;transition:width .4s;"></div>`;
  c.appendChild(progBar);

  // Main body
  const body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow-y:auto;padding:10px 12px 20px;display:flex;flex-direction:column;gap:10px;';
  c.appendChild(body);

  // ── Import-in-progress indicator
  function setImporting(cur, total) {
    const dot = document.getElementById('crm-status-dot');
    const bar = document.getElementById('crm-thin-progress');
    const fill = document.getElementById('crm-thin-fill');
    if (cur === null) {
      if (dot) dot.style.display = 'none';
      if (bar) bar.style.display = 'none';
    } else {
      if (dot) dot.style.display = 'block';
      if (bar) bar.style.display = 'block';
      const pct = total > 0 ? Math.round((cur / total) * 100) : 0;
      if (fill) fill.style.width = pct + '%';
    }
  }

  // ── Manual refresh button handler
  window.crmManualRefresh = async function () {
    const btn = document.getElementById('crm-refresh-btn');
    if (btn) btn.disabled = true;
    setImporting(0, 1);
    try {
      await crmImportHistory(
        (cur, total) => setImporting(cur, total),
        () => { setImporting(null, null); rebuild(); if (btn) btn.disabled = false; }
      );
    } catch (e) {
      setImporting(null, null);
      if (btn) { btn.disabled = false; btn.textContent = '⚠ Erreur'; setTimeout(() => { btn.textContent = '↺ Sync'; }, 3000); }
    }
  };

  // ── If module opened while importing in background, show progress
  if (_crmImporting) {
    setImporting(1, 2); // show indeterminate
  }

  // ── If no CRM data at all, trigger auto-import right now
  const hasCrmData = !!localStorage.getItem(CRM_HISTORY_KEY);
  if (!hasCrmData && !_crmImporting) {
    setImporting(0, 1);
    crmImportHistory(
      (cur, total) => setImporting(cur, total),
      () => { setImporting(null, null); rebuild(); }
    ).catch(e => {
      setImporting(null, null);
      const btn = document.getElementById('crm-refresh-btn');
      if (btn) { btn.textContent = '⚠ Erreur réseau'; btn.disabled = false; }
    });
  }

  function fmtSyncDate() {
    try {
      const ts = parseInt(localStorage.getItem(CRM_HISTORY_TS_KEY) || '0');
      if (!ts) return null;
      const d = new Date(ts);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' ' +
             d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return null; }
  }

  function rebuild() {
    body.innerHTML = '';
    const clients = clientsCollect();
    buildClientPrefsCache();

    // Sync date info line
    const syncDate = fmtSyncDate();
    if (syncDate) {
      const info = document.createElement('div');
      info.style.cssText = 'font-size:9px;color:var(--tx2);text-align:right;margin-top:-4px;';
      info.textContent = `Dernière sync complète : ${syncDate}`;
      body.appendChild(info);
    }

    // ── Empty: show waiting state
    if (clients.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText = 'text-align:center;padding:50px 20px;';
      emptyDiv.innerHTML = `
        <div style="font-size:40px;margin-bottom:12px;">⏳</div>
        <div style="font-size:14px;font-weight:700;color:var(--tx);margin-bottom:6px;">Chargement en cours…</div>
        <div style="font-size:12px;color:var(--tx2);">L'historique Zenchef est en cours d'importation. La liste apparaîtra automatiquement.</div>`;
      body.appendChild(emptyDiv);
      return;
    }

    // ── KPIs
    const vip      = clients.filter(x => x.loyalty.level === 'vip').length;
    const habitue  = clients.filter(x => x.loyalty.level === 'habitue').length;
    const fidele   = clients.filter(x => x.loyalty.level === 'fidele').length;
    const regulier = clients.filter(x => x.loyalty.level === 'regulier').length;
    const withPrefs = clients.filter(x => x.prefs.length > 0).length;
    const totalVisits = clients.reduce((s, x) => s + x.visitCount, 0);

    const kpiRow = document.createElement('div');
    kpiRow.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px;';
    [
      {l:'Clients',         v:clients.length,   s:`${totalVisits} visites`,          col:'#2563EB'},
      {l:'VIP & Habitués',  v:vip + habitue,    s:'7+ visites',                      col:'#D97706'},
      {l:'Avec préfs',      v:withPrefs,         s:'Auto-placement',                  col:'#16A34A'},
      {l:'Réguliers+',      v:regulier + fidele, s:'2 à 9 visites',                   col:'#7C3AED'}
    ].forEach(({l, v, s, col}) => {
      const kpi = document.createElement('div');
      kpi.style.cssText = `background:var(--card);border-radius:10px;border:1px solid var(--sep);padding:10px 6px;text-align:center;border-top:3px solid ${col};`;
      kpi.innerHTML = `<div style="font-size:20px;font-weight:800;color:${col};">${v}</div>
        <div style="font-size:10px;font-weight:700;color:var(--tx);margin-top:1px;">${l}</div>
        <div style="font-size:9px;color:var(--tx2);margin-top:1px;">${s}</div>`;
      kpiRow.appendChild(kpi);
    });
    body.appendChild(kpiRow);

    // ── Search
    const inp = document.createElement('input');
    inp.placeholder = '🔍  Rechercher un client…';
    inp.value = searchQ;
    inp.style.cssText = 'width:100%;box-sizing:border-box;padding:10px 14px;border:1px solid var(--sep);border-radius:10px;font-family:inherit;font-size:13px;background:var(--card);color:var(--tx);outline:none';
    inp.oninput = () => { searchQ = inp.value; renderList(); };
    body.appendChild(inp);

    // ── Filter tabs
    const tabs = [
      {k:'all',      label:'Tous',       count:clients.length},
      {k:'vip',      label:'VIP ⭐',      count:vip},
      {k:'habitue',  label:'Habitués',   count:habitue},
      {k:'fidele',   label:'Fidèles',    count:fidele},
      {k:'regulier', label:'Réguliers',  count:regulier},
      {k:'nouveau',  label:'1× visite',  count:clients.filter(x => x.loyalty.level === 'nouveau').length}
    ];
    body.appendChild(makeSubNav(tabs, filterLevel, k => { filterLevel = k; renderList(); }));

    const listEl = document.createElement('div');
    body.appendChild(listEl);

    function renderList() {
      listEl.innerHTML = '';
      let list = clients;
      if (filterLevel !== 'all') list = list.filter(x => x.loyalty.level === filterLevel);
      if (searchQ.trim()) {
        const q = searchQ.toLowerCase();
        list = list.filter(x => x.name.toLowerCase().includes(q) || x.phone.includes(q));
      }
      if (list.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;padding:30px 20px;color:var(--tx2);font-size:13px;">Aucun client trouvé</div>`;
        return;
      }
      const grid = document.createElement('div');
      grid.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
      list.forEach(cl => grid.appendChild(makeClientCard(cl)));
      listEl.appendChild(grid);
    }

    renderList();
  }

  function makeClientCard(cl) {
    const L = cl.loyalty;
    const card = document.createElement('div');
    card.setAttribute('data-card', cl.normKey);
    card.style.cssText = `background:var(--card);border:1px solid var(--sep);border-left:4px solid ${L.col};border-radius:0 12px 12px 0;overflow:hidden;`;

    const initials = cl.name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
    const fmtDate = d => { if (!d) return '—'; const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0].slice(2)}`; };
    const prefChips = cl.prefs.map(p =>
      `<span style="display:inline-flex;padding:2px 7px;border-radius:8px;background:${p.col}18;color:${p.col};font-size:10px;font-weight:600;margin:2px 2px 0 0;">${p.label}</span>`
    ).join('');
    const avgPaxStr = cl.avgPax >= 2 ? ` · ~${Math.round(cl.avgPax)} pers.` : '';

    // Year span
    let span = '';
    if (cl.visits.length >= 2) {
      const y1 = (cl.visits[cl.visits.length - 1].date || '').substring(0, 4);
      const y2 = (cl.visits[0].date || '').substring(0, 4);
      span = y1 && y2 ? (y1 === y2 ? ` · ${y1}` : ` · ${y1}→${y2}`) : '';
    }

    const phoneBtn = cl.phone
      ? `<a href="tel:${cl.phone.replace(/\D/g, '')}" style="padding:6px 10px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;color:var(--tx);text-decoration:none;">📞</a>`
      : '';

    const memoContent = cl.memoUser
      ? cl.memoUser
      : (cl.memoAuto ? `<!-- auto:${cl.memoAuto} -->` : '');

    card.innerHTML = `
      <div style="padding:10px 12px 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${L.col};color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;">${initials}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:14px;font-weight:800;color:var(--tx);">${cl.name}</span>
              <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:${L.bg};color:${L.col};">${L.label}</span>
            </div>
            <div style="font-size:11px;color:var(--tx2);margin-top:1px;">${cl.visitCount} visite${cl.visitCount > 1 ? 's' : ''}${avgPaxStr}${span} · Dernière : ${fmtDate(cl.lastVisit)}</div>
          </div>
        </div>
        ${cl.prefs.length > 0 ? `<div style="margin-top:6px;">${prefChips}</div>` : ''}
      </div>

      ${cl.memoAuto && !cl.memoUser ? `
      <div style="padding:0 12px 6px;background:var(--bg);">
        <div style="font-size:10px;color:var(--tx2);line-height:1.5;white-space:pre-line;padding:6px 8px;background:var(--card);border-radius:6px;border-left:2px solid ${L.col};">${cl.memoAuto}</div>
      </div>` : ''}

      <div style="padding:6px 12px 8px;border-top:.5px solid var(--sep);background:var(--bg);">
        <textarea
          placeholder="${cl.memoAuto ? '✏️ Ajouter / modifier la note…' : 'Note personnalisée…'}"
          style="width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid var(--sep);border-radius:8px;font-family:inherit;font-size:11.5px;color:var(--tx);background:var(--card);resize:none;outline:none;line-height:1.5;min-height:38px;"
          rows="2"
          onchange="clientSaveNote('${cl.normKey}', this.value)"
        >${cl.memoUser}</textarea>
      </div>

      <div style="padding:5px 12px 7px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;border-top:.5px solid var(--sep);">
        ${phoneBtn}
        <button
          onclick="(function(btn){var h=btn.closest('[data-card]').querySelector('.cl-hist');var open=h.style.display!=='none';h.style.display=open?'none':'block';btn.textContent=open?'▾ Historique (${cl.visitCount})':'▴ Masquer';})(this)"
          style="padding:5px 10px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;color:var(--tx2);cursor:pointer;font-family:inherit;">
          ▾ Historique (${cl.visitCount})
        </button>
      </div>

      <div class="cl-hist" style="display:none;border-top:.5px solid var(--sep);">
        <div style="padding:6px 12px;max-height:200px;overflow-y:auto;">
          ${cl.visits.map(v => `
            <div style="display:flex;gap:8px;align-items:baseline;padding:4px 0;border-bottom:.5px solid var(--sep);font-size:11px;">
              <span style="font-family:monospace;font-size:10px;color:var(--tx2);flex-shrink:0;width:54px;">${fmtDate(v.date)}</span>
              <span style="color:var(--tx2);min-width:18px;flex-shrink:0;">${v.pax}p</span>
              <span style="color:var(--tx);line-height:1.4;word-break:break-word;font-style:${v.comment ? 'normal' : 'italic'};">${v.comment || '—'}</span>
            </div>`).join('')}
        </div>
      </div>`;

    return card;
  }

  rebuild();
}
