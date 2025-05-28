import { Lauréat } from '@potentiel-domain/projet';
import { AbandonBen } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonRejetéProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.Abandon.AbandonRejetéEvent) => {
  await updateOneProjection<AbandonBen.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      rejet: {
        rejetéLe,
        rejetéPar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Lauréat.Abandon.StatutAbandon.rejeté.statut,
    misÀJourLe: rejetéLe,
  });
};
