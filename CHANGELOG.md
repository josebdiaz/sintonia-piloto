# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Cada componente usa [SemVer](https://semver.org/lang/es/) y su propio tag de git.
Las fechas son de 2026 (hora de Colombia).

## Repositorio

### 2026-10-04 · Reestructura
- Estructura por componentes: `piloto/`, `backend/`, `datos/`, `docs/`, `archivo/`.
- El frontend en uso pasa de `/M2-Claude/` a la URL estable `/piloto/`. `404.html` redirige las URLs anteriores con sus parámetros.
- La raíz deja de ser la landing de H1 y pasa a ser el portal del proyecto.
- Todo lo de antes del pivote (H1–H4, panel de investigadores, decks de P4) pasa a `archivo/p4-pre-pivote/`.
- Las versiones M1-Claude, M1-gemini y M2-gemini pasan a `archivo/` y quedan sin conexión al backend del piloto.
- Las ramas `M1-Claude`, `M1-gemini` y `M2-gemini` se convierten en tags (`piloto/v1.0.0`, `archivo/gemini-m1`, `archivo/gemini-m2`). Desde ahora solo existe `main` más ramas cortas de trabajo.
- Historial del backend y del inventario reconstruido en commits propios, a partir de las copias de respaldo del equipo.

## Frontend del piloto (`piloto/`)

### [2.0.7] · 2026-10-06 · Recomendaciones de la prueba de punta a punta (6/10)
- Consola, curaduría: al cerrar se confirma la **salida sugerida** (prellenada desde la opción ganadora) para que no contradiga la hora del encuentro (R2). En un plan cerrado, **«Corregir hora del encuentro»** cambia la hora y la salida sin tocar el cierre ni la opción elegida (R1, pendiente desde el 5/10).
- Consola, curaduría: «+ Crear plan» solo aparece si el grupo no tiene un plan en curso (R7).
- Consola, eventos y minutos: muestra los minutos y bloques registrados en el plan (R5, pendiente desde el 4/10). Los mensajes marcados como «✓ Hecho» salen de la hoja, así que José y Katherine ven lo mismo en cualquier computador (R6).
- Consola: las confirmaciones pasan a **dos toques dentro de la página** (cerrar reclutamiento, revocar, publicar, cambio de canal, caído, cambio W1 → W2). `confirm()` y `prompt()` se cerraban solos en navegadores integrados (R8, pendiente desde el 4/10). Revocar ya no pide escribir REVOCAR.
- Consola: pestañas en dos filas, operación (1–4) arriba y configuración abajo (R12).
- Plan: **«Retirarme del piloto»** en dos pasos al final de la página de cada persona (R3, Ley 1581 · I9). Con el plan cerrado, **«Agrégalo a tu calendario»** (Google y .ics, aviso 2 h antes) (R13).
- Inscripción: «Ya contamos contigo: faltan las otras N personas» y, en E1, «Ver quién ya aceptó» (R11). El botón de consentimiento pasa a «✓ Acepto las 4 autorizaciones», para no confundirlo con el «Sí a todo» de la votación (R10).
- Todos los códigos de error del backend tienen mensaje en lenguaje claro (R9).
- Requiere el backend 2.2.5 para R1, R5, R6 y R7; con la 2.2.4 la consola funciona y lo avisa donde falte.

### [2.0.6] · 2026-10-06 · Empezar el piloto real y mapa para investigadores
- Consola: pestaña nueva **«⟲ Empezar piloto real»**. Muestra cuántos registros hay en cada pestaña de la hoja, qué se borra y qué se conserva (tokens, inventario y bitácora; opcionalmente cambios W1 → W2). Pide escribir «EMPEZAR PILOTO», hace un respaldo sin contactos, borra los ensayos y deja la consola en modo Piloto. Lista los reinicios anteriores con su respaldo. Requiere el backend 2.2.4.
- Página nueva `piloto/investigadores.html` («Mapa del piloto»): todas las vistas front (participantes) y back (equipo, backend, hoja) en tarjetas, ordenadas por fase de ejecución (preparación → ensayo → empezar piloto → W1 con carriles E1/E2 → entre rondas → W2 → cierre). Filtros por tipo de vista y por experimento; marca la fase actual. Fuera de buscadores y sin enlace desde el portal.
- Consola: `mago.html#reinicio`, `#planes`, `#cambios`, etc. abren directamente esa pestaña. Botón «Mapa» en la consola y en el panel.
- Aviso de privacidad: queda el correo de consultas y reclamos (jbolanos.dmi@gmail.com).

