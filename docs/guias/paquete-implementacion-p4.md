> **Copia en el repositorio · Hecha: paquete de implementación del Periodo 4 (antes del pivote). Las páginas viven en archivo/p4-pre-pivote/.**

# Proyecto Sintonía · Periodo 4 — Paquete de implementación

Todo lo trabajado para validar los cuatro mecanismos (H1 WTP · H2 llegada · H3 interacción · H4 continuidad), listo para publicar y operar. Alcance: Mateo.

---

## Estructura del paquete

```
sintonia_proyecto_p4/
├── README.md                         (este archivo)
├── sitios/                           TODO lo que se sube a la raíz del repo de GitHub Pages
│   ├── index.html                    H1 · landing café-coworking (embudo WTP) + panel ?panel=1
│   ├── ficha.html                    H2 · ficha de llegada (Tierradentro San Antonio)
│   ├── calificar.html                H3 · calificación gamificada + panel ?panel=1
│   ├── pulso.html                     H4 · pulso privado (cierre + doble opt-in) + panel ?panel=1
│   ├── sintonia_invitacion_radio.png imagen de invitación (adjuntar en WhatsApp / og:image)
│   ├── sintonia_invitacion_radio.svg fuente editable de la invitación
│   ├── robots.txt                    evita que buscadores indexen /researchers/
│   └── researchers/                  NO PÚBLICO · sección del equipo (nav propio, no indexada)
│       ├── index.html                Home: los 4 experimentos, el ciclo y el mapa del sitio
│       ├── h1.html · h2.html         hub por experimento: estado, umbral, secuencia
│       ├── h3.html · h4.html           Preparar→Ejecutar→Registrar→Decidir + acceso a su panel
│       ├── paneles.html              DASHBOARD: tablero de decisiones (BD) + KPIs en vivo
│       ├── scorecards.html           Preparar/Decidir · veredicto automático + Registrar decisión → BD
│       ├── ejecucion.html            Ejecutar · tarjetas de ejecución H1–H4 (tabs)
│       ├── ficha-generador.html      Ejecutar · generador de la ficha de llegada (produce ../ficha.html)
│       ├── registro-h3.html          Registrar · instrumento de registro H3 (vivo + video)
│       ├── guia-hosting.md           cómo publicar en GitHub Pages + montar el Apps Script
│       ├── prompt-analisis-video-h3.md  prompt para analizar la grabación del microencuentro
│       ├── iteracion-clusterizacion.md  documento de la futura iteración de clusterización
│       └── prompt-lovable-h1.md      prompt para reconstruir la landing en Lovable (escalar)
├── herramientas/                     copias sueltas de las mismas herramientas (para abrir localmente sin subir nada)
│   ├── sintonia_scorecards_p4.html
│   ├── sintonia_tarjetas_ejecucion.html
│   ├── sintonia_registro_h3.html
│   ├── sintonia_ficha_llegada_h2.html
│   └── sintonia_landing_h1.html      versión de la landing con base de datos de Claude (ver nota)
├── backend/
│   └── Codigo_AppsScript.gs          recolector de datos (Google Sheet)
└── guias/
    ├── Guia_hosting_y_appscript.md   cómo publicar en GitHub Pages + montar el Apps Script
    ├── sintonia_prompt_lovable_H1.md prompt para reconstruir la landing en Lovable (escalar)
    └── sintonia_prompt_analisis_video_H3.md prompt para analizar la grabación del microencuentro
```

`sitios/researchers/` es la versión "de producción" de las herramientas: la misma Scorecard, Tarjetas de ejecución, Registro H3 y Ficha H2, pero con menú de navegación, Home con instrucciones y sin indexar en buscadores. `herramientas/` (fuera de `sitios/`) son las mismas herramientas sin ese envoltorio, útiles si alguien prefiere abrirlas sueltas desde el computador sin publicar nada.

---

## Las dos bases de datos del proyecto

Hay **dos backends distintos**, a propósito:

### A) Google Sheet + Apps Script — para los sitios en GitHub Pages

Lo usan `index.html` (embudo H1) y `calificar.html` (H3). Es gratis, los datos quedan en **tu** cuenta de Google, y no guarda datos personales salvo el opt-in opcional.

**Una hoja, cinco pestañas** (el script las crea solas):

| Pestaña | Qué guarda | Origen |
|---|---|---|
| `events` | Embudo H1: page_view, screener_pass, cta_clicked, reservation_completed, charge_doubt, registro_opt_in (con `uid` y fuente) | index.html |
| `contactos` | Opt-in voluntario de futuras pruebas (separado de los eventos) | index.html |
| `calificaciones` | Agrado, comodidad, facilidad y palabra (anónimo) | calificar.html |
| `pulso` | H4: agrado, intención, a quién eligió, opt-in próximo plan y contacto | pulso.html |
| `scorecards` | Decisión oficial de cada H: estado, veredicto, clasificación R/E/P, umbral, resultado y nota | researchers/scorecards.html (botón «Registrar decisión») |

**Montaje (detalle en `guias/Guia_hosting_y_appscript.md`):**

