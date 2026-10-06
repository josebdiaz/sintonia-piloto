> **Copia en el repositorio · Vigente para el piloto. La parte de producción (H2) sigue pendiente de revisión legal y del aval del comité.**

# Guía de implementación con cumplimiento legal: datos personales en Sintonía

*Aplica al Mago de Oz (H1) y a la versión de producción (H2). Responde a la tensión 3 del pivote v2.1: el perfil del usuario y el uso de redes sociales.*

> **Aviso.** Esta guía se armó con la normativa vigente y con fuentes primarias y secundarias, pero no es asesoría legal. Antes de lanzar la versión de producción conviene validarla con un abogado o con el consultorio jurídico de la universidad. Los plazos y requisitos marcados con "(verificar)" deben confirmarse en la norma original.

---

## 1. Marco aplicable

| Norma o política | Qué exige | Aplica a |
|---|---|---|
| **Ley Estatutaria 1581 de 2012** | Principios de legalidad, finalidad, libertad (autorización previa), veracidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad. Vigilancia de la SIC | Todo el tratamiento de datos |
| **Decreto 1377 de 2013**, compilado en el **Decreto 1074 de 2015** | Autorización en el momento de recoger el dato, informando qué se recoge y para qué. **Aviso de privacidad** con contenido mínimo. Consentimiento expreso para datos sensibles | Registro, perfil y mensajes |
| **Circular Externa 005 de 2017 (SIC)** | Lista de países con nivel adecuado de protección. **Incluye a EE. UU.** | Datos que procesan Meta y los proveedores de IA |
| **WhatsApp Business Messaging Policy** | **Opt-in explícito** antes de cualquier mensaje que inicie el negocio. Hay que nombrar al negocio y el tipo de mensajes, y permitir darse de baja | Mensajes de Sintonía |
| **Política de IA de WhatsApp (desde el 15/01/2026)** | Prohíbe los chatbots de propósito general y permite los de tareas de negocio | Alcance del bot |
| **Groups API (Meta)** | Solo grupos creados por la API, ≤ 8 miembros, Official Business Account | El grupo del plan en H2 |
| **Instagram API** | **La Basic Display API se apagó el 4 de diciembre de 2024. No hay API oficial para cuentas personales** (solo para cuentas profesionales) | Importar el perfil de redes |
| **Resolución 8430 de 1993 (Minsalud)** | Clasifica la investigación por riesgo y exige consentimiento informado. Es la referencia ética para investigar con personas | El piloto como investigación de tesis |

---

## 2. Decisión sobre redes sociales

**Desde H1, Sintonía no importa ni lee perfiles de Instagram ni de Facebook.**

Por qué:
1. **No hay una vía técnica legal.** Las cuentas personales de Instagram no tienen API oficial desde diciembre de 2024. Extraer datos por fuera de las APIs (scraping) viola los términos de Meta.
2. **No hay una base jurídica limpia.** Según la Ley 1581, que un dato sea visible no autoriza a usarlo para perfilar a alguien. Hace falta autorización previa para una finalidad específica.
3. **No es necesario.** El perfilado conversacional (unas pocas preguntas en tono de juego, más lo que el usuario acepta y rechaza) da la misma señal sin riesgo legal.

**Alternativa que sí cumple: perfil declarado.** El usuario cuenta voluntariamente qué le gusta (por ejemplo, "tres lugares a los que siempre vuelves"). Es un dato aportado por el propio titular, con finalidad informada y autorización.

*En H3 se podría reevaluar el Facebook Login con permisos explícitos. Requiere revisión de la app por Meta (verificar) y una nueva autorización.*

---

## 3. Roles

| Rol (Ley 1581) | Quién | Obligaciones |
|---|---|---|
| **Responsable** | El equipo de Sintonía (en H1, los investigadores; cuando exista, la sociedad) | Política de tratamiento, autorizaciones, atención de derechos, seguridad |
| **Encargados** | Meta (WhatsApp), el proveedor del modelo de IA, Google (Sheets) | Tratan los datos por cuenta del responsable. Se rigen por **contrato de transmisión** (los DPA o términos de API de cada proveedor) |
| **Titulares** | El organizador **y cada miembro del grupo** | Cada uno autoriza por sí mismo. **El organizador no puede autorizar por sus amigos** |

---

## 4. Inventario de datos (minimización)

