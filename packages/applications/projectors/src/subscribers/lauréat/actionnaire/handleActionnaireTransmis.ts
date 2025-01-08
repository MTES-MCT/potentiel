import { Actionnaire } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

export const handleActionnaireTransmis = async ({
  payload: { identifiantProjet, actionnaire, transmisLe },
}: Actionnaire.ActionnaireTransmisEvent) => {
  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: transmisLe,
    },
  });
};
