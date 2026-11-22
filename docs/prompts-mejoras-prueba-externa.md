# Aprendizajes de la prueba externa y prompts para implementarlos

**Fuentes** (carpeta «Feedback y pruebas de usuario»):
- Sesión del grupo de prueba.
- Hilo del equipo durante la prueba.
- Tres audios de Juan José (monitor), transcritos.
- Notas de la reunión P8c del 19/11.

**Prueba:** grupo de 3 personas en modo prueba, con quien organiza externa al equipo y Juan José como mago, consola 2.7.x.
**Estatus de la evidencia:** n = 1 grupo, en modo prueba → todo es **Emergente**. Sirve para mejorar la herramienta y el flujo, **no es un resultado del piloto**.

---

## 1. Qué pasó, por momento

| Momento | Hallazgo | Evidencia | Estatus |
|---|---|---|---|
| Antes · inscripción | Quien organiza **no entendió que tenía que compartir el enlace de invitación**. Creía que los números del equipo «ya estaban por defecto» y esperaba un aviso. El grupo se quedó en «1 de 3» hasta que el equipo se lo pidió dos veces. | Hilo: «pensé que… ya en la página estaba por default tu número»; «no es muy explícito que ella tiene que compartir ese link». Audio «pedido de instrucciones» | Emergente (n = 1), pero bloquea el flujo entero |
| Antes · inscripción | Las **preferencias** se llenaron para todo el parche, no para quien organiza. El texto del campo es ambiguo sobre de quién son los gustos. Además, entraron datos sensibles de otras personas del grupo, que el campo pide evitar (no se reproducen aquí). | Hilo | Emergente |
| Antes · equipo | El **correo de inscripción no le llegó al monitor**: los avisos solo van al correo del equipo configurado. Tampoco hay aviso por cada aceptación, solo cuando aceptan todos. | Hilo: «no me llegó el correo de la inscripción»; «solo me llega cuando ya se inscribieron todos» | Robusto (comportamiento del sistema) |
| Antes · mago | Al empezar, el monitor **no sabía quién le manda qué a quien organiza** (quién comparte el enlace de inscripción y quién el del grupo de WhatsApp). Tuvo que pedir instrucciones por audio. | Hilo y audio | Emergente |
| Antes · grupo de WhatsApp | **WhatsApp no deja agregar a alguien que no está en los contactos** del teléfono Sintonía. La 2.7.1 dice «agrega a quien organiza» y además le quitó el botón «Invitar a…». El monitor tuvo que armar a mano la invitación para quien organiza. | Audios «pedido de instrucciones» y «Feedback monitor 2» | Robusto (restricción de WhatsApp, repetida con José) |
| Activación · opciones | Los textos de las opciones son **largos y repetidos**: el nombre de la zona sale dos veces, hay rangos de precio muy amplios («$80.000 – $148.000») y enlaces de Maps de unos 300 caracteres. | Sesión | Emergente |
| Activación · fecha | La disponibilidad dice «sábado en la tarde», pero **no dice qué sábado**. La consola no ofrece preguntarlo, y el grupo preguntó «¿Cuándo es esto?» **después** de elegir el plan. | Sesión y audio «Feedback monitor 1» | Emergente; coincide con la tesis (el plan muere al buscar fecha y hora) |
| Activación · cierre | El **orden de los mensajes se rompió**: «Ya tenemos plan» salió antes de terminar la votación, después llegó «Van 2 de 3 votos» y al final «¡Hay plan!». | Sesión | Emergente |
| Interacción · asistencia | Quien organiza pidió **más tiempo para decir si puede ir** antes de que se cierre. El test pasó de «¡Hay plan!» a las preguntas de cierre en minutos. | Respuesta de quien organiza | Emergente |
| Continuidad · cierre | Las preguntas de feedback se escribieron **a mano** en el chat y **sin disposición a pagar**, que Katherine considera indispensable para la sustentación. | Sesión y notas P8c | Robusto (falta en el instrumento) |
| Voz | El monitor cambió «quinto amigo» por «cuarto amigo» (eran 3). **Resuelto el 22/11:** «tu +1 de confianza» (consola 2.7.3). | Sesión | Emergente |
| Stickers | El monitor tuvo que mandarse el sticker a su chat personal para usarlo: **el paquete no está cargado** en el número Sintonía. | Hilo | Robusto |
| Lo que funcionó | El recorrido de la consola se entiende; las opciones y la encuesta se enviaron; el grupo votó y se cerró un plan. | Audio «Feedback monitor 2»: «en general está súper bien» | Emergente |

