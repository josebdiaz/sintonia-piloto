# Relay de E1.5 · especificación v0.1 (26 nov 2026)

> Borrador para el equipo. **No toca la consola ni el backend** (congelados desde el 26/11). Se construye **después de la prueba con Cali** (pendiente 11 de `ESTADO.md`).
> Sin hosts, IP, claves ni números en este archivo: el repo es público.

## 0. En corto

Un servicio pequeño en el servidor que ya tiene el conector de WhatsApp (Evolution API). Se para **entre Evolution y n8n Cloud** en las dos direcciones y hace solo lo que hoy falta para correr E1.5 con seguridad: autenticar, filtrar, minimizar datos, reintentar, frenar mensajes que no deben salir y dejar un interruptor de apagado.

**No es un backend.** Apps Script sigue siendo la única fuente de verdad. El relay no guarda planes, votos ni personas; n8n sigue llamando al backend directo con `MOTOR_KEY`.

## 1. Dónde encaja

```
                 entrada (lo que escribe el grupo)
WhatsApp ──► Evolution ──► RELAY ──► n8n Cloud ──► Apps Script (fuente de verdad)
                 ▲            │           │
                 │            │           ▼
                 └── RELAY ◄──┘◄── n8n (mensaje aprobado por guardas y Revisor)
                 salida (lo que dice Sintonía)
```

Hoy n8n habla con Evolution directo y tiene su llave. Con el relay, **la llave de Evolution vive solo en el servidor** y n8n recibe un token propio, con permisos limitados a lo que el relay deja hacer.

## 2. Qué hace (y por qué)

| # | Responsabilidad | Cierra | Por qué |
|---|---|---|---|
| R1 | **Autenticar la entrada.** Solo acepta webhooks de Evolution con el secreto compartido | Pendiente 11 (autenticación del webhook) | Hoy cualquiera con la URL de n8n puede inyectar «mensajes del grupo» |
| R2 | **Lista de grupos permitidos.** Descarta todo lo que no venga de un grupo inscrito en E1.5 (y, mientras dure la prueba, solo del grupo de prueba) | Pendiente 11 (fijar el filtro) | El número recibe chats privados y otros grupos: nada de eso debe llegar a n8n |
| R3 | **Minimizar.** Reenvía a n8n solo `grupo`, `id_mensaje`, `hora`, `autor` como hash, `tipo` y `texto` o `voto`. Quita `pushName`, foto, medios y metadatos | Aviso v3, Ley 1581 | n8n Cloud es un encargado más: le llega lo mínimo |
| R4 | **Reintentar con cola.** Si n8n o Evolution no responden, guarda el evento y reintenta con espera creciente; deduplica por `id_mensaje` | Pendiente 11 (reintentos) | Un corte no debe perder un voto ni duplicar un mensaje |
| R5 | **Frenar la salida.** Rechaza el envío si el texto tiene `[corchetes]`, si el grupo no está permitido o si no trae el sello de aprobación | N3 (bloquea) | Segunda barrera, además de la de `SW · Enviar` |
| R6 | **Ritmo de envío.** Máximo N mensajes por minuto por grupo y una pausa corta entre mensajes seguidos (por ejemplo `/confirmado` × 3) | Orden de los mensajes (prueba externa) | Evita mensajes en desorden y baja el riesgo de bloqueo del número |
| R7 | **Interruptor.** `PAUSA=1` detiene toda salida al instante, sin tocar n8n; la entrada sigue en cola | Plan de contingencia | Si algo sale mal ante un grupo real, se apaga en un paso |
| R8 | **Errores a una persona.** Lo que falla después de los reintentos va al flujo de errores de n8n (o a Telegram del revisor) con el `id` y el motivo, nunca con el texto | Pendiente 11 (flujo de errores) | Nada se pierde en silencio (M2) |

## 3. Contratos

### 3.1 Entrada · Evolution → relay → n8n

