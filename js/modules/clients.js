// ══════════════════════════════════════════
// CLIENTS & FIDÉLITÉ — CRM La Playa
// ══════════════════════════════════════════

const CLIENT_NOTES_KEY    = 'playa-client-notes-v1';
const CRM_HISTORY_KEY     = 'playa-crm-history-v1';
const CRM_HISTORY_TS_KEY  = 'playa-crm-history-ts';

// Pre-built client database (enriched by live Zenchef sync)
const CRM_SEED_DATA = {
  "martin sophie":{name:"Martin Sophie",normKey:"martin sophie",phone:"0641382723",email:"",visits:[{date:"2026-05-25",pax:2,comment:"playa terrasse"},{date:"2025-05-23",pax:2,comment:"végétarienne"},{date:"2025-04-22",pax:1,comment:""},{date:"2024-08-28",pax:2,comment:"avec notre chien"},{date:"2024-07-08",pax:2,comment:"table habituelle côté mer"},{date:"2023-08-01",pax:3,comment:"en terrasse, habituellement table du fond"},{date:"2023-04-18",pax:2,comment:""},{date:"2022-09-15",pax:3,comment:"playa terrasse"},{date:"2022-04-01",pax:1,comment:"2 transats en bout de rang"},{date:"2021-09-24",pax:3,comment:"playa terrasse"},{date:"2021-04-12",pax:2,comment:"la même table qu'à notre habitude"}]},
  "dubois pierre":{name:"Dubois Pierre",normKey:"dubois pierre",phone:"",email:"",visits:[{date:"2026-04-08",pax:5,comment:""},{date:"2025-07-19",pax:6,comment:"végétarienne"},{date:"2025-06-21",pax:7,comment:"table 3 comme d'habitude"},{date:"2024-09-18",pax:7,comment:"4 transats côté mer"},{date:"2024-08-24",pax:5,comment:"playa terrasse"},{date:"2023-09-22",pax:7,comment:"outside please"},{date:"2023-09-15",pax:5,comment:"transats en 1ère ligne"},{date:"2022-09-11",pax:5,comment:""},{date:"2022-05-12",pax:6,comment:"3 transats"},{date:"2021-07-09",pax:5,comment:"4 transats côté mer"},{date:"2021-04-13",pax:6,comment:""}]},
  "bernard marie":{name:"Bernard Marie",normKey:"bernard marie",phone:"",email:"",visits:[{date:"2026-08-03",pax:2,comment:""},{date:"2026-07-06",pax:3,comment:"terrasse ombre si possible"},{date:"2025-06-27",pax:3,comment:"transats en 1ère ligne"},{date:"2025-06-25",pax:4,comment:"allergie crustacés"},{date:"2024-04-22",pax:4,comment:"en terrasse, habituellement table du fond"},{date:"2024-04-20",pax:3,comment:"chaise haute pour bébé"},{date:"2023-08-15",pax:4,comment:"2 transats en bout de rang"},{date:"2023-05-12",pax:2,comment:""},{date:"2023-05-09",pax:4,comment:""},{date:"2022-09-14",pax:4,comment:"playa terrasse"},{date:"2022-09-10",pax:4,comment:"coin calme"},{date:"2022-05-22",pax:3,comment:""},{date:"2021-08-25",pax:2,comment:"chaise haute pour bébé"},{date:"2021-04-28",pax:2,comment:"outside please"},{date:"2021-04-25",pax:4,comment:""}]},
  "laurent jean":{name:"Laurent Jean",normKey:"laurent jean",phone:"0698354961",email:"",visits:[{date:"2026-08-15",pax:1,comment:"lune de miel"},{date:"2026-06-22",pax:2,comment:"bed double"},{date:"2025-09-11",pax:1,comment:"transats en 1ère ligne"},{date:"2025-04-28",pax:2,comment:"terrasse vue mer"},{date:"2024-09-21",pax:3,comment:"playa terrasse"},{date:"2024-04-23",pax:3,comment:"terrasse côté mer"},{date:"2023-08-18",pax:1,comment:"table habituelle côté mer"},{date:"2023-06-14",pax:2,comment:"la même table qu'à notre habitude"},{date:"2022-07-07",pax:1,comment:"playa terrasse"},{date:"2022-04-21",pax:3,comment:""},{date:"2022-04-08",pax:1,comment:"terrasse svp"},{date:"2021-09-21",pax:2,comment:"surprise anniversaire"},{date:"2021-09-19",pax:3,comment:""},{date:"2021-07-08",pax:1,comment:"anniversaire de mariage"}]},
  "roux catherine":{name:"Roux Catherine",normKey:"roux catherine",phone:"0631627271",email:"",visits:[{date:"2026-04-24",pax:6,comment:"table terrasse"},{date:"2025-09-19",pax:7,comment:"table 5 svp"},{date:"2025-05-02",pax:7,comment:""},{date:"2024-09-23",pax:6,comment:"terrasse ombre si possible"},{date:"2024-08-20",pax:5,comment:""},{date:"2023-09-28",pax:5,comment:"fiançailles !!"},{date:"2023-06-26",pax:6,comment:"2 transats en bout de rang"},{date:"2022-05-13",pax:5,comment:""},{date:"2022-04-28",pax:5,comment:"terrasse côté mer"},{date:"2021-08-28",pax:7,comment:"en terrasse, habituellement table du fond"},{date:"2021-05-28",pax:6,comment:""}]},
  "garnier michel":{name:"Garnier Michel",normKey:"garnier michel",phone:"0640436026",email:"",visits:[{date:"2026-08-26",pax:5,comment:"table 7"},{date:"2026-04-01",pax:4,comment:""},{date:"2025-06-10",pax:3,comment:"lune de miel"},{date:"2025-04-03",pax:5,comment:"lune de miel"},{date:"2024-08-16",pax:4,comment:""},{date:"2024-05-12",pax:3,comment:""},{date:"2023-05-23",pax:4,comment:"3 transats"},{date:"2023-04-03",pax:5,comment:"3 transats"},{date:"2022-09-18",pax:3,comment:"4 transats côté mer"},{date:"2022-04-15",pax:5,comment:""},{date:"2021-09-21",pax:4,comment:"avec notre chien"},{date:"2021-09-04",pax:3,comment:"4 transats 1ère ligne"}]},
  "simon nathalie":{name:"Simon Nathalie",normKey:"simon nathalie",phone:"0680648111",email:"",visits:[{date:"2026-07-20",pax:3,comment:"terrasse vue mer"},{date:"2026-05-07",pax:2,comment:"végétarien + sans gluten"},{date:"2025-06-25",pax:3,comment:""},{date:"2025-04-13",pax:1,comment:""},{date:"2024-05-09",pax:1,comment:""},{date:"2024-04-12",pax:1,comment:"chaise haute pour bébé"},{date:"2023-07-26",pax:3,comment:""},{date:"2023-07-05",pax:1,comment:"végétarien + sans gluten"},{date:"2022-08-02",pax:2,comment:"PMR fauteuil"},{date:"2022-04-06",pax:3,comment:""},{date:"2021-05-26",pax:1,comment:""},{date:"2021-05-08",pax:1,comment:""},{date:"2021-04-03",pax:3,comment:""}]},
  "moreau patrick":{name:"Moreau Patrick",normKey:"moreau patrick",phone:"0645549275",email:"",visits:[{date:"2026-07-18",pax:1,comment:"végétarienne"},{date:"2026-06-14",pax:1,comment:""},{date:"2025-09-24",pax:1,comment:"table 7"},{date:"2025-06-02",pax:3,comment:"fiançailles !!"},{date:"2024-07-20",pax:3,comment:"terrasse vue mer"},{date:"2024-05-14",pax:3,comment:""},{date:"2023-06-13",pax:3,comment:"bed double"},{date:"2023-04-04",pax:3,comment:"repas d'équipe"},{date:"2022-09-10",pax:3,comment:"sans lactose"},{date:"2022-04-09",pax:1,comment:"table 5 svp"},{date:"2021-07-26",pax:3,comment:"table 3 comme d'habitude"},{date:"2021-07-22",pax:3,comment:"sans gluten"},{date:"2021-06-20",pax:2,comment:"chaise haute pour bébé"}]},
  "leroy julie":{name:"Leroy Julie",normKey:"leroy julie",phone:"0637757031",email:"",visits:[{date:"2026-09-23",pax:3,comment:"table calme loin de la piscine"},{date:"2025-08-28",pax:2,comment:"coin calme"},{date:"2024-09-17",pax:3,comment:"terrasse vue mer"},{date:"2024-05-05",pax:2,comment:"table terrasse"},{date:"2023-07-08",pax:2,comment:""},{date:"2023-04-27",pax:2,comment:"table calme loin de la piscine"},{date:"2022-09-03",pax:3,comment:"table 3 comme d'habitude"},{date:"2022-05-21",pax:4,comment:"terrasse côté mer"}]},
  "robert thomas":{name:"Robert Thomas",normKey:"robert thomas",phone:"",email:"",visits:[{date:"2026-09-09",pax:4,comment:"table calme loin de la piscine"},{date:"2025-09-28",pax:3,comment:"table calme loin de la piscine"},{date:"2024-07-27",pax:4,comment:"notre anniversaire de rencontre"},{date:"2023-08-11",pax:3,comment:""},{date:"2023-05-09",pax:3,comment:"vegan"},{date:"2022-07-22",pax:4,comment:""},{date:"2022-06-15",pax:2,comment:""}]},
  "petit isabelle":{name:"Petit Isabelle",normKey:"petit isabelle",phone:"",email:"",visits:[{date:"2026-04-28",pax:3,comment:"anniversaire"},{date:"2025-07-25",pax:3,comment:""},{date:"2024-07-02",pax:1,comment:""},{date:"2023-07-18",pax:3,comment:""},{date:"2023-04-14",pax:2,comment:"sans lactose"},{date:"2022-07-23",pax:1,comment:""},{date:"2022-06-10",pax:2,comment:""}]},
  "mercier françois":{name:"Mercier François",normKey:"mercier françois",phone:"0644657213",email:"",visits:[{date:"2026-05-28",pax:2,comment:"terrasse ombre si possible"},{date:"2025-08-19",pax:3,comment:"playa terrasse"},{date:"2025-05-21",pax:1,comment:""},{date:"2024-08-18",pax:1,comment:""},{date:"2024-07-01",pax:3,comment:""},{date:"2023-09-06",pax:2,comment:""},{date:"2023-06-25",pax:2,comment:"4 transats 1ère ligne"},{date:"2022-07-11",pax:3,comment:""},{date:"2022-05-15",pax:2,comment:"sans lactose"}]},
  "dupont valérie":{name:"Dupont Valérie",normKey:"dupont valérie",phone:"0641351289",email:"",visits:[{date:"2026-04-19",pax:1,comment:""},{date:"2025-09-20",pax:1,comment:""},{date:"2025-09-04",pax:1,comment:""},{date:"2024-05-20",pax:3,comment:""},{date:"2024-05-04",pax:3,comment:""},{date:"2023-08-07",pax:2,comment:""},{date:"2023-04-19",pax:3,comment:""},{date:"2022-08-22",pax:2,comment:"fiançailles !!"},{date:"2022-05-08",pax:1,comment:"chaise haute pour bébé"}]},
  "blanc sébastien":{name:"Blanc Sébastien",normKey:"blanc sébastien",phone:"",email:"",visits:[{date:"2026-07-06",pax:7,comment:"table 5 svp"},{date:"2025-09-27",pax:6,comment:""},{date:"2025-05-25",pax:6,comment:""},{date:"2024-07-04",pax:6,comment:""},{date:"2024-05-27",pax:5,comment:"repas transat"},{date:"2023-09-11",pax:5,comment:""},{date:"2023-07-14",pax:7,comment:"table 3 comme d'habitude"},{date:"2022-08-26",pax:7,comment:""},{date:"2022-08-14",pax:7,comment:"vegan"}]},
  "faure christine":{name:"Faure Christine",normKey:"faure christine",phone:"0651337237",email:"",visits:[{date:"2026-07-26",pax:1,comment:"terrasse vue mer"},{date:"2025-09-16",pax:3,comment:""},{date:"2024-09-18",pax:2,comment:"sans lactose"},{date:"2024-04-08",pax:3,comment:"fiançailles !!"},{date:"2023-09-09",pax:3,comment:"terrasse vue mer"},{date:"2023-06-16",pax:3,comment:""},{date:"2022-07-23",pax:1,comment:"vegan"},{date:"2022-06-26",pax:2,comment:"vegan"}]},
  "vincent olivier":{name:"Vincent Olivier",normKey:"vincent olivier",phone:"",email:"",visits:[{date:"2026-05-10",pax:1,comment:"allergie crustacés"},{date:"2025-08-20",pax:2,comment:""},{date:"2024-09-28",pax:2,comment:"terrasse svp"},{date:"2024-09-16",pax:2,comment:""},{date:"2023-08-25",pax:3,comment:"terrasse vue mer"},{date:"2023-04-18",pax:2,comment:"PMR fauteuil"},{date:"2022-04-24",pax:1,comment:"allergie noix"},{date:"2022-04-23",pax:3,comment:"terrasse svp"}]},
  "rousseau mathilde":{name:"Rousseau Mathilde",normKey:"rousseau mathilde",phone:"0666533316",email:"",visits:[{date:"2026-08-20",pax:3,comment:"2 transats en bout de rang"},{date:"2025-05-08",pax:1,comment:"vue mer impérative"},{date:"2025-04-08",pax:1,comment:""},{date:"2024-05-21",pax:1,comment:"4 transats 1ère ligne"},{date:"2024-05-05",pax:3,comment:""},{date:"2023-07-16",pax:1,comment:"la même table qu'à notre habitude"},{date:"2023-07-10",pax:3,comment:"chaise haute pour bébé"},{date:"2022-07-15",pax:2,comment:"4 transats côté mer"},{date:"2022-06-28",pax:2,comment:"terrasse côté mer"}]},
  "fontaine emmanuel":{name:"Fontaine Emmanuel",normKey:"fontaine emmanuel",phone:"0686704714",email:"",visits:[{date:"2026-06-27",pax:2,comment:"outside please"},{date:"2025-05-14",pax:2,comment:"PMR fauteuil"},{date:"2024-09-19",pax:4,comment:""},{date:"2023-06-15",pax:2,comment:"table 7"},{date:"2023-04-22",pax:2,comment:""},{date:"2022-06-20",pax:4,comment:""},{date:"2022-05-10",pax:4,comment:"repas transat"}]},
  "denis laura":{name:"Denis Laura",normKey:"denis laura",phone:"0674797366",email:"",visits:[{date:"2026-07-17",pax:4,comment:"lune de miel"},{date:"2025-09-27",pax:3,comment:"vue mer impérative"},{date:"2025-07-10",pax:4,comment:""},{date:"2024-09-04",pax:2,comment:"allergie noix"},{date:"2024-05-22",pax:4,comment:"table habituelle côté mer"},{date:"2023-09-11",pax:4,comment:"4 transats 1ère ligne"},{date:"2023-04-16",pax:3,comment:"repas d'équipe"},{date:"2022-05-19",pax:3,comment:""},{date:"2022-04-20",pax:2,comment:""}]},
  "chevalier julien":{name:"Chevalier Julien",normKey:"chevalier julien",phone:"0650425124",email:"",visits:[{date:"2026-05-10",pax:2,comment:""},{date:"2025-09-15",pax:1,comment:"2 transats en bout de rang"},{date:"2025-05-27",pax:1,comment:"chaise haute pour bébé"},{date:"2024-06-18",pax:1,comment:"avec notre chien"},{date:"2024-05-17",pax:2,comment:""},{date:"2023-08-26",pax:1,comment:""},{date:"2023-04-22",pax:3,comment:"la même table qu'à notre habitude"},{date:"2022-07-28",pax:3,comment:""},{date:"2022-07-04",pax:1,comment:""}]},
  "bonnet stéphanie":{name:"Bonnet Stéphanie",normKey:"bonnet stéphanie",phone:"",email:"",visits:[{date:"2026-04-09",pax:6,comment:"végétarien + sans gluten"},{date:"2025-08-17",pax:7,comment:""},{date:"2025-08-13",pax:6,comment:""},{date:"2024-07-18",pax:6,comment:"vegan"},{date:"2024-05-15",pax:7,comment:"terrasse vue mer"},{date:"2023-08-19",pax:7,comment:"PMR fauteuil"},{date:"2023-07-27",pax:6,comment:""},{date:"2022-09-10",pax:7,comment:""},{date:"2022-08-09",pax:5,comment:"3 transats"}]},
  "legrand guillaume":{name:"Legrand Guillaume",normKey:"legrand guillaume",phone:"",email:"",visits:[{date:"2026-04-24",pax:3,comment:"notre anniversaire de rencontre"},{date:"2025-04-28",pax:4,comment:"table terrasse"},{date:"2024-07-02",pax:3,comment:"table 3 comme d'habitude"},{date:"2023-09-26",pax:4,comment:"notre anniversaire de rencontre"},{date:"2023-07-21",pax:3,comment:""},{date:"2022-07-08",pax:4,comment:"table terrasse"},{date:"2022-04-16",pax:4,comment:"allergie noix"}]},
  "morel camille":{name:"Morel Camille",normKey:"morel camille",phone:"0650907279",email:"",visits:[{date:"2026-06-12",pax:6,comment:"fiançailles !!"},{date:"2025-05-15",pax:7,comment:"3 transats"},{date:"2025-04-02",pax:6,comment:""},{date:"2024-09-23",pax:5,comment:"lune de miel"},{date:"2024-08-22",pax:5,comment:"PMR fauteuil"},{date:"2023-05-24",pax:5,comment:"anniversaire de mariage"},{date:"2023-05-06",pax:5,comment:""},{date:"2022-08-14",pax:7,comment:"vue mer impérative"},{date:"2022-04-20",pax:5,comment:"3 transats"}]},
  "girard marc":{name:"Girard Marc",normKey:"girard marc",phone:"0669469679",email:"",visits:[{date:"2026-08-12",pax:3,comment:"3 transats"},{date:"2025-05-20",pax:2,comment:"transats en 1ère ligne"},{date:"2025-05-13",pax:2,comment:"playa terrasse"},{date:"2024-09-09",pax:2,comment:""},{date:"2024-04-20",pax:3,comment:"table 7"},{date:"2023-08-28",pax:3,comment:""},{date:"2023-08-10",pax:3,comment:""},{date:"2022-05-03",pax:2,comment:""},{date:"2022-04-27",pax:3,comment:"anniversaire"}]},
  "mallet céline":{name:"Mallet Céline",normKey:"mallet céline",phone:"0694972790",email:"",visits:[{date:"2026-06-17",pax:3,comment:""},{date:"2025-05-28",pax:3,comment:""},{date:"2025-05-07",pax:1,comment:""},{date:"2024-07-03",pax:1,comment:""},{date:"2024-04-10",pax:2,comment:""},{date:"2023-06-24",pax:2,comment:""},{date:"2023-04-19",pax:2,comment:""},{date:"2022-05-09",pax:2,comment:""},{date:"2022-04-21",pax:3,comment:"table terrasse"}]},
  "thomas alice":{name:"Thomas Alice",normKey:"thomas alice",phone:"0656216011",email:"",visits:[{date:"2026-08-08",pax:7,comment:"table terrasse"},{date:"2025-04-22",pax:5,comment:"table 3 comme d'habitude"},{date:"2024-08-13",pax:7,comment:""},{date:"2023-09-10",pax:7,comment:"notre anniversaire de rencontre"},{date:"2023-06-18",pax:5,comment:"table 5 svp"}]},
  "bertrand nicolas":{name:"Bertrand Nicolas",normKey:"bertrand nicolas",phone:"0673242240",email:"",visits:[{date:"2026-04-23",pax:2,comment:"repas transat"},{date:"2025-09-04",pax:2,comment:"table 5 svp"},{date:"2024-08-24",pax:3,comment:"playa terrasse"},{date:"2023-08-05",pax:2,comment:""}]},
  "richard emma":{name:"Richard Emma",normKey:"richard emma",phone:"0697577992",email:"",visits:[{date:"2026-08-07",pax:5,comment:""},{date:"2025-04-02",pax:6,comment:"bed double"},{date:"2024-07-03",pax:7,comment:"4 transats côté mer"},{date:"2023-06-02",pax:6,comment:"4 transats 1ère ligne"}]},
  "gauthier aurélie":{name:"Gauthier Aurélie",normKey:"gauthier aurélie",phone:"0639522886",email:"",visits:[{date:"2026-05-19",pax:2,comment:"terrasse ombre si possible"},{date:"2025-05-01",pax:2,comment:""},{date:"2024-09-03",pax:2,comment:"repas d'équipe"},{date:"2024-08-09",pax:1,comment:"terrasse svp"},{date:"2023-04-09",pax:1,comment:""},{date:"2023-04-05",pax:3,comment:"anniversaire de mariage"}]},
  "lefebvre christophe":{name:"Lefebvre Christophe",normKey:"lefebvre christophe",phone:"",email:"",visits:[{date:"2026-07-23",pax:4,comment:"terrasse côté mer"},{date:"2025-04-16",pax:4,comment:"anniversaire de mariage"},{date:"2024-08-21",pax:5,comment:"table 3 comme d'habitude"},{date:"2024-06-15",pax:5,comment:""},{date:"2023-08-08",pax:5,comment:"en terrasse, habituellement table du fond"},{date:"2023-06-20",pax:3,comment:"terrasse ombre si possible"}]},
  "clement pauline":{name:"Clement Pauline",normKey:"clement pauline",phone:"0668748765",email:"",visits:[{date:"2026-06-14",pax:4,comment:""},{date:"2025-07-11",pax:4,comment:"anniversaire de mariage"},{date:"2024-09-28",pax:3,comment:"fiançailles !!"},{date:"2023-05-22",pax:4,comment:"terrasse côté mer"},{date:"2023-04-26",pax:5,comment:"en terrasse, habituellement table du fond"}]},
  "renard david":{name:"Renard David",normKey:"renard david",phone:"",email:"",visits:[{date:"2026-08-10",pax:3,comment:"en terrasse, habituellement table du fond"},{date:"2025-07-28",pax:4,comment:"terrasse ombre si possible"},{date:"2024-09-04",pax:3,comment:"allergie noix"},{date:"2023-09-12",pax:2,comment:"table 3 comme d'habitude"}]},
  "perrin manon":{name:"Perrin Manon",normKey:"perrin manon",phone:"0638235481",email:"",visits:[{date:"2026-06-23",pax:2,comment:""},{date:"2025-08-22",pax:3,comment:"bed double"},{date:"2024-08-25",pax:3,comment:"table habituelle côté mer"},{date:"2023-06-04",pax:2,comment:""}]},
  "lambert victor":{name:"Lambert Victor",normKey:"lambert victor",phone:"",email:"",visits:[{date:"2026-06-10",pax:3,comment:"vegan"},{date:"2025-05-13",pax:2,comment:"vue mer impérative"},{date:"2024-09-21",pax:1,comment:"en terrasse, habituellement table du fond"},{date:"2023-08-03",pax:1,comment:"terrasse svp"},{date:"2023-05-19",pax:3,comment:"notre anniversaire de rencontre"}]},
  "boyer elisa":{name:"Boyer Elisa",normKey:"boyer elisa",phone:"",email:"",visits:[{date:"2026-08-22",pax:2,comment:"playa terrasse"},{date:"2025-04-10",pax:3,comment:""},{date:"2024-06-07",pax:3,comment:"playa terrasse"},{date:"2024-05-25",pax:2,comment:"4 transats 1ère ligne"},{date:"2023-09-14",pax:2,comment:""},{date:"2023-08-02",pax:1,comment:"transats en 1ère ligne"}]},
  "masson hugo":{name:"Masson Hugo",normKey:"masson hugo",phone:"0632265878",email:"",visits:[{date:"2026-09-21",pax:3,comment:"bed double + 2 transats"},{date:"2025-07-03",pax:3,comment:""},{date:"2024-04-13",pax:4,comment:"terrasse svp"},{date:"2023-09-08",pax:4,comment:""}]},
  "sanchez lucie":{name:"Sanchez Lucie",normKey:"sanchez lucie",phone:"",email:"",visits:[{date:"2026-09-11",pax:1,comment:"végétarienne"},{date:"2025-07-17",pax:1,comment:"lune de miel"},{date:"2024-04-14",pax:1,comment:"4 transats côté mer"},{date:"2023-08-15",pax:3,comment:""}]},
  "lacombe clément":{name:"Lacombe Clément",normKey:"lacombe clément",phone:"0677753454",email:"",visits:[{date:"2026-07-25",pax:5,comment:""},{date:"2025-08-05",pax:5,comment:"table terrasse"},{date:"2024-05-04",pax:3,comment:"bed double"},{date:"2023-06-24",pax:5,comment:""}]},
  "picard sarah":{name:"Picard Sarah",normKey:"picard sarah",phone:"0682929189",email:"",visits:[{date:"2026-07-15",pax:3,comment:"terrasse ombre si possible"},{date:"2025-08-02",pax:4,comment:"table 7"},{date:"2024-04-16",pax:4,comment:"table 5 svp"},{date:"2023-06-28",pax:5,comment:"sans lactose"},{date:"2023-04-21",pax:3,comment:""}]},
  "ferrand romain":{name:"Ferrand Romain",normKey:"ferrand romain",phone:"0615678393",email:"",visits:[{date:"2026-04-08",pax:4,comment:"surprise anniversaire"},{date:"2025-06-23",pax:2,comment:"vue mer impérative"},{date:"2024-04-15",pax:2,comment:""},{date:"2023-08-17",pax:4,comment:"extérieur"},{date:"2023-05-11",pax:4,comment:"PMR fauteuil"}]},
  "joubert charlotte":{name:"Joubert Charlotte",normKey:"joubert charlotte",phone:"0653968616",email:"",visits:[{date:"2026-06-10",pax:4,comment:""},{date:"2025-05-11",pax:2,comment:"PMR fauteuil"},{date:"2024-08-22",pax:3,comment:"4 transats côté mer"},{date:"2023-09-21",pax:3,comment:"terrasse côté mer"},{date:"2023-05-20",pax:4,comment:""}]},
  "schmitt lucas":{name:"Schmitt Lucas",normKey:"schmitt lucas",phone:"0652269599",email:"",visits:[{date:"2026-05-03",pax:4,comment:""},{date:"2025-05-11",pax:4,comment:"outside please"},{date:"2024-08-12",pax:3,comment:"végétarienne"},{date:"2023-09-22",pax:5,comment:"playa terrasse"},{date:"2023-04-17",pax:5,comment:""}]},
  "collet inès":{name:"Collet Inès",normKey:"collet inès",phone:"0689268658",email:"",visits:[{date:"2026-07-20",pax:2,comment:""},{date:"2025-04-14",pax:2,comment:"table calme loin de la piscine"},{date:"2024-08-26",pax:1,comment:""},{date:"2024-05-12",pax:3,comment:""},{date:"2023-07-08",pax:3,comment:"repas transat"},{date:"2023-05-06",pax:1,comment:""}]},
  "marin adrien":{name:"Marin Adrien",normKey:"marin adrien",phone:"0658747763",email:"",visits:[{date:"2026-08-28",pax:2,comment:"bed double"},{date:"2025-06-18",pax:2,comment:""},{date:"2024-05-28",pax:3,comment:"table terrasse"},{date:"2023-06-15",pax:4,comment:"playa terrasse"},{date:"2023-05-27",pax:2,comment:""}]},
  "renaud zoé":{name:"Renaud Zoé",normKey:"renaud zoé",phone:"0654136316",email:"",visits:[{date:"2026-05-02",pax:2,comment:""},{date:"2025-09-21",pax:2,comment:""},{date:"2024-06-08",pax:1,comment:"sans gluten"},{date:"2023-07-17",pax:2,comment:"4 transats 1ère ligne"}]},
  "carre baptiste":{name:"Carre Baptiste",normKey:"carre baptiste",phone:"0670678810",email:"",visits:[{date:"2026-07-21",pax:5,comment:"chaise haute pour bébé"},{date:"2025-06-08",pax:4,comment:"terrasse vue mer"},{date:"2024-08-24",pax:5,comment:"chaise haute pour bébé"},{date:"2023-07-20",pax:5,comment:"en terrasse, habituellement table du fond"},{date:"2023-04-01",pax:4,comment:"bed double"}]},
  "fournier léa":{name:"Fournier Léa",normKey:"fournier léa",phone:"0647641088",email:"",visits:[{date:"2026-07-02",pax:3,comment:"repas d'équipe"},{date:"2025-08-17",pax:3,comment:""},{date:"2024-08-12",pax:1,comment:""},{date:"2024-06-08",pax:3,comment:"chaise haute pour bébé"},{date:"2023-06-24",pax:1,comment:"sans gluten"},{date:"2023-06-08",pax:3,comment:"anniversaire de mariage"}]},
  "gerard théo":{name:"Gerard Théo",normKey:"gerard théo",phone:"0627155579",email:"",visits:[{date:"2026-04-26",pax:3,comment:""},{date:"2025-04-23",pax:4,comment:"terrasse vue mer"},{date:"2024-09-16",pax:5,comment:"outside please"},{date:"2024-06-02",pax:5,comment:"extérieur"},{date:"2023-06-27",pax:5,comment:"table terrasse"},{date:"2023-06-10",pax:5,comment:"surprise anniversaire"}]},
  "tessier marion":{name:"Tessier Marion",normKey:"tessier marion",phone:"0644255765",email:"",visits:[{date:"2026-09-14",pax:5,comment:"notre anniversaire de rencontre"},{date:"2025-06-26",pax:7,comment:"4 transats 1ère ligne"},{date:"2024-07-11",pax:5,comment:""},{date:"2023-07-24",pax:6,comment:""}]},
  "noel quentin":{name:"Noel Quentin",normKey:"noel quentin",phone:"0620519447",email:"",visits:[{date:"2026-06-21",pax:1,comment:"playa terrasse"},{date:"2025-09-28",pax:2,comment:""},{date:"2024-05-28",pax:3,comment:""},{date:"2024-05-23",pax:2,comment:"sans gluten"},{date:"2023-06-17",pax:3,comment:"table habituelle côté mer"},{date:"2023-06-15",pax:3,comment:""}]},
  "durand amélie":{name:"Durand Amélie",normKey:"durand amélie",phone:"",email:"",visits:[{date:"2025-08-05",pax:3,comment:"repas d'équipe"},{date:"2024-09-12",pax:2,comment:"anniversaire"}]},
  "roussel stéphane":{name:"Roussel Stéphane",normKey:"roussel stéphane",phone:"0683277756",email:"",visits:[{date:"2026-08-04",pax:3,comment:""},{date:"2025-04-24",pax:2,comment:""},{date:"2024-07-11",pax:4,comment:"4 transats 1ère ligne"}]},
  "levy chloé":{name:"Levy Chloé",normKey:"levy chloé",phone:"0646987235",email:"",visits:[{date:"2026-06-22",pax:2,comment:""},{date:"2025-04-26",pax:3,comment:""},{date:"2024-04-05",pax:1,comment:""}]},
  "lacroix frédéric":{name:"Lacroix Frédéric",normKey:"lacroix frédéric",phone:"0699913256",email:"",visits:[{date:"2026-08-12",pax:2,comment:""},{date:"2025-05-08",pax:2,comment:"en terrasse, habituellement table du fond"},{date:"2024-08-08",pax:1,comment:""}]},
  "brunel agathe":{name:"Brunel Agathe",normKey:"brunel agathe",phone:"0618496071",email:"",visits:[{date:"2025-04-05",pax:4,comment:""},{date:"2024-08-14",pax:4,comment:""}]},
  "gautier maxime":{name:"Gautier Maxime",normKey:"gautier maxime",phone:"0626809185",email:"",visits:[{date:"2026-06-23",pax:3,comment:"vegan"},{date:"2025-04-17",pax:3,comment:"végétarienne"},{date:"2024-05-25",pax:3,comment:"anniversaire"}]},
  "poulain florence":{name:"Poulain Florence",normKey:"poulain florence",phone:"",email:"",visits:[{date:"2026-08-19",pax:5,comment:"extérieur"},{date:"2025-08-18",pax:5,comment:"vue mer impérative"},{date:"2024-05-21",pax:7,comment:"3 transats"}]},
  "delorme alexandre":{name:"Delorme Alexandre",normKey:"delorme alexandre",phone:"0620159283",email:"",visits:[{date:"2025-07-20",pax:7,comment:"en terrasse, habituellement table du fond"},{date:"2024-06-21",pax:5,comment:""}]},
  "vidal nina":{name:"Vidal Nina",normKey:"vidal nina",phone:"0671419761",email:"",visits:[{date:"2026-08-05",pax:4,comment:""},{date:"2025-07-14",pax:4,comment:"table 3 comme d'habitude"},{date:"2024-06-15",pax:3,comment:"vue mer impérative"}]},
  "cros arthur":{name:"Cros Arthur",normKey:"cros arthur",phone:"0654612657",email:"",visits:[{date:"2026-04-10",pax:4,comment:""},{date:"2025-04-09",pax:4,comment:"4 transats 1ère ligne"},{date:"2024-08-18",pax:3,comment:"sans lactose"}]},
  "pages caroline":{name:"Pages Caroline",normKey:"pages caroline",phone:"0630518350",email:"",visits:[{date:"2026-07-17",pax:2,comment:""},{date:"2025-07-16",pax:2,comment:"avec notre chien"},{date:"2024-05-25",pax:1,comment:""}]},
  "arnaud paul":{name:"Arnaud Paul",normKey:"arnaud paul",phone:"0616467386",email:"",visits:[{date:"2025-04-14",pax:3,comment:""},{date:"2024-09-22",pax:4,comment:"2 transats"}]},
  "delaunay virginie":{name:"Delaunay Virginie",normKey:"delaunay virginie",phone:"0615611682",email:"",visits:[{date:"2026-06-27",pax:7,comment:"chaise haute pour bébé"},{date:"2025-07-17",pax:6,comment:""},{date:"2024-08-07",pax:6,comment:"avec notre chien"}]},
  "ferreira louis":{name:"Ferreira Louis",normKey:"ferreira louis",phone:"0653815628",email:"",visits:[{date:"2025-04-02",pax:1,comment:""},{date:"2024-05-20",pax:3,comment:"anniversaire"}]},
  "perrot jade":{name:"Perrot Jade",normKey:"perrot jade",phone:"0687752751",email:"",visits:[{date:"2026-08-16",pax:5,comment:""},{date:"2025-08-11",pax:5,comment:""},{date:"2024-08-11",pax:3,comment:"lune de miel"}]},
  "muller philippe":{name:"Muller Philippe",normKey:"muller philippe",phone:"0624638449",email:"",visits:[{date:"2025-06-21",pax:3,comment:"la même table qu'à notre habitude"},{date:"2024-09-28",pax:3,comment:""}]},
  "nguyen eva":{name:"Nguyen Eva",normKey:"nguyen eva",phone:"0689582897",email:"",visits:[{date:"2026-05-14",pax:3,comment:"2 transats en bout de rang"},{date:"2025-04-07",pax:1,comment:"petit anniversaire en famille"},{date:"2024-05-02",pax:3,comment:""}]},
  "henry antoine":{name:"Henry Antoine",normKey:"henry antoine",phone:"0617277636",email:"",visits:[{date:"2026-06-18",pax:6,comment:"table 5 svp"},{date:"2025-06-06",pax:6,comment:""},{date:"2024-08-11",pax:7,comment:""}]},
  "brun patricia":{name:"Brun Patricia",normKey:"brun patricia",phone:"0645814838",email:"",visits:[{date:"2026-08-26",pax:3,comment:"4 transats 1ère ligne"},{date:"2025-09-23",pax:2,comment:"allergie crustacés"},{date:"2024-06-25",pax:2,comment:""}]},
  "ricard mathieu":{name:"Ricard Mathieu",normKey:"ricard mathieu",phone:"0628471546",email:"",visits:[{date:"2026-08-09",pax:4,comment:"PMR fauteuil"},{date:"2025-09-09",pax:4,comment:"coin calme"},{date:"2024-09-03",pax:3,comment:""}]},
  "jacquet sandrine":{name:"Jacquet Sandrine",normKey:"jacquet sandrine",phone:"0640411695",email:"",visits:[{date:"2025-07-11",pax:5,comment:"PMR fauteuil"},{date:"2024-08-08",pax:5,comment:"4 transats 1ère ligne"}]},
  "moutardier marie":{name:"Moutardier Marie",normKey:"moutardier marie",phone:"0630629370",email:"",visits:[{date:"2025-06-11",pax:4,comment:"avec notre chien"},{date:"2024-07-21",pax:3,comment:""}]},
  "rémy géraldine":{name:"Rémy Géraldine",normKey:"rémy géraldine",phone:"0614326332",email:"",visits:[{date:"2025-05-24",pax:4,comment:""},{date:"2024-04-27",pax:4,comment:""}]},
  "driscoll kelly":{name:"Driscoll Kelly",normKey:"driscoll kelly",phone:"0623524668",email:"",visits:[{date:"2025-08-15",pax:2,comment:"terrasse côté mer"},{date:"2024-09-18",pax:3,comment:"PMR fauteuil"}]},
  "weber christa":{name:"Weber Christa",normKey:"weber christa",phone:"0692423311",email:"",visits:[{date:"2026-07-17",pax:2,comment:"terrasse côté mer"},{date:"2025-05-20",pax:3,comment:""},{date:"2024-09-11",pax:2,comment:"coin calme"}]},
  "martin julie":{name:"Martin Julie",normKey:"martin julie",phone:"0641104359",email:"",visits:[{date:"2025-06-19",pax:3,comment:"table 5 svp"},{date:"2024-05-15",pax:2,comment:""}]},
  "lefevre emma":{name:"Lefevre Emma",normKey:"lefevre emma",phone:"0640179525",email:"",visits:[{date:"2025-07-10",pax:3,comment:"lune de miel"}]},
  "aubert nathan":{name:"Aubert Nathan",normKey:"aubert nathan",phone:"",email:"",visits:[{date:"2025-06-12",pax:5,comment:"bed double"}]},
  "robin chloé":{name:"Robin Chloé",normKey:"robin chloé",phone:"",email:"",visits:[{date:"2025-09-20",pax:3,comment:"surprise anniversaire"}]},
  "masse pierre":{name:"Masse Pierre",normKey:"masse pierre",phone:"0695374197",email:"",visits:[{date:"2025-08-28",pax:5,comment:""}]},
  "lacourt océane":{name:"Lacourt Océane",normKey:"lacourt océane",phone:"0682241780",email:"",visits:[{date:"2025-08-07",pax:5,comment:"vue mer impérative"}]},
  "pasteur axel":{name:"Pasteur Axel",normKey:"pasteur axel",phone:"0666249736",email:"",visits:[{date:"2025-09-19",pax:2,comment:"en terrasse, habituellement table du fond"}]},
  "collet ambre":{name:"Collet Ambre",normKey:"collet ambre",phone:"0668267563",email:"",visits:[{date:"2025-07-19",pax:2,comment:"table 7"}]},
  "brunel enzo":{name:"Brunel Enzo",normKey:"brunel enzo",phone:"",email:"",visits:[{date:"2025-06-27",pax:3,comment:""}]},
  "schmitt lola":{name:"Schmitt Lola",normKey:"schmitt lola",phone:"",email:"",visits:[{date:"2025-07-12",pax:5,comment:"terrasse svp"}]},
  "fontaine noah":{name:"Fontaine Noah",normKey:"fontaine noah",phone:"0670144662",email:"",visits:[{date:"2025-05-25",pax:1,comment:""}]},
  "garnier lilou":{name:"Garnier Lilou",normKey:"garnier lilou",phone:"0663575867",email:"",visits:[{date:"2025-07-13",pax:3,comment:"PMR fauteuil"}]},
  "faure ethan":{name:"Faure Ethan",normKey:"faure ethan",phone:"0625327860",email:"",visits:[{date:"2025-08-05",pax:5,comment:""}]},
  "chevalier luna":{name:"Chevalier Luna",normKey:"chevalier luna",phone:"",email:"",visits:[{date:"2025-04-10",pax:6,comment:""}]},
  "lacombe tom":{name:"Lacombe Tom",normKey:"lacombe tom",phone:"0639416854",email:"",visits:[{date:"2025-05-09",pax:3,comment:""}]},
  "picard mia":{name:"Picard Mia",normKey:"picard mia",phone:"0614946388",email:"",visits:[{date:"2025-04-08",pax:3,comment:"terrasse svp"}]},
  "perrot hugo":{name:"Perrot Hugo",normKey:"perrot hugo",phone:"0616411561",email:"",visits:[{date:"2025-07-08",pax:4,comment:"2 transats"}]},
  "tessier lena":{name:"Tessier Lena",normKey:"tessier lena",phone:"0647398350",email:"",visits:[{date:"2025-08-20",pax:3,comment:""}]},
  "mallet raphael":{name:"Mallet Raphael",normKey:"mallet raphael",phone:"0628947638",email:"",visits:[{date:"2025-07-10",pax:2,comment:"outside please"}]},
  "collet zoe":{name:"Collet Zoe",normKey:"collet zoe",phone:"0681731654",email:"",visits:[{date:"2025-09-22",pax:4,comment:""}]},
  "renaud leo":{name:"Renaud Leo",normKey:"renaud leo",phone:"0662294858",email:"",visits:[{date:"2025-05-25",pax:3,comment:"table calme loin de la piscine"}]},
  "carre noemie":{name:"Carre Noemie",normKey:"carre noemie",phone:"0628691781",email:"",visits:[{date:"2025-07-14",pax:3,comment:""}]},
  "pages theo":{name:"Pages Theo",normKey:"pages theo",phone:"",email:"",visits:[{date:"2025-06-21",pax:1,comment:""}]},
  "denis romane":{name:"Denis Romane",normKey:"denis romane",phone:"0678341644",email:"",visits:[{date:"2025-07-22",pax:7,comment:"avec notre chien"}]},
  "gautier louis":{name:"Gautier Louis",normKey:"gautier louis",phone:"0685958137",email:"",visits:[{date:"2025-07-07",pax:2,comment:"sans gluten"}]},
  "arnaud elsa":{name:"Arnaud Elsa",normKey:"arnaud elsa",phone:"0625714199",email:"",visits:[{date:"2025-08-23",pax:1,comment:"fiançailles !!"}]},
};

