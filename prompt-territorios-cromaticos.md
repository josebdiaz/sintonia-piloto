# Prompt · Tres territorios cromáticos para E3

> **Cómo usarlo.** Pega este prompt en una conversación nueva y adjunta `racional-divergencia-paleta.md` (v1.1). Si el modelo tiene búsqueda web, actívala para verificar los colores de la competencia. Si quieres más material visual, adjunta también el moodboard de radios.

---

## Rol

Actúa como **director o directora de color de un estudio de identidad digital**, con experiencia en sistemas de diseño con tokens, accesibilidad WCAG 2.1 AA y productos sociales para América Latina. Tu interlocutor es el equipo de un anteproyecto de maestría (Universidad Icesi): se espera rigor y trazabilidad, no una propuesta de venta.

## Contexto

**Sintonía** es un servicio para pasar de la intención de socializar a vínculos que se sostienen. Interviene en tres momentos:
- **Activación:** pasar de querer salir a participar.
- **Interacción:** la calidad del encuentro.
- **Continuidad:** volver a verse.

El servicio se mueve en un chat de grupo donde un anfitrión con IA, «Sintonía», propone planes que el grupo vota, fija y repite. Siempre hay una persona del equipo que revisa los planes y responde.

- **Perfiles priorizados.** Mateo (25–40, teletrabajador, poca energía, quiere baja fricción y claridad) y Elena (60+, quiere confianza, cercanía y recurrencia; define el piso de accesibilidad: 17 px de lectura y 48 px de toque).
- **Etapa.** La paleta nueva aplica **solo a E3 (Charladita)**, donde se consolida el sistema de diseño. **E1 y E2 no cambian.**
- **Estructura visual vigente (Territorio 04 · convergencia):**
  - tarjetas editables en el hilo, calma por defecto y expresividad solo en los hitos (quórum completo, plan fijado, ¡Llegué!);
  - transparencia fija («Sintonía (IA)», «Habla con un humano»);
  - una firma de radio hecha de geometría e instrumentos: escala de dial, aguja, cuadrante, display, palanca, marco catedral.
- **Problema que resuelve esta tarea.** Una crítica visual encontró que la convergencia funciona, pero a los dos segundos se lee como «una app de chat beige más». La forma tiene identidad; el color no.
- **Paleta actual (solo como punto de comparación, no la repitas):** pino `#2D6A4F`, ámbar `#E09F3E`, coral `#E76F51`, marfil `#FDFBF7`, niebla `#ECE8DF`, grafito `#212529`.

El documento adjunto (`racional-divergencia-paleta.md`) es tu fuente de verdad para restricciones, roles y criterios de decisión. Si algo de este prompt contradice el racional, manda el racional.

## Tarea

Propón **tres territorios cromáticos** para el modo claro de E3. Deben cumplir tres condiciones:

1. Ser **claramente distintos entre sí** en al menos dos de estos ejes:
   - temperatura (cálida o fría);
   - saturación del acento (contenida o expresiva);
   - carácter de los neutros (papel, piedra, plástico, metal);
   - número de colores con trabajo (de 3 a 5).
2. Inspirarse en la **diversidad de los radios de los años 30 a 60**, usando solo una o dos referencias por territorio. Es inspiración, no catálogo.
3. Diferenciarse de los **mercados digitales** donde compite Sintonía, con el rol de cada color definido dentro de la experiencia.

### Referencias de inspiración (elige; no uses todas)

- **Años 30:** radio catedral de madera oscura con arco; baquelita y catalina de colores con cuadrante redondo (por ejemplo, combinaciones como cobalto con mostaza o mostaza con rojo); radio esfera de espejo azul con barras cromadas.
- **Años 40:** receptor de viaje negro con tapa y dial plateado; radios de mesa en rojo, blanco y azul con rejilla rayada; radioteléfono de campaña verde oliva.
- **Años 50:** transistor de bolsillo en rojo, marfil o pastel (menta, rosa, celeste) con dial dorado y rejilla perforada; radio de mesa racional en blanco y madera clara; portátil crema con dial azul.
- **Años 60:** cubos plegables amarillo, naranja y blanco con interior negro; plásticos brillantes rojo, azul y amarillo en formas de anillo y de S; cubos pastel.

