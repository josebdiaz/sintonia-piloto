/**
 * Sintonía · Piloto v2.1 (E1 WhatsApp + E2 web app) — backend en Google Apps Script
 * ----------------------------------------------------------------------------------
 * Proyecto y hoja NUEVOS, independientes del recolector H1 anterior.
 * Versión 2.1: ajustes I1–I9 del análisis del control de compromisos P6.
 *   I1 línea base POR GRUPO         I2 denominador n_invitados
 *   I3 minutos de operación humana  I4 versionado y change log
 *   I5 WTP y carga solo del organizador
 *   I6 la IA elige desde un inventario verificado
 *   I7 modo prueba excluido del análisis
 *   I8 sin flujo individual
 *   I9 un grupo con consentimiento incompleto o con un retiro queda DESESTIMADO de las pruebas
 *
 * Seguridad
 *   - Las escrituras de los participantes (POST) quedan abiertas; las acciones del equipo exigen ADMIN_KEY.
 *   - Las lecturas con datos (mago, panel) exigen ADMIN_KEY. La vista pública del plan solo muestra opciones y conteos.
 *   - Nombre de pila y WhatsApp van solo en 'contactos'. El resto usa ids seudónimos.
 *   - La clave de Gemini vive en Propiedades del script.
 *
 * Propiedades del script:
 *   SHEET_ID, ADMIN_KEY, GEMINI_API_KEY, GEMINI_MODEL (p. ej. gemini-2.5-flash),
 *   PRICE_IN_PER_M, PRICE_OUT_PER_M (USD/millón de tokens, de la página de precios vigente),
 *   COSTO_HORA_HUMANA_COP (valor de referencia para costear minutos del mago; opcional),
 *   AVISO_VERSION (p. ej. v1-2026-10)
 */

var PROMPT_VERSION = 'p1-2026-10';
var MAX_GRUPO = 8;

/* ============================== Esquema ============================== */

var SHEETS = {
  participantes:    ['ts','pid','grupo_id','rol','experimento','autoriza_datos','optin_whatsapp','mayor_18','consent_investigacion','aviso_version','estado'],
  contactos:        ['ts','pid','nombre_pila','whatsapp'],
  grupos:           ['ts','grupo_id','experimento','modo','organizador_pid','codigo_invitacion','tipo_grupo','tamano_grupo','n_invitados','estado','motivo','version'],
  linea_base_grupo: ['ts','grupo_id','tipo_grupo','tamano_grupo','planes_realizados_mes','planes_fallidos_mes','quien_organiza','fatiga_previa_org'],
  linea_base:       ['ts','pid','grupo_id','fatiga_previa'],
  preferencias:     ['ts','pid','grupo_id','resumen'],
  inventario:       ['id','categoria','nombre','zona','direccion','costo_aprox','horario','duracion','acceso','apto_para','fuente','verificado_el','estado'],
  planes:           ['ts','plan_id','grupo_id','experimento','ronda','version','estado','opciones_json','elegida','t_propuesto','t_publicado','t_cerrado','n_invitados','n_consentidos','n_apuntados','n_asistentes','nota'],
  votos:            ['ts','plan_id','pid','opcion','veto'],
  eventos:          ['ts','plan_id','grupo_id','pid','tipo','canal','nota'],
  operacion:        ['ts','plan_id','grupo_id','experimento','actor','minutos','causa','nota'],
  cambios:          ['ts','experimento','version','descripcion','registrado_por'],
  tokens:           ['ts','plan_id','grupo_id','uso','modelo','prompt_version','tokens_in','tokens_out','costo_usd'],
  retro:            ['ts','plan_id','pid','rol','fatiga_post','carga_organizador','valor_final','repetiria','confort_bot','sentimiento_autodeclarado','comentario'],
  wtp:              ['ts','pid','grupo_id','muy_barato','barato','caro','muy_caro','preventa']
};

var TIPOS_GRUPO  = ['amigos','familia','pareja','trabajo','otro'];
var TIPOS_EVENTO = ['activacion','recordatorio','me_apunto','no_puedo','salida_sugerida','checkpoint_llegada','llego_casa','cuenta','mensaje_mago','plan_caido','salir'];
var ACTORES      = ['mago','soporte','tecnico'];
var CAUSAS       = ['coordinacion','redactar_mensaje','resolver_duda','cambio_plan','recordatorio','falla_tecnica','seguridad','otro'];

/* ============================== Utilidades ============================== */

