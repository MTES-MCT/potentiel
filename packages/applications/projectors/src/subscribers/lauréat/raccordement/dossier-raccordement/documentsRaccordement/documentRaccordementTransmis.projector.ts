import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const documentRaccordementTransmisV1Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    document,
    transmisLe,
    type,
  },
}: Lauréat.Raccordement.DocumentRaccordementTransmisEventV1) => {
  const documentPayload = {
    dateSignature,
    document,
  };

  const payload =
    type === 'proposition-technique-et-financière'
      ? {
          propositionTechniqueEtFinancière: documentPayload,
        }
      : type === 'convention-de-raccordement'
        ? {
            conventionDeRaccordement: documentPayload,
          }
        : {
            conventionDirecteDeRaccordement: documentPayload,
          };

  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      ...payload,
      miseÀJourLe: DateTime.convertirEnValueType(transmisLe).formatter(),
    },
  );
};
