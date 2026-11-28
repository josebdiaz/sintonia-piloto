# Métricas por fase · fijadas antes de los datos

Decisión del equipo del 28/11/2026, antes del encuentro de Cali. Valen igual en E1 y E1.5. **No son resultados:** no hay datos del piloto (n = 0).

**Cómo se leen:**
- Son diagnóstico, no criterio de parada. Solo llevan cifra las metas del 27/11 y la parada de E1.5 (`ESTADO.md` §0, «Reglas fijas»). Las demás se describen sin umbral.
- La comparación entre E1 y E1.5 es descriptiva, con al menos 2 parches por condición.
- El borrador de reglas del Proyecto ordena las métricas por condición. Aquí se reparten por fase así: decisión = votación + confirmación, y llegada = el día del plan.

| Fase | Métrica | Cálculo | Fuente | Cifra |
|---|---|---|---|---|
| Convocatoria | Se apuntaron / invitadas | Personas que se apuntaron / invitadas, por parche | Consola: «invitadas» y «se apuntó» | Ninguna (diagnóstico) |
| Decisión | Rondas de votación por plan | Conteo de rondas por plan | Hoja `decisiones` (en E1.5 requiere `n8n.N1`) | Ninguna |
| Llegada | Llegadas | Llegaron / se apuntaron | Consola: «Llegó» y «se apuntó» | **Meta: 60 %** (dec. equipo 27/11) |
| Llegada | Llegaron / invitadas | Llegaron / invitadas | Consola | Ninguna (contexto, 27/11) |
| Llegada | Acompañamiento (`/checkpoint`, `/no_llega`, `/en_casa`) | Piso de seguridad: no se descarta nada durante el piloto. Solo se ajusta la forma (hora, encuesta en vez de texto, una sola vez) si aparecen señales de molestia (HUMANO o SALIR por esa causa, o una queja) o si nadie lo menciona como útil en la encuesta de cierre | Encuesta de cierre y observación; Néstor valida el piso | Descarte de fondo solo con más grupos |
| Cierre | Preguntas de vuelta (A3) | Preguntas del grupo después del cierre («¿cuándo es?», «¿dónde?»), por plan | Plantilla de observación (`docs/guias/prueba-cali.md`) | **Más de 2 = el cierre falló** (27/11) |
| Cierre | Intención de repetir | Parches con mayoría de «Sí» / parches de la condición; «Tal vez» no cuenta | Hoja `retro`, campo `repetiria` | **Meta: la mitad de los parches** (27/11) |
| Cierre | Disposición a pagar por rol | La de quien organiza frente a la del resto del parche, por condición, con los cuatro precios (`muy_barato`, `barato`, `caro`, `muy_caro`). `quien_paga` sirve de apoyo | Hoja `wtp` (backend 2.10.0) | El pagador único cae solo si quien organiza no supera al resto **en E1 y también en E1.5** |
| Transversal | Minutos humanos por plan y por etapa (A6) | Minutos con «Mago in» / plan, y por etapa | Hojas `operacion` y `medicion_consola` | Ninguna; E1.5 se compara con E1 |
| Transversal | A1, A2, A4 y A5 | Definiciones en `docs/guias/prueba-cali.md` | Observación y consola | Diagnóstico del flujo manual |
| Transversal · E1.5 | Error del motor | Pendiente de d3 (propuesta en `n8n/PLAN-agentico.md` §5.2) | `e15_mensajes` (diseñada en `n8n/agentes/contrato.md`) | **Parada: 40 %** |
| Transversal · E1.5 | Veces HUMANO y mensajes sin intervención | Conteos por plan, con su causa | `e15_entrada`, campo `motivo` | Ninguna |

**Métricas principales:** SEQ por momento y SUS, validadas con Néstor. No son de una fase: se leen en la encuesta de cierre y en la encuesta del mago.
