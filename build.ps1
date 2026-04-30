# Playa OS - Script de build
# Assemble tous les fichiers en un seul HTML ouvrable directement dans le navigateur

$root = $PSScriptRoot
Write-Host "Build en cours..."

# CSS
$css = (Get-Content "$root/css/tokens.css" -Raw -Encoding UTF8) + "`n" +
       (Get-Content "$root/css/app.css"    -Raw -Encoding UTF8)

# HTML body : on extrait entre <body> et le commentaire JS
$indexHtml   = Get-Content "$root/index.html" -Raw -Encoding UTF8
$bodyStart   = $indexHtml.IndexOf('<body>') + 6
$jsMarker    = $indexHtml.IndexOf('</div><!-- /os-shell -->')
$jsMarkerEnd  = $jsMarker + '</div><!-- /os-shell -->'.Length
$bodyContent  = $indexHtml.Substring($bodyStart, $jsMarkerEnd - $bodyStart).Trim()

# JS - liste des fichiers dans l'ordre exact
$jsOrder = @(
    "js/config.js",
    "js/state.js",
    "js/utils.js",
    "js/render.js",
    "js/placement.js",
    "js/rush.js",
    "js/modal.js",
    "js/export.js",
    "js/zenchef.js",
    "js/modules/shared.js",
    "js/modules/nav.js",
    "js/modules/equipe.js",
    "js/modules/stocks.js",
    "js/modules/analyse.js",
    "js/modules/ai.js",
    "js/modules/caisse.js",
    "js/modules/prestataires.js",
    "js/modules/cuisine.js",
    "js/modules/bar.js",
    "js/modules/haccp.js",
    "js/modules/urgences.js",
    "js/modules/resas.js",
    "js/modules/settings.js",
    "js/init.js"
)
$js = ($jsOrder | ForEach-Object {
    Get-Content "$root/$_" -Raw -Encoding UTF8
}) -join "`n"

# Assemblage sans here-string pour eviter les problemes d'encodage
$nl = "`n"
$head = '<!DOCTYPE html>' + $nl +
        '<html lang="fr">' + $nl +
        '<head>' + $nl +
        '<meta charset="UTF-8">' + $nl +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' + $nl +
        '<meta name="apple-mobile-web-app-capable" content="yes">' + $nl +
        '<meta name="apple-mobile-web-app-status-bar-style" content="default">' + $nl +
        '<title>Playa OS</title>' + $nl +
        '<style>' + $nl + $css + $nl + '</style>' + $nl +
        '</head>' + $nl

$body = '<body>' + $nl +
        $bodyContent + $nl +
        '<script>' + $nl + $js + $nl + '</script>' + $nl +
        '</body>' + $nl +
        '</html>'

$output = $head + $body

# Ecriture UTF-8 sans BOM
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText("$root/playa-os-build.html", $output, $utf8NoBom)

Write-Host "OK - playa-os-build.html cree"
Start-Process "$root/playa-os-build.html"
