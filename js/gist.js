// ══════════════════════════════════════════
// PERSISTANCE DES PLACEMENTS — localStorage + GitHub Gist
// ══════════════════════════════════════════
const GIST_TOKEN_KEY = 'playa_gist_token';
const GIST_ID_KEY    = 'playa_gist_id';
const GIST_FNAME     = 'playa_placements.json';
const PL_LS_PFX      = 'playa_placements_';

let gistToken    = localStorage.getItem(GIST_TOKEN_KEY) || '';
let gistId       = localStorage.getItem(GIST_ID_KEY)    || '';
let gistCache    = null;   // { 'YYYY-MM-DD': snap }
let gistSaveT    = null;   // debounce timer id
let gistSyncing  = false;
let gistLastSync = null;

// Sauvegarde locale + planifie la sync Gist (debounce 3s)
function savePlacements(date){
  if(!date || !totalResaCount()) return;
  const snap = snapshotPlacements();
  try{ localStorage.setItem(PL_LS_PFX+date, JSON.stringify(snap)); }catch(e){}
  if(gistCache) gistCache[date] = snap;
  if(gistToken && gistId){
    if(gistSaveT) clearTimeout(gistSaveT);
    gistSaveT = setTimeout(gistPush, 3000);
  }
}

// Lit les placements pour une date (cache Gist > localStorage)
function loadPlacements(date){
  if(!date) return null;
  if(gistCache && gistCache[date]) return gistCache[date];
  try{ const d=localStorage.getItem(PL_LS_PFX+date); return d?JSON.parse(d):null; }catch(e){ return null; }
}

// Pousse le cache local vers le Gist
async function gistPush(){
  if(!gistToken||!gistId||gistSyncing) return;
  gistSyncing=true; _gistUpdateStatus();
  try{
    // Copie défensive avant d'élaguer pour ne pas détruire le cache live si la requête échoue
    const all = Object.assign({}, gistCache || {});
    const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-30);
    const cs=cutoff.toISOString().split('T')[0];
    Object.keys(all).forEach(k=>{ if(k<cs) delete all[k]; });
    const r = await fetch('https://api.github.com/gists/'+gistId,{
      method:'PATCH',
      headers:{Authorization:'token '+gistToken,Accept:'application/vnd.github.v3+json','Content-Type':'application/json'},
      body:JSON.stringify({files:{[GIST_FNAME]:{content:JSON.stringify(all)}}})
    });
    if(r.ok){ gistLastSync=new Date(); }
  }catch(e){}
  gistSyncing=false; _gistUpdateStatus();
}

// Tire les données du Gist → peuple localStorage + restaure le jour courant
async function gistPull(){
  if(!gistToken||!gistId||gistSyncing) return;
  try{
    const r = await fetch('https://api.github.com/gists/'+gistId,{
      headers:{Authorization:'token '+gistToken,Accept:'application/vnd.github.v3+json'}
    });
    if(!r.ok) return;
    const data = await r.json();
    const content = data.files[GIST_FNAME]?.content;
    if(!content) return;
    const all = JSON.parse(content);
    gistCache = all;
    Object.entries(all).forEach(([d,snap])=>{
      try{ localStorage.setItem(PL_LS_PFX+d,JSON.stringify(snap)); }catch(e){}
    });
    gistLastSync=new Date(); _gistUpdateStatus();
    const snap=all[currentDate];
    if(snap && Object.keys(snap.placements||{}).length && totalResaCount()>0){
      restorePlacements(snap); render();
    }
  }catch(e){}
}

// Crée un nouveau Gist privé et retourne son ID
async function gistCreate(token){
  try{
    const r=await fetch('https://api.github.com/gists',{
      method:'POST',
      headers:{Authorization:'token '+token,Accept:'application/vnd.github.v3+json','Content-Type':'application/json'},
      body:JSON.stringify({description:'Playa-OS · placements tables & transats',public:false,files:{[GIST_FNAME]:{content:'{}'}}})
    });
    if(!r.ok) return null;
    return (await r.json()).id;
  }catch(e){ return null; }
}

// Met à jour l'indicateur de statut dans les réglages
function _gistUpdateStatus(){
  const el=document.getElementById('gist-status');
  if(!el) return;
  if(!gistToken||!gistId){ el.textContent='Non configuré'; el.style.color='var(--t4)'; return; }
  if(gistSyncing){ el.textContent='Sync…'; el.style.color='var(--ot)'; return; }
  if(gistLastSync){
    el.textContent='Sync '+gistLastSync.toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'});
    el.style.color='var(--gt)';
  } else { el.textContent='Connecté'; el.style.color='var(--gt)'; }
}
