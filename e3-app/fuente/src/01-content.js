/* ── 01 · Contenido: voces, guion y catálogo de planes de ejemplo ─────────── */
const VOZ = {
  quinto: ['el-quinto', 'El Quinto'], guardiana: ['la-guardiana', 'La Guardiana'], mago: ['el-mago', 'El Mago'],
  resonador: ['el-resonador', 'El Resonador'], antena: ['la-antena', 'La Antena'], despertador: ['el-despertador', 'El Despertador'],
  gramola: ['la-gramola', 'La Gramola'], estatica: ['la-estatica', 'La Estática'],
};

const FRANJAS = [
  { id: 'manana', b: 'MAÑANA', s: '6 – 12 a. m.', h: 9, m: 0 },
  { id: 'tarde', b: 'TARDE', s: '12 – 6 p. m.', h: 14, m: 30 },
  { id: 'noche', b: 'NOCHE', s: '6 – 10 p. m.', h: 19, m: 0 },
];

const ENERGIA = ['Agotado', 'Bajo', 'Normal', 'Con pilas', 'A tope']; // mismos valores que el Dial de energía en Figma
const ANTOJOS = ['Café', 'Almuerzo', 'Caminata', 'Juegos de mesa', 'Algo cultural'];
const RESTRICCIONES = ['Presupuesto bajo', 'Sin alcohol', 'Accesibilidad', 'Que quede cerca', 'Nada especial'];

/* Contenido de EJEMPLO para la prueba interna: lugares y valores de referencia, no verificados. */
const CATALOGO = [
  { id: 'museo-cafe', titulo: 'Museo y café', antojos: ['Algo cultural', 'Café'], costo: 30000, zona: 'El Peñón', accesible: true, paradas: [['Museo La Tertulia', 75], ['Café en San Antonio', 45], ['Regreso a casa', 0]] },
  { id: 'cerro', titulo: 'Cerro temprano', antojos: ['Caminata'], costo: 0, zona: 'Norte', accesible: false, hora: [6, 0], paradas: [['Subida al cerro', 90], ['Desayuno en la base', 45], ['Regreso a casa', 0]] },
  { id: 'bici', titulo: 'Domingo en bici', antojos: ['Caminata'], costo: 0, zona: 'Varios', accesible: false, hora: [8, 0], paradas: [['Ciclovía', 90], ['Jugo en el parque', 30], ['Regreso a casa', 0]] },
  { id: 'juegos-cafe', titulo: 'Juegos en un café', antojos: ['Juegos de mesa', 'Café'], costo: 25000, zona: 'San Fernando', accesible: true, paradas: [['Café con juegos de mesa', 120], ['Postre', 30], ['Regreso a casa', 0]] },
  { id: 'almuerzo-sa', titulo: 'Almuerzo en San Antonio', antojos: ['Almuerzo'], costo: 45000, zona: 'San Antonio', accesible: true, paradas: [['Almuerzo', 75], ['Caminata por el barrio', 45], ['Regreso a casa', 0]] },
  { id: 'cafe-charla', titulo: 'Café y caminata corta', antojos: ['Café', 'Caminata'], costo: 15000, zona: 'Granada', accesible: true, paradas: [['Café', 60], ['Caminata por el bulevar', 30], ['Regreso a casa', 0]] },
  { id: 'picnic', titulo: 'Picnic en el parque', antojos: ['Almuerzo', 'Caminata'], costo: 15000, zona: 'Parque cercano', accesible: true, paradas: [['Picnic', 90], ['Caminata corta', 30], ['Regreso a casa', 0]] },
  { id: 'mercado', titulo: 'Mercado y almuerzo', antojos: ['Almuerzo', 'Algo cultural'], costo: 20000, zona: 'Centro', accesible: true, paradas: [['Mercado local', 60], ['Almuerzo', 60], ['Regreso a casa', 0]] },
  { id: 'noche-juegos', titulo: 'Noche de juegos', antojos: ['Juegos de mesa'], costo: 20000, zona: 'Casa de alguien del parche', accesible: true, paradas: [['Juegos de mesa', 120], ['Algo de comer', 30], ['Regreso a casa', 0]] },
  { id: 'cine', titulo: 'Película y conversación', antojos: ['Algo cultural', 'Juegos de mesa'], costo: 10000, zona: 'Casa de alguien del parche', accesible: true, paradas: [['Película', 110], ['Conversación', 40], ['Regreso a casa', 0]] },
];

