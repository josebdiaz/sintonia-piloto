#!/usr/bin/env python3
"""Arma la página del Tablero de frentes desde el JSON de tools/tablero.py.

La página vive en el sitio, detrás del menú del equipo: sintonia.my/tablero (tablero/index.html).
Es una vista, no una fuente: manda ESTADO.md. Solo lleva lo que ya es público en el repo
(ESTADO §0, §1 y §4, la capa curada y el estado de git); quita la llave «meta» (el código del
generador) antes de incrustar los datos. Se regenera en cada cierre, antes del push.

Uso:  python3 tools/tablero.py && python3 tools/tablero-html.py
      python3 tools/tablero-html.py [entrada.json] [salida.html]
"""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
entrada = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'Claude outputs', 'tablero.json')
salida = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, 'tablero', 'index.html')
plantilla = os.path.join(RAIZ, 'tools', 'tablero-plantilla.html')

CABEZA = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
          '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n')

datos = json.load(open(entrada, encoding='utf-8'))
datos.pop('meta', None)
incrustado = json.dumps(datos, ensure_ascii=False).replace('</', '<\\/')
cuerpo = open(plantilla, encoding='utf-8').read().replace('__DATOS__', incrustado)
html = CABEZA + cuerpo + '\n</html>\n'
os.makedirs(os.path.dirname(os.path.abspath(salida)), exist_ok=True)
open(salida, 'w', encoding='utf-8').write(html)
print('✓ tablero HTML: %d bytes → %s' % (len(html), salida))
