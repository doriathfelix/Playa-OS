// ══════════════════════════════════════════
// MODAL — logique métier complète
// ══════════════════════════════════════════
let modalSvc = 's1';
let modalType = 'salle'; // 'salle' | 'rt' (repas transat)

function selectType(type){
  modalType = type;
  document.getElementById('f-type').value = type;
  // Boutons type
  document.getElementById('type-salle').className = 'svc-btn' + (type==='salle'?' on-s1':'');
  document.getElementById('type-rt').className = 'svc-btn' + (type==='rt'?' on-transats':'');
  // Blocs
  document.getElementById('bloc-salle').style.display = type==='salle'?'block':'none';
  document.getElementById('bloc-rt').style.display = type==='rt'?'block':'none';
}

function selectSvc(svc){
  modalSvc = svc;
  document.getElementById('f-svc').value = svc;
  ['s1','s2','soir'].forEach(s=>{
    const b=document.getElementById('svc-'+s);
    const onCls = s==='s1'?'on-s1':s==='s2'?'on-s2':'on-soir';
    if(b) b.className='svc-btn'+(svc===s?' '+onCls:'');
  });
  // Heure par défaut selon service
  const t={'s1':'12h00','s2':'14h15','soir':'19h30'};
  document.getElementById('f-time').value = t[svc]||'12h00';
}

function openModal(){
  // Pré-sélection selon onglet
  if(currentTab===2){
    // Onglet transats → repas transat par défaut
    selectType('rt');
    selectSvc('s1');
  } else {
    selectType('salle');
    const svcMap={0:'s1',1:'s2',3:'soir'};
    selectSvc(svcMap[currentTab]||'s1');
  }
  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(()=>document.getElementById('f-name').focus(),100);
}

function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
  ['f-name','f-pax','f-time','f-time-rt','f-tr','f-tr-rt','f-comment','f-phone']
    .forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  // Reset mode édition
  editingId=null;
  document.querySelector('.modal-title').textContent='Nouvelle réservation';
  document.querySelector('.modal-submit').textContent='Ajouter';
}

function submitModal(){
  const name=document.getElementById('f-name').value.trim(); if(!name) return;
  const pax=parseInt(document.getElementById('f-pax').value)||2;
  const comment=document.getElementById('f-comment').value.trim();
  const phone=document.getElementById('f-phone').value.trim()||null;
  const type=document.getElementById('f-type').value;

  // ── MODE EDITION : modifier la résa existante
  if(editingId!==null){
    saveUndo();
    const r=gr().find(x=>x.id===editingId);
    if(r){
      r.name=name; r.pax=pax; r.comment=comment; r.phone=phone;
      if(type==='rt'){
        r.time=document.getElementById('f-time-rt').value.trim()||r.time;
        r.tr=parseInt(document.getElementById('f-tr-rt').value)||pax;
        r.repas_transat=true;
      } else {
        r.svc=document.getElementById('f-svc').value;
        r.time=document.getElementById('f-time').value.trim()||r.time;
        const tr=parseInt(document.getElementById('f-tr').value)||0;
        r.tr=tr>0?tr:null;
        r.repas_transat=false;
      }
    }
    toast(`${name} modifié(e) ✓`);
    editingId=null;
    closeModal(); render(); showDetail(r.id); return;
  }

  // ── MODE CRÉATION
  const id=nextId++;

  if(type==='rt'){
    const time=document.getElementById('f-time-rt').value.trim()||'12h30';
    const tr=parseInt(document.getElementById('f-tr-rt').value)||pax;
    const resa=mkResa({id,name,pax,time,comment,phone,source:'manual',
      svc:'s1',repas_transat:true,tr,
    });
    reservations.transats.push({...resa,slot:null});
    toast(`${name} — Repas transat ajouté ✓`);

  } else {
    const svc=document.getElementById('f-svc').value;
    const time=document.getElementById('f-time').value.trim()||'12h00';
    const tr=parseInt(document.getElementById('f-tr').value)||0;
    const resa=mkResa({id,name,pax,time,comment,phone,source:'manual',
      svc,repas_transat:false,tr:tr>0?tr:null,
    });
    const tab=svc==='s2'?'s2':svc==='soir'?'soir':'s1';
    reservations[tab].push({...resa,tableId:null});
    if(tr>0){
      const trResa=mkResa({id:nextId++,name,pax,time,comment:'',phone:null,
        source:'manual',svc,repas_transat:false,tr,
      });
      reservations.transats.push({...trResa,slot:null});
      toast(`${name} ajouté(e) + ${tr} transats ✓`);
    } else {
      toast(`${name} ajouté(e) ✓`);
    }
  }

  closeModal(); render();
}
document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='z'){e.preventDefault();doUndo();}
  if(e.key==='Escape'){closeModal();if(fuseMode)toggleFuse();}
});

