# Sintonía · Protocolo de operación M2 (frontend 2.2.2)

*Un solo frontend para las dos condiciones, las dos en WhatsApp: **E1 · WhatsApp + mago** y **E1.5 · WhatsApp automatizado** (n8n; valor interno `E2`). Frontend 2.2.2 y backend `backend/Codigo_Piloto.gs` 2.3.2 (publicados el 24/10). Mapa de todas las vistas por fase: `piloto/investigadores.html`. Versión del 24/10/2026 (Sync P7c).*

> **La sección «Semana de pruebas (desde el 25/10)» manda sobre todo lo que sigue.** Las secciones 0–7 se conservan como referencia; donde hablan de E2 como web app o de W1/W2, ya no aplican.

## Semana de pruebas (desde el 25/10) · Sync P7c

**Diseño.** Dos condiciones en paralelo, **2 grupos por condición** (más 1 de reserva), y **2 planes por grupo** en su condición. La comparación es E1 frente a E1.5, descriptiva (n pequeño).

**Métricas principales (validadas con Néstor):** SEQ 1–7 por momento —activación, interacción y, en el plan 2, continuidad— y SUS 0–100, en el pulso de cada plan. **De contexto:** llegaron / invitadas (I2), minutos humanos por plan (I3, con mago in / mago off) y si repetirían con el grupo (Nivel 2). El resto queda como métricas secundarias en el panel.

**Antes de empezar (24–25/10)**
1. ✅ Backend **2.3.2** desplegado y `probarMontaje` en verde (24/10). Creó las hojas `usabilidad`, `sesiones` y `bitacora` y agregó `disponibilidad` y `origen` a `linea_base_grupo`.
2. Si el motor de E1.5 ya existe: propiedad **`MOTOR_KEY`** (distinta de `ADMIN_KEY`). Sin ella, el motor no puede escribir.
3. **Aviso de privacidad v2** con n8n como encargado nuevo, aprobado por Néstor, **antes** de que el motor trate datos de E1.5. Mientras no esté, E1.5 no arranca con participantes.
4. Ensayo en modo prueba de las dos condiciones, incluido «Mago in / Mago off».
5. Consola → **Ajustes** → «⟲ Empezar piloto real»: escribir `EMPEZAR PILOTO`, **sin** conservar cambios. Antes, una copia manual de la hoja (Archivo → Hacer una copia).

**Operación**
- **Consola 2.2:** elige la condición arriba (E1 / E1.5) y el grupo en la lista. «Lo que toca ahora» dice el siguiente paso y su botón lleva al lugar exacto; el recorrido muestra los pasos del grupo, plan 1 y plan 2. Pestañas: Grupo · Plan · Mensajes · Llegadas y tiempo; inventario, cambios y reinicio están en Ajustes.
- **Mago in / mago off.** Al empezar a operar un plan, «▶ Mago in». Mientras está abierta, la barra superior queda en cobalto con el tiempo y «■ Mago off». Al cerrar, los minutos se suman solos al plan con causa `sesion`. Si cambias de grupo o de plan con la sesión abierta, la consola la mueve. A las 2 h aparece un aviso; a las 4 h la sesión se cierra sola **sin minutos** y hay que registrar los reales en «Llegadas y tiempo» → Registro manual.
- **Mensajes:** /opciones, /confirmado y /retro se marcan como enviados («Marcar como enviado») para que el recorrido avance.
- **E1:** el mago crea el grupo de WhatsApp a mano (Meta no lo permite automático), envía los mensajes de la pestaña 3 y registra votos, confirmaciones y llegadas.
- **E1.5:** el motor envía los mensajes y escribe votos y llegadas con `MOTOR_KEY` (acciones `evento`, `operacion`, `proponer_ia`, `publicar_plan`, `cerrar_plan`, `redactar_ia`; `votar` es pública). Para saber quién escribió, usa `?view=resolver&key=MOTOR_KEY&grupo_id=…&wa=…`, que devuelve solo `pid` y `rol`. La persona del equipo abre «Mago in» mientras revisa lo que manda el motor.
- **Plan 2:** al cerrar el plan 1, «+ Crear plan 2 para este grupo» en la pestaña 2, en el mismo grupo de WhatsApp.
- **Contingencias:** E1.5 → «Pasar al mago» si el motor falla; las dos → «Pasar a la web» si WhatsApp cae. El plan queda marcado y fuera de la comparación.
- **Inscripción:** una sola pregunta de tamaño («¿Cuántas personas van a este plan, contándote?») y la disponibilidad del organizador (días y franjas). El enlace del anuncio de Instagram puede llevar `&origen=ig`.

