// ══════════════════════════════════════════
// ÉQUIPE & PLANNING — La Playa en Camargue
// ══════════════════════════════════════════

// ── Données équipe ────────────────────────────────────────────────────────
const EQ_MEMBRES = [
  { id:'antoine', nom:'Antoine',  role:'Manager',      poste:'Management', color:'#E89A3C', couvre:['eva','aurelie','sam','eliott'] },
  { id:'ninon',   nom:'Ninon',    role:'Bar',           poste:'Bar',        color:'#7C3AED', couvre:[] },
  { id:'eva',     nom:'Eva',      role:'Chef de rang',  poste:'Salle',      color:'#2563EB', couvre:[] },
  { id:'aurelie', nom:'Aurélie',  role:'Chef de rang',  poste:'Salle',      color:'#16A34A', couvre:[] },
  { id:'sam',     nom:'Sam',      role:'Plagiste',      poste:'Plage',      color:'#0284C7', couvre:[] },
  { id:'eliott',  nom:'Eliott',   role:'Plagiste',      poste:'Plage',      color:'#0891B2', couvre:[] }
];

const EQ_JOURS       = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
const EQ_JOURS_COURT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const EQ_JOURS_REPOS = ['lundi','mardi','mercredi','jeudi','vendredi'];

const EQ_BADGES = {
  Management: { label:'MGR', bg:'#FFFBEB', color:'#78350F' },
  Bar:         { label:'BAR', bg:'#F5F3FF', color:'#7C3AED' },
  Salle:       { label:'SR',  bg:'#EDF7F1', color:'#1A7A3E' },
  Plage:       { label:'PLG', bg:'#F0F9FF', color:'#0284C7' }
};

// ── État du module ────────────────────────────────────────────────────────
let eqWeekOffset = 0;

// ── Persistance ───────────────────────────────────────────────────────────
function eqGetConfig() {
  const defaults = {
    repos:     { antoine:'vendredi', ninon:'mardi', eva:'mercredi', aurelie:'lundi', sam:'jeudi', eliott:'mardi' },
    overrides: {}
  };
  try {
    const s = localStorage.getItem('playa-equipe-v2');
    if (!s) return defaults;
    const p = JSON.parse(s);
    return { repos: { ...defaults.repos, ...(p.repos || {}) }, overrides: p.overrides || {} };
  } catch (e) { return defaults; }
}

function eqSaveConfig(cfg) {
  try { localStorage.setItem('playa-equipe-v2', JSON.stringify(cfg)); } catch (e) {}
}

// ── Helpers date ──────────────────────────────────────────────────────────
function eqGetMonday(offset) {
  const d = new Date(currentDate + 'T12:00:00');
  const dow = d.getDay(); // 0=dim … 6=sam
  d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow) + offset * 7);
  return d;
}

function eqGetWeekDates(offset) {
  const mon = eqGetMonday(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(d.getDate() + i); return d;
  });
}

function eqKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function eqFmt(d) { return d.getDate() + '/' + String(d.getMonth()+1).padStart(2,'0'); }

// Index Mon=0 … Sun=6 depuis une Date JS
function eqDayIdx(d) { const dow = d.getDay(); return dow === 0 ? 6 : dow - 1; }

// ── Logique planning ──────────────────────────────────────────────────────
function eqGetEtat(cfg, membreId, date) {
  const key = eqKey(date);
  if (cfg.overrides[key] && cfg.overrides[key][membreId] !== undefined) {
    return cfg.overrides[key][membreId];
  }
  return cfg.repos[membreId] === EQ_JOURS[eqDayIdx(date)] ? 'repos' : 'travail';
}

function eqGetCoverage(cfg, date) {
  if (eqGetEtat(cfg, 'antoine', date) !== 'travail') return [];
  return EQ_MEMBRES.find(m => m.id === 'antoine').couvre
    .filter(id => eqGetEtat(cfg, id, date) !== 'travail');
}

