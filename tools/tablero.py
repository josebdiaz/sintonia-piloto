#!/usr/bin/env python3
"""Genera los datos del tablero de frentes de Sintonía.

Lee ESTADO.md (§0 fecha, §1 versiones, §4 pendientes), la capa curada
tools/tablero-curado.json y el estado de git. Escribe un JSON con
resumen, frentes, pendientes, hitos, decisiones, plan, casa y carga.

El tablero es una vista: no es fuente. Los pendientes mandan desde §4.

Uso:  python3 tools/tablero.py --salida "Claude outputs/tablero.json"
"""
import argparse, datetime as dt, json, os, re, subprocess
from zoneinfo import ZoneInfo

CALI = ZoneInfo('America/Bogota')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSONAS = ['Juan José', 'José', 'Katherine', 'Néstor', 'Juan Carlos', 'Equipo', 'Claude']


def leer(p):
    with open(os.path.join(RAIZ, p), encoding='utf-8') as f:
        return f.read()


def git(*a):
    try:
        return subprocess.run(['git', *a], cwd=RAIZ, capture_output=True, text=True, timeout=30).stdout.strip()
    except Exception:
        return ''


def limpiar(t):
    return re.sub(r'\s+', ' ', re.sub(r'[*`]|~~', '', t)).strip()


def titulo_corto(t, n=120):
    t = limpiar(t)
    m = re.match(r'(.+?[.:;])\s+(?=[A-ZÁÉÍÓÚÑ¿«]|$)', t + ' ')
    s = m.group(1).rstrip('.:;') if m and len(m.group(1)) >= 25 else t
    return s if len(s) <= n else s[:n - 1].rsplit(' ', 1)[0] + '…'


def personas(quien):
    return [p for p in PERSONAS if re.search(r'(?<!Juan )\b%s\b' % re.escape(p), quien)] if 'Juan José' not in quien \
        else ['Juan José'] + [p for p in PERSONAS if p not in ('Juan José', 'José') and p in quien] + \
        (['José'] if re.search(r'(?<!Juan )José', quien) else [])


