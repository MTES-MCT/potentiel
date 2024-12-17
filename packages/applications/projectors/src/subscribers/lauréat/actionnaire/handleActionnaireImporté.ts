import { Actionnaire } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleActionnaireImporté = async ({
  payload: { identifiantProjet, actionnaire, importéLe },
}: Actionnaire.ActionnaireImportéEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: importéLe,
    },
  });
};
