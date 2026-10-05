# Guía · Publicar la landing standalone (GitHub Pages) + backend (Apps Script)

Con esto pones la landing de H1 en internet, abierta a cualquiera (dentro o fuera de tu organización), y capturas los eventos anónimos en una hoja de Google que tú controlas. Todo gratis. Orden: **primero el backend** (para tener la URL del endpoint), **luego el hosting**.

Archivos que ya tienes:
- `index.html` — la landing + panel.
- `Codigo_AppsScript.gs` — el recolector de eventos.

Tiempo aprox.: 20–30 min la primera vez.

---

## PARTE A · Backend: Google Sheet + Apps Script

**A1. Crea la hoja.** Ve a [sheets.new](https://sheets.new). Ponle nombre, p. ej. *Sintonía H1 eventos*. No necesitas crear columnas: el script las crea solas.

**A2. Copia el ID de la hoja.** Está en la URL, entre `/d/` y `/edit`:
`https://docs.google.com/spreadsheets/d/`**`1AbC...ESTO_ES_EL_ID...xyz`**`/edit`

**A3. Abre el editor de Apps Script.** En la hoja: menú **Extensiones → Apps Script**. Borra lo que venga por defecto.

**A4. Pega el código.** Copia todo el contenido de `Codigo_AppsScript.gs` y pégalo. En la línea `var SHEET_ID = '...'`, reemplaza por el ID del paso A2. Guarda (ícono de disquete).

**A5. Despliega como aplicación web.** Botón azul **Implementar → Nueva implementación**.
- Si pide tipo, elige el engranaje ⚙ → **Aplicación web**.
- **Descripción:** Sintonía H1 (opcional).
- **Ejecutar como:** *Yo (tu correo)*.
- **Quién tiene acceso:** **Cualquier usuario**. ← importante; si dejas "solo yo", ni la landing ni el panel podrán escribir/leer.
- **Implementar**.

**A6. Autoriza.** La primera vez Google pide permisos. Acepta con tu cuenta. Si aparece *"Google no verificó esta app"*, entra en **Configuración avanzada → Ir a (nombre del proyecto)** y continúa: es tu propio script, es seguro.

**A7. Copia la URL del Web App.** Al terminar te muestra una URL que **termina en `/exec`**:
`https://script.google.com/macros/s/AKfy..../exec`
Guárdala. Esta es tu `ENDPOINT`.

> Si más adelante editas el `.gs`, debes **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva → Implementar** para que los cambios tomen efecto. La URL `/exec` se mantiene.

---

## PARTE B · Conectar la landing al backend

**B1.** Abre `index.html` en un editor de texto (o el bloc de notas).

**B2.** Cerca del inicio del `<script>` verás:

```js
const ENDPOINT = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
```

Reemplaza el texto entre comillas por tu URL `/exec` del paso A7. Guarda el archivo.

Eso es todo lo que hay que tocar en el código.

---

## PARTE C · Hosting gratis con GitHub Pages

**C1. Crea una cuenta** en [github.com](https://github.com) si no tienes (gratis).

**C2. Crea un repositorio.** Botón **+ → New repository**.
- **Repository name:** p. ej. `sintonia-piloto`.
- Marca **Public** (Pages gratis requiere repo público; no expone datos: solo el HTML).
- Marca **Add a README file**.
- **Create repository**.

**C3. Sube el `index.html`.** En el repo: **Add file → Upload files**. Arrastra tu `index.html` (ya con el ENDPOINT pegado). Abajo, **Commit changes**.
> El archivo debe llamarse exactamente `index.html` y estar en la raíz del repo.

**C4. Activa Pages.** Pestaña **Settings → Pages** (menú lateral).
- En **Source**, elige **Deploy from a branch**.
- **Branch:** `main`, carpeta `/ (root)`. **Save**.

**C5. Obtén tu URL.** Espera 1–2 min y recarga esa página de Settings → Pages. Aparecerá:
`https://TU-USUARIO.github.io/sintonia-piloto/`
Esa es la landing pública.

> Para actualizar la landing luego: subes de nuevo el `index.html` (Add file → Upload → Commit) y Pages se refresca solo en ~1 min.

---

## PARTE D · Probar y lanzar la primera tanda

**D1. Prueba tú primero.** Abre tu URL de Pages. Completa el flujo (screener → reservar → confirmar). Toca también *"Tengo dudas sobre el cobro"* una vez.

**D2. Verifica que llegó.** Abre tu Google Sheet: deberías ver filas nuevas en la pestaña `events` (timestamp, type, src, qualified_src). Si llegan, el circuito funciona.

**D3. Arma los enlaces con fuente (UTM) + token por persona.** Agrega `?utm_source=...` (el canal) y `&u=...` (un código único por invitado) al final de tu URL de Pages. El `&u=` es lo que permite medir **deserción real por usuario** y visitas únicas (no logs de sesión).

| Canal | Enlace a enviar (ejemplo) |
|---|---|
| WhatsApp directo | `https://TU-USUARIO.github.io/sintonia-piloto/?utm_source=wa_directo&u=ana01` |
| WhatsApp grupo | `...?utm_source=wa_grupo&u=CODIGO` |
| Comunidades remoto | `...?utm_source=com_remoto&u=CODIGO` |
| LinkedIn | `...?utm_source=linkedin&u=CODIGO` |
| Instagram | `...?utm_source=ig&u=CODIGO` |
| Referido | `...?utm_source=referido&u=CODIGO` |
| Tanda interna (calibración) | `...?utm_source=interno&u=CODIGO` |

- El **código `u`** es tuyo: usa uno distinto por persona (p. ej. `ana01`, `luis02`). No lleva datos personales, es solo una etiqueta para seguir el recorrido de esa persona en el embudo.
- Como envías por WhatsApp directo uno a uno, lo natural es un código por contacto.
- Cualquier visita sin `utm_source` válido cuenta como *no calificada* y queda fuera del denominador del umbral. Si falta `u`, la landing genera uno automático por navegador (menos preciso).

**D4. Abre el panel de control.** Agrega `?panel=1` a tu URL:
`https://TU-USUARIO.github.io/sintonia-piloto/?panel=1`
Verás el embudo en vivo, la conversión contra el umbral (≥5%, ≥2 reservas, 20–40 visitas calificadas), el desglose por fuente y la alerta de dudas sobre el cobro. Se refresca solo cada 10 s.
> Abrir el panel **no cuenta como visita** (no registra page_view).

---

## Solución de problemas

- **La hoja no recibe filas.** Revisa que el Web App esté con acceso **"Cualquier usuario"** (Parte A5) y que el `ENDPOINT` en `index.html` termine en `/exec`. Reabre la landing y prueba de nuevo.
- **El panel dice que no pudo leer el endpoint.** Suele ser el acceso del Web App o que no reimplementaste tras editar el `.gs`. Mientras tanto, **los datos siempre están en tu hoja de Google** — el panel es solo una lectura cómoda encima.
- **Editaste el `.gs` y no cambia nada.** Falta reimplementar (Gestionar implementaciones → Nueva versión).
- **Cambiaste el `index.html` y no se ve.** Vuelve a subirlo al repo y espera ~1 min.

---

## Reiniciar la base (entre tandas)

La base de datos **es** tu hoja de Google, así que reiniciarla = borrar las filas de eventos (conservando el encabezado). Dos formas:

- **Manual:** en la hoja, selecciona desde la fila 2 hacia abajo y elimínalas. Deja la fila 1 (encabezado).
- **Con un clic (seguro):** el código trae un menú **Sintonía → Limpiar eventos** que aparece al abrir la hoja (si no lo ves, recarga la hoja; también puedes ejecutar `clearEvents` desde el editor de Apps Script). Pide confirmación y solo lo puedes usar tú, con tu login.

No pongas un botón de borrado en el panel: el panel es público y expondría el borrado a cualquiera con el enlace.

---

## Privacidad (para el comité)

**Reservar no recolecta datos personales.** La hoja `events` solo guarda, por evento, el tipo de acción, la fuente del enlace, si es calificada, un código anónimo de usuario (`uid`) y la fecha. El seguimiento a quien reserva se hace por el mismo medio por el que llegó.

El único dato personal es **opcional y explícito**: al final, quien quiera puede dejar un contacto para futuras pruebas, con casilla de consentimiento aparte. Ese contacto **no se mezcla con los eventos** — va a una hoja separada (`contactos`). No es necesario para reservar.

El precio "COP 39.900" es un **estímulo experimental de disposición a pagar**, nunca un cobro. Consentimiento obligatorio antes de reservar; participación voluntaria; el `uid` es una etiqueta anónima, no identifica a la persona por sí solo.
