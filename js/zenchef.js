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

  // ── Chemin ultra-rapide : pool mémoire frais → aucun accès réseau/localStorage
  const fromPool = memoryPoolGet(dateStr);
  if(fromPool !== undefined){
    reservations = {s1:[], s2:[], transats:[], soir:[]};
    fused = {s1:[],s2:[],transats:[],soir:[]};
    selectedId = null;
    saveUndo();
    applyBookings(fromPool, dateStr);
    lastSyncAt = new Date();
    updateSyncAge();
    render();
    return;
  }

  // ── Chemin normal : pas de pool → vider + charger (réseau ou localStorage)
  reservations = {s1:[], s2:[], transats:[], soir:[]};
  fused = {s1:[],s2:[],transats:[],soir:[]};
  selectedId = null;
  lastSyncAt = null;
  updateSyncAge();
  render(); // écran vide pendant chargement
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

// ── Cache IndexedDB + localStorage fallback
const ZC_CACHE_TTL_NOW  = 10 * 60 * 1000;  // 10 min pour aujourd'hui et futur
const ZC_CACHE_TTL_PAST = 24 * 60 * 60 * 1000; // 24h pour les dates passées
const ZC_FULL_FETCH_KEY = 'playa_zc_pool_ts';
let _zcDb = null; // IndexedDB connection

async function zcDbInit(){
  if(_zcDb) return _zcDb;
  return new Promise((resolve) => {
    const req = indexedDB.open('PlayaZenchef', 1);
    req.onerror = () => { console.warn('IndexedDB init failed'); resolve(null); };
    req.onsuccess = () => { _zcDb = req.result; resolve(_zcDb); };
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', {keyPath: 'date'});
      }
    };
  });
}

function zcCacheTTL(date){
  const today = new Date().toISOString().split('T')[0];
  return date < today ? ZC_CACHE_TTL_PAST : ZC_CACHE_TTL_NOW;
}

async function zcCacheGet(date){
  const db = await zcDbInit();
  if(db) {
    try{
      const tx = db.transaction('bookings', 'readonly');
      const store = tx.objectStore('bookings');
      const req = store.get(date);
      const result = await new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
      if(result && Date.now() - result.ts <= zcCacheTTL(date)) return result.data;
    } catch(e){}
  }
  // Fallback localStorage
  try{
    const raw = localStorage.getItem('playa_zc_' + date);
    if(!raw) return null;
    const {ts, data} = JSON.parse(raw);
    if(Date.now() - ts > zcCacheTTL(date)) return null;
    return data;
  } catch(e){ return null; }
}

async function zcCacheSet(date, data){
  const db = await zcDbInit();
  if(db) {
    try{
      const tx = db.transaction('bookings', 'readwrite');
      const store = tx.objectStore('bookings');
      store.put({date, ts: Date.now(), data});
    } catch(e){}
  }
  // Fallback localStorage
  try{ localStorage.setItem('playa_zc_' + date, JSON.stringify({ts: Date.now(), data})); }catch(e){}
}

function zcFullFetchAge(){
  try{ return Date.now() - parseInt(localStorage.getItem(ZC_FULL_FETCH_KEY)||'0'); }
  catch(e){ return Infinity; }
}
function zcMarkFullFetch(){
  try{ localStorage.setItem(ZC_FULL_FETCH_KEY, String(Date.now())); }catch(e){}
}

// ── Convertit un booking Zenchef en resa PlayaOS
// ── Détecte si le texte demande un bed/lit (BED_SLOTS) et combien
// "bed double", "double bed", "lit double", "bed" seul → 1 slot bed
// "2 beds" → 2 slots bed
// NOTE : "sunbed" est exclu (= transat ordinaire, traité par parseTransatsFromText)
function parseBedFromText(txt){
  if(!txt) return 0;
  const t = txt.toLowerCase();
  // Exclure "sunbed" pour ne pas confondre
  const noSunbed = t.replace(/sunbeds?/gi, '');
  // "bed double" / "double bed" / "lit double" = 1 slot
  if(/\b(bed\s*double|double\s*bed|lit\s*double)\b/.test(noSunbed)) return 1;
  // "2 beds", "3 beds"
  const m = noSunbed.match(/(\d+)\s*x?\s*beds?\b/);
  if(m) return parseInt(m[1]);
  // "bed" seul
  if(/\bbed\b/.test(noSunbed)) return 1;
  return 0;
}

