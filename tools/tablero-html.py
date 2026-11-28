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
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
entrada = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'Claude outputs', 'tablero.json')
salida = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, 'tablero', 'index.html')
plantilla = os.path.join(RAIZ, 'tools', 'tablero-plantilla.html')

CABEZA = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
          '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n')



def js_esc(t):
    # Fuera del ASCII, \uXXXX (con pares sustitutos): vale en cadenas, regex y comentarios de JS.
    out = []
    for ch in t:
        o = ord(ch)
        if o < 128:
            out.append(ch)
        elif o <= 0xFFFF:
            out.append('\\u%04x' % o)
        else:
            o -= 0x10000
            out.append('\\u%04x\\u%04x' % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
    return ''.join(out)


def css_esc(t):
    return ''.join(ch if ord(ch) < 128 else '\\%x ' % ord(ch) for ch in t)


def html_esc(t):
    return ''.join(ch if ord(ch) < 128 else '&#x%x;' % ord(ch) for ch in t)


def solo_ascii(html):
    # La página sale en ASCII puro: se ve bien aunque el visor ignore el charset
    # (Safari abriendo el archivo local mostraba «QuÃ©», 27/11).
    partes = re.split(r'(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>)', html, flags=re.S | re.I)
    res = []
    for x in partes:
        if x[:7].lower() == '<script':
            res.append(js_esc(x))
        elif x[:6].lower() == '<style':
            res.append(css_esc(x))
        else:
            res.append(html_esc(x))
    return ''.join(res)


datos = json.load(open(entrada, encoding='utf-8'))
datos.pop('meta', None)
incrustado = json.dumps(datos, ensure_ascii=False).replace('</', '<\\/')
cuerpo = open(plantilla, encoding='utf-8').read().replace('__DATOS__', incrustado)
html = solo_ascii(CABEZA + cuerpo + '\n</html>\n')
assert all(ord(c) < 128 for c in html)
os.makedirs(os.path.dirname(os.path.abspath(salida)), exist_ok=True)
open(salida, 'w', encoding='utf-8').write(html)
print('✓ tablero HTML: %d bytes → %s' % (len(html), salida))