function prop_(k, def) { var v = PropertiesService.getScriptProperties().getProperty(k); return (v === null || v === '') ? def : v; }
function ss_() { return SpreadsheetApp.openById(prop_('SHEET_ID')); }
function sheet_(name) {
  var ss = ss_(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(SHEETS[name]); sh.setFrozenRows(1); }
  else if (sh.getLastRow() === 0) { sh.appendRow(SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function append_(name, obj) {
  sheet_(name).appendRow(SHEETS[name].map(function (c) { return c === 'ts' ? new Date() : (obj[c] === undefined ? '' : obj[c]); }));
}
function rows_(name) {
  var v = sheet_(name).getDataRange().getValues(), h = v[0], out = [];
  for (var i = 1; i < v.length; i++) { var o = {}; for (var j = 0; j < h.length; j++) o[h[j]] = v[i][j]; o._row = i + 1; out.push(o); }
  return out;
}
function updateRow_(name, rowNum, patch) {
  var sh = sheet_(name), cols = SHEETS[name];
  Object.keys(patch).forEach(function (k) { var c = cols.indexOf(k); if (c >= 0) sh.getRange(rowNum, c + 1).setValue(patch[k]); });
}
function deleteWhere_(name, fn) {   // borra de abajo hacia arriba para no correr índices
  var r = rows_(name).filter(fn).map(function (x) { return x._row; }).sort(function (a, b) { return b - a; });
  r.forEach(function (n) { sheet_(name).deleteRow(n); });
  return r.length;
}
function id_(p) { return p + '_' + Utilities.getUuid().replace(/-/g, '').slice(0, 10); }
function code_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase(); }
function str_(v, max) { return String(v === undefined || v === null ? '' : v).slice(0, max || 500); }
function int_(v) { var n = parseInt(v, 10); return isNaN(n) ? '' : n; }
function bool_(v) { return v === true || v === 'true' || v === 1 || v === '1'; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function isAdmin_(k) { var a = prop_('ADMIN_KEY', ''); return a !== '' && String(k || '') === a; }
function findOne_(name, key, val) { var r = rows_(name); for (var i = 0; i < r.length; i++) if (String(r[i][key]) === String(val)) return r[i]; return null; }
function activos_(gid) { return rows_('participantes').filter(function (p) { return p.grupo_id === gid && p.estado === 'activo'; }); }

/* ============================== POST ============================== */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse(e.postData.contents || '{}');
    var H = {
      registrar: registrar_, cerrar_reclutamiento: cerrarReclutamiento_, crear_plan: crearPlan_,
      proponer_ia: proponerIA_, publicar_plan: publicarPlan_, votar: votar_, cerrar_plan: cerrarPlan_,
      evento: evento_, operacion: operacion_, registrar_cambio: registrarCambio_, redactar_ia: redactarIA_,
      retro: retro_, wtp: wtp_, revocar: revocar_
    };
    var a = String(d.action || '');
    if (!H[a]) return json_({ ok: false, error: 'accion_desconocida' });
    return json_(H[a](d));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { try { lock.releaseLock(); } catch (x) {} }
}

/** Registro con consentimiento individual. El organizador crea el grupo y declara la línea base POR GRUPO (I1, I2). */
function registrar_(d) {
  if (!(bool_(d.autoriza_datos) && bool_(d.optin_whatsapp) && bool_(d.mayor_18) && bool_(d.consent_investigacion)))
    return { ok: false, error: 'faltan_autorizaciones' };
  var pid = id_('p'), grupo, rol;
  if (!d.codigo_invitacion) {
    rol = 'organizador';
    var tipo = TIPOS_GRUPO.indexOf(String(d.tipo_grupo)) >= 0 ? String(d.tipo_grupo) : '';
    var nInv = int_(d.n_invitados);
    if (!tipo) return { ok: false, error: 'falta_tipo_grupo' };
    if (nInv === '' || nInv < 2 || nInv > MAX_GRUPO) return { ok: false, error: 'n_invitados_invalido' };   // incluye al organizador
    var gid = id_('g'), inv = code_();
    grupo = { grupo_id: gid, experimento: d.experimento === 'E2' ? 'E2' : 'E1', codigo_invitacion: inv };
    append_('grupos', { grupo_id: gid, experimento: grupo.experimento, modo: d.modo === 'prueba' ? 'prueba' : 'piloto',
      organizador_pid: pid, codigo_invitacion: inv, tipo_grupo: tipo, tamano_grupo: int_(d.tamano_grupo), n_invitados: nInv,
      estado: 'reclutando', version: 'v1' });
    append_('linea_base_grupo', { grupo_id: gid, tipo_grupo: tipo, tamano_grupo: int_(d.tamano_grupo),
      planes_realizados_mes: int_(d.planes_realizados_mes), planes_fallidos_mes: int_(d.planes_fallidos_mes),
      quien_organiza: str_(d.quien_organiza, 40), fatiga_previa_org: int_(d.fatiga_previa) });
  } else {
    rol = 'miembro';
    var g = findOne_('grupos', 'codigo_invitacion', str_(d.codigo_invitacion, 20).toUpperCase());
    if (!g) return { ok: false, error: 'invitacion_invalida' };
    if (g.estado !== 'reclutando') return { ok: false, error: 'reclutamiento_cerrado' };
    if (activos_(g.grupo_id).length >= Math.min(MAX_GRUPO, Number(g.n_invitados) || MAX_GRUPO)) return { ok: false, error: 'grupo_lleno' };
    grupo = { grupo_id: g.grupo_id, experimento: g.experimento, codigo_invitacion: g.codigo_invitacion };
  }
  append_('participantes', { pid: pid, grupo_id: grupo.grupo_id, rol: rol, experimento: grupo.experimento,
    autoriza_datos: true, optin_whatsapp: true, mayor_18: true, consent_investigacion: true,
    aviso_version: prop_('AVISO_VERSION', 'v1'), estado: 'activo' });
  append_('contactos', { pid: pid, nombre_pila: str_(d.nombre_pila, 40), whatsapp: str_(d.whatsapp, 20).replace(/[^\d+]/g, '') });
  if (int_(d.fatiga_previa) !== '') append_('linea_base', { pid: pid, grupo_id: grupo.grupo_id, fatiga_previa: int_(d.fatiga_previa) });
  if (d.preferencias) append_('preferencias', { pid: pid, grupo_id: grupo.grupo_id, resumen: str_(d.preferencias, 400) });
  return { ok: true, pid: pid, rol: rol, grupo_id: grupo.grupo_id, experimento: grupo.experimento,
    codigo_invitacion: rol === 'organizador' ? grupo.codigo_invitacion : undefined };
}

/** I9: el grupo entra al piloto solo si TODOS los invitados dieron consentimiento; si no, queda desestimado. */
function cerrarReclutamiento_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var g = findOne_('grupos', 'grupo_id', d.grupo_id); if (!g) return { ok: false, error: 'grupo_no_existe' };
  var n = activos_(g.grupo_id).length, inv = Number(g.n_invitados);
  if (n < inv) { updateRow_('grupos', g._row, { estado: 'excluido', motivo: 'consentimiento_incompleto ' + n + '/' + inv }); return { ok: true, estado: 'excluido', consentidos: n, invitados: inv }; }
  updateRow_('grupos', g._row, { estado: 'activo', motivo: '' });
  return { ok: true, estado: 'activo', consentidos: n, invitados: inv };
}

function crearPlan_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var g = findOne_('grupos', 'grupo_id', d.grupo_id); if (!g) return { ok: false, error: 'grupo_no_existe' };
  if (g.estado !== 'activo') return { ok: false, error: 'grupo_no_elegible:' + g.estado };
  var ronda = rows_('planes').filter(function (p) { return p.grupo_id === g.grupo_id; }).length + 1;
  var pl = id_('pl');
  append_('planes', { plan_id: pl, grupo_id: g.grupo_id, experimento: g.experimento, ronda: ronda, version: g.version || 'v1',
    estado: 'borrador', n_invitados: Number(g.n_invitados), n_consentidos: activos_(g.grupo_id).length });
  return { ok: true, plan_id: pl, ronda: ronda, version: g.version || 'v1' };
}

