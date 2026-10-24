#!/usr/bin/env python3
"""Sintonía DS 3.0 · Figma → tokens.json (DTCG) + tokens.css, con auditoría de contraste.

Fuente: tokens/figma-export.json, generado desde el archivo de Figma «Sintonía DS 3.0 · E3»
(variables, estilos de texto y de efecto). Para actualizarlo, vuelve a exportar desde Figma
(ver README, «Cómo se hace un cambio»). Nunca edites tokens.css a mano.

Uso:
    python scripts/export_tokens.py            # genera y audita
    python scripts/export_tokens.py --check    # solo audita (sale con 1 si algo falla)
Sin dependencias externas (Python 3.9+).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tokens" / "figma-export.json"
OUT_JSON = ROOT / "tokens" / "tokens.json"
OUT_CSS = ROOT / "tokens" / "tokens.css"

PREFIX = {"Paleta": "palette", "Color": "color", "Dimensión": None, "Tipografía": None}
WEIGHT = {"Regular": 400, "Medium": 500, "Semi Bold": 600, "Bold": 700, "ExtraBold": 800}
FALLBACK = {
    "Archivo": "'Archivo', 'Inter', system-ui, sans-serif",
    "Inter": "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    "JetBrains Mono": "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
}

# Pares que se auditan: (texto/primer plano, fondo, mínimo, criterio)
PAIRS = [
    ("text/primary", "bg/canvas", 7, "1.4.6 lectura"),
    ("text/primary", "bg/surface", 7, "1.4.6 lectura"),
    ("text/primary", "bg/surface-muted", 7, "1.4.6 lectura"),
    ("text/primary", "chat/bubble-in", 7, "1.4.6 chat"),
    ("text/primary", "chat/bubble-out", 7, "1.4.6 chat"),
    ("text/secondary", "bg/canvas", 4.5, "1.4.3"),
    ("text/secondary", "bg/surface", 4.5, "1.4.3"),
    ("chat/meta", "chat/canvas", 4.5, "1.4.3"),
    ("chat/meta", "chat/bubble-in", 4.5, "1.4.3"),
    ("text/brand", "bg/surface", 4.5, "1.4.3"),
    ("text/brand", "bg/brand-soft", 4.5, "1.4.3"),
    ("text/on-brand", "bg/brand", 4.5, "1.4.3"),
    ("text/on-brand", "bg/brand-hover", 4.5, "1.4.3"),
    ("text/on-accent", "bg/accent", 4.5, "1.4.3"),
    ("text/on-critical", "bg/critical", 4.5, "1.4.3"),
    ("text/on-deep", "bg/brand-deep", 4.5, "1.4.3"),
    ("text/inverse", "bg/inverse", 4.5, "1.4.3"),
    ("text/accent-strong", "bg/accent-soft", 4.5, "1.4.3"),
    ("text/danger", "bg/danger-soft", 4.5, "1.4.3"),
    ("text/critical", "bg/critical-soft", 4.5, "1.4.3"),
    ("radio/display-ink", "radio/display", 4.5, "1.4.3"),
    ("radio/display-live", "radio/display", 4.5, "1.4.3"),
    ("text/bakelite", "bg/bakelite-soft", 4.5, "1.4.3"),
    ("border/warning", "bg/surface", 1.5, "decorativo (brillo de válvula)"),
    ("border/focus", "bg/surface", 3, "1.4.11 foco"),
    ("border/focus", "bg/canvas", 3, "1.4.11 foco"),
    ("border/strong", "bg/surface", 3, "1.4.11 borde de control"),
    ("icon/primary", "bg/surface", 3, "1.4.11 ícono"),
    ("icon/secondary", "bg/surface", 3, "1.4.11 ícono"),
    ("signal/live", "bg/surface", 3, "1.4.11 gráfico"),
    ("signal/off", "bg/surface", 3, "1.4.11 gráfico"),
    ("data/bar", "data/track", 3, "1.4.11 gráfico"),
]


def kebab(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower().replace("í", "i").replace("ó", "o")).strip("-")


def css_var(collection: str, name: str) -> str:
    p = PREFIX.get(collection)
    return f"--{p}-{kebab(name)}" if p else f"--{kebab(name)}"


def load():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    cols = data["out"]
    index = {}  # nombre de variable → (colección, fila)
    for cname, c in cols.items():
        for row in c["vars"]:
            index[row[0]] = (cname, row)
    return data, cols, index


def resolve(index, value, mode_i=0, depth=0):
    if isinstance(value, str) and value.startswith("@"):
        cname, row = index[value[1:]]
        vals = row[3:]
        return resolve(index, vals[min(mode_i, len(vals) - 1)], mode_i, depth + 1)
    return value


def px(v):
    return "0" if v == 0 else f"{v}px"


def css_value(index, cname, row, mode_i):
    kind, raw = row[1], row[3:][mode_i]
    if isinstance(raw, str) and raw.startswith("@"):
        tc, _ = index[raw[1:]]
        return f"var({css_var(tc, raw[1:])})"
    if kind == "F":
        return px(raw)
    if kind == "S":
        return FALLBACK.get(raw, f"'{raw}'")
    return raw


def hex_to_rgb(h):
    h = h.lstrip("#")[:6]
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def lum(h):
    def ch(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def build_css(data, cols, index):
    L = ["/* Sintonía DS 3.0 · tokens — GENERADO por scripts/export_tokens.py. No editar a mano. */",
         f"/* {data.get('source', '')} */", "", ":root {"]
    for cname in ("Paleta", "Dimensión", "Tipografía"):
        L.append(f"  /* {cname} */")
        for row in cols[cname]["vars"]:
            L.append(f"  {css_var(cname, row[0])}: {css_value(index, cname, row, 0)};")
    L.append("  /* Color · Claro */")
    for row in cols["Color"]["vars"]:
        L.append(f"  {css_var('Color', row[0])}: {css_value(index, 'Color', row, 0)};")
    L += effects_css(data)
    L.append("  color-scheme: light;")
    L.append("}")
    dark = [f"  {css_var('Color', r[0])}: {css_value(index, 'Color', r, 1)};" for r in cols["Color"]["vars"]]
    dark.append("  color-scheme: dark;")
    L += ["", "/* Oscuro elegido por la persona */", '[data-theme="dark"] {', *dark, "}",
          "", "/* Oscuro del sistema, salvo que la persona haya elegido Claro */",
          "@media (prefers-color-scheme: dark) {", '  :root:not([data-theme="light"]) {',
          *["  " + d for d in dark], "  }", "}", ""]
    L += text_styles_css(data)
    return "\n".join(L) + "\n"


def effects_css(data):
    out = ["  /* Efectos */"]
    for name, effs in data["ef"]:
        if name.startswith("Focus/"):
            continue
        parts = []
        for e in effs:
            inset = "inset " if e["t"] == "INNER_SHADOW" else ""
            parts.append(f"{inset}{px(e['x'])} {px(e['y'])} {px(e['r'])} {px(e['s'])} var({css_var('Color', e['bv'])})")
        out.append(f"  --{kebab(name)}: {', '.join(parts)};")
    out.append("  --focus-ring: 0 0 0 2px var(--color-bg-surface), 0 0 0 4px var(--color-border-focus);")
    return out


def text_styles_css(data):
    fam = {"Archivo": "var(--font-family-display)", "Inter": "var(--font-family-sans)",
           "JetBrains Mono": "var(--font-family-mono)"}
    out = ["/* Estilos de texto (Figma → .t-*) */"]
    for name, family, style, size, lh, ls, case in data["ts"]:
        lh_css = f"{lh}px" if isinstance(lh, (int, float)) else (str(round(float(lh[:-1]) / 100, 3)) if lh.endswith("%") else "normal")
        ls_css = "0" if ls in ("0%", 0) else f"{round(float(str(ls).rstrip('%')) / 100, 3)}em"
        rule = (f".t-{kebab(name)} {{ font-family: {fam[family]}; font-size: var(--font-size-{size}, {size}px); "
                f"font-weight: {WEIGHT[style]}; line-height: {lh_css}; letter-spacing: {ls_css};"
                + (" text-transform: uppercase;" if case == "UPPER" else "") + " }")
        out.append(rule)
    return out


def build_dtcg(data, cols, index):
    def put(tree, path, leaf):
        node = tree
        for p in path[:-1]:
            node = node.setdefault(p, {})
        node[path[-1]] = leaf

    tree = {"$description": "Sintonía DS 3.0 · E3 — formato DTCG. Generado por scripts/export_tokens.py."}
    types = {"C": "color", "F": "dimension", "S": "fontFamily"}
    for cname, c in cols.items():
        group = PREFIX.get(cname) or kebab(cname)
        for row in c["vars"]:
            name, kind, web, *vals = row
            def val(v):
                if isinstance(v, str) and v.startswith("@"):
                    tc, _ = index[v[1:]]
                    return "{" + ".".join([PREFIX.get(tc) or kebab(tc), *v[1:].split("/")]) + "}"
                return f"{v}px" if kind == "F" else v
            leaf = {"$type": types[kind], "$value": val(vals[0]),
                    "$extensions": {"figma": {"collection": cname, "codeSyntax": web}}}
            if len(vals) > 1:
                leaf["$extensions"]["mode"] = {m: val(v) for m, v in zip(c["modes"], vals)}
            put(tree, [group, *name.split("/")], leaf)
    tree["typography"] = {kebab(n): {"$type": "typography", "$value": {
        "fontFamily": f, "fontWeight": WEIGHT[s], "fontSize": f"{z}px",
        "lineHeight": lh if isinstance(lh, str) else f"{lh}px", "letterSpacing": ls}} for n, f, s, z, lh, ls, _ in data["ts"]}
    return tree


def audit(cols, index):
    color = {r[0]: r for r in cols["Color"]["vars"]}
    fails, rows = 0, []
    for mi, mode in enumerate(cols["Color"]["modes"]):
        for fg, bg, mn, crit in PAIRS:
            a = resolve(index, color[fg][3:][mi], mi)
            b = resolve(index, color[bg][3:][mi], mi)
            r = ratio(a, b)
            ok = r >= mn
            fails += 0 if ok else 1
            rows.append(f"{'OK  ' if ok else 'FALLA'} {mode:7} {fg:22} sobre {bg:18} {r:5.2f}:1 (mín {mn}) {crit}")
    return fails, rows


def main():
    data, cols, index = load()
    fails, rows = audit(cols, index)
    if "--check" not in sys.argv:
        OUT_CSS.write_text(build_css(data, cols, index), encoding="utf-8")
        OUT_JSON.write_text(json.dumps(build_dtcg(data, cols, index), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        n = sum(len(c["vars"]) for c in cols.values())
        print(f"tokens.css y tokens.json generados · {n} variables · {len(data['ts'])} estilos de texto")
    print("\n".join(rows))
    print(f"\nContraste: {len(rows) - fails}/{len(rows)} pares pasan.")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
