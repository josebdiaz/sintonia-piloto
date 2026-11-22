// QA de punta a punta del backend · correr: node backend/qa/qa_backend.js con una hoja en memoria (Apps Script simulado)
const vm = require('vm'), fs = require('fs');
const SHEETS = {};
function mkSheet(name) {
  const sh = { name, rows: [], frozen: 0 };
  sh.getLastRow = () => sh.rows.length;
  sh.getLastColumn = () => sh.rows.reduce((m, r) => Math.max(m, r.length), 0);
  sh.appendRow = (r) => { sh.rows.push(r.slice()); };
  sh.setFrozenRows = (n) => { sh.frozen = n; };
  sh.deleteRow = (n) => { sh.rows.splice(n - 1, 1); };
  sh.deleteRows = (n, k) => { sh.rows.splice(n - 1, k); };
  sh.getDataRange = () => ({ getValues: () => sh.rows.map(r => { const w = sh.getLastColumn(); const o = r.slice(); while (o.length < w) o.push(''); return o; }) });
  sh.getRange = (r, c, nr, nc) => ({
    getValues: () => { const out = []; for (let i = 0; i < (nr || 1); i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < (nc || 1); j++) o.push(row[c - 1 + j] === undefined ? '' : row[c - 1 + j]); out.push(o); } return out; },
    setValue: (v) => { while (sh.rows.length < r) sh.rows.push([]); sh.rows[r - 1][c - 1] = v; },
    setValues: (vals) => { vals.forEach((vr, i) => { while (sh.rows.length < r + i) sh.rows.push([]); vr.forEach((v, j) => { sh.rows[r - 1 + i][c - 1 + j] = v; }); }); },
    clearContent: () => { for (let i = 0; i < (nr || 1); i++) for (let j = 0; j < (nc || 1); j++) if (sh.rows[r - 1 + i]) sh.rows[r - 1 + i][c - 1 + j] = ''; }
  });
  sh.copyTo = () => ({ setName: () => {} }); sh.setName = () => sh;
  return sh;
}
const ss = { getSheetByName: n => SHEETS[n] || null, insertSheet: n => (SHEETS[n] = mkSheet(n)), getName: () => 'QA', getSheets: () => [mkSheet('x')], deleteSheet: () => {}, getUrl: () => 'https://qa/respaldo' };
const PROPS = { SHEET_ID: 'qa', ADMIN_KEY: 'admin-key-qa-1234567890', MOTOR_KEY: 'motor-key-qa-1234567890', GEMINI_API_KEY: 'x', GEMINI_MODEL: 'gemini', PRICE_IN_PER_M: '0.3', PRICE_OUT_PER_M: '2.5', AVISO_VERSION: 'v1-2026-10' };
let uid = 0;
const ctx = {
  console, JSON, Date, Math, require,
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in PROPS ? PROPS[k] : null) }) },
  SpreadsheetApp: { openById: () => ss, create: () => ss, getUi: () => { throw new Error('sin UI'); } },
  LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
  ContentService: { createTextOutput: t => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } },
  Utilities: { getUuid: () => require('crypto').randomUUID(), formatDate: () => '2026-10-24 20:00' },
  Session: { getScriptTimeZone: () => 'America/Bogota' },
  Logger: { log: () => {} },
  UrlFetchApp: { fetch: () => ({ getResponseCode: () => 200, getContentText: () => JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ opciones: [{ titulo: 'Museo y café', ids: ['INV-01'], hora_salida: '15:00', presupuesto_aprox: '$20.000', por_que: 'tranqui' }] }) }] } }], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 50 } }) }) }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require('path').join(__dirname, '..', 'Codigo_Piloto.gs'), 'utf8'), ctx);
const post = d => JSON.parse(vm.runInContext('doPost', ctx)({ postData: { contents: JSON.stringify(d) } }).t);
const get = q => JSON.parse(vm.runInContext('doGet', ctx)({ parameter: q }).t);
const A = PROPS.ADMIN_KEY, M = PROPS.MOTOR_KEY;
const res = []; function chk(nombre, ok, det) { res.push([ok ? 'OK ' : 'FALLA', nombre, ok ? '' : String(JSON.stringify(det)).slice(0, 260)]); }

// inventario mínimo (14 columnas + extra) y montaje
vm.runInContext('sheet_("inventario")', ctx);
const invH = SHEETS.inventario.rows[0].concat(['macro_zona']);
SHEETS.inventario.rows[0] = invH;
SHEETS.inventario.rows.push(['INV-01', 'cultura', 'Museo', 'Centro', 'Cra 1', '0', '9-17', '2h', 'fácil', 'todos', 'web', '2026-10-20', 'activo', '', 'Centro']);
vm.runInContext('probarMontaje()', ctx);
chk('probarMontaje crea sesiones y usabilidad', !!SHEETS.sesiones && !!SHEETS.usabilidad, Object.keys(SHEETS));

