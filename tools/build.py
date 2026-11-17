"""Prépare le site pour la publication / Prepares the site for publishing.

1. Remplace les marqueurs __SITE__, __REPO__, __OWNER__, __KOFI__ dans les fichiers.
2. Crée downloads/Expansion-Lab-Windows.zip (version hors-ligne).

Usage : python tools/build.py --owner NOM_GITHUB --kofi https://ko-fi.com/xxx [--repo expansion-lab]
"""
import argparse, pathlib, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEXT = [".html", ".md", ".xml", ".txt", ".js", ".css", ".webmanifest"]
SKIP = {".git", "downloads", "tools", ".claude"}

ap = argparse.ArgumentParser()
ap.add_argument("--owner", required=True)
ap.add_argument("--kofi", required=True)
ap.add_argument("--repo", default="expansion-lab")
a = ap.parse_args()
site = f"https://{a.owner.lower()}.github.io/{a.repo}"
values = {"__SITE__": site, "__REPO__": f"https://github.com/{a.owner}/{a.repo}", "__OWNER__": a.owner, "__KOFI__": a.kofi}

for p in ROOT.rglob("*"):
    if not p.is_file() or SKIP & set(p.relative_to(ROOT).parts):
        continue
    if p.suffix not in TEXT and p.name != "LICENSE":
        continue
    s = p.read_text(encoding="utf-8")
    n = s
    for k, v in values.items():
        n = n.replace(k, v)
    if n != s:
        p.write_text(n, encoding="utf-8", newline="\n")
        print("OK", p.relative_to(ROOT))

out = ROOT / "downloads" / "Expansion-Lab-Windows.zip"
out.parent.mkdir(exist_ok=True)
readme = f"""Expansion Lab – version hors-ligne / offline version
====================================================

FR : Double-cliquez sur « Expansion Lab.html » pour lancer l'application
     dans votre navigateur (Edge, Chrome ou Firefox). Aucune installation,
     fonctionne sans internet. Site : {site}/

EN : Double-click "Expansion Lab.html" to open the app in your browser
     (Edge, Chrome or Firefox). No install, works offline.
     Website: {site}/en/

Cet outil vous a été utile ? / Was this tool useful?
{a.kofi}

Open source (MIT) – {values['__REPO__']}
"""
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(ROOT / "mpc-expansion-maker.html", "Expansion Lab/Expansion Lab.html")
    z.write(ROOT / "favicon.svg", "Expansion Lab/favicon.svg")
    z.writestr("Expansion Lab/LISEZ-MOI - README.txt", readme.replace("\n", "\r\n"))
print("OK", out.relative_to(ROOT), out.stat().st_size, "octets")
