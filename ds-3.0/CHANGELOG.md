# Changelog · Sintonía DS 3.0 · E3

Copia en texto de la página «Changelog» del archivo de Figma (fuente de verdad).
Versionado semántico: **mayor** = cambia un nombre de token o componente (rompe código); **menor** = algo nuevo; **parche** = ajuste de valor sin cambiar nombres.

## 3.4.0 · 9 de octubre de 2026 · Feedback del equipo

- Nuevo **Chat · Enviar** (Estado=Enviar | OK): ícono por defecto; «OK» solo para confirmar una selección. Pantallas con OK: A4, A5, A6, B2, B3 y D1; en A6 y B3 se quita la respuesta «Continuar».
- **Chat · Composer**: las respuestas rápidas se alinean a la derecha.
- Nuevo **Chat · Confirmación** (Tipo=Asistencia | Reencuentro × Estado=Pendiente | Respondido): «¿Te apuntas?» en C5 y «¿Repetimos con este parche?» en D5.
- **D5**: se retira «Compartir mi contacto con el grupo» y la pregunta duplicada de la Lista del plan. Conexión Nivel 1 no aplica en E3: cada persona entra con gente que ya conoce, así que la conexión se mide con Nivel 2 (intención de reencuentro).
- **C7**: «¡Es hoy, es hoy!».
- Prototipo: «Volver» regresa a la pantalla anterior; T1 se confirma con «OK». User flow de FigJam actualizado.
- Código: `components.css` (`.s-composer > .s-quick-replies`, `.s-send .s-ok`, `.s-confirm`); la app usa los valores del Dial de energía de Figma (Agotado, Bajo, Normal, Con pilas, A tope).

## App interna · 8 de octubre de 2026

- `e3-app/` (carpeta aparte en la raíz del repo): versión funcional de E3 solo para el equipo (multijugador, guion + Claude, flujo A–F, panel del equipo). No cambia tokens ni componentes.
- Feedback del equipo aplicado en la app: volver a la pantalla anterior, «¡Es hoy, es hoy!» en C7, «¿Te apuntas?» en el plan fijado, «¿Repetimos con este parche?» en vez de compartir contacto, dial de energía con riel, respuestas del compositor a la derecha y enviar = «OK» solo cuando hay algo que confirmar. Pendiente llevarlo a Figma.

## 3.3.0 · 8 de octubre de 2026 · Prototipo de pruebas

- Nueva página «Prototipo · Pruebas E3»: 16 pantallas en Claro y 16 en Oscuro (mitad de participantes en cada modo), con zonas táctiles de 44 px o más sobre los elementos reales y 8 puntos de inicio (T1, T2–T5, T6 y T7 en cada modo). Todas las rutas de éxito verificadas.
- Votación con las 3 opciones: C1 y C2 tienen una versión por opción, para que el voto registrado diga la opción elegida.
- Microinteracciones funcionales: Interruptor de palanca interactivo (cambia de variante con smart animate de 200 ms), elección de plan y voto con smart animate, válvulas que pasan solas a plan fijado (3 s). Tiempos y curvas sin pulir; se ajustan con los hallazgos de la Etapa 2.
- «Fin de la tarea» es una pantalla solo para la prueba; no es parte del producto.
- Protocolo de pruebas y consentimiento con aval de Néstor (8 oct 2026).

## 3.2.0 · 8 de octubre de 2026 · Estructura, nombres y espaciado

- Estructura: Firma · Escala de dial, Dial de energía e Interruptor de palanca pasan a auto-layout (marcas con reparto uniforme; la palanca con padding 4 · 8). Solo conservan posición libre las piezas que dependen de un valor (aguja, perilla, relleno) o que son ilustraciones en capas (Marco catedral, bulbo, cara de la aguja de quórum, asa).
- Auto-layout en todo el archivo: 0 marcos sin auto-layout (antes 159). Real donde hay flujo: sets en cuadrícula con `space/24`, tramos de la Lista del plan, tablero Oscuro (`space/80` · `space/32`), muestras de Dimensión. Con capas fijadas (posición absoluta dentro del auto-layout) donde la posición depende de un valor o es ilustración: íconos, Avatar, Marco catedral, onda, aguja, bulbo, cifras, riel del Cuadrante y escala del Dial. Es la misma estructura que en código (contenedor flex + hijos `position: absolute`). Sin cambio visual.
- Texto: los mensajes ya no tienen ancho fijo; crecen hasta 262 px (entrantes) o 256 px (propios) y luego bajan de línea. Los textos fijos de Hoja con asa e Interruptor pasan a Fill.
- Composer: Enviar usa `Icon/arrow-right` en vez de `arrow-left` girado 180°.
- Nombres: sin capas genéricas (Rectangle, Ellipse). Pantallas agrupadas en secciones A–F (Claro) y marcos de grupo (Oscuro); las etiquetas pasan a «Doc · Grupo X».
- Espaciado: Luz piloto pasa de 5 px a `space/4` y queda ligada a variables (padding, separación y radio). Todo padding y separación de los componentes queda en la escala y con variable.
- Código: `components.css` (`.s-bubble` 286 px, `.s-pilot`, `.s-lever-switch`) y `tokens/theme.native.ts` para React Native/Expo (px reales, Claro/Oscuro, fuentes de Expo), generado por `scripts/export_native.py`.
- Difieren de «Convergencias visuales»: Firma, Interruptor, Luz piloto, Hoja con asa, Lista del plan, Fila de sintonía y Composer. Llevar estos cambios a la biblioteca antes de la próxima sincronización. El Cuadrante de opciones queda igual a la biblioteca.

