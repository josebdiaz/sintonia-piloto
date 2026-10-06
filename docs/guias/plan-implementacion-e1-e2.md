> **Copia en el repositorio · Hecha: el piloto se montó con este plan (4/10). Lo vigente para operar es docs/protocolo-m2.md.**

# Plan de implementación · Experimentos E1 (WhatsApp) y E2 (web app)

*Piloto Mago de Oz de 2 semanas en Cali. Las decisiones del equipo que enmarcan este plan:*
- *Motor de IA: Gemini, llamado desde Apps Script.*
- *Páginas para participantes en GitHub Pages (`sintonia-piloto`).*
- *El E1 corre en un número nuevo de WhatsApp Business.*
- *Asignación: la mitad de los grupos en E1 y la otra mitad en E2.*

> **Actualización v2.1 (3/10, después del control de compromisos P6).** Estos puntos tienen prioridad sobre el resto del documento:
> - **Backend v2.1** con los ajustes I1–I9, ya probado con una hoja simulada:
>   - La línea base es **por grupo** (tipo, tamaño, planes hechos y fallidos el último mes).
>   - El denominador son las **personas invitadas** (`n_invitados`). El embudo queda: invitadas → consintieron → se apuntaron → llegaron.
>   - Se registran los **minutos de trabajo humano** por causa (hoja `operacion`).
>   - Hay **versionado** y change log (`registrar_cambio`), con alerta si se intenta registrar un segundo cambio.
>   - La disposición a pagar y la carga son **solo del organizador**.
>   - La IA **solo elige lugares del inventario verificado**.
>   - Existe un `modo` de prueba, que el panel excluye.
>   - **No se construye flujo individual.**
> - **Regla I9 (decisión del equipo):** si alguien del grupo no da su consentimiento, el **grupo entero se desestima** de las pruebas por rigor. Lo mismo pasa si alguien revoca durante el piloto, y en ese caso se suprimen sus datos. Se aplica con `cerrar_reclutamiento`.
> - **Muestra:** 2–3 grupos por condición, equilibrados por tipo y sin cruce. La comparación es **descriptiva**.
> - **Inventario:** `Inventario_Planes_Cali.csv` va en la hoja `inventario`. Hoy tiene 7 lugares activos y 15 por confirmar. La meta es tener 12–15 activos antes del 9/10.
> - **Fechas límite confirmadas:** GitHub, Apps Script y Gemini a más tardar el **6/10**; etapas 2–4 listas el **8/10**; ensayos el **9/10**; W1 el **10–11/10**.
> - En el montaje (§3), agregar la propiedad `COSTO_HORA_HUMANA_COP`, que es opcional y sirve para costear los minutos del mago.

> **Actualización v2.2 (4/10, alineación con los tableros InnLab 06 y 11.2).** El backend ahora mide lo que esos tableros ya habían aprobado:
> - **Capa 1 · least misery:** la retro pide la satisfacción con el plan (1–5). El panel promedia la satisfacción **mínima** de cada grupo.
> - **Capa 2 · puntualidad:** `cerrar_plan` exige la `hora_encuentro` (`YYYY-MM-DD HH:mm`). El panel calcula el % de personas que llegaron dentro de `TOLERANCIA_MIN` (15 min por defecto).
> - **S9 · planes caídos:** cada caída lleva una causa (`trafico`, `lluvia`, `agenda`, `costo`, `desinteres`, `imprevisto`, `otro`). Si un plan ya cerrado se cae después, se usa la acción nueva `marcar_caido`.
> - **Retro:** se agrega "¿qué le agregarías?" (pendiente de Validación de mercado). Cada persona envía una sola retro por plan, y las escalas fuera de 1–5 quedan vacías.
> - **Arreglos:** "no puedo" ya descuenta un "me apunto". Si revoca el organizador, se borra también la línea base del grupo. Las preferencias y los textos libres se guardan sin correos ni números de 7 dígitos o más.
> - **Montaje:** en Configuración del proyecto, poner la zona horaria **America/Bogota**. La propiedad `TOLERANCIA_MIN` es opcional.
> - Probado con una hoja simulada, incluidas las pruebas de la v2.1. Copia anterior: `Codigo_Piloto_v2.1_2026-10-03.gs`.

---

## 0. Arquitectura

```
Participantes (sin cuenta en ningún servicio nuevo)
   │
   ├── GitHub Pages · sintonia-piloto/piloto/
   │     index.html    → landing del organizador: consentimiento + línea base + preferencias
   │     unirse.html   → cada amigo acepta por sí mismo, con su enlace de invitación
   │     plan.html     → E2: ve las opciones, vota, "me apunto", checkpoint y retro
   │     retro.html    → E1 y E2: retro + Van Westendorp + preventa
   │
   └── WhatsApp Business (E1) ←→ el mago, que opera desde la consola
                                   │
Equipo (clave ADMIN_KEY)           │
   ├── piloto/mago.html  → consola: crear plan, pedir opciones a la IA, editar y publicar,
   │                       redactar mensajes, registrar eventos del E1
   └── piloto/panel.html → métricas por experimento + costo de tokens
                                   │
                         Apps Script v2 (Codigo_Piloto_v2.gs) ──→ Gemini API
                                   │
                         Hoja nueva "Sintonía piloto v2" (11 hojas, ids seudónimos)
```

