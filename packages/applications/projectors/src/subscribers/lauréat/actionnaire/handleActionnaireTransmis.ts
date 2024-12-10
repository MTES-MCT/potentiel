import { Actionnaire } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleActionnaireTransmis = async ({
  payload: { identifiantProjet, actionnaire, transmisLe },
}: Actionnaire.ActionnaireTransmisEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: transmisLe,
    },
  });
};
