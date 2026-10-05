# SINTONÍA · MASTER PROMPT DE EJECUCIÓN Y COMPENDIO DE REFERENCIA TÉCNICA (PERIODO 6)

*Documento Maestro de Arquitectura, Especificación de Software y Prompt de Ejecución Turnkey*  
*Proyecto de Grado: Sintonía · Sistema de Orquestación Multiagente para Coordinación Social Urbana*  
*Maestría en Gestión de la Innovación · Universidad Icesi, Cali, Colombia*  
*Investigadores: José Alberto Bolaños Díaz & Katherine Castro*  
*Fecha: Octubre de 2026 · Cali, Valle del Cauca, Colombia*

---

# GUÍA DE USO DE ESTE DOCUMENTO

Este archivo contiene:
1. **EL MASTER PROMPT EJECUTABLE (Bloque 1):** Una directiva completa, autosuficiente y ejecutable que puede entregarse a cualquier agente de inteligencia artificial o desarrollador para regenerar, verificar, configurar o extender la totalidad del sistema Sintonía (backend, base de datos y las 7 interfaces web).
2. **EL COMPENDIO DE REFERENCIA TÉCNICA (Bloque 2):** Todos los esquemas de datos, contratos de API, especificaciones de interfaces, catálogo de 27 lugares, reglas éticas (I1–I9), modelos financieros de tokens y el sistema verbal (*Verbatum Sintonía*) al que hace referencia el prompt.

---

# BLOQUE 1: MASTER PROMPT DE EJECUCIÓN TURNKEY

```markdown
<MASTER_EXECUTION_PROMPT>
Actúa como Ingeniero Principal de Software (Lead Full-Stack Engineer) y Especialista en Arquitectura de Sistemas con IA para el Proyecto Sintonía (Maestría en Gestión de la Innovación, Universidad Icesi).

Tu objetivo es implementar, verificar y desplegar de extremo a extremo la suite operativa del piloto experimental de Sintonía para el Periodo 6 en Cali (condiciones E1 · WhatsApp Business / Mago de Oz y E2 · Web App autónoma).

Debes ejecutar las siguientes directivas con precisión técnica absoluta, apoyándote en las especificaciones del Compendio de Referencia:

### FASE 1: DESPLIEGUE Y CONFIGURACIÓN DEL BACKEND (GOOGLE APPS SCRIPT)
1. Conecta el backend implementado en `Codigo_Piloto_v2.gs` con la hoja de cálculo oficial de Google Drive:
   - Nombre de la hoja: "Sintonía piloto v2"
   - SHEET_ID: 1sePqGZUlGkiWQp57Ti5o4XwKiGP66gtuRjItHTkYYG8
   - Carpeta contenedora en Drive: "Sintonía · Piloto v2" (ID: 1xaGLdVdHfXyyOMPU7IbM5vv0MRoLbN5F)
2. En el editor de Apps Script (Extensiones -> Apps Script), configura las siguientes Propiedades del Script (Script Properties):
   - SHEET_ID = 1sePqGZUlGkiWQp57Ti5o4XwKiGP66gtuRjItHTkYYG8
   - ADMIN_KEY = [Clave secreta del equipo, mínimo 20 caracteres]
   - GEMINI_API_KEY = [Clave de Google AI Studio con facturación activa para privacidad ética]
   - GEMINI_MODEL = gemini-2.5-flash
   - PRICE_IN_PER_M = 0.075
   - PRICE_OUT_PER_M = 0.30
   - COSTO_HORA_HUMANA_COP = 25000 (valor de referencia para costeo del Mago)
   - AVISO_VERSION = v1-2026-10
3. Asegura la inicialización de las 15 pestañas del esquema en la hoja de cálculo:
   `participantes`, `contactos`, `grupos`, `linea_base_grupo`, `linea_base`, `preferencias`, `inventario`, `planes`, `votos`, `eventos`, `operacion`, `cambios`, `tokens`, `retro`, `wtp`.
4. Carga en la pestaña `inventario` las 14 columnas de los 27 lugares verificados de Cali (17 activos y 10 por confirmar con teléfonos de llamada).
5. Despliega la aplicación web como:
   - Ejecutar como: "Yo" (propietario)
   - Quién tiene acceso: "Cualquier usuario" (anónimo/público)
   - URL activa oficial:
     https://script.google.com/macros/s/AKfycbxAcvVsAzOioVrGuAhuNx9sOI4p09CZr6oMhvCsB6ww4ywFTnbzDzCZQp1o1qYRXLC8/exec

### FASE 2: CONSTRUCCIÓN Y DESPLIEGUE DEL FRONTEND (GITHUB PAGES)
Construye, verifica y guarda los siguientes 7 archivos HTML dentro del directorio local:
`/Users/josebolanosd/Documents/Gemini dump/sintonia-piloto/archivo/piloto-m2-gemini/`

1. `index.html` (Landing del Organizador y Creación de Grupo):
   - Lee `?exp=E1` o `?exp=E2`, y `?modo=prueba` o `piloto`.
   - Captura línea base del grupo (I1, I2: tipo_grupo, n_invitados de 2 a 8, tamano_grupo, planes_realizados_mes, planes_fallidos_mes, quien_organiza, fatiga_previa de 1 a 5).
   - Captura preferencias y restricciones del plan para el fin de semana.
   - Captura datos de contacto (nombre de pila y WhatsApp) y consentimiento informado individual (4 casillas obligatorias: Ley 1581, opt-in de mensajería, mayoría de edad +18 y estudio de Icesi).
   - Incluye botón ergonómico: `[✓ Marcar "Sí a todo"]`.
   - Envía POST con `action: 'registrar'`. Al completar, muestra pantalla con el Enlace Único de Invitación (`unirse.html?inv=[codigo_invitacion]`) y botones para copiar y compartir vía WhatsApp Web (`https://wa.me/?text=...`).

