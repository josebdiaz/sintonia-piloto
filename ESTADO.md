# Estado del proyecto · 27 nov 2026

Piloto en WhatsApp con parches que ya existen en Cali. **E1** (WhatsApp + mago): una persona opera todo desde la consola. **E1.5** (WhatsApp automatizado, valor interno `E2`): n8n interpreta, decide, redacta y envía; una persona entra solo con HUMANO o un error. E1.5 es el producto; el «aprueba y pega» del 24/10 era un Mago de Oz en la entrega, no la definición.

**Formato:** solo el presente, un hecho en un solo lugar y cada hecho con su fecha y su fuente. Lo hecho sale de aquí y queda en [`CHANGELOG.md`](CHANGELOG.md). Versión extensa hasta el 27/11: `git show 1c1426e:ESTADO.md`.

## 0. En corto · leer esto primero

- **Versiones:** frontend **2.16.0** y backend **2.10.0** (24/11, congelados en `piloto/v2.16.0` y `backend/v2.10.0`). Aviso de privacidad **v2-2026-11** publicado.
- **Dónde estamos:** lista la prueba con Cali en E1. **No hay resultados con personas reales.**
- **Calendario:** ensayo 28–29/11 · Cali, encuentro a más tardar el 30/11 · «cerrar E1» se define el 3/12 · pitch el 12/12. El 4/12 no es entrega (dec. equipo 27/11).
- **Reglas fijas (antes de los datos):**
  - Consola congelada desde el 26/11 hasta cerrar el análisis.
  - E1 primero. El motor se construye ya, pero E1.5 corre después de cerrar E1, con un grupo real y el aviso v3 publicado (dec. equipo 26–27/11).
  - Metas: 60 % de llegadas sobre quienes se apuntaron y la mitad de los parches con intención de repetir (mayoría de «Sí» en la encuesta de cierre; «Tal vez» no cuenta). Más de 2 preguntas de vuelta después del cierre = el cierre falló (A3). Se leen con al menos 2 parches por condición y la comparación es descriptiva (dec. equipo 27/11; falta llevarlo a v3.7, pendiente 42).
  - E1.5 se para si el error supera el 40 % frente a lo ejecutado. Qué es error y sobre qué base: d3, valida Néstor.
- **E1.5 · automatización:** los mensajes salen sin aprobación previa y una persona entra con HUMANO o un error (dec. 26/11, noche). Desde el 27/11 va por tipo de mensaje: falta la tabla de qué sale solo (d4). Néstor dio luz verde el 27/11 (confirmada, José). A1–A6 quedan como diagnóstico del flujo manual, no como requisito. Detalle: §3.1 y pendientes 36–40, 44 y 45.
- **E1.5 · motor (27/11, n = 0):** conector Evolution API 2.3.8 en Hostinger con `/ping` de punta a punta (26/11). Plan por tramos en `n8n/PLAN-construccion.md`. MCP de n8n conectado a Claude (27/11); tabla `e15_entrada` creada y `E15-00 · Entrada` importado **inactivo**. Los 9 flujos, expuestos al MCP y exportados a `n8n/flujos/` (27/11), siguen inactivos. Revisor: 5 bloqueos de corchetes (W0, W1, W3), 28 de validez; las 2 llamadas a Evolution de los SW, sin credencial. E15-00 activo desde el 27/11 y Evolution apuntando a él: `HUMANO` llegó como `escalar · pidio_humano`, sin texto, nombre ni número. **Fase 1 cerrada.** El ping queda sin webhook. Siguiente: `tramo.T1` en el grupo del equipo (pendiente 44; plan de pruebas en `n8n/PLAN-pruebas.md`).
- **E1.5 · orquestación (27/11, dec.):** Néstor dio luz verde a un motor con agentes (confirmada el 27/11, José). Un Redactor escribe con la voz de Sintonía alrededor de un bloque de datos fijo; un Revisor (QA) independiente aprueba antes de salir; si falla, sale la plantilla de E1. Los relojes, HUMANO y lo sensible no cambian. Plan: `n8n/PLAN-agentico.md`. Fase `ag.F0` hecha el 27/11, sin red: contrato de los agentes y diseño de `e15_mensajes` (`n8n/agentes/contrato.md`, sin crearla en n8n), reglas de voz (`n8n/agentes/voz.md`) y guardas en código (`n8n/motor/guardas.js`, 36 casos ficticios ✓). Siguiente: `ag.F1`, que espera las credenciales de los modelos (pendiente 45). Revisión del 27/11: lo que el pivote cancela (`SW · Aprobar`, `n8n.N25`, `n8n.B1`, E1.5-01, la opción C) está en el §9 de `n8n/GUIA-CONTINUACION.md`; las pruebas de lo vigente, en `n8n/PLAN-pruebas.md`. Nod queda como asistente personal de José por Telegram, sin datos de participantes.
- **Investigación y pitch (27/11):** borradores con opciones en el Proyecto para los pendientes 24–32 (reglas, canvas, pitch); falta que el equipo elija. JTBD: «quiero que conectar con los míos sea tan fácil como mandar un mensaje». Modelo de negocio en construcción; la disposición a pagar sale de las encuestas de cierre de E1 y E1.5.
- **Instrucciones del Proyecto v3.6** pegadas el 27/11 (`claude/prompt-maestro-v3.6.md`). La v3.5 está en `claude/archivo.md`.
- **Casa:** convenciones de códigos en `docs/convenciones.md` (26/11). Repo público con licencia opción C y `main` protegida (24/11). Home y tablero (`sintonia.my/tablero`) se generan en cada cierre y son vistas: si no coinciden, manda este archivo. Vigilancia de sintonia.my cada 6 h (tarea programada de Claude).
- **Decisiones abiertas:** d1–d6 en `tools/tablero-curado.json`. La más urgente es d1, el plan B si Cali no confirma (28/11).
- **Bloqueos:** grupo de Cali sin confirmar · plantilla del tótem · logo vectorial de Icesi.
- **Frente siguiente:** Cali en E1 (pendientes 1 y 3). Después, E1.5 con un grupo real. Hasta entonces se presenta como «construido y verificado técnicamente» (n = 0).
- **Dónde está cada cosa:** código y guías en el repo · notas internas y borradores en el Proyecto · estado para liderazgo en el reporte ejecutivo semanal · forma de trabajo en `claude/wow-sintonia.md`.