**Fuera del piloto:** botón de pánico (hoja de ruta).

---

## 0. Antes de todo: el sismo del 10/8/2026

El terremoto de magnitud 7,4 afectó más de 12.000 edificaciones en Cali. Varios escenarios culturales cerraron para revisión estructural. Por eso el inventario arrancó con un solo lugar activo (Ciclovida). **Tras la ronda de llamadas del 4/10 hay 17 lugares activos** y 10 siguen en `por_confirmar` (INV-01, 04, 06, 09, 13, 14, 15, 18, 21 y 22). Antes de cada fin de semana se reconfirman horarios y cierres.

- **Ronda de llamadas (antes del jueves 9/10):** consola → pestaña Inventario → "Ronda de llamadas". Por cada lugar hay que confirmar tres cosas: que abrió tras el sismo, el horario del fin de semana y el costo. Luego se cambia `estado` a `activo` y se pone la fecha en `verificado_el`. Meta: 12–15 lugares activos que cubran aire libre, café, cultura, comida y noche.
- Los teléfonos marcados **"sin verificar · lista Gemini"** no coinciden con los que aparecen en fuentes públicas. Úsalos solo si no hay otro número.
- **Para Néstor y el comité:** el contexto cambió después del aval. Conviene confirmar que el riesgo sigue siendo mínimo y que el tono de los mensajes es adecuado para una ciudad en recuperación. También se sugiere preferir lugares abiertos o ya inspeccionados.

## 1. Montaje (Jose)

1. En Apps Script, pega el código **v2.2.2**. En Implementar → Gestionar implementaciones → editar → **Nueva versión**. Quién tiene acceso: **"Cualquier usuario"**. La URL no cambia.
2. Configura las propiedades del script:
   - `SHEET_ID`
   - `ADMIN_KEY`, de 20 caracteres o más
   - `GEMINI_API_KEY`, con la facturación activa
   - `GEMINI_MODEL = gemini-2.5-flash`
   - `PRICE_IN_PER_M = 0.30` y `PRICE_OUT_PER_M = 2.50`: precio estándar pagado de Gemini 2.5 Flash en ai.google.dev/pricing, revisado el 4/10/2026. Los valores 0,075 y 0,30 de la guía de Gemini subestiman el costo.
   - `AVISO_VERSION = v1-2026-10`
   - `COSTO_HORA_HUMANA_COP`, que es opcional
   - `TOLERANCIA_MIN = 15`, también opcional
3. Pon la zona horaria del proyecto en **America/Bogota**.
4. Pega `Inventario_Planes_Cali.csv` (27 lugares, 14 columnas) en la hoja `inventario`.
5. Corre `probarMontaje` con el botón ▶ Ejecutar (no con Depurar). Todo debe salir en ✅; si los encabezados se reparan solos, sale 🔧.
6. Pon el correo de contacto en `CONFIG.CONTACTO_EMAIL`, dentro de `assets/sintonia.js`.

## 2. Ensayo de punta a punta · jueves 9/10 (modo prueba)

En la consola, pestaña 1, el filtro "Ver" tiene que estar en **Prueba**.

**E1** · `index.html?exp=E1&modo=prueba`
1. Inscribe un organizador y 3 invitados. Uno de los invitados marca casilla por casilla y otro usa «✓ Acepto las 4 autorizaciones».
2. Cierra el reclutamiento (debe quedar 4/4 y activo). Crea el grupo de WhatsApp desde el número Sintonía y envía `/ingreso`.
3. Crea el plan, pide las opciones a Gemini, edita una y publica. Envía `/opciones`.
4. Registra en la consola los votos que lleguen por el chat. Cierra el plan con día y hora, y envía `/confirmado`.
5. Registra "Me apunto", "Llegó" y "En casa". Registra 5 minutos de trabajo humano.
6. Prueba la contingencia: "Pasar a la web" en un segundo plan de prueba. Comprueba que el plan quede marcado y que el enlace web funcione.

