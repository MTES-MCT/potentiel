import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const documentRaccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, suppriméLe, type },
}: Lauréat.Raccordement.DocumentRaccordementSuppriméEventV1) => {
  const dossier = await findProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
  );

  if (Option.isNone(dossier)) {
    throw new Error(`Impossible de supprimer le document de raccordement`);
  }

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

  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      ...dossier,
      ...payload,
      miseÀJourLe: DateTime.convertirEnValueType(suppriméLe).formatter(),
    },
  );
};
