# Guía de continuación · Setup y pruebas de E1.5 en n8n

> Basada en la revisión nodo por nodo de los 9 flujos en `sintonia.app.n8n.cloud` (30 oct 2026).
> Complementa `GUIA-IMPLEMENTACION.md` (E1.5-01) y `.cowork/estado-e15-n8n.md`.

## 1. Veredicto

La estructura es buena: deduplicación con la tabla `e15_planes`, ramas de error que avisan a quien revisa, zona horaria de Cali, sin nodos de IA, sin claves en el JSON, y credenciales del motor enlazadas. **Pero hoy ningún flujo, salvo E1.5-01, puede funcionar.** Hay 5 bloqueantes. Uno de ellos es de diseño y hay que decidirlo antes de tocar nada (§2).

## 2. Decisión previa: el canal de salida

Los dos sub-flujos (`SW · Enviar mensaje` y `SW · Avisar revisor`) publican **directo en WhatsApp con Evolution API**, sin aprobación humana. Eso contradice dos cosas ya decididas:

- **C9 y C12** (`.cowork/decisiones-p7.md` §9): opción C, con una persona que copia y pega, y pasarelas no oficiales descartadas.
- **La regla 1 del motor:** aprobación humana antes de todo mensaje.

Además, Evolution no está configurado: el host es `https://EVOLUTION_HOST`, la instancia es `INSTANCIA` y no hay credencial enlazada.

**Recomendación: volver a la opción C.** Es lo decidido, no requiere servidor propio y no arriesga el número que comparten E1 y E1.5. Si el equipo prefiere Evolution, hay que reabrir C12 por escrito y con Néstor (términos de WhatsApp, aviso v2), y aun así agregar la aprobación.

El resto de esta guía asume la opción C.

## 3. Hallazgos

### Bloqueantes

| # | Dónde | Problema | Arreglo |
|---|---|---|---|
| B1 | SW · Enviar mensaje, SW · Avisar revisor | Envían por Evolution sin aprobación (§2) | §4.2: rediseño con «enviar y esperar respuesta» |
| B2 | W2, W3 (×2), W4, W5 · nodos `Ver plan` | Llaman `view=plan` **sin `pid`**. El backend exige `pid` y responderá siempre `no_miembro` | Agregar el parámetro `pid` = `pid_organizador` de la fila de `e15_planes` (§4.3) |
| B3 | W1–W5 · nodo `Textos` | Las plantillas siguen como `<__PLACEHOLDER_VALUE__…>`: se enviaría ese texto literal | Pegar los textos exactos (§4.4) |
| B4 | W0 · `Textos` | `plantilla_ingreso` contiene por error la pregunta «¿Con qué servicio debe el sub-flujo…» | Reemplazar por el texto de `/ingreso` (§4.4) |
| B5 | W1 | Envía `/opciones` al grupo **antes** de `publicar_plan`. Si alguien vota antes de que se publique, el voto falla (`plan_no_votable`), y si publicar falla, el grupo ya recibió opciones | Nuevo orden: aprobar → `publicar_plan` → pegar → `evento msg_opciones` (§4.5) |

### Importantes

| # | Dónde | Problema | Arreglo |
|---|---|---|---|
| I1 | W4 `/llegaron`, W5 `/en_casa` | Usan `evento_msg` = `llegaron` y `en_casa`, que no existen en el backend (`tipo_invalido`). Cada envío dispararía el aviso «evento no registrado» | Dejar `evento_msg` vacío en esos dos pasos, como ya está en `/checkpoint` |
| I2 | E1.5-01 · Settings | Guarda ejecuciones y no tiene zona horaria | *Settings*: no guardar ejecuciones (éxito, error y manuales); zona `America/Bogota` |
| I3 | E1.5-01 · nodo `Interpretar texto` | Tiene **datos fijados (pin)** con `wa`, el número de alguien, guardados en el flujo | Quitar el pin (clic derecho en el nodo → *Unpin*) |
| I4 | W3 | La página de confirmación del cierre corre en paralelo con el cierre: informa, pero no detiene nada | Aceptable, porque el formulario de cierre ya es la decisión humana. La aprobación del texto de `/confirmado` va en SW · Aprobar |
| I5 | W3 · `Ver plan` | Consulta el plan antes de buscar la fila en la tabla, así que no tiene `pid` | Mover `Buscar plan en tabla` antes de `Ver plan`, o agregar `pid_organizador` al formulario |

