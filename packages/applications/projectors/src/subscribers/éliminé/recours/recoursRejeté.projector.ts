import { Éliminé } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursRejetéProjector = async ({
  payload: {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
  },
}: Éliminé.Recours.RecoursRejetéEvent) => {
  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    demande: {
      rejet: {
        rejetéLe: rejetéLe,
        rejetéPar: rejetéPar,
        réponseSignée: {
          format: format,
        },
      },
    },
    statut: Éliminé.Recours.StatutRecours.rejeté.value,
    misÀJourLe: rejetéLe,
  });
};
