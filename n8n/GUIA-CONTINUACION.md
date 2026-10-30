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