/* Elige 3 opciones distintas según antojos y restricciones; la ronda 2 toma las siguientes. */
function elegirOpciones(antojos = [], restr = [], franjaId = 'tarde', ronda = 1, excluir = []) {
  const bajo = restr.includes('Presupuesto bajo'), acc = restr.includes('Accesibilidad');
  const fr = FRANJAS.find(f => f.id === franjaId) || FRANJAS[1];
  const score = o => (o.antojos.filter(a => antojos.includes(a)).length * 3) + (bajo && o.costo <= 15000 ? 2 : 0) - (bajo && o.costo > 30000 ? 2 : 0) + (acc && o.accesible ? 1 : 0) - (acc && !o.accesible ? 3 : 0) - (o.hora && franjaId !== 'manana' ? 2 : 0);
  const ord = CATALOGO.filter(o => !excluir.includes(o.id)).map(o => [o, score(o)]).sort((a, b) => b[1] - a[1] || a[0].id.localeCompare(b[0].id)).map(x => x[0]);
  return ord.slice(0, 3).map(o => {
    const [h, m] = o.hora || [fr.h, fr.m];
    return { id: o.id, titulo: o.titulo, costo: o.costo, zona: o.zona, h, m, paradas: o.paradas };
  });
}

const pesos = n => n === 0 ? 'Gratis' : '$' + n.toLocaleString('es-CO');
const hora12 = (h, m) => { const s = h >= 12 ? 'p. m.' : 'a. m.'; const hh = ((h + 11) % 12) + 1; return `${hh}:${String(m).padStart(2, '0')} ${s}`; };
const detalleOpcion = o => `${hora12(o.h, o.m)} · ${pesos(o.costo)} · ${o.zona}`;
const durTxt = min => !min ? '—' : min >= 60 ? `${Math.floor(min / 60)} h${min % 60 ? ' ' + (min % 60) : ''}` : `${min} min`;

/* Próximo domingo (o el de la otra semana si hoy ya es domingo pasada la hora) */
function proximoDomingo(h, m) {
  const d = new Date(); d.setSeconds(0, 0);
  const add = (7 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + add); d.setHours(h, m, 0, 0); return d.getTime();
}
const fechaCorta = t => new Date(t).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '').replace(',', '');
const horaMsg = t => new Date(t).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }).replace(/\s?([ap])\.?\s?m\.?/i, (x, a) => ` ${a.toLowerCase()}. m.`);

const NOMBRES_SIM = ['Ana', 'Luis', 'Marta', 'Juan', 'Sofi', 'Pipe', 'Vale'];

/* Reglas de Sintonía para las respuestas libres (Claude). */
const REGLAS_IA = `Eres Sintonía (IA), «el quinto amigo del parche»: una app que ayuda a grupos de amigos en Cali a armar planes cerca, cortos y posibles. Una persona del equipo revisa todo.
Reglas:
- Español de Colombia, tuteo, cálido y breve: máximo 2 frases y 40 palabras. Sin emojis.
- No eres terapia ni una app de citas. No des consejos de salud.
- No inventes lugares, precios, horarios ni datos: usa solo lo que trae el contexto. Si no sabes, dilo.
- Nunca reveles quién votó qué ni quién dijo «Ninguna me sirve».
- Si alguien tiene un problema que no puedes resolver o pide hablar con una persona, sugiere el botón «Habla con un humano».
- Si preguntan algo fuera del plan, responde corto y vuelve al plan. Si hay un paso pendiente, recuérdalo al final.
- Responde solo con el texto del mensaje, sin comillas ni prefijos.`;
