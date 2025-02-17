import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const abandonRejetéProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Abandon.AbandonRejetéEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'abandonRejetéProjector',
    });
    return;
  }

  await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    ...abandonToUpsert,
    demande: {
      ...abandonToUpsert.demande,
      rejet: {
        rejetéLe: rejetéLe,
        rejetéPar: rejetéPar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Abandon.StatutAbandon.rejeté.statut,
    misÀJourLe: rejetéLe,
  });
};
