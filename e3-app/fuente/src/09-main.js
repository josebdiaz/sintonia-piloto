/* ── 09 · Arranque y eventos ─────────────────────────────────────────────── */
const conTiempo = (pr, ms) => Promise.race([pr, new Promise(r => setTimeout(() => r(null), ms))]);

async function borrarTodo() {
  for (const pid of [...Yo.doc.parches]) {
    const b = 'parches/' + pid;
    for (const c of ['votos', 'sobremesa', 'miembros']) await Store.del(`${b}/${c}/${Me.uid}`).catch(() => {});
  }
  await Store.del(Yo.path).catch(() => {});
  Grupo.cerrar(); Yo.doc = Yo.def(); await Yo.guardar();
  UI.ir('sintonia'); await S1.mostrar();
}

async function actualizarConsent(c) {
  Yo.doc.consent = c; await Yo.guardar();
  for (const pid of Yo.doc.parches) await Store.update(`parches/${pid}/miembros/${Me.uid}`, { consent: { ...c }, muestra: !!c.nom }).catch(() => {});
}

async function abrirInvitacion(pid) {
  pid = pid.toUpperCase();
  if (Yo.doc.parches.includes(pid)) return UI.ir('grupo', pid);
  const p = await Store.get('parches/' + pid).catch(() => null);
  UI.ir('sintonia');
  if (!p) { await S1.decir([`No encuentro el parche ${pid}. Pídele a quien te invitó que te pase el código otra vez.`], 'estatica'); return; }
  await S1.iniciar('invitado', 'B1a', { pid, parche: { nombre: p.nombre, org: p.orgNombre } });
}

document.addEventListener('click', async e => {
  const t = e.target;
  const team = t.closest('[data-team]');
  if (team) { if (team.tagName === 'INPUT') return; e.preventDefault(); return Team.accion(team.dataset.team, team.dataset.v); }
  if (t.closest('.team-fab')) { Team.abierto = !Team.abierto; Team.paint(); return; }
  const el = t.closest('[data-act]'); if (!el || el.disabled) return;
  const act = el.dataset.act, v = el.dataset.v;
  if (el.tagName === 'FORM') return;
  if (act === 'salir-no-fondo') { if (t === el) { UI.sheet = false; UI.refresh(); } return; }
  e.preventDefault();
  const paso = S1.paso;
  switch (act) {
    case 'back': return UI.atras();
    case 'humano': return UI.ir('humano');
    case 'ir': return UI.ir(v);
    case 'reply': return UI.view === 'grupo' ? Grupo.rapida(v) : null;
    case 'paso': if (!paso) return; if (paso.input.type === 'toggles' && v === 'Continuar') S1.st.ans.consent = { wa: false, nom: false, mej: false, ...(S1.st.ans.consent || {}) }; return S1.responder(v, paso.input.type === 'invite' && v === 'Copiar enlace' ? null : v);
    case 'apuntar': return Grupo.rapida(v === 'si' ? 'Me apunto' : 'No puedo');
    case 'repetir': { const t = { si: 'Sí, repitamos', 'tal-vez': 'Tal vez repetimos', no: 'Ahora no' }[v]; await Grupo.miembro({ repetir: v, repetirAt: Date.now() }); return Grupo.enviar(t); }
    case 'paso-listo': return pasoListo();
    case 'multi': { const k = paso && paso.input.key; if (!k) return; UI.temp.tocado = S1.st.step; const cur = UI.temp[k] || []; UI.temp[k] = cur.includes(v) ? cur.filter(x => x !== v) : (v === 'Nada especial' ? ['Nada especial'] : [...cur.filter(x => x !== 'Nada especial'), v]); UI._last.body = null; return UI.refresh(); }
    case 'band': if (UI.view === 'sintonia' && paso && paso.input.type === 'band') { const f = FRANJAS.find(x => x.id === v); S1.st.ans[paso.input.key] = v; return S1.responder(v, `${f.b[0] + f.b.slice(1).toLowerCase()} · ${f.s}`); } return;
    case 'toggle': {
      const k = el.dataset.k;
      if (k === 'compartir') return Grupo.miembro({ compartir: !(Grupo.yo && Grupo.yo.compartir) });
      if (k.startsWith('p-')) { const c = { ...Yo.doc.consent }; c[k.slice(2)] = !c[k.slice(2)]; return actualizarConsent(c); }
      const c = { wa: false, nom: false, mej: false, ...(S1.st.ans.consent || {}) }; c[k] = !c[k]; S1.st.ans.consent = c; UI.temp.tocado = S1.st.step; UI._last.body = null; return UI.refresh();
    }
    case 'pick': Grupo.sel = +v; UI._last.body = null; return UI.refresh();
    case 'rail': { const r = el.getBoundingClientRect(); Grupo.sel = Math.max(1, Math.min(3, Math.round((e.clientX - r.left) / r.width * 2) + 1)); return UI.refresh(); }
    case 'votar': return Grupo.votar(+v);
    case 'ninguna': return Grupo.ninguna();
    case 'copiar': return UI.copiar(v);
    case 'unirme': return abrirInvitacion(v);
    case 'organizar': UI.ir('sintonia'); return S1.iniciar('organiza', 'A1');
    case 'codigo': UI.ir('sintonia'); return S1.iniciar('invitado', 'B0');
    case 'abrir': return UI.ir('grupo', v);
    case 'tab': UI.tab = +v; return UI.refresh();
    case 'salir': return UI.abrirSalir();
    case 'salir-no': UI.sheet = false; return UI.refresh();
    case 'salir-si': UI.sheet = false; if (UI.view === 'grupo') { await Grupo.salirYBorrar(); UI.aviso('Saliste del parche y se borraron tus respuestas.'); return UI.ir('mis'); } return borrarTodo();
    case 'toast': { const f = UI.toast && UI.toast.fn; UI.toast = null; UI.refresh(); return f && f(); }
    case 'reintentar': { const er = Grupo.errorEnvio; if (er && er.reintento) { Grupo.errorEnvio = null; return er.reintento(); } return Grupo.reintentar(); }
  }
});

