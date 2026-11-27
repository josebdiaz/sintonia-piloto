#!/usr/bin/env python3
"""Genera n8n/E15-00-entrada.json desde n8n/motor/entrada.js. Se genera, no se edita a mano.

Uso: python3 n8n/motor/construir.py
El flujo trae marcadores (PEGAR_…) en vez de grupos, URLs o claves: se llenan en n8n, nunca en el repo.
"""
import json, pathlib, uuid

raiz = pathlib.Path(__file__).resolve().parent
js = (raiz / 'entrada.js').read_text(encoding='utf-8').replace("if (typeof module !== 'undefined') module.exports = ENTRADA;\n", '')
pie = """
// ── Uso en n8n ──
const c = $('Config').first().json;
const cfg = {
  grupos: String(c.grupos_permitidos || '').split(',').map(s => s.trim()).filter(Boolean),
  sonda: String(c.sonda) === 'true',
  sticker_entrante: c.sticker_entrante,
};
const eco = String(c.eco) === 'true';   // respuesta de prueba en el grupo del equipo; en el piloto real va en false
return $('Evolution (entrada)').all().map(i => {
  const r = ENTRADA.clasificar(i.json, cfg);
  const b = i.json && i.json.body && !i.json.event ? i.json.body : (i.json || {});   // Evolution trae su URL e instancia en el cuerpo
  return { json: Object.assign(r, { veto: r.veto === true, eco_texto: eco ? ENTRADA.eco(r) : '', aviso: ENTRADA.aviso(r),
    evo_url: String(b.server_url || '').replace(/\/$/, ''), evo_instancia: String(b.instance || '') }) };
});
"""
def nid(n): return str(uuid.uuid5(uuid.NAMESPACE_URL, 'sintonia/e15-00/' + n))

