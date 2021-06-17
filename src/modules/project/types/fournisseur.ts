export type Fournisseur = { kind: FournisseurKind; name: string }

export type FournisseurKind =
  | 'Nom du fabricant \n(Modules ou films)'
  | 'Nom du fabricant (Cellules)'
  | 'Nom du fabricant \n(Plaquettes de silicium (wafers))'
  | 'Nom du fabricant \n(Polysilicium)'
  | 'Nom du fabricant \n(Postes de conversion)'
  | 'Nom du fabricant \n(Structure)'
  | 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)'
  | 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)'
  | 'Nom du fabricant \n(Autres technologies)'
