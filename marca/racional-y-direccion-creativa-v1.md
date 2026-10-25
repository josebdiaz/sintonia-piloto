# Racional final de marca y arranque de la sesión de dirección creativa (v1)

Documento en dos partes: **A** explica por qué la marca es como es (el racional), y **B** es el prompt para abrir una sesión de dirección creativa que explore campañas, planifique los toolkits y aterrice la implementación en el producto. Todo es decisión de diseño del equipo, **sin pruebas con usuarios**; donde haya hipótesis, está rotulada.

---

# PARTE A. Racional final de la marca

## A.1 El punto de partida

En 2026, conseguir una reunión es fácil; coordinar un plan entre amigos o familia, no tanto. El problema no es la falta de canales sino la fricción de ponerse de acuerdo: chats largos, votaciones sin cierre, planes que se caen. Sintonía es un sistema de orquestación multiagente que reduce esa fricción en grupos de amigos y familia en Cali, operado por WhatsApp (por ahora con grupos operados manualmente). Un agente visible, el «director de orquesta de los planes de tu gente», propone, concilia, cierra, confirma y recuerda.

## A.2 La idea de marca

**Sintonizar**: poner a un grupo en la misma frecuencia. Metáfora de sonido y ritmo, que aporta musicalidad sin volverse un tema musical y sin atar la identidad a Cali.

- **Eslogan:** «Menos vueltas, más plan.» (promesa de apoyo: «Menos chats, más encuentros»).
- **Pilares:** Fluye (menos fricción), Incluye (todos pueden votar, también quien no puede), Cierra (el plan queda decidido).
- **Personalidad:** lúdica y con energía, cálida y cercana: un amigo organizado, no un asistente corporativo.
- **Anti-referencias:** dating, clínico o terapéutico, corporativo o coworking frío, infantil o «fun» forzado, y lecturas involuntarias (el equipo descartó el diapasón con cara por su connotación).

## A.3 Cómo se traduce en lo visual

| Decisión | Qué es | Por qué |
|---|---|---|
| **La S con dos ondas** | La letra s de Climate Crisis Regular, en un disco con dos ondas concéntricas (una gruesa, una fina) | La S es el nombre; las ondas son «sintonizar» y el pulso que se dispara cuando el grupo cierra el plan. Funciona como avatar redondo en WhatsApp y se simplifica a una sola onda por debajo de 40 px |
| **Climate Crisis solo para la S** | Tipografía display usada en una única letra | Da carácter y singularidad sin sacrificar legibilidad: todo el texto va en Graphik |
| **Graphik para el texto** | Sans neutra y cálida; títulos en 800, cuerpo en 400 | Claridad y sobriedad moderna; contrapeso de la S pesada |
| **Papel, noche y naranja como base** | Papel `#FAF9F6`, noche `#0E1116`, naranja `#FF4F00` / `#C23A00` | Una base limpia y directa: el naranja es la acción y el trazo |
| **Paleta de apoyo cálida** | Mostaza, crema, azul vitral, salvia, coral, rosa, rubí | Aporta calidez y cercanía (rescatada del territorio Art Nouveau) sin recargar: máximo dos por pieza |
| **El trazo** | Línea naranja ondulada que subraya, rodea o conecta | Es la voz gráfica de «lo importante» y repite la ondulación de la marca |
| **Patrones de la S** | Siete patrones geométricos más el tonal del KV; el Mini S va a −10° | Textura de marca para campaña y estados vacíos, sin ornamento |
| **Stickers directos** | Cartelas planas con borde blanco, de colores cálidos, con texto de hasta tres palabras | Hablan en el idioma de WhatsApp y comunican una acción por mensaje |
| **Avatar en tres fondos** | Mostaza (cálido, el principal sobre claro), azul vitral (distintivo, usado en el KV oscuro) y noche con S naranja | Cada uno cubre un contexto; el aro noche mantiene la silueta en chat claro y oscuro |

**Territorios explorados y descartados:** diapasón con cara y felt (connotaciones involuntarias, solo exploratorios), monograma S de líneas paralelas y rejilla de puntos (sin la fuerza del glifo), Art Nouveau completo con vides y vitrales (muy cargado; solo se rescató la paleta y la idea del glifo con ondas), y una variante tipo fotocopia con fotos de personas (descartada por privacidad y licencias).

## A.4 La voz

Español colombiano neutro. Un mensaje = una acción. Máximo un emoji. Nunca regaña ni señala a quien no responde (se usan conteos: «Confirmaron 5 de 6»). Toda votación incluye «No puedo ese día». Sin jerga técnica. Títulos de mensaje en mayúsculas, de hasta tres palabras.