const cons = { autoriza_datos: true, optin_whatsapp: true, mayor_18: true, consent_investigacion: true };
for (const exp of ['E1', 'E2']) {
  const org = post(Object.assign({ action: 'registrar', experimento: exp, modo: 'piloto', tipo_grupo: 'amigos', n_invitados: 3, planes_realizados_mes: 1, planes_fallidos_mes: 2, fatiga_previa: 4, disponibilidad: 'dias: sabado · franjas: tarde', origen: 'ig', nombre_pila: 'Org' + exp, whatsapp: '+57300100000' + (exp === 'E1' ? 1 : 2) }, cons));
  chk(exp + ' registrar organizador', org.ok && org.experimento === exp, org);
  const lbg = SHEETS.linea_base_grupo.rows.slice(-1)[0];
  chk(exp + ' línea base guarda disponibilidad y origen', lbg.indexOf('dias: sabado · franjas: tarde') >= 0 && lbg.indexOf('ig') >= 0 && lbg.indexOf(3) >= 0, lbg);
  const m1 = post(Object.assign({ action: 'registrar', codigo_invitacion: org.codigo_invitacion, nombre_pila: 'A', whatsapp: '+5730020000' + (exp === 'E1' ? 11 : 21) }, cons));
  const dup = post(Object.assign({ action: 'registrar', codigo_invitacion: org.codigo_invitacion, nombre_pila: 'A2', whatsapp: '+5730020000' + (exp === 'E1' ? 11 : 21) }, cons));
  chk(exp + ' mismo número no acepta dos veces', dup.error === 'ya_registrado', dup);
  const m2 = post(Object.assign({ action: 'registrar', codigo_invitacion: org.codigo_invitacion, nombre_pila: 'B', whatsapp: '+5730020000' + (exp === 'E1' ? 12 : 22) }, cons));
  chk(exp + ' miembros aceptan', m1.ok && m2.ok, [m1, m2]);
  const cr = post({ action: 'cerrar_reclutamiento', key: A, grupo_id: org.grupo_id });
  chk(exp + ' cerrar reclutamiento → activo', cr.ok && cr.estado === 'activo', cr);
  // sesión del mago
  const sIn = post({ action: 'sesion_mago', key: A, accion: 'in', mago: 'Jose', grupo_id: org.grupo_id, experimento: exp });
  chk(exp + ' mago in', sIn.ok && sIn.sesion_id, sIn);
  const vm1 = get({ view: 'mago', key: A });
  chk(exp + ' vista mago trae la sesión abierta', (vm1.sesiones_abiertas || []).some(s => s.sesion_id === sIn.sesion_id), vm1.sesiones_abiertas);
  for (const ronda of [1, 2]) {
    const cp = post({ action: 'crear_plan', key: A, grupo_id: org.grupo_id });
    chk(exp + ' plan ' + ronda + ' creado con ronda ' + ronda, cp.ok && cp.ronda === ronda, cp);
    const otro = post({ action: 'crear_plan', key: A, grupo_id: org.grupo_id });
    chk(exp + ' plan ' + ronda + ': no deja un segundo plan en curso', otro.error === 'plan_en_curso', otro);
    // mover sesión al plan (como hace la consola)
    post({ action: 'sesion_mago', key: A, accion: 'in', mago: 'Jose', plan_id: cp.plan_id, grupo_id: org.grupo_id, experimento: exp });
    const pia = post({ action: 'proponer_ia', key: exp === 'E2' ? M : A, plan_id: cp.plan_id });
    chk(exp + ' plan ' + ronda + ' proponer_ia' + (exp === 'E2' ? ' con MOTOR_KEY' : ''), pia.ok, pia);
    const pub = post({ action: 'publicar_plan', key: exp === 'E2' ? M : A, plan_id: cp.plan_id, opciones: [{ titulo: 'Museo y café', paradas: [{ id: 'INV-01', nombre: 'Museo', zona: 'Centro' }], hora_salida: '15:00' }] });
    chk(exp + ' plan ' + ronda + ' publicar', pub.ok, pub);
    for (const pid of [org.pid, m1.pid, m2.pid]) { const v = post({ action: 'votar', plan_id: cp.plan_id, pid, opcion: 0, veto: false }); if (!v.ok) chk(exp + ' votar', false, v); }
    const he = new Date(Date.now() - 3 * 36e5); const pad = n => String(n).padStart(2, '0');
    const heS = he.getFullYear() + '-' + pad(he.getMonth() + 1) + '-' + pad(he.getDate()) + ' ' + pad(he.getHours()) + ':' + pad(he.getMinutes());
    const cl = post({ action: 'cerrar_plan', key: exp === 'E2' ? M : A, plan_id: cp.plan_id, elegida: 0, hora_encuentro: heS, hora_salida: '14:30' });
    chk(exp + ' plan ' + ronda + ' cerrar con hora', cl.ok, cl);
    for (const pid of [org.pid, m1.pid, m2.pid]) post({ action: 'evento', key: exp === 'E2' ? M : A, plan_id: cp.plan_id, grupo_id: org.grupo_id, pid, tipo: 'checkpoint_llegada', canal: exp });
    const pl = get({ view: 'plan', pid: m1.pid, plan_id: cp.plan_id });
    chk(exp + ' plan ' + ronda + ' vista participante: cerrado, llegó, sin retro', pl.ok && pl.estado === 'cerrado' && pl.yo.llego && pl.yo.usabilidad === false, pl.yo);
    for (const [i, pid] of [org.pid, m1.pid, m2.pid].entries()) {
      const rr = post({ action: 'retro', plan_id: cp.plan_id, pid, satisfaccion_plan: 4, fatiga_post: 2, carga_organizador: 2, valor_final: 4, repetiria: 'si', confort_bot: 4, sentimiento: 'contento' });
      const ub = { action: 'usabilidad', plan_id: cp.plan_id, pid, junto_al_pulso: true, seq_activacion: 6, seq_interaccion: 5, seq_continuidad: 6, sus_omitido: false };
      for (let k = 1; k <= 10; k++) ub['sus_' + (k < 10 ? '0' + k : k)] = k % 2 ? 4 : 2;
      const u = post(ub);
      if (!rr.ok || !u.ok) chk(exp + ' retro + usabilidad', false, [rr, u]);
    }
    const urow = SHEETS.usabilidad.rows.slice(-1)[0], H = SHEETS.usabilidad.rows[0];
    chk(exp + ' plan ' + ronda + ' SEQ continuidad ' + (ronda === 2 ? 'guardada' : 'vacía'), (urow[H.indexOf('seq_continuidad')] === '') === (ronda === 1), urow[H.indexOf('seq_continuidad')]);
    chk(exp + ' plan ' + ronda + ' SUS = 75', urow[H.indexOf('sus_puntaje')] === 75, urow[H.indexOf('sus_puntaje')]);
  }
  // simula 25 minutos de sesión y cierra
  const sr = SHEETS.sesiones.rows, sh = sr[0]; const abierta = sr.filter((r, i) => i > 0 && r[sh.indexOf('estado')] === 'abierta').pop();
  abierta[sh.indexOf('inicio')] = new Date(Date.now() - 25 * 6e4);
  const sOff = post({ action: 'sesion_mago', key: A, accion: 'off', mago: 'Jose' });
  chk(exp + ' mago off suma minutos', sOff.ok && sOff.minutos >= 24.9, sOff);
}
const res1 = get({ view: 'resolver', key: M, grupo_id: SHEETS.grupos.rows[1][1], wa: '3001000001' });
chk('resolver con MOTOR_KEY devuelve solo pid y rol', res1.ok && res1.pid && !res1.nombre && !res1.whatsapp, res1);
chk('resolver sin clave queda bloqueado', get({ view: 'resolver', grupo_id: 'x', wa: '3001000001' }).error === 'no_autorizado', null);
chk('MOTOR_KEY no sirve para acciones del equipo', post({ action: 'registrar_cambio', key: M, experimento: 'E1', version: 'v2', descripcion: 'x' }).error === 'no_autorizado', null);
const op = SHEETS.operacion.rows, oh = op[0];
chk('operacion: minutos con causa «sesion»', op.slice(1).some(r => r[oh.indexOf('causa')] === 'sesion'), op.slice(1).map(r => r[oh.indexOf('causa')]));
chk('operacion del motor queda con actor «motor»', (post({ action: 'operacion', key: M, plan_id: SHEETS.planes.rows.slice(-1)[0][1], minutos: 3, causa: 'revision_motor' }).ok) && SHEETS.operacion.rows.slice(-1)[0][oh.indexOf('actor')] === 'motor', SHEETS.operacion.rows.slice(-1)[0]);
const pan = get({ view: 'panel', key: A });
['E1', 'E2'].forEach(x => {
  const e = pan.por_experimento[x], u = e.usabilidad;
  chk('panel ' + x + ': 2 grupos? 1 grupo y 2 planes cerrados', e.grupos === 1 && e.planes_cerrados === 2, [e.grupos, e.planes_cerrados]);
  chk('panel ' + x + ': SEQ y SUS por plan', u && u.por_ronda['1'] && u.por_ronda['2'] && u.total.sus_prom === 75 && u.total.seq_continuidad === 6, u && u.total);
  chk('panel ' + x + ': llegada 100 % y minutos humanos > 0', e.metrica_principal_llegaron_sobre_invitados === 1 && e.costo.minutos_humanos > 0, [e.metrica_principal_llegaron_sobre_invitados, e.costo.minutos_humanos]);
  chk('panel ' + x + ': Nivel 2 (repetirían) 6 de 6', e.todos.repetiria_si === 6 && e.todos.n === 6, e.todos);
});

