# Sintonía · repositorio del piloto

Proyecto de la Maestría en Gestión de la Innovación (Universidad Icesi) · José Bolaños y Katherine Castro.
Sintonía es un sistema que coordina planes para grupos de amigos que ya existen en Cali («el quinto amigo del parche»).
El piloto compara dos condiciones: **E1**, por WhatsApp con un mago humano (Mago de Oz), y **E2**, como web app. Las dos usan el mismo backend.

Sitio publicado (GitHub Pages, rama `main`): https://josebdiaz.github.io/sintonia-piloto/

## Estructura

```
/
├─ index.html            Portal del proyecto (no es una página de participantes)
├─ 404.html              Redirige las URLs anteriores (M2-Claude/, researchers/, …) a su nueva ubicación
├─ piloto/               Frontend EN USO · E1 + E2 · versión en piloto/assets/sintonia.js (FRONTEND_VERSION)
│  ├─ index.html         Inscripción del organizador (?exp=E1 | ?exp=E2, &modo=prueba para ensayos)
│  ├─ unirse.html        Consentimiento de cada miembro (?inv=CÓDIGO)
│  ├─ plan.html          Votación y plan cerrado (?pid=…)
│  ├─ retro.html         Pulso posterior al plan
│  ├─ aviso.html         Aviso de privacidad
│  ├─ mago.html          Consola del equipo (pide ADMIN_KEY)
│  ├─ panel.html         Panel del piloto (pide ADMIN_KEY)
│  └─ assets/            sintonia.css, sintonia.js (URL del backend y versión)
├─ backend/              Código de Google Apps Script (se pega a mano en el editor)
│  └─ Codigo_Piloto.gs   Versión en el encabezado del archivo y en el tag backend/vX.Y.Z
├─ datos/                Datos de referencia sin información personal
│  └─ Inventario_Planes_Cali.csv
├─ docs/                 Protocolo, textos, storyboard y deck del pivote
├─ archivo/              Versiones que ya no se usan (solo lectura, sin conexión al backend del piloto)
│  ├─ p4-pre-pivote/     Experimentos H1–H4 del Periodo 4 y panel de investigadores
│  ├─ piloto-m1-claude/  Frontend 1.0.0 («M1»)
│  ├─ piloto-m1-gemini/  Referencia
│  └─ piloto-m2-gemini/  Referencia
├─ CHANGELOG.md          Historial de versiones de cada componente
└─ README.md
```

## Enlaces del piloto

| Para | Enlace |
|---|---|
| Organizador · E1 | https://josebdiaz.github.io/sintonia-piloto/piloto/index.html?exp=E1 |
| Organizador · E2 | https://josebdiaz.github.io/sintonia-piloto/piloto/index.html?exp=E2 |
| Ensayo (no cuenta en el panel) | https://josebdiaz.github.io/sintonia-piloto/piloto/index.html?exp=E1&modo=prueba |
| Consola del mago (equipo) | https://josebdiaz.github.io/sintonia-piloto/piloto/mago.html |
| Panel (equipo) | https://josebdiaz.github.io/sintonia-piloto/piloto/panel.html |
| Aviso de privacidad | https://josebdiaz.github.io/sintonia-piloto/piloto/aviso.html |
| Protocolo de operación | [docs/protocolo-m2.md](docs/protocolo-m2.md) |

Los enlaces de condición (E1/E2) los asigna el equipo; no se publican en el portal para no contaminar la asignación.
Los enlaces viejos (`/M2-Claude/…`) siguen funcionando: `404.html` los redirige a `/piloto/…` con sus parámetros.

## Versiones

Cada componente tiene su propia versión [SemVer](https://semver.org/lang/es/) y su propio tag de git:

| Componente | Versión actual | Dónde se declara | Tag |
|---|---|---|---|
| Frontend del piloto | 2.0.1 («M2») | `piloto/assets/sintonia.js` → `FRONTEND_VERSION` (se ve en el pie de página) | `piloto/v2.0.1` |
| Backend (Apps Script) | 2.2.2 | Encabezado de `backend/Codigo_Piloto.gs` | `backend/v2.2.2` |
| Inventario | 3 (4/10/2026 · 17 activos) | `datos/Inventario_Planes_Cali.csv` (la hoja manda) | sin tag (v1 y v2 tienen tag) |

- **MAYOR**: cambia el diseño del experimento o rompe compatibilidad (p. ej. M1 → M2).
- **MENOR**: función nueva compatible (una columna nueva, una vista nueva).
- **PARCHE**: arreglo sin cambio de comportamiento esperado.
- La versión del **protocolo** por grupo (`v1`, `v2`: la única mejora permitida entre W1 y W2, regla I4) es otra cosa: vive en la hoja (`grupos.version`, pestaña `cambios`), no en el código.

Historial anterior conservado como tags: `p4/final` (cierre de P4, antes del pivote), `piloto/v1.0.0` (M1-Claude), `archivo/gemini-m1` y `archivo/gemini-m2`. Ver [CHANGELOG.md](CHANGELOG.md).

## Cómo trabajar (GitHub flow)

1. `main` es lo publicado: lo que entra a `main` sale en GitHub Pages en 1–2 minutos.
2. Cada cambio va en una rama corta desde `main`: `feat/…`, `fix/…`, `docs/…`. Las ramas se borran después de integrarse.
3. Mensajes de commit con [Conventional Commits](https://www.conventionalcommits.org/es/): `feat(piloto): …`, `fix(backend): …`, `docs: …`.
4. Para publicar una versión: subir `FRONTEND_VERSION` o el encabezado del `.gs`, agregar la entrada en `CHANGELOG.md`, integrar a `main` y crear el tag (`git tag -a piloto/v2.0.1 -m "…"` y `git push --tags`).
5. Backend: pegar `backend/Codigo_Piloto.gs` en el editor de Apps Script → Implementar → Administrar implementaciones → editar la implementación actual → **Nueva versión**. Así la URL `/exec` no cambia. Anotar en el CHANGELOG el número de versión de la implementación.
6. Entre W1 y W2 solo se permite **un** cambio por condición (I4): registrarlo también en la consola del mago (pestaña Cambios).

## Datos y seguridad

- El repositorio no contiene datos de participantes. Las respuestas viven en la hoja de Google del piloto.
- `ADMIN_KEY`, `GEMINI_API_KEY` y `SHEET_ID` viven en Propiedades del script, nunca en el código.
- Las páginas usan `<meta name="robots" content="noindex">`. Un `robots.txt` dentro de un sitio de proyecto no lo leen los buscadores (solo cuenta el de la raíz del dominio).
- Las versiones archivadas del piloto y las páginas públicas de P4 no envían datos: su URL de backend se reemplazó por una dirección inválida. El panel de investigadores de P4 sigue leyendo los resultados de P4.
