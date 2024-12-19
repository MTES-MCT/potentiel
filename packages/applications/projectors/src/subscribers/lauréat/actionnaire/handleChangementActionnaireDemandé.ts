import { Actionnaire } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const handleChangementActionnaireDemandé = async ({
  payload: {
    identifiantProjet,
    demandéeLe,
    demandéePar,
    raison,
    pièceJustificative: { format },
  },
}: Actionnaire.ChangementActionnaireDemandéEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...projectionToUpsert,
    demande: {
      statut: Actionnaire.StatutChangementActionnaire.demandé.statut,
      demandéePar,
      demandéeLe,
      raison,
      pièceJustificative: {
        format,
      },
    },
  });
};
