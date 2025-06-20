import { Raccordement } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const propositionTechniqueEtFinancièreModifiéeV2Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    propositionTechniqueEtFinancièreSignée: { format },
  },
  created_at,
}: Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent & Event) => {
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
          format,
        },
      },
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
