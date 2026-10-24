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

const lim = post({ action: 'limpiar_registros', key: A, confirmar: 'EMPEZAR PILOTO' });
chk('Empezar piloto real limpia (incluye sesiones y usabilidad)', lim.ok && SHEETS.sesiones.rows.length <= 2 && SHEETS.usabilidad.rows.length <= 2 && SHEETS.inventario.rows.length === 2, lim.borradas);
console.log(res.map(r => r.join(' · ')).join('\n'));
console.log('\n' + res.filter(r => r[0] === 'OK ').length + ' de ' + res.length + ' OK');
const vmL = get({ view: 'mago', key: A }), pnL = get({ view: 'panel', key: A });
console.log('POST-LIMPIEZA grupos:', JSON.stringify(vmL.grupos), 'planes:', (vmL.planes || []).length, 'panel ok:', pnL.ok);
