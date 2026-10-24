# Sintonía E3 · app de prueba interna

Versión funcional de E3 (chat con IA para armar planes en grupo) **solo para el equipo**. No es para participantes.
Usa el sistema de diseño de `../ds-3.0/` (tokens, componentes y avatares) y no toca el código del piloto E1/E2.

## Dónde se usa

| Versión | Qué hace | Para qué |
|---|---|---|
| Artifact «Sintonía E3 Interna» (claude.ai, privado) | Multijugador real: parches, mensajes, votos y quórum compartidos entre cuentas; respuestas libres con Claude; presencia en vivo | Probar en equipo |
| `e3-app/index.html` (este repo) | Funciona en un solo navegador (se sincroniza entre pestañas); sin Claude, usa el guion | Revisar el código y hacer demos |

El artifact se comparte desde su menú «Compartir» con permiso para usarlo (quien solo puede ver no escribe ni vota).

## Qué cubre

- **A · Activación (organiza):** tipo de grupo, tamaño (define el quórum), historia, quién organiza, energía, antojos, franja, nombre del parche, consentimiento, nombre e invitación con código.
- **B · Invitado:** entra con el código o el enlace, nombre, restricciones (privadas), franja y consentimiento.
- **C · Interacción:** quórum en vivo, votación con el Cuadrante, cambio de voto, «Ninguna me sirve» anónimo con motivo, segunda ronda si la mayoría no quiere ninguna, resolviendo (válvulas), plan fijado con «¿Te apuntas?», recordatorio (C6) y «¡Es hoy, es hoy!» (C7).
- **D · Sobremesa:** preguntas privadas en el 1:1 (energía, satisfacción, valor, sentimiento, repetiría; disposición a pagar solo para quien organizó) y «¿Repetimos con este parche?» en el grupo.
- **E · Fuera del chat:** Chats, Mis sintonías (próxima con cuenta regresiva, tabs, Mis parches), Perfil con permisos y «Habla con un humano» (el equipo responde desde su panel).
- **F · Estados:** sin conexión (cola), error al enviar (reintentar), sin quórum (más tiempo, seguir con los que están o cancelar), salir y borrar datos, cargando.

Panel del equipo (botón EQUIPO): identidades de prueba, miembros simulados, saltos de etapa, simulación de fallas, bandeja de soporte y diagnóstico.

**Contenido de ejemplo:** los planes y lugares no están verificados; los rangos de pago (D4) siguen en borrador.

## Código

```
e3-app/
├─ index.html            versión para GitHub (generada; no editar a mano)
├─ README.md
└─ fuente/
   ├─ build.py           arma index.html (y la versión del artifact con --artifact)
   ├─ autotest.js        recorrido automático A → F (54 de 54 pasos OK, 9 oct 2026)
   └─ src/
      ├─ 01-content.js   voces, guion, catálogo de ejemplo, reglas de Sintonía para Claude
      ├─ 02-store.js     base compartida del artifact con respaldo local (localStorage + BroadcastChannel)
      ├─ 03-services.js  identidad, Claude (sample) y presencia (room)
      ├─ 04-parts.js     piezas del DS 3.0 (mismos nombres que en Figma)
      ├─ 05-sintonia.js  chat 1:1: flujos A, B y D
      ├─ 06-grupo.js     chat del grupo: quórum, votación, plan, sobremesa (transiciones idempotentes)
      ├─ 07-ui.js        pantallas y navegación (volver = pantalla anterior)
      ├─ 08-equipo.js    panel del equipo
      ├─ 09-main.js      arranque y eventos
      └─ app.css         contenedor, panel del equipo y ajustes del feedback (dial, OK, ¿Te apuntas?)
```

Cambios: edita `fuente/src/`, corre `python3 e3-app/fuente/build.py` desde la raíz y haz commit de `index.html` junto con la fuente. Para actualizar el artifact, pídele a Claude que lo republique.
