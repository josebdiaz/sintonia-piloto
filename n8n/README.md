# n8n · E1.5 (automatización asistida)

Flujos del motor de E1.5. Canal: **opción C** (una persona copia y pega en el grupo). Todo en **modo prueba** hasta que Néstor apruebe el aviso de privacidad v2.

**Nunca se exportan credenciales a esta carpeta.** El JSON solo referencia credenciales por nombre.

Historial: [`CHANGELOG.md`](CHANGELOG.md). Arreglos y pruebas pendientes de los flujos W0–W5: [`GUIA-CONTINUACION.md`](GUIA-CONTINUACION.md). Estado y riesgos: `.cowork/estado-e15-n8n.md` (local).

Para ponerlo a andar paso a paso, empieza por [`GUIA-IMPLEMENTACION.md`](GUIA-IMPLEMENTACION.md). Para generar el recorrido completo del storyboard con el constructor de IA de n8n, usa [`PROMPT-n8n-builder.md`](PROMPT-n8n-builder.md).

## E15-01 · Voto mínimo

Formulario donde se pega el mensaje del grupo → `resolver` (número → `pid`) → interpreta el texto → `votar` o `evento`.

Entiende: `1` `2` `3` (también «opción 2», «la 2»), `TODAS`, `NINGUNA`, `ME APUNTO`, `NO PUEDO`, `LLEGUÉ`, `YA EN CASA`, `SALIR`.
Sinónimos aceptados (frase completa, sin tildes ni mayúsculas): para `ME APUNTO`, «voy», «sí voy», «yo voy», «me sumo», «cuenta conmigo», «cuenten conmigo», «ahí estaré», «allá estaré», «apúntame», «listo, voy»; para `NO PUEDO`, «no puedo ese día», «no puedo ir», «no voy», «esta vez no», «no alcanzo», «no me queda», «paso»; para `LLEGUÉ`, «ya llegué», «ya estoy», «ya estoy aquí», «aquí estoy». Lo ambiguo («voy tarde», «no sé si pueda») se escala.
**Escala sin llamar al backend** si el texto pide una persona (`HUMANO`, «ayuda», «necesito ayuda…»: motivo `pidio_humano`), está vacío, es solo un emoji (motivo `solo_emoji`; un emoji nunca cuenta como respuesta), no se entiende o menciona salud, ubicación o emergencia (123; motivo `sensible`, que tiene prioridad sobre «ayuda»).

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