- Evolution envía `MESSAGES_UPSERT` (y, si se usa la encuesta nativa, la actualización de votos) a `POST /in/<secreto>`.
- El relay ignora `fromMe = true`, chats que no son de grupo y grupos fuera de la lista.
- Reenvía a n8n:

```json
{
  "v": 1,
  "id_mensaje": "…",
  "grupo": "<jid del grupo>",
  "hora": "2026-11-28T19:04:00-05:00",
  "autor": "<hash del número con sal>",
  "tipo": "texto | voto | otro",
  "texto": "2",
  "voto": { "encuesta": "…", "opciones": [2] }
}
```

- **`autor` va como hash.** Para llamar a `resolver` (número → `pid`), n8n pide el número al relay con `GET /autor/<hash>` usando su token. Así el número no pasa por la memoria de ejecuciones de n8n. *Alternativa más simple:* mandar el número y confiar en «no guardar ejecuciones». **Decisión abierta (D1).**

### 3.2 Salida · n8n → relay → Evolution

`POST /out` con `Authorization: Bearer <RELAY_TOKEN>`:

```json
{ "req_id": "…", "grupo": "…", "tipo": "texto | encuesta", "texto": "…",
  "encuesta": { "pregunta": "…", "opciones": ["…"], "multiple": true },
  "aprobado_por": "revisor-1", "aprobado_en": "2026-11-28T18:59:00-05:00" }
```

Respuestas: `202 en_cola` · `409 repetido` (mismo `req_id`) · `422 corchetes | grupo_no_permitido | sin_aprobacion` · `503 pausado`.
`aprobado_por` es un alias del equipo, no un nombre.

### 3.3 Operación

- `GET /salud` → conector conectado sí/no, eventos en cola y último error (sin datos).
- `POST /pausa` y `POST /reanudar` (token de admin del relay).
- `GET /metricas` → conteos y latencias por tramo (ver §6).

## 4. Datos y privacidad

| Qué | Dónde | Cuánto tiempo |
|---|---|---|
| Eventos en cola (entrada y salida) | SQLite en el servidor | Se borran al entregarse; máximo **24 h** si nunca se entregan |
| Tabla hash → número | SQLite | Mientras el grupo esté activo; se borra con `revocar` o al cerrar el piloto |
| Registros (logs) | Disco del servidor | 7 días; **solo** id, tipo, estado y latencia; nunca texto ni número |
| Historial del conector | Evolution | **Apagado** (`STORE_MESSAGES`, `STORE_CONTACTS` en falso), ya está en el pendiente 11 |

- El servidor está en Brasil: el **aviso v3** tiene que nombrar a Hostinger como encargado y la transferencia internacional, además de n8n (ya en el borrador).
- La instancia de prueba usa un número que no es el de Sintonía: se desvincula y se borra antes del piloto, como dice §1 de `ESTADO.md`.

## 5. Seguridad

- Secretos (`EVOLUTION_KEY`, `RELAY_TOKEN`, `RELAY_ADMIN`, `WEBHOOK_SECRET`, `SAL_HASH`) en un `.env` del servidor y en el gestor del equipo. Nunca en el repo ni en el chat.
- El relay y Evolution corren en la misma red de Docker; **Evolution deja de estar expuesto a internet**. Solo se publican `/in`, `/out`, `/salud` y `/metricas` detrás del mismo HTTPS.
- Firewall: 443 abierto; SSH solo con llave.
- Comparación de tokens en tiempo constante; límite de tamaño del cuerpo (16 KB); sin CORS.

## 6. Validez E1 / E1.5

- El relay **no cambia la mecánica** que ve el grupo: mismos textos (`piloto/mago.html`, lista `TPL`), misma encuesta nativa, mismos relojes. Si cambia algo de eso, es un hallazgo de validez y se anota en §3.1 de `ESTADO.md`.
- Las latencias que mide (`evolution→relay`, `relay→n8n`, `aprobación→envío`) son **contexto técnico**, no resultado del piloto. La comparación de trabajo humano sigue siendo con los minutos de «Mago in» (N10).
- Las pruebas del equipo con el relay son verificación técnica (n = 0).

