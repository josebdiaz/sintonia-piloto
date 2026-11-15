# Estado del proyecto · 15 nov 2026

Sintonía · piloto en WhatsApp con grupos que ya existen en Cali. Dos condiciones: **E1** (WhatsApp + mago) y **E1.5** (WhatsApp automatizado con n8n, con una persona que aprueba y pega; valor interno `E2`).
Este archivo reemplaza como punto de partida a los estados anteriores (6/10 en `docs/guias/`, 6/11 en el Proyecto). Historial detallado: [`CHANGELOG.md`](CHANGELOG.md).

## 1. Versiones

| Componente | Versión | Estado |
|---|---|---|
| Frontend (consola, panel, páginas de participante) | **2.7.0** | Publicado en https://sintonia.my el 15/11 |
| Backend (Apps Script) | **2.7.2** | **Desplegado el 15/11** (incluye 2.7.0 y 2.7.1). Correos de inscripción verificados |
| Motor E1.5 (n8n Cloud, 9 flujos) | Sin cambios desde el 30/10 | **Sin probar contra el backend.** Ver §3.1 |
| Inventario verificado | Hoja del piloto | Revisión de ubicaciones con `probarMontaje()` (2.5.0): **resultado por reportar** |

## 2. Qué cambió desde el 6/11 (consola 2.3.1 → 2.7.0, backend 2.3.x → 2.7.0)

| Versión | Cambio principal | Origen |
|---|---|---|
| 2.4.0 | **Decisión por ronda** (hoja `decisiones`: votos por opción copiados de la encuesta, no voto por persona) y «pedir más opciones» sin plan caído. Gemini propone siempre 3 opciones (exacta, intermedia, diferente) con la disponibilidad del grupo. Mensajes nuevos: encuesta nativa de WhatsApp, `/confirmado` en 3 mensajes, evento de WhatsApp, `/hoy`, `/checkpoint` y `/en_casa` como encuesta, pulso por enlace personal. Modo prueba sin reloj. Correos al equipo | Prueba 2 (14/11) y su grabación |
| 2.5.0 | Enlaces de Google Maps por nombre y dirección; capa de marca actual; relojes; atajos C, N, M; accesibilidad (axe 0) | QA UX/UI/a11y |
| 2.6.0 | Mapa del recorrido: 2 planes × 5 etapas (Grupo, Proponer, Decidir, El día, Cierre) | Revisión visual |
| 2.7.0 | Plan F0–F5: marcadores `[n]` bloqueados, cola de mensajes, conteo de votos «− n +», día y hora en botones, llegadas en un toque, color semántico, teléfonos enmascarados, sin «Trabajo» en la inscripción. **Medición de la consola** (hojas `medicion_consola` y `pulso_mago`: SUS y NASA-TLX de quien opera) | Revisión visual (`claude/revision-visual-consola-2026-11-15.md`, Proyecto) |

QA al 15/11: backend 82 de 82 · recorrido completo 52 de 52 · F0–F5 22 de 22 · axe-core 0 · sin scroll horizontal a 390 px.

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
- La consola enmascara los teléfonos (minimización, Ley 1581).
- Sigue pendiente **publicar el aviso v2** (aprobado por Néstor el 6/11) y, si se usa Telegram en E1.5, nombrarlo como encargado.

### 3.5 Otras etapas

| Frente | Implicación |
|---|---|
| E3 (app standalone) | Sin impacto directo. El mapa por etapas y la cola de mensajes son patrones reutilizables para la interfaz de aprobación |
| Inventario | Los enlaces de Maps dependen de nombre y dirección completos: falta el resultado de «Ubicaciones» de `probarMontaje()` con la hoja real |
| Pitch final (12/12) y KTH | La medición de la consola es evidencia de **Technology** (madurez de la herramienta) y del **costo operativo** del modelo de negocio. Ninguna cifra es resultado del piloto hasta que exista |

## 4. Pendientes, en orden

| # | Pendiente | Bloquea | Quién |
|---|---|---|---|
| 1 | ~~Desplegar el backend 2.7.2~~ **Hecho el 15/11.** «⟲ Empezar piloto real» ya conserva minutos y sesiones del mago | — | José |
| 2 | Reportar la línea «Ubicaciones» de `probarMontaje()` | Enlaces de Maps confiables | José |
| 3 | Actualizar el onboarding del monitor a la consola 2.7.0 (O1) | Inducción | Equipo |
| 4 | Publicar el aviso de privacidad v2 | Datos reales | Equipo |
| 5 | Decidir N1 (encuesta nativa también en E1.5) y N11 (SUS del revisor) | Diseño de E1.5 | Equipo, con Néstor |
| 6 | ~~Agregar `reabrir_opciones` a `MOTOR_ACCIONES` (N7)~~ Hecho en el backend 2.7.1; falta la deduplicación por ronda en W1 | Ronda 2 en E1.5 | Equipo (n8n) |
| 7 | Corregir n8n: B1–B5, I2–I3 y N2–N8; después T1–T12 y el ensayo de 2 planes | E1.5 | Equipo |
| 8 | Confirmar el plan de pago de n8n y la decisión C14 (Evolution o asistida) | E1.5 | Equipo |
| 9 | D4 · viabilidad técnica del motor (sin respuesta de Moncada) | Cierre metodológico | Equipo |
| 10 | Confirmar el calendario: el propuesto el 6/11 tenía el plan 1 del 11 al 15/11. `[Por confirmar]` si sigue vigente | Piloto | Equipo |

## 5. Lo que aún no hay

**No hay resultados del piloto.** Las metas (60 % de llegadas; la mitad de los grupos con intención de repetir) siguen siendo metas del equipo. Los grupos en modo prueba no cuentan en el panel ni en el análisis.