## A.5 Estado de las decisiones

| Tema | Estado |
|---|---|
| Glifo S con dos ondas, Climate Crisis solo para la S, Graphik para el texto | Cerrado |
| Paleta (tokens) y reglas de contraste | Cerrado (con una excepción pendiente, ver abajo) |
| Key visual en dos versiones (oscura y clara) | Cerrado |
| Azul vitral reemplaza al cobalto como color de «confirmado» | **Propuesto, por confirmar** (afecta los tokens del DS 3.0) |
| Mostaza vs. azul vitral como avatar por defecto | **Abierto** (mostaza sobre claro, vitral sobre oscuro es el supuesto vigente) |
| Licencia de Graphik y de Climate Crisis | **Pendiente de confirmar** |
| Esta línea reemplaza a los personajes de fieltro del DS 3.0 o convive como línea de campaña | **Abierto** |
| Especificaciones técnicas de stickers de WhatsApp (formato, peso, tamaño) | **Verificar en la documentación vigente** antes de afirmarlas |

## A.6 Riesgos y lo que no sabemos

- **Las ondas pueden leerse como «señal de wifi»** y los patrones como «papel tapiz». Es una lectura de diseño; no hay pruebas con usuarios.
- **Tilde naranja sobre mostaza** en el avatar: contraste de 3,24:1, apenas sobre el mínimo gráfico de 3:1; a 24 px puede perderse, por lo que existe la versión simplificada.
- **Dependencia de plataforma:** la identidad vive dentro de WhatsApp (avatar, stickers, plantillas) y está sujeta a sus límites.
- **Accesibilidad para adultos mayores:** la S es pesada y los patrones, densos; deben mantenerse lejos del texto. Falta validarlo con personas de ese perfil.
- **Cifras:** ninguna métrica de marca está medida. Las metas porcentuales del proyecto son hipótesis preliminares sujetas a baseline.

## A.7 Archivos de referencia

- `sistema-visual-v1.7.html`: documento unificado (marca, ondas, color, patrones, Mini S, KV final).
- `brief-constructor-decks-motion-v1.md`: tokens, assets y motion para el constructor de decks.
- `brief-marca-v0.1.md`: brief original (en este repositorio el ejemplo de Recordar ya está corregido a «Confirmaron 5 de 6»).
- Prompt del toolkit v1.1 (no incluido en el repositorio): **queda superado** por este documento y por la v1.7.
- Tablero en Affinity (avatares, lockup, paleta, tres patrones): archivo local del equipo, no incluido en el repositorio.
- Carpeta `ds-3.0` del proyecto: tokens, avatares y contratos de accesibilidad del sistema de diseño.

---

# PARTE B. Arranque de la sesión de dirección creativa

Copia desde aquí en un chat nuevo. Adjunta antes los archivos de A.7.

## B.1 Rol y objetivo

Actúa como director creativo senior y estratega de marca, con criterio de maestría en gestión de la innovación. Tu interlocutor es un equipo de anteproyecto. La sesión tiene tres objetivos, en este orden:

1. **Explorar propuestas de campaña** para Sintonía (territorios, ideas y piezas).
2. **Planificar la generación de toolkits** (qué se produce, en qué orden y con qué criterios).
3. **Aterrizar la implementación en el producto** (cómo vive la marca en WhatsApp y en el sistema operado manualmente).

## B.2 Reglas

- No inventes datos ni cifras; si falta algo, dilo y propón cómo obtenerlo, o una hipótesis marcada.
- Respeta las decisiones **cerradas** de A.5 y no las reabras; las **abiertas** puedes llevarlas a decisión.
- Separa siempre evidencia de interpretación. No digas que la marca «funciona» o «gusta»: no hay pruebas con usuarios.
- Respeta las anti-referencias y la regla de nunca señalar a quien no responde.
- Cali es mercado de lanzamiento, no identidad.
- Sin fotos de personas dentro del producto; en campaña, solo con consentimiento y licencia documentados.

## B.3 Antes de empezar

Haz como máximo cinco preguntas, en una sola ronda. Candidatas: ¿cuál es la audiencia de la campaña (quién organiza los planes, quién solo asiste)?; ¿dónde se verá (WhatsApp, redes, impreso, presentaciones)?; ¿qué presupuesto y tiempo hay?; ¿la campaña es de lanzamiento o de prueba del piloto?; ¿hay fechas o eventos en Cali que aprovechar? Si no hay respuesta, asume lo conservador y anótalo.

## B.4 Parte 1: exploración de campañas

