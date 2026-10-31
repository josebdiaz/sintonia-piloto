# Implementación de ajustes de UX Writing · Sintonía v1

**Fecha:** 31 de octubre de 2026
**Rama objetivo:** `e3-ds-3.0` (rama vigente). La copia de trabajo de esta carpeta está en `M2-gemini`, archivada en `e3-ds-3.0` como `archivo/piloto-m2-gemini`: **no implementar sobre `M2-gemini`.**
**Fuente de las decisiones:** documento «Sintonía — Dirección creativa», pestañas *Brand strategy playbook* (rondas 1 a 15) y *Convergencia UX Writing* (auditoría y ronda 16).
**Estado:** aplicado el 31 oct. en la rama local `ux-writing-v1` (desde `e3-ds-3.0`, sin publicar). Ver §7 para lo que se aplicó distinto o quedó pendiente.

> **Reglas de lectura**
> - «Actual» es el texto exacto en `e3-ds-3.0`. «Nuevo» es el texto que se propone.
> - Cada cambio cita la ronda del playbook que lo respalda (R#).
> - Lo marcado **Por verificar** depende de un dato que no está en el repositorio.
> - Ningún texto inventa lugares, precios ni horarios: todo valor entre llaves sale del plan o del inventario verificado.

---

## 1. Decisiones que gobiernan este documento

| # | Decisión | Ronda |
|---|---|---|
| D1 | `ME APUNTO` y `NO PUEDO` son la identidad: las plantillas siempre los piden así. El parser acepta además sinónimos naturales (ver §3.1). Lo ambiguo se escala; nunca se adivina. | R16 |
| D2 | Se descarta el quórum del 80 %. **Regla única de cierre:** en la fecha límite, si hay 2 o más ME APUNTO → PLAN LISTO; si no → QUEDA PARA OTRA. Si todos responden antes, se cierra antes. El silencio no bloquea. | R16 (reemplaza R9 y R10) |
| D3 | Fecha límite por defecto: 24 h antes del encuentro. | R6 |
| D4 | «Grupo completo» reemplaza el «quórum» de la app (personas que deben unirse). El mínimo para seguir es 2, el mismo número del cierre. | R11, R16 |
| D5 | Nunca se nombra a quien no ha respondido: siempre conteos. El agente insiste al grupo, nunca a una persona. | R4b, R5 |
| D6 | Una sola voz: Sintonía, con el glifo S como avatar. Los ocho personajes salen del producto. | R16 |
| D7 | Máximo un emoji por mensaje, opcional, solo si suma emoción. Nunca como etiqueta de un dato ni como respuesta. | R16 |
| D8 | Título en mayúsculas de hasta tres palabras; una acción por mensaje. | Racional A.4 |
| D9 | Stickers: «¿ARMAMOS PLAN?» abre (pregunta); EN SINTONÍA cierra (único animado). QUEDA PARA OTRA va solo en texto. Un sticker nunca va solo ni cuenta como respuesta. | R12 a R15, R16 |
| D10 | La encuesta posplan se llama «¿Cómo les fue?», no «pulso». El cierre se llama «Sintonizamos». | R8, R16 |
| D11 | Persona del equipo solo a pedido (HUMANO). «Ayuda» sola cuenta como pedido de persona; con palabras de salud o emergencia, sigue como caso sensible. | R3, R16 |
| D12 | Modo exprés: planes con menos de 24 h; una invitación y un cierre, sin recordatorios. | R7 |

---

## 2. Orden de implementación

| Fase | Qué | Archivos | Depende de |
|---|---|---|---|
| F1 | Parser: sinónimos y «Ayuda» | `n8n/E15-01-voto-minimo.json`, `n8n/README.md` | — |
| F2 | Consola: plantillas nuevas | `piloto/mago.html` | F1 (las plantillas piden palabras que el parser debe entender) |
| F3 | Motor n8n: textos y flujos de cierre | `n8n/PROMPT-n8n-builder.md` (y los flujos que genere) | F1, F2 |
| F4 | App E3: voz única, grupo completo, cierre y textos | `e3-app/fuente/src/01, 04, 06, 07, 08` + regenerar `e3-app/index.html` | Avatar del glifo S (§4) |
| F5 | Encuesta posplan | `piloto/retro.html` | — |
| F6 | Backend (opcional) | `backend/Codigo_Piloto.gs` | Redespliegue de Apps Script |
| F7 | Documentación | Playbook, `Wording_verificado_v2.md` | — |
| F8 | Pruebas | Todo lo anterior, en `modo=prueba` | F1 a F6 |

F1, F5 y F7 pueden hacerse en paralelo. F2 y F3 deben salir juntas para que la consola (E1) y el motor (E1.5) digan lo mismo.

---

## 3. Cambios por archivo

### 3.1 `n8n/E15-01-voto-minimo.json` · nodo «Interpretar texto» (F1)

**Por qué:** hoy el parser solo acepta frases exactas; «voy» o «no puedo ese día» se escalan (D1). Y «ayuda» se clasifica como emergencia (D11).

**Cambio 1 · Sacar `ayuda` de la lista sensible.**

Actual:
```js
const SENSIBLE = /\b(emergencia|urgente|accidente|hospital|ambulancia|policia|peligro|socorro|ayuda|enfermo|enferma|dolor|me siento mal|salud|ubicacion|donde estoy)\b/;
```
Nuevo:
```js
const SENSIBLE = /\b(emergencia|urgente|accidente|hospital|ambulancia|policia|peligro|socorro|enfermo|enferma|dolor|me siento mal|salud|ubicacion|donde estoy)\b/;
const PIDE_HUMANO = /^(humano|ayuda|necesito ayuda|hablar con alguien|una persona)$|\bayuda\b/;
```

**Cambio 2 · Sinónimos.** El orden importa: primero vacío, luego sensible, luego humano, luego votos (para que «voy con la 2» siga siendo voto), luego asistencia.

```js
const ME_APUNTO = /^(me apunto|voy|si voy|yo voy|me sumo|cuenta conmigo|cuenten conmigo|ahi estare|alla estare|apuntame|listo voy)$/;
const NO_PUEDO  = /^(no puedo|no puedo ese dia|no puedo ir|no voy|esta vez no|no alcanzo|no me queda|paso)$/;
const LLEGUE    = /^(llegue|ya llegue|ya estoy|ya estoy aqui|aqui estoy)$/;
```
Reemplazar en la cadena de decisiones:
```js
else if (/^humano$/.test(norm)) r = { accion: 'escalar', motivo: 'pidio_humano' };
// → 
else if (PIDE_HUMANO.test(norm)) r = { accion: 'escalar', motivo: 'pidio_humano' };
```
```js
else if (/^me apunto$/.test(norm)) …   // → else if (ME_APUNTO.test(norm)) …
else if (/^no puedo$/.test(norm)) …    // → else if (NO_PUEDO.test(norm)) …
else if (/^llegue$/.test(norm)) …      // → else if (LLEGUE.test(norm)) …
```
Las `etiqueta` siguen siendo las canónicas (`ME APUNTO`, `NO PUEDO`, `LLEGUÉ`).

**Cambio 3 · Emoji solo.** Hoy un mensaje con solo 👍 se normaliza a vacío y se escala con motivo `vacio`. Agregar antes de la normalización:
```js
const soloEmoji = String(rawTexto).trim() && !/[a-z0-9]/i.test(String(rawTexto));
// y en la cadena: if (soloEmoji) r = { accion: 'escalar', motivo: 'solo_emoji' };
```
Así quien revisa sabe que no es un mensaje vacío. Un emoji nunca cuenta como respuesta (D9).

**Casos de prueba (modo prueba):**

| Texto | Resultado esperado |
|---|---|
| `voy` · `Sí voy` · `Cuenta conmigo` | evento `me_apunto` |
| `No puedo ese día` · `paso` · `esta vez no` | evento `no_puedo` |
| `voy con la 2` · `la 2` | voto opción 2 |
| `ayuda` · `necesito ayuda para llegar` | escalar, `pidio_humano` |
| `ayuda me siento mal` · `accidente` | escalar, `sensible` |
| `👍` | escalar, `solo_emoji` |
| `voy tarde` · `no sé si pueda` | escalar, `no_entendido` (ambiguo: no se adivina) |

**`n8n/README.md`:** actualizar la línea «Entiende:» con los sinónimos y el nuevo motivo `solo_emoji`.

---

### 3.2 `piloto/mago.html` · arreglo `TPL` (F2)

**Por qué:** la consola nombra a quien no votó (D5), usa hasta 5 emojis de etiqueta (D7) y no tiene cierre, QUEDA PARA OTRA ni modo exprés (D2, D9, D12).

**Cambio 1 · `faltan` pasa de nombres a conteo.** Hoy `faltan: faltan.length ? faltan.join(', ') : '[nombres]'`. Nuevo: `n` (votos), `total` (invitados) y `faltan` como número. Ninguna plantilla de grupo recibe nombres.

**Cambio 2 · Plantillas.** Formato de cada entrada: `[comando, título, destino, objetivo, texto]`.

| Comando | Actual (resumen) | Nuevo texto |
|---|---|---|
| `/ingreso` | «¡Hola, parche! 👋 Soy Sintonía… opciones reales en Cali… 👤 … 🚪 … 🔒 …» | `¡HOLA, PARCHE! 👋 · Soy Sintonía, el quinto amigo que ayuda a que el plan sí se dé. Les propongo opciones, ustedes votan y yo cuadro la logística. En este piloto, una persona del equipo revisa todo lo que propongo. Para hablar con alguien, escriban HUMANO; para salir, SALIR. Privacidad: {aviso}` |
| `/opciones` | «Les traigo {n} opciones: {lista}… Voten con el número…» | `LES TRAIGO OPCIONES · {lista}\n\nVoten con el número antes de {limite}. Si les sirve cualquiera, TODAS; si ninguna, NINGUNA y busco otra cosa. Cerca, corto y posible.` · Objetivo: «adjuntar antes el sticker ¿ARMAMOS PLAN?» |
| `/recordatorio` | Grupo: «⏳ …nos falta el voto de {nombres}…». Persona: «{nom}, ¿cuál te suena más…?» | Solo grupo: `PLAN EN CAMINO · Van {n} de {total} votos. ¿Cuál les suena más: 1, 2 o 3? Si ninguna sirve, también vale decirlo.` · **Se elimina la versión personal** (destino pasa de `ambos` a `grupo`). |
| `/confirmado` | «¡Quedó! Ruta clara, ganas intactas: 📍… 📌… 🕒… 🚗… 💰… Respondan ME APUNTO si van o NO PUEDO si no alcanzan.» | `¡QUEDÓ! · Ruta clara, ganas intactas: {plan} en {lugar}, {hora}.\nDirección: {dir}\nSalida sugerida: {salida}. En Cali la hora pico y la lluvia cambian los tiempos.\nAprox. {presupuesto} por persona.\n¿Van? Respondan ME APUNTO o NO PUEDO antes de {limite}.` |
| `/cierre` (nueva) | — | `PLAN LISTO · {dia} {hora} en {lugar}. Van {n_voy}. A quienes no pueden: nos vemos en la próxima. ¡Sintonizamos!` · Objetivo: «adjuntar después el sticker EN SINTONÍA». Destino `grupo`. |
| `/queda` (nueva) | — | `QUEDA PARA OTRA · Esta vez no se armó. Cuando quieran, armamos otro.` · Destino `grupo`. Sin sticker. |
| `/expres` (nueva) | — | `¿QUIÉN SE ANIMA? · Hoy {hora} en {lugar}. Plan exprés, sin recordatorios. Respondan ME APUNTO o NO PUEDO.` · Destino `grupo`. |
| `/salida` | «🚗 Para llegar a {lugar} a la hora ({hora}), salgan a las {salida}…» | `HORA DE SALIR · Para llegar a {lugar} a las {hora}, salgan a las {salida}. Si llueve o hay trancón, mejor un poco antes.` (la versión personal se conserva con `{nom}, ` al inicio: es logística, no insistencia) |
| `/checkpoint` | «¿Ya llegaron? … LLEGUÉ. No usamos su ubicación. Y al volver, un "ya en casa"…» | `¿YA LLEGARON? · Cuando estén en el sitio, escriban LLEGUÉ. No usamos su ubicación.` |
| `/no_llega` | «{nom}, ¿cómo vas? El parche ya está en {lugar}…🙌» | Sin cambio. Excepción declarada: es cuidado, no insistencia. |
| `/llegaron` | «¡Ya está todo el parche! 🙌 Disfruten. Al volver, un "ya en casa"…» | `¡YA ESTÁN TODOS! 🙌 · Disfruten.` |
| `/en_casa` | «¿Ya todos en casa? …Gracias por sintonizar hoy.» | `¿YA EN CASA? · Cuando lleguen, un «ya en casa» basta. Gracias por sintonizar hoy.` (versión personal se conserva) |
| `/retro` | Título: «Cierre y pulso». «¿Cómo les fue? Si hubo sintonía, sigan 🙌 …» | Título: «Cierre · ¿Cómo les fue?». Objetivo: «invitar a responder la encuesta de 4 minutos». Texto: `¿CÓMO LES FUE? · Si hubo sintonía, sigan 🙌 Cuéntennos en 4 minutos, desde el celular con el que se registraron: {retro}. Sus respuestas son privadas.` |
| `/guardrail` | «Mi tarea es ayudarles a armar y coordinar planes en Cali…» | `SOLO PLANES · Mi tarea es ayudarles a armar planes, así que en eso no les puedo ayudar. ¿Volvemos al plan?` |
| `/humano` | «Hola, soy {humano}, del equipo de investigación… Si es una emergencia, llamen al 123.» | Sin cambio en la entrada. Nueva salida: `Listo, vuelvo a organizar el plan.` (puede ir como `/humano_fin`). |

**Cambio 3 · Datos nuevos para las plantillas.**

- `{limite}`: `hora_encuentro − 24 h` (D3), en formato «sáb 8 nov, 4:00 p. m.».
- `{n_voy}`: apuntados del plan. El backend guarda `n_apuntados` en la hoja `planes`; **Por verificar** si `view=plan` lo devuelve.
- `{dia}`: día del encuentro en texto.

**Cambio 4 · Orden en pantalla (`ORDEN`).**
```js
var ORDEN = {
  votando: ['/opciones', '/recordatorio', '/expres'],
  cerrado: ['/cierre', '/confirmado', '/salida', '/no_llega', '/checkpoint', '/llegaron', '/en_casa', '/retro'],
  caido:   ['/queda']
};
```

**Stickers:** la consola no envía stickers; quien opera los adjunta a mano en WhatsApp Web. Los archivos de «¿ARMAMOS PLAN?» y EN SINTONÍA están **pendientes** (toolkit fase 2) y sus límites técnicos en WhatsApp siguen **Por verificar**.

---

### 3.3 `n8n/PROMPT-n8n-builder.md` (F3)

**Por qué:** el prompt dice «use exactly these» textos; deben ser los mismos de §3.2. Además, el flujo no tiene regla de cierre y un plan caído no avisa al grupo (D2, D9).

1. **«Message texts»:** reemplazar todos los textos por los de §3.2, incluidas `/cierre`, `/queda` y `/expres`. Quitar la nota de `/recordatorio` que permite poner nombres durante la aprobación («the reviewer may replace the count with names»): contradice D5.
2. **W2 · Recordatorio:** se mantiene una sola vez por plan y en versión de grupo. **No se envía** en planes exprés (D12).
3. **W3 · Cierre:** dividir en dos pasos.
   - W3a «Ganó la opción»: igual que hoy, con `/confirmado` y `{limite}`.
   - W3b «Fecha límite» (nuevo): a `hora_encuentro − 24 h`, leer `view=plan`. Si `n_apuntados ≥ 2` → SW con `/cierre`. Si no → `cerrar_plan` con `caido: true` y `causa_caida: 'desinteres'`, y SW con `/queda`. Cierre anticipado: si todos los invitados respondieron antes, ejecutar W3b de inmediato.
4. **Plan caído (cualquier causa):** cambiar «send nothing to the group» por «SW con `/queda`».
5. **Modo exprés:** si al cerrar la votación faltan menos de 24 h para el encuentro, usar `/expres` en lugar de `/confirmado` y no programar W2.
6. **«Notas para el equipo»:** actualizar la línea de diferencias de texto con E1: ya no hay diferencias.

---

### 3.4 App E3 · `e3-app/fuente/src/` (F4)

Después de editar: `python3 e3-app/fuente/build.py` desde la raíz, correr `e3-app/fuente/autotest.js` y hacer commit de `index.html` junto con la fuente. **No editar `e3-app/index.html` a mano.**

**`01-content.js`**

- `VOZ`: transición sin tocar cada paso. Todas las claves apuntan al mismo avatar (D6):
  ```js
  const S = ['sintonia-s', 'Sintonía'];
  const VOZ = { quinto: S, guardiana: S, mago: S, resonador: S, antena: S, despertador: S, gramola: S, estatica: S };
  ```
  En una segunda pasada se pueden quitar los parámetros `voz` de `05` y `06`.
- `REGLAS_IA`:
  - Actual: «Español de Colombia, tuteo, cálido y breve: máximo 2 frases y 40 palabras. Sin emojis.»
  - Nuevo: «Español de Colombia, tuteo, cálido y breve: máximo 2 frases y 40 palabras. Máximo un emoji y solo si suma calidez; nunca como dato.»
  - Agregar: «- Nunca nombres a quien no ha respondido: usa conteos.»

**`04-parts.js`**

- `av(voz)` devuelve siempre el avatar del glifo S con `alt="Sintonía"`. Depende del archivo del avatar (§4).

**`06-grupo.js`**

| Lugar | Actual | Nuevo | Regla |
|---|---|---|---|
| `ETAPA_TXT.sinquorum` | `'Sin quórum'` | `'Grupo incompleto'` | D4 |
| `unirme` | «¡Ya está dentro {nombre}! Falta(n) N persona(s) para que les proponga planes.» | «¡Ya está dentro {nombre o alguien nuevo}! Van {n} de {N}; cuando estén todos, les propongo planes.» | D5 |
| `sinquorum-*` | «No se completó el quórum a tiempo. Puede pasar. ¿Qué hacemos?» | «El grupo no se completó a tiempo. Puede pasar. ¿Qué hacemos?» | D4 |
| `opciones-r1` | «Tengo 3 opciones cerca, cortas y posibles. Compárenlas y voten:» | «LES TRAIGO OPCIONES · Tres planes cerca, cortos y posibles. Voten antes de {limite}:» | D8 |
| `plan` (fijado) | «¡Plan fijado! Ganó «{titulo}» con {k} de {n} votos. Les aviso un día antes y una hora antes.» | «¡QUEDÓ! · Ganó «{titulo}» con {k} de {n} votos. ¿Van? Toquen Me apunto o No puedo antes de {limite}.» | D1, D3 |
| Nuevo paso de cierre | — | En la fecha límite (o cuando todos respondan): si `asistencia === 'si'` en 2 o más → mensaje `plan-listo`: «PLAN LISTO · {día} {hora} en {lugar}. Van {n_voy}. A quienes no pueden: nos vemos en la próxima. ¡Sintonizamos!» + adjunto `sticker` EN SINTONÍA. Si no → etapa `cancelado` con «QUEDA PARA OTRA · Esta vez no se armó. Cuando quieran, armamos otro.» | D2, D9 |
| `rapida('¿Quién falta?')` | Etiqueta «¿Quién falta?»; respuesta «Ya están todos. ¡Parche en sintonía!» | Etiqueta «¿Cuántos van?»; respuesta «Ya está el grupo completo.» o «Van {n} de {N}. Compartan el código {pid}.» | D5, D10 (EN SINTONÍA queda solo para el cierre) |
| `rapida('Cancelar el plan')` | «Plan cancelado. Cuando quieran, lo intentamos de nuevo.» | «QUEDA PARA OTRA · Cuando quieran, armamos otro.» | D9 |

Se conservan sin cambio: «Voto registrado. Van {v} de {n}.», «Entendido. No le digo a nadie quién fue…», «Gracias por avisar. Le cuento al grupo sin detalles.» y «Para un plan hacen falta al menos 2 personas…» (ya cumplen D4 y D5).

**Modo exprés:** no aplica en la app de prueba, porque la fecha del plan es siempre el próximo domingo (`proximoDomingo`). Se deja anotado.

**`07-ui.js`**

- `station.sinquorum`: `Sin quórum · ${n}/${N}` → `Grupo incompleto · ${n}/${N}`.
- `by.reclutando`: `'¿Quién falta?'` → `'¿Cuántos van?'`.
- `by.fijado` (recordatorio del día anterior): `'Ahí estaré'`, `'Ya no puedo'` → `'Me apunto'`, `'No puedo'`. Los botones muestran la identidad (D1). Actualizar los `case` de `rapida` y la línea 71 de `autotest.js`.
- Agregar el render del adjunto `sticker` (imagen, `alt` con el texto del sticker).

**`08-equipo.js`**

- `quórum ${n} de ${G.N}` → `grupo ${n} de ${G.N}`.
- «Solo aplica mientras se busca quórum.» → «Solo aplica mientras se completa el grupo.»

**`autotest.js`:** renombrar los pasos «quórum 4» y «F3 sin quórum» a «grupo completo»; agregar pasos para el cierre con 2 ME APUNTO y con 1 (QUEDA PARA OTRA).

---

### 3.5 `piloto/retro.html` (F5)

El `<title>` ya dice «¿Cómo les fue?». Cambiar los textos visibles (no los nombres de campos como `junto_al_pulso` o `con_pulso`, que son contrato de datos):

| Actual | Nuevo |
|---|---|
| «Pulso de 4 minutos» / «Pulso de 2 minutos» (`#tagDur`) | «4 minutos» / «2 minutos» |
| «Cuéntennos cómo les fue en este pulso breve de 4 minutos.» | «Cuéntennos cómo les fue. Son 4 minutos.» (igual con 2) |
| «…el pulso se abre aquí.» | «…la encuesta se abre aquí.» |
| «El pulso se abre cuando el plan ya quedó cerrado.» | «La encuesta se abre cuando el plan ya quedó cerrado.» |
| «El pulso se abre después del encuentro» | «La encuesta se abre después del encuentro» |

---

### 3.6 `backend/Codigo_Piloto.gs` (F6, opcional)

`redactar_ia` ya pide «sin culpa ni presión, máximo un emoji». Agregar a ese prompt: «Nunca nombres a quien no ha respondido; usa conteos. Una acción por mensaje.» Requiere redesplegar el Apps Script; si no se hace, no bloquea lo demás.

---

### 3.7 Documentación (F7)

- **Playbook (documento «Sintonía — Dirección creativa»):** las plantillas de las rondas 5, 7, 9, 10 y 11 usan «Voy» y «No puedo ese día», y las rondas 9 y 10 describen el quórum del 80 %. Quedan superadas por la ronda 16 de la pestaña *Convergencia UX Writing*.
- **`Wording_verificado_v2.md`:** está solo en la copia `M2-gemini`, no en `e3-ds-3.0`. Si se lleva a la rama vigente, va a `archivo/` con una línea al inicio: «Histórico, anterior al pivote. Superado por la pestaña *Convergencia UX Writing*.»
- **Avisos de privacidad (`piloto/aviso.html`):** no requieren cambios por este documento.

---

## 4. Dependencias y pendientes

| Pendiente | Bloquea | Responsable sugerido |
|---|---|---|
| Archivo del avatar con el glifo S (versión de una onda para menos de 40 px) | F4 (`04-parts.js`) | Dirección de arte |
| Stickers «¿ARMAMOS PLAN?» y EN SINTONÍA | Adjuntos en F2 y F4 | Dirección de arte |
| Límites técnicos de stickers en WhatsApp (formato, peso, tamaño) | Producción de stickers | **Por verificar** en la documentación vigente |
| Si `view=plan` devuelve `n_apuntados` | W3b en F3 | Quien mantiene el backend |
| Momento exacto del corte en modo exprés | `/expres` en F3 | Equipo |
| Quién implementa cada fase | Todo | Equipo |

---

## 5. Pruebas (F8, todo en `modo=prueba`)

1. **Parser:** los casos de §3.1, uno por uno, en el formulario de E15-01.
2. **Recorrido de plan con 2 o más ME APUNTO:** `/ingreso` → `/opciones` → `/recordatorio` → `/confirmado` → `/cierre` con sticker → `/checkpoint` → `/retro`.
3. **Recorrido con 1 ME APUNTO en la fecha límite:** termina en `/queda`, sin sticker.
4. **Plan para hoy:** `/expres`, sin `/recordatorio`.
5. **App E3:** `autotest.js` completo, con los pasos nuevos.
6. **Barrido de texto prohibido** en `piloto/` y `e3-app/fuente/src/` (no debe devolver texto visible para participantes):
   ```bash
   grep -rn -i -E "nos falta el voto de|sin qu[oó]rum|parche en sinton|pulso breve|pulso de [0-9]|curadur" piloto e3-app/fuente/src
   ```
7. **Emojis:** revisar que ninguna plantilla de `TPL` tenga más de uno.

---

## 6. Riesgos

- **Sinónimos con falsos positivos:** una frase como «paso» puede tener otro sentido. Mitigación: coincidencia exacta de la frase completa; lo demás se escala a una persona.
- **Consola y motor desalineados:** si F2 sale sin F3, E1 y E1.5 dicen cosas distintas. Mitigación: publicarlos juntos.
- **Cambio de voz en la app sin avatar listo:** si F4 sale antes del archivo del glifo S, la app queda sin avatar. Mitigación: F4 espera el archivo.
- **Evidencia:** ninguna de estas decisiones está validada con usuarios. Las señales de la ronda 2 del playbook (otro organiza, «No puedo» sin culpa, el grupo nombra a Sintonía) se registran como exploratorias.

---

## 7. Registro de aplicación (31 oct.)

| Fase | Estado | Nota |
|---|---|---|
| F1 Parser | Aplicado | 17 casos probados fuera de n8n; falta probar en la instancia |
| F2 Consola | Aplicado | Las opciones se numeran «1.», «2.», «3.» (sin emojis de tecla). `/salida` conserva «a la hora ({hora})» |
| F3 Motor n8n | Aplicado en el prompt | Los flujos W0–W5 de la instancia no están en el repo: hay que regenerarlos o ajustarlos a mano |
| F4 App E3 | Aplicado con dos diferencias | (1) Avatar: todas las voces usan `el-quinto` hasta tener el del glifo S (`SINTONIA_AV` en `01-content.js`). (2) Los botones del día anterior siguen como «Ahí estaré» / «Ya no puedo»: son una reconfirmación distinta de ME APUNTO y se aceptan como sinónimos. La app no tiene fecha límite de votación ni modo exprés. Sin sticker hasta tener el archivo |
| F5 Encuesta | Aplicado | Solo textos visibles |
| F6 Backend | Aplicado en el código | Requiere redesplegar el Apps Script |
| F7 Documentación | Aplicado | Nota de histórico en `docs/wording-verificado-v2.md`. `docs/protocolo-m2.md` y `docs/guias/plan-implementacion-e1-e2.md` citan los textos anteriores: no se tocaron porque son el protocolo declarado del experimento; el cambio de textos debe declararse allí |
| F8 Pruebas | Pendiente | `autotest.js` debe correrse en el navegador; no se pudo correr aquí |