// 2.3.2: mensajes marcados y cierre automático de sesiones
const g2 = post(Object.assign({ action: 'registrar', experimento: 'E1', modo: 'piloto', tipo_grupo: 'amigos', n_invitados: 2, nombre_pila: 'Z', whatsapp: '+573009990001' }, cons));
const z2 = post(Object.assign({ action: 'registrar', codigo_invitacion: g2.codigo_invitacion, nombre_pila: 'Y', whatsapp: '+573009990002' }, cons));
post({ action: 'cerrar_reclutamiento', key: A, grupo_id: g2.grupo_id });
const pz = post({ action: 'crear_plan', key: A, grupo_id: g2.grupo_id });
const mk = post({ action: 'evento', key: A, plan_id: pz.plan_id, grupo_id: g2.grupo_id, pid: '', tipo: 'msg_opciones' });
const vz = get({ view: 'mago', key: A }).planes.filter(x => x.plan_id === pz.plan_id)[0];
chk('2.3.2 msg_opciones queda en mensajes del plan', mk.ok && vz.mensajes.msg_opciones && vz.mensajes.msg_opciones.length === 1, [mk, vz && vz.mensajes]);
chk('2.3.2 participante no puede marcar mensajes', post({ action: 'evento', plan_id: pz.plan_id, pid: z2.pid, tipo: 'msg_opciones' }).error === 'no_autorizado', null);
const sa = post({ action: 'sesion_mago', key: A, accion: 'in', mago: 'Kate', plan_id: pz.plan_id, grupo_id: g2.grupo_id });
const srs = SHEETS.sesiones.rows, sH = srs[0]; srs.filter(r => r[sH.indexOf('sesion_id')] === sa.sesion_id)[0][sH.indexOf('inicio')] = new Date(Date.now() - 5 * 36e5);
const opAntes = SHEETS.operacion.rows.length, vm2 = get({ view: 'mago', key: A });
chk('2.3.2 sesión de más de 4 h se cierra sola sin minutos', !vm2.sesiones_abiertas.some(x => x.sesion_id === sa.sesion_id) && vm2.sesiones_por_revisar.some(x => x.sesion_id === sa.sesion_id) && SHEETS.operacion.rows.length === opAntes, vm2.sesiones_por_revisar);
const om = post({ action: 'operacion', key: A, plan_id: pz.plan_id, minutos: 35, causa: 'sesion', sesion_id: sa.sesion_id });
chk('2.3.2 minutos manuales completan la sesión cerrada sola', om.ok && !get({ view: 'mago', key: A }).sesiones_por_revisar.some(x => x.sesion_id === sa.sesion_id), om);

