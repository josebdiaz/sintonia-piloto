> **Copia en el repositorio · Pendiente: borrador. No desplegar hasta la decisión con Néstor (7/10) y el aviso v2-autonoma aprobado por el comité.**

# E2 autónoma · backend 2.3.0 y frontend 2.1.0 (borradores)

**No desplegar todavía.** Depende de la decisión con Néstor (7/10) y del aviso `v2-autonoma` aprobado por el comité.
`publicar.sh` publica `piloto_M2/` (2.0.7) y `Codigo_Piloto_v2.gs` (2.2.5). Estos borradores viven aparte.

## Qué hay
- `backend_2.3.0/Codigo_Piloto_v2.3.0.gs` — 2.2.5 (incluye el reinicio de la 2.2.4 y los arreglos de la prueba de punta a punta) + motor autónomo (tarea programada, reclutamiento, franja, barandas G1–G6, plan B, cierre automático, botones del grupo, cola de revisión, alertas, regla de parada) + avisos web por Firebase Cloud Messaging (suscribir, agenda de avisos, aviso de ajuste, purga al retirarse).
- `backend_2.3.0/pruebas_motor.js` — 58 casos con hojas simuladas: `node pruebas_motor.js`. El flujo supervisado (E1 y E2) pasa igual.
- `piloto_2.1.0/` — frontend: franja del organizador, plazo y razón del cierre, calendario, avisos (con guía para iPhone), «¿Algo salió mal?» (se cayó, ayuda, retiro), manifiesto instalable, `firebase-messaging-sw.js`, y en la consola: pestaña «Revisión E2» y botón de operación autónoma/supervisada por grupo.
- `qa_210/` — pantallas de prueba con el backend simulado.

## Firebase (proyecto `gen-lang-client-0252130928`)
1. La configuración pública de la web app ya está en `piloto_2.1.0/assets/sintonia.js` (`CONFIG.FIREBASE`).
2. `CONFIG.VAPID_KEY` (clave pública de Certificados push web) ya está en `assets/sintonia.js`.
3. En Apps Script → Propiedades del script: `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY` (de la cuenta de servicio; nunca en el repositorio ni en el chat). Opcional: `ALERTAS_EMAIL`.
4. Recomendado: una cuenta de servicio solo para avisos (rol «Firebase Cloud Messaging API Admin») en lugar de la de administración completa.

## Antes de desplegar
- El frontend 2.1.0 se armó sobre 2.0.5: hay que pasarle los cambios de 2.0.6 y 2.0.7 (empezar piloto real, mapa, dos toques, corregir hora, retiro, calendario, mensajes de error) antes de publicarlo.

## Al desplegar (cuando haya luz verde)
1. Backend: pegar `Codigo_Piloto_v2.3.0.gs` → Nueva versión de la misma implementación → `probarMontaje` → `instalarTareaProgramada`. No crear `QA_AHORA` en producción.
2. Frontend: reemplazar `piloto_M2/` por `piloto_2.1.0/` (y agregar `protocolo-m2.md`), registrar 2.1.0 y 2.3.0 en el CHANGELOG y correr `publicar.sh`.
3. Ensayo en modo prueba (14/10) con un grupo E2 de prueba en operación autónoma.
4. El día acordado, pasar los grupos piloto de E2 a autónoma desde la consola.
