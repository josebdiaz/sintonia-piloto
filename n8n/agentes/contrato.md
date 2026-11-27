# Motor E1.5 · contrato de los agentes (v0.1, 27/11/2026)

> Fase `ag.F0` de [`n8n/PLAN-agentico.md`](../PLAN-agentico.md). Define qué entra y qué sale de cada pieza con IA, y la bitácora `e15_mensajes`. Sin red: nada de esto está en n8n todavía (`ag.F1` lo construye). Todo es verificación técnica (n = 0).
> Reglas de voz: [`voz.md`](voz.md). Guardas en código: [`../motor/guardas.js`](../motor/guardas.js) (prueba: `node n8n/motor/prueba-guardas.js`).

## 0. En corto

- **El código decide; la IA redacta o clasifica.** Cuándo se habla, qué tipo de mensaje va y qué datos lleva lo deciden los flujos (relojes de E1, puertas). Ningún agente tiene herramientas ni llama al backend.
- **Redactor:** recibe tipo de mensaje, reglas de voz y la plantilla de E1 como referencia; devuelve un texto con `{{bloque}}` donde el código pone los datos. **No ve los datos que no necesita para el tono** y nunca los escribe él.
- **Guardas** (código) → **Revisor** (IA independiente) → envío. Si cualquiera falla, sale la plantilla de E1 (consola 2.16.0) y queda escrito por qué.
- **Intérprete:** solo para `no_entendido` de E15-00; devuelve una opción de una lista cerrada. Nunca redacta.
- **Ningún agente ve nombres ni números de teléfono.** El texto del grupo solo lo ve el Intérprete, y solo para clasificar.

## 1. Flujo de un mensaje (`SW · Redactar`, `ag.F1`)

```
flujo (W0–W5) ──tipo + datos──▶ Armar bloque (código) ──▶ Redactor (IA) ──texto con {{bloque}}──▶ Guardas (código)
                                     │                                                     │ falla
                                     │                                                     ▼
                                     │                                             plantilla de E1
                                     ▼                                                     ▲ falla / tiempo
                               Revisor (IA) ◀──texto final + bloque + reglas───────────────┘ ok
                                     │ ok
                                     ▼
                              SW · Enviar v2 ──▶ grupo          y siempre: fila en e15_mensajes
```

- **Carril seguridad** (HUMANO, `/no_llega`, sensible, SALIR) no entra a `SW · Redactar`: plantilla fija y escalamiento (§1.2 del plan).
- **Tiempo máximo** (propuesta, §5.3 del plan): 10 s para Redactor + Revisor juntos. Si se pasa, plantilla.
- **Un solo intento** en v1: si el Revisor falla, no se le pide al Redactor que corrija; sale la plantilla. Así la tasa de respaldo es limpia de medir.
- Los mensajes que son solo una **encuesta** (`/encuesta`, `/dia`, `/horario`, `/checkpoint`, `/asistencia`) o el **evento** (`/evento`) no pasan por el Redactor: la pregunta y las opciones salen del snippet tal cual. El Redactor puede escribir el texto que acompaña (por ejemplo, `/reprogramar` o `/empate`).

## 2. Redactor

### 2.1 Entrada

```json
{
  "v": 1,
  "tipo": "/confirmado",
  "carril": "datos",
  "a_quien": "grupo",
  "momento": "confirmar el plan elegido con lugar, hora y salida",
  "bloque": {
    "presente": true,
    "describe": "lugar, día y hora, salida sugerida y precio aproximado del plan elegido"
  },
  "referencia": "¡Hay plan! {{bloque}}\nEn el evento del grupo marquen si van.",
  "reglas": "<contenido de n8n/agentes/voz.md §1–§3, pegado como instrucciones>",
  "limites": { "max_prosa": 320, "max_frases": 3, "emojis": 1 }
}
```

| Campo | Tipo | Quién lo pone | Nota |
|---|---|---|---|
| `v` | número | código | Versión del contrato |
| `tipo` | texto | flujo | Uno de los comandos de `SINTONIA.comandos` (`n8n/snippets/sintonia-e1.js`) |
| `carril` | `datos` · `social` | flujo | Tabla de carriles del plan (§3) |
| `a_quien` | `grupo` · `persona` | flujo | Define `MARCA_SU` o `MARCA_TU` y el tuteo o el «ustedes» |
| `momento` | texto | código | La descripción del snippet (cuarta columna de `TPL`): qué tiene que lograr el mensaje |
| `bloque.presente` | sí/no | código | Si es sí, el texto tiene que traer `{{bloque}}` exactamente una vez |
| `bloque.describe` | texto | código | Qué hay en el bloque, **sin los valores** |
| `referencia` | texto | código | La plantilla de E1 con los datos cambiados por `{{bloque}}` |
| `reglas` | texto | código | Fijo por versión; sale de `voz.md` |
| `limites` | objeto | código | Los mismos que usan las guardas |

