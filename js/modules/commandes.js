// ══════════════════════════════════════════
// PRISE DE COMMANDE — La Playa
// ══════════════════════════════════════════
// _cmdOrders  : { tableId: { items: [], opened: timestamp } }
// item        : { uid, dishId, name, cat, price, qty, note, status }
// status      : 'cmd' | 'env' | 'srv'
// ══════════════════════════════════════════

const _CMD_MENU = [
  // Entrées
  { id:'e1',  cat:'Entrées',  name:'Melon & charcuterie',      price:14 },
  { id:'e2',  cat:'Entrées',  name:'Burrata & tomates',         price:15 },
  { id:'e3',  cat:'Entrées',  name:'Carpaccio de daurade',      price:17 },
  { id:'e4',  cat:'Entrées',  name:'Gaspacho andalou',          price:11 },
  { id:'e5',  cat:'Entrées',  name:'Assiette de charcuteries',  price:16 },
  { id:'e6',  cat:'Entrées',  name:'Salade niçoise',            price:18 },
  { id:'e7',  cat:'Entrées',  name:'Crevettes marinées',        price:19 },
  { id:'e8',  cat:'Entrées',  name:'Velouté de coquillages',    price:14 },
  // Plats
  { id:'p1',  cat:'Plats',    name:'Daurade en croûte de sel',  price:32 },
  { id:'p2',  cat:'Plats',    name:'Poulpe grillé',             price:28 },
  { id:'p3',  cat:'Plats',    name:'Risotto fruits de mer',     price:26 },
  { id:'p4',  cat:'Plats',    name:'Tilapia à la plancha',      price:27 },
  { id:'p5',  cat:'Plats',    name:'Côte de bœuf (2 pers)',     price:68 },
  { id:'p6',  cat:'Plats',    name:'Poulet rôti aux herbes',    price:24 },
  { id:'p7',  cat:'Plats',    name:'Pasta aux palourdes',       price:22 },
  { id:'p8',  cat:'Plats',    name:'Plateau de fruits de mer',  price:58 },
  { id:'p9',  cat:'Plats',    name:'Cabillaud citron-câpres',   price:28 },
  { id:'p10', cat:'Plats',    name:'Magret de canard',          price:30 },
  { id:'p11', cat:'Plats',    name:'Langoustines grillées',     price:42 },
  // Desserts
  { id:'d1',  cat:'Desserts', name:'Tarte tatin figue',         price:11 },
  { id:'d2',  cat:'Desserts', name:'Crème brûlée lavande',      price:10 },
  { id:'d3',  cat:'Desserts', name:'Soupe de fruits rouges',    price:9  },
  { id:'d4',  cat:'Desserts', name:'Baba au rhum',              price:12 },
  { id:'d5',  cat:'Desserts', name:'Fromage blanc figues',      price:9  },
  { id:'d6',  cat:'Desserts', name:'Tiramisu maison',           price:10 },
  { id:'d7',  cat:'Desserts', name:'Sorbet agrumes',            price:8  },
  { id:'d8',  cat:'Desserts', name:'Moelleux chocolat',         price:11 },
  // Boissons
  { id:'b1',  cat:'Boissons', name:'Eau minérale 50cl',         price:4  },
  { id:'b2',  cat:'Boissons', name:'Eau gazeuse 50cl',          price:4  },
  { id:'b3',  cat:'Boissons', name:'Jus de fruit',              price:5  },
  { id:'b4',  cat:'Boissons', name:'Limonade maison',           price:6  },
  { id:'b5',  cat:'Boissons', name:'Vin blanc 25cl',            price:8  },
  { id:'b6',  cat:'Boissons', name:'Vin rosé 25cl',             price:8  },
  { id:'b7',  cat:'Boissons', name:'Vin rouge 25cl',            price:8  },
  { id:'b8',  cat:'Boissons', name:'Bouteille rosé',            price:28 },
  { id:'b9',  cat:'Boissons', name:'Cocktail sans alcool',      price:9  },
  { id:'b10', cat:'Boissons', name:'Café / Thé',                price:3  },
];

