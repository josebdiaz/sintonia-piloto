# Changelog · Sintonía DS 3.0 · E3

Copia en texto de la página «Changelog» del archivo de Figma (fuente de verdad).
Versionado semántico: **mayor** = cambia un nombre de token o componente (rompe código); **menor** = algo nuevo; **parche** = ajuste de valor sin cambiar nombres.

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

- `pruebas/plan-pruebas-calidad.html` · Plan escalonado de pruebas de calidad para E3 (prueba de 5 segundos → usabilidad no moderada → moderada). **No ejecutado.** Queda como documentación para el momento de testear E3; metas preliminares y protocolo sujetos al aval de Néstor.
