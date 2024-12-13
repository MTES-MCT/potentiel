import { Actionnaire } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

export const handleModificationActionnaireDemandée = async ({
  payload: {
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Actionnaire.ModificationActionnaireDemandéeEvent) => {
  await upsertProjection<Actionnaire.ModificationActionnaireEntity>(
    `modification-actionnaire|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: Actionnaire.StatutModificationActionnaire.demandé.statut,
      misÀJourLe: demandéLe,

      demande: {
        demandéPar,
        demandéLe,
        raison,
        pièceJustificative: {
          format,
        },
      },
    },
  );
};
