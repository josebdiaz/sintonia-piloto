#!/usr/bin/env python3
"""Sintonía E3 · app de prueba interna. Arma el HTML a partir de fuente/src y del DS 3.0.

Uso (desde la raíz del repo):
  python3 e3-app/fuente/build.py                    → e3-app/index.html (versión para GitHub / navegador)
  python3 e3-app/fuente/build.py --artifact DIR URL → DIR/index.html + DIR/avatares/ (versión para el artifact de claude.ai)

La versión de GitHub funciona en un solo navegador (sin base compartida ni Claude): sirve para revisar
el código y hacer demos. La versión multijugador con Claude es el artifact «Sintonía E3 Interna».
"""
import shutil, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent          # e3-app/fuente
APP = HERE.parent                                # e3-app
DS = APP.parent / 'ds-3.0'
ARTIFACT_URL = 'https://claude.ai/artifact/GEhe6h4CogNRJYBk1ab3BY'

args = sys.argv[1:]
artifact = '--artifact' in args
if artifact:
    i = args.index('--artifact'); out_dir = Path(args[i + 1]).resolve(); url = args[i + 2] if len(args) > i + 2 else ARTIFACT_URL
else:
    out_dir = APP; url = ARTIFACT_URL

css = '\n'.join((DS / p).read_text(encoding='utf-8') for p in ['tokens/tokens.css', 'css/base.css', 'css/components.css'])
css += '\n' + (HERE / 'src' / 'app.css').read_text(encoding='utf-8')
js = '\n'.join(p.read_text(encoding='utf-8') for p in sorted((HERE / 'src').glob('*.js')))
js = js.replace("let ARTIFACT_URL = '';", f"let ARTIFACT_URL = {url!r};")
if not artifact:
    js = js.replace("let AV_BASE = 'avatares/', AV_SUF = '.png';", "let AV_BASE = '../ds-3.0/assets/avatares/', AV_SUF = '_48@2x.png';")

head = """<title>Sintonía E3 Interna</title>
<meta name="description" content="App de prueba interna de E3: chat con IA para armar planes en grupo.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap">
<style>
""" + css + "\n</style>"
body = """<div class="app-stage">
  <main class="phone" id="phone" aria-label="Sintonía"></main>
  <aside class="team" id="team" aria-label="Panel del equipo"></aside>
</div>
<button class="team-fab" type="button" aria-label="Abrir el panel del equipo">EQUIPO</button>
<script>
(() => {
'use strict';
""" + js + "\n})();\n</script>"

if artifact:   # el visor de artifacts agrega doctype, head y body
    html = head + '\n' + body + '\n'
else:
    html = '<!doctype html>\n<html lang="es-CO">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '\n</head>\n<body>\n' + body + '\n</body>\n</html>\n'

out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / 'index.html').write_text(html, encoding='utf-8')
if artifact:
    av = out_dir / 'avatares'; av.mkdir(exist_ok=True)
    for f in (DS / 'assets/avatares').glob('*_48@2x.png'):
        shutil.copy(f, av / f.name.replace('_48@2x', ''))
print(f"{'artifact' if artifact else 'github'}: {out_dir / 'index.html'} · {len(html)/1024:.0f} KB")
