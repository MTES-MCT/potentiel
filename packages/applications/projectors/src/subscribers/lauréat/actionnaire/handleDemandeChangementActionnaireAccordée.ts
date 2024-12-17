import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const handleDemandeChangementActionnaireAccordée = async ({
  payload: {
    nouvelActionnaire,
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Actionnaire.DemandeChangementActionnaireAccordéeEvent) => {
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

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...projectionToUpsert,
    identifiantProjet,
    actionnaire: {
      nom: nouvelActionnaire,
      misÀJourLe: accordéLe,
    },
    demande: {
      ...projectionToUpsert.demande,
      statut: Actionnaire.StatutChangementActionnaire.accordé.statut,

      accord: {
        accordéLe,
        accordéPar,
        réponseSignée: {
          format,
        },
      },
    },
  });
};
