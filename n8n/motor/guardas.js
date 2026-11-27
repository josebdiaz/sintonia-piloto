// Sintonía · E1.5 · guardas del Redactor (v0.1, 27/11/2026)
// Revisan con reglas lo que el Redactor devuelve, ANTES del Revisor (QA). Contrato: n8n/agentes/contrato.md §3.
// Se pega completo en el nodo Code «Guardas» de `SW · Redactar` y se prueba con `node n8n/motor/prueba-guardas.js`.
// Entrada: el texto del Redactor (con `{{bloque}}`) y el bloque de datos que puso el código. Salida: ok, motivos y el texto final.
// No inventa ni corrige: si algo falla, el flujo manda la plantilla de E1 (consola 2.16.0). Los motivos son códigos, sin el texto.
const GUARDAS = (() => {
  const MARCA_TU = 'tu +1 de confianza', MARCA_SU = 'su +1 de confianza';   // iguales a la consola (snippets/sintonia-e1.js)
  // Palabras con mayúscula que no son nombres de personas ni datos (se aceptan en cualquier parte de la frase)
  const PERMITIDAS = new Set(['sintonia', 'sintonía', 'whatsapp', 'humano', 'salir', 'cali', 'ia', 'ok']);
  // Arranques de frase comunes seguidos de coma; con cualquier otra palabra «Xxx, …» se trata como vocativo (un nombre)
  const ARRANQUES = new Set(['hola', 'listo', 'bueno', 'oigan', 'parche', 'gente', 'ojo', 'dale', 'claro', 'perfecto', 'vale', 'ya',
    'si', 'sí', 'no', 'bien', 'uy', 'ey', 'hey', 'equipo', 'recuerden', 'porfa', 'eso', 'genial', 'buenas', 'muchachos', 'chicos',
    'tranquilos', 'atentos', 'pilas', 'entonces', 'ahora', 'hoy', 'mañana', 'gracias', 'ánimo', 'animo', 'vamos', 'bacano', 'super', 'súper']);
  const NUMEROS = { dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
    quince: 15, veinte: 20, treinta: 30, cuarenta: 40, cincuenta: 50, cien: 100, ciento: 100, mil: 1000 };
  const LUGAR = /\b(calle|cl|carrera|cra|kr|avenida|av|diagonal|transversal|barrio|centro comercial|cc|parque|estadio|sede|piso|local)\b\.?/i;
  const ENLACE = /\b(https?:\/\/\S+|www\.\S+|\S+\.(com|co|org|net|my|app|ly|me|io)(\/\S*)?)\b/gi;
  const CIFRA = /\$?\s?\d[\d.,:]*(?:\s?(?:a\.?\s?m\.?|p\.?\s?m\.?|h\b|hrs?\b|%|mil\b|k\b))?/gi;
  const DEFECTO = { max_prosa: 320, max_total: 900, max_frases: 3 };

  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const soloDig = (s) => String(s).replace(/\D/g, '');

  function contarEmojis(t) {
    const s = String(t || '');
    const rx = /\p{Extended_Pictographic}/u;
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      let n = 0;
      for (const g of new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(s)) if (rx.test(g.segment)) n++;
      return n;
    }
    return (s.match(/\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*/gu) || []).length;
  }

  // Cifras del bloque, en formas comparables: «7:00 p. m.» → 700 y 7; «$25.000» → 25000 y 25
  function cifrasDe(t) {
    const set = new Set();
    for (const m of String(t || '').match(CIFRA) || []) {
      const d = soloDig(m); if (!d) continue;
      set.add(d); set.add(String(Number(d)));
      const h = m.match(/^\$?\s?(\d{1,2}):\d{2}/); if (h) set.add(String(Number(h[1])));
      const miles = m.match(/^\$?\s?(\d{1,3})[.,]000\b/); if (miles) set.add(miles[1]);
    }
    return set;
  }

  // Palabras con mayúscula fuera de inicio de frase (nombres o lugares) y vocativos al inicio («Ana, …»)
  function mayusculas(t) {
    const malos = [];
    const frases = String(t || '').split(/(?<=[.!?…\n])\s+|\n+/);
    for (const f of frases) {
      const pal = f.match(/[\p{L}][\p{L}'’-]*/gu) || [];
      pal.forEach((p, i) => {
        if (!/^\p{Lu}/u.test(p) || PERMITIDAS.has(p.toLowerCase())) return;
        if (/^\p{Lu}+$/u.test(p) && p.length > 1) return;          // siglas o palabras de comando en mayúscula (SALIR, HUMANO)
        if (i === 0) {
          const tras = f.slice(f.indexOf(p) + p.length);
          if (/^\s*,/.test(tras) && !ARRANQUES.has(p.toLowerCase())) malos.push(p);   // vocativo con nombre
          return;
        }
        malos.push(p);
      });
    }
    return malos;
  }

  /**
   * @param {string} texto   lo que devolvió el Redactor; lleva `{{bloque}}` donde va el bloque de datos
   * @param {object} bloque  { lineas: [string], ... } armado por el código desde el backend; [] o null si el mensaje no lleva datos
   * @param {object} cfg     { a_quien: 'grupo'|'persona', max_prosa, max_total, max_frases }
   * @returns {{ ok: boolean, motivos: string[], texto: string }}  texto = texto final con el bloque (solo se usa si ok)
   */
  function revisar(texto, bloque, cfg = {}) {
    const c = Object.assign({}, DEFECTO, cfg);
    const motivos = new Set();
    const t = String(texto || '');
    const lineas = (bloque && Array.isArray(bloque.lineas) ? bloque.lineas : []).map(String).filter(Boolean);
    const datos = lineas.join('\n');
    const final = t.replace('{{bloque}}', datos);
    const prosa = t.replace(/\{\{\s*bloque\s*\}\}/g, ' ');

    if (!t.trim()) return { ok: false, motivos: ['vacio'], texto: '' };

    // 1. Bloque: exactamente una vez si hay datos, ninguna si no hay
    const veces = (t.match(/\{\{\s*bloque\s*\}\}/g) || []).length;
    if (lineas.length && veces === 0) motivos.add('bloque_falta');
    if (veces > 1) motivos.add('bloque_repetido');
    if (!lineas.length && veces) motivos.add('bloque_sin_datos');

    // 2. Corchetes y marcadores sin llenar (n8n.N3), en el texto final completo
    if (/[\[\]]|\{\{|\}\}|\[Dato pendiente/i.test(final)) motivos.add('corchete');

    // 3. Datos en la prosa que no están en el bloque: enlaces, cifras y horas, números escritos y lugares
    const nd = norm(datos);
    for (const m of prosa.match(ENLACE) || []) if (!nd.includes(norm(m).replace(/[.,;)]+$/, ''))) motivos.add('dato_ajeno_enlace');
    const cifras = cifrasDe(datos);
    const prosaSinEnlaces = prosa.replace(ENLACE, ' ').replace(/\+\s?1\b/g, ' ');   // «+1» es la marca, no una cifra
    for (const m of prosaSinEnlaces.match(CIFRA) || []) {
      const d = soloDig(m); if (!d) continue;
      if (!cifras.has(d) && !cifras.has(String(Number(d)))) motivos.add(/:|a\.?\s?m|p\.?\s?m|\bh\b/i.test(m) ? 'dato_ajeno_hora' : 'dato_ajeno_cifra');
    }
    for (const w of norm(prosaSinEnlaces.replace(CIFRA, ' ')).match(/\p{L}+/gu) || []) {
      if (w in NUMEROS && !cifras.has(String(NUMEROS[w]))) motivos.add('dato_ajeno_cifra');
    }
    const lug = prosa.match(LUGAR);
    if (lug && !nd.includes(norm(lug[1]))) motivos.add('dato_ajeno_lugar');

    // 4. Nombres propios: una palabra con mayúscula que no está en el bloque es un nombre o un lugar inventado
    for (const p of mayusculas(prosa)) {
      if (!nd.includes(norm(p))) { motivos.add('nombre'); break; }
    }

    // 5. Máximo un emoji en todo el mensaje
    if (contarEmojis(final) > 1) motivos.add('emoji');

    // 6. Marca: si menciona el +1, con la forma exacta y la persona gramatical correcta
    const marca = final.match(/\b(tu|su|tus|sus|el|la)\s*\+\s*1(\s+de\s+confianza)?/i);
    if (marca) {
      const esperada = c.a_quien === 'persona' ? MARCA_TU : MARCA_SU;
      if (!final.includes(esperada)) motivos.add('marca');
    }

    // 7. Largo: la prosa (lo que escribe el agente) y el mensaje completo; «una idea» la juzga el Revisor
    if (prosa.replace(/\s+/g, ' ').trim().length > c.max_prosa) motivos.add('largo');
    if (final.length > c.max_total) motivos.add('largo');
    const frases = prosa.split(/[.!?…]+|\n+/).filter((f) => /\p{L}{2,}/u.test(f)).length;
    if (frases > c.max_frases) motivos.add('largo');

    const lista = [...motivos];
    return { ok: lista.length === 0, motivos: lista, texto: lista.length ? '' : final };
  }

  return { revisar, contarEmojis, MARCA_TU, MARCA_SU };
})();
if (typeof module !== 'undefined') module.exports = GUARDAS;