nodos = [
  {"id": nid('wh'), "name": "Evolution (entrada)", "type": "n8n-nodes-base.webhook", "typeVersion": 2, "position": [0, 200],
   "webhookId": nid('webhook'),
   "parameters": {"httpMethod": "POST", "path": "sintonia-e15-entrada", "authentication": "headerAuth",
                  "responseMode": "onReceived", "options": {}},
   "credentials": {"httpHeaderAuth": {"name": "Sintonia Evolution webhook (header)"}}},
  {"id": nid('cfg'), "name": "Config", "type": "n8n-nodes-base.set", "typeVersion": 3.4, "position": [220, 200],
   "parameters": {"mode": "manual", "includeOtherFields": False, "assignments": {"assignments": [
     {"id": "c1", "name": "grupos_permitidos", "value": "PEGAR_JID_DEL_GRUPO_DE_PRUEBA", "type": "string"},
     {"id": "c2", "name": "sonda", "value": "true", "type": "string"},
     {"id": "c3", "name": "sticker_entrante", "value": "escalar", "type": "string"},
     {"id": "c4", "name": "eco", "value": "true", "type": "string"}]}, "options": {}}},
  {"id": nid('code'), "name": "Clasificar (entrada.js)", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [440, 200],
   "parameters": {"jsCode": js + pie}},
  {"id": nid('if'), "name": "¿Se atiende?", "type": "n8n-nodes-base.if", "typeVersion": 2.2, "position": [660, 200],
   "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose", "version": 2},
     "conditions": [{"id": "a1", "leftValue": "={{ $json.accion }}", "rightValue": "ignorar",
                     "operator": {"type": "string", "operation": "notEquals"}}], "combinator": "and"}, "options": {}}},
  {"id": nid('dt'), "name": "Registrar en e15_entrada", "type": "n8n-nodes-base.dataTable", "typeVersion": 1.1, "position": [880, 180],
   "parameters": {"resource": "row", "operation": "insert",
     "dataTableId": {"__rl": True, "mode": "list", "value": "", "cachedResultName": "e15_entrada"},
     "columns": {"mappingMode": "defineBelow", "value": {
        "hora": "={{ $json.hora }}", "id_mensaje": "={{ $json.id_mensaje }}", "accion": "={{ $json.accion }}",
        "tipo": "={{ $json.tipo || '' }}", "motivo": "={{ $json.motivo || '' }}", "evento": "={{ $json.evento || '' }}",
        "opcion": "={{ $json.opcion ?? '' }}", "sticker": "={{ $json.sticker || '' }}", "sticker_sha": "={{ $json.sticker_sha || '' }}",
        "tipo_whatsapp": "={{ $json.tipo_whatsapp }}", "forma": "={{ $json.forma ? JSON.stringify($json.forma) : '' }}",
        "veto": "={{ $json.veto ? 'si' : '' }}"},
       "matchingColumns": [], "schema": []}, "options": {}},
   "onError": "continueRegularOutput"},
  {"id": nid('eco_if'), "name": "¿Responder (prueba)?", "type": "n8n-nodes-base.if", "typeVersion": 2.2, "position": [880, 380],
   "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose", "version": 2},
     "conditions": [{"id": "e1", "leftValue": "={{ $json.eco_texto }}", "rightValue": "", "operator": {"type": "string", "operation": "notEmpty", "singleValue": True}},
                    {"id": "e2", "leftValue": "={{ $json.evo_url }}", "rightValue": "", "operator": {"type": "string", "operation": "notEmpty", "singleValue": True}}],
     "combinator": "and"}, "options": {}}},
  {"id": nid('eco_http'), "name": "Responder en el grupo (prueba)", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [1100, 380],
   "parameters": {"method": "POST", "url": "={{ $json.evo_url }}/message/sendText/{{ $json.evo_instancia }}",
     "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth", "sendBody": True, "contentType": "json",
     "specifyBody": "json", "jsonBody": "={{ JSON.stringify({ number: $json.grupo, text: $json.eco_texto }) }}", "options": {}},
   "credentials": {"httpHeaderAuth": {"name": "Evolution API · Hostinger"}},
   "onError": "continueRegularOutput"},
  {"id": nid('av_if'), "name": "¿Avisar a una persona?", "type": "n8n-nodes-base.if", "typeVersion": 2.2, "position": [880, 580],
   "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose", "version": 2},
     "conditions": [{"id": "a1", "leftValue": "={{ $json.aviso }}", "rightValue": "", "operator": {"type": "string", "operation": "notEmpty", "singleValue": True}}],
     "combinator": "and"}, "options": {}}},
  {"id": nid('av_sw'), "name": "Avisar a una persona", "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1.2, "position": [1100, 580],
   "parameters": {"source": "database", "workflowId": {"__rl": True, "mode": "id", "value": "vH5Q2DxwhLl7rP4p", "cachedResultName": "SW · Avisar revisor"},
     "workflowInputs": {"mappingMode": "defineBelow", "value": {"plan_id": "", "motivo": "={{ $json.aviso }}", "codigo": "={{ $json.motivo || $json.evento || '' }}",
       "evo_url": "={{ $json.evo_url }}", "evo_instancia": "={{ $json.evo_instancia }}"}, "matchingColumns": [], "schema": [
       {"id": k, "displayName": k, "required": False, "defaultMatch": False, "display": True, "canBeUsedToMatch": True, "type": "string"} for k in ("plan_id", "motivo", "codigo", "evo_url", "evo_instancia")]},
     "options": {"waitForSubWorkflow": False}},
   "onError": "continueRegularOutput"},
  {"id": nid('nota'), "name": "Nota", "type": "n8n-nodes-base.stickyNote", "typeVersion": 1, "position": [0, -160],
   "parameters": {"width": 900, "height": 300, "content":
     "## E15-00 · Entrada (modo prueba)\n"
     "Evolution → clasifica → registra **sin texto, nombre ni número** en la Data Table `e15_entrada`.\n\n"
     "1. Credencial *Header Auth* «Sintonia Evolution webhook (header)» (la misma del ping).\n"
     "2. En **Config** pega el JID del grupo de prueba (aquí, nunca en el repo).\n"
     "3. `sonda = true` guarda la *forma* del mensaje (llaves y tipos, sin valores): sirve para V1 y para el sha de los stickers.\n"
     "4. Con `eco = true` (solo el grupo del equipo) responde qué entendió, marcado «🧪 Prueba». En el piloto real va en false.\n\n"
     "Se genera con `python3 n8n/motor/construir.py`; la lógica vive en `n8n/motor/entrada.js`."}},
]
con = {
  "Evolution (entrada)": {"main": [[{"node": "Config", "type": "main", "index": 0}]]},
  "Config": {"main": [[{"node": "Clasificar (entrada.js)", "type": "main", "index": 0}]]},
  "Clasificar (entrada.js)": {"main": [[{"node": "¿Se atiende?", "type": "main", "index": 0}]]},
  "¿Se atiende?": {"main": [[{"node": "Registrar en e15_entrada", "type": "main", "index": 0}, {"node": "¿Responder (prueba)?", "type": "main", "index": 0}, {"node": "¿Avisar a una persona?", "type": "main", "index": 0}], []]},
  "¿Avisar a una persona?": {"main": [[{"node": "Avisar a una persona", "type": "main", "index": 0}], []]},
  "¿Responder (prueba)?": {"main": [[{"node": "Responder en el grupo (prueba)", "type": "main", "index": 0}], []]},
}
wf = {"name": "E15-00 · Entrada (modo prueba)", "nodes": nodos, "connections": con, "pinData": {},
      "settings": {"executionOrder": "v1", "timezone": "America/Bogota", "saveDataSuccessExecution": "none",
                   "saveDataErrorExecution": "none", "saveManualExecutions": False, "errorWorkflow": ""},
      "meta": {"templateCredsSetupCompleted": False}}
out = raiz.parent / 'E15-00-entrada.json'
out.write_text(json.dumps(wf, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('✓', out.relative_to(raiz.parent.parent))
