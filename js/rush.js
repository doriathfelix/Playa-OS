// ══════════════════════════════════════════
// ASSISTANT — Drawer latéral en temps réel
// Remplace le mode Rush full-screen
// ══════════════════════════════════════════

// ─── État
let assistAlerts = [];
let assistSeq = 0;
let assistOpen = false;

// ─── Démarrage : scan toutes les 30s
function assistInit(){
  _assistScan();
  setInterval(_assistScan, 30000);
}

// ─── Scan principal : vérifie toutes les conditions automatiques
function _assistScan(){
  _assistAutoResolve();
  _assistCheckLate();
  _assistCheckOverflow();
  _assistCheckOccasion();
  _assistCheckHighchair();
  _assistCheckNoShows();
  _assistCheckVIP();
  _assistCheckDuplicates();
  _updateAssistBadge();
  if(assistOpen) renderAssistDrawer();
}

// ─── Helpers temps
function _assistParseTime(t){
  if(!t) return 0;
  const m = t.match(/(\d{1,2})[h:](\d{0,2})/i);
  if(!m) return 0;
  return parseInt(m[1])*60 + (parseInt(m[2]||'0')||0);
}
function _assistNow(){
  const d = new Date();
  return d.getHours()*60 + d.getMinutes();
}

// ─── Déduplication : crée l'alerte uniquement si key absente
function _assistEnsure(key, opts){
  if(assistAlerts.find(a => a.key === key && !a.resolved)) return;
  assistAlerts.push({
    id: ++assistSeq,
    key,
    type: key.split(':')[0],
    severity: opts.severity || 'warn',
    msg: opts.msg || '',
    resaId: opts.resaId ?? null,
    tableId: opts.tableId ?? null,
    actions: opts.actions || [],
    resolved: false,
    ts: Date.now()
  });
}

// ─── Auto-résolution : retire les alertes dont la condition a disparu
function _assistAutoResolve(){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  assistAlerts.forEach(a => {
    if(a.resolved) return;
    if((a.type === 'late' || a.type === 'noshow_potential') && a.resaId){
      const r = all.find(x => x.id === a.resaId);
      if(!r || r.placed || r.ns) a.resolved = true;
    }
  });
  // Nettoie les résolus de plus de 2 min
  const cutoff = Date.now() - 2*60*1000;
  assistAlerts = assistAlerts.filter(a => !a.resolved || a.ts > cutoff);
}

// ─── Vérifications automatiques ──────────────────────────────

function _assistCheckLate(){
  const now = _assistNow();
  gr().filter(r => !r.placed && !r.ns && r.time).forEach(r => {
    const late = now - _assistParseTime(r.time);
    if(late >= 15 && late < 60){
      _assistEnsure(`late:${r.id}`, {
        severity: late >= 30 ? 'danger' : 'warn',
        msg: `${r.name} (${r.pax} PAX) — ${late} min de retard · ${r.time}`,
        resaId: r.id,
        actions: [
          { label: 'Trouver table', fn: () => { closeAssistant(); _rushFindTable(r.id); }},
          { label: 'No-show', fn: () => _rushDoNoShow(r.id) }
        ]
      });
    }
  });
}

function _assistCheckOverflow(){
  const total = gr().length;
  const placed = gr().filter(r => r.placed).length;
  if(total >= 8 && placed / total < 0.5){
    _assistEnsure('overflow:service', {
      severity: 'warn',
      msg: `${total - placed} resas non placées sur ${total}`,
      actions: [{ label: 'Auto-placer', fn: () => { closeAssistant(); autoPlace(); }}]
    });
  } else {
    assistAlerts.forEach(a => { if(a.key === 'overflow:service') a.resolved = true; });
  }
}

function _assistCheckOccasion(){
  gr().forEach(r => {
    if(r.ns) return;
    const raw = (r.comment||'').toLowerCase() + ' ' + (r.tags||[]).join(' ').toLowerCase();
    if(/anniversaire|birthday/.test(raw))
      _assistEnsure(`occasion:birthday:${r.id}`, {
        severity: 'info',
        msg: `🎂 ${r.name} — anniversaire à signaler en salle`,
        resaId: r.id
      });
    if(/mariage|wedding|fian[cç]ailles/.test(raw))
      _assistEnsure(`occasion:wedding:${r.id}`, {
        severity: 'info',
        msg: `💍 ${r.name} — occasion spéciale à noter`,
        resaId: r.id
      });
  });
}

