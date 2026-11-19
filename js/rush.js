// ══════════════════════════════════════════
// ASSISTANT — Centre de commandement live
// ══════════════════════════════════════════

// ─── État
let assistAlerts = [];
let assistSeq = 0;
let assistOpen = false;

// ─── Démarrage
function assistInit(){
  _assistScan();
  setInterval(_assistScan, 30000);
}

// ─── Scan principal (toutes les 30s + à chaque render)
function _assistScan(){
  _assistAutoResolve();
  _assistCheckLate();
  _assistCheckOverflow();
  _assistCheckOccasion();
  _assistCheckHighchair();
  _assistCheckAllergenes();
  _assistCheckRegimes();
  _assistCheckPMR();
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

// ─── Déduplication
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

// ─── Auto-résolution
function _assistAutoResolve(){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  assistAlerts.forEach(a => {
    if(a.resolved) return;
    if((a.type === 'late' || a.type === 'noshow_potential') && a.resaId){
      const r = all.find(x => x.id === a.resaId);
      if(!r || r.placed || r.ns) a.resolved = true;
    }
  });
  const cutoff = Date.now() - 2*60*1000;
  assistAlerts = assistAlerts.filter(a => !a.resolved || a.ts > cutoff);
}

// ─── Patterns commentaires ───────────────────────────

const _ALLERGEN_PATTERNS = [
  [/allergi|allergique/,                           null],
  [/arachide|cacahu[eè]te|peanut/,                 'Arachides'],
  [/noix|noisette|amande|pistache|cajou|p[eé]can/, 'Fruits secs'],
  [/gluten|bl[eé]|orge|seigle|avoine|[eé]peautre/, 'Gluten'],
  [/lactose|intolérant.*lait/,                     'Lactose'],
  [/crustac[eé]|crevette|homard|crabe|langouste/,  'Crustacés'],
  [/fruits de mer|huître|moule|cal[ae]mar/,        'Fruits de mer'],
  [/poisson\b/,                                    'Poisson'],
  [/soja\b|soy\b/,                                 'Soja'],
  [/[sé]same|tahini/,                              'Sésame'],
  [/c[eé]leri\b/,                                  'Céleri'],
  [/moutarde/,                                     'Moutarde'],
  [/sulfite|soufre/,                               'Sulfites'],
];

// Régimes alimentaires (sévérité info, pas danger)
const _REGIME_PATTERNS = [
  [/v[eé]g[eé]tarien(?:ne)?/i,                 'Végétarien'],
  [/v[eé]g[eé]talien|vegan|végan/i,            'Végan'],
  [/halal/i,                                    'Halal'],
  [/casher|kosher/i,                            'Halal'],     // traité comme Halal
  [/sans[\s\-]?porc|no[\s]?pork/i,             'Sans porc'],
  [/sans[\s\-]?alcool|no[\s]?alcohol/i,        'Sans alcool'],
  [/flexitarien/i,                              'Flexitarien'],
  [/pescatarien|pescetarien/i,                  'Pescatarien'],
  [/sans\s+(viande|meat)/i,                     'Végétarien'],
  [/régime\s+(végé|veggie|veg\b)/i,             'Végétarien'],
];

const _PMR_PATTERN   = /fauteuil|handicap|pmr|mobilit[eé] r[eé]duite|canne|canne b/i;
const _OCCASION_EXT  = [
  [/anniversaire|birthday/,          '🎂 Anniversaire'],
  [/mariage|wedding/,                '💍 Mariage'],
  [/fian[cç]aille/,                  '💍 Fiançailles'],
  [/evjf|enterrement.*vie.*jeune/,   '🎉 EVJF'],
  [/evg\b|enterrement.*vie.*gar/,    '🎉 EVG'],
  [/st.valentin|saint.valentin/,     '❤️ St-Valentin'],
  [/surprise/,                       '🎊 Surprise'],
  [/fête|f[eê]te\b/,                 '🥳 Fête'],
  [/anniversaire.*entreprise|séminaire/, '🏢 Événement pro'],
];

// ─── Checks automatiques ─────────────────────────────

function _assistCheckLate(){
  const now = _assistNow();
  gr().filter(r => !r.placed && !r.ns && r.time).forEach(r => {
    const late = now - _assistParseTime(r.time);
    if(late >= 15 && late < 60){
      _assistEnsure(`late:${r.id}`, {
        severity: late >= 30 ? 'danger' : 'warn',
        msg: `${r.name} · ${r.pax} PAX · +${late}min`,
        resaId: r.id,
        actions: [
          { label: '→ Table', fn: () => { closeAssistant(); _rushFindTable(r.id); }},
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
    _OCCASION_EXT.forEach(([re, label]) => {
      if(re.test(raw))
        _assistEnsure(`occasion:${label}:${r.id}`, {
          severity: 'info',
          msg: `${label} · ${r.name}`,
          resaId: r.id
        });
    });
  });
}

function _assistCheckHighchair(){
  gr().forEach(r => {
    if(r.ns) return;
    if(/chaise\s*haute|rehausseur|si[eè]ge\s*b[eé]b[eé]|b[ée]b[ée]|poussette|nourrisson|enfant\s*en\s*bas/.test((r.comment||'').toLowerCase()))
      _assistEnsure(`highchair:${r.id}`, {
        severity: 'info',
        msg: `🪑 ${r.name} — chaise haute`,
        resaId: r.id
      });
  });
}

function _assistCheckAllergenes(){
  gr().forEach(r => {
    if(r.ns) return;
    const raw = (r.comment||'').toLowerCase();
    if(!raw) return;
    const detectedLabels = [];
    _ALLERGEN_PATTERNS.forEach(([re, label]) => {
      if(!re.test(raw)) return;
      const name = label || _extractAllergenName(raw);
      if(!name) return;
      if(!detectedLabels.includes(name)) detectedLabels.push(name);
      _assistEnsure(`allergen:${name}:${r.id}`, {
        severity: 'danger',
        msg: `🚨 Allergie · ${r.name} — ${name}`,
        resaId: r.id,
        allergenLabels: detectedLabels,
        actions: [{
          label: '🍽 Plats OK',
          fn: () => _assistShowMenuRecos(r, detectedLabels)
        }]
      });
    });
  });
}

function _extractAllergenName(raw){
  const m = raw.match(/allergi[a-zéàèê]*\s+(?:[àa]\s+)?(?:la\s+|au\s+|aux\s+|l[e']?\s+)?([a-zéàèêïîôûù\s]{2,20})/);
  if(m) return m[1].trim().replace(/\s+et\s+.*/, '');
  const m2 = raw.match(/sans\s+([a-zéàèêïîôûù]{3,15})/);
  if(m2) return m2[1];
  return null;
}

// Panneau unifié allergènes + régimes
function _assistShowDishRecos(resa, allergenLabels, regimeLabels){
  if(typeof getCompatibleDishes !== 'function'){ toast('Menu non configuré'); return; }
  allergenLabels = allergenLabels || [];
  regimeLabels   = regimeLabels   || [];
  const { safe, adaptable } = getCompatibleDishes(allergenLabels, regimeLabels);

  const constraints = [
    ...allergenLabels.map(l => `<span class="mr-tag mr-tag-allergen">🚨 ${l}</span>`),
    ...regimeLabels.map(l  => `<span class="mr-tag mr-tag-regime">🌿 ${l}</span>`)
  ].join('');

  const renderDishRow = (d) =>
    `<div class="mr-dish">
      <span class="mr-cat">${d.cat}</span>
      <span class="mr-name">${d.name}</span>
    </div>`;

  const renderAdaptRow = ({dish, remove}) =>
    `<div class="mr-dish mr-adapt">
      <span class="mr-cat">${dish.cat}</span>
      <span class="mr-name">${dish.name}</span>
      <span class="mr-remove">sans ${remove.join(', ')}</span>
    </div>`;

  const safeHtml = safe.length
    ? `<div class="mr-section-title">✓ Plats compatibles (${safe.length})</div>` +
      safe.map(renderDishRow).join('')
    : '';

  const adaptHtml = adaptable.length
    ? `<div class="mr-section-title mr-adapt-title">✦ Si adaptés (${adaptable.length})</div>` +
      adaptable.map(renderAdaptRow).join('')
    : '';

  const emptyHtml = !safe.length && !adaptable.length
    ? `<div class="mr-empty">Aucun plat compatible — à adapter avec le chef.</div>` : '';

  _rushShowPanel(`
    <div class="ro-panel-title">🍽 Plats recommandés — ${resa.name||''}</div>
    <div class="mr-constraints">${constraints}</div>
    <div class="mr-list">${safeHtml}${adaptHtml}${emptyHtml}</div>
    <div class="ro-panel-note" style="margin-top:8px">Carte éditable dans <code>js/menu.js</code></div>
    <button class="ro-panel-cancel" onclick="_rushClosePanel()">Fermer</button>`);
}

// Alias legacy pour alertes allergie existantes
function _assistShowMenuRecos(resa, allergenLabels){
  _assistShowDishRecos(resa, allergenLabels, []);
}

function _assistCheckPMR(){
  gr().forEach(r => {
    if(r.ns) return;
    if(_PMR_PATTERN.test(r.comment||''))
      _assistEnsure(`pmr:${r.id}`, {
        severity: 'warn',
        msg: `♿ ${r.name} — mobilité réduite · placement adapté`,
        resaId: r.id,
        actions: []
      });
  });
}

function _assistCheckRegimes(){
  gr().forEach(r => {
    if(r.ns) return;
    const raw = (r.comment||'').toLowerCase() + ' ' + (r.tags||[]).join(' ').toLowerCase();
    const detected = [];
    _REGIME_PATTERNS.forEach(([re, label]) => {
      if(!re.test(raw)) return;
      if(!detected.includes(label)) detected.push(label);
    });
    if(!detected.length) return;
    // Une alerte par régime + bouton recos combinées
    detected.forEach(label => {
      _assistEnsure(`regime:${label}:${r.id}`, {
        severity: 'info',
        msg: `🌿 ${r.name} — ${label}`,
        resaId: r.id,
        actions: [{
          label: '🍽 Plats OK',
          fn: () => {
            const allergenLabels = _getResaAllergenLabels(r);
            _assistShowDishRecos(r, allergenLabels, detected);
          }
        }]
      });
    });
  });
}

function _getResaAllergenLabels(r){
  const raw = (r.comment||'').toLowerCase();
  const labels = [];
  _ALLERGEN_PATTERNS.forEach(([re, label]) => {
    if(!re.test(raw)) return;
    const name = label || _extractAllergenName(raw);
    if(name && !labels.includes(name)) labels.push(name);
  });
  return labels;
}

function _assistCheckNoShows(){
  const now = _assistNow();
  gr().filter(r => !r.placed && !r.ns && r.time).forEach(r => {
    const late = now - _assistParseTime(r.time);
    if(late >= 30)
      _assistEnsure(`noshow_potential:${r.id}`, {
        severity: 'danger',
        msg: `${r.name} · +${late}min · no-show probable`,
        resaId: r.id,
        actions: [
          { label: 'Confirmer NS', fn: () => _rushDoNoShow(r.id) },
          { label: '→ Table', fn: () => { closeAssistant(); _rushFindTable(r.id); }}
        ]
      });
  });
}

function _assistCheckVIP(){
  gr().forEach(r => {
    if(r.ns) return;
    if((r.tags||[]).map(t=>t.toLowerCase()).includes('vip') && !r.placed)
      _assistEnsure(`vip:${r.id}`, {
        severity: 'warn',
        msg: `⭐ VIP : ${r.name} · ${r.pax} PAX`,
        resaId: r.id,
        actions: [{ label: '→ Placer', fn: () => { closeAssistant(); _rushFindTable(r.id); }}]
      });
  });
}

function _assistCheckDuplicates(){
  const seen = {};
  gr().forEach(r => {
    const key = r.name.trim().toLowerCase();
    if(!seen[key]) seen[key] = [];
    seen[key].push(r);
  });
  Object.entries(seen).forEach(([name, group]) => {
    if(group.length > 1)
      _assistEnsure(`duplicate:${name}`, {
        severity: 'warn',
        msg: `⚠ Doublon : "${group[0].name}" ×${group.length}`,
        actions: []
      });
  });
}

// ─── Badge topbar ─────────────────────────────────────
function _updateAssistBadge(){
  const active = assistAlerts.filter(a => !a.resolved);
  const danger = active.filter(a => a.severity === 'danger').length;
  const warn   = active.filter(a => a.severity === 'warn').length;
  const btn = document.getElementById('assist-btn');
  const cnt = document.getElementById('assist-badge-cnt');
  if(!btn) return;
  btn.classList.remove('ab-red','ab-orange','ab-yellow');
  if(danger)            btn.classList.add('ab-red');
  else if(warn)         btn.classList.add('ab-orange');
  else if(active.length)btn.classList.add('ab-yellow');
  if(cnt){
    cnt.textContent = active.length || '';
    cnt.style.display = active.length ? 'inline-flex' : 'none';
  }
}

// ─── Drawer open/close ────────────────────────────────
function toggleAssistant(){
  assistOpen = !assistOpen;
  document.getElementById('assist-drawer').classList.toggle('open', assistOpen);
  document.getElementById('assist-backdrop').classList.toggle('open', assistOpen);
  if(assistOpen){
    renderAssistDrawer();
    setTimeout(() => document.getElementById('assist-search')?.focus(), 50);
  }
}
function closeAssistant(){
  assistOpen = false;
  document.getElementById('assist-drawer').classList.remove('open');
  document.getElementById('assist-backdrop').classList.remove('open');
}

// ─── Rendu principal du drawer ────────────────────────
function renderAssistDrawer(){
  const body = document.getElementById('ad-body');
  if(!body) return;
  const q = (document.getElementById('assist-search')?.value || '').trim().toLowerCase();
  if(q){
    body.innerHTML = _renderAssistSearch(q);
  } else {
    body.innerHTML = `
      <div class="ad-cols">
        <div class="ad-col-left">${_renderAssistAlertsList()}</div>
        <div class="ad-col-right">${_renderAssistFloor()}</div>
      </div>`;
  }
}

// ─── Recherche intelligente ───────────────────────────
function _renderAssistSearch(q){
  const resas = gr();
  const now = _assistNow();
  let results = [];
  let header = '';

  // ── Actions directes ──────────────────────────────────
  // "retard 15" / "push 30" → décaler toutes les resas
  const pushMatch = q.match(/(?:retard|push|d[eé]caler?)\s+(\d+)/);
  if(pushMatch){
    const mins = parseInt(pushMatch[1]);
    return `<div class="arc-action-banner">
      <div class="arc-action-title">Décaler toutes les resas non placées de +${mins} min ?</div>
      <div class="arc-acts">
        <button class="arc-btn arc-btn-primary" onclick="_rushPushAll(${mins});document.getElementById('assist-search').value='';renderAssistDrawer()">✓ Appliquer +${mins}min</button>
        <button class="arc-btn" onclick="document.getElementById('assist-search').value='';renderAssistDrawer()">Annuler</button>
      </div>
    </div>`;
  }

  // "table 5 libre" / "libérer table 5" → libérer table
  const freeMatch = q.match(/(?:lib[eé]rer?|free|libère)\s+(?:table\s*)?(\d+)/);
  if(freeMatch){
    const tid = parseInt(freeMatch[1]);
    const r = gr().find(x => x.placed && x.tableId === tid);
    if(!r) return `<div class="arc-action-banner"><div class="arc-action-title">Table ${tid} déjà libre ✓</div></div>`;
    return `<div class="arc-action-banner">
      <div class="arc-action-title">Libérer table ${tid} — ${r.name} ?</div>
      <div class="arc-acts">
        <button class="arc-btn arc-btn-ns" onclick="_rushDoNoShow(${r.id});document.getElementById('assist-search').value='';renderAssistDrawer()">Libérer (no-show)</button>
        <button class="arc-btn" onclick="document.getElementById('assist-search').value='';renderAssistDrawer()">Annuler</button>
      </div>
    </div>`;
  }

  // ── Filtres par catégorie ─────────────────────────────
  if(/retard|late/.test(q)){
    results = resas.filter(r => !r.placed && !r.ns && (now - _assistParseTime(r.time)) >= 10)
      .sort((a,b) => _assistParseTime(a.time) - _assistParseTime(b.time));
    header = `Retards (${results.length})`;
  } else if(/vip/.test(q)){
    results = resas.filter(r => (r.tags||[]).map(t=>t.toLowerCase()).includes('vip'));
    header = `VIP (${results.length})`;
  } else if(/libre|free/.test(q)){
    return _renderFreeTablesSearch();
  } else if(/attente|non.plac/.test(q)){
    results = resas.filter(r => !r.placed && !r.ns);
    header = `Non placées (${results.length})`;
  } else if(/allergi|allergi[eè]|intol[eé]r/.test(q)){
    results = resas.filter(r => _ALLERGEN_PATTERNS.some(([re]) => re.test((r.comment||'').toLowerCase())));
    header = `🚨 Allergies — ${results.length} resa${results.length>1?'s':''}`;
    if(!results.length)
      return `<div class="ad-empty">Aucune allergie détectée dans les commentaires</div>`;
    return `<div class="arc-results-header">${header}</div>` +
      results.map(r => _renderResaCardWithRecos(r, now)).join('');
  } else if(/v[eé]g[eé]|vegan|halal|casher|sans[\s-]?porc|sans[\s-]?alcool|pescatari|flexitari|r[eé]gime/.test(q)){
    // Régimes alimentaires
    const matchedRegimes = [];
    _REGIME_PATTERNS.forEach(([re, label]) => {
      if(re.test(q) && !matchedRegimes.includes(label)) matchedRegimes.push(label);
    });
    const regimesToTest = matchedRegimes.length ? matchedRegimes : REGIME_TYPES;
    results = resas.filter(r => {
      const raw = (r.comment||'').toLowerCase() + ' ' + (r.tags||[]).join(' ');
      return _REGIME_PATTERNS.some(([re]) => re.test(raw));
    });
    if(matchedRegimes.length) results = results.filter(r => {
      const raw = (r.comment||'').toLowerCase() + ' ' + (r.tags||[]).join(' ');
      return matchedRegimes.some(label => _REGIME_PATTERNS.some(([re, l]) => l === label && re.test(raw)));
    });
    header = `🌿 Régimes (${results.length})`;
    if(!results.length)
      return `<div class="ad-empty">Aucun régime alimentaire détecté dans les commentaires</div>`;
    return `<div class="arc-results-header">${header}</div>` +
      results.map(r => _renderResaCardWithRecos(r, now)).join('');
  } else if(/pmr|fauteuil|handicap|mobilit/.test(q)){
    results = resas.filter(r => _PMR_PATTERN.test(r.comment||''));
    header = `♿ PMR (${results.length})`;
  } else if(/chaise|b[eé]b[eé]|enfant|poussette/.test(q)){
    results = resas.filter(r => /chaise\s*haute|rehausseur|si[eè]ge\s*b[eé]b[eé]|b[ée]b[ée]|poussette|nourrisson/.test((r.comment||'').toLowerCase()));
    header = `🪑 Chaises hautes (${results.length})`;
  } else if(/occasion|anniversaire|mariage|evjf|evg|surprise|f[eê]te/.test(q)){
    results = resas.filter(r => _OCCASION_EXT.some(([re]) => re.test((r.comment||'').toLowerCase() + ' ' + (r.tags||[]).join(' '))));
    header = `🎉 Occasions (${results.length})`;
  } else if(/table\s*(\d+)/.test(q)){
    const tid = parseInt(q.match(/table\s*(\d+)/)[1]);
    return _renderTableSearch(tid);
  } else if(/^\d+$/.test(q) && parseInt(q) <= 30){
    return _renderTableSearch(parseInt(q));
  } else {
    // Recherche par nom
    results = resas.filter(r => r.name.toLowerCase().includes(q));
  }

  if(!results.length)
    return `<div class="ad-empty">Aucun résultat pour "${q}"<br><small style="color:var(--t3);font-size:11px;margin-top:6px;display:block">Essayez : retard · vip · libre · allergi · pmr · chaise · occasion · table 5 · "retard 20"</small></div>`;

  const headerHtml = header ? `<div class="arc-results-header">${header}</div>` : '';
  return headerHtml + results.map(r => _renderResaCard(r, now)).join('');
}

function _renderResaCard(r, now){
  const late = now - _assistParseTime(r.time);
  const status = r.placed ? `✓ Table ${r.tableId}`
    : r.ns ? '✗ No-show'
    : late >= 15 ? `⚠ +${late}min`
    : `${r.time}`;
  const cls = r.placed ? 'arc-ok' : r.ns ? 'arc-ns' : late >= 30 ? 'arc-danger' : late >= 15 ? 'arc-warn' : '';
  const tags = (r.tags||[]).map(t=>`<span class="arc-tag">${t}</span>`).join('');
  const acts = !r.ns && !r.placed ? `
    <div class="arc-acts">
      <button class="arc-btn arc-btn-primary" onclick="closeAssistant();_rushFindTable(${r.id})">→ Trouver table</button>
      <button class="arc-btn arc-btn-ns" onclick="_rushDoNoShow(${r.id})">No-show</button>
    </div>` : r.placed ? `
    <div class="arc-acts">
      <button class="arc-btn" onclick="closeAssistant();_rushFindTable(${r.id})">↔ Changer table</button>
      <button class="arc-btn arc-btn-ns" onclick="_rushDoNoShow(${r.id})">Libérer</button>
    </div>` : '';
  return `<div class="arc-card ${cls}">
    <div class="arc-top">
      <span class="arc-name">${r.name}</span>
      <span class="arc-pax">${r.pax} PAX</span>
      <span class="arc-status">${status}</span>
    </div>
    ${r.comment ? `<div class="arc-comment">${r.comment}</div>` : ''}
    ${tags ? `<div class="arc-tags">${tags}</div>` : ''}
    ${acts}
  </div>`;
}

function _renderResaCardWithRecos(r, now){
  const base = _renderResaCard(r, now);
  if(typeof getCompatibleDishes !== 'function') return base;

  const raw = (r.comment||'').toLowerCase() + ' ' + (r.tags||[]).join(' ').toLowerCase();

  const allergenLabels = _getResaAllergenLabels(r);
  const regimeLabels = [];
  _REGIME_PATTERNS.forEach(([re, label]) => {
    if(re.test(raw) && !regimeLabels.includes(label)) regimeLabels.push(label);
  });

  if(!allergenLabels.length && !regimeLabels.length) return base;

  const { safe, adaptable } = getCompatibleDishes(allergenLabels, regimeLabels);
  const topSafe  = safe.slice(0, 3);
  const topAdapt = adaptable.slice(0, 2);

  const tags = [
    ...allergenLabels.map(l => `<span class="arc-reco-tag arc-reco-tag-al">🚨 ${l}</span>`),
    ...regimeLabels.map(l  => `<span class="arc-reco-tag arc-reco-tag-rg">🌿 ${l}</span>`)
  ].join('');

  const resaRef = `gr().find(x=>x.id===${r.id})||{}`;
  const recoHtml = `
    <div class="arc-recos">
      <div class="arc-reco-tags">${tags}</div>
      <div class="arc-reco-label">🍽 Plats compatibles :</div>
      ${topSafe.map(d => `<span class="arc-reco-chip arc-reco-ok">${d.name}</span>`).join('')}
      ${topAdapt.map(({dish,remove}) => `<span class="arc-reco-chip arc-reco-adapt" title="sans ${remove.join(', ')}">${dish.name} ✦</span>`).join('')}
      ${!topSafe.length && !topAdapt.length ? `<span class="arc-reco-chip arc-reco-none">Aucun plat compatible</span>` : ''}
      <button class="arc-reco-more" onclick="_assistShowDishRecos(${resaRef},${JSON.stringify(allergenLabels)},${JSON.stringify(regimeLabels)})">Voir tous →</button>
    </div>`;

  return base.replace('</div>', recoHtml + '</div>');
}

function _renderFreeTablesSearch(){
  const placed = new Set(gr().filter(r=>r.placed).map(r=>r.tableId));
  const free = Object.entries(TABLE_DATA)
    .map(([id,d]) => ({id:+id,...d}))
    .filter(t => t.id < SALON_ID_MIN && !placed.has(t.id))
    .sort((a,b) => a.hi - b.hi);
  if(!free.length) return `<div class="ad-empty">Aucune table libre</div>`;
  return `<div class="arc-free-title">Tables libres (${free.length})</div>` +
    `<div class="arc-free-grid">${free.map(t => `
      <div class="arc-free-tbl" onclick="closeAssistant()">
        <div class="arc-free-num">${t.id}</div>
        <div class="arc-free-cap">${t.hi} PAX</div>
        ${t.p ? '<div class="arc-free-tag">⛅</div>' : ''}
      </div>`).join('')}</div>`;
}

function _renderTableSearch(tableId){
  const t = TABLE_DATA[tableId];
  if(!t) return `<div class="ad-empty">Table ${tableId} inconnue</div>`;
  const r = gr().find(x => x.placed && x.tableId === tableId);
  if(!r) return `<div class="arc-card arc-ok">
    <div class="arc-top"><span class="arc-name">Table ${tableId}</span><span class="arc-pax">${t.hi} PAX max</span><span class="arc-status">Libre ✓</span></div>
  </div>`;
  return _renderResaCard(r, _assistNow());
}

// ─── Liste alertes ────────────────────────────────────
function _renderAssistAlertsList(){
  const active = assistAlerts.filter(a => !a.resolved);
  if(!active.length)
    return `<div class="ad-col-title">Alertes</div><div class="ad-empty-sm">✅ Tout est OK</div>`;
  const sevOrder = { danger:0, warn:1, info:2 };
  const sorted = [...active].sort((a,b) => (sevOrder[a.severity]??3)-(sevOrder[b.severity]??3));
  return `<div class="ad-col-title">Alertes <span class="ad-cnt-badge">${active.length}</span></div>` +
    sorted.map(a => {
      const cls = `ad-alert ad-${a.severity}`;
      const acts = a.actions.length
        ? `<div class="ad-actions">${a.actions.map((act,i)=>
            `<button class="ad-act" onclick="assistAlerts.find(x=>x.id===${a.id}).actions[${i}].fn();renderAssistDrawer()">${act.label}</button>`
          ).join('')}<button class="ad-act ad-resolve-btn" onclick="_assistResolve(${a.id})">✓</button></div>`
        : `<div class="ad-actions"><button class="ad-act ad-resolve-btn" onclick="_assistResolve(${a.id})">✓ OK</button></div>`;
      return `<div class="${cls}"><div class="ad-msg">${a.msg}</div>${acts}</div>`;
    }).join('');
}

function _assistResolve(id){
  const a = assistAlerts.find(x => x.id === id);
  if(a) a.resolved = true;
  _updateAssistBadge();
  renderAssistDrawer();
}

// ─── Plan de salle compact ────────────────────────────
function _renderAssistFloor(){
  if(currentTab === 2) return _renderAssistTransatsSummary();
  const resas = gr();
  const now = _assistNow();
  const placed = {};
  resas.filter(r => r.placed && r.tableId).forEach(r => { placed[r.tableId] = r; });

  const tableIds = Object.keys(TABLE_DATA).map(Number).sort((a,b) => TABLE_DATA[a].prio - TABLE_DATA[b].prio);
  const terrasse = tableIds.filter(id => TABLE_DATA[id].p && id < SALON_ID_MIN);
  const salle    = tableIds.filter(id => !TABLE_DATA[id].p && id < SALON_ID_MIN);
  const salons   = tableIds.filter(id => id >= SALON_ID_MIN);

  const renderGroup = (ids, label) => {
    if(!ids.length) return '';
    return `<div class="af-group-label">${label}</div>
      <div class="af-grid">${ids.map(id => _renderFloorTile(id, placed[id], now)).join('')}</div>`;
  };

  const unplaced = resas.filter(r => !r.placed && !r.ns);
  const pax = resas.filter(r=>r.placed).reduce((s,r)=>s+r.pax,0);

  return `
    <div class="ad-col-title">Plan de salle · <span style="font-weight:600;color:var(--t2)">${pax} PAX · ${Object.keys(placed).length} tables</span></div>
    <div class="af-legend">
      <span class="af-leg af-leg-free">Libre</span>
      <span class="af-leg af-leg-occ">Occupée</span>
      <span class="af-leg af-leg-late">Retard</span>
    </div>
    ${renderGroup(terrasse, '⛅ Terrasse')}
    ${renderGroup(salle, '🏠 Salle')}
    ${renderGroup(salons, '🚪 Salons')}
    ${unplaced.length ? `<div class="af-unplaced-bar">
      <span class="af-unplaced-cnt">${unplaced.length} non placée${unplaced.length>1?'s':''}</span>
      <button class="af-autoplace-btn" onclick="closeAssistant();autoPlace()">✦ Auto-placer</button>
    </div>` : ''}`;
}

function _renderFloorTile(tableId, resa, now){
  const t = TABLE_DATA[tableId];
  const lbl = t.lbl || String(tableId);
  if(!resa){
    return `<div class="af-tbl af-tbl-free" onclick="assistFloorClick(${tableId})" title="Table ${tableId} — libre">
      <span class="af-tbl-num">${lbl}</span>
      <span class="af-tbl-cap">${t.hi}</span>
    </div>`;
  }
  const late = now - _assistParseTime(resa.time);
  const cls = late >= 20 ? 'af-tbl-late' : 'af-tbl-occ';
  const tags = (resa.tags||[]).map(t=>t.toLowerCase());
  const isVip = tags.includes('vip');
  return `<div class="af-tbl ${cls}${isVip?' af-tbl-vip':''}" onclick="assistFloorClick(${tableId})" title="${resa.name} · ${resa.pax} PAX${late>=20?' · +'+late+'min':''}">
    <span class="af-tbl-num">${lbl}</span>
    <span class="af-tbl-name">${resa.name.split(' ')[0]}</span>
    <span class="af-tbl-pax">${resa.pax}p</span>
    ${isVip ? '<span class="af-tbl-vip-dot">⭐</span>' : ''}
  </div>`;
}

function assistFloorClick(tableId){
  const resa = gr().find(r => r.placed && r.tableId === tableId);
  if(!resa){
    // Table libre — rien à faire, ou on pourrait proposer d'y placer une resa
    toast(`Table ${tableId} libre · ${TABLE_DATA[tableId]?.hi || '?'} PAX max`);
    return;
  }
  _rushShowPanel(`
    <div class="ro-panel-title">Table ${tableId} — ${resa.name}</div>
    <div class="ro-panel-subtitle">${resa.pax} PAX · ${resa.time}</div>
    ${resa.comment ? `<div class="ro-panel-note">${resa.comment}</div>` : ''}
    <div class="ro-panel-btns">
      <button class="ro-panel-btn" onclick="_rushFindTable(${resa.id});_rushClosePanel()">↔ Changer de table</button>
      <button class="ro-panel-btn ro-panel-btn-danger" onclick="_rushDoNoShow(${resa.id});_rushClosePanel()">× No-show / Libérer</button>
    </div>
    <button class="ro-panel-cancel" onclick="_rushClosePanel()">Fermer</button>`);
}

function _renderAssistTransatsSummary(){
  const resas = reservations.transats;
  const placed = resas.filter(r=>r.placed).length;
  const pax = resas.filter(r=>r.placed).reduce((s,r)=>s+r.pax,0);
  return `<div class="ad-col-title">Transats · ${placed} resas · ${pax} PAX</div>
    <div class="ad-empty-sm">Vue transats — plan détaillé dans l'onglet ⛱</div>`;
}

// ─── Incidents manuels ─────────────────────────────────
function assistIncident(type){
  if(type === 'noshow'){
    _rushShowPanel(`
      <div class="ro-panel-title">🚫 No-show</div>
      <div class="ro-panel-subtitle">Quelle réservation ?</div>
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
      <input class="ro-panel-search" id="ro-wd-input" placeholder="Nom client…" oninput="_rushWrongDaySearch()">
      <div id="ro-wd-results"></div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'table_down'){
    const tables = gr().filter(r=>r.placed).map(r=>r.tableId).filter((v,i,a)=>a.indexOf(v)===i);
    _rushShowPanel(`
      <div class="ro-panel-title">🪑 Table HS</div>
      <div class="ro-panel-subtitle">Quelle table ?</div>
      <div class="ro-panel-grid">${tables.map(tid=>`
        <div class="ro-panel-tbl" onclick="_rushDeclareTableDown(${tid});_rushClosePanel()">
          <div style="font-size:18px;font-weight:800">${tid}</div>
        </div>`).join('')}</div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'staff_down'){
    _assistEnsure('staff_down:'+Date.now(), { severity:'warn', msg:'👤 Effectif réduit', actions:[] });
    toast('⚠ Effectif réduit enregistré');
    _updateAssistBadge(); renderAssistDrawer();
  }
  else if(type === 'delay'){
    _rushShowPanel(`
      <div class="ro-panel-title">⏰ Retard général</div>
      <div class="ro-panel-subtitle">Décaler les resas non placées de :</div>
      <div class="ro-panel-btns">
        <button class="ro-panel-btn" onclick="_rushPushAll(15)">+15 min</button>
        <button class="ro-panel-btn" onclick="_rushPushAll(30)">+30 min</button>
        <button class="ro-panel-btn" onclick="_rushPushAll(45)">+45 min</button>
        <button class="ro-panel-btn ro-panel-btn-danger" onclick="_rushPushAll(60)">+60 min</button>
      </div>
      <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
  }
  else if(type === 'power'){
    _assistEnsure('power:'+Date.now(), { severity:'danger', msg:'⚡ Panne — données locales actives', actions:[] });
    toast('⚡ Mode dégradé activé');
    _updateAssistBadge(); renderAssistDrawer();
    setTimeout(() => window.print(), 400);
  }
}

// ─── Rétro-compatibilité
function toggleRushMode(){ toggleAssistant(); }
function renderRushOverlay(){ /* remplacé */ }

// ─── Helpers placement ─────────────────────────────────
function _rushDoNoShow(resaId){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const r = all.find(x => x.id === resaId);
  if(!r) return;
  saveUndo();
  if(r.placed){ r.placed=false; r.tableId=null; r.slot=null; }
  r.ns = true;
  assistAlerts.forEach(a => { if(a.resaId===resaId) a.resolved=true; });
  toast(`${r.name} marqué no-show`);
  _updateAssistBadge();
  render();
}

function _rushFindTable(resaId){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const r = all.find(x => x.id === resaId);
  if(!r) return;
  const avail = Object.entries(TABLE_DATA)
    .map(([id,d]) => ({id:+id,...d}))
    .filter(t => t.hi >= r.pax && t.id < SALON_ID_MIN && !gr().find(x=>x.placed&&x.tableId===t.id&&x.id!==resaId))
    .sort((a,b) => a.hi - b.hi);
  _rushShowPanel(`
    <div class="ro-panel-title">Placer ${r.name}</div>
    <div class="ro-panel-subtitle">${r.pax} PAX · ${r.time}</div>
    ${!avail.length ? `<div class="ro-panel-note">Aucune table libre avec capacité suffisante</div>` : ''}
    <div class="ro-panel-grid">${avail.map(t=>`
      <div class="ro-panel-tbl" onclick="_rushPlaceOn(${resaId},${t.id})">
        <div style="font-size:16px;font-weight:800;color:var(--t1)">${t.id}</div>
        <div style="font-size:9px;color:var(--t3)">${t.hi} PAX</div>
      </div>`).join('')}</div>
    <button class="ro-panel-cancel" onclick="_rushClosePanel()">Annuler</button>`);
}

function _rushPlaceOn(resaId, tableId){
  const all = [...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const r = all.find(x => x.id === resaId);
  if(!r) return;
  saveUndo();
  const prev = gr().find(x => x.placed && x.tableId===tableId && x.id!==resaId);
  if(prev){ prev.placed=false; prev.tableId=null; }
  r.placed=true; r.tableId=tableId;
  assistAlerts.forEach(a => { if(a.resaId===resaId) a.resolved=true; });
  _rushClosePanel();
  toast(`${r.name} → table ${tableId}`);
  _updateAssistBadge();
  render();
}

function _rushDeclareTableDown(tableId){
  const r = gr().find(x => x.tableId===tableId && x.placed);
  if(r){ saveUndo(); r.placed=false; r.tableId=null; }
  _assistEnsure(`table_down:${tableId}`, {
    severity: 'danger',
    msg: `Table ${tableId} HS${r?` — ${r.name} à replacer`:''}`,
    actions: r ? [{ label: '→ Replacer', fn: () => _rushFindTable(r.id) }] : []
  });
  _rushClosePanel();
  _updateAssistBadge();
  render(); if(assistOpen) renderAssistDrawer();
}

function _rushWrongDaySearch(){
  const q=(document.getElementById('ro-wd-input')?.value||'').toLowerCase().trim();
  const res=document.getElementById('ro-wd-results');
  if(!q){ res.innerHTML=''; return; }
  const all=[...reservations.s1,...reservations.s2,...reservations.transats,...reservations.soir];
  const found=all.filter(r=>r.name.toLowerCase().includes(q)).slice(0,8);
  if(!found.length){ res.innerHTML=`<div class="ro-panel-empty">Aucun résultat</div>`; return; }
  res.innerHTML=found.map(r=>`
    <div class="ro-panel-item" onclick="_rushClosePanel();_rushFindTable(${r.id})">
      <div class="ro-pi-name">${r.name}</div>
      <div class="ro-pi-info">${r.pax} PAX · ${r.svc.toUpperCase()} · ${r.time}${r.date?' · '+r.date:''}</div>
    </div>`).join('');
}

function _rushPushAll(minutes){
  saveUndo();
  gr().filter(r=>!r.placed&&!r.ns).forEach(r=>{
    const min=_assistParseTime(r.time)+minutes;
    r.time=`${Math.floor(min/60)}h${String(min%60).padStart(2,'0')}`;
  });
  _assistEnsure('delay:'+Date.now(), { severity:'info', msg:`Resas décalées +${minutes}min`, actions:[] });
  _rushClosePanel();
  toast(`+${minutes}min appliqué`);
  _updateAssistBadge();
  render(); if(assistOpen) renderAssistDrawer();
}

function _rushShowPanel(html){
  const p=document.getElementById('ro-panel');
  document.getElementById('ro-panel-box').innerHTML=html;
  p.style.display='flex';
}
function _rushClosePanel(){
  document.getElementById('ro-panel').style.display='none';
}

// ─── Tab switching ─────────────────────────────────────
function switchTab(i){
  currentTab=i;
  document.querySelectorAll('.tab').forEach((t,j)=>{
    t.classList.remove('on');
    if(j===i) t.classList.add('on');
  });
  document.getElementById('search-input').value='';
  selectedId=null; fuseMode=false; fuseTargets=[];
  document.getElementById('rp-content').innerHTML='<div class="rp-empty">Tap sur une réservation</div>';
  document.getElementById('rp-actions').style.display='none';
  const btn=document.getElementById('fuse-btn');
  btn.className='tbtn tbtn-fuse'; btn.textContent='⊕ Fusionner'; btn.onclick=toggleFuse;
  render();
}