| Dato | Para qué | ¿H1? | Cuánto se guarda | Nota |
|---|---|---|---|---|
| Nombre y número de WhatsApp | Contactar y armar el grupo del plan | Sí | Mientras dure la relación o el piloto | Indispensable |
| Preferencias declaradas (tipo de plan, presupuesto, energía) | Capa 1 | Sí | Se guarda un **resumen estructurado**, no el chat completo | Minimizar |
| Mensajes dentro del grupo del plan | Coordinar (votos, confirmaciones) | Sí | El texto en bruto se borra al cerrar cada plan; se conservan las métricas | No guardar historiales completos |
| Votos y asistencia | Métricas del piloto | Sí | Hasta el fin del estudio; luego se anonimizan | Para la tesis, solo agregados |
| Escalas (fatiga, carga, WTP) | Validación | Sí | Igual que arriba | Seudonimizar con un id de grupo |
| "¿Llegaste a casa?" (sí/no) | Capa de confianza | Sí, **solo por mensaje** | Se borra a las 48 h | Sin ubicación |
| Ubicación en tiempo real | Hora de salida (capa 2) | **No (H2)** | Uso puntual, sin almacenar | Requiere autorización específica |
| Foto de la factura | Dividir la cuenta | **No (H2)** | Se extrae el total y se borra la imagen | La factura tiene datos de terceros |
| Datos de redes sociales | — | **Nunca** (ver punto 2) | — | — |

**Datos sensibles** (salud, orientación sexual, religión, política y similares): Sintonía **no los pide ni los guarda**. Si aparecen en la conversación (por ejemplo, "no tomo por un tratamiento"), el agente los usa solo en ese momento y no los guarda en el perfil. Esto debe quedar como regla escrita del agente. Si algún día se necesitaran, la ley exige consentimiento expreso.

**Menores:** quedan excluidos en H1 y H2. En el registro el usuario declara que es mayor de 18 años.

---

## 5. Flujo de consentimiento del grupo (el punto crítico)

```
1. El organizador se registra en la web de Sintonía (fuera de WhatsApp):
   - Lee el aviso de privacidad.
   - Marca dos casillas separadas:
     (a) "Autorizo el tratamiento de mis datos para coordinar planes".
     (b) "Acepto recibir mensajes de Sintonía por WhatsApp" (opt-in).
2. El organizador comparte un ENLACE de invitación con su parche.
3. Cada amigo abre el enlace y hace sus propios pasos (a) y (b).
   Nadie entra al grupo del plan sin hacerlo.
4. Sintonía crea el grupo del plan solo con quienes aceptaron (máx. 8).
5. Primer mensaje en el grupo: quién es Sintonía, qué hace,
   que en el piloto hay curaduría humana, y cómo salir
   ("escribe SALIR o sal del grupo").
6. Cualquiera puede revocar en cualquier momento.
   Sintonía suprime sus datos dentro del plazo legal.
```

*Por qué fuera de WhatsApp:* varias guías de la política de Meta indican que el opt-in se recoge por un canal distinto de WhatsApp (verificar la versión vigente de la política). Un formulario web cumple con Meta y además deja constancia de la autorización, como pide la Ley 1581.

---

## 6. Aviso de privacidad (contenido mínimo, Decreto 1377)

1. Quién es el responsable y cómo contactarlo (correo).
2. Qué datos se tratan y **para qué** exactamente: coordinar planes, mejorar recomendaciones y, en el piloto, investigación académica.
3. Los derechos del titular: conocer, actualizar, rectificar, suprimir y revocar.
4. Cómo ejercerlos (canal y plazos; la Ley 1581 fija tiempos para consultas y reclamos, verificar los días hábiles en los artículos 14 y 15).
5. Que los datos se procesan **fuera de Colombia** (servidores de Meta y del proveedor de IA en EE. UU., país con nivel adecuado según la Circular 005 de 2017).
6. Dónde consultar la política de tratamiento completa.

---

## 7. Proveedores de IA y transferencia internacional

- EE. UU. está en la lista de nivel adecuado (Circular 005 de 2017), así que **la transferencia es posible**, pero debe informarse en el aviso.
- Hay que usar la **API empresarial** del proveedor, con términos que **excluyan entrenar modelos con los datos** de Sintonía, y revisar su DPA. Ese DPA funciona como contrato de transmisión con el encargado.
- Al modelo solo se le envía lo necesario: el resumen del perfil y los mensajes del plan en curso, no historiales completos.

