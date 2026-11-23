#!/usr/bin/env python3
"""QR del material POP (2.9.0). Cada pieza impresa lleva su `origen` para medir de dónde llegan las inscripciones.
Uso: python3 tools/qr-pop.py   → docs/pop/qr-<pieza>.svg (vector, para Affinity), .png (1200 px) y docs/pop/index.html (hoja de prueba).
Requiere: pip install segno"""
import pathlib, segno, html
RAIZ = pathlib.Path(__file__).resolve().parent.parent
OUT = RAIZ / 'docs' / 'pop'
BASE = 'https://sintonia.my/?o='
NOCHE = '#0e1116'
PIEZAS = [  # origen, pieza, tamaño mínimo impreso
    ('qr-totem', 'Tótem (roll-up) y habladores de mesa', '15 × 15 cm'),
    ('qr-volante', 'Volante media carta', '4 × 4 cm'),
    ('qr-tarjeta', 'Tarjeta con QR', '2,5 × 2,5 cm'),
    ('qr-sticker', 'Sticker «¿Hay que vernos?»', '2,5 × 2,5 cm'),
]
OUT.mkdir(parents=True, exist_ok=True)
filas = []
for origen, pieza, minimo in PIEZAS:
    url = BASE + origen
    q = segno.make(url, error='q', micro=False)   # nivel Q: aguanta un 25 % de daño (dobleces, brillo del laminado)
    q.save(OUT / f'{origen}.svg', scale=10, border=4, dark=NOCHE, light=None, xmldecl=False, svgns=True, title=f'Sintonía · {origen}')
    q.save(OUT / f'{origen}.png', scale=max(1, 1200 // (q.symbol_size(border=4)[0])), border=4, dark=NOCHE, light='#ffffff')
    filas.append(f'<figure><img src="{origen}.svg" alt="QR a {html.escape(url)}"><figcaption><strong>{html.escape(pieza)}</strong><br><code>{html.escape(url)}</code><br>Mínimo impreso: {minimo} · versión {q.version}, corrección Q</figcaption></figure>')
(OUT / 'index.html').write_text('''<!doctype html>
<html lang="es-CO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Sintonía · QR del material POP</title>
<style>body{margin:0;padding:32px 16px;font:16px/1.45 Inter,system-ui,sans-serif;background:#fff;color:#0e1116}main{max-width:960px;margin:0 auto}
h1{font-size:28px;margin:0 0 6px}p{margin:0 0 24px;max-width:62ch}.qr{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:28px}
figure{margin:0}img{width:100%;height:auto;display:block;border:1px solid #dad6cc;border-radius:8px}figcaption{margin-top:10px;font-size:14px}code{font-size:12px;word-break:break-all}
@media print{body{padding:0}p{display:none}}</style></head>
<body><main><h1>QR del material POP</h1>
<p>Cada pieza lleva su propio QR para saber de dónde llegan las inscripciones (columna <code>origen</code>). Todos apuntan a la landing pública de sintonia.my, nunca al formulario. Antes de aprobar un tiraje, escanea la prueba impresa con un iPhone y un Android. Se regeneran con <code>python3 tools/qr-pop.py</code>.</p>
<div class="qr">''' + '\n'.join(filas) + '''</div></main></body></html>
''', encoding='utf-8')
print('\n'.join(f'{o} → {BASE}{o}' for o, _, _ in PIEZAS))
