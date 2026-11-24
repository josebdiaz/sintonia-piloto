# Guion · Prueba con un grupo de Cali (viernes 27 de noviembre)

**Versión:** v1, 22 de noviembre de 2026. Consola y backend **2.8.1**, congelados el jueves 26.
**Para:** José, Katherine y Juan José (monitor y mago de E1).
**Origen:** decisiones del 19/11 (reunión P8c) y aprendizajes de la prueba externa (`docs/prompts-mejoras-prueba-externa.md`, sección 1).
**Qué se prueba:** si un parche de Cali que no conoce el proyecto pasa de «hay que vernos» a un plan con día y hora, y llega, con Sintonía en WhatsApp y una persona operando detrás (E1 · WhatsApp + mago). El equipo observa y no interviene.

> **Lectura con cuidado.** Es un solo grupo (n = 1). Lo que salga es **Emergente** y sirve para comparar con la prueba externa, que también fue n = 1. No son resultados del piloto, y las metas del equipo (60 % de llegadas; la mitad de los grupos con intención de repetir) no se evalúan con un grupo.

---

## 0. Decisiones previas

### 0.1 ¿Modo prueba o modo piloto? → **Modo piloto** (recomendado)

| | Modo prueba | Modo piloto |
|---|---|---|
| Relojes (recordatorio a las 2 h, plazo para confirmar, salida 2 h antes) | No existen: todo se puede hacer de inmediato | Funcionan como con un grupo real |
| Encuesta de cierre | Se abre antes del encuentro | Se abre después del encuentro |
| Panel y análisis | No cuenta | Cuenta como grupo de E1 |
| Lo que prueba | Que la consola funcione | Que el **servicio** funcione con tiempos reales |

**Por qué modo piloto:**
- Lo que falló en la prueba externa tiene que ver con el tiempo: la invitación se quedó en «1 de 3», nadie preguntó la fecha, se pidió más plazo para confirmar. En modo prueba no se ve nada de eso.
- Si el grupo cumple el perfil (Cali, mayores de 18, quien organiza externa al equipo), sus datos sirven para la sustentación.

**Condición:** el jueves 26, después del ensayo, se corre **«Empezar piloto real»** (pestaña Ajustes). Limpia los grupos de prueba y conserva el inventario, la bitácora y los minutos del mago (`operacion`, `sesiones`), con un respaldo automático. Si no se corre, el grupo de Cali queda mezclado con los ensayos. **No volver a correrlo después del viernes**, porque borraría al grupo de Cali.

Si el grupo **no cumple** el perfil (por ejemplo, quien organiza es del equipo), se hace en modo prueba y se dice así en el informe.

### 0.2 ¿Qué encuesta de cierre se usa?

La encuesta de hoy pide disposición a pagar **solo a quien organiza**. El prompt 6 (disposición a pagar también para los miembros, ligada al plan) **no está implementado**.

- Si entra antes del congelamiento del jueves, se usa la nueva.
- Si no, **se usa la actual** y el informe lo dice. Nada cambia después del jueves: cambiar la encuesta en medio de la prueba hace que las respuestas no sean comparables.

**Responsable:** Katherine (decisión) y José. Fecha límite: miércoles 25.

### 0.3 ¿Cuándo es el plan?

Para cerrar el plan 1 y su encuesta antes de la entrega del **4 de diciembre**, el encuentro tiene que ser **a más tardar el domingo 30 de noviembre**. En la inscripción, quien organiza elige fechas de las próximas 2 semanas. Se le pide marcar el sábado 29 o el domingo 30.

**Consecuencia:** el plan 2 (continuidad) no alcanza antes de la entrega. De continuidad solo habrá intención: la pregunta «¿Repetimos con este parche?» (Nivel 2). El plan 2 se puede hacer después y reportarlo como anexo.

---

## 1. Antes (lista de verificación, hasta el jueves 26)

