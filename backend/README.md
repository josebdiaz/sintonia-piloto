# Backend · Google Apps Script

`Codigo_Piloto.gs` es el código completo del backend del piloto (E1 y E2). La versión está en el encabezado del archivo y en el tag `backend/vX.Y.Z`.

## Publicar una versión nueva

1. Abrir el proyecto de Apps Script del piloto y reemplazar todo el contenido de `Código.gs` por este archivo.
2. Guardar y correr **una vez** `probarMontaje` con ▶ Ejecutar (no con Depurar).
3. Implementar → Administrar implementaciones → editar (lápiz) la implementación actual → Versión: **Nueva versión** → Implementar.
   Así la URL `/exec` no cambia y no hay que tocar `piloto/assets/sintonia.js`.
4. Anotar en `CHANGELOG.md` la versión del código y el número de versión de la implementación.
5. Verificar: una acción nueva de esta versión no debe responder `accion_desconocida`.

## Propiedades del script

`SHEET_ID`, `ADMIN_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `PRICE_IN_PER_M`, `PRICE_OUT_PER_M`, `COSTO_HORA_HUMANA_COP` (opcional), `AVISO_VERSION`, `TOLERANCIA_MIN`.
Nunca se escriben en el código ni en este repositorio.

### Avisos por correo al equipo (`NOTIFICAR_A`)

- `NOTIFICAR_A`: uno o varios correos del equipo, **separados por coma** (por ejemplo `correo1@…,correo2@…`). Para que el monitor reciba los avisos, agrega su correo **aquí, en las propiedades del script** (Configuración del proyecto → Propiedades del script), no en el código: el repositorio es público.
- Qué llega: un correo cuando se inscribe un grupo, uno por cada aceptación nueva («Aceptó 1 persona más en «…»: 2 de 3», desde la 2.8.0) y uno cuando aceptan todos. Ninguno lleva nombres ni números de participantes.
- `AVISO_POR_ACEPTACION` (opcional, 2.8.0): `no` apaga el aviso por cada aceptación; los de inscripción y «ya aceptaron todos» siguen.
- Para probarlo: `probarMontaje()` manda un correo de prueba a `NOTIFICAR_A`.

## Historial

`git log --follow backend/Codigo_Piloto.gs` muestra cada versión. Las versiones 2.1.0 y 2.2.1 se reconstruyeron desde las copias de respaldo del equipo; la 2.2.0 no tiene copia propia (sus cambios están en 2.2.1).
