# Convenciones de códigos y versiones

Una página para que cualquier código o versión del proyecto se entienda sin buscarlo. El registro que lee la máquina está en [`tools/codigos.json`](../tools/codigos.json); la revisión, en `tools/revisar-codigos.py`.

## 1. La regla, en una línea

**Cada código tiene un documento dueño. Dentro de ese documento se escribe corto (`N17`); fuera de él, siempre con su ámbito (`n8n.N17`).**

No se renumera nada. Los códigos que ya existen conservan su número; solo se les antepone el ámbito cuando se citan en otro lado (ESTADO, CHANGELOG, el Proyecto, un deck o un commit).

## 2. Por qué

Hasta el 26/11 cada documento numeraba desde 1 con letras sueltas, y luego se citaban en otros como si fueran únicos. Ejemplos reales:

| Código | Significaba, según dónde |
|---|---|
| D1 | La licencia (auditoría de estándares) · una decisión sobre E2 (Decisiones P7) · el `pid` en el relay (SPEC) |
| B1 | El canal en n8n · aceptar la condición E3 en el backend · un arreglo del plan 2.8.1 |
| M1 | Métricas nuevas (ESTADO) · redirecciones en n8n · un ajuste menor del plan 2.8.1 |
| P1, P4 | Prioridad de la auditoría UI/UX · el Periodo 4 de la maestría · un pendiente de DS 3.0 |
| 2.10.0 | La consola del 23/11 · el backend desplegado el 24/11 |

## 3. Códigos globales (se escriben solos en cualquier parte)

| Código | Qué es |
|---|---|
| **E1** | WhatsApp + mago |
| **E1.5** | WhatsApp automatizado con n8n y aprobación humana. `E2` es solo su valor interno en el código y la hoja; en textos se escribe E1.5 |
| **E3** | Frontera standalone, fuera del piloto |
| **A1–A6** | Criterios para retomar la automatización ([`docs/guias/prueba-cali.md`](guias/prueba-cali.md)) |

## 4. Ámbitos

| Ámbito | Documento dueño | Letras | Ejemplo fuera del dueño |
|---|---|---|---|
| `pend` | `ESTADO.md` §4 · pendientes | número | «pendiente 15» o `pend.15` |
| `est` | `ESTADO.md` §3.2–3.3 · operación (O) y métricas (M) | O, M | `est.M2` |
| `n8n` | `n8n/GUIA-CONTINUACION.md` · bloqueos (B), inconsistencias (I), menores (M), novedades de E1 (N), pruebas (T) | B, I, M, N, T | `n8n.N17`, `n8n.B1` |
| `relay` | `n8n/relay/SPEC.md` · requisitos (R), pruebas (T) y decisiones abiertas (D) | R, T, D | `relay.R1`, `relay.D1` |
| `aud` | `docs/auditoria-estandares.md` · decisiones (D) | D | `aud.D1` |
| `ui` | Auditoría UI/UX del 23/11 (Proyecto) · prioridades (P) y consola (C) | P, C | `ui.P4`, `ui.C3` |
| `e3` | `docs/guias/e3-necesidades-backend.md` | B | `e3.B1` |
| `ds` | `ds-3.0/ASSETS.md` | P | `ds.P1` |
| `tramo` | `n8n/PLAN-construccion.md` · tramos de prueba del motor (T1 entrada, T2 salida, T3 continuidad) | T | `tramo.T1`. No confundir con `n8n.T1–T16`, las pruebas de la guía del 30/10 |
| `ag` | `n8n/PLAN-agentico.md` · fases del motor con agentes (F0 contrato, F1 Redactor y Revisor, … F6 antes de una persona real) | F | `ag.F1`. Se llamaban A0–A6 hasta el 27/11; se cambiaron porque chocaban con los criterios globales A1–A6 |
| `prueba` | `n8n/PLAN-pruebas.md` · capas de prueba del motor (P0 sin red … P5 continuidad) | P | `prueba.P1`. No confundir con `ui.P` ni `ds.P` |

**Cerrados (solo historia, no se crean códigos nuevos):** `fix281` (plan 2.8.1: G, M, B), `p7` (Decisiones del Periodo 7: C, D), `f05` (plan F0–F5 de la 2.7.0), `be225` (backend 2.2.5: R), `p4` (hipótesis H1–H4).

**Nombres, no códigos:** los flujos de n8n `W0`–`W5` y `E1.5-01` son nombres propios y se escriben así en cualquier parte.

**Periodos de la maestría:** en prosa, «Periodo 7»; `P7` queda solo en nombres que ya existen (`deck-metodo-interno-p7.html`, «Decisiones P7»). Los sub-hitos se escriben con fecha: «sync del 23/11», no «P8d».

## 5. Para crear una lista nueva

1. Pregúntate si cabe en una lista existente. Casi siempre cabe.
2. Si no, crea un ámbito: una palabra corta en minúscula, sin tildes, que no esté en la tabla.
3. Agrégalo a `tools/codigos.json` y a la tabla de la §4 en el mismo commit.
4. Las tareas sueltas no llevan código: van como pendiente en `ESTADO.md` §4.

## 6. Versiones

Nunca un número de versión solo. Siempre con el nombre del componente delante: «consola 2.16.0», «backend 2.10.0».

| Componente | Dónde vive | Formato | Cuándo sube |
|---|---|---|---|
| **Consola** (frontend: consola, panel y páginas de participante) | `FRONTEND_VERSION` en `piloto/assets/sintonia.js` · tag `piloto/vX.Y.Z` | X.Y.Z | Y: cambia algo que ve una persona · Z: arreglo sin cambio visible |
| **Backend** (Apps Script) | encabezado de `backend/Codigo_Piloto.gs` · tag `backend/vX.Y.Z` | X.Y.Z | Igual que la consola. Numeración propia: no tiene que coincidir con la consola |
| **Aviso de privacidad** | `AVISO_VERSION` | `vN-AAAA-MM` | Cada texto publicado nuevo |
| **Prompt maestro** | Proyecto | `vN.M` | Cada cambio en las instrucciones |
| **Home, decks, guías** | — | sin versión | Se identifican por fecha y commit |

La X (mayor) solo sube con un cambio de condición o de método, y lo decide el equipo.

## 7. Fechas

- En prosa: `26/11` (el año se da por sabido dentro del semestre).
- En nombres de archivo, tags y títulos del CHANGELOG: `2026-11-26`.

## 8. Cómo revisarlo

```
python3 tools/revisar-codigos.py           # resumen de todo el repo (informativo)
python3 tools/revisar-codigos.py --cambios # solo las líneas nuevas desde el último commit
```

**Cuándo se corre:** después de un cambio grande (una versión nueva, una reescritura de `ESTADO.md` o de una guía, un cierre de frente con muchos cambios) o cuando alguien lo pida. No corre en cada push ni en las acciones de GitHub, y nunca bloquea un commit.

La revisión avisa cuando una letra con dueño (B, C, D, G, I, M, N, O, P, R, T) aparece sin ámbito fuera de su documento, o cuando una versión aparece sin «consola» o «backend» cerca. Lo escrito antes del 26/11 no se corrige en bloque: se corrige cuando se toca.