function inventarioActivo_() { return rows_('inventario').filter(function (i) { return String(i.estado || 'activo') === 'activo' && i.id !== ''; }); }

/** I6: Gemini SOLO elige y compone desde el inventario verificado; los ids que no existan se descartan. */
function proponerIA_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var p = findOne_('planes', 'plan_id', d.plan_id); if (!p) return { ok: false, error: 'plan_no_existe' };
  var inv = inventarioActivo_(); if (!inv.length) return { ok: false, error: 'inventario_vacio' };
  var invTxt = inv.map(function (i) { return [i.id, i.categoria, i.nombre, i.zona, i.costo_aprox, i.horario, i.duracion, i.apto_para].join(' | '); }).join('\n');
  var prefs = rows_('preferencias').filter(function (r) { return r.grupo_id === p.grupo_id; }).map(function (r) { return '- ' + r.resumen; }).join('\n') || '- (sin preferencias declaradas)';
  var prompt =
    'Eres Sintonía, el "quinto amigo" que coordina planes de grupos que ya existen en Cali, Colombia. Tu única tarea es proponer planes.\n' +
    'Arma entre 1 y 3 opciones USANDO SOLO lugares del INVENTARIO (por id). Prohibido inventar lugares, eventos, precios u horarios.\n' +
    'Reglas: (1) que nadie del grupo quede incómodo (least misery): respeta presupuesto, energía y restricciones; ' +
    '(2) 1 o 2 paradas, la mejor al final; (3) sugiere la hora de salida pensando en trancones de hora pico y lluvia en Cali; ' +
    '(4) español de Colombia, tono cercano; sin datos personales.\n\n' +
    'Restricciones del plan: ' + str_(d.restricciones, 600) + '\n' +
    'Preferencias del grupo (resumidas):\n' + prefs + '\n\n' +
    'INVENTARIO (id | categoría | nombre | zona | costo | horario | duración | apto para):\n' + invTxt + '\n\n' +
    'Responde SOLO JSON: {"opciones":[{"titulo":"","paradas_ids":["INV-01"],"hora_salida":"","presupuesto_aprox":"","por_que":""}]}';
  var r = gemini_(prompt, true, p.plan_id, p.grupo_id, 'propuesta');
  if (!r.ok) return r;
  var ops;
  try { ops = JSON.parse(r.text).opciones || []; } catch (x) { return { ok: false, error: 'respuesta_no_json', raw: r.text }; }
  var byId = {}; inv.forEach(function (i) { byId[i.id] = i; });
  var descartadas = 0;
  ops = ops.slice(0, 3).map(function (o) {
    var ids = (o.paradas_ids || []).filter(function (x) { if (byId[x]) return true; descartadas++; return false; }).slice(0, 2);
    return { titulo: str_(o.titulo, 80), hora_salida: str_(o.hora_salida, 40), presupuesto_aprox: str_(o.presupuesto_aprox, 40), por_que: str_(o.por_que, 200),
      paradas: ids.map(function (x) { var i = byId[x]; return { id: i.id, nombre: i.nombre, zona: i.zona, costo_aprox: i.costo_aprox, horario: i.horario }; }) };
  }).filter(function (o) { return o.paradas.length > 0; });
  updateRow_('planes', p._row, { estado: 'en_revision', opciones_json: JSON.stringify(ops), t_propuesto: new Date() });
  return { ok: true, opciones: ops, ids_descartados: descartadas, tokens: r.usage };
}