| # | Qué | Cómo se verifica | Quién | Estado |
|---|---|---|---|---|
| 1 | Consola y backend congelados | sintonia.my muestra 2.13.0. Tags `piloto/v2.13.0` y `backend/v2.9.2` creados | José | Frontend publicado 23/11 · backend 2.9.2 por pegar · tags el jueves 26 |
| 2 | Grupo de Cali de 3 a 6 personas, mayores de 18, con quien organiza **externa al equipo** | Nombre del grupo y fecha tentativa confirmados con quien organiza | Equipo | [Por confirmar] |
| 3 | Modo de la prueba decidido (0.1) | Anotado en este guion | Equipo | Recomendado: piloto |
| 4 | «Empezar piloto real» corrido después del ensayo | La consola muestra 0 grupos piloto; existe el respaldo en Drive | José | Jueves 26 |
| 5 | Monitor con la guía al día | Juan José leyó la v1.3 de `docs/guias/onboarding-monitor.md` (consola 2.13.0) e hizo el ensayo | Juan José | Miércoles 25 |
| 6 | Stickers cargados en el número Sintonía | Juan José manda uno desde ese número sin reenviárselo antes | José | Pendiente |
| 7 | `NOTIFICAR_A` con el correo del monitor | Al monitor le llegó el correo de prueba de `probarMontaje()` o el de una aceptación en el ensayo | José | Hecho 22/11 |
| 8 | Aviso de privacidad v2 publicado | `piloto/aviso.html` muestra la v2-2026-11 y la propiedad `AVISO_VERSION` del backend dice lo mismo | Equipo | Publicado 23/11 (aprobado por Néstor) · falta la propiedad |
| 9 | Inventario: ronda de llamadas del fin de semana | Los lugares que pueden salir el 29 y el 30 de noviembre están en «activo» y abren ese día | Katherine | Jueves 26 |
| 10 | Enlace de Maps probado en un teléfono real | Abre la ficha del lugar correcto | José | Martes 24 |
| 11 | Ensayo con WhatsApp real | Recorrido completo en modo prueba; la encuesta de cierre cronometrada con 2 personas | Equipo | Miércoles 25 |
| 12 | Plantilla de observación lista (sección 3.2) | Una copia por observador | Katherine | Jueves 26 |

---

## 2. Paso 0 · Quién manda qué

La causa principal de la prueba externa fue que nadie sabía quién le mandaba qué a quién. Este es el orden, sin excepciones:

| # | Quién | A quién | Qué | Desde dónde |
|---|---|---|---|---|
| 1 | Juan José | Quien organiza | Mensaje de bienvenida con el enlace de inscripción | Consola → «Inscribir un grupo nuevo» → «Copiar mensaje». Se envía desde el **número Sintonía** |
| 2 | Quien organiza | Su parche | La invitación para aceptar | La pantalla «Falta un paso» → «Enviar la invitación por WhatsApp». Desde **su propio WhatsApp** |
| 3 | Cada persona | — | Acepta desde su enlace | Su celular |
| 4 | Juan José | Quien organiza | Recordatorio, solo si en 2 h no acepta nadie más | Botón «Recordar a … que comparta la invitación» |
| 5 | Juan José | — | Cuando aceptan todos: cierra el reclutamiento, guarda a quien organiza como contacto, crea el grupo con ella y pega el enlace del grupo | Consola → Grupo (3 pasos) |
| 6 | Juan José | Los demás | Invitación al grupo de WhatsApp | «Invitar a …» (y «Invitar a quien organiza» si no se pudo agregar) |
| 7 | Juan José | El grupo | /ingreso, y desde ahí lo que diga «Lo que toca ahora» | Consola |

**Regla para el equipo:** José y Katherine no le escriben a quien organiza ni al grupo, ni siquiera para destrabar. Si algo se traba, se anota y lo resuelve el mago con lo que tiene la consola. La única excepción es una emergencia o algo que ponga en riesgo a una persona (escribir HUMANO o SALIR, o llamar al 123).

---

## 3. Durante

### 3.1 Roles

| Rol | Quién | Qué hace | Qué no hace |
|---|---|---|---|
| Mago | Juan José | Opera la consola, envía cada mensaje desde el número Sintonía, registra votos, llegadas y en casa | No improvisa textos si la consola tiene uno; si lo edita, lo anota |
| Observador 1 | José | Mira el chat del grupo (WhatsApp Web del número Sintonía en modo solo lectura, o junto al mago) y llena la plantilla | No escribe en el grupo ni en los chats individuales |
| Observador 2 | Katherine | Igual, con foco en quien organiza y en la disposición a pagar | Igual |

### 3.2 Qué anotar, por momento y con hora

Una fila por evento, con la hora exacta. Son hechos, no interpretaciones; las interpretaciones van en la última columna.