### Menores (verificar en la prueba)

| # | Dónde | Detalle |
|---|---|---|
| M1 | E1.5-01 (3 nodos HTTP), W5 `Ver plan` | La opción de redirecciones quedó vacía. Por defecto n8n sigue redirecciones, pero confírmalo en la primera prueba. Si falla, activa **Follow Redirects** |
| M2 | Varias ramas «no» sin conectar (W1 `¿Plan sin publicar?`, W3 `¿Aún sin confirmar?`) | Se detienen en silencio. Está bien para evitar duplicados, pero conviene un aviso a quien revisa |
| M3 | Campo `grupo_wa` (JID del grupo) | Con la opción C ya no hace falta. Se puede dejar o quitar |

## 4. Arreglos, paso a paso

### 4.1 Limpieza (10 min)

1. E1.5-01: arreglar I2 e I3.
2. Descargar los 9 flujos (*… → Download*) a `n8n/` en el repo, antes de cambiar nada, como respaldo.

### 4.2 Rediseño de los sub-flujos (opción C)

Divide el envío en dos sub-flujos, para que la aprobación ocurra **antes** de las llamadas que cambian el estado del plan (`publicar_plan`):

**SW · Aprobar mensaje** (nuevo)
- Entrada: `paso`, `texto`, `plan_id`.
- Nodo **Telegram → Send and Wait for Response**, con respuesta *Custom Form*: campos `decision` (Aprobar, Editar, Rechazar) y `texto_final` (prellenado con `texto`). Límite de espera: 6 h.
- Salida: `{ decision, texto_final }`. Si vence el plazo, `decision = vencido`.

**SW · Enviar mensaje** (reemplaza a Evolution, opción C)
- Entrada: `paso`, `texto_final`, `plan_id`, `evento_msg`.
- Nodo **Telegram → Send Message** a quien revisa, con el texto listo para copiar.
- Nodo **Telegram → Send and Wait for Response** (*Approval*): «Ya lo pegué en el grupo».
- Al confirmar, y si hay `evento_msg`, llamar `evento`. Se conservan las ramas de error actuales.
- Salida: `{ ok: true }` (se mantiene la interfaz que ya usan W0–W5).

**SW · Avisar revisor**: cambiar el nodo Evolution por **Telegram → Send Message**.

Requiere crear en n8n una credencial de Telegram (token del bot, que se crea con @BotFather) y anotar el `chat_id` de quien revisa en `Config`. No pegues el token en el chat.

Esto decide Q4 (canal: Telegram). Si se prefiere otro canal, cambian solo estos nodos. Recuerda que Telegram debe aparecer como encargado en el aviso v2.

> Verificar al construir: que el nodo Telegram de tu versión de n8n tenga la operación *Send and Wait for Response*. La tienen los nodos de mensajería recientes. Si no la tiene, usa un nodo **Wait** con *On Form Submitted* y envía el enlace del formulario por Telegram.

### 4.3 Corregir `view=plan` (B2, I5)

En cada nodo `Ver plan`, agrega el parámetro de consulta `pid`:

| Flujo | Valor |
|---|---|
| W2, W4, W5 | `={{ $json.pid_organizador }}` (sale de la fila de `e15_planes`) |
| W3 · `Ver plan` | Mover `Buscar plan en tabla` antes de este nodo y usar `={{ $('Buscar plan en tabla').first().json.pid_organizador }}` |
| W3 · `Ver plan antes de salida` | `={{ $('Releer plan en tabla').first().json.pid_organizador }}` |

