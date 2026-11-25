# Auditoría de estándares del repositorio · 24/11/2026

Reporte de brechas de `josebdiaz/sintonia-piloto` (rama `main`, commit `befc9bc`) frente a cuatro estándares: los **estándares de comunidad de GitHub**, **OpenSSF Scorecard**, **SemVer 2.0.0** y **Keep a Changelog 1.1.0**.

- **Restricción:** el código está congelado en `piloto/v2.16.0` y `backend/v2.10.0`. Aquí solo se corrigió lo que no es código; lo demás queda como pendiente o como decisión.
- **Método:** revisión de los archivos del repo y de la configuración por la API de GitHub. Es una verificación técnica (n = 0 personas), no un resultado del piloto.
- **Gravedad:** **Alta** = riesgo real para el sitio publicado, la reutilización legal o la trazabilidad del análisis · **Media** = incumple una parte central del estándar · **Baja** = higiene o buena práctica.

## Resumen

| Estándar | Se cumple | Brechas principales | Peor gravedad |
|---|---|---|---|
| Comunidad de GitHub | README y SECURITY.md (perfil de salud: 28 %) | Sin licencia; sin descripción ni temas; sin CONTRIBUTING, código de conducta ni plantillas | **Alta** (licencia) |
| OpenSSF Scorecard (estimación) | Política de seguridad, sin binarios, sin flujos peligrosos, mantenido; escaneo de secretos y *push protection* activos | `main` sin protección; permisos de escritura amplios en un workflow; acciones sin fijar por SHA; sin licencia, SAST ni actualización de dependencias | **Alta** (protección de `main`) |
| SemVer | Formato correcto; el código coincide con los tags del congelamiento; reglas MAYOR/MENOR/PARCHE escritas | Faltan unos 50 tags de versiones intermedias; los tags del congelamiento son ligeros, no anotados | **Media** |
| Keep a Changelog | Declara el formato; fechas ISO; versiones como encabezados; lo más nuevo arriba | Sin tipos de cambio (Agregado, Cambiado, Corregido…); detalle por fecha en «Repositorio» y no por versión; sin «Sin publicar» ni enlaces de comparación | **Media** |

## 1. Estándares de comunidad de GitHub

El perfil de la comunidad marca **28 %** (API `community/profile`, 24/11).

| Elemento | Estado | Gravedad | Acción |
|---|---|---|---|
| README | ✓, pero decía frontend 2.7.1 y backend 2.7.3 (17/11) | Media | **Corregido** en este frente (2.16.0 y 2.10.0, tags del congelamiento) |
| SECURITY.md | ✓ Canal privado y plazo de respuesta de 3 días hábiles | — | — |
| Reporte privado de vulnerabilidades | ✗ Desactivado | Baja | Settings → Code security → *Private vulnerability reporting* (pendiente 7) |
| Correo de contacto publicado | Es la excepción documentada (canal de la Ley 1581 en el aviso de privacidad), pero es un buzón personal | Baja | Decisión: un buzón de rol (p. ej. en sintonia.my) cuando se descongele el código, porque el correo también vive en `piloto/assets/sintonia.js` |
| LICENSE | ✗ No hay | **Alta** | **Decisión del equipo** (ver §5). Sin licencia el material queda con todos los derechos reservados por defecto: nadie puede reutilizarlo y Scorecard lo penaliza |
| Descripción, sitio y temas | ✗ Vacíos | Baja | Settings → About: descripción corta, `https://sintonia.my` y temas (pendiente 7) |
| CONTRIBUTING | ✗ No hay. `CLAUDE.md` y «Cómo trabajar» del README cumplen esa función para el equipo | Baja | Opcional: un CONTRIBUTING de 5 líneas que remita a esos dos |
| Código de conducta | ✗ No hay | Baja | Opcional: el repo no recibe contribuciones externas |
| Plantillas de issues y PR | ✗ No hay | Baja | Opcional, por la misma razón |
| Wiki y Projects | Activos y sin uso | Baja | Desactivarlos en Settings → General |
| Ramas viejas | 6 ramas remotas ya integradas o superadas; el borrado automático al integrar está apagado, aunque el README dice que las ramas se borran | Baja | Activar *Automatically delete head branches* y borrar las superadas después del análisis |

## 2. OpenSSF Scorecard (estimación manual)

