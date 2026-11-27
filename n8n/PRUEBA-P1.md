# Prueba `prueba.P1` · entrada en el grupo del equipo, paso a paso (27/11/2026)

> Pendiente 44. Capa P1 de [`PLAN-pruebas.md`](PLAN-pruebas.md) (`tramo.T1` de [`PLAN-construccion.md`](PLAN-construccion.md)). Prueba qué entiende `E15-00 · Entrada` de lo que se escribe en el grupo. Desde el 27/11 (6:50 p. m.) responde en el grupo del equipo qué entendió, marcado «🧪 Prueba» (`eco` en Config; en el piloto real va apagado). Verificación técnica (n = 0).
> Toma unos 20 minutos. José escribe en el grupo; Claude lee la tabla `e15_entrada` por MCP y compara.

## 0. Antes de empezar (5 min)

| # | Qué | Quién | Estado |
|---|---|---|---|
| 0.1 | Escribe desde un teléfono que esté en el grupo del equipo y que **no** sea el número conectado a Evolution. Lo que manda ese número se ignora (`propio`) y no deja fila | José | — |
| 0.2 | En n8n: **Settings → MCP** (acceso al MCP de la instancia) → **Allowed callback URLs** = **Only trusted URLs**. Si ya está, solo confírmalo | José | ✓ confirmado el 27/11 |
| 0.3 | `E15-00` activo, sin guardar datos de las ejecuciones (ni éxito ni error), zona `America/Bogota`, sonda encendida y el grupo del equipo en la lista de permitidos | Claude | ✓ revisado por MCP el 27/11 |
| 0.4 | Dile a Claude: «empiezo P1 a las HH:MM». Así solo se leen las filas nuevas | José | — |

**No hace falta pegar nada en n8n ni tocar Evolution.**

## 1. Lo que se manda en el grupo

Manda **un mensaje por vez**, en este orden, con unos 5 segundos entre uno y otro. Escribe solo lo que está entre comillas; mayúsculas y tildes dan igual.

| Paso | Mensaje | Fila que se espera en `e15_entrada` |
|---|---|---|
| **P1.1** · votos por texto | «2» | `voto` · opción `1` |
| | «la 3» | `voto` · opción `2` |
| | «TODAS» | `voto` · opción `-1` |
| | «NINGUNA» | `voto` · opción `-1` (veto) |
| **P1.2** · eventos | «ME APUNTO» | `evento` · `me_apunto` |
| | «LLEGUÉ» | `evento` · `checkpoint_llegada` |
| | «YA EN CASA» | `evento` · `llego_casa` |
| | «SALIR» | `evento` · `salir`. Nadie sale del grupo: el motor todavía no responde |
| **P1.3** · escalar | «HUMANO» | `escalar` · `pidio_humano` |
| | «tuve un accidente (prueba)» | `escalar` · `sensible` |
| | «llamen al 123 (prueba)» | `escalar` · `sensible` |
| **P1.4** · charla | «jajaja» | `escalar` · `no_entendido` |
| **P1.5** · stickers | Los stickers 01 («¡Hay plan!»), 05 («Me apunto») y 08 («¡Ya llegué!») de `docs/stickers/`, **cada uno dos veces**. Si no los tienes en el teléfono, sáltalo y avísale a Claude | `escalar` · `sticker` con `sticker_sha` (6 filas). Pregunta: ¿el sha de cada sticker se repite las dos veces? |
| **P1.6** · encuesta (V1) | Adjuntar → **Encuesta**: pregunta «Prueba», opciones «A» y «B». Vota «A» desde tu teléfono y pide a otra persona del grupo que vote «B» | La encuesta: `escalar` · `medio_no_soportado`. Cada voto: `voto_encuesta` si llega descifrado; si no, `escalar` · `voto_sin_descifrar`. La columna `forma` muestra qué trajo |
| **P1.7** · medios | Adjuntar → **Ubicación** → «Enviar ubicación» moviendo el pin a cualquier lugar (**no** la ubicación en tiempo real ni la tuya) | `escalar` · `sensible` |
| | Una nota de voz de un segundo | `escalar` · `medio_no_soportado` |
| **P1.8** · lo que no se atiende | «2» por chat privado al número de Sintonía | **Nada** en la tabla |
| | «2» en otro grupo donde esté el número (si no hay otro grupo, sáltalo) | **Nada** en la tabla |

En total se esperan unas 27 filas (menos si te saltas P1.5 o P1.8).

## 2. Cuando termines

1. Dile a Claude: «terminé P1».
2. Claude lee `e15_entrada` desde la hora de inicio, compara fila por fila con la tabla de arriba y revisa **P1.9**: ninguna fila trae texto, nombre ni número (las columnas son solo `hora`, `id_mensaje`, `accion`, `tipo`, `motivo`, `evento`, `opcion`, `sticker`, `sticker_sha`, `tipo_whatsapp` y `forma`).
3. Claude deja el resultado en `CHANGELOG.md` con fecha y «n = 0», y responde las dos preguntas abiertas: si el sha de los stickers se repite y si el voto de la encuesta llega descifrado (V1).

**Listo cuando:** P1.1–P1.9 dan lo esperado y V1 tiene respuesta. Si un caso falla, no se repite de inmediato: Claude dice cuál y por qué, corrige `n8n/motor/entrada.js` con su caso en `prueba-entrada.js`, regenera `E15-00` y se repite solo ese paso.

## 3. Lo que decide el resultado

| Resultado | Qué cambia |
|---|---|
| V1 descifra el voto | La encuesta nativa sirve para votar en E1.5 (`n8n.N1`, `n8n.N15`) |
| V1 no descifra | Se vota por texto («1», «2», «3») y el equipo decide si la encuesta nativa queda solo como vista |
| El sha de cada sticker se repite | Se llena el mapa sha → sticker y el equipo decide `escalar` o `registrar` (§5 de `PLAN-construccion.md`) |
| Todo pasa | Se apaga la sonda (la columna `forma` deja de llenarse), se ajustan los avisos pendientes (§8 de `PLAN-pruebas.md`) y sigue `prueba.P2` cuando haya credenciales |
