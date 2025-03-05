import { Abandon } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const abandonRejetéProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Abandon.AbandonRejetéEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
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
