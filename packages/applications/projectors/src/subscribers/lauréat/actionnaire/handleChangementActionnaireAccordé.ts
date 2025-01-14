import { Actionnaire } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection } from '../../../infrastructure';

export const handleChangementActionnaireAccordé = async ({
  payload: {
    nouvelActionnaire,
    identifiantProjet,
    accordéeLe,
    accordéePar,
    réponseSignée: { format },
  },
}: Actionnaire.ChangementActionnaireAccordéEvent) => {
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
    actionnaire: {
      nom: nouvelActionnaire,
      misÀJourLe: accordéeLe,
    },
    demande: {
      ...projectionToUpsert.demande,
      statut: Actionnaire.StatutChangementActionnaire.accordé.statut,

      accord: {
        accordéeLe,
        accordéePar,
        réponseSignée: {
          format,
        },
      },
    },
  });
};
