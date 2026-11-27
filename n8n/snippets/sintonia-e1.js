/* ============================================================================================
 * Sintonía · lógica y textos de E1 para n8n (E1.5)
 * GENERADO por n8n/snippets/construir.py desde piloto/v2.16.0 (consola 2.16.0). No editar a mano:
 * cambia la consola, sube su versión y vuelve a generar. Así E1 y E1.5 dicen lo mismo (validez).
 *
 * Pegar completo al inicio de un nodo Code de n8n («Run Once for All Items») y usar SINTONIA.*.
 * Sin claves, sin nombres, sin números. Los datos entran por los argumentos.
 * ============================================================================================ */
const SINTONIA = (() => {
  /* ---- Fecha fija en la hora de Cali (UTC-5, sin horario de verano). n8n corre en UTC. ---- */
  const OFF = 5 * 3600e3;
  const LOCAL_SIN_ZONA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;
  class DL extends Date {
    constructor(...a) {
      if (a.length >= 2) { const [y, m, d = 1, h = 0, mi = 0, s = 0, ms = 0] = a; super(Date.UTC(y, m, d, h, mi, s, ms) + OFF); }
      else if (a.length === 1 && typeof a[0] === 'string' && LOCAL_SIN_ZONA.test(a[0].trim())) super(a[0].trim() + '-05:00');
      else super(...a);
    }
    _c() { return new Date(this.getTime() - OFF); }
    getDay() { return this._c().getUTCDay(); }
    getDate() { return this._c().getUTCDate(); }
    getMonth() { return this._c().getUTCMonth(); }
    getFullYear() { return this._c().getUTCFullYear(); }
    getHours() { return this._c().getUTCHours(); }
    getMinutes() { return this._c().getUTCMinutes(); }
    getSeconds() { return this._c().getUTCSeconds(); }
    getTimezoneOffset() { return 300; }
    setHours(h, mi, s, ms) { const c = this._c(); c.setUTCHours(h, mi ?? c.getUTCMinutes(), s ?? c.getUTCSeconds(), ms ?? c.getUTCMilliseconds()); return this.setTime(c.getTime() + OFF); }
    setDate(n) { const c = this._c(); c.setUTCDate(n); return this.setTime(c.getTime() + OFF); }
    toLocaleTimeString(l, o) { return super.toLocaleTimeString(l, Object.assign({ timeZone: 'America/Bogota' }, o)); }
    toLocaleDateString(l, o) { return super.toLocaleDateString(l, Object.assign({ timeZone: 'America/Bogota' }, o)); }
    toLocaleString(l, o) { return super.toLocaleString(l, Object.assign({ timeZone: 'America/Bogota' }, o)); }
  }

  /* ---- Lo que la consola lee del navegador, aquí entra por argumentos ---- */
  let BASE = 'https://sintonia.my/piloto/';
  let D = { planes: [], grupos: [], inventario: [] }, sel = {}, dest = 'grupo', FV = {}, HUMANO = '';
  function plan(id) { return (D.planes || []).filter(function (p) { return p.plan_id === id; })[0]; }
  function grupo(id) { return (D.grupos || []).filter(function (g) { return g.grupo_id === id; })[0]; }
  function invById(id) { return (D.inventario || []).filter(function (i) { return i.id === id; })[0]; }
  function fv(id) { return FV[id] === undefined || FV[id] === null ? '' : String(FV[id]); }
  function link(page, params) { var u = new URL(page, BASE); Object.keys(params || {}).forEach(function (k) { if (params[k] !== undefined && params[k] !== '') u.searchParams.set(k, params[k]); }); return u.toString(); }

  /* ---- Copiado de la consola (sin cambios salvo new Date → new DL) ---- */
var DIAS = { entre_semana: 'entre semana', viernes: 'viernes', sabado: 'sábado', domingo: 'domingo' }, FRANJAS = { manana: 'mañana', tarde: 'tarde', noche: 'noche' };
var DOW = { 'viernes': [5], 'sábado': [6], 'domingo': [0], 'entre semana': [1, 2, 3, 4] };
var DSL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], MSL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
var MARCA_TU = 'tu +1 de confianza', MARCA_SU = 'su +1 de confianza';
function aFecha(v) { if (!v) return null; var d = v instanceof Date ? v : new DL(String(v).replace(' ', 'T')); return isNaN(d) ? null : d; }
function horaTxt(d) { return d ? d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''; }
function salidaDe(v, min) { var d = aFecha(v); return d ? horaTxt(new DL(d.getTime() - (min || 60) * 6e4)) : ''; }   // traslado conservador en Cali: 1 h
function corto(s, n) { s = String(s || '').trim(); n = n || 30; if (s.length <= n) return s; var c = s.slice(0, n); var k = c.lastIndexOf(' '); c = (k > 12 ? c.slice(0, k) : c).replace(/[ ,;:·—-]+$/, ''); return c.replace(/\s+(con|de|del|en|y|a|al|la|el|los|las|para|por|o)$/i, ''); }
function dispoDe(g) {
  var t = String((g && g.disponibilidad) || ''), m = t.match(/dias:\s*([^·]*)/), f = t.match(/franjas:\s*([^·]*)/), fx = t.match(/fechas:\s*([^·]*)/);   // 2.8.0: + fechas
  var l = function (x, M) { return x ? x[1].split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) { return M[s] || s.replace(/_/g, ' '); }) : []; };
  var hoy0 = new DL(); hoy0.setHours(0, 0, 0, 0);
  var fechas = (fx ? fx[1].split(',') : []).map(function (s) { var q = s.trim().split(/[\/-]/); return q.length === 3 ? new DL(+q[0], +q[1] - 1, +q[2], 12) : null; })
    .filter(function (d) { return d && !isNaN(d) && d >= hoy0; }).sort(function (a, b) { return a - b; });
  return { dias: l(m, DIAS), franjas: l(f, FRANJAS), fechas: fechas };
}
function fechasDe(g) {
  var d = dispoDe(g);
  if (d.fechas.length > 4) {   // 2.14.0: quien organiza puede marcar todos los días; el plan usa las 4 con más personas disponibles (empate: la más cercana)
    var cnt = function (x) { var k = isoDia(x); return ((g && g.miembros) || []).filter(function (m) { return m.disponibilidad && dispoDe(m).fechas.some(function (y) { return isoDia(y) === k; }); }).length; };
    var top = d.fechas.map(function (x) { return { x: x, n: cnt(x) }; }).sort(function (a, b) { return b.n - a.n || a.x - b.x; }).slice(0, 4).map(function (o) { return o.x; }).sort(function (a, b) { return a - b; });
    return { lista: top, declaradas: true, recortadas: d.fechas.length };
  }
  if (d.fechas.length) return { lista: d.fechas, declaradas: true };
  var hoy = new DL(); hoy.setHours(12, 0, 0, 0); var out = [];
  if (d.dias.length) for (var k = 1; k <= 14 && out.length < 3; k++) { var x = new DL(hoy.getTime() + k * 864e5); if (d.dias.some(function (n) { return (DOW[n] || []).indexOf(x.getDay()) >= 0; })) out.push(x); }
  return { lista: out, declaradas: false };
}
function fechaLarga(x) { return DSL[x.getDay()] + ' ' + x.getDate() + ' de ' + MSL[x.getMonth()]; }
function fechaCortaTxt(x) { return cap(DSL[x.getDay()].slice(0, 3)) + ' ' + x.getDate() + ' ' + MSL[x.getMonth()].slice(0, 3); }
function isoDia(x) { return x.getFullYear() + '-' + pad2(x.getMonth() + 1) + '-' + pad2(x.getDate()); }
function plazoDe(p) {
  var he = aFecha(p && p.hora_encuentro); if (!he) return null;
  var base = aFecha(p.t_cerrado) || new DL(), d = he.getTime() - base.getTime();
  if (d <= 4 * 36e5) return null;
  if (d <= 24 * 36e5) return new DL(he.getTime() - 2 * 36e5);
  var t = new DL(he); t.setDate(t.getDate() - 1); t.setHours(18, 0, 0, 0);
  return t.getTime() - base.getTime() < 2 * 36e5 ? new DL(he.getTime() - 2 * 36e5) : t;
}
function plazoFrase(d) { return d.plazo ? ', hasta ' + d.plazo : ' ahora'; }
function plazoTxt(t) { return t ? 'el ' + DSL[t.getDay()] + ' ' + t.getDate() + ' a las ' + horaTxt(t) : ''; }
function cuandoTxt(g) {
  var F = fechasDe(g), fr = dispoDe(g).franjas;
  if (!F.lista.length) return diaTxt(g);
  return oList(F.lista.map(function (x) { return 'el ' + fechaLarga(x); })) + (fr.length ? ' en la ' + oList(fr) : '');
}
function oList(a) { return a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' o ' + a[a.length - 1]; }
function diaTxt(g) { var d = dispoDe(g); if (!d.dias.length && !d.franjas.length) return ''; var dd = d.dias.map(function (x) { return x === 'entre semana' ? x : 'el ' + x; }); return (dd.length ? oList(dd) : '') + (d.franjas.length ? (dd.length ? ' en la ' : 'la ') + oList(d.franjas) : ''); }
function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
function coordCali(v, min, max) {
  var n = Number(String(v === undefined || v === null ? '' : v).trim().replace(/\s/g, '').replace(',', '.'));
  if (!isFinite(n) || n === 0) return null;
  for (var k = 0; k < 8 && (n < min || n > max) && Math.abs(n) > Math.max(Math.abs(min), Math.abs(max)); k++) n = n / 10;
  return n >= min && n <= max ? Math.round(n * 1e6) / 1e6 : null;
}
function ubicacionDe(s) {
  if (!s) return { ok: false };
  var la = coordCali(s.latitud, 3.2, 3.6), lo = coordCali(s.longitud, -76.7, -76.3), dir = String(s.direccion || '').trim(), nom = String(s.nombre || '').trim();
  if (nom || dir) return { ok: true, q: [nom, dir, 'Cali, Valle del Cauca'].filter(Boolean).join(', '), coords: la !== null && lo !== null };
  if (la !== null && lo !== null) return { ok: true, q: la + ',' + lo, coords: true };
  return { ok: false };
}
function mapaDe(s) { var u = ubicacionDe(s); return u.ok ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(u.q.replace(/, Valle del Cauca$/, '')).replace(/%2C%20/g, ',').replace(/%20/g, '+').replace(/%2C/g, ',') : ''; }
function mezcla(a, b) { var o = Object.assign({}, a || {}); Object.keys(b || {}).forEach(function (k) { if (b[k] !== '' && b[k] !== null && b[k] !== undefined) o[k] = b[k]; }); return o; }
function horasFranja(g) { var f = dispoDe(g).franjas[0] || 'tarde'; return f === 'mañana' ? ['9:00 a. m.', '10:00 a. m.', '11:00 a. m.'] : f === 'noche' ? ['7:00 p. m.', '8:00 p. m.', '9:00 p. m.'] : ['3:00 p. m.', '4:00 p. m.', '5:00 p. m.']; }
function pad2(n) { return String(n).padStart(2, '0'); }
function poll(q, ops, multi) { return { q: q, ops: ops, multi: !!multi }; }
function txtPulso(nom, l) { return (nom ? nom + ', ¿c' : '¿C') + 'ómo te fue en el plan? Cuéntanos aquí: ' + l + '\nTus respuestas son privadas.'; }
function linkRetro(pid, planId) { return S.link('retro.html', { pid: pid, plan_id: planId }); }
function opcionTxt(d, i) {
  var o = d.ops[i]; if (!o) return null; var ps = o.paradas || [], s0 = ps[0];
  var donde = dondeTxt(ps), precio = precioUno(o.presupuesto_aprox);
  var mapa = s0 ? mapaDe(mezcla(invById(s0.id), s0)) : '';
  return 'Opción ' + (i + 1) + ' · ' + corto(o.titulo) + (o.por_que ? '\n' + o.por_que : '') + '\nDónde: ' + donde + (precio ? ' · aprox. ' + precio + ' por persona' : '') + (mapa ? '\nMapa: ' + mapa : '');
}
function dondeTxt(ps) {
  var zonas = (ps || []).map(function (s) { return String(s.zona || '').trim(); }).filter(function (z, k, a) { return z && a.indexOf(z) === k; });
  return (ps || []).map(function (s) { return corto(s.nombre, 32); }).join(' → ') + (zonas.length ? ' (' + zonas.join(' / ') + ')' : '');
}
function tplNorm(r) { if (r === null || r === undefined) return null; if (typeof r === 'string') return { txts: [r] }; var o = Object.assign({}, r); o.txts = o.txts || (o.txt ? [o.txt] : []); return o; }
function tplData(forzar) {
  var dsel = forzar || dest;
  var p = plan(sel.plan), ops = []; if (p) { try { ops = JSON.parse(p.opciones_json || '[]'); } catch (x) {} }
  var w = p && p.estado === 'cerrado' ? ops[Number(p.elegida)] || {} : {};
  var g = p ? grupo(p.grupo_id) : grupo(sel.grupo);
  var est = (p && p.estado_por_pid) || {};
  var noLlegan = g ? g.miembros.filter(function (m) { return !(est[m.pid] || {}).llego && (est[m.pid] || {}).apuntado !== false; }).map(function (m) { return m.nombre; }) : [];
  var s0 = (w.paradas || [])[0], i0 = s0 ? invById(s0.id) || {} : {};
  var dir = s0 ? (s0.direccion || i0.direccion || '') : '';
  var persona = dsel !== 'grupo' && g ? g.miembros.filter(function (m) { return m.pid === dsel; })[0] : null;
  // conteos de la encuesta: vienen del formulario de la decisión (no se registran votos por persona)
  var cnt = ops.map(function (o, k) { return Number(fv('dv' + k)) || 0; }), cq = Number(fv('dvc')) || 0, tot = cnt.map(function (c) { return c + cq; });
  var tope = Math.max.apply(null, tot.concat([0]));
  var empatadas = p && p.estado === 'votando' && tope > 0 && tot.filter(function (c) { return c === tope; }).length > 1 ? ops.filter(function (o, k) { return tot[k] === tope; }).map(function (o) { return corto(o.titulo); }) : [];
  var hd = aFecha(p && p.hora_encuentro), habil = hd ? hd.getDay() >= 1 && hd.getDay() <= 5 : false;
  var apuntados = g ? g.miembros.filter(function (m) { return (est[m.pid] || {}).apuntado === true; }).length : 0;
  return {
    ops: ops, votaron: fv('dvp') !== '' ? fv('dvp') : '[n]', total: g ? g.miembros.length : '[n]', empatadas: empatadas, habil: habil,
    horas: hd ? [-1, 0, 1].map(function (k) { return horaTxt(new DL(hd.getTime() + k * 36e5)); }) : horasFranja(g),
    salida: w.hora_salida || (hd ? salidaDe(hd) : '[hora de salida]'), dir: dir, presupuesto: w.presupuesto_aprox || '',
    aviso: S.link('aviso.html', {}), humano: S.LS.get('sintonia_mago_nombre') || '[tu nombre]',
    n: ops.length || 3, plan: w.titulo || '[plan elegido]', lugar: (w.paradas || []).map(function (s) { return s.nombre + (s.zona ? ' (' + s.zona + ')' : ''); }).join(' → ') || '[lugar]',
    lugarCorto: s0 ? s0.nombre : '[lugar]', mapa: s0 ? mapaDe(mezcla(i0, s0)) : '',
    hora: hd ? S.fecha(hd) : '[día y hora]', horaSola: hd ? horaTxt(hd) : '[hora]', fecha: hd ? hd.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }) : '[fecha]',
    retro: persona && p ? linkRetro(persona.pid, p.plan_id) : '', apuntados: apuntados || '[n]', apuntadosN: apuntados, dia: g ? cuandoTxt(g) : '', dias: dispoDe(g).dias,
    fechas: g ? fechasDe(g).lista : [], plazo: p && p.hora_encuentro ? plazoTxt(plazoDe(p)) : '[plazo]', lugarZ: w.paradas ? dondeTxt(w.paradas) : '[lugar]', precio1: precioUno(w.presupuesto_aprox), planCorto: w.titulo ? corto(w.titulo) : '[plan elegido]', votando: !!(p && p.estado === 'votando'),   // 2.8.0 (ola A, prompts 3 y 4)
    p: p, g: g, persona: persona, nom: persona ? persona.nombre : '', noLlegan: noLlegan
  };
}
var TPL = [
  ['/ingreso', 'Bienvenida (primer mensaje del grupo)', 'grupo', 'dar la bienvenida al grupo del plan y explicar con transparencia que una persona del equipo revisa todo', function (d) { return '¡Hola, parche! Soy Sintonía, ' + MARCA_SU + ' para que el plan sí se dé 👋\nYo les propongo opciones, ustedes votan y yo cuadro la logística. En este piloto una persona del equipo revisa todo.\nEscriban HUMANO para hablar con alguien del equipo o SALIR para salir del grupo.\nPrivacidad: ' + d.aviso; }],
  ['/opciones', 'Opciones · introducción', 'grupo', 'anunciar que van las opciones del plan, una por una, y que al final votan en la encuesta', function (d) { return 'Les traigo ' + d.n + ' planes' + (d.dia ? ' para ' + d.dia : '') + '. Se los mando uno por uno y al final votan ' + (d.fechas.length > 1 ? 'el plan y el día' : 'en la encuesta') + ' 👇'; }],
  ['/opcion_1', 'Opción 1', 'grupo', 'presentar una opción del plan con lo que van a hacer', function (d) { return opcionTxt(d, 0); }],
  ['/opcion_2', 'Opción 2', 'grupo', 'presentar una opción del plan con lo que van a hacer', function (d) { return opcionTxt(d, 1); }],
  ['/opcion_3', 'Opción 3', 'grupo', 'presentar una opción del plan con lo que van a hacer', function (d) { return opcionTxt(d, 2); }],
  ['/encuesta', 'Encuesta para votar', 'grupo', 'pregunta y opciones de la encuesta de votación', function (d) { return d.ops.length ? { poll: poll('¿Cuál les suena más?', d.ops.map(function (o) { return corto(o.titulo); }).concat(['Cualquiera me sirve', 'Ninguna me sirve']), true) } : null; }],
  ['/recordatorio', 'Recordatorio de votación (al grupo a las 2 h; a una persona solo si a las 24 h falta su voto)', 'ambos', 'recordar que falta votar, sin presión', function (d) { if (!d.votando || (!d.persona && d.votaron !== '[n]' && Number(d.votaron) >= Number(d.total))) return null; return d.persona ? d.nom + ', ¿cuál te suena más del plan? Puedes votar en la encuesta del grupo. Con tu voto cerramos los detalles.' : (d.votaron === '[n]' ? '' : 'Van ' + d.votaron + ' de ' + d.total + ' votos. ') + '¿Cuál les suena más? Pueden votar en la encuesta de arriba ⏳'; }],   // 2.8.1: sin votos anotados, sin conteo
  ['/empate', 'Empate · encuesta solo con las empatadas', 'grupo', 'desempatar con una encuesta rápida', function (d) { return d.empatadas.length ? { txt: 'Quedó empate. Desempatemos rápido 👇', poll: poll('¿Cuál va?', d.empatadas, false) } : null; }],
  ['/dia', 'Día · encuesta con las fechas posibles', 'grupo', 'preguntar qué día les queda mejor', function (d) { return d.fechas.length > 1 ? { poll: poll('¿Qué día les queda mejor?', d.fechas.map(fechaCortaTxt), true) } : d.dias.length > 1 ? { poll: poll('¿Qué día les queda mejor?', d.dias.map(cap), true) } : null; }],   // 2.8.0: fechas concretas
  ['/horario', 'Hora del encuentro · encuesta (horas de encuentro, no de salida)', 'grupo', 'preguntar a qué hora les queda mejor', function (d) { return { poll: poll('¿A qué hora nos encontramos?', d.horas, true) }; }],
  ['/confirmado', 'Plan cerrado · tres mensajes cortos', 'grupo', 'confirmar el plan elegido con lugar, hora y salida', function (d) { return d.p && d.p.estado === 'cerrado' ? { txts: ['¡Hay plan! ' + d.planCorto + ' 🙌\nDónde: ' + d.lugarZ + (d.dir ? '\n' + d.dir : ''), 'Cuándo: ' + d.hora + '\nSalida sugerida: ' + d.salida + (d.precio1 ? '\nAprox. ' + d.precio1 + ' por persona' : ''), (d.mapa ? 'Cómo llegar: ' + d.mapa + '\n' : '') + 'En el evento del grupo marquen si van' + plazoFrase(d) + (/\.$/.test(plazoFrase(d)) ? '' : '.')] } : null; }],
  ['/evento', 'Evento del grupo (WhatsApp: Adjuntar → Evento)', 'grupo', 'datos del evento del grupo', function (d) { return d.p && d.p.estado === 'cerrado' ? { evento: { titulo: d.planCorto, descripcion: d.lugarZ + ' · salida sugerida ' + d.salida + (d.plazo ? ' · marquen si van hasta ' + d.plazo : ''), fecha: cap(d.fecha), hora: d.horaSola, ubicacion: [d.lugarCorto, d.dir].filter(Boolean).join(', '), mapa: d.mapa } } : null; }],
  ['/asistencia', 'Asistencia · solo si no creaste el evento', 'grupo', 'pregunta y opciones de la encuesta de asistencia', function () { return { poll: poll('¿Van?', ['Me apunto', 'No puedo'], false) }; }],
  ['/reprogramar', 'Si alguien no puede · otro día u otra hora', 'grupo', 'proponer con calma buscar otro día u otra hora, sin señalar a nadie', function () { return { txt: 'A parte del parche no le cuadra. Busquemos algo que nos sirva a todos.', poll: poll('¿Qué les sirve más?', ['Otro día', 'Otra hora', 'Así está bien'], false) }; }],
  ['/hoy', 'Día del plan · en la mañana', 'grupo', 'recordar que hoy es el plan, con el conteo de confirmados', function (d) { return d.p && d.p.estado === 'cerrado' ? '¡Es hoy! ' + (d.apuntadosN ? 'Van ' + d.apuntadosN + ' confirmados. ' : '') + 'Nos vemos a las ' + d.horaSola + ' en ' + d.lugarCorto + '. Salida sugerida: ' + d.salida + ' 🙌' : null; }],
  ['/salida', 'Hora de salida (2 h antes)', 'ambos', 'avisar la hora de salida sugerida según el tráfico, dos horas antes del encuentro', function (d) { return (d.persona ? d.nom + ', ' : '') + 'Para llegar a ' + d.lugarCorto + ' a las ' + d.horaSola + ', salgan a las ' + d.salida + ' (si llueve o hay trancón, mejor un poco antes) 🚗' + (d.habil ? '\nSi van en carro, revisen el pico y placa.' : ''); }],
  ['/checkpoint', 'Llegada · encuesta a la hora del encuentro', 'grupo', 'preguntar al grupo si ya llegaron', function () { return { poll: poll('¿Ya llegaron?', ['Ya llegué', 'Voy en camino', 'No voy a poder'], false) }; }],
  ['/no_llega', 'Alguien no ha llegado', 'persona', 'preguntar con cuidado a una persona que todavía no llega cómo va y si está bien, sin culpa ni presión', function (d) { return d.nom + ', ¿cómo vas? El parche ya está en ' + d.lugarCorto + '. ¿Todo bien? Si se te complicó llegar, cuéntanos y lo ajustamos 🙌'; }],
  ['/todos', 'Ya llegaron todos', 'grupo', 'celebrar breve que ya llegó todo el parche', function () { return 'Ya estamos todos. ¡Disfruten! 🙌'; }],
  ['/en_casa', '¿Ya en casa? (si el plan fue de noche, al día siguiente a las 10:00)', 'ambos', 'preguntar si ya llegaron bien a la casa después del plan', function (d) { return d.persona ? d.nom + ', ¿ya en casa? Con un «ya en casa» basta.' : { poll: poll('¿Ya en casa?', ['Ya en casa', 'Todavía no'], false) }; }],
  ['/retro', 'Encuesta de cierre · aviso al grupo (los enlaces van por privado)', 'ambos', 'invitar a responder la encuesta de cierre después del plan', function (d) { return d.persona ? (d.retro ? txtPulso(d.nom, d.retro) : null) : '¿Cómo les fue? A cada uno le llega por privado su enlace para contarnos. Sus respuestas son privadas.'; }],
  ['/guardrail', 'Fuera de alcance (política de IA de WhatsApp)', 'ambos', 'decir con amabilidad que solo ayudamos a armar planes y volver al plan', function () { return 'Mi tarea es ayudarles a armar y coordinar planes en Cali, así que en eso no les puedo ayudar. ¿Volvemos al plan?'; }],
  ['/humano', 'Escalar a una persona', 'ambos', 'presentarse como persona del equipo que toma la conversación', function (d) { return 'Hola' + (d.persona ? ' ' + d.nom : '') + ', soy ' + d.humano + ', del equipo de investigación de Sintonía. Tomo la conversación para ayudarles con lo que necesiten. Si es una emergencia, llamen al 123.'; }]
];
function precioUno(x) {
  x = String(x || '').trim(); if (!x) return '';
  var n = (x.match(/\d[\d.,]*/g) || []).map(function (t) { var v = Number(t.replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.')); return /mil|k\b/i.test(x) && v < 1000 ? v * 1000 : v; }).filter(function (v) { return v >= 1000; });
  if (!n.length) return x.replace(/\s*por persona/i, '');
  var v = n.length > 1 ? (Math.min.apply(null, n) + Math.max.apply(null, n)) / 2 : n[0];
  return '$' + (Math.round(v / 1000) * 1000).toLocaleString('es-CO');
}
function fecha(v) {
  if (!v) return ''; var d = new DL(v); if (isNaN(d)) return String(v);
  return d.toLocaleString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' });
}

  const S = { precioUno: precioUno, fecha: fecha, link: link, LS: { get: function (k) { return k === 'sintonia_mago_nombre' ? HUMANO : ''; } } };

  /* ---- API para los nodos de n8n ---- */
  /**
   * Texto de un comando, igual que en la consola.
   * @param {string} cmd  '/opciones', '/opcion_1', '/encuesta', '/confirmado', '/salida', '/retro', …
   * @param {object} x    { plan, grupo, persona_pid?, conteos?, humano?, inventario? }
   *   plan:  { plan_id, grupo_id, estado, opciones_json | opciones, elegida, hora_encuentro, t_cerrado?, estado_por_pid? }
   *   grupo: { grupo_id, disponibilidad, miembros: [{ pid, nombre?, disponibilidad? }] }
   *   conteos: { dv0, dv1, dv2, dvc, dvp } como el formulario de la decisión (votos por opción, «cualquiera», cuántos votaron)
   * @returns {null | { txts: string[], poll?: {q, ops, multi}, evento?: object }}  null = no aplica todavía (igual que la consola)
   */
  function texto(cmd, x) {
    x = x || {};
    var p = x.plan ? Object.assign({}, x.plan) : null;
    if (p && !p.opciones_json && Array.isArray(p.opciones)) p.opciones_json = JSON.stringify(p.opciones);
    D = { planes: p ? [p] : [], grupos: x.grupo ? [x.grupo] : [], inventario: x.inventario || [] };
    sel = { plan: p ? p.plan_id : '', grupo: x.grupo ? x.grupo.grupo_id : '' };
    FV = x.conteos || {}; HUMANO = x.humano || '';
    var i = -1; for (var k = 0; k < TPL.length; k++) if (TPL[k][0] === cmd) i = k;
    if (i < 0) throw new Error('comando_desconocido: ' + cmd);
    var d = tplData(x.persona_pid || 'grupo');
    return tplNorm(TPL[i][4](d));
  }
  /** Las fechas del plan (máximo 4, las de más coincidencias) como 'AAAA-MM-DD', para `proponer_ia` y «¿Qué día?». */
  function fechasPlan(g) { return fechasDe(g).lista.map(isoDia); }
  /** Plazo para confirmar (G1 de 2.8.1). null = sin plazo («marquen si van ahora»). */
  function plazo(p) { var t = plazoDe(p); return { iso: t ? t.toISOString() : null, texto: t ? plazoTxt(t) : '' }; }
  /** `req_id` estable para el backend 2.9.3 (8–80 caracteres [A-Za-z0-9_-]): el mismo intento da el mismo id. */
  function reqId() { var s = Array.prototype.slice.call(arguments).map(function (v) { return String(v === undefined ? '' : v).replace(/[^\w-]+/g, '-'); }).join('_'); return ('e15_' + s).slice(0, 80); }
  /** ¿Quedan [corchetes]? N3: un texto así no sale al grupo. */
  function tieneCorchetes(r) { var t = r ? [].concat(r.txts || [], r.poll ? [r.poll.q].concat(r.poll.ops) : []).join('\n') : ''; return /\[[^\]]+\]/.test(t); }

  return {
    texto: texto, fechasPlan: fechasPlan, plazo: plazo, reqId: reqId, tieneCorchetes: tieneCorchetes,
    precioUno: precioUno, dondeTxt: dondeTxt, corto: corto, linkRetro: linkRetro,
    comandos: TPL.map(function (t) { return { cmd: t[0], titulo: t[1], a_quien: t[2] }; }),
    configurar: function (o) { if (o && o.base) BASE = o.base; },
    origen: { tag: 'piloto/v2.16.0', consola: '2.16.0' }
  };
})();
if (typeof module !== 'undefined') module.exports = SINTONIA;
