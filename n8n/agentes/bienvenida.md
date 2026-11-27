# Bienvenida de E1.5 · opciones para aprobar (27/11/2026)

> Por qué: la bienvenida de la consola 2.16.0 (`/ingreso`) dice «En este piloto una persona del equipo revisa todo». En E1.5 con agentes eso no es cierto, y decirlo choca con el aviso v3. E1.5 necesita su propia bienvenida (§9 de `n8n/GUIA-CONTINUACION.md`). La consola no cambia.
> Las cuatro opciones pasan las guardas (`n8n/motor/guardas.js`) con el enlace del aviso en el bloque. Deciden el equipo y Néstor, junto con el aviso v3, antes del grupo real (`ag.F6`).

## 0. Lo que tiene que cumplir cualquier opción

- Decir que los mensajes los escribe una IA y los revisa otra, con las mismas palabras que el aviso v3.
- Que HUMANO lleva a una persona del equipo y SALIR saca del grupo.
- El enlace del aviso de privacidad (va en el bloque, lo pone el código).
- Voz de Sintonía: «su +1 de confianza», máximo un emoji, nada inventado.

## 1. Opción 1 · La de E1 con una frase cambiada (recomendada)

> ¡Hola, parche! Soy Sintonía, su +1 de confianza para que el plan sí se dé 👋
> Yo les propongo opciones, ustedes votan y yo cuadro la logística. En este piloto mis mensajes los escribe una IA y otra IA los revisa antes de salir.
> Escriban HUMANO para hablar con alguien del equipo o SALIR para salir del grupo.
> Privacidad: (enlace del aviso)

- **A favor:** es igual a la de E1 salvo la frase de transparencia. Así la bienvenida no es una diferencia entre condiciones y la comparación E1/E1.5 queda en lo que importa.
- **En contra:** un solo mensaje con varias ideas, como en E1.

## 2. Opción 2 · Dos mensajes, una idea cada uno

> ¡Hola, parche! Soy Sintonía, su +1 de confianza para que el plan sí se dé 👋
> Yo les propongo opciones, ustedes votan y yo cuadro la logística.

> Para que sepan: mis mensajes los escribe una IA y otra IA los revisa antes de enviarlos.
> Para hablar con alguien del equipo, escriban HUMANO. Para salir del grupo, SALIR.
> Privacidad: (enlace del aviso)

- **A favor:** cumple «una idea por mensaje» y la transparencia tiene su propio mensaje.
- **En contra:** dos mensajes donde E1 manda uno: es una diferencia de forma entre condiciones.

## 3. Opción 3 · Un mensaje que nombra a la persona del equipo

> ¡Hola, parche! Soy Sintonía, su +1 de confianza para que el plan sí se dé 👋
> Yo les propongo opciones, ustedes votan y yo cuadro la logística. Mis mensajes los escribe una IA y otra IA los revisa; si escriben HUMANO, les responde una persona del equipo.
> Para salir del grupo, escriban SALIR.
> Privacidad: (enlace del aviso)

- **A favor:** deja claro cuándo entra una persona, que es lo que la gente suele preguntar.
- **En contra:** la frase de transparencia es más larga y se aleja un poco más de E1.

## 4. Opción 4 · Tres mensajes cortos, con emergencias

> ¡Hola, parche! Soy Sintonía, su +1 de confianza para armar planes que sí se den 👋

> Funciono así: les propongo opciones, ustedes votan y yo cuadro la logística. Mis mensajes los escribe una IA y otra IA los revisa.

> Para hablar con una persona del equipo, escriban HUMANO; para salir del grupo, SALIR. Si es una emergencia, llamen al 123.
> Privacidad: (enlace del aviso)

- **A favor:** lo más fácil de leer, y deja el 123 desde el principio, como `/humano` en E1.
- **En contra:** tres mensajes y el 123 en la bienvenida, que E1 no tiene: es la que más se aleja de E1.

## 5. Dos decisiones que van con la elección

1. **¿La bienvenida la redacta el agente?** Recomendación: **no** en v1. Va como plantilla fija, igual que el carril de seguridad, porque la frase de transparencia tiene que decir exactamente lo que dice el aviso v3 y un Redactor podría cambiarle el sentido. Esto saca `/ingreso` del carril social de la tabla de carriles (§3 de `n8n/PLAN-agentico.md`, d4).
2. **Límites:** si se elige la opción 1 o la 3, el tipo `/ingreso` necesita límites propios en las guardas (hasta 5 frases y 420 caracteres de prosa), porque los generales son de 3 frases y 320 caracteres.

**Para aprobar:** opción (1–4) · ¿plantilla fija? (sí/no). Con la respuesta, Claude la agrega a la plantilla de respaldo de E1.5 y a sus casos en `prueba-guardas.js`.