## 2. Decisiones del 19/11 (reunión P8c) que enmarcan el trabajo

1. **Se aplazan las licencias y la automatización (n8n)** hasta tener más ciclos manuales con grupos de Cali. El Mago de Oz sirve para mapear dónde se cae el flujo antes de automatizarlo.
2. **Próxima prueba con un grupo de Cali**, con el equipo observando desde el chat de Sintonía sin intervenir. Juan José quiere probar la versión nueva el **viernes**.
3. **Disposición a pagar** dentro de las respuestas de los usuarios, para cerrar el modelo de negocio en dos semanas. Hay una pregunta abierta: qué pasa cuando **más de una persona del grupo paga**.
4. **Material POP**: impresos en cartón, volantes y pines este fin de semana. El QR lleva a una **landing pública** con «Crear mi grupo», «Ver el estado de mi grupo», cómo funciona (storyboard) y el video de Juan José.
5. Entrega final de la maestría: **4 de diciembre**.

## 3. Prioridad

| Ola | Para cuándo | Prompts |
|---|---|---|
| **A · Antes de la próxima prueba** (viernes) | Lo que hizo fallar el flujo con quien organiza | 1, 2, 3, 4, 5 · **hechos el 22/11** (consola y backend 2.8.0; ver CHANGELOG) |
| **B · Para la sustentación** (4/12) | Instrumento y modelo de negocio | 6, 7 |
| **C · Material POP y landing** (este fin de semana) | QR y página pública | 8 |
| **D · Protocolo de la prueba con Cali** | El día de la prueba | 9 |

Regla de versión: cada ola sube la versión de la consola y queda en el CHANGELOG. **Durante la prueba con Cali, la consola no cambia.**

---

## 4. Prompts

Cada prompt se usa en una sesión nueva de Claude con el repositorio `josebdiaz/sintonia-piloto`. Pégalo tal cual y, si quieres, agrega lo que haya cambiado.

### Prompt 0 · Contexto común (pegarlo antes de cualquiera de los demás)

```
Trabajas en el repositorio josebdiaz/sintonia-piloto (Sintonía, piloto de la maestría en Icesi).
Antes de tocar nada:
1. Lee CLAUDE.md, ESTADO.md y docs/prompts-mejoras-prueba-externa.md (la sección 1 tiene la evidencia).
2. Sigue el protocolo del home (docs/protocolo-home.md): al terminar, CHANGELOG → ESTADO.md §1 y §4 → python3 tools/home.py → --check en ✓.
3. QA: node backend/qa/qa_backend.js si tocas el backend; para la consola, prueba el recorrido completo en modo prueba.
4. Voz de Sintonía en todo texto para participantes: una idea por mensaje, conteos y nunca nombres de quien no respondió, máximo un emoji, nada inventado, español neutro.
5. Nada de claves, correos personales ni datos de participantes en el repo.
6. La evidencia es de una sola prueba en modo prueba (n = 1, Emergente): no la presentes como resultado del piloto.
Al final dime qué cambió, qué probaste y qué queda pendiente.
```

### Prompt 1 · Quien organiza no puede pasar por alto que debe compartir la invitación (ola A)

```
Problema (prueba externa, n = 1): quien organiza terminó la inscripción sin entender que tenía que mandar
el enlace de invitación a su parche. Pensó que el equipo ya tenía los números. El grupo se quedó en «1 de 3».

Haz esto en piloto/index.html (pantalla de éxito) y en lo que haga falta:
1. Convierte la pantalla de éxito en un paso pendiente, no en un «¡Listo!»:
   - Título: «Falta un paso: invita a tu parche».
   - Explica en una línea que Sintonía no tiene los números de su parche: cada persona acepta desde el enlace.
   - El botón principal es «Enviar la invitación por WhatsApp» (wa.me con el texto y el enlace), arriba y bien visible;
     «Copiar enlace» queda como secundario.
   - Muestra el avance «Ya cuentas tú: faltan N» y que puede volver a este enlace cuando quiera.
2. En la consola (piloto/mago.html), mientras el grupo esté reclutando:
   - El paso «Esperar que acepten» muestra un botón directo «Recordar a <quien organiza> que comparta la invitación»
     (usa el mensaje que ya arma primerMensaje).
   - Si pasan 2 h sin aceptaciones nuevas, el paso lo sugiere con un reloj.
3. Prueba: una inscripción en modo prueba en celular (390 px), con capturas de la pantalla de éxito antes y después.
Criterio de aceptación: en la pantalla de éxito, lo primero que se lee y se toca es enviar la invitación.
```

