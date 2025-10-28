import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const propositionTechniqueEtFinancièreModifiéeV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateSignature },
  created_at,
}: Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1 & Event) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordement,
  );

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement,
    dossierRaccordement: {
      ...dossier,
      propositionTechniqueEtFinancière: {
        dateSignature,
        propositionTechniqueEtFinancièreSignée: {
          format:
            dossier.propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée
              ?.format || '',
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
