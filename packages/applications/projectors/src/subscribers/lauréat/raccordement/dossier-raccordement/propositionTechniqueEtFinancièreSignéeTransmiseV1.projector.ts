import { Raccordement } from '@potentiel-domain/laureat';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';

import { getDossierRaccordement } from '../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../_utils/upsertDossierRaccordement';

export const propositionTechniqueEtFinancièreSignéeTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, format },
  created_at,
}: Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1 & Event) => {
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
        dateSignature: dossier.propositionTechniqueEtFinancière?.dateSignature || '',
        propositionTechniqueEtFinancièreSignée: {
          format,
        },
      },
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