| Momento | Qué observar | Señal de que falló | Dato de la consola que lo confirma |
|---|---|---|---|
| **Antes · inscripción** | Hora del mensaje de bienvenida; hora de la inscripción; si quien organiza reenvía la invitación sin ayuda | Se queda en «1 de N» más de 2 h; alguien pregunta «¿y ahora qué?» | Hora de cada aceptación (correos) |
| **Antes · grupo** | Cuánto tarda en armarse el grupo de WhatsApp; si hizo falta el plan B | El mago tuvo que escribir algún mensaje a mano | Paso «Crear el grupo» marcado |
| **Activación · opciones** | Si alguien pregunta «¿cuándo es?», «¿cuánto cuesta?» o «¿dónde queda?» después de las opciones; si abren el mapa | Cualquiera de esas preguntas | Votos por opción y «Ninguna me sirve» |
| **Activación · decisión** | Tiempo de la primera opción a «¡Hay plan!»; cuántas rondas; si el orden de los mensajes se lee bien | Un mensaje de cierre antes de terminar la votación; una ronda 2 por fecha | Hoja `decisiones` |
| **Interacción · confirmación** | Cuántos marcan «Voy» en el evento y antes de qué hora; si alguien pide más plazo | Confirmaciones después del plazo | Llegadas y tiempo: «Se apuntó» |
| **Interacción · el día** | Si sirvieron la salida sugerida y el checkpoint; quién llegó y a qué hora (conteos, nunca nombres en el informe) | Alguien no encuentra el lugar o llega tarde por la hora sugerida | «Llegó» y «En casa» |
| **Continuidad · cierre** | Cuántos responden la encuesta y en cuánto tiempo; qué dice quien organiza sobre el precio; si alguien propone repetir | Menos de la mitad responde en 24 h | `retro`, `usabilidad` y `wtp` |

**Plantilla** (copiar en una hoja o en papel):

| Hora | Momento | Qué pasó (hecho) | Quién (rol: organiza, miembro, mago) | Lo confirma la consola | Lectura del observador |
|---|---|---|---|---|---|
| | | | | | |

### 3.3 Mago in / Mago off

- **«Mago in»** antes de mandar la bienvenida, y **«Mago off»** cada vez que el mago deja de atender, aunque sea para esperar respuestas. La consola avisa cuando hay novedades.
- La sesión se mueve sola al plan que se seleccione. A las 4 h abiertas se cierra sin minutos: hay que registrarlos a mano en «Llegadas y tiempo».
- Los minutos de esta prueba son la primera medida real de **minutos humanos por plan** en E1. Sin «Mago in», ese trabajo no cuenta.

---

## 4. Después

| # | Qué | Cuándo | Quién |
|---|---|---|---|
| 1 | **Encuesta de cierre** a cada persona, por privado, desde «Lo que toca ahora» (la que se haya decidido en 0.2) | Al terminar el plan; si fue de noche, al día siguiente a las 10:00 | Juan José |
| 2 | **Encuesta del mago** (SUS y carga de trabajo). Desde la 2.8.1 es un paso del recorrido; el plan no queda completo sin ella | El mismo día | Juan José |
| 3 | **Nota de voz del monitor**, de 3 a 5 minutos, con 4 preguntas: ¿qué fue lo más difícil?, ¿en qué momento dudaste qué hacer?, ¿qué escribiste a mano y por qué?, ¿qué le cambiarías a la consola? | El mismo día | Juan José |
| 4 | Pasar las plantillas de observación a una sola tabla, con las horas | Al día siguiente | Katherine |
| 5 | **Tabla de hallazgos** (abajo), comparada con la prueba externa | Lunes 30 | Equipo |
| 6 | Actualizar `ESTADO.md` §4.2 y el CHANGELOG | Lunes 30 | José |

### 4.1 Tabla de hallazgos (llenar después de la prueba)

Cada hallazgo de la prueba externa se revisa en el grupo de Cali. Si se repite en las dos pruebas, sube de Emergente a «se repitió (n = 2)». Si desaparece después de un cambio de la 2.8.x, se anota con qué versión.

| Hallazgo de la prueba externa (n = 1) | Cambio que lo atacó | Prueba con Cali (n = 1) | Estatus |
|---|---|---|---|
| Quien organiza no entendió que debía compartir la invitación | 2.8.0: «Falta un paso» y «Recordar a …» | [Dato pendiente] | Emergente → ¿? |
| WhatsApp no deja agregar a quien no está en los contactos | 2.8.0: crear el grupo en 3 pasos y plan B | [Dato pendiente] | Robusto (restricción de WhatsApp) |
| No decía qué sábado | 2.8.0: fechas concretas y «¿Qué día?» | [Dato pendiente] | Emergente → ¿? |
| Mensajes en desorden («Ya tenemos plan» antes de terminar la votación) | 2.8.0: bloqueo de los mensajes de cierre | [Dato pendiente] | Emergente → ¿? |
| Pidieron más plazo para confirmar | 2.8.0 y 2.8.1: plazo explícito | [Dato pendiente] | Emergente → ¿? |
| Opciones largas y repetidas | 2.8.0 y 2.8.1: 4 líneas y un solo precio, iguales en /confirmado | [Dato pendiente] | Emergente → ¿? |
| Preferencias de todo el parche, con datos sensibles de terceros | 2.8.0 y 2.8.1: descripción del grupo; aviso y omisión de datos sensibles | [Dato pendiente] | Emergente → ¿? |
| El monitor no recibía los avisos | 2.8.0: aviso por cada aceptación a `NOTIFICAR_A` | [Dato pendiente] | Robusto (comportamiento del sistema) |
| Faltaba la disposición a pagar en el cierre | Prompt 6 (si entra antes del jueves) | [Dato pendiente] | Pendiente |
| **Nuevos en la prueba con Cali** | — | [Dato pendiente] | — |

