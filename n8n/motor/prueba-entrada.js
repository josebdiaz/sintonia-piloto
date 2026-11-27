// Prueba de n8n/motor/entrada.js con mensajes ficticios (sin números ni grupos reales). n = 0: verificación técnica.
// Uso: node n8n/motor/prueba-entrada.js   → tiene que terminar en ✓
const E = require('./entrada.js');
const AT = '@';  // armado por partes para que no parezca un correo
const G = '0'.repeat(18) + AT + 'g.us', OTRO = '1'.repeat(18) + AT + 'g.us', P = '0'.repeat(12) + AT + 's.whatsapp.net';
const cfg = { grupos: [G] };
const msg = (message, extra = {}) => ({ body: { event: 'messages.upsert', apikey: 'NO-DEBE-SALIR', data: Object.assign({
  key: { remoteJid: G, fromMe: false, id: 'ABC', participant: P }, pushName: 'Nombre Ficticio', messageTimestamp: 1764280800,
  messageType: Object.keys(message)[0], message }, extra) } });
const txt = (t) => msg({ conversation: t });
const casos = [
  ['voto 2', txt('2'), { accion: 'voto', opcion: 1, veto: false }],
  ['«la 3»', txt('La 3'), { accion: 'voto', opcion: 2 }],
  ['todas', txt('TODAS'), { accion: 'voto', opcion: -1, veto: false }],
  ['ninguna = veto', txt('ninguna'), { accion: 'voto', veto: true }],
  ['me apunto', msg({ extendedTextMessage: { text: '¡Me apunto!' } }), { accion: 'evento', evento: 'me_apunto' }],
  ['llegué', txt('Llegué'), { accion: 'evento', evento: 'checkpoint_llegada' }],
  ['ya en casa', txt('ya en casa'), { accion: 'evento', evento: 'llego_casa' }],
  ['salir', txt('SALIR'), { accion: 'evento', evento: 'salir', aviso_equipo: true }],
  ['HUMANO', txt('humano'), { accion: 'escalar', motivo: 'pidio_humano' }],
  ['sensible', txt('tuve un accidente'), { accion: 'escalar', motivo: 'sensible' }],
  ['123', txt('llamen al 123'), { accion: 'escalar', motivo: 'sensible' }],
  ['charla', txt('jajaja qué nota'), { accion: 'escalar', motivo: 'no_entendido' }],
  ['sticker → escala (por defecto)', msg({ stickerMessage: { fileSha256: 'c2hh' } }), { accion: 'escalar', tipo: 'sticker', sticker_sha: 'c2hh' }],
  ['sticker → registrar (cfg)', msg({ stickerMessage: { fileSha256: 'c2hh' } }), { accion: 'registrar', sticker: '05-me-apunto' }, { sticker_entrante: 'registrar', stickers: { c2hh: '05-me-apunto' } }],
  ['ubicación', msg({ locationMessage: { degreesLatitude: 3.4 } }), { accion: 'escalar', motivo: 'sensible' }],
  ['audio', msg({ audioMessage: {} }), { accion: 'escalar', motivo: 'medio_no_soportado' }],
  ['voto encuesta descifrado', msg({ pollUpdateMessage: { vote: { selectedOptions: ['Opción 2'] } } }), { accion: 'voto_encuesta', n_opciones: 1 }],
  ['voto encuesta cifrado', msg({ pollUpdateMessage: { vote: { encPayload: 'x' } } }), { accion: 'escalar', motivo: 'voto_sin_descifrar' }],
  ['propio', msg({ conversation: '2' }, { key: { remoteJid: G, fromMe: true, id: 'X' } }), { accion: 'ignorar', motivo: 'propio' }],
  ['chat privado', msg({ conversation: '2' }, { key: { remoteJid: P, fromMe: false, id: 'X' } }), { accion: 'ignorar', motivo: 'no_es_grupo' }],
  ['otro grupo', msg({ conversation: '2' }, { key: { remoteJid: OTRO, fromMe: false, id: 'X' } }), { accion: 'ignorar', motivo: 'grupo_no_permitido' }],
  ['otro evento', { body: { event: 'connection.update', data: {} } }, { accion: 'ignorar', motivo: 'evento_no_mensaje' }],
  ['MESSAGES_UPSERT en mayúsculas', { body: Object.assign(txt('1').body, { event: 'MESSAGES_UPSERT' }) }, { accion: 'voto', opcion: 0 }],
];
let fallas = 0;
for (const [nombre, entrada, esperado, c] of casos) {
  const r = E.clasificar(entrada, Object.assign({}, cfg, c || {}));
  const s = JSON.stringify(r);
  const malos = Object.entries(esperado).filter(([k, v]) => JSON.stringify(r[k]) !== JSON.stringify(v));
  const fuga = /NO-DEBE-SALIR|Nombre Ficticio|accidente|jajaja/.test(s);
  if (malos.length || fuga) { fallas++; console.log('✗', nombre, fuga ? '(fuga de datos)' : '', JSON.stringify(malos), s); }
}
// Sonda: la forma no trae valores, ni apikey ni pushName
const f = E.clasificar(txt('2'), Object.assign({ sonda: true }, cfg)).forma;
const fs = JSON.stringify(f);
if (/NO-DEBE-SALIR|Nombre Ficticio|ABC|1764280800/.test(fs) || f.data.message.conversation !== 'string') { fallas++; console.log('✗ sonda', fs); }
// Respuesta de prueba: una por acción, sin nombres ni texto del grupo, máximo un emoji, y nada para lo ignorado
const ecos = [
  [txt('2'), 'voto por la opción 2'], [txt('TODAS'), 'cualquiera'], [txt('NINGUNA'), 'ninguna opción'],
  [txt('ME APUNTO'), 'te apuntas'], [txt('HUMANO'), 'persona del equipo'], [txt('accidente'), '123'], [txt('jajaja'), 'no lo entendí'],
];
for (const [m, frag] of ecos) {
  const e = E.eco(E.clasificar(m, cfg));
  const emojis = (e.match(/\p{Extended_Pictographic}/gu) || []).length;
  if (!e.includes(frag) || emojis > 1 || /Nombre Ficticio|jajaja|accidente/.test(e)) { fallas++; console.log('✗ eco', frag, e); }
}
if (E.eco(E.clasificar(msg({ conversation: '2' }, { key: { remoteJid: OTRO, fromMe: false, id: 'X' } }), cfg)) !== '') { fallas++; console.log('✗ eco de lo ignorado'); }
// Aviso a la persona del equipo: HUMANO, sensible, no entendido y SALIR sí; votos y stickers no; nunca con texto ni nombre
const avisos = [[txt('HUMANO'), true], [txt('accidente'), true], [txt('jajaja'), true], [txt('SALIR'), true],
  [txt('2'), false], [msg({ stickerMessage: { fileSha256: 'c2hh' } }), false]];
for (const [m, debe] of avisos) {
  const a = E.aviso(E.clasificar(m, cfg));
  if (!!a !== debe || /Nombre Ficticio|jajaja|accidente/.test(a)) { fallas++; console.log('✗ aviso', debe, a); }
}
const extra = ecos.length + 1 + avisos.length;
console.log(fallas ? `✗ ${fallas} de ${casos.length + 1 + extra} casos fallan` : `✓ ${casos.length + 1 + extra} casos de entrada (ficticios, n = 0)`);
process.exit(fallas ? 1 : 0);
