#!/usr/bin/env bash
# Sintonía DS 3.0 · prepara la publicación en GitHub Pages.
# No hace push: verifica, regenera y te muestra los comandos de git para que los corras tú
# en la rama que elijas. Uso: bash scripts/publicar.sh [rama]
set -euo pipefail
cd "$(dirname "$0")/.."
RAMA="${1:-e3-ds-3.0}"
REPO_URL="https://github.com/josebdiaz/sintonia-piloto.git"
PAGES_URL="https://josebdiaz.github.io/sintonia-piloto"

echo "1/4 · Íconos"
python3 scripts/iconos.py

echo "2/4 · Tokens + auditoría de contraste (falla si un par no pasa)"
python3 scripts/export_tokens.py > /tmp/sintonia-contraste.txt || { cat /tmp/sintonia-contraste.txt; echo "✗ Contraste: no se publica."; exit 1; }
tail -n 1 /tmp/sintonia-contraste.txt

echo "3/4 · Variables CSS usadas que no existen en tokens.css"
# --fill, --p y --w son propiedades locales de componente (riel, avance), no tokens
usadas=$(grep -ho 'var(--[a-z0-9-]*' css/*.css demo/index.html | sed 's/var(//' | grep -vxE -- '--(fill|p|w)' | sort -u)
definidas=$(grep -o '^ *--[a-z0-9-]*' tokens/tokens.css | tr -d ' ' | sort -u)
faltan=$(comm -23 <(echo "$usadas") <(echo "$definidas") || true)
if [ -n "$faltan" ]; then echo "✗ Faltan: $faltan"; exit 1; else echo "✓ Ninguna"; fi

echo "4/4 · Avatares esperados (8 personajes × 2 modos × 512 px)"
for id in el-quinto el-mago el-resonador la-antena la-guardiana el-despertador la-gramola la-estatica; do
  for modo in claro oscuro; do
    [ -f "assets/avatares/${id}_${modo}_512.jpg" ] || echo "✗ Falta assets/avatares/${id}_${modo}_512.jpg"
  done
done
echo "✓ Revisión terminada"

cat <<EOF

Listo para publicar. Corre tú estos comandos (desde la raíz del repo):

  git remote get-url gh >/dev/null 2>&1 || git remote add gh ${REPO_URL}
  git switch ${RAMA}
  git add ds-3.0
  git commit -m "DS 3.0 · E3: tokens, componentes CSS, íconos, avatares y demo"
  git push gh ${RAMA}

Luego anota la versión en la página Changelog de Figma.
Repositorio: ${REPO_URL}
La demo queda en ${PAGES_URL}/ds-3.0/demo/ cuando ${RAMA} se integre a main
(GitHub Pages publica desde main).
EOF
