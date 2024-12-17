import { Actionnaire } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleActionnaireModifié = async ({
  payload: { identifiantProjet, modifiéLe, actionnaire },
}: Actionnaire.ActionnaireModifiéEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: modifiéLe,
    },
  });
};
