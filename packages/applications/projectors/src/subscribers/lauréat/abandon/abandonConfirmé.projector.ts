import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonConfirméProjector = async ({
  payload: { identifiantProjet, confirméLe, confirméPar },
}: Lauréat.Abandon.AbandonConfirméEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      confirmation: {
        confirméLe,
        confirméPar,
      },
    },
    statut: Lauréat.Abandon.StatutAbandon.confirmé.statut,
    miseÀJourLe: confirméLe,
  });
};