Antes, comprueba que `e15_planes` tenga la columna `pid_organizador` con datos. W1 la guarda.

### 4.4 Textos (B3, B4)

Copia en cada nodo `Textos` el texto exacto de `PROMPT-n8n-builder.md` (sección *Message texts*), que es idéntico a la consola. Revisa que los marcadores que usa el código de cada flujo coincidan con los del texto. Por ejemplo, W1 reemplaza `{opciones}`, `{plan_1}`, `{lugar_1}`…

| Flujo | Plantillas |
|---|---|
| W0 | `/ingreso` |
| W1 | `/opciones` (usar `{opciones}` donde va la lista) |
| W2 | `/recordatorio` (versión de grupo, con el número de votos que faltan) |
| W3 | `/confirmado`, `/salida` |
| W4 | `/checkpoint`, `/llegaron` |
| W5 | `/en_casa`, `/retro` |

### 4.5 Nuevo orden de W1 (B5)

`Plan creado` → `Buscar plan` → `proponer_ia` → `Normalizar opciones` → `Armar texto /opciones` → **SW · Aprobar mensaje** → (si aprueba) `Guardar plan` → **`publicar_plan`** → (si `ok`) **SW · Enviar mensaje** (`evento_msg = msg_opciones`).

Si rechaza: avisar «usa Pasar al mago o vuelve a disparar W1».

En W0, W2, W3, W4 y W5 el patrón es el mismo: `Textos` → SW · Aprobar → SW · Enviar.

### 4.6 Eventos (I1)

W4 `Enviar /llegaron` y W5 `Enviar /en_casa`: `evento_msg` vacío.

## 5. Plan de pruebas

Siempre con un grupo `index.html?exp=E2&modo=prueba` y el equipo. Abre **«Mago in»** en la consola durante cada prueba: esos son los minutos humanos de E1.5.

### 5.1 Pruebas por flujo (manuales, con *Execute workflow*)

| # | Flujo | Prueba | Resultado esperado |
|---|---|---|---|
| T1 | E1.5-01 | Pegar `2` con un número del grupo | «Registrado: opción 2» y voto en la consola |
| T2 | E1.5-01 | `NINGUNA`, `ME APUNTO`, número ajeno, `ayuda` | Veto, evento, «Número no reconocido» y escalar |
| T3 | SW · Aprobar | Llamarlo con un texto de prueba | Llega a Telegram, y Aprobar, Editar y Rechazar devuelven lo correcto |
| T4 | SW · Enviar | `evento_msg = msg_opciones` con un `plan_id` de prueba | Texto en Telegram; tras «Ya lo pegué», el evento aparece en la consola |
| T5 | W1 | Disparar con un plan en borrador | Opciones del inventario → aprobar → plan en `votando` → texto para pegar |
| T6 | W1 | Disparar dos veces el mismo plan | La segunda vez no hace nada (deduplicación) |
| T7 | W1 | Rechazar en la aprobación | No se publica y no se registra nada |
| T8 | W2 | Ajustar temporalmente la espera a 5 min | Un solo recordatorio, y no se repite en la siguiente corrida |
| T9 | W3 | Cerrar con fecha a 2 h + 10 min | `/confirmado` y, a los 10 min, `/salida` |
| T10 | W3 | «Se cayó» con causa `lluvia` | Plan `caido` en la consola; nada al grupo; W2, W4 y W5 no lo tocan |
| T11 | W4 | Plan con hora de encuentro = ahora | `/checkpoint`; con todos en LLEGUÉ (vía E1.5-01), `/llegaron` |
| T12 | W5 | Plan con encuentro hace 3 h | `/en_casa`; `/retro` al día siguiente a las 10:00 (o ajustar la hora para probar) |

