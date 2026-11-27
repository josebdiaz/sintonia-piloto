# Prueba de punta a punta del motor E1.5 · guía (27/11/2026)

> Recorrido completo de un plan en el grupo del equipo: ingreso → opciones → voto → confirmado → salida → día del plan → en casa → encuesta de cierre. Capas P4 y P5 de [`PLAN-pruebas.md`](PLAN-pruebas.md). Verificación técnica (n = 0), nunca con personas reales.

## 0. En corto: hoy no se puede correr

Hoy solo funciona la **entrada**: `E15-00` registra lo que llega, pero no le contesta al grupo ni le escribe al backend. Para correr el recorrido completo faltan piezas en tres niveles:

| Nivel | Qué cubre | Qué falta | Cuándo |
|---|---|---|---|
| **Ruta A · con plantillas** | Pasos 1–6 con los textos de E1, sin agentes. Prueba el cableado: disparadores, backend, envío, relojes, duplicados | §1, salvo los agentes | Se puede preparar ya |
| **Ruta B · con agentes** | Lo mismo, con `SW · Redactar` delante del envío | Ruta A + `prueba.P2` (credenciales de los modelos) | Con el pendiente 45, después de que E1 esté en ejecución |
| **Continuidad** | Pasos 7–8 (día del plan, en casa, encuesta de cierre) | `view=motor` en el backend (`n8n.N27`) | Después del congelamiento |

**Recomendación:** primero `prueba.P1` (entrada, [`PRUEBA-P1.md`](PRUEBA-P1.md)), luego la Ruta A y la Ruta B cuando el pendiente 45 se retome. Así, si algo falla en B, ya se sabe que el cableado funciona y el problema está en los agentes.

## 1. Lo que hay que tener antes (Ruta A)

| # | Qué | Quién | Estado (27/11) |
|---|---|---|---|
| 1.1 | `prueba.P1` pasó | José y Claude | Lista para correr |
| 1.2 | `E15-00` conectado al backend: un voto llama `votar` y un evento llama `evento`, con `req_id` (`n8n.N20`). Hoy solo registra | Claude | **Falta** |
| 1.3 | W0, W1 y W3 con los textos de la consola 2.16.0 (`n8n.N2`, `n8n.N17`, `n8n.N14`), sin corchetes (`n8n.N3`) y con `req_id` (`n8n.N20`) | Claude | **Falta** (el revisor halla 5 bloqueos) |
| 1.4 | `SW · Enviar` v2 con la credencial de Evolution enlazada, reintentos y freno de corchetes | Claude; José enlaza la credencial | **Falta** |
| 1.5 | W2 con relojes cortos para el grupo en modo prueba (`n8n.N23`): 2 min en vez de 2 h | Claude | **Falta** |
| 1.6 | La bienvenida de E1.5 elegida (pendiente 46) | Equipo | **Falta** |
| 1.7 | Verificador independiente sobre W0, W1, W3 y `SW · Enviar` sin bloqueos (§7.3 de `PLAN-construccion.md`) | Otra sesión de Claude | **Falta** |
| 1.8 | Grupo del equipo creado en la consola con `index.html?exp=E2&modo=prueba`, y los miembros (solo el equipo) inscritos y con el aviso aceptado | Equipo | Por hacer |
| 1.9 | Grupo de WhatsApp del equipo con el número de Sintonía, creado por una persona, como en E1 (`n8n.N16`) | José | ✓ (es el de `prueba.P1`) |

Para la Ruta B se suman: credenciales de Anthropic y OpenAI, `SW · Redactar` construido y `prueba.P2` aprobada.

## 2. El recorrido, paso a paso

Hay dos tipos de disparador: un **formulario de n8n** que llena una persona del equipo (la operación, igual que el mago en E1) y un **reloj** que corre solo cada 15 minutos (2 en modo prueba). Lo que escribe el grupo entra siempre por `E15-00`.

| Paso | Quién lo dispara | Cómo | Qué debe pasar en el grupo | Qué revisa Claude |
|---|---|---|---|---|
| **1 · Ingreso** | Evolution, cuando el número entra al grupo | Evento de participantes de Evolution → E15-00 lee el código del grupo en la descripción y llama a W0. Hoy, mientras se construye: formulario «Grupo creado» | La bienvenida de E1.5, una vez | Que salió una sola vez y con el enlace del aviso |
| **2 · Opciones** | El motor, después de la bienvenida | W1 crea el plan, elige las fechas (`SINTONIA.fechasPlan`) y llama `proponer_ia`. **Necesita backend** (§5); mientras tanto: el plan se crea en la consola y el formulario «Plan creado» trae las fechas | `/opciones`, las 3 opciones y la encuesta, en ese orden. El plan pasa a `votando` | Mismo texto que daría la consola 2.16.0; `publicar_plan` antes de que alguien vote (`n8n.B5`); nada con corchetes |
| **3 · Votos** | El grupo | Votar en la encuesta, o escribir «1», «2», «3», «TODAS», «NINGUNA» | Nada (el motor no contesta votos) | Una fila por voto en `e15_entrada` y el voto en la consola. Un voto repetido no duplica |
| **4 · Recordatorio** | Reloj (W2) | Esperar 2 minutos sin que voten todos | `/recordatorio` con «Van X de Y votos» | Que no sale si ya votaron todos (`n8n.N15`) ni dos veces |
| **5 · Confirmado** | El motor, cuando votaron todos o se vence el plazo | W3 cuenta los votos que registra E15-00, decide (empate → `/empate`; ninguna → ronda 2) y llama `cerrar_plan` con la opción, la fecha votada y la hora de la opción | Los tres mensajes de `/confirmado` y el evento del grupo | Plan `cerrado` en la consola con hora y `decision` (`n8n.N1`, `n8n.N21`); mismo título y precio que en las opciones |
| **6 · Salida** | Reloj (W3) | Poner el encuentro a 2 h + 5 min; en modo prueba, la espera se acorta | `/salida` con la hora sugerida | Que no sale antes del plazo para confirmar (`n8n.N13`) |
| **7 · Día del plan** | Reloj (W4) | — | `/hoy`, `/checkpoint` y «Ya estamos todos» | **Bloqueado** por `n8n.N27`: el motor no puede saber quién llegó |
| **8 · En casa y cierre** | Reloj (W5) | — | `/en_casa` y `/retro` con enlace personal | **Bloqueado** por `n8n.N27` |
| **En cualquier paso** | El grupo | Escribir «HUMANO» | Nada del motor; aviso a la persona del equipo | Que el motor no responde ahí y que el aviso llega |

