> **Copia en el repositorio · Hecha: cambios del prototipo v2 de P4 (16/9).**

# Sintonía · Prototipo v2 — cambios implementados

Iteración a partir del review del 16 sept 2026. Decisiones: actividad única = **café-coworking**; estímulo de precio = **COP 39.900**; wording según *Verbatum Sintonía*. La versión anterior quedó guardada en `sintonia_v1_snapshot/`.

## Transversal
- **Actividad única** para los cuatro experimentos: café-coworking. La ficha H2 sigue autogenerable para iterar la actividad.
- **Modo claro forzado**: se eliminó la detección automática de modo oscuro (queda solo el toggle manual) donde aún la heredaba (ficha H2). El resto ya era claro por defecto.
- **Enlaces en verde** institucional, coherentes con los botones (incluido "¿Cómo funciona el cobro?" en H1).
- **Versionado**: v1 preservada en `sintonia_v1_snapshot/`; esta es la v2.

## H1 · Landing
- Nuevo lead (reemplaza "trabajas tu propia lista"): sesión de coworking en café, grupo pequeño, para quien trabaja remoto y quiere romper la rutina, "en sintonía con gente cerca. Cerca, corto y posible."
- Cierre (paso 3): "Un momento opcional al final para **empezar a sintonizar con el grupo**. Sin obligación." (hace eco con H4)
- Precio **39.900 tachado** visible; enlace de cobro en verde.
- **Panel H1**: nueva sección "Mensaje para enviar" debajo del generador de UTM — texto listo para copiar/pegar que se arma con el nombre y el enlace generados.

## H2 · Ficha de llegada
- Duración: "**Duración de la sesión: aproximadamente 2 horas**" (sin "puerta a puerta"; solo la actividad).
- **Acordeones** para Parqueadero y Contacta a tu anfitrión (baja densidad de texto).
- Texto "Cómo llegar" acortado; se quitaron referencias no visibles (parque, iglesia). **Mapa movido** al bloque de ubicación (Dónde).
- Qué llevar: "Computador, **cargador** y audífonos…".
- **Botón de ayuda** (rojo) que abre WhatsApp con mensaje predefinido: "Hola, voy a asistir a una sesión de Sintonía, necesito ayuda". (No es botón de pánico.)

## Calificar (posevento)
- Se quitó "Sube la señal"; escala con extremos **Nada → Mucho**.
- Preguntas 1–5: agrado, comodidad, **seguridad**, facilidad (4 en total; barra de avance 0/4).
- **Campo cualitativo abierto**: "¿Cómo te sentiste con las personas, el anfitrión y la experiencia?".
- Una palabra: "¿Cómo describirías tu experiencia en una palabra?".
- El panel muestra promedios (incl. seguridad) y lista los comentarios.

## H3 · Interacción / scorecard
- **Host sin fórmula rígida**: la regla de decisión ya no exige "≤ 2 prompts". Los prompts quedan como dato informativo, y el host se evalúa con una **calificación de usuarios (cuanti 1–5 + nota cualitativa)**. Persevera con ≥ 3/4 participan, ≤ 50% de turnos por persona y seguridad ≥ 4/5.
- Consentimiento firmado, cámara cenital (manos/objetos, no rostros/terceros) y protocolo de respaldo sin video: reforzados en la tarjeta de ejecución.

## H4 · Pulso
- Sin tono de app de citas. Pregunta principal: "**¿Con quién quisieras volver a sintonizar?**".
- Nota: "Es privado y opcional. Si la sintonía es mutua, les proponemos un próximo plan. Puedes no elegir a nadie."
- Cierre opt-in + **invitación a la comunidad de Sintonía** (WhatsApp/correo).
- **Identificador de clúster** (`?cluster=`) para correr varios microgrupos en paralelo: los matches solo se calculan dentro del mismo clúster; el panel puede filtrarse por clúster; el generador de enlaces del panel incluye el campo de clúster.

## Backend (Apps Script) — requiere acción
- `calificaciones` ahora tiene columnas: timestamp, uid, src, agrado, comodidad, **seguridad**, facilidad, **comentario**, palabra.
- `pulso` ahora tiene: timestamp, me, **cluster**, agrado, intencion, eligio, optin_next, contacto.
- **Al redeployar**: si las pestañas `calificaciones` y `pulso` ya existen con los encabezados viejos, **elimínalas** (o límpialas) para que el script las recree con los nuevos encabezados; si no, las columnas quedarán desalineadas. Reimplementar: Gestionar implementaciones → Nueva versión. La URL `/exec` no cambia.

## Verificación pendiente (tu tarea del acta)
- Probar que las decisiones oficiales de las scorecards se guarden bien en la hoja (pestaña `scorecards`) tras el redeploy.

## Pendientes de contenido (no bloquean el envío de enlaces)
- Taxonomía de actividades/lugares/precios (Katherine) para sustentar la elección del café.
- Contenido fino de la micro-misión de H3 dentro del café-coworking.
- El **generador de fichas** (herramienta) aún produce el formato anterior; los cambios de H2 se aplicaron a la ficha pública. Actualizar el generador queda como follow-up.