Para T8–T12, ejecuta los flujos programados con *Execute workflow* en vez de activarlos, y devuelve los tiempos a su valor real al terminar.

### 5.2 Ensayo completo

W0 → W1 → votos con E1.5-01 → W2 → W3 → W4 → W5. Luego el plan 2 en el mismo grupo. Registra para cada plan:

- minutos de «Mago in»;
- mensajes aprobados, editados y rechazados;
- fallas y uso de «Pasar al mago».

### 5.3 Activar

Solo después del ensayo: publicar W2, W4 y W5, que son programados. Los flujos con formulario funcionan con la *Production URL* una vez publicados. Revisa la pestaña *Executions* el primer día.

## 6. Listo cuando

- [ ] §2 decidido y registrado en `decisiones-p7.md`.
- [ ] B1–B5 e I1–I3 corregidos.
- [ ] T1–T12 pasan.
- [ ] Ensayo de 2 planes completo, con «Mago in» medido.
- [ ] Los 9 flujos (más el nuevo SW · Aprobar) exportados sin credenciales a `n8n/` y revisados.
- [ ] Aviso v2 aprobado por Néstor (n8n y Telegram como encargados) antes de usar datos reales.
- [ ] Plan de n8n definido antes del fin de la prueba gratuita (cerca del 8 nov).

## 7. Actualización del 15/11 · lo que cambió en E1 (consola 2.4.0 → 2.7.0) y obliga a cambiar E1.5

Resumen en [`ESTADO.md`](../ESTADO.md) §3.1. Sin estos ajustes, E1.5 corre, pero el grupo vive otra mecánica que en E1 y la comparación deja de ser justa.

1. **Votación con encuesta nativa de WhatsApp (N1).** En E1 el grupo vota en la encuesta (Adjuntar → Encuesta, varias respuestas) y el mago copia los conteos de «Ver votos». En E1.5:
   - W1 manda `/opciones`, `/opcion_1…3` y la encuesta (pregunta y opciones, cada una para copiar) a quien revisa.
   - El formulario de W3 pide los conteos (votos por opción, «Cualquiera», «Ninguna», votaron X de Y) y llama `cerrar_plan` con `decision: { votaron, total, votos:[…], cualquiera, ninguna }`. Así E1.5 también deja filas en `decisiones`.
   - E1.5-01 (voto escrito) queda para SALIR, HUMANO y mensajes sueltos.
2. **Textos (N2).** La fuente es la lista `TPL` de `piloto/mago.html` (2.7.0), no la sección *Message texts* de `PROMPT-n8n-builder.md`, que quedó desactualizada.
3. **Sin corchetes (N3).** Antes de «Ya lo pegué», SW · Enviar revisa `/\[[^\]\n]{1,30}\]/`. Si encuentra uno, vuelve a SW · Aprobar con el aviso «Completa [n] antes de enviar». Es la misma regla que la consola.
4. **Eventos (N4).** En lugar de `evento_msg` vacío (I1): W4 usa `msg_checkpoint` y `msg_todos`; W5 usa `msg_en_casa`. Nuevo paso `/hoy` en la mañana del plan con `msg_hoy`. Si no se sabe cuántos se apuntaron, `/hoy` va sin conteo.
5. **Relojes (N5).** Recordatorio 2 h después de publicar · `/salida` 2 h antes · checkpoint a la hora · `/en_casa` y pulso 3 h después; si el encuentro es desde las 8:00 p. m., al día siguiente a las 10:00. Ajustar W5, que hoy manda siempre `/retro` al día siguiente.
6. **Pulso por persona (N6).** `/retro` al grupo va sin enlace. W5 entrega en Telegram un enlace `wa.me` por persona con su texto y su enlace de `retro.html?pid=…&plan_id=…`.
7. **Ronda 2 de opciones (N7).** Desde el backend 2.7.1 el motor puede llamar `reabrir_opciones` con `MOTOR_KEY` (solo en planes de E1.5; manda `decision` con los conteos y `resultado: 'ninguna'` o `'mas_opciones'`). Falta deduplicar `e15_planes` por `plan_id` + ronda para que W1 vuelva a proponer.
8. **Paradas completas (N8).** «Normalizar opciones» conserva `tipo` y, por parada, `direccion`, `macro_zona`, `latitud` y `longitud`.
9. **Medición (N10, N11).** E1 y E1.5 se comparan con los minutos de «Mago in» (abrirlo durante toda revisión en Telegram). `medicion_consola` mide solo el tiempo en la consola. El NASA-TLX de quien revisa sí es comparable; el SUS de E1.5 está por decidir.

