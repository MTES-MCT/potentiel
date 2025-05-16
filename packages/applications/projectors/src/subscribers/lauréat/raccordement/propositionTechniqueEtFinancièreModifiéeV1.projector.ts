import { Raccordement } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getDossierRaccordement } from './_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from './_utils/upsertDossierRaccordement';

export const propositionTechniqueEtFinancièreModifiéeV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateSignature },
  created_at,
}: Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1 & Event) => {
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
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
