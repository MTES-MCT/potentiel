import { Fournisseur } from '../lauréat';

const champsCsvFournisseur: Record<Fournisseur.TypeFournisseur.RawType, string> = {
  moduleOuFilms: 'Nom du fabricant \n(Modules ou films)',
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
