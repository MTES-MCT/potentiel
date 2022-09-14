export type Fournisseur = { kind: FournisseurKind; name: string }

export const CORRESPONDANCE_CHAMPS_FOURNISSEURS_COLONNE_IMPORT = {
  'modules ou films': 'Nom du fabricant \n(Modules ou films)',
  cellules: 'Nom du fabricant (Cellules)',
  'plaquettes de silicium (wafers)': 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
  polysilicium: 'Nom du fabricant \n(Polysilicium)',
  'postes de conversion': 'Nom du fabricant \n(Postes de conversion)',
  structures: 'Nom du fabricant \n(Structure)',
  'dispositifs de stockage de l’énergie':
    'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
  'dispositifs de suivi de la course du soleil':
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
  'autres technologies': 'Nom du fabricant \n(Autres technologies)',
}

export const CHAMPS_FOURNISSEURS: ReadonlyArray<string> = Object.keys(
  CORRESPONDANCE_CHAMPS_FOURNISSEURS_COLONNE_IMPORT
)

export type FournisseurKind = keyof typeof CORRESPONDANCE_CHAMPS_FOURNISSEURS_COLONNE_IMPORT

export const isFournisseurKind = (value: string): value is FournisseurKind => {
  return CHAMPS_FOURNISSEURS.includes(value)
}
