# Control de guías de implementación

Todas las guías del proyecto, por estado. **Vigente**: se usa hoy. **Hecha**: se ejecutó o quedó superada. **Pendiente**: todavía no se aplica.

Vista en tarjetas (GitHub Pages): https://josebdiaz.github.io/sintonia-piloto/docs/guias/

Es una visual de control: no se conecta al piloto, a la consola ni a los paneles. Revisión del 6/10/2026 · piloto en frontend 2.0.7 y backend 2.2.5.

## Vigente (7)

| Guía | Ámbito | Versión | Siguiente paso | Archivo |
|---|---|---|---|---|
| **Protocolo de operación M2 (E1 y E2)** · Qué hace el mago en cada condición, el ensayo en modo prueba, cómo empezar el piloto real, la asignación W1/W2, las contingencias y el cambio único entre rondas (I4). | Operación del piloto | Frontend 2.0.7 · backend 2.2.5 · 6/10/2026 | Jueves 9/10: ensayo en modo prueba. Después, «⟲ Empezar piloto real». W1: 10–11/10. | [`docs/protocolo-m2.md`](../../docs/protocolo-m2.md) |
| **Desplegar el backend en Apps Script** · Pegar el .gs, correr probarMontaje y publicar como Nueva versión sin cambiar la URL /exec. Propiedades del script que necesita. | Backend y publicación | Backend 2.2.5 · 6/10/2026 | Por confirmar: que la implementación en vivo ya sea la 2.2.5 (corregir_plan, minutos, «✓ Hecho»). | [`backend/README.md`](../../backend/README.md) |
| **Publicar versiones y llevar el historial** · GitHub flow, SemVer por componente, tags piloto/vX y backend/vX, publicar.sh y publicar_deck.sh, y la regla de un cambio entre W1 y W2. | Backend y publicación | README del repositorio · 6/10/2026 | Al día: 2.0.7 y 2.2.5 publicados el 6/10. | [`README.md`](../../README.md#cómo-trabajar-github-flow) |
| **Cumplimiento legal de datos personales** · Ley 1581 de 2012: consentimiento, minimización, separación de contactos, retiro y borrado al cerrar el estudio. Qué cambia en producción. | Datos y ética | 3/10/2026 · correo de contacto activo desde 2.0.6 | Piloto cubierto (aviso, retiro en dos pasos desde 2.0.7). Producción (H2): revisión legal y aval del comité. | [`docs/guias/cumplimiento-datos.md`](cumplimiento-datos.md) |
| **Inventario de lugares y ronda de llamadas** · Regla de estado (activo / por confirmar): solo lo activo entra en un plan (I6). Qué confirmar por teléfono antes de cada fin de semana. | Operación del piloto | Regla de la v1 (3/10) · la hoja manda: v3, 17 activos | Ronda de llamadas antes del 9/10 y antes de cada fin de semana. | [`docs/guias/inventario-ronda-de-llamadas.md`](inventario-ronda-de-llamadas.md) |
| **Trabajar el repositorio con ChatGPT y Claude** · Katherine actualiza la documentación directamente y propone cambios al prototipo por pull request; José da los permisos y revisa. | Colaboración | 6/10/2026 | Por confirmar: que Katherine aceptó la invitación y conectó GitHub en ChatGPT. | [`docs/guias/colaboracion-github.html`](colaboracion-github.html) |
| **Wording verificado** · Textos exactos y criterio verbal: nombrar el progreso real, sin promesas clínicas ni lenguaje de citas. | Diseño y textos | v2 · 16/9/2026 (criterio vigente; los textos son de P4) | Los textos del piloto M2 viven en el frontend; el criterio sigue valiendo. | [`docs/wording-verificado-v2.md`](../../docs/wording-verificado-v2.md) |

## Hecha (7)

| Guía | Ámbito | Versión | Estado | Archivo |
|---|---|---|---|---|
| **Plan de implementación de E1 (WhatsApp) y E2 (web)** · Cómo se montó el piloto Mago de Oz de dos semanas: Gemini desde Apps Script, páginas en GitHub Pages, número de WhatsApp Business y asignación por mitades. | Operación del piloto | 4/10/2026 | Reemplazada para operar por el protocolo M2. | [`docs/guias/plan-implementacion-e1-e2.md`](plan-implementacion-e1-e2.md) |
| **Prompt del storyboard M2 (Gemini Spark)** · Generar las 8 viñetas del recorrido del parche con nano banana. | Diseño y textos | 4/10/2026 | Hecho: las viñetas están en docs/storyboard-m2/ y en el deck. | [`docs/guias/prompt-storyboard-m2.md`](prompt-storyboard-m2.md) |
| **Publicar la landing en GitHub Pages y el backend en Apps Script (H1)** · Montaje inicial del Periodo 4: primero el backend para tener el endpoint, luego el hosting. | Archivo P4 | 12/9/2026 | Superada por backend/README.md y la reestructura del repositorio (4/10). | [`archivo/p4-pre-pivote/researchers/guia-hosting.md`](../../archivo/p4-pre-pivote/researchers/guia-hosting.md) |
| **Paquete de implementación del Periodo 4** · Los cuatro mecanismos H1–H4 (disposición a pagar, llegada, interacción, continuidad) listos para operar con Mateo. | Archivo P4 | 15/9/2026 | Cerrado con el pivote; las páginas quedan en archivo/p4-pre-pivote/. | [`docs/guias/paquete-implementacion-p4.md`](paquete-implementacion-p4.md) |
| **Cambios del prototipo v2 (café-coworking)** · Actividad única, estímulo de precio COP 39.900 y wording según Verbatum. | Archivo P4 | 16/9/2026 | Aplicados en P4. | [`docs/guias/cambios-prototipo-v2-p4.md`](cambios-prototipo-v2-p4.md) |
| **Análisis de video del microencuentro H3** · Rúbrica para analizar la grabación cenital de la cata a ciegas y alimentar el registro de H3. | Archivo P4 | 13/9/2026 | Cerrado con P4. | [`archivo/p4-pre-pivote/researchers/prompt-analisis-video-h3.md`](../../archivo/p4-pre-pivote/researchers/prompt-analisis-video-h3.md) |
| **Prompt para Lovable (landing y panel H1)** · Escalar H1 a más canales con backend propio. No hizo falta: bastó la landing autónoma. | Archivo P4 | 9/9/2026 | Superada sin ejecutar: el pivote cambió el alcance. | [`archivo/p4-pre-pivote/researchers/prompt-lovable-h1.md`](../../archivo/p4-pre-pivote/researchers/prompt-lovable-h1.md) |

## Pendiente (4)

| Guía | Ámbito | Versión | Siguiente paso | Archivo |
|---|---|---|---|---|
| **Protocolo de E2 autónoma con revisión humana periódica** · Qué hace sola la web app, las barandas G1–G6, el plan B, las ventanas de revisión humana, la regla de parada y los avisos web. | E2 autónoma | Borrador · 6/10/2026 | Decisión del 7/10 y aviso v2-autonoma aprobado por el comité. Reemplazaría a E2 en la W2. | [`docs/guias/e2-autonoma-protocolo.html`](e2-autonoma-protocolo.html) |
| **Backend 2.3.0, frontend 2.1.0 y Firebase** · Qué trae el borrador, la configuración de Firebase Cloud Messaging y los pasos para desplegarlo cuando haya luz verde. | E2 autónoma | Borrador · backend 2.3.0 (incluye 2.2.5) · frontend 2.1.0 | Propiedades FCM en Apps Script; pasar a 2.1.0 los cambios de 2.0.6 y 2.0.7; desplegar solo con aprobación. | [`docs/guias/e2-autonoma-backend-y-firebase.md`](e2-autonoma-backend-y-firebase.md) |
| **E3 «Charladita»: necesidades de backend** · 13 necesidades priorizadas (4 bloqueantes) para implementar la charla guiada después del piloto. | Iteraciones futuras | 5/10/2026 · base backend 2.2.3 | Después del piloto en curso; no se toca E1/E2 por E3. | [`docs/guias/e3-necesidades-backend.md`](e3-necesidades-backend.md) |
| **Algoritmo de clusterización de microgrupos** · Pasar de agrupar a mano a proponer grupos con un algoritmo, usando las señales de los experimentos. Para probarse, no para prometerse. | Iteraciones futuras | 13/9/2026 (antes del pivote) | Idea abierta; revisar si aplica al modelo de grupos que ya existen. | [`archivo/p4-pre-pivote/researchers/iteracion-clusterizacion.md`](../../archivo/p4-pre-pivote/researchers/iteracion-clusterizacion.md) |

## Cómo actualizar

Cambia el estado de una guía en la lista `GUIAS` de `index.html` y en esta tabla. Las copias de esta carpeta llevan una nota arriba con su estado; las que viven en otra carpeta del repositorio se enlazan sin copiarlas.
