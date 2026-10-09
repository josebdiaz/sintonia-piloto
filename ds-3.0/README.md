# Sintonía DS 3.0 · E3

Sistema de diseño del Experimento 3 (chat con IA para armar planes en grupo), en modo Claro y Oscuro.

**v3.1.2** (detalle en `CHANGELOG.md`). Desde **v3.1.0** los componentes son los de «Convergencias visuales» (archivo DS 2.x, página «Convergencias visuales»), traídos tal cual y ligados a las variables del DS 3.0. Las 32 pantallas siguen la composición de los «Cinco momentos».

- **Fuente de verdad:** Figma «Sintonía DS 3.0 · E3», https://www.figma.com/design/bUYQpDmwzNgTPwCwchD2W3
- **User flow:** FigJam, sección «E3 · User flow (DS 3.0)»: https://www.figma.com/board/GGBZUvGckGpphSR9X1qEw7

Este paquete no toca el código del piloto E1/E2. Vive aparte en `ds-3.0/`.

## Estructura

```
ds-3.0/
├─ tokens/
│  ├─ figma-export.json   exportación de variables y estilos de Figma (entrada)
│  ├─ tokens.json         DTCG (generado)
│  └─ tokens.css          :root = Claro · [data-theme="dark"] = Oscuro (generado)
├─ css/
│  ├─ base.css            reset, foco visible, movimiento reducido
│  └─ components.css      .s-button, .s-message, .s-dial-vote… (uno por componente de Figma)
├─ assets/
│  ├─ avatares/           <id>_<claro|oscuro>_{1024,512}.jpg · _48.png · _48@2x.png
│  └─ iconos/             30 SVG de 24 px, trazo 2 px, currentColor + sprite.svg
├─ demo/index.html        las 32 pantallas (A1–F5) con selector de tema
├─ scripts/
│  ├─ export_tokens.py    figma-export.json → tokens.json + tokens.css + auditoría de contraste
│  ├─ iconos.py           genera los SVG
│  └─ publicar.sh         verifica todo y te muestra los comandos de git (no hace push)
├─ pruebas/
│  └─ plan-pruebas-calidad.html   plan de pruebas de E3 (documentación, no ejecutado)
├─ ASSETS.md              qué falta entregar y en qué orden
├─ CHANGELOG.md           copia en texto del Changelog de Figma
└─ README.md
```

## Pruebas de calidad (para cuando se teste E3)

`pruebas/plan-pruebas-calidad.html` describe tres etapas en orden: prueba de 5 segundos, usabilidad no moderada y usabilidad moderada, con tareas ligadas a activación, interacción y continuidad, compuertas entre etapas, ética y una corrida simulada marcada como no evidencia.

- **Estado:** documentación. No se ha corrido con personas.
- **Antes de usarlo:** aval de Néstor al protocolo, las metas preliminares y el consentimiento; prototipo navegable enlazado en Figma; confirmar si la encuesta de calibración permite recontactar.
- Las metas de aprobación son preliminares y se ajustan con la primera corrida.

## Uso en una página

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap">
<link rel="stylesheet" href="ds-3.0/tokens/tokens.css">
<link rel="stylesheet" href="ds-3.0/css/base.css">
<link rel="stylesheet" href="ds-3.0/css/components.css">

