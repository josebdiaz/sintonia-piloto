# Racional para diverger la paleta en el territorio «Convergencias visuales»

**Proyecto Sintonía · Maestría en Gestión de la Innovación — Universidad Icesi**
Versión 1.1 · 7 de octubre de 2026 · Estado: **Pendiente** (propuesta para discutir con Néstor)
Alcance: **E3 (Charladita)**. E1 y E2 no cambian.

> **Cambios frente a la v1.0 (comentarios del equipo):**
> - La paleta nueva aplica a E3; seguimos explorando el futuro mientras probamos el presente.
> - El sistema de diseño se consolida en E3.
> - Los personajes de fieltro se generan por paleta, así que no son una restricción.
> - El modo oscuro se desarrolla después de definir el claro.
> - El foco y los estilos se dejan componentizados sobre tokens.
> - La reauditoría de contraste es compuerta obligatoria.

---

## 1. Para qué es este documento

La crítica visual del 7 de octubre dejó un hallazgo central: la convergencia (base del Territorio 04 más la firma de radio del Territorio 02) ya es elegante y accesible, pero **a los dos segundos se puede leer como una app de chat beige más**. La forma tiene identidad (escala de dial, marco catedral, instrumentos), pero el color todavía no.

Este documento no propone colores. Explica:

1. qué implica cambiar la paleta en E3;
2. por qué tiene sentido diverger aquí;
3. qué queda fijo y qué puede moverse;
4. cómo se decide con evidencia.

Alimenta el prompt de territorios cromáticos (`prompt-territorios-cromaticos.md`).

---

## 2. Punto de partida

| Elemento | Estado actual |
|---|---|
| Paleta del sistema 2.x («Frecuencia y Resina») | Pino `#1B4332` / `#2D6A4F`, ámbar `#E09F3E`, miel o baquelita `#D4A373`, coral `#E76F51`, marfil `#FDFBF7`, lino `#F4F1EA`, grafito `#212529`. |
| Dónde se queda | E1 y E2 (piloto 2.0.7), que no se tocan. |
| Paleta del Territorio 04 y de la convergencia | Marfil, pino, grafito, niebla; ámbar solo para estados; coral solo para el veto; 5 variables `radio/*`. |
| Dónde vive | 65 variables semánticas de color con modo claro y oscuro, alias a primitivos, y el estilo Focus/Ring (hoy con color fijo en hex). |
| Accesibilidad | 0 fallas de contraste de texto en 972 mediciones; bordes de controles ≥ 3:1. |

> **Dato vs. interpretación.** El dato es la estructura de tokens y la auditoría. La lectura de que el color «no tiene identidad» es interpretación del equipo a partir de la crítica; no hay evidencia de usuarios todavía (Pendiente).

---

## 3. Implicaciones de cambiar la paleta

### 3.1 Técnicas (sistema de diseño)

- **Los alias trabajan a favor.** Cambiar primitivos propaga el color a componentes y pantallas. Las 65 variables semánticas conservan nombre y rol.
- **Foco y estilos: estructura ahora, valor después.**
  - Los anillos de foco de los componentes ya usan `border/focus`, así que cambiarán solos.
  - Antes de definir la paleta conviene que el estilo **Focus/Ring** y las sombras con color (glow de la luz piloto, halo del marco) también tomen su color de una variable. Así la definición futura no tiene que tocarlos a mano.
  - Las descripciones de los componentes deben nombrar **roles** («color de estado»), no tonos («ámbar»).
- **Modo oscuro después del claro.** Se define y se audita primero el modo claro. Para que el oscuro no obligue a rehacer la estructura, cada variable nueva se crea ya con su lugar para el modo oscuro, aunque al principio repita el valor del claro.
- **Reauditoría obligatoria.** Cada par de texto y fondo y cada borde de control se vuelve a medir: 4,5:1 para texto y 3:1 para controles. Primero en claro, como compuerta para probar con personas; el oscuro se mide cuando se diseñe.

### 3.2 Semánticas (lo que significa cada color)

Cambiar la paleta no cambia los trabajos de cada color:

| Rol | Hoy | Debe conservarse |
|---|---|---|
| Acción principal y «fijado» | Pino | Alto contraste con texto encima (≥ 4,5:1). |
| «En curso» (votando, escribiendo, buscando) | Ámbar | Un color de estado distinto del de acción y del de veto. |
| Veto y «Ninguna me sirve» | Coral | Alerta suave, distinta del error crítico. |
| Sin señal y error crítico | Rojo | Reservado para fallas reales. |
| Neutros | Marfil, niebla, grafito | La calma por defecto del T04 (consentimiento, veto, retiro). |
| Foco | Pino (`border/focus`) | Visible a 3:1 sobre cualquier superficie. |
| Firma de radio | Cromo, display, rejilla | Instrumentos legibles; la decoración no compite con el texto. |