## 1. Versiones

Qué trae cada versión (antes §2): `CHANGELOG.md`.

| Componente | Versión | Estado |
|---|---|---|
| Frontend (consola, panel, participantes) | **2.16.0** | En https://sintonia.my desde el 24/11. Encuesta de cierre con precio para todo el parche (aprobada por Néstor) |
| Backend (Apps Script) | **2.10.0**, desplegado el 24/11 | Disposición a pagar por persona y plan (`wtp`). `AVISO_VERSION` = `v2-2026-11`. `CUPO_ABIERTO` no existe: el backend asume «no» (lista de espera) |
| Motor E1.5 (n8n Cloud, 9 flujos) | Sin cambios desde el 30/10; plan pagado el 26/11 | Los 9 flujos, inactivos y **sin probar contra el backend**. `E15-00 · Entrada` activo desde el 27/11 (el ping queda sin webhook). Snippets de E1 (`n8n/snippets/`) sin pegar. Motor con agentes: contrato, voz y guardas en el repo; `SW · Redactar` por construir. Ver §3.1 |
| Conector de WhatsApp (Evolution API) | 2.3.8, desde el 26/11 | Hostinger (Brasil), HTTPS. El número de prueba **no** es el de Sintonía: se desvincula y se borra antes del piloto. La llave está solo en las credenciales de n8n y en el gestor del equipo |
| Home (sintonia.my) | Generado (`tools/home.py`) | Menú desde `home.json` y este archivo. `sintonia.my/decks` y `/equipo`; 5 toques en el glifo en celular. Falta probarlo en un teléfono real (pendiente 1) |
| Tablero de frentes | Generado (27/11) | `sintonia.my/tablero`, con `tools/tablero.py` y `tools/tablero-html.py` en cada cierre (paso 3.4b de «sintonia-wow») |
| Repositorio | Público, excepción documentada | `docs/seguridad-repo.md`: escaneo de secretos, protección de push y `main` protegida, activos (API, 24/11). Licencia opción C (`aud.D1`). Falta conectarlo como carpeta del Proyecto (pendiente 16) |
| Tags | 68 anotados | Congelamiento: `piloto/v2.16.0` y `backend/v2.10.0` sobre `2a81fd3` |
| Inventario | Hoja del piloto | `probarMontaje()` corrido el 27/11. Línea «Ubicaciones»: `[Dato pendiente: pegarla aquí]` |

