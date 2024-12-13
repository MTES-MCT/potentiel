import { Actionnaire } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

export const handleChangementActionnaireDemandé = async ({
  payload: {
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Actionnaire.ChangementActionnaireDemandéEvent) => {
  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: Actionnaire.StatutChangementActionnaire.demandé.statut,
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