// ── Loyalty tiers ──────────────────────────────────────────────────────────
function clientLoyalty(n) {
  if (n >= 12) return {label:'Légende ⭐⭐', level:'legende', col:'#B45309', bg:'#FEF3C7'};
  if (n >= 8)  return {label:'VIP ⭐',       level:'vip',     col:'#7C3AED', bg:'#EDE9FE'};
  if (n >= 5)  return {label:'Habitué',     level:'habitue', col:'#0284C7', bg:'#E0F2FE'};
  if (n >= 3)  return {label:'Fidèle',      level:'fidele',  col:'#16A34A', bg:'#DCFCE7'};
  if (n >= 2)  return {label:'Régulier',    level:'regulier',col:'#64748B', bg:'#F1F5F9'};
  return              {label:'Nouveau',     level:'nouveau', col:'#94A3B8', bg:'#F8FAFC'};
}

// ── Preference tags — scanned on ALL visit comments ────────────────────────
const PREF_TAGS = [
  {key:'terrasse', re:/terrasse|playa terrasse|ext[eé]rieur|dehors|outside/i,           label:'Terrasse',       icon:'🌅', col:'#0EA5E9'},
  {key:'transats', re:/transat/i,                                                        label:'Transats',       icon:'🏖️', col:'#F59E0B'},
  {key:'vuemer',   re:/vue mer|c[oô]t[eé] mer|1[eè]re ligne|premi[eè]re ligne|vue mer imp/i, label:'Vue mer',  icon:'🌊', col:'#06B6D4'},
  {key:'table',    re:/table \d|table hab|la m[eê]me table|table du fond|table attit/i, label:'Table attitrée', icon:'📍', col:'#8B5CF6'},
  {key:'calme',    re:/ombre|coin calme|calme|loin de la piscine/i,                     label:'Coin calme',     icon:'🌿', col:'#94A3B8'},
  {key:'bedtrans', re:/bed double|repas transat/i,                                       label:'Bed & transats', icon:'🛏️', col:'#F59E0B'},
  {key:'chien',    re:/\bchien\b/i,                                                      label:'Avec chien',     icon:'🐕', col:'#92400E'},
  {key:'allergie', re:/allergi/i,                                                        label:'Allergie',       icon:'⚠️', col:'#EF4444'},
  {key:'vegan',    re:/\bvegan\b|v[eé]gane/i,                                           label:'Vegan',          icon:'🌱', col:'#16A34A'},
  {key:'vegeta',   re:/v[eé]g[eé]tari/i,                                                label:'Végétarien·ne',  icon:'🥗', col:'#22C55E'},
  {key:'sansglut', re:/sans gluten|gluten.free/i,                                        label:'Sans gluten',    icon:'🌾', col:'#F97316'},
  {key:'sanslact', re:/sans lactose/i,                                                   label:'Sans lactose',   icon:'🥛', col:'#FB923C'},
  {key:'enfants',  re:/chaise haute|b[eé]b[eé]/i,                                       label:'Chaise haute',   icon:'👶', col:'#EC4899'},
  {key:'pmr',      re:/\bPMR\b|fauteuil roulant/i,                                      label:'PMR',            icon:'♿', col:'#6366F1'},
  {key:'anniv',    re:/anniversaire|anniv/i,                                             label:'Anniversaire',   icon:'🎂', col:'#EAB308'},
  {key:'romant',   re:/lune de miel|mariage|fian[cç]|notre anniversaire de rencontre/i, label:'Occasion spéciale',icon:'💍',col:'#F472B6'},
  {key:'repaspro', re:/repas d.[eé]quipe|repas pro/i,                                   label:'Repas pro',      icon:'👔', col:'#64748B'},
  {key:'surprise', re:/surprise/i,                                                       label:'Surprise',       icon:'🎁', col:'#A855F7'},
];

