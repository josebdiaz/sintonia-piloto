/* Sintonía · piloto (frontend 2.0.x, «M2») · utilidades compartidas (JavaScript sin dependencias)
 * Backend: backend/Codigo_Piloto.gs v2.2.2 (Google Apps Script). Un solo frontend para E1 (WhatsApp + mago) y E2 (web).
 * Versiones: ver CHANGELOG.md en la raíz del repositorio. Al publicar un cambio, sube FRONTEND_VERSION.
 */
(function () {
  'use strict';

  /* ---------- Almacenamiento seguro (puede fallar en modo privado) ---------- */
  function store(kind) {
    return {
      get: function (k) { try { return window[kind].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[kind].setItem(k, v); } catch (e) {} },
      del: function (k) { try { window[kind].removeItem(k); } catch (e) {} }
    };
  }
  var LS = store('localStorage'), SS = store('sessionStorage');

  /* ---------- Configuración centralizada ---------- */
  var DEFAULT_BACKEND = 'https://script.google.com/macros/s/AKfycbzC3UOOzBYgeAhOZRm1Gl1l2QYPnlvsV5HbbU-3P2h7LcW0GHmLW9LTfR2iiszymTNC/exec';
  var CONFIG = {
    BACKEND_URL: LS.get('SINTONIA_BACKEND_URL') || DEFAULT_BACKEND,
    BASE_PUBLICA: 'https://josebdiaz.github.io/sintonia-piloto/piloto/',
    FRONTEND_VERSION: '2.0.1',     // SemVer; debe coincidir con el tag piloto/vX.Y.Z y con CHANGELOG.md
    CONTACTO_EMAIL: '',            // ⚠️ POR DEFINIR: correo del equipo para consultas y reclamos (aviso.html lo muestra)
    AVISO_VERSION: 'v1-2026-10',
    TIMEOUT_MS: 30000
  };

  /* ---------- Conexión con el backend ----------
   * POST sin cabeceras: el navegador lo envía como text/plain y Apps Script no exige preflight (CORS).
   */
  function withTimeout(promise) {
    return Promise.race([promise, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, CONFIG.TIMEOUT_MS); })]);
  }
  function post(payload) {
    return withTimeout(fetch(CONFIG.BACKEND_URL, { method: 'POST', body: JSON.stringify(payload), redirect: 'follow' }))
      .then(function (r) { return r.json(); })
      .catch(function (e) { return { ok: false, error: e && e.message === 'timeout' ? 'timeout' : 'red' }; });
  }
  function get(params) {
    var u = CONFIG.BACKEND_URL + (CONFIG.BACKEND_URL.indexOf('?') >= 0 ? '&' : '?') + new URLSearchParams(params).toString();
    return withTimeout(fetch(u, { redirect: 'follow' }))
      .then(function (r) { return r.json(); })
      .catch(function (e) { return { ok: false, error: e && e.message === 'timeout' ? 'timeout' : 'red' }; });
  }

  /* ---------- Mensajes de error en lenguaje claro ---------- */
  var ERR = {
    red: 'No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.',
    timeout: 'El servidor tardó demasiado. Inténtalo de nuevo en un momento.',
    faltan_autorizaciones: 'Para seguir necesitamos las 4 autorizaciones.',
    falta_tipo_grupo: 'Elige qué tipo de grupo es.',
    n_invitados_invalido: 'El grupo debe tener entre 2 y 8 personas, contándote.',
    invitacion_invalida: 'Este enlace de invitación no es válido. Pídele a quien organiza que te lo reenvíe.',
    reclutamiento_cerrado: 'Este grupo ya cerró las inscripciones.',
    grupo_lleno: 'Este grupo ya tiene a todas las personas invitadas.',
    no_miembro: 'Este enlace ya no está activo o no corresponde a este grupo.',
    plan_no_existe: 'No encontramos este plan.',
    plan_no_votable: 'La votación de este plan ya no está abierta.',
    retro_ya_enviada: 'Ya habías enviado tu respuesta para este plan. ¡Gracias!',
    solo_organizador: 'Esta parte es solo para quien organiza.',
    no_autorizado: 'Clave del equipo incorrecta.',
    accion_desconocida: 'El backend no reconoce esta acción. ¿Está publicada la versión v2.2.1?',
    falta_hora_encuentro: 'Pon la hora de encuentro (día y hora).',
    falta_causa_caida: 'Elige por qué se cayó el plan.',
    inventario_vacio: 'El inventario no tiene lugares activos.',
    sin_opciones: 'Agrega al menos una opción antes de publicar.',
    grupo_no_elegible: 'Este grupo no está activo.',
    no_existe: 'No encontramos a esa persona.'
  };
  function errMsg(r) {
    var code = (r && r.error) || 'red', base = String(code).split(':')[0];
    return ERR[code] || ERR[base] || ('Algo falló (' + code + ').');
  }

  /* ---------- DOM ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function param(n) { return new URLSearchParams(location.search).get(n); }
  function show(el, on) { if (typeof el === 'string') el = $(el); if (el) el.classList.toggle('hidden', !on); }

  var toastTimer;
  function toast(msg, isErr) {
    var t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.toggle('err', !!isErr); t.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.add('hidden'); }, 4200);
  }

  /** Deshabilita el botón y muestra un spinner mientras corre fn (que devuelve una promesa). Evita envíos dobles. */
  function busy(btn, fn) {
    if (!btn || btn.getAttribute('aria-busy') === 'true') return Promise.resolve(null);
    var html = btn.innerHTML; btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> ' + (btn.dataset.busy || 'Enviando…');
    return Promise.resolve().then(fn).then(function (r) { return r; }, function (e) { return { ok: false, error: 'red' }; })
      .then(function (r) { btn.innerHTML = html; btn.disabled = false; btn.removeAttribute('aria-busy'); return r; });
  }

  /* ---------- Enlaces ---------- */
  function base() { return /^https?:$/.test(location.protocol) ? location.href : CONFIG.BASE_PUBLICA; }
  function link(page, params) { var u = new URL(page, base()); Object.keys(params || {}).forEach(function (k) { if (params[k] !== undefined && params[k] !== '') u.searchParams.set(k, params[k]); }); return u.toString(); }
  function phone(raw) { var d = String(raw || '').replace(/\D/g, ''); if (d.length === 10 && d.charAt(0) === '3') d = '57' + d; return d; }
  function wa(num, text) { return 'https://wa.me/' + phone(num) + (text ? '?text=' + encodeURIComponent(text) : ''); }
  function waShare(text) { return 'https://wa.me/?text=' + encodeURIComponent(text); }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(function () { toast('Copiado ✓'); }, fallback);
    return Promise.resolve(fallback());
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copiado ✓'); } catch (e) { toast('No se pudo copiar; selecciónalo a mano.', true); } document.body.removeChild(ta); }
  }

  /* ---------- Componentes ---------- */
  /** Escala 1–5 accesible. Devuelve { value(), set(n) }. */
  function scale(el, ends) {
    var val = '';
    el.classList.add('scale'); el.setAttribute('role', 'radiogroup');
    el.innerHTML = [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" aria-checked="false" data-v="' + n + '">' + n + '</button>'; }).join('');
    var e = document.createElement('div'); e.className = 'scale-ends'; e.innerHTML = '<span>1 · ' + esc(ends[0]) + '</span><span>5 · ' + esc(ends[1]) + '</span>';
    el.insertAdjacentElement('afterend', e);
    function set(n) { val = n; $$('button', el).forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.dataset.v) === n)); }); el.dispatchEvent(new Event('change')); }
    el.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) set(Number(b.dataset.v)); });
    el.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { var n = (val || 3) + (ev.key === 'ArrowRight' ? 1 : -1); set(Math.min(5, Math.max(1, n))); ev.preventDefault(); } });
    return { value: function () { return val; }, set: set };
  }
  /** Chips de selección única. */
  function chips(el, name, opts) {
    el.classList.add('chips'); el.setAttribute('role', 'radiogroup');
    el.innerHTML = opts.map(function (o) { return '<label class="chip"><input type="radio" name="' + name + '" value="' + esc(o[0]) + '"><span>' + esc(o[1]) + '</span></label>'; }).join('');
    return { value: function () { var c = $('input:checked', el); return c ? c.value : ''; } };
  }

  /** Bloque de las 4 autorizaciones. El botón marca las 4 (sin pre-marcar) y cada casilla se puede desmarcar. */
  var CONSENT = [
    ['autoriza_datos', 'Autorizo el tratamiento de mis datos personales para coordinar planes con mi grupo, según la Ley 1581 de 2012 y el <a href="aviso.html" target="_blank" rel="noopener">aviso de privacidad</a>.'],
    ['optin_whatsapp', 'Acepto recibir mensajes de Sintonía por WhatsApp sobre los planes de mi grupo (opciones, recordatorios y una encuesta corta al final). Puedo salir cuando quiera escribiendo SALIR.'],
    ['mayor_18', 'Soy mayor de 18 años.'],
    ['consent_investigacion', 'Participo de forma voluntaria en una investigación académica de la Universidad Icesi. Sé que una persona del equipo revisa lo que propone Sintonía y que puedo retirarme cuando quiera, sin dar explicaciones.']
  ];
  function consent(el) {
    var usedButton = false;
    el.classList.add('consent');
    el.innerHTML = '<button type="button" class="btn btn-ghost btn-block" data-all>✓ Marcar "Sí a todo"</button>' +
      '<p class="tiny muted center" style="margin:6px 0 2px">Lee cada una: puedes desmarcar la que no aceptes. Sin las 4 no podemos incluirte en la prueba.</p>' +
      CONSENT.map(function (c) { return '<label class="check"><input type="checkbox" name="' + c[0] + '"><span>' + c[1] + '</span></label>'; }).join('');
    function paint() { $$('.check', el).forEach(function (l) { l.classList.toggle('on', $('input', l).checked); }); }
    el.addEventListener('change', paint);
    $('[data-all]', el).addEventListener('click', function () { usedButton = true; $$('input[type=checkbox]', el).forEach(function (i) { i.checked = true; }); paint(); });
    return {
      valid: function () { return $$('input[type=checkbox]', el).every(function (i) { return i.checked; }); },
      values: function () { var o = {}; $$('input[type=checkbox]', el).forEach(function (i) { o[i.name] = i.checked; }); return o; },
      metodo: function () { return usedButton ? 'boton_todo' : 'individual'; }
    };
  }

  /** Contador de caracteres para textareas con maxlength. */
  function counter(input, out) { function u() { out.textContent = input.value.length + '/' + input.maxLength; } input.addEventListener('input', u); u(); }

  /* ---------- Formatos ---------- */
  function pct(x) { return x === null || x === undefined || isNaN(x) ? '—' : Math.round(x * 100) + '%'; }
  function num(x, d) { return x === null || x === undefined || x === '' || isNaN(x) ? '—' : Number(x).toLocaleString('es-CO', { maximumFractionDigits: d === undefined ? 1 : d }); }
  function cop(x) { return x === null || x === undefined || isNaN(x) ? '—' : '$' + Math.round(x).toLocaleString('es-CO'); }
  function usd(x) { return x === null || x === undefined || isNaN(x) ? '—' : 'US$' + Number(x).toFixed(4); }
  function fecha(v) {
    if (!v) return ''; var d = new Date(v); if (isNaN(d)) return String(v);
    return d.toLocaleString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' });
  }

  /* ---------- Identidad del participante en este dispositivo ---------- */
  function me() { return { pid: LS.get('sintonia_pid') || '', grupo_id: LS.get('sintonia_grupo') || '', rol: LS.get('sintonia_rol') || '', exp: LS.get('sintonia_exp') || '', nombre: LS.get('sintonia_nombre') || '' }; }
  function saveMe(o) { ['pid', 'grupo_id', 'rol', 'exp', 'nombre'].forEach(function (k) { if (o[k]) LS.set('sintonia_' + (k === 'grupo_id' ? 'grupo' : k), o[k]); }); }

  /* ---------- Pantallas del equipo ---------- */
  function adminKey(ask) {
    var k = SS.get('sintonia_admin_key');
    if (!k && ask) { k = window.prompt('Clave del equipo (ADMIN_KEY):') || ''; if (k) SS.set('sintonia_admin_key', k); }
    return k || '';
  }
  function forgetKey() { SS.del('sintonia_admin_key'); }
  function configBackend() {
    var v = window.prompt('URL del backend (termina en /exec). Déjala vacía para volver a la oficial:', CONFIG.BACKEND_URL);
    if (v === null) return;
    v = v.trim();
    if (!v || v === DEFAULT_BACKEND) LS.del('SINTONIA_BACKEND_URL');
    else if (/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(v)) LS.set('SINTONIA_BACKEND_URL', v);
    else { toast('Esa URL no parece de Apps Script (/exec).', true); return; }
    location.reload();
  }

  window.S = { CONFIG: CONFIG, LS: LS, SS: SS, post: post, get: get, errMsg: errMsg, $: $, $$: $$, esc: esc, param: param, show: show, toast: toast, busy: busy,
    link: link, wa: wa, waShare: waShare, phone: phone, copy: copy, scale: scale, chips: chips, consent: consent, counter: counter,
    pct: pct, num: num, cop: cop, usd: usd, fecha: fecha, me: me, saveMe: saveMe, adminKey: adminKey, forgetKey: forgetKey, configBackend: configBackend };
  window.CONFIG = CONFIG;

  /* ---------- Versión visible en el pie (trazabilidad: qué versión vio cada quien) ---------- */
  function sello() { var f = document.querySelector('.foot'); if (f && !f.querySelector('.ver')) { var v = document.createElement('span'); v.className = 'ver'; v.textContent = ' · v' + CONFIG.FRONTEND_VERSION; f.appendChild(v); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sello); else sello();
})();