// 2.4.0: decisión por ronda, más opciones sin plan caído, modo prueba sin reloj, nombre del grupo, avisos, indicación y 3 opciones
const correos = []; ctx.MailApp = { sendEmail: (to, a, b) => correos.push([to, a, b]), getRemainingDailyQuota: () => 100 }; PROPS.NOTIFICAR_A = 'equipo@qa';
const g4 = post(Object.assign({ action: 'registrar', experimento: 'E1', modo: 'prueba', tipo_grupo: 'amigos', n_invitados: 2, nombre_grupo: 'Parche en la tarde', disponibilidad: 'dias: viernes, sabado · franjas: tarde', nombre_pila: 'Paula', whatsapp: '+573009990011' }, cons));
const y4 = post(Object.assign({ action: 'registrar', codigo_invitacion: g4.codigo_invitacion, nombre_pila: 'Kate', whatsapp: '+573009990012' }, cons));
chk('2.4.0 avisos por correo: inscripción y «ya aceptaron todos», sin nombres ni números', correos.length === 2 && correos.every(c => c[0] === 'equipo@qa' && !/Paula|Kate|300999/.test(c[1] + c[2])), correos);
post({ action: 'cerrar_reclutamiento', key: A, grupo_id: g4.grupo_id });
const vg4 = get({ view: 'mago', key: A }).grupos.filter(x => x.grupo_id === g4.grupo_id)[0];
chk('2.4.0 nombre del grupo y disponibilidad en la vista del mago', vg4 && vg4.nombre === 'Parche en la tarde' && /viernes/.test(vg4.disponibilidad), vg4);
const p4 = post({ action: 'crear_plan', key: A, grupo_id: g4.grupo_id });
let llamadas = 0, ultimoPrompt = '';
const resp = ops => ({ getResponseCode: () => 200, getContentText: () => JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ opciones: ops }) }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } }) });
const fetchViejo = ctx.UrlFetchApp.fetch;
ctx.UrlFetchApp.fetch = (u, o) => { llamadas++; ultimoPrompt = JSON.parse(o.payload).contents[0].parts[0].text;
  return llamadas === 1 ? resp([{ tipo: 'exacta', titulo: 'Museo', paradas_ids: ['INV-01'] }])
    : resp([{ tipo: 'exacta', titulo: 'Museo', paradas_ids: ['INV-01'] }, { tipo: 'intermedia', titulo: 'Museo y café', paradas_ids: ['INV-01', 'NO-EXISTE'] }, { tipo: 'diferente', titulo: 'Otra', paradas_ids: ['INV-02'] }]); };