### Prompt 2 · Crear el grupo de WhatsApp sin chocar con la regla de contactos (ola A)

```
Problema (se repitió en dos pruebas): WhatsApp no deja agregar a un grupo a alguien que no está guardado
en los contactos del teléfono Sintonía. La 2.7.1 dice «agrega a quien organiza» y quitó «Invitar a…» para esa persona,
así que el monitor tuvo que armar su invitación a mano.

Haz esto en piloto/mago.html (bloque #crearGrupoWA, pasosDe y el texto de ayuda) y en docs/guias/onboarding-monitor.md:
1. Instrucción en 3 pasos:
   (a) «Guarda a <quien organiza> como contacto en el teléfono Sintonía», con «Copiar nombre y número»;
   (b) crea el grupo agregándola;
   (c) pega el enlace del grupo y manda «Invitar a…» a los demás.
2. Vuelve a mostrar «Invitar a <quien organiza>» como plan B («si no la pudiste agregar»), con el mismo texto que los demás.
3. Actualiza la nota de la 2.7.1 en la guía del monitor.
Criterio: el monitor puede crear el grupo sin escribir ningún mensaje a mano.
```

### Prompt 3 · Fecha concreta antes de votar el plan (ola A)

```
Problema: la disponibilidad decía «sábado en la tarde», pero no qué sábado. La consola no ofrece preguntarlo,
y el grupo preguntó «¿Cuándo es esto?» después de elegir el plan. Es justo el punto donde, según la tesis,
mueren los planes (encuesta propia, n = 76, Emergente: 89 % dice que el plan muere al buscar fecha y hora).

Haz esto:
1. Inscripción (piloto/index.html): además de días y franjas, pide «¿Qué fechas les sirven?» con botones de fechas
   de las próximas 2 semanas que coincidan con los días elegidos (por ejemplo, «sáb 29 nov», «sáb 6 dic»).
   Se guarda en disponibilidad, sin romper el formato actual (el backend lo lee en linea_base_grupo).
2. Consola:
   - /opciones dice la fecha concreta («para el sábado 29 de noviembre en la tarde»).
   - Si hay más de una fecha posible, la etapa Proponer agrega una segunda encuesta de WhatsApp: «¿Qué día?»,
     con las fechas.
   - El formulario de decisión precarga la fecha ganadora en los botones de día.
3. Gemini (proponer_ia) recibe la fecha concreta para respetar horarios del inventario.
4. QA: recorrido completo en modo prueba (flujo2) más un caso con dos fechas.
Criterio: ningún grupo llega a «¡Hay plan!» sin día y hora explícitos.
```

### Prompt 4 · Mensajes cortos y en orden (ola A)

```
Problemas en la sesión de prueba:
(1) Las opciones repiten la zona dos veces, traen rangos de precio muy amplios y un enlace de Maps de unos 300 caracteres.
(2) «Ya tenemos plan» salió antes de terminar la votación; después llegaron «Van 2 de 3 votos» y «¡Hay plan!».
(3) Quien organiza pidió más tiempo para decir si puede ir antes de que se cierre.

Haz esto en piloto/mago.html (TPL, opcionTxt, pasosDe):
1. opcionTxt:
   - Nombre corto del lugar.
   - Zona una sola vez.
   - «Aprox. $X por persona» con un solo valor: el punto medio o el mínimo, redondeado a miles. Decide cuál y documéntalo.
   - Mapa en una línea aparte con el enlace más corto que abra la ficha. Pruébalo en un teléfono real antes de cambiarlo.
   - Máximo 4 líneas por opción.
2. Orden:
   - Ningún mensaje de cierre o celebración se puede copiar mientras el plan esté votando (mismo bloqueo que con los [corchetes]).
   - /recordatorio se oculta cuando ya votaron todos.
3. Asistencia: /confirmado y /evento dicen hasta cuándo marcar si van (por ejemplo, «hasta mañana a las 6:00 p. m.»).
   La consola no ofrece el día del plan ni la encuesta de cierre antes de ese plazo, salvo en modo prueba.
4. Marca (resuelta el 22/11, consola 2.7.3): Sintonía es «tu +1 de confianza» (a una persona) o «su +1 de confianza»
   (al grupo); constantes MARCA_TU y MARCA_SU. Úsala en cualquier texto nuevo.
Criterio: el chat de una prueba completa se lee en orden, sin mensajes de más.
```