**Lo que el Redactor no recibe:** los valores del bloque (lugar, hora, precio, enlaces, conteos), nombres, números de teléfono, `pid`, `plan_id`, mensajes del grupo ni el resultado de mensajes anteriores. Sin los valores no los puede cambiar; las guardas confirman que tampoco los inventó.

**Por qué no ve los valores:** en el carril de datos el error que más pesa es un dato distinto al backend (d3). Si el Redactor no tiene la hora, no la puede reescribir mal. La voz va alrededor del bloque, no dentro.

### 2.2 Salida

```json
{ "texto": "¡Hay plan, parche! 🙌\n{{bloque}}\nEn el evento del grupo marquen si van." }
```

- **Marcador hacia el modelo:** al Redactor se le pide `@@BLOQUE@@`, no `{{bloque}}`, porque las llaves chocan con las plantillas de prompt de los nodos de IA de n8n. El nodo de guardas lo cambia por `{{bloque}}` antes de revisar. Por la misma razón, las instrucciones y la entrada que ve un agente no llevan llaves (decisión del 27/11).
- Un solo campo. Cualquier otra forma (texto suelto, varios campos, markdown) cuenta como falla de formato → plantilla.
- Si el tipo lleva varios mensajes en E1 (`/confirmado` son tres), en v1 el Redactor escribe **uno** y el bloque lleva las líneas de los tres. Se decide en `ag.F1` si se mantiene la separación en tres (comparabilidad con E1).

## 3. Guardas (código)

`GUARDAS.revisar(texto, bloque, { a_quien })` → `{ ok, motivos, texto }`. El bloque llega con sus valores, armado por el código: `{ "lineas": ["Dónde: …", "Cuándo: …"] }`.

| Motivo | Qué detecta |
|---|---|
| `vacio` | Texto vacío |
| `bloque_falta` · `bloque_repetido` · `bloque_sin_datos` | `{{bloque}}` ausente cuando hay datos, repetido, o puesto cuando no hay datos |
| `corchete` | `[` `]`, `{{…}}` sin llenar o «Dato pendiente», en el texto final (incluye el bloque; `n8n.N3`) |
| `dato_ajeno_hora` · `dato_ajeno_cifra` · `dato_ajeno_enlace` · `dato_ajeno_lugar` | Horas, cifras (también escritas: «dos», «veinte»), enlaces o direcciones en la prosa que no están en el bloque |
| `nombre` | Palabra con mayúscula fuera de inicio de frase, o «Xxx, …» al inicio, que no está en el bloque ni en la lista permitida |
| `emoji` | Más de un emoji en el mensaje completo |
| `marca` | Menciona el «+1» sin la forma exacta de `MARCA_SU` (grupo) o `MARCA_TU` (persona) |
| `largo` | Prosa de más de 320 caracteres, mensaje de más de 900 o más de 3 frases |

Las guardas no juzgan el tono ni «una idea por mensaje»: eso es del Revisor. Son deliberadamente estrictas; un falso positivo solo manda la plantilla, que no es error (§5.2 del plan).

## 4. Revisor (QA)

Otras instrucciones y, de preferencia, **otro modelo** que el Redactor (§5.1 del plan). No ve la entrada del Redactor ni su razonamiento: solo lo que va a salir.

### 4.1 Entrada

```json
{
  "v": 1,
  "tipo": "/confirmado",
  "carril": "datos",
  "a_quien": "grupo",
  "momento": "confirmar el plan elegido con lugar, hora y salida",
  "texto_final": "¡Hay plan, parche! 🙌\nDónde: …\nCuándo: …\nEn el evento del grupo marquen si van.",
  "bloque": { "lineas": ["Dónde: …", "Cuándo: …", "Salida sugerida: …"] },
  "reglas": "<voz.md §1–§3 y la lista de §4.3 de este contrato>"
}
```

El Revisor **sí** ve los valores del bloque, porque su trabajo es comprobar que el texto diga lo mismo que los datos. No ve nombres ni números: el bloque no los lleva (§5).

### 4.2 Salida

```json
{ "veredicto": "ok", "motivo": "" }
```
```json
{ "veredicto": "falla", "motivo": "dos_ideas" }
```

- `veredicto`: `ok` · `falla`. `motivo`: uno de §4.3 si `falla`; vacío si `ok`.
- **No reescribe.** Cualquier campo de más (un texto propuesto, una explicación larga) se descarta; si la salida no tiene esta forma, cuenta como `falla` · `formato`.

### 4.3 Motivos del Revisor