Agregar a §5.1:

| # | Flujo | Prueba | Resultado esperado |
|---|---|---|---|
| T13 | W3 | Cerrar con conteos [1, 2, 0] | Fila en `decisiones` con `votos_opciones = [1,2,0]` |
| T14 | SW · Enviar | Texto con `[n]` | No se envía; vuelve a aprobación |
| T15 | W1 | «Pedir más opciones» y volver a disparar | Ronda 2 publicada; el plan no queda caído |
| T16 | W5 | Plan a las 8:00 p. m. | `/en_casa` y pulso al día siguiente a las 10:00 |


## 8. Actualización del 26/11 · lo que cambió en E1 (2.8.0 → 2.16.0) frente a los flujos

> Revisión hecha sobre el respaldo del 3/11 (`_archivo-2026-11-24/sintonia-n8n-flujos-2026-11-03.json`) más los arreglos del 3/11 en la noche que registra `CHANGELOG.md`. **Primero exportar los 9 flujos actuales a `n8n/`** (pendiente desde el 3/11) y confirmar contra esa copia.
> Severidad como en `ESTADO.md` §3.1: **Bloquea** · **Validez** · **Ajuste**. N1–N11 (§7) siguen abiertos; esto se suma.

### 8.1 Lo que no hay que tocar

Lo que E1 cambió **en el backend** ya aplica a E1.5, porque los dos pasan por Apps Script: frases sensibles omitidas (2.8.1), aviso por cada aceptación (2.8.0), disponibilidad por persona (2.9.1), cupo y lista de espera (2.9.0), `AVISO_VERSION` v2 (2.9.2), títulos de Gemini cortados a 30 caracteres (2.8.1) y `wtp` por persona y plan (2.10.0).

### 8.2 Lo que falta o cambia

