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
// Démarrer sur le dashboard (sidebar toujours visible)
goModule('dash');
// Sync Zenchef au démarrage puis auto toutes les 5 min
setTimeout(()=>{ syncZenchef(); startAutoSync(); }, 800);
// Préchauffage cache : si le pool est périmé, fetch tout en arrière-plan
// dès que la date initiale est chargée → les changements de date suivants seront instantanés
setTimeout(()=>{ warmZenchefCache(); }, 3000);

// Drag tactile : long press sur carte sidebar → poser sur table/transat
initTouchDrag();

