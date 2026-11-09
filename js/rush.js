// ══════════════════════════════════════════
// RUSH MODE — Centre de commandement de crise
// Activé uniquement en cas d'imprévus terrain
// ══════════════════════════════════════════

let rushAlerts = [];
let rushAlertSeq = 0;

// ── Activation / désactivation ──────────────
function toggleRushMode(){
  rushMode = !rushMode;
  document.getElementById('rush-banner').className = rushMode ? 'on' : '';
  document.getElementById('rush-btn').className = 'ib ' + (rushMode ? 'rush-on' : '');
  document.getElementById('rush-overlay').className = rushMode ? 'on' : '';
  if(rushMode){
    rushAlerts = [];
    rushAlertSeq = 0;
    _rushAutoAlerts();
    renderRushOverlay();
    // Rafraîchissement automatique toutes les 60s
    rushAutoRefresh = setInterval(() => {
      if(rushMode){ _rushAutoAlerts(); renderRushOverlay(); }
    }, 60000);
  } else {
    clearInterval(rushAutoRefresh);
    _rushClosePanel();
  }
}
let rushAutoRefresh = null;

// ── Parsing heure "12h30" → minutes ─────────
function _rushParseTime(t){
  if(!t) return 0;
  const m = String(t).match(/(\d{1,2})[h:](\d{2})/i);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0;
}
function _rushNowMin(){
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

// ── Alertes automatiques ────────────────────
function _rushAutoAlerts(){
  const resas = gr();
  const now = _rushNowMin();
  resas.forEach(r => {
    if(r.ns || r.waiting) return;
    const resaMin = _rushParseTime(r.time);
    const late = now - resaMin;
    const alreadyLate = rushAlerts.find(a => a.resaId === r.id && a.type === 'auto_late');
    if(late >= 15 && !r.placed && !alreadyLate){
      _rushAddAlert({
        type: 'auto_late',
        resaId: r.id,
        severity: late >= 30 ? 'danger' : 'warn',
        msg: `${r.name} · ${r.pax} PAX · ${r.time} — retard ${late} min`,
        actions: [
          { label: 'Marquer no-show', fn: () => _rushDoNoShow(r.id) },
          { label: 'Trouver table', fn: () => _rushFindTable(r.id) },
        ]
      });
    }
  });
}

function _rushAddAlert(opts){
  rushAlerts.push({
    id: ++rushAlertSeq,
    type: opts.type,
    resaId: opts.resaId || null,
    tableId: opts.tableId || null,
    severity: opts.severity || 'warn',
    msg: opts.msg,
    actions: opts.actions || [],
    resolved: false,
    ts: Date.now()
  });
}

function rushResolve(id){
  const a = rushAlerts.find(x => x.id === id);
  if(a) a.resolved = true;
  renderRushOverlay();
}

// ── Render principal ────────────────────────
function renderRushOverlay(){
  if(!rushMode) return;
  const resas = gr();
  const now = _rushNowMin();

  // KPIs
  const totalPax = resas.filter(r => !r.ns).reduce((s, r) => s + r.pax, 0);
  const placedPax = resas.filter(r => !r.ns && r.placed).reduce((s, r) => s + r.pax, 0);
  const nbLate = resas.filter(r => !r.ns && !r.placed && (_rushNowMin() - _rushParseTime(r.time)) >= 15).length;
  const nbAlerts = rushAlerts.filter(a => !a.resolved).length;
  const kpiEl = document.getElementById('ro-kpis');
  kpiEl.innerHTML = `
    <div class="ro-kpi"><div class="ro-kpi-val">${placedPax}/${totalPax}</div><div class="ro-kpi-lbl">PAX placés</div></div>
    <div class="ro-kpi ${nbLate > 0 ? 'ro-kpi-warn' : ''}"><div class="ro-kpi-val">${nbLate}</div><div class="ro-kpi-lbl">retards</div></div>
    <div class="ro-kpi ${nbAlerts > 0 ? 'ro-kpi-danger' : ''}"><div class="ro-kpi-val">${nbAlerts}</div><div class="ro-kpi-lbl">alertes</div></div>
    <div class="ro-kpi"><div class="ro-kpi-val">${resas.filter(r => r.ns).length}</div><div class="ro-kpi-lbl">no-shows</div></div>
  `;
  document.getElementById('ro-tab-label').textContent = TAB_LABELS[currentTab];

  // Colonne alertes
  const alertsEl = document.getElementById('ro-alerts');
  const active = rushAlerts.filter(a => !a.resolved);
  const resolved = rushAlerts.filter(a => a.resolved);
  let alertHtml = `<div class="ro-col-title">Alertes actives ${active.length > 0 ? `<span class="ro-badge-count">${active.length}</span>` : ''}</div>`;
  if(active.length === 0){
    alertHtml += `<div class="ro-empty-state">Aucune alerte active.<br>Déclare un incident si besoin.</div>`;
  }
  active.forEach(a => {
    alertHtml += `<div class="ro-alert ro-alert-${a.severity}">
      <div class="ro-alert-msg">${_rushIcon(a.type)} ${a.msg}</div>
      <div class="ro-alert-actions">
        ${a.actions.map((act, i) => `<button class="ro-act-btn" onclick="_rushRunAction(${a.id},${i})">${act.label}</button>`).join('')}
        <button class="ro-act-resolve" onclick="rushResolve(${a.id})">✓ Résolu</button>
      </div>
    </div>`;
  });
  if(resolved.length > 0){
    alertHtml += `<div class="ro-col-title" style="margin-top:16px;opacity:.5">Résolus (${resolved.length})</div>`;
    resolved.forEach(a => {
      alertHtml += `<div class="ro-alert ro-alert-resolved">${_rushIcon(a.type)} ${a.msg}</div>`;
    });
  }
  alertsEl.innerHTML = alertHtml;

  // Colonne plan de salle
  const floorEl = document.getElementById('ro-floor');
  const tMap = {};
  resas.forEach(r => { if(r.placed && r.tableId) tMap[r.tableId] = r; });
  let floorHtml = `<div class="ro-col-title">Plan de salle</div><div class="ro-tbl-grid">`;
  Object.entries(TABLE_DATA).forEach(([idStr, d]) => {
    const tblId = +idStr;
    const r = tMap[tblId];
    const lateR = r && !r.ns && (_rushNowMin() - _rushParseTime(r.time)) >= 15;
    let cls = 'ro-tbl';
    let content = `<div class="ro-tbl-num">${tblId}</div>`;
    if(r){
      cls += lateR ? ' ro-tbl-late' : ' ro-tbl-occ';
      content = `<div class="ro-tbl-num">${tblId}</div><div class="ro-tbl-nm">${r.name.split(' ')[0]}</div><div class="ro-tbl-pax">${r.pax}p</div>`;
    }
    floorHtml += `<div class="${cls}" title="${r ? r.name + ' · ' + r.pax + ' PAX' : 'Libre'}" onclick="_rushTableClick(${tblId})">${content}</div>`;
  });
  floorHtml += `</div>`;
  floorEl.innerHTML = floorHtml;

  // Colonne resas en attente
  const waitingEl = document.getElementById('ro-waiting');
  const unplaced = sortByTime(resas.filter(r => !r.ns && !r.placed));
  let waitHtml = `<div class="ro-col-title">En attente <span class="ro-badge-count">${unplaced.length}</span></div>`;
  if(unplaced.length === 0){
    waitHtml += `<div class="ro-empty-state">Toutes les resas sont placées !</div>`;
  }
  unplaced.forEach(r => {
    const lateMin = _rushNowMin() - _rushParseTime(r.time);
    const isLate = lateMin >= 15;
    waitHtml += `<div class="ro-wait-card ${isLate ? 'ro-wait-late' : ''}">
      <div class="ro-wait-name">${isLate ? '⏰ ' : ''}${r.name}</div>
      <div class="ro-wait-info">${r.pax} PAX · ${r.time}${r.comment ? ' · ' + r.comment : ''}</div>
      <div class="ro-wait-actions">
        <button class="ro-act-btn" onclick="_rushFindTable(${r.id})">Placer</button>
        <button class="ro-act-btn ro-act-ns" onclick="_rushDoNoShow(${r.id})">No-show</button>
      </div>
    </div>`;
  });
  waitingEl.innerHTML = waitHtml;
}

function _rushIcon(type){
  const icons = { auto_late:'⏰', noshow:'🚫', noshow_declared:'🚫', wrong_day:'📅', table_down:'🪑', staff:'👤', delay:'⏰', power:'⚡', info:'ℹ️' };
  return icons[type] || '⚠️';
}

// ── Actions rapides ──────────────────────────
function _rushRunAction(alertId, actionIdx){
  const a = rushAlerts.find(x => x.id === alertId);
  if(a && a.actions[actionIdx]) a.actions[actionIdx].fn();
}

function _rushDoNoShow(resaId){
  const resas = gr();
  const r = resas.find(x => x.id === resaId);
  if(!r) return;
  saveUndo();
  r.ns = true;
  if(r.tableId){ r.placed = false; r.tableId = null; }
  const existing = rushAlerts.find(a => a.resaId === resaId && a.type === 'auto_late');
  if(existing) existing.resolved = true;
  _rushAddAlert({ type: 'noshow_declared', resaId, severity: 'info', msg: `No-show confirmé : ${r.name} · ${r.pax} PAX` });
  render(); renderRushOverlay();
}

function _rushFindTable(resaId){
  const r = gr().find(x => x.id === resaId);
  if(!r){ _rushClosePanel(); return; }
  const occupied = new Set(gr().filter(x => x.placed && x.tableId).map(x => x.tableId));
  const freeTables = Object.entries(TABLE_DATA)
    .map(([id, d]) => ({ id: +id, ...d }))
    .filter(t => !occupied.has(t.id))
    .sort((a, b) => (a.cap||4) - (b.cap||4));

  let html = `<div class="ro-panel-title">Placer ${r.name} (${r.pax} PAX)</div>`;
  html += `<div class="ro-panel-subtitle">Tables libres — tap pour placer</div>`;
  html += `<div class="ro-panel-grid">`;
  freeTables.forEach(t => {
    const ok = (t.cap || 4) >= r.pax;
    html += `<div class="ro-panel-tbl ${ok ? '' : 'ro-panel-tbl-small'}" onclick="${ok ? `_rushPlaceOn(${resaId},${t.id})` : ''}">
      <div class="ro-tbl-num">${t.id}</div>
      <div class="ro-tbl-pax">${t.cap || '?'}p</div>
    </div>`;
  });
  html += `</div><button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`;
  _rushShowPanel(html);
}

function _rushPlaceOn(resaId, tableId){
  const resas = gr();
  saveUndo();
  resas.forEach(x => { if(x.tableId === tableId && x.id !== resaId){ x.placed = false; x.tableId = null; } });
  const r = resas.find(x => x.id === resaId);
  if(r){ r.placed = true; r.tableId = tableId; }
  const alert = rushAlerts.find(a => a.resaId === resaId);
  if(alert) alert.resolved = true;
  _rushClosePanel();
  render(); renderRushOverlay();
}

function _rushTableClick(tableId){
  const r = gr().find(x => x.tableId === tableId && x.placed);
  if(!r) return;
  const lateMin = _rushNowMin() - _rushParseTime(r.time);
  let html = `<div class="ro-panel-title">Table ${tableId} — ${r.name}</div>`;
  html += `<div class="ro-panel-subtitle">${r.pax} PAX · ${r.time}${lateMin > 0 ? ` · ${lateMin} min de retard` : ''}</div>`;
  if(r.comment) html += `<div class="ro-panel-note">${r.comment}</div>`;
  html += `<div class="ro-panel-btns">
    <button class="ro-panel-btn ro-panel-btn-danger" onclick="_rushDoNoShow(${r.id});_rushClosePanel()">🚫 No-show</button>
    <button class="ro-panel-btn" onclick="_rushFreeTable(${tableId})">↩ Libérer</button>
    <button class="ro-panel-btn" onclick="_rushClosePanel()">Fermer</button>
  </div>`;
  _rushShowPanel(html);
}

function _rushFreeTable(tableId){
  const r = gr().find(x => x.tableId === tableId);
  if(r){ saveUndo(); r.placed = false; r.tableId = null; }
  _rushClosePanel();
  render(); renderRushOverlay();
}

// ── Incidents déclarés ────────────────────────
function rushIncident(type){
  if(type === 'noshow'){
    const unplaced = gr().filter(r => !r.ns && !r.placed);
    const placed = gr().filter(r => !r.ns && r.placed);
    const all = [...placed, ...unplaced];
    let html = `<div class="ro-panel-title">🚫 Confirmer un no-show</div>`;
    html += `<div class="ro-panel-subtitle">Sélectionne la réservation</div>`;
    html += `<div class="ro-panel-list">`;
    all.forEach(r => {
      html += `<div class="ro-panel-item" onclick="_rushDoNoShow(${r.id});_rushClosePanel()">
        <div class="ro-pi-name">${r.name}</div>
        <div class="ro-pi-info">${r.pax} PAX · ${r.time}${r.placed ? ` · T${r.tableId}` : ' · non placé'}</div>
      </div>`;
    });
    html += `</div><button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`;
    _rushShowPanel(html);
  }

  else if(type === 'wrong_day'){
    let html = `<div class="ro-panel-title">📅 Client mauvais jour</div>
    <div class="ro-panel-subtitle">Recherche dans toutes les réservations</div>
    <input class="ro-panel-search" id="ro-wd-input" placeholder="Nom du client…" oninput="_rushWrongDaySearch()" autocomplete="off">
    <div id="ro-wd-results"></div>
    <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`;
    _rushShowPanel(html);
    setTimeout(() => document.getElementById('ro-wd-input')?.focus(), 100);
  }

  else if(type === 'table_down'){
    const occupied = new Set(gr().filter(r => r.placed && r.tableId).map(r => r.tableId));
    let html = `<div class="ro-panel-title">🪑 Table hors service</div>`;
    html += `<div class="ro-panel-subtitle">Quelle table est indisponible ?</div>`;
    html += `<div class="ro-panel-grid">`;
    Object.entries(TABLE_DATA).forEach(([idStr]) => {
      const tblId = +idStr;
      const occ = occupied.has(tblId);
      html += `<div class="ro-panel-tbl ${occ ? 'ro-panel-tbl-occ' : ''}" onclick="_rushDeclareTableDown(${tblId})">
        <div class="ro-tbl-num">${tblId}</div>
        ${occ ? `<div class="ro-tbl-pax">occupée</div>` : ''}
      </div>`;
    });
    html += `</div><button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`;
    _rushShowPanel(html);
  }

  else if(type === 'delay'){
    let html = `<div class="ro-panel-title">⏰ Retard général</div>
    <div class="ro-panel-subtitle">Décaler toutes les resas non placées de :</div>
    <div class="ro-panel-btns">
      <button class="ro-panel-btn" onclick="_rushPushAll(10)">+10 min</button>
      <button class="ro-panel-btn" onclick="_rushPushAll(15)">+15 min</button>
      <button class="ro-panel-btn" onclick="_rushPushAll(20)">+20 min</button>
      <button class="ro-panel-btn" onclick="_rushPushAll(30)">+30 min</button>
    </div>
    <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`;
    _rushShowPanel(html);
  }

  else if(type === 'staff_down'){
    _rushAddAlert({ type: 'staff', severity: 'warn', msg: 'Effectif réduit — redistribuer les tables manuellement' });
    renderRushOverlay();
  }

  else if(type === 'power'){
    _rushAddAlert({ type: 'power', severity: 'danger', msg: 'Panne signalée — données locales actives, synchronisation suspendue' });
    renderRushOverlay();
    setTimeout(() => window.print(), 400);
  }
}

function _rushDeclareTableDown(tableId){
  const r = gr().find(x => x.tableId === tableId && x.placed);
  if(r){ saveUndo(); r.placed = false; r.tableId = null; }
  _rushAddAlert({
    type: 'table_down', tableId,
    severity: 'danger',
    msg: `Table ${tableId} hors service${r ? ` — ${r.name} (${r.pax} PAX) à replacer` : ''}`,
    actions: r ? [{ label: 'Trouver table', fn: () => _rushFindTable(r.id) }] : []
  });
  _rushClosePanel();
  render(); renderRushOverlay();
}

function _rushWrongDaySearch(){
  const q = (document.getElementById('ro-wd-input')?.value || '').toLowerCase().trim();
  const res = document.getElementById('ro-wd-results');
  if(!q){ res.innerHTML = ''; return; }
  const all = [...reservations.s1, ...reservations.s2, ...reservations.transats, ...reservations.soir];
  const found = all.filter(r => r.name.toLowerCase().includes(q)).slice(0, 8);
  if(!found.length){ res.innerHTML = `<div class="ro-panel-empty">Aucun résultat</div>`; return; }
  res.innerHTML = found.map(r => `
    <div class="ro-panel-item" onclick="_rushClosePanel();_rushFindTable(${r.id})">
      <div class="ro-pi-name">${r.name}</div>
      <div class="ro-pi-info">${r.pax} PAX · ${r.svc.toUpperCase()} · ${r.time}${r.date ? ' · ' + r.date : ''}</div>
    </div>`).join('');
}

function _rushPushAll(minutes){
  saveUndo();
  gr().filter(r => !r.placed && !r.ns).forEach(r => {
    const min = _rushParseTime(r.time) + minutes;
    const h = Math.floor(min / 60);
    const m = min % 60;
    r.time = `${h}h${String(m).padStart(2, '0')}`;
  });
  _rushAddAlert({ type: 'delay', severity: 'info', msg: `Resas décalées de +${minutes} min` });
  _rushClosePanel();
  render(); renderRushOverlay();
}

// ── Panel interne ───────────────────────────
function _rushShowPanel(html){
  const p = document.getElementById('ro-panel');
  document.getElementById('ro-panel-box').innerHTML = html;
  p.style.display = 'flex';
}
function _rushClosePanel(){
  document.getElementById('ro-panel').style.display = 'none';
}

// ── Tab switching ────────────────────────────
function switchTab(i){
  currentTab = i;
  document.querySelectorAll('.tab').forEach((t, j) => {
    t.classList.remove('on');
    if(j === i) t.classList.add('on');
  });
  document.getElementById('search-input').value = '';
  selectedId = null; fuseMode = false; fuseTargets = [];
  document.getElementById('rp-content').innerHTML = '<div class="rp-empty">Tap sur une réservation</div>';
  document.getElementById('rp-actions').style.display = 'none';
  const btn = document.getElementById('fuse-btn');
  btn.className = 'tbtn tbtn-fuse'; btn.textContent = '⊕ Fusionner'; btn.onclick = toggleFuse;
  if(rushMode){ document.getElementById('ro-tab-label').textContent = TAB_LABELS[i]; renderRushOverlay(); }
  render();
}
