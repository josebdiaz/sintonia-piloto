#!/usr/bin/env python3
"""Mantiene el home (index.html) al día con el estado del repositorio.

Uso:
  python3 tools/home.py           # regenera las tarjetas del menú «Detrás de escena»
  python3 tools/home.py --check   # no escribe; falla si el home está desactualizado o algo no cuadra

Fuentes (no se edita index.html a mano entre los marcadores):
  home.json                        contenido editorial de las tarjetas (enlaces, decks, notas)
  piloto/assets/sintonia.js        FRONTEND_VERSION
  backend/Codigo_Piloto.gs         versión del backend (encabezado «Piloto vX.Y.Z»)
  CHANGELOG.md                     último cambio (primera entrada de «Repositorio»)
  ESTADO.md                        fecha del estado y pendientes abiertos (§4)

Protocolo completo: docs/protocolo-home.md
"""
import html, json, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INI, FIN = '<!-- home:inicio · generado por tools/home.py desde home.json; no editar a mano -->', '<!-- home:fin -->'


def leer(rel):
    with open(os.path.join(RAIZ, rel), encoding='utf-8') as f:
        return f.read()


def hechos():
    js, gs, ch, es = leer('piloto/assets/sintonia.js'), leer('backend/Codigo_Piloto.gs'), leer('CHANGELOG.md'), leer('ESTADO.md')
    fe = re.search(r"FRONTEND_VERSION:\s*'([\d.]+)'", js).group(1)
    be = re.search(r'Piloto v([\d.]+)', gs).group(1)
    rep = ch.split('## Repositorio', 1)[1] if '## Repositorio' in ch else ch
    m = re.search(r'^### (.+)$', rep, re.M)
    ultimo = re.sub(r'\*\*', '', m.group(1)).strip() if m else ''
    fecha_estado = (re.search(r'^# Estado del proyecto · (.+)$', es, re.M) or [None, ''])[1].strip()
    pend = []
    sec = re.search(r'^## 4\. Pendientes.*?\n(.*?)(?=^## )', es, re.M | re.S)
    if sec:
        for fila in sec.group(1).splitlines():
            c = [x.strip() for x in fila.strip().strip('|').split('|')]
            if len(c) < 4 or not c[0].isdigit():
                continue
            if '~~' in c[1] or re.search(r'\bHecho\b', c[1]):
                continue
            pend.append(re.sub(r'[*`]|~~', '', c[1]))
    return {'frontend': fe, 'backend': be, 'ultimo': ultimo, 'fecha_estado': fecha_estado, 'pendientes': pend}


def a(href, texto):
    ext = href.startswith('http')
    return '<a href="%s"%s>%s</a>' % (html.escape(href), ' target="_blank" rel="noopener"' if ext else '', html.escape(texto))


def item(e, h):
    s = a(e['href'], e['texto'])
    if e.get('auto_version'):
        s += ' <span class="muted" id="ver">· frontend v%s · backend v%s</span>' % (h['frontend'], h['backend'])
    if e.get('nota'):
        s += (' <span class="muted">%s</span>' if e.get('nota_suelta') else ' <span class="muted">· %s</span>') % html.escape(e['nota'])
    if e.get('extra'):
        s += ' <span class="muted">· %s</span>' % a(e['extra']['href'], e['extra']['texto'])
    return '          <li>%s</li>' % s


