/* ── 08 · Panel del equipo (solo prueba interna; no es parte del producto) ── */
const Team = {
  el: null, abierto: false, bandeja: [], bandejaUn: null, sel: null, selMsgs: [], selUn: null, _h: '',
  init(el) {
    this.el = el;
    this.bandejaUn = Store.watchCol('soporte', l => { this.bandeja = l.sort((a, b) => (b.at || 0) - (a.at || 0)); this.paint(); });
    Diag.subs.add(() => this.paint());
  },
  verHilo(uid) { if (this.selUn) this.selUn(); this.sel = uid; this.selUn = Store.watchCol(`soporte/${uid}/mensajes`, l => { this.selMsgs = l.sort((a, b) => a.at - b.at); this.paint(); }); },
  paint() {
    if (!this.el) return;
    const G = Grupo, p = G.p;
    const pill = (t, ok, warn) => `<span class="pill"${ok ? ' data-ok' : ''}${warn ? ' data-warn' : ''}>${esc(t)}</span>`;
    const tb = (t, act, v = '', tone = '') => `<button class="tb" data-team="${act}" data-v="${esc(v)}"${tone ? ` data-tone="${tone}"` : ''}>${esc(t)}</button>`;
    let h = `<div class="row"><h2>Panel del equipo</h2><button class="tb close" data-team="cerrar">Cerrar</button></div><p>Solo para la prueba interna. Nada de esto lo ve un participante.</p>`;
    h += `<section><h3>Conexión</h3><div class="row">${pill(Store.shared ? 'BASE COMPARTIDA' : 'SOLO ESTE NAVEGADOR', Store.shared, !Store.shared)}${pill('IA: ' + IA.estado, IA.sample && IA.on)}${pill(Live.room ? 'PRESENCIA EN VIVO' : 'SIN PRESENCIA', !!Live.room)}</div>${Store.shared ? '' : '<p>Sin base compartida, el grupo solo se sincroniza entre pestañas de este navegador.</p>'}</section>`;
    h += `<section><h3>Identidad</h3><p>Eres <b>${esc(Yo.doc ? Yo.doc.nombre || '(sin nombre)' : '…')}</b> · <span class="mono">${esc(Me.uid.slice(-10))}</span></p><form class="row" data-team-form="alias"><input type="text" name="alias" placeholder="Otra identidad en esta pestaña (p. ej. luis)" value="${esc(Me.alias)}" aria-label="Identidad de prueba"><button class="tb">Usar</button></form><p>Para probar el grupo solo, abre otra pestaña con otra identidad o agrega miembros simulados.</p></section>`;
    if (p) {
      const n = G.activos.length;
      h += `<section><h3>Parche ${esc(p.id)}</h3><p><b>${esc(p.nombre)}</b> · etapa <b>${esc(ETAPA_TXT[p.stage] || p.stage)}</b> · ronda ${p.ronda || 0} · quórum ${n} de ${G.N}</p>
      <div class="row">${tb('Quórum −', 'quorum', '-1')}${tb('Quórum +', 'quorum', '1')}${tb('+ Miembro simulado', 'bot')}${tb('Votan los simulados', 'botsvotan')}${tb('Un simulado: «Ninguna»', 'botninguna')}</div>
      <div class="row">${tb('Cerrar votación', 'cerrar-voto')}${tb('Vencer plazo (F3)', 'plazo')}${tb('Recordatorio (C6)', 'c6')}${tb('Día del plan (C7)', 'c7')}${tb('Terminar → sobremesa (D)', 'd')}</div>
      <div class="row">${tb('Volver a reclutar', 'reset', '', 'danger')}${tb('Borrar parche', 'borrar', '', 'danger')}</div>
      <ul>${G.miembros.map(m => `<li>${esc(m.nombre)}${m.bot ? ' (simulado)' : ''} · ${m.consent ? 'aceptó' : 'sin aceptar'}${m.salio ? ' · salió' : ''} · voto ${esc((G.votosRonda().find(v => v.uid === m.uid) || {}).opcion || '—')}</li>`).join('')}</ul></section>`;
    }
    h += `<section><h3>Ir a</h3><div class="row">${['A0', 'A1', 'A4', 'A5a', 'A6a', 'B1a', 'B3', 'D1'].map(s => tb(s, 'paso', s)).join('')}</div><div class="row">${[['Chats', 'chats'], ['Mis sintonías', 'mis'], ['Perfil', 'perfil'], ['Humano (E4)', 'humano'], ['Sintonía 1:1', 'sintonia']].map(([t, v]) => tb(t, 'ir', v)).join('')}</div></section>`;
    h += `<section><h3>Estados del sistema</h3><label class="chk"><input type="checkbox" data-team="offline" ${Store.falla.offline ? 'checked' : ''}> Sin conexión (F1)</label><label class="chk"><input type="checkbox" data-team="errorenvio" ${Store.falla.envio ? 'checked' : ''}> El próximo envío falla (F2)</label><label class="chk"><input type="checkbox" data-team="cargando" ${UI.cargando ? 'checked' : ''}> Mostrar cargando (F5)</label><label class="chk"><input type="checkbox" data-team="ia" ${IA.on ? 'checked' : ''}${IA.sample ? '' : ' disabled'}> Respuestas libres con Claude</label>
      <div class="row">${[['Sistema', ''], ['Claro', 'light'], ['Oscuro', 'dark']].map(([t, v]) => tb('Tema: ' + t, 'tema', v)).join('')}</div></section>`;
    h += `<section><h3>Bandeja «Habla con un humano»</h3>${this.bandeja.length ? `<div class="row">${this.bandeja.slice(0, 8).map(b => tb(`${b.nombre || b.uid.slice(-6)}${b.deEquipo ? '' : ' •'}`, 'hilo', b.uid)).join('')}</div>` : '<p>Sin conversaciones.</p>'}
      ${this.sel ? `<div class="msgs">${this.selMsgs.map(m => `<p><b>${m.a === 'eq' ? 'Equipo' : esc(m.nombre || 'Persona')}:</b> ${esc(m.t)}</p>`).join('')}</div><form class="row" data-team-form="responder"><input type="text" name="t" placeholder="Responder como Equipo de Sintonía" aria-label="Respuesta del equipo"><button class="tb">Enviar</button></form>` : ''}</section>`;
    h += `<section><h3>Diagnóstico</h3><div class="log">${esc(Diag.log.slice(-25).join('\n') || 'Sin eventos.')}</div>${Store.shared ? '' : tb('Borrar datos de este navegador', 'wipe', '', 'danger')}</section>`;
    h += `<section><h3>Contenido</h3><p>Los planes y lugares son de ejemplo y no están verificados. Los rangos de pago (D4) siguen en borrador.</p></section>`;
    if (h !== this._h) {
      const f = document.activeElement && this.el.contains(document.activeElement) ? document.activeElement.name : null; const fv = f ? document.activeElement.value : null;
      this.el.innerHTML = h; this._h = h;
      if (f) { const n = this.el.querySelector(`[name="${f}"]`); if (n) { n.value = fv; n.focus(); } }
    }
    this.el.toggleAttribute('data-open', this.abierto);
  },
  async accion(a, v) {
    const G = Grupo, p = G.p, b = p ? G.base(p.id) : null;
    try {
      switch (a) {
        case 'cerrar': this.abierto = false; break;
        case 'quorum': await Store.update(b, { quorum: Math.max(2, G.N + (+v)) }); break;
        case 'bot': { const used = new Set(G.miembros.map(m => m.nombre)); const nom = NOMBRES_SIM.find(x => !used.has(x)) || ('Sim' + rid(2)); const uid = 'bot-' + rid(4);
          await Store.set(`${b}/miembros/${uid}`, { id: uid, uid, nombre: nom, muestra: true, consent: { wa: true, nom: true, mej: true }, rol: 'invitado', bot: true, restr: [], franja: p.franja || 'tarde', unido: Date.now() });
          const ms = await Store.list(`${b}/miembros`); const n = ms.filter(m => m.consent && !m.salio).length; await G.msgAI(p.id, 'join-' + uid, `¡Ya está dentro ${nom}! ${n >= G.N ? 'Ya están todos.' : `Falta${G.N - n > 1 ? 'n' : ''} ${G.N - n} persona${G.N - n > 1 ? 's' : ''} para que les proponga planes.`}`, 'quinto', { type: 'quorum', n, N: G.N }); break; }
        case 'botsvotan': case 'botninguna': {
          if (p.stage !== 'votacion') { UI.aviso('La votación no está abierta.'); break; }
          const ya = new Set(G.votosRonda().map(x => x.uid)); const bots = G.activos.filter(m => m.bot && !ya.has(m.uid));
          for (const [i, m] of bots.entries()) {
            const op = a === 'botninguna' && i === 0 ? 'ninguna' : [1, 1, 2, 3][Math.floor(Math.random() * 4)];
            await Store.set(`${b}/votos/${m.uid}`, { uid: m.uid, ronda: p.ronda, opcion: op, at: Date.now() });
            if (op !== 'ninguna') await Store.set(`${b}/mensajes/b${Date.now().toString(36)}${rid(2)}`, { id: 'b' + rid(6), a: 'h', uid: m.uid, nombre: m.nombre, t: 'Voté por la ' + op, at: Date.now() });
            if (a === 'botninguna') break;
          } break; }
        case 'cerrar-voto': if (p.stage === 'votacion') { await Store.update(b, { stage: 'resolviendo', cierreAt: Date.now() }); await G.msgAI(p.id, 'cierre-r' + p.ronda, 'Cerró la votación. Estoy revisando con el equipo.', 'mago', { type: 'valves' }); } break;
        case 'plazo': if (p.stage === 'reclutando') await Store.update(b, { plazo: Date.now() - 1000 }); else UI.aviso('Solo aplica mientras se busca quórum.'); break;
        case 'c6': if (p.plan) { await Store.update(b, { recordatorio: true }); await G.msgAI(p.id, 'recordatorio', 'Mañana es el plan. ¿Sigue en pie para ti?', 'despertador', { type: 'countdown' }); } else UI.aviso('Primero fija un plan.'); break;
        case 'c7': if (p.plan) { await Store.update(b, { stage: 'encurso' }); await G.msgAI(p.id, 'dia', `¡Es hoy, es hoy! Salida a las ${hora12(p.plan.h, p.plan.m)} desde ${p.plan.paradas[0][0]}.`, 'antena', { type: 'time' }); } else UI.aviso('Primero fija un plan.'); break;
        case 'd': if (p.plan) { await Store.update(b, { stage: 'sobremesa' }); await G.msgAI(p.id, 'cierre-plan', `¡Gracias por venir a «${p.plan.titulo}»! Les escribo en privado para saber cómo les fue.`, 'gramola', { type: 'cierre' }); } else UI.aviso('Primero fija un plan.'); break;
        case 'reset': { const vs = await Store.list(`${b}/votos`); for (const x of vs) await Store.del(`${b}/votos/${x._id}`); for (const m of G.mensajes) if (/^(opciones-|cierre-|plan$|veto|ack-|recordatorio$|dia$|llegados$|sinquorum-|cambio-)/.test(m._id || '')) await Store.del(`${b}/mensajes/${m._id}`); await Store.update(b, { stage: 'reclutando', ronda: 0, opciones: [], plan: null, recordatorio: false, plazo: Date.now() + 48 * 3600e3 }); break; }
        case 'borrar': { for (const c of ['mensajes', 'votos', 'miembros', 'sobremesa']) { const l = await Store.list(`${b}/${c}`); for (const x of l) await Store.del(`${b}/${c}/${x._id}`); } await Store.del(b); Yo.doc.parches = Yo.doc.parches.filter(x => x !== p.id); Yo.doc.organizo = Yo.doc.organizo.filter(x => x !== p.id); await Yo.guardar(); UI.ir('chats'); break; }
        case 'paso': UI.ir('sintonia'); { const f = v[0] === 'B' ? 'invitado' : v[0] === 'D' ? 'D' : 'organiza'; const extra = v[0] === 'B' || v[0] === 'D' ? { pid: S1.st.pid || G.pid || Yo.doc.parches[0], parche: G.p ? { nombre: G.p.nombre, org: G.p.orgNombre, titulo: G.p.plan ? G.p.plan.titulo : G.p.nombre } : null } : {}; if ((v[0] === 'B' || v[0] === 'D') && !extra.pid) { UI.aviso('Primero abre o crea un parche.'); break; } await S1.iniciar(f, v, extra); } break;
        case 'ir': UI.ir(v); break;
        case 'offline': Store.falla.offline = !Store.falla.offline; if (!Store.falla.offline) await G.vaciarCola(); UI._last = {}; break;
        case 'errorenvio': Store.falla.envio = !Store.falla.envio; break;
        case 'cargando': UI.cargando = !UI.cargando; UI.build(); break;
        case 'ia': IA.on = !IA.on; break;
        case 'tema': if (v) root.dataset.theme = v; else delete root.dataset.theme; swapAvatars(); break;
        case 'hilo': this.verHilo(v); break;
        case 'wipe': LocalDB.wipe(); location.reload(); break;
      }
    } catch (e) { Diag.add('panel ' + a, e); }
    this._h = ''; this.paint(); UI.refresh();
  },
};
