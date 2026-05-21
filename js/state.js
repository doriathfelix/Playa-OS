// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let currentTab = 0;
let dragId = null;
let touchDragActive = false;
let selectedId = null;
let fuseMode = false;
let fuseTargets = []; // pour tables (ids)
let fuseTrTargets = []; // pour transats (slot numbers)
let rushMode = false;
let undoStack = [];
let nextId = 200;
let fuseCounter = 1;

let fused = {s1:[],s2:[],transats:[],soir:[]};

// Doit être ici car appelée avant le chargement de utils.js
function loadExtra(){ try{ const d=localStorage.getItem('playa_extra'); return d?JSON.parse(d):{}; }catch(e){ return {}; } }

let extraTransats = loadExtra();

// ══════════════════════════════════════════
// STRUCTURE RÉSERVATION — compatible Zenchef
// Chaque résa contient :
//   id            : number (local, auto-incrémenté)
//   zenchef_id    : string|null — ID Zenchef (ex: "zc_abc123"), null si saisie manuelle
//   source        : 'zenchef'|'manual'|'phone' — origine de la résa
//   origin        : 'widget'|'google'|'tripadvisor'|'direct'|null — canal Zenchef
//   name          : string — nom client
//   phone         : string|null
//   email         : string|null
//   pax           : number
//   time          : string (ex: '12h30')
//   date          : string|null (ISO, ex: '2026-04-11') — pour import multi-jours
//   comment       : string — notes internes
//   tags          : string[] — labels Zenchef (ex: ['VIP','Anniversaire'])
//   svc           : 's1'|'s2'|'transats'|'soir'
//   repas_transat : boolean
//   tr            : number|null — nb transats (onglet transats)
//   placed        : boolean
//   tableId       : number|null
//   slot          : number|null
//   urgent        : boolean — arrivée imminente
//   ns            : boolean — no-show
//   zenchef_status: 'confirmed'|'pending'|'cancelled'|'noshow'|null
// ══════════════════════════════════════════

// Helper : crée une résa avec valeurs par défaut (usage manuel + import Zenchef)
function mkResa(fields){
  return {
    id: fields.id ?? nextId++,
    zenchef_id: fields.zenchef_id ?? null,
    source: fields.source ?? 'manual',
    origin: fields.origin ?? null,
    name: fields.name ?? '',
    phone: fields.phone ?? null,
    email: fields.email ?? null,
    pax: fields.pax ?? 2,
    time: fields.time ?? '12h00',
    date: fields.date ?? null,
    comment: fields.comment ?? '',
    tags: fields.tags ?? [],
    svc: fields.svc ?? 's1',
    repas_transat: fields.repas_transat ?? false,
    tr: fields.tr ?? null,
    placed: fields.placed ?? false,
    tableId: fields.tableId ?? null,
    slot: fields.slot ?? null,
    urgent: fields.urgent ?? false,
    ns: fields.ns ?? false,
    zenchef_status: fields.zenchef_status ?? null,
    waiting: fields.waiting ?? false, // en liste d'attente (pas encore confirmé)
    extraSlots: fields.extraSlots ?? null, // slots non-contigus (placement vertical)
    booked_at: fields.booked_at ?? null,
    time_transats: fields.time_transats ?? null,
    row_transats: fields.row_transats ?? null, // rangée préférentielle (500=1ere ligne mer, 400=2eme…)
    pref_extremite: fields.pref_extremite ?? false, // préfère un slot en extrémité (col 1 ou 20)
    requested_table_id: fields.requested_table_id ?? null, // table demandée explicitement ("table 5")
    bed: fields.bed ?? false, // lit double → BED_SLOTS
  };
}

// ── Import Zenchef : convertit un objet API Zenchef en résa PlayaOS
// À connecter quand l'API sera disponible
function importFromZenchef(zcBooking){
  return mkResa({
    zenchef_id: zcBooking.id,
    source: 'zenchef',
    origin: zcBooking.channel ?? null,        // 'widget','google','tripadvisor'...
    name: zcBooking.customer?.last_name ?? zcBooking.name,
    phone: zcBooking.customer?.phone ?? null,
    email: zcBooking.customer?.email ?? null,
    pax: zcBooking.party_size ?? zcBooking.covers,
    time: zcBooking.time,                     // format '12h30' ou à normaliser
    date: zcBooking.date ?? null,
    comment: zcBooking.comment ?? zcBooking.note ?? '',
    tags: zcBooking.tags ?? [],
    zenchef_status: zcBooking.status ?? 'confirmed',
  });
}

// ── Sync Zenchef : stub prêt à connecter
// async function syncZenchef(date){ 
//   const data = await fetchZenchefBookings(date); 
//   data.bookings.forEach(b => {
//     const resa = importFromZenchef(b);
//     const tab = detectService(resa.time); // détecte S1/S2/Soir selon heure
//     if(!reservations[tab].find(r=>r.zenchef_id===resa.zenchef_id))
//       reservations[tab].push(resa);
//   });
//   render();
// }

let reservations = {s1:[], s2:[], transats:[], soir:[]};

