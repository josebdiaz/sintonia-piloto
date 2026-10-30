# Prompt para el constructor de IA de n8n · E1.5 completo

**Qué es:** un prompt para pegar en el asistente o constructor de IA de n8n (si tu plan lo incluye), o en cualquier modelo que genere flujos de n8n. Arma el recorrido completo del storyboard M2 con la opción C (automatización asistida).

**Antes de pegarlo:**
- No contiene claves. No agregues `MOTOR_KEY` ni `ADMIN_KEY` al prompt.
- La URL del backend es la misma que usa la web pública; no es secreta.
- Revisa lo que genere antes de activarlo. La primera prueba siempre en modo prueba con el equipo.
- Ya existe `E15-01-voto-minimo.json` (mensajes entrantes). El prompt pide reutilizarlo, no rehacerlo.

---

## Prompt (copiar desde aquí)

You are building n8n workflows for **Sintonía E1.5**, a research pilot where a small group of friends in Cali, Colombia, plans an outing inside a WhatsApp group. An "engine" (n8n) does the work; a human from the research team reviews every outgoing message and **copies and pastes it into the WhatsApp group by hand**. There is no WhatsApp API in this design. Do not add any WhatsApp node, unofficial gateway, or browser automation.

### Goal: a seamless experience for two people

1. **The participant** must feel one continuous, calm conversation: the right message at the right moment, never two messages at once, never a question without context, same wording as the human-only condition (E1).
2. **The reviewer** (team member who pastes) must do as little as possible: get one notification per step, with the final text ready, a one-click **Approve** (or Edit / Reject), then paste. Everything else (backend calls, timers, logging) is automatic.

### The journey (storyboard M2) and what the engine does in each frame

| Frame | What happens | Engine |
|---|---|---|
| 1 · Intention | Friends want to meet but agendas don't align | Out of scope (Instagram ad → landing) |
| 2 · Sign-up | Organizer fills the landing form with consents | Out of scope (landing writes to the backend) |
| 3 · Everyone accepts | Friends accept the invitation | Out of scope. The reviewer creates the WhatsApp group by hand |
| 4 · Curation | A person reviews options at a laptop | **W1**: `proponer_ia` → human review of the options → `publicar_plan` → `/opciones` |
| 5 · Voting | Group votes 1, 2 or 3 in the chat | Inbound handled by the existing **E15-01** workflow. **W2**: one reminder after 2 h if votes are missing |
| 6 · Logistics | Departure time, traffic, rain, meeting point | **W3**: human confirms winner, day and time → `cerrar_plan` → `/confirmado`; then `/salida` 2 h before the meeting |
| 7 · Arrival | People check in on arrival | **W4**: `/checkpoint` at meeting time; LLEGUÉ handled by E15-01; `/llegaron` when all arrived |
| 8 · Back home | Night, calm, short survey | **W5**: `/en_casa`, then `/retro` (survey link) |

After plan 1, the reviewer creates plan 2 in the console and the same workflows run again.

### Build these workflows

Build each as its own workflow, plus one shared sub-workflow. Keep them small and readable, with a sticky note on each explaining it in Spanish.

**SW · "Aprobar y pegar" (sub-workflow, called by all others).**
Input: `paso`, `texto`, `plan_id`, `evento_msg` (optional).
- Send the reviewer a notification with the final text and an approval request using a **Send and Wait for Response** node with response type **Custom Form**: fields `decision` (Aprobar / Editar / Rechazar) and `texto_final` (textarea prefilled with `texto`). Make the channel a single node so it can be swapped. Default to **Telegram**, and leave email as a disabled alternative node.
- Limit wait time to 6 hours. On timeout, return `decision = vencido`.
- If approved or edited: return `texto_final` and show it in a copy-friendly format (plain text, no markdown). Then wait for a second confirmation "Ya lo pegué en el grupo" (Approval type). Only after that confirmation, if `evento_msg` is set, call the backend `evento` with that type and `pid: ''`.
- If rejected or expired: do nothing in the backend and return the decision.

**W1 · "Plan creado → opciones".** Trigger: n8n Form "Plan creado" with fields `plan_id` and `pid_organizador` (the reviewer gets both from the console). Steps: `proponer_ia` → format the options for review (title, stops, departure time, budget, and `por_que`) → SW with the `/opciones` text → on approval, `publicar_plan` → `evento msg_opciones`. Save `plan_id`, `pid_organizador` and `t_publicado` in an **n8n Data Table** named `e15_planes` so later workflows know the state. If `proponer_ia` fails or returns no options, notify the reviewer to use "Pasar al mago" in the console.

**W2 · "Recordatorio de voto".** Trigger: Schedule every 15 minutes. For each row in `e15_planes` with `estado = votando`, at least 2 h since `t_publicado`, and `recordatorio_enviado` empty: read `GET ?view=plan&pid=<pid_organizador>&plan_id=<plan_id>`. If `n_votos < n_invitados`, call SW with the `/recordatorio` text (group version, without names, using the number of missing votes) and `evento_msg = recordatorio`. Mark `recordatorio_enviado`. **Only once per plan.**