**Último QA completo** (23/11, frontend 2.10.0 · backend 2.9.1, `tools/qa/correr.sh todo`): backend 105/105 · recorrido 57/57 · consola 26/26 · ola A 21/21 · E2E 67 OK, 0 graves, 2 conocidos · contraste y axe sin fallas. Los QA anteriores están en `CHANGELOG.md`.

## 3. Implicaciones para las otras etapas

Severidad: **Bloquea** (no se corre sin resolverlo) · **Validez** (se corre, pero E1 y E1.5 dejan de ser comparables) · **Ajuste**.

### 3.1 Motor E1.5 en n8n

E1.5 tiene que copiar la mecánica de E1 para que la comparación sea justa. Dueño de los códigos: `n8n/GUIA-CONTINUACION.md` (§7: `n8n.N1–N11`, 15/11; §8: `n8n.N12–N27`, 26/11).

- **Bloquean:** `n8n.N2` (textos de la consola: plantilla de respaldo y referencia del Redactor) · `n8n.N3` (ningún `[corchete]` al grupo; el revisor del 27/11 los halló en W0, W1 y W3) · `n8n.N16` (antes del grupo) · `n8n.N17` (textos de la consola 2.16.0) · `/ingreso` propio de E1.5 (la bienvenida de la consola dice que una persona revisa todo) · `n8n.N27` (sin `view=motor` el motor no lee disponibilidad, `pid` ni llegadas).
- **Validez:** `n8n.N1` (encuesta nativa y `decision` en `cerrar_plan`) · `n8n.N5` (relojes de E1) · `n8n.N7` (backend listo en 2.7.1; falta deduplicar W1 por `plan_id` + ronda) · `n8n.N10` (por redefinir con d6: en E1.5 se mide a quien atiende escalamientos).
- **Ajuste:** `n8n.N4`, `n8n.N6`, `n8n.N8`, `n8n.N9`. **Decisión abierta:** `n8n.N11` (SUS de quien opera en E1.5, d6).
- **Guía del 30/10:** hechos `n8n.B2` (salvo `n8n.I5`), `n8n.B3–B4` (hay que recopiar los textos, `n8n.N2`), `n8n.I1` e `n8n.I2–I3`. Abiertos `n8n.B5` (orden de W1) e `n8n.I5`. Cancelados con el pivote del 27/11: `n8n.B1`, `n8n.I4`, `n8n.N6`, `n8n.N25` y `n8n.M3` (§9 de la guía).

### 3.2 Operación del piloto

| # | Implicación | Acción | Sev. |
|---|---|---|---|
| O1 | Guía y deck del monitor describen la consola 2.2.2 | Actualizar `docs/guias/onboarding-monitor.md` y `docs/deck-onboarding-monitor.html` antes del primer grupo real | **Bloquea** |
| O2 | `docs/protocolo-m2.md` describe E2 como web app | Marcarlo como superado | Ajuste |
| O3 | Cambiar la consola a mitad del piloto mezcla interfaces en los minutos humanos | Consola congelada en la 2.16.0; cada fila de medición guarda `consola_version` | **Validez** |
| O4 | Pulso del mago y medición necesitan backend ≥ 2.7.0 | Resuelto (15/11) | — |
| O5 | Prueba externa de Juan José (15/11, modo prueba) | Pedir la grabación y el pulso del mago | Ajuste |

### 3.3 Métricas

| # | Implicación | Acción | Sev. |
|---|---|---|---|
| M1 | SUS y NASA-TLX de quien opera, minutos y toques por etapa | Al plan de pruebas como **contexto**, no como métrica principal; contárselo a Néstor | Ajuste |
| M2 | `decisiones` reemplaza a `votos` como fuente de rondas y vetos | El análisis usa `decisiones` en las dos condiciones (requiere `n8n.N1`) | Validez |
| M3 | Se quitó «Trabajo» de los tipos de grupo | Un grupo «trabajo» queda fuera de foco en el análisis | Ajuste |

### 3.4 Privacidad

- Aviso **v2-2026-11** publicado el 23/11: nombra la disponibilidad (`linea_base`) y la lista de espera. `pulso_mago` y `medicion_consola` solo guardan datos del equipo. La consola enmascara los teléfonos (Ley 1581).
- **Aviso v3** (borrador en `claude/aviso-privacidad-v3-borrador.md`): nombra a n8n como encargado y dice que los mensajes salen sin revisión humana previa. Se publica **antes** del grupo real de E1.5.

