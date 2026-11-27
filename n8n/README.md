# n8n · E1.5 (automatización asistida)

Flujos del motor de E1.5. Canal desde el 26/11: **Evolution API**, con envío automático. Desde el 27/11 el motor va **con agentes** ([`PLAN-agentico.md`](PLAN-agentico.md)): un Redactor escribe alrededor de un bloque de datos fijo, guardas en código y un Revisor (QA) aprueban, y si algo falla sale la plantilla de E1. No hay aprobación humana antes de cada mensaje; una persona entra con HUMANO, lo sensible o un error. Todo en **modo prueba** con el grupo del equipo hasta cerrar E1 y publicar el aviso v3 (qué se canceló con el cambio: §9 de [`GUIA-CONTINUACION.md`](GUIA-CONTINUACION.md); pruebas: [`PLAN-pruebas.md`](PLAN-pruebas.md)). Entrada: `E15-00 · Entrada` ([`motor/`](motor/)). Contrato y voz de los agentes: [`agentes/`](agentes/). Lógica y textos de E1 para los nodos Code: [`snippets/`](snippets/README.md). Relay en el servidor: [`relay/SPEC.md`](relay/SPEC.md).

**Nunca se exportan credenciales a esta carpeta.** El JSON solo referencia credenciales por nombre.

Historial: [`CHANGELOG.md`](CHANGELOG.md). Arreglos y pruebas pendientes de los flujos W0–W5: [`GUIA-CONTINUACION.md`](GUIA-CONTINUACION.md). Estado y riesgos: `.cowork/estado-e15-n8n.md` (local).

Para construir y probar, empieza por [`PLAN-construccion.md`](PLAN-construccion.md) y [`PLAN-agentico.md`](PLAN-agentico.md). `GUIA-IMPLEMENTACION.md` y `PROMPT-n8n-builder.md` describen la opción C (copiar y pegar) y quedan solo como historia.

## E15-01 · Voto mínimo (superado por E15-00 el 27/11)

> Se queda inactivo en la instancia como referencia. Lo que llega del grupo ahora lo lee `E15-00 · Entrada` directo de Evolution.


Formulario donde se pega el mensaje del grupo → `resolver` (número → `pid`) → interpreta el texto → `votar` o `evento`.

Entiende: `1` `2` `3` (también «opción 2», «la 2»), `TODAS`, `NINGUNA`, `ME APUNTO`, `NO PUEDO`, `LLEGUÉ`, `YA EN CASA`, `SALIR`.
**Escala sin llamar al backend** si el texto es `HUMANO`, está vacío, no se entiende o menciona salud, ubicación o emergencia (123).

### Importar y configurar

1. En n8n: **Workflows > Import from file** y elige `E15-01-voto-minimo.json`.
2. Crea dos credenciales de tipo **Custom Auth** (Credentials > Create). Pega la `MOTOR_KEY` tú misma en n8n; nunca en el chat ni en el repo.
   - `Sintonia MOTOR_KEY (qs)`: `{ "qs": { "key": "<MOTOR_KEY>" } }`
   - `Sintonia MOTOR_KEY (body)`: `{ "body": { "key": "<MOTOR_KEY>" } }`
3. Abre los nodos **Resolver pid** y **Registrar evento** y selecciona cada credencial (el JSON trae el nombre, pero el id hay que enlazarlo).
4. Si la página final del formulario no aparece, en el nodo **Mensaje del grupo** pon *Respond When* = **Workflow Finishes**.
5. Verifica que **Follow Redirects** esté activo en los tres nodos HTTP (Apps Script redirige).

### Probar (modo prueba, con el equipo)

1. Crea un grupo con `index.html?exp=E2&modo=prueba` y un plan en estado `votando` desde la consola.
2. **Execute Workflow** en n8n, abre la *Test URL* del formulario y pega: `grupo_id`, `plan_id`, tu número con +57 y el texto `2`.
3. Debe terminar en «Registrado: opción 2». Comprueba el voto en la consola.
4. Casos a probar: `NINGUNA`, `ME APUNTO`, un número que no es del grupo (→ «Número no reconocido»), `ayuda` (→ escalar), un texto raro (→ escalar), un plan sin publicar (→ `plan_no_votable`).

### Privacidad (reglas del handoff §5)

- El flujo no guarda ejecuciones (éxito ni error) y el parser no devuelve el texto original, nombres ni números.
- `votar` es pública y va sin clave. `resolver` y `evento` usan `MOTOR_KEY` por credencial.
- Si algo falla, se escala a una persona; el motor no responde solo.

### Pendiente

Propuesta y publicación con aprobación (`proponer_ia` → `publicar_plan` → `/opciones`), cierre, recordatorio y `/salida`, y pulso (E15-02 en adelante).

**15/11:** la consola de E1 cambió su mecánica (encuesta nativa, decisión por ronda, textos y relojes). Antes de corregir W0–W5, lee la §7 de [`GUIA-CONTINUACION.md`](GUIA-CONTINUACION.md) y [`ESTADO.md`](../ESTADO.md) §3.1.