// ── Actions ───────────────────────────────────────────────────────────────
function eqSetEtat(membreId, dateKey, etat) {
  const cfg = eqGetConfig();
  if (!cfg.overrides[dateKey]) cfg.overrides[dateKey] = {};
  cfg.overrides[dateKey][membreId] = etat;
  eqSaveConfig(cfg);
  eqRefresh();
}

function eqSetRepos(membreId, jour) {
  const cfg = eqGetConfig();
  cfg.repos[membreId] = jour;
  eqSaveConfig(cfg);
  const nom = EQ_MEMBRES.find(m => m.id === membreId).nom;
  toast(nom + ' — repos le ' + jour.charAt(0).toUpperCase() + jour.slice(1));
  eqRefresh();
}

function equipeChangeWeek(delta) { eqWeekOffset += delta; eqRefresh(); }
function equipeGoToday()         { eqWeekOffset = 0;      eqRefresh(); }

function eqRefresh() {
  const mc = document.getElementById('module-container');
  if (!mc) return;
  mc.innerHTML = '';
  renderEquipeRH(mc);
}

// ── Popover ───────────────────────────────────────────────────────────────
function eqOpenPopover(trigger, membreId, dateKey, etatActuel) {
  document.querySelectorAll('.eq-pop').forEach(p => p.remove());

  const pop = document.createElement('div');
  pop.className = 'eq-pop';
  pop.style.cssText = 'position:fixed;background:#fff;border:0.5px solid rgba(60,54,44,.14);border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.13);padding:5px;z-index:9999;min-width:148px';

  [
    { val:'travail', label:'Présent',  dotColor:'#1A7A3E' },
    { val:'repos',   label:'Repos',    dotColor:'#A8A59D' },
    { val:'absent',  label:'Absent',   dotColor:'#DC2626' },
    { val:'conge',   label:'Congé',    dotColor:'#D97706' }
  ].forEach(opt => {
    const btn = document.createElement('button');
    const active = opt.val === etatActuel;
    btn.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:none;border-radius:7px;background:' + (active ? 'rgba(0,0,0,.04)' : 'transparent') + ';cursor:pointer;font-family:inherit;font-size:12px;font-weight:' + (active ? '700' : '500') + ';color:var(--t1);text-align:left';

    const dot = document.createElement('div');
    dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + opt.dotColor + ';flex-shrink:0';
    btn.appendChild(dot);

    const lbl = document.createElement('span');
    lbl.textContent = opt.label;
    btn.appendChild(lbl);

    btn.onmouseenter = () => { if (!active) btn.style.background = 'rgba(0,0,0,.03)'; };
    btn.onmouseleave = () => { if (!active) btn.style.background = 'transparent'; };
    btn.onclick = (e) => {
      e.stopPropagation();
      pop.remove();
      if (opt.val !== etatActuel) eqSetEtat(membreId, dateKey, opt.val);
    };
    pop.appendChild(btn);
  });

  const rect = trigger.getBoundingClientRect();
  pop.style.top  = (rect.bottom + 6) + 'px';
  pop.style.left = Math.min(rect.left, window.innerWidth - 160) + 'px';
  document.body.appendChild(pop);

  const close = (e) => {
    if (!pop.contains(e.target)) { pop.remove(); document.removeEventListener('mousedown', close); }
  };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}

