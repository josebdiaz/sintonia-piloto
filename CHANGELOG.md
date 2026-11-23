# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Cada componente usa [SemVer](https://semver.org/lang/es/) y su propio tag de git.
Las fechas son de 2026 (hora de Colombia).

## Repositorio

### 2026-11-22 · Menú del equipo sobre la landing (frontend 2.9.2)
- Si el código secreto se usaba con la página desplazada, el círculo que revela «Detrás de escena» nacía en el glifo, que estaba fuera de la pantalla, y no alcanzaba a cubrirla: se veía la landing debajo de una curva.
- Ahora el círculo nace en el glifo solo si está a la vista; si no, en el centro de la pantalla. Su radio se calcula para cubrir las cuatro esquinas.
- Con el menú abierto, la landing de atrás ya no se desplaza.
- Probado en escritorio y en iPhone con la página desplazada. Código secreto: 18 de 18.

### 2026-11-22 · Logo actualizado en todo el proyecto (frontend 2.9.1)
El logo nuevo viene del archivo de marca «Sintonia Logo NEW UPDATED.svg». Trae el anillo exterior noche, un anillo rojo #ff2500 más ancho y una «s» redibujada.
- El original recorta la «s» con una máscara en mapa de bits. Se vectorizó como un solo trazado: coincide en un 99,9 % con el render del original, y las esquinas de los remates quedaron rectas. Así sirve para la web y para imprimir a cualquier tamaño.
- **Dónde cambió:**
  - `piloto/assets/glifo.svg`, que es el logo de todas las páginas, la consola y el panel.
  - Los íconos del sitio: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` e `icon-192/512.png`.
  - El glifo animado de la landing, que conserva su animación.
  - Los decks: pitch final (incluidos los glifos pequeños del circuito y de las ondas), pitch técnico, inducción y onboarding del monitor, y status del 26/10.
  - Los stickers 01, 11 y 14 de WhatsApp, la bandeja y la hoja de contacto.
  - Las capturas de la consola del deck de onboarding, que también usa el pitch.
  - Las 10 piezas del material POP, más un sticker nuevo: el logo con la URL alrededor.
- Código secreto del home: 18 de 18.

### 2026-11-22 · Artes del material POP en Affinity
- **Oleada 1:** tarjeta con QR de 90 × 55 mm (frente y reverso), 2 pines de 58 mm y 3 stickers troquelados de 60 mm.
- **Oleada 2:** tótem de 80 × 200 cm, volante media carta y hablador de mesa.
- Todo en CMYK, con sangrado y en Graphik. Cada QR es un solo trazado vectorial, y los cinco que llevan las piezas se verificaron decodificando el render.
- Vistas previas en `docs/pop/artes/` y especificaciones para la imprenta en `docs/pop/README.md`. Los `.af` y los PDF de imprenta quedan fuera del repositorio.
- Falta el logo vectorial de Icesi.

### 2026-11-22 · Landing pública del QR del material POP (frontend 2.9.0 · backend 2.9.0)
Prompt 8 del plan de la prueba externa. Decisiones del equipo (22/11): dos oleadas de impresión, lista de espera cuando no haya cupo, logo de Icesi (archivo por cargar), sin video.
- **Landing (sintonia.my):** la portada «Algo se está armando» pasa a ser la landing del QR. Conserva el glifo y su animación, y explica lo demás:
  - La frase: «Hay que vernos»… y esta vez, sí.
  - Qué hace Sintonía: «su +1 de confianza» dentro del WhatsApp del parche.
  - Cómo funciona, con las 8 viñetas del storyboard (en WebP, 720 px, con carga diferida).
  - Qué es y qué no es.
  - Un pie con el aviso de privacidad y «Solo mayores de 18».
- **Cupo:**
  - La landing le pregunta al backend (`?view=cupo`). Si hay cupo, el botón principal es «Crear mi grupo». Si no lo hay, no responde o el backend no está actualizado, es «Anotarme en la lista de espera».
  - El formulario de la lista pide nombre, WhatsApp, tamaño del parche (opcional), autorización y mayoría de edad.
  - «Ver el estado de mi grupo» abre el plan si ese celular ya participa; si no, explica que el enlace está en el mensaje de Sintonía.
- **Origen por pieza:** `?o=qr-totem`, `qr-volante`, `qr-tarjeta` o `qr-sticker` llega a la inscripción y a la lista de espera (columna `origen`). Los QR (SVG vectorial para Affinity, PNG de 1200 px y una hoja de prueba) están en `docs/pop/` y se regeneran con `python3 tools/qr-pop.py`.
- **Código secreto:** en celular, los deslizamientos cuentan solo si empiezan sobre el glifo. Así la landing se puede desplazar. `tools/qa-home.js` quedó al día.
- **Backend 2.9.0:**
  - `?view=cupo` es pública. Responde con la propiedad `CUPO_ABIERTO` («si» o «no»; por defecto «no»), no con un conteo.
  - La acción `lista_espera` guarda en la hoja nueva `lista_espera`. Valida un celular de Colombia y no anota dos veces el mismo número.
  - El aviso al equipo no lleva ni el nombre ni el número.
  - «Empezar piloto real» conserva la lista.
  - Despliegue: pegar el código, correr `probarMontaje()` y publicar una «Nueva versión».
- QA: backend 101 de 101 · código secreto 18 de 18 · axe sin hallazgos en la landing (celular y escritorio) · los 4 QR decodifican a su URL.

### 2026-11-22 · QA de punta a punta en el repositorio (`tools/qa/`)
- Las pruebas de punta a punta pasan al repositorio: `tools/qa/correr.sh todo` corre el backend sobre la hoja simulada y las páginas reales con Playwright. Usan datos ficticios y no tocan el backend real. Uso en `tools/qa/README.md`.
- La auditoría E2E ahora carga axe-core desde `node_modules`. Antes faltaba `@axe-core/playwright` y el chequeo se saltaba sin avisar.
- Los hallazgos que ya están en el plan se marcan `CONOCIDO`: M8 (disposición a pagar sin `plan_id`) y M9 (largo de la encuesta de cierre).
- **Accesibilidad (frontend 2.8.2, sin cambio de versión):** el botón «Mostrar» del teléfono en la consola pasa de 16 a 24 px de alto (WCAG 2.2, área táctil). El título «Recorrido del grupo» pasa de h3 a h2, para que el orden de los títulos no salte.
- Resultado: backend 95/95 · recorrido 57/57 · consola 26/26 · ola A 21/21 · auditoría E2E 64 OK, 0 ALTA, 0 MEDIA y 2 conocidos · contraste sin fallas · axe sin hallazgos.

### 2026-11-22 · Ajustes visuales de la auditoría anti-slop (frontend 2.8.2)
Auditoría con las skills `no-ai-design-slop` y `audit-ai-design-slop` (catálogo completo). Se renderizó cada superficie en escritorio y en iPhone 13. Cada cambio pasa la prueba de quitar: se elimina lo que no tiene función y se corrige lo mínimo con el sistema DS 3.0, sin rediseñar.
- **La web dice lo mismo que el chat (P1):**
  - El plan cerrado muestra «Aprox. $114.000 por persona», el mismo precio único del chat. La función vive ahora en `S.precioUno` y la usan la consola y la web; se quitó el «Costo» por parada.
  - La encuesta de cierre deja de llamarse «Pulso» en su etiqueta y su encabezado, y ya no promete «4 minutos» (tiene 26 campos). Tampoco lo prometen el plan, el mensaje de la consola ni la instrucción a Gemini. El tiempo real se mide en el ensayo del 25/11.
- **Home (P1):** el texto aparece desde 0,35 s, no desde 1,2–1,8 s. La etiqueta pasa a #a83200 (contraste de 4,40 a 5,45).
- **Pitch (P1/P2):**
  - «Ruta · Hoy» lleva una captura real de la consola 2.8.1, en lugar del marcador de foto.
  - En «Prototipo», «Capturas del piloto · pendientes» se reemplazó por «2 pruebas con mago · n = 1 cada una».
  - En «Factibilidad», el subtítulo del paso 2 queda en una línea («Hoy: consola del mago · después: n8n»), el paso 1 dice «WhatsApp Business · número del equipo» y las notas ya no mencionan Evolution API.
- **Plantillas repetidas (P2):**
  - El bloque oscuro de bienvenida queda solo en inscripción y unirse (clase `.hero.portada`). Plan, encuesta y aviso abren con un título sobre papel.
  - Se quitó el texto de relleno «Ruta clara, ganas intactas».
- **Etiquetas duplicadas (P2):** la inscripción ya no repite el lema («Menos vueltas para salir») y la encuesta tiene una sola etiqueta.
- **Menores (P3):**
  - La versión ya no se ve en el pie de las páginas de participante; queda en `<html data-version>`.
  - El panel escribe «1 grupo · 2 planes», sin paréntesis.
  - Las insignias ya no fuerzan minúsculas.
  - Los pasos hechos ya no van tachados.
  - El correo del aviso tiene 24 px de área táctil.
  - La categoría de las guías sube a 5,38 de contraste.
  - La marca de la consola tiene foco visible.
- **No entra:** los extremos repetidos del SUS. Cambia el formato de un instrumento validado y necesita el visto bueno de Néstor.
- QA: recorrido completo 57 de 57, F0–F5 26 de 26, ola A 21 de 21, auditoría E2E 59 OK con 0 graves, contraste sin fallas en 6 páginas y axe sin hallazgos nuevos.

### 2026-11-22 · Decks al día con la 2.8.1
- **Onboarding del monitor** (`docs/deck-onboarding-monitor.html`):
  - El recorrido usa **capturas reales de la consola 2.8.1** (`docs/deck-onboarding-monitor/`, 8 imágenes con datos ficticios del simulador) en lugar de las pantallas dibujadas de la 2.3.
  - Siete etapas: entrar y esperar (recordar a quien organiza), grupo en 3 pasos, opciones y «¿Qué día?», votos y cierre, confirmar con plazo, día del plan, y encuestas y plan 2.
  - Diapositiva nueva: «Paso 0 · Quién manda qué».
  - El contexto, lo que pasa en el chat, la voz, las contingencias, las reglas y las preguntas frecuentes van según la guía v1.2.
- **Pitch final** (`docs/deck-pitch-final.html`): queda alineado con la decisión del 19/11.
  - Factibilidad: hoy opera una persona con la consola; n8n entra cuando las pruebas manuales dejen de fallar.
  - Ruta: hoy, pruebas con mago en grupos reales de Cali; después, el agente.
  - Validación y solución: tres opciones para fechas concretas, encuesta de WhatsApp con «Ninguna me sirve».
- **Business case** pasa a «Versiones anteriores»: es de octubre (E2 web, W1/W2), antes de D1.

### 2026-11-22 · Documentación al día con la 2.8.1
- **Guía del monitor v1.2** (`docs/guias/onboarding-monitor.md`): reescrita para la consola 2.8.1. Diapositivas nuevas: «Paso 0 · Quién manda qué» y «Lo que toca ahora, y el resto en cuatro pestañas». También se actualizaron el paso a paso de los planes (grupo en 3 pasos, fechas, «¿Qué día?», plazo, encuesta del mago), lo que se registra del chat, la voz, las contingencias y las preguntas frecuentes. Se quitaron las notas de actualización de la 2.7.1 y la 2.8.0. Falta regenerar el deck.
- **Control de guías:** revisión del 22/11 con frontend y backend 2.8.1; el guion de la prueba con Cali, vigente.
- **Prompt maestro v3.2** en el Proyecto (`claude/prompt-maestro-v3.2.md`), para pegarlo en las instrucciones. Incluye versiones, evidencia nueva, calendario real, decisiones del 19/11 y del 22/11, y datos sensibles.

### 2026-11-22 · Guion de la prueba con Cali (prompt 9)
- `docs/guias/prueba-cali.md`: decisiones previas, con modo piloto recomendado y «Empezar piloto real» el jueves; lista de verificación de 12 puntos; quién manda qué en el Paso 0; roles y plantilla de observación por momento con hora; Mago in / Mago off; qué se hace después; tabla de hallazgos para comparar con la prueba externa; criterios A1–A6 para retomar la automatización; riesgos en las 5 dimensiones.
- Entra en el control de guías y en el menú del home.

### 2026-11-22 · Correcciones de la auditoría E2E (frontend 2.8.1 · backend 2.8.1)
Plan en `docs/plan-correcciones-2.8.1.md`. Se corrigen los 4 graves y 5 de los medios y bajos.
- **Plazo para confirmar (G1):** depende de cuánto falta para el plan, medido desde el cierre.
  - Más de 24 h: la víspera a las 6:00 p. m.
  - De 4 a 24 h: 2 h antes del encuentro.
  - Menos de 4 h: sin hora, «marquen si van ahora».
  - Nunca queda en el pasado; sin plazo, la consola no bloquea /hoy ni /salida. También se quitó el doble punto «p. m..».
- **/confirmado y /evento repiten la opción votada (G2):** mismo título corto, la zona una vez y el mismo precio que /opcion_N (`dondeTxt`, `precioUno`). Backend: los títulos de Gemini se cortan en la última palabra completa que cabe en 30 caracteres.
- **Datos sensibles (G3), en dos capas:**
  - Inscripción y unirse: si el texto menciona salud, religión, política u orientación sexual, no se puede avanzar y la página explica cómo decirlo en general.
  - Backend: esa frase se guarda como «[dato sensible omitido]», aunque alguien se salte el formulario, y la consola marca la preferencia.
  - La lista es la misma en `sintonia.js` (`S.SENSIBLE`) y en el backend (`TERMINOS_SENSIBLES_`). Decisión del 22/11: el alcohol y la comida no están en ella, porque «no toma alcohol» es una restricción del plan.
- **Encuesta del mago (G4):** es un paso del recorrido después de la encuesta de cierre de cada plan, incluso si se cayó. El backend dice por plan si ya hay respuesta (`pulso_mago`), así que tampoco se pierde al cambiar de navegador.
- **Arreglos pequeños:**
  - La pestaña Plan muestra las fechas concretas.
  - La página de unirse trae la pista nueva sobre datos sensibles.
  - «Ya aceptó 1 de 3» va en singular.
  - /recordatorio no lleva «[n]» si no hay votos anotados.
- QA: backend 95 de 95, recorrido completo 57 de 57, F0–F5 26 de 26, ola A 21 de 21 (más la comparación con la versión anterior, que ya no aplica), auditoría E2E 59 OK con 0 graves. Quedan los 3 medios aplazados del plan: la disposición a pagar sin plan, el largo de la encuesta de cierre y «Aceptó alguien más» con el grupo abierto (así por diseño).

### 2026-11-22 · Auditoría E2E de la 2.8.0 y plan de correcciones
- `docs/plan-correcciones-2.8.1.md`: una prueba completa simulada en modo prueba (código real, hoja simulada, n = 0 personas reales) dio 48 revisiones bien y 14 hallazgos. Hay 4 graves: el plazo para confirmar puede quedar en el pasado, /confirmado contradice la opción votada, los datos de salud de terceros llegan a la hoja y la encuesta del mago se pierde. El plan trae la causa en el código, la solución, el criterio de aceptación y el calendario hasta la prueba con Cali.

### 2026-11-22 · Ola A de la prueba externa (frontend 2.8.0 · backend 2.8.0)
Prompts 1 a 5 de `docs/prompts-mejoras-prueba-externa.md`, para la prueba con el grupo de Cali. Evidencia: una sola prueba en modo prueba (n = 1, Emergente).
- **Invitar al parche (prompt 1).** La pantalla final de la inscripción ya no dice «¡Listo!»: dice «Falta un paso: invita a tu parche», explica que Sintonía no tiene los números y el botón principal es «Enviar la invitación por WhatsApp» (recibe el foco). En la consola, «Esperar que acepten» trae «Recordar a <quien organiza> que comparta la invitación», con el mensaje listo, y un reloj a las 2 h sin aceptaciones nuevas (fuera de modo prueba).
- **Crear el grupo de WhatsApp (prompt 2).** Tres pasos: guardar a quien organiza como contacto («Copiar nombre y número»), crear el grupo agregándola y mandar «Invitar a…» a los demás. «Invitar a <quien organiza>» vuelve como plan B. Corrige la 2.7.1, que lo había quitado. La guía del monitor se actualizó.
- **Fecha concreta (prompt 3).** La inscripción pide «¿Qué fechas les sirven?» (botones de las próximas 2 semanas en los días marcados, hasta 4) y las guarda como `fechas: AAAA/MM/DD` en la disponibilidad. /opciones dice la fecha («para el sábado 29 de noviembre en la tarde»). Con varias fechas, la cola de Proponer agrega la encuesta «¿Qué día?» antes de la del plan. El cierre precarga la fecha. Gemini recibe la fecha concreta. Los grupos inscritos antes ven las próximas 3 fechas que caen en sus días.
- **Mensajes cortos y en orden (prompt 4).**
  - Cada opción cabe en 4 líneas: título, qué van a hacer, dónde (la zona una sola vez) con un solo precio y el mapa.
  - El precio es el punto medio del rango, redondeado a miles («$80.000 – $148.000» → «aprox. $114.000 por persona»). Se eligió el punto medio para no prometer un plan más barato de lo que suele salir.
  - El enlace de Maps lleva al mismo lugar, pero es más corto: espacios como «+», comas sin codificar y sin el departamento. **Falta probarlo en un teléfono real.**
  - Mientras el grupo vota no se pueden copiar /confirmado, /evento, /hoy, /salida, /todos ni la encuesta de cierre. /recordatorio desaparece cuando ya votaron todos.
  - /confirmado y el evento dicen hasta cuándo marcar si van (la víspera a las 6:00 p. m., o 3 h antes si el plan es muy pronto). Antes de ese plazo, la consola no ofrece /hoy ni /salida, salvo en modo prueba.
- **Avisos y preferencias (prompt 5).**
  - Backend 2.8.0: un correo por cada aceptación nueva («Aceptó 1 persona más: 2 de 3»), sin nombres ni números. Se apaga con `AVISO_POR_ACEPTACION = no`. `backend/README.md` explica que `NOTIFICAR_A` acepta varios correos separados por coma y que el del monitor va en las propiedades del script.
  - En la consola, «Aceptó alguien más» queda en la fila del grupo hasta que lo abres.
  - El paso 2 de la inscripción pide describir al grupo en general. La pista sobre datos sensibles va arriba del campo, con un ejemplo: «hay una restricción de alcohol».
- QA: backend 90 de 90, recorrido completo 57 de 57, ola A 22 de 22 (inscripción en iPhone 13 con capturas antes y después), F0–F5 25 de 25, axe sin hallazgos nuevos.

### 2026-11-22 · Voz: «Tu +1 de confianza» (frontend 2.7.3 · backend 2.7.4)
- Sintonía se presenta como **«tu +1 de confianza»** cuando le habla a una persona y como **«su +1 de confianza»** cuando le habla al grupo. Reemplaza «el quinto amigo» y la fórmula «amigo n + 1» de la 2.7.2.
- Cambia en la bienvenida a quien organiza, el primer mensaje a cada persona y /ingreso (constantes `MARCA_TU` y `MARCA_SU`), en los prompts de Gemini (backend 2.7.4: proponer y redactar), en el texto de E1.5 (`n8n/PROMPT-n8n-builder.md`), en E3 y en la demo del DS. También en el README, la guía y el deck del monitor, el business case y los prompts de avatares.
- Los decks históricos (pivote, status y método P7, pitch técnico, inducción v1) conservan la frase de su momento.

### 2026-11-22 · Repo público con controles y «el amigo n + 1» (frontend 2.7.2)
- **Seguridad:** el repositorio sigue público, como excepción documentada en `docs/seguridad-repo.md`: en el plan Free, Pages no publica desde repos privados, y aun con Pro el sitio seguiría siendo público. Hay una revisión automática nueva de claves, correos y teléfonos (`tools/revisar-datos.py`, acción «Seguridad de datos») y un `SECURITY.md`; el WhatsApp personal de un integrante sale de la página archivada del P4 (sigue en el historial de git).
- **Voz:** «el quinto amigo» no tenía un sustento fijo. Ahora Sintonía es el amigo n + 1 del parche según cuántos son (3 → «el cuarto amigo»), y en pareja o sin saber el tamaño, «el amigo extra». Cambia en la bienvenida al grupo, en el primer mensaje a cada persona y en la invitación a inscribirse; el texto de E1.5 en `n8n/PROMPT-n8n-builder.md` también.

### 2026-11-22 · Aprendizajes de la prueba externa y prompts de mejora
- `docs/prompts-mejoras-prueba-externa.md`: hallazgos por momento de la prueba externa (n = 1, modo prueba, Emergente), decisiones de la reunión P8c del 19/11 y 9 prompts en 4 olas (antes de la prueba con Cali, sustentación, material POP y guion de la prueba).
- `ESTADO.md` §4 se reordena con esas prioridades; n8n y licencias quedan aplazados.

### 2026-11-17 · Portada del home en celular
- El glifo va arriba al centro; el texto sigue alineado a la izquierda, con 28 px de margen a los lados y más aire entre bloques; el wordmark baja al centro. Escritorio sin cambios. QA del código secreto: 20 de 20.

### 2026-11-17 · El home al día con el repo y el código secreto en celular
- **Home generado:** las tarjetas del menú «Detrás de escena» salen de `home.json` y del repo con `tools/home.py`. Hay una tarjeta nueva, «Estado del repo», con las versiones, el último cambio, la fecha de `ESTADO.md` y sus tres primeros pendientes. `--check` revisa enlaces rotos, decks sin listar y versiones que no estén en `ESTADO.md` o en este archivo. La acción `.github/workflows/home.yml` lo regenera y lo revisa en cada push a `main`. Protocolo: `docs/protocolo-home.md`; notas para trabajar el repo: `CLAUDE.md`.
- **Código secreto en celular:** ↑ ↑ ↓ ↓ ← → ← → con deslizamientos. La portada ya no se desplaza ni recarga al deslizar; se ignoran los bordes (gesto de «atrás») y la franja de abajo; hay 4,5 s entre deslizamientos (antes 2,5 s) y el teléfono vibra con cada acierto. Prueba: `tools/qa-home.js` (iPhone 13, Pixel 7 y escritorio, 20 de 20).
- La versión que aparece junto a «Versiones» ya se veía vacía (leía una variable que no existe); ahora la escribe el generador, con frontend y backend.
- Enlaces del menú: entran «Estado del proyecto» y «Stickers»; el protocolo M2 pasa al archivo (superado).

### 2026-11-15 · Stickers de Sintonía v1
- `docs/stickers/`: 14 stickers estáticos de marca (512 × 512 WebP de menos de 100 KB y PNG), ícono de paquete 96 × 96, emojis por sticker, hoja de contacto, guía de uso por momento del plan y el generador. Pedido de la prueba de Juan José.

### 2026-11-15 · Prueba de Juan José con la consola 2.7.0 (frontend 2.7.1 · backend 2.7.3)
- **Crear el grupo:** WhatsApp no deja crear un grupo vacío. La consola y la guía del monitor dicen ahora: crear el grupo agregando a quien organiza (con «Copiar su número») y mandar el enlace a los demás; «Invitar a…» ya no aparece para quien organiza.
- **Emojis como «?»:** los mensajes que se abren en WhatsApp (`wa.me`: «Abrir chat», «Enviar a…», invitaciones) van sin emojis; los que se copian los conservan. El saludo pasa a «Hola, Paula. Soy Sintonía…».
- **Ajustar con Gemini:** vuelve el nombre y abre un campo para escribir la indicación, con sugerencias (más corto, más cálido, tono entre amigas, más formal, sin jerga). El backend pone la indicación primero y pide español neutro, sin jerga caleña (2.7.3).
- **Llegadas:** «Llegó», «En casa» y «Llegaron todos» se ven al instante; la consola los sostiene 3 min aunque la hoja tarde en reflejarlos.
- **«Pulso» pasa a «Encuesta de cierre»** en la consola, y la encuesta por persona («Copiar mensaje» o «Enviar a…») está también en Mensajes · Cierre. Las páginas de participante no cambian.
- **Encuesta del mago:** la escala de Desempeño se muestra de «Fracaso» a «Perfecto» (como las demás, de menos a más); se guarda invertida para conservar la escala de NASA-TLX (0 = perfecto).
- QA: backend 85 de 85; recorrido completo 52 de 52; F0–F5 y 2.7.1 25 de 25; axe-core sin hallazgos.

### 2026-11-15 · «Empezar piloto real» conserva los minutos del mago (backend 2.7.2) · **desplegado el 15/11**
- `operacion` y `sesiones` pasan a la lista de hojas que no se borran: son el registro de horas del monitor. El panel solo cuenta los minutos de grupos en modo piloto, así que los de los ensayos no entran en las métricas.
- Las sesiones que se cerraron solas en planes que ya no existen dejan de pedir minutos en la consola.
- La pestaña «⟲ Empezar piloto real» lo explica (la lista de lo que se conserva la manda el backend).
- QA: backend 85 de 85.

### 2026-11-15 · El motor puede pedir más opciones (backend 2.7.1)
- `reabrir_opciones` entra en `MOTOR_ACCIONES`: E1.5 puede abrir una ronda 2 de opciones sin marcar el plan como caído, igual que el mago en E1 (implicación N7 de `ESTADO.md`). Solo en planes de E1.5 (`solo_e15` si el plan es de E1).
- QA: backend 84 de 84.

### 2026-11-15 · Plan de mejoras F0–F5 de la revisión visual (frontend 2.7.0 · backend 2.7.0)
Plan y estado: `claude/revision-visual-consola-2026-11-15.md` (Proyecto).
- **F0 · Riesgos ante el grupo:** ningún texto con [corchetes] se copia ni se abre en WhatsApp (queda marcado y la consola dice qué falta); /hoy ya no inventa el conteo si nadie se apuntó. «Revocar y purgar» pasa a un menú «⋯» por persona, con confirmación.
- **F1 · Una pantalla de trabajo:** cola de mensajes (solo el siguiente va abierto; lo copiado o enviado se pliega con su hora; el atajo C actúa sobre el abierto). La acción va arriba y la ayuda debajo; el aviso de «Mago in» es una línea con botón. El mapa del recorrido vive en la columna izquierda, vertical, en pantalla ancha, y arriba del paso en media pantalla. La barra de pestañas flota abajo hasta llegar a su lugar. «Mensajes del mago al grupo» salió de Llegadas (cada mensaje se marca en su plantilla; queda «Envié otro mensaje al grupo»).
- **F2 · Formularios de un toque:** votos con «− n +» y barra (la ganadora se resalta y se elige sola); día y hora en botones según la disponibilidad del grupo («Otro día u hora» abre los campos); llegadas con un botón por persona y estado, con conteo arriba.
- **F3 · Sistema visual:** mapa semántico de color (naranja = acción, noche = seleccionado, crema = solo modo prueba, mostaza = solo IA, vitral = información, rojo = destructivo). «Ajustar tono» pasa a botón secundario sin emoji; fuera «v1», el id corto y la condición repetida; estados con mayúscula inicial y «Cerrado» en vez de «Fijado». Títulos cortos (el plan va debajo), «Publicado hace 3 min», foco visible en la marca, avisos arriba al centro por 3 s (6,5 s los errores).
- **F4 · Coherencia y privacidad:** la inscripción ya no ofrece «Trabajo» (el piloto es para amigos, familia o pareja); el pulso muestra un aviso con «Volver a intentar» si tarda más de 15 s; los teléfonos se ven enmascarados (+57 300 ••• 0001) con «Mostrar».
- **F5 · Medir la consola:** con «Mago in», la consola mide segundos activos, toques y scroll por etapa del mapa y los envía al cerrar la sesión (hoja nueva `medicion_consola`). Después de cada plan, **pulso del mago**: SUS de la consola y NASA-TLX sin ponderar (hoja nueva `pulso_mago`). El panel muestra las dos por condición en «La consola del mago».
- **Backend 2.7.0:** acciones `pulso_mago` y `medicion_consola` (requieren la llave de administración); `probarMontaje()` crea las hojas nuevas. Sin el despliegue, la consola sigue funcionando y avisa al guardar el pulso del mago.
- QA: backend 82 de 82; recorrido completo 52 de 52; F0–F5 22 de 22; axe-core sin hallazgos; sin scroll horizontal a 390 px.

### 2026-11-15 · Mapa del recorrido y revisión visual (frontend 2.6.0)
Revisión visual completa y plan de mejoras: `claude/revision-visual-consola-2026-11-15.md` (Proyecto).
- **Mapa del recorrido** arriba de «Lo que toca ahora»: Plan 1 y Plan 2 en cinco etapas (Grupo, Proponer, Decidir, El día, Cierre) bajo los tres momentos (activación, interacción, continuidad). Cada etapa dice si está hecha, si toca ahora o si falta, con un resumen corto («3 de 3 aceptaron», «Ganó: …», «vie 20 · 19:00 · llegaron 3/3», «Pulso 1 de 3»). Tocar una etapa abre su pestaña y su formulario. Debajo, solo los pasos de la etapa actual; la lista completa queda plegada.
- **Relojes:** se apagan cuando lo que miden ya pasó (llegadas, «en casa», pulso), no solo cuando se marcó el mensaje. En modo prueba no se muestran, porque no hay espera.
- «Modo prueba» ya no se estira a todo el ancho con la sesión del mago abierta.
- QA: recorrido 52 de 52 (incluye el mapa); axe-core sin hallazgos.

### 2026-11-14 · QA visual de la consola (frontend 2.5.1)
- Los contenedores que pueden partirse en dos líneas (condición, modo prueba, sesión del mago) dejan de ser píldoras: radio de 16 px y la misma altura; los botones internos, 11 px. La sesión del mago queda en una sola línea en escritorio.
- Modo prueba sin texto repetido (el aviso de abajo ya lo dice); la barra noche flota separada del borde y el contenido ya no asoma por sus esquinas.
- Los mensajes de una pestaña oculta ya no aparecen recortados; etiquetas de etapas con separación; «Atajos» se oculta en celular.
- QA: recorrido 49 de 49; axe-core sin hallazgos.

### 2026-11-14 · Marca actual, enlaces de ubicación y accesibilidad (frontend 2.5.0 · backend 2.5.0)
QA de UX, UI y accesibilidad: `claude/qa-ux-ui-a11y-consola-2026-11-14.md` (Proyecto).
- **Enlaces de ubicación:** se busca por nombre y dirección (Google Maps abre la ficha del lugar); las coordenadas solo valen si caen en Cali y se corrigen si la hoja en español las leyó como miles (3.4516 → 34516); un dato vacío ya no reemplaza uno bueno; «Ver en el mapa» en cada mensaje con ubicación. `probarMontaje()` reporta la calidad de las ubicaciones.
- **Capa de marca 2026-11** (`piloto/assets/consola.css`) en la consola y el panel: reemplaza la firma «radio» del DS 3.0 (selector de banda, interruptor de palanca, luz piloto, mono) por el lenguaje de la portada y el pitch final. Barra noche fija con la sesión del mago; un solo sistema de botones; tarjetas de mensaje con una fila de acciones; recorrido segmentado; trazo de onda.
- **Media pantalla y celular:** la acción va primero por debajo de 1100 px.
- **Relojes** (recordatorio, salida, checkpoint, en casa, pulso) con «Toca ya» en la lista y en el título de la pestaña. **Atajos** C, N, M y ?.
- **Accesibilidad:** sin hallazgos de axe-core (WCAG 2.2 AA) en consola, panel y páginas de participantes; foco que vuelve a la acción del paso; cambio de paso anunciado; avisos que no tapan botones; «reducir movimiento».
- **Carga liviana:** `?view=mago&inv=0`; el inventario se pide una vez cada 10 min o con «Recargar».
- QA: backend 78 de 78; recorrido completo 49 de 49.

### 2026-11-15 · El mago como usuario (frontend 2.4.0 · backend 2.4.0)
Ajustes de la segunda prueba (14/11) y su grabación de pantalla. Plan: `claude/plan-ejecucion-ajustes-2026-11-15.md` (Proyecto).
- **Lo que toca ahora** es la pantalla de trabajo: cada paso trae sus mensajes adentro, con «Copiar y marcar enviado», y botones directos (cerrar reclutamiento, crear plan, «Llegaron todos», «Todos en casa», pulso por persona).
- **Lo escrito no se pierde** al cambiar de pestaña o al actualizarse la consola (V1). Día y hora del encuentro en dos campos; la hora en una lista de 15 en 15 min.
- **Se registra la decisión de cada ronda**, no el voto de cada persona: votos por opción copiados de la encuesta, votaron X de Y, ronda (hoja nueva `decisiones`). «Pedir más opciones» durante la votación sin marcar el plan como caído ni gastar el plan 2 (V3). La hoja `votos` queda por compatibilidad.
- **Encuestas y evento de WhatsApp listos para copiar** campo por campo, con la indicación de una o varias respuestas (V4, V7). El enlace largo de Google Calendar sale de `/confirmado`, que ahora son tres mensajes cortos.
- **Gemini propone siempre 3 opciones** (cumple todo, punto medio, algo diferente), recibe la disponibilidad del grupo y el chat pegado; si trae menos, pide otra vez una vez. Cada opción lleva lugar, zona y enlace de Google Maps. Aviso si se pide sin contexto (V2).
- **Pulso con enlace personal** por persona; el aviso al grupo ya no lleva un enlace genérico que solo abría en el celular del registro (V6). En modo prueba, llegadas y pulso sin esperar la hora del encuentro.
- **Textos**: `/ingreso` más corto; `/opciones` dice el día; `/hoy`, `/todos`, `/dia` nuevos; `/horario` con horas de encuentro de la franja (V5); fuera «No usamos su ubicación», «Gracias por sintonizar hoy» y «Si hubo sintonía, sigan».
- **Grupo**: nombre del grupo en el registro (`grupos.nombre`) y en la consola; mensaje de bienvenida con el enlace de inscripción; archivar grupos de prueba en la consola; aviso tras 10 min sin actividad para cerrar Mago off (V9); avisos de inscripción en la consola y, con `NOTIFICAR_A`, por correo.
- **Mensajes** en orden cronológico por etapa con etiquetas para saltar; «Indicación para Gemini» aparte del texto base.
- QA: backend 76 de 76; recorrido completo en el navegador 48 de 48 (guion de la grabación, modo prueba); QA visual sin desbordes.
- **Pendiente:** replicar en n8n (W1, W3, W4, W5) para que E1.5 tenga el mismo estímulo; paquete de stickers en la cuenta.

### 2026-11-14 · Marca en las páginas de participantes (frontend 2.3.2)
- Registro, unirse, plan, pulso y aviso usan el wordmark «sintonía» y un hero en noche con mostaza y vitral; el registro lleva el lema «Menos vueltas, más plan».
- La versión se ve en el encabezado de la consola y del panel (no tienen pie de página).
- QA visual en escritorio y celular (iPhone 13): sin desbordes horizontales; QA E2E 24 de 24.

### 2026-11-14 · QA de punta a punta de la consola (frontend 2.3.1)
- **QA E2E** del flujo E1 en la consola (grupo → /ingreso → opciones y encuesta → votos y empate → cierre con salida calculada → /confirmado → llegadas → pulso → Mago off), contra el backend 2.3.6 en una hoja simulada: 24 de 24.
- **Arreglo:** marcar «En casa» a alguien sin «Llegó» antes ahora registra las dos cosas. Antes, esa persona no contaba como llegada (ni en «Lo que toca ahora» ni en la métrica llegaron / invitadas).

### 2026-11-14 · Propuestas más rápidas y look & feel (frontend 2.3.0 · backend 2.3.6)
- **Backend 2.3.6:** antes de llamar a Gemini, el inventario activo se filtra con lo que pidió el grupo (zona, franja y presupuesto) y se envían como máximo 50 lugares, en vez de los 1000. Si el filtro deja menos de 15, se afloja solo. Las ids que devuelve Gemini se siguen validando contra todo el inventario activo. QA: 67 de 67.
- **Look & feel:** la consola, el panel y las páginas de participantes usan la marca actual (papel y noche, vitral como color principal, mostaza de acento, naranja en el detalle, títulos en Inter 800). Solo se sobrescriben tokens semánticos; la paleta del DS 3.0 no cambia.

### 2026-11-14 · Inventario verificado (backend 2.3.5)
- **Solo entra lo marcado «activo».** Antes, un `estado` vacío contaba como activo: con el inventario ampliado (1000 filas, todas con `estado` vacío) Gemini podía proponer lugares sin verificar, y cada propuesta le enviaba las 1000 filas.
- `probarMontaje` acepta el inventario de 33 columnas en otro orden: las 14 del código están, el código lee por nombre y nunca escribe en esa hoja.
- **Antes de desplegar:** marcar en la hoja los lugares verificados como `activo` y el resto como `por_confirmar`; si no, la consola no tendrá lugares para proponer.

### 2026-11-14 · Velocidad, marca y línea base (frontend 2.3.0 · backend 2.3.4)
- **Más rápido (backend 2.3.4):** la hoja, cada pestaña y sus filas se leen una sola vez por consulta; cualquier escritura descarta la copia de esa pestaña. Antes la vista del mago abría la hoja en cada lectura y leía «preferencias» una vez por grupo. QA: 67 de 67.
- **Marca:** el logo final (glifo con anillos) reemplaza el círculo genérico en las 8 páginas del piloto (`piloto/assets/glifo.svg`); la consola muestra el wordmark «sintonía» con la tilde.
- **Línea base:** «planes que sí hicieron» y «planes que se cayeron el último mes» pasan a una sola pregunta, comparable con la encuesta del pivote: «De los últimos 5 planes que propusieron en el chat del parche, ¿cuántos se hicieron?». Se guarda en las mismas columnas (caídos = 5 − hechos); el panel cambia sus etiquetas.

### 2026-11-14 · Ajustes del test drive (frontend 2.3.0 · backend 2.3.3)
Ensayo interno del 13/11 en modo prueba (Juan José como mago). Todavía no hay grupos reales: los cambios entran antes del primer plan del piloto, así que todos los grupos tendrán la misma versión.
- **Grupo:** «Crear el grupo de WhatsApp y enviar el enlace», «Enviar /ingreso» y «Crear el plan 1» son tres pasos. La tarjeta del grupo guarda el enlace de invitación y arma «Invitar a…» por persona (la privacidad de cada usuario puede impedir agregarlo directo).
- **Opciones:** `/opciones` pasa a ser una introducción, seguida de un mensaje por opción (`/opcion_1` a `/opcion_3`) y de `/encuesta` (pregunta y opciones para la encuesta de WhatsApp, de una sola respuesta, con «Cualquiera me sirve» y «Ninguna me sirve»). La votación se marca como enviada desde la encuesta. Nuevo `/empate`.
- **Recordatorio:** la versión de grupo usa conteo («Van 2 de 3 votos»), sin nombres. La personal queda para después de 24 h.
- **Cierre:** el encuentro se elige en pasos de 15 min y la salida sugerida se calcula sola (1 h antes, editable), con una vista previa «Salida → Encuentro».
- **Confirmación:** `/confirmado` sin la petición de asistencia y con enlace «Agéndenlo» (Google Calendar). Nuevas `/asistencia` («¿Van?»), `/reprogramar` (otro día u otra hora) y `/horario` (encuesta con horas concretas).
- **Día del plan:** `/checkpoint` y `/en_casa` como encuesta. `/salida` recuerda el pico y placa en días hábiles. Si el encuentro es después de las 8:00 p. m., el recorrido pide «en casa» y pulso al día siguiente a las 10:00.
- **Pulso:** en modo prueba abre antes de la hora del encuentro. SUS ítem 7: «aprenderían».
- **Consola:** una carga vieja ya no pisa una más nueva (los estados «retrocedían»). Votos con las mismas palabras de la encuesta.
- **Backend 2.3.3:** el prompt de Gemini pide títulos de 30 caracteres como máximo y una descripción de una o dos frases (`PROMPT_VERSION` p2-2026-11). QA: 67 de 67. La consola recorta los títulos largos aunque el backend no esté desplegado.
- **Pendiente:** replicar en las plantillas de n8n (W1, W3, W4 y W5) para que E1.5 envíe lo mismo que E1. 

### 2026-11-06 · Favicon
- **Nuevo** en la raíz: `favicon.svg` y `favicon.ico` (16, 32 y 48 px; disco mostaza con la «s» del logo final, sin anillos para que se lea en la pestaña), `apple-touch-icon.png` (180 px), `icon-192.png` e `icon-512.png` (glifo completo con anillos) y `site.webmanifest`.
- Etiquetas `<link rel="icon">`, `apple-touch-icon` y `manifest` en el `<head>` de las páginas del portal, el piloto, los decks y las guías. `archivo/` y `e3-app/` no se tocan: reciben `/favicon.ico` desde la raíz.

### 2026-11-06 (tarde) · Onboarding y plan de pruebas alineados
- **Deck de onboarding del monitor** (`docs/deck-onboarding-monitor.html`): la consola aparece como `sintonia.my`; el ejemplo de `/confirmado` incluye dirección y presupuesto; la etapa 7 menciona las preguntas de precio para quien organiza.
- **Orden de lectura:** el mapa de la consola se numera de arriba abajo y de izquierda a derecha, y en la etapa 4 el aviso de «faltan votos» pasa a ser el paso 2. En las etapas 1, 2 y 7, donde el orden de las acciones no sigue el de la pantalla, una ruta punteada une los marcadores 1 → 2 → 3. Capítulos en secuencia: Contexto · Operación · Walkthrough · En el chat · Reglas · Cierre.
- **One-pager** (`docs/plan-pruebas-usuario.html` + PDF): bloques en orden de lectura 1 → 8 sin saltos entre columnas; la tabla de métricas sigue el orden de las preguntas; «pulso» como en la consola; ensayo del monitor en el calendario.
- `docs/guias/onboarding-monitor.md` v1.1 con el mismo vocabulario. El portal enlaza al deck de onboarding.

### 2026-11-06 · Monitor, plan de pruebas y aviso v2
- **Aviso de privacidad v2 aprobado por Néstor.** Falta publicar el texto en `piloto/aviso.html` y subir `AVISO_VERSION` (frontend y Propiedades del script) antes del primer grupo real de E1.5.
- **Nuevo:** `docs/deck-induccion-monitor.html` (14 diapositivas) y `docs/guias/onboarding-monitor.md` (19 diapositivas en Markdown, fuente para el motor de presentaciones). El monitor opera E1 como mago con acceso a la consola; la clave se entrega en persona y se rota al terminar.
- **Nuevo:** `docs/plan-pruebas-usuario.html`, one-sheet imprimible (carta) con preguntas, pruebas, métricas, participantes, roles, calendario propuesto y lo que falta antes de arrancar.
- **n8n:** arreglos del 3/11 en la instancia (privacidad de E1.5-01, plantillas W0–W5, `pid` en `view=plan`, eventos). Siguen abiertos B1, B5 e I5. Nuevo `n8n/separar_respaldo.py` para pasar el respaldo de los flujos al repo. Detalle en `n8n/CHANGELOG.md`.
- Menú del portal: enlaces a la inducción y al plan de pruebas.
- Sin cambios en el frontend (2.2.2) ni en el backend (2.3.2).

### 2026-10-30 · E1.5 · Flujos en n8n revisados
- **En la instancia de n8n:** 9 flujos (E1.5-01, `SW · Avisar revisor`, `SW · Enviar mensaje` y W0–W5). Todos inactivos y sin ejecuciones de producción. Los W0–W5 aún no están exportados al repo.
- **Bloqueantes encontrados:** los sub-flujos envían por Evolution API sin aprobación humana (contradice la automatización asistida), `view=plan` sin `pid` en W2–W5, plantillas sin llenar en W1–W5, texto equivocado en W0, y W1 envía `/opciones` antes de `publicar_plan`.
- **Nuevo:** `n8n/GUIA-CONTINUACION.md` (arreglos y 12 pruebas), `n8n/PROMPT-n8n-builder.md` (recorrido del storyboard M2 para el constructor de IA de n8n) y `n8n/CHANGELOG.md`.
- **Actualizado:** `n8n/E15-01-voto-minimo.json` (lee los campos del formulario por etiqueta; cuerpo de `evento` por parámetros) y `n8n/README.md`.
- Sin cambios en el frontend (2.2.2) ni en el backend (2.3.2). Estado detallado en `.cowork/estado-e15-n8n.md` (local).

### 2026-10-24 · E1.5 · Canal y primer flujo en n8n
- **Canal de E1.5: automatización asistida.** n8n interpreta y redacta; una persona revisa y copia y pega en el grupo, desde el mismo número y los mismos grupos que E1. La API de grupos de Meta queda como fase posterior (exige cuenta oficial verificada y un número en Cloud API; no aplica al número de la app).
- **Nuevo:** `n8n/` con `E15-01-voto-minimo.json` (formulario → resolver → votar o evento; escala a una persona ante cualquier duda), `README.md` y `GUIA-IMPLEMENTACION.md`. Sin credenciales. Aún sin probar contra el backend desplegado.
- Sin cambios en el frontend (2.2.2) ni en el backend (2.3.2). Detalle en `.cowork/decisiones-p7.md` §9 (local).

### 2026-10-24 · Sync P7c · Semana de pruebas desde cero
- **Diseño nuevo:** dos condiciones en paralelo, las dos en WhatsApp: **E1 · WhatsApp + mago** y **E1.5 · WhatsApp automatizado** (n8n; valor interno `E2`). Reemplaza a E2 (web app). 2 grupos por condición más 1 de reserva, y 2 planes por grupo.
- **Métricas principales:** SEQ por momento y SUS, validadas con Néstor. De contexto: llegaron / invitadas, minutos humanos por plan (mago in / mago off) y Nivel 2.
- **Publicado:** frontend 2.2.2 en `main` (GitHub Pages) y backend 2.3.2 en Apps Script. QA del backend: 67 de 67 (`node backend/qa/qa_backend.js`).
- **DS 3.0 en el piloto:** tokens, Button, Luz piloto, Lista del plan, Selector de banda y Hoja con asa en la consola, el panel y las páginas de participantes (`piloto/assets/ds3.css`).
- La viabilidad técnica del motor queda **pendiente**: la revisión con Monk no ocurrió. Corrige D4 de las Decisiones P7.
- Fuera del piloto: botón de pánico (hoja de ruta).

### 2026-10-15 · Decisiones P7 · Canal único
- **Canal fijo: WhatsApp.** Se cierra la comparación con la web app (E2).
- **E3 (chat con IA y DS 3.0)** queda como frontera de solución standalone; mitiga la dependencia de un solo canal (Meta).
- Sin cambios de código en este registro. Detalle en `.cowork/decisiones-p7.md` (local).

### 2026-10-04 · Reestructura
- Estructura por componentes: `piloto/`, `backend/`, `datos/`, `docs/`, `archivo/`.
- El frontend en uso pasa de `/M2-Claude/` a la URL estable `/piloto/`. `404.html` redirige las URLs anteriores con sus parámetros.
- La raíz deja de ser la landing de H1 y pasa a ser el portal del proyecto.
- Todo lo de antes del pivote (H1–H4, panel de investigadores, decks de P4) pasa a `archivo/p4-pre-pivote/`.
- Las versiones M1-Claude, M1-gemini y M2-gemini pasan a `archivo/` y quedan sin conexión al backend del piloto.
- Las ramas `M1-Claude`, `M1-gemini` y `M2-gemini` se convierten en tags (`piloto/v1.0.0`, `archivo/gemini-m1`, `archivo/gemini-m2`). Desde ahora solo existe `main` más ramas cortas de trabajo.
- Historial del backend y del inventario reconstruido en commits propios, a partir de las copias de respaldo del equipo.

## Frontend del piloto (`piloto/`)

Desde la 2.3.0, el detalle de cada versión está en la sección «Repositorio» (arriba). Resumen por versión:

### [2.8.2] · 2026-11-22 · Ajustes visuales de la auditoría anti-slop · **en vivo**
Tag `piloto/v2.8.2` por crear (al congelar, el jueves 26). Solo frontend; el backend sigue en 2.8.1.
### [2.8.1] · 2026-11-22 · Correcciones de la auditoría E2E
Tag `piloto/v2.8.1` por crear (al congelar, el jueves 26).
### [2.8.0] · 2026-11-22 · Ola A de la prueba externa (invitar, crear el grupo, fechas, orden, avisos)
Tag `piloto/v2.8.0` por crear.
### [2.7.3] · 2026-11-22 · Voz «Tu +1 de confianza»
Tag `piloto/v2.7.3` por crear.
### [2.7.2] · 2026-11-22 · «El amigo n + 1» en los mensajes
Tag `piloto/v2.7.2` por crear.
### [2.7.1] · 2026-11-15 · Prueba de Juan José
Grupo con quien organiza, `wa.me` sin emojis, Gemini con indicación, llegadas al instante, «Encuesta de cierre», escala de Desempeño. Tag `piloto/v2.7.1` por crear.
### [2.7.0] · 2026-11-15 · Plan de mejoras F0–F5
Marcadores `[n]` bloqueados, menú «⋯» por persona, cola de mensajes, mapa en la columna izquierda, pestañas flotantes, votos «− n +», día y hora en botones, llegadas en un toque, color semántico, teléfonos enmascarados, sin «Trabajo» en la inscripción, pulso del mago y medición de la consola. Tag `piloto/v2.7.0` (creado el 15/11).
### [2.6.0] · 2026-11-15 · Mapa del recorrido (2 planes × 5 etapas) y relojes que se apagan
### [2.5.1] · 2026-11-14 · QA visual (radios y alturas, barra flotante, mensajes recortados)
### [2.5.0] · 2026-11-14 · Marca actual, enlaces de Google Maps, relojes, atajos y accesibilidad (axe 0)
### [2.4.0] · 2026-11-15 · El mago como usuario: decisión por ronda, encuesta nativa, textos nuevos, formularios que no se borran
### [2.3.2] · 2026-11-14 · Marca en las páginas de participantes
### [2.3.1] · 2026-11-14 · QA de punta a punta de la consola
### [2.3.0] · 2026-11-14 · Ajustes del test drive, velocidad y look & feel

### [2.2.2] · 2026-10-24 · Feedback del QA, radios y controles de la barra superior
- **Mago in / off rediseñado:** un estado (luz, «Fuera de línea» o «En línea · 57 min», quién y en qué plan) y un solo botón (Button primario «▶ Mago in» o «■ Mago off»). Se quitan la empuñadura y el punto decorativo de «Presione para hablar». Aviso a las 2 h; a las 4 h la sesión se cierra sola sin minutos y la consola pide registrarlos a mano.
- **Modo prueba:** título, estado escrito y un interruptor estándar; activo = mostaza con «SÍ» y aviso en la lista de grupos.
- **Radios consistentes:** contenedores 16 px, controles internos 12 px, botones y fichas en píldora.
- **Recorrido:** crear el grupo de WhatsApp, /ingreso y el plan 1 son un solo paso (con dos botones). /opciones y /confirmado se marcan como enviados en Mensajes y el recorrido avanza. Las secciones terminadas se pliegan. Aviso «Abre Mago in» si no hay sesión abierta.
- **Lista de grupos:** cada fila muestra su paso pendiente.
- **Pestaña Plan:** fichas «Plan 1 · Plan 2» en lugar del menú. La pestaña Llegadas pasa a «Llegadas y tiempo».
- **Participantes:** «Ahora: …» debajo de la Luz piloto en el plan fijado; en E1 el paso del día dice que se avisa en el grupo de WhatsApp. Fichas de días y franjas con ✓.
- Requiere el backend 2.3.2.

### [2.2.1] · 2026-10-24 · DS 3.0 en las páginas de participantes y mago in / off inequívoco
- **Participantes** (inscripción, aceptación, plan, pulso, aviso): tema DS 3.0 y **Button** del DS (anatomía de `.s-button` sobre `.btn`).
- **Plan:** **Luz piloto** con el estado (Esperando al parche, Buscando opciones, Votación abierta, Plan fijado, El plan no se dio) y **Lista del plan** «Así va tu plan» (5 pasos con el actual marcado). El pulso dice «unos 4 minutos».
- **Consola · Mago in / off:** caja gris punteada con «Fuera de línea» frente a caja cobalto profundo con «En línea» y el reloj; **tira fija arriba** mientras la sesión está abierta, con «■ Mago off» siempre a mano; el título de la pestaña muestra «● En línea». El estado cambia en el acto al abrir o cerrar la sesión, sin esperar la recarga.

### [2.2.0] · 2026-10-24 · Consola con componentes del DS 3.0
- **Tema DS 3.0 en la consola y el panel** (`assets/ds3.css`): tokens del DS 3.0 en modo Claro, puente de las variables del piloto y fuentes Archivo, Inter y JetBrains Mono. Inscripción, aceptación, plan y pulso siguen con el estilo actual.
- **Barra superior:** Selector de banda (E1 / E1.5), Interruptor de palanca para el modo prueba (apagado = piloto real) y **Mago in / mago off** con «Presione para hablar» y el Display de señal (minutos en línea).
- **Grupos como lista** (Fila de sintonía + Luz piloto: Reclutando, Votación, Fijado, Caído, Desestimado). Elegir un grupo reemplaza el menú «Grupo».
- **«Lo que toca ahora»** (Próxima sintonía): el siguiente paso del grupo con un botón que lleva a la pestaña y resalta el control. **Recorrido del grupo** (Lista del plan): 12 pasos del grupo, plan 1 y plan 2, con hecho / ahora / pendiente.
- **Pestañas:** Grupo · Plan · Mensajes · Llegadas; Inventario, Cambios entre planes y Empezar piloto real pasan al menú «Ajustes».
- **Confirmaciones en una Hoja con asa** (diálogo) en lugar de los dos toques en el botón.
- **Mensajes** con aspecto de burbuja de WhatsApp (Sync P7c).
- Sin cambios de backend (sigue la 2.3.0) ni de las páginas de participantes.

### [2.1.0] · 2026-10-24 · Semana de pruebas desde cero (Sync P7c)
- **E1.5 · WhatsApp automatizado reemplaza a la web app.** Usa el valor interno `E2`. Las dos condiciones corren en WhatsApp: se quitan la votación en página, el recordatorio al organizador de E2 y los textos de web app en consola, inscripción, aceptación, plan, pulso, panel y mapa.
- **Consola · Mago in / mago off:** barra superior con quién opera, sesión abierta y minutos. Al cerrar, los minutos se suman al plan. El formulario de minutos por bloque pasa a «Registro manual» plegado.
- **Consola:** dos planes por grupo («Plan 1», «Plan 2», «+ Crear plan 2»); guía «Cómo funciona» para E1 y E1.5; en E1.5 se pueden registrar votos y estados a mano si el motor falla; contingencias «Pasar al mago» (E1.5) y «Pasar a la web» (las dos). Cambios I4 «entre planes», opcionales.
- **Panel rediseñado:** arriba, E1 frente a E1.5 con las métricas validadas con Néstor (SEQ por momento y SUS, cada una con su n) y tres de contexto (llegaron / invitadas, minutos humanos por plan, Nivel 2). SEQ y SUS por plan en cada condición. El resto (embudo, capas, costo, línea base, disposición a pagar, cambios) queda plegado.
- **Inscripción:** se quita «¿Cuántas personas tiene tu parche?»; queda «¿Cuántas personas van a este plan, contándote?». Nueva pregunta de disponibilidad del organizador (días y franjas). Parámetro opcional `origen` en el enlace.
- **Mapa del piloto:** fases nuevas (preparación, ensayo 25/10, empezar desde cero, semana de pruebas con carriles E1 y E1.5, lectura y cierre).
- Requiere el backend 2.3.0. Con uno anterior, la consola avisa que mago in / mago off no está disponible y el panel avisa que no llegan SEQ ni SUS.

### [2.0.8] · 2026-10-14 · Usabilidad SEQ + SUS (sugerencia de Néstor, fuera de I4)
- Pulso (`retro.html`): bloque nuevo «¿Qué tan fácil fue usar Sintonía?» con una **SEQ 1–7 por momento** (activación, interacción y, desde la ronda 2, continuidad) y el **SUS de 10 ítems** (1–5, omitible completo). El pulso pasa a ~4 minutos.
- Pulso: si la persona ya respondió el pulso de ese plan (W1) y falta la usabilidad, el mismo enlace abre solo ese bloque («Nos falta una parte»). Con un backend anterior a la 2.2.6 el bloque no aparece y el pulso sigue como antes.
- Consola: en «Enlaces personales al pulso», estado «pulso ✓ / usabilidad ✓ / pendiente» y botón **«Enviar complemento»** con un texto único para E1 y E2. Pestaña de reinicio: etiqueta de la hoja `usabilidad`. `/retro` dice 4 minutos.
- Panel: tabla de usabilidad por condición, con SEQ por momento, SUS y días desde el encuentro, separada por ronda y por toma (con el pulso o diferida).
- `S.scale` acepta un máximo (1–7 para la SEQ); dos mensajes de error nuevos.
- Aviso de privacidad: aclaración del punto 2 (preguntas de facilidad de uso, escala 1–7). Misma versión `v1-2026-10`.
- **No es el cambio W1 → W2 (I4):** aplica igual a las dos condiciones y no sube la versión de los grupos.
- Requiere el backend 2.2.6.

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

Desde la 2.3.3, el detalle de cada versión está en la sección «Repositorio» (arriba). Resumen por versión:

### [2.8.1] · 2026-11-22 · Datos sensibles fuera de la hoja, marca de la encuesta del mago, títulos en palabra completa · **desplegado el 22/11**
Tag `backend/v2.8.1` por crear. QA: 95 de 95.
### [2.8.0] · 2026-11-22 · Aviso por cada aceptación, hora de aceptación y fechas para Gemini · desplegado el 22/11
Tag `backend/v2.8.0` por crear. QA: 90 de 90.
### [2.7.4] · 2026-11-22 · Gemini se presenta como «el +1 de confianza» · desplegado el 22/11
Tag `backend/v2.7.4` por crear.
### [2.7.3] · 2026-11-15 · Gemini pone primero la indicación del mago y usa español neutro · desplegado el 15/11
Tag `backend/v2.7.3` por crear. QA: 85 de 85.
### [2.7.2] · 2026-11-15 · «Empezar piloto real» conserva `operacion` y `sesiones` · desplegado el 15/11
Tag `backend/v2.7.2` (creado el 15/11). QA: 85 de 85. Incluye 2.7.0 y 2.7.1.
### [2.7.1] · 2026-11-15 · `reabrir_opciones` en `MOTOR_ACCIONES` (solo planes de E1.5)
### [2.7.0] · 2026-11-15 · Hojas `pulso_mago` y `medicion_consola`; panel «La consola del mago»
### [2.5.0] · 2026-11-14 · Revisión de ubicaciones en `probarMontaje`; `?view=mago&inv=0`
### [2.4.0] · 2026-11-15 · Hoja `decisiones`, `reabrir_opciones`, Gemini con 3 opciones, eventos nuevos, correos al equipo, modo prueba sin reloj
### [2.3.6] · 2026-11-14 · Propuestas más rápidas
### [2.3.5] · 2026-11-14 · Inventario verificado
### [2.3.4] · 2026-11-14 · Velocidad y línea base
### [2.3.3] · 2026-11-14 · Ajustes del test drive

### [2.3.2] · 2026-10-24 · Feedback del QA
- Eventos nuevos `msg_ingreso`, `msg_opciones`, `msg_confirmado` y `msg_retro` (solo equipo): los mensajes marcados como enviados.
- Sesiones de mago abiertas más de 4 h: se cierran solas sin minutos (`cerrada_auto`) y `?view=mago` las lista en `sesiones_por_revisar`. Un registro manual con `sesion_id` las completa (`cerrada_a_mano`).
- QA: 67 de 67 (`node backend/qa/qa_backend.js`).

### [2.3.1] · 2026-10-24 · QA
- `rows_` ignora filas completamente vacías: después de «Empezar piloto real» la fila 2 vacía aparecía como un grupo y un plan fantasma en `?view=mago`.
- QA de punta a punta con una hoja simulada: 63 de 63 comprobaciones (E1 y E1.5, dos planes por grupo, mago in / off, MOTOR_KEY, resolver, SEQ/SUS, panel y limpieza).

### [2.3.0] · 2026-10-24 · Semana de pruebas desde cero (Sync P7c)
- Hoja nueva `sesiones` y acción `sesion_mago` (`in` / `off`, solo equipo): al cerrar, guarda minutos y suma una fila en `operacion` con causa `sesion`. Abrir una sesión cierra la anterior del mismo mago. `?view=mago` devuelve `sesiones_abiertas`.
- `MOTOR_KEY` (propiedad): el motor de E1.5 puede llamar `evento`, `operacion` (actor `motor`), `proponer_ia`, `publicar_plan`, `cerrar_plan` y `redactar_ia`. `?view=resolver` devuelve solo el `pid` y el `rol` de un número en un grupo activo. `probarMontaje` revisa que `MOTOR_KEY` exista y no sea igual a `ADMIN_KEY`.
- `linea_base_grupo` + `disponibilidad` y `origen` (columnas al final). `tamano_grupo` pasa a opcional (si falta, vale `n_invitados`).
- `marcar_failover` acepta `hacia = web | mago`. Actor nuevo `motor`; causa nueva `sesion`.
- `probarMontaje` acepta columnas extra al final de una hoja (p. ej. el inventario ampliado a 33 columnas): avisa con ℹ️ en lugar de ❌.
- Nota de versiones: 2.3.0 (y el frontend 2.1.0) eran los números del borrador «E2 autónoma» (`docs/guias/e2-autonoma-backend-y-firebase.md`), que nunca se publicó y queda superado porque la web app sale del experimento.

### [2.2.6] · 2026-10-14 · Usabilidad SEQ + SUS
- Hoja nueva `usabilidad` (`probarMontaje` la crea): `toma` (`con_pulso` | `diferida`), `dias_desde_encuentro`, `seq_activacion`, `seq_interaccion`, `seq_continuidad`, `sus_01`…`sus_10`, `sus_puntaje` (0–100) y `sus_omitido`.
- Acción `usabilidad`: plan cerrado, después del encuentro, una por persona y plan, independiente de la retro (permite el complemento diferido de W1). La continuidad solo se guarda desde la ronda 2.
- `?view=plan` devuelve `yo.usabilidad`; `?view=mago`, `retro_pids` y `usabilidad_pids` por plan; `?view=panel`, `usabilidad` por condición (total, por ronda y por toma).
- `revocar` también borra la usabilidad de la persona.

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
