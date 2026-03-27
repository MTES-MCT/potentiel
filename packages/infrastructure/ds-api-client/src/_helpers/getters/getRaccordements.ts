import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Champs, RepetitionChamp } from '../../graphql/index.js';

export const getRaccordements = (champs: Champs) => {
  const LABEL_BLOC_RACCORDEMENT = 'Raccordement';
  const LABEL_CHAMP_RÉFÉRENCE = 'Référence du raccordement';
  const LABEL_CHAMP_DATE = "Date de l'accusé de réception";

  const raccordements: Candidature.Dépôt.RawType['raccordements'] = [];

  const blocsRaccordement = champs.find(
    (champ) =>
      champ.__typename === 'RepetitionChamp' &&
      champ.label.trim().toLowerCase() === LABEL_BLOC_RACCORDEMENT.trim().toLowerCase(),
  ) as RepetitionChamp | undefined;

  if (!blocsRaccordement?.rows) return;

  blocsRaccordement.rows.forEach((bloc) => {
    const raccordement = Object.fromEntries(
      bloc.champs.map((champ) => [champ.label, champ.stringValue]),
    );

    const référence = raccordement[LABEL_CHAMP_RÉFÉRENCE];
    const date = raccordement[LABEL_CHAMP_DATE];

    if (référence && date) {
      raccordements.push({
        référence: référence.trim(),
        dateQualification: DateTime.convertirEnValueType(date).formatter(),
      });
    }
  });

  return raccordements;
};
