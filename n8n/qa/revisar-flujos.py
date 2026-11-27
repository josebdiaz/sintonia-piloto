#!/usr/bin/env python3
"""Revisa flujos de n8n exportados (JSON) antes de importarlos o activarlos.

Uso:
  python3 n8n/qa/revisar-flujos.py n8n/              # todos los .json de la carpeta
  python3 n8n/qa/revisar-flujos.py respaldo.json     # un archivo (flujo o lista de flujos)

Chequeos tomados de las skills oficiales de n8n (n8n-io/skills: lifecycle,
error-handling, credentials-and-security, expressions) y de las reglas de
Sintonía (n8n/GUIA-CONTINUACION.md §7 y §8). No llama a n8n ni a ninguna red.

Severidad (como en ESTADO.md §3.1): Bloquea · Validez · Ajuste · Info.
Termina con código 1 si hay algo que bloquea.
"""
import json, re, sys, pathlib

TRIGGERS = ('Trigger', 'webhook', 'formTrigger', 'scheduleTrigger', 'manualTrigger')
CORCHETE = re.compile(r'\[(?!\s*\])[A-Za-zÁÉÍÓÚáéíóúñÑ_ ]{3,40}\]')   # [dirección], [hora]
TELEFONO = re.compile(r'(?<![\w-])\+?57\s?3\d{2}\s?\d{3}\s?\d{4}(?!\d)')
CORREO = re.compile(r'[\w.+-]+@(?!g\.us|s\.whatsapp\.net)[\w-]+\.[\w.]{2,}')
JID = re.compile(r'\d{10,}(-\d+)?@(g\.us|s\.whatsapp\.net)')
LITERAL = re.compile(r"'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\"|`[^`]*`")
SECRETO = re.compile(r'((apikey|api_key|motor_key|admin_key|token)\\?["\']?\s*[:=]\s*\\?["\'][A-Za-z0-9._-]{12,}|bearer\s+[A-Za-z0-9._-]{12,}|[?&]key=[A-Za-z0-9_-]{12,})', re.I)
ESCRIBE = ('publicar_plan', 'cerrar_plan', 'evento', 'reabrir_opciones', 'operacion', 'proponer_ia')

def cargar(ruta):
    p = pathlib.Path(ruta)
    archivos = sorted(p.glob('*.json')) if p.is_dir() else [p]
    for a in archivos:
        try:
            d = json.loads(a.read_text(encoding='utf-8'))
        except Exception as e:
            yield a, None, f'no se pudo leer: {e}'
            continue
        lista = d if isinstance(d, list) else [d]
        for w in lista:
            if isinstance(w, dict) and 'nodes' in w:
                yield a, w, None