## 3. Cómo se corre (Ruta A)

1. Dile a Claude: «empiezo E2E a las HH:MM». Solo una sesión ejecuta en n8n y manda al grupo.
2. Haz los pasos 1 a 6 en orden. Después de cada uno, espera a que Claude diga «paso N ✓» antes de seguir.
3. En la mitad del paso 3, escribe «HUMANO» una vez.
4. Al terminar, Claude revisa `e15_entrada`, la consola y las ejecuciones de n8n, y deja el resultado en `CHANGELOG.md` con «n = 0».

**Listo cuando** (`prueba.P4`): cada mensaje sale en el momento en que lo daría la consola 2.16.0, con datos idénticos al backend, sin corchetes y sin duplicados, y HUMANO escala sin respuesta del motor. Con la Ruta B, además, cada mensaje tiene su fila en `e15_mensajes`.

## 5. Sin formularios: lo que reemplaza las tareas del equipo (decisión de José, 27/11)

Lo automatizado reemplaza las tareas que hoy hace una persona del equipo en E1.5. Solo quedan en manos de una persona **crear el grupo de WhatsApp** (WhatsApp no deja agregar a quien no es contacto, `n8n.N16`) y **HUMANO y lo sensible**.

| Tarea | Disparador automático | Qué hace falta | ¿Toca el backend? |
|---|---|---|---|
| Bienvenida | Evolution avisa que el número entró a un grupo | Activar el evento de participantes en Evolution; quien crea el grupo pone el código del grupo de la consola en la **descripción** del grupo de WhatsApp (decisión de José, 27/11; es parte de crearlo); tabla `e15_grupos` (JID → `grupo_id`) | No |
| Votos y eventos al backend | Cada mensaje (E15-00) | `e15_grupos` para saber el `grupo_id`; `view=resolver` (número → `pid`, ya permitido al motor) y `votar` / `evento` con `req_id` | No |
| Crear el plan | Después de la bienvenida | `crear_plan` en la lista de acciones del motor (`MOTOR_ACCIONES`, una línea) | **Sí** |
| Fechas con más coincidencias | Al crear el plan | Disponibilidad por persona: `view=motor` (`n8n.N27`) | **Sí** |
| Cerrar la votación | Votaron todos o se venció el plazo (reloj) | Conteos desde E15-00; `cerrar_plan` ya está permitido | No |
| Recordatorio, `/salida`, `/hoy`, llegadas, `/en_casa`, `/retro` | Relojes de E1 (`n8n.N5`) | `view=motor` para llegadas y enlaces personales | Sí, solo `view=motor` |

**Formularios temporales (decisión de José, 27/11: Ruta A solo si se integran al backend después del congelamiento).** Se cumple con una regla de construcción: cada flujo tiene **dos entradas que llegan al mismo nodo «Normalizar entrada»**, el formulario temporal y el disparador automático, y todo lo que sigue es igual. Al abrir el backend se apaga el formulario y no se reescribe nada.

| Flujo | Formulario temporal | Lo reemplaza | Cuándo |
|---|---|---|---|
| W0 | «Grupo creado» | Evento de participantes de Evolution + `e15_grupos` | Ya (no toca el backend) |
| W1 | «Plan creado» (`plan_id`, `fechas`) | `crear_plan` por el motor + `view=motor` | Después del congelamiento (pendiente 37) |
| W3 | «Cerrar plan» | Cierre por votos o plazo | Ya (no toca el backend) |

**Orden:** primero lo que no toca el backend (bienvenida automática, votos al backend, cierre automático). Los dos cambios de backend (`crear_plan` para el motor y `view=motor`) van juntos en un backend nuevo después del congelamiento; mientras tanto, crear el plan sigue en la consola y es la única tarea que no se automatiza todavía.

## 4. Si algo falla

- No repitas el paso enseguida: un reintento a mano puede duplicar mensajes en el grupo.
- Claude dice qué nodo falló y por qué, lo corrige en el repo, pasa las pruebas sin red (`prueba.P0`) y vuelve a importar. Se repite solo ese paso, con un plan nuevo si el anterior quedó a medias.
- Si algo raro sale al grupo, se apaga el flujo que lo mandó y se avisa en el grupo con un mensaje escrito a mano por una persona.