**Scorecard nunca se ha corrido sobre este repo:** la API pública responde 404. La tabla es una estimación con los criterios de cada chequeo, no el puntaje oficial. `[Dato pendiente: puntaje oficial]`.

| Chequeo | Estado estimado | Gravedad | Detalle y acción |
|---|---|---|---|
| Branch-Protection | ✗ `main` sin protección ni *rulesets* | **Alta** | `main` publica en GitHub Pages en 1–2 minutos: un push equivocado o forzado llega a sintonia.my sin freno. Proteger `main` (pendiente 7), sin exigir pull requests, como ya se decidió. **Por verificar:** si se exigen los chequeos, el bot del home (`home.yml`) empuja a `main` y podría quedar bloqueado; en ese caso, usar un *ruleset* que exceptúe a GitHub Actions |
| Token-Permissions | ✗ `home.yml` pide `contents: write` para todo el workflow, y también corre en `pull_request` | Media | Mover el permiso de escritura al job que publica y dejar `contents: read` arriba. Es un cambio de CI: después del análisis |
| Pinned-Dependencies | ✗ `actions/checkout@v4` va por etiqueta; `axe-core ^4.10.2` sin archivo de bloqueo (`package-lock.json`) | Media | Fijar las acciones por SHA y versionar el lockfile de `tools/qa/`. Después del análisis |
| Dependency-Update-Tool | ✗ Sin Dependabot ni Renovate | Baja | `.github/dependabot.yml` para `github-actions` y `npm` (`tools/qa`). Después del análisis, para no abrir PR durante el congelamiento |
| SAST | ✗ Sin análisis estático | Baja | CodeQL para JavaScript (gratis en repos públicos). Después del análisis |
| License | ✗ | **Alta** | Ver §1 y §5 |
| Code-Review | ✗ Los commits van directo a `main` | Baja | Aceptado: equipo de 2 personas y la decisión de no exigir PR. Se documenta como riesgo conocido |
| Signed-Releases | No aplica todavía: no hay releases de GitHub | Baja | Opcional: un release por cada tag de congelamiento |
| CII-Best-Practices | ✗ Sin insignia | Baja | No prioritario para un anteproyecto |
| Security-Policy | ✓ SECURITY.md con canal y plazo | — | — |
| Secretos (escaneo y *push protection*) | ✓ **Activos** (API, 24/11). `docs/seguridad-repo.md` y `ESTADO.md` decían «por activar» | — | **Corregido** en la documentación. Los patrones genéricos y la validación de secretos siguen apagados (Baja) |
| Binary-Artifacts | ✓ Sin ejecutables ni binarios | — | — |
| Dangerous-Workflow | ✓ No usa `pull_request_target` ni interpola entradas no confiables | — | — |
| Maintained | ✓ Actividad diaria | — | — |
| Vulnerabilities | Probablemente ✓ (una sola dependencia, `axe-core`) | — | `[Por verificar con el puntaje oficial]` |
| Fuzzing · Packaging | No aplican | — | — |

**Para tener el puntaje oficial:** agregar la acción `ossf/scorecard-action` después del análisis. Es un workflow nuevo, así que no entra en el congelamiento.

## 3. SemVer 2.0.0

| Criterio | Estado | Gravedad | Detalle y acción |
|---|---|---|---|
| Formato MAYOR.MENOR.PARCHE | ✓ `FRONTEND_VERSION = '2.16.0'`, encabezado del backend `v2.10.0` | — | — |
| Reglas de incremento escritas | ✓ README «Versiones», adaptadas al piloto (MAYOR = cambia el diseño del experimento) | — | — |
| Código = tag | ✓ Los tags `piloto/v2.16.0` y `backend/v2.10.0` apuntan a `2a81fd3`, y desde ahí no hay cambios en `piloto/` ni en `backend/` | — | El congelamiento está íntegro |
| Un tag por versión publicada | ✗ Faltan los tags de **unas 50 versiones** (28 del frontend, 22 del backend): frontend 2.0.4, 2.0.6, 2.0.8, 2.1.0–2.6.0 y 2.7.1–2.15.0; backend 2.2.0, 2.2.4, 2.2.6, 2.3.0–2.7.1 y 2.7.3–2.9.3; datos v3 | Media | Ya es el pendiente 13. Cada fila de medición guarda `consola_version`: sin tag, no se puede reconstruir la versión exacta que usó un grupo. Método: ubicar con `git log -S "FRONTEND_VERSION: '2.x.y'"` el commit donde cambió cada versión y crear el tag ahí |
| Tags anotados | ✗ Los del congelamiento son **ligeros**: no guardan fecha, autor ni mensaje. El README pide `git tag -a` | Media | Recrearlos como anotados **sobre el mismo commit** (no cambia código): `git tag -fa piloto/v2.16.0 2a81fd3 -m "…"` y `git push -f origin piloto/v2.16.0`; igual para el backend (pendiente 13) |
| Orden de fechas | 2.4.0 figura con fecha 15/11 y 2.5.0 con 14/11, en el frontend y en el backend | Baja | `[Por verificar]`: probablemente es un error de fecha en el CHANGELOG, no de versión |
| Datos | El inventario usa v1, v2 y v3, sin SemVer | Baja | Aceptable y documentado |

