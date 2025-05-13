import { Abandon } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
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
    statut: Lauréat.Abandon.StatutAbandon.confirmé.statut,
    misÀJourLe: confirméLe,
  });
};
