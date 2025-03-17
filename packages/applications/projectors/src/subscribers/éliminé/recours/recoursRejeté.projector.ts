import { Recours } from '@potentiel-domain/elimine';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursRejetéProjector = async ({
  payload: {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
  },
}: Recours.RecoursRejetéEvent) => {
  await updateOneProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    demande: {
      rejet: {
        rejetéLe: rejetéLe,
        rejetéPar: rejetéPar,
        réponseSignée: {
          format: format,
        },
      },
    },
    statut: Recours.StatutRecours.rejeté.value,
    misÀJourLe: rejetéLe,
  });
};