/** Humano en el loop: el mago revisa o edita antes de publicar. */
function publicarPlan_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var p = findOne_('planes', 'plan_id', d.plan_id); if (!p) return { ok: false, error: 'plan_no_existe' };
  var ops = Array.isArray(d.opciones) ? d.opciones.slice(0, 3) : JSON.parse(p.opciones_json || '[]');
  if (!ops.length) return { ok: false, error: 'sin_opciones' };
  updateRow_('planes', p._row, { estado: 'votando', opciones_json: JSON.stringify(ops), t_publicado: new Date() });
  append_('eventos', { plan_id: p.plan_id, grupo_id: p.grupo_id, tipo: 'activacion', canal: p.experimento, nota: 'plan publicado' });
  return { ok: true };
}

function miembroValido_(pid, gid) { var m = findOne_('participantes', 'pid', pid); return m && m.grupo_id === gid && m.estado === 'activo'; }

function votar_(d) {
  var p = findOne_('planes', 'plan_id', d.plan_id); if (!p || p.estado !== 'votando') return { ok: false, error: 'plan_no_votable' };
  if (!miembroValido_(d.pid, p.grupo_id)) return { ok: false, error: 'no_miembro' };
  var ya = rows_('votos').filter(function (v) { return v.plan_id === p.plan_id && v.pid === d.pid; });
  if (ya.length) updateRow_('votos', ya[0]._row, { opcion: int_(d.opcion), veto: bool_(d.veto) });
  else append_('votos', { plan_id: p.plan_id, pid: d.pid, opcion: int_(d.opcion), veto: bool_(d.veto) });
  return { ok: true };
}

function cerrarPlan_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var p = findOne_('planes', 'plan_id', d.plan_id); if (!p) return { ok: false, error: 'plan_no_existe' };
  updateRow_('planes', p._row, { estado: d.caido ? 'caido' : 'cerrado', elegida: int_(d.elegida), t_cerrado: new Date(), nota: str_(d.nota, 300) });
  return { ok: true };
}

