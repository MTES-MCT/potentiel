import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection } from '../../../infrastructure';

export const handleDemandeChangementActionnaireRejetée = async ({
  payload: {
    identifiantProjet,
    rejetéeLe,
    rejetéePar,
    réponseSignée: { format },
  },
}: Actionnaire.DemandeChangementActionnaireRejetéeEvent) => {
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
    demande: {
      ...projectionToUpsert.demande,
      statut: Actionnaire.StatutChangementActionnaire.rejeté.statut,

      rejet: {
        rejetéeLe,
        rejetéePar,
        réponseSignée: {
          format,
        },
      },
    },
  });
};