SHEETS.inventario.rows.push(['INV-02', 'comida', 'Galería', 'Alameda', 'Cl 8', '20000', '10-20', '2h', 'fácil', 'todos', 'web', '2026-10-20', 'activo', '', 'Sur']);
const ia4 = post({ action: 'proponer_ia', key: A, plan_id: p4.plan_id, restricciones: '[6:41 p. m.] Kate: mmm pizza o tapas' });
chk('2.4.0 Gemini: pide otra vez si trae menos de 3 y recibe la disponibilidad', llamadas === 2 && /EXACTAMENTE 3/.test(ultimoPrompt) && /viernes, sabado/.test(ultimoPrompt) && ia4.ok, [llamadas, ia4]);
chk('2.4.0 Gemini: sin opciones repetidas y paradas con dirección para Maps', ia4.opciones.length === 2 && ia4.opciones[1].paradas[0].direccion === 'Cl 8' && ia4.opciones[1].tipo === 'diferente', ia4.opciones);
post({ action: 'publicar_plan', key: A, plan_id: p4.plan_id });
const re4 = post({ action: 'reabrir_opciones', key: A, plan_id: p4.plan_id, resultado: 'ninguna', decision: { votaron: 2, total: 2, votos: [0, 0], ninguna: 2 } });
const pl4 = get({ view: 'mago', key: A }).planes.filter(x => x.plan_id === p4.plan_id)[0];
chk('2.4.0 «Pedir más opciones»: vuelve a borrador sin caer y deja la ronda', re4.ok && re4.ronda_votacion === 1 && pl4.estado === 'borrador' && pl4.decisiones.length === 1 && pl4.decisiones[0].resultado === 'ninguna', [re4, pl4 && pl4.estado, pl4 && pl4.decisiones]);
ctx.UrlFetchApp.fetch = () => resp([{ tipo: 'exacta', titulo: 'A', paradas_ids: ['INV-01'] }, { tipo: 'intermedia', titulo: 'B', paradas_ids: ['INV-02'] }, { tipo: 'diferente', titulo: 'C', paradas_ids: ['INV-01', 'INV-02'] }]);
post({ action: 'proponer_ia', key: A, plan_id: p4.plan_id, restricciones: 'x' }); post({ action: 'publicar_plan', key: A, plan_id: p4.plan_id });
const futuro = new Date(Date.now() + 26 * 36e5), fx = futuro.getFullYear() + '-' + String(futuro.getMonth() + 1).padStart(2, '0') + '-' + String(futuro.getDate()).padStart(2, '0') + ' 19:00';
const c4 = post({ action: 'cerrar_plan', key: A, plan_id: p4.plan_id, elegida: 1, hora_encuentro: fx, hora_salida: '6:00 p. m.', decision: { votaron: 2, total: 2, votos: [1, 2, 0], cualquiera: 0, ninguna: 0 } });
const pl4b = get({ view: 'mago', key: A }).planes.filter(x => x.plan_id === p4.plan_id)[0];
chk('2.4.0 cerrar con la decisión de la ronda 2 (votos por opción, sin votos por persona)', c4.ok && pl4b.decisiones.length === 2 && String(pl4b.decisiones[1].resultado) === '1' && pl4b.decisiones[1].votos_opciones === '[1,2,0]' && Object.keys(pl4b.votos_por_pid).length === 0, pl4b && pl4b.decisiones);
const r4 = post({ action: 'retro', plan_id: p4.plan_id, pid: y4.pid, satisfaccion_plan: 4 });
const u4 = post({ action: 'usabilidad', plan_id: p4.plan_id, pid: y4.pid, seq_activacion: 6, seq_interaccion: 6, sus_omitido: true });
chk('2.4.0 modo prueba sin reloj: pulso y usabilidad antes del encuentro', r4.ok && u4.ok, [r4, u4]);
chk('2.4.0 en modo piloto el pulso sigue esperando el encuentro', (() => { const gx = post(Object.assign({ action: 'registrar', experimento: 'E1', modo: 'piloto', tipo_grupo: 'pareja', n_invitados: 2, nombre_pila: 'Q', whatsapp: '+573009990021' }, cons)); const yx = post(Object.assign({ action: 'registrar', codigo_invitacion: gx.codigo_invitacion, nombre_pila: 'W', whatsapp: '+573009990022' }, cons));
  post({ action: 'cerrar_reclutamiento', key: A, grupo_id: gx.grupo_id }); const px = post({ action: 'crear_plan', key: A, grupo_id: gx.grupo_id }); post({ action: 'proponer_ia', key: A, plan_id: px.plan_id, restricciones: 'x' }); post({ action: 'publicar_plan', key: A, plan_id: px.plan_id });
  post({ action: 'cerrar_plan', key: A, plan_id: px.plan_id, elegida: 0, hora_encuentro: fx }); return post({ action: 'retro', plan_id: px.plan_id, pid: yx.pid }).error === 'retro_antes_del_plan'; })(), null);