function _assistCheckHighchair(){
  gr().forEach(r => {
    if(r.ns) return;
    const raw = (r.comment||'').toLowerCase();
    if(/chaise\s*haute|rehausseur|b[ée]b[ée]|poussette|enfant/.test(raw))
      _assistEnsure(`highchair:${r.id}`, {
        severity: 'info',
        msg: `🪑 ${r.name} — chaise haute / bébé à prévoir`,
        resaId: r.id
      });
  });
}

function _assistCheckNoShows(){
  const now = _assistNow();
  gr().filter(r => !r.placed && !r.ns && r.time).forEach(r => {
    const late = now - _assistParseTime(r.time);
    if(late >= 30){
      _assistEnsure(`noshow_potential:${r.id}`, {
        severity: 'danger',
        msg: `⚠ No-show probable : ${r.name} (${r.pax} PAX) — ${late} min d'absence`,
        resaId: r.id,
        actions: [
          { label: 'Confirmer NS', fn: () => _rushDoNoShow(r.id) },
          { label: 'Trouver table', fn: () => { closeAssistant(); _rushFindTable(r.id); }}
        ]
      });
    }
  });
}

function _assistCheckVIP(){
  gr().forEach(r => {
    if(r.ns) return;
    const tags = (r.tags||[]).map(t => t.toLowerCase());
    if(tags.includes('vip') && !r.placed)
      _assistEnsure(`vip:${r.id}`, {
        severity: 'warn',
        msg: `⭐ VIP : ${r.name} (${r.pax} PAX) — table de choix`,
        resaId: r.id,
        actions: [{ label: 'Placer', fn: () => { closeAssistant(); _rushFindTable(r.id); }}]
      });
  });
}

function _assistCheckDuplicates(){
  const resas = gr();
  const seen = {};
  resas.forEach(r => {
    const key = r.name.trim().toLowerCase();
    if(!seen[key]) seen[key] = [];
    seen[key].push(r);
  });
  Object.entries(seen).forEach(([name, group]) => {
    if(group.length > 1)
      _assistEnsure(`duplicate:${name}`, {
        severity: 'warn',
        msg: `⚠ Doublon : "${group[0].name}" apparaît ${group.length}× — vérifier`,
        actions: []
      });
  });
}

// ─── Badge topbar ────────────────────────────────
function _updateAssistBadge(){
  const active = assistAlerts.filter(a => !a.resolved);
  const danger = active.filter(a => a.severity === 'danger').length;
  const warn   = active.filter(a => a.severity === 'warn').length;
  const btn = document.getElementById('assist-btn');
  const cnt = document.getElementById('assist-badge-cnt');
  if(!btn) return;
  btn.classList.remove('ab-red','ab-orange','ab-yellow');
  if(danger)       btn.classList.add('ab-red');
  else if(warn)    btn.classList.add('ab-orange');
  else if(active.length) btn.classList.add('ab-yellow');
  if(cnt){
    cnt.textContent = active.length || '';
    cnt.style.display = active.length ? 'inline-flex' : 'none';
  }
}

// ─── Drawer ──────────────────────────────────────
function toggleAssistant(){
  assistOpen = !assistOpen;
  document.getElementById('assist-drawer').classList.toggle('open', assistOpen);
  document.getElementById('assist-backdrop').classList.toggle('open', assistOpen);
  if(assistOpen) renderAssistDrawer();
}
function closeAssistant(){
  assistOpen = false;
  document.getElementById('assist-drawer').classList.remove('open');
  document.getElementById('assist-backdrop').classList.remove('open');
}

function renderAssistDrawer(){
  const body = document.getElementById('ad-body');
  if(!body) return;
  const active = assistAlerts.filter(a => !a.resolved);
  const resolved = assistAlerts.filter(a => a.resolved).slice(-5);
  if(!active.length && !resolved.length){
    body.innerHTML = `<div class="ad-empty">✅ Tout est OK — aucune alerte active</div>`;
    return;
  }
  const sevOrder = { danger:0, warn:1, info:2 };
  const sorted = [...active].sort((a,b) => (sevOrder[a.severity]??3) - (sevOrder[b.severity]??3));
  body.innerHTML = sorted.map(a => _renderAlert(a, false)).join('') +
    (resolved.length ? `<div class="ad-resolved-title">Résolues</div>` + resolved.map(a => _renderAlert(a, true)).join('') : '');
}

