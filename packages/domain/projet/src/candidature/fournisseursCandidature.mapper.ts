import { Fournisseur } from '../lauréat';

const champsCsvFournisseur: Record<Fournisseur.TypeFournisseur.RawType, string> = {
  module-ou-films: 'Nom du fabricant \n(Modules ou films)',
  cellules: 'Nom du fabricant (Cellules)',
  plaquettes-silicium: 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
  polysilicium: 'Nom du fabricant \n(Polysilicium)',
  postes-conversion: 'Nom du fabricant \n(Postes de conversion)',
  structures: 'Nom du fabricant \n(Structure)',
  dispositifs-stockage-energie: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
  dispositifs-suivi-course-soleil:
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
  autres-technologies: 'Nom du fabricant \n(Autres technologies)',
};
