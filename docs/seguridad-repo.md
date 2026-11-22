# Seguridad del repositorio · excepción documentada (22/11/2026)

## 1. Decisión

El repositorio `josebdiaz/sintonia-piloto` **sigue siendo público**, como excepción controlada.

**Por qué no se hace privado:**
- En el plan **Free** de GitHub, Pages solo publica desde repositorios públicos: al hacerlo privado, sintonia.my dejaría de publicarse ([planes de GitHub](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)).
- **GitHub Pro** (pago mensual) sí permite publicar desde un repositorio privado, pero **el sitio sigue siendo público**. Solo un sitio de acceso controlado (GitHub Enterprise Cloud, con organización) lo oculta.
- Todo lo que sirve el sitio (consola, panel, decks, `docs/` y `archivo/`) se puede leer en el navegador aunque el repositorio sea privado. La URL del backend viaja en la página porque el navegador la necesita.

**Conclusión:** hacer privado el repositorio ocultaría el historial, pero no lo que el sitio publica. La protección real es **no poner en el repositorio nada que no pueda ser público** y verificarlo de forma automática.

## 2. Qué puede ir en el repositorio

| Clase | Ejemplos | ¿En el repo? |
|---|---|---|
| **Público** | Código del frontend y del backend sin claves, decks, guías, textos de la voz, inventario de lugares (datos de negocios), stickers, el correo de contacto del aviso de privacidad | Sí |
| **Interno** | Notas de reuniones, transcripciones, audios, análisis de pruebas con datos de personas, logística del equipo, control de compromisos | **No:** Proyecto de Claude o Drive del equipo. En el repo solo va una versión sin datos personales (ver `docs/prompts-mejoras-prueba-externa.md`) |
| **Confidencial** | ADMIN_KEY, MOTOR_KEY, GEMINI_API_KEY, tokens, la hoja del piloto, nombres, teléfonos y respuestas de participantes | **Nunca.** Las claves viven en las propiedades del script y en las credenciales de n8n |

## 3. Controles

| Control | Dónde | Estado |
|---|---|---|
| Revisión automática de claves, correos y teléfonos en cada push y pull request | `tools/revisar-datos.py` y `.github/workflows/seguridad.yml` («Seguridad de datos») | Activo desde el 22/11 |
| Revisión antes de commitear | `python3 tools/revisar-datos.py --staged` | En el protocolo (`CLAUDE.md`) |
| Buscadores fuera | `robots.txt` (`Disallow: /`) y `<meta name="robots" content="noindex">` en las páginas | Activo |
| Páginas del equipo con clave | La consola y el panel piden ADMIN_KEY; el backend valida la clave en cada acción | Activo |
| Escaneo de secretos de GitHub y protección al hacer push | Settings → Code security → *Secret scanning* y *Push protection* | **Por activar** (gratis en repositorios públicos) |
| Proteger `main`: exigir que pasen «Seguridad de datos» y «Home al día» | Settings → Branches → *Branch protection rule* | **Por activar** |
| Rotar ADMIN_KEY al terminar el periodo del monitor | Propiedades del script | **Pendiente** (al cierre) |
| Reporte de fallas | `SECURITY.md` | Activo |

## 4. Revisión del 22/11/2026

- **Claves:** ninguna en los archivos actuales ni en el historial (búsqueda de claves de Google, GitHub, OpenAI y Anthropic, llaves privadas y claves del piloto con valor).
- **Datos de participantes:** ninguno en los archivos. Los teléfonos del historial son de los lugares del inventario (negocios) o de prueba.
- **Dato personal del equipo:** el WhatsApp personal de un integrante estaba en una página archivada del Periodo 4 (`archivo/p4-pre-pivote/ficha.html`); se reemplazó por el correo de contacto. **Sigue en el historial de git.** Borrarlo de ahí exige reescribir la historia (*force push*), lo que es irreversible y rompe los clones existentes: queda a decisión del equipo.
- **Correos:** el de contacto del aviso de privacidad (intencional) y, en el historial, el correo personal de un integrante (bajo riesgo).

## 5. Si algo se filtra

1. **Rota la clave de inmediato** (propiedades del script o credencial de n8n). Una clave publicada se da por comprometida aunque se borre después.
2. Quita el dato del archivo y haz commit.
3. Si es un dato de un participante, avisa al equipo y aplica el procedimiento del aviso de privacidad (Ley 1581): registro del incidente y, si corresponde, aviso a la persona.
4. Decide en equipo si reescribir el historial.
