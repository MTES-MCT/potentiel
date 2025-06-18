import { Actionnaire } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const actionnaireModifiéProjector = async ({
  payload: { identifiantProjet, modifiéLe, actionnaire },
}: Lauréat.Actionnaire.ActionnaireModifiéEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: modifiéLe,
    },
  });
};