async function pasoListo() {
  const paso = S1.paso; if (!paso) return; const k = paso.input.key;
  if (paso.input.type === 'multi') { const val = UI.temp[k] || []; S1.st.ans[k] = val; UI.temp[k] = []; return S1.responder(val, val.length ? val.join(', ') : 'Nada en especial'); }
  if (paso.input.type === 'dial') { const val = +(UI.temp[k] || paso.input.def || 3); UI.temp[k] = null; return S1.responder(val, `${ENERGIA[val - 1]} · ${val} de 5`); }
}
document.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.teamForm === 'alias') { Me.setAlias(f.alias.value.trim()); location.reload(); return; }
  if (f.dataset.teamForm === 'responder') { const t = f.t.value.trim(); if (!t || !Team.sel) return; f.t.value = ''; await Soporte.escribir(Team.sel, t, 'eq', 'Equipo de Sintonía'); return; }
  if (f.dataset.act === 'nombre') { const n = f.n.value.trim().split(' ')[0].slice(0, 20); if (!n) return; Yo.doc.nombre = n; await Yo.guardar(); for (const pid of Yo.doc.parches) await Store.update(`parches/${pid}/miembros/${Me.uid}`, { nombre: n }).catch(() => {}); UI.aviso('Nombre guardado.'); UI._last.body = null; return UI.refresh(); }
  if (f.dataset.act === 'enviar') {
    const inp = f.m; const t = inp.value.trim();
    if (!t && f.hasAttribute('data-sel') && UI.view === 'sintonia') { const pz = S1.paso; if (pz && pz.input.type === 'toggles') { S1.st.ans.consent = { wa: false, nom: false, mej: false, ...(S1.st.ans.consent || {}) }; return S1.responder('Continuar', 'Continuar'); } return pasoListo(); }
    if (!t) return; inp.value = '';
    Live.marcar({ uid: Me.uid, nombre: Yo.doc.nombre, escribiendo: false });
    if (UI.view === 'sintonia') return S1.texto(t);
    if (UI.view === 'grupo') return Grupo.libre(t);
    if (UI.view === 'humano') return Soporte.escribir(Me.uid, t, 'h', Yo.doc.nombre || 'Persona');
  }
});

