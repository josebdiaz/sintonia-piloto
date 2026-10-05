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

### [2.2.3] · 2026-10-05
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
