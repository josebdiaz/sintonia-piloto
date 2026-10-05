/**
 * Sintonía · H1 (WTP) — recolector de eventos anónimos
 * Recibe eventos de la landing (POST) y los devuelve para el panel (GET).
 * NO almacena ningún dato personal: solo type, src, qualified_src y fecha.
 *
 * Instrucciones de despliegue en la guía. Pasos rápidos:
 *  1) Reemplaza SHEET_ID por el id de tu hoja de Google (está en su URL).
 *  2) Implementar > Nueva implementación > Aplicación web
 *     - Ejecutar como: Yo
 *     - Quién tiene acceso: Cualquier usuario
 *  3) Copia la URL que termina en /exec y pégala en index.html (ENDPOINT).
 */

var SHEET_ID     = 'PEGA_AQUI_EL_ID_DE_TU_HOJA';
var SHEET_NAME   = 'events';
var HEADER       = ['timestamp', 'type', 'src', 'qualified_src', 'uid', 'note'];
var CONTACT_NAME = 'contactos';                                  // hoja SEPARADA de los eventos
var CONTACT_HEADER = ['timestamp', 'uid', 'src', 'contacto', 'note'];
var RATING_NAME = 'calificaciones';                              // calificaciones de la actividad (anónimas)
var RATING_HEADER = ['timestamp', 'uid', 'src', 'agrado', 'comodidad', 'seguridad', 'facilidad', 'comentario', 'palabra'];
var PULSO_NAME = 'pulso';                                        // H4 · cierre privado y señal recíproca
var PULSO_HEADER = ['timestamp', 'me', 'cluster', 'agrado', 'intencion', 'eligio', 'optin_next', 'contacto'];
var SCORE_NAME = 'scorecards';                                   // decisiones oficiales registradas desde la Scorecard
var SCORE_HEADER = ['timestamp', 'experimento', 'estado', 'veredicto', 'clasificacion', 'umbral', 'resultado', 'nota'];
var WTP_NAME = 'wtp';                                            // card sort de actividades + precio de la experiencia
var WTP_HEADER = ['timestamp', 'uid', 'src', 'actividades', 'primero', 'ladder', 'umbral', 'caro', 'tcaro', 'comentario'];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADER); }
  else if (sh.getLastRow() === 0) { sh.appendRow(HEADER); }
  return sh;
}

function getContactsSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(CONTACT_NAME);
  if (!sh) { sh = ss.insertSheet(CONTACT_NAME); sh.appendRow(CONTACT_HEADER); }
  else if (sh.getLastRow() === 0) { sh.appendRow(CONTACT_HEADER); }
  return sh;
}

function getRatingsSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(RATING_NAME);
  if (!sh) { sh = ss.insertSheet(RATING_NAME); sh.appendRow(RATING_HEADER); }
  else if (sh.getLastRow() === 0) { sh.appendRow(RATING_HEADER); }
  return sh;
}

function getPulsoSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(PULSO_NAME);
  if (!sh) { sh = ss.insertSheet(PULSO_NAME); sh.appendRow(PULSO_HEADER); }
  else if (sh.getLastRow() === 0) { sh.appendRow(PULSO_HEADER); }
  return sh;
}

function getScoreSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(SCORE_NAME);
  if (!sh) { sh = ss.insertSheet(SCORE_NAME); sh.appendRow(SCORE_HEADER); }
  else if (sh.getLastRow() === 0) { sh.appendRow(SCORE_HEADER); }
  return sh;
}

function getWtpSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(WTP_NAME);
  if (!sh) { sh = ss.insertSheet(WTP_NAME); sh.appendRow(WTP_HEADER); }
  else if (sh.getLastRow() === 0) { sh.appendRow(WTP_HEADER); }
  return sh;
}

