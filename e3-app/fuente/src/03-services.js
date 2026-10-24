/* ── 03 · Servicios: identidad, IA (Claude) y presencia en vivo ──────────── */
const uidSafe = s => String(s).replace(/[^A-Za-z0-9_\-.~:@+]/g, '-').slice(0, 120);
const rid = (n = 6) => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');
const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

const Me = {
  base: null, alias: '', nombreCuenta: '', user: null,
  get uid() { return uidSafe(this.base + (this.alias ? '~' + this.alias : '')); },
  async init() {
    try { this.user = window.claude ? await window.claude.use('user') : null; } catch (e) { this.user = null; }
    if (this.user && typeof this.user.id === 'function') {
      try { this.base = await this.user.id(); } catch (e) { this.base = null; }
      try { const me = await this.user.me(); this.nombreCuenta = (me && (me.name || me.displayName)) || ''; } catch (e) {}
    }
    if (!this.base) { this.base = ls.get('sintonia-e3-uid') || ('local-' + rid(8)); ls.set('sintonia-e3-uid', this.base); }
    this.alias = ss.get('sintonia-e3-alias') || '';
  },
  setAlias(a) { this.alias = uidSafe(a || '').slice(0, 20); ss.set('sintonia-e3-alias', this.alias); },
};

const IA = {
  sample: null, on: true, estado: 'sin probar',
  async init() {
    try { this.sample = window.claude ? await window.claude.use('sample') : null; } catch (e) { this.sample = null; }
    this.estado = this.sample ? 'disponible' : 'no disponible en esta vista';
  },
  /* Devuelve texto de Claude o null (y la app usa el guion). */
  async responder(contexto, historial, mensaje) {
    if (!this.on || !this.sample) return null;
    const hist = historial.slice(-10).map(m => `${m.quien}: ${m.texto}`).join('\n');
    const input = `${REGLAS_IA}\n\nContexto (JSON): ${JSON.stringify(contexto)}\n\nConversación reciente:\n${hist || '(vacía)'}\n\nMensaje nuevo de ${contexto.persona || 'la persona'}: ${mensaje}\n\nResponde como Sintonía.`;
    try {
      const r = await this.sample(input, { modelTier: 'quick', cache: false });
      const t = (r && (r.text || '')).trim().replace(/^["«]|["»]$/g, '');
      this.estado = 'respondiendo';
      return t ? t.slice(0, 400) : null;
    } catch (e) {
      this.estado = e && e.code === 'not_granted' ? 'sin permiso (usa el guion)' : e && e.code === 'rate_limited' ? 'límite alcanzado (usa el guion)' : 'error (usa el guion)';
      Diag.add('IA', e);
      if (e && e.code === 'not_granted') this.on = false;
      return null;
    }
  },
};

const Live = {
  room: null, sala: null, peers: [], subs: new Set(),
  async init() {
    try { this.room = window.claude ? await window.claude.use('room') : null; } catch (e) { this.room = null; }
  },
  async entrar(pid) {
    this.salir();
    if (!this.room || typeof this.room.join !== 'function') return;
    try {
      this.sala = await this.room.join('parche-' + pid);
      if (this.sala && this.sala.onPeers) this.sala.onPeers(ps => { this.peers = Array.isArray(ps) ? ps : []; this.subs.forEach(f => f()); });
    } catch (e) { Diag.add('presencia', e); this.sala = null; }
  },
  salir() { try { this.sala && this.sala.leave && this.sala.leave(); } catch (e) {} this.sala = null; this.peers = []; },
  marcar(estado) { try { this.sala && this.sala.presence && this.sala.presence(estado); } catch (e) {} },
  escribiendo(uid) {
    return this.peers.filter(p => { const s = p && (p.presence || p.state || p); return s && s.escribiendo && s.uid !== uid; }).map(p => (p.presence || p.state || p).nombre).filter(Boolean);
  },
};
