import { Abandon } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const abandonConfirméProjector = async ({
  payload: { identifiantProjet, confirméLe, confirméPar },
}: Abandon.AbandonConfirméEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      confirmation: {
        confirméLe: confirméLe,
        confirméPar: confirméPar,
      },
    },
    statut: Abandon.StatutAbandon.confirmé.statut,
    misÀJourLe: confirméLe,
  });
};