**W3 · "Cierre y salida".** Trigger: n8n Form "Cerrar plan" with `plan_id`, `opcion_ganadora` (1–3), `fecha_hora_encuentro` (YYYY-MM-DD HH:mm, Cali time), `hora_salida`, and optional `direccion`. Read the plan, then show the vote count to the reviewer in the form's confirmation page before closing. Steps: `cerrar_plan` (with `elegida` = opción − 1) → SW with `/confirmado` and `evento_msg = msg_confirmado` → store `hora_encuentro` in the Data Table → **Wait** until 2 h before the meeting → SW with `/salida` and `evento_msg = salida_sugerida`.
If the reviewer marks the plan as fallen, call `cerrar_plan` with `caido: true` and `causa_caida` (one of `trafico`, `lluvia`, `agenda`, `costo`, `desinteres`, `imprevisto`, `otro`) and send nothing to the group.

**W4 · "Día del plan".** Trigger: Schedule every 15 minutes. At `hora_encuentro`: SW with `/checkpoint` (no backend event type for this one). From then on, read `view=plan` every 15 minutes for up to 3 hours. When everyone has arrived, SW with `/llegaron`. If after 30 minutes some people have not arrived, **only notify the reviewer** that someone has not checked in. Do not draft per-person messages, because the engine does not know names.

**W5 · "En casa y pulso".** 3 h after `hora_encuentro`: SW with `/en_casa`. The next day at 10:00 (Cali time): SW with `/retro`, group version, and `evento_msg = msg_retro`. Personal survey links (`retro.html?pid=…&plan_id=…`) are sent from the console, not by the engine.

**W0 · "Ingreso" (optional).** Trigger: n8n Form "Grupo creado" with `grupo_id`. SW with `/ingreso` and `evento_msg = msg_ingreso`.

### Backend contract (Google Apps Script)

- URL: `https://script.google.com/macros/s/AKfycbwbh_qzXHXpeY5Z3LiTsoH855lDFE3Ezd45PFQqyKRjEFQaRkydhHFto_-OSae_U9Mf/exec`. Store it once in a Set node named `Config`.
- **POST**: JSON body. **Always enable Follow Redirects** (Apps Script redirects). Response is `{ ok: true, … }` or `{ ok: false, error: '<code>' }`. Always check `ok`, and on `ok: false` notify the reviewer with the error code.
- **Auth:** never write the key in the workflow. Use the existing Custom Auth credentials: **`Sintonia MOTOR_KEY (body)`** for POST and **`Sintonia MOTOR_KEY (qs)`** for GET.
- The key only allows: `evento`, `operacion`, `proponer_ia`, `publicar_plan`, `cerrar_plan`, `redactar_ia`, and `GET view=resolver`. Do **not** call `crear_plan` or any other action. `GET view=plan` and `POST votar` are public and need no credential.

| Call | Body or query |
|---|---|
| `proponer_ia` | `{ action, plan_id, restricciones? }` → `opciones[]` with `titulo, hora_salida, presupuesto_aprox, por_que, paradas[{ id, nombre, zona, costo_aprox, horario }]` |
| `publicar_plan` | `{ action, plan_id, opciones? }` (max 3) |
| `cerrar_plan` | `{ action, plan_id, elegida, hora_encuentro: 'YYYY-MM-DD HH:mm', hora_salida? }` or `{ action, plan_id, caido: true, causa_caida }`. Errors: `falta_hora_encuentro`, `plan_ya_cerrado` |
| `evento` | `{ action, plan_id, pid: '', tipo }`, with `tipo` one of `msg_ingreso`, `msg_opciones`, `msg_confirmado`, `msg_retro`, `recordatorio`, `salida_sugerida` |
| `GET view=plan` | `?view=plan&pid=…&plan_id=…` → `estado` (`sin_plan`, `preparando`, `votando`, `cerrado`, `caido`), `opciones`, `conteo`, `n_votos`, `n_invitados`, `elegida`, `hora_encuentro`, and arrivals |
| `redactar_ia` | Optional, only to adjust tone. Never use it to change content |

### Message texts (use exactly these, in Spanish, so E1 and E1.5 say the same)

Fill `{…}` from the plan data. If a value is missing, leave the bracket placeholder visible (for example `[dirección]`) so the reviewer fills it in during approval.

