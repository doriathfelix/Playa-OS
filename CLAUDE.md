# CLAUDE.md — Playa OS

Règles de travail pour Claude Code sur ce projet.

## Qu'est-ce que Playa OS ?

Application PWA de gestion de service pour La Playa en Camargue (restaurant de plage).
- Gestion de tables et transats, 4 services (S1/S2/Transats/Soir)
- Intégration Zenchef (API réservations)
- CRM client, modules cuisine/bar/HACCP/stocks
- Déployée sur GitHub Pages : https://doriathfelix.github.io/Playa-OS/

## Architecture — RÈGLE D'OR

```
docs/index.html   ← ARTEFACT DE BUILD — NE JAMAIS ÉDITER DIRECTEMENT
```

Le fichier `docs/index.html` est généré automatiquement par `build.ps1` (et par le CI GitHub Actions). Toutes les modifications doivent être faites dans les **fichiers sources** :

```
css/
  tokens.css     — variables CSS (palette, typo, ombres, rayons)
  app.css        — styles applicatifs

js/
  config.js      — TABLE_DATA, constantes (SALON_ID_MIN, TR_ROWS, BED_SLOTS…)
  state.js       — état global, mkResa(), reservations, fused
  utils.js       — utilitaires partagés (toast, svcColors, sortByTime…)
  render.js      — moteur de rendu (render, renderSidebar, renderTransats…)
  placement.js   — auto-placement + snapshotPlacements/restorePlacements
  gist.js        — persistance localStorage + sync GitHub Gist
  rush.js        — mode rush
  modal.js       — UI modales
  export.js      — impression / export
  zenchef.js     — API Zenchef + cache IndexedDB
  modules/
    nav.js / equipe.js / stocks.js / analyse.js / ai.js
    caisse.js / prestataires.js / cuisine.js / bar.js / haccp.js
    urgences.js / resas.js / settings.js / clients.js / groupes.js
  init.js        — bootstrap (dernier fichier chargé)

index.html       — coquille HTML (pas de JS, pas de CSS inline)
```

## Workflow de développement

### Modifier le code
1. Éditer les fichiers sources dans `js/` ou `css/`
2. Rebuild : `pwsh build.ps1` (PowerShell) ou `bash build.sh` (Mac/Linux)
3. Tester localement : ouvrir `playa-os-build.html` dans le navigateur
4. Alternative locale : `npx serve . -l 3131` puis ouvrir http://localhost:3131

### Déployer
1. Commit sur la branche de travail (`claude/mobile-project-access-c5W67` ou une branche feature)
2. Push : `git push -u origin <branche>`
3. Ouvrir une PR vers `master`
4. Merge → GitHub Actions (`.github/workflows/deploy.yml`) lance `build.ps1` automatiquement
5. `docs/index.html` est mis à jour et déployé sur GitHub Pages

### Vérification post-déploiement
- Aller sur https://doriathfelix.github.io/Playa-OS/
- Sur Safari/Chrome mobile : vider le cache (ou forcer le rechargement) pour voir la nouvelle version

## Conventions

### Langues
- UI et commentaires utilisateur : **français**
- Noms de fonctions et variables : **anglais** (exception : certaines vars historiques en français)
- Clés localStorage : préfixe `playa_` (ex: `playa_extra`, `playa_placements_YYYY-MM-DD`)

### Nommage
- Constantes globales : `UPPER_SNAKE_CASE` (ex: `TABLE_DATA`, `SALON_ID_MIN`)
- Services : `s1`, `s2`, `transats`, `soir` (minuscules, jamais `'S1'` dans le code)
- IDs de tables : entiers 1-30 + salons 1001-1004 (constante `SALON_ID_MIN = 1001`)
- IDs de transats : rangée × 100 + position (ex: 501 = rangée 500, position 1)

### Code
- Fonctions > 100 lignes → à découper en sous-fonctions
- Pas de valeurs magiques — utiliser les constantes de `config.js`
- Pas de `console.log` en production (sauf `init.js` pour les resets au démarrage)
- Gestion d'erreur : `try/catch(e){}` acceptable pour localStorage, log sinon

## Modules clés

### Persistance des placements (gist.js)
- `savePlacements(date)` — appelé dans `render()` à chaque render
- `loadPlacements(date)` — appelé après chaque `applyBookings()`
- `snapshotPlacements()` / `restorePlacements(snap)` — dans placement.js
- Stockage : `localStorage['playa_placements_YYYY-MM-DD']`
- Sync optionnel : GitHub Gist (token dans `localStorage['playa_gist_token']`)

### Zenchef sync (zenchef.js)
- `syncZenchef(date)` — sync principale (cache → fast path → full fetch)
- `setDate(dateStr)` — change la date courante, appelle syncZenchef si nécessaire
- Cache : IndexedDB (primaire) + localStorage (fallback)
- TTL cache : 15 min (dates présentes/futures), 24h (passé)

### Rendu (render.js)
- `render()` — point d'entrée unique, appelle `savePlacements` puis les renderers
- `renderTables()` / `renderTransats()` — selon l'onglet actif
- `renderSidebar()` — liste des resas avec filtres
- Toujours appeler `render()` après une modification de `reservations` ou `fused`

## Sécurité — points d'attention

- `ZC_TOKEN` dans `zenchef.js` est visible en clair dans le source public → risque API Zenchef
- Le token GitHub (Gist) est stocké en `localStorage` → visible via DevTools
- Solution à terme : proxy serverless (Cloudflare Worker) pour le token Zenchef

## Fichiers à NE PAS modifier directement

- `docs/index.html` — généré par build.ps1
- `docs/manifest.json` — généré par build.ps1
- `playa-os-build.html` — généré par build.ps1 (gitignored)
