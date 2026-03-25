import { Candidature } from '@potentiel-domain/projet';

import { Champs } from '../../graphql/index.js';

export const getRéférencesRaccordement = (champs: Champs) => {
  const référencesRaccordement: Candidature.Dépôt.RawType['référencesRaccordement'] = [];

  const LABELS_CHAMPS = [
    'Référence du dossier de raccordement 1 (Enedis)',
    'Référence du dossier de raccordement 2 (Enedis)',
    'Référence du dossier de raccordement 3 (Enedis)',
    'Référence du dossier de raccordement 1 (Autre)',
    'Référence du dossier de raccordement 2 (Autre)',
    'Référence du dossier de raccordement 3 (Autre)',
  ];

  LABELS_CHAMPS.forEach((label) => {
    const champ = champs.find(
      (champ) =>
        champ.__typename === 'TextChamp' &&
        champ.label.trim().toLowerCase() === label.trim().toLowerCase(),
    );
    if (typeof champ?.stringValue === 'string' && champ.stringValue.trim()) {
      référencesRaccordement.push(champ.stringValue.trim());
    }
  });

  return référencesRaccordement;
};
