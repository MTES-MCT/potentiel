import { Actionnaire } from '@potentiel-domain/laureat';

import { createProjection } from '../../../infrastructure';

export const handleActionnaireImporté = async ({
  payload: { identifiantProjet, actionnaire, importéLe },
}: Actionnaire.ActionnaireImportéEvent) => {
  await createProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: importéLe,
    },
  });
};
