# Motor E1.5 · plan de construcción y pruebas por tramos (v0.1, 27/11/2026)

> Lo construye el equipo con Claude. **No toca la consola ni el backend** (congelados desde el 26/11). E1.5 **no se ejecuta con personas** hasta cerrar E1; todo lo de aquí corre con el número y el grupo de prueba. Es verificación técnica (n = 0), nunca resultado.
> Revisado con las skills oficiales de n8n (`n8n-io/skills`: lifecycle, error-handling, credentials-and-security, expressions, code-nodes).

## 0. En corto

- **Hoy no se puede probar de punta a punta.** Sí por tramos: entrada (lo que escribe el grupo) → salida hasta `/confirmado`. La continuidad (llegadas, «en casa», encuesta de cierre) espera `view=motor` (`n8n.N27`), que es un cambio de backend.
- **Hecho el 27/11 (fase 0):** revisor automático de flujos, entrada del motor con sus puertas y 24 casos de prueba, y el flujo importable `E15-00 · Entrada`.
- **Primer paso (fase 1, José, ~15 min):** conectar Claude al servidor MCP de la instancia de n8n (§2.0). Con eso Claude importa, valida y prueba los flujos directo en n8n; sin eso, Claude entrega JSON y José importa a mano.
- **Multiagente (§7):** solo en dos puntos. Un verificador independiente antes del primer mensaje al grupo de prueba (fase 3 → 4) y constructores en paralelo para W3–W5 cuando exista `view=motor` (fase 5). En el producto, ningún agente le habla al grupo.
- **Después (fase 1, José, ~15 min):** crear la tabla `e15_entrada`, apuntar Evolution y exportar los 9 flujos actuales.

## 1. Fases

| Fase | Qué | Quién | Listo cuando | Estado |
|---|---|---|---|---|
| 0 · Base sin red | `n8n/qa/revisar-flujos.py` · `n8n/motor/entrada.js` + `prueba-entrada.js` · `n8n/E15-00-entrada.json` (generado con `motor/construir.py`) | Claude | Revisor ✓ sobre E15-00 · 24 casos ✓ · snippets ✓ (753) | **Hecho 27/11** |
| 1 · Conectar | Ver §2 (empieza por §2.0, el MCP de n8n) | José | Claude ve la instancia por MCP · E15-00 activo y registrando en `e15_entrada`; 9 flujos exportados sin URL ni claves | **Hecho 27/11.** 9 flujos en `n8n/flujos/` (revisor: 5 bloqueos, 28 de validez). E15-00 activo; `HUMANO` registrado como `escalar · pidio_humano` |
| 2 · Tramo T1, entrada | Casos de §3 con el número de prueba | José manda, Claude lee la tabla | Todos los casos dan la `accion` esperada; V1 resuelto (¿llega el voto descifrado? ¿con qué forma?) | Pendiente |
| 3 · Salida | (+ verificador independiente, §7) `SW · Enviar` v2: textos de los snippets, freno de corchetes (`n8n.N3`), `req_id` (`n8n.N20`), reintentos, flujo de errores `E15-ERR`. W0 y W1 con textos 2.16.0 (`n8n.N17`, `n8n.N14`) y relojes cortos de prueba (`n8n.N23`) | Claude construye, José importa | Revisor sin bloqueos en W0, W1, SW · Enviar | Pendiente |
| 4 · Tramo T2, activación | Plan de prueba en el grupo de prueba: ingreso → opciones → encuesta → voto → `/confirmado` | Equipo | El grupo de prueba recibe los mismos textos que daría la consola 2.16.0, sin corchetes y sin duplicados | Pendiente |
| 5 · Continuidad | W3 salida, W4, W5, `/retro` personal | Claude, después de `view=motor` | Tramo T3 completo con relojes cortos | **Bloqueado:** `n8n.N27` (backend) |
| 6 · Antes de una persona real | Relay (`relay/SPEC.md`), aviso v3, tabla por tipo de mensaje firmada con Néstor (d4), `n8n.N16`, `n8n.N24` | Equipo | Todo lo de la §5 decidido por escrito | **Bloqueado:** cerrar E1 (3/12) |

## 2. Fase 1 · conectar (José)

### 2.0 Primer paso · conectar Claude al MCP de la instancia de n8n

