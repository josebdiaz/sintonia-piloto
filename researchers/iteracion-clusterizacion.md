# Iteración futura · Algoritmo de clusterización (Sintonía)

> Punto de partida para trabajar cómo Sintonía pasaría de **agrupar a mano** a **proponer microgrupos con un algoritmo**, integrando las señales que ya capturan los experimentos. No es una capacidad validada: se diseña para **probarse**, no para prometerse.

## 1. Qué problema resuelve

Hoy los 4–8 asistentes de cada microencuentro se arman a mano. La hipótesis de producto es que **la forma de agrupar cambia la calidad de la conexión**. El algoritmo debe proponer grupos que maximicen conexión, respetando restricciones duras (seguridad, consentimiento, logística). El clustering conecta los cuatro mecanismos: activación (quién entra), última milla (dónde), interacción (cómo fluye el grupo) y continuidad (quién quiere repetir).

## 2. Señales que ya capturamos (features candidatos)

| Fuente | Señal | Uso en el modelo |
|---|---|---|
| Screener H1 | Trabajo remoto/híbrido, falta de compañía, ganas de socializar | Perfil base (Mateo) |
| Landing / City | Zona, horario, energía disponible | Proximidad geográfica y de agenda (última milla) |
| Afinidad | Actividad preferida (cata, juegos de mesa, coworking), tema | Similitud de intereses |
| H3 (video) | Participa sin prompt, distribución de voz, seguridad | Estilo de interacción (equilibrar dominantes / reservados) |
| H4 (pulso) | Agrado, intención, **señal recíproca (quién ⇄ quién)**, opt-in | Grafo de afinidad real y demanda de repetir |
| Calificar | Agrado, comodidad, facilidad | Retroalimentación de calidad por grupo |

**Restricciones duras** (no se optimizan, se cumplen): seguridad, consentimiento, no mezclar menores con adultos desconocidos, viabilidad de llegada. **Blandas** (se optimizan): afinidad, geografía, equilibrio de participación.

## 3. Enfoque por fases (de lo simple a lo aprendido)

- **Fase 0 · Reglas heurísticas transparentes.** Agrupar por zona + horario + afinidad de actividad, con un tope de "estilos dominantes" por grupo. Explicable y suficiente con n pequeño. Es el baseline contra el que se compara todo lo demás.
- **Fase 1 · Clustering no supervisado.** Vector de features por persona (afinidad, disponibilidad, geo, estilo), normalizado; k-means o clustering jerárquico para formar grupos de 4–8; la señal recíproca de H4 se modela como un **grafo** (aristas = doble opt-in) y se corre detección de comunidades para "grupos que ya quieren repetir".
- **Fase 2 · Aprender de resultados.** Solo con volumen: usar qué grupos funcionaron (participación H3, doble opt-in y repetición H4) como etiqueta para afinar el peso de cada feature. Requiere muchas tandas; no antes.

## 4. Cómo se valida (no se cree, se prueba)

El clustering es una hipótesis más, con su Experiment Card: **grupos formados por el algoritmo vs. grupos aleatorios**, midiendo las métricas que ya tenemos —participación autoguiada (H3), doble opt-in y acción fechada (H4), agrado (calificar)—. Umbral definido antes. Si el algoritmo no supera al azar, se itera o se descarta, sin mover la meta.

## 5. Datos y realidad actual

Con n=4 por sesión **no hay datos para entrenar nada**. El orden correcto: (a) acumular varias tandas con los instrumentos actuales, (b) correr Fase 0 (reglas) en paralelo, (c) recién con volumen pasar a Fase 1. La clusterización se habilita cuando la evidencia lo permita, coherente con el KTH readiness del proyecto.

## 6. Riesgos y ética (a cuidar desde el diseño)

- **Sesgo/segregación:** que el algoritmo agrupe siempre a los mismos perfiles. Vigilar diversidad y dar rotación.
- **Transparencia:** la persona debería poder entender por qué quedó en un grupo; nada de caja negra.
- **Privacidad:** features mínimos; no acumular datos sensibles para "afinar".
- **Alcance:** no es matching romántico ni promesa de amistad; es curaduría de grupos para una actividad.

## 7. Cómo se integra a lo ya construido

- Entrada: las hojas `events`, `calificaciones` y `pulso` (y el grafo de dobles opt-in del panel de `pulso.html`) ya son la materia prima.
- Salida: una propuesta de grupos que alimenta la **Ficha de llegada** (a quiénes citar, mismo destino/ventana) y el **microencuentro H3**.
- Próximo paso concreto sugerido: escribir la **Experiment Card de "agrupación algorítmica vs. azar"** y definir qué features de Fase 0 usaríamos con los datos de las primeras tandas.

*Sintonía · Periodo 4 → siguiente iteración. Documento de trabajo, no arquitectura cerrada.*