1. Crea una Google Sheet y copia su **ID** (va entre `/d/` y `/edit` en la URL).
2. En la hoja: **Extensiones → Apps Script**, pega `backend/Codigo_AppsScript.gs` y reemplaza `SHEET_ID`.
3. **Implementar → Nueva implementación → Aplicación web**, ejecutar como *tú*, acceso **Cualquier usuario**. Autoriza.
4. Copia la URL que termina en `/exec`. Pégala en el `ENDPOINT` de **`index.html` y de `calificar.html`**.
5. Cada vez que edites el `.gs`, **reimplementa** (Gestionar implementaciones → nueva versión); la URL `/exec` se mantiene.

**Lectura de datos (paneles):**
- `GET …/exec` → devuelve `events` (panel de la landing H1, en `index.html?panel=1`).
- `GET …/exec?data=ratings` → devuelve `calificaciones` (panel de `calificar.html?panel=1`).
- `GET …/exec?data=pulso` → devuelve `pulso` (panel de `pulso.html?panel=1`, con dobles opt-in e interesados).
- `GET …/exec?data=scorecards` → devuelve `scorecards` (tablero de decisiones en `researchers/paneles.html`).
- Los `contactos` NO se exponen por GET; se consultan solo en la hoja.

El botón **«Registrar decisión»** de la Scorecard hace `POST {kind:"scorecard", …}`; el dashboard **Paneles** toma la última decisión por experimento y la muestra junto a los KPIs en vivo del embudo, calificaciones y pulso.

**Reiniciar entre tandas:** menú **Sintonía → Limpiar eventos** dentro de la hoja (borra `events`, conserva encabezado). Contactos y calificaciones se limpian a mano en su pestaña.

### B) Base de datos de Claude — solo para `sintonia_landing_h1.html`

Esta variante de la landing usa la capacidad `db` de los artefactos de Claude y **solo funciona publicada como artefacto en claude.ai** (no en GitHub Pages). Sirve si quieres correr el piloto dentro de la organización sin montar Google. Para alcance externo, usa la versión de `sitios/index.html` con Apps Script.

---

## Qué necesita cada archivo antes de usarse

| Archivo | Acción antes de usar |
|---|---|
| `sitios/index.html` | Pegar `ENDPOINT` (Apps Script). Enlaces con `?utm_source=…&u=CODE`. |
| `sitios/calificar.html` | Pegar `ENDPOINT`. Compartir con `?u=CODE`; panel en `?panel=1`. |
| `sitios/pulso.html` | Pegar `ENDPOINT`. Define el grupo (`?grupo=Ana,Luis,Sofía,Marco`) y da a cada quien su `?me=Nombre`; panel en `?panel=1`. |
| `sitios/ficha.html` | Verificar dirección/menú/mapa de Tierradentro; poner el número real de WhatsApp del anfitrión (`wa.me/57…`); ajustar `og:image` a tu dominio. |
| `herramientas/*.html` | Abrir en el navegador; guardan en el navegador local. |
| `sintonia_landing_h1.html` | Solo como artefacto de Claude (usa `db`). |

---

## Hosting en GitHub Pages (resumen)

Sube el contenido de `sitios/` (incluida la carpeta `researchers/` y `robots.txt`) a la raíz de un repo público → **Settings → Pages → Deploy from a branch (main /root)**. Quedan en `https://TU-USUARIO.github.io/REPO/`:

**Público (participantes):**
- Landing H1: `…/index.html`
- Ficha H2: `…/ficha.html`
- Calificar H3: `…/calificar.html`
- Pulso H4: `…/pulso.html?me=Nombre`
- Paneles: `…/index.html?panel=1` (embudo) · `…/calificar.html?panel=1` (calificaciones) · `…/pulso.html?panel=1` (dobles opt-in e interesados)

**Equipo (no enlazado desde lo público, con `robots.txt` bloqueando su indexación):**
- Home con instrucciones: `…/researchers/index.html`
- Hubs por experimento: `…/researchers/h1.html` · `h2.html` · `h3.html` · `h4.html`
- Paneles (dashboard): `…/researchers/paneles.html`
- Scorecards: `…/researchers/scorecards.html`
- Tarjetas de ejecución: `…/researchers/ejecucion.html`
- Generador de ficha de llegada: `…/researchers/ficha-generador.html`
- Registro H3: `…/researchers/registro-h3.html`
- Guías y prompts: `…/researchers/guia-hosting.md`, `…/researchers/prompt-analisis-video-h3.md`, `…/researchers/iteracion-clusterizacion.md`, `…/researchers/prompt-lovable-h1.md`

`/researchers/` no tiene contraseña — "no indexado" no es "privado". No compartas esos enlaces fuera del equipo.

Paso a paso completo en `guias/Guia_hosting_y_appscript.md`.

---

## Rigor (recordatorio del agente Piloto)

El umbral de cada experimento se fija antes y no se mueve; COP 39.900 es estímulo, no precio; con n pequeño el techo de un hallazgo es Emergente; las salvaguardas (consentimiento, privacidad, no rastreo, silencio ≠ consentimiento) son criterios de detención. La decisión oficial se registra en las scorecards, no en los paneles.

*Sintonía · Maestría en Gestión de la Innovación · Universidad Icesi.*
