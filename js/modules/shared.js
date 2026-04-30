// ══════════════════════════════════════════
// UTILS — helpers partagés pour tous les modules
// ══════════════════════════════════════════
function makePageShell(c, title, subtitle, actions){
  const page = document.createElement('div');
  page.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;background:#F5F5F2';
  c.appendChild(page);
  const hdr = document.createElement('div');
  hdr.style.cssText = 'padding:18px 22px 14px;border-bottom:0.5px solid var(--sep);background:var(--card);flex-shrink:0;display:flex;align-items:flex-end;justify-content:space-between';
  hdr.innerHTML = `
    <div>
      <div style="font-size:20px;font-weight:800;color:var(--t1);letter-spacing:-.3px">${title}</div>
      <div style="font-size:12px;color:var(--t3);margin-top:3px">${subtitle}</div>
    </div>
    <div style="display:flex;gap:8px">${(actions||[]).map(a=>`<button onclick="${a.onclick}" style="padding:9px 14px;border-radius:10px;border:${a.primary?'none':'1px solid var(--sep)'};background:${a.primary?'var(--t1)':'var(--card)'};color:${a.primary?'#fff':'var(--t2)'};font-size:12px;font-weight:${a.primary?'600':'500'};cursor:pointer;font-family:inherit">${a.label}</button>`).join('')}</div>
  `;
  page.appendChild(hdr);
  const body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow-y:auto;padding:18px 22px';
  page.appendChild(body);
  return body;
}

function makeKPIRow(items){
  const row = document.createElement('div');
  row.style.cssText = 'display:grid;grid-template-columns:repeat('+items.length+',minmax(0,1fr));gap:10px;margin-bottom:16px';
  items.forEach(k => {
    const d = document.createElement('div');
    d.style.cssText = `background:var(--card);border:0.5px solid var(--sep);border-left:3px solid ${k.col};border-radius:0 12px 12px 0;padding:12px 14px`;
    d.innerHTML = `
      <div style="font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.09em">${k.l}</div>
      <div style="font-size:18px;font-weight:700;color:var(--t1);margin:3px 0;letter-spacing:-.2px;font-family:${k.mono?'"DM Mono",monospace':'inherit'}">${k.v}</div>
      <div style="font-size:11px;color:var(--t3);line-height:1.3">${k.s||''}</div>
    `;
    row.appendChild(d);
  });
  return row;
}

function makeSubNav(tabs, current, onChange){
  const nav = document.createElement('div');
  nav.style.cssText = 'display:flex;gap:2px;padding:4px;background:var(--bg);border-radius:11px;margin-bottom:16px;width:fit-content';
  tabs.forEach(t => {
    const b = document.createElement('button');
    b.style.cssText = `padding:8px 16px;border-radius:8px;border:none;background:${t.k===current?'var(--card)':'transparent'};color:${t.k===current?'var(--t1)':'var(--t3)'};font-size:12px;font-weight:${t.k===current?'600':'500'};cursor:pointer;font-family:inherit;transition:all .15s;box-shadow:${t.k===current?'0 1px 3px rgba(0,0,0,.05)':'none'}`;
    b.textContent = t.label + (t.count !== undefined ? ' · '+t.count : '');
    b.onclick = () => onChange(t.k);
    nav.appendChild(b);
  });
  return nav;
}