**Principios de diseño:**
- **Humano en el loop.** La IA propone y el mago revisa antes de que el grupo vea cualquier opción. Así ningún participante recibe lugares o eventos inventados.
- **Comparabilidad.** E1 y E2 usan el mismo backend, las mismas opciones y la misma retro. Lo único que cambia es el canal, y eso es justo lo que se quiere probar.
- **Privacidad por diseño.** Ver la sección 5.

---

## 1. Etapas de construcción

| Etapa | Entregable | Estado |
|---|---|---|
| **1** | Backend `Codigo_Piloto_v2.gs` + este plan | ✅ Probado con una hoja simulada (ver sección 6) |
| **2** | Páginas para participantes: `index.html`, `unirse.html`, `plan.html` y `retro.html`, con el aviso de privacidad y el texto de consentimiento | ⏳ |
| **3** | Kit del E1: `mago.html`, el guion completo (activación → votación → logística → secuencia → checkpoints → cierre y salida) y la configuración de WhatsApp Business | ⏳ |
| **4** | `panel.html` (métricas + costo de tokens), protocolo del piloto, QA de punta a punta y push a GitHub | ⏳ (necesita GitHub) |

---

## 2. Cómo restablecer la escritura en GitHub (lo hace Jose desde su cuenta)

**Qué está pasando.** El conector puede leer (`get_me` y `list_branches` funcionan), pero al escribir responde `403 Resource not accessible by integration`. Esto quiere decir que **la GitHub App del conector está autorizada, pero no está instalada en el repositorio** o no tiene permiso de escritura sobre el contenido.

**Pasos:**
1. En GitHub, ve a **Settings → Applications → Authorized GitHub Apps** y busca la app del conector de Claude (por ejemplo "Claude"). Anota el nombre exacto.
2. Pasa a la pestaña **Installed GitHub Apps** del mismo menú.
   - **Si la app aparece:** entra a *Configure* → en *Repository access* elige "Only select repositories" y agrega **`sintonia-piloto`** (o elige "All repositories") → guarda. Si arriba aparece un aviso de permisos pendientes ("…is requesting updated permissions"), acéptalo.
   - **Si no aparece** (fue lo que pasó la vez pasada): la app está autorizada pero nunca se instaló. Instálala desde claude.ai: **Configuración → Conectores → GitHub → Configurar o "Manage repositories"**. Eso abre el flujo de instalación en GitHub. Elige tu cuenta `josebdiaz` y el repositorio `sintonia-piloto`.
3. Durante la instalación, verifica que los permisos incluyan **Contents: Read and write**.
4. Si nada de lo anterior funciona: en claude.ai, **desconecta y vuelve a conectar** el conector de GitHub y repite el paso 2.
5. Avísame cuando termines. Lo compruebo creando una rama de prueba (sin tocar `main`) y, si funciona, publico la etapa 4 directo en el repo.

*Mientras tanto todo se construye en local y no depende de GitHub. Si no se logra, queda el plan B de siempre: un ZIP para subir a mano.*

---

## 3. Montaje del backend (Jose, unos 20 minutos)

1. Crea una **hoja de Google nueva**: "Sintonía piloto v2". No reutilices la del H1.
2. **Extensiones → Apps Script**. Pega `Codigo_Piloto_v2.gs` y guarda.
3. **Configuración del proyecto → Propiedades del script.** Agrega:
   - `SHEET_ID`: el id de la hoja nueva (está en su URL).
   - `ADMIN_KEY`: una clave larga del equipo, de 20 caracteres o más. Compártela solo con Katherine.
   - `GEMINI_API_KEY`: créala en Google AI Studio con tu cuenta de Google.
   - `GEMINI_MODEL`: `gemini-2.5-flash`, o el modelo vigente que prefieras.
   - `PRICE_IN_PER_M` y `PRICE_OUT_PER_M`: el precio en USD por millón de tokens, tomado de la **página oficial de precios vigente** (no lo dejé fijo en el código porque cambia).
   - `AVISO_VERSION`: `v1-2026-10`.
4. Recarga la hoja → menú **Sintonía piloto → Crear todas las hojas**.
5. **Implementar → Nueva implementación → Aplicación web.** Ejecutar como *Yo*; quién tiene acceso: *Cualquier usuario*. Copia la URL que termina en `/exec`.
6. Pásame esa URL. La conecto a las páginas en la etapa 2.

