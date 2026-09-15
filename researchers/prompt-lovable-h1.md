# Prompt para Lovable — Landing + panel del experimento H1 (Sintonía)

> Úsalo cuando escales el testeo a más canales (LinkedIn, IG, comunidades) y quieras backend propio (Supabase) e iteración visual. Para 20–40 visitas por WhatsApp directo NO hace falta; basta la landing autónoma actual.

---

Construye una landing privada de una sola página (en español, Colombia) para una prueba piloto de investigación llamada **Sintonía**, más un panel de control de administración. Es una investigación de maestría, NO un servicio comercial.

**Actividad ofrecida:** una sesión de *café-coworking en grupo pequeño* (4–8 personas, 90 min, en un café público) para personas que trabajan en remoto o híbrido y quieren compañía sin trabajar siempre solas.

**Flujo del visitante, en este orden:**
1. Hero cálido: título, descripción de la sesión y datos rápidos (90 min · grupo 4–8 · café público · entras y sales libre).
2. Aviso visible y prominente: **"Hoy no se cobra nada. No se pide tarjeta ni pago en esta página."**
3. "Cómo es la sesión": 3 pasos (llegas → trabajas lo tuyo 90 min → cierre corto opcional). Sin dinámicas forzadas.
4. **Screener** de 3 preguntas: (a) cómo trabaja hoy — remoto/híbrido/presencial/no trabaja; (b) si siente falta de compañía trabajando remoto; (c) si quiere ampliar su vida social. **Califica** solo quien trabaja remoto o híbrido Y quiere ampliar su vida social. Si no califica, mensaje amable de agradecimiento y fin (sin reserva).
5. **Reserva**: muestra un "Pase Sintonía: COP 39.900 + valor de la actividad" tachado como referencia, con la nota **"Hoy no se cobra — reserva sin pago para el piloto"**. Este precio es un **estímulo experimental de disposición a pagar, NUNCA un cobro real**.
6. Dos casillas de consentimiento obligatorias para habilitar el botón: (a) consentimiento de participación con derecho a retirarse; (b) "Entiendo que hoy no se realiza ningún cobro".
7. Botón "Confirmar mi cupo (sin cobro)" → pantalla de confirmación ("te escribimos por WhatsApp"). Un enlace discreto "Tengo dudas sobre el cobro" abre una explicación y registra ese evento.
8. Guardrails visibles antes de reservar: sin cobro sin reconfirmación · no es dating ni terapia (no promete amistad ni bienestar) · cupo no garantizado · no se piden datos de contacto en la página (el seguimiento es por WhatsApp) · lo único que se paga es el consumo propio en el café.

**Privacidad y datos (obligatorio):** la landing **no recolecta ningún dato personal** (ni nombre ni contacto). Solo registra **eventos anónimos del embudo** en una tabla de Supabase `events` con columnas: `type` (page_view | screener_pass | screener_fail | cta_clicked | reservation_completed | charge_doubt), `utm_source`, `qualified_src` (bool), `created_at`. Captura `utm_source` del querystring. Fuentes válidas ("calificadas"): wa_directo, wa_grupo, com_remoto, linkedin, ig, referido; cualquier otra o vacía = no calificada.

**Panel de administración** (ruta protegida, p. ej. `/panel`): embudo en vivo (visitas → califican → clic reservar → reservan) con conteos y % por paso; KPIs contra el umbral de H1: **conversión = reservas ÷ visitas calificadas (umbral ≥ 5%)**, **reservas (meta ≥ 2)**, **visitas calificadas (muestra 20–40)**; tabla por fuente UTM; alerta si hay eventos `charge_doubt` (señal de comprensión deficiente del no-cobro). Muestra un veredicto **preliminar** (Perseverar / Iterar / Descartar / Pendiente) y aclara que la decisión oficial se registra aparte con el umbral original. Aclara que los conteos son eventos, no personas únicas.

**Diseño:** cálido pero sobrio, tipografía con carácter, buen contraste, modo claro y oscuro, responsive. Nada de stock genérico.

**Reglas que no se rompen:** el precio es estímulo, no cobro; no se guardan datos personales; no se promete amistad, bienestar ni resultado clínico; el texto del no-cobro debe ser inequívoco.