**E2** · `index.html?exp=E2&modo=prueba`
1. Inscribe un organizador y 2 invitados; cada uno guarda su enlace personal.
2. Publica un plan. Vota desde `plan.html`, prueba el veto y mira que el conteo se actualice.
3. Cierra el plan con día y hora. Marca "Me apunto" y "¡Llegué!".
4. Llena la retro como organizador, con disposición a pagar y preventa, y como miembro.

**Panel:** los grupos de prueba no deben sumar. Antes del 10/10, cambia a mano en la hoja `grupos` el `modo` de un grupo de prueba a `piloto`, verifica las métricas y devuélvelo a `prueba`.

**Empezar el piloto real (después del ensayo, antes del 10/10).** En la consola, pestaña **«⟲ Empezar piloto real»** (`mago.html#reinicio`):
1. Revisa los conteos: se borra todo lo de los ensayos (grupos, personas, contactos, votos, eventos, minutos, pulsos y, salvo que marques conservarlo, cambios). Se conservan `tokens`, `inventario` y `bitacora`.
2. Escribe `EMPEZAR PILOTO` y confirma. El backend copia antes las pestañas a una hoja de respaldo nueva en el Drive del dueño del script, sin `contactos`, y deja el reinicio en `bitacora`.
3. Comprueba en el panel que no quedan grupos. Los enlaces personales de los ensayos dejan de funcionar: es lo esperado.
4. Requiere el backend 2.2.4 desplegado (si no, la pestaña lo avisa).

## 3. Asignación para W1 (10–11/10) y W2 (17–18/10)

| Grupo | Tipo | Condición |
|---|---|---|
| G-01 | Amigos | E1 |
| G-02 | Amigos | E2 |
| G-03 | Familia o pareja | E1 |
| G-04 | Familia o pareja | E2 |
| G-05 | Reserva | La condición que quede desbalanceada si un grupo se desestima (I9) |

Cada grupo se queda en la misma condición en W1 y W2. La comparación es descriptiva, porque el n es pequeño.

## 4. Operación por condición

- **E1:** todo pasa en el grupo de WhatsApp del número Sintonía. El mago usa los mensajes de la pestaña 3 y registra en la consola los votos, las confirmaciones y las llegadas. Cada bloque de trabajo se anota en minutos, con su causa (I3).
  - **Primer contacto (2.0.4):** en la pestaña 1, «Abrir chat con mensaje» abre WhatsApp con el primer mensaje ya escrito. Revísalo antes de enviarlo.
  - **Grupo del plan:** Meta no permite crearlo automáticamente desde una cuenta sin verificar. Con el grupo activo, copia nombres y números desde la tarjeta «Crear el grupo del plan», crea el grupo a mano desde el número Sintonía y envía `/ingreso`.
  - **Día del plan:** en la pestaña 3 elige a la persona en «Para» y usa `/no_llega` si no ha registrado llegada; los mensajes al grupo se copian y pegan en el grupo.
  - **W2:** el segundo plan va en **el mismo grupo de WhatsApp**. Al cerrar el plan de W1, usa «Crear ronda 2 para este grupo» en la pestaña 2.
- **E2:** el grupo usa sus enlaces personales en `plan.html`. El mago solo cura las opciones y cierra el plan. No escribe a los miembros.

## 5. Contingencias

| Situación | Condición | Qué hacer | Registro |
|---|---|---|---|
| WhatsApp bloqueado, reportado o caído | E1 | Consola → plan → "Contingencia · Pasar a la web". Envía a cada persona su "Enlace web" (pestaña 1), por el canal autorizado que siga disponible. | El plan queda marcado `E1>E2` y **se saca de la comparación**; el panel lo reporta aparte. Minutos con causa `falla_tecnica`. |
| Pasan 2 horas desde la publicación y faltan votos | E2 | El aviso de la consola se pone en amarillo. Escríbele **solo al organizador** con el botón "Avisar al organizador". | Minutos con causa `recordatorio`. Es una intervención humana en E2 y se reporta. |
| Gemini caído o sin cuota | Ambos | Usa "+ Opción manual" con lugares del inventario activo. | Minutos con causa `falla_tecnica`; sin tokens. |
| Alguien pide retirarse | Ambos | Pestaña 1 → "Revocar y purgar". En E1, se saca a la persona del grupo de WhatsApp. | El grupo queda desestimado (I9). Hacerlo en menos de 15 min. |
| Un lugar cerró o cambió de horario | Ambos | Cambia el `estado` del lugar en la hoja. Si el plan ya se cerró, usa "Marcar como caído" con la causa que corresponda. | Causa de la caída (S9). |
| Riesgo para la seguridad o emergencia | Ambos | Envía `/humano`. Si es grave, llama al 123. | Minutos con causa `seguridad`. |