- **/ingreso**: «¡Hola, parche! 👋 Soy Sintonía, el quinto amigo que ayuda a que el plan sí se dé: menos vueltas y opciones reales en Cali.\nLes propongo opciones, ustedes votan y yo me encargo de cuadrar la logística.\nTodas las personas de este grupo dieron su autorización. En este piloto una persona del equipo revisa todo lo que propongo.\n👤 Si necesitan hablar con alguien del equipo, escriban HUMANO.\n🚪 Si alguien quiere salir, escribe SALIR o sale del grupo, sin problema.\n🔒 Aviso de privacidad: https://josebdiaz.github.io/sintonia-piloto/piloto/aviso.html»
- **/opciones**: «Les traigo {n} opciones:\n{lista}\n\nVoten con el número. Si les sirve cualquiera, escriban TODAS. Si ninguna les sirve, escriban NINGUNA y busco otra cosa. Cerca, corto y posible.». Each line of `{lista}` is `{i}️⃣ {titulo} — {paradas separadas por →} · salida {hora_salida} · {presupuesto_aprox}`.
- **/recordatorio** (group version; the console names who is missing, but the engine has no names, so the reviewer may replace the count with names during approval): «⏳ Para cerrar los detalles con tiempo nos faltan {faltan} votos. ¿Cuál les suena más: 1, 2 o 3? Si les sirve cualquiera, escriban TODAS; si ninguna sirve, también vale decirlo.»
- **/confirmado**: «¡Quedó! Ruta clara, ganas intactas:\n📍 {plan} — {lugar}\n📌 Dirección: {dir}\n🕒 Encuentro: {hora}\n🚗 Salida sugerida: {salida}. En Cali la hora pico y la lluvia cambian los tiempos; mejor salir con margen.\n💰 Presupuesto aprox.: {presupuesto} por persona\nRespondan ME APUNTO si van o NO PUEDO si no alcanzan.»
- **/salida**: «🚗 Para llegar a {lugar} a la hora ({hora}), salgan a las {salida} (si llueve o hay trancón, mejor un poco antes).»
- **/checkpoint**: «¿Ya llegaron? Cuando estén en el sitio respondan LLEGUÉ. No usamos su ubicación. Y al volver, un "ya en casa" nos deja tranquilos.»
- **/llegaron**: «¡Ya está todo el parche! 🙌 Disfruten. Al volver, un "ya en casa" nos deja tranquilos.»
- **/en_casa**: «¿Ya todos en casa? Cuando lleguen, un "ya en casa" basta. Gracias por sintonizar hoy.»
- **/retro** (group version): «¿Cómo les fue? Si hubo sintonía, sigan 🙌\nCuéntennos en 4 minutos (ábranlo en el mismo celular con el que se registraron): https://josebdiaz.github.io/sintonia-piloto/piloto/retro.html\nSus respuestas son privadas.»

`{plan}` is the winning option's title. `{lugar}` is its stops, each as `nombre (zona)` and joined with →. `{hora}` is `hora_encuentro` in a friendly Spanish date format. `{salida}` and `{presupuesto}` come from the winning option.

### Non-negotiable rules

1. **Human approval before every group message and before `publicar_plan` and `cerrar_plan`.** The backend does not enforce this, so the workflows must.
2. **Only places from `proponer_ia`** (active inventory). Never let any node invent places, prices or times.
3. **No AI Agent or LLM nodes inside n8n.** Text comes from the templates above, and tone adjustments only from the backend's `redactar_ia`. This keeps the list of data processors unchanged for the privacy notice.
4. **Data minimization:** store only `plan_id`, `pid_organizador`, timestamps and flags in the Data Table. No names, phone numbers or message text. In every workflow's settings, turn off saving execution data (success, error and manual).
5. **One message per moment.** Before sending any step, check the Data Table and `view=plan` so a step never fires twice or out of order. If `estado` is `caido`, stop all pending steps for that plan.
6. **Escalate, never improvise.** On any error, unknown state or timeout, notify the reviewer in plain Spanish ("Usa «Pasar al mago» en la consola") and do not message the group.
7. **Time zone:** America/Bogota for all schedules and Wait nodes.
8. **Test mode first:** everything is tested with groups created as `index.html?exp=E2&modo=prueba`.

### Acceptance checks

- A test group completes plans 1 and 2 with the reviewer only approving and pasting.
- The console shows `msg_opciones`, `msg_confirmado` and `msg_retro` marked as sent, plus votes and arrivals.
- Rejecting a message stops that step and nothing is logged.
- A plan marked `caido` stops reminders, `/salida` and the day-of messages.
- Exported workflow JSON contains no keys.

---

## Notas para el equipo (no pegar)

- **Q4 (quién aprueba y por qué canal)** sigue abierta. El prompt usa Telegram por defecto y deja el correo como alternativa. Si elegimos otro canal, solo cambia un nodo del sub-flujo «Aprobar y pegar».
- **Q3 (pulso para quien nunca escribió):** el prompt deja los enlaces personales del pulso a la consola, como hoy.
- **Q2 (detectar el plan creado):** se resuelve con el formulario «Plan creado» de W1, que llena la persona que revisa. No hace falta cambiar el frontend.
- **Aviso v2:** si el constructor de n8n procesa este prompt con IA, el prompt no lleva datos de participantes, así que no cambia el aviso. Los flujos sí: n8n y Telegram (si se elige) deben aparecer como encargados en el aviso v2 antes de usar datos reales.
- **Diferencias de texto con E1 (a declarar en el protocolo):** `/recordatorio` dice cuántos votos faltan en vez de los nombres, salvo que quien aprueba los ponga. `/no_llega` no lo redacta el motor. Los demás textos son idénticos a la consola (`piloto/mago.html`, arreglo `TPL`, rama `e3-ds-3.0`).
- **Revisar después de generar:** credenciales enlazadas por nombre, Follow Redirects en cada nodo HTTP, zona horaria del flujo y que no haya nodos de IA.
