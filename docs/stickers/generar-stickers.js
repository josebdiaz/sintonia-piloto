// Genera el paquete de stickers de Sintonía: 512×512 PNG transparente → WebP (<100 KB) + ícono 96×96
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2], GLIFO = fs.readFileSync(process.argv[3], 'utf8');
const glifo = 'data:image/svg+xml;base64,' + Buffer.from(GLIFO).toString('base64');
const C = { papel: '#faf9f6', noche: '#0e1116', naranja: '#ff4f00', naranja7: '#c23a00', mostaza: '#ebc46a', crema: '#f3e9b8', vitral: '#2c6a86', blanco: '#ffffff' };
const trazo = (col) => `<svg class="trazo" viewBox="0 0 128 16" preserveAspectRatio="none"><path d="M2 9 Q18 1 34 9 T66 9 T98 9 T126 9" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/></svg>`;
const ico = {
  check: (bg, fg) => `<svg class="ico" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${bg}"/><path d="M28 52 L44 67 L73 35" fill="none" stroke="${fg}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: (bg, fg) => `<svg class="ico" viewBox="0 0 100 100"><path d="M50 6 C30 6 16 21 16 40 C16 64 50 94 50 94 C50 94 84 64 84 40 C84 21 70 6 50 6 Z" fill="${bg}"/><circle cx="50" cy="40" r="13" fill="${fg}"/></svg>`,
  casa: (bg, fg) => `<svg class="ico" viewBox="0 0 100 100"><path d="M12 48 L50 14 L88 48" fill="none" stroke="${bg}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 44 V86 H76 V44" fill="${bg}"/><rect x="42" y="58" width="16" height="28" rx="3" fill="${fg}"/></svg>`,
  cal: (bg, fg) => `<svg class="ico" viewBox="0 0 100 100"><rect x="10" y="18" width="80" height="72" rx="14" fill="${bg}"/><rect x="10" y="18" width="80" height="20" rx="10" fill="${C.naranja}"/><rect x="28" y="8" width="9" height="20" rx="4" fill="${bg}"/><rect x="63" y="8" width="9" height="20" rx="4" fill="${bg}"/><circle cx="32" cy="56" r="6" fill="${fg}"/><circle cx="50" cy="56" r="6" fill="${fg}"/><circle cx="68" cy="56" r="6" fill="${fg}"/><circle cx="32" cy="74" r="6" fill="${fg}"/><circle cx="50" cy="74" r="6" fill="${C.naranja}"/></svg>`
};
const S = [
  { id: '01-hay-plan', bg: C.naranja, fg: C.blanco, rot: -5, fs: 128, html: '¡Hay<br>plan!', glifo: 'tl', emo: ['🎉', '✅'] },
  { id: '02-menos-vueltas', bg: C.noche, fg: C.papel, rot: 3, fs: 66, html: 'Menos<br>vueltas,<br><span class="u">más plan.</span>', under: C.naranja, emo: ['🙌'] },
  { id: '03-cual-les-suena', bg: C.mostaza, fg: C.noche, rot: -3, fs: 72, html: '¿Cuál les<br>suena más?<div class="pills"><i>1</i><i>2</i><i>3</i></div>', emo: ['🤔', '🗳'] },
  { id: '04-cuadremos', bg: C.crema, fg: C.noche, rot: 4, fs: 70, html: 'Cuadremos<br>día y hora', icon: ico.cal(C.noche, C.crema), iconPos: 'top', emo: ['📅'] },
  { id: '05-me-apunto', bg: C.vitral, fg: C.blanco, rot: -4, fs: 116, html: 'Me<br>apunto', icon: ico.check(C.naranja, C.blanco), iconPos: 'tr', emo: ['🙋', '👍'] },
  { id: '06-hoy-no-puedo', bg: C.papel, fg: C.noche, rot: 3, fs: 60, html: 'Hoy no<br>puedo.<br><span class="n">La próxima,<br>sí.</span>', emo: ['🙏'] },
  { id: '07-voy-en-camino', bg: C.noche, fg: C.blanco, rot: -3, fs: 100, html: 'Voy en<br>camino', wave: C.mostaza, emo: ['🚶', '🚕'] },
  { id: '08-ya-llegue', bg: C.naranja, fg: C.blanco, rot: 4, fs: 116, html: '¡Ya<br>llegué!', icon: ico.pin(C.noche, C.naranja), iconPos: 'tr', emo: ['📍'] },
  { id: '09-ya-en-casa-pregunta', bg: C.mostaza, fg: C.noche, rot: -4, fs: 108, html: '¿Ya en<br>casa?', icon: ico.casa(C.noche, C.mostaza), iconPos: 'tr', emo: ['🏠', '❓'] },
  { id: '10-ya-en-casa', bg: C.vitral, fg: C.blanco, rot: 3, fs: 112, html: 'Ya en<br>casa', icon: ico.casa(C.vitral, C.blanco), iconPos: 'tr', emo: ['🏡', '😌'] },
  { id: '11-gracias-por-venir', bg: C.crema, fg: C.noche, rot: -3, fs: 84, html: 'Gracias<br>por venir', glifo: 'br', emo: ['🧡', '🙏'] },
  { id: '12-repetimos', bg: C.naranja7, fg: C.blanco, rot: 4, fs: 84, html: '¿Lo<br>repetimos?<div class="sub">con este parche</div>', emo: ['🔁', '😄'] },
  { id: '13-hay-que-vernos', bg: C.papel, fg: C.noche, rot: -2, fs: 56, html: '«Hay que<br>vernos»<br><span class="n">…y esta<br>vez, sí.</span>', emo: ['😅', '✨'] },
  { id: '14-sintonia', solo: true, emo: ['👋', '😊'] }
];
const css = `*{margin:0;box-sizing:border-box}html,body{background:transparent}
#st{width:512px;height:512px;display:grid;place-items:center;font-family:Inter;font-weight:800;letter-spacing:-.045em;line-height:.95}
.wrap{position:relative;transform-origin:center}
.tag{position:relative;white-space:nowrap;padding:34px 42px 38px;border:14px solid #fff;border-radius:48px;box-shadow:0 10px 22px rgba(14,17,22,.28);text-align:left}
.u{position:relative;display:inline-block;color:${C.naranja}}
.n{color:${C.naranja7}}
.trazo{display:block;width:62%;height:20px;margin-top:14px}
.pills{display:flex;gap:14px;margin-top:22px}.pills i{font-style:normal;display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:${C.noche};color:#fff;font-size:44px;letter-spacing:0}
.sub{font-size:36px;letter-spacing:-.02em;font-weight:700;margin-top:12px;opacity:.95}
.ico{position:absolute;width:118px;height:118px;filter:drop-shadow(0 0 0 #fff)}
.ico-wrap{position:absolute;width:140px;height:140px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 8px 16px rgba(14,17,22,.25)}
.ico-wrap .ico{position:static;width:104px;height:104px}
.tr{right:-46px;top:-58px}.tl{left:-52px;top:-60px}.br{right:-50px;bottom:-56px}.top{left:50%;top:-86px;transform:translateX(-50%)}
.glifo{position:absolute;width:132px;height:132px;border-radius:50%;border:10px solid #fff;background:#fff url(${glifo}) center/100% no-repeat;box-shadow:0 8px 16px rgba(14,17,22,.25)}
.solo{width:360px;height:360px;border-radius:50%;border:18px solid #fff;background:#fff url(${glifo}) center/100% no-repeat;box-shadow:0 12px 26px rgba(14,17,22,.3)}`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
  await p.setContent(`<style>${css}</style><div id="st"></div>`);
  await p.evaluate(() => document.fonts.ready);
  const meta = [];
  for (const s of S) {
    let inner;
    if (s.solo) inner = `<div class="wrap"><div class="solo"></div></div>`;
    else inner = `<div class="wrap" style="transform:rotate(${s.rot}deg)"><div class="tag" style="background:${s.bg};color:${s.fg};font-size:${s.fs}px">${s.html}${s.wave ? trazo(s.wave) : ''}${s.under ? trazo(s.under) : ''}</div>` +
      (s.icon ? `<div class="ico-wrap ${s.iconPos}">${s.icon}</div>` : '') + (s.glifo ? `<div class="glifo ${s.glifo}"></div>` : '') + `</div>`;
    await p.evaluate(h => { document.getElementById('st').innerHTML = h; }, inner);
    // encaja dentro de 512 con 16 px de margen (guía de WhatsApp)
    await p.evaluate(() => {
      const w = document.querySelector('.wrap'), rot = w.style.transform || '';
      const r = [...w.querySelectorAll('*')].concat([w]).reduce((a, el) => { const q = el.getBoundingClientRect(); return { l: Math.min(a.l, q.left), t: Math.min(a.t, q.top), r: Math.max(a.r, q.right), b: Math.max(a.b, q.bottom) }; }, { l: 1e9, t: 1e9, r: -1e9, b: -1e9 });
      const k = Math.min(1.35, 468 / (r.r - r.l), 468 / (r.b - r.t));
      const cx = (r.l + r.r) / 2 - 256, cy = (r.t + r.b) / 2 - 256;
      w.style.transform = `translate(${-cx * k}px, ${-cy * k}px) scale(${k}) ${rot}`;
    });
    const png = path.join(OUT, 'png', s.id + '.png');
    await p.screenshot({ path: png, omitBackground: true, clip: { x: 0, y: 0, width: 512, height: 512 } });
    meta.push({ id: s.id, emojis: s.emo });
  }
  // ícono de la bandeja 96×96
  await p.setViewportSize({ width: 96, height: 96 });
  await p.setContent(`<style>html,body{margin:0;background:transparent}div{width:96px;height:96px;border-radius:50%;background:url(${glifo}) center/100% no-repeat}</style><div></div>`);
  await p.screenshot({ path: path.join(OUT, 'png', 'tray.png'), omitBackground: true });
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 1));
  await b.close();
})();
