export type Fournisseur = { kind: FournisseurKind; name: string }

export const CORRESPONDANCE_CHAMPS_FOURNISSEURS = {
  'Nom du fabricant \n(Modules ou films)': 'Modules ou films',
  'Nom du fabricant (Cellules)': 'Cellules',
  'Nom du fabricant \n(Plaquettes de silicium (wafers))': 'Plaquettes de silicium (wafers)',
  'Nom du fabricant \n(Polysilicium)': 'Polysilicium',
  'Nom du fabricant \n(Postes de conversion)': 'Postes de conversion',
  'Nom du fabricant \n(Structure)': 'Structures',
  'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)':
    'Dispositifs de stockage de l’énergie',
  'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)':
    'Dispositifs de suivi de la course du soleil',
  'Nom du fabricant \n(Autres technologies)': 'Autres technologies',
}

export const CHAMPS_FOURNISSEURS: ReadonlyArray<string> = Object.keys(
  CORRESPONDANCE_CHAMPS_FOURNISSEURS
)

export type FournisseurKind = keyof typeof CORRESPONDANCE_CHAMPS_FOURNISSEURS

export const isFournisseurKind = (value: string): value is FournisseurKind => {
  return CHAMPS_FOURNISSEURS.includes(value)
}
