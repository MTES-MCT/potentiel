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
        accordéLe,
        accordéPar,
        réponseSignée: {
          format,
        },
      },
    },
    statut: Éliminé.Recours.StatutRecours.accordé.value,
    miseÀJourLe: accordéLe,
  });
};
