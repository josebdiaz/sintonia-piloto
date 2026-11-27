// Sintonía · E1.5 · entrada del motor (v0.1, 27/11/2026)
// Clasifica lo que Evolution API manda al webhook de n8n y devuelve SOLO lo mínimo.
// Se pega completo en el nodo Code «Clasificar» de E15-00 y se prueba con `node n8n/motor/prueba-entrada.js`.
// No devuelve el texto, el nombre (pushName) ni la apikey que Evolution incluye en el cuerpo.
// Las reglas de texto copian E15-01 (voto mínimo); la lista sensible suma salud, ubicación y emergencia.
// Lo que no está decidido por el equipo va en `cfg` y se marca «por decidir».
const ENTRADA = (() => {
  const SENSIBLE = /\b(emergencia|urgente|accidente|hospital|ambulancia|policia|peligro|socorro|ayuda|enfermo|enferma|dolor|me siento mal|salud|ubicacion|donde estoy|123)\b/;
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  function interpretarTexto(t) {
    const n = norm(t);
    let m;
    if (!n) return { accion: 'escalar', motivo: 'vacio' };
    if (SENSIBLE.test(n)) return { accion: 'escalar', motivo: 'sensible' };
    if (/^humano$/.test(n)) return { accion: 'escalar', motivo: 'pidio_humano' };
    if ((m = n.match(/^(?:opcion |la |el |voto |voto por la |voy con la )?([123])$/))) return { accion: 'voto', opcion: Number(m[1]) - 1, veto: false };
    if (/^todas$/.test(n)) return { accion: 'voto', opcion: -1, veto: false };
    if (/^ninguna$/.test(n)) return { accion: 'voto', opcion: -1, veto: true };
    if (/^me apunto$/.test(n)) return { accion: 'evento', evento: 'me_apunto' };
    if (/^no puedo$/.test(n)) return { accion: 'evento', evento: 'no_puedo' };
    if (/^llegue$/.test(n)) return { accion: 'evento', evento: 'checkpoint_llegada' };
    if (/^(ya en casa|llegue a casa)$/.test(n)) return { accion: 'evento', evento: 'llego_casa' };
    if (/^salir$/.test(n)) return { accion: 'evento', evento: 'salir', aviso_equipo: true };
    return { accion: 'escalar', motivo: 'no_entendido' };   // aquí entraría la IA con salida cerrada (por decidir, d4)
  }

  // Forma del mensaje sin contenido: llaves y tipos. Sirve para la sonda V1 (qué trae un voto de encuesta).
  function forma(o, prof = 0) {
    if (prof > 6) return '…';
    if (Array.isArray(o)) return o.length ? [forma(o[0], prof + 1)] : [];
    if (o && typeof o === 'object') {
      const r = {};
      for (const k of Object.keys(o).sort()) {
        if (/^(apikey|pushName|jpegThumbnail|profilePicUrl)$/i.test(k)) { r[k] = '(omitido)'; continue; }
        r[k] = forma(o[k], prof + 1);
      }
      return r;
    }
    return typeof o;
  }

  function shaTexto(v) {   // fileSha256 llega como base64 o como objeto de bytes
    if (!v) return '';
    if (typeof v === 'string') return v;
    try { return Buffer.from(Object.values(v)).toString('base64'); } catch (e) { return ''; }
  }

  function votoEncuesta(d) {
    // La forma exacta del voto descifrado en Evolution 2.3.8 está por verificar (V1). Se prueban candidatos conocidos.
    const msg = d.message || {};
    const cands = [d.pollUpdates, msg.pollUpdateMessage && msg.pollUpdateMessage.vote, d.votes, d.pollVote];
    for (const c of cands) {
      const sel = c && (c.selectedOptions || (Array.isArray(c) && c[0] && c[0].selectedOptions) || c.selectedOptionNames);
      if (Array.isArray(sel)) return { descifrado: true, n_opciones: sel.length, opciones: sel.map(String) };
    }
    return { descifrado: false };
  }

  function clasificar(body, cfg = {}) {
    const grupos = (cfg.grupos || []).map(String);
    const b = body && body.body && !body.event ? body.body : (body || {});   // acepta el item del Webhook o el cuerpo
    const d = b.data || {};
    const key = d.key || {};
    const base = {
      v: 1,
      evento_evolution: String(b.event || ''),
      id_mensaje: String(key.id || ''),
      grupo: String(key.remoteJid || ''),
      autor: String(key.participant || d.participant || ''),   // solo en memoria, para resolver el pid; nunca se guarda
      hora: d.messageTimestamp ? new Date(Number(d.messageTimestamp) * 1000).toISOString() : '',
      tipo_whatsapp: String(d.messageType || ''),
    };
    const fin = (r) => Object.assign(base, r, cfg.sonda ? { forma: forma(b) } : {});

    const ev = base.evento_evolution.toLowerCase().replace('_', '.');
    if (!/^messages\.(upsert|update)$/.test(ev)) return fin({ accion: 'ignorar', motivo: 'evento_no_mensaje' });
    if (key.fromMe) return fin({ accion: 'ignorar', motivo: 'propio' });
    if (!base.grupo.endsWith('@g.us')) return fin({ accion: 'ignorar', motivo: 'no_es_grupo' });
    if (!grupos.includes(base.grupo)) return fin({ accion: 'ignorar', motivo: 'grupo_no_permitido' });

    const msg = d.message || {};
    const tipo = base.tipo_whatsapp || Object.keys(msg)[0] || '';

    if (/poll(Update|Vote)/i.test(tipo) || d.pollUpdates || msg.pollUpdateMessage) {
      const v = votoEncuesta(d);
      return fin(v.descifrado ? { accion: 'voto_encuesta', tipo: 'voto', ...v } : { accion: 'escalar', tipo: 'voto', motivo: 'voto_sin_descifrar' });
    }
    if (ev === 'messages.update') return fin({ accion: 'ignorar', motivo: 'actualizacion' });
    if (/sticker/i.test(tipo)) {
      const sha = shaTexto(msg.stickerMessage && msg.stickerMessage.fileSha256);
      const conocido = (cfg.stickers || {})[sha];   // mapa sha → sticker de Sintonía (por llenar con la sonda)
      const regla = cfg.sticker_entrante || 'escalar';  // por decidir (equipo): 'escalar' | 'registrar'
      return fin({ accion: regla === 'registrar' ? 'registrar' : 'escalar', tipo: 'sticker', motivo: 'sticker', sticker: conocido || '', sticker_sha: sha });
    }
    if (/location/i.test(tipo)) return fin({ accion: 'escalar', tipo: 'ubicacion', motivo: 'sensible' });
    const texto = msg.conversation || (msg.extendedTextMessage && msg.extendedTextMessage.text) || '';
    if (/conversation|extendedText/i.test(tipo) || texto) return fin({ tipo: 'texto', ...interpretarTexto(texto) });
    return fin({ accion: 'escalar', tipo: 'otro', motivo: 'medio_no_soportado' });
  }

  return { clasificar, interpretarTexto, forma };
})();
if (typeof module !== 'undefined') module.exports = ENTRADA;
