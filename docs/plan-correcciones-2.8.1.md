# Plan de acción · correcciones de la auditoría E2E (versión 2.8.1)

**Fecha:** 22 de noviembre de 2026.
**Origen:** auditoría de punta a punta de la consola y el backend 2.8.0. Fue una prueba simulada en modo prueba: se usó el código real sobre una hoja simulada, sin WhatsApp real ni personas reales (n = 0). Resultado: 48 revisiones bien, 4 hallazgos graves, 8 medios y 2 bajos.
**Estado (22/11):** G1–G4, M5–M7, M11 y B1 hechos en la consola y el backend 2.8.1 (ver CHANGELOG). Falta desplegar el backend y seguir el calendario desde el martes. Decisión del 22/11: «no toma alcohol» es una restricción del plan, no un dato de salud.
**Meta:** que la prueba con el grupo de Cali del viernes 27 corra sobre una versión sin los hallazgos graves.
**Regla vigente:** durante la prueba con Cali, la consola no cambia. Todo lo de este plan entra antes del jueves 26 o queda para después.

---

## 1. Qué se corrige y cómo

### Hallazgos graves (entran sí o sí en la 2.8.1)

| # | Problema | Causa en el código | Solución | Criterio de aceptación |
|---|---|---|---|---|
| G1 | El plazo para confirmar puede quedar en el pasado (con el plan en 90 min, decía «hasta la 1:32 p. m.», una hora ya vencida) | `plazoDe()` en `mago.html`: si la víspera queda a menos de 3 h, usa «encuentro − 3 h» y no revisa que esa hora sea futura | Reglas por distancia al encuentro: **más de 24 h** → la víspera a las 6:00 p. m.; **entre 4 y 24 h** → 2 h antes del encuentro; **menos de 4 h** → sin hora: «marquen ahora en el evento si van». La consola no bloquea /hoy ni /salida cuando no hay plazo | Pruebas con el plan en 3 días, en 10 h y en 90 min: el plazo nunca queda en el pasado y en el último caso el texto no trae hora |
| G2 | /confirmado contradice a la opción votada: precio en rango, título cortado a media palabra («…del barri»), zona dos veces | La ola A acortó `opcionTxt` y dejó /confirmado, /evento y /hoy con `d.plan` (título completo, que el backend corta a 60 caracteres), `d.lugar` (zona por parada) y `presupuesto_aprox` tal cual | Una sola fuente para los tres mensajes. Un nuevo `resumenOpcion(o)` devuelve el título corto, el lugar con la zona una vez y el precio con `precioUno`. Lo usan `opcionTxt`, /confirmado, /evento y /hoy. Backend: el título de Gemini se corta en la última palabra que cabe en 30 caracteres, no a media palabra | En la transcripción de una prueba completa, título, lugar y precio de la opción ganadora son idénticos en /opcion_N, /confirmado y /evento |
| G3 | Los datos de salud de terceros llegan a la hoja («Ana es diabética…» se guardó tal cual) | `limpiar_()` solo borra teléfonos, correos y documentos | **Dos capas.** (a) Inscripción y unirse: si el texto menciona salud, religión, política o sexualidad, la persona no avanza sin reescribirlo sin detalle. El aviso propone una frase genérica («hay una restricción de comida»). (b) Backend: una lista cerrada de términos sensibles; la frase que los contenga se guarda como «[dato sensible omitido]» y la fila queda marcada para el equipo. La lista se revisa con Néstor | Con «Ana es diabética y no toma», el formulario se detiene y la hoja nunca recibe «diabética», ni siquiera saltándose el formulario con una llamada directa al backend |
| G4 | La encuesta del mago se pierde: deja de pedirse cuando terminan las encuestas de cierre o se crea el plan 2 | La consola solo la ofrece mientras el paso actual es la encuesta de cierre del último plan, y «ya respondida» se guarda solo en el navegador (`localStorage`) | (a) Backend: la vista del mago trae por plan si ya hay respuesta en `pulso_mago`. (b) Consola: «Responder tu encuesta como mago» pasa a ser **un paso del recorrido** después de la encuesta de cierre de cada plan; el plan no queda completo hasta responderla. Cualquier plan cerrado sin ella muestra el aviso, aunque ya exista el plan 2 | Cerrar el plan 1, completar las 3 encuestas y crear el plan 2: el aviso del plan 1 sigue visible hasta responderla, también en otro navegador |

### Hallazgos medios que entran en la 2.8.1 (baratos y del mismo código)

| # | Problema | Solución | Criterio |
|---|---|---|---|
| M5 | Doble punto: «6:00 p. m..» | No agregar punto final cuando el texto termina en «p. m.» o «a. m.» | Ningún mensaje termina en «..» |
| M6 | La página de unirse tiene la pista vieja de datos sensibles | El mismo texto y la misma revisión que en la inscripción (G3a) | La inscripción y unirse dicen lo mismo |
| M7 | La pestaña Plan no muestra las fechas que marcó quien organiza | «Cuándo pueden» usa `cuandoTxt()` (las mismas fechas que /opciones) | Con fechas marcadas, la pestaña Plan las muestra |
| M11 | «Van 1 de 3 en tu parche» | Singular y plural: «Ya aceptó 1 de 3», «Ya aceptaron 2 de 3» | Revisar con 1 y con 2 aceptaciones |
| B1 | /recordatorio muestra «[n]» en la cola hasta que se anotan los votos | Sin votos anotados, el recordatorio no trae conteo: «¿Cuál les suena más? Pueden votar en la encuesta de arriba» | Ningún mensaje de la cola muestra «[n]» mientras se vota |

