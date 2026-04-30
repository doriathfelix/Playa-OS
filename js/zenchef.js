// ══════════════════════════════════════════
// SYNC ZENCHEF API — connexion directe
// ══════════════════════════════════════════
const ZC_TOKEN = '2742e3c9-0609-436c-8349-2d02554a11ed';

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
  // Positionner le calendrier sous le bouton
  const btn = document.getElementById('date-picker-btn');
  const box = document.getElementById('cal-box');
  const rect = btn.getBoundingClientRect();
  box.style.top = (rect.bottom + 6) + 'px';
  box.style.left = rect.left + 'px';
  // Init au mois courant
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

  // En-têtes jours
  ['Lu','Ma','Me','Je','Ve','Sa','Di'].forEach(d=>{
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(calYear, calMonth, 1);
  // Lundi = 0, donc décaler (getDay: 0=dim, 1=lun...)
  let startOffset = firstDay.getDay() - 1;
  if(startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();

  // Jours du mois précédent
  for(let i=startOffset-1; i>=0; i--){
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = daysInPrev - i;
    grid.appendChild(el);
  }

  // Jours du mois courant
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

  // Compléter avec jours mois suivant
  const total = startOffset + daysInMonth;
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
  for(let d=1; d<=remaining; d++){
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = d;
    grid.appendChild(el);
  }

  // Mettre en surbrillance le bouton de l'année active
  [2023,2024,2025].forEach(yr=>{
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
  // '2024-05-10' -> 'Ven. 10 mai 2024'
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'];
  const months = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

async function setDate(dateStr){
  currentDate = dateStr;
  updateDateDisplay(dateStr);
  // Vider les resas immédiatement + render vide
  reservations = {s1:[], s2:[], transats:[], soir:[]};
  fused = {s1:[],s2:[],transats:[],soir:[]};
  selectedId = null;
  lastSyncAt = null;
  updateSyncAge();
  render(); // affiche l'écran vide pendant le chargement
  // Puis recharger depuis Zenchef
  await syncZenchef(dateStr);
}

function changeDate(delta){
  const d = new Date(currentDate + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  setDate(d.toISOString().split('T')[0]);
}

function onDateChange(val){
  if(val) setDate(val);
}
const ZC_RESTAURANT_ID = '364557';
const ZC_API = 'https://api.zenchef.com/api/v1';

let syncInterval = null;
let lastSyncAt = null;

// ── Cache localStorage — TTL adaptatif
// Dates passées : 24h (ne changent plus)   Aujourd'hui / futur : 10 min
const ZC_CACHE_TTL_NOW  = 10 * 60 * 1000;  // 10 min pour aujourd'hui et futur
const ZC_CACHE_TTL_PAST = 24 * 60 * 60 * 1000; // 24h pour les dates passées
const ZC_FULL_FETCH_KEY = 'playa_zc_pool_ts'; // timestamp du dernier fetch complet

function zcCacheTTL(date){
  const today = new Date().toISOString().split('T')[0];
  return date < today ? ZC_CACHE_TTL_PAST : ZC_CACHE_TTL_NOW;
}
function zcCacheGet(date){
  try{
    const raw = localStorage.getItem('playa_zc_' + date);
    if(!raw) return null;
    const {ts, data} = JSON.parse(raw);
    if(Date.now() - ts > zcCacheTTL(date)) return null;
    return data;
  } catch(e){ return null; }
}
function zcCacheSet(date, data){
  try{ localStorage.setItem('playa_zc_' + date, JSON.stringify({ts: Date.now(), data})); }catch(e){}
}
// Âge du dernier fetch complet (toutes pages) en ms
function zcFullFetchAge(){
  try{ return Date.now() - parseInt(localStorage.getItem(ZC_FULL_FETCH_KEY)||'0'); }
  catch(e){ return Infinity; }
}
function zcMarkFullFetch(){
  try{ localStorage.setItem(ZC_FULL_FETCH_KEY, String(Date.now())); }catch(e){}
}

// ── Convertit un booking Zenchef en resa PlayaOS
// ── Extrait le nb de transats depuis texte libre
// Extrait le nb de transats depuis n'importe quel champ texte libre
function parseTransatsFromText(txt){
  if(!txt) return 0;
  // Patterns : "6 transats", "2x transats", "3 matelas", "2 beds", "transat x4", etc.
  const patterns = [
    /(\d+)\s*x?\s*transats?/i,
    /transats?\s*[x:]\s*(\d+)/i,
    /(\d+)\s*x?\s*matelas?/i,
    /(\d+)\s*x?\s*beds?\b/i,
    /(\d+)\s*x?\s*chaises?\s*(?:longues?|de\s*plage)/i,
    /(\d+)\s*x?\s*parasols?/i,
    /(\d+)\s*x?\s*sunbed/i,
  ];
  for(const p of patterns){
    const m = txt.match(p);
    if(m) return parseInt(m[1]);
  }
  return 0;
}

// Extrait la rangée préférentielle depuis un texte libre
// "1ere ligne mer" → 500, "2eme ligne" → 400 … "proche resto" → 200 (rangée côté restaurant)
function parsePreferredRowFromText(txt){
  if(!txt) return null;
  const t = txt.toLowerCase()
    .replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[îï]/g,'i').replace(/[ôö]/g,'o')
    .replace(/1ere|1re|premiere/g,'1')
    .replace(/2eme|2e|deuxieme/g,'2')
    .replace(/3eme|3e|troisieme/g,'3')
    .replace(/4eme|4e|quatrieme/g,'4')
    .replace(/5eme|5e|cinquieme/g,'5');

  // "proche resto" / "proche restaurant" / "cote restaurant" → rangée 200 (la plus proche côté resto)
  // (rangée 100 est spéciale : seulement 3 transats + salons, pas de placement auto conseillé)
  const pProche = [
    /\bproche\s*(?:du\s*)?(?:resto|restaurant)\b/,
    /\bcote\s*(?:du\s*)?(?:resto|restaurant)\b/,
    /\brestaurant\s*side\b/,
    /\bnear\s*(?:the\s*)?restaurant\b/,
  ];
  if(pProche.some(p=>p.test(t))) return 200;

  // "1ere ligne" / "ligne 1" / "front row" → 500 (1ère ligne mer = la plus loin du resto)
  const p1 = [
    /\b1\s*(?:ere?|re?|st)?\s*(?:ligne|rang(?:ee?)?|row)\b/,
    /(?:ligne|rang(?:ee?)?|row)\s*(?:n[o°]?\s*)?1\b/,
    /\bfront\s*row\b/,
    /\b1st\s*row\b/,
    /\bpremiere?\s*(?:ligne|rang)/,
    /\brang(?:ee?)?\s*1\b/,
    /\b1\s*(?:ere?|re?)?\s*ligne\b/,
  ];
  if(p1.some(p=>p.test(t))) return 500;

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

// Détecte si le client veut un transat "en extrémité" (col 1 ou col 20, bouts de rangée)
function parseExtremiteFromText(txt){
  if(!txt) return false;
  const t = txt.toLowerCase()
    .replace(/[èéêë]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[îï]/g,'i').replace(/[ôö]/g,'o');
  return (
    /\bextremit[e]?\b/.test(t) ||
    /\bau\s*bout\b/.test(t) ||
    /\bbout\s*(?:de\s*(?:la\s*)?)?(?:rang|ligne|row)\b/.test(t) ||
    /\ben\s*bout\b/.test(t) ||
    /\bcoin\s*(?:de\s*(?:la\s*)?)?(?:rang|ligne)\b/.test(t) ||
    /\bextreme\b/.test(t) ||
    /\bend\s*(?:of\s*(?:the\s*)?)?(?:row|line)\b/.test(t) ||
    /\bcorner\s*(?:spot|place|transat)\b/.test(t)
  );
}

function zcToResa(b){
  const cf = b.custom_field || {};
  const typeExp = cf['quel-type-dexperience'] || '';

  // ── Tous les champs texte libres (commentaires, notes internes, champs custom…)
  // On cherche les infos transats PARTOUT pour ne rien rater
  const allTextFields = [
    b.comment, b.note, b.internal_note, b.extra_comment, b.customer_comment,
    b.preparation, b.occasion, b.special_request,
    cf['commentaire'], cf['note'], cf['demande-speciale'], cf['special-request'],
    cf['information-complementaire'], cf['information-complementaires'],
  ].filter(Boolean).join(' | ');

  // Nb transats : priorité au champ structuré, puis scan de tous les textes
  const nbTransatsForm = parseInt(cf['de-combien-de-transats-avez-vous-besoin']) || 0;
  const nbTransatsText = parseTransatsFromText(allTextFields);
  const nbTransats = nbTransatsForm > 0 ? nbTransatsForm : nbTransatsText;

  // Rangée préférentielle : "1ere ligne" → 500, "proche resto" → 200, etc.
  const preferredRow = parsePreferredRowFromText(allTextFields);
  // Préférence extrémité : "en extrémité", "au bout" → slot 1 ou 20
  const preferExtremite = parseExtremiteFromText(allTextFields);

  const heureTransats = cf['horaire-souhaite-pour-les-transats-entre-10h-et-14h30'] || null;
  const comment = b.comment || b.note || '';
  const isRepasTransat = typeExp.toLowerCase().includes('transat');
  const isTablePlusTransat = typeExp.toLowerCase().includes('table') && typeExp.toLowerCase().includes('transat');
  // Convention La Playa : uniquement 13h00 pile = repas transat
  const is13h00 = (b.time || '').startsWith('13:00');
  const isRepasTransatFinal = (isRepasTransat && !isTablePlusTransat) || (is13h00 && !isTablePlusTransat);

  // Heure : "13:00" -> "13h00"
  const timeRaw = b.time || '12:00';
  const time = timeRaw.replace(':','h').substring(0,5);

  // Service selon shift name ou heure
  const shiftName = (b.shift_slot && b.shift_slot.shift && b.shift_slot.shift.name) || '';
  const h = parseFloat(timeRaw.replace(':','.'));
  let svc = 's1';
  if(shiftName.toLowerCase().includes('soir') || h >= 19) svc = 'soir';
  else if(h >= 14) svc = 's2';
  else svc = 's1';
  // Les repas transats auront svc='transats' pour forcer couleur bleue RT
  // (sera corrigé après calcul de isRepasTransatFinal)

  // Statut
  let ns = false, zenchef_status = b.status || 'waiting';
  if(b.status === 'noshow' || b.attendance_customer === 0) ns = true;
  const isCancelled = ['cancelled','rejected','deleted','no_show_cancelled'].includes(b.status);
  // Log pour debug resas en attente
  if(b.phase === 'waiting_list' || b.status === 'waiting'){
    console.log('ATTENTE:', b.lastname, b.firstname, 'status:', b.status, 'phase:', b.phase, 'shift_date:', b.shift_date, 'time:', b.time);
  }

  // Nom propre
  const rawFirst = (b.firstname||'').trim();
  const rawLast = (b.lastname||'').trim();
  const capWord = w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';
  const nameFmt = [capWord(rawLast), capWord(rawFirst)].filter(Boolean).join(' ');
  const name = nameFmt || rawFirst || rawLast || 'Sans nom';

  // Forcer svc='transats' pour les repas transats purs → couleur bleue RT
  const svcFinal = isRepasTransatFinal ? 'transats' : svc;

  return {
    _cancelled: isCancelled,
    _isTablePlusTransat: isTablePlusTransat,
    _nbTransats: nbTransats,
    _preferredRow: preferredRow,
    _preferExtremite: preferExtremite,
    _svc: svcFinal,
    resa: mkResa({
      zenchef_id: String(b.id),
      source: 'zenchef',
      origin: b.type || 'widget',
      name,
      phone: b.phone_number || null,
      email: b.email || null,
      pax: b.nb_guests || 1,
      time,
      date: b.shift_date || b.day || null,
      comment: b.comment || '',
      tags: [],
      svc: svcFinal,
      repas_transat: isRepasTransatFinal,
      tr: nbTransats > 0 ? nbTransats : null,
      ns,
      zenchef_status,
      waiting: b.phase === 'waiting_list',
      placed: false,
      tableId: null,
      slot: null,
      booked_at: b.date || b.created_at || null,
      time_transats: heureTransats || null,
      row_transats: preferredRow,      // rangée préférentielle détectée dans les commentaires
      pref_extremite: preferExtremite, // veut un slot en extrémité (col 1 ou 20)
    })
  };
}

// ── Fetch une page de bookings
async function fetchZcPage(page){
  const url = ZC_API + '/bookings?limit=250' + (page > 1 ? '&page=' + page : '');
  const res = await fetch(url, {
    headers: {
      'auth-token': ZC_TOKEN,
      'restaurantId': ZC_RESTAURANT_ID,
      'Content-Type': 'application/json'
    }
  });
  if(!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

// ── Helpers
const zcDateRange = (data) => {
  const dates = (data||[]).map(b=>b.shift_date||b.day||'').filter(Boolean);
  if(!dates.length) return {min:null, max:null};
  return { min: dates.reduce((a,b)=>a<b?a:b), max: dates.reduce((a,b)=>a>b?a:b) };
};
const zcFilter = (data, date) => (data||[]).filter(b=>(b.shift_date||b.day||'').startsWith(date));

// ── Fetch TOUTES les pages et cache TOUTES les dates trouvées en une seule passe
// L'API Zenchef trie par date de CRÉATION → on ne peut pas chercher par date de service.
// Solution : on fetch tout, on groupe par date, on cache tout.
// Résultat : après ce premier fetch, TOUT changement de date est instantané (cache local).
let _fetchAllInProgress = null; // singleton — évite les doublons si appelé deux fois
async function fetchAllPagesAndCacheAll(onProgress){
  // Si déjà en cours, on attend la même promesse
  if(_fetchAllInProgress) return _fetchAllInProgress;

  _fetchAllInProgress = (async () => {
    const p1full = await fetchZcPage(1);
    const p1data = p1full.data || [];
    const total  = p1full.paginator?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / 250));
    if(onProgress) onProgress(1, totalPages);

    const BATCH = 10;
    let allData = [...p1data];
    for(let start = 2; start <= totalPages; start += BATCH){
      const pageNums = [];
      for(let p = start; p < start + BATCH && p <= totalPages; p++) pageNums.push(p);
      const results = await Promise.all(pageNums.map(p => fetchZcPage(p).then(r => r.data || [])));
      results.forEach(rows => allData = allData.concat(rows));
      if(onProgress) onProgress(Math.min(start + BATCH - 1, totalPages), totalPages);
    }

    // Grouper par date de service et tout cacher d'un coup
    const byDate = {};
    allData.forEach(b => {
      const d = (b.shift_date || b.day || '').substring(0, 10);
      if(d){ if(!byDate[d]) byDate[d]=[]; byDate[d].push(b); }
    });
    const ts = Date.now();
    let cacheErrors = 0;
    Object.entries(byDate).forEach(([d, bk]) => {
      try{ localStorage.setItem('playa_zc_' + d, JSON.stringify({ts, data:bk})); }
      catch(e){ cacheErrors++; }
    });
    if(cacheErrors > 0) console.warn('Zenchef cache: ' + cacheErrors + ' dates non sauvegardées (localStorage plein ?)');
    zcMarkFullFetch();

    console.log('Zenchef pool: ' + allData.length + ' bookings · ' + totalPages + ' pages · ' + Object.keys(byDate).length + ' dates cachées');
    return byDate;
  })();

  try { return await _fetchAllInProgress; }
  finally { _fetchAllInProgress = null; }
}

// ── Retourne les bookings d'une date — cache instantané ou fetch complet
async function fetchZcForDate(date, onProgress){
  // 1. Cache valide → retour immédiat
  const cached = zcCacheGet(date);
  if(cached !== null) return cached;

  // 2. Un fetch complet récent a eu lieu mais cette date n'était pas dedans → 0 resas
  if(zcFullFetchAge() < ZC_CACHE_TTL_NOW){
    console.log('Zenchef: ' + date + ' non trouvée dans le pool récent → 0 resas');
    return [];
  }

  // 3. Fetch complet (cache toutes les dates)
  const byDate = await fetchAllPagesAndCacheAll(onProgress);
  return byDate[date] || [];
}

// ── Préchauffage silencieux au démarrage
// Déclenché après l'affichage initial — pré-remplit le cache de toutes les dates
function warmZenchefCache(){
  if(zcFullFetchAge() < ZC_CACHE_TTL_NOW) return; // cache encore frais, inutile
  setTimeout(() => {
    fetchAllPagesAndCacheAll().catch(() => {});
  }, 1500); // laisser l'UI se stabiliser d'abord
}
// ── Applique une liste de bookings bruts dans reservations[]
function applyBookings(bookings, date){
  let added = 0, dupes = 0, cancelled = 0;
  function isDupe(zcId){
    return Object.values(reservations).flat().some(r => r.zenchef_id === zcId);
  }
  bookings.forEach(b => {
    const conv = zcToResa(b);
    if(conv._cancelled){ cancelled++; return; }
    if(isDupe(String(b.id))){ dupes++; return; }
    const svc = conv._svc;
    const tab = svc === 's2' ? 's2' : svc === 'soir' ? 'soir' : 's1';
    if(conv.resa.repas_transat){
      reservations.transats.push({...conv.resa, slot: null});
    } else {
      reservations[tab].push({...conv.resa, tableId: null});
    }
    added++;
    // Créer une sous-resa transats dès qu'il y a des transats détectés ET que ce n'est pas déjà
    // un repas transat pur (sinon double-compte). Inclut : table+transat, et toute resa avec
    // transats mentionnés dans les commentaires (même sans champ structuré Zenchef).
    if(!conv.resa.repas_transat && conv._nbTransats > 0){
      const trResa = mkResa({
        zenchef_id: String(b.id) + '_tr',
        source: 'zenchef',
        name: conv.resa.name,
        phone: conv.resa.phone,
        email: conv.resa.email,
        pax: conv.resa.pax,
        time: conv.resa.time,
        date: conv.resa.date,
        comment: conv.resa.comment,
        svc,
        repas_transat: false,
        tr: conv._nbTransats,
        ns: conv.resa.ns,
        zenchef_status: conv.resa.zenchef_status,
        placed: false, slot: null,
        row_transats: conv._preferredRow,      // rangée préférentielle (ex: 500 = 1ere ligne)
        pref_extremite: conv._preferExtremite, // veut extrémité
      });
      reservations.transats.push(trResa);
    }
  });
  return { added, dupes, cancelled };
}

// ── Sync principale
async function syncZenchef(date){
  const btn = document.getElementById('sync-btn');
  const icon = document.getElementById('sync-icon');
  const ageEl = document.getElementById('sync-age');
  if(!date) date = currentDate;

  // ── ÉTAPE 1 : afficher le cache instantanément si dispo
  const cached = zcCacheGet(date);
  if(cached){
    reservations = {s1:[], s2:[], transats:[], soir:[]};
    fused = {s1:[],s2:[],transats:[],soir:[]};
    selectedId = null;
    saveUndo();
    applyBookings(cached, date);
    lastSyncAt = new Date();
    render();
    if(ageEl){ ageEl.textContent='cache'; ageEl.className='sync-age fresh'; }
    // Mise à jour silencieuse en arrière-plan — rechauffe TOUTES les dates d'un coup
    if(btn){ btn.style.opacity='0.5'; btn.style.pointerEvents='none'; }
    if(icon) icon.style.animation = 'spin 1s linear infinite';
    fetchAllPagesAndCacheAll().then(byDate=>{
      const bookings = byDate[date] || [];
      reservations = {s1:[], s2:[], transats:[], soir:[]};
      fused = {s1:[],s2:[],transats:[],soir:[]};
      selectedId = null;
      applyBookings(bookings, date);
      lastSyncAt = new Date();
      updateSyncAge();
      render();
    }).catch(()=>{}).finally(()=>{
      if(btn){ btn.style.opacity='1'; btn.style.pointerEvents='auto'; }
      if(icon){ icon.style.animation=''; icon.textContent='⟳'; }
    });
    return;
  }

  // ── ÉTAPE 2 : pas de cache → chargement normal avec indicateur
  if(btn) { btn.style.opacity='0.6'; btn.style.pointerEvents='none'; }
  if(icon) icon.style.animation = 'spin 1s linear infinite';
  if(ageEl) { ageEl.textContent='chargement...'; ageEl.className='sync-age'; }

  try {
    const ageEl2 = document.getElementById('sync-age');
    const bookings = await fetchZcForDate(date, (cur, total)=>{
      if(ageEl2) ageEl2.textContent = 'page ' + cur + '/' + total;
    });
    zcCacheSet(date, bookings);
    console.log('Zenchef: ' + bookings.length + ' resas pour ' + date);

    saveUndo();
    const { added, dupes, cancelled } = applyBookings(bookings, date);
    lastSyncAt = new Date();
    updateSyncAge();
    render();
    // Le fetch complet vient d'être fait → toutes les dates sont déjà cachées
    // (fetchZcForDate a appelé fetchAllPagesAndCacheAll en interne)
    const msg = 'Zenchef ' + formatDateFR(date) + ' : ' + added + ' resas' +
      (dupes > 0 ? ' · ' + dupes + ' doublons' : '') +
      (cancelled > 0 ? ' · ' + cancelled + ' annulees' : '');
    toast(msg);

  } catch(e){
    toast('Erreur sync Zenchef : ' + e.message);
    console.error(e);
  }

  if(btn) { btn.style.opacity='1'; btn.style.pointerEvents='auto'; }
  if(icon) { icon.style.animation=''; icon.textContent='⟳'; }
}

// ── Mise à jour de l'indicateur "il y a X min"
function updateSyncAge(){
  const el = document.getElementById('sync-age');
  if(!el) return;
  if(!lastSyncAt){ el.textContent='jamais synced'; el.className='sync-age'; return; }
  const mins = Math.floor((Date.now() - lastSyncAt.getTime()) / 60000);
  if(mins < 1){ el.textContent='sync instant'; el.className='sync-age fresh'; }
  else if(mins < 5){ el.textContent='il y a ' + mins + ' min'; el.className='sync-age fresh'; }
  else if(mins < 15){ el.textContent='il y a ' + mins + ' min'; el.className='sync-age stale'; }
  else { el.textContent='il y a ' + mins + ' min'; el.className='sync-age stale'; }
}
setInterval(updateSyncAge, 30000); // refresh l'affichage toutes les 30s

// ── Auto-sync toutes les 5 min — refetch complet pour aujourd'hui et futur
function isToday(dateStr){
  return dateStr === new Date().toISOString().split('T')[0];
}
function startAutoSync(){
  if(syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(()=>{
    const today = new Date().toISOString().split('T')[0];
    // Pour les dates présentes/futures : rafraîchir le pool complet en background
    if(currentDate >= today){
      fetchAllPagesAndCacheAll().then(byDate => {
        const bookings = byDate[currentDate] || [];
        reservations = {s1:[], s2:[], transats:[], soir:[]};
        fused = {s1:[],s2:[],transats:[],soir:[]};
        selectedId = null;
        applyBookings(bookings, currentDate);
        lastSyncAt = new Date();
        updateSyncAge();
        render();
      }).catch(() => {});
    }
  }, 5 * 60 * 1000);
}

// Ferme avec Escape
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('import-modal') && document.getElementById('import-modal').style.display==='flex'){
      document.getElementById('import-modal').style.display='none';
    }
  }
});