## 6. Un solo cambio entre W1 y W2 (I4)

El domingo 11/10, después de W1, el equipo revisa el panel y elige **una** mejora por condición. Se registra en la consola, pestaña "Cambios (I4)". La versión de los grupos de esa condición sube a `v2`. Si se intenta registrar un segundo cambio, la consola avisa. Decisión pendiente del equipo: si ese aviso debe pasar a ser un bloqueo.

## 6 bis. Usabilidad: SEQ + SUS (desde el 14/10, fuera de I4)

Sugerencia de Néstor, validada por el equipo el 14/10. Se mide en **E1 y E2 por igual**, así que es instrumentación y no un cambio del tratamiento: **no se registra en «Cambios (I4)» ni sube la versión de los grupos**.

- **Qué se pregunta** (dentro del pulso, `retro.html`, después de las preguntas de siempre):
  - **SEQ** (*Single Ease Question*, 1 = muy difícil · 7 = muy fácil), una por momento del modelo: **activación** (unirse y elegir el plan), **interacción** (coordinar el día del encuentro) y **continuidad** (volver a armar un plan con el mismo grupo). La de continuidad **solo aparece desde la ronda 2**, porque en W1 todavía no hay una segunda salida; tiene la opción «No participé en armar este segundo plan».
  - **SUS** (*System Usability Scale*, 10 afirmaciones, 1–5). El backend calcula el puntaje 0–100. Se puede omitir completa («Prefiero no responder»), por voluntariedad.
  - El pulso pasa de unos 2 a unos 4 minutos; los textos del pulso y del mensaje `/retro` ya lo dicen.
- **Montaje:** desplegar el backend **2.2.6** (Implementar → Gestionar implementaciones → editar → Nueva versión; la URL no cambia) y correr `probarMontaje`, que crea la hoja `usabilidad`.
- **Dónde queda:** hoja `usabilidad` (una fila por persona y plan), con `toma` = `con_pulso` o `diferida` y `dias_desde_encuentro`.
- **W1, recolección diferida (decisión del 14/10):** quien ya respondió el pulso de W1 abre el **mismo enlace del pulso de W1** y ve solo el bloque de usabilidad («Nos falta una parte»).
  1. Consola → plan de W1 (cerrado) → «Enlaces personales al pulso». Cada persona aparece como «usabilidad pendiente» o «usabilidad ✓».
  2. «Enviar complemento» abre WhatsApp con un texto único. **Mismo texto y mismo canal en E1 y E2**, para no darle a una condición un contacto que la otra no tiene.
  3. Enviar **antes del 16/10** (antes del ensayo y de W2), para que la medición de W1 no se mezcle con la experiencia de W2.
  4. Esos minutos **no** se registran en la pestaña de minutos (I3 mide la operación del servicio, no la de la investigación).
- **Cómo se lee en el panel:** por ronda y por toma. La toma diferida de W1 tiene **sesgo de recuerdo** (la SEQ está pensada para responderse justo después de la tarea) y se reporta aparte. Con el n del piloto, SEQ y SUS son **descriptivos**: no se interpretan contra benchmarks (p. ej., el 68 de SUS) ni como diferencia E1/E2.
- **Pendiente con Néstor:** (a) la traducción del SUS es una adaptación del equipo, no una versión validada en español; (b) en E1 hay una persona detrás del chat, así que el ítem 4 del SUS («ayuda de alguien que sepa») puede leerse distinto que en E2; (c) confirmar que el contacto diferido de W1 entra en el consentimiento y en el aval (el aviso se aclaró el 14/10 sin cambiar de versión).

## 7. Cierre del estudio

Usa el menú de la hoja: "Borrar datos al cerrar el estudio". Borra contactos, preferencias y textos libres, y quedan solo las métricas con ids seudónimos.
