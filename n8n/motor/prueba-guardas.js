// Prueba de n8n/motor/guardas.js con textos ficticios (sin nombres, lugares ni grupos reales). n = 0: verificación técnica.
// Uso: node n8n/motor/prueba-guardas.js   → tiene que terminar en ✓
// Cada caso: [nombre, texto del Redactor, bloque, esperado, cfg]. esperado = [] (ok) o los motivos que tienen que salir.
const G = require('./guardas.js');
// Bloques como los armaría el código desde el backend (lugar e inventario ficticios)
const CONF = { lineas: ['Dónde: Café Ficticio (Barrio Prueba)', 'Cuándo: sábado 6 de diciembre, 7:00 p. m.', 'Salida sugerida: 6:15 p. m.', 'Aprox. $25.000 por persona'] };
const OPC = { lineas: ['Opción 2 · Picnic de prueba', 'Dónde: Parque Ficticio (Zona Sur)', 'Mapa: https://www.google.com/maps/search/?api=1&query=Parque+Ficticio,Cali'] };
const CONTEO = { lineas: ['Van 3 de 5 votos.'] };
const AVISO = { lineas: ['Privacidad: https://sintonia.my/piloto/aviso.html'] };
const NADA = { lineas: [] };
const P = { a_quien: 'persona' };

const casos = [
  // ── Buenos (carril de datos) ──
  ['confirmado con voz', '¡Hay plan, parche! 🙌\n{{bloque}}\nEn el evento del grupo marquen si van.', CONF, []],
  ['opción con contexto', 'Esta es para los que quieren algo al aire libre.\n{{bloque}}', OPC, []],
  ['recordatorio con conteo del bloque', '{{bloque}} ¿Cuál les suena más? Pueden votar en la encuesta de arriba ⏳', CONTEO, []],
  ['repite la hora del bloque', '{{bloque}}\nNos vemos a las 7 en Café Ficticio.', CONF, []],
  ['repite la cifra del bloque', '{{bloque}}\nSon unos 25 mil por persona, más o menos.', CONF, []],
  // ── Buenos (carril social) ──
  ['bienvenida con marca al grupo', '¡Hola, parche! Soy Sintonía, su +1 de confianza para que el plan sí se dé 👋\n{{bloque}}', AVISO, []],
  ['ánimo sin datos', 'Qué bueno verlos por aquí. Cuando quieran, armamos el siguiente plan.', NADA, []],
  ['en casa a una persona', '¿Ya en casa? Con un «ya en casa» basta.', NADA, [], P],
  ['marca a una persona', 'Soy Sintonía, tu +1 de confianza. ¿Cómo te fue?', NADA, [], P],
  ['comandos en mayúscula', 'Escriban HUMANO para hablar con alguien del equipo o SALIR para salir del grupo.', NADA, []],
  ['emoji compuesto cuenta uno', 'Ya estamos todos. ¡Disfruten! 👩🏽‍🤝‍👩🏻', NADA, []],
  // ── Malos sembrados ──
  ['corchete', '¡Hay plan! [plan elegido]\n{{bloque}}', CONF, ['corchete']],
  ['marcador sin llenar', 'Van {{n}} votos. {{bloque}}', CONTEO, ['corchete']],
  ['corchete dentro del bloque', 'Listo.\n{{bloque}}', { lineas: ['Cuándo: [día y hora]'] }, ['corchete']],
  ['sin bloque', '¡Hay plan! Nos vemos el sábado.', CONF, ['bloque_falta']],
  ['bloque dos veces', '{{bloque}}\n{{bloque}}', CONF, ['bloque_repetido']],
  ['hora cambiada', '{{bloque}}\nLleguen a las 8:00 p. m. para coger mesa.', CONF, ['dato_ajeno_hora']],
  ['hora inventada sin bloque', 'Nos vemos a las 4 p. m.', NADA, ['dato_ajeno_hora']],
  ['cifra cambiada', '{{bloque}}\nSon unos $30.000 por persona.', CONF, ['dato_ajeno_cifra']],
  ['conteo inventado', '{{bloque}} Ya van 4 confirmados.', CONTEO, ['dato_ajeno_cifra']],
  ['número escrito inventado', 'Faltan dos personas por votar.', NADA, ['dato_ajeno_cifra']],
  ['enlace ajeno', '{{bloque}}\nMás info en https://otro-sitio.com/plan', OPC, ['dato_ajeno_enlace']],
  ['enlace sin http', 'Miren el menú en menu-ficticio.co', NADA, ['dato_ajeno_enlace']],
  ['lugar inventado en minúscula', '{{bloque}}\nNos vemos en la carrera de atrás.', CONF, ['dato_ajeno_lugar']],
  ['lugar inventado con mayúscula', '{{bloque}}\nDespués podemos ir a Plaza Inventada.', CONF, ['nombre']],
  ['nombre en la frase', 'Gracias a Ana por proponer el plan.', NADA, ['nombre']],
  ['vocativo con nombre', 'Lucía, ¿cómo vas? El parche ya llegó.', NADA, ['nombre'], P],
  ['dos emojis', '¡Hay plan! 🙌🎉\n{{bloque}}', CONF, ['emoji']],
  ['emoji en prosa y otro igual', 'Listo 👇 voten 👇', NADA, ['emoji']],
  ['marca con persona equivocada', 'Soy Sintonía, tu +1 de confianza para el plan.', NADA, ['marca']],
  ['marca incompleta', 'Soy Sintonía, su +1 para que el plan sí se dé.', NADA, ['marca']],
  ['largo', 'Qué bueno que se animen. ' + 'Este plan va a estar muy bueno y lo vamos a disfrutar entre todos. '.repeat(5), NADA, ['largo']],
  ['demasiadas frases', 'Hola. Qué bueno. Ya casi. Voten. Gracias.', NADA, ['largo']],
  ['vacío', '   ', NADA, ['vacio']],
];

let fallas = 0;
for (const [nombre, texto, bloque, esperado, cfg] of casos) {
  const r = G.revisar(texto, bloque, Object.assign({ a_quien: 'grupo' }, cfg || {}));
  const bien = esperado.length ? !r.ok && esperado.every((m) => r.motivos.includes(m)) && !r.texto : r.ok && r.texto.length > 0;
  if (!bien) { fallas++; console.log('✗', nombre, '→', JSON.stringify(r.motivos), 'esperado', JSON.stringify(esperado)); }
}
// El texto final pone el bloque en su lugar y no trae el marcador
const f = G.revisar('¡Hay plan! 🙌\n{{bloque}}', CONF, { a_quien: 'grupo' });
if (!f.ok || f.texto.includes('{{') || !f.texto.includes(CONF.lineas[1])) { fallas++; console.log('✗ texto final', JSON.stringify(f)); }
// Las marcas son las de la consola
if (G.MARCA_TU !== 'tu +1 de confianza' || G.MARCA_SU !== 'su +1 de confianza') { fallas++; console.log('✗ marcas'); }
const total = casos.length + 2;
console.log(fallas ? `✗ ${fallas} de ${total} casos fallan` : `✓ ${total} casos de guardas (ficticios, n = 0): ${casos.filter((c) => c[3].length).length} malos sembrados detectados`);
process.exit(fallas ? 1 : 0);