---

## 5. Criterios para pasar a la automatización (E1.5 con n8n)

El 19/11 se decidió aplazar las licencias y n8n hasta que las pruebas manuales dejen de fallar en los mismos puntos. Estos son los **criterios del equipo** (metas, no resultados). Se fijan **antes** de ver los datos de Cali y no se mueven después.

| # | Criterio | Cómo se mide | Por qué importa para automatizar |
|---|---|---|---|
| A1 | Quien organiza comparte la invitación **sin ayuda del equipo** | Ninguna intervención del equipo en el Paso 0; a lo sumo un «Recordar a …» | El motor no puede improvisar |
| A2 | El mago **no escribe mensajes a mano**: todo sale de la consola, como mucho con un ajuste de tono | Número de mensajes escritos o editados a mano (plantilla y nota de voz) | Lo que el mago escribe a mano es lo que el motor no sabe hacer |
| A3 | El plan cierra con **día y hora sin preguntas de vuelta** («¿cuándo es?», «¿dónde?») | Conteo en la plantilla | Es el momento donde mueren los planes (la tesis) |
| A4 | Los mensajes salen **en orden** y ninguno sobra | Revisión del chat completo | Un motor que manda en desorden amplifica el error |
| A5 | Cada paso de la consola tiene **una sola acción clara** (sin «¿y ahora qué hago?») | Nota de voz y medición por etapa | Define el flujo que se traslada a n8n |
| A6 | **Minutos humanos por plan medidos** con «Mago in / Mago off», con su desglose por etapa | Hojas `operacion` y `medicion_consola` | Es la línea base contra la que E1.5 se compara |

**Regla:** si A1–A4 se cumplen en la prueba con Cali y A6 quedó medido, el equipo puede retomar n8n (pendientes N1–N11, B1, B5, I5 y C14 de `ESTADO.md`). Si falla alguno de A1–A4, se corrige en la consola y se hace **otra prueba manual** antes de automatizar. Con n = 1 por prueba, cumplir los criterios **no valida** el servicio. Solo dice que el flujo manual está lo bastante estable para copiarlo en un motor.

---

## 6. Riesgos de esta prueba

| Dimensión | Riesgo | Mitigación |
|---|---|---|
| Privacidad | Datos sensibles en las preferencias; observadores que leen el chat del grupo | Aviso y omisión de datos sensibles (2.8.1); el informe usa conteos y roles, nunca nombres; el aviso v2 publicado antes |
| Exclusión | El grupo sale de las redes del equipo; los lugares favorecen ciertas zonas | Se reporta como sesgo; se anota la zona de quien organiza y la del plan |
| Seguridad | Lugar cerrado o mal ubicado; alguien que no llega | Ronda de llamadas del jueves; checkpoint y /no_llega; 123 ante emergencias; SALIR en cualquier momento |
| Sesgo metodológico | n = 1; quien organiza sabe que es una prueba; el equipo observa | Se dice en el informe; el equipo no interviene; la comparación es descriptiva |
| Impacto emocional | Presión por confirmar; incomodidad si no se concreta el plan | Un solo recordatorio; plazo claro y amable; si el plan se cae, se agradece y no se insiste |

---

## 7. Implicaciones

- **JTBD de quien organiza:** «Cuando invito a mi parche, quiero saber qué me toca y que Sintonía haga el resto». La prueba con Cali dice si «Falta un paso» resolvió el traspaso del paso «invitar» (A1).
- **JTBD del mago:** «Quiero que la consola me diga qué mandar y a quién desde el primer minuto» (A2 y A5).
- **Matriz de oportunidades:** si A3 se cumple, hay una segunda observación (n = 2 en total, todavía Emergente) de que cerrar día y hora dentro del chat es el white space frente a encuestas, calendarios y apps de planes (tabla II.13).
- **Siguiente fase:** los criterios A1–A6 deciden si se retoma la automatización (E1.5) o se hace otra prueba manual. La continuidad (plan 2) queda para después de la entrega del 4/12.