const _CMD_CATS = ['Entrées','Plats','Desserts','Boissons'];
const _CMD_STATUS_LABEL = { cmd:'Commandé', env:'Envoyé', srv:'Servi' };
const _CMD_STATUS_COLOR = { cmd:'#2563EB', env:'#D97706', srv:'#16A34A' };

// ── État global persistant par session ──────────────────────────────
if (!window._cmdOrders) window._cmdOrders = {};

function _cmdGetTable(tid) {
  if (!_cmdOrders[tid]) _cmdOrders[tid] = { items: [], opened: Date.now() };
  return _cmdOrders[tid];
}

function _cmdUid() {
  return Math.random().toString(36).slice(2, 9);
}

function _cmdTotal(tid) {
  return (_cmdOrders[tid]?.items || []).reduce((s, i) => s + i.price * i.qty, 0);
}

function _cmdCount(tid) {
  return (_cmdOrders[tid]?.items || []).reduce((s, i) => s + i.qty, 0);
}

function _cmdPendingCount(tid) {
  return (_cmdOrders[tid]?.items || []).filter(i => i.status === 'cmd').length;
}

// ── Rendu principal ─────────────────────────────────────────────────
function renderCommandes(container) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.id = 'cmd-root';
  wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)';
  container.appendChild(wrap);
  _cmdRenderTableGrid(wrap);
}