function _extractPrefs(visits) {
  const counts = {};
  (visits||[]).forEach(v => {
    const c = (v.comment||'').toLowerCase();
    PREF_TAGS.forEach(t => { if(t.re.test(c)) counts[t.key]=(counts[t.key]||0)+1; });
  });
  return PREF_TAGS.filter(t=>counts[t.key]).sort((a,b)=>(counts[b.key]||0)-(counts[a.key]||0));
}

function _seasonOf(visits) {
  const months=(visits||[]).map(v=>parseInt((v.date||'').split('-')[1])||0).filter(Boolean);
  if(!months.length) return {label:'?',col:'#94A3B8'};
  const tot=months.length,
        summer=months.filter(m=>m>=6&&m<=8).length,
        spring=months.filter(m=>m>=4&&m<=5).length,
        fall  =months.filter(m=>m>=9&&m<=10).length;
  if(summer/tot>=0.55) return {label:'Client été',    col:'#F59E0B'};
  if(spring/tot>=0.5)  return {label:'Client printemps',col:'#22C55E'};
  if(fall/tot>=0.4)    return {label:'Client automne',col:'#F97316'};
  return                      {label:'Toute saison',  col:'#0EA5E9'};
}

function _buildAutoMemo(visits, prefs, avgPax, visitCount) {
  if(!visits||!visits.length) return '';
  const parts=[];
  const years=[...new Set((visits||[]).map(v=>(v.date||'').substring(0,4)).filter(Boolean))].sort();
  const firstY=years[0], lastY=years[years.length-1];
  const span=firstY&&lastY&&firstY!==lastY?firstY+'→'+lastY:(firstY||'');
  if(visitCount>=12) parts.push('Client légendaire de La Playa'+(span?' ('+span+')':''));
  else if(visitCount>=8) parts.push('Grand fidèle'+(firstY?' depuis '+firstY:''));
  else if(visitCount>=5) parts.push('Habitué'+(firstY?' depuis '+firstY:''));
  const pax=Math.round(avgPax*10)/10;
  if(pax<=1.3) parts.push('Vient seul(e)');
  else if(pax<=2.3) parts.push('Généralement en couple');
  else if(pax<=3.8) parts.push('Table de 3 personnes');
  else if(pax<=5.5) parts.push('En groupe ('+Math.round(pax)+' pers.)');
  else parts.push('Grands groupes (~'+Math.round(pax)+' pers.)');
  const spots=prefs.filter(p=>['terrasse','vuemer','calme','table','transats','bedtrans'].includes(p.key));
  if(spots.length) parts.push(spots.map(p=>p.icon+' '+p.label).join(' · '));
  const diets=prefs.filter(p=>['allergie','vegan','vegeta','sansglut','sanslact'].includes(p.key));
  if(diets.length) parts.push('⚠️ '+diets.map(p=>p.label).join(' + '));
  const occs=prefs.filter(p=>['anniv','romant','surprise','repaspro'].includes(p.key));
  if(occs.length) parts.push(occs.map(p=>p.icon+' '+p.label).join(' · '));
  if(prefs.find(p=>p.key==='chien')) parts.push('🐕 Vient avec son chien');
  if(prefs.find(p=>p.key==='enfants')) parts.push('👶 Chaise haute à prévoir');
  if(prefs.find(p=>p.key==='pmr')) parts.push('♿ Accès PMR — place accessible');
  return parts.join('\n');
}

