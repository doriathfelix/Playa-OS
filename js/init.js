// ══════════════════════════
// INIT
// ══════════════════════════
// Reset FORCÉ de tout ce qui concerne le layout des tables
// (nettoie les corruptions de localStorage)
(function(){
  try{ localStorage.removeItem('playa_table_order'); }catch(e){}
  try{ localStorage.removeItem('playa_table_pos'); }catch(e){}
  tableOrder = null;
  tablePositions = {};
  console.log('Plan de salle réinitialisé proprement');
})();

// Initialiser le date picker avec aujourd'hui
updateDateDisplay(currentDate);
render();
// Mobile → service direct ; desktop → dashboard
if(window.innerWidth <= 767) goModule('service');
else goModule('dash');
// Sync Zenchef au démarrage puis auto toutes les 5 min
setTimeout(()=>{ syncZenchef(); startAutoSync(); }, 800);
// Préchauffage cache : si le pool est périmé, fetch tout en arrière-plan
// dès que la date initiale est chargée → les changements de date suivants seront instantanés
setTimeout(()=>{ warmZenchefCache(); }, 3000);
// CRM : import automatique si pas encore fait ou > 7 jours
setTimeout(()=>{ if(typeof crmEnsureHistory==='function') crmEnsureHistory(); }, 6000);

// Drag tactile : long press sur carte sidebar → poser sur table/transat
initTouchDrag();

// Nettoyage localStorage (entrées > 30 jours) + pull Gist si configuré
(function _initPlacements(){
  try{
    const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-30);
    const cs=cutoff.toISOString().split('T')[0];
    for(let i=localStorage.length-1;i>=0;i--){
      const k=localStorage.key(i);
      if(k&&k.startsWith(PL_LS_PFX)&&k.replace(PL_LS_PFX,'')<cs) localStorage.removeItem(k);
    }
  }catch(e){}
  if(gistToken&&gistId) gistPull();
})();

