// ══════════════════════════════════════════
// MENU — Carte La Playa + allergènes
// Éditer ce fichier pour mettre à jour la carte.
// allergens[] = allergènes présents dans le plat de base
// elements[]  = éléments retirables avec leurs allergènes
// ══════════════════════════════════════════

// Labels d'allergènes — doivent correspondre aux labels de _ALLERGEN_PATTERNS dans rush.js
// 'Gluten' | 'Lait' | 'Lactose' | 'Oeufs' | 'Poisson' | 'Crustacés' | 'Mollusques' |
// 'Arachides' | 'Fruits secs' | 'Soja' | 'Sésame' | 'Céleri' | 'Moutarde' | 'Sulfites'

const MENU_DATA = {

  categories: ['Entrées', 'Plats', 'Desserts'],

  dishes: [

    // ─── ENTRÉES ────────────────────────────────────────
    {
      id: 'e1',
      name: 'Melon & charcuterie',
      cat: 'Entrées',
      allergens: ['Moutarde'],
      elements: [
        { name: 'moutarde maison', allergens: ['Moutarde'] },
        { name: 'pain grillé',    allergens: ['Gluten'] }
      ]
    },
    {
      id: 'e2',
      name: 'Salade niçoise',
      cat: 'Entrées',
      allergens: ['Oeufs'],
      elements: [
        { name: 'anchois',  allergens: ['Poisson'] },
        { name: 'olives',   allergens: [] },
        { name: 'oeuf dur', allergens: ['Oeufs'] }
      ]
    },
    {
      id: 'e3',
      name: 'Carpaccio de poulpe',
      cat: 'Entrées',
      allergens: ['Mollusques', 'Céleri'],
      elements: [
        { name: 'chips de céleri', allergens: ['Céleri'] }
      ]
    },
    {
      id: 'e4',
      name: 'Planche fruits de mer',
      cat: 'Entrées',
      allergens: ['Crustacés', 'Mollusques'],
      elements: [
        { name: 'pain au seigle', allergens: ['Gluten'] },
        { name: 'beurre',        allergens: ['Lait'] },
        { name: 'mayonnaise',    allergens: ['Oeufs', 'Moutarde'] }
      ]
    },
    {
      id: 'e5',
      name: 'Gaspacho maison',
      cat: 'Entrées',
      allergens: [],
      elements: [
        { name: 'croutons',     allergens: ['Gluten'] },
        { name: 'crème fraîche', allergens: ['Lait'] }
      ]
    },
    {
      id: 'e6',
      name: 'Tartare de thon',
      cat: 'Entrées',
      allergens: ['Poisson'],
      elements: [
        { name: 'chips sésame', allergens: ['Sésame', 'Gluten'] },
        { name: 'avocat',      allergens: [] }
      ]
    },
    {
      id: 'e7',
      name: 'Burrata & tomates',
      cat: 'Entrées',
      allergens: ['Lait'],
      elements: [
        { name: 'burrata',    allergens: ['Lait'] },
        { name: 'basilic',    allergens: [] },
        { name: 'pain grillé', allergens: ['Gluten'] }
      ]
    },
    {
      id: 'e8',
      name: 'Soupe de poisson',
      cat: 'Entrées',
      allergens: ['Poisson', 'Mollusques'],
      elements: [
        { name: 'rouille',    allergens: ['Oeufs', 'Gluten', 'Moutarde'] },
        { name: 'croûtons',   allergens: ['Gluten'] },
        { name: 'gruyère râpé', allergens: ['Lait'] }
      ]
    },

    // ─── PLATS ──────────────────────────────────────────
    {
      id: 'p1',
      name: 'Poisson grillé du jour',
      cat: 'Plats',
      allergens: ['Poisson'],
      elements: [
        { name: 'beurre citron',  allergens: ['Lait'] },
        { name: 'légumes grillés', allergens: [] }
      ]
    },
    {
      id: 'p2',
      name: 'Daurade rôtie provençale',
      cat: 'Plats',
      allergens: ['Poisson'],
      elements: [
        { name: 'sauce vierge', allergens: [] },
        { name: 'pommes de terre rôties', allergens: [] }
      ]
    },
    {
      id: 'p3',
      name: 'Poulpe à la plancha',
      cat: 'Plats',
      allergens: ['Mollusques'],
      elements: [
        { name: 'pommes de terre écrasées', allergens: [] },
        { name: 'huile pimentée', allergens: [] }
      ]
    },
    {
      id: 'p4',
      name: 'Paëlla marinière',
      cat: 'Plats',
      allergens: ['Crustacés', 'Mollusques', 'Gluten'],
      elements: []
    },
    {
      id: 'p5',
      name: 'Risotto fruits de mer',
      cat: 'Plats',
      allergens: ['Crustacés', 'Mollusques'],
      elements: [
        { name: 'parmesan', allergens: ['Lait'] },
        { name: 'beurre',   allergens: ['Lait'] }
      ]
    },
    {
      id: 'p6',
      name: 'Côte de bœuf & frites',
      cat: 'Plats',
      allergens: [],
      elements: [
        { name: 'sauce béarnaise', allergens: ['Oeufs', 'Lait'] },
        { name: 'sauce poivre',    allergens: ['Lait'] },
        { name: 'beurre maître d\'hôtel', allergens: ['Lait'] }
      ]
    },
    {
      id: 'p7',
      name: 'Poulet fermier grillé',
      cat: 'Plats',
      allergens: [],
      elements: [
        { name: 'sauce moutarde-crème', allergens: ['Moutarde', 'Lait'] },
        { name: 'légumes du soleil', allergens: [] }
      ]
    },
    {
      id: 'p8',
      name: 'Burger La Playa',
      cat: 'Plats',
      allergens: ['Gluten', 'Oeufs', 'Lait'],
      elements: [
        { name: 'bun brioche',   allergens: ['Gluten', 'Oeufs', 'Lait'] },
        { name: 'cheddar',       allergens: ['Lait'] },
        { name: 'sauce burger',  allergens: ['Oeufs', 'Moutarde'] }
      ]
    },
    {
      id: 'p9',
      name: 'Linguines fruits de mer',
      cat: 'Plats',
      allergens: ['Gluten', 'Crustacés', 'Mollusques'],
      elements: [
        { name: 'parmesan', allergens: ['Lait'] }
      ]
    },
    {
      id: 'p10',
      name: 'Salade du pêcheur',
      cat: 'Plats',
      allergens: ['Poisson'],
      elements: [
        { name: 'anchois marinés', allergens: ['Poisson'] },
        { name: 'oeuf poché',      allergens: ['Oeufs'] },
        { name: 'croûtons ail',    allergens: ['Gluten'] }
      ]
    },
    {
      id: 'p11',
      name: 'Assiette végétarienne',
      cat: 'Plats',
      allergens: [],
      elements: [
        { name: 'feta',      allergens: ['Lait'] },
        { name: 'houmous',   allergens: ['Sésame'] },
        { name: 'pain pita', allergens: ['Gluten'] }
      ]
    },

    // ─── DESSERTS ───────────────────────────────────────
    {
      id: 'd1',
      name: 'Tarte au citron meringuée',
      cat: 'Desserts',
      allergens: ['Gluten', 'Oeufs', 'Lait'],
      elements: []
    },
    {
      id: 'd2',
      name: 'Crème brûlée vanille',
      cat: 'Desserts',
      allergens: ['Oeufs', 'Lait'],
      elements: []
    },
    {
      id: 'd3',
      name: 'Moelleux chocolat',
      cat: 'Desserts',
      allergens: ['Gluten', 'Oeufs', 'Lait'],
      elements: [
        { name: 'noisettes torréfiées', allergens: ['Fruits secs'] },
        { name: 'glace vanille',        allergens: ['Lait', 'Oeufs'] }
      ]
    },
    {
      id: 'd4',
      name: 'Sorbet pastèque',
      cat: 'Desserts',
      allergens: [],
      elements: []
    },
    {
      id: 'd5',
      name: 'Sorbet citron basilic',
      cat: 'Desserts',
      allergens: [],
      elements: []
    },
    {
      id: 'd6',
      name: 'Fruits frais de saison',
      cat: 'Desserts',
      allergens: [],
      elements: [
        { name: 'chantilly', allergens: ['Lait'] },
        { name: 'coulis',    allergens: [] }
      ]
    },
    {
      id: 'd7',
      name: 'Pavlova fruits rouges',
      cat: 'Desserts',
      allergens: ['Oeufs'],
      elements: [
        { name: 'chantilly', allergens: ['Lait'] }
      ]
    },
    {
      id: 'd8',
      name: 'Cheese-cake spéculoos',
      cat: 'Desserts',
      allergens: ['Gluten', 'Lait', 'Oeufs'],
      elements: []
    }
  ]
};