## 4. Keep a Changelog 1.1.0

| Criterio | Estado | Gravedad | Detalle y acción |
|---|---|---|---|
| Declara el formato y SemVer | ✓ | — | — |
| Lo más nuevo arriba · fechas ISO | ✓, salvo el orden de 2.4.0 y 2.5.0 (§3) | Baja | — |
| Una sección por versión | Parcial. Desde la 2.3.0, el detalle vive en «Repositorio», por fecha; las secciones por componente solo traen un título | Media | El estándar pide los cambios por versión. Funciona como **bitácora** del repo más que como changelog |
| Tipos de cambio (Agregado, Cambiado, Obsoleto, Eliminado, Corregido, Seguridad) | ✗ No se usan | Media | Es lo central del estándar. Aplicarlo desde la próxima versión |
| Sección «Sin publicar» (*Unreleased*) | ✗ | Baja | Agregarla cuando se descongele |
| Encabezado `## [x.y.z] - AAAA-MM-DD` | Parcial: `### [x.y.z] · fecha · título` | Baja | Aceptable si se mantiene igual en todo el archivo |
| Enlaces de comparación al final | ✗ Los `[x.y.z]` no enlazan | Baja | Requiere los tags del pendiente 13 |
| Tamaño | 87 KB y tres componentes en un solo archivo | Baja | — |

**Propuesta, después del análisis:** un CHANGELOG por componente (`piloto/CHANGELOG.md`, `backend/CHANGELOG.md`), con tipos de cambio y enlaces de comparación, y la bitácora por fecha en un archivo aparte. Antes hay que revisar `tools/home.py`, que lee `CHANGELOG.md` para la tarjeta «último cambio» del home.

## 5. Decisiones abiertas

| # | Decisión | Opciones | Quién |
|---|---|---|---|
| D1 | **Licencia** del repo | (a) Una licencia de software para el código y otra de contenido para los textos y decks; (b) declarar «todos los derechos reservados» de forma explícita; (c) consultar primero las reglas de propiedad intelectual de Icesi para trabajos de grado | Equipo, con la universidad. Las implicaciones legales no se resuelven en este reporte |
| D2 | Buzón de rol para el canal de privacidad y de seguridad | Mantener el actual (excepción documentada) o crear uno en sintonia.my al descongelar | Equipo |
| D3 | Reestructurar el CHANGELOG (§4) | Después del análisis o al cierre de la maestría | José |

## 6. Qué se corrigió en este frente (sin tocar código)

- `README.md`: estado y tabla de versiones al día (2.16.0 · 2.10.0, tags del congelamiento) y nota de que esos tags son ligeros.
- `docs/seguridad-repo.md`: el escaneo de secretos y la *push protection* figuran como activos (verificado el 24/11). Se agrega el reporte privado de vulnerabilidades como control por activar.
- `ESTADO.md` y `CHANGELOG.md`: este frente cerrado y los pendientes nuevos.

## Implicaciones

- **Para el piloto (activación → interacción → continuidad):** ninguna brecha toca lo que viven los participantes. Lo que más pesa es que `main` sin protección puede cambiar el sitio en plena prueba con Cali, justo cuando rige el congelamiento.
- **Para el análisis y la sustentación:** los tags que faltan (pendiente 13) son la base de la trazabilidad. Sin ellos no se puede demostrar qué versión usó cada grupo, y eso es sesgo metodológico, una de las 5 dimensiones de riesgo.
- **Siguiente fase:** las brechas de CI (permisos, SHA, Dependabot, CodeQL, Scorecard) y la reestructuración del CHANGELOG van después del análisis, junto con la ola 2 de la auditoría UI/UX.