| # | Cambio en E1 | Qué hace hoy el flujo | Acción | Sev. |
|---|---|---|---|---|
| N12 | **Fechas concretas** (2.8.0, 2.10.0, 2.14.0): cada persona marca días; la consola elige las 4 fechas con más coincidencias, las manda a `proponer_ia` y, si hay más de una, agrega la encuesta «¿Qué día?» | W1 llama `proponer_ia` solo con `plan_id` (el backend acepta `fechas` y `restricciones`); `/opciones` no dice la fecha; no hay «¿Qué día?» | Portar la elección de las 4 fechas desde `piloto/mago.html`; W1 envía `fechas`; agrega «¿Qué día?» cuando hay más de una; el formulario de W3 pide la fecha votada | **Validez** |
| N13 | **Plazo para confirmar** (2.8.0 y G1 de 2.8.1): más de 24 h → víspera 6:00 p. m.; 4–24 h → 2 h antes; menos de 4 h → «marquen si van ahora». Sin plazo cumplido no salen `/hoy` ni `/salida` | W3 manda `/confirmado` sin plazo y programa `/salida` sin mirarlo | Portar `plazoDe`, `plazoFrase` y `plazoTxt` (`mago.html`) a W3; W3 y W4 respetan el plazo | **Validez** |
| N14 | **Opciones en 4 líneas con un solo precio** (2.8.0, G2 de 2.8.1): título, qué harán, dónde (zona una vez) con «aprox. $X por persona» (punto medio redondeado a miles) y Maps corto. `/confirmado` y `/evento` repiten el mismo título y precio | «Normalizar opciones» y «Armar texto /opciones» usan el formato del 3/11 (`título — paradas · salida · presupuesto`) | Portar `precioUno` (`sintonia.js`) y `dondeTxt` (`mago.html`); mismo título y precio en `/confirmado`. Se suma a N8 (paradas completas) | **Validez** (voz: un solo precio) |
| N15 | **Mensajes bloqueados mientras votan** (2.8.0): no se puede copiar `/confirmado`, `/evento`, `/hoy`, `/salida`, `/todos` ni la encuesta de cierre; `/recordatorio` desaparece cuando ya votaron todos | W2 decide con `n_votos` de `view=plan`, que cuenta la hoja `votos`. Con la encuesta nativa (N1) esa hoja queda vacía: el recordatorio sale siempre y «todos votaron» nunca llega. W3 se puede cerrar en cualquier momento | W2 usa los conteos de la encuesta (depende de V1 del relay) o el estado de la ronda; W3 no cierra mientras la encuesta esté abierta | **Validez** |
| N16 | **Antes del grupo** (2.8.0): «Falta un paso: invita a tu parche», recordar a quien organiza que comparta la invitación y crear el grupo en 3 pasos (guardar contacto, crear con quien organiza, enlace para el resto) | W0 arranca en «Grupo creado»: no hay recordatorio a quien organiza ni paso de crear el grupo | **Decidir:** quien revisa crea el grupo a mano, igual que en E1 (recomendado: misma mecánica, y WhatsApp no deja agregar a quien no es contacto), o lo hace Evolution. El recordatorio a quien organiza entra como mensaje aprobado | **Bloquea** (grupos reales) |
| N17 | **Textos de la 2.16.0** y voz: «su +1 de confianza» (`MARCA_SU`), `wa.me` sin emojis, máximo un emoji | N2 pedía copiar los textos de la 2.7.0 | Copiar de la lista `TPL` de **2.16.0** (tag `piloto/v2.16.0`), no de la 2.7.0 | **Bloquea** (amplía N2) |
| N18 | **Encuesta de cierre 2.16** con precio para todo el parche: enlace personal `retro.html` con `pid` y `plan_id`; plan 2 con su ronda | W5 manda un solo `/retro` al grupo | W5 arma un enlace por persona igual al de la consola (N6) y la ronda del plan 2 | **Validez** |
| N19 | **Encuesta del mago por plan** (G4 de 2.8.1): paso del recorrido después de cada cierre, aunque el plan se caiga | No existe en E1.5 | W5 avisa a quien revisa con el enlace de `pulso_mago` después de cada plan. Junto con N10–N11: decidir cómo se miden los minutos de quien revisa (por ejemplo, abrir «Mago in» en la consola mientras aprueba) | **Validez** |
| N20 | **Reintentos sin duplicados** (`req_id`, backend 2.9.3) | Ningún llamado manda `req_id` | Cada escritura del motor (`publicar_plan`, `cerrar_plan`, `evento`, `reabrir_opciones`, `operacion`) manda un `req_id` fijo, por ejemplo `plan_id-accion-ronda`. Obligatorio antes de agregar reintentos (pendiente 11) | **Validez** (datos duplicados) |
| N21 | **`cerrar_plan` con la hora** | W3 manda solo `plan_id` y `elegida` | Enviar también `hora_encuentro`, `hora_salida` y `decision` (N1). Sin la hora, el plan queda sin fecha en la hoja | **Validez** |
| N22 | **Llegadas y «en casa» como encuesta** (2.4.0, 2.7.1): el mago toca «Llegó» y «En casa» por persona | W4 lee `n_llegaron` de los eventos `checkpoint_llegada`; nadie los registra en E1.5 si la respuesta es un voto de encuesta | Traducir cada voto de `/checkpoint` y `/en_casa` a `evento` por persona (`checkpoint_llegada`, `llego_casa`). Depende de V1 y de D1 (quién resuelve el `pid`) | **Validez** |
| N23 | **Modo prueba sin reloj** (2.4.0) | W2–W5 corren cada 15 min con la hora real | Para probar «tal como están»: disparos manuales o un `Config` de prueba con tiempos cortos, solo para grupos en modo prueba | Ajuste (necesario ya para las pruebas) |
| N24 | **Asignación de condición**: la landing y el QR inscriben con `exp=E1`; E1.5 solo entra por el enlace `exp=E2` de la página del equipo | — | Escribir antes de reclutar qué grupos van a E1.5 y por qué (no por autoselección) | **Validez** (sesgo metodológico) |
| N25 | **Canal decidido el 26/11:** Evolution con envío automático después de aprobar | B1 de §2 recomendaba volver a la opción C; `SW · Enviar` y `SW · Avisar revisor` ya usan Evolution, pero `SW · Aprobar` no existe | B1 pasa de «volver a la opción C» a **construir `SW · Aprobar`** (aprobar, editar o rechazar) antes de `SW · Enviar`. La §2 pedía reabrir C12 **por escrito y con Néstor** (términos de WhatsApp y aviso): hoy solo hay decisión del equipo | **Bloquea** (personas reales; no las pruebas con el número de prueba) |
| N26 | **Términos sensibles** iguales en formulario y backend (2.8.1, 2.9.2) | E1.5-01 escala con su propia lista de salud, ubicación y emergencia | Mantener la escalada, revisar que no contradiga `TERMINOS_SENSIBLES_` | Ajuste |
| N27 | **Lo que el motor puede leer.** Con `MOTOR_KEY` solo hay `view=plan` (con un `pid`) y `view=resolver`; `view=mago` exige `ADMIN_KEY` | `view=plan` no trae la disponibilidad ni los `pid` de los miembros, `n_llegaron` ni `t_cerrado`. W4 espera `n_llegaron`: hoy siempre caería en `llegadas_desconocidas` | **Después del congelamiento:** `view=motor` con `MOTOR_KEY`, sin nombres ni números (detalle en `snippets/README.md`). No dar `ADMIN_KEY` al motor | **Bloquea** N12, N18 y N22 |

