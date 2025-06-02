// à confirmer
// champs demandé pour l'eolien par le métier mais inexistant ?
// dispositifsProductionElectricité: {
//   CSVColumnLabel: 'Nom du fabricant \n(Dispositifs de production d’électricité)',
//   label: 'Dispositifs de production d’éléctricité',
// },

// union type ou pas ?

export type ChampsFournisseur =
  | 'moduleOrFilms'
  | 'cellules'
  | 'plaquettesSilicium'
  | 'polysilicium'
  | 'postesConversion'
  | 'structures'
  | 'dispositifsStockageEnergie'
  | 'dispositifsSuiviCourseSoleil'
  | 'autresTechnologies';

export type ChampsFournisseurDétails = Array<Record<ChampsFournisseur, string | undefined>>;

export const champsCsvFournisseur: Record<ChampsFournisseur, string> = {
  moduleOrFilms: 'Nom du fabricant \n(Modules ou films)',
  cellules: 'Nom du fabricant (Cellules)',
  plaquettesSilicium: 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
  polysilicium: 'Nom du fabricant \n(Polysilicium)',
  postesConversion: 'Nom du fabricant \n(Postes de conversion)',
  structures: 'Nom du fabricant \n(Structure)',
  dispositifsStockageEnergie: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
  dispositifsSuiviCourseSoleil:
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
  autresTechnologies: 'Nom du fabricant \n(Autres technologies)',
};

export const champsLabelsFournisseur: Record<ChampsFournisseur, string> = {
  moduleOrFilms: 'Modules ou films',
  cellules: 'Cellules',
  plaquettesSilicium: 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  postesConversion: 'Postes de conversion',
  structures: 'Structures',
  dispositifsStockageEnergie: 'Dispositifs de stockage de l’énergie',
  dispositifsSuiviCourseSoleil: 'Dispositifs de suivi de la course du soleil',
  autresTechnologies: 'Autres technologies',
};
