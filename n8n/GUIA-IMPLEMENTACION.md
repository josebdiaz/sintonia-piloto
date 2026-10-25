# Guía rápida · Poner a andar E1.5 en n8n

**Canal:** opción C. n8n interpreta y una persona copia y pega en el grupo (ver `.cowork/decisiones-p7.md` §9).
**Alcance:** solo modo prueba con el equipo. Tiempo: unos 20 minutos.

## Antes de empezar

- Cuenta de n8n creada.
- `MOTOR_KEY` puesta por Jose en las propiedades del script de Apps Script (distinta de `ADMIN_KEY`, de 20 caracteres o más). **Nunca la escribas en el chat.**
- Un grupo de prueba creado con `index.html?exp=E2&modo=prueba` y un plan en estado `votando` desde la consola.

## Paso 1 · Credenciales (5 min)

En n8n: **Credentials > Create credential > Custom Auth**. Crea dos, con estos nombres exactos:

| Nombre | Contenido |
|---|---|
| `Sintonia MOTOR_KEY (qs)` | `{ "qs": { "key": "TU_MOTOR_KEY" } }` |
| `Sintonia MOTOR_KEY (body)` | `{ "body": { "key": "TU_MOTOR_KEY" } }` |

Reemplaza `TU_MOTOR_KEY` por la clave real, solo aquí.

## Paso 2 · Importar el flujo (2 min)

**Workflows > Import from file** y elige `n8n/E15-01-voto-minimo.json`.

## Paso 3 · Enlazar las credenciales (3 min)

Abre cada nodo y selecciona la credencial:

- **Resolver pid** → `Sintonia MOTOR_KEY (qs)`
- **Registrar evento** → `Sintonia MOTOR_KEY (body)`

En los tres nodos HTTP (**Resolver pid**, **Votar**, **Registrar evento**), comprueba que **Follow Redirects** esté activo: Apps Script redirige.

## Paso 4 · Probar (5 min)

1. Pulsa **Execute Workflow** y abre la *Test URL* del formulario.
2. Llena `grupo_id`, `plan_id`, un número del grupo con +57 y el texto `2`.
3. Resultado esperado: «Registrado: opción 2». Verifica el voto en la consola.

| Prueba | Resultado esperado |
|---|---|
| `NINGUNA` | Registrado como veto |
| `ME APUNTO` | Evento registrado |
| Número que no es del grupo | «Número no reconocido» |
| `ayuda` o un texto raro | «Escalar a una persona» (no llama al backend) |
| Plan sin publicar | «El plan no está en votación» |

## Paso 5 · Usarlo en el ensayo

1. Alguien del equipo lee el mensaje en el grupo y lo pega en el formulario.
2. **Abre «Mago in» en la consola mientras lo haces**: esos minutos son los humanos de E1.5.
3. Si el flujo falla, usa «Pasar al mago» en la consola.

## Si algo falla

| Síntoma | Qué revisar |
|---|---|
| `no_autorizado` | La credencial: clave mal pegada o `MOTOR_KEY` no configurada en Apps Script |
| No aparece la página final | En **Mensaje del grupo**, *Respond When* = **Workflow Finishes** |
| Error de red o respuesta vacía | **Follow Redirects** activo; URL del backend en el nodo **Config** |
| `no_miembro` con un número correcto | Se comparan los últimos 10 dígitos; confirma que el número esté en `contactos` del grupo activo |

## Reglas que siguen vigentes

- Todo mensaje al grupo lo revisa una persona antes de enviarse.
- No se guardan nombres, números ni mensajes completos; este flujo no guarda ejecuciones.
- Nunca se exportan credenciales al repo.
- Con datos reales, solo después de que Néstor apruebe el aviso de privacidad v2.

## Siguiente

Propuesta y publicación con aprobación (`proponer_ia` → `publicar_plan` → `/opciones`), luego cierre, recordatorio, `/salida` y pulso.
