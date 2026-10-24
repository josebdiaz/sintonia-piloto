/* ── 05 · Chat 1:1 con Sintonía: guion de activación (A), invitado (B) y sobremesa (D) ── */
const Yo = {
  doc: null, path: '',
  def: () => ({ nombre: '', consent: { wa: false, nom: false, mej: false }, parches: [], organizo: [], guardados: [], sobremesa: {}, s1: { flow: 'inicio', step: 'A0', ans: {}, log: [], pid: null }, creado: Date.now() }),
  async cargar() {
    this.path = `data/users/${uidSafe(Me.base)}/estado${Me.alias ? '-' + Me.alias : ''}`;
    try { this.doc = await Store.get(this.path); } catch (e) { Diag.add('leer mi estado', e); }
    if (!this.doc) { this.doc = this.def(); if (Me.nombreCuenta) this.doc.sugerido = Me.nombreCuenta.split(' ')[0]; await this.guardar(); }
    const d = this.def(); for (const k in d) if (this.doc[k] === undefined) this.doc[k] = d[k];
    delete this.doc._id;
  },
  _t: null,
  async guardar() {
    clearTimeout(this._t);
    return new Promise(res => { this._t = setTimeout(async () => { try { const d = { ...this.doc }; d.s1 = { ...d.s1, log: d.s1.log.slice(-120) }; await Store.set(this.path, d); } catch (e) { Diag.add('guardar mi estado', e); } res(); }, 150); });
  },
  get nombreVisible() { return this.doc.consent.nom ? (this.doc.nombre || 'Alguien') : 'Alguien'; },
};

const S1 = {
  pendienteIA: false,
  push(a, t, extra = {}) { const m = { id: 'l' + Date.now().toString(36) + rid(3), a, t, at: Date.now(), ...extra }; Yo.doc.s1.log.push(m); return m; },
  async decir(textos, voz = 'quinto', att = null) {
    for (let i = 0; i < textos.length; i++) {
      this.pendienteIA = true; UI.refresh();
      await espera(Math.min(900, 300 + textos[i].length * 8));
      this.pendienteIA = false;
      this.push('ai', textos[i], { voz, att: i === textos.length - 1 ? att : null });
      UI.refresh();
    }
    await Yo.guardar();
  },
  get st() { return Yo.doc.s1; },
  get paso() { return PASOS[this.st.step]; },
  ctx() { return { ans: this.st.ans, yo: Yo.doc, pid: this.st.pid, parche: this.st.parche || null }; },

  async iniciar(flow, step, extra = {}) {
    Object.assign(this.st, { flow, step, ans: { ...(extra.ans || {}) }, pid: extra.pid || null, parche: extra.parche || null });
    await this.mostrar();
  },
  async mostrar() {
    const p = this.paso; if (!p) return;
    const tx = typeof p.say === 'function' ? p.say(this.ctx()) : p.say;
    await this.decir(tx, p.voz || 'quinto', p.input && ['multi', 'band', 'dial', 'toggles', 'invite'].includes(p.input.type) ? { type: p.input.type, step: this.st.step } : null);
    if (p.auto) await p.auto(this.ctx());
  },
  /* Respuesta a un paso: valor + texto que se muestra como mensaje propio */
  async responder(valor, etiqueta) {
    const p = this.paso; if (!p) return;
    if (etiqueta) { this.push('me', etiqueta); UI.refresh(); }
    const r = p.save ? await p.save(this.ctx(), valor) : null;
    if (r === 'stay') { await Yo.guardar(); return; }
    const next = typeof p.next === 'function' ? p.next(this.ctx(), valor) : p.next;
    if (next) { this.st.step = next; await this.mostrar(); } else { this.st.flow = null; this.st.step = null; await Yo.guardar(); }
  },
  /* Texto libre en el 1:1 */
  async texto(t) {
    const p = this.paso;
    if (/^\s*salir\s*$/i.test(t)) { this.push('me', t); UI.abrirSalir(); return; }
    if (p && p.input) {
      const ops = p.input.options ? (typeof p.input.options === 'function' ? p.input.options(this.ctx()) : p.input.options) : [];
      const hit = ops.find(o => norm(o) === norm(t));
      if (p.input.type === 'text') return this.responder(t.trim().slice(0, 40), t.trim());
      if (hit && ['chips', 'toggles', 'invite'].includes(p.input.type)) return this.responder(hit, hit);
      if (p.input.type === 'chips' && p.input.libre) return this.responder(t.trim(), t.trim());
    }
    this.push('me', t); UI.refresh(); await Yo.guardar();
    this.pendienteIA = true; UI.refresh();
    const ctx = { canal: 'chat 1:1 con Sintonía', persona: Yo.doc.nombre || undefined, paso_pendiente: p ? (typeof p.say === 'function' ? p.say(this.ctx()) : p.say).slice(-1)[0] : null, flujo: this.st.flow };
    const hist = this.st.log.slice(-10).map(m => ({ quien: m.a === 'ai' ? 'Sintonía' : 'Persona', texto: m.t }));
    let r = await IA.responder(ctx, hist, t);
    this.pendienteIA = false;
    if (!r) r = p ? 'Te leo. Para seguir, responde con una de las opciones de abajo; si algo no te cuadra, toca «Habla con un humano».' : 'Te leo. Si necesitas algo, toca «Habla con un humano» y una persona del equipo te responde.';
    this.push('ai', r, { voz: (p && p.voz) || 'quinto' }); UI.refresh(); await Yo.guardar();
  },
};
const espera = ms => new Promise(r => setTimeout(r, window.__FAST ? 5 : ms));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').trim();