// ── Grille des tables ────────────────────────────────────────────────
function _cmdRenderTableGrid(root) {
  root.innerHTML = '';

  const hdr = document.createElement('div');
  hdr.style.cssText = 'padding:16px 20px 10px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0';
  hdr.innerHTML = `
    <div>
      <div style="font-size:17px;font-weight:800;color:var(--t1)">Commandes</div>
      <div style="font-size:12px;color:var(--t3);margin-top:2px">Tap une table pour prendre la commande</div>
    </div>
    <div style="display:flex;gap:8px">
      <div style="font-size:12px;padding:5px 11px;border-radius:20px;background:var(--card);border:0.5px solid var(--sep);color:var(--t2);display:flex;align-items:center;gap:5px">
        <span style="width:7px;height:7px;border-radius:50%;background:#D97706"></span>
        En cours
      </div>
    </div>`;
  root.appendChild(hdr);

  const scroll = document.createElement('div');
  scroll.style.cssText = 'flex:1;overflow-y:auto;padding:0 16px 20px';
  root.appendChild(scroll);

  // Récupère les tables actives du service courant
  const svc = currentService || 's1';
  const resas = window.reservations ? (reservations[svc] || []) : [];

  // Tables avec réservation assignée
  const tableIds = Object.keys(TABLE_DATA)
    .map(Number)
    .filter(id => id < (SALON_ID_MIN || 1001))
    .sort((a, b) => a - b);

  // Filtrer selon le service : tables qui ont des resas ou des commandes en cours
  const activeTables = tableIds.filter(id => {
    const hasResa = resas.some(r => r.table === id);
    const hasOrder = _cmdOrders[id] && _cmdOrders[id].items.length > 0;
    return hasResa || hasOrder;
  });

  const allTables = tableIds;

  // Section tables actives
  if (activeTables.length > 0) {
    const secTitle = document.createElement('div');
    secTitle.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t4);margin:10px 0 8px';
    secTitle.textContent = 'Tables avec réservations';
    scroll.appendChild(secTitle);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px';
    scroll.appendChild(grid);

    activeTables.forEach(id => _cmdRenderTableCard(grid, id, resas));
  }

  // Section toutes les tables
  const secAll = document.createElement('div');
  secAll.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t4);margin:10px 0 8px';
  secAll.textContent = 'Toutes les tables';
  scroll.appendChild(secAll);

  const gridAll = document.createElement('div');
  gridAll.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px';
  scroll.appendChild(gridAll);

  allTables.forEach(id => {
    const hasOrder = _cmdOrders[id] && _cmdOrders[id].items.length > 0;
    const resa = resas.find(r => r.table === id);
    const card = document.createElement('div');
    card.style.cssText = `
      background:var(--card);border:0.5px solid ${hasOrder ? '#D97706' : 'var(--sep)'};
      border-radius:12px;padding:10px 8px;text-align:center;cursor:pointer;
      transition:all .15s;${hasOrder ? 'box-shadow:0 0 0 2px rgba(217,119,6,.2)' : ''}
    `;
    card.innerHTML = `
      <div style="font-size:14px;font-weight:700;color:var(--t1);font-family:'DM Mono',monospace">T${id}</div>
      ${resa ? `<div style="font-size:9px;color:var(--t3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${resa.name||''}</div>` : ''}
      ${hasOrder ? `<div style="font-size:10px;font-weight:700;color:#D97706;margin-top:3px">${_cmdCount(id)} art.</div>` : ''}
    `;
    card.addEventListener('click', () => _cmdOpenTable(root, id, resas));
    card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.03)');
    card.addEventListener('mouseleave', () => card.style.transform = '');
    gridAll.appendChild(card);
  });
}

function _cmdRenderTableCard(grid, id, resas) {
  const resa = resas.find(r => r.table === id);
  const order = _cmdOrders[id];
  const total = _cmdTotal(id);
  const pending = _cmdPendingCount(id);
  const count = _cmdCount(id);
  const hasOrder = order && order.items.length > 0;

  const card = document.createElement('div');
  const statusColor = hasOrder ? (pending > 0 ? '#D97706' : '#16A34A') : '#6B7280';
  card.style.cssText = `
    background:var(--card);border:0.5px solid var(--sep);
    border-top:3px solid ${statusColor};border-radius:0 0 12px 12px;
    padding:12px;cursor:pointer;transition:all .15s;
  `;
  card.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
      <div style="font-size:15px;font-weight:800;color:var(--t1);font-family:'DM Mono',monospace">T${id}</div>
      ${resa ? `<div style="font-size:10px;color:var(--t3)">${resa.guests||'?'} pers</div>` : ''}
    </div>
    ${resa ? `<div style="font-size:11px;font-weight:600;color:var(--t2);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${resa.name||''}</div>` : ''}
    ${hasOrder ? `
      <div style="font-size:11px;color:var(--t3)">${count} article${count>1?'s':''}</div>
      <div style="font-size:14px;font-weight:700;color:var(--t1);margin-top:4px">${total.toFixed(2)} €</div>
      ${pending > 0 ? `<div style="font-size:10px;color:#D97706;margin-top:2px">⏳ ${pending} à envoyer</div>` : `<div style="font-size:10px;color:#16A34A;margin-top:2px">✓ Tout envoyé</div>`}
    ` : `<div style="font-size:11px;color:var(--t4);margin-top:4px">Pas de commande</div>`}
  `;
  card.addEventListener('click', () => _cmdOpenTable(document.getElementById('cmd-root'), id, resas));
  card.addEventListener('mouseenter', () => card.style.opacity = '.85');
  card.addEventListener('mouseleave', () => card.style.opacity = '');
  grid.appendChild(card);
}

// ── Vue commande d'une table ────────────────────────────────────────
function _cmdOpenTable(root, tableId, resas) {
  root.innerHTML = '';
  const svc = currentService || 's1';
  if (!resas) resas = window.reservations ? (reservations[svc] || []) : [];
  const resa = resas.find(r => r.table === tableId);
  const order = _cmdGetTable(tableId);

  let activeCat = 'Plats';

  // Topbar
  const topbar = document.createElement('div');
  topbar.style.cssText = 'flex-shrink:0;padding:12px 16px;background:var(--card);border-bottom:0.5px solid var(--sep);display:flex;align-items:center;gap:12px';
  topbar.innerHTML = `
    <button id="cmd-back" style="border:none;background:var(--bg);border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">←</button>
    <div style="flex:1">
      <div style="font-size:15px;font-weight:800;color:var(--t1)">Table ${tableId}${resa ? ` · ${resa.name||''}` : ''}</div>
      <div style="font-size:11px;color:var(--t3)">${resa ? `${resa.guests||'?'} pers · ${resa.time||''}` : 'Sans réservation'}</div>
    </div>
    <div id="cmd-total-badge" style="text-align:right;flex-shrink:0">
      <div style="font-size:16px;font-weight:800;color:var(--t1)" id="cmd-total-num">0.00 €</div>
      <div style="font-size:10px;color:var(--t3)" id="cmd-total-items">0 article</div>
    </div>
  `;
  root.appendChild(topbar);
  topbar.querySelector('#cmd-back').addEventListener('click', () => _cmdRenderTableGrid(root));

  // Layout : ordre à gauche, menu à droite (desktop) / tabs (mobile)
  const body = document.createElement('div');
  body.style.cssText = 'flex:1;display:flex;overflow:hidden';
  root.appendChild(body);

  // Panel gauche : commande en cours
  const leftPanel = document.createElement('div');
  leftPanel.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;border-right:0.5px solid var(--sep)';
  body.appendChild(leftPanel);

  // Panel droit : carte du menu
  const rightPanel = document.createElement('div');
  rightPanel.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden';
  body.appendChild(rightPanel);

  // ── Panel gauche : ordre ──────────────────────────
  const orderHeader = document.createElement('div');
  orderHeader.style.cssText = 'padding:10px 14px;border-bottom:0.5px solid var(--sep);display:flex;align-items:center;justify-content:space-between;flex-shrink:0';
  orderHeader.innerHTML = `
    <div style="font-size:12px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:.06em">Commande</div>
    <button id="cmd-send-all" style="padding:7px 14px;border-radius:8px;border:none;background:#D97706;color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;display:none">
      Envoyer cuisine →
    </button>
  `;
  leftPanel.appendChild(orderHeader);

  const orderList = document.createElement('div');
  orderList.id = 'cmd-order-list';
  orderList.style.cssText = 'flex:1;overflow-y:auto;padding:8px';
  leftPanel.appendChild(orderList);

  // Footer avec total + actions
  const orderFooter = document.createElement('div');
  orderFooter.id = 'cmd-footer';
  orderFooter.style.cssText = 'padding:12px 14px;border-top:0.5px solid var(--sep);flex-shrink:0';
  leftPanel.appendChild(orderFooter);

  // ── Panel droit : menu ──────────────────────────
  const catTabs = document.createElement('div');
  catTabs.style.cssText = 'display:flex;gap:4px;padding:10px 10px 6px;overflow-x:auto;flex-shrink:0;border-bottom:0.5px solid var(--sep)';
  _CMD_CATS.forEach(cat => {
    const btn = document.createElement('button');
    btn.dataset.cat = cat;
    btn.style.cssText = `
      padding:6px 12px;border-radius:20px;border:none;font-size:12px;font-weight:600;
      cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .12s;
      background:${cat===activeCat?'var(--t1)':'var(--bg)'};
      color:${cat===activeCat?'#fff':'var(--t3)'};
    `;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCat = cat;
      catTabs.querySelectorAll('button').forEach(b => {
        const on = b.dataset.cat === cat;
        b.style.background = on ? 'var(--t1)' : 'var(--bg)';
        b.style.color = on ? '#fff' : 'var(--t3)';
      });
      _cmdRenderMenuItems(menuItems, activeCat);
    });
    catTabs.appendChild(btn);
  });
  rightPanel.appendChild(catTabs);

  const menuItems = document.createElement('div');
  menuItems.id = 'cmd-menu-items';
  menuItems.style.cssText = 'flex:1;overflow-y:auto;padding:8px';
  rightPanel.appendChild(menuItems);

  // ── Render helpers ──────────────────────────────
  function refresh() {
    _cmdRenderOrderList(orderList, orderHeader, orderFooter, tableId, refresh);
    // Update topbar total
    const total = _cmdTotal(tableId);
    const count = _cmdCount(tableId);
    document.getElementById('cmd-total-num').textContent = total.toFixed(2) + ' €';
    document.getElementById('cmd-total-items').textContent = count + ' article' + (count>1?'s':'');
    // Show/hide send button
    const sendBtn = document.getElementById('cmd-send-all');
    if (sendBtn) sendBtn.style.display = _cmdPendingCount(tableId) > 0 ? 'block' : 'none';
  }

  orderHeader.querySelector('#cmd-send-all').addEventListener('click', () => {
    const ord = _cmdOrders[tableId];
    if (!ord) return;
    ord.items.filter(i => i.status === 'cmd').forEach(i => { i.status = 'env'; });
    toast('🍳 Commande envoyée en cuisine');
    refresh();
  });

  _cmdRenderMenuItems(menuItems, activeCat, tableId, refresh);
  refresh();
}

// ── Liste des articles commandés ─────────────────────────────────────
function _cmdRenderOrderList(container, header, footer, tableId, refresh) {
  container.innerHTML = '';
  const ord = _cmdOrders[tableId];
  const items = ord ? ord.items : [];

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:32px 16px;color:var(--t4)">
        <div style="font-size:28px;margin-bottom:8px">🍽</div>
        <div style="font-size:13px">Ajoutez des articles<br>depuis la carte à droite</div>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  // Grouper par statut
  const groups = { cmd: [], env: [], srv: [] };
  items.forEach(i => groups[i.status].push(i));

  ['cmd','env','srv'].forEach(status => {
    const group = groups[status];
    if (!group.length) return;

    const title = document.createElement('div');
    title.style.cssText = `font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${_CMD_STATUS_COLOR[status]};padding:4px 4px 2px`;
    title.textContent = _CMD_STATUS_LABEL[status];
    container.appendChild(title);

    group.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = `
        display:flex;align-items:center;gap:8px;padding:8px 6px;
        border-radius:8px;margin-bottom:2px;background:var(--bg2);
        border-left:3px solid ${_CMD_STATUS_COLOR[status]};
      `;

      row.innerHTML = `
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name}</div>
          ${item.note ? `<div style="font-size:10px;color:var(--t3);font-style:italic">${item.note}</div>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
          <button data-uid="${item.uid}" data-action="minus" style="width:22px;height:22px;border-radius:50%;border:0.5px solid var(--sep);background:var(--card);color:var(--t2);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">−</button>
          <span style="font-size:13px;font-weight:700;color:var(--t1);min-width:16px;text-align:center">${item.qty}</span>
          <button data-uid="${item.uid}" data-action="plus" style="width:22px;height:22px;border-radius:50%;border:0.5px solid var(--sep);background:var(--card);color:var(--t2);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">+</button>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--t1);min-width:48px;text-align:right;flex-shrink:0">${(item.price*item.qty).toFixed(2)} €</div>
        <button data-uid="${item.uid}" data-action="next" style="padding:4px 8px;border-radius:6px;border:none;background:${_CMD_STATUS_COLOR[status]}22;color:${_CMD_STATUS_COLOR[status]};font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">
          ${status==='cmd'?'→ Env.':status==='env'?'→ Servi':'✓'}
        </button>
      `;

      row.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const uid = btn.dataset.uid;
          const action = btn.dataset.action;
          const ord2 = _cmdOrders[tableId];
          if (!ord2) return;
          const idx = ord2.items.findIndex(i => i.uid === uid);
          if (idx === -1) return;
          if (action === 'minus') {
            ord2.items[idx].qty--;
            if (ord2.items[idx].qty <= 0) ord2.items.splice(idx, 1);
          } else if (action === 'plus') {
            ord2.items[idx].qty++;
          } else if (action === 'next') {
            const st = ord2.items[idx].status;
            if (st === 'cmd') ord2.items[idx].status = 'env';
            else if (st === 'env') ord2.items[idx].status = 'srv';
          }
          refresh();
        });
      });

      container.appendChild(row);
    });
  });

  // Footer : total + bouton addition
  const total = _cmdTotal(tableId);
  const count = _cmdCount(tableId);
  footer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div style="font-size:13px;color:var(--t3)">${count} article${count>1?'s':''}</div>
      <div style="font-size:18px;font-weight:800;color:var(--t1)">${total.toFixed(2)} €</div>
    </div>
    <div style="display:flex;gap:8px">
      <button id="cmd-clear-btn" style="flex:1;padding:11px;border-radius:10px;border:0.5px solid var(--sep);background:var(--bg);color:var(--t3);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">
        Vider
      </button>
      <button id="cmd-addition-btn" style="flex:2;padding:11px;border-radius:10px;border:none;background:var(--t1);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">
        💶 Addition · ${total.toFixed(2)} €
      </button>
    </div>
  `;
  footer.querySelector('#cmd-clear-btn').addEventListener('click', () => {
    if (!confirm(`Vider la commande de la table ${tableId} ?`)) return;
    _cmdOrders[tableId] = { items: [], opened: Date.now() };
    toast('Commande vidée');
    refresh();
  });
  footer.querySelector('#cmd-addition-btn').addEventListener('click', () => {
    _cmdPrintAddition(tableId);
  });
}

// ── Menu items ───────────────────────────────────────────────────────
function _cmdRenderMenuItems(container, cat, tableId, refresh) {
  if (!tableId) {
    // Called without tableId — search context in root
    const root = document.getElementById('cmd-root');
    if (!root) return;
  }
  container.innerHTML = '';
  const dishes = _CMD_MENU.filter(d => d.cat === cat);

  dishes.forEach(dish => {
    const row = document.createElement('div');
    row.style.cssText = `
      display:flex;align-items:center;gap:10px;padding:9px 8px;
      border-radius:9px;margin-bottom:4px;cursor:pointer;
      background:var(--bg2);transition:background .1s;
    `;

    // Check current qty in order
    const ord = tableId ? _cmdOrders[tableId] : null;
    const existing = ord ? ord.items.filter(i => i.dishId === dish.id).reduce((s,i)=>s+i.qty,0) : 0;

    row.innerHTML = `
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--t1)">${dish.name}</div>
        <div style="font-size:11px;color:var(--t3);margin-top:1px">${dish.price} €</div>
      </div>
      ${existing > 0 ? `<div style="font-size:11px;font-weight:700;color:#2563EB;background:#EFF6FF;border-radius:12px;padding:2px 8px">${existing}×</div>` : ''}
      <button data-id="${dish.id}" style="
        width:30px;height:30px;border-radius:50%;border:none;
        background:var(--t1);color:#fff;font-size:18px;cursor:pointer;
        display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;
        font-family:inherit;
      ">+</button>
    `;

    row.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation();
      if (!tableId) return;
      const ord2 = _cmdGetTable(tableId);
      const existing2 = ord2.items.find(i => i.dishId === dish.id && i.status === 'cmd');
      if (existing2) {
        existing2.qty++;
      } else {
        ord2.items.push({
          uid: _cmdUid(),
          dishId: dish.id,
          name: dish.name,
          cat: dish.cat,
          price: dish.price,
          qty: 1,
          note: '',
          status: 'cmd',
        });
      }
      // Feedback visuel rapide
      const btn = e.target.closest('button');
      btn.style.transform = 'scale(1.4)';
      btn.style.background = '#16A34A';
      setTimeout(() => { btn.style.transform = ''; btn.style.background = 'var(--t1)'; }, 220);
      refresh();
      _cmdRenderMenuItems(container, cat, tableId, refresh);
    });

    container.appendChild(row);
  });
}

// ── Impression addition ──────────────────────────────────────────────
function _cmdPrintAddition(tableId) {
  const ord = _cmdOrders[tableId];
  if (!ord || !ord.items.length) { toast('Aucune commande'); return; }
  const total = _cmdTotal(tableId);
  const lines = ord.items.map(i => `${i.qty}× ${i.name}  ${(i.price*i.qty).toFixed(2)} €`).join('\n');
  const msg = `Table ${tableId}\n${'-'.repeat(32)}\n${lines}\n${'-'.repeat(32)}\nTOTAL  ${total.toFixed(2)} €`;
  // Sur mobile : share si disponible, sinon toast
  if (navigator.share) {
    navigator.share({ title: `Addition T${tableId}`, text: msg }).catch(()=>{});
  } else {
    toast(`Addition T${tableId} · ${total.toFixed(2)} €`);
  }
}