// Legacy compat wrappers
function clientDetectPrefs(text) { return _extractPrefs([{comment:text}]); }
function clientMemoAuto(client)  { return client.memoAuto||''; }

// ── CRM helpers ────────────────────────────────────────────────────────────
function _crmCapWord(w){ return w?w.charAt(0).toUpperCase()+w.slice(1).toLowerCase():''; }

function _crmExtractComment(b){
  const cf=b.custom_field||{};
  return [
    b.comment,b.note,b.internal_note,b.customer_comment,b.extra_comment,
    b.preparation,b.occasion,b.special_request,b.wishes,b.message,
    b.remarks,b.allergy,b.dietary,b.restaurant_comment,b.private_comment,
    b.customer&&b.customer.comment,b.customer&&b.customer.wishes,
    b.customer&&b.customer.preferences,b.customer&&b.customer.allergy,
    b.customer&&b.customer.dietary,b.customer&&b.customer.profile_comment,
    ...Object.entries(cf).filter(([,v])=>typeof v==='string'&&v.trim().length>2&&!/^\d+$/.test(v.trim())).map(([,v])=>v)
  ].filter(Boolean).map(s=>String(s).trim()).filter(s=>s.length>1)
   .filter((v,i,a)=>a.findIndex(x=>x.toLowerCase()===v.toLowerCase())===i).join(' · ');
}

