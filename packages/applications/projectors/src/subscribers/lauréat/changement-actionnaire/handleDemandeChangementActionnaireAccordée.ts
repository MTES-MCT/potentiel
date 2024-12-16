import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const handleDemandeChangementActionnaireAccordée = async ({
  payload: {
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Actionnaire.DemandeChangementActionnaireAccordéeEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Demande non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}`,
    {
      ...projectionToUpsert,
      identifiantProjet,
      statut: Actionnaire.StatutChangementActionnaire.accordé.statut,
      misÀJourLe: accordéLe,

      demande: {
        ...projectionToUpsert.demande,
        accord: {
          accordéLe,
          accordéPar,
          réponseSignée: {
            format,
          },
        },
      },
    },
  );
};
