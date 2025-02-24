import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const abandonConfirméProjector = async ({
  payload: { identifiantProjet, confirméLe, confirméPar },
}: Abandon.AbandonConfirméEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'abandonConfirméProjector',
    });
    return;
  }

  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      ...abandonToUpsert.demande,
      confirmation: {
        ...abandonToUpsert.demande.confirmation!,
        confirméLe: confirméLe,
        confirméPar: confirméPar,
      },
    },
    statut: Abandon.StatutAbandon.confirmé.statut,
    misÀJourLe: confirméLe,
  });
};