### Prompt 5 · Avisos al equipo y preferencias claras (ola A)

```
Problemas:
(1) El monitor no recibe el correo de inscripción, porque los avisos solo van al correo del equipo configurado.
(2) No hay aviso cuando acepta cada persona.
(3) Quien organiza llenó las preferencias del parche, no las suyas, e incluyó información de salud de terceros.

Haz esto:
1. Backend (Codigo_Piloto.gs):
   - Aviso opcional por cada aceptación nueva («Aceptó 1 persona más en <grupo>: 2 de 3»), sin nombres ni números.
   - Que se pueda apagar con una propiedad.
   - Documenta en backend/README.md que NOTIFICAR_A acepta varios correos separados por coma, y que hay que
     agregar el del monitor en las propiedades del script, no en el código.
   - QA backend.
2. Inscripción:
   - El paso 2 se llama «¿Qué le gusta a tu parche?» y aclara que es una descripción del grupo, aproximada.
   - La pista sobre datos sensibles pasa arriba del campo, con un ejemplo de cómo decirlo sin detalle
     («hay una restricción de alcohol»).
3. Consola: la lista de grupos muestra «Aceptó alguien más» (ya existe) también como aviso que no se pierde (badge en la fila).
Criterio: el monitor se entera de cada aceptación sin recargar ni revisar el correo del equipo.
```

### Prompt 6 · Encuesta de cierre con disposición a pagar y feedback abierto (ola B)

```
Contexto:
- Las preguntas de feedback se escribieron a mano en el chat y faltó la disposición a pagar.
- La reunión del 19/11 acordó medir la disposición a pagar con las respuestas de los usuarios y resolver qué pasa
  cuando paga más de una persona del grupo.
- Las métricas principales (SEQ y SUS) están validadas con Néstor: no las cambies.

Haz esto en piloto/retro.html y en el backend:
1. Revisa qué recibe hoy cada rol:
   - Quien organiza: 4 preguntas de precio (Van Westendorp).
   - Miembros: sin preguntas de precio.
   Deja la tabla en ESTADO.md.
2. Para los miembros, agrega una sola pregunta corta y opcional: «Si Sintonía costara, ¿quién debería pagarlo?»
   Opciones: quien organiza · lo dividimos entre todos · yo pagaría mi parte · no pagaría.
   Puede ir con un precio de referencia que defina Katherine.
3. Agrega 2 preguntas abiertas, opcionales y al final: «¿Qué corregirías?» y «¿Qué te sobró o qué te faltó?».
   Invita a responder con nota de voz al número de Sintonía.
4. Panel: resume las respuestas por condición, con n.
5. Antes de publicar, deja el cambio en docs/ para que Néstor lo valide, porque cambia el instrumento.
Criterio: la encuesta sigue tomando unos 4 minutos y responde «¿cuánto?» y «¿a quién le cobramos?».
```

### Prompt 7 · Modelo de negocio con varios pagadores (ola B · trabajo de Katherine con apoyo)

```
Con la evidencia del Proyecto (encuestas con n y estatus; hipótesis de 10.000 COP/mes que paga quien organiza;
374 mil organizadores en Cali y meta del 1 %, ambas hipótesis del equipo) y los datos de disposición a pagar
que deje el prompt 6:
1. Arma 3 escenarios de cobro:
   - Paga quien organiza.
   - El grupo divide la suscripción.
   - Cada persona tiene su propia suscripción y usa Sintonía en varios grupos.
   Para cada uno: ingreso por grupo, masa crítica de punto de equilibrio y riesgos (incluidas las 5 dimensiones de riesgo).
2. Identifica qué se puede afirmar hoy y qué queda [Por validar en piloto].
3. Cierra con implicaciones para el JTBD de quien organiza, la matriz de oportunidades y la siguiente fase.
Formato: tablas y prosa breve, para la sustentación del 4/12. Pregunta el formato final antes de armarlo.
```

