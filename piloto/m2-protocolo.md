# SINTONÍA · PROTOCOLO DE OPERACIÓN M2 (MILESTONE 2)

*Branch: `M2-gemini` · Control de Versiones y Operación de Prototipo*  
*Proyecto Sintonía · Maestría en Gestión de la Innovación, Universidad Icesi*  
*Investigadores: José Alberto Bolaños Díaz & Katherine Castro*  
*Fecha: Octubre de 2026 · Cali, Colombia*

---

## 1. Alcance del Hito M2

El hito **M2** desacopla la fase de **operación, contingencias, pruebas de carga y ensayos** de la fase previa de arquitectura e interfaces (M1). Permite controlar de manera aislada las versiones del prototipo entre el primer fin de semana de prueba (**W1**) y el segundo (**W2**), garantizando que las mejoras se introduzcan de forma controlada y auditable.

```
       Rama 'main' (Producción Base)
             ▲
             │
       Rama 'M1-gemini' (Interfaces y Conexión Apps Script)
             ▲
             │
       Rama 'M2-gemini' (Operación E2, Protocolo de Ensayos y Failover)
```

---

## 2. Ejection Técnica y Operación de E2 (Web App Autónoma)

El Experimento 2 (E2) es la condición de control del piloto. Su objetivo es evaluar la fricción y efectividad de la coordinación social cuando el grupo decide de forma autónoma a través de una interfaz web, sin un agente inteligente intermediando en su conversación de WhatsApp.

### Flujo de Ejecución en E2:
1. **Activación de Grupo:** El organizador ingresa a `index.html?exp=E2`, completa la línea base y recibe el enlace de invitación (`unirse.html?inv=...`).
2. **Registro de Quórum:** Los integrantes completan sus 4 casillas de consentimiento con el botón *"Sí a todo"*.
3. **Curaduría Silenciosa:** El equipo en la consola `mago.html` solicita las 3 opciones a Gemini, revisa precios/horarios del inventario y publica el plan.
4. **Entrega de Enlace Único:** El organizador recibe y comparte en su grupo de WhatsApp existente el enlace de votación:  
   `https://josebdiaz.github.io/sintonia-piloto/piloto/plan.html?plan_id=[ID]&pid=[PID]`
5. **Votación Anónima:** Cada integrante vota (opción 1, 2, 3 o Veto) y observa el progreso del grupo en vivo.
6. **Logística y Cierre:** El plan se cierra automáticamente, mostrando la ficha ganadora (*"Ruta clara, ganas intactas"*), el botón *"Me apunto"* y el botón *"Llegué"*.
7. **Cierre de Ciclo:** Tras el encuentro, el sistema redirige a `retro.html`.

---

## 3. Matriz de Contingencia y Mecanismo de Failover (E1 ⇄ E2)

| Escenario de Incidencia | Condición Afectada | Protocolo de Eyección (Failover) | Tiempo Objetivo |
|---|:---:|---|:---:|
| **Bloqueo o reporte de spam en WhatsApp** | **E1** | **Eyección inmediata a E2:** El Mago envía un mensaje de texto / SMS directo al organizador con el enlace a `plan.html`. El grupo continúa su votación de forma autónoma vía web. Se registra en la consola `operacion` con causa `falla_tecnica`. | **< 5 minutos** |
| **Ausencia de votos en la Web App** | **E2** | **Alerta al Organizador:** Si tras 2 horas faltan votos, el equipo solicita al organizador que reactive a su parche en su chat grupal existente. No se interviene a los amigos directamente. | **120 minutos** |
| **Caída de API de Gemini / Cuota excedida** | **Ambos** | **Curaduría Manual de Respaldo:** El Mago selecciona 3 opciones directamente del archivo local `Inventario_Planes_Cali.csv`, las carga en el editor de la consola y publica el plan. | **< 3 minutos** |
| **Revocación de consentimiento de un miembro** | **E1 / E2** | **Purga y Exclusión Inmediata:** Se ejecuta `action: 'revocar'`. Se eliminan de inmediato los datos personales de la base y el grupo se marca como `excluido` (Regla I9). En E1 se disuelve el chat de WhatsApp. | **< 15 minutos** |

---

## 4. Protocolo de Ensayos de Punta a Punta (Jueves 9 de Octubre · Modo Prueba)

Antes de abrir el piloto real a los participantes el viernes 10 de octubre, se debe ejecutar una simulación completa con un grupo de prueba (Jose, Katherine y colaboradores):

1. **Aislamiento de Métricas (`modo: 'prueba'`):**  
   - Se crea un grupo en `index.html?exp=E1&modo=prueba` y otro en `index.html?exp=E2&modo=prueba`.
   - Se verifica que en `panel.html` los datos de prueba no alteren las métricas oficiales ni sumen al embudo de conversión real.
2. **Validación de E1 (Mago de Oz):**
   - Simular registro de 4 participantes con el botón *"Sí a todo"*.
   - Probar `cerrar_reclutamiento` en la consola.
   - Enviar `/ingreso` en el grupo de prueba de WhatsApp.
   - Invocar `proponer_ia`, editar en la consola y enviar `/opciones`.
   - Emitir votos ficticios y verificar el recuento en la consola.
   - Enviar `/confirmado`, registrar eventos `me_apunto` y `checkpoint_llegada`.
   - Registrar 5 minutos de operación en la hoja `operacion`.
3. **Validación de E2 (Web App):**
   - Votar en `plan.html`, probar el botón de veto y verificar actualización en vivo.
   - Cerrar el plan y verificar la transición a la ficha logística.
   - Llenar `retro.html` con perfil de organizador y verificar almacenamiento en las hojas `retro` y `wtp`.

---

## 5. Matriz de Reclutamiento y Asignación para W1 (10–11 de Octubre)

| Grupo | Tipo de Parche | Condición Asignada | Enlace de Inicio | Estado de Reclutamiento |
|---|:---:|:---:|---|:---:|
| **G-01** | Amigos (adultos jóvenes / trabajo) | **E1 (WhatsApp Business)** | `index.html?exp=E1` | Pendiente por asignar |
| **G-02** | Amigos (adultos jóvenes / ocio) | **E2 (Web App)** | `index.html?exp=E2` | Pendiente por asignar |
| **G-03** | Familia / Parejas | **E1 (WhatsApp Business)** | `index.html?exp=E1` | Pendiente por asignar |
| **G-04** | Familia / Parejas | **E2 (Web App)** | `index.html?exp=E2` | Pendiente por asignar |
| *G-05 (Reserva)* | Amigos | Alternar según balance | — | Backup ante exclusión I9 |

*Regla Metodológica:* Cada grupo permanece en su misma condición asignada durante los dos fines de semana (W1 y W2) para poder comparar la reducción de fatiga y la tasa de repetición sin sesgos de aprendizaje cruzado.

---

## 6. Instrumentación del Change Log entre W1 y W2 (Regla I4)

El diseño experimental permite **una única mejora por condición entre W1 y W2**:
1. Tras el cierre de W1 (domingo 11 de octubre), el equipo revisa las métricas de `panel.html` y define la única mejora a implementar.
2. Se registra en la consola mediante `action: 'registrar_cambio'`:
   ```javascript
   {
     action: 'registrar_cambio',
     key: ADMIN_KEY,
     experimento: 'E1', // o 'E2'
     version: 'v2',
     descripcion: 'Ajuste de redacción de hora de salida para considerar lluvia en Cali',
     por: 'Jose'
   }
   ```
3. El backend actualiza automáticamente los grupos de esa condición a `version: 'v2'` y bloquea cualquier intento de un segundo cambio para preservar la validez interna del estudio.
