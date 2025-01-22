import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { removeProjection, upsertProjection } from '../../../infrastructure';

export const changementActionnaireSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Actionnaire.ChangementActionnaireSuppriméEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  if (!projectionToUpsert.demandeEnCours) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...projectionToUpsert,
    demandeEnCours: undefined,
  });

  await removeProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${projectionToUpsert.demandeEnCours.demandéeLe}`,
  );
};
