// ══════════════════════════════════════════
// SYNC BRIGADE — Supabase (remplace Zenchef)
// Branche de sauvegarde Zenchef : backup/playa-os-zenchef (état avant migration)
// ══════════════════════════════════════════
const SB_URL  = 'https://exfipespqlseeaeozarx.supabase.co';
const SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZmlwZXNwcWxzZWVhZW96YXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5ODIwMjEsImV4cCI6MjEwOTU1ODAyMX0.HwNqF6dqfPDJdyDTv9JLkULFIPO-G45u7Bq5MA2ETtY';
const SB_RESTAURANT = typeof BRIGADE_RESTAURANT_ID !== 'undefined' ? BRIGADE_RESTAURANT_ID : 'laplaya';

// Stubs pour compatibilité clients.js (CRM import Zenchef désactivé)
const ZC_TOKEN = null;
const ZC_RESTAURANT_ID = null;
const ZC_API = null;

// ── Date courante de l'app
let currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

function updateDateDisplay(dateStr){
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
  const lbl = document.getElementById('date-btn-label');
  if(lbl) lbl.textContent = days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

// ── Calendrier custom
let calYear = 0, calMonth = 0;

function toggleCalendar(){
  const ov = document.getElementById('cal-overlay');
  if(ov.classList.contains('open')){ closeCalendar(); return; }
  const btn = document.getElementById('date-picker-btn');
  const box = document.getElementById('cal-box');
  const rect = btn.getBoundingClientRect();
  box.style.top = (rect.bottom + 6) + 'px';
  box.style.left = rect.left + 'px';
  const d = new Date(currentDate + 'T12:00:00');
  calYear = d.getFullYear(); calMonth = d.getMonth();
  renderCalendar();
  ov.classList.add('open');
}

function closeCalendar(e){
  if(e && document.getElementById('cal-box').contains(e.target)) return;
  document.getElementById('cal-overlay').classList.remove('open');
}

function calPrevMonth(){ calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
function calNextMonth(){ calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }

function calSelectToday(){
  const today = new Date().toISOString().split('T')[0];
  setDate(today);
  closeCalendar();
}

function calGoYear(year){
  calYear = year;
  renderCalendar();
}

function renderCalendar(){
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('cal-title').textContent = months[calMonth] + ' ' + calYear;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  ['Lu','Ma','Me','Je','Ve','Sa','Di'].forEach(d=>{
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(calYear, calMonth, 1);
  let startOffset = firstDay.getDay() - 1;
  if(startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();

  for(let i=startOffset-1; i>=0; i--){
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = daysInPrev - i;
    grid.appendChild(el);
  }

  for(let d=1; d<=daysInMonth; d++){
    const dateStr = calYear + '-' + String(calMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const el = document.createElement('div');
    let cls = 'cal-day';
    if(dateStr === today) cls += ' today';
    if(dateStr === currentDate) cls += ' selected';
    el.className = cls;
    el.textContent = d;
    el.addEventListener('click', ()=>{ setDate(dateStr); closeCalendar(); });
    grid.appendChild(el);
  }

  const total = startOffset + daysInMonth;
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
  for(let d=1; d<=remaining; d++){
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = d;
    grid.appendChild(el);
  }

  [2024,2025,2026].forEach(yr=>{
    const btn = document.getElementById('cal-yr-'+yr);
    if(!btn) return;
    if(yr === calYear){
      btn.style.background = 'var(--blue)';
      btn.style.color = '#fff';
      btn.style.borderRadius = '8px';
      btn.style.padding = '4px 10px';
    } else {
      btn.style.background = '';
      btn.style.color = 'var(--blue)';
      btn.style.borderRadius = '';
      btn.style.padding = '';
    }
  });
}

function formatDateFR(dateStr){
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'];
  const months = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

async function setDate(dateStr){
  currentDate = dateStr;
  updateDateDisplay(dateStr);
  reservations = {s1:[], s2:[], transats:[], soir:[]};
  fused = {s1:[],s2:[],transats:[],soir:[]};
  selectedId = null;
  lastSyncAt = null;
  updateSyncAge();
  render();
  await syncBrigade(dateStr);
}

function changeDate(delta){
  const d = new Date(currentDate + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  setDate(d.toISOString().split('T')[0]);
}

function onDateChange(val){
  if(val) setDate(val);
}

let syncInterval = null;
let lastSyncAt = null;

// ── Cache localStorage (TTL 5 min)
const BRIGADE_CACHE_TTL = 5 * 60 * 1000;

function brigadeCacheGet(date){
  try{
    const raw = localStorage.getItem('playa_brigade_' + date);
    if(!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if(Date.now() - ts > BRIGADE_CACHE_TTL) return null;
    return data;
  } catch(e){ return null; }
}

function brigadeCacheSet(date, data){
  try{ localStorage.setItem('playa_brigade_' + date, JSON.stringify({ ts: Date.now(), data })); }catch(e){}
  if(typeof crmMergeDay === 'function') setTimeout(() => crmMergeDay(date, data), 0);
}

// ── Fetch les réservations Brigade depuis Supabase pour une date
async function fetchBrigadeForDate(date){
  const url = SB_URL + '/rest/v1/reservations?select=*'
    + '&date=eq.' + date
    + '&restaurant_id=eq.' + SB_RESTAURANT
    + '&status=not.eq.cancelled'
    + '&order=slot.asc';
  const res = await fetch(url, {
    headers: {
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
    }
  });
  if(!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

// ── Convertit une row Supabase en resa Brigade (format interne commun)
function brigadeToResa(row){
  const pax = (row.grands||0) + (row.presque_grands||0) + (row.petits_loups||0) + (row.tout_doux||0) || 1;
  const name = [row.prenom, row.nom].filter(Boolean).join(' ') || 'Inconnu';
  // "12:00" → "12h00"
  const time = (row.slot || '12:00').replace(':', 'h').substring(0, 5);
  const nbTransats = row.transats || 0;
  const isTableTransats = row.formula === 'table+transats' && nbTransats > 0;
  const svc = row.service || 's1';
  const ns = row.status === 'no_show';
  const preferredRow = row.first_row === 'oui' ? 500 : null;

  return {
    _cancelled: row.status === 'cancelled',
    _isTablePlusTransat: isTableTransats,
    _nbTransats: nbTransats,
    _isBed: false,
    _nbBeds: 0,
    _preferredRow: preferredRow,
    _preferExtremite: false,
    _svc: svc,
    resa: mkResa({
      zenchef_id: row.ref || row.id,
      source: 'brigade',
      origin: 'widget',
      name,
      phone: row.tel || null,
      email: row.email || null,
      pax,
      time,
      date: row.date,
      comment: row.note || '',
      tags: [],
      svc,
      repas_transat: false,
      tr: nbTransats || null,
      ns,
      zenchef_status: row.status,
      waiting: false,
      placed: false,
      tableId: null,
      slot: null,
      booked_at: row.created_at || null,
      time_transats: null,
      row_transats: preferredRow,
      pref_extremite: false,
      requested_table_id: null,
    })
  };
}

// ── Parseurs de texte libre (resas manuelles)
function parseBedFromText(txt){
  if(!txt) return 0;
  const t = txt.toLowerCase();
  const noSunbed = t.replace(/sunbeds?/gi, '');
  if(/\b(beds?\s*doubles?|doubles?\s*beds?|lits?\s*doubles?|cabane)\b/.test(noSunbed)) return 1;
  const m = noSunbed.match(/(\d+)\s*x?\s*(?:beds?|lits?)\b/);
  if(m) return parseInt(m[1]);
  if(/\bbed\b/.test(noSunbed)) return 1;
  return 0;
}

function parseTransatsFromText(txt){
  if(!txt) return 0;
  const patterns = [
    /(\d+)\s*x?\s*transats?/i,
    /transats?\s*[x:=]?\s*(\d+)/i,
    /\bT\s*[:=]\s*(\d+)/,
    /(\d+)\s*T\b(?!\d)/,
    /(\d+)\s*x?\s*matelas?/i,
    /(\d+)\s*x?\s*chaises?\s*(?:longues?|de\s*plage)/i,
    /(\d+)\s*x?\s*chaise\s*longue/i,
    /(\d+)\s*x?\s*sunbeds?/i,
    /(\d+)\s*x?\s*(?:deck\s*chairs?|beach\s*chairs?|lounge\s*chairs?)/i,
    /(\d+)\s*x?\s*parasols?/i,
    /(\d+)\s*x?\s*lettini?/i,
    /(\d+)\s*x?\s*sdraio/i,
  ];
  for(const p of patterns){
    const m = txt.match(p);
    if(m) return parseInt(m[1]);
  }
  if(/\b(?:sunbed|deck\s*chair|beach\s*chair|lounge\s*chair|lettino|sdraio)\b/i.test(txt)) return 1;
  return 0;
}

function parsePreferredRowFromText(txt){
  if(!txt) return null;
  const t = txt.toLowerCase()
    .replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[îï]/g,'i').replace(/[ôö]/g,'o')
    .replace(/1ere|1re|premiere/g,'1')
    .replace(/2eme|2e|deuxieme/g,'2')
    .replace(/3eme|3e|troisieme/g,'3')
    .replace(/4eme|4e|quatrieme/g,'4')
    .replace(/5eme|5e|cinquieme/g,'5');

  const pProche = [
    /\bproche\s*(?:du\s*)?(?:resto|restaurant)\b/,
    /\bcote\s*(?:du\s*)?(?:resto|restaurant)\b/,
    /\brestaurant\s*side\b/,
    /\bnear\s*(?:the\s*)?restaurant\b/,
  ];
  if(pProche.some(p=>p.test(t))) return 200;

  const p1 = [
    /\b1\s*(?:ere?|re?|st)?\s*(?:ligne|rang(?:ee?)?|row)\b/,
    /(?:ligne|rang(?:ee?)?|row)\s*(?:n[o°]?\s*)?1\b/,
    /\bfront\s*row\b/, /\b1st\s*row\b/,
    /\bbord\s*(?:de\s*(?:la\s*)?)?mer\b/,
    /\bvue\s*(?:sur\s*(?:la\s*)?)?mer\b/,
    /\bface\s*(?:a\s*(?:la\s*)?)?mer\b/,
    /\b(?:sea|ocean)\s*(?:view|front)\b/,
    /\bfacing\s*(?:the\s*)?(?:sea|ocean|water)\b/,
  ];
  if(p1.some(p=>p.test(t))) return 500;

  const pLoin = [
    /\bloin\s*(?:du\s*)?(?:resto|restaurant)\b/,
    /\beloigne\s*(?:du\s*)?(?:resto|restaurant)\b/,
    /\bfar\s*from\s*(?:the\s*)?restaurant\b/,
  ];
  if(pLoin.some(p=>p.test(t))) return 500;

  const pMilieu = [
    /\bau\s*milieu\b/, /\bmilieu\s*(?:de\s*(?:la\s*)?plage)?\b/,
    /\bau\s*centre\b/, /\bcentre\s*(?:de\s*(?:la\s*)?plage)?\b/,
    /\bmiddle\s*(?:of\s*(?:the\s*)?beach)?\b/,
  ];
  if(pMilieu.some(p=>p.test(t))) return 300;

  const p2 = [/\b2\s*(?:eme?)?\s*(?:ligne|rang(?:ee?)?|row)\b/, /(?:ligne|rang(?:ee?)?|row)\s*(?:n[o°]?\s*)?2\b/];
  if(p2.some(p=>p.test(t))) return 400;
  const p3 = [/\b3\s*(?:eme?)?\s*(?:ligne|rang(?:ee?)?|row)\b/, /(?:ligne|rang(?:ee?)?|row)\s*(?:n[o°]?\s*)?3\b/];
  if(p3.some(p=>p.test(t))) return 300;
  const p4 = [/\b4\s*(?:eme?)?\s*(?:ligne|rang(?:ee?)?|row)\b/, /(?:ligne|rang(?:ee?)?|row)\s*(?:n[o°]?\s*)?4\b/];
  if(p4.some(p=>p.test(t))) return 200;
  const p5 = [/\b5\s*(?:eme?)?\s*(?:ligne|rang(?:ee?)?|row)\b/, /(?:ligne|rang(?:ee?)?|row)\s*(?:n[o°]?\s*)?5\b/];
  if(p5.some(p=>p.test(t))) return 100;
  return null;
}

function parseExtremiteFromText(txt){
  if(!txt) return false;
  const t = txt.toLowerCase()
    .replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[îï]/g,'i').replace(/[ôö]/g,'o');
  const hasCote = /\bcote\b/.test(t) && !/cote\s*(?:du\s*)?(?:resto|restaurant|plage\s*resto)\b/.test(t);
  return (
    hasCote ||
    /\bextremit[e]?\b/.test(t) || /\bextreme\b/.test(t) ||
    /\bau\s*bout\b/.test(t) || /\bbout\s*(?:de\s*(?:la\s*)?)?(?:rang|ligne|row)\b/.test(t) ||
    /\bcoin\s*(?:de\s*(?:la\s*)?)?(?:rang|ligne)\b/.test(t) ||
    /\blateral[e]?\b/.test(t) ||
    /\bend\s*(?:of\s*(?:the\s*)?)?(?:row|line)\b/.test(t) ||
    /\bcorner\s*(?:spot|place|transat)?\b/.test(t) ||
    /\bon\s*the\s*side\b/.test(t) ||
    /\bedge\s*(?:of\s*(?:the\s*)?)?(?:row|line|rang)\b/.test(t)
  );
}

function parseSlotFromText(txt){
  if(!txt) return null;
  const t = txt.toLowerCase().replace(/[°oa]/g,'o');
  const patterns = [
    /\ben\s*(\d{3})\b/, /\bslot\s*(\d{3})\b/,
    /\bn[o°]?\s*(\d{3})\b/, /#(\d{3})\b/,
  ];
  for(const p of patterns){
    const m = t.match(p);
    if(m){ const slot=parseInt(m[1]); if(slot>=101 && slot<=521) return slot; }
  }
  return null;
}

// ── Applique une liste de rows Supabase dans reservations[]
function applyBookings(rows, date){
  let added = 0, dupes = 0, cancelled = 0;
  function isDupe(ref){ return Object.values(reservations).flat().some(r => r.zenchef_id === ref); }
  rows.forEach(row => {
    const conv = brigadeToResa(row);
    if(conv._cancelled){ cancelled++; return; }
    if(isDupe(conv.resa.zenchef_id)){ dupes++; return; }
    const svc = conv._svc;
    const tab = svc === 's2' ? 's2' : svc === 'soir' ? 'soir' : 's1';
    reservations[tab].push({...conv.resa, tableId: null});
    added++;
    // Sous-resa transats (formule table+transats)
    if(conv._isTableTransats && conv._nbTransats > 0){
      const trResa = mkResa({
        zenchef_id: conv.resa.zenchef_id + '_tr',
        source: 'brigade',
        name: conv.resa.name, phone: conv.resa.phone, email: conv.resa.email,
        pax: conv.resa.pax, time: conv.resa.time, date: conv.resa.date,
        comment: conv.resa.comment, svc,
        repas_transat: false, tr: conv._nbTransats, ns: conv.resa.ns,
        zenchef_status: conv.resa.zenchef_status,
        placed: false, slot: null,
        row_transats: conv._preferredRow, pref_extremite: false,
      });
      reservations.transats.push(trResa);
    }
  });
  reAnalyzeAllResas();
  return { added, dupes, cancelled };
}

// ── Passe de ré-analyse (resas manuelles principalement)
function reAnalyzeAllResas(){
  Object.values(reservations).flat().forEach(r => {
    const raw = (r.comment || '');
    if(!raw.trim()) return;
    const norm = raw.toLowerCase()
      .replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u')
      .replace(/[îï]/g,'i').replace(/[ôö]/g,'o');

    if(!r.requested_table_id){
      const tid = parseTableRequest(raw);
      if(tid) r.requested_table_id = tid;
    }
    if(!r.pref_extremite){
      const hasCote = /\bcote\b/.test(norm) && !/cote\s*(?:du\s*)?(?:resto|restaurant)\b/.test(norm);
      r.pref_extremite = hasCote
        || /\bextremit[e]?\b/.test(norm) || /\bau\s*bout\b/.test(norm)
        || /\blateral[e]?\b/.test(norm) || /\bon\s*the\s*side\b/.test(raw.toLowerCase());
    }
    if(!r.row_transats && (r.tr > 0 || r.bed)){
      const row = parsePreferredRowFromText(raw);
      if(row) r.row_transats = row;
      else { const slot = parseSlotFromText(raw); if(slot) r.row_transats = Math.floor(slot/100)*100; }
    }
    if(r.source !== 'brigade' && !r.tr && !r.bed){
      const nbT = parseTransatsFromText(raw);
      if(nbT > 0) r.tr = nbT;
    }
    if(!r.bed && parseBedFromText(raw) > 0) r.bed = true;
  });
}

// ── Helpers UI
function zcSetProgress(pct){
  const bar = document.getElementById('zc-load-bar');
  if(!bar) return;
  if(pct === null){
    bar.style.width = '100%';
    setTimeout(() => { bar.style.display = 'none'; bar.style.width = '0'; }, 350);
    return;
  }
  bar.style.display = 'block';
  bar.style.width = pct + '%';
}

function zcSetLabel(txt, cls){
  const el = document.getElementById('sync-age');
  if(!el) return;
  el.textContent = txt;
  el.className = 'sync-age' + (cls ? ' ' + cls : '');
}

function zcSetSpinner(on){
  const icon = document.getElementById('sync-icon');
  const btn  = document.getElementById('sync-btn');
  if(icon) icon.style.animation = on ? 'spin 1s linear infinite' : '';
  if(btn){ btn.style.opacity = on ? '0.75' : '1'; btn.style.pointerEvents = on ? 'none' : 'auto'; }
}

// ── Sync principale Brigade
async function syncBrigade(date){
  if(!date) date = currentDate;

  // Cache frais → retour immédiat
  const cached = brigadeCacheGet(date);
  if(cached){
    reservations = {s1:[], s2:[], transats:[], soir:[]};
    fused = {s1:[],s2:[],transats:[],soir:[]};
    selectedId = null;
    saveUndo();
    applyBookings(cached, date);
    restorePlacements(loadPlacements(date));
    lastSyncAt = new Date();
    updateSyncAge();
    render();
    return;
  }

  // Fetch Supabase
  zcSetSpinner(true);
  zcSetProgress(30);
  zcSetLabel('chargement…');

  try{
    const rows = await fetchBrigadeForDate(date);
    brigadeCacheSet(date, rows);
    reservations = {s1:[], s2:[], transats:[], soir:[]};
    fused = {s1:[],s2:[],transats:[],soir:[]};
    selectedId = null;
    saveUndo();
    const { added, dupes, cancelled } = applyBookings(rows, date);
    restorePlacements(loadPlacements(date));
    lastSyncAt = new Date();
    updateSyncAge();
    render();
    zcSetProgress(null);
    const msg = formatDateFR(date) + ' · ' + added + ' réservation' + (added !== 1 ? 's' : '')
      + (cancelled > 0 ? ' · ' + cancelled + ' annulée' + (cancelled>1?'s':'') : '');
    toast('✓ Brigade — ' + msg);
  } catch(e){
    const errMsg = e.message || String(e);
    zcSetLabel('⚠ erreur (' + errMsg + ')', 'stale');
    console.error('Brigade sync error:', e);
    toast('❌ Brigade : ' + errMsg, 6000);
    const ageEl = document.getElementById('sync-age');
    if(ageEl){
      ageEl.innerHTML = '⚠ ' + errMsg + ' — <span style="text-decoration:underline;cursor:pointer" onclick="syncBrigade()">réessayer</span>';
    }
  }

  zcSetSpinner(false);
  zcSetProgress(null);
}

// Alias pour compatibilité avec init.js et tout appel existant
const syncZenchef = syncBrigade;

// ── Mise à jour de l'indicateur "il y a X min"
function updateSyncAge(){
  const el = document.getElementById('sync-age');
  if(!el) return;
  if(!lastSyncAt){ el.textContent='jamais synced'; el.className='sync-age'; return; }
  const mins = Math.floor((Date.now() - lastSyncAt.getTime()) / 60000);
  if(mins < 1){ el.textContent='sync instant'; el.className='sync-age fresh'; }
  else if(mins < 5){ el.textContent='il y a ' + mins + ' min'; el.className='sync-age fresh'; }
  else { el.textContent='il y a ' + mins + ' min'; el.className='sync-age stale'; }
}
const _syncAgeInterval = setInterval(updateSyncAge, 30000);

// ── Auto-sync toutes les 5 min
function startAutoSync(){
  if(syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(()=>{
    // Invalider le cache et re-syncer la date courante
    try{ localStorage.removeItem('playa_brigade_' + currentDate); }catch(e){}
    syncBrigade(currentDate).catch(()=>{});
  }, 5 * 60 * 1000);
}

// Préchauffage : no-op avec Supabase (requête légère, pas besoin de pré-fetch)
function warmZenchefCache(){}
function warmBrigadeCache(){}

// Ferme le calendrier avec Escape
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    if(document.getElementById('import-modal') &&
       document.getElementById('import-modal').style.display === 'flex'){
      document.getElementById('import-modal').style.display = 'none';
    }
  }
});