def pendientes_estado(es, cur, hoy):
    sec = re.search(r'^## 4\. Pendientes.*?\n(.*?)(?=^## )', es, re.M | re.S)
    filas, hdr = [], None
    for fila in (sec.group(1).splitlines() if sec else []):
        c = [x.strip() for x in fila.strip().strip('|').split('|')]
        if len(c) >= 4 and c[0] == '#':
            hdr = [h.lower() for h in c]
            continue
        if len(c) < 4 or not c[0].isdigit():
            continue
        n, texto = c[0], c[1]
        meta = cur.get('pendientes', {}).get(n, {})
        frente = meta.get('frente', 'sin-frente')
        if hdr and 'frente' in hdr and len(c) > hdr.index('frente'):
            frente = c[hdr.index('frente')].strip().lower() or frente
        tachado = texto.startswith('~~')
        estado = meta.get('estado', 'abierto')
        if tachado:
            estado = 'hecho'
        elif estado == 'abierto' and re.search(r'después de (Cali|cerrar|del análisis)', texto, re.I) and not meta.get('fecha'):
            estado = 'espera'
        fecha = meta.get('fecha', '')
        if estado in ('abierto', 'bloqueado') and fecha and fecha < hoy:
            estado = 'vencido'
        filas.append({
            'n': int(n), 'pendiente': titulo_corto(texto), 'frente': frente,
            'estado': estado, 'tipo': meta.get('tipo', 'tarea'), 'fecha': fecha,
            'quien': limpiar(c[3]), 'bloquea': limpiar(c[2]), 'nota': meta.get('nota', ''),
            'orden': len(filas) + 1,
        })
    return filas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--salida', default=os.path.join(RAIZ, 'Claude outputs', 'tablero.json'))
    ap.add_argument('--hoy', default=dt.datetime.now(CALI).date().isoformat())
    a = ap.parse_args()
    hoy = a.hoy
    es, cur = leer('ESTADO.md'), json.loads(leer('tools/tablero-curado.json'))
    js, gs = leer('piloto/assets/sintonia.js'), leer('backend/Codigo_Piloto.gs')
    fe = re.search(r"FRONTEND_VERSION:\s*'([\d.]+)'", js).group(1)
    be = re.search(r'Piloto v([\d.]+)', gs).group(1)
    fecha_estado = (re.search(r'^# Estado del proyecto · (.+)$', es, re.M) or [None, ''])[1].strip()

    pend = pendientes_estado(es, cur, hoy)
    nombres = {f['id']: f['nombre'] for f in cur['frentes']}
    for p in pend:
        p['frente_nombre'] = nombres.get(p['frente'], p['frente'])

    # Git y casa
    remoto = (git('remote').splitlines() or ['origin'])[0]
    rama = git('rev-parse', '--abbrev-ref', 'HEAD')
    commit = git('rev-parse', '--short', 'HEAD')
    sin_subir = git('rev-list', '--count', '%s/main..HEAD' % remoto) or '?'
    sueltos = sorted({l[3:].strip('"').split('/')[0] for l in git('status', '--porcelain', '--untracked-files=normal').splitlines() if l.startswith('??')})
    try:
        home_ok = subprocess.run(['python3', 'tools/home.py', '--check'], cwd=RAIZ, capture_output=True, timeout=60).returncode == 0
    except Exception:
        home_ok = False
    sensibles = [s for s in sueltos if s.startswith('_archivo') or 'Claude outputs' in s]
    casa = [
        {'chequeo': 'Commits sin subir a main', 'estado': 'ok' if sin_subir == '0' else 'warn',
         'detalle': '%s commit(s) en la rama %s sin estar en %s/main' % (sin_subir, rama, remoto), 'accion': 'Cierre del WOW (push)'},
        {'chequeo': 'Carpetas con datos sin ignorar en git', 'estado': 'bad' if sensibles else 'ok',
         'detalle': (', '.join(sensibles) + ': un «git add -A» las publicaría') if sensibles else 'Nada sensible suelto',
         'accion': 'Agregarlas a .gitignore'},
        {'chequeo': 'Archivos sin versionar', 'estado': 'ok' if not sueltos else 'warn',
         'detalle': ', '.join(sueltos) or 'Ninguno', 'accion': 'Versionar, ignorar o mover'},
        {'chequeo': 'Home al día (tools/home.py --check)', 'estado': 'ok' if home_ok else 'warn',
         'detalle': 'Coincide con el repo' if home_ok else 'Hay que regenerar el home', 'accion': 'python3 tools/home.py'},
        {'chequeo': 'Pendientes hechos que siguen en §4', 'estado': 'ok' if not [p for p in pend if p['estado'] == 'hecho'] else 'warn',
         'detalle': ', '.join(str(p['n']) for p in pend if p['estado'] == 'hecho') or 'Ninguno', 'accion': 'Retirarlos al CHANGELOG'},
        {'chequeo': 'Pendientes vencidos', 'estado': 'bad' if [p for p in pend if p['estado'] == 'vencido'] else 'ok',
         'detalle': ', '.join(str(p['n']) for p in pend if p['estado'] == 'vencido') or 'Ninguno', 'accion': 'Registrar resultado o reprogramar'},
        {'chequeo': 'Pendientes sin frente', 'estado': 'warn' if [p for p in pend if p['frente'] == 'sin-frente'] else 'ok',
         'detalle': ', '.join(str(p['n']) for p in pend if p['frente'] == 'sin-frente') or 'Todos tienen frente', 'accion': 'Asignar frente'},
    ] + cur.get('casa_manual', [])

    # Frentes
    abiertos_est = ('abierto', 'vencido', 'bloqueado')
    frentes = []
    for f in cur['frentes']:
        ps = [p for p in pend if p['frente'] == f['id']]
        cuenta = lambda e: sum(1 for p in ps if p['estado'] == e)
        hit = sorted([h for h in cur['hitos'] if h['frente'] == f['id'] and h['fecha'] >= hoy and h['estado'] != 'hecho'], key=lambda h: h['fecha'])
        dec = sum(1 for d in cur['decisiones'] if d['frente'] == f['id'])
        salud = 'bad' if cuenta('vencido') or (f['critico'] and cuenta('bloqueado')) else \
                'warn' if cuenta('bloqueado') or cuenta('hecho') or any(p['tipo'] == 'epica' for p in ps) or dec else 'ok'
        frentes.append({
            'frente': f['nombre'], 'id': f['id'], 'dueno': f['dueno'], 'foco': f['foco'],
            'critico': 'sí' if f['critico'] else 'no',
            'abiertos': sum(1 for p in ps if p['estado'] in abiertos_est),
            'vencidos': cuenta('vencido'), 'bloqueados': cuenta('bloqueado'),
            'en_espera': cuenta('espera'), 'por_retirar': cuenta('hecho'), 'decisiones': dec,
            'proximo_hito': ('%s · %s' % (hit[0]['fecha'], hit[0]['hito'])) if hit else '',
            'salud': salud,
        })

    # Carga por persona (pendientes abiertos o vencidos o bloqueados)
    carga = {}
    for p in pend:
        if p['estado'] in abiertos_est:
            for q in personas(p['quien']) or ['Sin dueño']:
                carga[q] = carga.get(q, 0) + 1
    carga = [{'persona': k, 'abiertos': v} for k, v in sorted(carga.items(), key=lambda x: -x[1])]

    pitch = dt.date(2026, 12, 12)
    resumen = [{
        'generado': dt.datetime.now(CALI).strftime('%Y-%m-%d %H:%M'), 'hoy': hoy, 'estado_fecha': fecha_estado,
        'rama': rama, 'commit': commit, 'frontend': fe, 'backend': be,
        'abiertos': sum(1 for p in pend if p['estado'] in abiertos_est),
        'vencidos': sum(1 for p in pend if p['estado'] == 'vencido'),
        'bloqueados': sum(1 for p in pend if p['estado'] == 'bloqueado'),
        'en_espera': sum(1 for p in pend if p['estado'] == 'espera'),
        'por_retirar': sum(1 for p in pend if p['estado'] == 'hecho'),
        'decisiones': len(cur['decisiones']),
        'plan_pendiente': sum(1 for x in cur['plan'] if x['estado'] != 'hecho'),
        'plan_hecho': sum(1 for x in cur['plan'] if x['estado'] == 'hecho'),
        'casa_alertas': sum(1 for c in casa if c['estado'] != 'ok'),
        'dias_pitch': (pitch - dt.date.fromisoformat(hoy)).days,
    }]
    for h in cur['hitos']:
        h['frente_nombre'] = nombres.get(h['frente'], h['frente'])
    for d in cur['decisiones']:
        d['frente_nombre'] = nombres.get(d['frente'], d['frente'])
    for x in cur['plan']:
        x['frente_nombre'] = nombres.get(x['frente'], x['frente'])

    with open(__file__, encoding='utf-8') as f:
        codigo = f.read()
    out = {
        'resumen': resumen, 'frentes': frentes, 'pendientes': pend, 'hitos': cur['hitos'],
        'decisiones': cur['decisiones'], 'plan': cur['plan'], 'casa': casa, 'carga': carga,
        'meta': [
            {'label': 'tablero.py', 'value': codigo, 'type': 'code', 'lang': 'python'},
            {'label': 'Entrada', 'value': 'ESTADO.md (%s), tools/tablero-curado.json (%s), git %s@%s' % (fecha_estado, cur.get('actualizado', ''), rama, commit)},
        ],
    }
    os.makedirs(os.path.dirname(os.path.abspath(a.salida)), exist_ok=True)
    with open(a.salida, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    r = resumen[0]
    print('✓ tablero: %d abiertos · %d vencidos · %d bloqueados · %d por retirar · %d alertas de casa → %s' % (
        r['abiertos'], r['vencidos'], r['bloqueados'], r['por_retirar'], r['casa_alertas'], a.salida))


if __name__ == '__main__':
    main()
