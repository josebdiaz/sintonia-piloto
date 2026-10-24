/* ── 02 · Datos: base compartida (db) con respaldo local (este navegador) ──── */
const Diag = {
  log: [], subs: new Set(),
  add(msg, err) {
    const t = new Date().toLocaleTimeString('es-CO');
    this.log.push(`${t} · ${msg}${err ? ' — ' + (err.code || err.message || String(err)) : ''}`);
    if (this.log.length > 60) this.log.shift();
    this.subs.forEach(f => f());
  },
};

/* Normaliza lo que devuelva la base (documento suelto, {data}, data(), arreglo o {docs}). */
const unwrapDoc = d => {
  if (d == null) return null;
  if (typeof d.exists === 'function' && !d.exists()) return null;
  if (d.exists === false) return null;
  let v;
  if (typeof d.data === 'function') v = d.data();
  else if (d.data && typeof d.data === 'object' && !Array.isArray(d.data)) v = d.data;
  else v = d;
  if (!v || typeof v !== 'object') return null;
  return { ...v, _id: v.id || d.id || v._id };
};
const unwrapList = s => {
  if (!s) return [];
  const arr = Array.isArray(s) ? s : Array.isArray(s.docs) ? s.docs : Array.isArray(s.items) ? s.items : Array.isArray(s.documents) ? s.documents : Array.isArray(s.results) ? s.results : [];
  return arr.map(unwrapDoc).filter(Boolean);
};
const unsubOf = r => (typeof r === 'function' ? r : r && typeof r.then === 'function' ? (() => { r.then(f => typeof f === 'function' && f()).catch(() => {}); }) : r && typeof r.unsubscribe === 'function' ? () => r.unsubscribe() : () => {});

/* Respaldo: memoria + localStorage + BroadcastChannel (varias pestañas del mismo navegador). */
const LocalDB = (() => {
  const KEY = 'sintonia-e3-local-v1';
  let data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { data = {}; }
  let bc = null; try { bc = new BroadcastChannel('sintonia-e3'); } catch (e) {}
  const watchers = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
  const notify = () => watchers.forEach(w => w());
  if (bc) bc.onmessage = ev => { if (ev.data && ev.data.data) { data = ev.data.data; notify(); } };
  const changed = () => { save(); if (bc) try { bc.postMessage({ data }); } catch (e) {} notify(); };
  const kids = col => Object.keys(data).filter(p => p.startsWith(col + '/') && p.slice(col.length + 1).indexOf('/') === -1).map(p => ({ ...data[p], _id: p.slice(col.length + 1) }));
  return {
    kind: 'local',
    async get(p) { return data[p] ? { ...data[p], _id: p.split('/').pop() } : null; },
    async set(p, v) { data[p] = JSON.parse(JSON.stringify(v)); changed(); },
    async update(p, v) { data[p] = { ...(data[p] || {}), ...JSON.parse(JSON.stringify(v)) }; changed(); },
    async del(p) { delete data[p]; Object.keys(data).filter(k => k.startsWith(p + '/')).forEach(k => delete data[k]); changed(); },
    async list(col) { return kids(col); },
    watchDoc(p, cb) { const w = () => cb(data[p] ? { ...data[p], _id: p.split('/').pop() } : null); watchers.add(w); setTimeout(w, 0); return () => watchers.delete(w); },
    watchCol(col, cb) { const w = () => cb(kids(col)); watchers.add(w); setTimeout(w, 0); return () => watchers.delete(w); },
    wipe() { data = {}; changed(); },
  };
})();

/* Base compartida de la página (capacidad db). */
const SharedDB = db => ({
  kind: 'shared',
  async get(p) { return unwrapDoc(await db.doc(p).get()); },
  async set(p, v) { await db.doc(p).set(v); },
  async update(p, v) {
    try { await db.doc(p).update(v); }
    catch (e) { const cur = unwrapDoc(await db.doc(p).get()) || {}; delete cur._id; await db.doc(p).set({ ...cur, ...v }); }
  },
  async del(p) { await db.doc(p).delete(); },
  async list(col) { return unwrapList(await db.collection(col).get()); },
  watchDoc(p, cb) { try { return unsubOf(db.doc(p).onSnapshot(s => cb(unwrapDoc(s)), e => Diag.add('lectura ' + p, e))); } catch (e) { Diag.add('suscripción ' + p, e); return () => {}; } },
  watchCol(col, cb) { try { return unsubOf(db.collection(col).onSnapshot(s => cb(unwrapList(s)), e => Diag.add('lectura ' + col, e))); } catch (e) { Diag.add('suscripción ' + col, e); return () => {}; } },
});

const Store = {
  be: LocalDB, ready: false, falla: { envio: false, offline: false },
  async init() {
    try {
      const db = window.claude && typeof window.claude.use === 'function' ? await window.claude.use('db') : null;
      if (db && typeof db.doc === 'function') {
        const sh = SharedDB(db);
        try { await sh.get('meta/ping'); this.be = sh; Diag.add('Base compartida conectada'); }
        catch (e) {
          if (/not.?found/i.test(String(e && (e.code || e.message)))) { this.be = sh; Diag.add('Base compartida conectada'); }
          else Diag.add('Base compartida no responde; uso este navegador', e);
        }
      } else Diag.add('Sin base compartida en esta vista; los datos quedan en este navegador');
    } catch (e) { Diag.add('No se pudo abrir la base', e); }
    this.ready = true;
  },
  get shared() { return this.be.kind === 'shared'; },
  get: (p) => Store.be.get(p),
  set: (p, v) => Store.be.set(p, v),
  update: (p, v) => Store.be.update(p, v),
  del: (p) => Store.be.del(p),
  list: (c) => Store.be.list(c),
  watchDoc: (p, cb) => Store.be.watchDoc(p, cb),
  watchCol: (c, cb) => Store.be.watchCol(c, cb),
  /* Escritura con simulación de fallas (F1/F2) */
  async write(fn) {
    if (this.falla.envio) { this.falla.envio = false; throw Object.assign(new Error('Simulado'), { code: 'error_simulado' }); }
    return fn();
  },
};