def tarjeta(t, h):
    if t.get('auto') == 'estado':
        p = ''.join('<li>%s</li>' % html.escape(x) for x in h['pendientes'][:3]) or '<li>Sin pendientes abiertos</li>'
        return ('      <section class="card team estado">\n        <span class="tag">Estado del repo · %s</span>\n        <h3>En qué va</h3>\n'
                '        <p class="versiones"><b>Frontend %s</b> · <b>Backend %s</b></p>\n'
                '        <p class="muted">Último cambio: %s</p>\n        <p class="muted" style="margin-top:6px">Pendientes que siguen:</p>\n        <ol class="pend">%s</ol>\n'
                '        <ul><li>%s <span class="muted">· todo el detalle</span></li></ul>\n      </section>') % (
            html.escape(h['fecha_estado']), h['frontend'], h['backend'], html.escape(h['ultimo']), p,
            a('https://github.com/josebdiaz/sintonia-piloto/blob/main/ESTADO.md', 'Estado del proyecto'))
    out = ['      <section class="card %s">' % t['clase'], '        <span class="tag">%s</span>' % html.escape(t['etiqueta']),
           '        <h3>%s</h3>' % html.escape(t['titulo'])]
    if t.get('texto'):
        out.append('        <p%s>%s</p>' % (' class="muted"' if t.get('texto_suave') else '', html.escape(t['texto'])))
    out.append('        <ul>')
    out += [item(e, h) for e in t.get('enlaces', [])]
    out += ['        </ul>', '      </section>']
    return '\n'.join(out)


def generar():
    cfg, h = json.loads(leer('home.json')), hechos()
    cuerpo = '\n'.join(tarjeta(t, h) for t in cfg['tarjetas'])
    bloque = INI + '\n    <div class="cards stagger">\n' + cuerpo + '\n    </div>\n    <p class="note">%s</p>\n    ' % html.escape(cfg.get('nota_final', '')) + FIN
    return cfg, h, bloque


def problemas(cfg, h, idx):
    p = []
    # 1 · enlaces internos que existen
    for t in cfg['tarjetas']:
        for e in t.get('enlaces', []) + [x['extra'] for x in t.get('enlaces', []) if x.get('extra')]:
            href = e['href']
            if href.startswith('http'):
                continue
            ruta = os.path.join(RAIZ, href.split('#')[0].split('?')[0])
            if href.endswith('/'):
                ruta = os.path.join(ruta, 'index.html')
            if not os.path.exists(ruta):
                p.append('Enlace roto en home.json: ' + href)
    # 2 · todos los decks están en el home (en «Presentaciones» o en el archivo)
    listados = {e['href'] for t in cfg['tarjetas'] if t.get('decks') for e in t.get('enlaces', [])}
    for f in sorted(os.listdir(os.path.join(RAIZ, 'docs'))):
        if f.startswith('deck-') and f.endswith('.html') and 'docs/' + f not in listados:
            p.append('Deck sin listar en home.json: docs/' + f)
    # 3 · el estado y el historial hablan de la versión que está en el repo
    es, ch = leer('ESTADO.md'), leer('CHANGELOG.md')
    for comp, v in (('frontend', h['frontend']), ('backend', h['backend'])):
        if v not in es:
            p.append('ESTADO.md no menciona el %s %s (actualiza §1)' % (comp, v))
        if v not in ch:
            p.append('CHANGELOG.md no menciona el %s %s' % (comp, v))
    # 4 · los marcadores existen
    if INI not in idx or FIN not in idx:
        p.append('index.html no tiene los marcadores home:inicio / home:fin')
    return p


def main():
    check = '--check' in sys.argv
    cfg, h, bloque = generar()
    idx = leer('index.html')
    p = problemas(cfg, h, idx)
    if INI in idx and FIN in idx:
        nuevo = idx[:idx.index(INI)] + bloque + idx[idx.index(FIN) + len(FIN):]
    else:
        nuevo = idx
    if check:
        if nuevo != idx:
            p.append('El home está desactualizado: corre python3 tools/home.py')
        for x in p:
            print('✗', x)
        print('✓ Home al día (frontend %s · backend %s · %s)' % (h['frontend'], h['backend'], h['fecha_estado']) if not p else '%d problema(s)' % len(p))
        sys.exit(1 if p else 0)
    if nuevo != idx:
        with open(os.path.join(RAIZ, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(nuevo)
        print('Home actualizado (frontend %s · backend %s).' % (h['frontend'], h['backend']))
    else:
        print('El home ya estaba al día.')
    for x in p:
        print('⚠', x)
    sys.exit(1 if p else 0)


if __name__ == '__main__':
    main()