def textos(obj):
    """Todos los strings dentro de un objeto (parámetros de un nodo)."""
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from textos(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from textos(v)

def revisar(w):
    h = []
    def add(sev, nodo, msg): h.append((sev, nodo, msg))
    nodos = w.get('nodes', [])
    con = w.get('connections', {})
    st = w.get('settings', {}) or {}

    # Privacidad: ejecuciones sin guardar (handoff §5)
    if st.get('saveDataSuccessExecution') != 'none' or st.get('saveDataErrorExecution') != 'none':
        add('Validez', '—', 'guarda ejecuciones: poner saveDataSuccessExecution y saveDataErrorExecution en "none" (privacidad)')
    if st.get('saveManualExecutions') not in (False, None) :
        add('Ajuste', '—', 'guarda ejecuciones manuales')
    if not st.get('errorWorkflow'):
        add('Validez', '—', 'sin flujo de errores (settings.errorWorkflow): un fallo se pierde en silencio (pendiente 39)')
    if st.get('timezone') not in ('America/Bogota', None):
        add('Ajuste', '—', f"zona horaria {st.get('timezone')}")
    elif st.get('timezone') is None:
        add('Ajuste', '—', 'sin timezone del flujo: n8n Cloud corre en UTC (usar America/Bogota)')

    # Nodos con entrada
    destinos = set()
    for src, salidas in con.items():
        for rama in salidas.values():
            for lista in rama:
                for c in lista or []:
                    destinos.add(c['node'])

    nombres = {n['name'] for n in nodos}
    todo_texto = json.dumps(nodos, ensure_ascii=False)

    for n in nodos:
        t, nom, par = n['type'], n['name'], n.get('parameters', {})
        corto = t.split('.')[-1]
        if corto == 'stickyNote':
            continue
        if nom not in destinos and not any(k in t for k in TRIGGERS):
            add('Ajuste', nom, 'nodo sin entrada (suelto)')
        strs = list(textos(par))
        joined = '\n'.join(strs)

        if corto == 'webhook' and par.get('authentication', 'none') == 'none':
            add('Bloquea', nom, 'webhook sin autenticación: cualquiera con la URL inyecta mensajes (relay.R1, pendiente 39)')

        for s in strs:
            if '$env.' in s:
                add('Validez', nom, '$env no funciona en n8n Cloud: usar credencial, $vars o Data Table')
                break
        if SECRETO.search(joined):
            add('Bloquea', nom, 'parece una clave en un campo de texto: usar el sistema de credenciales')
        if TELEFONO.search(joined) or CORREO.search(joined):
            add('Bloquea', nom, 'número de teléfono o correo escrito en el flujo (repo público)')

        if re.search(r'script\.google\.com/macros/s/[A-Za-z0-9_-]{20,}', joined):
            add('Info', nom, 'URL del backend escrita (es pública: la usa el frontend; si cambia el despliegue, hay que actualizarla aquí)')
        if JID.search(joined):
            add('Validez', nom, 'identificador de grupo o número de WhatsApp escrito: si es real, no va al repo (usar un ejemplo)')

        # N3: nada con [corchetes] al grupo. En Code solo cuentan los textos entre comillas
        if corto not in ('stickyNote', 'formTrigger', 'form'):
            fuente = joined if corto != 'code' else '\n'.join(LITERAL.findall(joined))
            m = CORCHETE.search(fuente)
            if m:
                al_revisor = 'avisar' in nom.lower() or 'revisor' in (w.get('name') or '').lower()
                if al_revisor:
                    add('Info', nom, f'corchetes {m.group(0)} en un aviso al revisor (no va al grupo)')
                else:
                    add('Bloquea', nom, f'texto con corchetes {m.group(0)} (n8n.N3: ningún [corchete] sale al grupo)')

        if corto == 'httpRequest':
            auth = par.get('authentication', 'none')
            if auth != 'none' and not n.get('credentials'):
                add('Validez', nom, 'pide credencial pero no tiene ninguna enlazada')
            if not n.get('onError'):
                add('Validez', nom, 'sin manejo de error (onError): el flujo se detiene sin avisar')
            if par.get('method') == 'POST' and not n.get('retryOnFail'):
                add('Ajuste', nom, 'POST sin reintentos (retryOnFail); exige req_id antes (n8n.N20)')
            es_backend = 'backend_url' in joined
            if es_backend and any(a in joined for a in ESCRIBE) and 'req_id' not in joined:
                add('Validez', nom, 'escribe en el backend sin req_id (n8n.N20: reintento duplicaría filas)')
            if 'evolution' in joined.lower() and 'sendSticker' in joined:
                add('Info', nom, 'envía sticker: revisar que vaya después del mensaje con datos y nunca en seguridad')

        if corto == 'set':
            # antipatrón: Set con 0 o 1 consumidores
            refs = todo_texto.count(f"$('{nom}')") + todo_texto.count(f'$("{nom}")')
            directos = sum(len(l or []) for r in con.get(nom, {}).values() for l in r)
            if refs == 0 and directos <= 1 and nom not in ('Config',):
                add('Info', nom, 'Set con un solo consumidor: la skill sugiere poner la expresión en el nodo que la usa')

        if corto == 'executeWorkflowTrigger' and par.get('inputSource') == 'passthrough':
            add('Ajuste', nom, 'sub-flujo en passthrough: usar «Define Below» con campos tipados')

        if corto == 'wait':
            add('Info', nom, 'Wait largo: en pruebas usar relojes cortos (n8n.N23)')

    return h

def main(args):
    if not args:
        print(__doc__); return 2
    total = {'Bloquea': 0, 'Validez': 0, 'Ajuste': 0, 'Info': 0}
    for ruta in args:
        for archivo, w, err in cargar(ruta):
            if err:
                print(f'✗ {archivo}: {err}'); total['Bloquea'] += 1; continue
            h = revisar(w)
            print(f"\n## {w.get('name')}  ({archivo.name}, {len(w['nodes'])} nodos)")
            if not h:
                print('   ✓ sin hallazgos')
            orden = ['Bloquea', 'Validez', 'Ajuste', 'Info']
            for sev, nodo, msg in sorted(h, key=lambda x: orden.index(x[0])):
                total[sev] += 1
                print(f'   {sev:8} {nodo}: {msg}')
    print('\nResumen: ' + ' · '.join(f'{k} {v}' for k, v in total.items()))
    print('✗ hay bloqueos' if total['Bloquea'] else '✓ sin bloqueos')
    return 1 if total['Bloquea'] else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
