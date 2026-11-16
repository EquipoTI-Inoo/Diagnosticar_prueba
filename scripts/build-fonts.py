"""
Genera las fuentes autohospedadas de app/fonts/ (todas OFL), con subset latín + español:

- archivo-800-87.woff2   Archivo, instancia estática wdth=87.5 / wght=800 (titulares, H1 = LCP).
- intertight-400-500.woff2  Inter Tight variable recortada a wght 400–500 (texto), sin hinting.
- jetbrains-500.woff2    JetBrains Mono, instancia estática wght=500 (datos), sin ligaduras de código.

Pesan ~12 + ~19 + ~8 KB frente a ~12 + 45 + 22 KB de los subsets «latin» de Google Fonts,
lo que acorta la ruta crítica del LCP móvil (Fase 6, F26).

  python3 scripts/build-fonts.py <Archivo[wdth,wght].ttf> <InterTight[wght].ttf> <JetBrainsMono[wght].ttf>

Fuentes: github.com/google/fonts (ofl/archivo, ofl/intertight, ofl/jetbrainsmono).
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

# Latín básico + Latin-1 (á é í ó ú ñ ü ¿ ¡ « » ·) + puntuación tipográfica + € ← → − ≥ ★ ✓ ✗ ×
UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2032, 0x2033,
    0x20AC, 0x2190, 0x2192, 0x2212, 0x2265, 0x2605, 0x2713, 0x2717, 0x00D7,
]


def generar(src, ejes, salida, rasgos, hinting=True):
    font = TTFont(src)
    opts = subset.Options()
    opts.layout_features = rasgos
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = hinting
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)  # primero el subset: el instancer parcial falla con gvar perezoso
    inst = instantiateVariableFont(font, ejes, inplace=False)
    inst.flavor = "woff2"
    inst.save(salida)
    print("ok", salida)


archivo, inter, mono = sys.argv[1:4]
generar(archivo, {"wdth": 87.5, "wght": 800}, "app/fonts/archivo-800-87.woff2",
        ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum"])
generar(inter, {"wght": (400, 500)}, "app/fonts/intertight-400-500.woff2",
        ["kern", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum"], hinting=False)
generar(mono, {"wght": 500}, "app/fonts/jetbrains-500.woff2",
        ["kern", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum"], hinting=False)
