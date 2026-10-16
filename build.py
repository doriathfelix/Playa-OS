#!/usr/bin/env python3
"""
Playa OS — build.py
Alternative à build.ps1 pour Mac/Linux (sans PowerShell requis).
Assemble les sources → docs/index.html + playa-os-build.html
"""
import re, os, sys

root = os.path.dirname(os.path.abspath(__file__))

print("Build en cours...")

def read(path):
    with open(os.path.join(root, path), encoding='utf-8') as f:
        return f.read()

# CSS
css = read('css/tokens.css') + '\n' + read('css/app.css')

# HTML body : entre <body> et </div><!-- /os-shell -->
index_html = read('index.html')
m = re.search(r'<body>(.*?</div><!-- /os-shell -->)', index_html, re.DOTALL)
if not m:
    print("ERREUR : balise <body>…</div><!-- /os-shell --> introuvable dans index.html", file=sys.stderr)
    sys.exit(1)
body_content = m.group(1).strip()

# JS — ordre exact (miroir de build.ps1)
js_files = [
    'js/config.js', 'js/state.js', 'js/utils.js', 'js/render.js',
    'js/placement.js', 'js/gist.js', 'js/rush.js', 'js/modal.js',
    'js/export.js', 'js/zenchef.js',
    'js/modules/shared.js', 'js/modules/nav.js', 'js/modules/equipe.js',
    'js/modules/stocks.js', 'js/modules/analyse.js', 'js/modules/ai.js',
    'js/modules/caisse.js', 'js/modules/prestataires.js', 'js/modules/cuisine.js',
    'js/modules/bar.js', 'js/modules/haccp.js', 'js/modules/urgences.js',
    'js/modules/resas.js', 'js/modules/settings.js', 'js/modules/clients.js',
    'js/modules/groupes.js', 'js/init.js'
]

missing = [f for f in js_files if not os.path.exists(os.path.join(root, f))]
if missing:
    print(f"ERREUR — fichiers manquants : {missing}", file=sys.stderr)
    sys.exit(1)

js = '\n'.join(read(f) for f in js_files)

manifest = '''{
  "name": "Playa OS",
  "short_name": "Playa OS",
  "description": "Gestion de service · La Playa en Camargue",
  "start_url": "/Playa-OS/",
  "scope": "/Playa-OS/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ECEEF2",
  "theme_color": "#0EA5E9",
  "lang": "fr",
  "icons": []
}'''

style_block = f'<style>\n{css}\n</style>\n</head>'
body_block = f'<body>\n{body_content}\n<script>\n{js}\n</script>\n</body>\n</html>'

head_local = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<title>Playa OS</title>'''

head_web = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#0EA5E9">
<link rel="manifest" href="manifest.json">
<title>Playa OS</title>'''

def write(path, content):
    with open(os.path.join(root, path), 'w', encoding='utf-8') as f:
        f.write(content)

write('playa-os-build.html', head_local + '\n' + style_block + '\n' + body_block)
print('OK - playa-os-build.html créé')

os.makedirs(os.path.join(root, 'docs'), exist_ok=True)
write('docs/index.html', head_web + '\n' + style_block + '\n' + body_block)
print('OK - docs/index.html créé (GitHub Pages)')

write('docs/manifest.json', manifest)
print('OK - docs/manifest.json créé')

# Ouvrir en local (pas en CI)
if not os.environ.get('CI'):
    import subprocess, platform
    if platform.system() == 'Darwin':
        subprocess.Popen(['open', os.path.join(root, 'playa-os-build.html')])
