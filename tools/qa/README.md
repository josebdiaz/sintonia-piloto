# QA de punta a punta

Corre el **código real** del piloto: `backend/Codigo_Piloto.gs` y las páginas de `piloto/`. El backend no corre sobre Google Sheets. Corre sobre la hoja simulada de `backend/qa/qa_backend.js`, dentro de un servidor local. Todo usa **datos ficticios** y la clave de administración de la simulación. Nada toca el backend real, nada envía correos y nada queda en las hojas del piloto.

## Requisitos

- Node 18 o superior.
- Playwright con Chromium (`require('playwright')` tiene que funcionar).
- `axe-core` se instala solo la primera vez (`npm install` dentro de `tools/qa`).

## Uso

```bash
tools/qa/correr.sh todo            # backend + recorrido, consola, ola-a, auditoria-e2e, contraste, accesibilidad
tools/qa/correr.sh recorrido       # una sola prueba
```

Las capturas y los informes quedan en `tools/qa/salida/<prueba>/`, una carpeta que git ignora.

| Prueba | Qué revisa |
|---|---|
| `qa_backend` (en `backend/qa`) | Reglas del backend, como hojas, permisos y datos sensibles |
| `recorrido` | Los 2 planes de un grupo de punta a punta, de la inscripción a la encuesta de cierre |
| `consola` | Los pasos F0–F5 de la consola y los mensajes de `wa.me` sin emojis rotos |
| `ola-a` | Lo que entró en la 2.8.0: invitar al parche, el recordatorio a las 2 h, las fechas concretas y el plazo para confirmar |
| `auditoria-e2e` | Auditoría con hallazgos por gravedad (ALTA, MEDIA, BAJA) y `CONOCIDO` para lo que ya está en el plan. Los datos son «realistas»: precio en rango, zona compartida y dirección con «#» |
| `casos-borde` | Plazos límite, revocar el consentimiento, el panel solo con el piloto y la consola a 390 px |
| `contraste` | Contraste de texto (WCAG AA) en 6 páginas |
| `accesibilidad` | axe-core, orden de los títulos y áreas táctiles de 24 px, en escritorio y en celular |
| `capturas-deck` | **Sobrescribe** las imágenes de `docs/deck-onboarding-monitor/`. Úsala solo cuando cambie la consola |

## Cuándo correrlo

- Antes de subir una versión del frontend o del backend.
- Después de cualquier cambio en `piloto/` o en `Codigo_Piloto.gs`.
- No sirve como evidencia de usuarios: es una verificación técnica (n = 0 personas).

El servidor usa el puerto 8767. `correr.sh` lo libera antes de cada prueba.