### [2.0.5] · 2026-10-06 · Experimentos identificados de punta a punta
- Consola: arriba se elige **qué experimento se está operando** (E1 · WhatsApp + mago o E2 · Web app) y el modo (piloto o prueba). Grupos, planes, mensajes y eventos se filtran por esa elección, con color propio para cada experimento.
- Consola: guía plegable «Cómo funciona E1/E2» con qué se prueba, qué hace el grupo, qué hace el mago, qué se mide, los pasos en orden (con enlace a cada pestaña) y el enlace de inscripción del experimento.
- Consola: los planes se nombran por ronda y fin de semana (Ronda 1 · W1 · 10–11/10; Ronda 2 · W2 · 17–18/10).
- Consola, eventos: el estado de cada persona se cambia con un menú (E1); en E2 solo se ve, porque lo marca la página. Los mensajes del mago al grupo quedan como «✓ Hecho a las hh:mm» al marcarlos (la hora se guarda en el navegador; el evento, en la hoja).
- Consola, mensajes: en E2 se explica que el mago no escribe al grupo y solo queda el recordatorio al organizador. En E2 tampoco se ofrece enviar el pulso por WhatsApp.
- Consola, cambios W1 → W2: una tarjeta por experimento con su estado, un ejemplo y la explicación de la regla I4.
- Inscripción: la etiqueta dice el canal desde el primer momento («Piloto · Cali · por WhatsApp» o «· en la web»).
- Votación: «¿Cuál les suena?» y un botón destacado «Sí a todo» al inicio (me sirve cualquiera). Se guarda como opción -1: cuenta como voto y no elige opción; funciona con el backend 2.2.3 sin cambios. En E1, la consola registra «TODAS» como «Sí a todo» y los mensajes lo explican.
- Sin cambios de backend: sigue con la implementación 2.2.3.

### [2.0.4] · 2026-10-06 · QA de la sesión P6 b (5/10)
- Inscripción: las dos preguntas de personas se distinguen («¿Cuántas personas tiene tu parche?» y «¿Cuántas van a este plan, contándote?») y una frase confirma la diferencia antes de seguir.
- Consola, grupos: «Abrir chat con mensaje» deja escrito el primer mensaje de Sintonía según el estado del grupo y el rol de la persona (solo E1; en E2 el mago no escribe a los miembros y la pestaña de mensajes lo recuerda). En E1, con el grupo activo, una tarjeta explica que el grupo de WhatsApp se crea a mano y copia nombres y números.
- Consola: recarga automática cada 60 s en la pestaña de grupos (sin borrar lo que se esté escribiendo) y hora de la última actualización.
- Consola, planes: se muestran las preferencias que el parche escribió al inscribirse (Gemini ya las recibe) y el campo de Gemini pide solo lo de este plan. Al cerrar un plan, botón para crear la ronda siguiente en el mismo grupo de WhatsApp.
- Consola, mensajes: selector «Para» (todo el grupo o una persona) con «Abrir chat con …» para mensajes individuales; mensajes nuevos de checkpoint por persona (/no_llega), hora de salida, «ya llegaron todos» y «¿ya en casa?»; orden según el momento del plan.
- Consola, mensajes: «Ajustar con Gemini» dentro de cada mensaje, enviando su objetivo y su texto base. Corrige que el checkpoint devolviera el texto de activación. El texto generado queda en una caja editable que crece con el contenido (antes se salía de la caja).
- Consola, eventos: tabla por persona con el estado en color (sin respuesta, se apuntó, no puede, llegó, en casa); los mensajes del mago al grupo van en una tarjeta aparte; se aclara que los botones registran y no envían.
- Consola, minutos: etiquetas claras para el rol de quien trabajó y la causa.
- Sin cambios de backend: sigue con la implementación 2.2.3.

### [2.0.3] · 2026-10-05
- Validado en vivo en modo prueba (5/10): invitación del organizador, número repetido rechazado, «Ya aceptaste», grupo completo, etiqueta «Modo prueba», pulso bloqueado antes del encuentro y abierto después, «Volver a mi plan» y mensaje de revocado.
- El frontend apunta a la implementación del backend 2.2.3 (`…OSae_U9Mf/exec`). La 2.0.2 seguía llamando a la implementación anterior (`…iiszymTNC`, código 2.2.2), así que los bloqueos de duplicados y la invitación del organizador no estaban activos.

