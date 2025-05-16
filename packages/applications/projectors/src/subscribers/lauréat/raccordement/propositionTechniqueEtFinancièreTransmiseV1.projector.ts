import { Raccordement } from '@potentiel-domain/laureat';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';

import { getDossierRaccordement } from './_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from './_utils/upsertDossierRaccordement';

export const propositionTechniqueEtFinancièreTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateSignature },
  created_at,
}: Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1 & Event) => {
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
          format: '',
        },
      },
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
