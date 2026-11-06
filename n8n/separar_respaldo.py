"""Separa el respaldo combinado de n8n en un JSON por flujo, listo para importar.

Uso:  python3 n8n/separar_respaldo.py ~/Downloads/sintonia-n8n-flujos-2026-11-03.json
Escribe en n8n/flujos/<nombre>.json y se detiene si encuentra algo que parezca una clave.
"""
import json, re, sys, pathlib, unicodedata

src = pathlib.Path(sys.argv[1]).expanduser()
texto = src.read_text(encoding="utf-8")
sospechoso = re.findall(r'(Bearer\s+[A-Za-z0-9._-]{12,}|"(?:key|apikey|token)"\s*:\s*"[^"={]{12,}")', texto)
if sospechoso:
    sys.exit(f"Detenido: {len(sospechoso)} posibles claves. Revisa el archivo antes de subirlo.")
dest = pathlib.Path(__file__).parent / "flujos"
dest.mkdir(exist_ok=True)
for wf in json.loads(texto):
    slug = unicodedata.normalize("NFKD", wf["name"]).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^A-Za-z0-9]+", "-", slug).strip("-").lower()
    (dest / f"{slug}.json").write_text(json.dumps(wf, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("✓", slug)
