# Stickers de Sintonía · v1 (15/11/2026)

14 stickers estáticos con la marca actual (papel, noche, naranja, mostaza, crema y vitral · Inter 800 · glifo «s»). Los envía el número Sintonía en el grupo del parche; quien quiera puede guardarlos desde el chat («Añadir a Favoritos»).

| # | Sticker | Cuándo usarlo |
|---|---|---|
| 01 | ¡Hay plan! | Después de /confirmado |
| 02 | Menos vueltas, más plan. | Bienvenida (después de /ingreso) |
| 03 | ¿Cuál les suena más? 1 2 3 | Junto a la encuesta |
| 04 | Cuadremos día y hora | Antes de /dia o /horario |
| 05 | Me apunto | Respuesta al evento del grupo |
| 06 | Hoy no puedo. La próxima, sí. | Para quien no va, sin culpa |
| 07 | Voy en camino | Con /salida |
| 08 | ¡Ya llegué! | Con /checkpoint |
| 09 | ¿Ya en casa? | Con /en_casa |
| 10 | Ya en casa | Respuesta a /en_casa |
| 11 | Gracias por venir | Cierre del encuentro |
| 12 | ¿Lo repetimos? con este parche | Antes de crear el plan 2 (Nivel 2) |
| 13 | «Hay que vernos»… y esta vez, sí. | Primer mensaje del grupo o del plan 2 |
| 14 | Glifo «s» | Firma / saludo |

Regla de voz: un sticker por momento, nunca en lugar del mensaje con los datos (lugar, hora, enlace), y nada de stickers en mensajes de seguridad, /no_llega o /humano.

## Archivos

- `webp/` · 14 stickers de 512 × 512, fondo transparente, cada uno de menos de 100 KB (formato que exige WhatsApp para paquetes).
- `png/` · los mismos en PNG (para crear stickers desde WhatsApp Web o el teléfono).
- `tray.png` · ícono del paquete, 96 × 96.
- `emojis.json` · 1 a 2 emojis por sticker (los piden las apps de paquetes para la búsqueda).
- `hoja-de-contacto.png` · vista de todos.
- `generar-stickers.js` · el generador (Playwright). Para cambiar un texto o un color, edita la lista `S` y corre `node generar-stickers.js <carpeta_salida> ../../piloto/assets/glifo.svg`.

## Cómo ponerlos en el número Sintonía

**Opción rápida (WhatsApp Web o de escritorio, sin apps).** En el WhatsApp del número Sintonía abre cualquier chat → ícono de stickers → **Crear** → sube un PNG de `png/` → envíalo (por ejemplo, al chat del equipo) → mantén presionado o haz clic en el sticker → **Añadir a Favoritos**. Queda en la pestaña de favoritos para usarlo en cualquier grupo. El menú puede variar según la versión de WhatsApp.

**Opción paquete (Android).** Con una app de paquetes de stickers (por ejemplo, «Sticker Maker»): crear el paquete «Sintonía», autor «Sintonía · piloto Icesi», ícono `tray.png`, agregar los 14 archivos de `webp/` → **Añadir a WhatsApp**. WhatsApp pide entre 3 y 30 stickers por paquete.

La marca, el glifo y los textos son de Sintonía; no usan personajes ni marcas de terceros.