### Hallazgos que quedan fuera de la 2.8.1, con su destino

| # | Problema | Por qué espera | Destino |
|---|---|---|---|
| M8 | La disposición a pagar no guarda el plan ni evita duplicados | Cambia la hoja `wtp` (columna nueva, `probarMontaje`) y la va a rediseñar el prompt 6 | **Ola B · prompt 6**: `plan_id` y una respuesta por persona y plan |
| M9 | La encuesta de cierre tiene 26 campos y promete «4 minutos» | Primero hay que medirla; recortarla sin dato rompe la comparación con lo ya respondido | **Ensayo del miércoles**: cronometrar a 2 personas. Si pasa de 5 min, el mensaje dice el tiempo real y el prompt 6 recorta |
| M10 | En la consola desde el celular, la acción principal queda debajo de la pantalla (a 1.047 px) | Es un cambio de maqueta; el monitor opera en computador | **2.9, después de la prueba con Cali**: en pantallas angostas, el recorrido va plegado debajo del paso |
| M12 | «Entre semana» más «Viernes» muestra 10 botones de fecha | El tope de 4 funciona y avisa | **2.9**: mostrar solo los 8 más cercanos |
| B2 | El enlace de Maps sube a 118 caracteres cuando la dirección tiene «#» | Depende de la prueba en un teléfono real (pendiente desde la 2.8.0) | **Martes 24**: probarlo en el teléfono y decidir si se quita la dirección y queda solo el nombre del lugar |

---

## 2. Calendario

| Día | Qué | Quién | Sale |
|---|---|---|---|
| **Lun 23** | Implementar G1–G4, M5–M7, M11 y B1. QA automática: backend, recorrido completo, ola A y la auditoría E2E con casos nuevos (plazos a 3 días, 10 h y 90 min; frase sensible; encuesta del mago con el plan 2 ya creado) | Claude | Consola y backend 2.8.1 en el repo, con el `.gs` para desplegar |
| **Mar 24** | Desplegar el backend 2.8.1. Probar en un teléfono real: el enlace de Maps de una opción, la pantalla «Falta un paso» y la invitación por WhatsApp. Revisar con Néstor la lista de términos sensibles (G3b) | José | Backend en vivo y decisión sobre el enlace de Maps |
| **Mié 25** | **Ensayo general con WhatsApp real**, en modo prueba: el equipo hace de parche y Juan José opera. Cronometrar la encuesta de cierre. Limpiar de la hoja las filas de prueba con datos sensibles de la prueba externa | Equipo y Juan José | Lista de lo que falló en el ensayo; tiempo real de la encuesta |
| **Jue 26** | Corregir solo lo que bloquee el ensayo. **Congelar la consola**: crear los tags `piloto/v2.8.1` y `backend/v2.8.1` | José | Versión congelada para el viernes |
| **Vie 27** | Prueba con el grupo de Cali. La consola no cambia | Equipo | — |

**Si el lunes no alcanza:** G1 y G2 son lo mínimo, porque salen en mensajes que ve el grupo. G4 puede resolverse a mano: Juan José responde su encuesta al cerrar cada plan, con un recordatorio en el guion de la prueba (prompt 9). G3a (el aviso en el formulario) va antes que G3b (el filtro en el backend).

---

## 3. Riesgos del plan

| Riesgo | Mitigación |
|---|---|
| El filtro de términos sensibles (G3b) borra frases inocentes («no toma alcohol» es una preferencia válida) | La lista va con Néstor y empieza corta (diagnósticos y condiciones de salud, religión, política, orientación sexual). El alcohol no entra, porque es una restricción del plan. El equipo ve la marca en la consola y puede pedir la reescritura |
| Cambiar /confirmado rompe pruebas que ya pasaban | El recorrido completo (57 casos) corre antes de publicar; se ajustan las expectativas que cambien, no se borran |
| El backend 2.8.1 se despliega tarde | La consola 2.8.1 tiene que funcionar con el backend 2.8.0. Lo único que depende del backend nuevo es el filtro G3b y la marca de la encuesta del mago (G4a); sin el backend, G4 sigue funcionando con la marca en el navegador |

---

## 4. Implicaciones

- **Activación:** G1 y G2 protegen el momento en que el plan se concreta («¡Hay plan!»). Es justo donde la tesis dice que mueren los planes. Si el mensaje de cierre se contradice o trae una hora vencida, el grupo vuelve a preguntar en el chat.
- **Medición:** G4 protege la comparación E1 / E1.5 (SUS y carga de trabajo de quien opera). M9 protege la tasa de respuesta de la encuesta de cierre.
- **Ética y riesgos:** G3 cierra un riesgo de **privacidad** (dato sensible de un tercero sin su consentimiento) y conviene contarlo en la sustentación como hallazgo de la prueba externa y medida tomada.
- **Siguiente fase:** M8 pasa a la ola B (disposición a pagar), y M10 y M12 a la 2.9.
