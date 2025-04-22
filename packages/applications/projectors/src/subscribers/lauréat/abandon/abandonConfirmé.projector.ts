import { Abandon } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonConfirméProjector = async ({
  payload: { identifiantProjet, confirméLe, confirméPar },
}: Abandon.AbandonConfirméEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      confirmation: {
        confirméLe,
        confirméPar,
      },
    },
    statut: Abandon.StatutAbandon.confirmé.statut,
    misÀJourLe: confirméLe,
  });
};