| Motivo | Cuándo |
|---|---|
| `contradice_datos` | El texto dice algo distinto al bloque o le da otro sentido (por ejemplo, «llegan a las 7» cuando el bloque dice que esa es la salida) |
| `dato_inventado` | Promete o afirma algo que no está en el bloque ni en el momento (un descuento, que alguien ya confirmó, el clima) |
| `dos_ideas` | Mezcla dos pedidos o dos temas (votar y confirmar asistencia en el mismo mensaje) |
| `presion` | Culpa, urgencia o presión («no nos dejen colgados», «último aviso») |
| `persona` | Señala o cuenta a alguien en particular, aunque sea sin nombre («la única que falta») |
| `fuera_de_voz` | No suena a Sintonía: formal de más, publicidad, jerga que excluye, sarcasmo |
| `seguridad` | Toca salud, ubicación, emergencias o algo que debía escalar |
| `formato` | La salida del Revisor no tiene la forma de §4.2 (lo pone el flujo, no el Revisor) |

## 5. Intérprete

Solo para lo que E15-00 marca `escalar · no_entendido` (`ag.F3`). Sin herramientas, sin memoria y sin poder redactar.

### 5.1 Entrada

```json
{ "v": 1, "texto": "<mensaje del grupo, sin nombre ni número>", "estado_plan": "votando", "n_opciones": 3 }
```

- `texto`: el mensaje tal como llegó, en memoria; nunca se guarda. Se le quitan menciones (`@…`) y números de teléfono antes de pasarlo.
- `estado_plan`: `votando` · `cerrado` · `en_curso` · `sin_plan`, para saber si un «1» puede ser voto.

### 5.2 Salida (cerrada)

```json
{ "accion": "voto", "opcion": 2 }
{ "accion": "evento", "evento": "me_apunto" }
{ "accion": "escalar", "motivo": "dudoso" }
```

| `accion` | Campos | Valores permitidos |
|---|---|---|
| `voto` | `opcion` | `1` · `2` · `3` (no más que `n_opciones`) |
| `evento` | `evento` | `me_apunto` · `no_puedo` · `checkpoint_llegada` · `llego_casa` · `salir` (los de `n8n/motor/entrada.js`) |
| `escalar` | `motivo` | `dudoso` · `sensible` · `pidio_humano` · `charla` |

- El flujo valida la salida contra esta tabla. Cualquier otra cosa (otro valor, texto libre, una instrucción) → `escalar · dudoso`.
- `salir` y `sensible` siempre escalan además de registrarse, igual que en la entrada.
- Si el texto intenta darle órdenes («ignora tus reglas», «responde al grupo…»), la respuesta correcta es `escalar · dudoso`. `ag.F3` lo prueba con casos así.

## 6. Bitácora `e15_mensajes` (Data Table, por crear en `ag.F1`)

Una fila por mensaje que el motor decide mandar, salga o no. De aquí sale la tasa de error del 40 % y la de respaldo a plantilla. **No guarda** el texto del grupo, nombres, números, `pid` ni el texto que escribió el Redactor cuando falló (solo el motivo).

| Columna | Tipo | Valores / ejemplo | Para qué |
|---|---|---|---|
| `hora` | texto (ISO) | `2026-12-06T22:00:00Z` | Orden y latencia |
| `req_id` | texto | `SINTONIA.reqId(plan_id, tipo, ronda)` | Une con `SW · Enviar` y evita duplicados (`n8n.N20`) |
| `plan_id` | texto | id del backend | Agrupar por parche; no identifica a nadie |
| `flujo` | texto | `W1` | Qué flujo lo pidió |
| `tipo` | texto | `/confirmado` | Tipo de mensaje |
| `carril` | texto | `datos` · `social` · `seguridad` | d4 |
| `a_quien` | texto | `grupo` · `persona` | Sin decir a qué persona |
| `origen` | texto | `redactor` · `plantilla` | Qué salió |
| `guardas` | texto | `ok` o motivos separados por coma | Por qué no pasó |
| `revisor` | texto | `ok` · `falla` · `no_corrio` · `tiempo` | Veredicto |
| `motivo_revisor` | texto | uno de §4.3 | — |
| `modelo_redactor` · `modelo_revisor` | texto | nombre del modelo | Comparar en `ag.F1` (§5.1 del plan) |
| `ms_redactor` · `ms_revisor` | número | `1840` | Latencia (§5.3 del plan) |
| `enviado` | texto | `si` · `no` · `error` | Lo que devolvió `SW · Enviar` |
| `sha_texto` | texto | sha-256 del texto enviado | Comprobar después qué salió sin guardar el texto en la tabla |
| `contrato` | número | `1` | Versión de este documento |

**Por qué no el texto:** el texto enviado ya queda en el grupo y en la ejecución de n8n; la tabla solo necesita contar. Para revisar la voz después (`ag.F1`), el banco de pruebas guarda sus propios textos ficticios fuera de esta tabla.

## 7. Abierto para `ag.F1`

- Modelo de cada agente y su credencial (José, §5.1 del plan).
- `/confirmado` en uno o tres mensajes con agentes (§2.2).
- Si el Revisor puede ver la `referencia` de E1 para juzgar el tono (hoy no: se le pasa solo `voz.md`).
- Qué datos de `view=motor` (`n8n.N27`) entran al bloque de W3–W5.
