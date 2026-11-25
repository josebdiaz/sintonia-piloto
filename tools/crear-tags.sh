#!/usr/bin/env bash
# Sintonía · tags de versiones (auditoría de estándares, 24/11/2026)
# Correr dentro del clon AL DÍA del repo (p. ej. ~/Desktop/sintonia-tags), NO en «Gemini dump».
# 1) Crea como anotados los tags de las versiones intermedias (solo los que no existen).
# 2) Recrea como anotados los 2 tags del congelamiento, sobre el MISMO commit 2a81fd3.
# No cambia código ni ramas. Regla: cada tag va en el último commit que modifica el componente con esa versión.
set -euo pipefail
git rev-parse --is-inside-work-tree >/dev/null
git remote get-url origin | grep -q 'josebdiaz/sintonia-piloto' || { echo "✗ Este no es el repo sintonia-piloto"; exit 1; }
git fetch --tags --force origin
creados=()
crear() { # tag sha fecha
  if git rev-parse -q --verify "refs/tags/$1" >/dev/null; then echo "· $1 ya existe"; return; fi
  git cat-file -e "$2^{commit}" || { echo "✗ Falta el commit $2 ($1)"; exit 1; }
  git tag -a "$1" "$2" -m "$1 · $3 · versión intermedia (auditoría de estándares 24/11): último commit que modifica el componente con esta versión"
  creados+=("refs/tags/$1"); echo "✓ $1 → ${2:0:7}"
}
crear piloto/v2.0.8 8036d82e3de7b6c381ca898e053932415bfe12e0 2026-10-14
crear piloto/v2.1.0 ec3c0a589b306ea70d5d6277da6d6d3a02b9d710 2026-10-24
crear piloto/v2.2.0 1a6d69045befd9a9239e8ef488e9125b3913ab4a 2026-10-24
crear piloto/v2.2.1 855c0003328125b456db7d3a2b31e77837fc8703 2026-10-24
crear piloto/v2.2.2 fc3b40cdc8abfdc1b702a1108860b058e6c4f13e 2026-11-06
crear piloto/v2.3.0 5889eb152b544f983bbaf02a05dad1ae1bc377df 2026-11-14
crear piloto/v2.3.1 de07407e2480ef51837926b7add09d391bfd5cbf 2026-11-14
crear piloto/v2.3.2 e564a9dee1c3296be165e4ee4bb9a0f38ea99e43 2026-11-14
crear piloto/v2.4.0 6827ea265d37bf63a3b1c935ca01da9887923087 2026-11-14
crear piloto/v2.5.0 b8b91430795a5694aec9063c5bc75b99e194329b 2026-11-14
crear piloto/v2.5.1 e6c380bc2101fa1f57dac8bee4dac86dffe11e1a 2026-11-14
crear piloto/v2.6.0 971bbe785c8f908d03c81f81539f529eb328f2fc 2026-11-15
crear piloto/v2.7.1 cbbf1ef2e674950babf31514b7f46040d660e386 2026-11-15
crear piloto/v2.7.2 8510a9f64828d7274c3c3d98b6b85f8897283392 2026-11-22
crear piloto/v2.7.3 9317aa9d032b54d2dfc4f53916fec7a17b62495b 2026-11-22
crear piloto/v2.8.0 c0c90188a5926cfbe7278887cf7ab918aa08065f 2026-11-22
crear piloto/v2.8.1 de92e78a0618a67aa9a9b5640a61a526ce26567a 2026-11-22
crear piloto/v2.8.2 4a4a8f804ccb4ffd5b0f68770bb3382671c07c4a 2026-11-22
crear piloto/v2.9.0 e01f169b512a56a48bee12016af8c15c95d05246 2026-11-22
crear piloto/v2.9.1 af224c3bcf7c805d6656ad47f27770e20f9ce36c 2026-11-22
crear piloto/v2.9.2 b1a26e82b3904403fb519467824b583f2e53189e 2026-11-22
crear piloto/v2.10.0 829bd605b5f3b0997c7712855259245fed5f1ffb 2026-11-23
crear piloto/v2.11.0 f8c9d12f934c8360d7eab781ab6ff06099646d8b 2026-11-23
crear piloto/v2.12.0 99ecac8d06ce706a5c61b2cda268b4074f592905 2026-11-23
crear piloto/v2.13.0 3d050a38faf5e28184e99b66f1a0f23e71819900 2026-11-23
crear piloto/v2.14.0 c14627f66e86b8c1a26d58f71def51370adebd63 2026-11-23
crear piloto/v2.15.0 6bd2cfa687f32676bed029a6e02cf40733b739fc 2026-11-24
crear backend/v2.2.6 8036d82e3de7b6c381ca898e053932415bfe12e0 2026-10-14
crear backend/v2.3.0 e37b3bbbb7ecfdea2ab7497aa33e1f924a466fd1 2026-10-24
crear backend/v2.3.1 855c0003328125b456db7d3a2b31e77837fc8703 2026-10-24
crear backend/v2.3.2 cafefd4a1b46ba827eded468f40bb3af957e17f6 2026-10-24
crear backend/v2.3.3 91f5f07f070071b8d7838f963b8e8ce24a5bc393 2026-11-14
crear backend/v2.3.4 582c15cf36f9a58d1f7ae761115e8bbce9d90a60 2026-11-14
crear backend/v2.3.5 2d7af87567a6a819dd30690d0ead396cb2e9d22c 2026-11-14
crear backend/v2.3.6 5889eb152b544f983bbaf02a05dad1ae1bc377df 2026-11-14
crear backend/v2.4.0 b377c78c13470b28661005bee59ba73e7b1f7b95 2026-11-14
crear backend/v2.5.0 26e7cdabbfc534345b748991e2ad9c001668f38e 2026-11-14
crear backend/v2.7.0 dc48152e5635bd4c6ff66dcde1da4cb1ea4a39ce 2026-11-15
crear backend/v2.7.1 b3ea27524aa96738acc3aa979639137637c731bb 2026-11-15
crear backend/v2.7.3 cbbf1ef2e674950babf31514b7f46040d660e386 2026-11-15
crear backend/v2.7.4 9317aa9d032b54d2dfc4f53916fec7a17b62495b 2026-11-22
crear backend/v2.8.0 c0c90188a5926cfbe7278887cf7ab918aa08065f 2026-11-22
crear backend/v2.8.1 de92e78a0618a67aa9a9b5640a61a526ce26567a 2026-11-22
crear backend/v2.9.0 e01f169b512a56a48bee12016af8c15c95d05246 2026-11-22
crear backend/v2.9.1 829bd605b5f3b0997c7712855259245fed5f1ffb 2026-11-23
crear backend/v2.9.2 3d050a38faf5e28184e99b66f1a0f23e71819900 2026-11-23
crear backend/v2.9.3 6bd2cfa687f32676bed029a6e02cf40733b739fc 2026-11-24
[ ${#creados[@]} -gt 0 ] && git push origin "${creados[@]}"
# Congelamiento: de ligero a anotado, mismo commit
for t in piloto/v2.16.0 backend/v2.10.0; do
  [ "$(git cat-file -t "$t")" = "tag" ] && { echo "· $t ya es anotado"; continue; }
  [ "$(git rev-parse "$t^{commit}" | cut -c1-7)" = "2a81fd3" ] || { echo "✗ $t no apunta a 2a81fd3: no lo toco"; continue; }
  git tag -fa "$t" 2a81fd3 -m "$t · 2026-11-24 · congelamiento del piloto (aprobado por Néstor)"
  git push -f origin "refs/tags/$t"; echo "✓ $t anotado"
done
echo "Listo: $(git ls-remote --tags origin | grep -vc '\^{}') tags en GitHub (esperado: 68)."
