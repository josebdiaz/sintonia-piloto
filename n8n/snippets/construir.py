#!/usr/bin/env python3
"""Genera n8n/snippets/sintonia-e1.js: la lógica y los textos de la consola E1 para pegar en nodos Code de n8n.

Fuente: el tag del congelamiento (por defecto piloto/v2.16.0), no la copia de trabajo, para que E1.5 use
exactamente lo que ve el grupo en E1. Las funciones se copian tal cual; solo se cambia `new Date(` por `new DL(`,
una fecha fija en la hora de Cali (UTC-5, sin horario de verano), porque n8n corre en UTC.

Uso:
  python3 n8n/snippets/construir.py            # escribe sintonia-e1.js
  python3 n8n/snippets/construir.py --ref      # imprime la versión sin DL (solo para la prueba)
  python3 n8n/snippets/construir.py --tag piloto/v2.17.0
"""
import re, subprocess, sys, pathlib

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent

MAGO = ['aFecha', 'horaTxt', 'salidaDe', 'corto', 'dispoDe', 'fechasDe', 'fechaLarga', 'fechaCortaTxt', 'isoDia',
        'plazoDe', 'plazoFrase', 'plazoTxt', 'cuandoTxt', 'oList', 'diaTxt', 'cap', 'coordCali', 'ubicacionDe', 'mapaDe',
        'mezcla', 'horasFranja', 'pad2', 'poll', 'txtPulso', 'linkRetro', 'opcionTxt', 'dondeTxt', 'tplNorm', 'tplData']
MAGO_VARS = [r'var DIAS = ', r'var DOW = ', r'var DSL = ', r'var MARCA_TU = ']
SJS = ['precioUno', 'fecha']


def git_show(tag, ruta):
    return subprocess.run(['git', '-C', str(RAIZ), 'show', f'{tag}:{ruta}'], check=True, capture_output=True, text=True).stdout


def bloque(src, inicio_re, cierre_re):
    lineas = src.split('\n')
    for i, l in enumerate(lineas):
        if re.search(inicio_re, l):
            sangria = re.match(r'^\s*', l).group(0)
            sin_cadenas = re.sub(r"'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\"", "''", l)
            if sin_cadenas.count('{') == sin_cadenas.count('}') and sin_cadenas.count('[') == sin_cadenas.count(']'):
                return l.strip()
            for j in range(i + 1, len(lineas)):
                if re.match('^' + sangria + cierre_re, lineas[j]):
                    return '\n'.join(x[len(sangria):] if x.startswith(sangria) else x for x in lineas[i:j + 1])
            raise SystemExit(f'sin cierre: {inicio_re}')
    raise SystemExit(f'no encontré: {inicio_re}')


def funcion(src, nombre):
    return bloque(src, r'^\s*function ' + nombre + r'\(', r'\}')


def generar(tag, ref=False):
    mago = git_show(tag, 'piloto/mago.html')
    sjs = git_show(tag, 'piloto/assets/sintonia.js')
    ver = re.search(r"FRONTEND_VERSION:\s*'([^']+)'", sjs)
    partes = [next(l.strip() for l in mago.split('\n') if re.search(r'^\s*' + v, l)) for v in MAGO_VARS]
    partes += [funcion(mago, n) for n in MAGO]
    partes.append(bloque(mago, r'^\s*var TPL = \[', r'\];'))
    partes += [funcion(sjs, n) for n in SJS]
    cuerpo = '\n'.join(partes)
    if not ref:
        cuerpo = re.sub(r'\bnew Date\(', 'new DL(', cuerpo)
    plantilla = (AQUI / 'plantilla.js').read_text(encoding='utf-8')
    return (plantilla.replace('/*@@TAG@@*/', tag).replace('/*@@VERSION@@*/', ver.group(1) if ver else '?')
            .replace('/*@@DL@@*/', 'Date' if ref else 'DL').replace('/*@@CUERPO@@*/', cuerpo))


if __name__ == '__main__':
    tag = 'piloto/v2.16.0'
    if '--tag' in sys.argv:
        tag = sys.argv[sys.argv.index('--tag') + 1]
    if '--ref' in sys.argv:
        sys.stdout.write(generar(tag, ref=True))
    else:
        (AQUI / 'sintonia-e1.js').write_text(generar(tag), encoding='utf-8')
        print(f'✓ sintonia-e1.js desde {tag}')
