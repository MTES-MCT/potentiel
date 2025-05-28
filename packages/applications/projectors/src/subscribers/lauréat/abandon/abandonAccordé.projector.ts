import { AbandonBen } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonAccordéProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Lauréat.Abandon.AbandonAccordéEvent) => {
  await updateOneProjection<AbandonBen.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      accord: {
        accordéLe,
        accordéPar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Lauréat.Abandon.StatutAbandon.accordé.statut,
    misÀJourLe: accordéLe,
  });
};
