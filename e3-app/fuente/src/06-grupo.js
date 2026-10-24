/* ── 06 · Chat del grupo: datos compartidos y lógica de Sintonía (idempotente) ── */
let ARTIFACT_URL = '';
const linkParche = pid => ARTIFACT_URL ? `${ARTIFACT_URL}#p-${pid}` : `Código ${pid}`;
const ETAPA_TXT = { reclutando: 'Buscando señal', sinquorum: 'Sin quórum', votacion: 'Votación abierta', resolviendo: 'Resolviendo', fijado: 'Plan fijado', encurso: 'Plan en curso', sobremesa: 'Sobremesa', cancelado: 'Cancelado' };

const Grupo = {
  pid: null, p: null, miembros: [], mensajes: [], votos: [], unsubs: [], cargado: { p: false, mi: false, me: false, vo: false },
  pendIA: false, cola: [], errorEnvio: null, sel: 1,

  base(pid) { return 'parches/' + pid; },
  async crear(ans) {
    let pid = rid(6); for (let i = 0; i < 3 && await Store.get(this.base(pid)).catch(() => null); i++) pid = rid(6);
    const now = Date.now();
    await Store.set(this.base(pid), { id: pid, nombre: ans.nombreParche || 'Parche del domingo', org: Me.uid, orgNombre: Yo.nombreVisible, tipo: ans.tipo || '', quorum: ans.quorum || 4, antojos: ans.antojos || [], franja: ans.franja || 'tarde', stage: 'reclutando', ronda: 0, creado: now, plazo: now + 48 * 3600e3, ans: { historia: ans.historia || '', organiza: ans.organiza || '', energia: ans.energia || null, tamano: ans.tamano || '' } });
    if (!Yo.doc.parches.includes(pid)) Yo.doc.parches.push(pid);
    if (!Yo.doc.organizo.includes(pid)) Yo.doc.organizo.push(pid);
    await Yo.guardar();
    await this.unirme(pid, { franja: ans.franja, restr: [] }, 'organiza');
    return pid;
  },
  async unirme(pid, ans, rol = 'invitado') {
    const yo = { id: Me.uid, uid: Me.uid, nombre: Yo.doc.nombre || 'Alguien', muestra: !!Yo.doc.consent.nom, consent: { ...Yo.doc.consent }, rol, restr: ans.restr || [], franja: ans.franja || 'tarde', unido: Date.now() };
    await Store.set(`${this.base(pid)}/miembros/${Me.uid}`, yo);
    if (!Yo.doc.parches.includes(pid)) { Yo.doc.parches.push(pid); await Yo.guardar(); }
    const p = await Store.get(this.base(pid)); const ms = await Store.list(`${this.base(pid)}/miembros`);
    const n = ms.filter(m => m.consent && !m.salio).length, N = (p && p.quorum) || 4;
    await this.msgAI(pid, 'join-' + Me.uid, `¡${rol === 'organiza' ? 'Arrancamos' : 'Ya está dentro ' + (yo.muestra ? yo.nombre : 'alguien nuevo')}! ${n >= N ? 'Ya están todos.' : `Falta${N - n > 1 ? 'n' : ''} ${N - n} persona${N - n > 1 ? 's' : ''} para que les proponga planes.`}`, 'quinto', { type: 'quorum', n, N });
  },
  async msgAI(pid, id, t, voz, att = null, solo = null) {
    const m = { id, a: 'ai', t, voz, at: Date.now() }; if (att) m.att = att; if (solo) m.solo = solo;
    const prev = this.pid === pid ? this.mensajes.find(x => x._id === id || x.id === id) : null;
    if (prev && prev.t === t && !att) return;
    if (prev) m.at = prev.at;
    await Store.set(`${this.base(pid)}/mensajes/${id}`, m).catch(e => Diag.add('mensaje IA', e));
  },

  abrir(pid) {
    if (this.pid === pid) return;
    this.cerrar(); this.pid = pid; this.cargado = { p: false, mi: false, me: false, vo: false };
    const b = this.base(pid);
    this.unsubs.push(Store.watchDoc(b, d => { this.p = d; this.cargado.p = true; this.cambio(); }));
    this.unsubs.push(Store.watchCol(b + '/miembros', l => { this.miembros = l; this.cargado.mi = true; this.cambio(); }));
    this.unsubs.push(Store.watchCol(b + '/mensajes', l => { this.mensajes = l.sort((a, c) => (a.at || 0) - (c.at || 0)); this.cargado.me = true; this.cambio(); }));
    this.unsubs.push(Store.watchCol(b + '/votos', l => { this.votos = l; this.cargado.vo = true; this.cambio(); }));
    Live.entrar(pid);
  },
  cerrar() { this.unsubs.forEach(u => { try { u(); } catch (e) {} }); this.unsubs = []; this.pid = null; this.p = null; this.miembros = []; this.mensajes = []; this.votos = []; Live.salir(); },
  get listo() { const c = this.cargado; return c.p && c.mi && c.me && c.vo; },
  get activos() { return this.miembros.filter(m => m.consent && !m.salio); },
  get yo() { return this.miembros.find(m => m.uid === Me.uid) || null; },
  get N() { return (this.p && this.p.quorum) || 4; },
  votosRonda(r = this.p && this.p.ronda) { const act = new Set(this.activos.map(m => m.uid)); return this.votos.filter(v => v.ronda === r && act.has(v.uid)); },
  get miVoto() { return this.votosRonda().find(v => v.uid === Me.uid) || null; },
  nombreDe(uid) { const m = this.miembros.find(x => x.uid === uid); return m ? (m.muestra ? m.nombre : 'Alguien') : 'Alguien'; },

  _cambioT: null,
  cambio() { UI.refresh(); clearTimeout(this._cambioT); this._cambioT = setTimeout(() => this.tick(), 350); },

  /* Transiciones del grupo. Cualquiera que tenga el chat abierto las puede escribir: los ids son fijos. */
  _tickT: null,
  async tick() {
    const p = this.p; if (!this.listo || !p || !this.yo) return;
    const pid = this.pid, b = this.base(pid), n = this.activos.length, N = this.N, now = Date.now();
    clearTimeout(this._tickT);
    try {
      if (p.stage === 'reclutando' && n >= N) {
        const restr = [...new Set(this.activos.flatMap(m => m.restr || []))];
        const ops = elegirOpciones(p.antojos, restr, p.franja, 1);
        await Store.update(b, { stage: 'votacion', ronda: 1, opciones: ops, votoAbre: now });
        await this.msgAI(pid, 'opciones-r1', 'Tengo 3 opciones cerca, cortas y posibles. Compárenlas y voten:', 'mago', { type: 'vote', ronda: 1, opciones: ops });
        return;
      }
      if (p.stage === 'reclutando' && p.plazo && now > p.plazo) { await Store.update(b, { stage: 'sinquorum' }); await this.msgAI(pid, 'sinquorum-' + p.plazo, 'No se completó el quórum a tiempo. Puede pasar. ¿Qué hacemos?', 'estatica', { type: 'quorum', n, N }); return; }
      if (p.stage === 'votacion') {
        const vr = this.votosRonda();
        if (vr.some(v => v.opcion === 'ninguna') && !this.mensajes.some(m => m._id === 'veto-r' + p.ronda)) await this.msgAI(pid, 'veto-r' + p.ronda, 'Alguien prefiere otra opción. Si la mayoría tampoco quiere ninguna, les propongo otras.', 'resonador');
        if (n > 0 && vr.length >= n) { await Store.update(b, { stage: 'resolviendo', cierreAt: now }); await this.msgAI(pid, 'cierre-r' + p.ronda, 'Cerró la votación. Estoy revisando con el equipo.', 'mago', { type: 'valves' }); return; }
      }
      if (p.stage === 'resolviendo') {
        const falta = (p.cierreAt || now) + (window.__FAST ? 300 : 6000) - now;
        if (falta > 0) { this._tickT = setTimeout(() => this.tick(), falta + 50); return; }
        const vr = this.votosRonda(); const cuenta = [0, 0, 0]; let ninguna = 0;
        vr.forEach(v => v.opcion === 'ninguna' ? ninguna++ : cuenta[v.opcion - 1]++);
        if (ninguna > vr.length / 2 && (p.ronda || 1) < 2) {
          const restr = [...new Set(this.activos.flatMap(m => m.restr || []))];
          const ops = elegirOpciones(p.antojos, restr, p.franja, 2, (p.opciones || []).map(o => o.id));
          await Store.update(b, { stage: 'votacion', ronda: 2, opciones: ops, votoAbre: now });
          await this.msgAI(pid, 'opciones-r2', 'La mayoría prefiere otra cosa. Aquí van 3 opciones nuevas:', 'resonador', { type: 'vote', ronda: 2, opciones: ops });
          return;
        }
        let k = 0; cuenta.forEach((c, i) => { if (c > cuenta[k]) k = i; });
        const o = (p.opciones || [])[k]; if (!o) return;
        const plan = { ...o, fecha: proximoDomingo(o.h, o.m), votos: cuenta[k], de: vr.length };
        await Store.update(b, { stage: 'fijado', plan, fijadoAt: now });
        await this.msgAI(pid, 'plan', `¡Plan fijado! Ganó «${o.titulo}» con ${cuenta[k]} de ${vr.length} votos. Les aviso un día antes y una hora antes.`, 'antena', { type: 'plan', plan, n, N });
        return;
      }
      if (p.stage === 'sobremesa' && !Yo.doc.sobremesa[pid] && S1.st.flow !== 'D') {
        await S1.iniciar('D', 'D1', { pid, parche: { titulo: p.plan ? p.plan.titulo : p.nombre } });
        UI.aviso('Sintonía te escribió en privado para cerrar el plan.', 'Abrir', () => UI.ir('sintonia'));
      }
    } catch (e) { Diag.add('transición ' + p.stage, e); }
  },

  /* Acciones de la persona */
  async enviar(t, extra = {}) {
    if (!this.pid) return;
    const id = 'm' + Date.now().toString(36) + rid(3);
    const m = { id, a: 'h', uid: Me.uid, nombre: this.yo && this.yo.muestra ? this.yo.nombre : 'Alguien', t, at: Date.now(), ...extra };
    if (Store.falla.offline || !navigator.onLine) { this.cola.push(m); UI.refresh(); return m; }
    try { await Store.write(() => Store.set(`${this.base(this.pid)}/mensajes/${id}`, m)); this.errorEnvio = null; }
    catch (e) { this.errorEnvio = m; Diag.add('enviar', e); }
    UI.refresh(); return m;
  },
  async vaciarCola() { const c = this.cola.splice(0); for (const m of c) { try { await Store.set(`${this.base(this.pid)}/mensajes/${m.id}`, m); } catch (e) { this.cola.push(m); } } UI.refresh(); },
  async reintentar() { const m = this.errorEnvio; if (!m) return; this.errorEnvio = null; try { await Store.set(`${this.base(this.pid)}/mensajes/${m.id}`, m); } catch (e) { this.errorEnvio = m; } UI.refresh(); },

  async votar(k) {
    const p = this.p; if (!p || p.stage !== 'votacion') return;
    try { await Store.write(() => Store.set(`${this.base(this.pid)}/votos/${Me.uid}`, { uid: Me.uid, ronda: p.ronda, opcion: k, at: Date.now() })); }
    catch (e) { this.errorEnvio = { id: 'voto', t: 'Voté por la ' + k, reintento: () => this.votar(k) }; UI.refresh(); return; }
    await this.enviar('Voté por la ' + k);
    const v = this.votosRonda().filter(x => x.uid !== Me.uid).length + 1;
    await this.msgAI(this.pid, `ack-${Me.uid}-r${p.ronda}`, `Voto registrado. Van ${v} de ${this.activos.length}.`, 'mago');
  },
  async ninguna() {
    const p = this.p; if (!p || p.stage !== 'votacion') return;
    await Store.set(`${this.base(this.pid)}/votos/${Me.uid}`, { uid: Me.uid, ronda: p.ronda, opcion: 'ninguna', at: Date.now() });
    await this.enviar('Ninguna me sirve', { solo: Me.uid });
    await this.msgAI(this.pid, `veto-${Me.uid}-r${p.ronda}`, 'Entendido. No le digo a nadie quién fue. ¿Qué no te sirve?', 'resonador', null, Me.uid);
  },
  async cambiarVoto() { if (!this.p || this.p.stage !== 'votacion') return; await Store.del(`${this.base(this.pid)}/votos/${Me.uid}`); await this.msgAI(this.pid, `cambio-${Me.uid}-${Date.now()}`, 'Listo, vuelve a elegir en la tarjeta.', 'mago', null, Me.uid); },
  async miembro(patch) { if (this.yo) await Store.update(`${this.base(this.pid)}/miembros/${Me.uid}`, patch); },
  async guardarSobremesa(pid, ans) { await Store.set(`${this.base(pid)}/sobremesa/${Me.uid}`, { uid: Me.uid, ...ans, at: Date.now() }).catch(e => Diag.add('sobremesa', e)); },

  /* Respuestas rápidas del grupo */
  async rapida(v) {
    const p = this.p || {}, pid = this.pid, n = this.activos.length, N = this.N;
    const ai = (t, voz = 'quinto', solo = null) => this.msgAI(pid, 'r' + Date.now().toString(36) + rid(2), t, voz, null, solo);
    switch (v) {
      case 'Copiar enlace': UI.copiar(linkParche(pid)); return;
      case '¿Quién falta?': await this.enviar(v); return ai(n >= N ? 'Ya están todos. ¡Parche en sintonía!' : `Van ${n} de ${N}. Falta${N - n > 1 ? 'n' : ''} ${N - n}. Compartan el código ${pid}.`);
      case 'Cambiar mi voto': return this.cambiarVoto();
      case 'Muy lejos': case 'Muy caro': case 'No me llama':
        await Store.update(`${this.base(pid)}/votos/${Me.uid}`, { motivo: v }).catch(() => {});
        await this.enviar(v, { solo: Me.uid }); return ai('Gracias. Lo tengo en cuenta para la próxima propuesta.', 'resonador', Me.uid);
      case 'Ajustar hora': await this.enviar('¿Podemos ajustar la hora?'); return ai('Anotado. Si la mayoría quiere otra hora, la muevo al fijar el plan.', 'mago');
      case 'Me apunto': case 'No puedo': await this.miembro({ asistencia: v === 'Me apunto' ? 'si' : 'no' }); await this.enviar(v === 'Me apunto' ? '¡Me apunto!' : 'No puedo ir'); if (v === 'No puedo') return ai('Gracias por avisar. Le cuento al grupo sin detalles.', 'antena'); return;
      case 'Cómo llegar': await this.enviar(v); return ai(p.plan ? `Primera parada: ${p.plan.paradas[0][0]} (${p.plan.zona}), ${fechaCorta(p.plan.fecha)} a las ${hora12(p.plan.h, p.plan.m)}. En esta prueba no hay mapa.` : 'Cuando el plan esté fijado te paso cómo llegar.', 'antena');
      case 'Ahí estaré': case 'Ya no puedo': await this.miembro({ confirmaD1: v === 'Ahí estaré' }); return this.enviar(v);
      case 'Voy tarde': return this.enviar('Voy un poco tarde');
      case '¡Llegué!': { await this.miembro({ llego: true }); await this.enviar('¡Llegué!'); const k = this.activos.filter(m => m.llego || m.uid === Me.uid).length; return this.msgAI(pid, 'llegados', k === 1 ? '¡Ya llegó el primero! Los demás vienen en camino.' : `¡Ya llegaron ${k}! Disfruten.`, 'antena'); }
      case 'Guardar en mis parches': if (!Yo.doc.guardados.some(g => g.pid === pid) && Yo.doc.guardados.length < 4) { Yo.doc.guardados.push({ pid, titulo: p.nombre }); await Yo.guardar(); } UI.aviso('Guardado en Mis parches.'); return;
      case 'Otra idea': await this.enviar('¿Y si armamos otra?'); return ai('Cuando quieran, armo otro plan con este mismo grupo.', 'gramola');
      case 'Dar 24 h más': await Store.update(this.base(pid), { stage: 'reclutando', plazo: Date.now() + 24 * 3600e3 }); return ai('Listo, 24 horas más para que se unan.', 'estatica');
      case 'Seguir con los que estamos': if (n < 2) { await Store.update(this.base(pid), { stage: 'reclutando', plazo: Date.now() + 24 * 3600e3 }); return ai('Para un plan hacen falta al menos 2 personas. Les doy 24 horas más.', 'estatica'); } await Store.update(this.base(pid), { stage: 'reclutando', quorum: n, plazo: Date.now() + 24 * 3600e3 }); return ai(`Seguimos con ${n}. Ya les propongo planes.`, 'estatica');
      case 'Cancelar el plan': await Store.update(this.base(pid), { stage: 'cancelado' }); return ai('Plan cancelado. Cuando quieran, lo intentamos de nuevo.', 'estatica');
      case 'Armar otro plan': UI.ir('sintonia'); return S1.iniciar('organiza', 'A1');
      case '¿Y si llueve?': case 'Ver mapa': default: return this.libre(v, true);
    }
  },
  /* Texto libre en el grupo: Sintonía responde si la nombran o si es una pregunta rápida */
  async libre(t, rapida = false) {
    if (/^\s*salir\s*$/i.test(t)) { await this.enviar(t, { solo: Me.uid }); UI.abrirSalir(); return; }
    await this.enviar(t);
    if (!rapida && !/sinton[ií]a/i.test(t)) return;
    const p = this.p || {};
    const ctx = { canal: 'chat del grupo', parche: p.nombre, etapa: ETAPA_TXT[p.stage], quorum: `${this.activos.length} de ${this.N}`, opciones: (p.opciones || []).map(o => `${o.titulo} (${detalleOpcion(o)})`), plan: p.plan ? `${p.plan.titulo}, ${fechaCorta(p.plan.fecha)} ${hora12(p.plan.h, p.plan.m)}, ${p.plan.zona}; paradas: ${p.plan.paradas.map(x => x[0]).join(', ')}` : null, persona: this.yo && this.yo.muestra ? this.yo.nombre : undefined, nota: 'Contenido de prueba interna: los lugares son ejemplos.' };
    const hist = this.mensajes.filter(m => !m.solo).slice(-10).map(m => ({ quien: m.a === 'ai' ? 'Sintonía' : (m.nombre || 'Alguien'), texto: m.t }));
    this.pendIA = true; UI.refresh();
    let r = await IA.responder(ctx, hist, t);
    this.pendIA = false;
    if (!r) r = t === '¿Y si llueve?' ? 'Si llueve, les propongo una alternativa bajo techo antes de la hora del plan.' : t === 'Ver mapa' ? `En esta prueba no hay mapa. Las zonas: ${(p.opciones || []).map(o => o.zona).join(', ') || 'aún sin opciones'}.` : 'Te leo. Si necesitas algo del plan, escríbeme «Sintonía…» o toca «Habla con un humano».';
    await this.msgAI(this.pid, 'ia' + Date.now().toString(36) + rid(2), r, p.stage === 'fijado' ? 'antena' : 'quinto');
  },
  async salirYBorrar() {
    const pid = this.pid; if (!pid) return;
    const b = this.base(pid);
    await Store.del(`${b}/votos/${Me.uid}`).catch(() => {});
    await Store.del(`${b}/sobremesa/${Me.uid}`).catch(() => {});
    await Store.del(`${b}/miembros/${Me.uid}`).catch(() => {});
    for (const m of this.mensajes.filter(m => m.uid === Me.uid || m.solo === Me.uid || m._id === 'join-' + Me.uid)) await Store.del(`${b}/mensajes/${m._id}`).catch(() => {});
    await this.msgAI(pid, 'salida-' + Date.now().toString(36), 'Alguien salió del parche.', 'guardiana');
    Yo.doc.parches = Yo.doc.parches.filter(x => x !== pid); Yo.doc.organizo = Yo.doc.organizo.filter(x => x !== pid); Yo.doc.guardados = Yo.doc.guardados.filter(g => g.pid !== pid); delete Yo.doc.sobremesa[pid];
    await Yo.guardar();
  },
};
