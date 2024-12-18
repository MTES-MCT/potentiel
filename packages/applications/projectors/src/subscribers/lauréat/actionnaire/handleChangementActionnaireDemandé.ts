import { Actionnaire } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleChangementActionnaireDemandé = async ({
  payload: {
    identifiantProjet,
    demandéeLe,
    demandéePar,
    raison,
    pièceJustificative: { format },
  },
}: Actionnaire.ChangementActionnaireDemandéEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
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
