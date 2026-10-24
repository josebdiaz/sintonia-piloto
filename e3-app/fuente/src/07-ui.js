/* ── 07 · Pantallas y eventos ─────────────────────────────────────────────── */
const Lista = { // parches de «Mis sintonías» y «Chats»
  docs: {}, unsubs: {},
  sync() {
    const want = new Set(Yo.doc ? Yo.doc.parches : []);
    Object.keys(this.unsubs).forEach(pid => { if (!want.has(pid)) { this.unsubs[pid](); delete this.unsubs[pid]; delete this.docs[pid]; } });
    want.forEach(pid => { if (!this.unsubs[pid]) this.unsubs[pid] = Store.watchDoc('parches/' + pid, d => { if (d) this.docs[pid] = d; else delete this.docs[pid]; UI.refresh(); }); });
  },
};

const Soporte = {
  uid: null, msgs: [], un: null,
  abrir(uid) { if (this.uid === uid) return; this.cerrar(); this.uid = uid; this.un = Store.watchCol(`soporte/${uid}/mensajes`, l => { this.msgs = l.sort((a, b) => a.at - b.at); UI.refresh(); }); },
  cerrar() { if (this.un) this.un(); this.un = null; this.uid = null; this.msgs = []; },
  async escribir(uid, t, a, nombre) {
    const id = 'm' + Date.now().toString(36) + rid(3);
    await Store.set(`soporte/${uid}/mensajes/${id}`, { id, a, t, at: Date.now(), nombre: nombre || '' });
    const meta = { id: uid, uid, nombre: a === 'h' ? nombre : undefined, ultimo: t.slice(0, 80), at: Date.now(), deEquipo: a === 'eq' };
    Object.keys(meta).forEach(k => meta[k] === undefined && delete meta[k]);
    await Store.update(`soporte/${uid}`, meta).catch(() => Store.set(`soporte/${uid}`, meta));
  },
};

