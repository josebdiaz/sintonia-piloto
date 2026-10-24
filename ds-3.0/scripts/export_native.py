#!/usr/bin/env python3
"""Sintonía DS 3.0 · tokens.json → tokens/theme.native.ts (React Native / Expo).

Corrige lo que los generadores automáticos de briefs traducen mal desde Figma:
- lineHeight y letterSpacing pasan de % a px absolutos (React Native no acepta %).
- Cada estilo usa la familia exacta de la fuente cargada con @expo-google-fonts
  (en RN no se combina fontFamily personalizado con fontWeight).
- Colores en Claro y Oscuro desde las mismas variables de Figma, con alias resueltos.
- Sombras de los estilos de efecto con color por modo (las sombras internas no existen en RN).

Uso: python3 scripts/export_native.py   (después de export_tokens.py)
Sin dependencias externas (Python 3.9+). Nunca edites theme.native.ts a mano.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "tokens" / "tokens.json"
EXPORT = ROOT / "tokens" / "figma-export.json"
OUT = ROOT / "tokens" / "theme.native.ts"

# Nombre de cada archivo de fuente en @expo-google-fonts (useFonts)
FONT_FILE = {
    ("Archivo", 700): "Archivo_700Bold",
    ("Archivo", 800): "Archivo_800ExtraBold",
    ("Inter", 400): "Inter_400Regular",
    ("Inter", 500): "Inter_500Medium",
    ("Inter", 600): "Inter_600SemiBold",
    ("Inter", 700): "Inter_700Bold",
    ("JetBrains Mono", 500): "JetBrainsMono_500Medium",
    ("JetBrains Mono", 700): "JetBrainsMono_700Bold",
    ("JetBrains Mono", 800): "JetBrainsMono_800ExtraBold",
}
FONT_PACKAGE = {"Archivo": "@expo-google-fonts/archivo", "Inter": "@expo-google-fonts/inter",
                "JetBrains Mono": "@expo-google-fonts/jetbrains-mono"}


def camel(s: str) -> str:
    s = s.replace("·", " ").strip()
    parts = [p for p in re.split(r"[-_\s/]+", s) if p]
    if not parts:
        return s
    out = parts[0].lower() + "".join(p[:1].upper() + p[1:] for p in parts[1:])
    return out if not out[0].isdigit() else "_" + out


def key(k: str) -> str:
    """Clave TS válida: los números quedan como están (space[16])."""
    return k if re.fullmatch(r"\d+(\.\d+)?", k) or re.fullmatch(r"[A-Za-z_]\w*", k) else json.dumps(k)


def px(v) -> float:
    if isinstance(v, (int, float)):
        return float(v)
    m = re.fullmatch(r"(-?[\d.]+)px", str(v).strip())
    if not m:
        raise ValueError(f"no es px: {v}")
    return float(m.group(1))


def num(x: float) -> str:
    x = round(x, 2)
    return str(int(x)) if x == int(x) else str(x)


def walk(node, path=()):
    if isinstance(node, dict) and "$value" in node:
        yield path, node
        return
    if isinstance(node, dict):
        for k, v in node.items():
            if not k.startswith("$"):
                yield from walk(v, path + (k,))


def main() -> None:
    d = json.loads(TOKENS.read_text(encoding="utf-8"))
    flat = {".".join(p): t for p, t in walk(d)}

    def resolve(v, mode=None, depth=0):
        if depth > 10:
            raise ValueError("alias circular")
        if isinstance(v, str):
            m = re.fullmatch(r"\{(.+)\}", v.strip())
            if m:
                t = flat[m.group(1)]
                ext = (t.get("$extensions") or {}).get("mode")
                val = ext.get(mode, t["$value"]) if (ext and mode) else t["$value"]
                return resolve(val, mode, depth + 1)
        return v

    # Colores por modo
    colors = {"light": {}, "dark": {}}
    for p, t in walk(d["color"], ("color",)):
        modes = (t.get("$extensions") or {}).get("mode") or {}
        for scheme, mname in (("light", "Claro"), ("dark", "Oscuro")):
            raw = modes.get(mname, t["$value"])
            val = resolve(raw, mname)
            cur = colors[scheme]
            for seg in p[1:-1]:
                cur = cur.setdefault(camel(seg), {})
            cur[camel(p[-1])] = str(val).lower()

    # Dimensión
    dims = {}
    for p, t in walk(d["dimension"], ("dimension",)):
        cur = dims.setdefault(camel(p[1]), {})
        cur[p[-1].replace("-", "_") if not p[-1][0].isdigit() else p[-1].replace("-", "_")] = px(resolve(t["$value"]))

    # Tipografía
    typo = {}
    missing = set()
    for p, t in walk(d["typography"], ("typography",)):
        v = t["$value"]
        fam = resolve(v["fontFamily"])
        w = int(v["fontWeight"])
        size = px(resolve(v["fontSize"]))
        lh = str(v.get("lineHeight", "auto"))
        if lh.endswith("%"):
            line = size * float(lh[:-1]) / 100
        elif lh.endswith("px"):
            line = px(lh)
        else:
            line = None
        ls = str(v.get("letterSpacing", "0px"))
        spacing = size * float(ls[:-1]) / 100 if ls.endswith("%") else px(ls)
        f = FONT_FILE.get((fam, w))
        if not f:
            missing.add((fam, w))
        typo[camel(p[-1])] = {"fontFamily": f or fam, "fontSize": size, "lineHeight": line, "letterSpacing": spacing,
                              "_figma": f"{fam} {w} · {num(size)}/{lh} · {ls}"}
    if missing:
        raise SystemExit(f"Falta mapear estas fuentes en FONT_FILE: {sorted(missing)}")

    # Sombras (estilos de efecto)
    shadows = {"light": {}, "dark": {}}
    skipped = []
    ef = json.loads(EXPORT.read_text(encoding="utf-8")).get("ef", [])
    for name, effects in ef:
        drops = [e for e in effects if e["t"] == "DROP_SHADOW" and e.get("r", 0) > 0]
        if not drops:
            skipped.append(name)
            continue
        e = drops[0]
        for scheme in ("light", "dark"):
            cur = colors[scheme]
            for seg in e["bv"].split("/"):
                cur = cur[camel(seg)]
            shadows[scheme][camel(name.split("/")[-1])] = {
                "shadowColor": cur, "shadowOffset": {"width": e["x"], "height": e["y"]},
                "shadowRadius": e["r"] / 2, "shadowOpacity": 1, "elevation": max(1, round(e["r"] / 2)),
                "boxShadow": f"{num(e['x'])}px {num(e['y'])}px {num(e['r'])}px {num(e.get('s', 0))}px {cur}"}

    def ts(o, ind=1):
        pad = "  " * ind
        if isinstance(o, dict):
            items = [f"{pad}{key(k)}: {ts(v, ind + 1)}," for k, v in o.items() if not k.startswith("_")]
            return "{\n" + "\n".join(items) + "\n" + "  " * (ind - 1) + "}"
        if isinstance(o, str):
            return json.dumps(o, ensure_ascii=False)
        if o is None:
            return "undefined"
        return num(o)

    typo_lines = []
    for k, v in typo.items():
        props = [f'fontFamily: "{v["fontFamily"]}"', f"fontSize: {num(v['fontSize'])}"]
        if v["lineHeight"] is not None:
            props.append(f"lineHeight: {num(v['lineHeight'])}")
        if v["letterSpacing"]:
            props.append(f"letterSpacing: {num(v['letterSpacing'])}")
        typo_lines.append(f"  {k}: {{ {', '.join(props)} }}, // {v['_figma']}")

    fonts_by_pkg = {}
    for (fam, w), f in FONT_FILE.items():
        if any(t["fontFamily"] == f for t in typo.values()):
            fonts_by_pkg.setdefault(FONT_PACKAGE[fam], []).append(f)

    src = d.get("$description", "")
    out = [
        "// Sintonía DS 3.0 · tema para React Native / Expo.",
        "// GENERADO por scripts/export_native.py desde tokens/tokens.json. No editar a mano.",
        f"// Fuente: {src}" if src else "// Fuente: Figma «Sintonía DS 3.0 · E3».",
        "//",
        "// Fuentes (cárgalas con useFonts antes de mostrar texto):",
    ]
    for pkg, fs in fonts_by_pkg.items():
        out.append(f"//   import {{ {', '.join(fs)} }} from \"{pkg}\";")
    out += [
        "",
        "export const colors = {",
        f"  light: {ts(colors['light'], 2)},",
        f"  dark: {ts(colors['dark'], 2)},",
        "} as const;",
        "",
        f"export const spacing = {ts(dims.get('space', {}))} as const;",
        "",
        f"export const radius = {ts(dims.get('radius', {}))} as const;",
        "",
        f"export const size = {ts(dims.get('size', {}))} as const;",
        "",
        f"export const stroke = {ts(dims.get('stroke', {}))} as const;",
        "",
        "/** lineHeight y letterSpacing en px (convertidos desde los % de Figma). */",
        "export const typography = {",
        *typo_lines,
        "} as const;",
        "",
        "/** iOS usa shadow*, Android elevation; RN 0.76+ (Expo 52, nueva arquitectura) acepta boxShadow. */",
        "export const shadows = {",
        f"  light: {ts(shadows['light'], 2)},",
        f"  dark: {ts(shadows['dark'], 2)},",
        "} as const;",
        f"// Sin equivalente en RN y omitidos: {', '.join(skipped) or 'ninguno'}.",
        "",
        "export type ColorScheme = keyof typeof colors;",
        "export const getTheme = (scheme: ColorScheme | null | undefined) => {",
        "  const s: ColorScheme = scheme === \"dark\" ? \"dark\" : \"light\";",
        "  return { scheme: s, colors: colors[s], shadows: shadows[s], spacing, radius, size, stroke, typography };",
        "};",
        "export type Theme = ReturnType<typeof getTheme>;",
        "",
    ]
    OUT.write_text("\n".join(out), encoding="utf-8")
    n_col = sum(1 for _ in re.finditer(r'"#', "\n".join(out)))
    print(f"theme.native.ts: {len(typo)} estilos de texto, {n_col} valores de color (2 modos), "
          f"{sum(len(v) for v in dims.values())} dimensiones, {len(shadows['light'])} sombras.")


if __name__ == "__main__":
    main()
