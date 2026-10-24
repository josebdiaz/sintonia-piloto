# DS 3.0 · Assets que faltan

*Lista de lo que tienes que entregar para terminar el DS 3.0 de E3 · 7 de octubre de 2026*

> **Estado (8 oct):** los 16 avatares están recibidos (`originales/01–08 light|dark.jpg`). Los recortes `_1024.jpg`, `_512.jpg`, `_48.png` y `_48@2x.png` están en `ds-3.0/assets/avatares/`, y en Figma ya existe el componente **Avatar** (Personaje × Forma × Modo, 32 variantes) en la página Avatares.
>
> - El Mago Oscuro se reflejó en horizontal para que el dial quede del mismo lado que en Claro.
> - Aceptados con diferencias menores entre Claro y Oscuro: La Guardiana y La Gramola.
> - **Pendiente opcional:** regenerar `08 dark` (La Estática Oscuro) con la antena plegada, editando la versión clara.

Solo faltan las **imágenes de los avatares** y tres confirmaciones. Lo demás (íconos, glifos, fuentes, favicon, recortes, demo y tokens) lo genero yo.

## 1. Avatares · 16 imágenes (8 personajes × 2 modos)

Se dejan en **`sintonia-piloto/ds-3.0/assets/avatares/originales/`** (la carpeta ya existe). Los originales se guardan solo en local: no van al repositorio, porque el código usa únicamente los recortes.

| Orden | Archivo | Personaje | Por qué va en ese lugar |
|---|---|---|---|
| 1 | `el-quinto_claro.png` | El Quinto | **P0.** Es la referencia de estilo para los otros siete y aparece en el encabezado de todos los chats. |
| 2 | `el-quinto_oscuro.png` | El Quinto | P0. Lo mismo, en el modo Oscuro. |
| 3 | `la-guardiana_claro.png` | La Guardiana | P1. Consentimiento (A6 y B3): la primera pantalla sensible del recorrido. |
| 4 | `la-guardiana_oscuro.png` | La Guardiana | P1 |
| 5 | `el-mago_claro.png` | El Mago | P1. Votación y plan fijado (C1, C4 y C5): el corazón de E3. |
| 6 | `el-mago_oscuro.png` | El Mago | P1 |
| 7–8 | `la-antena_claro.png` · `la-antena_oscuro.png` | La Antena | P2. Hitos: quórum completo y «¡Llegué!». |
| 9–10 | `el-resonador_claro.png` · `el-resonador_oscuro.png` | El Resonador | P2. Veto (C3). |
| 11–12 | `el-despertador_claro.png` · `el-despertador_oscuro.png` | El Despertador | P2. Recordatorio y día del plan. |
| 13–14 | `la-gramola_claro.png` · `la-gramola_oscuro.png` | La Gramola | P2. Sobremesa (D1–D5) y Mis sintonías. |
| 15–16 | `la-estatica_claro.png` · `la-estatica_oscuro.png` | La Estática | P3. Estados del sistema. |

**Para empezar basta con la #1.** Las pantallas no se bloquean: mientras falte una imagen, el componente Avatar muestra el glifo vectorial. Cuando llegue la imagen, la cambio en el componente y se actualiza en todas las pantallas.

**Cómo generarlas**

- Prompts: `avatares/prompts-avatares-ds3.md`. Usa el bloque base y luego el prompt de cada personaje.
- Genera primero El Quinto en Claro y úsalo como referencia de estilo para los demás.
- La versión **Oscuro** sale de editar la imagen Claro, no de generarla de nuevo. Pide: *«replace only the background with #1A2029, keep the character identical, add a subtle cool rim light»*. Así el personaje queda idéntico en los dos modos.

**Requisitos**

- Formato: PNG o JPG cuadrado.
- Tamaño: mínimo 1024 × 1024 px; lo ideal es 2048.
- Color: perfil sRGB.
- Encuadre: el personaje centrado, ocupando cerca del 70 % del cuadro.
- Prohibido: texto, logos o marcas de agua.
- Si una imagen no te convence, déjala con sufijo `_v2`, `_v3`, etc. Yo elijo con el chequeo de la sección 6 de los prompts y te muestro la comparación.

**Lo que hago yo cuando las dejes**

1. Recortes `_1024.jpg`, `_512.jpg` (WhatsApp, circular) y `_48.png` por modo, en `ds-3.0/assets/avatares/`.
2. Carga a Figma y componente `Avatar` (Personaje × Forma × Modo).
3. Glifos vectoriales de 32 px para los 8 personajes, ligados a tokens.
4. Chequeo de reconocimiento a 48 px con los 8 lado a lado.

## 2. Tres confirmaciones (no son imágenes)

| Prioridad | Qué | Dónde | Si no lo tengo |
|---|---|---|---|
| P1 | **Texto de consentimiento de E3** aprobado (si Néstor cambió algo del guion E3) | Pégalo en el chat o déjalo en `ds-3.0/contenido/consentimiento.md` | Uso el del guion E3 del DS 2.x, marcado «borrador». |
| P2 | **Quién responde en «Habla con un humano»**: nombre de pila y foto con su autorización | `ds-3.0/assets/equipo/<nombre>.jpg` (cuadrada, 512 px o más) | Uso iniciales sobre fondo neutro. Nunca un avatar de fieltro. |
| P2 | **Repositorio y rama de GitHub** donde se publica el paquete | En el chat | Lo dejo listo en `ds-3.0/` sin publicar. |

## 3. Lo que no tienes que conseguir

- **Fuentes.** Archivo, Inter y JetBrains Mono son de Google Fonts: ya están en Figma y se cargan por CDN en código.
- **Íconos.** Los 19 del DS 2.x se redibujan y se suman 9 nuevos: arrow-right, check-double, send, bell, wifi-off, trash, log-out, sun y moon.
- **Fotos de lugares o planes.** Las tarjetas de plan usan íconos y texto, no fotos. Así se evitan licencias y se protege la privacidad de los lugares.
- **Favicon e ícono de app.** Salen del glifo de El Quinto.
- **Logotipo.** Es el wordmark tipográfico (Brand/Wordmark), sin imagen.

## 4. Dónde está documentado en Figma

Archivo «Sintonía DS 3.0 · E3»: https://www.figma.com/design/bUYQpDmwzNgTPwCwchD2W3

| Página | Qué hay |
|---|---|
| 00 · Portada | Índice y estado de cada página |
| 01 · Cómo implementar (GitHub) | Estructura del repo, mapa Figma → CSS, temas, componentes en código, contrato WCAG y flujo de cambio |
| Color | Paleta A1 y los 59 tokens en Claro y Oscuro, con su primitivo y el contraste medido |
| Tipografía | 3 familias y 29 estilos con ejemplo real y clase CSS |
| Dimensión | Espaciado, radios, tamaños y bordes |
| Efectos y foco | 4 efectos en los dos modos y reglas de foco y objetivo táctil |
| Avatares | 8 fichas con archivo esperado, prioridad, pantallas y texto alternativo |
| Íconos | 30 íconos de 24 px ligados a tokens |
| Controles · Chat · Instrumentos de radio · Plan y panel | Componentes con variantes, propiedades y foco |
| Pantallas · Claro | 32 pantallas (A1–F5) como componentes, con anotación de los datos que captura cada una |
| Pantallas · Oscuro | Las mismas 32 como instancias en modo Oscuro: un cambio en Claro se refleja aquí |
| Changelog | Entrada 3.0.0 |