ctx.UrlFetchApp.fetch = (u, o) => { ultimoPrompt = JSON.parse(o.payload).contents[0].parts[0].text; return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Hola, chicas' }] } }], usageMetadata: {} }) }; };
const rd = post({ action: 'redactar_ia', key: A, plan_id: p4.plan_id, paso: '/recordatorio', tono: 'plan tranqui', datos: 'base', indicacion: 'es un grupo de chicas' });
chk('2.4.0 «Ajustar con Gemini» usa la indicación del mago', rd.ok && /indicación del equipo.*grupo de chicas/.test(ultimoPrompt) && /jerga regional/i.test(ultimoPrompt) && ultimoPrompt.indexOf('indicación') < ultimoPrompt.indexOf('Tono:'), ultimoPrompt.slice(0, 200));
// v2.7.0 · pulso del mago y medición de la consola
const sus10 = {}; for (let i = 1; i <= 10; i++) sus10['sus_' + String(i).padStart(2, '0')] = i % 2 ? 4 : 2;
const pm = post(Object.assign({ action: 'pulso_mago', key: A, plan_id: p4.plan_id, mago: 'Juan José', consola_version: '2.7.0', tlx_mental: 40, tlx_fisica: 5, tlx_temporal: 30, tlx_desempeno: 20, tlx_esfuerzo: 35, tlx_frustracion: 10 }, sus10));
chk('2.7.0 pulso del mago: SUS 75 y TLX sin ponderar', pm.ok && pm.sus_puntaje === 75 && pm.tlx_raw === 23.3, pm);
chk('2.7.0 pulso del mago: incompleto o sin llave se rechaza', post({ action: 'pulso_mago', key: A, plan_id: p4.plan_id, sus_01: 3 }).error === 'faltan_respuestas' && post(Object.assign({ action: 'pulso_mago', key: 'x', plan_id: p4.plan_id }, sus10)).error === 'no_autorizado', null);
const mc = post({ action: 'medicion_consola', key: A, plan_id: p4.plan_id, mago: 'Juan José', consola_version: '2.7.0', filas: [{ etapa: 'proponer', segundos: 312, toques: 14, scroll: 2400 }, { etapa: 'inventada', segundos: 9 }, { etapa: 'decidir', segundos: 0, toques: 0 }] });
chk('2.7.0 medición de la consola: solo etapas válidas y con datos', mc.ok && mc.filas === 1, mc);
const pnC = get({ view: 'panel', key: A });
chk('2.7.0 panel resume la consola por condición', pnC.ok && pnC.por_experimento && pnC.por_experimento.E1 && pnC.por_experimento.E1.consola && 'por_etapa' in pnC.por_experimento.E1.consola, pnC.por_experimento && pnC.por_experimento.E1 && pnC.por_experimento.E1.consola);
// v2.7.1 · el motor reabre opciones solo en E1.5
{ const fx0 = ctx.UrlFetchApp.fetch; ctx.UrlFetchApp.fetch = () => resp([{ tipo: 'exacta', titulo: 'A', paradas_ids: ['INV-01'] }, { tipo: 'intermedia', titulo: 'B', paradas_ids: ['INV-02'] }, { tipo: 'diferente', titulo: 'C', paradas_ids: ['INV-01', 'INV-02'] }]);
  const ge = post(Object.assign({ action: 'registrar', experimento: 'E2', modo: 'prueba', tipo_grupo: 'amigos', n_invitados: 2, nombre_pila: 'M', whatsapp: '+573009990031' }, cons));
  post(Object.assign({ action: 'registrar', codigo_invitacion: ge.codigo_invitacion, nombre_pila: 'N', whatsapp: '+573009990032' }, cons));
  post({ action: 'cerrar_reclutamiento', key: A, grupo_id: ge.grupo_id }); const pe = post({ action: 'crear_plan', key: A, grupo_id: ge.grupo_id });
  post({ action: 'proponer_ia', key: A, plan_id: pe.plan_id, restricciones: 'x' }); post({ action: 'publicar_plan', key: A, plan_id: pe.plan_id });
  const rm = post({ action: 'reabrir_opciones', key: M, plan_id: pe.plan_id, decision: { votaron: 2, total: 2, votos: [0, 0, 0], ninguna: 2 }, resultado: 'ninguna' });
  chk('2.7.1 el motor reabre opciones en E1.5 (ronda guardada, sin caer)', rm.ok && rm.ronda_votacion === 1, rm);
  const g1 = post(Object.assign({ action: 'registrar', experimento: 'E1', modo: 'prueba', tipo_grupo: 'amigos', n_invitados: 2, nombre_pila: 'O', whatsapp: '+573009990033' }, cons));
  post(Object.assign({ action: 'registrar', codigo_invitacion: g1.codigo_invitacion, nombre_pila: 'P', whatsapp: '+573009990034' }, cons));
  post({ action: 'cerrar_reclutamiento', key: A, grupo_id: g1.grupo_id }); const p1e = post({ action: 'crear_plan', key: A, grupo_id: g1.grupo_id });
  post({ action: 'proponer_ia', key: A, plan_id: p1e.plan_id, restricciones: 'x' }); post({ action: 'publicar_plan', key: A, plan_id: p1e.plan_id });
  const r1e = post({ action: 'reabrir_opciones', key: M, plan_id: p1e.plan_id });
  chk('2.7.1 el motor no reabre planes de E1', r1e.error === 'solo_e15', r1e);
  ctx.UrlFetchApp.fetch = fx0; }
ctx.UrlFetchApp.fetch = fetchViejo; delete PROPS.NOTIFICAR_A;

// 2.8.0 (ola A): aviso por cada aceptación, hora de aceptación, fechas concretas
{ const c8 = []; ctx.MailApp = { sendEmail: (to, a, b) => c8.push([to, a, b]), getRemainingDailyQuota: () => 100 }; PROPS.NOTIFICAR_A = 'equipo@qa,monitor@qa';
  const o8 = post(Object.assign({ action: 'registrar', experimento: 'E1', modo: 'prueba', tipo_grupo: 'amigos', n_invitados: 3, nombre_grupo: 'Ocho', disponibilidad: 'dias: sabado · franjas: tarde · fechas: 2026/11/28, 2026/12/05', nombre_pila: 'Luz', whatsapp: '+573009990041' }, cons));
  post(Object.assign({ action: 'registrar', codigo_invitacion: o8.codigo_invitacion, nombre_pila: 'Mar', whatsapp: '+573009990042' }, cons));
  chk('2.8.0 aviso por cada aceptación (2 de 3), a varios correos, sin nombres ni números', c8.length === 2 && /2 de 3/.test(c8[1][1] + c8[1][2]) && c8[1][0] === 'equipo@qa,monitor@qa' && !/Luz|Mar\b|300999/.test(c8[1][1] + c8[1][2]), c8);
  post(Object.assign({ action: 'registrar', codigo_invitacion: o8.codigo_invitacion, nombre_pila: 'Sol', whatsapp: '+573009990043' }, cons));
  chk('2.8.0 con la última aceptación llega solo «ya aceptaron todos»', c8.length === 3 && /aceptaron todos/.test(c8[2][1]), c8.map(c => c[1]));
  PROPS.AVISO_POR_ACEPTACION = 'no';
  const q8 = post(Object.assign({ action: 'registrar', experimento: 'E1', modo: 'prueba', tipo_grupo: 'amigos', n_invitados: 3, nombre_pila: 'Ra', whatsapp: '+573009990044' }, cons));
  post(Object.assign({ action: 'registrar', codigo_invitacion: q8.codigo_invitacion, nombre_pila: 'Re', whatsapp: '+573009990045' }, cons));
  chk('2.8.0 AVISO_POR_ACEPTACION = no apaga el aviso por aceptación', c8.length === 4, c8.map(c => c[1]));
  delete PROPS.AVISO_POR_ACEPTACION;
  const v8 = get({ view: 'mago', key: A }).grupos.filter(x => x.grupo_id === o8.grupo_id)[0];
  chk('2.8.0 la vista del mago trae la hora de aceptación y las fechas intactas', v8 && v8.miembros.every(m => m.ts) && /fechas: 2026\/11\/28, 2026\/12\/05/.test(v8.disponibilidad), v8 && v8.disponibilidad);
  post({ action: 'cerrar_reclutamiento', key: A, grupo_id: o8.grupo_id }); const pl8 = post({ action: 'crear_plan', key: A, grupo_id: o8.grupo_id });
  let pr8 = ''; const fx8 = ctx.UrlFetchApp.fetch; ctx.UrlFetchApp.fetch = (u, o) => { pr8 = JSON.parse(o.payload).contents[0].parts[0].text; return resp([{ tipo: 'exacta', titulo: 'A', paradas_ids: ['INV-01'] }, { tipo: 'intermedia', titulo: 'B', paradas_ids: ['INV-02'] }, { tipo: 'diferente', titulo: 'C', paradas_ids: ['INV-03'] }]); };
  post({ action: 'proponer_ia', key: A, plan_id: pl8.plan_id, restricciones: 'x', fechas: 'sábado 28 de noviembre' });
  chk('2.8.0 Gemini recibe la fecha concreta del plan', /Fecha\(s\) concreta\(s\) del plan: sábado 28 de noviembre/.test(pr8) && /fechas: 2026\/11\/28/.test(pr8), pr8.slice(0, 120));
  ctx.UrlFetchApp.fetch = fx8; delete PROPS.NOTIFICAR_A; }

// 2.5.0: ubicaciones e inventario liviano
const ub = vm.runInContext('revisarUbicaciones_', ctx)([{ id: 'A', direccion: 'Cl 5', latitud: 34516, longitud: -765320 }, { id: 'B', direccion: '', latitud: 3.45, longitud: -76.53 }, { id: 'C', direccion: 'Cra 1', latitud: 4.6, longitud: -74.1 }, { id: 'D', direccion: 'Cra 2', latitud: '', longitud: '' }]);
chk('2.5.0 probarMontaje: ubicaciones (regional, fuera de Cali, sin dirección, sin coordenadas)', /3 de 4 con dirección/.test(ub) && /1 con coordenadas leídas/.test(ub) && /1 con coordenadas fuera de Cali \(p\. ej\. C\)/.test(ub) && /1 sin coordenadas/.test(ub), ub);
const liv = get({ view: 'mago', key: A, inv: '0' });
chk('2.5.0 ?view=mago&inv=0 no envía el inventario y sí cuántos hay', liv.ok && liv.inventario === null && liv.n_inventario >= 1 && Array.isArray(liv.grupos), [liv.inventario, liv.n_inventario]);

const opPre = SHEETS.operacion.rows.length, sesPre = SHEETS.sesiones.rows.length;
const lim = post({ action: 'limpiar_registros', key: A, confirmar: 'EMPEZAR PILOTO' });
chk('2.7.2 Empezar piloto real conserva minutos y sesiones del mago', lim.ok && opPre > 2 && sesPre > 2 && SHEETS.operacion.rows.length === opPre && SHEETS.sesiones.rows.length === sesPre && !('operacion' in lim.borradas), [opPre, sesPre, SHEETS.operacion.rows.length, SHEETS.sesiones.rows.length]);
chk('Empezar piloto real limpia (incluye usabilidad y decisiones)', lim.ok && SHEETS.usabilidad.rows.length <= 2 && SHEETS.inventario.rows.length === 3 && SHEETS.decisiones.rows.length <= 2, lim.borradas);
console.log(res.map(r => r.join(' · ')).join('\n'));
console.log('\n' + res.filter(r => r[0] === 'OK ').length + ' de ' + res.length + ' OK');
const vmL = get({ view: 'mago', key: A }), pnL = get({ view: 'panel', key: A });
console.log('POST-LIMPIEZA grupos:', JSON.stringify(vmL.grupos), 'planes:', (vmL.planes || []).length, 'panel ok:', pnL.ok);