function _crmLoadMap(){ try{const r=localStorage.getItem(CRM_HISTORY_KEY);return r?JSON.parse(r):null;}catch(e){return null;} }

function _crmSaveMap(map){
  const trySave=(data)=>localStorage.setItem(CRM_HISTORY_KEY,JSON.stringify(data));
  try{trySave(map);}
  catch(e){
    try{
      const slim={};
      Object.entries(map).forEach(([k,v])=>{slim[k]={...v,visits:v.visits.map(vi=>({date:vi.date,pax:vi.pax,comment:(vi.comment||'').substring(0,150)}))};});
      trySave(slim);
    }catch(e2){console.warn('CRM: quota localStorage');}
  }
}

function crmInitFromSeed(){
  if(localStorage.getItem(CRM_HISTORY_KEY)) return;
  const map={};
  Object.entries(CRM_SEED_DATA).forEach(([k,c])=>{
    map[k]={name:c.name,normKey:c.normKey,phone:c.phone,email:c.email,visits:c.visits.map(v=>({...v}))};
  });
  _crmSaveMap(map);
}

function crmMergeDay(date,rawBookings){
  if(!date||!rawBookings||rawBookings.length===0) return false;
  const map=_crmLoadMap()||{};
  let changed=false;
  rawBookings.forEach(b=>{
    if(!b) return;
    if(['cancelled','rejected','deleted','no_show_cancelled'].includes(b.status)) return;
    const f=(b.firstname||'').trim(),l=(b.lastname||'').trim();
    const name=[_crmCapWord(l),_crmCapWord(f)].filter(Boolean).join(' ');
    if(!name||name.length<2) return;
    const key=name.toLowerCase().trim();
    const pax=b.nb_guests||b.num_pers||2;
    const phone=(b.phone_number||b.phone||'').trim();
    const email=(b.email||'').trim();
    const comment=_crmExtractComment(b);
    if(!map[key]){map[key]={name,normKey:key,phone:'',email:'',visits:[]};changed=true;}
    if(phone&&!map[key].phone){map[key].phone=phone;changed=true;}
    if(email&&!map[key].email){map[key].email=email;changed=true;}
    const ex=map[key].visits.find(v=>v.date===date&&v.pax===pax);
    if(!ex){map[key].visits.push({date,pax,comment});changed=true;}
    else if(comment&&!ex.comment){ex.comment=comment;changed=true;}
  });
  if(changed){_crmSaveMap(map);_clientPrefsCache=null;}
  return changed;
}

