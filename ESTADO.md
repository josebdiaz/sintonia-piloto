# Estado del proyecto · 24 nov 2026

Sintonía · piloto en WhatsApp con grupos que ya existen en Cali. Dos condiciones: **E1** (WhatsApp + mago) y **E1.5** (WhatsApp automatizado con n8n, con una persona que aprueba y pega; valor interno `E2`).
Este archivo reemplaza como punto de partida a los estados anteriores (6/10 en `docs/guias/`, 6/11 en el Proyecto). Historial detallado: [`CHANGELOG.md`](CHANGELOG.md).

## 0. En corto · leer esto primero

Resumen para arrancar cualquier conversación. El detalle está en las secciones de abajo. La forma de trabajar está en `claude/wow-sintonia.md` (Proyecto) y, en versión visual, en el deck [`docs/deck-wow.html`](docs/deck-wow.html). Los documentos superados del Proyecto no se borran: se listan en `claude/archivo.md` y no son fuente.

- **Versiones:** frontend **2.16.0** (sintonia.my) y backend **2.10.0**, desplegados el 24/11 (encuesta de cierre con precio para todo el parche, aprobada por Néstor). Aviso de privacidad **v2-2026-11** publicado.
- **Dónde estamos:** la plataforma está lista para la prueba con un grupo de Cali. **No hay resultados con personas reales.** E1.5 (n8n) está aplazado desde el 19/11.
- **Calendario:** ensayo el 25/11 · congelamiento el 26/11 · prueba con Cali el 27/11 (encuentro a más tardar el 30/11) · entrega el 4/12 · pitch el 12/12.
- **Regla vigente:** desde el 26/11 la consola no cambia hasta cerrar el análisis.
- **Bloqueos:**
  - El grupo de Cali está sin confirmar.
  - El tótem espera la plantilla de la estructura.
  - Falta el logo vectorial de Icesi.
- **Próximos 3 pasos:** los primeros de la §4.
- **Dónde está cada cosa:**
  - Código y guías: el repo.
  - Notas internas, briefs y documentos de trabajo: el Proyecto.
  - Estado para liderazgo: el reporte ejecutivo semanal.

## 1. Versiones

| Componente | Versión | Estado |
|---|---|---|
| Frontend (consola, panel, páginas de participante) | **2.16.0** | Publicado en https://sintonia.my el 24/11. La 2.16.0 trae la encuesta de cierre con precio para todo el parche (aprobada por Néstor), UX writing sin repeticiones y el paso 2 de la inscripción más claro. La 2.15.0 evita duplicados cuando se reintenta tras un corte. La 2.14.0 muestra el estado de cada opción (casilla o círculo) y agrega «Sí a todos» al calendario, sin tope de días para quien organiza. La 2.13.0 publica el aviso de privacidad v2 y afina los términos sensibles. La 2.12.0 aplica la ola 1 de la auditoría UI/UX: claim, calendario, sistema visual de la landing en participantes, sin jerga interna, aviso con resumen y la consola compacta en celular. La 2.11.0 pone la encuesta de cierre por pasos (antes, durante, después, frases, precio y cierre). La 2.10.0 (sync P8d) Trae «Escoge tu disponibilidad» con calendario para todo el parche, «Quiénes pueden» en la consola, el claim «Menos vueltas, más plan», «Regístrate aquí» con 3 pasos y la vista de revisión de la encuesta de cierre. La 2.9.x trajo la landing del QR (con lista de espera), el logo nuevo y el arreglo del menú |
| Backend (Apps Script) | **2.10.0** desplegado el 24/11 | Disposición a pagar de cada persona por plan (`wtp` con `plan_id`, `rol` y 3 preguntas), resumen por rol en el panel. Desde la 2.9.3: reintentos sin duplicados (`req_id`), inscripción y aceptación repetidas devuelven lo mismo, fallos de red en `medicion_consola`, términos sensibles afinados y `AVISO_VERSION` = `v2-2026-11`. `CUPO_ABIERTO` no existe todavía: el backend asume «no» (lista de espera) |
| Motor E1.5 (n8n Cloud, 9 flujos) | Sin cambios desde el 30/10 | **Sin probar contra el backend.** Ver §3.1 |
| Home (sintonia.my) | Generado desde el repo | Desde el 17/11 las tarjetas del menú salen de `home.json` y de este archivo (`tools/home.py`); el código secreto funciona en celular. Ver `docs/protocolo-home.md` |
| Repositorio | Público, excepción documentada | `docs/seguridad-repo.md`: revisión automática de claves y datos personales; **por activar** en GitHub: *secret scanning*, *push protection* y protección de `main` |
| Tags | `piloto/v2.7.0` · `backend/v2.7.2` | **Por crear desde el Mac** (la sesión de Claude no puede subir tags): `piloto/v2.16.0` y `backend/v2.10.0` sobre el commit publicado el 24/11, más los de las versiones intermedias |
| Inventario verificado | Hoja del piloto | Revisión de ubicaciones con `probarMontaje()` (2.5.0): **resultado por reportar** |

