import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const propositionTechniqueEtFinancièreModifiéeV2Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    propositionTechniqueEtFinancièreSignée,
  },
  created_at,
}: Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV2 & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      propositionTechniqueEtFinancière: {
        dateSignature,
        ...(propositionTechniqueEtFinancièreSignée && {
          propositionTechniqueEtFinancièreSignée,
        }),
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
};
