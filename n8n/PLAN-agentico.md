# Motor E1.5 · plan para pasar a agentes (v0.1, 27/11/2026)

> **Decisión (27/11):** Néstor dio luz verde al *qué* y al *cómo* de un motor con agentes, según José. **Falta por escrito** (d5). Reemplaza la recomendación del 27/11 de «flujos fijos, ningún agente le habla al grupo» (`ESTADO.md` §0) y la §7.1 de `n8n/PLAN-construccion.md`. El resto de ese plan (fases 1–6, tramos T1–T3) sigue vigente: este documento cambia **quién redacta**, no cómo se prueba.
> Construye el equipo con Claude. No toca la consola ni el backend (congelados). E1.5 no corre con personas hasta cerrar E1. Todo aquí es verificación técnica (n = 0).

## 0. En corto

- **Qué cambia:** los textos al grupo los redacta un **agente Redactor** con la voz de Sintonía, y un **agente Revisor (QA)** independiente los aprueba antes de salir. Si el Revisor o las guardas fallan, sale la plantilla de E1 o escala a una persona.
- **Qué no cambia:** cuándo se habla (relojes y eventos de W0–W5), los datos (solo del backend), HUMANO y lo sensible (siempre a una persona) y el criterio de parada del 40 %.
- **Por qué es comparable:** en E1 el mago también adapta los textos. La comparación justa es «persona con criterio» contra «agente con criterio», con los mismos datos y los mismos momentos. Para comprobarlo, en Cali se anota cuánto se aparta el mago de la plantilla (§4, A0).
- **Primer paso (Claude, sin red, ya):** contrato de los agentes, reglas de voz en un archivo, guardas en código con casos y la tabla `e15_mensajes`.

## 1. Lo que no se negocia

1. **Datos fijos, texto libre.** Hora, lugar, opciones, conteos y enlaces los pone el código en un **bloque de datos** que el Redactor no puede cambiar. El agente escribe alrededor del bloque.
2. **Seguridad con plantilla.** HUMANO, `/no_llega`, salud, ubicación y emergencias: plantilla fija y escalamiento a una persona. Ningún agente responde ahí.
3. **El agente no decide cuándo hablar** (v1). Los relojes de E1 (`n8n.N5`) y las puertas (`n8n.N13`, `n8n.N15`) siguen en los flujos. Así la comparación con E1 se queda en el texto, no en los tiempos.
4. **Todo queda escrito.** Cada mensaje: tipo, texto, veredicto del Revisor y motivo. De ahí sale la tasa de error del 40 %.
5. **Voz de Sintonía:** una idea por mensaje, conteos y nunca nombres, máximo un emoji, nada inventado, «tu/su +1 de confianza» (`MARCA_TU`, `MARCA_SU`).
6. **Minimización:** el modelo no ve nombres ni números. El texto del grupo solo lo ve el Intérprete, y solo para clasificar.

## 2. Piezas

| Pieza | Qué hace | Tipo | Ve | Devuelve |
|---|---|---|---|---|
| Entrada (`E15-00`) | Clasifica lo que llega | Código (`motor/entrada.js`) | El mensaje, en memoria | `accion`, sin texto |
| Intérprete | Solo lo que la Entrada no entiende (`no_entendido`) | IA con salida cerrada, sin herramientas | El texto, sin nombre ni número | Una de: voto 1/2/3, evento, escalar |
| Redactor | Escribe el mensaje del momento | IA (nodo en el flujo) | Tipo de mensaje, bloque de datos, reglas de voz, plantilla de E1 como referencia | Texto con `{{bloque}}` |
| Guardas | Revisan lo que se puede revisar con reglas | Código (`motor/guardas.js`, por hacer) | Texto y bloque | `ok` o motivo: corchetes, dato ajeno al bloque, más de un emoji, nombres, largo |
| Revisor (QA) | Revisa voz, una idea y que el texto diga lo mismo que los datos | IA independiente: otras instrucciones y, de preferencia, otro modelo | Texto, bloque y reglas; **no** ve el razonamiento del Redactor | `ok` o `falla` + motivo. No reescribe |
| Envío (`SW · Enviar` v2) | Manda, con `req_id`, reintentos y freno de corchetes | Flujo | Texto aprobado | Enviado o error |
| Plantilla de respaldo | Lo que sale si algo falla | Snippets de E1 | — | Texto de la consola 2.16.0 |
| Persona | HUMANO, lo sensible y lo que el sistema no resuelve | Equipo | Aviso del revisor | — |
| Bitácora `e15_mensajes` | Registro para el 40 % | Data Table | — | — |

**n8n Agent o nodo de IA:** en v1, Redactor, Intérprete y Revisor van como **nodos de IA dentro de los flujos**, porque el control (cuándo y qué tipo de mensaje) es fijo. El *Agent* de n8n como pieza propia queda para el **asistente de operación** (§4, A5), que sí investiga y conversa con el equipo.