// ── Render ────────────────────────────────────────────────────────────────
function renderEquipeRH(c) {
  const cfg      = eqGetConfig();
  const dates    = eqGetWeekDates(eqWeekOffset);
  const todayKey = eqKey(new Date(currentDate + 'T12:00:00'));

  const months   = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  const weekLabel = eqFmt(dates[0]) + ' ' + months[dates[0].getMonth()] + ' → ' + eqFmt(dates[6]) + ' ' + months[dates[6].getMonth()] + ' ' + dates[6].getFullYear();

  // Page
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;overflow-y:auto;padding:20px 22px;background:#F5F5F2;display:flex;flex-direction:column;gap:14px';
  c.appendChild(page);

  // ── Header
  const hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between';
  hdr.innerHTML = '<div>' +
    '<div style="font-size:18px;font-weight:800;color:var(--t1);letter-spacing:-.2px">Équipe & Planning</div>' +
    '<div style="font-size:12px;color:var(--t3);margin-top:2px">6 membres · Cliquer sur une cellule pour modifier l\'état</div>' +
    '</div>' +
    '<button onclick="toast(\'Export prochainement\')" style="padding:9px 14px;border-radius:10px;border:1px solid var(--sep);background:var(--card);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--t2)">⎙ Exporter</button>';
  page.appendChild(hdr);

  // ── Carte planning
  const planCard = document.createElement('div');
  planCard.style.cssText = 'background:var(--card);border:0.5px solid var(--sep);border-radius:14px;overflow:hidden';

  // En-tête avec navigation semaine
  const cardHead = document.createElement('div');
  cardHead.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:0.5px solid var(--sep)';
  cardHead.innerHTML =
    '<div>' +
      '<div style="font-size:13px;font-weight:700;color:var(--t1)">Planning de la semaine</div>' +
      '<div style="font-size:11px;color:var(--t3);margin-top:1px">' + weekLabel + '</div>' +
    '</div>' +
    '<div style="display:flex;gap:6px;align-items:center">' +
      '<button onclick="equipeChangeWeek(-1)" style="width:30px;height:30px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer;color:var(--t2);font-size:17px;display:flex;align-items:center;justify-content:center;font-family:inherit">‹</button>' +
      '<button onclick="equipeGoToday()" style="padding:0 12px;height:30px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer;color:var(--t2);font-size:11px;font-weight:600;font-family:inherit">Aujourd\'hui</button>' +
      '<button onclick="equipeChangeWeek(1)" style="width:30px;height:30px;border:1px solid var(--sep);background:var(--card);border-radius:8px;cursor:pointer;color:var(--t2);font-size:17px;display:flex;align-items:center;justify-content:center;font-family:inherit">›</button>' +
    '</div>';
  planCard.appendChild(cardHead);

  // Wrapper scrollable pour la table (mobile/petits écrans)
  const tblWrap = document.createElement('div');
  tblWrap.style.cssText = 'overflow-x:auto';

  const tbl = document.createElement('table');
  tbl.style.cssText = 'width:100%;border-collapse:collapse;min-width:700px';

  // ── Thead
  const thead = document.createElement('thead');
  const theadTr = document.createElement('tr');
  theadTr.style.cssText = 'border-bottom:0.5px solid var(--sep);background:var(--bg)';

  function makeHeaderTh(html, style) {
    const th = document.createElement('th');
    th.style.cssText = style;
    th.innerHTML = html;
    return th;
  }

  theadTr.appendChild(makeHeaderTh('Membre',
    'text-align:left;padding:10px 14px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;width:170px'));

  dates.forEach((date, i) => {
    const isWE    = i >= 5;
    const isToday = eqKey(date) === todayKey;
    const dayColor  = isWE ? 'var(--t5)' : isToday ? 'var(--blue)' : 'var(--t3)';
    const dateColor = isWE ? 'var(--t5)' : isToday ? 'var(--blue)' : 'var(--t2)';
    const dateFW    = isToday ? '800' : '400';
    const dot       = isToday ? '<div style="width:5px;height:5px;border-radius:50%;background:var(--blue);margin:3px auto 0"></div>' : '<div style="height:8px"></div>';
    theadTr.appendChild(makeHeaderTh(
      '<div style="font-size:10px;font-weight:700;color:' + dayColor + ';text-transform:uppercase;letter-spacing:.05em">' + EQ_JOURS_COURT[i] + '</div>' +
      '<div style="font-size:12px;font-weight:' + dateFW + ';color:' + dateColor + ';margin-top:1px">' + eqFmt(date) + '</div>' + dot,
      'text-align:center;padding:8px 4px;width:68px'
    ));
  });

  theadTr.appendChild(makeHeaderTh('Jour repos',
    'text-align:center;padding:10px 8px;font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;width:106px'));

  thead.appendChild(theadTr);
  tbl.appendChild(thead);

  // ── Tbody
  const tbody = document.createElement('tbody');

  EQ_MEMBRES.forEach(m => {
    const tr = document.createElement('tr');
    tr.style.cssText = 'border-bottom:0.5px solid var(--sep)';
    tr.onmouseenter = () => { tr.style.background = 'rgba(0,0,0,.013)'; };
    tr.onmouseleave = () => { tr.style.background = ''; };

    // Cellule membre
    const tdM = document.createElement('td');
    tdM.style.cssText = 'padding:10px 14px';
    tdM.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:32px;height:32px;border-radius:50%;background:' + m.color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">' + m.nom[0] + '</div>' +
        '<div>' +
          '<div style="font-size:12px;font-weight:600;color:var(--t1)">' + m.nom + '</div>' +
          '<div style="font-size:10px;color:var(--t3)">' + m.role + '</div>' +
        '</div>' +
      '</div>';
    tr.appendChild(tdM);

    // Cellules jours
    dates.forEach((date, i) => {
      const dk    = eqKey(date);
      const etat  = eqGetEtat(cfg, m.id, date);
      const isWE  = i >= 5;
      const isToday = dk === todayKey;

      const covIds = m.id === 'antoine' ? eqGetCoverage(cfg, date) : [];

      const td = document.createElement('td');
      td.style.cssText = 'text-align:center;padding:5px 3px;' + (isToday ? 'background:rgba(37,99,235,.03)' : '');

      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;border-radius:8px;padding:3px;transition:opacity .1s';
      wrap.title = 'Modifier ' + m.nom;
      wrap.onmouseenter = () => { wrap.style.opacity = '.65'; };
      wrap.onmouseleave = () => { wrap.style.opacity = '1'; };

      // Badge principal
      const badge = document.createElement('div');
      badge.style.cssText = 'width:50px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:\'DM Mono\',monospace';

      if (etat === 'repos') {
        badge.style.cssText += ';background:transparent;color:var(--t5);border:1.5px dashed var(--sep)';
        badge.textContent = 'OFF';
      } else if (etat === 'absent') {
        badge.style.cssText += ';background:var(--rbg);color:var(--red)';
        badge.textContent = 'ABS';
      } else if (etat === 'conge') {
        badge.style.cssText += ';background:#FFFBEB;color:#D97706';
        badge.textContent = 'CGÉ';
      } else {
        const bk = EQ_BADGES[m.poste];
        badge.style.cssText += ';background:' + bk.bg + ';color:' + bk.color + (isWE ? ';opacity:.5' : '');
        badge.textContent = bk.label;
      }

      wrap.appendChild(badge);

      // Sous-badge couverture (Antoine uniquement)
      if (covIds.length > 0) {
        const sub = document.createElement('div');
        sub.style.cssText = 'font-size:8px;font-weight:600;color:#92400E;background:#FFF8EC;border-radius:4px;padding:1px 5px;white-space:nowrap;max-width:58px;overflow:hidden;text-overflow:ellipsis';
        sub.textContent = covIds.map(id => EQ_MEMBRES.find(x => x.id === id).nom).join(' & ');
        wrap.appendChild(sub);
      }

      wrap.onclick = () => eqOpenPopover(wrap, m.id, dk, etat);
      td.appendChild(wrap);
      tr.appendChild(td);
    });

    // Sélecteur jour de repos
    const tdR = document.createElement('td');
    tdR.style.cssText = 'text-align:center;padding:10px 8px';
    const sel = document.createElement('select');
    sel.style.cssText = 'border:1px solid var(--sep);background:var(--card);font-family:inherit;font-size:11px;font-weight:600;color:var(--t1);padding:5px 8px;border-radius:8px;cursor:pointer;outline:none;width:92px';
    sel.onchange = () => eqSetRepos(m.id, sel.value);
    EQ_JOURS_REPOS.forEach(j => {
      const opt = document.createElement('option');
      opt.value = j;
      opt.textContent = j.charAt(0).toUpperCase() + j.slice(1);
      if (cfg.repos[m.id] === j) opt.selected = true;
      sel.appendChild(opt);
    });
    tdR.appendChild(sel);
    tr.appendChild(tdR);

    tbody.appendChild(tr);
  });

  // ── Ligne récap couverture (dans le tableau, toujours alignée)
  const trSum = document.createElement('tr');
  trSum.style.cssText = 'background:var(--bg);border-top:1px solid var(--sep)';

  const tdSumLbl = document.createElement('td');
  tdSumLbl.style.cssText = 'padding:8px 14px;font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em';
  tdSumLbl.textContent = 'Couverture';
  trSum.appendChild(tdSumLbl);

  dates.forEach(date => {
    const absents      = EQ_MEMBRES.filter(m => m.id !== 'antoine' && eqGetEtat(cfg, m.id, date) !== 'travail');
    const antoineOff   = eqGetEtat(cfg, 'antoine', date) !== 'travail';
    const td           = document.createElement('td');
    td.style.cssText   = 'text-align:center;padding:6px 3px';

    if (absents.length === 0) {
      td.innerHTML = '<span style="font-size:9px;font-weight:600;color:var(--green)">✓ Complet</span>';
    } else if (antoineOff) {
      td.innerHTML = '<span style="font-size:9px;font-weight:700;color:var(--red)">⚠ Ant. off</span>';
    } else {
      const coverts     = absents.filter(m => EQ_MEMBRES.find(x => x.id === 'antoine').couvre.includes(m.id));
      const nonCoverts  = absents.filter(m => !EQ_MEMBRES.find(x => x.id === 'antoine').couvre.includes(m.id));
      let html = '';
      if (coverts.length)    html += '<div style="font-size:9px;font-weight:600;color:var(--orange)">Ant. couvre</div>';
      if (nonCoverts.length) html += '<div style="font-size:9px;font-weight:700;color:var(--red)">⚠ ' + nonCoverts.map(m => m.nom).join(', ') + '</div>';
      td.innerHTML = html;
    }
    trSum.appendChild(td);
  });

  trSum.appendChild(document.createElement('td')); // colonne repos vide
  tbody.appendChild(trSum);

  tbl.appendChild(tbody);
  tblWrap.appendChild(tbl);
  planCard.appendChild(tblWrap);
  page.appendChild(planCard);

  // ── Légende
  const legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:14px;flex-wrap:wrap;align-items:center;padding:0 4px';

  [
    { bg:'#FFFBEB', color:'#78350F',       label:'MGR', desc:'Manager' },
    { bg:'#F5F3FF', color:'#7C3AED',       label:'BAR', desc:'Bar' },
    { bg:'#EDF7F1', color:'#1A7A3E',       label:'SR',  desc:'Chef de rang' },
    { bg:'#F0F9FF', color:'#0284C7',       label:'PLG', desc:'Plagiste' },
    { bg:'transparent', color:'var(--t5)', label:'OFF', desc:'Repos',  dashed:true },
    { bg:'var(--rbg)',  color:'var(--red)', label:'ABS', desc:'Absent' },
    { bg:'#FFFBEB',     color:'#D97706',    label:'CGÉ', desc:'Congé' }
  ].forEach(item => {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;gap:6px';
    const b = document.createElement('div');
    b.style.cssText = 'width:30px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;font-family:\'DM Mono\',monospace;background:' + item.bg + ';color:' + item.color + (item.dashed ? ';border:1.5px dashed rgba(60,54,44,.2)' : '');
    b.textContent = item.label;
    const l = document.createElement('span');
    l.style.cssText = 'font-size:10px;color:var(--t3)';
    l.textContent = item.desc;
    el.appendChild(b);
    el.appendChild(l);
    legend.appendChild(el);
  });

  page.appendChild(legend);
}
