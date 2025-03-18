import { Abandon } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const confirmationAbandonDemandéeProjector = async ({
  payload: { identifiantProjet, confirmationDemandéeLe, confirmationDemandéePar, réponseSignée },
}: Abandon.ConfirmationAbandonDemandéeEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      confirmation: {
        demandéeLe: confirmationDemandéeLe,
        demandéePar: confirmationDemandéePar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Abandon.StatutAbandon.confirmationDemandée.statut,
    misÀJourLe: confirmationDemandéeLe,
  });
};