<button class="s-button" data-style="primary">Votar por la 1</button>
```

**Tema.** Sin atributo, la página sigue al sistema. Si la persona elige, se pone `data-theme="dark"` o `data-theme="light"` en `<html>`. Los componentes no cambian de token según el modo: cambia el valor del token.

**Avatares.** Cambian de archivo con el modo (`_claro_` y `_oscuro_`). La demo muestra cómo hacerlo con JS. El texto alternativo es «<Nombre>, anfitrión de Sintonía».

## Mapa Figma → código

| En Figma | En código |
|---|---|
| `cobalto/700` (Paleta) | `var(--palette-cobalto-700)` |
| `bg/brand`, `text/secondary` (Color) | `var(--color-bg-brand)`, `var(--color-text-secondary)` |
| `space/16`, `radius/lg`, `size/touch-min`, `stroke/1-5` | `var(--space-16)`, `var(--radius-lg)`, `var(--size-touch-min)`, `var(--stroke-1-5)` |
| Estilo de texto `Body/Chat` | `.t-body-chat` |
| `Shadow/Card` · `Focus/Ring` | `var(--shadow-card)` · `:focus-visible` en base.css |
| Componente Button · Style=Primary, Size=Medium | `<button class="s-button" data-style="primary">` (Small: `data-size="sm"`) |
| Estado Hover o Presionado | `:hover`, `:active`, `aria-pressed="true"` |

Cada componente trae su línea «CSS:» en la descripción de Figma (Dev Mode).

| Componente de Figma | Clase |
|---|---|
| Chat · Cabecera (+ Firma · Escala de dial, Presione para hablar) | `.s-chat-header` · `.s-station` · `.s-human[data-size="header"]` |
| Chat · Mensaje · Autor=Sintonía/Otra persona/Yo | `.s-message[data-author="ai\|member\|me"]` + `.s-cathedral` |
| Chat · Respuesta rápida · Tipo=Normal/Destacada | `.s-quick-reply` (`aria-pressed="true"` = destacada) |
| Chat · Composer | `.s-composer` · `.s-send` |
| Chat · Tarjeta de votación (+ Cuadrante de opciones) | `.s-vote-card` · `.s-dial-vote` · `.s-station-option` |
| Interruptor de palanca · Selector de banda | `.s-toggle` + `.s-lever-switch` · `.s-band` |
| Aguja de quórum · Display de señal · Válvulas calentando · Luz piloto | `.s-quorum` · `.s-display` · `.s-valves` · `.s-pilot` |
| Lista del plan · Hoja con asa · Presintonías · mis parches | `.s-plan-list` · `.s-sheet` · `.s-presets` |
| Panel · Encabezado / Pestañas / Fila de sintonía / Próxima sintonía / Navegación | `.s-panel-head` · `.s-tabs` · `.s-tuning-row` · `.s-next` · `.s-nav` |

## Cómo se hace un cambio

1. **En Figma.** Cambia la variable o el componente. Nunca toques el CSS a mano.
2. **Exportar.** Actualiza `tokens/figma-export.json` (pídele a Claude «exporta los tokens del DS 3.0», o usa un plugin de exportación de variables) y corre `python3 scripts/export_tokens.py`.
3. **Revisar.** En el diff de `tokens.css` solo deben cambiar los valores que tocaste.
4. **Auditar.** El script mide 32 pares de contraste en Claro y en Oscuro (64 en total) y termina con error si alguno no pasa. Estado al 8 oct 2026: 64/64.
5. **Publicar.** Corre `bash scripts/publicar.sh <rama>`: verifica y te muestra los comandos de git. Después registra la versión en la página Changelog de Figma.

## Contrato de accesibilidad (WCAG 2.2)

Si un cambio rompe una de estas reglas, no se publica.

- **Contraste de texto:** ≥ 4,5:1. Texto de lectura y chat ≥ 7:1 en los dos modos (1.4.3 · 1.4.6).
- **Bordes, foco y gráficos:** ≥ 3:1 (1.4.11).
- **Foco:** anillo de 2 px con 2 px de separación, token `border/focus` (2.4.7 · 2.4.13).
- **Objetivo táctil:** ≥ 44 px; los controles estándar miden 48 px (2.5.5 · 2.5.8).
- **Chat:** 17/24 px (Body/Chat). El hilo lleva `role="log"` y `aria-live="polite"`.
- **Movimiento:** onda, válvulas y aguja se detienen con `prefers-reduced-motion`.
- **Color:** un estado nunca se comunica solo con color; siempre va con texto o ícono.

## Pendientes (no inventados)

- Texto final de consentimiento (A6 y B3): en borrador hasta que Néstor lo apruebe.
- Rangos en COP de disposición a pagar (D4): en borrador.
- Nombre y foto de quien responde en «Habla con un humano» (E4), con su autorización. Mientras tanto se usan iniciales.
- El plazo de 48 h para el quórum es un supuesto de diseño que falta validar.
- Opcional: regenerar La Estática Oscuro con la antena plegada.
- Repositorio y rama de publicación.