function evento_(d) {
  var tipo = str_(d.tipo, 40);
  if (TIPOS_EVENTO.indexOf(tipo) < 0) return { ok: false, error: 'tipo_invalido' };
  var p = d.plan_id ? findOne_('planes', 'plan_id', d.plan_id) : null;
  var gid = p ? p.grupo_id : str_(d.grupo_id, 20);
  if (!isAdmin_(d.key) && !miembroValido_(d.pid, gid)) return { ok: false, error: 'no_miembro' };
  append_('eventos', { plan_id: p ? p.plan_id : '', grupo_id: gid, pid: str_(d.pid, 20), tipo: tipo, canal: p ? p.experimento : str_(d.canal, 4), nota: str_(d.nota, 300) });
  if (p && (tipo === 'me_apunto' || tipo === 'checkpoint_llegada')) recontar_(p);
  return { ok: true };
}

function recontar_(p) {
  var ev = rows_('eventos').filter(function (e) { return e.plan_id === p.plan_id; }), a = {}, l = {};
  ev.forEach(function (e) { if (e.tipo === 'me_apunto') a[e.pid] = 1; if (e.tipo === 'checkpoint_llegada') l[e.pid] = 1; });
  updateRow_('planes', p._row, { n_apuntados: Object.keys(a).length, n_asistentes: Object.keys(l).length });
}

/** I3: minutos de trabajo humano por plan, con su causa. */
function operacion_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var p = d.plan_id ? findOne_('planes', 'plan_id', d.plan_id) : null;
  var actor = ACTORES.indexOf(String(d.actor)) >= 0 ? String(d.actor) : 'mago';
  var causa = CAUSAS.indexOf(String(d.causa)) >= 0 ? String(d.causa) : 'otro';
  var min = int_(d.minutos); if (min === '' || min < 0 || min > 600) return { ok: false, error: 'minutos_invalidos' };
  append_('operacion', { plan_id: p ? p.plan_id : '', grupo_id: p ? p.grupo_id : str_(d.grupo_id, 20), experimento: p ? p.experimento : str_(d.experimento, 4),
    actor: actor, minutos: min, causa: causa, nota: str_(d.nota, 300) });
  return { ok: true };
}

/** I4: change log. Prerregistra la única mejora permitida entre W1 y W2 por condición y sube la versión de sus grupos. */
function registrarCambio_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var exp = d.experimento === 'E2' ? 'E2' : 'E1', ver = str_(d.version, 10);
  if (!ver || !d.descripcion) return { ok: false, error: 'faltan_datos' };
  var previos = rows_('cambios').filter(function (c) { return c.experimento === exp; }).length;
  append_('cambios', { experimento: exp, version: ver, descripcion: str_(d.descripcion, 600), registrado_por: str_(d.por, 40) });
  rows_('grupos').forEach(function (g) { if (g.experimento === exp && g.modo === 'piloto') updateRow_('grupos', g._row, { version: ver }); });
  return { ok: true, cambios_en_condicion: previos + 1, alerta: previos >= 1 ? 'Ya hay un cambio registrado en esta condición: el protocolo permite solo uno entre W1 y W2' : '' };
}

function redactarIA_(d) {
  if (!isAdmin_(d.key)) return { ok: false, error: 'no_autorizado' };
  var p = d.plan_id ? findOne_('planes', 'plan_id', d.plan_id) : null;
  var prompt =
    'Eres Sintonía, el "quinto amigo" de un grupo en Cali. Redacta UN mensaje de WhatsApp (máx. 60 palabras) para el paso: ' + str_(d.paso, 40) + '.\n' +
    'Tono: ' + str_(d.tono || 'plan tranqui', 40) + '. Español de Colombia, cercano, sin culpa ni presión, máximo un emoji.\n' +
    'Datos del plan: ' + str_(d.datos || (p ? p.opciones_json : ''), 900) + '\n' +
    'Usa solo los lugares y horarios de los datos; no inventes nada ni pidas datos personales. Responde solo con el texto.';
  var r = gemini_(prompt, false, p ? p.plan_id : '', p ? p.grupo_id : '', 'mensaje:' + str_(d.paso, 30));
  return r.ok ? { ok: true, texto: r.text, tokens: r.usage } : r;
}

/** I5: la carga del organizador solo cuenta si quien responde es el organizador. */
function retro_(d) {
  var p = findOne_('planes', 'plan_id', d.plan_id); if (!p) return { ok: false, error: 'plan_no_existe' };
  var m = findOne_('participantes', 'pid', d.pid);
  if (!m || m.grupo_id !== p.grupo_id || m.estado !== 'activo') return { ok: false, error: 'no_miembro' };
  append_('retro', { plan_id: p.plan_id, pid: d.pid, rol: m.rol, fatiga_post: int_(d.fatiga_post),
    carga_organizador: m.rol === 'organizador' ? int_(d.carga_organizador) : '',
    valor_final: int_(d.valor_final), repetiria: str_(d.repetiria, 10), confort_bot: int_(d.confort_bot),
    sentimiento_autodeclarado: str_(d.sentimiento, 20), comentario: str_(d.comentario, 600) });
  return { ok: true };
}