### [2.0.2] · 2026-10-05 · revisión de flujos de navegación
- Una persona = un consentimiento: si el celular ya aceptó la invitación, se muestra «Ya aceptaste» con su enlace; el backend rechaza un número repetido en el grupo (requiere backend 2.2.3).
- `unirse.html` consulta el estado de la invitación antes del formulario: grupo cerrado, completo o desestimado, y etiqueta «Modo prueba».
- El logo y «Inicio» llevan al plan de la persona (o al portal); ya no abren la inscripción sin condición. `index.html` sin `?exp=E1|E2` no inscribe a nadie.
- El aviso de privacidad ofrece «Volver» a la página anterior, sin perder el formulario ni la condición.
- El pulso se abre desde la hora de encuentro (antes se podía responder antes de salir).
- Mientras el grupo recluta, el organizador ve su enlace de invitación (copiar / WhatsApp) y cuántos aceptaron, en E1 y E2.
- Teléfono compartido: un `?pid=` distinto reemplaza toda la identidad guardada; el rol sale del backend.
- «Volver a mi plan» después del pulso; mensaje propio para quien se retiró; enlaces Consola ↔ Panel.
- Probado con el backend 2.2.3 simulado: 13 casos de navegación y regresión de inscripción E1.

### [2.0.1] · 2026-10-04
- Validado con una prueba de punta a punta en `modo=prueba` contra el backend real (4/10): inscripción, consentimiento, propuesta de Gemini, votación, cierre, llegada, retro, panel y revocación.
- El frontend apunta a la implementación nueva del backend 2.2.2 (`…iiszymTNC/exec`). La implementación anterior (`…CLY-7cf/exec`) seguía con el código 2.2.1.

### [2.0.0] · 2026-10-04 · «M2»
- Un solo frontend para E1 (WhatsApp + mago) y E2 (web app).
- Consola del mago: ronda de llamadas del inventario post-sismo con teléfonos, contingencia de cambio de canal (E1 → E2), aviso a las 2 h si faltan votos, mensajes con `/humano` y el nombre de quien atiende.
- E1 con cambio de canal puede votar en la web. Costo 0 se muestra como «gratis».
- Versión visible en el pie de página (`FRONTEND_VERSION`).
- Publicado primero como `/M2-Claude/`; desde la reestructura vive en `/piloto/`.

### [1.0.0] · 2026-10-04 · «M1»
- Primer frontend completo de Claude para E1 y E2 (7 páginas + assets compartidos), con backend 2.2.1.
- Archivado en `archivo/piloto-m1-claude/`. Tag `piloto/v1.0.0`.

## Backend (`backend/Codigo_Piloto.gs`)

### [2.2.5] · 2026-10-06 · Recomendaciones de la prueba de punta a punta
- `cerrar_plan` rechaza planes ya cerrados o caídos (`plan_ya_cerrado`): antes pisaba `t_cerrado` (horas a cierre) y la opción elegida. Acepta `hora_salida` y la guarda en la opción ganadora.
- Acción nueva `corregir_plan` (equipo): hora del encuentro y salida de un plan cerrado; la hora anterior queda en `nota`.
- `evento`: los participantes solo registran `me_apunto`, `no_puedo`, `checkpoint_llegada`, `llego_casa` y `salir`; el resto exige la clave del equipo.
- `crear_plan`: un plan a la vez por grupo (`plan_en_curso`).
- `?view=mago`: cada plan trae `minutos`, `bloques` y `mensajes` (eventos del mago marcados).
- Probado con 28 casos de punta a punta (E1, E2, prueba, retiro y reinicio), los 24 del reinicio y los 58 del motor 2.3.0 (que ya incluye estos arreglos).

### [2.2.4] · 2026-10-06 · Empezar el piloto real
- Acción `limpiar_registros` (solo equipo, con la frase «EMPEZAR PILOTO»): borra los registros de los ensayos y conserva `tokens`, `inventario` y `bitacora` (opcional: `cambios`).
- Antes de borrar copia las pestañas con datos a una hoja de respaldo nueva en el Drive del dueño del script, sin `contactos` (minimización).
- Pestaña nueva `bitacora` (ts, accion, detalle, respaldo_url, registrado_por). Se crea sola.
- `?view=mago` devuelve los conteos por pestaña y los últimos cinco reinicios.
- Sin cambios en las demás acciones. Desplegar como Nueva versión (la URL /exec no cambia).