## 2. Qué cambió desde el 6/11 (consola 2.3.1 → 2.8.1, backend 2.3.x → 2.8.1)

| Versión | Cambio principal | Origen |
|---|---|---|
| 2.15.0 | Reintentos sin duplicados (backend 2.9.3), con los fallos de red medidos | Revisión de sesiones y conexión, aprobada por Néstor (24/11) |
| 2.14.0 | Casillas visibles en las opciones, «Sí a todos» en el calendario; la consola elige las 4 fechas con más coincidencias | Pedido del equipo (23/11) |
| 2.13.0 | Aviso de privacidad v2 publicado y términos sensibles afinados (backend 2.9.2) | Revisión con Néstor (23/11) |
| 2.12.0 | Ola 1 de la auditoría UI/UX (P1–P4, P11, C1, C3, C5, C8 y el resumen del aviso) | Auditoría UI/UX (23/11, Proyecto) |
| 2.11.0 | Encuesta de cierre por pasos, uno por momento del plan, con progreso, validación por paso y UX writing; las preguntas validadas no cambian | Pedido del equipo (23/11) |
| 2.10.0 | Disponibilidad con calendario para todo el parche y «Quiénes pueden» en la consola (backend 2.9.1), claim «Menos vueltas, más plan», «Regístrate aquí» con 3 pasos, vista de revisión de la encuesta de cierre | Sync P8d (23/11) |
| 2.9.1 | Logo nuevo (anillo rojo #ff2500, «s» redibujada) en el sitio, los íconos, los decks, los stickers de WhatsApp y el material POP | Marca (22/11) |
| 2.9.0 | Landing pública del QR (qué es, cómo funciona, crear el grupo o lista de espera), origen por pieza impresa, QR en `docs/pop/`, código secreto sobre el glifo; backend con cupo y lista de espera | Material POP (prompt 8) |
| 2.8.2 | Precio único también en la web, encuesta de cierre sin «Pulso» ni «4 minutos», bloque oscuro solo en la primera impresión, capturas reales en el pitch, contraste y foco | Auditoría visual anti-slop |
| 2.8.1 | Plazo para confirmar que nunca queda en el pasado, /confirmado igual a la opción votada, datos sensibles frenados en el formulario y omitidos en el backend, encuesta del mago como paso del recorrido | Auditoría E2E (`docs/plan-correcciones-2.8.1.md`) |
| 2.8.0 | «Falta un paso: invita a tu parche», recordar a quien organiza, grupo en 3 pasos con plan B, fechas concretas y encuesta «¿Qué día?», opciones de 4 líneas con un precio, mensajes de cierre bloqueados mientras votan, plazo para confirmar, aviso por cada aceptación | Prueba externa (ola A) |
| Home 17/11 | Menú del home generado desde el repo (estado, versiones, último cambio, pendientes) y acción «Home al día»; código secreto usable en celular | Protocolo del home |
| 2.7.1 · 2.7.3 | Grupo de WhatsApp con quien organiza, `wa.me` sin emojis, Gemini con indicación y sin jerga, llegadas al instante, «Encuesta de cierre», escala de Desempeño | Prueba de Juan José (15/11) |
| v1 stickers | 14 stickers de marca en `docs/stickers/` | Prueba de Juan José |
| 2.4.0 | **Decisión por ronda** (hoja `decisiones`: votos por opción copiados de la encuesta, no voto por persona) y «pedir más opciones» sin plan caído. Gemini propone siempre 3 opciones (exacta, intermedia, diferente) con la disponibilidad del grupo. Mensajes nuevos: encuesta nativa de WhatsApp, `/confirmado` en 3 mensajes, evento de WhatsApp, `/hoy`, `/checkpoint` y `/en_casa` como encuesta, pulso por enlace personal. Modo prueba sin reloj. Correos al equipo | Prueba 2 (14/11) y su grabación |
| 2.5.0 | Enlaces de Google Maps por nombre y dirección; capa de marca actual; relojes; atajos C, N, M; accesibilidad (axe 0) | QA UX/UI/a11y |
| 2.6.0 | Mapa del recorrido: 2 planes × 5 etapas (Grupo, Proponer, Decidir, El día, Cierre) | Revisión visual |
| 2.7.0 | Plan F0–F5: marcadores `[n]` bloqueados, cola de mensajes, conteo de votos «− n +», día y hora en botones, llegadas en un toque, color semántico, teléfonos enmascarados, sin «Trabajo» en la inscripción. **Medición de la consola** (hojas `medicion_consola` y `pulso_mago`: SUS y NASA-TLX de quien opera) | Revisión visual (`claude/revision-visual-consola-2026-11-15.md`, Proyecto) |

QA al 23/11 (2.10.0 · backend 2.9.1): backend 105 de 105 · recorrido 57 de 57 · consola 26 de 26 · ola A 21 de 21 · auditoría E2E 67 OK, 0 graves y 2 conocidos · contraste y axe sin fallas.
QA al 22/11 (2.9.0): backend 101 de 101 · código secreto del home 18 de 18 (iPhone 13, Pixel 7, escritorio) · landing con axe sin hallazgos y sin scroll horizontal · los 4 QR decodifican a su URL.
QA al 22/11 (2.8.2, `tools/qa/correr.sh todo`): backend 95 de 95 · recorrido 57 de 57 · consola 26 de 26 · ola A 21 de 21 · auditoría E2E 64 OK, 0 graves y 2 conocidos (M8, M9) · contraste y axe sin fallas.
QA al 22/11 (2.8.1): backend 95 de 95 · recorrido completo 57 de 57 · F0–F5 26 de 26 · auditoría E2E 59 OK y 0 graves.
QA al 22/11 (2.8.0): backend 90 de 90 · recorrido completo 57 de 57 · ola A 22 de 22 · F0–F5 25 de 25 · axe sin hallazgos nuevos.
QA al 17/11: backend 85 de 85 · recorrido completo 52 de 52 · F0–F5 y 2.7.1 25 de 25 · código secreto 20 de 20 (iPhone, Pixel, escritorio) · axe-core 0 · sin scroll horizontal a 390 px.

## 3. Implicaciones para las otras etapas

Severidad: **Bloquea** (no se puede correr E1.5 o el piloto sin resolverlo) · **Validez** (se puede correr, pero E1 y E1.5 dejan de ser comparables) · **Ajuste** (mejora o limpieza).

### 3.1 Motor E1.5 en n8n

La guía `n8n/GUIA-CONTINUACION.md` (30/10) se escribió con la consola 2.3. Desde entonces E1 cambió su mecánica en cinco puntos que E1.5 tiene que copiar para que la comparación sea justa. Detalle en la §7 de esa guía.

| # | Cambio en E1 | Implicación en E1.5 | Acción | Sev. |
|---|---|---|---|---|
| N1 | El grupo vota en una **encuesta nativa de WhatsApp** y el mago registra los conteos (2.4.0) | E1.5-01 interpreta votos escritos («2», «TODAS»): mecánica distinta para el grupo. Además, sin `decision` en `cerrar_plan`, E1.5 no deja filas en `decisiones` y el panel no compara rondas ni vetos | E1.5 usa la misma encuesta. El formulario de cierre de W3 pide los conteos y envía `decision`. E1.5-01 queda para SALIR, HUMANO y mensajes sueltos | **Validez** |
| N2 | **Textos nuevos** (2.4.0–2.7.0): `/opcion_n` con Mapa, `/encuesta`, `/confirmado` × 3, `/evento`, `/hoy`, `/checkpoint` y `/en_casa` como encuesta, `/retro` sin enlace | Los textos de `PROMPT-n8n-builder.md` (B3, B4) están desactualizados | Copiar los textos de `piloto/mago.html` (lista `TPL`, 2.7.0), no del prompt. Actualizar el prompt | **Bloquea** (ya era B3) |
| N3 | **Ningún texto con `[corchetes]` sale al grupo** (F0, 2.7.0) | El prompt pide dejar `[dirección]` visible para que quien revisa lo llene | SW · Enviar rechaza el envío si quedan corchetes y lo devuelve a SW · Aprobar | **Bloquea** (riesgo ante el grupo) |
| N4 | **Eventos nuevos** (`msg_hoy`, `msg_checkpoint`, `msg_todos`, `msg_en_casa`, `msg_evento`) | Resuelve I1 mejor que dejar `evento_msg` vacío | W4: `msg_checkpoint` y `msg_todos`; W5: `msg_en_casa`. Agregar `/hoy` (en la mañana, `msg_hoy`) | Ajuste |
| N5 | **Relojes de E1** (2.5.0): recordatorio a las 2 h; `/salida` 2 h antes; checkpoint a la hora; «en casa» y pulso 3 h después, o al día siguiente a las 10:00 si el plan es desde las 8 p. m. | W5 manda `/retro` siempre al día siguiente a las 10:00 | Igualar W5 a la regla de E1 (3 h, o día siguiente si es de noche) | **Validez** |
| N6 | **Pulso por enlace personal** (2.4.0): un chat privado por persona | En la opción C, quien revisa tendría que pegar N mensajes privados | W5 entrega en Telegram la lista de enlaces `wa.me` por persona, ya armados | Ajuste |
| N7 | **«Pedir más opciones» sin plan caído** (`reabrir_opciones`, 2.4.0) | `reabrir_opciones` no está en `MOTOR_ACCIONES`, y la deduplicación de W1 por `plan_id` bloquea la ronda 2 del mismo plan | **Backend listo en 2.7.1** (`reabrir_opciones` en `MOTOR_ACCIONES`, solo planes de E1.5). Falta deduplicar W1 por `plan_id` + ronda | **Validez** |
| N8 | **Gemini: 3 opciones con `tipo` y paradas con dirección y coordenadas** (2.4.0–2.5.0) | «Normalizar opciones» de W1 tiene que conservar `tipo`, `direccion`, `latitud` y `longitud`, o los enlaces de Maps quedan débiles | Pasar las paradas completas a `publicar_plan`, como hace la consola | Ajuste |
| N9 | **Evento de WhatsApp** («se apuntó») creado a mano (2.4.0) | No se puede automatizar en la opción C | Instrucción para quien revisa en SW · Enviar; los «me apunto» se registran en la consola | Ajuste |
| N10 | **Medición de la consola** (2.7.0): segundos activos y toques por etapa, solo con «Mago in» | En E1.5 el trabajo humano ocurre en Telegram y n8n, no en la consola: `medicion_consola` subestima E1.5 | Comparar E1 y E1.5 **solo con los minutos de «Mago in»** (métrica del piloto). `medicion_consola` sirve dentro de E1 para mejorar la herramienta | **Validez** (de interpretación) |
| N11 | **Pulso del mago** (SUS + NASA-TLX, 2.7.0) | El SUS pregunta por «la consola»; quien revisa en E1.5 usa sobre todo Telegram | El NASA-TLX es comparable entre condiciones. Para el SUS de E1.5, decidir si se pregunta por «Telegram + consola» o se omite | Decisión abierta |

**Estado de la guía del 30/10** (según `n8n/CHANGELOG.md`, 3/11): ya hechos B2 (excepto I5 en W3), B3–B4 (con los textos de la consola de ese momento: hay que volver a copiarlos, N2), I1 (con `evento_msg` vacío; N4 lo mejora) e I2–I3. Siguen abiertos B1 (canal; depende de C14), B5 (orden de W1; depende de SW · Aprobar), I5 y el plan de pago de n8n (la prueba gratuita vencía cerca del 8/11: **por confirmar**).

### 3.2 Operación del piloto (monitor, protocolo y guías)

| # | Implicación | Acción | Sev. |
|---|---|---|---|
| O1 | La guía y el deck del monitor describen la consola 2.2.2: no hay mapa, cola, conteo «− n +», botones de llegadas, menú «⋯» ni pulso del mago | Actualizar `docs/guias/onboarding-monitor.md` y `docs/deck-onboarding-monitor.html` a la 2.7.0 antes del primer grupo real | **Bloquea** (inducción) |
| O2 | `docs/protocolo-m2.md` describe E2 como web app (anterior a D1) | Marcarlo como «Hecha» (superado); el protocolo vigente es el onboarding más este archivo | Ajuste |
| O3 | **Congelar la versión.** La 2.7.0 cambia la herramienta de E1; cambiarla a mitad del piloto mezcla dos interfaces en los minutos humanos | Arrancar los grupos del piloto en 2.7.0 y no cambiar la interfaz hasta el cierre del análisis (cada fila de medición guarda `consola_version`) | **Validez** |
| O4 | El pulso del mago y la medición necesitan el backend 2.7.0 o posterior | **Resuelto:** 2.7.2 desplegado el 15/11 | — |
| O5 | Prueba externa de Juan José con Paula (15/11, modo prueba) | Primera evidencia con la 2.7.0: pedir la grabación y el pulso del mago | Ajuste |

### 3.3 Métricas y plan de pruebas

| # | Implicación | Acción | Sev. |
|---|---|---|---|
| M1 | Métricas nuevas de contexto: SUS y NASA-TLX de quien opera, minutos activos y toques por etapa | Agregarlas al plan de pruebas como **contexto** (no como métricas principales) y contarlas a Néstor, que validó SEQ y SUS de participantes | Ajuste |
| M2 | `decisiones` reemplaza a `votos` como fuente de rondas y vetos en E1 | El análisis usa `decisiones` en las dos condiciones (requiere N1) | Validez |
| M3 | Se quitó «Trabajo» de los tipos de grupo (foco: amigos, familia o pareja) | El backend lo acepta todavía por compatibilidad; en el análisis, cualquier grupo «trabajo» queda fuera de foco | Ajuste |

### 3.4 Privacidad (aviso v2)

- `pulso_mago` y `medicion_consola` guardan solo datos del equipo (nombre de quien opera, tiempos y toques); **no hay datos nuevos de participantes**, así que no cambian el aviso.
- Desde la 2.10.0 cada persona guarda su disponibilidad (días y franja, en `linea_base`). No es un dato sensible, pero es un dato nuevo de participantes: el aviso v2 debe nombrarlo. Revocar el consentimiento lo borra.
- La consola enmascara los teléfonos (minimización, Ley 1581).
- **Aviso v2 publicado** el 23/11 (v2-2026-11): incluye la disponibilidad y la lista de espera. Si se retoma E1.5 con n8n, el v3 tiene que nombrarlo como encargado.

### 3.5 Otras etapas

| Frente | Implicación |
|---|---|
| E3 (app standalone) | Sin impacto directo. El mapa por etapas y la cola de mensajes son patrones reutilizables para la interfaz de aprobación |
| Inventario | Los enlaces de Maps dependen de nombre y dirección completos: falta el resultado de «Ubicaciones» de `probarMontaje()` con la hoja real |
| Pitch final (12/12) y KTH | La medición de la consola es evidencia de **Technology** (madurez de la herramienta) y del **costo operativo** del modelo de negocio. Ninguna cifra es resultado del piloto hasta que exista |

## 4. Pendientes, en orden

El home muestra los tres primeros que siguen abiertos: mantén la tabla en orden de prioridad (protocolo en `docs/protocolo-home.md`). Los prompts para implementar los aprendizajes de la prueba externa están en `docs/prompts-mejoras-prueba-externa.md`.

| # | Pendiente | Bloquea | Quién |
|---|---|---|---|
| 1 | Ensayo con WhatsApp real el miércoles 25 (guion en «Insumos para los agregados», Proyecto). Antes: probar en un teléfono real el enlace de Maps y la pantalla «Falta un paso» | Prueba con Cali (viernes 27) | Equipo · Juan José |
| 2 | Congelar el jueves 26 en `piloto/v2.16.0` y `backend/v2.10.0` (tags por crear desde el Mac), y «Empezar piloto real» después del ensayo | Prueba con Cali | José |
| 3 | Confirmar el grupo de Cali (o el plan B de Katherine) y la fecha del encuentro, a más tardar el 30/11. Modo piloto y encuesta actual (recomendado) | Prueba con Cali | Katherine |
| 4 | Imprimir la oleada 1 del material POP (pines, stickers, tarjetas y volante); el tótem espera la plantilla de Juan Carlos; falta el logo vectorial de Icesi | Material POP | Equipo |
| 5 | Cargar los stickers en el número Sintonía | Prueba con Cali | José |
| 6 | Disposición a pagar para miembros (prompt 6): **hecho en la 2.16.0**. Modelo de negocio con varios pagadores (prompt 7): después de Cali | Sustentación (4/12) | Katherine, con José |
| 7 | Activar en GitHub *secret scanning*, *push protection* y la protección de `main`, sin exigir pull requests (pasos en «Insumos para los agregados») | Seguridad del repo | José |
| 8 | Confirmar con el monitor su respuesta de Desempeño en la encuesta del mago (escala anterior) | Dato del mago | José |
| 9 | Reportar la línea «Ubicaciones» de `probarMontaje()` | Enlaces de Maps confiables | José |
| 10 | Ola 2 de la auditoría UI/UX (una sola guía en la consola, inscripción en 3 pasos): después de Cali | Siguiente fase | José |
| 11 | n8n y licencias: **aplazados** (19/11) hasta tener más pruebas manuales. Cuando se retomen: N1–N11, B1, B5, I5 y C14 | E1.5 | Equipo |
| 12 | Control de compromisos de los periodos 8 y 9: archivo interno consolidado al cierre | Seguimiento de la maestría | José |
| 13 | Crear los tags de las versiones intermedias (`piloto/v2.7.1` a `v2.14.0`, `backend/v2.7.3` a `v2.9.2`) | Historial | José |
| 14 | Agregar a las instrucciones del Proyecto (punto 1) la línea: los documentos de `claude/archivo.md` son historia y no son fuente | Orden del Proyecto | José |

## 4.2 Prueba externa (semana del 15/11, n = 1, modo prueba)

Hallazgos y prompts: `docs/prompts-mejoras-prueba-externa.md`. **Ola A (prompts 1 a 5): hecha en la consola 2.8.0 el 22/11**; backend 2.8.0 desplegado el 22/11. Los que más pesan: quien organiza no entendió que debía compartir la invitación; WhatsApp no deja agregar a quien no está en los contactos; faltó la fecha concreta; los mensajes salieron en desorden; faltó la disposición a pagar.

**Decisiones del 19/11 (P8c):** se aplazan las licencias y la automatización hasta tener más pruebas manuales con grupos de Cali; la próxima prueba es con un grupo de Cali y el equipo observa sin intervenir; la disposición a pagar entra en las respuestas de los usuarios; el material POP se imprime este fin de semana, con un QR a una landing pública; la entrega final es el 4/12.

## 4.1 Prueba de Juan José (15/11, consola 2.7.0)

| Hallazgo | Estado |
|---|---|
| WhatsApp no deja crear un grupo vacío | Hecho en 2.7.1: se crea con quien organiza y el resto entra por enlace |
| 👋 sale como «?» en el mensaje prellenado | Hecho en 2.7.1: `wa.me` va sin emojis |
| Faltan los stickers de Sintonía en el chat | Hecho: paquete v1 en `docs/stickers/` (14 stickers). **Falta cargarlos** en el WhatsApp del número Sintonía (ver el README de la carpeta) |
| «Ajustar tono» lo vuelve caleño y no deja dar la instrucción | Hecho en 2.7.1 y 2.7.3 (desplegado el 15/11) |
| «Llegó» y «En casa» no se ven hasta recargar | Hecho en 2.7.1 (se ven al instante). Causa exacta en la hoja: **por confirmar** si se repite |
| «Pulso» no se entiende y su mensaje no está en Mensajes | Hecho en 2.7.1: «Encuesta de cierre», también en Mensajes · Cierre |
| Desempeño (encuesta del mago) con los extremos al revés | Hecho en 2.7.1. La respuesta que Juan José ya guardó se hizo con la escala anterior: **confirmar con él** qué quiso marcar y, si hace falta, corregir `tlx_desempeno` y `tlx_raw` en la hoja `pulso_mago` |
| El recorrido nuevo se entiende bien (el anterior era más detallado) | Se mantiene; la lista completa de pasos sigue en «Todos los pasos» |

## 5. Lo que aún no hay

**No hay resultados del piloto.** Las metas (60 % de llegadas; la mitad de los grupos con intención de repetir) siguen siendo metas del equipo. Los grupos en modo prueba no cuentan en el panel ni en el análisis.
