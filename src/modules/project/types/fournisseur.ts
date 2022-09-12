export type Fournisseur = { kind: FournisseurKind; name: string }

export type FournisseurKind =
  | 'Fournisseur modules ou films'
  | 'Fournisseur cellules'
  | 'Fournisseur plaquettes de silicium (wafers)'
  | 'Fournisseur polysilicium'
  | 'Fournisseur postes de conversion'
  | 'Fournisseur structure'
  | 'Fournisseur dispositifs de stockage de l’énergie'
  | 'Fournisseur dispositifs de suivi de la course du soleil'
  | 'Fournisseur autres technologies'

export const isFournisseurKind = (value: string): value is FournisseurKind => {
  return [
    'Fournisseur modules ou films',
    'Fournisseur cellules',
    'Fournisseur plaquettes de silicium (wafers)',
    'Fournisseur polysilicium',
    'Fournisseur postes de conversion',
    'Fournisseur structure',
    'Fournisseur dispositifs de stockage de l’énergie',
    'Fournisseur dispositifs de suivi de la course du soleil',
    'Fournisseur autres technologies',
  ].includes(value)
}
