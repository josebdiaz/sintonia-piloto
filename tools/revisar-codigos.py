#!/usr/bin/env python3
"""Revisa que los códigos y las versiones se citen sin ambigüedad (docs/convenciones.md).

Uso:
  python3 tools/revisar-codigos.py                 # resumen de todo el repo (informativo)
  python3 tools/revisar-codigos.py --cambios       # solo líneas nuevas desde el último commit, con detalle
  python3 tools/revisar-codigos.py --cambios --estricto   # código 1 si encuentra algo

Avisa de:
  · un código con letra con dueño (B, C, D, ...) escrito sin ámbito fuera de su documento: «N17» en vez de «n8n.N17»
  · una versión X.Y.Z sin «consola», «backend» u otro componente cerca: «2.10.0» en vez de «backend 2.10.0»
Registro: tools/codigos.json
"""
import json, os, re, subprocess, sys
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = json.load(open(os.path.join(RAIZ, 'tools', 'codigos.json'), encoding='utf-8'))
EXCLUIR = ('archivo/', '_archivo', '_to_delete/', 'Claude outputs/', 'docs/convenciones.md', 'node_modules/')

LETRAS = set()
CASA = {}  # letra -> archivos donde se puede escribir corto
for amb in REG['ambitos'].values():
    for l in amb['letras']:
        if l == '#':
            continue
        LETRAS.add(l)
        CASA.setdefault(l, set()).update(amb['archivos'])
NOMBRES = set(REG.get('nombres_no_codigos', []))

CODIGO = re.compile(r'(?<![\w.\-/#])([%s])(\d{1,2})[a-z]?(?![\w])' % ''.join(sorted(LETRAS)))
RANGO_PREVIO = re.compile(r'[A-Za-z]\d{1,2}[a-z]?\s?[–\-]\s?$')
VERSION = re.compile(r'(?<![\w./])v?\d{1,2}\.\d{1,2}\.\d{1,2}(?![\w.]*\d)')
COMPONENTE = re.compile(r'(consola|frontend|backend|evolution|api|piloto|aviso|node|n8n|versi[oó]n|la|el|desde|hasta|→|·)\W*$', re.I)
SPAN = re.compile(r'`[^`]*`')


def problemas(ruta, linea):
    texto = SPAN.sub(lambda m: ' ' * len(m.group(0)), linea)
    salida = []
    for m in CODIGO.finditer(texto):
        cod = m.group(0)
        if cod in NOMBRES or ruta in CASA.get(m.group(1), ()):
            continue
        if RANGO_PREVIO.search(texto[:m.start()]):
            continue  # segunda mitad de un rango: N12–N27
        salida.append(('código', cod))
    primera_celda = re.match(r'\|\s*\**v?\d{1,2}\.\d{1,2}\.\d{1,2}', texto)
    for m in VERSION.finditer(texto):
        if primera_celda and m.start() < primera_celda.end():
            continue  # columna «Versión» de una tabla
        antes = texto[max(0, m.start() - 30):m.start()]
        if not COMPONENTE.search(antes) and not re.search(r'(consola|backend|frontend)', antes, re.I):
            salida.append(('versión', m.group(0)))
    return salida


def git(*args):
    return subprocess.run(['git', *args], cwd=RAIZ, capture_output=True, text=True).stdout


def valido(ruta):
    return ruta.endswith('.md') and not ruta.startswith(EXCLUIR)


def lineas_nuevas():
    actual, nuevas = None, []
    for l in git('diff', '-U0', 'HEAD', '--', '*.md').splitlines():
        if l.startswith('+++ '):
            actual = l[6:] if l.startswith('+++ b/') else None
        elif l.startswith('+') and actual and valido(actual):
            nuevas.append((actual, l[1:]))
    for ruta in git('ls-files', '--others', '--exclude-standard', '--', '*.md').splitlines():
        if valido(ruta):
            with open(os.path.join(RAIZ, ruta), encoding='utf-8', errors='ignore') as f:
                nuevas += [(ruta, l.rstrip('\n')) for l in f]
    return nuevas


def main():
    cambios, estricto = '--cambios' in sys.argv, '--estricto' in sys.argv
    if cambios:
        hallazgos = [(r, t, c) for r, l in lineas_nuevas() for t, c in problemas(r, l)]
        for r, t, c in hallazgos:
            print(f'  {r}: {t} sin ámbito o componente → {c}')
    else:
        hallazgos = []
        for ruta in git('ls-files', '--', '*.md').splitlines():
            if not valido(ruta):
                continue
            with open(os.path.join(RAIZ, ruta), encoding='utf-8', errors='ignore') as f:
                hallazgos += [(ruta, t, c) for l in f for t, c in problemas(ruta, l)]
        por_archivo = Counter((r, t) for r, t, _ in hallazgos)
        for (r, t), n in sorted(por_archivo.items(), key=lambda x: -x[1])[:15]:
            print(f'  {n:4d} {t:8s} {r}')
    if hallazgos:
        print(f'⚠ {len(hallazgos)} citas ambiguas. Regla: docs/convenciones.md (n8n.N17, «backend 2.10.0»).')
        sys.exit(1 if estricto else 0)
    print('✓ Códigos y versiones sin ambigüedad.')


if __name__ == '__main__':
    main()