/** La landing envía cada evento aquí (POST, cuerpo JSON como texto). */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // opt-in de contacto -> hoja separada (nunca se mezcla con los eventos)
    if (data.kind === 'contact') {
      var cs = getContactsSheet_();
      cs.appendRow([
        new Date(),
        String(data.uid || ''),
        String(data.src || 'desconocido'),
        String(data.contact || ''),
        String(data.note || '')
      ]);
      return json_({ ok: true });
    }

    // calificación anónima de la actividad -> hoja separada
    if (data.kind === 'rating') {
      var rs = getRatingsSheet_();
      rs.appendRow([
        new Date(),
        String(data.uid || ''),
        String(data.src || 'desconocido'),
        data.agrado || '',
        data.comodidad || '',
        data.seguridad || '',
        data.facilidad || '',
        String(data.comentario || ''),
        String(data.palabra || '')
      ]);
      return json_({ ok: true });
    }

    // H4 · pulso privado (cierre + señal recíproca)
    if (data.kind === 'pulso') {
      var ps = getPulsoSheet_();
      ps.appendRow([
        new Date(),
        String(data.me || ''),
        String(data.cluster || ''),
        data.agrado || '',
        String(data.intencion || ''),
        String(data.eligio || ''),
        data.optin_next === true,
        String(data.contacto || '')
      ]);
      return json_({ ok: true });
    }

    // WTP · card sort de disposición a pagar
    if (data.kind === 'wtp') {
      var ws = getWtpSheet_();
      ws.appendRow([
        new Date(),
        String(data.uid || ''),
        String(data.src || 'desconocido'),
        String(data.actividades || ''),
        String(data.primero || ''),
        String(data.ladder || ''),
        data.umbral === '' ? '' : data.umbral,
        data.caro || '',
        data.tcaro || '',
        String(data.comentario || '')
      ]);
      return json_({ ok: true });
    }

    // Scorecard · decisión oficial registrada por el equipo
    if (data.kind === 'scorecard') {
      var sc = getScoreSheet_();
      sc.appendRow([
        new Date(),
        String(data.experimento || ''),
        String(data.estado || ''),
        String(data.veredicto || ''),
        String(data.clasificacion || ''),
        String(data.umbral || ''),
        String(data.resultado || ''),
        String(data.nota || '')
      ]);
      return json_({ ok: true });
    }

    // evento anónimo del embudo
    var sh = getSheet_();
    sh.appendRow([
      new Date(),
      String(data.type || ''),
      String(data.src || 'desconocido'),
      data.qualified_src === true,
      String(data.uid || ''),
      String(data.note || '')
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Los paneles leen por GET.
 *  Sin parámetro (o ?data=events): devuelve los eventos del embudo.
 *  ?data=ratings: devuelve las calificaciones anónimas de la actividad. */
function doGet(e) {
  var which = (e && e.parameter && e.parameter.data) ? String(e.parameter.data) : 'events';
  try {
    if (which === 'ratings') {
      var rsh = getRatingsSheet_();
      var rv = rsh.getDataRange().getValues();
      var ratings = [];
      for (var j = 1; j < rv.length; j++) {
        var x = rv[j];
        ratings.push({ ts: x[0], uid: x[1], src: x[2], agrado: x[3], comodidad: x[4], seguridad: x[5], facilidad: x[6], comentario: x[7], palabra: x[8] });
      }
      return json_({ ratings: ratings });
    }
    if (which === 'pulso') {
      var psh = getPulsoSheet_();
      var pv = psh.getDataRange().getValues();
      var pulso = [];
      for (var p = 1; p < pv.length; p++) {
        var y = pv[p];
        pulso.push({ ts: y[0], me: y[1], cluster: y[2], agrado: y[3], intencion: y[4], eligio: y[5],
          optin_next: (y[6] === true || String(y[6]).toUpperCase() === 'TRUE'), contacto: y[7] });
      }
      return json_({ pulso: pulso });
    }
    if (which === 'wtp') {
      var wsh = getWtpSheet_();
      var wv = wsh.getDataRange().getValues();
      var wtp = [];
      for (var w = 1; w < wv.length; w++) {
        var u = wv[w];
        wtp.push({ ts: u[0], uid: u[1], src: u[2], actividades: u[3], primero: u[4], ladder: u[5], umbral: u[6], caro: u[7], tcaro: u[8], comentario: u[9] });
      }
      return json_({ wtp: wtp });
    }
    if (which === 'scorecards') {
      var ssh = getScoreSheet_();
      var sv = ssh.getDataRange().getValues();
      var scores = [];
      for (var q = 1; q < sv.length; q++) {
        var z = sv[q];
        scores.push({ ts: z[0], experimento: z[1], estado: z[2], veredicto: z[3],
          clasificacion: z[4], umbral: z[5], resultado: z[6], nota: z[7] });
      }
      return json_({ scorecards: scores });
    }
    var sh = getSheet_();
    var values = sh.getDataRange().getValues();
    var rows = [];
    for (var i = 1; i < values.length; i++) {          // salta el encabezado
      var r = values[i];
      rows.push({
        ts: r[0],
        type: r[1],
        src: r[2],
        qualified_src: (r[3] === true || String(r[3]).toUpperCase() === 'TRUE'),
        uid: r[4],
        note: r[5]
      });
    }
    return json_({ events: rows });
  } catch (err) {
    return json_({ events: [], ratings: [], error: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ *
 *  Limpiar la base (= reiniciar el piloto).
 *  Seguro: solo se ejecuta desde DENTRO de la hoja, con tu login.
 *  NO está expuesto en la web; el panel público no puede borrar nada.
 * ------------------------------------------------------------------ */

/** Crea un menú "Sintonía" en la hoja al abrirla. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sintonía')
    .addItem('Limpiar eventos (reiniciar piloto)', 'clearEvents')
    .addToUi();
}

/** Borra todas las filas de eventos y conserva el encabezado. Pide confirmación. */
function clearEvents() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert(
    'Limpiar eventos',
    'Se borrarán TODOS los eventos registrados y no se pueden recuperar. ¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;
  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last > 1) sh.deleteRows(2, last - 1);   // deja la fila 1 (encabezado)
  ui.alert('Listo: base de eventos reiniciada.');
}
