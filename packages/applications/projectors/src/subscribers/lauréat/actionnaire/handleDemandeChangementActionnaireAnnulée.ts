import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { updateOneProjection } from '../../../infrastructure';

export const handleDemandeChangementActionnaireAnnulée = async ({
  payload: { identifiantProjet },
}: Actionnaire.DemandeChangementActionnaireAnnuléEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  if (!projectionToUpsert.demande) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    demande: undefined,
  });
};