> ⚠️ **Privacidad de Gemini (decisión necesaria).** Según los términos de la Gemini API (verificar la versión vigente), en el **nivel gratuito** Google puede usar las entradas y salidas para mejorar sus productos. En el **nivel pago** (con facturación activa en el proyecto) no lo hace. La guía de cumplimiento promete que "el proveedor no entrena con los datos", así que **hay que activar la facturación**. Igual el costo del piloto debería ser bajo (lo medimos en la hoja `tokens`). Además, a Gemini solo se le envían resúmenes de preferencias, nunca nombres ni números.

---

## 4. Operación del piloto

**Asignación:** la mitad de los grupos en E1 y la otra mitad en E2. Cada grupo se queda en su experimento los dos fines de semana. El enlace de la landing lleva el experimento (`?exp=E1` o `?exp=E2`) y lo reparte el equipo, alternando para que quede equilibrado.

**Flujo común:**
1. El organizador abre la landing, acepta, llena la línea base y sus preferencias, y recibe un **enlace de invitación** para su parche.
2. Cada amigo abre ese enlace y acepta por sí mismo. El grupo admite máximo 8 personas.
3. El equipo, desde la consola: crea el plan → pide opciones a la IA → **revisa y edita** → publica.
4. **E1:** el mago crea el grupo de WhatsApp desde el número de Sintonía (con quienes aceptaron), manda las opciones redactadas con la IA en el tono del grupo y registra cada evento en la consola (me apunto, llegué, llegué a casa).
   **E2:** el grupo recibe por WhatsApp normal un único enlace a `plan.html`. Ahí votan, marcan "me apunto" y hacen los checkpoints. Sintonía no está dentro del chat.
5. El mago cierra el plan con la opción más votada. En E1 el mago manda los recordatorios; en E2 los recibe el organizador por la web.
6. Después del plan: `retro.html` (fatiga, carga, valor del final, ¿repetirían?, confort con el bot, sentimiento) y Van Westendorp + preventa con precio fundador, **sin cobro**.
7. Segundo fin de semana: se repite el ciclo para medir la repetición.

**Configuración de WhatsApp Business (E1):**
- Número nuevo con la app gratuita de WhatsApp Business. Perfil "Sintonía", foto, descripción.
- Mensaje de bienvenida + aviso de curaduría humana + enlace al aviso de privacidad.
- Etiquetas por grupo y por estado del plan. Respuestas rápidas tomadas del guion (etapa 3).
- No usar listas de difusión para participantes sin opt-in. Solo se escribe a quien aceptó en la web.

**Calendario (propuesta):**
- 5–9 de octubre: montaje y reclutamiento.
- 10–11 de octubre: plan 1.
- 17–18 de octubre: plan 2.
- 19–21 de octubre: cierre e informe.

---

## 5. Privacidad y cumplimiento (aplicado en el código)

| Regla de la guía | Cómo queda implementada |
|---|---|
| Consentimiento individual | `registrar` rechaza si falta cualquiera de las 4 casillas (datos, opt-in de WhatsApp, mayor de 18, investigación) |
| Separar los contactos | El nombre de pila y el WhatsApp van solo en la hoja `contactos`; el resto usa `pid`, `grupo_id` y `plan_id` |
| Lectura restringida | Las vistas `mago` y `panel` piden `ADMIN_KEY`. La vista pública del plan solo muestra opciones y conteos, y solo a miembros del grupo |
| Minimización | A Gemini solo le llegan resúmenes de preferencias, nunca datos personales |
| Supresión | `revocar` marca al participante y **borra su fila de contacto** |
| Cierre del estudio | Menú → "Borrar datos al cerrar el estudio": borra contactos, preferencias y comentarios libres |
| Grupo de hasta 8 | Igual que el límite de la Groups API, para que el piloto se parezca a H2 |
| Sin datos sensibles | El prompt le prohíbe a la IA pedir o usar datos personales. El mago sigue la regla escrita de no guardar datos sensibles |

*Límite conocido:* las escrituras son públicas (cualquiera con la URL podría enviar datos basura). Para un piloto con 4 a 6 grupos invitados es aceptable: los votos y eventos exigen un `pid` válido del grupo, y las acciones del equipo exigen la clave.

---

## 6. QA de la etapa 1 (hoja simulada en memoria, Gemini simulado)

Todas las pruebas pasaron:
- Sin las 4 autorizaciones no se guarda nada.
- Una invitación inválida se rechaza.
- Crear un plan, leer el panel o leer la consola sin clave da `no_autorizado`.
- No se puede votar antes de que el mago publique (`plan_no_votable`).
- Alguien que no es del grupo no puede votar.
- Un voto repetido reemplaza al anterior.
- La vista pública del plan no expone nombres.
- Un checkpoint duplicado cuenta una sola vez.
- Un tipo de evento inválido se rechaza.
- La revocación borra el contacto.
- El grupo se detiene en 8 personas.
- Los tokens y el costo se registran por plan.
- El panel calcula: planes concretados, apuntados → asistentes, cierres sin veto, horas hasta el cierre, retro, línea base y costo por plan.

*Falta probar en real:* la llamada a Gemini con una clave verdadera y el despliegue de la aplicación web. Eso se hace en el montaje (sección 3).