2. `unirse.html` (Registro y Opt-in de Miembros Invitados):
   - Lee `?inv=[codigo_invitacion]`.
   - Captura nombre de pila, WhatsApp, preferencias individuales y fatiga previa.
   - Botón `[✓ Marcar "Sí a todo"]` y las 4 casillas obligatorias.
   - Envía POST con `action: 'registrar'` vinculando el código de invitación.
   - Pantalla de éxito con aviso de confidencialidad y confirmación.

3. `mago.html` (Consola de Operaciones de E1 · Autenticación con ADMIN_KEY):
   - Consulta `doGet?view=mago&key=[ADMIN_KEY]`.
   - Monitoreo de quórum con regla de exclusión I9 (botón para ejecutar `action: 'cerrar_reclutamiento'`).
   - Directorio de contactos de la hoja `contactos` con enlaces directos para iniciar chat en WhatsApp (`https://wa.me/[numero]`).
   - Botón de emergencia para revocar participante (`action: 'revocar'`).
   - Creación de plan (`action: 'crear_plan'`) y solicitud de 3 opciones curadas a Gemini (`action: 'proponer_ia'`).
   - Editor de opciones en pantalla (Human-in-the-loop) y botón para publicar (`action: 'publicar_plan'`).
   - Panel de copiado rápido al portapapeles de los 8 mensajes estandarizados de WhatsApp con voz de marca (`/ingreso`, `/opciones`, `/recordatorio`, `/confirmado`, `/checkpoint`, `/retro`, `/guardrail`, `/humano`).
   - Botones rápidos de registro de eventos (`me_apunto`, `checkpoint_llegada`, `llego_casa`).
   - Bitácora de trabajo humano (I3): registro de minutos y causa en la hoja `operacion`.
   - Botón para cerrar plan con opción ganadora o marcar caído (`action: 'cerrar_plan'`).

