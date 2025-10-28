import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const confirmationAbandonDemandéeProjector = async ({
  payload: { identifiantProjet, confirmationDemandéeLe, confirmationDemandéePar, réponseSignée },
}: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      confirmation: {
        demandéeLe: confirmationDemandéeLe,
        demandéePar: confirmationDemandéePar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Lauréat.Abandon.StatutAbandon.confirmationDemandée.statut,
    miseÀJourLe: confirmationDemandéeLe,
  });
};
