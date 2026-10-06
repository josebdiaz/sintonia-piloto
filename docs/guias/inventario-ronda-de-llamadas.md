> **Copia en el repositorio · Vigente: la regla de estado y la ronda de llamadas. Las cifras son de la v1 (3/10); la hoja «inventario» manda (v3: 17 activos y 10 por confirmar).**

# Inventario verificado de planes en Cali (P6-80) · v1 · 3 de octubre de 2026

*Este inventario es la base del motor de opciones: la IA del E2 y la consola del E1 **solo pueden proponer lugares que estén en él** (ajuste I6 del backend). El archivo `Inventario_Planes_Cali.csv` se pega tal cual en la hoja `inventario` del Apps Script.*

## Regla de estado

- **`activo`** (7 lugares): tienen horario y costo confirmados en una fuente oficial (cali.gov.co, sitio del lugar) o en prensa reconocida (El País, Semana, El Espectador). Revisados en web el 3/10/2026.
- **`por_confirmar`** (15 lugares): falta horario o costo, la fuente es secundaria o hay datos contradictorios. **El backend no los usa** hasta que alguien los confirme y cambie el estado a `activo`.

> Que esté "verificado en web" no significa que esté confirmado ese mismo día. **Antes de cada fin de semana del piloto**, hay que llamar o revisar redes de los lugares elegidos (sobre todo horarios, cierres y aforo). Si algo cambia, se actualiza la fila y la fecha en `verificado_el`.

## Lugares activos (los puede usar el piloto)

| id | Lugar | Por qué sirve |
|---|---|---|
| INV-02 | Cerro de las Tres Cruces | Plan de mañana gratis, para grupos activos |
| INV-03 | Museo La Tertulia | Plan cultural en El Peñón, cerca de San Antonio |
| INV-05 | Museo del Oro Calima | Gratis, en el centro |
| INV-07 | Zoológico de Cali | El plan familiar más claro (perfil tipo Elena) |
| INV-08 | Jardín Botánico | Plan tranquilo de jueves a domingo |
| INV-10 | Ecoparque de la Biodiversidad | Gratis con reserva |
| INV-11 | Ciclovida | Domingo activo y gratis |

## Qué hay que confirmar antes del 9/10 (prioridad)

Con 7 lugares activos **casi no se pueden armar secuencias de 2 paradas** (por ejemplo café → actividad o actividad → comida), porque **todos los cafés y lugares de comida están por confirmar**. Para que el piloto funcione, conviene confirmar al menos:

1. **Cafés de San Antonio** (INV-17 a 20): horario y rango de precio. Son el "remate" natural después de La Tertulia o del centro.
2. **Galería Alameda** (INV-16): horario de fin de semana y dirección exacta (las fuentes no coinciden).
3. **Salsa** (INV-12/13 y clases INV-14/15): cover y horario. Es el plan nocturno más representativo de Cali.
4. **Cristo Rey** (INV-01): confirmar si la entrada gratis es permanente.
5. **Cinemateca y Teatro Municipal** (INV-04/06): programación de los fines de semana del 10–11 y 17–18 de octubre.

Meta: **12–15 lugares activos** que cubran café, actividad, cultura, aire libre, comida y noche.

## Límites

- Estas fuentes informan horarios y precios, pero **no garantizan** la experiencia ni la seguridad. La recomendación final siempre la revisa el mago (humano en el loop).
- No hay alianzas comerciales: ningún lugar paga por aparecer (decisión D2).
- Sin Bogotá y sin planes fuera de Cali. El Museo de la Caña se excluye porque queda en El Cerrito, a una hora.
