const REGIONS = [
  'Grand Est',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Normandie',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Centre-Val de Loire',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Pays de la Loire',
  'Hauts-de-France',
  'Île-de-France',
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'La Réunion',
  'Mayotte',
  'Corse',
] as const

type DREAL = typeof REGIONS[number]

export { DREAL, REGIONS }
