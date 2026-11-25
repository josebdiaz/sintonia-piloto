# Cambio de instrumento · Encuesta de cierre 2.16.0 (backend 2.10.0)

> **Estado: por validar con Néstor.** Vive en la rama `encuesta-cierre-2.16` y no está publicado en sintonia.my. Cambia el instrumento, así que no se publica sin su visto bueno.
> Origen: revisión de Katherine página por página (24/11) y análisis de los escenarios de pago del equipo (24/11).
> Para verlo sin grupo ni backend: `piloto/retro.html?revisar=organiza` o `?revisar=miembro` (añade `&ronda=2` para el plan 2).

## 1. Qué cambia

| Página | Antes (2.15.0) | Ahora (2.16.0) | Por qué |
|---|---|---|---|
| 1 · Antes | Desgaste, carga (solo quien organiza), SEQ de activación | Igual, más la **SEQ de continuidad** (solo en el plan 2) | Armar el plan 2 es «volver a armar»: la pregunta va con su momento |
| 2 · Durante | Satisfacción, **«¿Qué tal terminó la salida?»**, SEQ de interacción, sentimiento | Sin «¿Qué tal terminó la salida?» | Es ambigua y evalúa al parche, no a Sintonía (Katherine) |
| 3 · Después | «¿Repetirían un plan así con este grupo?», «¿Qué tan a gusto…?», SEQ de continuidad | **Se elimina** | Las preguntas pasan a las páginas 1 y 4 |
| 4 · Sintonía | SUS (10 ítems) | «¿Qué tan a gusto te sentiste con Sintonía en el chat?» + **«¿Le pedirías a Sintonía que arme el próximo plan de tu parche?»** + SUS | «A gusto» evalúa al agente (Katherine). La intención de repetir se reescribe en singular y sobre Sintonía |
| 5 · Precio | Solo quien organiza: 4 precios (Van Westendorp) + preventa, opcional | **Todo el parche**, por persona: filtro de suscripción, 4 precios con enunciados cortos (solo si responde Sí o Tal vez), quién debería pagar, en cuántos parches | Medir «¿cuánto?» y «¿a quién le cobramos?» (decisión del 19/11, prompt 6) |
| 6 · Cierre | Dos preguntas abiertas | Igual | — |

El SUS, las tres SEQ y sus escalas **no cambian** (validados con Néstor). La encuesta pasa de 5 o 6 pasos a **5 para todos**.

## 2. Preguntas nuevas del paso del precio

| # | Pregunta | Opciones | Obligatoria |
|---|---|---|---|
| 11 | ¿Pagarías una suscripción mensual a Sintonía, solo por tu parte? | Sí · Tal vez, dependiendo del precio · No | Sí |
| 11a–d | ¿Qué precio mensual, solo por tu parte, te parecería…? Tan barato que desconfiarías · Una muy buena compra · Caro, pero aún lo pagarías · Demasiado caro para pagarlo | COP/mes | No (los 4 o ninguno, de menor a mayor). Solo si 11 = Sí o Tal vez |
| — | Preventa (sin cambios en el texto) | Casilla | No. Solo si 11 = Sí o Tal vez |
| 12 | Si Sintonía costara, ¿quién debería pagarlo en tu parche? | Quien organiza · Lo dividimos entre todos · Cada quien su propia suscripción, para todos sus parches · Nadie lo pagaría | Sí, también si 11 = No |
| 13 | ¿En cuántos parches usarías Sintonía? | 1 · 2 · 3 o más | Sí |

**Decisiones de diseño:**
- **Por persona, no por parche.** Cada quien responde solo por lo que sale de su bolsillo, que es lo único que sabe. Con eso se arman los tres escenarios de cobro: paga quien organiza (su respuesta), el grupo divide (suma de las respuestas) y cada quien tiene la suya (respuestas individuales más la pregunta 13).
- **Sin precio de referencia.** Mostrar una cifra anclaría las cuatro respuestas.
- **La 12 la responde también quien dijo No.** Separa el rechazo al precio del rechazo a pagar.
- **La 12 nombra los tres escenarios** (A, B y C del análisis de varios pagadores). «Cada quien su parte» se descartó porque no distingue entre dividir (B) y tener una suscripción propia (C).

