# Protocolo · el home al día con el repo

El home (https://sintonia.my) tiene una portada pública y un menú oculto para el equipo, **«Detrás de escena»**. El menú se abre con ↑ ↑ ↓ ↓ ← → ← → en el teclado o con los mismos deslizamientos en el celular. Desde el 17/11/2026, las tarjetas de ese menú **no se editan a mano**: se generan desde el repositorio.

## 1. De dónde sale cada cosa

| En el menú | Sale de | Quién la cambia |
|---|---|---|
| Tarjeta **Estado del repo**: versiones, último cambio, fecha y 3 pendientes | `piloto/assets/sintonia.js` (`FRONTEND_VERSION`), `backend/Codigo_Piloto.gs` (encabezado «Piloto vX.Y.Z»), primera entrada de «Repositorio» en `CHANGELOG.md` y §1 y §4 de `ESTADO.md` | Automático |
| Versión junto a «Versiones (CHANGELOG)» | Las mismas versiones | Automático |
| Tarjetas de operación, decks, documentos y archivo | `home.json` | Quien publica el cambio |
| Portada, textos fijos del menú y estilos | `index.html`, fuera de los marcadores `home:inicio` y `home:fin` | A mano, como siempre |

El generador es `tools/home.py` (Python 3, sin dependencias):

```
python3 tools/home.py           # reescribe las tarjetas entre los marcadores
python3 tools/home.py --check   # no escribe; falla si algo no cuadra
```

## 2. Qué revisa `--check`

1. **Enlaces internos de `home.json`:** que cada archivo exista (una carpeta terminada en `/` necesita su `index.html`).
2. **Decks:** que cada `docs/deck-*.html` esté en «Presentaciones» o en «Archivo». Un deck nuevo sin listar hace fallar la revisión.
3. **Versiones contadas:** `ESTADO.md` y `CHANGELOG.md` mencionan la versión del frontend y la del backend que hay en el repo. Subir una versión sin registrarla hace fallar la revisión.
4. **Home al día:** lo que hay entre los marcadores es exactamente lo que se genera.

## 3. Cuándo se actualiza

**Solo.** La acción `.github/workflows/home.yml` («Home al día») corre en cada push a `main`. Regenera las tarjetas y, si cambiaron, sube un commit `chore(home): …`. Después corre `--check`; si algo falla (un enlace roto, un deck sin listar, una versión sin registrar), la acción queda en rojo en GitHub.

**A mano, antes de publicar** (recomendado, para no depender de la acción):

| Si cambiaste… | Haz esto |
|---|---|
| La versión del frontend o del backend | Súbela en su archivo, agrega la entrada al `CHANGELOG.md`, actualiza `ESTADO.md` §1 y corre `python3 tools/home.py` |
| Un pendiente o una decisión | Edita `ESTADO.md` §4 (tacha con `~~…~~` o escribe «Hecho» lo resuelto) y corre `python3 tools/home.py` |
| Un deck nuevo o renombrado | Agrégalo en `home.json` («Presentaciones», arriba si es el más reciente, con su fecha en `nota`) |
| Una guía o documento que el equipo debe encontrar | Agrégalo en `home.json` («Documentación» u «Operación») |
| Algo que pasa a la historia | Muévelo a la tarjeta «Archivo» de `home.json`, con una nota de por qué quedó superado |

Antes de cada push a `main`: `python3 tools/home.py --check` tiene que terminar en ✓.

## 4. Reglas

- `ESTADO.md` es el punto de partida del proyecto. Su título lleva la fecha del último cambio: «# Estado del proyecto · 17 nov 2026».
- §4 de `ESTADO.md` es una tabla `| # | Pendiente | Bloquea | Quién |`. El home muestra los tres primeros que no estén tachados ni digan «Hecho», así que ordénala por prioridad.
- El menú es para el equipo, pero el sitio es público: en `home.json` no van claves, correos personales, números ni datos de participantes.
- Lo que se genera no se edita a mano entre los marcadores: se pierde en la siguiente corrida.

## 5. El código secreto

- **Teclado:** ↑ ↑ ↓ ↓ ← → ← → en menos de 2,5 s entre teclas. Esc cierra.
- **Celular:** los mismos ocho deslizamientos sobre la portada, con hasta 4,5 s entre uno y otro. Cada acierto enciende un punto naranja y hace vibrar el teléfono, si este lo permite. Para que el navegador no se robe el gesto:
  - mientras el menú está cerrado, la portada no se desplaza ni recarga al deslizar;
  - no cuentan los deslizamientos que empiezan en el borde izquierdo o derecho (el gesto de «atrás») ni en la franja de abajo (la barra de inicio);
  - basta un trazo de 30 px en una dirección clara.
- Prueba automática: `tools/qa-home.js` (iPhone 13, Pixel 7 y escritorio; ver el uso en su primera línea).
