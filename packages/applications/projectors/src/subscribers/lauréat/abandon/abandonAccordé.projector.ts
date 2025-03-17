import { Abandon } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonAccordéProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Abandon.AbandonAccordéEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      accord: {
        accordéLe: accordéLe,
        accordéPar: accordéPar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Abandon.StatutAbandon.accordé.statut,
    misÀJourLe: accordéLe,
  });
};