## 7. Tecnología

- Node 20 sin framework pesado (o Fastify), `better-sqlite3`, un solo contenedor en el `docker-compose` donde ya corre Evolution.
- Unas 300 a 500 líneas. Código en `n8n/relay/` (este repo), sin `.env`.
- QA con `node --test`: un Evolution y un n8n falsos.

## 8. Pruebas (listo cuando todas pasan)

| # | Caso | Esperado |
|---|---|---|
| T1 | Webhook sin secreto o con secreto malo | 401, nada llega a n8n |
| T2 | Mensaje de chat privado o de un grupo no permitido | Descartado, contado en métricas |
| T3 | Mensaje del grupo de prueba | Llega a n8n con `autor` en hash y sin `pushName` |
| T4 | El mismo `id_mensaje` dos veces | Una sola entrega |
| T5 | n8n caído 5 minutos | Se encola y se entrega al volver, en orden |
| T6 | Salida con `[dirección]` | 422 `corchetes`, aviso al revisor |
| T7 | Salida sin `aprobado_por` | 422 `sin_aprobacion` |
| T8 | Tres mensajes seguidos (`/confirmado` × 3) | Llegan en orden, con pausa |
| T9 | `POST /pausa` con un envío en cola | No sale nada hasta `reanudar` |
| T10 | El mismo `req_id` dos veces | 409, un solo mensaje en el grupo |
| T11 | Revisar logs después de T1–T10 | Ningún texto ni número |
| T12 | Voto en encuesta nativa | Llega como `tipo: voto` con la opción (ver V1) |

## 9. Fuera de alcance

- Guardar o calcular nada del plan (eso es Apps Script).
- Decidir qué decir (n8n y Gemini) o aprobar (una persona).
- Mover el backend al servidor. Se evalúa después del pitch, con E3.

## 10. Abierto

**Decisiones del equipo (26/11):**
- **Orden:** primero se prueban los flujos tal como están; D1 y D2 se aplican después, al asegurar los flujos. Mientras tanto, las pruebas siguen solo con el número y el grupo de prueba (n = 0, sin participantes reales).
- **D3:** se calcula cuando terminen las pruebas del mago, con los logs de E1 (`eventos`, `msg_*`). Método: tope por minuto ≈ 2 × el pico observado, pausa menor que la brecha mínima observada y tope diario como freno. Es un parámetro técnico, no un resultado.
- **Recomendación pendiente de confirmar:** D1 = opción C (el relay resuelve el `pid` y n8n nunca ve números); D2 = sello firmado por `SW · Aprobar`.


- **D1.** ¿`autor` en hash con consulta al relay, o número directo a n8n sin guardar ejecuciones?
- **D2.** ¿El sello de aprobación es solo `aprobado_por` o un token firmado por `SW · Aprobar`? (Firmado es más fuerte y cuesta un nodo más.)
- **D3.** Límite de envío por grupo (N por minuto).
- **V1 · por verificar con el número de prueba.** Según el CHANGELOG de Evolution, la 2.3.7 agregó el descifrado de votos de encuestas. Descifrar requiere el mensaje original de la encuesta guardado en el conector: el relay y la configuración de Evolution tienen que guardar **los mensajes que manda Sintonía** (retención corta), aunque se apague el resto del historial. Ajustar §4 cuando se confirme.
- **V2 · por verificar.** Si el webhook de Evolution 2.3.8 permite encabezados propios; si no, el secreto va en la ruta (`/in/<secreto>`), como está escrito arriba.

## Implicaciones

- **JTBD:** el relay protege el momento de *activación* y *continuidad* (que el voto no se pierda, que el recordatorio salga en orden); no cambia el trabajo que el parche contrata.
- **Matriz de oportunidades:** baja el costo operativo y el riesgo de E1.5; los números de costo siguen pendientes hasta el piloto.
- **Siguiente fase:** después de Cali, V1 → D1–D3 → construir → T1–T12 → recién entonces activar W0–W5.
