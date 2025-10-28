import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const actionnaireModifiéProjector = async ({
  payload: { identifiantProjet, modifiéLe, actionnaire },
}: Lauréat.Actionnaire.ActionnaireModifiéEvent) => {
  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      actionnaire: {
        nom: actionnaire,
        miseÀJourLe: modifiéLe,
      },
    },
  );
};