Traduce la lógica cromática (proporciones, contraste entre cuerpo y dial, acentos metálicos). **No reproduzcas ningún aparato ni marca reconocible** ni nombres de modelos o fabricantes.

### Mercados digitales con los que se compara

- **Descubrir planes:** Meetup, Eventbrite, TimeOut.
- **Encontrar personas:** Bumble BFF, We3, Friender.
- **Experiencias:** ClassPass, Airbnb Experiences.
- **Comunidades:** Geneva, InterNations.
- **Canal dominante en América Latina:** WhatsApp, por el puente de E3 con avatar y Flows.

**Verifica el color dominante de cada marca con una fuente actual** (sitio oficial, guía de marca o tienda de apps) y anota fuente y fecha. Si no puedes verificarlo, escribe «no verificado» y no lo uses como argumento.

## Restricciones (no negociables)

1. **El rol antes que el tono.** Cada territorio cubre todos los roles:

   | Rol | Uso en la experiencia |
   |---|---|
   | Acción principal y «fijado» | Botón Votar, Repetir el plan, plan fijado |
   | Estado «en curso» | Votando, escribiendo, buscando, cuenta regresiva |
   | Veto | «Ninguna me sirve», retiro |
   | Error crítico y sin señal | Fallas reales |
   | Neutros de calma | Fondos, burbujas, consentimiento |
   | Foco | Anillo de foco de todos los controles |
   | Firma de radio | Cromo, display e instrumentos |
   | Hito expresivo | Quórum completo, plan fijado, ¡Llegué! |

   Ningún color puede tener dos roles que se contradigan (por ejemplo, la acción con el mismo tono que el veto).
2. **Contraste WCAG 2.1 AA calculado, no estimado.** Usa la luminancia relativa: L = 0,2126·R + 0,7152·G + 0,0722·B, con cada canal linealizado (c ≤ 0,03928 ? c/12,92 : ((c+0,055)/1,055)^2,4). Mínimos:
   - 4,5:1 para texto normal;
   - 3:1 para texto grande (≥ 24 px, o ≥ 18,66 px en negrita), bordes de controles, foco y gráficos que informan.

   Muestra el valor de cada par. Si un par no pasa, ajusta el color, no la regla.
3. **Doble codificación.** Los estados se distinguen también por luminancia y por texto, nunca solo por tono. Indica cómo se ve cada territorio con deuteranopía y con protanopía (descríbelo; no inventes porcentajes).
4. **Calma** en consentimiento, veto y retiro: sin el color de estado ni movimiento.
5. **Solo modo claro.** No diseñes el oscuro. Lista qué tokens necesitarán un par oscuro diseñado (no invertido).
6. **Personaje y paleta nacen juntos.** Describe el colorido del anfitrión de fieltro de cada territorio (cuerpo, detalles, ojos y accesorio) para poder generarlo. No es una restricción, es parte de la identidad.
7. **Rigor del proyecto:**
   - no inventes datos ni cifras;
   - clasifica cada afirmación como **Robusto, Emergente o Pendiente**;
   - separa el dato de la interpretación;
   - usa referencias en APA 7 y, si no tienes la referencia exacta, dilo;
   - escribe en español de Colombia.

## Tokens a mapear (los nombres ya existen en el sistema; no cambies los nombres)

```
bg/canvas · bg/surface · bg/surface-muted · bg/surface-hover · bg/inverse
bg/brand · bg/brand-hover · bg/brand-soft · bg/brand-deep
bg/accent · bg/accent-hover · bg/accent-soft            (estado en curso)
bg/danger · bg/danger-soft                              (veto)
bg/critical · bg/critical-soft                          (error y sin señal)
text/primary · text/secondary · text/disabled · text/brand · text/accent-strong
text/on-brand · text/on-accent · text/danger · text/critical · text/on-critical
icon/primary · icon/secondary · icon/brand · icon/on-brand · icon/danger
border/default · border/strong · border/brand · border/accent · border/danger · border/focus · border/critical
signal/searching · signal/live · signal/locked · signal/off · signal/glow
channel/chat/canvas · channel/chat/bubble-in · channel/chat/bubble-out · channel/chat/meta
data/bar · data/track
radio/display · radio/display-ink · radio/display-live · radio/chrome · radio/grille
```