// ── Extrait le nb de transats ordinaires depuis n'importe quel champ texte libre
// Formes supportées : "6 transats", "8transats", "2T", "T:2", "T 4",
//                     "3 matelas", "chaise longue x2", "sunbed", etc.
function parseTransatsFromText(txt){
  if(!txt) return 0;
  const patterns = [
    /(\d+)\s*x?\s*transats?/i,           // "6 transats", "8transats", "2x transats"
    /transats?\s*[x:=]?\s*(\d+)/i,       // "transats: 4", "transat=3"
    /\bT\s*[:=]?\s*(\d+)/,               // "T: 2", "T=2", "T2", "T 4"
    /(\d+)\s*T\b/,                        // "2T", "8T"
    /(\d+)\s*x?\s*matelas?/i,
    /(\d+)\s*x?\s*chaises?\s*(?:longues?|de\s*plage)/i,
    /(\d+)\s*x?\s*chaise\s*longue/i,
    /(\d+)\s*x?\s*sunbeds?/i,
    /(\d+)\s*x?\s*parasols?/i,
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

// "en 501", "slot 501", "n°315", "#412" → numéro de slot → rangée = Math.floor(slot/100)*100
// Couvre les notes comme "2T en 501" ou "transats n°315"
function parseSlotFromText(txt){
  if(!txt) return null;
  const t = txt.toLowerCase().replace(/[°oa]/g,'o');
  const patterns = [
    /\ben\s*(\d{3})\b/,          // "en 501"
    /\bslot\s*(\d{3})\b/,        // "slot 501"
    /\bn[o°]?\s*(\d{3})\b/,      // "n°315", "no315"
    /#(\d{3})\b/,                 // "#412"
  ];
  for(const p of patterns){
    const m = t.match(p);
    if(m){
      const slot=parseInt(m[1]);
      if(slot>=101 && slot<=521) return slot;
    }
  }
  return null;
}

function zcToResa(b){
  const cf = b.custom_field || {};
  const typeExp = cf['quel-type-dexperience'] || '';

  // ── Tous les champs texte libres — scan exhaustif de TOUS les champs string du booking
  // (couvre "note sur la réservation" et tout champ ajouté manuellement via l'UI Zenchef)
  const allTextFromB = Object.values(b).filter(v => typeof v === 'string' && v.trim()).join(' | ');
  const allTextFromCf = Object.values(cf).filter(v => typeof v === 'string' && v.trim()).join(' | ');
  const allTextFields = [allTextFromB, allTextFromCf].filter(Boolean).join(' | ');

  // Nb transats : tous les champs texte libres prennent le dessus sur le formulaire structuré
  const nbTransatsText = parseTransatsFromText(allTextFields);
  const nbTransatsForm = parseInt(cf['de-combien-de-transats-avez-vous-besoin']) || 0;
  let nbTransats = nbTransatsText > 0 ? nbTransatsText : nbTransatsForm;

  // Beds (lit double) — détectés séparément, ne comptent pas comme transats ordinaires
  const nbBeds = parseBedFromText(allTextFields);
  const isBed  = nbBeds > 0;

  // Si type "repas à table + transat" sans nb indiqué → autant de transats que de PAX
  const isTablePlusTransat = typeExp.toLowerCase().includes('table') && typeExp.toLowerCase().includes('transat');
  if(isTablePlusTransat && nbTransats === 0 && !isBed) nbTransats = b.nb_guests || 1;

  // Rangée préférentielle : scan de tous les champs texte
  const preferredRow = parsePreferredRowFromText(allTextFields)
    || (()=>{ const s=parseSlotFromText(allTextFields); return s?Math.floor(s/100)*100:null; })();
  // Préférence extrémité : "en extrémité", "au bout" → slot 1 ou 20
  const preferExtremite = parseExtremiteFromText(allTextFields);

  const heureTransats = cf['horaire-souhaite-pour-les-transats-entre-10h-et-14h30'] || null;
  // Note affichée : champs texte libre uniquement (pas les dropdowns structurés comme typeExp)
  const noteDisplay = [
    b.comment, b.note, b.internal_note, b.extra_comment, b.customer_comment,
    b.preparation, b.occasion, b.special_request,
  ].filter(v => v && typeof v === 'string' && v.trim()).join(' · ');
  const isRepasTransat = typeExp.toLowerCase().includes('transat');
  // Convention La Playa : uniquement 13h00 pile = repas transat
  const is13h00 = (b.time || '').startsWith('13:00');
  // Transat mentionné dans les notes (même sans nombre précis) → équivaut à avoir des transats
  const mentionsTransatsInText = nbTransats > 0 || /\btransats?\b/i.test(allTextFields);
  const isRepasTransatFinal = (isRepasTransat && !isTablePlusTransat) || (is13h00 && mentionsTransatsInText);

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
    _isBed: isBed,
    _nbBeds: nbBeds,
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
      comment: noteDisplay,
      tags: [],
      svc: svcFinal,
      repas_transat: isRepasTransatFinal,
      tr: nbTransats > 0 ? nbTransats : (isRepasTransatFinal ? (b.nb_guests || 1) : null),
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

// ── Fetch une page de bookings (dateFilter optionnel : 'YYYY-MM-DD')
async function fetchZcPage(page, dateFilter){
  let url = ZC_API + '/bookings?limit=250';
  if(dateFilter) url += '&date_min=' + dateFilter + '&date_max=' + dateFilter;
  if(page > 1) url += '&page=' + page;
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

// ── Voie rapide : fetch filtré par date (1-2 requêtes si l'API supporte date_min/date_max)
// Renvoie { filtered:true, bookings } ou { filtered:false, p1data, totalPages } pour réutilisation
async function fetchZcDateFiltered(date, onProgress){
  const p1 = await fetchZcPage(1, date);
  const data = p1.data || [];
  const total = p1.paginator?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / 250));
  if(total > 400) return { filtered: false, p1data: data, totalPages };
  if(onProgress) onProgress(1, totalPages);
  if(totalPages === 1) return { filtered: true, bookings: data };
  // Quelques pages max (jour très chargé) → tout en parallèle (max 2-3 pages)
  const rest = await Promise.all(
    Array.from({length: totalPages - 1}, (_, i) =>
      fetchZcPage(i + 2, date).then(r => r.data || [])
    )
  );
  if(onProgress) onProgress(totalPages, totalPages);
  return { filtered: true, bookings: [...data, ...rest.flat()] };
}

// ── Helpers
const zcDateRange = (data) => {
  const dates = (data||[]).map(b=>b.shift_date||b.day||'').filter(Boolean);
  if(!dates.length) return {min:null, max:null};
  return { min: dates.reduce((a,b)=>a<b?a:b), max: dates.reduce((a,b)=>a>b?a:b) };
};
const zcFilter = (data, date) => (data||[]).filter(b=>(b.shift_date||b.day||'').startsWith(date));

// ── Pool mémoire — évite tout accès localStorage/réseau pour les changements de date
// Rempli après chaque fetch complet. Tant qu'il est frais, setDate() est instantané.
let _memoryPool = null; // { ts: Number, byDate: { 'YYYY-MM-DD': [bookings] } }

function memoryPoolGet(date){
  if(!_memoryPool) return undefined; // undefined = pas de pool
  if(Date.now() - _memoryPool.ts > ZC_CACHE_TTL_NOW) return undefined; // pool périmé
  // La date peut être absente du pool (= 0 resas ce jour-là) → on retourne []
  return _memoryPool.byDate[date] !== undefined ? _memoryPool.byDate[date] : [];
}

// ── Fetch TOUTES les pages et cache TOUTES les dates trouvées en une seule passe
// L'API Zenchef trie par date de CRÉATION → on ne peut pas chercher par date de service.
// Solution : on fetch tout, on groupe par date, on cache tout.
// onProgress(cur, total)  : avancement pages
// onDateReady(date, bkgs) : appelé dès qu'on a des données pour une date ciblée (affichage progressif)
let _fetchAllInProgress = null;
// p1Prefetch : { p1data, totalPages } pour réutiliser la page 1 déjà chargée par fetchZcDateFiltered
async function fetchAllPagesAndCacheAll(onProgress, onDateReady, targetDate, p1Prefetch){
  if(_fetchAllInProgress) return _fetchAllInProgress;

  _fetchAllInProgress = (async () => {
    let p1data, totalPages;
    if(p1Prefetch){
      p1data = p1Prefetch.p1data;
      totalPages = p1Prefetch.totalPages;
    } else {
      const p1full = await fetchZcPage(1);
      p1data = p1full.data || [];
      const total = p1full.paginator?.total || 0;
      totalPages = Math.max(1, Math.ceil(total / 250));
    }
    if(onProgress) onProgress(1, totalPages);

    const byDate = {};
    const addToBD = (rows) => {
      rows.forEach(b => {
        const d = (b.shift_date || b.day || '').substring(0, 10);
        if(d){ if(!byDate[d]) byDate[d]=[]; byDate[d].push(b); }
      });
    };
    addToBD(p1data);

    // Notifier si la date cible est déjà dans la page 1
    if(onDateReady && targetDate && byDate[targetDate])
      onDateReady(targetDate, byDate[targetDate]);

    const BATCH = 12; // batches de 12 — 2× plus rapide que 6 sans saturer l'API
    for(let start = 2; start <= totalPages; start += BATCH){
      const pageNums = Array.from(
        {length: Math.min(BATCH, totalPages - start + 1)},
        (_, i) => start + i
      );
      const results = await Promise.all(pageNums.map(p => fetchZcPage(p).then(r => r.data || [])));
      results.forEach(rows => addToBD(rows));
      if(onProgress) onProgress(Math.min(start + BATCH - 1, totalPages), totalPages);
      if(onDateReady && targetDate && byDate[targetDate])
        onDateReady(targetDate, byDate[targetDate]);
    }

    // Stocker en mémoire
    _memoryPool = { ts: Date.now(), byDate };

    // Persister dans localStorage
    const ts = Date.now();
    let cacheErrors = 0;
    Object.entries(byDate).forEach(([d, bk]) => {
      try{ localStorage.setItem('playa_zc_' + d, JSON.stringify({ts, data:bk})); }
      catch(e){ cacheErrors++; }
    });
    if(cacheErrors > 0) console.warn('ZC cache: ' + cacheErrors + ' dates non sauvegardées (localStorage plein)');
    zcMarkFullFetch();
    console.log('ZC pool: ' + Object.values(byDate).flat().length + ' bookings · ' + totalPages + ' pages · ' + Object.keys(byDate).length + ' dates');
    return byDate;
  })();

  try { return await _fetchAllInProgress; }
  finally { _fetchAllInProgress = null; }
}

// ── Retourne les bookings d'une date — cache instantané ou fetch complet
async function fetchZcForDate(date, onProgress, onDateReady){
  // 1. Cache localStorage valide → retour immédiat
  const cached = await zcCacheGet(date);
  if(cached !== null) return cached;

  // 2. Pool mémoire frais → source de vérité fiable (construit depuis un fetch réel)
  if(_memoryPool && Date.now() - _memoryPool.ts <= ZC_CACHE_TTL_NOW){
    return _memoryPool.byDate[date] || [];
  }

  // 3. Aucune source fraîche → fetch complet progressif
  const byDate = await fetchAllPagesAndCacheAll(onProgress, onDateReady, date);
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
    // Sous-resa transats ordinaires (table+transat, ou transats mentionnés dans les commentaires)
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
        row_transats: conv._preferredRow,
        pref_extremite: conv._preferExtremite,
      });
      reservations.transats.push(trResa);
    }
    // Sous-resa bed (lit double) — routée vers BED_SLOTS (101-103, 219-221)
    if(!conv.resa.repas_transat && conv._isBed){
      const bedResa = mkResa({
        zenchef_id: String(b.id) + '_bed',
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
        tr: conv._nbBeds,
        bed: true,
        ns: conv.resa.ns,
        zenchef_status: conv.resa.zenchef_status,
        placed: false, slot: null,
        row_transats: null,
        pref_extremite: false,
      });
      reservations.transats.push(bedResa);
    }
  });
  return { added, dupes, cancelled };
}