## 3.1.2 · 8 de octubre de 2026 · Tarjeta de votación y válvulas

- Válvulas calentando: en Oscuro conservan la luz interna. Variables nuevas `radio/valve-glass` (mostaza 100 / 500) y `radio/valve-core` (mostaza 100 en los dos modos).
- Tarjeta de votación: radio `xl` como los demás adjuntos, más aire arriba del riel y en las acciones; la lectura «1/3» o «FIJO» queda centrada con la pista del Cuadrante. Ajuste propio del DS 3.0 (difiere de Convergencias).
- Código: `tokens.css`/`tokens.json` con las 2 variables nuevas; `components.css` (`.s-valves`, `.s-vote-card`, `.s-dial-vote`). Contraste 64/64.
- **Abierto:** el Cuadrante de opciones local aún difiere de la biblioteca (marco «lectura · alineada», alineación arriba, pista a 15 px en vez de 9 px). Se pidió volver a la versión de la biblioteca; falta confirmar el ajuste en el componente principal.

## 3.1.1 · 8 de octubre de 2026 · Sincronizado con la biblioteca «Convergencias visuales»

- Los 25 componentes se compararon propiedad por propiedad con la biblioteca publicada y se igualaron: tamaño (Fill/Hug), anclajes, giros, radios por esquina, alturas mínimas, posiciones, ajuste de texto y nombres de capas.
- Corregidos: cola de las burbujas, riel del Cuadrante, marcas del Separador de fecha, aguja de la Navegación, avance proporcional de la Lista del plan y anillos de foco.
- Se conservan a propósito: variables y modo Oscuro del DS 3.0, íconos y Avatar del DS 3.0. Corregida en local la línea de Panel · Pestañas (en el original está desplazada 258 px).

## 3.1.0 · 8 de octubre de 2026 · Componentes alineados con «Convergencias visuales»

- Los 23 componentes de identidad y de chat vienen tal cual de «Convergencias visuales» (archivo DS 2.x), ligados a las variables del DS 3.0.
- Se suman Button en píldora, Luz piloto y 3 variables: `bg/bakelite-soft`, `text/bakelite` y `border/warning`, con valor Oscuro.
- Se retiran las versiones propias del DS 3.0 que no coincidían: burbuja, compositor, encabezado, palanca y tarjeta de plan, entre otras.
- Las 32 pantallas se rehacen con la composición de los «Cinco momentos»: cabecera de grupo, adjuntos con sangría de 48 px y respuestas rápidas sobre el compositor.
- Se conservan del DS 3.0: Avatar (8 personajes × modo), íconos, Campo de texto, Dial de energía, Banner, Estado vacío, Enlace de invitación y KPI.

## 3.0.0 · 7–8 de octubre de 2026 · Foundations, componentes, pantallas y código de E3

- Archivo nuevo para E3. El DS 2.x queda congelado para E1 y E2.
- Paleta A1 «Cobalto y mostaza · papel claro»: 50 primitivos (papel, noche, cobalto, mostaza, rosa, carmesí, base).
- 56 tokens semánticos y 3 sombras con modos Claro y Oscuro; todos los pares de texto, foco y gráficos medidos en los dos modos.
- Dimensión (38 variables), Tipografía (16 variables), 29 estilos de texto ligados a variables y 4 estilos de efecto.
- Todas las variables con nombre CSS (`var(--…)`) y alcance definido para pasar a GitHub sin traducir.
- Documentación: Portada, Cómo implementar, Color, Tipografía, Dimensión, Efectos y foco y Avatares.
- Avatares: 8 personajes × Claro/Oscuro (32 variantes del componente Avatar).
- 30 íconos de 24 px (trazo 2 px) y 37 componentes en Controles, Chat, Instrumentos de radio y Plan y panel.
- 32 pantallas (A1–F5) en Claro como componentes con anotación de datos; Oscuro como instancias del mismo componente.
- User flow de E3 en FigJam con rutas alternas: veto, sin quórum, sin conexión, error, SALIR y humano.
- Paquete `ds-3.0/`: tokens.json (DTCG), tokens.css, base.css, components.css, íconos SVG, demo y scripts.

## Documentación sin versión de DS

- `pruebas/plan-pruebas-calidad.html` · Plan escalonado de pruebas de calidad para E3 (prueba de 5 segundos → usabilidad no moderada → moderada). Protocolo con aval de Néstor (8 oct 2026); aún sin correr con personas. Las metas siguen siendo preliminares hasta la primera corrida.
