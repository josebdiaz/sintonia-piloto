#!/usr/bin/env node
/* Prueba de equivalencia: la consola (código del tag, zona America/Bogota) contra sintonia-e1.js en UTC y en Asia/Tokyo.
 * Uso: node n8n/snippets/prueba.js   → termina en ✓ o lista las diferencias. Datos ficticios. */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const AQUI = __dirname;

if (process.argv[2] === '--hijo') {   // corre los casos con un módulo y devuelve JSON
  const S = require(process.argv[3]);
  const F = JSON.parse(process.env.FIXT);
  const out = {};
  const pon = (k, f) => { try { out[k] = f(); } catch (e) { out[k] = 'ERROR ' + e.message; } };
  F.casos.forEach((c, n) => S.comandos.forEach(({ cmd }) => {
    pon(n + ' grupo ' + cmd, () => S.texto(cmd, c));
    pon(n + ' persona ' + cmd, () => S.texto(cmd, Object.assign({}, c, { persona_pid: 'P2' })));
  }));
  F.grupos.forEach((g, n) => pon('fechas ' + n, () => S.fechasPlan(g)));
  F.plazos.forEach((p, n) => pon('plazo ' + n, () => S.plazo(p)));
  ['$80.000 – $148.000', '50 mil', '$45.000 por persona', 'gratis', '', '120k – 200k'].forEach(x => pon('precio ' + x, () => S.precioUno(x)));
  process.stdout.write(JSON.stringify(out), () => process.exit(0));   // salir solo después de vaciar la tubería (Node 26 cortaba en 64 KB)
  return;
}

// --- Datos ficticios relativos a hoy, en la hora de Cali ---
const H = 36e5, ahora = Date.now();
const cali = (ms) => new Date(ms - 5 * H).toISOString();                 // «reloj de Cali» en ISO (sin zona real)
const dia = (k) => cali(ahora + k * 24 * H).slice(0, 10);
const local = (ms) => cali(ms).slice(0, 16).replace('T', ' ');           // 'AAAA-MM-DD HH:mm' en Cali
const f = (ks) => ks.map(dia).map(s => s.replace(/-/g, '/')).join(', ');
const ops = [
  { titulo: 'Tarde de juegos de mesa y café con postre en el barrio', por_que: 'Para conversar sin afán.', presupuesto_aprox: '$35.000 – $60.000',
    paradas: [{ id: 'X1', nombre: 'Café Ficticio Uno', zona: 'San Antonio', direccion: 'Cra 0 # 0-01' }, { id: 'X2', nombre: 'Heladería Inventada', zona: 'San Antonio' }] },
  { titulo: 'Picnic', presupuesto_aprox: '20 mil', paradas: [{ id: 'X3', nombre: 'Parque de Prueba', zona: 'Oeste', latitud: 3.45, longitud: -76.54 }] },
  { titulo: 'Karaoke', presupuesto_aprox: '$80.000 – $148.000', paradas: [{ id: 'X4', nombre: 'Lugar Ficticio Tres', zona: 'Granada' }] }
];
const miembros = [
  { pid: 'P1', nombre: 'Ana', disponibilidad: 'dias: sabado · franjas: tarde · fechas: ' + f([2, 3, 5, 6, 8, 9]) },
  { pid: 'P2', nombre: 'Beto', disponibilidad: 'dias: sabado · franjas: tarde · fechas: ' + f([3, 6, 9]) },
  { pid: 'P3', nombre: 'Caro', disponibilidad: 'dias: domingo · franjas: noche · fechas: ' + f([6, 9, 2]) },
  { pid: 'P4', nombre: 'Dani' }
];
const grupos = [
  { grupo_id: 'G1', disponibilidad: 'dias: sabado, domingo · franjas: tarde · fechas: ' + f([3, 4]), miembros },
  { grupo_id: 'G2', disponibilidad: 'dias: viernes, sabado · franjas: noche · fechas: ' + f([2, 3, 5, 6, 8, 9]), miembros },
  { grupo_id: 'G3', disponibilidad: 'dias: viernes, entre_semana · franjas: manana', miembros: miembros.slice(0, 2) },
  { grupo_id: 'G4', disponibilidad: '', miembros: [] }
];
const cerrado = (he, g) => ({ plan_id: 'PL-' + he, grupo_id: g.grupo_id, estado: 'cerrado', elegida: 0, opciones_json: JSON.stringify(ops),
  hora_encuentro: he, t_cerrado: cali(ahora).slice(0, 19), estado_por_pid: { P1: { apuntado: true }, P2: { apuntado: true, llego: true }, P3: { apuntado: false } } });