4. `plan.html` (Interfaz de Votación y Coordinación E2 · Web App Autónoma):
   - Lee `?plan_id=[plan_id]&pid=[pid]`. Consulta `doGet?view=plan&plan_id=...&pid=...`.\n   - Manejo de estados: `preparando`, `votando`, `cerrado`, `caido`.
   - En votación: muestra las 3 opciones curadas, botones para votar por opción 1, 2 o 3, botón de Veto (\"Ninguna me sirve\"), envío a `action: 'votar'` y recuento de votos anónimo en vivo.
   - En cerrado: ficha logística del plan ganador (*\"Ruta clara, ganas intactas\"*), botón de confirmación (\"Me apunto\"), botón de checkpoint (\"Llegué\") y enlace a evaluación post-plan.

5. `retro.html` (Evaluación Post-Salida Compartida E1 y E2):
   - Lee `?plan_id=[plan_id]&pid=[pid]`.
   - Escalas cuantitativas 1–5 para fatiga post, valor final y confort con el asistente.
   - Si `rol === 'organizador'`, despliega la pregunta de carga de organización (1–5) y el módulo Van Westendorp (WTP) con 4 precios en COP (Muy barato, Barato, Caro, Muy caro) y checkbox de preventa sin cobro.
   - Pregunta de intención de repetición (`si`, `no`, `talvez`), sentimiento autodeclarado y comentario abierto (máx. 600 car.).
   - Envío a `action: 'retro'` y `action: 'wtp'`.

6. `panel.html` (Dashboard Analítico y Auditoría Financiera · Admin):
   - Autenticado con `ADMIN_KEY`. Consulta `doGet?view=panel&key=[ADMIN_KEY]`.
   - Excluye automáticamente grupos en modo prueba y excluidos (I7, I9).
   - Comparación en dos columnas: E1 (WhatsApp Business) vs. E2 (Web App).
   - Métricas: embudo de conversión (invitados -> consentidos -> apuntados -> llegaron), métrica principal (`llegaron / invitados`), cumplimiento (`llegaron / apuntados`), % de cierres sin veto, horas promedio a cierre, repetición de grupos, fatiga y confort.
   - Auditoría de costos: tokens de Gemini en USD (total y por plan cerrado), minutos del Mago y costo humano en COP.
   - Tabla de precios declarados por organizadores (WTP).

7. `aviso.html` (Aviso Legal de Privacidad):
   - Documento legal completo conforme a Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia.
   - Principios de disociación de datos, minimización en IA, confidencialidad académica para Universidad Icesi, y procedimiento para revocación inmediata y supresión de datos.

### FASE 3: VERIFICACIÓN Y CONTROL DE VERSIONES EN GIT
1. Configura en todos los HTML la URL oficial de Apps Script en `CONFIG.BACKEND_URL`.
2. Verifica que el árbol de trabajo local en `/Users/josebolanosd/Documents/Gemini dump/sintonia-piloto/` esté limpio.
3. Asegura la gestión y sincronización de las ramas en GitHub (`https://github.com/josebdiaz/sintonia-piloto`):\n   - Rama `main`: producción base estable.
   - Rama `M1-gemini`: hito 1 (interfaces frontend completas y conexión Apps Script).
   - Rama `M2-gemini`: hito 2 (protocolo de operación E2, contingencias, failover y ensayos).
4. Ejecuta un smoke test para garantizar que no existan errores 404, fallas de CORS ni campos huérfanos.
</MASTER_EXECUTION_PROMPT>
```

---

# BLOQUE 2: COMPENDIO DE REFERENCIA TÉCNICA Y ESPECIFICACIONES

## 1. Arquitectura del Sistema Sintonía (v2.1)

```
[ PARTICIPANTES ]
 (Móviles / PC sin instalar software nuevo)
        │
        ├── E1: WhatsApp Business (Línea Sintonía · Mago de Oz)
        │         ▲
        │         │  (Interacción humana supervisada + Quick Replies)
        │         ▼
        │   [ CONSOLA DEL MAGO: mago.html ] ──(ADMIN_KEY)──┐
        │                                                  │
        └── E2: Enlaces Web Únicos                         │
              ├── index.html   (Landing Organizador)       │
              ├── unirse.html  (Registro Amigos)           │
              ├── plan.html    (Votación / Logística)      │
              ├── retro.html   (Evaluación / WTP)          │
              └── aviso.html   (Aviso de Privacidad)       │
                                                           │
                                                           ▼
                             [ BACKEND GOOGLE APPS SCRIPT: Codigo_Piloto_v2.gs ]
                                         │                    │
                            (Prompt curado / JSON)   (Read / Write vía Sheets API)
                                         ▼                    ▼
                           [ GOOGLE GEMINI API ]     [ GOOGLE SHEETS ]
                          (gemini-2.5-flash / Pago)   (\"Sintonía piloto v2\" · 15 hojas)
```

---

## 2. Esquema de Datos en Google Sheets (\"Sintonía piloto v2\")

La hoja maestra con ID `1sePqGZUlGkiWQp57Ti5o4XwKiGP66gtuRjItHTkYYG8` contiene 15 pestañas estructuradas de forma normalizada:

| Pestaña | Columnas del Esquema | Propósito y Reglas |
|---|---|---|
| `participantes` | `ts`, `pid`, `grupo_id`, `rol`, `experimento`, `autoriza_datos`, `optin_whatsapp`, `mayor_18`, `consent_investigacion`, `aviso_version`, `estado` | Registro ético. `estado` puede ser `activo` o `revocado`. No contiene nombres ni teléfonos. |
| `contactos` | `ts`, `pid`, `nombre_pila`, `whatsapp` | **Tabla protegida y disociada.** Solo accesible por el Mago con `ADMIN_KEY`. Los teléfonos se formatean con código de país. |
| `grupos` | `ts`, `grupo_id`, `experimento`, `modo`, `organizador_pid`, `codigo_invitacion`, `tipo_grupo`, `tamano_grupo`, `n_invitados`, `estado`, `motivo`, `version` | Unidad de análisis. `estado` puede ser `reclutando`, `activo` o `excluido`. `version` inicia en `v1`. |
| `linea_base_grupo` | `ts`, `grupo_id`, `tipo_grupo`, `tamano_grupo`, `planes_realizados_mes`, `planes_fallidos_mes`, `quien_organiza`, `fatiga_previa_org` | **Regla I1:** La línea base histórica se mide a nivel de grupo para contextualizar la fricción. |
| `linea_base` | `ts`, `pid`, `grupo_id`, `fatiga_previa` | Nivel de fatiga declarado individualmente por cada miembro antes del piloto (escala 1 a 5). |
| `preferencias` | `ts`, `pid`, `grupo_id`, `resumen` | Resumen cualitativo de gustos, restricciones alimentarias o zonas preferidas (máx. 400 car.). |
| `inventario` | `id`, `categoria`, `nombre`, `zona`, `direccion`, `costo_aprox`, `horario`, `duracion`, `acceso`, `apto_para`, `fuente`, `verificado_el`, `estado`, `telefono_para_llamar` | **Regla I6:** Catálogo cerrado de 27 lugares de Cali. Solo los lugares con `estado === 'activo'` son inyectados a Gemini. |
| `planes` | `ts`, `plan_id`, `grupo_id`, `experimento`, `ronda`, `version`, `estado`, `opciones_json`, `elegida`, `t_propuesto`, `t_publicado`, `t_cerrado`, `n_invitados`, `n_consentidos`, `n_apuntados`, `n_asistentes`, `nota` | Ciclo de vida del plan (`borrador`, `en_revision`, `votando`, `cerrado`, `caido`). Registra las marcas temporales para medir horas hasta el cierre. |
| `votos` | `ts`, `plan_id`, `pid`, `opcion`, `veto` | Votación del grupo. `opcion` (1, 2 o 3) o `veto` (true). Cada voto reemplaza al anterior del mismo `pid`. |
| `eventos` | `ts`, `plan_id`, `grupo_id`, `pid`, `tipo`, `canal`, `nota` | Registro de trazabilidad: `activacion`, `recordatorio`, `me_apunto`, `no_puedo`, `checkpoint_llegada`, `llego_casa`, `plan_caido`. |
| `operacion` | `ts`, `plan_id`, `grupo_id`, `experimento`, `actor`, `minutos`, `causa`, `nota` | **Regla I3:** Bitácora de trabajo humano del Mago para costeo de minutos de operación. |
| `cambios` | `ts`, `experimento`, `version`, `descripcion`, `registrado_por` | **Regla I4:** Change log. Permite únicamente un cambio por condición entre W1 y W2. |
| `tokens` | `ts`, `plan_id`, `grupo_id`, `uso`, `modelo`, `prompt_version`, `tokens_in`, `tokens_out`, `costo_usd` | Registro auditable del consumo de tokens y costo financiero de cada llamada a Gemini. |
| `retro` | `ts`, `plan_id`, `pid`, `rol`, `fatiga_post`, `carga_organizador`, `valor_final`, `repetiria`, `confort_bot`, `sentimiento_autodeclarado`, `comentario` | Evaluación post-plan de 2 minutos completada por los participantes. |
| `wtp` | `ts`, `pid`, `grupo_id`, `muy_barato`, `barato`, `caro`, `muy_caro`, `preventa` | **Regla I5:** Sensibilidad de precio (Van Westendorp) y preventa sin cobro, exclusiva para el organizador. |

---

## 3. Especificación de Endpoints del Backend (`Codigo_Piloto_v2.gs`)

### Peticiones POST (`doPost`)
Todas las peticiones reciben `Content-Type: application/json` y devuelven `{ ok: true, ... }` o `{ ok: false, error: '...' }`.

1. **`registrar`**:
   - Parámetros: `experimento`, `modo`, `nombre_pila`, `whatsapp`, `autoriza_datos`, `optin_whatsapp`, `mayor_18`, `consent_investigacion`.
   - Si no incluye `codigo_invitacion`: Registra como `organizador`, crea el grupo y guarda `linea_base_grupo`.
   - Si incluye `codigo_invitacion`: Registra como `miembro`, valida quórum y vincula al grupo.
   - Retorno: `{ ok: true, pid, rol, grupo_id, experimento, codigo_invitacion }`.
2. **`cerrar_reclutamiento`**:
   - Parámetros: `key`, `grupo_id`.
   - Lógica: Si `n_activos < n_invitados`, actualiza grupo a `estado: 'excluido'`. Si se cumple el 100%, pasa a `estado: 'activo'`.
3. **`crear_plan`**:
   - Parámetros: `key`, `grupo_id`.
   - Retorno: `{ ok: true, plan_id, ronda, version }`.
4. **`proponer_ia`**:
   - Parámetros: `key`, `plan_id`, `restricciones`.
   - Lógica: Inyecta catálogo cerrado a Gemini, valida que los IDs retornados existan en `inventario`, descarta alucinaciones y guarda en `opciones_json`.
5. **`publicar_plan`**:
   - Parámetros: `key`, `plan_id`, `opciones` (array de 3 opciones curadas). Pasa el plan a estado `votando`.
6. **`votar`**:
   - Parámetros: `plan_id`, `pid`, `opcion` (1, 2 o 3), `veto` (boolean).
7. **`cerrar_plan`**:
   - Parámetros: `key`, `plan_id`, `elegida` (número de opción ganadora), `caido` (boolean), `nota`.
8. **`evento`**:
   - Parámetros: `plan_id`, `grupo_id`, `pid`, `tipo` (`me_apunto`, `checkpoint_llegada`, etc.). Actualiza automáticamente los contadores del embudo.
9. **`operacion`**:
   - Parámetros: `key`, `plan_id`, `grupo_id`, `actor`, `minutos`, `causa`, `nota`.
10. **`registrar_cambio`**:
    - Parámetros: `key`, `experimento`, `version` (`v2`), `descripcion`, `por`. Alerta si se intenta registrar un segundo cambio en la misma condición.
11. **`redactar_ia`**:
    - Parámetros: `key`, `plan_id`, `paso` (`ingreso`, `opciones`, etc.), `tono`, `datos`.
12. **`retro`**:
    - Parámetros: `plan_id`, `pid`, `fatiga_post`, `carga_organizador`, `valor_final`, `repetiria`, `confort_bot`, `sentimiento`, `comentario`.
13. **`wtp`**:
    - Parámetros: `pid`, `muy_barato`, `barato`, `caro`, `muy_caro`, `preventa`. Solo se guarda si el usuario es `organizador`.
14. **`revocar`**:
    - Parámetros: `pid`. Elimina todos los registros asociados al participante, marca `revocado` y excluye al grupo.

### Peticiones GET (`doGet`)
1. **`?view=plan&plan_id=...&pid=...`**: Retorna el estado público del plan, opciones curadas, conteos anónimos de votos y el voto del usuario. No expone nombres ni teléfonos.
2. **`?view=mago&key=[ADMIN_KEY]`**: Retorna los grupos, lista de miembros con teléfonos de la tabla `contactos`, planes e inventario.
3. **`?view=panel&key=[ADMIN_KEY]`**: Retorna el cálculo estadístico comparativo de E1 vs E2, métricas de efectividad, embudo y costos de operación.

---

## 4. Catálogo del Inventario de Planes en Cali (27 Lugares)

| ID | Categoría | Nombre del Establecimiento | Zona | Costo Estimado (COP) | Estado | Teléfono de Llamada |
|---|---|---|---|---|:---:|---|
| **INV-01** | Naturaleza | Ecoparque Cristo Rey | Cerro Los Cristales | Gratis (posible cobro) | `por_confirmar` | `+57 602 8879020` |
| **INV-02** | Naturaleza / Deporte | Cerro de las Tres Cruces | Norponiente | Gratis | `activo` | Acceso público |
| **INV-03** | Cultura | Museo La Tertulia | El Peñón / Río Cali | $15.000–$20.000 | `activo` | `+57 602 8932939` |
| **INV-04** | Cultura / Cine | Cinemateca La Tertulia | El Peñón | $10.000–$15.000 | `por_confirmar` | `+57 602 8932939` |
| **INV-05** | Cultura | Museo del Oro Calima | Centro Histórico | Gratis | `activo` | `+57 602 6847752` |
| **INV-06** | Cultura / Teatro | Teatro Municipal Enrique Buenaventura | Centro Histórico | Variable ($20.000–$50.000) | `por_confirmar` | `+57 602 8839106` |
| **INV-07** | Naturaleza / Fauna | Zoológico de Cali | Santa Teresita | $32.000–$42.000 | `activo` | `+57 602 4880040` |
| **INV-08** | Naturaleza / Botánica | Jardín Botánico de Cali | Comuna 1 / Oeste | $20.000–$25.000 | `activo` | `+57 320 6902263` |
| **INV-09** | Naturaleza / Río | Ecoparque Río Pance | Pance / La Vorágine | Gratis (Parqueo $5.000) | `por_confirmar` | `+57 602 8879020` |
| **INV-10** | Naturaleza | Ecoparque de la Biodiversidad | Corredor Cañaveralejo | Gratis | `activo` | Acceso libre |
| **INV-11** | Deporte / Recreación | Ciclovida Cali | Autopista Suroriental | Gratis | `activo` | Acceso libre domingos |
| **INV-12** | Baile / Salsa | La Topa Tolondra | San Antonio | Cover ~$15.000 | `activo` | `+57 317 4004944` |
| **INV-13** | Baile / Salsa | Zaperoco Bar | San Fernando | Cover ~$25.000–$35.000 | `por_confirmar` | `+57 315 5201370` |
| **INV-14** | Baile / Clase | Son de Luz (Clase grupal) | Alameda | $25.000–$35.000 c/u | `por_confirmar` | `+57 324 8191388` |
| **INV-15** | Baile / Clase | Swing Latino Academia | Alameda | $30.000–$40.000 c/u | `por_confirmar` | `+57 317 8933072` |
| **INV-16** | Gastronomía / Tradición | Galería Alameda (Plaza) | Alameda | $15.000–$35.000 | `activo` | `+57 602 5560117` |
| **INV-17** | Café / Tertulia | Macondo: Desserts & Coffee | San Antonio | $15.000–$30.000 | `activo` | `+57 602 8937989` |
| **INV-18** | Café / Creativo | Typica Arte-Café | San Antonio | $15.000–$30.000 | `por_confirmar` | `+57 301 1011100` |
| **INV-19** | Café / Panadería | Tierradentro Café & Co | San Antonio | $15.000–$28.000 | `activo` | `+57 316 2806281` |
| **INV-20** | Café / Vintage | Pulguero Coffee Shop | San Antonio | $12.000–$25.000 | `activo` | `+57 317 8540899` |
| **INV-21** | Zona Gastronómica | Parque del Perro | San Fernando | $30.000–$60.000 | `por_confirmar` | Según local |
| **INV-22** | Zona Gastronómica | Corredor Granada | Granada | $45.000–$90.000 | `por_confirmar` | Según local |
| **INV-23** | Café / Brunch | Krost Bakery Peñon | El Peñón | $20.000–$40.000 | `activo` | `+57 318 6940801` |
| **INV-24** | Gastronomía Típica | Restaurante Ringlete | Granada | $60.000–$80.000 | `activo` | `+57 602 6601540` |
| **INV-25** | Arte Gráfico / Taller | La Linterna Cali | San Antonio | Recorrido libre (afiches $15k) | `activo` | `+57 316 4627404` |
| **INV-26** | Gastronomía Fusión | Platillos Voladores | Granada | $60.000–$160.000 | `activo` | `+57 602 6687676` |
| **INV-27** | Café de Especialidad | Moreno Café | San Antonio | $15.000–$30.000 | `activo` | `+57 318 4022877` |

---

## 5. Sistema Verbal y Catálogo de Respuestas Rápidas (*Verbatum Sintonía*)

Criterio de redacción: nombrar el progreso real del mecanismo, evitar promesas de amistad garantizada o citas, mantener un tono sobrio, empático, sin presión y con lenguaje caleño natural.

1. **`/ingreso` (Bienvenida y Transparencia):**
   > *"¡Hola a todos! 👋 Les damos la bienvenida a **Sintonía**. Estamos aquí para que las ganas de salir se vuelvan plan y que la logística no le gane al encuentro: menos vueltas, opciones reales y cero enredos para ponerse de acuerdo.*  
   > ⚙️ *Este espacio utiliza asistencia de curaduría automatizada para armarles propuestas a su medida en Cali. Todas las personas de este grupo confirmaron previamente su consentimiento.*  
   > 👤 *Si en algún momento necesitan soporte directo o quieren hablar con una persona del equipo de la universidad, solo escriban **'Humano'** o **'Ayuda'**.*  
   > 🔒 *Pueden consultar nuestro aviso de privacidad cuando lo deseen: [Enlace al aviso]"*

2. **`/opciones` (Presentación de las 3 Alternativas):**
   > *"Revisamos las preferencias del grupo y armamos estas 3 alternativas para su momento. Cerca, corto y posible:*  
   >  
   > ***1. [Opción A]*** — *[Zona] · Aprox. $[X] COP por persona · [Qué esperar].*  
   > ***2. [Opción B]*** — *[Zona] · Aprox. $[X] COP por persona · [Qué esperar].*  
   > ***3. [Opción C]*** — *[Zona] · Aprox. $[X] COP por persona · [Qué esperar].*  
   >  
   > *El plan está en sus manos. Elijan respondiendo con el número de su opción preferida (1, 2 o 3) antes de las [Hora límite]. Si alguien tiene un veto o restricción insalvable, avísenos con tranquilidad."*

3. **`/recordatorio` (Activación sin Presión):**
   > *"⏳ Para que el plan tome forma y podamos cerrar los detalles con tiempo, nos falta el voto de [Nombre/s]. ¿Cuál les provoca más para hoy: 1, 2 o 3?"*

4. **`/confirmado` (Logística del Plan Ganador):**
   > *"Listo el plan para el fin de semana. Ruta clara, ganas intactas:*  
   >  
   > 📍 ***[Nombre del Lugar/Actividad]***  
   > 🗓️ ***Cuándo:*** *[Sábado/Domingo, HH:MM] — Sugerimos salir [XX] minutos antes para evitar la hora pico en [Zona].*  
   > 📌 ***Dirección:*** *[Dirección / Enlace de ubicación]*  
   > 💰 ***Consumo promedio estimado:*** *$[X] COP por persona*  
   >  
   > *Por favor confirmen su asistencia con un 'Me apunto' o un pulgar arriba (👍) para cerrar la lista definitiva."*

5. **`/checkpoint` (Día de la Salida):**
   > *"¡Es hoy! 📍 Cuando vayan llegando al punto de encuentro, confirmen por aquí con un **'Llegué'**. ¡Que disfruten la salida!"*

6. **`/retro` (Evaluación y Cierre Post-Plan):**
   > *"Esperamos que la salida haya valido la pena. ✨ Si hubo sintonía y quieren que el encuentro tenga un siguiente paso, cuéntennos cómo les fue en este pulso breve de 2 minutos: [Enlace a retro.html?pid=XXX]. Sus respuestas son privadas y nos ayudan a mejorar el piloto académico."*

7. **`/guardrail` (Contención ante Temas Fuera de Dominio):**
   > *"En Sintonía nuestra única tarea es ayudarles a armar y coordinar planes en Cali para que salir sea más fácil. ¿Nos concentramos en las opciones para este fin de semana?"*

8. **`/humano` (Escalado a Investigador Real):**
   > *"Hola, aquí estoy. Soy Jose, del equipo de investigación de Sintonía. Tomo la conversación para ayudarte con lo que necesites resolver."*

---

## 6. Reglas de Negocio e Integridad Metodológica (I1 a I9)

* **I1 (Línea Base por Grupo):** La línea base histórica se mide a nivel de grupo (`linea_base_grupo`) para registrar el número de encuentros logrados y cancelados el mes previo.
* **I2 (Denominador `n_invitados`):** La métrica primaria es $\frac{\text{Llegaron}}{\text{Invitados}}$. Se compara contra el total de personas que el organizador planeó invitar inicialmente, no solo contra los que dijeron *\"me apunto\"*.
* **I3 (Minutos de Trabajo Humano):** Todo minuto dedicado por el Mago a coordinar, redactar o resolver imprevistos se registra en la hoja `operacion` para calcular la viabilidad económica real.
* **I4 (Gobernanza del Change Log):** Entre el fin de semana 1 (W1) y el fin de semana 2 (W2), solo se permite registrar un único ajuste experimental por condición en la hoja `cambios`, elevando la versión a `v2`.
* **I5 (WTP Exclusivo del Organizador):** La disposición a pagar (Van Westendorp) y la preventa con precio fundador solo se solicitan a quien asume el rol de organizador.
* **I6 (Catálogo Cerrado Verificado):** Gemini solo puede componer opciones a partir de los IDs válidos del inventario de 27 lugares. Toda sugerencia con un ID desconocido es descartada automáticamente.
* **I7 (Aislamiento de Modo Prueba):** Los grupos creados con `modo: 'prueba'` se excluyen de la vista del panel (`panel.html`) para evitar contaminar los datos oficiales de la investigación.
* **I8 (Sin Flujo Individual):** El sistema se enfoca 100% en la unidad de análisis grupal (2 a 8 personas).
* **I9 (Quórum 100% Obligatorio):** Un grupo solo entra al estudio si el 100% de los invitados declarados firman las 4 casillas de consentimiento. Ante un solo faltante, el grupo se marca como `excluido` y no se abre en WhatsApp. Ante revocación, se destruyen todos los datos personales de inmediato.
