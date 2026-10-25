# n8n · E1.5 (automatización asistida)

Flujos del motor de E1.5. Canal: **opción C** (una persona copia y pega en el grupo). Todo en **modo prueba** hasta que Néstor apruebe el aviso de privacidad v2.

**Nunca se exportan credenciales a esta carpeta.** El JSON solo referencia credenciales por nombre.

Para ponerlo a andar paso a paso, empieza por [`GUIA-IMPLEMENTACION.md`](GUIA-IMPLEMENTACION.md).

## E15-01 · Voto mínimo

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
