import { Candidature } from '@potentiel-domain/projet';

import { type Champs, createDossierAccessor } from '../../graphql/accessor.js';

export const getRaccordements = (champs: Champs) => {
  const références: Candidature.RaccordementDépôt.RawType[] = [];
  const accessor = createDossierAccessor(champs, {
    raccordements:
      'Pour chaque référence de raccordement, ajouter un bloc contenant les informations correspondantes',
  });

  const raccordements = accessor.getRepetitionChamps('raccordements');

  if (!raccordements) return;

  for (const { champs } of raccordements) {
    const raccordementAccessor = createDossierAccessor(champs, {
      référence: 'Référence du dossier de raccordement',
      dateQualification: `Date de l'accusé de réception de la demande de raccordement`,
    });

    const référence = raccordementAccessor.getStringValue('référence')?.trim();
    const dateQualification = raccordementAccessor.getDateValue('dateQualification');

    if (référence && dateQualification) {
      références.push({ référence, dateQualification });
    }
  }

  return références;
};