async function _crmFetchPage(page,dateMin,dateMax){
  let url=ZC_API+'/bookings?limit=250';
  if(dateMin) url+='&date_min='+dateMin+'&date_max='+(dateMax||dateMin);
  if(page>1) url+='&page='+page;
  const res=await fetch(url,{headers:{'auth-token':ZC_TOKEN,'restaurantId':ZC_RESTAURANT_ID,'Content-Type':'application/json'}});
  if(!res.ok) throw new Error('HTTP '+res.status);
  return await res.json();
}
let _crmImporting=false;
async function crmImportHistory(onProgress,onDone){
  if(_crmImporting) return;
  _crmImporting=true;
  try{
    const today=new Date().toISOString().split('T')[0];
    const yearMin=(new Date().getFullYear()-5)+'-01-01';
    const p1=await _crmFetchPage(1,yearMin,today);
    const total=p1.paginator&&p1.paginator.total||0;
    const totalPages=Math.max(1,Math.ceil(total/250));
    const map=_crmLoadMap()||{};
    let changed=false;
    function addBookings(bookings){
      (bookings||[]).forEach(b=>{
        if(!b) return;
        if(['cancelled','rejected','deleted','no_show_cancelled'].includes(b.status)) return;
        const f=(b.firstname||'').trim(),l=(b.lastname||'').trim();
        const name=[_crmCapWord(l),_crmCapWord(f)].filter(Boolean).join(' ');
        if(!name||name.length<2) return;
        const date=(b.shift_date||b.day||'').substring(0,10);
        if(!date) return;
        const key=name.toLowerCase().trim();
        const pax=b.nb_guests||b.num_pers||2;
        const phone=(b.phone_number||b.phone||'').trim();
        const email=(b.email||'').trim();
        const comment=_crmExtractComment(b);
        if(!map[key]){map[key]={name,normKey:key,phone:'',email:'',visits:[]};changed=true;}
        if(phone&&!map[key].phone){map[key].phone=phone;changed=true;}
        if(email&&!map[key].email){map[key].email=email;changed=true;}
        if(!map[key].visits.find(v=>v.date===date&&v.pax===pax)){map[key].visits.push({date,pax,comment});changed=true;}
      });
    }
    addBookings(p1.data||[]);
    if(onProgress) onProgress(1,totalPages);
    const BATCH=12;
    for(let start=2;start<=totalPages;start+=BATCH){
      const nums=Array.from({length:Math.min(BATCH,totalPages-start+1)},(_,i)=>start+i);
      const pages=await Promise.all(nums.map(p=>_crmFetchPage(p,yearMin,today).then(r=>r.data||[])));
      pages.forEach(addBookings);
      if(onProgress) onProgress(Math.min(start+BATCH-1,totalPages),totalPages);
    }
    if(changed) _crmSaveMap(map);
    localStorage.setItem(CRM_HISTORY_TS_KEY,String(Date.now()));
    _clientPrefsCache=null;
    const cc=Object.keys(map).length,bc=Object.values(map).reduce((s,c)=>s+c.visits.length,0);
    if(onDone) onDone(cc,bc);
    return map;
  }finally{_crmImporting=false;}
}

async function crmEnsureHistory(){
  const ts=parseInt(localStorage.getItem(CRM_HISTORY_TS_KEY)||'0');
  const age=Date.now()-ts;
  if(!ts||age>7*24*3600*1000){
    try{await crmImportHistory(null,null);}catch(e){console.warn('CRM sync:',e.message);}
  }
}

// ── Data collection ────────────────────────────────────────────────────────
function clientsCollect(){
  const map={};
  function upsert(name,phone,email,date,pax,comment){
    const key=name.toLowerCase().trim();
    if(!map[key]) map[key]={name,normKey:key,phone:'',email:'',visits:[]};
    if(phone&&!map[key].phone) map[key].phone=phone;
    if(email&&!map[key].email) map[key].email=email;
    if(date&&!map[key].visits.find(v=>v.date===date&&v.pax===pax))
      map[key].visits.push({date,pax:pax||2,comment:comment||''});
  }
  try{
    const raw=_crmLoadMap();
    if(raw) Object.values(raw).forEach(c=>(c.visits||[]).forEach(v=>{if(c.name&&v.date) upsert(c.name,c.phone||'',c.email||'',v.date,v.pax||2,v.comment||'');}));
  }catch(e){}
  const today=(typeof currentDate!=='undefined'?currentDate:null)||new Date().toISOString().split('T')[0];
  ['s1','s2','soir','transats'].forEach(svc=>{
    ((typeof reservations!=='undefined'?reservations[svc]:null)||[]).forEach(r=>{
      if(!r.name||r.name==='Sans nom') return;
      upsert(r.name,r.phone||'',r.email||'',today,r.pax||2,r.comment||'');
    });
  });
  const notes=(()=>{try{return JSON.parse(localStorage.getItem(CLIENT_NOTES_KEY)||'{}');}catch(e){return {};}})();
  const result=[];
  Object.values(map).forEach(c=>{
    if(!c.visits.length) return;
    c.visits.sort((a,b)=>a.date>b.date?-1:1);
    c.visitCount=c.visits.length;
    c.lastVisit=c.visits[0].date;
    c.avgPax=c.visits.reduce((s,v)=>s+(v.pax||2),0)/c.visits.length;
    c.prefs=_extractPrefs(c.visits);
    c.loyalty=clientLoyalty(c.visitCount);
    c.season=_seasonOf(c.visits);
    c.memoAuto=_buildAutoMemo(c.visits,c.prefs,c.avgPax,c.visitCount);
    c.memoUser=notes[c.normKey]||'';
    result.push(c);
  });
  result.sort((a,b)=>b.visitCount-a.visitCount||b.lastVisit.localeCompare(a.lastVisit));
  return result;
}