/** I5: disposición a pagar SOLO del organizador (Van Westendorp + preventa sin cobro). */
function wtp_(d) {
  var m = findOne_('participantes', 'pid', d.pid); if (!m || m.estado !== 'activo') return { ok: false, error: 'no_miembro' };
  if (m.rol !== 'organizador') return { ok: false, error: 'solo_organizador' };
  append_('wtp', { pid: d.pid, grupo_id: m.grupo_id, muy_barato: int_(d.muy_barato), barato: int_(d.barato), caro: int_(d.caro), muy_caro: int_(d.muy_caro), preventa: bool_(d.preventa) });
  return { ok: true };
}

/** Revocación: se suprimen TODOS los datos de esa persona y, por rigor (I9), el grupo queda desestimado. */
function revocar_(d) {
  var m = findOne_('participantes', 'pid', d.pid); if (!m) return { ok: false, error: 'no_existe' };
  var pid = m.pid, gid = m.grupo_id;
  ['contactos', 'votos', 'retro', 'wtp', 'linea_base', 'preferencias'].forEach(function (n) { deleteWhere_(n, function (r) { return r.pid === pid; }); });
  deleteWhere_('eventos', function (r) { return r.pid === pid; });
  updateRow_('participantes', findOne_('participantes', 'pid', pid)._row, { estado: 'revocado' });
  var g = findOne_('grupos', 'grupo_id', gid); if (g) updateRow_('grupos', g._row, { estado: 'excluido', motivo: 'retiro_de_un_miembro' });
  return { ok: true };
}

/* ============================== Gemini ============================== */

