import { Candidature } from '../../../..';

import { mapDétailCSVToDétailFournisseur } from './_helpers/mapDétailCSVToDétailFournisseur';

export const CSVDétailKeys: Partial<Array<keyof Candidature.DétailCandidature.RawType>> = [
  'Contenu local européen (%) (Autres technologies)',
  'Contenu local français (%) (Autres technologies)',
  'Coût total du lot (M€) (Autres technologies)',

  // À garder ?
  'Référence commerciale (Autres technologies)',

  'Nom du fabricant (Autres technologies)',
  'Lieu(x) de fabrication (Autres technologies)',

  'Nom du fabricant (Autres technologies) 1',
  'Lieu(x) de fabrication (Autres technologies) 1',

  'Nom du fabricant (Autres technologies) 2',
  'Lieu(x) de fabrication (Autres technologies) 2',

  'Nom du fabricant (Autres technologies) 3',
  'Lieu(x) de fabrication (Autres technologies) 3',

  'Nom du fabricant (Autres technologies) 4',
  'Lieu(x) de fabrication (Autres technologies) 4',

  'Nom du fabricant (Autres technologies) 5',
  'Lieu(x) de fabrication (Autres technologies) 5',
];

export const mapToDétailFournisseur = (détail: Candidature.DétailCandidature.RawType) =>
  mapDétailCSVToDétailFournisseur(détail);