### Prompt 8 · Landing pública para el QR del material POP (ola C)

```
Contexto (19/11): el QR de los impresos lleva a sintonia.my. Ahí tiene que haber «Crear mi grupo»,
«Ver el estado de mi grupo», cómo funciona (storyboard) y el video de Juan José.
Hoy la portada dice «Algo se está armando» y el menú del equipo está detrás del código secreto (↑↑↓↓←→←→);
eso se conserva.

Haz esto en index.html (fuera de los marcadores del home generado) y en docs/protocolo-home.md:
1. Portada pública en celular primero. Debajo del claim:
   - «Crear mi grupo» → piloto/index.html?exp=E1&origen=qr.
   - «Ver el estado de mi grupo»: abre el enlace personal guardado en el navegador si existe;
     si no, explica que está en el mensaje de Sintonía.
   - «Cómo funciona», con las 8 viñetas de docs/storyboard-m2/.
   - El video (embebido liviano o enlace).
2. Un `origen` distinto por pieza impresa (qr-volante, qr-carton, qr-pin) para medir de dónde llegan las inscripciones;
   el backend ya guarda `origen`.
3. Genera los QR (SVG) en docs/pop/ con su URL, listos para imprimir, y una hoja con los tres.
4. El código secreto y el home generado siguen funcionando (tools/qa-home.js en ✓; tools/home.py --check en ✓).
5. Privacidad: nada que identifique a un participante en la página pública.
Criterio: alguien que escanea el QR sin contexto entiende qué es Sintonía y crea su grupo en menos de 2 minutos.
```

### Prompt 9 · Guion de la próxima prueba con un grupo de Cali (ola D)

```
Arma docs/guias/prueba-cali.md (y su entrada en el control de guías) con:
1. Antes:
   - Versión congelada de la consola y del backend.
   - Grupo de Cali de 3 a 6 personas, con quien organiza externa al equipo.
   - Modo prueba o piloto: decide y justifica.
   - Monitor con la guía actualizada.
   - Stickers cargados.
   - NOTIFICAR_A con el correo del monitor.
2. Paso 0, quién hace qué:
   - El equipo le manda a quien organiza el enlace de inscripción.
   - Quien organiza comparte la invitación.
   - El mago crea el grupo cuando aceptan todos.
3. Durante:
   - El equipo observa sin escribir en el grupo.
   - Qué anotar por momento (activación, interacción, continuidad), con hora.
   - Mago in / Mago off.
4. Después:
   - Encuesta de cierre (con la disposición a pagar del prompt 6).
   - Encuesta del mago.
   - Nota de voz del monitor.
   - Tabla de hallazgos Robusto / Emergente / Pendiente con n, comparada con esta prueba
     (docs/prompts-mejoras-prueba-externa.md, sección 1).
5. Criterios para pasar a la automatización: qué tiene que dejar de fallar en la prueba manual (decisión del 19/11).
Cierra con implicaciones para el JTBD, la matriz de oportunidades y la siguiente fase.
```

---

## 5. Lo que no se toca en esta ronda

- **n8n y licencias** quedan aplazados (decisión del 19/11). Lo que se aprenda en estas pruebas manuales actualiza `ESTADO.md` §3.1 para cuando se retome.
- **SEQ y SUS** no cambian: las validó Néstor.
- La **consola** no se rediseña. Son ajustes puntuales sobre la 2.7.x, con su versión y su CHANGELOG.

## 6. Implicaciones

- **JTBD de quien organiza:** «Cuando invito a mi parche, quiero saber exactamente qué me toca y que Sintonía haga el resto». Lo que falló no fue la propuesta de valor, sino el traspaso del paso «invitar» (prompts 1 y 5).
- **JTBD del mago:** «Quiero que la consola me diga qué mandar y a quién desde el primer minuto» (prompts 2 y 9).
- **Matriz de oportunidades:** la fecha concreta (prompt 3) refuerza el white space de «cerrar», que ningún competidor de la tabla II.13 resuelve dentro del chat.
- **Siguiente fase:** con 2 pruebas manuales comparables (esta y la de Cali), el equipo tendrá la base para decidir la automatización y la compra de licencias.