## 3. Reglas de lectura (fijadas antes de ver datos)

1. **Intención de repetir (meta: la mitad de los grupos).** Un grupo cuenta si **quien organiza** responde «Sí» a «¿Le pedirías a Sintonía que arme el próximo plan de tu parche?». La respuesta del resto del parche se reporta como contexto, con su n. *Propuesta del equipo; Néstor la confirma o la cambia antes del 25/11.*
2. **Disposición a pagar.** Con un grupo (4 a 6 personas) no hay curvas ni punto de cruce: se reportan medianas y rangos **por rol** (quien organiza o miembro), con estatus Pendiente. Lo que se declara no es un pago: se cruza con lo que la gente hace (si pide el plan 2, minutos de Mago in y llegadas).
3. **Precio hipotético de 10.000 COP/mes:** es una meta del equipo y no se ajusta después de ver las respuestas.

## 4. Efectos en los datos

| Hoja o campo | Cambio | Compatibilidad |
|---|---|---|
| `retro.valor_final` | Ya no se pregunta: queda vacío en las filas nuevas | El panel muestra «—» en «cómo terminó la salida» |
| `retro.repetiria` | Mismo campo y mismas opciones (`si`, `tal_vez`, `no`); **cambia el enunciado** | No hay datos reales previos. Registrar el cambio en la hoja `cambios` si el piloto ya hubiera empezado |
| `wtp` | Columnas nuevas al final: `plan_id`, `rol`, `suscripcion`, `quien_paga`, `parches`. Una fila por persona y plan (`wtp_ya_enviada`). Si 11 = No, no se guardan precios ni preventa | Correr `probarMontaje()` al desplegar. Resuelve el hallazgo conocido M8 (wtp sin `plan_id`) |
| Panel | Precios de organizadores como antes; tabla nueva por rol: suscripción, quién paga y parches, con n | — |

## 5. Privacidad

El aviso de privacidad v2 decía «solo para quien organiza, preguntas sobre precio». En la rama, `piloto/aviso.html` dice ahora que la encuesta trae preguntas sobre precio para todos (si pagarías por tu parte, cuánto, quién debería pagar y en cuántos parches). No hay datos personales nuevos: son preferencias, guardadas con el `pid` como el resto de la encuesta. **Por decidir con Néstor:** si basta con corregir el texto o si hay que subir la versión del aviso (`AVISO_VERSION`). La preventa conserva su texto («Hoy no se cobra nada y no me compromete a pagar»).

## 6. Riesgos (5 dimensiones)

| Dimensión | Riesgo | Mitigación |
|---|---|---|
| Privacidad | Que alguien del grupo vea quién pagaría y quién no | Las respuestas son individuales y el panel solo muestra conteos por rol |
| Exclusión | Que preguntar por dinero incomode a quien no puede pagar | «No» y «Nadie lo pagaría» son opciones válidas; los precios son opcionales |
| Seguridad | Sin impacto directo | — |
| Sesgo metodológico | Lo que se declara tiende a quedar por encima de lo que se paga; n de un solo grupo | Se cruza con el comportamiento y se reporta como Pendiente |
| Impacto emocional | Más preguntas para los miembros: la encuesta se alarga | Se quitaron dos preguntas y una página; el ensayo del 25/11 la cronometra (M9) |

## 7. Verificación técnica (n = 0 personas)

- Backend 131 de 131 (antes 114). Nuevo: la disposición a pagar de quien organiza y de los miembros, sin precios si responde No, una fila por persona y plan, y el resumen del panel por rol.
- Recorrido 57 de 57 · consola 26 de 26 · ola A 21 de 21 · auditoría E2E 70 OK, 0 graves; M8 queda resuelto y sigue M9 (largo de la encuesta, 28 campos) · contraste y axe sin fallas.

## 8. Para publicar (después del visto bueno)

1. Néstor valida §2, §3.1 y §5.
2. Pegar el backend 2.10.0 en Apps Script, `probarMontaje()` y «Nueva versión».
3. Unir la rama a `main` (frontend 2.16.0), `python3 tools/home.py` y `--check`.
4. Tags `piloto/v2.16.0` y `backend/v2.10.0`; este es el congelamiento del 26/11.
