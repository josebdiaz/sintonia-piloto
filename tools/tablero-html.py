#!/usr/bin/env python3
"""Arma la página HTML del Tablero de frentes desde el JSON de tools/tablero.py.

La página es una vista privada y compartible (artefacto HTML del Proyecto); no es fuente:
manda ESTADO.md. Quita la llave «meta» (el código del generador) antes de incrustar los datos.

Uso:  python3 tools/tablero-html.py ["Claude outputs/tablero.json"] ["Claude outputs/tablero-frentes.html"]
"""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
entrada = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'Claude outputs', 'tablero.json')
salida = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, 'Claude outputs', 'tablero-frentes.html')
plantilla = os.path.join(RAIZ, 'tools', 'tablero-plantilla.html')

datos = json.load(open(entrada, encoding='utf-8'))
datos.pop('meta', None)
incrustado = json.dumps(datos, ensure_ascii=False).replace('</', '<\\/')
html = open(plantilla, encoding='utf-8').read().replace('__DATOS__', incrustado)
open(salida, 'w', encoding='utf-8').write(html)
print('✓ tablero HTML: %d bytes → %s' % (len(html), salida))