function gemini_(prompt, asJson, planId, grupoId, uso) {
  var key = prop_('GEMINI_API_KEY', ''); if (!key) return { ok: false, error: 'sin_gemini_key' };
  var model = prop_('GEMINI_MODEL', 'gemini-2.5-flash');
  var body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } };
  if (asJson) body.generationConfig.responseMimeType = 'application/json';
  var res = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent',
    { method: 'post', contentType: 'application/json', headers: { 'x-goog-api-key': key }, payload: JSON.stringify(body), muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return { ok: false, error: 'gemini_' + res.getResponseCode(), detail: res.getContentText().slice(0, 300) };
  var j = JSON.parse(res.getContentText());
  var c = (j.candidates || [])[0];
  var text = c && c.content && c.content.parts ? c.content.parts.map(function (p) { return p.text || ''; }).join('') : '';
  var u = j.usageMetadata || {}, tin = u.promptTokenCount || 0, tout = (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
  var costo = tin / 1e6 * parseFloat(prop_('PRICE_IN_PER_M', '0')) + tout / 1e6 * parseFloat(prop_('PRICE_OUT_PER_M', '0'));
  append_('tokens', { plan_id: planId, grupo_id: grupoId, uso: uso, modelo: model, prompt_version: PROMPT_VERSION, tokens_in: tin, tokens_out: tout, costo_usd: Math.round(costo * 1e6) / 1e6 });
  return { ok: true, text: text, usage: { in: tin, out: tout, costo_usd: costo } };
}

/* ============================== GET ============================== */

function doGet(e) {
  var q = (e && e.parameter) || {};
  try {
    if (q.view === 'plan') return json_(vistaPlan_(q));
    if (!isAdmin_(q.key)) return json_({ ok: false, error: 'no_autorizado' });
    if (q.view === 'mago') return json_(vistaMago_());
    if (q.view === 'panel') return json_(vistaPanel_());
    return json_({ ok: false, error: 'vista_desconocida' });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

function vistaPlan_(q) {
  var p = findOne_('planes', 'plan_id', q.plan_id); if (!p) return { ok: false, error: 'plan_no_existe' };
  if (!miembroValido_(q.pid, p.grupo_id)) return { ok: false, error: 'no_miembro' };
  if (['votando', 'cerrado', 'caido'].indexOf(p.estado) < 0) return { ok: true, estado: 'preparando' };
  var votos = rows_('votos').filter(function (v) { return v.plan_id === p.plan_id; }), conteo = {}, vetos = 0, mio = null;
  votos.forEach(function (v) { if (bool_(v.veto)) vetos++; else conteo[v.opcion] = (conteo[v.opcion] || 0) + 1; if (v.pid === q.pid) mio = bool_(v.veto) ? 'veto' : v.opcion; });
  var me = findOne_('participantes', 'pid', q.pid);
  return { ok: true, estado: p.estado, ronda: p.ronda, opciones: JSON.parse(p.opciones_json || '[]'), conteo: conteo, vetos: vetos,
    mi_voto: mio, rol: me ? me.rol : '', elegida: p.elegida === '' ? null : p.elegida, n_invitados: p.n_invitados, n_apuntados: p.n_apuntados };
}

function vistaMago_() {
  var nombres = {}; rows_('contactos').forEach(function (c) { nombres[c.pid] = { nombre: c.nombre_pila, whatsapp: c.whatsapp }; });
  var part = rows_('participantes').filter(function (p) { return p.estado === 'activo'; });
  var grupos = rows_('grupos').map(function (g) {
    return { grupo_id: g.grupo_id, experimento: g.experimento, modo: g.modo, estado: g.estado, motivo: g.motivo, version: g.version,
      tipo_grupo: g.tipo_grupo, n_invitados: g.n_invitados, codigo_invitacion: g.codigo_invitacion,
      miembros: part.filter(function (p) { return p.grupo_id === g.grupo_id; }).map(function (p) {
        return { pid: p.pid, rol: p.rol, nombre: (nombres[p.pid] || {}).nombre || '', whatsapp: (nombres[p.pid] || {}).whatsapp || '' }; }),
      preferencias: rows_('preferencias').filter(function (r) { return r.grupo_id === g.grupo_id; }).map(function (r) { return r.resumen; }) };
  });
  var planes = rows_('planes').map(function (p) { var o = {}; SHEETS.planes.forEach(function (c) { o[c] = p[c]; }); return o; });
  var inventario = inventarioActivo_().map(function (i) { var o = {}; SHEETS.inventario.forEach(function (c) { o[c] = i[c]; }); return o; });
  return { ok: true, grupos: grupos, planes: planes, inventario: inventario, cambios: rows_('cambios').map(function (c) { return { ts: c.ts, experimento: c.experimento, version: c.version, descripcion: c.descripcion }; }) };
}

/** Panel: solo grupos 'piloto' y no excluidos (I7, I9). Métrica principal: personas que llegaron / personas invitadas (I2). */
function vistaPanel_() {
  var grupos = rows_('grupos'), planes = rows_('planes'), votos = rows_('votos'), retro = rows_('retro'), tokens = rows_('tokens'),
      oper = rows_('operacion'), wtp = rows_('wtp'), lbg = rows_('linea_base_grupo'), part = rows_('participantes');
  var validos = {}; grupos.forEach(function (g) { if (g.modo === 'piloto' && g.estado !== 'excluido') validos[g.grupo_id] = g; });
  var costoHora = parseFloat(prop_('COSTO_HORA_HUMANA_COP', '0'));
  function mean(a) { a = a.filter(function (x) { return x !== '' && x !== null && !isNaN(x); }); return a.length ? a.reduce(function (s, x) { return s + Number(x); }, 0) / a.length : null; }
  function sum(a, k) { return a.reduce(function (s, x) { return s + (Number(x[k]) || 0); }, 0); }
  var porExp = {};
  ['E1', 'E2'].forEach(function (x) {
    var gs = Object.keys(validos).filter(function (k) { return validos[k].experimento === x; });
    var pl = planes.filter(function (p) { return p.experimento === x && validos[p.grupo_id]; });
    var ids = pl.map(function (p) { return p.plan_id; });
    var cerr = pl.filter(function (p) { return p.estado === 'cerrado'; });
    var sinVeto = cerr.filter(function (p) { return !votos.some(function (v) { return v.plan_id === p.plan_id && bool_(v.veto); }); });
    var horas = cerr.map(function (p) { return p.t_publicado && p.t_cerrado ? (new Date(p.t_cerrado) - new Date(p.t_publicado)) / 36e5 : ''; });
    var rOrg = retro.filter(function (q) { return ids.indexOf(q.plan_id) >= 0 && q.rol === 'organizador'; });
    var rTodos = retro.filter(function (q) { return ids.indexOf(q.plan_id) >= 0; });
    var tk = tokens.filter(function (t) { return ids.indexOf(t.plan_id) >= 0; });
    var op = oper.filter(function (o) { return ids.indexOf(o.plan_id) >= 0; });
    var minutos = sum(op, 'minutos'), usd = sum(tk, 'costo_usd');
    var cerradosPorGrupo = {}; cerr.forEach(function (p) { cerradosPorGrupo[p.grupo_id] = (cerradosPorGrupo[p.grupo_id] || 0) + 1; });
    var causas = {}; op.forEach(function (o) { causas[o.causa] = (causas[o.causa] || 0) + (Number(o.minutos) || 0); });
    porExp[x] = {
      grupos: gs.length,
      tipos_grupo: gs.reduce(function (o, k) { var t = validos[k].tipo_grupo; o[t] = (o[t] || 0) + 1; return o; }, {}),
      planes: pl.length, planes_cerrados: cerr.length, planes_caidos: pl.filter(function (p) { return p.estado === 'caido'; }).length,
      embudo: { invitados: sum(pl, 'n_invitados'), consentidos: sum(pl, 'n_consentidos'), apuntados: sum(pl, 'n_apuntados'), llegaron: sum(pl, 'n_asistentes') },
      metrica_principal_llegaron_sobre_invitados: sum(pl, 'n_invitados') ? sum(pl, 'n_asistentes') / sum(pl, 'n_invitados') : null,
      llegaron_sobre_apuntados: sum(pl, 'n_apuntados') ? sum(pl, 'n_asistentes') / sum(pl, 'n_apuntados') : null,
      cierres_sin_veto: cerr.length ? sinVeto.length / cerr.length : null,
      horas_a_cierre_prom: mean(horas),
      repeticion_grupos_2_planes: Object.keys(cerradosPorGrupo).filter(function (k) { return cerradosPorGrupo[k] >= 2; }).length,
      organizador: { carga_prom: mean(rOrg.map(function (q) { return q.carga_organizador; })), fatiga_post_prom: mean(rOrg.map(function (q) { return q.fatiga_post; })), n: rOrg.length },
      todos: { valor_final_prom: mean(rTodos.map(function (q) { return q.valor_final; })), confort_bot_prom: mean(rTodos.map(function (q) { return q.confort_bot; })),
        repetiria_si: rTodos.filter(function (q) { return String(q.repetiria) === 'si'; }).length, n: rTodos.length },
      costo: { tokens_usd: usd, minutos_humanos: minutos, minutos_por_causa: causas,
        costo_humano_cop: costoHora ? minutos / 60 * costoHora : null,
        usd_tokens_por_plan_cerrado: cerr.length ? usd / cerr.length : null, minutos_por_plan_cerrado: cerr.length ? minutos / cerr.length : null },
      versiones: pl.reduce(function (o, p) { o[p.version] = (o[p.version] || 0) + 1; return o; }, {})
    };
  });
  var lb = lbg.filter(function (b) { return validos[b.grupo_id]; });
  return {
    ok: true,
    nota: 'Solo grupos en modo piloto y no desestimados. Comparación E1/E2 descriptiva; n pequeño.',
    grupos_excluidos: grupos.filter(function (g) { return g.modo === 'piloto' && g.estado === 'excluido'; }).map(function (g) { return { grupo_id: g.grupo_id, experimento: g.experimento, motivo: g.motivo }; }),
    grupos_prueba: grupos.filter(function (g) { return g.modo === 'prueba'; }).length,
    participantes_activos: part.filter(function (p) { return p.estado === 'activo' && validos[p.grupo_id]; }).length,
    linea_base_grupos: { n: lb.length, planes_realizados_mes_prom: mean(lb.map(function (b) { return b.planes_realizados_mes; })),
      planes_fallidos_mes_prom: mean(lb.map(function (b) { return b.planes_fallidos_mes; })), fatiga_previa_org_prom: mean(lb.map(function (b) { return b.fatiga_previa_org; })) },
    por_experimento: porExp,
    wtp_organizadores: wtp.filter(function (w) { return validos[w.grupo_id]; }).map(function (w) { return { muy_barato: w.muy_barato, barato: w.barato, caro: w.caro, muy_caro: w.muy_caro, preventa: bool_(w.preventa) }; }),
    cambios: rows_('cambios').map(function (c) { return { experimento: c.experimento, version: c.version, descripcion: c.descripcion }; })
  };
}

/* ============================== Menú ============================== */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Sintonía piloto')
    .addItem('Crear todas las hojas', 'crearHojas')
    .addItem('Borrar datos al cerrar el estudio…', 'borrarDatosEstudio')
    .addToUi();
}
function crearHojas() { Object.keys(SHEETS).forEach(function (n) { sheet_(n); }); SpreadsheetApp.getUi().alert('Hojas listas. Pega el inventario en la hoja "inventario".'); }
function borrarDatosEstudio() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert('Borrar datos del estudio', 'Se borran contactos, preferencias y comentarios libres. No se puede deshacer. ¿Continuar?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  ['contactos', 'preferencias'].forEach(function (n) { var sh = sheet_(n); if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); });
  var r = sheet_('retro'), c = SHEETS.retro.indexOf('comentario') + 1;
  if (r.getLastRow() > 1) r.getRange(2, c, r.getLastRow() - 1, 1).clearContent();
  ui.alert('Listo. Quedan solo métricas con ids seudónimos.');
}