function _renderAlert(a, isResolved){
  const cls = isResolved ? 'ad-alert ad-resolved' : `ad-alert ad-${a.severity}`;
  const acts = !isResolved && a.actions.length
    ? `<div class="ad-actions">${a.actions.map((act,i) =>
        `<button class="ad-act" onclick="assistAlerts.find(x=>x.id===${a.id}).actions[${i}].fn();renderAssistDrawer()">${act.label}</button>`
      ).join('')}<button class="ad-act ad-resolve-btn" onclick="_assistResolve(${a.id})">✓</button></div>`
    : (!isResolved ? `<div class="ad-actions"><button class="ad-act ad-resolve-btn" onclick="_assistResolve(${a.id})">✓ Résolu</button></div>` : '');
  return `<div class="${cls}"><div class="ad-msg">${a.msg}</div>${acts}</div>`;
}

function _assistResolve(id){
  const a = assistAlerts.find(x => x.id === id);
  if(a) a.resolved = true;
  _updateAssistBadge();
  renderAssistDrawer();
}

// ─── Incidents manuels ───────────────────────────
function assistIncident(type){
  if(type === 'noshow'){
    _rushShowPanel(`
      <div class="ro-panel-title">🚫 No-show</div>
      <div class="ro-panel-subtitle">Quelle réservation marquer no-show ?</div>
      <div class="ro-panel-list">${gr().filter(r=>!r.placed&&!r.ns).map(r=>`
        <div class="ro-panel-item" onclick="_rushDoNoShow(${r.id});_rushClosePanel()">
          <div class="ro-pi-name">${r.name}</div>
          <div class="ro-pi-info">${r.pax} PAX · ${r.time}</div>
        </div>`).join('')}</div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'wrong_day'){
    _rushShowPanel(`
      <div class="ro-panel-title">📅 Mauvais jour</div>
      <div class="ro-panel-subtitle">Rechercher la réservation</div>
      <input class="ro-panel-search" id="ro-wd-input" placeholder="Nom client…" oninput="_rushWrongDaySearch()">
      <div id="ro-wd-results"></div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'table_down'){
    const tables = gr().filter(r=>r.placed).map(r=>r.tableId).filter((v,i,a)=>a.indexOf(v)===i);
    _rushShowPanel(`
      <div class="ro-panel-title">🪑 Table HS</div>
      <div class="ro-panel-subtitle">Quelle table mettre hors service ?</div>
      <div class="ro-panel-grid">${tables.map(tid=>`
        <div class="ro-panel-tbl" onclick="_rushDeclareTableDown(${tid});_rushClosePanel()">
          <div style="font-size:18px;font-weight:800">${tid}</div>
        </div>`).join('')}</div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'staff_down'){
    _assistEnsure('staff_down:'+Date.now(), {
      severity: 'warn',
      msg: '👤 Effectif réduit — adaptation du service en cours',
      actions: []
    });
    toast('⚠ Alerte effectif réduit enregistrée');
    _updateAssistBadge(); renderAssistDrawer();
  }
  else if(type === 'delay'){
    _rushShowPanel(`
      <div class="ro-panel-title">⏰ Retard général</div>
      <div class="ro-panel-subtitle">Décaler toutes les resas non placées de :</div>
      <div class="ro-panel-btns">
        <button class="ro-panel-btn" onclick="_rushPushAll(15)">+15 min</button>
        <button class="ro-panel-btn" onclick="_rushPushAll(30)">+30 min</button>
        <button class="ro-panel-btn" onclick="_rushPushAll(45)">+45 min</button>
        <button class="ro-panel-btn ro-panel-btn-danger" onclick="_rushPushAll(60)">+60 min</button>
      </div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'power'){
    _assistEnsure('power:'+Date.now(), {
      severity: 'danger',
      msg: '⚡ Panne signalée — données locales actives, synchronisation suspendue',
      actions: []
    });
    toast('⚡ Mode dégradé activé');
    _updateAssistBadge(); renderAssistDrawer();
    setTimeout(() => window.print(), 400);
  }
}

// ─── Rétro-compatibilité ─────────────────────────
function toggleRushMode(){ toggleAssistant(); }
function renderRushOverlay(){ /* remplacé par renderAssistDrawer */ }

// ─── Helpers placement ───────────────────────────
function _rushDoNoShow(resaId){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const r = all.find(x => x.id === resaId);
  if(!r) return;
  saveUndo();
  if(r.placed){ r.placed = false; r.tableId = null; r.slot = null; }
  r.ns = true;
  assistAlerts.forEach(a => { if(a.resaId === resaId) a.resolved = true; });
  toast(`${r.name} marqué no-show`);
  _updateAssistBadge();
  render();
}

function _rushFindTable(resaId){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const r = all.find(x => x.id === resaId);
  if(!r) return;
  const avail = TABLE_DATA.filter(t => {
    if(t.cap < r.pax) return false;
    if(t.id >= SALON_ID_MIN) return false;
    return !gr().find(x => x.placed && x.tableId === t.id && x.id !== resaId);
  }).sort((a,b) => a.cap - b.cap);
  _rushShowPanel(`
    <div class="ro-panel-title">Placer ${r.name}</div>
    <div class="ro-panel-subtitle">${r.pax} PAX · ${r.time}</div>
    ${!avail.length ? `<div class="ro-panel-note">Aucune table libre avec capacité suffisante</div>` : ''}
    <div class="ro-panel-grid">${avail.map(t => `
      <div class="ro-panel-tbl" onclick="_rushPlaceOn(${resaId},${t.id})">
        <div style="font-size:16px;font-weight:800;color:var(--t1)">${t.id}</div>
        <div style="font-size:9px;color:var(--t3)">${t.cap} PAX</div>
      </div>`).join('')}</div>
    <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
}

function _rushPlaceOn(resaId, tableId){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const r = all.find(x => x.id === resaId);
  if(!r) return;
  saveUndo();
  const prev = gr().find(x => x.placed && x.tableId === tableId && x.id !== resaId);
  if(prev){ prev.placed = false; prev.tableId = null; }
  r.placed = true; r.tableId = tableId;
  assistAlerts.forEach(a => { if(a.resaId === resaId) a.resolved = true; });
  _rushClosePanel();
  toast(`${r.name} → table ${tableId}`);
  _updateAssistBadge();
  render();
}

function _rushDeclareTableDown(tableId){
  const r = gr().find(x => x.tableId === tableId && x.placed);
  if(r){ saveUndo(); r.placed = false; r.tableId = null; }
  _assistEnsure(`table_down:${tableId}`, {
    severity: 'danger',
    msg: `Table ${tableId} hors service${r ? ` — ${r.name} (${r.pax} PAX) à replacer` : ''}`,
    actions: r ? [{ label: 'Trouver table', fn: () => _rushFindTable(r.id) }] : []
  });
  _rushClosePanel();
  _updateAssistBadge();
  render(); if(assistOpen) renderAssistDrawer();
}

function _rushWrongDaySearch(){
  const q = (document.getElementById('ro-wd-input')?.value||'').toLowerCase().trim();
  const res = document.getElementById('ro-wd-results');
  if(!q){ res.innerHTML = ''; return; }
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const found = all.filter(r => r.name.toLowerCase().includes(q)).slice(0, 8);
  if(!found.length){ res.innerHTML = `<div class="ro-panel-empty">Aucun résultat</div>`; return; }
  res.innerHTML = found.map(r => `
    <div class="ro-panel-item" onclick="_rushClosePanel();_rushFindTable(${r.id})">
      <div class="ro-pi-name">${r.name}</div>
      <div class="ro-pi-info">${r.pax} PAX · ${r.svc.toUpperCase()} · ${r.time}${r.date?' · '+r.date:''}</div>
    </div>`).join('');
}

function _rushPushAll(minutes){
  saveUndo();
  gr().filter(r => !r.placed && !r.ns).forEach(r => {
    const min = _assistParseTime(r.time) + minutes;
    r.time = `${Math.floor(min/60)}h${String(min%60).padStart(2,'0')}`;
  });
  _assistEnsure('delay:'+Date.now(), {
    severity: 'info',
    msg: `Resas décalées de +${minutes} min`,
    actions: []
  });
  _rushClosePanel();
  toast(`+${minutes} min appliqué`);
  _updateAssistBadge();
  render(); if(assistOpen) renderAssistDrawer();
}

// ─── Panel incidents (overlay interne) ───────────
function _rushShowPanel(html){
  const p = document.getElementById('ro-panel');
  document.getElementById('ro-panel-box').innerHTML = html;
  p.style.display = 'flex';
}
function _rushClosePanel(){
  document.getElementById('ro-panel').style.display = 'none';
}

// ─── Tab switching ────────────────────────────────
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
  render();
}