Fuente: [Connect to the n8n MCP server](https://docs.n8n.io/connect/connect-to-n8n-mcp-server) (consultada el 27/11/2026). Crear y editar flujos y Data Tables por MCP pide n8n **2.13.0 o posterior**; los pasos de conexión de abajo aparecen desde la **2.33.0**. Lo hace quien es *owner* o *admin* de la instancia.

1. **Ver la versión** de n8n Cloud (en el panel de la cuenta de n8n Cloud o en la ayuda de la instancia). Si es anterior a la 2.13.0, el MCP solo busca y ejecuta: no crea ni edita.
2. **Activar:** Settings → **Instance-level MCP** → **Enable MCP access**.
3. **Seguridad antes de conectar:** en **Allowed callback URLs**, elegir **Only trusted URLs** (por defecto se acepta cualquiera).
4. **Copiar la URL del servidor:** Connection details → **Connect** → **Server URL** (termina en `/mcp-server/http`). No va al repo ni al chat: se pega directo en el conector.
5. **Conectar con OAuth** (recomendado; la llave por API se muestra una sola vez y no aparece en la lista de clientes conectados): en la pestaña **OAuth**, elegir Claude.ai (Web) y usar **One-click setup**, o pegar la URL al agregar un conector personalizado en Claude. Aprobar el acceso cuando n8n lo pida.
6. **Exponer solo los flujos de E1.5:** cada flujo se habilita por separado (Workflow → ⋯ → Settings → **Available in MCP**). Habilitar E15-00, E1.5-01, `SW · …` y W0–W5; nada más. Dejar apagado **Auto-expose new workflows**.
7. **Verificar:** en la conversación, Claude corre `search_workflows` y lista solo esos flujos.

Reglas de uso:
- **El acceso no se separa por cliente:** cualquier cliente conectado ve todos los flujos habilitados. Revisar **Connected clients** y revocar lo que sobre.
- **Ejecutar es real:** una prueba por MCP manda mensajes de verdad por Evolution y escribe en el backend. Claude pide permiso antes de cada ejecución con efectos y solo corre contra el grupo de prueba.
- **Sin datos de personas por esta vía:** mientras E1.5 no tenga un grupo real no hay datos de participantes en n8n. Antes del grupo real (fase 6), se revisa si el acceso de Claude sigue o se revoca, y se escribe en el aviso v3.
- Apagar **Enable MCP access** desconecta a todos los clientes al instante: es el interruptor si algo sale mal.

### 2.1 Tabla, flujo y conector

1. **Data Table `e15_entrada`** con columnas de texto: `hora`, `id_mensaje`, `accion`, `tipo`, `motivo`, `evento`, `opcion`, `sticker`, `sticker_sha`, `tipo_whatsapp`, `forma`. No lleva texto, nombre ni número: no los necesita.
2. **Importar `n8n/E15-00-entrada.json`.** Enlazar la credencial *Header Auth* del ping (en la instancia se llama «Evolution API · Hostinger», encabezado `apikey`; es la única de ese tipo), elegir la tabla en el último nodo y pegar en **Config** el JID del grupo de prueba (solo ahí, nunca en el repo). Activar.
3. **Evolution:** el webhook apunta a la URL de producción de E15-00. **Cambio del 27/11 (decisión de José):** el formulario de Evolution Manager 2.3.8 no permite encabezados, así que E15-00 se protege igual que el ping, con una ruta difícil de adivinar y sin encabezado. La ruta vive solo en n8n y en Evolution, no en el repo; `E15-00-entrada.json` sigue con la ruta de plantilla y el encabezado. Solo un webhook por instancia: con E15-00 activo, el ping no recibe. Eventos `MESSAGES_UPSERT` y, para V1, `MESSAGES_UPDATE`.
4. **Exportar los 9 flujos actuales** (pendiente desde el 3/11) → `python3 n8n/separar_respaldo.py <archivo>` → `python3 n8n/qa/revisar-flujos.py n8n/flujos/`. El revisor marca corchetes que irían al grupo, credenciales sin enlazar, escrituras sin `req_id` y la falta de flujo de errores.
5. Con el MCP conectado (§2.0), Claude hace los pasos 1, 2 y 4 por su cuenta y sigue la lista de validación de las skills oficiales (`validate_workflow`, revisar conexiones, `test_workflow` con permiso). José solo pega el JID y la credencial, que Claude no debe ver.

## 3. Tramo T1 · entrada (casos con el número de prueba)

| # | Qué se manda en el grupo de prueba | `accion` esperada |
|---|---|---|
| T1.1 | `2` · `la 3` · `TODAS` · `NINGUNA` | `voto` (opción 1, 2; −1; veto) |
| T1.2 | `ME APUNTO` · `LLEGUÉ` · `YA EN CASA` · `SALIR` | `evento` |
| T1.3 | `HUMANO` · un mensaje con «accidente» o «123» | `escalar` (`pidio_humano`, `sensible`) |
| T1.4 | Charla suelta («jajaja») | `escalar` (`no_entendido`) |
| T1.5 | Tres stickers de Sintonía (01, 05, 08), cada uno dos veces | `escalar` + `sticker_sha`. **Pregunta:** ¿el sha es el mismo cada vez? Si sí, se llena el mapa sha → sticker |
| T1.6 | Una encuesta de Sintonía y un voto | V1: `voto_encuesta` si llega descifrado; `voto_sin_descifrar` si no. La columna `forma` muestra qué trae |
| T1.7 | Ubicación, audio | `escalar` (`sensible`, `medio_no_soportado`) |
| T1.8 | Un chat privado al número y un grupo que no es el de prueba | **Nada** en la tabla (`ignorar`) |

## 4. Puertas del motor

Lo que ya está en código (snippets y `entrada.js`) y lo que propone Claude para los stickers. La columna «sticker» es **propuesta**: la regla la fija el equipo antes de ver datos, y lo que E1.5 haga tiene que copiar lo que hizo el mago en E1.

| Momento | Puerta (en código) | Quién interpreta | Sticker de salida (propuesta) |
|---|---|---|---|
| Ingreso | grupo con JID válido · nada con corchetes | regla | 02, después de `/ingreso` |
| Fechas | `fechasPlan` con más de una fecha → «¿Qué día?» | regla | 04, después del mensaje |
| Opciones y encuesta | `texto('/encuesta')`; mientras está abierta no sale `/confirmado` (`n8n.N15`) | regla | 03, después de la encuesta |
| Voto | encuesta nativa (V1) o texto `1/2/3/TODAS/NINGUNA` | regla; si no entiende, IA con salida cerrada o persona (d4) | ninguno |
| Confirmado | decisión cerrada con conteos (`n8n.N1`, `n8n.N21`) · plazo (`n8n.N13`) | regla | 01, después de `/confirmado` |
| Salida | plazo cumplido; si no, no sale (`n8n.N13`) | regla | 07, después de `/salida` |
| Llegada | a la hora del plan | regla | 08, con `/checkpoint` |
| En casa | 3 h después, o al otro día 10:00 si es de noche (`n8n.N5`) | regla | 09, con `/en_casa` |
| Cierre | encuesta de cierre con enlace personal (`n8n.N18`) | regla | 11 |
| Repetir | plan 2 | regla | 12 o 13 |
| HUMANO, sensible, `/no_llega` | escala siempre | persona | **nunca** (regla de voz de `docs/stickers/README.md`) |
| Sticker que llega del grupo | `entrada.js` lo registra con su sha | por decidir: `escalar` (por defecto) o `registrar` | — |

Reglas que el motor ya cumple por código: un sticker nunca reemplaza el mensaje con datos, nunca va en seguridad y como máximo uno por momento.

## 5. Decisiones del equipo (antes de ver datos)

1. **Stickers en E1.5:** ¿salen solos? Propuesta: copiar lo que haga el mago en la prueba con Cali. Para eso, en E1 se anota qué sticker se mandó y en qué momento.
2. **Sticker que llega del grupo:** `escalar` o `registrar`.
3. **Tabla por tipo de mensaje (d4)** con la columna «quién interpreta», para Néstor.
4. **`n8n.N16`:** quién crea el grupo de WhatsApp en E1.5 (recomendado: una persona, igual que en E1).

## 6. Cómo se revisa

```bash
python3 n8n/qa/revisar-flujos.py n8n/           # antes de importar o subir un flujo
node n8n/motor/prueba-entrada.js                # entrada: 24 casos ficticios
node n8n/snippets/prueba.js                     # textos y lógica de E1: 753 casos
python3 n8n/motor/construir.py                  # regenera E15-00 si cambia entrada.js
```

## 7. ¿Flujos multiagente? Costo y beneficio (27/11)

Dos preguntas distintas: agentes **dentro del producto** (n8n le habla al grupo con un agente) y agentes **para construir** (varias sesiones de Claude trabajando a la vez).

### 7.1 En el producto: no

Se mantiene la recomendación del 27/11 (`ESTADO.md` §0, «Orquestación de E1.5 y Nod»): flujos fijos con los snippets de E1, y la IA solo clasifica, con salida cerrada, lo que las reglas no entienden. Un agente que decide y redacta rompería la copia de E1, el «nada inventado» y el conteo de errores del criterio de parada (40 %). Además, un error visible del motor cuesta más confianza que uno del mago.

### 7.2 Para construir: solo donde paga

Costos que se repiten en cualquier fase:
- **Contexto:** cada agente arranca en frío y vuelve a leer ESTADO, guías y snippets. Son más tokens y más tiempo que hacerlo en una sola sesión.
- **Coordinación:** dos agentes que tocan los mismos archivos (`n8n/`, `ESTADO.md`) chocan. La skill «sintonia-wow» detecta sesiones simultáneas, pero fusionar también cuesta.
- **Efectos reales:** con el MCP de n8n, dos agentes que ejecutan flujos pueden mandar mensajes duplicados al grupo de prueba. **Regla:** solo un agente tiene permiso de ejecutar. Los demás leen.

| Fase | ¿Multiagente? | Patrón | Beneficio | Costo | Veredicto |
|---|---|---|---|---|---|
| 0 · Base sin red | No | — | Ya está hecha | — | — |
| 1 · Conectar | No | — | Son pasos de José, en orden | — | No |
| 2 · Tramo T1 | No | — | La prueba la manda una persona; leer la tabla es una consulta | Duplicaría lecturas | No |
| 3 · Salida | **Sí, 2 roles** | El **constructor** arma SW · Enviar v2, W0 y W1. Un **verificador independiente**, que no vio la construcción y solo lee, revisa contra la consola 2.16.0: textos, puertas, corchetes, `req_id`, privacidad (qué datos pasan por cada nodo) y conexiones del flujo | Es el primer punto donde algo sale al grupo. Los snippets prueban los textos (753 casos), pero no el cableado de n8n ni qué datos pasan por cada nodo. Que el trabajo no se califique a sí mismo es la regla del Proyecto para lo de alto riesgo | Una sesión extra por entrega. El verificador no ejecuta | **Sí**, una vez antes del tramo T2 y otra si cambia SW · Enviar |
| 4 · Tramo T2 | No | — | Es una prueba en vivo y en orden; dos agentes mirando no la aceleran | Riesgo de duplicar envíos | No |
| 5 · Continuidad | **Parcial** | Primero se fija un contrato común (forma de `view=motor`, nombres de la tabla `e15_planes`, `req_id`). Después, 3 constructores en paralelo (W3 salida, W4, W5), cada uno en su rama o *worktree*, y el verificador de la fase 3 al final | W3, W4 y W5 casi no se tocan entre sí: el paralelo ahorra tiempo de calendario | Tres arranques en frío y una fusión. Si no hay apuro, en serie sale más barato | **Solo si hay apuro de fechas** cuando `view=motor` exista |
| 6 · Antes de una persona real | **Parcial** | El relay (código en el servidor, `relay/SPEC.md`) va aparte de n8n, con su propio verificador. El aviso v3 y la tabla d4 **no**: son decisiones del equipo y de Néstor | El relay es independiente de n8n y se puede construir en paralelo | Uno más que coordinar. Los textos legales no se delegan | Relay **sí**; aviso y d4 **no** |

### 7.3 Cómo se pide

- **Verificador (fase 3):** «verifica SW · Enviar v2, W0 y W1 contra la consola 2.16.0 sin ver la conversación de construcción». Recibe solo los JSON, `n8n/snippets/`, `docs/stickers/README.md` y la §4 de este plan. Entrega hallazgos con severidad (Bloquea · Validez · Ajuste) y no cambia archivos.
- **Constructores (fase 5):** se lanzan solo cuando el equipo lo pida y con el contrato común escrito. Uno solo tiene el permiso de ejecutar en n8n.