const TAMANO = { '2 a 3': 3, '4 a 5': 4, '6 o más': 6 };
const EXPLICA = 'WhatsApp: te aviso del plan también por fuera de la app. Nombre: el grupo ve tu nombre de pila; si lo apagas, te ven como «Alguien». Mejorar: usamos tus respuestas sin tu nombre para mejorar Sintonía. Lo puedes cambiar en Perfil.';

const PASOS = {
  /* Entrada */
  A0: { voz: 'quinto', say: c => [`¡Hola${c.yo.sugerido ? ', ' + c.yo.sugerido : ''}! Soy Sintonía (IA), el quinto amigo de tu parche. Te ayudo a armar un plan cerca, corto y posible. Una persona del equipo revisa todo.`, '¿Vas a organizar un plan o te invitaron a uno?'],
    input: { type: 'chips', options: ['Quiero organizar', 'Tengo un código'] }, next: (c, v) => v === 'Tengo un código' ? 'B0' : 'A1' },
  B0: { voz: 'quinto', say: ['Escríbeme el código del parche (son 6 letras o números).'], input: { type: 'text' },
    save: async (c, v) => { const code = String(v).toUpperCase().replace(/[^A-Z0-9]/g, ''); const p = await Store.get('parches/' + code).catch(() => null); if (!p) { await S1.decir(['No encuentro ese código. Revísalo y escríbelo otra vez.']); return 'stay'; } c.ans.pid = code; S1.st.pid = code; S1.st.parche = { nombre: p.nombre, org: p.orgNombre }; },
    next: 'B1a' },
  /* A · Activación (organiza) */
  A1: { voz: 'quinto', say: ['Para empezar, ¿con quién quieres salir?'], input: { type: 'chips', options: ['Amigos', 'Familia', 'Compañeros'] }, save: (c, v) => { c.ans.tipo = v; }, next: 'A2' },
  A2: { voz: 'quinto', say: ['¡Buenísimo! ¿Cuántos serían, contándote a ti?'], input: { type: 'chips', options: Object.keys(TAMANO) }, save: (c, v) => { c.ans.tamano = v; c.ans.quorum = TAMANO[v] || 4; }, next: 'A3a' },
  A3a: { voz: 'quinto', say: ['En el último mes, ¿cuántos planes armaron y cuántos se cayeron?'], input: { type: 'chips', libre: true, options: ['Ninguno', 'Hicimos 1 y se cayeron 2', 'Varios, pero se caen'] }, save: (c, v) => { c.ans.historia = v; }, next: 'A3b' },
  A3b: { voz: 'quinto', say: ['¿Y quién suele organizar?'], input: { type: 'chips', options: ['Yo, siempre', 'Nos turnamos', 'Nadie: se cae solo'] }, save: (c, v) => { c.ans.organiza = v; }, next: 'A4' },
  A4: { voz: 'quinto', say: ['Organizar a veces cansa. ¿Con cuánta energía llegas a armar este plan?'], input: { type: 'dial', q: '¿Con cuánta energía llegas?', key: 'energia', def: 3 }, save: (c, v) => { c.ans.energia = v; }, next: 'A5a' },
  A5a: { voz: 'quinto', say: c => [`${(c.ans.energia || 3) <= 2 ? 'Tranqui, por eso estoy yo. ' : ''}¿Qué se les antoja? Puedes elegir varias.`], input: { type: 'multi', options: ANTOJOS, key: 'antojos' }, save: (c, v) => { c.ans.antojos = v; }, next: 'A5b' },
  A5b: { voz: 'quinto', say: ['¿Y a qué hora del día les queda mejor?'], input: { type: 'band', key: 'franja' }, save: (c, v) => { c.ans.franja = v; }, next: 'A5c' },
  A5c: { voz: 'quinto', say: ['¿Cómo le ponemos al parche?'], input: { type: 'chips', libre: true, options: ['Parche del domingo', 'El parche de siempre'] }, save: (c, v) => { c.ans.nombreParche = String(v).slice(0, 40); }, next: 'A6a' },
  A6a: { voz: 'guardiana', say: ['Antes de armar tu primer plan, tú decides qué compartir. Nada viene encendido:'], input: { type: 'toggles', options: ['¿Para qué es esto?', 'Continuar'] },
    save: async (c, v) => { if (v === '¿Para qué es esto?') { await S1.decir([EXPLICA], 'guardiana'); return 'stay'; } Yo.doc.consent = { ...(c.ans.consent || { wa: false, nom: false, mej: false }) }; }, next: 'A6b' },
  A6b: { voz: 'guardiana', say: ['¿Cómo te llamamos? Solo tu nombre de pila.'], input: { type: 'text', options: c => c.yo.sugerido ? [c.yo.sugerido] : [] }, save: (c, v) => { Yo.doc.nombre = String(v).split(' ')[0].slice(0, 20); }, next: 'A7' },
  A7: { voz: 'quinto', say: c => [`¡Listo, ${Yo.doc.nombre}! Comparte el código con tu parche. Cuando se unan, les propongo tres planes.`], input: { type: 'invite', options: ['Abrir el chat del grupo', 'Copiar enlace'] },
    auto: async c => { if (!c.pid) { const pid = await Grupo.crear(c.ans); S1.st.pid = pid; await Yo.guardar(); UI.refresh(); } },
    save: async (c, v) => { if (v === 'Copiar enlace') { UI.copiar(linkParche(c.pid)); return 'stay'; } UI.ir('grupo', c.pid); }, next: null },
  /* B · Invitado */
  B1a: { voz: 'quinto', say: c => [`¡Hola! ${c.parche && c.parche.org ? c.parche.org : 'Alguien'} te invitó a «${c.parche ? c.parche.nombre : 'un parche'}». Soy Sintonía (IA); una persona del equipo revisa todo.`, '¿Cómo te llamamos? Solo tu nombre de pila.'],
    input: { type: 'text', options: c => c.yo.sugerido ? [c.yo.sugerido] : [] }, save: (c, v) => { Yo.doc.nombre = String(v).split(' ')[0].slice(0, 20); }, next: 'B1b' },
  B1b: { voz: 'quinto', say: c => [`Gracias, ${Yo.doc.nombre}. ¿Quieres participar?`], input: { type: 'chips', options: ['Quiero participar', 'Ahora no'] },
    save: async (c, v) => { if (v === 'Ahora no') { await S1.decir(['Listo, no pasa nada. Si cambias de opinión, vuelve con el mismo código.']); } }, next: (c, v) => v === 'Ahora no' ? null : 'B2a' },
  B2a: { voz: 'quinto', say: ['¿Hay algo que deba tener en cuenta? Esto no se lo muestro a nadie del grupo.'], input: { type: 'multi', options: RESTRICCIONES, key: 'restr' }, save: (c, v) => { c.ans.restr = v; }, next: 'B2b' },
  B2b: { voz: 'quinto', say: ['¿Qué franja te queda mejor?'], input: { type: 'band', key: 'franja' }, save: (c, v) => { c.ans.franja = v; }, next: 'B3' },
  B3: { voz: 'guardiana', say: ['Antes de unirte, tú decides qué compartir. Nada viene encendido y puedes salir cuando quieras escribiendo SALIR.'], input: { type: 'toggles', options: ['¿Para qué es esto?', 'Continuar'] },
    save: async (c, v) => { if (v === '¿Para qué es esto?') { await S1.decir([EXPLICA], 'guardiana'); return 'stay'; } Yo.doc.consent = { ...(c.ans.consent || { wa: false, nom: false, mej: false }) }; await Grupo.unirme(c.pid, c.ans); UI.ir('grupo', c.pid); }, next: null },
  /* D · Sobremesa (1:1, privado) */
  D1: { voz: 'gramola', say: c => [`¿Qué tal estuvo «${c.parche ? c.parche.titulo : 'el plan'}»? Primero lo primero: ¿con cuánta energía quedaste?`], input: { type: 'dial', q: '¿Con cuánta energía quedaste?', key: 'fatigaPost', def: 3 }, save: (c, v) => { c.ans.fatigaPost = v; }, next: 'D2a' },
  D2a: { voz: 'gramola', say: ['Del 1 al 5, ¿qué tan bueno estuvo el plan?'], input: { type: 'chips', options: ['1', '2', '3', '4', '5'] }, save: (c, v) => { c.ans.satisfaccion = +v; }, next: 'D2b' },
  D2b: { voz: 'gramola', say: ['¿Qué fue lo que más valió la pena?'], input: { type: 'chips', libre: true, options: ['La conversación', 'El lugar', 'Que fue fácil'] }, save: (c, v) => { c.ans.valor = v; }, next: 'D3a' },
  D3a: { voz: 'gramola', say: ['¿Cómo te sentiste con el grupo?'], input: { type: 'chips', options: ['Conectado', 'Cómodo', 'Indiferente', 'Incómodo'] }, save: (c, v) => { c.ans.sentimiento = v; }, next: 'D3b' },
  D3b: { voz: 'gramola', say: ['¿Lo repetirías con este parche?'], input: { type: 'chips', options: ['Sí, pronto', 'Tal vez', 'No'] }, save: (c, v) => { c.ans.repetiria = v; }, next: c => Yo.doc.organizo.includes(c.pid) ? 'D4' : 'D5' },
  D4: { voz: 'gramola', say: ['Una más, solo para ti que organizaste: si Sintonía te ahorrara organizar, ¿cuánto pagarías por plan?'], input: { type: 'chips', options: ['Nada', 'Hasta $5.000', '$5.000 a $10.000', 'Más de $10.000', 'No sé'] }, save: (c, v) => { c.ans.dpp = v; }, next: 'D5' },
  D5: { voz: 'gramola', say: ['¡Gracias! Esto me ayuda a armar mejores planes. Te espero en el chat del grupo para cerrar.'], input: { type: 'chips', options: ['Ir al grupo'] },
    auto: async c => { await Grupo.guardarSobremesa(c.pid, c.ans); Yo.doc.sobremesa[c.pid] = true; await Yo.guardar(); },
    save: (c) => { UI.ir('grupo', c.pid); }, next: null },
};
