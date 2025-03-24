import { Éliminé } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursAccordéProjector = async ({
  payload: {
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Éliminé.Recours.RecoursAccordéEvent) => {
  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    demande: {
      accord: {
        accordéLe: accordéLe,
        accordéPar: accordéPar,
        réponseSignée: {
          format: format,
        },
      },
    },
    statut: Éliminé.Recours.StatutRecours.accordé.value,
    misÀJourLe: accordéLe,
  });
};
