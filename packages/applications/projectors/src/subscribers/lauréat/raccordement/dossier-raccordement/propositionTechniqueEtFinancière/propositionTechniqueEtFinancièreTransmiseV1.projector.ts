import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const propositionTechniqueEtFinancièreTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateSignature },
  created_at,
}: Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1 & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      propositionTechniqueEtFinancière: {
        dateSignature,
        propositionTechniqueEtFinancièreSignée: {
          format: '',
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
};
