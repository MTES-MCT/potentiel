import { Actionnaire } from '@potentiel-domain/laureat';

import { createProjection } from '../../../infrastructure';

export const handleActionnaireTransmis = async ({
  payload: { identifiantProjet, actionnaire, transmisLe },
}: Actionnaire.ActionnaireTransmisEvent) => {
  await createProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: transmisLe,
    },
  });
};
