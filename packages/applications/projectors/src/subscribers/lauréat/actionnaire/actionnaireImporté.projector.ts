import { Actionnaire } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';
import { getProjectDataFromCandidature } from '../_utils/getProjectData';

export const actionnaireImportéProjector = async ({
  payload: { identifiantProjet, actionnaire, importéLe },
}: Actionnaire.ActionnaireImportéEvent) => {
  const projet = await getProjectDataFromCandidature(identifiantProjet);

  if (!projet) {
    getLogger().error('Projet non trouvé', {
      identifiantProjet,
    });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    projet,
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: importéLe,
    },
  });
};
