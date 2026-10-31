# Changelog · n8n E1.5

Formato: lo más reciente arriba. Fechas en hora de Bogotá.

## 31 oct 2026 · UX Writing v1

- E1.5-01: sinónimos de ME APUNTO, NO PUEDO y LLEGUÉ; «ayuda» como pedido de persona (salvo palabras sensibles); motivo `solo_emoji`. Probado con 17 casos fuera de n8n; falta probar en la instancia.
- PROMPT: textos de la biblioteca convergida, W3b (regla de cierre) y `/queda` para planes caídos.

## 30 oct 2026 (tarde) · Revisión nodo por nodo

- Revisados los 9 flujos. Bien: deduplicación con `e15_planes`, ramas de error, zona horaria, sin IA, sin claves en el JSON, credenciales del motor enlazadas.
- Bloqueantes: envío por Evolution API sin aprobación (contradice C9 y C12), `view=plan` sin `pid` en W2–W5, plantillas sin llenar en W1–W5, texto equivocado en W0, y W1 envía antes de publicar.
- Importantes: eventos inexistentes (`llegaron`, `en_casa`), E1.5-01 guarda ejecuciones y tiene datos fijados con un número.
- Nueva `GUIA-CONTINUACION.md` con los arreglos y 12 pruebas.

## 30 oct 2026 · Revisión de estado de la instancia

- Revisada la instancia `sintonia.app.n8n.cloud` (proyecto personal de Jose): **9 flujos**, **todos inactivos** (sin publicar) y **0 ejecuciones** de producción.
- Detectado: `E1.5-01 · Voto mínimo` quedó **sin** `saveDataSuccessExecution: none` ni `saveDataErrorExecution: none` y sin zona horaria. Los otros 8 flujos sí los tienen (`America/Bogota`).
- Detectado: los flujos W0–W5 y los dos sub-flujos **no están exportados al repo**. Solo `E15-01-voto-minimo.json` está en `n8n/`.
- Prueba gratuita de n8n: **9 días restantes** al 30/10 (vence hacia el 8 nov), 0 de 1.000 ejecuciones usadas.

## 24 oct 2026 (noche) · Flujos creados en n8n

Creados en la instancia entre las 21:22 y las 22:08 (hora de Bogotá), siguiendo `PROMPT-n8n-builder.md`:

| Flujo | Rol |
|---|---|
| `SW · Avisar revisor` | Sub-flujo: notifica a quien revisa |
| `SW · Enviar mensaje` | Sub-flujo: deja el texto final listo (marcador de posición, opción C) |
| `W0 · Ingreso` | `/ingreso` al crear el grupo |
| `W1 · Plan creado → opciones` | `proponer_ia` → revisión → `publicar_plan` → `/opciones` |
| `W2 · Recordatorio de voto` | Recordatorio único a las 2 h si faltan votos |
| `W3 · Cierre y salida` | `cerrar_plan` → `/confirmado` → `/salida` 2 h antes |
| `W4 · Día del plan` | `/checkpoint` y `/llegaron` |
| `W5 · En casa y pulso` | `/en_casa` y `/retro` |

Cambio frente al prompt: el sub-flujo único «Aprobar y pegar» quedó dividido en **dos** (`Avisar revisor` y `Enviar mensaje`).

## 24 oct 2026 · Diseño y primer flujo

- **Decisión de canal** (`.cowork/decisiones-p7.md` §9, C9–C13): E1.5 corre con la **opción C** (automatización asistida: una persona copia y pega). La API de grupos de Meta queda como fase posterior. El número mexicano de la app no se toca. Pasarelas no oficiales descartadas. n8n sin MCP.
- `E15-01-voto-minimo.json`: formulario → `resolver` → interpretar texto → `votar` o `evento`. Escala si el mensaje no se entiende o es sensible. Parser probado con 18 casos en local. **Sin probar contra el backend.**
- `GUIA-IMPLEMENTACION.md`: puesta en marcha en 5 pasos.
- `PROMPT-n8n-builder.md`: prompt para el constructor de IA de n8n, que mapea los 8 cuadros del storyboard M2 a W0–W5 más un sub-flujo.
- `README.md` de la carpeta `n8n/`.