## Formato de salida

### A. Resumen (máx. 8 líneas)

Los tres territorios en una frase cada uno y en qué ejes difieren.

### B. Para cada territorio

1. **Nombre** de dos o tres palabras y **frase de concepto**.
2. **Inspiración:** década, aparato genérico, el rasgo cromático que se toma y lo que se descarta.
3. **Posición en el mercado:** tabla «competidor · color dominante · fuente y fecha o "no verificado"» y el **espacio cromático libre** que ocupa el territorio.
4. **Primitivos:** escalas con nombre propio (por ejemplo, `acento/50…900`) en hex.
5. **Mapa semántico:** tabla «token · primitivo · hex · rol · fondo de uso · contraste · ¿pasa?».
6. **El color en la experiencia:** dónde aparece cada color con trabajo en las cinco pantallas de referencia:
   1. Consentimiento en el chat (activación).
   2. Votar el plan (interacción).
   3. Plan fijado (hito).
   4. ¿Repetimos? (continuidad).
   5. Mis sintonías (panel fuera del chat).
7. **Firma de radio:** cromo, display y rejilla, y cómo dialogan con el acento.
8. **Anfitrión de fieltro:** colorido descriptivo para generarlo.
9. **Puente con WhatsApp:** cómo se reconoce Sintonía en el avatar y los Flows dentro de la interfaz verde de WhatsApp.
10. **Ajuste con Mateo y Elena:** hipótesis, no conclusión.
11. **Riesgos en cinco dimensiones:** privacidad, exclusión, seguridad, sesgo metodológico e impacto emocional, con su mitigación.
12. **Tokens que necesitarán par oscuro.**

### C. Matriz comparativa

Puntaje de 1 a 5 por territorio (hipótesis, Pendiente) con los pesos de la matriz de territorios del 6 de octubre:

| Criterio | Peso |
|---|---|
| Identidad y diferencia frente a otras apps | 15 % |
| Confianza y calma en momentos delicados | 15 % |
| Accesibilidad AA y lectura bajo el sol | 15 % |
| Coherencia con WhatsApp | 15 % |
| Ajuste con Mateo (25–40) | 10 % |
| Ajuste con Elena (60+) | 10 % |
| Esfuerzo de producción (incluye anfitrión y tokens) | 10 % |
| Respaldo de la investigación | 10 % |

Incluye la paleta actual como **línea base** en la misma matriz.

### D. Recomendación para la prueba (no para la decisión)

Qué dos territorios llevar a la prueba de preferencia de 5 segundos (5 personas tipo Mateo y 5 tipo Elena, pantalla «votar el plan»). Usa las hipótesis P1–P3 y las compuertas del racional: reauditoría en claro, roles, personas y decisión con Néstor.

### E. Implicaciones

Breves, para:
- el JTBD de Mateo y el de Elena;
- la matriz de oportunidades;
- la siguiente fase (Aplicación del Reto de Innovación).

## Antes de entregar, verifica

- [ ] Los tres territorios difieren en al menos dos ejes.
- [ ] Cada uno usa una o dos referencias de radios, sin copiar aparatos ni marcas.
- [ ] Todos los pares de la tabla semántica tienen su contraste calculado y pasan.
- [ ] Ningún color tiene roles contradictorios; el estado «en curso» es distinto de la acción y del veto.
- [ ] Los colores de la competencia están verificados con fuente o marcados «no verificado».
- [ ] No diseñaste el modo oscuro; solo listaste los tokens que lo necesitarán.
- [ ] Cada afirmación lleva Robusto, Emergente o Pendiente, y las metas se presentan como preliminares.