function marcarTexto(inp) { const f = inp.form; if (!f) return; const tx = !!inp.value.trim(); f.toggleAttribute('data-texto', tx); const b = f.querySelector('.s-send'); if (b) b.setAttribute('aria-label', f.hasAttribute('data-ok') && !tx ? 'OK, confirmar' : 'Enviar'); }
document.addEventListener('input', e => {
  const t = e.target;
  if (t.name === 'm' && t.form && t.form.dataset.act === 'enviar') marcarTexto(t);
  if (t.matches('input[type="range"][data-act="dial"]')) { const k = S1.paso && S1.paso.input.key; const v = +t.value; if (k) UI.temp[k] = v; const d = t.closest('.e-dial'); if (d) { d.querySelector('[data-e="scale"]').style.setProperty('--f', (v - 1) / 4); d.querySelector('[data-e="val"]').textContent = ENERGIA[v - 1]; d.querySelectorAll('.e-marks i').forEach((i, j) => i.toggleAttribute('data-on', j < v)); } t.setAttribute('aria-valuetext', `${ENERGIA[v - 1]}, ${v} de 5`); return; }
  if (UI.view === 'grupo' && t.name === 'm') { Live.marcar({ uid: Me.uid, nombre: Grupo.yo ? (Grupo.yo.muestra ? Grupo.yo.nombre : 'Alguien') : '', escribiendo: true }); clearTimeout(UI._escT); UI._escT = setTimeout(() => Live.marcar({ uid: Me.uid, nombre: '', escribiendo: false }), 2500); }
});
document.addEventListener('change', e => { const t = e.target; if (t.matches('input[type="checkbox"][data-team]')) Team.accion(t.dataset.team); });
document.addEventListener('keydown', e => {
  const s = e.target.closest && e.target.closest('.s-dial-vote[data-act="rail"]'); if (!s) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { Grupo.sel = Math.min(3, Grupo.sel + 1); e.preventDefault(); UI.refresh(); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { Grupo.sel = Math.max(1, Grupo.sel - 1); e.preventDefault(); UI.refresh(); }
});
addEventListener('online', () => { Grupo.vaciarCola(); UI.refresh(); });
addEventListener('offline', () => UI.refresh());
mqDark.addEventListener('change', swapAvatars);
new MutationObserver(swapAvatars).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
addEventListener('hashchange', () => { const m = location.hash.match(/^#p-([A-Za-z0-9]{6})$/); if (m && Yo.doc) abrirInvitacion(m[1]); });
setInterval(() => { if (['mis', 'grupo'].includes(UI.view)) { UI._last.body = null; UI.refresh(); } }, 30000);

(async () => {
  UI.el = document.getElementById('phone'); UI.cargando = true; UI.build();
  await Promise.all([conTiempo(Me.init(), 6000), conTiempo(IA.init(), 6000), conTiempo(Live.init(), 6000), conTiempo(Store.init(), 8000)]);
  if (!Me.base) { Me.base = ls.get('sintonia-e3-uid') || ('local-' + rid(8)); ls.set('sintonia-e3-uid', Me.base); }
  Store.ready = true;
  await Yo.cargar();
  Team.init(document.getElementById('team'));
  UI.cargando = false; Lista.sync();
  const m = location.hash.match(/^#p-([A-Za-z0-9]{6})$/);
  if (m) return abrirInvitacion(m[1]);
  if (Yo.doc.s1.flow === 'inicio' && !Yo.doc.s1.log.length) { UI.ir('sintonia'); UI.hist = []; return S1.mostrar(); }
  UI.ir(Yo.doc.parches.length ? 'mis' : 'sintonia'); UI.hist = [];
})();