**Doble codificación.** La diferencia entre «fijado», «en curso» y «veto» nunca depende solo del tono: se apoya en luminancia y en texto escrito.

### 3.3 Metodológicas (E3 frente a E1 y E2)

- **E1 y E2 se quedan quietos.** Siguen con «Frecuencia y Resina»; la evidencia del presente no se contamina.
- **E3 es el lugar de la divergencia.** El sistema de diseño se consolida en E3, así que la paleta divergente nace con él.
- **Limitación por declarar.** Si después comparamos resultados de E3 con los de E1 y E2 (por ejemplo, la intención de repetir), la paleta será una variable más, junto con el motor autónomo, la conversación y el canal. **La paleta no debe usarse para explicar diferencias entre experimentos**; su efecto se mide solo con la prueba de preferencia (sección 5).
- **Comparabilidad con los territorios.** Cada territorio cromático se puntúa con los mismos criterios de la matriz del 6 de octubre.

### 3.4 De marca y de canal

- **Personaje y paleta nacen juntos.** Los anfitriones de fieltro se pueden generar para cada paleta. Cada territorio cromático incluye la versión de su anfitrión: el color del personaje pasa a ser parte de la identidad.
- **WhatsApp.** En E3 la conversación vive en la web propia, pero el puente con WhatsApp (avatar, Flows) sigue siendo un punto de contacto. Hipótesis por validar (Pendiente): el pino comparte la familia de verdes de WhatsApp y podría diluir el reconocimiento.
- **Mercados en los que compite.** Sintonía se ve junto a:
  - apps para descubrir planes (Meetup, Eventbrite, TimeOut);
  - apps para encontrar personas (Bumble BFF, We3, Friender);
  - apps de experiencias (ClassPass, Airbnb Experiences);
  - comunidades (Geneva, InterNations).

  La paleta debe distinguirse de ese mapa cromático, que hay que **verificar con fuentes actuales** antes de afirmarlo.
- **Contexto local.** En Cali algunos colores tienen asociaciones fuertes, por ejemplo deportivas. Ningún tono principal debería leerse como afiliación (Pendiente de validar).
- **Elena (60+).** Cualquier acento se prueba en un Android de gama media, con letra grande y al sol (Pendiente: respaldar con fuente antes de citar datos sobre percepción del color y edad).

### 3.5 De esfuerzo

En diseño, el cambio es amplio pero mecánico, gracias a los tokens. Toca la fundación de color, los componentes de la convergencia, las pantallas de E3, el deck y las guías de E3. No toca E1 ni E2. El costo real está en la reauditoría, la prueba con personas y la generación de los anfitriones por paleta.

---

## 4. Racional para diverger

### 4.1 El argumento

1. **El problema es de identidad, no de usabilidad.** La auditoría y la crítica coinciden en que la convergencia funciona. Lo que falta es que se **reconozca**, y el color es el portador de identidad más rápido en los primeros dos segundos.
2. **La paleta actual nació para otro trabajo.** «Frecuencia y Resina» se diseñó para un piloto de bajo margen de error, con calma y confianza como prioridad. E3 es autónomo y debe diferenciar a Sintonía en un mercado fragmentado, donde el espacio libre es la experiencia completa: activación, interacción y continuidad.
3. **Explorar el futuro mientras se prueba el presente.** E1 y E2 siguen sin cambios; E3 consolida el sistema. Diverger ahí no arriesga la evidencia actual y permite llegar al sistema definitivo con una identidad probada, no heredada.
4. **La divergencia es reversible.** Puede vivir como una colección o un modo paralelo de variables y compararse lado a lado con la paleta actual.
5. **La evidencia pide expresividad con medida.**
   - El hallazgo Robusto de Material 3 Expressive, citado en el tablero, indica que el color y la forma que marcan lo importante se prefieren en todas las edades.
   - El de Nielsen Norman Group recuerda que el contraste no se negocia.
   - Juntos sostienen más identidad en lo que marca, nunca menos contraste.
6. **No diverger también es un riesgo.** Heredar la paleta del piloto fijaría una identidad que nunca se comparó con alternativas.

### 4.2 Lo que se queda fijo