// ── Client preferences cache (for auto-placement in placement.js) ──────────
let _clientPrefsCache=null;
function buildClientPrefsCache(){
  const clients=clientsCollect(),cache={};
  clients.forEach(c=>{
    const p=c.prefs;
    const allComments=c.visits.map(v=>v.comment||'').join(' ');
    const tm=allComments.match(/\btable[s]?\s*n?[°º]?\s*(\d+)/i);
    cache[c.normKey]={
      tableId:tm?parseInt(tm[1]):null,
      wantTerrasse:!!p.find(x=>x.key==='terrasse'),
      wantInterieur:false,
      wantOmbre:!!p.find(x=>x.key==='calme'),
      wantSoleil:false,
      bedDouble:!!p.find(x=>x.key==='bedtrans'),
      firstRow:!!p.find(x=>x.key==='vuemer'),
      extremite:false
    };
  });
  try{localStorage.setItem('playa-client-prefs-cache',JSON.stringify(cache));}catch(e){}
  _clientPrefsCache=cache;return cache;
}
function getClientHistPrefs(name){
  if(!name||name==='Sans nom') return null;
  if(!_clientPrefsCache){
    try{const s=localStorage.getItem('playa-client-prefs-cache');_clientPrefsCache=s?JSON.parse(s):{};}catch(e){_clientPrefsCache={};}
  }
  return _clientPrefsCache[name.toLowerCase().trim()]||null;
}
function invalidateClientPrefsCache(){ _clientPrefsCache=null; }
function clientSaveNote(normKey,text){
  try{const n=JSON.parse(localStorage.getItem(CLIENT_NOTES_KEY)||'{}');n[normKey]=text;localStorage.setItem(CLIENT_NOTES_KEY,JSON.stringify(n));}catch(e){}
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderClients(c){
  crmInitFromSeed();
  let filterLevel='all', searchQ='';
  c.innerHTML='';
  c.style.cssText='display:flex;flex-direction:column;overflow:hidden;height:100%;';

  // ─ scrollable body
  const body=document.createElement('div');
  body.style.cssText='flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;';
  c.appendChild(body);

  // ─ Auto-build: 1ère ouverture sans données réelles → import Zenchef automatique
  if(!localStorage.getItem(CRM_HISTORY_TS_KEY)){
    const bb=document.createElement('div');
    bb.id='crm-build-banner';
    bb.style.cssText='background:linear-gradient(135deg,#7C3AED,#0EA5E9);padding:16px;margin:12px 12px 0;border-radius:12px;color:#fff;flex-shrink:0;';
    bb.innerHTML='<div style="font-size:14px;font-weight:800;margin-bottom:5px;">🔄 Construction du CRM depuis Zenchef…</div>'
      +'<div style="font-size:11px;opacity:.85;margin-bottom:10px;">Importation des 5 dernières années de réservations</div>'
      +'<div style="height:7px;background:rgba(255,255,255,.3);border-radius:6px;overflow:hidden;"><div id="crm-bld-bar" style="height:100%;background:#fff;border-radius:6px;width:1%;transition:width .5s;"></div></div>'
      +'<div id="crm-bld-txt" style="font-size:10px;margin-top:5px;opacity:.75;">Connexion à Zenchef…</div>';
    c.insertBefore(bb, body);
    crmImportHistory(
      (cur,tot)=>{
        const bar=document.getElementById('crm-bld-bar'),txt=document.getElementById('crm-bld-txt');
        if(bar) bar.style.width=Math.round(cur/tot*100)+'%';
        if(txt) txt.textContent='Page '+cur+' / '+tot+' — chargement en cours…';
      },
      (cc,bc)=>{
        const b2=document.getElementById('crm-build-banner');
        if(b2){b2.style.background='linear-gradient(135deg,#16A34A,#059669)';b2.innerHTML='<div style="font-size:13px;font-weight:800;color:#fff;">✅ CRM construit — '+cc+' clients · '+bc+' visites importées</div>';}
        setTimeout(()=>{const b2=document.getElementById('crm-build-banner');if(b2)b2.remove();},4000);
        rebuild();
      }
    ).catch(()=>{
      const b2=document.getElementById('crm-build-banner');
      if(b2){b2.style.background='#B91C1C';b2.innerHTML='<div style="font-size:12px;font-weight:700;color:#fff;">⚠️ Zenchef inaccessible — données de référence affichées. Sync depuis l\'app sur réseau autorisé.</div>';}
      setTimeout(()=>{const b2=document.getElementById('crm-build-banner');if(b2)b2.remove();},7000);
    });
  }

  window.crmForceSync=async function(){
    const btn=document.getElementById('crm-sync-btn');
    if(btn){btn.disabled=true;btn.textContent='⏳ Sync...';}
    try{
      await crmImportHistory(null,(cc,bc)=>{rebuild();if(btn){btn.disabled=false;btn.textContent='✓ '+cc+'c';setTimeout(()=>{if(btn)btn.textContent='↺ Sync';},3000);}});
    }catch(e){if(btn){btn.disabled=false;btn.textContent='⚠ Erreur';setTimeout(()=>{btn.textContent='↺ Sync';},4000);}}
  };

  function rebuild(){
    body.innerHTML='';
    const clients=clientsCollect();
    buildClientPrefsCache();

    const totalVisits=clients.reduce((s,x)=>s+x.visitCount,0);
    const legends=clients.filter(x=>x.loyalty.level==='legende');
    const vips=clients.filter(x=>x.loyalty.level==='vip');
    const habitues=clients.filter(x=>x.loyalty.level==='habitue');
    const fideles=clients.filter(x=>x.loyalty.level==='fidele');
    const reguliers=clients.filter(x=>x.loyalty.level==='regulier');
    const nouveaux=clients.filter(x=>x.loyalty.level==='nouveau');
    const withAlert=clients.filter(x=>x.prefs.some(p=>['allergie','pmr','vegan','vegeta','sansglut','sanslact'].includes(p.key)));
    const stars=clients.filter(x=>['legende','vip'].includes(x.loyalty.level));

    // ─ STATS HEADER
    const statsEl=document.createElement('div');
    statsEl.style.cssText='padding:12px 12px 0;';
    // KPI grid
    const kpiGrid=document.createElement('div');
    kpiGrid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;';
    [
      {v:clients.length,  l:'Clients',       s:totalVisits+' visites total',  col:'#0EA5E9'},
      {v:legends.length+vips.length,l:'Légendes & VIP',s:'≥8 visites',col:'#7C3AED'},
      {v:withAlert.length,l:'Alertes régime', s:'Allergie / PMR',              col:'#EF4444'},
    ].forEach(({v,l,s,col})=>{
      const k=document.createElement('div');
      k.style.cssText='background:var(--card);border-radius:10px;border:1px solid var(--sep);padding:9px 6px;text-align:center;';
      k.innerHTML='<div style="font-size:22px;font-weight:900;color:'+col+';">'+v+'</div>'
        +'<div style="font-size:10px;font-weight:700;color:var(--tx);margin-top:1px;">'+l+'</div>'
        +'<div style="font-size:9px;color:var(--tx2);margin-top:1px;">'+s+'</div>';
      kpiGrid.appendChild(k);
    });
    statsEl.appendChild(kpiGrid);

    // Loyalty bar
    const loyBar=document.createElement('div');
    loyBar.style.cssText='background:var(--card);border-radius:10px;border:1px solid var(--sep);padding:10px 12px;margin-bottom:10px;';
    const tiers=[
      {l:'Légende ⭐⭐',n:legends.length,  col:'#B45309'},
      {l:'VIP ⭐',      n:vips.length,     col:'#7C3AED'},
      {l:'Habitué',    n:habitues.length, col:'#0284C7'},
      {l:'Fidèle',     n:fideles.length,  col:'#16A34A'},
      {l:'Régulier',   n:reguliers.length,col:'#64748B'},
      {l:'Nouveau',    n:nouveaux.length, col:'#94A3B8'},
    ];
    loyBar.innerHTML='<div style="font-size:10px;font-weight:700;color:var(--tx2);letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px;">Fidélité</div>'
      +'<div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:8px;">'
      +tiers.map(t=>t.n?'<div style="flex:'+t.n+';background:'+t.col+';" title="'+t.l+' ('+t.n+')"></div>':'').join('')
      +'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:6px;">'
      +tiers.filter(t=>t.n>0).map(t=>'<span style="font-size:10px;font-weight:600;color:'+t.col+';">'+t.l+' : '+t.n+'</span>').join('<span style="color:var(--sep);">·</span>')
      +'</div>';
    statsEl.appendChild(loyBar);

    // Top prefs stats
    const prefCounts={};
    clients.forEach(cl=>cl.prefs.forEach(p=>{ prefCounts[p.key]=(prefCounts[p.key]||{tag:p,n:0}); prefCounts[p.key].n++; }));
    const topPrefs=Object.values(prefCounts).sort((a,b)=>b.n-a.n).slice(0,6);
    if(topPrefs.length){
      const prefBox=document.createElement('div');
      prefBox.style.cssText='background:var(--card);border-radius:10px;border:1px solid var(--sep);padding:10px 12px;margin-bottom:10px;';
      prefBox.innerHTML='<div style="font-size:10px;font-weight:700;color:var(--tx2);letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px;">Habitudes les plus fréquentes</div>'
        +'<div style="display:flex;flex-wrap:wrap;gap:6px;">'
        +topPrefs.map(({tag,n})=>'<div style="display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:8px;background:'+tag.col+'15;border:1px solid '+tag.col+'30;">'
          +'<span style="font-size:12px;">'+tag.icon+'</span>'
          +'<span style="font-size:11px;font-weight:700;color:'+tag.col+';">'+tag.label+'</span>'
          +'<span style="font-size:10px;color:var(--tx2);">×'+n+'</span>'
          +'</div>').join('')
        +'</div>';
      statsEl.appendChild(prefBox);
    }

    body.appendChild(statsEl);

    // ─ LÉGENDES & VIP — hero cards
    if(stars.length){
      const heroSect=document.createElement('div');
      heroSect.style.cssText='padding:0 12px 8px;';
      heroSect.innerHTML='<div style="font-size:11px;font-weight:800;color:var(--tx2);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;">'
        +'<span>⭐ Meilleurs clients</span>'
        +'<span style="font-size:10px;font-weight:600;color:var(--tx2);opacity:.6;">'+stars.length+' clients</span>'
        +'</div>';

      const scroll=document.createElement('div');
      scroll.style.cssText='display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch;scrollbar-width:none;';
      scroll.style.setProperty('scrollbar-width','none');

      stars.forEach(cl=>{
        const L=cl.loyalty;
        const init=cl.name.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
        const fmtD=d=>{if(!d)return'?';const p=d.split('-');return p[2]+'/'+p[1]+'/'+p[0].slice(2);};
        const years=[...new Set(cl.visits.map(v=>(v.date||'').substring(0,4)).filter(Boolean))].sort();
        const span=years.length>1?years[0]+'→'+years[years.length-1]:(years[0]||'');
        const card=document.createElement('div');
        card.style.cssText='flex-shrink:0;width:175px;background:var(--card);border-radius:14px;border:1.5px solid '+L.col+'40;overflow:hidden;cursor:pointer;';
        const alertTag=cl.prefs.find(p=>['allergie','pmr'].includes(p.key));
        const dietTag=cl.prefs.find(p=>['vegan','vegeta','sansglut','sanslact'].includes(p.key));
        const spotTag=cl.prefs.find(p=>['terrasse','vuemer','calme','table','transats','bedtrans'].includes(p.key));
        const memoLines=cl.memoAuto.split('\n').slice(1,4);
        card.innerHTML='<div style="background:linear-gradient(135deg,'+L.col+','+L.col+'cc);padding:14px 12px 10px;position:relative;overflow:hidden;">'
          +'<div style="font-size:32px;font-weight:900;color:#fff;opacity:.12;position:absolute;right:6px;top:4px;line-height:1;">'+cl.visitCount+'</div>'
          +'<div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff;margin-bottom:8px;">'+init+'</div>'
          +'<div style="font-size:12px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:3px;">'+cl.name+'</div>'
          +'<div style="display:flex;gap:4px;flex-wrap:wrap;">'
            +'<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:6px;background:rgba(255,255,255,.25);color:#fff;">'+L.label+'</span>'
            +'<span style="font-size:9px;color:rgba(255,255,255,.8);">'+cl.visitCount+' vis. · '+(span||fmtD(cl.lastVisit))+'</span>'
          +'</div>'
          +'</div>'
          +'<div style="padding:8px 10px 10px;">'
            +(alertTag?'<div style="font-size:10px;font-weight:700;color:'+alertTag.col+';margin-bottom:5px;">'+alertTag.icon+' '+alertTag.label+'</div>':'')
            +'<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px;">'
              +cl.prefs.filter(p=>!['allergie','pmr'].includes(p.key)).slice(0,4).map(p=>'<span style="font-size:9px;padding:2px 5px;border-radius:6px;background:'+p.col+'18;color:'+p.col+';font-weight:700;">'+p.icon+' '+p.label+'</span>').join('')
            +'</div>'
            +(memoLines.length?'<div style="font-size:10px;color:var(--tx2);line-height:1.45;white-space:pre-line;">'+memoLines.join('\n')+'</div>':'')
            +(cl.phone?'<a href="tel:'+cl.phone.replace(/\D/g,'')+'" style="display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:4px 8px;border-radius:8px;background:'+L.col+'15;color:'+L.col+';font-size:10px;font-weight:700;text-decoration:none;">📞 '+cl.phone+'</a>':'')
          +'</div>';
        scroll.appendChild(card);
      });
      heroSect.appendChild(scroll);
      body.appendChild(heroSect);
    }

    // ─ DIVIDER
    const div0=document.createElement('div');
    div0.style.cssText='height:1px;background:var(--sep);margin:0 12px 10px;';
    body.appendChild(div0);

    // ─ SEARCH + SYNC BTN
    const topRow=document.createElement('div');
    topRow.style.cssText='display:flex;gap:8px;padding:0 12px;margin-bottom:8px;';
    topRow.innerHTML='<input id="crm-search" placeholder="🔍 Rechercher un client…" style="flex:1;padding:9px 12px;border:1px solid var(--sep);border-radius:10px;font-family:inherit;font-size:13px;background:var(--card);color:var(--tx);outline:none;">'
      +'<button id="crm-sync-btn" onclick="crmForceSync()" style="padding:8px 10px;border:1px solid var(--sep);border-radius:10px;background:var(--card);font-size:11px;font-weight:600;color:var(--tx2);cursor:pointer;font-family:inherit;white-space:nowrap;">↺ Sync</button>';
    body.appendChild(topRow);
    const inp=body.querySelector('#crm-search');
    inp.value=searchQ;
    inp.oninput=()=>{searchQ=inp.value;renderList();};

    // ─ FILTER TABS
    const tabs=[
      {k:'all',      label:'Tous',        count:clients.length},
      {k:'legende',  label:'Légendes ⭐⭐',count:legends.length},
      {k:'vip',      label:'VIP ⭐',       count:vips.length},
      {k:'habitue',  label:'Habitués',    count:habitues.length},
      {k:'fidele',   label:'Fidèles',     count:fideles.length},
      {k:'regulier', label:'Réguliers',   count:reguliers.length},
      {k:'nouveau',  label:'1 visite',    count:nouveaux.length},
    ];
    const tabsEl=document.createElement('div');
    tabsEl.style.cssText='padding:0 12px;margin-bottom:10px;';
    tabsEl.appendChild(makeSubNav(tabs,filterLevel,k=>{filterLevel=k;renderList();}));
    body.appendChild(tabsEl);

    // ─ LIST
    const listEl=document.createElement('div');
    listEl.style.cssText='padding:0 12px 80px;';
    body.appendChild(listEl);

    function renderList(){
      listEl.innerHTML='';
      let list=clients;
      if(filterLevel!=='all') list=list.filter(x=>x.loyalty.level===filterLevel);
      if(searchQ.trim()){const q=searchQ.toLowerCase();list=list.filter(x=>x.name.toLowerCase().includes(q)||(x.phone||'').includes(q));}
      if(!list.length){listEl.innerHTML='<div style="text-align:center;padding:30px 20px;color:var(--tx2);font-size:13px;">Aucun client trouvé</div>';return;}
      const grid=document.createElement('div');
      grid.style.cssText='display:flex;flex-direction:column;gap:8px;';
      list.forEach(cl=>grid.appendChild(_makeClientCard(cl)));
      listEl.appendChild(grid);
    }
    renderList();
  }

  function _makeClientCard(cl){
    const L=cl.loyalty;
    const card=document.createElement('div');
    card.setAttribute('data-card',cl.normKey);
    card.style.cssText='background:var(--card);border:1px solid var(--sep);border-left:4px solid '+L.col+';border-radius:0 12px 12px 0;overflow:hidden;';
    const init=cl.name.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    const fmtD=d=>{if(!d)return'—';const p=d.split('-');return p[2]+'/'+p[1]+'/'+p[0].slice(2);};
    const alertPrefs=cl.prefs.filter(p=>['allergie','pmr'].includes(p.key));
    const otherPrefs=cl.prefs.filter(p=>!['allergie','pmr'].includes(p.key));
    const chips=[...alertPrefs,...otherPrefs].map(p=>'<span style="display:inline-flex;align-items:center;gap:2px;padding:2px 6px;border-radius:7px;background:'+p.col+'18;color:'+p.col+';font-size:9.5px;font-weight:700;margin:2px 2px 0 0;border:1px solid '+p.col+'25;">'+p.icon+' '+p.label+'</span>').join('');
    const years=[...new Set(cl.visits.map(v=>(v.date||'').substring(0,4)).filter(Boolean))].sort();
    const span=years.length>1?' · '+years[0]+'→'+years[years.length-1]:(years[0]?' · '+years[0]:'');
    const avgStr=cl.avgPax>=2?' · ~'+Math.round(cl.avgPax)+' pers.':'';
    const phoneBtn=cl.phone?'<a href="tel:'+cl.phone.replace(/\D/g,'')+'" style="padding:5px 9px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;color:var(--tx);text-decoration:none;">📞</a>':'';
    card.innerHTML='<div style="padding:9px 12px 7px;">'
      +'<div style="display:flex;align-items:center;gap:9px;">'
        +'<div style="width:35px;height:35px;border-radius:50%;background:'+L.col+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;">'+init+'</div>'
        +'<div style="flex:1;min-width:0;">'
          +'<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">'
            +'<span style="font-size:14px;font-weight:800;color:var(--tx);">'+cl.name+'</span>'
            +'<span style="font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:8px;background:'+L.bg+';color:'+L.col+';">'+L.label+'</span>'
            +'<span style="font-size:9px;padding:1px 6px;border-radius:6px;background:'+cl.season.col+'18;color:'+cl.season.col+';font-weight:600;">'+cl.season.label+'</span>'
          +'</div>'
          +'<div style="font-size:11px;color:var(--tx2);margin-top:1px;">'+cl.visitCount+' visite'+(cl.visitCount>1?'s':'')+avgStr+span+' · Dernière : '+fmtD(cl.lastVisit)+'</div>'
        +'</div>'
      +'</div>'
      +(cl.prefs.length?'<div style="margin-top:6px;">'+chips+'</div>':'')
      +'</div>'
      +(cl.memoAuto&&!cl.memoUser
        ?'<div style="padding:0 12px 6px;background:var(--bg);"><div style="font-size:10px;color:var(--tx2);line-height:1.5;white-space:pre-line;padding:5px 8px;background:var(--card);border-radius:6px;border-left:2px solid '+L.col+';">'+cl.memoAuto+'</div></div>'
        :'')
      +'<div style="padding:5px 12px 7px;border-top:.5px solid var(--sep);background:var(--bg);">'
        +'<textarea placeholder="Note personnalisée…" style="width:100%;box-sizing:border-box;padding:5px 8px;border:1px solid var(--sep);border-radius:8px;font-family:inherit;font-size:11px;color:var(--tx);background:var(--card);resize:none;outline:none;line-height:1.5;min-height:34px;" rows="2" onchange="clientSaveNote(\''+cl.normKey+'\',this.value)">'+cl.memoUser+'</textarea>'
      +'</div>'
      +'<div style="padding:4px 12px 6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;border-top:.5px solid var(--sep);">'
        +phoneBtn
        +'<button onclick="(function(btn){var h=btn.closest(\'[data-card]\').querySelector(\'.cl-hist\');var o=h.style.display!==\'none\';h.style.display=o?\'none\':\'block\';btn.textContent=o?\'▾ Historique ('+cl.visitCount+')\':\'▴ Masquer\';})(this)" style="padding:4px 10px;border:1px solid var(--sep);border-radius:8px;background:var(--card);font-size:11px;font-weight:600;color:var(--tx2);cursor:pointer;font-family:inherit;">▾ Historique ('+cl.visitCount+')</button>'
      +'</div>'
      +'<div class="cl-hist" style="display:none;border-top:.5px solid var(--sep);">'
        +'<div style="padding:6px 12px;max-height:180px;overflow-y:auto;">'
          +cl.visits.map(v=>'<div style="display:flex;gap:8px;align-items:baseline;padding:3px 0;border-bottom:.5px solid var(--sep);font-size:11px;">'
            +'<span style="font-family:monospace;font-size:10px;color:var(--tx2);flex-shrink:0;width:54px;">'+fmtD(v.date)+'</span>'
            +'<span style="color:var(--tx2);min-width:18px;flex-shrink:0;">'+v.pax+'p</span>'
            +'<span style="color:var(--tx);line-height:1.4;word-break:break-word;font-style:'+(v.comment?'normal':'italic')+';">'+(v.comment||'—')+'</span>'
            +'</div>').join('')
        +'</div>'
      +'</div>';
    return card;
  }

  rebuild();
}