---

## 8. Seguridad

- La hoja del piloto tiene acceso restringido a los 2 investigadores, con verificación en dos pasos.
- El registro usa un id de grupo, no nombres. La tabla que relaciona id con número va en un archivo aparte.
- Nada de números ni nombres en la tesis, el deck o el FigJam.
- Al terminar el estudio, los datos en bruto se borran y solo quedan agregados anonimizados.

---

## 9. Registro Nacional de Bases de Datos (RNBD)

Solo están obligadas las sociedades y entidades sin ánimo de lucro con **activos de más de 100.000 UVT** y las entidades públicas. **No aplica** al equipo en la fase académica. Hay que volver a revisarlo si Sintonía se constituye como empresa.

---

## 10. Ética de investigación (aparte de la autorización de datos)

- El piloto es una investigación con personas. Además de la autorización de datos, va un **consentimiento informado de investigación** que explique el objetivo, los procedimientos, los riesgos, la voluntariedad y el derecho a retirarse.
- **Clasificación probable: riesgo mínimo** (Res. 8430). El estudio interviene en conducta social (salir con amigos), pero no toca aspectos sensibles. **Hay que validarlo con el comité de ética de la universidad**, que es quien decide si el consentimiento puede ser digital.
- **Sin engaño:** se avisa que en el piloto hay curaduría humana. Así no hace falta un *debriefing* por engaño.

---

## 11. Checklist por fase

**H1 · Mago de Oz (antes de arrancar)**
- [ ] Política de tratamiento y aviso de privacidad publicados (puede ser una página simple).
- [ ] Formulario web con autorización de datos + opt-in de WhatsApp + declaración de mayoría de edad + consentimiento de investigación.
- [ ] Enlace de invitación individual para cada miembro del parche.
- [ ] Mensaje de bienvenida con transparencia y forma de salir.
- [ ] Hoja con acceso restringido, ids seudónimos y plazos de borrado.
- [ ] Regla escrita del "mago" sobre datos sensibles: no se guardan.
- [ ] Consulta al comité de ética de la universidad.
- [ ] Sin redes sociales, sin ubicación y sin fotos de facturas.

**H2 · Producción**
- [ ] Official Business Account y Groups API.
- [ ] Bot con una tarea delimitada (coordinar planes), no de propósito general.
- [ ] DPA con el proveedor de IA, sin entrenamiento con los datos.
- [ ] Autorización específica para ubicación y fotos de facturas.
- [ ] Procedimiento para atender consultas y reclamos dentro de los plazos legales.
- [ ] Revisar RNBD y Estatuto del Consumidor (Ley 1480 de 2011) si se cobra la suscripción.

---

## Fuentes
- Ley 1581 de 2012 — [Secretaría del Senado](http://www.secretariasenado.gov.co/senado/basedoc/ley_1581_2012.html)
- Decreto 1377 de 2013 — [Función Pública](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646)
- Circular Externa 005 de 2017 (SIC) — [Alcaldía de Bogotá, SisJur](https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=70498&dt=S) · [Ámbito Jurídico](https://www.ambitojuridico.com/noticias/general/mercantil-propiedad-intelectual-y-arbitraje/estos-son-los-paises-con-un-nivel)
- RNBD — [SIC](https://www.sic.gov.co/registro-nacional-de-bases-de-datos)
- Resolución 8430 de 1993 — [Minsalud](https://www.minsalud.gov.co/sites/rid/lists/bibliotecadigital/ride/de/dij/resolucion-8430-de-1993.pdf)
- Opt-in de WhatsApp — [Infobip](https://www.infobip.com/docs/whatsapp/compliance/user-opt-ins)
- Política de IA de WhatsApp 2026 — [respond.io](https://respond.io/blog/whatsapp-general-purpose-chatbots-ban)
- Groups API — [Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups)
- Fin de la Instagram Basic Display API — [Spotlight](https://spotlightwp.com/help/preparing-for-the-end-of-instagram-basic-display-api-what-to-expect-and-how-to-adapt/) · [DEV Community](https://dev.to/nick_johnson/instagram-basic-display-api-is-dead-build-what-works-instead-4ifm)