// ─── Matching allergen label → labels dans MENU_DATA ──
// Quelques alias pour normaliser les labels détectés vs labels menu
const _ALLERGEN_ALIASES = {
  'Lactose':     'Lait',
  'Fruits de mer': null,  // pas un label menu (= Crustacés + Mollusques)
  'Vegan':       null,    // préférence, pas un allergène à matcher sur le menu
  'Végétarien':  null,
};

function _normalizeAllergenLabel(label){
  if(label in _ALLERGEN_ALIASES) return _ALLERGEN_ALIASES[label];
  return label;
}

// ─── Moteur de recommandations ────────────────────────
// allergenLabels : string[] — labels des allergènes détectés (ex: ['Gluten','Poisson'])
// Retourne { safe: [...], adaptable: [{dish, remove:[...]}] }
function getMenuRecos(allergenLabels){
  const normalized = allergenLabels
    .map(_normalizeAllergenLabel)
    .filter(l => l !== null);

  if(!normalized.length) return { safe: MENU_DATA.dishes, adaptable: [] };

  const safe = [];
  const adaptable = [];

  MENU_DATA.dishes.forEach(dish => {
    // Allergènes qui posent problème dans ce plat
    const coreConflicts = dish.allergens.filter(a => normalized.includes(a));
    const elemConflicts = dish.elements.filter(el =>
      el.allergens.some(a => normalized.includes(a))
    );

    if(coreConflicts.length === 0 && elemConflicts.length === 0){
      safe.push(dish);
      return;
    }
    if(coreConflicts.length === 0 && elemConflicts.length > 0){
      adaptable.push({ dish, remove: elemConflicts.map(el => el.name) });
      return;
    }
    // Sinon : plat déconseillé → ignoré
  });

  return { safe, adaptable };
}
