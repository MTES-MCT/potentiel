import { Actionnaire } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleChangementActionnaireDemandé = async ({
  payload: {
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Actionnaire.ChangementActionnaireDemandéEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    demande: {
      statut: Actionnaire.StatutChangementActionnaire.demandé.statut,
      demandéPar,
      demandéLe,
      raison,
      pièceJustificative: {
        format,
      },
    },
  });
};