const horas = [local(ahora + 2 * H), local(ahora + 10 * H), local(ahora + 30 * H), local(ahora + 75 * H), new Date(ahora + 50 * H).toISOString()];
const casos = [];
grupos.forEach(g => {
  casos.push({ plan: { plan_id: 'PV-' + g.grupo_id, grupo_id: g.grupo_id, estado: 'votando', opciones: ops }, grupo: g, conteos: { dv0: 2, dv1: 2, dv2: 0, dvc: 0, dvp: 4 } });
  casos.push({ plan: { plan_id: 'PV1-' + g.grupo_id, grupo_id: g.grupo_id, estado: 'votando', opciones: ops }, grupo: g, conteos: { dv0: 1, dvp: 1 } });
});
horas.forEach(h => casos.push({ plan: cerrado(h, grupos[0]), grupo: grupos[0], humano: 'Equipo' }));
casos.push({ plan: Object.assign(cerrado(horas[1], grupos[1]), { elegida: 2 }), grupo: grupos[1] });
casos.push({ plan: { plan_id: 'PC', grupo_id: 'G1', estado: 'caido', opciones: ops }, grupo: grupos[0] });
casos.push({ grupo: grupos[0] });
const plazos = horas.map(h => ({ hora_encuentro: h, t_cerrado: cali(ahora).slice(0, 19) })).concat([{ hora_encuentro: '' }, { hora_encuentro: local(ahora + 26 * H), t_cerrado: cali(ahora + 4 * H).slice(0, 19) }]);
const FIXT = JSON.stringify({ casos, grupos, plazos });

// --- Correr ---
const ref = path.join(os.tmpdir(), 'sintonia-e1-ref-' + process.pid + '.js');
fs.writeFileSync(ref, execFileSync('python3', [path.join(AQUI, 'construir.py'), '--ref'], { encoding: 'utf8' }));
const correr = (mod, tz) => JSON.parse(execFileSync(process.execPath, [__filename, '--hijo', mod], { env: Object.assign({}, process.env, { TZ: tz, FIXT }), encoding: 'utf8', maxBuffer: 64e6 }));
const base = correr(ref, 'America/Bogota');
let fallas = 0, total = Object.keys(base).length, conTexto = 0;
for (const tz of (process.env.SOLO_TZ?[process.env.SOLO_TZ]:["UTC","Asia/Tokyo","America/Bogota"])) {
  const r = correr(path.join(AQUI, 'sintonia-e1.js'), tz);
  for (const k of Object.keys(base)) {
    const a = JSON.stringify(base[k]), b = JSON.stringify(r[k]);
    if (a !== b) { fallas++; if (fallas <= 15) console.log('✗ [' + tz + '] ' + k + '\n   consola: ' + a + '\n   n8n:     ' + b); }
  }
}
for (const k of Object.keys(base)) if (base[k] && typeof base[k] === 'object' && (base[k].txts || []).length) conTexto++;
const errores = Object.keys(base).filter(k => String(base[k]).startsWith('ERROR'));
fs.unlinkSync(ref);
if (errores.length) console.log('Casos con error en la consola misma (revisar):', errores.slice(0, 5));
console.log(fallas ? `✗ ${fallas} diferencias` : `✓ ${total} casos iguales a la consola en UTC, Asia/Tokyo y Bogotá (${conTexto} con texto)`);
process.exit(fallas || errores.length ? 1 : 0);
