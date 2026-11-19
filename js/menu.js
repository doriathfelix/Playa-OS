// ══════════════════════════════════════════
// MENU — Carte La Playa · allergènes + régimes
//
// allergens[]      : allergènes dans le plat de base (non retirables)
// elements[]       : éléments retirables avec leurs allergènes
// regimes[]        : régimes compatibles avec le plat tel quel
// regimes_adapt[]  : régimes compatibles si on retire certains éléments
//
// Régimes supportés : 'Végétarien' | 'Végan' | 'Halal' | 'Sans porc' |
//                     'Sans alcool' | 'Pescatarien' | 'Flexitarien'
// ══════════════════════════════════════════

const REGIME_TYPES = ['Végétarien','Végan','Halal','Sans porc','Sans alcool','Pescatarien','Flexitarien'];

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
      ],
      regimes: ['Sans alcool'],
      regimes_adapt: []
      // Charcuterie = porc → incompatible Halal, Sans porc, Végétarien, Végan
    },
    {
      id: 'e2',
      name: 'Salade niçoise',
      cat: 'Entrées',
      allergens: ['Oeufs'],
      elements: [
        { name: 'anchois',  allergens: ['Poisson'] },
        { name: 'oeuf dur', allergens: ['Oeufs'] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végétarien', remove: ['anchois'] },
        { regime: 'Végan',      remove: ['anchois', 'oeuf dur'] }
      ]
    },
    {
      id: 'e3',
      name: 'Carpaccio de poulpe',
      cat: 'Entrées',
      allergens: ['Mollusques', 'Céleri'],
      elements: [
        { name: 'chips de céleri', allergens: ['Céleri'] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
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
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'e5',
      name: 'Gaspacho maison',
      cat: 'Entrées',
      allergens: [],
      elements: [
        { name: 'croutons',      allergens: ['Gluten'] },
        { name: 'crème fraîche', allergens: ['Lait'] }
      ],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: ['croutons', 'crème fraîche'] }
      ]
    },
    {
      id: 'e6',
      name: 'Tartare de thon',
      cat: 'Entrées',
      allergens: ['Poisson'],
      elements: [
        { name: 'chips sésame', allergens: ['Sésame', 'Gluten'] },
        { name: 'avocat',       allergens: [] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'e7',
      name: 'Burrata & tomates',
      cat: 'Entrées',
      allergens: ['Lait'],
      elements: [
        { name: 'burrata',     allergens: ['Lait'] },
        { name: 'pain grillé', allergens: ['Gluten'] }
      ],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: ['burrata'] }
      ]
    },
    {
      id: 'e8',
      name: 'Soupe de poisson',
      cat: 'Entrées',
      allergens: ['Poisson', 'Mollusques'],
      elements: [
        { name: 'rouille',       allergens: ['Oeufs', 'Gluten', 'Moutarde'] },
        { name: 'croûtons',      allergens: ['Gluten'] },
        { name: 'gruyère râpé',  allergens: ['Lait'] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },

    // ─── PLATS ──────────────────────────────────────────
    {
      id: 'p1',
      name: 'Poisson grillé du jour',
      cat: 'Plats',
      allergens: ['Poisson'],
      elements: [
        { name: 'beurre citron',   allergens: ['Lait'] },
        { name: 'légumes grillés', allergens: [] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'p2',
      name: 'Daurade rôtie provençale',
      cat: 'Plats',
      allergens: ['Poisson'],
      elements: [
        { name: 'sauce vierge',           allergens: [] },
        { name: 'pommes de terre rôties', allergens: [] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: [] }  // sauce vierge = huile+herbes+tomate, OK vegan
      ]
    },
    {
      id: 'p3',
      name: 'Poulpe à la plancha',
      cat: 'Plats',
      allergens: ['Mollusques'],
      elements: [
        { name: 'pommes de terre écrasées', allergens: [] },
        { name: 'huile pimentée',           allergens: [] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'p4',
      name: 'Paëlla marinière',
      cat: 'Plats',
      allergens: ['Crustacés', 'Mollusques', 'Gluten'],
      elements: [],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'p5',
      name: 'Risotto fruits de mer',
      cat: 'Plats',
      allergens: ['Crustacés', 'Mollusques'],
      elements: [
        { name: 'parmesan', allergens: ['Lait'] },
        { name: 'beurre',   allergens: ['Lait'] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: ['parmesan', 'beurre'] }
      ]
    },
    {
      id: 'p6',
      name: 'Côte de bœuf & frites',
      cat: 'Plats',
      allergens: [],
      elements: [
        { name: 'sauce béarnaise',          allergens: ['Oeufs', 'Lait'] },
        { name: 'sauce poivre',             allergens: ['Lait'] },
        { name: "beurre maître d'hôtel",    allergens: ['Lait'] }
      ],
      regimes: ['Sans porc', 'Sans alcool'],
      regimes_adapt: []
      // Boeuf = viande → incompatible Végétarien, Végan, Flexitarien
      // Halal dépend de la provenance — à vérifier avec le chef
    },
    {
      id: 'p7',
      name: 'Poulet fermier grillé',
      cat: 'Plats',
      allergens: [],
      elements: [
        { name: 'sauce moutarde-crème', allergens: ['Moutarde', 'Lait'] },
        { name: 'légumes du soleil',    allergens: [] }
      ],
      regimes: ['Sans porc', 'Sans alcool'],
      regimes_adapt: []
      // Volaille = viande → incompatible Végétarien, Végan, Flexitarien
    },
    {
      id: 'p8',
      name: 'Burger La Playa',
      cat: 'Plats',
      allergens: ['Gluten', 'Oeufs', 'Lait'],
      elements: [
        { name: 'bun brioche',  allergens: ['Gluten', 'Oeufs', 'Lait'] },
        { name: 'cheddar',      allergens: ['Lait'] },
        { name: 'sauce burger', allergens: ['Oeufs', 'Moutarde'] }
      ],
      regimes: ['Sans porc', 'Sans alcool'],
      regimes_adapt: []
    },
    {
      id: 'p9',
      name: 'Linguines fruits de mer',
      cat: 'Plats',
      allergens: ['Gluten', 'Crustacés', 'Mollusques'],
      elements: [
        { name: 'parmesan', allergens: ['Lait'] }
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: ['parmesan'] }
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
      ],
      regimes: ['Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végétarien', remove: ['anchois marinés'] },
        { regime: 'Végan',      remove: ['anchois marinés', 'oeuf poché'] }
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
      ],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: ['feta'] }
      ]
    },

    // ─── DESSERTS ───────────────────────────────────────
    {
      id: 'd1',
      name: 'Tarte au citron meringuée',
      cat: 'Desserts',
      allergens: ['Gluten', 'Oeufs', 'Lait'],
      elements: [],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'd2',
      name: 'Crème brûlée vanille',
      cat: 'Desserts',
      allergens: ['Oeufs', 'Lait'],
      elements: [],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'd3',
      name: 'Moelleux chocolat',
      cat: 'Desserts',
      allergens: ['Gluten', 'Oeufs', 'Lait'],
      elements: [
        { name: 'noisettes torréfiées', allergens: ['Fruits secs'] },
        { name: 'glace vanille',        allergens: ['Lait', 'Oeufs'] }
      ],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'd4',
      name: 'Sorbet pastèque',
      cat: 'Desserts',
      allergens: [],
      elements: [],
      regimes: ['Végétarien', 'Végan', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'd5',
      name: 'Sorbet citron basilic',
      cat: 'Desserts',
      allergens: [],
      elements: [],
      regimes: ['Végétarien', 'Végan', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'd6',
      name: 'Fruits frais de saison',
      cat: 'Desserts',
      allergens: [],
      elements: [
        { name: 'chantilly', allergens: ['Lait'] },
        { name: 'coulis',    allergens: [] }
      ],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: [
        { regime: 'Végan', remove: ['chantilly'] }
      ]
    },
    {
      id: 'd7',
      name: 'Pavlova fruits rouges',
      cat: 'Desserts',
      allergens: ['Oeufs'],
      elements: [
        { name: 'chantilly', allergens: ['Lait'] }
      ],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    },
    {
      id: 'd8',
      name: 'Cheese-cake spéculoos',
      cat: 'Desserts',
      allergens: ['Gluten', 'Lait', 'Oeufs'],
      elements: [],
      regimes: ['Végétarien', 'Halal', 'Sans porc', 'Sans alcool', 'Flexitarien', 'Pescatarien'],
      regimes_adapt: []
    }
  ]
};

// ─── Matching allergen label → labels dans MENU_DATA ──
const _ALLERGEN_ALIASES = {
  'Lactose': 'Lait',
  'Fruits de mer': null,  // = Crustacés + Mollusques, géré par les deux séparément
};

function _normalizeAllergenLabel(label){
  if(label in _ALLERGEN_ALIASES) return _ALLERGEN_ALIASES[label];
  return label;
}

// ─── Recommandations allergènes ───────────────────────
// allergenLabels : string[] — ex: ['Gluten', 'Poisson']
function getMenuRecos(allergenLabels){
  const normalized = allergenLabels.map(_normalizeAllergenLabel).filter(l => l !== null);
  if(!normalized.length) return { safe: MENU_DATA.dishes, adaptable: [] };

  const safe = [], adaptable = [];
  MENU_DATA.dishes.forEach(dish => {
    const coreConflicts = dish.allergens.filter(a => normalized.includes(a));
    const elemConflicts = dish.elements.filter(el =>
      el.allergens.some(a => normalized.includes(a))
    );
    if(coreConflicts.length === 0 && elemConflicts.length === 0){
      safe.push(dish);
    } else if(coreConflicts.length === 0 && elemConflicts.length > 0){
      adaptable.push({ dish, remove: elemConflicts.map(el => el.name) });
    }
  });
  return { safe, adaptable };
}

// ─── Recommandations régimes ──────────────────────────
// regimeLabels : string[] — ex: ['Végétarien', 'Sans alcool']
function getRegimeRecos(regimeLabels){
  if(!regimeLabels.length) return { safe: MENU_DATA.dishes, adaptable: [] };

  const safe = [], adaptable = [];
  MENU_DATA.dishes.forEach(dish => {
    const allOk = regimeLabels.every(reg => dish.regimes.includes(reg));
    if(allOk){
      safe.push(dish);
      return;
    }
    // Vérifie si adaptable pour TOUS les régimes demandés
    const allAdaptable = regimeLabels.every(reg =>
      dish.regimes.includes(reg) ||
      dish.regimes_adapt.some(a => a.regime === reg)
    );
    if(allAdaptable){
      const toRemove = [];
      regimeLabels.forEach(reg => {
        if(!dish.regimes.includes(reg)){
          const adapt = dish.regimes_adapt.find(a => a.regime === reg);
          if(adapt) adapt.remove.forEach(r => { if(!toRemove.includes(r)) toRemove.push(r); });
        }
      });
      if(toRemove.length) adaptable.push({ dish, remove: toRemove });
      else safe.push(dish); // adaptable sans rien retirer = safe
    }
  });
  return { safe, adaptable };
}

// ─── Combinaison allergen + régime ────────────────────
// Intersection des deux contraintes : un plat doit satisfaire les deux
function getCompatibleDishes(allergenLabels, regimeLabels){
  const allergenRes = getMenuRecos(allergenLabels);
  const regimeRes   = getRegimeRecos(regimeLabels);

  if(!allergenLabels.length && !regimeLabels.length)
    return { safe: MENU_DATA.dishes, adaptable: [] };

  const allergenSafeIds  = new Set(allergenRes.safe.map(d => d.id));
  const allergenAdaptIds = new Map(allergenRes.adaptable.map(({dish,remove}) => [dish.id, remove]));
  const regimeSafeIds    = new Set(regimeRes.safe.map(d => d.id));
  const regimeAdaptIds   = new Map(regimeRes.adaptable.map(({dish,remove}) => [dish.id, remove]));

  const allDishIds = new Set([
    ...allergenSafeIds, ...allergenAdaptIds.keys(),
    ...regimeSafeIds,   ...regimeAdaptIds.keys()
  ]);

  const safe = [], adaptable = [];

  allDishIds.forEach(id => {
    const dish = MENU_DATA.dishes.find(d => d.id === id);
    if(!dish) return;

    const okForAllergen = allergenSafeIds.has(id) || allergenAdaptIds.has(id) || !allergenLabels.length;
    const okForRegime   = regimeSafeIds.has(id)   || regimeAdaptIds.has(id)   || !regimeLabels.length;
    if(!okForAllergen || !okForRegime) return;

    const isAllergenSafe  = allergenSafeIds.has(id)  || !allergenLabels.length;
    const isRegimeSafe    = regimeSafeIds.has(id)     || !regimeLabels.length;

    const toRemove = [
      ...(allergenAdaptIds.get(id) || []),
      ...(regimeAdaptIds.get(id)   || [])
    ].filter((v,i,a) => a.indexOf(v) === i);

    if(isAllergenSafe && isRegimeSafe){
      safe.push(dish);
    } else {
      adaptable.push({ dish, remove: toRemove });
    }
  });

  return { safe, adaptable };
}