### [2.2.3] · 2026-10-05
- Desplegado el 5/10 como implementación nueva: `https://script.google.com/macros/s/AKfycbwbh_qzXHXpeY5Z3LiTsoH855lDFE3Ezd45PFQqyKRjEFQaRkydhHFto_-OSae_U9Mf/exec`. Las implementaciones `…iiszymTNC` (2.2.2) y `…CLY-7cf` (2.2.1) deben archivarse.
- `registrar`: un WhatsApp ya activo en el grupo no puede aceptar otra vez (`ya_registrado`). Cubre al organizador que abre su propia invitación.
- `?view=invitacion&inv=` (pública): estado, modo y si está completo; sin nombres, conteos ni condición E1/E2.
- `?view=plan`: al organizador que recluta le devuelve su código de invitación y cuántos aceptaron; incluye `modo`; error `revocado` para quien se retiró.
- `retro`: solo para planes cerrados y desde la hora de encuentro (`plan_no_cerrado`, `retro_antes_del_plan`).
- Probado en node con 17 casos (duplicados, invitación, vistas, pulso antes y después, revocación).

### [2.2.2] · 2026-10-04
- Desplegado el 4/10 como implementación nueva: `https://script.google.com/macros/s/AKfycbzC3UOOzBYgeAhOZRm1Gl1l2QYPnlvsV5HbbU-3P2h7LcW0GHmLW9LTfR2iiszymTNC/exec`. Desde aquí, cada versión se publica como «Nueva versión» de esta misma implementación.
- `inventario.telefono_para_llamar` (columna 14); la consola ve los lugares por confirmar.
- `marcar_failover`: un plan que cambia de canal queda marcado y el panel lo saca de la comparación E1/E2. Evento `cambio_canal`.

### [2.2.1] · 2026-10-04
- `participantes.consent_metodo` (`boton_todo` o `individual`).
- `?view=plan` sin `plan_id` devuelve el plan más reciente del grupo y el estado de la persona.
- `probarMontaje()` revisa y repara encabezados.

### [2.2.0] · 2026-10-04
- Métricas de los tableros 06 y 11.2: satisfacción 1–5 (least misery), hora de encuentro y llegadas a tiempo (`TOLERANCIA_MIN`), causa estructurada de un plan caído, «¿qué le agregarías?».
- Arreglos: «no puedo» descuenta un «me apunto»; si revoca el organizador se borra la línea base del grupo; preferencias sin correos ni números largos.
- No se guardó copia aparte de esta versión: sus cambios están incluidos en 2.2.1.

### [2.1.0] · 2026-10-03
- Ajustes I1–I9 del control de compromisos P6 (línea base por grupo, denominador n_invitados, minutos humanos, change log, WTP solo del organizador, IA solo desde el inventario, modo prueba excluido, sin flujo individual, grupo con consentimiento incompleto desestimado).

## Datos (`datos/Inventario_Planes_Cali.csv`)

### v3 · 2026-10-04
- Estados alineados con la hoja tras la ronda de llamadas post-sismo: 17 lugares activos (INV-02, 03, 05, 07, 08, 10, 11, 12, 16, 17, 19, 20, 23, 24, 25, 26, 27) y 10 por confirmar.
- La hoja `inventario` del piloto es la fuente de verdad: los nombres y horarios que se corrigieron allí no se copiaron a este archivo, que queda como referencia.

### v2 · 2026-10-04
- 27 lugares, columna `telefono_para_llamar`. Solo INV-11 (Ciclovida) está activo; el resto queda `por_confirmar` tras el sismo del 10/8.
- Los teléfonos marcados «(sin verificar · lista Gemini)» no coinciden con fuentes públicas: confirmar antes de llamar.

### v1 · 2026-10-03
- Primer inventario verificado (22 lugares).

## Archivo

- `p4/final` → último commit del Periodo 4 antes del pivote (H1–H4, panel de investigadores).
- `archivo/gemini-m1`, `archivo/gemini-m2` → versiones de Gemini, solo referencia.