Propón **tres territorios de campaña** y desarróllalos a nivel de idea, sin diseñar aún. Cada uno con: idea central, tono, tres titulares candidatos, piezas posibles y riesgos. Puntos de partida (hipótesis a validar, no conclusiones):

- **Los cinco momentos como capítulos.** Cada momento (Propone, Concilia, Cierra, Confirma, Recuerda) como una pieza de una serie con su sticker y su mensaje.
- **«Menos vueltas, más plan.» como contraste.** El «antes» (chat que da vueltas) y el «después» (plan listo), con el trazo como protagonista.
- **El plan listo como ritual.** El pulso de ondas que se dispara al confirmar, convertido en un gesto que el grupo reconoce.

Evalúa cada territorio con una tabla (criterios en escala 1 a 5, marcando que son juicio del equipo): fidelidad a la personalidad, diferenciación, viabilidad dentro de WhatsApp, riesgo de lecturas involuntarias, facilidad de producción y alineación con los pilares Fluye, Incluye y Cierra. Recomienda uno y propón cómo **probarlo** con 5 a 8 grupos de Cali, de forma exploratoria.

## B.5 Parte 2: plan de generación de toolkits

Entrega un plan por fases, con responsables sugeridos, dependencias y criterios de aceptación. Propuesta de estructura inicial:

| Fase | Toolkit | Contenido | Criterio de cierre |
|---|---|---|---|
| 1 | Marca | Logo (avatar, wordmark, lockups), tokens, tipografía, ondas, trazo, patrones, KV | Contrastes verificados; avatar legible a 24, 40 y 64 px en chat claro y oscuro |
| 2 | Producto en WhatsApp | Avatar, stickers de los cinco momentos, biblioteca de mensajes con variables, plantillas | Ningún mensaje nombra a quien no responde; toda votación incluye «No puedo ese día» |
| 3 | Campaña | Plantillas de afiche, post, story, deck animado; reglas de imagen | Cumplen la regla de un patrón por pieza y de texto sobre color liso |
| 4 | Presentación y motion | Constructor de decks animados con el brief de motion; catálogo de animaciones | Funciona con `prefers-reduced-motion` y sin dependencias |
| 5 | Validación | Prueba de cinco segundos, reconocimiento del avatar, aceptación del tono en el piloto | Resultados registrados como exploratorios |

Incluye: orden de producción, entregables por fase, formatos de salida, qué se puede hacer en paralelo, qué decisiones abiertas bloquean cada fase (azul vitral vs. cobalto, avatar por defecto, licencias de fuentes, relación con el DS 3.0) y los riesgos de cada una.

## B.6 Parte 3: implementación en el producto

Plantea cómo vive la marca en el sistema real, sin cerrar soluciones de producto sin evidencia:

- **Dentro de WhatsApp:** avatar (circular, legible a 40 y 24 px), stickers (verificar en la documentación vigente de WhatsApp los límites de formato, peso y tamaño; no darlos por sabidos), mensajes cortos (un mensaje = una acción), evitar el verde de WhatsApp como color dominante.
- **Operación manual («Mago de Oz»):** biblioteca de mensajes y stickers que el operador usa, con reglas de voz y una lista de frases prohibidas; cómo se registra qué se envió.
- **Integración con el DS 3.0:** tokens nuevos (azul vitral, crema, naranja 700) frente a los existentes (cobalto, mostaza, rosa), y si esta línea reemplaza a los personajes de fieltro o convive como línea de campaña. Lista los cambios en `tokens.json`, `tokens.css` y `theme.native.ts`.
- **Accesibilidad:** texto de chat 17/24, objetivos táctiles ≥ 44 px, sin patrón detrás de mensajes, movimiento solo bajo preferencia.
- **Riesgos del producto:** privacidad (consentimiento y mínima recolección), exclusión (la opción «No puedo ese día»), seguridad, sesgo metodológico, impacto emocional, fiabilidad del agente y dependencia de plataforma.
- **Plan de pruebas:** qué se mide, con quién y cuándo; todo marcado como exploratorio hasta tener baseline.

Cierra con una hoja de ruta de **qué se hace primero, qué se valida antes de producir en serio y qué se deja abierto**.

## B.7 Formato de entrega y proceso

1. Haz tus preguntas (máximo cinco) y espera respuesta.
2. Presenta las tres partes en ese orden, con tablas para comparar territorios y para el plan por fases, y prosa breve para la narrativa.
3. Cierra cada parte con **implicaciones** para: la matriz de oportunidades, el JTBD y la siguiente fase del proyecto (Aplicación del Reto de Innovación).
4. Termina con una lista de supuestos, pendientes y decisiones que el equipo debe tomar.
