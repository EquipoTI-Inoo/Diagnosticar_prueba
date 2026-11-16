"""
Genera app/fonts/archivo-800-87.woff2: instancia estática de Archivo (OFL) en
wdth=87.5 y wght=800, subset latín + español. Pesa ~20 KB frente a ~90 KB del
variable completo, y mejora el LCP (el H1 del hero es el elemento LCP).

  python3 scripts/build-fonts.py <ruta a Archivo-VariableFont_wdth,wght.ttf>
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

src = sys.argv[1]
out = "app/fonts/archivo-800-87.woff2"
font = TTFont(src)
inst = instantiateVariableFont(font, {"wdth": 87.5, "wght": 800}, inplace=False)
# Latín básico + Latin-1 (á é í ó ú ñ ü ¿ ¡ « » ·) + puntuación tipográfica + €/S/ ★ → − etc.
unicodes = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2032, 0x2033,
    0x20AC, 0x2192, 0x2212, 0x2605, 0x00B7,
]
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum"]
opts.name_IDs = ["*"]
opts.notdef_outline = True
sub = subset.Subsetter(opts)
sub.populate(unicodes=unicodes)
sub.subset(inst)
inst.flavor = "woff2"
inst.save(out)
print("ok", out)
