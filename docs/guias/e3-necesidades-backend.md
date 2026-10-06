> **Copia en el repositorio · Pendiente: iteración futura, después del piloto en curso.**

# E3 · Charladita — necesidades de backend

Iteración futura. Hoy solo existe el diseño y el prototipo en Figma (páginas «E3 · Prototipo» y «E3 · Backend»). Base: `Codigo_Piloto_v2.gs` 2.2.3. No se toca el piloto en curso (E1/E2).

Prioridad: **Bloqueante** = sin esto E3 contamina los datos o no se puede medir · **Necesario** = la experiencia diseñada no funciona sin esto · **Deseable** = mejora, se puede dejar para después.

| # | Prioridad | Necesidad | Dónde | Hoy (2.2.3) | Cambio propuesto | Pantallas |
|---|---|---|---|---|---|---|
| B1 | Bloqueante | Aceptar la condición E3 | `registrar_` · `grupos.experimento` | Todo lo que no es `E2` se guarda como `E1`: un grupo E3 quedaría contado como E1 | Lista `EXPERIMENTOS = ['E1','E2','E3']`; rechazar valores desconocidos con `experimento_invalido` en vez de convertirlos | 1.0, 1.5 |
| B2 | Bloqueante | Panel con tres condiciones | `view=panel` · `por_experimento` | Solo calcula `E1` y `E2` | Recorrer `EXPERIMENTOS`; mismas exclusiones (modo prueba, desestimados, cambio de canal) | Panel |
| B3 | Bloqueante | Cambios I4 y cambio de canal con E3 | `registrar_cambio_`, `marcar_failover_` | Convierten cualquier valor a `E1`/`E2` | Aceptar `E3` en ambos; `failover` admite `E3>E2` | Consola |
| B4 | Bloqueante | Medir fricción por turno (la pregunta de E3: ¿la charla convierte mejor la intención en participación?) | Hoja nueva `turnos` | No hay forma de saber en qué turno se abandona; `evento_` exige un `pid` y en TP1/TP2 aún no existe | Acción pública `turno` con `sesion_id` aleatorio (sin datos personales): `[ts, sesion_id, experimento, punto, turno, accion (visto · respondido · abandono), ms]`. Al registrar, guardar `sesion_id` en `participantes` para unir el embudo con la persona | Todas |
| B5 | Necesario | Registro en una sola llamada al final de TP1/TP2 | `registrar_` | Sin cambio de contrato: ya recibe `tipo_grupo`, `tamano_grupo`, `n_invitados`, `planes_realizados_mes`, `planes_fallidos_mes`, `quien_organiza`, `fatiga_previa`, `preferencias`, nombre, WhatsApp, 4 permisos y `consent_metodo` | La charla junta las respuestas en memoria y envía todo al tocar «Armar el plan». La charla pregunta «cuántos son en total» una sola vez y lo envía en `n_invitados` y `tamano_grupo`; si el análisis necesita separar el tamaño del parche del número de invitados a este plan, agregar un turno. `quien_organiza` ∈ `yo · turnos · otra` | 1.0–1.5, 2.0–2.2 |
| B6 | Necesario | Consentimiento uno por uno | `participantes.consent_metodo` | Ya existe `boton_todo` / `individual` | Sin cambio de backend. La pantalla 1.5b envía `individual` | 1.5, 1.5b, 2.2 |
| B7 | Necesario | Aviso y consentimiento propios de E3 | `participantes.aviso_version` | Una sola versión del aviso | Versión de aviso por condición (`v3-charla`), aprobada por el comité de ética antes de abrir E3 | 1.5, 2.2 |
| B8 | Necesario | Votación sin conteo por opción | `view=plan` | Devuelve `conteo` por opción y `vetos` a cada participante | Si el grupo es E3, devolver solo `n_votos` y `mi_voto` a participantes (el mago sigue viendo todo en la consola). Evita el efecto manada y protege el anonimato del veto | 3.0–3.2 |
| B9 | Necesario | Explicar por qué ganó una opción | `cerrar_plan_` · `planes` | Se guarda `elegida`, no la razón | Columna `razon_cierre` (`unanime · mayoria · least_misery · mago`) que `view=plan` devuelve; el texto de 3.2 depende de ella | 3.2 |
| B10 | Necesario | Restricciones del invitado como datos | `preferencias` | Solo texto libre en `resumen` (ya se guarda para miembros) | Columna `etiquetas` con los chips normalizados (`sin_mariscos · poca_caminata · presupuesto_bajo · todo_sirve`) para la propuesta y el análisis | 2.1 |
| B11 | Necesario | WhatsApp ya registrado | `registrar_` | Responde `ya_registrado` al final | Sin cambio: la pantalla 2.A se muestra después de «Súmenme». No crear una consulta previa por número: permitiría averiguar quién está en un grupo | 2.A |
| B12 | Deseable | Retomar la charla al recargar | `view=plan` | No dice si ya respondió el pulso o el precio | Agregar `retro_hecha` y `wtp_hecho`. En el navegador solo se guarda el número de turno y respuestas sin datos personales; nombre y WhatsApp nunca | 3.x, 4.x |
| B13 | Deseable | Retiro escribiendo SALIR | `revocar_` | Existe, pide `pid` | Sin cambio: el composer lo reconoce y llama `revocar` | 2.3 |

## Lo que no cambia

- Votar, veto, apuntarse, «no puedo» y «¡Llegué!» usan `votar` y `evento` (`me_apunto`, `no_puedo`, `checkpoint_llegada`) tal como están.
- El pulso usa `retro` con los mismos campos: `fatiga_post`, `satisfaccion_plan`, `valor_final`, `sentimiento_autodeclarado` (contento · tranqui · normal · cansado · incomodo), `repetiria`. El precio usa `wtp` (solo quien organizó).
- Los personajes (El Quinto, El Mago, El Resonador, La Antena) son solo del frontend: no se guardan.

## Antes de implementar

1. Decisión de Néstor sobre E3 como tercera condición o estudio aparte (tamaño de muestra).
2. Aviso y consentimiento de E3 aprobados por el comité.
3. B1–B4 en un mismo cambio de backend (versión 2.3.0) con pruebas en `modo=prueba`.
