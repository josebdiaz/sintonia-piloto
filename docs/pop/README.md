# Material POP · QR y artes

Brief completo (costo-beneficio, textos, cantidades y calendario): en el Proyecto del equipo. Aquí están los QR y las vistas previas de los artes. Los archivos editables (`.af`) y los PDF para imprenta los genera Affinity en la carpeta `Sintonia POP` del Escritorio de quien los armó. No van al repositorio, que es público y está pensado para código y documentos.

## QR

Cada pieza lleva su propio `origen`, que llega a la inscripción y a la lista de espera (columna `origen`). Todos apuntan a la landing pública, nunca al formulario.

| QR | URL | Piezas |
|---|---|---|
| `qr-totem.svg` | https://sintonia.my/?o=qr-totem | Tótem y hablador de mesa |
| `qr-volante.svg` | https://sintonia.my/?o=qr-volante | Volante |
| `qr-tarjeta.svg` | https://sintonia.my/?o=qr-tarjeta | Tarjeta |
| `qr-sticker.svg` | https://sintonia.my/?o=qr-sticker | Sticker «¿Hay que vernos?» |

- Se regeneran con `python3 tools/qr-pop.py`.
- Usan corrección de errores Q y una zona tranquila de 4 módulos.
- En los artes de Affinity, cada QR es un solo trazado vectorial, sin uniones entre módulos. Todos se verificaron decodificando el render.

## Artes (22/11/2026, sistema «Resonancia»; ajustes del sync P8d el 23/11) · `artes/`

Todas las piezas siguen `filosofia-visual.md`:
- **Ondas:** anillos finos que salen del logo en progresión geométrica, en un tono apenas separado del fondo. En los círculos se calculan como arcos, sin máscaras.
- **Trazo:** uno solo, rojo y ondulado, en la palabra decisiva de cada cara.
- **Titular:** grande y alineado a la izquierda.
- **Etiquetas:** versalitas espaciadas.
- **Recorrido:** contado como estaciones numeradas.
- **QR:** sobre una placa blanca de esquinas redondeadas.
- **Nombre y dirección (23/11):** todos los stickers llevan «sintonía» escrito, y la dirección va como «www.sintonia.my» para que se lea como web.

| Pieza | Archivo | Formato | Sangrado | Oleada |
|---|---|---|---|---|
| Tarjeta con QR (frente y reverso) | `Tarjeta-QR_90x55` | 90 × 55 mm | 3 mm | 1 · 24/11 |
| Pines (2 diseños: «Tu +1 de confianza» y el claim «Menos vueltas, más plan» con «SINTONÍA») | `Pines-58mm_arte-70mm` | Arte circular de 70 mm para botón de 58 mm | 2 mm | 1 · 24/11 |
| Stickers (4 diseños, todos con «sintonía» escrito; el 4.º es el logo con «SINTONÍA» arriba y «WWW.SINTONIA.MY» abajo, como sello) | `Stickers-60mm_troquel` | Círculo de 60 mm, troquelado | 2 mm | 1 · 24/11 |
| Tótem (roll-up) | `Totem-rollup_80x200cm` | 800 × 2000 mm, a 150 ppp, todo vectorial | 5 mm | 2 · 1/12 |
| Volante (frente: «¿Hay que vernos?», el claim y QR de 55 mm; reverso: los 4 pasos) | `Volante-media-carta` | 139,7 × 215,9 mm, dos caras | 3 mm | 2 · 1/12 |
| Hablador de mesa | `Hablador-mesa_media-carta` | Media carta vertical, para porta-aviso | 3 mm | 2 · 1/12 |

### Para la imprenta

- **Color:** documentos en CMYK. La imprenta debe confirmar su perfil (por ejemplo, FOGRA39) y entregar una prueba de color del naranja.
- **Logo:** el nuevo, del archivo de marca «Sintonia Logo NEW UPDATED.svg», con la «s» vectorizada. El rojo del anillo va en CMYK 0/90/100/0, equivalente a #ff2500.
- **Fuente:** Graphik (Bold, Semibold, Medium y Regular). Los PDF «press ready» la incrustan; para abrir el `.af` hay que tenerla instalada.
- **Pines:**
  - La cara visible mide 58 mm.
  - El texto queda dentro de un círculo de 50 mm.
  - Lo que hay entre 58 y 70 mm se dobla hacia atrás del botón.
- **Stickers:** la línea de corte va en la capa «Troquel (CutContour)», en magenta al 100 %. Si la imprenta pide una tinta plana con ese nombre, se cambia en Affinity antes de exportar.
- **Tótem:** el texto importante está entre 10 y 180 cm desde arriba, para no perderse en la estructura. El QR queda a unos 95–125 cm del piso.

### Pendiente

- **Logo de la Universidad Icesi** (decidido el 22/11). Falta el archivo vectorial. Va en el reverso de la tarjeta, en el pie del volante y en el del tótem. Hasta tenerlo, esas piezas dicen «Universidad Icesi» en texto.
- **Antes de aprobar un tiraje:** escanear la prueba impresa con un iPhone y un Android, y que el backend 2.9.0 esté desplegado.