## 3. Carriles por tipo de mensaje (propuesta para d4)

| Carril | Mensajes | Quién redacta | Si falla |
|---|---|---|---|
| Datos | `/opciones`, `/encuesta`, `/confirmado`, `/salida`, `/checkpoint` | Redactor + bloque de datos fijo + guardas + Revisor | Plantilla |
| Social | `/ingreso`, recordatorios, ánimo, `/en_casa`, cierre, «¿repetimos?» | Redactor + guardas + Revisor | Plantilla |
| Seguridad | HUMANO, `/no_llega`, sensible, SALIR | Plantilla fija | Escala siempre |
| Lo que entra | `no_entendido` | Intérprete (salida cerrada) | Escala |

## 4. Fases

| Fase | Qué | Quién | Listo cuando | Depende de |
|---|---|---|---|---|
| **A0 · Contrato, sin red** | Esquemas de entrada y salida del Redactor y del Revisor (JSON). `n8n/agentes/voz.md` con las reglas de voz y ejemplos buenos y malos. `n8n/motor/guardas.js` con casos ficticios. Data Table `e15_mensajes`. En Cali (E1): anotar qué texto mandó el mago frente a la plantilla, **solo los mensajes del mago**, sin tocar la consola | Claude; la nota de Cali, el mago | Guardas con casos ✓. Revisor y Redactor con contrato escrito | Nada |
| **A1 · Redactor y Revisor, fuera del grupo** | Subflujo `SW · Redactar` (Redactor → guardas → Revisor → texto o plantilla). Banco de pruebas: al menos 20 casos por tipo de mensaje, más casos malos sembrados (dato cambiado, dos emojis, un nombre, corchete) | Claude por MCP; José crea la credencial del modelo | 0 errores de datos. El Revisor rechaza todos los casos malos. Tasa de respaldo a plantilla medida | Credencial del modelo (§5) |
| **A2 · Salida con agentes** | Fase 3 de `PLAN-construccion.md` con `SW · Redactar` delante de `SW · Enviar` v2, en W0 y W1. Verificador independiente antes del primer mensaje (§7 de ese plan) | Claude construye; verificador aparte; José importa o aprueba | Tramo T2 en el grupo de prueba: textos con voz, datos idénticos al backend, sin corchetes ni duplicados | A1 · tramo T1 |
| **A3 · Intérprete** | `no_entendido` de E15-00 → Intérprete. Casos con mensajes que intentan darle órdenes («ignora tus reglas…») | Claude | Salida siempre dentro de la lista cerrada; lo dudoso escala | A1 |
| **A4 · Continuidad** | W3 salida, W4, W5 con el Redactor | Claude | Tramo T3 con relojes cortos | `view=motor` (`n8n.N27`) |
| **A5 · Asistente de operación** | *n8n Agent* interno: lee `e15_entrada`, `e15_mensajes` y ejecuciones; resume para el equipo. Nunca le habla al grupo ni ve datos de personas | Claude | Resumen diario útil con datos de prueba | A2 |
| **A6 · Antes de una persona real** | Aviso v3 nombra al proveedor del modelo como encargado y dice que los mensajes los redacta una IA y los revisa otra. d3 con textos generados. d4 firmada. Luz verde de Néstor por escrito (d5) | Equipo y Néstor | Todo por escrito | Cerrar E1 (3/12) |

## 5. Por decidir (equipo)

1. **Modelo y proveedor.** n8n Cloud trae créditos para Anthropic, entre otros. Propuesta: un modelo para el Redactor y **otro distinto** para el Revisor, para que no compartan los mismos puntos ciegos. Se elige con el banco de A1 (calidad, latencia, costo).
2. **Qué es error con textos generados (d3).** Propuesta: error = dato distinto al backend, mensaje que salió con falla del Revisor, o mensaje que la persona tuvo que corregir. Un respaldo a plantilla no es error, pero se cuenta aparte.
3. **Latencia aceptable.** Propuesta: hasta 10 s en social y datos; si se pasa, sale la plantilla.
4. **Stickers** (`PLAN-construccion.md` §5): siguen la regla que fije el equipo, no los elige el Redactor en v1.

## 6. Riesgos

| Riesgo | Qué lo frena |
|---|---|
| El Redactor cambia un dato | Bloque de datos fijo + guardas en código, antes del Revisor |
| El Revisor aprueba algo malo | Casos malos sembrados en A1; otro modelo; bitácora para revisar después |
| Un mensaje del grupo manipula al Intérprete | Salida cerrada, sin herramientas, nunca redacta; lo dudoso escala |
| Lentitud o caída del proveedor | Tiempo máximo y plantilla de respaldo |
| E1 y E1.5 dejan de ser comparables | Mismos momentos y datos; la nota de Cali (A0) mide cuánto adapta el mago |
| Datos de personas al proveedor | Minimización (§1.6) y aviso v3 antes del grupo real |
