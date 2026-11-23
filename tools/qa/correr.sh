#!/usr/bin/env bash
# QA de punta a punta del piloto, con el código real sobre una hoja simulada (datos ficticios).
# Uso:  tools/qa/correr.sh todo              → backend + las 6 pruebas principales
#       tools/qa/correr.sh <prueba> [args]   → una sola (recorrido, consola, ola-a, auditoria-e2e, casos-borde,
#                                               contraste, accesibilidad, capturas-deck)
set -u
cd "$(dirname "$0")"; RAIZ=$(cd ../.. && pwd); PUERTO=8767
mkdir -p salida
[ -d node_modules/axe-core ] || npm install --silent --no-audit --no-fund
parar() {   # libera el puerto aunque lo tenga otro servidor de QA
  pkill -f "servidor.js $RAIZ $PUERTO" 2>/dev/null
  if command -v lsof >/dev/null; then lsof -ti tcp:$PUERTO | xargs -r kill 2>/dev/null; elif command -v fuser >/dev/null; then fuser -k $PUERTO/tcp >/dev/null 2>&1; else pkill -f " $PUERTO\$" 2>/dev/null; fi
  sleep 0.5
}
levantar() {   # $1 = realista (precios en rango, zona compartida, dirección con «#») o vacío
  parar
  QA_DATOS="${1:-}" node servidor.js "$RAIZ" "$PUERTO" > salida/servidor.log 2>&1 &
  for _ in $(seq 1 30); do grep -q "QA server en" salida/servidor.log 2>/dev/null && return 0; sleep 0.3; done
  echo "El servidor de QA no arrancó (ver tools/qa/salida/servidor.log)"; exit 1
}
correr() {
  local p="$1"; shift
  [ -f "$p.js" ] || { echo "No existe la prueba «$p»"; exit 1; }
  case "$p" in auditoria-e2e|casos-borde|capturas-deck) levantar realista ;; *) levantar ;; esac
  node "$p.js" "$@"; local r=$?
  return $r
}
trap parar EXIT
if [ "${1:-}" = "todo" ]; then
  echo "== backend"; node ../../backend/qa/qa_backend.js | tail -2 | head -1
  for p in recorrido consola ola-a auditoria-e2e contraste accesibilidad; do echo "== $p"; correr "$p" 2>&1 | tail -4; done
elif [ -n "${1:-}" ]; then correr "$@"
else sed -n '2,6p' "$0"; fi
