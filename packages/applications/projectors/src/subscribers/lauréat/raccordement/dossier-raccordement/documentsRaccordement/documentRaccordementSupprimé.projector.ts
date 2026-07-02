import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const documentRaccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, suppriméLe, type },
}: Lauréat.Raccordement.DocumentRaccordementSuppriméEventV1) => {
  const payload =
    type === 'proposition-technique-et-financière'
      ? {
          propositionTechniqueEtFinancière: undefined,
        }
      : type === 'convention-de-raccordement'
        ? {
            conventionDeRaccordement: undefined,
          }
        : {
            conventionDirecteDeRaccordement: undefined,
          };

  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      ...payload,
      miseÀJourLe: DateTime.convertirEnValueType(suppriméLe).formatter(),
    },
  );
};
