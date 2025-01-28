import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { removeProjection, upsertProjection } from '../../../infrastructure';

export const changementActionnaireAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Actionnaire.ChangementActionnaireAnnuléEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  if (!projectionToUpsert.dateDemandeEnCours) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: undefined,
  });

  await removeProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${projectionToUpsert.dateDemandeEnCours}`,
  );
};