const UI = {
  view: 'sintonia', pid: null, tab: 0, sheet: false, toast: null, cargando: false, vistaPrevia: null,
  el: null, _raf: 0, _timer: null, _escT: null, temp: {},

  hist: [],
  ir(v, pid, atras) {
    if (!atras && (this.view !== v || (pid && pid !== this.pid))) { this.hist.push([this.view, this.pid]); if (this.hist.length > 30) this.hist.shift(); }
    this.view = v; if (pid) this.pid = pid;
    if (v === 'grupo' && this.pid) { Grupo.abrir(this.pid); Grupo.sel = (Grupo.miVoto && typeof Grupo.miVoto.opcion === 'number') ? Grupo.miVoto.opcion : 1; }
    if (v === 'humano') Soporte.abrir(Me.uid);
    this.sheet = false; this.build();
  },
  atras() { let prev; while ((prev = this.hist.pop()) && prev[0] === this.view && prev[1] === this.pid) {} return prev ? this.ir(prev[0], prev[1], true) : this.ir('chats', null, true); },
  aviso(t, accion, fn) { this.toast = { t, accion, fn }; clearTimeout(this._tt); this._tt = setTimeout(() => { this.toast = null; this.refresh(); }, 5000); this.refresh(); },
  async copiar(texto) {
    try { await navigator.clipboard.writeText(texto); this.aviso('Copiado: ' + texto); }
    catch (e) { this.aviso('Copia esto: ' + texto); }
  },
  abrirSalir() { this.sheet = true; this.refresh(); },

  refresh() { if (this._raf) return; this._raf = requestAnimationFrame(() => { this._raf = 0; this.paint(); }); },

  /* Estructura de la pantalla: cabecera + cuerpo + compositor. Se reconstruye al cambiar de vista. */
  build() {
    const ph = this.el; ph.innerHTML = ''; ph.removeAttribute('data-panel');
    const panel = ['chats', 'mis', 'perfil'].includes(this.view);
    if (panel) ph.setAttribute('data-panel', '');
    ph.innerHTML = panel ? `<div class="scroll" data-slot="body"></div><div data-slot="nav">${P.nav(this.view)}</div><div data-slot="over"></div>`
      : `<div data-slot="head"></div><div class="s-thread" role="log" aria-live="polite" data-slot="body"></div><div data-slot="comp"></div><div data-slot="over"></div>`;
    this._last = {}; this.paint(true);
  },
  slot(n) { return this.el.querySelector(`[data-slot="${n}"]`); },
  put(n, html) { const s = this.slot(n); if (s && this._last[n] !== html) { s.innerHTML = html; this._last[n] = html; return true; } return false; },

  paint(force) {
    if (!this.el) return;
    if (this.cargando || !Yo.doc) { this.put('body', P.att(P.valves(1))); return; }
    const v = this.view;
    if (v === 'sintonia') this.pSintonia();
    else if (v === 'grupo') this.pGrupo();
    else if (v === 'humano') this.pHumano();
    else if (v === 'chats') this.pChats();
    else if (v === 'mis') this.pMis();
    else if (v === 'perfil') this.pPerfil();
    this.put('over', (this.sheet ? `<div class="sheet-scrim" data-act="salir-no-fondo">${P.sheet()}</div>` : '') + (this.toast ? `<div class="toast">${P.banner(this.toast.t, '', 'progress').replace('</div></div>', `</div>${this.toast.accion ? `<button class="s-button" data-size="sm" data-style="secondary" data-act="toast">${esc(this.toast.accion)}</button>` : ''}</div>`)}</div>` : ''));
    Team.paint(); swapAvatars();
  },

  /* Hilo con reconciliación por clave (no se pierde el scroll ni el foco) */
  thread(items) {
    const box = this.slot('body'); if (!box) return;
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
    const prevCount = box.children.length;
    const keys = new Set(items.map(i => i.k));
    [...box.children].forEach(c => { if (!keys.has(c.dataset.k)) c.remove(); });
    items.forEach((it, idx) => {
      let el = box.querySelector(`:scope > [data-k="${CSS.escape(it.k)}"]`);
      if (!el) { el = document.createElement('div'); el.dataset.k = it.k; el.style.display = 'contents'; }
      if (el.dataset.h !== it.h) { el.innerHTML = it.h; el.dataset.h = it.h; }
      if (box.children[idx] !== el) box.insertBefore(el, box.children[idx] || null);
    });
    if (near || prevCount === 0 || items.length > prevCount) requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; });
  },
  sepDia(at, prev) { const d = new Date(at).toDateString(); if (prev && new Date(prev).toDateString() === d) return null; const hoy = new Date(); const ay = new Date(Date.now() - 864e5); return d === hoy.toDateString() ? 'Hoy' : d === ay.toDateString() ? 'Ayer' : fechaCorta(at); },

  /* ── 1:1 Sintonía ── */
  pSintonia() {
    const st = S1.st, paso = S1.paso;
    this.put('head', P.head({ titulo: 'Sintonía', sub: 'IA · una persona revisa', voz: (paso && paso.voz) || 'quinto', alAire: true, escribiendo: S1.pendienteIA ? 'Sintonía' : null }));
    const items = []; let prev = null;
    st.log.forEach(m => {
      const s = this.sepDia(m.at, prev); if (s) items.push({ k: 'd' + m.at, h: P.sep(s) }); prev = m.at;
      let h = m.a === 'ai' ? P.ai(m.t, horaMsg(m.at), m.voz) : P.me(m.t, horaMsg(m.at));
      if (m.att) h += P.att(this.adjunto1a1(m.att));
      items.push({ k: m.id, h });
    });
    this.thread(items);
    let chips = [], modo = null;
    if (paso && paso.input && !S1.pendienteIA) {
      const t = paso.input.type, ops = paso.input.options ? (typeof paso.input.options === 'function' ? paso.input.options(S1.ctx()) : paso.input.options) : [];
      if (t === 'chips' || t === 'text' || t === 'toggles' || t === 'invite') chips = ops.map(o => [o, o === 'Continuar' || o === 'Abrir el chat del grupo', 'paso']);
      /* El dial ya tiene un valor: se confirma con OK desde el inicio; moverlo no cambia el botón. */
      if (t === 'dial') modo = 'ok';
      else if (t === 'multi' || t === 'toggles') modo = this.temp.tocado === st.step ? 'ok' : 'sel';
      if (t === 'toggles') chips = chips.filter(c => c[0] !== 'Continuar');
    }
    this.compositor(chips, modo === 'ok' ? 'Toca OK para confirmar' : 'Escribe a Sintonía', false, modo);
  },
  adjunto1a1(att) {
    const activo = att.step === S1.st.step, p = PASOS[att.step] || {}, inp = p.input || {}, a = S1.st.ans;
    if (att.type === 'multi') { const sel = activo ? (this.temp[inp.key] || []) : (a[inp.key] || []); return P.chips(inp.options.map(o => [o, sel.includes(o), activo ? 'multi' : 'nada']), 'multi'); }
    if (att.type === 'band') return P.band(a[inp.key] || (activo ? null : 'tarde'), !activo);
    if (att.type === 'dial') { const v = activo ? (this.temp[inp.key] || inp.def || 3) : (a[inp.key] || inp.def || 3); return P.energy(inp.q, v, !activo); }
    if (att.type === 'toggles') { const c = (activo ? a.consent : (a.consent || Yo.doc.consent)) || { wa: false, nom: false, mej: false }; return `<div style="display:grid;gap:8px">${P.toggle('Recibir el plan por WhatsApp', c.wa, 'wa', !activo)}${P.toggle('Mostrar mi nombre al grupo', c.nom, 'nom', !activo)}${P.toggle('Usar mis respuestas para mejorar', c.mej, 'mej', !activo)}</div>`; }
    if (att.type === 'invite') { const pid = S1.st.pid; return pid ? P.invite(pid, ARTIFACT_URL ? linkParche(pid) : '') : P.valves(2); }
    return '';
  },

  /* ── Grupo ── */
  pGrupo() {
    const G = Grupo, p = G.p;
    if (!G.listo) { this.put('head', P.head({ grupo: true, titulo: 'Parche', sub: 'Conectando…' })); this.thread([{ k: 'cargando', h: P.att(P.valves(1)) }]); this.compositor([], 'Escribe al grupo', true); return; }
    if (!p) { this.put('head', P.head({ grupo: true, titulo: 'Parche no encontrado', sub: '' })); this.thread([{ k: 'nf', h: P.ai('No encuentro este parche. Puede que lo hayan borrado.', horaMsg(Date.now()), 'estatica') }]); this.compositor([], '', true); return; }
    const n = G.activos.length, N = G.N, yo = G.yo;
    const vr = G.votosRonda();
    const station = { reclutando: { state: 'searching', text: `Buscando señal · ${n}/${N}` }, sinquorum: { state: 'searching', text: `Sin quórum · ${n}/${N}` }, votacion: { state: 'live', text: `Votación abierta · ${vr.length}/${n}` }, fijado: p.plan ? { state: 'fixed', text: `Plan fijado · ${fechaCorta(p.plan.fecha)}, ${hora12(p.plan.h, p.plan.m)}` } : null, encurso: { state: 'fixed', text: 'Plan en curso · hoy' } }[p.stage] || null;
    const typing = G.pendIA || p.stage === 'resolviendo' ? 'Sintonía' : (Live.escribiendo(Me.uid)[0] || null);
    const offline = Store.falla.offline || !navigator.onLine;
    this.put('head', P.head({ grupo: true, titulo: p.nombre, sub: `${n} persona${n === 1 ? '' : 's'} · Sintonía (IA)`, station: offline ? { state: 'searching', text: 'Sin señal · reintentando' } : station, escribiendo: typing }));
    const items = []; let prev = null;
    if (!yo) items.push({ k: 'nomiembro', h: P.ai('Aún no estás en este parche. Si te invitaron, entra con el código.', horaMsg(Date.now()), 'quinto') + P.att(P.btn('Unirme a este parche', 'unirme', p.id)) });
    const vis = G.mensajes.filter(m => !m.solo || m.solo === Me.uid);
    [...vis, ...G.cola.map(m => ({ ...m, _cola: true }))].forEach(m => {
      const s = this.sepDia(m.at, prev); if (s) items.push({ k: 'd' + m.at, h: P.sep(s) }); prev = m.at;
      let h;
      if (m.a === 'ai') h = P.ai(m.t, horaMsg(m.at), m.voz);
      else if (m.uid === Me.uid) h = P.me(m.t, horaMsg(m.at), m._cola ? 'cola' : 'ok');
      else h = P.member(m.nombre || 'Alguien', m.t, horaMsg(m.at));
      if (m.att) h += P.att(this.adjuntoGrupo(m));
      items.push({ k: m._id || m.id, h });
    });
    if (G.errorEnvio) items.push({ k: 'err', h: P.me(G.errorEnvio.t, horaMsg(Date.now()), 'err') + P.att(P.banner('No se pudo enviar', ' Toca «Reintentar». Tu mensaje sigue aquí.')) });
    if (offline) items.push({ k: 'off', h: P.ai('Se fue la señal. No pasa nada: guardo lo que escribas y lo envío apenas vuelva.', horaMsg(Date.now()), 'estatica') + P.att(P.display('off', 'Sin señal · reintentando', '--:--', 'SIN CONEXIÓN')) });
    this.thread(items);
    this.compositor(this.chipsGrupo(), offline ? 'Sin conexión · se envía al volver' : 'Escribe al grupo', !yo);
    clearTimeout(this._timer);
    if (p.stage === 'resolviendo') this._timer = setTimeout(() => { this._last.body = null; this.refresh(); }, 1000);
  },
  adjuntoGrupo(m) {
    const G = Grupo, p = G.p, a = m.att;
    if (a.type === 'quorum') { const vivo = m._id === G.mensajes.filter(x => x.att && x.att.type === 'quorum').slice(-1)[0]?._id; return P.quorum(vivo ? G.activos.length : a.n, G.N); }
    if (a.type === 'vote') {
      const actual = p.stage === 'votacion' && p.ronda === a.ronda;
      if (!actual) { const plan = p.plan; const k = plan && a.ronda === p.ronda ? (a.opciones.findIndex(o => o.id === plan.id) + 1) : 1; return P.vote(a.opciones, k || 1, { cerrada: true, fijo: !!plan && a.ronda === p.ronda, nota: plan && a.ronda === p.ronda ? `Ganó «${plan.titulo}».` : 'Ronda cerrada.' }); }
      const mv = G.miVoto; const vr = G.votosRonda();
      if (mv) return mv.opcion === 'ninguna' ? P.vote(a.opciones, G.sel, { votado: `Dijiste «Ninguna me sirve». Van ${vr.length} de ${G.activos.length}.` }) : P.vote(a.opciones, mv.opcion, { votado: `Votaste por la ${mv.opcion}. Van ${vr.length} de ${G.activos.length}.` });
      return P.vote(a.opciones, G.sel, {});
    }
    if (a.type === 'valves') { const step = p.stage === 'resolviendo' ? Math.min(3, 1 + Math.floor((Date.now() - m.at) / 2000)) : 3; return P.valves(step); }
    if (a.type === 'plan') return P.plan(a.plan, p.stage === 'encurso' ? 'cur' : p.stage === 'sobremesa' ? 'done' : '') + (m._id === 'plan' && p.stage === 'fijado' && G.yo ? P.apuntas(G.yo.asistencia) : '') + (m._id === 'plan' ? P.quorum(Math.min(a.n, G.activos.length) || a.n, a.N) : '');
    if (a.type === 'countdown') { const d = Math.max(0, (p.plan ? p.plan.fecha : Date.now()) - Date.now()); const hh = Math.min(99, Math.floor(d / 3600e3)), mm = Math.floor(d % 3600e3 / 60e3); return P.display('countdown', 'Faltan · h:min', `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, 'PARA EL PLAN'); }
    if (a.type === 'time') return p.plan ? P.display('time', `Salida · ${fechaCorta(p.plan.fecha)}`, hora12(p.plan.h, p.plan.m).split(' ')[0], hora12(p.plan.h, p.plan.m).split(' ').slice(1).join(' ').toUpperCase()) : '';
    if (a.type === 'cierre') return (p.plan ? P.plan(p.plan, 'done') : '') + (G.yo ? P.reencuentro(G.yo.repetir) : '');
    return '';
  },
  chipsGrupo() {
    const G = Grupo, p = G.p, yo = G.yo || {};
    if (!p || !G.yo) return [];
    const err = G.errorEnvio ? [['Reintentar', true, 'reintentar']] : [];
    const org = p.org === Me.uid;
    const by = {
      reclutando: org ? [['Copiar enlace', true], '¿Quién falta?'] : ['¿Quién falta?'],
      sinquorum: [['Dar 24 h más', true], 'Seguir con los que estamos', 'Cancelar el plan'],
      votacion: (() => { const mv = G.miVoto; if (mv && mv.opcion === 'ninguna' && !mv.motivo) return ['Muy lejos', 'Muy caro', 'No me llama']; return mv ? ['¿Y si llueve?', 'Ver mapa', 'Cambiar mi voto'] : ['¿Y si llueve?', 'Ver mapa']; })(),
      resolviendo: [],
      fijado: p.recordatorio && yo.confirmaD1 === undefined ? [['Ahí estaré', true], 'Ya no puedo'] : ['Cómo llegar', '¿Y si llueve?'],
      encurso: ['Cómo llegar', 'Voy tarde', ['¡Llegué!', !!yo.llego]],
      sobremesa: [['Guardar en mis parches', true], 'Otra idea'],
      cancelado: [['Armar otro plan', true]],
    }[p.stage] || [];
    return [...err, ...by];
  },
  compositor(chips, ph, dis, modo) {
    const html = P.composer(chips, ph, dis, modo);
    const s = this.slot('comp'); if (!s) return;
    if (this._last.comp === html) return;
    const inp = s.querySelector('input'); const val = inp ? inp.value : ''; const foc = inp && document.activeElement === inp;
    s.innerHTML = html; this._last.comp = html;
    const n = s.querySelector('input'); if (n) { n.value = val; if (foc) n.focus(); marcarTexto(n); }
  },

  /* ── Habla con un humano (E4) ── */
  pHumano() {
    const eqReciente = Soporte.msgs.some(m => m.a === 'eq' && Date.now() - m.at < 15 * 60e3);
    this.put('head', P.head({ titulo: 'Equipo de Sintonía', sub: eqReciente ? 'Una persona del equipo · en línea' : 'Una persona del equipo responde', voz: 'quinto', humanoLive: true }));
    const items = [{ k: 'intro', h: P.ai('Te paso con una persona del equipo. Este chat sigue siendo privado.', horaMsg(Soporte.msgs[0] ? Soporte.msgs[0].at : Date.now()), 'quinto') }];
    Soporte.msgs.forEach(m => items.push({ k: m.id || m._id, h: m.a === 'eq' ? P.member('Equipo de Sintonía', m.t, horaMsg(m.at)) : P.me(m.t, horaMsg(m.at)) }));
    this.thread(items);
    this.compositor([], 'Escribe al equipo');
  },

  /* ── Chats ── */
  pChats() {
    Lista.sync();
    const rows = [`<button class="s-tuning-row" data-state="fixed" data-act="ir" data-v="sintonia"><span class="s-when"><small>IA</small><b>1:1</b></span><span><strong>Sintonía</strong><small><i></i>${esc(S1.st.flow ? 'Tienes una conversación pendiente' : 'Tu chat privado con Sintonía')}</small></span>${ic('chevron-right', 20)}</button>`];
    Yo.doc.parches.forEach(pid => { const d = Lista.docs[pid]; rows.push(P.row(d && d.stage === 'votacion' ? 'voting' : d && ['fijado', 'encurso'].includes(d.stage) ? 'fixed' : 'searching', 'CÓDIGO', pid, d ? d.nombre : 'Cargando…', d ? ETAPA_TXT[d.stage] || '' : '', Yo.doc.organizo.includes(pid) ? 'Lo organizas tú' : 'Te invitaron', pid)); });
    this.put('body', P.phead('Chats', `${Yo.doc.parches.length} parche${Yo.doc.parches.length === 1 ? '' : 's'}`, iniciales()) + `<div class="s-list">${rows.join('')}</div>` + P.btn('Organizar un parche', 'organizar', '', 'primary', 'plus') + P.btn('Tengo un código', 'codigo', '', 'secondary'));
  },

  /* ── Mis sintonías (E1 / E2) ── */
  pMis() {
    Lista.sync();
    const all = Yo.doc.parches.map(pid => Lista.docs[pid]).filter(Boolean);
    const org = all.filter(d => Yo.doc.organizo.includes(d.id)), inv = all.filter(d => !Yo.doc.organizo.includes(d.id));
    const lista = [all, org, inv][this.tab];
    const prox = lista.filter(d => ['fijado', 'encurso'].includes(d.stage) && d.plan && d.plan.fecha > Date.now() - 3 * 3600e3).sort((a, b) => a.plan.fecha - b.plan.fecha)[0];
    const resto = lista.filter(d => d !== prox);
    let h = P.phead('Mis sintonías', `${all.filter(d => d.plan).length} plan${all.filter(d => d.plan).length === 1 ? '' : 'es'} · ${Yo.doc.guardados.length} parche${Yo.doc.guardados.length === 1 ? '' : 's'} guardado${Yo.doc.guardados.length === 1 ? '' : 's'}`, iniciales()) + P.tabs(this.tab, [all.length, org.length, inv.length]);
    if (!lista.length) h += P.empty(this.tab === 2 ? 'Todavía no te han invitado' : 'Todavía no tienes planes', this.tab === 2 ? 'Cuando alguien te invite a un plan, lo verás aquí.' : 'Organiza uno o pide el código del parche de alguien.');
    if (prox) {
      const d = Math.max(0, prox.plan.fecha - Date.now()); const hh = Math.min(99, Math.floor(d / 3600e3)), mm = Math.floor(d % 3600e3 / 60e3);
      h += P.eyebrow('La próxima') + `<article class="s-next">${P.display('countdown', 'Faltan · h:min', `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, 'PARA SALIR')}<div style="display:flex;gap:12px;align-items:center"><div style="flex:1;min-width:0"><h3>${esc(prox.plan.titulo)}</h3><p>${esc(prox.nombre)} · ${esc(fechaCorta(prox.plan.fecha))} · ${esc(hora12(prox.plan.h, prox.plan.m))}</p><p class="t-caption-default">Programada por ${esc(prox.org === Me.uid ? 'ti' : prox.orgNombre || 'Alguien')}</p></div><span class="s-pilot" data-state="fixed">Plan fijado</span></div>${P.btn('Abrir el chat del parche', 'abrir', prox.id, 'secondary')}</article>`;
    }
    if (resto.length) h += P.eyebrow(prox ? 'Después' : 'Tus parches') + `<div class="s-list">${resto.map(d => P.row(d.stage === 'votacion' ? 'voting' : ['fijado', 'encurso'].includes(d.stage) ? 'fixed' : 'searching', d.plan ? fechaCorta(d.plan.fecha).toUpperCase() : 'CÓD', d.plan ? hora12(d.plan.h, d.plan.m) : d.id, d.nombre, ETAPA_TXT[d.stage] || '', d.org === Me.uid ? 'Programada por ti' : `Programada por ${d.orgNombre || 'Alguien'}`, d.id)).join('')}</div>`;
    h += P.presets(Yo.doc.guardados.map(g => { const d = Lista.docs[g.pid]; return { ...g, activo: d && ['votacion', 'fijado', 'encurso'].includes(d.stage), sub: d && d.plan ? 'Próximo: ' + fechaCorta(d.plan.fecha) : 'Sin plan' }; }));
    h += P.btn('Programar una sintonía', 'organizar', '', 'primary', 'chat');
    this.put('body', h);
  },

  /* ── Perfil (E3) ── */
  pPerfil() {
    const c = Yo.doc.consent;
    this.put('body', P.phead('Perfil', 'Tus datos y permisos', iniciales()) + P.eyebrow('Tu nombre') + `<form data-act="nombre"><div style="display:flex;gap:8px"><input name="n" aria-label="Nombre de pila" value="${esc(Yo.doc.nombre)}" maxlength="20" style="flex:1;min-width:0;min-height:48px;padding:12px 16px;border:1px solid var(--color-border-strong);border-radius:9999px;background:var(--color-bg-canvas)"><button class="s-button" data-style="secondary">Guardar</button></div></form>` + P.eyebrow('Permisos') + `<div style="display:grid;gap:8px">${P.toggle('Recibir el plan por WhatsApp', c.wa, 'p-wa')}${P.toggle('Mostrar mi nombre al grupo', c.nom, 'p-nom')}${P.toggle('Usar mis respuestas para mejorar', c.mej, 'p-mej')}</div>` + P.eyebrow('Ayuda') + P.human() + P.btn('Salir y borrar mis datos', 'salir', '', 'danger'));
  },
};
const iniciales = () => { const n = (Yo.doc && Yo.doc.nombre) || ''; return n ? n.slice(0, 2).toUpperCase() : 'Tú'; };
