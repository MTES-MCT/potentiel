import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const propositionTechniqueEtFinancièreSignéeTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, format },
  created_at,
}: Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1 & Event) => {
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
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