- La estructura del T04: tarjetas editables, calma por defecto, transparencia fija y el piso de Elena (17 px de lectura, 48 px de toque).
- Los **roles** de la tabla 3.2 y la regla «cada color tiene un trabajo».
- El contraste: 4,5:1 para texto y 3:1 para controles y foco.
- La doble codificación del estado.
- Consentimiento, veto y retiro en calma.

### 4.3 Lo que puede moverse

- El tono del acento de marca y acción.
- La temperatura y el matiz de los neutros, siempre que la base siga siendo calma.
- La paleta de la firma de radio y la de los hitos (quórum completo, plan fijado, ¡Llegué!).
- El colorido del anfitrión de fieltro, que se genera con la paleta.

### 4.4 Principios para cualquier paleta divergente

1. **El rol antes que el tono.**
2. **El contraste antes que el gusto:** lo que no pasa la auditoría en claro no llega a personas.
3. **Una sola nota de identidad:** el moodboard inspira, no se copia.
4. **Personaje y paleta nacen juntos.**
5. **Distinguible en su mercado y en el puente con WhatsApp.**
6. **Primero claro, después oscuro**, con la estructura preparada desde el inicio.

---

## 5. Cómo se decide

### 5.1 Hipótesis

| # | Hipótesis | H0 | Validación | Métrica |
|---|---|---|---|---|
| P1 | Una paleta con acento propio aumenta el reconocimiento de la marca en la primera impresión sin bajar la confianza. | La paleta no cambia el reconocimiento ni la confianza. | Prueba de preferencia de 5 segundos: paleta actual frente a los 3 territorios cromáticos, misma pantalla («votar el plan»), con 5 personas tipo Mateo y 5 tipo Elena. | % que identifica la marca; confianza (1–5); preferencia y su porqué. |
| P2 | La paleta divergente no empeora la tarea principal. | La paleta afecta el tiempo de tarea. | Tarea cronometrada: «Votar» y «Habla con un humano». | Tiempo y errores. |
| P3 | La paleta es igual de legible para Elena. | Es menos legible. | Lectura al sol con letra grande en un Android de gama media. | Lecturas correctas y esfuerzo percibido. |

> Con 10 personas los resultados son **Emergentes**: sirven para elegir uno o dos territorios, no para cerrar la identidad.

### 5.2 Compuertas

1. **Reauditoría en claro:** AA completo (texto, controles, foco).
2. **Roles:** se cumple la tabla 3.2 sin mezclas.
3. **Personas:** P1 a P3; P1 mejora y P2 y P3 no empeoran.
4. **Decisión con Néstor**, como toda decisión de pivote y metodología.
5. **Consolidación en el sistema de E3:** migración de primitivos, foco y estilos sobre tokens, anfitrión por paleta y, después, diseño y auditoría del modo oscuro.

### 5.3 Riesgos (cinco dimensiones)

| Dimensión | Riesgo | Mitigación |
|---|---|---|
| Privacidad | Bajo; la prueba usa mockups. | Consentimiento informado y anonimización. |
| Exclusión | Un acento saturado puede leerse «para jóvenes»; uno apagado puede no decir nada a Mateo. | Probar con ambos perfiles y por separado. |
| Seguridad | Confundir acción con veto o error. | Tabla de roles y doble codificación. |
| Sesgo metodológico | Atribuir a la paleta diferencias entre E3 y E1/E2; elegir por gusto. | Medir la paleta solo con la prueba de preferencia; compuertas con evidencia. |
| Impacto emocional | Alertas demasiado agresivas en veto o retiro. | Calma en esos momentos y el mismo piso de contraste. |

---

## 6. Implicaciones

- **JTBD.** En el de Mateo, una identidad más clara puede bajar la sensación de «otra app más» (hipótesis). En el de Elena, cualquier cambio sostiene la confianza y la cercanía.
- **Matriz de oportunidades.** La paleta mueve «diferenciación frente al mercado» solo si P1 se confirma.
- **Siguiente fase (Aplicación del Reto de Innovación).** La prueba de paleta va junto con la de la convergencia, en el mismo reclutamiento, para llegar al sistema de E3 con una identidad probada.

---

## Referencias

Tomadas del tablero «Territorios visuales» (octubre de 2026). Faltan autores y URL para APA 7: **completar antes de citar en el documento final**.

- Google Design. (2025). *Expressive Material Design*. Pendiente: autoría y URL.
- Nielsen Norman Group. (2025). *Liquid Glass is cracked*. Pendiente: autoría y URL.
- *Frontiers in Computer Science*. (2025). https://doi.org/10.3389/fcomp.2025.1531976. Pendiente: autores y título.
- Revisión sistemática sobre adultos mayores e interfaces (2025). PMC12350549. Pendiente: autores, título y revista.