### 8.3 Snippets y V1

- **Snippets (26/11):** `n8n/snippets/sintonia-e1.js` trae la lógica y los textos de la consola 2.16.0 para los nodos Code (N2, N3, N12–N15, N17, N18, N20). Probado contra la consola en 753 casos ficticios (verificación técnica, n = 0). Uso en `snippets/README.md`.
- **V1 · votos de la encuesta nativa:** el CHANGELOG de Evolution dice que la 2.3.7 (5 dic 2025) agregó el descifrado de votos de encuestas, así que la 2.3.8 debería traerlo. Para descifrar un voto hace falta **el mensaje original de la encuesta** guardado en el conector (así funciona Baileys, la librería de Evolution). Eso choca con «apagar el guardado de historial» del pendiente 11: hay que guardar al menos los mensajes que manda Sintonía, con retención corta. **Por verificar con el número de prueba:** mandar una encuesta, votar y mirar qué llega al webhook.

### 8.4 Orden sugerido

1. Exportar los flujos actuales y confirmar esta tabla. Probar V1 con el número de prueba.
2. Para las pruebas tal como están: N23 (relojes) y N20 (`req_id`).
3. Antes de una persona real: N25 (`SW · Aprobar` y Néstor), N16, N17 y N3.
4. Para que E1 y E1.5 sean comparables: N1, N12–N15, N18, N19, N21, N22 y N24, más N5–N11.