// ── Helpers UI sync
function zcSetProgress(pct){ // pct = 0-100 ou null (masquer)
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
  if(btn){
    btn.style.opacity = on ? '0.75' : '1';
    btn.style.pointerEvents = on ? 'none' : 'auto';
  }
}

// ── Sync principale
async function syncZenchef(date){
  if(!date) date = currentDate;

  // ── ÉTAPE 1 : cache (IndexedDB/localStorage) valide → retour immédiat
  const cached = await zcCacheGet(date);
  if(cached){
    reservations = {s1:[], s2:[], transats:[], soir:[]};
    fused = {s1:[],s2:[],transats:[],soir:[]};
    selectedId = null;
    saveUndo();
    applyBookings(cached, date);
    lastSyncAt = new Date();
    updateSyncAge();
    render();

    // Refresh silencieux en arrière-plan si pool périmé
    if(zcFullFetchAge() > ZC_CACHE_TTL_NOW){
      zcSetSpinner(true);
      zcSetLabel('actualisation…');
      fetchAllPagesAndCacheAll(
        (cur, total) => { zcSetProgress(Math.round(cur/total*100)); },
        null, date
      ).then(byDate=>{
        const bkgs = byDate[date] || [];
        reservations = {s1:[], s2:[], transats:[], soir:[]};
        fused = {s1:[],s2:[],transats:[],soir:[]};
        selectedId = null;
        applyBookings(bkgs, date);
        lastSyncAt = new Date();
        updateSyncAge();
        render();
      }).catch(()=>{}).finally(()=>{
        zcSetSpinner(false);
        zcSetProgress(null);
      });
    }
    return;
  }

  // ── ÉTAPE 2 : pas de cache → voie rapide (filtre date) ou fetch complet parallèle
  zcSetSpinner(true);
  zcSetProgress(10);
  zcSetLabel('connexion Zenchef…');
  reservations = {s1:[], s2:[], transats:[], soir:[]};
  fused = {s1:[],s2:[],transats:[],soir:[]};
  selectedId = null;
  render();

  try {
    // Tentative voie rapide : filtre date API (1-2 requêtes si supporté)
    let fast = null;
    try {
      fast = await fetchZcDateFiltered(date, (cur, total) => {
        zcSetProgress(Math.round(10 + (cur/total) * 80));
        zcSetLabel(total <= 1 ? 'chargement…' : 'chargement ' + cur + '/' + total + ' pages…');
      });
    } catch(e){ fast = null; }

    if(fast !== null && fast.filtered){
      // Filtre API fonctionnel — résultats en 1-2 requêtes
      zcSetProgress(100);
      zcCacheSet(date, fast.bookings);
      const { added, dupes, cancelled } = applyBookings(fast.bookings, date);
      lastSyncAt = new Date();
      updateSyncAge();
      render();
      const msg = formatDateFR(date) + ' · ' + added + ' resas' +
        (cancelled > 0 ? ' · ' + cancelled + ' annulées' : '') +
        (dupes > 0 ? ' · ' + dupes + ' doublons' : '');
      toast('✓ Zenchef — ' + msg);
      // Remplir le pool en background pour navigation entre dates — réutiliser p1 existante
      fetchAllPagesAndCacheAll(null, null, null, fast.filtered ? null : {p1data: fast.p1data, totalPages: fast.totalPages}).catch(()=>{});
    } else if(fast !== null && !fast.filtered){
      // Filtre API non supporté → fetch complet avec p1 réutilisée
      let firstDataShown = false;
      const bookings = await fetchZcForDate(
        date,
        (cur, total) => {
          zcSetProgress(Math.round(cur/total*100));
          zcSetLabel('chargement ' + cur + '/' + total + ' pages…');
        },
        (d, bkgs) => {
          if(firstDataShown) return;
          firstDataShown = true;
          reservations = {s1:[], s2:[], transats:[], soir:[]};
          fused = {s1:[],s2:[],transats:[],soir:[]};
          selectedId = null;
          applyBookings(bkgs, date);
          lastSyncAt = new Date();
          render();
          zcSetLabel('mise à jour…');
        }
      );
      zcCacheSet(date, bookings);
      const { added, dupes, cancelled } = applyBookings(bookings, date);
      lastSyncAt = new Date();
      updateSyncAge();
      render();
      const msg = formatDateFR(date) + ' · ' + added + ' resas' +
        (cancelled > 0 ? ' · ' + cancelled + ' annulées' : '') +
        (dupes > 0 ? ' · ' + dupes + ' doublons' : '');
      toast('✓ Zenchef — ' + msg);
    } else {
      // Voie classique : fetch complet tout-parallèle avec affichage progressif
      let firstDataShown = false;
      const bookings = await fetchZcForDate(
        date,
        (cur, total) => {
          zcSetProgress(Math.round(cur/total*100));
          zcSetLabel('chargement ' + cur + '/' + total + ' pages…');
        },
        (d, bkgs) => {
          if(firstDataShown) return;
          firstDataShown = true;
          reservations = {s1:[], s2:[], transats:[], soir:[]};
          fused = {s1:[],s2:[],transats:[],soir:[]};
          selectedId = null;
          applyBookings(bkgs, date);
          lastSyncAt = new Date();
          render();
          zcSetLabel('mise à jour…');
        }
      );
      zcCacheSet(date, bookings);
      const { added, dupes, cancelled } = applyBookings(bookings, date);
      lastSyncAt = new Date();
      updateSyncAge();
      render();
      const msg = formatDateFR(date) + ' · ' + added + ' resas' +
        (cancelled > 0 ? ' · ' + cancelled + ' annulées' : '') +
        (dupes > 0 ? ' · ' + dupes + ' doublons' : '');
      toast('✓ Zenchef — ' + msg);
    }

  } catch(e){
    zcSetLabel('⚠ erreur réseau', 'stale');
    console.error('Zenchef sync error:', e);
    const ageEl = document.getElementById('sync-age');
    if(ageEl){
      ageEl.innerHTML = '⚠ échec — <span style="text-decoration:underline;cursor:pointer" onclick="syncZenchef()">réessayer</span>';
    }
  }

  zcSetSpinner(false);
  zcSetProgress(null);
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

