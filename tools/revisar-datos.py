#!/usr/bin/env python3
"""Revisa que en el repositorio (que es público) no entren claves ni datos personales.

Uso:
  python3 tools/revisar-datos.py            # revisa los archivos versionados (git ls-files)
  python3 tools/revisar-datos.py --staged   # revisa solo lo que vas a commitear

Falla (código 1) si encuentra:
  · claves o tokens (Google API, GitHub, OpenAI, llaves privadas, ADMIN_KEY / MOTOR_KEY / GEMINI_API_KEY con valor)
  · correos que no estén en la lista permitida
  · teléfonos de Colombia que no sean de prueba ni de lugares del inventario
Reglas y excepción documentada: docs/seguridad-repo.md
"""
import os, re, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORREOS_OK = {'jbolanos.dmi@gmail.com',          # canal de consultas y reclamos (Ley 1581), publicado en el aviso de privacidad
              '41898282+github-actions[bot]@users.noreply.github.com', 'noreply@anthropic.com'}
# Teléfonos de prueba (QA) y teléfonos públicos de los lugares del inventario (datos/), que no son personas
TEL_PRUEBA = re.compile(r'(\+?57)?\s?30[01]\s?(000|100|999|123)\s?\d{4}')
RUTAS_TEL_OK = ('datos/', 'archivo/piloto-m2-gemini/master-prompt-ejecucion.md')
NO_REVISAR = ('.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.pdf', '.mp4', '.woff', '.woff2', '.ttf', '.otf', '.zip')
CLAVES = [
    ('clave de Google', re.compile(r'AIza[0-9A-Za-z_\-]{30,}')),
    ('token de GitHub', re.compile(r'gh[pousr]_[A-Za-z0-9]{30,}')),
    ('clave de OpenAI / Anthropic', re.compile(r'\bsk-(?:ant-)?[A-Za-z0-9_\-]{20,}')),
    ('llave privada', re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----')),
    ('clave del piloto con valor', re.compile(r'''(ADMIN_KEY|MOTOR_KEY|GEMINI_API_KEY)\s*[:=]\s*['"][A-Za-z0-9_\-]{12,}['"]''')),
]
CORREO = re.compile(r'[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[a-z]{2,}')
TEL = re.compile(r'(?<![\d.])(\+?57[\s\-]?)?3\d{2}[\s\-]?\d{3}[\s\-]?\d{4}(?!\d)')


def archivos(staged):
    cmd = ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'] if staged else ['git', 'ls-files']
    return [f for f in subprocess.run(cmd, cwd=RAIZ, capture_output=True, text=True).stdout.splitlines() if f and not f.lower().endswith(NO_REVISAR)]


def main():
    staged = '--staged' in sys.argv
    malos = []
    for f in archivos(staged):
        ruta = os.path.join(RAIZ, f)
        if not os.path.isfile(ruta) or f.startswith('backend/qa/'):
            continue
        try:
            texto = open(ruta, encoding='utf-8').read()
        except (UnicodeDecodeError, OSError):
            continue
        for n, linea in enumerate(texto.splitlines(), 1):
            for nombre, rx in CLAVES:
                if rx.search(linea):
                    malos.append('%s:%d · %s' % (f, n, nombre))
            for m in CORREO.finditer(linea):
                c = m.group(0)
                if c not in CORREOS_OK and not re.search(r'@(\d+x|2x|3x)\.', c) and not c.endswith(('.png', '.svg', '.jpg')) and 'example' not in c:
                    malos.append('%s:%d · correo no permitido (%s…)' % (f, n, c[:3]))
            if not f.startswith(RUTAS_TEL_OK) and 'placeholder=' not in linea:   # ejemplos en campos de formulario
                for m in TEL.finditer(linea):
                    if not TEL_PRUEBA.fullmatch(m.group(0).strip()):
                        malos.append('%s:%d · posible teléfono personal' % (f, n))
    for x in malos:
        print('✗', x)
    print('✓ Sin claves ni datos personales en %s.' % ('lo que vas a commitear' if staged else 'el repositorio') if not malos else '%d hallazgo(s). Reglas: docs/seguridad-repo.md' % len(malos))
    sys.exit(1 if malos else 0)


if __name__ == '__main__':
    main()
