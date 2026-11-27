# Snippets de E1 para n8n

`sintonia-e1.js` trae **la misma lógica y los mismos textos que la consola de E1**, copiados del tag del congelamiento (`piloto/v2.16.0`), para pegarlos en los nodos Code de n8n. Así E1.5 no reescribe textos ni reglas a mano y la comparación E1/E1.5 sigue siendo justa.

- **Se genera, no se edita:** `python3 n8n/snippets/construir.py`. Si cambia la consola (nueva versión y tag), se vuelve a generar con `--tag`.
- **Prueba:** `node n8n/snippets/prueba.js`. Compara con la consola original en 753 casos ficticios, corriendo en UTC, Asia/Tokyo y Bogotá. Tiene que terminar en ✓. Es verificación técnica (n = 0).
- **Hora de Cali:** n8n corre en UTC. El snippet usa una fecha fija en UTC-5 (Colombia no tiene horario de verano). Sin eso, las horas salen 5 h corridas: la prueba lo muestra si se corre el código original en UTC.
- Sin claves, nombres ni números: los datos entran por los argumentos.

## Cómo se usa en un nodo Code

Pega todo `sintonia-e1.js` al inicio del nodo y después:

```js
const r = SINTONIA.texto('/confirmado', { plan, grupo });          // { txts: [...], poll?, evento? } o null si todavía no aplica
if (!r || SINTONIA.tieneCorchetes(r)) throw new Error('no_listo'); // N3: nada con [corchetes] sale al grupo
return r.txts.map(t => ({ json: { texto: t } }));
```

`plan` y `grupo` tienen la forma de la consola (ver el comentario de `texto()` en el archivo). `SINTONIA.comandos` lista los 23 comandos.

## Qué cierra (`GUIA-CONTINUACION.md` §7 y §8)

| # | Dónde | Uso |
|---|---|---|
| N2 · N17 | Nodos `Textos` de W0–W5 | `SINTONIA.texto(cmd, …)` en vez de plantillas pegadas |
| N3 | `SW · Enviar` | `SINTONIA.tieneCorchetes(r)` → no se envía y vuelve a aprobación |
| N12 | W1 | `SINTONIA.fechasPlan(grupo)` → `fechas` en `proponer_ia`; `texto('/dia', …)` para «¿Qué día?» |
| N13 | W3, W4 | `SINTONIA.plazo(plan)` para `/confirmado` y para no mandar `/hoy` ni `/salida` antes |
| N14 | W1, W3 | `texto('/opcion_n')`, `/confirmado` y `/evento` ya traen el formato de 4 líneas, `precioUno` y `dondeTxt` |
| N1 · N15 | W1, W2 | `texto('/encuesta')` y `texto('/recordatorio', { conteos })`: devuelve `null` cuando ya votaron todos, igual que la consola |
| N18 | W5 | `texto('/retro', { persona_pid })` arma el enlace personal (`SINTONIA.linkRetro`) |
| N20 | Todo llamado que escribe | `req_id: SINTONIA.reqId(plan_id, 'cerrar_plan', ronda)` |

## Lo que falta del lado del backend (después del congelamiento)

Con `MOTOR_KEY`, n8n solo puede leer `view=plan` (con un `pid`) y `view=resolver`. `view=plan` **no trae** la disponibilidad ni los `pid` de los miembros, `n_llegaron` (W4 lo usa) ni `t_cerrado`. Sin eso, `fechasPlan`, el enlace personal de `/retro` y las llegadas no se pueden alimentar desde n8n. Propuesta: una `view=motor` con `MOTOR_KEY` que devuelva plan y grupo con `pid`, disponibilidad, estado por persona y conteos, **sin nombres ni números**. Los textos a una persona (`/no_llega`, `/salida` personal) usan el nombre: decidir si E1.5 los manda sin nombre o si la vista trae el nombre de pila.

## Pruebas con relojes cortos (N23)

Mientras se prueban los flujos tal como están: en cada `Config` de W2–W5, un campo `modo_prueba` (sí/no). En sí, los filtros de tiempo se cambian por minutos (por ejemplo, 2 h → 2 min) **solo** para grupos con `modo = prueba`. Así la prueba dura minutos y no toca grupos del piloto.
