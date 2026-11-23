# Sintonía · notas para trabajar en este repositorio

- **Empieza por `ESTADO.md`:** versiones, implicaciones y pendientes. Historial en `CHANGELOG.md`.
- **El home se genera.** Las tarjetas del menú «Detrás de escena» de `index.html` salen de `home.json` y del estado del repo con `tools/home.py`. Antes de cada push a `main`, corre `python3 tools/home.py` y luego `python3 tools/home.py --check`; tiene que terminar en ✓. Protocolo: `docs/protocolo-home.md`.
- **Al subir una versión:**
  1. `FRONTEND_VERSION` en `piloto/assets/sintonia.js` o el encabezado de `backend/Codigo_Piloto.gs`.
  2. La entrada en `CHANGELOG.md` (sección «Repositorio», arriba).
  3. `ESTADO.md` §1 y su fecha en el título.
  4. `python3 tools/home.py`.
- **Backend:** se despliega a mano (pegar en Apps Script, `probarMontaje()` si hay hojas nuevas, «Nueva versión»). QA: `node backend/qa/qa_backend.js`; de punta a punta, `tools/qa/correr.sh todo` (ver `tools/qa/README.md`).
- **Privacidad:** el repo es público (excepción documentada en `docs/seguridad-repo.md`). Nada de claves (ADMIN_KEY, MOTOR_KEY, tokens), correos personales, notas internas ni datos de participantes. Antes de commitear: `python3 tools/revisar-datos.py --staged` en ✓; la acción «Seguridad de datos» lo revisa en cada push.
- **Voz de Sintonía** en textos para participantes: una idea por mensaje, conteos y nunca nombres, máximo un emoji, nada inventado. Sintonía es «tu +1 de confianza» (a una persona) o «su +1 de confianza» (al grupo); constantes `MARCA_TU` y `MARCA_SU` de la consola.
