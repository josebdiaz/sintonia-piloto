/* ============================================================================================
 * Sintonía · lógica y textos de E1 para n8n (E1.5)
 * GENERADO por n8n/snippets/construir.py desde /*@@TAG@@*/ (consola /*@@VERSION@@*/). No editar a mano:
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

  /* ---- Copiado de la consola (sin cambios salvo new Date → new /*@@DL@@*/) ---- */
/*@@CUERPO@@*/

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
    origen: { tag: '/*@@TAG@@*/', consola: '/*@@VERSION@@*/' }
  };
})();
if (typeof module !== 'undefined') module.exports = SINTONIA;