### 3.5 Otras etapas

- **E3:** sin impacto. El mapa por etapas y la cola de mensajes se pueden reutilizar.
- **Pitch y KTH:** la medición de la consola es evidencia de Technology y del costo operativo. Ninguna cifra es resultado mientras el piloto no la tenga.

## 4. Pendientes, en orden

El home muestra los tres primeros abiertos. Fechas, frentes y notas viven en `tools/tablero-curado.json`. Lo hecho sale de esta tabla y queda en `CHANGELOG.md`.

| # | Pendiente | Bloquea | Quién | Frente |
|---|---|---|---|---|
| 1 | Ensayo con WhatsApp real, 28–29/11 (guion en el Proyecto). Antes, en iPhone y Android: Maps, «Falta un paso», 5 toques en el glifo, `/decks` y `/equipo` (si algo falla, anotar modelo y navegador). Después: «Empezar piloto real» | Cali (a más tardar 30/11) | Juan José; «Empezar piloto real», José | operacion |
| 3 | Confirmar el grupo de Cali (o el plan B de Katherine) y la fecha, a más tardar el 30/11. Modo piloto y encuesta actual | Cali | Katherine | operacion |
| 24 | Reglas de descarte (pago de quien organiza, acompañamiento) y métricas por fase, antes de los datos. Borrador en `claude/reglas-antes-de-los-datos.md`; falta elegir antes de Cali | Pitch | Katherine, con José | investigacion |
| 25 | Regla de seguir o parar. Definiciones decididas (§0); falta la regla de salida (opciones en `claude/reglas-antes-de-los-datos.md`) | Pitch | Equipo | investigacion |
| 26 | Qué es error en E1.5 y sobre qué base (d3), y tabla por tipo de mensaje con dueño de cada carril (d4). Opciones listas; falta llevárselas a Néstor antes del grupo de E1.5 | Pitch | Katherine y José | investigacion |
| 27 | Canvas de 9 bloques con estatus, n y regla. Borrador en `claude/canvas-9-bloques.md` (4 variantes de pagadores); falta la revisión del equipo y ajustarlo después de Cali | Pitch | Katherine y José | investigacion |
| 28 | Aplicar las reglas a los resultados (30/11) | Pitch | Katherine y José | investigacion |
| 29 | Diapositiva 5 (competir contra el plan que no pasa) y respuesta sobre Meta. Borrador en `claude/pitch-lecturas-29-30-32.md`; falta que José lo apruebe | Pitch | José | pitch |
| 30 | Cuadro estratégico y ERIC en lugar de la tabla de soluciones parciales. Borrador en `claude/pitch-lecturas-29-30-32.md`; falta aprobarlo | Pitch | José y Katherine | pitch |
| 31 | Qué cuenta como «cerrar E1» (d2), a más tardar el 3/12. Opciones en `claude/reglas-antes-de-los-datos.md` | Pitch | Katherine y José | investigacion |
| 32 | «No hacer nada» en la matriz de oportunidades (hito del 4/12, no entrega). Borrador en `claude/pitch-lecturas-29-30-32.md`; falta aprobarlo | Pitch | Katherine y José | investigacion |
| 42 | Instrucciones v3.7 (v3.6 §3.8 y §4.1) y base de conocimiento §4 con lo decidido el 27/11 (§0, «Reglas fijas»). José la pega en el Proyecto | Rigor del Proyecto | José, con Claude | casa |
| 4 | Imprimir la oleada 1 del POP (pines, stickers, tarjetas, volante). El tótem espera la plantilla de Juan Carlos; falta el logo vectorial de Icesi | POP | Equipo | pop |
| 10 | Ola 2 de la auditoría UI/UX (una guía en la consola, inscripción en 3 pasos): después de Cali | Siguiente fase | José | plataforma |
| 36 | Después de Cali: `n8n.N1–N27` según el orden del §9 de `n8n/GUIA-CONTINUACION.md` (sin `n8n.N25` ni `n8n.N6`, cancelados el 27/11) y pegar `n8n/snippets/` como plantilla de respaldo | E1.5 | Equipo, con Claude | motor |
| 37 | Después de Cali: `view=motor` en el backend (`n8n.N27`) | E1.5 | Equipo, con Claude | motor |
| 38 | Después de Cali: relay según `n8n/relay/SPEC.md` (`relay.D1–D2` al asegurar los flujos, `relay.D3` con los logs del mago) | E1.5 | Equipo, con Claude | motor |
| 39 | Después de Cali: `n8n.B5`, `n8n.I5`, autenticación del webhook, reintentos, flujo de errores, filtro al grupo de prueba, sin historial en el conector y número dedicado | E1.5 | Equipo, con Claude | motor |
| 40 | Después de Cali: publicar el aviso v3 (§3.4) | E1.5 | Equipo, con Claude | motor |
| 44 | `prueba.P1` en el grupo del equipo, paso a paso en `n8n/PRUEBA-P1.md` (con V1, votos de la encuesta nativa). Revisado el 27/11: E15-00 no guarda datos de las ejecuciones. Falta confirmar «Only trusted URLs». No toca a Cali | E1.5 (`tramo.T1–T2`) | José manda; Claude lee la tabla | motor |
| 45 | Se retoma con E1 en ejecución (dec. 27/11). `n8n/PLAN-agentico.md`. `ag.F0` hecha el 27/11: `n8n/agentes/contrato.md`, `n8n/agentes/voz.md` y `n8n/motor/guardas.js` (`node n8n/motor/prueba-guardas.js` ✓). Falta de `ag.F0`: en Cali, anotar los textos del mago frente a la plantilla. Siguiente: `ag.F1` (`SW · Redactar` y banco, `prueba.P2` de `n8n/PLAN-pruebas.md`), con las credenciales de los modelos que crea José | E1.5 (`ag.F1–F2`) | Claude; nota de Cali, el mago; credenciales, José | motor |
| 46 | Elegir la bienvenida de E1.5 (la de la consola dice que una persona revisa todo): 4 opciones en `n8n/agentes/bienvenida.md`, con el aviso v3 | E1.5 con personas | Equipo y Néstor | motor |
| 47 | Cuando `prueba.P1` pase y José lo confirme: ajustar los avisos (diseño del home y del tablero; aviso v3 con «una IA escribe y otra revisa») | — | Claude | motor |
| 12 | Control de compromisos de los periodos 8 y 9: archivo interno al cierre | Maestría | José | investigacion |
| 16 | Feedback de `_archivo-2026-11-24/` ya en el Drive (27/11). Falta decidir qué se rescata (`INVENTARIO.md`) y conectar `Gemini dump/sintonia-piloto` como carpeta del Proyecto (pasos en `claude/casa-8-9-16.md`); `~/Desktop/sintonia-tags` y `~/sintonia-piloto` se pueden archivar | Orden del Mac | José | casa |
| 18 | Después del análisis: permisos mínimos en `home.yml`, acciones por SHA, lockfile de `tools/qa`, Dependabot, CodeQL, OpenSSF Scorecard, CHANGELOG por componente (`aud.D3`), reglamento de PI de Icesi (`aud.D1`) y buzón de rol (`aud.D2`). Opcional: `https://` y «su +1» en la descripción del repo | Calidad | José; auditoría, equipo con Claude | plataforma |

## 4.1 Prueba de Juan José (15/11, consola 2.7.0, n = 1, modo prueba)

Hallazgos resueltos en las consolas 2.7.1 y 2.7.3 (`CHANGELOG.md`, 15/11). Quedan abiertos:
- «Llegó» y «En casa» se ven al instante desde la 2.7.1. La causa exacta en la hoja está **por confirmar** si se repite.
- Desempeño del mago: la respuesta de Juan José se hizo con la escala anterior (confirmado el 27/11). Si se corrigió `tlx_desempeno` y `tlx_raw`: `[Dato pendiente]`.

## 4.2 Prueba externa (semana del 15/11, n = 1, modo prueba)

Hallazgos y prompts en `docs/prompts-mejoras-prueba-externa.md`; la ola A quedó en la consola 2.8.0 (22/11). Decisiones del 19/11 (P8c) vigentes: la próxima prueba es con Cali y el equipo observa sin intervenir; la disposición a pagar entra en las respuestas de los usuarios.

## 5. Lo que aún no hay

**No hay resultados del piloto.** Las metas son metas del equipo. Los grupos en modo prueba no cuentan en el panel ni en el análisis.
